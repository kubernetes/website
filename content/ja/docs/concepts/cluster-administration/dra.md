---
title: クラスター管理者のための動的リソース割り当てのグッドプラクティス
content_type: concept
weight: 60
---

<!-- overview -->
このページでは、動的リソース割り当て(DRA)を利用するKubernetesクラスターを設定する際のグッドプラクティスについて説明します。
これらの手順は、クラスター管理者向けです。

<!-- body -->
## DRA関連APIへの権限の分離 {#separate-permissions-to-dra-related-apis}

DRAは、複数の異なるAPIを通じてオーケストレーションされます。
RBACや他のソリューションなどの認可ツールを使用して、ユーザーのペルソナに応じて適切なAPIへのアクセスを制御してください。

一般的に、DeviceClassとResourceSliceは管理者とDRAドライバーに制限する必要があります。
クレームを持つPodをデプロイするクラスターオペレーターは、ResourceClaimとResourceClaimTemplate APIへのアクセスが必要です。
これらのAPIはどちらもNamespaceスコープです。

## DRAドライバーのデプロイとメンテナンス {#dra-driver-deployment-and-maintenance}

DRAドライバーは、クラスターの各ノードで実行されるサードパーティアプリケーションで、そのノードのハードウェアとKubernetesのネイティブDRAコンポーネントとのインターフェースを提供します。
インストール手順は選択したドライバーによって異なりますが、クラスター内のすべてのノードまたは一部のノード(ノードセレクターや類似のメカニズムを使用)にDaemonSetとしてデプロイされる可能性が高いです。

### 利用可能な場合はシームレスアップグレードを使用する {#use-drivers-with-seamless-upgrade-if-available}

DRAドライバーは、[`kubeletplugin`パッケージインターフェース](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)を実装します。
ドライバーは、このインターフェースのプロパティを実装することで_シームレスアップグレード_をサポートする場合があります。
これにより、同じDRAドライバーの2つのバージョンが短時間共存できるようになります。
これはkubeletバージョン1.33以降でのみ利用可能で、古いバージョンのKubernetesを実行しているノードが接続された異種クラスターでは、ドライバーがサポートしていない可能性があります。
必ずドライバーのドキュメントを確認してください。

状況でシームレスアップグレードが利用可能な場合は、ドライバーの更新時のスケジューリング遅延を最小限に抑えるために使用を検討してください。

シームレスアップグレードを使用できない場合、アップグレードのためのドライバーのダウンタイム中に次のことが発生する可能性があります。

* クレームがすでに使用のために準備されていない限り、クレームに依存するPodは起動できません。
* クレームを使用した最後のPodの後のクリーンアップは、ドライバーが再び利用可能になるまで遅延します。
  Podは終了としてマークされません。
  これにより、Podが使用しているリソースを他のPodで再利用できなくなります。
* 実行中のPodは引き続き実行されます。

### DRAドライバーがlivenessプローブを公開していることを確認し、それを利用する {#confirm-your-dra-driver-exposes-a-liveness-probe-and-utilize-it}

DRAドライバーは、DRAドライバーのグッドプラクティスの一部として、ヘルスチェック用のgRPCソケットを実装している可能性が高いです。
このgRPCソケットを利用する最も簡単な方法は、DRAドライバーをデプロイするDaemonSetのlivenessプローブとして設定することです。
ドライバーのドキュメントまたはデプロイツールにはすでにこれが含まれている可能性がありますが、設定を個別に構築している場合や、DRAドライバーをKubernetes Podとして実行していない場合は、オーケストレーションツールがこのgRPCソケットへのヘルスチェックの失敗時にDRAドライバーを再起動するようにしてください。
これにより、DRAドライバーの偶発的なダウンタイムを最小限に抑え、自己修復の機会を増やし、スケジューリングの遅延やトラブルシューティングの時間を削減できます。

### ノードをドレインする際は、DRAドライバーをできるだけ遅くドレインする {#when-draining-a-node-drain-the-dra-driver-as-late-as-possible}

DRAドライバーは、Podに割り当てられたデバイスの準備解除を担当します。
DRAドライバーがクレームを持つPodが削除される前に{{< glossary_tooltip text="ドレイン" term_id="drain" >}}されると、クリーンアップを完了できません。
ノードのカスタムドレインロジックを実装する場合は、DRAドライバー自体を終了する前に、割り当て/予約されたResourceClaimまたはResourceClaimTemplateがないことを確認することを検討してください。


## 特に大規模環境では、より高い負荷に対してコンポーネントを監視および調整する {#monitor-and-tune-components-for-higher-load-especially-in-high-scale-environments}

コントロールプレーンコンポーネント{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}と、{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}コンポーネントによってオーケストレーションされる内部ResourceClaimコントローラーは、DRA APIに格納されたメタデータに基づいてクレームを持つPodのスケジューリング中に重い処理を行います。
DRA以外のスケジュールされたPodと比較して、DRAクレームを使用するPodに必要なAPIサーバー呼び出しの数、メモリ、CPU使用率がこれらのコンポーネントで増加します。
さらに、DRAドライバーやkubeletなどのノードローカルコンポーネントは、Pod sandboxの作成時にハードウェアリクエストを割り当てるためにDRA APIを利用します。
特に、多数のノードを持つクラスターや、DRAで定義されたリソースクレームを大量に利用するワークロードをデプロイする大規模環境では、クラスター管理者は増加した負荷を予測するように関連コンポーネントを設定する必要があります。

