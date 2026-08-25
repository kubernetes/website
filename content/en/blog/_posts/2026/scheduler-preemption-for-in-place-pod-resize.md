---
layout: blog
title: "Kubernetes v1.37: Scheduler Preemption for In-Place Pod Resize (Alpha)"
slug: scheduler-preemption-in-place-pod-resize-alpha
draft: true
author: "Natasha Sarkar (Google)"
---

In Kubernetes, resource allocation has historically been a static decision made during a Pod's initial scheduling and placement. With the graduation of the core [in-Place Pod resize](/blog/2025/12/19/kubernetes-v1-35-in-place-Pod-resize-ga/) feature to General Availability in v1.35, application developers and cluster operators gained the powerful ability to dynamically adjust CPU and memory allocations of running containers without incurring disruptive restarts or application downtime.

However, in-place resizing introduced a unique resource scheduling gap: if a running Pod requested a resource scale-up that exceeded the host node's allocatable headroom, the Kubelet was forced to mark the request as `Deferred`. The Pod would remain parked in this state indefinitely, waiting for resources on the node to naturally free up.

To bridge this scheduling gap, Kubernetes v1.37 introduces *scheduler preemption for in-place Pod resize* (Alpha), behind the `InPlacePodVerticalScalingSchedulerPreemption` feature gate.
This feature allows the Kubernetes scheduler to actively free up capacity on a fully-utilized node by preempting lower-priority workloads, enabling the pending in-place resizes of critical, higher-priority applications to succeed.

## The "deferred" resize challenge

To understand why this preemption mechanism is needed, it is helpful to look at how Kubernetes handles running Pod resizing. When a user or controller (such as the [Vertical Pod Autoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)) updates the resource requests of an active container, the Kubelet evaluates whether the underlying node has enough spare allocatable capacity to fulfill the increase.

