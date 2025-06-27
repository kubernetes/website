---
layout: blog
title: 'Kubernetes 1.23: The Next Frontier'
date: 2021-12-07
slug: kubernetes-1-23-release-announcement
evergreen: true
author: >
  [Kubernetes 1.23 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.23/release-team.md)
---

We’re pleased to announce the release of Kubernetes 1.23, the last release of 2021!

This release consists of 47 enhancements: 11 enhancements have graduated to stable, 17 enhancements are moving to beta, and 19 enhancements are entering alpha. Also, 1 feature has been deprecated.     

## Major Themes

### Deprecation of FlexVolume

FlexVolume is deprecated. The out-of-tree CSI driver is the recommended way to write volume drivers in Kubernetes. See [this doc](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors) for more information. Maintainers of FlexVolume drivers should implement a CSI driver and move users of FlexVolume to CSI. Users of FlexVolume should move their workloads to the CSI driver.

### Deprecation of klog specific flags

To simplify the code base, several [logging flags were marked as deprecated](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog) in Kubernetes 1.23. The code which implements them will be removed in a future release, so users of those need to start replacing the deprecated flags with some alternative solutions.

### Software Supply Chain SLSA Level 1 Compliance in the Kubernetes Release Process

Kubernetes releases now generate provenance attestation files describing the staging and release phases of the release process. Artifacts are now verified as they are handed over from one phase to the next. This final piece completes the work needed to comply with Level 1 of the [SLSA security framework](https://slsa.dev/) (Supply-chain Levels for Software Artifacts).

### IPv4/IPv6 Dual-stack Networking graduates to GA

[IPv4/IPv6 dual-stack networking](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack) graduates to GA. Since 1.21, Kubernetes clusters have been enabled to support dual-stack networking by default. In 1.23, the `IPv6DualStack` feature gate is removed. The use of dual-stack networking is not mandatory. Although clusters are enabled to support dual-stack networking, Pods and Services continue to default to single-stack. To use dual-stack networking Kubernetes nodes must have routable IPv4/IPv6 network interfaces, a dual-stack capable CNI network plugin must be used, Pods must be configured to be dual-stack and Services must have their `.spec.ipFamilyPolicy` field set to either `PreferDualStack` or `RequireDualStack`.

### HorizontalPodAutoscaler v2 graduates to GA

The HorizontalPodAutoscaler `autoscaling/v2` stable API moved to GA in 1.23. The HorizontalPodAutoscaler `autoscaling/v2beta2` API has been deprecated.

### Generic Ephemeral Volume feature graduates to GA

The generic ephemeral volume feature moved to GA in 1.23. This feature allows any existing storage driver that supports dynamic provisioning to be used as an ephemeral volume with the volume’s lifecycle bound to the Pod. All StorageClass parameters for volume provisioning and all features supported with PersistentVolumeClaims are supported.

### Skip Volume Ownership change graduates to GA

The feature to configure volume permission and ownership change policy for Pods moved to GA in 1.23. This allows users to skip recursive permission changes on mount and speeds up the pod start up time.

### Allow CSI drivers to opt-in to volume ownership and permission change graduates to GA

The feature to allow CSI Drivers to declare support for fsGroup based permissions graduates to GA in 1.23.

### PodSecurity graduates to Beta

[PodSecurity](https://kubernetes.io/docs/concepts/security/pod-security-admission/) moves to Beta. `PodSecurity` replaces the deprecated `PodSecurityPolicy` admission controller. `PodSecurity` is an admission controller that enforces Pod Security Standards on Pods in a Namespace based on specific namespace labels that set the enforcement level. In 1.23, the `PodSecurity` feature gate is enabled by default.

### Container Runtime Interface (CRI) v1 is default

The Kubelet now supports the CRI `v1` API, which is now the project-wide default. 
If a container runtime does not support the `v1` API, Kubernetes will fall back to the `v1alpha2` implementation. There is no intermediate action required by end-users, because `v1` and `v1alpha2` do not differ in their implementation. It is likely that `v1alpha2` will be removed in one of the future Kubernetes releases to be able to develop `v1`.

### Structured logging graduate to Beta

Structured logging reached its Beta milestone. Most log messages from kubelet and kube-scheduler have been converted. Users are encouraged to try out JSON output or parsing of the structured text format and provide feedback on possible solutions for the open issues, such as handling of multi-line strings in log values.

### Simplified Multi-point plugin configuration for scheduler

The kube-scheduler is adding a new, simplified config field for Plugins to allow multiple extension points to be enabled in one spot. The new `multiPoint` plugin field is intended to simplify most scheduler setups for administrators. Plugins that are enabled via `multiPoint` will automatically be registered for each individual extension point that they implement. For example, a plugin that implements Score and Filter extensions can be simultaneously enabled for both. This means entire plugins can be enabled and disabled without having to manually edit individual extension point settings. These extension points can now be abstracted away due to their irrelevance for most users.

### CSI Migration updates

CSI Migration enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding CSI driver. 
If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. 
After migration, Kubernetes users may continue to rely on all the functionality of in-tree storage plugins using the existing interface.
- CSI Migration feature is turned on by default but stays in Beta for GCE PD, AWS EBS, and Azure Disk in 1.23.
- CSI Migration is introduced as an Alpha feature for Ceph RBD and Portworx in 1.23.

### Expression language validation for CRD is alpha

Expression language validation for CRD is in alpha starting in 1.23. If the `CustomResourceValidationExpressions` feature gate is enabled, custom resources will be validated by validation rules using the [Common Expression Language (CEL)](https://github.com/google/cel-spec).

### Server Side Field Validation is Alpha

If the `ServerSideFieldValidation` feature gate is enabled starting 1.23, users will receive warnings from the server when they send Kubernetes objects in the request that contain unknown or duplicate fields. Previously unknown fields and all but the last duplicate fields would be dropped by the server.

With the feature gate enabled, we also introduce the `fieldValidation` query parameter so that users can specify the desired behavior of the server on a per request basis. Valid values for the `fieldValidation` query parameter are:

- Ignore (default when feature gate is disabled, same as pre-1.23 behavior of dropping/ignoring unknown fields)
- Warn (default when feature gate is enabled).
- Strict (this will fail the request with an Invalid Request error)

### OpenAPI v3 is Alpha

If the `OpenAPIV3` feature gate is enabled starting 1.23, users will be able to request the OpenAPI v3.0 spec for all Kubernetes types. OpenAPI v3 aims to be fully transparent and includes support for a set of fields that are dropped when publishing OpenAPI v2: `default`, `nullable`, `oneOf`, `anyOf`. A separate spec is published per Kubernetes group version (at the `$cluster/openapi/v3/apis/<group>/<version>` endpoint) for improved performance and discovery, for all group versions can be found at the `$cluster/openapi/v3` path.

## Other Updates

### Graduated to Stable

- [IPv4/IPv6 Dual-Stack Support](https://github.com/kubernetes/enhancements/issues/563)
- [Skip Volume Ownership Change](https://github.com/kubernetes/enhancements/issues/695)
- [TTL After Finished Controller](https://github.com/kubernetes/enhancements/issues/592)
- [Config FSGroup Policy in CSI Driver object](https://github.com/kubernetes/enhancements/issues/1682)
- [Generic Ephemeral Inline Volumes](https://github.com/kubernetes/enhancements/issues/1698)
- [Defend Against Logging Secrets via Static Analysis](https://github.com/kubernetes/enhancements/issues/1933)
- [Namespace Scoped Ingress Class Parameters](https://github.com/kubernetes/enhancements/issues/2365)
- [Reducing Kubernetes Build Maintenance](https://github.com/kubernetes/enhancements/issues/2420)
- [Graduate HPA API to GA](https://github.com/kubernetes/enhancements/issues/2702)


### Major Changes

- [Priority and Fairness for API Server Requests](https://github.com/kubernetes/enhancements/issues/1040)

### Release Notes

Check out the full details of the Kubernetes 1.23 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md).

### Availability

Kubernetes 1.23 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.23.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using Docker container “nodes” with [kind](https://kind.sigs.k8s.io/). You can also easily install 1.23 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 

### Release Team

This release was made possible by a very dedicated group of individuals, who came together as a team to deliver technical content, documentation, code, and a host of other components that go into every Kubernetes release.

A huge thank you to the release lead Rey Lejano for leading us through a successful release cycle, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.23 release for the community.

### Release Theme and Logo 

**Kubernetes 1.23: The Next Frontier**

{{< figure src="/images/blog/2021-12-07-kubernetes-release-1.23/kubernetes-1.23.png" alt="" class="release-logo" >}}


"The Next Frontier" theme represents the new and graduated enhancements in 1.23, Kubernetes' history of Star Trek references, and the growth of community members in the release team.

Kubernetes has a history of Star Trek references. The original codename for Kubernetes within Google is Project 7, a reference to Seven of Nine from Star Trek Voyager. And of course Borg was the name for the predecessor to Kubernetes. "The Next Frontier" theme continues the Star Trek references. "The Next Frontier" is a fusion of two Star Trek titles, Star Trek V: The Final Frontier and Star Trek the Next Generation.

"The Next Frontier" represents a line in the SIG Release charter, "Ensure there is a consistent group of community members in place to support the release process across time." With each release team, we grow the community with new release team members and for many it's their first contribution in their open source frontier.

Reference: https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/
Reference: https://github.com/kubernetes/community/blob/master/sig-release/charter.md

The Kubernetes 1.23 release logo continues with the theme's Star Trek reference. Every star is a helm from the Kubernetes logo. The ship represents the collective teamwork of the release team.

Rey Lejano designed the logo. 

### User Highlights

- [Findings of the latest CNCF End User Technology Radar](https://www.cncf.io/announcements/2021/09/22/cncf-end-user-technology-radar-provides-insights-into-devsecops/) were themed around DevSecOps. Check out the [Radar Page](https://radar.cncf.io/) for the full details and findings.
- Learn about how [end user Aegon Life India migrated core processes from its traditional monolith to a microservice-based architecture](https://www.cncf.io/case-studies/aegon-life-india/) in its effort to transform into a leading digital service company.
- Utilizing multiple cloud native projects, [Seagate engineered edgerX to run Real-time Analytics at the Edge](https://www.cncf.io/case-studies/seagate/). 
- Check out how [Zambon worked with SparkFabrik to develop 16 websites, with cloud native technologies, to enable stakeholders to easily update content while maintaining a consistent brand identity](https://www.cncf.io/case-studies/zambon/).
- Using Kubernetes, [InfluxData was able to deliver on the promise of multi-cloud, multi-region service availability](https://www.cncf.io/case-studies/influxdata/) by creating a true cloud abstraction layer that allows for the seamless delivery of InfluxDB as a single application to multiple global clusters across three major cloud providers.

    
### Ecosystem Updates

- [KubeCon + CloudNativeCon NA 2021](https://www.cncf.io/events/kubecon-cloudnativecon-north-america-2021/) was held in October 2021, both online and in person. All talks are [now available on-demand](https://www.youtube.com/playlist?list=PLj6h78yzYM2Nd1U4RMhv7v88fdiFqeYAP) for anyone that would like to catch up!
- [Kubernetes and Cloud Native Essentials Training and KCNA Certification are now generally available for enrollment and scheduling](https://www.cncf.io/announcements/2021/11/18/kubernetes-and-cloud-native-essentials-training-and-kcna-certification-now-available/). Additionally, a new online training course, [Kubernetes and Cloud Native Essentials (LFS250)](https://www.cncf.io/announcements/2021/10/13/entry-level-kubernetes-certification-to-help-advance-cloud-careers/), has been released to both prepare individuals for entry-level cloud roles and to sit for the KCNA exam.
- [New resources are now available from the Inclusive Naming Initiative](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/), including an Inclusive Strategies for Open Source (LFC103) course, Language Evaluation Framework, and Implementation Path.

    
### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.23 release cycle, which ran for 16 weeks (August 23 to December 7), we saw contributions from [1032 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.22.0%20-%20now&var-metric=contributions) and [1084 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.22.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).

### Event Update

- [KubeCon + CloudNativeCon China 2021](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/) is happening this month from December 9 - 11. After taking a break last year, the event will be virtual this year and includes 105 sessions. Check out the event schedule [here](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/program/schedule/).
- KubeCon + CloudNativeCon Europe 2022 will take place in Valencia, Spain, May 4 – 7, 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/archive/2021/kubecon-cloudnativecon-europe/).
- Kubernetes Community Days has upcoming events scheduled in Pakistan, Brazil, Chengdu, and in Australia.

### Upcoming Release Webinar

Join members of the Kubernetes 1.23 release team on January 4, 2022 to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/e/mrey9h/) on the CNCF Online Programs site.

### Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

- Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)

