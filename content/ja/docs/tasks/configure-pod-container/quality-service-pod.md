---
title: PodにQuality of Serviceを設定する
content_type: task
weight: 30
---


<!-- overview -->

このページでは、特定のQuality of Service (QoS)クラスをPodに割り当てるための設定方法を示します。Kubernetesは、Podのスケジューリングおよび退役を決定するためにQoSクラスを用います。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## QoSクラス

KubernetesはPodの作成時に次のいずれかのQoSクラスをPodに割り当てます:

* Guaranteed
* Burstable
* BestEffort

## namespaceの作成

この演習で作成するリソースがクラスター内で分離されるよう、namespaceを作成します。


```shell
kubectl create namespace qos-example
```

## GuaranteedのQoSクラスを割り当てたPodを作成する

PodにGuaranteedのQoSクラスを与えるには、以下が必要になります:

* Pod内のすべてのコンテナにメモリーの制限と要求が与えられており、同じ値であること。
* Pod内のすべてのコンテナにCPUの制限と要求が与えられており、同じ値であること。

以下に1つのコンテナをもつPodの設定ファイルを示します。コンテナには200MiBのメモリー制限とリクエストを与え、700ミリCPUの制限と要求を与えます。

{{< codenew file="pods/qos/qos-pod.yaml" >}}

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

この出力では、KubernetesがPodにGuaranteed QoSクラスを与えたことを示しています。Podのコンテナにメモリー制限と一致するメモリー要求があり、CPU制限と一致するCPU要求があることも確認できます。

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
  ...
status:
  qosClass: Guaranteed
```

{{< note >}}
コンテナにメモリー制限を指定し、メモリー要求を指定していない場合は、Kubernetesは自動的にメモリー制限と一致するメモリー要求を割り当てます。同様に、コンテナにCPU制限を指定し、CPU要求を指定していない場合は、Kubernetesは自動的にCPU制限と一致するCPU要求を割り当てます。
{{< /note >}}

Podを削除してください:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## BurstableのQoSクラスを割り当てたPodを作成する

次のような場合に、Burstable QoSクラスがPodに与えられます:

* PodがGuaranteed QoSクラスの基準に満たない場合。
* Pod内の1つ以上のコンテナがメモリーまたはCPUの要求を与えられている場合。

以下に1つのコンテナをもつPodの設定ファイルを示します。コンテナには200MiBのメモリー制限と100MiBのメモリー要求を与えます。

{{< codenew file="pods/qos/qos-pod-2.yaml" >}}

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

この出力では、KubernetesがPodにBurstable QoSクラスを与えたことを示しています。

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

Podを削除してください:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## BestEffortのQoSクラスを割り当てたPodを作成する

PodにBestEffort QoSクラスを与えるには、Pod内のコンテナにはメモリーやCPUの制限や要求を指定してはなりません。

以下に1つのコンテナをもつPodの設定ファイルを示します。コンテナにはメモリーやCPUの制限や要求がありません:

{{< codenew file="pods/qos/qos-pod-3.yaml" >}}

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

この出力では、KubernetesがPodにBestEffort QoSクラスを与えたことを示しています。

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

Podを削除してください:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## 2つのコンテナを含むPodを作成する

以下に2つのコンテナをもつPodの設定ファイルを示します。一方のコンテナは200MiBのメモリー要求を指定し、もう一方のコンテナには要求や制限を指定しません。

{{< codenew file="pods/qos/qos-pod-4.yaml" >}}

このPodがBurstable QoSクラスの基準を満たしていることに注目してください。つまり、Guaranteed QoSクラスの基準に満たしておらず、一方のコンテナにはメモリー要求を与えられています。

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

この出力では、KubernetesがPodにBurstable QoSクラスを与えたことを示しています:

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

Podを削除してください:

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

## クリーンアップ

namespaceを削除してください:

```shell
kubectl delete namespace qos-example
```



## {{% heading "whatsnext" %}}



### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナとPodにCPUリソースを割り当てる](/ja/docs/tasks/configure-pod-container/assign-cpu-resource/)

### クラスター管理者向け

* [Namespaceにメモリー要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceにCPU要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに最小および最大メモリー量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceに最小および最大のCPU使用量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceにメモリーおよびCPUのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [NamespaceにPodのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)

* [ノードのトポロジー管理ポリシーを制御する](/docs/tasks/administer-cluster/topology-manager/)





