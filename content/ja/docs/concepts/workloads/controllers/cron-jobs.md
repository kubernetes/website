---
title: CronJob
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

_CronJob_ は時刻ベースのスケジュールによって[Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)を作成します。

_CronJob_ オブジェクトとは _crontab_ (cron table)ファイルでみられる一行のようなものです。
[Cron](https://ja.wikipedia.org/wiki/Cron)形式で記述された指定のスケジュールの基づき、定期的にジョブが実行されます。

{{< note >}}
すべての**CronJob**`スケジュール`: 時刻はジョブが開始されたマスタータイムゾーンに基づいています。
{{< /note >}}

cronジョブを作成し、実行するインストラクション、または、cronジョブ仕様ファイルのサンプルについては、[Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs)をご覧ください。

{{% /capture %}}

{{% capture body %}}

## CronJobの制限

cronジョブは一度のスケジュール実行につき、 _おおよそ_ 1つのジョブオブジェクトを作成します。ここで _おおよそ_ と言っているのは、ある状況下では2つのジョブが作成される、もしくは1つも作成されない場合があるためです。通常、このようなことが起こらないようになっていますが、完全に防ぐことはできません。したがって、ジョブは _冪等_ であるべきです。

`startingDeadlineSeconds`が大きな値、もしくは設定されていない(デフォルト)、そして、`concurrencyPolicy`を`Allow`に設定している場合には、少なくとも一度、ジョブが実行されることを保証します。

最後にスケジュールされた時刻から現在までの間に、CronJobコントローラーはどれだけスケジュールが間に合わなかったのかをCronJobごとにチェックします。もし、100回以上スケジュールが失敗していると、ジョブは開始されずに、ログにエラーが記録されます。

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

`startingDeadlineSeconds`フィールドが設定されると(`nil`ではない)、最後に実行された時刻から現在までではなく、`startingDeadlineSeconds`の値から現在までで、どれだけジョブを逃したのかをコントローラーが数えます。 `startingDeadlineSeconds`が`200`の場合、過去200秒間にジョブが失敗した回数を記録します。

スケジュールされた時間にCronJobが作成できないと、失敗したとみなされます。たとえば、`concurrencyPolicy`が`Forbid`に設定されている場合、前回のスケジュールがまだ実行中にCronJobをスケジュールしようとすると、CronJobは作成されません。

例として、CronJobが`08:30:00`を開始時刻として1分ごとに新しいJobをスケジュールするように設定され、`startingDeadlineSeconds`フィールドが設定されていない場合を想定します。`startingDeadlineSeconds`のデフォルト値は`100`秒です。CronJobコントローラーが`08:29:00` から`10:21:00`の間にダウンしていた場合、スケジューリングを逃したジョブの数が100を超えているため、ジョブは開始されません。

このコンセプトを更に掘り下げるために、CronJobが`08:30:00`から1分ごとに新しいJobを作成し、`startingDeadlineSeconds`が200秒に設定されている場合を想定します。CronJobコントローラーが前回の例と同じ期間(`08:29:00` から`10:21:00`まで)にダウンしている場合でも、10:22:00時点でJobはまだ動作しています。このようなことは、過去200秒間(言い換えると、3回の失敗)に何回スケジュールが間に合わなかったをコントローラーが確認するときに発生します。これは最後にスケジュールされた時間から今までのものではありません。

CronJobはスケジュールに一致するJobの作成にのみ関与するのに対して、JobはJobが示すPod管理を担います。

{{% /capture %}}
