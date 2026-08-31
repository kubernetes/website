---
title: DRAの機能
content_type: concept
weight: 40
---

<!-- overview -->

このページでは、高度なユースケース向けのオプショナルなDRAの機能について説明します。
これらの機能の一部は、DRAドライバーによるサポートが必要です。
各機能には、その成熟度とそれを有効にするフィーチャーゲートが記載されています。

<!-- body -->

## パーティション可能なデバイス {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

DRAで表現されるデバイスは、必ずしも単一のマシンに接続された単一のユニットである必要はなく、複数のマシンに接続された複数のデバイスから構成される論理デバイスにすることもできます。
これらのデバイスは、基礎となる物理デバイスのリソースを重複して消費する場合があるため、ある1つの論理デバイスが割り当てられると、他のデバイスは利用できなくなることを意味しています。

ResourceSlice APIでは、これは名前付きCounterSetのリストとして表現され、それぞれには名前付きのカウンターのセットが含まれます。
カウンターは、DRAを通じて公開される論理デバイスによって使用される、物理デバイス上で利用可能なリソースを表します。

論理デバイスは、ConsumesCounterのリストを指定できます。
各エントリにはCounterSetへの参照と、それらが消費する量を示す名前付きのカウンターのセットが含まれます。
そのため、デバイスを割り当て可能にするには、参照カウンターのセットは、そのデバイスによって参照されるカウンターに対して十分な量が存在している必要があります。

CounterSetはデバイスとは別のResourceSliceで指定する必要があります。
デバイスは、デバイスと同じリソースプール内で定義された任意のCounterSetからカウンターを消費できます。

以下は、共有カウンターの8GiBのメモリから、それぞれ6GiBを消費するデバイスの例です。
このため、ある時点で割り当て可能なのはどちらか一方のデバイスだけです。
スケジューラーがこの処理を行うため、ResourceClaim APIには影響せず、利用者から見ると透過的です。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-countersets
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-devices
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  devices:
  - name: device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
  - name: device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
```

パーティション可能なデバイスは、kube-apiserverとkube-schedulerの[`DRAPartitionableDevices`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)によって制御されます。


## デバイス互換性グループ {#device-compatibility-groups}

{{< feature-state feature_gate_name="DRADeviceCompatibilityGroups" >}}

デバイス互換性グループを使用すると、DRAドライバーは、同じ物理ハードウェア上で同時に割り当てが可能な、パーティション化されたデバイスを宣言できます。
この機能がない場合、非互換のデバイスの組み合わせはkubeletがノード上でPodの準備を行う時にのみ検出されるため、準備に失敗します。
互換性グループを使用すると、スケジューラーはノード側の処理が開始される前のスケジューリング時に非互換の組み合わせを拒否します。

これは、相互に排他的な動作モードをサポートするハードウェアに対して、特に有用です。
例えば、MIGモードとvGPUモードのどちらかで動作可能なGPUでは、互換性のない方法で重複する物理リソースを消費するため、MIGモードのデバイスとvGPUモードのデバイスは同時に割り当てることができません。
`compatibilityGroups`を宣言することで、ドライバーはこの制約をスケジューラーに見せます。

この機能は[パーティション可能なデバイス](#partitionable-devices)の上に構築されています:
`compatibilityGroups`フィールドは、パーティション可能なデバイスに対してのみ存在する、`device.consumesCounters[]`エントリに設定されます。
`kube-apiserver`と`kube-scheduler`において、`DRADeviceCompatibilityGroups`フィーチャーゲートと`DRAPartitionableDevices`フィーチャーゲートの両方を有効にする必要があります。

### 動作する仕組み {#device-compatibility-groups-how-it-works}

ドライバーはResourceSliceの各`device.consumesCounters[]`エントリに対して`compatibilityGroups`のリストを定義します。
このリストには、その特定のカウンターセットにおけるデバイスの動作モードまたはパーティションタイプを表す、最大で2つの不透明な文字列名を指定できます。

スケジューラーが同じカウンターセットから引き出す複数のデバイスを割り当てる場合、それらの`compatibilityGroups`の共通部分を計算します。
割り当ては、その共通部分が空ではない場合、つまり同時に割り当てられるすべてのデバイスが、少なくとも1つの共通するグループ名を持っている場合にのみ成功します。
異なるカウンターセットから引き出すデバイスは、互いに比較されることはありません。

グループを宣言していないデバイス(未設定、nil、または空のリスト)は特殊なケースとして扱われます:
同じカウンターセット上でグループを持たない他のデバイスとのみ同時に割り当てることができます。
1つ以上のグループを宣言しているデバイスと同時に割り当てることはできません。

この制約は、1度のスケジューリングサイクルで割り当てられるすべてのクレームに適用されます:
2つのクレームがそれぞれ同じカウンターセットからデバイスを割り当てる場合、クレーム間でもグループの共通部分が強制されます。

### 例 {#device-compatibility-groups-example}

MIGモードまたはvGPUモードのいずれかで動作できるGPUを考えます。
ドライバーは、それぞれが8GiBの共有メモリカウンターから4GiBを消費する2つのデバイスを公開しています。
カウンターの容量だけを見ると、両方のデバイスを同時に割り当てることができます。
各デバイスは、動作モードを互換性グループとして宣言することで、2つのモードを互いに排他にします:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-counters
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  sharedCounters:
  - name: gpu-0-memory
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-devices
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  devices:
  - name: gpu-0-mig
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - mig
  - name: gpu-0-vgpu
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - vgpu
```

