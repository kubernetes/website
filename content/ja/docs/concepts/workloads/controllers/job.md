---
title: Jobs
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

{{< codenew file="controllers/job.yaml" >}}

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
Selector:       controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                job-name=pi
Annotations:    kubectl.kubernetes.io/last-applied-configuration:
                  {"apiVersion":"batch/v1","kind":"Job","metadata":{"annotations":{},"name":"pi","namespace":"default"},"spec":{"backoffLimit":4,"template":...
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           job-name=pi
  Containers:
   pi:
    Image:      perl
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
  Normal  SuccessfulCreate  14m   job-controller  Created pod: pi-5rwd7
{{< /tab >}}
{{< tab name="kubectl get job pi -o yaml" codelang="bash" >}}
apiVersion: batch/v1
kind: Job
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"batch/v1","kind":"Job","metadata":{"annotations":{},"name":"pi","namespace":"default"},"spec":{"backoffLimit":4,"template":{"spec":{"containers":[{"command":["perl","-Mbignum=bpi","-wle","print bpi(2000)"],"image":"perl","name":"pi"}],"restartPolicy":"Never"}}}}
  creationTimestamp: "2022-06-15T08:40:15Z"
  generation: 1
  labels:
    controller-uid: 863452e6-270d-420e-9b94-53a54146c223
    job-name: pi
  name: pi
  namespace: default
  resourceVersion: "987"
  uid: 863452e6-270d-420e-9b94-53a54146c223
spec:
  backoffLimit: 4
  completionMode: NonIndexed
  completions: 1
  parallelism: 1
  selector:
    matchLabels:
      controller-uid: 863452e6-270d-420e-9b94-53a54146c223
  suspend: false
  template:
    metadata:
      creationTimestamp: null
      labels:
        controller-uid: 863452e6-270d-420e-9b94-53a54146c223
        job-name: pi
    spec:
      containers:
      - command:
        - perl
        - -Mbignum=bpi
        - -wle
        - print bpi(2000)
        image: perl
        imagePullPolicy: Always
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
  ready: 1
  startTime: "2022-06-15T08:40:15Z"
{{< /tab >}}
{{< /tabs >}}

Jobの完了したPodを確認するには、`kubectl get pods`を使います。

Jobに属するPodの一覧を機械可読形式で出力するには、下記のコマンドを使います:

```shell
pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

出力結果はこのようになります:

```
pi-5rwd7
```

ここのセレクターはJobのセレクターと同じです。`--output=jsonpath`オプションは、返されたリストからPodのnameフィールドを指定するための表現です。

その中の一つのPodの標準出力を確認するには：

```shell
kubectl logs $pods
```

出力結果はこのようになります：

```
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

## Job spec(仕様)の書き方  {#writing-a-job-spec}

他のKubernetesオブジェクト設定ファイルと同様に、Jobにも`apiVersion`、`kind`または`metadata`フィールドが必要です。
Jobの名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要があります。

Jobには[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

### Podテンプレート  {#pod-template}

`.spec.template`は`.spec`の唯一の必須フィールドです。

`.spec.template`は[podテンプレート](/ja/docs/concepts/workloads/pods/#pod-template)です。ネストされていることと`apiVersion`や`kind`フィールドが不要になったことを除いて、仕様の定義が{{< glossary_tooltip text="Pod" term_id="pod" >}}と全く同じです。

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
2. *一定の完了数*が決められた並列Job：
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

 _完了数一定_ 並列Jobの場合、`.spec.completions`を必要完了数に設定する必要があります。
`.spec.parallelism`を設定してもいいですし、未設定の場合、デフォルトで1になります。

 _ワークキュー_ 並列Jobの場合、`.spec.completions`を未設定のままにし、`.spec.parallelism`を非負の整数に設定する必要があります。

各種類のJobの使用方法の詳細については、[Jobパターン](#job-patterns)セクションを参照してください。

#### 並列処理の制御  {#controlling-parallelism}

必要並列数(`.spec.parallelism`)は任意の非負の値に設定できます。
未設定の場合は、デフォルトで1になります。
0に設定した際に、増加するまでJobは一時停止されます。

実際並列数（任意時点で実行されているPod数）は下記の理由により、必要並列数と異なる可能性があります：

-  _完了数一定_ Jobの場合、実際に並列して実行されるPodの数は、残りの完了数を超えることはありません。 `.spec.parallelism`の値が高い場合は無視されます。
-  _ワークキュー_ Jobの場合、任意のPodが成功すると、新しいPodは作成されません。ただし、残りのPodは終了まで実行し続けられます。
- Job{{< glossary_tooltip text="コントローラー" term_id="controller" >}}の応答する時間がなかった場合
- Jobコントローラーは何らかの理由で（`ResourceQuota`の不足、権限の不足など）、Podを作成できない場合、
  実際並列数は必要並列数より少なくなる可能性があります。
- 同じJobでのPod障害が多すぎる場合、Jobコントローラーは新しいPodの作成を抑制する可能性はあります。
- Podがグレースフルシャットダウンされた場合、停止するのに時間がかかります。

### 完了モード  {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

 _完了数一定_ Job、つまり`.spec.completions`の値がnullではないJobは`.spec.completionMode`で完了モードを指定できます：

- `NonIndexed`（デフォルト）：　`.spec.completions`個のPodが成功した場合、Jobの完了となります。言い換えれば、各Podの完了状態は同質です。ここで要注意なのは、`.spec.completions`の値がnullの場合、暗黙的に`NonIndexed`として指定されることです。
- `Indexed`： Jobに属するPodはそれぞれ、0から`.spec.completions-1`の範囲内の完了インデックスを取得できます。インデックスは下記の三つの方法で取得できます。
  - Podアノテーション`batch.kubernetes.io/job-completion-index`。
  - Podホスト名の一部として、`$(job-name)-$(index)`と書きます。
    インデックス付きJob(Indexed Job)と{{< glossary_tooltip term_id="Service" >}}を一緒に使用すると、Jobに属するPodはお互いにDNSを介して確定的ホスト名で通信できます。
  - コンテナ化されたタスクの環境変数`JOB_COMPLETION_INDEX`で定義します。

  インデックスごとに、成功したPodが一つ存在すると、Jobの完了となります。完了モードの使用方法の詳細については、
  [静的な処理の割り当てを使用した並列処理のためのインデックス付きJob](/ja/docs/tasks/job/indexed-parallel-processing-static/)を参照してください。めったに発生しませんが、同じインデックスを取得して稼働し始めるPodも存在する可能性があります。ただし、完了数にカウントされるのはそのうちの一つだけです。

## Podとコンテナの障害対策  {#handling-pod-and-container-failures}

Pod内のコンテナは、その中のプロセスは0以外の終了コードで終了した、またはメモリ制限を超えたためにコンテナは強制終了されたなど、様々な理由で失敗することがあります。この場合、もし`.spec.template.spec.restartPolicy = "OnFailure"`と設定すると、Podはノード上に残りますが、コンテナは再実行されます。そのため、プログラムがローカルで再起動した場合の処理を行うか、`.spec.template.spec.restartPolicy = "Never"`と指定する必要があります。
`restartPolicy`の詳細については[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)を参照してください。

Podがノードからキックされた（ノードがアップグレード、再起動、削除されたなど）、または`.spec.template.spec.restartPolicy = "Never"`と設定したPodに属するコンテナが失敗したなど、様々な理由でPod全体が故障することもあります。Podに障害が発生すると、Jobコントローラーは新しいPodを起動します。つまりアプリケーションが新しいPodの再起動処理を行う必要があります。特に、過去に実行した際に生じた一時ファイル、ロック、不完全な出力などを処理する必要があります。

`.spec.parallelism = 1`、`.spec.completions = 1`と`.spec.template.spec.restartPolicy = "Never"`を指定しても、同じプログラムが2回起動されることもありますので注意してください。

`.spec.parallelism`と`.spec.completions`を両方とも2以上指定した場合、複数のPodが同時に実行される可能性があります。そのため、Podは並行処理を行えるようにする必要があります。

### Pod失敗のバックオフポリシー  {#pod-backoff-failure-policy}

設定の論理エラーなどにより、Jobが数回再試行しても失敗するとそのまま終了状態に進んでほしい場合があります。`.spec.backoffLimit`を設定すると、失敗したと判断するまでの再試行回数を指定できます。バックオフ制限はデフォルトで6に設定されています。Jobに属する失敗したPodはJobコントローラーにより再作成され、バックオフ遅延は指数関数的に増加し（10秒、20秒、40秒…）、最大6分まで増加します。Jobに属するPodが削除された場合、または一つのPodが成功した時に、同じJobに属する他のPodがその時点で失敗していない場合に、バックオフ数はリセットされます。

{{< note >}}
`restartPolicy = "OnFailure"`が設定されたJobはバックオフ制限に達すると、属するPodは全部終了されるので注意してください。しかし、Jobの実行ファイルのデバッグ作業がこれにより難しくなる可能性はありますので、失敗したJobからの出力が不注意で失われないように、Jobのデバッグ作業やロギングシステムを使用する場合、`restartPolicy = "Never"`と設定するほうがオススメです。
{{< /note >}}

## Jobの終了と後片付け  {#job-termination-and-cleanup}

Jobが完了すると、それ以上Podは作成されませんが、[通常](#pod-backoff-failure-policy)Podが削除されることもありません。
これらを残しておくと、完了したPodのログを確認でき、エラーや警告などの診断出力を確認できます。
またJobオブジェクトはJob終了後も残し、状態を確認することができます。古いJobの状態を把握した上で、削除するかどうかはユーザー次第です。Jobを削除するには`kubectl` (例：`kubectl delete jobs/pi`または`kubectl delete -f ./job.yaml`)を使います。`kubectl`でJobを削除する場合、Jobが作成したPodも全部削除されます。

デフォルトでは、Jobは中断されることなく実行できますが、Podが失敗した場合(`restartPolicy=Never`)、またはコンテナがエラーで終了した場合(`restartPolicy=OnFailure`)のみ、前述の`.spec.backoffLimit`で決まった回数まで再試行します。`.spec.backoffLimit`に達すると、Jobが失敗とマークされ、実行中のPodもすべて終了されます。

Jobを終了させるもう一つの方法は、活動期間を設定することです。
Jobの`.spec.activeDeadlineSeconds`フォールドに秒数を設定することで、活動期間を設定できます。
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
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job仕様と、Jobに属する[Podテンプレートの仕様](/ja/docs/concepts/workloads/pods/init-containers/#detailed-behavior)は両方とも`activeDeadlineSeconds`フィールドを持っているので注意してください。適切なレベルで設定していることを確認してください。

また`restartPolicy`はJob自体ではなく、Podに適用されることも注意してください: Jobの状態は`type: Failed`になると、自動的再起動されることはありません。
つまり、`.spec.activeDeadlineSeconds`と`.spec.backoffLimit`によって引き起こされるJob終了メカニズムは、永久的なJob失敗につながり、手動で介入して解決する必要があります。

## 終了したJobの自動片付け  {#clean-up-finished-jobs-automatically}

終了したJobは通常システムに残す必要はありません。残ったままにしておくとAPIサーバーに負担をかけることになります。Jobが上位コントローラーにより直接管理されている場合、例えば[CronJobs](/ja/docs/concepts/workloads/controllers/cron-jobs/)の場合、Jobは指定された容量ベースの片付けポリシーに基づき、CronJobにより片付けられます。

### 終了したJobのTTLメカニズム  {#ttl-mechanism-for-finished-jobs}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

終了したJob(状態は`Complete`か`Failed`になったJob)を自動的に片付けるもう一つの方法は
[TTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)より提供されたTTLメカニズムです。`.spec.ttlSecondsAfterFinished`フィールドを指定することで、終了したリソースを片付けることができます。

TTLコントローラーでJobを片付ける場合、Jobはカスケード的に削除されます。つまりJobを削除する際に、Jobに属しているオブジェクト、例えばPodなども一緒に削除されます。Jobが削除される場合、Jobのライフサイクル保証、例えばFinalizersなど、は考えられるので注意してください。

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
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job`pi-with-ttl`は終了してからの`100`秒後に自動的に削除されるようになっています。

このフィールドに`0`を設定すると、Jobは終了後すぐに削除されるようになります。このフィールドに何も設定しないと、Jobは終了してもTTLコントローラーより片付けられません。

{{< note >}}
`ttlSecondsAfterFinished`フィールドを設定することが推奨されます。管理されていないJob(CronJobなどの、他のワークロードAPIを経由せずに、直接作成したJob)は`orphanDependents`というデフォルトの削除ポリシーがあるため、Jobが完全に削除されても、属しているPodが残ってしまうからです。
{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}は最終的に、失敗または完了して削除されたJobに属するPodを[ガベージコレクション](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)しますが、Podが残っていると、クラスタのパフォーマンスが低下することがあり、最悪の場合、この低下によりクラスタがオフラインになることがあります。

[LimitRanges](/ja/docs/concepts/policy/limit-range/)と[リソースクォータ](/ja/docs/concepts/policy/resource-quotas/)で、指定する名前空間が消費できるリソースの量に上限を設定することができます。
{{< /note >}}


## Jobパターン  {#job-patterns}

Jobオブジェクトは、Podの確実な並列実行をサポートするために使用されます。科学技術計算でよく見られるような、密接に通信を行う並列処理をサポートするようには設計されていません。独立だが関連性のある一連の*作業項目*の並列処理をサポートします。例えば送信すべき電子メール、レンダリングすべきフレーム、トランスコードすべきファイル、スキャンすべきNoSQLデータベースのキーの範囲、などなどです。

複雑なシステムでは、異なる作業項目のセットが複数存在する場合があります。ここでは、ユーザーが一斉に管理したい作業項目のセットが一つだけの場合 &mdash; つまり*バッチJob*だけを考えます。

並列計算にはいくつかのパターンがあり、それぞれに長所と短所があります。
兼ね合うべき要素は:

- 各作業項目に1つのJobオブジェクト、 vs. すべての作業項目に1つのJobオブジェクト。  
　後者は大量の作業項目を処理する場合に適しています。  
　前者は大量のJobオブジェクトを管理するため、ユーザーとシステムにオーバーヘッドをかけることになります。
- 作成されるPod数が作業項目数と等しい、 vs. 各Podが複数の作業項目を処理する。
　前者は通常、既存のコードやコンテナへの変更が少なくて済みます。
  後者は上記と同じ理由で、大量の作業項目を処理する場合に適しています。
- ワークキューを利用するアプローチもいくつかあります。それを使うためには、キューサービスを実行し、　既存のプログラムやコンテナにワークキューを利用させるための改造を行う必要があります。
  他のアプローチは既存のコンテナ型アプリケーションに適用しやすいです。


ここでは、上記のトレードオフをまとめてあり、それぞれ2～4列目に対応しています。
またパターン名のところは、例やより詳しい説明が書いてあるページへのリンクになっています。

|                  パターン                  | 単一Jobオブジェクト | Podが作業項目より少ない？ | アプリを修正せずに使用できる？ |
| ----------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|
| [作業項目ごとにPodを持つキュー]            |         ✓         |                             |      時々      |
| [Pod数可変のキュー]           |         ✓         |             ✓               |                     |
| [静的な処理の割り当てを使用したインデックス付きJob] |         ✓         |                             |          ✓          | 
| [Jobテンプレート拡張]                  |                   |                             |          ✓          |

`.spec.completions`で完成数を指定する場合、Jobコントローラーより作成された各Podは同一の[`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)を持ちます。これは、このタスクのすべてのPodが同じコマンドライン、同じイメージ、同じボリューム、そして(ほぼ)同じ環境変数を持つことを意味します。これらのパターンは、Podが異なる作業をするためのさまざまな配置方法になります。

この表は、各パターンで必要な`.spec.parallelism`と`.spec.completions`の設定を示しています。
ここで、`W`は作業項目の数を表しています。

|             パターン                       | `.spec.completions` |  `.spec.parallelism` |
| ----------------------------------------- |:-------------------:|:--------------------:|
| [作業項目ごとにPodを持つキュー]            |          W          |        任意           |
| [Pod数可変のキュー]           |         null        |        任意           |
| [静的な処理の割り当てを使用したインデックス付きJob] |          W          |        任意           |
| [Jobテンプレート拡張]                  |          1          |     1であるべき      |

[作業項目ごとにPodを持つキュー]: /docs/tasks/job/coarse-parallel-processing-work-queue/
[Pod数可変のキュー]: /docs/tasks/job/fine-parallel-processing-work-queue/
[静的な処理の割り当てを使用したインデックス付きJob]: /ja/docs/tasks/job/indexed-parallel-processing-static/
[Jobテンプレート拡張]: /docs/tasks/job/parallel-processing-expansion/

## 上級な使用方法  {#advanced-usage}

### Jobの一時停止  {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Jobが作成されると、JobコントローラーはJobの要件を満たすために直ちにPodの作成を開始し、Jobが完了するまで作成し続けます。しかし、Jobの実行を一時的に中断して後で再開したい場合、または一時停止状態のJobを再開し、再開時間は後でカスタムコントローラーに判断させたい場合はあると思います。

Jobを一時停止するには、Jobの`.spec.suspend`フィールドをtrueに修正し、後でまた再開したい場合にはfalseに修正すればいいです。
`.spec.suspend`をtrueに設定してJobを作成すると、一時停止状態のままで作成されます。

一時停止状態のJobを再開すると、`.status.startTime`フィールドの値は現在時刻にリセットされます。これはつまり、Jobが一時停止して再開すると、`.spec.activeDeadlineSeconds`タイマーは停止してリセットされることになります。

Jobを中断すると、稼働中のPodは全部削除されることを忘れないでください。Jobが中断されると、PodはSIGTERM信号を受信して[終了されます](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。Podのグレースフル終了の猶予期間がカウントダウンされ、この期間内に、Podはこの信号を処理しなければなりません。場合により、プロセスの保存や、操作の取り消しなどの処理が含まれます。この方法で終了したPodは`completions`数にカウントされません。

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

最後の4つのイベント、特に"Suspended"と"Resumed"のイベントは、`.spec.suspend`フィールドの値が変更されまくったために発生したものになります。この2つのイベントの間に、Podは作成されていないですが、Jobが再開された瞬間に、Podの作成も再開されました。

### Mutable Scheduling Directives  {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
In order to use this behavior, you must enable the `JobMutableNodeSchedulingDirectives`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/).
It is enabled by default.
{{< /note >}}

In most cases a parallel job will want the pods to run with constraints, 
like all in the same zone, or all either on GPU model x or y but not a mix of both.

The [suspend](#suspending-a-job) field is the first step towards achieving those semantics. Suspend allows a 
custom queue controller to decide when a job should start; However, once a job is unsuspended,
a custom queue controller has no influence on where the pods of a job will actually land.

This feature allows updating a Job's scheduling directives before it starts, which gives custom queue
controllers the ability to influence pod placement while at the same time offloading actual 
pod-to-node assignment to kube-scheduler. This is allowed only for suspended Jobs that have never 
been unsuspended before.

The fields in a Job's pod template that can be updated are node affinity, node selector, 
tolerations, labels and annotations.

### Specifying your own Pod selector  {#specifying-your-own-pod-selector}

Normally, when you create a Job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the Job is created.
It picks a selector value that will not overlap with any other jobs.

However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the Job.

Be very careful when doing this.  If you specify a label selector which is not
unique to the pods of that Job, and which matches unrelated Pods, then pods of the unrelated
job may be deleted, or this Job may count other Pods as completing it, or one or both
Jobs may refuse to create Pods or run to completion.  If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their Pods may behave
in unpredictable ways too.  Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.

Here is an example of a case when you might want to use this feature.

Say Job `old` is already running.  You want existing Pods
to keep running, but you want the rest of the Pods it creates
to use a different pod template and for the Job to have a new name.
You cannot update the Job because these fields are not updatable.
Therefore, you delete Job `old` but _leave its pods
running_, using `kubectl delete jobs/old --cascade=orphan`.
Before deleting it, you make a note of what selector it uses:

```shell
kubectl get job old -o yaml
```

The output is similar to this:

```yaml
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

Then you create a new Job with name `new` and you explicitly specify the same selector.
Since the existing Pods have label `controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`,
they are controlled by Job `new` as well.

You need to specify `manualSelector: true` in the new Job since you are not using
the selector that the system normally generates for you automatically.

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

The new Job itself will have a different uid from `a8f3d00d-c6d2-11e5-9f87-42010af00002`.  Setting
`manualSelector: true` tells the system that you know what you are doing and to allow this
mismatch.

### Job tracking with finalizers  {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
In order to use this behavior, you must enable the `JobTrackingWithFinalizers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
and the [controller manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
It is enabled by default.

When enabled, the control plane tracks new Jobs using the behavior described
below. Jobs created before the feature was enabled are unaffected. As a user,
the only difference you would see is that the control plane tracking of Job
completion is more accurate.
{{< /note >}}

When this feature isn't enabled, the Job {{< glossary_tooltip term_id="controller" >}}
relies on counting the Pods that exist in the cluster to track the Job status,
that is, to keep the counters for `succeeded` and `failed` Pods.
However, Pods can be removed for a number of reasons, including:
- The garbage collector that removes orphan Pods when a Node goes down.
- The garbage collector that removes finished Pods (in `Succeeded` or `Failed`
  phase) after a threshold.
- Human intervention to delete Pods belonging to a Job.
- An external controller (not provided as part of Kubernetes) that removes or
  replaces Pods.

If you enable the `JobTrackingWithFinalizers` feature for your cluster, the
control plane keeps track of the Pods that belong to any Job and notices if any
such Pod is removed from the API server. To do that, the Job controller creates Pods with
the finalizer `batch.kubernetes.io/job-tracking`. The controller removes the
finalizer only after the Pod has been accounted for in the Job status, allowing
the Pod to be removed by other controllers or users.

The Job controller uses the new algorithm for new Jobs only. Jobs created
before the feature is enabled are unaffected. You can determine if the Job
controller is tracking a Job using Pod finalizers by checking if the Job has the
annotation `batch.kubernetes.io/job-tracking`. You should **not** manually add
or remove this annotation from Jobs.

## Alternatives  {#alternatives}

### Bare Pods  {#bare-pods}

When the node that a Pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new Pods to replace terminated ones.
For this reason, we recommend that you use a Job rather than a bare Pod, even if your application
requires only a single Pod.

### Replication Controller  {#replication-controller}

Jobs are complementary to [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/).
A Replication Controller manages Pods which are not expected to terminate (e.g. web servers), and a Job
manages Pods that are expected to terminate (e.g. batch tasks).

As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate
for pods with `RestartPolicy` equal to `OnFailure` or `Never`.
(Note: If `RestartPolicy` is not set, the default value is `Always`.)

### Single Job starts controller Pod  {#single-job-starts-controller-pod}

Another pattern is for a single Job to create a Pod which then creates other Pods, acting as a sort
of custom controller for those Pods.  This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.

One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)), runs a spark
driver, and then cleans up.

An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but maintains complete control over what Pods are created and how work is assigned to them.

## {{% heading "whatsnext" %}}

* Learn about [Pods](/docs/concepts/workloads/pods).
* Read about different ways of running Jobs:
   * [Coarse Parallel Processing Using a Work Queue](/docs/tasks/job/coarse-parallel-processing-work-queue/)
   * [Fine Parallel Processing Using a Work Queue](/docs/tasks/job/fine-parallel-processing-work-queue/)
   * Use an [indexed Job for parallel processing with static work assignment](/docs/tasks/job/indexed-parallel-processing-static/) (beta)
   * Create multiple Jobs based on a template: [Parallel Processing using Expansions](/docs/tasks/job/parallel-processing-expansion/)
* Follow the links within [Clean up finished jobs automatically](#clean-up-finished-jobs-automatically)
  to learn more about how your cluster can clean up completed and / or failed tasks.
* `Job` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/job-v1" >}}
  object definition to understand the API for jobs.
* Read about [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/), which you
  can use to define a series of Jobs that will run based on a schedule, similar to
  the UNIX tool `cron`.
