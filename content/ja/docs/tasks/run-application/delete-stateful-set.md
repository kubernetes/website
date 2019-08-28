---
title: StatefulSetの削除
content_template: templates/task
weight: 60
---

{{% capture overview %}}

このタスクでは、StatefulSetを削除する方法を説明します。

{{% /capture %}}

{{% capture prerequisites %}}

* このタスクは、クラスター上で、StatefulSetで表現されるアプリケーションが実行されていることを前提としています。

{{% /capture %}}

{{% capture steps %}}

## StatefulSetの削除

Kubernetesで他のリソースを削除するのと同じ方法でStatefulSetを削除することができます。つまり、`kubectl delete`コマンドを使い、StatefulSetをファイルまたは名前で指定します。

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

StatefulSet自体が削除された後で、関連するヘッドレスサービスを個別に削除する必要があるかもしれません。

```shell
kubectl delete service <service-name>
```

kubectlを使ってStatefulSetを削除すると0にスケールダウンされ、すべてのPodが削除されます。PodではなくStatefulSetだけを削除したい場合は、`--cascade=false`を使用してください。

```shell
kubectl delete -f <file.yaml> --cascade=false
```

`--cascade=false`を`kubectl delete`に渡すことで、StatefulSetオブジェクト自身が削除された後でも、StatefulSetによって管理されていたPodは残ります。Podに`app=myapp`というラベルが付いている場合は、次のようにして削除できます:

```shell
kubectl delete pods -l app=myapp
```

### 永続ボリューム

StatefulSet内のPodを削除しても、関連付けられているボリュームは削除されません。これは、削除する前にボリュームからデータをコピーする機会があることを保証するためです。Podが[終了状態](/docs/concepts/workloads/pods/pod/#termination-of-pods)になった後にPVCを削除すると、ストレージクラスと再利用ポリシーによっては、背後にある永続ボリュームの削除がトリガーされることがあります。決してクレーム削除後にボリュームにアクセスできると想定しないでください。

{{< note >}}
データを損失する可能性があるため、PVCを削除するときは注意してください。
{{< /note >}}

### StatefulSetの完全削除

関連付けられたPodを含むStatefulSet内のすべてのものを単純に削除するには、次のような一連のコマンドを実行します:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp

```

上の例では、Podは`app=myapp`というラベルを持っています。必要に応じてご利用のラベルに置き換えてください。

### StatefulSet Podの強制削除

StatefulSet内の一部のPodが長期間`Terminating`または`Unknown`状態のままになっていることが判明した場合は、手動でapiserverからPodを強制的に削除する必要があります。これは潜在的に危険な作業です。詳細は[StatefulSet Podの強制削除](/docs/tasks/run-application/force-delete-stateful-set-pod/)を参照してください。

{{% /capture %}}

{{% capture whatsnext %}}

[StatefulSet Podの強制削除](/docs/tasks/run-application/force-delete-stateful-set-pod/)の詳細

{{% /capture %}}


