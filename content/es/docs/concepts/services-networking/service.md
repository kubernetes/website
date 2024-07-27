---
reviewers:
- raelga
- electrocucaracha
title: Service
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="service" length="short" >}}

Con Kubernetes no necesitas modificar tu aplicación para que utilice un mecanismo de descubrimiento de servicios desconocido.
Kubernetes le otorga a sus Pods su propia dirección IP y un nombre DNS para un conjunto de Pods, y puede balancear la carga entre ellos.

<!-- body -->

## Motivación

Los {{< glossary_tooltip term_id="pod" text="Pods" >}} de Kubernetes son creados y destruidos para coincidir con el estado de tu clúster.
Los Pods son recursos no permanentes. Si utilizas un {{< glossary_tooltip term_id="deployment" text="Deployment" >}} para correr tu aplicación, puede crear y
destruir los Pods dinámicamente.

Cada Pod obtiene su propia dirección IP, sin embargo, en un Deployment, el conjunto de Pods corriendo en un momento dado puede ser diferente al
conjunto de Pods corriendo esa aplicación un momento después.

Esto conlleva un problema: si un conjunto de Pods (llamémoslos "backends") provee funcionalidad a otros Pods (llamémoslos "frontends") dentro de tu clúster,
¿de qué manera los frontends encuentran y tienen seguimiento de cuál dirección IP conectarse, para que el frontend pueda usar la parte del backend de la carga de trabajo?

Entran los _Services_.

## Recursos Service {#service-resource}

