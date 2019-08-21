---
title: Pod Lifecycle
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

このページでは、Podのライフサイクルについて説明します。

{{% /capture %}}


{{% capture body %}}

## Pod phase

Pod の `status` 項目は [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) オブジェクトで、それは `phase` のフィールドがあります。

Pod のフェーズは、 Pod がそのライフサイクルのどの状態にあるかを、簡単かつ高レベルにまとめたものです。
このフェーズはコンテナや Pod の状態を包括的にまとめることを目的としたものではなく、また包括的なステートマシンでもありません。

Pod の各フェーズの値と意味は厳重に守られています。
ここに記載されているもの以外に、指定された `phase` 値を持つ Pod については何も想定しないでください。

これらが `phase` の取りうる値です:

値 | 概要
:-----|:-----------
`Pending` | Pod が Kubernetes システムによって承認されましたが、1つ以上のコンテナイメージが作成されていません。これには、スケジュールされるまでの時間と、ネットワーク経由でイメージをダウンロードするための時間などが含まれます。これには時間がかかることがあります。
`Running` | Pod が Node にバインドされ、すべてのコンテナが作成されました。 少なくとも1つのコンテナがまだ実行されているか、開始または再起動中です。
`Succeeded` | Pod 内のすべてのコンテナが正常に終了し、再起動されません。
`Failed` | Pod 内のすべてのコンテナが終了し、少なくとも1つのコンテナが異常終了しました。つまり、コンテナはゼロ以外のステータスで終了したか、システムによって終了されました。
`Unknown` | 何らかの理由により、通常は Pod のホストとの通信にエラーが発生したために、 Pod の状態を取得できませんでした。

## Pod conditions

Pod には PodStatus があり、それは Pod が成功した、また成功していないしていない [PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core) の配列です。
PodCondition配列の各要素には、次の6つの可能なフィールドがあります: 

* `lastProbeTime` は、 Pod Condition が最後に確認されたときのタイムスタンプが表示されます。

* `lastTransitionTime` は、 Pod が最後に、あるステータスから別のステータスに移行したときのタイムスタンプが表示されます。

* `message` は、ステータスの遷移に関する詳細を示す人間向けのメッセージです。
  
* `reason` は、最後の状態遷移の理由を示す、一意のキャメルケースでの単語です。

* `status` は `True` と `False` 、`Unknown` のうちのどれかです。

* `type` 次の値を取る、文字列です:

  * `PodScheduled`: Pod が Node にスケジュールされました;
  * `Ready`: Pod はリクエストを処理でき、一致するすべてのサービスの負荷分散プールに追加されます;
  * `Initialized`: すべての [init containers](/docs/concepts/workloads/pods/init-containers) が正常に実行されました;
  * `Unschedulable`: リソースの枯渇やその他の理由で、Pod がスケジュールできない状態です;
  * `ContainersReady`: Pod 内のすべてのコンテナが準備できた状態です.


## Container probes

[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) は [kubelet](/docs/admin/kubelet/) により定期的に実行されるコンテナ上の診断です。
診断を行うために、 kubelet はコンテナに実装された [Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) を呼びます。
Handler には3つの種類があります:

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core):
  コンテナ内で特定のコマンドを実行します。コマンドがステータス 0 で終了した場合に診断を成功と見まします。

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core):
  コンテナの IP の特定のポートに TCP チェックを行います。
  そのポートが空いていれば診断を成功とみなします。

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core):
  コンテナの IP の特定のポートとパスに対して、 HTTP GET のリクエストを送信します。
  レスポンスのステータスコードが200以上400未満の際に診断を成功とみなします。

各 Probe は次の3つのうちの一つの結果を持ちます:

* Success: コンテナの診断が成功しました。
* Failure: コンテナの診断が失敗しました。
* Unknown: コンテナの診断が失敗し、取れるアクションがありません。

Kubelet は2種類の Probe を実行中のコンテナで行い、また反応することができます:

