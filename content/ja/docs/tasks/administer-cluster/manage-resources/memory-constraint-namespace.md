---
title: Namespaceに対する最小および最大メモリー制約の構成

content_type: task
weight: 30
---


<!-- overview -->

このページでは、Namespaceで実行されるコンテナが使用するメモリーの最小値と最大値を設定する方法を説明します。
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core) で最小値と最大値のメモリー値を指定します。
PodがLimitRangeによって課される制約を満たさない場合、そのNamespaceではPodを作成できません。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスター内の各ノードには、少なくとも1GiBのメモリーが必要です。


<!-- steps -->

## Namespaceの作成

この演習で作成したリソースがクラスターの他の部分から分離されるように、Namespaceを作成します。


```shell
kubectl create namespace constraints-mem-example
```

## LimitRangeとPodを作成

LimitRangeの設定ファイルです。

{{% codenew file="admin/resource/memory-constraints.yaml" %}}

LimitRangeを作成します。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

LimitRangeの詳細情報を表示します。


```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

出力されるのは、予想通りメモリー制約の最小値と最大値を示しています。
しかし、LimitRangeの設定ファイルでデフォルト値を指定していないにもかかわらず、
自動的に作成されていることに気づきます。


```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```


constraints-mem-exampleNamespaceにコンテナが作成されるたびに、
Kubernetesは以下の手順を実行するようになっています。

* コンテナが独自のメモリー要求と制限を指定しない場合は、デフォルトのメモリー要求と制限をコンテナに割り当てます。

* コンテナに500MiB以上のメモリー要求があることを確認します。

* コンテナのメモリー制限が1GiB以下であることを確認します。

以下は、1つのコンテナを持つPodの設定ファイルです。設定ファイルのコンテナ(containers)では、600MiBのメモリー要求と800MiBのメモリー制限が指定されています。これらはLimitRangeによって課される最小と最大のメモリー制約を満たしています。


{{% codenew file="admin/resource/memory-constraints-pod.yaml" %}}

Podの作成

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

Podのコンテナが実行されていることを確認します。

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

Podの詳細情報を見ます

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

出力は、コンテナが600MiBのメモリ要求と800MiBのメモリー制限になっていることを示しています。これらはLimitRangeによって課される制約を満たしています。


```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

Podを消します。

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## 最大メモリ制約を超えるPodの作成の試み

これは、1つのコンテナを持つPodの設定ファイルです。コンテナは800MiBのメモリー要求と1.5GiBのメモリー制限を指定しています。


{{% codenew file="admin/resource/memory-constraints-pod-2.yaml" %}}

Podを作成してみます。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

出力は、コンテナが大きすぎるメモリー制限を指定しているため、Podが作成されないことを示しています。


```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## 最低限のメモリ要求を満たさないPodの作成の試み


これは、1つのコンテナを持つPodの設定ファイルです。コンテナは100MiBのメモリー要求と800MiBのメモリー制限を指定しています。


{{% codenew file="admin/resource/memory-constraints-pod-3.yaml" %}}

Podを作成してみます。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

出力は、コンテナが小さすぎるメモリー要求を指定しているため、Podが作成されないことを示しています。

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## メモリ要求や制限を指定しないPodの作成


これは、1つのコンテナを持つPodの設定ファイルです。コンテナはメモリー要求を指定しておらず、メモリー制限も指定していません。

{{% codenew file="admin/resource/memory-constraints-pod-4.yaml" %}}

Podを作成します。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

Podの詳細情報を見ます

```
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

出力を見ると、Podのコンテナのメモリ要求は1GiB、メモリー制限は1GiBであることがわかります。
コンテナはどのようにしてこれらの値を取得したのでしょうか？


```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

コンテナが独自のメモリー要求と制限を指定していなかったため、LimitRangeから与えられのです。
コンテナが独自のメモリー要求と制限を指定していなかったため、LimitRangeから[デフォルトのメモリー要求と制限](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)が与えられたのです。

この時点で、コンテナは起動しているかもしれませんし、起動していないかもしれません。このタスクの前提条件は、ノードが少なくとも1GiBのメモリーを持っていることであることを思い出してください。それぞれのノードが1GiBのメモリーしか持っていない場合、どのノードにも1GiBのメモリー要求に対応するのに十分な割り当て可能なメモリーがありません。たまたま2GiBのメモリーを持つノードを使用しているのであれば、おそらく1GiBのメモリーリクエストに対応するのに十分なスペースを持っていることになります。


Podを削除します。

```
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## 最小および最大メモリー制約の強制

LimitRangeによってNamespaceに課される最大および最小のメモリー制約は、Podが作成または更新されたときにのみ適用されます。LimitRangeを変更しても、以前に作成されたPodには影響しません。


## 最小・最大メモリー制約の動機


クラスター管理者としては、Podが使用できるメモリー量に制限を課したいと思うかもしれません。


例:

* クラスター内の各ノードは2GBのメモリーを持っています。クラスター内のどのノードもその要求をサポートできないため、2GB以上のメモリーを要求するPodは受け入れたくありません。


* クラスターは運用部門と開発部門で共有されています。 本番用のワークロードでは最大8GBのメモリーを消費しますが、開発用のワークロードでは512MBに制限したいとします。本番用と開発用に別々のNamespaceを作成し、それぞれのNamespaceにメモリー制限を適用します。

## クリーンアップ

Namespaceを削除します。

```shell
kubectl delete namespace constraints-mem-example
```



## {{% heading "whatsnext" %}}


### クラスター管理者向け

* [名前空間に対するデフォルトのメモリー要求と制限の構成](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [名前空間に対するデフォルトのCPU要求と制限の構成](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [名前空間に対する最小および最大CPU制約の構成](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [名前空間に対するメモリーとCPUのクォータの構成](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [名前空間に対するPodクォータの設定](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータの設定](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け

* [コンテナとPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナとPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodのQoS(サービス品質)を設定](/ja/docs/tasks/configure-pod-container/quality-service-pod/)
