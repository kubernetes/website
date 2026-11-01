---
reviewers:
- sig-cluster-lifecycle
title: Opciones para topologías de alta disponibilidad
content_type: concept
weight: 50
---

<!-- overview -->

Esta página explica las dos opciones para configurar la topología de clústeres de alta disponibilidad.

Puedes configurar un clúster de alta disponibilidad:

- Con nodos de plano de control apilados, donde los nodos etcd están alojados en los mismos nodos del plano de control
- Con nodos etcd externos, donde etcd se ejecuta en nodos separados a los del plano de control

Deberías considerar minuciosamente las ventajas y desventajas de cada topología antes de configurar un clúster de alta disponibilidad.

{{< note >}}
kubeadm inicializa el clúster etcd de forma estática. Lee la
[Guía de clústeres de etcd](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
para más detalles.
{{< /note >}}

<!-- body -->

## Topología etcd apilada

Un clúster de alta disponibilidad apilado es una [topología](https://en.wikipedia.org/wiki/Network_topology) donde
el clúster de almacenamiento de datos distribuido proporcionado por etcd está apilado encima de un clúster formado por nodos manejados por
kubeadm que ejecutan componentes del plano de control.

Cada nodo de plano de control ejecuta una instancia del `kube-apiserver`, `kube-scheduler`, y `kube-controller-manager`.
El `kube-apiserver` está expuesto a nodos de trabajo utilizando un balanceador de carga.

Cada nodo de plano de control crea un miembro etcd local y este miembro etcd se comunica únicamente con
el `kube-apiserver` de este nodo. Lo mismo aplica para las instancias locales de `kube-controller-manager`
y `kube-scheduler`.

Esta topología acopla los planos de control y los miembros etcd en los mismos nodos. Es más simple de configurar que un clúster
con nodos etcd externos, y más simple de gestionar la replicación.

Sin embargo, un clúster apilado corre el riesgo de fallos de acoplamiento. Si uno de los nodos falla, se pierden tanto un miembro de etcd como una instancia del plano de control,
y se compromete la redundancia. Puedes mitigar el riesgo añadiendo más nodos de plano de control.

Deberías, por lo tanto, ejecutar un mínimo de tres nodos de plano de control apilados para un clúster de alta disponibilidad.

Esta es la topología predeterminada en kubeadm. Un miembro etcd local es creado automáticamente
en los nodos de plano de control cuando utilizas `kubeadm init` y `kubeadm join --control-plane`.

![Topología etcd apilada](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Topología etcd externa

Un clúster de alta disponibilidad con etcd externo es una [topología](https://en.wikipedia.org/wiki/Network_topology)
donde el clúster de almacenamiento de datos distribuido proporcionado por etcd es externo al clúster formado por
nodos que ejecutan componentes del plano de control.

De la misma forma que la topología etcd apilada, cada nodo de plano de control en una topología etcd externa ejecuta
una instancia de `kube-apiserver`, `kube-scheduler`, y `kube-controller-manager`.
Y el `kube-apiserver` está expuesto a nodos de trabajo utilizando un balanceador de carga. Sin embargo,
los miembros etcd se ejecutan en hosts separados, y cada host etcd se comunica con el
`kube-apiserver` de cada nodo de plano de control.

Esta topología desacopla el plano de control y el miembro etcd. Por lo tanto, proporciona una configuración de alta disponibilidad donde
perder una instancia de plano de control o un miembro etcd tiene menos impacto y no afecta
la redundancia del clúster tanto como la topología de alta disponibilidad apilada.

Sin embargo, esta topología requiere el doble de número de hosts de la topología de alta disponibilidad apilada.
Se requiere un mínimo de tres hosts para los nodos de plano de control y tres para los nodos etcd
para un clúster de alta disponibilidad con esta topología.

![Topología etcd externa](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Configura un clúster de alta disponibilidad con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
