---
title: Taint
id: taint
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A property applied to a node or node group with required `key` and `effect` fields and optional `value` and `timeAdded` fields. Taints prevent the scheduling of Pods on nodes or node groups.

aka:
tags:
- fundamental
---
 A property applied to a {{< glossary_tooltip text="node" term_id="node" >}} or node group with required `key` and `effect` fields and optional `value` and `timeAdded` fields. Taints prevent the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on nodes or node groups.

<!--more-->

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
