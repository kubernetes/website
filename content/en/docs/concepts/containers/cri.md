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

## List streaming {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

The standard CRI list RPCs (`ListContainers`, `ListPodSandbox`, `ListImages`) return
all results in a single unary response. On nodes with a large number of containers
(for example, more than roughly 10,000 including both running and stopped), these
responses can exceed gRPC's default 16 MiB message size limit, causing the kubelet
to fail when reconciling state with the container runtime.

With the `CRIListStreaming` feature gate enabled, the kubelet uses server-side
streaming RPCs (such as `StreamContainers`, `StreamPodSandboxes`,
`StreamImages`) that allow the container runtime to divide results across
multiple response messages, bypassing the per-message size limit. This is
particularly useful for:

- High container churn environments (CI/CD systems)
- Large-scale batch processing workloads

If the container runtime does not support streaming RPCs, the kubelet
automatically falls back to the standard unary RPCs for backward
compatibility.

## Pod-level checkpoint and restore APIs

The CRI v1 `RuntimeService` API defines `CheckpointPod` and `RestorePod` RPCs
for Pod-level checkpoint and restore.

`CheckpointPod` asks the container runtime to create a checkpoint for a Pod
sandbox and the containers specified by the CRI client. The runtime writes the
checkpoint files to the supplied output directory. `RestorePod` restores a Pod
sandbox and its containers from checkpoint data at the checkpoint path
supplied by the CRI client. The runtime does not resume the checkpointed
workload as part of this RPC. On success, the restored containers remain in
the `CREATED` state. After any pre-start hooks, the CRI client calls
`StartContainer` for each returned container ID to resume execution from the
checkpoint. Both operations accept runtime-specific options.

The checkpoint data format is runtime-specific. The container runtime defines
the format and layout of the files in the specified directory.
Kubernetes does not interpret the checkpoint data.

The Kubernetes API and kubelet support for Pod checkpoint and restore
is planned for a future release.

For protocol details, see the CRI
[RuntimeService definition](https://github.com/kubernetes/cri-api/blob/47789ac/pkg/apis/runtime/v1/api.proto).

## {{% heading "whatsnext" %}}

- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
