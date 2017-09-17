---
assignees:
- janetkuo
title: 工具集
---



Kubernetes中包含了多种内建的工具，可以帮助您使用Kubernetes系统，并支持第三方工具。



#### 本地工具

kubernetes中包含了以下内建工具



##### kubectl

[`kubectl`](/docs/user-guide/kubectl/)是kubernetes的命令行工具。它控制着kubernetes的集群管理。



##### kubeadm

[`kubeadm`](/docs/getting-started-guides/kubeadm/)可以在物理、云服务器或是虚拟机(目前处于alpha）上，轻松配置安全的kubernetes集群的命令行工具。



##### kubefed

[`kubefed`](/docs/tutorials/federation/set-up-cluster-federation-kubefed/)是帮助您管理您的联邦集群的命令行工具。



##### Minikube

[`minikube`](/docs/getting-started-guides/minikube/)的目的是为了开发或者测试，在工作站上轻松运行单节点的Kubernetes集群的工具。


##### Dashboard

[Dashboard](/docs/tasks/web-ui-dashboard/),是基于web用户界面的kubernetes,允许您部署容器应用到kubernetes集群中，并对其进行故障排除，以及管理集群和其自身的资源。



#### 第三方工具

kubernetes支持有效的第三方工具。包括这些，但不限制于这些：



##### Helm

[Kubernetes Helm](https://github.com/kubernetes/helm)是一款管理预配置Kubernetes资源包工具，又名Kubernetes charts。

Helm的使用：

* 发现并使用流行的软件包作为Kubernetes Charts
* 分享您的应用到Kubernetes Charts
* 创建可重复构建的Kubernetes应用
* 智能管理您的Kubernetes manifest文件
* 管理Helm包的版本


##### Kompose

[Kompose](https://github.com/kubernetes-incubator/kompose)是一款帮助Docker Compose用户迁移到kubernetes的工具。

kompose的使用:

* 将Docker Compose文件转换为kubernetes对象
* 从本地的Docker开发到Kubernetes管理的应用
* 转换 v1、v2版本的Docker Compose`yaml`文件、以及[Distributed Application Bundles](https://docs.docker.com/compose/bundles/)

