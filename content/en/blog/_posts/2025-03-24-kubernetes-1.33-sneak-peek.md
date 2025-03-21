---
layout: blog
title: 'Kubernetes v1.33 sneak peek'
date: 2025-03-24
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
---

As the release of Kubernetes v1.33 approaches, the Kubernetes project continues to evolve. Features may be deprecated, removed, or replaced to improve the overall health of the project. This blog post outlines some planned changes for the v1.33 release, which the release team believes you should be aware of to ensure the continued smooth operation of your Kubernetes environment and to keep you up-to-date with the latest developments.  The information below is based on the current status of the v1.33 release and is subject to change before the final release date.

## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.

Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).

## Deprecations and removals for Kubernetes v1.33

### Deprecation of the stable Endpoints API

The [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) API has been stable since v1.21, which effectively replaced the original Endpoints API. While the original Endpoints API was simple and straightforward, it also posed some challenges when scaling to large numbers of network endpoints. The EndpointSlices API has introduced new features such as dual-stack networking, making the original Endpoints API ready for deprecation.

This deprecation only impacts those who use the Endpoints API directly from workloads or scripts; these users should migrate to use EndpointSlices instead. There will be a dedicated blog post with more details on the deprecation implications and migration plans in the coming weeks.

You can find more in [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974).

### Removal of kube-proxy version information in node status

Following its deprecation in v1.31, as highlighted in the [release announcement](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004), the `status.nodeInfo.kubeProxyVersion` field will be removed in v1.33. This field was set by kubelet, but its value was not consistently accurate. As it has been disabled by default since v1.31, the v1.33 release will remove this field entirely.

You can find more in [KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004).

### Removal of host network support for Windows pods

Windows Pod networking aimed to achieve feature parity with Linux and provide better cluster density by allowing containers to use the Node’s networking namespace.
The original implementation landed as alpha with v1.26, but as it faced unexpected containerd behaviours,
and alternative solutions were available, the Kubernetes project has decided to withdraw the associated
KEP. We're expecting to see support fully removed in v1.33.

You can find more in [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503).

## Featured improvement of Kubernetes v1.33

As authors of this article, we picked one improvement as the most significant change to call out!

### Support for user namespaces within Linux Pods

One of the oldest open KEPs today is [KEP-127](https://kep.k8s.io/127), Pod security improvement by using Linux [User namespaces](/docs/concepts/workloads/pods/user-namespaces/) for Pods. This KEP was first opened in late 2016, and after multiple iterations, had its alpha release in v1.25, initial beta in v1.30 (where it was disabled by default), and now is set to be a part of v1.33, where the feature is available by default.

This support will not impact existing Pods unless you manually specify `pod.spec.hostUsers` to opt in. As highlighted in the [v1.30 sneak peek blog](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/), this is an important milestone for mitigating vulnerabilities.

You can find more in [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127).

## Selected other Kubernetes v1.33 improvements

The following list of enhancements is likely to be included in the upcoming v1.33 release. This is not a commitment and the release content is subject to change.

### In-place resource resize for vertical scaling of Pods

When provisioning a Pod, you can use various resources such as Deployment, StatefulSet, etc. Scalability requirements may need horizontal scaling by updating the Pod replica count, or vertical scaling by updating resources allocated to Pod’s container(s). Before this enhancement, container resources defined in a Pod's `spec` were immutable, and updating any of these details within a Pod template would trigger Pod replacement.

But what if you could dynamically update the resource configuration for your existing Pods without restarting them?

The [KEP-1287](https://kep.k8s.io/1287) is precisely to allow such in-place Pod updates. It opens up various possibilities of vertical scale-up for stateful processes without any downtime, seamless scale-down when the traffic is low, and even allocating larger resources during startup that is eventually reduced once the initial setup is complete. This was released as alpha in v1.27, and is expected to land as beta in v1.33.

You can find more in [KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287).

### DRA’s ResourceClaim Device Status graduates to beta

The `devices` field in ResourceClaim `status`, originally introduced in the v1.32 release, is likely to graduate to beta in v1.33. This field allows drivers to report device status data, improving both observability and troubleshooting capabilities.

For example, reporting the interface name, MAC address, and IP addresses of network interfaces in the status of a ResourceClaim can significantly help in configuring and managing network services, as well as in debugging network related issues. You can read more about ResourceClaim Device Status in [Dynamic Resource Allocation: ResourceClaim Device Status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) document.

Also, you can find more about the planned enhancement in [KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817).

### Ordered namespace deletion

This KEP introduces a more structured deletion process for Kubernetes namespaces to ensure secure and deterministic resource removal. The current semi-random deletion order can create security gaps or unintended behaviour, such as Pods persisting after their associated NetworkPolicies are deleted. By enforcing a structured deletion sequence that respects logical and security dependencies, this approach ensures Pods are removed before other resources. The design improves Kubernetes’s security and reliability by mitigating risks associated with non-deterministic deletions.

You can find more in [KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080).

### Enhancements for indexed job management

These two KEPs are both set to graduate to GA to provide better reliability for job handling, specifically for indexed jobs. [KEP-3850](https://kep.k8s.io/3850) provides per-index backoff limits for indexed jobs, which allows each index to be fully independent of other indexes. Also, [KEP-3998](https://kep.k8s.io/3998) extends Job API to define conditions for making an indexed job as successfully completed when not all indexes are succeeded.

You can find more in [KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) and [KEP-3998: Job success/completion policy](https://kep.k8s.io/3998).

## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md) as part of the CHANGELOG for that release.

Kubernetes v1.33 release is planned for **Wednesday, 23rd April, 2025**. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:

* [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)