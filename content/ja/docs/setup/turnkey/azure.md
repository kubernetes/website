---
title: Azure 上で Kubernetes を動かす
---

## Azure Kubernetes Service (AKS)

[Azure Kubernetes Service](https://azure.microsoft.com/ja-jp/services/kubernetes-service/) は、Kubernetes クラスタのためのシンプルなデプロイメントを提供します。

たとえば、 Azure Kubernetes Service を利用して Azure 上に Kubernetes クラスタをデプロイするには、こちらをご参照ください:

**[Microsoft Azure Kubernetes Service](https://docs.microsoft.com/ja-jp/azure/aks/intro-kubernetes)**

## デプロイメントのカスタマイズ: ACS-Engine

Azure Kubernetes Service のコア部分は **オープンソース** であり、コミュニティのために GitHub 上で公開され、利用およびコントリビュートすることができます: **[ACS-Engine](https://github.com/Azure/acs-engine)**.

ACS-Engine は、 Azure Kubernetes Service が公式にサポートしている機能を超えてデプロイメントをカスタマイズしたい場合に適した選択肢です。
既存の仮想ネットワークへのデプロイや、複数の agent pool を利用するなどのカスタマイズをすることができます。
コミュニティによる ACS-Engine へのコントリビュートが、 Azure Kubernetes Service に組み込まれる場合もあります。

ACS-Engine への入力は、Azure Kubernetes Service を使用してクラスターを直接デプロイすることに利用される ARM テンプレートの構文に似ています。
処理結果は Azure Resource Manager テンプレートとして出力され、ソース管理に組み込んだり、 Azure に Kubernetes クラスタをデプロイするために使うことができます。

**[ACS-Engine Kubernetes Walkthrough](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)** を参照して、すぐに始めることができます。

## CoreOS Tectonic for Azure

CoreOS Tectonic Installer for Azure は **オープンソース** であり、コミュニティのために GitHub 上で公開され、利用およびコントリビュートすることができます: **[Tectonic Installer](https://github.com/coreos/tectonic-installer)**.

Tectonic Installer は、 [Hashicorp が提供する Terraform](https://www.terraform.io/docs/providers/azurerm/) の Azure Resource Manager (ARM) プロバイダーを用いてクラスターをカスタマイズしたい場合に適した選択肢です。
これを利用することにより、 Terraform と親和性の高いツールを使用してカスタマイズしたり連携したりすることができます。

[Tectonic Installer for Azure Guide](https://coreos.com/tectonic/docs/latest/install/azure/azure-terraform.html) を参照して、すぐに始めることができます。
