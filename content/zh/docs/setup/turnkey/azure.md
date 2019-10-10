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
-->
## Azure Kubernetes Service (AKS)

<!--
The [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) offers simple
deployments for Kubernetes clusters.
-->
[Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) 为 Kubernetes 集群提供简单的部署。

<!--
For an example of deploying a Kubernetes cluster onto Azure via the Azure Kubernetes Service:
-->
通过 Azure Kubernetes Service 将 Kubernetes 集群部署到 Azure 的示例：

<!--
**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)**
-->
**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)**

<!--
## Custom Deployments: ACS-Engine
-->
## 自定义部署：ACS-Engine

<!--
The core of the Azure Kubernetes Service is **open source** and available on GitHub for the community
to use and contribute to: **[ACS-Engine](https://github.com/Azure/acs-engine)**.
-->
Azure Kubernetes 服务的核心是 **开源的** ，可在 GitHub 上获取，供社区使用和贡献：**[ACS-Engine](https://github.com/Azure/acs-engine)**。

<!--
ACS-Engine is a good choice if you need to make customizations to the deployment beyond what the Azure Kubernetes
Service officially supports. These customizations include deploying into existing virtual networks, utilizing multiple
agent pools, and more. Some community contributions to ACS-Engine may even become features of the Azure Kubernetes Service.
-->
如果您需要对 Azure Kubernetes Service 官方支持的部署进行自定义，ACS-Engine 是一个不错的选择。 这些自定义包括部署到现有网络虚拟，使用多个代理池等。一些社区对 ACS-Engine 的贡献甚至可能成为 Azure Kubernetes Service 的功能。

<!--
The input to ACS-Engine is similar to the ARM template syntax used to deploy a cluster directly with the Azure Kubernetes Service.
The resulting output is an Azure Resource Manager Template that can then be checked into source control and can then be used
to deploy Kubernetes clusters into Azure.
-->
导入 ACS-Engine 类似于用于直接使用 Azure Kubernetes Service 部署集群的 ARM 模板语法。
结果导出是 Azure 资源管理器模板，然后可以将其检入源控件，然后可以用于将 Kubernetes 集群部署到 Azure 中。

<!--
You can get started quickly by following the **[ACS-Engine Kubernetes Walkthrough](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)**.
-->
您可以按照 **[ACS-Engine Kubernetes 演练](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)** 快速入门。

<!--
## CoreOS Tectonic for Azure
-->
## Azure 上使用 CoreOS Tectonic

<!--
The CoreOS Tectonic Installer for Azure is **open source** and available on GitHub for the community to use and contribute to: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.
-->
在 Azure 上安装 CoreOS Tectonic 的程序是 **开源的** ，可在 GitHub 上获取，供社区使用和贡献：**[Tectonic Installer](https://github.com/coreos/tectonic-installer)**。

<!--
Tectonic Installer is a good choice when you need to make cluster customizations as it is built on [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure Resource Manager (ARM) provider. This enables users to customize or integrate using familiar Terraform tooling.
-->
当您需要进行集群自定义时，Tectonic Installer 是一个不错的选择，因为它是基于 [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure 资源管理器（ARM）提供程序构建的。这使用户能够使用熟悉的 Terraform 工具进行自定义或集成。

<!--
You can get started using the [Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html).
-->
您可以开始使用 [在 Azure 上安装 Tectonic 指南](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html)。
