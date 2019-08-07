---
title: Namespace controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="namespace" >}} controller handles
cleanup when a Namespace is removed.

{{% /capture %}}

{{% capture body %}}

The namespace controller is built in to kube-controller-manager.

## Controller behaviour

When you (or any Kubernetes API client) remove a namespace, this
controller makes sure that objects in that namespace are removed before
the namespace itself is removed.

{{% /capture %}}
