---
title: Poseidon-Firmament Scheduler
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

The Poseidon-Firmament scheduler is an alternate scheduler that can be deployed alongside the default Kubernetes scheduler.

{{% /capture %}}

{{% capture body %}}


## Introduction

Poseidon is a service that acts as the integration glue between the [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) and Kubernetes. Poseidon-Firmament augments the current Kubernetes scheduling capabilities. It incorporates novel flow network graph based scheduling capabilities alongside the default Kubernetes scheduler. The Firmament scheduler models workloads and clusters as flow networks and runs min-cost flow optimizations over these networks to make scheduling decisions.

Firmament models the scheduling problem as a constraint-based optimization over a flow network graph. This is achieved by reducing scheduling to a min-cost max-flow optimization problem. The Poseidon-Firmament scheduler dynamically refines the workload placements.

Poseidon-Firmament scheduler runs alongside the default Kubernetes scheduler as an alternate scheduler. You can simultaneously run multiple, different schedulers.

Flow graph scheduling with the Poseidon-Firmament scheduler provides the following advantages:

- Workloads (Pods) are bulk scheduled to enable scheduling at massive scale.  
  The Poseidon-Firmament scheduler outperforms the Kubernetes default scheduler by a wide margin when it comes to throughput performance for scenarios where compute resource requirements are somewhat uniform across your workload (Deployments, ReplicaSets, Jobs).
- The Poseidon-Firmament's scheduler's end-to-end throughput performance and bind time improves as the number of nodes in a cluster increases. As you scale out, Poseidon-Firmament scheduler is able to amortize more and more work across workloads.
- Scheduling in Poseidon-Firmament is dynamic; it keeps cluster resources in a global optimal state during every scheduling run.
- The Poseidon-Firmament scheduler supports scheduling complex rule constraints.

## How the Poseidon-Firmament scheduler works

Kubernetes supports [using multiple schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/). You can specify, for a particular Pod, that it is scheduled by a custom scheduler (“poseidon” for this case), by setting the `schedulerName` field in the PodSpec at the time of pod creation. The default scheduler will ignore that Pod and allow Poseidon-Firmament scheduler to schedule the Pod on a relevant node.

For example:

```yaml
apiVersion: v1
kind: Pod
...
spec:
    schedulerName: poseidon
...
```

## Batch scheduling

As mentioned earlier, Poseidon-Firmament scheduler enables an extremely high throughput scheduling environment at scale due to its bulk scheduling approach versus Kubernetes pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods are uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon-Firmament scheduler is capable of scheduling various types of workloads, such as service, batch, etc., the following are a few use cases where it excels the most:

1. For “Big Data/AI” jobs consisting of large number of tasks, throughput benefits are tremendous.
2. Service or batch jobs where workload resource requirements are uniform across jobs (Replicasets/Deployments/Jobs).

## Feature state

Poseidon-Firmament is designed to work with Kubernetes release 1.6 and all subsequent releases.

{{< caution >}}
Poseidon-Firmament scheduler does not provide support for high availability; its implementation assumes that the scheduler cannot fail.
{{< /caution >}}

## Feature comparison {#feature-comparison-matrix}

{{< table caption="Feature comparison of Kubernetes and Poseidon-Firmament schedulers." >}}
|Feature|Kubernetes Default Scheduler|Poseidon-Firmament Scheduler|Notes|
|--- |--- |--- |--- |
|Node Affinity/Anti-Affinity|Y|Y||
|Pod Affinity/Anti-Affinity - including support for pod anti-affinity symmetry|Y|Y|The default scheduler outperforms the Poseidon-Firmament scheduler pod affinity/anti-affinity functionality.|
|Taints & Tolerations|Y|Y||
|Baseline Scheduling capability in accordance to available compute resources (CPU & Memory) on a node|Y|Y†|**†** Not all Predicates & Priorities are supported with Poseidon-Firmament.|
|Extreme Throughput at scale|Y†|Y|**†** Bulk scheduling approach scales or increases workload placement. Firmament scheduler offers high throughput when resource requirements (CPU/Memory) for incoming Pods are uniform across ReplicaSets/Deployments/Jobs.|
|Colocation Interference Avoidance|N|N||
|Priority Preemption|Y|N†|**†** Partially exists in Poseidon-Firmament versus extensive support in Kubernetes default scheduler.|
|Inherent Rescheduling|N|Y†|**†** Poseidon-Firmament scheduler supports workload re-scheduling. In each scheduling run, Poseidon-Firmament considers all Pods, including running Pods, and as a result can migrate or evict Pods – a globally optimal scheduling environment.|
|Gang Scheduling|N|Y||
|Support for Pre-bound Persistence Volume Scheduling|Y|Y||
|Support for Local Volume & Dynamic Persistence Volume Binding Scheduling|Y|N||
|High Availability|Y|N||
|Real-time metrics based scheduling|N|Y†|**†** Partially supported in Poseidon-Firmament using Heapster (now deprecated) for placing Pods using actual cluster utilization statistics rather than reservations.|
|Support for Max-Pod per node|Y|Y|Poseidon-Firmament scheduler seamlessly co-exists with Kubernetes default scheduler.|
|Support for Ephemeral Storage, in addition to CPU/Memory|Y|Y||
{{< /table >}}

## Installation

The [Poseidon-Firmament installation guide](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md#Installation) explains how to deploy Poseidon-Firmament to your cluster.

## Performance comparison

{{< note >}}
   Please refer to the [latest benchmark results](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md) for detailed throughput performance comparison test results between Poseidon-Firmament scheduler and the Kubernetes default scheduler.
{{< /note >}}

Pod-by-pod schedulers, such as the Kubernetes default scheduler, process Pods in small batches (typically one at a time). These schedulers have the following crucial drawbacks:

1. The scheduler commits to a pod placement early and restricts the choices for other pods that wait to be placed.
2. There is limited opportunities for amortizing work across pods because they are considered for placement individually.

These downsides of pod-by-pod schedulers are addressed by batching or bulk scheduling in Poseidon-Firmament scheduler. Processing several pods in a batch allows the scheduler to jointly consider their placement, and thus to find the best trade-off for the whole batch instead of one pod. At the same time it amortizes work across pods resulting in much higher throughput.

{{% /capture %}}
{{% capture whatsnext %}}
* See [Poseidon-Firmament](https://github.com/kubernetes-sigs/poseidon#readme) on GitHub for more information.
* See the [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) for Poseidon.
* Read [Firmament: Fast, Centralized Cluster Scheduling at Scale](https://www.usenix.org/system/files/conference/osdi16/osdi16-gog.pdf), the academic paper on the Firmament scheduling design.
* If you'd like to contribute to Poseidon-Firmament, refer to the [developer setup instructions](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).
{{% /capture %}}
