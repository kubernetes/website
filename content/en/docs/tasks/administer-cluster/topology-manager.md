---
title: Control Topology Management Policies on a node
reviewers:
- lmdaly
- nolancon
content_template: templates/task
---

{{% capture overview %}}

{{< feature-state state="alpha" >}}

An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.

In order to extract the best performance, optimizations related to CPU isolation and memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.

_Topology Manager_ is a component in Kubelet that provides node level policies to enable these performance optimizations in an user abstract manner.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Topology Manager

Currently, the CPU and Device Manager in Kubernetes make resource allocation decisions independently of each other.
This can result in sub-optimal allocations on multiple-socketed systems, performance/latency sensitive applications
will suffer due to these sub-optimal allocations.

The Topology Manager introduces a algorithm to allow components that care about Topology Aware resource allocation to provide
a list of their resources with the associated socket. This allows the Topology Manager to calculate the best possible socket for
the incoming container and store this. The resource allocators can then consult this when making their resource allocation decisions.

### Configuration

The Topology Manager is an alpha feature in Kubernetes v1.15. 

The Topology Manager currently:
* Works on a nodes with the `static` CPU Manager Policy enabled. See [control CPU Management Policies](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/)
* Works on Pods in the `Guaranteed` QOS Class {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}. 
If these conditions are met, Topology Manager will align CPU and device requests.

Topology Manager has two allocation policies, that are set via a Kubelet flag `--topology-manager-policy`.
There are two supported policies:

*`preferred`: the default, which means the Topology Manager will provide the best fit allocation for the container
but will not fail the pod in the event a single socket allocation is not possible.
*`strict`: in the event a single socket allocation is not possible the Topology Manager will reject the pod from
the node.

### Preferred policy

The `preferred` policy makes calls for each incoming container to the resource 
allocators to provide their resource availablity.
Using this information, the Topology Manager stores the 
best socket affinity for that container. If the affinity is across
sockets, Topology Manager will store this and admit the pod to the node.

The resource alloctors can then use this information when making the 
resource allocation decision.

### Strict policy

The `strict` policy follows the same pattern of calls as the Preferred policy 
except in the event that a container cannot get a socket aligned allocation the
Topology Manager will reject the admission of the pod to the node.

### User Experience

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

Neither of these pod specifications would be considered by the Topology Manager policy.

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

This pod would be considered by the Topology Manager. In this case the CPU Manager Static policy would be consulted to send back available CPUs and their Topology, as well as this the Device Manager would be consulted to provide the Topology of example.com/device.

Topology Manager will use this information to store the best Topology for this container. In the case of this Pod, CPU and Device Manager will use this stored information at the resource allocation stage.

{{% /capture %}}

