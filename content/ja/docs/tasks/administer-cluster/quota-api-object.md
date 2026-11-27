---
title: APIオブジェクトのクォータを設定する
content_type: task
weight: 130
---


<!-- overview -->

このページでは、PersistentVolumeClaimやServiceなどのAPIオブジェクトに対して、クォータを設定する方法を示します。
クォータは、Namespaceに作成可能な特定の種類のオブジェクトの数を制限します。
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)を使用してクォータを設定できます。


## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Namespaceを作成する {#create-a-namespace}

この演習で作成するリソースをクラスター内の他のリソースから分離するために、Namespaceを作成します。

```shell
kubectl create namespace quota-object-example
```

## ResourceQuotaを作成する {#create-a-resourcequota}

ResourceQuotaオブジェクトの設定ファイルは以下のとおりです:

{{% code_sample file="admin/resource/quota-objects.yaml" %}}

ResourceQuotaを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

ResourceQuotaの詳細な情報を確認します:

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

この出力は、quota-object-example NamespaceにおいてPersistentVolumeClaimを最大1つ、LoadBalancerタイプのServiceを最大2つ作成できて、NodePortタイプのServiceを作成できないことを示しています。

```yaml
status:
  hard:
    persistentvolumeclaims: "1"
    services.loadbalancers: "2"
    services.nodeports: "0"
  used:
    persistentvolumeclaims: "0"
    services.loadbalancers: "0"
    services.nodeports: "0"
```

## PersistentVolumeClaimを作成する {#create-a-persistentvolumeclaim}

PersistentVolumeClaimオブジェクトの設定ファイルは以下のとおりです:

{{% code_sample file="admin/resource/quota-objects-pvc.yaml" %}}

PersistentVolumeClaimを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

PersistentVolumeClaimが作成されたことを確認します:

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

この出力は、PersistentVolumeClaimが存在し、ステータスがPendingであることを示しています:

```
NAME             STATUS
pvc-quota-demo   Pending
```

## 2つ目のPersistentVolumeClaimの作成を試みる {#attempt-to-create-a-second-persistentvolumeclaim}

2つ目のPersistentVolumeClaimオブジェクトの設定ファイルは以下のとおりです:

{{% code_sample file="admin/resource/quota-objects-pvc-2.yaml" %}}

2つ目のPersistentVolumeClaimを作成してみます:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

この出力は2つ目のPersistentVolumeClaimは作成されなかったことを示しています。
Namespaceにおけるクォータを超えるためです。

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

## 注記 {#notes}

クォータによって制限されるAPIリソースを示す文字列は以下のとおりです:

<table>
<tr><th>文字列</th><th>APIオブジェクト</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services"</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<tr><td>"services.nodeports"</td><td>NodePortタイプのService</td></tr>
<tr><td>"services.loadbalancers"</td><td>LoadBalancerタイプのService</td></tr>
</table>

## クリーンアップ {#clean-up}

Namespaceを削除します:

```shell
kubectl delete namespace quota-object-example
```


## {{% heading "whatsnext" %}} {#what-s-next}


### クラスター管理者向け {#for-cluster-administrators}

* [Namespaceのデフォルトのメモリ要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceのデフォルトのCPU要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに対する最小および最大メモリー制約の構成](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceの最小および最大CPU制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceのメモリおよびCPUクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [NamespaceのPodクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### アプリケーション開発者向け {#for-app-developers}

* [コンテナおよびPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodレベルのCPUおよびメモリリソースの割り当て](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [PodにQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)