* `livenessProbe`: コンテナが動いているかを示します。 
   livenessProbe に失敗すると、 kubelet はコンテナを殺します、そしてコンテナは [restart policy](#restart-policy) に従います。
   コンテナに livenessProbe が設定されていない場合、デフォルトの状態は `Success` です。

* `readinessProbe`: コンテナが Service のリクエストを受けることができるかを示します。
   readinessProbe に失敗すると、エンドポイントコントローラーにより、 Pod が該当する すべてのサービスから Pod の IPアドレスが削除されます。
   initial delay 前のデフォルトの readinessProbe の初期値は `Failure` です。
   コンテナに readinessProbe が設定されていない場合、デフォルトの状態は `Success` です。

### livenessProbe と readinessProbe をいつ使うべきか?

コンテナ自体が、問題に直面したり状態が悪くなった際に、クラッシュすることができれば、
livenessProbe は不要です; この場合 kubelet が自動で Pod の `restartPolicy` に基づいたアクションを実行します。

Probe に失敗したときに、コンテナを殺したり再起動させたりするには、
livenessProbe を設定し、`restartPolicy` を Always または OnFailure にします。

Probe が成功したときにのみ Pod にトラフィックを送信したい場合は、readinessProbe を指定します。 
この場合、 readinessProbe は livenessProbeと同じになる可能性がありますが、
readinessProbe が存在するということは、 Pod がトラフィックを受けずに開始され、 Probe 成功が開始した後でトラフィックを受け始めることになります。
コンテナが起動時に大きなデータ、構成ファイル、またはマイグレーションをロードする必要がある場合は、 readinessProbe を指定します。

コンテナがメンテナンスのために停止できるようにするには、
livenessProbe とは異なる、特定のエンドポイントを確認する readinessProbe を指定することができます。

Pod が削除されたときに、リクエストを来ないようにするためには、必ずしも readinessProbe が必要というわけではありません;
削除時には、 readinessProbe が存在するかどうかに関係なく、Pod は自動的に自身を unhealthy にします。
Pod 内のコンテナが停止するのを待つ間、Pod は unhealthy のままです。

livenessProbe または readinessProbe を設定する方法の詳細については、
[Configure Liveness and Readiness Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) を参照してください

## Pod and Container status

Pod Container Status についての詳細の情報は [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) と
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core) を参照してください。
Pod ステータスとして報告される情報は、現在の [ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core) に依存しています。

## Container States

Pod がスケジューラによって Node に割り当てられると、 
kubelet はコンテナのランタイムを使用してコンテナの作成を開始します。
コンテナの状態は Waiting、 Running そして Terminated の3ついづれかです。
コンテナの状態を確認するには `kubectl describe pod [POD_NAME]` のコマンドを使用します。
Pod 内のコンテナごとに State の項目として表示されます。

* `Waiting`: コンテナのデフォルトの状態。コンテナが Running または Terminated のいずれの状態でもない場合、コンテナは Waiting の状態になります。 Waiting 状態のコンテナは、引き続きイメージを取得したり、 Secrets を適用したりするなど、必要な操作を実行します。この状態に加えて、メッセージに関する情報と状態に関する理由が表示されます。

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
   ...
   ```

* `Running`: コンテナが問題なく実行されていることを示します。コンテナが Running に入ると、 `postStart`フック（もしあれば）が実行されます。この状態には、コンテナが実行中状態に入った時刻も表示されます。
   
   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```   
       
