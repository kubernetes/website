---
approvers:
- vishh
title: 调度 GPU
---

{% capture overview %}


Kubernetes 提供对分布在节点上的 NVIDIA GPU 进行管理的**实验**支持。本页描述用户如何使用 GPU 以及当前使用的一些限制

{% endcapture %}

{% capture prerequisites %}


1. Kubernetes 节点必须预先安装好 NVIDIA 驱动，否则，Kubelet 将检测不到可用的GPU信息；如果节点的 Capacity 属性中没有出现 NIVIDA GPU 的数量，有可能是驱动没有安装或者安装失败，请尝试重新安装

2. 在整个 Kubernetes 系统中，feature-gates 里面特定的 **alpha** 特性参数 `Accelerators` 必须设置为 true：`--feature-gates="Accelerators=true"`

3. Kuberntes 节点必须使用 `docker` 引擎作为容器的运行引擎


上述预备工作完成后，节点会自动发现它上面的 NVIDIA GPU，并将其作为可调度资源暴露

{% endcapture %}

{% capture steps %}

## API


容器可以通过名称为 `alpha.kubernetes.io/nvidia-gpu` 的标识来申请需要使用的 NVIDIA GPU 的数量

```yaml
apiVersion: v1
kind: Pod 
metadata:
  name: gpu-pod
spec: 
  containers: 
    - 
      name: gpu-container-1
      image: k8s.gcr.io/pause:2.0
      resources: 
        limits: 
          alpha.kubernetes.io/nvidia-gpu: 2 # requesting 2 GPUs
    -
      name: gpu-container-2
      image: k8s.gcr.io/pause:2.0
      resources: 
        limits: 
          alpha.kubernetes.io/nvidia-gpu: 3 # requesting 3 GPUs
```


- GPU 只能在容器资源的 `limits` 中配置

- 容器和 Pod 都不支持共享 GPU

- 每个容器可以申请使用一个或者多个 GPU

- GPU 必须以整数为单位被申请使用

- 所有节点的 GPU 硬件要求相同


如果在不同的节点上面安装了不同版本的 GPU，可以通过设置节点标签以及使用节点选择器的方式将 pod 调度到期望运行的节点上。工作流程如下：


在节点上，识别出 GPU 硬件类型，然后将其作为节点标签进行暴露

```shell
NVIDIA_GPU_NAME=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader --id=0)
source /etc/default/kubelet
KUBELET_OPTS="$KUBELET_OPTS --node-labels='alpha.kubernetes.io/nvidia-gpu-name=$NVIDIA_GPU_NAME'"
echo "KUBELET_OPTS=$KUBELET_OPTS" > /etc/default/kubelet
```


在 pod 上，通过节点[亲和性](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)规则为它指定可以使用的 GPU 类型

```yaml
kind: pod
apiVersion: v1
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/affinity: >
      {
        "nodeAffinity": {
          "requiredDuringSchedulingIgnoredDuringExecution": {
            "nodeSelectorTerms": [
              {
                "matchExpressions": [
                  {
                    "key": "alpha.kubernetes.io/nvidia-gpu-name",
                    "operator": "In",
                    "values": ["Tesla K80", "Tesla P100"]
                  }
                ]
              }
            ]
          }
        }
      }
spec:
  containers:
    -
      name: gpu-container-1
      resources:
        limits:
          alpha.kubernetes.io/nvidia-gpu: 2
```


上述设定可以确保 pod 会被调度到包含名称为 `alpha.kubernetes.io/nvidia-gpu-name` 的标签并且标签的值为 `Tesla K80` 或者 `Tesla P100` 的节点上


### 警告


当未来的 Kubernetes 版本能够更好的支持GPU以及一般的硬件加速器时，这里的 API 描述**将会随之做出变更**


## 访问 CUDA 库


到目前为止，还需要预先在节点上安装 CUDA 库


为了避免后面使用库出现问题，可以将库放到 ``/var/lib/`` 下的某个文件夹下，或者直接改变库目录的权限(以后的版本会自动完成这一过程)


Pods能够通过 `hostPath` 卷来访问库

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: gpu-pod
spec:
  containers:
  - name: gpu-container-1
    image: k8s.gcr.io/pause:2.0
    resources:
      limits:
        alpha.kubernetes.io/nvidia-gpu: 1
    volumeMounts:
    - mountPath: /usr/local/nvidia/bin
      name: bin
    - mountPath: /usr/lib/nvidia
      name: lib
  volumes:
  - hostPath:
      path: /usr/lib/nvidia-375/bin
    name: bin
  - hostPath:
      path: /usr/lib/nvidia-375
    name: lib
```


## 未来


- Kubernetes 对硬件加速器的支持还处在早期阶段

- GPU 和其它的加速器很快会成为系统的本地计算资源

- 将引入更好的 API 以可扩展的方式提供和使用加速器

- Kubernets 将会自动确保应用在使用 GPU 时得到最佳性能

- 类似访问 CUDA 库这种关键的可用性问题将得到解决

{% endcapture %}

{% include templates/task.md %}
