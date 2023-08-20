---
content_type: reference
title: Node Status
weight: 80
---
<!-- overview -->

The status of a [node](/docs/concepts/architecture/nodes/) in Kubernetes is a critical
aspect of managing a Kubernetes cluster. In this article, we'll cover the basics of
monitoring and maintaining node status to ensure a healthy and stable cluster.

## Node status fields

A Node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)

You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```

Each section of the output is described below.

## Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.

* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet
  `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from
  outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.

## Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:

{{< table caption = "Node conditions, and a description of when each condition applies." >}}
| Node Condition       | Description |
|----------------------|-------------|
| `Ready`              | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `DiskPressure`       | `True` if pressure exists on the disk size—that is, if the disk capacity is low; otherwise `False` |
| `MemoryPressure`     | `True` if pressure exists on the node memory—that is, if the node memory is low; otherwise `False` |
| `PIDPressure`        | `True` if pressure exists on the processes—that is, if there are too many processes on the node; otherwise `False` |
| `NetworkUnavailable` | `True` if the network for the node is not correctly configured, otherwise `False` |
{{< /table >}}

{{< note >}}
If you use command-line tools to print details of a cordoned Node, the Condition includes
`SchedulingDisabled`. `SchedulingDisabled` is not a Condition in the Kubernetes API; instead,
cordoned nodes are marked Unschedulable in their spec.
{{< /note >}}

In the Kubernetes API, a node's condition is represented as part of the `.status`
of the Node resource. For example, the following JSON structure describes a healthy node:

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True",
    "reason": "KubeletReady",
    "message": "kubelet is posting ready status",
    "lastHeartbeatTime": "2019-06-05T18:38:35Z",
    "lastTransitionTime": "2019-06-05T11:41:27Z"
  }
]
```

When problems occur on nodes, the Kubernetes control plane automatically creates
[taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) that match the conditions
affecting the node. An example of this is when the `status` of the Ready condition
remains `Unknown` or `False` for longer than the kube-controller-manager's `NodeMonitorGracePeriod`,
which defaults to 40 seconds. This will cause either an `node.kubernetes.io/unreachable` taint, for an `Unknown` status,
or a `node.kubernetes.io/not-ready` taint, for a `False` status, to be added to the Node.

These taints affect pending pods as the scheduler takes the Node's taints into consideration when
assigning a pod to a Node. Existing pods scheduled to the node may be evicted due to the application
of `NoExecute` taints. Pods may also have {{< glossary_tooltip text="tolerations" term_id="toleration" >}} that let
them schedule to and continue running on a Node even though it has a specific taint.

See [Taint Based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions) and
[Taint Nodes by Condition](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
for more details.

## Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory, and the maximum
number of pods that can be scheduled onto the node.

The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.

You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
on a Node.

## Info

Describes general information about the node, such as kernel version, Kubernetes
version (kubelet and kube-proxy version), container runtime details, and which
operating system the node uses.
The kubelet gathers this information from the node and publishes it into
the Kubernetes API.

## Heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.

For nodes there are two forms of heartbeats:

* updates to the `.status` of a Node
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.

Compared to updates to `.status` of a Node, a Lease is a lightweight resource.
Using Leases for heartbeats reduces the performance impact of these updates
for large clusters.

The kubelet is responsible for creating and updating the `.status` of Nodes,
and for updating their related Leases.

- The kubelet updates the node's `.status` either when there is change in status
  or if there has been no update for a configured interval. The default interval
  for `.status` updates to Nodes is 5 minutes, which is much longer than the 40
  second default timeout for unreachable nodes.
- The kubelet creates and then updates its Lease object every 10 seconds
  (the default update interval). Lease updates occur independently from
  updates to the Node's `.status`. If the Lease update fails, the kubelet retries,
  using exponential backoff that starts at 200 milliseconds and capped at 7 seconds.
