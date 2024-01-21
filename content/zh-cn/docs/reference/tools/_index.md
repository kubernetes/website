---
title: 其他工具
content_type: concept
weight: 150
no_list: true
---

<!-- 
title: Other Tools
reviewers:
- janetkuo
content_type: concept
weight: 150
no_list: true
-->

<!-- overview -->
<!-- 
Kubernetes contains several tools to help you work with the Kubernetes system.
-->
Kubernetes 包含多种工具来帮助你使用 Kubernetes 系统。


<!-- body -->

<!--  
[`crictl`](https://github.com/kubernetes-sigs/cri-tools) is a command-line
interface for inspecting and debugging {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible
container runtimes.
-->
## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools)
是用于检查和调试兼容 {{<glossary_tooltip term_id="cri" text="CRI">}} 的容器运行时的命令行接口。

<!-- 
## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself.
-->
## 仪表盘   {#dashboard}

[`Dashboard`](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)，
基于 Web 的 Kubernetes 用户界面，
允许你将容器化的应用程序部署到 Kubernetes 集群，
对它们进行故障排查，并管理集群及其资源本身。

<!-- 
## Helm

[Helm](https://helm.sh/) is a tool for managing packages of pre-configured
Kubernetes resources. These packages are known as _Helm charts_.
-->
## Helm
{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/)
是一个用于管理预配置 Kubernetes 资源包的工具。这些包被称为“Helm 图表”。

<!-- 
Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->
使用 Helm 来：

* 查找和使用打包为 Kubernetes 图表的流行软件
* 将你自己的应用程序共享为 Kubernetes 图表
* 为你的 Kubernetes 应用程序创建可重现的构建
* 智能管理你的 Kubernetes 清单文件
* 管理 Helm 包的发布

<!-- 
## Kompose

[`Kompose`](https://github.com/kubernetes/kompose) is a tool to help Docker Compose users move to Kubernetes.
-->
## Kompose

[`Kompose`](https://github.com/kubernetes/kompose)
是一个帮助 Docker Compose 用户迁移到 Kubernetes 的工具。

<!-- 
Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
-->

使用 Kompose：

* 将 Docker Compose 文件翻译成 Kubernetes 对象
* 从本地 Docker 开发转到通过 Kubernetes 管理你的应用程序
* 转换 Docker Compose v1 或 v2 版本的 `yaml` 文件或[分布式应用程序包](https://docs.docker.com/compose/bundles/)

## Kui

<!--
[`Kui`](https://github.com/kubernetes-sigs/kui) is a GUI tool that takes your normal
`kubectl` command line requests and responds with graphics.
-->
[`Kui`](https://github.com/kubernetes-sigs/kui)
是一个接受你标准的 `kubectl` 命令行请求并以图形响应的 GUI 工具。

<!--
Kui takes the normal `kubectl` command line requests and responds with graphics. Instead 
of ASCII tables, Kui provides a GUI rendering with tables that you can sort.
-->
Kui 接受标准的 `kubectl` 命令行工具并以图形响应。
Kui 提供包含可排序表格的 GUI 渲染，而不是 ASCII 表格。

<!--
Kui lets you:

* Directly click on long, auto-generated resource names instead of copying and pasting
* Type in `kubectl` commands and see them execute, even sometimes faster than `kubectl` itself
* Query a {{< glossary_tooltip text="Job" term_id="job">}} and see its execution rendered
  as a waterfall diagram
* Click through resources in your cluster using a tabbed UI 
-->
Kui 让你能够：

* 直接点击长的、自动生成的资源名称，而不是复制和粘贴
* 输入 `kubectl` 命令并查看它们的执行，有时甚至比 `kubectl` 本身更快
* 查询 {{<glossary_tooltip text="Job" term_id="job">}} 并查看其执行渲染为瀑布图
* 使用选项卡式 UI 在集群中单击资源

## Minikube

<!--
[`minikube`](https://minikube.sigs.k8s.io/docs/) is a tool that
runs a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->
[`minikube`](https://minikube.sigs.k8s.io/docs/)
是一种在你的工作站上本地运行单节点 Kubernetes 集群的工具，用于开发和测试。