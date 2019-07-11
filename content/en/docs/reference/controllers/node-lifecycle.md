---
toc_hide: true
title: Node lifecycle controller
content_template: templates/concept
---

{{% capture overview %}}

The Node lifecycle {{< glossary_tooltip term_id="controller" text="controller" >}}
automates managing {{< glossary_tooltip text="taints" term_id="taint" >}} on
cluster nodes.

{{% /capture %}}

{{% capture body %}}

The Node lifecycle controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller observes the behavior of the {{< glossary_tooltip term_id="kubelet" >}}
on a cluster node, and sets (potentially also removes)
{{< glossary_tooltip text="taints" term_id="taint" >}} on Nodes
to match its findings.

For example: if a kubelet stops reporting that a worker node is healthy, the
controller can apply a taint to prevent scheduling new Pods there.

If there is a significant problem&mdash;maybe the entire node has crashed&mdash;then
this controller triggers evictions for the Pods on the affected node.

If you're using taint-based evictions, this controller takes care to limit the rate at
which it adds taints to nodes. If many nodes get the same taint at once, that rate limit
reduces the impact of evictions that would otherwise happen as soon as the API server
registered the relevant taints.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about other [cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
* Read about [Taint based evictions](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/#taint-based-evictions)
{{% /capture %}}

