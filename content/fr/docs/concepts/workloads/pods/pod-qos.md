---
titre: Classes de qualité de service des pods
content_type: concept
poids: 85
---

Cette page présente les classes de qualité de service (QoS) dans Kubernetes et explique comment Kubernetes affecte une classe QoS à chaque Pods en fonction des contraintes de ressources que vous spécifiez pour les conteneurs dans ce Pod. Kubernetes s’appuie sur cette classification pour prendre des décisions sur les Pods à supprimer lorsqu’il n’y a pas assez de ressources disponibles sur un nœud.

## Cours sur la qualité de service

Kubernetes classe les Pods que vous exécutez et affecte chaque Pod dans une classe de QoS. Kubernetes utilise cette classification pour influencer les différents pools sont manipulées. Kubernetes effectue cette classification en fonction de la [demandes de ressources](/docs/concepts/configuration/manage-resources-containers/) du {{< glossary_tooltip text="Containers » term_id="container » >}} dans ce Pod, avec le lien entre ces demandes et les limites de ressources. C’est ce qu’on appelle {{< glossary_tooltip text="Quality of Service » term_id="qos-class » >}}(QoS) class. Kubernetes attribue à chaque Pod une classe QoS en fonction des demandes de ressources et les limites de ses conteneurs constitutifs. Les classes QoS sont utilisées par Kubernetes pour décider quels Pods expulser d’un nœud; [Pression du nœud](/docs/concepts/scheduling-eviction/node-pressure-eviction/). Les classes QoS sont `Guaranteed`, `Burstable` et `BestEffort`. Lorsqu’un nœud est à court de ressources, Kubernetes supprimera d’abord les pods `BestEffort` exécutés sur ce nœud, suivis de `Burstable` et enfin des Pods `Guaranteed`.

Lorsque qu'une expulsion est due à la pression des ressources, seuls les Pods sont dépassés. Les demandes de ressources sont candidates à l’expulsion.

### Garanti

Les pods garantis ont les limites de ressources les plus strictes et sont les moins susceptibles d’être expulsés. Ils sont garantis de ne pas être tués jusqu’à ce qu’ils dépassent leurs limites ou qu’il n’y ait pas de Pods de priorité inférieure qui peuvent être préemptés du Nœud. Ils ne peuvent pas acquérir de ressources au-delà des limites spécifiées. Ces Pods peuvent également utiliser des CPU exclusifs à l’aide de la stratégie de gestion de CPU statique.

#### Critères

Pour qu’un Pod reçoive une classe QoS `Garantie` :

- Chaque conteneur dans le Pod doit avoir une limite de mémoire et une demande de mémoire.
- Pour chaque conteneur du Pod, la limite de mémoire doit être égale à la demande de mémoire.
- Chaque conteneur du Pod doit avoir une limite de CPU et une demande CPU.
- Pour chaque conteneur du pod, la limite de CPU doit être égale à la requête CPU.

### Burstable

Les pods qui sont `Burstables` ont des garanties de ressources de limite inférieure basées sur la demande, mais n’exigent pas de limite spécifique. Si aucune limite n’est spécifiée, elle est définie par défaut sur une limite équivalente à la capacité du nœud, ce qui permet aux pods d’augmenter de manière flexible leurs ressources si des ressources sont disponibles. En cas d’expulsion du Pod en raison d'un évènement `NodePressure` sur les ressources, ces Pods ne sont expulsés qu’après que tous les Pods `BestEffort` ont été expulsés. Étant donné qu’un pod « Burstable » peut inclure un conteneur qui n’a pas de limites de ressources ou de demandes, un pod c’est-à-dire que `Burstable` peut essayer d’utiliser n’importe quelle quantité de ressources de nœud.

#### Critères

Un Pod reçoit une classe QoS de `Burstable` si :

- Le Pod ne répond pas aux critères de la classe QoS `Garantie`.
- Au moins un conteneur dans le Pod a une demande ou une limite de mémoire ou de CPU.

### Meilleur effort

Les pods de la classe QoS `BestEfforts` peuvent utiliser des ressources de nœud qui ne sont pas spécifiquement affectées aux Pods d’autres classes QoS. Par exemple, si vous avez un nœud avec 16 cœurs de processeur disponibles pour Kubelet, et vous attribuez 4 cœurs CPU à un Pod `Garanti`, puis un Pod dans `BestEffort`. La classe QoS peut essayer d’utiliser n’importe quelle quantité des 12 cœurs de processeur restants. Kubelet préfère expulser les pods `BestEffort` si le nœud est soumis à une pression sur les ressources.

#### Critères

Un Pod a une classe QoS de `BestEffort` s’il ne répond pas aux critères de `Garanti`ou `Burstable`. En d’autres termes, un Pod n’est `BestEffort` que si aucun des conteneurs du Pod n’a delimite de mémoire ou une demande de mémoire, et aucun des conteneurs du module n’a deLimite de CPU ou une requête CPU.Les conteneurs d’un Pod peuvent demander d’autres ressources (pas de CPU ou de mémoire) et être toujours classés comme `BestEffort`.

## Certains comportements sont indépendants de la classe QoS {#class-independent-behavior}

Certains comportements sont indépendants de la classe QoS attribuée par Kubernetes. Par exemple:

- Tout conteneur dépassant une limite de ressources sera tué et redémarré par Kubelet sans affecter les autres conteneurs dans ce pod.
- Si un conteneur dépasse sa demande de ressources et que le nœud sur lequel il s’exécute fait face a une pression sur ses ressources, le Pod dans lequel il se trouve devient un candidat pour [eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/). Si cela se produit, tous les conteneurs du pod seront tués. Kubernetes peut créer un Pod de remplacement sur un nœud différent.
- La demande de ressource d’un Pod est égale à la somme des demandes de ressources deses conteneurs de composants et la limite de ressources d’un pod est égale à la somme deles limites de ressources de ses conteneurs composants.
- Le planificateur kube ne tient pas compte de la classe QoS lors de la sélection des Pods à [préempter](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption). La préemption peut se produire lorsqu’un cluster ne dispose pas de suffisamment de ressources pour exécuter tous les Pods que vous avez défini.

## {{% rubrique « whatsnext » %}}

- En savoir plus sur [gestion des ressources pour les pods et les conteneurs](/docs/concepts/configuration/manage-resources-containers/).
- En savoir plus sur [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
- En savoir plus sur [Priorité et préemption du pod](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
- En savoir plus sur [Perturbations des pods](/docs/concepts/workloads/pods/disruptions/).
- Découvrez comment [affecter des ressources mémoire à des conteneurs et des pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
- Découvrez comment [affecter des ressources CPU à des conteneurs et des pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
- Apprenez à [configurer la qualité de service pour les pods](/docs/tasks/configure-pod-container/quality-service-pod/).
