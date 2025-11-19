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
這是 Kubernetes 文檔的參考部分。

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
## API 參考  {#api-reference}

* [術語表](/zh-cn/docs/reference/glossary/) —— 一個全面的、標準化的 Kubernetes 術語表
* [Kubernetes API 參考](/zh-cn/docs/reference/kubernetes-api/)
* [Kubernetes API 單頁參考 {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [使用 Kubernetes API ](/zh-cn/docs/reference/using-api/) —— Kubernetes 的 API 概述
* [API 的訪問控制](/zh-cn/docs/reference/access-authn-authz/) —— 關於 Kubernetes 如何控制 API 訪問的詳細信息
* [常見的標籤、註解和污點](/zh-cn/docs/reference/labels-annotations-taints/)

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
## 官方支持的客戶端庫   {#officially-supported-client-libraries}

如果你需要通過編程語言調用 Kubernetes API，你可以使用[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)。
以下是官方支持的客戶端庫：

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

* [kubectl](/zh-cn/docs/reference/kubectl/) —— 主要的 CLI 工具，用於運行命令和管理 Kubernetes 集羣。
  * [JSONPath](/zh-cn/docs/reference/kubectl/jsonpath/) —— 通過 kubectl 使用
    [JSONPath 表達式](https://goessner.net/articles/JsonPath/)的語法指南。
* [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) —— 此 CLI 工具可輕鬆配置安全的 Kubernetes 集羣。

<!--
## Components

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The
  primary agent that runs on each node. The kubelet takes a set of PodSpecs
  and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API that validates and configures data for API objects such as  pods,
  services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) -
  Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can
  do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across
  a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) -
  Scheduler that manages availability, performance, and capacity.
  
  * [Scheduler Policies](/docs/reference/scheduling/policies)
  * [Scheduler Profiles](/docs/reference/scheduling/config#profiles)

* List of [ports and protocols](/docs/reference/networking/ports-and-protocols/) that
  should be open on control plane and worker nodes
-->
## 組件  {#components}

* [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) ——
  在每個節點上運行的主代理。kubelet 接收一組 PodSpec 並確保其所描述的容器健康地運行。
* [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/) ——
  REST API，用於驗證和配置 API 對象（如 Pod、服務或副本控制器等）的數據。
* [kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) ——
  一個守護進程，其中包含 Kubernetes 所附帶的核心控制迴路。
* [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/) ——
  可進行簡單的 TCP/UDP 流轉發或針對一組後端執行輪流 TCP/UDP 轉發。
* [kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/) ——
  一個調度程序，用於管理可用性、性能和容量。
  
  * [調度策略](/zh-cn/docs/reference/scheduling/policies)
  * [調度配置](/zh-cn/docs/reference/scheduling/config#profiles)

* 應該在控制平面和工作節點上打開的[端口和協議](/zh-cn/docs/reference/networking/ports-and-protocols/)列表

<!--
## Config APIs

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kuberc (v1alpha1)](/docs/reference/config-api/kuberc.v1alpha1/) and
  [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) and
  [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) and
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) and
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/) and
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) and 
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
-->
## 配置 API   {#config-apis}

本節包含用於配置 kubernetes 組件或工具的 "未發佈" API 的文檔。
儘管這些 API 對於用戶或操作者使用或管理集羣來說是必不可少的，
它們大都沒有以 RESTful 的方式在 API 服務器上公開。

* [kubeconfig（v1）](/zh-cn/docs/reference/config-api/kubeconfig.v1/)
* [kuberc（v1alpha1）](/zh-cn/docs/reference/config-api/kuberc.v1alpha1/)
  和 [kuberc (v1beta1)](/docs/reference/config-api/kuberc.v1beta1/)
* [kube-apiserver 准入（v1）](/zh-cn/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver 配置（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-config.v1alpha1/) 和
  [kube-apiserver 配置（v1beta1）](/zh-cn/docs/reference/config-api/apiserver-config.v1beta1/) 和
  [kube-apiserver 配置（v1）](/zh-cn/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver 事件速率限制（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet 配置（v1alpha1）](/zh-cn/docs/reference/config-api/kubelet-config.v1alpha1/)、
  [kubelet 配置（v1beta1）](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 和
  [kubelet 配置（v1）](/zh-cn/docs/reference/config-api/kubelet-config.v1/)
* [kubelet 憑據驅動（v1）](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler 配置（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager 配置（v1alpha1）](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy 配置（v1alpha1）](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/zh-cn/docs/reference/config-api/apiserver-audit.v1/)
* [客戶端身份認證 API（v1beta1）](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/) 和
  [客戶端身份認證 API（v1）](/zh-cn/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission 配置（v1）](/zh-cn/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API（v1alpha1）](/zh-cn/docs/reference/config-api/imagepolicy.v1alpha1/)

<!--
## Config API for kubeadm

* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)
-->
## kubeadm 的配置 API   {#config-api-for-kubeadm}

* [v1beta3](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)

<!--
## External APIs

These are the APIs defined by the Kubernetes project, but are not implemented
by the core project:

* [Metrics API (v1beta1)](/docs/reference/external-api/metrics.v1beta1/)
* [Custom Metrics API (v1beta2)](/docs/reference/external-api/custom-metrics.v1beta2)
* [External Metrics API (v1beta1)](/docs/reference/external-api/external-metrics.v1beta1)
-->
## 外部 API    {#external-apis}

這些是 Kubernetes 項目所定義的 API，但不是由核心項目實現的：

* [指標 API（v1beta1）](/zh-cn/docs/reference/external-api/metrics.v1beta1/)
* [自定義指標 API（v1beta2）](/zh-cn/docs/reference/external-api/custom-metrics.v1beta2)
* [外部指標 API（v1beta1）](/zh-cn/docs/reference/external-api/external-metrics.v1beta1)

<!--
## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are
[Kubernetes Architecture](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) and
[Kubernetes Design Overview](https://git.k8s.io/design-proposals-archive).
-->
## 設計文檔   {#design-docs}

Kubernetes 功能的設計文檔歸檔，不妨考慮從
[Kubernetes 架構](https://git.k8s.io/design-proposals-archive/architecture/architecture.md)和
[Kubernetes 設計概述](https://git.k8s.io/design-proposals-archive)開始閱讀。
