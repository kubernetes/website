---
title: Podのライフサイクル
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

このページではPodのライフサイクルについて説明します。

{{% /capture %}}


{{% capture body %}}

## PodのPhase

Podの`status`項目は[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)オブジェクトで、それは`phase`のフィールドがあります。

Podのフェーズは、そのPodがライフサイクルのどの状態にあるかを、簡単かつ高レベルにまとめたものです。
このフェーズはコンテナやPodの状態を包括的にまとめることを目的としたものではなく、また包括的なステートマシンでもありません。

Podの各フェーズの値と意味は厳重に守られています。
ここに記載されているもの以外に`phase`の値は存在しないと思ってください。

これらが`phase`の取りうる値です。

値 | 概要
:-----|:-----------
`Pending` | PodがKubernetesシステムによって承認されましたが、1つ以上のコンテナイメージが作成されていません。これには、スケジュールされるまでの時間と、ネットワーク経由でイメージをダウンロードするための時間などが含まれます。これには時間がかかることがあります。
`Running` | PodがNodeにバインドされ、すべてのコンテナが作成されました。少なくとも1つのコンテナがまだ実行されているか、開始または再起動中です。
`Succeeded` |Pod内のすべてのコンテナが正常に終了し、再起動されません。
`Failed` | Pod内のすべてのコンテナが終了し、少なくとも1つのコンテナが異常終了しました。つまり、コンテナはゼロ以外のステータスで終了したか、システムによって終了されました。
`Unknown` | 何らかの理由により、通常はPodのホストとの通信にエラーが発生したために、Podの状態を取得できませんでした。

## Podのconditions

PodにはPodStatusがあります。それはPodが成功したかどうかの情報を持つ[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)の配列です。
PodCondition配列の各要素には、次の6つのフィールドがあります。

* `lastProbeTime` は、Pod Conditionが最後に確認されたときのタイムスタンプが表示されます。

* `lastTransitionTime` は、最後にPodのステータスの遷移があった際のタイムスタンプが表示されます。

* `message` は、ステータスの遷移に関する詳細を示す人間向けのメッセージです。
  
* `reason` は、最後の状態遷移の理由を示す、一意のキャメルケースでの単語です。

* `status` は`True`と`False`、`Unknown`のうちのどれかです。

* `type` 次の値を取る文字列です。

  * `PodScheduled`: PodがNodeにスケジュールされました。
  * `Ready`: Podはリクエストを処理でき、一致するすべてのサービスの負荷分散プールに追加されます。
  * `Initialized`: すべての[init containers](/docs/concepts/workloads/pods/init-containers)が正常に実行されました。
  * `Unschedulable`: リソースの枯渇やその他の理由で、Podがスケジュールできない状態です。
  * `ContainersReady`: Pod内のすべてのコンテナが準備できた状態です。


## コンテナのProbe

[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) は [kubelet](/docs/admin/kubelet/) により定期的に実行されるコンテナの診断です。
診断を行うために、kubeletはコンテナに実装された [ハンドラー](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler)を呼びます。
Handlerには次の3つの種類があります:

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core):
  コンテナ内で特定のコマンドを実行します。コマンドがステータス0で終了した場合に診断を成功と見まします。

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core):
  コンテナのIPの特定のポートにTCPチェックを行います。
  そのポートが空いていれば診断を成功とみなします。

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core):
  コンテナのIPの特定のポートとパスに対して、HTTP GETのリクエストを送信します。
  レスポンスのステータスコードが200以上400未満の際に診断を成功とみなします。

各Probe 次の3つのうちの一つの結果を持ちます:

* Success: コンテナの診断が成功しました。
* Failure: コンテナの診断が失敗しました。
* Unknown: コンテナの診断が失敗し、取れるアクションがありません。

Kubeletは2種類のProbeを実行中のコンテナで行い、また反応することができます:

