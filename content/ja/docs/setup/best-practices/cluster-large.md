---
title: 大規模クラスターに関する考慮事項
weight: 20
---

<!--
A cluster is a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (physical
or virtual machines) running Kubernetes agents, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} supports clusters with up to 5000 nodes. More specifically,
Kubernetes is designed to accommodate configurations that meet *all* of the following criteria:

* No more than 110 pods per node
* No more than 5000 nodes
* No more than 150000 total pods
* No more than 300000 total containers

You can scale your cluster by adding or removing nodes. The way you do this depends
on how your cluster is deployed.
-->

クラスターは Kubernetes エージェントを実行する {{< glossary_tooltip text="ノード" term_id="node" >}} （物理マシンまたは仮想マシン）のセットであり、 {{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}} によって制御されます。Kubernetes の{{< param "version" >}}では、最大 5000 ノードのクラスターをサポートしています。具体的には、次の _全て_ の基準を満たす構成をサポートします。

- ノードあたりのポッド数 110 以下
- ノード数 5000 以下
- 合計ポッド数 150000 以下
- 合計コンテナ数 300000 以下

ノードを追加または削除することで、クラスターをスケーリングできます。 これを行う方法はクラスタのデプロイ方法によって異なります

<!--
## Cloud provider resource quotas {#quota-issues}

To avoid running into cloud provider quota issues, when creating a cluster with many nodes,
consider:
* Requesting a quota increase for cloud resources such as:
    * Computer instances
    * CPUs
    * Storage volumes
    * In-use IP addresses
    * Packet filtering rule sets
    * Number of load balancers
    * Network subnets
    * Log streams
* Gating the cluster scaling actions to bring up new nodes in batches, with a pause
  between batches, because some cloud providers rate limit the creation of new instances.
-->

## クラウドプロバイダーのリソース割り当て {#quota-issues}

多数のノードでクラスターを構築する際に、クラウドプロバイダーのクォータの問題を避けるため、次のことを考慮してください。

- 次のようなクラウドリソースの割り当てを増やすこと
  - Computer instances
  - CPUs
  - Storage volumes
  - In-use IP addresses
  - Packet filtering rule sets
  - Number of load balancers
  - Network subnets
  - Log streams
- クラウドプロバイダーの中には新しいインスタンスの作成にレート制限を設けているため、新たなノードの起動は間隔を空けて実行するようにクラスターのスケーリング処理を制御すること

<!--
## Control plane components

For a large cluster, you need a control plane with sufficient compute and other
resources.

Typically you would run one or two control plane instances per failure zone,
scaling those instances vertically first and then scaling horizontally after reaching
the point of falling returns to (vertical) scale.

You should run at least one instance per failure zone to provide fault-tolerance. Kubernetes
nodes do not automatically steer traffic towards control-plane endpoints that are in the
same failure zone; however, your cloud provider might have its own mechanisms to do this.

For example, using a managed load balancer, you configure the load balancer to send traffic
that originates from the kubelet and Pods in failure zone _A_, and direct that traffic only
to the control plane hosts that are also in zone _A_. If a single control-plane host or
endpoint failure zone _A_ goes offline, that means that all the control-plane traffic for
nodes in zone _A_ is now being sent between zones. Running multiple control plane hosts in
each zone makes that outcome less likely.
-->

## コントロールプレーンコンポーネント

大規模なクラスターの場合、十分なコンピューティングおよびその他のリソースを備えたコントロールプレーンが必要です。

通常、可用性ゾーンごとに 1 つまたは 2 つのコントロールプレーンインスタンスを実行し、最初にそれらのインスタンスを垂直方向にスケーリングし、下降点に達した後に水平方向にスケーリングして（垂直）スケールに戻ります。

フォールトトレランスを提供するには、可用性ゾーンごとに少なくとも 1 つのインスタンスを実行する必要があります。 Kubernetes ノードは、同じ可用性ゾーンにあるコントロールプレーンエンドポイントに向けてトラフィックを自動的には誘導しません。ただし、クラウドプロバイダーには、これを行うための独自のメカニズムがある場合があります。

たとえば、マネージドロードバランサーを使用して、可用性ゾーン*A*の kubelet と Pod から発信されたトラフィックを送信し、そのトラフィックを同じゾーン*A*にあるコントロールプレーンホストにのみ送信するようにロードバランサーを構成します。もし、可用性ゾーン*A*において単一のコントロールプレーンホストまたはエンドポイントがオフラインになった場合、ゾーン*A*内のノードのすべてのコントロールプレーントラフィックがゾーン間で送信されていることを意味します。各ゾーンで複数のコントロールプレーンホストを実行することで、それらが発生する可能性が低くなります。

<!--
### etcd storage

To improve performance of large clusters, you can store Event objects in a separate
dedicated etcd instance.

When creating a cluster, you can (using custom tooling):

* start and configure additional etcd instance
* configure the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} to use it for storing events

