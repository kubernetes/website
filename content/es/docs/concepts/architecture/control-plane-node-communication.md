---
reviewers:
- dchen1107
- liggitt
title: Communication between Nodes and the Control Plane
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->
Este documento cataloga las rutas de comunicación entre el servidor {{< glossary_tooltip term_id="kube-apiserver" text="servidor API" >}} y el {{< glossary_tooltip text="clúster" term_id="cluster" length="all" >}} de Kubernetes. El objetivo es permitir a los usuarios personalizar su instalación para reforzar la configuración de la red de tal manera que el clúster pueda ejecutarse en una red no confiable (o en IPs públicas completas en un proveedor de servicios en la nube).

<!-- body -->

## Nodo a Plano de Control

Kubernetes tiene un patrón de API "hub-and-spoke" (centro y conexiones). Todo uso de la API desde los nodos (o los pods que ejecutan) termina en el servidor API. Ninguno de los otros componentes del plano de control está diseñado para exponer servicios remotos. El servidor API está configurado para escuchar conexiones remotas en un puerto HTTPS seguro (típicamente el 443) con una o más formas de
[autenticación](/docs/reference/access-authn-authz/authentication/) de cliente habilitadas.

Se debe habilitar una o mas formas de [autorizacion](/docs/reference/access-authn-authz/authorization/), especialmente si se permiten [requests anónimos](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
o [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

Los nodos debe ser aprovisionados con el {{< glossary_tooltip text="certificado" term_id="certificate" >}} raíz público del clúster para que puedan conectar de manera segura al API server junto con credenciales de cliente válidas. Un buen enfoque es que las credenciales del cliente proporcionadas al kubelet estén en forma de un certificado de cliente. Consulta [kubelet TLS bootstrapping] (/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) para la provisión automatizada de certificados de cliente del kubelet.

{{< glossary_tooltip text="Pods" term_id="pod" >}} que deseen conectarse al servidor API pueden hacerlo de manera segura aprovechando una cuenta de servicio para que Kubernetes inyecte automáticamente el certificado raíz público y un token portador válido en el pod cuando éste es instanciado. El servicio  `kubernetes` (en el namespace `default`)  está configurado con una dirección IP virtual que es redirigida (a través de {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}) al punto final HTTPS en el servidor API.

Los componentes del plano de control se comunican con el servidor API a través del puerto seguro.

Como resultado, el modo de operación predeterminado para las conexiones desde los nodos y el pod que se ejecutan en los nodos hacia el plano de control está asegurado por defecto y puede funcionar sobre redes no confiables y/o públicas.

## Plano de control al nodo

Existen dos formas de comunicación primarias desde el plano de control (el servidor API) hacia los nodos. El primero es desde el servidor API hasta el proceso {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} que se ejecuta en cada nodo del clúster. El segundo es desde el servidor API hacia cualquier nodo, pod o servicio a través de la funcionalidad de proxy del servidor API.


### Servidor API a kubelet

Las conexiones desde el servidor API al kubelet se utilizan para:

* Obtener registros de los pods.
* Conectarse (generalmente a través de `kubectl`) a pods en ejecución.
* Proporcionar la funcionalidad de reenvío de puertos del kubelet.

Estas conexiones terminan en el punto final HTTPS del kubelet. Por defecto, el servidor API no verifica el certificado de servicio del kubelet, lo que hace que la conexión esté sujeta a ataques de intermediario y sea insegura para ejecutarse sobre redes no confiables y/o públicas.

Para verificar esta conexión, usa la bandera `--kubelet-certificate-authority` para proporcionar al servidor API un paquete de certificados raíz para usar en la verificación del certificado de servicio del kubelet.

Si eso no es posible, usa [túneles SSH](#tuneles-ssh) entre el servidor API y el kubelet si es necesario para evitar conectarse a través de una red no confiable o pública.

Finalmente, se debe habilitar la [autenticación y/o autorización del Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/) para asegurar el API del servicio de kubelet  

### Servidor API a nodos, pods y servicios

Las conexiones desde el servidor API a un nodo, pod o servicio por defecto son conexiones HTTP simples y, por lo tanto, no están autenticadas ni cifradas. Pueden ejecutarse sobre una conexión HTTPS segura anteponiendo `https:` al nombre del nodo, pod o servicio en la URL de la API, pero no validarán el certificado proporcionado por el punto final HTTPS ni proporcionarán credenciales de cliente. Así que, aunque la conexión estará cifrada, no ofrecerá garantías de integridad. Estas conexiones **actualmente no son seguras** para ejecutarse sobre redes no confiables o públicas.

### Tuneles SSH

Kubernetes soporta túneles SSH para proteger los caminos de comunicación del plano de control a los nodos. En esta configuración, el servidor API inicia un túnel SSH a cada nodo en el clúster (conectándose al servidor SSH que escucha en el puerto 22) y pasa todo el tráfico destinado a un kubelet, nodo, pod o servicio a través del túnel.
Este túnel asegura que el tráfico no esté expuesto fuera de la red en la que se están ejecutando los nodos.





{{< note >}}
Los túneles SSH están actualmente deprecados, por lo que no deberías optar por usarlos a menos que sepas lo que estás haciendo. El [servicio Konnectivity](#servicio-konnectivity) es un reemplazo para este canal de comunicación.
{{< /note >}}

### Servicio Konnectivity 

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Como reemplazo de los túneles SSH, el servicio de Konnectivity proporciona un proxy a nivel de TCP para la comunicación del plano de control con el clúster. El servicio de Konnectivity consta de dos partes: el servidor de Konnectivity en la red del plano de control y los agentes de Konnectivity en la red de los nodos. Los agentes de Konnectivity inician conexiones al servidor de Konnectivity y mantienen las conexiones de red.
Después de habilitar el servicio de Konnectivity, todo el tráfico del plano de control a los nodos pasa a través de estas conexiones.

Sigue la [tarea del Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/) para configurar el servicio de Konnectivity en tu clúster.

## {{% heading "whatsnext" %}}

* Leer más sobre los [componentes del plano de control de Kubernetes ](/es/docs/concepts/overview/components/#componentes-del-plano-de-control)
* Aprender más del [modelo Hubs and Spoke ](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Aprende cómo [Asegurar un Clúster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* Aprende más acerca de la [API de Kubernetes](/docs/concepts/overview/kubernetes-api/)
* [Configura el servicio de Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Utiliza el reenvío de puertos para acceder a aplicaciones en un clúster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Aprende como [Obtener los registros de los Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [usa kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)