---
title: "ワークロード"
weight: 50
description: >
  Kubernetesにおけるデプロイ可能な最小のオブジェクトであるPodと、高レベルな抽象化がPodの実行を助けることを理解します。
no_list: true
---

{{< glossary_definition term_id="workload" length="short" >}}
ワークロードが1つのコンポーネントからなる場合でも、複数のコンポーネントが協調して動作する場合でも、Kubernetesではそれらは[Pod](/ja/docs/concepts/workloads/pods)の集合として実行されます。Kubernetesでは、Podはクラスター上で実行中の{{< glossary_tooltip text="コンテナ" term_id="container" >}}の集合として表されます。

Podには定義されたライフサイクルがあります。たとえば、一度Podがクラスター上で実行中になると、そのPodが実行中の{{< glossary_tooltip text="ノード" term_id="node" >}}上で深刻な障害が起こったとき、そのノード上のすべてのPodは停止してしまうことになります。Kubernetesではそのようなレベルの障害を最終的なものとして扱うため、たとえノードが後で復元したとしても、ユーザーは新しいPodを作成し直す必要があります。

しかし、生活をかなり楽にするためには、それぞれのPodを直接管理する必要はありません。_ワークロードリソース_ を利用すれば、あなたの代わりにPodの集合の管理を行ってもらえます。これらのリソースはあなたが指定した状態に一致するように{{< glossary_tooltip term_id="controller" text="コントローラー" >}}を設定し、正しい種類のPodが正しい数だけ実行中になることを保証してくれます。

ワークロードリソースには、次のような種類があります。

* [Deployment](/ja/docs/concepts/workloads/controllers/deployment/)と[ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)(レガシーなリソース{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}を置き換えるものです)
* [StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/ja/docs/concepts/workloads/controllers/daemonset/)(ストレージドライバやネットワークプラグインなど、ノードローカルな機能を提供するためのPodを実行するために使われます)
* [Job](/docs/concepts/workloads/controllers/job/)と[CronJob](/ja/docs/concepts/workloads/controllers/cron-jobs/)(実行後に完了するようなタスクのために使われます)

多少関連のある2種類の補助的な概念もあります。
* [ガベージコレクション](/ja/docs/concepts/workloads/controllers/garbage-collection/)は、オブジェクトが _所有するリソース_ が削除された後に、そのオブジェクトをクラスターからクリーンアップします。
* [終了したリソースのためのTTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)は、Jobの完了後、定義した時間が経過した後にJobを削除します。

## {{% heading "whatsnext" %}}

各リソースについて読む以外にも、以下のページでそれぞれのワークロードに関連する特定のタスクについて学ぶことができます。

* [Deploymentを使用してステートレスアプリケーションを実行する](/ja/docs/tasks/run-application/run-stateless-application-deployment/)
* [単一レプリカ](/ja/docs/tasks/run-application/run-single-instance-stateful-application/)または[レプリカセット](/ja/docs/tasks/run-application/run-replicated-stateful-application/)のいずれかとしてステートフルなアプリケーションを実行する
* [CronJobを使用して自動タスクを実行する](/ja/docs/tasks/job/automated-tasks-with-cron-jobs/)

アプリケーションが実行できるようになったら、インターネット上で公開したくなるかもしれません。その場合には、[Service](/ja/docs/concepts/services-networking/service/)として公開したり、ウェブアプリケーションだけの場合、[Ingress](/ja/docs/concepts/services-networking/ingress)を使用することができます。

コードを設定から分離するKubernetesのしくみについて学ぶには、[設定](/ja/docs/concepts/configuration/)を読んでください。
