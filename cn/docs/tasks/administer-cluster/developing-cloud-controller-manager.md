---
approvers:
- luxas
- thockin
- wlan0
cn-approvers:
- xiaosuiba
title: 开发云管理控制器（Cloud Controller Manager）
---



**云管理控制器（Cloud Controller Manager）是 1.8 版本中的一个 alpha 特性。在以后的版本中，它将成为 Kubernetes 与任何云服务进行集成的首选方式。这将保证云服务提供商（cloud provider）能够在 Kubernetes 核心发布周期外独立开发他们的特性**

* TOC
{:toc}


## 背景


在介绍如何构建您自己的云管理控制器之前，了解一下它的底层工作原理是很有帮助的。云管理控制器是从 `kube-controller-manager` 实现的 Go 语言接口代码，用于实现任何云服务的接入。绝大部分脚手架和通用控制器代码将在内核中实现，但只要实现了 [云服务提供商接口（cloud provider interface）](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go#L29-L50)，它就将执行所提供的云服务接口（cloud interface）。


如果稍微深入了解一下实现细节，您会发现所有云管理控制器都将从 Kubernetes 内核导入包。唯一的区别是每个项目都会通过调用 [cloudprovider.RegisterCloudProvier](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) 注册自己的 cloud provider，它是一个用于更新可用 cloud provider 的全局变量。


## 开发


### Out of Tree


要为您的云服务构建一个 out-of-tree 的 cloud-controller-manager，请执行这些步骤：


1. 创建一个拥有 [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go) 实现的 go 包。
2. 使用 Kubernestes 内核中 cloud-controller-manager 的 [main.go](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) 作为您的 main.go 模板。如同上文提到的，唯一的区别是导入不同的云服务包。
3. 在 `main.go` 中导入您的云服务包，确保包内有用于运行 [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) 的 `init` 块。


使用现有的 out-of-tree cloud provider 可能会有所帮助。您可以在 [这里](/docs/tasks/administer-cluster/running-cloud-controller.md#示例) 找到列表。


### In Tree


对于 in-tree cloud provider，您可以在集群中将 in-tree 云管理控制器作为 [Daemonset](/docs/tasks/administer-cluster/cloud-controller-manager-daemonset-example.yaml) 运行。更多细节请查看 [运行云管理控制器文档](/docs/tasks/administer-cluster/running-cloud-controller.md)。
