---
title: Eviction
id: eviction
date: 2020-05-06
full_link: /docs/tasks/administer-cluster/out-of-resource/
short_description: >
  The process of proactively failing one or more Pods on resource starved Nodes.

aka: 
tags:
- fundamental
---
 The process of proactively failing one or more Pods on resource starved Nodes.

<!--more--> 

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} needs to preserve {{< glossary_tooltip text="Node"
term_id="node" >}} stability even when available compute resources are low. Eviction is a strategy that kubelet uses to
maintain Node stability in such situations. It does this by failing Pods in response to certain eviction signals.
