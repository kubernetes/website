---
reviewers:
- colemickens
- brendandburns
title: Running Kubernetes on Azure
---

## Azure Container Service

The [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) offers simple
deployments of one of three open source orchestrators: DC/OS, Swarm, and Kubernetes clusters.

For an example of deploying a Kubernetes cluster onto Azure via the Azure Container Service:

**[Microsoft Azure Container Service - Kubernetes Walkthrough](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)**

## Custom Deployments: ACS-Engine

The core of the Azure Container Service is **open source** and available on GitHub for the community
to use and contribute to: **[ACS-Engine](https://github.com/Azure/acs-engine)**.

ACS-Engine is a good choice if you need to make customizations to the deployment beyond what the Azure Container
Service officially supports. These customizations include deploying into existing virtual networks, utilizing multiple
agent pools, and more. Some community contributions to ACS-Engine may even become features of the Azure Container Service.

The input to ACS-Engine is similar to the ARM template syntax used to deploy a cluster directly with the Azure Container Service.
The resulting output is an Azure Resource Manager Template that can then be checked into source control and can then be used
to deploy Kubernetes clusters into Azure.

You can get started quickly by following the **[ACS-Engine Kubernetes Walkthrough](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)**.

## CoreOS Tectonic for Azure

The CoreOS Tectonic Installer for Azure is **open source** and available on GitHub for the community to use and contribute to: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.

Tectonic Installer is a good choice when you need to make cluster customizations as it is built on [Hashicorp's Terraform](https://www.terraform.io/docs/providers/azurerm/) Azure Resource Manager (ARM) provider. This enables users to customize or integrate using familiar Terraform tooling.

You can get started using the [Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html).

