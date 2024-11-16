---
title: ノードの圧迫によるエビクション
content_type: concept
weight: 100
---

{{<glossary_definition term_id="node-pressure-eviction" length="short">}}</br>

{{< feature-state feature_gate_name="KubeletSeparateDiskGC" >}}

{{<note>}}
_分割イメージファイルシステム_ 機能は、`containerfs`ファイルシステムのサポートを有効にし、いくつかの新しいエビクションシグナル、閾値、メトリクスを追加します。
`containerfs`を使用するには、Kubernetesリリース v{{< skew currentVersion >}}で`KubeletSeparateDiskGC`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にする必要があります。
現在、`containerfs`ファイルシステムのサポートを提供しているのはCRI-O(v1.29以降)のみです。
{{</note>}}

{{<glossary_tooltip term_id="kubelet" text="kubelet">}}は、クラスターのノード上のメモリ、ディスク容量、ファイルシステムのinodeといったのリソースを監視します。
これらのリソースの1つ以上が特定の消費レベルに達すると、kubeletはリソースの枯渇を防ぐため、ノード上の1つ以上のPodを事前に停止してリソースを回収します。

ノードのリソース枯渇によるエビクション中に、kubeletは選択されたPodの[フェーズ](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)を`Failed`に設定し、Podを終了します。

ノードのリソース枯渇によるエビクションは、[APIを起点としたエビクション](/ja/docs/concepts/scheduling-eviction/api-eviction/)とは異なります。

