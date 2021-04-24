---
title: CronJob
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.8" state="beta" >}}

_CronJob_ は繰り返しのスケジュールによって{{< glossary_tooltip term_id="job" text="Job" >}}を作成します。

_CronJob_ オブジェクトとは _crontab_ (cron table)ファイルでみられる一行のようなものです。
[Cron](https://ja.wikipedia.org/wiki/Cron)形式で記述された指定のスケジュールの基づき、定期的にジョブが実行されます。

{{< caution >}}
すべての**CronJob**`スケジュール`: 時刻はジョブが開始された{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}のタイムゾーンに基づいています。

コントロールプレーンがkube-controller-managerをPodもしくは素のコンテナで実行している場合、CronJobコントローラーのタイムゾーンとして、kube-controller-managerコンテナに設定されたタイムゾーンを使用します。
{{< /caution >}}

CronJobリソースのためのマニフェストを作成する場合、その名前が有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)か確認してください。
名前は52文字を超えることはできません。これはCronJobコントローラーが自動的に、与えられたジョブ名に11文字を追加し、ジョブ名の長さは最大で63文字以内という制約があるためです。




<!-- body -->

## CronJob

CronJobは、バックアップの実行やメール送信のような定期的であったり頻発するタスクの作成に役立ちます。
CronJobは、クラスターがアイドル状態になりそうなときにJobをスケジューリングするなど、特定の時間に個々のタスクをスケジュールすることもできます。

### 例

このCronJobマニフェスト例は、毎分ごとに現在の時刻とhelloメッセージを表示します。

{{< codenew file="application/job/cronjob.yaml" >}}

([Running Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)ではこの例をより詳しく説明しています。).

## CronJobの制限 {#cron-job-limitations}

cronジョブは一度のスケジュール実行につき、 _おおよそ_ 1つのジョブオブジェクトを作成します。ここで _おおよそ_ と言っているのは、ある状況下では2つのジョブが作成される、もしくは1つも作成されない場合があるためです。通常、このようなことが起こらないようになっていますが、完全に防ぐことはできません。したがって、ジョブは _冪等_ であるべきです。

`startingDeadlineSeconds`が大きな値、もしくは設定されていない(デフォルト)、そして、`concurrencyPolicy`を`Allow`に設定している場合には、少なくとも一度、ジョブが実行されることを保証します。

最後にスケジュールされた時刻から現在までの間に、CronJob{{< glossary_tooltip term_id="controller" text="コントローラー">}}はどれだけスケジュールが間に合わなかったのかをCronJobごとにチェックします。もし、100回以上スケジュールが失敗していると、ジョブは開始されずに、ログにエラーが記録されます。

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

`startingDeadlineSeconds`フィールドが設定されると(`nil`ではない)、最後に実行された時刻から現在までではなく、`startingDeadlineSeconds`の値から現在までで、どれだけジョブを逃したのかをコントローラーが数えます。 `startingDeadlineSeconds`が`200`の場合、過去200秒間にジョブが失敗した回数を記録します。

スケジュールされた時間にCronJobが作成できないと、失敗したとみなされます。たとえば、`concurrencyPolicy`が`Forbid`に設定されている場合、前回のスケジュールがまだ実行中にCronJobをスケジュールしようとすると、CronJobは作成されません。

例として、CronJobが`08:30:00`を開始時刻として1分ごとに新しいJobをスケジュールするように設定され、`startingDeadlineSeconds`フィールドが設定されていない場合を想定します。CronJobコントローラーが`08:29:00` から`10:21:00`の間にダウンしていた場合、スケジューリングを逃したジョブの数が100を超えているため、ジョブは開始されません。

このコンセプトをさらに掘り下げるために、CronJobが`08:30:00`から1分ごとに新しいJobを作成し、`startingDeadlineSeconds`が200秒に設定されている場合を想定します。CronJobコントローラーが前回の例と同じ期間(`08:29:00` から`10:21:00`まで)にダウンしている場合でも、10:22:00時点でJobはまだ動作しています。このようなことは、過去200秒間(言い換えると、3回の失敗)に何回スケジュールが間に合わなかったをコントローラーが確認するときに発生します。これは最後にスケジュールされた時間から今までのものではありません。

CronJobはスケジュールに一致するJobの作成にのみ関与するのに対して、JobはJobが示すPod管理を担います。

## {{% heading "whatsnext" %}}

[Cron表現形式](https://en.wikipedia.org/wiki/Cron)では、CronJobの`schedule`フィールドのフォーマットを説明しています。

cronジョブの作成や動作の説明、CronJobマニフェストの例については、[Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs)を見てください。
