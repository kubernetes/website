---
title: ノード上のメモリ管理ポリシーの制御
content_type: task
min-kubernetes-server-version: v1.32
weight: 145
math: true
---

<!-- overview -->

{{< feature-state feature_gate_name="MemoryManager" >}}

Kubernetesの*メモリマネージャー*は、`Guaranteed` {{< glossary_tooltip text="QoSクラス" term_id="qos-class" >}}のPodに対して、保証されたメモリ(およびHugePage)を割り当てる機能を提供します。

メモリマネージャーはヒント生成プロトコルを使用して、Podに最適なNUMAアフィニティを生成します。
メモリマネージャーは、これらのアフィニティヒントを中央のマネージャー(*トポロジーマネージャー*)に渡します。
これらのヒントとトポロジーマネージャーのポリシーに基づいて、Podをノードに受け入れるか拒否するかが決まります。

さらに、メモリマネージャーは、Podが要求するメモリが最小限の数のNUMAノードから割り当てられるようにします。

Podのメモリリソースに関する背景情報については、[コンテナとPodにメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-memory-resource/)を参照してください。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}} 古いバージョンのKubernetesを実行している場合は、実行しているKubernetesのバージョンに対応するドキュメントを確認してください。

### リソースのアラインメントに関する前提条件 {#resource-alignment-prerequisites}

メモリリソースをPodの仕様で要求されている他のリソースと揃えるには、次の設定が必要です。

- CPUマネージャーを有効にし、ノードに適切なCPUマネージャーポリシーを設定する必要があります。
  [CPU管理ポリシーの制御](/ja/docs/tasks/administer-cluster/cpu-management-policies/)を参照してください。
- トポロジーマネージャーを有効にし、ノードに適切なトポロジーマネージャーポリシーを設定する必要があります。
  [トポロジー管理ポリシーの制御](/docs/tasks/administer-cluster/topology-manager/)を参照してください。

### Windowsのサポート

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

