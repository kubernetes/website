---
reviewers: 
- glo-pena
title: Comunicación Nodo-Maestro
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Este documento cataloga las diferentes vías de comunicación entre el nodo máster (en realidad el apiserver) y el clúster de Kubernetes. La intención es permitir a los usuarios personalizar sus instalaciones para proteger sus configuraciones de red de forma que el clúster pueda ejecutarse en una red insegura. (o en un proveedor de servicios en la nube con direcciones IP públicas)

{{% /capture %}}

{{% capture body %}}

### Clúster a Máster
 
Todos los canales de comunicación desde el clúster hacia el máster terminan en el apiserver (ningún otro componente del máster está diseñado para exponer servicios remotos). En un despliegue típico, el apiserver está configurado para escuchar conexiones remotas en un canal seguro cómo HTTPS en el puerto (443) con una o más formas de [autenticación de clientes](/docs/reference/access-authn-authz/authentication/) habilitada. Una o más formas de [autorización](/docs/reference/access-authn-authz/authorization/) deberían ser habilitadas, especialmente si se permiten [peticiones anónimas](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
o [tokens de cuenta de servicio](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

Los nodos deben ser aprovisionados con el certificado raíz público del clúster de forma que puedan conectar de forma segura con el apiserver en conjunción con credenciales de cliente válidas. Por ejemplo, en un despliegue por defecto en GKE, las credenciales de cliente proporcionadas al kubelet están en la forma de certificados de cliente. Accede [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) para ver cómo aprovisionar certificados de cliente de forma automática.

Aquellos Pods que deseen conectar con el apiserver pueden hacerlo de forma segura a través de una cuenta de servicio, de esta forma Kubernetes inserta de forma automática el certificado raíz público y un bearer token válido en el pod cuando este es instanciado. El servicio `kubernetes` (en todos los namespaces) se configura con una dirección IP virtual que es redireccionada (via kube-proxy) al punto de acceso HTTPS en el apiserver.

Los componentes máster también se comunican con el apiserver del clúster a través de un puerto seguro.

Como resultado, el modo de operación por defecto para conexiones desde el clúster (nodos y pods ejecutándose en nodos) al máster es seguro por defecto y puede correr en redes públicas y/o inseguras.

## Máster a Clúster

Hay dos vías de comunicación primaria desde el máster (apiserver) al clúster. La primera es desde el apiserver al proceso kubelet que se ejecuta en cada nodo del clúster. La segunda es desde el apiserver a cualquier nodo, pod, o servicio a través de la funcionalidad proxy del apiserver.

### apiserver al kubelet

Las conexiones del apiserver al kubelet se utilizan para:

  * Recoger entradas de registro de pods.
  * Conectar (a través de `kubectl`) con pods en ejecución.
  * Facilitar la funcionalidad `port-forwarding` del kubelet.

Estas conexiones terminan en el endpoint HTTPS del kubelet. Por defecto, el apiserver no verifica el certificado del kubelet, por lo que la conexión es vulnerable a ataques del tipo `man-in-the-middle`, e **insegura** para conectar a través de redes públicas o de no confianza.

Para verificar esta conexión, se utiliza el atributo `--kubeket-certificate-authority` que provee el apiserver con un certificado raíz con el que verificar el certificado del kubelet.
Si esto no es posible, se utiliza un [túnel SSH](/docs/concepts/architecture/master-node-communication/#ssh-tunnels) entre el apiserver y el kubelet para conectar a través de redes públicas o de no confianza.

Finalmente, [autenticación y/o autorización al kubelet](/docs/admin/kubelet-authentication-authorization/) debe ser habilitada para proteger su API.

### apiserver a nodos, pods y servicios

Las conexiones desde el apiserver a un nodo, pod o servicio se realizan por defecto con HTTP y, por consiguiente, no son autentificadas o encriptadas. Pueden ser ejecutadas en una conexión HTTPS segura añadiendo el prefijo `https:` al nodo, pod o nombre de servicio en la API URL, pero los receptores no validan el certificado provisto por el endpoint HTTPS ni facilitan credenciales de cliente asi que, aunque la conexión esté encriptada, esta no ofrece garantía de integridad. Estas conexiones **no son seguras** para conectar a través de redes públicas o inseguras.  

### Túneles SSH

Kubernetes ofrece soporte para túneles SSH que protegen la comunicación  Máster -> Clúster. En este modo de configuración, el apiserver inicia un túnel SSH a cada nodo en el clúster (conectando al servidor SSH en el puerto 22) y transfiere todo el tráfico destinado a un kubelet, nodo, pod o servicio a través del túnel. El túnel garantiza que dicho tráfico no es expuesto fuera de la red en la que se ejecutan los nodos.

Los túneles SSH se consideran obsoletos, y no deberían utilizarse a menos que se sepa lo que se está haciendo. Se está diseñando un reemplazo para este canal de comunicación.

{{% /capture %}}