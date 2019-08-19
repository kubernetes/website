---
title: コンセプト
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

コンセプトセクションでは、Kubernetes システムの各パーツと、Kubernetes がクラスタを表現するために使用する抽象について学びます。これは Kubernetes の仕組みをより深く理解する助けとなります。

{{% /capture %}}

{{% capture body %}}

## 概要

Kubernetes を機能させるには、*Kubernetes API オブジェクト* を使用して、次のようなクラスタの *desired state* （望ましい状態）を記述します：実行したいアプリケーションやその他のワークロード、使用するコンテナイメージ、レプリカ（複製）の数、どんなネットワークやディスクリソースを利用可能にするか、等。desired sate（望ましい状態）をセットするには、Kubernetes API を使用してオブジェクトを作成します。通常はコマンドラインインターフェイス `kubectl` を用いて Kubernetes API を操作しますが、Kubernetes API を直接使用してクラスタと対話し、desired state（望ましい状態）を設定、または変更することもできます。

一旦 desired state（望ましい状態）を設定すると *Kubernetes コントロールプレーン* が働き、クラスタの現在の状態を desired state（望ましい状態）に一致させます。そのために Kubernetes はさまざまなタスクを自動的に実行します。たとえば、コンテナの起動または再起動、特定アプリケーションのレプリカ数のスケーリング（増減）等です。Kubernetes コントロールプレーンは、クラスタで実行されている以下のプロセスで構成されています。

* **Kubernetes Master** ：次に示す 3 プロセスの集合です。 [kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/)、[kube-scheduler](/docs/admin/kube-scheduler/) 。これらのプロセスはクラスタ内の一つのノード上で実行されます。実行ノードはマスターノードとして指定します。
* クラスタ内の個々の非マスターノードは、それぞれ 2 つのプロセスを実行します。
  * **[kubelet](/docs/admin/kubelet/)**, Kubernetes マスターと通信します。
  * **[kube-proxy](/docs/admin/kube-proxy/)**, 各ノードの Kubernetes ネットワークサービスを反映するネットワークプロキシです。

## Kubernetes オブジェクト

Kubernetes には、システムの状態を表現する、次のような抽象が含まれています： デプロイ済みのコンテナ化されたアプリケーションやワークロード、関連するネットワークとディスクリソース、クラスタが何をしているかに関するその他の情報。これらの抽象は、Kubernetes API のオブジェクトによって表現されます。詳細については、[Kubernetes Objects overview](/docs/concepts/abstractions/overview/) をご覧ください。

基本 Kubernetes オブジェクトは次のとおりです。

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

上記に加え、Kubernetes にはコントローラーと呼ばれる多くの高レベルの抽象が含まれています。コントローラーは基本オブジェクトに基づいて構築され、追加の機能と便利な機能を提供します。 以下が含まれます：

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetesコントロールプレーン

Kubernetes マスターや kubelet プロセスといった Kubernetes コントロールプレーンのさまざまなパーツは、Kubernetes がクラスタと、どのように通信するかを統制します。コントロールプレーンは、システム内のすべての Kubernetes オブジェクトの記録を保持し、それらのオブジェクトの状態を管理するために継続的制御ループを実行します。常に、コントロールプレーンの制御ループはクラスタの変更に反応し、システム内のすべてのオブジェクトの実際の状態が、指定した状態に一致するように動作します。

たとえば、Kubernetes API を使用して Deployment オブジェクトを作成する場合、システムには新しい desired state（望ましい状態）が提供されます。 Kubernetes コントロールプレーンは、そのオブジェクトの作成を記録します。そして、要求されたアプリケーションの開始、およびクラスタノードへのスケジューリングにより指示を完遂します。このようにしてクラスタの実際の状態を望ましい状態に一致させます。

### Kubernetesマスター

Kubernetes マスターには、クラスタの望ましい状態を維持する責任があります。`kubectl` コマンドラインインターフェイスを使用するなどして Kubernetes とやり取りするとき、実際にはクラスタの Kubernetes マスターと通信しています。

>「マスター」とは、クラスタ状態を管理するプロセスの集合を指します。通常これらのプロセスは、すべてクラスタ内の単一ノードで実行されます。このノードはマスターとも呼ばれます。マスターは、可用性と冗長性のために複製することもできます。

### Kubernetes ノード

クラスタのノードは、アプリケーションとクラウドワークフローを実行するマシン（VM、物理サーバーなど）です。 Kubernetes マスターは各ノードを制御します。ノードと直接対話することはほとんどありません。

#### オブジェクトメタデータ


* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

If you would like to write a concept page, see
[Using Page Templates](/docs/home/contribute/page-templates/)
for information about the concept page type and the concept template.

{{% /capture %}}
