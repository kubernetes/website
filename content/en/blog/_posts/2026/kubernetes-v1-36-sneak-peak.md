---
layout: blog
title: 'Kubernetes v1.36: Sneak peek'
date: 2026-02-25
slug: kubernetes-v1-36-sneak-peek
author: >
  Chad Crowell,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Utkarsh Umre
---

Kubernetes v1.36 is coming at the end of April 2026. This release will include removals and deprecations, and it is packed with an impressive number of enhancements. Here are some of the features we're most excited about in this cycle!
Please note that this information reflects the current state of v1.36 development and may change before release.

## Deprecations and removals for Kubernetes v1.36

### Deprecation of service.spec.externalIPs

As of Kubernetes 1.36, we are declaring the Service `externalIPs` field to be deprecated.

### Remove gitRepo volume driver

Starting Kubernetes v1.36 the `gitRepo` volume plugin has been disabled and cannot be enabled.

### Kubernetes is deprecating ingress-nginx support

To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee are announcing the upcoming retirement of Ingress NGINX.

You can find more in the [official blog post](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/)

## Featured enhancements of Kubernetes v1.36

The following enhancements are some of those likely to be included in the v1.36 release. This is not a commitment, and the release content is subject to change.

### Mutating Admission Policies (CEL-based)

Mutating admission policies use the Common Expression Language (CEL) to declare mutations to resources. Mutations can be defined either with an *apply configuration* that is merged using the [server side apply merge strategy](/docs/reference/using-api/server-side-apply/#merge-strategy), or a [JSON patch](https://jsonpatch.com/).

To learn more about this before the official documentation is published, you can read [KEP-3962](https://github.com/kubernetes/enhancements/issues/3962).

### Support external signing of service account tokens

Kubernetes is graduating in-place updates for Pod resources to General Availability (GA). This feature allows users to adjust `cpu` and `memory` resources without restarting Pods or Containers. Previously, such modifications required recreating Pods, which could disrupt workloads, particularly for stateful or batch applications.
Previous Kubernetes releases already allowed you to change infrastructure resources settings (requests and limits) for existing Pods. This allows for smoother [vertical scaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/), improves efficiency, and can also simplify solution development.

The Container Runtime Interface (CRI) has also been improved, extending the `UpdateContainerResources` API for Windows and future runtimes while allowing `ContainerStatus` to report real-time resource configurations. Together, these changes make scaling in Kubernetes faster, more flexible, and disruption-free.
The feature was introduced as alpha in v1.27, graduated to beta in v1.33, and is targeting graduation to stable in v1.35.

You can find more in [KEP-740: Support external signing of service account tokens](https://github.com/kubernetes/enhancements/issues/740)

### User namespaces in pods

After several years of development, User Namespaces support in Kubernetes reached General Availability (GA) with the v1.36 release.

You can find more in [KEP-4317: Pod Certificates](https://kep.k8s.io/4317)

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