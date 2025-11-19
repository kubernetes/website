---
content_type: "reference"
title: 由 kubelet 填充的節點標籤
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
Kubernetes {{< glossary_tooltip text="節點" term_id="node" >}}預先填充了一組標準
{{< glossary_tooltip text="標籤" term_id="label" >}}。

你還可以通過 kubelet 設定或使用 Kubernetes API 在節點上設置自己的標籤。

<!--
## Preset labels

The preset labels that Kubernetes sets on nodes are:
-->
## 預設標籤 {#preset-labels}

Kubernetes 在節點上設置的預設標籤有：

<!--
* [`kubernetes.io/arch`](/docs/reference/labels-annotations-taints/#kubernetes-io-arch)
* [`kubernetes.io/hostname`](/docs/reference/labels-annotations-taints/#kubernetesiohostname)
* [`kubernetes.io/os`](/docs/reference/labels-annotations-taints/#kubernetes-io-os)
* [`node.kubernetes.io/instance-type`](/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
* [`topology.kubernetes.io/region`](/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
* [`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)
  (if known to the kubelet &ndash; Kubernetes may not have this information to set the label)
-->
* [`kubernetes.io/arch`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-arch)
* [`kubernetes.io/hostname`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetesiohostname)
* [`kubernetes.io/os`](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-os)
* [`node.kubernetes.io/instance-type`](/zh-cn/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能沒有這些信息來設置標籤）
* [`topology.kubernetes.io/region`](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能沒有這些信息來設置標籤）
* [`topology.kubernetes.io/zone`](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone)
  （如果 kubelet 知道此信息 &ndash; Kubernetes 可能沒有這些信息來設置標籤）

{{<note>}}
<!--
The value of these labels is cloud provider specific and is not guaranteed to be reliable.
For example, the value of `kubernetes.io/hostname` may be the same as the node name in some environments
and a different value in other environments.
-->
這些標籤的值是特定於雲提供商的，並且不保證其可靠性。
例如，`kubernetes.io/hostname` 的值在某些環境中可能與節點名稱相同，
而在其他環境中可能與節點名稱不同。
{{</note>}}

## {{% heading "whatsnext" %}}

<!--
- See [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/) for a list of common labels.
- Learn how to [add a label to a node](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
-->
- 有關常見標籤的列表，請參閱[衆所周知的標籤、註釋和污點](/zh-cn/docs/reference/labels-annotations-taints/)。
- 瞭解如何[向節點添加標籤](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)。
