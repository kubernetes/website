---
title: Noeuds
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes exécute votre {{< glossary_tooltip text="charge de travail" term_id="workload" >}}
en plaçant des conteneurs dans des Pods pour s'exécuter sur des _nœuds_.
Un nœud peut être une machine virtuelle ou physique, selon le cluster. Chaque nœud
est géré par le
{{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}}
et contient les services nécessaires pour exécuter
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

Typiquement, vous avez plusieurs nœuds dans un cluster ; dans un environnement d'apprentissage ou limité en ressources,
vous pourriez n'avoir qu'un seul nœud.

Les [composants](/docs/concepts/architecture/#node-components) sur un nœud incluent le
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, un
{{< glossary_tooltip text="runtime de conteneur" term_id="container-runtime" >}}, et le
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.

<!-- body -->

## Gestion

Il existe deux principales façons d'ajouter des nœuds au
{{< glossary_tooltip text="serveur API" term_id="kube-apiserver" >}} :

1. Le kubelet sur un nœud s'enregistre automatiquement auprès du plan de contrôle.
2. Vous (ou un autre utilisateur humain) ajoutez manuellement un objet Nœud.

Après avoir créé un {{< glossary_tooltip text="objet" term_id="object" >}} Nœud,
ou lorsque le kubelet sur un nœud s'enregistre automatiquement, le plan de contrôle vérifie si le nouvel objet Nœud
est valide. Par exemple, si vous essayez de créer un Nœud à partir du manifeste JSON suivant :

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

Kubernetes crée un objet Nœud en interne (la représentation). Kubernetes vérifie
qu'un kubelet s'est enregistré auprès du serveur API correspondant au champ `metadata.name`
du Nœud. Si le nœud est en bonne santé (c'est-à-dire que tous les services nécessaires sont en cours d'exécution),
alors il est éligible pour exécuter un Pod. Sinon, ce nœud est ignoré pour toute activité du cluster
jusqu'à ce qu'il redevienne en bonne santé.

{{< note >}}
Kubernetes conserve l'objet pour le Nœud invalide et continue de vérifier s'il devient en bonne santé.

Vous, ou un {{< glossary_tooltip term_id="controller" text="contrôleur">}}, devez explicitement
supprimer l'objet Nœud pour arrêter cette vérification de santé.
{{< /note >}}

Le nom d'un objet Nœud doit être un
[nom de sous-domaine DNS valide](/fr/docs/concepts/overview/working-with-objects/names#noms-de-sous-domaine-dns).

### Unicité du nom du nœud

Le [nom](/fr/docs/concepts/overview/working-with-objects/names#noms) identifie un Nœud. Deux Nœuds
ne peuvent pas avoir le même nom en même temps. Kubernetes suppose également qu'une ressource avec le même
nom est le même objet. Dans le cas d'un Nœud, on suppose implicitement qu'une instance utilisant le
même nom aura le même état (par exemple, les paramètres réseau, le contenu du disque racine) et les mêmes attributs tels que
les étiquettes du nœud. Cela peut entraîner des incohérences si une instance a été modifiée sans changer son nom.
Si le Nœud doit être remplacé ou mis à jour de manière significative, l'objet Nœud existant doit être
supprimé du serveur API en premier lieu, puis ré-ajouté après la mise à jour.

### Auto-enregistrement des nœuds

Lorsque le drapeau kubelet `--register-node` est vrai (par défaut), le kubelet tente de
s'enregistrer auprès du serveur API. C'est le modèle préféré, utilisé par la plupart des distributions.

Pour l'auto-enregistrement, le kubelet est démarré avec les options suivantes :

- `--kubeconfig` - Chemin vers les informations d'identification pour s'authentifier auprès du serveur API.
- `--cloud-provider` - Comment communiquer avec un {{< glossary_tooltip text="fournisseur de cloud" term_id="cloud-provider" >}}
  pour lire les métadonnées à son sujet.
- `--register-node` - S'enregistrer automatiquement auprès du serveur API.
- `--register-with-taints` - Enregistrer le nœud avec la liste donnée de
  {{< glossary_tooltip text="taints" term_id="taint" >}} (séparées par des virgules `<clé>=<valeur>:<effet>`).

  Ne fait rien si `register-node` est faux.
- `--node-ip` - Liste facultative de adresses IP séparées par des virgules pour le nœud.
  Vous ne pouvez spécifier qu'une seule adresse pour chaque famille d'adresses.
  Par exemple, dans un cluster IPv4 à pile unique, vous définissez cette valeur comme l'adresse IPv4 que le
  kubelet doit utiliser pour le nœud.
  Consultez [configurer une pile double IPv4/IPv6](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)
  pour plus de détails sur l'exécution d'un cluster à double pile.

  Si vous ne fournissez pas cet argument, le kubelet utilise l'adresse IPv4 par défaut du nœud, le cas échéant ;
  si le nœud n'a pas d'adresses IPv4, alors le kubelet utilise l'adresse IPv6 par défaut du nœud.
- `--node-labels` - {{< glossary_tooltip text="Étiquettes" term_id="label" >}} à ajouter lors de l'enregistrement du nœud
  dans le cluster (voir les restrictions d'étiquettes appliquées par le
  [plugin d'admission NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Spécifie à quelle fréquence le kubelet envoie son état de nœud au serveur API.

Lorsque le [mode d'autorisation du nœud](/docs/reference/access-authn-authz/node/) et
[le plugin d'admission NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
sont activés, les kubelets sont autorisés uniquement à créer/modifier leur propre ressource Nœud.

{{< note >}}
Comme mentionné dans la section [Unicité du nom du nœud](#node-name-uniqueness),
lorsque la configuration du nœud doit être mise à jour, il est recommandé de ré-enregistrer
le nœud auprès du serveur API. Par exemple, si le kubelet est redémarré avec
un nouvel ensemble de `--node-labels`, mais le même nom de Nœud est utilisé, le changement ne sera
pas pris en compte, car les étiquettes sont uniquement définies (ou modifiées) lors de l'enregistrement du Nœud auprès du serveur API.

Les Pods déjà planifiés sur le Nœud peuvent se comporter de manière incorrecte ou causer des problèmes si la configuration du Nœud
est modifiée lors du redémarrage du kubelet. Par exemple, un Pod déjà en cours d'exécution
peut être affecté par les nouvelles étiquettes attribuées au Nœud, tandis que d'autres
Pods, incompatibles avec ce Pod, seront planifiés en fonction de cette nouvelle
étiquette. La ré-enregistrement du Nœud garantit que tous les Pods seront évacués et correctement
re-planifiés.
{{< /note >}}

### Administration manuelle des nœuds

Vous pouvez créer et modifier des objets Nœud en utilisant
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

Lorsque vous souhaitez créer manuellement des objets Nœud, définissez le drapeau kubelet `--register-node=false`.

Vous pouvez modifier des objets Nœud indépendamment du paramètre `--register-node`.
Par exemple, vous pouvez définir des étiquettes sur un Nœud existant ou le marquer comme non planifiable.

Vous pouvez utiliser des étiquettes sur les Nœuds en conjonction avec des sélecteurs de nœuds sur les Pods pour contrôler
la planification. Par exemple, vous pouvez restreindre un Pod à s'exécuter uniquement sur
un sous-ensemble des nœuds disponibles.

Le marquage d'un nœud comme non planifiable empêche le planificateur de placer de nouveaux pods sur
ce Nœud, mais n'affecte pas les Pods existants sur le Nœud. Cela est utile comme
étape préparatoire avant un redémarrage du nœud ou une autre opération de maintenance.

Pour marquer un Nœud comme non planifiable, exécutez :

```shell
kubectl cordon $NOM_DU_NŒUD
```

Consultez [Évacuation sécurisée d'un nœud](/docs/tasks/administer-cluster/safely-drain-node/)
pour plus de détails.

{{< note >}}
Les Pods faisant partie d'un {{< glossary_tooltip term_id="daemonset" >}} tolèrent
le fait d'être exécutés sur un Nœud non planifiable. Les DaemonSets fournissent généralement des services locaux au nœud
qui doivent s'exécuter sur le Nœud même s'il est vidé des applications de charge de travail.
{{< /note >}}

## État du nœud

L'état d'un Nœud contient les informations suivantes :

* [Adresses](/docs/reference/node/node-status/#addresses)
* [Conditions](/docs/reference/node/node-status/#condition)
* [Capacité et Allocatable](/docs/reference/node/node-status/#capacity)
* [Info](/docs/reference/node/node-status/#info)

Vous pouvez utiliser `kubectl` pour afficher l'état d'un Nœud et d'autres détails :

```shell
kubectl describe node <insérez-le-nom-du-nœud-ici>
```

Consultez [État du nœud](/docs/reference/node/node-status/) pour plus de détails.

## Battements de cœur du nœud

Les battements de cœur, envoyés par les nœuds Kubernetes, aident votre cluster à déterminer
la disponibilité de chaque nœud et à prendre des mesures en cas de détection de défaillances.

Pour les nœuds, il existe deux formes de battements de cœur :

* Mises à jour de l'[`.status`](/docs/reference/node/node-status/) d'un Nœud.
* Objets [Lease](/docs/concepts/architecture/leases/)
  dans le namespace `kube-node-lease`.
  Chaque Nœud a un objet Lease associé.

## Contrôleur de nœud

Le {{< glossary_tooltip text="contrôleur" term_id="controller" >}} de nœud est un
composant du plan de contrôle Kubernetes qui gère différents aspects des nœuds.

Le contrôleur de nœud a plusieurs rôles dans la vie d'un nœud. Le premier est d'attribuer un
bloc CIDR au nœud lors de son enregistrement (si l'attribution CIDR est activée).

Le deuxième est de maintenir à jour la liste interne des nœuds du contrôleur de nœud avec
la liste des machines disponibles du fournisseur de cloud. Lorsqu'il s'exécute dans un environnement cloud
et chaque fois qu'un nœud est en mauvaise santé, le contrôleur de nœud demande au fournisseur de cloud si la VM pour ce nœud est toujours disponible.
Si ce n'est pas le cas, le contrôleur de nœud supprime le nœud de sa liste de nœuds.

Le troisième est de surveiller la santé des nœuds. Le contrôleur de nœud est
responsable de :

- Dans le cas où un nœud devient injoignable, mettre à jour la condition `Ready`
  dans le champ `.status` du Nœud. Dans ce cas, le contrôleur de nœud définit la
  condition `Ready` à `Unknown`.
- Si un nœud reste injoignable : déclencher
  [l'éviction initiée par l'API](/docs/concepts/scheduling-eviction/api-eviction/)
  pour tous les Pods sur le nœud injoignable. Par défaut, le contrôleur de nœud
  attend 5 minutes entre le marquage du nœud comme `Unknown` et la soumission
  de la première demande d'éviction.

Par défaut, le contrôleur de nœud vérifie l'état de chaque nœud toutes les 5 secondes.
Cette période peut être configurée à l'aide du drapeau `--node-monitor-period` sur le
composant `kube-controller-manager`.

### Limites de taux sur l'éviction

Dans la plupart des cas, le contrôleur de nœud limite le taux d'éviction à
`--node-eviction-rate` (par défaut 0,1) par seconde, ce qui signifie qu'il n'évacuera pas les pods
de plus d'un nœud toutes les 10 secondes.

Le comportement d'éviction des nœuds change lorsqu'un nœud dans une zone de disponibilité donnée
devient en mauvaise santé. Le contrôleur de nœud vérifie quel pourcentage de nœuds dans la zone
sont en mauvaise santé (la condition `Ready` est `Unknown` ou `False`) en même temps :

- Si la fraction de nœuds en mauvaise santé est d'au moins `--unhealthy-zone-threshold`
  (par défaut 0,55), alors le taux d'éviction est réduit.
- Si le cluster est petit (c'est-à-dire qu'il a moins ou égal à
  `--large-cluster-size-threshold` nœuds - par défaut 50), alors les évictions sont arrêtées.
- Sinon, le taux d'éviction est réduit à `--secondary-node-eviction-rate`
  (par défaut 0,01) par seconde.

La raison pour laquelle ces politiques sont mises en œuvre par zone de disponibilité est que
une zone de disponibilité peut être isolée du plan de contrôle tandis que les autres restent
connectées. Si votre cluster ne s'étend pas sur plusieurs zones de disponibilité du fournisseur de cloud,
alors le mécanisme d'éviction ne prend pas en compte l'indisponibilité par zone.

Une raison clé de répartir vos nœuds sur plusieurs zones de disponibilité est de permettre
le déplacement de la charge de travail vers des zones saines lorsque toute une zone est hors service.
Par conséquent, si tous les nœuds d'une zone sont en mauvaise santé, alors le contrôleur de nœud évacue au
taux normal de `--node-eviction-rate`. Le cas particulier est lorsque toutes les zones sont
complètement en mauvaise santé (aucun des nœuds du cluster n'est en bonne santé). Dans un tel
cas, le contrôleur de nœud suppose qu'il y a un problème de connectivité
entre le plan de contrôle et les nœuds, et n'effectue aucune éviction.
(S'il y a eu une panne et que certains nœuds réapparaissent, le contrôleur de nœud évacue les pods
des nœuds restants qui sont en mauvaise santé ou injoignables).

Le contrôleur de nœud est également responsable de l'éviction des pods s'exécutant sur des nœuds avec
des {{< glossary_tooltip text="taints" term_id="taint" >}} `NoExecute`, sauf si ces pods tolèrent cette taint.
Le contrôleur de nœud ajoute également des {{< glossary_tooltip text="taints" term_id="taint" >}}
correspondant aux problèmes du nœud, tels que le nœud injoignable ou non prêt. Cela signifie
que le planificateur ne placera pas de Pods sur des nœuds en mauvaise santé.

## Suivi de la capacité des ressources du nœud {#node-capacity}

Les objets Nœud suivent des informations sur la capacité des ressources du Nœud : par exemple, la quantité
de mémoire disponible et le nombre de CPU.
Les nœuds qui [s'enregistrent automatiquement](#auto-enregistrement-des-nœuds) rapportent leur capacité lors de
l'enregistrement. Si vous les ajoutez [manuellement](#administration-manuelle-des-nœuds), alors
vous devez définir les informations de capacité du nœud lors de son ajout.
Les nœuds qui [s'enregistrent automatiquement](#auto-enregistrement-des-nœuds) rapportent leur capacité lors de l'enregistrement. Si vous les ajoutez [manuellement](#administration-manuelle-des-nœuds), alors vous devez définir les informations de capacité du nœud lors de son ajout.

Le planificateur Kubernetes s'assure qu'il y a suffisamment de ressources pour tous les Pods sur un Nœud. Le planificateur vérifie que la somme des demandes des conteneurs sur le nœud n'est pas supérieure à la capacité du nœud. Cette somme de demandes inclut tous les conteneurs gérés par le kubelet, mais exclut tout conteneur démarré directement par le runtime de conteneur, ainsi que tout processus s'exécutant en dehors du contrôle du kubelet.

{{< note >}}
Si vous souhaitez réserver explicitement des ressources pour des processus non-Pod, consultez la section [Réserver des ressources pour les démons système](/fr/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
{{< /note >}}

## Topologie du nœud

{{< feature-state feature_gate_name="TopologyManager" >}}

Si vous avez activé la fonctionnalité `TopologyManager` [feature gate](/fr/docs/reference/command-line-tools-reference/feature-gates/), alors le kubelet peut utiliser des indications de topologie lors de la prise de décision d'attribution des ressources. Consultez la section [Contrôler les stratégies de gestion de la topologie sur un nœud](/fr/docs/tasks/administer-cluster/topology-manager/) pour plus d'informations.

## Gestion de la mémoire swap {#swap-memory}

{{< feature-state feature_gate_name="NodeSwap" >}}

Pour activer la mémoire swap sur un nœud, la fonctionnalité `NodeSwap` doit être activée sur le kubelet (par défaut, elle est activée), et le drapeau de ligne de commande `--fail-swap-on` ou le paramètre de configuration `failSwapOn` [setting](/fr/docs/reference/config-api/kubelet-config.v1beta1/) doit être défini sur false. Pour permettre aux Pods d'utiliser la mémoire swap, `swapBehavior` ne doit pas être défini sur `NoSwap` (qui est le comportement par défaut) dans la configuration du kubelet.

{{< warning >}}
Lorsque la fonctionnalité de mémoire swap est activée, les données Kubernetes telles que le contenu des objets Secret qui ont été écrits dans tmpfs peuvent maintenant être échangées sur le disque.
{{< /warning >}}

Un utilisateur peut également configurer facultativement `memorySwap.swapBehavior` afin de spécifier comment un nœud utilisera la mémoire swap. Par exemple,

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

- `NoSwap` (par défaut) : Les charges de travail Kubernetes n'utiliseront pas la mémoire swap.
- `LimitedSwap` : L'utilisation de la mémoire swap par les charges de travail Kubernetes est soumise à des limitations. Seuls les Pods de QoS Burstable sont autorisés à utiliser la mémoire swap.

Si la configuration pour `memorySwap` n'est pas spécifiée et que la fonctionnalité est activée, par défaut, le kubelet appliquera le même comportement que le paramètre `NoSwap`.

Avec `LimitedSwap`, les Pods qui ne relèvent pas de la classification QoS Burstable (c'est-à-dire les Pods QoS `BestEffort`/`Guaranteed`) sont interdits d'utiliser la mémoire swap. Pour maintenir les garanties de sécurité et de santé du nœud mentionnées ci-dessus, ces Pods ne sont pas autorisés à utiliser la mémoire swap lorsque `LimitedSwap` est en vigueur.

Avant de détailler le calcul de la limite d'échange, il est nécessaire de définir les termes suivants :

* `nodeTotalMemory` : La quantité totale de mémoire physique disponible sur le nœud.
* `totalPodsSwapAvailable` : La quantité totale de mémoire swap sur le nœud disponible pour une utilisation par les Pods (une partie de la mémoire swap peut être réservée à des fins système).
* `containerMemoryRequest` : La demande de mémoire du conteneur.

La limitation d'échange est configurée comme suit :
`(containerMemoryRequest / nodeTotalMemory) * totalPodsSwapAvailable`.

Il est important de noter que, pour les conteneurs dans les Pods de QoS Burstable, il est possible de désactiver l'utilisation de l'échange en spécifiant des demandes de mémoire égales aux limites de mémoire. Les conteneurs configurés de cette manière n'auront pas accès à la mémoire swap.

L'échange est pris en charge uniquement avec **cgroup v2**, cgroup v1 n'est pas pris en charge.

Pour plus d'informations, et pour aider aux tests et fournir des commentaires, veuillez consulter l'article de blog sur [Kubernetes 1.28 : NodeSwap passe en version Beta1](/fr/blog/2023/08/24/swap-linux-beta/), [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) et sa [proposition de conception](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).

## {{% heading "whatsnext" %}}

En savoir plus sur les éléments suivants :

* [Les composants](/fr/docs/concepts/architecture/#node-components) qui composent un nœud.
* [Définition de l'API pour le nœud](/fr/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* La section [Nœud](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node) du document de conception de l'architecture.
* [Arrêt du nœud en mode normal ou non normal](/fr/docs/concepts/cluster-administration/node-shutdown/).
* [Mise à l'échelle automatique du cluster](/fr/docs/concepts/cluster-administration/cluster-autoscaling/) pour gérer le nombre et la taille des nœuds de votre cluster.
* [Taints et Tolerations](/fr/docs/concepts/scheduling-eviction/taint-and-toleration/).
* [Gestion des ressources du nœud](/fr/docs/concepts/policy/node-resource-managers/).
* [Gestion des ressources pour les nœuds Windows](/fr/docs/concepts/configuration/windows-resource-management/).

