---  
layout: blog
title: 'Kubernetes v1.36: RELEASE NAME'
date: 2026-04-22T10:30:00-08:00
draft: true
evergreen: true
slug: kubernetes-v1-36-release
author: >
  [Kubernetes v1.36 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
release_announcement:
  minor_version: "1.36"
---

**Editors:** Chad M. Crowell, Kirti Goyal, Sophia Ugochukwu, Swathi Rao, Utkarsh Umre

Similar to previous releases, the release of Kubernetes v1.36 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 69 enhancements. Of those enhancements, 18 have graduated to Stable, 24 are entering Beta, and 25 have graduated to Alpha.

There are also some [deprecations and removals](#deprecations-removals-and-community-updates) in this release; make sure to read about those.

## Release theme and logo

\<TODO RELEASE THEME AND LOGO\>

## Spotlight on key updates

Kubernetes v1.36 is packed with new features and improvements. Here are a
few select updates the Release Team would like to highlight!

### Stable: Fine-grained API authorization

On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the
graduation of fine-grained `kubelet` API authorization to General Availability
(GA) in Kubernetes v1.36!

The `KubeletFineGrainedAuthz` feature gate was introduced as an opt-in alpha feature
in Kubernetes v1.32, then graduated to beta (enabled by default) in v1.33.
Now, the feature is generally available.
This feature enables more precise, least-privilege access control over the kubelet's
HTTPS API replacing the need to grant the overly broad nodes/proxy permission for
common monitoring and observability use cases.

​​This work was done as a part of [KEP #2862](https://kep.k8s.io/2862) led by SIG Auth and SIG Node.

### Beta: Resource health status

Before the v1.34 release, Kubernetes lacked a native way to report the health of allocated devices,
making it difficult to diagnose Pod crashes caused by hardware failures.
Building on the initial alpha release in v1.31 which focused on Device Plugins,
Kubernetes v1.36 expands this feature by promoting the `allocatedResourcesStatus`
field within the `.status` for each Pod (to beta). This field provides a unified health
reporting mechanism for all specialized hardware.

Users can now run `kubectl describe pod` to determine if a container's crash loop is
due to an `Unhealthy` or `Unknown` device status, regardless of whether the hardware was
provisioned via traditional plugins or the newer DRA framework.
This enhanced visibility allows administrators and automated controllers to
quickly identify faulty hardware and streamline the recovery of high-performance workloads.

This work was done as part of [KEP #4680](https://kep.k8s.io/4680) led by SIG Node.

### Alpha: Workload Aware Scheduling (WAS) features

Previously, the Kubernetes scheduler and job controllers managed pods as independent units,
often leading to fragmented scheduling or resource waste for complex, distributed workloads.
Kubernetes v1.36 introduces a comprehensive suite of Workload Aware Scheduling (WAS) features in Alpha,
natively integrating the Job controller with a revised [Workload](/docs/concepts/workloads/workload-api/)
API and a new decoupled PodGroup API,
to treat related pods as a single logical entity.

Kubernetes v1.35 already supported [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) by requiring
a minimum number of pods to be schedulable before any were bound to nodes.
v1.36 goes further with a new PodGroup scheduling cycle that evaluates the entire group atomically,
either all pods in the group are bound together, or none are.

This work was done across several KEPs (including [#4671](https://kep.k8s.io/4671), [#5547](https://kep.k8s.io/5547), [#5832](https://kep.k8s.io/5832), [#5732](https://kep.k8s.io/5732), and [#5710](https://kep.k8s.io/5710)) led by SIG Scheduling and SIG Apps.

## Features graduating to Stable

_This is a selection of some of the improvements that are now stable following the v1.36 release._

### Volume group snapshots

After several cycles in beta, VolumeGroupSnapshot support reaches General Availability (GA) in Kubernetes v1.36.
This feature allows you to take crash-consistent snapshots across multiple PersistentVolumeClaims simultaneously.
The support for volume group snapshots relies on a set of [extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
A key aim is to allow you to restore that set of snapshots to new volumes and recover your workload based on
a crash consistent recovery point.

This work was done as part of [KEP #3476](https://kep.k8s.io/3476) led by SIG Storage.

### Mutable volume attach limits

In Kubernetes v1.36, the _mutable `CSINode` allocatable_ feature graduates to stable.
This enhancement allows [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/introduction.html) drivers to
dynamically update the reported maximum number of volumes that a node can handle.

With this update, the `kubelet` can dynamically update a node's volume limits and capacity information.
The `kubelet` adjusts these limits based on periodic checks or in response to
resource exhaustion errors from the CSI driver, without requiring a component restart.
This ensures the Kubernetes scheduler maintains an accurate view of storage availability,
preventing pod scheduling failures caused by outdated volume limits.

This work was done as part of [KEP #4876](https://kep.k8s.io/4876) led by SIG Storage.

### API for external signing of ServiceAccount tokens {#api-for-external-signing-of-service-account-tokens}

In Kubernetes v1.36, the _external ServiceAccount token signer_ feature for service accounts graduates to stable,
making it possible to offload token signing to an external system while still integrating cleanly with the Kubernetes API.
Clusters can now rely on an external JWT signer for issuing projected service account tokens that
follow the standard service account token format, including support for extended expiration when needed.
This is especially useful for clusters that already rely on external identity or key management systems,
allowing Kubernetes to integrate without duplicating key management inside the control plane.

The kube-apiserver is wired to discover public keys from the external signer,
cache them, and validate tokens it did not sign itself,
so existing authentication and authorization flows continue to work as expected.
Over the alpha and beta phases, the API and configuration for the external signer plugin,
path validation, and OIDC discovery were hardened to handle real-world deployments and rotation patterns safely.

With GA in v1.36, external ServiceAccount token signing is now a fully supported option for platforms that
centralize identity and signing, simplifying integration with external IAM systems and
reducing the need to manage signing keys directly inside the control plane.

This work was done as part of [KEP #740](https://kep.k8s.io/740) led by SIG Auth.

### DRA features graduating to Stable

Part of the Dynamic Resource Allocation (DRA) ecosystem reaches full production maturity in
Kubernetes v1.36 as key governance and selection features graduate to Stable.
The transition of _DRA admin access_ to GA provides a permanent, secure framework for cluster administrators
to access and manage hardware resources globally, while the stabilization of _prioritized lists_ ensures that
resource selection logic remains consistent and predictable across all cluster environments.

Now, organizations can confidently deploy mission-critical hardware automation with the guarantee
of long-term API stability and backward compatibility. These features empower users to implement
sophisticated resource-sharing policies and administrative overrides that are essential for
large-scale GPU clusters and multi-tenant AI platforms, marking the completion of the
core architectural foundation for next-generation resource management.

This work was done as part of KEPs [#5018](https://kep.k8s.io/5018) and [#4816](https://kep.k8s.io/4816) led by SIG Auth and SIG Scheduling.

### Mutating admission policies

Declarative cluster management reaches a new level of sophistication in Kubernetes v1.36 with the
graduation of [MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/) to Stable. This milestone provides a native,
high-performance alternative to traditional webhooks by allowing administrators to
define resource mutations directly in the API server using the Common Expression Language (CEL),
fully replacing the need for external infrastructure for many common use cases.

Now, cluster operators can modify incoming requests without the latency and operational
complexity associated with managing custom admission webhooks.
By moving mutation logic into a declarative, versioned policy, organizations can achieve
more predictable cluster behavior, reduced network overhead,
and a hardened security model with the full guarantee of long-term API stability.

This work was done as part of [KEP #3962](https://kep.k8s.io/3962) led by SIG API Machinery.

### Declarative validation of Kubernetes native types with `validation-gen` {#declarative-validation-of-kubernetes-native-types-with-validation-gen}

The development of custom resources reaches a new level of efficiency in Kubernetes v1.36
as _declarative validation_ (with `validation-gen`) graduates to Stable.
This milestone replaces the manual and often error-prone task of writing complex
OpenAPI schemas by allowing developers to define sophisticated validation logic directly
within Go struct tags using the Common Expression Language (CEL).

Instead of writing custom validation functions, Kubernetes contributors can now define validation
rules using IDL marker comments (such as `+k8s:minimum` or `+k8s:enum`) directly
within the API type definitions (`types.go`). The `validation-gen` tool parses these
comments to automatically generate robust API validation code at compile-time.
This reduces maintenance overhead and ensures that API validation
remains consistent and synchronized with the source code.

This work was done as part of [KEP #5073](https://kep.k8s.io/5073) led by SIG API Machinery.

### Removal of gogo protobuf dependency for Kubernetes API types {#remove-gogo-protobuf-dependency-for-kubernetes-api-types}

Security and long-term maintainability for the Kubernetes codebase take a major step forward
in Kubernetes v1.36 with the completion of the `gogoprotobuf` removal.
This initiative has eliminated a significant dependency on the unmaintained `gogoprotobuf` library,
which had become a source of potential security vulnerabilities and
a blocker for adopting modern Go language features.

Instead of migrating to standard Protobuf generation, which presented compatibility risks
for Kubernetes API types, the project opted to fork and internalize the required
generation logic within `k8s.io/code-generator`. This approach successfully eliminates
the unmaintained runtime dependencies from the Kubernetes dependency graph
while preserving existing API behavior and serialization compatibility.
For consumers of Kubernetes API Go types, this change reduces technical debt and
prevents accidental misuse with standard protobuf libraries.

This work was done as part of [KEP #5589](https://kep.k8s.io/5589) led by SIG API Machinery.

### Node log query

Previously, Kubernetes required cluster administrators to log into nodes via SSH or implement a
client-side reader for debugging issues pertaining to control-plane or worker nodes.
While certain issues still require direct node access, issues with the kube-proxy or kubelet
can be diagnosed by inspecting their logs. Node logs offer cluster administrators
a method to view these logs using the kubelet API and kubectl plugin
to simplify troubleshooting without logging into nodes, similar to debugging issues
related to a pod or container. This method is operating system agnostic and
requires the services or nodes to log to `/var/log`.

As this feature reaches GA in Kubernetes 1.36 after thorough performance validation on production workloads,
it is enabled by default on the kubelet through the `NodeLogQuery` feature gate.
In addition, the `enableSystemLogQuery` kubelet configuration option must also be enabled.

This work was done as a part of [KEP #2258](https://kep.k8s.io/2258) led by SIG Windows.

### Support User Namespaces in pods

Container isolation and node security reach a major maturity milestone in Kubernetes v1.36 as
support for User Namespaces graduates to Stable.
This long-awaited feature provides a critical layer of defense-in-depth by allowing the
mapping of a container's root user to a non-privileged user on the host,
ensuring that even if a process escapes the container,
it possesses no administrative power over the underlying node.

Now, cluster operators can confidently enable this hardened isolation for production
workloads to mitigate the impact of container breakout vulnerabilities.
By decoupling the container's internal identity from the host's identity,
Kubernetes provides a robust, standardized mechanism to protect multi-tenant
environments and sensitive infrastructure from unauthorized access,
all with the full guarantee of long-term API stability.

This work was done as part of [KEP #127](https://kep.k8s.io/127) led by SIG Node.

### Support PSI based on cgroupv2

Node resource management and observability become more precise in Kubernetes v1.36
as the export of Pressure Stall Information (PSI) metrics graduates to Stable.
This feature provides the kubelet with the ability to report "pressure" metrics for CPU,
memory, and I/O, offering a more granular view of resource contention than
traditional utilization metrics.

Cluster operators and autoscalers can use these metrics to distinguish between a system that is
simply busy and one that is actively stalling due to resource exhaustion.
By leveraging these signals, users can more accurately tune pod resource requests,
improve the reliability of vertical autoscaling, and detect noisy neighbor
effects before they lead to application performance degradation or node instability.

This work was done as part of [KEP #4205](https://kep.k8s.io/4205) led by SIG Node.

### Volume source: OCI artifact and/or image {#volumesource-oci-artifact-and-or-image}

The distribution of container data becomes more flexible in Kubernetes v1.36 as _OCI volume source_ support graduates to Stable.
This feature moves beyond the traditional requirement of mounting volumes from external storage providers
or config maps by allowing the kubelet to pull and mount content directly from any OCI-compliant registry,
such as a container image or an artifact repository.

Now, developers and platform engineers can package application data, models, or static assets as OCI artifacts
and deliver them to pods using the same registries and versioning workflows they already use for container images.
This convergence of image and volume management simplifies CI/CD pipelines,
reduces dependency on specialized storage backends for read-only content,
and ensures that data remains portable and securely accessible across any environment.

This work was done as part of [KEP #4639](https://kep.k8s.io/4639) led by SIG Node.

## New features in Beta

_This is a selection of some of the improvements that are now beta following the v1.36 release._

### Staleness mitigation for controllers

Staleness in Kubernetes controllers is a problem that affects many controllers and can subtly affect controller behavior.
It is usually not until it is too late, when a controller in production has already taken incorrect action,
that staleness is found to be an issue due to some underlying assumption made by the controller author.
This could lead to conflicting updates or data corruption upon controller reconciliation during times of cache staleness.

We are excited to announce that Kubernetes v1.36 includes new features that help mitigate controller staleness and
provide better observability of controller behavior.
This prevents reconciliation based on an outdated view of cluster state that can often lead to harmful behavior.

This work was done as part of [KEP #5647](https://kep.k8s.io/5647) led by SIG API Machinery.

### IP/CIDR validation improvements

In Kubernetes v1.36, the `StrictIPCIDRValidation` feature for API IP and CIDR fields graduates to beta,
tightening validation to catch malformed addresses and prefixes that previously slipped through.
This helps prevent subtle configuration bugs where Services, Pods, NetworkPolicies,
or other resources reference invalid IPs, which could otherwise lead to
confusing runtime behavior or security surprises.

Controllers are updated to canonicalize IPs they write back into objects and to warn when they
encounter bad values that were already stored, so clusters can gradually converge on clean,
consistent data. With beta, `StrictIPCIDRValidation` is ready for wider use,
giving operators more reliable guardrails around IP-related configuration
as they evolve networks and policies over time.

This work was done as a part of [KEP #4858](https://kep.k8s.io/4858) led by SIG Network.

### Separate kubectl user preferences from cluster configs

The `.kuberc` feature for customizing `kubectl` user preferences continues to be beta
and is enabled by default. The `~/.kube/kuberc` file allows users to store aliases, default flags,
and other personal settings separately from `kubeconfig` files, which hold cluster endpoints and credentials.
This separation prevents personal preferences from interfering with CI pipelines or shared `kubeconfig` files,
while maintaining a consistent `kubectl` experience across different clusters and contexts.

In Kubernetes v1.36, `.kuberc` was expanded with the ability to define policies for credential plugins
(allowlists or denylists) to enforce safer authentication practicies.
Users can disable this functionality if needed by setting the `KUBECTL_KUBERC=false` or `KUBERC=off` environment variables.

This work was done as a part of [KEP #3104](https://kep.k8s.io/3104) led by SIG CLI, with the help from SIG Auth.

### Mutable container resources when Job is suspended

In Kubernetes v1.36, the `MutablePodResourcesForSuspendedJobs` feature graduates to beta and is enabled by default.
This update This update relaxes Job validation to allow updates to container CPU, memory,
GPU, and extended resource requests and limits while a Job is suspended.

This capability allows queue controllers and operators to adjust batch workload requirements based on
real‑time cluster conditions. For example, a queueing system can suspend incoming Jobs,
adjust their resource requirements to match available capacity or quota, and then unsuspend them.
The feature strictly limits mutability to suspended Jobs (or Jobs whose pods have been terminated upon suspension)
to prevent disruptive changes to actively running pods.

This work was done as a part of [KEP #5440](https://kep.k8s.io/5440) led by SIG Apps.

### Constrained impersonation

In Kubernetes v1.36, the `ConstrainedImpersonation` feature for user impersonation graduates to beta,
tightening a historically all‑or‑nothing mechanism into something that can actually follow least‑privilege principles.
When this feature is enabled, an impersonator must have two distinct sets of permissions:
one to impersonate a given identity, and another to perform specific actions on that identity’s behalf.
This prevents support tools, controllers, or node agents from using impersonation to gain broader access
than they themselves are allowed, even if their impersonation RBAC is misconfigured.
Existing impersonate rules keep working, but the API server prefers the new constrained checks first,
making the transition incremental instead of a flag day. With beta in v1.36, `ConstrainedImpersonation` is tested,
documented, and ready for wider adoption by platform teams that rely on impersonation for debugging, proxying,
or node‑level controllers.

This work was done as a part of [KEP #5284](https://kep.k8s.io/5284) led by SIG Auth.

### DRA features in beta

The [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) framework reaches another maturity milestone in Kubernetes v1.36 as several core features graduate to beta and are enabled by default.
This transition moves DRA beyond basic allocation by graduating [partitionable devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices) and [consumable capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity), allowing for more granular sharing of hardware like GPUs,
while [device taints and tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) ensure that specialized resources are only utilized by the appropriate workloads.

Now, users benefit from a much more reliable and observable resource lifecycle through [ResourceClaim device status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)
and the ability to ensure device attachment before Pod scheduling.
By integrating these features with [extended resource](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource) support,
Kubernetes provides a robust production-ready alternative to the legacy device plugin system,
enabling complex AI and HPC workloads to manage hardware with unprecedented precision and operational safety.

This work was done across several KEPs (including [#5004](https://kep.k8s.io/5004), [#4817](https://kep.k8s.io/4817), [#5055](https://kep.k8s.io/5055), [#5075](https://kep.k8s.io/5075), [#4815](https://kep.k8s.io/4815), and [#5007](https://kep.k8s.io/issues/5007)) led by SIG Scheduling and SIG Node.

### Statusz for Kubernetes components

In Kubernetes v1.36, the `ComponentStatusz` feature gate for core Kubernetes components graduates to beta,
providing a `/statusz` endpoint (enabled by default) that surfaces real‑time build and version details for each component.
This low‑overhead [z-page](docs/reference/instrumentation/zpages/) exposes information like start time, uptime, Go version, binary version,
emulation version, and minimum compatibility version, so operators and developers can quickly see exactly
what is running without digging through logs or configs.

The endpoint offers a human‑readable text view by default, plus a versioned structured API (`config.k8s.io/v1beta1`)
for programmatic access in JSON, YAML, or CBOR via explicit content negotiation.
Access is granted to the `system:monitoring` group, keeping it aligned with existing protections on
health and metrics endpoints and avoiding exposure of sensitive data.

With beta, `ComponentStatusz` is enabled by default across all core control‑plane components and node agents,
backed by unit, integration, and end‑to‑end tests so it can be safely used in production for
observability and debugging workflows.

This work was done as a part of [KEP #4827](https://kep.k8s.io/4827) led by SIG Instrumentation.

### Flagz for Kubernetes components

In Kubernetes v1.36, the `ComponentFlagz` feature gate for core Kubernetes components graduates to beta,
standardizing a `/flagz` endpoint that exposes the effective command‑line flags each component was started with.
This gives cluster operators and developers real‑time, in‑cluster visibility into component configuration,
making it much easier to debug unexpected behavior or verify that a flag rollout actually took effect after a restart.

The endpoint supports both a human‑readable text view and a versioned structured API (initially `config.k8s.io/v1beta1`),
so you can either `curl` it during an incident or wire it into automated tooling once you are ready.
Access is granted to the `system:monitoring` group and sensitive values can be redacted,
keeping configuration insight aligned with existing security practices around health and status endpoints.

With beta, `ComponentFlagz` is now enabled by default and implemented across all core control‑plane components
and node agents, backed by unit, integration, and end‑to‑end tests to ensure the endpoint is reliable in production clusters.

This work was done as a part of [KEP #4828](https://kep.k8s.io/4828) led by SIG Instrumentation.

### Mixed version proxy (aka _unknown version interoperability proxy_) {#mixed-version-proxy}

In Kubernetes v1.36, the _mixed version proxy_ feature graduates to beta, building on its alpha introduction in v1.28
to provide safer control-plane upgrades for mixed-version clusters. Each API request can now be routed to the apiserver
instance that serves the requested group, version, and resource, reducing 404s and failures due to version skew.

The feature relies on peer-aggregated discovery, so apiservers share information about which resources and versions they expose,
then use that data to transparently reroute requests when needed. New metrics on rerouted traffic and proxy behavior
help operators understand how often requests are forwarded and to which peers.
Together, these changes make it easier to run highly available, mixed-version API control planes in production
while performing multi-step or partial control-plane upgrades.

This work was done as a part of [KEP #4020](https://kep.k8s.io/4020) led by SIG API Machinery

### Memory QoS with cgroups v2

Kubernetes now enhances memory QoS on Linux cgroup v2 nodes with smarter, tiered memory protection that better aligns kernel
controls with pod requests and limits, reducing interference and thrashing for workloads sharing the same node.
This iteration also refines how kubelet programs memory.high and memory.min, adds metrics and safeguards to avoid livelocks,
and introduces configuration options so cluster operators can tune memory protection behavior for their environments.

This work was done as part of [KEP #2570](https://kep.k8s.io/2570) led by SIG Node.

## New features in Alpha

This is a selection of some of the improvements that are now alpha following the v1.36 release.

### HPA scale to zero for custom metrics

Until now, the HorizontalPodAutoscaler (HPA) required a minimum of at least one replica to remain active,
as it could only calculate scaling needs based on metrics (like CPU or Memory) from running pods.
Kubernetes v1.36 continues the development of the _HPA scale to zero_ feature (disabled by default) in Alpha,
allowing workloads to scale down to zero replicas specifically when using Object or External metrics.

Now, users can experiment with significantly reducing infrastructure costs by completely idling heavy workloads when
no work is pending. While the feature remains behind the `HPAScaleToZero` feature gate,
it enables the HPA to stay active even with zero running pods,
automatically scaling the deployment back up as soon as the external metric (e.g., queue length)
indicates that new tasks have arrived.

This work was done as part of [KEP #2021](https://kep.k8s.io/2021) led by SIG Autoscaling.

### DRA features in Alpha

Historically, the Dynamic Resource Allocation (DRA) framework lacked seamless integration with high-level controllers and
provided limited visibility into device-specific metadata or availability.
Kubernetes v1.36 introduces a wave of DRA enhancements in Alpha, including native ResourceClaim support for workloads,
and DRA native resources to provide the flexibility of DRA to cpu management.

Now, users can leverage the [downward API](/docs/concepts/workloads/pods/downward-api/) to expose complex resource attributes directly to containers and
benefit from improved resource availability visibility for more predictable scheduling. these updates,
combined with support for list types in device attributes, transform DRA from a low-level primitive into a robust system
capable of handling the sophisticated networking and compute requirements of modern AI and
high-performance computing (HPC) stacks.

This work was done across several KEPs (including [#5729](https://kep.k8s.io/5729), [#5304](https://kep.k8s.io/5304), [#5517](https://kep.k8s.io/5517), [#5677](https://kep.k8s.io/5677), and [#5491](https://kep.k8s.io/5491)) led by SIG Scheduling and SIG Node.

### Native histogram support for Kubernetes metrics

High-resolution monitoring reaches a new milestone in Kubernetes v1.36 with the introduction of native histogram support
in Alpha. While classical Prometheus histograms relied on static, pre-defined buckets that often forced a compromise
between data accuracy and memory usage, this update allows the control plane to export sparse histograms that
dynamically adjust their resolution based on real-time data.

Now, cluster operators can capture precise latency distributions for the kube-apiserver and other core components without
the overhead of manual bucket management. This architectural shift ensures more reliable SLIs and SLOs,
providing high-fidelity heatmaps that remain accurate even during the most unpredictable workload spikes.

This work was done as part of [KEP #5808](https://kep.k8s.io/5808) led by SIG Instrumentation.

### Manifest based admission control config

Managing admission controllers moves toward a more declarative and consistent model in Kubernetes v1.36 with the
introduction of _manifest-based admission control_ configuration in Alpha.
This change addresses the long-standing challenge of configuring admission plugins through disparate command-line
flags or separate, complex config files by allowing administrators to define the desired state of admission control
directly through a structured manifest.

Now, cluster operators can manage admission plugin settings with the same versioned, declarative workflows used for
other Kubernetes objects, significantly reducing the risk of configuration drift and manual errors during cluster upgrades.
By centralizing these configurations into a unified manifest, the kube-apiserver becomes easier to audit and automate,
paving the way for more secure and reproducible cluster deployments.

This work was done as part of [KEP #5793](https://kep.k8s.io/5793) led by SIG API Machinery.

### CRI list streaming

With the introduction of _CRI list streaming_ in Alpha, Kubernetes v1.36 uses new internal streaming operations.
This enhancement addresses the memory pressure and latency spikes often seen on large-scale nodes by replacing traditional,
monolithic `List` requests between the kubelet and the container runtime with a more efficient server-side streaming RPC.

Now, instead of waiting for a single, massive response containing all container or image data, the kubelet can process results
incrementally as they are streamed. This shift significantly reduces the peak memory footprint of the kubelet and improves
responsiveness on high-density nodes, ensuring that cluster management remains fluid even as the number of
containers per node continues to grow.

This work was done as part of [KEP #5825](https://kep.k8s.io/5825) led by SIG Node.

## Other notable changes

### Ingress NGINX retirement

To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee have 
retired Ingress NGINX on March 24, 2026.
Since that date, there have been no further releases, no bugfixes, and no updates to resolve any security vulnerabilities discovered. Existing deployments of
Ingress NGINX will continue to function, and installation artifacts like Helm charts and container images will remain available. 

For full details, see the [official retirement announcement](/blog/2025/11/11/ingress-nginx-retirement/).

### Faster SELinux labelling for volumes (GA) {#volume-selinux-labelling}

Kubernetes v1.36 makes the SELinux volume mounting improvement generally available. This change replaced recursive file 
relabeling with `mount -o context=XYZ` option, applying the correct SELinux label to the entire volume at mount time. 
It brings more consistent performance and reduces Pod startup delays on SELinux-enforcing systems.

This feature was introduced as beta in v1.28 for `ReadWriteOncePod` volumes. In v1.32, it gained metrics and an opt-out 
option (`securityContext.seLinuxChangePolicy: Recursive`) to help catch conflicts. Now in v1.36, 
it reaches Stable and defaults to all volumes, with Pods or CSIDrivers opting in via `spec.SELinuxMount`. 

However, we expect this feature to create the risk of breaking changes in the future Kubernetes releases, 
due to the potential for mixing of privileged and unprivileged pods.

Setting the `seLinuxChangePolicy` field and SELinux volume labels on Pods, correctly, is the responsibility of the 
Pod author Developers have that responsibility whether they are writing a Deployment, StatefulSet, 
DaemonSet or even a custom resource that includes a Pod template. Being careless with these settings can lead to 
a range of problems when Pods share volumes.

For more details on this enhancement, refer to  [KEP-1710: Speed up recursive SELinux label change](https://kep.k8s.io/1710)

## Graduations, deprecations, and removals in v1.36

### Graduations to stable

This lists all the features that graduated to stable (also known as general availability).
For a full list of updates including new features and graduations from alpha to beta, see the release notes.

This release includes a total of 18 enhancements promoted to stable:

- [Support User Namespaces in pods](https://kep.k8s.io/127)
- [API for external signing of Service Account tokens](https://kep.k8s.io/740)
- [Speed up recursive SELinux label change](https://kep.k8s.io/1710)
- [Portworx file in-tree to CSI driver migration](https://kep.k8s.io/2589)
- [Fine grained Kubelet API authorization](https://kep.k8s.io/2862)
- [Mutating Admission Policies](https://kep.k8s.io/3962)
- [Node log query](https://kep.k8s.io/2258)
- [VolumeGroupSnapshot](https://kep.k8s.io/3476)
- [Mutable CSINode Allocatable Property](https://kep.k8s.io/4876)
- [DRA: Prioritized Alternatives in Device Requests](https://kep.k8s.io/4816)
- [Support PSI based on cgroupv2](https://kep.k8s.io/4205)
- [add ProcMount option](https://kep.k8s.io/4265)
- [DRA: Extend PodResources to include resources from Dynamic Resource Allocation](https://kep.k8s.io/3695)
- [VolumeSource: OCI Artifact and/or Image](https://kep.k8s.io/4639)
- [Split L3 Cache Topology Awareness in CPU Manager](https://kep.k8s.io/5109)
- [DRA: AdminAccess for ResourceClaims and ResourceClaimTemplates](https://kep.k8s.io/5018)
- [Remove gogo protobuf dependency for Kubernetes API types](https://kep.k8s.io/5589)
- [CSI driver opt-in for service account tokens via secrets field](https://kep.k8s.io/5538)

## Deprecations removals, and community updates

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones to improve the
project's overall health. See the Kubernetes deprecation and removal policy for more details on this process.
Kubernetes v1.36 includes a couple of deprecations.

### Deprecation of Service .spec.externalIPs {#deprecate-service-spec-externalips}

With this release, the `externalIPs` field in Service `spec` is deprecated. This means the functionality exists, but will no longer function in a **future** version of Kubernetes. You should plan to migrate if you currently rely on that field.
This field has been a known security headache for years,
enabling man-in-the-middle attacks on your cluster traffic, as documented in [CVE-2020-8554](https:/github.com/kubernetes/kubernetes/issues/97076).
From Kubernetes v1.36 and onwards, you will see deprecation warnings when using it, with full removal planned for v1.43.

If your Services still lean on `externalIPs`, consider using LoadBalancer services for cloud-managed ingress,
NodePort for simple port exposure, or [Gateway API](https://gateway-api.sigs.k8s.io/) for a more flexible and secure way to handle external traffic.

For more details on this field and its deprecation, refer to [External IPs](/docs/concepts/services-networking/service/#external-ips) or read
[KEP-5707: Deprecate service.spec.externalIPs](https://kep.k8s.io/5707).

### Removal of the `gitRepo` volume driver {#remove-gitrepo-volume-driver}

The `gitRepo` volume type has been deprecated since v1.11. For Kubernetes v1.36, the `gitRepo` volume plugin is
permanently disabled and cannot be turned back on. This change protects clusters from a critical security issue where
using `gitRepo` could let an attacker run code as root on the node.

Although `gitRepo` has been deprecated for years and better alternatives have been recommended,
it was still technically possible to use it in previous releases.
From v1.36 onward, that path is closed for good, so any existing workloads depending on `gitRepo` will need to migrate to
supported approaches such as init containers or external `git-sync` style tools.

For more details on this removal, refer to [KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040)

## Release notes

Check out the full details of the Kubernetes v1.36 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md).

## Availability

Kubernetes v1.36 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.36.0) or on the [Kubernetes download page](https://kubernetes.io/releases/download/).

To get started with Kubernetes, check out [these tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). 
You can also easily [install v1.36 using kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is 
made up of dedicated community volunteers who work together to build the many pieces that make up the 
Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, 
from the code itself to its documentation and project management.

We would like to thank the entire [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.36 release to our community. 
The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over 
several release cycles. A very special thanks goes out to our release lead, Ryota Sawada, 
for guiding us through a successful release cycle, for his hands-on approach to solving challenges, 
and for bringing the energy and care that drives our community forward.

## Project Velocity

The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of 
Kubernetes and various sub-projects. This includes everything from individual contributions to the number of 
companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

During the v1.36 release cycle, which spanned 15 weeks from 12th January 2026 to 22nd April 2026, 
Kubernetes received contributions from as many as 106 different companies and 491 individuals. 
In the wider cloud native ecosystem, the figure goes up to 370 companies, counting 2235 total contributors.

Note that “contribution” counts when someone makes a commit, code review, comment, creates an issue or PR, 
reviews a PR (including blogs and documentation) or comments on issues and PRs.
If you are interested in contributing, visit [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor website.

Source for this data:
- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)


## Events Update

Explore upcoming Kubernetes and cloud native events, including KubeCon + CloudNativeCon, KCD, 
and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community!

**April 2026**
- KCD - [Kubernetes Community Days: Guadalajara](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-2026/cohost-kcd-guadalajara/): April 18, 2026 | Guadalajara, Mexico

**May 2026**
- KCD - [Kubernetes Community Days: Toronto](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-2026/): May 13, 2026 | Toronto, Canada
- KCD - [Kubernetes Community Days: Texas](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-2026/cohost-kcd-texas/): May 15, 2026 | Austin, USA
- KCD - [Kubernetes Community Days: Istanbul](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2026/): May 15, 2026 | Istanbul, Turkey
- KCD - [Kubernetes Community Days: Helsinki](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/): May 20, 2026 | Helsinki, Finland
- KCD - [Kubernetes Community Days: Czech & Slovak](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-prague-2026/): May 21, 2026 | Prague, Czechia
 
**June 2026**
- KCD - [Kubernetes Community Days: New York](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2026/): June 10, 2026 | New York, USA
- [KubeCon + CloudNativeCon India 2026: June 18-19, 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/) | Mumbai, India

**July 2026**
- [KubeCon + CloudNativeCon Japan 2026: July 29-30, 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/) | Yokohama, Japan

**September 2026**
- [KubeCon + CloudNativeCon China 2026: September 8-9, 2026](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/) | Shanghai, China

**October 2026**
- KCD - [Kubernetes Community Days: UK: Oct 19, 2026](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/) | Edinburgh, UK

**November 2026**
- KCD - [Kubernetes Community Days: Porto](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/): Nov 19, 2026 | Porto, Portugal
- [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): Nov 9-12, 2026 | Salt Lake, USA

You can find the latest event details [here](https://community.cncf.io/events/#/list).

## Upcoming Release Webinar

Join members of the Kubernetes v1.36 Release Team on **Wednesday, May 20th 2026 at 4:00 PM (UTC)** to learn about the release highlights
of this release. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v136-release/) on the CNCF Online Programs site.


## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), 
and through the channels below. Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](https://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)