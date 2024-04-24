---
title: Namespaces
content_type: concept
weight: 30
---

<!-- overview -->

Kubernetes prend en charge plusieurs clusters virtuels présents sur le même cluster physique.
Ces clusters virtuels sont appelés namespaces (espaces de nommage en français).

<!-- body -->

## Quand utiliser plusieurs namespaces

Les namespaces sont destinés à être utilisés dans les environnements ayant de nombreux utilisateurs répartis en plusieurs équipes ou projets. Pour les clusters de quelques dizaines d'utilisateurs, vous n'avez pas
besoin d'utiliser de namespaces. Commencez à utiliser des namespaces lorsque vous avez
besoin des fonctionnalités qu'ils fournissent.

Les namespaces sont des groupes de noms. Ils fournissent un modèle d'isolation de nommage des ressources. Les noms des ressources doivent être uniques dans un namespace,
mais pas dans l'ensemble des namespaces. Les namespaces ne peuvent pas être imbriqués les uns dans les autres et chaque ressource Kubernetes ne peut se trouver que dans un seul namespace.

Les namespaces sont un moyen de répartir les ressources d'un cluster entre plusieurs utilisateurs (via [quota de ressources](/docs/concepts/policy/resource-quotas/)).

Dans les futures versions de Kubernetes, les objets du même namespace auront les mêmes
stratégies de contrôle d'accès par défaut.

Il n'est pas nécessaire d'utiliser plusieurs namespaces juste pour séparer des ressources légèrement différentes, telles que les versions du même logiciel: utiliser les [labels](/docs/user-guide/labels) pour distinguer les
ressources dans le même namespace.

## Utilisation des namespaces

La création et la suppression des namespaces sont décrites dans la [Documentation du guide d'administration pour les namespaces](/docs/admin/namespaces).

{{< note >}}
Évitez de créer des namespaces avec le préfixe `kube-`, car il est réservé aux namespaces système de Kubernetes.
{{< /note >}}

### Affichage des namespaces

Dans un cluster vous pouvez lister les namespaces actuels à l'aide de :

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

Kubernetes démarre avec quatre namespaces initiaux:

- `default` Le namespace par défaut pour les objets sans mention d'autre namespace
- `kube-system` Le namespace pour les objets créés par Kubernetes lui-même
- `kube-public` Ce namespace est créé automatiquement et est visible par tous les utilisateurs (y compris ceux qui ne sont pas authentifiés). Ce namespace est principalement réservé à l'utilisation du cluster, au cas où certaines ressources devraient être disponibles publiquement dans l'ensemble du cluster. L'aspect public de ce namespace n'est qu'une convention, pas une exigence.
- `kube-node-lease` Ce namespace contient les objets de bail associés à chaque nœud, ce qui améliore les performances des pulsations du nœud à mesure que le cluster évolue.

### Définition du namespaces pour une requête

Pour définir le namespace pour une requête en cours, utilisez l'indicateur `--namespace`.

Par exemple:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Spécifier un namespace

Vous pouvez enregistrer de manière permanente le namespace à utiliser pour toutes les commandes kubectl à suivre.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validez-le
kubectl config view --minify | grep namespace:
```

## Namespaces et DNS

Lorsque vous créez un [Service](/fr/docs/concepts/services-networking/service/), il crée une [entrée DNS](/fr/docs/concepts/services-networking/dns-pod-service/) correspondante.
Cette entrée est de la forme `<nom-service>.<nom-namespace>.svc.cluster.local`, ce qui signifie
que si un conteneur utilise simplement `<nom-service>`, il résoudra le service qui
est local à son namespace. Ceci est utile pour utiliser la même configuration pour
plusieurs namespaces tels que le Développement, la Qualification et la Production. Si vous voulez naviguer
entre plusieurs namespaces, vous devez utiliser le nom de domaine complet (FQDN ou nom de domaine complètement qualifié en français).

## Tous les objets ne se trouvent pas dans un namespace

La plupart des ressources Kubernetes (par exemple, pods, services, contrôleurs de réplication et autres) sont
dans des namespaces. Cependant, les ressources de type namespace ne sont pas elles-mêmes dans un namespace.
Et les ressources de bas niveau, telles que les [nœuds](/docs/admin/node) et les volumes persistants, ne se trouvent dans aucun namespace.

Pour voir quelles ressources Kubernetes sont et ne sont pas dans un namespace:

```shell
# Dans un namespace
kubectl api-resources --namespaced=true

# Pas dans un namespace
kubectl api-resources --namespaced=false
```

## {{% heading "whatsnext" %}}

- En savoir plus sur [créer un nouveau namespace](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace).
- En savoir plus sur [suppression d'un namespace](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace).
