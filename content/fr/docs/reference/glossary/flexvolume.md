---
title: FlexVolume
id: flexvolume
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
  FlexVolume est une interface obsolète pour créer des plugins de volume _out-of-tree_. L'interface {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} est plus récente et résout plusieurs problèmes liés à FlexVolume.

aka: 
tags:
- storage 
---
FlexVolume est une interface obsolète pour créer des plugins de volume _out-of-tree_. L'interface {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} est plus récente et résout plusieurs problèmes liés à FlexVolume.

<!--more--> 

Les FlexVolumes permettent aux utilisateurs d’écrire leurs propres pilotes et d’ajouter la prise en charge de leurs volumes dans Kubernetes. Les binaires et dépendances du pilote FlexVolume doivent être installés sur les machines hôtes, ce qui nécessite un accès root. Le SIG Storage recommande, si possible, d’implémenter un pilote {{< glossary_tooltip text="CSI" term_id="csi" >}}, car il résout les limitations des FlexVolumes.

* [FlexVolume dans la documentation Kubernetes](/docs/concepts/storage/volumes/#flexvolume)
* [Plus d’informations sur FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [FAQ sur les plugins de volume pour les fournisseurs de stockage](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