Windowsのサポートは、`WindowsCPUAndMemoryAffinity`フィーチャーゲートを使用して有効にできます。これにはコンテナランタイム側のサポートも必要です。  
Windowsでは、[None](#policy-none)ポリシーと[BestEffort](#policy-best-effort)ポリシーのみがサポートされています。

## メモリマネージャーの動作

Linuxノードでは、メモリマネージャーは`Guaranteed` QoSクラスのPodに対して、保証されたメモリ(およびHugePage)の割り当てを提供します。
メモリマネージャーをすぐに動作させるには、[メモリマネージャーの設定](#memory-manager-configuration)セクションのガイドラインに従い、その後、[`Guaranteed` QoSクラスへのPodの配置](#placing-a-pod-in-the-guaranteed-qos-class)セクションの例に従って`Guaranteed` Podを準備し、デプロイします。

メモリマネージャーはヒントプロバイダーであり、トポロジーマネージャーにトポロジーヒントを提供します。トポロジーマネージャーは、そのヒントに従って要求されたリソースを揃えます。
Linuxでは、Podに対して`cgroups`(具体的には`cpuset.mems`)も適用します。
Podの受け入れおよびデプロイのプロセス全体を、次のフロー図に示します。

![Podの受け入れおよびデプロイプロセスにおけるメモリマネージャー](/images/docs/memory-manager-diagram.svg)

このプロセス中、メモリマネージャーは、保証されたメモリ割り当てを管理するために、[ノードマップとメモリマップ][2]に格納された内部カウンターを更新します。

ノード管理者がkubeletに`reservedMemory`を設定すると([予約済みメモリの設定](#reserved-memory-flag)セクションを参照)、kubeletの起動時にメモリマネージャーが有効になります。
この場合、kubeletは予約を反映するようにノードマップを更新します。

`Static`ポリシーを設定する場合、ノードの予約済みメモリを設定する必要が**あります**(たとえば、kubelet設定の`reservedMemory`フィールドを使用します)。

メモリマネージャーの動作において重要なトピックの1つが、NUMAグループの管理です。
Podのメモリ要求が単一のNUMAノードの容量を超えるたびに、メモリマネージャーは、複数のNUMAノードから構成され、より大きなメモリ容量を持つグループの作成を試みます。

## メモリマネージャーの設定 {#memory-manager-configuration}

他のマネージャーは事前に設定しておく必要があります([リソースのアラインメントに関する前提条件](#resource-alignment-prerequisites)を参照してください)。
[kubeletの設定](/docs/reference/config-api/kubelet-config.v1beta1/)内の`memoryManagerPolicy`設定フィールドに、選択した[ポリシー](#policies)の名前を設定します。

必要に応じて、ノードの安定性を高めるために、システムまたはkubeletのプロセス用に一定量のメモリを予約できます([予約済みメモリの設定](#reserved-memory-flag)セクションを参照してください)。

### ポリシー {#policies}

Kubernetesのメモリマネージャーには3つのポリシーがあります。
kubelet設定の`memoryManagerPolicy`設定フィールドを使用してポリシーを選択できます。Kubernetes {{< skew currentVersion >}}で使用可能な値は次のとおりです。

* [`None`](#policy-none)(デフォルト)
* [`Static`](#policy-static)(Linuxのみ)
* [`BestEffort`](#policy-best-effort)(Windowsのみ)

#### Noneポリシー {#policy-none}

これはデフォルトのポリシーで、メモリ割り当てには一切影響しません。
メモリマネージャーが存在しない場合と同じように動作します。

`None`ポリシーは、デフォルトのトポロジーヒントを返します。
この特別なヒントは、ヒントプロバイダー(この場合はメモリマネージャー)が、どのリソースについてもNUMAアフィニティの選好を持たないことを示します。

#### Staticポリシー {#policy-static}

{{< feature-state feature_gate_name="MemoryManager" >}}

**このポリシーはLinuxでのみサポートされています。**

`Guaranteed` Podの場合、メモリマネージャーの`Static`ポリシーは、メモリを保証できるNUMAノードのセットに関するトポロジーヒントを返し、内部の[NodeMap][2]オブジェクトを更新してメモリを予約します。

`BestEffort`または`Burstable` Podの場合、保証されたメモリの要求がないため、メモリマネージャーの`Static`ポリシーはデフォルトのトポロジーヒントを返し、内部の[NodeMap][2]オブジェクトにはメモリを予約しません。

このポリシーはLinuxでのみサポートされています。

#### BestEffortポリシー {#policy-best-effort}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

**このポリシーはWindowsでのみサポートされています。**

WindowsにおけるNUMAノードの割り当てはLinuxとは異なります。
メモリアクセスが特定のNUMAノードからのみ行われることを保証する仕組みはありません。
代わりに、Windowsオペレーティングシステムのスケジューラーが、CPUの割り当てに基づいて最適なNUMAノードを選択します。
Windowsスケジューラーが他のNUMAノードを最適と判断した場合、そのノードを使用する可能性があります。

このポリシーは、内部の_ノードマップ_を使用して、利用可能なメモリ量と要求されたメモリ量を追跡します。
メモリマネージャーは、リソースを割り当てる前に、NUMAノード上に十分なメモリがあることを可能な限り確認します。  
つまり、ほとんどの場合、メモリ割り当ては指定どおりに機能します。

## 予約済みメモリの設定 {#reserved-memory-flag}

管理者は、ノードの予約済みメモリの合計量を設定できます。
この事前設定された値は、Podが実際に利用できる[ノード割り当て可能](/ja/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)メモリの量を計算するために使用されます。

Kubernetesスケジューラーは、割り当て可能なメモリの情報を使用してPodの[スケジューリング](/ja/docs/concepts/scheduling-eviction/)を最適化します。
_ノード割り当て可能_の仕組みは、ノード管理者が、ノードの安定性を確保するために、kubeletまたはオペレーティングシステムのプロセス用としてKubernetesノードのシステムリソースを予約する際に一般的に使用されます。

関連するkubeletの設定には、`kubeReserved`、`systemReserved`、`reservedMemory`があります。
`reservedMemory`設定を使用すると、予約済みメモリの合計を分割し、複数のNUMAノードに割り当てることができます。

NUMAノードごとに、異なるメモリタイプのメモリ予約をカンマ区切りのリストで指定します。
セミコロンを区切り文字として使用し、複数のNUMAノードにまたがる予約を指定することもできます。

メモリマネージャーは、この予約済みメモリをコンテナワークロードの実行には使用しません。

たとえば、10GiBのメモリが利用可能なNUMAノード「NUMA0」があり、`reservedMemory`でNUMA0用に(メモリを)`1Gi`予約するよう設定した場合、メモリマネージャーはPodが利用できるのは9GiBだけであるとみなします。

このパラメーターは省略できますが、すべてのNUMAノードの予約済みメモリ量の合計が、_ノード割り当て可能_メモリの量と等しくなるようにする必要があります。

少なくとも1つのノード割り当て可能パラメーターがゼロ以外の場合、少なくとも1つのNUMAノードに`reservedMemory`を指定する必要があります。
実際には、`evictionHard`のしきい値はデフォルトで`100Mi`であるため、`Static`ポリシーを使用する場合は`reservedMemory`の指定が必須です。

### メモリマネージャーの予約済みメモリの構文 {#reserved-memory-syntax}

kubeletの`reservedMemory`設定例を次に示します。

```yaml
  # 例1
  reservedMemory:
  - numaNode: 0 # NUMAノードのインデックス
    limits:
      memory: "1Gi" # バイト単位の量
  - numaNode: 1
    limits:
      memory: "2Gi" # バイト単位の量
```

```yaml
  # 例2
  reservedMemory:
  - numaNode: 0
    limits:
      "memory": "512Gi"
  - numaNode: 1
    limits:
      "memory": "512Gi"
      "hugepages-1Gi": "2Gi" # Linuxでのみ有効
```

### NUMAメモリ予約の制約

`reservedMemory`の値を指定する場合、その値は、有効な`kubeReserved`および`systemReserved`の値と、`evictionHard`の一部として設定した`memory.available`の値に適合している必要があります。

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} { \textit{reservedMemory} [ \textnormal{i} ]} = \textit{kubeReserved} + \textit{systemReserved} + \textit{evictionHard} \, \boxed{\textnormal{memory.available}}
\end{equation*}\\\
\text{iはNUMAノードのインデックス}
```

上記の式に従わない場合、メモリマネージャーは起動時にエラーを表示します。

言い換えると、上記の例1では、通常のメモリ(`type=memory`)について、Kubernetesは合計3GiBを予約します。つまり、次のようになります。

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} \textit{reservedMemory}_{ [ \textnormal{i} ] }  =  \underbrace{\textit{reservedMemory} [ 0 ] + \textit{reservedMemory} [ 1 ] }_{\textnormal{type=memory}}
            = 1 \textnormal{GiB} + 2 \textnormal{GiB}
            = 3 \textnormal{GiB}
\end{equation*}\\\
\text{iはNUMAノードのインデックス}
```

ノード割り当て可能の設定に関連するkubelet設定の例を次に示します。

```yaml
  kubeReserved: { cpu: "500m", memory: "50Mi" } # CPUの半分、メモリ50MiB
  systemReserved: { cpu: "500m", memory: "256Mi" } # CPUの半分、メモリ256MiB
```

{{< note >}}
デフォルトのハードエビクションしきい値は100MiBであり、ゼロでは**ありません**。
`reservedMemory`で予約するメモリ量を、このハードエビクションしきい値の分だけ増やすことを忘れないでください。
そうしないと、kubeletはメモリマネージャーを起動せず、エラーを表示します。

次に、`reservedMemory`を使用した正しい設定例を示します。
```yaml
  # このスニペットはevictionHardのデフォルト値を前提とする
  memoryManagerPolicy: Static
  kubeReserved: { cpu: "4", memory: "4Gi" }
  systemReserved: { cpu: "1", memory: "1Gi" }
  reservedMemory:
  - numaNode: 0
    limits:
      memory: "3Gi"
  - numaNode: 1
    limits:
      memory: "2148Mi" # 3GiBから100MiBを引いた値
```
{{< /note >}}

### 避けるべき設定 {#reserved-memory-configurations-to-avoid}

次の設定は避けてください。

1. 重複: 同じNUMAノードまたはメモリタイプに異なる値を指定する
1. いずれかのメモリタイプの上限をゼロに設定する
1. マシンのハードウェアに存在しないNUMAノードIDを指定する
1. `memory`または`hugepages-<size>`以外のメモリタイプ名を指定する
   (指定した`<size>`のHugePageも存在する必要があります)

## `Guaranteed` QoSクラスへのPodの配置 {#placing-a-pod-in-the-guaranteed-qos-class}

選択したポリシーが`None`以外の場合、メモリマネージャーは`Guaranteed` QoSクラスのPodを識別します。
メモリマネージャーは、`Guaranteed` Podごとに固有のトポロジーヒントをトポロジーマネージャーに提供します。
`Guaranteed`以外のQoSクラスのPodについては、メモリマネージャーはデフォルトのトポロジーヒントをトポロジーマネージャーに提供します。

次のPodマニフェストの抜粋では、Podを`Guaranteed` QoSクラスに割り当てています。

整数値のCPUを使用するPodは、`requests`と`limits`が等しい場合に`Guaranteed` QoSクラスで実行されます。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

同様に、CPUを共有するPodも、`requests`と`limits`が等しい場合に`Guaranteed` QoSクラスで実行されます。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

Podを`Guaranteed` QoSクラスにするには、CPUとメモリの両方の要求を指定する必要があることに注意してください。

## {{% heading "whatsnext" %}}

- [トポロジー管理のトラブルシューティング](/ja/docs/tasks/debug/debug-cluster/topology/)を読む
- メモリマネージャーに関する[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager)(Kubernetes Enhancement Proposal)を読む
- [Podレベルのリソースマネージャー](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)について読む

[2]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#the-concept-of-node-map-and-memory-maps
