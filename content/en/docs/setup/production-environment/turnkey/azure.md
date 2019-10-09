---
reviewers:
- colemickens
- brendandburns
title: Running Kubernetes on Azure
---

## Azure Kubernetes Service (AKS)

The [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) offers simple
deployments for Kubernetes clusters.

For an example of deploying a Kubernetes cluster onto Azure via the Azure Kubernetes Service:

**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)**

## Custom Deployments: AKS-Engine

The core of the Azure Kubernetes Service is **open source** and available on GitHub for the community
to use and contribute to: **[AKS-Engine](https://github.com/Azure/aks-engine)**. The legacy [ACS-Engine](https://github.com/Azure/acs-engine) codebase has been deprecated in favor of AKS-engine.

AKS-Engine is a good choice if you need to make customizations to the deployment beyond what the Azure Kubernetes
Service officially supports. These customizations include deploying into existing virtual networks, utilizing multiple
agent pools, and more. Some community contributions to AKS-Engine may even become features of the Azure Kubernetes Service.

The input to AKS-Engine is an apimodel JSON file describing the Kubernetes cluster. It is similar to the Azure Resource Manager (ARM) template syntax used to deploy a cluster directly with the Azure Kubernetes Service. The resulting output is an ARM template that can be checked into source control and used to deploy Kubernetes clusters to Azure.

You can get started by following the **[AKS-Engine Kubernetes Tutorial](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/README.md)**.

## CoreOS Tectonic for Azure

The CoreOS Tectonic Installer for Azure is **open source** and available on GitHub for the community to use and contribute to: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.

Tectonic Installer is a good choice when you need to make cluster customizations as it is built on [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure Resource Manager (ARM) provider. This enables users to customize or integrate using familiar Terraform tooling.

You can get started using the [Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html).
