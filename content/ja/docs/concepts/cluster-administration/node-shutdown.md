---
title: ノードのシャットダウン
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetesクラスターでは、{{< glossary_tooltip text="ノード" term_id="node" >}}は
計画的かつグレースフルな方法でシャットダウンされる場合と、停電などの外部要因によって
予期せずシャットダウンされる場合があります。シャットダウン前にノードがドレインされていない場合、
ノードのシャットダウンによってワークロードに障害が発生する可能性があります。
ノードのシャットダウンは **グレースフル** または **非グレースフル** のいずれかです。

<!-- body -->

## グレースフルノードシャットダウン {#graceful-node-shutdown}

kubeletはノードシステムのシャットダウンを検出しようとし、ノード上で実行中のPodを終了させます。

kubeletはノードのシャットダウン中に、Podが通常の
[Podの終了プロセス](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
に従うことを保証します。ノードのシャットダウン中、kubeletは新しいPodを受け付けません
（それらのPodがすでにノードにバインドされている場合でも同様です）。

### グレースフルノードシャットダウンの有効化

{{< tabs name="graceful_shutdown_os" >}}

{{% tab name="Linux" %}}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

Linuxでは、グレースフルノードシャットダウン機能は `GracefulNodeShutdown`
[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)
によって制御されており、1.21でデフォルトで有効になっています。

{{< note >}}

グレースフルノードシャットダウン機能は、systemdの
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)
を利用してノードのシャットダウンを指定した時間だけ遅延させるため、systemdに依存しています。

