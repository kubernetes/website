---
content_type: concept
title: Auditoría
---

<!-- overview -->

La auditoría de Kubernetes proporciona un conjunto de registros cronológicos referentes a la seguridad
que documentan la secuencia de actividades que tanto los usuarios individuales, como 
los administradores y otros componentes del sistema ha realizado en el sistema.
 Así, permite al administrador del clúster responder a las siguientes cuestiones:

 - ¿qué ha pasado?
 - ¿cuándo ha pasado?
 - ¿quién lo ha iniciado?
 - ¿sobre qué ha pasado?
 - ¿dónde se ha observado?
 - ¿desde dónde se ha iniciado?
 - ¿hacia dónde iba?




<!-- body -->

El componente [Kube-apiserver][kube-apiserver] lleva a cabo la auditoría. Cada petición en cada fase
de su ejecución genera un evento, que se pre-procesa según un cierto reglamento y 
se escribe en un backend. Este reglamento determina lo que se audita
y los backends persisten los registros. Las implementaciones actuales de backend
incluyen los archivos de logs y los webhooks.

Cada petición puede grabarse junto con una "etapa" asociada. Las etapas conocidas son:

- `RequestReceived` - La etapa para aquellos eventos generados tan pronto como 
el responsable de la auditoría recibe la petición, pero antes de que sea delegada al
siguiente responsable en la cadena.
- `ResponseStarted` - Una vez que las cabeceras de la respuesta se han enviado,
pero antes de que el cuerpo de la respuesta se envíe. Esta etapa sólo se genera
en peticiones de larga duración (ej. watch).
- `ResponseComplete` - El cuerpo de la respuesta se ha completado y no se enviarán más bytes.
- `Panic` - Eventos que se generan cuando ocurre una situación de pánico.

{{< note >}}
La característica de registro de auditoría incrementa el consumo de memoria del servidor API
porque requiere de contexto adicional para lo que se audita en cada petición.
De forma adicional, el consumo de memoria depende de la configuración misma del registro.
{{< /note >}}

## Reglamento de Auditoría

El reglamento de auditoría define las reglas acerca de los eventos que deberían registrarse y 
los datos que deberían incluir. La estructura del objeto de reglas de auditoría se define 
en el [`audit.k8s.io` grupo de API][auditing-api]. Cuando se procesa un evento, se compara
con la lista de reglas en orden. La primera regla coincidente establece el "nivel de auditoría"
del evento. Los niveles de auditoría conocidos son:

- `None` - no se registra eventos que disparan esta regla.
- `Metadata` - se registra los metadatos de la petición (usuario que la realiza, marca de fecha y hora, recurso,
  verbo, etc.), pero no la petición ni el cuerpo de la respuesta.
- `Request` - se registra los metadatos del evento y el cuerpo de la petición, pero no el cuerpo de la respuesta.
  Esto no aplica para las peticiones que no son de recurso.
- `RequestResponse` - se registra los metadatos del evento, y los cuerpos de la petición y la respuesta.
  Esto no aplica para las peticiones que no son de recurso.

Es posible indicar un archivo al definir el reglamento en el [kube-apiserver][kube-apiserver]
usando el parámetro `--audit-policy-file`. Si dicho parámetros se omite, no se registra ningún evento.
Nótese que el campo `rules` __debe__ proporcionarse en el archivo del reglamento de auditoría.
Un reglamento sin (0) reglas se considera ilegal.

Abajo se presenta un ejemplo de un archivo de reglamento de auditoría:

{{% codenew file="audit/audit-policy.yaml" %}}

Puedes usar un archivo mínimo de reglamento de auditoría para registrar todas las peticiones al nivel `Metadata` de la siguiente forma:

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

El [perfil de auditoría utilizado por GCE][gce-audit-profile] debería servir como referencia para
que los administradores construyeran sus propios perfiles de auditoría.

## Backends de auditoría

Los backends de auditoría persisten los eventos de auditoría en un almacenamiento externo.
El [Kube-apiserver][kube-apiserver] por defecto proporciona tres backends:

- Backend de logs, que escribe los eventos en disco
- Backend de webhook, que envía los eventos a una API externa
- Backend dinámico, que configura backends de webhook a través de objetos de la API AuditSink.

En todos los casos, la estructura de los eventos de auditoría se define por la API del grupo 
`audit.k8s.io`. La versión actual de la API es
[`v1`][auditing-api].

