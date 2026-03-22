---
layout: blog
title: 'Kubernetes v1.36: Sneak peek'
date: 2026-XX-XX
draft: true
slug: kubernetes-v1-36-sneak-peek
author: >
  Chad Crowell,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Utkarsh Umre
---

Kubernetes v1.36 is coming at the end of April 2026. This release will include removals and deprecations, and it is packed with an impressive number of enhancements. Here are some of the features we are most excited about in this cycle!

Please note that this information reflects the current state of v1.36 development and may change before release.

## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented [deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

- Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
- Beta or pre-release API versions must be supported for 3 releases after the deprecation.
- Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.

Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](https://kubernetes.io/docs/reference/using-api/deprecation-guide/).

## Deprecations and removals for Kubernetes v1.36

### Deprecation of service.spec.externalIPs in Service

The `externalIPs` field in Service `spec` is being deprecated, which means you’ll soon lose a quick way to route arbitrary externalIPs to your Services. This field has been a known security headache for years, enabling man-in-the-middle attacks on your cluster traffic, as documented in [CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/970760). From Kubernetes v1.36 and onwards, you will see deprecation warnings when using it, with full removal planned for v1.43.

If your Services still lean on `externalIPs`, consider using LoadBalancer services for cloud-managed ingress, NodePort for simple port exposure, or Gateway API for a more flexible and secure way to handle external traffic.

You can find more in [KEP-5707: Deprecate service.spec.externalIPs](https://kep.k8s.io/5707)

### Removal of in-tree gitRepo volume driver

The gitRepo volume type has been deprecated since v1.11. Starting Kubernetes v1.36, the `gitRepo` volume plugin is permanently disabled and cannot be turned back on. This change protects clusters from a critical security issue where using `gitRepo` could let an attacker run code as root on the node. 

Although `gitRepo` has been deprecated for years and better alternatives have been recommended, it was still technically possible to use it in previous releases. From v1.36 onward, that path is closed for good, so any existing workloads depending on `gitRepo` will need to migrate to supported approaches such as init containers or external git-sync style tools.

You can find more in [KEP-5040: Deprecate service.spec.externalIPs](https://kep.k8s.io/5040)

### Ingress NGINX Retirement

To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee are retiring Ingress NGINX, effective March 30, 2026. As of this date, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities that may be discovered. Existing deployments of Ingress NGINX will continue to function, and installation artifacts like Helm charts and container images will remain available. 

For full details, see the [official retirement announcement](/blog/2025/11/11/ingress-nginx-retirement/)

## Featured enhancements of Kubernetes v1.36

The following list of enhancements is likely to be included in the upcoming v1.36 release. This is not a commitment and the release content is subject to change.

### Speed up recursive SELinux label change

Kubernetes v1.36 will include a massive improvement for volume mounting for Pods on SELinux-enforcing systems by swapping slow recursive file relabeling for the efficient `mount -o context=XYZ` option. This applies the correct SELinux label to the entire volume instantly at mount time, slashing Pod startup delays and avoiding out-of-space risks on nearly full disks.

This feature started as beta in v1.28 for ReadWriteOncePod volumes, and gained alpha  metrics and an opt-out option (`PodSecurityContext.SELinuxChangePolicy: Recursive) in v1.32 to catch conflicts, and now will default to all volumes in v1.36 stable, with CSI drivers enabling it via `CSIDriver.Spec.SELinuxMount`. 

However, this feature can lead to breaking changes in v1.37 due to the mixing of privileged and unprivileged pods. Setting `SELinuxChangePolicy` and `SELinux` labels on Pods correctly is the responsibility of the Pod author, whether they are writing a `Deployment`, `StatefulSet`, or `DaemonSet`. Being careless with these settings can lead to a range of problems when Pods share volumes.

To learn more about this enhancement, read the full KEP [here](https://kep.k8s.io/1710)

### External signing of service account tokens

Kubernetes now supports external signing of service account tokens. This allows clusters to integrate with external key management systems or signing services instead of relying only on internally managed keys.

With this enhancement, the kube-apiserver can delegate token signing to external systems such as cloud key management services or hardware security modules. This improves security and simplifies key management services for clusters that rely on centralized signing infrastructure. 
This feature graduates to stable (GA) in Kubernetes v1.36.

You can find more in [KEP-740: Support external signing of service account tokens](https://kep.k8s.io/740)

### device taints and tolerations

This enhancement introduces support for taints and tolerations for devices managed through Dynamic Resource Allocation (DRA). It allows administrators to control which workloads are allowed to consume specific hardware devices such as GPUs or accelerators. This improves scheduling control and helps ensure that specialized hardware resources are only used by workloads that explicitly request them

To learn more about this enhancement, read the full KEP here: https://kep.k8s.io/5055

### DRA: Add support for partitionable devices

Kubernetes v1.36 expands Dynamic Resource Allocation (DRA) by introducing support for partitionable devices, allowing a single hardware accelerator to be split into multiple logical units that can be shared across workloads.  This is especially useful for high-cost resources like GPUs, where dedicating an entire device to a single workload can lead to underutilization.

With this enhancement, platform teams can improve overall cluster efficiency by allocating only the required portion of a device to each workload, rather than reserving it entirely. This makes it easier to run multiple workloads on the same hardware while maintaining isolation and control, helping organizations get more value out of their infrastructure.

To learn more, read the full KEP here: https://kep.k8s.io/4815

## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md) as part of the CHANGELOG for that release.

Kubernetes v1.36 release is planned for Wednesday, April 22, 2026. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:


- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)
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