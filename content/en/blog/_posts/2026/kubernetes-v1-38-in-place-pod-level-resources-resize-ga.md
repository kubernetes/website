---
layout: blog
title: "Kubernetes v1.38: Resize Pod-Level Resources In-Place Without Recreating Pods"
draft: true
slug: kubernetes-v1-38-in-place-pod-level-resources-resize-ga
author: >
  Narang Dixita Sohanlal (Google)
---

On behalf of SIG Node and the Kubernetes community, I am excited to announce
that **In-Place Pod-Level Resources Vertical Scaling**
([KEP-5419](https://kep.k8s.io/5419)) has graduated to **General Availability
(GA)** in Kubernetes v1.38.

Following its Alpha debut in v1.35 and
[Beta graduation in v1.36](/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/),
the `InPlacePodLevelResourcesVerticalScaling` feature gate is now stable and
locked on by default—graduating alongside
[Pod-Level Resources](https://kep.k8s.io/2837) (`PodLevelResources`) in the
same release. You can now scale a running Pod's `spec.resources` CPU and memory
requests and limits up or down on Linux nodes without recreating the Pod and
without enabling any feature gates.

## Why resize at the Pod level?

Pod-level resources (`spec.resources`) lets you declare a single CPU and memory
envelope for an entire Pod—whether it runs one container or several containers
sharing a pool—rather than micromanaging every container's limits. Without
in-place resize, however, adjusting that Pod-level allocation meant deleting and
recreating the Pod—dropping active connections, resetting caches, and disrupting
long-running jobs.

With in-place Pod-level resize now GA, you can adjust `spec.resources` while
the Pod keeps running:

* **Absorb traffic spikes without disruption:** Expand a Pod's CPU or memory
  envelope on the fly when demand climbs, giving both the main application and
  any sidecar containers immediate headroom without restarting the Pod.
* **Reclaim excess capacity after bursts:** Start a Pod with generous
  Pod-level resources for initialization or batch surges, then scale
  `spec.resources` back down once steady-state usage settles.
* **Adopt Pod-level resources on running Pods:** You can even add
  `spec.resources` (CPU and memory) to a running container-only Pod via the
  `/resize` subresource, as long as the Pod's QoS class stays the same and the
  existing container requests and limits fit within the new Pod-level values.

## Resizing a Pod in action

Resizing Pod-level resources uses the same `/resize` subresource as
container-level in-place resize.

Consider a running Pod that defines Pod-level requests of `1` CPU and `1Gi` of
memory, with Pod-level limits of `2` CPUs and `2Gi` of memory. The `app`
container configures `restartPolicy: NotRequired` for CPU, while `sidecar` sets
`RestartContainer` for CPU and defines no container-level limits of its own:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-service
spec:
  resources:
    requests:
      cpu: "1"
      memory: "1Gi"
    limits:
      cpu: "2"
      memory: "2Gi"
  containers:
  - name: app
    image: nginx:1.27
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
  - name: sidecar
    image: busybox:1.36
    command: ["sh", "-c", "sleep infinity"]
    resizePolicy:
    - resourceName: cpu
      restartPolicy: RestartContainer
```

To double the Pod's CPU allocation on the fly, patch `spec.resources` through
the `resize` subresource:

```shell
kubectl patch pod web-service --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"2"},"limits":{"cpu":"4"}}}}'
```

Once the kubelet admits and applies the resize, inspecting the Pod shows both
the kubelet-allocated requests (`status.allocatedResources`) and the applied
Pod-level resources (`status.resources`):

```yaml
status:
  allocatedResources:
    cpu: "2"
    memory: 1Gi
  resources:
    requests:
      cpu: "2"
      memory: 1Gi
    limits:
      cpu: "4"
      memory: 2Gi
  observedGeneration: 2
