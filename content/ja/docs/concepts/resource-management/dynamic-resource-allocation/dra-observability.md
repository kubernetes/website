---
title: 動的リソースの可観測性
content_type: concept
weight: 30
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
---

<!-- overview -->

このページでは、DRAで動的に割り当てられたリソースのステータスと正常性を観測する方法について説明します。

<!-- body -->

## 動的リソースの可観測性 {#observability-dynamic-resources}

動的に割り当てられたリソースのステータスは、次のいずれかの方法で確認できます:

* [kubeletのデバイスメトリクス](#monitoring-resources)
* [ResourceClaimのステータス](#resourceclaim-device-status)
* [デバイスの正常性の監視](#device-health-monitoring)

### kubeletのデバイスメトリクス {#monitoring-resources}

kubeletの`PodResourcesLister` gRPCサービスを使用すると、使用中のデバイスを監視できます。
`DynamicResource`メッセージは、デバイス名やクレーム名など、動的リソース割り当てに固有の情報を提供します。
詳細については[デバイスプラグインリソースの監視](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)を参照してください。

### ResourceClaimのデバイスステータス {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

DRAドライバーは、ResourceClaimの`status.devices`フィールドに、割り当てられた各デバイスについてのドライバー固有の[デバイスステータス](/docs/concepts/overview/working-with-objects/#object-spec-and-status)データを報告できます。
例えば、ドライバーはネットワークインターフェースデバイスに割り当てられたIPアドレスを一覧表示します。
このフィールドを更新するには、専用のsynthetic RBAC権限が必要です。
[堅牢化ガイド - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)および[クラスターのDynamic Resource Allocationを堅牢化する](/docs/tasks/administer-cluster/hardening-dra/)を参照してください。

ドライバーがResourceClaimの`status.devices`フィールドに追加する情報の正確性は、ドライバーの実装によって異なります。
このフィールドのみをデバイス情報の唯一の情報源として利用できるかどうかは、ドライバーを評価した上で判断してください。

[`DRAResourceClaimDeviceStatus`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus)を無効にすると、ResourceClaimの保存時に`status.devices`フィールドは自動的に消去されます。
ResourceClaimのデバイスステータスは、DRAドライバーから`status.devices`フィールドが設定された既存のResourceClaimを更新できる場合にサポートされます。

次の例では、ResourceClaimの`status.devices`フィールドが、割り当てられたデバイスの管理を担当するドライバー(`resource-driver.example.com`)によって設定されています:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: macvlan-eth0
spec:
...
status:
  allocation:
    devices:
      results:
      - device: eth0
        driver: resource-driver.example.com
        pool: nic-worker-a
        request: macvlan-eth0
        shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
        consumedCapacity:
          resource-driver.example.com/bandwidth: 1G
  devices:
  - conditions:
    - lastTransitionTime: "2025-10-21T08:38:17Z"
      message: Device successfully allocated and assigned to the pod
      reason: NetworkReady
      status: "True"
      type: NetworkReady
    device: eth0
    driver: resource-driver.example.com
    networkData:
      hardwareAddress: 00:01:ec:84:fb:51
      interfaceName: net1
      ips:
      - 10.10.1.2/24
      - 2001:db8::1/64
    pool: nic-worker-a
    shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
```

デバイスが割り当てられていない場合、そのデバイスを持つResourceClaimの`status.devices`フィールドを更新するドライバーからのリクエストは拒否されます。
デバイスが(`status.allocation.devices`から削除されて)割り当て解除されると、対応する`status.devices`のエントリも自動的に削除されます。

`status.devices`フィールドの詳細については、{{< api-reference page="resource/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} APIリファレンスを参照してください。

### デバイスの正常性の監視 {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Kubernetesは、動的に割り当てられたインフラストラクチャーリソースの正常性を監視し、その状態を報告する仕組みを提供します。
特殊なハードウェア上で動作するステートフルなアプリケーションでは、デバイスが故障したり異常な状態になったりしたことを把握できることが重要です。
また、デバイスが正常な状態に復旧したことを確認できることも有用です。

この機能を使用するには、`ResourceHealthStatus`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/)を有効にする必要があり(v1.36以降ではベータ機能であり、既定で有効です)、DRAドライバーは、`DRAResourceHealth` gRPCサービスを実装している必要があります。

DRAドライバーが、割り当てられたデバイスが異常な状態になったことを検出すると、その状態をkubeletに報告します。
この正常性の情報は、その後、Podのステータスに直接反映されます。
kubeletは各コンテナのステータスにある`allocatedResourcesStatus`フィールドを設定し、そのコンテナに割り当てられた各デバイスの正常性を記録します。
各リソースの正常性情報には、エラーの詳細や障害の原因など、正常性の状態に関する可読な追加のコンテキストを含む、オプションの`message`フィールドを含めることができます。

kubeletが一定時間内にDRAドライバーから正常性の更新を受信できなかった場合、そのデバイスの正常性は"Unknown"として記録されます。
DRAドライバーは、`DeviceHealth` gRPCメッセージの`health_check_timeout_seconds`フィールドを設定することで、デバイス毎のタイムアウトを設定できます。
値を指定しない場合、kubeletは既定で30秒のタイムアウトを使用します。
これにより、(GPU、FPGA、ストレージデバイスなど)異なる種類のハードウェアごとにその正常性報告の特性に応じた適切なタイムアウト値を使用できます。

これにより、利用者やコントローラーは、ハードウェア障害に対応するために重要な情報を得られます。
失敗しているPodに対して、このステータスを確認することで、その原因がデバイスの異常に関連しているかどうかを判断できます。

{{< note >}}
Podが終了した後(例えばFailed状態)は、Podのステータス内のデバイスの正常性は更新されません。
{{< /note >}}

## リソースプールステータス {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

ResourcePoolStatusRequest APIを使用すると、リソースプール内のデバイスの利用状況を確認できます。
これにより、クラスター内のDRAリソースプール全体で、利用可能、割り当て済み、利用できないデバイスが何台あるか可視化できます。

リソースプールのステータスを確認するには、次を実行します:

1. ドライバー名(必須)とオプションで返されるプールの数の上限値を指定して、ResourcePoolStatusRequestを作成します。
   プール名を指定することで、単一のプールに限定することもできます:

   ```yaml
   apiVersion: resource.k8s.io/v1alpha3
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # オプション: 特定のプールに限定する
     # poolName: my-pool
     # オプション: 返されるプール数の上限 (既定値: 100, 最大値: 1000)
     # limit: 10
   ```

1. コントローラーがリクエストを処理するまで待ちます:

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

1. プールの利用状況を確認するために、statusを読みます:

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   statusには次が含まれます:
   - `poolCount`: フィルターに一致するプールの総数(limitによって結果が切り詰められた場合、一覧表示されているプール数を超える可能性があります)。
   - `pools`: 各項目に次の情報が含まれるプールの詳細のリスト:
     - `driver`および`poolName`: プールを識別します。
     - `generation`: ResourceSlice全体で確認された最新のプールの世代。
     - `resourceSliceCount`: プールを構成するResourceSliceの数。
     - `totalDevices`: プール内のデバイスの総数。
     - `allocatedDevices`: 現在クレームに割り当てられているデバイスの数。
     - `availableDevices`: 割り当て可能なデバイスの数(totalDevices - allocatedDevices - unavailableDevices)。
     - `unavailableDevices`: taintまたはその他の条件によって利用できないデバイスの数。
     - `nodeName`: もし存在する場合、プールに関連付けられているノード。
     - `validationError`: プールのデータを完全に検証できなかった場合に設定(例えば、世代のロールアウト中)。
       設定されている場合、デバイス数に関するフィールドが設定されないことがあります。
     - `partitionSummary`: [パーティション可能](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)なプールに対する、パーティションタイプごとの割り当て可能性([パーティションサマリー](#resource-pool-partition-summary)を参照)。
     - `shareableSummary`: [共有可能デバイス](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)を持つプールに対する、容量の使用状況の集計([共有可能なサマリー](#resource-pool-shareable-summary)を参照)。
   - `conditions`: `Complete`(成功)または`Failed`(エラー)の状態の種類が含まれます。

1. 完了したら、リクエストを削除します:

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

ResourcePoolStatusRequestオブジェクトは、kube-controller-manager内のコントローラーによって1回だけ処理されます。
specは一度作成されると変更ができず、statusが設定されるとオブジェクト全体が変更できなくなります。
更新された利用状況データを取得するには、リクエストを削除して再作成します。
完了したリクエストは1時間後に自動的にクリーンアップされます。

この機能には、ResourcePoolStatusRequestリソースに対する明示的なRBAC権限が必要です。
この権限を含む既定のClusterRoleはありません。

リソースプールのステータスは、`kube-apiserver`と`kube-controller-manager`で[`DRAResourcePoolStatus`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)が有効になっている場合にのみ使用できます。

### パーティションサマリー {#resource-pool-partition-summary}

{{< feature-state feature_gate_name="DRAPartitionableDevicesType" >}}

GPUなどの単体の物理デバイスは、同じ共有カウンターから消費する複数のパーティションタイプ(例えばGPU全体と半分のサイズのMIGスライス)として公開される場合があります。
これらのパーティションは基盤の同じ容量を取り合うため、単純なデバイス数だけでは、それぞれのタイプについてあと何個割り当てられるか判断できません。
[パーティション可能](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)なプールでは、`partitionSummary`のビューがこの問いに答えます。
各パーティションタイプについて、次の情報が報告されます:

- `attribute`: このエントリをグループ化するデバイス属性の完全修飾名です。
  ResourceSliceの`spec.partitionTypeAttribute`、またはスライスに宣言がない場合はリクエストの`spec.defaultPartitionTypeAttribute`となります。
- `type`: デバイスにおけるその属性の値です(例えば、`Full`や`Half`)。
- `total`: プール内にあるこのパーティションタイプのデバイス数です。
- `allocatable`: 現在の共有カウンターの消費状況をふまえて、このパーティションタイプについてまだ割り当てが可能な*追加*のデバイス数です。

指定する属性は文字列型の属性である必要があります。
パーティション可能なデバイスにパーティションタイプ属性がない場合や文字列型ではない場合(例えば、整数、ブール値、バージョン値)、プールはパーティションサマリーを返さずに検証エラーを報告します。
[リスト型属性](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes)について特別な扱いはありません。
文字列型ではない属性は、単にパーティションタイプ属性として有効なものではありません。

このビューを生成するために、ドライバーはパーティション可能な各デバイスに対して、そのパーティションタイプを値に持つ文字列型の属性のラベルを付与し、その属性をResourceSliceの`partitionTypeAttribute`フィールドで指定します:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# ...
spec:
  # このスライス内のすべてのパーティション可能なデバイスに、この属性が付与されます。
  # 値を共有するデバイスは、同じ共有カウンターのコストを共有します。
  partitionTypeAttribute: gpu.example.com/profile
```

ドライバーがまだ`partitionTypeAttribute`を宣言するように更新されていない場合でも、リクエストはspecの中でフォールバック属性を指定することで、パーティションサマリーを取得することができます。
スライス自身の`partitionTypeAttribute`が常に優先されます。
リクエストレベルの既定値が適用されるのは、スライスでそれが宣言されていないデバイスのみです:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: ResourcePoolStatusRequest
metadata:
  name: check-gpu-partitions
spec:
  driver: gpu.example.com
  # スライス自身が宣言していない場合のフォールバックとなるグループ属性
  defaultPartitionTypeAttribute: gpu.example.com/profile
```

スライスとリクエストのどちらでも属性が指定されていない場合、パーティション可能なプールは`partitionSummary`を報告しません。

`partitionSummary`ビューは`kube-apiserver`と`kube-controller-manager`の[`DRAPartitionableDevicesType`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevicesType)で制御され、有効にするには、[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)と[`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)のフィーチャーゲートも必要です。

### 共有可能なサマリー {#resource-pool-shareable-summary}

[共有可能なデバイス](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)(`allowMultipleAllocations`を設定し、複数のクレームから使用可能なデバイス)を含むプールでは、`shareableSummary`によってプール全体の容量の使用状況の集計が報告されます:

- `fullyAvailableDevices`: 容量がまったく消費されていない共有可能なデバイスの数です。
- `partiallyAvailableDevices`: 一部の容量が消費され、すべての容量は消費されていない共有可能なデバイスの数です。
- `capacity`: 容量名ごとの、プール全体の`total`、`consumed`、`available`(`total`から`consumed`を引いた値で、負の値にはならない)の集計です。

`shareableSummary`はプール内の少なくとも1つのデバイスが共有可能である場合にのみ設定されます。
これは[リソースプールのステータス](#resource-pool-status)の機能([`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)フィーチャーゲート)の一部であり、`DRAPartitionableDevicesType`は必要としません。
サマリーの対象となる共有可能なデバイスは、[消費可能容量](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)の機能によって提供されます。


## コンテナ内のDRAデバイスメタデータ {#device-metadata}

{{< feature-state state="beta" for_k8s_version="v1.37" >}}

DRAドライバーは、デバイス属性(PCIバスアドレスやmediatedデバイスUUIDなど)やネットワーク構成などのデバイスメタデータをJSONファイルとしてコンテナに直接公開できます。
これにより、アプリケーションは、Kubernetes APIに問い合わせたり、カスタムコントローラーを使用せずに、割り当てられたデバイスの情報を取得できます。

KEP-5304では、アプリケーションがドライバーやクラスターを問わず一貫したレイアウトを参照できるように、ドライバーが従うべき[デバイスメタデータプロトコル](#device-metadata-protocol)が定義されています。
[DRA kubeletプラグインライブラリ](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)は、このプロトコルを実装しています。

デバイスメタデータは、デバイスアクセスと同じ規則に従います。
コンテナがデバイスを要求している場合にのみ、そのコンテナ内で利用できます。
詳細については、[DRAを使用してワークロードでデバイスを要求する](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads)を参照してください。

### デバイスメタデータプロトコル {#device-metadata-protocol}

このプロトコルは、次の4つのルールで構成されます。

1. **ファイルパス:**
   メタデータファイルは、コンテナ内の`/var/run/kubernetes.io/dra-device-attributes`配下に配置されます。
   ResourceClaimを直接参照する場合、パスは`resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`です。
   ResourceClaimTemplateから作成されたクレームの場合、パスは`resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`です(`podClaimName`は`pod.spec.resourceClaims[].name`)。

   [優先度付きリスト](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#prioritized-list)を使用するリクエストの場合、`<requestName>`パスセグメントには最上位のリクエスト名のみが使用されます。
   ファイル内の`requests[].name`フィールドには、`gpu/high-memory`のような完全な`<request>/<subrequest>`の参照が含まれます。

   パスの定数は[`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata)で定義されています。

1. **JSON API:**
   各ファイルは、1つ以上の[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)オブジェクトのストリームです。
   各オブジェクトは、Kubernetes APIの規則に従って`apiVersion`と`kind`を持ちます。
   同じメタデータが、ドライバーによって選択された順で、APIバージョン毎に1度ずつエンコードされます。
   コンシューマーはデコードが可能な最初のバージョンを使用し、不明なバージョンはスキップします。
   既知のバージョンの不正なオブジェクトはエラーになります。

1. **世代:**
   初期ファイルでは`metadata.generation`が1に設定されます。
   コンシューマーが変更を検出できるように、アップデートごとにgenerationを加算します。

1. **コンテナへの公開:**
   DRA kubeletプラグインライブラリは、{{< glossary_tooltip text="CDI" term_id="cdi" >}}を使用して各ファイルを読み取り専用でbind-mountします。
   その他の実装では、必要なパスにファイルが存在し、読み取り専用になっている限り、別のメカニズムを使用できます。

### ドライバーでデバイスメタデータを有効にする {#device-metadata-enable}

デバイスメタデータはドライバー側の機能です。
Kubernetesのフィーチャーゲートはなく、DRA kubeletプラグインライブラリでは既定で無効になっています。
ドライバーはこの機能を有効にし、書き込むバージョンを明示的に選択する必要があります:

```go
kubeletplugin.EnableDeviceMetadata(true, []schema.GroupVersion{
	metadatav1beta1.SchemeGroupVersion,
	metadatav1alpha1.SchemeGroupVersion,
})
```

バージョン`v1beta1`は必須です。
ドライバーは古いコンシューマーとの互換性のために`v1alpha1`も書き込むことができます。
スライス内での順番は、メタデータストリーム内での順番になります。
フレームワークはバージョンでソートしません。
ドライバーは新しいバージョンを先に指定すべきです。
バージョンを指定せずにデバイスメタデータを有効にした場合、`v1beta1`が含まれていない場合、または認識されないバージョンを指定した場合は、プラグインは起動時に失敗します。

準備された各デバイスについて、ドライバーは[`kubeletplugin.DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#DeviceMetadata)と共に[`Device.Metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Device)を設定できます。
ドライバーは、ワークロードが実行時に同じ情報を確認できるように、そのデバイスについてResourceSliceで公開している属性をメタデータに含めるべきです。
ドライバーは、実行時にのみ関連する属性を含めることもできます。
ネットワークデバイスでは、CNIの構成後に[`UpdateRequestMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Helper.UpdateRequestMetadata)を呼び出すことで、ドライバーはインターフェース名、IPアドレス、ハードウェアアドレスを追加できます。

上記のkubeletプラグインAPIのリンクでは、ドライバー作成者向けの統合方法について説明しています。
DRAフレームワークでは、汎用的なコマンドラインフラグを定義していないため、クラスター管理者はドライバーによって提供されるデプロイ構成を通じてこの機能を有効にします。

有効にすると、DRA kubeletプラグインライブラリは、割り当てられたデバイスの準備中にメタデータファイルを書き込みます。
また、既定で`/var/run/cdi`にCDI仕様を書き込みます。
コンテナランタイムは、そのディレクトリからCDI仕様を検出するよう構成されている必要があります。
ライブラリは、生成された各仕様に対して、必要な最小のCDI仕様バージョンを決定します。

1つのリクエストで複数のDRAドライバーからデバイスが割り当てられる場合、各ドライバーは独自のメタデータファイルを書き込みます。
ドライバー名がわかっているコンシューマーは、クレーム、リクエストそしてドライバー名から正確なパスを構成すべきです。
Goのコンシューマーは、[`ReadResourceClaimMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimMetadata)または[`ReadResourceClaimTemplateMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimTemplateMetadata)を使用して、リクエストに対応するすべてのドライバーごとのファイルの読み取り、マージを行うことができます。

### メタデータスキーマ {#device-metadata-schema}

メタデータファイルの各オブジェクトは[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1beta1`)に準拠します。

スキーマには、次のものが含まれます:

- 名前、Namespace、UID、メタデータのgenerationなどの、ResourceClaimの標準的なオブジェクトメタデータ。
- クレームがResourceClaimTemplateから生成された場合、オプションの`podClaimName`。
- リクエストの一覧。
  各リクエストには、必須の名前と割り当てられたデバイスの一覧が含まれます。
- 各デバイスのドライバー、プール、名前。
- オプションのデバイス属性とネットワークデータ。

属性値は、ResourceSliceデバイス属性と同じ表現を使用します。
各属性は、ただ一つのスカラー値(`int`、`bool`、`string`または`version`)、またはリスト値(`ints`、`bools`、`strings`、または`versions`)を持ちます。
デバイス容量の値は、デバイスメタデータには含まれません。

ネットワークデータには`interfaceName`、`ips`、`hardwareAddress`を含めることができます。
フィールドの制約については、[`DeviceMetadata` APIドキュメント](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)を参照してください。

次の例は、ResourceClaimTemplateを介して割り当てられたGPUデバイスのメタデータストリーム中の1オブジェクトを示しています:

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1beta1",
  "metadata": {
    "name": "pod0-gpu-2kqrd",
    "namespace": "gpu-test1",
    "uid": "c7e7b22e-239b-4498-b27c-7f1344481e14",
    "generation": 1
  },
  "podClaimName": "gpu",
  "requests": [
    {
      "name": "gpu",
      "devices": [
        {
          "driver": "gpu.example.com",
          "pool": "worker-0",
          "name": "gpu-0",
          "attributes": {
            "driverVersion": {
              "version": "1.0.0"
            },
            "index": {
              "int": 0
            },
            "model": {
              "string": "LATEST-GPU-MODEL"
            },
            "uuid": {
              "string": "gpu-18db0e85-99e9-c746-8531-ffeb86328b39"
            }
          }
        }
      ]
    }
  ]
}
```

DRA kubeletプラグインは、メタデータを書き込む前に検証を行いません。
Goのコンシューマーは、ストリームをデコードするときに、生成された検証をオプトインできます。
デコードと検証は別々の結果を持ちます:
検証エラーが発生しても、正常にデコードされたオブジェクトが返されることを妨げません。
使用方法については、[DRAデバイスメタデータへのアクセス](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/#read-metadata-application)を参照してください。

### 即時メタデータと遅延メタデータ {#device-metadata-lifecycle}

即時メタデータでは、ドライバーはクレームの準備中に属性またはネットワークデータを提供します。
DRA kubeletプラグインは、使用するコンテナが起動する前に、generationが`1`のファイルを書き込みます。

遅延メタデータでは、ドライバーは属性やネットワークデータを持たずにデバイスを準備できます。
generationが`1`の初期ファイルには、デバイスの識別子が含まれます。
その後、ドライバーは`UpdateRequestMetadata`を呼び出して、完全なストリームをアトミックに置き換え、generationを加算します。
更新をするには、初期ファイルが存在している必要があります。
リクエストに対するデバイスの準備でデバイスが1つも返されなかった場合、フレームワークはそのリクエストに対するメタデータファイルもメタデータCDIデバイスも作成しません。

メタデータは、そのメタデータを使用する各コンテナの存続期間中、利用できます。
フレームワークはクレームの準備解除が完了した後に、メタデータファイルおよびCDI仕様を削除します。

ワークロードでデバイスメタデータを使用する方法については、[DRAデバイスメタデータにアクセスする](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)を参照してください。

### カスタムドライバー {#device-metadata-custom-drivers}

DRA kubeletプラグインライブラリを使用しないカスタムドライバーは、[デバイスメタデータプロトコル](#device-metadata-protocol)を独自に実装する必要があります。
これには、バージョン付きの`DeviceMetadata`ストリームを正しいパスに書き込むこと、更新のたびに`metadata.generation`を増やすこと、CDIまたは同等の仕組みを使用してファイルを読み取り専用で公開することが含まれます。
