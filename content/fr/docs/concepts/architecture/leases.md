---
title: Lease
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

Les systèmes distribués ont souvent besoin de _Lease_, qui fournissent un mécanisme pour verrouiller les ressources partagées
et coordonner l'activité entre les membres d'un ensemble.
Dans Kubernetes, le concept de bail est représenté par les objets [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
dans le groupe d'API `coordination.k8s.io` {{< glossary_tooltip text="Groupe d'API" term_id="api-group" >}},
qui sont utilisés pour des fonctionnalités critiques du système telles que les battements de cœur des nœuds et l'élection du leader au niveau des composants.

<!-- body -->

## Battements de cœur des nœuds {#node-heart-beats}

Kubernetes utilise l'API Lease pour communiquer les battements de cœur des nœuds kubelet au serveur API Kubernetes.
Pour chaque `Node`, il existe un objet `Lease` avec un nom correspondant dans le namespace `kube-node-lease`.
Sous le capot, chaque battement de cœur kubelet est une demande de **mise à jour** de cet objet `Lease`, mettant à jour
le champ `spec.renewTime` pour le bail. Le plan de contrôle Kubernetes utilise le horodatage de ce champ
pour déterminer la disponibilité de ce `Node`.

Consultez [Objets de bail de nœud](/docs/concepts/architecture/nodes/#node-heartbeats) pour plus de détails.

## Élection du leader

Kubernetes utilise également des Lease pour s'assurer qu'une seule instance d'un composant est en cours d'exécution à tout moment.
Cela est utilisé par les composants du plan de contrôle tels que `kube-controller-manager` et `kube-scheduler` dans
les configurations HA, où une seule instance du composant doit être en cours d'exécution activement tandis que les autres
instances sont en attente.

Lisez [élection coordonnée du leader](/docs/concepts/cluster-administration/coordinated-leader-election)
pour en savoir plus sur la façon dont Kubernetes s'appuie sur l'API Lease pour sélectionner quelle instance de composant
agit en tant que leader.

## Identité du serveur API

{{< feature-state feature_gate_name="APIServerIdentity" >}}

À partir de Kubernetes v1.26, chaque `kube-apiserver` utilise l'API Lease pour publier son identité au reste du système.
Bien que cela ne soit pas particulièrement utile en soi, cela fournit un mécanisme pour les clients afin de
découvrir combien d'instances de `kube-apiserver` opèrent sur le plan de contrôle Kubernetes.
L'existence des Lease kube-apiserver permet des fonctionnalités futures qui peuvent nécessiter une coordination entre
chaque kube-apiserver.

Vous pouvez inspecter les Lease détenus par chaque kube-apiserver en vérifiant les objets de bail dans le namespace `kube-system`
avec le nom `kube-apiserver-<sha256-hash>`. Alternativement, vous pouvez utiliser le sélecteur d'étiquettes `apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```
```
NOM                                         HOLDER                                                                           ÂGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```

Le hachage SHA256 utilisé dans le nom du bail est basé sur le nom d'hôte du système d'exploitation tel que vu par ce serveur API. Chaque kube-apiserver devrait être
configuré pour utiliser un nom d'hôte qui est unique dans le cluster. Les nouvelles instances de kube-apiserver qui utilisent le même nom d'hôte
prendront le contrôle des Lease existants en utilisant une nouvelle identité de détenteur, au lieu d'instancier de nouveaux objets de bail. Vous pouvez vérifier le
nom d'hôte utilisé par kube-apisever en vérifiant la valeur de l'étiquette `kubernetes.io/hostname`:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

Les Lease expirés des kube-apiservers qui n'existent plus sont collectés par les nouveaux kube-apiservers après 1 heure.

Vous pouvez désactiver les Lease d'identité du serveur API en désactivant la fonctionnalité `APIServerIdentity`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

## Charges de travail {#custom-workload}

Votre propre charge de travail peut définir son propre usage des Lease. Par exemple, vous pouvez exécuter un
{{< glossary_tooltip term_id="controller" text="contrôleur" >}} personnalisé où un membre principal ou leader
effectue des opérations que ses pairs ne font pas. Vous définissez un bail afin que les réplicas du contrôleur puissent sélectionner
ou élire un leader, en utilisant l'API Kubernetes pour la coordination.
Si vous utilisez un bail, il est bon de pratiquer de définir un nom pour le bail qui est clairement lié au
produit ou au composant. Par exemple, si vous avez un composant nommé Example Foo, utilisez un bail nommé
`example-foo`.

Si un opérateur de cluster ou un autre utilisateur final peut déployer plusieurs instances d'un composant, sélectionnez un préfixe de nom
et choisissez un mécanisme (comme le hachage du nom du déploiement) pour éviter les collisions de noms
pour les Lease.

Vous pouvez utiliser une autre approche tant qu'elle atteint le même résultat : les différents produits logiciels ne
entrent pas en conflit les uns avec les autres.
