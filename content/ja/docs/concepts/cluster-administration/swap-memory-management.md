---
title: スワップメモリの管理
content_type: concept
weight: 10
---

<!-- overview -->
Kubernetesは、{{< glossary_tooltip text="ノード" term_id="node" >}}上でスワップメモリを使用するように構成でき、カーネルがページをバッキングストレージにスワップアウトすることで物理メモリを解放できるようにします。
これは複数のユースケースで有用です。
たとえば、大きなメモリフットプリントを持つが、特定の時点ではそのメモリの一部しかアクセスしないようなワークロードを実行するノードです。
また、メモリ圧迫時にPodが終了されるのを防いだり、ノードをシステムレベルのメモリスパイクから保護してその安定性を確保したり、ノード上でより柔軟なメモリ管理を可能にしたりするのにも役立ちます。

クラスターでスワップを構成する方法については、[Kubernetesノードでのスワップメモリの構成](/docs/tutorials/cluster-management/provision-swap-memory/)を参照してください。

<!-- body -->

## オペレーティングシステムのサポート {#operating-system-support}

* Linuxノードはスワップをサポートします。各ノードでスワップを有効にするように構成する必要があります。
  デフォルトでは、スワップが有効なLinuxノードでkubeletは**起動しません**。
* Windowsノードはスワップスペースを必要とします。
  デフォルトでは、スワップが無効なWindowsノードでkubeletは**起動しません**。

## どのように動作するか？ {#how-does-it-work}

ノード上でのスワップの使用方法については、いくつかの考えられる方法があります。
kubeletがすでにノード上で実行されている場合、スワップがプロビジョニングされた後にkubeletを再起動して認識させる必要があります。

スワップがプロビジョニングされて利用可能なノードでkubeletが起動する場合(`failSwapOn: false`構成を使用)、kubeletは以下を行います:
- このスワップが有効なノードで起動できるようになります。
- Container Runtime Interface(CRI)実装(コンテナランタイムと呼ばれることが多い)に対して、デフォルトでKubernetesワークロードにスワップメモリをゼロに割り当てるように指示します。

ノード上のスワップ構成は、[KubeletConfigurationの`memorySwap`](/docs/reference/config-api/kubelet-config.v1)を介してクラスター管理者に公開されます。
クラスター管理者として、`memorySwap.swapBehavior`を設定することで、スワップメモリが存在する場合のノードの動作を指定できます。

### スワップの動作 {#swap-behaviors}

使用する[スワップの動作](/docs/reference/node/swap-behavior/)を選択する必要があります。
クラスター内の異なるノードが異なるスワップの動作を使用できます。

Linuxノードで選択できるスワップの動作は以下の通りです:

`NoSwap`(デフォルト)
: このノード上でPodとして実行されるワークロードは、スワップを使用しませんし、使用できません。

`LimitedSwap`
: Kubernetesワークロードはスワップメモリを利用できます。

{{< note >}}
NoSwapの動作を選択し、kubeletがスワップスペースを許容するように構成した場合(`failSwapOn: false`)、ワークロードはスワップを使用しません。

ただし、Kubernetesが管理するコンテナ外のプロセス(systemdサービスやkubelet自体など)はスワップを利用**できます**。
{{< /note >}}

クラスターでスワップを有効にする方法については、[Kubernetesノードでのスワップメモリの構成](/docs/tutorials/cluster-management/provision-swap-memory/)を参照してください。

### コンテナランタイムとの統合 {#container-runtime-integration}

kubeletはコンテナランタイムAPIを使用し、コンテナランタイムに対して特定の構成(たとえばcgroup v2の場合は`memory.swap.max`)を適用するように指示します。
これにより、コンテナに対して目的のスワップ構成が有効になります。
コントロールグループ(cgroups)を使用するランタイムの場合、コンテナランタイムがこれらの設定をコンテナレベルのcgroupに書き込む責任を負います。

## スワップ使用の監視 {#observability-for-swap-use}

### ノードおよびコンテナレベルのメトリック統計 {#node-and-container-level-metric-statistics}

kubeletはノードおよびコンテナレベルのメトリック統計を収集するようになりました。
これらは、kubeletのHTTPエンドポイントである`/metrics/resource`(主にPrometheusなどの監視ツールによって使用される)および`/stats/summary`(主にAutoscalerによって使用される)からアクセスできます。
これにより、kubeletに直接リクエストできるクライアントが、`LimitedSwap`を使用する際のスワップ使用量と残りのスワップメモリを監視できます。
さらに、マシンの合計物理スワップ容量を示す`machine_swap_bytes`メトリックがcadvisorに追加されました。
詳細については[こちらのページ](/docs/reference/instrumentation/node-metrics/)を参照してください。

