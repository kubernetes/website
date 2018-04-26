---
approvers:
- luxas
- thockin
- wlan0
cn-approvers:
- xiaosuiba
title: 开发云管理控制器（Cloud Controller Manager）
---
<!--
title: Developing Cloud Controller Manager
-->

<!--
**Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will
be the preferred way to integrate Kubernetes with any cloud. This will ensure cloud providers
can develop their features independantly from the core Kubernetes release cycles.**
-->
**云管理控制器（Cloud Controller Manager）是 1.8 版本中的一个 alpha 特性。在以后的版本中，它将成为 Kubernetes 与任何云服务进行集成的首选方式。这将保证云服务提供商（cloud provider）能够在 Kubernetes 核心发布周期外独立开发他们的特性**

* TOC
{:toc}

<!--
## Background
-->
## 背景

<!--
Before going into how to build your own cloud controller manager, some background on how it works under the hood is helpful. The cloud controller manager is code from `kube-controller-manager` utilizing Go interfaces to allow implementations from any cloud to be plugged in. Most of the scaffolding and generic controller implementations will be in core, but it will always exec out to the cloud interfaces it is provided, so long as the [cloud provider interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go#L29-L50) is satisifed.
-->
在介绍如何构建您自己的云管理控制器之前，了解一下它的底层工作原理是很有帮助的。云管理控制器是从 `kube-controller-manager` 实现的 Go 语言接口代码，用于实现任何云服务的接入。绝大部分脚手架和通用控制器代码将在内核中实现，但只要实现了 [云服务提供商接口（cloud provider interface）](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go#L29-L50)，它就将执行所提供的云服务接口（cloud interface）。

<!--
To dive a little deeper into implementation details, all cloud controller managers will import packages from Kubernetes core, the only difference being each project will register their own cloud providers by calling [cloudprovider.RegisterCloudProvier](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) where a global variable of available cloud providers is updated.
-->
如果稍微深入了解一下实现细节，您会发现所有云管理控制器都将从 Kubernetes 内核导入包。唯一的区别是每个项目都会通过调用 [cloudprovider.RegisterCloudProvier](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) 注册自己的 cloud provider，它是一个用于更新可用 cloud provider 的全局变量。

<!--
## Developing
-->
## 开发

<!--
### Out of Tree
-->
### Out of Tree

<!--
To build an out-of-tree cloud-controller-manager for your cloud, follow these steps:
-->
要为您的云服务构建一个 out-of-tree 的 cloud-controller-manager，请执行这些步骤：

<!--
1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go).
2. Use [main.go in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) from Kubernestes core as a template for your main.go. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52).
-->
1. 创建一个拥有 [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go) 实现的 go 包。
2. 使用 Kubernestes 内核中 cloud-controller-manager 的 [main.go](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) 作为您的 main.go 模板。如同上文提到的，唯一的区别是导入不同的云服务包。
3. 在 `main.go` 中导入您的云服务包，确保包内有用于运行 [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) 的 `init` 块。

<!--
Using existing out-of-tree cloud providers as an example may be helpful. You can find the list [here](/docs/tasks/administer-cluster/running-cloud-controller.md#examples).
-->
使用现有的 out-of-tree cloud provider 可能会有所帮助。您可以在 [这里](/docs/tasks/administer-cluster/running-cloud-controller.md#示例) 找到列表。

<!--
### In Tree
-->
### In Tree

<!--
For in-tree cloud providers, you can run the in-tree cloud controller manager as a [Daemonset](/docs/tasks/administer-cluster/cloud-controller-manager-daemonset-example.yaml) in your cluster. See the [running cloud controller manager docs](/docs/tasks/administer-cluster/running-cloud-controller.md) for more details.
-->
对于 in-tree cloud provider，您可以在集群中将 in-tree 云管理控制器作为 [Daemonset](/docs/tasks/administer-cluster/cloud-controller-manager-daemonset-example.yaml) 运行。更多细节请查看 [运行云管理控制器文档](/docs/tasks/administer-cluster/running-cloud-controller.md)。
