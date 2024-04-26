---
title: Podのライフサイクル
content_type: concept
weight: 30
---

<!-- overview -->

このページではPodのライフサイクルについて説明します。Podは定義されたライフサイクルに従い `Pending`[フェーズ](#pod-phase)から始まり、少なくとも1つのプライマリーコンテナが正常に開始した場合は`Running`を経由し、次に失敗により終了したコンテナの有無に応じて、`Succeeded`または`Failed`フェーズを経由します。

Podの実行中、kubeletはコンテナを再起動して、ある種の障害を処理できます。Pod内で、Kubernetesはさまざまなコンテナの[ステータス](#container-states)を追跡して、回復させるためのアクションを決定します。

Kubernetes APIでは、Podには仕様と実際のステータスの両方があります。Podオブジェクトのステータスは、[PodのCondition](#pod-conditions)のセットで構成されます。[カスタムのReadiness情報](#pod-readiness-gate)をPodのConditionデータに挿入することもできます。

Podはその生存期間に1回だけ[スケジューリング](/docs/concepts/scheduling-eviction/)されます。PodがNodeにスケジュール(割り当て)されると、Podは停止または[終了](#pod-termination)するまでそのNode上で実行されます。


<!-- body -->

## Podのライフタイム

個々のアプリケーションコンテナと同様に、Podは(永続的ではなく)比較的短期間の存在と捉えられます。Podが作成されると、一意のID([UID](/ja/docs/concepts/overview/working-with-objects/names/#uids))が割り当てられ、(再起動ポリシーに従って)終了または削除されるまでNodeで実行されるようにスケジュールされます。  
{{< glossary_tooltip term_id="node" >}}が停止した場合、そのNodeにスケジュールされたPodは、タイムアウト時間の経過後に[削除](#pod-garbage-collection)されます。

Pod自体は、自己修復しません。Podが{{< glossary_tooltip text="node" term_id="node" >}}にスケジュールされ、その後に失敗した場合、Podは削除されます。同様に、リソースの不足またはNodeのメンテナンスによりPodはNodeから立ち退きます。Kubernetesは、比較的使い捨てのPodインスタンスの管理作業を処理する、{{< glossary_tooltip term_id="controller" text="controller" >}}と呼ばれる上位レベルの抽象化を使用します。

特定のPod(UIDで定義)は新しいNodeに"再スケジュール"されません。代わりに、必要に応じて同じ名前で、新しいUIDを持つ同一のPodに置き換えることができます。

{{< glossary_tooltip term_id="volume" text="volume" >}}など、Podと同じ存続期間を持つものがあると言われる場合、それは(そのUIDを持つ)Podが存在する限り存在することを意味します。そのPodが何らかの理由で削除された場合、たとえ同じ代替物が作成されたとしても、関連するもの(例えばボリューム)も同様に破壊されて再作成されます。

{{< figure src="/images/docs/pod.svg" title="Podの図" class="diagram-medium" >}}

*file puller(ファイル取得コンテナ)とWebサーバーを含むマルチコンテナのPod。コンテナ間の共有ストレージとして永続ボリュームを使用しています。*


## Podのフェーズ {#pod-phase}

Podの`status`項目は[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)オブジェクトで、それは`phase`のフィールドがあります。

Podのフェーズは、そのPodがライフサイクルのどの状態にあるかを、簡単かつ高レベルにまとめたものです。このフェーズはコンテナやPodの状態を包括的にまとめることを目的としたものではなく、また包括的なステートマシンでもありません。

Podの各フェーズの値と意味は厳重に守られています。ここに記載されているもの以外に`phase`の値は存在しないと思ってください。

これらが`phase`の取りうる値です。

値          | 概要
:-----------|:-----------
`Pending`   | PodがKubernetesクラスターによって承認されましたが、1つ以上のコンテナがセットアップされて稼働する準備ができていません。これには、スケジュールされるまでの時間と、ネットワーク経由でイメージをダウンロードするための時間などが含まれます。
`Running`   | PodがNodeにバインドされ、すべてのコンテナが作成されました。少なくとも1つのコンテナがまだ実行されているか、開始または再起動中です。
`Succeeded` | Pod内のすべてのコンテナが正常に終了し、再起動されません。
`Failed`    | Pod内のすべてのコンテナが終了し、少なくとも1つのコンテナが異常終了しました。つまり、コンテナはゼロ以外のステータスで終了したか、システムによって終了されました。
`Unknown`   | 何らかの理由によりPodの状態を取得できませんでした。このフェーズは通常はPodのホストとの通信エラーにより発生します。

{{< note >}}
Podの削除中に、kubectlコマンドには`Terminating`が出力されることがあります。この`Terminating`ステータスは、Podのフェーズではありません。Podには、正常に終了するための期間を与えられており、デフォルトは30秒です。`--force`フラグを使用して、[Podを強制的に削除する](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)ことができます。
{{< /note >}}

Nodeが停止するか、クラスターの残りの部分から切断された場合、Kubernetesは失われたNode上のすべてのPodの`Phase`をFailedに設定するためのポリシーを適用します。

## コンテナのステータス {#container-states}

Pod全体の[フェーズ](#pod-phase)と同様に、KubernetesはPod内の各コンテナの状態を追跡します。[container lifecycle hooks](/ja/docs/concepts/containers/container-lifecycle-hooks/)を使用して、コンテナのライフサイクルの特定のポイントで実行するイベントをトリガーできます。

Podが{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}によってNodeに割り当てられると、kubeletは{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}を使用してコンテナの作成を開始します。コンテナの状態は`Waiting`、`Running`または`Terminated`の3ついずれかです。

Podのコンテナの状態を確認するには`kubectl describe pod [POD_NAME]`のコマンドを使用します。Pod内のコンテナごとにStateの項目として表示されます。

各状態の意味は次のとおりです。

### `Waiting` {#container-state-waiting}

コンテナが`Running`または`Terminated`のいずれの状態でもない場合コンテナは`Waiting`の状態になります。Waiting状態のコンテナは引き続きコンテナイメージレジストリからイメージを取得したり{{< glossary_tooltip text="Secret" term_id="secret" >}}を適用したりするなど必要な操作を実行します。`Waiting`状態のコンテナを持つPodに対して`kubectl`コマンドを使用すると、そのコンテナが`Waiting`の状態である理由の要約が表示されます。

### `Running` {#container-state-running}

`Running`状態はコンテナが問題なく実行されていることを示します。`postStart`フックが構成されていた場合、それはすでに実行が完了しています。`Running`状態のコンテナを持つPodに対して`kubectl`コマンドを使用すると、そのコンテナが`Running`状態になった時刻が表示されます。

### `Terminated` {#container-state-terminated}

`Terminated`状態のコンテナは実行されて、完了したときまたは何らかの理由で失敗したことを示します。`Terminated`状態のコンテナを持つPodに対して`kubectl`コマンドを使用すると、いずれにせよ理由と終了コード、コンテナの開始時刻と終了時刻が表示されます。

コンテナが`Terminated`に入る前に`preStop`フックがあれば実行されます。

## コンテナの再起動ポリシー {#restart-policy}

Podの`spec`には、Always、OnFailure、またはNeverのいずれかの値を持つ`restartPolicy`フィールドがあります。デフォルト値はAlwaysです。

`restartPolicy`は、Pod内のすべてのコンテナに適用されます。`restartPolicy`は、同じNode上のkubeletによるコンテナの再起動のみを参照します。Pod内のコンテナが終了した後、kubeletは5分を上限とする指数バックオフ遅延（10秒、20秒、40秒...）でコンテナを再起動します。コンテナが10分間実行されると、kubeletはコンテナの再起動バックオフタイマーをリセットします。

## PodのCondition {#pod-conditions}

PodにはPodStatusがあります。それにはPodが成功したかどうかの情報を持つ[PodCondition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)の配列が含まれています。kubeletは、下記のPodConditionを管理します:

* `PodScheduled`: PodがNodeにスケジュールされました。
* `PodHasNetwork`: (アルファ版機能; [明示的に有効](#pod-has-network)にしなければならない) Podサンドボックスが正常に作成され、ネットワークの設定が完了しました。
* `ContainersReady`: Pod内のすべてのコンテナが準備できた状態です。
* `Initialized`: すべての[Initコンテナ](/ja/docs/concepts/workloads/pods/init-containers)が正常に終了しました。
* `Ready`: Podはリクエストを処理でき、一致するすべてのサービスの負荷分散プールに追加されます。

フィールド名         | 内容
:--------------------|:-----------
`type`               | このPodの状態の名前です。
`status`             | その状態が適用可能かどうか示します。可能な値は"`True`"、"`False`"、"`Unknown`"のうちのいずれかです。
`lastProbeTime`      | Pod Conditionが最後に確認されたときのタイムスタンプが表示されます。
`lastTransitionTime` | 最後にPodのステータスの遷移があった際のタイムスタンプが表示されます。
`reason`             | 最後の状態遷移の理由を示す、機械可読のアッパーキャメルケースのテキストです。
`message`            | ステータスの遷移に関する詳細を示す人間向けのメッセージです。

## PodのReadiness {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

追加のフィードバックやシグナルをPodStatus:*Pod readiness*に注入できるようにします。これを使用するには、Podの`spec`で`readinessGates`を設定して、kubeletがPodのReadinessを評価する追加の状態のリストを指定します。

ReadinessゲートはPodの`status.conditions`フィールドの現在の状態によって決まります。Kubernetesが`Podのstatus.conditions`フィールドでそのような状態を発見できない場合、ステータスはデフォルトで`False`になります。

以下はその例です。

```yaml
Kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready  # これはビルトインのPodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"   # 追加のPodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

PodのConditionは、Kubernetesの[label key format](/ja/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)に準拠している必要があります。

### PodのReadinessの状態 {#pod-readiness-status}

`kubectl patch`コマンドはオブジェクトステータスのパッチ適用をまだサポートしていません。Podにこれらの`status.conditions`を設定するには、アプリケーションと{{< glossary_tooltip term_id="operator-pattern" text="operators">}}は`PATCH`アクションを使用する必要があります。[Kubernetes client library](/docs/reference/using-api/client-libraries/)を使用して、PodのReadinessのためにカスタムのPodのConditionを設定するコードを記述できます。

カスタムのPodのConditionが導入されるとPodは次の両方の条件に当てはまる場合**のみ**準備できていると評価されます:

* Pod内のすべてのコンテナが準備完了している。
* `ReadinessGates`で指定された条件が全て`True`である。

Podのコンテナは準備完了ですが、少なくとも1つのカスタムのConditionが欠落しているか「False」の場合、kubeletはPodの[Condition](#pod-condition)を`ContainersReady`に設定します。

### PodのネットワークのReadiness {#pod-has-network}

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

Podがノードにスケジュールされた後、kubeletによって承認され、任意のボリュームがマウントされる必要があります。これらのフェーズが完了すると、kubeletはコンテナランタイム({{< glossary_tooltip term_id="cri" >}}を使用)と連携して、ランタイムサンドボックスのセットアップとPodのネットワークを構成します。もし`PodHasNetworkCondition`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっている場合、kubeletは、Podがこの初期化の節目に到達したかどうかをPodの`status.conditions`フィールドにある`PodHasNetwork`状態を使用して報告します。

ネットワークが設定されたランタイムサンドボックスがPodにないことを検出すると、`PodHasNetwork`状態は、kubelet によって`False`に設定されます。これは、以下のシナリオで発生します:
* Podのライフサイクルの初期で、kubeletがコンテナランタイムを使用してPodのサンドボックスのセットアップをまだ開始していないとき
* Podのライフサイクルの後期で、Podのサンドボックスが以下のどちらかの原因で破壊された場合:
  * Podを退去させず、ノードが再起動する
  * コンテナランタイムの隔離に仮想マシンを使用している場合、Podサンドボックスの仮想マシンが再起動し、新しいサンドボックスと新しいコンテナネットワーク設定を作成する必要があります

ランタイムプラグインによるサンドボックスの作成とPodのネットワーク設定が正常に完了すると、kubeletによって`PodHasNetwork`状態が`True`に設定されます。`PodHasNetwork`状態が`True`に設定された後、kubeletはコンテナイメージの取得とコンテナの作成を開始することができます。

initコンテナを持つPodの場合、initコンテナが正常に完了すると(ランタイムプラグインによるサンドボックスの作成とネットワーク設定が正常に行われた後に発生)、kubeletは`Initialized`状態を`True`に設定します。initコンテナがないPodの場合、サンドボックスの作成およびネットワーク設定が開始する前にkubeletは`Initialized`状態を`True`に設定します。

## コンテナのProbe {#container-probes}

*Probe*は[kubelet](/docs/reference/command-line-tools-reference/kubelet/) により定期的に実行されるコンテナの診断です。診断を行うために、kubeletはコンテナ内でコードを実行するか、ネットワークリクエストします。

### チェックのメカニズム {#probe-check-methods}

probeを使ってコンテナをチェックする4つの異なる方法があります。
各probeは、この4つの仕組みのうち1つを正確に定義する必要があります:

`exec`
: コンテナ内で特定のコマンドを実行します。コマンドがステータス0で終了した場合に診断を成功と見なします。

`grpc`
: [gRPC](https://grpc.io/)を使ってリモートプロシージャコールを実行します。
  ターゲットは、[gRPC health checks](https://grpc.io/grpc/core/md_doc_health-checking.html)を実装する必要があります。
  レスポンスの`status`が`SERVING`の場合に診断を成功と見なします。
  gRPCはアルファ版の機能のため、`GRPCContainerProbe`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が
  有効の場合のみ利用可能です。

`httpGet`
: PodのIPアドレスに対して、指定されたポートとパスでHTTP `GET`のリクエストを送信します。
  レスポンスのステータスコードが200以上400未満の際に診断を成功とみなします。

`tcpSocket`
: PodのIPアドレスに対して、指定されたポートでTCPチェックを行います。
  そのポートが空いていれば診断を成功とみなします。
  オープンしてすぐにリモートシステム(コンテナ)が接続を切断した場合、健全な状態としてカウントします。

### Probeの結果 {#probe-outcome}

各Probe 次の3つのうちの一つの結果を持ちます:

`Success`
: コンテナの診断が成功しました。

`Failure`
: コンテナの診断が失敗しました。

`Unknown`
: コンテナの診断自体が失敗しました(何も実行する必要はなく、kubeletはさらにチェックを行います)。

### Probeの種類 {#types-of-probe}

kubeletは3種類のProbeを実行中のコンテナで行い、また反応することができます:

`livenessProbe`
: コンテナが動いているかを示します。
  livenessProbeに失敗すると、kubeletはコンテナを殺します、そしてコンテナは[restart policy](#restart-policy)に従います。
  コンテナにlivenessProbeが設定されていない場合、デフォルトの状態は`Success`です。

`readinessProbe`
: コンテナがリクエスト応答する準備ができているかを示します。
  readinessProbeに失敗すると、エンドポイントコントローラーにより、ServiceからそのPodのIPアドレスが削除されます。
  initial delay前のデフォルトのreadinessProbeの初期値は`Failure`です。
  コンテナにreadinessProbeが設定されていない場合、デフォルトの状態は`Success`です。

`startupProbe`
: コンテナ内のアプリケーションが起動したかどうかを示します。
  startupProbeが設定された場合、完了するまでその他のすべてのProbeは無効になります。
  startupProbeに失敗すると、kubeletはコンテナを殺します、そしてコンテナは[restart policy](#restart-policy)に従います。
  コンテナにstartupProbeが設定されていない場合、デフォルトの状態は`Success`です。

livenessProbe、readinessProbeまたはstartupProbeを設定する方法の詳細については、[Liveness Probe、Readiness ProbeおよびStartup Probeを使用する](/ja/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)を参照してください。

#### livenessProbeをいつ使うべきか? {#when-should-you-use-a-liveness-probe}

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

コンテナ自体に問題が発生した場合や状態が悪くなった際にクラッシュすることができればlivenessProbeは不要です。
この場合kubeletが自動でPodの`restartPolicy`に基づいたアクションを実行します。

Probeに失敗したときにコンテナを殺したり再起動させたりするには、livenessProbeを設定し`restartPolicy`をAlwaysまたはOnFailureにします。

#### readinessProbeをいつ使うべきか? {#when-should-you-use-a-readiness-probe}

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Probeが成功したときにのみPodにトラフィックを送信したい場合は、readinessProbeを指定します。
この場合readinessProbeはlivenessProbeと同じになる可能性がありますが、readinessProbeが存在するということは、Podがトラフィックを受けずに開始され、Probe成功が開始した後でトラフィックを受け始めることになります。

コンテナがメンテナンスのために停止できるようにするには、livenessProbeとは異なる、特定のエンドポイントを確認するreadinessProbeを指定することができます。

アプリがバックエンドサービスと厳密な依存関係にある場合、livenessProbeとreadinessProbeの両方を実装することができます。アプリ自体が健全であればlivenessProbeはパスしますが、readinessProbeはさらに、必要なバックエンドサービスが利用可能であるかどうかをチェックします。これにより、エラーメッセージでしか応答できないPodへのトラフィックの転送を避けることができます。

コンテナの起動中に大きなデータ、構成ファイル、またはマイグレーションを読み込む必要がある場合は、[startupProbe](#when-should-you-use-a-startup-probe)を使用できます。ただし、失敗したアプリと起動データを処理中のアプリの違いを検出したい場合は、readinessProbeを使用した方が良いかもしれません。

{{< note >}}
Podが削除されたときにリクエストを来ないようにするためには必ずしもreadinessProbeが必要というわけではありません。Podの削除時にはreadinessProbeが存在するかどうかに関係なくPodは自動的に自身をunreadyにします。Pod内のコンテナが停止するのを待つ間Podはunreadyのままです。
{{< /note >}}

#### startupProbeをいつ使うべきか? {#when-should-you-use-a-startup-probe}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

startupProbeは、サービスの開始に時間がかかるコンテナを持つPodに役立ちます。livenessProbeの間隔を長く設定するのではなく、コンテナの起動時に別のProbeを構成して、livenessProbeの間隔よりも長い時間を許可できます。
コンテナの起動時間が、`initialDelaySeconds + failureThreshold x periodSeconds`よりも長い場合は、livenessProbeと同じエンドポイントをチェックするためにstartupProbeを指定します。`periodSeconds`のデフォルトは10秒です。次に、`failureThreshold`をlivenessProbeのデフォルト値を変更せずにコンテナが起動できるように、十分に高い値を設定します。これによりデッドロックを防ぐことができます。

## Podの終了 {#pod-termination}

Podは、クラスター内のNodeで実行中のプロセスを表すため、不要になったときにそれらのプロセスを正常に終了できるようにすることが重要です(対照的なケースは、KILLシグナルで強制終了され、クリーンアップする機会がない場合)。

ユーザーは削除を要求可能であるべきで、プロセスがいつ終了するかを知ることができなければなりませんが、削除が最終的に完了することも保証できるべきです。ユーザーがPodの削除を要求すると、システムはPodが強制終了される前に意図された猶予期間を記録および追跡します。強制削除までの猶予期間がある場合、{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}正常な終了を試みます。

通常、コンテナランタイムは各コンテナのメインプロセスにTERMシグナルを送信します。多くのコンテナランタイムは、コンテナイメージで定義されたSTOPSIGNAL値を尊重し、TERMシグナルの代わりにこれを送信します。猶予期間が終了すると、プロセスにKILLシグナルが送信され、Podは{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}から削除されます。プロセスの終了を待っている間にkubeletかコンテナランタイムの管理サービスが再起動されると、クラスターは元の猶予期間を含めて、最初からリトライされます。

フローの例は下のようになります。

1. ユーザーがデフォルトの猶予期間(30秒)でPodを削除するために`kubectl`コマンドを送信する。
1. API server内のPodは、猶予期間を越えるとPodが「死んでいる」と見なされるように更新される。  
   削除中のPodに対して`kubectl describe`コマンドを使用すると、Podは「終了中」と表示される。  
   Podが実行されているNode上で、Podが終了しているとマークされている(正常な終了期間が設定されている)とkubeletが認識するとすぐに、kubeletはローカルでPodの終了プロセスを開始します。
    1. Pod内のコンテナの1つが`preStop`[フック](/ja/docs/concepts/containers/container-lifecycle-hooks)を定義している場合は、コンテナの内側で呼び出される。猶予期間が終了した後も`preStop`フックがまだ実行されている場合は、一度だけ猶予期間を延長される(2秒)。
   {{< note >}}
   `preStop`フックが完了するまでにより長い時間が必要な場合は、`terminationGracePeriodSeconds`を変更する必要があります。
   {{< /note >}}
    1. kubeletはコンテナランタイムをトリガーして、コンテナ内のプロセス番号1にTERMシグナルを送信する。
   {{< note >}}
   Pod内のすべてのコンテナが同時にTERMシグナルを受信するわけではなく、シャットダウンの順序が問題になる場合はそれぞれに`preStop`フックを使用して同期することを検討する。
   {{< /note >}}
1. kubeletが正常な終了を開始すると同時に、コントロールプレーンは、終了中のPodをEndpointSlice(およびEndpoints)オブジェクトから削除します。これらのオブジェクトは、{{< glossary_tooltip text="selector" term_id="selector" >}}が設定された{{< glossary_tooltip term_id="service" text="Service" >}}を表します。{{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}とその他のワークロードリソースは、終了中のPodを有効なサービス中のReplicaSetとして扱いません。ゆっくりと終了するPodは、(サービスプロキシのような)ロードバランサーが終了猶予期間が*始まる*とエンドポイントからそれらのPodを削除するので、トラフィックを継続して処理できません。
1. 猶予期間が終了すると、kubeletは強制削除を開始する。コンテナランタイムは、Pod内でまだ実行中のプロセスに`SIGKILL`を送信する。kubeletは、コンテナランタイムが非表示の`pause`コンテナを使用している場合、そのコンテナをクリーンアップします。
1. kubeletは猶予期間を0(即時削除)に設定することでAPI server上のPodの削除を終了する。
1. API serverはPodのAPIオブジェクトを削除し、クライアントからは見えなくなります。


### Podの強制削除 {#pod-termination-forced}

{{< caution >}}
強制削除は、Podによっては潜在的に危険な場合があるため、慎重に実行する必要があります。
{{< /caution >}}

デフォルトでは、すべての削除は30秒以内に正常に行われます。`kubectl delete` コマンドは、ユーザーがデフォルト値を上書きして独自の値を指定できるようにする `--grace-period=<seconds>` オプションをサポートします。

`--grace-period`を`0`に設定した場合、PodはAPI serverから即座に強制的に削除されます。PodがNode上でまだ実行されている場合、その強制削除によりkubeletがトリガーされ、すぐにクリーンアップが開始されます。

{{< note >}}
強制削除を実行するために `--grace-period=0` と共に `--force` というフラグを追加で指定する必要があります。
{{< /note >}}

強制削除が実行されると、API serverは、Podが実行されていたNode上でPodが停止されたというkubeletからの確認を待ちません。API内のPodは直ちに削除されるため、新しいPodを同じ名前で作成できるようになります。Node上では、すぐに終了するように設定されるPodは、強制終了される前にわずかな猶予期間が与えられます。

{{< caution >}}
即時削除では、実行中のリソースの終了を待ちません。
リソースはクラスター上で無期限に実行し続ける可能性があります。
{{< /caution >}}

StatefulSetのPodについては、[StatefulSetからPodを削除するためのタスクのドキュメント](/ja/docs/tasks/run-application/force-delete-stateful-set-pod/)を参照してください。


### 終了したPodのガベージコレクション {#pod-garbage-collection}

失敗したPodは人間または{{< glossary_tooltip term_id="controller" text="controller" >}}が明示的に削除するまで存在します。

コントロールプレーンは終了状態のPod(SucceededまたはFailedの`phase`を持つ)の数が設定された閾値(kube-controller-manager内の`terminated-pod-gc-threshold`によって定義される)を超えたとき、それらのPodを削除します。これはPodが作成されて時間とともに終了するため、リソースリークを避けます。


## {{% heading "whatsnext" %}}


* [コンテナライフサイクルイベントへのハンドラー紐付け](/ja/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオンをやってみる

* [Liveness Probe、Readiness ProbeおよびStartup Probeを使用する](/ja/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)のハンズオンをやってみる

* [コンテナライフサイクルフック](/ja/docs/concepts/containers/container-lifecycle-hooks/)についてもっと学ぶ

* APIにおけるPodとコンテナのステータスに関する詳細情報は、Podの[`.status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus)に書かれているAPIリファレンスドキュメントを参照してください。
