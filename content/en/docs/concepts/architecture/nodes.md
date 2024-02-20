---
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes runs your {{< glossary_tooltip text="workload" term_id="workload" >}}
by placing containers into Pods to run on _Nodes_.
A node may be a virtual or physical machine, depending on the cluster. Each node
is managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
and contains the services necessary to run
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

Typically you have several nodes in a cluster; in a learning or resource-limited
environment, you might have only one node.

The [components](/docs/concepts/overview/components/#node-components) on a node include the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and the
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.

<!-- body -->

## Management

There are two main ways to have Nodes added to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}:

1. The kubelet on a node self-registers to the control plane
2. You (or another human user) manually add a Node object

After you create a Node {{< glossary_tooltip text="object" term_id="object" >}},
or the kubelet on a node self-registers, the control plane checks whether the new Node object
is valid. For example, if you try to create a Node from the following JSON manifest:

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

Kubernetes creates a Node object internally (the representation). Kubernetes checks
that a kubelet has registered to the API server that matches the `metadata.name`
field of the Node. If the node is healthy (i.e. all necessary services are running),
then it is eligible to run a Pod. Otherwise, that node is ignored for any cluster activity
until it becomes healthy.

{{< note >}}
Kubernetes keeps the object for the invalid Node and continues checking to see whether
it becomes healthy.

You, or a {{< glossary_tooltip term_id="controller" text="controller">}}, must explicitly
delete the Node object to stop that health checking.
{{< /note >}}

The name of a Node object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

### Node name uniqueness

The [name](/docs/concepts/overview/working-with-objects/names#names) identifies a Node. Two Nodes
cannot have the same name at the same time. Kubernetes also assumes that a resource with the same
name is the same object. In case of a Node, it is implicitly assumed that an instance using the
same name will have the same state (e.g. network settings, root disk contents) and attributes like
node labels. This may lead to inconsistencies if an instance was modified without changing its name.
If the Node needs to be replaced or updated significantly, the existing Node object needs to be
removed from API server first and re-added after the update.

### Self-registration of Nodes

When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server. This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:

- `--kubeconfig` - Path to credentials to authenticate itself to the API server.
- `--cloud-provider` - How to talk to a {{< glossary_tooltip text="cloud provider" term_id="cloud-provider" >}}
  to read metadata about itself.
- `--register-node` - Automatically register with the API server.
- `--register-with-taints` - Register the node with the given list of
  {{< glossary_tooltip text="taints" term_id="taint" >}} (comma separated `<key>=<value>:<effect>`).

  No-op if `register-node` is false.
- `--node-ip` - Optional comma-separated list of the IP addresses for the node.
  You can only specify a single address for each address family.
  For example, in a single-stack IPv4 cluster, you set this value to be the IPv4 address that the
  kubelet should use for the node.
  See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)
  for details of running a dual-stack cluster.

  If you don't provide this argument, the kubelet uses the node's default IPv4 address, if any;
  if the node has no IPv4 addresses then the kubelet uses the node's default IPv6 address.
