---
title: Poseidon-Firmament - An alternate scheduler
content_template: templates/concept
weight: 80
---

{{% capture overview %}}
 
Poseidon is the Firmament scheduler integration for Kubernetes. At a very high level, Poseidon/Firmament scheduler augments the current Kubernetes scheduling capabilities by incorporating a new novel flow network graph based scheduling capabilities alongside the default Kubernetes Scheduler. It models the scheduling problem as a constraint-based optimization over a flow network graph – by reducing scheduling to a min-cost max-flow optimization problem.

{{% /capture %}}

{{% capture body %}}


## Introduction	

Poseidon is the Firmament scheduler integration for Kubernetes. At a very high level, Poseidon/Firmament scheduler augments the current Kubernetes scheduling capabilities by incorporating a new novel flow network graph based scheduling capabilities alongside the default Kubernetes Scheduler. It models the scheduling problem as a constraint-based optimization over a flow network graph – by reducing scheduling to a min-cost max-flow optimization problem.

Due to the inherent rescheduling capabilities, the new scheduler enables a globally optimal scheduling environment that constantly keeps refining the workloads placements dynamically.

Poseidon/Firmament scheduler runs alongside the default Kubernetes Scheduler as an alternate scheduler – multiple schedulers running simultaneously. As we all know that as part of the Kubernetes multiple schedulers support, each new pod is typically scheduled by the default scheduler, but Kubernetes can be instructed to use another scheduler by specifying the name of another custom scheduler (“Poseidon” in our case) at the time of pod deployment. In this case, the default scheduler will ignore that Pod and allow Poseidon scheduler to schedule the Pod on a relevant node.

## Key Advantages

### Flow graph scheduling based Poseidon/Firmament scheduler provides the following key advantages:  
- Workloads (pods) are bulk scheduled for enabling scheduling decisions at massive scale.  
- Based on the extensive performance test results, Poseidon/Firmament scales much better than Kubernetes default scheduler as the number of nodes increase in a cluster. This is due to the fact that Poseidon/Firmament is able to amortize more and more work across workloads.  
- Poseidon/Firmament Scheduling algorithm outperforms K8S default scheduling algorithm by a wide margin (30X) when it comes to throughput performance numbers for scenarios where compute resource requirements are somewhat uniform across jobs (Replicasets/Deployments/Jobs).  
- Availability of complex rule constraints.  
- Scheduling in Firmament is very dynamic; it keeps cluster resources in a global optimal state during every scheduling run.  
- Highly efficient resource utilizations.  

## Poseidon-Firmament Scheduler - How it works	

As we all know that as part of the Kubernetes multiple schedulers support, each new pod is typically scheduled by the default scheduler, but Kubernetes can be instructed to use another scheduler by specifying the name of another custom scheduler (“Poseidon” in our case) at the time of pod deployment. In this case, the default scheduler will ignore that Pod and allow Poseidon scheduler to schedule the Pod on a relevant node.  


{{< note >}}
For details about the design of this project see the [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md).
{{< /note >}}

## Possible Use Case Scenarios	

As mentioned earlier that Poseidon/Firmament scheduler enables extremely high throughput scheduling environment at scale due to its bulk scheduling approach superiority versus K8S pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods is uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon/Firmament scheduler is capable of scheduling various types of workloads (service, batch, etc.), following are the few use cases where it excels the most:  
1. For “Big Data/AI” jobs consisting of large no. of tasks, throughput benefits are tremendous.  
2. Substantial throughput benefits also for service or batch job scenarios where workload resource requirements are uniform across jobs (Replicasets/Deplyments/Jobs).  

## Current Project Stage	

- **Alpha Release - Incubation repo.** at https://github.com/kubernetes-sigs/poseidon.  
- Currently, Poseidon-Firmament scheduler **does not provide support for high availability**, our implementation assumes that the scheduler cannot fail. The [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) describes possible ways to enable high availability, but we leave this to future work.  
- We are **not aware of any production deployment** of Poseidon-Firmament scheduler at this time.  

## Features Comparison Matrix	


