---
content_type: "reference"
title: 由 kubelet 填充的节点标签
weight: 40
---
<!--
content_type: "reference"
title: Node Labels Populated By The Kubelet
weight: 40
-->

<!--
Kubernetes {{< glossary_tooltip text="nodes" term_id="node" >}} come pre-populated
with a standard set of {{< glossary_tooltip text="labels" term_id="label" >}}.

You can also set your own labels on nodes, either through the kubelet configuration or
using the Kubernetes API.
-->
Kubernetes {{< glossary_tooltip text="节点" term_id="node" >}}预先填充了一组标准
{{< glossary_tooltip text="标签" term_id="label" >}}。

你还可以通过 kubelet 配置或使用 Kubernetes API 在节点上设置自己的标签。

<!--
## Preset labels

The preset labels that Kubernetes sets on nodes are:
-->
## 预设标签 {#preset-labels}

Kubernetes 在节点上设置的预设标签有：

<!--
* [`kubernetes.io/arch`](/docs/reference/labels-annotations-taints/#kubernetes-io-arch)
* [`kubernetes.io/hostname`](/docs/reference/labels-annotations-taints/#kubernetes-io-hostname)
* [`kubernetes.io/os`](/docs/reference/labels-annotations-taints/#kubernetes-io-os)
* [`node.kubernetes.io/instance-type`](/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
* [`topology.kubernetes.io/region`](/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
* [`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
-->
* [`kubernetes.io/arch`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-arch)
* [`kubernetes.io/hostname`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-hostname)
* [`kubernetes.io/os`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-os)
* [`node.kubernetes.io/instance-type`](/zh-cn/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能没有这些信息来设置标签）
* [`topology.kubernetes.io/region`](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能没有这些信息来设置标签）
* [`topology.kubernetes.io/zone`](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能没有这些信息来设置标签）

{{<note>}}
<!--
The value of these labels is cloud provider specific and is not guaranteed to be reliable.
For example, the value of `kubernetes.io/hostname` may be the same as the node name in some environments
and a different value in other environments.
-->
这些标签的值是特定于云提供商的，并且不保证其可靠性。
例如，`kubernetes.io/hostname` 的值在某些环境中可能与节点名称相同，
而在其他环境中可能与节点名称不同。
{{</note>}}

## {{% heading "whatsnext" %}}

<!--
- See [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/) for a list of common labels.
- Learn how to [add a label to a node](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
-->
- 有关常见标签的列表，请参阅[众所周知的标签、注释和污点](/zh-cn/docs/reference/labels-annotations-taints/)。
- 了解如何[向节点添加标签](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
