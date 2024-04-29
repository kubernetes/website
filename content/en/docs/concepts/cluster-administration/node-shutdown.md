---
title: Node Shutdowns
content_type: concept
weight: 10
---

<!-- overview -->
In a Kubernetes cluster, a {{< glossary_tooltip text="node" term_id="node" >}}
can be shutdown in a planned graceful way or unexpectedly because of reasons such
as a power outage or something else external. A node shutdown could lead to workload
failure if the node is not drained before the shutdown. A node shutdown can be
either **graceful** or **non-graceful**.

<!-- body -->
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

### Forced storage detach on timeout {#storage-force-detach-on-timeout}

In any situation where a pod deletion has not succeeded for 6 minutes, kubernetes will
force detach volumes being unmounted if the node is unhealthy at that instant. Any
workload still running on the node that uses a force-detached volume will cause a
violation of the
[CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume),
which states that `ControllerUnpublishVolume` "**must** be called after all
`NodeUnstageVolume` and `NodeUnpublishVolume` on the volume are called and succeed".
In such circumstances, volumes on the node in question might encounter data corruption.

The forced storage detach behaviour is optional; users might opt to use the "Non-graceful
node shutdown" feature instead.

Force storage detach on timeout can be disabled by setting the `disable-force-detach-on-timeout`
config field in `kube-controller-manager`. Disabling the force detach on timeout feature means
that a volume that is hosted on a node that is unhealthy for more than 6 minutes will not have
its associated
[VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)
deleted.

After this setting has been applied, unhealthy pods still attached to a volumes must be recovered
via the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure mentioned above.

{{< note >}}
- Caution must be taken while using the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure.
- Deviation from the steps documented above can result in data corruption.
{{< /note >}}


## {{% heading "whatsnext" %}}

Learn more about the following:
* Blog: [Non-Graceful Node Shutdown](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/).
* Cluster Architecture: [Nodes](/docs/concepts/architecture/nodes/).
