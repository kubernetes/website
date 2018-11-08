---
approvers:
- vishh
title: 调度 GPU
content_template: templates/task
---

{{% capture overview %}}


Kubernetes 提供对分布在节点上的 AMD 和 NVIDIA GPU 进行管理的**实验**支持。对 NVIDIA GPU 的支持在 v1.6 中加入，已经经历了多次不向后兼容的迭代。而对 AMD GPU 的支持则在 v1.9 中通过 [device plugin](#deploying-amd-gpu-device-plugin) 加入。

这个页面介绍了用户如何在不同的 Kubernetes 版本中使用 GPU，以及当前存在的一些限制。

{{% /capture %}}

{{% capture body %}}

## 从 v1.8 起

**从 1.8 版本开始，我们推荐通过 [device plugins](/docs/concepts/cluster-administration/device-plugins) 的方式来使用 GPU。**

在 1.10 版本之前，为了通过 device plugins 开启 GPU 的支持，我们需要在系统中将 `DevicePlugins`
这一 feature gate 显式地设置为 true：`--feature-gates="DevicePlugins=true"`。不过，从 1.10 版本开始，我们就不需要这一步骤了。

接着你需要在主机节点上安装对应厂商的 GPU 驱动 并运行对应厂商的 device plugin [AMD](#deploying-amd-gpu-device-plugin), [NVIDIA](#deploying-nvidia-gpu-device-plugin)。

当上面的条件都满足，Kubernetes 将会暴露 `nvidia.com/gpu` 或
`amd.com/gpu` 来作为一种可调度的资源。

你也能通过像请求 `cpu` 或 `memory` 一样请求 `<vendor>.com/gpu` 来在容器中使用 GPU。然而，当你要通过指定资源请求来使用 GPU 时，存在着以下几点限制：

- GPU 仅仅支持在 `limits` 部分被指定，这表明：
  * 你可以仅仅指定 GPU 的 `limits` 字段而不必须指定 `requests` 字段，因为 Kubernetes 会默认使用 limit 字段的值来作为 request 字段的默认值。
  * 你能同时指定 GPU 的 `limits` 和 `requests` 字段，但这两个值必须相等。
  * 你不能仅仅指定 GPU 的 `request` 字段而不指定 `limits`。
- 容器（以及 pod）并不会共享 GPU，也不存在对 GPU 的过量使用。
- 每一个容器能够请求一个或多个 GPU。然而只请求一个 GPU 的一部分是不允许的。

下面是一个例子:

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
          nvidia.com/gpu: 1 # 请求一个 GPU
```

### 部署 AMD GPU device plugin

[官方的 AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin) 有以下要求：

- Kubernetes 节点必须预先安装 AMD GPU 的 Linux 驱动。

如果你的集群已经启动并且上述要求满足的话，可以这样部署 NVIDIA device plugin：
```
# 针对 Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.9/k8s-ds-amdgpu-dp.yaml

# 针对 Kubernetes v1.10
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```
请到 [RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin) 报告有关此 device plugin 的问题。

### 部署 NVIDIA GPU device plugin

对于 NVIDIA，目前存在两种 device plugin 的实现：

#### 官方的 NVIDIA GPU device plugin

[官方的 NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin) 有以下要求:

- Kubernetes 的节点必须预先安装了 NVIDIA 驱动
- Kubernetes 的节点必须预先安装 [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- Docker 的[默认运行时](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)必须设置为 nvidia-container-runtime，而不是 runc
- NVIDIA 驱动版本 ~= 361.93

要在你的集群已经启动的情况下部署 NVIDIA device plugin，可以运行下面的命令来实现:

```
# 针对 Kubernetes v1.8
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.8/nvidia-device-plugin.yml

# 针对 Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.9/nvidia-device-plugin.yml
```

请到 [NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin) 报告有关此 device plugin 的问题。

#### GKE/GCE 中使用的 NVIDIA GPU device plugin

[GKE/GCE 使用的 NVIDIA GPU device plugin](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
并不要求使用 nvidia-docker，并且对于任何实现了 Kubernetes CRI 的容器运行时，都应该能够使用。这一实现已经在 [Container-Optimized OS](https://cloud.google.com/container-optimized-os/) 上进行了测试，并且在 1.9 版本之后会有对于 Ubuntu 的实验性代码。

在你 1.9 版本的集群上，你能使用下面的命令来安装 NVIDIA 驱动以及 device plugin：

```
# 在 Container-Optimized OS 上安装 NVIDIA 驱动:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/daemonset.yaml

# 在 Ubuntu 上安装 NVIDIA 驱动 (实验性质):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/nvidia-driver-installer/ubuntu/daemonset.yaml

# 安装 device plugin:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.9/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

请到 [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators) 报告有关此 device plugin 以及安装方法的问题

## 集群内存在不同类型的 NVIDIA GPU

如果集群内部的不同节点上有不同类型的 NVIDIA GPU，那么你可以使用 [Node Label 和 Node Selecter](/docs/tasks/configure-pod-container/assign-pods-nodes/) 来将pod调度到合适的节点上。

举一个例子：

```shell
# 为你的节点加上它们所拥有的 accelerator 类型的标签.
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

在 pod 的 spec 字段中指定 GPU 的类型：

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
这能够保证 pod 能够被调度到拥有你所指定类型的 GPU 的节点上去。

