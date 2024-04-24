---
title: Container Runtime Interface (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

_CRI_ es una interfaz de plugin que permite que kubelet use una amplia variedad de
container runtimes, sin necesidad de volver a compilar los componentes del clúster.

Necesitas un
_{{<glossary_tooltip text="container runtime" term_id="container-runtime">}}_ ejecutándose en
cada Nodo en tu clúster, de manera que
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} pueda iniciar los
{{<glossary_tooltip text="Pods" term_id="pod">}} y sus contenedores.

{{<glossary_definition prepend="Container Runtime Interface (CRI) es" term_id="container-runtime-interface" length="all">}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet actúa como un cliente cuando se conecta al _runtime_ del contenedor a través de gRPC.
El _runtime_ y los _endpoints_ del servicio de imágenes deben estar disponibles en el _runtime_ del contenedor,
que se puede configurar por separado dentro de kubelet usando
`--image-service-endpoint` [banderas de línea de comando](/docs/reference/command-line-tools-reference/kubelet).

Para Kubernetes v{{< skew currentVersion >}}, kubelet prefiere usar CRI `v1`.
Si el _runtime_ del contenedor no es compatible con `v1` del CRI, kubelet intenta
negociar cualquier versión compatible anterior.
Kubelet v{{< skew currentVersion >}} también puede negociar CRI `v1alpha2`, pero
esta versión se considera obsoleta.
Si kubelet no puede negociar una versión CRI soportada, kubelet se da por vencido
y no se registra como nodo.

## Actualizando

Al actualizar Kubernetes, kubelet intenta seleccionar automáticamente la
última versión de CRI al reiniciar el componente. Si eso falla, entonces la alternativa
se llevará a cabo como se mencionó anteriormente. Si se requirió una rellamada de gRPC porque el
_runtime_ del contenedor se ha actualizado, entonces el _runtime_ del contenedor también debe
soportar la versión seleccionada inicialmente o se espera que la rellamada falle. Esto
requiere un reinicio de kubelet.

## {{% heading "whatsnext" %}}

- Más información sobre CRI [definición de protocolo](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
