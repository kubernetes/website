---
title: "Policies"
weight: 90
no_list: true
description: >
  Manage security and best-practices with policies.
---

<!-- overview -->

Kubernetes policies are configurations that manage other configurations or runtime behaviors. Kubernetes offers various forms of policies, described below:

<!-- body -->

## Apply policies using API objects

 Some API objects act as policies. Here are some examples:
* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) can be used to restrict ingress and egress traffic for a workload.
* [LimitRanges](/docs/concepts/policy/limit-range/) manage resource allocation constraints across different object kinds.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) limit resource consumption for a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

## Apply policies using admission controllers

An {{< glossary_tooltip text="admission controller" term_id="admission-controller" >}}
runs in the API server
and can validate or mutate API requests. Some admission controllers act to apply policies.
For example, the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller modifies a new Pod to set the image pull policy to `Always`.

Kubernetes has several built-in admission controllers that are configurable via the API server `--enable-admission-plugins` flag.

Details on admission controllers, with the complete list of available admission controllers, are documented in a dedicated section:

* [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)

## Apply policies using ValidatingAdmissionPolicy

Validating admission policies allow configurable validation checks to be executed in the API server using the Common Expression Language (CEL). For example, a `ValidatingAdmissionPolicy` can be used to disallow use of the `latest` image tag.

A `ValidatingAdmissionPolicy` operates on an API request and can be used to block, audit, and warn users about non-compliant configurations.

Details on the `ValidatingAdmissionPolicy` API, with examples, are documented in a dedicated section:
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)


## Apply policies using dynamic admission control

Dynamic admission controllers (or admission webhooks) run outside the API server as separate applications that register to receive webhooks requests to perform validation or mutation of API requests. 

Dynamic admission controllers can be used to apply policies on API requests and trigger other policy-based workflows. A dynamic admission controller can perform complex checks including those that require retrieval of other cluster resources and external data. For example, an image verification check can lookup data from OCI registries to validate the container image signatures and attestations.

Details on dynamic admission control are documented in a dedicated section:
* [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### Implementations {#implementations-admission-control}

{{% thirdparty-content %}}

Dynamic Admission Controllers that act as flexible policy engines are being developed in the Kubernetes ecosystem, such as:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Apply policies using Kubelet configurations

Kubernetes allows configuring the Kubelet on each worker node.  Some Kubelet configurations act as policies:
* [Process ID limits and reservations](/docs/concepts/policy/pid-limiting/) are used to limit and reserve allocatable PIDs.
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/) can manage compute, memory, and device resources for latency-critical and high-throughput workloads. 
