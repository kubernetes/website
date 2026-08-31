---
title: DRAの動作する仕組み
content_type: concept
weight: 20
---

<!-- overview -->

このページでは、KubernetesがDynamic Resource Allocation (DRA)を使用してワークロードにデバイスを割り当てる方法と、事前にスケジュールされたPodがこのプロセスと連携する方法について説明します。

<!-- body -->

## DRAによるリソース割り当ての仕組み {#how-it-works}

以降のセクションでは、Dynamic Resource Allocationにおける、さまざまな[DRAユーザーの種類](/docs/concepts/resource-management/dynamic-resource-allocation/#dra-user-types)およびKubernetesシステムのワークフローについて説明します。

### ユーザーに対するワークフロー {#user-workflow}

1. **ドライバーの作成**: デバイス所有者またはサードパーティが、クラスター内でResourceSliceを作成および管理できるドライバーを作成します。
   これらのドライバーは、必要に応じて、デバイスのカテゴリとその要求方法を定義するDeviceClassも作成します。
1. **クラスターの構成**: クラスター管理者は、クラスターを作成し、ノードにデバイスを接続して、DRAデバイスドライバーをインストールします。
   クラスター管理者は、必要に応じて、デバイスのカテゴリとその要求方法を定義するDeviceClassを作成します。
1. **リソース要求**: ワークロード運用者は、DeviceClass内の特定のデバイス構成を要求するResourceClaimTemplateまたはResourceClaimを作成します。
   同時に、それらのResourceClaimTemplateまたはResourceClaimを要求するようにKubernetesマニフェストを変更します。

### Kubernetesに対するワークフロー {#kubernetes-workflow}

1. **ResourceSliceの作成**: クラスター内のドライバーは、同種のデバイスから構成される管理対象のプール内の1つ以上のデバイスを表すResourceSliceを作成します。
1. **ワークロードの作成**: クラスターのコントロールプレーンは、新しいワークロードがResourceClaimTemplateまたは特定のResourceClaimを参照しているかどうかを確認します。

   * ワークロードがResourceClaimTemplateを使用している場合、`resourceclaim-controller`という名前のコントローラーが、そのワークロード用のResourceClaimを生成します。
   * ワークロードが特定のResourceClaimを使用している場合、KubernetesはそのResourceClaimがクラスター内に存在するかどうかを確認します。
     ResourceClaimが存在しない場合、Podはデプロイされません。

1. **ResourceSliceのフィルタリング**: Podごとに、Kubernetesはクラスター内のResourceSliceを調べて、次のすべての条件を満たすデバイスを探します:

   * リソースにアクセスできるノードが、そのPodを実行可能であること。
   * ResourceSliceにPodのResourceClaimの要件を満たす未割り当てのリソースがあること。

1. **リソースの割り当て**: PodのResourceClaimに対して条件を満たすResourceSliceが見つかると、Kubernetesスケジューラーは、そのResourceClaimを割当ての詳細で更新します。
   スケジューラーは先頭一致戦略を採用しており、プールおよびResourceSliceを名前の辞書順で評価します。
   ドライバーは、適切な名前をつけることで、特定のスライスやプールの優先度を高めることができます。
   詳細については、[名前付けと優先度](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceslice-naming-and-prioritization)を参照してください。
1. **Podのスケジューリング**: リソースの割り当てが完了すると、スケジューラーは割り当てられたリソースにアクセスできるノードにPodを配置します。
   デバイスドライバーとそのノード上の`kubelet`は、gRPCを介して連携し、デバイスとPodのデバイスへのアクセスを構成します。
   ただしドライバーが、ノードローカルでの準備やクリーンアップを必要としないデバイスについて、[オプションのノード操作](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)を宣言している場合を除きます。

## 事前にスケジュールされたPod {#pre-scheduled-pods}

`spec.nodeName`がすでに設定されたPodを、ユーザーまたは他のAPIクライアントが作成すると、スケジューラーがバイパスされます。
そのPodが必要とするいくつかのResourceClaimがまだ存在しない、割り当てられていない、またはそのPod用に予約されていない場合、kubeletはPodの実行に失敗し、これらの要件が後から満たされる可能性があるため、定期的に再確認します。

このような状況は、Podがスケジュールされた時点で、スケジューラーでDynamic Resource Allocationのサポートが有効になっていなかった場合(バージョンスキュー、構成、フィーチャーゲートなど)にも発生する可能性があります。
kube-controller-managerはこの状況を検出し、必要なResourceClaimを予約することでPodを実行可能な状態にしようとします。
ただし、これが機能するのは、それらが別のPodのためにスケジューラーによって割り当てられた場合のみです。

ノードに割り当てられたPodが停止している間、通常のリソース(RAMやCPU)を占有し、他のPodがそれらを使用できなくなるため、スケジューラーのバイパスは避けることが推奨されます。
通常のスケジューリングフローを通しながらPodを特定のノードで実行させるには、目的のノードに完全に一致するノードセレクターを指定してPodを作成します:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

また、アドミッション時に受信したPodを変更し、`.spec.nodeName`フィールドを未設定にして、代わりにノードセレクターを使用することもできます。

## デバイスのバインディング条件 {#device-binding-conditions}

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

デバイスバインディング条件により、Kubernetesスケジューラーは、ファブリック接続型GPUや再プログラム可能なFPGAなどの外部リソースの準備が完了したと確認されるまで、Podのバインディングを遅延させることができます。

この待機動作は、スケジューリングフレームワークの[PreBindフェーズ](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)で実装されています。
このフェーズでは、スケジューラーはバインディングを続行する前に、すべての必要なデバイス条件が満たされているかを確認します。

これにより、早すぎるバインディングを回避してスケジューリングの信頼性を向上させるとともに、外部のデバイスコントローラーとの連携が可能になります。

この機能を使用するには、デバイスドライバー(通常はデバイスの所有者が管理)が、`ResourceSlice`の`Device`セクションで次のフィールドを公開する必要があります。
クラスター管理者は、スケジューラーがこれらのフィールドを考慮するように、`DRADeviceBindingConditions`と`DRAResourceClaimDeviceStatus`のフィーチャーゲートを有効にする必要があります。

`bindingConditions`
: Podがバインドできるようになる前に、(関連付けられたResourceClaimの`.status.conditions`フィールドで)Trueに設定する必要がある _condition type_ のリストです。
これらの条件は通常、DeviceAttachedやDeviceInitializedなど、準備完了を示すシグナルを表します。

`bindingFailureConditions`
: 関連付けられたResourceClaimのstatus.conditionsフィールドでTrueに設定された場合に、障害状態であることを示す、condition typeのリストです。
  これらの条件のいずれかがTrueの場合、スケジューラーはバインディングを中止し、Podを再スケジュールします。

`bindsToNode`
: `true`に設定すると、スケジューラーは選択されたノード名をResourceClaimの`status.allocation.nodeSelector`フィールドに記録します。
  これはPodの`spec.nodeSelector`には影響しません。
  代わりに、ResourceClaim内にノードセレクターを設定し、外部コントローラーがデバイスの接続や準備など、ノード固有の操作に使用できるようにします。

bindingConditionsとbindingFailureConditionsにリストされたすべてのcondition typeは、ResourceClaimの`status.conditions`フィールドから評価されます。
外部コントローラーは、標準的なKubernetesの条件セマンティクス(`type`、`status`、`reason`、`message`、`lastTransitionTime`)を使用して、これらの条件を更新する責任を負います。

スケジューラーはすべての`bindingConditions`が`True`になるまで、最大**600秒**(既定値)待機します。
タイムアウトに達するか、いずれかの`bindingFailureConditions`が`True`になると、スケジューラーは割り当てをクリアしてPodを再スケジュールします。
クラスター管理者は、kube-schedulerの設定ファイルを編集して、このタイムアウト時間を設定できます。

`KubeSchedulerConfiguration`でこのタイムアウトを設定する例を以下に示します:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  pluginConfig:
  - name: DynamicResources
    args:
      apiVersion: kubescheduler.config.k8s.io/v1
      kind: DynamicResourcesArgs
      bindingTimeout: 60s
```

### 例 {#device-binding-conditions-example}

以下は、DRAドライバーが使用中で、そのドライバーがバインディング条件をサポートしているクラスターで確認できるResourceSliceの例です:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-slice-1
spec:
  driver: dra.example.com
  nodeSelector:
    nodeSelectorTerms:
    - matchExpressions:
      - key: accelerator-type
        operator: In
        values:
        - "high-performance"
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
    - name: gpu-1
      attributes:
        vendor:
          string: "example"
        model:
          string: "example-gpu"
      bindsToNode: true
      bindingConditions:
        - dra.example.com/is-prepared
      bindingFailureConditions:
        - dra.example.com/preparing-failed
```
このResourceSliceの例には、次の特性があります:

- ResourceSliceは`accelerator-type=high-performance`というラベルが付いたノードを対象とするため、スケジューラーは対象となる特定のノード群のみを使用します。
- スケジューラーは、選択されたノード群から1つのノード(例えば`node-3`)を選択し、そのノード名をResourceClaimの`status.allocation.nodeSelector`フィールドに設定します。
- `dra.example.com/is-prepared`というバインディング条件は、バインディングの前にデバイス`gpu-1`の準備が完了している(`is-prepared`条件のステータスが`True`となる)必要があることを示しています。
- `gpu-1`デバイスの準備に失敗した場合(`preparing-failed`条件のステータスが`True`)、スケジューラーはバインディングを中止します。
- スケジューラーは、デバイスの準備が完了するまで最大600秒(既定値)待機します。
- 外部コントローラーは、ResourceClaim内のノードセレクターを使用して、選択されたノード上でノード固有のセットアップを実行できます。

デバイスバインディング条件は、kube-apiserverとkube-schedulerの[`DRADeviceBindingConditions`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)によって制御されます。


## ノードの割り当て可能なリソース {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

DRAによって管理されるデバイスには、`cpu`、`memory`、`hugepages`など、ノードの割り当て可能なリソースで構成される基盤フットプリントを持つことができます。
この機能により、これらのDRAベースの要求を、通常のPodの`spec`によるこれらのリソース要求と合わせて、スケジューラーの標準的な管理に統合できます。

DRAドライバーは、デバイスがノードの割り当て可能なリソースを消費する方法を、2つの異なるモデルで定義します:

*   **直接リソースマッピング(`mapping`)**: DRAデバイスが標準的なノードリソース(カスタムCPUコアプールやメモリブロックなど)を直接提供します。
    クレームの割り当ては、ノード上の標準的なCPUやメモリ容量に直接マッピングされます。
*   **補助デバイスオーバーヘッド(`overhead`)**: DRAデバイス(GPUやアクセラレーターなど)がPodまたはコンテナに割り当てられた時に動作するため、ホストリソース(ホストRAMなど)を補助的なオーバーヘッドとして必要とします。

### Pod作成者向けの考慮事項 {#considerations-for-pod-authors}

これらの種類のデバイスに対するクレームを使用してPodSpecを作成する場合、いくつか注意すべき点があります:

*   Podレベルのリソースが使用される場合、スケジューラーはコンテナのrequestsとlimitsの両方に対してこれらを厳密に検証します:
    * すべてのコンテナのrequestsとDRAクレームのリソースの合計が、Podレベルのrequestsを超えてはなりません。
    そうでないと、Podはスケジューリングに失敗します。
    * 個々のコンテナのlimitsとDRAの割り当ての合計が、Podレベルのlimitsを超えてはなりません。
      そうでないと、Podはスケジューリングに失敗します。
*   コンテナのリソース要件の合計は、コンテナレベルのリソースと、関連づけられたクレームから提供されるノードの割り当て可能なリソースの合計です。
*   **クレームの共有に関する制限**: 直接リソースマッピング(`mapping`)を使用するクレームは、複数のPod間で共有できません。
    `overhead`を持つデバイスのクレームでは、デバイスの共有をサポートでき、オーバーヘッドはPodまたはコンテナ単位で追跡されます。
*   DRAクレームを持つPodは、`spec`内の標準的なrequestsに対するインプレースでのリサイズをサポートします。
    スケジューラーは、リサイズされた標準のrequestsと静的なDRAの割り当てを組み合わせた場合に、そのノード上に収まることを保証します。

### DRAドライバー作成者向けの詳細 {#details-for-dra-driver-authors}

DRAドライバーは、ResourceSlice内のデバイス上の`nodeAllocatableResources`フィールドを使用して、このノードの割り当て可能なリソースの使用量を宣言します。
これは、要求されたDRAデバイスまたは容量を、ノードの`status.allocatable`で追跡される標準的なリソースに変換する方法を定義します(拡張リソースはこのフィールドではサポートされないことに注意)。
これは、ネイティブなリソースを直接公開するドライバー(CPUやMemoryのDRAドライバーなど)と補助的なノードの依存関係を必要とするデバイス(ホストメモリを必要とするアクセラレーターなど)の両方に対して役に立ちます。

`nodeAllocatableResources`フィールドは、2つの異なるユースケースをサポートします:

*   **Mapping**: DRAデバイスが標準的なリソースを直接表す場合に使用します(CPUやメモリDRAドライバーなど)。
    スケジューラーは、`capacityMultiplier`を使用して容量をスケーリングするか、`deviceMultiplier`を使用してデバイス数をスケーリングすることで、正確な数量を計算します。
*   **Overhead**: デバイスが補助的なノード依存関係(GPUが消費するホストメモリなど)を必要とする場合に使用します。
    これは、固定の`perPod`コスト、または参照するコンテナ数に比例してスケールする可変の`perContainer`コストとして定義できます。

#### 例: CPU DRAドライバー (mapping) {#example-cpu-dra-driver-mapping}

以下は、CPU DRAドライバーが[DRAの消費可能な容量](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)を使用して、1つのCPUソケットを128CPUのプールとして公開する例です。
`capacityKey`は、消費された`cpu.example.com/cpu`容量をノードの標準の`cpu`割り当て可能リソースに直接関連付けます:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-cpus
spec:
  driver: cpu.example.com
  nodeName: my-node
  pool:
    name: socket-cpus
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: socket0cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
          capacityMultiplier: 1
```

#### 例: 補助リソースを必要とするアクセラレーター (overhead) {#example-accelerator-with-auxiliary-resources-overhead}

以下は、アクセラレーターが機能するために、1つのデバイスインスタンスにつき追加で8Giのメモリを必要とする場合のResourceSliceの例です:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-xpus
spec:
  driver: xpu.example.com
  nodeName: my-node
  pool:
    name: xpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: xpu-model-x-001
    attributes:
      example.com/model:
        string: "model-x"
    nodeAllocatableResources:
      overhead:
        memory:
          perPod: "8Gi"
```

Podがノードに正常にバインドされた後、DRAを介して割り当てられたノードの割り当て可能なリソースの正確な数量が`kube-scheduler`によって集計され、Podの`status.nodeAllocatableResourceClaimStatuses`フィールドに直接埋め込まれます。
これは、スケジューラーから`kubelet`へ明確で永続的な引き渡しを提供します。

特に重要な点として、`kubelet`は、ネイティブにこのAPIを使用して、システムレベルの境界に正確に整合させます:
- **cgroups**: PodとコンテナのcgroupsはDRAに基づく割り当てを含むようになり、ワークロードがカーネルによって意図せずスロットリングされることを防ぎます。
- **OOMスコア**: `kubelet`はコンテナのDRAメモリリクエストを実行メモリリクエストに反映します。

ノードの割り当て可能なリソースはアルファ機能であり、kube-apiserver、kube-scheduler、およびkubeletで[`DRANodeAllocatableResources`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources)が有効になっている場合に使用できます。

