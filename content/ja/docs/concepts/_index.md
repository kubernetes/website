---
title: コンセプト
main_menu: true
content_type: concept
weight: 40
---

<!-- overview -->

本セクションは、Kubernetesシステムの各パートと、{{< glossary_tooltip text="クラスター" term_id="cluster" length="all" >}}を表現するためにKubernetesが使用する抽象概念について学習し、Kubernetesの仕組みをより深く理解するのに役立ちます。



<!-- body -->

## 概要

Kubernetesを機能させるには、*Kubernetes API オブジェクト* を使用して、実行したいアプリケーションやその他のワークロード、使用するコンテナイメージ、レプリカ(複製)の数、どんなネットワークやディスクリソースを利用可能にするかなど、クラスターの *desired state* (望ましい状態)を記述します。desired state (望ましい状態)をセットするには、Kubernetes APIを使用してオブジェクトを作成します。通常はコマンドラインインターフェース `kubectl` を用いてKubernetes APIを操作しますが、Kubernetes APIを直接使用してクラスターと対話し、desired state (望ましい状態)を設定、または変更することもできます。

一旦desired state (望ましい状態)を設定すると、Pod Lifecycle Event Generator([PLEG](https://github.com/kubernetes/design-proposals-archive/blob/main/node/pod-lifecycle-event-generator.md))を使用した*Kubernetes コントロールプレーン*が機能し、クラスターの現在の状態をdesired state (望ましい状態)に一致させます。そのためにKubernetesはさまざまなタスク(たとえば、コンテナの起動または再起動、特定アプリケーションのレプリカ数のスケーリング等)を自動的に実行します。Kubernetesコントロールプレーンは、クラスターで実行されている以下のプロセスで構成されています。

* **Kubernetes Master**: [kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/)、[kube-scheduler](/docs/admin/kube-scheduler/) の3プロセスの集合です。これらのプロセスはクラスター内の一つのノード上で実行されます。実行ノードはマスターノードとして指定します。
* クラスター内の個々の非マスターノードは、それぞれ2つのプロセスを実行します。
  * **[kubelet](/docs/admin/kubelet/)**: Kubernetes Masterと通信します。
  * **[kube-proxy](/docs/admin/kube-proxy/)**: 各ノードのKubernetesネットワークサービスを反映するネットワークプロキシです。

## Kubernetesオブジェクト {#kubernetes-objects}

Kubernetesには、デプロイ済みのコンテナ化されたアプリケーションやワークロード、関連するネットワークとディスクリソース、クラスターが何をしているかに関するその他の情報といった、システムの状態を表現する抽象が含まれています。これらの抽象は、Kubernetes APIのオブジェクトによって表現されます。詳細については、[Kubernetesオブジェクトについて知る](/ja/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)をご覧ください。

基本的なKubernetesのオブジェクトは次のとおりです。

* [Pod](/ja/docs/concepts/workloads/pods/pod-overview/)
* [Service](/ja/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/ja/docs/concepts/overview/working-with-objects/namespaces/)

Kubernetesには、[コントローラー](/ja/docs/concepts/architecture/controller/)に依存して基本オブジェクトを構築し、追加の機能と便利な機能を提供する高レベルの抽象化も含まれています。これらには以下のものを含みます:

* [Deployment](/ja/docs/concepts/workloads/controllers/deployment/)
* [DaemonSet](/ja/docs/concepts/workloads/controllers/daemonset/)
* [StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)
* [ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetesコントロールプレーン {#kubernetes-control-plane}

Kubernetesマスターや kubeletプロセスといったKubernetesコントロールプレーンのさまざまなパーツは、Kubernetesがクラスターとどのように通信するかを統制します。コントロールプレーンはシステム内のすべてのKubernetesオブジェクトの記録を保持し、それらのオブジェクトの状態を管理するために継続的制御ループを実行します。コントロールプレーンの制御ループは常にクラスターの変更に反応し、システム内のすべてのオブジェクトの実際の状態が、指定した状態に一致するように動作します。

たとえば、Kubernetes APIを使用してDeploymentを作成する場合、システムには新しいdesired state (望ましい状態)が提供されます。Kubernetesコントロールプレーンは、そのオブジェクトの作成を記録します。そして、要求されたアプリケーションの開始、およびクラスターノードへのスケジューリングにより指示を完遂します。このようにしてクラスターの実際の状態を望ましい状態に一致させます。

### Kubernetesマスター

Kubernetesのマスターは、クラスターの望ましい状態を維持する責務を持ちます。`kubectl` コマンドラインインターフェースを使用するなどしてKubernetesとやり取りするとき、ユーザーは実際にはクラスターにあるKubernetesのマスターと通信しています。

「マスター」とは、クラスター状態を管理するプロセスの集合を指します。通常これらのプロセスは、すべてクラスター内の単一ノードで実行されます。このノードはマスターとも呼ばれます。マスターは、可用性と冗長性のために複製することもできます。

### Kubernetesノード

クラスターのノードは、アプリケーションとクラウドワークフローを実行するマシン(VM、物理サーバーなど)です。Kubernetesのマスターは各ノードを制御します。運用者自身がノードと直接対話することはほとんどありません。



## {{% heading "whatsnext" %}}


コンセプトページを追加したい場合は、
[ページテンプレートの使用](/docs/home/contribute/page-templates/)
のコンセプトページタイプとコンセプトテンプレートに関する情報を確認してください。


