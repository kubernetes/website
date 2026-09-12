---
title: Toleration
id: toleration
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A property applied to a Pod. Its `key`, `operator`, `value`, and `effect` fields define which taints the Pod tolerates.

aka:
tags:
- fundamental
---
A property applied to a {{< glossary_tooltip text="Pod" term_id="pod" >}}. Its `key`, `operator`, `value`, and `effect` fields define which {{< glossary_tooltip text="taints" term_id="taint" >}} the Pod tolerates.

<!--more-->

Tolerations and {{< glossary_tooltip text="taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}. A toleration indicates that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
