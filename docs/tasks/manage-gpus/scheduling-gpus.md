---
approvers:
- vishh
title: Schedule GPUs
---

{% capture overview %}

Kubernetes includes **experimental** support for managing NVIDIA GPUs spread across nodes.
This page describes how users can consume GPUs and the current limitations.

{% endcapture %}

{% capture prerequisites %}

1. Kubernetes nodes have to be pre-installed with Nvidia drivers. Kubelet will not detect Nvidia GPUs otherwise. Try to re-install nvidia drivers if kubelet fails to expose Nvidia GPUs as part of Node Capacity.
2. A special **alpha** feature gate `Accelerators` has to be set to true across the system: `--feature-gates="Accelerators=true"`.
3. Nodes must be using `docker engine` as the container runtime.

The nodes will automatically discover and expose all Nvidia GPUs as a schedulable resource.

{% endcapture %}

{% capture steps %}

## API

Nvidia GPUs can be consumed via container level resource requirements using the resource name `alpha.kubernetes.io/nvidia-gpu`.

```yaml
apiVersion: v1
kind: Pod 
metadata:
  name: gpu-pod
spec: 
  containers: 
    - 
      name: gpu-container-1
      image: gcr.io/google_containers/pause:2.0
      resources: 
        limits: 
          alpha.kubernetes.io/nvidia-gpu: 2 # requesting 2 GPUs
    -
      name: gpu-container-2
      image: gcr.io/google_containers/pause:2.0
      resources: 
        limits: 
          alpha.kubernetes.io/nvidia-gpu: 3 # requesting 3 GPUs
```

- GPUs can be specified in the `limits` section only.
- Containers (and pods) do not share GPUs.
- Each container can request one or more GPUs.
- It is not possible to request a portion of a GPU.
- Nodes are expected to be homogenous, i.e. run the same GPU hardware.

If your nodes are running different versions of GPUs, then use Node Labels and Node Selectors to schedule pods to appropriate GPUs.
Following is an illustration of this workflow:

As part of your Node bootstrapping, identify the GPU hardware type on your nodes and expose it as a node label.

```shell
NVIDIA_GPU_NAME=$(nvidia-smi --query-gpu=gpu_name --format=csv,noheader --id=0)
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

This will ensure that the pod will be scheduled to a node that has a `Tesla K80` or a `Tesla P100` Nvidia GPU.

### Warning

The API presented here **will change** in an upcoming release to better support GPUs, and hardware accelerators in general, in Kubernetes.

## Access to CUDA libraries

As of now, CUDA libraries are expected to be pre-installed on the nodes.

To mitigate this, you can copy the libraries to a more permissive folder in ``/var/lib/`` or change the permissions directly. (Future releases will automatically perform this operation)

Pods can access the libraries using `hostPath` volumes.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: gpu-pod
spec:
  containers:
  - name: gpu-container-1
    image: gcr.io/google_containers/pause:2.0
    securityContext:
      privileged: true
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

## Future

- Support for hardware accelerators is in its early stages in Kubernetes.
- GPUs and other accelerators will soon be a native compute resource across the system.
- Better APIs will be introduced to provision and consume accelerators in a scalable manner.
- Kubernetes will automatically ensure that applications consuming GPUs gets the best possible performance.
- Key usability problems like access to CUDA libraries will be addressed.

{% endcapture %}

{% include templates/task.md %}
