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

{{< glossary_definition prepend="The Container Runtime Interface (CRI) is" term_id="container-runtime-interface" length="all" >}}

<!-- body -->

## The API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

The kubelet acts as a client when connecting to the container runtime via gRPC.
The runtime and image service endpoints have to be available in the container
runtime, which can be configured separately within the kubelet by using the
`--image-service-endpoint` [command line flags](/docs/reference/command-line-tools-reference/kubelet).

For Kubernetes v{{< skew currentVersion >}}, the kubelet prefers to use CRI `v1`.
If a container runtime does not support `v1` of the CRI, then the kubelet tries to
negotiate any older supported version.
The v{{< skew currentVersion >}} kubelet can also negotiate CRI `v1alpha2`, but
this version is considered as deprecated.
If the kubelet cannot negotiate a supported CRI version, the kubelet gives up
and doesn't register as a node.

## Upgrading

When upgrading Kubernetes, the kubelet tries to automatically select the
latest CRI version on restart of the component. If that fails, then the fallback
will take place as mentioned above. If a gRPC re-dial was required because the
container runtime has been upgraded, then the container runtime must also
support the initially selected version or the redial is expected to fail. This
requires a restart of the kubelet.

## {{% heading "whatsnext" %}}

- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
