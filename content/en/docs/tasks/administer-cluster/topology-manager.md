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

_Topology Manager_ is a Kubelet component that aims to co-ordinate the set of components that are resposible for these optimizations.
 
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

The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting NUMA Nodes available and a preferred allocation indication. The Topology Manager polices preform a set of operations on the hints provided and converge on the hint determined by the policy to give the optimal result, if a undesirable hint is stored the preferred field for the hint will be set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the resource allocation decisions.

### Topology Manager Policies

The Topology Manager currently:

 - Works on Nodes with the `static` CPU Manager Policy enabled. See [control CPU Management Policies](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/)
 - Works on Pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
If these conditions are met, Topology Manager will align CPU and device requests.

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

If the pod is admitted, the *Hint Providers* can then use this information when making the 
resource allocation decision.

### single-numa-node policy {#policy-single-numa-node}

For each container in a Guaranteed Pod, kubelet, with `single-numa-node` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager determines if a single NUMA Node affinity is possible.
If it is Topology Manager will store this and the *Hint Providers* can then use this information when making the 
resource allocation decision.
If, however, this is not possible the Topology Manager will reject the pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.


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

Topology Manager would consider this Pod. The Topology Manager consults the CPU Manager `static` policy, which returns the topology of available CPUs. 
Topology Manager also consults Device Manager to discover the topology of available devices for example.com/device.

Topology Manager will use this information to store the best Topology for this container. In the case of this Pod, CPU and Device Manager will use this stored information at the resource allocation stage.

{{% /capture %}}
