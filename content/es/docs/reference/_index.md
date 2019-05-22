---
title: Referencia
approvers:
- raelga
linkTitle: "Referencia"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

Esta sección de la documentación de Kubernetes contiene información de referencia.

{{% /capture %}}

{{% capture body %}}

## Información de referencia sobre la API

* [Descripción general de la API de Kubernetes](/docs/reference/using-api/api-overview/)
* Documentación de referencia de las últimas versiones de la API de Kubernetes:
  * [1.14](/docs/reference/generated/kubernetes-api/v1.14/)
  * [1.13](/docs/reference/generated/kubernetes-api/v1.13/)
  * [1.12](/docs/reference/generated/kubernetes-api/v1.12/)
  * [1.11](/docs/reference/generated/kubernetes-api/v1.11/)
  * [1.10](/docs/reference/generated/kubernetes-api/v1.10/)

## Librerías de cliente para la API

Para llamar a la API de Kubernetes desde un lenguaje de programación, puedes usar
[librerías de cliente](/docs/reference/using-api/client-libraries/).

En estos momento, las librerías con soporte oficial son:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)

## Información de referencia sobre la CLI

* [kubectl](/docs/user-guide/kubectl-overview) - Utilidad CLI para ejecutar comandos y administrar clústeres de Kubernetes.
    * [JSONPath](/docs/user-guide/jsonpath/) - Guía de sintaxis para el uso de [expresiones JSONPath](http://goessner.net/articles/JsonPath/) con kubectl.
* [kubeadm](/docs/admin/kubeadm/) - Utilidad CLI para aprovisionar fácilmente un clústeres Kubernetes seguro.
* [kubefed](/docs/admin/kubefed/) - Utilidad CLI para ayudarte a administrar tus clústeres federados.

## Información de referencia sobre la configuración

* [kubelet](/docs/admin/kubelet/) - El principal *agente* que se ejecuta en cada nodo. El kubelet toma un conjunto de PodSpecs y asegura que los contenedores descritos estén funcionando y en buen estado.
* [kube-apiserver](/docs/admin/kube-apiserver/) - API REST que valida y configura datos para objetos API como pods, servicios, controladores de replicación, ...
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Demonio que integra los bucles de control enviados con Kubernetes.
* [kube-proxy](/docs/admin/kube-proxy/) - Puede hacer fowarding simple o con round-robin de TCP/UDP a través de un conjunto de back-ends.
* [kube-scheduler](/docs/admin/kube-scheduler/) - Planificador que gestiona la disponibilidad, el rendimiento y la capacidad.
* [federation-apiserver](/docs/admin/federation-apiserver/) - Servidor API para clusters federados.
* [federation-controller-manager](/docs/admin/federation-controller-manager/) - Demonio que integra los bucles de control enviados con la federación Kubernetes.

## Documentos de diseño

Un archivo de los documentos de diseño para la funcionalidad de Kubernetes.

Puedes empezar por [Arquitectura de Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) y [Vista general del diseño de Kubernetes](https://git.k8s.io/community/contributors/design-proposals).

{{% /capture %}}
