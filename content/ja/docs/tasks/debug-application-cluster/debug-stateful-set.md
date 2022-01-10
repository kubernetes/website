---
title: StatefulSetのデバッグ
content_type: task
---

<!-- overview -->

このタスクでは、StatefulSetをデバッグする方法を説明します。



## {{% heading "prerequisites" %}}


* Kubernetesクラスターが必要です。また、kubectlコマンドラインツールがクラスターと通信するように設定されている必要があります。
* 調べたいStatefulSetを実行しておきましょう。



<!-- steps -->

## StatefulSetのデバッグ

StatefulSetに属し、ラベル`app=myapp`が設定されているすべてのPodを一覧表示するには、以下のコマンドを利用できます。

```shell
kubectl get pods -l app=myapp
```

Podが長期間`Unknown`または`Terminating`の状態になっていることがわかった場合は、それらを処理する方法について[StatefulSetの削除](/ja/docs/tasks/run-application/delete-stateful-set/)タスクを参照してください。
[Podのデバッグ](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/)ガイドを使用して、StatefulSet内の個々のPodをデバッグできます。



## {{% heading "whatsnext" %}}


[Initコンテナのデバッグ](/ja/docs/tasks/debug-application-cluster/debug-init-containers/)の詳細



