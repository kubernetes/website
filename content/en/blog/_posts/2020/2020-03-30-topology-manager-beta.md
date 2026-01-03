---
layout: blog
title: "Kubernetes Topology Manager Moves to Beta - Align Up!"
date: 2020-04-01
slug: kubernetes-1-18-feature-topoloy-manager-beta
author: >
  Kevin Klues (NVIDIA),
  Victor Pickard (Red Hat),
  Conor Nolan (Intel) 
---

This blog post describes the **<code>TopologyManager</code>**, a beta feature of Kubernetes in release 1.18. The **<code>TopologyManager</code>** feature enables NUMA alignment of CPUs and peripheral devices (such as SR-IOV VFs and GPUs), allowing your workload to run in an environment optimized for low-latency.

Prior to the introduction of the **<code>TopologyManager</code>**, the CPU and Device Manager would make resource allocation decisions independent of each other. This could result in undesirable allocations on multi-socket systems, causing degraded performance on latency critical applications. With the introduction of the **<code>TopologyManager</code>**, we now have a way to avoid this.

This blog post covers:

1. A brief introduction to NUMA and why it is important
1. The policies available to end-users to ensure NUMA alignment of CPUs and devices
1. The internal details of how the **<code>TopologyManager</code>** works
1. Current limitations of the **<code>TopologyManager</code>**
1. Future directions of the **<code>TopologyManager</code>**

## So, what is NUMA and why do I care?

The term NUMA stands for Non-Uniform Memory Access. It is a technology available on multi-cpu systems that allows different CPUs to access different parts of memory at different speeds. Any memory directly connected to a CPU is considered "local" to that CPU and can be accessed very fast. Any memory not directly connected to a CPU is considered "non-local" and will have variable access times depending on how many interconnects must be passed through in order to reach it. On modern systems, the idea of having "local" vs. "non-local" memory can also be extended to peripheral devices such as NICs or GPUs. For high performance, CPUs and devices should be allocated such that they have access to the same local memory.

All memory on a NUMA system is divided into a set of "NUMA nodes", with each node representing the local memory for a set of CPUs or devices. We talk about an individual CPU as being part of a NUMA node if its local memory is associated with that NUMA node.

We talk about a peripheral device as being part of a NUMA node based on the shortest number of interconnects that must be passed through in order to reach it.

For example, in Figure 1, CPUs 0-3 are said to be part of NUMA node 0, whereas CPUs 4-7 are part of NUMA node 1. Likewise GPU 0 and NIC 0 are said to be part of NUMA node 0 because they are attached to Socket 0, whose CPUs are all part of NUMA node 0. The same is true for GPU 1 and NIC 1 on NUMA node 1.

<p align="center">
  <img height="300" src="/images/blog/2020-03-25-kubernetes-1.18-release-announcement/example-numa-system.png">
</p>


**Figure 1:** An example system with 2 NUMA nodes, 2 Sockets with 4 CPUs each, 2 GPUs, and 2 NICs. CPUs on Socket 0, GPU 0, and NIC 0 are all part of NUMA node 0. CPUs on Socket 1, GPU 1, and NIC 1 are all part of NUMA node 1.


