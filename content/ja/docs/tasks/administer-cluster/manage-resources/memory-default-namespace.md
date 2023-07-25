---
title: ネームスペースのデフォルトのメモリー要求と制限を設定する
content_type: task
weight: 10
description: >-
  ネームスペースのデフォルトのメモリーリソース制限を定義して、そのネームスペース内のすべての新しいPodにメモリーリソース制限が設定されるようにします。
---

<!-- overview -->

このページでは、{{< glossary_tooltip text="ネームスペース" term_id="namespace" >}}のデフォルトのメモリー要求と制限を設定する方法を説明します。

Kubernetesクラスターはネームスペースに分割することができます。デフォルトのメモリー[制限](/ja/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を持つネームスペースがあり、独自のメモリー制限を指定しないコンテナでPodを作成しようとすると、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}はそのコンテナにデフォルトのメモリー制限を割り当てます。

Kubernetesは、このトピックで後ほど説明する特定の条件下で、デフォルトのメモリー要求を割り当てます。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

クラスターにネームスペースを作成するには、アクセス権が必要です。

クラスターの各ノードには、最低でも2GiBのメモリーが必要です。



<!-- steps -->

## ネームスペースの作成

この演習で作成したリソースがクラスターの他の部分から分離されるように、ネームスペースを作成します。

```shell
kubectl create namespace default-mem-example
```

## LimitRangeとPodの作成

以下は、{{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}のマニフェストの例です。このマニフェストでは、デフォルトのメモリー要求とデフォルトのメモリー制限を指定しています。

{{% codenew file="admin/resource/memory-defaults.yaml" %}}

default-mem-exampleネームスペースにLimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

default-mem-exampleネームスペースでPodを作成し、そのPod内のコンテナがメモリー要求とメモリー制限の値を独自に指定しない場合、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}はデフォルト値のメモリー要求256MiBとメモリー制限512MiBを適用します。

以下は、コンテナを1つ持つPodのマニフェストの例です。コンテナは、メモリー要求とメモリー制限を指定していません。

{{% codenew file="admin/resource/memory-defaults-pod.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

この出力は、Podのコンテナのメモリー要求が256MiBで、メモリー制限が512MiBであることを示しています。
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

## コンテナの制限を指定し、要求を指定しない場合

以下は1つのコンテナを持つPodのマニフェストです。コンテナはメモリー制限を指定しますが、メモリー要求は指定しません。

{{% codenew file="admin/resource/memory-defaults-pod-2.yaml" %}}

Podを作成します:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

この出力は、コンテナのメモリー要求がそのメモリー制限に一致するように設定されていることを示しています。
コンテナにはデフォルトのメモリー要求値である256Miが割り当てられていないことに注意してください。

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## コンテナの要求を指定し、制限を指定しない場合

1つのコンテナを持つPodのマニフェストです。コンテナはメモリー要求を指定しますが、メモリー制限は指定しません。

{{% codenew file="admin/resource/memory-defaults-pod-3.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

この出力は、コンテナのメモリー要求が、コンテナのマニフェストで指定された値に設定されていることを示しています。
コンテナは512MiB以下のメモリーを使用するように制限されていて、これはネームスペースのデフォルトのメモリー制限と一致します。

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

## デフォルトのメモリー制限と要求の動機

ネームスペースにメモリー{{< glossary_tooltip text="リソースクォータ" term_id="resource-quota" >}}が設定されている場合、メモリー制限のデフォルト値を設定しておくと便利です。

以下はリソースクォータがネームスペースに課す制限のうちの2つです。

* ネームスペースで実行されるすべてのPodについて、Podとその各コンテナにメモリー制限を設ける必要があります(Pod内のすべてのコンテナに対してメモリー制限を指定すると、Kubernetesはそのコンテナの制限を合計することでPodレベルのメモリー制限を推測することができます)。
* メモリー制限は、当該Podがスケジュールされているノードのリソース予約を適用します。ネームスペース内のすべてのPodに対して予約されるメモリーの総量は、指定された制限を超えてはなりません。
* また、ネームスペース内のすべてのPodが実際に使用するメモリーの総量も、指定された制限を超えてはなりません。

LimitRangeの追加時:

コンテナを含む、そのネームスペース内のいずれかのPodが独自のメモリー制限を指定していない場合、コントロールプレーンはそのコンテナにデフォルトのメモリー制限を適用し、メモリーのResourceQuotaによって制限されているネームスペース内でPodを実行できるようにします。

## クリーンアップ

ネームスペースを削除します:

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### クラスター管理者向け

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに対する最小および最大メモリー制約の構成](/ja/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodにQuality of Serviceを設定する](/ja/docs/tasks/configure-pod-container/quality-service-pod/)
