---
layout: blog
draft: true
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

The following list highlights some of the notable enhancements likely to be included in the v1.34 release, but is not an exhaustive list of all planned changes. This is not a commitment and the release content is subject to change.

### The core of DRA targets stable

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) provides a flexible way to categorize, request, and use devices like GPUs or custom hardware in your Kubernetes cluster.  

Since the v1.30 release, DRA has been based around claiming devices using _structured parameters_ that are opaque to the core of Kubernetes.
The relevant enhancement proposal, [KEP-4381](https://kep.k8s.io/4381), took inspiration from dynamic provisioning for storage volumes.
DRA with structured parameters relies on a set of supporting API kinds: ResourceClaim, DeviceClass, ResourceClaimTemplate, and ResourceSlice API types under `resource.k8s.io`, while extending the `.spec` for Pods with a new `resourceClaims` field.
The core of DRA is targeting graduation to stable in Kubernetes v1.34.


With DRA, device drivers and cluster admins define device classes that are available for use. Workloads can claim devices from a device class within device requests. Kubernetes allocates matching devices to specific claims and places the corresponding Pods on nodes that can access the allocated devices. This framework provides flexible device filtering using CEL, centralized device categorization, and simplified Pod requests, among other benefits.

Once this feature has graduated, the `resource.k8s.io/v1` APIs will be available by default.

### ServiceAccount tokens for image pull authentication

The [ServiceAccount](/docs/concepts/security/service-accounts/) token integration for `kubelet` credential providers is likely to reach beta and be enabled by default in Kubernetes v1.34. You'll then be able to have the `kubelet` use these tokens when pulling container images from registries that require authentication.

That support already exists as alpha, and is tracked as part of [KEP-4412](https://kep.k8s.io/4412).

The existing alpha integration allows the `kubelet` to use short-lived, automatically rotated ServiceAccount tokens (that follow OIDC-compliant semantics) to authenticate to a container image registry. Each token is scoped to one associated Pod; the overall mechanism replaces the need for long-lived image pull Secrets.

Adopting this new approach reduces security risks, supports workload-level identity, and helps cut operational overhead. It brings image pull authentication closer to modern, identity-aware good practice.

### Pod replacement policy for Deployments

After a change to a [Deployment](/docs/concepts/workloads/controllers/deployment/), terminating pods may stay up for a considerable amount of time and may consume additional resources.
As part of [KEP-3973](https://kep.k8s.io/3973), the `.spec.podReplacementPolicy` field will be introduced (as alpha) for Deployments.

If your cluster has the feature enabled, you'll be able to select one of two policies:

`TerminationStarted`
: Creates new pods as soon as old ones start terminating, resulting in faster rollouts at the cost of potentially higher resource consumption.

`TerminationComplete`
: Waits until old pods fully terminate before creating new ones, resulting in slower rollouts but ensuring controlled resource consumption.

This feature makes Deployment behavior more predictable by letting you choose when new pods should be created during updates or scaling. It's beneficial when working in clusters with tight resource constraints or with workloads with long termination periods. 

It’s expected to be available as an alpha feature and can be enabled using the `DeploymentPodReplacementPolicy` and `DeploymentReplicaSetTerminatingReplicas` feature gates in the API server and kube-controller-manager.

### Production-ready tracing for `kubelet` and API Server

To address the longstanding challenge of debugging node-level issues by correlating disconnected logs, [KEP-2831](https://kep.k8s.io/2831) provides deep, contextual insights into the `kubelet`. 

This feature instruments the `kubelet`'s critical operations, particularly its gRPC calls to the Container Runtime Interface (CRI), using the vendor-agnostic OpenTelemetry standard. It allows operators to visualize the entire lifecycle of events (for example: a Pod startup) to pinpoint sources of latency and errors. Its most powerful aspect is the propagation of trace context; the `kubelet` passes a trace ID with its requests to the container runtime, enabling runtimes to link their own spans. 

This effort is complemented by a parallel enhancement, [KEP-647](https://kep.k8s.io/647), which brings the same tracing capabilities to the Kubernetes API server. Together, these enhancements provide a more unified, end-to-end view of events, simplifying the process of pinpointing latency and errors from the control plane down to the node. These features have matured through the official Kubernetes release process. [KEP-2831](https://kep.k8s.io/2831) was introduced as an alpha feature in v1.25, while [KEP-647](https://kep.k8s.io/647) debuted as alpha in v1.22. Both enhancements were promoted to beta together in the v1.27 release. Looking forward, Kubelet Tracing ([KEP-2831](https://kep.k8s.io/2831)) and API Server Tracing ([KEP-647](https://kep.k8s.io/647)) are now targeting graduation to stable in the upcoming v1.34 release.

### `PreferSameZone` and `PreferSameNode` traffic distribution for Services

The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints.  

[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. `PreferSameZone` is equivalent to the current `PreferClose`. `PreferSameNode` prioritizes sending traffic to endpoints on the same node as the client.  

This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. It is targeting graduation to beta in v1.34 with its feature gate enabled by default.

### Support for KYAML: a Kubernetes dialect of YAML

KYAML aims to be a safer and less ambiguous YAML subset, and was designed specifically
for Kubernetes. Whatever version of Kubernetes you use, you'll be able use KYAML for writing manifests
and/or Helm charts.
You can write KYAML and pass it as an input to **any** version of `kubectl`,
because all KYAML files are also valid as YAML.
With kubectl v1.34, we expect you'll also be able to request KYAML output from `kubectl` (as in `kubectl get -o kyaml …`).
Of course, you can still request JSON or YAML output if you prefer that.

KYAML addresses specific challenges with both YAML and JSON. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion (for example: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys.  

[KEP-5295](https://kep.k8s.io/5295) introduces KYAML, which tries to address the most significant problems by:

* Always double-quoting value strings

* Leaving keys unquoted unless they are potentially ambiguous

* Always using `{}` for mappings (associative arrays)

* Always using `[]` for lists

This might sound a lot like JSON, because it is! But unlike JSON, KYAML supports comments, allows trailing commas, and doesn't require quoted keys.

We're hoping to see KYAML introduced as a new output format for `kubectl` v1.34.
As with all these features, none of these changes are 100% confirmed; watch this space!

As a format, KYAML is and will remain a **strict subset of YAML**, ensuring that any compliant YAML parser can parse KYAML documents. Kubernetes does not insist you provide input that is specifically formatted as KYAML, and we have no plan to change that.

### Fine-grained autoscaling control with HPA configurable tolerance

[KEP-4951](https://kep.k8s.io/4951) introduces a new feature that allows users to configure autoscaling tolerance on a per-HPA basis, overriding the default cluster-wide 10% tolerance setting that often proves too coarse-grained for diverse workloads. The enhancement adds an optional `tolerance` field to the HPA's `spec.behavior.scaleUp` and `spec.behavior.scaleDown` sections, enabling different tolerance values for scale-up and scale-down operations, which is particularly valuable since scale-up responsiveness is typically more critical than scale-down speed for handling traffic surges.  

Released as alpha in Kubernetes v1.33 behind the `HPAConfigurableTolerance` feature gate, this feature is expected to graduate to beta in v1.34.
This improvement helps to address scaling challenges with large deployments, where for scaling in,
a 10% tolerance might mean leaving hundreds of unnecessary Pods running.
Using the new, more flexible approach would enable workload-specific optimization for both
responsive and conservative scaling behaviors.

## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md) as part of the CHANGELOG for that release.

The Kubernetes v1.34 release is planned for **Wednesday 27th August 2025**. Stay tuned for updates!

## Get involved
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)