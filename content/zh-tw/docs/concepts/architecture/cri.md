---
title: 容器執行時介面（CRI）
content_type: concept
weight: 50
---

<!-- 
title: Container Runtime Interface (CRI)
content_type: concept
weight: 50
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
CRI 是一個外掛介面，它使 kubelet 能夠使用各種容器執行時，無需重新編譯叢集元件。

你需要在叢集中的每個節點上都有一個可以正常工作的
{{<glossary_tooltip text="容器執行時" term_id="container-runtime">}}，
這樣
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 能啟動
{{< glossary_tooltip text="Pod" term_id="pod" >}} 及其容器。

{{< glossary_definition prepend="容器執行時介面（CRI）是" term_id="container-runtime-interface" length="all" >}}

<!-- body -->
<!-- ## The API {#api} -->
## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
The kubelet acts as a client when connecting to the container runtime via gRPC.
The runtime and image service endpoints have to be available in the container
runtime, which can be configured separately within the kubelet by using the
`--image-service-endpoint` and `--container-runtime-endpoint` [command line
flags](/docs/reference/command-line-tools-reference/kubelet)
-->
當透過 gRPC 連線到容器執行時時，kubelet 充當客戶端。
執行時和映象服務端點必須在容器執行時中可用，可以使用
[命令列標誌](/zh-cn/docs/reference/command-line-tools-reference/kubelet)的
`--image-service-endpoint` 和 `--container-runtime-endpoint`
在 kubelet 中單獨配置。

<!-- 
For Kubernetes v{{< skew currentVersion >}}, the kubelet prefers to use CRI `v1`.
If a container runtime does not support `v1` of the CRI, then the kubelet tries to
negotiate any older supported version.
The v{{< skew currentVersion >}} kubelet can also negotiate CRI `v1alpha2`, but
this version is considered as deprecated.
If the kubelet cannot negotiate a supported CRI version, the kubelet gives up
and doesn't register as a node.
-->
對 Kubernetes v{{< skew currentVersion >}}，kubelet 偏向於使用 CRI `v1` 版本。
如果容器執行時不支援 CRI 的 `v1` 版本，那麼 kubelet 會嘗試協商任何舊的其他支援版本。
如果 kubelet 無法協商支援的 CRI 版本，則 kubelet 放棄並且不會註冊為節點。

<!-- 
## Upgrading

When upgrading Kubernetes, then the kubelet tries to automatically select the
latest CRI version on restart of the component. If that fails, then the fallback
will take place as mentioned above. If a gRPC re-dial was required because the
container runtime has been upgraded, then the container runtime must also
support the initially selected version or the redial is expected to fail. This
requires a restart of the kubelet.
-->
## 升級  {#upgrading}

升級 Kubernetes 時，kubelet 會嘗試在元件重啟時自動選擇最新的 CRI 版本。
如果失敗，則將如上所述進行回退。如果由於容器執行時已升級而需要 gRPC 重撥，
則容器執行時還必須支援最初選擇的版本，否則重撥預計會失敗。
這需要重新啟動 kubelet。

## {{% heading "whatsnext" %}}

<!-- 
- Learn more about the CRI [protocol definition](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
-->
- 瞭解更多有關 CRI [協議定義](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
