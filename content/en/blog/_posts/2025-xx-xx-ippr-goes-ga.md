---
layout: blog
title: "Kubernetes 1.35: In-Place Pod Resize Graduates to Stable"
slug: in-place-pod-resize-ga
draft: true
date: XXXX-XX-XX
author: >
  Natasha Sarkar (Google)
---

This release marks a major step: more than 6 years after its initial conception,
the **In-Place Pod Resize** feature (also known as In-Place Pod Vertical Scaling), first introduced as 
alpha in Kubernetes v1.27, and graduated to beta in Kubernetes v1.33, is now **stable (GA)** in Kubernetes
1.35!

This graduation is a major milestone for improving resource efficiency and flexibility for workloads 
running on Kubernetes.

## What is in-place Pod Resize?

In the past, the CPU and memory resources allocated to a container in a Pod were immutable. This meant changing
them required deleting and recreating the entire Pod. For stateful services, batch jobs, or latency-sensitive
workloads, this was an incredibly disruptive operation.

In-Place Pod Resize makes CPU and memory requests and limits mutable, allowing you to adjust these resources
within a running Pod, often without requiring a container restart.

**Key Concept:**

* **Desired Resources:** A container's `spec.containers[*].resources` field now represents the desired 
resources. For CPU and memory, these fields are now mutable.
* **Actual Resources:** The `status.containerStatuses[*].resources` field reflects the resources currently
configured for a running container.
* **Triggering a Resize:** You can request a resize by updating the desired `requests`
and `limits` in the Pod's specification by utilizing the new `resize` subresource.

## How can I start using in-place Pod Resize?

Detailed usage instructions and examples are provided in the official documentation:
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

## How does this help me?

In-place Pod Resize is a foundational building block that unlocks seamless, vertical autoscaling and
improvements to workload efficiency.

* **Resources adjusted without disruption** Workloads sensitive to latency or restarts can have their resources 
modified in-place without downtime or loss of state.
* **More powerful autoscaling** Autoscalers are now empowered to adjust resources and with less
impact. For example, Vertical Pod Autoscaler (VPA)'s `InPlaceOrRecreate` update mode, which leverages this
feature, has graduated to beta. This allows resources to be adjusted automatically and seamlessly based on
usage with minimal disruption.
  * See [AEP-4016](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/enhancements/4016-in-place-updates-support) for more details.
* **Address transient resource needs** Workloads that temporarily need more resources can be adjusted quickly. This enables features like the CPU Startup Boost ([AEP-7862](https://github.com/kubernetes/autoscaler/pull/7863)) where applications can request more CPU during startup and then automatically scale back down.

Here are a few examples of some use cases:

* A game server that needs to adjust its size with shifting player count.
* A pre-warmed worker that can be shrunk while unused but inflated with the first request.
* Dynamically scale with load for efficient bin-packing.
* Increased resources for JIT compilation on startup.

## Changes between beta (1.33) and stable (1.35)

Since the initial beta in v1.33, development effort has primarily been around stabilizing the feature and
improving its usability based on community feedback. Here are the primary changes for the stable release:

* **Memory limit decrease** Decreasing memory limits was previously prohibited. This restriction has been
lifted, and memory limit decreases are now permitted. The Kubelet attempts to prevent OOM-kills by allowing the
resize only if the current memory usage is below the new desired limit. However, this check is best-effort and
not guaranteed.
* **Prioritized resizes** If a node doesn't have enough room to accept all resize requests, _Deferred_ resizes 
are reattempted based on the following priority:
  * PriorityClass
  * QoS class
  * Duration _Deferred_, with older requests prioritized first.
* **Pod Level Resources (Alpha)** Support for in-place Pod Resize with Pod Level Resources has been introduced 
behind its own feature gate, which is alpha in v1.35.
* **Increased observability**: There are now new Kubelet metrics and Pod events specifically associated with
In-Place Pod Resize to help users track and debug resource changes.

## What's next?

The graduation of In-Place Pod Resize to stable opens the door for powerful integrations across the Kubernetes
ecosystem. There are several areas for futher improvement that are currently planned.

### Integration with autoscalers and other projects

There are planned integrations with several autoscalers and other projects to improve workload efficiency at a larger scale. Some projects under discussion:

- VPA CPU startup boost ([AEP-7862](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/enhancements/7862-cpu-startup-boost)): Allows applications to request more CPU at startup and scale back down after a specific period of time.
- VPA Support for in-place updates ([AEP-4016](https://github.com/kubernetes/autoscaler/tree/455d29039bf6b1eb9f784f498f28769a8698bc21/vertical-pod-autoscaler/enhancements/4016-in-place-updates-support)): VPA support for `InPlaceOrRecreate` has recently graduated to beta, with the eventual goal being to graduate
the feature to stable. Support for `InPlace` mode is still being worked on; see [this pull request](https://github.com/kubernetes/autoscaler/pull/8818).
- Ray autoscaler: Plans to leverage In-Place Pod Resize to improve workload efficiency. See [this Google Cloud blog post](https://cloud.google.com/blog/products/containers-kubernetes/ray-on-gke-new-features-for-ai-scheduling-and-scaling) for more details.
- Agent-sandbox "Soft-Pause": Investigating leveraging in-place Pod Resize for better improved latency. See the [Github issue](https://github.com/kubernetes-sigs/agent-sandbox/issues/103) for more details.
- Runtime support: Java and Python runtimes do not support resizing memory without restart. There is an open
conversation with the Java developers, see [the bug](https://bugs.openjdk.org/browse/JDK-8359211).

If you have a project that could benefit from integration with in-place pod resize, please reach out using
the channels listed in the feedback section!

### Feature expansion

Today, In-Place Pod Resize is prohibited when used in combination with: swap, the static CPU Manager, and the
static Memory Manager. Additionally, resources other than CPU and memory are still immutable. Expanding the set 
of supported features and resources is under consideration as more feedback about community needs comes in.

There are also plans to support workload preemption; if there is not enough room on the node for the resize of 
a high priority pod, the goal is to enable policies to automatically evict a lower-priority pod or upsize 
the node.

### Improved stability

* **Resolve kubelet-scheduler race conditions** There are known race conditions between the kubelet and
scheduler with regards to in-place pod resize. Work is underway to resolve these issues over the next few releases. See the [issue](https://github.com/kubernetes/kubernetes/issues/126891) for more details.

* **Safer memory limit decrease** The Kubelet's best-effort check for OOM-kill prevention can be made even 
safer by moving the memory usage check into the container runtime itself. See the [issue](https://github.com/kubernetes/kubernetes/issues/135670) for more details. 

## Providing feedback

Looking to further build on this foundational feature, please share your feedback on how to improve and 
extend this feature. You can share your feedback through GitHub issues, mailing lists, or Slack channels 
related to the Kubernetes [#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) and [#sig-autoscaling](https://kubernetes.slack.com/archives/C09R1LV8S) communities.

Thank you to everyone who contributed to making this long-awaited feature a reality!