If the node's resources are fully utilized and cannot satisfy the new limits, the Kubelet sets the container's `resizeStatus` (reported in the Pod's `status.containerStatuses[]`) to `Deferred`. Unlike an `Infeasible` resize request (which is immediately rejected because it exceeds physical machine boundaries, namespace limit ranges, or admission quotas) a `Deferred` status indicates that the request is valid but is temporarily unable to be actuated, waiting until node capacity becomes available.

Before the introduction of this preemption mechanism, a Pod's in-place resize scale-up request could become permanently blocked if the node was heavily utilized. Even when a critical application (such as an in-memory database or a real-time web server) required more memory to prevent an imminent out-of-memory (OOM) crash, and the node lacked free capacity, the resize remained `Deferred`.

In this scenario, cluster administrators had limited choices:
1. Manually evict lower-priority Pods from the node to clear resource headroom.
2. Rely on the cluster autoscaler to eventually spin up a larger node and reschedule the Pod. However, this is an operation that is highly disruptive and violates the core "no restart" value proposition of in-place scaling.
3. Rely on a custom autoscaling solution, for example a cluster autoscaler that can trigger dynamic node resizing operations itself.

Because the `kube-scheduler` was unaware of deferred resizes on running Pods, it could not leverage standard priority-based preemption to evict lower-priority workloads and make room for the higher-priority running Pod's resource growth.

## Why this matters

In production Kubernetes environments, cluster administrators strive to maximize resource utilization and efficiency. A common strategy is to bin-pack unused capacity on not-yet-full nodes with lower-priority workloads, such as batch jobs, background data processing, or best-effort tasks.

Without scheduler preemption for in-place resizing, this created a major operational dilemma. If lower-priority workloads consumed the remaining headroom on a node, higher-priority applications running on that same node would become blocked (`Deferred`) when they needed to scale up to handle sudden traffic surges or memory spikes. Operators were forced to choose between running low-utilization clusters with idle buffer capacity or risking that critical workloads could not resize when needed.

With scheduler preemption for in-place Pod resize, you can confidently bin-pack unused space across your clusters with lower-priority workloads without worrying about them degrading higher-priority Pods or blocking their scale-up requests. If a high-priority workload requires an in-place resize that exceeds available node capacity, the scheduler automatically preempts the lower-priority Pods to clear headroom. You achieve high cluster utilization and cost efficiency while preserving the responsiveness and reliability of critical services.

## Architectural mechanics: How it works

**Scheduler preemption for in-place Pod resize** integrates directly into the core scheduling cycle to coordinate resources dynamically and safely.

### Centralized scheduler tracking
The `kube-scheduler` monitors the cluster for running Pods with a `Deferred` resize status condition. Normally, Pods with `spec.nodeName` populated are considered successfully placed and bypass the active scheduling queue. Under this feature gate, the scheduler intercepts Pods carrying the `Deferred` condition, permitting them to remain in active scheduling evaluations specifically to trigger preemption. The scheduler maintains continuous tracking of these Pods until the Kubelet successfully completes the resize actuation.

### Single-node preemption boundary
Unlike placement preemption, which evaluates all nodes in a cluster to find the best scheduling fit, preemption for in-place resizing is strictly localized to the Pod's currently assigned node. The scheduler identifies eligible lower-priority "victim" Pods on the same host and initiates their graceful eviction, freeing up local capacity. Preemption is strictly scoped to the same node where the deferred Pod is running; if a node cannot accommodate the resize even after evicting all eligible lower-priority workloads, the resize remains in the `Deferred` state.

### Resource reservation safety
To prevent scheduling races and double-allocation, the scheduler treats resources requested for a resize as **already consumed**. This enables the Kubelet to actuate the resize once the preemption takes effect.

### Separation of concerns & critical admission
When a node is under resource pressure, the Kubelet includes a local mechanism known as the **critical Pod admission handler**. During initial Pod admission, if a critical system Pod arrives on a node that lacks spare capacity, this local handler can directly evict lower-priority Pods on that node to guarantee admission for the critical workload.

A significant architectural benefit of this new feature is the strict separation of concerns between the Kubelet and the scheduler. Under the `InPlacePodVerticalScalingSchedulerPreemption` feature gate, **the Kubelet's critical Pod admission handler does not perform local preemption checks or trigger local evictions for in-place resizing operations.** Instead, the Kubelet defers the request and delegates the preemption decision entirely to the scheduler. This guarantees that a single, centralized orchestrator manages all resize-related preemption logic, respecting global priorities, Pod disruption budgets (PDBs), and graceful termination policies.

### Managing competing updates & races
If a competing, higher-priority resize request is submitted for another running Pod on the same node during an active preemption cycle, the Kubelet prioritizes the higher-priority request. The scheduler is designed to observe these updates and will dynamically trigger a new round of preemption if more capacity is required to fulfill the new state.

## Node-level preemption configuration

Administrators and automated controllers (such as a cluster autoscaler) can disable preemption specifically for in-place resizes on particular nodes. This is configured using the new `spec.podPreemptionPolicy` field in the Node Spec:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: batch-workload-node
spec:
  podPreemptionPolicy:
    disableResizePreemption:
      - "cluster-autoscaler.kubernetes.io/disable-preemption"
      - "operator.example.com/policy-override"
```

An example use case for this policy is when a controller would prefer to size down other pods or dynamically adjust the node capacity itself when possible, only enabling scheduler preemption as a last resort.

## Try it out!

To utilize scheduler preemption for in-place Pod resize:
* Your cluster must be running Kubernetes **v1.37 or later** across both the control plane and all worker nodes.
* The `InPlacePodVerticalScalingSchedulerPreemption` feature gate must be enabled across all control plane components (`kube-apiserver`, `kube-scheduler`) and the `kubelet`.

### Mini-tutorial: Observe resize preemption in action

To see this feature in action locally, you can test scheduler preemption on a single-node `kind` cluster with constrained CPU headroom.

#### 1. Create a kind cluster with scheduler resize preemption enabled

Create a `kind` cluster configuration file named `kind-config.yaml` with the `InPlacePodVerticalScalingSchedulerPreemption` feature gate enabled:

```yaml
# kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  InPlacePodVerticalScalingSchedulerPreemption: true
```

Create the cluster using this configuration, passing the `--image` flag to ensure the cluster is running Kubernetes **v1.37** (or later):

```shell
kind create cluster --config kind-config.yaml --image kindest/node:v1.37.0
```

{{< note >}}
Make sure that the node image you specify corresponds to a Kubernetes **v1.37** cluster or later (such as `kindest/node:v1.37.0`). Older Kubernetes releases do not support the `InPlacePodVerticalScalingSchedulerPreemption` feature gate.
{{< /note >}}

Once your cluster is ready, inspect the node to check how many allocatable CPU cores it has:

```shell
kubectl get nodes -o custom-columns=NAME:.metadata.name,ALLOCATABLE_CPU:.status.allocatable.cpu
```

In a standard local `kind` environment, the output shows **8** allocatable CPU cores:

```shell
NAME                 ALLOCATABLE_CPU
kind-control-plane   8
```

#### 2. Create PriorityClasses and deploy Pods

Create two PriorityClasses and deploy a low-priority Pod (requesting `3` CPU) alongside a high-priority Pod (requesting `4` CPU). Together, these workloads consume `7` of the `8` available CPU cores, leaving `1` CPU of free allocatable headroom on the node.

```yaml
# preemption-demo.yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "High priority workload"
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: low-priority
value: 1000
globalDefault: false
description: "Low priority workload"
---
apiVersion: v1
kind: Pod
metadata:
  name: low-priority-pod
spec:
  priorityClassName: low-priority
  containers:
  - name: worker
    image: nginx
    resources:
      requests:
        cpu: "3"
        memory: "500Mi"
      limits:
        cpu: "3"
        memory: "500Mi"
---
apiVersion: v1
kind: Pod
metadata:
  name: high-priority-pod
spec:
  priorityClassName: high-priority
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        cpu: "4"
        memory: "1Gi"
      limits:
        cpu: "4"
        memory: "1Gi"
```

Save this manifest to `preemption-demo.yaml` and apply it:

```shell
kubectl apply -f preemption-demo.yaml
```

Wait until both Pods are running on the node:

```shell
kubectl get pods
```

Output:

```shell
NAME                READY   STATUS    RESTARTS   AGE
high-priority-pod   1/1     Running   0          9s
low-priority-pod    1/1     Running   0          9s
```

#### 3. Request an in-place scale-up

Patch the high-priority Pod to increase its CPU request from `4` to `6` (+2 CPU delta). Because only `1` CPU of headroom is free on the node, this resize request exceeds remaining allocatable capacity:

```shell
kubectl patch pod high-priority-pod --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app", "resources":{"requests":{"cpu":"6"}, "limits":{"cpu":"6"}}}]}}'
```

#### 4. Inspect the preemption event on the low-priority Pod

With `InPlacePodVerticalScalingSchedulerPreemption` enabled, the scheduler intercepts the `Deferred` resize condition on `high-priority-pod` and targets `low-priority-pod` for preemption.

To verify that the scheduler actively preempted the low-priority Pod, inspect its events:

```shell
kubectl get events --field-selector involvedObject.name=low-priority-pod
```

In the event stream (or via `kubectl describe pod low-priority-pod`), you will see a `Preempted` event emitted by the scheduler:

```shell
LAST SEEN   TYPE     REASON      OBJECT                 MESSAGE
5s          Normal   Preempted   pod/low-priority-pod   Preempted by pod 97dba925-6b5f-4e2f-99f9-d51c30016586 on node kind-control-plane
5s          Normal   Killing     pod/low-priority-pod   Stopping container worker
```

#### 5. Trace the resize event lifecycle on the high-priority Pod

Next, inspect the event history on `high-priority-pod` to observe how the resize progressed from being deferred to successfully completed:

```shell
kubectl get events --field-selector involvedObject.name=high-priority-pod
```

You will observe a sequence of events as the Kubelet coordinates with the scheduler:

```shell
LAST SEEN   TYPE      REASON            OBJECT                  MESSAGE
33s         Warning   ResizeDeferred    pod/high-priority-pod   Pod resize OutOfcpu: {"containers":[{"name":"app","resources":{"limits":{"cpu":"6","memory":"1Gi"},"requests":{"cpu":"6","memory":"1Gi"}}}],"generation":2,"error":"Node didn't have enough resource: cpu, requested: 6000, used: 3950, capacity: 8000"}
32s         Normal    ResizeStarted     pod/high-priority-pod   Pod resize started: {"containers":[{"name":"app","resources":{"limits":{"cpu":"6","memory":"1Gi"},"requests":{"cpu":"6","memory":"1Gi"}}}],"generation":2}
32s         Normal    ResizeCompleted   pod/high-priority-pod   Pod resize completed: {"containers":[{"name":"app","resources":{"limits":{"cpu":"6","memory":"1Gi"},"requests":{"cpu":"6","memory":"1Gi"}}}],"generation":2}
```

1. **`ResizeDeferred`**: The Kubelet initially marks the resize request as deferred (`Warning`) due to insufficient CPU headroom on the node (`OutOfcpu`).
2. **`ResizeStarted`**: Once the scheduler preempts `low-priority-pod` and capacity is released, the Kubelet accepts the new allocation and begins actuating the resize.
3. **`ResizeCompleted`**: The Kubelet successfully updates container cgroup limits via the container runtime without restarting the Pod.

Finally, verify that the allocated CPU on the container reflects the new request (appending `{"\n"}` to the JSONPath query ensures a trailing newline in your terminal):

```shell
kubectl get pod high-priority-pod -o jsonpath='{.status.containerStatuses[0].allocatedResources.cpu}{"\n"}'
```

Output:

```shell
6
```

This confirms that the in-place resize succeeded.

## Getting involved

This feature represents a major step forward for resource scheduling, bringing enterprise-grade density control and workload prioritization to dynamic resource scaling. We invite cluster operators, platform architects, and developers to enable the `InPlacePodVerticalScalingSchedulerPreemption` feature gate in their testing environments and share feedback.

If you want to share your experience with this feature, please get in touch with the community via [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling) or [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node) channels!
