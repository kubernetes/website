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
一つ目のPodに障害が発生したり、(例えばノードのハードウェア障害またノードの再起動が原因で)削除されたりすると、Jobオブジェクトは新しいPodを作成してくれます。

Jobで複数のPodを並列で実行することもできます。。

スケジュールに沿ってJob(単一のタスクか複数タスク並列のいずれか)を実行したい場合は [CronJob](/ja/docs/concepts/workloads/controllers/cron-jobs/)を参照してください。

<!-- body -->

## 実行例  {#running-an-example-job}

下記にJobの定義例を記載しています。πの2000桁まで計算して出力するJobで、完了するまで約10秒かかります。

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

Jobには[`.spec`フィールド](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

### Podテンプレート  {#pod-template}

`.spec.template`は`.spec`の唯一の必須フィールドです。

`.spec.template`の値は[podテンプレート](/ja/docs/concepts/workloads/pods/#pod-template)で、ネストされていることと`apiVersion`と`kind`フィールドが不要になったことを除いて、仕様の定義がが{{< glossary_tooltip text="Pod" term_id="pod" >}}と全く同じです。

Podの必須フィールド以外、Job定義ファイルにあるPodテンプレートでは、ラベル([podセレクター](#pod-selector)を参照)と再起動ポリシーを適切な値に指定する必要があります。

[`RestartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)は`Never`か`OnFailure`のみ設定可能です。

### Podセレクター  {#pod-selector}

`.spec.selector`フィールドはオプションです。ほとんどの場合はむしろ指定しないほうがいいです。
[独自のPodセレクターを指定](#specifying-your-own-pod-selector)セクションを参照してください。

### Jobの並列実行  {#parallel-jobs}

Jobで実行するのに適したタスクは主に3種類あります:

1. 非並列Job
   - 通常、Podに障害が発生しない限り、一つのPodのみが起動されます。
   - Podが正常に終了すると、Jobの完了となります。
2. *一定の完了数*が決められた並列Job：
   - `.spec.completions`に正の値を指定します。
   - Jobは全体的なタスクを表し、`.spec.completions`個のPodが成功すると、Jobの完了となります。
   - `.spec.completionMode="Indexed"`を利用する場合、各Podは0から`.spec.completions-1`までの範囲内のインデックスをアサインされます。
3. *ワークキュー*を利用した並列Job:
   - `.spec.completions`の設定はせず、デフォルトは`.spec.parallelism`となります。
   - Pod間で調整する、または外部サービスを使う方法で、それぞれ何のタスクに着手するかを決めます。例えば、一つのPodはワークキューから最大N個のタスクを一括で取得できます。
   - 各Podは他のPodが完成したかどうか、つまりJobが完成したかどうかを単独で判断できます。
   - Jobに属する _任意_ のPodが成功に終了すると、新しいPodは作成されません。
   - 一つ以上のPodが正常に終了し、すべてのPodが終了すると、Jobは成功終了とみなされます。
   - 一つのPodが正常に終了すると、他のPodは同じタスクの作業を行ったり、出力を書き込んだりすることはできません。すべてのPodが終了プロセスに進む必要があります。

 _非並列_ Jobの場合、`.spec.completions`と`.spec.parallelism`の両方を未設定のままにしておくことも可能です。未設定の場合、両方がデフォルトで1になります。

 _完成数一定_ 並列Jobの場合、`.spec.completions`を必要完了数に設定する必要があります。
`.spec.parallelism`を設定してもいいですし、未設定の場合、デフォルトで1になります。

 _ワークキュー_ 並列Jobの場合、`.spec.completions`を未設定のままにし、`.spec.parallelism`を非負の整数に設定する必要があります。

各種類Jobの利用方法の詳細については、[Jobパターン](#job-patterns)セクションを参照してください。

#### 並列処理の制御

必要並列数(`.spec.parallelism`)は任意の非負の値に設定できます。
未設定の場合は、デフォルトで1になります。
0に設定した際に、増加するまでJobは一時停止されます。

実際並列数（任意時点で実行されているPod数）は下記の理由により、必要並列数と異なる可能性があります：

-  _完成数一定_ Jobの場合、実際に並列して実行されるPodの数は、残りの完成数を超えることはありません。 `.spec.parallelism`の値が高い場合は無視されます。
-  _ワークキュー_ Jobの場合、任意のPodが成功すると、新しいPodは作成されません。ただし、残りのPodは終了まで実行し続けられます。
- Job{{< glossary_tooltip text="コントローラー" term_id="controller" >}}の応答する時間がなかった場合
- Jobコントローラーは何らかの理由で（`ResourceQuota`の不足、権限の不足など）、Podを作成できない場合、
  実際並列数は必要並列数より少なくなる可能性があります。
- 同じJobでのPod障害が多すぎる場合、Jobコントローラーは新しいPodの作成を抑制する可能性はあります。
- Podがグレースフルシャットダウンされた場合、停止するのに時間がかかります。

### 完成モード

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

 _完成数一定_ 並列Job、つまり`.spec.completions`の値がnullではないJobは`.spec.completionMode`で完成モードを指定できます：

- `NonIndexed`（デフォルト）：　`.spec.completions`個のPodが成功した場合、Jobの完成となります。言い換えれば、各Podの完成状態は同質です。ここで要注意なのは、`.spec.completions`の値がnullの場合、暗黙的に`NonIndexed`として指定されることです。
- `Indexed`： Jobに属するPodはそれぞれ、0から`.spec.completions-1`の範囲内の完成インデックスを取得できます。インデックスは下記の三つの方法で取得できます。
  - Pod注釈`batch.kubernetes.io/job-completion-index`。
  - Podホスト名の一部として、`$(job-name)-$(index)`と書きます。
    インデックス付きJob(Indexed Job)と{{< glossary_tooltip term_id="Service" >}}を一緒に使用すると、Jobに属するPodはお互いにDNSを介して確定的ホスト名で通信できます。
  - コンテナ化されたタスクの環境変数`JOB_COMPLETION_INDEX`で定義します。

  インデックスごとに、成功したPodが一つ存在すると、Jobの完成となります。完成モードの使用方法の詳細については、
  [静的な処理の割り当てを使用した並列処理のためのインデックス付きJob](/ja/docs/tasks/job/indexed-parallel-processing-static/)を参照してください。めったに発生しませんが、同じインデックスを取得して稼働し始めるPodも存在する可能性があります。ただし、完成数にカウントされるのはそのうちの一つだけです。

## Podとコンテナの障害対策

Pod内のコンテナは、その中のプロセスは0以外の終了コードで終了した、またはメモリ制限を超えたためにコンテナは強制終了されたなど、様々な理由で失敗することがあります。この場合、もし`.spec.template.spec.restartPolicy = "OnFailure"`と設定すると、Podはノード上に残りますが、コンテナは再実行されます。そのため、プログラムがローカルで再起動した場合の処理を行うか、`.spec.template.spec.restartPolicy = "Never"`と指定する必要があります。
`restartPolicy`の詳細については[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)を参照してください。

Podがノードからキックされた（ノードがアップグレード、再起動、削除されたなど）、または`.spec.template.spec.restartPolicy = "Never"`と設定したPodに属するコンテナが失敗したなど、様々な理由でPod全体が故障することもあります。Podに障害が発生すると、Jobコントローラーは新しいPodを起動します。つまりアプリケーションが新しいPodの再起動処理を行う必要があります。特に、過去に実行した際に生じた一時ファイル、ロック、不完全な出力などを処理する必要があります。

`.spec.parallelism = 1`、`.spec.completions = 1`と`.spec.template.spec.restartPolicy = "Never"`を指定しても、同じプログラムが2回起動されることもありますので注意してください。

`.spec.parallelism`と`.spec.completions`を両方とも2以上指定した場合、複数のPodが同時に実行される可能性があります。そのため、Podは並行処理を行えるようにする必要があります。

### Pod失敗のバックオフポリシー

設定の論理エラーなどにより、Jobが数回再試行しても失敗するとそのまま終了状態に進んでほしい場合があります。`.spec.backoffLimit`を設定すると、失敗したと判断するまでの再試行回数を指定できます。バックオフ制限はデフォルトで6に設定されています。Jobに属する失敗したPodはJobコントローラーにより再作成され、バックオフ遅延は指数関数的に増加し（10秒、20秒、40秒…）、最大6分まで増加します。Jobに属するPodが削除された場合、または一つのPodが成功した時に、同じJobに属する他のPodがその時点で失敗していない場合に、バックオフ数はリセットされます。

{{< note >}}
`restartPolicy = "OnFailure"`が設定されたJobはバックオフ制限に達すると、属するPodは全部終了されるので注意してください。しかし、Jobの実行ファイルのデバッグ作業がこれにより難しくなる可能性はありますので、失敗したJobからの出力が不注意で失われないように、Jobのデバッグ作業やロギングシステムを使用する場合、`restartPolicy = "Never"`と設定するほうがオススメです。
{{< /note >}}

## Job termination and cleanup

When a Job completes, no more Pods are created, but the Pods are [usually](#pod-backoff-failure-policy) not deleted either.
Keeping them around
allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status.  It is up to the user to delete
old jobs after noting their status.  Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`). When you delete the job using `kubectl`, all the pods it created are deleted too.

By default, a Job will run uninterrupted unless a Pod fails (`restartPolicy=Never`) or a Container exits in error (`restartPolicy=OnFailure`), at which point the Job defers to the
`.spec.backoffLimit` described above. Once `.spec.backoffLimit` has been reached the Job will be marked as failed and any running Pods will be terminated.

Another way to terminate a Job is by setting an active deadline.
Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds.
The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status will become `type: Failed` with `reason: DeadlineExceeded`.

Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`. Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.

Example:

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

Note that both the Job spec and the [Pod template spec](/docs/concepts/workloads/pods/init-containers/#detailed-behavior) within the Job have an `activeDeadlineSeconds` field. Ensure that you set this field at the proper level.

Keep in mind that the `restartPolicy` applies to the Pod, and not to the Job itself: there is no automatic Job restart once the Job status is `type: Failed`.
That is, the Job termination mechanisms activated with `.spec.activeDeadlineSeconds` and `.spec.backoffLimit` result in a permanent Job failure that requires manual intervention to resolve.

## Clean up finished jobs automatically

Finished Jobs are usually no longer needed in the system. Keeping them around in
the system will put pressure on the API server. If the Jobs are managed directly
by a higher level controller, such as
[CronJobs](/docs/concepts/workloads/controllers/cron-jobs/), the Jobs can be
cleaned up by CronJobs based on the specified capacity-based cleanup policy.

### TTL mechanism for finished Jobs

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Another way to clean up finished Jobs (either `Complete` or `Failed`)
automatically is to use a TTL mechanism provided by a
[TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) for
finished resources, by specifying the `.spec.ttlSecondsAfterFinished` field of
the Job.

When the TTL controller cleans up the Job, it will delete the Job cascadingly,
i.e. delete its dependent objects, such as Pods, together with the Job. Note
that when the Job is deleted, its lifecycle guarantees, such as finalizers, will
be honored.

For example:

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

The Job `pi-with-ttl` will be eligible to be automatically deleted, `100`
seconds after it finishes.

If the field is set to `0`, the Job will be eligible to be automatically deleted
immediately after it finishes. If the field is unset, this Job won't be cleaned
up by the TTL controller after it finishes.

{{< note >}}
It is recommended to set `ttlSecondsAfterFinished` field because unmanaged jobs
(Jobs that you created directly, and not indirectly through other workload APIs
such as CronJob) have a default deletion
policy of `orphanDependents` causing Pods created by an unmanaged Job to be left around
after that Job is fully deleted.
Even though the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} eventually
[garbage collects](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
the Pods from a deleted Job after they either fail or complete, sometimes those
lingering pods may cause cluster performance degradation or in worst case cause the
cluster to go offline due to this degradation.

You can use [LimitRanges](/docs/concepts/policy/limit-range/) and
[ResourceQuotas](/docs/concepts/policy/resource-quotas/) to place a
cap on the amount of resources that a particular namespace can
consume.
{{< /note >}}


## Jobパターン  {#job-patterns}

The Job object can be used to support reliable parallel execution of Pods.  The Job object is not
designed to support closely-communicating parallel processes, as commonly found in scientific
computing.  It does support parallel processing of a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded, ranges of keys in a
NoSQL database to scan, and so on.

In a complex system, there may be multiple different sets of work items.  Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.

There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:

- One Job object for each work item, vs. a single Job object for all work items.  The latter is
  better for large numbers of work items.  The former creates some overhead for the user and for the
  system to manage large numbers of Job objects.
- Number of pods created equals number of work items, vs. each Pod can process multiple work items.
  The former typically requires less modification to existing code and containers.  The latter
  is better for large numbers of work items, for similar reasons to the previous bullet.
- Several approaches use a work queue.  This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.


The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.

|                  Pattern                  | Single Job object | Fewer pods than work items? | Use app unmodified? |
| ----------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|
| [Queue with Pod Per Work Item]            |         ✓         |                             |      sometimes      |
| [Queue with Variable Pod Count]           |         ✓         |             ✓               |                     |
| [Indexed Job with Static Work Assignment] |         ✓         |                             |          ✓          | 
| [Job Template Expansion]                  |                   |                             |          ✓          |

When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).  This means that
all pods for a task will have the same command line and the same
image, the same volumes, and (almost) the same environment variables.  These patterns
are different ways to arrange for pods to work on different things.

This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.

|             Pattern                       | `.spec.completions` |  `.spec.parallelism` |
| ----------------------------------------- |:-------------------:|:--------------------:|
| [Queue with Pod Per Work Item]            |          W          |        any           |
| [Queue with Variable Pod Count]           |         null        |        any           |
| [Indexed Job with Static Work Assignment] |          W          |        any           |
| [Job Template Expansion]                  |          1          |     should be 1      |

[Queue with Pod Per Work Item]: /docs/tasks/job/coarse-parallel-processing-work-queue/
[Queue with Variable Pod Count]: /docs/tasks/job/fine-parallel-processing-work-queue/
[Indexed Job with Static Work Assignment]: /docs/tasks/job/indexed-parallel-processing-static/
[Job Template Expansion]: /docs/tasks/job/parallel-processing-expansion/

## Advanced usage

### Suspending a Job

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

When a Job is created, the Job controller will immediately begin creating Pods
to satisfy the Job's requirements and will continue to do so until the Job is
complete. However, you may want to temporarily suspend a Job's execution and
resume it later, or start Jobs in suspended state and have a custom controller
decide later when to start them.

To suspend a Job, you can update the `.spec.suspend` field of
the Job to true; later, when you want to resume it again, update it to false.
Creating a Job with `.spec.suspend` set to true will create it in the suspended
state.

When a Job is resumed from suspension, its `.status.startTime` field will be
reset to the current time. This means that the `.spec.activeDeadlineSeconds`
timer will be stopped and reset when a Job is suspended and resumed.

Remember that suspending a Job will delete all active Pods. When the Job is
suspended, your [Pods will be terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
with a SIGTERM signal. The Pod's graceful termination period will be honored and
your Pod must handle this signal in this period. This may involve saving
progress for later or undoing changes. Pods terminated this way will not count
towards the Job's `completions` count.

An example Job definition in the suspended state can be like so:

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

The Job's status can be used to determine if a Job is suspended or has been
suspended in the past:

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

The Job condition of type "Suspended" with status "True" means the Job is
suspended; the `lastTransitionTime` field can be used to determine how long the
Job has been suspended for. If the status of that condition is "False", then the
Job was previously suspended and is now running. If such a condition does not
exist in the Job's status, the Job has never been stopped.

Events are also created when the Job is suspended and resumed:

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

The last four events, particularly the "Suspended" and "Resumed" events, are
directly a result of toggling the `.spec.suspend` field. In the time between
these two events, we see that no Pods were created, but Pod creation restarted
as soon as the Job was resumed.

### Mutable Scheduling Directives

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

### Specifying your own Pod selector　｛#specifying-your-own-pod-selector｝

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

### Job tracking with finalizers

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

## Alternatives

### Bare Pods

When the node that a Pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new Pods to replace terminated ones.
For this reason, we recommend that you use a Job rather than a bare Pod, even if your application
requires only a single Pod.

### Replication Controller

Jobs are complementary to [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/).
A Replication Controller manages Pods which are not expected to terminate (e.g. web servers), and a Job
manages Pods that are expected to terminate (e.g. batch tasks).

As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate
for pods with `RestartPolicy` equal to `OnFailure` or `Never`.
(Note: If `RestartPolicy` is not set, the default value is `Always`.)

### Single Job starts controller Pod

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
