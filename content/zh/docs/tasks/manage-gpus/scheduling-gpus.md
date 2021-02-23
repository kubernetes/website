---
content_type: concept
title: 调度 GPUs
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

{{< feature-state state="beta" for_k8s_version="v1.10" >}}

<!--
Kubernetes includes **experimental** support for managing AMD and NVIDIA GPUs
(graphical processing units) across several nodes.

This page describes how users can consume GPUs across different Kubernetes versions
and the current limitations.
-->
Kubernetes 支持对节点上的 AMD 和 NVIDIA GPU （图形处理单元）进行管理，目前处于**实验**状态。

本页介绍用户如何在不同的 Kubernetes 版本中使用 GPU，以及当前存在的一些限制。

<!-- body -->

<!--
## Using device plugins

Kubernetes implements {{< glossary_tooltip text="Device Plugins" term_id="device-plugin" >}}
to let Pods access specialized hardware features such as GPUs.

As an administrator, you have to install GPU drivers from the corresponding
hardware vendor on the nodes and run the corresponding device plugin from the
GPU vendor:
-->
## 使用设备插件  {#using-device-plugins}

Kubernetes 实现了{{< glossary_tooltip text="设备插件（Device Plugins）" term_id="device-plugin" >}}
以允许 Pod 访问类似 GPU 这类特殊的硬件功能特性。

作为集群管理员，你要在节点上安装来自对应硬件厂商的 GPU 驱动程序，并运行
来自 GPU 厂商的对应的设备插件。

