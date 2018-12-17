---
title: Poseidon-Firmament - An alternate scheduler
content_template: templates/concept
weight: 80
---

{{% capture overview %}}
 
Poseidon is the [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) integration for Kubernetes. At a very high level, Poseidon/Firmament scheduler augments the current Kubernetes scheduling capabilities by incorporating a new novel flow network graph based scheduling capabilities alongside the default Kubernetes Scheduler. It models the scheduling problem as a constraint-based optimization over a flow network graph – by reducing scheduling to a min-cost max-flow optimization problem.

{{% /capture %}}

{{% capture body %}}


## Introduction	

Poseidon is the [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) integration for Kubernetes. At a very high level, Poseidon/Firmament scheduler augments the current Kubernetes scheduling capabilities by incorporating a new novel flow network graph based scheduling capabilities alongside the default Kubernetes Scheduler. It models the scheduling problem as a constraint-based optimization over a flow network graph – by reducing scheduling to a min-cost max-flow optimization problem.

Due to the inherent rescheduling capabilities, the new scheduler enables a globally optimal scheduling environment that constantly keeps refining the workloads placements dynamically.

Poseidon/Firmament scheduler runs alongside the default Kubernetes Scheduler as an alternate scheduler – multiple schedulers running simultaneously. As part of the Kubernetes multiple schedulers support, each new pod is typically scheduled by the default scheduler, but Kubernetes can be instructed to use another scheduler by specifying the name of another custom scheduler (“Poseidon” in our case) in the PodSpec at the time of pod creation. In this case, the default scheduler will ignore that Pod and allow Poseidon scheduler to schedule the Pod on a relevant node.

## Key Advantages

### Flow graph scheduling based Poseidon/Firmament scheduler provides the following key advantages:  
- Workloads (pods) are bulk scheduled for enabling scheduling decisions at massive scale.  
- Based on the extensive performance test results, Poseidon/Firmament scales much better than Kubernetes default scheduler as the number of nodes increase in a cluster. This is due to the fact that Poseidon/Firmament is able to amortize more and more work across workloads.  
- Poseidon/Firmament Scheduler outperforms K8S default scheduler by a wide margin when it comes to throughput performance numbers for scenarios where compute resource requirements are somewhat uniform across jobs (Replicasets/Deployments/Jobs). As shown in the graph below, Poseidon/Firmament scheduler end-to-end throughput performance numbers (including bind time) consistently get better and better as the number of nodes in a cluster increase. For example, for a 2,700 nodes cluster (shown in the graph below), Poseidon/Firmament scheduler is 7X (or more) better end-to-end throughput-wise that includes bind time. 
<br/><br/>
It is also important to highlight that Poseidon/Firmament Scheduling algorithm as it is outperforms K8S default scheduling algorithm by a wide margin (up to 30X or so) when it comes to throughput performance numbers for scenarios where compute resource requirements are somewhat uniform across jobs. In the future, we are planning to further reduce/optimize the bind time by doing bulk bind process in order to make use of bulk scheduling in Poseidon/Firmament in order to realize even better end-to-end throughput performance numbers.    

- Availability of complex rule constraints.  
- Scheduling in Firmament is very dynamic; it keeps cluster resources in a global optimal state during every scheduling run.  
- Highly efficient resource utilizations.  

## Poseidon-Firmament Scheduler - How it works	

As part of the Kubernetes multiple schedulers support, each new pod is typically scheduled by the default scheduler, but Kubernetes can be instructed to use another scheduler by specifying the name of another custom scheduler (“Poseidon” in our case) in the PodSpec at the time of pod creation. In this case, the default scheduler will ignore that Pod and allow Poseidon scheduler to schedule the Pod on a relevant node.  


{{< note >}}
For details about the design of this project see the [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md).
{{< /note >}}

## Possible Use Case Scenarios - When to use it  

As mentioned earlier, Poseidon/Firmament scheduler enables extremely high throughput scheduling environment at scale due to its bulk scheduling approach superiority versus K8S pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods are uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon/Firmament scheduler is capable of scheduling various types of workloads (service, batch, etc.), following are the few use cases where it excels the most:  
1. For “Big Data/AI” jobs consisting of large number of tasks, throughput benefits are tremendous.  
2. Substantial throughput benefits also for service or batch job scenarios where workload resource requirements are uniform across jobs (Replicasets/Deployments/Jobs).  

## Current Project Stage	

- **Alpha Release - Incubation repo.** at https://github.com/kubernetes-sigs/poseidon.  
- Currently, Poseidon-Firmament scheduler **does not provide support for high availability**, our implementation assumes that the scheduler cannot fail. The [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) describes possible ways to enable high availability, but we leave this to future work.  
- We are **not aware of any production deployment** of Poseidon-Firmament scheduler at this time.  

## Features Comparison Matrix	


