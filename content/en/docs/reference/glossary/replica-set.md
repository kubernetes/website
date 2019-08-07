---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/replicaset/
short_description: >
  A ReplicaSet maintains a configured number of replicas of a Pod

aka:
tags:
- fundamental
- core-object
- workload
---
 A ReplicaSet’s purpose is to maintain a stable set of replica {{< glossary_tooltip text="Pods" term_id="pod" >}} running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

<!--more-->

ReplicaSets are often created automatically when you add a {{< glossary_tooltip term_id="deployment" >}};
this is more common than configuring a ReplicaSet directly.
