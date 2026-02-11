---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A property applied to a pod that uses four fields: key, operator, value, and effect. Tolerations enable the scheduling of Pods on nodes or node groups that have matching taints.

aka:
tags:
- fundamental
---
 A property applied to a {{< glossary_tooltip text="pod" term_id="pod" >}} that uses four fields: key, operator, value, and effect. Tolerations enable the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on {{< glossary_tooltip text="nodes" term_id="node" >}} or node groups that have matching {{< glossary_tooltip text="taints" term_id="taint" >}}.

<!--more-->

Tolerations and {{< glossary_tooltip text="taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}. A toleration indicates that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
