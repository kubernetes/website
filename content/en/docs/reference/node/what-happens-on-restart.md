---
content_type: "reference"
title: What Happens After A Node Restart
weight: 90
---

System components on a node sometimes restart, either because of an upgrade, a
crash, or an explicit operator action. This page describes what happens to Pods
and to the node when the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}},
the {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}},
or the node as a whole restarts.

In a healthy cluster these restarts are usually safe and do not break running
workloads. The sections below describe the effects to be aware of, which become
more pronounced on large or heavily loaded nodes. The most disruptive case is a
[node reboot](#impact-of-a-node-reboot), which encompasses both a container
runtime restart and a kubelet restart, but with more consequences because every
container on the node stops first.

## Impact of a kubelet restart

If only the kubelet restarts, the containers that are already running **continue to
run**. The kubelet re-establishes its view of the Node, and reconciles the running
containers against the desired state. During this period of time, the following happens:

* The kubelet re-initializes and re-synchronizes its caches, which produces a
  burst of requests to the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  On large nodes with many Pods this burst can be significant.

* The node is temporarily reported as `NotReady` until the kubelet finishes
  initializing. While the node is `NotReady`, the
  {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}} does not
  place new Pods on it.

* [Node heartbeats](/docs/concepts/architecture/nodes/#node-heartbeats) pause
  while the kubelet is down and resume once it has restarted and finished
  initializing, when the kubelet renews its `Lease` object and posts node status
  again.

* The kubelet preserves the readiness of running containers across a restart.
  Each Pod's readiness drives
  {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlices" >}},
  Endpoints, and
  downstream configuration (such as Gateways or Ingresses); this means that resetting
  container readiness on every restart would place a large
  load on the API server and on components that watch endpoint state, and could
  briefly remove healthy Pods from Service load balancing. This behavior is
  described in
  [KEP-4781: Fix inconsistent container ready state after kubelet restart](https://www.kubernetes.dev/resources/keps/4781/).
  Resetting container readiness to `false` on every restart was the default
  behavior for a long time. The `ChangeContainerStatusOnKubeletRestart`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  lets you revert to that behavior, but it is a deprecated legacy escape hatch
  that is slated for removal, so you should not rely on it. For more detail, see
  [Pod behavior during kubelet restarts](/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts).

* During the initial kubelet startup,
  {{< glossary_tooltip term_id="garbage-collection" text="Garbage collection" >}}
  of unused images and containers, and Pod
  [evictions](/docs/concepts/scheduling-eviction/node-pressure-eviction/) driven
  by node-pressure, are paused. This pause continues for a short
  grace period after the kubelet has completed its main startup routines.
  This delay can slow the node's reaction to memory or disk pressure.

* Ongoing image pulls are cancelled. Depending on the container runtime, a
  cancelled pull may have to start over from the beginning when it is retried.

* Pod admission runs again for the Pods on the node as the kubelet replays them
  through its admission checks. If the node's
  {{< glossary_tooltip term_id="label" text="labels" >}} or
  {{< glossary_tooltip term_id="taint" text="taints" >}} have changed while
  the kubelet was down, a Pod can fail admission and be rejected even though it
  was already running. This is an existing behavior, and whether it should be
  considered a bug is still debated; see
  [kubernetes/kubernetes#123859](https://github.com/kubernetes/kubernetes/issues/123859)
  for the discussion and details.

Overall, in a healthy cluster a kubelet restart does not break running
workloads. On large clusters with overcommitted nodes, however, the
re-initialization load and the paused garbage collection and eviction can
contribute to system instability.

Kubernetes does not define the behavior of your
container runtime if you restart it. Depending on the container runtime
you use, a restart may trigger a stop or restart for
all local containers.
However, most container runtimes used with Kubernetes
use a configuration that allows you to restart the
runtime and leave containers executing.

## Impact of a container runtime restart

When the container runtime (such as
{{< glossary_tooltip term_id="containerd" text="containerd" >}} or CRI-O)
restarts, the kubelet loses its connection to the runtime until it comes back.
During this window:

* `exec` [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
  fail for the duration of the restart, because the kubelet cannot run commands
  inside containers. With a short timeout and failure threshold, a failing
  liveness probe can cause a container to be restarted, and a failing readiness
  probe can cause the Pod to flap out of the `Ready` state.

* The node is reported as `NotReady` by the kubelet, which blocks scheduling of
  new Pods onto the node.

* Container operations such as restarts, initialization, and status updates are
  delayed until the runtime is available again.

* If an
  {{< glossary_tooltip term_id="init-container" text="init container" >}} was executing
  when the runtime restarted, its execution state can be lost, in which case the
  init container runs again.

* In rare cases, interrupting an operation at a precise moment can leave state
  inconsistent:

  * An interrupted image pull may leave inconsistent image layers, which can
    render the image unusable until it is pulled again.

  * An interrupted sandbox creation, if it is terminated in the middle of a CNI
    or NRI call, may leave the sandbox in an inconsistent state, with CNI only
    partially initialized and the possibility of a resource leak.

Interrupting an operation at a precise moment is a low-probability situation, so
restarting a container runtime is generally a safe operation. On a heavily loaded
node, where every operation is slower, the window for interrupting a critical
operation is larger and the probability of hitting one of these edge cases
increases.

## Impact of a node reboot

A node reboot is the most disruptive of these events, because every container on
the node stops. A reboot encompasses both a container runtime restart and a
kubelet restart, but with more consequences: where a standalone kubelet or
runtime restart leaves the already-running containers in place, a reboot stops
every container first. After the node boots, the kubelet and container runtime
start again with no containers actually running.

Before a planned reboot you can reduce the impact by cordoning the node, so the
scheduler stops placing new Pods on it, and then
{{< glossary_tooltip term_id="drain" text="draining" >}} it to evict the existing
Pods gracefully. When
[graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)
is enabled, the kubelet also attempts to stop running Pods cleanly when it
detects that the node is shutting down.

When the node comes back:

* The reboot stops all containers, and the kubelet recreates them when the node
  comes back. If the node stays down longer than the configured
  toleration period described below, only Pods managed by a controller
  (such as a
  {{< glossary_tooltip term_id="deployment" text="Deployment" >}},
  {{< glossary_tooltip term_id="statefulset" text="StatefulSet" >}}, or
  {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}})
  get a replacement Pod. The replacement Pod might schedule onto a different
  node. Standalone Pods (without another object or controller managing them) are
  **not** recreated after deletion.

* The node renews the lease and reconcile it's status. It is reported as `NotReady` until the kubelet,
  container runtime, and network are ready.
  While the node is `NotReady`, the node may be
  [tainted](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  with `node.kubernetes.io/not-ready`, and after the configured toleration
  period the control plane can evict Pods that do not tolerate it.

* The kubelet re-runs admission for the Pods assigned to the node, so the label
  and taint considerations described under
  [kubelet restart](#impact-of-a-kubelet-restart) apply here as well.

* For Pods that request devices, the kubelet calls the relevant
  [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  again to confirm the device allocations for the Pods that are being restored on
  the node. The device plugin must re-register with the kubelet after the reboot
  so that these allocations can be reconciled.

* Local storage tied to the lifetime of a container or Pod can be lost. A
  container's writable layer is discarded when the container is recreated, so
  data written there does not survive the reboot. An
  [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) volume lasts as long as
  the Pod stays on the node: a memory-backed `emptyDir` (`medium: Memory`) is
  always lost on reboot because it is held in RAM, while a disk-backed `emptyDir`
  survives a reboot as long as the Pod is not evicted or deleted, and is removed
  only when the Pod leaves the node.

For workloads that must tolerate node reboots, run Pods through a controller, use
[persistent volumes](/docs/concepts/storage/persistent-volumes/) for data that
must survive, and configure
[disruption budgets](/docs/concepts/workloads/pods/disruptions/) and probes so
that traffic is only sent to Pods once they are ready.

## {{% heading "whatsnext" %}}

* Learn about the kubelet's [sync loop](/docs/reference/node/kubelet-sync-loop/).
* Read about [Pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
* Read about [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn how to [safely drain a node](/docs/tasks/administer-cluster/safely-drain-node/).
