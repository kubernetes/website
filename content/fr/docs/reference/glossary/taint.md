---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les teintes empêchent la programmation des pods sur les nœuds ou les groupes de nœuds.

aka:
tags:
- core-object
- fundamental
---
 Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les teintes empêchent la programmation des pods sur les nœuds ou les groupes de nœuds.

<!--more-->

Taints et {{< glossary_tooltip text="tolérances" term_id="toleration" >}}} travaillent ensemble pour s'assurer que les modules ne sont pas programmés sur des nœuds inappropriés. Une ou plusieurs teintes sont appliquées à un {{< glossary_tooltip text="nœud" term_id="node" >}}. Un nœud ne doit programmer que des pods ayant les tolérances correspondantes pour les teintes configurées.
