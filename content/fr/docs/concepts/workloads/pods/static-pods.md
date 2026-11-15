---
title: "Pods statiques"
content_type: concept
weight: 150
---

Les _Pods statiques_ sont gérés directement par le démon kubelet sur un nœud
donné, sans que le {{< glossary_tooltip text="serveur d'API" term_id="kube-apiserver" >}}
les observe.
Contrairement aux Pods gérés par le plan de contrôle (par exemple, par un
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}),
c'est le kubelet qui surveille chaque Pod statique et le redémarre en cas d'échec.

Les Pods statiques sont toujours liés à un seul {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, sur un nœud précis.

Les Pods statiques servent principalement à exécuter un plan de contrôle auto-hébergé,
c'est-à-dire à utiliser le kubelet pour superviser chacun des
[composants du plan de contrôle](/docs/concepts/overview/components/#control-plane-components).
Par exemple, [kubeadm](/docs/reference/setup-tools/kubeadm/) utilise des Pods statiques pour exécuter
`kube-apiserver`, `kube-controller-manager`, `kube-scheduler` et `etcd` sur les nœuds du plan de contrôle.

{{< note >}}
Si votre cluster exécute les composants du plan de contrôle sous forme de Pods, il
s'agit probablement de Pods statiques. Vous pouvez reconnaître leurs Pods miroirs
dans le namespace `kube-system` grâce à l'annotation `kubernetes.io/config.mirror`.
{{< /note >}}

## Pods miroirs {#mirror-pods}

Le kubelet essaie automatiquement de créer un
{{< glossary_tooltip text="Pod miroir" term_id="mirror-pod" >}}
sur le serveur d'API Kubernetes pour chaque Pod statique.
Les Pods qui s'exécutent sur un nœud sont donc visibles sur le serveur d'API,
mais ne peuvent pas être contrôlés depuis celui-ci.
Le nom de chaque Pod miroir est suivi d'un tiret et du nom d'hôte du nœud.

Le kubelet reporte les {{< glossary_tooltip text="labels" term_id="label" >}}
du Pod statique sur le Pod miroir. Vous pouvez utiliser ces labels dans des
{{< glossary_tooltip text="sélecteurs" term_id="selector" >}}, comme pour n'importe quel Pod.

Si vous tentez de supprimer le Pod miroir du serveur d'API avec `kubectl`,
le kubelet _ne supprime pas_ le Pod statique : il recrée le Pod miroir.

## Limitations {#limitations}

La spécification d'un Pod statique ne peut pas faire référence à d'autres objets de l'API,
comme un {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
une {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} ou un
{{< glossary_tooltip text="Secret" term_id="secret" >}}.

Les Pods statiques ne prennent pas en charge les [conteneurs éphémères](/docs/concepts/workloads/pods/ephemeral-containers/).

## Pods statiques ou DaemonSets {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
Si vous exploitez un cluster Kubernetes et que vous vous servez de Pods statiques pour exécuter
un Pod sur chaque nœud, il est sans doute préférable d'utiliser un
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.

Les Pods statiques ne sont pas gérés par le plan de contrôle : il n'est donc pas possible
de les déployer progressivement, de revenir à une version précédente ni de les mettre à l'échelle
avec les mécanismes standard de Kubernetes. Les DaemonSets offrent ces fonctionnalités et
constituent l'approche recommandée pour exécuter des charges de travail au niveau des nœuds.

Les Pods statiques sont démarrés par le kubelet avant que le serveur d'API soit disponible,
ce qui les rend adaptés à l'amorçage des composants du plan de contrôle. Les DaemonSets,
eux, nécessitent un plan de contrôle opérationnel.

## {{% heading "whatsnext" %}}

- Découvrez comment [créer des Pods statiques](/docs/tasks/configure-pod-container/static-pod/).
- Découvrez les [composants de Kubernetes](/docs/concepts/overview/components/) et la façon dont le plan de contrôle utilise les Pods statiques.
- Découvrez les [DaemonSets](/docs/concepts/workloads/controllers/daemonset/), une alternative aux Pods statiques.
