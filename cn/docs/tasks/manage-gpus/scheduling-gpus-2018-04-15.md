---
reviewers:
- vishh
title: Schedule GPUs
---

Kubernetes includes **experimental** support for managing NVIDIA GPUs spread
across nodes. The support for NVIDIA GPUs was added in v1.6 and has gone through
multiple backwards incompatible iterations. This page describes how users can
consume GPUs across different Kubernetes versions and the current limitations.

## v1.8 onwards

**From 1.8 onwards, the recommended way to consume GPUs is to use [device
plugins](/docs/concepts/cluster-administration/device-plugins).**

To enable GPU support through device plugins before 1.10, the `DevicePlugins`
feature gate has to be explicitly set to true across the system:
`--feature-gates="DevicePlugins=true"`. This is no longer required starting
from 1.10.

Then you have to install NVIDIA drivers on the nodes and run an NVIDIA GPU device
plugin ([see below](#deploying-nvidia-gpu-device-plugin)).

When the above conditions are true, Kubernetes will expose `nvidia.com/gpu` as
a schedulable resource.

You can consume these GPUs from your containers by requesting
`nvidia.com/gpu` just like you request `cpu` or `memory`.
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

#### NVIDIA GPU device plugin used by GKE/GCE

The [NVIDIA GPU device plugin used by GKE/GCE](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
doesn't require using nvidia-docker and should work with any container runtime
that is compatible with the Kubernetes Container Runtime Interface (CRI). It's tested
on [Container-Optimized OS](https://cloud.google.com/container-optimized-os/)
and has experimental code for Ubuntu from 1.9 onwards.

On your 1.9 cluster, you can use the following commands to install the NVIDIA drivers and device plugin:

```
# Install NVIDIA drivers on Container-Optimized OS:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/daemonset.yaml

# Install NVIDIA drivers on Ubuntu (experimental):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/nvidia-driver-installer/ubuntu/daemonset.yaml

# Install the device plugin:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.9/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

Report issues with this device plugin and installation method to [GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

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

## v1.6 and v1.7
To enable GPU support in 1.6 and 1.7, a special **alpha** feature gate
`Accelerators` has to be set to true across the system:
`--feature-gates="Accelerators=true"`. It also requires using the Docker
Engine as the container runtime.

Further, the Kubernetes nodes have to be pre-installed with NVIDIA drivers.
Kubelet will not detect NVIDIA GPUs otherwise.

When you start Kubernetes components after all the above conditions are true,
Kubernetes will expose `alpha.kubernetes.io/nvidia-gpu` as a schedulable
resource.

You can consume these GPUs from your containers by requesting
`alpha.kubernetes.io/nvidia-gpu` just like you request `cpu` or `memory`.
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

When using `alpha.kubernetes.io/nvidia-gpu` as the resource, you also have to
mount host directories containing NVIDIA libraries (libcuda.so, libnvidia.so
etc.) to the container.

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
          alpha.kubernetes.io/nvidia-gpu: 1 # requesting 1 GPU
      volumeMounts:
        - name: "nvidia-libraries"
          mountPath: "/usr/local/nvidia/lib64"
  volumes:
    - name: "nvidia-libraries"
      hostPath:
        path: "/usr/lib/nvidia-375"
```

The `Accelerators` feature gate and `alpha.kubernetes.io/nvidia-gpu` resource
works on 1.8 and 1.9 as well. It will be deprecated in 1.10 and removed in
1.11.

## Future
- Support for hardware accelerators in Kubernetes is still in alpha.
- Better APIs will be introduced to provision and consume accelerators in a scalable manner.
- Kubernetes will automatically ensure that applications consuming GPUs get the best possible performance.