* `livenessProbe`: コンテナが動いているかを示します。
   livenessProbe に失敗すると、kubeletはコンテナを殺します、そしてコンテナは[restart policy](#restart-policy)に従います。
   コンテナにlivenessProbeが設定されていない場合、デフォルトの状態は`Success`です。

* `readinessProbe`: コンテナがServiceのリクエストを受けることができるかを示します。
   readinessProbeに失敗すると、エンドポイントコントローラーにより、ServiceからそのPodのIPアドレスが削除されます。
   initial delay前のデフォルトのreadinessProbeの初期値は`Failure`です。
   コンテナにreadinessProbeが設定されていない場合、デフォルトの状態は`Success`です。

### livenessProbeとreadinessProbeをいつ使うべきか?

コンテナ自体に問題が発生した場合や状態が悪くなった際にクラッシュすることができれば
livenessProbeは不要です。この場合kubeletが自動でPodの`restartPolicy`に基づいたアクションを実行します。

Probeに失敗したときにコンテナを殺したり再起動させたりするには、
livenessProbeを設定し`restartPolicy`をAlwaysまたはOnFailureにします。

Probeが成功したときにのみPodにトラフィックを送信したい場合は、readinessProbeを指定します。
この場合readinessProbeはlivenessProbeと同じになる可能性がありますが、
readinessProbeが存在するということは、Podがトラフィックを受けずに開始され、Probe成功が開始した後でトラフィックを受け始めることになります。
コンテナが起動時に大きなデータ、構成ファイル、またはマイグレーションを読み込む必要がある場合は、readinessProbeを指定します。

コンテナがメンテナンスのために停止できるようにするには、
livenessProbeとは異なる、特定のエンドポイントを確認するreadinessProbeを指定することができます。

Podが削除されたときにリクエストを来ないようにするためには必ずしもreadinessProbeが必要というわけではありません。
Podの削除時にはreadinessProbeが存在するかどうかに関係なくPodは自動的に自身をunhealthyにします。
Pod内のコンテナが停止するのを待つ間Podはunhealthyのままです。

livenessProbeまたはreadinessProbeを設定する方法の詳細については、
[Configure Liveness and Readiness Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)を参照してください

## Podとコンテナのステータス

PodとContainerのステータスについての詳細の情報は、それぞれ[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)と
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core)を参照してください。
Podのステータスとして報告される情報は、現在の[ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core)に依存しています。

## コンテナのステータス

PodがスケジューラによってNodeに割り当てられると、
kubeletはコンテナのランタイムを使用してコンテナの作成を開始します。
コンテナの状態はWaiting、RunningまたはTerminatedの3ついずれかです。
コンテナの状態を確認するには`kubectl describe pod [POD_NAME]`のコマンドを使用します。
Pod内のコンテナごとにStateの項目として表示されます。

* `Waiting`: コンテナのデフォルトの状態。コンテナがRunningまたはTerminatedのいずれの状態でもない場合コンテナはWaitingの状態になります。Waiting状態のコンテナは引き続きイメージを取得したりSecretsを適用したりするなど必要な操作を実行します。この状態に加えてメッセージに関する情報と状態に関する理由が表示されます。

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
   ...
   ```

* `Running`: コンテナが問題なく実行されていることを示します。コンテナがRunningに入ると`postStart`フック（もしあれば）が実行されます。この状態にはコンテナが実行中状態に入った時刻も表示されます。
   
   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```   
       