* `Terminated`: コンテナの実行が完了し、コンテナの実行が停止したことを示します。コンテナは、実行が正常に完了したとき、または何らかの理由で失敗したときにこの状態になります。いずれにせよ、理由と終了コード、コンテナの開始時刻と終了時刻が表示されます。コンテナが Terminated に入る前に、 `preStop` フック（もしあれば）が実行されます。
  
   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ``` 

## Pod readiness gate

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

追加のフィードバックやシグナルを `PodStatus` に注入できるようにして Pod の Readiness に拡張性を持たせるため、
Kubernetes 1.11 では [Pod ready++](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md) という機能が導入されました。
`PodSpec` の新しいフィールド `ReadinessGate` を使用して、PodのRedinessを評価する追加の状態を指定できます。
KubernetesがPodのstatus.conditionsフィールドでそのような状態を発見できない場合、
ステータスはデフォルトで `False` になります。以下はその例です：

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

新しい Pod Condition は、Kubernetes の [label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) に準拠している必要があります。
`kubectl patch` コマンドはオブジェクトステータスのパッチ適用をまだサポートしていないので、
新しい Pod Condition は [KubeClient libraries](/docs/reference/using-api/client-libraries/) のどれかを使用する必要があります。

新しい Pod Condition が導入されると、 Pod は次の両方の条件に当てはまる場合**のみ**準備できていると評価されます:

* Pod内のすべてのコンテナが準備完了している。
* `ReadinessGates`で指定された条件が全て`True`である。

Pod の Readiness の評価へのこの変更を容易にするために、新しい Pod Condition  `ContainersReady` が導入され、古いPodの `Ready` 条件を取得します。

K8s 1.1では、これはAlpha機能で、"Pod Ready++" 機能は、`PodReadinessGates` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) にて明示的に指定する必要があります。

K8s 1.12では、この機能はデフォルトで有効になっています。

## Restart policy

PodSpec には、 Always 、 OnFailure 、および Never のいづれかの値を持つ `restartPolicy` フィールドがあります。
デフォルト値は Always です。 `restartPolicy` は、 Pod 内のすべてのコンテナに適用されます。
`restartPolicy` は、同じ Node 上の kubelet によるコンテナの再起動のみを参照します。
kubelet によって再起動される終了したコンテナは、5分後にキャップされた指数バックオフ遅延（10秒、20秒、40秒...）で再起動され、10分間の実行後にリセットされます。[Pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof) に書かれているように、一度ノードにバインドされると、Podは別のポートにバインドされ直すことはありません。

## Pod lifetime

一般に、 Pod は誰かが破棄するまで消えません。これは人間またはコントローラかもしれません。
このルールの唯一の例外は、一定の期間以上の（マスターで `terminated-pod-gc-threshold`によって判断される）Succeeded または Failed の `phase` を持つPodは期限切れになり、自動的に破棄されます。

次の3種類のコントローラがあります:

- バッチ計算などのように終了が予想されるPodに対しては、[Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)を使用します。
   Job は、 `restartPolicy` が OnFailure または Never になる Pod に対してのみ適切です。

- 停止することを期待しない Pod （たとえばWebサーバーなど）には、 [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/) 、 [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 、 または[Deployment](/docs/concepts/workloads/controllers/deployment/) を使用します。ReplicationController は、`restartPolicy` が Always の Pod に対してのみ適切です。

- マシン固有のシステムサービスを提供するため、マシンごとに1つずつ実行する必要がある Pod には、 [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) を使用します。

3種類のコントローラにはすべて、 PodTemplate が含まれます。
Pod を自分で直接作成するのではなく、適切なコントローラを作成して、 Pod を作成させることをおすすめします。
これは、 Pod 単独ではマシンの障害に対して回復力がないためです。コントローラにはこの機能があります。

Node が停止したり、クラスタの他の Node から切断された場合、
Kubernetes は、失われたノード上のすべての Pod の `phase` を Failed に設定するためのポリシーを適用します。

## 例

### Advanced liveness probe example

Liveness Probe は kubelet によって実行されるため、
すべてのリクエストは kubelet ネットワークネームスペースで行われます。

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
        # "host" が定義されていない場合、"PodIP" が使用されます
        # host: my-host
        # "scheme"が定義されていない場合、HTTPスキームが使用されます。 "HTTP"と"HTTPS"のみ
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

### states の例

   * Podが実行中で、その中には１つのコンテナがあります。コンテナは正常終了しました。
     * 完了のイベントを記録します。
     * `restartPolicy` が:
       * Always: コンテナを再起動します; Pod `phase` は Running のままです。
       * OnFailure: Pod `phase` は Succeeded になります。
       * Never: Pod `phase` は Succeeded になります。

   * Podが実行中で、その中には１つのコンテナがあります。コンテナは失敗終了しました。
     * 失敗イベントを記録します。
     * `restartPolicy` が:
       * Always: コンテナを再起動します; Pod `phase` は Running のままです。
       * OnFailure: コンテナを再起動します; Pod `phase` は Running のままです。
       * Never: Pod `phase` は Failed になります。

   * Podが実行中で、その中には２つのコンテナがあります。コンテナ 1 は失敗終了しました。
     * 失敗イベントを記録します。

     * `restartPolicy` が:
     * If `restartPolicy` is:
       * Always: コンテナを再起動します; Pod `phase` は Running のままです。
       * OnFailure: コンテナを再起動します; Pod `phase` は Running のままです。
       * Never: コンテナを再起動しません; Pod `phase` は Running のままです。
     * If Container 1 is not running, and Container 2 exits:
       * 失敗イベントを記録します。
       * `restartPolicy` が:
       * If `restartPolicy` is:
         * Always: コンテナを再起動します; Pod `phase` は Running のままです。
         * OnFailure: コンテナを再起動します; Pod `phase` は Running のままです。
         * Never: Pod `phase` は Failed になります。


   * Pod が実行中で、その中には１つのコンテナがあります。コンテナはメモリーを使い果たしました。
     * コンテナは失敗で終了します。
     * OOM イベントを記録します。
     * `restartPolicy` が:
       * Always: コンテナを再起動します; Pod `phase` は Running のままです。
       * OnFailure: コンテナを再起動します; Pod `phase` は Running のままです。
       * Never: 失敗イベントを記録します。; * Never: Pod `phase` は Failed になります。

   * Pod が実行中ですが、ディスクは死んでいます。
     * すべてのコンテンを殺します。
     * 適切なイベントを記録します。
     * Pod `phase` は Failed になります。
     * Pod がコントローラで作成されていた場合は、別の場所で再作成されます。

   * Pod が実行中ですが、そしてNodeが切り離されました。
     * Nodeコントローラがタイムアウトを待ちます。
     * Node controller が Pod `phase` を Failed にします。
     * Pod がコントローラで作成されていた場合は、別の場所で再作成されます。

{{% /capture %}}


{{% capture whatsnext %}}

* ハンズオンをやってみる
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。

* ハンズオンをやってみる
  [configuring liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)。

* [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/) について更に学ぶ。

{{% /capture %}}