- `--node-labels` - {{< glossary_tooltip text="Labels" term_id="label" >}} to add when registering the node
  in the cluster (see label restrictions enforced by the
  [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Specifies how often kubelet posts its node status to the API server.

When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
are enabled, kubelets are only authorized to create/modify their own Node resource.

{{< note >}}
As mentioned in the [Node name uniqueness](#node-name-uniqueness) section,
when Node configuration needs to be updated, it is a good practice to re-register
the node with the API server. For example, if the kubelet being restarted with
the new set of `--node-labels`, but the same Node name is used, the change will
not take an effect, as labels are being set on the Node registration.

Pods already scheduled on the Node may misbehave or cause issues if the Node
configuration will be changed on kubelet restart. For example, already running
Pod may be tainted against the new labels assigned to the Node, while other
Pods, that are incompatible with that Pod will be scheduled based on this new
label. Node re-registration ensures all Pods will be drained and properly
re-scheduled.
{{< /note >}}

### Manual Node administration

You can create and modify Node objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

When you want to create Node objects manually, set the kubelet flag `--register-node=false`.

You can modify Node objects regardless of the setting of `--register-node`.
For example, you can set labels on an existing Node or mark it unschedulable.

You can use labels on Nodes in conjunction with node selectors on Pods to control
scheduling. For example, you can constrain a Pod to only be eligible to run on
a subset of the available nodes.

Marking a node as unschedulable prevents the scheduler from placing new pods onto
that Node but does not affect existing Pods on the Node. This is useful as a
preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, run:

```shell
kubectl cordon $NODENAME
```

See [Safely Drain a Node](/docs/tasks/administer-cluster/safely-drain-node/)
for more details.

{{< note >}}
Pods that are part of a {{< glossary_tooltip term_id="daemonset" >}} tolerate
being run on an unschedulable Node. DaemonSets typically provide node-local services
that should run on the Node even if it is being drained of workload applications.
{{< /note >}}

## Node status

A Node's status contains the following information:

* [Addresses](/docs/reference/node/node-status/#addresses)
* [Conditions](/docs/reference/node/node-status/#condition)
* [Capacity and Allocatable](/docs/reference/node/node-status/#capacity)
* [Info](/docs/reference/node/node-status/#info)

You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```

See [Node Status](/docs/reference/node/node-status/) for more details.

## Node heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.

For nodes there are two forms of heartbeats:

* Updates to the [`.status`](/docs/reference/node/node-status/) of a Node.
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.

## Node controller

The node {{< glossary_tooltip text="controller" term_id="controller" >}} is a
Kubernetes control plane component that manages various aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).

The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment and whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.

The third is monitoring the nodes' health. The node controller is
responsible for:

- In the case that a node becomes unreachable, updating the `Ready` condition
  in the Node's `.status` field. In this case the node controller sets the
  `Ready` condition to `Unknown`.
- If a node remains unreachable: triggering
  [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)
  for all of the Pods on the unreachable node. By default, the node controller
  waits 5 minutes between marking the node as `Unknown` and submitting
  the first eviction request.

By default, the node controller checks the state of each node every 5 seconds.
This period can be configured using the `--node-monitor-period` flag on the
`kube-controller-manager` component.

### Rate limits on eviction

In most cases, the node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.

The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (the `Ready` condition is `Unknown` or `False`) at the same time:

- If the fraction of unhealthy nodes is at least `--unhealthy-zone-threshold`
  (default 0.55), then the eviction rate is reduced.
- If the cluster is small (i.e. has less than or equal to
  `--large-cluster-size-threshold` nodes - default 50), then evictions are stopped.
- Otherwise, the eviction rate is reduced to `--secondary-node-eviction-rate`
  (default 0.01) per second.

The reason these policies are implemented per availability zone is because one
availability zone might become partitioned from the control plane while the others remain
connected. If your cluster does not span multiple cloud provider availability zones,
then the eviction mechanism does not take per-zone unavailability into account.

A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy, then the node controller evicts at
the normal rate of `--node-eviction-rate`. The corner case is when all zones are
completely unhealthy (none of the nodes in the cluster are healthy). In such a
case, the node controller assumes that there is some problem with connectivity
between the control plane and the nodes, and doesn't perform any evictions.
(If there has been an outage and some nodes reappear, the node controller does
evict pods from the remaining nodes that are unhealthy or unreachable).

The node controller is also responsible for evicting pods running on nodes with
`NoExecute` taints, unless those pods tolerate that taint.
The node controller also adds {{< glossary_tooltip text="taints" term_id="taint" >}}
corresponding to node problems like node unreachable or not ready. This means
that the scheduler won't place Pods onto unhealthy nodes.

## Resource capacity tracking {#node-capacity}

Node objects track information about the Node's resource capacity: for example, the amount
of memory available and the number of CPUs.
Nodes that [self register](#self-registration-of-nodes) report their capacity during
registration. If you [manually](#manual-node-administration) add a Node, then
you need to set the node's capacity information when you add it.

The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} ensures that
there are enough resources for all the Pods on a Node. The scheduler checks that the sum
of the requests of containers on the node is no greater than the node's capacity.
That sum of requests includes all containers managed by the kubelet, but excludes any
containers started directly by the container runtime, and also excludes any
processes running outside of the kubelet's control.

{{< note >}}
If you want to explicitly reserve resources for non-Pod processes, see
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
{{< /note >}}

## Node topology

{{< feature-state feature_gate_name="TopologyManager" >}}

If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
See [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
for more information.

## Graceful node shutdown {#graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

The kubelet attempts to detect node system shutdown and terminates pods running on the node.

Kubelet ensures that pods follow the normal
[pod termination process](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
during the node shutdown. During node shutdown, the kubelet does not accept new
Pods (even if those Pods are already bound to the node).

The Graceful node shutdown feature depends on systemd since it takes advantage of
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) to
delay the node shutdown with a given duration.

Graceful node shutdown is controlled with the `GracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) which is
enabled by default in 1.21.

Note that by default, both configuration options described below,
`shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` are set to zero,
thus not activating the graceful node shutdown functionality.
To activate the feature, the two kubelet config settings should be configured appropriately and
set to non-zero values.

Once systemd detects or notifies node shutdown, the kubelet sets a `NotReady` condition on
the Node, with the `reason` set to `"node is shutting down"`. The kube-scheduler honors this condition
and does not schedule any Pods onto the affected node; other third-party schedulers are
expected to follow the same logic. This means that new Pods won't be scheduled onto that node
and therefore none will start.

The kubelet **also** rejects Pods during the `PodAdmission` phase if an ongoing
node shutdown has been detected, so that even Pods with a
{{< glossary_tooltip text="toleration" term_id="toleration" >}} for
`node.kubernetes.io/not-ready:NoSchedule` do not start there.

At the same time when kubelet is setting that condition on its Node via the API,
the kubelet also begins terminating any Pods that are running locally.

During a graceful shutdown, kubelet terminates pods in two phases:

1. Terminate regular pods running on the node.
2. Terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   running on the node.

Graceful node shutdown feature is configured with two
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) options:

* `shutdownGracePeriod`:
  * Specifies the total duration that the node should delay the shutdown by. This is the total
    grace period for pod termination for both regular and
    [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
* `shutdownGracePeriodCriticalPods`:
  * Specifies the duration used to terminate
    [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
    during a node shutdown. This value should be less than `shutdownGracePeriod`.

{{< note >}}

There are cases when Node termination was cancelled by the system (or perhaps manually
by an administrator). In either of those situations the Node will return to the `Ready` state.
However, Pods which already started the process of termination will not be restored by kubelet
and will need to be re-scheduled.

{{< /note >}}

For example, if `shutdownGracePeriod=30s`, and
`shutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by
30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved
for gracefully terminating normal pods, and the last 10 seconds would be
reserved for terminating [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

{{< note >}}
When pods were evicted during the graceful node shutdown, they are marked as shutdown.
Running `kubectl get pods` shows the status of the evicted pods as `Terminated`.
And `kubectl describe pod` indicates that the pod was evicted because of node shutdown:

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### Pod Priority based graceful node shutdown {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

To provide more flexibility during graceful node shutdown around the ordering
of pods during shutdown, graceful node shutdown honors the PriorityClass for
Pods, provided that you enabled this feature in your cluster. The feature
allows cluster administers to explicitly define the ordering of pods
during graceful node shutdown based on
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).

The [Graceful Node Shutdown](#graceful-node-shutdown) feature, as described
above, shuts down pods in two phases, non-critical pods, followed by critical
pods. If additional flexibility is needed to explicitly define the ordering of
pods during shutdown in a more granular way, pod priority based graceful
shutdown can be used.

When graceful node shutdown honors pod priorities, this makes it possible to do
graceful node shutdown in multiple phases, each phase shutting down a
particular priority class of pods. The kubelet can be configured with the exact
phases and shutdown time per phase.

Assuming the following custom pod
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
in a cluster,

|Pod priority class name|Pod priority class value|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

Within the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
the settings for `shutdownGracePeriodByPodPriority` could look like:

|Pod priority class value|Shutdown period|
|------------------------|---------------|
| 100000                 |10 seconds     |
| 10000                  |180 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |

The corresponding kubelet config YAML configuration would be:

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

The above table implies that any pod with `priority` value >= 100000 will get
just 10 seconds to stop, any pod with value >= 10000 and < 100000 will get 180
seconds to stop, any pod with value >= 1000 and < 10000 will get 120 seconds to stop.
Finally, all other pods will get 60 seconds to stop.

One doesn't have to specify values corresponding to all of the classes. For
example, you could instead use these settings:

|Pod priority class value|Shutdown period|
|------------------------|---------------|
| 100000                 |300 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |

In the above case, the pods with `custom-class-b` will go into the same bucket
as `custom-class-c` for shutdown.

If there are no pods in a particular range, then the kubelet does not wait
for pods in that priority range. Instead, the kubelet immediately skips to the
next priority class value range.

If this feature is enabled and no configuration is provided, then no ordering
action will be taken.

Using this feature requires enabling the `GracefulNodeShutdownBasedOnPodPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
and setting `ShutdownGracePeriodByPodPriority` in the
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)
to the desired configuration containing the pod priority class values and
their respective shutdown periods.

{{< note >}}
The ability to take Pod priority into account during graceful node shutdown was introduced
as an Alpha feature in Kubernetes v1.23. In Kubernetes {{< skew currentVersion >}}
the feature is Beta and is enabled by default.
{{< /note >}}

Metrics `graceful_shutdown_start_time_seconds` and `graceful_shutdown_end_time_seconds`
are emitted under the kubelet subsystem to monitor node shutdowns.

## Non-graceful node shutdown handling {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

A node shutdown action may not be detected by kubelet's Node Shutdown Manager,
either because the command does not trigger the inhibitor locks mechanism used by
kubelet or because of a user error, i.e., the ShutdownGracePeriod and
ShutdownGracePeriodCriticalPods are not configured properly. Please refer to above
section [Graceful Node Shutdown](#graceful-node-shutdown) for more details.

When a node is shutdown but not detected by kubelet's Node Shutdown Manager, the pods
that are part of a {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
will be stuck in terminating status on the shutdown node and cannot move to a new running node.
This is because kubelet on the shutdown node is not available to delete the pods so
the StatefulSet cannot create a new pod with the same name. If there are volumes used by the pods,
the VolumeAttachments will not be deleted from the original shutdown node so the volumes
used by these pods cannot be attached to a new running node. As a result, the
application running on the StatefulSet cannot function properly. If the original
shutdown node comes up, the pods will be deleted by kubelet and new pods will be
created on a different running node. If the original shutdown node does not come up,
these pods will be stuck in terminating status on the shutdown node forever.

To mitigate the above situation, a user can manually add the taint `node.kubernetes.io/out-of-service`
with either `NoExecute` or `NoSchedule` effect to a Node marking it out-of-service.
If the `NodeOutOfServiceVolumeDetach`[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled on {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}},
and a Node is marked out-of-service with this taint, the pods on the node will be forcefully deleted
if there are no matching tolerations on it and volume detach operations for the pods terminating on
the node will happen immediately. This allows the Pods on the out-of-service node to recover quickly
on a different node.

During a non-graceful shutdown, Pods are terminated in the two phases:

1. Force delete the Pods that do not have matching `out-of-service` tolerations.
2. Immediately perform detach volume operation for such pods.

{{< note >}}
- Before adding the taint `node.kubernetes.io/out-of-service`, it should be verified
  that the node is already in shutdown or power off state (not in the middle of restarting).
- The user is required to manually remove the out-of-service taint after the pods are
  moved to a new node and the user has checked that the shutdown node has been
  recovered since the user was the one who originally added the taint.
{{< /note >}}

## Swap memory management {#swap-memory}

{{< feature-state feature_gate_name="NodeSwap" >}}

To enable swap on a node, the `NodeSwap` feature gate must be enabled on
the kubelet, and the `--fail-swap-on` command line flag or `failSwapOn`
[configuration setting](/docs/reference/config-api/kubelet-config.v1beta1/)
must be set to false.

{{< warning >}}
When the memory swap feature is turned on, Kubernetes data such as the content
of Secret objects that were written to tmpfs now could be swapped to disk.
{{< /warning >}}

A user can also optionally configure `memorySwap.swapBehavior` in order to
specify how a node will use swap memory. For example,

```yaml
memorySwap:
  swapBehavior: UnlimitedSwap
```

- `UnlimitedSwap` (default): Kubernetes workloads can use as much swap memory as they
  request, up to the system limit.
- `LimitedSwap`: The utilization of swap memory by Kubernetes workloads is subject to limitations.
  Only Pods of Burstable QoS are permitted to employ swap.

If configuration for `memorySwap` is not specified and the feature gate is
enabled, by default the kubelet will apply the same behaviour as the
`UnlimitedSwap` setting.

With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e.
`BestEffort`/`Guaranteed` Qos Pods) are prohibited from utilizing swap memory.
To maintain the aforementioned security and node health guarantees, these Pods
are not permitted to use swap memory when `LimitedSwap` is in effect. 

Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:

* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods
  (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.

Swap limitation is configured as:
`(containerMemoryRequest / nodeTotalMemory) * totalPodsSwapAvailable`.

It is important to note that, for containers within Burstable QoS Pods, it is possible to
opt-out of swap usage by specifying memory requests that are equal to memory limits.
Containers configured in this manner will not have access to swap memory.

Swap is supported only with **cgroup v2**, cgroup v1 is not supported.

For more information, and to assist with testing and provide feedback, please
see the blog-post about [Kubernetes 1.28: NodeSwap graduates to Beta1](/blog/2023/08/24/swap-linux-beta/),
[KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).

## {{% heading "whatsnext" %}}

Learn more about the following:

* [Components](/docs/concepts/overview/components/#node-components) that make up a node.
* [API definition for Node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* [Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  section of the architecture design document.
* [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/).
* [Resource Management for Windows nodes](/docs/concepts/configuration/windows-resource-management/).
