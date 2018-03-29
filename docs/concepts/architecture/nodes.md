---
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
---

* TOC
{:toc}

## What is a node?

A `node` is a worker machine in Kubernetes, previously known as a `minion`. A node
may be a VM or physical machine, depending on the cluster. Each node has
the services necessary to run [pods](/docs/concepts/workloads/pods/pod/) and is managed by the master
components. The services on a node include Docker, kubelet and kube-proxy. See
[The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) section in the
architecture design doc for more details.

## Node Status

A node's status contains the following information:

* [Addresses](#addresses)
* ~~[Phase](#phase)~~ **deprecated**
* [Condition](#condition)
* [Capacity](#capacity)
* [Info](#info)

Each section is described in detail below.

### Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.

* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.

### Phase

Deprecated: node phase is no longer used.

### Condition

The `conditions` field describes the status of all `Running` nodes.

| Node Condition | Description |
|----------------|-------------|
| `OutOfDisk`    | `True` if there is insufficient free space on the node for adding new pods, otherwise `False` |
| `Ready`        | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last 40 seconds |
| `MemoryPressure`    | `True` if pressure exists on the node memory -- that is, if the node memory is low; otherwise `False` |
| `DiskPressure`    | `True` if pressure exists on the disk size -- that is, if the disk capacity is low; otherwise `False` |
| `NetworkUnavailable`    | `True` if the network for the node is not correctly configured, otherwise `False` |
| `ConfigOK`    | `True` if the kubelet is correctly configured, otherwise `False` |

The node condition is represented as a JSON object. For example, the following response describes a healthy node.

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True"
  }
]
```

If the Status of the Ready condition is "Unknown" or "False" for longer than the `pod-eviction-timeout`, an argument is passed to the [kube-controller-manager](/docs/admin/kube-controller-manager/) and all of the Pods on the node are scheduled for deletion by the Node Controller. The default eviction timeout duration is **five minutes**. In some cases when the node is unreachable, the apiserver is unable to communicate with the kubelet on it. The decision to delete the pods cannot be communicated to the kubelet until it re-establishes communication with the apiserver. In the meantime, the pods which are scheduled for deletion may continue to run on the partitioned node.

In versions of Kubernetes prior to 1.5, the node controller would [force delete](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)
these unreachable pods from the apiserver. However, in 1.5 and higher, the node controller does not force delete pods until it is
confirmed that they have stopped running in the cluster. One can see these pods which may be running on an unreachable node as being in
the "Terminating" or "Unknown" states. In cases where Kubernetes cannot deduce from the underlying infrastructure if a node has
permanently left a cluster, the cluster administrator may need to delete the node object by hand.  Deleting the node object from
Kubernetes causes all the Pod objects running on it to be deleted from the apiserver, freeing up their names.

Version 1.8 introduced an alpha feature that automatically creates
[taints](/docs/concepts/configuration/taint-and-toleration/) that represent conditions.
To enable this behavior, pass an additional feature gate flag `--feature-gates=...,TaintNodesByCondition=true`
to the API server, controller manager, and scheduler.
When `TaintNodesByCondition` is enabled, the scheduler ignores conditions when considering a Node; instead
it looks at the Node's taints and a Pod's tolerations.

Now users can choose between the old scheduling model and a new, more flexible scheduling model.
A Pod that does not have any tolerations gets scheduled according to the old model. But a Pod that 
tolerates the taints of a particular Node can be scheduled on that Node.

Note that because of small delay, usually less than one second, between time when condition is observed and a taint
is created, it's possible that enabling this feature will slightly increase number of Pods that are successfully
scheduled but rejected by the kubelet.

### Capacity

Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.

### Info

General information about the node, such as kernel version, Kubernetes version
(kubelet and kube-proxy version), Docker version (if used), OS name.
The information is gathered by Kubelet from the node.

## Management

Unlike [pods](/docs/concepts/workloads/pods/pod/) and [services](/docs/concepts/services-networking/service/),
a node is not inherently created by Kubernetes: it is created externally by cloud
providers like Google Compute Engine, or exists in your pool of physical or virtual
machines. What this means is that when Kubernetes creates a node, it is really
just creating an object that represents the node. After creation, Kubernetes
will check whether the node is valid or not. For example, if you try to create
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

Kubernetes will create a node object internally (the representation), and
validate the node by health checking based on the `metadata.name` field (we
assume `metadata.name` can be resolved). If the node is valid, i.e. all necessary
services are running, it is eligible to run a pod; otherwise, it will be
ignored for any cluster activity until it becomes valid. Note that Kubernetes
will keep the object for the invalid node unless it is explicitly deleted by
the client, and it will keep checking to see if it becomes valid.

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

In Kubernetes 1.4, we updated the logic of the node controller to better handle
cases when a large number of nodes have problems with reaching the master
(e.g. because the master has networking problem). Starting with 1.4, the node
controller will look at the state of all nodes in the cluster when making a
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
  - `--node-labels` - Labels to add when registering the node in the cluster.
  - `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.

Currently, any kubelet is authorized to create/modify any node resource, but in practice it only creates/modifies
its own. (In the future, we plan to only allow a kubelet to modify its own node resource.)

#### Manual Node Administration

A cluster administrator can create and modify node objects.

If the administrator wishes to create node objects manually, set the kubelet flag
`--register-node=false`.

The administrator can modify node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the node and marking it unschedulable.

Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a pod to only be eligible to run on a subset of the nodes.

Marking a node as unschedulable will prevent new pods from being scheduled to that
node, but will not affect any existing pods on the node. This is useful as a
preparatory step before a node reboot, etc. For example, to mark a node
unschedulable, run this command:

```shell
kubectl cordon $NODENAME
```

Note that pods which are created by a DaemonSet controller bypass the Kubernetes scheduler,
and do not respect the unschedulable attribute on a node.  The assumption is that daemons belong on
the machine even if it is being drained of applications in preparation for a reboot.

### Node capacity

The capacity of the node (number of cpus and amount of memory) is part of the node object.
Normally, nodes register themselves and report their capacity when creating the node object. If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.

The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the requests of containers on the node is no greater than the node capacity.  It
includes all containers started by the kubelet, but not containers started directly by Docker nor
processes not in containers.

If you want to explicitly reserve resources for non-pod processes, you can create a placeholder
pod. Use the following template:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-reserver
spec:
  containers:
  - name: sleep-forever
    image: k8s.gcr.io/pause:0.8.0
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
```

Set the `cpu` and `memory` values to the amount of resources you want to reserve.
Place the file in the manifest directory (`--config=DIR` flag of kubelet).  Do this
on each kubelet where you want to reserve resources.


## API Object

Node is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Node API object](/docs/reference/generated/kubernetes-api/{{page.version}}/#node-v1-core).
