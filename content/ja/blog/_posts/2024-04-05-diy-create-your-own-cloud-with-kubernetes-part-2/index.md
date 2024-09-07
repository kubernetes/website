---
layout: blog
title: "DIY: Kubernetesで自分だけのクラウドを構築しよう(パート2)"
slug: diy-create-your-own-cloud-with-kubernetes-part-2
date: 2024-04-05T07:35:00+00:00
author: >
  Andrei Kvapil (Ænix)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([IDCフロンティア](https://www.idcf.jp/)),
  [Daiki Hayakawa(bells17)](https://github.com/bells17) ([3-shake](https://3-shake.com/)),
  [atoato88](https://github.com/atoato88) ([NEC](https://jpn.nec.com/index.html)),
  [Kaito Ii](https://github.com/kaitoii11) ([Hewlett Packard Enterprise](https://www.hpe.com/jp/ja/home.html))
---

Kubernetesエコシステムだけを使って自分だけのクラウドを構築する方法について、一連の記事を続けています。
[前回の記事](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)では、Talos LinuxとFlux CDをベースにした基本的なKubernetes ディストリビューションの準備方法を説明しました。
この記事では、Kubernetesにおけるさまざまな仮想化テクノロジーをいくつか紹介し、主にストレージとネットワークを中心に、Kubernetes内で仮想マシンを実行するために必要な環境を整えます。

KubeVirt、LINSTOR、Kube-OVNなどのテクノロジーについて取り上げる予定です。

しかし最初に、仮想マシンが必要な理由と、クラウドの構築にDockerコンテナを使用するだけでは不十分である理由を説明しましょう。
その理由は、コンテナが十分なレベルの分離を提供していないことにあります。
状況は年々改善されていますが、コンテナのサンドボックスから脱出してシステムの特権を昇格させる脆弱性が見つかることがよくあります。

一方、Kubernetesはもともとマルチテナントシステムとして設計されていなかったため、基本的な使用パターンでは、独立したプロジェクトや開発チームごとに別々のKubernetesクラスターを作成することが一般的です。

仮想マシンは、クラウド環境でテナント同士を分離するための主要な手段です。
仮想マシン内では、ユーザーは管理者権限でコードやプログラムを実行できますが、これは他のテナントや環境自体に影響を与えません。
つまり、仮想マシンは[ハードマルチテナンシー分離](/docs/concepts/security/multi-tenancy/#isolation)を実現し、テナント間で信頼関係がない環境でも安全に実行できます。

## Kubernetes における仮想化テクノロジー

Kubernetesの世界に仮想化をもたらすテクノロジーはいくつかありますが、[KubeVirt](https://kubevirt.io/)と[Kata Containers](https://katacontainers.io/)が最も一般的です。
ただし、これらの動作方式は異なることを理解しておく必要があります。

**Kata Containers**は、CRI(Container Runtime Interface)を実装しており、標準のコンテナを仮想マシン内で実行することで、追加の分離レベルを提供します。
ただし、これらは同一のKubernetesクラスター内で動作します。

{{< figure src="kata-containers.svg" caption="コンテナを仮想マシン内で実行することにより、Kata Containersがコンテナの分離を確保する方法を示す図" alt="コンテナを仮想マシン内で実行することにより、Kata Containersがコンテナの分離を確保する方法を示す図" >}}

KubeVirtは、Kubernetes APIを使用して従来の仮想マシンを実行できます。
KubeVirtの仮想マシンは、コンテナ内の通常のLinuxプロセスとして実行されます。
つまり、KubeVirtでは、コンテナが仮想マシン(QEMU)プロセスを実行するためのサンドボックスとして使用されます。
これは、以下の図で、KubeVirtにおける仮想マシンのライブマイグレーションの実装方法を見ると明らかです。
マイグレーションが必要な場合、仮想マシンはあるコンテナから別のコンテナに移動します。

{{< figure src="kubevirt-migration.svg" caption="KubeVirtにおいて、仮想マシンがあるコンテナから別のコンテナへライブマイグレーションする様子を示す図" alt="KubeVirtにおいて、仮想マシンがあるコンテナから別のコンテナへライブマイグレーションする様子を示す図" >}}

[Cloud-Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)を使用した軽量な仮想化を実装し、初期からCluster APIを使用した仮想Kubernetesクラスターの実行に重点を置いている代替プロジェクト[Virtink](https://github.com/smartxworks/virtink)もあります。

私たちの目標を考慮して、この分野で最も一般的なプロジェクトであるKubeVirtを使用することに決めました。
さらに、私たちはKubeVirtに関する豊富な専門知識を持ち、すでに多くの貢献をしています。

KubeVirtは[インストールが簡単](https://kubevirt.io/user-guide/operations/installation/)で、[containerDisk](https://kubevirt.io/user-guide/virtual_machines/disks_and_volumes/#containerdisk)機能を使用してすぐに仮想マシンを実行できます。
この機能により、VMイメージをコンテナイメージレジストリから直接OCIイメージとして保存および配布できます。
containerDiskを使用した仮想マシンは、Kubernetesワーカーノードやその他の状態の永続化を必要としない仮想マシンの作成に適しています。

永続データを管理するために、KubeVirtは別のツールであるContainerized Data Importer(CDI)を提供しています。
CDIを使用すると、PVCのクローンを作成し、ベースイメージからデータを取り込むことができます。
CDIは、仮想マシンの永続ボリュームを自動的にプロビジョニングする場合や、テナントKubernetesクラスターからの永続ボリューム要求を処理するために使用されるKubeVirt CSIドライバーにも必要となります。

しかし最初に、これらのデータをどこにどのように保存するかを決める必要があります。

## Kubernetes上の仮想マシン用ストレージ

CSI(Container Storage Interface)の導入により、Kubernetesと統合できる幅広いテクノロジーが利用可能になりました。
実際、KubeVirtはCSIインターフェースを完全に活用しており、仮想化のためのストレージの選択肢はKubernetes自体のストレージの選択肢と密接に連携しています。
しかし、考慮すべき細かな差異があります。
通常、標準のファイルシステムを使用するコンテナとは異なり、仮想マシンにはブロックデバイスの方が効率的です。

KubernetesのCSIインターフェースでは、ファイルシステムとブロックデバイスの両方のタイプのボリュームを要求できますが、使用しているストレージバックエンドがこれをサポートしていることを確認することが重要です。

仮想マシンにブロックデバイスを使用すると、ファイルシステムなどの追加の抽象化レイヤーが不要になるため、パフォーマンスが向上し、ほとんどの場合で _ReadWriteMany_ モードの使用が可能になります。
このモードでは、複数のノードから同時にボリュームにアクセスできるため、KubeVirtにおける仮想マシンのライブマイグレーションを有効にするための重要な機能です。

ストレージシステムは、外部または内部(ハイパーコンバージドインフラストラクチャの場合)にすることができます。
多くの場合、外部ストレージを使用するとデータが計算ノードから分離して保存されるため、システム全体の安定性が向上します。

{{< figure src="storage-external.svg" caption="計算ノードと通信する外部データストレージを示す図" alt="計算ノードと通信する外部データストレージを示す図" >}}

外部ストレージソリューションは、エンタープライズシステムでよく使用されています。
このようなストレージは、多くの場合運用を担当する外部ベンダーによって提供されるためです。
Kubernetesとの統合には、クラスターにインストールされる小さなコンポーネントであるCSIドライバーのみが関与します。
このドライバーは、このストレージにボリュームをプロビジョニングし、Kubernetesによって実行されるPodにそれらをアタッチする役割を担います。
ただし、このようなストレージソリューションは、純粋にオープンソースのテクノロジーを使用して実装することもできます。
人気のあるソリューションの1つは、[democratic-csi](https://github.com/democratic-csi/democratic-csi)ドライバーを使用した[TrueNAS](https://www.truenas.com/)です。

{{< figure src="storage-local.svg" caption="コンピュートノード上で実行されるローカルデータストレージを示す図" alt="コンピュートノード上で実行されるローカルデータストレージを示す図" >}}

一方、ハイパーコンバージドシステムは、多くの場合、ローカルストレージ(レプリケーションが不要な場合)と、[Rook/Ceph](https://rook.io/)、[OpenEBS](https://openebs.io/)、[Longhorn](https://longhorn.io/)、[LINSTOR](https://linbit.com/linstor/)などのソフトウェアデファインドストレージを使用して実装されます。
これらは、多くの場合、Kubernetesに直接インストールされます。

{{< figure src="storage-clustered.svg" caption="コンピュートノード上で実行されるクラスター化データストレージを示す図" alt="コンピュートノード上で実行されるクラスター化データストレージを示す図" >}}

ハイパーコンバージドシステムには利点があります。
たとえば、データの局所性です。
データがローカルに保存されている場合、そのデータへのアクセスは高速になります。
しかし、このようなシステムは通常、管理と保守がより難しいという欠点があります。

Ænixでは、追加の外部ストレージを購入してセットアップする必要なく使用でき、速度とリソースの利用の点で最適な、すぐに使える解決策を提供したいと考えていました。
LINSTORがその解決策となりました。
バックエンドとして業界で人気のある実績あるテクノロジーであるLVMやZFSを使用していることで、データが安全に保存されていることに自信が持てます。
DRDBベースのレプリケーションは信じられないほど高速で、少ない計算リソースしか消費しません。

Kubernetes上でLINSTORをインストールするには、PiraeusプロジェクトがKubeVirtで使用できる既製のブロックストレージをすでに提供しています。

{{< note >}}
[前回の記事](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)で説明したように、Talos Linuxを使用している場合は、必要なカーネルモジュールを事前に有効にし、[手順](https://github.com/piraeusdatastore/piraeus-operator/blob/v2/docs/how-to/talos.md)に従ってPiraeusを設定する必要があります。
{{< /note >}}

## Kubernetes上の仮想マシン用ネットワーク

Kubernetesのネットワークアーキテクチャは同じようなインターフェースであるCNIを持っているにもかかわらず、実際にはより複雑で、通常、互いに直接接続されていない多くの独立したコンポーネントで構成されています。
実際、Kubernetesのネットワークは以下に説明する4つのレイヤーに分割できます。

### ノードネットワーク (データセンターネットワーク)

ノードが相互に接続されるネットワークです。
このネットワークは通常、Kubernetesによって管理されませんが、これがないと何も機能しないため、重要なネットワークです。
実際には、ベアメタルインフラストラクチャには通常、複数のこのようなネットワークがあります。
例えば、ノード間通信用の1つ、ストレージレプリケーション用の2つ目、外部アクセス用の3つ目などです。

{{< figure src="net-nodes.svg" caption="Kubernetesのネットワーク構成におけるノードネットワーク(データセンターネットワーク)の役割を示す図" alt="Kubernetesのネットワーク構成におけるノードネットワーク(データセンターネットワーク)の役割を示す図" >}}

ノード間の物理ネットワークの相互作用の設定は、ほとんどの状況でKubernetesが既存のネットワークインフラストラクチャを利用するため、この記事の範囲を超えています。

### Podネットワーク

これは、CNIプラグインによって提供されるネットワークです。
CNIプラグインの役割は、クラスター内のすべてのコンテナとノード間の透過的な接続を確保することです。
ほとんどのCNIプラグインは、各ノードで使用するためにIPアドレスの個別のブロックが割り当てられるフラットネットワークを実装しています。

{{< figure src="net-pods.svg" caption="Kubernetesのネットワーク構成におけるPodネットワーク(CNIプラグイン)の役割を示す図" alt="Kubernetesのネットワーク構成におけるPodネットワーク(CNIプラグイン)の役割を示す図" >}}

実際には、クラスターには[Multus](https://github.com/k8snetworkplumbingwg/multus-cni)によって管理される複数のCNIプラグインを持つことができます。
このアプローチは、[Rancher](https://www.rancher.com/)や[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift/virtualization)などのKubeVirtベースの仮想化ソリューションでよく使用されます。
プライマリCNIプラグインはKubernetesサービスとの統合に使用され、追加のCNIプラグインはプライベートネットワーク(VPC)の実装やデータセンターの物理ネットワークとの統合に使用されます。

[デフォルトのCNIプラグイン](https://github.com/containernetworking/plugins/tree/main/plugins)は、ブリッジまたは物理インターフェースの接続に使用できます。
さらに、パフォーマンスを向上させるために設計された[macvtap-cni](https://github.com/kubevirt/macvtap-cni)などの専用プラグインもあります。

Kubernetes内で仮想マシンを実行する際に注意すべきもう1つの側面は、特にMultusによって提供されるセカンダリインターフェースに対するIPAM(IPアドレス管理)の必要性です。
これは通常、インフラストラクチャ内で動作するDHCPサーバーによって管理されます。
さらに、仮想マシンのMACアドレスの割り当ては、[Kubemacpool](https://github.com/k8snetworkplumbingwg/kubemacpool)によって管理できます。

私たちのプラットフォームでは、別の方法を選択し、[Kube-OVN](https://www.kube-ovn.io/)に完全に頼ることにしました。
このCNIプラグインは、もともとOpenStack用に開発されたOVN(Open Virtual Network)をベースにしています。
Kube-OVNはKubernetes内の仮想マシン用の完全なネットワークソリューションを提供します。
IPとMACアドレスを管理するためのカスタムリソースを備え、ノード間でIPアドレスを保持したままライブマイグレーションをサポートし、テナント間の物理ネットワーク分離用のVPCの作成を可能にします。

Kube-OVNでは、名前空間全体に個別のサブネットを割り当てたり、Multusを使用して追加のネットワークインターフェースとして接続したりできます。

### サービスネットワーク

CNIプラグインに加えて、Kubernetesにはサービスネットワークもあります。これは主にサービスディスカバリーに必要です。
従来の仮想マシンとは異なり、KubernetesはもともとランダムなアドレスでPodを実行するように設計されています。
そして、サービスネットワークは、トラフィックを常に正しいPodに誘導する便利な抽象化(安定したIPアドレスとDNS名)を提供します。
仮想マシンのIPは通常静的であるにもかかわらず、このアプローチはクラウド内の仮想マシンでも一般的に使用されています。

{{< figure src="net-services.svg" caption="Kubernetesのネットワーク構成におけるサービスネットワーク(サービスネットワークプラグイン)の役割を示す図" alt="Kubernetesのネットワーク構成におけるサービスネットワーク(サービスネットワークプラグイン)の役割を示す図" >}}

Kubernetesでのサービスネットワークの実装は、サービスネットワークプラグインによって処理されます。
標準の実装は**kube-proxy**と呼ばれ、ほとんどのクラスターで使用されています。
しかし最近では、この機能はCNIプラグインの一部として提供されることがあります。
最も先進的な実装は、[Cilium](https://cilium.io/)プロジェクトによって提供されており、kube-proxyの代替モードで実行できます。

CiliumはeBPFテクノロジーに基づいており、Linuxネットワークスタックを効率的にオフロードできるため、iptablesベースの従来の方法と比較してパフォーマンスとセキュリティが向上します。

実際には、CiliumとKube-OVNを簡単に[統合](https://kube-ovn.readthedocs.io/zh-cn/stable/en/advance/with-cilium/)することが可能です。
これにより、仮想マシン向けにシームレスでマルチテナントのネットワーキングを提供する統合ソリューションを実現することができます。
また、高度なネットワークポリシーと統合されたサービスネットワーク機能も提供されます。

### 外部トラフィックのロードバランサー

この段階で、Kubernetes内で仮想マシンを実行するために必要なものはすべて揃っています。
しかし、実際にはもう1つ必要なものがあります。
クラスターの外部からサービスにアクセスする必要がまだあり、外部ロードバランサーがこれを整理するのに役立ちます。

ベアメタルのKubernetesクラスターには、いくつかの利用可能なロードバランサーがあります。
[MetalLB](https://metallb.universe.tf/)、[kube-vip](https://kube-vip.io/)、[LoxiLB](https://www.loxilb.io/)があり、また[Cilium](https://docs.cilium.io/en/latest/network/lb-ipam/)と[Kube-OVN](https://kube-ovn.readthedocs.io/zh-cn/latest/en/guide/loadbalancer-service/)にはビルトインの実装が提供されています。

外部ロードバランサーの役割は、外部から利用可能な安定したアドレスを提供し、外部トラフィックをサービスネットワークに誘導することです。
サービスネットワークプラグインは、通常どおりそれをPodと仮想マシンに誘導します。

{{< figure src="net-loadbalancer.svg" caption="Kubernetesのネットワーク構成における外部ロードバランサーの役割を示す図" alt="Kubernetesのネットワーク構成における外部ロードバランサーの役割" >}}

ほとんどの場合、ベアメタル上でのロードバランサーの設定は、クラスター内のノードにフローティングIPアドレスを作成し、ARP/NDPまたはBGPプロトコルを使用してそれを外部にアナウンスすることによって実現されます。

さまざまなオプションを検討した結果、MetalLBが最もシンプルで信頼性の高いソリューションであると判断しましたが、MetalLBの使用のみを厳密に強制しているわけではありません。

もう1つの利点は、L2モードでは、MetalLBスピーカーがメンバーリストプロトコルを使用してライブネスチェックを実行することにより、ネイバーの状態を継続的にチェックすることです。
これにより、Kubernetesコントロールプレーンとは独立して機能するフェイルオーバーが可能になります。

## まとめ

ここまでが、Kubernetesにおける仮想化、ストレージ、ネットワークの概要になります。
ここで取り上げたテクノロジーは、[Cozystack](https://github.com/aenix-io/cozystack)プラットフォームで利用可能であり、制限なくお試しいただけるよう事前に設定されています。

[次の記事](/ja/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-3/)では、この上にボタンをクリックするだけで、完全に機能するKubernetesクラスターのプロビジョニングをどのように実装できるかを詳しく説明します。
