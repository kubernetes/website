---
layout: blog
title: "Kubernetes v1.27: Chill Vibes"
date: 2023-04-11
slug: kubernetes-v1-27-release
author: >
   [Kubernetes v1.27 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.27/release-team.md)
---

Announcing the release of Kubernetes v1.27, the first release of 2023!

This release consist of 60 enhancements. 18 of those enhancements are entering Alpha, 29 are graduating to Beta, and 13 are graduating to Stable.

## Release theme and logo

**Kubernetes v1.27: Chill Vibes**

The theme for Kubernetes v1.27 is *Chill Vibes*.

{{< figure src="/images/blog/2023-04-11-kubernetes-1.27-blog/kubernetes-1.27.png" alt="Kubernetes 1.27 Chill Vibes logo" class="release-logo" >}}


It's a little silly, but there were some important shifts in this release that helped inspire the theme. Throughout a typical Kubernetes release cycle, there are several deadlines that features need to meet to remain included. If a feature misses any of these deadlines, there is an exception process they can go through. Handling these exceptions is a very normal part of the release. But v1.27 is the first release that anyone can remember where we didn't receive a single exception request after the enhancements freeze. Even as the release progressed, things remained much calmer than any of us are used to.

There's a specific reason we were able to enjoy a more calm release this time around, and that's all the work that folks put in behind the scenes to improve how we manage the release. That's what this theme celebrates, people putting in the work to make things better for the community.