この例では:
- `gpu-0-mig`は`mig`グループに属します。
- `gpu-0-vgpu`は`vgpu`グループに属します。

PodまたはPodGroupがこのプールから2つのデバイスを要求すると、スケジューラーは、選択された2つのデバイスが`gpu-0-memory`カウンターセット上で共通の互換性グループを持っているかどうかを確認します。
`{"mig"} ∩ {"vgpu"} = ∅`であるため、カウンターセットが両者に対して十分なメモリがある場合でも、この組み合わせは拒否されます。
両方の要求は、そのような組み合わせが存在するプールの、2つのMIGデバイス(または2つのvGPUデバイス)によってのみ満たされます。

### 制約 {#device-compatibility-groups-constraints}

- 各`consumesCounters[]`エントリには、最大**2**個のグループ名を宣言できます。
- グループ名は1つのエントリ内で一意である必要があります。
- グループ名はKubernetesにとって不透明です。
  それを公開するドライバーのプール内でのみ意味を持ちます。
- グループはカウンターセット毎に比較されます。
  あるカウンターセット上のグループが、別のカウンターセットに対する同時割り当ての判定に影響することはありません。

### バージョンスキューに対する安全性 {#device-compatibility-groups-version-skew}

`DRADeviceCompatibilityGroups`フィーチャーゲートが無効になっている場合(アルファでの既定値)、古いオブジェクトですでにこのフィールドが設定されている場合を除き、kube-apiserverは新規または更新されたResourceSliceから`compatibilityGroups`フィールドを削除します。
その時スケジューラーは、以前にグループ化されたデバイスを持っていた任意のプール内のデバイスを、不完全なプールに属するデバイスとして扱い、それらをすべてスキップします。

空ではないリストのみが、設定済みのフィールドとして扱われます:
`compatibilityGroups: null`と`compatibilityGroups: []`は、フィールドを省略した場合と同じように扱われます。
これらを持つデバイスは、グループを持たないデバイスとまったく同じように動作し、スケジューラーがそのプールを不完全なものとして扱う原因にはなりません。

デバイス互換性グループは、kube-apiserverとkube-schedulerの[`DRADeviceCompatibilityGroups`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceCompatibilityGroups)によって制御されます。
[`DRAPartitionableDevices`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)も有効にする必要があります。

## 消費可能な容量 {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

消費可能な容量の機能を使用すると、Kubernetesスケジューラーが各クレームによって使用されるデバイスの容量を管理し、同じデバイスを複数の独立したResourceClaimから消費できるようになります。
これは、Podがノード上のリソースを共有できる方法と類似しています。
ResourceClaimはデバイス上のリソースを共有できます。

