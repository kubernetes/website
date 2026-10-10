---
title: 基本的なDaemonSetを構築する
content_type: task  
weight: 5  
---
<!-- overview -->

このページでは、Kubernetesクラスターの全てのノード上でPodを実行する、基本的な{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}を構築する方法について示します。
ホストからファイルをマウントし、[Initコンテナ](/ja/docs/concepts/workloads/pods/init-containers/)を使用してその内容をログに記録して、pauseコンテナを利用するという単純なユースケースを取り上げます。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

DaemonSetの動作を示すために、少なくとも2つのノード(1つのコントロールプレーンと1つのワーカーノード)を持つKubernetesクラスターを用意します。

## DaemonSetの定義

このタスクでは、Podのコピーが全てのノード上でスケジュールされるようにする、基本的なDaemonSetが作成されます。
PodはInitコンテナを使用してホストから`/etc/machine-id`の内容を読み込んでログに記録し、メインのコンテナはPodを実行し続ける`pause`コンテナとなります。

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. (YAML)マニフェストに基づいたDaemonSetを作成します:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

1. 適用すると、DaemonSetがクラスター内の全てのノードでPodを実行していることを確認できます:

   ```shell
   kubectl get pods -o wide
   ```

   出力には、以下のようにノード毎に1つのPodが一覧表示されます:

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

1. ホストからマウントされたログディレクトリをチェックすることで、ログに記録された`/etc/machine-id`ファイルの内容を調べることができます:

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```

   `<pod-name>`は1つのPodの名前です。

## {{% heading "cleanup" %}}

DaemonSetを削除するためには、次のコマンドを実行します:

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

この単純なDaemonSetの例では、Initコンテナやホストパスボリュームなどの主要なコンポーネントを紹介しており、より高度なユースケースに応じて拡張することができます。
詳細については[DaemonSet](/ja/docs/concepts/workloads/controllers/daemonset/)を参照してください。

## {{% heading "whatsnext" %}}

* [DaemonSet上でローリングアップデートを実施する](/docs/tasks/manage-daemon/update-daemon-set/)を参照
* [既存のDaemonSetのPodを再利用してDaemonSetを作成する](/ja/docs/concepts/workloads/controllers/daemonset/)を参照
