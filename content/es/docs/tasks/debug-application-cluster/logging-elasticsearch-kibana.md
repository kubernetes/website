---
content_type: concept
title: Escribiendo Logs con Elasticsearch y Kibana
---

<!-- overview -->

En la plataforma Google Compute Engine (GCE), por defecto da soporte a la escritura de logs haciendo uso de
[Stackdriver Logging](https://cloud.google.com/logging/), el cual se describe en detalle en [Logging con Stackdriver Logging](/docs/user-guide/logging/stackdriver).

Este artículo describe cómo configurar un clúster para la ingesta de logs en
[Elasticsearch](https://www.elastic.co/products/elasticsearch) y su posterior visualización
con [Kibana](https://www.elastic.co/products/kibana), a modo de alternativa a
Stackdriver Logging cuando se utiliza la plataforma GCE.

{{< note >}}
No se puede desplegar de forma automática Elasticsearch o Kibana en un clúster alojado en Google Kubernetes Engine. Hay que desplegarlos de forma manual.
{{< /note >}}



<!-- body -->

Para utilizar Elasticsearch y Kibana para escritura de logs del clúster, deberías configurar
la siguiente variable de entorno que se muestra a continuación como parte de la creación
del clúster con kube-up.sh:

```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

También deberías asegurar que `KUBE_ENABLE_NODE_LOGGING=true` (que es el valor por defecto en la plataforma GCE).

Así, cuando crees un clúster, un mensaje te indicará que la recolección de logs de los daemons de Fluentd
que corren en cada nodo enviará dichos logs a Elasticsearch:

```shell
cluster/kube-up.sh
```
```
...
Project: kubernetes-satnam
Zone: us-central1-b
... calling kube-up
Project: kubernetes-satnam
Zone: us-central1-b
+++ Staging server tars to Google Storage: gs://kubernetes-staging-e6d0e81793/devel
+++ kubernetes-server-linux-amd64.tar.gz uploaded (sha1 = 6987c098277871b6d69623141276924ab687f89d)
+++ kubernetes-salt.tar.gz uploaded (sha1 = bdfc83ed6b60fa9e3bff9004b542cfc643464cd0)
Looking for already existing resources
Starting master and configuring firewalls
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/zones/us-central1-b/disks/kubernetes-master-pd].
NAME                 ZONE          SIZE_GB TYPE   STATUS
kubernetes-master-pd us-central1-b 20      pd-ssd READY
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/regions/us-central1/addresses/kubernetes-master-ip].
+++ Logging using Fluentd to elasticsearch
```

Tanto los pods por nodo de Fluentd, como los pods de Elasticsearch, y los pods de Kibana
 deberían ejecutarse en el namespace de kube-system inmediatamente después
  de que el clúster esté disponible.

```shell
kubectl get pods --namespace=kube-system
```
```
NAME                                           READY     STATUS    RESTARTS   AGE
elasticsearch-logging-v1-78nog                 1/1       Running   0          2h
elasticsearch-logging-v1-nj2nb                 1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-5oq0     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-6896     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-l1ds     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-lz9j     1/1       Running   0          2h
kibana-logging-v1-bhpo8                        1/1       Running   0          2h
kube-dns-v3-7r1l9                              3/3       Running   0          2h
monitoring-heapster-v4-yl332                   1/1       Running   1          2h
monitoring-influx-grafana-v1-o79xf             2/2       Running   0          2h
```

Los pods de `fluentd-elasticsearch` recogen los logs de cada nodo y los envían a los
pods de `elasticsearch-logging`, que son parte de un [servicio](/docs/concepts/services-networking/service/) llamado `elasticsearch-logging`.
Estos pods de Elasticsearch almacenan los logs y los exponen via una API REST.
El pod de `kibana-logging` proporciona una UI via web donde leer los logs almacenados en
Elasticsearch, y es parte de un servicio denominado `kibana-logging`.

Los servicios de Elasticsearch y Kibana ambos están en el namespace `kube-system`
 y no se exponen de forma directa mediante una IP accesible públicamente. Para poder acceder a dichos logs,
sigue las instrucciones acerca de cómo [Acceder a servicios corriendo en un clúster](/docs/concepts/cluster-administration/access-clusater/#accessing-services-running-on-the-cluster).

Si tratas de acceder al servicio de `elasticsearch-logging` desde tu navegador,
verás una página de estado que se parece a la siguiente:

![Estado de Elasticsearch](/images/docs/es-browser.png)

A partir de ese momento, puedes introducir consultas de Elasticsearch directamente en el navegador, si lo necesitas.
Echa un vistazo a la [documentación de Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html)
para más detalles acerca de cómo hacerlo.

De forma alternativa, puedes ver los logs de tu clúster en Kibana (de nuevo usando las
[instrucciones para acceder a un servicio corriendo en un clúster](/docs/user-guide/accessing-the-cluster/#accessing-services-running-on-the-cluster)).
La primera vez que visitas la URL de Kibana se te presentará una página que te pedirá
que configures una vista de los logs. Selecciona la opción de valores de serie temporal
 y luego `@timestamp`. En la página siguiente selecciona la pestaña de `Discover`
y entonces deberías ver todos los logs. Puedes establecer el intervalo de actualización
en 5 segundos para refrescar los logs de forma regular.

Aquí se muestra una vista típica de logs desde el visor de Kibana:

![Kibana logs](/images/docs/kibana-logs.png)



## {{% heading "whatsnext" %}}


¡Kibana te permite todo tipo de potentes opciones para explorar tus logs! Puedes encontrar
algunas ideas para profundizar en el tema en la [documentación de Kibana](https://www.elastic.co/guide/en/kibana/current/discover.html).


