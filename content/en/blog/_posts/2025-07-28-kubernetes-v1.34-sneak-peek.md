---
layout: blog
title: 'Kubernetes v1.34 Sneak Peek'
date: 2025-07-28
slug: kubernetes-v1-34-sneak-peek
author: >
  Agustina Barbetta,
  Alejandro Josue Leon Bellido,
  Graziano Casto,
  Melony Qin,
  Dipesh Rawat
---

Kubernetes v1.34 is coming at the end of August 2025. This release will not include any removal or deprecation, but it is packed with an impressive number of enhancements. Here are some of the features we are most excited about in this cycle!  
Please note that this information reflects the current state of v1.34 development and may change before release.

## Featured enhancements of Kubernetes v1.34

The following list of enhancements is likely to be included in the v1.34 release. This is not a commitment and the release content is subject to change.

### The core of DRA targets stable

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) provides a flexible way to categorize, request, and use devices like GPUs or custom hardware in your Kubernetes cluster.  
Structured parameters ([KEP-4381](https://kep.k8s.io/4381)) is a Kubernetes enhancement introduced in v1.30 that provides the core framework for DRA, and is targeting graduation to stable in v1.34. Taking inspiration from dynamic volume provisioning, it introduces ResourceClaim, DeviceClass, ResourceClaimTemplate, and ResourceSlice API types under resource.k8s.io, while extending PodSpec with a `resourceClaims` field.  
With DRA, device drivers and cluster admins define device classes that are available to request in a cluster. Workloads can claim devices from a device class. Kubernetes allocates matching devices to specific claims and places the corresponding Pods on nodes that can access the allocated devices. This framework provides flexible device filtering using CEL, centralized device categorization, and simplified Pod requests, among other benefits

### ServiceAccount tokens for image pull authentication

The existing [ServiceAccount](/docs/concepts/security/service-accounts/) token integration for `kubelet` credential providers is likely to reach to beta in Kubernetes v1.34, and is likely to be enabled by default. You'll then be able to have the kubelet use these tokens when pulling container images from registries that require authentication.

That support already exists as alpha, and is tracked as part of [KEP-4412](https://kep.k8s.io/4412).

The existing alpha integration allows the `kubelet` to use short-lived, automatically rotated ServiceAccount tokens (that follow OIDC-compliant semantics) to authenticate to a container registry image pulls. Each token is scoped to one associated Pod; the overall mechanism replaces the need for long-lived image pull Secrets.

Adopting this new approach reduces security risks, supports workload-level identity, and helps to cut operational overhead. It brings image pull authentication closer to modern, identity-aware good practice.

### Pod replacement policy for Deployments

After a change to a [Deployment](/docs/concepts/workloads/controllers/deployment/), terminating pods may stay up for a considerable amount of time and may consume additional resources. As part of [KEP-3973](https://kep.k8s.io/3973), the `.spec.podReplacementPolicy` field is introduced in Deployments.

Two policies are available:

* `TerminationStarted`: Creates new pods as soon as old ones start terminating, resulting in faster rollouts and temporary higher resource consumption.  
* `TerminationComplete`: Waits until old pods fully terminate before creating new ones, resulting in slower rollouts, and a more controlled resource consumption.

This feature provides greater control, and makes deployment behavior more predictable, especially when working in clusters with tight resource constraints or with workloads with long termination periods. 

It’s introduced in alpha behind the `DeploymentPodReplacementPolicy` and `DeploymentReplicaSetTerminatingReplicas` feature gates in the API server and the kube-controller-manager.

### `kubelet` observability gets a major boost with production-ready tracing

To address the longstanding challenge of debugging node-level issues by correlating disconnected logs, the Kubelet OpenTelemetry Tracing enhancement ([KEP-2831](https://kep.k8s.io/2831)) provides deep, contextual insights into the `kubelet`. It instruments the `kubelet`'s critical control loops and interfaces, most notably the gRPC calls made via the Container Runtime Interface (CRI). By generating and exporting distributed trace data using the vendor-agnostic OpenTelemetry standard, it fundamentally transforms node-level diagnostics from parsing disparate log files to analyzing a single, cohesive trace. This allows operators to visualize the entire lifecycle of critical operations like Pod startup, precisely pinpointing sources of latency and errors. Its most powerful aspect is the propagation of trace context; the `kubelet` passes a trace ID with its requests to the container runtime, enabling runtimes like containerd or CRI-O to link their own spans.  
This effort is complemented by a parallel enhancement, [KEP-647](https://kep.k8s.io/647), which brings the same tracing capabilities to the Kubernetes API server. Together, these enhancements provide a more unified, end-to-end view of events, simplifying the process of pinpointing latency and errors from the control plane down to the node. These features have matured through the official Kubernetes release process. [KEP-2831](https://kep.k8s.io/2831) was introduced as an alpha feature in v1.25, while [KEP-647](https://kep.k8s.io/647) debuted as alpha in v1.22. Both enhancements were promoted to beta together in the v1.27 release. Looking forward, Kubelet Tracing ([KEP-2831](https://kep.k8s.io/2831)) is now targeting graduation to a stable in the upcoming v1.34 release.

### `PreferSameZone` and `PreferSameNode` traffic distribution for Services

The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints.  
[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. `PreferSameZone` is equivalent to the current `PreferClose`. `PreferSameNode` prioritizes sending traffic to endpoints on the same node as the client.  
This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. It is targeting graduation to beta in v1.34 with its feature gate enabled by default.

### `kubectl` supports KYAML as an output format

[KEP-5295](https://kep.k8s.io/5295) introduces KYAML, a safer and less ambiguous YAML subset and encoding, designed specifically for Kubernetes. KYAML addresses the shortcomings of both YAML and JSON. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion. Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys.  
KYAML addresses the problems by:

* Always double-quoting value strings   
* Leaving keys unquoted unless they are potentially ambiguous  
* Always using {} for structs and maps  
* Always using [] for lists

This might sound a lot like JSON, because it is! But unlike JSON, KYAML:

* Supports comments  
* Allows trailing commas in lists and maps for improved usability.  
* Does not require quoted keys.

In Kubernetes v1.34, KYAML will be introduced as a new output format for `kubectl` (as in `kubectl get -o kyaml ...`). KYAML is and will remain a strict subset of YAML, ensuring that any compliant YAML parser can parse KYAML documents.

### Fine-grained autoscaling control with HPA configurable tolerance

[KEP-4951](https://kep.k8s.io/4951) introduces a new feature that allows users to configure autoscaling tolerance on a per-HPA basis, overriding the default cluster-wide 10% tolerance setting that often proves too coarse-grained for diverse workloads. The enhancement adds an optional `tolerance` field to the HPA's `spec.behavior.scaleUp` and `spec.behavior.scaleDown` sections, enabling different tolerance values for scale-up and scale-down operations, which is particularly valuable since scale-up responsiveness is typically more critical than scale-down speed for handling traffic surges.   
Released as alpha in Kubernetes v1.33 behind the `HPAConfigurableTolerance` feature gate, this feature is graduating to beta in v1.34. This enhancement addresses scaling challenges where large deployments might require hundreds of pods for a 10% change, enabling workload-specific optimization for both responsive and conservative scaling behaviors.

## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md) as part of the CHANGELOG for that release.

Kubernetes v1.34 release is planned for **Wednesday 27th August 2025**. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:
* [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
* [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

## Get involved
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)