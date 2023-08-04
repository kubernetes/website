---
layout: blog
title: "Kubernetes v1.28: <name-here>"
date: 2023-08-02
slug: kubernetes-v1-28-release
---

**Authors**: [Kubernetes v1.28 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.28/release-team.md)

Announcing the release of Kubernetes v1.28 <name-here>, the second release of 2023!

This release consists of 46 enhancements. 20 of those enhancements are entering Alpha, 14 are graduating to Beta, and 12 are graduating to Stable.

## Release Theme And Logo

**Kubernetes v1.28: *<name-here>*

The theme for Kubernetes v1.28 is *<name-here>*.

{{< figure src="/images/blog/2023-07-02-kubernetes-1.28-blog/kubernetes-1.28.png" alt="Kubernetes 1.28 <name-here> logo" class="release-logo" >}}

Talk about release <here> - waiting for the theme

Special thanks to [someone](https://www.some-link) for creating the logo.

# What's New (Major Themes)
    
## Improvements to CustomResourceDefinition validation expressions 

This [Common Expression Language (CEL)](https://github.com/google/cel-go) can be used to validate custom resources. The primary goal is to allow the majority of the validation use cases that currently must be handled by a webhook, to instead be handled by adding inline validation expressions directly into the schema of a CRD.
    
CRDs need direct support for non-trivial validation. While admission webhooks do support CRDs validation, they significantly complicate the development and operability of CRDs.

This KEP proposes that an inline expression language be integrated directly into CRDs such that a much larger portion of validation use cases can be solved without the use of webhooks. When selecting an expression language, we want to be sure that it can support defaulting and CRD conversion in the future.

It is sufficiently lightweight and safe to be run directly in the kube-apiserver (since CRD creation is a privileged operation), has a straight-forward and unsurprising grammar, and supports pre-parsing and type checking of expressions, allowing syntax and type errors to be caught at CRD registration time.

## ValidatingAdmissionPolicies graduate to beta
    
Common Expression language for admission control is customizable, in-process validation of requests to the Kubernetes API server as an alternative to validating admission webhooks.

This builds on the capabilities of the CRD Validation Rules feature that graduated to beta in 1.25 but with a focus on the policy enforcement capabilities of validating admission control.
    
This will lower the infrastructure barrier to enforcing customizable policies as well as providing primitives that help the community establish and adhere to the best practices of both K8s and its extensions.
        
## Match conditions for admission webhooks
    
Introduce CEL expression filters to webhooks, to allow webhooks to be scoped more narrowly.

This adds "match conditions" to admission webhooks, as an extension to the existing rules to define the scope of a webhook. A matchCondition is a CEL expression that must evaluate to true for the admission request to be sent to the webhook. If a matchCondition evaluates to false, the webhook is skipped for that request (implicitly allowed).
    
ValidatingAdmissionPolicy is an exciting new feature that we hope will greatly reduce the need for admission webhooks, but it is intentionally not attempting to cover every possible use case. This proposal aims to improve the situation for those webhooks that cannot be migrated.
    
## Mixed version proxy

When a cluster has multiple API servers at mixed versions (such as during an upgrade/downgrade or when runtime-config changes and a rollout happens), not every apiserver can serve every resource at every version.

To fix this, the filter is added to the handler chain in the aggregator which proxies clients to an API server that is capable of handling their request.
    
When an upgrade or downgrade is performed on a cluster, for some period of time the api servers are at differing versions and are able to serve different sets of built-in resources (different groups, versions, and resources are all possible).

## CRD Validation Ratcheting
    
This Allows CRs to fail validation if the patch did not alter any of the invalid fields.  The ability to shift left validation logic from controllers to the front end is a long-term goal for improving the useability of the Kubernetes project.
    
## Add Generic Control Plane Staging Repositories

This factors the kube-apiserver to build on a new staging repository that consumes k/apiserver but has a bigger, carefully chosen subset of the functionality of kube-apiserver such that it is reusable.

The factoring will be progressive: we will start with a new repo that adds
nothing to k/apiserver, and then progressively move generic functionality from
kube-apiserver to the new repository. The new repo will be named
k/generic-controlplane.
  
## CDI Support To The Device Plugin API

CDI provides a standardized way of injecting complex devices into a container (i.e. devices that logically require more than just a single /dev node to be injected for them to work). This new feature enables plugin developers to utilize the CDIDevices field added to the CRI in 1.27 to pass CDI devices directly to CDI enabled runtimes (of which containerd and crio-o are in recent releases).
    
## API awareness of sidecar containers (alpha)

This introduces a restartPolicy field to init containers and uses it to indicate that an init container is a sidecar container. Kubelet will start init containers with restartPolicy=Always in the order with other init containers, but instead of waiting for its completion, it will wait for the container startup completion.

The condition for startup completion will be that the startup probe succeeded (or if no startup probe is defined) and postStart handler is completed. This condition is represented with the field Started of ContainerStatus type. See the section "Pod startup completed condition" for considerations on picking this signal.

The field restartPolicy will only be accepted on init containers. The only supported value now is Always. No other values will be defined. Moreover, the field will be nullable so the default value will be "no value".

Other values for restartPolicy of containers will not be accepted and containers will follow the logic currently implemented.

Sidecar containers do not block Pod completion: if all regular containers are complete, sidecar
containers in that Pod will be terminated.

During the sidecar startup stage, the restart behavior will be similar to init containers. If the Pod restartPolicy is Never, the sidecar container that failed during startup will NOT be restarted and the whole Pod will fail. If the Pod restartPolicy is Always or OnFailure, it will be restarted.

Once the sidecar container is started (postStart completed and startup probe succeeded), these containers will be restarted even when the Pod restartPolicy is Never or OnFailure. Furthermore, sidecar containers will be restarted even during Pod termination.

In order to minimize OOM kills of sidecar containers, the OOM adjustment for these containers will match or exceed the OOM score adjustment of regular containers in the Pod.

This also enables sidecar containers (those will not be allowed for other init containers):

- PostStart and PreStop lifecycle handlers for sidecar containers
- All probes (startup, readiness, liveness)
    
Readiness probes of sidecars will contribute to determining the whole Pod readiness.
    
## Node System Memory Swap Support
    
This adds swap support to nodes in a controlled, predictable manner so that Kubernetes users can perform testing and provide data to continue building cluster capabilities on top of swap.

There are two distinct types of users for swap, who may overlap:

- Node administrators, who may want swap available for node-level performance tuning and stability/reducing noisy neighbor issues.
    
- Application developers, who have written applications that would benefit from using swap memory. There are hence a number of possible ways that one could envision swap use on a node.
   
## Add Support To Handle Non-graceful Node Shutdown
    
This feature allows stateful workloads to restart on a different node if the original node is shut down unexpectedly or ends up in a non-recoverable state perhaps due to hardware failure or unresponsive OS.

This allows stateful workloads to failover to a different node successfully after the original node is shut down or in a non-recoverable state such as the hardware failure or broken OS.
    
The Graceful Node Shutdown introduces a way to detect a node shutdown and handle it gracefully. However, a node shutdown action may not be detected by Kubelet's Node Shutdown Manager, either because the command does not trigger the inhibitor locks mechanism used by Kubelet or because of a user error, i.e., the ShutdownGracePeriod and ShutdownGracePeriodCriticalPods are not configured properly.

When a node is shutdown but not detected by Kubelet's Node Shutdown Manager, the pods that are part of a StatefulSet will be stuck in terminating status on the shutdown node and cannot move to a new running node. This is because Kubelet on the shutdown node is not available to delete the pods so the StatefulSet cannot create a new pod with the same name. If there are volumes used by the pods, the VolumeAttachments will not be deleted from the original shutdown node so the volumes used by these pods cannot be attached to a new running node. As a result, the application running on the StatefulSet cannot function properly. If the original shutdown node comes up, the pods will be deleted by Kubelet and new pods will be created on a different running node. If the original shutdown node does not come up, these pods will be stuck in terminating status on the shutdown node forever.

This handles node shutdown cases that are not detected by Kubelet's Node Shutdown Manager. The pods will be forcefully deleted in this case, triggering the deletion of the VolumeAttachments, and new pods will be created on a new running node so that application can continue to function.

## Retroactive Default StorageClass Assignment
    
This feature makes it easier to change the default StorageClass by allowing the default storage class assignment to be retroactive for existing unbound persistent volume claims without any storage class assigned.
    
This changes the behavior of default storage class assignment to be retroactive for existing unbound persistent volume claims without any storage class assigned. This changes the existing Kubernetes behavior slightly, which is further described in the sections below.
    
When a user needs to provision storage they create a PVC to request a volume. A control loop looks for any new PVCs and based on the current state of the cluster the volume will be provided using one of the following methods:

Static provisioning - PVC did not specify any storage class and there is already an existing PV that can be bound to it.
Dynamic provisioning - there is no existing PV that could be bound but PVC did specify a storage class or there is exactly one storage class in the cluster marked as default.
Considering the "normal" operation described above there are additional cases that can be problematic:

It’s hard to mark a different SC as the default one. Cluster admin can choose between two bad solutions:

Option 1: Cluster has two default SCs for a short time, i.e. admin marks the new default SC as default and then marks the old default SC as non-default. When there are two default SCs in a cluster, the PVC admission plugin refuses to accept new PVCs with pvc.spec.storageClassName = nil. Hence, cluster users may get errors when creating PVCs at the wrong time. They must know it’s a transient error and manually retry later.

Option 2: Cluster has no default SC for a short time, i.e. admin marks the old default SC as non-default and then marks the new default SC as default. Since there is no default SC for some time, PVCs with pvc.spec.storageClassName = nil created during this time will not get any SC and are Pending forever. Users must be smart enough to delete the PVC and re-create it.

When users want to change the default SC parameters, they must delete the SC and re-create it, Kubernetes API does not allow change in the SC. So there is no default SC for some time and the second case above applies here too. Re-creating the storage class to change parameters can be useful in cases where there is a quota set for the SC, and since the quota is coupled with the SC name users can not use Option 1 because the second SC would have a different name and so the existing quota would not apply to it.

Defined ordering during cluster installation. Kubernetes cluster installation tools must be currently smart enough to create a default SC before starting anything that may create PVCs that need it. If such a tool supports multiple cloud providers, storage backends, and add-ons that require storage (such as an image registry), it may be quite complicated to do the ordering right.
          
## Support The Oldest Node And Newest Control Plane
    
This enables testing and expanding the supported skew between core node and control plane components by one version from n-2 to n-3, so that node components (kubelet and kube-proxy) for the oldest supported minor version work with control plane components (kube-apiserver, kube-scheduler, kube-controller-manager, cloud-controller-manager) for the newest supported minor version.
    
The Kubernetes yearly support period already makes annual upgrades possible. Users can upgrade to the latest patch versions to pick up security fixes and do 3 sequential minor version upgrades once a year to "catch up" to the latest supported minor version.

However, since the tested/supported skew between nodes and control planes is currently limited to 2 versions, a 3-version upgrade would have to update nodes twice to stay within the supported skew. For example, to upgrade from v1.40 to v1.43:

Begin: control plane and nodes on v1.40
Control plane upgrade: v1.40 → v1.41 → v1.42
Node upgrades: v1.40 → v1.42
Control plane upgrade: v1.42 → v1.43
Node upgrades: v1.42 → v1.43
    
Node upgrades are inherently more disruptive than control plane upgrades to workloads, for several reasons:

Workloads can be designed to have no dependencies on the Kubernetes control plane, so Kubernetes control plane availability does not directly impact running pods
There can be many more nodes (hundreds to thousands) than control plane members (typically 1 or 3).
    
Every time nodes are upgraded to a new minor version, every pod running on those nodes must be drained/rescheduled. This is true for immutable nodes and mutable/bare-metal nodes. If all nodes are being upgraded, this means every pod in the cluster will be replaced at least once. Patch updates of kubelet / kube-proxy components can be done in place, so it is possible to pick up security fixes and patch updates less disruptively.
    
Replacing or moving pods that are slow to stop or start or have significant data gravity takes significant time, so it is desirable to minimize how frequently that must be done.
If node/control plane skew support was expanded so the oldest node components work with the newest control plane components, the example upgrade path from v1.40 to v1.43 above could improve this:

Begin: control plane and nodes on v1.40
Control plane upgrade: v1.40 → v1.41 → v1.42 → v1.43
Node upgrades: v1.40 → v1.43
   
## Pod Replacement Policy

This enables a new field for the Job API that allows for users to specify if they want replacement Pods as soon as the previous Pods are terminating (existing behavior) or only once the existing pods are fully terminated (new behavior).
    
Many common machine learning frameworks, such as Tensorflow and JAX, require unique pods per Index. Currently, if a pod enters a terminating state (due to preemption, eviction or other external factors), a replacement pod is created and immediately fails to start.

Having a replacement Pod before the previous one fully terminates can also cause problems in clusters with scarce resources or with tight budgets. These resources can be difficult to obtain so pods can take a long time to find resources and they may only be able to find nodes once the existing pods have been terminated. If cluster autoscaler is enabled, the replacement Pods might produce undesired scale-ups.

On the other hand, if a replacement Pod is not immediately created, the Job status would show that the number of active pods doesn't match the desired parallelism. To provide better visibility, the job status can have a new field to track the number of Pods currently terminating.

This new field can also be used by queueing controllers, such as Kueue, to track the number of terminating pods to calculate quotas.
  
## Backoff Limit Per Index
    
This extends the Job API to support indexed jobs where the backoff limit is per index, and the Job can continue execution despite some of its indexes failing.
    
Currently, the indexes of an indexed job share a single backoff limit. When the job reaches this shared backoff limit, the job controller marks the entire job as failed, and the resources are cleaned up, including indexes that have yet to run to completion.

As a result, the current implementation does not cover the situation where the workload is truly embarrassingly parallel and each index is independent of other indexes.

For instance, if indexed jobs were used as the basis for a suite of long-running integration tests, then each test run would only be able to find a single test failure.

Other popular batch services like AWS Batch use a separate backoff limit for each index, showing that this is a common use case that should be supported by Kubernetes.
    
We propose a new policy for running Indexed Jobs in which the backoff limit controls the number of retries per index. When the new policy is used all indexes execute until their success or failure. We also propose a new API field to control the number of failed indexes.

Additionally, we propose a new action in PodFailurePolicy, called FailIndex, to short-circuit the failing of the index before the backoff limit per index is reached.
   
## cAdvisor-less, CRI-full Container And Pod Stats

This encompasses two related pieces of work (summary API and /metrics/cadvisor), and will require changes in three different components (CRI implementation, Kubelet, cAdvisor).

There are two main APIs that consumers use to gather stats about running containers and pods: summary API and /metrics/cadvisor. The Kubelet is responsible for implementing the summary API, and cadvisor is responsible for fulfilling /metrics/cadvisor.

This aims to enhance CRI implementations to be able to fulfill all the stats needs of Kubernetes. At a high level, there are two pieces of this:

- Enhance the CRI API with enough metrics to be able to supplement the pod and container fields in the summary API directly from CRI.
    
- Enhance the CRI implementations to broadcast the required metrics to fulfill the pod and container fields in the /metrics/cadvisor endpoint.

## Feature Graduations And Deprecations In Kubernetes v1.28
### Graduations to stable

This release includes a total of 12 enhancements promoted to Stable:

* [Kubectl Events](https://github.com/kubernetes/enhancements/issues/1440)
* [Retroactive default StorageClass assignment](https://github.com/kubernetes/enhancements/issues/3333)
* [Non-graceful node shutdown](https://github.com/kubernetes/enhancements/issues/2268)
* [Support 3rd party device monitoring plugins](https://github.com/kubernetes/enhancements/issues/606)
* [Auth API to get self-user attributes](https://github.com/kubernetes/enhancements/issues/3325)
* [Proxy Terminating Endpoints](https://github.com/kubernetes/enhancements/issues/1669)
* [Expanded DNS Configuration](https://github.com/kubernetes/enhancements/issues/2595)
* [Cleaning up IPTables Chain Ownership](https://github.com/kubernetes/enhancements/issues/3178)
* [Minimizing iptables-restore input size](https://github.com/kubernetes/enhancements/issues/3453)
* [Graduate the kubelet pod resources endpoint to GA](https://github.com/kubernetes/enhancements/issues/3743)
* [Extend podresources API to report allocatable resources](https://github.com/kubernetes/enhancements/issues/2403)
* [Move EndpointSlice Reconciler into Staging](https://github.com/kubernetes/enhancements/issues/3685)

### Deprecations And Removals

This release saw several removals:

* [Removal of CSI Migration for GCE PD](https://github.com/kubernetes/enhancements/issues/1488)

## Release Notes

The complete details of the Kubernetes v1.28 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md).

## Availability

Kubernetes v1.28 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.28.0). To get started with Kubernetes, you can run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), etc. You can also easily install v1.28 using [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
 
## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire release team for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.28 release for our community.

Special thanks to our Release Lead, Grace Nguyen, for guiding us through a smooth and successful release cycle and facilitating the communication and collaboration between the different Release Teams taking advantage of her experience as a Shadow and Lead in these teams.

## Ecosystem Updates

* KubeCon + CloudNativeCon North America 2023 will take place in Chicago, Illinois, The United States of America, from 6 – 9 November 2023! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).

## Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.28 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.28) (May 15 to August 15), we saw contributions from [911 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.27.0%20-%20now&var-metric=contributions) and [1440 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.27.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).

## Upcoming Release Webinar

Join members of the Kubernetes v1.28 release team on Friday, September 14, 2023, at 10 a.m. PDT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v128-release/) on the CNCF Online Programs site.

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests.

Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors website](https://www.kubernetes.dev/).

* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates.

* Join the community discussion on [Discuss](https://discuss.kubernetes.io/).

* Join the community on [Slack](https://communityinviter.com/apps/kubernetes/community).

* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

* [Share](https://docs.google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) your Kubernetes story.

* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/).

* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team).