See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) and
[Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
for details on configuring and managing etcd for a large cluster.
-->

### Etcd のストレージ

大規模クラスターのパフォーマンス向上のため、イベントは別の専用 etcd インスタンスに保存します。

クラスター作成時に、（カスタムツールを用いて）以下を実施します。

- 追加の etcd インスタンスの起動と設定
- {{< glossary_tooltip term_id="kube-apiserver" text="APIサーバ" >}} に上記インスタンスをイベント保存で利用するように設定

大規模クラスターのための etcd の設定と管理については、[Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) および
[kubeadm を使用した高可用性 etcd クラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)を参照してください。

<!--
## Addon resources

Kubernetes [resource limits](/docs/concepts/configuration/manage-resources-containers/)
help to minimize the impact of memory leaks and other ways that pods and containers can
impact on other components. These resource limits apply to
{{< glossary_tooltip text="addon" term_id="addons" >}} resources just as they apply to application workloads.

For example, you can set CPU and memory limits for a logging component:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Addons' default limits are typically based on data collected from experience running
each addon on small or medium Kubernetes clusters. When running on large
clusters, addons often consume more of some resources than their default limits.
If a large cluster is deployed without adjusting these values, the addon(s)
may continuously get killed because they keep hitting the memory limit.
Alternatively, the addon may run but with poor performance due to CPU time
slice restrictions.

To avoid running into cluster addon resource issues, when creating a cluster with
many nodes, consider the following:

* Some addons scale vertically - there is one replica of the addon for the cluster
  or serving a whole failure zone. For these addons, increase requests and limits
  as you scale out your cluster.
* Many addons scale horizontally - you add capacity by running more pods - but with
  a very large cluster you may also need to raise CPU or memory limits slightly.
  The VerticalPodAutoscaler can run in _recommender_ mode to provide suggested
  figures for requests and limits.
* Some addons run as one copy per node, controlled by a {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: for example, a node-level log aggregator. Similar to
  the case with horizontally-scaled addons, you may also need to raise CPU or memory
  limits slightly.
 -->

## アドオンのリソース

Kubernetes の[リソース制限](/ja/docs/concepts/configuration/manage-resources-containers/#podとコンテナのリソース要求と制限)はメモリリークによるク影響や、それとは別にポッドやコンテナが他のコンポーネントに与える影響を最小化します。これらのリソース制限は アプリケーションワークロードに適応されるのと同様に、{{< glossary_tooltip text="アドオン" term_id="addons" >}}リソースにも適応されます。

例えば、以下の様にロギングコンポーネントに CPU とメモリの limits を設定できます。

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

アドオンのデフォルトの limits は、通常、小規模から中規模の Kubernetes クラスタ上で実行されたデータに基づいています。大規模なクラスターで実行する際には、アドオンはそれらデフォルトの limits よりも多くのリソースを消費することがあります。これらの値を調整せずに大規模クラスターがデプロイされた場合、アドオンはメモリの limits に達し続けることにより、強制終了され続ける可能性があります。または、アドオンは実行されますが、CPU の limits によりパフォーマンスが低下する場合があります。

多数のノードを用いた大規模クラスター構築の際にアドオンのリソース問題が発生しないようにするためには、次のことを考慮してください。

- クラスターまたは可用性ゾーン全体にサービスを提供するアドオンのレプリカが 1 つあるような、一部のアドオンは垂直方向にスケーリングします。これらのアドオンの場合、クラスターをスケールアウトするときに request と limits を増やします。
- 多くのアドオンはより多くのポッドを稼働させることで水平にスケールしますが、大規模クラスターでは CPU またはメモリの limits もわずかに上げる必要がある場合があります。VerticalPodAutoscaler は*recommender*モードで実行して、requests と limits の推奨値を提供できます。
- アドオンの中には、例えばノードレベルのログ収集のように、 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} としてノードごとに 1 つのコピーが実行されるものがあります。この様な場合も、水平にスケールするアドオンと同様に、CPU やメモリの limits を増やす必要がある場合があります。

<!--
## {{% heading "whatsnext" %}}

`VerticalPodAutoscaler` is a custom resource that you can deploy into your cluster
to help you manage resource requests and limits for pods.
Visit [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
to learn more about `VerticalPodAutoscaler` and how you can use it to scale cluster
components, including cluster-critical addons.

The [cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
integrates with a number of cloud providers to help you run the right number of
nodes for the level of resource demand in your cluster.

The [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
helps you in resizing the addons automatically as your cluster's scale changes.
 -->

## {{% heading "whatsnext" %}}

- `VerticalPodAutoscaler`はクラスターにデプロイすることでポッドの requests や limits の管理の手助けとなるカスタムリソースです。
  `VerticalPodAutoscaler`を用いて、クラスタークリティカルなアドオンを含むクラスターコンポーネントをスケールする方法については、[Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)を参照してください。

- [`cluster autoscaler`](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)は、多くのクラウドプロバイダーと統合され、クラスター内のリソース需要のレベルに応じて適切な数のノードを実行できるようにします。

- [`addon resizer`](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)はクラスターの規模に応じて、自動的にアドオンのサイズを変更するのに役立ちます。
