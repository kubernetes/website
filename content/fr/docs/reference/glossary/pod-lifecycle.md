---
title: Pod Lifecycle
id: pod-lifecycle
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  La succession des états par lesquels passe un Pod au cours de son cycle de vie.
 
---

La succession des états par lesquels passe un Pod au cours de son cycle de vie.

<!--more-->

Le [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) est défini par les états ou phases d’un Pod. Il existe cinq phases possibles pour un Pod : Pending, Running, Succeeded, Failed et Unknown. Une description synthétique de l’état du Pod est fournie dans le champ `phase` de [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core).