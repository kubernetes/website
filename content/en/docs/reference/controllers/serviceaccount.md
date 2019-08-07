---
title: ServiceAccount controller
content_template: templates/concept
---

{{% capture overview %}}

One of a pair of controllers for the {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}
resource.

{{% /capture %}}

{{% capture body %}}

The service account controller is built in to kube-controller-manager.

## Controller behaviour

This controller ensures that each Namespace contains a default service account.
{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [ServiceAccount token controller](/docs/reference/controllers/serviceaccount-token/)
{{% /capture %}}