たとえば、以下の`/metrics/resource`がサポートされています:
- `node_swap_usage_bytes`: ノードの現在のスワップ使用量(バイト単位)。
- `container_swap_usage_bytes`: コンテナの現在のスワップ使用量(バイト単位)。
- `container_swap_limit_bytes`: コンテナの現在のスワップ制限(バイト単位)。

### `kubectl top --show-swap`の使用 {#using-kubectl-top-show-swap}

メトリックのクエリは有用ですが、これらのメトリックは人間ではなくソフトウェアが使用するように設計されているため、少し面倒です。
このデータをよりユーザーフレンドリーな方法で利用するために、`kubectl top`コマンドが`--show-swap`フラグを使用してスワップメトリックをサポートするように拡張されました。

ノードのスワップ使用量に関する情報を取得するには、`kubectl top nodes --show-swap`を使用できます:
```shell
kubectl top nodes --show-swap
```

出力は次のようになります:
```
NAME    CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   SWAP(bytes)    SWAP(%)       
node1   1m           10%      2Mi             10%         1Mi            0%   
node2   5m           10%      6Mi             10%         2Mi            0%   
node3   3m           10%      4Mi             10%         <unknown>      <unknown>   
```

Podのスワップ使用量に関する情報を取得するには、`kubectl top pods --show-swap`を使用できます:
```shell
kubectl top pod -n kube-system --show-swap
```

出力は次のようになります:
```
NAME                                      CPU(cores)   MEMORY(bytes)   SWAP(bytes)
coredns-58d5bc5cdb-5nbk4                  2m           19Mi            0Mi
coredns-58d5bc5cdb-jsh26                  3m           37Mi            0Mi
etcd-node01                               51m          143Mi           5Mi
kube-apiserver-node01                     98m          824Mi           16Mi
kube-controller-manager-node01            20m          135Mi           9Mi
kube-proxy-ffgs2                          1m           24Mi            0Mi
kube-proxy-fhvwx                          1m           39Mi            0Mi
kube-scheduler-node01                     13m          69Mi            0Mi
metrics-server-8598789fdb-d2kcj           5m           26Mi            0Mi   
```

### ノードステータスの一部としてスワップ容量を報告するノード {#nodes-to-report-swap-capacity-as-part-of-node-status}

新しいノードステータスフィールド`node.status.nodeInfo.swap.capacity`が追加され、ノードのスワップ容量を報告するようになりました。

たとえば、クラスター内のノードのスワップ容量を取得するには、以下のコマンドを使用できます:
```shell
kubectl get nodes -o go-template='{{range .items}}{{.metadata.name}}: {{if .status.nodeInfo.swap.capacity}}{{.status.nodeInfo.swap.capacity}}{{else}}<unknown>{{end}}{{"\n"}}{{end}}'
```

出力は次のようになります:
```
node1: 21474836480
node2: 42949664768
node3: <unknown>
```

{{< note >}}
`<unknown>`の値は、そのNodeの`.status.nodeInfo.swap.capacity`フィールドが設定されていないことを示します。
これは通常、ノードにスワップがプロビジョニングされていないか、kubeletがノードのスワップ容量を判断できなかった可能性が低いケースを意味します。
{{< /note >}}

### Node Feature Discovery(NFD)を使用したスワップの検出 {#node-feature-discovery}

[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)は、ハードウェア機能と構成を検出するためのKubernetesアドオンです。
これを利用して、どのノードにスワップがプロビジョニングされているかを検出できます。

たとえば、どのノードにスワップがプロビジョニングされているかを確認するには、以下のコマンドを使用します:
```shell
kubectl get nodes -o jsonpath='{range .items[?(@.metadata.labels.feature\.node\.kubernetes\.io/memory-swap)]}{.metadata.name}{"\t"}{.metadata.labels.feature\.node\.kubernetes\.io/memory-swap}{"\n"}{end}}'
```

出力は次のようになります:
```
k8s-worker1: true
k8s-worker2: true
k8s-worker3: false
```

この例では、ノード`k8s-worker1`と`k8s-worker2`にはスワップがプロビジョニングされていますが、`k8s-worker3`にはプロビジョニングされていません。

## リスクと注意事項 {#risks-and-caveats}

