---
title: 容器運行時接口（CRI）
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
CRI 是一個插件接口，它使 kubelet 能夠使用各種容器運行時，無需重新編譯叢集組件。

你需要在叢集中的每個節點上都有一個可以正常工作的{{<glossary_tooltip text="容器運行時" term_id="container-runtime">}}，
這樣 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 能啓動
{{< glossary_tooltip text="Pod" term_id="pod" >}} 及其容器。

{{< glossary_definition prepend="容器運行時接口（CRI）是" term_id="cri" length="all" >}}

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
當通過 gRPC 連接到容器運行時，kubelet 將充當客戶端。運行時和映像檔服務端點必須在容器運行時中可用，
可以使用 `--container-runtime-endpoint`
[命令列標誌](/zh-cn/docs/reference/command-line-tools-reference/kubelet)在
kubelet 中單獨設定。

<!-- 
For Kubernetes v1.26 and later, the kubelet requires that the container runtime
supports the `v1` CRI API. If a container runtime does not support the `v1` API,
the kubelet will not register the node.
-->
對於 Kubernetes v1.26 及更高版本，
kubelet 要求容器運行時必須支持 `v1` 版本的 CRI API。
如果容器運行時不支持 `v1` API，kubelet 將不會註冊該節點。

<!-- 
## Upgrading

When upgrading the Kubernetes version on a node, the kubelet restarts. If the
container runtime does not support the `v1` CRI API, the kubelet will fail to
register and report an error. If a gRPC re-dial is required because the container
runtime has been upgraded, the runtime must support the `v1` CRI API for the
connection to succeed. This might require a restart of the kubelet after the
container runtime is correctly configured.
-->
## 升級  {#upgrading}

在節點上升級 Kubernetes 版本時，kubelet 會重新啓動。
如果容器運行時不支持 `v1` 版本的 CRI API，kubelet 將無法註冊節點並報告錯誤。
如果由於容器運行時已升級而需要重新建立 gRPC 連接，
則該容器運行時必須支持 v1 版本的 CRI API，連接才能成功。
在容器運行時正確設定後，可能需要重新啓動 kubelet 才能建立連接。

## {{% heading "whatsnext" %}}

<!-- 
- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
-->
- 瞭解更多有關 CRI [協議定義](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)
