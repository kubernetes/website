---
title: 开发云控制器管理器
content_type: task
weight: 190
---
<!--
reviewers:
- luxas
- thockin
- wlan0
title: Developing Cloud Controller Manager
content_type: concept
weight: 190
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

{{< glossary_definition term_id="cloud-controller-manager" length="all">}}

<!-- body -->

<!--
## Background

Since cloud providers develop and release at a different pace compared to the Kubernetes project, abstracting the provider-specific code to the `cloud-controller-manager` binary allows cloud vendors to evolve independently from the core Kubernetes code.
-->
## 背景   {#background}

由于云驱动的开发和发布与 Kubernetes 项目本身步调不同，将特定于云环境的代码抽象到
`cloud-controller-manager` 二进制组件有助于云厂商独立于 Kubernetes
核心代码推进其驱动开发。

<!--
The Kubernetes project provides skeleton cloud-controller-manager code with Go interfaces to allow you (or your cloud provider) to plug in your own implementations. This means that a cloud provider can implement a cloud-controller-manager by importing packages from Kubernetes core; each cloudprovider will register their own code by calling `cloudprovider.RegisterCloudProvider` to update a global variable of available cloud providers.
-->
Kubernetes 项目提供 cloud-controller-manager 的框架代码，其中包含 Go 语言的接口，
便于你（或者你的云驱动提供者）接驳你自己的实现。这意味着每个云驱动可以通过从
Kubernetes 核心代码导入软件包来实现一个 cloud-controller-manager；
每个云驱动会通过调用 `cloudprovider.RegisterCloudProvider` 接口来注册其自身实现代码，
从而更新一个用来记录可用云驱动的全局变量。

<!--
## Developing
-->
## 开发   {#developing}

### 树外（Out of Tree）

<!--
To build an out-of-tree cloud-controller-manager for your cloud:
-->
要为你的云环境构建一个树外（Out-of-Tree）云控制器管理器：

<!--
1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Use [`main.go` in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/main.go) from Kubernetes core as a template for your `main.go`. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).
-->
1. 使用满足 [`cloudprovider.Interface`](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)
   接口的实现来创建一个 Go 语言包。
2. 使用来自 Kubernetes 核心代码库的
   [cloud-controller-manager 中的 `main.go`](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/main.go)
   作为 `main.go` 的模板。如上所述，唯一的区别应该是将导入的云包不同。
3. 在 `main.go` 中导入你的云包，确保你的包有一个 `init` 块来运行
   [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go)。

<!--
Many cloud providers publish their controller manager code as open source. If you are creating
a new cloud-controller-manager from scratch, you could take an existing out-of-tree cloud
controller manager as your starting point.
-->
很多云驱动都将其控制器管理器代码以开源代码的形式公开。
如果你在开发一个新的 cloud-controller-manager，你可以选择某个树外（Out-of-Tree）
云控制器管理器作为出发点。

### 树内（In Tree）

<!--
For in-tree cloud providers, you can run the in-tree cloud controller manager as a {{< glossary_tooltip term_id="daemonset" >}} in your cluster. See [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) for more details.
-->
对于树内（In-Tree）驱动，你可以将树内云控制器管理器作为集群中的
{{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 来运行。
有关详细信息，请参阅[云控制器管理器管理](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/)。
