---
title: "Scheduling, Preemption और Eviction"
weight: 95
content_type: concept
no_list: true
---

Kubernetes में scheduling का मतलब है — यह सुनिश्चित करना कि {{<glossary_tooltip text="Pods" term_id="pod">}}
को सही {{<glossary_tooltip text="Nodes" term_id="node">}} पर रखा जाए ताकि
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} उन्हें चला सके। Preemption वो
process है जिसमें कम {{<glossary_tooltip text="Priority" term_id="pod-priority">}} वाले
Pods को बंद करके ज्यादा Priority वाले Pods को Node पर schedule किया जाता है। Eviction वो
process है जिसमें किसी Node पर एक या उससे ज्यादा Pods को बंद किया जाता है।

## Scheduling

* [Kubernetes Scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [Pods को Nodes पर assign करना](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
* [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [Taints और Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework)
* [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Scheduler Performance Tuning](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [Extended Resources के लिए Resource Bin Packing](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/)

## Pod Disruption

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [Pod Priority और Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/)
