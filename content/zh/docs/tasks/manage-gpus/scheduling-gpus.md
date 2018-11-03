---
approvers:
- vishh
title: 调度 GPU
content_template: templates/task
---

{{% capture overview %}}


Kubernetes 提供对分布在节点上的 AMD 和 NVIDIA GPU 进行管理的**实验**支持。在Kubernetes的v1.6版本中，加入了对NVIDIA GPU的支持，并且经历了多次向后的不兼容迭代。 而在v1.9版本中， 对AMD GPU的支持则通过 [device plugin](#deploying-amd-gpu-device-plugin) 的方式加入。

这个页面介绍了用户如何在不同的Kubernetes版本中使用 GPU， 以及当前存在的一些限制。

{{% /capture %}}

{{% capture body %}}

## v1.8 往后

**从1.8版本往后， 我们推荐通过 [device plugins](/docs/concepts/cluster-administration/device-plugins)的方式来使用GPU.**

在1.10版本之前，为了通过device plugins开启GPU的支持， 我们需要在系统中将 `DevicePlugins`
这一feature gate显式的设置为true : `--feature-gates="DevicePlugins=true"`. 不过， 从1.10版本开始， 我们就不需要这一步骤了。

接着你需要在主机节点上安装对应厂商的GPU驱动 并运行对应厂商的device plugin
([AMD](#deploying-amd-gpu-device-plugin), [NVIDIA](#deploying-nvidia-gpu-device-plugin)).

当上面的条件都满足， Kubernetes将会暴露 `nvidia.com/gpu` 或
`amd.com/gpu` 来作为一种可调度的资源。

你也能通过像请求`cpu` 或 `memory` 一样请求`<vendor>.com/gpu`来在容器中使用GPU。
然后，当你要通过指定资源请求来使用GPU时， 存在着以下几点限制:

- GPU仅仅支持在`limits`部分被指定， 这表明:
  * 你可以仅仅指定GPU的`limits`字段而不必须指定`requests`字段， 因为Kubernetes会默认使用limit字段的值来作为request字段的默认值。
  * 你能同时指定GPU的`limits`和`requests`字段， 但这两个值必须相等。
  * 你不能仅仅指定GPU的`request`字段而不指定`limits`。
- 容器（以及pods）并不会共享GPU， 也不存在对GPU的过量使用。
- 每一个容器能够请求一个或多个GPU。然而只请求一个GPU的一部分是不允许的。

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
          nvidia.com/gpu: 1 # 请求一个GPU
```

### 部署 AMD GPU device plugin

[官方的 AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
有以下要求:

- Kubernetes 节点必须预先安装linux上的AMD GPU 驱动 .

要在你的集群已经启动的情况下部署AMD device plugin， 可以运行下面的命令来实现:
```
# 对于 Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.9/k8s-ds-amdgpu-dp.yaml

# 对于 Kubernetes v1.10
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```
在这一页面来提交相关device plugin的issues [RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin).

### 部署NVIDIA GPU device plugin

对于NVIDIA， 目前存在两种device plugin的实现:

#### 官方的 NVIDIA GPU device plugin

[官方的 NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
有以下要求:

- Kubernetes 的节点必须预先安装了NVIDIA驱动.
- Kubernetes 的节点必须预先安装 [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- 对于docker而不是runc，nvidia-runtime必须被设置为 [default-container-runtime](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)
- NVIDIA 驱动版本 ~= 361.93

要在你的集群已经启动的情况下部署NVIDIA device plugin， 可以运行下面的命令来实现:

```
# For Kubernetes v1.8
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.8/nvidia-device-plugin.yml

# For Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.9/nvidia-device-plugin.yml
```

在这一页面来提交相关device plugin的issues [NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin).

#### GKE/GCE中使用的NVIDIA GPU device plugin

[GKE/GCE使用的NVIDIA GPU device plugin](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
并不要求使用 nvidia-docker， 并且对于任何实现了kubernetes 容器运行时接口(CRI)的容器运行时， 都应该能够使用。 这一实现已经在[Container-Optimized OS](https://cloud.google.com/container-optimized-os/)上进行了测试， 并且在1.9版本之后会有对于Ubuntu的实验性代码。

在你1.9版本的集群上， 你能使用下面的命令来安装NVIDIA驱动以及device plugin:

```
# 在Container-Optimized OS上安装NVIDIA驱动:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/daemonset.yaml

# 在Ubuntu上安装NVIDIA驱动 (实验性质):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/nvidia-driver-installer/ubuntu/daemonset.yaml

# 安装 device plugin:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.9/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

在这一页面来提交相关device plugin的issues 以及相应的安装方法 [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

## 集群内存在不同类型的NVIDIA GPU

如果集群内部的不同节点上有不同类型的NVIDIA GPU， 那么你可以使用[Node Label 和 NodeSelecter](/docs/tasks/configure-pod-container/assign-pods-nodes/)来将pod调度到合适的节点上.

举一个例子:

```shell
# 为你的节点加上它们所拥有的accelerator类型的标签.
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

在pod的spec字段中指定GPU的类型:

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

这能够保证pod能够被调度到拥有你所指定类型的GPU的节点上去。
