---
layout: blog
title: 'Kubernetes v1.32 sneak peek'
date: 2024-11-08
slug: kubernetes-1-32-upcoming-changes
author: >
  Matteo Bianchi,
  Edith Puclla,
  William Rizzo,
  Ryota Sawada,
  Rashan Smith
---

As we get closer to the release date for Kubernetes v1.32, the project develops and matures. Features may be deprecated, removed, or replaced with better ones for the project's overall health. 

This blog outlines some of the planned changes for the Kubernetes v1.32 release, that the release team feels you should be aware of, for the continued maintenance of your Kubernetes environment and keeping up to date with the latest changes. Information listed below is based on the current status of the v1.32 release and may change before the actual release date. 

### The Kubernetes API removal and deprecation process
The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release will continue to function until removal (at least one year from the deprecation). Its usage will result in a warning being displayed. Removed APIs are no longer available in the current version, so you must migrate to use the replacement instead.

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.

Whether an API is removed due to a feature graduating from beta to stable or because that API did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).

## Note on the withdrawal of the old DRA implementation

The enhancement [#3063](https://github.com/kubernetes/enhancements/issues/3063) introduced Dynamic Resource Allocation (DRA) in Kubernetes 1.26.

However, in Kubernetes v1.32, this approach to DRA will be significantly changed. Code related to the original implementation will be removed, leaving KEP [#4381](https://github.com/kubernetes/enhancements/issues/4381) as the "new" base functionality. 

The decision to change the existing approach originated from its incompatibility with cluster autoscaling as resource availability was non-transparent, complicating decision-making for both Cluster Autoscaler and controllers. 
The newly added Structured Parameter model substitutes the functionality.

This removal will allow Kubernetes to handle new hardware requirements and resource claims more predictably, bypassing the complexities of back and forth API calls to the kube-apiserver.

Please also see the enhancement issue [#3063](https://github.com/kubernetes/enhancements/issues/3063) to find out more.

## API removal

There is only a single API removal planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32):

* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration has been removed. 
To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. 
All existing persisted objects are accessible via the new API. Notable changes in flowcontrol.apiserver.k8s.io/v1beta3 include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.

For more information, please refer to the [API deprecation guide](/docs/reference/using-api/deprecation-guide/#v1-32).

## Sneak peek of Kubernetes v1.32

The following list of enhancements is likely to be included in the v1.32 release. This is not a commitment and the release content is subject to change.

### Even more DRA enhancements!

In this release, like the previous one, the Kubernetes project continues proposing a number of enhancements to the Dynamic Resource Allocation (DRA), a key component of the Kubernetes resource management system. These enhancements aim to improve the flexibility and efficiency of resource allocation for workloads that require specialized hardware, such as GPUs, FPGAs and network adapters. This release introduces improvements, including the addition of resource health status in the Pod status, as outlined in KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680).

#### Add resource health status to the Pod status

It isn't easy to know when a Pod uses a device that has failed or is temporarily unhealthy.
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680) proposes exposing device health via Pod `status`, making troubleshooting of Pod crashes easier.

### Windows strikes back!

KEP [#4802](https://github.com/kubernetes/enhancements/issues/4802) adds support for graceful shutdowns of Windows nodes in Kubernetes clusters.
Before this release, Kubernetes provided graceful node shutdown functionality for Linux nodes but lacked equivalent support for Windows. This enhancement enables the kubelet on Windows nodes to handle system shutdown events properly. Doing so, it ensures that Pods running on Windows nodes are gracefully terminated, allowing workloads to be rescheduled without disruption. This improvement enhances the reliability and stability of clusters that include Windows nodes, especially during a planned maintenance or any system updates.

### Allow special characters in environment variables

With the graduation of this [enhancement](https://github.com/kubernetes/enhancements/issues/4369) to beta, Kubernetes now allows almost all printable ASCII characters (excluding "=") to be used as environment variable names. This change addresses the limitations previously imposed on variable naming, facilitating a broader adoption of Kubernetes by accommodating various application needs. The relaxed validation will be enabled by default via the `RelaxedEnvironmentVariableValidation` feature gate, ensuring that users can easily utilize environment variables without strict constraints, enhancing flexibility for developers working with applications like .NET Core that require special characters in their configurations.

### Make Kubernetes aware of the LoadBalancer behavior

KEP [#1860](https://github.com/kubernetes/enhancements/issues/1860) graduates to GA, introducing the `ipMode` field for a Service of `type: LoadBalancer`, which can be set to either `"VIP"` or `"Proxy"`. This enhancement is aimed at improving how cloud providers load balancers interact with kube-proxy and it is a change transparent to the end user. The existing behavior of kube-proxy is preserved when using `"VIP"`, where kube-proxy handles the load balancing. Using `"Proxy"` results in traffic sent directly to the load balancer, providing cloud providers greater control over relying on kube-proxy; this means that you could see an improvement in the performance of your load balancer for some cloud providers.

### Retry generate name for resources
This [enhancement](https://github.com/kubernetes/enhancements/issues/4420) improves how name conflicts are handled for Kubernetes resources created with the `generateName` field. Previously, if a name conflict occurred, the API server returned a 409 HTTP Conflict error and clients had to manually retry the request. With this update, the API server automatically retries generating a new name up to seven times in case of a conflict. This significantly reduces the chances of collision, ensuring smooth generation of up to 1 million names with less than a 0.1% probability of a conflict, providing more resilience for large-scale workloads.

## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md) as part of the CHANGELOG for this release.

You can see the announcements of changes in the release notes for:

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md)
