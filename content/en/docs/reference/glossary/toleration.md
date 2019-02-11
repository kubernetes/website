---
title: Toleration
id: toleration
date: 2019-01-11
full_link: docs/concepts/configuration/taint-and-toleration/
short_description: >
  A key-value pair and an effect to enable the scheduling of pods on nodes or node groups that have a matching {% glossary_tooltip term_id="taint" %}.

aka:
tags:
- core-object
- fundamental
---
 A key-value pair and an effect to enable the scheduling of pods on nodes or node groups that have a matching {{< glossary_tooltip text="taints" term_id="taint" >}}.

<!--more-->

Tolerations and {{< glossary_tooltip text="Taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}; this marks that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
