---
content_type: concept
title: 調度 GPU
description: 設定和調度 GPU 成一類資源以供叢集中節點使用。
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
Kubernetes 支持使用{{< glossary_tooltip text="設備插件" term_id="device-plugin" >}}來跨叢集中的不同節點管理
AMD 和 NVIDIA GPU（圖形處理單元），目前處於**穩定**狀態。

本頁介紹使用者如何使用 GPU 以及當前存在的一些限制。

<!-- body -->

<!--
## Using device plugins

Kubernetes implements device plugins to let Pods access specialized hardware features such as GPUs.
-->
## 使用設備插件  {#using-device-plugins}

Kubernetes 實現了設備插件（Device Plugin），讓 Pod 可以訪問類似 GPU 這類特殊的硬件功能特性。

{{% thirdparty-content %}}

<!--
As an administrator, you have to install GPU drivers from the corresponding
hardware vendor on the nodes and run the corresponding device plugin from the
GPU vendor. Here are some links to vendors' instructions:
-->
作爲叢集管理員，你要在節點上安裝來自對應硬件廠商的 GPU 驅動程式，並運行來自
GPU 廠商的對應設備插件。以下是一些廠商說明的鏈接：

* [AMD](https://github.com/ROCm/k8s-device-plugin#deployment)
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
一旦你安裝了插件，你的叢集就會暴露一個自定義可調度的資源，例如 `amd.com/gpu` 或 `nvidia.com/gpu`。

你可以通過請求這個自定義的 GPU 資源在你的容器中使用這些 GPU，其請求方式與請求 `cpu` 或 `memory` 時相同。
不過，在如何指定自定義設備的資源請求方面存在一些限制。

<!--
GPUs are only supposed to be specified in the `limits` section, which means:
* You can specify GPU `limits` without specifying `requests`, because
  Kubernetes will use the limit as the request value by default.
* You can specify GPU in both `limits` and `requests` but these two values
  must be equal.
* You cannot specify GPU `requests` without specifying `limits`.
-->
GPU 只能在 `limits` 部分指定，這意味着：
* 你可以指定 GPU 的 `limits` 而不指定其 `requests`，因爲 Kubernetes 將預設使用限制值作爲請求值。
* 你可以同時指定 `limits` 和 `requests`，不過這兩個值必須相等。
* 你不可以僅指定 `requests` 而不指定 `limits`。

<!--
Here's an example manifest for a Pod that requests a GPU:
-->
以下是一個 Pod 請求 GPU 的示例清單：

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
          gpu-vendor.example/example-gpu: 1 # 請求 1 個 GPU
```

<!--
## Manage clusters with different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:
-->
## 管理配有不同類型 GPU 的叢集   {#manage-clusters-with-different-types-of-gpus}

如果叢集內部的不同節點上有不同類型的 NVIDIA GPU，
那麼你可以使用[節點標籤和節點選擇器](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)來將
Pod 調度到合適的節點上。

例如：

<!--
```shell
# Label your nodes with the accelerator type they have.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```
-->
```shell
# 爲你的節點加上它們所擁有的加速器類型的標籤
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

<!--
That label key `accelerator` is just an example; you can use
a different label key if you prefer.
-->
這個標籤鍵 `accelerator` 只是一個例子；如果你願意，可以使用不同的標籤鍵。

<!--
## Automatic node labelling {#node-labeller}
-->
## 自動節點標籤  {#node-labeller}

<!--
As an administrator, you can automatically discover and label all your GPU enabled nodes
by deploying Kubernetes [Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD).
NFD detects the hardware features that are available on each node in a Kubernetes cluster.
Typically, NFD is configured to advertise those features as node labels, but NFD can also add extended resources, annotations, and node taints.
NFD is compatible with all [supported versions](/releases/version-skew-policy/#supported-versions) of Kubernetes.
By default NFD create the [feature labels](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html) for the detected features.
Administrators can leverage NFD to also taint nodes with specific features, so that only pods that request those features can be scheduled on those nodes.
-->
作爲管理員，你可以通過部署 Kubernetes
[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD)
來自動發現所有啓用 GPU 的節點併爲其打標籤。NFD 檢測 Kubernetes 叢集中每個節點上可用的硬件特性。
通常，NFD 被設定爲以節點標籤廣告這些特性，但 NFD 也可以添加擴展的資源、註解和節點污點。
NFD 兼容所有[支持版本](/zh-cn/releases/version-skew-policy/#supported-versions)的 Kubernetes。
NFD 預設會爲檢測到的特性創建[特性標籤](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html)。
管理員可以利用 NFD 對具有某些具體特性的節點添加污點，以便只有請求這些特性的 Pod 可以被調度到這些節點上。

<!--
You also need a plugin for NFD that adds appropriate labels to your nodes; these might be generic
labels or they could be vendor specific. Your GPU vendor may provide a third party
plugin for NFD; check their documentation for more details.
-->
你還需要一個 NFD 插件，將適當的標籤添加到你的節點上；
這些標籤可以是通用的，也可以是供應商特定的。你的 GPU 供應商可能會爲 NFD 提供第三方插件；
更多細節請查閱他們的文檔。

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
  # 你可以使用 Kubernetes 節點親和性將此 Pod 調度到提供其容器所需的那種 GPU 的節點上
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt #（大於）
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # NFD 特性標籤
            values: ["true"] #（可選）僅調度到具有 PCI 設備 10 的節點上
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 請求 1 個 GPU
{{< /highlight >}}

<!--
#### GPU vendor implementations

- [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
- [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)
-->
#### GPU 供應商實現

- [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
- [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin)