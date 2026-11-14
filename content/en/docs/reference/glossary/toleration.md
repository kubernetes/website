---
title: Toleration
id: toleration
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A way to describe which node taints a Pod can ignore.

aka:
tags:
- fundamental
---
A way to describe which node {{< glossary_tooltip text="taints" term_id="taint" >}} a {{< glossary_tooltip text="Pod" term_id="pod" >}} can ignore.

<!--more-->

The `key`, `operator`, `value`, and `effect` fields define which taints the Pod tolerates.

Tolerations and {{< glossary_tooltip text="taints" term_id="taint" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a {{< glossary_tooltip text="pod" term_id="pod" >}}. A toleration indicates that the {{< glossary_tooltip text="pod" term_id="pod" >}} is allowed (but not required) to be scheduled on nodes or node groups with matching {{< glossary_tooltip text="taints" term_id="taint" >}}.
