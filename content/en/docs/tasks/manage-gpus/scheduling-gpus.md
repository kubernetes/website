---
reviewers:
- vishh
content_template: templates/concept
title: Schedule GPUs
---

{{% capture overview %}}

Kubernetes includes **experimental** support for managing AMD and NVIDIA GPUs spread
across nodes. The support for NVIDIA GPUs was added in v1.6 and has gone through
multiple backwards incompatible iterations.  The support for AMD GPUs was added in
v1.9 via [device plugin](#deploying-amd-gpu-device-plugin).

This page describes how users can consume GPUs across different Kubernetes versions
and the current limitations.

{{% /capture %}}


{{% capture body %}}

## v1.8 onwards

**From 1.8 onwards, the recommended way to consume GPUs is to use [device
plugins](/docs/concepts/cluster-administration/device-plugins).**

To enable GPU support through device plugins before 1.10, the `DevicePlugins`
feature gate has to be explicitly set to true across the system:
`--feature-gates="DevicePlugins=true"`. This is no longer required starting
from 1.10.

Then you have to install GPU drivers from the corresponding vendor on the nodes
and run the corresponding device plugin from the GPU vendor
([AMD](#deploying-amd-gpu-device-plugin), [NVIDIA](#deploying-nvidia-gpu-device-plugin)).

When the above conditions are true, Kubernetes will expose `nvidia.com/gpu` or
`amd.com/gpu` as a schedulable resource.

You can consume these GPUs from your containers by requesting
`<vendor>.com/gpu` just like you request `cpu` or `memory`.
However, there are some limitations in how you specify the resource requirements
when using GPUs:

- GPUs are only supposed to be specified in the `limits` section, which means:
  * You can specify GPU `limits` without specifying `requests` because
    Kubernetes will use the limit as the request value by default.
  * You can specify GPU in both `limits` and `requests` but these two values
    must be equal.
  * You cannot specify GPU `requests` without specifying `limits`.
- Containers (and pods) do not share GPUs. There's no overcommitting of GPUs.
- Each container can request one or more GPUs. It is not possible to request a
  fraction of a GPU.

Here's an example:

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

### Deploying AMD GPU device plugin

The [official AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
has the following requirements:

- Kubernetes nodes have to be pre-installed with AMD GPU Linux driver.

To deploy the AMD device plugin once your cluster is running and the above
requirements are satisfied:
```
# For Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.9/k8s-ds-amdgpu-dp.yaml

# For Kubernetes v1.10
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/r1.10/k8s-ds-amdgpu-dp.yaml
```
Report issues with this device plugin to [RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin).

### Deploying NVIDIA GPU device plugin

There are currently two device plugin implementations for NVIDIA GPUs:

#### Official NVIDIA GPU device plugin

The [official NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
has the following requirements:

- Kubernetes nodes have to be pre-installed with NVIDIA drivers.
- Kubernetes nodes have to be pre-installed with [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- nvidia-container-runtime must be configured as the [default runtime](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)
  for docker instead of runc.
- NVIDIA drivers ~= 361.93

To deploy the NVIDIA device plugin once your cluster is running and the above
requirements are satisfied:

```
# For Kubernetes v1.8
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.8/nvidia-device-plugin.yml

# For Kubernetes v1.9
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v1.9/nvidia-device-plugin.yml
```

Report issues with this device plugin to [NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin).

#### NVIDIA GPU device plugin used by GCE

The [NVIDIA GPU device plugin used by GCE](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
doesn't require using nvidia-docker and should work with any container runtime
that is compatible with the Kubernetes Container Runtime Interface (CRI). It's tested
on [Container-Optimized OS](https://cloud.google.com/container-optimized-os/)
and has experimental code for Ubuntu from 1.9 onwards.

On your 1.12 cluster, you can use the following commands to install the NVIDIA drivers and device plugin:

```
# Install NVIDIA drivers on Container-Optimized OS:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/daemonset.yaml

# Install NVIDIA drivers on Ubuntu (experimental):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/nvidia-driver-installer/ubuntu/daemonset.yaml

# Install the device plugin:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.12/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

Report issues with this device plugin and installation method to [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

Instructions for using NVIDIA GPUs on GKE are
[here](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus)

## Clusters containing different types of NVIDIA GPUs

If different nodes in your cluster have different types of NVIDIA GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:

```shell
# Label your nodes with the accelerator type they have.
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

Specify the GPU type in the pod spec:

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

This will ensure that the pod will be scheduled to a node that has the GPU type
you specified.
