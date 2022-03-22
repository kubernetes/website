---
title: ネームスペースのデフォルトのメモリ要求と制限を設定する
content_type: task
weight: 10
---

<!-- overview -->

このページでは、ネームスペースのデフォルト・メモリ要求と制限を設定する方法を説明します。
デフォルトのメモリ制限を持つネームスペースにコンテナが作成され、コンテナが独自のメモリ制限を指定しない場合、コンテナにはデフォルトのメモリ制限が割り当てられます。
Kubernetesは、このトピックで後ほど説明する特定の条件下で、デフォルトのメモリ要求を割り当てます。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスターの各ノードには、最低でも2GiBのメモリが必要です。



<!-- steps -->

## ネームスペースの作成

この演習で作成したリソースがクラスターの他の部分から分離されるように、ネームスペースを作成します。

```shell
kubectl create namespace default-mem-example
```

## LimitRangeとPodの作成

以下は、LimitRangeの設定ファイルです。デフォルトのメモリ要求とデフォルトのメモリ制限を指定しています。

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

default-mem-exampleネームスペースにLimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

default-mem-example名前空間でコンテナを作成し、コンテナがメモリ要求とメモリ制限の値を独自に指定しない場合、コンテナにはデフォルトのメモリ要求256MiBとデフォルトのメモリ制限512MiBが与えられます。
以下は、コンテナを1つ持つPodの設定ファイルです。コンテナは、メモリ要求とメモリ制限を指定していません。

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

出力はPodのコンテナのメモリ要求が256MiBで、メモリ制限が512MiBであることを示しています。
これらはLimitRangeで指定されたデフォルト値です。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

Podを削除します:

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

## 制限を指定し、要求を指定しない場合

以下は1つのコンテナを持つPodの設定ファイルです。コンテナはメモリ制限を指定しますが、メモリ要求は指定しません。

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

Podを作成します:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

コンテナのメモリ要求がそのメモリ制限に一致するように設定されていることを示しています。
コンテナにはデフォルトのメモリリクエスト値である256Miが割り当てられていないことに注意してください。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## 要求を指定し、制限を指定しない場合

1つのコンテナを持つPodの設定ファイルです。コンテナはメモリ要求を指定しますが、メモリ制限は指定しません。

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

コンテナのメモリ要求は、コンテナの設定ファイルで指定された値に設定されていることを示しています。
コンテナのメモリ制限は、ネームスペースのデフォルトのメモリ制限である512Miに設定されています。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

## デフォルトのメモリ制限と要求の動機

ネームスペースにリソースクォータがある場合、メモリ制限のデフォルト値を設定しておくと便利です。

以下はリソースクォータがネームスペースに課す制限のうちの2つです。

* ネームスペースで実行されるすべてのコンテナは、独自のメモリ制限を持つ必要があります。
* ネームスペース内のすべてのコンテナで使用されるメモリの総量は、指定された制限を超えてはなりません。

コンテナが独自のメモリ制限を指定しない場合、デフォルトの制限が与えられ、その後、クォータによって制限されているネームスペースでの実行が許可されるようになります。

## クリーンアップ

ネームスペースを削除します:

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### クラスター管理者向け

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)




