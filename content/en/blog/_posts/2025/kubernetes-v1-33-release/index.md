---
layout: blog
title: 'Kubernetes v1.33: Octarine'
date: 2025-04-23T10:30:00-08:00
slug: kubernetes-v1-33-release
evergreen: true
author: >
  [Kubernetes v1.33 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.33/release-team.md)
---

**Editors:** Agustina Barbetta, Aakanksha Bhende, Udi Hofesh, Ryota Sawada, Sneha Yadav

Similar to previous releases, the release of Kubernetes v1.33 introduces new stable, beta, and alpha
features. The consistent delivery of high-quality releases underscores the strength of our
development cycle and the vibrant support from our community.

This release consists of 64 enhancements. Of those enhancements, 18 have graduated to Stable, 20 are
entering Beta, 24 have entered Alpha, and 2 are deprecated or withdrawn.

There are also several notable [deprecations and removals](#deprecations-and-removals) in this
release; make sure to read about those if you already run an older version of Kubernetes.

## Release theme and logo

{{< figure src="k8s-1.33.svg" alt="Kubernetes v1.33 logo: Octarine" class="release-logo" >}}

The theme for Kubernetes v1.33 is **Octarine: The Color of Magic**<sup>1</sup>, inspired by Terry
Pratchett’s _Discworld_ series. This release highlights the open source magic<sup>2</sup> that
Kubernetes enables across the ecosystem.

If you’re familiar with the world of Discworld, you might recognize a small swamp dragon perched
atop the tower of the Unseen University, gazing up at the Kubernetes moon above the city of
Ankh-Morpork with 64 stars<sup>3</sup> in the background.

As Kubernetes moves into its second decade, we celebrate both the wizardry of its maintainers, the
curiosity of new contributors, and the collaborative spirit that fuels the project. The v1.33
release is a reminder that, as Pratchett wrote, _“It’s still magic even if you know how it’s done.”_
Even if you know the ins and outs of the Kubernetes code base, stepping back at the end of the
release cycle, you’ll realize that Kubernetes remains magical.

Kubernetes v1.33 is a testament to the enduring power of open source innovation, where hundreds of
contributors<sup>4</sup> from around the world work together to create something truly
extraordinary. Behind every new feature, the Kubernetes community works to maintain and improve the
project, ensuring it remains secure, reliable, and released on time. Each release builds upon the
other, creating something greater than we could achieve alone.

<sub>1. Octarine is the mythical eighth color, visible only to those attuned to the arcane—wizards,
witches, and, of course, cats. And occasionally, someone who’s stared at IPtable rules for too
long.</sub>\
<sub>2. Any sufficiently advanced technology is indistinguishable from magic…?</sub>\
<sub>3. It’s not a coincidence 64 KEPs (Kubernetes Enhancement Proposals) are also included in
v1.33.</sub>\
<sub>4. See the Project Velocity section for v1.33 🚀</sub>

## Spotlight on key updates

Kubernetes v1.33 is packed with new features and improvements. Here are a few select updates the
Release Team would like to highlight!

### Stable: Sidecar containers

The sidecar pattern involves deploying separate auxiliary container(s) to handle extra capabilities
in areas such as networking, logging, and metrics gathering. Sidecar containers graduate to stable
in v1.33.

Kubernetes implements sidecars as a special class of init containers with `restartPolicy: Always`,
ensuring that sidecars start before application containers, remain running throughout the pod's
lifecycle, and terminate automatically after the main containers exit.

Additionally, sidecars can utilize probes (startup, readiness, liveness) to signal their operational
state, and their Out-Of-Memory (OOM) score adjustments are aligned with primary containers to
prevent premature termination under memory pressure.

To learn more, read [Sidecar Containers](/docs/concepts/workloads/pods/sidecar-containers/).

This work was done as part of [KEP-753: Sidecar Containers](https://kep.k8s.io/753) led by SIG Node.

### Beta: In-place resource resize for vertical scaling of Pods

Workloads can be defined using APIs like Deployment, StatefulSet, etc. These describe the template
for the Pods that should run, including memory and CPU resources, as well as the replica count of
the number of Pods that should run. Workloads can be scaled horizontally by updating the Pod replica
count, or vertically by updating the resources required in the Pods container(s). Before this
enhancement, container resources defined in a Pod's `spec` were immutable, and updating any of these
details within a Pod template would trigger Pod replacement.

But what if you could dynamically update the resource configuration for your existing Pods without
restarting them?

The [KEP-1287](https://kep.k8s.io/1287) is precisely to allow such in-place Pod updates. It was
released as alpha in v1.27, and has graduated to beta in v1.33. This opens up various possibilities
for vertical scale-up of stateful processes without any downtime, seamless scale-down when the
traffic is low, and even allocating larger resources during startup, which can then be reduced once
the initial setup is complete.

This work was done as part of [KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287)
led by SIG Node and SIG Autoscaling.

### Alpha: New configuration option for kubectl with `.kuberc` for user preferences

In v1.33, `kubectl` introduces a new alpha feature with opt-in configuration file `.kuberc` for user
preferences. This file can contain `kubectl` aliases and overrides (e.g. defaulting to use
[server-side apply](/docs/reference/using-api/server-side-apply/)), while leaving cluster
credentials and host information in kubeconfig. This separation allows sharing the same user
preferences for `kubectl` interaction, regardless of target cluster and kubeconfig used.

To enable this alpha feature, users can set the environment variable of `KUBECTL_KUBERC=true` and
create a `.kuberc` configuration file. By default, `kubectl` looks for this file in
`~/.kube/kuberc`. You can also specify an alternative location using the `--kuberc` flag, for
example: `kubectl --kuberc /var/kube/rc`.

This work was done as part of
[KEP-3104: Separate kubectl user preferences from cluster configs](https://kep.k8s.io/3104) led by
SIG CLI.

## Features graduating to Stable

_This is a selection of some of the improvements that are now stable following the v1.33 release._

### Backoff limits per index for indexed Jobs

​This release graduates a feature that allows setting backoff limits on a per-index basis for Indexed
Jobs. Traditionally, the `backoffLimit` parameter in Kubernetes Jobs specifies the number of retries
before considering the entire Job as failed. This enhancement allows each index within an Indexed
Job to have its own backoff limit, providing more granular control over retry behavior for
individual tasks. This ensures that the failure of specific indices does not prematurely terminate
the entire Job, allowing the other indices to continue processing independently.

This work was done as part of
[KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) led by SIG Apps.

### Job success policy

Using `.spec.successPolicy`, users can specify which pod indexes must succeed (`succeededIndexes`),
how many pods must succeed (`succeededCount`), or a combination of both. This feature benefits
various workloads, including simulations where partial completion is sufficient, and leader-worker
patterns where only the leader's success determines the Job's overall outcome.

This work was done as part of [KEP-3998: Job success/completion policy](https://kep.k8s.io/3998) led
by SIG Apps.

### Bound ServiceAccount token security improvements

This enhancement introduced features such as including a unique token identifier (i.e.
[JWT ID Claim, also known as JTI](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.7)) and
node information within the tokens, enabling more precise validation and auditing. Additionally, it
supports node-specific restrictions, ensuring that tokens are only usable on designated nodes,
thereby reducing the risk of token misuse and potential security breaches. These improvements, now
generally available, aim to enhance the overall security posture of service account tokens within
Kubernetes clusters.

This work was done as part of
[KEP-4193: Bound service account token improvements](https://kep.k8s.io/4193) led by SIG Auth.

### Subresource support in kubectl

The `--subresource` argument is now generally available for kubectl subcommands such as `get`,
`patch`, `edit`, `apply` and `replace`, allowing users to fetch and update subresources for all
resources that support them. To learn more about the subresources supported, visit the
[kubectl reference](/docs/reference/kubectl/conventions/#subresources).

This work was done as part of
[KEP-2590: Add subresource support to kubectl](https://kep.k8s.io/2590) led by SIG CLI.

### Multiple Service CIDRs

This enhancement introduced a new implementation of allocation logic for Service IPs. Across the
whole cluster, every Service of `type: ClusterIP` must have a unique IP address assigned to it.
Trying to create a Service with a specific cluster IP that has already been allocated will return an
error. The updated IP address allocator logic uses two newly stable API objects: `ServiceCIDR` and
`IPAddress`. Now generally available, these APIs allow cluster administrators to dynamically
increase the number of IP addresses available for `type: ClusterIP` Services (by creating new
ServiceCIDR objects).

This work was done as part of [KEP-1880: Multiple Service CIDRs](https://kep.k8s.io/1880) led by SIG
Network.

### `nftables` backend for kube-proxy

The `nftables` backend for kube-proxy is now stable, adding a new implementation that significantly
improves performance and scalability for Services implementation within Kubernetes clusters. For
compatibility reasons, `iptables` remains the default on Linux nodes. Check the
[migration guide](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables)
if you want to try it out.

This work was done as part of [KEP-3866: nftables kube-proxy backend](https://kep.k8s.io/3866) led
by SIG Network.

### Topology aware routing with `trafficDistribution: PreferClose`

This release graduates topology-aware routing and traffic distribution to GA, which would allow us
to optimize service traffic in multi-zone clusters. The topology-aware hints in EndpointSlices would
enable components like kube-proxy to prioritize routing traffic to endpoints within the same zone,
thereby reducing latency and cross-zone data transfer costs. Building upon this,
`trafficDistribution` field is added to the Service specification, with the `PreferClose` option
directing traffic to the nearest available endpoints based on network topology. This configuration
enhances performance and cost-efficiency by minimizing inter-zone communication.

This work was done as part of [KEP-4444: Traffic Distribution for Services](https://kep.k8s.io/4444)
and [KEP-2433: Topology Aware Routing](https://kep.k8s.io/2433) led by SIG Network.

### Options to reject non SMT-aligned workload

This feature added policy options to the CPU Manager, enabling it to reject workloads that do not
align with Simultaneous Multithreading (SMT) configurations. This enhancement, now generally
available, ensures that when a pod requests exclusive use of CPU cores, the CPU Manager can enforce
allocation of entire core pairs (comprising primary and sibling threads) on SMT-enabled systems,
thereby preventing scenarios where workloads share CPU resources in unintended ways.

This work was done as part of
[KEP-2625: node: cpumanager: add options to reject non SMT-aligned workload](https://kep.k8s.io/2625)
led by SIG Node.

### Defining Pod affinity or anti-affinity using `matchLabelKeys` and `mismatchLabelKeys`

The `matchLabelKeys` and `mismatchLabelKeys` fields are available in Pod affinity terms, enabling
users to finely control the scope where Pods are expected to co-exist (Affinity) or not
(AntiAffinity). These newly stable options complement the existing `labelSelector` mechanism. The
affinity fields facilitate enhanced scheduling for versatile rolling updates, as well as isolation
of services managed by tools or controllers based on global configurations.

This work was done as part of
[KEP-3633: Introduce MatchLabelKeys to Pod Affinity and Pod Anti Affinity](https://kep.k8s.io/3633)
led by SIG Scheduling.

### Considering taints and tolerations when calculating Pod topology spread skew

This enhanced `PodTopologySpread` by introducing two fields: `nodeAffinityPolicy` and
`nodeTaintsPolicy`. These fields allow users to specify whether node affinity rules and node taints
should be considered when calculating pod distribution across nodes. By default,
`nodeAffinityPolicy` is set to `Honor`, meaning only nodes matching the pod's node affinity or
selector are included in the distribution calculation. The `nodeTaintsPolicy` defaults to `Ignore`,
indicating that node taints are not considered unless specified. This enhancement provides finer
control over pod placement, ensuring that pods are scheduled on nodes that meet both affinity and
taint toleration requirements, thereby preventing scenarios where pods remain pending due to
unsatisfied constraints.

This work was done as part of
[KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://kep.k8s.io/3094)
led by SIG Scheduling.

### Volume populators

After being released as beta in v1.24, _volume populators_ have graduated to GA in v1.33. This newly
stable feature provides a way to allow users to pre-populate volumes with data from various sources,
and not just from PersistentVolumeClaim (PVC) clones or volume snapshots. The mechanism relies on
the `dataSourceRef` field within a PersistentVolumeClaim. This field offers more flexibility than
the existing `dataSource` field, and allows for custom resources to be used as data sources.

A special controller, `volume-data-source-validator`, validates these data source references,
alongside a newly stable CustomResourceDefinition (CRD) for an API kind named VolumePopulator. The
VolumePopulator API allows volume populator controllers to register the types of data sources they
support. You need to set up your cluster with the appropriate CRD in order to use volume populators.

This work was done as part of [KEP-1495: Generic data populators](https://kep.k8s.io/1495) led by
SIG Storage.

### Always honor PersistentVolume reclaim policy

This enhancement addressed an issue where the Persistent Volume (PV) reclaim policy is not
consistently honored, leading to potential storage resource leaks. Specifically, if a PV is deleted
before its associated Persistent Volume Claim (PVC), the "Delete" reclaim policy may not be
executed, leaving the underlying storage assets intact. To mitigate this, Kubernetes now sets
finalizers on relevant PVs, ensuring that the reclaim policy is enforced regardless of the deletion
sequence. This enhancement prevents unintended retention of storage resources and maintains
consistency in PV lifecycle management.

This work was done as part of
[KEP-2644: Always Honor PersistentVolume Reclaim Policy](https://kep.k8s.io/2644) led by SIG
Storage.

## New features in Beta

_This is a selection of some of the improvements that are now beta following the v1.33 release._

### Support for Direct Service Return (DSR) in Windows kube-proxy

DSR provides performance optimizations by allowing the return traffic routed through load balancers
to bypass the load balancer and respond directly to the client; reducing load on the load balancer
and also reducing overall latency. For information on DSR on Windows, read
[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).

Initially introduced in v1.14, support for DSR has been promoted to beta by SIG Windows as part of
[KEP-5100: Support for Direct Service Return (DSR) and overlay networking in Windows kube-proxy](https://kep.k8s.io/5100).

### Structured parameter support

While structured parameter support continues as a beta feature in Kubernetes v1.33, this core part
of Dynamic Resource Allocation (DRA) has seen significant improvements. A new v1beta2 version
simplifies the `resource.k8s.io` API, and regular users with the namespaced cluster `edit` role can
now use DRA.

The `kubelet` now includes seamless upgrade support, enabling drivers deployed as DaemonSets to use
a rolling update mechanism. For DRA implementations, this prevents the deletion and re-creation of
ResourceSlices, allowing them to remain unchanged during upgrades. Additionally, a 30-second grace
period has been introduced before the `kubelet` cleans up after unregistering a driver, providing
better support for drivers that do not use rolling updates.

This work was done as part of [KEP-4381: DRA: structured parameters](https://kep.k8s.io/4381) by WG
Device Management, a cross-functional team including SIG Node, SIG Scheduling, and SIG Autoscaling.

### Dynamic Resource Allocation (DRA) for network interfaces

The standardized reporting of network interface data via DRA, introduced in v1.32, has graduated to
beta in v1.33. This enables more native Kubernetes network integrations, simplifying the development
and management of networking devices. This was covered previously in the
[v1.32 release announcement blog](/blog/2024/12/11/kubernetes-v1-32-release/#dra-standardized-network-interface-data-for-resource-claim-status).

This work was done as part of
[KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817)
led by SIG Network, SIG Node, and WG Device Management.

### Handle unscheduled pods early when scheduler does not have any pod on activeQ

This feature improves queue scheduling behavior. Behind the scenes, the scheduler achieves this by
popping pods from the _backoffQ_, which are not backed off due to errors, when the _activeQ_ is
empty. Previously, the scheduler would become idle even when the _activeQ_ was empty; this
enhancement improves scheduling efficiency by preventing that.

This work was done as part of
[KEP-5142: Pop pod from backoffQ when activeQ is empty](https://kep.k8s.io/5142) led by SIG
Scheduling.

### Asynchronous preemption in the Kubernetes Scheduler

Preemption ensures higher-priority pods get the resources they need by evicting lower-priority ones.
Asynchronous Preemption, introduced in v1.32 as alpha, has graduated to beta in v1.33. With this
enhancement, heavy operations such as API calls to delete pods are processed in parallel, allowing
the scheduler to continue scheduling other pods without delays. This improvement is particularly
beneficial in clusters with high Pod churn or frequent scheduling failures, ensuring a more
efficient and resilient scheduling process.

This work was done as part of
[KEP-4832: Asynchronous preemption in the scheduler](https://kep.k8s.io/4832) led by SIG Scheduling.

### ClusterTrustBundles

ClusterTrustBundle, a cluster-scoped resource designed for holding X.509 trust anchors (root
certificates), has graduated to beta in v1.33. This API makes it easier for in-cluster certificate
signers to publish and communicate X.509 trust anchors to cluster workloads.

This work was done as part of
[KEP-3257: ClusterTrustBundles (previously Trust Anchor Sets)](https://kep.k8s.io/3257) led by SIG
Auth.

### Fine-grained SupplementalGroups control

Introduced in v1.31, this feature graduates to beta in v1.33 and is now enabled by default. Provided
that your cluster has the `SupplementalGroupsPolicy` feature gate enabled, the
`supplementalGroupsPolicy` field within a Pod's `securityContext` supports two policies: the default
Merge policy maintains backward compatibility by combining specified groups with those from the
container image's `/etc/group` file, whereas the new Strict policy applies only to explicitly
defined groups.

This enhancement helps to address security concerns where implicit group memberships from container
images could lead to unintended file access permissions and bypass policy controls.

This work was done as part of
[KEP-3619: Fine-grained SupplementalGroups control](https://kep.k8s.io/3619) led by SIG Node.

### Support for mounting images as volumes

Support for using Open Container Initiative (OCI) images as volumes in Pods, introduced in v1.31,
has graduated to beta. This feature allows users to specify an image reference as a volume in a Pod
while reusing it as a volume mount within containers. It opens up the possibility of packaging the
volume data separately, and sharing them among containers in a Pod without including them in the
main image, thereby reducing vulnerabilities and simplifying image creation.

This work was done as part of
[KEP-4639: VolumeSource: OCI Artifact and/or Image](https://kep.k8s.io/4639) led by SIG Node and SIG
Storage.

### Support for user namespaces within Linux Pods

One of the oldest open KEPs as of writing is [KEP-127](https://kep.k8s.io/127), Pod security
improvement by using Linux [User namespaces](/docs/concepts/workloads/pods/user-namespaces/) for
Pods. This KEP was first opened in late 2016, and after multiple iterations, had its alpha release
in v1.25, initial beta in v1.30 (where it was disabled by default), and has moved to on-by-default
beta as part of v1.33.

This support will not impact existing Pods unless you manually specify `pod.spec.hostUsers` to opt
in. As highlighted in the
[v1.30 sneak peek blog](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/), this is an important
milestone for mitigating vulnerabilities.

This work was done as part of [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127) led
by SIG Node.

### Pod `procMount` option

The `procMount` option, introduced as alpha in v1.12, and off-by-default beta in v1.31, has moved to
an on-by-default beta in v1.33. This enhancement improves Pod isolation by allowing users to
fine-tune access to the `/proc` filesystem. Specifically, it adds a field to the Pod
`securityContext` that lets you override the default behavior of masking and marking certain `/proc`
paths as read-only. This is particularly useful for scenarios where users want to run unprivileged
containers inside the Kubernetes Pod using user namespaces. Normally, the container runtime (via the
CRI implementation) starts the outer container with strict `/proc` mount settings. However, to
successfully run nested containers with an unprivileged Pod, users need a mechanism to relax those
defaults, and this feature provides exactly that.

This work was done as part of [KEP-4265: add ProcMount option](https://kep.k8s.io/4265) led by SIG
Node.

### CPUManager policy to distribute CPUs across NUMA nodes

This feature adds a new policy option for the CPU Manager to distribute CPUs across Non-Uniform
Memory Access (NUMA) nodes, rather than concentrating them on a single node. It optimizes CPU
resource allocation by balancing workloads across multiple NUMA nodes, thereby improving performance
and resource utilization in multi-NUMA systems.

This work was done as part of
[KEP-2902: Add CPUManager policy option to distribute CPUs across NUMA nodes instead of packing them](https://kep.k8s.io/2902)
led by SIG Node.

### Zero-second sleeps for container PreStop hooks

Kubernetes 1.29 introduced a Sleep action for the `preStop` lifecycle hook in Pods, allowing
containers to pause for a specified duration before termination. This provides a straightforward
method to delay container shutdown, facilitating tasks such as connection draining or cleanup
operations.

The Sleep action in a `preStop` hook can now accept a zero-second duration as a beta feature. This
allows defining a no-op `preStop` hook, which is useful when a `preStop` hook is required but no
delay is desired.

This work was done as part of
[KEP-3960: Introducing Sleep Action for PreStop Hook](https://kep.k8s.io/3960) and
[KEP-4818: Allow zero value for Sleep Action of PreStop Hook](https://kep.k8s.io/4818) led by SIG
Node.

### Internal tooling for declarative validation of Kubernetes-native types

Behind the scenes, the internals of Kubernetes are starting to use a new mechanism for validating
objects and changes to objects. Kubernetes v1.33 introduces `validation-gen`, an internal tool that
Kubernetes contributors use to generate declarative validation rules. The overall goal is to improve
the robustness and maintainability of API validations by enabling developers to specify validation
constraints declaratively, reducing manual coding errors and ensuring consistency across the
codebase.

This work was done as part of
[KEP-5073: Declarative Validation Of Kubernetes Native Types With validation-gen](https://kep.k8s.io/5073)
led by SIG API Machinery.

## New features in Alpha

_This is a selection of some of the improvements that are now alpha following the v1.33 release._

### Configurable tolerance for HorizontalPodAutoscalers

This feature introduces configurable tolerance for HorizontalPodAutoscalers, which dampens scaling
reactions to small metric variations.

This work was done as part of
[KEP-4951: Configurable tolerance for Horizontal Pod Autoscalers](https://kep.k8s.io/4951) led by
SIG Autoscaling.

### Configurable container restart delay

Introduced as alpha1 in v1.32, this feature provides a set of kubelet-level configurations to
fine-tune how CrashLoopBackOff is handled.

This work was done as part of [KEP-4603: Tune CrashLoopBackOff](https://kep.k8s.io/4603) led by SIG
Node.

### Custom container stop signals

Before Kubernetes v1.33, stop signals could only be set in container image definitions (for example,
via the `StopSignal` configuration field in the image metadata). If you wanted to modify termination
behavior, you needed to build a custom container image. By enabling the (alpha)
`ContainerStopSignals` feature gate in Kubernetes v1.33, you can now define custom stop signals
directly within Pod specifications. This is defined in the container's `lifecycle.stopSignal` field
and requires the Pod's `spec.os.name` field to be present. If unspecified, containers fall back to
the image-defined stop signal (if present), or the container runtime default (typically SIGTERM for
Linux).

This work was done as part of [KEP-4960: Container Stop Signals](https://kep.k8s.io/4960) led by SIG
Node.

### DRA enhancements galore!

Kubernetes v1.33 continues to develop Dynamic Resource Allocation (DRA) with features designed for
today’s complex infrastructures. DRA is an API for requesting and sharing resources between pods and
containers inside a pod. Typically those resources are devices such as GPUs, FPGAs, and network
adapters.

The following are all the alpha DRA feature gates introduced in v1.33:

- Similar to Node taints, by enabling the `DRADeviceTaints` feature gate, devices support taints and
  tolerations. An admin or a control plane component can taint devices to limit their usage.
  Scheduling of pods which depend on those devices can be paused while a taint exists and/or pods
  using a tainted device can be evicted.
- By enabling the feature gate `DRAPrioritizedList`, DeviceRequests get a new field named
  `firstAvailable`. This field is an ordered list that allows the user to specify that a request may
  be satisfied in different ways, including allocating nothing at all if some specific hardware is
  not available.
- With feature gate `DRAAdminAccess` enabled, only users authorized to create ResourceClaim or
  ResourceClaimTemplate objects in namespaces labeled with `resource.k8s.io/admin-access: "true"`
  can use the `adminAccess` field. This ensures that non-admin users cannot misuse the `adminAccess`
  feature.
- While it has been possible to consume device partitions since v1.31, vendors had to pre-partition
  devices and advertise them accordingly. By enabling the `DRAPartitionableDevices` feature gate in
  v1.33, device vendors can advertise multiple partitions, including overlapping ones. The
  Kubernetes scheduler will choose the partition based on workload requests, and prevent the
  allocation of conflicting partitions simultaneously. This feature gives vendors the ability to
  dynamically create partitions at allocation time. The allocation and dynamic partitioning are
  automatic and transparent to users, enabling improved resource utilization.

These feature gates have no effect unless you also enable the `DynamicResourceAllocation` feature
gate.

This work was done as part of
[KEP-5055: DRA: device taints and tolerations](https://kep.k8s.io/5055),
[KEP-4816: DRA: Prioritized Alternatives in Device Requests](https://kep.k8s.io/4816),
[KEP-5018: DRA: AdminAccess for ResourceClaims and ResourceClaimTemplates](https://kep.k8s.io/5018),
and [KEP-4815: DRA: Add support for partitionable devices](https://kep.k8s.io/4815), led by SIG
Node, SIG Scheduling and SIG Auth.

### Robust image pull policy to authenticate images for `IfNotPresent` and `Never`

This feature allows users to ensure that kubelet requires an image pull authentication check for
each new set of credentials, regardless of whether the image is already present on the node.

This work was done as part of [KEP-2535: Ensure secret pulled images](https://kep.k8s.io/2535) led
by SIG Auth.

### Node topology labels are available via downward API

This feature enables Node topology labels to be exposed via the downward API. Prior to Kubernetes
v1.33, a workaround involved using an init container to query the Kubernetes API for the underlying
node; this alpha feature simplifies how workloads can access Node topology information.

This work was done as part of
[KEP-4742: Expose Node labels via downward API](https://kep.k8s.io/4742) led by SIG Node.

### Better pod status with generation and observed generation

Prior to this change, the `metadata.generation` field was unused in pods. Along with extending to
support `metadata.generation`, this feature will introduce `status.observedGeneration` to provide
clearer pod status.

This work was done as part of [KEP-5067: Pod Generation](https://kep.k8s.io/5067) led by SIG Node.

### Support for split level 3 cache architecture with kubelet’s CPU Manager

The previous kubelet’s CPU Manager was unaware of split L3 cache architecture (also known as Last
Level Cache, or LLC), and can potentially distribute CPU assignments without considering the split
L3 cache, causing a noisy neighbor problem. This alpha feature improves the CPU Manager to better
assign CPU cores for better performance.

This work was done as part of
[KEP-5109: Split L3 Cache Topology Awareness in CPU Manager](https://kep.k8s.io/5109) led by SIG
Node.

### PSI (Pressure Stall Information) metrics for scheduling improvements

This feature adds support on Linux nodes for providing PSI stats and metrics using cgroupv2. It can
detect resource shortages and provide nodes with more granular control for pod scheduling.

This work was done as part of [KEP-4205: Support PSI based on cgroupv2](https://kep.k8s.io/4205) led
by SIG Node.

### Secret-less image pulls with kubelet

The kubelet's on-disk credential provider now supports optional Kubernetes ServiceAccount (SA) token
fetching. This simplifies authentication with image registries by allowing cloud providers to better
integrate with OIDC compatible identity solutions.

This work was done as part of
[KEP-4412: Projected service account tokens for Kubelet image credential providers](https://kep.k8s.io/4412)
led by SIG Auth.

## Graduations, deprecations, and removals in v1.33

### Graduations to stable

This lists all the features that have graduated to stable (also known as _general availability_).
For a full list of updates including new features and graduations from alpha to beta, see the
release notes.

This release includes a total of 18 enhancements promoted to stable:

- [Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/issues/3094)
- [Introduce `MatchLabelKeys` to Pod Affinity and Pod Anti Affinity](https://github.com/kubernetes/enhancements/issues/3633)
- [Bound service account token improvements](https://github.com/kubernetes/enhancements/issues/4193)
- [Generic data populators](https://github.com/kubernetes/enhancements/issues/1495)
- [Multiple Service CIDRs](https://github.com/kubernetes/enhancements/issues/1880)
- [Topology Aware Routing](https://github.com/kubernetes/enhancements/issues/2433)
- [Portworx file in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/2589)
- [Always Honor PersistentVolume Reclaim Policy](https://github.com/kubernetes/enhancements/issues/2644)
- [nftables kube-proxy backend](https://github.com/kubernetes/enhancements/issues/3866)
- [Deprecate status.nodeInfo.kubeProxyVersion field](https://github.com/kubernetes/enhancements/issues/4004)
- [Add subresource support to kubectl](https://github.com/kubernetes/enhancements/issues/2590)
- [Backoff Limit Per Index For Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3850)
- [Job success/completion policy](https://github.com/kubernetes/enhancements/issues/3998)
- [Sidecar Containers](https://github.com/kubernetes/enhancements/issues/753)
- [CRD Validation Ratcheting](https://github.com/kubernetes/enhancements/issues/4008)
- [node: cpumanager: add options to reject non SMT-aligned workload](https://github.com/kubernetes/enhancements/issues/2625)
- [Traffic Distribution for Services](https://github.com/kubernetes/enhancements/issues/4444)
- [Recursive Read-only (RRO) mounts](https://github.com/kubernetes/enhancements/issues/3857)

### Deprecations and removals

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better
ones to improve the project's overall health. See the Kubernetes
[deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on
this process. Many of these deprecations and removals were announced in the
[Deprecations and Removals blog post](/blog/2025/03/26/kubernetes-v1-33-upcoming-changes/).

#### Deprecation of the stable Endpoints API

The [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) API has been stable since
v1.21, which effectively replaced the original Endpoints API. While the original Endpoints API was
simple and straightforward, it also posed some challenges when scaling to large numbers of network
endpoints. The EndpointSlices API has introduced new features such as dual-stack networking, making
the original Endpoints API ready for deprecation.

This deprecation affects only those who use the Endpoints API directly from workloads or scripts;
these users should migrate to use EndpointSlices instead. There will be a dedicated blog post with
more details on the deprecation implications and migration plans.

You can find more in [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974).

#### Removal of kube-proxy version information in node status

Following its deprecation in v1.31, as highlighted in the v1.31
[release announcement](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004),
the `.status.nodeInfo.kubeProxyVersion` field for Nodes was removed in v1.33.

This field was set by kubelet, but its value was not consistently accurate. As it has been disabled
by default since v1.31, this field has been removed entirely in v1.33.

You can find more in
[KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004).

#### Removal of in-tree gitRepo volume driver

The gitRepo volume type has been deprecated since v1.11, nearly 7 years ago. Since its deprecation,
there have been security concerns, including how gitRepo volume types can be exploited to gain
remote code execution as root on the nodes. In v1.33, the in-tree driver code is removed.

There are alternatives such as git-sync and initContainers. `gitVolumes` in the Kubernetes API is
not removed, and thus pods with `gitRepo` volumes will be admitted by kube-apiserver, but kubelets
with the feature-gate `GitRepoVolumeDriver` set to false will not run them and return an appropriate
error to the user. This allows users to opt-in to re-enabling the driver for 3 versions to give them
enough time to fix workloads.

The feature gate in kubelet and in-tree plugin code is planned to be removed in the v1.39 release.

You can find more in [KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040).

#### Removal of host network support for Windows pods

Windows Pod networking aimed to achieve feature parity with Linux and provide better cluster density
by allowing containers to use the Node’s networking namespace. The original implementation landed as
alpha with v1.26, but because it faced unexpected containerd behaviours and alternative solutions
were available, the Kubernetes project has decided to withdraw the associated KEP. Support was fully
removed in v1.33.

Please note that this does not affect
[HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/), which
provides host network as well as host level access. The KEP withdrawn in v1.33 was about providing
the host network only, which was never stable due to technical limitations with Windows networking
logic.

You can find more in [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503).

## Release notes

Check out the full details of the Kubernetes v1.33 release in our
[release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md).

## Availability

Kubernetes v1.33 is available for download on
[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.33.0) or on the
[Kubernetes download page](/releases/download/).

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run
local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily
install v1.33 using
[kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Release
Team is made up of dedicated community volunteers who work together to build the many pieces that
make up the Kubernetes releases you rely on. This requires the specialized skills of people from all
corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire
[Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.33/release-team.md)
for the hours spent hard at work to deliver the Kubernetes v1.33 release to our community. The
Release Team's membership ranges from first-time shadows to returning team leads with experience
forged over several release cycles. There was a new team structure adopted in this release cycle,
which was to combine Release Notes and Docs subteams into a unified subteam of Docs. Thanks to the
meticulous effort in organizing the relevant information and resources from the new Docs team, both
Release Notes and Docs tracking have seen a smooth and successful transition. Finally, a very
special thanks goes out to our release lead, Nina Polshakova, for her support throughout a
successful release cycle, her advocacy, her efforts to ensure that everyone could contribute
effectively, and her challenges to improve the release process.

## Project velocity

The CNCF K8s
[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
project aggregates several interesting data points related to the velocity of Kubernetes and various
subprojects. This includes everything from individual contributions, to the number of companies
contributing, and illustrates the depth and breadth of effort that goes into evolving this
ecosystem.

During the v1.33 release cycle, which spanned 15 weeks from January 13 to April 23, 2025, Kubernetes
received contributions from as many as 121 different companies and 570 individuals (as of writing, a
few weeks before the release date). In the wider cloud native ecosystem, the figure goes up to 435
companies counting 2400 total contributors. You can find the data source in
[this dashboard](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes&from=1736755200000&to=1745477999000).
Compared to the
[velocity data from previous release, v1.32](/blog/2024/12/11/kubernetes-v1-32-release/#project-velocity),
we see a similar level of contribution from companies and individuals, indicating strong community
interest and engagement.

Note that, “contribution” counts when someone makes a commit, code review, comment, creates an issue
or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs. If you are
interested in contributing, visit
[Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor
website.

[Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
to learn more about the overall velocity of the Kubernetes project and community.

## Event update

Explore upcoming Kubernetes and cloud native events, including KubeCon + CloudNativeCon, KCD, and
other notable conferences worldwide. Stay informed and get involved with the Kubernetes community!

**May 2025**

- [**KCD - Kubernetes Community Days: Costa Rica**](https://community.cncf.io/events/details/cncf-kcd-costa-rica-presents-kcd-costa-rica-2025/):
  May 3, 2025 | Heredia, Costa Rica
- [**KCD - Kubernetes Community Days: Helsinki**](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kcd-helsinki-2025/):
  May 6, 2025 | Helsinki, Finland
- [**KCD - Kubernetes Community Days: Texas Austin**](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-austin-2025/):
  May 15, 2025 | Austin, USA
- [**KCD - Kubernetes Community Days: Seoul**](https://community.cncf.io/events/details/cncf-kcd-south-korea-presents-kcd-seoul-2025/):
  May 22, 2025 | Seoul, South Korea
- [**KCD - Kubernetes Community Days: Istanbul, Turkey**](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2025/):
  May 23, 2025 | Istanbul, Turkey
- [**KCD - Kubernetes Community Days: San Francisco Bay Area**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/):
  May 28, 2025 | San Francisco, USA

**June 2025**

- [**KCD - Kubernetes Community Days: New York**](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2025/):
  June 4, 2025 | New York, USA
- [**KCD - Kubernetes Community Days: Czech & Slovak**](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-bratislava-2025/):
  June 5, 2025 | Bratislava, Slovakia
- [**KCD - Kubernetes Community Days: Bengaluru**](https://community.cncf.io/events/details/cncf-kcd-bengaluru-presents-kubernetes-community-days-bengaluru-2025-in-person/):
  June 6, 2025 | Bangalore, India
- [**KubeCon + CloudNativeCon China 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/):
  June 10-11, 2025 | Hong Kong
- [**KCD - Kubernetes Community Days: Antigua Guatemala**](https://community.cncf.io/events/details/cncf-kcd-guatemala-presents-kcd-antigua-guatemala-2025/):
  June 14, 2025 | Antigua Guatemala, Guatemala
- [**KubeCon + CloudNativeCon Japan 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan):
  June 16-17, 2025 | Tokyo, Japan
- [**KCD - Kubernetes Community Days: Nigeria, Africa**](https://www.cncf.io/kcds/): June 19, 2025 |
  Nigeria, Africa

**July 2025**

- [**KCD - Kubernetes Community Days: Utrecht**](https://community.cncf.io/events/details/cncf-kcd-netherlands-presents-kcd-utrecht-2025/):
  July 4, 2025 | Utrecht, Netherlands
- [**KCD - Kubernetes Community Days: Taipei**](https://community.cncf.io/events/details/cncf-kcd-taiwan-presents-kcd-taipei-2025/):
  July 5, 2025 | Taipei, Taiwan
- [**KCD - Kubernetes Community Days: Lima, Peru**](https://community.cncf.io/events/details/cncf-kcd-lima-peru-presents-kcd-lima-peru-2025/):
  July 19, 2025 | Lima, Peru

**August 2025**

- [**KubeCon + CloudNativeCon India 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india-2025/):
  August 6-7, 2025 | Hyderabad, India
- [**KCD - Kubernetes Community Days: Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/):
  August 29, 2025 | Bogotá, Colombia

You can find the latest KCD details [here](https://www.cncf.io/kcds/).

## Upcoming release webinar

Join members of the Kubernetes v1.33 Release Team on **Friday, May 16th 2025 at 4:00 PM (UTC)**, to
learn about the release highlights of this release, as well as deprecations and removals to help
plan for upgrades. For more information and registration, visit the
[event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-133-release/)
on the CNCF Online Programs site.

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many
[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs)
that align with your interests. Have something you’d like to broadcast to the Kubernetes community?
Share your voice at our weekly
[community meeting](https://github.com/kubernetes/community/tree/master/communication), and through
the channels below. Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest
  updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on
  [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes
  [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the
  [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
