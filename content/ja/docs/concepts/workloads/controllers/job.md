---
title: Job
content_type: concept
feature:
  title: バッチ実行
  description: >
    サービスだけでなく、KubernetesはバッチとCIワークロードの管理機能も提供し、必要に応じて障害が発生したコンテナを置き換えることもできます。
weight: 50
---

<!-- overview -->

Jobは一つ以上のPodを作成し、指定された数のPodが正常に終了するまで、Podの実行を再試行し続けます。Podが正常に終了すると、Jobは成功したPodの数を追跡します。指定された完了数に達すると、そのタスク(つまりJob)は完了したとみなされます。Jobを削除すると、作成されたPodも一緒に削除されます。Jobを一時停止すると、再開されるまで、稼働しているPodは全部削除されます。

単純なケースを言うと、確実に一つのPodが正常に完了するまで実行されるよう、一つのJobオブジェクトを作成します。
一つ目のPodに障害が発生したり、(例えばノードのハードウェア障害またノードの再起動が原因で)削除されたりすると、Jobオブジェクトは新しいPodを作成します。

Jobで複数のPodを並列で実行することもできます。

スケジュールに沿ってJob(単一のタスクか複数タスク並列のいずれか)を実行したい場合は [CronJob](/ja/docs/concepts/workloads/controllers/cron-jobs/)を参照してください。

<!-- body -->

## 実行例  {#running-an-example-job}

下記にJobの定義例を記載しています。πを2000桁まで計算して出力するJobで、完了するまで約10秒かかります。

{{% codenew file="controllers/job.yaml" %}}

このコマンドで実行できます:

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

実行結果はこのようになります:

```
job.batch/pi created
```

`kubectl`でJobの状態を確認できます:

{{< tabs name="Check status of Job" >}}
{{< tab name="kubectl describe job pi" codelang="bash" >}}
Name:           pi
Namespace:      default
Selector:       batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                batch.kubernetes.io/job-name=pi
                ...
Annotations:    batch.kubernetes.io/job-tracking: ""
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           batch.kubernetes.io/job-name=pi
  Containers:
   pi:
    Image:      perl:5.34.0
    Port:       <none>
    Host Port:  <none>
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  21s   job-controller  Created pod: pi-xf9p4
  Normal  Completed         18s   job-controller  Job completed
{{< /tab >}}
{{< tab name="kubectl get job pi -o yaml" codelang="bash" >}}
apiVersion: batch/v1
kind: Job
metadata:
  annotations: batch.kubernetes.io/job-tracking: ""
             ...
  creationTimestamp: "2022-11-10T17:53:53Z"
  generation: 1
  labels:
    batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
    batch.kubernetes.io/job-name: pi
  name: pi
  namespace: default
  resourceVersion: "4751"
  uid: 204fb678-040b-497f-9266-35ffa8716d14
spec:
  backoffLimit: 4
  completionMode: NonIndexed
  completions: 1
  parallelism: 1
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
  suspend: false
  template:
    metadata:
      creationTimestamp: null
      labels:
        batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
        batch.kubernetes.io/job-name: pi
    spec:
      containers:
      - command:
        - perl
        - -Mbignum=bpi
        - -wle
        - print bpi(2000)
        image: perl:5.34.0
        imagePullPolicy: IfNotPresent
        name: pi
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Never
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
status:
  active: 1
  ready: 0
  startTime: "2022-11-10T17:53:57Z"
  uncountedTerminatedPods: {}
{{< /tab >}}
{{< /tabs >}}

Jobの完了したPodを確認するには、`kubectl get pods`を使います。

Jobに属するPodの一覧を機械可読形式で出力するには、下記のコマンドを使います:

```shell
pods=$(kubectl get pods --selector=batch.kubernetes.io/job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

出力結果はこのようになります:

```
pi-5rwd7
```

ここのセレクターはJobのセレクターと同じです。`--output=jsonpath`オプションは、返されたリストからPodのnameフィールドを指定するための表現です。

その中の一つのPodの標準出力を確認するには:

```shell
kubectl logs $pods
```

Jobの標準出力を確認するもう一つの方法は:

```shell
kubectl logs jobs/pi
```

出力結果はこのようになります:

```
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

## Job spec(仕様)の書き方  {#writing-a-job-spec}

他のKubernetesオブジェクト設定ファイルと同様に、Jobにも`apiVersion`、`kind`または`metadata`フィールドが必要です。

