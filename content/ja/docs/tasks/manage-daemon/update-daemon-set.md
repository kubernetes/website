---
title: DaemonSet上でローリングアップデートを実施する
content_type: task
weight: 10
---

<!-- overview -->
このページでは、DaemonSet上でローリングアップデートを行う方法について説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## DaemonSetのアップデート戦略

DaemonSetには2種類のアップデート戦略があります:

* `OnDelete`: `OnDelete`アップデート戦略では、DaemonSetのテンプレートを更新した後、古いDaemonSetのPodを手動で削除した時*のみ*、新しいDaemonSetのPodが作成されます。
  これはKubernetesのバージョン1.5またはそれ以前のDaemonSetと同じ挙動です。
* `RollingUpdate`: これは既定のアップデート戦略です。
  `RollingUpdate`アップデート戦略では、DaemonSetのテンプレートを更新した後、古いDaemonSetのPodが削除され、制御された方法で自動的に新しいDaemonSetのPodが作成されます。
  アップデートのプロセス全体を通して、各ノード上で稼働するDaemonSetのPodは最大で1つだけです。

## ローリングアップデートの実施

DaemonSetに対してローリングアップデートの機能を有効にするには、`.spec.updateStrategy.type`を`RollingUpdate`に設定する必要があります。

[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)(既定値は1)、[`.spec.minReadySeconds`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)(既定値は0)、そして[`.spec.updateStrategy.rollingUpdate.maxSurge`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)(既定値は0)についても設定したほうがよいでしょう。

### `RollingUpdate`アップデート戦略によるDaemonSetの作成

このYAMLファイルでは、アップデート戦略として`RollingUpdate`が指定されたDaemonSetを定義しています。

{{% code_sample file="controllers/fluentd-daemonset.yaml" %}}

DaemonSetのマニフェストのアップデート戦略を検証した後、DaemonSetを作成します:

```shell
kubectl create -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

あるいは、`kubectl apply`を使用してDaemonSetを更新する予定がある場合は、`kubectl apply`を使用して同じDaemonSetを作成してください。

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

### DaemonSetの`RollingUpdate`アップデート戦略の確認

DaemonSetのアップデート戦略を確認し、`RollingUpdate`が設定されているようにします:

```shell
kubectl get ds/fluentd-elasticsearch -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}' -n kube-system
```

システムにDaemonSetが作成されていない場合は、代わりに次のコマンドによってDaemonSetのマニフェストを確認します:

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml --dry-run=client -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

どちらのコマンドも、出力は次のようになります:

```
RollingUpdate
```

出力が`RollingUpdate`以外の場合は、DaemonSetオブジェクトまたはマニフェストを見直して、修正してください。


### DaemonSetテンプレートの更新

`RollingUpdate`のDaemonSetの`.spec.template`に対して任意の更新が行われると、ローリングアップデートがトリガーされます。
新しいYAMLファイルを適用してDaemonSetを更新しましょう。
これにはいくつかの異なる`kubectl`コマンドを使用することができます。

{{% code_sample file="controllers/fluentd-daemonset-update.yaml" %}}

#### 宣言型コマンド

[設定ファイル](/docs/tasks/manage-kubernetes-objects/declarative-config/)を使用してDaemonSetを更新する場合は、`kubectl apply`を使用します:

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset-update.yaml
```

#### 命令型コマンド

[命令型コマンド](/docs/tasks/manage-kubernetes-objects/imperative-command/)を使用してDaemonSetを更新する場合は、`kubectl edit`を使用します:

```shell
kubectl edit ds/fluentd-elasticsearch -n kube-system
```

##### コンテナイメージのみのアップデート

DaemonSetのテンプレート内のコンテナイメージ、つまり`.spec.template.spec.containers[*].image`のみを更新したい場合、`kubectl set image`を使用します:

```shell
kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=quay.io/fluentd_elasticsearch/fluentd:v2.6.0 -n kube-system
```

### ローリングアップデートのステータスの監視

最後に、最新のDaemonSetの、ローリングアップデートのロールアウトステータスを監視します:

```shell
kubectl rollout status ds/fluentd-elasticsearch -n kube-system
```

ロールアウトが完了すると、次のような出力となります:

```shell
daemonset "fluentd-elasticsearch" successfully rolled out
```

## トラブルシューティング

### DaemonSetのローリングアップデートがスタックする

時々、DaemonSetのローリングアップデートがスタックする場合があります。
これにはいくつかの原因が考えられます:

#### いくつかのノードのリソース不足

1つ以上のノードで新しいDaemonSetのPodをスケジュールすることができず、ロールアウトがスタックしています。
これはノードの[リソース不足](/ja/docs/concepts/scheduling-eviction/node-pressure-eviction/)の可能性があります。

この事象が起きた場合は、`kubectl get nodes`の出力と次の出力を比較して、DaemonSetのPodがスケジュールされていないノードを見つけます:

```shell
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system
```

そのようなノードを見つけたら、新しいDaemonSetのPodのための空きを作るために、ノードからDaemonSet以外のいくつかのPodを削除します。

{{< note >}}
コントローラーによって制御されていないPodや、レプリケートされていないPodを削除すると、これはサービスの中断が発生する原因となります。
これはまた、[PodDisruptionBudget](/ja/docs/tasks/run-application/configure-pdb/)についても考慮しません。
{{< /note >}}

#### 壊れたロールアウト

例えばコンテナがクラッシュを繰り返したり、(しばしばtypoによって)コンテナイメージが存在しないといった理由で最新のDaemonSetのテンプレートの更新が壊れた場合、DaemonSetのロールアウトは進みません。

これを修正するためには、DaemonSetのテンプレートを再度更新します。
新しいロールアウトは、前の不健全なロールアウトによってブロックされません。

#### クロックスキュー

DaemonSet内で`.spec.minReadySeconds`が指定されると、マスターとノードの間のクロックスキューによって、DaemonSetがロールアウトの進捗を正しく認識できなくなる場合があります。

## クリーンアップ

NamespaceからDaemonSetを削除します:

```shell
kubectl delete ds fluentd-elasticsearch -n kube-system
```

## {{% heading "whatsnext" %}}

* [DaemonSet上でロールバックを実施する](/docs/tasks/manage-daemon/rollback-daemon-set/)を参照
* [既存のDaemonSetのPodを再利用するためにDaemonSetを作成する](/ja/docs/concepts/workloads/controllers/daemonset/)を参照
