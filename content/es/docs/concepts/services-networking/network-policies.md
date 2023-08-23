---
reviewers:
- raelga
- electrocucaracha
title: Políticas de red (Network Policies)
content_type: concept
weight: 50
---

<!-- overview -->

Si quieres controlar el tráfico de red a nivel de dirección IP o puerto (capa OSI 3 o 4), puedes considerar el uso de Kubernetes NetworkPolicies para las aplicaciones que corren en tu clúster. Las NetworkPolicies son una estructura enfocada en las aplicaciones que permite establecer cómo un {{<glossary_tooltip text="Pod" term_id="pod">}} puede comunicarse con otras "entidades" (utilizamos la palabra "entidad" para evitar sobrecargar términos más comunes como "Endpoint" o "Service", que tienen connotaciones específicas de Kubernetes) a través de la red. Las NetworkPolicies se aplican a uno o ambos extremos de la conexión a un Pod, sin afectar a otras conexiones.

Las entidades con las que un Pod puede comunicarse son una combinación de estos 3 tipos:

1. Otros Pods permitidos (excepción: un Pod no puede bloquear el acceso a sí mismo)
2. Namespaces permitidos
3. Bloqueos de IP (excepción: el tráfico hacia y desde el nodo donde se ejecuta un Pod siempre está permitido, independientemente de la dirección IP del Pod o del nodo)

Cuando se define una NetworkPolicy basada en Pods o Namespaces, se utiliza un {{<glossary_tooltip text="Selector" term_id="selector">}} para especificar qué tráfico se permite desde y hacia los Pod(s) que coinciden con el selector.

Por otro lado, cuando se crean NetworkPolicies basadas en IP, se definen políticas basadas en bloques de IP (rangos CIDR).


<!-- body -->
## Prerrequisitos

