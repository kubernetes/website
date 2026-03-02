---
title: Taint
id: taint
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Consisting of three properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.

aka:
tags:
- fundamental
---
 Consisting of three properties: key, value, and effect. Taints prevent the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on {{< glossary_tooltip text="nodes" term_id="node" >}} or node groups. The key and effect are required; the value is optional.

<!--more-->

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
