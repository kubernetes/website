---
content_type: concept
title: 调度 GPU
description: 配置和调度 GPU 成一类资源以供集群中节点使用。
---
<!--
reviewers:
- vishh
content_type: concept
title: Schedule GPUs
description: Configure and schedule GPUs for use as a resource by nodes in a cluster.
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

<!--
Kubernetes includes **stable** support for managing AMD and NVIDIA GPUs
(graphical processing units) across different nodes in your cluster, using
{{< glossary_tooltip text="device plugins" term_id="device-plugin" >}}.

This page describes how users can consume GPUs, and outlines
some of the limitations in the implementation.
-->
Kubernetes 支持使用{{< glossary_tooltip text="设备插件" term_id="device-plugin" >}}来跨集群中的不同节点管理
AMD 和 NVIDIA GPU（图形处理单元），目前处于**稳定**状态。

本页介绍用户如何使用 GPU 以及当前存在的一些限制。

<!-- body -->

<!--
## Using device plugins

Kubernetes implements device plugins to let Pods access specialized hardware features such as GPUs.
-->
## 使用设备插件  {#using-device-plugins}

Kubernetes 实现了设备插件（Device Plugin），让 Pod 可以访问类似 GPU 这类特殊的硬件功能特性。

{{% thirdparty-content %}}

<!--
As an administrator, you have to install GPU drivers from the corresponding
hardware vendor on the nodes and run the corresponding device plugin from the
GPU vendor. Here are some links to vendors' instructions:
-->
作为集群管理员，你要在节点上安装来自对应硬件厂商的 GPU 驱动程序，并运行来自
GPU 厂商的对应设备插件。以下是一些厂商说明的链接：

* [AMD](https://github.com/RadeonOpenCompute/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)
<!--
Once you have installed the plugin, your cluster exposes a custom schedulable
resource such as `amd.com/gpu` or `nvidia.com/gpu`.

You can consume these GPUs from your containers by requesting
the custom GPU resource, the same way you request `cpu` or `memory`.
However, there are some limitations in how you specify the resource
requirements for custom devices.
-->
一旦你安装了插件，你的集群就会暴露一个自定义可调度的资源，例如 `amd.com/gpu` 或 `nvidia.com/gpu`。

你可以通过请求这个自定义的 GPU 资源在你的容器中使用这些 GPU，其请求方式与请求 `cpu` 或 `memory` 时相同。
不过，在如何指定自定义设备的资源请求方面存在一些限制。

<!--
GPUs are only supposed to be specified in the `limits` section, which means:
* You can specify GPU `limits` without specifying `requests`, because
  Kubernetes will use the limit as the request value by default.
* You can specify GPU in both `limits` and `requests` but these two values
  must be equal.
* You cannot specify GPU `requests` without specifying `limits`.
-->
GPU 只能在 `limits` 部分指定，这意味着：
* 你可以指定 GPU 的 `limits` 而不指定其 `requests`，因为 Kubernetes 将默认使用限制值作为请求值。
* 你可以同时指定 `limits` 和 `requests`，不过这两个值必须相等。
* 你不可以仅指定 `requests` 而不指定 `limits`。

<!--
Here's an example manifest for a Pod that requests a GPU:
-->
以下是一个 Pod 请求 GPU 的示例清单：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 请求 1 个 GPU
```

<!--
## Manage clusters with different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:
-->
## 管理配有不同类型 GPU 的集群   {#manage-clusters-with-different-types-of-gpus}

如果集群内部的不同节点上有不同类型的 NVIDIA GPU，
那么你可以使用[节点标签和节点选择器](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)来将
Pod 调度到合适的节点上。

例如：

<!--
```shell
# Label your nodes with the accelerator type they have.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```
-->
```shell
# 为你的节点加上它们所拥有的加速器类型的标签
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

<!--
That label key `accelerator` is just an example; you can use
a different label key if you prefer.
-->
这个标签键 `accelerator` 只是一个例子；如果你愿意，可以使用不同的标签键。

<!--
## Automatic node labelling {#node-labeller}
-->
## 自动节点标签  {#node-labeller}

<!--
As an administrator, you can automatically discover and label all your GPU enabled nodes
by deploying Kubernetes [Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD).
NFD detects the hardware features that are available on each node in a Kubernetes cluster.
Typically, NFD is configured to advertise those features as node labels, but NFD can also add extended resources, annotations, and node taints.
NFD is compatible with all [supported versions](/releases/version-skew-policy/#supported-versions) of Kubernetes.
By default NFD create the [feature labels](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html) for the detected features.
Administrators can leverage NFD to also taint nodes with specific features, so that only pods that request those features can be scheduled on those nodes.
-->
作为管理员，你可以通过部署 Kubernetes
[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD)
来自动发现所有启用 GPU 的节点并为其打标签。NFD 检测 Kubernetes 集群中每个节点上可用的硬件特性。
通常，NFD 被配置为以节点标签广告这些特性，但 NFD 也可以添加扩展的资源、注解和节点污点。
NFD 兼容所有[支持版本](/zh-cn/releases/version-skew-policy/#supported-versions)的 Kubernetes。
NFD 默认会为检测到的特性创建[特性标签](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html)。
管理员可以利用 NFD 对具有某些具体特性的节点添加污点，以便只有请求这些特性的 Pod 可以被调度到这些节点上。

<!--
You also need a plugin for NFD that adds appropriate labels to your nodes; these might be generic
labels or they could be vendor specific. Your GPU vendor may provide a third party
plugin for NFD; check their documentation for more details.
-->
你还需要一个 NFD 插件，将适当的标签添加到你的节点上；
这些标签可以是通用的，也可以是供应商特定的。你的 GPU 供应商可能会为 NFD 提供第三方插件；
更多细节请查阅他们的文档。

<!--
{{< highlight yaml "linenos=false,hl_lines=7-18" >}}
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  # You can use Kubernetes node affinity to schedule this Pod onto a node
  # that provides the kind of GPU that its container needs in order to work
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt # (greater than)
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # NFD Feature label
            values: ["true"] # (optional) only schedule on nodes with PCI device 10
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # requesting 1 GPU
{{< /highlight >}}
-->
{{< highlight yaml "linenos=false,hl_lines=7-18" >}}
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  # 你可以使用 Kubernetes 节点亲和性将此 Pod 调度到提供其容器所需的那种 GPU 的节点上
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt #（大于）
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # NFD 特性标签
            values: ["true"] #（可选）仅调度到具有 PCI 设备 10 的节点上
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 请求 1 个 GPU
{{< /highlight >}}

<!--
#### GPU vendor implementations

- [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
- [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)
-->
#### GPU 供应商实现

- [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
- [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)