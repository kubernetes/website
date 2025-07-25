---
title: Collecte des déchets
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}} Cela permet le nettoyage des ressources suivantes :

* [Pods terminés](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [Jobs terminés](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [Objets sans références de propriétaire](#owners-dependents)
* [Conteneurs et images inutilisés](#containers-images)
* [PersistentVolumes provisionnés dynamiquement avec une politique de récupération de classe de stockage Delete](/docs/concepts/storage/persistent-volumes/#delete)
* [CertificateSigningRequests (CSRs) obsolètes ou expirés](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* {{<glossary_tooltip text="Nodes" term_id="node">}} supprimés dans les scénarios suivants :
  * Sur un cloud lorsque le cluster utilise un [gestionnaire de contrôleur cloud](/fr/docs/concepts/architecture/cloud-controller/)
  * Sur site lorsque le cluster utilise un addon similaire à un gestionnaire de cloud
* [Objets de bail de nœud](/fr/docs/concepts/architecture/nodes/#heartbeats)

## Propriétaires et dépendants {#owners-dependents}

De nombreux objets dans Kubernetes sont liés les uns aux autres par le biais de [*références de propriétaire*](/fr/docs/concepts/overview/working-with-objects/owners-dependents/).
Les références de propriétaire indiquent au plan de contrôle quels objets dépendent des autres.
Kubernetes utilise les références de propriétaire pour permettre au plan de contrôle et aux autres clients de l'API
de nettoyer les ressources associées avant de supprimer un objet. Dans la plupart des cas, Kubernetes gère automatiquement les références de propriétaire.

La propriété est différente du mécanisme [étiquettes et sélecteurs](/fr/docs/concepts/overview/working-with-objects/labels/)
que certains ressources utilisent également. Par exemple, considérez un
{{<glossary_tooltip text="Service" term_id="service">}} qui crée des objets `EndpointSlice`.
Le Service utilise des *étiquettes* pour permettre au plan de contrôle de
déterminer quels objets `EndpointSlice` sont utilisés pour ce Service. En plus
des étiquettes, chaque `EndpointSlice` géré au nom d'un Service a
une référence de propriétaire. Les références de propriétaire aident les différentes parties de Kubernetes à éviter
d'interférer avec les objets qu'elles ne contrôlent pas.

{{< note >}}
Les références de propriétaire entre namespaces sont interdites par conception.
Les dépendants dans un namespace peuvent spécifier des propriétaires à portée de cluster ou à portée de namespace.
Un propriétaire à portée de namespace **doit** exister dans le même namespace que le dépendant.
S'il n'existe pas, la référence de propriétaire est considérée comme absente et le dépendant
est susceptible d'être supprimé une fois que tous les propriétaires sont vérifiés comme absents.

Les dépendants à portée de cluster ne peuvent spécifier que des propriétaires à portée de cluster.
À partir de la version 1.20, si un dépendant à portée de cluster spécifie un type à portée de namespace en tant que propriétaire,
il est considéré comme ayant une référence de propriétaire non résoluble et ne peut pas être collecté par le garbage collector.

À partir de la version 1.20, si le garbage collector détecte une référence de propriétaire non valide entre namespaces,
ou un dépendant à portée de cluster avec une référence de propriétaire faisant référence à un type à portée de namespace, un événement d'avertissement
avec une raison de `OwnerRefInvalidNamespace` et un `involvedObject` du dépendant non valide est signalé.
Vous pouvez vérifier ce type d'événement en exécutant
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
{{< /note >}}

## Suppression en cascade {#cascading-deletion}

Kubernetes vérifie et supprime les objets qui n'ont plus de références de propriétaire,
comme les pods laissés derrière lors de la suppression d'un ReplicaSet. Lorsque vous
supprimez un objet, vous pouvez contrôler si Kubernetes supprime automatiquement les objets dépendants,
dans un processus appelé *suppression en cascade*. Il existe
deux types de suppression en cascade, comme suit :

* Suppression en cascade en premier plan
* Suppression en cascade en arrière-plan

Vous pouvez également contrôler comment et quand la collecte des déchets supprime les ressources qui ont
des références de propriétaire en utilisant les {{<glossary_tooltip text="finalizers" term_id="finalizer">}} Kubernetes.

### Suppression en cascade en premier plan {#foreground-deletion}

Dans la suppression en cascade en premier plan, l'objet propriétaire que vous supprimez entre d'abord dans
un état de *suppression en cours*. Dans cet état, les actions suivantes se produisent sur
l'objet propriétaire :

* Le serveur API Kubernetes définit le champ `metadata.deletionTimestamp` de l'objet sur l'heure à laquelle l'objet a été marqué pour suppression.
* Le serveur API Kubernetes définit également le champ `metadata.finalizers` sur `foregroundDeletion`.
* L'objet reste visible via l'API Kubernetes jusqu'à ce que le processus de suppression soit terminé.

Après que l'objet propriétaire entre dans l'état de suppression en cours, le contrôleur supprime les dépendants. Après avoir supprimé tous les objets dépendants, le contrôleur
supprime l'objet propriétaire. À ce stade, l'objet n'est plus visible dans
l'API Kubernetes.

Pendant la suppression en cascade en premier plan, seuls les dépendants qui bloquent la suppression du propriétaire sont ceux qui ont le champ `ownerReference.blockOwnerDeletion=true`.
Consultez [Utiliser la suppression en cascade en premier plan](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
pour en savoir plus.

### Suppression en cascade en arrière-plan {#background-deletion}

Dans la suppression en cascade en arrière-plan, le serveur API Kubernetes supprime immédiatement l'objet propriétaire et le contrôleur nettoie les objets dépendants en
arrière-plan. Par défaut, Kubernetes utilise la suppression en cascade en arrière-plan, sauf si
vous utilisez manuellement la suppression en premier plan ou choisissez d'abandonner les objets dépendants.

Consultez [Utiliser la suppression en cascade en arrière-plan](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)
pour en savoir plus.

### Dépendants orphelins

Lorsque Kubernetes supprime un objet propriétaire, les dépendants laissés derrière sont appelés
objets *orphelins*. Par défaut, Kubernetes supprime les objets dépendants. Pour apprendre comment
outrepasser ce comportement, consultez [Supprimer les objets propriétaires et les dépendants orphelins](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy).

## Collecte des déchets des conteneurs et des images inutilisés {#containers-images}

Le {{<glossary_tooltip text="kubelet" term_id="kubelet">}} effectue la collecte des déchets
sur les images inutilisées toutes les deux minutes et sur les conteneurs inutilisés toutes les
minutes. Vous devez éviter d'utiliser des outils de collecte des déchets externes, car ils peuvent
perturber le comportement du kubelet et supprimer des conteneurs qui devraient exister.

Pour configurer les options de collecte des déchets des conteneurs et des images inutilisés, ajustez le
kubelet en utilisant un [fichier de configuration](/docs/tasks/administer-cluster/kubelet-config-file/)
et modifiez les paramètres liés à la collecte des déchets en utilisant le
type de ressource [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

### Cycle de vie des images de conteneur

Kubernetes gère le cycle de vie de toutes les images via son *gestionnaire d'images*,
qui fait partie du kubelet, en collaboration avec
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}. Le kubelet
prend en compte les limites d'utilisation du disque suivantes lors de la prise de décision de collecte des déchets :

* `HighThresholdPercent`
* `LowThresholdPercent`

Une utilisation du disque supérieure à la valeur configurée de `HighThresholdPercent` déclenche la collecte des déchets, qui supprime les images dans l'ordre en fonction de leur dernière utilisation,
en commençant par les plus anciennes en premier. Le kubelet supprime les images
jusqu'à ce que l'utilisation du disque atteigne la valeur `LowThresholdPercent`.

#### Collecte des déchets pour les images de conteneur inutilisées {#image-maximum-age-gc}

{{< feature-state feature_gate_name="ImageMaximumGCAge" >}}

En tant que fonctionnalité bêta, vous pouvez spécifier la durée maximale pendant laquelle une image locale peut rester inutilisée,
indépendamment de l'utilisation du disque. Il s'agit d'un paramètre du kubelet que vous configurez pour chaque nœud.

Pour configurer le paramètre, activez la fonctionnalité `ImageMaximumGCAge`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) pour le kubelet,
et définissez également une valeur pour le champ `imageMaximumGCAge` dans le fichier de configuration du kubelet.

La valeur est spécifiée en tant que _durée_ Kubernetes ;
Les unités de temps valides pour le champ `imageMaximumGCAge` dans le fichier de configuration du kubelet sont :
- "ns" pour les nanosecondes
- "us" ou "µs" pour les microsecondes
- "ms" pour les millisecondes
- "s" pour les secondes
- "m" pour les minutes
- "h" pour les heures

Par exemple, vous pouvez définir le champ de configuration sur `12h45m`,
ce qui signifie 12 heures et 45 minutes.

{{< note >}}
Cette fonctionnalité ne suit pas l'utilisation des images entre les redémarrages du kubelet. Si le kubelet
est redémarré, l'âge de l'image suivi est réinitialisé, ce qui fait que le kubelet attend la durée complète
`imageMaximumGCAge` avant de qualifier les images pour la collecte des déchets
en fonction de l'âge de l'image.
{{< /note>}}

### Collecte des déchets des conteneurs {#container-image-garbage-collection}

Le kubelet collecte les conteneurs inutilisés en fonction des variables suivantes, que vous pouvez définir :

* `MinAge` : l'âge minimum auquel le kubelet peut collecter les
  conteneurs. Désactivez en définissant sur `0`.
* `MaxPerPodContainer` : le nombre maximum de conteneurs inactifs que chaque Pod
  peut avoir. Désactivez en définissant sur une valeur inférieure à `0`.
* `MaxContainers` : le nombre maximum de conteneurs inactifs que le cluster peut avoir.
  Désactivez en définissant sur une valeur inférieure à `0`.

En plus de ces variables, le kubelet collecte les conteneurs non identifiés et
supprimés, généralement en commençant par les plus anciens.

`MaxPerPodContainer` et `MaxContainers` peuvent potentiellement entrer en conflit les uns avec les autres
dans des situations où le maintien du nombre maximum de conteneurs par Pod
(`MaxPerPodContainer`) dépasserait le total autorisé de conteneurs inactifs globaux (`MaxContainers`). Dans cette situation, le kubelet ajuste
`MaxPerPodContainer` pour résoudre le conflit. Le pire des cas serait de
réduire `MaxPerPodContainer` à `1` et d'évacuer les conteneurs les plus anciens.
De plus, les conteneurs appartenant à des pods qui ont été supprimés sont supprimés une fois
qu'ils sont plus anciens que `MinAge`.

{{<note>}}
Le kubelet ne collecte que les conteneurs qu'il gère.
{{</note>}}

## Configuration de la collecte des déchets {#configuring-gc}

Vous pouvez ajuster la collecte des déchets des ressources en configurant des options spécifiques aux
contrôleurs qui gèrent ces ressources. Les pages suivantes vous montrent comment
configurer la collecte des déchets :

* [Configuration de la suppression en cascade des objets Kubernetes](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [Configuration du nettoyage des Jobs terminés](/docs/concepts/workloads/controllers/ttlafterfinished/)
  
## {{% heading "whatsnext" %}}

* En savoir plus sur [la propriété des objets Kubernetes](/fr/docs/concepts/overview/working-with-objects/owners-dependents/).
* En savoir plus sur les [finalizers Kubernetes](/fr/docs/concepts/overview/working-with-objects/finalizers/).
* Découvrez le [contrôleur TTL](/docs/concepts/workloads/controllers/ttlafterfinished/) qui nettoie les Jobs terminés.

