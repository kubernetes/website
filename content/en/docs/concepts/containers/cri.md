---
title: Container Runtime Interface (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

The CRI is a plugin interface which enables the kubelet to use a wide variety of
container runtimes, without having a need to recompile the cluster components.

You need a working
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} on
each Node in your cluster, so that the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} can launch
{{< glossary_tooltip text="Pods" term_id="pod" >}} and their containers.

{{< glossary_definition prepend="The Container Runtime Interface (CRI) is" term_id="cri" length="all" >}}

<!-- body -->

## The API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

The kubelet acts as a client when connecting to the container runtime via gRPC.
The runtime and image service endpoints have to be available in the container
runtime, which can be configured separately within the kubelet by using the
`--container-runtime-endpoint`
[command line flag](/docs/reference/command-line-tools-reference/kubelet/).

For Kubernetes v1.26 and later, the kubelet requires that the container runtime
supports the `v1` CRI API. If a container runtime does not support the `v1` API,
the kubelet will not register the node.

## Upgrading

When upgrading the Kubernetes version on a node, the kubelet restarts. If the
container runtime does not support the `v1` CRI API, the kubelet will fail to
register and report an error. If a gRPC re-dial is required because the container
runtime has been upgraded, the runtime must support the `v1` CRI API for the
connection to succeed. This might require a restart of the kubelet after the
container runtime is correctly configured.

## {{% heading "whatsnext" %}}

- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
