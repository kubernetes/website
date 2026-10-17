---
title: Interfaz del entorno de ejecución de contenedores (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

La CRI (Container Runtime Interface) es una interfaz de plugins que permite al kubelet utilizar una amplia variedad de
entornos de ejecución de contenedores, sin necesidad de recompilar los componentes del clúster.

Necesitas un
{{<glossary_tooltip text="entorno de ejecución de contenedores" term_id="container-runtime">}} que funcione en
cada Nodo de tu clúster, para que el
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} pueda iniciar
{{< glossary_tooltip text="Pods" term_id="pod" >}} y sus contenedores.

{{< glossary_definition prepend="La Interfaz del entorno de ejecución de contenedores (CRI) es" term_id="cri" length="all" >}}

<!-- body -->

## La API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

El kubelet actúa como cliente cuando se conecta al entorno de ejecución de contenedores mediante gRPC.
Los endpoints de los servicios de ejecución e imagen deben estar disponibles en el entorno de ejecución
de contenedores, los cuales pueden configurarse por separado dentro del kubelet mediante el
[parámetro de línea de comandos](/es/docs/reference/command-line-tools-reference/kubelet/)
`--container-runtime-endpoint`.

Para Kubernetes v1.26 y versiones posteriores, el kubelet requiere que el entorno de ejecución de contenedores
sea compatible con la API CRI `v1`. Si un entorno de ejecución de contenedores no admite la API `v1`,
el kubelet no registrará el nodo.

## Actualización {#upgrading}

Al actualizar la versión de Kubernetes en un nodo, el kubelet se reinicia. Si el
entorno de ejecución de contenedores no admite la API CRI `v1`, el kubelet fallará al
registrarse y notificará un error. Si se requiere una reconexión gRPC porque el entorno de
ejecución de contenedores ha sido actualizado, dicho entorno debe admitir la API CRI `v1` para
que la conexión tenga éxito. Esto puede requerir reiniciar el kubelet después de que el
entorno de ejecución de contenedores esté configurado correctamente.

## Streaming de listas {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

Las RPCs estándar de listado de la CRI (`ListContainers`, `ListPodSandbox`, `ListImages`) devuelven
todos los resultados en una única respuesta unaria. En nodos con una gran cantidad de contenedores
(por ejemplo, más de aproximadamente 10.000, incluyendo tanto en ejecución como detenidos), estas
respuestas pueden superar el límite de tamaño de mensaje predeterminado de gRPC de 16 MiB, provocando
que el kubelet falle al conciliar el estado con el entorno de ejecución de contenedores.

Con el feature gate `CRIListStreaming` habilitado, el kubelet utiliza RPCs de streaming en el lado
del servidor (como `StreamContainers`, `StreamPodSandboxes`, `StreamImages`) que permiten al entorno
de ejecución de contenedores dividir los resultados en múltiples mensajes de respuesta, evitando el
límite de tamaño por mensaje. Esto resulta especialmente útil para:

- Entornos con alta rotación de contenedores (sistemas CI/CD)
- Cargas de trabajo de procesamiento por lotes a gran escala

Si el entorno de ejecución de contenedores no admite RPCs de streaming, el kubelet
recurre automáticamente a las RPCs unarias estándar para mantener la compatibilidad con versiones anteriores.

## {{% heading "whatsnext" %}}

- Obtén más información sobre la [definición del protocolo](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto) de CRI
