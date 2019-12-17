---
title: Control Topology Management Policies on a node

reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon

content_template: templates/task
---

{{% capture overview %}}

{{< feature-state state="alpha" >}}

An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.

In order to extract the best performance, optimizations related to CPU isolation, memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.

_Topology Manager_ is a Kubelet component that aims to co-ordinate the set of components that are responsible for these optimizations.
 
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## How Topology Manager Works

Prior to the introduction of Topology Manager, the CPU and Device Manager in Kubernetes make resource allocation decisions independently of each other.
This can result in undesirable allocations on multiple-socketed systems, performance/latency sensitive applications will suffer due to these undesirable allocations. 
 Undesirable in this case meaning for example, CPUs and devices being allocated from different NUMA Nodes thus, incurring additional latency.

The Topology Manager is a Kubelet component, which acts as a source of truth so that other Kubelet components can make topology aligned resource allocation choices.

The Topology Manager provides an interface for components, called *Hint Providers*, to send and receive topology information. Topology Manager has a set of node level policies which are explained below.

The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform a set of operations on the hints provided and converge on the hint determined by the policy to give the optimal result, if an undesirable hint is stored the preferred field for the hint will be set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the resource allocation decisions.

### Topology Manager Policies

The Topology Manager currently:

 - Works on Nodes with the `static` CPU Manager Policy enabled. See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
 - Works on Pods making CPU requests or Device requests via extended resources

If these conditions are met, Topology Manager will align the requested resources.

Topology Manager supports four allocation policies. You can set a policy via a Kubelet flag, `--topology-manager-policy`.
There are four supported policies:

* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`

### none policy {#policy-none}

This is the default policy and does not perform any topology alignment.

### best-effort policy {#policy-best-effort}

For each container in a Guaranteed Pod, kubelet, with `best-effort` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will store this and admit the pod to the node anyway.

The *Hint Providers* can then use this information when making the 
resource allocation decision.

### restricted policy {#policy-restricted}

For each container in a Guaranteed Pod, kubelet, with `restricted` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will reject this pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.

Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a ReplicaSet or Deployment to trigger a redeploy of the pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.

If the pod is admitted, the *Hint Providers* can then use this information when making the 
resource allocation decision.

### single-numa-node policy {#policy-single-numa-node}

For each container in a Guaranteed Pod, kubelet, with `single-numa-node` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager determines if a single NUMA Node affinity is possible.
If it is, Topology Manager will store this and the *Hint Providers* can then use this information when making the 
resource allocation decision.
If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.

Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a Deployment with replicas to trigger a redeploy of the Pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.

### Pod Interactions with Topology Manager Policies

Consider the containers in the following pod specs:

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

This pod runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified.

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
```

This pod runs in the `Burstable` QoS class because requests are less than limits.

If the selected policy is anything other than `none` , Topology Manager would not consider either of these Pod
specifications. 


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

This pod runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.


```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
      requests:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
```
This pod runs in the `BestEffort` QoS class because there are no CPU and memory requests.

The Topology Manager would consider both of the above pods. The Topology Manager would consult the Hint Providers, which are CPU and Device Manager to get topology hints for the pods. 
In the case of the `Guaranteed` pod the `static` CPU Manager policy would return hints relating to the CPU request and the Device Manager would send back hints for the requested device.

In the case of the `BestEffort` pod the CPU Manager would send back the default hint as there is no CPU request and the Device Manager would send back the hints for each of the requested devices.

Using this information the Topology Manager calculates the optimal hint for the pod and stores this information, which will be used by the Hint Providers when they are making their resource assignments. 

### Known Limitations
1. As of K8s 1.16 the Topology Manager is currently only guaranteed to work if a *single* container in the pod spec requires aligned resources. This is due to the hint generation being based on current resource allocations, and all containers in a pod generate hints before any resource allocation has been made. This results in unreliable hints for all but the first container in a pod.
*Due to this limitation if multiple pods/containers are considered by Kubelet in quick succession they may not respect the Topology Manager policy.

2. The maximum number of NUMA nodes that Topology Manager will allow is 8, past this there will be a state explosion when trying to enumerate the possible NUMA affinities and generating their hints.

3. The scheduler is not topology-aware, so it is possible to be scheduled on a node and then fail on the node due to the Topology Manager. 


{{% /capture %}}