Las políticas de red son implementadas por el [plugin de red](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Para usar políticas de red, debes estar utilizando una solución de red que soporte NetworkPolicy. Crear un recurso NetworkPolicy sin un controlador que lo habilite no tendrá efecto alguno.


## Dos Tipos de Aislamiento de Pod

Hay dos tipos de aislamiento para un Pod: el aislamiento para la salida y el aislamiento para la entrada. Estos se refieren a las conexiones que pueden establecerse. El término "Aislamiento" en el contexto de este documento no es absoluto, sino que significa "se aplican algunas restricciones". La alternativa, "no aislado para $dirección", significa que no se aplican restricciones en la dirección descrita. Los dos tipos de aislamiento (o no) se declaran independientemente, y ambos son relevantes para una conexión de un Pod a otro.

Por defecto, un Pod no está aislado para la salida; todas las conexiones salientes están permitidas. Un Pod está aislado para la salida si hay alguna NetworkPolicy con "Egress" en su `policyTypes` que seleccione el Pod; decimos que tal política se aplica al Pod para la salida. Cuando un Pod está aislado para la salida, las únicas conexiones permitidas desde el Pod son las permitidas por la lista `egress` de las NetworkPolicy que se apliquen al Pod para la salida. Los valores de esas listas `egress` se combinan de forma aditiva.

Por defecto, un Pod no está aislado para la entrada; todas las conexiones entrantes están permitidas. Un Pod está aislado para la entrada si hay alguna NetworkPolicy con "Ingress" en su `policyTypes` que seleccione el Pod; decimos que tal política se aplica al Pod para la entrada. Cuando un Pod está aislado para la entrada, las únicas conexiones permitidas en el Pod son las del nodo del Pod y las permitidas por la lista `ingress` de alguna NetworkPolicy que se apliquen al Pod para la entrada. Los valores de esas listas de direcciones se combinan de forma aditiva.

Las políticas de red no entran en conflicto; son aditivas. Si alguna política(s) se aplica a un Pod para una dirección determinada, las conexiones permitidas en esa dirección desde ese Pod son la unión de lo que permiten las políticas aplicables. Por lo tanto, el orden de evaluación no afecta al resultado de la política.

Para que se permita una conexión desde un Pod de origen a un Pod de destino, tanto la política de salida del Pod de origen como la de entrada del Pod de destino deben permitir la conexión. Si cualquiera de los dos lados no permite la conexión, ésta no se producirá.


## El Recurso NetworkPolicy {#networkpolicy-resource}

Ver la referencia [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#networkpolicy-v1-networking-k8s-io) para una definición completa del recurso.

Un ejemplo de NetworkPolicy podría ser este:

{{% codenew file="service/networking/networkpolicy.yaml" %}}

{{< note >}}
Enviar esto al API Server de tu clúster no tendrá ningún efecto a menos que tu solución de red soporte políticas de red.
{{</note>}}

__Campos Obligatorios__: Como con todas las otras configuraciones de Kubernetes, una NetworkPolicy
necesita los campos `apiVersion`, `kind`, y `metadata`.  Para obtener información general
sobre cómo funcionan esos archivos de configuración, puedes consultar
[Configurar un Pod para usar un ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
y [Gestión de Objetos](/docs/concepts/overview/working-with-objects/object-management).

__spec__: NetworkPolicy [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) contiene toda la información necesaria para definir una política de red dado un Namespace.

__podSelector__: Cada NetworkPolicy incluye un `podSelector` el cual selecciona el grupo de Pods en los cuales aplica la política. La política de ejemplo selecciona Pods con la etiqueta "role=db". Un `podSelector` vacío selecciona todos los Pods en un Namespace.

__policyTypes__: Cada NetworkPolicy incluye una lista de `policyTypes` la cual puede incluir `Ingress`, `Egress`, o ambas. Los campos `policyTypes` indican si la política aplica o no al tráfico de entrada hacia el Pod seleccionado, el tráfico de salida desde el Pod seleccionado, o ambos. Si no se especifican `policyTypes` en una NetworkPolicy, el valor `Ingress` se aplicará siempre por defecto y `Egress` se aplicará si la NetworkPolicy contiene alguna regla de salida.

__ingress__: Cada NetworkPolicy puede incluir una lista de reglas `ingress` permitidas. Cada regla permite el tráfico relacionado con los valores de las secciones `from` y `ports`. La política de ejemplo contiene una única regla, la cual se relaciona con el tráfico sobre un solo puerto, desde uno de los tres orígenes definidos, el primero especificado por el valor `ipBlock`, el segundo especificado por el valor `namespaceSelector` y el tercero especificado por el `podSelector`.

__egress__: Cada NetworkPolicy puede incluir una lista de reglas de `egress` permitidas. Cada regla permite el tráfico relacionado con los valores de las secciones `to` y `ports`. La política de ejemplo contiene una única regla, la cual se relaciona con el tráfico en un único puerto para cualquier destino en el rango de IPs `10.0.0.0/24`.

Por lo tanto, la NetworkPolicy de ejemplo:

1. Aísla los Pods "role=db" en el Namespace "default" para ambos tipos de tráfico ingress y egress (si aún no están aislados).
2. (Reglas Ingress) permite la conexión hacia todos los Pods en el Namespace "default" con la etiqueta "role=db" en el puerto TCP 6379 desde los siguientes orígenes:

  * cualquier Pod en el Namespace "default" con la etiqueta "role=frontend"
  * cualquier Pod en un Namespace con la etiqueta "project=myproject"
  * La dirección IP en los rangos 172.17.0.0–172.17.0.255 y 172.17.2.0–172.17.255.255 (por ejemplo, todo el rango de IPs de 172.17.0.0/16 con excepción del 172.17.1.0/24)
3. (Reglas de Egress) permite la conexión desde cualquier Pod en el Namespace "default" con la etiqueta "role=db" hacia CIDR 10.0.0.0/24 en el puerto TCP 5978

Ver el artículo de [Declarar Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) para más ejemplos.


## Comportamiento de los selectores `to` y `from`

Existen cuatro tipos de selectores que pueden ser especificados en una sección `ingress` `from` o en una sección `egress` `to`:

__podSelector__: Este selector selecciona Pods específicos en el mismo Namespace que la NetworkPolicy para permitir el tráfico como origen de entrada o destino de salida.

__namespaceSelector__: Este selector selecciona Namespaces específicos para permitir el tráfico como origen de entrada o destino de salida.

__namespaceSelector__ *y* __podSelector__: Una única entrada `to`/`from` que especifica tanto `namespaceSelector` como `podSelector` selecciona Pods específicos dentro de Namespaces específicos. Es importante revisar que se utiliza la sintaxis de YAML correcta. A continuación se muestra un ejemplo de esta política:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

contiene un elemento `from` permitiendo conexiones desde los Pods con el label `role=client` en Namespaces con el label `user=alice`. Por el contrario, *esta* política:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

contiene dos elementos en el array `from`, y permite conexiones desde Pods en los Namespaces con el label `role=client`, *o* desde cualquier Pod en cualquier Namespace con el label `user=alice`.

En caso de duda, utilice `kubectl describe` para ver cómo Kubernetes ha interpretado la política.


<a name="behavior-of-ipblock-selectors"></a>
__ipBlock__: Este selector selecciona rangos CIDR de IP específicos para permitirlas como origen de entrada o destino de salida. Estas IPs deben ser externas al clúster, ya que las IPs de Pod son efímeras e impredecibles.

Los mecanismos de entrada y salida del clúster a menudo requieren reescribir la IP de origen o destino
de los paquetes. En los casos en los que esto ocurre, no está definido si esto ocurre antes o
después del procesamiento de NetworkPolicy, y el comportamiento puede ser diferente para diferentes
combinaciones de plugin de red, proveedor de nube, implementación de `Service`, etc.

En el caso de la entrada, esto significa que en algunos casos se pueden filtrar paquetes 
entrantes basándose en la IP de origen real, mientras que en otros casos, la "IP de origen" sobre la que actúa la NetworkPolicy 
puede ser la IP de un `LoadBalancer` o la IP del Nodo donde está el Pod involucrado, etc.

Para la salida, esto significa que las conexiones de los Pods a las IPs de `Service` que se reescriben a
IPs externas al clúster pueden o no estar sujetas a políticas basadas en `ipBlock`.


## Políticas por defecto

Por defecto, si no existen políticas en un Namespace, se permite todo el tráfico de entrada y salida hacia y desde los Pods de ese Namespace. Los siguientes ejemplos muestran cómo cambiar el comportamiento por defecto en ese Namespace.


### Denegar todo el tráfico de entrada por defecto

Puedes crear una política que "por defecto" aisle a un Namespace del tráfico de entrada con la creación de una política que seleccione todos los Pods del Namespace pero no permite ningún tráfico de entrada en esos Pods.

{{% codenew file="service/networking/network-policy-default-deny-ingress.yaml" %}}

Esto asegura que incluso los Pods que no están seleccionados por ninguna otra NetworkPolicy también serán aislados del tráfico de entrada. Esta política no afecta el aislamiento en el tráfico de salida desde cualquier Pod. 


### Permitir todo el tráfico de entrada

Si quieres permitir todo el tráfico de entrada a todos los Pods en un Namespace, puedes crear una política que explícitamente permita eso.

{{% codenew file="service/networking/network-policy-allow-all-ingress.yaml" %}}

Con esta política en curso, ninguna política(s) adicional puede hacer que se niegue cualquier conexión entrante a esos Pods. Esta política no tiene efecto sobre el aislamiento del tráfico de salida de cualquier Pod.


### Denegar por defecto todo el tráfico de salida

Puedes crear una política que "por defecto" aisle el tráfico de salida para un Namespace, creando una NetworkPolicy que seleccione todos los Pods pero que no permita ningún tráfico de salida desde esos Pods.

{{% codenew file="service/networking/network-policy-default-deny-egress.yaml" %}}

Esto asegura que incluso los Pods que no son seleccionados por ninguna otra NetworkPolicy no tengan permitido el tráfico de salida. Esta política no cambia el comportamiento de aislamiento para el tráfico de entrada de ningún Pod.


### Permitir todo el tráfico de salida

Si quieres permitir todas las conexiones desde todos los Pods de un Namespace, puedes crear una política que permita explícitamente todas las conexiones salientes de los Pods de ese Namespace.

{{% codenew file="service/networking/network-policy-allow-all-egress.yaml" %}}

Con esta política en vigor, ninguna política(s) adicional puede hacer que se niegue cualquier conexión de salida desde esos Pods. Esta política no tiene efecto sobre el aislamiento para el tráfico de entrada a cualquier Pod.


### Denegar por defecto todo el tráfico de entrada y de salida

Puedes crear una política que "por defecto" en un Namespace impida todo el tráfico de entrada y de salida creando la siguiente NetworkPolicy en ese Namespace.

{{% codenew file="service/networking/network-policy-default-deny-all.yaml" %}}

Esto asegura que incluso los Pods que no son seleccionados por ninguna otra NetworkPolicy no tendrán permitido el tráfico de entrada o salida.


## Soporte a SCTP 

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Como característica estable, está activada por defecto. Para deshabilitar SCTP a nivel de clúster, usted (o el administrador de su clúster) tiene que deshabilitar la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `SCTPSupport` para el API Server con el flag `--feature-gates=SCTPSupport=false,...`.
Cuando esta feature gate está habilitada, puede establecer el campo `protocol` de una NetworkPolicy como `SCTP`.

{{< note >}}
Debes utilizar un plugin de {{< glossary_tooltip text="CNI" term_id="cni" >}} que soporte el protocolo SCTP NetworkPolicies.
{{< /note >}}


## Apuntar a un rango de puertos

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Cuando se escribe una NetworkPolicy, se puede apuntar a un rango de puertos en lugar de un solo puerto.

Esto se puede lograr con el uso del campo `endPort`, como en el siguiente ejemplo:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: multi-port-egress
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 32000
      endPort: 32768
```

La regla anterior permite que cualquier Pod con la etiqueta `role=db` en el Namespace `default` se comunique 
con cualquier IP dentro del rango `10.0.0.0/24` sobre el protocolo TCP, siempre que el puerto 
esté entre el rango 32000 y 32768.

Se aplican las siguientes restricciones al utilizar este campo:
* Como característica en estado beta, está activada por defecto. Para desactivar el campo `endPort` a nivel de clúster, usted (o su administrador de clúster) debe desactivar la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `NetworkPolicyEndPort`  
en el API Server con el flag `--feature-gates=NetworkPolicyEndPort=false,...`.
* El campo `endPort` debe ser igual o mayor que el campo `port`.
* Solo se puede definir `endPort` si también se define `port`.
* Ambos puertos deben ser numéricos.


{{< note >}}
Su clúster debe utilizar un plugin de {{< glossary_tooltip text="CNI" term_id="cni" >}} que
soporte el campo `endPort` en las especificaciones de NetworkPolicy.
Si su [plugin de red](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) 
no soporta el campo `endPort` y usted especifica una NetworkPolicy que use este campo,
la política se aplicará solo para el campo `port`.
{{< /note >}}


## Cómo apuntar a un Namespace usando su nombre

{{< feature-state for_k8s_version="1.22" state="stable" >}}

El plano de control de Kubernetes establece una etiqueta inmutable `kubernetes.io/metadata.name` en todos los
Namespaces, siempre que se haya habilitado la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `NamespaceDefaultLabelName`.
El valor de la etiqueta es el nombre del Namespace.

Aunque NetworkPolicy no puede apuntar a un Namespace por su nombre con algún campo de objeto, puede utilizar la etiqueta estandarizada para apuntar a un Namespace específico.


## Qué no puedes hacer con políticas de red (al menos, aún no)

Actualmente, en Kubernetes {{< skew currentVersion >}}, la siguiente funcionalidad no existe en la API de NetworkPolicy, pero es posible que se puedan implementar soluciones mediante componentes del sistema operativo (como SELinux, OpenVSwitch, IPTables, etc.) o tecnologías de capa 7 (controladores Ingress, implementaciones de Service Mesh) o controladores de admisión. En caso de que seas nuevo en la seguridad de la red en Kubernetes, vale la pena señalar que las siguientes historias de usuario no pueden (todavía) ser implementadas usando la API NetworkPolicy.

- Forzar que el tráfico interno del clúster pase por una puerta de enlace común (esto se puede implementar con una malla de servicios u otro proxy).
- Cualquier cosa relacionada con TLS (se puede implementar con una malla de servicios o un controlador Ingress para esto).
- Políticas específicas de los nodos (se puede utilizar la notación CIDR para esto, pero no se puede apuntar a los nodos por sus identidades Kubernetes específicamente).
- Apuntar Services por nombre (sin embargo, se pueden orientar los Pods o los Namespaces por sus {{< glossary_tooltip text="labels" term_id="label" >}}, lo que suele ser una solución viable).
- Creación o gestión de "solicitudes de políticas" que son atendidas por un tercero.
- Políticas que por defecto son aplicadas a todos los Namespaces o Pods (hay algunas distribuciones y proyectos de Kubernetes de terceros que pueden hacer esto).
- Consulta avanzada de políticas y herramientas de accesibilidad.
- La capacidad de registrar los eventos de seguridad de la red (por ejemplo, las conexiones bloqueadas o aceptadas).
- La capacidad de negar explícitamente las políticas (actualmente el modelo para NetworkPolicies es negar por defecto, con solo la capacidad de añadir reglas de permitir).
- La capacidad de impedir el tráfico entrante de Loopback o de Host (actualmente los Pods no pueden bloquear el acceso al host local, ni tienen la capacidad de bloquear el acceso desde su nodo residente).


## {{% heading "whatsnext" %}}

- Leer el artículo sobre [Cómo Declarar Políticas de Red](/docs/tasks/administer-cluster/declare-network-policy/) para ver más ejemplos.
- Ver más [recetas](https://github.com/ahmetb/kubernetes-network-policy-recipes) de escenarios comunes habilitados por los recursos de las NetworkPolicy.
