---
reviewers:
- davidopp
- lavalamp
title: Consideraciones para clústeres grandes
weight: 10
---

Un clúster es un conjunto de {{< glossary_tooltip text="nodos" term_id="node" >}} (máquinas físicas
o virtuales) que ejecutan agentes de Kubernetes y que administra el
{{< glossary_tooltip text="plano de control" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} admite clústeres de hasta 5.000 nodos. Más específicamente,
Kubernetes está diseñado para admitir configuraciones que cumplan *todos* los siguientes criterios:

* No más de 110 pods por nodo
* No más de 5.000 nodos
* No más de 150.000 pods en total
* No más de 300.000 contenedores en total

Puedes escalar tu clúster agregando o eliminando nodos. La forma de hacerlo depende
de cómo se haya desplegado tu clúster.

## Cuotas de recursos del proveedor de la nube {#quota-issues}

Para evitar problemas con las cuotas del proveedor de la nube, al crear un clúster con muchos nodos,
considera lo siguiente:
* Solicitar un aumento de cuota para recursos de la nube como:
    * Instancias de cómputo
    * CPU
    * Volúmenes de almacenamiento
    * Direcciones IP en uso
    * Conjuntos de reglas de filtrado de paquetes
    * Número de balanceadores de carga
    * Subredes de red
    * Flujos de registros
* Controlar las acciones de escalado del clúster para iniciar nodos nuevos en lotes, con una pausa
  entre lotes, porque algunos proveedores de la nube limitan la velocidad de creación de instancias nuevas.

## Componentes del plano de control

Para un clúster grande, necesitas un plano de control con suficiente capacidad de cómputo y otros
recursos.

Normalmente ejecutarías una o dos instancias del plano de control por zona de fallo,
escalando primero esas instancias verticalmente y después horizontalmente cuando alcancen
el punto de rendimientos decrecientes del escalado vertical.

Debes ejecutar al menos una instancia por zona de fallo para proporcionar tolerancia a fallos. Los nodos
de Kubernetes no dirigen automáticamente el tráfico hacia los endpoints del plano de control que están
en la misma zona de fallo; sin embargo, tu proveedor de la nube puede tener sus propios mecanismos para hacerlo.

Por ejemplo, usando un balanceador de carga administrado, configuras el balanceador para que envíe el tráfico
que se origina en el kubelet y los pods de la zona de fallo _A_ únicamente a los hosts del plano de control
que también están en la zona _A_. Si un solo host o endpoint del plano de control en la zona de fallo _A_ se desconecta,
todo el tráfico del plano de control de los nodos de la zona _A_ se enviará entre zonas. Ejecutar varios hosts del
plano de control en cada zona hace que este resultado sea menos probable.

### Almacenamiento de etcd

Para mejorar el rendimiento de los clústeres grandes, puedes almacenar los objetos Event en una instancia
de etcd separada y dedicada.

Al crear un clúster, puedes (usando herramientas personalizadas):

* iniciar y configurar una instancia adicional de etcd
* configurar el {{< glossary_tooltip term_id="kube-apiserver" text="servidor de API" >}} para que la use para almacenar eventos

Consulta [Operar clústeres de etcd para Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) y
[Configurar un clúster de etcd de alta disponibilidad con kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
para obtener detalles sobre cómo configurar y administrar etcd para un clúster grande.

## Recursos de los addons

Los [límites de recursos](/docs/concepts/configuration/manage-resources-containers/)
de Kubernetes ayudan a minimizar el impacto de las fugas de memoria y otras situaciones en las que los pods y contenedores
pueden afectar a otros componentes. Estos límites de recursos se aplican a los recursos de los
{{< glossary_tooltip text="addons" term_id="addons" >}} del mismo modo que a las cargas de trabajo de las aplicaciones.

Por ejemplo, puedes establecer límites de CPU y memoria para un componente de registro:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Los límites predeterminados de los addons normalmente se basan en datos recopilados a partir de la experiencia
al ejecutar cada addon en clústeres de Kubernetes pequeños o medianos. Al ejecutar addons en clústeres grandes,
a menudo consumen más recursos que los límites predeterminados. Si se despliega un clúster grande sin ajustar estos valores,
el addon puede morir continuamente porque alcanza repetidamente el límite de memoria. Como alternativa, el addon puede
ejecutarse, pero con un rendimiento bajo debido a las restricciones de la fracción de tiempo de CPU.

Para evitar problemas con los recursos de los addons del clúster, al crear un clúster con muchos nodos,
considera lo siguiente:

* Algunos addons escalan verticalmente: hay una réplica del addon para el clúster o para toda una zona de fallo. Para estos addons,
  aumenta las solicitudes y los límites a medida que escalas tu clúster.
* Muchos addons escalan horizontalmente: agregas capacidad ejecutando más pods; pero con un clúster muy grande también puede ser necesario
aumentar ligeramente los límites de CPU o memoria. El [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  puede ejecutarse en modo _recommender_ para proporcionar valores sugeridos para las solicitudes y los límites.
* Algunos addons se ejecutan como una copia por nodo, controlados por un {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: por ejemplo, un agregador de registros a nivel de nodo. Al igual que en el caso de los addons
  escalados horizontalmente, también puede ser necesario aumentar ligeramente los límites de CPU o memoria.

## Priorizar los componentes esenciales del clúster

Para garantizar que los componentes esenciales del clúster (como CoreDNS, metrics-server y otros addons críticos)
se programen antes que otras cargas de trabajo y no sean desalojados por pods de menor prioridad, ejecútalos con una
[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/) del sistema, como `system-cluster-critical` o `system-node-critical`.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` es un recurso personalizado que puedes desplegar en tu clúster
  para ayudarte a administrar las solicitudes y los límites de recursos de los pods.
  Aprende más sobre [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  y cómo puedes usarlo para escalar los componentes del clúster,
  incluidos los addons esenciales para el clúster.

* Lee sobre el [escalado automático de nodos](/docs/concepts/cluster-administration/node-autoscaling/)

* El [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
  te ayuda a cambiar automáticamente el tamaño de los addons a medida que cambia la escala de tu clúster.