* `Terminated`: コンテナの実行が完了しコンテナの実行が停止したことを示します。コンテナは実行が正常に完了したときまたは何らかの理由で失敗したときにこの状態になります。いずれにせよ理由と終了コード、コンテナの開始時刻と終了時刻が表示されます。コンテナがTerminatedに入る前に`preStop`フックがあればあれば実行されます。
  
   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ``` 

## PodReadinessGate

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

追加のフィードバックやシグナルを`PodStatus`に注入できるようにしてPodのReadinessに拡張性を持たせるため、
Kubernetes 1.11 では[Pod ready++](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md)という機能が導入されました。
`PodSpec`の新しいフィールド`ReadinessGate`を使用して、PodのRedinessを評価する追加の状態を指定できます。
KubernetesがPodのstatus.conditionsフィールドでそのような状態を発見できない場合、
ステータスはデフォルトで`False`になります。以下はその例です。

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

新しいPod Conditionは、Kubernetesの[label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)に準拠している必要があります。
`kubectl patch`コマンドはオブジェクトステータスのパッチ適用をまだサポートしていないので、
新しいPod Conditionは[KubeClient libraries](/docs/reference/using-api/client-libraries/)のどれかを使用する必要があります。

新しいPod Conditionが導入されるとPodは次の両方の条件に当てはまる場合**のみ**準備できていると評価されます:

* Pod内のすべてのコンテナが準備完了している。
* `ReadinessGates`で指定された条件が全て`True`である。

PodのReadinessの評価へのこの変更を容易にするために、新しいPod Conditionである`ContainersReady`が導入され、古いPodの`Ready`条件を取得します。

K8s 1.1ではAlpha機能のため"Pod Ready++" 機能は`PodReadinessGates` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)にて明示的に指定する必要があります。

K8s 1.12ではこの機能はデフォルトで有効になっています。

## RestartPolicy

PodSpecには、Always、OnFailure、またはNeverのいずれかの値を持つ`restartPolicy`フィールドがあります。
デフォルト値はAlwaysです。`restartPolicy`は、Pod内のすべてのコンテナに適用されます。
`restartPolicy`は、同じNode上のkubeletによるコンテナの再起動のみを参照します。
kubeletによって再起動される終了したコンテナは、5分後にキャップされた指数バックオフ遅延（10秒、20秒、40秒...）で再起動され、10分間の実行後にリセットされます。[Pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof)に書かれているように、一度NodeにバインドされるとPodは別のポートにバインドされ直すことはありません。

## Podのライフタイム

一般にPodは誰かが破棄するまで消えません。これは人間またはコントローラかもしれません。
このルールの唯一の例外は、一定の期間以上の（マスターで`terminated-pod-gc-threshold`によって判断される）SucceededまたはFailedの`phase`を持つPodは期限切れになり自動的に破棄されます。

次の3種類のコントローラがあります。

- バッチ計算などのように終了が予想されるPodに対しては、[Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)を使用します。
   Jobは`restartPolicy`がOnFailureまたはNeverになるPodに対してのみ適切です。

- 停止することを期待しないPod（たとえばWebサーバーなど）には、[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)、[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)、または[Deployment](/docs/concepts/workloads/controllers/deployment/)を使用します。ReplicationControllerは`restartPolicy`がAlwaysのPodに対してのみ適切です。

- マシン固有のシステムサービスを提供するため、マシンごとに1つずつ実行する必要があるPodには[DaemonSet](/docs/concepts/workloads/controllers/daemonset/)を使用します。

3種類のコントローラにはすべてPodTemplateが含まれます。
Podを自分で直接作成するのではなく適切なコントローラを作成してPodを作成させることをおすすめします。
これはPod単独ではマシンの障害に対して回復力がないためです。コントローラにはこの機能があります。

Nodeが停止したりクラスタの他のNodeから切断された場合、
Kubernetesは失われたノード上のすべてのPodの`phase`をFailedに設定するためのポリシーを適用します。

## 例

### 高度なliveness probeの例

Liveness Probeはkubeletによって実行されるため、
すべてのリクエストはkubeletネットワークのnamespaceで行われます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - /server
    image: k8s.gcr.io/liveness
    livenessProbe:
      httpGet:
        # "host" が定義されていない場合、"PodIP"が使用されます
        # host: my-host
        # "scheme"が定義されていない場合、HTTPスキームが使用されます。"HTTP"と"HTTPS"のみ
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

### statesの例

   * Podが実行中でそのPodには1つのコンテナがあります。コンテナは正常終了しました。
     * 完了のイベントを記録します。
     * `restartPolicy`が、
       * Always: コンテナを再起動します。Podの`phase`はRunningのままです。
       * OnFailure: Podの`phase`はSucceededになります。
       * Never: Podの`phase`はSucceededになります。

   * Podが実行中でそのPodには1つのコンテナがあります。コンテナは失敗終了しました。
     * 失敗イベントを記録します。
     * `restartPolicy`が、
       * Always: コンテナを再起動します。Podの`phase`はRunningのままです。
       * OnFailure: コンテナを再起動します。Podの`phase`はRunningのままです。
       * Never: Podの`phase`はFailedになります。

   * Podが実行中で、その中には2つのコンテナがあります。コンテナ1は失敗終了しました。
     * 失敗イベントを記録します。
     * `restartPolicy`が、
       * Always: コンテナを再起動します。Podの`phase`はunningのままです。
       * OnFailure: コンテナを再起動します。Podの`phase`はRunningのままです。
       * Never: コンテナを再起動しません。Podの`phase`はRunningのままです。
     * コンテナ1が死んでいてコンテナ2は動いている場合
       * 失敗イベントを記録します。
       * `restartPolicy`が、
         * Always: コンテナを再起動します。Podの`phase`はRunningのままです。
         * OnFailure: コンテナを再起動します。Podの`phase`はRunningのままです。
         * Never: Podの`phase`はFailedになります。

   * Podが実行中でそのPodには1つのコンテナがあります。コンテナはメモリーを使い果たしました。
     * コンテナは失敗で終了します。
     * OOMイベントを記録します。
     * `restartPolicy`が、
       * Always: コンテナを再起動します。Podの`phase`はRunningのままです。
       * OnFailure: コンテナを再起動します。Podの`phase`はRunningのままです。
       * Never: 失敗イベントを記録します。Podの`phase`はFailedになります。

   * Podが実行中ですがディスクは死んでいます。
     * すべてのコンテンを殺します。
     * 適切なイベントを記録します。
     * Podの`phase`はFailedになります。
     * Podがコントローラで作成されていた場合は、別の場所で再作成されます。

   * Podが実行中ですがNodeが切り離されました。
     * Nodeコントローラがタイムアウトを待ちます。
     * NodeコントローラがPodの`phase`をFailedにします。
     * Podがコントローラで作成されていた場合は、別の場所で再作成されます。

{{% /capture %}}


{{% capture whatsnext %}}

* [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオンをやってみる

* [configuring liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)のハンズオンをやってみる

* [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/)についてもっと学ぶ

{{% /capture %}}
