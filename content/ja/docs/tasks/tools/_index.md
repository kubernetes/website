---
title: "ツールのインストール"
description: Kubernetesのツールをローカルのコンピューター上にセットアップします。
weight: 10
no_list: true
---

## kubectl

Kubernetesのコマンドラインツール[`kubectl`](/docs/reference/kubectl/kubectl/)を使用すると、Kubernetesクラスターに対してコマンドを実行できるようになります。
kubectlは、アプリケーションのデプロイ、クラスターリソースの調査と管理、ログの表示などに使用できます。
kubectlの操作の完全なリストを含む詳細については、[`kubectl`のリファレンスドキュメント](/ja/docs/reference/kubectl/)を参照してください。

kubectlはさまざまなLinuxプラットフォーム、macOS、Windows上にインストールできます。
下記の中から好きなオペレーティングシステムを選んでください。

- [Linux上でのkubectlのインストール](/ja/docs/tasks/tools/install-kubectl-linux)
- [macOS上でのkubectlのインストール](/ja/docs/tasks/tools/install-kubectl-macos)
- [Windows上でのkubectlのインストール](/ja/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/)を使うと、ローカルのコンピューター上でKubernetesを実行することができます。
このツールは[Docker](https://www.docker.com/)と[Podman](https://podman.io/)のどちらかのインストールが必要です。

[Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/)に、kindの起動と実行に必要なことが書かれています。

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">kindのQuick Startのガイドを見る</a>

## minikube

`kind`と同じように、[minikube](https://minikube.sigs.k8s.io/)は、Kubernetesをローカルで実行するツールです。
`minikube`はオールインワンまたはマルチノードのローカルKubernetesクラスターをパーソナルコンピューター上(Windows、macOS、Linux PCを含む)で実行することで、Kubernetesを試したり、日常的な開発作業のために利用できます。

ツールのインストールについて知りたい場合は、公式の[Get Started!](https://minikube.sigs.k8s.io/docs/start/)のガイドに従ってください。

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">minikubeのGet Started!のガイドを見る</a>

minikubeが起動したら、[サンプルアプリケーションの実行](/ja/docs/tutorials/hello-minikube/)を試すことができます。

## kubeadm

Kubernetesクラスターの作成、管理をするために{{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}}ツールを使用することができます。

最低限実行可能でセキュアなクラスタを、ユーザーフレンドリーな方法で稼働させるために必要なアクションを実行します。

[kubeadmのインストール](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)では、kubeadmをインストールする方法を示しています。
一度インストールすれば、[クラスターを作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)するために使用できます。

<a class="btn btn-primary" href="/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">kubeadmのインストールガイドを見る</a>
