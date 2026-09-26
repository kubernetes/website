---
title: Dynamic Resource Allocation
content_type: concept
weight: 20
no_list: true
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

このセクションではKubernetesの _Dynamic Resource Allocation (DRA)_ について説明します。

{{< glossary_definition prepend="DRAは、" term_id="dra" length="all" >}}

DRAによるリソースの割り当ては、PersistentVolumeClaimを使用してストレージクラスからストレージ容量を _要求_ し、その要求した容量をPodで利用する、[ボリュームの動的プロビジョニング](/docs/concepts/storage/dynamic-provisioning/)と似た仕組みです。

<!-- body -->

### DRAの利点 {#dra-benefits}

DRAは、クラスター内のデバイスを分類、要求、利用するための柔軟な方法を提供します。
DRAを使用することで、次のような利点が得られます:

* **柔軟なデバイスフィルタリング**: Common Expression Language (CEL)を使用して、特定のデバイス属性に対するきめ細かなフィルタリングが行えます。
* **デバイス共有**: 対応するResourceClaimを参照することで、複数のコンテナやPodで同じリソースが共有できます。
* **デバイス構成**: ベンダー固有のデバイス構成をResourceClaimに関連付けることで、現在のノード単位でのデバイス構成ではなく、ワークロードごとにデバイスを構成できます。
* **デバイス分類の一元化**: デバイスドライバーとクラスター管理者は、さまざまなユースケース向けに最適化されたハードウェアカテゴリを、DeviceClassを使用してアプリケーション運用者に提供できます。
  例えば、汎用ワークロード向けのコスト最適化されたDeviceClassや、クリティカルなジョブ向けの高性能なDeviceClassを作成できます。
* **Pod要求の簡素化**: DRAでは、アプリケーション運用者がPodのリソース要求でデバイス数を指定する必要はありません。
  代わりに、PodはResourceClaimを参照し、そのクレーム内のデバイス設定がPodに適用されます。

コンテナごとにデバイス要求が必要であり、デバイス共有や式ベースのデバイスフィルタリングをサポートしていない[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)と比較して、これらの利点は、デバイス割り当てのワークフローを大幅に改善します。

### DRAユーザーの種類 {#dra-user-types}

DRAを使用したデバイス割り当てのためのワークフローには、次の種類のユーザーが関与します:

* **デバイス所有者**: デバイスの管理を担当します。
  デバイス所有者は商用ベンダー、クラスター運用者、またはその他の管理主体である場合があります。
  DRAを使用するためには、デバイスに次の処理を行うDRA対応のドライバーが必要です:

  * ノードとリソースに関する情報をKubernetesに提供するResourceSliceを作成する。
  * クラスター内のリソース容量が変化した際に、ResourceSliceを更新する。
  * クレームに従ってデバイスを構成し、Container Device Interface (CDI)を介してコンテナに接続する。
  * オプションとして、ワークロード運用者がデバイスを要求するために使用できるDeviceClassを作成する。

* **クラスター管理者**: クラスターやノードの設定、デバイスの接続、ドライバーのインストールなどのタスクを担当します。
  DRAを使用するために、クラスター管理者は次の作業を行います:

  * ノードにデバイスを接続する。
  * DRAをサポートするデバイスドライバーをインストールする。
  * オプションとして、ワークロード運用者がデバイスを要求するために使用できるDeviceClassを作成する。

* **ワークロード運用者**: クラスター内のワークロードのデプロイおよび管理を担当します。
  DRAを使用してPodにデバイスを割り当てるために、ワークロード運用者は次の作業を行います:

  * DeviceClass内の特定の構成を要求するために、ResourceClaimまたはResourceClaimTemplateを作成する。
  * 特定のResourceClaimまたはResourceClaimTemplateを使用するワークロードをデプロイする。

## 制限事項 {#limitations}

* Kubernetesスケジューラーは、DRAリソースの[プリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)をサポートしていません。
  つまり、DRAリソースを使用しているノード上で実行中の既存のPodは、同じくDRAリソースを必要とする優先度の高いPodによってプリエンプトされることはありません。
  優先度の高いPodは、競合しているPodが終了するか手動で削除されることによってデバイスが利用可能になるまで、保留状態のままです。

## {{% heading "whatsnext" %}}

- [クラスターのDRAをセットアップする](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [DRAを使用してワークロードにデバイスを割り当てる](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [DRAデバイスメタデータにアクセスする](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- 設計に関する詳細は、KEPの[構造化パラメーターを使用したDynamic Resource Allocation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)を参照してください。
