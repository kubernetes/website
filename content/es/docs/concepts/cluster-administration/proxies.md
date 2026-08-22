---
title: Proxies en Kubernetes
content_type: concept
weight: 100
---

<!-- overview -->
Esta página explica los proxies que se utilizan con Kubernetes.


<!-- body -->

## Proxies

Existen varios proxies distintos que puedes encontrar al usar Kubernetes:

1.  El [proxy de kubectl](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - se ejecuta en el escritorio de un usuario o en un Pod
    - hace de proxy entre una dirección localhost y el apiserver de Kubernetes
    - la conexión del cliente al proxy usa HTTP
    - la conexión del proxy al apiserver usa HTTPS
    - localiza el apiserver
    - añade cabeceras de autenticación

1.  El [proxy del apiserver](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - es un bastión incorporado en el apiserver
    - conecta a un usuario de fuera del clúster con las IPs del clúster, que de otro modo podrían no ser accesibles
    - se ejecuta dentro de los procesos del apiserver
    - la conexión del cliente al proxy usa HTTPS (o HTTP si el apiserver está configurado así)
    - la conexión del proxy al destino puede usar HTTP o HTTPS, según lo que elija el proxy con la información disponible
    - se puede usar para llegar a un nodo, un Pod o un Service
    - hace balanceo de carga cuando se usa para llegar a un Service

1.  El [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - se ejecuta en cada nodo
    - hace de proxy para UDP, TCP y SCTP
    - no entiende HTTP
    - proporciona balanceo de carga
    - solo se usa para llegar a los servicios

1.  Un proxy o balanceador de carga delante de uno o varios apiservers:

    - su existencia e implementación varían de un clúster a otro (por ejemplo, nginx)
    - se sitúa entre todos los clientes y uno o varios apiservers
    - actúa como balanceador de carga si hay varios apiservers.

1.  Balanceadores de carga en la nube para servicios externos:

    - los proporcionan algunos proveedores de nube (por ejemplo, AWS ELB o Google Cloud Load Balancer)
    - se crean automáticamente cuando el Service de Kubernetes es de tipo `LoadBalancer`
    - por lo general solo admiten UDP y TCP
    - la compatibilidad con SCTP depende de la implementación del balanceador de carga del proveedor de nube
    - la implementación varía según el proveedor de nube.

Normalmente, los usuarios de Kubernetes solo necesitan preocuparse por los dos primeros tipos. Del resto suele
encargarse el administrador del clúster, que se asegura de que estén configurados correctamente.

## Solicitar redirecciones

Los proxies han reemplazado las capacidades de redirección. Las redirecciones están obsoletas.
