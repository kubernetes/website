---
title: Node lifecycle controller
content_template: templates/concept
---

{{% capture overview %}}

The Node lifecycle controller automates managing
{{< glossary_tooltip text="taints" term_id="taint" >}} on
{{< glossary_tooltip text="Nodes" term_id="node" >}}.

{{% /capture %}}

{{% capture body %}}

The node lifecycle controller is built in to kube-controller-manager.

## Controller behavior

This controller observes the behavior of kubelet on a node, and sets (potentially
also removes) {{< glossary_tooltip text="taints" term_id="taint" >}} on Nodes
that reflect its findings.

For example: if kubelet stops reporting that a worker node is healthy, the
controller can apply a taint to prevent scheduling new Pods there.

If there is a significant problem&mdash;maybe the entire node has crashed&mdash;then
the controller triggers evictions for the Pods on the affected node.

{{% /capture %}}
