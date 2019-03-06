---
title: Azure 上で Kubernetes を動かす
---

## Azure Kubernetes Service (AKS)

[Azure Kubernetes Service](https://azure.microsoft.com/ja-jp/services/kubernetes-service/)は、Kubernetesクラスターのためのシンプルなデプロイ機能を提供します。

Azure Kubernetes Serviceを利用してAzure上にKubernetesクラスターをデプロイする例:

**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/ja-jp/azure/aks/intro-kubernetes)**

## デプロイのカスタマイズ: ACS-Engine

Azure Kubernetes Serviceのコア部分は**オープンソース**であり、コミュニティのためにGitHub上で公開され、利用およびコントリビュートすることができます: **[ACS-Engine](https://github.com/Azure/acs-engine)**.

ACS-Engineは、Azure Kubernetes Serviceが公式にサポートしている機能を超えてデプロイをカスタマイズしたい場合に適した選択肢です。
既存の仮想ネットワークへのデプロイや、複数のagent poolを利用するなどのカスタマイズをすることができます。
コミュニティによるACS-Engineへのコントリビュートが、Azure Kubernetes Serviceに組み込まれる場合もあります。

ACS-Engineへの入力は、Azure Kubernetes Serviceを使用してクラスターを直接デプロイすることに利用されるARMテンプレートの構文に似ています。
処理結果はAzure Resource Managerテンプレートとして出力され、ソース管理に組み込んだり、AzureにKubernetesクラスターをデプロイするために使うことができます。

**[ACS-Engine Kubernetes Walkthrough](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)** を参照して、すぐに始めることができます。

## Azure上でCoreOS Tectonicを動かす

Azureで利用できるCoreOS Tectonic Installerは**オープンソース**であり、コミュニティのためにGitHub上で公開され、利用およびコントリビュートすることができます: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.

Tectonic Installerは、 [Hashicorp が提供する Terraform](https://www.terraform.io/docs/providers/azurerm/)のAzure Resource Manager(ARM)プロバイダーを用いてクラスターをカスタマイズしたい場合に適した選択肢です。
これを利用することにより、Terraformと親和性の高いツールを使用してカスタマイズしたり連携したりすることができます。

[Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html)を参照して、すぐに始めることができます。
