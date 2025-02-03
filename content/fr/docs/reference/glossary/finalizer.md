---
title: Finalizer
id: finalizer
date: 2024-09-02
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  Une clé du namespace qui indique à Kubernetes d'attendre que certaines conditions soient remplies
  avant de supprimer complètement un objet marqué pour la suppression.
aka: 
tags:
- fundamental
- operation
---
Les finalizers sont des clés des namespaces qui indiquent à Kubernetes d'attendre que certaines
conditions soient remplies avant de supprimer complètement les ressources marquées pour la suppression.
Les finalizers alertent les {{<glossary_tooltip text="contrôleurs" term_id="controller">}} pour nettoyer les ressources appartenant à l'objet supprimé.

<!--more-->

Lorsque vous demandez à Kubernetes de supprimer un objet qui a des finalizers spécifiés,
l'API Kubernetes marque l'objet pour la suppression en remplissant le champ `.metadata.deletionTimestamp`,
et renvoie un code d'état `202` (HTTP "Accepté"). L'objet cible reste dans un état de terminaison pendant que le
plan de contrôle, ou d'autres composants, effectuent les actions définies par les finalizers.
Une fois ces actions terminées, le contrôleur supprime les finalizers pertinents
de l'objet cible. Lorsque le champ `metadata.finalizers` est vide,
Kubernetes considère la suppression comme terminée et supprime l'objet.

Vous pouvez utiliser des finalizers pour contrôler la {{<glossary_tooltip text="collecte des déchets" term_id="garbage-collection">}}
des ressources. Par exemple, vous pouvez définir un finalizer pour nettoyer les ressources ou
l'infrastructure associée avant que le contrôleur ne supprime la ressource cible.
