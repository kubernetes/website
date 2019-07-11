---
toc_hide: true
title: Namespace controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="namespace" >}} controller is a built-in
controller that handles cleanup when a Namespace is removed.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

When you (or any Kubernetes API client) remove a namespace, this
controller makes sure that objects in that namespace are removed before
the namespace itself is removed.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/)
* Learn about other [resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)

{{% /capture %}}
