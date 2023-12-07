---
reviewers:
title: クラスター管理の概要
content_type: concept
weight: 10
---

<!-- overview -->
このページはKubernetesクラスターの作成や管理者向けの内容です。Kubernetesのコア[コンセプト](/ja/docs/concepts/)についてある程度精通していることを前提とします。


<!-- body -->
## クラスターのプランニング

Kubernetesクラスターの計画、セットアップ、設定の例を知るには[設定](/ja/docs/setup/)のガイドを参照してください。この記事で列挙されているソリューションは*ディストリビューション* と呼ばれます。

ガイドを選択する前に、いくつかの考慮事項を挙げます。

 - ユーザーのコンピューター上でKubernetesを試したいでしょうか、それとも高可用性のあるマルチノードクラスターを構築したいでしょうか？あなたのニーズにあったディストリビューションを選択してください。
 - **もしあなたが高可用性を求める場合**、 [複数ゾーンにまたがるクラスター](/docs/concepts/cluster-administration/federation/)の設定について学んでください。
 - [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)のような**ホストされているKubernetesクラスター**を使用するのか、それとも**自分自身でクラスターをホストするのでしょうか**？
 - 使用するクラスターは**オンプレミス**なのか、それとも**クラウド(IaaS)** でしょうか？Kubernetesはハイブリッドクラスターを直接サポートしていません。その代わりユーザーは複数のクラスターをセットアップできます。
 - Kubernetesを **「ベアメタル」なハードウェア**上で稼働させますか？それとも**仮想マシン(VMs)** 上で稼働させますか？
 - **もしオンプレミスでKubernetesを構築する場合**、どの[ネットワークモデル](/ja/docs/concepts/cluster-administration/networking/)が最適か検討してください。
 - **ただクラスターを稼働させたいだけ**でしょうか、それとも**Kubernetesプロジェクトのコードの開発**を行いたいでしょうか？もし後者の場合、開発が進行中のディストリビューションを選択してください。いくつかのディストリビューションはバイナリリリースのみ使用していますが、多くの選択肢があります。
 - クラスターを稼働させるのに必要な[コンポーネント](/ja/docs/concepts/overview/components/)についてよく理解してください。

注意: 全てのディストリビューションがアクティブにメンテナンスされている訳ではありません。最新バージョンのKubernetesでテストされたディストリビューションを選択してください。

## クラスターの管理

* [ノードの管理](/ja/docs/concepts/architecture/nodes/)方法について学んでください。

* 共有クラスターにおける[リソースクォータ](/ja/docs/concepts/policy/resource-quotas/)のセットアップと管理方法について学んでください。

## クラスターをセキュアにする

* [Certificates](/ja/docs/concepts/cluster-administration/certificates/)では、異なるツールチェインを使用して証明書を作成する方法を説明します。

* [Kubernetes コンテナの環境](/ja/docs/concepts/containers/container-environment/)では、Kubernetesノード上でのKubeletが管理するコンテナの環境について説明します。

* [Kubernetes APIへのアクセス制御](/docs/concepts/security/controlling-access)では、Kubernetesで自身のAPIに対するアクセスコントロールがどのように実装されているかを説明します。

* [認証](/docs/reference/access-authn-authz/authentication/)では、様々な認証オプションを含むKubernetesでの認証について説明します。

* [認可](/docs/reference/access-authn-authz/authorization/)では、認証とは別に、HTTPリクエストの処理方法を制御します。

* [アドミッションコントローラーの使用](/docs/reference/access-authn-authz/admission-controllers/)では、認証と認可の後にKubernetes APIに対するリクエストをインターセプトするプラグインについて説明します。

* [Kubernetesクラスターでのsysctlの使用](/docs/concepts/cluster-administration/sysctl-cluster/)では、管理者向けにカーネルパラメーターを設定するため`sysctl`コマンドラインツールの使用方法について解説します。

* [クラスターの監査](/ja/docs/tasks/debug/debug-cluster/audit/)では、Kubernetesの監査ログの扱い方について解説します。

### kubeletをセキュアにする
  * [マスターとノードのコミュニケーション](/ja/docs/concepts/architecture/master-node-communication/)
  * [TLSのブートストラップ](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Kubeletの認証/認可](/docs/admin/kubelet-authentication-authorization/)

## オプションのクラスターサービス

* [DNSのインテグレーション](/ja/docs/concepts/services-networking/dns-pod-service/)では、DNS名をKubernetes Serviceに直接名前解決する方法を解説します。

* [クラスターアクティビィのロギングと監視](/docs/concepts/cluster-administration/logging/)では、Kubernetesにおけるロギングがどのように行われ、どう実装されているかについて解説します。
