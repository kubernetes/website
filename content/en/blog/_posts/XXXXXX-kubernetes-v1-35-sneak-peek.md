---
layout: blog
title: 'Kubernetes v1.35: Sneak peek'
date: 2025-XX-XX
slug: kubernetes-v1-35-sneak-peek
author: >
  Graziano Casto,
  Chad M. Crowell,
  Aakanksha Bhende,
  Swathi Rao,
  Arujjwal Negi
---

As the release of Kubernetes v1.35 approaches, the Kubernetes project continues to evolve. Features may be deprecated, removed, or replaced to improve the overall health of the project. This blog post outlines some planned changes for the v1.35 release, which the release team believes you should be aware of to ensure the continued smooth operation of your Kubernetes environment and to keep you up-to-date with the latest developments. The information below is based on the current status of the v1.35 release and is subject to change before the final release date.

## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

- Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
- Beta or pre-release API versions must be supported for 3 releases after the deprecation.
- Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.

Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](https://kubernetes.io/docs/reference/using-api/deprecation-guide/).

## Deprecations and removals for Kubernetes v1.35

### Remove cgroup v1 support

cgroup v2 support has been stable in Kubernetes since v1.25, providing an alternative to the original cgroup v1. While cgroup v1 provided the initial resource control mechanism, it suffered from well-known inconsistencies and limitations. cgroup v2 introduces a unified hierarchy, improved resource isolation, and is the foundation for modern features, making the legacy cgroup v1 support ready for removal. This removal will only impact cluster administrators running nodes on older Linux distributions that do not support cgroup v2; the `kubelet`  will fail to start on these nodes. Administrators must migrate their nodes to systems with cgroup v2 enabled, and more details on compatibility requirements will be available in a detailed blog post soon.

You can find more in [KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573)

### Deprecate ipvs mode in kube-proxy

This KEP proposes the deprecation of the IPVS mode in kube-proxy, which has historically provided high-performance service load balancing in Kubernetes. Over time, the maintenance cost, complexity, and limited feature parity with other proxy modes, particularly iptables and the emerging eBPF-based approaches, have made IPVS less practical to support. The deprecation aims to streamline kube-proxy’s codebase, reduce technical debt, and align Kubernetes networking with modern, scalable, and actively maintained technologies that better meet current performance and observability needs.

You can find more in [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495)

### Fix inconsistent container ready state after kubelet restart

When a kubelet restarts, the expectation is that running Pods continue operating without disruption. However, today a kubelet restart temporarily marks all Pods on that Node as not Started or Ready, even if they are functioning normally. This can trigger unnecessary service interruptions and affect workload stability.
To address this, Kubernetes is enhancing **Pod readiness management** in the kubelet to preserve Pod status across restarts. The improvement ensures container start and ready states remain consistent, reducing false readiness transitions and preventing avoidable disruptions to running services.

You can find more in [KEP-4781: Fix inconsistent container ready state after kubelet restart](https://kep.k8s.io/4781)

## Featured enhancements of Kubernetes v1.35

The following list of enhancements is likely to be included in the v1.35 release. This is not a commitment and the release content is subject to change.

### In-place Update of Pod Resources

Kubernetes is introducing in-place updates for Pod resources, allowing CPU and memory changes without restarting Pods or Containers. Previously, such updates required recreating Pods, which could disrupt workloads, especially for stateful or batch applications.
This enhancement makes PodSpec fields for resources mutable and extends PodStatus to track actual usage, enabling smoother vertical scaling and better efficiency.

The Container Runtime Interface (CRI) is also being improved, extending the ‘UpdateContainerResources’ API for Windows and future runtimes while allowing ‘ContainerStatus’ to report real-time resource configurations. Together, these changes make scaling in Kubernetes faster, flexible, and disruption-free.
The feature was introduced as alpha in v1.27, graduated to beta in v1.33, and will be stable in v1.35.

You can find more in [KEP-1287: In-place Update of Pod Resources](https://kep.k8s.io/1287)

### Structured Authentication Configuration

This enhancement proposal introduces structured authentication configuration for the Kubernetes API server, starting with support for JWT-based authentication as an evolution of the current OIDC authenticator. The primary goal is to make authentication setup more flexible, maintainable, and consistent through a structured, declarative model.

While OIDC is vital to Kubernetes authentication, its current design has limitations in configurability and extensibility. By reworking it into a generalized JWT authenticator, this proposal simplifies configuration, improves compatibility with modern identity systems, and establishes a stronger foundation for future authentication mechanisms.

You can find more in [KEP-3331: Structured Authentication Configuration](https://kep.k8s.io/3331)

### Service Internal Traffic Policy

When routing traffic within a Kubernetes cluster, the TrafficDistribution setting for Services helps optimize network paths. Previously, the PreferClose option, which was intended to route traffic to topologically proximate endpoints, was ambiguous.

To address this, a new enhancement clarifies this behavior. It deprecates the vague PreferClose value and replaces it with two more specific options:

- PreferSameZone: This serves as a clearer name for the old behavior, indicating a preference for routing traffic to endpoints within the same zone as the client.
- PreferSameNode: This is a new, more granular value. It indicates a preference for routing traffic to endpoints on the same Node as the client. If a local endpoint is not available, the traffic will fall back to other available endpoints (such as those in the same zone).

This change makes topology-aware routing more predictable and introduces a clear way to prioritize same-node traffic, which is ideal for reducing latency for co-located applications, like on-node DNS Pods.

You can find more in [KEP-3015: Service Internal Traffic Policy](https://kep.k8s.io/3015)

### Node Declared Features

When scheduling Pods, Kubernetes uses node labels, taints, and tolerations to match workload requirements with node capabilities. However, managing feature compatibility becomes challenging during cluster upgrades due to version skew between the control plane and nodes. This can lead to Pods being scheduled on nodes that lack required features, resulting in runtime failures.

The [KEP-5328](https://kep.k8s.io/5328) Node Declared Features framework introduces a standardized mechanism for nodes to declare their supported Kubernetes features via a new `node.status.declaredFeatures` field. The kubelet detects and reports enabled features at startup. At the same time, the kube-scheduler and admission controllers use these declarations to enforce scheduling and API validation constraints, ensuring that Pods run only on compatible nodes.

This approach reduces manual node labeling, improves scheduling accuracy, and prevents incompatible pod placements proactively. It also integrates with the Cluster Autoscaler for informed scale-up decisions. Feature declarations are temporary and tied to Kubernetes feature gates, enabling safe rollout and cleanup.

Initially released as an alpha feature, Node Declared Features aims to solve version skew scheduling issues by making node capabilities explicit, enhancing reliability and cluster stability in heterogeneous version environments.

You can find more in [KEP-5328: Node Declared Features](https://kep.k8s.io/5328)

### Pod Certificates

When running microservices, Pods often require a strong cryptographic identity to authenticate with each other using mutual TLS (mTLS). While Kubernetes provides Service Account tokens, these are designed for authenticating to the API server, not for general-purpose workload identity. Before this enhancement, operators had to rely on complex, external projects like SPIFFE/SPIRE or cert-manager to provision and rotate certificates for their workloads. But what if you could natively and automatically issue a unique, short-lived certificate to your Pods? KEP-4317 is precisely to allow such native workload identity. It opens up various possibilities for securing pod-to-pod communication by allowing the kubelet to request and mount certificates for a Pod via a projected volume. This provides a built-in mechanism for workload identity, complete with automated certificate rotation, significantly simplifying the setup of service meshes and other zero-trust network policies. This feature was introduced as alpha in v1.34 and is targeting beta in v1.35.

You can find more in [KEP-4317: Pod Certificates](https://kep.k8s.io/4317)

### Enable SLA-based Scheduling

Kubernetes is enhancing Taints and Tolerations by adding numeric comparison operators like Gt (Greater Than) and Lt (Less Than).

Previously, tolerations only supported exact (Equal) or existence (Exists) matches, which was not suitable for numeric properties like reliability SLAs.

With this change, a Pod can use a toleration to "opt-in" to nodes that meet a specific numeric threshold. For example, a Pod can require a Node with an SLA taint value greater than 950 (operator: Gt, value: "950").

This approach is more powerful than Node Affinity because it supports the NoExecute effect, allowing Pods to be automatically evicted if a node's numeric value drops below the tolerated threshold.

You can find more in [KEP-5471: Enable SLA-based Scheduling](https://kep.k8s.io/5471)

### User Namespaces

When running Pods, you can use securityContext to drop privileges, but containers inside the pod often still run as root (UID 0). This simplicity poses a significant challenge, as that container UID 0 maps directly to the host's root user. Before this enhancement, a container breakout vulnerability could grant an attacker full root access to the node. But what if you could dynamically remap the container's root user to a safe, unprivileged user on the host? KEP-127 is precisely to allow such native support for Linux User Namespaces. It opens up various possibilities for pod security by isolating container and host user/group IDs. This allows a process to have root privileges (UID 0) inside its namespace, while that same process runs as a non-privileged, high-numbered UID on the host. This was released as alpha in v1.25 and as beta in v1.30 and is progressing, still in beta, paving the way for truly "rootless" containers that drastically reduce the attack surface for a whole class of security vulnerabilities.

You can find more in[ KEP-127: User Namespaces](https://kep.k8s.io/127)

### OCI Volume Source

When provisioning a Pod, you often need to bundle data, binaries, or configuration files for your containers. Before this enhancement, this data was often built directly into the container image or required a custom initContainer to download and unpack files into an emptyDir. This process is cumbersome, couples application logic with data artifacts, and adds unnecessary complexity to Pod startup. But what if you could populate a volume directly from a data-only artifact in an OCI registry, just like pulling a container image? KEP-4639 is precisely to allow such a native workflow. It opens up various possibilities by introducing a new ociArtifact volume source, allowing Pods to declaratively pull and unpack OCI artifacts into a volume. This allows for seamless distribution of data, binaries, or ML models using standard registry tooling, completely decoupling data from the container image and eliminating the need for complex initContainer scripts. This feature was introduced as alpha in v1.31 and now progressing as beta in v1.35.

You can find more in [KEP-4639: OCI Volume Source](https://kep.k8s.io/4639)

## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md) as part of the CHANGELOG for that release.

Kubernetes v1.35 release is planned for **17th December 2025**. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:

- [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
- [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
- [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
- [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)
- [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)