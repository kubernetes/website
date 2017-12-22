---
approvers:
- vishh
title: Schedule GPUs
---

{% capture overview %}

{% include feature-state-alpha.md %}

Kubernetes includes **experimental** support for managing NVIDIA GPUs spread across nodes using the device plugins alpha feature.
This page describes NVIDIA's supported method on how users can consume GPUs as well as the current limitations.

Starting in version 1.8, Kubernetes provides a [device plugin framework](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
for vendors to advertise their resources to the kubelet without changing Kubernetes core code.

Instead of writing custom Kubernetes code, vendors can implement a device plugin that can be deployed manually or as a DaemonSet.
The targeted devices include GPUs, High-performance NICs, FPGAs, InfiniBand, and other similar computing resources that may require vendor specific initialization and setup.

{% endcapture %}

{% capture prerequisites %}

The list of prerequisites for using NVIDIA GPUs is described below:
1. Kubernetes version needs to be greater than version 1.8
2. Kubernetes nodes have to be pre-installed with NVIDIA drivers.
3. Kubernetes nodes have to be pre-installed with [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
4. The `DevicePlugins` feature gate enabled
5. docker configured as the [default runtime](https://github.com/NVIDIA/nvidia-docker/wiki/Advanced-topics#default-runtime).
6. NVIDIA drivers ~= 361.93

Finally, once your cluster is running you will have to deploy the NVIDIA device plugin:
```
$ # This command is for Kubernetes v1.8
$ kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.8/nvidia-device-plugin.yml

$ # This command is for Kubernetes v1.9
$ kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.9/nvidia-device-plugin.yml
```

Once you have accomplished all these steps, the nodes will automatically discover and expose
all NVIDIA GPUs as a schedulable resource as well as expose the GPUs correctly in your container.

Please note that GKE offers a different device plugin that auto installs the NVIDIA driver and does not
require nvidia-docker at: [https://github.com/GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).
It only works on COS and support is handled by the GKE GPU team.

{% endcapture %}

{% capture steps %}

## API

NVIDIA GPUs can be consumed via container level resource requirements using the resource name `nvidia.com/gpu`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  containers:
    - name: cuda-container
      image: nvidia/cuda:9.0
      resources:
        limits:
          nvidia.com/gpu: 2 # requesting 2 GPUs
    - name: digits-container
      image: nvidia/digits:6.0
      resources:
        limits:
          nvidia.com/gpu: 2 # requesting 2 GPUs
```

You can also use GPUs in `InitContainers` but this is not supported by the NVIDIA device plugin
as it's usage can lead to weird behavior in case of GPU errors or container crash as the state is not reset.

- GPUs are only supposed to be specified in the `limits` section, which means:
  * You can specify GPU `limits` without specifying `requests` because Kubernetes
    will use the limit as the request value by default.
  * You can specify GPU in both `limits` and `requests` but these two values must equal.
  * You cannot specify GPU `requests` without specifying `limits`.
- Containers (and pods) do not share GPUs.
- Each container can request one or more GPUs.
- It is not possible to request a portion of a GPU.
- Nodes are expected to be homogenous, i.e. run the same GPU hardware.

If your nodes are running different versions of GPUs, then use Node Labels and Node Selectors to schedule pods to appropriate GPUs.
Following is an illustration of this workflow:

As part of your Node bootstrapping, identify the GPU hardware type on your nodes and expose it as a node label.

```shell
NVIDIA_GPU_NAME=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader --id=0 | sed -e 's/ /-/g')
source /etc/default/kubelet
KUBELET_OPTS="$KUBELET_OPTS --node-labels='alpha.kubernetes.io/nvidia-gpu-name=$NVIDIA_GPU_NAME'"
echo "KUBELET_OPTS=$KUBELET_OPTS" > /etc/default/kubelet
```

Specify the GPU types a pod can use via [Node Affinity](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) rules.

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

This will ensure that the pod will be scheduled to a node that has a `Tesla K80` or a `Tesla P100` NVIDIA GPU.

## Future

- Support for hardware accelerators is in its early stages in Kubernetes but is expected to graduate to beta in 1.10.
- Better APIs will be introduced to provision and consume accelerators in a scalable manner.
- Kubernetes will automatically ensure that applications consuming GPUs get the best possible performance.

{% endcapture %}

{% include templates/task.md %}
