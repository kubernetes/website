---
title: Taint
id: taint
date: 2019-01-11
full_link: docs/concepts/configuration/taint-and-toleration/
short_description: >
  A key-value pair and an effect to prevent the scheduling of pods on nodes or node groups.

aka:
tags:
- core-object
- fundamental
---
 A key-value pair and an effect to prevent the scheduling of pods on nodes or node groups.

<!--more-->

Taints and {% glossary_tooltip term_id="tolerations" %} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a {% glossary_tooltip term_id="node" %}; this marks that the {% glossary_tooltip term_id="node" %} should not accept any pods that do not tolerate the taints.