デバイスドライバーは、`ResourceSlice`の`.spec.devices`に追加された`allowMultipleAllocations`フィールドを設定することで、そのデバイスを複数の独立したResourceClaimまたは1つのResourceClaim内の複数の要求に割り当てられるようになります。

`ResourceClaim`で1種類のデバイスだけを要求する場合は、割り当てごとに必要なデバイスリソースを`spec.devices.requests[].exactly.capacity`で指定します。
異なる代替の優先度付きリストでは、関連する`spec.devices.requests[].firstAvailable[]`エントリ内に`capacity`を設定します。

複数の割り当てを許可するデバイスでは、要求された容量は、そのデバイスの総容量から取得、あるいは消費されます。
これは**消費可能容量**として知られている概念です。
その後、スケジューラーはすべてのクレームで消費される容量の合計が、デバイス全体の容量を超えないようにします。
さらに、ドライバーの作成者は、個々のデバイス容量に対する`requestPolicy`制約を使用して、それらの容量がどのように消費されるかを制御できます。
例えば、ドライバーの作成者は、与えられた容量を1GiB単位でのみ消費できるように指定できます。

以下は、複数の割り当てを許可し、消費可能な帯域幅容量を持つネットワークデバイスの例です。

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: eth1
    allowMultipleAllocations: true
    attributes:
      name:
        string: "eth1"
    capacity:
      bandwidth:
        requestPolicy:
          default: "1M"
          validRange:
            min: "1M"
            step: "8"
        value: "10G"
```

消費可能な容量は、以下の例のように要求できます。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: bandwidth-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          capacity:
            requests:
              bandwidth: 1G
```

割り当て結果には、消費された容量と共有の識別子が含まれます。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - consumedCapacity:
          bandwidth: 1G
        device: eth1
        shareID: "a671734a-e8e5-11e4-8fde-42010af09327"
```

この例では、複数の割り当て可能なデバイスが選択されています。
ただし、要求された1Gの帯域幅以上を持つ任意の`resource.example.com`デバイスがあれば、要件を満たすことができました。
複数割り当てができないデバイスが選択された場合、デバイス全体が割り当てられます。
複数割り当てが可能なデバイスだけを使用するよう強制するには、CEL条件`device.allowMultipleAllocations == true`が使用できます。

### DistinctAttribute制約 {#distinctattribute-constraint}

ResourceClaimで複数のデバイスを要求する場合、DistinctAttribute制約を使用して、割り当てられる各デバイスが指定した属性について異なる値を持つことを保証できます。
この制約は、消費可能な容量の機能とともに導入されました。

DistinctAttribute制約は、複数割り当てが可能なデバイスを扱う場合に特に有用です。
これは、デバイスが複数の割り当てを許可している場合でも、1つのResourceClaim内でスケジューラーが同じデバイスを複数回割り当てることを防止できます。

重複した割り当てを防止するだけでなく、この制約は属性に基づいてデバイスを分散させることでパフォーマンスの最適化にも役立ちます。
例えば、メモリ帯域を最適化し、競合を減らすために、異なるNUMAノードにデバイスを分散させることができます。

## 細かなステータス認可 {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Kubernetes v1.36以降、DRAは合成サブリソースとノードを考慮したverbを使用して、`ResourceClaim`のステータス更新に対する細かな認可チェックを適用します。

スケジューラーとDRAドライバーに対するRBACの例を含む、セキュリティ強化のガイダンスについては、[堅牢化ガイド - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)を参照してください。

クラスター管理者向けのステップバイステップの手順については、[クラスターのDynamic Resource Allocationを堅牢化する](/docs/tasks/administer-cluster/hardening-dra/)を参照してください。


## オプションのノード操作 {#optional-node-operations}

{{< feature-state feature_gate_name="DRAOptionalNodeOperations" >}}

Dynamic Resource Allocation (DRA)では、`kubelet`がノードローカルのドライバーとgRPCを介して連携し、コンテナの起動前に割り当てられたデバイスを準備し(`NodePrepareResources`)、Podの終了時に準備解除します(`NodeUnprepareResources`)。
このセットアップは、GPUやFPGAなどのノードローカルハードウェアにとって重要ですが、一部のリソースはコントロールプレーンだけで完全に管理され、ノードローカルのセットアップを必要としません。

オプションのノード操作の機能を使用すると、リソースドライバーは特定のノードローカルgRPC操作をスキップできることを宣言できます。
設定すると、`kubelet`はドライバーの検索処理とこれらのデバイスに対するgRPCの呼び出しをスキップするため、すべてのワーカーノード上で空のノードローカルドライバーを展開、維持する必要がなくなります。

### ドライバー設定 {#driver-configuration}

ドライバーの作成者は、ResourceSliceの`.spec.skipNodeOperations`に`skipNodeOperations`フィールドを指定できます。
このフィールドは、そのスライス内のすべてのデバイスをバイパスするノードローカルの操作を指定する、一意な文字列のリストです。

有効な値は次の通りです:

* `"NodePrepareResources"`: `NodePrepareResources`のgRPC呼び出しをスキップします。
  この値は`"NodeUnprepareResources"`(または`"*"`)もリストされていないと指定することができません。
  この制限により、準備をスキップした時にPodの起動時にノードローカルプラグインが存在するかどうかが確認されないため、ノードローカルプラグインが見つからない場合にPodがTerminatingの状態で止まってしまうのを防ぎます。
* `"NodeUnprepareResources"`: `NodeUnprepareResources`のgRPC呼び出しをスキップします。
* `"*"`: すべてのノードローカルリソースの操作をスキップします。

以下は、すべてのノードローカルの操作をスキップするコントロールプレーンリソースのResourceSliceの例です:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: control-plane-resources
spec:
  nodeName: worker-1
  pool:
    name: central-pool
    generation: 1
    resourceSliceCount: 1
  driver: control-plane.example.com
  skipNodeOperations:
  - "*"
  devices:
  - name: virtual-device-1
```

