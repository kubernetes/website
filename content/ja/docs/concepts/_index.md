---
title: コンセプト
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

コンセプトセクションでは、Kubernetesシステムの各パーツと、Kubernetesがクラスターを表現するために使用する抽象について学びます。これはKubernetesの仕組みをより深く理解する助けとなります。

{{% /capture %}}

{{% capture body %}}

## 概要

Kubernetesを機能させるには、*Kubernetes API オブジェクト* を使用して、次のようなクラスターの *desired state* （望ましい状態）を記述します：実行したいアプリケーションやその他のワークロード、使用するコンテナイメージ、レプリカ（複製）の数、どんなネットワークやディスクリソースを利用可能にするか、等。desired sate（望ましい状態）をセットするには、Kubernetes APIを使用してオブジェクトを作成します。通常はコマンドラインインターフェイス `kubectl` を用いてKubernetes APIを操作しますが、Kubernetes APIを直接使用してクラスターと対話し、desired state（望ましい状態）を設定、または変更することもできます。

一旦desired state（望ましい状態）を設定すると、*Kubernetes コントロールプレーン* が働き、クラスターの現在の状態をdesired state（望ましい状態）に一致させます。そのためにKubernetesはさまざまなタスクを自動的に実行します。たとえば、コンテナの起動または再起動、特定アプリケーションのレプリカ数のスケーリング（増減）等です。Kubernetesコントロールプレーンは、クラスターで実行されている以下のプロセスで構成されています。

* **Kubernetes Master** ：[kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/)、[kube-scheduler](/docs/admin/kube-scheduler/)  の3プロセスの集合です。これらのプロセスはクラスター内の一つのノード上で実行されます。実行ノードはマスターノードとして指定します。
* クラスター内の個々の非マスターノードは、それぞれ2つのプロセスを実行します。
  * **[kubelet](/docs/admin/kubelet/)**, Kubernetesマスターと通信します。
  * **[kube-proxy](/docs/admin/kube-proxy/)**, 各ノードのKubernetesネットワークサービスを反映するネットワークプロキシです。

## Kubernetesオブジェクト

Kubernetesには、システムの状態を表現する次のような抽象が含まれています： デプロイ済みのコンテナ化されたアプリケーションやワークロード、関連するネットワークとディスクリソース、クラスターが何をしているかに関するその他の情報。これらの抽象は、Kubernetes APIのオブジェクトによって表現されます。詳細については、[Kubernetes Objects overview](/docs/concepts/abstractions/overview/) をご覧ください。

基本Kubernetesオブジェクトは次のとおりです。

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

上記に加え、Kubernetesにはコントローラーと呼ばれる多くの高レベルの抽象が含まれています。コントローラーは基本オブジェクトに基づいて構築され、追加の機能と便利な機能を提供します。以下が含まれます：

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetesコントロールプレーン

Kubernetesマスターや kubeletプロセスといったKubernetesコントロールプレーンのさまざまなパーツは、Kubernetesがクラスターとどのように通信するかを統制します。コントロールプレーンはシステム内のすべてのKubernetesオブジェクトの記録を保持し、それらのオブジェクトの状態を管理するために継続的制御ループを実行します。コントロールプレーンの制御ループは常にクラスターの変更に反応し、システム内のすべてのオブジェクトの実際の状態が、指定した状態に一致するように動作します。

たとえば、Kubernetes APIを使用してDeploymentオブジェクトを作成する場合、システムには新しいdesired state（望ましい状態）が提供されます。Kubernetesコントロールプレーンは、そのオブジェクトの作成を記録します。そして、要求されたアプリケーションの開始、およびクラスターノードへのスケジューリングにより指示を完遂します。このようにしてクラスターの実際の状態を望ましい状態に一致させます。

### Kubernetesマスター

Kubernetesマスターには、クラスターの望ましい状態を維持する責任があります。`kubectl` コマンドラインインターフェイスを使用するなどしてKubernetesとやり取りするとき、実際にはクラスターのKubernetesマスターと通信しています。

>「マスター」とは、クラスター状態を管理するプロセスの集合を指します。通常これらのプロセスは、すべてクラスター内の単一ノードで実行されます。このノードはマスターとも呼ばれます。マスターは、可用性と冗長性のために複製することもできます。

### Kubernetesノード

クラスターのノードは、アプリケーションとクラウドワークフローを実行するマシン（VM、物理サーバーなど）です。Kubernetesマスターは各ノードを制御します。ノードと直接対話することはほとんどありません。

#### オブジェクトメタデータ


* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

コンセプトページを追加したい場合は、
[ページテンプレートの使用](/docs/home/contribute/page-templates/)
のコンセプトページタイプとコンセプトテンプレートに関する情報を確認してください。

{{% /capture %}}
