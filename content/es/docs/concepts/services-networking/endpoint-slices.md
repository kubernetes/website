---
reviewers:
- freehan
title: EndpointSlices
content_type: concept
weight: 60
description: >-
  La API de EndpointSlice es el mecanismo que Kubernetes utiliza para permitir que tu Servicio
  escale para manejar un gran número de backends, y permite que el clúster actualice tu lista de 

  backends saludables eficientemente.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

La API de _EndpointSlice_ de Kubernetes proporciona una forma de rastrear los endpoints de red
dentro de un clúster Kubernetes. EndpointSlices ofrece una alternativa más escalable
y extensible a [Endpoints](/docs/concepts/services-networking/service/#endpoints).


<!-- body -->

## EndpointSlice API {#recurso-endpointslice}

En Kubernetes, un EndpointSlice contiene referencias a un conjunto de endpoints de red. El plano de control crea automáticamente EndpointSlices para cualquier Servicio de Kubernetes que tenga especificado un {{< glossary_tooltip text="selector" term_id="selector" >}}. Estos EndpointSlices incluyen referencias a todos los Pods que coinciden con el selector de Servicio. Los EndpointSlices agrupan los endpoints de la red mediante combinaciones únicas de protocolo, número de puerto y nombre de Servicio.

El nombre de un objeto EndpointSlice debe ser un 
[nombre de subdominio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
válido.

A modo de ejemplo, a continuación se muestra un objeto EndpointSlice de ejemplo, propiedad del Servicio `example`
de Kubernetes.

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

Por defecto, el plano de control crea y gestiona EndpointSlices para que no tengan más de 100 endpoints cada una. Puedes configurar esto con la bandera de funcionalidad
`--max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
hasta un máximo de 1000.


EndpointSlices puede actuar como la fuente de verdad
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} sobre cómo enrutar el tráfico interno.

### Tipos de dirección

EndpointSlices admite tres tipos de direcciones:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)

Cada objeto `EndpointSlice` representa un tipo de dirección IP específico. Si tienes un servicio disponible a través de IPv4 e IPv6, habrá al menos dos objetos `EndpointSlice` (uno para IPv4 y otro para IPv6).

### Condiciones

La API EndpointSlice almacena condiciones sobre los endpoints que pueden ser útiles para los consumidores.
Las tres condiciones son `ready`, `serving` y `terminating`.

#### Ready

`ready` es una condición que corresponde a la condición `Ready` de un Pod. Un Pod en ejecución con la condición `Ready` establecida a `True` debería tener esta condición EndpointSlice también establecida a `true`. Por razones de compatibilidad, `ready` NUNCA es `true` cuando un Pod está terminando. Los consumidores deben referirse a la condición `serving` para inspeccionar la disponibilidad de los Pods que están terminando. La única excepción a esta regla son los servicios con `spec.publishNotReadyAddresses` a `true`. Los endpoints de estos servicios siempre tendrán la condición `ready` a `true`.

#### Serving

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

La condición `serving` es casi idéntica a la condición `ready`. La diferencia es que los consumidores de la API EndpointSlice deben comprobar la condición `serving` si se preocupan por la disponibilidad del pod mientras el pod también está terminando.

{{< note >}}

Aunque `serving` es casi idéntico a `ready`, se añadió para evitar romper el significado existente de `ready`. Podría ser inesperado para los clientes existentes si `ready` pudiera ser `true` para los endpoints de terminación, ya que históricamente los endpoints de terminación nunca se incluyeron en la API Endpoints o EndpointSlice para empezar. Por esta razón, `ready` es _siempre_ `false` para los Endpoints que terminan, y se ha añadido una nueva condición `serving` en la v1.20 para que los clientes puedan realizar un seguimiento de la disponibilidad de los pods que terminan independientemente de la semántica existente para `ready`.

{{< /note >}}

#### Terminating

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

`Terminating` es una condición que indica si un endpoint está terminando. En el caso de los pods, se trata de cualquier pod que tenga establecida una marca de tiempo de borrado.

### Información sobre topología {#topology}

Cada endpoint dentro de un EndpointSlice puede contener información topológica relevante. La información de topología incluye la ubicación del endpoint e información sobre el Nodo y la zona correspondientes. Estos están disponibles en los siguientes campos por endpoint en EndpointSlices:

* `nodeName` - El nombre del Nodo en el que se encuentra este endpoint.
* `zone` - La zona en la que se encuentra este endpoint.


{{< note >}}
En la API v1, el endpoint `topology` se eliminó en favor de los campos dedicados `nodeName` y `zone`.

La configuración de campos de topología arbitrarios en el campo `endpoint` de un recurso `EndpointSlice` ha quedado obsoleta y no se admite en la API v1. En su lugar, la API v1 permite establecer campos individuales `nodeName` y `zone`. Estos campos se traducen automáticamente entre versiones de la API. Por ejemplo, el valor de la clave "topology.kubernetes.io/zone" en el campo `topology` de la API v1beta1 es accesible como campo `zone` en la API v1.
{{< /note >}}

### Administración

En la mayoría de los casos, el plano de control (concretamente, el endpoint slice {{< glossary_tooltip text="controller" term_id="controller" >}}) crea y gestiona objetos EndpointSlice. Existe una variedad de otros casos de uso para EndpointSlices, como implementaciones de servicios Mesh, que podrían dar lugar a que otras entidades o controladores gestionen conjuntos adicionales de EndpointSlices.

Para garantizar que varias entidades puedan gestionar EndpointSlices sin interferir unas con otras, Kubernetes define el parámetro
{{< glossary_tooltip term_id="label" text="label" >}}
`endpointslice.kubernetes.io/managed-by`, que indica la entidad que gestiona un EndpointSlice.
El controlador de endpoint slice establece `endpointslice-controller.k8s.io` como valor para esta etiqueta en todos los EndpointSlices que gestiona. Otras entidades que gestionen EndpointSlices también deben establecer un valor único para esta etiqueta.

### Propiedad

En la mayoría de los casos de uso, los EndpointSlices son propiedad del Servicio para el que el objeto EndpointSlices rastree los endpoints. Esta propiedad se indica mediante una referencia de propietario en cada EndpointSlice, así como una etiqueta `kubernetes.io/service-name` que permite búsquedas sencillas de todos los EndpointSlices que pertenecen a un Servicio.

### Replicación de EndpointSlice

En algunos casos, las aplicaciones crean recursos Endpoints personalizados. Para garantizar que estas aplicaciones no tengan que escribir simultáneamente en recursos Endpoints y EndpointSlice, el plano de control del clúster refleja la mayoría de los recursos Endpoints en los EndpointSlices correspondientes.


El plano de control refleja los recursos de los Endpoints a menos que: 
* El recurso Endpoints tenga una etiqueta `endpointslice.kubernetes.io/skip-mirror` con el valor en `true`.
* El recurso Endpoints tenga una anotación `control-plane.alpha.kubernetes.io/leader`.
* El recurso Service correspondiente no exista.
* El recurso Service correspondiente tiene un selector no nulo.

Los recursos Endpoints individuales pueden traducirse en múltiples EndpointSlices. Esto ocurrirá si un recurso Endpoints tiene 
múltiples subconjuntos o incluye endpoints con múltiples familias IP (IPv4 e IPv6). Se reflejará un máximo de 1000 direcciones 
por subconjunto en EndpointSlices.

### Distribución de EndpointSlices

Cada EndpointSlice tiene un conjunto de puertos que se aplica a todos los endpoints dentro del recurso. Cuando se utilizan puertos con nombre para un Servicio, los Pods pueden terminar con diferentes números de puerto de destino para el mismo puerto con nombre, requiriendo diferentes EndpointSlices. Esto es similar a la lógica detrás de cómo se agrupan los subconjuntos con Endpoints.

El plano de control intenta llenar los EndpointSlices tanto como sea posible, pero no los reequilibra activamente. La lógica es bastante sencilla:

1. Iterar a través de los EndpointSlices existentes, eliminar los endpoints que ya no se deseen y actualizar los endpoints coincidentes que hayan cambiado.
2. Recorrer los EndpointSlices que han sido modificados en el primer paso y rellenarlos con los nuevos endpoints necesarios.
3. Si aún quedan nuevos endpoints por añadir, intente encajarlos en un slice que no se haya modificado previamente y/o cree otros nuevos.

Es importante destacar que el tercer paso prioriza limitar las actualizaciones de EndpointSlice sobre una distribución perfectamente completa de EndpointSlices. Por ejemplo, si hay 10 nuevos endpoints que añadir y 2 EndpointSlices con espacio para 5 endpoints más cada uno, este enfoque creará un nuevo EndpointSlice en lugar de llenar los 2 EndpointSlices existentes. En otras palabras, es preferible una única creación de EndpointSlice que múltiples actualizaciones de EndpointSlice.

Con kube-proxy ejecutándose en cada Nodo y vigilando los EndpointSlices, cada cambio en un EndpointSlice se vuelve relativamente caro ya que será transmitido a cada Nodo del clúster. Este enfoque pretende limitar el número de cambios que necesitan ser enviados a cada Nodo, incluso si puede resultar con múltiples EndpointSlices que no están llenos.


En la práctica, esta distribución menos que ideal debería ser poco frecuente. La mayoría de los cambios procesados por el controlador EndpointSlice serán lo suficientemente pequeños como para caber en un EndpointSlice existente, y si no, es probable que pronto sea necesario un nuevo EndpointSlice de todos modos. Las actualizaciones continuas de los Deployments también proporcionan un reempaquetado natural de los EndpointSlices con todos los Pods y sus correspondientes endpoints siendo reemplazados.


### Endpoints duplicados

Debido a la naturaleza de los cambios de EndpointSlice, los endpoints pueden estar representados en más de un EndpointSlice al mismo tiempo. Esto ocurre de forma natural, ya que los cambios en diferentes objetos EndpointSlice pueden llegar a la vigilancia / caché del cliente de Kubernetes en diferentes momentos.

{{< note >}}
Los clientes de la API EndpointSlice deben iterar a través de todos los EndpointSlices existentes asociados a un Servicio y construir una lista completa de endpoints de red únicos. Es importante mencionar que los endpoints pueden estar duplicados en diferentes EndpointSlices.

Puedes encontrar una implementación de referencia sobre cómo realizar esta agregación y deduplicación de endpoints como parte del código `EndpointSliceCache` dentro de `kube-proxy`.
{{< /note >}}

## Comparación con endpoints {#motivación}

La API Endpoints original proporcionaba una forma simple y directa de rastrear los endpoints de red en Kubernetes. A medida que los clústeres de Kubernetes y los {{< glossary_tooltip text="Services" term_id="service" >}} crecían para manejar más tráfico y enviar más tráfico a más Pods backend, las limitaciones de la API original se hicieron más visibles.
Más notablemente, estos incluyen desafíos con la ampliación a un mayor número de endpoints de red.

Dado que todos los endpoints de red para un Servicio se almacenaban en un único objeto Endpoint, esos objetos Endpoints podían llegar a ser bastante grandes. Para los Services que permanecían estables (el mismo conjunto de endpoints durante un largo período de tiempo), el impacto era menos notable; incluso entonces, algunos casos de uso de Kubernetes no estaban bien servidos.


Cuando un Service tenía muchos Endpoints de backend y la carga de trabajo se escalaba con frecuencia o se introducían nuevos cambios con frecuencia, cada actualización del objeto Endpoint para ese Service suponía mucho tráfico entre los componentes del clúster de Kubernetes (dentro del plano de control y también entre los nodos y el servidor de API). Este tráfico adicional también tenía un coste en términos de uso de la CPU.

Con EndpointSlices, la adición o eliminación de un único Pod desencadena el mismo _número_ de actualizaciones a los clientes que están pendientes de los cambios, pero el tamaño de esos mensajes de actualización es mucho menor a gran escala.

EndpointSlices también ha permitido innovar en torno a nuevas funciones, como las redes de doble pila y el enrutamiento con conocimiento de la topología.

## {{% heading "whatsnext" %}}

* Sigue las instrucciones del tutorial [Conexión de aplicaciones con servicios](/docs/tutorials/services/connect-applications-service/)
* Lee la [Referencia API](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) para la API EndpointSlice
* Lee la [Referencia API](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) para la API Endpoints
