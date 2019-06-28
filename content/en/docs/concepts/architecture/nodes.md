---
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

A node is a worker machine in Kubernetes, previously known as a `minion`. A node
may be a VM or physical machine, depending on the cluster. Each node contains
the services necessary to run [pods](/docs/concepts/workloads/pods/pod/) and is managed by the master
components. The services on a node include the [container runtime](/docs/concepts/overview/components/#node-components), kubelet and kube-proxy. See
[The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) section in the
architecture design doc for more details.

{{% /capture %}}


{{% capture body %}}

## Node Status

A node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)

Node status and other details about a node can be displayed using below command:
```shell
kubectl describe node <insert-node-name-here>
```
Each section is described in detail below.

### Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.

* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.


### Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:

| Node Condition | Description |
|----------------|-------------|
| `OutOfDisk`    | `True` if there is insufficient free space on the node for adding new pods, otherwise `False` |
| `Ready`        | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `MemoryPressure`    | `True` if pressure exists on the node memory -- that is, if the node memory is low; otherwise `False` |
| `PIDPressure`    | `True` if pressure exists on the processes -- that is, if there are too many processes on the node; otherwise `False` |
| `DiskPressure`    | `True` if pressure exists on the disk size -- that is, if the disk capacity is low; otherwise `False` |
| `NetworkUnavailable`    | `True` if the network for the node is not correctly configured, otherwise `False` |

The node condition is represented as a JSON object. For example, the following response describes a healthy node.

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

If the Status of the Ready condition remains `Unknown` or `False` for longer than the `pod-eviction-timeout`, an argument is passed to the [kube-controller-manager](/docs/admin/kube-controller-manager/) and all the Pods on the node are scheduled for deletion by the Node Controller. The default eviction timeout duration is **five minutes**. In some cases when the node is unreachable, the apiserver is unable to communicate with the kubelet on the node. The decision to delete the pods cannot be communicated to the kubelet until communication with the apiserver is re-established. In the meantime, the pods that are scheduled for deletion may continue to run on the partitioned node.

In versions of Kubernetes prior to 1.5, the node controller would [force delete](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)
these unreachable pods from the apiserver. However, in 1.5 and higher, the node controller does not force delete pods until it is
confirmed that they have stopped running in the cluster. You can see the pods that might be running on an unreachable node as being in
the `Terminating` or `Unknown` state. In cases where Kubernetes cannot deduce from the underlying infrastructure if a node has
permanently left a cluster, the cluster administrator may need to delete the node object by hand.  Deleting the node object from
Kubernetes causes all the Pod objects running on the node to be deleted from the apiserver, and frees up their names.

In version 1.12, `TaintNodesByCondition` feature is promoted to beta, so node lifecycle controller automatically creates
[taints](/docs/concepts/configuration/taint-and-toleration/) that represent conditions.
Similarly the scheduler ignores conditions when considering a Node; instead
it looks at the Node's taints and a Pod's tolerations.

Now users can choose between the old scheduling model and a new, more flexible scheduling model.
A Pod that does not have any tolerations gets scheduled according to the old model. But a Pod that
tolerates the taints of a particular Node can be scheduled on that Node.

{{< caution >}}
Enabling this feature creates a small delay between the
time when a condition is observed and when a taint is created. This delay is usually less than one second, but it can increase the number of Pods that are successfully scheduled but rejected by the kubelet.
{{< /caution >}}

### Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.

The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources that on a
Node that are available to be consumed by normal Pods.

You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
on a Node.

### Info

General information about the node, such as kernel version, Kubernetes version
(kubelet and kube-proxy version), Docker version (if used), OS name.
The information is gathered by Kubelet from the node.

## Management

Unlike [pods](/docs/concepts/workloads/pods/pod/) and [services](/docs/concepts/services-networking/service/),
a node is not inherently created by Kubernetes: it is created externally by cloud
providers like Google Compute Engine, or it exists in your pool of physical or virtual
machines. So when Kubernetes creates a node, it creates
an object that represents the node. After creation, Kubernetes
checks whether the node is valid or not. For example, if you try to create
a node from the following content:

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

Kubernetes creates a node object internally (the representation), and
validates the node by health checking based on the `metadata.name` field. If the node is valid -- that is, if all necessary
services are running -- it is eligible to run a pod. Otherwise, it is
ignored for any cluster activity until it becomes valid.

{{< note >}}
Kubernetes keeps the object for the invalid node and keeps checking to see whether it becomes valid.
You must explicitly delete the Node object to stop this process.
{{< /note >}}

Currently, there are three components that interact with the Kubernetes node
interface: node controller, kubelet, and kubectl.

### Node Controller

The node controller is a Kubernetes master component which manages various
aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).

The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment, whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.

