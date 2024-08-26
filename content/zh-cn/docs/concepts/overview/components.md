---
title: Kubernetes 组件
content_type: concept
description: >
  组成 Kubernetes 集群的关键组件概述。
weight: 30
card:
  title: 集群组件
  name: concepts
  weight: 20
---
<!--
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  An overview of the key components that make up a Kubernetes cluster.
weight: 30
card:
  title: Components of a cluster
  name: concepts
  weight: 20
-->

<!-- overview -->

<!--
本页面概述了组成 Kubernetes 集群的基本组件。

{{ < figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" clicktozoom="true" >}}
-->
本文档概述了一个正常运行的 Kubernetes 集群所需的各种组件。

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes 的组件" caption="Kubernetes 集群的组件" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

<!--
## Core Components

A Kubernetes cluster consists of a control plane and one or more worker nodes. Here's a brief overview of the main components:
-->
## 核心组件

Kubernetes 集群由控制平面和一个或多个工作节点组成。以下是主要组件的简要概述：

<!--
### Control Plane Components

Manage the overall state of the cluster:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: The core component server that exposes the Kubernetes HTTP API

[etcd](/docs/concepts/architecture/#etcd)
: Consistent and highly-available key value store for all API server data

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Looks for Pods not yet bound to a node, and assigns each Pod to a suitable node.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Runs {{< glossary_tooltip text="controllers" term_id="controller" >}} to implement Kubernetes API behavior.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: Integrates with underlying cloud provider(s)
-->
## 控制平面组件（Control Plane Components）    {#control-plane-components}

管理集群的整体状态：

[kube-apiserver](/zh-cn/docs/concepts/architecture/#kube-apiserver)
: 公开 Kubernetes HTTP API 的核心组件服务器

[etcd](/zh-cn/docs/concepts/architecture/#etcd)
: 具备一致性和高可用性的键值存储，用于所有 API 服务器的数据存储

[kube-scheduler](/zh-cn/docs/concepts/architecture/#kube-scheduler)
: 查找尚未绑定到节点的 Pod，并将每个 Pod 分配给合适的节点。

[kube-controller-manager](/zh-cn/docs/concepts/architecture/#kube-controller-manager)
: 运行{{< glossary_tooltip text="控制器" term_id="controller" >}}来实现 Kubernetes API 行为。

[cloud-controller-manager](/zh-cn/docs/concepts/architecture/#cloud-controller-manager) (optional)
: 与底层云驱动集成

<!--
### Node Components

Run on every node, maintaining running pods and providing the Kubernetes runtime environment:

[kubelet](/docs/concepts/architecture/#kubelet)
: Ensures that Pods are running, including their containers.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optional)
: Maintains network rules on nodes to implement {{< glossary_tooltip text="Services" term_id="service" >}}


[Container runtime](/docs/concepts/architecture/#container-runtime)
: Software responsible for running containers. Read [Container Runtimes](/docs/setup/production-environment/container-runtimes/) to learn more.
-->
## Node 组件  {#node-components}

在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行时环境：

[kubelet](/zh-cn/docs/concepts/architecture/#kubelet)
: 确保 Pod 及其容器正常运行。

[kube-proxy](/zh-cn/docs/concepts/architecture/#kube-proxy)（可选）
: 维护节点上的网络规则以实现 Service 的功能。

[容器运行时（Container runtime）](/zh-cn/docs/concepts/architecture/#container-runtime)
: 负责运行容器的软件，阅读[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)以了解更多信息。

{{% thirdparty-content single="true" %}}

<!--
Your cluster may require additional software on each node; for example, you might also
run [systemd](https://systemd.io/) on a Linux node to supervise local components.
-->
你的集群可能需要每个节点上运行额外的软件；例如，你可能还需要在 Linux
节点上运行 [systemd](https://systemd.io/) 来监督本地组件。

<!--
## Addons

Addons extend the functionality of Kubernetes. A few important examples include:
-->
## 插件（Addons）    {#addons}

插件扩展了 Kubernetes 的功能。一些重要的例子包括：

<!--
[DNS](/docs/concepts/architecture/#dns)
: For cluster-wide DNS resolution

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: For cluster management via a web interface

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: For collecting and storing container metrics

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: For saving container logs to a central log store
-->
[DNS](/zh-cn/docs/concepts/architecture/#dns)
: 集群范围内的 DNS 解析

[Web 界面](/zh-cn/docs/concepts/architecture/#web-ui-dashboard)（Dashboard）
: 通过 Web 界面进行集群管理

[容器资源监控](/zh-cn/docs/concepts/architecture/#container-resource-monitoring)
: 用于收集和存储容器指标

[集群层面日志](/zh-cn/docs/concepts/architecture/#cluster-level-logging)
: 用于将容器日志保存到中央日志存储

<!--
## Flexibility in Architecture

Kubernetes allows for flexibility in how these components are deployed and managed. The architecture can be adapted to various needs, from small development environments to large-scale production deployments.

For more detailed information about each component and various ways to configure your cluster architecture, see the [Cluster Architecture](/docs/concepts/architecture/) page.
-->
## 架构灵活性    {#flexibility-in-architecture}

Kubernetes 允许灵活地部署和管理这些组件。此架构可以适应各种需求，从小型开发环境到大规模生产部署。

有关每个组件的详细信息以及配置集群架构的各种方法，
请参阅[集群架构](/zh-cn/docs/concepts/architecture/)页面。
