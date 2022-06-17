---
content_type: concept
title: 排程 GPUs
description: 配置和排程 GPU 成一類資源以供叢集中節點使用。
---
<!--
reviewers:
- vishh
content_type: concept
title: Schedule GPUs
description: Configure and schedule GPUs for use as a resource by nodes in a cluster.
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.10" >}}

<!--
Kubernetes includes **experimental** support for managing AMD and NVIDIA GPUs
(graphical processing units) across several nodes.

This page describes how users can consume GPUs across different Kubernetes versions
and the current limitations.
-->
Kubernetes 支援對節點上的 AMD 和 NVIDIA GPU （圖形處理單元）進行管理，目前處於**實驗**狀態。

本頁介紹使用者如何在不同的 Kubernetes 版本中使用 GPU，以及當前存在的一些限制。

<!-- body -->

<!--
## Using device plugins

Kubernetes implements {{< glossary_tooltip text="Device Plugins" term_id="device-plugin" >}}
to let Pods access specialized hardware features such as GPUs.

As an administrator, you have to install GPU drivers from the corresponding
hardware vendor on the nodes and run the corresponding device plugin from the
GPU vendor:
-->
## 使用裝置外掛  {#using-device-plugins}

Kubernetes 實現了{{< glossary_tooltip text="裝置外掛（Device Plugins）" term_id="device-plugin" >}}
以允許 Pod 訪問類似 GPU 這類特殊的硬體功能特性。

作為叢集管理員，你要在節點上安裝來自對應硬體廠商的 GPU 驅動程式，並執行
來自 GPU 廠商的對應的裝置外掛。

