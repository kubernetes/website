---
title: Escribiendo Logs con Stackdriver
content_type: concept
---

<!-- overview -->

Antes de seguir leyendo esta página, deberías familiarizarte con el
[resumen de escritura de logs en Kubernetes](/docs/concepts/cluster-administration/logging).

{{< note >}}
Por defecto, Stackdriver recolecta toda la salida estándar de tus contenedores, así
como el flujo de la salida de error. Para recolectar cualquier log tu aplicación escribe en un archivo (por ejemplo),
ver la [estrategia de sidecar](/docs/concepts/cluster-administration/logging#sidecar-container-with-a-logging-agent)
en el resumen de escritura de logs en Kubernetes.
{{< /note >}}




<!-- body -->

## Despliegue

Para ingerir logs, debes desplegar el agente de Stackdriver Logging en cada uno de los nodos de tu clúster.
Dicho agente configura una instancia de `fluentd`, donde la configuración se guarda en un `ConfigMap`
y las instancias se gestionan a través de un `DaemonSet` de Kubernetes. El despliegue actual del
`ConfigMap` y el `DaemonSet` dentro de tu clúster depende de tu configuración individual del clúster.

### Desplegar en un nuevo clúster

#### Google Kubernetes Engine

Stackdriver es la solución por defecto de escritura de logs para aquellos clústeres desplegados en Google Kubernetes Engine.
Stackdriver Logging se despliega por defecto en cada clúster a no ser que se le indique de forma explícita no hacerlo.

#### Otras plataformas

Para desplegar Stackdriver Logging en un *nuevo* clúster que estés creando con
`kube-up.sh`, haz lo siguiente:

1. Configura la variable de entorno `KUBE_LOGGING_DESTINATION` con el valor `gcp`.
1. **Si no estás trabajando en GCE**, incluye `beta.kubernetes.io/fluentd-ds-ready=true`
en la variable `KUBE_NODE_LABELS`.

Una vez que tu clúster ha arrancado, cada nodo debería ejecutar un agente de Stackdriver Logging.
Los `DaemonSet` y `ConfigMap` se configuran como extras. Si no estás usando `kube-up.sh`,
considera la posibilidad de arrancar un clúster sin una solución pre-determinada de escritura de logs
y entonces desplegar los agentes de Stackdriver Logging una vez el clúster esté ejecutándose.

{{< warning >}}
El proceso de Stackdriver Logging reporta problemas conocidos en plataformas distintas
a Google Kubernetes Engine. Úsalo bajo tu propio riesgo.
{{< /warning >}}

### Desplegar a un clúster existente

1. Aplica una etiqueta en cada nodo, si no estaba presente ya.

    El despliegue del agente de Stackdriver Logging utiliza etiquetas de nodo para
    determinar en qué nodos debería desplegarse. Estas etiquetas fueron introducidas
    para distinguir entre nodos de Kubernetes de la versión 1.6 o superior.
    Si el clúster se creó con Stackdriver Logging configurado y el nodo tiene la
    versión 1.5.X o inferior, ejecutará fluentd como un pod estático. Puesto que un nodo
    no puede tener más de una instancia de fluentd, aplica únicamente las etiquetas
    a los nodos que no tienen un pod de fluentd ya desplegado. Puedes confirmar si tu nodo
    ha sido etiquetado correctamente ejecutando `kubectl describe` de la siguiente manera:

    ```
    kubectl describe node $NODE_NAME
    ```

    La salida debería ser similar a la siguiente:

    ```
    Name:           NODE_NAME
    Role:
    Labels:         beta.kubernetes.io/fluentd-ds-ready=true
    ...
    ```

    Asegúrate que la salida contiene la etiqueta `beta.kubernetes.io/fluentd-ds-ready=true`.
    Si no está presente, puedes añadirla usando el comando `kubectl label` como se indica:

    ```
    kubectl label node $NODE_NAME beta.kubernetes.io/fluentd-ds-ready=true
    ```

    {{< note >}}
    Si un nodo falla y tiene que volver a crearse, deberás volver a definir
    la etiqueta al nuevo nodo. Para facilitar esta tarea, puedes utilizar el
    parámetro de línea de comandos del Kubelet para aplicar dichas etiquetas
    cada vez que se arranque un nodo.
    {{< /note >}}

1. Despliega un `ConfigMap` con la configuración del agente de escritura de logs ejecutando el siguiente comando:

    ```
    kubectl apply -f https://k8s.io/examples/debug/fluentd-gcp-configmap.yaml
    ```

    Este comando crea el `ConfigMap` en el espacio de nombres `default`. Puedes descargar el archivo
    manualmente y cambiarlo antes de crear el objeto `ConfigMap`.

1. Despliega el agente `DaemonSet` de escritura de logs ejecutando el siguiente comando:

    ```
    kubectl apply -f https://k8s.io/examples/debug/fluentd-gcp-ds.yaml
    ```

    Puedes descargar y editar este archivo antes de usarlo igualmente.

## Verificar el despliegue de tu agente de escritura de logs

Tras el despliegue del `DaemonSet` de StackDriver, puedes comprobar el estado de
cada uno de los despliegues de los agentes ejecutando el siguiente comando:

```shell
kubectl get ds --all-namespaces
```

Si tienes 3 nodos en el clúster, la salida debería ser similar a esta:

```
NAMESPACE     NAME               DESIRED   CURRENT   READY     NODE-SELECTOR                              AGE
...
default       fluentd-gcp-v2.0   3         3         3         beta.kubernetes.io/fluentd-ds-ready=true   5m
...
```
Para comprender cómo funciona Stackdriver, considera la siguiente especificación
de un generador de logs sintéticos [counter-pod.yaml](/examples/debug/counter-pod.yaml):

{{< codenew file="debug/counter-pod.yaml" >}}

Esta especificación de pod tiene un contenedor que ejecuta una secuencia de comandos bash
que escribe el valor de un contador y la fecha y hora cada segundo, de forma indefinida.
Vamos a crear este pod en el espacio de nombres por defecto.

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

Puedes observar el pod corriendo:

```shell
kubectl get pods
```
```
NAME                                           READY     STATUS    RESTARTS   AGE
counter                                        1/1       Running   0          5m
```

Durante un período de tiempo corto puedes observar que el estado del pod es 'Pending', debido a que el kubelet
tiene primero que descargar la imagen del contenedor. Cuando el estado del pod cambia a `Running`
puedes usar el comando `kubectl logs` para ver la salida de este pod contador.

```shell
kubectl logs counter
```
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

Como se describe en el resumen de escritura de logs, este comando visualiza las entradas de logs
del archivo de logs del contenedor. Si se termina el contenedor y Kubernetes lo reinicia,
todavía puedes acceder a los logs de la ejecución previa del contenedor. Sin embargo,
si el pod se desaloja del nodo, los archivos de log se pierden. Vamos a demostrar este
comportamiento mediante el borrado del contenedor que ejecuta nuestro contador:

```shell
kubectl delete pod counter
```
```
pod "counter" deleted
```

y su posterior re-creación:

```shell
kubectl create -f https://k8s.io/examples/debug/counter-pod.yaml
```
```
pod/counter created
```

Tras un tiempo, puedes acceder a los logs del pod contador otra vez:

```shell
kubectl logs counter
```
```
0: Mon Jan  1 00:01:00 UTC 2001
1: Mon Jan  1 00:01:01 UTC 2001
2: Mon Jan  1 00:01:02 UTC 2001
...
```

Como era de esperar, únicamente se visualizan las líneas de log recientes. Sin embargo,
para una aplicación real seguramente prefieras acceder a los logs de todos los contenedores,
especialmente cuando te haga falta depurar problemas. Aquí es donde haber habilitado
Stackdriver Logging puede ayudarte.

## Ver logs

El agente de Stackdriver Logging asocia metadatos a cada entrada de log, para que puedas usarlos posteriormente
en consultas para seleccionar sólo los mensajes que te interesan: por ejemplo,
los mensajes de un pod en particular.

Los metadatos más importantes son el tipo de recurso y el nombre del log.
El tipo de recurso de un log de contenedor tiene el valor `container`, que se muestra como
`GKE Containers` en la UI (incluso si el clúster de Kubernetes no está en Google Kubernetes Engine).
El nombre de log es el nombre del contenedor, de forma que si tienes un pod con
dos contenedores, denominados `container_1` y `container_2` en la especificación, sus logs
tendrán los nombres `container_1` y `container_2` respectivamente.

Los componentes del sistema tienen el valor `compute` como tipo de recursos, que se muestra como
`GCE VM Instance` en la UI. Los nombres de log para los componentes del sistema son fijos.
Para un nodo de Google Kubernetes Engine, cada entrada de log de cada componente de sistema tiene uno de los siguientes nombres:

* docker
* kubelet
* kube-proxy

Puedes aprender más acerca de cómo visualizar los logs en la [página dedicada a Stackdriver](https://cloud.google.com/logging/docs/view/logs_viewer).

Uno de los posibles modos de ver los logs es usando el comando de línea de interfaz
[`gcloud logging`](https://cloud.google.com/logging/docs/api/gcloud-logging)
del [SDK de Google Cloud](https://cloud.google.com/sdk/).
Este comando usa la [sintaxis de filtrado](https://cloud.google.com/logging/docs/view/advanced_filters) de StackDriver Logging
para consultar logs específicos. Por ejemplo, puedes ejecutar el siguiente comando:

```none
gcloud beta logging read 'logName="projects/$YOUR_PROJECT_ID/logs/count"' --format json | jq '.[].textPayload'
```
```
...
"2: Mon Jan  1 00:01:02 UTC 2001\n"
"1: Mon Jan  1 00:01:01 UTC 2001\n"
"0: Mon Jan  1 00:01:00 UTC 2001\n"
...
"2: Mon Jan  1 00:00:02 UTC 2001\n"
"1: Mon Jan  1 00:00:01 UTC 2001\n"
"0: Mon Jan  1 00:00:00 UTC 2001\n"
```

Como puedes observar, muestra los mensajes del contenedor contador tanto de la
primera como de la segunda ejecución, a pesar de que el kubelet ya había eliminado los logs del primer contenedor.

### Exportar logs

Puedes exportar los logs al [Google Cloud Storage](https://cloud.google.com/storage/)
o a [BigQuery](https://cloud.google.com/bigquery/) para llevar a cabo un análisis más profundo.
Stackdriver Logging ofrece el concepto de destinos, donde puedes especificar el destino de
las entradas de logs. Más información disponible en la [página de exportación de logs](https://cloud.google.com/logging/docs/export/configure_export_v2) de StackDriver.

## Configurar los agentes de Stackdriver Logging

En ocasiones la instalación por defecto de Stackdriver Logging puede que no se ajuste a tus necesidades, por ejemplo:

* Puede que quieras añadir más recursos porque el rendimiento por defecto no encaja con tus necesidades.
* Puede que quieras añadir un parseo adicional para extraer más metadatos de tus mensajes de log,
como la severidad o referencias al código fuente.
* Puede que quieras enviar los logs no sólo a Stackdriver o sólo enviarlos a Stackdriver parcialmente.

En cualquiera de estos casos, necesitas poder cambiar los parámetros del `DaemonSet` y el `ConfigMap`.

### Prerequisitos

Si estás usando GKE y Stackdriver Logging está habilitado en tu clúster, no puedes
cambiar su configuración, porque ya está gestionada por GKE.
Sin embargo, puedes deshabilitar la integración por defecto y desplegar la tuya propia.

{{< note >}}
Tendrás que mantener y dar soporte tú mismo a la nueva configuración desplegada:
actualizar la imagen y la configuración, ajustar los recuros y todo eso.
{{< /note >}}

Para deshabilitar la integración por defecto, usa el siguiente comando:

```
gcloud beta container clusters update --logging-service=none CLUSTER
```

Puedes encontrar notas acerca de cómo instalar los agentes de Stackdriver Logging
 en un clúster ya ejecutándose en la [sección de despliegue](#deploying).

### Cambiar los parámetros del `DaemonSet`

Cuando tienes un `DaemonSet` de Stackdriver Logging en tu clúster, puedes simplemente
modificar el campo `template` en su especificación, y el controlador del daemonset actualizará los pods por ti. Por ejemplo,
asumamos que acabas de instalar el Stackdriver Logging como se describe arriba. Ahora quieres cambiar
el límite de memoria que se le asigna a fluentd para poder procesar más logs de forma segura.

Obtén la especificación del `DaemonSet` que corre en tu clúster:

```shell
kubectl get ds fluentd-gcp-v2.0 --namespace kube-system -o yaml > fluentd-gcp-ds.yaml
```

A continuación, edita los requisitos del recurso en el `spec` y actualiza el objeto `DaemonSet`
en el apiserver usando el siguiente comando:

```shell
kubectl replace -f fluentd-gcp-ds.yaml
```

Tras un tiempo, los pods de agente de Stackdriver Logging se reiniciarán con la nueva configuración.

### Cambiar los parámetros de fluentd

La configuración de Fluentd se almacena en un objeto `ConfigMap`. Realmente se trata de un conjunto
de archivos de configuración que se combinan conjuntamente. Puedes aprender acerca de
la configuración de fluentd en el [sitio oficial](http://docs.fluentd.org).

Imagina que quieres añadir una nueva lógica de parseo a la configuración actual, de forma que fluentd pueda entender
el formato de logs por defecto de Python. Un filtro apropiado de fluentd para conseguirlo sería:

```
<filter reform.**>
  type parser
  format /^(?<severity>\w):(?<logger_name>\w):(?<log>.*)/
  reserve_data true
  suppress_parse_error_log true
  key_name log
</filter>
```

Ahora tienes que añadirlo a la configuración actual y que los agentes de Stackdriver Logging la usen.
Para ello, obtén la versión actual del `ConfigMap` de Stackdriver Logging de tu clúster
ejecutando el siguiente comando:

```shell
kubectl get cm fluentd-gcp-config --namespace kube-system -o yaml > fluentd-gcp-configmap.yaml
```

Luego, como valor de la clave `containers.input.conf`, inserta un nuevo filtro justo después
de la sección `source`.

{{< note >}}
El orden es importante.
{{< /note >}}

Actualizar el `ConfigMap` en el apiserver es más complicado que actualizar el `DaemonSet`.
Es mejor considerar que un `ConfigMap` es inmutable. Así, para poder actualizar la configuración, deberías
crear un nuevo `ConfigMap` con otro nombre y cambiar el `DaemonSet` para que apunte al nuevo
siguiendo la [guía de arriba](#changing-daemonset-parameters).

### Añadir plugins de fluentd

Fluentd está desarrollado en Ruby y permite extender sus capacidades mediante el uso de
[plugins](http://www.fluentd.org/plugins). Si quieres usar un plugin que no está incluido en
la imagen por defecto del contenedor de Stackdriver Logging, debes construir tu propia imagen.
Imagina que quieres añadir un destino Kafka para aquellos mensajes de un contenedor en particular
para poder procesarlos posteriormente. Puedes reusar los [fuentes de imagen de contenedor](https://git.k8s.io/contrib/fluentd/fluentd-gcp-image)
con algunos pequeños cambios:

* Cambia el archivo Makefile para que apunte a tu repositorio de contenedores, ej. `PREFIX=gcr.io/<your-project-id>`.
* Añade tu dependencia al archivo Gemfile, por ejemplo `gem 'fluent-plugin-kafka'`.

Luego, ejecuta `make build push` desde ese directorio. Cuando el `DaemonSet` haya tomado los cambios de la nueva imagen,
podrás usar el plugin que has indicado en la configuración de fluentd.


