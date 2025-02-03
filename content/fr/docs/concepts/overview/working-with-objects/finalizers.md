---
title: Finalisateurs
content_type: concept
weight: 80
---

<!-- aperçu -->

{{<glossary_definition term_id="finalizer" length="long">}}

Vous pouvez utiliser des finalisateurs pour contrôler la {{<glossary_tooltip text="collecte des déchets" term_id="garbage-collection">}}
des {{< glossary_tooltip text="objets" term_id="object" >}} en alertant les {{<glossary_tooltip text="contrôleurs" term_id="controller">}}
d'effectuer des tâches de nettoyage spécifiques avant de supprimer la ressource cible.

Les finalisateurs ne spécifient généralement pas le code à exécuter. Au lieu de cela, ils sont
généralement des listes de clés sur une ressource spécifique similaires aux annotations.
Kubernetes spécifie automatiquement certains finalisateurs, mais vous pouvez également spécifier
les vôtres.

## Comment fonctionnent les finalisateurs

Lorsque vous créez une ressource à l'aide d'un fichier de manifeste, vous pouvez spécifier des finalisateurs dans
le champ `metadata.finalizers`. Lorsque vous tentez de supprimer la ressource, le
serveur API traitant la demande de suppression remarque les valeurs dans le champ `finalizers`
et effectue les opérations suivantes :

  * Modifie l'objet pour ajouter un champ `metadata.deletionTimestamp` avec l'heure de début de la suppression.
  * Empêche la suppression de l'objet tant que tous les éléments sont supprimés de son champ `metadata.finalizers`
  * Renvoie un code d'état `202` (HTTP "Accepté")

Le contrôleur gérant ce finaliseur remarque la mise à jour de l'objet en définissant le
`metadata.deletionTimestamp`, indiquant que la suppression de l'objet a été demandée.
Le contrôleur tente ensuite de satisfaire les exigences des finalisateurs
spécifiés pour cette ressource. Chaque fois qu'une condition de finaliseur est satisfaite, le
contrôleur supprime cette clé du champ `finalizers` de la ressource. Lorsque le
champ `finalizers` est vidé, un objet avec un champ `deletionTimestamp` défini
est automatiquement supprimé. Vous pouvez également utiliser des finalisateurs pour empêcher la suppression de ressources non gérées.

Un exemple courant de finaliseur est `kubernetes.io/pv-protection`, qui empêche
la suppression accidentelle des objets `PersistentVolume`. Lorsqu'un objet `PersistentVolume`
est utilisé par un Pod, Kubernetes ajoute le finaliseur `pv-protection`. Si vous
essayez de supprimer le `PersistentVolume`, il passe à l'état `Terminating`, mais le
contrôleur ne peut pas le supprimer car le finaliseur existe. Lorsque le Pod cesse
d'utiliser le `PersistentVolume`, Kubernetes supprime le finaliseur `pv-protection`,
et le contrôleur supprime le volume.

{{< note >}}
* Lorsque vous `DELETE` un objet, Kubernetes ajoute le timestamp de suppression pour cet objet, puis
commence immédiatement à restreindre les modifications du champ `.metadata.finalizers` pour l'objet qui est
maintenant en attente de suppression. Vous pouvez supprimer les finalisateurs existants (supprimer une entrée de la liste des `finalizers`)
mais vous ne pouvez pas ajouter un nouveau finaliseur. Vous ne pouvez pas non plus modifier le `deletionTimestamp` d'un
objet une fois qu'il est défini.

* Après que la suppression a été demandée, vous ne pouvez pas ressusciter cet objet. La seule solution est de le supprimer et de créer un nouvel objet similaire.
{{< /note >}}

## Références de propriétaire, labels et finalisateurs {#owners-labels-finalizers}

Comme les {{<glossary_tooltip text="labels" term_id="label">}},
[les références de propriétaire](/docs/concepts/overview/working-with-objects/owners-dependents/)
décrivent les relations entre les objets dans Kubernetes, mais sont utilisées à
une fin différente. Lorsqu'un
{{<glossary_tooltip text="contrôleur" term_id="controller">}} gère des objets
comme des Pods, il utilise des labels pour suivre les modifications apportées à des groupes d'objets liés. Par
exemple, lorsqu'un {{<glossary_tooltip text="Job" term_id="job">}} crée un ou
plusieurs Pods, le contrôleur de Job applique des labels à ces pods et suit les modifications apportées à
tous les Pods du cluster ayant le même label.

Le contrôleur de Job ajoute également des *références de propriétaire* à ces Pods, pointant vers le
Job qui a créé les Pods. Si vous supprimez le Job pendant que ces Pods sont en cours d'exécution,
Kubernetes utilise les références de propriétaire (pas les labels) pour déterminer quels Pods dans le
cluster ont besoin d'un nettoyage.

Kubernetes traite également les finalisateurs lorsqu'il identifie des références de propriétaire sur une
ressource destinée à la suppression.

Dans certaines situations, les finalisateurs peuvent bloquer la suppression d'objets dépendants,
ce qui peut entraîner le maintien de l'objet propriétaire ciblé pendant
plus longtemps que prévu sans être entièrement supprimé. Dans ces situations, vous
devriez vérifier les finalisateurs et les références de propriétaire sur l'objet propriétaire cible et les objets dépendants
pour résoudre le problème.

{{< note >}}
Dans les cas où les objets restent bloqués dans un état de suppression, évitez de supprimer manuellement
les finalisateurs pour permettre la poursuite de la suppression. Les finalisateurs sont généralement ajoutés
aux ressources pour une raison, donc les supprimer de force peut entraîner des problèmes dans
votre cluster. Cela ne doit être fait que lorsque le but du finaliseur est
compris et est accompli d'une autre manière (par exemple, nettoyage manuel
de certains objets dépendants).
{{< /note >}}

## {{% heading "whatsnext" %}}

* Lisez [Utilisation des finalisateurs pour contrôler la suppression](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  sur le blog Kubernetes.

