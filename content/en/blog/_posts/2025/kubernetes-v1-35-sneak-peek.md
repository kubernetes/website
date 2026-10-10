---
layout: blog
title: 'Kubernetes v1.35 Sneak Peek'
date: 2025-11-26
slug: kubernetes-v1-35-sneak-peek
author: >
  Aakanksha Bhende,
  Arujjwal Negi,
  Chad M. Crowell,
  Graziano Casto,
  Swathi Rao
---

As the release of Kubernetes v1.35 approaches, the Kubernetes project continues to evolve. Features may be deprecated, removed, or replaced to improve the project's overall health. This blog post outlines planned changes for the v1.35 release that the release team believes you should be aware of to ensure the continued smooth operation of your Kubernetes cluster(s), and to keep you up to date with the latest developments. The information below is based on the current status of the v1.35 release and is subject to change before the final release date.

## Deprecations and removals for Kubernetes v1.35

### cgroup v1 support

On Linux nodes, container runtimes typically rely on cgroups (short for "control groups").
Support for using cgroup v2 has been stable in Kubernetes since v1.25, providing an alternative to the original v1 cgroup support. While cgroup v1 provided the initial resource control mechanism, it suffered from well-known
inconsistencies and limitations. Adding support for cgroup v2 allowed use of a unified control group hierarchy, improved resource isolation, and served as the foundation for modern features, making legacy cgroup v1 support ready for removal.
The removal of cgroup v1 support will only impact cluster administrators running nodes on older Linux distributions that do not support cgroup v2; on those nodes, the `kubelet` will fail to start. Administrators must migrate their nodes to systems with cgroup v2 enabled. More details on compatibility requirements will be available in a blog post soon after the v1.35 release.

To learn more, read [about cgroup v2](/docs/concepts/architecture/cgroups/);  
you can also track the switchover work via [KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573).  

### Deprecation of ipvs mode in kube-proxy

Many releases ago, the Kubernetes project implemented an [ipvs](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) mode in `kube-proxy`. It was adopted as a way to provide high-performance service load balancing, with better performance than the existing `iptables` mode. However, maintaining feature parity between ipvs and other kube-proxy modes became difficult, due to technical complexity and diverging requirements. This created significant technical debt and made the ipvs backend impractical to support alongside newer networking capabilities.

The Kubernetes project intends to deprecate kube-proxy `ipvs` mode in the v1.35 release, to streamline the `kube-proxy` codebase. For Linux nodes, the recommended `kube-proxy` mode is already [nftables](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).

You can find more in [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495)

### Kubernetes is deprecating containerd v1.y support

While Kubernetes v1.35 still supports containerd 1.7 and other LTS releases of containerd, as a consequence of automated cgroup driver detection, the Kubernetes SIG Node community has formally agreed upon a final support timeline for containerd v1.X. Kubernetes v1.35 is the last release to offer this support (aligned with containerd 1.7 EOL). 

This is a final warning that if you are using containerd 1.X, you must switch to 2.0 or later before upgrading Kubernetes to the next version. You are able to monitor the `kubelet_cri_losing_support` metric to determine if any nodes in your cluster are using a containerd version that will soon be unsupported. 

