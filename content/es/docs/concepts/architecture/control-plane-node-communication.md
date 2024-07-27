---
title: Comunicación entre Nodos y el Plano de Control
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

Este documento cataloga las diferentes vías de comunicación entre el {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} y el {{< glossary_tooltip text="clúster" term_id="cluster" length="all" >}} de Kubernetes.
La intención es permitir a los usuarios personalizar sus instalaciones para proteger sus configuraciones de red de forma que el clúster pueda ejecutarse en una red insegura (o en un proveedor de servicios en la nube con direcciones IP públicas)

<!-- body -->

## Nodo al Plano de Control

La API de Kubernetes usa el patrón de "hub-and-spoke". Todo uso de la API desde los nodos (o los pods que ejecutan) termina en el servidor API. Ninguno de los otros componentes del plano de control está diseñado para exponer servicios remotos. El servidor API está configurado para escuchar conexiones remotas en un puerto seguro HTTPS (normalmente 443) con una o más formas de
[autenticación](/docs/reference/access-authn-authz/authentication/) de cliente habilitada.
Una o más formas de [autorización](/docs/reference/access-authn-authz/authorization/) deben ser
habilitadas, especialmente si las [peticiones anónimas](/docs/reference/access-authn-authz/authentication/#anonymous-requests) o los [tokens de cuenta de servicio](/docs/reference/access-authn-authz/authentication/#service-account-tokens) están permitidos.

Los nodos deben ser aprovisionados con el {{< glossary_tooltip text="certificado" term_id="certificate" >}} raíz público del clúster, de modo que puedan
conectarse de forma segura al servidor API en conjunto con credenciales de cliente válidas. Un buen enfoque es que las credenciales de cliente proporcionadas al kubelet estén en forma de certificado de cliente. Véase el [TLS bootstrapping de kubelet](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) para ver cómo aprovisionar certificados de cliente kubelet de forma automática.

Los {{< glossary_tooltip text="Pods" term_id="pod" >}} que deseen conectar con el apiserver pueden hacerlo de forma segura a través de una cuenta de servicio, de esta forma Kubernetes inserta de forma automática el certificado raíz público y un bearer token válido en el pod cuando es instanciado. El servicio `kubernetes` (en todos los namespaces) se configura con una dirección IP virtual que es redireccionada (via `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) al punto de acceso HTTPS en el apiserver.

Los componentes del plano de control también se comunican con el apiserver del clúster a través de un puerto seguro.

Como resultado, el modo de operación para las conexiones desde los nodos y pods que se ejecutan en los nodos al plano de control es seguro por defecto y puede ejecutarse en redes públicas y/o inseguras.

## Plano de control al nodo

Hay dos vías de comunicación primaria desde el plano de control (apiserver) y los nodos. La primera es desde el apiserver al proceso {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} que se ejecuta en cada nodo del clúster. La segunda es desde el apiserver a cualquier nodo, pod o servicio a través de la funcionalidad _proxy_ del apiserver.


### Apiserver al kubelet

Las conexiones del apiserver al kubelet se utilizan para:

  * Recoger entradas de registro de pods.
  * Conectar (a través de `kubectl`) con pods en ejecución.
  * Facilitar la funcionalidad `port-forwarding` del kubelet.

Estas conexiones terminan en el endpoint HTTPS del kubelet. Por defecto, el apiserver no verifica el certificado del kubelet, por lo que la conexión es vulnerable a ataques del tipo "ataque de intermediario" ("man-in-the-middle"), e **insegura** para conectar a través de redes públicas y/o no fiables.

Para verificar esta conexión, se utiliza el atributo `--kubelet-certificate-authority` que provee el apiserver con un certificado raíz con el que verificar el certificado del kubelet.

Si esto no es posible, se utiliza un [túnel SSH](#ssh-tunnels) entre el apiserver y el kubelet para conectar a través de redes públicas o de no confianza.

Finalmente, la [autenticación y/o autorización al kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/) debe ser habilitada para proteger la API de kubelet.

### Apiserver para nodos, pods y servicios

Las conexiones desde el apiserver a un nodo, pod o servicio se realizan por defecto con conexiones HTTP simples y, por consiguiente, no son autenticadas o encriptadas. Pueden ser ejecutadas en una conexión segura HTTPS con el prefijo `https:` al nodo, pod o nombre de servicio en la URL de la API, pero no validarán el certificado proporcionado por el punto final HTTPS ni proporcionarán las credenciales del cliente. Por tanto, aunque la conexión estará cifrada, no proporcionará ninguna garantía de integridad. Estas conexiones **no son actualmente seguras** para ejecutarse en redes públicas o no fiables.

### Túneles SSH {#ssh-tunnels}

Kubernetes ofrece soporte para [túneles SSH](https://www.ssh.com/academy/ssh/tunneling) que protegen la comunicación entre el plano de control y los nodos. En este modo de configuración, el apiserver inicia un túnel SSH a cada nodo en el clúster (conectando al servidor SSH en el puerto 22) y transfiere todo el tráfico destinado a un kubelet, nodo, pod o servicio a través del túnel. El túnel garantiza que dicho tráfico no es expuesto fuera de la red en la que se ejecutan los nodos.

{{< note >}}
Los túneles SSH están actualmente obsoletos, por lo que no deberías optar por utilizarlos a menos que sepas lo que
estás haciendo. El [Konnectivity service](#konnectivity-service) es un sustituto de este canal de comunicación.
{{< /note >}}

### Servicio Konnectivity

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

En sustitución de los túneles SSH, el servicio Konnectivity proporciona un proxy de nivel TCP para la comunicación entre el plano de control y el clúster. El servicio Konnectivity consta de dos partes: el servidor Konnectivity en la red del plano de control y los agentes Konnectivity en la red de nodos.

Los agentes Konnectivity inician conexiones con el servidor Konnectivity y mantienen las conexiones de red.
Tras habilitar el servicio Konnectivity, todo el tráfico del plano de control a los nodos pasa por estas conexiones.

Sigue la [Tarea del servicio Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/) para configurar
el servicio Konnectivity en tu clúster.

## {{% heading "whatsnext" %}}

* [Componentes del plano de control de Kubernetes](/docs/concepts/overview/components/#control-plane-components)
* Más información sobre el [modelo Hubs y Spoke](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* [Cómo proteger un clúster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* Más información sobre la [API de Kubernetes](/docs/concepts/overview/kubernetes-api/)
* [Configurar el Servicio Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* Utilizar el [Port Forwarding para acceder a aplicaciones en un clúster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Aprenda [Fetch logs para Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [use kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)