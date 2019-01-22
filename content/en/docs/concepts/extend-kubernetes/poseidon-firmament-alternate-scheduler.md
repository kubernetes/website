---
title: Poseidon-Firmament - An alternate scheduler
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

**Current release of Poseidon-Firmament scheduler is an <code> alpha </code> release.**

Poseidon-Firmament scheduler is an alternate scheduler that can be deployed alongside the default Kubernetes scheduler.

{{% /capture %}}

{{% capture body %}}


## Introduction	

Poseidon is a service that acts as the integration glue for the  [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) with Kubernetes. Poseidon-Firmament scheduler augments the current Kubernetes scheduling capabilities. It incorporates novel flow network graph based scheduling capabilities alongside the default Kubernetes Scheduler. Firmament scheduler models workloads and clusters as flow networks and runs min-cost flow optimizations over these networks to make scheduling decisions.

It models the scheduling problem as a constraint-based optimization over a flow network graph. This is achieved by reducing scheduling to a min-cost max-flow optimization problem. The Poseidon-Firmament scheduler dynamically refines the workload placements.  

Poseidon-Firmament scheduler runs alongside the default Kubernetes Scheduler as an alternate scheduler, so multiple schedulers run simultaneously. 

## Key Advantages

### Flow graph scheduling based Poseidon-Firmament scheduler provides the following key advantages:  
- Workloads (pods) are bulk scheduled to enable scheduling at massive scale..  
- Based on the extensive performance test results, Poseidon-Firmament scales much better than the Kubernetes default scheduler as the number of nodes increase in a cluster. This is due to the fact that Poseidon-Firmament is able to amortize more and more work across workloads.  
- Poseidon-Firmament Scheduler outperforms the Kubernetes default scheduler by a wide margin when it comes to throughput performance numbers for scenarios where compute resource requirements are somewhat uniform across jobs (Replicasets/Deployments/Jobs). Poseidon-Firmament scheduler end-to-end throughput performance numbers, including bind time, consistently get better as the number of nodes in a cluster increase. For example, for a 2,700 node cluster (shown in the graphs [here](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md)), Poseidon-Firmament scheduler achieves a 7X or greater end-to-end throughput than the Kubernetes default scheduler, which includes bind time.     

- Availability of complex rule constraints.  
- Scheduling in Poseidon-Firmament is dynamic; it keeps cluster resources in a global optimal state during every scheduling run.  
- Highly efficient resource utilizations.  

## Poseidon-Firmament Scheduler - How it works	

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

## Possible Use Case Scenarios - When to use it  

As mentioned earlier, Poseidon-Firmament scheduler enables an extremely high throughput scheduling environment at scale due to its bulk scheduling approach versus Kubernetes pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods are uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon-Firmament scheduler is capable of scheduling various types of workloads, such as service, batch, etc., the following are a few use cases where it excels the most:

1. For “Big Data/AI” jobs consisting of large number of tasks, throughput benefits are tremendous.  
2. Service or batch jobs where workload resource requirements are uniform across jobs (Replicasets/Deployments/Jobs).  

## Current Project Stage	

- **Alpha Release - Incubation repo.** at https://github.com/kubernetes-sigs/poseidon.  
- Currently, Poseidon-Firmament scheduler **does not provide support for high availability**, our implementation assumes that the scheduler cannot fail. The [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) describes possible ways to enable high availability, but we leave this to future work.  
- We are **not aware of any production deployment** of Poseidon-Firmament scheduler at this time.  
- Poseidon-Firmament is supported from Kubernetes release 1.6 and works with all subsequent releases.   
- Release process for Poseidon and Firmament repos are in lock step.  The current Poseidon release can be found [here](https://github.com/kubernetes-sigs/poseidon/releases) and the corresponding Firmament release can be found [here](https://github.com/Huawei-PaaS/firmament/releases).

## Features Comparison Matrix	


|Feature|Kubernetes Default Scheduler|Poseidon-Firmament Scheduler|Notes|
|--- |--- |--- |--- |
|Node Affinity/Anti-Affinity|Y|Y||
|Pod Affinity/Anti-Affinity - including support for pod anti-affinity symmetry|Y|Y|Currently, the default scheduler outperforms the Poseidon-Firmament scheduler pod affinity/anti-affinity functionality. We are working towards resolving this.|
|Taints & Tolerations|Y|Y||
|Baseline Scheduling capability in accordance to available compute resources (CPU & Memory) on a node|Y|Y**|Not all Predicates & Priorities are supported at this time.|
|Extreme Throughput at scale|Y**|Y|Bulk scheduling approach scales or increases workload placement. Substantial throughput benefits using Firmament scheduler as long as resource requirements (CPU/Memory) for incoming Pods is uniform across Replicasets/Deployments/Jobs. This is mainly due to efficient amortization of work across Replicasets/Deployments/Jobs . 1) For “Big Data/AI” jobs consisting of large no. of tasks, throughput benefits are tremendous. 2) Substantial throughput benefits also for service or batch job scenarios where workload resource requirements are uniform across Replicasets/Deployments/Jobs.|
|Optimal Scheduling|Pod-by-Pod scheduler, processes one pod at a time (may result into sub-optimal scheduling)|Bulk Scheduling (Optimal scheduling)|Pod-by-Pod Kubernetes default scheduler may assign tasks to a sub-optimal machine. By contrast, Firmament considers all unscheduled tasks at the same time together with their soft and hard constraints.|
|Colocation Interference Avoidance|N|N**|Planned in Poseidon-Firmament.|
|Priority Pre-emption|Y|N**|Partially exists in Poseidon-Firmament versus extensive support in Kubernetes default scheduler.|
|Inherent Re-Scheduling|N|Y**|Poseidon-Firmament scheduler supports workload re-scheduling. In each scheduling run it considers all the pods, including running pods, and as a result can migrate or evict pods – a globally optimal scheduling environment.|
|Gang Scheduling|N|Y||
|Support for Pre-bound Persistence Volume Scheduling|Y|Y||
|Support for Local Volume & Dynamic Persistence Volume Binding Scheduling|Y|N**|Planned.|
|High Availability|Y|N**|Planned.|
|Real-time metrics based scheduling|N|Y**|Initially supported using Heapster (now deprecated) for placing pods using actual cluster utilization statistics rather than reservations. Plans to switch over to "metric server".|
|Support for Max-Pod per node|Y|Y|Poseidon-Firmament scheduler seamlessly co-exists with Kubernetes default scheduler.|
|Support for Ephemeral Storage, in addition to CPU/Memory|Y|Y||


## Installation	

For in-cluster installation of Poseidon, please start at the [Installation instructions](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md).


## Development	

For developers, please refer to the [Developer Setup instructions](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

## Latest Throughput Performance Testing Results  

Pod-by-pod schedulers, such as the Kubernetes default scheduler, typically process one pod at a time. These schedulers have the following crucial drawbacks:

1. The scheduler commits to a pod placement early and restricts the choices for other pods that wait to be placed.
2. There is limited opportunities for amortizing work across pods because they are considered for placement individually.  

These downsides of pod-by-pod schedulers are addressed by batching or bulk scheduling in Poseidon-Firmament scheduler. Processing several pods in a batch allows the scheduler to jointly consider their placement, and thus to find the best trade-off for the whole batch instead of one pod. At the same time it amortizes work across pods resulting in much higher throughput.

{{< note >}}
   Please refer to the [latest benchmark results](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md) for detailed throughput performance comparison test results between Poseidon-Firmament scheduler and the Kubernetes default scheduler.
{{< /note >}}

{{% /capture %}}
