---
layout: blog
title: "Kubernetes v1.28: Planternetes"
date: 2023-08-15T12:00:00+0000
slug: kubernetes-v1-28-release
author: >
  [Kubernetes v1.28 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.28/release-team.md)
---

Announcing the release of Kubernetes v1.28 Planternetes, the second release of 2023!

This release consists of 45 enhancements. Of those enhancements, 19 are entering Alpha, 14 have graduated to Beta, and 12 have graduated to Stable.

## Release Theme And Logo

**Kubernetes v1.28: _Planternetes_**

The theme for Kubernetes v1.28 is *Planternetes*.

{{< figure src="/images/blog/2023-08-15-kubernetes-1.28-blog/kubernetes-1.28.png" alt="Kubernetes 1.28 Planternetes logo" class="release-logo" >}}

Each Kubernetes release is the culmination of the hard work of thousands of individuals from our community. The people behind this release come from a wide range of backgrounds, some of us industry veterans, parents, others students and newcomers to open-source. We combine our unique experience to create a collective artifact with global impact.

Much like a garden, our release has ever-changing growth, challenges and opportunities. This theme celebrates the meticulous care, intention and efforts to get the release to where we are today. Harmoniously together, we grow better.

# What's New (Major Themes)

## Changes to supported skew between control plane and node versions

Kubernetes v1.28 expands the supported skew between core node and control plane
components by one minor version, from _n-2_ to _n-3_, so that node components
(kubelet and kube-proxy) for the oldest supported minor version work with
control plane components (kube-apiserver, kube-scheduler, kube-controller-manager,
cloud-controller-manager) for the newest supported minor version.

Some cluster operators avoid node maintenance and especially changes to node
behavior, because nodes are where the workloads run. For minor version upgrades
to a kubelet, the supported process includes draining that node, and hence
disruption to any Pods that had been executing there. For Kubernetes end users
with very long running workloads, and where Pods should stay running wherever
possible, reducing the time lost to node maintenance is a benefit.

The Kubernetes yearly support period already made annual upgrades possible. Users can
upgrade to the latest patch versions to pick up security fixes and do 3 sequential
minor version upgrades once a year to "catch up" to the latest supported minor version.

Previously, to stay within the supported skew, a cluster operator planning an annual
upgrade would have needed to upgrade their nodes twice (perhaps only hours apart). Now,
with Kubernetes v1.28, you have the option of making a minor version upgrade to
nodes just once in each calendar year and still staying within upstream support.

If you'd like to stay current and upgrade your clusters more often, that's
fine and is still completely supported.

## Generally available: recovery from non-graceful node shutdown
    
If a node shuts down unexpectedly or ends up in a non-recoverable state (perhaps due to hardware failure or unresponsive OS), Kubernetes allows you to clean up afterward and allow stateful workloads to restart on a different node. For Kubernetes v1.28, that's now a stable feature.

This allows stateful workloads to fail over to a different node successfully after the original node is shut down or in a non-recoverable state, such as the hardware failure or broken OS.
    
Versions of Kubernetes earlier than v1.20 lacked handling for node shutdown on Linux, the kubelet integrates with systemd
and implements graceful node shutdown (beta, and enabled by default). However, even an intentional
shutdown might not get handled well that could be because:

- the node runs Windows
- the node runs Linux, but uses a different `init` (not `systemd`)
- the shutdown does not trigger the system inhibitor locks mechanism
- because of a node-level configuration error
  (such as not setting appropriate values for `shutdownGracePeriod` and `shutdownGracePeriodCriticalPods`).

When a node shutdowns or fails, and that shutdown was not detected by the kubelet, the pods that are part
of a StatefulSet will be stuck in terminating status on the shutdown node. If the stopped node restarts, the
kubelet on that node can clean up (`DELETE`) the Pods that the Kubernetes API still sees as bound to that node.
However, if the node stays stopped - or if the kubelet isn't able to start after a reboot - then Kubernetes may
not be able to create replacement Pods. When the kubelet on the shut-down node is not available to delete
the old pods, an associated StatefulSet cannot create a new pod (which would have the same name).