En Kubernetes, un Service es una abstracción que define un conjunto lógico de Pods y una política por la cual acceder a ellos
(algunas veces este patrón es llamado micro-servicio). El conjunto de Pods a los que apunta un Servicio se determina usualmente por un {{< glossary_tooltip text="Selector" term_id="selector" >}}.
Para aprender más sobre otras maneras de definir Endpoints para un Service, mira [Services sin selectores](#services-sin-selectores).

Por ejemplo, considera un backend sin estado para procesar imágenes que está corriendo con 3 réplicas. Estas réplicas son fungibles; a los frontends no les importa
cuál backend usar. Mientras que los Pods actuales que componen el backend pueden cambiar, los clientes del frontend no deberían estar al tanto de ello, ni deberían llevar un seguimiento
del conjunto de backends en sí mismos.

La abstracción del Service habilita este desacoplamiento.

### Descubrimiento de servicios nativos en la nube

Si eres capaz de usar la API de Kubernetes para descubrir servicios en tu aplicación,
puedes hacer una búsqueda en el {{< glossary_tooltip text="servidor API" term_id="kube-apiserver" >}} para los Endpoints, que se actualizan cuando cambian el conjunto de Pods en el servicio.

Para aplicaciones no nativas, Kubernetes ofrece una manera de colocar un puerto de red o un balanceador de carga entre tu aplicación y los Pods del backend.

## Definiendo un Service

Un Service en Kubernetes es un objeto REST, similar a un Pod. Como todos los objetos REST, puedes hacer un `Post` a una definición de un Service al servidor API para crear una nueva instancia.
EL nombre de un objeto Service debe ser un [nombre RFC 1035 válido](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names).

Por ejemplo, supongamos que tienes un conjunto de Pods en el que cada uno escucha el puerto TCP 9376 y contiene la etiqueta `app.kubernetes.io/name=MyApp`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Esta especificación crea un nuevo objeto Service llamado "mi-servicio", que apunta via TCP al puerto 9376 de cualquier Pod con la etiqueta `app.kubernetes.io/name=MyApp`.

Kubernetes asigna una dirección IP a este Service (Algunas veces llamado "Cluster IP"), la cual es usada por los proxies de los Services (mira [IPs Virtuales y proxies de servicios](#virtual-ips-and-service-proxies) abajo).

El controlador para el selector del Service escanea continuamente a los Pods que coincidan con este selector, y luego hace un Post de cualquier actualización a un objeto Endpoint llamado también "mi-servicio".

{{< note >}}
Un Service puede mapear _cualquier_ `port` de entrada a un `targetPort`. Por defecto y conveniencia, el `targetPort` se establece con el mismo valor que el campo `port`.
{{< /note >}}

Las definiciones de puerto en los Pods tienen nombres, y puedes hacer referencia a estos nombres en el atributo `targetPort` del Service. Esto funciona incluso si existe una mezcla
de Pods en el Service usando un único nombre configurado, con el mismo protocolo de red disponible via diferentes números de puerto.
Esto ofrece mucha flexibilidad para desplegar y evolucionar tus Services. Por ejemplo, puedes cambiar los números de puertos que los Pods exponen en la siguiente versión de tu software backend, sin romper los clientes.

El protocolo por defecto para los Services is TCP; también puedes usar cualquier otro [protocolo soportado](#protocol-support).

Como muchos Services necesitan exponer más de un puerto, Kubernetes soporta múltiples definiciones de puertos en un único objeto Service.
Cada definición de un puerto puede tener el mismo protocolo, o uno diferente

### Services sin selectores

Los Services comúnmente abstraen el acceso a los Pods de Kubernetes, pero también pueden abstraer otros tipos de backends.

Por ejemplo:

- Quieres tener un clúster de base de datos externo en producción, pero en el entorno de pruebas quieres usar tus propias bases de datos.
- Quieres apuntar tu Service a un Service en un {{< glossary_tooltip term_id="namespace" text="Namespace" >}} o en un clúster diferente.
- Estás migrando tu carga de trabajo a Kubernetes. Mientras evalúas la aproximación, corres solo una porción de tus backends en Kubernetes.

En cualquiera de estos escenarios puedes definir un Service _sin_ un selector de Pod.

Por ejemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Debido a que este Service no tiene un selector, el objeto Endpoints no se crea de forma automática.
Puedes mapear manualmente el Service a la dirección de red y puerto donde está corriendo, añadiendo el objeto Endpoints manualmente:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: mi-servicio
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```

El nombre del objeto Endpoints debe ser un [nombre de subdominio DNS válido](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
Las direcciones IPs _no deben_ ser: loopback (127.0.0.0/8 para IPv4, ::1/128 para IPv6), o
link-local (169.254.0.0/16 and 224.0.0.0/24 para IPv4, fe80::/64 para IPv6).

Las direcciones IP del Endpoint no pueden ser IPs de clúster de otros Services de Kubernetes, debido a que el
{{< glossary_tooltip term_id="kube-proxy" >}} no soporta IPs virtuales como destino.
{{< /note >}}

Acceder a un Service sin un selector funciona de la misma manera que si tuviese un selector.
En el ejemplo de abajo, el tráfico se dirige al único Endpoint definido en el YAML:
`192.0.2.42:9376` (TCP).

{{< note >}}
El servidor de API de Kubernetes no permite hacer proxy a Endpoints que no están mapeados a Pods.
Acciones como `kubectl port-forward service/<service-name> forwardedPort:servicePort` donde el servicio no tiene un selector fallará debido a esta restricción.
Esto previene que el servidor API de Kubernetes sea utilizado como proxy a endpoints a los que quien llama no tenga acceso autorizado.
{{< /note >}}

Un Service ExternalName es un caso especial de Service que no tiene selectores y usa nombres DNS en su lugar. Para más información, mira la sección [ExternalName](#externalname) en este documento.

### Endpoints de sobrecapacidad

Si un recurso Endpoint tiene más de 1000 endpoints entonces un clúster de Kubernetes v1.22 (o posterior)
anota los Endpoints con `endpoints.kubernetes.io/over-capacity: truncated`.
Esta anotación indica que el objeto Endpoints afectado está por encima de la capacidad y que
el controlador de endpoints ha truncado el número de endpoints a 1000.

### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Los EndpointSlices son un recurso de la API que pueden proveer una alternativa más escalable a los Endpoints.
Aunque conceptualmente es muy similar a los Endpoints, los EndpointSlices permiten distribuir los endpoints de red a través de múltiples recursos.
Por defecto, un EndpointSlice se considera "full" una vez que alcanza 100 endpoints, punto en el cual un EndpointSlice se creará para almacenar cualquier endpoint adicional.

Los EndpointSlices proveen atributos adicionales y funcionalidad que se describe en detalle en [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).

### Protocolo de aplicación

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

El campo `appProtocol` provee una manera de especificar un protocolo de aplicación para cada puerto de un Service.
El valor de este campo es reflejado por el Endpoint correspondiente y los objetos EndpointSlices.

Este campo sigue una sintaxis estándar de etiquetas de Kubernetes. Los valores deberían ser [nombres de servicio IANA estándar](https://www.iana.org/assignments/service-names)
o nombres de dominio con prefijos tales como `mycompany.com/my-custom-protocol`.


## IPS Virtuales proxies de servicio

Cada nodo en un clúster de Kubernetes ejecuta un `kube-proxy`. El `kube-proxy`es el responsable de implementar una forma de IP virtual para los
`Services` de un tipo distinto al de [`ExternalName`](#externalname).

### Por qué no usar DNS round-robin?

Una pregunta que surge algunas veces es por qué Kubernetes depende de proxies para redirigir el tráfico de entrada a los backends. ¿Qué hay de otros enfoques?
Por ejemplo, ¿sería posible configurar registros DNS que tengan múltiples valores A (o AAA para IPv6), y depender en la resolución de nombres round-robin?

Existen algunas razones para usar proxies en los Services:

- Hay una larga historia de implementaciones DNS que no respetan los registros TTLs, y cachean los resultados de la búsqueda de nombres luego de que deberían haber expirado.
- Algunas aplicaciones realizan la búsqueda de DNS solo una vez y almacenan en caché los resultados indefinidamente.
- Incluso si las aplicaciones y las librerías hicieran una resolución apropiada, los TTLs bajos o nulos en los registros DNS podrían imponer una carga alta en los DNS que luego se volvería difícil de manejar.

Más adelante en esta página puedes leer acerca del trabajo de varias implementaciones de kube-proxy. En general, deberías notar que, cuando ejecutas `kube-proxy`, los niveles de reglas del kernel podrían modificarse (por ejemplo, podrían crearse reglas iptables), que luego no son limpiados, en algunos casos hasta que reinicias. Por tanto, ejecutar kube-proxy es algo que
solo debería hacer un administrador que entienda las consecuencias de tener un servicio de bajo nivel privilegiado de proxy de red en un computador. Aunque el ejecutable de `kube-proxy` soporta una función de `cleanup`, esta función no es una característica oficial y solo está disponible para usarse como está.

### Configuración

Ten en cuenta que el kube-proxy inicia en diferentes modos, los cuales están determinados por su configuración.

- La configuración del kube-proxy se hace via un ConfigMap, y el ConfigMap para el kube-proxy remplaza efectivamente el comportamiento de casi todas las banderas para el kube-proxy.
- La configuración del ConfigMap no soporta la recarga en vivo de la configuración.
- Los parámetros del ConfigMap para el kube-proxy no se pueden validar y verificar en el arranque. Por ejemplo, si tu sistema operativo no permite ejecutar comandos iptables, el kube-proxy del kernel estándar no funcionará. De igual forma, si tienes un sistema operativo que no soporta `netsh`, no se ejecutará en modo userspace en Windows.

### Modo proxy userspace {#proxy-mode-userspace}

En este modo, el kube-proxy observa la adición y eliminación de objetos Endpoint Service del plano de control de Kubernetes.
Para cada Service se abre un puerto (elegido al azar) en el nodo local. Cualquier conexión a este "puerto proxy" es dirigido a uno de los Pods backend del Servicio (como se reporta via Endpoints). El kube-proxy toma el valor `sessionAffinity` del Service en cuenta cuando decide cuál Pod del backend utilizar.

Finalmente, el proxy del userspace instala reglas de iptables que capturan el tráfico al `clusterIP` (que es virtual) del servicio y el `port`. Las reglas redirigen el tráfico al puerto proxy que redirige al Pod del backend.

Por defecto, el kube-proxy en modo userspace elige un backend con un algoritmo round-robin.

![Diagrama de descripción general de los Services para el proxy userspace](/images/docs/services-userspace-overview.svg)

### Modo proxy `iptables` {#proxy-mode-iptables}

En este modo, el kube-proxy observa la adición y eliminación de objetos Endpoint Service del panel de control de Kubernetes.
Para Service, instala reglas iptables, las cuales capturan el tráfico al `clusterIP` y el `port` del Service, y redirige este tráfico a uno de los conjuntos del backend.
Para cada objeto Endpoint, instala reglas de iptables que seleccionan un Pod del backend.

Por defecto, el kube-proxy en modo iptables elige un backend al azar.

Usar iptables para manejar tráfico tiene una sobrecarga más baja del sistema, porque el tráfico es manejado por el netfilter de Linux sin la necesidad de cambiar entre userspace y el espacio del kernel.
Esta aproximación puede llegar a ser más confiable.

Si el kube-proxy está corriendo en modo iptables y el primer Pod seleccionado no responde, la conexión falla. Esto es diferente del modo userspace: en ese escenario, el kube-proxy detectaría que la conexión al primer Pod ha fallado e intentaría automáticamente con otro Pod del backend.

Puedes usar [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) para verificar que los Pods del backend están funcionando correctamente, para que kube-proxy en modo iptables solo vea los backends que han sido comprobados como sanos. Hacer esto significa que evitas enviar tráfico via kube-proxy a un Pod que se sabe que ha fallado.

![Diagrama de descripción general de los Services para el proxy iptables](/images/docs/services-iptables-overview.svg)

### Modo Proxy IPVS {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

En el modo `ipvs`, el kube-proxy observa los Services de Kubernetes y los Endpoints, llama la interfaz `netlink` para crear reglas IPVS respectivamente y sincroniza las reglas IPVS con los Services de Kubernetes y los Endpoints periódicamente. Este ciclo de control asegura que los estados del IPVS coincidan con el estado deseado.

Cuando accede a un Service, IPVS dirige el tráfico a uno de estos Pods del backend.

El modo proxy IPVS está basado en la función de enlace netfilter que es similar al modo iptables, pero usa una tabla hash como estructura de datos subyacente y opera en el espacio del kernel.

Esto significa que el kube-proxy en modo IPVS redirige el tráfico como menor latencia que el kube-proxy en modo iptables, con mejor desempeño cuando sincroniza las reglas proxy. Comparado con otros modos proxy, el modo IPVS también soporta un rendimiento más alto de tráfico de red.

IPVS provee más opciones para balancear el tráfico a los Pods del backend; estas son:

- `rr`: round-robin
- `lc`: menor conexión (el número más pequeño de conexiones abiertas)
- `dh`: hash de destino
- `sh`: hash de origen
- `sed`: retraso esperado más corto
- `nq`: nunca hacer cola

{{< note >}}
Para correr kube-proxy en modo IPVS, deber estar disponible IPVS en el nodo antes de iniciar el kube-proxy.

Cuando kube-proxy inicia en modo IPVS, este verifica si los módulos kernel IPVS están disponibles. Si no se detectan los módulos del kernel IPVS, kube-proxy vuelve al modo proxy iptables.
{{< /note >}}

![Diagrama de descripción general de los Services para el proxy IPVS](/images/docs/services-ipvs-overview.svg)

En estos modelos de proxy, el tráfico enlazado para la IP:Port del Service es redirigido al backend apropiado sin que el cliente sepa nada de Kubernetes, Services o Pods.

Si quieres asegurarte que las conexiones desde un cliente en particular se pasen al mismo Pod cada vez, puedes seleccionar la afinidad de sesión basada en la dirección IP del cliente al establecer `service.spec.sessionAffinity` a "ClientIP" (por defecto es "None").

Puedes establecer también el número máximo de tiempo al establecer `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` apropiadamente. (El valor por defecto es 10800, que resulta ser unas 3 horas).

## Services multi puerto

Para algunos servicios, necesitas exponer más de un puerto. Kubernetes te permite configurar múltiples definiciones puertos en un objeto Service. Cuando usas múltiples puertos para un Service, debes nombrar todos tus puertos para que no sean ambiguos.
Por ejemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  selector:
    app: MiApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
Como con los {{< glossary_tooltip term_id="name" text="nombres">}} de Kubernetes en general, los nombres para los puertos deben contener alfanuméricos en minúsculas y `-`. Los nombres de puertos deben comenzar y terminar con un carácter alfanumérico.

Por ejemplo, los nombres `123-abc` and `web` son válidos, pero `123_abc` y `-web` no lo son.
{{< /note >}}

## Eligiendo tu propia dirección IP

Puedes especificar tu propia dirección IP para el clúster como parte de la petición de creación de un `Service`. Para hacer esto, establece el campo `.spec.clusterIP`. Por ejemplo, si ya tienes una entrada DNS existente que quieres reutilizar, o sistemas legacy que están configurados para direcciones IP específicas que son difíciles de reconfigurar.

La dirección IP que elijas debe ser una dirección IPV4 o IPV6 válida dentro del rango CIDR `service-cluster-ip-range` que está configurado para el servidor API.
Si intentas crear un Service con una dirección clusterIP inválida, el servidor API devolverá un código de estado 422 para indicar que hay un problema.

## Políticas de tráfico

### Política de tráfico externa

Puedes establecer el campo `spec.externalTrafficPolicy` para controlar cómo se enruta el tráfico de fuentes externas. Los valores válidos son `Cluster`y `Local`. Establece el campo a `Cluster` para enrutar tráfico externo a todos los endpoints listos y `Local` para enrutar solamente a los endpoints locales del nodo. Si la política de tráfico es `Local` y no hay endpoints de nodos locales, kube-proxy no redirige ningún tráfico al Service relevante.

{{< note >}}
{{< feature-state for_k8s_version="v1.22" state="alpha" >}}
Si habilitas el [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `ProxyTerminatingEndpoints` para el kube-proxy, el kube-proxy revisa si el nodo tiene endpoints locales y si todos los endpoints locales están marcados como terminando. Si hay endpoints locales y **todos** están terminando, el kube-proxy ignora todo tráfico externo de `Local`. En cambio, mientras que los endpoints locales del nodo permanecen todos como terminando, el kube-proxy reenvía el tráfico para ese Service para endpoints sanos en otro lugar, como si la política de tráfico externo fuese `Cluster`.
Este comportamiento de reenvío para endpoints que están terminando existe para permitir que los balanceadores de carga externos terminen las conexiones que están respaldadas por Services `NodePort` gradualmente, incluso cuando la verificación del estado del puerto del nodo comienza a fallar. De lo contrario, el tráfico puede perderse entre el tiempo en que un nodo está todavía en el grupo de nodos de un balanceador de carga y el tráfico se cae durante el periodo de terminación de un Pod.
{{< /note >}}

### Política de tráfico interna

{{< feature-state for_k8s_version="v1.22" state="beta" >}}
Puedes establecer el campo `spec.internalTrafficPolicy` para controlar como se enruta el tráfico desde las fuentes internas. Los valores válidos son `Cluster` y `Local`. Establece el campo a `Cluster` para enrutar el tráfico interno a todos los endpoints listos y `Local` para enrutar solo los endpoints locales del nodo. Si la política de tráfico es `Local` y no hay endpoints locales de nodo, el tráfico es terminado por el kube-proxy.

## Descubriendo servicios

Kubernetes soporta 2 modos primarios para encontrar un Service - variables de entorno y DNS

### Variables de entorno

Cuando un Pod está corriendo en un Node, kubelet añade un conjunto de variables de entorno para cada Service activo. Soporta tanto variables [Docker links
compatible](https://docs.docker.com/userguide/dockerlinks/) como variables más sencillas `{SVCNAME}_SERVICE_HOST` and `{SVCNAME}_SERVICE_PORT`, donde el nombre del Service está en mayúsculas y los guiones medios se convierten en guiones bajos.

Por ejemplo, el Service `redis-master` que expone el puerto TCP 6739 y se le ha asignado una dirección IP de clúster 10.0.0.11, produce las siguientes variables de entorno:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Cuando tienes un Pod que necesita acceso a un Service, y estás usando el método de variable de entorno para publicar el puerto y la dirección clúster IP al Pod cliente, debes crear el Service _antes_ de que los Pods del cliente lleguen a existir. De lo contrario, esos Pods cliente no tendrán las variables de entorno pobladas.

Si solo usas DNS para descubrir la clúster IP para un Service, no tienes que preocuparte acerca de este tema de ordenación.
{{< /note >}}

### DNS

Puedes (y casi siempre deberías) configurar un servicio DNS para tu clúster de Kubernetes usando un [add-on](/docs/concepts/cluster-administration/addons/).

Un servidor DNS consciente del clúster, como CoreDNS, observa la API de Kubernetes por nuevos Services y crea un conjunto de registros DNS para cada uno. Si DNS ha sido habilitado a través de tu clúster entonces todos los Pods automáticamente serán capaces de resolver los Services por su nombre DNS.

Por ejemplo, si tienes un Service llamado `mi-servicio` en un namespace `mi-ns`, el plano de control y el Service DNS crean un registro DNS para `mi-servicio.mi-ns` conjuntamente. Los Pods en el namespace `mi-ns` deberían ser capaces de encontrar el Service haciendo una búsqueda de nombre por `mi-servicio` (`mi-servicio.mi-ns` también funcionaría)

Los Pods en otros namespaces deben calificar el nombre como `my-service.my-ns`. Estos nombres resolverán la clúster IP asignada para el Service.

Kubernetes también soporta registros DNS SRV (Service) para los puertos nombrados. Si el Service `mi-servicio.mi-ns` tiene un puerto llamado `http` con el protocolo fijado a `TCP`, puedes hacer una consulta DNS SRV a `_http._tcp.mi-servicio.mi-ns` para descubrir el número de puerto para `http` así como la dirección IP.

El servidor DNS de Kubernetes es la única manera de acceder a los Services `ExternalName`. Puedes encontrar más información sobre la resolución `ExternalName` en [Pods y Services DNS](/docs/concepts/services-networking/dns-pod-service/).

## Servicios Headless

Algunas veces no necesitas balancear cargas y una IP única. En este caso, puedes crear lo que llamamos Services "headless", especificando `"None"` para el clúster IP (`.spec.clusterIP`).

Puedes usar un Service headless para hacer una interfaz con otros mecanismos de descubrimiento de servicios, sin estar atado a la implementación de Kubernetes.

Para los `Services` headless, no se asigna una clúster IP, kube-proxy no maneja estos Services, y no hay balanceo de cargas o redirección por la plataforma para ellos. Cómo se configura el DNS automáticamente depende de si el Service tiene selectores definidos:

### Con selectores

Para los Services headless que definen selectores, el controlador de endpoints crea registros `Endpoints` en la API, y modifica la configuración DNS para devolver registros A (direcciones IP) que apuntan directamente a los `Pods` que respaldan el `Service`.

### Sin selectores

Para Services headless que no definen selectores, el controlador de endpoints no crea registros `Endpoints`. Sin embargo, el sistema DNS busca y configura:

- Registros CNAME para Services del tipo [`ExternalName`](#externalname).
- Registros A para cualquier `Endpoints` que comparten un nombre con el Service, para todos los otros tipos.

## Publicar Services (ServiceTypes) {#publishing-services-service-types}

En algunas partes de tu aplicación (por ejemplo, frontends) puede que necesites exponer un Service a una dirección IP externa, que está fuera de tu clúster local

Los `ServiceTypes` de Kubernetes permiten especificar qué tipo de Service quieres. El valor por defecto es `ClusterIP`

Los valores `Type` y sus comportamientos son:

- `ClusterIP`: Expone el Service en una dirección IP interna del clúster. Al escoger este valor el Service solo es alcanzable desde el clúster. Este es el `ServiceType` por defecto.
- [`NodePort`](#tipo-nodeport): Expone el Service en cada IP del nodo en un puerto estático (el `NodePort`). Automáticamente se crea un Service `ClusterIP`, al cual enruta el `NodePort`del Service. Podrás alcanzar el Service `NodePort` desde fuera del clúster, haciendo una petición a `<NodeIP>:<NodePort>`.
- [`LoadBalancer`](#loadbalancer): Expone el Service externamente usando el balanceador de carga del proveedor de la nube. Son creados automáticamente Services `NodePort`y `ClusterIP`, a los cuales el apuntará el balanceador externo.
- [`ExternalName`](#externalname): Mapea el Service al contenido del campo `externalName` (ej. `foo.bar.example.com`), al devolver un registro `CNAME` con su valor. No se configura ningún tipo de proxy.

  {{< note >}}
- Necesitas la versión 1.7 de `kube-dns` o CoreDNS versión 0.0.8 o más para usar el tipo `ExternalName`.
  {{< /note >}}

También puedes usar un [Ingress](/docs/concepts/services-networking/ingress/) para exponer tu Service. Ingress no es un tipo de Service, pero actúa como el punto de entrada de tu clúster. Te permite consolidar tus reglas de enrutamiento en un único recurso, ya que puede exponer múltiples servicios bajo la misma dirección IP.

### Tipo NodePort {#tipo-nodeport}

Si estableces el campo `type` a `NodePort`, el plano de control de Kubernetes asigna un puerto desde un rango especificado por la bandera `--service-node-port-range` (por defecto: 30000-32767).
Cada nodo es un proxy de ese puerto (el mismo número de puerto en cada nodo) hacia tu Service. Tu Service reporta al puerto asignado en el campo `.spec.ports[*].nodePort`

Si quieres especificar una(s) IP(s) particular(es) para hacer proxy del puerto, puedes establecer la bandera `--nodeport-addresses` para el kube-proxy o el campo equivalente `nodePortAddresses` del [fichero de configuración de kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/) para ese bloque particular de IP(s).

Esta bandera recibe un listado de bloques de IP separados por coma (ej. `10.0.0.0/8`, `192.0.2.0/25`) para especificar rangos de direcciones IP que el kube-proxy debería considerar como local para este nodo.

Por ejemplo, si arrancas el kube-proxy con la bandera `--nodeport-addresses=127.0.0.0/8`, el kube-proxy solo selecciona la interfaz loopback para los Services NodePort. El valor por defecto es `--nodeport-addresses` es una lista vacía. Esto significa que el kube-proxy considera todas las interfaces de red disponibles para el NodePort. (Esto es compatible también con versiones más antiguas de Kubernetes).

Si quieres un número de puerto específico, puedes especificar un valor en el campo `nodePort`. El plano de control te asignará ese puerto o reportará que la transacción API ha fallado.
Esto significa que necesitas prestar atención a posibles colisiones de puerto por tu cuenta.
También tienes que usar un número de puerto válido, uno que esté dentro del rango configurado para uso del NodePort.

Usar un NodePort te da libertad para configurar tu propia solución de balanceo de cargas, para configurar entornos que no soportan Kubernetes del todo, o para exponer uno o más IPs del nodo directamente.

Ten en cuenta que este Service es visible como `<NodeIP>:spec.ports[*].nodePort` y `.spec.clusterIP:spec.ports[*].port`.
Si la bandera `--nodeport-addresses` está configurada para el kube-proxy o para el campo equivalente en el fichero de configuración, `<NodeIP>` sería IP filtrada del nodo. Si

Por ejemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  type: NodePort
  selector:
    app: MiApp
  ports:
    # Por defecto y por comodidad, el `TargetPort` tiene el mismo valor que el campo `port.
    - port: 80
      targetPort: 80
      # Campo opcional
      # Por defecto y por comodidad, el plano de control de Kubernetes asignará el puerto desde un rango (por defecto: 30000-32767)
      nodePort: 30007
```

### Tipo LoadBalancer {#loadbalancer}

En proveedores de la nube que soportan balanceadores de carga externos, establecer el campo `type` a `LoadBalancer` aprovisiona un balanceador de carga para tu Service. La creación del balanceador de carga ocurre de forma asíncrona, y la información sobre el balanceador de carga provisto se publica en el campo `.status.loadBalancer` del Service.

Por ejemplo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  selector:
    app: MiApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
      - ip: 192.0.2.127
```

El tráfico desde el balanceador de carga externo es dirigido a los Pods del backend. El proveedor de la nube decide cómo balancear la carga.

Algunos proveedores de la nube te permiten especificar la IP `loadBalancerIP`. En esos caso, el balanceador de carga es creado con la `loadBalancerIP` especificada por el usuario. Si el campo `loadBalancerIP` no se especifica, el balanceador de carga se configura con una dirección IP efímera. Si especificas una `loadBalancerIP` pero tu proveedor de la nube no soporta esta característica, se ignora el campo `loadBalancerIP` que has configurado.

{{< note >}}
En **Azure**, si quieres usar un tipo `loadBalancerIP` público definido por el usuario, primero necesitas crear una dirección IP estática y pública. Esta dirección IP pública debería estar en el mismo grupo de recursos que los otros recursos del clúster creados automáticamente.
Por ejemplo, `MC_myResourceGroup_myAKSCluster_eastus`.

Especifica la dirección IP asignada como loadBalancerIP. Asegúrate que tienes actualizado el securityGroupName en tu fichero de configuración del proveedor de la nube. Para información sobre cómo resolver problemas de permisos de `CreatingLoadBalancerFailed`, mira [Usar una IP estática con el balanceador de carga de Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/static-ip) o [CreatingLoadBalancerFailed en un clúster AKS con configuración de red avanzada](https://github.com/Azure/AKS/issues/357).
{{< /note >}}

#### Balanceadores de carga con tipos de protocolo mixtos

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}
Por defecto, para los tipos de Service LoadBalancer, cuando hay más de un puerto definido, todos los puertos deben tener el mismo protocolo, y el protocolo debe estar soportado por el proveedor de la nube.

Si la feature gate `MixedProtocolLBService` está habilitada para el kube-apiserver se permiten usar diferentes protocolos cuando hay más de un puerto definido.

{{< note >}}

El conjunto de protocolos que pueden ser usados para Services de tipo LoadBalancer es definido por el proveedor de la nube.

{{< /note >}}

#### Deshabilitar la asignación NodePort del balanceador de carga {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

A partir de v1.20, puedes deshabilitar opcionalmente la asignación del puerto del nodo para un Service de tipo LoadBalancer estableciendo el campo `spec.allocateLoadBalancerNodePorts` a `false`. Esto debería ser usado solo para implementaciones de balanceadores de carga que enrutan el tráfico directamente a los Pods al contrario de usar puertos del nodo. Por defecto, `spec.allocateLoadBalancerNodePorts` es `true` y los Services de tipo LoadBalancer continuarán asignando puertos. Si `spec.allocateLoadBalancerNodePorts` es `false` en un Service existente con puertos asignado, esos puertos del nodo no serán desasignados automáticamente.
Debes quitar explícitamente la entrada `nodePorts`en cada puerto del Service para desasignar esos puertos del nodo.
Debes habilitar la feature gate `ServiceLBNodePortControl` para usar este campo.

#### Especificar la clase de implementación del balanceador de carga {#load-balancer-class}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

`spec.loadBalancerClass` te permite usar una implementación del balanceador de carga distinta que la que viene por defecto para el proveedor de la nube. Esta característica está disponible desde v1.21, debes habilitar la feature gate `ServiceLoadBalancerClass` para usar este campo en v1.21, y la feature gate está habilitada por defecto desde v1.22 en adelante.

Por defecto, `spec.loadBalancerClass` es `nil` y un tipo de Service `LoadBalancer` usa la implementación por defecto del proveedor de la nube si el clúster está configurado con un proveedor de nube usando la bandera de componente `--cloud-provider`.

Si `spec.loadBalancerClass` está especificado, se asume que una implementación de un balanceador de carga que coincida con la clase especificada está observando los Services. Cualquier implementación por defecto del balanceador de carga (por ejemplo, la que es provista por el proveedor de la nube) ignorará los Services que tienen este campo establecido. `spec.loadBalancerClass` se puede establecer en cualquier Service de tipo `LoadBalancer` únicamente. Una vez hecho, no se puede cambiar.
El valor de `spec.loadBalancerClass` debe ser un identificador de etiqueta, con un prefijo opcional como "`internal-vip`" o "`example.com/internal-vip`". Los nombres sin prefijo están reservados para usuarios finales.

#### Balanceador de carga interno

En un entorno mixto algunas veces es necesario enrutar el tráfico desde Services dentro del mismo bloque (virtual) de direcciones de red.

En un entorno de split-horizon DNS necesitarías dos Services para ser capaz de enrutar tanto el tráfico externo como el interno a tus Endpoints.

Para establecer un balanceador de carga interno, agrega una de las siguientes anotaciones a tu Service dependiendo del proveedor de Service en la nube que estás usando.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Selecciona una de las pestañas.
{{% /tab %}}
{{% tab name="GCP" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        networking.gke.io/load-balancer-type: "Internal"
[...]
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
[...]
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
[...]
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
[...]
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
[...]
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
[...]
```

{{% /tab %}}
{{< /tabs >}}

#### Soporte para TLS en AWS {#ssl-support-on-aws}

Para soporte parcial de TLS/SSL en clústeres corriendo en AWS, puedes agregar tres anotaciones al servicio `LoadBalancer`:

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

El primero especifica el ARN del certificado a usar. Este puede ser un certificado de un emisor de un tercero que fue subido en IAM o uno creado dentro del Administrador de Certificados de AWS.

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

La segunda anotación especifica cuál protocolo habla el Pod. Para HTTPS y SSL, el ELB espera que el Pod se autentique a sí mismo sobre una conexión encriptada, usando un certificado.

HTTP y HTTPS seleccionan un proxy de capa 7: el ELB termina la conexión con el usuario, interpreta los encabezados, e inyecta el encabezado `X-Forwared-For` con la dirección IP del usuario (los Pods solo ven la dirección IP del ELB del otro lado de su conexión) cuando reenvía las peticiones.

TCP y SSL seleccionan un proxy de capa 4: el ELB reenvía el tráfico sin modificar los encabezados.

En un entorno mixto donde algunos puertos están asegurados y otros se dejan sin encriptar, puedes usar una de las siguientes anotaciones:

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

En el ejemplo de arriba, si el Service contenía tres puertos, `80`, `443` y `8443` entonces `443` y `8443` usarían el certificado SSL, pero `80`sería HTTP proxy.

A partir de Kubernetes v1.9 en adelante puedes usar [políticas predefinidas de AWS SSL ](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) con listeners HTTPS o SSL para tus Services. Para ver cuáles políticas están disponibles para usar, puedes usar la herramienta de línea de comandos `aws`:

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

Puedes especificar cualquiera de estas políticas usando la anotación "`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`", por ejemplo:

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### Soporte de Protocolo PROXY en AWS

Para habilitar el soporte para el [protocolo PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) en clústeres corriendo en AWS, puedes usar la siguiente anotación para el servicio:

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

A partir de la versión 1.3.0, el uso de esta anotación aplica para todos los puertos proxy del ELB y no puede ser configurado de otra manera.

#### Acceso a los logs ELB en AWS

Existen algunas anotaciones para administrar el acceso a los logs para Services ELB en AWS.

La anotación `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled` controla si el acceso a los logs están habilitados.

La anotación `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`
controla el intervalo en minutos para publicar los logs de acceso. Puedes especificar un intervalo de 5 0 60 minutos.

La anotación `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`
controla el nombre del bucket de Amazon S3 donde se almacenan los logs del balanceador de carga.

La anotación `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
especifica la jerarquía lógica que has creado para tu bucket de Amazon S3.

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
    # Especifica si está habilitado el acceso a los logs
    service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
    # EL intervalo para publicar los logs de acceso. Puedes especificar un intervalo de 5 o 60 (minutos)
    service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
    # El nombre del bucket S· de Amazon donde se almacenan los logs de acceso
    service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
    # La jerarquía lógica que has creado para tu bucket S3 de Amazon, por ejemplo `my-bucket-prefix/prod`
```

#### Drenaje de conexión en AWS

Drenaje de conexión para ELBs clásicos se puede administrar con la anotación
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` fijada al valor `"true"`.
La anotación `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` puede
ser usada también para establecer el tiempo máximo, en segundos, para mantener las conexiones existentes antes de dar de baja las instancias.

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
    service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### Otras anotaciones ELB

Existen otras anotaciones para administrar Classic Elastic Load Balancers que se describen abajo.

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
    # El tiempo, en segundos, que se permite a una conexión estar en reposo (no se han enviado datos sobre la conexión) antes que sea cerrada por el balanceador de carga

    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
    # Especifica si el balanceo de cargas entre zonas está habilitado para el balanceador de carga

    service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
    # Un listado separado por comas de valores de clave-valor que será guardados como etiquetas adicionales en el ELB.

    service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
    # El número de comprobaciones de estado exitosas sucesivas requeridas para considerar sano para el tráfico a un backend.
    # Por defecto es 2, debe ser entre 2 y 10

    service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
    # El número de comprobaciones de estado fallidas requeridas para considerar a un backend no apto para el tráfico.
    # Por defecto es 6, debe ser entre 2 y 10

    service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
    # EL intervalo aproximado, en segundos, entre comprobaciones de estados de una instancia individual.
    # Por defecto es 10, debe ser entre 5 y 300.

    service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
    # La cantidad de tiempo, en segundos, durante el cual no recibir respuesta significa una comprobación de estado fallida.
    # Este valor debe ser menor que el valor de service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
    # Por defecto es 5, debe estar entre 2 y 60

    service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f"
    # Un listado de grupos de seguridad existentes para configurar en el ELB creado. A diferencia de la anotación
    # service.beta.kubernetes.io/aws-load-balancer-extra-security-groups, esta reemplaza todos los grupos de seguridad previamente asignados al ELB y también sobreescribe la creación de un grupo de seguridad creado únicamente para este ELB.
    # El primer ID grupo de seguridad en esta lista se utiliza para permitir tráfico de entrada a los nodos workers objetivo (tráfico de servicio y comprobaciones de estados).
    # Si se configuran múltiples ELBs con el mismo grupo de seguridad, solo una única línea de permisos será añadida a los grupos de seguridad del nodo worker, lo que significa que si eliminas cualquiera de esos ELBs removerá la línea de permisos y bloqueará el acceso para todos los ELBs que comparten el mismo ID de seguridad de grupo.
    # Esto puede ocasionar cortes entre servicios si no se usa apropiadamente

    service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
    # Un listado adicional de grupos de seguridad para añadir al ELB creado, esto deja un grupo de seguridad creado únicamente, asegurando que cada ELB tiene un ID de grupo de seguridad único que coincide con la línea de permiso para permitir tráfico a los nodos worker objetivo (tráfico de servicio y comprobaciones de estados)
    # Grupos de seguridad definidos se pueden compartir entre servicios.

    service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "ingress-gw,gw-name=public-api"
    # Un listado separado por comas de clave-valor que se utilizan para seleccionar los nodos objetivos para el balanceador de carga
```

#### Soporte para Balanceador de Carga de Red (NLB) en AWS {#aws-nlb-support}

{{< feature-state for_k8s_version="v1.15" state="beta" >}}
Para usar un balanceador de carga de Red en AWS, usa la anotación `service.beta.kubernetes.io/aws-load-balancer-type` con el valor fijado a `nlb`.

```yaml
metadata:
  name: mi-servicio
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{< note >}}

NLB solo funciona con ciertas clases de instancias; mira la [documentación AWS](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets) sobre balanceo de cargas elástico para un listado de tipos de instancia soportados.
{{< /note >}}

A diferencia de los balanceadores de cargas, el balanceador de carga de red (NLB) reenvía la dirección IP del cliente a través del nodo. Si el campo `.spec.externalTrafficPolicy` está fijado a `clúster`, la dirección IP del cliente no es propagada a los Pods finales.

Al fijar `.spec.externalTrafficPolicy` en `Local`, la dirección IP del cliente se propaga a los Pods finales,
pero esto puede resultar a una distribución de tráfico desigual. Los nodos sin ningún Pod para un Service particular de tipo LoadBalancer fallarán en la comprobación de estado del grupo objetivo del NLB en el puerto `.spec.healthCheckNodePort` y no recibirán ningún tráfico.

Para conseguir trafico equilibrado, usa un DaemonSet o especifica [pod anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) para no localizar en el mismo nodo.

También puedes usar Services NLB con la anotación del [balanceador de carga interno](/docs/concepts/services-networking/service/#internal-load-balancer)

Para permitir que el tráfico del cliente alcance las instancias detrás del NLB, los grupos de seguridad del Nodo se modifican con las siguientes reglas de IP:

| Regla           | Protocolo | Puerto(s)                                                                             | Rango de IP(s)                                                 | Descripción del Rango de IP                                 |
| -------------- | -------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| Health Check   | TCP      | NodePort(s) (`.spec.healthCheckNodePort` para `.spec.externalTrafficPolicy = Local`) | Subnet CIDR                                                | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| Tráfico del Cliente | TCP      | NodePort(s)                                                                         | `.spec.loadBalancerSourceRanges` (por defecto en `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTU Discovery  | ICMP     | 3,4                                                                                 | `.spec.loadBalancerSourceRanges` (por defecto en `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\>    |

Para limitar cuáles IPs del cliente pueden acceder al balanceador de carga de red, especifica  `loadBalancerSourceRanges`.

```yaml
spec:
  loadBalancerSourceRanges:
    - "143.231.0.0/16"
```

{{< note >}}
Si no se establece `.spec.loadBalancerSourceRanges`, Kubernetes permite el tráfico
desde  `0.0.0.0/0` a los Grupos de Seguridad del Nodo. Si los nodos tienen direcciones IP públicas, ten en cuenta que el tráfico que no viene del NLB
también puede alcanzar todas las instancias en esos grupos de seguridad modificados.
{{< /note >}}

#### Otras anotaciones CLS en Tencent Kubernetes Engine (TKE)

Hay otras anotaciones para administrar balanceadores de carga en la nube en TKE como se muestra abajo.


```yaml
    metadata:
      name: mi-servicio
      annotations:
        # Enlaza Loadbalancers con nodos específicos
        service.kubernetes.io/qcloud-loadbalancer-backends-label: key in (value1, value2)

        # Identificador de un balanceador de carga existente
        service.kubernetes.io/tke-existed-lbid：lb-6swtxxxx

        #Parámetros personalizados para el balanceador de cargas (LB), no soporta la modificación del tipo de LB todavía
        service.kubernetes.io/service.extensiveParameters: ""

        # Parámetros personalizados para el listener LB
        service.kubernetes.io/service.listenerParameters: ""

        # Especifica el tipo de balanceador de carga;
        # valores válidos: clásico (Balanceador de Carga clásico) o aplicación (Balanceador de Carga de aplicación de la nube)
        service.kubernetes.io/loadbalance-type: xxxxx

        # Especifica método de pago el ancho de banda de la red pública;
        # valores válidos: TRAFFIC_POSTPAID_BY_HOUR(bill-by-traffic) y BANDWIDTH_POSTPAID_BY_HOUR (bill-by-bandwidth).
        service.kubernetes.io/qcloud-loadbalancer-internet-charge-type: xxxxxx

        # Especifica el valor del ancho de banda (rango valor: [1,2000] Mbps).
        service.kubernetes.io/qcloud-loadbalancer-internet-max-bandwidth-out: "10"

        # Cuando se fija esta anotación, los balanceadores de carga solo registrarán nodos con Pods corriendo en él, de lo contrario todos los nodos serán registrados.
        service.kubernetes.io/local-svc-only-bind-node-with-pod: true
```

### Tipo ExternalName {#externalname}

Los Services de tipo ExternalName mapean un Service a un nombre DNS, no a un selector típico como `mi-servicio` o `cassandra`. Estos Services se especifican con el parámetro `spec.externalName`.

Esta definición de Service, por ejemplo, mapea el Service `mi-Servicio` en el namespace `prod` a `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
ExternalName acepta una cadena de texto IPv4, pero como un nombre DNS compuesto de dígitos, no como una dirección IP. ExternalNames que se parecen a direcciones IPv4 no se resuelven por el CoreDNS o ingress-nginx, ya que ExternalName se usa para especificar un nombre DNS canónico. Al fijar una dirección IP, considera usar [headless Services](#headless-services).
{{< /note >}}

Cuando busca el host `mi-servicio.prod.svc.cluster.local`, el Service DNS del clúster devuelve un registro `CNAME` con el valor `my.database.example.com`. Acceder a `mi-servicio` funciona de la misma manera que otros Services, pero con la diferencia crucial de que la redirección ocurre a nivel del DNS en lugar reenviarlo o redirigirlo. Si posteriormente decides mover tu base de datos al clúster, puedes iniciar sus Pods, agregar selectores apropiados o endpoints, y cambiar el `type` del Service.


{{< warning >}}
Podrías tener problemas al usar ExternalName para algunos protocolos comunes, incluyendo HTTP y HTTPS, si usas ExternalName entonces el nombre del host usado por los clientes dentro de tu clúster es diferente del nombre al que hace referencia el ExternalName.

Para protocolos que usan el nombre del host esta diferencia puede llevar a errores o respuestas inesperadas. Las peticiones HTTP tendrán un encabezado `Host:` que el servidor de origen no reconocerá; los servidores TLS no serán capaces de proveer un certificado que coincida con el nombre del host al que el cliente está conectado.
{{< /warning >}}

{{< note >}}
Esta sección está en deuda con el artículo de blog [Kubernetes Tips - Part 1](https://akomljen.com/kubernetes-tips-part-1/) de [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### IPs Externas

Si existen IPs externas que enrutan hacia uno o más nodos del clúster, los Services de Kubernetes pueden ser expuestos en esas `externalIPs`. El tráfico que ingresa al clúster con la IP externa (como IP de destino), en el puerto del Service, será enrutado a uno de estos endpoints del Service. Las `externalIPs` no son administradas por Kubernetes y son responsabilidad del administrador del clúster.

En la especificación del Service, las `externalIPs` se pueden especificar junto con cualquiera de los `ServiceTypes`.
En el ejemplo de abajo, "`mi-servicio`" puede ser accedido por clientes en "`198.51.100.32:80`" (`externalIP:port`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
  externalIPs:
    - 80.11.12.10
```

## Limitaciones

Usar el proxy del userspace for VIPs funciona en pequeña y mediana escala, pero no escalará a clústeres muy grandes con miles de Services. El tópico [original design proposal for portals](https://github.com/kubernetes/kubernetes/issues/1107) tiene más detalles sobre esto.

Usar el proxy del userspace oculta la dirección IP de origen de un paquete que accede al Service. Esto hace que algún tipo de filtrado (firewalling) sea imposible. El modo proxy iptables no oculta IPs de origen en el clúster, pero aún tiene impacto en clientes que vienen desde un balanceador de carga o un node-port.

El campo `Type` está diseñado como una funcionalidad anidada - cada nivel se agrega al anterior. Esto no es estrictamente requerido en todos los proveedores de la nube (ej. Google Compute Engine no necesita asignar un `NodePort` para que funcione el `LoadBalancer`, pero AWS si) pero la API actual lo requiere.

## Implementación de IP Virtual {#the-gory-details-of-virtual-ips}

La información previa sería suficiente para muchas personas que quieren usar Services. Sin embargo, ocurren muchas cosas detrás de bastidores que valdría la pena entender.

### Evitar colisiones

Una de las principales filosofías de Kubernetes es que no debe estar expuesto a situaciones que podrían hacer que sus acciones fracasen por su propia culpa. Para el diseño del recurso de Service, esto significa no obligarlo a elegir su propio número de puerto si esa elección puede colisionar con la de otra persona. Eso es un fracaso de aislamiento.

Para permitirte elegir un número de puerto en tus Services, debemos asegurarnos que dos Services no puedan colisionar. Kubernetes lo hace asignando a cada Service su propia dirección IP.

Para asegurarse que cada Service recibe una IP única, un asignador interno actualiza atómicamente el mapa global de asignaciones en {{< glossary_tooltip term_id="etcd" >}} antes de crear cada Service. El objeto mapa debe existir en el registro para que los Services obtengan asignaciones de dirección IP, de lo contrario las creaciones fallarán con un mensaje indicando que la dirección IP no pudo ser asignada.

En el plano de control, un controlador de trasfondo es responsable de crear el mapa (requerido para soportar la migración desde versiones más antiguas de Kubernetes que usaban bloqueo en memoria). Kubernetes también utiliza controladores para revisar asignaciones inválidas (ej. debido a la intervención de un administrador) y para limpiar las direcciones IP que ya no son usadas por ningún Service.

### Direcciones IP del Service {#ips-and-vips}

A diferencia de direcciones IP del Pod, que enrutan a un destino fijo, las IPs del Service no son respondidas por ningún host. En lugar de ello, El kube-proxy usa iptables (lógica de procesamiento de paquetes en Linux) para definir direcciones IP _virtuales_ que se redirigen de forma transparente cuando se necesita. Cuando el cliente se conecta con la VIP, su tráfico es transportado automáticamente al endpoint apropiado. Las variables de entorno y DNS para los Services son pobladas en términos de la dirección IP virtual del Service (y el puerto).

Kube-proxy soporta tres modos &mdash; userspace, iptables e IPVS &mdash; los cuales operan ligeramente diferente cada uno.

#### Userspace

Por ejemplo, considera la aplicación de procesamiento de imágenes descrita arriba. Cuando el Service del backend es creado, el nodo maestro de Kubernetes asigna una dirección IP virtual, por ejemplo 10.0.0.1. Asumiendo que el puerto del Service es 1234, el Service es observado por todas las instancias del kube-proxy en el clúster. Cuando un proxy mira un nuevo Service, abre un puerto al azar, establece una redirección iptables desde la dirección IP virtual a este nuevo puerto, y comienza a aceptar conexiones a este.

Cuando un cliente se conecta a la dirección IP virtual del Service, la regla de iptables entra en acción, y redirige los paquetes al propio puerto del proxy. El "proxy del Service" elige un backend, y comienza a redirigir el tráfico desde el cliente al backend.

Esto quiere decir que los dueños del Service pueden elegir cualquier puerto que quieran sin riesgo de colisión. Los clientes pueden conectarse a una IP y un puerto, sin estar conscientes de a cuáles Pods están accediendo.

#### iptables

Nuevamente, considera la aplicación de procesamiento de imágenes descrita arriba. Cuando se crea el Service Backend, el plano de control de Kubernetes asigna una dirección IP virtual, por ejemplo 10.0.0.1. Asumiendo que el puerto del servicio es 1234, el Service es observado por todas las instancias del kube-proxy en el clúster. Cuando un proxy mira un nuevo Service, instala una serie de reglas de iptables que redirigen desde la dirección IP virtual a las reglas del Service. Las reglas del Service enlazan a las reglas del Endpoint que redirigen el tráfico (usando NAT de destino) a los backends.

Cuando un cliente se conecta a la dirección IP virtual del Service la regla de iptables son aplicadas. A diferencia del modo proxy userspace, el kube-proxy no tiene que estar corriendo para que funcione la dirección IP virtual, y los nodos observan el tráfico que viene desde la dirección IP del cliente sin alteraciones.

El mismo flujo básico se ejecuta cuando el tráfico viene a través de un node-port o de un balanceador de carga, aunque en estos casos la IP del cliente es alterada.

#### IPVS

Las operaciones iptables ralentizan dramáticamente en un clúster a gran escala, ej. 10.000 Services. IPVS está diseñado para balancear cargas y está basado en tablas hash dentro del kernel. De esta manera puedes alcanzar consistencia en el desempeño en un número grande de Services de un kube-proxy basado en IPVS. Mientras tanto, el kube-proxy basado en IPVS tiene algoritmos de balanceo de cargas más sofisticados (least conns, locality, weighted, persistence).

## Objeto API

El Service es un recurso de alto nivel en la API REST de Kubernetes. Puedes encontrar más detalles sobre el objeto API en: [Objeto API Service API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Protocolos soportados {#protocol-support}

### TCP

Puedes usar TPC para cualquier tipo de Service, y es el protocolo de red por defecto.

### UDP

Puedes usar UDP para la mayoría de los Services. Para Services type=LoadBalancer, el soporte UDP depende del proveedor de la nube que ofrece esta facilidad.

### SCTP

{{< feature-state for_k8s_version="v1.20" state="stable" >}}
Cuando usas un plugin de red que soporta tráfico SCTP, puedes usar SCTP para la mayoría de los Services. Para Services type=LoadBalancer, el soporte SCTP depende del proveedor de la nube que ofrece esta facilidad. (La mayoría no lo hace)

#### Advertencias {#caveat-sctp-overview}

##### Soporte para asociaciones SCTP multihomed {#caveat-sctp-multihomed}

{{< warning >}}
El soporte para asociaciones SCTP multihomed requiere que el plugin CNI pueda soportar la asignación de múltiples interfaces y direcciones IP a un Pod.

NAT para asociaciones SCTP multihomed requiere una lógica especial en los módulos del kernel correspondientes.
{{< /warning >}}

##### Windows {#caveat-sctp-windows-os}

{{< note >}}
SCTP no está soportado en nodos basados en Windows.
{{< /note >}}

##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
El kube-proxy no soporta la administración de asociaciones SCTP cuando está en el modo userspace.
{{< /warning >}}

### HTTP
Si tu proveedor de la nube lo soporta, puedes usar un Service en modo LoadBalancer para configurar un proxy invertido HTTP/HTTPS, redirigido a los Endpoints del Service.

{{< note >}}
También puedes usar {{< glossary_tooltip term_id="ingress" >}} en lugar de un Service para exponer Services HTTP/HTTPS.
{{< /note >}}

### Protocolo PROXY
Si tu proveedor de la nube lo soporta, puedes usar un Service en modo LoadBalancer para configurar un balanceador de carga fuera de Kubernetes mismo, que redirigirá las conexiones prefijadas con [protocolo PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

El balanceador de carga enviará una serie inicial de octetos describiendo la conexión entrante, similar a este ejemplo

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

Seguido de la data del cliente.

## {{% heading "whatsnext" %}}

- Leer sobre [Conectar aplicaciones con Services](/docs/concepts/services-networking/connect-applications-service/)
- Leer sobre [Ingress](/docs/concepts/services-networking/ingress/)
- Leer sobre [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