The third is monitoring the nodes' health. The node controller is
responsible for updating the NodeReady condition of NodeStatus to
ConditionUnknown when a node becomes unreachable (i.e. the node controller stops
receiving heartbeats for some reason, e.g. due to the node being down), and then later evicting
all the pods from the node (using graceful termination) if the node continues
to be unreachable. (The default timeouts are 40s to start reporting
ConditionUnknown and 5m after that to start evicting pods.) The node controller
checks the state of each node every `--node-monitor-period` seconds.

In versions of Kubernetes prior to 1.13, NodeStatus is the heartbeat from the
node. Starting from Kubernetes 1.13, node lease feature is introduced as an
alpha feature (feature gate `NodeLease`,
[KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)).
When node lease feature is enabled, each node has an associated `Lease` object in
`kube-node-lease` namespace that is renewed by the node periodically, and both
NodeStatus and node lease are treated as heartbeats from the node. Node leases
are renewed frequently while NodeStatus is reported from node to master only
when there is some change or enough time has passed (default is 1 minute, which
is longer than the default timeout of 40 seconds for unreachable nodes). Since
node lease is much more lightweight than NodeStatus, this feature makes node
heartbeat significantly cheaper from both scalability and performance
perspectives.

In Kubernetes 1.4, we updated the logic of the node controller to better handle
cases when a large number of nodes have problems with reaching the master
(e.g. because the master has networking problem). Starting with 1.4, the node
controller looks at the state of all nodes in the cluster when making a
decision about pod eviction.

In most cases, node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.

The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (NodeReady condition is ConditionUnknown or ConditionFalse) at
the same time. If the fraction of unhealthy nodes is at least
`--unhealthy-zone-threshold` (default 0.55) then the eviction rate is reduced:
if the cluster is small (i.e. has less than or equal to
`--large-cluster-size-threshold` nodes - default 50) then evictions are
stopped, otherwise the eviction rate is reduced to
`--secondary-node-eviction-rate` (default 0.01) per second. The reason these
policies are implemented per availability zone is because one availability zone
might become partitioned from the master while the others remain connected. If
your cluster does not span multiple cloud provider availability zones, then
there is only one availability zone (the whole cluster).

A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `--node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (i.e. there are no healthy nodes in the cluster). In such
case, the node controller assumes that there's some problem with master
connectivity and stops all evictions until some connectivity is restored.

Starting in Kubernetes 1.6, the NodeController is also responsible for evicting
pods that are running on nodes with `NoExecute` taints, when the pods do not tolerate
the taints. Additionally, as an alpha feature that is disabled by default, the
NodeController is responsible for adding taints corresponding to node problems like
node unreachable or not ready. See [this documentation](/docs/concepts/configuration/taint-and-toleration/)
for details about `NoExecute` taints and the alpha feature.

Starting in version 1.8, the node controller can be made responsible for creating taints that represent
Node conditions. This is an alpha feature of version 1.8.

### Self-Registration of Nodes

When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:

  - `--kubeconfig` - Path to credentials to authenticate itself to the apiserver.
  - `--cloud-provider` - How to talk to a cloud provider to read metadata about itself.
  - `--register-node` - Automatically register with the API server.
  - `--register-with-taints` - Register the node with the given list of taints (comma separated `<key>=<value>:<effect>`). No-op if `register-node` is false.
  - `--node-ip` - IP address of the node.
  - `--node-labels` - Labels to add when registering the node in the cluster (see label restrictions enforced by the [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) in 1.13+).
  - `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.

When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and 
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) are enabled,
kubelets are only authorized to create/modify their own Node resource.

#### Manual Node Administration

A cluster administrator can create and modify node objects.

If the administrator wishes to create node objects manually, set the kubelet flag
`--register-node=false`.

The administrator can modify node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the node and marking it unschedulable.

Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a pod to only be eligible to run on a subset of the nodes.

Marking a node as unschedulable prevents new pods from being scheduled to that
node, but does not affect any existing pods on the node. This is useful as a
preparatory step before a node reboot, etc. For example, to mark a node
unschedulable, run this command:

```shell
kubectl cordon $NODENAME
```

{{< note >}}
Pods created by a DaemonSet controller bypass the Kubernetes scheduler
and do not respect the unschedulable attribute on a node. This assumes that daemons belong on
the machine even if it is being drained of applications while it prepares for a reboot.
{{< /note >}}

### Node capacity

The capacity of the node (number of cpus and amount of memory) is part of the node object.
Normally, nodes register themselves and report their capacity when creating the node object. If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.

The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the requests of containers on the node is no greater than the node capacity.  It
includes all containers started by the kubelet, but not containers started directly by the [container runtime](/docs/concepts/overview/components/#node-components) nor any process running outside of the containers.

If you want to explicitly reserve resources for non-Pod processes, follow this tutorial to
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).


## API Object

Node is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Node API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).

{{% /capture %}}
