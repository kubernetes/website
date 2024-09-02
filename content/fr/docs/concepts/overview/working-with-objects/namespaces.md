---
title: Namespaces
api_metadata:
- apiVersion: "v1"
  kind: "Namespace"
content_type: concept
weight: 45
---

<!-- overview -->

Dans Kubernetes, les _namespaces_ (espace de nommage en français) fournissent un mécanisme pour isoler des groupes de ressources au sein d'un seul cluster. Les noms des ressources doivent être uniques dans un namespace, mais pas à travers les namespaces. La portée basée sur les namespaces s'applique uniquement aux {{< glossary_tooltip text="objets" term_id="object" >}} dans les namespaces _(par exemple, les déploiements, les services, etc.)_ et non aux objets à l'échelle du cluster _(par exemple, StorageClass, Nodes, PersistentVolumes, etc.)_.

<!-- body -->

## Quand utiliser plusieurs namespaces

Les _Namespaces_ sont destinés à être utilisés dans des environnements avec de nombreux utilisateurs répartis sur plusieurs équipes ou projets. Pour les clusters avec quelques dizaines d'utilisateurs, vous n'avez pas besoin de créer ou de penser aux namespaces. Commencez à utiliser les namespaces lorsque vous avez besoin des fonctionnalités qu'ils offrent.

Les namespaces fournissent une portée pour les noms. Les noms des ressources doivent être uniques dans un namespace, mais pas à travers les namespaces. Les namespaces ne peuvent pas être imbriqués les uns dans les autres et chaque ressource Kubernetes ne peut être présente que dans un seul namespace.

Les namespaces sont un moyen de diviser les ressources du cluster entre plusieurs utilisateurs (via des [quotas de ressources](/docs/concepts/policy/resource-quotas/)).

Il n'est pas nécessaire d'utiliser plusieurs namespaces pour séparer légèrement différentes ressources, telles que différentes versions du même logiciel : utilisez des {{< glossary_tooltip text="labels" term_id="label" >}} pour distinguer les ressources dans le même namespace.

{{< note >}}
Pour un cluster de production, envisagez de ne pas utiliser le namespace `default`. Au lieu de cela, créez d'autres namespaces et utilisez-les.
{{< /note >}}

## namespaces initiaux

Kubernetes démarre avec quatre namespaces initiaux :

`default`
: Kubernetes inclut ce namespace afin que vous puissiez commencer à utiliser votre nouveau cluster sans avoir à créer d'namespace.

`kube-node-lease`
: ce namespace contient des objets [Lease](/docs/concepts/architecture/leases/) associés à chaque nœud. Les leases de nœud permettent au kubelet d'envoyer des [contrôles](/docs/concepts/architecture/nodes/#node-heartbeats) afin que le plan de contrôle puisse détecter une défaillance du nœud.

`kube-public`
: ce namespace est lisible par *tous* les clients (y compris ceux qui ne sont pas authentifiés). ce namespace est principalement réservé à l'utilisation du cluster, au cas où certaines ressources devraient être visibles et lisibles publiquement dans l'ensemble du cluster. L'aspect public de ce namespace est seulement une convention, pas une exigence.

`kube-system`
: Le namespace pour les objets créés par le système Kubernetes.


## Travailler avec les namespaces

La création et la suppression des namespaces sont décrites dans la documentation du guide d'administration pour les namespaces.

{{< note >}}
  Évitez de créer des namespaces avec le préfixe `kube-`, car il est réservé aux namespaces système de Kubernetes.
{{< /note >}}

### Affichage des namespaces

Vous pouvez lister les namespaces actuels dans un cluster en utilisant :

```shell
kubectl get namespace
```

```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

### Définir le namespace pour une requête

Pour définir le namespace pour une requête en cours, utilisez le drapeau `--namespace`.

Par exemple :

```shell
kubectl run nginx --image=nginx --namespace=<insérer-nom-du-namespace-ici>
kubectl get pods --namespace=<insérer-nom-du-namespace-ici>
```
### Définir la préférence de namespace

Vous pouvez enregistrer de manière permanente le namespace pour toutes les commandes kubectl ultérieures dans ce contexte.

```shell
kubectl config set-context --current --namespace=<insérer-nom-du-namespace-ici>
# Validez-le
kubectl config view --minify | grep namespace:
```

## Namespaces et DNS

Lorsque vous créez un [Service](/fr/docs/concepts/services-networking/service/),
cela crée une [entrée DNS correspondante](/docs/concepts/services-networking/dns-pod-service/).
Cette entrée est de la forme `<nom-du-service>.<nom-du-namespace>.svc.cluster.local`, ce qui signifie
que si un conteneur utilise uniquement `<nom-du-service>`, il résoudra vers le service
qui est local à un namespace. Cela est utile pour utiliser la même configuration à travers
plusieurs namespaces tels que Développement, Staging et Production. Si vous souhaitez accéder
à travers les namespaces, vous devez utiliser le nom de domaine complet (FQDN).

En conséquence, tous les noms de namespace doivent être valides
 [DNS RFC 1123](/fr/docs/concepts/overview/working-with-objects/names/#dns-label-names).

{{< warning >}}
En créant des namespaces avec le même nom que des [domaines de premier niveau publics](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), les Services dans ces
espaces de noms peuvent avoir des noms DNS courts qui se chevauchent avec des enregistrements DNS publics.
Les charges de travail de n'importe quel namespace effectuant une recherche DNS sans un [point final](https://datatracker.ietf.org/doc/html/rfc1034#page-8) seront
redirigées vers ces services, prenant le pas sur les DNS publics.

Pour atténuer cela, limitez les privilèges de création de namespaces aux utilisateurs de confiance. Si
nécessaire, vous pouvez également configurer des contrôles de sécurité tiers, tels que des
[admission
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/),
pour bloquer la création de tout namespace avec le nom de [TLDs publics](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
{{< /warning >}}


## Tous les objets ne sont pas dans un namespace

La plupart des ressources Kubernetes (par exemple, les pods, les services, les contrôleurs de réplication, et autres) se trouvent dans des namespaces. Cependant, les ressources de namespace elles-mêmes ne se trouvent pas dans un namespace. Et les ressources de bas niveau, telles que les [nœuds](/docs/concepts/architecture/nodes/) et les [persistentVolumes](/docs/concepts/storage/persistent-volumes/), ne se trouvent dans aucun namespace.

Pour voir quelles ressources Kubernetes se trouvent ou ne se trouvent pas dans un namespace :

```shell
# Dans un namespace
kubectl api-resources --namespaced=true

# Pas dans un namespace
kubectl api-resources --namespaced=false
```


## Étiquetage automatique

{{< feature-state for_k8s_version="1.22" state="stable" >}}

Le plan de contrôle de Kubernetes définit un {{< glossary_tooltip text="label" term_id="label" >}} immuable `kubernetes.io/metadata.name` sur tous les namespaces.
La valeur du label est le nom du namespace.


## {{% heading "whatsnext" %}}

* En savoir plus sur [la création d'un nouveau namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
* En savoir plus sur [la suppression d'un namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).


