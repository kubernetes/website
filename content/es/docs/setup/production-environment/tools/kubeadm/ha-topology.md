---
reviewers:
- sig-cluster-lifecycle
title: Opciones para topologías de alta disponibilidad
content_type: concept
weight: 50
---

<!-- overview -->

Esta página explica las dos opciones para configurar la topología de tus clústeres de Kubernetes de alta disponibilidad (HA).

Puedes configurar un clúster HA:

- Con nodos del plano de control apilados (stacked), donde los miembros de etcd residen en los mismos nodos del plano de control
- Con nodos de etcd externos, donde etcd se ejecuta en nodos separados del plano de control

Debes considerar cuidadosamente las ventajas y desventajas de cada topología antes de configurar un clúster HA.

{{< note >}}
kubeadm inicia el clúster etcd de forma estática. Consulta la
[Guía de clustering de etcd](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
para más detalles.
{{< /note >}}

<!-- body -->

## Topología de etcd apilado (stacked)

Un clúster HA apilado es una [topología](https://es.wikipedia.org/wiki/Topolog%C3%ADa_de_red) donde el clúster
de almacenamiento de datos distribuido proporcionado por etcd se apila sobre el clúster formado por los nodos gestionados por
kubeadm que ejecutan los componentes del plano de control.

Cada nodo del plano de control ejecuta una instancia de `kube-apiserver`, `kube-scheduler` y `kube-controller-manager`.
El `kube-apiserver` se expone a los nodos de trabajo mediante un balanceador de carga.

Cada nodo del plano de control crea un miembro local de etcd y este miembro de etcd se comunica únicamente con
el `kube-apiserver` de ese nodo. Lo mismo se aplica a las instancias locales de `kube-controller-manager`
y `kube-scheduler`.

Esta topología acopla el plano de control y los miembros de etcd en los mismos nodos. Es más fácil de configurar que un clúster
con nodos de etcd externos y más simple de gestionar para la replicación.

Sin embargo, un clúster apilado corre el riesgo de fallos de acoplamiento. Si un nodo cae, se pierden tanto un miembro de etcd como una instancia
del plano de control, y la redundancia se ve comprometida. Puedes mitigar este riesgo agregando más nodos al plano de control.

Por lo tanto, debes ejecutar un mínimo de tres nodos del plano de control apilados para un clúster HA.

Esta es la topología predeterminada en kubeadm. Se crea automáticamente un miembro local de etcd
en los nodos del plano de control al usar `kubeadm init` y `kubeadm join --control-plane`.

![Topología de etcd apilado](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Topología de etcd externo

Un clúster HA con etcd externo es una [topología](https://es.wikipedia.org/wiki/Topolog%C3%ADa_de_red)
donde el clúster de almacenamiento de datos distribuido proporcionado por etcd es externo al clúster formado por
los nodos que ejecutan componentes del plano de control.

Al igual que en la topología de etcd apilado, cada nodo del plano de control en una topología de etcd externo ejecuta
una instancia de `kube-apiserver`, `kube-scheduler` y `kube-controller-manager`.
Y el `kube-apiserver` se expone a los nodos de trabajo mediante un balanceador de carga. Sin embargo,
los miembros de etcd se ejecutan en hosts separados, y cada host de etcd se comunica con el
`kube-apiserver` de cada nodo del plano de control.

Esta topología desacopla el plano de control y los miembros de etcd. Por lo tanto, proporciona una configuración HA donde
perder una instancia del plano de control o un miembro de etcd tiene menor impacto y no afecta
la redundancia del clúster tanto como la topología HA apilada.

Sin embargo, esta topología requiere el doble de hosts que la topología HA apilada.
Se requiere un mínimo de tres hosts para los nodos del plano de control y tres hosts para los nodos de etcd
para un clúster HA con esta topología.

![Topología de etcd externo](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Configuración de un clúster de alta disponibilidad con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
