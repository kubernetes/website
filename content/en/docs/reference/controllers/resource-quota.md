---
toc_hide: true
title: Resource quota controller
content_template: templates/concept
---

{{% capture overview %}}

This {{< glossary_tooltip term_id="controller" >}} limits the quantity of objects
that can be created in a Namespace by object type, as well as the total amount of
compute resources that may be consumed by resources in that Namespace.

{{% /capture %}}

{{% capture body %}}

The ResourceQuota controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

Acting as an [admission controller](/docs/reference/access-authn-authz/admission-controllers/),
this component rejects requests that would take the amount of resource past
any configured limit. The controller tracks (and caches) the actual amount of
resource in real time, so that it can make an admission decision promptly.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [resource quotas](/docs/concepts/policy/resource-quotas/) 
{{% /capture %}}
