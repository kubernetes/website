---
layout: blog
title: "Kubernetes v1.38: Pod-Level Resources Brings Simpler Management and Flexible Sharing to Multi-Container Pods"
draft: true
slug: kubernetes-v1-38-pod-level-resources-ga
author: >
  Narang Dixita Sohanlal (Google)
---

On behalf of SIG Node and the Kubernetes community, I am excited to share that
**Pod-Level Resource Specifications** ([KEP-2837](https://kep.k8s.io/2837)) has
graduated to **General Availability (GA)** in Kubernetes v1.38.

First introduced as Alpha in v1.32 and promoted to Beta in
[Kubernetes v1.34](/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/), the
`PodLevelResources` feature gate is now stable and locked on by default in
v1.38. On Linux nodes, you can set `cpu`, `memory`, and `hugepages-<size>`
requests and limits directly at the Pod level (`spec.resources`) with no extra
cluster configuration required—backed by Kubernetes conformance test coverage.

## Why Pod-level resources?

Before Pod-level resources, Kubernetes required you to size requests and limits
container by container. That works well for single-container Pods, but gets
painful quickly as Pods grow more complex:

* **Multi-sidecar workloads are hard to size up front.** Think of a web IDE
  running alongside multiple helper tool sidecars, or an application paired
  with a service mesh proxy and log shipper. Predicting exact per-container
  CPU and memory for every sidecar often forces teams into a bad tradeoff:
  over-provision every sidecar and waste capacity, or cap them tightly and
  suffer avoidable throttling during brief spikes.
* **Uncoordinated peaks waste cluster capacity.** In multi-stage batch or
  AI/ML processing Pods, different containers tend to peak at different times
  (for example, data loading versus transformation). Sizing each container for
  its individual peak leaves idle capacity trapped inside one container while
  another container is starved.

Pod-level resources lets you declare a single shared resource envelope for the
entire Pod in `spec.resources`, while still letting individual containers set
their own requests or limits when they need dedicated guarantees or caps.

It is also worth noting how this differs from standard `Burstable` Pods:
`Burstable` Pods let containers opportunistically use spare capacity from
anywhere on the **node**, whereas Pod-level resources lets containers share
unused capacity strictly **within the Pod's own boundary**. You can even run a
`Guaranteed` QoS Pod (by setting equal Pod-level CPU and memory requests and
limits) without having to size every sidecar container individually.

{{< figure src="pod-level-vs-container-level.svg" alt="Side-by-side comparison of container-level only resources versus Pod-level resources for a two-container Pod where app peaks at 1.0 CPU at T1 and sidecar peaks at 1.4 CPUs at T2 while combined usage stays within 2.0 CPUs. On the left, without Pod-level resources, each container must be estimated and configured separately for its peak (1.0 plus 1.4 equals 2.4 CPUs total), leaving unused CPU trapped during each phase. On the right, with Pod-level resources, you set one shared 2.0 CPU Pod specification without guessing individual container sizes, simplifying configuration and saving 0.4 CPU." caption="Without Pod-level resources, you must size each container for its own peak (1.0 + 1.4 = 2.4 CPUs total). With Pod-level resources, you configure one shared 2.0 CPU Pod pool without estimating per-container sizes—simplifying setup and avoiding over-allocation." >}}

## Using Pod-level resources in practice

Using Pod-level resources is straightforward: add `spec.resources` to your Pod
manifest. You can combine Pod-level settings with container-level requests or
limits for the containers that need them, and leave helper or sidecar
containers unset so they share the remaining capacity.

For example, consider a web IDE Pod with native sidecar tools. The Pod sets an
overall boundary of 4 CPUs and 1 GiB of memory; the main `ide` container sets
its own request and limit, while the `shell` and `build-helper` sidecars dynamically
share whatever remains inside the Pod's limit:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dev-workspace
spec:
  resources:
    requests:
      cpu: "2"
      memory: "512Mi"
    limits:
      cpu: "4"
      memory: "1Gi"
  initContainers:
  - name: shell
    image: busybox:1.36
    restartPolicy: Always
    command: ["sh", "-c", "sleep infinity"]
  - name: build-helper
    image: busybox:1.36
    restartPolicy: Always
    command: ["sh", "-c", "sleep infinity"]
  containers:
  - name: ide
    image: my-ide:v1
    resources:
      requests:
        cpu: "500m"
        memory: "256Mi"
      limits:
        cpu: "2"
        memory: "512Mi"
```

Here, Kubernetes schedules the Pod using its Pod-level requests (`2` CPUs,
`512Mi` memory) and enforces the Pod-level limits (`4` CPUs, `1Gi` memory) as
a hard ceiling across all containers combined. The `ide` container keeps its
guaranteed floor under contention, while `shell` and `build-helper` can burst
into any unused headroom without tripping rigid per-container limits.

### OOM protection for Burstable Pods

For `Guaranteed` and `BestEffort` Pods, `oom_score_adj` remains fixed at `-997`
and `1000`, respectively. For `Burstable` Pods, the kubelet computes each
container's `oom_score_adj` using both its container-level memory request and
an equal share of any unallocated Pod-level memory request:

```text
remainingPerContainer = max(podMemoryRequest - aggregateContainerMemoryRequests, 0) / containerCount
oom_score_adj = 1000 - (1000 * (containerMemoryRequest + remainingPerContainer) / nodeMemoryCapacity)
```

This ensures that containers without individual memory requests still benefit
from the Pod-level memory request rather than being targeted like `BestEffort`
workloads under node memory pressure, while regular containers with explicit
memory requests keep stronger protection.

## What's new since Beta?

Between Beta in v1.34 and GA in v1.38, the community closed the biggest Beta
gaps and integrated Pod-level resources across the Kubernetes stack:

* **In-place Pod-level resize is now GA too:** When Pod-level resources
  reached Beta in v1.34, its biggest limitation was that Pods with
  `spec.resources` could not be resized in place. In v1.38,
  **In-Place Pod-Level Resources Vertical Scaling** also graduates to GA,
  allowing you to adjust a running Pod's `spec.resources` via the `/resize`
  subresource without recreating the Pod.
* **Node swap and Memory QoS support:** On Linux nodes using cgroup v2,
  Pod-level resources now integrates with `LimitedSwap` (applying a shared
  Pod-level swap limit rather than forcing per-container memory sizing) and
  `MemoryQoS` (`memory.high` throttling at the Pod cgroup level).
* **End-to-end cluster integration:** Pod-level resources works cleanly with
  `LimitRange`, `ResourceQuota`, Horizontal Pod Autoscaler (HPA), Pod
  Overhead, init containers, and Dynamic Resource Allocation (DRA), and core
  Pod-level spec and QoS behavior is now verified by Kubernetes Linux
  conformance tests.

## What operators and tooling maintainers should know

* **No impact unless you opt in:** Upgrading to v1.38 does not change behavior
  for existing Pods that only specify container-level resources.
* **Update custom tooling that reads Pod specs:** Third-party schedulers,
  admission webhooks, or monitoring tools that previously summed
  `spec.containers[].resources` should account for `spec.resources` (Go tools
  can use `PodRequests` and `PodLimits` in
  `k8s.io/component-helpers/resource`).
* **Tracking adoption:** Kubelet exposes a temporary alpha counter,
  `kubelet_pod_level_resources_admission_total`, so cluster operators can
  observe how workloads adopt Pod-level versus container-level resource specs.
* **Platform scope:** Pod-level resources is a Linux-only feature; Windows
  Pods that specify `spec.resources` are rejected at admission.

## The growing Pod-level ecosystem

With `spec.resources` now stable for `cpu`, `memory`, and `hugepages-<size>`,
several capabilities are building directly on top of it:

* **[Pod-Level Resource Managers](/docs/concepts/resource-management/pod-level-resource-managers/)
  (Beta, opt-in):** Extends the kubelet's Topology, CPU, and Memory Managers
  so latency-sensitive containers can get exclusive NUMA-aligned resources
  while sidecars share a Pod-isolated pool (see the
  [v1.37 Beta announcement](/blog/2026/09/15/kubernetes-v1-37-pod-level-resource-managers-beta/)).
* **Per-Pod PID limits (`PerPodPIDLimit`, Alpha in v1.38):** Enforces a shared
  process ID limit across all containers in a Pod.
* **Workload-controlled swap limits (`WorkloadControlledSwap`, Alpha in
  v1.38):** Lets workloads declare explicit `limits.swap`, including at the
  Pod level.
* **Looking ahead:** The community is also working on Pod-level
  `ephemeral-storage` ([KEP-6386](https://kep.k8s.io/6386)) and Vertical Pod
  Autoscaler (VPA) support for Pod-level recommendations.

## Getting started and learning more

Pod-level resources is enabled by default in Kubernetes v1.38 on Linux nodes.
Explore the documentation to try it out or dive into the details:

* [Resource Management for Pods and Containers: Pod-level resource specification](/docs/concepts/configuration/manage-resources-containers/#pod-level-resource-specification)
* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [Resize CPU and Memory Resources assigned to Pods](/docs/tasks/configure-pod-container/resize-pod-resources/)
* [Swap memory management: LimitedSwap with Pod-level resources](/docs/concepts/cluster-administration/swap-memory-management/#limitedswap-pod-level-resources)
* [KEP-2837: Pod Level Resource Specifications](https://kep.k8s.io/2837)

## Acknowledgments

Graduating Pod-Level Resources to GA was a multi-release effort across SIG
Node, SIG Scheduling, SIG Autoscaling, SIG API Machinery, and SIG Apps. Thank
you to everyone who contributed designs, code, reviews, conformance tests, and
production feedback along the way.

Have questions or want to get involved in what's next? Join us in
[#sig-node](https://kubernetes.slack.com/messages/sig-node) on Kubernetes
Slack or on the
[SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node).
