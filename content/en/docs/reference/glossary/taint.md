---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.

aka:
tags:
- fundamental
---
 A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of {{< glossary_tooltip text="Pods" term_id="pod" >}} on {{< glossary_tooltip text="nodes" term_id="node" >}} or node groups.

<!--more-->

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
