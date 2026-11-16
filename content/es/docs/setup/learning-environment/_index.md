---
title: Entorno de aprendizaje
content_type: concept
weight: 20
---

<!-- overview -->

Si estás aprendiendo Kubernetes, necesitas un lugar para practicar. Esta página explica tus opciones para configurar un entorno de Kubernetes donde puedas experimentar y aprender.

<!-- body -->

## Instalar kubectl

Antes de que configures un clúster, necesitas la herramienta de línea de comandos `kubectl`. Esta herramienta te permite comunicarte con un clúster de Kubernetes y ejecutar comandos sobre él.

Ver [Instalar y configurar kubectl](/docs/tasks/tools/#kubectl) para instrucciones de instalación.

## Configurar entornos locales de Kubernetes

Ejecutar Kubernetes localmente te brinda un entorno seguro para aprender y experimentar. Puedes levantar y destruir clústeres sin preocuparte por los costos o afectar sistemas productivos.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) ejecuta clústeres de Kubernetes utilizando contenedores de Docker como nodos. Es liviano y diseñado específicamente para probar el propio Kubernetes, pero funciona genial para aprender también.

Para empezar con kind, mira [Inicio rápido de kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) ejecuta un clúster de Kubernetes de un solo nodo en tu máquina local. Soporta múltiples runtimes de contenedores y funciona en Linux, macOS, y Windows.

Para empezar con minikube, mira la guía [Comenzar con minikube](https://minikube.sigs.k8s.io/docs/start/).

### Otras opciones locales

{{% thirdparty-content single="true" %}}

Hay varias herramientas de terceros que también pueden ejecutar Kubernetes localmente. Kubernetes no brinda soporte para estas herramientas, pero podrían funcionar bien para aprender:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) puede ejecutar un clúster de Kubernetes local
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) puede ejecutar un clúster de Kubernetes local
- [Rancher Desktop](https://docs.rancherdesktop.io/) proporciona Kubernetes en tu máquina
- [MicroK8s](https://canonical.com/microk8s) ejecuta un clúster de Kubernetes liviano
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) ejecuta un clúster de OpenShift minimalista localmente (OpenShift es compatible con Kubernetes) 

Consulta la documentación de las herramientas para configuración y soporte.

## Utilizar playgrounds en línea

{{% thirdparty-content single="true" %}}

Los playgrounds de Kubernetes en línea te permiten probar Kubernetes sin instalar nada en tu computadora. Estos entornos se ejecutan en tu navegador web:

- **[Killercoda](https://killercoda.com/kubernetes)** proporciona escenarios interactivos de Kubernetes y un entorno playground.

Estas plataformas son útiles para experimentos rápidos y seguir tutoriales sin una configuración local.

## Practicar con clústeres parecidos a entornos de producción

Si quisieras practicar configurando un clúster parecido a un entorno de producción, puedes utilizar **kubeadm**. Configurar un clúster con kubeadm es una tarea avanzada que requiere múltiples máquinas (físicas o virtuales) y configuración minuciosa.

Para aprender más sobre entornos de producción, mira [Entorno de producción](/docs/setup/production-environment/).

{{< note >}}
Configurar un clúster parecido a un entorno de producción es significativamente más complejo que los entornos de aprendizaje descritos anteriormente. Empieza con kind, minikube, o un playground en línea primero.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Sigue el tutorial [Hello Minikube](/docs/tutorials/hello-minikube/) para desplegar tu primera aplicación
- Aprende sobre [Componentes de Kubernetes](/docs/concepts/overview/components/)
- Explora [Comandos de kubectl](/docs/reference/kubectl/)
