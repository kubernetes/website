---
title: Taint
id: taint
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A property applied to a node or node group that can prevent workloads running there.

aka:
tags:
- fundamental
---
A property applied to a {{< glossary_tooltip text="node" term_id="node" >}} or node group. Adding a taint to a node marks that node as somehow not suitable for
workloads to run there. Workloads can run on a tainted node if they
{{< glossary_tooltip text="tolerate" term_id="toleration" >}} the taint.

<!--more-->
A taint has required `key` and `effect` fields and an optional `value`.

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