{{< note >}}
En el caso de parches, el cuerpo de la petición es una matriz JSON con operaciones de parcheado, en vez
de un objeto JSON que incluya el objeto de la API de Kubernetes apropiado. Por ejemplo, 
el siguiente cuerpo de mensaje es una petición de parcheado válida para
`/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`.

```json
[
  {
    "op": "replace",
    "path": "/spec/parallelism",
    "value": 0
  },
  {
    "op": "remove",
    "path": "/spec/template/spec/containers/0/terminationMessagePolicy"
  }
]
```
{{< /note >}}

### Backend de Logs

El backend de logs escribe los eventos de auditoría a un archivo en formato JSON.
 Puedes configurar el backend de logs de auditoría usando el siguiente
 parámetro de [kube-apiserver][kube-apiserver] flags:

- `--audit-log-path` especifica la ruta al archivo de log que el backend utiliza para 
escribir los eventos de auditoría. Si no se especifica, se deshabilita el backend de logs. `-` significa salida estándar
- `--audit-log-maxage` define el máximo número de días a retener los archivos de log
- `--audit-log-maxbackup` define el máximo número de archivos de log a retener
- `--audit-log-maxsize` define el tamaño máximo en megabytes del archivo de logs antes de ser rotado

### Backend de Webhook

El backend de Webhook envía eventos de auditoría a una API remota, que se supone es la misma API
que expone el [kube-apiserver][kube-apiserver]. Puedes configurar el backend de webhook de auditoría usando
los siguientes parámetros de kube-apiserver:

- `--audit-webhook-config-file` especifica la ruta a un archivo con configuración del webhook. 
La configuración del webhook es, de hecho, un archivo [kubeconfig][kubeconfig].
- `--audit-webhook-initial-backoff` especifica la cantidad de tiempo a esperar tras una petición fallida
antes de volver a intentarla. Los reintentos posteriores se ejecutan con retraso exponencial.

El archivo de configuración del webhook usa el formato kubeconfig para especificar la dirección remota
del servicio y las credenciales para conectarse al mismo.

