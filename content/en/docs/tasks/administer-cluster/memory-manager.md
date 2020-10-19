---
title: Memory Manager

reviewers:
- klueska
- derekwaynecarr
- TBD

content_type: task
min-kubernetes-server-version: v1.20
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.20" >}}

<!-- This document was based on topology-manager.md -->

<!-- this was commented out, but can be somehow reused in the context of Memory Manager
An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.

In order to extract the best performance, optimizations related to CPU isolation, memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.
-->

The *Memory Manager* is a new component in *kubelet* ecosystem, and it enables the feature of guaranteed memory (and hugepages) allocation for pods in Guaranteed QoS class. The feature offers a couple of allocation strategies. The first one, the *single-NUMA* strategy, is intended for high-performance and performance-sensitive applications. The second one, the *multi-NUMA* strategy, complements the overall design while it overcomes the situation that cannot be managed with the *single-NUMA* strategy. Namely, whenever the amount of memory demanded by a pod is in the excess of a single NUMA node capacity, the guaranteed memory is provisioned across multiple NUMA nodes with the *multi-NUMA* strategy.  

In both scenarios, the *Memory Manager* employs hint generation protocol to yield the most suitable NUMA affinity for a pod, and it feeds the central manager (*Topology Manager*) with those affinity hints. Moreover, *Memory Manager* ensures that the memory which a pod requests is allocated from a minimum number of NUMA nodes.

<!-- 
The up-to-date implementation of the *Memory Manager* is available through the link in [Implementation History](##implementation-history) section. Technically, the *single-NUMA* strategy is a special case of the *multi-NUMA* strategy, and thus, no separate implementation was developed for them. Still, the proposal differentiates between the *single-NUMA* and the *multi-NUMA* strategies. First of all, it allows for a number of important use cases or situations to be discussed and contrasted.  
-->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## How Memory Manager Operates?

TBD

### Enable the Memory Manager feature

Support for the Memory Manager requires `MemoryManager` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled. 

That is, the `kubelet` must be started with the following flag:

`--feature-gates=MemoryManager=true`

### Memory Manager Configuration

The Memory Manager currently offers the guaranteed memory (and hugepages) allocation solely for Pods in Guaranteed QoS class.

The Memory Manager is a Hint Provider, and it provides topology hints for the Topology Manager which then aligns the requested resources according to these topology hints.

{{< note >}}
To align memory resources with other requested resources in a Pod Spec:
- the CPU Manager should be enabled and proper CPU Manager policy should be configured on a Node. See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/);
- the Topology Manager should be enabled and proper Topology Manager policy should be configured on a Node. See [control Topology Management Policies](/docs/tasks/administer-cluster/topology-manager/).
{{< /note >}}

### Policies 

Memory Manager supports two policies. You can select a policy via a `kubelet` flag `--memory-manager-policy`.

Two policies can be selected:

* `none` (default)
* `static`

#### none policy {#policy-none}

This is the default policy and does not affect the memory allocation in any way.

#### static policy {#policy-static}

TBD

### Placing a Pod in the Guaranteed QoS class

If the selected policy is anything other than `none`, Memory Manager would consider Pods in Guaranteed QoS class and provide topology hints to the Topology Manager. Otherwise, the Memory Manager returns default topology hint to the Topology Manager.

The following pod specifications lend a Pod to Guaranteed QoS class.

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

This pod with integer CPU request runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

Also, this pod with sharing CPU request runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.

Notice that both CPU and memory requests must be specified for a Pod to lend it to Guaranteed QoS class.

### The Reserved Memory Flag

TBD

<!-- This was commented out, but can be somehow reused

The Topology Manager would consider the above pods. The Topology Manager would consult the Hint Providers, which are CPU and Device Manager to get topology hints for the pods. 

In the case of the `Guaranteed` pod with integer CPU request, the `static` CPU Manager policy would return topology hints relating to the exclusive CPU and the Device Manager would send back hints for the requested device.

In the case of the `Guaranteed` pod with sharing CPU request, the `static` CPU Manager policy would return default topology hint as there is no exclusive CPU request and the Device Manager would send back hints for the requested device.

In the above two cases of the `Guaranteed` pod, the `none` CPU Manager policy would return default topology hint.

In the case of the `BestEffort` pod, the `static` CPU Manager policy would send back the default topology hint as there is no CPU request and the Device Manager would send back the hints for each of the requested devices.

Using this information the Topology Manager calculates the optimal hint for the pod and stores this information, which will be used by the Hint Providers when they are making their resource assignments. 

-->

### Known Limitations

- See [the limitations of Topology Manager](/docs/tasks/administer-cluster/topology-manager/#known-limitations).

TBD

