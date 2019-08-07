---
title: ServiceAccount token controller
content_template: templates/concept
---

{{% capture overview %}}

One of a pair of controllers for the {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}
resource.

{{% /capture %}}

{{% capture body %}}

The service account token controller is built in to kube-controller-manager.

## Controller behaviour

This controller issues API access tokens for each service account and places them into
an associated {{< glossary_tooltip term_id="secret" >}}. Pods that can access that Secret
can use the token to identify as the relevant service account.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [ServiceAccount controller](/docs/reference/controllers/serviceaccount/)
{{% /capture %}}
