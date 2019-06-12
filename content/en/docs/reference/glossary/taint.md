---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/configuration/taint-and-toleration/
short_description: >
  A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.

aka:
tags:
- core-object
- fundamental
---
 A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.

<!--more-->

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a {{< glossary_tooltip text="node" term_id="node" >}}. A node should only schedule a pod with the matching tolerations for the configured taints.
