---
title: Namespaceに対してメモリおよびCPUクォータを設定する
content_type: task
weight: 50
description: >-
  Namespaceに対するメモリおよびCPUリソース制限の全体を定義します。
---


<!-- overview -->

このページでは、{{< glossary_tooltip text="Namespace" term_id="namespace" >}}内で実行されているすべてのPodが使用できるメモリとCPUの総量に対するクォータを設定する方法を説明します。クォータは[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)オブジェクトで指定します。




## {{% heading "prerequisites" %}}

## 前提条件 {#prerequisites}

{{< include "task-tutorial-prereqs.md" >}}

クラスター内でNamespaceを作成できる権限が必要です。

クラスター内の各ノードには、少なくとも1 GiBのメモリが必要です。


<!-- steps -->

## Namespaceの作成 {#create-a-namespace}

この演習で作成するリソースをクラスター内の他のリソースから分離するために、Namespaceを作成します。

```shell
kubectl create namespace quota-mem-cpu-example
```

## ResourceQuotaの作成 {#create-a-resourcequota}

ResourceQuotaの例として、次のマニフェストを示します:

{{% code_sample file="admin/resource/quota-mem-cpu.yaml" %}}

ResourceQuotaを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

ResourceQuotaの詳細情報を参照します:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

ResourceQuotaは、quota-mem-cpu-example Namespaceに対して次の要件を課します:

* そのNamespace内のすべてのPodについて、各コンテナーはメモリリクエスト、メモリ制限、CPUリクエスト、CPU制限を持っている必要があります。
* そのNamespace内のすべてのPodのメモリリクエストの合計は、1 GiBを超えてはいけません。
* そのNamespace内のすべてのPodのメモリ制限の合計は、2 GiBを超えてはいけません。
* そのNamespace内のすべてのPodのCPUリクエストの合計は、1 CPUを超えてはいけません。
* そのNamespace内のすべてのPodのCPU制限の合計は、2 CPUを超えてはいけません。

Kubernetesにおける「1 CPU」の意味については、[CPUの意味](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)を参照してください。

## Podを作成 {#create-a-pod}

Podの例として、次のマニフェストを示します:

{{% code_sample file="admin/resource/quota-mem-cpu-pod.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

Verify that the Pod is running and that its (only) container is healthy:

Podが実行中であり、その(唯一の)コンテナが正常であることを検証します:

```shell
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

再度、ResourceQuotaの詳細情報を参照します:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

出力には、クォータとそのクォータのうちどれだけが使用されているかが表示されます。PodのメモリとCPUのリクエストおよび制限がクォータを超えていないことがわかります。

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

`jq`ツールがある場合、[JSONPath](/docs/reference/kubectl/jsonpath/)を使用して`used`の値だけをクエリし、**さらに**出力を見やすく整形することもできます。例えば:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example -o jsonpath='{ .status.used }' | jq .
```

## 2つ目のPodを作成する試み {#attempt-to-create-a-second-pod}

2つ目のPodのマニフェストを次に示します:

{{% code_sample file="admin/resource/quota-mem-cpu-pod-2.yaml" %}}

このマニフェストでは、Podのメモリリクエストが700 MiBであることがわかります。使用済みのメモリリクエストとこの新しいメモリリクエストを合計すると、メモリリクエストのクォータを超過することに注意してください: 600 MiB + 700 MiB > 1 GiB。

このPodを作成しようとします:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

2つ目のPodは作成されません。この出力から、2つ目のPodを作成するとメモリリクエストの合計がメモリ要求クォータを超過することがわかります。

```
Error from server (Forbidden): error when creating "examples/admin/resource/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

## 考察 {#discussion}

この演習で見たように、ResourceQuotaを使用してNamespace内で実行されているすべてのPodのメモリリクエストの合計を制限できます。メモリ制限、CPUリクエスト、CPU制限の合計も制限できます。

Namespace内のリソース使用量の合計を管理する代わりに、個々のPodやそれらのPod内のコンテナを制限したい場合があります。そのような制限を実現するには、[LimitRange](/docs/concepts/policy/limit-range/)を使用します。

## クリーンアップ {#clean-up}

Namespaceを削除します:

```shell
kubectl delete namespace quota-mem-cpu-example
```



## {{% heading "whatsnext" %}}

### クラスター管理者向け {#for-cluster-administrators}

* [Namespaceのデフォルトメモリリクエストと制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceのデフォルトCPUリクエストと制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceの最小および最大メモリ制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceの最小および最大CPU制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceのPodクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け {#for-app-developers}

* [コンテナおよびPodにメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodにCPUリソースを割り当てる](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodレベルのCPUおよびメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [PodのQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)







