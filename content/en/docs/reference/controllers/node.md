---
title: Node controller
content_template: templates/concept
---

{{% capture overview %}}

The node controller is a Kubernetes master component which manages various
aspects of nodes.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

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

The node controller looks at the state of all nodes in the cluster when making a
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

The NodeController is also responsible for evicting pods that are running on
nodes with `NoExecute` {{< glossary_tooltip text="taints" term_id="taint" >}},
when the pods do not tolerate
the taints.

### Node leases

In versions of Kubernetes prior to 1.13, NodeStatus is the heartbeat from the
node.

Starting from Kubernetes 1.13, node lease feature is introduced as an alpha feature
(feature gate `NodeLease`, [KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)).
When node lease feature is enabled, each node has an associated `Lease` object in
`kube-node-lease` namespace that is renewed by the node periodically, and both
NodeStatus and node lease are treated as heartbeats from the node. Node leases
are renewed frequently while NodeStatus is reported from node to master only
when there is some change or enough time has passed (default is 1 minute, which
is longer than the default timeout of 40 seconds for unreachable nodes). Since
node lease is much more lightweight than NodeStatus, this feature makes node
heartbeat significantly cheaper from both scalability and performance
perspectives.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [nodes](/docs/concepts/architecture/nodes/)
* Read about the [Node API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
{{% /capture %}}
