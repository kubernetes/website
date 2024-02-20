---
title: CronJobを使用して自動化タスクを実行する
min-kubernetes-server-version: v1.21
content_type: task
weight: 10
---

<!-- overview -->

CronJobは、Kubernetes v1.21で一般利用(GA)に昇格しました。古いバージョンのKubernetesを使用している場合、正確な情報を参照できるように、使用しているバージョンのKubernetesのドキュメントを参照してください。古いKubernetesのバージョンでは、`batch/v1` CronJob APIはサポートされていません。

{{< glossary_tooltip text="CronJob" term_id="cronjob" >}}を使用すると、{{< glossary_tooltip text="Job" term_id="job" >}}を時間ベースのスケジュールで実行できるようになります。この自動化されたJobは、LinuxまたはUNIXシステム上の[Cron](https://ja.wikipedia.org/wiki/Cron)のように実行されます。

CronJobは、バックアップやメールの送信など、定期的なタスクや繰り返しのタスクを作成する時に便利です。CronJobはそれぞれのタスクを、たとえばアクティビティが少ない期間など、特定の時間にスケジューリングすることもできます。

CronJobには制限と特性があります。たとえば、特定の状況下では、1つのCronJobが複数のJobを作成する可能性があるため、Jobは冪等性を持つようにしなければいけません。

制限に関する詳しい情報については、[CronJob](/ja/docs/concepts/workloads/controllers/cron-jobs/)を参照してください。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## CronJobを作成する

CronJobには設定ファイルが必要です。次の例のCronJobの`.spec`は、現在の時刻とhelloというメッセージを1分ごとに表示します。

{{% codenew file="application/job/cronjob.yaml" %}}

次のコマンドで例のCronJobを実行します。

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```

出力は次のようになります。

```
cronjob.batch/hello created
```

CronJobを作成したら、次のコマンドで状態を取得します。

```shell
kubectl get cronjob hello
```

出力は次のようになります。

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

コマンドの結果からわかるように、CronJobはまだスケジュールされておらず、まだ何のJobも実行していません。約1分以内にJobが作成されるのを見てみましょう。

```shell
kubectl get jobs --watch
```

出力は次のようになります。

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

"hello"CronJobによってスケジュールされたJobが1つ実行中になっていることがわかります。Jobを見るのをやめて、再度CronJobを表示して、Jobがスケジュールされたことを確認してみます。

```shell
kubectl get cronjob hello
```

出力は次のようになります。

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

CronJob`hello`が、`LAST SCHEDULE`で指定された時間にJobを正しくスケジュールしたことが確認できるはずです。現在、activeなJobの数は0です。つまり、Jobは完了または失敗したことがわかります。

それでは、最後にスケジュールされたJobの作成と、Podの1つの標準出力を表示してみましょう。

{{< note >}}
Jobの名前とPodの名前は異なります。
{{< /note >}}

```shell
# "hello-4111706356" の部分は、あなたのシステム上のJobの名前に置き換えてください。
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```

Podのログを表示します。

```shell
kubectl logs $pods
```

出力は次のようになります。

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## CronJobの削除

CronJobが必要なくなったときは、`kubectl delete cronjob <cronjob name>`で削除します。

```shell
kubectl delete cronjob hello
```

CronJobを削除すると、すべてのJobと、そのJobが作成したPodが削除され、追加のJobの作成が停止されます。Jobの削除について詳しく知りたい場合は、[ガベージコレクション](/ja/docs/concepts/workloads/controllers/garbage-collection/)を読んでください。

## CronJobのspecを書く {#writing-a-cron-job-spec}

すべてのKubernetesの設定と同じように、CronJobにも`apiVersion`、`kind`、`metadata`のフィールドが必要です。設定ファイルの扱い方についての一般的な情報については、[アプリケーションのデプロイ](/ja/docs/tasks/run-application/run-stateless-application-deployment/)と[kubectlを使用してリソースを管理する](/ja/docs/concepts/overview/working-with-objects/object-management/)を読んでください。

CronJobの設定には、[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

{{< note >}}
CronJobの特に`spec`へのすべての修正は、それ以降の実行にのみ適用されます。
{{< /note >}}

### Schedule

`.spec.schedule`は、`.spec`には必須のフィールドです。`0 * * * *`や`@hourly`などの[Cron](https://ja.wikipedia.org/wiki/Cron)形式の文字列を取り、Jobの作成と実行のスケジュール時間を指定します。

フォーマットにはVixie cronのステップ値(step value)も指定できます。[FreeBSDのマニュアル](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)では次のように説明されています。

> ステップ値は範囲指定と組み合わせて使用できます。範囲の後ろに`/<number>`を付けると、範囲全体で指定したnumberの値ごとにスキップすることを意味します。たとえば、`0-23/2`をhoursフィールドに指定すると、2時間毎にコマンド実行を指定することになります(V7標準では代わりに`0,2,4,6,8,10,12,14,16,18,20,22`と指定する必要があります)。ステップはアスタリスクの後ろにつけることもできます。そのため、「2時間毎に実行」したい場合は、単純に`*/2`と指定できます。

{{< note >}}
スケジュール内の疑問符`?`はアスタリスク`*`と同じ意味を持ちます。つまり、与えられたフィールドには任意の値が使えるという意味になります。
{{< /note >}}

### Job Template

`.spec.jobTemplate`はJobのテンプレートであり、必須です。[Job](/docs/concepts/workloads/controllers/job/)と完全に同一のスキーマを持ちますが、フィールドがネストされている点と、`apiVersion`と`kind`が存在しない点だけが異なります。Jobの`.spec`を書くための情報については、[JobのSpecを書く](/docs/concepts/workloads/controllers/job/#writing-a-job-spec)を参照してください。

### Starting Deadline

`.spec.startingDeadlineSeconds`フィールドはオプションです。何かの理由でスケジュールに間に合わなかった場合に適用される、Jobの開始のデッドライン(締め切り)を秒数で指定します。デッドラインを過ぎると、CronJobはJobを開始しません。この場合にデッドラインに間に合わなかったJobは、失敗したJobとしてカウントされます。もしこのフィールドが指定されなかった場合、Jobはデッドラインを持ちません。

`.spec.startingDeadlineSeconds`フィールドがnull以外に設定された場合、CronJobコントローラーはJobの作成が期待される時間と現在時刻との間の時間を計測します。もしその差が制限よりも大きかった場合、その実行はスキップされます。

たとえば、この値が`200`に設定された場合、実際のスケジュールの最大200秒後までに作成されるJobだけが許可されます。

### Concurrency Policy

`.spec.concurrencyPolicy`フィールドもオプションです。このフィールドは、このCronJobで作成されたJobの並列実行をどのように扱うかを指定します。specには以下のconcurrency policyのいずれかを指定します。

* `Allow` (デフォルト): CronJobがJobを並列に実行することを許可します。
* `Forbid`: CronJobの並列実行を禁止します。もし新しいJobの実行時に過去のJobがまだ完了していなかった場合、CronJobは新しいJobの実行をスキップします。
* `Replace`: もし新しいJobの実行の時間になっても過去のJobの実行が完了していなかった場合、CronJobは現在の実行中のJobを新しいJobで置換します。

concurrency policyは、同じCronJobが作成したJobにのみ適用されます。もし複数のCronJobがある場合、それぞれのJobの並列実行は常に許可されます。

### Suspend

`.spec.suspend`フィールドもオプションです。このフィールドを`true`に設定すると、すべての後続の実行がサスペンド(一時停止)されます。この設定はすでに実行開始したJobには適用されません。デフォルトはfalseです。

{{< caution >}}
スケジュールされた時間中にサスペンドされた実行は、見逃されたJob(missed job)としてカウントされます。[starting deadline](#starting-deadline)が設定されていない既存のCronJob`.spec.suspend`が`true`から`false`に変更されると、見逃されたJobは即座にスケジュールされます。
{{< /caution >}}

### Job History Limit

`.spec.successfulJobsHistoryLimit`と`.spec.failedJobsHistoryLimit`フィールドはオプションです。これらのフィールドには、完了したJobと失敗したJobをいくつ保持するかを指定します。デフォルトでは、それぞれ3と1に設定されます。リミットを`0`に設定すると、対応する種類のJobを実行完了後に何も保持しなくなります。