En la versión 1.13, los backends de webhook pueden configurarse [dinámicamente](#dynamic-backend).

### Procesamiento por lotes

Tanto el backend de logs como el de webhook permiten procesamiento por lotes. Si usamos el webhook como ejemplo,
 aquí se muestra la lista de parámetros disponibles. Para aplicar el mismo parámetro al backend de logs,
  simplemente sustituye `webhook` por `log` en el nombre del parámetro. Por defecto, 
  el procesimiento por lotes está habilitado en `webhook` y deshabilitado en `log`. De forma similar,
  por defecto la regulación (throttling) está habilitada en `webhook` y deshabilitada en `log`.

- `--audit-webhook-mode` define la estrategia de memoria intermedia (búfer), que puede ser una de las siguientes:
  - `batch` - almacenar eventos y procesarlos de forma asíncrona en lotes. Esta es la estrategia por defecto.
  - `blocking` - bloquear todas las respuestas del servidor API al procesar cada evento de forma individual.
  - `blocking-strict` - igual que blocking, pero si ocurre un error durante el registro de la audtoría en la etapa RequestReceived, la petición completa al apiserver fallará.

Los siguientes parámetros se usan únicamente en el modo `batch`:

- `--audit-webhook-batch-buffer-size` define el número de eventos a almacenar de forma intermedia antes de procesar por lotes.
  Si el ritmo de eventos entrantes desborda la memoria intermedia, dichos eventos se descartan.
- `--audit-webhook-batch-max-size` define el número máximo de eventos en un único proceso por lotes.
- `--audit-webhook-batch-max-wait` define la cantidad máxima de tiempo a esperar de forma incondicional antes de procesar los eventos de la cola.
- `--audit-webhook-batch-throttle-qps` define el promedio máximo de procesos por lote generados por segundo.
- `--audit-webhook-batch-throttle-burst` define el número máximo de procesos por lote generados al mismo tiempo si el QPS permitido no fue usado en su totalidad anteriormente.

#### Ajuste de parámetros

Los parámetros deberían ajustarse a la carga del apiserver.

Por ejemplo, si kube-apiserver recibe 100 peticiones por segundo, y para cada petición se audita
las etapas `ResponseStarted` y `ResponseComplete`, deberías esperar unos ~200 
eventos de auditoría generados por segundo. Asumiendo que hay hasta 100 eventos en un lote,
deberías establecer el nivel de regulación (throttling) por lo menos a 2 QPS. Además, asumiendo 
que el backend puede tardar hasta 5 segundos en escribir eventos, deberías configurar el tamaño de la memoria intermedia para almacenar hasta 5 segundos de eventos, esto es,
10 lotes, o sea, 1000 eventos.

En la mayoría de los casos, sin embargo, los valores por defecto de los parámetros 
deberían ser suficientes y no deberías preocuparte de ajustarlos manualmente.
Puedes echar un vistazo a la siguientes métricas de Prometheus que expone kube-apiserver 
y también los logs para monitorizar el estado del subsistema de auditoría:

- `apiserver_audit_event_total` métrica que contiene el número total de eventos de auditoría exportados.
- `apiserver_audit_error_total` métrica que contiene el número total de eventos descartados debido a un error durante su exportación.

### Truncado

Tanto el backend de logs como el de webhook permiten truncado. Como ejemplo, aquí se indica la
lista de parámetros disponible para el backend de logs:

 - `audit-log-truncate-enabled` indica si el truncado de eventos y por lotes está habilitado.
 - `audit-log-truncate-max-batch-size` indica el tamaño máximo en bytes del lote enviado al backend correspondiente.
 - `audit-log-truncate-max-event-size` indica el tamaño máximo en bytes del evento de auditoría enviado al backend correspondiente.

Por defecto, el truncado está deshabilitado tanto en `webhook` como en `log`; un administrador del clúster debe configurar bien el parámetro `audit-log-truncate-enabled` o `audit-webhook-truncate-enabled` para habilitar esta característica.

### Backend dinámico

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

En la versión 1.13 de Kubernetes, puedes configurar de forma dinámica los backends de auditoría usando objetos de la API AuditSink.

Para habilitar la auditoría dinámica, debes configurar los siguientes parámetros de apiserver:

- `--audit-dynamic-configuration`: el interruptor principal. Cuando esta característica sea GA, el único parámetro necesario.
- `--feature-gates=DynamicAuditing=true`: en evaluación en alpha y beta.
- `--runtime-config=auditregistration.k8s.io/v1alpha1=true`: habilitar la API.

Cuando se habilita, un objeto AuditSink se provisiona de la siguiente forma:

```yaml
apiVersion: auditregistration.k8s.io/v1alpha1
kind: AuditSink
metadata:
  name: mysink
spec:
  policy:
    level: Metadata
    stages:
    - ResponseComplete
  webhook:
    throttle:
      qps: 10
      burst: 15
    clientConfig:
      url: "https://audit.app"
```

Para una definición completa de la API, ver [AuditSink](/docs/reference/generated/kubernetes-api/v1.13/#auditsink-v1alpha1-auditregistration). Múltiples objetos existirán como soluciones independientes.

Aquellos backends estáticos que se configuran con parámetros en tiempo de ejecución no se ven impactados por esta característica.
 Sin embargo, estos backends dinámicos comparten las opciones de truncado del webhook estático, de forma que si dichas opciones se configura con parámetros en tiempo de ejecución, entonces se aplican a todos los backends dinámicos.

#### Reglamento

El reglamento de AuditSink es diferente del de la auditoría en tiempo de ejecución. Esto es debido a que el objeto de la API sirve para casos de uso diferentes. El reglamento continuará
evolucionando para dar cabida a más casos de uso.

El campo `level` establece el nivel de auditoría indicado a todas las peticiones. El campo `stages` es actualmente una lista de las etapas que se permite registrar.

#### Seguridad

Los administradores deberían tener en cuenta que permitir el acceso en modo escritura de esta característica otorga el modo de acceso de lectura
a toda la información del clúster. Así, el acceso debería gestionarse como un privilegio de nivel `cluster-admin`.

#### Rendimiento

Actualmente, esta característica tiene implicaciones en el apiserver en forma de incrementos en el uso de la CPU y la memoria. 
Aunque debería ser nominal cuando se trata de un número pequeño de destinos, se realizarán pruebas adicionales de rendimiento para entender su impacto real antes de que esta API pase a beta.

## Configuración multi-clúster

Si estás extendiendo la API de Kubernetes mediante la [capa de agregación][kube-aggregator], puedes también
configurar el registro de auditoría para el apiserver agregado. Para ello, pasa las opciones
de configuración en el mismo formato que se describe arriba al apiserver agregado 
y configura el mecanismo de ingestión de logs para que recolecte los logs de auditoría. 
Cada uno de los apiservers puede tener configuraciones de auditoría diferentes con
diferentes reglamentos de auditoría.

## Ejemplos de recolectores de Logs

### Uso de fluentd para recolectar y distribuir eventos de auditoría a partir de un archivo de logs

[Fluentd][fluentd] es un recolector de datos de libre distribución que proporciona una capa unificada de registros.
En este ejemplo, usaremos fluentd para separar los eventos de auditoría por nombres de espacio:

1. Instala [fluentd][fluentd_install_doc], fluent-plugin-forest y fluent-plugin-rewrite-tag-filter en el nodo donde corre kube-apiserver
{{< note >}}
Fluent-plugin-forest y fluent-plugin-rewrite-tag-filter son plugins de fluentd. Puedes obtener detalles de la instalación de estos plugins en el documento [fluentd plugin-management][fluentd_plugin_management_doc].
{{< /note >}}

1. Crea un archivo de configuración para fluentd:

    ```
    cat <<'EOF' > /etc/fluentd/config
    # fluentd conf runs in the same host with kube-apiserver
    <source>
        @type tail
        # audit log path of kube-apiserver
        path /var/log/kube-audit
        pos_file /var/log/audit.pos
        format json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%N%z
        tag audit
    </source>

    <filter audit>
        #https://github.com/fluent/fluent-plugin-rewrite-tag-filter/issues/13
        @type record_transformer
        enable_ruby
        <record>
         namespace ${record["objectRef"].nil? ? "none":(record["objectRef"]["namespace"].nil? ? "none":record["objectRef"]["namespace"])}
        </record>
    </filter>

    <match audit>
        # route audit according to namespace element in context
        @type rewrite_tag_filter
        <rule>
            key namespace
            pattern /^(.+)/
            tag ${tag}.$1
        </rule>
    </match>

    <filter audit.**>
       @type record_transformer
       remove_keys namespace
    </filter>

    <match audit.**>
        @type forest
        subtype file
        remove_prefix audit
        <template>
            time_slice_format %Y%m%d%H
            compress gz
            path /var/log/audit-${tag}.*.log
            format json
            include_time_key true
        </template>
    </match>
    EOF
    ```

1. Arranca fluentd:

    ```shell
    fluentd -c /etc/fluentd/config  -vv
    ```

1. Arranca el componente kube-apiserver con las siguientes opciones:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
    ```

1. Comprueba las auditorías de los distintos espacios de nombres en `/var/log/audit-*.log`

### Uso de logstash para recolectar y distribuir eventos de auditoría desde un backend de webhook

[Logstash][logstash] es una herramienta de libre distribución de procesamiento de datos en servidor. 
En este ejemplo, vamos a usar logstash para recolectar eventos de auditoría a partir de un backend de webhook, 
y grabar los eventos de usuarios diferentes en archivos distintos.

1. Instala [logstash][logstash_install_doc]

1. Crea un archivo de configuración para logstash:

    ```
    cat <<EOF > /etc/logstash/config
    input{
        http{
            #TODO, figure out a way to use kubeconfig file to authenticate to logstash
            #https://www.elastic.co/guide/en/logstash/current/plugins-inputs-http.html#plugins-inputs-http-ssl
            port=>8888
        }
    }
    filter{
        split{
            # Webhook audit backend sends several events together with EventList
            # split each event here.
            field=>[items]
            # We only need event subelement, remove others.
            remove_field=>[headers, metadata, apiVersion, "@timestamp", kind, "@version", host]
        }
        mutate{
            rename => {items=>event}
        }
    }
    output{
        file{
            # Audit events from different users will be saved into different files.
            path=>"/var/log/kube-audit-%{[event][user][username]}/audit"
        }
    }
    EOF
    ```

1. Arranca logstash:

    ```shell
    bin/logstash -f /etc/logstash/config --path.settings /etc/logstash/
    ```

1. Crea un [archivo kubeconfig](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) para el webhook del backend de auditoría de kube-apiserver:

        cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
        apiVersion: v1
        clusters:
        - cluster:
            server: http://<ip_of_logstash>:8888
          name: logstash
        contexts:
        - context:
            cluster: logstash
            user: ""
          name: default-context
        current-context: default-context
        kind: Config
        preferences: {}
        users: []
        EOF

1. Arranca kube-apiserver con las siguientes opciones:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```

1. Comprueba las auditorías en los directorios `/var/log/kube-audit-*/audit` de los nodos de logstash 

Nótese que además del plugin para salida en archivos, logstash ofrece una variedad de salidas adicionales
que permiten a los usuarios enviar la información donde necesiten. Por ejemplo, se puede enviar los eventos de auditoría
al plugin de elasticsearch que soporta búsquedas avanzadas y analíticas.

[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd
[fluentd_plugin_management_doc]: https://docs.fluentd.org/v1.0/articles/plugin-management
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation


