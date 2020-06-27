---
title: Volume
id: volume
date: 2018-04-12
full_link: /fr/docs/concepts/storage/volumes/
short_description: >
  Un répertoire contenant des données, accessible aux conteneurs d'un pod.

aka: 
tags:
- core-object
- fundamental
---
 Un répertoire contenant des données, accessible aux {{< glossary_tooltip text="conteneurs" term_id="container" >}} d'un {{< glossary_tooltip term_id="pod" >}}.

<!--more--> 

Un volume Kubernetes vit aussi longtemps que le pod qui le contient. Par conséquent, un volume survit à tous les conteneurs qui s'exécutent dans le pod, et les données contenues dans le volume sont préservées lors des redémarrages du conteneur.

Voir [stockage](/fr/docs/concepts/storage/) pour plus d'informations.