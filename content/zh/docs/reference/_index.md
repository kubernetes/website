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
-->

<!-- overview -->

<!--
This section of the Kubernetes documentation contains references.
-->
这是 Kubernetes 文档的参考部分。

<!-- body -->

<!--
## API Reference

* [Kubernetes API Overview](/docs/reference/using-api/api-overview/) - Overview of the API for Kubernetes.
* [Kubernetes API Reference {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)
-->
## API 参考

* [Kubernetes API 概述](/zh/docs/reference/using-api/api-overview/) - Kubernetes API 概述。
* [Kubernetes API 参考 {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)

<!--
## API Client Libraries

To call the Kubernetes API from a programming language, you can use
[client libraries](/docs/reference/using-api/client-libraries/). Officially supported
client libraries:

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)
- [Kubernetes Java client library](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript client library](https://github.com/kubernetes-client/javascript)
-->
## API 客户端库

如果您需要通过编程语言调用 Kubernetes API，您可以使用
[客户端库](/zh/docs/reference/using-api/client-libraries/)。以下是官方支持的客户端库：

- [Kubernetes Go 语言客户端库](https://github.com/kubernetes/client-go/)
- [Kubernetes Python 语言客户端库](https://github.com/kubernetes-client/python)
- [Kubernetes Java 语言客户端库](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript 语言客户端库](https://github.com/kubernetes-client/javascript)

<!--
## CLI Reference

* [kubectl](/docs/user-guide/kubectl-overview) - Main CLI tool for running commands and managing Kubernetes clusters.
    * [JSONPath](/docs/user-guide/jsonpath/) - Syntax guide for using [JSONPath expressions](http://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/admin/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.
* [kubefed](/docs/admin/kubefed/) - CLI tool to help you administrate your federated clusters.
-->
## CLI 参考

* [kubectl](/zh/docs/reference/kubectl/overview/) - 主要的 CLI 工具，用于运行命令和管理 Kubernetes 集群。
    * [JSONPath](/zh/docs/reference/kubectl/jsonpath/) - 通过 kubectl 使用 [JSONPath 表达式](http://goessner.net/articles/JsonPath/) 的语法指南。
* [kubeadm](/zh/docs/reference/setup-tools/kubeadm/) - 此 CLI 工具可轻松配置安全的 Kubernetes 集群。

<!--
## Components Reference

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The primary *node agent* that runs on each node. The kubelet takes a set of PodSpecs and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - REST API that validates and configures data for API objects such as  pods, services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler that manages availability, performance, and capacity.
  * [kube-scheduler Policies](/docs/reference/scheduling/policies)
  * [kube-scheduler Profiles](/docs/reference/scheduling/config#profiles)
-->
## 组件参考

* [kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/) - 在每个节点上运行的主 *节点代理* 。kubelet 采用一组 PodSpecs 并确保所描述的容器健康地运行。
* [kube-apiserver](/zh/docs/reference/command-line-tools-reference/kube-apiserver/) - REST API，用于验证和配置 API 对象（如 Pod、服务或副本控制器等）的数据。
* [kube-controller-manager](/zh/docs/reference/command-line-tools-reference/kube-controller-manager/) - 一个守护进程，它嵌入到了 Kubernetes 的附带的核心控制循环。
* [kube-proxy](/zh/docs/reference/command-line-tools-reference/kube-proxy/) - 可进行简单的 TCP/UDP 流转发或针对一组后端执行轮流 TCP/UDP 转发。
* [kube-scheduler](/zh/docs/reference/command-line-tools-reference/kube-scheduler/) - 一个调度程序，用于管理可用性、性能和容量。
  * [kube-scheduler 策略](/zh/docs/reference/scheduling/policies)
  * [kube-scheduler 配置](/zh/docs/reference/scheduling/config#profiles)
<!--
## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) and [Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).
-->
## 设计文档

Kubernetes 功能的设计文档归档，不妨考虑从 [Kubernetes 架构](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) 和 [Kubernetes 设计概述](https://git.k8s.io/community/contributors/design-proposals)开始阅读。