{{< caution >}}
スワップスペースを暗号化することを強くお勧めします。
詳細については、[メモリバックボリューム](#memory-backed-volumes)を参照してください。
{{< /caution >}}

システムでスワップが利用可能な場合、予測可能性が低下します。
スワップはより多くのRAMを利用可能にすることでパフォーマンスを向上させることができますが、データをメモリにスワップバックする操作は重い処理であり、時には桁違いに遅くなることがあり、予期しないパフォーマンスの低下を引き起こす可能性があります。
さらに、スワップはメモリ圧迫時のシステムの動作を変化させます。
スワップを有効にすると、RAMを頻繁に使用するPodが他のPodのスワップを引き起こす可能性があるため、ノイジーネイバーのリスクが高まります。
さらに、スワップによりKubernetesのワークロードのメモリ使用量が予測不能に増大し、予期しないパッキング構成のために、スケジューラーは現在スワップメモリの使用量を考慮していません。
これにより、ノイジーネイバーのリスクが高まります。

スワップメモリが有効なノードのパフォーマンスは、基盤となる物理ストレージに依存します。
スワップメモリが使用されている場合、I/O制限のあるクラウドVMなどのIOPS制約のある環境では、SSDやNVMeなどの高速なストレージメディアと比較して、パフォーマンスが大幅に低下します。
スワップはIO圧迫を引き起こす可能性があるため、システムクリティカルなデーモンに対してより高いIOレイテンシー優先度を与えることが推奨されます。
以下の[推奨プラクティス](#good-practice-for-using-swap-in-a-kubernetes-cluster)セクションの関連セクションを参照してください。

### メモリバックボリューム {#memory-backed-volumes}

Linuxノードでは、メモリバックボリューム([`secret`](/docs/concepts/configuration/secret/)ボリュームマウントや`medium: Memory`を使用した[`emptyDir`](/docs/concepts/storage/volumes/#emptydir)など)は`tmpfs`ファイルシステムで実装されています。
このようなボリュームの内容は常にメモリに保持されるべきであり、ディスクにスワップされるべきではありません。
このようなボリュームの内容がメモリに保持されることを保証するために、`noswap` tmpfsオプションが使用されています。

Linuxカーネルはバージョン6.3から`noswap`オプションを公式にサポートしています(詳細は[Linuxカーネルバージョンの要件](/docs/reference/node/kernel-version-requirements/#requirements-other)を参照してください)。
ただし、さまざまなディストリビューションではこのマウントオプションを古いLinuxバージョンにバックポートすることがよくあります。

ノードが`noswap`オプションをサポートしているかどうかを確認するために、kubeletは以下を行います:
* カーネルのバージョンが6.3以上の場合、`noswap`オプションがサポートされていると見なされます。
* それ以外の場合、kubeletは起動時に`noswap`オプションを使用してダミーのtmpfsをマウントしようとします。
  kubeletが不明なオプションを示すエラーで失敗した場合、`noswap`はサポートされていないと見なされ、使用されません。
  メモリバックボリュームがディスクにスワップされる可能性があることをユーザーに警告するkubeletのログエントリが出力されます。
  kubeletが成功した場合、ダミーのtmpfsは削除され、`noswap`オプションが使用されます。
  * `noswap`オプションがサポートされていない場合、kubeletは警告ログエントリを出力し、実行を続行します。

暗号化されていないスワップの設定例については、[上記のセクション](#setting-up-encrypted-swap)を参照してください。
ただし、暗号化されたスワップの処理はkubeletの範囲外であり、一般的なOSの構成の問題として対処されるべきです。
このリスクを軽減するために暗号化されたスワップをプロビジョニングするのは管理者の責任です。

### エビクション {#evictions}

スワップが有効なノードに対するメモリエビクションのしきい値の構成は複雑です。

スワップが無効な場合、kubeletのエビクションしきい値をノードのメモリ容量より少し低く設定することは合理的です。
その理由は、ノードがメモリ不足になりOut Of Memory(OOM)キラーが呼び出される前にKubernetesがPodのエビクションを開始したいからです。
OOMキラーはKubernetesを認識しないため、QoS、Podの優先度、またはその他のKubernetes固有の要素を考慮しません。

スワップが有効な場合、状況はより複雑です。
Linuxでは、`vm.min_free_kbytes`パラメーターがカーネルがメモリの積極的な回収(ページのスワップアウトを含む)を開始するメモリしきい値を定義します。
kubeletのエビクションしきい値が、カーネルがメモリ回収を開始する前にエビクションが行われるように設定されている場合、ノードのメモリ圧迫時にワークロードがスワップアウトできなくなる可能性があります。
一方、エビクションしきい値を高すぎに設定すると、ノードがメモリ不足になりOOMキラーが呼び出される可能性があり、これも理想的ではありません。

これに対処するため、kubeletのエビクションしきい値を`vm.min_free_kbytes`の値よりわずかに低く設定することが推奨されます。
この方法により、kubeletがPodのエビクションを開始する前にノードがスワップを開始でき、ワークロードが未使用データをスワップアウトしてエビクションを防止できます。
一方、わずかに低いだけなので、ノードがメモリ不足になる前にkubeletがPodのエビクションを開始し、OOMキラーを回避できます。

`vm.min_free_kbytes`の値は、ノード上で以下のコマンドを実行することで確認できます:
```shell
cat /proc/sys/vm/min_free_kbytes
```

### 未使用のスワップスペース {#unutilized-swap-space}

`LimitedSwap`の動作では、Podが利用できるスワップの量は、ノードの合計メモリに対するメモリリクエストの割合に基づいて自動的に決定されます(詳細については、[以下のセクション](#how-is-the-swap-limit-being-determined-with-limitedswap)を参照してください)。

この設計により、通常、Kubernetesワークロードに対して制限されたままとなるスワップの一部が存在します。
たとえば、Kubernetes {{< skew currentVersion >}}はGuaranteed {{< glossary_tooltip text="QoSクラス" term_id="qos-class" >}}のPodに対してスワップの使用を許可していないため、Guaranteed Podのメモリリクエストに比例するスワップの量は、Kubernetesワークロードによって使用されずに残ります。

この動作は、多くのPodがスワップの対象外である場合にリスクを伴います。
一方で、これはKubernetesの管理範囲外のプロセス(システムデーモンやkubelet自体など)が使用できる、システム予約量のスワップメモリを効果的に維持します。

## Kubernetesクラスターでスワップを使用するための推奨プラクティス {#good-practice-for-using-swap-in-a-kubernetes-cluster}

### システムクリティカルなデーモンに対するスワップの無効化 {#disable-swap-for-system-critical-daemons}

テストフェーズとユーザーフィードバックに基づいて、システムクリティカルなデーモンとサービスのパフォーマンスが低下する可能性があることが観察されました。
これには、kubeletを含むシステムデーモンが通常よりも遅く動作する可能性があることが含まれます。
この問題が発生した場合、スワップを防止するためにシステムスライスのcgroupを構成すること(つまり`memory.swap.max=0`を設定すること)が推奨されます。

### システムクリティカルなデーモンのI/Oレイテンシーの保護 {#protect-system-critical-daemons-for-io-latency}

スワップはノードのI/O負荷を増加させる可能性があります。
メモリ圧迫によりカーネルが急速にページをスワップインおよびスワップアウトする場合、I/O操作に依存するシステムクリティカルなデーモンとサービスがパフォーマンスの低下を経験する可能性があります。

これを軽減するために、systemdユーザーにはシステムスライスのI/Oレイテンシーを優先することが推奨されます。
非systemdユーザーの場合、システムデーモンとプロセス用の専用cgroupをセットアップし、同様にI/Oレイテンシーを優先することが推奨されます。
これは、システムスライスに`io.latency`を設定することで実現でき、より高いI/O優先度を付与します。
詳細については[cgroupのドキュメント](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst)を参照してください。

### スワップとコントロールプレーンノード {#swap-and-control-plane-nodes}

Kubernetesプロジェクトは、スワップスペースを構成せずにコントロールプレーンノードを実行することを推奨しています。
コントロールプレーンは主にGuaranteed QoSのPodをホストするため、一般的にスワップを無効にできます。
主な懸念点は、コントロールプレーン上のクリティカルなサービスのスワップがパフォーマンスに悪影響を与える可能性があることです。

### スワップ用の専用ディスクの使用 {#use-of-a-dedicated-disk-for-swap}

Kubernetesプロジェクトは、スワップが有効なノードを実行する場合は常に暗号化されたスワップを使用することを推奨しています。
スワップがパーティションまたはルートファイルシステム上にある場合、ワークロードがディスクへの書き込みを必要とするシステムプロセスに干渉する可能性があります。
同じディスクを共有している場合、プロセスがスワップを圧倒し、kubelet、コンテナランタイム、およびsystemdのI/Oを中断させ、他のワークロードに影響を与える可能性があります。
スワップスペースはディスク上に配置されるため、意図されたユースケースに対してディスクが十分に高速であることを確認することが重要です。
あるいは、単一のバッキングデバイスの異なるマップ領域間でI/O優先度を構成することもできます。

### スワップを考慮したスケジューリング {#swap-aware-scheduling}

Kubernetes {{< skew currentVersion >}}は、スワップメモリの使用量を考慮してノードにPodを割り当てることをサポートしていません。
スケジューラーは通常、Pod配置のガイドとしてインフラストラクチャリソースの _リクエスト_ を使用しますが、Podはスワップスペースをリクエストせず、`memory`のみをリクエストします。
つまり、スケジューラーはスケジューリングの決定においてスワップメモリを考慮しません。
これは現在積極的に取り組んでいるものですが、まだ実装されていません。

管理者がPodをスワップメモリで意図的に使用する場合を除き、スワップメモリのあるノードにスケジュールされないようにするために、管理者はスワップが利用可能なノードにtaintを設定してこの問題から保護できます。
taintにより、スワップを許容するワークロードが負荷の下でスワップのないノードに溢れ出ることが防止されます。

### 最適なパフォーマンスのためのストレージの選択 {#selecting-storage-for-optimal-performance}

スワップスペースに指定されるストレージデバイスは、高いメモリ使用量時のシステム応答性を維持するために重要です。
回転式ハードディスクドライブ(HDD)は、その機械的な性質により大きなレイテンシーが発生し、深刻なパフォーマンスの低下とシステムのスラッシングを引き起こすため、このタスクには適していません。
現代のパフォーマンス要件には、ソリッドステートドライブ(SSD)などのデバイスがスワップに適した選択肢です。
低レイテンシーの電子的アクセスにより、速度低下を最小限に抑えます。

## スワップの動作の詳細 {#swap-behavior-details}

### LimitedSwapでスワップ制限はどのように決定されるか？ {#how-is-the-swap-limit-being-determined-with-limitedswap}

スワップメモリの構成(制限を含む)は重大な課題を提示します。
誤設定が起こりやすいだけでなく、システムレベルのプロパティであるため、誤設定は特定のワークロードではなくノード全体を危険にさらす可能性があります。
このリスクを軽減し、ノードの健全性を確保するために、制限の自動構成を備えたスワップを実装しました。

`LimitedSwap`では、Burstable QoS分類に属さないPod(つまり`BestEffort`/`Guaranteed` QoSのPod)はスワップメモリの利用が禁止されています。
`BestEffort` QoSのPodは予測不能なメモリ消費パターンを示し、メモリ使用量に関する情報が不足しているため、安全なスワップメモリの割り当てを決定することが困難です。
逆に、`Guaranteed` QoSのPodは通常、ワークロードによって指定されたリソースの正確な割り当てに依存するアプリケーションに使用され、メモリがすぐに利用可能であることが前提となります。
上記のセキュリティとノードの健全性の保証を維持するため、`LimitedSwap`が有効な場合、これらのPodはスワップメモリの使用が許可されません。
さらに、高優先度のPodは、消費するメモリが常にディスク上に常駐し、使用可能であることを保証するために、スワップの使用が許可されていません。

スワップ制限の計算を詳しく説明する前に、以下の用語を定義する必要があります:
* `nodeTotalMemory`: ノードで利用可能な物理メモリの合計量。
* `totalPodsSwapAvailable`: Podが使用できるノード上のスワップメモリの合計量(一部のスワップメモリはシステム使用のために予約されている場合があります)。
* `containerMemoryRequest`: コンテナのメモリリクエスト。

スワップ制限は次のように構成されます:
( `containerMemoryRequest` / `nodeTotalMemory` ) × `totalPodsSwapAvailable`

つまり、コンテナが使用できるスワップの量は、そのメモリリクエスト、ノードの合計物理メモリ、およびPodが使用できるノード上のスワップメモリの合計量に比例します。

Burstable QoSのPod内のコンテナの場合、メモリリクエストをメモリ制限と等しく指定することでスワップの使用をオプトアウトできることに注意する必要があります。
この方法で構成されたコンテナはスワップメモリにアクセスできません。

## {{% heading "whatsnext" %}}

- Linuxノードでのスワップの管理については、[Kubernetesノードでのスワップメモリの構成](/docs/tutorials/cluster-management/provision-swap-memory/)を参照してください。
- [Kubernetesとスワップに関するブログ記事](/blog/2025/03/25/swap-linux-improvements/)もご覧ください。
- 背景情報については、オリジナルのKEP [KEP-2400](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2400-node-swap)とその[設計](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)を参照してください。
