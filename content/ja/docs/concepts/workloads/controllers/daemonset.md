---
reviewers:
title: DaemonSet
content_type: concept
weight: 40
---

<!-- overview -->

_DaemonSet_ は全て(またはいくつか)のNodeが単一のPodのコピーを稼働させることを保証します。Nodeがクラスターに追加されるとき、PodがNode上に追加されます。Nodeがクラスターから削除されたとき、それらのPodはガーベージコレクターにより除去されます。DaemonSetの削除により、DaemonSetが作成したPodもクリーンアップします。

DaemonSetのいくつかの典型的な使用例は以下の通りです。

- クラスターのストレージデーモンを全てのNode上で稼働させる。
- ログ集計デーモンを全てのNode上で稼働させる。
- Nodeのモニタリングデーモンを全てのNode上で稼働させる。

シンプルなケースとして、各タイプのデーモンにおいて、全てのNodeをカバーする1つのDaemonSetが使用されるケースがあります。さらに複雑な設定では、単一のタイプのデーモン用ですが、異なるフラグや、異なるハードウェアタイプに対するメモリー、CPUリクエストを要求する複数のDaemonSetを使用するケースもあります。




<!-- body -->

## DaemonSet Specの記述 {#writing-a-daemonset-spec}

### DaemonSetの作成 {#create-a-daemonset}

ユーザーはYAMLファイル内でDaemonSetの設定を記述することができます。例えば、下記の`daemonset.yaml`ファイルでは`fluentd-elasticsearch`というDockerイメージを稼働させるDaemonSetの設定を記述します。

{{% codenew file="controllers/daemonset.yaml" %}}

YAMLファイルに基づいてDaemonSetを作成します。

```
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

### 必須のフィールド {#required-fields}

他の全てのKubernetesの設定と同様に、DaemonSetは`apiVersion`、`kind`と`metadata`フィールドが必須となります。設定ファイルの活用法に関する一般的な情報は、[ステートレスアプリケーションの稼働](/ja/docs/tasks/run-application/run-stateless-application-deployment/)、[kubectlを用いたオブジェクトの管理](/ja/docs/concepts/overview/working-with-objects/object-management/)といったドキュメントを参照ください。

DaemonSetオブジェクトの名前は、有効な
[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

また、DaemonSetにおいて[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)セクションも必須となります。

### Podテンプレート {#pod-template}

`.spec.template`は`.spec`内での必須のフィールドの1つです。

`.spec.template`は[Podテンプレート](/ja/docs/concepts/workloads/pods/#pod-templates)となります。これはフィールドがネストされていて、`apiVersion`や`kind`をもたないことを除いては、{{< glossary_tooltip text="Pod" term_id="pod" >}}のテンプレートと同じスキーマとなります。

Podに対する必須のフィールドに加えて、DaemonSet内のPodテンプレートは適切なラベルを指定しなくてはなりません([Podセレクター](#pod-selector)の項目を参照ください)。

DaemonSet内のPodテンプレートでは、[`RestartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)フィールドを指定せずにデフォルトの`Always`を使用するか、明示的に`Always`を設定するかのどちらかである必要があります。

### Podセレクター {#pod-selector}

`.spec.selector`フィールドはPodセレクターとなります。これは[Job](/ja/docs/concepts/workloads/controllers/job/)の`.spec.selector`と同じものです。

ユーザーは`.spec.template`のラベルにマッチするPodセレクターを指定しなくてはいけません。
また、一度DaemonSetが作成されると、その`.spec.selector`は変更不可能になります。Podセレクターの変更は、意図しないPodの孤立を引き起こし、ユーザーにとってやっかいなものとなります。

`.spec.selector`は2つのフィールドからなるオブジェクトです。

* `matchLabels` - [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)の`.spec.selector`と同じように機能します。
* `matchExpressions` - キーと、値のリストとさらにはそれらのキーとバリューに関連したオペレーターを指定することにより、より洗練された形式のセレクターを構成できます。

上記の2つが指定された場合は、2つの条件をANDでどちらも満たすものを結果として返します。

`spec.selector`は`.spec.template.metadata.labels`とマッチしなければなりません。この2つの値がマッチしない設定をした場合、APIによってリジェクトされます。

### 選択したNode上でPodを稼働させる {#running-pods-on-select-nodes}

もしユーザーが`.spec.template.spec.nodeSelector`を指定したとき、DaemonSetコントローラーは、その[node selector](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)にマッチするNode上にPodを作成します。同様に、もし`.spec.template.spec.affinity`を指定したとき、DaemonSetコントローラーは[node affinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)にマッチするNode上にPodを作成します。
もしユーザーがどちらも指定しないとき、DaemonSetコントローラーは全てのNode上にPodを作成します。

## Daemon Podがどのようにスケジューリングされるか {#how-daemon-pods-are-scheduled}

