---
reviewers:
- janetkuo
title: 工具
content_type: concept
---

<!--
reviewers:
- janetkuo
title: Tools
content_type: concept
-->

<!--
Kubernetes contains several built-in tools to help you work with the Kubernetes system.
-->
<!-- overview -->
Kubernetes 包含一些内置工具，可以帮助用户更好的使用 Kubernetes 系统。

<!-- body -->
## Kubectl

<!--
[`kubectl`](/docs/tasks/tools/install-kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.
-->
[`kubectl`](/zh/docs/tasks/tools/install-kubectl/) 是 Kubernetes 命令行工具，
可以用来操控 Kubernetes 集群。

## Kubeadm

<!--
[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).
-->
[`kubeadm`](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) 是一个命令行工具，
可以用来在物理机、云服务器或虚拟机（目前处于 alpha 阶段）
上轻松部署一个安全可靠的 Kubernetes 集群.

## Minikube

<!--
[`minikube`](https://minikube.sigs.k8s.io/docs/) is a tool that makes it
easy to run a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->
[`minikube`](https://minikube.sigs.k8s.io/docs/) 是一个可以方便用户
在其工作站点本地部署一个单节点 Kubernetes 集群的工具,用于开发和测试.

## Dashboard

<!--
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself.
-->
[`Dashboard`](/zh/docs/tasks/access-application-cluster/web-ui-dashboard/) 
是 Kubernetes 基于 Web 的用户管理界面,允许用户部署容器化应用到 Kubernetes
集群，进行故障排查以及管理集群和集群资源。

## Helm

<!--
[`Kubernetes Helm`](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.
-->
[`Kubernetes Helm`](https://github.com/kubernetes/helm) 是一个管理
预先配置完毕的 Kubernetes 资源包的工具，这里的资源在 Helm 中也被称作
Kubernetes charts。

<!--
Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->
使用 Helm：

* 查找并使用已经打包为 Kubernetes charts 的流行软件
* 分享您自己的应用作为 Kubernetes charts
* 为 Kubernetes 应用创建可重复执行的构建
* 为您的 Kubernetes 清单文件提供更智能化的管理
* 管理 Helm 软件包的发布

## Kompose

<!--
[`Kompose`](https://github.com/kubernetes/kompose) is a tool to help Docker Compose users move to Kubernetes.
-->
[`Kompose`](https://github.com/kubernetes/kompose) 一个转换工具，
用来帮助 Docker Compose 用户迁移至 Kubernetes。

<!--
Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
-->
使用 Kompose:

* 将一个 Docker Compose 文件解释成 Kubernetes 对象
* 将本地 Docker 开发 转变成通过 Kubernetes 来管理
* 转换 v1 或 v2 Docker Compose `yaml` 文件 或
  [已发布的应用程序包](https://docs.docker.com/compose/bundles/)

