---  
layout: blog
title: "Kubernetes v1.35: Timbernetes (The World Tree Release)"
date: 2025-12-17T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-35-release
author: >
  [Kubernetes v1.35 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)
---

**Editors**: Aakanksha Bhende, Arujjwal Negi, Chad M. Crowell, Graziano Casto, Swathi Rao

Similar to previous releases, the release of Kubernetes v1.35 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 60 enhancements, including 17 stable, 19 beta, and 22 alpha features.

There are also some [deprecations and removals](#deprecations-and-removals) in this release; make sure to read about those.

## Release theme and logo

{{< figure src="k8s-v1.35.png" alt="Kubernetes v1.35 Timbernetes logo: a storybook hex badge with a glowing world tree whose branches cradle Earth and a white Kubernetes wheel; three cheerful squirrels stand below—a wizard in a plum robe holding an LGTM scroll, a warrior with an axe and blue Kubernetes shield, and a lantern-carrying rogue in a navy cloak—on green grass above a gold ribbon reading World Tree Release, backed by soft mountains and cloud-swept sky" class="release-logo" >}}

2025 began in the shimmer of Octarine: The Color of Magic (v1.33) and rode the gusts Of Wind & Will (v1.34). We close the year with our hands on the World Tree, inspired by Yggdrasil, the tree of life that binds many realms. Like any great tree, Kubernetes grows ring by ring and release by release, shaped by the care of a global community.

At its center sits the Kubernetes wheel wrapped around the Earth, grounded by the resilient maintainers, contributors and users who keep showing up. Between day jobs, life changes, and steady open-source stewardship, they prune old APIs, graft new features and keep one of the world’s largest open source projects healthy.

Three squirrels guard the tree: a wizard holding the LGTM scroll for reviewers, a warrior with an axe and Kubernetes shield for the release crews who cut new branches, and a rogue with a lantern for the triagers who bring light to dark issue queues.

Together, they stand in for a much larger adventuring party. Kubernetes v1.35 adds another growth ring to the World Tree, a fresh cut shaped by many hands, many paths and a community whose branches reach higher as its roots grow deeper.

## Spotlight on key updates

Kubernetes v1.35 is packed with new features and improvements. Here are a few select updates the Release Team would like to highlight!

### Stable: In-place update of Pod resources

Kubernetes has graduated in-place updates for Pod resources to General Availability (GA).
This feature allows users to adjust CPU and memory resources without restarting Pods or Containers. Previously, such modifications required recreating Pods, which could disrupt workloads, particularly for stateful or batch applications. Earlier Kubernetes releases allowed you to change only infrastructure resource settings (requests and limits) for existing Pods. The new in-place functionality allows for smoother, nondisruptive vertical scaling, improves efficiency, and can also simplify development.

This work was done as part of [KEP #1287](https://kep.k8s.io/1287) led by SIG Node.

### Beta: Pod certificates for workload identity and security

Previously, delivering certificates to pods required external controllers (cert-manager, SPIFFE/SPIRE), CRD orchestration, and Secret management, with rotation handled by sidecars or init containers. Kubernetes v1.35 enables native workload identity with automated certificate rotation, drastically simplifying service mesh and zero-trust architectures. 

Now, the `kubelet` generates keys, requests certificates via PodCertificateRequest, and writes credential bundles directly to the Pod's filesystem. The `kube-apiserver` enforces node restriction at admission time, eliminating the most common pitfall for third-party signers: accidentally violating node isolation boundaries. This enables pure mTLS flows with no bearer tokens in the issuance path.

This work was done as part of [KEP #4317](https://kep.k8s.io/4317) led by SIG Auth.

### Alpha: Node declared features before scheduling

When control planes enable new features but nodes lag behind (permitted by Kubernetes skew policy), the scheduler can place pods requiring those features onto incompatible older nodes.
The node-declaration features framework allows nodes to declare their supported Kubernetes features. With the new alpha feature enabled, a Node reports the features it supports, publishing this information to the control plane via a new `.status.declaredFeatures` field. Then, the `kube-scheduler`, admission controllers, and third-party components can use these declarations. For example, you can enforce scheduling and API validation constraints to ensure that Pods run only on compatible nodes.

This work was done as part of [KEP #5328](https://kep.k8s.io/5328) led by SIG Node.

## Features graduating to Stable

*This is a selection of some of the improvements that are now stable following the v1.35 release.*

### PreferSameNode traffic distribution

The `trafficDistribution` field for Services has been updated to provide more explicit control over traffic routing. A new option, `PreferSameNode`, has been introduced to let services strictly prioritize endpoints on the local node if available, falling back to remote endpoints otherwise.

Simultaneously, the existing `PreferClose` option has been renamed to `PreferSameZone`. This change makes the API self-explanatory by explicitly indicating that traffic is preferred within the current availability zone. While `PreferClose` is preserved for backward compatibility, `PreferSameZone` is now the standard for zonal routing, ensuring that both node-level and zone-level preferences are clearly distinguished.

This work was done as part of [KEP #3015](https://kep.k8s.io/3015) led by SIG Network.

### Job API managed-by mechanism

The Job API now includes a `managedBy` field that allows an external controller to handle Job status synchronization. This feature, which graduates to stable in Kubernetes v1.35, is primarily driven by [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue), a multi-cluster dispatching system where a Job created in a management cluster is mirrored and executed in a worker cluster, with status updates propagated back. To enable this workflow, the built-in Job controller must not act on a particular Job resource so that the Kueue controller can manage status updates instead.

The goal is to allow clean delegation of Job synchronization to another controller. It does not aim to pass custom parameters to that controller or modify CronJob concurrency policies.

This work was done as part of [KEP #4368](https://kep.k8s.io/4368) led by SIG Apps.

### Reliable Pod update tracking with `.metadata.generation`

Historically, the Pod API lacked the `metadata.generation` field found in other Kubernetes objects such as Deployments.
Because of this omission, controllers and users had no reliable way to verify whether the `kubelet` had actually processed the latest changes to a Pod's specification. This ambiguity was particularly problematic for features like [In-Place Pod Vertical Scaling](#stable-in-place-update-of-pod-resources), where it was difficult to know exactly when a resource resize request had been enacted.

Kubernetes v1.33 added `.metadata.generation` fields for Pods, as an alpha feature. That field is now stable in the v1.35 Pod API, which means that every time a Pod's `spec` is updated, the `.metadata.generation` value is incremented. As part of this improvement, the Pod API also gained a `.status.observedGeneration` field, which reports the generation that the `kubelet` has successfully seen and processed. Pod conditions also each contain their own individual `observedGeneration` field that clients can report and / or observe.

Because this feature has graduated to stable in v1.35, it is available for all workloads.

This work was done as part of [KEP #5067](https://kep.k8s.io/5067) led by SIG Node.

### Configurable NUMA node limit for topology manager

The [topology manager](/docs/concepts/policy/node-resource-managers/) historically used a hard-coded limit of 8 for the maximum number of NUMA nodes it can support, preventing state explosion during affinity calculation. (There's an important detail here; a _NUMA node_ is not the same as a Node in the Kubernetes API.) This limit on the number of NUMA nodes prevented Kubernetes from fully utilizing modern high-end servers, which increasingly feature CPU architectures with more than 8 NUMA nodes.

Kubernetes v1.31 introduced a new, **beta** `max-allowable-numa-nodes` option to the topology manager policy configuration. In Kubernetes v1.35, that option is stable. Cluster administrators who enable it can use servers with more than 8 NUMA nodes.

Although the configuration option is stable, the Kubernetes community is aware of the poor performance for large NUMA hosts, and there is a [proposed enhancement](https://kep.k8s.io/5726) (KEP-5726) that aims to improve on it. You can learn more about this by reading [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).

This work was done as part of [KEP #4622](https://kep.k8s.io/4622) led by SIG Node.

## New features in Beta

*This is a selection of some of the improvements that are now beta following the v1.35 release.*

### Expose node topology labels via Downward API

Accessing node topology information, such as region and zone, from within a Pod has typically required querying the Kubernetes API server. While functional, this approach creates complexity and security risks by necessitating broad RBAC permissions or sidecar containers just to retrieve infrastructure metadata. Kubernetes v1.35 promotes the capability to expose node topology labels directly via the Downward API to beta. 

The `kubelet` can now inject standard topology labels, such as `topology.kubernetes.io/zone` and `topology.kubernetes.io/region`, into Pods as environment variables or projected volume files. The primary benefit is a safer and more efficient way for workloads to be topology-aware. This allows applications to natively adapt to their availability zone or region without dependencies on the API server, strengthening security by upholding the principle of least privilege and simplifying cluster configuration. 

**Note:** Kubernetes now injects available topology labels to every Pod so that they can be used as inputs to the [downward API](/docs/concepts/workloads/pods/downward-api/). With the v1.35 upgrade, most cluster administrators will see several new labels added to each Pod; this is expected as part of the design.

This work was done as part of [KEP #4742](https://kep.k8s.io/4742) led by SIG Node.

### Native support for storage version migration

In Kubernetes v1.35, the native support for storage version migration graduates to beta and is enabled by default. This move integrates the migration logic directly into the core Kubernetes control plane ("in-tree"), eliminating the dependency on external tools.

Historically, administrators relied on manual "read/write loops"—often piping `kubectl get` into `kubectl replace`—to update schemas or re-encrypt data at rest. This method was inefficient and prone to conflicts, especially for large resources like Secrets. With this release, the built-in controller automatically handles update conflicts and consistency tokens, providing a safe, streamlined, and reliable way to ensure stored data remains current with minimal operational overhead.

This work was done as part of [KEP #4192](https://kep.k8s.io/4192) led by SIG API Machinery.

### Mutable Volume attach limits

A CSI (Container Storage Interface) driver is a Kubernetes plugin that provides a consistent way for storage systems to be exposed to containerized workloads. The `CSINode` object records details about all CSI drivers installed on a node. However, a mismatch can arise between the reported and actual attachment capacity on nodes. When volume slots are consumed after a CSI driver starts up, the `kube-scheduler` may assign stateful pods to nodes without sufficient capacity, ultimately getting stuck in a `ContainerCreating` state.

Kubernetes v1.35 makes `CSINode.spec.drivers[*].allocatable.count` mutable so that a node’s available volume attachment capacity can be updated dynamically. It also allows CSI drivers to control how frequently the `allocatable.count` value is updated on all nodes by introducing a configurable refresh interval, defined through the `CSIDriver` object. Additionally, it automatically updates `CSINode.spec.drivers[*].allocatable.count` on detecting a failure in volume attachment due to insufficient capacity. Although this feature graduated to beta in v1.34 with the feature flag `MutableCSINodeAllocatableCount` disabled by default, it remains in beta for v1.35 to allow time for feedback, but the feature flag is enabled by default.

This work was done as part of [KEP #4876](https://kep.k8s.io/4876) led by SIG Storage.

### Opportunistic batching

Historically, the Kubernetes scheduler processes pods sequentially with time complexity of `O(num pods × num nodes)`, which can result in redundant computation for compatible pods. This KEP introduces an opportunistic batching mechanism that aims to improve performance by identifying such compatible Pods via `Pod scheduling signature` and batching them together, allowing shared filtering and scoring results across them.

The pod scheduling signature ensures that two pods with the same signature are “the same” from a scheduling perspective. It takes into account not only the pod and node attributes, but also the other pods in the system and global data about the pod placement. This means that any pod with the given signature will get the same scores/feasibility results from any arbitrary set of nodes.

The batching mechanism consists of two operations that can be invoked whenever needed - *create* and *nominate*. Create leads to the creation of a new set of batch information from the scheduling results of Pods that have a valid signature. Nominate uses the batching information from create to set the nominated node name from a new Pod whose signature matches the canonical Pod’s signature.

This work was done as part of [KEP #5598](https://kep.k8s.io/5598) led by SIG Scheduling.

### `maxUnavailable` for StatefulSets

A StatefulSet runs a group of Pods and maintains a sticky identity for each of those Pods. This is critical for stateful workloads requiring stable network identifiers or persistent storage. When a StatefulSet's `.spec.updateStrategy.<type>` is set to `RollingUpdate`, the StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed in the same order as Pod termination (from the largest ordinal to the smallest), updating each Pod one at a time.

Kubernetes v1.24 added a new **alpha** field to a StatefulSet's `rollingUpdate` configuration settings, called `maxUnavailable`. That field wasn't part of the Kubernetes API unless your cluster administrator explicitly opted in.
In Kubernetes v1.35 that field is beta and is available by default. You can use it to define the maximum number of pods that can be unavailable during an update. This setting is most effective in combination with `.spec.podManagementPolicy` set to Parallel.  You can set `maxUnavailable` as either a positive number (example: 2) or a percentage of the desired number of Pods (example: 10%). If this field is not specified, it will default to 1, to maintain the previous behavior of only updating one Pod at a time. This improvement allows stateful applications (that can tolerate more than one Pod being down) to finish updating faster.

This work was done as part of [KEP #961](https://kep.k8s.io/961) led by SIG Apps.

### Configurable credential plugin policy in `kuberc`

The optional [`kuberc` file](/docs/reference/kubectl/kuberc/) is a way to separate server configurations and cluster credentials from user preferences without disrupting already running CI pipelines with unexpected outputs.

As part of the v1.35 release, `kuberc` gains additional functionality which allows users to configure credential plugin policy. This change introduces two fields `credentialPluginPolicy`, which allows or denies all plugins, and allows specifying a list of allowed plugins using `credentialPluginAllowlist`.

This work was done as part of [KEP #3104](https://kep.k8s.io/3104) as a cooperation between SIG Auth and SIG CLI.

### KYAML

YAML is a human-readable format of data serialization. In Kubernetes, YAML files are used to define and configure resources, such as Pods, Services, and Deployments. However, complex YAML is difficult to read. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion (see: The Norway Bug). While JSON is an alternative, it lacks support for comments and has strict requirements for trailing commas and quoted keys.

KYAML is a safer and less ambiguous subset of YAML designed specifically for Kubernetes. Introduced as an opt-in alpha feature in v1.34, this feature graduated to beta in Kubernetes v1.35 and has been enabled by default. It can be disabled by setting the environment variable `KUBECTL_KYAML=false`. 

KYAML addresses challenges pertaining to both YAML and JSON. All KYAML files are also valid YAML files. This means you can write KYAML and pass it as an input to any version of kubectl. This also means that you don’t need to write in strict KYAML for the input to be parsed.

This work was done as part of [KEP #5295](https://kep.k8s.io/5295) led by SIG CLI.

### Configurable tolerance for HorizontalPodAutoscalers

The Horizontal Pod Autoscaler (HPA) has historically relied on a fixed, global 10% tolerance for scaling actions. A drawback of this hardcoded value was that workloads requiring high sensitivity, such as those needing to scale on a 5% load increase, were often blocked from scaling, while others might oscillate unnecessarily.

With Kubernetes v1.35, the configurable tolerance feature graduates to beta and is enabled by default. This enhancement allows users to define a custom tolerance window on a per-resource basis within the HPA `behavior` field. By setting a specific tolerance (e.g., lowering it to 0.05 for 5%), operators gain precise control over autoscaling sensitivity, ensuring that critical workloads react quickly to small metric changes, without requiring cluster-wide configuration adjustments.

This work was done as part of [KEP #4951](https://kep.k8s.io/4951) led by SIG Autoscaling.

### Support for user namespaces in Pods

Kubernetes is adding support for user namespaces, allowing pods to run with isolated user and group ID mappings instead of sharing host IDs. This means containers can operate as root internally while actually being mapped to an unprivileged user on the host, reducing the risk of privilege escalation in the event of a compromise. The feature improves pod-level security and makes it safer to run workloads that need root inside the container. Over time, support has expanded to both stateless and stateful Pods through id-mapped mounts.

This work was done as part of [KEP #127](https://kep.k8s.io/127) led by SIG Node.

### VolumeSource: OCI artifact and/or image

When creating a Pod, you often need to provide data, binaries, or configuration files for your containers. This meant including the content into the main container image or using a custom init container to download and unpack files into an `emptyDir`. Both these approaches are still valid. Kubernetes v1.31 added support for the `image` volume type allowing Pods to declaratively pull and unpack OCI container image artifacts into a volume. This lets you package and deliver data-only artifacts such as configs, binaries, or machine learning models using standard OCI registry tools. 

With this feature, you can fully separate your data from your container image and remove the need for extra init containers or startup scripts. The image volume type has been in beta since v1.33 and is enabled by default in v1.35. Please note that using this feature requires a compatible container runtime, such as containerd v2.1 or later.

This work was done as part of [KEP #4639](https://kep.k8s.io/4639) led by SIG Node.

### Enforced `kubelet` credential verification for cached images

The `imagePullPolicy: IfNotPresent` setting currently allows a Pod to use a container image that is already cached on a node, even if the Pod itself does not possess the credentials to pull that image. A drawback of this behavior is that it creates a security vulnerability in multi-tenant clusters: if a Pod with valid credentials pulls a sensitive private image to a node, a subsequent unauthorized Pod on the same node can access that image simply by relying on the local cache.

This KEP introduces a mechanism where the `kubelet` enforces credential verification for cached images. Before allowing a Pod to use a locally cached image, the `kubelet` checks if the Pod has the valid credentials to pull it. This ensures that only authorized workloads can use private images, regardless of whether they are already present on the node, significantly hardening the security posture for shared clusters.

In Kubernetes v1.35, this feature has graduated to beta and is enabled by default. Users can still disable it by setting the `KubeletEnsureSecretPulledImages` feature gate to false. Additionally, the `imagePullCredentialsVerificationPolicy` flag allows operators to configure the desired security level, ranging from a mode that prioritizes backward compatibility to a strict enforcement mode that offers maximum security.

This work was done as part of [KEP #2535](https://kep.k8s.io/2535) led by SIG Node.

### Fine-grained Container restart rules

Historically, the `restartPolicy` field was defined strictly at the Pod level, forcing the same behavior on all containers within a Pod. A drawback of this global setting was the lack of granularity for complex workloads, such as AI/ML training jobs. These often required `restartPolicy: Never` for the Pod to manage job completion, yet individual containers would benefit from in-place restarts for specific, retriable errors (like network glitches or GPU init failures).

Kubernetes v1.35 addresses this by enabling `restartPolicy` and `restartPolicyRules` within the container API itself. This allows users to define restart strategies for individual regular and init containers that operate independently of the Pod's overall policy. For example, a container can now be configured to restart automatically only if it exits with a specific error code, avoiding the expensive overhead of rescheduling the entire Pod for a transient failure.

In this release, the feature has graduated to beta and is enabled by default. Users can immediately leverage `restartPolicyRules` in their container specifications to optimize recovery times and resource utilization for long-running workloads, without altering the broader lifecycle logic of their Pods.

This work was done as part of [KEP #5307](https://kep.k8s.io/5307) led by SIG Node.

### CSI driver opt-in for service account tokens via secrets field

Providing ServiceAccount tokens to Container Storage Interface (CSI) drivers has traditionally relied on injecting them into the `volume_context` field. This approach presents a significant security risk because `volume_context` is intended for non-sensitive configuration data and is frequently logged in plain text by drivers and debugging tools, potentially leaking credentials. 

Kubernetes v1.35 introduces an opt-in mechanism for CSI drivers to receive ServiceAccount tokens via the dedicated secrets field in the NodePublishVolume request. Drivers can now enable this behavior by setting the `serviceAccountTokenInSecrets` field to true in their CSIDriver object, instructing the `kubelet` to populate the token securely. 

The primary benefit is the prevention of accidental credential exposure in logs and error messages. This change ensures that sensitive workload identities are handled via the appropriate secure channels, aligning with best practices for secret management while maintaining backward compatibility for existing drivers. 

This work was done as part of [KEP #5538](https://kep.k8s.io/5538) led by SIG Auth in cooperation with SIG Storage.

### Deployment status: count of terminating replicas

Historically, the Deployment status provided details on available and updated replicas but lacked explicit visibility into Pods that were in the process of shutting down. A drawback of this omission was that users and controllers could not easily distinguish between a stable Deployment and one that still had Pods executing cleanup tasks or adhering to long grace periods.

Kubernetes v1.35 promotes the `terminatingReplicas` field within the Deployment status to beta. This field provides a count of Pods that have a deletion timestamp set but have not yet been removed from the system. This feature is a foundational step in a larger initiative to improve how Deployments handle Pod replacement, laying the groundwork for future policies regarding when to create new Pods during a rollout.

The primary benefit is improved observability for lifecycle management tools and operators. By exposing the number of terminating Pods, external systems can now make more informed decisions such as waiting for a complete shutdown before proceeding with subsequent tasks without needing to manually query and filter individual Pod lists.

This work was done as part of [KEP #3973](https://kep.k8s.io/3973) led by SIG Apps.

## New features in Alpha

*This is a selection of some of the improvements that are now alpha following the v1.35 release.*

### Gang scheduling support in Kubernetes

Scheduling interdependent workloads, such as AI/ML training jobs or HPC simulations, has traditionally been challenging because the default Kubernetes scheduler places Pods individually. This often leads to partial scheduling where some Pods start while others wait indefinitely for resources, resulting in deadlocks and wasted cluster capacity.

Kubernetes v1.35 introduces native support for so-called "gang scheduling" via the new Workload API and PodGroup concept. This feature implements an "all-or-nothing" scheduling strategy, ensuring that a defined group of Pods is scheduled only if the cluster has sufficient resources to accommodate the entire group simultaneously.

The primary benefit is improved reliability and efficiency for batch and parallel workloads. By preventing partial deployments, it eliminates resource deadlocks and ensures that expensive cluster capacity is utilized only when a complete job can run, significantly optimizing the orchestration of large-scale data processing tasks.

This work was done as part of [KEP #4671](https://kep.k8s.io/4671) led by SIG Scheduling.

### Constrained impersonation

Historically, the `impersonate` verb in Kubernetes RBAC functioned on an all-or-nothing basis: once a user was authorized to impersonate a target identity, they gained all associated permissions. A drawback of this broad authorization was that it violated the principle of least privilege, preventing administrators from restricting impersonators to specific actions or resources.

Kubernetes v1.35 introduces a new alpha feature, constrained impersonation, which adds a secondary authorization check to the impersonation flow. When enabled via the `ConstrainedImpersonation` feature gate, the API server verifies not only the basic `impersonate` permission but also checks if the impersonator is authorized for the specific action using new verb prefixes (e.g., `impersonate-on:<mode>:<verb>`). This allows administrators to define fine-grained policies—such as permitting a support engineer to impersonate a cluster admin solely to view logs, without granting full administrative access.

This work was done as part of [KEP #5284](https://kep.k8s.io/5284) led by SIG Auth.

### Flagz for Kubernetes components

Verifying the runtime configuration of Kubernetes components, such as the API server or `kubelet`, has traditionally required privileged access to the host node or process arguments. To address this, the `/flagz` endpoint was introduced to expose command-line options via HTTP. However, its output was initially limited to plain text, making it difficult for automated tools to parse and validate configurations reliably.

In Kubernetes v1.35, the `/flagz` endpoint has been enhanced to support structured, machine-readable JSON output. Authorized users can now request a versioned JSON response using standard HTTP content negotiation, while the original plain text format remains available for human inspection. This update significantly improves observability and compliance workflows, allowing external systems to programmatically audit component configurations without fragile text parsing or direct infrastructure access.

This work was done as part of [KEP #4828](https://kep.k8s.io/4828) led by SIG Instrumentation.

### Statusz for Kubernetes components

Troubleshooting Kubernetes components like the `kube-apiserver` or `kubelet` has traditionally involved parsing unstructured logs or text output, which is brittle and difficult to automate. While a basic `/statusz` endpoint existed previously, it lacked a standardized, machine-readable format, limiting its utility for external monitoring systems.

In Kubernetes v1.35, the `/statusz` endpoint has been enhanced to support structured, machine-readable JSON output. Authorized users can now request this format using standard HTTP content negotiation to retrieve precise status data—such as version information and health indicators—without relying on fragile text parsing. This improvement provides a reliable, consistent interface for automated debugging and observability tools across all core components.

This work was done as part of [KEP #4827](https://kep.k8s.io/4827) led by SIG Instrumentation.

### CCM: watch-based route controller reconciliation using informers

Managing network routes within cloud environments has traditionally relied on the Cloud Controller Manager (CCM) periodically polling the cloud provider's API to verify and update route tables. This fixed-interval reconciliation approach can be inefficient, often generating a high volume of unnecessary API calls and introducing latency between a node state change and the corresponding route update.

For the Kubernetes v1.35 release, the cloud-controller-manager library introduces a watch-based reconciliation strategy for the route controller. Instead of relying on a timer, the controller now utilizes informers to watch for specific Node events, such as additions, deletions, or relevant field updates and triggers route synchronization only when a change actually occurs.

The primary benefit is a significant reduction in cloud provider API usage, which lowers the risk of hitting rate limits and reduces operational overhead. Additionally, this event-driven model improves the responsiveness of the cluster's networking layer by ensuring that route tables are updated immediately following changes in cluster topology.

This work was done as part of [KEP #5237](https://kep.k8s.io/5237) led by SIG Cloud Provider.

### Extended toleration operators for threshold-based placement

Kubernetes v1.35 introduces SLA-aware scheduling by enabling workloads to express reliability requirements. The feature adds numeric comparison operators to tolerations, allowing pods to match or avoid nodes based on SLA-oriented taints such as service guarantees or fault-domain quality.

The primary benefit is enhancing the scheduler with more precise placement. Critical workloads can demand higher-SLA nodes, while lower priority workloads can opt into lower SLA ones. This improves utilization and reduces cost without compromising reliability.

This work was done as part of [KEP #5471](https://kep.k8s.io/5471) led by SIG Scheduling.

### Mutable container resources when Job is suspended

Running batch workloads often involves trial and error with resource limits. Currently, the Job specification is immutable, meaning that if a Job fails due to an Out of Memory (OOM) error or insufficient CPU, the user cannot simply adjust the resources; they must delete the Job and create a new one, losing the execution history and status.

Kubernetes v1.35 introduces the capability to update resource requests and limits for Jobs that are in a suspended state. Enabled via the `MutableJobPodResourcesForSuspendedJobs` feature gate, this enhancement allows users to pause a failing Job, modify its Pod template with appropriate resource values, and then resume execution with the corrected configuration.

The primary benefit is a smoother recovery workflow for misconfigured jobs. By allowing in-place corrections during suspension, users can resolve resource bottlenecks without disrupting the Job's lifecycle identity or losing track of its completion status, significantly improving the developer experience for batch processing.

This work was done as part of [KEP #5440](https://kep.k8s.io/5440) led by SIG Apps.

## Other notable changes

### Continued innovation in Dynamic Resource Allocation (DRA)

The [core functionality](https://kep.k8s.io/4381) was graduated to stable in v1.34, with the ability to turn it off. In v1.35 it is always enabled. Several alpha features have also been significantly improved and are ready for testing. We encourage users to provide feedback on these capabilities to help clear the path for their target promotion to beta in upcoming releases.

#### Extended Resource Requests via DRA

Several functional gaps compared to Extended Resource requests via Device Plugins were addressed, for example scoring and reuse of devices in init containers.

#### Device Taints and Tolerations

The new "None" effect can be used to report a problem without immediately affecting scheduling or running pod. DeviceTaintRule now provides status information about an ongoing eviction. The "None" effect can be used for a "dry run" before actually evicting pods:
- Create DeviceTaintRule with "effect: None".
- Check the status to see how many pods would be evicted.
- Replace "effect: None" with "effect: NoExecute".

#### Partitionable Devices

Devices belonging to the same partitionable devices may now be defined in different ResourceSlices.
You can read more in the [official documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices).

#### Consumable Capacity, Device Binding Conditions

Several bugs were fixed and/or more tests added.
You can learn more about [Consumable Capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity) and [Binding Conditions](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions) in the official documentation.

### Comparable resource version semantics

Kubernetes v1.35 changes the way that clients are allowed to interpret [resource versions](/docs/reference/using-api/api-concepts/#resource-versions).

Before v1.35, the only supported comparison that clients could make was to check for string equality: if two resource versions were equal, they were the same. Clients could also provide a resource version to the API server and ask the control plane to do internal comparisons, such as streaming all events since a particular resource version.

In v1.35, all in-tree resource versions meet a new stricter definition: the values are a special form of decimal number. And, because they can be compared, clients can do their own operations to compare two different resource versions.
For example, this means that a client reconnecting after a crash can detect when it has lost updates, as distinct from the case where there has been an update but no lost changes in the meantime.

This change in semantics enables other important use cases such as [storage version migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/), performance improvements to _informers_ (a client helper concept), and controller reliability. All of those cases require knowing whether one resource version is newer than another.

This work was done as part of [KEP #5504](https://kep.k8s.io/5504) led by SIG API Machinery.

## Graduations, deprecations, and removals in v1.35

### Graduations to stable

This lists all the features that graduated to stable (also known as *general availability*). For a full list of updates including new features and graduations from alpha to beta, see the release notes.

This release includes a total of 15 enhancements promoted to stable:

* [Add CPUManager policy option to restrict reservedSystemCPUs to system daemons and interrupt processing](https://kep.k8s.io/4540)
* [Pod Generation](https://kep.k8s.io/5067)
* [Invariant Testing](https://kep.k8s.io/5468)
* [In-Place Update of Pod Resources](https://kep.k8s.io/1287)
* [Fine-grained SupplementalGroups control](https://kep.k8s.io/3619)
* [Add support for a drop-in kubelet configuration directory](https://kep.k8s.io/3983)
* [Remove gogo protobuf dependency for Kubernetes API types](https://kep.k8s.io/5589)
* [kubelet image GC after a maximum age](https://kep.k8s.io/4210)
* [Kubelet limit of Parallel Image Pulls](https://kep.k8s.io/3673)
* [Add a TopologyManager policy option for MaxAllowableNUMANodes](https://kep.k8s.io/4622)
* [Include kubectl command metadata in http request headers](https://kep.k8s.io/859)
* [PreferSameNode Traffic Distribution (formerly PreferLocal traffic policy / Node-level topology)](https://kep.k8s.io/3015)
* [Job API managed-by mechanism](https://kep.k8s.io/4368)
* [Transition from SPDY to WebSockets](https://kep.k8s.io/4006)

### Deprecations, removals and community updates

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better
ones to improve the project's overall health. See the Kubernetes
[deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process. Kubernetes v1.35 includes a couple of deprecations.

#### Ingress NGINX retirement

For years, the Ingress NGINX controller has been a popular choice for routing traffic into Kubernetes clusters. It was flexible, widely adopted, and served as the standard entry point for countless applications. 

However, maintaining the project has become unsustainable. With a severe shortage of maintainers and mounting technical debt, the community recently made the difficult decision to retire it. This isn't strictly part of the v1.35 release, but it's such an important change that we wanted to highlight it here.

Consequently, the Kubernetes project announced that Ingress NGINX will receive only best-effort maintenance until **March 2026**. After this date, it will be archived with no further updates. The recommended path forward is to migrate to the [Gateway API](https://gateway-api.sigs.k8s.io/), which offers a more modern, secure, and extensible standard for traffic management.

You can find more in the [official blog post](/blog/2025/11/11/ingress-nginx-retirement/).

#### Removal of cgroup v1 support

When it comes to managing resources on Linux nodes, Kubernetes has historically relied on cgroups (control groups). While the original cgroup v1 was functional, it was often inconsistent and limited. That is why Kubernetes introduced support for cgroup v2 back in v1.25, offering a much cleaner, unified hierarchy and better resource isolation.

Because cgroup v2 is now the modern standard, Kubernetes is ready to retire the legacy cgroup v1 support in v1.35. This is an important notice for cluster administrators: if you are still running nodes on older Linux distributions that don't support cgroup v2, your `kubelet` will fail to start. To avoid downtime, you will need to migrate those nodes to systems where cgroup v2 is enabled.

To learn more, read [about cgroup v2](/docs/concepts/architecture/cgroups/);  
you can also track the switchover work via [KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573).  

#### Deprecation of ipvs mode in kube-proxy

Years ago, Kubernetes adopted the [`ipvs`](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) mode in `kube-proxy` to provide faster load balancing than the standard [`iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables). While it offered a performance boost, keeping it in sync with evolving networking requirements created too much technical debt and complexity.

Because of this maintenance burden, Kubernetes v1.35 deprecates `ipvs` mode. Although the mode remains available in this release, `kube-proxy` will now emit a warning on startup when configured to use it. The goal is to streamline the codebase and focus on modern standards. For Linux nodes, you should begin transitioning to [`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables), which is now the recommended replacement.

You can find more in [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495).

#### Final call for containerd v1.X

While Kubernetes v1.35 still supports containerd 1.7 and other LTS releases, this is the final version with such support. The SIG Node community has designated v1.35 as the last release to support the containerd v1.X series.

This serves as an important reminder: before upgrading to the next Kubernetes version, you must switch to containerd 2.0 or later. To help identify which nodes need attention, you can monitor the `kubelet_cri_losing_support` metric within your cluster.

You can find more in the [official blog post](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support) or in [KEP-4033: Discover cgroup driver from CRI](https://kep.k8s.io/4033).

#### Improved Pod stability during `kubelet` restarts

Previously, restarting the `kubelet` service often caused a temporary disruption in Pod status. During a restart, the kubelet would reset container states, causing healthy Pods to be marked as `NotReady` and removed from load balancers, even if the application itself was still running correctly.

To address this reliability issue, this behavior has been corrected to ensure seamless node maintenance. The `kubelet` now properly restores the state of existing containers from the runtime upon startup. This ensures that your workloads remain `Ready` and traffic continues to flow uninterrupted during `kubelet` restarts or upgrades.

You can find more in [KEP-4781: Fix inconsistent container ready state after kubelet restart](https://kep.k8s.io/4781).

## Release notes

Check out the full details of the Kubernetes v1.35 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md).

## Availability

Kubernetes v1.35 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.35.0) or on the [Kubernetes download page](/releases/download/).

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.35 using [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

[We honor the memory of Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md), a long-time contributor and respected engineer whose technical excellence and infectious enthusiasm left a lasting impact on the Kubernetes community. Han was a significant force within SIG Instrumentation and SIG API Machinery, earning a [2021 Kubernetes Contributor Award](https://www.kubernetes.dev/community/awards/2021/) for his critical work and sustained commitment to the project's core stability. Beyond his technical contributions, Han was deeply admired for his generosity as a mentor and his passion for building connections among people. He was known for "opening doors" for others, whether guiding new contributors through their first pull requests or supporting colleagues with patience and kindness. Han’s legacy lives on through the engineers he inspired, the robust systems he helped build, and the warm, collaborative spirit he fostered within the cloud native ecosystem.

We would like to thank the entire [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.35 release to our community. The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. We are incredibly grateful to our Release Lead, [Drew Hagen](https://github.com/drewhagen), whose hands-on guidance and vibrant energy not only navigated us through complex challenges but also fueled the community spirit behind this successful release.

## Project velocity

The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

During the v1.35 release cycle, which spanned 14 weeks from 15th September 2025 to 17th December 2025, Kubernetes received contributions from as many as 85 different companies and 419 individuals. In the wider cloud native ecosystem, the figure goes up to 281 companies, counting 1769 total contributors.

Note that "contribution" counts when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.  
If you are interested in contributing, visit [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor website.

Sources for this data:

* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## Events update

Explore upcoming Kubernetes and cloud native events, including KubeCon \+ CloudNativeCon, KCD, and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community\!

**February 2026**

- [**KCD - Kubernetes Community Days:  New Delhi**](https://www.kcddelhi.com/index.html): Feb 21, 2026 | New Delhi, India
- [**KCD - Kubernetes Community Days:  Guadalajara**](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-open-source-contributor-summit/cohost-kcd-guadalajara): Feb 23, 2026 | Guadalajara, Mexico

**March 2026**

- [**KubeCon + CloudNativeCon Europe 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/): Mar 23-26, 2026 | Amsterdam, Netherlands

**May 2026**

- [**KCD - Kubernetes Community Days:  Toronto**](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-canada-2026/): May 13, 2026 | Toronto, Canada
- [**KCD - Kubernetes Community Days:  Helsinki**](https://cloudnativefinland.org/kcd-helsinki-2026/): May 20, 2026 | Helsinki, Finland

**June 2026**

- [**KubeCon + CloudNativeCon China 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): Jun 10-11, 2026 | Hong Kong
- [**KubeCon + CloudNativeCon India 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/): Jun 18-19, 2026 | Mumbai, India
- [**KCD - Kubernetes Community Days:  Kuala Lumpur**](https://community.cncf.io/kcd-kuala-lumpur-2026/): Jun 27, 2026 | Kuala Lumpur, Malaysia

**July 2026**

- [**KubeCon + CloudNativeCon Japan 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/): Jul 29-30, 2026 | Yokohama, Japan

You can find the latest event details [here](https://community.cncf.io/events/#/list).
​
## Upcoming release webinar

Join members of the Kubernetes v1.35 Release Team on **Wednesday, January 14, 2026, at 5:00 PM (UTC)** to learn about the release highlights of this release. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v135-release/) on the CNCF Online Programs site.

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Follow us on Bluesky [@Kubernetesio](https://bsky.app/profile/kubernetes.io) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
