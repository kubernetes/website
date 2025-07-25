---
title: Propriétaires et dépendants
content_type: concept
weight: 90
---

<!-- aperçu -->

Dans Kubernetes, certains {{< glossary_tooltip text="objets" term_id="object" >}} sont
*propriétaires* d'autres objets. Par exemple, un
{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} est le propriétaire
d'un ensemble de Pods. Ces objets dépendants sont les *dépendants* de leur propriétaire.

La propriété est différente du mécanisme [labels et sélecteurs](/fr/docs/concepts/overview/working-with-objects/labels/)
que certains ressources utilisent également. Par exemple, considérez un Service qui
crée des objets `EndpointSlice`. Le Service utilise des {{<glossary_tooltip text="label" term_id="label">}} pour permettre au plan de contrôle de
déterminer quels objets `EndpointSlice` sont utilisés pour ce Service. En plus
des labels, chaque `EndpointSlice` géré au nom d'un Service a
une référence de propriétaire. Les références de propriétaire aident différentes parties de Kubernetes à éviter
d'interférer avec des objets qu'elles ne contrôlent pas.

## Références de propriétaire dans les spécifications d'objet

Les objets dépendants ont un champ `metadata.ownerReferences` qui référence leur
objet propriétaire. Une référence de propriétaire valide est composée du nom de l'objet et d'un {{<glossary_tooltip text="UID" term_id="uid">}} 
dans le même {{<glossary_tooltip text="namespace" term_id="namespace">}} que l'objet dépendant. Kubernetes définit automatiquement la valeur de
ce champ pour les objets qui sont des dépendants d'autres objets comme
ReplicaSets, DaemonSets, Deployments, Jobs et CronJobs, et ReplicationControllers.
Vous pouvez également configurer ces relations manuellement en modifiant la valeur de
ce champ. Cependant, vous n'avez généralement pas besoin de le faire et pouvez permettre à Kubernetes de
gérer automatiquement les relations.

Les objets dépendants ont également un champ `ownerReferences.blockOwnerDeletion` qui
prend une valeur booléenne et contrôle si des dépendants spécifiques peuvent bloquer la suppression
de leur objet propriétaire par la collecte des déchets. Kubernetes définit automatiquement ce
champ à `true` si un {{<glossary_tooltip text="contrôleur" term_id="controller">}} 
(par exemple, le contrôleur de déploiement) définit la valeur du champ
`metadata.ownerReferences`. Vous pouvez également définir manuellement la valeur du
champ `blockOwnerDeletion` pour contrôler quels dépendants bloquent la collecte des déchets.

Un contrôleur d'admission Kubernetes contrôle l'accès utilisateur pour modifier ce champ pour
les ressources dépendantes, en fonction des autorisations de suppression du propriétaire. Ce contrôle
empêche les utilisateurs non autorisés de retarder la suppression de l'objet propriétaire.

{{< note >}}
Les références de propriétaire entre espaces de noms sont interdites par conception.
Les dépendants dans un namespace peuvent spécifier des propriétaires à portée de cluster ou à portée de namespace.
Un propriétaire à portée de namespace **doit** exister dans le même namespace que le dépendant.
S'il n'existe pas, la référence de propriétaire est considérée comme absente, et le dépendant
est susceptible d'être supprimé une fois que tous les propriétaires sont vérifiés comme absents.

Les dépendants à portée de cluster ne peuvent spécifier que des propriétaires à portée de cluster.
À partir de la version 1.20, si un dépendant à portée de cluster spécifie un type à portée de namespace en tant que propriétaire,
il est considéré comme ayant une référence de propriétaire non résoluble et ne peut pas être collecté par la collecte des déchets.

À partir de la version 1.20, si le collecteur de déchets détecte une référence de propriétaire invalide entre espaces de noms,
ou un dépendant à portée de cluster avec une référence de propriétaire faisant référence à un type à portée de namespace, un événement d'avertissement
avec une raison de `OwnerRefInvalidNamespace` et un `involvedObject` du dépendant invalide est signalé.
Vous pouvez vérifier ce type d'événement en exécutant
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
{{< /note >}}

## Propriété et finalisateurs

Lorsque vous demandez à Kubernetes de supprimer une ressource, le serveur API permet au
contrôleur de gestion de traiter toutes les [règles de finalisation](/fr/docs/concepts/overview/working-with-objects/finalizers/)
pour la ressource. Les {{<glossary_tooltip term_id="finalizer">}}
empêchent la suppression accidentelle de ressources dont votre cluster peut encore avoir besoin
pour fonctionner correctement. Par exemple, si vous essayez de supprimer un [PersistentVolume](/docs/concepts/storage/persistent-volumes/) qui est encore
utilisé par un Pod, la suppression ne se produit pas immédiatement car le
`PersistentVolume` a le finaliseur `kubernetes.io/pv-protection`.
Au lieu de cela, le [volume](/docs/concepts/storage/volumes/) reste dans l'état `Terminating` jusqu'à ce que Kubernetes supprime
le finaliseur, ce qui se produit uniquement après que le `PersistentVolume` n'est plus
lié à un Pod. 

Kubernetes ajoute également des finalisateurs à une ressource propriétaire lorsque vous utilisez soit
la suppression en premier plan ou la suppression en cascade des orphelins](/docs/concepts/architecture/garbage-collection/#cascading-deletion).
Dans la suppression en premier plan, il ajoute le finaliseur `foreground` de sorte que le
contrôleur doit supprimer les ressources dépendantes qui ont également
`ownerReferences.blockOwnerDeletion=true` avant de supprimer le propriétaire. Si vous
spécifiez une politique de suppression des orphelins, Kubernetes ajoute le finaliseur `orphan` de sorte
que le contrôleur ignore les ressources dépendantes après avoir supprimé l'objet propriétaire. 

## {{% heading "whatsnext" %}}

* En savoir plus sur les [finalisateurs Kubernetes](/fr/docs/concepts/overview/working-with-objects/finalizers/).
* Apprendre sur la [collecte des déchets](/docs/concepts/architecture/garbage-collection).
* Lire la référence API pour [les métadonnées d'objet](/docs/reference/kubernetes-api/common-definitions/object-meta/#System).