DaemonSetは、全ての利用可能なNodeがPodのコピーを稼働させることを保証します。DaemonSetコントローラーは対象となる各Nodeに対してPodを作成し、ターゲットホストに一致するようにPodの`spec.affinity.nodeAffinity`フィールドを追加します。Podが作成されると、通常はデフォルトのスケジューラーが引き継ぎ、`.spec.nodeName`を設定することでPodをターゲットホストにバインドします。新しいNodeに適合できない場合、デフォルトスケジューラーは新しいPodの[優先度](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)に基づいて、既存Podのいくつかを先取り(退避)させることがあります。

ユーザーは、DaemonSetの`.spec.template.spec.schedulerName`フィールドを設定することにより、DaemonSetのPodに対して異なるスケジューラーを指定することができます。

`.spec.template.spec.affinity.nodeAffinity`フィールド(指定された場合)で指定された元のNodeアフィニティは、DaemonSetコントローラーが対象Nodeを評価する際に考慮されますが、作成されたPod上では対象Nodeの名前と一致するNodeアフィニティに置き換わります。

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```

### TaintとToleration {#taints-and-tolerations}

DaemonSetコントローラーはDaemonSet Podに一連の{{< glossary_tooltip
text="Toleration" term_id="toleration" >}}を自動的に追加します:

{{< table caption="Tolerations for DaemonSet pods" >}}

| Toleration key                                                                                                        | Effect       | Details                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`node.kubernetes.io/not-ready`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready)             | `NoExecute`  | 健康でないNodeや、Podを受け入れる準備ができていないNodeにDaemonSet Podをスケジュールできるように設定します。そのようなNode上で動作しているDaemonSet Podは退避されることがありません。 |
| [`node.kubernetes.io/unreachable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unreachable)         | `NoExecute`  | Nodeコントローラーから到達できないNodeにDaemonSet Podをスケジュールできるように設定します。このようなNode上で動作しているDaemonSet Podは、退避されません。 |
| [`node.kubernetes.io/disk-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-disk-pressure)     | `NoSchedule` | ディスク不足問題のあるNodeにDaemonSet Podをスケジュールできるように設定します。                                                                         |
| [`node.kubernetes.io/memory-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-memory-pressure) | `NoSchedule` | メモリー不足問題のあるNodeにDaemonSet Podをスケジュールできるように設定します。                                                                        |
| [`node.kubernetes.io/pid-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-pid-pressure) | `NoSchedule` | 処理負荷に問題のあるNodeにDaemonSet Podをスケジュールできるように設定します。                                                                        |
| [`node.kubernetes.io/unschedulable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unschedulable)   | `NoSchedule` | スケジューリング不可能なNodeにDaemonSet Podをスケジュールできるように設定します。                                                                            |
| [`node.kubernetes.io/network-unavailable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-network-unavailable) | `NoSchedule` | **ホストネットワークを要求するDaemonSet Podにのみ追加できます**、つまり`spec.hostNetwork: true`と設定されているPodです。このようなDaemonSet Podは、ネットワークが利用できないNodeにスケジュールできるように設定します。|

{{< /table >}}

DaemonSetのPodテンプレートで定義すれば、DaemonSetのPodに独自のTolerationを追加することも可能です。

DaemonSetコントローラーは`node.kubernetes.io/unschedulable:NoSchedule`のTolerationを自動的に設定するため、Kubernetesは _スケジューリング不可能_ としてマークされているNodeでDaemonSet Podを実行することが可能です。

[クラスターのネットワーク](/ja/docs/concepts/cluster-administration/networking/)のような重要なNodeレベルの機能をDaemonSetで提供する場合、KubernetesがDaemonSet PodをNodeが準備完了になる前に配置することは有用です。
例えば、その特別なTolerationがなければ、ネットワークプラグインがそこで実行されていないためにNodeが準備完了としてマークされず、同時にNodeがまだ準備完了でないためにそのNode上でネットワークプラグインが実行されていないというデッドロック状態に陥ってしまう可能性があるのです。

## Daemon Podとのコミュニケーション {#communicating-with-daemon-pods}

DaemonSet内のPodとのコミュニケーションをする際に考えられるパターンは以下の通りです:

- **Push**: DaemonSet内のPodは統計データベースなどの他のサービスに対して更新情報を送信するように設定されます。クライアントは持っていません。
- **NodeIPとKnown Port**: PodがNodeIPを介して疎通できるようにするため、DaemonSet内のPodは`hostPort`を使用できます。慣例により、クライアントはNodeIPのリストとポートを知っています。
- **DNS**: 同じPodセレクターを持つ[HeadlessService](/ja/docs/concepts/services-networking/service/#headless-service)を作成し、`endpoints`リソースを使ってDaemonSetを探すか、DNSから複数のAレコードを取得します。
- **Service**: 同じPodセレクターを持つServiceを作成し、複数のうちのいずれかのNode上のDaemonに疎通させるためにそのServiceを使います。(特定のNodeにアクセスする方法はありません。)

## DaemonSetの更新 {#updating-a-daemonset}

もしNodeラベルが変更されたとき、そのDaemonSetは直ちに新しくマッチしたNodeにPodを追加し、マッチしなくなったNodeからPodを削除します。

ユーザーはDaemonSetが作成したPodを修正可能です。しかし、Podは全てのフィールドの更新を許可していません。また、DaemonSetコントローラーは次のNode(同じ名前でも)が作成されたときにオリジナルのテンプレートを使ってPodを作成します。

ユーザーはDaemonSetを削除可能です。`kubectl`コマンドで`--cascade=orphan`を指定するとDaemonSetのPodはNode上に残り続けます。その後、同じセレクターで新しいDaemonSetを作成すると、新しいDaemonSetは既存のPodを再利用します。PodでDaemonSetを置き換える必要がある場合は、`updateStrategy`に従ってそれらを置き換えます。

ユーザーはDaemonSet上で[ローリングアップデートの実施](/docs/tasks/manage-daemon/update-daemon-set/)が可能です。

## DaemonSetの代替案 {#alternatives-to-daemonset}

### Initスクリプト {#init-scripts}

Node上で直接起動することにより(例: `init`、`upstartd`、`systemd`を使用する)、デーモンプロセスを稼働することが可能です。この方法は非常に良いですが、このようなプロセスをDaemonSetを介して起動することはいくつかの利点があります。

- アプリケーションと同じ方法でデーモンの監視とログの管理ができる。
- デーモンとアプリケーションで同じ設定用の言語とツール(例: Podテンプレート、`kubectl`)を使える。
- リソースリミットを使ったコンテナ内でデーモンを稼働させることにより、デーモンとアプリケーションコンテナの分離性が高まります。ただし、これはPod内ではなく、コンテナ内でデーモンを稼働させることでも可能です。

### ベアPod {#bare-pods}

特定のNode上で稼働するように指定したPodを直接作成することは可能です。しかし、DaemonSetはNodeの故障やNodeの破壊的なメンテナンスやカーネルのアップグレードなど、どのような理由に限らず、削除されたもしくは停止されたPodを置き換えます。このような理由で、ユーザーはPod単体を作成するよりもむしろDaemonSetを使うべきです。

### 静的Pod {#static-pods}

Kubeletによって監視されているディレクトリに対してファイルを書き込むことによって、Podを作成することが可能です。これは[静的Pod](/ja/docs/tasks/configure-pod-container/static-pod/)と呼ばれます。DaemonSetと違い、静的Podはkubectlや他のKubernetes APIクライアントで管理できません。静的PodはApiServerに依存しておらず、クラスターの自立起動時に最適です。また、静的Podは将来的には廃止される予定です。

### Deployment {#deployments}

DaemonSetは、Podの作成し、そのPodが停止されることのないプロセスを持つことにおいて[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)と同様です(例: webサーバー、ストレージサーバー)。

フロントエンドのようなServiceのように、どのホスト上にPodが稼働するか制御するよりも、レプリカ数をスケールアップまたはスケールダウンしたりローリングアップデートする方が重要であるような、状態をもたないServiceに対してDeploymentを使ってください。
DaemonSetがNodeレベルの機能を提供し、他のPodがその特定のNodeで正しく動作するようにする場合、Podのコピーが全てまたは特定のホスト上で常に稼働していることが重要な場合にDaemonSetを使ってください。

例えば、[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)には、DaemonSetとして動作するコンポーネントが含まれていることがよくあります。DaemonSetコンポーネントは、それが動作しているNodeでクラスターネットワークが動作していることを確認します。


## {{% heading "whatsnext" %}}

* [Pod](/ja/docs/concepts/workloads/pods/)について学ぶ。
  * Kubernetesの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}コンポーネントを実行するのに便利な[静的Pod](#static-pods)について学ぶ。
* DaemonSetの使用方法を確認する
  * [DaemonSetでローリングアップデートを実施する](/docs/tasks/manage-daemon/update-daemon-set/)
  * [DaemonSetでロールバックを実行する](/docs/tasks/manage-daemon/rollback-daemon-set/)
    (例えば、ロールアウトが期待通りに動作しなかった場合)。
* [Node上へのPodのスケジューリング](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)の仕組みを理解する
* よくDaemonSetとして実行される[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)と[アドオン](/ja/docs/concepts/cluster-administration/addons/)について学ぶ。
* `DaemonSet`は、Kubernetes REST APIのトップレベルのリソースです。デーモンセットのAPIを理解するため{{< api-reference page="workload-resources/daemon-set-v1" >}}オブジェクトの定義を読む。