* [AMD](#deploying-amd-gpu-device-plugin)
* [NVIDIA](#deploying-nvidia-gpu-device-plugin)

<!--
When the above conditions are true, Kubernetes will expose `amd.com/gpu` or
`nvidia.com/gpu` as a schedulable resource.

You can consume these GPUs from your containers by requesting
`<vendor>.com/gpu` the same way you request `cpu` or `memory`.
However, there are some limitations in how you specify the resource requirements
when using GPUs:
-->
當以上條件滿足時，Kubernetes 將暴露 `amd.com/gpu` 或 `nvidia.com/gpu` 為
可排程的資源。

你可以透過請求 `<vendor>.com/gpu` 資源來使用 GPU 裝置，就像你為 CPU
和記憶體所做的那樣。
不過，使用 GPU 時，在如何指定資源需求這個方面還是有一些限制的：

<!--
- GPUs are only supposed to be specified in the `limits` section, which means:
  * You can specify GPU `limits` without specifying `requests` because
    Kubernetes will use the limit as the request value by default.
  * You can specify GPU in both `limits` and `requests` but these two values
    must be equal.
  * You cannot specify GPU `requests` without specifying `limits`.
- Containers (and Pods) do not share GPUs. There's no overcommitting of GPUs.
- Each container can request one or more GPUs. It is not possible to request a
  fraction of a GPU.
-->
- GPUs 只能設定在 `limits` 部分，這意味著：
  * 你可以指定 GPU 的 `limits` 而不指定其 `requests`，Kubernetes 將使用限制
    值作為預設的請求值；
  * 你可以同時指定 `limits` 和 `requests`，不過這兩個值必須相等。
  * 你不可以僅指定 `requests` 而不指定 `limits`。
- 容器（以及 Pod）之間是不共享 GPU 的。GPU 也不可以過量分配（Overcommitting）。
- 每個容器可以請求一個或者多個 GPU，但是用小數值來請求部分 GPU 是不允許的。

<!--
Here's an example:
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: cuda-vector-add
      # https://github.com/kubernetes/kubernetes/blob/v1.7.11/test/images/nvidia-cuda/Dockerfile
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1 # requesting 1 GPU
```

<!--
### Deploying AMD GPU device plugin

The [official AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
has the following requirements:
-->
### 部署 AMD GPU 裝置外掛   {#deploying-amd-gpu-device-plugin}

[官方的 AMD GPU 裝置外掛](https://github.com/RadeonOpenCompute/k8s-device-plugin) 有以下要求：

<!--
- Kubernetes nodes have to be pre-installed with AMD GPU Linux driver.

To deploy the AMD device plugin once your cluster is running and the above
requirements are satisfied:
```
# For Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.9/k8s-ds-amdgpu-dp.yaml

# For Kubernetes v1.10
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```
-->
- Kubernetes 節點必須預先安裝 AMD GPU 的 Linux 驅動。

如果你的叢集已經啟動並且滿足上述要求的話，可以這樣部署 AMD 裝置外掛：

```shell
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```

<!--
You can report issues with this third-party device plugin by logging an issue in
[RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin).
-->
你可以到 [RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
專案報告有關此裝置外掛的問題。

<!--
### Deploying NVIDIA GPU device plugin

There are currently two device plugin implementations for NVIDIA GPUs:
-->
### 部署 NVIDIA GPU 裝置外掛  {#deploying-nvidia-gpu-device-plugin}

對於 NVIDIA GPUs，目前存在兩種裝置外掛的實現：

<!--
#### Official NVIDIA GPU device plugin

The [official NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
has the following requirements:
-->
#### 官方的 NVIDIA GPU 裝置外掛

[官方的 NVIDIA GPU 裝置外掛](https://github.com/NVIDIA/k8s-device-plugin) 有以下要求:

<!--
- Kubernetes nodes have to be pre-installed with NVIDIA drivers.
- Kubernetes nodes have to be pre-installed with [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- nvidia-container-runtime must be configured as the [default runtime](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)
  for docker instead of runc.
- NVIDIA drivers ~= 361.93

To deploy the NVIDIA device plugin once your cluster is running and the above
requirements are satisfied:
-->
- Kubernetes 的節點必須預先安裝了 NVIDIA 驅動
- Kubernetes 的節點必須預先安裝 [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- Docker 的[預設執行時](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)必須設定為 nvidia-container-runtime，而不是 runc
- NVIDIA 驅動版本 ~= 384.81

如果你的叢集已經啟動並且滿足上述要求的話，可以這樣部署 NVIDIA 裝置外掛：

```shell
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml
```
請到 [NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin)專案報告有關此裝置外掛的問題。

<!--
#### NVIDIA GPU device plugin used by GCE

The [NVIDIA GPU device plugin used by GCE](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
doesn't require using nvidia-docker and should work with any container runtime
that is compatible with the Kubernetes Container Runtime Interface (CRI). It's tested
on [Container-Optimized OS](https://cloud.google.com/container-optimized-os/)
and has experimental code for Ubuntu from 1.9 onwards.
-->
#### GCE 中使用的 NVIDIA GPU 裝置外掛

[GCE 使用的 NVIDIA GPU 裝置外掛](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu) 並不要求使用 nvidia-docker，並且對於任何實現了 Kubernetes CRI 的容器執行時，都應該能夠使用。這一實現已經在 [Container-Optimized OS](https://cloud.google.com/container-optimized-os/) 上進行了測試，並且在 1.9 版本之後會有對於 Ubuntu 的實驗性程式碼。

你可以使用下面的命令來安裝 NVIDIA 驅動以及裝置外掛：

```
# 在 COntainer-Optimized OS 上安裝 NVIDIA 驅動:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/daemonset.yaml

# 在 Ubuntu 上安裝 NVIDIA 驅動 (實驗性質):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/nvidia-driver-installer/ubuntu/daemonset.yaml

# 安裝裝置外掛:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.12/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

<!--
Report issues with this device plugin and installation method to [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

Google publishes its own [instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus) for using NVIDIA GPUs on GKE .
-->
請到 [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators) 報告有關此裝置外掛以及安裝方法的問題。

關於如何在 GKE 上使用 NVIDIA GPUs，Google 也提供自己的[指令](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus)。

<!--
## Clusters containing different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:
-->
## 叢集記憶體在不同型別的 GPU

如果叢集內部的不同節點上有不同型別的 NVIDIA GPU，那麼你可以使用
[節點標籤和節點選擇器](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/)
來將 pod 排程到合適的節點上。

例如：

```shell
# 為你的節點加上它們所擁有的加速器型別的標籤
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

<!--
## Automatic node labelling {#node-labeller}
-->
## 自動節點標籤  {#node-labeller}

<!--
If you're using AMD GPU devices, you can deploy
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller).
Node Labeller is a {{< glossary_tooltip text="controller" term_id="controller" >}} that automatically
labels your nodes with GPU properties.

At the moment, that controller can add labels for:
-->
如果你在使用 AMD GPUs，你可以部署
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller)，
它是一個 {{< glossary_tooltip text="控制器" term_id="controller" >}}，
會自動給節點打上 GPU 屬性標籤。目前支援的屬性：

<!--
* Device ID (-device-id)
* VRAM Size (-vram)
* Number of SIMD (-simd-count)
* Number of Compute Unit (-cu-count)
* Firmware and Feature Versions (-firmware)
* GPU Family, in two letters acronym (-family)
  * SI - Southern Islands
  * CI - Sea Islands
  * KV - Kaveri
  * VI - Volcanic Islands
  * CZ - Carrizo
  * AI - Arctic Islands
  * RV - Raven
Example result:
--->
* 裝置 ID (-device-id)
* VRAM 大小 (-vram)
* SIMD 數量(-simd-count)
* 計算單位數量(-cu-count)
* 韌體和特性版本 (-firmware)
* GPU 系列，兩個字母的首字母縮寫(-family)
  * SI - Southern Islands
  * CI - Sea Islands
  * KV - Kaveri
  * VI - Volcanic Islands
  * CZ - Carrizo
  * AI - Arctic Islands
  * RV - Raven

示例:

```shell
kubectl describe node cluster-node-23
```

```
    Name:               cluster-node-23
    Roles:              <none>
    Labels:             beta.amd.com/gpu.cu-count.64=1
                        beta.amd.com/gpu.device-id.6860=1
                        beta.amd.com/gpu.family.AI=1
                        beta.amd.com/gpu.simd-count.256=1
                        beta.amd.com/gpu.vram.16G=1
                        beta.kubernetes.io/arch=amd64
                        beta.kubernetes.io/os=linux
                        kubernetes.io/hostname=cluster-node-23
    Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /var/run/dockershim.sock
                        node.alpha.kubernetes.io/ttl: 0
    ......
```

<!--
With the Node Labeller in use, you can specify the GPU type in the Pod spec:
-->
使用了 Node Labeller 的時候，你可以在 Pod 的規約中指定 GPU 的型別：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: cuda-vector-add
      # https://github.com/kubernetes/kubernetes/blob/v1.7.11/test/images/nvidia-cuda/Dockerfile
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100 # or nvidia-tesla-k80 etc.
```

<!--
This will ensure that the pod will be scheduled to a node that has the GPU type
you specified.
-->
這能夠保證 Pod 能夠被排程到你所指定型別的 GPU 的節點上去。

