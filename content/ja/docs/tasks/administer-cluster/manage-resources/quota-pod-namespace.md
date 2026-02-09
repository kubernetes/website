---
title: Namespaceに対するPodクォータを設定する
content_type: task
weight: 60
description: >-
  Namespace内で作成できるPodの数を制限します。
---


<!-- overview -->

このページでは、{{< glossary_tooltip text="Namespace" term_id="namespace" >}}内で実行できるPodの総数に対するクォータを設定する方法を説明します。
クォータは[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)オブジェクト内で指定します。




## {{% heading "prerequisites" %}}

## 前提条件 {#prerequisites}


{{< include "task-tutorial-prereqs.md" >}}

クラスター内でNamespaceを作成できる権限が必要です。

<!-- steps -->

## Namespaceを作成 {#create-a-namespace}

この演習で作成するリソースをクラスター内の他のリソースから分離するために、Namespaceを作成します。

```shell
kubectl create namespace quota-pod-example
```

## ResourceQuotaを作成 {#create-a-resourcequota}

ResourceQuotaの例として、次のマニフェストを示します:

{{% code_sample file="admin/resource/quota-pod.yaml" %}}

ResourceQuotaを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

ResourceQuotaの詳細情報を参照します:

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

出力結果には、このNamespaceには2つのPodのクォータが設定されており、現在Podが存在しないこと、つまりクォータが使用されていないことを示しています。

```yaml
spec:
  hard:
    pods: "2"
status:
  hard:
    pods: "2"
  used:
    pods: "0"
```

{{< glossary_tooltip term_id="deployment" >}}の例として、次のマニフェストを示します:

{{% code_sample file="admin/resource/quota-pod-deployment.yaml" %}}


このマニフェストは、`replicas: 3`により、Kubernetesは同じアプリケーションを実行する3つの新しいPodを作成しようとしていることを示しています。

Deploymentを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

Deploymentの詳細情報を参照します:

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

出力結果には、Deploymentで3つのレプリカが指定されているにもかかわらず、先ほど定義したクォータにより、2つのPodしか作成されていないことを示しています:

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2021-04-02T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

### リソースの選択 {#choice-of-resource}

このタスクでは、Podの総数を制限するResourceQuotaを定義しましたが、他の種類のオブジェクトの総数も制限できます。
例えば、あなたは単一のNamespace内に存在できる{{< glossary_tooltip text="CronJob" term_id="cronjob" >}}の数を制限するといった決定を行うかもしれません。

## クリーンアップ {#clean-up}

Namespaceを削除します:

```shell
kubectl delete namespace quota-pod-example
```



## {{% heading "whatsnext" %}}

### クラスター管理者向け {#for-cluster-administrators}

* [Namespaceのデフォルトメモリリクエストと制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [NamespaceのデフォルトCPUリクエストと制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Namespaceの最小および最大メモリ制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Namespaceの最小および最大CPU制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [NamespaceのメモリおよびCPUクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け {#for-app-developers}

* [コンテナーおよびPodにメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [コンテナーおよびPodにCPUリソースを割り当てる](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [PodレベルのCPUおよびメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [PodのQuality of Serviceを構成する](/docs/tasks/configure-pod-container/quality-service-pod/)