コントロールプレーンがJobのために新しいPodを作成するとき、Jobの`.metadata.name`はそれらのPodに名前をつけるための基礎の一部になります。Jobの名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要がありますが、これはPodのホスト名に予期しない結果をもたらす可能性があります。最高の互換性を得るためには、名前は[DNSラベル](/ja/docs/concepts/overview/working-with-objects/names/#dns-label-names)のより限定的な規則に従うべきです。名前がDNSサブドメインの場合でも、名前は63文字以下でなければなりません。

Jobには[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

### Jobラベル
Jobラベルの`job-name`と`controller-uid`の接頭辞は`batch.kubernetes.io/`となります。

### Podテンプレート  {#pod-template}

`.spec.template`は`.spec`の唯一の必須フィールドです。

`.spec.template`は[podテンプレート](/ja/docs/concepts/workloads/pods/#pod-templates)です。ネストされていることと`apiVersion`や`kind`フィールドが不要になったことを除いて、仕様の定義が{{< glossary_tooltip text="Pod" term_id="pod" >}}と全く同じです。

Podの必須フィールドに加えて、Job定義ファイルにあるPodテンプレートでは、適切なラベル([podセレクター](#pod-selector)を参照)と適切な再起動ポリシーを指定する必要があります。

[`RestartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)は`Never`か`OnFailure`のみ設定可能です。

### Podセレクター  {#pod-selector}

`.spec.selector`フィールドはオプションです。ほとんどの場合はむしろ指定しないほうがよいです。
[独自のPodセレクターを指定](#specifying-your-own-pod-selector)セクションを参照してください。

### Jobの並列実行  {#parallel-jobs}

Jobで実行するのに適したタスクは主に3種類あります:

1. 非並列Job
   - 通常、Podに障害が発生しない限り、一つのPodのみが起動されます。
   - Podが正常に終了すると、Jobはすぐに完了します。
2. *固定の完了数*を持つ並列Job:
   - `.spec.completions`に0以外の正の値を指定します。
   - Jobは全体的なタスクを表し、`.spec.completions`個のPodが成功すると、Jobの完了となります。
   - `.spec.completionMode="Indexed"`を利用する場合、各Podは0から`.spec.completions-1`までの範囲内のインデックスがアサインされます。
3. *ワークキュー*を利用した並列Job:
   - `.spec.completions`の指定をしない場合、デフォルトは`.spec.parallelism`となります。
   - Pod間で調整する、または外部サービスを使う方法で、それぞれ何のタスクに着手するかを決めます。例えば、一つのPodはワークキューから最大N個のタスクを一括で取得できます。
   - 各Podは他のPodがすべて終了したかどうか、つまりJobが完了したかどうかを単独で判断できます。
   - Jobに属する _任意_ のPodが正常に終了すると、新しいPodは作成されません。
   - 一つ以上のPodが正常に終了し、すべてのPodが終了すると、Jobは正常に完了します。
   - 一つのPodが正常に終了すると、他のPodは同じタスクの作業を行ったり、出力を書き込んだりすることはできません。すべてのPodが終了プロセスに進む必要があります。

 _非並列_ Jobの場合、`.spec.completions`と`.spec.parallelism`の両方を未設定のままにしておくことも可能です。未設定の場合、両方がデフォルトで1になります。

 _完了数固定_ Jobの場合、`.spec.completions`を必要完了数に設定する必要があります。
`.spec.parallelism`を設定してもいいですし、未設定の場合、デフォルトで1になります。

 _ワークキュー_ 並列Jobの場合、`.spec.completions`を未設定のままにし、`.spec.parallelism`を非負の整数に設定する必要があります。

各種類のJobの使用方法の詳細については、[Jobパターン](#job-patterns)セクションを参照してください。

#### 並列処理の制御  {#controlling-parallelism}

必要並列数(`.spec.parallelism`)は任意の非負の値に設定できます。
未設定の場合は、デフォルトで1になります。
0に設定した際には、増加するまでJobは一時停止されます。

実際の並列数(任意の瞬間に実行されているPod数)は、さまざまな理由により、必要並列数と異なる可能性があります:

-  _完了数固定_ Jobの場合、実際に並列して実行されるPodの数は、残りの完了数を超えることはありません。 `.spec.parallelism`の値が高い場合は無視されます。
-  _ワークキュー_ Jobの場合、任意のPodが成功すると、新しいPodは作成されません。ただし、残りのPodは終了まで実行し続けられます。
- Job{{< glossary_tooltip text="コントローラー" term_id="controller" >}}の応答する時間がなかった場合。
- Jobコントローラーが何らかの理由で(`ResourceQuota`の不足、権限の不足など)、Podを作成できない場合、
  実際の並列数は必要並列数より少なくなる可能性があります。
- 同じJobで過去に発生した過度のPod障害が原因で、Jobコントローラーは新しいPodの作成を抑制することがあります。
- Podがグレースフルシャットダウンされた場合、停止するのに時間がかかります。

### 完了モード  {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

 _完了数固定_ Job、つまり`.spec.completions`の値がnullではないJobは`.spec.completionMode`で完了モードを指定できます:

- `NonIndexed`(デフォルト): `.spec.completions`個のPodが成功した場合、Jobの完了となります。言い換えれば、各Podの完了状態は同質です。ここで要注意なのは、`.spec.completions`の値がnullの場合、暗黙的に`NonIndexed`として指定されることです。
- `Indexed`: Jobに属するPodはそれぞれ、0から`.spec.completions-1`の範囲内の完了インデックスを取得できます。インデックスは下記の三つの方法で取得できます。
  - Podアノテーション`batch.kubernetes.io/job-completion-index`。
  - Podホスト名の一部として、`$(job-name)-$(index)`の形式になっています。
    インデックス付きJob(Indexed Job)と{{< glossary_tooltip term_id="Service" >}}を一緒に使用すると、Jobに属するPodはお互いにDNSを介して確定的ホスト名で通信できます。この設定方法の詳細は[Pod間通信を使用したJob](https://kubernetes.io/docs/tasks/job/job-with-pod-to-pod-communication/)を参照してください。　
  - コンテナ化されたタスクの環境変数`JOB_COMPLETION_INDEX`。

  各インデックスに1つずつ正常に完了したPodがあると、Jobは完了したとみなされます。このモードの使い方については、[静的な処理の割り当てを使用した並列処理のためのインデックス付きJob](/ja/docs/tasks/job/indexed-parallel-processing-static/)を参照してください。

{{< note >}}
めったに発生しませんが、同じインデックスに対して複数のPodが起動することがあります。(Nodeの障害、kubeletの再起動、Podの立ち退きなど)。この場合、正常に完了した最初のPodだけ完了数にカウントされ、Jobのステータスが更新されます。同じインデックスに対して実行中または完了した他のPodは、検出されるとJobコントローラーによって削除されます。
{{< /note >}}

## Podとコンテナの障害対策  {#handling-pod-and-container-failures}

Pod内のコンテナは、その中のプロセスが0以外の終了コードで終了した、またはメモリ制限を超えたためにコンテナが強制終了されたなど、様々な理由で失敗することがあります。この場合、もし`.spec.template.spec.restartPolicy = "OnFailure"`と設定すると、Podはノード上に残りますが、コンテナは再実行されます。そのため、プログラムがローカルで再起動した場合の処理を行うか、`.spec.template.spec.restartPolicy = "Never"`と指定する必要があります。
`restartPolicy`の詳細については[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)を参照してください。

Podがノードからキックされた(ノードがアップグレード、再起動、削除されたなど)、または`.spec.template.spec.restartPolicy = "Never"`と設定されたときにPodに属するコンテナが失敗したなど、様々な理由でPod全体が故障することもあります。Podに障害が発生すると、Jobコントローラーは新しいPodを起動します。つまりアプリケーションは新しいPodで再起動された場合の処理を行う必要があります。特に、過去に実行した際に生じた一時ファイル、ロック、不完全な出力などを処理する必要があります。

デフォルトでは、それぞれのPodの失敗は`.spec.backoffLimit`にカウントされます。詳しくは[Pod失敗のバックオフポリシー](#pod-backoff-failure-policy)をご覧ください。しかし、[JobのPod失敗ポリシー](#pod-failure-policy)を設定することで、Pod失敗の処理をカスタマイズすることができます。

`.spec.parallelism = 1`、`.spec.completions = 1`と`.spec.template.spec.restartPolicy = "Never"`を指定しても、同じプログラムが2回起動されることもありますので注意してください。

`.spec.parallelism`と`.spec.completions`を両方とも2以上指定した場合、複数のPodが同時に実行される可能性があります。そのため、Podは並行処理を行えるようにする必要があります。

[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)の`PodDisruptionConditions`と`JobPodFailurePolicy`の両方が有効で、`.spec.podFailurePolicy`フィールドが設定されている場合、Jobコントローラーは終了するPod(`.metadata.deletionTimestamp`フィールドが設定されているPod)を、そのPodが終了する(`.status.phase`が`Failed`または`Succeeded`になる)までは失敗とはみなしません。ただし、Jobコントローラーは、終了が明らかになるとすみやかに代わりのPodを作成します。Podが終了すると、Jobコントローラーはこの終了したPodを考慮に入れて、該当のJobの`.backoffLimit`と`.podFailurePolicy`を評価します。

これらの要件のいずれかが満たされていない場合、Jobコントローラーは、そのPodが後に`phase: "Succeeded"`で終了する場合でも、終了するPodを即時に失敗として数えます。

### Pod失敗のバックオフポリシー  {#pod-backoff-failure-policy}

設定の論理エラーなどにより、Jobが数回再試行した後に失敗状態にしたい場合があります。`.spec.backoffLimit`を設定すると、失敗したと判断するまでの再試行回数を指定できます。バックオフ制限はデフォルトで6に設定されています。Jobに属していて失敗したPodはJobコントローラーにより再作成され、バックオフ遅延は指数関数的に増加し(10秒、20秒、40秒…)、最大6分まで増加します。

再実行回数の算出方法は以下の2通りです:
- `.status.phase = "Failed"`で設定されたPod数を計算します。
- `restartPolicy = "OnFailure"`と設定された場合、`.status.phase`が`Pending`または`Running`であるPodに属するすべてのコンテナで再試行する回数を計算します。

どちらかの計算が`.spec.backoffLimit`に達した場合、Jobは失敗とみなされます。

[`JobTrackingWithFinalizers`](#job-tracking-with-finalizers)機能が無効な場合、
失敗したPodの数は、API内にまだ存在するPodのみに基づいています。

{{< note >}}
`restartPolicy = "OnFailure"`が設定されたJobはバックオフ制限に達すると、属するPodは全部終了されるので注意してください。これにより、Jobの実行ファイルのデバッグ作業が難しくなる可能性があります。失敗したJobからの出力が不用意に失われないように、Jobのデバッグ作業をする際は`restartPolicy = "Never"`を設定するか、ロギングシステムを使用することをお勧めします。
{{< /note >}}

## Pod失敗ポリシー {#pod-failure-policy}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

{{< note >}}
クラスターで`JobPodFailurePolicy`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっている場合のみ、Jobに対してPod失敗ポリシーを設定することができます。さらにPod失敗ポリシーでPodの中断条件を検知して処理できるように、`PodDisruptionConditions`フィーチャーゲートを有効にすることが推奨されます。([Podの中断条件](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)を参照してください)。どちらのフィーチャーゲートもKubernetes 1.27で利用可能です。
{{< /note >}}

`.spec.podFailurePolicy`フィールドで定義されるPod失敗ポリシーを使用すると、コンテナの終了コードとPodの条件に基づいてクラスターがPodの失敗を処理できるようになります。

状況によっては、Podの失敗を処理するときに、Jobの`.spec.backoffLimit`に基づいた[Pod失敗のバックオフポリシー](#pod-backoff-failure-policy)が提供する制御よりも、Podの失敗処理に対してより良い制御を求めるかもしれません。これらはいくつかの使用例です:

  - 不要なPodの再起動を回避してワークロードの実行コストを最適化するために、Podの1つがソフトウェアバグを示す終了コードで失敗するとすぐにJobを終了させることができます。
  - 中断が発生してもJobが完了するように、中断によって発生したPodの失敗({{< glossary_tooltip text="preemption" term_id="preemption" >}}、{{< glossary_tooltip text="APIを起点とした退避" term_id="api-eviction" >}}、{{< glossary_tooltip text="taint" term_id="taint" >}}を起点とした立ち退き)を無視し、`.spec.backoffLimit`のリトライ回数にカウントしないようにすることができます。

上記のユースケースを満たすために、`.spec.podFailurePolicy`フィールドでPod失敗ポリシーを設定できます。このポリシーは、コンテナの終了コードとPodの条件に基づいてPodの失敗を処理できます。

以下は、`podFailurePolicy`を定義するJobのマニフェストです:

{{% codenew file="controllers/job-pod-failure-policy-example.yaml" %}}

上記の例では、Pod失敗ポリシーの最初のルールは、`main`コンテナが42の終了コードで失敗した場合、そのJobを失敗とマークすることを指定しています。以下は特に `main`コンテナに関するルールです:

  - 終了コード0はコンテナが成功したことを意味します。
  - 終了コード42は**Job全体**が失敗したことを意味します。
  - それ以外の終了コードは、コンテナが失敗したこと、つまりPod全体が失敗したことを示します。再起動の合計回数が`backoffLimit`未満であれば、Podは再作成されます。`backoffLimit`に達した場合、**Job全体**が失敗したことになります。

{{< note >}}
Podテンプレートは`restartPolicy.Never`を指定しているため、kubeletはその特定のPodの`main`コンテナを再起動しません。
{{< /note >}}

Pod失敗ポリシーの2つ目のルールでは、`DisruptionTarget`という条件で失敗したPodに対してIgnoreアクションを指定することで、Podの中断が`.spec.backoffLimit`によるリトライの制限にカウントされないようにします。

{{< note >}}
Pod失敗ポリシーまたはPod失敗のバックオフポリシーのいずれかによってJobが失敗し、そのJobが複数のPodを実行している場合、KubernetesはそのJob内の保留中または実行中のすべてのPodを終了します。
{{< /note >}}

これらはAPIの要件と機能です:
  - `.spec.podFailurePolicy`フィールドをJobに使いたい場合は、`.spec.restartPolicy`を`Never`に設定してそのJobのPodテンプレートも定義する必要があります。
  - `spec.podFailurePolicy.rules`で指定したPod失敗ポリシーのルールが順番に評価されます。あるPodの失敗がルールに一致すると、残りのルールは無視されます。Pod失敗に一致するルールがない場合は、デフォルトの処理が適用されます。
  - `spec.podFailurePolicy.rules[*].onExitCodes.containerName`を指定することで、ルールを特定のコンテナに制限することができます。指定しない場合、ルールはすべてのコンテナに適用されます。指定する場合は、Pod テンプレート内のコンテナ名または`initContainer`名のいずれかに一致する必要があります。
  - Pod失敗ポリシーが`spec.podFailurePolicy.rules[*].action`にマッチしたときに実行されるアクションを指定できます。指定可能な値は以下のとおりです。
    - `FailJob`: PodのJobを`Failed`としてマークし、実行中の Pod をすべて終了させる必要があることを示します。
    - `Ignore`: `.spec.backoffLimit`のカウンターは加算されず、代替のPodが作成すべきであることを示します。
    - `Count`: Podがデフォルトの方法で処理されるべきであることを示します。`.spec.backoffLimit`のカウンターが加算されます。

{{< note >}}
`PodFailurePolicy`を使用すると、Jobコントローラーは`Failed`フェーズのPodのみにマッチします。削除タイムスタンプを持つPodで、終了フェーズ(`Failed`または`Succeeded`)にないものは、まだ終了中と見なされます。これは、終了中Podは終了フェーズに達するまで[追跡ファイナライザー](#job-tracking-with-finalizers)を保持することを意味します。Kubernetes 1.27以降、Kubeletは削除されたPodを終了フェーズに遷移させます(参照:[Podのフェーズ](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase))。これにより、削除されたPodはJobコントローラーによってファイナライザーが削除されます。
{{< /note >}}

## Jobの終了とクリーンアップ  {#job-termination-and-cleanup}

Jobが完了すると、それ以上Podは作成されませんが、[通常](#pod-backoff-failure-policy)Podが削除されることもありません。
これらを残しておくと、完了したPodのログを確認でき、エラーや警告などの診断出力を確認できます。
またJobオブジェクトはJob完了後も残っているため、状態を確認することができます。古いJobの状態を把握した上で、削除するかどうかはユーザー次第です。Jobを削除するには`kubectl` (例:`kubectl delete jobs/pi`または`kubectl delete -f ./job.yaml`)を使います。`kubectl`でJobを削除する場合、Jobが作成したPodも全部削除されます。

デフォルトでは、Podが失敗しない(`restartPolicy=Never`)またはコンテナがエラーで終了しない(`restartPolicy=OnFailure`)限り、Jobは中断されることなく実行されます。`.spec.backoffLimit`に達するとそのJobは失敗と見なされ、実行中のPodはすべて終了します。

Jobを終了させるもう一つの方法は、活動期間を設定することです。
Jobの`.spec.activeDeadlineSeconds`フィールドに秒数を設定することで、活動期間を設定できます。
Podがいくつ作成されても、`activeDeadlineSeconds`はJobの存続する時間に適用されます。
Jobが`activeDeadlineSeconds`に達すると、実行中のすべてのPodは終了され、Jobの状態は`type: Failed`になり、理由は`reason: DeadlineExceeded`になります。

ここで要注意なのは、Jobの`.spec.activeDeadlineSeconds`は`.spec.backoffLimit`よりも優先されます。したがって、失敗して再試行しているPodが一つ以上持っているJobは、`backoffLimit`に達していなくても、`activeDeadlineSeconds`で指定された設定時間に達すると、追加のPodをデプロイしなくなります。

例えば:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job仕様と、Jobに属する[Podテンプレートの仕様](/ja/docs/concepts/workloads/pods/init-containers/#detailed-behavior)は両方とも`activeDeadlineSeconds`フィールドを持っているので注意してください。適切なレベルで設定していることを確認してください。

また`restartPolicy`はJob自体ではなく、Podに適用されることも注意してください: Jobの状態は`type: Failed`になると、自動的に再起動されることはありません。
つまり、`.spec.activeDeadlineSeconds`と`.spec.backoffLimit`によって引き起こされるJob終了メカニズムは、永久的なJob失敗につながり、手動で介入して解決する必要があります。

## 終了したJobの自動クリーンアップ  {#clean-up-finished-jobs-automatically}

終了したJobは通常システムに残す必要はありません。残ったままにしておくとAPIサーバーに負担をかけることになります。Jobが上位コントローラーにより直接管理されている場合、例えば[CronJobs](/ja/docs/concepts/workloads/controllers/cron-jobs/)の場合、Jobは指定された容量ベースのクリーンアップポリシーに基づき、CronJobによりクリーンアップされます。

### 終了したJobのTTLメカニズム  {#ttl-mechanism-for-finished-jobs}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

終了したJob(状態が`Complete`か`Failed`になったJob)を自動的にクリーンアップするもう一つの方法は
[TTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)より提供されたTTLメカニズムです。`.spec.ttlSecondsAfterFinished`フィールドを指定することで、終了したリソースをクリーンアップすることができます。

TTLコントローラーでJobをクリーンアップする場合、Jobはカスケード的に削除されます。つまりJobを削除する際に、Jobに属しているオブジェクト、例えばPodなども一緒に削除されます。Jobが削除される場合、Finalizerなどの、Jobのライフサイクル保証は守られることに注意してください。

例えば:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-ttl
spec:
  ttlSecondsAfterFinished: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job `pi-with-ttl`は終了してからの`100`秒後に自動的に削除されるようになっています。

このフィールドに`0`を設定すると、Jobは終了後すぐに自動削除の対象になります。このフィールドに何も設定しないと、Jobが終了してもTTLコントローラーによるクリーンアップはされません。

{{< note >}}
`ttlSecondsAfterFinished`フィールドを設定することが推奨されます。管理されていないJob(CronJobなどの、他のワークロードAPIを経由せずに、直接作成したJob)は`orphanDependents`というデフォルトの削除ポリシーがあるため、Jobが完全に削除されても、属しているPodが残ってしまうからです。
{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}は最終的に、失敗または完了して削除されたJobに属するPodを[ガベージコレクション](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)しますが、Podが残っていると、クラスターのパフォーマンスが低下することがあり、最悪の場合、この低下によりクラスターがオフラインになることがあります。

[LimitRanges](/ja/docs/concepts/policy/limit-range/)と[リソースクォータ](/ja/docs/concepts/policy/resource-quotas/)で、指定する名前空間が消費できるリソースの量に上限を設定することができます。
{{< /note >}}


## Jobパターン  {#job-patterns}

Jobオブジェクトは、Podの確実な並列実行をサポートするために使用されます。科学技術計算でよく見られるような、密接に通信を行う並列処理をサポートするようには設計されていません。独立だが関連性のある一連の*作業項目*の並列処理をサポートします。例えば送信すべき電子メール、レンダリングすべきフレーム、トランスコードすべきファイル、スキャンすべきNoSQLデータベースのキーの範囲、などです。

複雑なシステムでは、異なる作業項目のセットが複数存在する場合があります。ここでは、ユーザーが一斉に管理したい作業項目のセットが一つだけの場合 &mdash; つまり*バッチJob*だけを考えます。

並列計算にはいくつかのパターンがあり、それぞれに長所と短所があります。
トレードオフの関係にあるのは:

- 各作業項目に1つのJobオブジェクト vs. すべての作業項目に1つのJobオブジェクト。  
　後者は大量の作業項目を処理する場合に適しています。  
　前者は大量のJobオブジェクトを管理するため、ユーザーとシステムにオーバーヘッドをかけることになります。
- 作成されるPod数が作業項目数と等しい、 vs. 各Podが複数の作業項目を処理する。
　前者は通常、既存のコードやコンテナへの変更が少なくて済みます。
  後者は上記と同じ理由で、大量の作業項目を処理する場合に適しています。
- ワークキューを利用するアプローチもいくつかあります。それを使うためには、キューサービスを実行し、既存のプログラムやコンテナにワークキューを利用させるための改造を行う必要があります。
  他のアプローチは既存のコンテナ型アプリケーションに適用しやすいです。


ここでは、上記のトレードオフをまとめてあり、それぞれ2～4列目に対応しています。
またパターン名のところは、例やより詳しい説明が書いてあるページへのリンクになっています。

| パターン                                            | 単一Jobオブジェクト | Podが作業項目より少ない？ | アプリを修正せずに使用できる？ |
| --------------------------------------------------- | :-----------------: | :-----------------------: | :----------------------------: |
| [作業項目ごとにPodを持つキュー]                     |          ✓          |                           |              時々              |
| [Pod数可変のキュー]                                 |          ✓          |             ✓             |                                |
| [静的な処理の割り当てを使用したインデックス付きJob] |          ✓          |                           |               ✓                |
| [Jobテンプレート拡張]                               |                     |                           |               ✓                |
| [Pod間通信を使用したJob]                            |          ✓          |           時々            |              時々              |

`.spec.completions`で完了数を指定する場合、Jobコントローラーより作成された各Podは同一の[`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)を持ちます。これは、このタスクのすべてのPodが同じコマンドライン、同じイメージ、同じボリューム、そして(ほぼ)同じ環境変数を持つことを意味します。これらのパターンは、Podが異なる作業をするためのさまざまな配置方法になります。

この表は、各パターンで必要な`.spec.parallelism`と`.spec.completions`の設定を示しています。
ここで、`W`は作業項目の数を表しています。

| パターン                                            | `.spec.completions` | `.spec.parallelism` |
| --------------------------------------------------- | :-----------------: | :-----------------: |
| [作業項目ごとにPodを持つキュー]                     |          W          |        任意         |
| [Pod数可変のキュー]                                 |        null         |        任意         |
| [静的な処理の割り当てを使用したインデックス付きJob] |          W          |        任意         |
| [Jobテンプレート拡張]                               |          1          |     1であるべき     |
| [Pod間通信を使用したJob]                            |          W          |          W          |

[作業項目ごとにPodを持つキュー]: /docs/tasks/job/coarse-parallel-processing-work-queue/
[Pod数可変のキュー]: /docs/tasks/job/fine-parallel-processing-work-queue/
[静的な処理の割り当てを使用したインデックス付きJob]: /ja/docs/tasks/job/indexed-parallel-processing-static/
[Jobテンプレート拡張]: /docs/tasks/job/parallel-processing-expansion/
[Pod間通信を使用したJob]: /docs/tasks/job/job-with-pod-to-pod-communication/

## 高度な使い方  {#advanced-usage}

### Jobの一時停止  {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Jobが作成されると、JobコントローラーはJobの要件を満たすために直ちにPodの作成を開始し、Jobが完了するまで作成し続けます。しかし、Jobの実行を一時的に中断して後で再開したい場合、または一時停止状態のJobを再開し、再開時間は後でカスタムコントローラーに判断させたい場合はあると思います。

Jobを一時停止するには、Jobの`.spec.suspend`フィールドをtrueに修正し、後でまた再開したい場合にはfalseに修正すればよいです。
`.spec.suspend`をtrueに設定してJobを作成すると、一時停止状態のままで作成されます。

一時停止状態のJobを再開すると、`.status.startTime`フィールドの値は現在時刻にリセットされます。これはつまり、Jobが一時停止して再開すると、`.spec.activeDeadlineSeconds`タイマーは停止してリセットされることになります。

Jobを中断すると、状態が`Completed`ではない実行中のPodはすべてSIGTERMシグナルを受信して[終了されます](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。Podのグレースフル終了の猶予期間がカウントダウンされ、この期間内に、Podはこのシグナルを処理しなければなりません。場合により、その後のために処理状況を保存したり、変更を元に戻したりする処理が含まれます。この方法で終了したPodは`completions`数にカウントされません。

下記は一時停止状態のままで作成されたJobの定義例になります:

```shell
kubectl get job myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: myjob
spec:
  suspend: true
  parallelism: 1
  completions: 5
  template:
    spec:
      ...
```

コマンドラインを使ってJobにパッチを当てることで、Jobの一時停止状態を切り替えることもできます。

活動中のJobを一時停止する:

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":true}}'
```

一時停止中のJobを再開する:

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":false}}'
```

Jobのstatusセクションで、Jobが停止中なのか、過去に停止したことがあるかを判断できます:

```shell
kubectl get jobs/myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
# .metadata and .spec omitted
status:
  conditions:
  - lastProbeTime: "2021-02-05T13:14:33Z"
    lastTransitionTime: "2021-02-05T13:14:33Z"
    status: "True"
    type: Suspended
  startTime: "2021-02-05T13:13:48Z"
```

Jobのcondition.typeが"Suspended"で、statusが"True"になった場合、Jobは一時停止中になります。`lastTransitionTime`フィールドで、どのぐらい中断されたかを判断できます。statusが"False"になった場合、Jobは一時停止状態でしたが、今は実行されていることになります。conditionが書いていない場合、Jobは一度も停止していないことになります。

Jobが一時停止して再開した場合、Eventsも作成されます:

```shell
kubectl describe jobs/myjob
```

```
Name:           myjob
...
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  12m   job-controller  Created pod: myjob-hlrpl
  Normal  SuccessfulDelete  11m   job-controller  Deleted pod: myjob-hlrpl
  Normal  Suspended         11m   job-controller  Job suspended
  Normal  SuccessfulCreate  3s    job-controller  Created pod: myjob-jvb44
  Normal  Resumed           3s    job-controller  Job resumed
```

最後の4つのイベント、特に"Suspended"と"Resumed"のイベントは、`.spec.suspend`フィールドの値を切り替えた直接の結果です。この2つのイベントの間に、Podは作成されていないことがわかりますが、Jobが再開されるとすぐにPodの作成も再開されました。

### 可変スケジューリング命令  {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

ほとんどの場合、並列Jobは、すべてのPodが同じゾーン、またはすべてのGPUモデルxかyのいずれかであるが、両方の混在ではない、などの制約付きで実行することが望ましいです。

[suspend](#suspending-a-job)フィールドは、これらの機能を実現するための第一歩です。Suspendは、カスタムキューコントローラーがJobをいつ開始すべきかを決定することができます。しかし、Jobの一時停止が解除されると、カスタムキューコントローラーは、Job内のPodの実際の配置場所には影響を与えません。

この機能により、Jobが開始する前にスケジューリング命令を更新でき、カスタムキューコントローラーがPodの配置に影響を与えることができるようになります。同時に実際のPodからNodeへの割り当てをkube-schedulerにオフロードする能力を提供します。これは一時停止されたJobの中で、一度も一時停止解除されたことのないJobに対してのみ許可されます。

JobのPodテンプレートで更新可能なフィールドはnodeAffinity、nodeSelector、tolerations、labelsとannotations、[スケジューリングゲート](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)です。

### 独自のPodセレクターを指定  {#specifying-your-own-pod-selector}

Jobオブジェクトを作成する際には通常、`.spec.selector`を指定しません。Jobが作成された際に、システムのデフォルトロジックは、他のJobと重ならないようなセレクターの値を選択し、このフィールドに追加します。

しかし、場合によっては、この自動設定されたセレクターをオーバーライドする必要があります。そのためには、Jobの`.spec.selector`を指定します。

その際には十分な注意が必要です。そのJobの他のPodと重なったラベルセレクターを指定し、無関係のPodにマッチした場合、無関係のJobのPodが削除されたり、無関係のPodが完了されてもこのJobの完了数とカウントしたり、片方または両方のJobがPodの作成または完了までの実行を拒否する可能性があります。
一意でないセレクターを選択した場合、他のコントローラー(例えばReplicationController)や属しているPodが予測できない挙動をする可能性があります。Kubernetesは`.spec.selector`を間違って設定しても止めることはしません。

下記はこの機能の使用例を紹介しています。

`old`と名付けたJobがすでに実行されていると仮定します。既存のPodをそのまま実行し続けてほしい一方で、作成する残りのPodには別のテンプレートを使用し、そのJobには新しい名前を付けたいとしましょう。これらのフィールドは更新できないため、Jobを直接更新できません。そのため、`kubectl delete jobs/old --cascade=orphan`で、_属しているPodが実行されたまま_、`old`Jobを削除します。削除する前に、どのセレクターを使用しているかをメモしておきます:

```shell
kubectl get job old -o yaml
```

出力結果はこのようになります:

```yaml
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

次に、`new`という名前で新しくJobを作成し、同じセレクターを明示的に指定します。既存のPodも`batch.kubernetes.io/controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`ラベルが付いているので、同じく`new`Jobによってコントロールされます。

通常システムが自動的に生成するセレクターを使用しないため、新しいJobで `manualSelector: true`を指定する必要があります。

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

新しいJobは`a8f3d00d-c6d2-11e5-9f87-42010af00002`ではなく、別のuidを持つことになります。`manualSelector: true`を設定することで、自分は何をしているかを知っていて、またこのミスマッチを許容することをシステムに伝えます。

### FinalizerによるJob追跡  {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

{{< note >}}
`JobTrackingWithFinalizers`機能が無効になっている時に作成されたJobについては、コントロールプレーンを1.26にアップグレードしても、ファイナライザーを使用してJobを追跡しません。
{{< /note >}}

コントロールプレーンは任意のJobに属するPodを追跡し、そのPodがAPIサーバーから削除されたかどうか認識します。そのためJobコントローラーはファイナライザー`batch.kubernetes.io/job-tracking`を持つPodを作成します。コントローラーがファイナライザーを削除するのは、PodがJobステータスに反映された後なので、他のコントローラーやユーザがPodを削除することができます。

Kubernetes 1.26にアップグレードする前、またはフィーチャーゲート`JobTrackingWithFinalizers`が有効になる前に作成されたJobは、Podファイナライザーを使用せずに追跡されます。Job{{< glossary_tooltip term_id="controller" text="コントローラー" >}}は、クラスターに存在するPodのみに基づいて、`succeeded`Podと`failed`Podのステータスカウンタを更新します。クラスターからPodが削除されると、コントロールプレーンはJobの進捗を見失う可能性があります。

Jobが`batch.kubernetes.io/job-tracking`というアノテーションを持っているかどうかをチェックすることで、コントロールプレーンがPodファイナライザーを使ってJobを追跡しているかどうかを判断できます。Jobからこのアノテーションを手動で追加したり削除したりしては**いけません**。代わりに、JobがPodファイナライザーを使用して追跡されていることを確認するために、Jobを再作成することができます。

### 静的なインデックス付きJob {#elastic-indexed-jobs}

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

`.spec.parallelism`と`.spec.compleitions`の両方を、`.spec.parallelism` == `.spec.compleitions`となるように変更することで、インデックス付きJobを増減させることができます。[APIサーバ](/docs/reference/command-line-tools-reference/kube-apiserver/)の`ElasticIndexedJob`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が無効になっている場合、`.spec.compleitions`は不変です。

静的なインデックス付きJobの使用例としては、MPI、Horovod、Ray、PyTorchトレーニングジョブなど、インデックス付きJobのスケーリングを必要とするバッチワークロードがあります。

## 代替案  {#alternatives}

### 単なるPod  {#bare-pods}

Podが動作しているノードが再起動または故障した場合、Podは終了し、再起動されません。しかし、終了したPodを置き換えるため、Jobが新しいPodを作成します。このため、たとえアプリケーションが1つのPodしか必要としない場合でも、単なるPodではなくJobを使用することをお勧めします。

### Replication Controller  {#replication-controller}

Jobは[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/)を補完するものです。
Replication Controllerは、終了することが想定されていないPod(Webサーバーなど)を管理し、Jobは終了することが想定されているPod(バッチタスクなど)を管理します。

[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)で説明したように、`Job`は`RestartPolicy`が`OnFailure`か`Never`と設定されているPodに*のみ*適用されます。(注意:`RestartPolicy`が設定されていない場合、デフォルト値は`Always`になります)


### シングルJobによるコントローラーPodの起動  {#single-job-starts-controller-pod}

もう一つのパターンは、一つのJobが一つPodを作り、そのPodがカスタムコントローラーのような役割を果たし、他のPodを作ります。これは最も柔軟性がありますが、使い始めるにはやや複雑で、Kubernetesとの統合もあまりできません。

このパターンの一例としては、Sparkマスターコントローラーを起動し、sparkドライバーを実行してクリーンアップするスクリプトを実行するPodをJobで起動する([sparkの例](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)を参照)が挙げられます。


この方法のメリットは、全処理過程でJobオブジェクトが完了する保証がありながらも、どのPodを作成し、どのように作業を割り当てるかを完全に制御できることです。

## {{% heading "whatsnext" %}}

* [Pods](/ja/docs/concepts/workloads/pods/)について学ぶ。
* Jobのさまざまな実行方法について学ぶ:
   * [ワークキューを用いた粒度の粗い並列処理](/docs/tasks/job/coarse-parallel-processing-work-queue/)
   * [ワークキューを用いた粒度の細かい並列処理](/docs/tasks/job/fine-parallel-processing-work-queue/)
   * [静的な処理の割り当てを使用した並列処理のためのインデックス付きJob](/ja/docs/tasks/job/indexed-parallel-processing-static/) を使う
   * テンプレートを元に複数のJobを作成: [拡張機能を用いた並列処理](/docs/tasks/job/parallel-processing-expansion/)
* [終了したJobの自動クリーンアップ](#clean-up-finished-jobs-automatically)のリンクから、クラスターが完了または失敗したJobをどのようにクリーンアップするかをご確認ください。
* `Job`はKubernetes REST APIの一部です。JobのAPIを理解するために、{{< api-reference page="workload-resources/job-v1" >}}オブジェクトの定義をお読みください。
* UNIXツールの`cron`と同様に、スケジュールに基づいて実行される一連のJobを定義するために使用できる[`CronJob`](/ja/docs/concepts/workloads/controllers/cron-jobs/)についてお読みください。
* 段階的な[例](/docs/tasks/job/pod-failure-policy/)に基づいて、`PodFailurePolicy`を使用して、回復可能なPod失敗と回復不可能なPod失敗の処理を構成する方法を練習します。