Special thanks to [Britnee Laverack](https://www.instagram.com/artsyfie/) for creating the logo. Britnee also designed the logo for [Kubernetes 1.24: Stargazer](https://kubernetes.io/blog/2022/05/03/kubernetes-1-24-release-announcement/#release-theme-and-logo).

# What's New (Major Themes)

## Freeze `k8s.gcr.io` image registry

Replacing the old image registry, [k8s.gcr.io](https://cloud.google.com/container-registry/) with [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io) which has been generally available for several months. The Kubernetes project created and runs the `registry.k8s.io` image registry, which is fully controlled by the community.
This means that the old registry `k8s.gcr.io` will be frozen and no further images for Kubernetes and related sub-projects will be published to the old registry. 

What does this change mean for contributors?

* If you are a maintainer of a sub-project, you will need to update your manifests and Helm charts to use the new registry. For more information, checkout this [project](https://github.com/kubernetes-sigs/community-images).

What does this change mean for end users?

* Kubernetes `v1.27` release will not be published to the `k8s.gcr.io` registry.

* Patch releases for `v1.24`, `v1.25`, and `v1.26` will no longer be published to the old registry after April. 

* Starting in v1.25, the default image registry has been set to `registry.k8s.io`. This value is overridable in kubeadm and kubelet but setting it to `k8s.gcr.io` will fail for new releases after April as they won’t be present in the old registry.

* If you want to increase the reliability of your cluster and remove dependency on the community-owned registry or you are running Kubernetes in networks where external traffic is restricted, you should consider hosting local image registry mirrors. Some cloud vendors may offer hosted solutions for this.


## `SeccompDefault` graduates to stable

To use seccomp profile defaulting, you must run the kubelet with the `--seccomp-default` [command line flag](/docs/reference/command-line-tools-reference/kubelet) enabled for each node where you want to use it. 
If enabled, the kubelet will use the `RuntimeDefault` seccomp profile by default, which is defined by the container runtime, instead of using the `Unconfined` (seccomp disabled) mode. The default profiles aim to provide a strong set of security defaults while preserving the functionality of the workload. It is possible that the default profiles differ between container runtimes and their release versions.

You can find detailed information about a possible upgrade and downgrade strategy in the related Kubernetes Enhancement Proposal (KEP): [Enable seccomp by default](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2413-seccomp-by-default).

## Mutable scheduling directives for Jobs graduates to GA

This was introduced in v1.22 and started as a beta level, now it's stable. In most cases a parallel job will want the pods to run with constraints, like all in the same zone, or all either on GPU model x or y but not a mix of both. The `suspend` field is the first step towards achieving those semantics. `suspend` allows a custom queue controller to decide when a job should start. However, once a job is unsuspended, a custom queue controller has no influence on where the pods of a job will actually land.

This feature allows updating a Job's scheduling directives before it starts, which gives custom queue controllers
the ability to influence pod placement while at the same time offloading actual pod-to-node assignment to
kube-scheduler. This is allowed only for suspended Jobs that have never been unsuspended before.
The fields in a Job's pod template that can be updated are node affinity, node selector, tolerations, labels
,annotations, and [scheduling gates](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/).
Find more details in the KEP:
[Allow updating scheduling directives of jobs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/2926-job-mutable-scheduling-directives).

## DownwardAPIHugePages graduates to stable 

In Kubernetes v1.20, support for `requests.hugepages-<pagesize>` and `limits.hugepages-<pagesize>` was added
to the [downward API](/docs/concepts/workloads/pods/downward-api/) to be consistent with other resources like cpu, memory, and ephemeral storage.
This feature graduates to stable in this release. You can find more details in the KEP:
[Downward API HugePages](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2053-downward-api-hugepages).

## Pod Scheduling Readiness goes to beta 

Upon creation, Pods are ready for scheduling. Kubernetes scheduler does its due diligence to find nodes to place all pending Pods. However, in a real-world case, some Pods may stay in a _missing-essential-resources_ state for a long period. These Pods actually churn the scheduler (and downstream integrators like Cluster Autoscaler) in an unnecessary manner.

By specifying/removing a Pod's `.spec.schedulingGates`, you can control when a Pod is ready to be considered for scheduling.

The `schedulingGates` field contains a list of strings, and each string literal is perceived as a criteria that must be satisfied before a Pod is considered schedulable. This field can be initialized only when a Pod is created (either by the client, or mutated during admission). After creation, each schedulingGate can be removed in an arbitrary order, but addition of a new scheduling gate is disallowed.

## Node log access via Kubernetes API

This feature helps cluster administrators debug issues with services running on nodes by allowing them to query service logs. To use this feature, ensure that the `NodeLogQuery` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled on that node, and that the kubelet configuration options `enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. 
On Linux, we assume that service logs are available via journald. On Windows, we assume that service logs are available in the application log provider. You can also fetch logs from the `/var/log/` and `C:\var\log` directories on Linux and Windows, respectively.

A cluster administrator can try out this alpha feature across all nodes of their cluster, or on a subset of them.

## ReadWriteOncePod PersistentVolume access mode goes to beta 

Kubernetes `v1.22` introduced a new access mode `ReadWriteOncePod` for [PersistentVolumes](/docs/concepts/storage/persistent-volumes/#persistent-volumes) (PVs) and [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVCs). This access mode enables you to restrict volume access to a single pod in the cluster, ensuring that only one pod can write to the volume at a time. This can be particularly useful for stateful workloads that require single-writer access to storage.

The ReadWriteOncePod beta adds support for [scheduler preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
of pods that use ReadWriteOncePod PVCs.
Scheduler preemption allows higher-priority pods to preempt lower-priority pods. For example when a pod (A) with a `ReadWriteOncePod` PVC is scheduled, if another pod (B) is found using the same PVC and pod (A) has higher priority, the scheduler will return an `Unschedulable` status and attempt to preempt pod (B).
For more context, see the KEP: [ReadWriteOncePod PersistentVolume AccessMode](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode).


## Respect PodTopologySpread after rolling upgrades

`matchLabelKeys` is a list of pod label keys used to select the pods over which spreading will be calculated. The keys are used to lookup values from the pod labels. Those key-value labels are ANDed with `labelSelector` to select the group of existing pods over which spreading will be calculated for the incoming pod. Keys that don't exist in the pod labels will be ignored. A null or empty list means only match against the `labelSelector`.

With `matchLabelKeys`, users don't need to update the `pod.spec` between different revisions. The controller/operator just needs to set different values to the same `label` key for different revisions. The scheduler will assume the values automatically based on `matchLabelKeys`. For example, if users use Deployment, they can use the label keyed with `pod-template-hash`, which is added automatically by the Deployment controller, to distinguish between different revisions in a single Deployment.


## Faster SELinux volume relabeling using mounts

In this release, how SELinux labels are applied to volumes used by Pods is graduating to beta. This feature speeds up container startup by mounting volumes with the correct SELinux label instead of changing each file on the volumes recursively. Linux kernel with SELinux support allows the first mount of a volume to set SELinux label on the whole volume using `-o context=` mount option. This way, all files will have assigned the given label in a constant time, without recursively walking through the whole volumes.

The `context` mount option cannot be applied to bind mounts or re-mounts of already mounted volumes.
For CSI storage, a CSI driver does the first mount of a volume, and so it must be the CSI driver that actually
applies this mount option. We added a new field `SELinuxMount` to CSIDriver objects, so that drivers can
announce whether they support the `-o context` mount option.

If Kubernetes knows the SELinux label of a Pod **and** the  CSI driver responsible for a pod's volume
announces `SELinuxMount: true` **and** the volume has Access Mode `ReadWriteOncePod`, then it
will ask the CSI driver to mount the volume with mount option `context=` **and** it will tell the container
runtime not to relabel content of the volume (because all files already have the right label).
Get more information on this from the KEP: [Speed up SELinux volume relabeling using mounts](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling).

## Robust VolumeManager reconstruction goes to beta

This is a volume manager refactoring that allows the kubelet to populate additional information about how
existing volumes are mounted during the kubelet startup. In general, this makes volume cleanup more robust. 
If you enable the `NewVolumeManagerReconstruction` feature gate on a node, you'll get enhanced discovery of mounted volumes during kubelet startup.

Before Kubernetes v1.25, the kubelet used different default behavior for discovering mounted volumes during the kubelet startup. If you disable this feature gate (it's enabled by default), you select the legacy discovery behavior.

In Kubernetes v1.25 and v1.26, this behavior toggle was part of the `SELinuxMountReadWriteOncePod` feature gate.

## Mutable Pod Scheduling Directives goes to beta

This allows mutating a pod that is blocked on a scheduling readiness gate with a more constrained node affinity/selector. It gives the ability to mutate a pods scheduling directives before it is allowed to be scheduled and gives an external resource controller the ability to influence pod placement while at the same time offload actual pod-to-node assignment to kube-scheduler.

This opens the door for a new pattern of adding scheduling features to Kubernetes.  Specifically, building lightweight schedulers that implement features not supported by kube-scheduler, while relying on the existing kube-scheduler to support all upstream features and handle the pod-to-node binding. This pattern should be the preferred one if the custom feature doesn't require implementing a schedule plugin, which entails re-building and maintaining a custom kube-scheduler binary.

## Feature graduations and deprecations in Kubernetes v1.27
### Graduations to stable

This release includes a total of 9 enhancements promoted to Stable:

* [Default container annotation that to be used by kubectl](https://github.com/kubernetes/enhancements/issues/2227)
* [TimeZone support in CronJob](https://github.com/kubernetes/enhancements/issues/3140)
* [Expose metrics about resource requests and limits that represent the pod model](https://github.com/kubernetes/enhancements/issues/1748)
* [Server Side Unknown Field Validation](https://github.com/kubernetes/enhancements/issues/2885)
* [Node Topology Manager](https://github.com/kubernetes/enhancements/issues/693)
* [Add gRPC probe to Pod.Spec.Container.{Liveness,Readiness,Startup} Probe](https://github.com/kubernetes/enhancements/issues/2727)
* [Add configurable grace period to probes](https://github.com/kubernetes/enhancements/issues/2238)
* [OpenAPI v3](https://github.com/kubernetes/enhancements/issues/2896)
* [Stay on supported Go versions](https://github.com/kubernetes/enhancements/issues/3744)

### Deprecations and removals

This release saw several removals:

* [Removal of `storage.k8s.io/v1beta1` from CSIStorageCapacity](https://github.com/kubernetes/kubernetes/pull/108445)
* [Removal of support for deprecated seccomp annotations](https://github.com/kubernetes/kubernetes/pull/114947)
* [Removal of `--master-service-namespace` command line argument](https://github.com/kubernetes/kubernetes/pull/112797)
* [Removal of the `ControllerManagerLeaderMigration` feature gate](https://github.com/kubernetes/kubernetes/pull/113534)
* [Removal of `--enable-taint-manager` command line argument](https://github.com/kubernetes/kubernetes/pull/111411)
* [Removal of `--pod-eviction-timeout` command line argument](https://github.com/kubernetes/kubernetes/pull/113710)
* [Removal of the `CSI Migration` feature gate](https://github.com/kubernetes/kubernetes/pull/110410)
* [Removal of `CSIInlineVolume` feature gate](https://github.com/kubernetes/kubernetes/pull/111258)
* [Removal of `EphemeralContainers` feature gate](https://github.com/kubernetes/kubernetes/pull/111402)
* [Removal of `LocalStorageCapacityIsolation` feature gate](https://github.com/kubernetes/kubernetes/pull/111513)
* [Removal of `NetworkPolicyEndPort` feature gate](https://github.com/kubernetes/kubernetes/pull/110868)
* [Removal of `StatefulSetMinReadySeconds` feature gate](https://github.com/kubernetes/kubernetes/pull/110896)
* [Removal of `IdentifyPodOS` feature gate](https://github.com/kubernetes/kubernetes/pull/111229)
* [Removal of `DaemonSetUpdateSurge` feature gate](https://github.com/kubernetes/kubernetes/pull/111194)

## Release notes

The complete details of the Kubernetes v1.27 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md).

## Availability

Kubernetes v1.27 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.27.0). To get started with Kubernetes, you can run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), etc. You can also easily install v1.27 using [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
 
## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires people with specialised skills from all corners of our community, from the code itself to its documentation and project management.

Special thanks to our Release Lead Xander Grzywinski for guiding us through a smooth and successful release cycle and to all members of the release team for supporting one another and working so hard to produce the v1.27 release for the community.

## Ecosystem updates

* KubeCon + CloudNativeCon Europe 2023 will take place in Amsterdam, The Netherlands, from 17 – 21 April 2023! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
* cdCon +  GitOpsCon will be held in Vancouver, Canada, on May 8th and 9th, 2023!  More information about the conference and registration can be found on the [event site](https://events.linuxfoundation.org/cdcon-gitopscon/).

## Project velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.27 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.27) (January 9 to April 11), we saw contributions from [1020 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.26.0%20-%20now&var-metric=contributions) and [1603 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.26.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).

## Upcoming release webinar

Join members of the Kubernetes v1.27 release team on Friday, April 14, 2023, at 10 a.m. PDT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v127-release/) on the CNCF Online Programs site.

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