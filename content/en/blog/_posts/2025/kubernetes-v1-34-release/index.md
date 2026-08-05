---  
layout: blog
title: "Kubernetes v1.34: Of Wind & Will (O' WaW)"
date: 2025-08-27T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-34-release
author: >
  [Kubernetes v1.34 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
---

**Editors:** Agustina Barbetta, Alejandro Josue Leon Bellido, Graziano Casto, Melony Qin, Dipesh Rawat

Similar to previous releases, the release of Kubernetes v1.34 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 58 enhancements. Of those enhancements, 23 have graduated to Stable, 22 have entered Beta, and 13 have entered Alpha.

There are also some [deprecations and removals](#deprecations-and-removals) in this release; make sure to read about those.

## Release theme and logo

{{< figure src="k8s-v1.34.png" alt="Kubernetes v1.34 logo: Three bears sail a wooden ship with a flag featuring a paw and a helm symbol on the sail, as wind blows across the ocean" class="release-logo" >}}

A release powered by the wind around us — and the will within us.

Every release cycle, we inherit winds that we don't really control — the state
of our tooling, documentation, and the historical quirks of our project.
Sometimes these winds fill our sails, sometimes they push us sideways or die
down.

What keeps Kubernetes moving isn't the perfect winds, but the will of our
sailors who adjust the sails, man the helm, chart the courses and keep the ship
steady. The release happens not because conditions are always ideal, but because
of the people who build it, the people who release it, and the bears<sup>
^</sup>, cats, dogs, wizards, and curious minds who keep Kubernetes sailing
strong — no matter which way the wind blows.

This release, **Of Wind & Will (O' WaW)**, honors the winds that have shaped us,
and the will that propels us forward.

<sub>^ Oh, and you wonder why bears? Keep wondering!</sub>

## Spotlight on key updates

Kubernetes v1.34 is packed with new features and improvements. Here are a few select updates the Release Team would like to highlight!

### Stable: The core of DRA is GA

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA) 
enables more powerful ways to select, allocate, share, and configure 
GPUs, TPUs, NICs and other devices.

Since the v1.30 release, DRA has been based around claiming devices using 
*structured parameters* that are opaque to the core of Kubernetes. 
This enhancement took inspiration from dynamic provisioning for storage volumes. 
DRA with structured parameters relies on a set of supporting API kinds: 
ResourceClaim, DeviceClass, ResourceClaimTemplate, and ResourceSlice API types 
under `resource.k8s.io`, while extending the `.spec` for Pods with a new `resourceClaims` field.  
The `resource.k8s.io/v1` APIs have graduated to stable and are now available by default.

This work was done as part of [KEP \#4381](https://kep.k8s.io/4381) led by WG Device Management.

### Beta: Projected ServiceAccount tokens for `kubelet` image credential providers

The `kubelet` credential providers, used for pulling private container images, traditionally relied on long-lived Secrets stored on the node or in the cluster. This approach increased security risks and management overhead, as these credentials were not tied to the specific workload and did not rotate automatically.  
To solve this, the `kubelet` can now request short-lived, audience-bound ServiceAccount tokens for authenticating to container registries. This allows image pulls to be authorized based on the Pod's own identity rather than a node-level credential.  
The primary benefit is a significant security improvement. It eliminates the need for long-lived Secrets for image pulls, reducing the attack surface and simplifying credential management for both administrators and developers.

This work was done as part of [KEP \#4412](https://kep.k8s.io/4412) led by SIG Auth and SIG Node.

### Alpha: Support for KYAML, a Kubernetes dialect of YAML

KYAML aims to be a safer and less ambiguous YAML subset, and was designed specifically for Kubernetes. Whatever version of Kubernetes you use, starting from Kubernetes v1.34 you are able to use KYAML as a new output format for kubectl.
   
KYAML addresses specific challenges with both YAML and JSON. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion (for example: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). Meanwhile, JSON lacks comment support and has strict requirements for trailing commas and quoted keys. 
  
You can write KYAML and pass it as an input to any version of `kubectl`, because all KYAML files are also valid as YAML. With `kubectl` v1.34, you are also able to [request KYAML output](/docs/reference/kubectl/#syntax-1) (as in kubectl get -o kyaml …) by setting environment variable `KUBECTL_KYAML=true`. If you prefer, you can still request the output in JSON or YAML format.

This work was done as part of [KEP \#5295](https://kep.k8s.io/5295) led by SIG CLI.

## Features graduating to Stable

*This is a selection of some of the improvements that are now stable following the v1.34 release.*

### Delayed creation of Job’s replacement Pods 

By default, Job controllers create replacement Pods immediately when a Pod starts terminating, causing both Pods to run simultaneously. This can cause resource contention in constrained clusters, where the replacement Pod may struggle to find available nodes until the original Pod fully terminates. The situation can also trigger unwanted cluster autoscaler scale-ups.
Additionally, some machine learning frameworks like TensorFlow and [JAX](https://jax.readthedocs.io/en/latest/) require only one Pod per index to run at a time, making simultaneous Pod execution problematic. 
This feature introduces `.spec.podReplacementPolicy` in Jobs. You may choose to create replacement Pods only when the Pod is fully terminated (has `.status.phase: Failed`). To do this, set `.spec.podReplacementPolicy: Failed`.  
Introduced as alpha in v1.28, this feature has graduated to stable in v1.34.

This work was done as part of [KEP \#3939](https://kep.k8s.io/3939) led by SIG Apps.

### Recovery from volume expansion failure

This feature allows users to cancel volume expansions that are unsupported by the underlying storage provider, and retry volume expansion with smaller values that may succeed.  
Introduced as alpha in v1.23, this feature has graduated to stable in v1.34.

This work was done as part of [KEP \#1790](https://kep.k8s.io/1790) led by SIG Storage.

### VolumeAttributesClass for volume modification

[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) has graduated to stable in v1.34. VolumeAttributesClass is a generic, Kubernetes-native API for modifying volume parameters like provisioned IO. It allows workloads to vertically scale their volumes on-line to balance cost and performance, if supported by their provider.  
Like all new volume features in Kubernetes, this API is implemented via the [container storage interface (CSI)](https://kubernetes-csi.github.io/docs/). Your provisioner-specific CSI driver must support the new ModifyVolume API which is the CSI side of this feature.

This work was done as part of [KEP \#3751](https://kep.k8s.io/3751) led by SIG Storage.

### Structured authentication configuration

Kubernetes v1.29 introduced a configuration file format to manage API server client authentication, moving away from the previous reliance on a large set of command-line options.
The [AuthenticationConfiguration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration) kind allows administrators to support multiple JWT authenticators, CEL expression validation, and dynamic reloading.
This change significantly improves the manageability and auditability of the cluster's authentication settings - and has graduated to stable in v1.34.

This work was done as part of [KEP \#3331](https://kep.k8s.io/3331) led by SIG Auth.

### Finer-grained authorization based on selectors

Kubernetes authorizers, including webhook authorizers and the built-in node authorizer, can now make authorization decisions based on field and label selectors in incoming requests. When you send **list**, **watch** or **deletecollection** requests with selectors, the authorization layer can now evaluate access with that additional context. 

For example, you can write an authorization policy that only allows listing Pods bound to a specific `.spec.nodeName`.
The client (perhaps the kubelet on a particular node) must specify
the field selector that the policy requires, otherwise the request is forbidden.
This change makes it feasible to set up least privilege rules, provided that the client knows how to conform to the restrictions you set.
Kubernetes v1.34 now supports more granular control in environments like per-node isolation or custom multi-tenant setups.

This work was done as part of [KEP \#4601](https://kep.k8s.io/4601) led by SIG Auth.

### Restrict anonymous requests with fine-grained controls

Instead of fully enabling or disabling anonymous access, you can now configure a strict list of endpoints where unauthenticated requests are allowed. This provides a safer alternative for clusters that rely on anonymous access to health or bootstrap endpoints like `/healthz`, `/readyz`, or `/livez`.

With this feature, accidental RBAC misconfigurations that grant broad access to anonymous users can be avoided without requiring changes to external probes or bootstrapping tools.

This work was done as part of [KEP \#4633](https://kep.k8s.io/4633) led by SIG Auth.

### More efficient requeueing through plugin-specific callbacks

The `kube-scheduler` can now make more accurate decisions about when to retry scheduling Pods that were previously unschedulable. Each scheduling plugin can now register callback functions that tell the scheduler whether an incoming cluster event is likely to make a rejected Pod schedulable again.

This reduces unnecessary retries and improves overall scheduling throughput \- especially in clusters using dynamic resource allocation. The feature also lets certain plugins skip the usual backoff delay when it is safe to do so, making scheduling faster in specific cases.

This work was done as part of [KEP \#4247](https://kep.k8s.io/4247) led by SIG Scheduling.

### Ordered Namespace deletion

Semi-random resource deletion order can create security gaps or unintended behavior, such as Pods persisting after their associated NetworkPolicies are deleted.  
This improvement introduces a more structured deletion process for Kubernetes [namespaces](/docs/concepts/overview/working-with-objects/namespaces/) to ensure secure and deterministic resource removal. By enforcing a structured deletion sequence that respects logical and security dependencies, this approach ensures Pods are removed before other resources.   
This feature was introduced in Kubernetes v1.33 and graduated to stable in v1.34. The graduation improves security and reliability by mitigating risks from non-deterministic deletions, including the vulnerability described in [CVE-2024-7598](https://github.com/advisories/GHSA-r56h-j38w-hrqq).

This work was done as part of [KEP \#5080](https://kep.k8s.io/5080) led by SIG API Machinery.

### Streaming **list** responses

Handling large **list** responses in Kubernetes previously posed a significant scalability challenge. When clients requested extensive resource lists, such as thousands of Pods or Custom Resources, the API server was required to serialize the entire collection of objects into a single, large memory buffer before sending it. This process created substantial memory pressure and could lead to performance degradation, impacting the overall stability of the cluster.  
To address this limitation, a streaming encoding mechanism for collections (list responses)
has been introduced. For the JSON and Kubernetes Protobuf response formats, that streaming mechanism
is automatically active and the associated feature gate is stable.
The primary benefit of this approach is the avoidance of large memory allocations on the API server, resulting in a much smaller and more predictable memory footprint.
Consequently, the cluster becomes more resilient and performant, especially in large-scale environments where frequent requests for extensive resource lists are common.

This work was done as part of [KEP \#5116](https://kep.k8s.io/5116) led by SIG API Machinery.

### Resilient watch cache initialization

Watch cache is a caching layer inside `kube-apiserver` that maintains an eventually consistent cache of cluster state stored in etcd. In the past, issues could occur when the watch cache was not yet initialized during `kube-apiserver` startup or when it required re-initialization.

To address these issues, the watch cache initialization process has been made more resilient to failures, improving control plane robustness and ensuring controllers and clients can reliably establish watches. This improvement was introduced as beta in v1.31 and is now stable.

This work was done as part of [KEP \#4568](https://kep.k8s.io/4568) led by SIG API Machinery and SIG Scalability.

### Relaxing DNS search path validation

Previously, the strict validation of a Pod's DNS `search` path in Kubernetes often created integration challenges in complex or legacy network environments. This restrictiveness could block configurations that were necessary for an organization's infrastructure, forcing administrators to implement difficult workarounds.  
To address this, relaxed DNS validation was introduced as alpha in v1.32 and has now graduated to stable in v1.34. A common use case involves Pods that need to communicate with both internal Kubernetes services and external domains. By setting a single dot (`.`) as the first entry in the `searches` list of the Pod's `.spec.dnsConfig`, administrators can prevent the system's resolver from appending the cluster's internal search domains to external queries. This avoids generating unnecessary DNS requests to the internal DNS server for external hostnames, improving efficiency and preventing potential resolution errors.

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

### Linux node swap support

Historically, the lack of swap support in Kubernetes could lead to workload instability, as nodes under memory pressure often had to terminate processes abruptly. This particularly affected applications with large but infrequently accessed memory footprints and prevented more graceful resource management.

To address this, configurable per-node swap support was introduced in v1.22. It has progressed through alpha and beta stages and has graduated to stable in v1.34. The primary mode, `LimitedSwap`, allows Pods to use swap within their existing memory limits, providing a direct solution to the problem. By default, the `kubelet` is configured with `NoSwap` mode, which means Kubernetes workloads cannot use swap.

This feature improves workload stability and allows for more efficient resource utilization. It enables clusters to support a wider variety of applications, especially in resource-constrained environments, though administrators must consider the potential performance impact of swapping.

This work was done as part of [KEP \#2400](https://kep.k8s.io/2400) led by SIG Node.

### Allow special characters in environment variables

The environment variable validation rules in Kubernetes have been relaxed
to allow nearly all printable ASCII characters in variable names, excluding `=`.
This change supports scenarios where workloads require nonstandard characters in variable names - for example, frameworks like .NET Core that use `:` to represent nested configuration keys.

The relaxed validation applies to environment variables defined directly in Pod spec,
as well as those injected using `envFrom` references to ConfigMaps and Secrets.

This work was done as part of [KEP \#4369](https://kep.k8s.io/4369) led by SIG Node.

### Taint management is separated from Node lifecycle

Historically, the `TaintManager`'s logic for applying NoSchedule and NoExecute taints to nodes based on their condition (NotReady, Unreachable, etc.) was tightly coupled with the node lifecycle controller. This tight coupling made the code harder to maintain and test, and it also limited the flexibility of the taint-based eviction mechanism.
This KEP refactors the `TaintManager` into its own separate controller within the Kubernetes controller manager. It is an internal architectural improvement designed to increase code modularity and maintainability. This change allows the logic for taint-based evictions to be tested and evolved independently, but it has no direct user-facing impact on how taints are used.

This work was done as part of [KEP \#3902](https://kep.k8s.io/3902) led by SIG Scheduling and SIG Node.

## New features in Beta

*This is a selection of some of the improvements that are now beta following the v1.34 release.*

### Pod-level resource requests and limits

Defining resource needs for Pods with multiple containers has been challenging, 
as requests and limits could only be set on a per-container basis. 
This forced developers to either over-provision resources for each container or meticulously 
divide the total desired resources, making configuration complex and often leading to 
inefficient resource allocation.
To simplify this, the ability to specify resource requests and limits at the Pod level was introduced. 
This allows developers to define an overall resource budget for a Pod, 
which is then shared among its constituent containers. 
This feature was introduced as alpha in v1.32 and has graduated to beta in v1.34, 
with HPA now supporting pod-level resource specifications.

The primary benefit is a more intuitive and straightforward way to manage resources for multi-container Pods. 
It ensures that the total resources used by all containers do not exceed the Pod's defined limits, 
leading to better resource planning, more accurate scheduling, 
and more efficient utilization of cluster resources.

This work was done as part of [KEP \#2837](https://kep.k8s.io/2837) led by SIG Scheduling and SIG Autoscaling.

### `.kuberc` file for `kubectl` user preferences

A `.kuberc` configuration file allows you to define preferences for `kubectl`, such as default options and command aliases. Unlike the kubeconfig file, the `.kuberc` configuration file does not contain cluster details, usernames or passwords.  
This feature was introduced as alpha in v1.33, gated behind the environment variable `KUBECTL_KUBERC`. It has graduated to beta in v1.34 and is enabled by default.

This work was done as part of [KEP \#3104](https://kep.k8s.io/3104) led by SIG CLI.

### External ServiceAccount token signing

Traditionally, Kubernetes manages ServiceAccount tokens using static signing keys that are loaded from disk at `kube-apiserver` startup. This feature introduces an `ExternalJWTSigner` gRPC service for out-of-process signing, enabling Kubernetes distributions to integrate with external key management solutions (for example, HSMs, cloud KMSes) for ServiceAccount token signing instead of static disk-based keys.

Introduced as alpha in v1.32, this external JWT signing capability advances to beta and is enabled by default in v1.34.

This work was done as part of [KEP \#740](https://kep.k8s.io/740) led by SIG Auth.

### DRA features in beta

#### Admin access for secure resource monitoring

DRA supports controlled administrative access via the `adminAccess` field in ResourceClaims or ResourceClaimTemplates, allowing cluster operators to access devices already in use by others for monitoring or diagnostics. This privileged mode is limited to users authorized to create such objects in namespaces labeled `resource.k8s.io/admin-access: "true"`, ensuring regular workloads remain unaffected. Graduating to beta in v1.34, this feature provides secure introspection capabilities while preserving workload isolation through namespace-based authorization checks.

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

[MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/) offer a declarative, in-process alternative to mutating admission webhooks. This feature leverages CEL's object instantiation and JSON Patch strategies, combined with Server Side Apply’s merge algorithms.  
This significantly simplifies admission control by allowing administrators to define mutation rules directly in the API server.  
Introduced as alpha in v1.32, mutating admission policies has graduated to beta in v1.34.

This work was done as part of [KEP \#3962](https://kep.k8s.io/3962) led by SIG API Machinery.

### Snapshottable API server cache

The `kube-apiserver`'s caching mechanism (watch cache) efficiently serves requests for the latest observed state. However, **list** requests for previous states (for example, via pagination or by specifying a `resourceVersion`) often bypass this cache and are served directly from etcd. This direct etcd access significantly increases performance costs and can lead to stability issues, particularly with large resources, due to memory pressure from transferring large data blobs.  
With the `ListFromCacheSnapshot` feature gate enabled by default, `kube-apiserver` will attempt to serve the response from snapshots if one is available with `resourceVersion` older than requested. The `kube-apiserver` starts with no snapshots, creates a new snapshot on every watch event, and keeps them until it detects etcd is compacted or if cache is full with events older than 75 seconds. If the provided `resourceVersion` is unavailable, the server will fallback to etcd.

This work was done as part of [KEP \#4988](https://kep.k8s.io/4988) led by SIG API Machinery.

### Tooling for declarative validation of Kubernetes-native types

Prior to this release, validation rules for the
APIs built into Kubernetes were written entirely by hand, which makes them difficult for maintainers to discover, understand, improve or test.
There was no single way to find all the validation rules that might apply to an API.
_Declarative validation_ benefits Kubernetes maintainers by making API development, maintenance, and review easier while enabling programmatic inspection for better tooling and documentation.
For people using Kubernetes libraries to write their own code
(for example: a controller), the new approach streamlines adding new fields through IDL tags, rather than complex validation functions.
This change helps speed up API creation by automating validation boilerplate,
and provides more relevant error messages by performing validation on versioned types.​​​​​​​​​​​​​​​​  
This enhancement (which graduated to beta in v1.33 and continues as beta in v1.34) brings CEL-based validation rules to native Kubernetes types. It allows for more granular and declarative validation to be defined directly in the type definitions, improving API consistency and developer experience.

This work was done as part of [KEP \#5073](https://kep.k8s.io/5073) led by SIG API Machinery.

### Streaming informers for **list** requests

The streaming informers feature, which has been in beta since v1.32, gains further beta refinements in v1.34. This capability allows **list** requests to return data as a continuous stream of objects from the API server’s watch cache, rather than assembling paged results directly from etcd. By reusing the same mechanics used for **watch** operations, the API server can serve large datasets while keeping memory usage steady and avoiding allocation spikes that can affect stability.

In this release, the `kube-apiserver` and `kube-controller-manager` both take advantage of the new `WatchList` mechanism by default. For the `kube-apiserver`, this means list requests are streamed more efficiently, while the `kube-controller-manager` benefits from a more memory-efficient and predictable way to work with informers. Together, these improvements reduce memory pressure during large list operations, and improve reliability under sustained load, making list streaming more predictable and efficient.

This work was done as part of [KEP \#3157](https://kep.k8s.io/3157) led by SIG API Machinery and SIG Scalability.

### Graceful node shutdown handling for Windows nodes

The `kubelet` on Windows nodes can now detect system shutdown events and begin graceful termination of running Pods. This mirrors existing behavior on Linux and helps ensure workloads exit cleanly during planned shutdowns or restarts.   
When the system begins shutting down, the `kubelet` reacts by using standard termination logic. It respects the configured lifecycle hooks and grace periods, giving Pods time to stop before the node powers off. The feature relies on Windows pre-shutdown notifications to coordinate this process. This enhancement improves workload reliability during maintenance, restarts, or system updates. It is now in beta and enabled by default.

This work was done as part of [KEP \#4802](https://kep.k8s.io/4802) led by SIG Windows.

### In-place Pod resize improvements

Graduated to beta and enabled by default in v1.33, in-place Pod resizing receives further improvements in v1.34. These include support for decreasing memory usage and integration with Pod-level resources.

This feature remains in beta in v1.34. For detailed usage instructions and examples, refer to the documentation: [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).

This work was done as part of [KEP \#1287](https://kep.k8s.io/1287) led by SIG Node and SIG Autoscaling.

## New features in Alpha

*This is a selection of some of the improvements that are now alpha following the v1.34 release.*

### Pod certificates for mTLS authentication

Authenticating workloads within a cluster, especially for communication with the API server, has primarily relied on ServiceAccount tokens. While effective, these tokens aren't always ideal for establishing a strong, verifiable identity for mutual TLS (mTLS) and can present challenges when integrating with external systems that expect certificate-based authentication.  
Kubernetes v1.34 introduces a built-in mechanism for Pods to obtain X.509 certificates via [PodCertificateRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests). The `kubelet` can request and manage certificates for Pods, which can then be used to authenticate to the Kubernetes API server and other services using mTLS.
The primary benefit is a more robust and flexible identity mechanism for Pods. It provides a native way to implement strong mTLS authentication without relying solely on bearer tokens, aligning Kubernetes with standard security practices and simplifying integrations with certificate-aware observability and security tooling.

This work was done as part of [KEP \#4317](https://kep.k8s.io/4317) led by SIG Auth.

### "Restricted" Pod security standard now forbids remote probes

The `host` field within probes and lifecycle handlers allows users to specify an entity other than the `podIP` for the `kubelet` to probe.
However, this opens up a route for misuse and for attacks that bypass security controls, since the `host` field could be set to **any** value, including security sensitive external hosts, or localhost on the node.
In Kubernetes v1.34, Pods only meet the 
[Restricted](/docs/concepts/security/pod-security-standards/#restricted)
Pod security standard if they either leave the `host` field unset, or if they don't even use this
kind of probe.
You can use _Pod security admission_, or a third party solution, to enforce that Pods meet this standard. Because these are security controls, check
the documentation to understand the limitations and behavior of the enforcement mechanism you choose.

This work was done as part of [KEP \#4940](https://kep.k8s.io/4940) led by SIG Auth.

### Use `.status.nominatedNodeName` to express Pod placement

When the `kube-scheduler` takes time to bind Pods to Nodes, cluster autoscalers may not understand that a Pod will be bound to a specific Node. Consequently, they may mistakenly consider the Node as underutilized and delete it.  
To address this issue, the `kube-scheduler` can use `.status.nominatedNodeName` not only to indicate ongoing preemption but also to express Pod placement intentions. By enabling the `NominatedNodeNameForExpectation` feature gate, the scheduler uses this field to indicate where a Pod will be bound. This exposes internal reservations to help external components make informed decisions.

This work was done as part of [KEP \#5278](https://kep.k8s.io/5278) led by SIG Scheduling.

### DRA features in alpha

#### Resource health status for DRA

It can be difficult to know when a Pod is using a device that has failed or is temporarily unhealthy, which makes troubleshooting Pod crashes challenging or impossible.  
Resource Health Status for DRA improves observability by exposing the health status of devices allocated to a Pod in the Pod’s status. This makes it easier to identify the cause of Pod issues related to unhealthy devices and respond appropriately.  
To enable this functionality, the `ResourceHealthStatus` feature gate must be enabled, and the DRA driver must implement the `DRAResourceHealth` gRPC service.

This work was done as part of [KEP \#4680](https://kep.k8s.io/4680) led by WG Device Management.

#### Extended resource mapping

Extended resource mapping provides a simpler alternative to DRA's expressive and flexible approach by offering a straightforward way to describe resource capacity and consumption. This feature enables cluster administrators to advertise DRA-managed resources as *extended resources*, allowing application developers and operators to continue using the familiar container’s `.spec.resources` syntax to consume them.  
This enables existing workloads to adopt DRA without modifications, simplifying the transition to DRA for both application developers and cluster administrators.

This work was done as part of [KEP \#5004](https://kep.k8s.io/5004) led by WG Device Management.

#### DRA consumable capacity

Kubernetes v1.33 added support for resource drivers to advertise slices of a device that are available, rather than exposing the entire device as an all-or-nothing resource. However, this approach couldn't handle scenarios where device drivers manage fine-grained, dynamic portions of a device resource based on user demand, or share those resources independently of ResourceClaims, which are restricted by their spec and namespace.  
Enabling the `DRAConsumableCapacity` feature gate
(introduced as alpha in v1.34)
allows resource drivers to share the same device, or even a slice of a device, across multiple ResourceClaims or across multiple DeviceRequests.
The feature also extends the scheduler to support allocating portions of device resources,
as defined in the `capacity` field.
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

### Load environment variables from files created in runtime
Application developers have long requested greater flexibility in declaring environment variables. 
Traditionally, environment variables are declared on the API server side via static values, ConfigMaps, or Secrets.

Behind the `EnvFiles` feature gate, Kubernetes v1.34 introduces the ability to declare environment variables at runtime. 
One container (typically an init container) can generate the variable and store it in a file, 
and a subsequent container can start with the environment variable loaded from that file. 
This approach eliminates the need to "wrap" the target container's entry point, 
enabling more flexible in-Pod container orchestration. 

This feature particularly benefits AI/ML training workloads, 
where each Pod in a training Job requires initialization with runtime-defined values.

This work was done as part of [KEP \#5307](https://kep.k8s.io/3721) led by SIG Node.

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

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better
ones to improve the project's overall health. See the Kubernetes
[deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on
this process. Kubernetes v1.34 includes a couple of deprecations.

#### Manual cgroup driver configuration is deprecated

Historically, configuring the correct cgroup driver has been a pain point for users running Kubernetes clusters.
Kubernetes v1.28 added a way for the `kubelet`
to query the CRI implementation and find which cgroup driver to use. That automated detection is now
**strongly recommended** and support for it has graduated to stable in v1.34.
If your CRI container runtime does not support the
ability to report the cgroup driver it needs, you
should upgrade or change your container runtime.
The `cgroupDriver` configuration setting in the `kubelet` configuration file is now deprecated. 
The corresponding command-line option `--cgroup-driver` was previously deprecated, 
as Kubernetes recommends using the configuration file instead. 
Both the configuration setting and command-line option will be removed in a future release, 
that removal will not happen before the v1.36 minor release.

This work was done as part of [KEP \#4033](https://kep.k8s.io/4033) led by SIG Node.

#### Kubernetes to end containerd 1.x support in v1.36
While Kubernetes v1.34 still supports containerd 1.7 and other LTS releases of containerd, 
as a consequence of automated cgroup driver detection, the Kubernetes SIG Node community 
has formally agreed upon a final support timeline for containerd v1.X. 
The last Kubernetes release to offer this support will be v1.35 (aligned with containerd 1.7 EOL). 
This is an early warning that if you are using containerd 1.X, consider switching to 2.0+ soon. 
You are able to monitor the `kubelet_cri_losing_support` metric to determine if any nodes in your 
cluster are using a containerd version that will soon be outdated.

This work was done as part of [KEP \#4033](https://kep.k8s.io/4033) led by SIG Node.

#### `PreferClose` traffic distribution is deprecated
The `spec.trafficDistribution` field within a Kubernetes [Service](/docs/concepts/services-networking/service/) allows users to express preferences for how traffic should be routed to Service endpoints.  

[KEP-3015](https://kep.k8s.io/3015) deprecates `PreferClose` and introduces two additional values: `PreferSameZone` and `PreferSameNode`. `PreferSameZone` is an alias for the existing `PreferClose` to clarify its semantics. `PreferSameNode` allows connections to be delivered to a local endpoint when possible, falling back to a remote endpoint when not possible.

This feature was introduced in v1.33 behind the `PreferSameTrafficDistribution` feature gate. It has graduated to beta in v1.34 and is enabled by default.

This work was done as part of [KEP \#3015](https://kep.k8s.io/3015) led by SIG Network.

## Release notes

Check out the full details of the Kubernetes v1.34 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md).

## Availability

Kubernetes v1.34 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.34.0) or on the [Kubernetes download page](/releases/download/).

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.34 using [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

[We honor the memory of Rodolfo "Rodo" Martínez Vega](https://github.com/cncf/memorials/blob/main/rodolfo-martinez.md), a dedicated contributor whose passion for technology and community building left a mark on the Kubernetes community. Rodo served as a member of the Kubernetes Release Team across multiple releases, including v1.22-v1.23 and v1.25-v1.30, demonstrating unwavering commitment to the project's success and stability.  
Beyond his Release Team contributions, Rodo was deeply involved in fostering the Cloud Native LATAM community, helping to bridge language and cultural barriers in the space. His work on the Spanish version of Kubernetes documentation and the CNCF Glossary exemplified his dedication to making knowledge accessible to Spanish-speaking developers worldwide. Rodo's legacy lives on through the countless community members he mentored, the releases he helped deliver, and the vibrant LATAM Kubernetes community he helped cultivate.

We would like to thank the entire [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.34 release to our community. The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. A very special thanks goes out to our release lead, Vyom Yadav, for guiding us through a successful release cycle, for his hands-on approach to solving challenges, and for bringing the energy and care that drives our community forward.

## Project Velocity

The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

During the v1.34 release cycle, which spanned 15 weeks from 19th May 2025 to 27th August 2025, Kubernetes received contributions from as many as 106 different companies and 491 individuals. In the wider cloud native ecosystem, the figure goes up to 370 companies, counting 2235 total contributors.

Note that "contribution" counts when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.  
If you are interested in contributing, visit [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor website.

Source for this data:

* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## Event Update

Explore upcoming Kubernetes and cloud native events, including KubeCon \+ CloudNativeCon, KCD, and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community\!

**August 2025**

- [**KCD - Kubernetes Community Days:  Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/): Aug 28, 2025 | Bogotá, Colombia

**September 2025**

- [**CloudCon Sydney**](https://community.cncf.io/events/details/cncf-cloud-native-sydney-presents-cloudcon-sydney-sydney-international-convention-centre-910-september/): Sep 9–10, 2025 | Sydney, Australia.
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
- [**KCD - Kubernetes Community Days: Hangzhou**](https://sessionize.com/kcd-hangzhou-and-oicd-2025/): Nov 15, 2025 | Hangzhou, China

**December 2025**

- [**KCD - Kubernetes Community Days: Suisse Romande**](https://community.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/): Dec 4, 2025 | Geneva, Switzerland

You can find the latest event details [here](https://community.cncf.io/events/#/list).

## Upcoming Release Webinar

Join members of the Kubernetes v1.34 Release Team on **Wednesday, September 24th 2025 at 4:00 PM (UTC)**, to learn about the release highlights of this release. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v134-release/) on the CNCF Online Programs site.

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Follow us on Bluesky [@Kubernetesio](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