```

Notice how container `resizePolicy` interacts with Pod-level limits here:

* There is no Pod-level `resizePolicy`—updating the Pod cgroup itself never
  forces a Pod-wide restart.
* Because `app` has `restartPolicy: NotRequired` for CPU, its effective CPU
  ceiling expands in-place with zero restarts.
* Because `sidecar` omitted an explicit container CPU limit, it inherits the
  Pod-level CPU limit as its effective limit. Changing
  `spec.resources.limits.cpu` from `2` to `4` changes `sidecar`'s effective
  limit, so the kubelet honors `sidecar`'s `RestartContainer` policy and
  restarts only `sidecar`. (If `sidecar` had defined its own explicit CPU limit
  that did not change, it would not be restarted.)

## Safe sequencing and status tracking

When a resize touches both Pod-level and container-level cgroups, the kubelet
expands the Pod cgroup before containers when scaling up, and shrinks
containers before tightening the Pod cgroup when scaling down—so a Pod never
transiently overshoots its limits.

Resize progress follows the same Pod conditions as container-level resize
(`PodResizePending` with reason `Deferred` or `Infeasible`, and
`PodResizeInProgress`), and you can compare `metadata.generation` against
`status.observedGeneration` (and each condition's `observedGeneration`) to
confirm which resize revision the kubelet has processed.

## What's ready in v1.38 GA

Between Beta in v1.36 and GA in v1.38, the feature reached full production
readiness across the control plane, kubelet, and container runtimes:

* **No feature gates required:** In v1.36 Beta, using this feature depended on
  four feature gates (`InPlacePodLevelResourcesVerticalScaling`,
  `PodLevelResources`, `InPlacePodVerticalScaling`, and `NodeDeclaredFeatures`).
  All four have now graduated to Stable—`InPlacePodVerticalScaling` is
  permanently enabled (its gate was removed in v1.38), `NodeDeclaredFeatures`
  locked in v1.37, and both `PodLevelResources` and
  `InPlacePodLevelResourcesVerticalScaling` are locked on by default in v1.38.
* **Container runtime support:** Both `containerd` and `CRI-O` implement the
  CRI `UpdatePodSandboxResources` API so the kubelet can keep the runtime (and
  plugins such as NRI) in sync with Pod-level resource changes during a resize.
* **Pod-level resize observability for operators:** Kubelet now exposes
  `kubelet_pod_requested_resizes_total` to count Pod-level CPU and memory
  resize requests separately from container-level requests
  (`kubelet_container_requested_resizes_total`). Existing kubelet resize
  metrics—`kubelet_pod_infeasible_resizes_total` and
  `kubelet_pod_resize_duration_milliseconds`—now carry `container_resources`
  and `pod_resources` labels so operators can distinguish Pod-level,
  container-level, and combined resizes in dashboards and alerts.
* **Hardened actuation and status reporting:** Pod cgroup state is reliably
  reconciled across kubelet restarts, and Pod status and resize validation
  accurately account for `PodOverhead`, init container limits, and Dynamic
  Resource Allocation (DRA).

## Current boundaries

Before resizing Pod-level resources in production, keep a few boundaries in
mind:

* **Linux-only (and `kubectl` v1.32+):** Supported on Linux nodes only
  (Windows Pods do not support Pod-level resources or in-place resize). Using
  `kubectl --subresource resize` requires `kubectl` v1.32 or newer.
* **Mutable resources and QoS:** Only `cpu` and `memory` can be resized in
  place. A resize cannot change the Pod's QoS class (`Guaranteed`, `Burstable`,
  or `BestEffort`), and once `spec.resources` (or an individual Pod-level
  request or limit) is set, it cannot be removed.
* **Nodes with swap (`LimitedSwap`):** Under `LimitedSwap`, a swap-eligible
  Pod's cgroup swap limit is configured at Pod creation rather than resized in
  place. Resizes that change Pod swap eligibility, change effective Pod memory
  requests for a swap-eligible Pod, or add Pod-level resources to a running
  swap-enabled container-only Pod are rejected as `Infeasible`—even if
  containers set `RestartContainer` for memory. (CPU-only resizes, memory
  limit changes that preserve swap eligibility, and resizes on
  non-swap-eligible Pods remain allowed.)

## What's next?

With Pod-level CPU and memory resize now GA, the next step is expanding
in-place Pod-level resize beyond compute resources—starting with support for
`ephemeral-storage`—alongside Vertical Pod Autoscaler (VPA) integration for
Pod-level recommendations and in-place actuation.

## Getting started and learning more

In-place Pod-level resize is enabled by default in Kubernetes v1.38 on Linux
nodes. Explore the documentation to try it out:

* [Resize CPU and Memory Resources assigned to Pods](/docs/tasks/configure-pod-container/resize-pod-resources/)
* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
* [Pod Lifecycle: Resizing Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize)
* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [KEP-5419: In-Place Pod-Level Resources Vertical Scaling](https://kep.k8s.io/5419)

## Acknowledgments

Thank you to everyone across SIG Node, SIG Scheduling, SIG API Machinery, and
the `containerd` and `CRI-O` communities who reviewed designs, implemented
runtime support, built tests, and shared Beta feedback to help bring in-place
Pod-level resize to GA.

Have feedback or want to get involved? Join us in
[#sig-node](https://kubernetes.slack.com/messages/sig-node) on Kubernetes Slack
or on the
[SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node).
