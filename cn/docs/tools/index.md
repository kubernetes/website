<!--
---
assignees:
- janetkuo
title: Tools
---
-->
---
assignees:
- janetkuo
title: 工具集
---

<!--
Kubernetes contains several built-in tools to help you work with the Kubernetes system, and also supports third-party tooling.
-->

Kubernetes中包含了多种内建的工具，可以帮助您使用Kubernetes系统，并支持第三方工具。

<!--
#### Native Tools

Kubernetes contains the following built-in tools:
-->

#### 本地工具

Kubernetes中包含了以下内建工具

<!--
##### Kubectl 

[`kubectl`](/docs/user-guide/kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.
-->

##### kubectl

[`kubectl`](/docs/user-guide/kubectl/)是Kubernetes的命令行工具。它控制着Kubernetes的集群管理。

<!--
##### Kubeadm 

[`kubeadm`](/docs/getting-started-guides/kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).
-->

##### kubeadm

[`kubeadm`](/docs/getting-started-guides/kubeadm/)可以在物理、云服务器或是虚拟机(目前处于alpha）上，轻松配置安全的Kubernetes集群的命令行工具。

<!--
##### Kubefed

[`kubefed`](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) is the command line tool
to help you administrate your federated clusters.
-->

##### kubefed

[`kubefed`](/docs/tutorials/federation/set-up-cluster-federation-kubefed/)是帮助您管理您的联邦集群的命令行工具。

<!--
##### Minikube

[`minikube`](/docs/getting-started-guides/minikube/) is a tool that makes it
easy to run a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->

##### Minikube

[`minikube`](/docs/getting-started-guides/minikube/)的目的是为了开发或者测试，在工作站上轻松运行单节点的Kubernetes集群的工具。
<!--
##### Dashboard 

[Dashboard](/docs/tasks/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. 
-->

##### Dashboard

[Dashboard](/docs/tasks/web-ui-dashboard/)是基于web用户界面的Kubernetes,允许您部署容器应用到Kubernetes集群中，并对其进行故障排除，以及管理集群和其自身的资源。

<!--
#### Third-Party Tools

Kubernetes supports various third-party tools. These include, but are not limited to:
-->

#### 第三方工具

Kubernetes支持有效的第三方工具。包括这些，但不限制于这些：

<!--
##### Helm

[Kubernetes Helm](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.

Use Helm to: 

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->

##### Helm

[Kubernetes Helm](https://github.com/kubernetes/helm)是一款管理预配置Kubernetes资源包工具，又名Kubernetes charts。

Helm的使用：

* 发现并使用流行的软件包作为Kubernetes Charts
* 分享您的应用到Kubernetes Charts
* 创建可重复构建的Kubernetes应用
* 智能管理您的Kubernetes manifest文件
* 管理Helm包的版本
<!--
##### Kompose 

[Kompose](https://github.com/kubernetes-incubator/kompose) is a tool to help Docker Compose users move to Kubernetes. 

Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
-->

##### Kompose

[Kompose](https://github.com/kubernetes-incubator/kompose)是一款帮助Docker Compose用户迁移到Kubernetes的工具。

Kompose的使用:

* 将Docker Compose文件转换为Kubernetes对象
* 从本地的Docker开发到Kubernetes管理的应用
* 转换 v1、v2版本的Docker Compose`yaml`文件、以及[Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