<table style="border-collapse:collapse;border-spacing:0" class="tg">
   <tr>
      <th style="font-family:Arial, sans-serif;font-size:14px;font-weight:bold;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;background-color:#656565;color:#ffffff;text-align:left">Feature</th>
      <th style="font-family:Arial, sans-serif;font-size:14px;font-weight:bold;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;background-color:#656565;color:#ffffff;text-align:left">Kubernetes Default Scheduler</th>
      <th style="font-family:Arial, sans-serif;font-size:14px;font-weight:bold;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;background-color:#656565;color:#ffffff;text-align:left">Poseidon/Firmament Scheduler</th>
      <th style="font-family:Arial, sans-serif;font-size:14px;font-weight:bold;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;background-color:#656565;color:#ffffff;text-align:left">Notes</th>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Node Affinity/Anti-Affinity</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left"></td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Pod Affinity/Anti-Affinity - including support for pod anti-affinity symmetry</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left"></td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Taints &amp; Tolerations</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left"></td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Baseline Scheduling capability in accordance to available compute resources (CPU &amp; Memory) on a node</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Not all Predicates &amp; Priorities are supported at this time (although, all the SIG scheduling e2e tests are passing).</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Extreme Throughput at scale</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#67fd9a;text-align:left">Y**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">This is due to Poseidon/Firmament bulk scheduling approach superiority versus K8S pod-at-a-time approach. Substantial throughput benefits using Firmament scheduler as long as resource requirements (CPU/Memory) for incoming Pods is uniform across Replicasets/Deployments/Jobs. **This is mainly due to efficient amortization of work across Replicasets/Deplyments/Jobs.**  
      1. For “Big Data/AI” jobs consisting of large no. of tasks, throughput benefits are tremendous.  
      2. Substantial throughput benefits also for service or batch job scenarios where workload resource requirements are uniform across Replicasets/Deplyments/Jobs.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Optimal Scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#67fd9a;text-align:left">Pod-by-Pod scheduler, processes one pod at a time (may result into sub-optimal scheduling)</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Bulk Scheduling (Optimal scheduling)</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Pod-by-Pod K8S default scheduler may assign tasks to a sub-optimal machine or may end up migrating the first task to another machine – potentially losing all the work the task has done – and replace it with the second task. By contrast, Firmament considers all unscheduled tasks at the same time together with their soft and hard constraints. Thus, avoids unnecessary task migrations and wasting task work.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Colocation Interference Avoidance</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Planned in Poseidon/Firmament.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Priority Pre-emption</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Partially exists in Poseidon/Firmament versus extensive support in K8S default scheduler.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Inherent Re-Scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">Y**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Poseidon/Firmament scheduler supports workload re-scheduling. In each scheduling run it considers all the pods, including running pods, and as a result can migrate or evict pods – a globally optimal scheduling environment.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Gang Scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left"></td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Support for Pre-bound Persistence Volume Scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left"></td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Support for Local Volume &amp; Dynamic Persistence Volume Binding Scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Planned.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">High Availability</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Planned.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Real-time metrics based scheduling</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#fe0000;text-align:left">N</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#67fd9a;text-align:left">Y**</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Initially supported using Heapster (now deprecated) for placing pods using actual cluster utilization statistics rather than reservations. Plans to switch over to "metric server".</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Support for Max-Pod per node</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">Poseidon/Firmament scheduler seamlessly co-exists with K8S default scheduler.</td>
   </tr>
   <tr>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#ffffff;text-align:left">Support for Ephemeral Storage, in addition to CPU/Memory</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;background-color:#32cb00;text-align:left">Y</td>
      <td style="font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:inherit;text-align:left">This feature was working earlier. However, for some reason since K8S release 1.10 onwards it does not seem to work as expected. We are looking at resolving the issue soon.</td>
   </tr>
</table>

## Installation	

In-cluster installation of Poseidon, please start [here](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md).


## Development	

For developers please refer [here](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

## Latest Performance Testing Results

### Scheduling time of Pods with CPU/Mem requirements only without bind time  

![Scheduling time of Pods with CPU/Mem requirements only without bind time](/images/docs/perf-test-result-1.png)  

### Scheduling time of Pods with CPU/Mem requirements only including bind time    
![Scheduling time of Pods with CPU/Mem requirements only including bind time](/images/docs/perf-test-result-2.png)  

### Total time for 10k Pods and Throughput Pods/sec using Scheduler Perf.
![Total time for 10k Pods and Throughput Pods/sec using Scheduler Perf.](/images/docs/perf-test-result-3.png)  

### Scheduling time of Pods with Affinity requirements   
![Scheduling time of Pods with Affinity requirements](/images/docs/perf-test-result-4.png)  

### Scheduling time of Pods with Affinity requirements   
![Scheduling time of Pods with Affinity requirements](/images/docs/perf-test-result-5.png) 

### Scheduling time of Symmetry Pods   
![Scheduling time of Symmetry Pods](/images/docs/perf-test-result-6.png) 

{{% /capture %}}
