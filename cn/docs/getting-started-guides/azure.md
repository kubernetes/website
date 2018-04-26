---
approvers:
- colemickens
- brendandburns
title: 在 Azure 上运行 Kubernetes
---

<!--
## Azure Container Service
-->

## Azure 容器服务

<!--
The [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) offers simple
deployments of one of three open source orchestrators: DC/OS, Swarm, and Kubernetes clusters.
-->

[Azure 容器服务](https://azure.microsoft.com/en-us/services/container-service/)支持部署三种开源协调器：DC/OS 、Swarm 和 Kubernetes 集群。

<!--
For an example of deploying a Kubernetes cluster onto Azure via the Azure Container Service:
-->

使用 Azure 容器服务在 Azure 上部署 Kubernetes 集群案例：

<!--
**[Microsoft Azure Container Service - Kubernetes Walkthrough](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)**
-->

**[微软 Azure 容器服务 - Kubernetes 部署教程](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)**

<!--
## Custom Deployments: ACS-Engine
-->

## 自定义部署: ACS-Engine

<!--
The core of the Azure Container Service is **open source** and available on GitHub for the community
to use and contribute to: **[ACS-Engine](https://github.com/Azure/acs-engine)**.
-->

Azure 容器服务的核心是**开源**的，可以在 GitHub 上使用和贡献：**[ACS-Engine](https://github.com/Azure/acs-engine)**。

<!--
ACS-Engine is a good choice if you need to make customizations to the deployment beyond what the Azure Container
Service officially supports. These customizations include deploying into existing virtual networks, utilizing multiple
agent pools, and more. Some community contributions to ACS-Engine may even become features of the Azure Container Service.
-->

如果基于 Azure 容器服务自定义部署， ACS-Engine 是不错的选择。自定义部署包括部署到现有的虚拟网络，使用多个代理池等。ACS-Engine 中的一些来自社区的贡献甚至可以成为 Azure 容器服务中的功能。

<!--
The input to ACS-Engine is similar to the ARM template syntax used to deploy a cluster directly with the Azure Container Service.
The resulting output is an Azure Resource Manager Template that can then be checked into source control and can then be used
to deploy Kubernetes clusters into Azure.
-->

对 ACS-Engine 的输入类似于用于直接使用 Azure 容器服务部署集群的 ARM 模板语法。由此产生的输出是一个 Azure 资源管理模板，然后可以迁入到源代码控制中和用来在 Azure 上部署 Kubernetes 集群。

<!--
You can get started quickly by following the **[ACS-Engine Kubernetes Walkthrough](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)**.
-->

更多内容请参考快速入门 **[ACS-Engine Kubernetes 教程](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)**。

<!--
## CoreOS Tectonic for Azure
-->

##  在 Azure 上使用 CoreOS Tectonic

<!--
The CoreOS Tectonic Installer for Azure is **open source** and available on GitHub for the community to use and contribute to: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.
-->

基于 Azure 的 CoreOS Tectonic Installer 是**开源**的，可以在 GitHub 上使用和贡献：**[Tectonic Installer](https://github.com/coreos/tectonic-installer)**。

<!--
Tectonic Installer is a good choice when you need to make cluster customizations as it is built on [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure Resource Manager (ARM) provider. This enables users to customize or integrate using familiar Terraform tooling.
-->

如果您需要对基于 [Terraform Azure Resource Manager (ARM) Provider](https://www.terraform.io/docs/providers/azurerm/) 的集群做自定义，那么 Tectonic Installer 是不错的选择。这让用户能够自定义或集成化使用熟悉的工具。

<!--
You can get started using the [Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html).
-->

更多内容请参考[基于 Azure 的 Tectonic Installer 使用指南](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html)。

