---
reviewers:
- vishh
content_type: concept
title: Schedule GPUs
description: Configure and schedule GPUs for use as a resource by nodes in a cluster.
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.10" >}}

Kubernetes includes **experimental** support for managing GPUs
(graphical processing units) across several nodes.

This page describes how users can consume GPUs, and outlines
some of the limitations in the implementation.

<!-- body -->

## Using device plugins

Kubernetes implements {{< glossary_tooltip text="device plugins" term_id="device-plugin" >}}
to let Pods access specialized hardware features such as GPUs.

{{% thirdparty-content %}}

As an administrator, you have to install GPU drivers from the corresponding
hardware vendor on the nodes and run the corresponding device plugin from the
GPU vendor. Here are some links to vendors' instructions:

* [AMD](https://github.com/RadeonOpenCompute/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)

Once you have installed the plugin, your cluster exposes a custom schedulable resource such as `amd.com/gpu` or `nvidia.com/gpu`.

You can consume these GPUs from your containers by requesting
the custom GPU resource, the same way you request `cpu` or `memory`.
However, there are some limitations in how you specify the resource
requirements for custom devices.

GPUs are only supposed to be specified in the `limits` section, which means:
* You can specify GPU `limits` without specifying `requests`, because
  Kubernetes will use the limit as the request value by default.
* You can specify GPU in both `limits` and `requests` but these two values
  must be equal.
* You cannot specify GPU `requests` without specifying `limits`.

Here's an example manifest for a Pod that requests a GPU:

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
          gpu-vendor.example/example-gpu: 1 # requesting 1 GPU
```

## Clusters containing different types of GPUs

If different nodes in your cluster have different types of GPUs, then you
can use [Node Labels and Node Selectors](/docs/tasks/configure-pod-container/assign-pods-nodes/)
to schedule pods to appropriate nodes.

For example:

```shell
# Label your nodes with the accelerator type they have.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

That label key `accelerator` is just an example; you can use
a different label key if you prefer.

## Automatic node labelling {#node-labeller}

If you're using AMD GPU devices, you can deploy
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller).
Node Labeller is a {{< glossary_tooltip text="controller" term_id="controller" >}} that automatically
labels your nodes with GPU device properties.

At the moment, that controller can add labels for:

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
                    kubernetes.io/arch=amd64
                    kubernetes.io/os=linux
                    kubernetes.io/hostname=cluster-node-23
Annotations:        node.alpha.kubernetes.io/ttl: 0
…
```

With the Node Labeller in use, you can specify the GPU type in the Pod spec:

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
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        – matchExpressions:
          – key: beta.amd.com/gpu.family.AI # Arctic Islands GPU family
            operator: Exist
```

This ensures that the Pod will be scheduled to a node that has the GPU type
you specified.
