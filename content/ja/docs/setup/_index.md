---
no_issue: true
title: はじめに
main_menu: true
weight: 20
content_type: concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 環境について学ぶ
  - anchor: "#production-environment"
    title: 本番環境
---

<!-- overview -->

このセクションではKubernetesをセットアップして動かすための複数のやり方について説明します。

各Kubernetesソリューションはそれぞれ、メンテナンス性、セキュリティ、管理、利用可能なリソース、クラスターの運用に専門知識が必要など、異なる要件があります。

Kubernetesクラスタはローカルマシン、クラウド、オンプレのデータセンターにデプロイすることもできますし、マネージドのKubernetesクラスターを選択することもできます。複数のクラウドプロバイダーやベアメタルの環境に跨ったカスタムソリューションを選ぶことも可能です。

簡潔に言えば、学習用としても、本番環境用としてもKubernetesクラスターを作成することができます。



<!-- body -->

## 環境について学ぶ

Kubernetesについて学んでいる場合、Dockerベースのソリューションを使いましょう。これらはKubernetesコミュニティにサポートされていたり、あるいはKubernetesクラスターをローカル環境にセットアップするエコシステムを持っていたりします。

{{< table caption="Local machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes." >}}

|コミュニティ           |エコシステム     |
| ------------       | --------     |
| [Minikube](/ja/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](/docs/setup/learning-environment/kind/) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|


## 本番環境

本番環境用のソリューションを評価する際には、Kubernetesクラスター(または抽象レイヤ)の運用においてどの部分を自分で管理し、どの部分をプロバイダーに任せるのかを考慮してください。

[Certified Kubernetes](https://github.com/cncf/k8s-conformance/#certified-kubernetes)プロバイダーの一覧については、「[パートナー](https://kubernetes.io/ja/partners/#conformance)」を参照してください。


