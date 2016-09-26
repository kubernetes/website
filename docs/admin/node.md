---
assignees:
- caesarxuchao
- dchen1107
- lavalamp

---

* TOC
{:toc}

## What is a node?

`Node` is a worker machine in Kubernetes, previously known as `Minion`. Node
may be a VM or physical machine, depending on the cluster. Each node has
the services necessary to run [Pods](/docs/user-guide/pods) and is managed by the master
components. The services on a node include docker, kubelet and network proxy. See
[The Kubernetes Node](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/architecture.md#the-kubernetes-node) section in the
architecture design doc for more details.

## Node Status

Node status describes current status of a node. For now, there are the following
pieces of information:

### Node Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.

* HostName: Generally not used

* ExternalIP: Generally the IP address of the node that is externally routable (available from outside the cluster)

* InternalIP: Generally the IP address of the node that is routable only within the cluster


### Node Phase

Deprecated: Node Phase is no longer used

### Node Condition

The `conditions` field describes the status of all `Running` nodes.

| Node Condition | Description |
|----------------|-------------|
| `OutOfDisk`    | `True` if insufficient free space on the node for adding new pods, otherwise `False` |
| `Ready`        | `True` if the node is healthy ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the Node Controller has not heard from the node in the last 40 seconds |

Node condition is represented as a JSON object. For example, the following response describes a healthy node:
conditions mean the node is in sane state:

```json
"conditions": [
  {
    "kind": "Ready",
    "status": "True"
  }
]
```

If the Status of the Ready condition
is Unknown or False for more than five minutes, then all of the Pods on the node are terminated by the Node Controller.

### Node Capacity

Describes the resources available on the node: CPUs, memory and the maximum
number of pods that can be scheduled onto the node.

### Node Info

General information about the node, for instance kernel version, Kubernetes version
(kubelet version, kube-proxy version), docker version (if used), OS name.
The information is gathered by Kubelet from the node.

## Node Management

Unlike [Pods](/docs/user-guide/pods) and [Services](/docs/user-guide/services), a Node is not inherently
created by Kubernetes: it is either taken from cloud providers like Google Compute Engine,
or from your pool of physical or virtual machines. What this means is that when
Kubernetes creates a node, it is really just creating an object that represents the node in its internal state.
After creation, Kubernetes will check whether the node is valid or not.
For example, if you try to create a node from the following content:

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

Kubernetes will create a Node object internally (the representation), and
validate the node by health checking based on the `metadata.name` field: we
assume `metadata.name` can be resolved. If the node is valid, i.e. all necessary
services are running, it is eligible to run a Pod; otherwise, it will be
ignored for any cluster activity, until it becomes valid. Note that Kubernetes
will keep the object for the invalid node unless it is explicitly deleted by the client, and it will keep
checking to see if it becomes valid.

Currently, there are three components that interact with the Kubernetes node interface: Node Controller, Kubelet, and kubectl.

### Node Controller

Node controller is a component in Kubernetes master which manages Node
objects.

Node controller has mutliple roles in Node's life. First is assigning a CIDR block to
the Node when it is registered (if CIDR assignment is turned on). Second is keeping the
node controller's list of nodes up to date with the cloud provider's list of available
machines. When running in cloud environment whenever a node is unhealthy node controller
asks cloud provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.

Third responsibiliy is monitoring Node's health. Node controller is responsible for updating
the NodeReady condition of NodeStatus to ConditionUnknown when a node becomes unreachable
(i.e. node controller stops receiving heartbeats e.g. due to the node being down), and then
later evicting all the pods from the node (using graceful termination) if the node continues
to be unreachable (the current timeouts are 40s to start reporting ConditionUnknown and 5m
after that to start evicting pods). Node controller checks the state of each node every
`--node-monitor-period` seconds.

In 1.4 release we updated the logic of node controller to better handle cases when a
big number of Nodes have problems with reaching the master machine (e.g. because
master machine has networking problem). Starting with 1.4 node controller will look at the
state of all Nodes in the cluster when making a decision about pod eviction.

In most cases, node controller limits the eviction rate to `--node-eviction-rate` (default 0.1)
per second, meaning it won't evict pods from more than 1 node per 10 seconds.

The node eviction behavior changes when a node in a given availability zone becomes unhealthy,
node controller checks what percentage of nodes in the zone are unhealthy (NodeReady condition
is ConditionUnknown or ConditionFalse) at the same time. If the fraction of unhealthy nodes is
at least `--unhealthy-zone-threshold` (default 0.55) then the eviction rate is  reduced: if
the cluster is small (i.e. has less than or equal to `--large-cluster-size-threshold`
nodes - default 50) then evictions are stopped, otherwise the eviction rate is reduced to
`--secondary-node-eviction-rate` (default 0.01) per second. The reason these policies are
implemented per availability zone is because one availability zone might become partitioned
from the master while the others remain connected. If your cluster does not span multiple cloud
provider availability zones, then there is only one availability zone, namely the whole cluster.

A key reason for spreading your nodes across availability zones is so that workload can be
shifted to healthy zones when one entire zone goes down. To enable this behavior, if all
nodes in a zone are unhealthy then node controller evicts at the normal rate `--node-eviction-rate`.
The corner case for that is when all zones are completely unhealthy (i.e. there's no healthy node in
the cluster). In such case node controller assumes that there's some problem with master machine
connectivity and stops all evictions until any connectivity is restored.

### Self-Registration of Nodes

When kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:

  - `--api-servers=` tells the kubelet the location of the apiserver.
  - `--kubeconfig` tells kubelet where to find credentials to authenticate itself to the apiserver.
  - `--cloud-provider=` tells the kubelet how to talk to a cloud provider to read metadata about itself.
  - `--register-node` tells the kubelet to create its own node resource.

Currently, any kubelet is authorized to create/modify any node resource, but in practice it only creates/modifies
its own.  (In the future, we plan to limit authorization to only allow a kubelet to modify its own Node resource.)

#### Manual Node Administration

A cluster administrator can create and modify Node objects.

If the administrator wishes to create node objects manually, set kubelet flag
`--register-node=false`.

The administrator can modify Node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the Node, and marking it unschedulable.

Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a Pod to only be eligible to run on a subset of the nodes.

Making a node unscheduleable will prevent new pods from being scheduled to that
node, but will not affect any existing pods on the node.  This is useful as a
preparatory step before a node reboot, etc.  For example, to mark a node
unschedulable, run this command:

```shell
kubectl patch nodes $NODENAME -p '{"spec": {"unschedulable": true}}'
```

Note that pods which are created by a daemonSet controller bypass the Kubernetes scheduler,
and do not respect the unschedulable attribute on a node.   The assumption is that daemons belong on
the machine even if it is being drained of applications in preparation for a reboot.

### Node capacity

The capacity of the node (number of cpus and amount of memory) is part of the node resource.
Normally, nodes register themselves and report their capacity when creating the node resource.  If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.

The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the limits of containers on the node is no greater than the node capacity.  It
includes all containers started by kubelet, but not containers started directly by docker, nor
processes not in containers.

If you want to explicitly reserve resources for non-Pod processes, you can create a placeholder
pod.  Use the following template:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-reserver
spec:
  containers:
  - name: sleep-forever
    image: gcr.io/google_containers/pause:0.8.0
    resources:
      limits:
        cpu: 100m
        memory: 100Mi
```

Set the `cpu` and `memory` values to the amount of resources you want to reserve.
Place the file in the manifest directory (`--config=DIR` flag of kubelet).  Do this
on each kubelet where you want to reserve resources.


## API Object

Node is a top-level resource in the kubernetes REST API. More details about the
API object can be found at: [Node API
object](/docs/api-reference/v1/definitions/#_v1_node).
