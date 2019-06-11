---
reviewers:
- raelga
title: Pipeline de métricas de recursos
content_template: templates/concept
---

{{% capture overview %}}

Desde Kubernetes 1.8, las métricas de uso de recursos, tales como el uso de CPU y memoria del contenedor,
están disponibles en Kubernetes a través de la API de métricas. Estas métricas son accedidas directamente
por el usuario, por ejemplo usando el comando `kubectl top`, o usadas por un controlador en el cluster,
por ejemplo el Horizontal Pod Autoscaler, para la toma de decisiones.

{{% /capture %}}


{{% capture body %}}

## La API de Métricas

A través de la API de métricas, Metrics API en inglés, puedes obtener la cantidad de recursos usados
actualmente por cada nodo o pod. Esta API no almacena los valores de las métricas,
así que no es posible, por ejemplo, obtener la cantidad de recursos que fueron usados por
un nodo hace 10 minutos.

La API de métricas está completamente integrada en la API de Kubernetes:

- se expone a través del mismo endpoint que las otras APIs de Kubernetes bajo el path `/apis/metrics.k8s.io/`
- ofrece las mismas garantías de seguridad, escalabilidad y confiabilidad

La API está definida en el repositorio [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go). Puedes encontrar
más información sobre la API ahí.

{{< note >}}
La API requiere que el servidor de métricas esté desplegado en el clúster. En otro caso no estará
disponible.
{{< /note >}}

## Servidor de Métricas

El [Servidor de Métricas](https://github.com/kubernetes-incubator/metrics-server) es un agregador
de datos de uso de recursos de todo el clúster.
A partir de Kubernetes 1.8, el servidor de métricas se despliega por defecto como un objeto de
tipo [Deployment](https://github.com/docs/concepts/workloads/controllers/deployment/) en clústeres
creados con el script `kube-up.sh`. Si usas otro mecanismo de configuración de Kubernetes, puedes desplegarlo
usando los [yamls de despliegue](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy)
proporcionados. Está soportado a partir de Kubernetes 1.7 (más detalles al final).

El servidor reune métricas de la Summary API, que es expuesta por el [Kubelet](/docs/admin/kubelet/) en cada nodo.

El servidor de métricas se añadió a la API de Kubernetes utilizando el
[Kubernetes aggregator](/docs/concepts/api-extension/apiserver-aggregation/) introducido en Kubernetes 1.7.

Puedes aprender más acerca del servidor de métricas en el [documento de diseño](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).

{{% /capture %}}
