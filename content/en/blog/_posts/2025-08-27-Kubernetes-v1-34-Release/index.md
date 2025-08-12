---  
layout: blog
title: 'Kubernetes v1.34: RELEASE NAME'
date: 2025-08-27T10:30:00-08:00
draft: true
evergreen: true
slug: kubernetes-v1-34-release
author: >
  [Kubernetes v1.34 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
---

**Editors:** Agustina Barbetta, Alejandro Josue Leon Bellido, Graziano Casto, Melony Qin, Dipesh Rawat

Similar to previous releases, the release of Kubernetes v1.34 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 58 enhancements. Of those enhancements, 23 have graduated to Stable, 22 are entering Beta, and 13 have graduated to Alpha.

There are no deprecations or removals in this release.

## Release theme and logo

\<TODO RELEASE THEME AND LOGO\>

## Spotlight on key updates

Kubernetes v1.34 is packed with new features and improvements. Here are a few select updates the Release Team would like to highlight!

### Stable: Automated cgroup driver detection

Historically, configuring the correct cgroup driver has been a pain point for users running Kubernetes clusters. This feature instructs the `kubelet` to ask the CRI implementation which cgroup driver to use. It was introduced in v1.28 and has graduated to stable in v1.34.  
The `kubelet` command line flag `--cgroup-driver` (and its alternative `cgroupDriver` in KubeletConfiguration) is marked as deprecated and in two releases or later it will be removed. This will make it impossible to use Kubernetes with the containerd 1.X versions. The timeline of this deprecation is aligned with containerd 1.7 EOL. This is an early warning that if you are using containerd 1.X, consider switching to 2.0+ soon.

This work was done as part of [KEP \#4033](https://kep.k8s.io/4033) led by SIG Node.

### Beta: Projected ServiceAccount tokens for `kubelet` image credential providers

The `kubelet` credential providers, used for pulling private container images, traditionally relied on long-lived secrets stored on the node or in the cluster. This approach increased security risks and management overhead, as these credentials were not tied to the specific workload and did not rotate automatically.  
To solve this, the `kubelet` can now request short-lived, audience-bound ServiceAccount tokens for authenticating to container registries. This allows image pulls to be authorized based on the Pod's own identity rather than a node-level credential.  
The primary benefit is a significant security improvement. It eliminates the need for long-lived secrets for image pulls, reducing the attack surface and simplifying credential management for both administrators and developers

This work was done as part of [KEP \#4412](https://kep.k8s.io/4412) led by SIG Auth.

### \<Stable/Beta/Alpha\>: \<THEME 3\>

\<Pick a highlight from below and promote to spotlight?\>

### \<Stable/Beta/Alpha\>: \<THEME 4\>

\<Pick a highlight from below and promote to spotlight?\>

### \<Stable/Beta/Alpha\>: \<THEME 5\>

\<Pick a highlight from below and promote to spotlight?\>

## Features graduating to Stable

*This is a selection of some of the improvements that are now stable following the v1.34 release.*

### Delayed creation of Job’s replacement pods 

By default, when a Pod enters a terminating state, the Job controller immediately creates a replacement Pod. Therefore, both Pods are running at the same time. This scenario is problematic for popular machine learning frameworks, such as TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/), which require at most one Pod running at the same time, for a given index.  
This feature introduces `.spec.podReplacementPolicy` in Jobs. You may choose to create replacement Pods only when the terminating Pod is fully terminal (has `.status.phase: Failed`). To do this, set `.spec.podReplacementPolicy: Failed`.  
Introduced as alpha in v1.28, this feature has graduated to stable in v1.34.

This work was done as part of [KEP \#3939](https://kep.k8s.io/3939) led by SIG Apps.

### Recover from volume expansion failure

This feature allows users to cancel volume expansions that are unsupported by the underlying storage provider, and retry volume expansion with smaller values that may succeed.  
Introduced as alpha in v1.23, this feature has graduated to stable in v1.34.

This work was done as part of [KEP \#1790](https://kep.k8s.io/1790) led by SIG Storage.

### VolumeAttributesClass for volume modification

[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) has graduated to stable in v1.34. VolumeAttributesClass is a generic, Kubernetes-native API for modifying volume parameters like provisioned IO. It allows workloads to vertically scale their volumes on-line to balance cost and performance, if supported by their provider.  
Like all new volume features in Kubernetes, this API is implemented via the [container storage interface (CSI)](https://kubernetes-csi.github.io/docs/). Your provisioner-specific CSI driver must support the new ModifyVolume API which is the CSI side of this feature.

This work was done as part of [KEP \#3751](https://kep.k8s.io/3751) led by SIG Storage.

### Structured authentication configuration

A formal configuration file for authentication in the Kubernetes API server was introduced in v1.29, moving away from the previous reliance on a large set of command-line flags. The AuthenticationConfiguration object allows administrators to define and manage authentication methods, such as multiple OIDC providers, in a structured and dynamic way. This change significantly improves the manageability and auditability of the cluster's authentication settings and has graduated to stable in v1.34.

This work was done as part of [KEP \#3331](https://kep.k8s.io/3331) led by SIG Auth.

### Finer-grained authorization based on selectors

This feature makes it possible for authorizers, including webhooks and the node authorizer, to make decisions on field and label selectors in incoming requests. When you send **List**, **Watch** or **DeleteCollection** requests with selectors, the authorization layer can now evaluate access with that additional context. 

For example, an authorization policy can now limit a request to list only pods with a specific `.spec.nodeName`, or reject requests that attempt to access resources with certain labels. This change supports more granular control in environments like per-node isolation or custom multi-tenant setups.

This work was done as part of [KEP \#4601](https://kep.k8s.io/4601) led by SIG Auth.

### Restrict anonymous requests with fine-grained controls

Instead of fully enabling or disabling anonymous access, you can now configure a strict list of endpoints where unauthenticated requests are allowed. This provides a safer alternative for clusters that rely on anonymous access to health or bootstrap endpoints like `/healthz`, `/readyz`, or `/livez`.

With this feature, accidental RBAC misconfigurations that grant broad access to anonymous users can be avoided without requiring changes to external probes or bootstrapping tools.

This work was done as part of [KEP \#4633](https://kep.k8s.io/4633) led by SIG Auth.

### More efficient requeueing through plugin-specific callbacks

The `kube-scheduler` can now make more accurate decisions about when to retry scheduling Pods that were previously unschedulable. Each scheduling plugin can now register callback functions that tell the scheduler whether an incoming cluster event is likely to make a rejected Pod schedulable again.

This reduces unnecessary retries and improves overall scheduling throughput \- especially in clusters using dynamic resource allocation. The feature also lets certain plugins skip the usual backoff delay when it is safe to do so, making scheduling faster in specific cases.

This work was done as part of [KEP \#4247](https://kep.k8s.io/4247) led by SIG Scheduling.

### The core of DRA is GA

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) provides a flexible way to categorize, request, and use devices like GPUs or custom hardware in your Kubernetes cluster.

Since the v1.30 release, DRA has been based around claiming devices using *structured parameters* that are opaque to the core of Kubernetes. This enhancement took inspiration from dynamic provisioning for storage volumes. DRA with structured parameters relies on a set of supporting API kinds: ResourceClaim, DeviceClass, ResourceClaimTemplate, and ResourceSlice API types under `resource.k8s.io`, while extending the `.spec` for Pods with a new `resourceClaims` field.  
The `resource.k8s.io/v1` APIs have graduated to stable and are now available by default.

This work was done as part of [KEP \#4381](https://kep.k8s.io/4381) led by WG Device Management.

### Ordered Namespace deletion

Semi-random resource deletion order can create security gaps or unintended behavior, such as Pods persisting after their associated NetworkPolicies are deleted.  
This improvement introduces a more structured deletion process for Kubernetes [namespaces](/docs/concepts/overview/working-with-objects/namespaces/) to ensure secure and deterministic resource removal. By enforcing a structured deletion sequence that respects logical and security dependencies, this approach ensures Pods are removed before other resources.   
This feature was introduced in Kubernetes v1.33 and graduated to stable in v1.34, improving security and reliability by mitigating risks from non-deterministic deletions.

This work was done as part of [KEP \#5080](https://kep.k8s.io/5080) led by SIG API Machinery.

### Streaming `LIST` responses

Handling large `LIST` responses in Kubernetes previously posed a significant scalability challenge. When clients requested extensive resource lists, such as thousands of Pods or Custom Resources, the API server was required to serialize the entire collection of objects into a single, large memory buffer before sending it. This process created substantial memory pressure and could lead to performance degradation, impacting the overall stability of the cluster.  
To address this limitation, a streaming encoding mechanism for `LIST` responses has been introduced and is now a stable feature. The primary benefit of this approach is the avoidance of large memory allocations on the API server, resulting in a much smaller and more predictable memory footprint. Consequently, the cluster becomes more resilient and performant, especially in large-scale environments where frequent requests for extensive resource lists are common.

This work was done as part of [KEP \#5116](https://kep.k8s.io/5116) led by SIG API Machinery.

### Consistent reads from cache

Kubernetes `GET` and `LIST` requests are guaranteed to be consistent reads if the  
`resourceVersion` parameter is not provided. Consistent reads are served from  
etcd using a quorum read. But often the watch cache contains sufficiently up-to-date data to serve the read request, and could serve it far more efficiently.  
This feature guarantees that `LIST` requests served from the API server's watch cache are consistent with the requested resource version. This eliminates stale reads and provides stronger data consistency for all clients, simplifying the logic in controllers and operators.

This work was done as part of [KEP \#2340](https://kep.k8s.io/2340) led by SIG API Machinery.

### Resilient watchcache initialization

\<TODO 1-2 PARAGRAPH DESCRIPTION OF CHANGE\>

This work was done as part of [KEP \#4568](https://kep.k8s.io/4568) led by SIG API Machinery.

### Relaxing DNS search path validation

Previously, the strict validation of a Pod's DNS `search` path in Kubernetes often created integration challenges in complex or legacy network environments. This restrictiveness could block configurations that were necessary for an organization's infrastructure, forcing administrators to implement difficult workarounds.  
To address this, relaxed DNS validation was introduced as alpha in v1.32. This allows administrators to bypass the strict checks and apply the search paths required by their environment. The primary benefit is crucial flexibility, improving interoperability and making it significantly easier to adopt Kubernetes within organizations that have pre-existing, complex DNS structures. This feature has graduated to stable in v1.34.

This work was done as part of [KEP \#4427](https://kep.k8s.io/4427) led by SIG Network.

### Support for Direct Service Return (DSR) in Windows `kube-proxy`

DSR provides performance optimizations by allowing return traffic routed through load balancers to bypass the load balancer and respond directly to the client, reducing load on the load balancer and improving overall latency. For information on DSR on Windows, read [Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).  
Initially introduced in v1.14, this feature has graduated to stable in v1.34.

This work was done as part of [KEP \#5100](https://kep.k8s.io/5100) led by SIG Windows.

### Sleep action for Container lifecycle hooks

A Sleep action for containers’ PreStop and PostStart lifecycle hooks was introduced to provide a straightforward way to manage graceful shutdowns and improve overall container lifecycle management.  
The Sleep action allows containers to pause for a specified duration after starting or before termination. Using a negative or zero sleep duration returns immediately, resulting in a no-op.  
The Sleep action was introduced in Kubernetes v1.29, with zero value support added in v1.32. Both features graduated to stable in v1.34.

This work was done as part of [KEP \#3960](https://kep.k8s.io/3960) and [KEP \#4818](https://kep.k8s.io/4818) led by SIG Node.

### Node swap support

Historically, the lack of swap support in Kubernetes could lead to workload instability, as nodes under memory pressure often had to terminate processes abruptly. This particularly affected applications with large but infrequently accessed memory footprints and prevented more graceful resource management.

To address this, configurable per-node swap support was introduced in v1.22. It has progressed through alpha and beta stages and has graduated to stable in v1.34. The primary mode, `LimitedSwap`, allows Pods to use swap within their existing memory limits, providing a direct solution to the problem.

This feature improves workload stability and allows for more efficient resource utilization. It enables clusters to support a wider variety of applications, especially in resource-constrained environments, though administrators must consider the potential performance impact of swapping.

This work was done as part of [KEP \#2400](https://kep.k8s.io/2400) led by SIG Node.

### `kubelet` distributed tracing

The internal operations of the `kubelet` have been historically difficult to observe, making it challenging for administrators to debug issues occurring at the node level. This lack of deep visibility complicated the process of diagnosing performance bottlenecks, understanding Pod startup latency, and analyzing failures within the node agent.

To address this visibility gap, distributed tracing capabilities are introduced directly into the `kubelet` using the OpenTelemetry standard. By enabling this feature, operators can export detailed trace data to their observability backends. This provides an unprecedented level of insight, allowing for the precise tracing of requests related to the Pod lifecycle, volume management, and other critical functions, which is essential for effective debugging and performance analysis.

This work was done as part of [KEP \#2831](https://kep.k8s.io/2831) led by SIG Node.

### Allow special characters in environment variables

The environment variable validation rules in Kubernetes have been relaxed to allow nearly all printable ASCII characters, excluding \=. This change supports scenarios where workloads require nonstandard characters in variable names \- for example, frameworks like .NET Core that use :  to represent nested config paths.

The relaxed validation applies to environment variables defined directly in Pod spec, as well as those injected using envFrom references to ConfigMaps and Secrets.

This work was done as part of [KEP \#4369](https://kep.k8s.io/4369) led by SIG Node.

### Taint management is separated from Node lifecycle

Historically, the `TaintManager`'s logic for applying NoSchedule and NoExecute taints to nodes based on their condition (e.g., NotReady, Unreachable) was tightly coupled with the `NodeLifecycleController`. This tight coupling made the code harder to maintain and test, and it also limited the flexibility of the taint-based eviction mechanism.  
This KEP refactors the `TaintManager` into its own separate controller within the Kubernetes controller manager. It is an internal architectural improvement designed to increase code modularity and maintainability. This change allows the logic for taint-based evictions to be tested and evolved independently, but it has no direct user-facing impact on how taints are used.

This work was done as part of [KEP \#3902](https://kep.k8s.io/3902) led by SIG Node.

## New features in Beta

*This is a selection of some of the improvements that are now beta following the v1.34 release.*

### `.kuberc` file for `kubectl` user preferences

A `.kuberc` configuration file allows you to define preferences for `kubectl`, such as default options and command aliases. Unlike the kubeconfig file, the `.kuberc` configuration file does not contain cluster details, usernames or passwords.  
This feature was introduced as alpha in v1.33, gated behind the environment variable `KUBECTL_KUBERC`. It has graduated to beta in v1.34 and is enabled by default.

This work was done as part of [KEP \#3104](https://kep.k8s.io/3104) led by SIG CLI.

### External ServiceAccount token signing

\<TODO 1-2 PARAGRAPH DESCRIPTION OF CHANGE\>

This work was done as part of [KEP \#740](https://kep.k8s.io/740) led by SIG Auth.

### DRA features in beta

#### Admin access for secure resource monitoring

DRA supports controlled administrative access through the `adminAccess` field in ResourceClaims or ResourceClaimTemplates, allowing cluster operators to access devices already in use by others for monitoring or diagnostics. This privileged mode is restricted to users authorized to create such objects in namespaces labeled with resource.k8s.io/admin-access: "true", ensuring regular workloads remain unaffected. This feature graduated to beta in v1.34, providing secure introspection capabilities while maintaining isolation through namespace-based authorization checks.

This work was done as part of [KEP \#5018](https://kep.k8s.io/5018) led by WG Device Management and SIG Auth.

#### Prioritized alternatives in ResourceClaims and ResourceClaimTemplates

While a workload might run best on a single high-performance GPU, it might also be able to run on two mid-level GPUs.  
With the feature gate `DRAPrioritizedList` (now enabled by default), ResourceClaims and ResourceClaimTemplates get a new field named `firstAvailable`. This field is an ordered list that allows users to specify that a request may be satisfied in different ways, including allocating nothing at all if specific hardware is not available. The scheduler will attempt to satisfy the alternatives in the list in order, so the workload will be allocated the best set of devices available in the cluster.

This work was done as part of [KEP \#4816](https://kep.k8s.io/4816) led by WG Device Management.

#### The `kubelet` reports allocated DRA resources

The `kubelet`'s API has been updated to report on Pod resources allocated through DRA. This allows node monitoring agents to discover the allocated DRA resources for Pods on a node. Additionally, it enables node components to use the PodResourcesAPI and leverage this DRA information when developing new features and integrations.  
Starting from Kubernetes v1.34, this feature is enabled by default.

This work was done as part of [KEP \#3695](https://kep.k8s.io/3695) led by WG Device Management.

### `kube-scheduler` non-blocking API calls

The `kube-scheduler` makes blocking API calls during scheduling cycles, creating performance bottlenecks. This feature introduces asynchronous API handling through a prioritized queue system with request deduplication, allowing the scheduler to continue processing Pods while API operations complete in the background. Key benefits include reduced scheduling latency, prevention of scheduler thread starvation during API delays, and immediate retry capability for unschedulable Pods. The implementation maintains backward compatibility and adds metrics for monitoring pending API operations.

This work was done as part of [KEP \#5229](https://kep.k8s.io/5229) led by SIG Scheduling.

### Mutating admission policies

Mutating admission policies offer a declarative, in-process alternative to mutating admission webhooks. This feature leverages CEL's object instantiation and JSON Patch strategies, combined with Server Side Apply’s merge algorithms.  
This significantly simplifies admission control by allowing administrators to define mutation rules directly in the API server.  
Introduced as alpha in v1.32, mutating admission policies has graduated to beta in v1.34.

This work was done as part of [KEP \#3962](https://kep.k8s.io/3962) led by SIG API Machinery.

### Snapshottable API server cache

The `kube-apiserver`'s caching mechanism (watchcache) efficiently serves requests for the latest observed state. However, `LIST` requests for previous states (for example, via pagination or by specifying a `resourceVersion`) often bypass this cache and are served directly from etcd. This direct etcd access significantly increases performance costs and can lead to stability issues, particularly with large resources, due to memory pressure from transferring large data blobs.  
With the `ListFromCacheSnapshot` feature gate enabled by default, `kube-apiserver` will attempt to serve the response from snapshots if one is available with `resourceVersion` older than requested. The `kube-apiserver` starts with no snapshots, creates a new snapshot on every watch event, and keeps them until it detects etcd is compacted or if cache is full with events older than 75 seconds. If the provided `resourceVersion` is unavailable, the server will fallback to etcd.

This work was done as part of [KEP \#4988](https://kep.k8s.io/4988) led by SIG API Machinery.

### Tooling for declarative validation of Kubernetes-native types

Kubernetes API validation rules are currently written by hand, which makes them difficult for users to access directly, review, maintain, and test.  
Declarative validation benefits Kubernetes maintainers by making API development, maintenance, and review easier while enabling programmatic inspection for better tooling and documentation. For Kubernetes users, it streamlines adding new fields through simple IDL tags rather than complex validation functions, speeds up API creation by automating validation boilerplate, and provides more relevant error messages by performing validation on versioned types.​​​​​​​​​​​​​​​​  
This enhancement graduated to beta in v1.33 and continues as beta in v1.34, it brings CEL-based validation rules to native Kubernetes types. It allows for more granular and declarative validation to be defined directly in the type definitions, improving API consistency and developer experience.

This work was done as part of [KEP \#5073](https://kep.k8s.io/5073) led by SIG API Machinery.

### Streaming Informers for `LIST` Requests

The streaming informers feature, which has been in beta since v1.32, gains further beta refinements in v1.34. This capability allows `LIST` requests to return data as a continuous stream of objects from the API server’s watch cache, rather than assembling paged results directly from etcd. By reusing the same mechanics used for `WATCH` operations, the API server can serve large datasets while keeping memory usage steady and avoiding allocation spikes that can affect stability.

In this release, the `WatchList` feature gate is now enabled by default for the `kube-apiserver`, and `WatchListClient` is enabled by default for `kube-controller-manager`. These changes strengthen integration with informer workflows, reduce memory pressure during large list operations, and improve reliability under sustained load, making `LIST` streaming more predictable and efficient.

This work was done as part of [KEP \#3157](https://kep.k8s.io/3157) led by SIG API Machinery.

### `PreferSameZone` and `PreferSameNode` traffic distribution for Services

The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints.  
[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. `PreferSameZone` is an alias for the existing `PreferClose` to clarify its semantics. `PreferSameNode` allows connections to be delivered to a local endpoint when possible, falling back to a remote endpoint when not possible.  
This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. It has graduated to beta in v1.34 and is enabled by default. 

This work was done as part of [KEP \#3015](https://kep.k8s.io/3015) led by SIG Network.

### Pod-level resource requests and limits

Defining resource needs for Pods with multiple containers has been challenging, as requests and limits could only be set on a per-container basis. This forced developers to either over-provision resources for each container or meticulously divide the total desired resources, making configuration complex and often leading to inefficient resource allocation.  
To simplify this, the ability to specify resource requests and limits at the Pod level was introduced. This allows developers to define an overall resource budget for a Pod, which is then shared among its constituent containers. This feature was introduced as alpha in v1.32 and has graduated to beta in v1.34.  
The primary benefit is a more intuitive and straightforward way to manage resources for multi-container Pods. It ensures that the total resources used by all containers do not exceed the Pod's defined limits, leading to better resource planning, more accurate scheduling, and more efficient utilization of cluster resources.

This work was done as part of [KEP \#2837](https://kep.k8s.io/2837) led by SIG Autoscaling.

### Graceful node shutdown for Windows nodes

The `kubelet` on Windows nodes can now detect system shutdown events and begin graceful termination of running pods. This mirrors existing behavior on Linux and helps ensure workloads exit cleanly during planned shutdowns or restarts.   
When the system begins shutting down, the `kubelet` reacts by using standard termination logic. It respects the configured lifecycle hooks and grace periods, giving pods time to stop before the node powers off. The feature relies on Windows pre-shutdown notifications to coordinate this process. This enhancement improves workload reliability during maintenance, restarts, or system updates. It is now in beta and enabled by default.

This work was done as part of [KEP \#4802](https://kep.k8s.io/4802) led by SIG Windows.

### In-Place Update of Pod Resources

\<TODO 1-2 PARAGRAPH DESCRIPTION OF CHANGE\>

This work was done as part of [KEP \#1287](https://kep.k8s.io/1287) led by SIG Node.

## New features in Alpha

*This is a selection of some of the improvements that are now alpha following the v1.34 release.*

### Support for KYAML: a Kubernetes dialect of YAML

KYAML aims to be a safer and less ambiguous YAML subset, and was designed specifically for Kubernetes. Whatever version of Kubernetes you use, you'll be able to use KYAML for writing manifests and/or Helm charts.   
KYAML addresses specific challenges with both YAML and JSON. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion (for example: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys.   
You can write KYAML and pass it as an input to any version of `kubectl`, because all KYAML files are also valid as YAML. With `kubectl` v1.34, we expect you'll also be able to request KYAML output (as in `kubectl get -o kyaml …`). If you prefer, you can still request the output in JSON or YAML format.

This work was done as part of [KEP \#5295](https://kep.k8s.io/5295) led by SIG CLI.

### Pod certificates for mTLS authentication

Authenticating workloads within a cluster, especially for communication with the API server, has primarily relied on ServiceAccount tokens. While effective, these tokens aren't always ideal for establishing a strong, verifiable identity for mutual TLS (mTLS) and can present challenges when integrating with external systems that expect certificate-based authentication.  
A built-in mechanism for Pods to obtain X.509 certificates was introduced in v1.34. The `kubelet` can now request and manage certificates for Pods, which can then be used to authenticate to the Kubernetes API server and other services using mTLS.  
The primary benefit is a more robust and flexible identity mechanism for Pods. It provides a native way to implement strong mTLS authentication without relying solely on bearer tokens, aligning Kubernetes with standard security practices and simplifying integrations with certificate-aware observability and security tooling.

This work was done as part of [KEP \#4317](https://kep.k8s.io/4317) led by SIG Auth.

### PodSecurityAdmission to control `host` in probes and lifecycle handlers

The `host` field within probes and lifecycle handlers allows users to specify an entity other than the `podIP` for the `kubelet` to probe. However, this opens it up for security attacks since the `host` field can be set to any value in the system, including security sensitive external hosts or localhost on the node.   
This improvement introduces a Pod Security Admission policy to prevent SSRF attacks by warning or blocking users when `host` field is used.

This work was done as part of [KEP \#4940](https://kep.k8s.io/4940) led by SIG Auth.

### Use `.status.nominatedNodeName` to express Pod placement

When the `kube-scheduler` takes time to bind Pods to Nodes, cluster autoscalers may not understand that a Pod will be bound to a specific Node. Consequently, they may mistakenly consider the Node as underutilized and delete it.  
To address this issue, the `kube-scheduler` can use `.status.nominatedNodeName` not only to indicate ongoing preemption but also to express Pod placement intentions. By enabling the `NominatedNodeNameForExpectation` feature gate, the scheduler uses this field to indicate where a Pod will be bound. This exposes internal reservations to help external components make informed decisions.

This work was done as part of [KEP \#5278](https://kep.k8s.io/5278) led by SIG Scheduling.

### DRA features in alpha

#### Resource Health Status for DRA

It can be difficult to know when a Pod is using a device that has failed or is temporarily unhealthy, which makes troubleshooting Pod crashes challenging or impossible.  
Resource Health Status for DRA improves observability by exposing the health status of devices allocated to a Pod in the Pod’s status. This makes it easier to identify the cause of Pod issues related to unhealthy devices and respond appropriately.  
To enable this functionality, the `ResourceHealthStatus` feature gate must be enabled, and the DRA driver must implement the `DRAResourceHealth` gRPC service.

This work was done as part of [KEP \#4680](https://kep.k8s.io/4680) led by WG Device Management.

#### Extended resource mapping

Extended resource mapping provides a simpler alternative to DRA's expressive and flexible approach by offering a straightforward way to describe resource capacity and consumption. This feature enables cluster administrators to advertise DRA-managed resources as *extended resources*, allowing application developers and operators to continue using the familiar container’s `.spec.resources` syntax to consume them.  
This enables existing workloads to adopt DRA without modifications, simplifying the transition to DRA for both application developers and cluster administrators.

This work was done as part of [KEP \#5004](https://kep.k8s.io/5004) led by WG Device Management.

#### DRA Consumable Capacity

Kubernetes v1.33 added support for resource drivers to advertise slices of a device that are available, rather than exposing the entire device as an all-or-nothing resource. However, this approach couldn't handle scenarios where device drivers manage fine-grained, dynamic portions of a device resource based on user demand, or share those resources independently of ResourceClaims, which are restricted by their spec and namespace.  
Introduced as alpha in v1.34, the `DRAConsumableCapacity` feature gate allows resource drivers to share the same device, or even a slice of a device, across multiple ResourceClaims or across multiple DeviceRequests. The feature also extends the scheduler to support allocating portions of device resources as defined in the `capacity` field.  
This DRA feature improves device sharing across namespaces and claims, tailoring it to Pod needs. It enables drivers to enforce capacity limits, enhances scheduling, and supports new use cases like bandwidth-aware networking and multi-tenant sharing.

This work was done as part of [KEP \#5075](https://kep.k8s.io/5075) led by WG Device Management.

#### Device binding conditions

The Kubernetes scheduler gets more reliable by delaying binding a Pod to a Node until its required external resources, such as attachable devices or FPGAs, are confirmed to be ready.  
This delay mechanism is implemented in the [PreBind phase](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind) of the scheduling framework. During this phase, the scheduler checks whether all required device conditions are satisfied before proceeding with binding. This enables coordination with external device controllers, ensuring more robust, predictable scheduling.

This work was done as part of [KEP \#5007](https://kep.k8s.io/5007) led by WG Device Management.

### Container restart rules

Currently, all containers within a Pod will follow the same `.spec.restartPolicy` when exited or crashed. However, Pods that run multiple containers might have different restart requirements for each container. For example, for init containers used to perform initialization, you may not want to retry initialization if they fail. Similarly, in ML research environments with long-running training workloads, containers that fail with retriable exit codes should restart quickly in place, rather than triggering Pod recreation and losing progress.  
Kubernetes v1.34 introduces the `ContainerRestartRules` feature gate. When enabled, a `restartPolicy` can be specified for each container within a Pod. A `restartPolicyRules` list can also be defined to override `restartPolicy` based on the last exit code. This provides the fine-grained control needed to handle complex scenarios and better utilization of compute resources. 

This work was done as part of [KEP \#5307](https://kep.k8s.io/5307) led by SIG Node.

## Graduations, deprecations, and removals in v1.34

### Graduations to stable

This lists all the features that graduated to stable (also known as *general availability*). For a full list of updates including new features and graduations from alpha to beta, see the release notes.

This release includes a total of 23 enhancements promoted to stable:

* [Allow almost all printable ASCII characters in environment variables](https://kep.k8s.io/4369)
* [Allow for recreation of pods once fully terminated in the job controller](https://kep.k8s.io/3939)
* [Allow zero value for Sleep Action of PreStop Hook](https://kep.k8s.io/4818)
* [API Server tracing](https://kep.k8s.io/647)
* [AppArmor support](https://kep.k8s.io/24)
* [Authorize with Field and Label Selectors](https://kep.k8s.io/4601)
* [Consistent Reads from Cache](https://kep.k8s.io/2340)
* [Decouple TaintManager from NodeLifecycleController](https://kep.k8s.io/3902)
* [Discover cgroup driver from CRI](https://kep.k8s.io/4033)
* [DRA: structured parameters](https://kep.k8s.io/4381)
* [Introducing Sleep Action for PreStop Hook](https://kep.k8s.io/3960)
* [Kubelet OpenTelemetry Tracing](https://kep.k8s.io/2831)
* [Kubernetes VolumeAttributesClass ModifyVolume](https://kep.k8s.io/3751)
* [Node memory swap support](https://kep.k8s.io/2400)
* [Only allow anonymous auth for configured endpoints](https://kep.k8s.io/4633)
* [Ordered namespace deletion](https://kep.k8s.io/5080)
* [Per-plugin callback functions for accurate requeueing in kube-scheduler](https://kep.k8s.io/4247)
* [Relaxed DNS search string validation](https://kep.k8s.io/4427)
* [Resilient Watchcache Initialization](https://kep.k8s.io/4568)
* [Streaming Encoding for LIST Responses](https://kep.k8s.io/5116)
* [Structured Authentication Config](https://kep.k8s.io/3331)
* [Support for Direct Service Return (DSR) and overlay networking in Windows kube-proxy](https://kep.k8s.io/5100)
* [Support recovery from volume expansion failure](https://kep.k8s.io/1790)

### Deprecations and removals

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. However, **Kubernetes v1.34 does not include any removal or deprecation.**

## Release notes

Check out the full details of the Kubernetes v1.34 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md).

## Availability

Kubernetes v1.34 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.XX.0) or on the [Kubernetes download page](http:///releases/download/).

To get started with Kubernetes, check out these [interactive tutorials](http:///docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.34 using [kubeadm](http:///docs/setup/independent/create-cluster-kubeadm/).

## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

\<TODO RELEASE TEAM v1.34\>

## Project Velocity

\<TODO CHECKOUT THE DEVSTATS AND HIGHLIGHT SOME INTRESTING NUMBERS [https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1\&refresh=15m](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m), INCLUDE ANY INTERESTED DATA YOU FIND FOR THE CYCLE\>

## Event Update

Explore upcoming Kubernetes and cloud native events, including KubeCon \+ CloudNativeCon, KCD, and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community\!

**August 2025**

- [**KCD - Kubernetes Community Days:  Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/): Aug 28, 2025 | Bogotá, Colombia

**September 2025**

- [**KCD - Kubernetes Community Days: San Francisco Bay Area**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/): Sep 9, 2025 | San Francisco, USA
- [**KCD - Kubernetes Community Days: Washington DC**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2025/): Sep 16, 2025 | Washington, D.C., USA
- [**KCD - Kubernetes Community Days: Sofia**](https://community.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia/): Sep 18, 2025 | Sofia, Bulgaria
- [**KCD - Kubernetes Community Days: El Salvador**](https://community.cncf.io/events/details/cncf-kcd-el-salvador-presents-kcd-el-salvador/): Sep 20, 2025 | San Salvador, El Salvador

**October 2025**

- [**KCD - Kubernetes Community Days: Warsaw**](https://community.cncf.io/events/details/cncf-kcd-warsaw-presents-kcd-warsaw-2025/): Oct 9, 2025 | Warsaw, Poland
- [**KCD - Kubernetes Community Days: Edinburgh**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2025/): Oct 21, 2025 | Edinburgh, United Kingdom
- [**KCD - Kubernetes Community Days: Sri Lanka**](https://community.cncf.io/events/details/cncf-kcd-sri-lanka-presents-kcd-sri-lanka-2025/): Oct 26, 2025 | Colombo, Sri Lanka

**November 2025**

- [**KCD - Kubernetes Community Days: Porto**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2025/): Nov 3, 2025 | Porto, Portugal
- [**KubeCon + CloudNativeCon North America 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): Nov 10-13, 2025 | Atlanta, USA

**December 2025**

- [**KCD - Kubernetes Community Days: Suisse Romande**](https://community.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/): Dec 4, 2025 | Geneva, Switzerland

You can find the latest event details [here](https://community.cncf.io/events/#/list).

## Upcoming Release Webinar

Join members of the Kubernetes v1.34 Release Team on \<TODO RELEASE WEBINAR DATE AND TIME\>, to learn about the release highlights of this release. For more information and registration, visit the [event page](<TODO RELEASE WEBINAR LINK>) on the CNCF Online Programs site.

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Follow us on Bluesky [@Kubernetesio](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)