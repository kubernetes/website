---
title: KubernetesのWindowsサポート概要
content_type: concept
weight: 65
---

<!-- overview -->

Windowsアプリケーションは、多くの組織で実行されているサービスやアプリケーションの大部分を占めています。[Windowsコンテナ](https://aka.ms/windowscontainers)は、プロセスとパッケージの依存関係を一つにまとめる最新の方法を提供し、DevOpsプラクティスの使用とWindowsアプリケーションのクラウドネイティブパターンの追求を容易にします。 Kubernetesは事実上、標準的なコンテナオーケストレータになりました。Kubernetes 1.14のリリースでは、Kubernetesクラスター内のWindowsノードでWindowsコンテナをスケジューリングする本番環境サポートが含まれたので、Windowsアプリケーションの広大なエコシステムにおいて、Kubernetesを有効的に活用できます。 WindowsベースのアプリケーションとLinuxベースのアプリケーションに投資している組織は、ワークロードを管理する個別のオーケストレーターが不要となるため、オペレーティングシステムに関係なく導入全体の運用効率が向上します。

<!-- body -->

## KubernetesのWindowsコンテナ

KubernetesでWindowsコンテナのオーケストレーションを有効にするには、既存のLinuxクラスターにWindowsノードを含めるだけです。Kubernetesの[Pods](/ja/docs/concepts/workloads/pods/pod-overview/)でWindowsコンテナをスケジュールすることは、Linuxベースのコンテナをスケジュールするのと同じくらいシンプルで簡単です。

Windowsコンテナを実行するには、Kubernetesクラスターに複数のオペレーティングシステムを含める必要があります。コントロールプレーンノードはLinux、ワーカーノードはワークロードのニーズに応じてWindowsまたはLinuxで実行します。 Windows Server 2019は、サポートされている唯一のWindowsオペレーティングシステムであり、Windows（kubelet、[コンテナランタイム](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/containerd)、kube-proxyを含む）で　[Kubernetesノード](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)を有効にします。Windowsディストリビューションチャンネルの詳細については、[Microsoftのドキュメント](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19)を参照してください。

{{< note >}}
[マスターコンポーネント](/ja/docs/concepts/overview/components/)を含むKubernetesコントロールプレーンは、Linuxで実行し続けます。WindowsのみのKubernetesクラスターを導入する計画はありません。
{{< /note >}}
{{< note >}}
このドキュメントでは、Windowsコンテナについて説明する場合、プロセス分離のWindowsコンテナを意味します。[Hyper-V分離](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)のWindowsコンテナは、将来のリリースで計画しています。
{{< /note >}}

## サポートされる機能と制限

### サポートされている機能

#### コンピュート

APIとkubectlの観点から見ると、WindowsコンテナはLinuxベースのコンテナとほとんど同じように動作します。ただし、制限セクションで概説されている主要な機能には、いくつかの顕著な違いがあります。

オペレーティングシステムのバージョンから始めましょう。 KubernetesのWindowsオペレーティングシステムのサポートについては、次の表を参照してください。単一の異種Kubernetesクラスターは、WindowsとLinuxの両方のワーカーノードを持つことができます。WindowsコンテナはWindowsノードで、LinuxコンテナはLinuxノードでスケジュールする必要があります。

| Kubernetes バージョン | ホストOS バージョン (Kubernetes ノード) | | |
| --- | --- | --- | --- |
| | *Windows Server 1709* | *Windows Server 1803* | *Windows Server 1809/Windows Server 2019* |
| *Kubernetes v1.14* | サポートされていません | サポートされていません| Supported for Windows Server containers Builds 17763.* with Docker EE-basic 18.09 |

{{< note >}}
すべてのWindowsユーザーがアプリのオペレーティングシステムを頻繁に更新することは望んでいません。アプリケーションのアップグレードは、クラスターに新しいノードをアップグレードまたは導入することを要求する必要があります。Kubernetesで実行されているコンテナのオペレーティングシステムをアップグレードすることを選択したお客様には、新しいオペレーティングシステムバージョンのサポート追加時に、ガイダンスと段階的な指示を提供します。このガイダンスには、クラスターノードと共にアプリケーションをアップグレードするための推奨アップグレード手順が含まれます。 Windowsノードは、現在のLinuxノードと同じように、Kubernetes[バージョンスキューポリシー](/ja/docs/setup/release/version-skew-policy/)（ノードからコントロールプレーンのバージョン管理）に準拠しています。
{{< /note >}}
{{< note >}}
Windows Serverホストオペレーティングシステムには、 [Windows Server](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) ライセンスが適用されます。Windowsコンテナイメージには、[Windowsコンテナの追加ライセンス条項](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula)ライセンスが提供されます。
{{< /note >}}
{{< note >}}
プロセス分離のWindowsコンテナーには、厳格な互換性ルールがあります[ホストOSのバージョンはコンテナーのベースイメージのOSバージョンと一致する必要があります](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility)。KubernetesでHyper-V分離のWindowsコンテナをサポートすると、制限と互換性ルールが変更されます。
{{< /note >}}

Kubernetesの主要な要素は、WindowsでもLinuxと同じように機能します。このセクションでは、主要なワークロードイネーブラーのいくつかと、それらがWindowsにどのようにマップされるかについて説明します。

* [Pods](/ja/docs/concepts/workloads/pods/pod-overview/)
    
    Podは、Kubernetesの基本的なビルディングブロックです。作成またはデプロイするKubernetesオブジェクトモデルの最小かつ最も単純なユニットです。次のPod機能、プロパティ、およびイベントがWindowsコンテナでサポートされています。:

  * プロセス分離とボリューム共有を備えたPodごとの単一または複数のコンテナ
  * Podステータスフィールド
  * ReadinessとLiveness Probe
  * postStartとpreStopコンテナのライフサイクルイベント
  * ConfigMap, Secrets: 環境変数またはボリュームとして
  * EmptyDir
  * 名前付きパイプホストマウント
  * リソース制限
* [Controllers](/ja/docs/concepts/workloads/controllers/)
   
    Kubernetesコントローラは、Podの望ましい状態を処理します。次のワークロードコントローラーは、Windowsコンテナーでサポートされています。:

  * ReplicaSet
  * ReplicationController
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
* [Services](/ja/docs/concepts/services-networking/service/)

    Kubernetes Serviceは、Podの論理セットとPodにアクセスするためのポリシーを定義する抽象概念です。マイクロサービスと呼ばれることもあります。オペレーティングシステム間の接続にServiceを使用できます。 WindowsでのServiceは、次のタイプ、プロパティと機能を利用できます。:

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
* リソースクウォータ
* Schedulerのプリエンプション

#### コンテナランタイム

KubernetesのWindows Server 2019/1809ノードでは、Docker EE-basic 18.09が必要です。これは、kubeletに含まれているdockershimコードで動作します。 CRI-ContainerDなどの追加のランタイムは、Kubernetesの以降のバージョンでサポートされる可能性があります。

#### ストレージ

Kubernetesボリュームを使用すると、データの永続性とPodボリューム共有の要求を持つ複雑なアプリケーションをKubernetesにデプロイできます。Windows上のKubernetesは、次のタイプの[ボリューム](/ja/docs/concepts/storage/volumes/)をサポートしています。:

* [SMB and iSCSI](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows) をサポートするFlexVolumeのツリー外部にあるプラグイン
* [azureDisk](/ja/docs/concepts/storage/volumes/#azuredisk)
* [azureFile](/ja/docs/concepts/storage/volumes/#azurefile)
* [gcePersistentDisk](/ja/docs/concepts/storage/volumes/#gcepersistentdisk)

#### ネットワーキング

Networking for Windows containers is exposed through [CNI plugins](/ja/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Windows containers function similarly to virtual machines in regards to networking. Each container has a virtual network adapter (vNIC) which is connected to a Hyper-V virtual switch (vSwitch). The Host Networking Service (HNS) and the Host Compute Service (HCS) work together to create containers and attach container vNICs to networks. HCS is responsible for the management of containers whereas HNS is responsible for the management of networking resources such as:

Windowsコンテナのネットワークは、[CNIプラグイン](/ja/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)を通じて公開されます。 Windowsコンテナは、ネットワークに関して仮想マシンと同様に機能します。各コンテナーには、Hyper-V仮想スイッチ（vSwitch）に接続されている仮想ネットワークアダプター（vNIC）があります。Host Network Service（HNS）とHost Compute Service（HCS）は連携してコンテナーを作成し、コンテナvNICをネットワークに接続します。 HCSはコンテナの管理を担当するのに対し、HNSは次のようなネットワークリソースの管理を担当します。：

* 仮想ネットワーク（vSwitchの作成を含む）
* エンドポイント/ vNIC
* ネームスペース
* ポリシー（パケットのカプセル化、負荷分散ルール、ACL、NATルールなど）

次のServiceタイプがサポートされています。：

* NodePort
* ClusterIP
* LoadBalancer
* ExternalName

Windowsは、L2bridge、L2tunnel、Overlay、Transparent、NATの5つの異なるネットワークドライバー/モードをサポートしています。 WindowsとLinuxのワーカーノードを持つ異種クラスターでは、WindowsとLinuxの両方で互換性のあるネットワークソリューションを選択する必要があります。以下のツリー外プラグインがWindowsでサポートされており、各CNIをいつ使用するかに関する推奨事項があります。：

| ネットワークドライバー | 説明 | コンテナパケットの変更 | ネットワークプラグイン | ネットワークプラグインの特性 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | コンテナーは外部のvSwitchに接続されます。コンテナーはアンダーレイネットワークに接続されますが、物理ネットワークはコンテナのMACを上り/下りで書き換えるため、MACを学習する必要はありません。コンテナ間トラフィックは、コンテナホスト内でブリッジされます。 | MACはホストのMACに書き換えられ、IPは変わりません。| [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge)、[Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)、Flannelホストゲートウェイは、win-bridgeを使用します。 | win-bridgeはL2bridgeネットワークモードを使用して、コンテナーをホストのアンダーレイに接続して、最高のパフォーマンスを提供します。コンテナホスト間のL2隣接が必要です。 |
| L2Tunnel | これはl2bridgeの特殊なケースですが、Azureでのみ使用されます。すべてのパケットは、SDNポリシーが適用されている仮想化ホストに送信されます。| MACが書き換えられ、IPがアンダーレイネットワークで表示されます。 | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNIを使用すると、コンテナーをAzure vNETと統合し、[Azure Virtual Networkが提供](https://azure.microsoft.com/en-us/services/virtual-network/)する一連の機能を活用できます。たとえば、Azureサービスに安全に接続するか、Azure NSGを使用します。[azure-cniのいくつかの例](https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking) を参照してください。|
| オーバーレイ（KubernetesのWindows用のオーバーレイネットワークは *アルファ* 段階です）| コンテナには、外部のvSwitchに接続されたvNICが付与されます。各オーバーレイネットワークは、カスタムIPプレフィックスで定義された独自のIPサブネットを取得します。オーバーレイネットワークドライバーは、VXLANを使用してカプセル化します。 | 外部ヘッダーでカプセル化され、内部パケットは同じままです。 | [Win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay)、Flannel VXLAN (win-overlayを使用) | win-overlayは、仮想コンテナネットワークをホストのアンダーレイから分離する必要がある場合に使用する必要があります（セキュリティ上の理由など）。データセンター内のIPが制限されている場合に、さまざまなオーバーレイネットワーク（さまざまなVNIDタグを持つ）でIPを再利用できるようにします。このオプションは、コンテナホストがL2隣接していないがL3接続がある場合に使用できます。|
| 透過的（[ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)の特別な使用例） | 外部のvSwitchが必要です。コンテナーは外部のvSwitchに接続され、論理ネットワーク（論理スイッチおよびルーター）を介したPod内通信を可能にします。 | パケットは、[GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/)または[STT](https://datatracker.ietf.org/doc/draft-davie-stt/)トンネリングを介してカプセル化され、同じホスト上にないポッドに到達します。パケットは、ovnネットワークコントローラーによって提供されるトンネルメタデータ情報を介して転送またはドロップされます。NATは南北通信のために行われます。 | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [ansible経由でデプロイ](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)します。分散ACLは、Kubernetesポリシーを介して適用できます。 IPAMをサポートします。負荷分散は、kube-proxyなしで実現できます。 NATは、ip​​tables/netshを使用せずに行われます。 |
| NAT（*Kubernetesでは使用されません*） | コンテナには、内部のvSwitchに接続されたvNICが付与されます。DNS/DHCPは、[WinNAT](https://blogs.technet.microsoft.com/virtualization/2016/05/25/windows-nat-winnat-capabilities-and-limitations/)と呼ばれる内部コンポーネントを使用して提供されます。 | MACおよびIPはホストMAC/IPに書き換えられます。 | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 完全を期すためにここに含まれています。 |

上で概説したように、[Flannel](https://github.com/coreos/flannel) CNI[メタプラグイン](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel)は、[VXLANネットワークバックエンド](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)（**アルファサポート**、win-overlayへのデリゲート）および[ホストゲートウェイネットワークバックエンド](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw)（安定したサポート、win-bridgeへのデリゲート）を介して[Windows](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel#windows-support-experimental)でもサポートされます。このプラグインは、参照CNIプラグイン（win-overlay、win-bridge）の1つへの委任をサポートし、WindowsのFlannelデーモン（Flanneld）と連携して、ノードのサブネットリースの自動割り当てとHNSネットワークの作成を行います。このプラグインは、独自の構成ファイル（net-conf.json）を読み取り、FlannelDで生成されたsubnet.envファイルからの環境変数と統合します。次に、ネットワークプラミング用の参照CNIプラグインの1つに委任し、ノード割り当てサブネットを含む正しい構成をIPAMプラグイン（ホストローカルなど）に送信します。

Node、Pod、およびServiceオブジェクトの場合、TCP/UDPトラフィックに対して次のネットワークフローがサポートされます。：

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
* [Azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) （azure-cniのみ）

### 制限

#### コントロールプレーン

Windowsは、Kubernetesアーキテクチャとコンポーネントマトリックスのワーカーノードとしてのみサポートされています。つまり、Kubernetesクラスタには常にLinuxマスターノード、0以上のLinuxワーカーノード、0以上のWindowsワーカーノードが含まれている必要があります。

#### コンピュート

##### リソース管理とプロセス分離

 Linux cgroups are used as a pod boundary for resource controls in Linux. Containers are created within that boundary for network, process and file system isolation. The cgroups APIs can be used to gather cpu/io/memory stats. In contrast, Windows uses a Job object per container with a system namespace filter to contain all processes in a container and provide logical isolation from the host. There is no way to run a Windows container without the namespace filtering in place. This means that system privileges cannot be asserted in the context of the host, and thus privileged containers are not available on Windows. Containers cannot assume an identity from the host because the Security Account Manager (SAM) is separate.

 Linux cgroupsは、Linuxのリソースを制御するPodの境界として使用されます。コンテナは、ネットワーク、プロセス、およびファイルシステムを分離するのために、その境界内に作成されます。cgroups APIを使用して、cpu/io/memoryの統計を収集できます。対照的に、Windowsはシステムネームスペースフィルターを備えたコンテナーごとのジョブオブジェクトを使用して、コンテナー内のすべてのプロセスを格納し、ホストからの論理的な分離を提供します。ネームスペースフィルタリングを行わずにWindowsコンテナを実行する方法はありません。これは、ホストの環境ではシステム特権を主張できないため、Windowsでは特権コンテナを使用できないことを意味します。セキュリティアカウントマネージャー（SAM）が独立しているため、コンテナはホストからIDを引き受けることができません。

##### オペレーティングシステムの制限

Windowsには厳密な互換性ルールがあり、ホストOSのバージョンとコンテナのベースイメージOSのバージョンは、一致する必要があります。 Windows Server 2019のコンテナオペレーティングシステムを備えたWindowsコンテナのみがサポートされます。Hyper-V分離のコンテナは、Windowsコンテナのイメージバージョンに下位互換性を持たせることは、将来のリリースで計画されています。

##### 機能制限

* TerminationGracePeriod：実装されていません
* 単一ファイルのマッピング：CRI-ContainerDで実装されます
* 終了メッセージ：CRI-ContainerDで実装されます
* 特権コンテナ：現在Windowsコンテナーではサポートされていません
* HugePages：現在Windowsコンテナーではサポートされていません
* 既存のノード問題を検出する機能はLinux専用であり、特権コンテナが必要です。一般的に、特権コンテナはサポートされていないため、これがWindowsで使用されることは想定していません。
* ネームスペース共有については、すべての機能がサポートされているわけではありません（詳細については、APIセクションを参照してください）

##### メモリ予約と処理

Windowsには、Linuxのようなメモリ不足のプロセスキラーはありません。Windowsは常に全ユーザーモードのメモリ割り当てを仮想として扱い、ページファイルは必須です。正味の効果は、WindowsはLinuxのようなメモリ不足の状態にはならず、メモリ不足（OOM）終了の影響を受ける代わりにページをディスクに処理します。メモリが過剰にプロビジョニングされ、物理メモリのすべてが使い果たされると、ページングによってパフォーマンスが低下する可能性があります。

2ステップのプロセスで、メモリ使用量を妥当な範囲内に保つことが可能です。まず、kubeletパラメータ `--kubelet-reserve` や `--system-reserve` を使用して、ノード（コンテナ外）でのメモリ使用量を明確にします。これにより、[NodeAllocatable](/ja/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable))が削減されます。ワークロードをデプロイするときは、コンテナにリソース制限をかけます（制限のみを設定するか、制限が要求と等しくなければなりません）。これにより、NodeAllocatableも差し引かれ、ノードのリソースがフルな状態になるとSchedulerがPodを追加できなくなります。

過剰なプロビジョニングを回避するためのベストプラクティスは、Windows、Docker、およびKubernetesのプロセスに対応するために、最低2GBのメモリを予約したシステムでkubeletを構成することです。

The behavior of the flags behave differently as described below:

フラグの振舞いについては、次のような異なる動作をします。：

* `--kubelet-reserve`、`--system-reserve`、および `--eviction-hard`フラグはノードの割り当て可能数を更新します
* `--enforce-node-allocable`を使用した排除は実装されていません
* `--eviction-hard` および `--eviction-soft`を使用した排除は実装されていません
* MemoryPressureの制約は実装されていません
* kubeletによって実行されるOOMを排除することはありません
* Windowsノードで実行されているKubeletにはメモリ制限がありません。`--kubelet-reserve` と `--system-reserve`は、ホストで実行されているkubeletまたはプロセスに制限を設定しません。これは、ホスト上のkubeletまたはプロセスが、NodeAllocatableとSchedulerの外でメモリリソース不足を引き起こす可能性があることを意味します。

#### ストレージ

Windowsには、コンテナレイヤーをマウントして、NTFSに基づいて複製されたファイルシステムを作るためのレイヤー構造のファイルシステムドライバーがあります。コンテナ内のすべてのファイルパスは、そのコンテナの環境内だけで決められます。

* ボリュームマウントは、コンテナ内のディレクトリのみを対象にすることができ、個別のファイルは対象にできません
* ボリュームマウントは、ファイルまたはディレクトリをホストファイルシステムに投影することはできません
* WindowsレジストリとSAMデータベースには常に書き込みアクセスが必要であるため、読み取り専用ファイルシステムはサポートされていません。ただし、読み取り専用ボリュームはサポートされています
* ボリュームのユーザーマスクと権限は使用できません。 SAMはホストとコンテナ間で共有されないため、それらの間のマッピングはありません。すべての権限はコンテナの環境内で決められます

その結果、次のストレージ機能はWindowsノードではサポートされません。

* ボリュームサブパスのマウント。 Windowsコンテナにマウントできるのはボリューム全体だけです。
* シークレットのサブパスボリュームのマウント
* ホストマウントプロジェクション
* DefaultMode（UID/GID依存関係による）
* 読み取り専用のルートファイルシステム。マップされたボリュームは引き続き読み取り専用をサポートします
* ブロックデバイスマッピング
* 記憶媒体としてのメモリ
* 特権コンテナを必要とするCSIプラグイン
* uui/guid、ユーザーごとのLinuxファイルシステム権限などのファイルシステム機能
* NFSベースのストレージ/ボリュームのサポート
* マウントされたボリュームの拡張（resizefs）

#### ネットワーキング

Windowsコンテナネットワーキングは、いくつかの重要な点でLinuxネットワーキングと異なります。[Microsoft documentation for Windows Container Networking](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)には、追加の詳細と背景があります。

Windowsホストネットワーキングサービスと仮想スイッチはネームスペースを実装して、Podまたはコンテナの必要に応じて仮想NICを作成できます。ただし、DNS、ルート、メトリックなどの多くの構成は、Linuxのような/etc/...ファイルではなく、Windowsレジストリデータベースに保存されます。コンテナのWindowsレジストリはホストのレジストリとは別であるため、ホストからコンテナへの/etc/resolv.confのマッピングなどの概念は、Linuxの場合と同じ効果をもたらしません。これらは、そのコンテナの環境で実行されるWindows APIを使用して構成する必要があります。したがって、CNIの実装は、ファイルマッピングに依存する代わりにHNSを呼び出して、ネットワークの詳細をPodまたはコンテナに渡す必要があります。

次のネットワーク機能はWindowsノードではサポートされていません

* ホストネットワーキングモードはWindows Podでは使用できません
* ノード自体からのローカルNodePortアクセスは失敗します（他のノードまたは外部クライアントで機能）
* ノードからのService VIPへのアクセスは、Windows Serverの将来のリリースで利用可能になる予定です
* kube-proxyのオーバーレイネットワーキングサポートはアルファリリースです。さらに、[KB4482887](https://support.microsoft.com/en-us/help/4482887/windows-10-update-kb4482887) がWindows Server 2019にインストールされている必要があります
* ローカルトラフィックポリシーとDSRモード
* l2bridge、l2tunnel、またはオーバーレイネットワークに接続されたWindowsコンテナは、IPv6スタックを介した通信をサポートしていません。これらのネットワークドライバーがIPv6アドレスを使用できるようにするために必要な機能として、優れたWindowsプラットフォームの機能があり、それに続いて、kubelet、kube-proxy、およびCNIプラグインといったKubernetesの機能があります。
* win-overlay、win-bridge、およびAzure-CNIプラグインを介したICMPプロトコルを使用したアウトバウンド通信。具体的には、Windowsデータプレーン ([VFP](https://www.microsoft.com/en-us/research/project/azure-virtual-filtering-platform/)) は、ICMPパケットの置き換えをサポートしていません。これの意味は：
  * 同じネットワーク内の宛先に向けられたICMPパケット（pingを介したPod間通信など）は期待どおりに機能し、制限はありません
  * TCP/UDPパケットは期待どおりに機能し、制限はありません
  * リモートネットワーク（Podからping経由の外部インターネット通信など）を通過するように指示されたICMPパケットは置き換えできないため、ソースにルーティングされません。
  * TCP/UDPパケットは引き続き置き換えできるため、 `ping <destination>` を `curl <destination>` に置き換えることで、外部への接続をデバッグできます。

これらの機能はKubernetes v1.15で追加されました。

* `kubectl port-forward`

##### CNIプラグイン

* Windowsリファレンスネットワークプラグインのwin-bridgeとwin-overlayは、[CNI仕様](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0において「CHECK」実装がないため、今のところ実装されていません。
* Flannel VXLAN CNIについては、Windowsで次の制限があります。:

1. Node-podの直接間接続は設計上不可能です。 Flannel [PR 1096](https://github.com/coreos/flannel/pull/1096) を使用するローカルPodでのみ可能です
2. VNI 4096とUDPポート4789の使用に制限されています。VNIの制限は現在取り組んでおり、将来のリリースで解決される予定です（オープンソースのflannelの変更）。これらのパラメーターの詳細については、公式の [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) バックエンドのドキュメントをご覧ください。

##### DNS {#dns-limitations}

* ClusterFirstWithHostNetは、DNSでサポートされていません。Windowsでは、FQDNとしてすべての名前を「.」で扱い、PQDNでの名前解決はスキップします。
* Linuxでは、PQDNで名前解決しようとするときに使用するDNSサフィックスリストがあります。 Windowsでは、1つのDNSサフィックスしかありません。これは、そのPodのNamespaceに関連付けられているDNSサフィックスです（たとえば、mydns.svc.cluster.local）。 Windowsでは、そのサフィックスだけで名前解決可能なFQDNおよびServiceまたはNameでの名前解決ができます。たとえば、defaultのNamespaceで生成されたPodには、DNSサフィックス**default.svc.cluster.local**が付けられます。WindowsのPodでは、**kubernetes.default.svc.cluster.local**と**kubernetes**の両方を名前解決できますが、**kubernetes.default**や**kubernetes.default.svc**のような中間での名前解決はできません。

##### セキュリティ

Sevretはノードのボリュームにクリアテキストで書き込まれます（Linuxのtmpfs/in-memoryの比較として）。これはカスタマーが2つのことを行う必要があります

1. ファイルACLを使用してSecretファイルの場所を保護する
2.  [BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)を使って、ボリュームレベルの暗号化を使用する

[RunAsUser](/ja/docs/concepts/policy/pod-security-policy/#users-and-groups)は、現在Windowsではサポートされていません。回避策は、コンテナをパッケージ化する前にローカルアカウントを作成することです。 RunAsUsername機能は、将来のリリースで追加される可能性があります。

SELinux、AppArmor、Seccomp、特性（POSIX機能）のような、Linux固有のPodセキュリティ環境の権限はサポートされていません。

さらに、既に述べたように特権付きコンテナは、Windowsにおいてサポートされていません。

#### API

ほとんどのKubernetes APIがWindowsでも機能することに違いはありません。OSとコンテナーランタイムに微妙な違いがあります。特定の状況では、PodやコンテナなどのワークロードAPIの一部のプロパティが、Linuxで実装されているが、Windowsでは実行できないことを前提に設計されています。

高いレベルで、これらOSのコンセプトに違いがります。：

* ID - Linuxでは、Integer型として表されるuserID（UID）とgroupID（GID）を使用します。ユーザー名とグループ名は正規ではありません - それらは、UID+GIDの背後にある `/etc/groups` または `/etc/passwd`の単なるエイリアスです。Windowsは、Windows Security Access Manager（SAM）データベースに格納されているより大きなバイナリセキュリティ識別子（SID）を使用します。このデータベースは、ホストとコンテナ間、またはコンテナ間で共有されません。
* ファイル権限 - Windowsは、権限とUID+GIDのビットマスクではなく、SIDに基づくアクセス制御リストを使用します
* ファイルパス - Windowsの規則では、`/` ではなく `\` を使用します。Go IOライブラリは通常両方を受け入れ、それを機能させるだけですが、コンテナ内で解釈されるパスまたはコマンドラインを設定する場合、`\` が必要になる場合があります。
* シグナル - Windowsのインタラクティブなアプリは終了を異なる方法で処理し、次の1つ以上を実装できます。:
  * UIスレッドは、WM_CLOSEを含む明確に定義されたメッセージを処理します
  * コンソールアプリは、コントロールハンドラーを使用してctrl-cまたはctrl-breakを処理します
  * サービスは、SERVICE_CONTROL_STOP制御コードを受け入れることができるサービスコントロールハンドラー関数を登録します。

終了コードは、0が成功、0以外が失敗の場合と同じ規則に従います。特定のエラーコードは、WindowsとLinuxで異なる場合があります。ただし、Kubernetesのコンポーネント（kubelet、kube-proxy）から渡される終了コードは変更されていません。

##### V1.Container

* V1.Container.ResourceRequirements.limits.cpuおよびV1.Container.ResourceRequirements.limits.memory - Windowsは、CPU割り当てにハード制限を使用しません。代わりに、共有システムが使用されます。ミリコアに基づく既存のフィールドは、Windowsスケジューラーによって追従される相対共有にスケーリングされます。[参照: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go)、[参照: resource controls in Microsoft docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/resource-controls)
  * Huge Pagesは、Windowsコンテナランタイムには実装されてないので、使用できません。コンテナに対して設定できない [ユーザー特権を主張](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support) する必要があります。
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
* V1.Pod.shareProcessNamespace - これはベータ版の機能であり、Windowsに実装されていないLinuxのNamespace機能に依存しています。 Windowsでは、プロセスのネームスペースまたはコンテナのルートファイルシステムを共有できません。共有できるのはネットワークだけです。
* V1.Pod.terminationGracePeriodSeconds - これはWindowsのDockerに完全には実装されていません。[リファレンス]（https://github.com/moby/moby/issues/25982）を参照してください。今日の動作では、ENTRYPOINTプロセスにCTRL_SHUTDOWN_EVENTが送信され、Windowsではデフォルトで5秒待機し、最後に通常のWindowsシャットダウン動作を使用してすべてのプロセスをシャットダウンします。5秒のデフォルトは、実際にはWindowsレジストリー[コンテナ内]（https://github.com/moby/moby/issues/25982#issuecomment-426441183）にあるため、コンテナ作成時にオーバーライドできます。
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

Kubernetesクラスターのトラブルシューティングの主なヘルプソースは、この[セクション](/ja/docs/tasks/debug-application-cluster/troubleshooting/)から始める必要があります。このセクションには、いくつか追加的な、Windows固有のトラブルシューティングヘルプが含まれています。ログは、Kubernetesにおけるトラブルシューティング問題の重要な要素です。他のコントリビューターからトラブルシューティングの支援を求めるときは、必ずそれらを含めてください。 SIG-Windows [ログ収集に関するコントリビュートガイド]（https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs）の指示に従ってください。

1. start.ps1が正常に完了したことをどのように確認できますか？

    ノード上でkubelet、kube-proxy、および（ネットワーキングソリューションとしてFlannelを選択した場合）flanneldホストエージェントプロセスが実行され、実行ログが個別のPowerShellウィンドウに表示されます。これに加えて、WindowsノードがKubernetesクラスターで「Ready」として表示されているはずです。

2. Kubernetesノードのプロセスをサービスとしてバックグラウンドで実行するように構成できますか？

    Kubeletとkube-proxyは、ネイティブのWindowsサービスとして実行するように既に構成されています、障害（例えば、プロセスのクラッシュ）が発生した場合にサービスを自動的に再起動することにより、復元性を提供します。これらのノードコンポーネントをサービスとして構成するには、2つのオプションがあります。

    1. ネイティブWindowsサービスとして

        Kubeletとkube-proxyは、`sc.exe` を使用してネイティブのWindowsサービスとして実行できます。

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

    2. nssm.exeの使用

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
        # 詳細については、「KubernetesにWindowsノードを追加するためのガイド」で「pause」を検索してください
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

        最初のトラブルシューティングでは、[nssm.exe]（https://nssm.cc/）で次のフラグを使用して、stdoutおよびstderrを出力ファイルにリダイレクトできます。:

        ```powershell
        nssm set <Service Name> AppStdout C:\k\mysvc.log
        nssm set <Service Name> AppStderr C:\k\mysvc.log
        ```

        詳細については、公式の[nssmの使用法]（https://nssm.cc/usage）のドキュメントを参照してください。

3. Windows Podにネットワーク接続がない

    仮想マシンを使用している場合は、すべてのVMネットワークアダプターでMACスプーフィングが有効になっていることを確認してください。

4. My Windows Pods cannot ping external resources

    Windows Pods do not have outbound rules programmed for the ICMP protocol today. However, TCP/UDP is supported. When trying to demonstrate connectivity to resources outside of the cluster, please substitute `ping <IP>` with corresponding `curl <IP>` commands.

    If you are still facing problems, most likely your network configuration in [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) deserves some extra attention. You can always edit this static file. The configuration update will apply to any newly created Kubernetes resources.

    One of the Kubernetes networking requirements (see [Kubernetes model](/ja/docs/concepts/cluster-administration/networking/)) is for cluster communication to occur without NAT internally. To honor this requirement, there is an [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) for all the communication where we do not want outbound NAT to occur. However, this also means that you need to exclude the external IP you are trying to query from the ExceptionList. Only then will the traffic originating from your Windows pods be SNAT'ed correctly to receive a response from the outside world. In this regard, your ExceptionList in `cni.conf` should look as follows:

    ```conf
    "ExceptionList": [
                    "10.244.0.0/16",  # Cluster subnet
                    "10.96.0.0/12",   # Service subnet
                    "10.127.130.0/24" # Management (host) subnet
                ]
    ```

5. My Windows node cannot access NodePort service

    Local NodePort access from the node itself fails. This is a known limitation. NodePort access works from other nodes or external clients.

6. vNICs and HNS endpoints of containers are being deleted

    This issue can be caused when the `hostname-override` parameter is not passed to [kube-proxy](/ja/docs/reference/command-line-tools-reference/kube-proxy/). To resolve it, users need to pass the hostname to kube-proxy as follows:

    ```powershell
    C:\k\kube-proxy.exe --hostname-override=$(hostname)
    ```

7. With flannel my nodes are having issues after rejoining a cluster

    Whenever a previously deleted node is being re-joined to the cluster, flannelD tries to assign a new pod subnet to the node. Users should remove the old pod subnet configuration files in the following paths:

    ```powershell
    Remove-Item C:\k\SourceVip.json
    Remove-Item C:\k\SourceVipRequest.json
    ```

8. After launching `start.ps1`, flanneld is stuck in "Waiting for the Network to be created"

    There are numerous reports of this [issue which are being investigated](https://github.com/coreos/flannel/issues/1066); most likely it is a timing issue for when the management IP of the flannel network is set. A workaround is to simply relaunch start.ps1 or relaunch it manually as follows:

    ```powershell
    PS C:> [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
    PS C:> C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
    ```

9. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

    This indicates that Flannel didn't launch correctly. You can either try to restart flanneld.exe or you can copy the files over manually from `/run/flannel/subnet.env` on the Kubernetes master to` C:\run\flannel\subnet.env` on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different number. For example, if node subnet 10.244.4.1/24 is desired:

    ```env
    FLANNEL_NETWORK=10.244.0.0/16
    FLANNEL_SUBNET=10.244.4.1/24
    FLANNEL_MTU=1500
    FLANNEL_IPMASQ=true
    ```

10. My Windows node cannot access my services using the service IP

    This is a known limitation of the current networking stack on Windows. Windows Pods are able to access the service IP however.

11. No network adapter is found when starting kubelet

    The Windows networking stack needs a virtual adapter for Kubernetes networking to work. If the following commands return no results (in an admin shell), virtual network creation — a necessary prerequisite for Kubelet to work — has failed:

    ```powershell
    Get-HnsNetwork | ? Name -ieq "cbr0"
    Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
    ```

    Often it is worthwhile to modify the [InterfaceName](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/start.ps1#L6) parameter of the start.ps1 script, in cases where the host's network adapter isn't "Ethernet". Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.

12. My Pods are stuck at "Container Creating" or restarting over and over

    Check that your pause image is compatible with your OS version. The [instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources) assume that both the OS and the containers are version 1803. If you have a later version of Windows, such as an Insider build, you need to adjust the images accordingly. Please refer to the Microsoft's [Docker repository](https://hub.docker.com/u/microsoft/) for images. Regardless, both the pause image Dockerfile and the sample service expect the image to be tagged as :latest.

    Starting with Kubernetes v1.14, Microsoft releases the pause infrastructure container at `mcr.microsoft.com/k8s/core/pause:1.2.0`. For more information search for "pause" in the [Guide for adding Windows Nodes in Kubernetes](../user-guide-windows-nodes).

13. DNS resolution is not properly working

    Check the DNS limitations for Windows in this [section](#dns-limitations).

14. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

    This was implemented in Kubernetes 1.15, and the pause infrastructure container `mcr.microsoft.com/k8s/core/pause:1.2.0`. Be sure to use these versions or newer ones.
    If you would like to build your own pause infrastructure container, be sure to include [wincat](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat)

### Further investigation

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

## Reporting Issues and Feature Requests

If you have what looks like a bug, or you would like to make a feature request, please use the [GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues). You can open issues on [GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose) and assign them to SIG-Windows. You should first search the list of issues in case it was reported previously and comment with your experience on the issue and add additional logs. SIG-Windows Slack is also a great avenue to get some initial support and troubleshooting ideas prior to creating a ticket.

If filing a bug, please include detailed information about how to reproduce the problem, such as:

* Kubernetes version: kubectl version
* Environment details: Cloud provider, OS distro, networking choice and configuration, and Docker version
* Detailed steps to reproduce the problem
* [Relevant logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)
* Tag the issue sig/windows by commenting on the issue with `/sig windows` to bring it to a SIG-Windows member's attention



## {{% heading "whatsnext" %}}


We have a lot of features in our roadmap. An abbreviated high level list is included below, but we encourage you to view our [roadmap project](https://github.com/orgs/kubernetes/projects/8) and help us make Windows support better by [contributing](https://github.com/kubernetes/community/blob/master/sig-windows/).

### CRI-ContainerD

{{< glossary_tooltip term_id="containerd" >}} is another OCI-compliant runtime that recently graduated as a {{< glossary_tooltip text="CNCF" term_id="cncf" >}} project. It's currently tested on Linux, but 1.3 will bring support for Windows and Hyper-V. [[reference](https://blog.docker.com/2019/02/containerd-graduates-within-the-cncf/)]

The CRI-ContainerD interface will be able to manage sandboxes based on Hyper-V. This provides a foundation where RuntimeClass could be implemented for new use cases including:

* Hypervisor-based isolation between pods for additional security
* Backwards compatibility allowing a node to run a newer Windows Server version without requiring containers to be rebuilt
* Specific CPU/NUMA settings for a pod
* Memory isolation and reservations

### Hyper-V isolation

The existing Hyper-V isolation support, an experimental feature as of v1.10, will be deprecated in the future in favor of the CRI-ContainerD and RuntimeClass features mentioned above. To use the current features and create a Hyper-V isolated container, the kubelet should be started with feature gates `HyperVContainer=true` and the Pod should include the annotation `experimental.windows.kubernetes.io/isolation-type=hyperv`. In the experiemental release, this feature is limited to 1 container per Pod.

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

### Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes cluster. Windows node support in kubeadm will come in a future release. We are also making investments in cluster API to ensure Windows nodes are properly provisioned.

### A few other key features
* Beta support for Group Managed Service Accounts
* More CNIs
* More Storage Plugins


