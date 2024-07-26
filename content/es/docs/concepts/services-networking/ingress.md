---
reviewers:
  - raelga
title: Ingress
content_type: concept
description: >-
  Permite que sean accesibles los servicios de red HTTP (o HTTPS) usando un mecanismo de configuración consciente del protocolo, que entiende conceptos como URIs, nombres de host, rutas y más.
  El concepto de Ingress te permite mapear el tráfico a diferentes backend basado en las reglas que defines a través de la API de Kubernetes.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
El recurso Ingress está congelado.
Las nuevas características se añaden
al [API del Gateway](/docs/concepts/services-networking/gateway/)
{{< /note >}}

<!-- body -->

## Terminología

Para mayor claridad, esta guía define los siguientes términos:

* Nodo: Una máquina worker en Kubernetes, parte de un clúster.
* Clúster: Un conjunto de Nodos que ejecutan aplicaciones en contenedores,
  administrados por Kubernetes.
  Para este ejemplo, y para los despliegues más comunes de Kubernetes, los nodos
  en el clúster no son parte del internet público.
* Enrutador Edge: un enrutador que refuerza la política de seguridad del
  cortafuegos para tu clúster.
  Esto podría ser una puerta de entrada administrada por un proveedor de la nube
  o una pieza física de hardware.
* Red del clúster: un conjunto de enlaces, lógicos o físicos,
  que facilitan la comunicación dentro de un clúster de acuerdo con
  el [modelo de redes](/docs/concepts/cluster-administration/networking/) de
  Kubernetes.
* Service: Un {{< glossary_tooltip term_id="service" >}} que identifica
  un conjunto de Pods que utilizan selectores de {{< glossary_tooltip text="label" term_id="label" >}}.
  A menos que se indique de otra manera, los Services se asumen que tienen IPs
  virtuales que solo se pueden enrutar dentro de la red del clúster.

## ¿Qué es un Ingress?