* [AMD](#deploying-amd-gpu-device-plugin)
* [NVIDIA](#deploying-nvidia-gpu-device-plugin)

<!--
When the above conditions are true, Kubernetes will expose `amd.com/gpu` or
`nvidia.com/gpu` as a schedulable resource.

You can consume these GPUs from your containers by requesting
`<vendor>.com/gpu` just like you request `cpu` or `memory`.
However, there are some limitations in how you specify the resource requirements
when using GPUs:
-->
当以上条件满足时，Kubernetes 将暴露 `amd.com/gpu` 或 `nvidia.com/gpu` 为
可调度的资源。

你可以通过请求 `<vendor>.com/gpu` 资源来使用 GPU 设备，就像你为 CPU
和内存所做的那样。
不过，使用 GPU 时，在如何指定资源需求这个方面还是有一些限制的：

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
- GPUs 只能设置在 `limits` 部分，这意味着：
  * 你可以指定 GPU 的 `limits` 而不指定其 `requests`，Kubernetes 将使用限制
    值作为默认的请求值；
  * 你可以同时指定 `limits` 和 `requests`，不过这两个值必须相等。
  * 你不可以仅指定 `requests` 而不指定 `limits`。
- 容器（以及 Pod）之间是不共享 GPU 的。GPU 也不可以过量分配（Overcommitting）。
- 每个容器可以请求一个或者多个 GPU，但是用小数值来请求部分 GPU 是不允许的。

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
### 部署 AMD GPU 设备插件   {#deploying-amd-gpu-device-plugin}

[官方的 AMD GPU 设备插件](https://github.com/RadeonOpenCompute/k8s-device-plugin) 有以下要求：

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
- Kubernetes 节点必须预先安装 AMD GPU 的 Linux 驱动。

如果你的集群已经启动并且满足上述要求的话，可以这样部署 AMD 设备插件：

```shell
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```

<!--
You can report issues with this third-party device plugin by logging an issue in
[RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin).
-->
你可以到 [RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
项目报告有关此设备插件的问题。

<!--
### Deploying NVIDIA GPU device plugin

There are currently two device plugin implementations for NVIDIA GPUs:
-->
### 部署 NVIDIA GPU 设备插件  {#deploying-nvidia-gpu-device-plugin}

对于 NVIDIA GPUs，目前存在两种设备插件的实现：

<!--
#### Official NVIDIA GPU device plugin

The [official NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
has the following requirements:
-->
#### 官方的 NVIDIA GPU 设备插件

[官方的 NVIDIA GPU 设备插件](https://github.com/NVIDIA/k8s-device-plugin) 有以下要求:

<!--
- Kubernetes nodes have to be pre-installed with NVIDIA drivers.
- Kubernetes nodes have to be pre-installed with [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- nvidia-container-runtime must be configured as the [default runtime](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)
  for docker instead of runc.
- NVIDIA drivers ~= 361.93

To deploy the NVIDIA device plugin once your cluster is running and the above
requirements are satisfied:
-->
- Kubernetes 的节点必须预先安装了 NVIDIA 驱动
- Kubernetes 的节点必须预先安装 [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- Docker 的[默认运行时](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)必须设置为 nvidia-container-runtime，而不是 runc
- NVIDIA 驱动版本 ~= 384.81

如果你的集群已经启动并且满足上述要求的话，可以这样部署 NVIDIA 设备插件：

```shell
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml
```
请到 [NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin)项目报告有关此设备插件的问题。

<!--
#### NVIDIA GPU device plugin used by GCE

The [NVIDIA GPU device plugin used by GCE](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
doesn't require using nvidia-docker and should work with any container runtime
that is compatible with the Kubernetes Container Runtime Interface (CRI). It's tested
on [Container-Optimized OS](https://cloud.google.com/container-optimized-os/)
and has experimental code for Ubuntu from 1.9 onwards.
-->
#### GCE 中使用的 NVIDIA GPU 设备插件

[GCE 使用的 NVIDIA GPU 设备插件](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu) 并不要求使用 nvidia-docker，并且对于任何实现了 Kubernetes CRI 的容器运行时，都应该能够使用。这一实现已经在 [Container-Optimized OS](https://cloud.google.com/container-optimized-os/) 上进行了测试，并且在 1.9 版本之后会有对于 Ubuntu 的实验性代码。

你可以使用下面的命令来安装 NVIDIA 驱动以及设备插件：

```
# 在 COntainer-Optimized OS 上安装 NVIDIA 驱动:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/daemonset.yaml

# 在 Ubuntu 上安装 NVIDIA 驱动 (实验性质):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/nvidia-driver-installer/ubuntu/daemonset.yaml

# 安装设备插件:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.12/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

<!--
Report issues with this device plugin and installation method to [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

Google publishes its own [instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus) for using NVIDIA GPUs on GKE .
-->
请到 [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators) 报告有关此设备插件以及安装方法的问题。

关于如何在 GKE 上使用 NVIDIA GPUs，Google 也提供自己的[指令](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus)。

<!--
## Clusters containing different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:
-->
## 集群内存在不同类型的 GPU

如果集群内部的不同节点上有不同类型的 NVIDIA GPU，那么你可以使用
[节点标签和节点选择器](/zh/docs/tasks/configure-pod-container/assign-pods-nodes/)
来将 pod 调度到合适的节点上。

例如：

```shell
# 为你的节点加上它们所拥有的加速器类型的标签
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

<!--
## Automatic node labelling {#node-labeller}
-->
## 自动节点标签  {#node-labeller}

<!--
If you're using AMD GPU devices, you can deploy
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller).
Node Labeller is a {{< glossary_tooltip text="controller" term_id="controller" >}} that automatically
labels your nodes with GPU properties.

At the moment, that controller can add labels for:
-->
如果你在使用 AMD GPUs，你可以部署
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller)，
它是一个 {{< glossary_tooltip text="控制器" term_id="controller" >}}，
会自动给节点打上 GPU 属性标签。目前支持的属性：

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
* 设备 ID (-device-id)
* VRAM 大小 (-vram)
* SIMD 数量(-simd-count)
* 计算单位数量(-cu-count)
* 固件和特性版本 (-firmware)
* GPU 系列，两个字母的首字母缩写(-family)
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
使用了 Node Labeller 的时候，你可以在 Pod 的规约中指定 GPU 的类型：

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
这能够保证 Pod 能够被调度到你所指定类型的 GPU 的节点上去。

