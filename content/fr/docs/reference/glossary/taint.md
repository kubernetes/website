---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les marquages empêchent l'ordonnancement des pods sur les nœuds ou les groupes de nœuds.

aka:
tags:
- core-object
- fundamental
---
 Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les marquages empêchent l'ordonnancement des pods sur les nœuds ou les groupes de nœuds.

<!--more-->

Marquages et {{< glossary_tooltip text="tolérances" term_id="toleration" >}}} travaillent ensemble pour s'assurer que les pods ne sont pas ordonnancés sur des nœuds inappropriés. Un ou plusieurs marquages sont appliqués à un {{< glossary_tooltip text="nœud" term_id="node" >}}. Un nœud ne doit ordonnancer que des pods ayant les tolérances correspondantes pour les marquages configurés.
