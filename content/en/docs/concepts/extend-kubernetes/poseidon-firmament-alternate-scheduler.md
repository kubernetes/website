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

## Key Advantages

### Flow graph scheduling based Poseidon-Firmament scheduler provides the following key advantages:

- Workloads (pods) are bulk scheduled to enable scheduling at massive scale..
- Based on the extensive performance test results, Poseidon-Firmament scales much better than the Kubernetes default scheduler as the number of nodes increase in a cluster. This is due to the fact that Poseidon-Firmament is able to amortize more and more work across workloads.
- Poseidon-Firmament Scheduler outperforms the Kubernetes default scheduler by a wide margin when it comes to throughput performance numbers for scenarios where compute resource requirements are somewhat uniform across your workload (Deployments, ReplicaSets, Jobs).
  Poseidon-Firmament scheduler end-to-end throughput performance numbers, including bind time, consistently get better as the number of nodes in a cluster increase. For example, for a 2,700 node cluster (shown in [Latest Benchmarking Results](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md#latest-benchmarking-results), Poseidon-Firmament scheduler achieves a 7× or greater end-to-end throughput than the Kubernetes default scheduler, which includes bind time.
- Availability of complex rule constraints.
- Scheduling in Poseidon-Firmament is dynamic; it keeps cluster resources in a global optimal state during every scheduling run.
- Highly efficient resource utilizations.

## How the Poseidon-Firmament scheduler works

As part of the Kubernetes multiple schedulers support, each new pod is typically scheduled by the default scheduler. Kubernetes can be instructed to use another scheduler by specifying the name of another custom scheduler (“poseidon” in our case) in the **schedulerName** field of the PodSpec at the time of pod creation. In this case, the default scheduler will ignore that Pod and allow Poseidon scheduler to schedule the Pod on a relevant node.

```yaml
apiVersion: v1
kind: Pod

...
spec:
    schedulerName: poseidon
```


{{< note >}}
For details about the design of this project see the [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md).
{{< /note >}}

## Batch scheduling

As mentioned earlier, Poseidon-Firmament scheduler enables an extremely high throughput scheduling environment at scale due to its bulk scheduling approach versus Kubernetes pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods are uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon-Firmament scheduler is capable of scheduling various types of workloads, such as service, batch, etc., the following are a few use cases where it excels the most:

1. For “Big Data/AI” jobs consisting of large number of tasks, throughput benefits are tremendous.
2. Service or batch jobs where workload resource requirements are uniform across jobs (Replicasets/Deployments/Jobs).

## Feature state

- Poseidon-Firmament is supported from Kubernetes release 1.6 and works with all subsequent releases.
- [Poseidon Releases](https://github.com/kubernetes-sigs/poseidon/releases) and [Firmament Releases](https://github.com/Huawei-PaaS/firmament/releases) have matching versioning, with releases done in lock step for both repositories.

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
|Priority Pre-emption|Y|N†|**†** Partially exists in Poseidon-Firmament versus extensive support in Kubernetes default scheduler.|
|Inherent Re-Scheduling|N|Y†|**†** Poseidon-Firmament scheduler supports workload re-scheduling. In each scheduling run, Poseidon-Firmament considers all Pods, including running Pods, and as a result can migrate or evict Pods – a globally optimal scheduling environment.|
|Gang Scheduling|N|Y||
|Support for Pre-bound Persistence Volume Scheduling|Y|Y||
|Support for Local Volume & Dynamic Persistence Volume Binding Scheduling|Y|N||
|High Availability|Y|N||
|Real-time metrics based scheduling|N|Y†|**†** Partially supported in Poseidon-Firmamemtn using Heapster (now deprecated) for placing Pods using actual cluster utilization statistics rather than reservations.|
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
* Read [Firmament: Fast, Centralized Cluster Scheduling at Scale](https://www.usenix.org/system/files/conference/osdi16/osdi16-gog.pdf), the academic paper on the Firmament scheduling design.
* If you'd like to contribute to Poseidon-Firmament, refer to the [developer setup instructions](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

{{% /capture %}}
