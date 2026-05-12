---
title: StorageClass
id: storageclass
full_link: /docs/concepts/storage/storage-classes
short_description: >
  Une StorageClass permet aux administrateurs de décrire les différents types de stockage disponibles.

aka: 
tags:
- core-object
- storage
---
 Une StorageClass permet aux administrateurs de décrire les différents types de stockage disponibles.

<!--more--> 

Les StorageClasses peuvent correspondre à des niveaux de qualité de service (QoS), à des politiques de sauvegarde ou à des politiques arbitraires définies par les administrateurs du cluster. Chaque StorageClass contient les champs `provisioner`, `parameters` et `reclaimPolicy`, qui sont utilisés lorsqu'un {{< glossary_tooltip text="Volume persistant" term_id="persistent-volume" >}} appartenant à cette classe doit être provisionné dynamiquement. Les utilisateurs peuvent demander une classe particulière en utilisant le nom de l'objet StorageClass.
