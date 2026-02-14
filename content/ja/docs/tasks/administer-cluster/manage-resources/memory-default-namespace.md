---
title: Namespaceのデフォルトのメモリ要求と制限を設定する
content_type: task
weight: 10
description: >-
  Namespaceのデフォルトのメモリリソース制限を定義して、そのNamespace内のすべての新しいPodにメモリリソース制限が設定されるようにします。
---

<!-- overview -->

このページでは、{{< glossary_tooltip text="Namespace" term_id="namespace" >}}のデフォルトのメモリ要求と制限を設定する方法を説明します。

KubernetesクラスターはNamespaceに分割することができます。デフォルトのメモリ[制限](/ja/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を持つNamespaceがあり、独自のメモリ制限を指定しないコンテナでPodを作成しようとすると、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}はそのコンテナにデフォルトのメモリ制限を割り当てます。

Kubernetesは、このトピックで後ほど説明する特定の条件下で、デフォルトのメモリ要求を割り当てます。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

クラスターにNamespaceを作成するには、アクセス権が必要です。

クラスターの各ノードには、最低でも2GiBのメモリが必要です。



<!-- steps -->

## Namespaceの作成 {#create-a-namespace}

この演習で作成したリソースがクラスターの他の部分から分離されるように、Namespaceを作成します。

```shell
kubectl create namespace default-mem-example
```

## LimitRangeとPodの作成 {#create-a-limitrange-and-a-pod}

以下は、{{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}のマニフェストの例です。このマニフェストでは、デフォルトのメモリ要求とデフォルトのメモリ制限を指定しています。

{{% codenew file="admin/resource/memory-defaults.yaml" %}}

default-mem-example NamespaceにLimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

default-mem-exampleNamespaceでPodを作成し、そのPod内のコンテナがメモリ要求とメモリ制限の値を独自に指定しない場合、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}はデフォルト値のメモリ要求256MiBとメモリ制限512MiBを適用します。

以下は、コンテナを1つ持つPodのマニフェストの例です。コンテナは、メモリ要求とメモリ制限を指定していません。

{{% codenew file="admin/resource/memory-defaults-pod.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

この出力は、Podのコンテナのメモリ要求が256MiBで、メモリ制限が512MiBであることを示しています。
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

## コンテナの制限を指定し、要求を指定しない場合 {#what-if-you-specify-a-containers-limit-but-not-its-request}

以下は1つのコンテナを持つPodのマニフェストです。コンテナはメモリ制限を指定しますが、メモリ要求は指定しません。

{{% codenew file="admin/resource/memory-defaults-pod-2.yaml" %}}

Podを作成します:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

この出力は、コンテナのメモリ要求がそのメモリ制限に一致するように設定されていることを示しています。
コンテナにはデフォルトのメモリ要求値である256Miが割り当てられていないことに注意してください。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## コンテナの要求を指定し、制限を指定しない場合 {#what-if-you-specify-a-containers-request-but-not-its-limit}

1つのコンテナを持つPodのマニフェストです。コンテナはメモリ要求を指定しますが、メモリ制限は指定しません。

{{% codenew file="admin/resource/memory-defaults-pod-3.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

この出力は、コンテナのメモリ要求が、コンテナのマニフェストで指定された値に設定されていることを示しています。
コンテナは512MiB以下のメモリを使用するように制限されていて、これはNamespaceのデフォルトのメモリ制限と一致します。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

`LimitRange`は、適用するデフォルト値の一貫性をチェック**しません**。これは、`LimitRange`によって設定された _制限_ のデフォルト値が、クライアントがAPIサーバーに送信するspecでコンテナに指定された _リクエスト_ 値よりも小さい可能性があることを意味します。その場合、最終的なPodはスケジュール可能になりません。
詳細については、[リソース制限とリクエストの制約](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests)を参照してください。

{{< /note >}}

## デフォルトのメモリ制限と要求の動機 {#motivation-for-default-memory-limits-and-requests}

Namespaceにメモリ{{< glossary_tooltip text="リソースクォータ" term_id="resource-quota" >}}が設定されている場合、メモリ制限のデフォルト値を設定しておくと便利です。

以下はリソースクォータがNamespaceに課す制限のうちの3つです。

* Namespaceで実行されるすべてのPodについて、Podとその各コンテナにメモリ制限を設ける必要があります(Pod内のすべてのコンテナに対してメモリ制限を指定すると、Kubernetesはそのコンテナの制限を合計することでPodレベルのメモリ制限を推測することができます)。
* メモリ制限は、当該Podがスケジュールされているノードのリソース予約を適用します。Namespace内のすべてのPodに対して予約されるメモリの総量は、指定された制限を超えてはなりません。
* また、Namespace内のすべてのPodが実際に使用するメモリの総量も、指定された制限を超えてはなりません。

LimitRangeの追加時:

コンテナを含む、そのNamespace内のいずれかのPodが独自のメモリ制限を指定していない場合、コントロールプレーンはそのコンテナにデフォルトのメモリ制限を適用し、メモリのResourceQuotaによって制限されているNamespace内でPodを実行できるようにします。

## クリーンアップ {#clean-up}

Namespaceを削除します:

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### クラスター管理者向け {#for-cluster-administrators}

* [NamespaceのデフォルトCPUリクエストと制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに対する最小および最大メモリ制約の構成](/ja/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceの最小および最大CPU制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceのメモリおよびCPUクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [NamespaceのPodクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け {#for-app-developers}

* [コンテナおよびPodへのメモリリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodレベルのCPUおよびメモリリソースの割り当て](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [PodにQuality of Serviceを設定する](/ja/docs/tasks/configure-pod-container/quality-service-pod/)