{{</ note >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

Windowsでは、グレースフルノードシャットダウン機能は `WindowsGracefulNodeShutdown`
[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)
によって制御されており、1.32でアルファ機能として導入されました。Kubernetes 1.34では
ベータ版となり、デフォルトで有効になっています。

{{< note >}}

WindowsのグレースフルノードシャットダウンはkubeletがWindowsサービスとして実行されていることに
依存しており、preshutdownイベントを指定した時間だけ遅延させるための
[サービスコントロールハンドラー](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function)
が登録されます。

{{</ note >}}

Windowsのグレースフルノードシャットダウンはキャンセルできません。

kubeletがWindowsサービスとして実行されていない場合、
[Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info)
イベントを設定・監視することができないため、ノードは上述の
[非グレースフルノードシャットダウン](#non-graceful-node-shutdown)の手順を経る必要があります。

Windowsのグレースフルノードシャットダウン機能が有効になっているが、kubeletが
Windowsサービスとして実行されていない場合、kubeletは失敗せずに動作し続けます。ただし、
Windowsサービスとして実行する必要があることを示すエラーがログに記録されます。

{{% /tab %}}

{{< /tabs >}}

### グレースフルノードシャットダウンの設定

デフォルトでは、以下で説明する両方の設定オプション（`shutdownGracePeriod` と
`shutdownGracePeriodCriticalPods`）はゼロに設定されているため、
グレースフルノードシャットダウン機能は有効になっていないことに注意してください。

この機能を有効化するには、両方のオプションを適切に設定し、ゼロ以外の値に設定する必要があります。

ノードのシャットダウンが通知されると、kubeletはNodeに `NotReady` 条件を設定し、
`reason` を `"node is shutting down"` に設定します。kube-schedulerはこの条件を尊重し、
影響を受けるノードへのPodのスケジューリングを行いません。他のサードパーティスケジューラーも
同じロジックに従うことが期待されています。これは、新しいPodがそのノードにスケジュールされず、
したがって起動しないことを意味します。

kubeletはまた、進行中のノードシャットダウンが検出された場合、`PodAdmission` フェーズ中にPodを
**拒否** します。そのため、`node.kubernetes.io/not-ready:NoSchedule` の
{{< glossary_tooltip text="toleration" term_id="toleration" >}}
を持つPodでもそこで起動しません。

kubeletがAPI経由でNodeにその条件を設定すると、kubeletはローカルで実行中のPodの
終了も開始します。

グレースフルシャットダウン中、kubeletは2つのフェーズでPodを終了します：

1. ノード上で実行中の通常のPodを終了する。

1. ノード上で実行中の[クリティカルPod](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   を終了する。

グレースフルノードシャットダウン機能は2つの
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) オプションで設定します：

- `shutdownGracePeriod`:

  ノードがシャットダウンを遅延させる合計時間を指定します。これは通常のPodと
  [クリティカルPod](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  の両方のPod終了に対する合計猶予期間です。

- `shutdownGracePeriodCriticalPods`:

  ノードのシャットダウン中に
  [クリティカルPod](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  を終了するために使用する時間を指定します。この値は `shutdownGracePeriod` より小さくする必要があります。

{{< note >}}

ノードの終了がシステム（または管理者が手動で）によってキャンセルされる場合があります。
どちらの状況でも、ノードは `Ready` 状態に戻ります。ただし、終了プロセスをすでに開始した
Podはkubeletによって復元されず、再スケジュールが必要になります。

{{< /note >}}

たとえば、`shutdownGracePeriod=30s` で `shutdownGracePeriodCriticalPods=10s` の場合、
kubeletはノードのシャットダウンを30秒遅延させます。シャットダウン中、最初の20秒（30-10秒）
は通常のPodをグレースフルに終了するために確保され、最後の10秒は
[クリティカルPod](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
の終了のために確保されます。

{{< note >}}

グレースフルノードシャットダウン中にPodがevictされた場合、それらはシャットダウン済みとして
マークされます。`kubectl get pods` を実行すると、evictされたPodのステータスが `Terminated`
として表示されます。また `kubectl describe pod` では、ノードのシャットダウンによりPodが
evictされたことが示されます：

```
Reason: Terminated
Message: Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### Podプライオリティに基づくグレースフルノードシャットダウン {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

グレースフルノードシャットダウン中のPodの順序付けに関してより柔軟性を提供するために、
グレースフルノードシャットダウンはPodのPriorityClassを尊重します（クラスターでこの機能を
有効にした場合）。この機能により、クラスター管理者は
[プライオリティクラス](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
に基づいてグレースフルノードシャットダウン中のPodの順序を明示的に定義できます。

上述の[グレースフルノードシャットダウン](#graceful-node-shutdown)機能は、2つのフェーズで
Podをシャットダウンします。クリティカルでないPodに続いて、クリティカルなPodです。
シャットダウン中のPodの順序をより細かく明示的に定義するために追加の柔軟性が必要な場合は、
Podプライオリティに基づくグレースフルシャットダウンを使用できます。

グレースフルノードシャットダウンがPodプライオリティを尊重する場合、グレースフルノード
シャットダウンを複数のフェーズで実行することが可能になります。各フェーズでは特定の
プライオリティクラスのPodをシャットダウンします。kubeletには正確なフェーズとフェーズごとの
シャットダウン時間を設定できます。

クラスター内に以下のカスタムPod
[プライオリティクラス](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
があると仮定します：

| Podプライオリティクラス名 | Podプライオリティクラス値 |
| ----------------------- | ------------------------ |
| `custom-class-a`        | 100000                   |
| `custom-class-b`        | 10000                    |
| `custom-class-c`        | 1000                     |
| `regular/unset`         | 0                        |

[kubelet設定](/docs/reference/config-api/kubelet-config.v1beta1/)内の
`shutdownGracePeriodByPodPriority` の設定は次のようになります：

| Podプライオリティクラス値 | シャットダウン期間 |
| ------------------------ | --------------- |
| 100000                   | 10秒            |
| 10000                    | 180秒           |
| 1000                     | 120秒           |
| 0                        | 60秒            |

対応するkubelet設定のYAML設定は次のとおりです：

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

上記の表は、`priority` 値が100000以上のPodはシャットダウンに10秒しか与えられず、
10000以上100000未満の値を持つPodは180秒、1000以上10000未満の値を持つPodは
120秒のシャットダウン時間が与えられることを意味します。最後に、他のすべてのPodは
60秒のシャットダウン時間が与えられます。

すべてのクラスに対応する値を指定する必要はありません。たとえば、代わりに
次の設定を使用することもできます：

| Podプライオリティクラス値 | シャットダウン期間 |
| ------------------------ | --------------- |
| 100000                   | 300秒           |
| 1000                     | 120秒           |
| 0                        | 60秒            |

上記の場合、`custom-class-b` のPodはシャットダウン時に `custom-class-c` と
同じバケットに入ります。

特定の範囲にPodがない場合、kubeletはその優先度範囲のPodを待機しません。
代わりに、kubeletは直ちに次のプライオリティクラス値の範囲にスキップします。

この機能が有効になっているが設定が提供されていない場合、順序付けアクションは実行されません。

この機能を使用するには `GracefulNodeShutdownBasedOnPodPriority`
[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を
有効にし、[kubelet設定](/docs/reference/config-api/kubelet-config.v1beta1/)の
`ShutdownGracePeriodByPodPriority` をPodプライオリティクラス値と対応するシャットダウン期間を
含む所望の設定に設定する必要があります。

{{< note >}}

グレースフルノードシャットダウン中にPodプライオリティを考慮する機能は、
Kubernetes v1.23でアルファ機能として導入されました。Kubernetes {{< skew currentVersion >}}
では、この機能はベータ版でありデフォルトで有効になっています。

{{< /note >}}

メトリクス `graceful_shutdown_start_time_seconds` と `graceful_shutdown_end_time_seconds`
はノードのシャットダウンを監視するためにkubeletサブシステムの下で出力されます。

## 非グレースフルノードシャットダウンの処理 {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

ノードのシャットダウンアクションは、コマンドがkubeletで使用されるinhibitor locks
メカニズムをトリガーしないか、ユーザーエラー（つまり、ShutdownGracePeriodと
ShutdownGracePeriodCriticalPodsが適切に設定されていない）のために、kubeletの
Node Shutdown Managerによって検出されない場合があります。詳細については
上記の[グレースフルノードシャットダウン](#graceful-node-shutdown)セクションを参照してください。

ノードがシャットダウンされているが、kubeletのNode Shutdown Managerに検出されない場合、
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
の一部であるPodはシャットダウンしたノードでterminatingステータスのまま停止し、
新しい実行中のノードに移動できなくなります。これは、シャットダウンしたノードのkubeletが
Podを削除できないため、StatefulSetが同じ名前の新しいPodを作成できないためです。
Podがボリュームを使用している場合、VolumeAttachmentsは元のシャットダウンしたノードから
削除されないため、これらのPodが使用するボリュームを新しい実行中のノードにアタッチできません。
その結果、StatefulSet上で実行中のアプリケーションは正常に機能しなくなります。元の
シャットダウンしたノードが起動した場合、Podはkubeletによって削除され、異なる実行中のノードに
新しいPodが作成されます。元のシャットダウンしたノードが起動しない場合、これらのPodは
シャットダウンしたノードで永遠にterminatingステータスのままになります。

上記の状況を緩和するために、ユーザーはNodeに `NoExecute` または `NoSchedule` の効果を持つ
テイント `node.kubernetes.io/out-of-service` を手動で追加して、サービス停止中としてマーク
できます。Nodeがこのテイントでサービス停止中としてマークされている場合、一致するtoleration
がないPodはノードから強制的に削除され、ノードで終了中のPodのボリュームデタッチ操作は
直ちに実行されます。これにより、サービス停止中のノード上のPodが別のノードで
素早く回復できるようになります。

非グレースフルシャットダウン中、Podは2つのフェーズで終了します：

1. 一致する `out-of-service` tolerationを持たないPodを強制削除する。

1. そのようなPodのボリュームデタッチ操作を直ちに実行する。

{{< note >}}

- テイント `node.kubernetes.io/out-of-service` を追加する前に、ノードがすでに
  シャットダウンまたは電源オフ状態にあること（再起動中ではないこと）を確認する必要があります。
- ユーザーは、Podが新しいノードに移動した後、およびシャットダウンしたノードが
  回復したことを確認した後、out-of-serviceテイントを手動で削除する必要があります。
  これはもともとテイントを追加したのがユーザー自身であるためです。

{{< /note >}}

### タイムアウト時のストレージ強制デタッチ {#storage-force-detach-on-timeout}

Podの削除が6分間成功しない場合、そのノードが不健全な状態であれば、Kubernetesは
アンマウントされているボリュームを強制的にデタッチします。まだノード上で実行中のワークロードが
強制デタッチされたボリュームを使用している場合、`ControllerUnpublishVolume` は
「ボリュームに対するすべての `NodeUnstageVolume` と `NodeUnpublishVolume` が呼び出されて
成功した後に**必ず**呼び出されなければならない」と述べている
[CSI仕様](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume)
に違反することになります。

このような状況では、当該ノード上のボリュームでデータ破損が発生する可能性があります。

強制ストレージデタッチの動作はオプションです。ユーザーは代わりに
「非グレースフルノードシャットダウン」機能を使用することを選択できます。

タイムアウト時の強制ストレージデタッチは、`kube-controller-manager` の設定フィールド
`disable-force-detach-on-timeout` を設定することで無効にできます。タイムアウト時の
強制デタッチ機能を無効にすると、6分以上不健全なノードでホストされているボリュームの
関連する [VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)
が削除されなくなります。

この設定が適用された後、ボリュームにアタッチされたままの不健全なPodは、
上述の[非グレースフルノードシャットダウン](#non-graceful-node-shutdown)手順によって
回復する必要があります。

{{< note >}}

- [非グレースフルノードシャットダウン](#non-graceful-node-shutdown)手順を使用する際は
  注意が必要です。
- 上記で文書化されたステップから逸脱するとデータ破損につながる可能性があります。

{{< /note >}}

## {{% heading "whatsnext" %}}

以下について詳細を確認してください：

- ブログ：[非グレースフルノードシャットダウン](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)
- クラスターアーキテクチャ：[ノード](/docs/concepts/architecture/nodes/)