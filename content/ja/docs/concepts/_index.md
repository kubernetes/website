---
title: コンセプト
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

本セクションは、Kubernetesの構成要素、Kubernetesがクラスターを表現するための抽象概念、更にKubernetesがどのように動いているかについて深く理解する助けになります。

{{% /capture %}}

{{% capture body %}}

## 概要

Kubernetesと連携するには、クラスタの*望ましい状態*を記述するため*APIオブジェクト*を利用します: 何のアプリケーション、またはワークロードを走らせたいか、どのコンテナイメージを使うか、レプリカの数はいくつにするか、何のネットワーク、ディスクリソースを利用可能にするか、などです。望ましい状態を、KubernetesのAPIを通じてAPIオブジェクトを作成しセットします。それは一般的にコマンドラインインターフェースである `kubectl` から実行されます。またKubernetesのAPIを直接操作し、クラスターの望ましい状態をセット、変更することも可能です。

一度望ましい状態をセットすると、*Kubernetesコントロールプレーン*がクラスターの現在の状態と望ましい状態を一致させるように動作します。そのために、Kubernetesは様々なタスクを自動的に実行します--コンテナを起動または再起動する、あるアプリケーションのレプリカ数を変更する、などがあります。Kubernetesコントロールプレーンは、あなたのクラスタ上で稼働するプロセスの集合体で構成されています:

* **Kubernetesマスター**は３つのプロセスから構成されており、クラスタ内でマスターノードと指定された単体ノード上で稼働します。これらのプロセスは: [kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/)、そして[kube-scheduler](/docs/admin/kube-scheduler/)です。

* それぞれのマスターノードではないノードでは２つのプロセスが稼働しています:
  * **[kubelet](/docs/admin/kubelet/)**、Kubernetesマスターと通信します。
  * **[kube-proxy](/docs/admin/kube-proxy/)**、Kubernetesのネットワーキングサービスを各ノードに反映させるためのネットワークプロキシです。

## Kubernetesオブジェクト

Kubernetesはシステムの状態を記述する、多数の抽象概念を持っています: デプロイされたコンテナ化されたアプリケーション、ワークロード、それらに紐付けられたネットワーク、ディスクのリソース、そして稼働しているクラスタに関するその他の情報、などです。これらの抽象概念はKubernetesAPIでオブジェクトという形で表現されます; さらなる情報は [Kubernetesオブジェクトの概要](/docs/concepts/abstractions/overview/) をご確認下さい。

基本的なKubernetesオブジェクトは下記になります:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

更に、Kubernetesはコントローラーと呼ばれるより高次元の抽象概念を持っています。コントローラーは、基本的なKubernetesオブジェクトを基礎としており、追加機能や便利な機能を提供します。下記のようなものを含んでいます:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetesコントロールプレーン

KubernetesマスターやkubeletプロセスなどのKubernetesコントロールプレーンの各部が、どのようにKubernetesがクラスタと通信するかを管理しています。コントロールプレーンがシステム内の全てのKubernetesオブジェクト情報を保持し、それらのオブジェクトの状態を管理する継続的な制御ループを走らせます。どんなときでも、コントロールプレーンで動いている制御ループはクラスタ状態の変更に反応し、実際のクラスタ状態を与えられた望ましい状態に一致させるように動きます。

例えば、KubernetesAPIを通じてDeploymentオブジェクトを作成するときは、新しい望ましい状態を指定します。Kubernetesコントロールプレーンはオブジェクトの作成情報を記録し、手順に従い必要なアプリケーションを起動、クラスタノードにスケジューリングします--こうして実際のクラスタ状態が望ましい状態と一致します。

### Kubernetesマスター

Kubernetesマスターはクラスタの望ましい状態の維持に責任を持っています。例えば`kubectl`コマンドラインインターフェースを通じてKubernetesを操作するときは、あなたのクラスタのKubernetesマスターと通信します。

> "マスター"とはクラスタの状態を管理するプロセスの集合体を指しています。通常、これらのプロセスはクラスタ内の単一ノード上で稼働しており、その単一ノードもマスターと呼ばれます。マスターもまた可用性、冗長性確保のために複製することが可能です。

### Kubernetesノード

クラスタ内のノードはアプリケーションやクラウドワークフローが稼働する機械（仮想サーバー、物理サーバー等）です。Kubernetesマスターがそれぞれのノードを管理し、あなたがKubernetesノードと直接やり取りすることはめったにありません。

#### オブジェクトメタデータ


* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

コンセプトページを書きたい場合は、[ページテンプレートの使用](/docs/contribute/style/page-templates/)を参照し、コンセプトのページタイプとコンセプトテンプレートについてご確認ください。

{{% /capture %}}