|Feature|Kubernetes Default Scheduler|Poseidon/Firmament Scheduler|Notes|
|--- |--- |--- |--- |
|Node Affinity/Anti-Affinity|Y|Y||
|Pod Affinity/Anti-Affinity - including support for pod anti-affinity symmetry|Y|Y|Currently, throughput numbers are definitely better for default scheduler versus Poseidon/Firmament due to the recent pod affinity/anti-affinity optimizations within K8S (release 1.11 & 1.12). Poseidon/Firmament scheduler currently “drip-feeds” pods into the scheduling algorithm and processing is one-pod-at-a-time, exactly similar to how default scheduler does. We initially tried achieving pod affinity/anti-affinity functionality using native flow network constructs (convex arc costs, “XOR” & “AND” flow network constructs as described in Ionel Gog’s PHD thesis) but we ran into few challenges and could not make it work.Using the flow network constructs we intend on achieving similar throughput benefits for affinity/anti-affinity pods as we are currently seeing for normal pods.|
|Taints & Tolerations|Y|Y||
|Baseline Scheduling capability in accordance to available compute resources (CPU & Memory) on a node|Y|Y**|Not all Predicates & Priorities are supported at this time (although, all the SIG scheduling e2e tests are passing).|
|Extreme Throughput at scale|Y**|Y|This is due to Poseidon/Firmament bulk scheduling approach superiority versus K8S pod-at-a-time approach. Substantial throughput benefits using Firmament scheduler as long as resource requirements (CPU/Memory) for incoming Pods is uniform across Replicasets/Deployments/Jobs. This is mainly due to efficient amortization of work across Replicasets/Deployments/Jobs . 1) For “Big Data/AI” jobs consisting of large no. of tasks, throughput benefits are tremendous. 2) Substantial throughput benefits also for service or batch job scenarios where workload resource requirements are uniform across Replicasets/Deployments/Jobs.|
|Optimal Scheduling|Pod-by-Pod scheduler, processes one pod at a time (may result into sub-optimal scheduling)|Bulk Scheduling (Optimal scheduling)|Pod-by-Pod K8S default scheduler may assign tasks to a sub-optimal machine or may end up migrating the first task to another machine – potentially losing all the work the task has done – and replace it with the second task. By contrast, Firmament considers all unscheduled tasks at the same time together with their soft and hard constraints. Thus, avoids unnecessary task migrations and wasting task work.|
|Colocation Interference Avoidance|N|N**|Planned in Poseidon/Firmament.|
|Priority Pre-emption|Y|N**|Partially exists in Poseidon/Firmament versus extensive support in K8S default scheduler.|
|Inherent Re-Scheduling|N|Y**|Poseidon/Firmament scheduler supports workload re-scheduling. In each scheduling run it considers all the pods, including running pods, and as a result can migrate or evict pods – a globally optimal scheduling environment.|
|Gang Scheduling|N|Y||
|Support for Pre-bound Persistence Volume Scheduling|Y|Y||
|Support for Local Volume & Dynamic Persistence Volume Binding Scheduling|Y|N**|Planned.|
|High Availability|Y|N**|Planned.|
|Real-time metrics based scheduling|N|Y**|Initially supported using Heapster (now deprecated) for placing pods using actual cluster utilization statistics rather than reservations. Plans to switch over to "metric server".|
|Support for Max-Pod per node|Y|Y|Poseidon/Firmament scheduler seamlessly co-exists with K8S default scheduler.|
|Support for Ephemeral Storage, in addition to CPU/Memory|Y|Y|This feature was working earlier. However, for some reason since K8S release 1.10 onwards it does not seem to work as expected. We are looking at resolving the issue soon.|


## Installation	

In-cluster installation of Poseidon, please start [here](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md).


## Development	

For developers please refer [here](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

## Latest Performance Testing Results

### Scheduling time of Pods with CPU/Mem requirements only (without bind time)  

![Scheduling time of Pods with CPU/Mem requirements only (without bind time)](/images/docs/perf-test-result-1.png)  

### Scheduling time of Pods with CPU/Mem requirements only (including bind time)  
![Scheduling time of Pods with CPU/Mem requirements only (including bind time)](/images/docs/perf-test-result-2.png)  

### Total time for 10k Pods and Throughput Pods/sec using Scheduler Perf.
![Total time for 10k Pods and Throughput Pods/sec using Scheduler Perf.](/images/docs/perf-test-result-3.png)  

### Scheduling time of Pods with Affinity requirements   
![Scheduling time of Pods with Affinity requirements](/images/docs/perf-test-result-4.png)  

### Scheduling time of Pods with Affinity requirements   
![Scheduling time of Pods with Affinity requirements](/images/docs/perf-test-result-5.png) 

### Scheduling time of Symmetry Pods   
![Scheduling time of Symmetry Pods](/images/docs/perf-test-result-6.png) 

{{% /capture %}}
