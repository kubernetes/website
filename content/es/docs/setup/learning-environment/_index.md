---
title: Entorno de aprendizaje
content_type: concept
weight: 20
---

<!-- overview -->

Si estás aprendiendo Kubernetes, necesitas un lugar para practicar. Esta página explica tus opciones para configurar un entorno de Kubernetes donde puedas experimentar y aprender.

<!-- body -->

## Instalar kubectl

Antes de configurar un clúster, necesitas la herramienta de línea de comandos `kubectl`. Esta herramienta te permite comunicarte con un clúster de Kubernetes y ejecutar comandos en él.

Consulta [Instalar y configurar kubectl](/es/docs/tasks/tools/#kubectl) para obtener instrucciones de instalación.

## Configurar entornos locales de Kubernetes

Ejecutar Kubernetes localmente te brinda un entorno seguro para aprender y experimentar. Puedes configurar y eliminar clústeres sin preocuparte por los costos o por afectar los sistemas de producción.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) ejecuta clústeres de Kubernetes utilizando contenedores Docker como nodos. Es liviano y está diseñado específicamente para probar Kubernetes en sí, pero también funciona muy bien para el aprendizaje.

Para comenzar con kind, consulta el [Inicio rápido de kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) ejecuta un clúster de Kubernetes de un solo nodo en tu máquina local. Admite múltiples entornos de ejecución de contenedores y funciona en Linux, macOS y Windows.

Para comenzar con minikube, consulta la guía [Comenzar con minikube](https://minikube.sigs.k8s.io/docs/start/).

### Otras opciones locales

{{% thirdparty-content single="true" %}}

Existen varias herramientas de terceros que también pueden ejecutar Kubernetes localmente. Kubernetes no ofrece soporte para estas herramientas, pero pueden funcionar bien para tus necesidades de aprendizaje:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) puede ejecutar un clúster local de Kubernetes
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) puede ejecutar un clúster local de Kubernetes
- [Rancher Desktop](https://docs.rancherdesktop.io/) proporciona Kubernetes en tu escritorio
- [MicroK8s](https://canonical.com/microk8s) ejecuta un clúster de Kubernetes liviano
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) ejecuta un clúster mínimo de OpenShift localmente (OpenShift cumple con la conformidad de Kubernetes)

Consulta la documentación de cada herramienta para obtener instrucciones de configuración y soporte.

## Uso de entornos interactivos en línea

{{% thirdparty-content single="true" %}}

Los entornos interactivos de Kubernetes en línea te permiten probar Kubernetes sin instalar nada en tu computadora. Estos entornos se ejecutan en tu navegador web:

- **[Killercoda](https://killercoda.com/kubernetes)** proporciona escenarios interactivos de Kubernetes y un entorno de pruebas

Estas plataformas son útiles para experimentos rápidos y para seguir tutoriales sin necesidad de una configuración local.

## Práctica con clústeres similares a producción

Si deseas practicar la configuración de un clúster más parecido al de producción, puedes utilizar **kubeadm**. Configurar un clúster con kubeadm es una tarea avanzada que requiere múltiples máquinas (físicas o virtuales) y una configuración cuidadosa.

Para aprender sobre entornos de producción, consulta [Entorno de producción](/es/docs/setup/production-environment/).

{{< note >}}
Configurar un clúster similar a producción es significativamente más complejo que los entornos de aprendizaje descritos anteriormente. Comienza primero con kind, minikube o un entorno interactivo en línea.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Sigue el tutorial de [Hello Minikube](/es/docs/tutorials/hello-minikube/) para desplegar tu primera aplicación
- Conoce los [Componentes de Kubernetes](/es/docs/concepts/overview/components/)
- Explora los [Comandos de kubectl](/es/docs/reference/kubectl/)