There's also a problem with storage. If there are volumes used by the pods, existing VolumeAttachments will
not be disassociated from the original - and now shut down - node so the PersistentVolumes used by these
pods cannot be attached to a different, healthy node. As a result, an application running on an
affected StatefulSet may not be able to function properly. If the original, shut down node does come up, then
their pods will be deleted by its kubelet and new pods can be created on a different running node.
If the original node does not come up (common with an [immutable infrastructure](https://glossary.cncf.io/immutable-infrastructure/) design),  those pods would be stuck in a `Terminating` status on the shut-down node forever.

For more information on how to trigger cleanup after a non-graceful node shutdown,
read [non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
    
## Improvements to CustomResourceDefinition validation rules 

The [Common Expression Language (CEL)](https://github.com/google/cel-go) can be used to validate
[custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/). The primary goal is to allow the majority of the validation use cases that might once have needed you, as a CustomResourceDefinition (CRD) author, to design and implement a webhook. Instead, and as a beta feature, you can add _validation expressions_ directly into the schema of a CRD.
    
CRDs need direct support for non-trivial validation. While admission webhooks do support CRDs validation, they significantly complicate the development and operability of CRDs.

In 1.28, two optional fields `reason` and `fieldPath` were added to allow user to specify the failure reason and fieldPath when validation failed.

For more information, read [validation rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) in the CRD documentation.

## ValidatingAdmissionPolicies graduate to beta
    
Common Expression language for admission control is customizable, in-process validation of requests to the Kubernetes API server as an alternative to validating admission webhooks.

This builds on the capabilities of the CRD Validation Rules feature that graduated to beta in 1.25 but with a focus on the policy enforcement capabilities of validating admission control.
    
This will lower the infrastructure barrier to enforcing customizable policies as well as providing primitives that help the community establish and adhere to the best practices of both K8s and its extensions.

To use [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/), you need to enable both the `admissionregistration.k8s.io/v1beta1` API group and the `ValidatingAdmissionPolicy` feature gate in your cluster's control plane.

## Match conditions for admission webhooks
    
Kubernetes v1.27 lets you specify _match conditions_ for admission webhooks,
which lets you narrow the scope of when Kubernetes makes a remote HTTP call at admission time.
The `matchCondition` field for ValidatingWebhookConfiguration and MutatingWebhookConfiguration
is a CEL expression that must evaluate to true for the admission request to be sent to the webhook.

In Kubernetes v1.28, that field moved to beta, and it's enabled by default.
    
To learn more, see [`matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions) in the Kubernetes documentation.

## Beta support for enabling swap space on Linux
    
This adds swap support to nodes in a controlled, predictable manner so that Kubernetes users can perform testing and provide data to continue building cluster capabilities on top of swap.

There are two distinct types of users for swap, who may overlap:

- Node administrators, who may want swap available for node-level performance tuning and stability/reducing noisy neighbor issues.
    
- Application developers, who have written applications that would benefit from using swap memory.
    
## Mixed version proxy (alpha) {#mixed-version-proxy}

When a cluster has multiple API servers at mixed versions (such as during an upgrade/downgrade or when runtime-config changes and a rollout happens), not every apiserver can serve every resource at every version.

For Kubernetes v1.28, you can enable the _mixed version proxy_ within the API server's aggregation layer.
The mixed version proxy finds requests that the local API server doesn't recognize but another API server
inside the control plan is able to support. Having found a suitable peer, the aggregation layer proxies
the request to a compatible API server; this is transparent from the client's perspective.
    
When an upgrade or downgrade is performed on a cluster, for some period of time the API servers
within the control plane may be at differing versions; when that happens, different subsets of the
API servers are able to serve different sets of built-in resources (different groups, versions, and resources
are all possible). This new alpha mechanism lets you hide that skew from clients.
  
## Source code reorganization for control plane components

Kubernetes contributors have begun to reorganize the code for the kube-apiserver to build on a new staging repository that consumes [k/apiserver](https://github.com/kubernetes/apiserver) but has a bigger, carefully chosen subset of the functionality of kube-apiserver such that it is reusable.

This is a gradual reorganization; eventually there will be a new git repository with generic functionality abstracted from Kubernetes' API server.

## Support for CDI injection into containers (alpha) {#cdi-device-plugin}

CDI provides a standardized way of injecting complex devices into a container (i.e. devices that logically require more than just a single /dev node to be injected for them to work). This new feature enables plugin developers to utilize the CDIDevices field added to the CRI in 1.27 to pass CDI devices directly to CDI enabled runtimes (of which containerd and crio-o are in recent releases).
    
## API awareness of sidecar containers (alpha) {#sidecar-init-containers}

Kubernetes 1.28 introduces an alpha `restartPolicy` field for [init containers](https://github.com/kubernetes/website/blob/main/content/en/docs/concepts/workloads/pods/init-containers.md),
and uses that to indicate when an init container is also a _sidecar container_.
The kubelet will start init containers with `restartPolicy: Always` in the order
they are defined, along with other init containers.
Instead of waiting for that sidecar container to complete before starting the main
container(s) for the Pod, the kubelet only waits for the sidecar init container to have started.

The kubelet will consider the startup for the sidecar container as being completed
if the startup probe succeeds and the postStart handler is completed.
This condition is represented with the field Started of ContainerStatus type.
If you do not define a startup probe, the kubelet will consider the container
startup to be completed immediately after the postStart handler completion.

For init containers, you can either omit the `restartPolicy` field, or set it to `Always`. Omitting the field
means that you want a true init container that runs to completion before application startup.

Sidecar containers do not block Pod completion: if all regular containers are complete, sidecar
containers in that Pod will be terminated.

Once the sidecar container has started (process running, `postStart` was successful, and
any configured startup probe is passing), and then there's a failure, that sidecar container will be
restarted even when the Pod's overall `restartPolicy` is `Never` or `OnFailure`.
Furthermore, sidecar containers will be restarted (on failure or on normal exit)
_even during Pod termination_.

To learn more, read [API for sidecar containers](/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers).

## Automatic, retroactive assignment of a default StorageClass graduates to stable
    
Kubernetes automatically sets a `storageClassName` for a PersistentVolumeClaim (PVC) if you don't provide
a value. The control plane also sets a StorageClass for any existing PVC that doesn't have a `storageClassName`
defined.
Previous versions of Kubernetes also had this behavior; for Kubernetes v1.28 it is automatic and always
active; the feature has graduated to stable (general availability).

To learn more, read about [StorageClass](/docs/concepts/storage/storage-classes/) in the Kubernetes 
documentation.
             
## Pod replacement policy for Jobs (alpha) {#pod-replacement-policy}

Kubernetes 1.28 adds a new field for the Job API that allows you to specify if you want the control
plane to make new Pods as soon as the previous Pods begin termination (existing behavior),
 or only once the existing pods are fully terminated (new, optional behavior).
    
Many common machine learning frameworks, such as Tensorflow and JAX, require unique pods per index.
With the older behaviour, if a pod that belongs to an `Indexed` Job enters a terminating state (due to preemption, eviction or other external factors), a replacement pod is created but then immediately fails to start due
to the clash with the old pod that has not yet shut down.

Having a replacement Pod appear before the previous one fully terminates can also cause problems
in clusters with scarce resources or with tight budgets. These resources can be difficult to obtain so pods may only be able to find nodes once the existing pods have been terminated. If cluster autoscaler is enabled, early creation of replacement Pods might produce undesired scale-ups.

To learn more, read [Delayed creation of replacement pods](/docs/concepts/workloads/controllers/job/#delayed-creation-of-replacement-pods)
in the Job documentation.
  
## Job retry backoff limit, per index (alpha) {#job-per-index-retry-backoff}
    
This extends the Job API to support indexed jobs where the backoff limit is per index, and the Job can continue execution despite some of its indexes failing.
    
Currently, the indexes of an indexed job share a single backoff limit. When the job reaches this shared backoff limit, the job controller marks the entire job as failed, and the resources are cleaned up, including indexes that have yet to run to completion.

As a result, the existing implementation did not cover the situation where the workload is truly
[embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel): each index is
fully independent of other indexes.

For instance, if indexed jobs were used as the basis for a suite of long-running integration tests, then each test run would only be able to find a single test failure.

    
For more information, read [Handling Pod and container failures](/docs/concepts/workloads/controllers/job/#handling-pod-and-container-failures) in the Kubernetes documentation.

<hr />
<a id="cri-container-and-pod-statistics-without-cadvisor" />

**Correction**: the feature CRI container and pod statistics without cAdvisor has been removed as it did not make the release.
The original release announcement stated that Kubernetes 1.28 included the new feature.

## Feature graduations and deprecations in Kubernetes v1.28
### Graduations to stable

This release includes a total of 12 enhancements promoted to Stable:

* [`kubectl events`](https://github.com/kubernetes/enhancements/issues/1440)
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

### Deprecations and removals

Removals:

* [Removal of CSI Migration for GCE PD](https://github.com/kubernetes/enhancements/issues/1488)

Deprecations:

* [Ceph RBD in-tree plugin](https://github.com/kubernetes/kubernetes/pull/118303)
* [Ceph FS in-tree plugin](https://github.com/kubernetes/kubernetes/pull/118143)

## Release Notes

The complete details of the Kubernetes v1.28 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md).

## Availability

Kubernetes v1.28 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.28.0). To get started with Kubernetes, you can run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), etc. You can also easily install v1.28 using [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
 
## Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is comprised of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire release team for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.28 release for our community.

Special thanks to our release lead, Grace Nguyen, for guiding us through a smooth and successful release cycle.

## Ecosystem Updates

* KubeCon + CloudNativeCon China 2023 will take place in Shanghai, China, from 26 – 28 September 2023! You can find more information about the conference and registration on the [event site](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/).
* KubeCon + CloudNativeCon North America 2023 will take place in Chicago, Illinois, The United States of America, from 6 – 9 November 2023! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).

## Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.28 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.28) (May 15 to August 15), we saw contributions from [911 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.27.0%20-%20now&var-metric=contributions) and [1440 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.27.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).

## Upcoming Release Webinar

Join members of the Kubernetes v1.28 release team on Wednesday, September 6th, 2023, at 9 A.M. PDT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-128-release/) on the CNCF Online Programs site.

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
