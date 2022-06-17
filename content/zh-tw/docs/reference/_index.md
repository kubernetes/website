---
title: 參考
linkTitle: "參考"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!--
title: Reference
approvers:
- chenopis
linkTitle: "Reference"
main_menu: true
weight: 70
content_type: concept
no_list: true
-->

<!-- overview -->

<!--
This section of the Kubernetes documentation contains references.
-->
這是 Kubernetes 文件的參考部分。

<!-- body -->

<!--
## API Reference

* [Glossary](/docs/reference/glossary/) -  a comprehensive, standardized list of Kubernetes terminology

* [Kubernetes API Reference](/docs/reference/kubernetes-api/)
* [One-page API Reference for Kubernetes {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [Using The Kubernetes API](/docs/reference/using-api/) - overview of the API for Kubernetes.
* [API access control](/docs/reference/access-authn-authz/) - details on how Kubernetes controls API access
* [Well-Known Labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
-->
## API 參考

* [術語表](/zh-cn/docs/reference/glossary/) -  一個全面的標準化的 Kubernetes 術語表

* [Kubernetes API 參考](/zh-cn/docs/reference/kubernetes-api/)
* [Kubernetes API 單頁參考 {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。
* [使用 Kubernetes API ](/zh-cn/docs/reference/using-api/) - Kubernetes 的 API 概述
* [API 的訪問控制](/zh-cn/docs/reference/access-authn-authz/) - 關於 Kubernetes 如何控制 API 訪問的詳細資訊
* [常見的標籤、註解和汙點](/zh-cn/docs/reference/labels-annotations-taints/)

<!--
## Officially supported client libraries

To call the Kubernetes API from a programming language, you can use
[client libraries](/docs/reference/using-api/client-libraries/). Officially supported
client libraries:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# client library](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell client library](https://github.com/kubernetes-client/haskell)
-->
## 官方支援的客戶端庫

如果你需要透過程式語言呼叫 Kubernetes API，你可以使用
[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)。以下是官方支援的客戶端庫：

- [Kubernetes Go 語言客戶端庫](https://github.com/kubernetes/client-go/)
- [Kubernetes Python 語言客戶端庫](https://github.com/kubernetes-client/python)
- [Kubernetes Java 語言客戶端庫](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript 語言客戶端庫](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# 語言客戶端庫](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell 語言客戶端庫](https://github.com/kubernetes-client/haskell)

<!--
## CLI

* [kubectl](/docs/reference/kubectl/) - Main CLI tool for running commands and managing Kubernetes clusters.
    * [JSONPath](/docs/reference/kubectl/jsonpath/) - Syntax guide for using [JSONPath expressions](https://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.
-->
## CLI

* [kubectl](/zh-cn/docs/reference/kubectl/) - 主要的 CLI 工具，用於執行命令和管理 Kubernetes 叢集。
    * [JSONPath](/zh-cn/docs/reference/kubectl/jsonpath/) - 透過 kubectl 使用
      [JSONPath 表示式](https://goessner.net/articles/JsonPath/) 的語法指南。
* [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) - 此 CLI 工具可輕鬆配置安全的 Kubernetes 叢集。

<!--
## Components

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The
  primary agent that runs on each node. The kubelet takes a set of PodSpecs
  and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API that validates and configures data for API objects such as  pods,
  services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can
  do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across
  a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler that manages availability, performance, and capacity.
  
  * [Scheduler Policies](/docs/reference/scheduling/policies)
  * [Scheduler Profiles](/docs/reference/scheduling/config#profiles)
  * List of [ports and protocols](/docs/reference/ports-and-protocols/) that
    should be open on control plane and worker nodes
-->
## 元件

* [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) -
  在每個節點上執行的主代理。kubelet 接收一組 PodSpecs 並確保其所描述的容器健康地執行。
* [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API，用於驗證和配置 API 物件（如 Pod、服務或副本控制器等）的資料。
* [kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) -
  一個守護程序，其中包含 Kubernetes 所附帶的核心控制迴路。
* [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/) -
  可進行簡單的 TCP/UDP 流轉發或針對一組後端執行輪流 TCP/UDP 轉發。
* [kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/) -
  一個排程程式，用於管理可用性、效能和容量。
  
  * [排程策略](/zh-cn/docs/reference/scheduling/policies)
  * [排程配置](/zh-cn/docs/reference/scheduling/config#profiles)
  * 應該在控制平面和工作節點上開啟的 [埠和協議](/zh-cn/docs/reference/ports-and-protocols/) -
    列表

<!--
## Config APIs

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.

* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
* [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver encryption (v1)](/docs/reference/config-api/apiserver-encryption.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) and
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
* [kubelet credential providers (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)
* [kubelet credential providers (v1beta1)](/docs/reference/config-api/kubelet-credentialprovider.v1beta1/)
* [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) and
  [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) and
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
-->
## 配置 API

本節包含用於配置 kubernetes 元件或工具的 "未釋出" API 的文件。
儘管這些 API 對於使用者或操作者使用或管理叢集來說是必不可少的，
它們大都沒有以 RESTful 的方式在 API 伺服器上公開。

* [kube-apiserver 配置 (v1alpha1)](/zh-cn/docs/reference/config-api/apiserver-config.v1alpha1/)
* [kube-apiserver 配置 (v1)](/zh-cn/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver 加密 (v1)](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)
* [kube-apiserver 事件速率限制 (v1alpha1)](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1/)
* [kubelet 配置 (v1alpha1)](/zh-cn/docs/reference/config-api/kubelet-config.v1alpha1/) 和
  [kubelet 配置 (v1beta1)](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
* [kubelet 憑據驅動 (v1alpha1)](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)
* [kubelet 憑據驅動 (v1beta1)](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1beta1/)
* [kube-scheduler 配置 (v1beta2)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta2/) 和
  [kube-scheduler 配置 (v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
* [kube-proxy 配置 (v1alpha1)](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/zh-cn/docs/reference/config-api/apiserver-audit.v1/)
* [客戶端認證 API (v1beta1)](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/) 和
  [客戶端認證 API (v1)](/zh-cn/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission 配置 (v1)](/zh-cn/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/zh-cn/docs/reference/config-api/imagepolicy.v1alpha1/)

<!--
## Config API for kubeadm

* [v1beta2](/docs/reference/config-api/kubeadm-config.v1beta2/)
* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
-->

## kubeadm 的配置 API

* [v1beta2](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta2/)
* [v1beta3](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)

<!--
## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are
[Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) and
[Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).
-->
## 設計文件

Kubernetes 功能的設計文件歸檔，不妨考慮從
[Kubernetes 架構](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) 和
[Kubernetes 設計概述](https://git.k8s.io/community/contributors/design-proposals)
開始閱讀。

