---
layout: blog
title: "DIY: Kubernetesで自分だけのクラウドを構築しよう(パート3)"
slug: diy-create-your-own-cloud-with-kubernetes-part-3
date: 2024-04-05T07:40:00+00:00
author: >
  Andrei Kvapil (Ænix)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) (IDCフロンティア),
  [Daiki Hayakawa(bells17)](https://github.com/bells17) ([3-shake](https://3-shake.com/)),
  [atoato88](https://github.com/atoato88) ([NEC](https://jpn.nec.com/index.html))
---

Kubernetesの中でKubernetesを実行するという最も興味深いフェーズに近づいています。
この記事では、KamajiやCluster APIなどのテクノロジーとそれらのKubeVirtとの統合について説明します。

以前の議論では、[ベアメタル上でのKubernetesの準備](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)と、[Kubernetesを仮想マシン管理システムに変える方法](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-2)について説明しました。
この記事では、上記のすべてを使用して、本格的な管理対象のKubernetesを構築し、ワンクリックで仮想Kubernetesクラスターを実行する方法を説明して、シリーズを締めくくります。

まず、Cluster APIについて詳しく見ていきましょう。

## Cluster API

Cluster APIは、Kubernetesの拡張機能で、別のKubernetesクラスター内でカスタムリソースとしてKubernetesクラスターを管理できるようにするものです。

Cluster APIの主な目的は、Kubernetesクラスターの基本的なエンティティを記述し、そのライフサイクルを管理するための統一されたインターフェースを提供することです。
これにより、クラスターの作成、更新、削除のプロセスを自動化し、スケーリングとインフラストラクチャの管理を簡素化できます。

Cluster APIのコンテキストでは、**管理クラスター**と**テナントクラスター**の2つの用語があります。

- **管理クラスター**は、他のクラスターのデプロイと管理に使用されるKubernetesクラスターです。
このクラスターには、必要なすべてのCluster APIコンポーネントが含まれており、テナントクラスターの記述、作成、更新を担当します。多くの場合、この目的でのみ使用されます。
- **テナントクラスター**は、ユーザークラスターまたはCluster APIを使用してデプロイされたクラスターです。
これらは、管理クラスターで関連するリソースを記述することで作成されます。その後、エンドユーザーがアプリケーションとサービスをデプロイするために使用されます。

テナントクラスターは、物理的に管理クラスターと同じインフラストラクチャ上で実行する必要は必ずしもないことを理解することが重要です。
むしろ多くの場合、それらは別の場所で実行されています。

{{< figure src="clusterapi1.svg" caption="Cluster APIを使用した管理KubernetesクラスターとテナントKubernetesクラスターの相互作用を示す図" alt="Cluster APIを使用した管理KubernetesクラスターとテナントKubernetesクラスターの相互作用を示す図" >}}

Cluster APIは、その動作のために _プロバイダー_ の概念を利用します。
プロバイダーは、作成されるクラスターの特定のコンポーネントを担当する個別のコントローラーです。
Cluster API内にはいくつかの種類のプロバイダーがあります。
主なものは次のとおりです。

- **インフラストラクチャプロバイダー**: 仮想マシンや物理サーバーなどのコンピューティングインフラストラクチャを提供する役割を担います。
- **コントロールプレーンプロバイダー**: kube-apiserver、kube-scheduler、kube-controller-managerなどのKubernetesコントロールプレーンを提供します。
- **ブートストラッププロバイダー**: 作成される仮想マシンやサーバー用のcloud-init設定の生成に使用されます。

始めるには、Cluster API自体と各種プロバイダーを1つずつインストールする必要があります。
サポートされているプロバイダーの完全なリストはプロジェクトの[ドキュメント](https://cluster-api.sigs.k8s.io/reference/providers.html)で確認できます。

インストールには`clusterctl`ユーティリティや、より宣言的な方法として[Cluster API Operator](https://github.com/kubernetes-sigs/cluster-api-operator)を使用できます。

## プロバイダーの選択

### インフラストラクチャプロバイダー

KubeVirtを使用してKubernetesクラスターを実行するには[KubeVirt Infrastructure Provider](https://github.com/kubernetes-sigs/cluster-api-provider-kubevirt)をインストールする必要があります。
これにより、Cluster APIが動作する管理クラスターと同じ場所で、ワーカーノード用の仮想マシンをデプロイできるようになります。

### コントロールプレーンプロバイダー

[Kamaji](https://github.com/clastix/kamaji)プロジェクトは、管理クラスター内のコンテナとしてテナントクラスターのKubernetesコントロールプレーンを実行するためのソリューションを提供しています。
このアプローチには、いくつかの重要な利点があります。

- **費用対効果**: コントロールプレーンをコンテナで実行することで、クラスターごとに個別のコントロールプレーンノードを使用する必要がなくなり、インフラストラクチャのコストを大幅に削減できます。
- **安定性**: 複雑な多層デプロイメント方式を排除することでアーキテクチャを簡素化できます。
仮想マシンを順次起動してからその中にetcdとKubernetesコンポーネントをインストールするのではなく、Kubernetes内で通常のアプリケーションとしてデプロイおよび実行され、オペレーターによって管理されるシンプルなコントロールプレーンがあります。
- **セキュリティ**: クラスターのコントロールプレーンはエンドユーザーから隠されており、そのコンポーネントが侵害される可能性を減らし、クラスターの証明書ストアへのユーザーアクセスを排除します。ユーザーに見えないコントロールプレーンを構成するこのアプローチは、クラウドプロバイダーによって頻繁に使用されています。

### ブートストラッププロバイダー

[Kubeadm](https://github.com/kubernetes-sigs/cluster-api/tree/main/bootstrap)をブートストラッププロバイダーとして使用します。
これは、Cluster APIでクラスターを準備するための標準的な方法です。
このプロバイダーは、Cluster API自体の一部として開発されています。kubeletとkubeadmがインストールされた準備済みのシステムイメージのみが必要で、cloud-initとignitionの形式でコンフィグを生成できます。

Talos LinuxもCluster API経由でのプロビジョニングをサポートしており、そのための[プロバイダー](https://github.com/siderolabs/cluster-api-bootstrap-provider-talos)が[用意されている](https://github.com/siderolabs/cluster-api-bootstrap-provider-talos)ことは注目に値します。
[前回の記事](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)では、ベアメタルノードで管理クラスターをセットアップするためにTalos Linuxを使用する方法について説明しましたが、テナントクラスターをプロビジョニングするには、Kamaji+Kubeadmのアプローチの方が優れています。
コンテナへのKubernetesコントロールプレーンのデプロイを容易にするため、コントロールプレーンインスタンス用に個別の仮想マシンを用意する必要無くなります。
これにより、管理が簡素化され、コストが削減されます。

## 動作の仕組み

Cluster APIの主要なオブジェクトはClusterリソースで、他のすべてのリソースの親となります。
通常、このリソースは他の2つのリソースを参照します。
**コントロールプレーン**を記述するリソースと**インフラストラクチャ**を記述するリソースです。
それぞれが個別のプロバイダーによって管理されます。

Clusterとは異なり、これら2つのリソースは標準化されておらず、そのリソースの種類は使用している特定のプロバイダーに依存します。

{{< figure src="clusterapi2.svg" caption="Cluster APIにおけるClusterリソースとそれがリンクするリソースの関係を示す図" alt="Cluster APIにおけるClusterリソースとそれがリンクするリソースの関係を示す図" >}}

Cluster APIには、MachineDeploymentという名前のリソースもあります。
これは物理サーバーか仮想マシンかにかかわらずノードのグループを記述するものです。
このリソースは、Deployment、ReplicaSet、Podなどの標準のKubernetesリソースと同様に機能し、ノードのグループを宣言的に記述し、自動的にスケーリングするためのメカニズムを提供します。

つまり、MachineDeploymentリソースを使用すると、クラスターのノードを宣言的に記述でき、指定されたパラメーターと要求されたレプリカ数に応じて、ノードの作成、削除、更新を自動化できます。

{{< figure src="machinedeploymentres.svg" caption="Cluster APIにおけるMachineDeploymentリソースとその子リソースの関係を示す図" alt="Cluster APIにおけるClusterリソースとその子リソースの関係を示す図" >}}

マシンを作成するために、MachineDeploymentは、マシン自体を生成するためのテンプレートと、そのcloud-init設定を生成するためのテンプレートを参照します。

{{< figure src="clusterapi3.svg" caption="Cluster APIにおけるMachineDeploymentリソースとそれがリンクするリソースの関係を示す図" alt="Cluster APIにおけるClusterリソースとそれがリンクするリソースの関係を示す図" >}}

Cluster APIを使用して新しいKubernetesクラスターをデプロイするには、以下のリソースのセットを準備する必要があります。

- 一般的なClusterリソース
- Kamajiが運用するコントロールプレーンを担当するKamajiControlPlaneリソース
- KubeVirt内のクラスター設定を記述するKubevirtClusterリソース
- 仮想マシンテンプレートを担当するKubevirtMachineTemplateリソース
- トークンとcloud-initの生成を担当するKubeadmConfigTemplateリソース
- いくつかのワーカーを作成するための少なくとも1つのMachineDeployment

## クラスターの仕上げ

ほとんどの場合これで十分ですが、使用するプロバイダーによっては、他のリソースも必要になる場合があります。
プロバイダーの種類ごとに作成されるリソースの例は、[Kamajiプロジェクトのドキュメント](https://github.com/clastix/cluster-api-control-plane-provider-kamaji?tab=readme-ov-file#-supported-capi-infrastructure-providers)で確認できます。

この段階ですでに使用可能なテナントKubernetesクラスターができていますが、これまでのところ、APIワーカーとあらゆるKubernetesクラスターのインストールに標準で含まれるいくつかのコアプラグイン(**kube-proxy**と**CoreDNS**)しか含まれていません。
完全に統合するには、さらにいくつかのコンポーネントをインストールする必要があります。

追加のコンポーネントをインストールするには、個別の[Cluster API Add-on Provider for Helm](https://github.com/kubernetes-sigs/cluster-api-addon-provider-helm)や、[前の記事](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)で説明した[FluxCD](https://fluxcd.io/)を使用できます。

FluxCDでリソースを作成する際、Cluster APIによって生成されたkubeconfigを参照することでターゲットクラスターを指定できます。
そうするとインストールは直接そのクラスターに対して実行されます。
このように、FluxCDは管理クラスターとユーザーテナントクラスターの両方でリソースを管理するための汎用ツールになります。

{{< figure src="fluxcd.svg" caption="管理クラスターとテナントKubernetesクラスターの両方にコンポーネントをインストールできるfluxcdの相互作用スキームを示す図" alt="管理クラスターとテナントKubernetesクラスターの両方にコンポーネントをインストールできるfluxcdの相互作用スキームを示す図" >}}

ここで議論されているコンポーネントとは何でしょうか？一般的に、そのセットには以下が含まれます。

### CNIプラグイン

テナントKubernetesクラスター内のPod間の通信を確保するには、CNIプラグインをデプロイする必要があります。
このプラグインは、Pod同士が相互に通信できるようにする仮想ネットワークを作成し、従来はクラスターのワーカーノード上にDaemonsetとしてデプロイされます。
適切だと思うCNIプラグインを選んでインストールできます。

{{< figure src="components1.svg" caption="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスター内にインストールされたCNIプラグインを示す図" alt="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスター内にインストールされたCNIプラグインを示す図" >}}

### クラウドコントローラーマネージャー

この一部レスポンスについては、以下のようにMarkdown記法を修正するのが良いと思います。

クラウドコントローラーマネージャー(CCM)の主な役割は、Kubernetes をクラウドインフラストラクチャプロバイダーの環境(この場合は、テナントKubernetesのすべてのワーカーがプロビジョニングされている管理Kubernetesクラスター)と統合することです。
CCMが実行するタスクは次のとおりです。

1. LoadBalancer タイプのサービスが作成されると、CCM はクラウドロードバランサーの作成プロセスを開始します。これにより、トラフィックが Kubernetes クラスターに誘導されます。
2. クラウドインフラストラクチャからノードが削除された場合、CCM はクラスターからもそのノードを確実に削除し、クラスターの現在の状態を維持します。
3. CCM を使用する場合、ノードは特別な taint (`node.cloudprovider.kubernetes.io/uninitialized`) を付けてクラスターに追加されます。これにより、必要に応じて追加のビジネスロジックを処理できます。初期化が正常に完了すると、この taint がノードから削除されます。

クラウドプロバイダーによっては、CCM がテナントクラスターの内部と外部の両方で動作する場合があります。

[KubeVirt Cloud Provider](https://github.com/kubevirt/cloud-provider-kubevirt)は、外部の親管理クラスターにインストールするように設計されています。
したがって、テナントクラスターでLoadBalancerタイプのサービスを作成すると親クラスターでLoadBalancerサービスの作成が開始され、トラフィックがテナントクラスターに誘導されます。

{{< figure src="components2.svg" caption="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの外部にインストールされたCloud Controller Managerと、それが管理する親から子へのKubernetesクラスター間のサービスのマッピングを示す図" alt="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの外部にインストールされたCloud Controller Managerと、それが管理する親から子へのKubernetesクラスター間のサービスのマッピングを示す図" >}}

### CSIドライバー

Container Storage Interface(CSI)は、Kubernetesでストレージを操作するために、2つの主要な部分に分かれています。

- **csi-controller**: このコンポーネントは、クラウドプロバイダーのAPIと対話して、ボリュームの作成、削除、アタッチ、デタッチ、およびサイズ変更を行う責任があります。
- **csi-node**: このコンポーネントは各ノードで実行され、kubeletから要求されたPodへのボリュームのマウントを容易にします。

[KubeVirt CSI Driver](https://github.com/kubevirt/csi-driver)を使用するコンテキストでは、ユニークな機会が生まれます。
KubeVirtの仮想マシンは管理KubernetesクラスターでKubernetesのフル機能のAPIが利用できる環境で実行されるため、ユーザーのテナントクラスターの外部でcsi-controllerを実行する道が開かれます。
このアプローチはKubeVirtコミュニティで人気があり、いくつかの重要な利点があります。

- **セキュリティ**: この方法では、エンドユーザーからクラウドの内部APIを隠し、Kubernetesインターフェースを介してのみリソースへのアクセスを提供します。これにより、ユーザークラスターから管理クラスターへの直接アクセスのリスクが軽減されます。
- **シンプルさと利便性**: ユーザーは自分のクラスターで追加のコントローラーを管理する必要がないため、アーキテクチャが簡素化され、管理の負担が軽減されます。

ただし、csi-nodeは、各ノードのkubeletと直接やり取りするため、必然的にテナントクラスター内で実行する必要があります。
このコンポーネントは、Podへのボリュームのマウントとマウント解除を担当し、クラスターノードで直接発生するプロセスとの緊密な統合が必要です。

KubeVirt CSIドライバーは、ボリュームの要求のためのプロキシとして機能します。
テナントクラスター内でPVCが作成されると、管理クラスターにPVCが作成され、作成されたPVが仮想マシンに接続されます。

{{< figure src="components3.svg" caption="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの内部と外部の両方にインストールされたCSIプラグインのコンポーネントと、それが管理する親から子へのKubernetesクラスター間の永続ボリュームのマッピングを示す図" alt="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの内部と外部の両方にインストールされたCSIプラグインのコンポーネントと、それが管理する親から子へのKubernetesクラスター間の永続ボリュームのマッピングを示す図" >}}

### クラスターオートスケーラー

[クラスターオートスケーラー](https://github.com/kubernetes/autoscaler)は、さまざまなクラウドAPIと連携できる汎用的なコンポーネントであり、Cluster APIとの統合は利用可能な機能の1つに過ぎません。
適切に設定するには、2つのクラスターへのアクセスが必要です。
テナントクラスターではPodを追跡し、新しいノードを追加する必要性を判断し、管理するKubernetesクラスター(管理Kubernetesクラスター)ではMachineDeploymentリソースと対話し、レプリカ数を調整します。

Cluster Autoscalerは通常テナントKubernetesクラスター内で実行されますが、今回のケースでは、前述と同じ理由からクラスター外にインストールすることをお勧めします。
このアプローチは、テナントクラスターのユーザーが管理クラスターの管理APIにアクセスできないようにするため、メンテナンスがより簡単で、より安全です。

{{< figure src="components4.svg" caption="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの外部にインストールされたCluster Autoscalerを示す図" alt="ネストされたKubernetesクラスターのスキームにおいて、テナントKubernetesクラスターの外部にインストールされたCloud Controller Managerを示す図" >}}

### Konnectivity

もう1つ追加のコンポーネントについて言及したいと思います。
[Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/)です。
後でテナントKubernetesクラスターでwebhookとAPIアグリゲーションレイヤーを動作させるために、おそらくこれが必要になるでしょう。
このトピックについては、私の[以前の記事](/blog/2021/12/22/kubernetes-in-kubernetes-and-pxe-bootable-server-farm/#webhooks-and-api-aggregation-layer)で詳しく説明しています。

上記のコンポーネントとは異なり、Kamajiでは、Konnectivityを簡単に有効にし、kube-proxyやCoreDNSと並んで、テナントクラスターのコアコンポーネントの1つとして管理できます。

## まとめ

これで、動的スケーリング、ボリュームの自動プロビジョニング、ロードバランサーの機能を備えた、完全に機能するKubernetesクラスターができました。

今後は、テナントクラスターからのメトリクスやログの収集を検討するとよいでしょうが、それはこの記事の範囲を超えています。

もちろん、Kubernetesクラスターをデプロイするために必要なコンポーネントはすべて、1つのHelmチャートにパッケージ化し、統一されたアプリケーションとしてデプロイできます。
これは、オープンなPaaSプラットフォームである[Cozystack](https://cozystack.io/)で、ボタンをクリックするだけで管理対象のKubernetesクラスターのデプロイを整理する方法そのものです。
Cozystackでは、記事で説明したすべてのテクノロジーを無料で試すことができます。
