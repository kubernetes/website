---
title: Resource management controllers
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

This page lists the resource management
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## ResourceQuota controller

The [ResourceQuota admission controller](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
watches for ResourceQuota objects and uses that information to enforce those
constraints on new Pods.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [certificate controllers](/docs/reference/controllers/certificate-controllers)
{{% /capture %}}
