---
title: 拡張リソースをコンテナに割り当てる
content_type: task
weight: 70
---

<!-- overview -->

{{< feature-state state="stable" >}}

このページでは、拡張リソースをコンテナに割り当てる方法について説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

この練習を始める前に、[Nodeに拡張リソースをアドバタイズする](/ja/docs/tasks/administer-cluster/extended-resource-node/)の練習を行ってください。これにより、Nodeの1つがドングルリソースをアドバタイズするように設定されます。

<!-- steps -->

## 拡張リソースをPodに割り当てる

拡張リソースをリクエストするには、コンテナのマニフェストに`resources:requests`フィールドを含めます。拡張リソースは、`*.kubernetes.io/`以外の任意のドメインで完全修飾されます。有効な拡張リソース名は、`example.com/foo`という形式になります。ここで、`example.com`はあなたの組織のドメインで、`foo`は記述的なリソース名で置き換えます。

1つのコンテナからなるPodの構成ファイルを示します。

{{% codenew file="pods/resource/extended-resource-pod.yaml" %}}

構成ファイルでは、コンテナが3つのdongleをリクエストしていることがわかります。

次のコマンドでPodを作成します。

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

Podが起動したことを確認します。

```shell
kubectl get pod extended-resource-demo
```

Podの説明を表示します。

```shell
kubectl describe pod extended-resource-demo
```

dongleのリクエストが表示されます。

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## 2つ目のPodの作成を試みる

以下に、1つのコンテナを持つPodの構成ファイルを示します。コンテナは2つのdongleをリクエストします。

{{% codenew file="pods/resource/extended-resource-pod-2.yaml" %}}

Kubernetesは、2つのdongleのリクエストを満たすことができません。1つ目のPodが、利用可能な4つのdongleのうち3つを使用してしまっているためです。

Podを作成してみます。

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

Podの説明を表示します。

```shell
kubectl describe pod extended-resource-demo-2
```

出力にはPodがスケジュールできないことが示されます。2つのdongleが利用できるNodeが存在しないためです。

```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

Podのステータスを表示します。

```shell
kubectl get pod extended-resource-demo-2
```

出力には、Podは作成されたものの、Nodeにスケジュールされなかったことが示されています。PodはPending状態になっています。

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## クリーンアップ

この練習で作成したPodを削除します。

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```

## {{% heading "whatsnext" %}}

### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)
* [コンテナおよびPodへのCPUリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-cpu-resource/)

### クラスター管理者向け

* [Nodeに拡張リソースをアドバタイズする](/ja/docs/tasks/administer-cluster/extended-resource-node/)


