---
title: Kubernetesシステムコンポーネントのメトリクス
content_type: concept
weight: 70
---

<!-- overview -->

システムコンポーネントのメトリクスを利用すると、コンポーネント内部の動作をより詳しく把握できます。
メトリクスは、ダッシュボードやアラートの構築に特に役立ちます。

Kubernetesコンポーネントは[Prometheus形式](https://prometheus.io/docs/instrumenting/exposition_formats/)でメトリクスを出力します。
この形式は構造化されたプレーンテキストで、人間にも機械にも読み取れるように設計されています。

<!-- body -->

## Kubernetesにおけるメトリクス {#metrics-in-kubernetes}

ほとんどの場合、メトリクスはHTTPサーバーの`/metrics`エンドポイントで利用できます。
デフォルトでエンドポイントを公開していないコンポーネントについては、`--bind-address`フラグを使用して有効にできます。

そのようなコンポーネントの例を以下に示します:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

本番環境では、[Prometheus Server](https://prometheus.io/)やその他のメトリクススクレイパーを設定して、これらのメトリクスを定期的に収集し、何らかの時系列データベースで利用できるようにすることが推奨されます。

{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}は`/metrics/cadvisor`、`/metrics/resource`、`/metrics/probes`エンドポイントでもメトリクスを公開していることに注意してください。
これらのメトリクスのライフサイクルは同一ではありません。

クラスターで{{< glossary_tooltip term_id="rbac" text="RBAC" >}}を使用している場合、メトリクスの読み取りには`/metrics`へのアクセスを許可するClusterRoleを持つユーザー、グループ、またはServiceAccountによる認可が必要です。
以下はその例です:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

## メトリクスのライフサイクル {#metrics-lifecycle}

Alphaメトリクス → Betaメトリクス → Stableメトリクス → 非推奨メトリクス → 非表示メトリクス → 削除済みメトリクス

Alphaメトリクスには安定性の保証がありません。
これらのメトリクスはいつでも変更または削除される可能性があります。

Betaメトリクスは、Stableメトリクスよりも緩いAPIの契約に従います。
Betaメトリクスでは、ライフタイム中にラベルが削除されることはありませんが、Betaステージ中にラベルが追加される可能性はあります。

Stableメトリクスは変更されないことが保証されています。
具体的には以下を意味します:

* 非推奨のシグネチャを持たないStableメトリクスは、削除も名前変更もされない
* Stableメトリクスの型は変更されない

非推奨メトリクスは削除が予定されていますが、引き続き利用可能です。
これらのメトリクスには、非推奨になったバージョンに関するアノテーションが含まれます。

以下はその例です:

* 非推奨化の前

  ```
  # HELP some_counter this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

* 非推奨化の後

  ```
  # HELP some_counter (Deprecated since 1.15.0) this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

非表示メトリクスはスクレイピング用に公開されなくなりますが、引き続き利用可能です。
非推奨メトリクスは、その安定性レベルに基づく一定期間の後、非表示メトリクスになります。

* **STABLE**メトリクスは、最低3リリースまたは9ヶ月のいずれか長い方の期間の後に非表示になります。
* **BETA**メトリクスは、最低1リリースまたは4ヶ月のいずれか長い方の期間の後に非表示になります。
* **ALPHA**メトリクスは、非推奨化と同じリリースで非表示または削除される可能性があります。

非表示メトリクスを使用するには、有効化する必要があります。
詳細については、[非表示メトリクスの表示](#非表示メトリクスの表示)セクションを参照してください。

削除済みメトリクスは公開されなくなり、使用できません。

## 非表示メトリクスの表示 {#show-hidden-metrics}

上記のとおり、管理者はコマンドラインフラグを使用して、特定のバイナリで非表示メトリクスを有効にできます。
これは、前のリリースで非推奨化されたメトリクスの移行を見逃した場合の管理者向けのエスケープハッチとして提供されています。

`show-hidden-metrics-for-version`フラグは、そのリリースで非推奨化されたメトリクスを表示するためのバージョンを受け取ります。
バージョンはx.yの形式で表現され、xはメジャーバージョン、yはマイナーバージョンです。
メトリクスがパッチリリースで非推奨化される可能性があっても、パッチバージョンは不要です。
これは、メトリクスの非推奨ポリシーがマイナーリリースに対して適用されるためです。

このフラグは、前のマイナーバージョンのみを値として受け取ることができます。
前のリリースで非表示になったすべてのメトリクスを表示したい場合は、`show-hidden-metrics-for-version`フラグに前のバージョンを設定できます。
古すぎるバージョンの使用は、メトリクスの非推奨ポリシーに違反するため許可されていません。

例えば、メトリクス`A`が`1.29`で非推奨化されたとします。
メトリクス`A`が非表示になるバージョンは、その安定性レベルによって異なります。

* メトリクス`A`が**ALPHA**の場合、`1.29`で非表示になる可能性があります。
* メトリクス`A`が**BETA**の場合、最も早くて`1.30`で非表示になります。
  `1.30`にアップグレードする際に`A`がまだ必要な場合は、コマンドラインフラグ`--show-hidden-metrics-for-version=1.29`を使用する必要があります。
* メトリクス`A`が**STABLE**の場合、最も早くて`1.32`で非表示になります。
  `1.32`にアップグレードする際に`A`がまだ必要な場合は、コマンドラインフラグ`--show-hidden-metrics-for-version=1.31`を使用する必要があります。

## コンポーネントのメトリクス {#component-metrics}

### kube-controller-managerのメトリクス {#kube-controller-manager-metrics}

controller managerのメトリクスは、controller managerのパフォーマンスと健全性に関する重要な情報を提供します。
これらのメトリクスには、go_routineの数などの一般的なGo言語ランタイムメトリクスや、etcdリクエストのレイテンシーやクラウドプロバイダー(AWS、GCE、OpenStack)のAPIレイテンシーなど、コントローラー固有のメトリクスが含まれており、クラスターの健全性を測定するために利用できます。

Kubernetes 1.7以降、GCE、AWS、Vsphere、OpenStackのストレージ操作に関する詳細なクラウドプロバイダーメトリクスが利用可能です。
これらのメトリクスは、永続ボリューム操作の健全性を監視するために使用できます。

例えば、GCEの場合、これらのメトリクスは以下のように呼ばれます:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```


### kube-schedulerのメトリクス {#kube-scheduler-metrics}

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

スケジューラーは、すべての実行中のPodの要求されたリソースと希望する制限を報告するオプションのメトリクスを公開します。
これらのメトリクスは、キャパシティプランニングダッシュボードの構築、現在または過去のスケジューリング制限の評価、リソース不足によりスケジュールできないワークロードの迅速な特定、実際の使用量とPodのリクエストの比較に使用できます。

kube-schedulerは、各Podに設定されたリソースの[要求と制限](/docs/concepts/configuration/manage-resources-containers/)を識別します。
要求または制限のいずれかがゼロでない場合、kube-schedulerはメトリクスの時系列を報告します。
この時系列には以下のラベルが付与されます:

- namespace
- Pod名
- Podがスケジュールされたノード(まだスケジュールされていない場合は空文字列)
- priority
- そのPodに割り当てられたスケジューラー
- リソース名(例: `cpu`)
- 既知の場合、リソースの単位(例: `cores`)

Podが完了状態に達すると(`restartPolicy`が`Never`または`OnFailure`で、`Succeeded`または`Failed`のPodフェーズにある場合、もしくは削除されてすべてのコンテナが終了状態になった場合)、スケジューラーは他のPodを実行するようスケジュールできるようになるため、この時系列は報告されなくなります。
2つのメトリクスは`kube_pod_resource_request`と`kube_pod_resource_limit`と呼ばれます。

メトリクスはHTTPエンドポイント`/metrics/resources`で公開されます。
これらのメトリクスには`/metrics/resources`エンドポイントの認可が必要であり、通常は`/metrics/resources`非リソースURLに対する`get`動詞を持つClusterRoleによって付与されます。

Kubernetes 1.21では、これらのメトリクスはAlphaのため、公開するには`--show-hidden-metrics-for-version=1.20`フラグを使用する必要があります。

### kubelet Pressure Stall Information (PSI)メトリクス {#kubelet-pressure-stall-information-psi-metrics}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

Beta機能として、Kubernetesではkubeletを設定して、CPU、メモリ、I/Oの使用に関するLinuxカーネルの[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)(PSI)を収集できます。
この情報は、ノード、Pod、コンテナレベルで収集されます。
メトリクスは`/metrics/cadvisor`エンドポイントで以下の名前で公開されます:

```
container_pressure_cpu_stalled_seconds_total
container_pressure_cpu_waiting_seconds_total
container_pressure_memory_stalled_seconds_total
container_pressure_memory_waiting_seconds_total
container_pressure_io_stalled_seconds_total
container_pressure_io_waiting_seconds_total
```

この機能は、`KubeletPSI`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を設定することで、デフォルトで有効になっています。
この情報は[Summary API](/docs/reference/instrumentation/node-metrics#psi)でも公開されています。

PSIメトリクスの解釈方法については、[PSIメトリクスの理解](/docs/reference/instrumentation/understand-psi-metrics/)を参照してください。

#### 要件 {#requirements}

Pressure Stall Informationには以下が必要です:

- [Linuxカーネルバージョン4.20以降](/docs/reference/node/kernel-version-requirements#requirements-psi)
- [cgroup v2](/docs/concepts/architecture/cgroups)

## メトリクスの無効化 {#disabling-metrics}

コマンドラインフラグ`--disabled-metrics`を使用して、メトリクスを明示的に無効にできます。
例えば、メトリクスがパフォーマンスの問題を引き起こしている場合に使用できます。
入力は無効にするメトリクスのリストです(例: `--disabled-metrics=metric1,metric2`)。

## メトリクスのカーディナリティの制限 {#metric-cardinality-enforcement}

無制限のディメンションを持つメトリクスは、計測対象のコンポーネントでメモリの問題を引き起こす可能性があります。
リソースの使用を制限するために、`--allow-metric-labels`コマンドラインオプションを使用して、メトリクスのラベル値の許可リストを動的に設定できます。

Alphaステージでは、このフラグはメトリクスラベル許可リストのマッピングの系列のみを受け取ることができます。
各マッピングは`<metric_name>,<label_name>=<allowed_labels>`の形式で、`<allowed_labels>`は許可されるラベル名のカンマ区切りリストです。

全体のフォーマットは以下のようになります:

```
--allow-metric-labels <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

以下はその例です:

```none
--allow-metric-labels number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

CLIからの指定に加えて、設定ファイル内でも行うことができます。
コンポーネントへの`--allow-metric-labels-manifest`コマンドライン引数を使用して、その設定ファイルへのパスを指定できます。
以下はその設定ファイルの内容の例です:

```yaml
"metric1,label2": "v1,v2,v3"
"metric2,label1": "v1,v2,v3"
```

さらに、`cardinality_enforcement_unexpected_categorizations_total`メタメトリクスは、カーディナリティ制限中の予期しないカテゴリ分けの数を記録します。
これは、許可リストの制約に対して許可されていないラベル値が検出された場合に発生します。

## {{% heading "whatsnext" %}}

* メトリクスの[Prometheusテキスト形式](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format)について読む
* [安定版Kubernetesメトリクス](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)の一覧を確認する
* [Kubernetes非推奨ポリシー](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)について読む