### 割り当て結果と実行 {#allocation-result-and-execution}

KubernetesスケジューラーがデバイスをResourceClaimに割り当てると、ResourceSliceから`skipNodeOperations`のリストを割り当て結果にコピーします:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - device: virtual-device-1
        driver: control-plane.example.com
        pool: central-pool
        skipNodeOperations:
        - "*"
```

Podがノード上で実行されると、`kubelet`は割り当て結果を読み取ります。
ResourceClaim内で与えられたドライバーに対して割り当てられたすべてのデバイスが特定の操作をスキップする場合、`kubelet`はそのドライバーに対するそのgRPCのフックの呼び出しを完全にバイパスします。

### 運用上の考慮事項 {#operational-considerations}

#### インプレースドライバーアップデート {#in-place-driver-updates}

`skipNodeOperations`の設定は割り当て時にResourceSliceからResourceClaimにコピーされるため、実行中のPodとアクティブな割り当ては、スケジューリングされた時点の設定がそのまま保持されます。

ドライバーのノード操作に関する要件がインプレースで更新された場合(例えば、ノード操作を必要とする設定からスキップする設定に変更した場合)、既存のクレームは引き続き以前の設定を使用します。
廃止となったノードプラグインを待ち続けることで、終了中のPodが固まるといった問題を回避するために、クラスター管理者は、ノード操作に関する要件を変更したり、ノードローカルドライバーのDaemonSetを削除したりする前に、そのドライバーに対するアクティブなクレームが存在していないことを確認する必要があります。

#### Node宣言の機能との統合 {#node-declared-features-integration}

`kubelet`がDRA操作のスキップをサポートしていない(これは`kubelet`が存在しないノードプラグインを待機して失敗する原因となる)ノードにPodがスケジュールされるのを防ぐために、この機能は[ノード宣言](/docs/concepts/scheduling-eviction/node-declared-features/)の機能と統合されています。
Podが`skipNodeOperations`を設定したResourceClaimを使用すると、Kubernetesのスケジューラーは、Podをスケジュールする前に、対象ノードの`.status.declaredFeatures`にて`DRAOptionalNodeOperations`の機能がサポートされているか確認します。

オプションのノード操作は、`kube-apiserver`、`kube-scheduler`、および`kubelet`の[`DRAOptionalNodeOperations`](/docs/reference/command-line-tools-reference/feature-gates/#DRAOptionalNodeOperations)フィーチャーゲートによって制御されます。
