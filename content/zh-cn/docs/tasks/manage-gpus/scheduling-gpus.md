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
## Clusters containing different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:
-->
## 集群内存在不同类型的 GPU  {#clusters-containing-different-types-of-gpus}

如果集群内部的不同节点上有不同类型的 NVIDIA GPU，
那么你可以使用[节点标签和节点选择器](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)来将
Pod 调度到合适的节点上。

例如：

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
If you're using AMD GPU devices, you can deploy
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller).
Node Labeller is a {{< glossary_tooltip text="controller" term_id="controller" >}} that automatically
labels your nodes with GPU device properties.

Similar functionality for NVIDIA is provided by
[GPU feature discovery](https://github.com/NVIDIA/gpu-feature-discovery/blob/main/README.md).
-->
如果你在使用 AMD GPU，你可以部署
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller)，
它是一个 {{< glossary_tooltip text="控制器" term_id="controller" >}}，
会自动给节点打上 GPU 设备属性标签。

对于 NVIDIA GPU，[GPU feature discovery](https://github.com/NVIDIA/gpu-feature-discovery/blob/main/README.md)
提供了类似功能。
