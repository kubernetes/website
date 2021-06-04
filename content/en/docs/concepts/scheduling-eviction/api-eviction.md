---
title: API-initiated Eviction
content_type: concept
weight: 70
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

You can request eviction by directly calling the Eviction API 
using a client of the kube-apiserver, like the `kubectl drain` command. 
This creates an `Eviction` object, which causes the API server to terminate the Pod. 

API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination). 

## {{% heading "whatsnext" %}}

* Learn about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