調整が不適切なコンポーネントの影響は、Podのライフサイクル中にさまざまな症状を引き起こす直接的または雪だるま式の影響を及ぼす可能性があります。
`kube-scheduler`コンポーネントのQPSとバースト設定が低すぎる場合、スケジューラーはPodに適したノードを迅速に識別できますが、Podをそのノードにバインドするのに時間がかかる場合があります。
DRAでは、Podのスケジューリング中に、`kube-controller-manager`内のclient-go設定のQPSとBurstパラメーターが重要です。

クラスターを調整するための特定の値は、ノード/Podの数、Podの作成率、チャーンなど、DRA以外の環境でもさまざまな要因に依存します。
詳細については、[SIG ScalabilityのKubernetesスケーラビリティしきい値に関するREADME](https://github.com/kubernetes/community/blob/master/sig-scalability/configs-and-limits/thresholds.md)を参照してください。
100ノードのDRA対応クラスターに対して実行されたスケールテストでは、720の長期実行Pod(90%飽和)と80のチャーンPod(10%チャーン、10回)を含み、ジョブ作成QPSが10の場合、`kube-controller-manager`のQPSを75、Burstを150に設定することで、DRA以外のデプロイメントと同等のメトリック目標を達成できました。
この下限では、クライアント側のレートリミッターがAPIサーバーを爆発的なバーストから保護するのに十分にトリガーされましたが、Pod起動SLOに影響を与えないほど高かったことが観察されました。
これは良い出発点ですが、次のメトリックを監視することで、デプロイメントのDRAパフォーマンスに最も大きな影響を与えるさまざまなコンポーネントを調整する方法についてより良いアイデアを得ることができます。
Kubernetesのすべての安定したメトリックの詳細については、[Kubernetesメトリックリファレンス](/docs/reference/generated/metrics/)を参照してください。

### `kube-controller-manager`メトリック {#kube-controller-manager-metrics}

次のメトリックは、`kube-controller-manager`コンポーネントによって管理される内部ResourceClaimコントローラーを詳しく調べます。

* Workqueue Add Rate: {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}}を監視して、ResourceClaimコントローラーにアイテムが追加される速度を測定します。
* Workqueue Depth: {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager", name="resource_claim"}){{< /highlight >}}を追跡して、ResourceClaimコントローラーのバックログを特定します。
* Workqueue Work Duration: {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99, sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m])) by (le)){{< /highlight >}}を観察して、ResourceClaimコントローラーが作業を処理する速度を理解します。

Workqueue Add Rateが低く、Workqueue Depthが高く、Workqueue Work Durationが高い場合、これはコントローラーが最適に動作していないことを示唆しています。
QPS、バースト、CPU/メモリ設定などのパラメーターの調整を検討してください。

Workqueue Add Rateが高く、Workqueue Depthが高いが、Workqueue Work Durationが妥当な場合、これはコントローラーが作業を処理していますが、並行性が不十分である可能性があることを示しています。
並行性はコントローラーにハードコードされているため、クラスター管理者として、Pod作成QPSを削減することで調整でき、リソースクレームワークキューへの追加率がより管理しやすくなります。

### `kube-scheduler`メトリック {#kube-scheduler-metrics}

次のスケジューラーメトリックは、DRAを使用するPodだけでなく、スケジュールされたすべてのPodのパフォーマンスを集約する高レベルのメトリックです。
エンドツーエンドのメトリックは、ResourceClaimTemplateを多用するデプロイメントにおいて、ResourceClaimTemplateからResourceClaimを作成する`kube-controller-manager`のパフォーマンスに最終的に影響を受けることに注意することが重要です。

* Scheduler End-to-End Duration: {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}を監視します。
* Scheduler Algorithm Latency: {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}を追跡します。

### `kubelet`メトリック {#kubelet-metrics}

ノードにバインドされたPodがResourceClaimを満たす必要がある場合、kubeletはDRAドライバーの`NodePrepareResources`および`NodeUnprepareResources`メソッドを呼び出します。
この動作は、kubeletの視点から次のメトリックで観察できます。

* Kubelet NodePrepareResources: {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m])) by (le)){{< /highlight >}}を監視します。
* Kubelet NodeUnprepareResources: {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m])) by (le)){{< /highlight >}}を追跡します。

### DRA kubeletpluginオペレーション {#dra-kubeletplugin-operations}

DRAドライバーは、[`kubeletplugin`パッケージインターフェース](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)を実装します。
これは、基礎となるgRPCオペレーション`NodePrepareResources`および`NodeUnprepareResources`の独自のメトリックを公開します。
この動作は、内部kubeletpluginの視点から次のメトリックで観察できます。

* DRA kubeletplugin gRPC NodePrepareResourcesオペレーション: {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m])) by (le)){{< /highlight >}}を観察します。
* DRA kubeletplugin gRPC NodeUnprepareResourcesオペレーション: {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m])) by (le)){{< /highlight >}}を観察します。


## {{% heading "whatsnext" %}}

* [DRAの詳細](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* [Kubernetesメトリックリファレンス](/docs/reference/generated/metrics/)を読む