kubeletは、設定した{{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}やPodの`terminationGracePeriodSeconds`を考慮しません。
[ソフトエビクション](#soft-eviction-thresholds)の閾値を使用する場合は、kubeletは設定された`eviction-max-pod-grace-period`を順守します。
[ハードエビクション](#hard-eviction-thresholds)の閾値を使用する場合は、kubeletは終了に`0秒`の猶予期間(即時シャットダウン)を使用します。

## 自己修復の仕組み

kubeletは、エンドユーザーのPodを終了する前に[ノードレベルのリソースを回収](#reclaim-node-resources)しようとします。
例えば、ディスクリソースが枯渇している場合は未使用のコンテナイメージを削除します。

失敗したPodを置き換える{{< glossary_tooltip text="ワークロード" term_id="workload" >}}管理オブジェクト({{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}や{{< glossary_tooltip text="Deployment" term_id="deployment" >}})によってPodが管理されている場合、コントロールプレーン(`kube-controller-manager`)はエビクションされたPodの代わりに新しいPodを作成します。

### static Podの自己修復

リソースが圧迫しているノード上で[static pod](/ja/docs/concepts/workloads/pods/#static-pods)が実行されている場合、kubeletはそのstatic Podをエビクションすることがあります。
static Podは常にそのノード上でPodを実行しようとするため、kubeletは代替のPodの作成を試みます。

kubeletは、代替のPodを作成する際にstatic Podの _priority_ を考慮します。
static Podのマニフェストで低い優先度が指定され、クラスターのコントロールプレーン内で定義されたより高い優先度のPodがあります。
ノードのリソースが圧迫されている場合、kubeletはそのstatic Podのためにスペースを確保できない可能性があります。
kubeletは、ノードのリソースが圧迫されている場合でもすべてのstatic Podの実行を試行し続けます。

## エビクションシグナルと閾値

kubeletは、エビクションを決定するために次のようにさまざまなパラメータを使用します:

- エビクションシグナル
- エビクション閾値
- 監視間隔

### エビクションシグナル {#eviction-signals}

エビクションシグナルは、ある時点での特定リソースの状態を表します。
kubeletはエビクションシグナルを使用して、シグナルとエビクション閾値(ノード上で利用可能なリソースの最小量)を比較してエビクションを決定します。

kubeletは次のエビクションシグナルを使用します:

| エビクションシグナル | 説明 | Linux専用 |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| `memory.available`       | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |            |
| `nodefs.available`       | `nodefs.available` := `node.stats.fs.available`                                       |            |
| `nodefs.inodesFree`      | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |      •     |
| `imagefs.available`      | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |            |
| `imagefs.inodesFree`     | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |      •     |
| `containerfs.available`  | `containerfs.available` := `node.stats.runtime.containerfs.available`                 |            |
| `containerfs.inodesFree` | `containerfs.inodesFree` := `node.stats.runtime.containerfs.inodesFree`               |      •     |
| `pid.available`          | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |      •     |

この表では、**説明**列がシグナルの値の取得方法を示しています。
それぞれのシグナルは、パーセンテージまたはリテラル値をサポートします。
kubeletは、シグナルに関連付けられた総容量に対する割合を計算します。

#### メモリシグナル

Linuxノード上では、`free -m`のようなツールの代わりにcgroupfsから`memory.available`の値が取得されます。
これは重要なことであり、`free -m`はコンテナ内で動作せず、ユーザーが[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)機能を使用する場合、リソース不足の判断はルートノードと同様にcgroup階層のエンドユーザーPodの一部に対してローカルに行われるためです。
この[スクリプト](/examples/admin/resource/memory-available.sh)または[cgroupv2スクリプト](/examples/admin/resource/memory-available-cgroupv2.sh)は、kubeletが`memory.available`を計算するために実行する一連の手順を再現します。
kubeletは、圧迫下でもメモリが再利用可能であると想定しているため、inactive_file(非アクティブなLRUリスト上のファイルベースのメモリのバイト数)を計算から除外します。

Windowsノードでは、`memory.available`の値は、ノードのグローバルメモリコミットレベル（[`GetPerformanceInfo()`](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)システムコールによって参照）から、ノードの[`CommitLimit`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information)からノードのグローバル[`CommitTotal`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information)を減算することによって導出されます。
`CommitTotal`は、ノード上のすべてのプロセスによって使用されるコミットされたメモリの合計です。

#### ファイルシステムシグナル

kubeletは、エビクションシグナル(`<identifier>.inodesFree`や`<identifier>.available`)で使用できる3つの特定のファイルシステム識別子を認識します:

1. `nodefs`: ノードのファイルシステムであり、ローカルディスクボリューム、メモリにバックアップされていないemptyDirボリューム、ログストレージ、エフェメラルストレージなどに使用されます。
   例えば、`nodefs`には`/var/lib/kubelet`が含まれます。

1. `imagefs`: コンテナランタイムがコンテナイメージ(読み取り専用レイヤー)とコンテナの書き込みレイヤーを格納するために使用できるオプションのファイルシステムです。

1. `containerfs`: コンテナランタイムが書き込み可能なレイヤーを格納するために使用できるオプションのファイルシステムです。
   メインファイルシステム(`nodefs`を参照)と同様に、ローカルディスクボリューム、メモリにバックアップされていないemptyDirボリューム、ログストレージ、エフェメラルストレージに使用されますが、コンテナイメージは含まれません。
   `containerfs`を使用すると、`imagefs`ファイルシステムをコンテナイメージ(読み取り専用レイヤー)のみを格納するように分割できます。

したがって、kubeletは通常コンテナファイルシステムについて次の3つのオプションを許可します:

- すべてが単一の`nodefs`にある場合、"rootfs"または単に"root"として参照され、専用のイメージファイルシステムはありません。

- コンテナストレージ(`nodefs`を参照)は専用のディスクにあり、`imagefs`(書き込み可能レイヤーと読み取り専用レイヤー)はルートファイルシステムから分離されています。
  これはよく「分割ディスク」(または「分離ディスク」)ファイルシステムと呼ばれます。

- コンテナファイルシステム`containerfs`(書き込み可能レイヤーを含む`nodefs`と同じ)がルートにあり、コンテナイメージ(読み取り専用レイヤー)は分離された`imagefs`に格納されています。
  これはよく「分割イメージ」ファイルシステムと呼ばれます。

kubeletは、これらのファイルシステムを現在の構成に基づいてコンテナランタイムから直接自動検出しようとし、他のローカルノードファイルシステムを無視します。

kubeletは、他のコンテナファイルシステムやストレージ構成をサポートせず、現在イメージとコンテナに対して複数のファイルシステムをサポートしていません。

### 非推奨のkubeletガベージコレクション機能

一部のkubeletガベージコレクション機能は、エビクションに置き換えられるため非推奨となりました:

| 既存フラグ | 理由 |
| ------------- | --------- |
| `--maximum-dead-containers` | 古いログがコンテナのコンテキスト外に保存されると非推奨になります |
| `--maximum-dead-containers-per-container` | 古いログがコンテナのコンテキスト外に保存されると非推奨になります |
| `--minimum-container-ttl-duration` | 古いログがコンテナのコンテキスト外に保存されると非推奨になります |

### エビクション閾値

kubeletは、エビクションの判断を行うときに使用するカスタムのエビクション閾値を指定できます。
[ソフトエビクション閾値](#soft-eviction-thresholds)と[ハードエビクション閾値](#hard-eviction-thresholds)のエビクション閾値を構成できます。

エビクション閾値は`[eviction-signal][operator][quantity]`の形式を取ります:

- `eviction-signal`は、使用する[エビクションシグナル](#eviction-signals)です。
- `operator`は、`<`(より小さい)などの[関係演算子](https://ja.wikipedia.org/wiki/%E9%96%A2%E4%BF%82%E6%BC%94%E7%AE%97%E5%AD%90#%E6%A8%99%E6%BA%96%E7%9A%84%E3%81%AA%E9%96%A2%E4%BF%82%E6%BC%94%E7%AE%97%E5%AD%90)です。
- `quantity`は、`1Gi`などのエビクション閾値量です。
  `quantity`の値はKubernetesで使用される数量表現と一致する必要があります。
  リテラル値またはパーセンテージ(`%`)を使用できます。

例えば、ノードの総メモリが10GiBで、利用可能なメモリが1GiB未満になった場合にエビクションをトリガーする場合、エビクション閾値を`memory.available<10%`または`memory.available<1Gi`のどちらかで定義できます(両方を使用することはできません)。

#### ソフトエビクション閾値 {#soft-eviction-thresholds}

ソフトエビクション閾値は、エビクション閾値と必須の管理者指定の猶予期間をペアにします。
kubeletは猶予期間が経過するまでポッドをエビクションしません。
kubeletは猶予期間を指定しない場合、起動時にエラーを返します。

ソフトエビクション閾値の猶予期間と、kubeletがエビクション中に使用する最大許容Pod終了の猶予期間を両方指定できます。
最大許容猶予期間を指定しており、かつソフトエビクション閾値に達した場合、kubeletは2つの猶予期間のうち短い方を使用します。
最大許容猶予期間を指定していない場合、kubeletはグレースフルな終了ではなくPodを即座に終了します。

ソフトエビクション閾値を構成するために次のフラグを使用できます:

- `eviction-soft`: 指定された猶予期間を超えた場合にPodのエビクションをトリガーする、`memory.available<1.5Gi`のようなエビクション閾値のセット。
- `eviction-soft-grace-period`: Podとエビクションをトリガーする前にソフトエビクション閾値を保持する必要がある時間を定義する、`memory.available=1m30s`のようなエビクション猶予期間のセット。
- `eviction-max-pod-grace-period`: ソフトエビクション閾値に達した場合、Podを終了する際に使用する最大許容猶予期間(秒)。

#### ハードエビクション閾値 {#hard-eviction-thresholds}

ハードエビクション閾値には、猶予期間がありません。
ハードエビクション閾値に達した場合、kubeletはグレースフルな終了ではなく即座にポッドを終了してリソースを回収します。

`eviction-hard`フラグを使用して、`memory.available<1Gi`のようなハードエビクション閾値のセットを構成します。

kubeletには、次のデフォルトのハードエビクション閾値があります:

- `memory.available<100Mi`(Linuxノード)
- `memory.available<500Mi`(Windowsノード)
- `nodefs.available<10%`
- `imagefs.available<15%`
- `nodefs.inodesFree<5%`(Linuxノード)
- `imagefs.inodesFree<5%`(Linuxノード)

これらのハードエビクション閾値のデフォルト値は、いずれのパラメーター値も変更されていない場合にのみ設定されます。
いずれかのパラメーター値を変更すると、他のパラメーター値はデフォルト値として継承されず、ゼロに設定されます。
カスタム値を指定するには、すべての閾値を指定する必要があります。

`containerfs.available`と`containerfs.inodesFree`(Linuxノード)のデフォルトのエビクション閾値は次のように設定されます:

- 単一のファイルシステムがすべてに使用されている場合、`containerfs`の閾値は`nodefs`と同じに設定されます。

- イメージとコンテナの両方に対して分離されたファイルシステムが構成されている場合、`containerfs`の閾値は`imagefs`と同じに設定されます。

現在は`containerfs`に関連する閾値のカスタムオーバーライド設定はサポートされていないため、そのような設定を試みると警告が出ます。指定されたカスタム値はすべて無視されます。

## エビクションの監視間隔

kubeletは、設定された`housekeeping-interval`に基づいてエビクション閾値を評価しており、デフォルトでは`10s`です。

### ノードの状態 {#node-conditions}

kubeletは、猶予期間の構成とは関係なく、ハードまたはソフトエビクション閾値に達したためにノードが圧迫されていることを示す[ノードのConditions](/ja/docs/concepts/architecture/nodes/#condition)を報告します。

kubeletは、次のようにエビクションシグナルをノードの状態にマッピングします:

| ノードのCondition | エビクションシグナル | 説明 |
|-------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `MemoryPressure`  | `memory.available`                                                                    | ノード上の利用可能なメモリがエビクション閾値に達しています |
| `DiskPressure`    | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, `imagefs.inodesFree`, `containerfs.available`, or `containerfs.inodesFree` | ノードのルートファイルシステム、イメージファイルシステム、またはコンテナファイルシステムのいずれかの利用可能なディスク容量とinodeがエビクション閾値に達しています |
| `PIDPressure`     | `pid.available`                                                                       | (Linux)ノード上で使用可能なプロセス識別子がエビクション閾値を下回りました |

コントロールプレーンは、これらのノードの状態をテイントにも[マッピング](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)します。

kubeletは、設定された`--node-status-update-frequency`に基づいてノードの状態を更新し、デフォルトでは`10s`です。

### ノードの状態の振動

場合によっては、ノードが定義された猶予期間を超えずに、ソフト閾値の上下を振動することがあります。
これにより、報告されるノードの状態が`true`と`false`の間で頻繁に切り替わり、不適切なエビクションの判断をトリガーする可能性があります。

振動を防ぐために、`eviction-pressure-transition-period`フラグを使用できます。
このフラグは、kubeletがノードの状態を別の状態に遷移させるまでの時間を制御します。
デフォルトの遷移期間は`5m`です。

### ノードレベルのリソースの回収 {#reclaim-node-resources}

kubeletは、エンドユーザーのPodをエビクションする前にのノードレベルのリソースを回収しようとします。

ノードの`DiscPressure`状態が報告されると、kubeletはノード上のファイルシステムに基づいてノードレベルのリソースを回収します。

#### `imagefs`または`containerfs`がない場合

ノードに`nodefs`ファイルシステムのみがあり、エビクション閾値に達した場合、kubeletは次の順序でディスク容量を解放します:

1. deadなPodとコンテナをガベージコレクションします。
1. 未使用のイメージを削除します。

#### `imagefs`を使用する場合

ノードにコンテナランタイムが使用するための`imagefs`ファイルシステムがある場合、kubeletは次のようにノードレベルのリソースを回収します:

- `nodefs`ファイルシステムがエビクション閾値に達した場合、kubeletは終了したPodとコンテナをガベージコレクションします。

- `imagefs`ファイルシステムがエビクション閾値に場合、kubeletは未使用のイメージをすべて削除します。

#### `imagefs`と`containerfs`を使用する場合

ノードにコンテナランタイムが使用するための`containerfs`と`imagefs`ファイルシステムがある場合、kubeletは次のようにノードレベルのリソースを回収します:

- `containerfs`ファイルシステムがエビクション閾値に達した場合、kubeletは終了したPodとコンテナをガベージコレクションします。

- `imagefs`ファイルシステムがエビクション閾値に達した場合、kubeletはすべての未使用のイメージを削除します。

### kubeletのエビクションにおけるPodの選択

kubeletは、ノードレベルのリソースを回収してもエビクションシグナルが閾値を下回らない場合、エンドユーザーのPodをエビクションし始めます。

kubeletは、次のパラメータを使用してPodのエビクション順序を決定します:

1. Podのリソース使用量がリクエストを超えているかどうか
1. [Podの優先度](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. Podのリソース使用量がリクエストを下回っているかどうか

結果として、kubeletは次の順序でPodをランク付けしてエビクションします:

1. リソース使用量がリクエストを超えている`BestEffort`または`Burstable`Pod。
   これらのPodは、その優先度に基づき、リクエストを超える使用量に応じてエビクションされます。

1. リソース使用量がリクエストを下回っている`Guaranteed`と`Burstable`Podは、その優先度に基づいて最後にエビクションされます。

{{<note>}}
kubeletは、Podの[QoSクラス](/docs/concepts/workloads/pods/pod-qos/)を使用してエビクション順序を決定しません。
メモリなどのリソースを回収する際に、QoSクラスを使用して最もエビクションされる可能性の高いPodの順序を予測することができます。
QoSの分類はEphemeralStorageのリクエストには適用されないため、例えばノードが`DiskPressure`状態にある場合、上記のシナリオは当てはまりません。
{{</note>}}

`Guaranteed`Podは、すべてのコンテナにリクエストとリミットが指定されており、それらが等しい場合にのみ保証されます。
これらのPodは、他のPodのリソース消費によってエビクションされることはありません。
(`kubelet`や`journald`のような)システムデーモンが、`system-reserved`や`kube-reserved`の割り当てよりも多くのリソースを消費しており、ノードにはリクエストより少ないリソースを使用している`Guaranteed`または`Burstable`Podしかない場合、kubeletは他のPodへのリソース枯渇の影響を制限してノードの安定性を保つために、これらのPodのなかからエビクションするPodを選択する必要があります。
この場合、最も低い優先度のPodをエビクションするように選択します。

[static Pod](/ja/docs/concepts/workloads/pods/#static-pods)を実行しており、リソース圧迫によるエビクションを回避したい場合は、そのPodに直接`priority`フィールドを設定します。
Static Podは`priorityClassName`フィールドをサポートしていません。

kubeletは、inodeまたはプロセスIDの枯渇に応じてPodをエビクションする場合、inodeとPIDにはリクエストがないため、Podの相対的な優先度を使用してエビクション順序を決定します。

kubeletは、ノードが専用の`imagefs`または`containerfs`ファイルシステムを持っているかどうかに基づいて、異なる方法でPodをソートします:

#### `imagefs`または`containerfs`がない場合(`nodefs`と`imagefs`は同じファイルシステムを使用します) {#without-imagefs}

- `nodefs`がエビクションをトリガーした場合、kubeletはそれらの合計ディスク使用量(`ローカルボリューム + すべてのコンテナのログと書き込み可能レイヤー`)に基づいてPodをソートします。

#### `imagefs`を使用する場合(`nodefs`と`imagefs`ファイルシステムが分離されている) {#with-imagefs}

- `nodefs`がエビクションをトリガーした場合、kubeletは`nodefs`使用量(`ローカルボリューム + すべてのコンテナのログ`)に基づいてPodをソートします。

- `imagefs`がエビクションをトリガーした場合、kubeletはすべてのコンテナの書き込み可能レイヤーの使用量に基づいてPodをソートします。

#### `imagefs`と`containerfs`を使用する場合(`imagefs`と`containerfs`は分割されています) {#with-containersfs}

- `containerfs`がエビクションをトリガーした場合、kubeletは`containerfs`使用量(`ローカルボリューム + すべてのコンテナのログと書き込み可能レイヤー`)に基づいてPodをソートします。

- `imagefs`がエビクションをトリガーした場合、kubeletは特定のイメージのディスク使用量を表す`イメージのストレージ`ランクに基づいてPodをソートします。

### エビクションによる最小の回収

{{<note>}}
Kubernetes v{{< skew currentVersion >}}以降、`containerfs.available`メトリクスのカスタム値を設定することはできません。
この特定のメトリクスの構成は、構成に応じて、`nodefs`または`imagefs`に設定された値を自動的に反映するように設定されます。
{{</note>}}

場合によっては、Podのエビクションによって回収されるリソースがごくわずかであることがあります。
このため、kubeletが設定されたエビクション閾値に繰り返し達し、複数のエビクションをトリガーする可能性があります。

`--eviction-minimum-reclaim`フラグや[Set Kubelet Parameters Via A Configuration File
](/docs/tasks/administer-cluster/kubelet-config-file/)を使用して、各リソースの最小の回収量を構成できます。
kubeletがリソース不足を検知すると、指定した値に達するまでリソースを回収し続けます。

例えば、次の構成は最小回収量を設定します:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "1Gi"
  imagefs.available: "100Gi"
evictionMinimumReclaim:
  memory.available: "0Mi"
  nodefs.available: "500Mi"
  imagefs.available: "2Gi"
```

この例では、`nodefs.available`シグナルがエビクション閾値に達した場合、kubeletはシグナルが1GiBに達するまでリソースを回収します。
その後は500MiBの最小量を回収し続け、利用可能なnodefsストレージが1.5GiBに達するまで続行します。

同様に、kubeletは`imagefs`リソースを回収し、`imagefs.available`の値が`102Gi`に達するまでリソースを回収を試みます。
これは、コンテナイメージストレージの102GiBが利用可能であることを示します。
kubeletが回収できるストレージ量が2GiB未満の場合、kubeletは何も回収しません。

`eviction-minimum-reclaim`のデフォルト値は、すべてのリソースに対して`0`です。

## ノードのメモリ不足の挙動

kubeletがメモリを回収する前にノードで _メモリ不足_ (OOM)イベントが発生した場合、ノードは[oom_killer](https://lwn.net/Articles/391222/)に依存して対応します。

kubeletは、PodのQoSに基づいて各コンテナの`oom_score_adj`値を設定します。

| サービスの品質 | `oom_score_adj`                                                                   |
|--------------------|-----------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                              |
| `BestEffort`       | 1000                                                                              |
| `Burstable`        | _min(max(2, 1000 - (1000 × memoryRequestBytes) / machineMemoryCapacityBytes), 999)_ |

{{<note>}}
またkubeletは、`system-node-critical`{{<glossary_tooltip text="優先度" term_id="pod-priority">}}を持つPodのコンテナに対して`oom_score_adj`値を`-997`に設定します。
{{</note>}}

kubeletがノードでOOMが発生する前にメモリを回収できない場合、`oom_killer`はそのノード上で使用しているメモリの割合に基づいて`oom_score`を計算し、次に`oom_score_adj`を加算して各コンテナの有効な`oom_score`を計算します。
その後、`oom_killer`は最も高いスコアを持つコンテナを終了します。

これは、スケジューリングリクエストに対して多くのメモリを消費する低いQoS Podのコンテナが最初に終了されることを意味します。

Podのエビクションとは異なり、コンテナがOOMで強制終了された場合、kubeletは`restartPolicy`に基づいてコンテナを再起動できます。

## グッドプラクティス {#node-pressure-eviction-good-practices}

エビクションの構成に関するグッドプラクティスを次のセクションで説明します。

### スケジュール可能なリソースとエビクションポリシー

エビクションポリシーを使用してkubeletを構成する場合、スケジューラーがPodのスケジュール直後にメモリ圧迫をトリガーしてエビクションを引き起こさないようにする必要があります。

次のシナリオを考えてみましょう:

- ノードのメモリキャパシティ: 10GiB
- オペレーターはシステムデーモン(kernel、`kubelet`など)に10%のメモリ容量を予約したい
- オペレーターはシステムのOOMの発生を減らすために、メモリ使用率が95%に達したときにPodをエビクションしたい

この場合、kubeletは次のように起動されます:

```none
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

この構成では、`--system-reserved`フラグによりシステム用に1.5GiBのメモリが予約されます。
これは`総メモリの10% + エビクション閾値量`です。

ノードは、Podがリクエスト以上のメモリを使用している場合や、システムが1GiB以上のメモリを使用している場合に、エビクション閾値に達する可能性があります。
これにより、`memory.available`シグナルが500MiBを下回り、閾値がトリガーされます。

### DaemonSetとノードの圧迫によるエビクション {#daemonset}

Podの優先度は、エビクションの決定において重要な要素です。
kubeletは、DaemonSetに属するPodをエビクションさせたくない場合、そのPodのspecに適切な`priorityClassName`を指定して十分な優先度を与えることができます。
より低い、またはデフォルトの優先度を使用して、十分なリソースがある場合にのみDaemonSetのPodを実行できるようにすることも可能です。

## 既知の問題

リソースの圧迫に関連する既知の問題について次のセクションで説明します。

### kubeletが即座にメモリ圧迫を検知しないことがある

デフォルトでは、kubeletはcAdvisorを定期的にポーリングしてメモリ使用量の統計を収集します。
メモリ使用量がその間に急速に増加した場合、kubeletは`MemoryPressure`状態を十分な早さで検知できない可能性があり、OOMキラーが呼び出される可能性があります。

`--kernel-memcg-notification`フラグにより、kubeletの`memcg`通知APIを有効にして、閾値を超えたとき即座に通知を受け取ることができます。

極端な使用率を達成しようとするのではなく、合理的なオーバーコミットを目指している場合、この問題に対して実行可能な回避策は`--kube-reserved`および`--system-reserved`フラグを使用してシステム用のメモリを割り当てることです。

### active_fileメモリは使用可能なメモリとして見なされません

Linuxでは、カーネルがアクティブなLRUリスト上のファイルベースのメモリのバイト数を`active_file`統計として追跡します。
kubeletは、`active_file`メモリの領域を回収不可能として扱います。
一時的なローカルストレージを含むブロックベースのローカルストレージを集中的に使用するワークロードの場合、カーネルレベルのファイルおよびブロックデータのキャッシュにより、多くの直近アクセスされたキャッシュページが`active_file`としてカウントされる可能性が高いです。
これらのカーネルブロックバッファがアクティブなLRUリストに十分に存在すると、kubeletはこれを高いリソース使用として観測し、ノードにメモリ圧迫が発生しているとしてテイントし、Podのエビクションをトリガーします。

より詳細については、[https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)を参照してください。

その動作を回避するためには、集中的なI/Oアクティビティを行う可能性があるコンテナに対してメモリリミットとメモリリクエストを同じ値に設定します。
そのコンテナに対して最適なメモリのリミット値を見積もるか、測定する必要があります。

## {{% heading "whatsnext" %}}

- [APIを起点としたエビクション](/ja/docs/concepts/scheduling-eviction/api-eviction/)について学ぶ
- [Podの優先度とプリエンプション](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/)について学ぶ
- [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)について学ぶ
- [Quality of Service](/ja/docs/tasks/configure-pod-container/quality-service-pod/) (QoS)について学ぶ
- [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)について学ぶ
