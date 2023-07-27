---
reviewers:
- vishh
content_type: concept
title: Schedule GPUs
description: Configure and schedule GPUs for use as a resource by nodes in a cluster.
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

Kubernetes includes **stable** support for managing AMD and NVIDIA GPUs
(graphical processing units) across different nodes in your cluster, using
{{< glossary_tooltip text="device plugins" term_id="device-plugin" >}}.

This page describes how users can consume GPUs, and outlines
some of the limitations in the implementation.

<!-- body -->

## Using device plugins

Kubernetes implements device plugins to let Pods access specialized hardware features such as GPUs.

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

Similar functionality for NVIDIA is provided by
[GPU feature discovery](https://github.com/NVIDIA/gpu-feature-discovery/blob/main/README.md).