Although the example above shows a 1-1 mapping of NUMA Node to Socket, this is not necessarily true in the general case. There may be multiple sockets on a single NUMA node, or individual CPUs of a single socket may be connected to different NUMA nodes. Moreover, emerging technologies such as Sub-NUMA Clustering ([available on recent intel CPUs](https://software.intel.com/en-us/articles/intel-xeon-processor-scalable-family-technical-overview)) allow single CPUs to be associated with multiple NUMA nodes so long as their memory access times to both nodes are the same (or have a negligible difference).

The **<code>TopologyManager</code>** has been built to handle all of these scenarios.

## Align Up! It's a TeaM Effort!

As previously stated, the **<code>TopologyManager</code>** allows users to align their CPU and peripheral device allocations by NUMA node. There are several policies available for this:

*   **<code>none:</code>** this policy will not attempt to do any alignment of resources. It will act the same as if the **<code>TopologyManager</code>** were not present at all. This is the default policy.
*   **<code>best-effort:</code>** with this policy, the **<code>TopologyManager</code>** will attempt to align allocations on NUMA nodes as best it can, but will always allow the pod to start even if some of the allocated resources are not aligned on the same NUMA node.
*   **<code>restricted:</code>** this policy is the same as the **<code>best-effort</code>** policy, except it will fail pod admission if allocated resources cannot be aligned properly. Unlike with the **<code>single-numa-node</code>** policy, some allocations may come from multiple NUMA nodes if it is impossible to _ever_ satisfy the allocation request on a single NUMA node (e.g. 2 devices are requested and the only 2 devices on the system are on different NUMA nodes).
*   **<code>single-numa-node:</code>** this policy is the most restrictive and will only allow a pod to be admitted if _all_ requested CPUs and devices can be allocated from exactly one NUMA node.

It is important to note that the selected policy is applied to each container in a pod spec individually, rather than aligning resources across all containers together.

Moreover, a single policy is applied to _all_ pods on a node via a global **<code>kubelet</code>** flag, rather than allowing users to select different policies on a pod-by-pod basis (or a container-by-container basis). We hope to relax this restriction in the future.

The **<code>kubelet</code>** flag to set one of these policies can be seen below:


```
--topology-manager-policy=
    [none | best-effort | restricted | single-numa-node]
```


Additionally, the **<code>TopologyManager</code>** is protected by a feature gate. This feature gate has been available since Kubernetes 1.16, but has only been enabled by default since 1.18.

The feature gate can be enabled or disabled as follows (as described in more detail [here](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)):


```
--feature-gates="...,TopologyManager=<true|false>"
```


In order to trigger alignment according to the selected policy, a user must request CPUs and peripheral devices in their pod spec, according to a certain set of requirements.

For peripheral devices, this means requesting devices from the available resources provided by a device plugin (e.g. **<code>intel.com/sriov</code>**, **<code>nvidia.com/gpu</code>**, etc.). This will only work if the device plugin has been extended to integrate properly with the **<code>TopologyManager</code>**. Currently, the only plugins known to have this extension are the [Nvidia GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin/blob/5cb45d52afdf5798a40f8d0de049bce77f689865/nvidia.go#L74), and the [Intel SRIOV network device plugin](https://github.com/intel/sriov-network-device-plugin/blob/30e33f1ce2fc7b45721b6de8c8207e65dbf2d508/pkg/resources/pciNetDevice.go#L80). Details on how to extend a device plugin to integrate with the **<code>TopologyManager</code>** can be found [here](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

For CPUs, this requires that the **<code>CPUManager</code>** has been configured with its **<code>--static</code>** policy enabled and that the pod is running in the Guaranteed QoS class (i.e. all CPU and memory **<code>limits</code>** are equal to their respective CPU and memory **<code>requests</code>**). CPUs must also be requested in whole number values (e.g. **<code>1</code>**, **<code>2</code>**, **<code>1000m</code>**, etc). Details on how to set the **<code>CPUManager</code>** policy can be found [here](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#cpu-management-policies).

For example, assuming the **<code>CPUManager</code>** is running with its **<code>--static</code>** policy enabled and the device plugins for **<code>gpu-vendor.com</code>**, and **<code>nic-vendor.com</code>** have been extended to integrate with the **<code>TopologyManager</code>** properly, the pod spec below is sufficient to trigger the **<code>TopologyManager</code>** to run its selected policy:

```
spec:
   containers:
   - name: numa-aligned-container
     image: alpine
     resources:
         limits:
             cpu: 2
             memory: 200Mi
             gpu-vendor.com/gpu: 1
             nic-vendor.com/nic: 1
```

Following Figure 1 from the previous section, this would result in one of the following aligned allocations:

```
{cpu: {0, 1}, gpu: 0, nic: 0}
{cpu: {0, 2}, gpu: 0, nic: 0}
{cpu: {0, 3}, gpu: 0, nic: 0}
{cpu: {1, 2}, gpu: 0, nic: 0}
{cpu: {1, 3}, gpu: 0, nic: 0}
{cpu: {2, 3}, gpu: 0, nic: 0}

{cpu: {4, 5}, gpu: 1, nic: 1}
{cpu: {4, 6}, gpu: 1, nic: 1}
{cpu: {4, 7}, gpu: 1, nic: 1}
{cpu: {5, 6}, gpu: 1, nic: 1}
{cpu: {5, 7}, gpu: 1, nic: 1}
{cpu: {6, 7}, gpu: 1, nic: 1}
```

And that’s it! Just follow this pattern to have the **<code>TopologyManager</code>** ensure NUMA alignment across containers that request topology-aware devices and exclusive CPUs.

**NOTE:** if a pod is rejected by one of the **<code>TopologyManager</code>** policies, it will be placed in a **<code>Terminated</code>** state with a pod admission error and a reason of "**<code>TopologyAffinityError</code>**". Once a pod is in this state, the Kubernetes scheduler will not attempt to reschedule it. It is therefore recommended to use a [**<code>Deployment</code>**](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment) with replicas to trigger a redeploy of the pod on such a failure. An [external control loop](https://kubernetes.io/docs/concepts/architecture/controller/) can also be implemented to trigger a redeployment of pods that have a **<code>TopologyAffinityError</code>**.

## This is great, so how does it work under the hood?

Pseudocode for the primary logic carried out by the **<code>TopologyManager</code>** can be seen below:

```
for container := range append(InitContainers, Containers...) {
    for provider := range HintProviders {
        hints += provider.GetTopologyHints(container)
    }

    bestHint := policy.Merge(hints)

    for provider := range HintProviders {
        provider.Allocate(container, bestHint)
    }
}
```

The following diagram summarizes the steps taken during this loop:

<p align="center">
  <img weight="200" height="200" src="/images/blog/2020-03-25-kubernetes-1.18-release-announcement/numa-steps-during-loop.png">
</p>

The steps themselves are:

1. Loop over all containers in a pod.
1. For each container, gather "**<code>TopologyHints</code>**" from a set of "**<code>HintProviders</code>**" for each topology-aware resource type requested by the container (e.g. **<code>gpu-vendor.com/gpu</code>**, **<code>nic-vendor.com/nic</code>**, **<code>cpu</code>**, etc.).
1. Using the selected policy, merge the gathered **<code>TopologyHints</code>** to find the "best" hint that aligns resource allocations across all resource types.
1. Loop back over the set of hint providers, instructing them to allocate the resources they control using the merged hint as a guide.
1. This loop runs at pod admission time and will fail to admit the pod if any of these steps fail or alignment cannot be satisfied according to the selected policy. Any resources allocated before the failure are cleaned up accordingly.

The following sections go into more detail on the exact structure of **<code>TopologyHints</code>** and **<code>HintProviders</code>**, as well as some details on the merge strategies used by each policy.

### TopologyHints

A **<code>TopologyHint</code>** encodes a set of constraints from which a given resource request can be satisfied. At present, the only constraint we consider is NUMA alignment. It is defined as follows:

```
type TopologyHint struct {
    NUMANodeAffinity bitmask.BitMask
    Preferred bool
}
```

The **<code>NUMANodeAffinity</code>** field contains a bitmask of NUMA nodes where a resource request can be satisfied. For example, the possible masks on a system with 2 NUMA nodes include:

```
{00}, {01}, {10}, {11}
```

The **<code>Preferred</code>** field contains a boolean that encodes whether the given hint is "preferred" or not. With the **<code>best-effort</code>** policy, preferred hints will be given preference over non-preferred hints when generating a "best" hint. With the **<code>restricted</code>** and **<code>single-numa-node</code>** policies, non-preferred hints will be rejected.

In general, **<code>HintProviders</code>** generate **<code>TopologyHints</code>** by looking at the set of currently available resources that can satisfy a resource request. More specifically, they generate one **<code>TopologyHint</code>** for every possible mask of NUMA nodes where that resource request can be satisfied. If a mask cannot satisfy the request, it is omitted. For example, a **<code>HintProvider</code>** might provide the following hints on a system with 2 NUMA nodes when being asked to allocate 2 resources. These hints encode that both resources could either come from a single NUMA node (either 0 or 1), or they could each come from different NUMA nodes (but we prefer for them to come from just one).

```
{01: True}, {10: True}, {11: False}
```

At present, all **<code>HintProviders</code>** set the **<code>Preferred</code>** field to **<code>True</code>** if and only if the **<code>NUMANodeAffinity</code>** encodes a _minimal_ set of NUMA nodes that can satisfy the resource request. Normally, this will only be **<code>True</code>** for **<code>TopologyHints</code>** with a single NUMA node set in their bitmask. However, it may also be **<code>True</code>** if the only way to _ever_ satisfy the resource request is to span multiple NUMA nodes (e.g. 2 devices are requested and the only 2 devices on the system are on different NUMA nodes):

```
{0011: True}, {0111: False}, {1011: False}, {1111: False}
```

**NOTE:** Setting of the **<code>Preferred</code>** field in this way is _not_ based on the set of currently available resources. It is based on the ability to physically allocate the number of requested resources on some minimal set of NUMA nodes.

In this way, it is possible for a **<code>HintProvider</code>** to return a list of hints with _all_ **<code>Preferred</code>** fields set to **<code>False</code>** if an actual preferred allocation cannot be satisfied until other containers release their resources. For example, consider the following scenario from the system in Figure 1:

1. All but 2 CPUs are currently allocated to containers
1. The 2 remaining CPUs are on different NUMA nodes
1. A new container comes along asking for 2 CPUs 

In this case, the only generated hint would be **<code>{11: False}</code>** and not **<code>{11: True}</code>**. This happens because it _is_ possible to allocate 2 CPUs from the same NUMA node on this system (just not right now, given the current allocation state). The idea being that it is better to fail pod admission and retry the deployment when the minimal alignment can be satisfied than to allow a pod to be scheduled with sub-optimal alignment.

### HintProviders

A **<code>HintProvider</code>** is a component internal to the **<code>kubelet</code>** that coordinates aligned resource allocations with the **<code>TopologyManager</code>**. At present, the only **<code>HintProviders</code>** in Kubernetes are the **<code>CPUManager</code>** and the **<code>DeviceManager</code>**. We plan to add support for **<code>HugePages</code>** soon.

As discussed previously, the **<code>TopologyManager</code>** both gathers **<code>TopologyHints</code>** from **<code>HintProviders</code>** as well as triggers aligned resource allocations on them using a merged "best" hint. As such, **<code>HintProviders</code>** implement the following interface:

```
type HintProvider interface {
    GetTopologyHints(*v1.Pod, *v1.Container) map[string][]TopologyHint
    Allocate(*v1.Pod, *v1.Container) error
}
```

Notice that the call to **<code>GetTopologyHints()</code>** returns a **<code>map[string][]TopologyHint</code>**. This allows a single **<code>HintProvider</code>** to provide hints for multiple resource types instead of just one. For example, the **<code>DeviceManager</code>** requires this in order to pass hints back for every resource type registered by its plugins.

As **<code>HintProviders</code>** generate their hints, they only consider how alignment could be satisfied for _currently_ available resources on the system. Any resources already allocated to other containers are not considered.

For example, consider the system in Figure 1, with the following two containers requesting resources from it:

<table>
  <tr>
   <td align="center"><strong><code>Container0</code></strong>
   </td>
   <td align="center"><strong><code>Container1</code></strong>
   </td>
  </tr>
  <tr>
   <td>

<pre>
spec:
    containers:
    - name: numa-aligned-container0
      image: alpine
      resources:
          limits:
              cpu: 2
              memory: 200Mi
              gpu-vendor.com/gpu: 1
              nic-vendor.com/nic: 1
</pre>

   </td>
   <td>

<pre>
spec:
    containers:
    - name: numa-aligned-container1
      image: alpine
      resources:
          limits:
              cpu: 2
              memory: 200Mi
              gpu-vendor.com/gpu: 1
              nic-vendor.com/nic: 1
</pre>

   </td>
  </tr>
</table>

If **<code>Container0</code>** is the first container considered for allocation on the system, the following set of hints will be generated for the three topology-aware resource types in the spec.

```
               cpu: {{01: True}, {10: True}, {11: False}}
gpu-vendor.com/gpu: {{01: True}, {10: True}}
nic-vendor.com/nic: {{01: True}, {10: True}}
```

With a resulting aligned allocation of:

```
{cpu: {0, 1}, gpu: 0, nic: 0}
```

<p align="center">
  <img height="300" src="/images/blog/2020-03-25-kubernetes-1.18-release-announcement/numa-hint-provider1.png">
</p>


When considering **<code>Container1</code>** these resources are then presumed to be unavailable, and thus only the following set of hints will be generated:

```
               cpu: {{01: True}, {10: True}, {11: False}}
gpu-vendor.com/gpu: {{10: True}}
nic-vendor.com/nic: {{10: True}}
```

With a resulting aligned allocation of:


```
{cpu: {4, 5}, gpu: 1, nic: 1}
```

<p align="center">
  <img height="300" src="/images/blog/2020-03-25-kubernetes-1.18-release-announcement/numa-hint-provider2.png">
</p>


**NOTE:** Unlike the pseudocode provided at the beginning of this section, the call to **<code>Allocate()</code>** does not actually take a parameter for the merged "best" hint directly. Instead, the **<code>TopologyManager</code>** implements the following **<code>Store</code>** interface that **<code>HintProviders</code>** can query to retrieve the hint generated for a particular container once it has been generated:

```
type Store interface {
    GetAffinity(podUID string, containerName string) TopologyHint
}
```

Separating this out into its own API call allows one to access this hint outside of the pod admission loop. This is useful for debugging as well as for reporting generated hints in tools such as **<code>kubectl</code>**(not yet available).

### Policy.Merge

The merge strategy defined by a given policy dictates how it combines the set of **<code>TopologyHints</code>** generated by all **<code>HintProviders</code>** into a single **<code>TopologyHint</code>** that can be used to inform aligned resource allocations.

The general merge strategy for all supported policies begins the same:

1. Take the cross-product of **<code>TopologyHints</code>** generated for each resource type
1. For each entry in the cross-product, **<code>bitwise-and</code>** the NUMA affinities of each **<code>TopologyHint</code>** together. Set this as the NUMA affinity in a resulting "merged" hint.
1. If all of the hints in an entry have **<code>Preferred</code>** set to **<code>True</code>** , set **<code>Preferred</code>** to **<code>True</code>** in the resulting "merged" hint.
1. If even one of the hints in an entry has **<code>Preferred</code>** set to **<code>False</code>** , set **<code>Preferred</code>** to **<code>False</code>**  in the resulting "merged" hint. Also set **<code>Preferred</code>** to **<code>False</code>** in the "merged" hint if its NUMA affinity contains all 0s.

Following the example from the previous section with hints for **<code>Container0</code>** generated as:

```
               cpu: {{01: True}, {10: True}, {11: False}}
gpu-vendor.com/gpu: {{01: True}, {10: True}}
nic-vendor.com/nic: {{01: True}, {10: True}}
```

The above algorithm results in the following set of cross-product entries and "merged" hints:

<table>
  <tr>
   <td align="center">cross-product entry
<p>
<strong><code>{cpu, gpu-vendor.com/gpu, nic-vendor.com/nic}</code></strong>
</p>
   </td>
   <td align="center">"merged" hint
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{01:  True}, {01: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{01:  True}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{01:  True}, {01: True}, {10: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{01:  True}, {10: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{01:  True}, {10: True}, {10: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{10:  True}, {01: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{10:  True}, {01: True}, {10: True}}</code></strong>
   </td align="center">
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{10:  True}, {10: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{10:  True}, {10: True}, {10: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{01:  True}</code></strong>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{11: False}, {01: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{01: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{11: False}, {01: True}, {10: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{11: False}, {10: True}, {01: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{00: False}</code></strong>
   </td>
  </tr>
  <tr>
   <td align="center">
    <strong><code>{{11: False}, {10: True}, {10: True}}</code></strong>
   </td>
   <td align="center"><strong><code>{10: False}</code></strong>
   </td>
  </tr>
</table>


Once this list of "merged" hints has been generated, it is the job of the specific **<code>TopologyManager</code>** policy in use to decide which one to consider as the "best" hint.

In general, this involves:

1. Sorting merged hints by their "narrowness". Narrowness is defined as the number of bits set in a hint’s NUMA affinity mask. The fewer bits set, the narrower the hint. For hints that have the same number of bits set in their NUMA affinity mask, the hint with the most low order bits set is considered narrower.
1. Sorting merged hints by their **<code>Preferred</code>** field. Hints that have **<code>Preferred</code>** set to **<code>True</code>** are considered more likely candidates than hints with **<code>Preferred</code>** set to **<code>False</code>**.
1. Selecting the narrowest hint with the best possible setting for **<code>Preferred</code>**.

In the case of the **<code>best-effort</code>** policy this algorithm will always result in _some_ hint being selected as the "best" hint and the pod being admitted. This "best" hint is then made available to **<code>HintProviders</code>** so they can make their resource allocations based on it.

However, in the case of the **<code>restricted</code>** and **<code>single-numa-node</code>** policies, any selected hint with **<code>Preferred</code>** set to **<code>False</code>** will be rejected immediately, causing pod admission to fail and no resources to be allocated. Moreover, the **<code>single-numa-node</code>** will also reject a selected hint that has more than one NUMA node set in its affinity mask.

In the example above, the pod would be admitted by all policies with a hint of **<code>{01: True}</code>**.

## Upcoming enhancements

While the 1.18 release and promotion to Beta brings along some great enhancements and fixes, there are still a number of limitations, described [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/#known-limitations). We are already underway working to address these limitations and more.

This section walks through the set of enhancements we plan to implement for the **<code>TopologyManager</code>** in the near future. This list is not exhaustive, but it gives a good idea of the direction we are moving in. It is ordered by the timeframe in which we expect to see each enhancement completed.

If you would like to get involved in helping with any of these enhancements, please [join the weekly Kubernetes SIG-node meetings](https://github.com/kubernetes/community/tree/master/sig-node) to learn more and become part of the community effort!

### Supporting device-specific constraints

Currently, NUMA affinity is the only constraint considered by the **<code>TopologyManager</code>** for resource alignment. Moreover, the only scalable extensions that can be made to a **<code>TopologyHint</code>** involve _node-level_ constraints, such as PCIe bus alignment across device types. It would be intractable to try and add any _device-specific_ constraints to this struct (e.g. the internal NVLINK topology among a set of GPU devices).

As such, we propose an extension to the device plugin interface that will allow a plugin to state its topology-aware allocation preferences, without having to expose any device-specific topology information to the kubelet. In this way, the **<code>TopologyManager</code>** can be restricted to only deal with common node-level topology constraints, while still having a way of incorporating device-specific topology constraints into its allocation decisions.

Details of this proposal can be found [here](https://github.com/kubernetes/enhancements/pull/1121), and should be available as soon as Kubernetes 1.19.

### NUMA alignment for hugepages

As stated previously, the only two **<code>HintProviders</code>** currently available to the **<code>TopologyManager</code>** are the **<code>CPUManager</code>** and the **<code>DeviceManager</code>**. However, work is currently underway to add support for hugepages as well. With the completion of this work, the **<code>TopologyManager</code>** will finally be able to allocate memory, hugepages, CPUs and PCI devices all on the same NUMA node.

A [KEP](https://github.com/kubernetes/enhancements/blob/253f1e5bdd121872d2d0f7020a5ac0365b229e30/keps/sig-node/20200203-memory-manager.md) for this work is currently under review, and a prototype is underway to get this feature implemented very soon.


### Scheduler awareness

Currently, the **<code>TopologyManager</code>** acts as a Pod Admission controller. It is not directly involved in the scheduling decision of where a pod will be placed. Rather, when the kubernetes scheduler (or whatever scheduler is running in the deployment), places a pod on a node to run, the **<code>TopologyManager</code>** will decide if the pod should be "admitted" or "rejected". If the pod is rejected due to lack of available NUMA aligned resources, things can get a little interesting. This kubernetes [issue](https://github.com/kubernetes/kubernetes/issues/84869) highlights and discusses this situation well.

So how do we go about addressing this limitation? We have the [Kubernetes Scheduling Framework](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20180409-scheduling-framework.md) to the rescue! This framework provides a new set of plugin APIs that integrate with the existing Kubernetes Scheduler and allow scheduling features, such as NUMA alignment, to be implemented without having to resort to other, perhaps less appealing alternatives, including writing your own scheduler, or even worse, creating a fork to add your own scheduler secret sauce.

The details of how to implement these extensions for integration with the **<code>TopologyManager</code>** have not yet been worked out. We still need to answer questions like:

* Will we require duplicated logic to determine device affinity in the **<code>TopologyManager</code>** and the scheduler?
* Do we need a new API to get **<code>TopologyHints</code>** from the **<code>TopologyManager</code>** to the scheduler plugin?

Work on this feature should begin in the next couple of months, so stay tuned!


### Per-pod alignment policy

As stated previously, a single policy is applied to _all_ pods on a node via a global **<code>kubelet</code>** flag, rather than allowing users to select different policies on a pod-by-pod basis (or a container-by-container basis).

While we agree that this would be a great feature to have, there are quite a few hurdles that need to be overcome before it is achievable. The biggest hurdle being that this enhancement will require an API change to be able to express the desired alignment policy in either the Pod spec or its associated **<code>[RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/)</code>**.

We are only now starting to have serious discussions around this feature, and it is still a few releases away, at the best, from being available.

## Conclusion

With the promotion of the **<code>TopologyManager</code>** to Beta in 1.18, we encourage everyone to give it a try and look forward to any feedback you may have. Many fixes and enhancements have been worked on in the past several releases, greatly improving the functionality and reliability of the **<code>TopologyManager</code>** and its **<code>HintProviders</code>**. While there are still a number of limitations, we have a set of enhancements planned to address them, and look forward to providing you with a number of new features in upcoming releases.

If you have ideas for additional enhancements or a desire for certain features, don’t hesitate to let us know. The team is always open to suggestions to enhance and improve the **<code>TopologyManager</code>**.

We hope you have found this blog informative and useful! Let us know if you have any questions or comments. And, happy deploying…..Align Up!


<!-- Docs to Markdown version 1.0β20 -->