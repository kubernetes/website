---
title: ネームスペースのデフォルトのCPU要求と制限を設定する
content_type: task
weight: 20
description: >-
  ネームスペースのデフォルトのCPU要求と制限を定義して、そのネームスペース内の
  すべての新しいPodにCPUリソース制限が設定されるようにします。
---

<!-- overview -->

このページでは、{{< glossary_tooltip text="ネームスペース" term_id="namespace" >}}の
デフォルトのCPU要求と制限を設定する方法を説明します。

Kubernetesクラスターはネームスペースに分割することができます。デフォルトのCPU
[制限](/ja/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を持つ
ネームスペースがあり、
独自のCPU制限を指定しないコンテナでPodを作成しようとすると、
{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}は
そのコンテナにデフォルトのCPU制限を割り当てます。

Kubernetesは、このトピックで後ほど説明する特定の条件下で、
デフォルトのCPU[要求](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を
割り当てます。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

クラスターにネームスペースを作成するには、アクセス権が必要です。

もしKubernetesにおいて1.0 CPUが何を意味するのかが分からなければ、
[CPUの意味](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)をご一読ください。

<!-- steps -->

## ネームスペースの作成

この演習で作成したリソースがクラスターの他の部分から分離されるように、
ネームスペースを作成します:

```shell
kubectl create namespace default-cpu-example
```

## LimitRangeとPodの作成

以下は、{{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}のマニフェストの例です。
このマニフェストでは、デフォルトのCPU要求とデフォルトのCPU制限を指定しています。

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

default-cpu-exampleネームスペースにLimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

default-cpu-exampleネームスペースでPodを作成し、
そのPod内のコンテナがCPU要求とCPU制限の値を独自に指定しない場合、
コントロールプレーンはデフォルト値の
CPU要求0.5とCPU制限1を適用します。

以下は、コンテナを1つ持つPodのマニフェストの例です。
コンテナは、CPU要求とCPU制限を指定していません。

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

Podの仕様を表示します:

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

この出力は、PodのコンテナのCPU要求が500m`cpu`(「500ミリCPU」と読みます) で、
CPU制限が1`cpu`であることを示しています。
これらはLimitRangeで指定されたデフォルト値です。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

## コンテナの制限を指定し、要求を指定しない場合

以下は1つのコンテナを持つPodのマニフェストです。
コンテナはCPU制限を指定しますが、CPU要求は指定しません。

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

Podを作成します:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

作成したPodの[仕様](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
を表示します:

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

この出力は、コンテナのCPU要求がそのCPU制限に一致するように設定されていることを示しています。
コンテナにはデフォルトのCPU要求値である0.5`cpu`が割り当てられていないことに注意してください。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## コンテナの要求を指定し、制限を指定しない場合

以下は1つのコンテナを持つPodのマニフェストです。
コンテナはCPU要求を指定しますが、CPU制限は指定しません。

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

作成したPodの仕様を表示します:

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

この出力は、コンテナのCPU要求がPodを作成した際に指定した値に
設定されていることを示しています(言い換えると、マニフェストと一致しています)。
しかし、コンテナのCPU制限は1`cpu`に設定されており、
これはネームスペースのデフォルトのCPU制限と一致します。

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## デフォルトのCPU制限と要求の動機

ネームスペースにCPU{{< glossary_tooltip text="リソースクォータ" term_id="resource-quota" >}}が
設定されている場合、
CPU制限のデフォルト値があると便利です。
以下はCPUリソースクォータがネームスペースに課す制限のうちの2つです。

* ネームスペースで実行されるすべてのPodについて、その各コンテナにCPU制限を設ける必要があります。
* CPU制限は、当該Podがスケジュールされているノードに対してリソースの予約を適用します。  
  ネームスペース内のすべてのPodに対して予約されるCPUの総量は、
  指定された制限を超えてはなりません。

LimitRangeの追加時:

そのネームスペース内のいずれかのコンテナを持つPodが独自のCPU制限を指定していない場合、
コントロールプレーンはそのコンテナにデフォルトのCPU制限を適用します。
CPUのResourceQuotaによって制限されているネームスペース内でもPodが実行できるようになります。


## クリーンアップ

ネームスペースを削除します:

```shell
kubectl delete namespace default-cpu-example
```



## {{% heading "whatsnext" %}}


### クラスター管理者向け

* [ネームスペースのデフォルトのメモリー要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Namespaceに対する最小および最大メモリー制約の構成](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [PodにQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)




