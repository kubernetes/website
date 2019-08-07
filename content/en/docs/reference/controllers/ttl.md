---
title: TTL controller
content_template: templates/concept
---

{{% capture overview %}}

The Time-to-live (TTL) controller sets sets TTL annotations on Nodes based on cluster size.

{{% /capture %}}

{{% capture body %}}

## Controller behaviour

This controller sets sets TTL annotations on Nodes based on cluster size.
{{< glossary_tooltip term_id="kubelet" >}} consumes these annotations as a
hint about how long it can cache object data that it has fetched from the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.

{{< comment >}}
This controller is an implementation detail; if kubelet were able to
subscribe to watch resources that are linked to Pods on that node,
kubelet could use those notifications for cache invalidation instead.
{{< /comment >}}

{{% /capture %}}
