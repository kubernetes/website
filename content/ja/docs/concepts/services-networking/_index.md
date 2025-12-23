---
title: "Service、負荷分散とネットワーク"
weight: 60
description: >
  Kubernetesにおけるネットワークの概念とリソース。
---

## Kubernetesのネットワークモデル {#the-kubernetes-network-model}

Kubernetesのネットワークモデルは、いくつかの要素で構成されています:

* クラスター内の各[Pod](/docs/concepts/workloads/pods/)は、クラスター全体で一意のIPアドレスを取得します。

  * Podは独自のプライベートネットワーク名前空間を持ち、Pod内のすべてのコンテナで共有されます。
    同じPod内の異なるコンテナで実行されているプロセスは、`localhost`で相互に通信できます。

* _Podネットワーク_(クラスターネットワークとも呼ばれます)は、Pod間の通信を処理します。
  これにより、以下が保証されます(意図的なネットワークセグメンテーションがない限り):

  * すべてのPodは、同じ[ノード](/docs/concepts/architecture/nodes/)上にあるか、異なるノード上にあるかに関わらず、他のすべてのPodと通信できます。
    Podは、プロキシやアドレス変換(NAT)を使用せずに直接通信できます。

    Windowsでは、このルールはホストネットワークPodには適用されません。

  * ノード上のエージェント(システムデーモンやkubeletなど)は、そのノード上のすべてのPodと通信できます。

* [Service](/docs/concepts/services-networking/service/) APIは、複数のバックエンドPodによって実装されるサービスに対して、安定した(長期的な)IPアドレスまたはホスト名を提供します。
  サービスを構成する個々のPodが時間とともに変化しても、このIPアドレスやホスト名は変わりません。

  * Kubernetesは、Serviceを構成するPodに関する情報を提供するため、[EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)オブジェクトを自動的に管理します。

  * サービスプロキシ実装は、ServiceとEndpointSliceオブジェクトのセットを監視します。
    そして、オペレーティングシステムまたはクラウドプロバイダーAPIを使用してパケットをインターセプトまたは書き換えることで、サービストラフィックをバックエンドにルーティングするようデータプレーンをプログラムします。

* [Gateway](/docs/concepts/services-networking/gateway/) API(またはその前身である[Ingress](/docs/concepts/services-networking/ingress/))を使用すると、クラスター外部のクライアントからServiceにアクセスできるようになります。

  * サポートされている{{< glossary_tooltip term_id="cloud-provider">}}を使用している場合、Service APIの[`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)を使用することで、シンプルではあるものの、設定の自由度が低いクラスターイングレスの仕組みを利用することができます。

* [NetworkPolicy](/docs/concepts/services-networking/network-policies)は、Pod間、またはPodと外部との間のトラフィックを制御できる組み込みのKubernetes APIです。

古いコンテナシステムでは、異なるホスト上のコンテナ同士は自動的には通信できませんでした。
そのため、コンテナ間のリンクを明示的に作成したり、コンテナポートをホストポートにマッピングして他のホストから到達可能にしたりする必要がありました。
Kubernetesではこのような作業は不要です。
Kubernetesのネットワークモデルでは、ポート割り当て、名前解決、サービスディスカバリ、負荷分散、アプリケーション設定、マイグレーションといった観点から、Podは、VMや物理ホストと同じように扱えます。

Kubernetes本体で実装されているのは、このモデルの一部のみです。
その他の部分については、KubernetesがAPIを定義し、実際の機能は外部コンポーネントが提供します。これらのコンポーネントの一部はオプションです:

* Podネットワーク名前空間のセットアップは、[コンテナランタイムインターフェース](/docs/concepts/containers/cri/)を実装するシステムレベルのソフトウェアによって処理されます。

* Podネットワーク自体は、[Podネットワーク実装](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)によって管理されます。
  Linuxでは、ほとんどのコンテナランタイムが{{< glossary_tooltip text="コンテナネットワークインターフェース(CNI)" term_id="cni" >}}を使用してPodネットワーク実装と連携するため、これらの実装は _CNIプラグイン_ と呼ばれることがよくあります。

* Kubernetesは、{{< glossary_tooltip term_id="kube-proxy">}}と呼ばれるサービスプロキシのデフォルト実装を提供していますが、一部のPodネットワーク実装は、実装の他の部分とより密に統合された独自のサービスプロキシを使用します。

* 一般的には、NetworkPolicyもPodネットワーク実装によって実装されます(一部のシンプルなPodネットワーク実装ではNetworkPolicyを実装していない場合や、管理者がNetworkPolicyサポートなしでPodネットワークを設定する場合があります。これらの場合、APIは引き続き存在しますが、効果はありません)。

* [Gateway APIの実装](https://gateway-api.sigs.k8s.io/implementations/)は多数存在し、特定のクラウド環境に特化したもの、「ベアメタル」環境に焦点を当てたもの、より汎用的なものなどがあります。

## {{% heading "whatsnext" %}}

[アプリケーションをServiceに接続する](/docs/tutorials/services/connect-applications-service/)チュートリアルでは、実践的な例を通じてServiceとKubernetesネットワークについて学ぶことができます。

[クラスターのネットワーク](/docs/concepts/cluster-administration/networking/)では、クラスターのネットワークを設定する方法について説明し、関連する技術の概要も提供しています。
