---
toc_hide: true
title: Time-to-live (TTL) controller
content_template: templates/concept
---

{{% capture overview %}}

The Time-to-live (TTL) controller sets sets TTL annotations on Nodes based on cluster size.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

This controller sets sets TTL annotations on Nodes based on cluster size.
The {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} consumes these
annotations as a hint about how long it can cache object data it has
fetched from the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.

{{< comment >}}
This controller is an implementation detail; if the kubelet were able to
subscribe to watch all resources related to Pods on that node,
then the kubelet could use those notifications for cache invalidation instead.
{{< /comment >}}

{{% /capture %}}
{{% capture whatsnext %}}

* Learn about other [resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)

{{% /capture %}}
