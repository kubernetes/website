---
title: Resource quota controller
content_template: templates/concept
---

{{% capture overview %}}

This controller limits the quantity of objects that can be created in a namespace
by object type, as well as the total amount of compute resources that may be
consumed by resources in that project.

Acting as an [admission controller](/docs/reference/access-authn-authz/admission-controllers/),
this component will reject requests that would take the amount of resource past
any configured limit. The controller tracks the actual amount of resouce in real
so that an admission decision can be made promptly.

{{% /capture %}}

{{% capture body %}}

The resource quota controller is built in to kube-controller-manager.

## Controller behaviour

Acting as an [admission controller](/docs/reference/access-authn-authz/admission-controllers/),
this component will reject requests that would take the amount of resource past
any configured limit. The controller tracks the actual amount of resouce in real
so that an admission decision can be made promptly.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [Resource Quotas](/docs/concepts/policy/resource-quotas/) 
* Read the [design document for resourceQuota](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md)

{{% /capture %}}
