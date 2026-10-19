---
title: Persistent Volume Claim
id: persistent-volume-claim
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Permet de réclamer des ressources de stockage définies dans un PersistentVolume afin de les monter comme volume dans un conteneur.

aka: 
tags:
- core-object
- storage
---

Permet de réclamer des {{< glossary_tooltip text="ressources" term_id="infrastructure-resource" >}} de stockage définies dans un
{{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, afin que ce stockage puisse être monté
comme volume dans un {{< glossary_tooltip text="conteneur" term_id="container" >}}.

<!--more-->

Spécifie la quantité de stockage, la manière dont il sera accédé (lecture seule, lecture-écriture et/ou exclusif) ainsi que la façon dont il est récupéré (conservé, recyclé ou supprimé). Les détails du stockage lui-même sont décrits dans l’objet PersistentVolume.