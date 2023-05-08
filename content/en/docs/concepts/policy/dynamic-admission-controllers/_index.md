---
title: Policy with Dynamic Admission Controllers
content_type: concept
weight: 40
description: Dynamic Admission Controllers run outside the API server as separate applications that register to receive webhooks and enable complex validation, or custom mutation, based on API requests. For example, a dynamic admission controller can lookup data from OCI registries and perform image verification checks.

---

Dynamic Admission Controllers run outside the API server as separate applications that register to receive webhooks and enable complex validation, or custom mutation, based on API requests. For example, a dynamic admission controller can perform complex security checks across resources, or lookup data from OCI registries to perform image verification checks.

Details on the dynamic admission controller are documented in a dedicated section:
* [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)


## Implementations

{{% thirdparty-content %}}

Dynamic Admission Controllers that act as flexible policy engines are being developed in the Kubernetes ecosystem, such as:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/pod-security/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)


