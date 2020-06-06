---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les tolérances permettent d'ordonnancer les pods sur les nœuds ou les groupes de nœuds qui ont un marquage compatible.

aka:
tags:
- core-object
- fundamental
---
 Un objet de base composé de trois caractéristiques requises : clé, valeur et effet. Les tolérances permettent d'ordonnancer les pods sur les nœuds ou les groupes de nœuds qui ont des {{< glossary_tooltip text="marquages" term_id="taint" >}} compatibles.

<!--more-->

Tolérances et {{< glossary_tooltip text="marquages" term_id="taint" >}} fonctionnent ensemble pour s'assurer que les pods ne sont pas ordonnancés sur des nœuds inappropriés. Une ou plusieurs tolérances sont appliquées à un {{< glossary_tooltip text="pod" term_id="pod" >}}. Une tolérance indique que le {{< glossary_tooltip text="pod" term_id="pod" >}} est autorisé à (mais non obligé de) être ordonnancé sur les nœuds ou groupes de nœuds avec un {{< glossary_tooltip text="marquage" term_id="taint" >}} compatible.
