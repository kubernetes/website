---
title: "ワークロード管理"
weight: 20
simple_list: true
---

Kubernetesは、{{< glossary_tooltip text="ワークロード" term_id="workload" >}}とそのワークロードのコンポーネントを宣言的に管理するための、いくつかの組み込みAPIを提供しています。

最終的に、アプリケーションは{{< glossary_tooltip term_id="Pod" text="Pod" >}}内のコンテナとして実行されますが、個々のPodを管理するのは多大な労力を要します。
たとえば、Podが失敗した場合、それを置き換える新しいPodを実行したくなるでしょう。
Kubernetesはそれを代わりに行うことができます。

Kubernetes APIを使用してPodよりも高い抽象度を表すワークロード{{< glossary_tooltip text="オブジェクト" term_id="object" >}}を作成すると、定義したワークロードオブジェクトの仕様に基づいて、Kubernetesの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}がPodオブジェクトを自動的に管理します。

ワークロードを管理するための組み込みAPIは以下のとおりです:

[Deployment](/docs/concepts/workloads/controllers/deployment/)(および間接的に[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/))は、クラスター上でアプリケーションを実行する最も一般的な方法です。
Deploymentは、Deployment内の任意のPodが交換可能で必要に応じて置き換え可能な、ステートレスなアプリケーションワークロードをクラスター上で管理するのに適しています。
(Deploymentは、レガシーの{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} APIを置き換えるものです)。

[StatefulSet](/docs/concepts/workloads/controllers/statefulset/)を使用すると、すべて同じアプリケーションコードを実行する1つ以上のPodを、固有のアイデンティティを持つ前提で管理できます。
これは、Podが交換可能であることを前提とするDeploymentとは異なります。
StatefulSetの最も一般的な用途は、そのPodと永続的なストレージとの紐付けを実現することです。
たとえば、各Podを[PersistentVolume](/docs/concepts/storage/persistent-volumes/)に関連付けるStatefulSetを実行できます。
StatefulSet内のPodの1つが失敗した場合、Kubernetesは同じPersistentVolumeに接続された置き換えのPodを作成します。

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/)は、特定の{{< glossary_tooltip text="ノード" term_id="node" >}}にローカルな機能を提供するPodを定義します。
たとえば、そのノード上のコンテナがストレージシステムにアクセスできるようにするドライバーがそれにあたります。
DaemonSetは、ドライバーやその他のノードレベルのサービスを、それが必要なノード上で動作させなければならない場合に使用します。
DaemonSet内の各Podは、古典的なUnix/POSIXサーバー上のシステムデーモンに似た役割を果たします。
DaemonSetは、ノードが[クラスターネットワーク](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)にアクセスできるようにするプラグインのようにクラスターの動作に不可欠な場合もあれば、ノードの管理を支援する場合や、実行中のコンテナプラットフォームを強化するそれほど重要でない機能を提供する場合もあります。
DaemonSet(およびそのPod)は、クラスター内のすべてのノードで実行することも、サブセットでのみ実行することもできます(たとえば、GPUがインストールされているノードにのみGPUアクセラレータードライバーをインストールするなど)。

[Job](/docs/concepts/workloads/controllers/job/)や[CronJob](/docs/concepts/workloads/controllers/cron-jobs/)を使用して、完了まで実行されてから停止するタスクを定義できます。
Jobは1回限りのタスクを表し、CronJobはスケジュールに従って繰り返し実行されます。

このセクションのその他のトピック:
<!-- relies on simple_list: true in the front matter -->
