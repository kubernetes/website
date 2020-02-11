---
reviewers:
- colemickens
- brendandburns
title: 在 Azure 上运行 Kubernetes
---

<!--
---
reviewers:
- colemickens
- brendandburns
title: Running Kubernetes on Azure
---
-->

<!--
## Azure Kubernetes Service (AKS)

The [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) offers simple
deployments for Kubernetes clusters.

For an example of deploying a Kubernetes cluster onto Azure via the Azure Kubernetes Service:

**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/zh-cn/azure/aks/intro-kubernetes)**
-->

## Azure Kubernetes 服务 (AKS)

[Azure Kubernetes 服务](https://azure.microsoft.com/zh-cn/services/kubernetes-service/)提供了简单的
Kubernetes 集群部署方式。

有关通过 Azure Kubernetes 服务将 Kubernetes 集群部署到 Azure 的示例：

**[微软 Azure Kubernetes 服务](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)**

<!--
## Custom Deployments: AKS-Engine

The core of the Azure Kubernetes Service is **open source** and available on GitHub for the community
to use and contribute to: **[AKS-Engine](https://github.com/Azure/aks-engine)**. The legacy [ACS-Engine](https://github.com/Azure/acs-engine) codebase has been deprecated in favor of AKS-engine.

AKS-Engine is a good choice if you need to make customizations to the deployment beyond what the Azure Kubernetes
Service officially supports. These customizations include deploying into existing virtual networks, utilizing multiple
agent pools, and more. Some community contributions to AKS-Engine may even become features of the Azure Kubernetes Service.

The input to AKS-Engine is an apimodel JSON file describing the Kubernetes cluster. It is similar to the Azure Resource Manager (ARM) template syntax used to deploy a cluster directly with the Azure Kubernetes Service. The resulting output is an ARM template that can be checked into source control and used to deploy Kubernetes clusters to Azure.

You can get started by following the **[AKS-Engine Kubernetes Tutorial](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/README.md)**.
-->
## 定制部署：AKS 引擎

Azure Kubernetes 服务的核心是**开源**，并且可以在 GitHub 上让社区使用和参与贡献：**[AKS 引擎](https://github.com/Azure/aks-engine)**。旧版 [ACS 引擎](https://github.com/Azure/acs-engine) 代码库已被弃用，以支持AKS-engine。

如果您需要在 Azure Kubernetes  服务正式支持的范围之外对部署进行自定义，则 AKS  引擎是一个不错的选择。这些自定义包括部署到现有虚拟网络中，利用多个代理程序池等。一些社区对 AKS 引擎的贡献甚至可能成为 Azure Kubernetes 服务的特性。

AKS 引擎的输入是一个描述 Kubernetes 集群的 apimodel JSON 文件。它和用于直接通过 Azure Kubernetes 服务部署集群的 Azure 资源管理器（ARM）模板语法相似。产生的输出是一个 ARM 模板，可以将其签入源代码管理，并使用它将 Kubernetes 集群部署到 Azure。

您可以按照 **[AKS 引擎 Kubernetes 教程](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/README.md)**开始使用。

<!--
## CoreOS Tectonic for Azure

The CoreOS Tectonic Installer for Azure is **open source** and available on GitHub for the community to use and contribute to: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.

Tectonic Installer is a good choice when you need to make cluster customizations as it is built on [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure Resource Manager (ARM) provider. This enables users to customize or integrate using familiar Terraform tooling.

You can get started using the [Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html).
-->
## 适用于 Azure 的 CoreOS Tectonic

适用于 Azure 的 CoreOS Tectonic Installer 是**开源的**，它可以让社区在 GitHub 上使用和参与贡献：**[Tectonic Installer](https://github.com/coreos/tectonic-installer)**。

当您需要进行自定义集群时，Tectonic Installer是一个不错的选择，因为它是基于 [Hashicorp 的 Terraform](https://www.terraform.io/docs/providers/azurerm/)，Azure资源管理器（ARM）提供程序构建的。这使用户可以使用熟悉的 Terraform 工具进行自定义或集成。

您可以开始使用 [在 Azure 上安装 Tectonic 指南](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html)。