Un [Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
expone rutas HTTP y HTTPS desde el exterior del clúster a los
{{< link text="servicios" url="es/docs/concepts/services-networking/service/" >}} dentro del clúster.
El control del tráfico es controlado por las reglas definidas en el recurso Ingress.

Aquí tienes un ejemplo simple de un Ingress que envía todo su tráfico a un
Service:

{{< figure src="/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="Figure. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

Un Ingress se puede configurar para otorgar URLs a los Services que son
accesibles desde el exterior,
para hacer balance de cargas del tráfico, finalizar SSL/TLS y ofrecer
alojamiento virtual basado en nombres.

Un [controlador de Ingress](/docs/concepts/services-networking/ingress-controllers)
es responsable de complementar el Ingress,
comúnmente con un balanceador de cargas,
aunque también puedes configurar tu enrutador edge con frontends adicionales para
ayudar a manejar el tráfico.

Un Ingress no expone puertos o protocolos arbitrariamente. Exponer servicios
distintos de HTTP o HTTPS al internet usa un servicio de
tipo [Service.Type=NodePort](/es/docs/concepts/services-networking/service/#tipo-nodeport)
o [Service.Type=LoadBalancer](/es/docs/concepts/services-networking/service/#loadbalancer).

## Prerrequisitos

Debes tener
un [controlador de Ingress](/docs/concepts/services-networking/ingress-controllers)
para satisfacer a un Ingress.
Crear únicamente un recurso Ingress no tiene ningún efecto.

Puede que necesites desplegar un controlador Ingress controller tal como
el [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/).
Puedes elegir de un número
de [controladores de Ingress](/docs/concepts/services-networking/ingress-controllers).

Idealmente,
todos los controladores de Ingress deberían encajar con la especificación de
referencia.
En realidad, los distintos controladores de Ingress operan ligeramente
diferente.

{{< note >}}
Asegúrate de revisar la documentación del controlador de Ingress para entender
las precauciones de usarlo.
{{< /note >}}

## El recurso Ingress

Un ejemplo mínimo de un recurso Ingress:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

Un Ingress necesita los campos `apiVersion`, `kind`, `metadata` y `spec`.
El nombre del objeto Ingress debe ser un
[nombre de subdominio DNS](es/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
válido.
Para información general sobre cómo trabajar con archivos de configuración,
mira [desplegando aplicaciones](/es/docs/tasks/run-application/run-stateless-application-deployment/),
[configurando contenedores](/docs/tasks/configure-pod-container/configure-pod-configmap/),
[administrando recursos](/docs/concepts/cluster-administration/manage-deployment/).

Los Ingress usan anotaciones frecuentemente para configurar algunas opciones
dependiendo del controlador de Ingress,
un ejemplo de ello es
la [anotación rewrite-target](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md).
Distintos [controladores de Ingress](/docs/concepts/services-networking/ingress-controllers)
soportan anotaciones diferentes.
Revisa la documentación para tu elección del controlador de Ingress para saber
qué anotaciones son soportadas.

La [especificación Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
tiene toda la información que necesitas para configurar un balanceador de cargas
o un servidor proxy.
Mucho más importante, contiene un listado de reglas que emparejan contra todas
las peticiones entrantes.
El recurso Ingress solo soporta reglas para dirigir el tráfico HTTP(S).

Si se omite la `ingressClassName`, se define
una [clase Ingress por defecto](#default-ingress-class).

Existen algunos controladores de Ingress,
que trabajan sin la definición de una `IngressClass` por defecto.
Por ejemplo, el controlador Ingress-NGINX se puede configurar con
una [opción](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`.
Sin embargo,
se [recomienda](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do)
especificar el `IngressClass` por defecto como se
muestra [abajo](#default-ingress-class).

### Reglas del Ingress

Cada regla HTTP contiene la siguiente información:

* Un host opcional.
  En este ejemplo,
  no se define un host así que la regla se aplica a todo el tráfico de
  entrada HTTP a través de la dirección IP especificada.
  Cuando se proporciona un host (por ejemplo, foo.bar.com), las reglas se
  aplican a ese host.
* Un listado de rutas (por ejemplo, `/testpath`), cada una de las cuales tiene
  un backend asociado con un `service.name` y un `service.port.name` o
  un `service.port.number`. Tanto el host como la ruta deben coincidir con el
  contenido de una petición de entrada antes que el balanceador de cargas dirija
  el tráfico al Service referenciado.
* Un backend es una combinación de un Service y un puerto como se describe en la
  [documentación del Service](/es/docs/concepts/services-networking/service/) o
  un [recurso personalizado backend](#resource-backend)
  a través de un {{< glossary_tooltip term_id="CustomResourceDefinition" text=" CRD" >}}.
  Las peticiones HTTP (y HTTPS) al Ingress que coinciden con el host y la
  ruta de la regla se envían al backend del listado.

Un `defaultBackend` se configura frecuentemente en un controlador de Ingress
para dar servicio a cualquier petición que no coincide con una ruta en la
especificación.

### DefaultBackend {#default-backend}

Un Ingress sin reglas envía todo el tráfico a un único backend
y `.spec.defaultBackend` está en el backend que debería manejar las peticiones
en ese caso.
El `defaultBackend` es una opción de configuración convencional
del [controlador Ingress ](/docs/concepts/services-networking/ingress-controllers)
y no se especifica en tus recursos del Ingress.
Si no se especifican reglas `.spec.rules`, se debe
especificar `.spec.defaultBackend`.
Si no se establece un `defaultBackend`, las peticiones que no coincidan con
ninguna de las reglas las decidirá el controlador ingress (consulta la
documentación de tu controlador de ingress para saber cómo maneja este caso).

Si ninguno de los hosts o rutas coincide con la petición HTTP en los objetos Ingress,
el tráfico será enrutado a tu backend predeterminado.

### Resource backends {#resource-backend}

Un `Resource` backend es una referencia de objeto
(ObjectRef en inglés)
a otro recurso de Kubernetes dentro del mismo espacio de nombres que el objeto
Ingress.
Este `Resource` es mutuamente exclusivo con el Service,
y la validación fallará si ambos se especifican.
Un uso común para un `Resource` backend es para ingresar datos a un backend de almacenamiento de datos con activos estáticos.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

Luego de crear el Ingress mencionado arriba,
puedes verlo con el siguiente comando:


```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Tipos de ruta

Se requiere que cada ruta de un Ingress tenga un tipo de ruta correspondiente.
Las Rutas que no incluyen un `pathType` explícito fallarán la validación.
Hay 3 tipos de rutas soportadas:

* `ImplementationSpecific`: Con este tipo de ruta, la coincidencia depende de la
  IngressClass.
  Las implementaciones pueden tratar esto como un `pathType` separado o
  tratarlas de forma idéntica a los tipos de ruta `Prefix` o `Exact`.

* `Exact`: Coincide la ruta de la URL exactamente con sensibilidad a mayúsculas
  y minúsculas.

* `Prefix`: Coincide basado en el prefijo de una ruta URL dividida por `/`.
  La coincidencia es sensible a mayúsculas y minúsculas, y hecha en un elemento
  de la ruta por elemento.
  Un elemento de la ruta refiere a la lista de etiquetas en la ruta dividida por
  el separador `/`.
  Una petición es una coincidencia para la ruta _p_ si cada _p_ es un elemento
  prefijo de _p_ de la ruta requerida.

{{< note >}}
Si el último elemento de una ruta es una subcadena de caracteres del último
elemento de la solicitud de ruta, no es una coincidencia
(por ejemplo: `/foo/bar`
coincide con `/foo/bar/baz`, pero no coincide con `/foo/barbaz`).
{{< /note >}}

### Ejemplos

| Tipo     | Ruta(s)                           | Ruta de la(s) peticion(es) | ¿Coincide?                             |
|----------|-----------------------------------|----------------------------|----------------------------------------|
| Prefijo  | `/`                               | (todas las rutas)          | Sí                                     |
| Exacto   | `/foo`                            | `/foo`                     | Si                                     |
| Exacto   | `/foo`                            | `/bar`                     | No                                     |
| Exacto   | `/foo`                            | `/foo/`                    | No                                     |
| Exacto   | `/foo/`                           | `/foo`                     | No                                     |
| Prefijo  | `/foo`                            | `/foo`, `/foo/`            | Si                                     |
| Prefijo  | `/foo/`                           | `/foo`, `/foo/`            | Si                                     |
| Prefijo  | `/aaa/bb`                         | `/aaa/bbb`                 | No                                     |
| Prefijo  | `/aaa/bbb`                        | `/aaa/bbb`                 | Si                                     |
| Prefijo  | `/aaa/bbb/`                       | `/aaa/bbb`                 | Si, ignora la barra diagonal           |
| Prefijo  | `/aaa/bbb`                        | `/aaa/bbb/`                | Si, coincide con barra diagonal       |
| Prefijo  | `/aaa/bbb`                        | `/aaa/bbb/ccc`             | Si, coincide con la subruta           |
| Prefijo  | `/aaa/bbb`                        | `/aaa/bbbxyz`              | No, no coincide con el prefijo de cadena      |
| Prefijo  | `/`, `/aaa`                       | `/aaa/ccc`                 | Si, coincide con el prefijo  `/aaa`   |
| Prefijo  | `/`, `/aaa`, `/aaa/bbb`           | `/aaa/bbb`                 | Si, coincide con el prefijo `/aaa/bbb` |
| Prefijo  | `/`, `/aaa`, `/aaa/bbb`           | `/ccc`                     | Si, coincide con el prefijo`/`         |
| Prefijo  | `/aaa`                            | `/ccc`                     | No, usa el backend predeterminado      |
| Mezclado | `/foo` (Prefijo), `/foo` (Exacto) | `/foo`                     | Si, prefiere la coincidencia exacta    |

#### Múltiples coincidencias

En algunos casos,
muchas rutas dentro de un Ingress coincidirán con una petición.
En esos casos,
la precedencia se le dará al primero con la ruta más larga que coincide.
Si dos rutas todavía coinciden por igual, se le dará precedencia a las rutas con
una coincidencia de ruta exacta sobre las rutas que contienen prefijos.

## Comodines Hostname

Los hosts pueden ser coincidencias exactas
(por ejemplo “`foo.bar.com`”) o un comodín (por ejemplo “`*.foo.com`”).
Las coincidencias precisas requieren que el encabezado `host` coincida con el
campo `host`.
Las coincidencias de comodín requieren que el encabezado `host` sea igual al
sufijo de la regla del comodín.

| Host        | Encabezado Host   | ¿Coincidencia?                                      |
|-------------|-------------------|-----------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Coincide basado en el sufijo común                  |
| `*.foo.com` | `baz.bar.foo.com` | No coincide, el comodín solo cubre una etiqueta DNS |
| `*.foo.com` | `foo.com`         | No coincide, el comodín solo cubre una etiqueta DNS |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## La Clase Ingress

Los Ingress pueden ser implementados por distintos controladores,
comúnmente con una configuración distinta.
Cada Ingress debería especificar una clase,
una referencia a un recurso IngressClass que contiene información adicional
incluyendo el nombre del controlador que debería implementar la clase.

{{% code_sample file="service/networking/external-lb.yaml" %}}

El campo `.spec.parameters` de un IngressClass te permite hacer referencia a
otro recurso que proporciona la configuración relacionada con esa IngressClass.

El tipo específico de parámetros a usar depende del controlador de Ingress que
especificas en el campo `spec.controller` de la IngressClass.

### Alcance de IngressClass

Dependiendo de tu controlador de ingress, podrías ser capaz de usar parámetros
que se establecen en todo el clúster, o solamente para un namespace.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Clúster" %}}
El alcance por defecto de los parámetros IngressClass es para todo el clúster.

Si estableces el campo `spec.parameters` y no estableces el
campo `spec.parameters.scope`,
entonces el IngressClass se refiere al recurso cuyo alcance es todo el clúster.
El atributo `kind` (en combinación con el `apiGroup`)
de los parámetros se refiere a la API con alcance a todo el clúster
(posiblemente un recurso personalizado), y el `name` de los parámetros
identifica al recurso del clúster específico para esa API.

Por ejemplo:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # Los parámetros para este IngressClass se especifican en un
    # ClusterIngressParameter (API group k8s.example.net) llamado
    # "external-config-1". Esta definición le indica a Kubernetes 
    # de buscar por un parámetro de recurso con alcance a todo el clúster.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Si estableces el campo `spec.parameters` y el `spec.parameters.scope`
al `Namespace`,
entonces el IngressClass se refiere al recurso cuyo alcance es el namespace.
También debes establecer el campo `namespace` dentro de `spec.parameters` con el
Namespace que contiene los parámetros que quieres usar.

El atributo `kind` (en combinación con `apiGroup`)
de los parámetros se refiere a la API restringida por un Namespace (por ejemplo:
ConfigMap), y el `name` de los parámetros identifica al recurso específico en el
namespace que has especificado en `namespace`.

Los parámetros con alcance al Namespace ayudan al operador del clúster a delegar
el control sobre la configuración
(por ejemplo, ajustes del balanceador de cargas, definición de una API gateway)
que se usa para una carga de trabajo.
Si utilizas un parámetro con alcance al Namespace entonces:

- El equipo operador del clúster necesita aprobar los cambios de un equipo
  distinto cada vez que se aplica un nuevo cambio a la configuración.
- O el equipo operador del clúster debe definir específicamente estos controles
  de acceso, tales como asociaciones de
  roles [RBAC](/docs/reference/access-authn-authz/rbac/) y mapeos, que permitan
  a la aplicación hacer cambios al recurso de parámetros con alcance al clúster.

La API de la IngressClass por sí misma siempre tiene alcance al clúster.

Aquí hay un ejemplo de una IngressClass que hace referencia a parámetros que
están restringidos por un Namespace:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # Los parámetros para esta IngressClass se especifican en un 
    # IngressParameter (API group k8s.example.com) llamado "external-config",
    # que está en el namespace "external-configuration".
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### Anotación deprecada

Antes que el recurso IngressClass y el campo `ingressClassName` se añadieran a
Kubernetes
1.18,
las clases Ingress se especificaban con una
anotación `kubernetes.io/ingress.class` en el Ingress.
Esta anotación nunca se definió formalmente,
pero era ampliamente soportada por los controladores de Ingress.

El nuevo campo `ingressClassName` en los recursos Ingress es un reemplazo para
esa anotación, pero no es un equivalente directo.
Mientras que la anotación se utilizaba generalmente para hacer referencia al
nombre del controlador de Ingress que debería implementar el Ingress, el campo
es una referencia a un recurso IngressClass que contiene configuración adicional
del Ingress, incluyendo el nombre del controlador Ingress.

### IngressClass por defecto {#default-ingress-class}

Puedes marcar un ingressClass en particular por defecto para tu clúster.
Establecer la anotación `ingressclass.kubernetes.io/is-default-class` a `true`
en un recurso IngressClass
asegurará que los nuevos Ingress sin un campo `ingressClassName` especificado
sean asignados a esta IngressClass por defecto.

{{< caution >}}
Si tienes más de una IngressClass marcada por defecto en tu clúster,
el controlador de admisión impide crear objetos que no tienen
un `ingressClassName` especificado.
Puedes resolver esto asegurándote que como máximo 1 IngressClass está marcado
como el predeterminado en tu clúster.
{{< /caution >}}

Existen algunos controladores de ingress,
que funcionan sin una definición de una `ingressClass`.
Por ejemplo, el controlador Ingress-NGINX se puede configurar con
una [opción](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`.
Sin embargo,
se [recomienda](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)
especificar el `IngressClass` predeterminado:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Tipos de Ingress

### Ingress respaldado por un único servicio {#single-service-ingress}

Hay conceptos existentes de Kubernetes que te permiten exponer un Service
único
(mirar [alternativas](#alternativas)).
También puedes hacerlo con un Ingress especificando un *backend predeterminado*
sin reglas.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

Si lo creas usando `kubectl apply -f` podrías mirar el estado del Ingress que
has creado:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Donde `203.0.113.123` es la IP asignada por el controlador Ingress para
satisfacer este Ingress.

{{< note >}}
Los controladores de Ingress y los balanceadores de carga pueden tardar un
minuto o dos en asignar una dirección IP.
Hasta entonces, se podrá ver la dirección marcada como `<pending>`.
{{< /note >}}

### Abanico Simple

Una configuración de abanico enruta el tráfico de una única dirección IP a más
de un Service,
basado en la URI HTTP solicitada.
Un Ingress te permite tener el número de balanceadores de carga al mínimo.
Por ejemplo, una configuración como:

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Figure. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}

Requeriría un Ingress como este:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

Cuando creas el Ingress con `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

El controlador de Ingress aprovisiona un balanceador de cargas específico para
la implementación que satisface al Ingress,
mientras los Services (`service1`, `service2`) existan.

Cuando sea así,
podrás ver la dirección del balanceador de cargas en el campo de dirección.

{{< note >}}

Dependiendo
del [controlador de Ingress](/docs/concepts/services-networking/ingress-controllers/)
que uses, puede que necesites crear
un [Service](/es/docs/concepts/services-networking/service/) default-http-backend.
{{< /note >}}

### Hosting virtual basado en nombre

Los hostings virtuales basados en el nombre soportan enrutado de tráfico HTTP
a nombres hosts múltiples con la misma dirección IP.

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Figure. Ingress Name Based Virtual hosting" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

El siguiente Ingress le dice al balanceador de cargas de respaldo de enrutar las
peticiones basadas en
el [encabezado del Host ](https://tools.ietf.org/html/rfc7230#section-5.4).

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

Si creas un recurso Ingress sin ningún host definido en las reglas,
luego cualquier tráfico web a la dirección IP de tu controlador Ingress puede
coincidir sin requerir un host virtual basado en el nombre.

Por ejemplo, el siguiente Ingress enruta el tráfico solicitado
para `first.bar.com` a `service1`, `second.bar.com` a `service2`,
y cualquier tráfico cuyo encabezado de petición del host no coincida
con `first.bar.com` y `second.bar.com` a `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

Puedes segurizar un Ingress especificando un {{< glossary_tooltip term_id="secret" >}} que contiene una clave privada TLS y un certificado.
El recurso Ingress solo soporta un puerto TLS,
el 443,
y asume la terminación TLS en el punto del ingress
(El tráfico al Service y sus Pods es en texto plano).
Si la sección de configuración TLS especifica hosts diferentes,
se multiplexan en el mismo puerto de acuerdo con el hostname especificado a
través de la extensión TLS SNI (teniendo el cuenta que el controlador de Ingress
soporte SNI).
El secreto TLS debe contener claves llamadas `tls.crt` y `tls.key` que contiene
el certificado y llave privad para usar TLS.
Por ejemplo:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Al hacer referencia a este secreto en un Ingress le indica al controlador
Ingress de segurizar el canal desde el cliente al balanceador de cargas usando
TLS.
Necesitas asegurarte que el secreto TLS que has creado viene de un certificado que
contiene un nombre común (CN), también conocido como Nombre de dominio
calificado (FQDN en inglés)
para `https-example.foo.com`.

{{< note >}}
Ten en cuenta que TLS no funcionará en la regla predeterminada porque los
certificados estarían emitidos para todos los sub-dominios posibles.
Por lo tanto, los `hosts` en la sección `tls` tienen que coincidir
explícitamente con el `host` en la sección `rules`.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Hay una diferencia entre las características TLS soportadas por varios
controladores Ingress.
Mira la documentación
en [nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/), [GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https),
o cualquier otro controlador Ingress específico de plataforma para entender cómo
funciona el TLS en tu entorno.
{{< /note >}}

### Balanceo de cargas {#load-balancing}

Un controlador de Ingress está configurado por defecto con algunos ajustes de
política de balanceo de cargas que aplica a todos los Ingress, como los
algoritmos de balanceo de cargas, esquema de pesos del backend y otros.
Otros conceptos más avanzados de balanceo de cargas (ej., sesiones persistentes,
pesos dinámicos) no están expuestos todavía a través del Ingress.
En su lugar, obtienes estas características a través del balanceador de cargas
usado por un Service.

Vale la pena apuntar que aunque las revisiones de salud no se exponen
directamente a través del Ingress, existen conceptos paralelos en Kubernetes
tales
como [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
que permiten lograr el mismo resultado final.
Revisa la documentación específica del controlador para conocer cómo manejar estas
revisiones de salud (por ejemplo:
[nginx](https://git.k8s.io/ingress-nginx/README.md),
o [GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Actualizando un Ingress

Para actualizar un Ingress existente a un nuevo Host,
puedes actualizarlo editando el recurso:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Esto muestra un editor con la configuración existente en formato YAML.
Modifícalo para incluir el nuevo Host:

```yaml
spec:
  rules:
    - host: foo.bar.com
      http:
        paths:
          - backend:
              service:
                name: service1
                port:
                  number: 80
            path: /foo
            pathType: Prefix
    - host: bar.baz.com
      http:
        paths:
          - backend:
              service:
                name: service2
                port:
                  number: 80
            path: /foo
            pathType: Prefix
  #..
```

Luego de guardar tus cambios,
kubectl actualiza el recurso en el servidor API, que le indica al controlador
Ingress de reconfigurar el balanceador de cargas.

Verifica esto:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Puedes lograr el mismo resultado invocando `kubectl replace -f` en un fichero
YAML de Ingress.

## Fallos a través de zonas de disponibilidad

Las técnicas para distribuir el tráfico entre dominios de falla difieren entre
los proveedores de la nube.
Revisa la documentación
del [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
relevante para detalles.

## Alternativas

Puedes exponer un Service de muchas maneras que no involucran directamente el
recurso Ingress:

* Usa
  un [Service.Type=LoadBalancer](es/docs/concepts/services-networking/service/#loadbalancer)
* Usa
  un [Service.Type=NodePort](es/docs/concepts/services-networking/service/#tipo-nodeport)

## {{% heading "whatsnext" %}}

* Aprende sobre la API
  del [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)
* Aprende
  sobre [Ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Configurar un Ingress en Minikube con el controlador NGINX](/docs/tasks/access-application-cluster/ingress-minikube/)
