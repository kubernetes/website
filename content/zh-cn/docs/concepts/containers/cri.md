---
title: 容器运行时接口（CRI）
content_type: concept
weight: 60
---
<!-- 
title: Container Runtime Interface (CRI)
content_type: concept
weight: 60
-->

<!-- overview -->
<!-- 
The CRI is a plugin interface which enables the kubelet to use a wide variety of
container runtimes, without having a need to recompile the cluster components.

You need a working
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} on
each Node in your cluster, so that the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} can launch
{{< glossary_tooltip text="Pods" term_id="pod" >}} and their containers.
-->
CRI 是一个插件接口，它使 kubelet 能够使用各种容器运行时，无需重新编译集群组件。

你需要在集群中的每个节点上都有一个可以正常工作的{{<glossary_tooltip text="容器运行时" term_id="container-runtime">}}，
这样 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 能启动
{{< glossary_tooltip text="Pod" term_id="pod" >}} 及其容器。

{{< glossary_definition prepend="容器运行时接口（CRI）是" term_id="cri" length="all" >}}

<!-- body -->

<!--
## The API {#api}
-->
## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
The kubelet acts as a client when connecting to the container runtime via gRPC.
The runtime and image service endpoints have to be available in the container
runtime, which can be configured separately within the kubelet by using the
`--container-runtime-endpoint`
[command line flag](/docs/reference/command-line-tools-reference/kubelet/).
-->
当通过 gRPC 连接到容器运行时，kubelet 将充当客户端。运行时和镜像服务端点必须在容器运行时中可用，
可以使用 `--container-runtime-endpoint`
[命令行标志](/zh-cn/docs/reference/command-line-tools-reference/kubelet)在
kubelet 中单独配置。

<!-- 
For Kubernetes v1.26 and later, the kubelet requires that the container runtime
supports the `v1` CRI API. If a container runtime does not support the `v1` API,
the kubelet will not register the node.
-->
对于 Kubernetes v1.26 及更高版本，
kubelet 要求容器运行时必须支持 `v1` 版本的 CRI API。
如果容器运行时不支持 `v1` API，kubelet 将不会注册该节点。

<!-- 
## Upgrading

When upgrading the Kubernetes version on a node, the kubelet restarts. If the
container runtime does not support the `v1` CRI API, the kubelet will fail to
register and report an error. If a gRPC re-dial is required because the container
runtime has been upgraded, the runtime must support the `v1` CRI API for the
connection to succeed. This might require a restart of the kubelet after the
container runtime is correctly configured.
-->
## 升级  {#upgrading}

在节点上升级 Kubernetes 版本时，kubelet 会重新启动。
如果容器运行时不支持 `v1` 版本的 CRI API，kubelet 将无法注册节点并报告错误。
如果由于容器运行时已升级而需要重新建立 gRPC 连接，
则该容器运行时必须支持 v1 版本的 CRI API，连接才能成功。
在容器运行时正确配置后，可能需要重新启动 kubelet 才能建立连接。

<!--
## List streaming {#list-streaming}
-->
## List 流  {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

<!--
The standard CRI list RPCs (`ListContainers`, `ListPodSandbox`, `ListImages`) return
all results in a single unary response. On nodes with a large number of containers
(for example, more than roughly 10,000 including both running and stopped), these
responses can exceed gRPC's default 16 MiB message size limit, causing the kubelet
to fail when reconciling state with the container runtime.
-->
标准的 CRI list RPC（`ListContainers`、`ListPodSandbox`、`ListImages`）
会将所有结果返回在一个单一的单元响应中。
在容器数量庞大的节点上（例如，包括运行中的和已停止的容器在内，总数超过约 10,000 个），
这些响应可能会超过 gRPC 默认的 16 MiB 消息大小限制，导致 kubelet 在与容器运行时同步状态时失败。

<!--
With the `CRIListStreaming` feature gate enabled, the kubelet uses server-side
streaming RPCs (such as `StreamContainers`, `StreamPodSandboxes`,
`StreamImages`) that allow the container runtime to divide results across
multiple response messages, bypassing the per-message size limit. This is
particularly useful for:

- High container churn environments (CI/CD systems)
- Large-scale batch processing workloads
-->
启用 `CRIListStreaming` 特性后，kubelet 使用服务器端流式
RPC（例如 `StreamContainers`、`StreamPodSandboxes`、`StreamImages`），
允许容器运行时将结果拆分到多个响应消息中，从而绕过单个消息的大小限制。
这对于以下情况尤其有用：

- 容器频繁变更的环境（CI/CD 系统）
- 大规模批处理工作负载

<!--
If the container runtime does not support streaming RPCs, the kubelet
automatically falls back to the standard unary RPCs for backward
compatibility.
-->
如果容器运行时不支持流式 RPC，kubelet 会自动回退到标准一元 RPC 以实现向后兼容。

## {{% heading "whatsnext" %}}

<!-- 
- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
-->
- 了解更多有关 CRI [协议定义](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