You can find more in the [official blog post](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support) or in [KEP-4033: Discover cgroup driver from CRI](https://kep.k8s.io/4033)

## Featured enhancements of Kubernetes v1.35

The following enhancements are some of those likely to be included in the v1.35 release. This is not a commitment, and the release content is subject to change.

### Node declared features

When scheduling Pods, Kubernetes uses node labels, taints, and tolerations to match workload requirements with node capabilities. However, managing feature compatibility becomes challenging during cluster upgrades due to version skew between the control plane and nodes. This can lead to Pods being scheduled on nodes that lack required features, resulting in runtime failures.

The _node declared features_ framework will introduce a standard mechanism for nodes to declare their supported Kubernetes features. With the new alpha feature enabled, a Node reports the features it can support, publishing this information to the control plane through a new `.status.declaredFeatures` field. Then, the `kube-scheduler`, admission controllers and third-party components can use these declarations. For example, you can enforce scheduling and API validation constraints, ensuring that Pods run only on compatible nodes.

This approach reduces manual node labeling, improves scheduling accuracy, and prevents incompatible pod placements proactively. It also integrates with the Cluster Autoscaler for informed scale-up decisions. Feature declarations are temporary and tied to Kubernetes feature gates, enabling safe rollout and cleanup.

Targeting alpha in v1.35, _node declared features_ aims to solve version skew scheduling issues by making node capabilities explicit, enhancing reliability and cluster stability in heterogeneous version environments.

To learn more about this before the official documentation is published, you can read [KEP-5328](https://kep.k8s.io/5328).

### In-place update of Pod resources

Kubernetes is graduating in-place updates for Pod resources to General Availability (GA). This feature allows users to adjust `cpu` and `memory` resources without restarting Pods or Containers. Previously, such modifications required recreating Pods, which could disrupt workloads, particularly for stateful or batch applications.
Previous Kubernetes releases already allowed you to change infrastructure resources settings (requests and limits) for existing Pods. This allows for smoother [vertical scaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/), improves efficiency, and can also simplify solution development.

The Container Runtime Interface (CRI) has also been improved, extending the `UpdateContainerResources` API for Windows and future runtimes while allowing `ContainerStatus` to report real-time resource configurations. Together, these changes make scaling in Kubernetes faster, more flexible, and disruption-free.
The feature was introduced as alpha in v1.27, graduated to beta in v1.33, and is targeting graduation to stable in v1.35.

You can find more in [KEP-1287: In-place Update of Pod Resources](https://kep.k8s.io/1287)

### Pod certificates

When running microservices, Pods often require a strong cryptographic identity to authenticate with each other using mutual TLS (mTLS). While Kubernetes provides Service Account tokens, these are designed for authenticating to the API server, not for general-purpose workload identity. 

Before this enhancement, operators had to rely on complex, external projects like SPIFFE/SPIRE or cert-manager to provision and rotate certificates for their workloads. But what if you could  issue a unique, short-lived certificate to your Pods natively and automatically? KEP-4317 is designed to enable such native workload identity. It opens up various possibilities for securing pod-to-pod communication by allowing the `kubelet` to request and mount certificates for a Pod via a projected volume. 

This provides a built-in mechanism for workload identity, complete with automated certificate rotation, significantly simplifying the setup of service meshes and other zero-trust network policies. This feature was introduced as alpha in v1.34 and is targeting beta in v1.35.

You can find more in [KEP-4317: Pod Certificates](https://kep.k8s.io/4317)

### Numeric values for taints

Kubernetes is enhancing [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) by adding numeric comparison operators, such as `Gt` (Greater Than) and `Lt` (Less Than).

Previously, tolerations supported only exact (`Equal`) or existence (`Exists`) matches, which were not suitable for numeric properties such as reliability SLAs.

With this change, a Pod can use a toleration to "opt-in" to nodes that meet a specific numeric threshold. For example, a Pod can require a Node with an SLA taint value greater than 950 (`operator: Gt`, `value: "950"`).

This approach is more powerful than Node Affinity because it supports the NoExecute effect, allowing Pods to be automatically evicted if a node's numeric value drops below the tolerated threshold.

You can find more in [KEP-5471: Enable SLA-based Scheduling](https://kep.k8s.io/5471)

### User namespaces

When running Pods, you can use `securityContext` to drop privileges, but containers inside the pod often still run as root (UID 0). This simplicity poses a significant challenge, as that container UID 0 maps directly to the host's root user. 

Before this enhancement, a container breakout vulnerability could grant an attacker full root access to the node. But what if you could dynamically remap the container's root user to a safe, unprivileged user on the host? KEP-127 specifically allows such native support for Linux User Namespaces. It opens up various possibilities for pod security by isolating container and host user/group IDs. This allows a process to have root privileges (UID 0) within its namespace, while running as a non-privileged, high-numbered UID on the host. 

Released as alpha in v1.25 and beta in v1.30, this feature continues to progress through beta maturity, paving the way for truly "rootless" containers that drastically reduce the attack surface for a whole class of security vulnerabilities.

You can find more in [KEP-127: User Namespaces](https://kep.k8s.io/127)

### Support for mounting OCI images as volumes

When provisioning a Pod, you often need to bundle data, binaries, or configuration files for your containers.
Before this enhancement, people often included that kind of data directly into the main container image, or required a custom init container to download and unpack files into an `emptyDir`. You can still take either of those approaches, of course.

But what if you could populate a volume directly from a data-only artifact in an OCI registry, just like pulling a container image? Kubernetes v1.31 added support for the `image` volume type, allowing Pods to pull and unpack OCI container image artifacts into a volume declaratively.

This allows for seamless distribution of data, binaries, or ML models using standard registry tooling, completely decoupling data from the container image and eliminating the need for complex init containers or startup scripts.
This volume type has been in beta since v1.33 and will likely be enabled by default in v1.35.

You can try out the beta version of [`image` volumes](/docs/concepts/storage/volumes/#image), or you can learn more about the plans from [KEP-4639: OCI Volume Source](https://kep.k8s.io/4639).

## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md) as part of the CHANGELOG for that release.

The Kubernetes v1.35 release is planned for **December 17, 2025**. Stay tuned for updates!

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