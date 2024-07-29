---
title: 参考
linkTitle: "参考"
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
这是 Kubernetes 文档的参考部分。

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
## API 参考  {#api-reference}

* [术语表](/zh-cn/docs/reference/glossary/) —— 一个全面的、标准化的 Kubernetes 术语表
* [Kubernetes API 参考](/zh-cn/docs/reference/kubernetes-api/)
* [Kubernetes API 单页参考 {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [使用 Kubernetes API ](/zh-cn/docs/reference/using-api/) —— Kubernetes 的 API 概述
* [API 的访问控制](/zh-cn/docs/reference/access-authn-authz/) —— 关于 Kubernetes 如何控制 API 访问的详细信息
* [常见的标签、注解和污点](/zh-cn/docs/reference/labels-annotations-taints/)

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
## 官方支持的客户端库   {#officially-supported-client-libraries}

如果你需要通过编程语言调用 Kubernetes API，你可以使用[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)。
以下是官方支持的客户端库：

- [Kubernetes Go 语言客户端库](https://github.com/kubernetes/client-go/)
- [Kubernetes Python 语言客户端库](https://github.com/kubernetes-client/python)
- [Kubernetes Java 语言客户端库](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript 语言客户端库](https://github.com/kubernetes-client/javascript)
- [Kubernetes C# 语言客户端库](https://github.com/kubernetes-client/csharp)
- [Kubernetes Haskell 语言客户端库](https://github.com/kubernetes-client/haskell)

<!--
## CLI

* [kubectl](/docs/reference/kubectl/) - Main CLI tool for running commands and managing Kubernetes clusters.
  * [JSONPath](/docs/reference/kubectl/jsonpath/) - Syntax guide for using [JSONPath expressions](https://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.
-->
## CLI

* [kubectl](/zh-cn/docs/reference/kubectl/) —— 主要的 CLI 工具，用于运行命令和管理 Kubernetes 集群。
  * [JSONPath](/zh-cn/docs/reference/kubectl/jsonpath/) —— 通过 kubectl 使用
    [JSONPath 表达式](https://goessner.net/articles/JsonPath/)的语法指南。
* [kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) —— 此 CLI 工具可轻松配置安全的 Kubernetes 集群。

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
## 组件  {#components}

* [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) ——
  在每个节点上运行的主代理。kubelet 接收一组 PodSpec 并确保其所描述的容器健康地运行。
* [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/) ——
  REST API，用于验证和配置 API 对象（如 Pod、服务或副本控制器等）的数据。
* [kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) ——
  一个守护进程，其中包含 Kubernetes 所附带的核心控制回路。
* [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/) ——
  可进行简单的 TCP/UDP 流转发或针对一组后端执行轮流 TCP/UDP 转发。
* [kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/) ——
  一个调度程序，用于管理可用性、性能和容量。
  
  * [调度策略](/zh-cn/docs/reference/scheduling/policies)
  * [调度配置](/zh-cn/docs/reference/scheduling/config#profiles)

* 应该在控制平面和工作节点上打开的[端口和协议](/zh-cn/docs/reference/networking/ports-and-protocols/)列表

<!--
## Config APIs

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.

* [kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [kube-apiserver admission (v1)](/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/) and
  [kube-apiserver configuration (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/) and
  [kube-apiserver configuration (v1)](/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) and
  [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
  [kubelet configuration (v1)](/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) and
  [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) and 
  [Client authentication API (v1)](/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/docs/reference/config-api/imagepolicy.v1alpha1/)
-->
## 配置 API   {#config-apis}

本节包含用于配置 kubernetes 组件或工具的 "未发布" API 的文档。
尽管这些 API 对于用户或操作者使用或管理集群来说是必不可少的，
它们大都没有以 RESTful 的方式在 API 服务器上公开。

* [kubeconfig（v1）](/zh-cn/docs/reference/config-api/kubeconfig.v1/)
* [kube-apiserver 准入（v1）](/zh-cn/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver 配置（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-config.v1alpha1/) 和
  [kube-apiserver 配置（v1beta1）](/zh-cn/docs/reference/config-api/apiserver-config.v1beta1/) 和
  [kube-apiserver 配置（v1）](/zh-cn/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver 事件速率限制（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet 配置（v1alpha1）](/zh-cn/docs/reference/config-api/kubelet-config.v1alpha1/)、
  [kubelet 配置（v1beta1）](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 和
  [kubelet 配置（v1）](/zh-cn/docs/reference/config-api/kubelet-config.v1/)
* [kubelet 凭据驱动（v1）](/zh-cn/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler 配置（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/) 和
  [kube-scheduler 配置（v1beta3）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
* [kube-controller-manager 配置（v1alpha1）](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy 配置（v1alpha1）](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/zh-cn/docs/reference/config-api/apiserver-audit.v1/)
* [客户端身份认证 API（v1beta1）](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/) 和
  [客户端身份认证 API（v1）](/zh-cn/docs/reference/config-api/client-authentication.v1/)
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

这些是 Kubernetes 项目所定义的 API，但不是由核心项目实现的：

* [指标 API（v1beta1）](/zh-cn/docs/reference/external-api/metrics.v1beta1/)
* [自定义指标 API（v1beta2）](/zh-cn/docs/reference/external-api/custom-metrics.v1beta2)
* [外部指标 API（v1beta1）](/zh-cn/docs/reference/external-api/external-metrics.v1beta1)

<!--
## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are
[Kubernetes Architecture](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) and
[Kubernetes Design Overview](https://git.k8s.io/design-proposals-archive).
-->
## 设计文档   {#design-docs}

Kubernetes 功能的设计文档归档，不妨考虑从
[Kubernetes 架构](https://git.k8s.io/design-proposals-archive/architecture/architecture.md)和
[Kubernetes 设计概述](https://git.k8s.io/design-proposals-archive)开始阅读。
