---
title: KubernetesのWindowsサポート概要
content_type: concept
weight: 65
---

<!-- overview -->

Windowsアプリケーションは、多くの組織で実行されているサービスやアプリケーションの大部分を占めています。[Windowsコンテナ](https://aka.ms/windowscontainers)は、プロセスとパッケージの依存関係を一つにまとめる最新の方法を提供し、DevOpsプラクティスの使用とWindowsアプリケーションのクラウドネイティブパターンの追求を容易にします。Kubernetesは事実上、標準的なコンテナオーケストレータになりました。Kubernetes 1.14のリリースでは、Kubernetesクラスター内のWindowsノードでWindowsコンテナをスケジューリングする本番環境サポートが含まれたので、Windowsアプリケーションの広大なエコシステムにおいて、Kubernetesを有効的に活用できます。WindowsベースのアプリケーションとLinuxベースのアプリケーションに投資している組織は、ワークロードを管理する個別のオーケストレーターが不要となるため、オペレーティングシステムに関係なくアプリケーション全体の運用効率が向上します。



<!-- body -->

## KubernetesのWindowsコンテナ

KubernetesでWindowsコンテナのオーケストレーションを有効にする方法は、既存のLinuxクラスターにWindowsノードを含めるだけです。Kubernetesの{{< glossary_tooltip text="Pods" term_id="pod" >}}でWindowsコンテナをスケジュールすることは、Linuxベースのコンテナをスケジュールするのと同じくらいシンプルで簡単です。

Windowsコンテナを実行するには、Kubernetesクラスターに複数のオペレーティングシステムを含める必要があります。コントロールプレーンノードはLinux、ワーカーノードはワークロードのニーズに応じてWindowsまたはLinuxで実行します。Windows Server 2019は、サポートされている唯一のWindowsオペレーティングシステムであり、Windows (kubelet、[コンテナランタイム](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/containerd)、kube-proxyを含む)で[Kubernetesノード](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)を有効にします。Windowsディストリビューションチャンネルの詳細については、[Microsoftのドキュメント](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19)を参照してください。

{{< note >}}
[マスターコンポーネント](/ja/docs/concepts/overview/components/)を含むKubernetesコントロールプレーンは、Linuxで実行し続けます。WindowsのみのKubernetesクラスターを導入する計画はありません。
{{< /note >}}
{{< note >}}
このドキュメントでは、Windowsコンテナについて説明する場合、プロセス分離のWindowsコンテナを意味します。[Hyper-V分離](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)のWindowsコンテナは、将来リリースが計画されています。
{{< /note >}}

## サポートされている機能と制限

### サポートされている機能

#### コンピュート

APIとkubectlの観点から見ると、WindowsコンテナはLinuxベースのコンテナとほとんど同じように動作します。ただし、制限セクションで概説されている主要な機能には、いくつかの顕著な違いがあります。

オペレーティングシステムのバージョンから始めましょう。KubernetesのWindowsオペレーティングシステムのサポートについては、次の表を参照してください。単一の混成Kubernetesクラスターは、WindowsとLinuxの両方のワーカーノードを持つことができます。WindowsコンテナはWindowsノードで、LinuxコンテナはLinuxノードでスケジュールする必要があります。

| Kubernetes バージョン | ホストOS バージョン (Kubernetes ノード) | | |
| --- | --- | --- | --- |
| | *Windows Server 1709* | *Windows Server 1803* | *Windows Server 1809/Windows Server 2019* |
| *Kubernetes v1.14* | サポートされていません | サポートされていません| Windows Server containers Builds 17763.* と Docker EE-basic 18.09 がサポートされています |

{{< note >}}
すべてのWindowsユーザーがアプリのオペレーティングシステムを頻繁に更新することは望んでいません。アプリケーションのアップグレードは、クラスターに新しいノードをアップグレードまたは導入することを要求する必要があります。Kubernetesで実行されているコンテナのオペレーティングシステムをアップグレードすることを選択したユーザーには、新しいオペレーティングシステムバージョンのサポート追加時に、ガイダンスと段階的な指示を提供します。このガイダンスには、クラスターノードと共にアプリケーションをアップグレードするための推奨アップグレード手順が含まれます。Windowsノードは、現在のLinuxノードと同じように、Kubernetes[バージョンスキューポリシー](/ja/docs/setup/release/version-skew-policy/)(ノードからコントロールプレーンのバージョン管理)に準拠しています。
{{< /note >}}
{{< note >}}
Windows Serverホストオペレーティングシステムには、[Windows Server](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)ライセンスが適用されます。Windowsコンテナイメージには、[Windowsコンテナの追加ライセンス条項](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula)ライセンスが提供されます。
{{< /note >}}
{{< note >}}
プロセス分離のWindowsコンテナには、[ホストOSのバージョンはコンテナのベースイメージのOSバージョンと一致する必要がある](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility)という厳格な互換性ルールがあります。KubernetesでHyper-V分離のWindowsコンテナをサポートする際には、制限と互換性ルールが変更されます。
{{< /note >}}

Kubernetesの主要な要素は、WindowsでもLinuxと同じように機能します。このセクションでは、主要なワークロードイネーブラーのいくつかと、それらがWindowsにどのようにマップされるかについて説明します。

* [Pods](/ja/docs/concepts/workloads/pods/)

    Podは、Kubernetesにおける最も基本的な構成要素です。人間が作成またはデプロイするKubernetesオブジェクトモデルの中で最小かつ最もシンプルな単位です。WindowsとLinuxのコンテナを同じPodにデプロイすることはできません。Pod内のすべてのコンテナは、各ノードが特定のプラットフォームとアーキテクチャを表す単一のノードにスケジュールされます。次のPod機能、プロパティ、およびイベントがWindowsコンテナでサポートされています。:

  * プロセス分離とボリューム共有を備えたPodごとの単一または複数のコンテナ
  * Podステータスフィールド
  * ReadinessとLiveness Probe
  * postStartとpreStopコンテナのライフサイクルイベント
  * 環境変数またはボリュームとしてのConfigMap、 Secrets
  * EmptyDir
  * 名前付きパイプホストマウント
  * リソース制限
* [Controllers](/ja/docs/concepts/workloads/controllers/)

    Kubernetesコントローラは、Podの望ましい状態を処理します。次のワークロードコントローラーは、Windowsコンテナでサポートされています。:

  * ReplicaSet
  * ReplicationController
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
* [Services](/ja/docs/concepts/services-networking/service/)

    Kubernetes Serviceは、Podの論理セットとPodにアクセスするためのポリシーを定義する抽象概念です。マイクロサービスと呼ばれることもあります。オペレーティングシステム間の接続にServiceを使用できます。WindowsでのServiceは、次のタイプ、プロパティと機能を利用できます。:

  * サービス環境変数
  * NodePort
  * ClusterIP
  * LoadBalancer
  * ExternalName
  * Headless services

Pod、Controller、Serviceは、KubernetesでWindowsワークロードを管理するための重要な要素です。ただし、それだけでは、動的なクラウドネイティブ環境でWindowsワークロードの適切なライフサイクル管理を可能にするのに十分ではありません。次の機能のサポートを追加しました：

* Podとコンテナのメトリクス
* Horizontal Pod Autoscalerサポート
* kubectl Exec
* リソースクォータ
* Schedulerのプリエンプション

#### コンテナランタイム

##### Docker EE

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Docker EE-basic 18.09+は、Kubernetesを実行しているWindows Server 2019 / 1809ノードに推奨されるコンテナランタイムです。kubeletに含まれるdockershimコードで動作します。

##### CRI-ContainerD

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

ContainerDはLinux上のKubernetesで動作するOCI準拠のランタイムです。Kubernetes v1.18では、Windows上での{{< glossary_tooltip term_id="containerd" text="ContainerD" >}}のサポートが追加されています。Windows上でのContainerDの進捗状況は[enhancements#1001](https://github.com/kubernetes/enhancements/issues/1001)で確認できます。

{{< caution >}}

Kubernetes v1.18におけるWindows上でのContainerDは以下の既知の欠点があります:

* ContainerDは公式リリースではWindowsをサポートしていません； Kubernetesでのすべての開発はアクティブなContainerD開発ブランチに対して行われています。本番環境へのデプロイはつねに、完全にテストされセキュリティ修正をサポートした公式リリースを利用するべきです。
* ContainerDを利用した場合、Group Managed Service Accountsは実装されていません。詳細は[containerd/cri#1276](https://github.com/containerd/cri/issues/1276)を参照してください。

{{< /caution >}}


#### 永続ストレージ

Kubernetes[ボリューム](/docs/concepts/storage/volumes/)を使用すると、データの永続性とPodボリュームの共有要件を備えた複雑なアプリケーションをKubernetesにデプロイできます。特定のストレージバックエンドまたはプロトコルに関連付けられた永続ボリュームの管理には、ボリュームのプロビジョニング/プロビジョニング解除/サイズ変更、Kubernetesノードへのボリュームのアタッチ/デタッチ、およびデータを永続化する必要があるPod内の個別のコンテナへのボリュームのマウント/マウント解除などのアクションが含まれます。特定のストレージバックエンドまたはプロトコルに対してこれらのボリューム管理アクションを実装するコードは、Kubernetesボリューム[プラグイン](/docs/concepts/storage/volumes/#types-of-volumes)の形式で出荷されます。次の幅広いクラスのKubernetesボリュームプラグインがWindowsでサポートされています。:

##### In-treeボリュームプラグイン
In-treeボリュームプラグインに関連付けられたコードは、コアKubernetesコードベースの一部として提供されます。In-treeボリュームプラグインのデプロイでは、追加のスクリプトをインストールしたり、個別のコンテナ化されたプラグインコンポーネントをデプロイしたりする必要はありません。これらのプラグインは、ストレージバックエンドでのボリュームのプロビジョニング/プロビジョニング解除とサイズ変更、Kubernetesノードへのボリュームのアタッチ/アタッチ解除、Pod内の個々のコンテナーへのボリュームのマウント/マウント解除を処理できます。次のIn-treeプラグインは、Windowsノードをサポートしています。:

* [awsElasticBlockStore](/docs/concepts/storage/volumes/#awselasticblockstore)
* [azureDisk](/docs/concepts/storage/volumes/#azuredisk)
* [azureFile](/docs/concepts/storage/volumes/#azurefile)
* [gcePersistentDisk](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [vsphereVolume](/docs/concepts/storage/volumes/#vspherevolume)

##### FlexVolume Plugins
[FlexVolume](/docs/concepts/storage/volumes/#flexVolume)プラグインに関連付けられたコードは、ホストに直接デプロイする必要があるout-of-treeのスクリプトまたはバイナリとして出荷されます。FlexVolumeプラグインは、Kubernetesノードとの間のボリュームのアタッチ/デタッチ、およびPod内の個々のコンテナとの間のボリュームのマウント/マウント解除を処理します。FlexVolumeプラグインに関連付けられた永続ボリュームのプロビジョニング/プロビジョニング解除は、通常FlexVolumeプラグインとは別の外部プロビジョニング担当者を通じて処理できます。次のFlexVolume[プラグイン](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)は、Powershellスクリプトとしてホストにデプロイされ、Windowsノードをサポートします:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

##### CSIプラグイン

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

{{< glossary_tooltip text="CSI" term_id="csi" >}}プラグインに関連付けられたコードは、通常、コンテナイメージとして配布され、DaemonSetやStatefulSetなどの標準のKubernetesコンポーネントを使用してデプロイされるout-of-treeのスクリプトおよびバイナリとして出荷されます。CSIプラグインは、ボリュームのプロビジョニング/プロビジョニング解除/サイズ変更、Kubernetesノードへのボリュームのアタッチ/ボリュームからのデタッチ、Pod内の個々のコンテナへのボリュームのマウント/マウント解除、バックアップ/スナップショットとクローニングを使用した永続データのバックアップ/リストアといった、Kubernetesの幅広いボリューム管理アクションを処理します。CSIプラグインは通常、ノードプラグイン（各ノードでDaemonSetとして実行される）とコントローラープラグインで構成されます。

CSIノードプラグイン（特に、ブロックデバイスまたは共有ファイルシステムとして公開された永続ボリュームに関連付けられているプラ​​グイン）は、ディスクデバイスのスキャン、ファイルシステムのマウントなど、さまざまな特権操作を実行する必要があります。これらの操作は、ホストオペレーティングシステムごとに異なります。Linuxワーカーノードの場合、コンテナ化されたCSIノードプラグインは通常、特権コンテナとしてデプロイされます。Windowsワーカーノードの場合、コンテナ化されたCSIノードプラグインの特権操作は、[csi-proxy](https://github.com/kubernetes-csi/csi-proxy)を使用してサポートされます。各Windowsノードにプリインストールされている。詳細については、展開するCSIプラグインの展開ガイドを参照してください。

#### ネットワーキング

Windowsコンテナのネットワークは、[CNIプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)を通じて公開されます。Windowsコンテナは、ネットワークに関して仮想マシンと同様に機能します。各コンテナには、Hyper-V仮想スイッチ(vSwitch)に接続されている仮想ネットワークアダプター(vNIC)があります。Host Network Service(HNS)とHost Compute Service(HCS)は連携してコンテナを作成し、コンテナvNICをネットワークに接続します。HCSはコンテナの管理を担当するのに対し、HNSは次のようなネットワークリソースの管理を担当します。:

* 仮想ネットワーク(vSwitchの作成を含む)
* エンドポイント/vNIC
* 名前空間
* ポリシー(パケットのカプセル化、負荷分散ルール、ACL、NATルールなど)

次のServiceタイプがサポートされています。:

* NodePort
* ClusterIP
* LoadBalancer
* ExternalName

Windowsは、L2bridge、L2tunnel、Overlay、Transparent、NATの5つの異なるネットワークドライバー/モードをサポートしています。WindowsとLinuxのワーカーノードを持つ異種クラスターでは、WindowsとLinuxの両方で互換性のあるネットワークソリューションを選択する必要があります。以下のツリー外プラグインがWindowsでサポートされており、各CNIをいつ使用するかに関する推奨事項があります。:

| ネットワークドライバー | 説明 | コンテナパケットの変更 | ネットワークプラグイン | ネットワークプラグインの特性 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | コンテナは外部のvSwitchに接続されます。コンテナはアンダーレイネットワークに接続されますが、物理ネットワークはコンテナのMACを上り/下りで書き換えるため、MACを学習する必要はありません。コンテナ間トラフィックは、コンテナホスト内でブリッジされます。 | MACはホストのMACに書き換えられ、IPは変わりません。| [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge)、[Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)、Flannelホストゲートウェイは、win-bridgeを使用します。 | win-bridgeはL2bridgeネットワークモードを使用して、コンテナをホストのアンダーレイに接続して、最高のパフォーマンスを提供します。ノード間接続にはユーザー定義ルート(UDR)が必要です。 |
| L2Tunnel | これはl2bridgeの特殊なケースですが、Azureでのみ使用されます。すべてのパケットは、SDNポリシーが適用されている仮想化ホストに送信されます。| MACが書き換えられ、IPがアンダーレイネットワークで表示されます。 | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNIを使用すると、コンテナをAzure vNETと統合し、[Azure Virtual Networkが提供](https://azure.microsoft.com/en-us/services/virtual-network/)する一連の機能を活用できます。たとえば、Azureサービスに安全に接続するか、Azure NSGを使用します。[azure-cniのいくつかの例](https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking)を参照してください。|
| オーバーレイ(KubernetesのWindows用のオーバーレイネットワークは *アルファ* 段階です) | コンテナには、外部のvSwitchに接続されたvNICが付与されます。各オーバーレイネットワークは、カスタムIPプレフィックスで定義された独自のIPサブネットを取得します。オーバーレイネットワークドライバーは、VXLANを使用してカプセル化します。 | 外部ヘッダーでカプセル化されます。 | [Win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay)、Flannel VXLAN (win-overlayを使用) | win-overlayは、仮想コンテナーネットワークをホストのアンダーレイから分離する必要がある場合に使用する必要があります(セキュリティ上の理由など)。データセンター内のIPが制限されている場合に、(異なるVNIDタグを持つ)異なるオーバーレイネットワークでIPを再利用できるようにします。このオプションには、Windows Server 2019で[KB4489899](https://support.microsoft.com/help/4489899)が必要です。|
| 透過的([ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)の特別な使用例) | 外部のvSwitchが必要です。コンテナは外部のvSwitchに接続され、論理ネットワーク(論理スイッチおよびルーター)を介したPod内通信を可能にします。 | パケットは、[GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/)または[STT](https://datatracker.ietf.org/doc/draft-davie-stt/)トンネリングを介してカプセル化され、同じホスト上にないポッドに到達します。パケットは、ovnネットワークコントローラーによって提供されるトンネルメタデータ情報を介して転送またはドロップされます。NATは南北通信のために行われます。 | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [ansible経由でデプロイ](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)します。分散ACLは、Kubernetesポリシーを介して適用できます。 IPAMをサポートします。負荷分散は、kube-proxyなしで実現できます。 NATは、ip​​tables/netshを使用せずに行われます。 |
| NAT(*Kubernetesでは使用されません*) | コンテナには、内部のvSwitchに接続されたvNICが付与されます。DNS/DHCPは、[WinNAT](https://blogs.technet.microsoft.com/virtualization/2016/05/25/windows-nat-winnat-capabilities-and-limitations/)と呼ばれる内部コンポーネントを使用して提供されます。 | MACおよびIPはホストMAC/IPに書き換えられます。 | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 完全を期すためにここに含まれています。 |

上で概説したように、[Flannel](https://github.com/coreos/flannel) CNI[メタプラグイン](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel)は、[VXLANネットワークバックエンド](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)(**アルファサポート**、win-overlayへのデリゲート)および[ホストゲートウェイネットワークバックエンド](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)(安定したサポート、win-bridgeへのデリゲート)を介して[Windows](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel#windows-support-experimental)でもサポートされます。このプラグインは、参照CNIプラグイン(win-overlay、win-bridge)の1つへの委任をサポートし、WindowsのFlannelデーモン(Flanneld)と連携して、ノードのサブネットリースの自動割り当てとHNSネットワークの作成を行います。このプラグインは、独自の構成ファイル(cni.conf)を読み取り、FlannelDで生成されたsubnet.envファイルからの環境変数と統合します。次に、ネットワークプラミング用の参照CNIプラグインの1つに委任し、ノード割り当てサブネットを含む正しい構成をIPAMプラグイン(ホストローカルなど)に送信します。

Node、Pod、およびServiceオブジェクトの場合、TCP/UDPトラフィックに対して次のネットワークフローがサポートされます。:

* Pod -> Pod (IP)
* Pod -> Pod (Name)
* Pod -> Service (Cluster IP)
* Pod -> Service (PQDN、ただし、「.」がない場合のみ)
* Pod -> Service (FQDN)
* Pod -> External (IP)
* Pod -> External (DNS)
* Node -> Pod
* Pod -> Node

Windowsでは、次のIPAMオプションがサポートされています。

* [ホストローカル](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* HNS IPAM (受信トレイプラットフォームIPAM、これはIPAMが設定されていない場合のフォールバック)
* [Azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md)(azure-cniのみ)

### 制限

#### コントロールプレーン

Windowsは、Kubernetesアーキテクチャとコンポーネントマトリックスのワーカーノードとしてのみサポートされています。つまり、Kubernetesクラスタには常にLinuxマスターノード、0以上のLinuxワーカーノード、0以上のWindowsワーカーノードが含まれている必要があります。

#### コンピュート

##### リソース管理とプロセス分離

Linux cgroupsは、Linuxのリソースを制御するPodの境界として使用されます。コンテナは、ネットワーク、プロセス、およびファイルシステムを分離するのために、その境界内に作成されます。cgroups APIを使用して、cpu/io/memoryの統計を収集できます。対照的に、Windowsはシステムネームスペースフィルターを備えたコンテナごとのジョブオブジェクトを使用して、コンテナ内のすべてのプロセスを格納し、ホストからの論理的な分離を提供します。ネームスペースフィルタリングを行わずにWindowsコンテナを実行する方法はありません。これは、ホストの環境ではシステム特権を主張できないため、Windowsでは特権コンテナを使用できないことを意味します。セキュリティアカウントマネージャー(SAM)が独立しているため、コンテナはホストからIDを引き受けることができません。

##### オペレーティングシステムの制限

Windowsには厳密な互換性ルールがあり、ホストOSのバージョンとコンテナのベースイメージOSのバージョンは、一致する必要があります。Windows Server 2019のコンテナオペレーティングシステムを備えたWindowsコンテナのみがサポートされます。Hyper-V分離のコンテナは、Windowsコンテナのイメージバージョンに下位互換性を持たせることは、将来のリリースで計画されています。

##### 機能制限

* TerminationGracePeriod：実装されていません
* 単一ファイルのマッピング：CRI-ContainerDで実装されます
* 終了メッセージ：CRI-ContainerDで実装されます
* 特権コンテナ：現在Windowsコンテナではサポートされていません
* HugePages：現在Windowsコンテナではサポートされていません
* 既存のノード問題を検出する機能はLinux専用であり、特権コンテナが必要です。一般的に、特権コンテナはサポートされていないため、これがWindowsで使用されることは想定していません。
* ネームスペース共有については、すべての機能がサポートされているわけではありません（詳細については、APIセクションを参照してください）

##### メモリ予約と処理

Windowsには、Linuxのようなメモリ不足のプロセスキラーはありません。Windowsは常に全ユーザーモードのメモリ割り当てを仮想として扱い、ページファイルは必須です。正味の効果は、WindowsはLinuxのようなメモリ不足の状態にはならず、メモリ不足（OOM）終了の影響を受ける代わりにページをディスクに処理します。メモリが過剰にプロビジョニングされ、物理メモリのすべてが使い果たされると、ページングによってパフォーマンスが低下する可能性があります。

2ステップのプロセスで、メモリ使用量を妥当な範囲内に保つことが可能です。まず、kubeletパラメータ`--kubelet-reserve`や`--system-reserve`を使用して、ノード（コンテナ外）でのメモリ使用量を明確にします。これにより、[NodeAllocatable](/ja/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable))が削減されます。ワークロードをデプロイするときは、コンテナにリソース制限をかけます（制限のみを設定するか、制限が要求と等しくなければなりません）。これにより、NodeAllocatableも差し引かれ、ノードのリソースがフルな状態になるとSchedulerがPodを追加できなくなります。

過剰なプロビジョニングを回避するためのベストプラクティスは、Windows、Docker、およびKubernetesのプロセスに対応するために、最低2GBのメモリを予約したシステムでkubeletを構成することです。

フラグの振舞いについては、次のような異なる動作をします。:

* `--kubelet-reserve`、`--system-reserve`、および`--eviction-hard`フラグはノードの割り当て可能数を更新します
* `--enforce-node-allocable`を使用した排除は実装されていません
* `--eviction-hard`および`--eviction-soft`を使用した排除は実装されていません
* MemoryPressureの制約は実装されていません
* kubeletによって実行されるOOMを排除することはありません
* Windowsノードで実行されているKubeletにはメモリ制限がありません。`--kubelet-reserve`と`--system-reserve`は、ホストで実行されているkubeletまたはプロセスに制限を設定しません。これは、ホスト上のkubeletまたはプロセスが、NodeAllocatableとSchedulerの外でメモリリソース不足を引き起こす可能性があることを意味します。

#### ストレージ

Windowsには、コンテナレイヤーをマウントして、NTFSに基づいて複製されたファイルシステムを作るためのレイヤー構造のファイルシステムドライバーがあります。コンテナ内のすべてのファイルパスは、そのコンテナの環境内だけで決められます。

* ボリュームマウントは、コンテナ内のディレクトリのみを対象にすることができ、個別のファイルは対象にできません
* ボリュームマウントは、ファイルまたはディレクトリをホストファイルシステムに投影することはできません
* WindowsレジストリとSAMデータベースには常に書き込みアクセスが必要であるため、読み取り専用ファイルシステムはサポートされていません。ただし、読み取り専用ボリュームはサポートされています
* ボリュームのユーザーマスクと権限は使用できません。SAMはホストとコンテナ間で共有されないため、それらの間のマッピングはありません。すべての権限はコンテナの環境内で決められます

その結果、次のストレージ機能はWindowsノードではサポートされません。

* ボリュームサブパスのマウント。Windowsコンテナにマウントできるのはボリューム全体だけです。
* シークレットのサブパスボリュームのマウント
* ホストマウントプロジェクション
* DefaultMode（UID/GID依存関係による）
* 読み取り専用のルートファイルシステム。マップされたボリュームは引き続き読み取り専用をサポートします
* ブロックデバイスマッピング
* 記憶媒体としてのメモリ
* uui/guid、ユーザーごとのLinuxファイルシステム権限などのファイルシステム機能
* NFSベースのストレージ/ボリュームのサポート
* マウントされたボリュームの拡張（resizefs）

#### ネットワーキング

Windowsコンテナネットワーキングは、Linuxネットワーキングとはいくつかの重要な実装方法の違いがあります。[Microsoft documentation for Windows Container Networking](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)には、追加の詳細と背景があります。

Windowsホストネットワーキングサービスと仮想スイッチはネームスペースを実装して、Podまたはコンテナの必要に応じて仮想NICを作成できます。ただし、DNS、ルート、メトリックなどの多くの構成は、Linuxのような/etc/...ファイルではなく、Windowsレジストリデータベースに保存されます。コンテナのWindowsレジストリはホストのレジストリとは別であるため、ホストからコンテナへの/etc/resolv.confのマッピングなどの概念は、Linuxの場合と同じ効果をもたらしません。これらは、そのコンテナの環境で実行されるWindows APIを使用して構成する必要があります。したがって、CNIの実装は、ファイルマッピングに依存する代わりにHNSを呼び出して、ネットワークの詳細をPodまたはコンテナに渡す必要があります。

次のネットワーク機能はWindowsノードではサポートされていません

* ホストネットワーキングモードはWindows Podでは使用できません
* ノード自体からのローカルNodePortアクセスは失敗します（他のノードまたは外部クライアントで機能）
* ノードからのService VIPへのアクセスは、Windows Serverの将来のリリースで利用可能になる予定です
* kube-proxyのオーバーレイネットワーキングサポートはアルファリリースです。さらに、[KB4482887](https://support.microsoft.com/en-us/help/4482887/windows-10-update-kb4482887)がWindows Server 2019にインストールされている必要があります
* ローカルトラフィックポリシーとDSRモード
* l2bridge、l2tunnel、またはオーバーレイネットワークに接続されたWindowsコンテナは、IPv6スタックを介した通信をサポートしていません。これらのネットワークドライバーがIPv6アドレスを使用できるようにするために必要な機能として、優れたWindowsプラットフォームの機能があり、それに続いて、kubelet、kube-proxy、およびCNIプラグインといったKubernetesの機能があります。
* win-overlay、win-bridge、およびAzure-CNIプラグインを介したICMPプロトコルを使用したアウトバウンド通信。具体的には、Windowsデータプレーン([VFP](https://www.microsoft.com/en-us/research/project/azure-virtual-filtering-platform/))は、ICMPパケットの置き換えをサポートしていません。これの意味は：
  * 同じネットワーク内の宛先に向けられたICMPパケット（pingを介したPod間通信など）は期待どおりに機能し、制限はありません
  * TCP/UDPパケットは期待どおりに機能し、制限はありません
  * リモートネットワーク（Podからping経由の外部インターネット通信など）を通過するように指示されたICMPパケットは置き換えできないため、ソースにルーティングされません。
  * TCP/UDPパケットは引き続き置き換えできるため、`ping <destination>`を`curl <destination>`に置き換えることで、外部への接続をデバッグできます。

これらの機能はKubernetes v1.15で追加されました。

* `kubectl port-forward`

##### CNIプラグイン

* Windowsリファレンスネットワークプラグインのwin-bridgeとwin-overlayは、[CNI仕様](https://github.com/containernetworking/cni/blob/master/SPEC.md)v0.4.0において「CHECK」実装がないため、今のところ実装されていません。
* Flannel VXLAN CNIについては、Windowsで次の制限があります。:

1. Node-podの直接間接続は設計上不可能です。Flannel[PR 1096](https://github.com/coreos/flannel/pull/1096)を使用するローカルPodでのみ可能です
2. VNI 4096とUDPポート4789の使用に制限されています。VNIの制限は現在取り組んでおり、将来のリリースで解決される予定です（オープンソースのflannelの変更）。これらのパラメーターの詳細については、公式の[Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)バックエンドのドキュメントをご覧ください。

##### DNS {#dns-limitations}

* ClusterFirstWithHostNetは、DNSでサポートされていません。Windowsでは、FQDNとしてすべての名前を「.」で扱い、PQDNでの名前解決はスキップします。
* Linuxでは、PQDNで名前解決しようとするときに使用するDNSサフィックスリストがあります。Windowsでは、1つのDNSサフィックスしかありません。これは、そのPodのNamespaceに関連付けられているDNSサフィックスです（たとえば、mydns.svc.cluster.local）。Windowsでは、そのサフィックスだけで名前解決可能なFQDNおよびServiceまたはNameでの名前解決ができます。たとえば、defaultのNamespaceで生成されたPodには、DNSサフィックス**default.svc.cluster.local**が付けられます。WindowsのPodでは、**kubernetes.default.svc.cluster.local**と**kubernetes**の両方を名前解決できますが、**kubernetes.default**や**kubernetes.default.svc**のような中間での名前解決はできません。
* Windowsでは、複数のDNSリゾルバーを使用できます。これらには少し異なる動作が付属しているため、ネームクエリの解決には`Resolve-DNSName`ユーティリティを使用することをお勧めします。

##### セキュリティ

Secretはノードのボリュームに平文テキストで書き込まれます（Linuxのtmpfs/in-memoryの比較として）。これはカスタマーが2つのことを行う必要があります

1. ファイルACLを使用してSecretファイルの場所を保護する
2.  [BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)を使って、ボリュームレベルの暗号化を使用する

[RunAsUser](/docs/concepts/policy/pod-security-policy/#users-and-groups)は、現在Windowsではサポートされていません。回避策は、コンテナをパッケージ化する前にローカルアカウントを作成することです。RunAsUsername機能は、将来のリリースで追加される可能性があります。

SELinux、AppArmor、Seccomp、特性（POSIX機能）のような、Linux固有のPodセキュリティ環境の権限はサポートされていません。

さらに、既に述べたように特権付きコンテナは、Windowsにおいてサポートされていません。

#### API

ほとんどのKubernetes APIがWindowsでも機能することに違いはありません。そのわずかな違いはOSとコンテナランタイムの違いによるものです。特定の状況では、PodやコンテナなどのワークロードAPIの一部のプロパティが、Linuxで実装されているが、Windowsでは実行できないことを前提に設計されています。

高いレベルで、これらOSのコンセプトに違いがります。:

* ID - Linuxでは、Integer型として表されるuserID（UID）とgroupID（GID）を使用します。ユーザー名とグループ名は正規ではありません - それらは、UID+GIDの背後にある`/etc/groups`または`/etc/passwd`の単なるエイリアスです。Windowsは、Windows Security Access Manager（SAM）データベースに格納されているより大きなバイナリセキュリティ識別子（SID）を使用します。このデータベースは、ホストとコンテナ間、またはコンテナ間で共有されません。
* ファイル権限 - Windowsは、権限とUID+GIDのビットマスクではなく、SIDに基づくアクセス制御リストを使用します
* ファイルパス - Windowsの規則では、`/`ではなく`\`を使用します。Go IOライブラリは通常両方を受け入れ、それを機能させるだけですが、コンテナ内で解釈されるパスまたはコマンドラインを設定する場合、`\`が必要になる場合があります。
* シグナル - Windowsのインタラクティブなアプリは終了を異なる方法で処理し、次の1つ以上を実装できます。:
  * UIスレッドは、WM_CLOSEを含む明確に定義されたメッセージを処理します
  * コンソールアプリは、コントロールハンドラーを使用してctrl-cまたはctrl-breakを処理します
  * サービスは、SERVICE_CONTROL_STOP制御コードを受け入れることができるサービスコントロールハンドラー関数を登録します。

終了コードは、0が成功、0以外が失敗の場合と同じ規則に従います。特定のエラーコードは、WindowsとLinuxで異なる場合があります。ただし、Kubernetesのコンポーネント（kubelet、kube-proxy）から渡される終了コードは変更されていません。

##### V1.Container

* V1.Container.ResourceRequirements.limits.cpuおよびV1.Container.ResourceRequirements.limits.memory - Windowsは、CPU割り当てにハード制限を使用しません。代わりに、共有システムが使用されます。ミリコアに基づく既存のフィールドは、Windowsスケジューラーによって追従される相対共有にスケーリングされます。[参照: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go)、[参照: resource controls in Microsoft docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/resource-controls)
  * Huge Pagesは、Windowsコンテナランタイムには実装されてないので、使用できません。コンテナに対して設定できない[ユーザー特権を主張](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support)する必要があります。
* V1.Container.ResourceRequirements.requests.cpuおよびV1.Container.ResourceRequirements.requests.memory - リクエストはノードの利用可能なリソースから差し引かれるので、ノードのオーバープロビジョニングを回避するために使用できます。ただし、過剰にプロビジョニングされたノードのリソースを保証するために使用することはできません。オペレーターが完全にプロビジョニングし過ぎないようにする場合は、ベストプラクティスとしてこれらをすべてのコンテナに適用する必要があります。
* V1.Container.SecurityContext.allowPrivilegeEscalation - Windowsでは使用できません、接続されている機能はありません
* V1.Container.SecurityContext.Capabilities - POSIX機能はWindowsでは実装されていません
* V1.Container.SecurityContext.privileged - Windowsでは特権コンテナをサポートしていません
* V1.Container.SecurityContext.procMount - Windowsでは/procファイルシステムがありません
* V1.Container.SecurityContext.readOnlyRootFilesystem - Windowsでは使用できません、レジストリおよびシステムプロセスがコンテナ内で実行するには、書き込みアクセスが必要です
* V1.Container.SecurityContext.runAsGroup - Windowsでは使用できません、GIDのサポートもありません
* V1.Container.SecurityContext.runAsNonRoot - Windowsではrootユーザーが存在しません。最も近いものは、ノードに存在しないIDであるContainerAdministratorです。
* V1.Container.SecurityContext.runAsUser - Windowsでは使用できません。intとしてのUIDはサポートされていません。
* V1.Container.SecurityContext.seLinuxOptions - Windowsでは使用できません、SELinuxがありません
* V1.Container.terminationMessagePath - これは、Windowsが単一ファイルのマッピングをサポートしないという点でいくつかの制限があります。デフォルト値は/dev/termination-logであり、デフォルトではWindowsに存在しないため動作します。

##### V1.Pod

* V1.Pod.hostIPC、v1.pod.hostpid - Windowsではホストのネームスペースを共有することはできません
* V1.Pod.hostNetwork - ホストのネットワークを共有するためのWindows OSサポートはありません
* V1.Pod.dnsPolicy - ClusterFirstWithHostNet - Windowsではホストネットワーキングがサポートされていないため、サポートされていません。
* V1.Pod.podSecurityContext - 以下のV1.PodSecurityContextを参照
* V1.Pod.shareProcessNamespace - これはベータ版の機能であり、Windowsに実装されていないLinuxのNamespace機能に依存しています。Windowsでは、プロセスのネームスペースまたはコンテナのルートファイルシステムを共有できません。共有できるのはネットワークだけです。
* V1.Pod.terminationGracePeriodSeconds - これはWindowsのDockerに完全には実装されていません。[リファレンス](https://github.com/moby/moby/issues/25982)を参照してください。今日の動作では、ENTRYPOINTプロセスにCTRL_SHUTDOWN_EVENTが送信され、Windowsではデフォルトで5秒待機し、最後に通常のWindowsシャットダウン動作を使用してすべてのプロセスをシャットダウンします。5秒のデフォルトは、実際にはWindowsレジストリー[コンテナ内](https://github.com/moby/moby/issues/25982#issuecomment-426441183)にあるため、コンテナ作成時にオーバーライドできます。
* V1.Pod.volumeDevices - これはベータ機能であり、Windowsには実装されていません。Windowsでは、rawブロックデバイスをPodに接続できません。
* V1.Pod.volumes-EmptyDir、Secret、ConfigMap、HostPath - すべて動作し、TestGridにテストがあります
  * V1.emptyDirVolumeSource - ノードのデフォルトのメディアはWindowsのディスクです。Windowsでは、RAMディスクが組み込まれていないため、メモリはサポートされていません。
* V1.VolumeMount.mountPropagation - mount propagationは、Windowsではサポートされていません。

##### V1.PodSecurityContext

Windowsでは、PodSecurityContextフィールドはどれも機能しません。これらは参照用にここにリストされています。

* V1.PodSecurityContext.SELinuxOptions - SELinuxは、Windowsでは使用できません
* V1.PodSecurityContext.RunAsUser - UIDを提供しますが、Windowsでは使用できません
* V1.PodSecurityContext.RunAsGroup - GIDを提供しますが、Windowsでは使用できません
* V1.PodSecurityContext.RunAsNonRoot - Windowsにはrootユーザーがありません。最も近いものは、ノードに存在しないIDであるContainerAdministratorです。
* V1.PodSecurityContext.SupplementalGroups - GIDを提供しますが、Windowsでは使用できません
* V1.PodSecurityContext.Sysctls - これらはLinuxのsysctlインターフェースの一部です。Windowsには同等のものはありません。

## ヘルプとトラブルシューティングを学ぶ {#troubleshooting}

Kubernetesクラスターのトラブルシューティングの主なヘルプソースは、この[セクション](/docs/tasks/debug-application-cluster/troubleshooting/)から始める必要があります。このセクションには、いくつか追加的な、Windows固有のトラブルシューティングヘルプが含まれています。ログは、Kubernetesにおけるトラブルシューティング問題の重要な要素です。他のコントリビューターからトラブルシューティングの支援を求めるときは、必ずそれらを含めてください。SIG-Windows[ログ収集に関するコントリビュートガイド](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)の指示に従ってください。

1. start.ps1が正常に完了したことをどのように確認できますか？

    ノード上でkubelet、kube-proxy、および（ネットワーキングソリューションとしてFlannelを選択した場合）flanneldホストエージェントプロセスが実行され、実行ログが個別のPowerShellウィンドウに表示されます。これに加えて、WindowsノードがKubernetesクラスターで「Ready」として表示されているはずです。

1. Kubernetesノードのプロセスをサービスとしてバックグラウンドで実行するように構成できますか？

    Kubeletとkube-proxyは、ネイティブのWindowsサービスとして実行するように既に構成されています、障害（例えば、プロセスのクラッシュ）が発生した場合にサービスを自動的に再起動することにより、復元性を提供します。これらのノードコンポーネントをサービスとして構成するには、2つのオプションがあります。

    1. ネイティブWindowsサービスとして

        Kubeletとkube-proxyは、`sc.exe`を使用してネイティブのWindowsサービスとして実行できます。

        ```powershell
        # 2つの個別のコマンドでkubeletおよびkube-proxyのサービスを作成する
        sc.exe create <component_name> binPath= "<path_to_binary> --service <other_args>"

        # 引数にスペースが含まれている場合は、エスケープする必要があることに注意してください。
        sc.exe create kubelet binPath= "C:\kubelet.exe --service --hostname-override 'minion' <other_args>"

        # サービスを開始する
        Start-Service kubelet
        Start-Service kube-proxy

        # サービスを停止する
        Stop-Service kubelet (-Force)
        Stop-Service kube-proxy (-Force)

        # サービスの状態を問い合わせる
        Get-Service kubelet
        Get-Service kube-proxy
        ```

    1. nssm.exeの使用

        また、[nssm.exe](https://nssm.cc/)などの代替サービスマネージャーを使用して、これらのプロセス（flanneld、kubelet、kube-proxy）をバックグラウンドで実行することもできます。この[サンプルスクリプト](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1)を使用すると、nssm.exeを利用してkubelet、kube-proxy、flanneld.exeを登録し、Windowsサービスとしてバックグラウンドで実行できます。

        ```powershell
        register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>

        # NetworkMode      = ネットワークソリューションとして選択されたネットワークモードl2bridge（flannel host-gw、これもデフォルト値）またはoverlay（flannel vxlan）
        # ManagementIP     = Windowsノードに割り当てられたIPアドレス。 ipconfigを使用してこれを見つけることができます
        # ClusterCIDR      = クラスターのサブネット範囲。（デフォルト値 10.244.0.0/16）
        # KubeDnsServiceIP = Kubernetes DNSサービスIP（デフォルト値 10.96.0.10）
        # LogDir           = kubeletおよびkube-proxyログがそれぞれの出力ファイルにリダイレクトされるディレクトリ（デフォルト値 C:\k）
        ```

        上記のスクリプトが適切でない場合は、次の例を使用してnssm.exeを手動で構成できます。
        ```powershell
        # flanneld.exeを登録する
        nssm install flanneld C:\flannel\flanneld.exe
        nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
        nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
        nssm set flanneld AppDirectory C:\flannel
        nssm start flanneld

        # kubelet.exeを登録
        # マイクロソフトは、mcr.microsoft.com/k8s/core/pause:1.2.0としてポーズインフラストラクチャコンテナをリリース
        nssm install kubelet C:\k\kubelet.exe
        nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=mcr.microsoft.com/k8s/core/pause:1.2.0 --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
        nssm set kubelet AppDirectory C:\k
        nssm start kubelet

        # kube-proxy.exeを登録する (l2bridge / host-gw)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --hostname-override=<hostname>--kubeconfig=c:\k\config --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm.exe set kube-proxy AppEnvironmentExtra KUBE_NETWORK=cbr0
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy

        # kube-proxy.exeを登録する (overlay / vxlan)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --feature-gates="WinOverlay=true" --hostname-override=<hostname> --kubeconfig=c:\k\config --network-name=vxlan0 --source-vip=<source-vip> --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy
        ```


        最初のトラブルシューティングでは、[nssm.exe](https://nssm.cc/)で次のフラグを使用して、stdoutおよびstderrを出力ファイルにリダイレクトできます。:

        ```powershell
        nssm set <Service Name> AppStdout C:\k\mysvc.log
        nssm set <Service Name> AppStderr C:\k\mysvc.log
        ```

        詳細については、公式の[nssmの使用法](https://nssm.cc/usage)のドキュメントを参照してください。

1. Windows Podにネットワーク接続がありません

    仮想マシンを使用している場合は、すべてのVMネットワークアダプターでMACスプーフィングが有効になっていることを確認してください。

1. Windows Podが外部リソースにpingできません

    現在、Windows Podには、ICMPプロトコル用にプログラムされた送信ルールはありません。ただし、TCP/UDPはサポートされています。クラスター外のリソースへの接続を実証する場合は、`ping <IP>`に対応する`curl <IP>`コマンドに置き換えてください。

    それでも問題が解決しない場合は、[cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)のネットワーク構成に値する可能性があるので、いくつかの特別な注意が必要です。この静的ファイルはいつでも編集できます。構成の更新は、新しく作成されたすべてのKubernetesリソースに適用されます。

    Kubernetesのネットワーキング要件の1つ(参照[Kubernetesモデル](/ja/docs/concepts/cluster-administration/networking/))は、内部でNATを使用せずにクラスター通信を行うためのものです。この要件を遵守するために、すべての通信に[ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)があり、アウトバウンドNATが発生しないようにします。ただし、これは、クエリしようとしている外部IPをExceptionListから除外する必要があることも意味します。そうして初めて、Windows PodからのトラフィックがSNAT処理され、外部からの応答を受信できるようになります。この点で、`cni.conf`のExceptionListは次のようになります。:

    ```conf
    "ExceptionList": [
                    "10.244.0.0/16",  # クラスターのサブネット
                    "10.96.0.0/12",   # Serviceのサブネット
                    "10.127.130.0/24" # 管理 (ホスト) のサブネット
                ]
    ```

1. WindowsノードがNodePort Serviceにアクセスできません

    ノード自体からのローカルNodePortアクセスは失敗します。これは既知の制限です。NodePortアクセスは、他のノードまたは外部クライアントから行えます。

1. コンテナのvNICとHNSエンドポイントが削除されています

    この問題は、`hostname-override`パラメータが[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)に渡されない場合に発生する可能性があります。これを解決するには、ユーザーは次のようにホスト名をkube-proxyに渡す必要があります。:

    ```powershell
    C:\k\kube-proxy.exe --hostname-override=$(hostname)
    ```

1. flannelを使用すると、クラスターに再参加した後、ノードに問題が発生します

    以前に削除されたノードがクラスターに再参加するときはいつも、flannelDは新しいPodサブネットをノードに割り当てようとします。ユーザーは、次のパスにある古いPodサブネット構成ファイルを削除する必要があります。:

    ```powershell
    Remove-Item C:\k\SourceVip.json
    Remove-Item C:\k\SourceVipRequest.json
    ```

1. `start.ps1`を起動した後、flanneldが「ネットワークが作成されるのを待っています」と表示されたままになります

    この[調査中の問題](https://github.com/coreos/flannel/issues/1066)に関する多数の報告があります。最も可能性が高いのは、flannelネットワークの管理IPが設定されるタイミングの問題です。回避策は、単純にstart.ps1を再起動するか、次のように手動で再起動することです。:

    ```powershell
    PS C:> [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
    PS C:> C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
    ```

1. `/run/flannel/subnet.env`がないため、Windows Podを起動できません

    これは、Flannelが正しく起動しなかったことを示しています。 flanneld.exeの再起動を試みるか、Kubernetesマスターの`/run/flannel/subnet.env`からWindowsワーカーノードの`C:\run\flannel\subnet.env`に手動でファイルをコピーすることができます。「FLANNEL_SUBNET」行を別の番号に変更します。たとえば、ノードサブネット10.244.4.1/24が必要な場合は以下となります。:

    ```env
    FLANNEL_NETWORK=10.244.0.0/16
    FLANNEL_SUBNET=10.244.4.1/24
    FLANNEL_MTU=1500
    FLANNEL_IPMASQ=true
    ```

1. WindowsノードがService IPを使用してServiceにアクセスできない

    これは、Windows上の現在のネットワークスタックの既知の制限です。ただし、Windows PodはService IPにアクセスできます。

1. kubeletの起動時にネットワークアダプターが見つかりません

    WindowsネットワーキングスタックがKubernetesネットワーキングを動かすには、仮想アダプターが必要です。次のコマンドを実行しても結果が返されない場合（管理シェルで）、仮想ネットワークの作成（Kubeletが機能するために必要な前提条件）に失敗したことになります。:

    ```powershell
    Get-HnsNetwork | ? Name -ieq "cbr0"
    Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
    ```

    ホストのネットワークアダプターが「イーサネット」ではない場合、多くの場合、start.ps1スクリプトの[InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L6)パラメーターを修正する価値があります。そうでない場合は`start-kubelet.ps1`スクリプトの出力結果を調べて、仮想ネットワークの作成中にエラーがないか確認します。

1. Podが「Container Creating」と表示されたまま動かなくなったり、何度も再起動を繰り返します

    PauseイメージがOSバージョンと互換性があることを確認してください。[説明](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources)では、OSとコンテナの両方がバージョン1803であると想定しています。それ以降のバージョンのWindowsを使用している場合は、Insiderビルドなどでは、それに応じてイメージを調整する必要があります。イメージについては、Microsoftの[Dockerレジストリ](https://hub.docker.com/u/microsoft/)を参照してください。いずれにしても、PauseイメージのDockerfileとサンプルサービスの両方で、イメージに:latestのタグが付けられていると想定しています。

    Kubernetes v1.14以降、MicrosoftはPauseインフラストラクチャコンテナを`mcr.microsoft.com/k8s/core/pause:1.2.0`でリリースしています。

1. DNS名前解決が正しく機能していない

    この[セクション](#dns-limitations)でDNSの制限を確認してください。

1. `kubectl port-forward`が「ポート転送を実行できません:wincatが見つかりません」で失敗します

    これはKubernetes 1.15、およびPauseインフラストラクチャコンテナ`mcr.microsoft.com/k8s/core/pause:1.2.0`で実装されました。必ずこれらのバージョン以降を使用してください。
    独自のPauseインフラストラクチャコンテナを構築する場合は、必ず[wincat](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat)を含めてください。

1. Windows Serverノードがプロキシの背後にあるため、Kubernetesのインストールが失敗します

    プロキシの背後にある場合は、次のPowerShell環境変数を定義する必要があります。:
    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```

1. `pause`コンテナとは何ですか

    Kubernetes Podでは、インフラストラクチャまたは「pause」コンテナが最初に作成され、コンテナエンドポイントをホストします。インフラストラクチャやワーカーコンテナなど、同じPodに属するコンテナは、共通のネットワークネームスペースとエンドポイント（同じIPとポートスペース）を共有します。Pauseコンテナは、ネットワーク構成を失うことなくクラッシュまたは再起動するワーカーコンテナに対応するために必要です。

    「pause」（インフラストラクチャ）イメージは、Microsoft Container Registry（MCR）でホストされています。`docker pull mcr.microsoft.com/k8s/core/pause:1.2.0`を使用してアクセスできます。詳細については、[DOCKERFILE](https://github.com/kubernetes-sigs/windows-testing/blob/master/images/pause/Dockerfile)をご覧ください。

### さらなる調査

これらの手順で問題が解決しない場合は、次の方法で、KubernetesのWindowsノードでWindowsコンテナを実行する際のヘルプを利用できます。:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container)トピック
* Kubernetesオフィシャルフォーラム [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

## IssueとFeatureリクエストの報告

バグのようなものがある場合、またはFeatureリクエストを行う場合は、[GitHubのIssueシステム](https://github.com/kubernetes/kubernetes/issues)を使用してください。[GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose)でIssueを開いて、SIG-Windowsに割り当てることができます。以前に報告された場合は、まずIssueリストを検索し、Issueについての経験をコメントして、追加のログを加える必要があります。SIG-Windows Slackは、チケットを作成する前に、初期サポートとトラブルシューティングのアイデアを得るための素晴らしい手段でもあります。

バグを報告する場合は、問題の再現方法に関する次のような詳細情報を含めてください。:

* Kubernetesのバージョン: kubectlのバージョン
* 環境の詳細: クラウドプロバイダー、OSのディストリビューション、選択したネットワーキングと構成、およびDockerのバージョン
* 問題を再現するための詳細な手順
* [関連するログ](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)
* `/sig windows`でIssueにコメントして、Issueにsig/windowsのタグを付けて、SIG-Windowsメンバーが気付くようにします



## {{% heading "whatsnext" %}}


ロードマップには多くの機能があります。高レベルの簡略リストを以下に示しますが、[ロードマッププロジェクト](https://github.com/orgs/kubernetes/projects/8)を見て、[貢献すること](https://github.com/kubernetes/community/blob/master/sig-windows/)によってWindowsサポートを改善することをお勧めします。


### Hyper-V分離

Hyper-V分離はKubernetesで以下のWindowsコンテナのユースケースを可能にするために必要です。

* Pod間のハイパーバイザーベースの分離により、セキュリティを強化
* 下位互換性により、コンテナの再構築を必要とせずにノードで新しいWindows Serverバージョンを実行
* Podの特定のCPU/NUMA設定
* メモリの分離と予約


既存のHyper-V分離サポートは、v1.10の試験的な機能であり、上記のCRI-ContainerD機能とRuntimeClass機能を優先して将来廃止される予定です。現在の機能を使用してHyper-V分離コンテナを作成するには、kubeletのフィーチャーゲートを`HyperVContainer=true`で開始し、Podにアノテーション`experimental.windows.kubernetes.io/isolation-type=hyperv`を含める必要があります。実験的リリースでは、この機能はPodごとに1つのコンテナに制限されています。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iis
spec:
  selector:
    matchLabels:
      app: iis
  replicas: 3
  template:
    metadata:
      labels:
        app: iis
      annotations:
        experimental.windows.kubernetes.io/isolation-type: hyperv
    spec:
      containers:
      - name: iis
        image: microsoft/iis
        ports:
        - containerPort: 80
```

### kubeadmとクラスターAPIを使用したデプロイ

Kubeadmは、ユーザーがKubernetesクラスターをデプロイするための事実上の標準になりつつあります。kubeadmのWindowsノードのサポートは進行中ですが、ガイドはすでに[ここ](/ja/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)で利用可能です。Windowsノードが適切にプロビジョニングされるように、クラスターAPIにも投資しています。

### その他の主な機能
* グループ管理サービスアカウントのベータサポート
* その他のCNI
* その他のストレージプラグイン
