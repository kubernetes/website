---
title: StatefulSetのスケール
content_template: templates/task
weight: 50
---

{{% capture overview %}}
このタスクは、StatefulSetをスケールする方法を示します。StatefulSetをスケーリングするとは、レプリカの数を増減することです。
{{% /capture %}}

{{% capture prerequisites %}}

* StatefulSetはKubernetesバージョン1.5以降でのみ利用可能です。
  Kubernetesのバージョンを確認するには、`kubectl version`を実行してください。

* すべてのステートフルアプリケーションがうまくスケールできるわけではありません。StatefulSetがスケールするかどうかわからない場合は、[StatefulSetの概念](/docs/concepts/workloads/controllers/statefulset/)または[StatefulSetのチュートリアル](/docs/tutorials/stateful-application/basic-stateful-set/)を参照してください。

* ステートフルアプリケーションクラスターが完全に健全であると確信できる場合にのみ、スケーリングを実行してください。

{{% /capture %}}

{{% capture steps %}}

## StatefulSetのスケール

### kubectlを使用したStatefulSetのスケール

まず、スケールしたいStatefulSetを見つけます。

```shell
kubectl get statefulsets <stateful-set-name>
```

StatefulSetのレプリカ数を変更します:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### StatefulSetのインプレースアップデート

コマンドライン上でレプリカ数を変更する代わりに、StatefulSetに[インプレースアップデート](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)が可能です。

StatefulSetが最初に `kubectl apply`で作成されたのなら、StatefulSetマニフェストの`.spec.replicas`を更新してから、`kubectl apply`を実行します:

```shell
kubectl apply -f <stateful-set-file-updated>
```

そうでなければ、`kubectl edit`でそのフィールドを編集してください:

```shell
kubectl edit statefulsets <stateful-set-name>
```

あるいは`kubectl patch`を使ってください:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## トラブルシューティング

### スケールダウンがうまくいかない

管理するステートフルPodのいずれかが異常である場合、StatefulSetをスケールダウンすることはできません。それらのステートフルPodが実行され準備ができた後にのみ、スケールダウンが行われます。

spec.replicas > 1の場合、Kubernetesは不健康なPodの理由を判断できません。それは、永続的な障害または一時的な障害の結果である可能性があります。一時的な障害は、アップグレードまたはメンテナンスに必要な再起動によって発生する可能性があります。

永続的な障害が原因でPodが正常でない場合、障害を修正せずにスケーリングすると、StatefulSetメンバーシップが正しく機能するために必要な特定の最小レプリカ数を下回る状態になる可能性があります。これにより、StatefulSetが利用できなくなる可能性があります。

一時的な障害によってPodが正常でなくなり、Podが再び使用可能になる可能性がある場合は、一時的なエラーがスケールアップまたはスケールダウン操作の妨げになる可能性があります。一部の分散データベースでは、ノードが同時に参加および脱退するときに問題があります。このような場合は、アプリケーションレベルでスケーリング操作を考えることをお勧めします。また、ステートフルアプリケーションクラスタが完全に健全であることが確実な場合にのみスケーリングを実行してください。

{{% /capture %}}

{{% capture whatsnext %}}

* [StatefulSetの削除](/docs/tasks/run-application/delete-stateful-set/)の詳細

{{% /capture %}}
