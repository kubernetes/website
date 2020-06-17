---
reviewers:
- luxas
- thockin
- wlan0
title: 开发云控制器管理器
content_type: concept
---

<!--
---
reviewers:
- luxas
- thockin
- wlan0
title: Developing Cloud Controller Manager
content_type: concept
---
-->



<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}
<!--
In upcoming releases, Cloud Controller Manager will
be the preferred way to integrate Kubernetes with any cloud. This will ensure cloud providers
can develop their features independently from the core Kubernetes release cycles.**
-->
在即将发布的版本中，云控制器管理器将是把 Kubernetes 与任何云集成的首选方式。 这将确保驱动可以独立于核心 Kubernetes 发布周期开发其功能。

{{< feature-state for_k8s_version="1.8" state="alpha" >}}

<!--
Before going into how to build your own cloud controller manager, some background on how it works under the hood is helpful. The cloud controller manager is code from `kube-controller-manager` utilizing Go interfaces to allow implementations from any cloud to be plugged in. Most of the scaffolding and generic controller implementations will be in core, but it will always exec out to the cloud interfaces it is provided, so long as the [cloud provider interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go#L42-L62) is satisfied.
-->
在讨论如何构建自己的云控制器管理器之前，了解有关它如何工作的一些背景知识是有帮助的。云控制器管理器是来自 `kube-controller-manager` 的代码，利用 Go 接口允许插入任何云的实现。大多数框架和通用控制器的实现在 core，但只要满足 [云提供者接口](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go#L42-L62)，它就会始终执行它所提供的云接口。

<!--
To dive a little deeper into implementation details, all cloud controller managers will import packages from Kubernetes core, the only difference being each project will register their own cloud providers by calling [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go#L56-L66) where a global variable of available cloud providers is updated.
-->
为了深入了解实施细节，所有云控制器管理器都将从 Kubernetes 核心导入依赖包，唯一的区别是每个项目都会通过调用 [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go#L56-L66) 来注册自己的驱动，更新可用驱动的全局变量。




<!-- body -->

<!--
## Developing
-->
## 开发

### Out of Tree

<!--
To build an out-of-tree cloud-controller-manager for your cloud, follow these steps:
-->
要为您的云构建一个 out-of-tree 云控制器管理器，请按照下列步骤操作：

<!--
1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go).
2. Use [main.go in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) from Kubernetes core as a template for your main.go. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52).
-->
1. 使用满足 [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go) 的实现创建一个 go 包。
2. 使用来自 Kubernetes 核心包的 [cloud-controller-manager 中的 main.go](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) 作为 main.go 的模板。如上所述，唯一的区别应该是将导入的云包。
3. 在 `main.go` 中导入你的云包，确保你的包有一个 `init` 块来运行 cloudprovider.RegisterCloudProvider。

<!--
Using existing out-of-tree cloud providers as an example may be helpful. You can find the list [here](/docs/tasks/administer-cluster/running-cloud-controller.md#examples).
-->
用现有的 out-of-tree 云驱动作为例子可能会有所帮助。你可以在这里找到 [清单](/docs/tasks/administer-cluster/running-cloud-controller.md#examples)。


### In Tree

<!--
For in-tree cloud providers, you can run the in-tree cloud controller manager as a [Daemonset](/examples/admin/cloud/ccm-example.yaml) in your cluster. See the [running cloud controller manager docs](/docs/tasks/administer-cluster/running-cloud-controller.md) for more details.
-->
对于 in-tree 驱动，您可以将 in-tree 云控制器管理器作为群集中的 [Daemonset](/examples/admin/cloud/ccm-example.yaml) 运行。有关详细信息，请参阅 [运行的云控制器管理器文档](/docs/tasks/administer-cluster/running-cloud-controller.md)。


