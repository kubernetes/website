---
title: Eviction
id: eviction
date: 2021-03-05
full_link: /docs/concepts/scheduling-eviction/pod-eviction
short_description: >
  Reclaimation of resources by stopping one or more {{< glossary_tooltip text="pods" term_id="pod" >}} and deleting unused {{< glossary_tooltip text="images" term_id="image" >}} on a {{< glossary_tooltip text="nodes" term_id="node" >}}.

aka:
tags:
- fundamental
- operation
---
 Reclaimation of resources by stopping one or more {{< glossary_tooltip text="pods" term_id="pod" >}} and deleting unused {{< glossary_tooltip text="images" term_id="image" >}} on a {{< glossary_tooltip text="nodes" term_id="node" >}}.

<!--more-->

Eviction is a process performed by the {{< glossary_tooltip term_id="kubelet" >}} upon one of the following triggers:
* A {{< glossary_tooltip term_id="node" >}} is running out of PIDs, memory or filesystem storage (based on [eviction thresholds](/docs/tasks/administer-cluster/out-of-resource/#eviction-thresholds)).
* The {{< glossary_tooltip term_id="kube-scheduler" >}} is unable to schedule a Pod (through the use of {{< glossary_tooltip term_id="preemption" >}} logic).
* A {{< glossary_tooltip term_id="cluster-operator" >}} requests the eviction through the use of {{< glossary_tooltip term_id="kubectl" >}} `drain` command.
* A client application requests the eviction through the [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api).
