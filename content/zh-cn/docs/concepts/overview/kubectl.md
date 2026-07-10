---
title: kubectl 命令行工具
content_type: concept
description: >
  kubectl 是与 Kubernetes 集群通信的主要命令行工具。本页概述了 kubectl 及其在 Kubernetes 生态系统中的作用。
weight: 50
card:
  name: concepts
  title: kubectl
  weight: 40
---
<!--
title: The kubectl command-line tool
content_type: concept
description: >
  kubectl is the primary command-line tool for communicating with a Kubernetes cluster. This page provides an overview of kubectl and its role in the Kubernetes ecosystem.
weight: 50
card:
  name: concepts
  title: kubectl
  weight: 40
-->

<!-- overview -->

{{< glossary_definition prepend="Kubernetes provides a" term_id="kubectl" length="short" >}}

<!--
The `kubectl` tool communicates with your cluster through the [Kubernetes API](/docs/concepts/overview/kubernetes-api/).
For configuration, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
files by setting the `KUBECONFIG` environment variable or by setting the
[`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) flag.
-->
`kubectl` 工具通过 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 与你的集群通信。
在配置方面，`kubectl` 在 `$HOME/.kube` 目录中查找名为 `config` 的文件。
你可以通过设置 `KUBECONFIG` 环境变量，或设置
[`--kubeconfig`](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
参数来指定其他
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件。

<!-- body -->

<!--
## Role of kubectl

The `kubectl` tool is the primary interface for creating, inspecting, updating, and deleting Kubernetes objects.
It complements the [Kubernetes Components](/docs/concepts/overview/components/) that run inside your cluster
and the [Kubernetes API](/docs/concepts/overview/kubernetes-api/) that those components implement.
Whether you run `kubectl` from your laptop or from a Pod inside the cluster, it sends requests to the API server.
Other clients, such as [client libraries](/docs/reference/using-api/client-libraries/) and web dashboards
like [Headlamp](https://headlamp.dev/), also communicate through the same API.
-->
## kubectl 的作用  {#role-of-kubectl}

`kubectl` 工具是用于创建、查看、更新和删除 Kubernetes 对象的主要接口。
它与运行在集群内部的 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)以及这些组件所实现的
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 相辅相成。
无论你是在笔记本电脑上运行 `kubectl`，还是在集群中的 Pod 内运行，它都会向 API 服务器发送请求。
诸如[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)这类其他客户端和
[Headlamp](https://headlamp.dev/) 这类 Web 控制台也都通过相同的 API 进行通信。

<!--
## How kubectl works

The `kubectl` tool connects to the API server and authenticates using the cluster, user, and context defined in your
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file.
When you run `kubectl` from outside a cluster, it uses the kubeconfig file to find the API server address and credentials.
When `kubectl` runs inside a Pod (for example, in a CI/CD pipeline), it can use in-cluster authentication
based on the ServiceAccount token mounted in the Pod.
-->
## kubectl 的工作方式  {#how-kubectl-works}

`kubectl` 工具通过 kubeconfig 文件中定义的集群、用户和上下文连接到 API 服务器并进行身份认证。
当你在集群外运行 `kubectl` 时，它会使用 kubeconfig 文件来查找 API 服务器地址和凭据。
当 `kubectl` 在 Pod 内运行时（例如 CI/CD 流水线中），它可以使用基于 Pod 中挂载的 ServiceAccount Token 的集群内认证方式。

<!--
When you run a command, `kubectl` translates your intent into one or more HTTP requests to the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/). The API server validates each request,
applies it to the cluster state stored in {{< glossary_tooltip text="etcd" term_id="etcd" >}}, and
returns the result. This means every `kubectl` action, whether creating a Deployment or reading logs,
follows the same API-driven path.

Because your kubeconfig can define multiple clusters, users, and contexts, you can use `kubectl` to
switch between clusters without reconfiguring your environment. Run `kubectl config use-context` to
change the active context.
-->
当你执行命令时，`kubectl` 会将你的意图转换为一个或多个 HTTP 请求发送给
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)。API 服务器会验证每个请求，
将其应用到存储在 {{< glossary_tooltip text="etcd" term_id="etcd" >}} 中的集群状态，并返回结果。
这意味着每一个 `kubectl` 操作，无论是创建 Deployment 还是查看日志，都遵循同样的 API 驱动路径。

由于 kubeconfig 可以定义多个集群、用户和上下文，你可以使用 `kubectl` 在不同集群之间切换，
而无需重新配置环境。运行 `kubectl config use-context` 来切换当前上下文。

<!--
## What you can do with kubectl

The `kubectl` tool supports many operations, which fall into these broad categories:
-->
## kubectl 可以做什么  {#what-you-can-do-with-kubectl}

`kubectl` 支持多种操作，大致分为以下几类：

<!--
* **Manage resources** – Create, update, and delete objects such as Pods, Deployments, and Services.
  Use `kubectl apply` for declarative management from configuration files.
* **Inspect cluster state** – List and describe objects, view events, and check resource usage.
* **Debug** – View logs from containers, execute commands inside a running container, or port-forward to a Pod.
* **Cluster operations** – Drain nodes for maintenance, cordon nodes to prevent new workloads, and manage cluster configuration.
* **Script and automate** – Format output as JSON, YAML, or custom columns using [JSONPath](/docs/reference/kubectl/jsonpath/) for use in scripts and pipelines.
-->
* **管理资源** – 创建、更新和删除 Pod、Deployment、Service 等对象。
  使用 `kubectl apply` 给予配置文件进行声明式管理。
* **查看集群状态** – 列出和描述对象、查看事件、检查资源使用情况。
* **调试** – 查看容器日志、在运行中的容器内执行命令，或端口转发到 Pod。
* **集群运维操作** – 对节点执行 drain 进行维护、cordon 节点防止调度新负载，以及管理集群配置。
* **脚本与自动化** – 使用 [JSONPath](zh-cn/docs/reference/kubectl/jsonpath/)
  将输出格式化为 JSON、YAML 或自定义列，用于脚本和流水线。

<!--
For syntax, command reference, and examples, see the [kubectl reference documentation](/docs/reference/kubectl/).

## Declarative vs imperative

For production workloads, prefer [declarative object management](/docs/concepts/overview/working-with-objects/object-management/)
using `kubectl apply` with version-controlled configuration files.
Declarative management helps you track changes, collaborate, and integrate with GitOps workflows.
Imperative commands (such as `kubectl create` or `kubectl run`) are useful for development and experimentation,
but are harder to reproduce and audit.
-->
关于语法、命令参考和示例，请查看 [kubectl reference 文档](/zh-cn/docs/reference/kubectl/)。

## 声明式与命令式  {#declarative-vs-imperative}

在生产环境中，建议使用基于版本控制配置文件的[声明式对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)，并使用
`kubectl apply`。声明式管理有助于跟踪变更、协作，并集成 GitOps 工作流。
命令式命令（如 `kubectl create` 或 `kubectl run`）适用于开发和实验，但更难复现和审计。

<!--
## Extending kubectl with plugins

You can extend `kubectl` with [plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) that add new
sub-commands. Plugins are standalone binaries that follow the `kubectl-<plugin-name>` naming convention.
The Kubernetes community maintains many plugins, and you can manage them with the
[Krew](https://krew.sigs.k8s.io/) plugin manager.
-->
## 通过插件扩展 kubectl  {#extending-kubectl-with-plugins}

你可以通过[插件](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)扩展 `kubectl`，增加新的子命令。
插件是独立的二进制文件，遵循 `kubectl-<plugin-name>` 命名约定。
Kubernetes 社区维护了许多插件，并可以通过 [Krew](https://krew.sigs.k8s.io/) 插件管理器进行管理。

<!--
## Version compatibility

The `kubectl` tool supports a version skew of plus-or-minus one minor version relative to the cluster's
control plane. For example, `kubectl` v1.32 works with control planes at v1.31, v1.32, and v1.33.
Using a compatible version avoids unexpected behavior. See the
[version skew policy](/releases/version-skew-policy/) for details.
-->
## 版本兼容性 {#version-compatibility}

`kubectl` 工具支持与集群控制平面版本上下浮动一个 minor 版本的兼容性。
例如，`kubectl` v1.32 可与 v1.31、v1.32 和 v1.33 的控制平面兼容。
使用兼容版本可以避免意外行为。详见[版本偏移策略](/zh-cn/releases/version-skew-policy/)。

## {{% heading "whatsnext" %}}

<!--
* Read the [kubectl reference](/docs/reference/kubectl/) for syntax and command details.
* [Install kubectl](/docs/tasks/tools/#kubectl) on your machine.
* Learn about [The Kubernetes API](/docs/concepts/overview/kubernetes-api/) that `kubectl` uses.
* Review [Kubernetes Components](/docs/concepts/overview/components/) that make up a cluster.
* Explore [Object Management](/docs/concepts/overview/working-with-objects/object-management/) and declarative configuration.
* Check the [version skew policy](/releases/version-skew-policy/) for supported version combinations.
-->
* 阅读 [kubectl 参考文档](/zh-cn/docs/reference/kubectl/)获取语法和命令细节。
* 在你的机器上[安装 kubectl](/zh-cn/docs/tasks/tools/#kubectl)。
* 了解 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 的工作方式。
* 查看构成集群的 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)。
* 学习[对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)与声明式配置。
* 查看[版本偏移策略](/zh-cn/releases/version-skew-policy/)以了解支持的版本组合。
