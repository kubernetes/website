---
title: 配置命名空間下 Pod 配額
content_type: task
weight: 60
description: >-
  限制在命名空間中創建的 Pod 數量。
---

<!--
title: Configure a Pod Quota for a Namespace
content_type: task
weight: 60
description: >-
  Restrict how many Pods you can create within a namespace.
-->

<!-- overview -->

<!--
This page shows how to set a quota for the total number of Pods that can run
in a {{< glossary_tooltip text="Namespace" term_id="namespace" >}}. You specify quotas in a
[ResourceQuota](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
object.
-->
本文主要介紹如何在{{< glossary_tooltip text="命名空間" term_id="namespace" >}}中設置可運行 Pod 總數的配額。
你可以通過使用
[ResourceQuota](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
對象來配置配額。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.
-->
在你的集羣裏你必須要有創建命名空間的權限。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建一個命名空間  {#create-a-namespace}

首先創建一個命名空間，這樣可以將本次操作中創建的資源與集羣其他資源隔離開來。

```shell
kubectl create namespace quota-pod-example
```

<!--
## Create a ResourceQuota

Here is an example manifest for a ResourceQuota:
-->
## 創建 ResourceQuota {#create-a-resourcequota}

下面是 ResourceQuota 的示例清單：

{{% code_sample file="admin/resource/quota-pod.yaml" %}}

<!--
Create the ResourceQuota:
-->
創建 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the ResourceQuota:
-->
查看資源配額的詳細信息：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that the namespace has a quota of two Pods, and that currently there are
no Pods; that is, none of the quota is used.
-->
從輸出的信息我們可以看到，該命名空間下 Pod 的配額是 2 個，目前創建的 Pod 數爲 0，
配額使用率爲 0。

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

<!--
Here is an example manifest for a {{< glossary_tooltip term_id="deployment" >}}:
-->
下面是一個 {{< glossary_tooltip term_id="deployment" >}} 的示例清單：

{{% code_sample file="admin/resource/quota-pod-deployment.yaml" %}}

<!--
In that manifest, `replicas: 3` tells Kubernetes to attempt to create three new Pods, all
running the same application.

Create the Deployment:
-->
在清單中，`replicas: 3` 告訴 Kubernetes 嘗試創建三個新的 Pod，
且運行相同的應用。

創建這個 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the Deployment:
-->
查看 Deployment 的詳細信息：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that even though the Deployment specifies three replicas, only two
Pods were created because of the quota you defined earlier:
-->
從輸出的信息顯示，即使 Deployment 指定了三個副本，
也只有兩個 Pod 被創建，原因是之前已經定義了配額：

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

<!--
### Choice of resource

In this task you have defined a ResourceQuota that limited the total number of Pods, but
you could also limit the total number of other kinds of object. For example, you
might decide to limit how many {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}
that can live in a single namespace.
-->
### 資源的選擇  {#choice-of-resource}
在此任務中，你定義了一個限制 Pod 總數的 ResourceQuota，
你也可以限制其他類型對象的總數。
例如，你可以限制在一個命名空間中可以創建的 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} 的數量。

<!--
## Clean up

Delete your namespace:
-->
## 清理 {#clean-up}

刪除你的命名空間：

```shell
kubectl delete namespace quota-pod-example
```

## {{% heading "whatsnext" %}}

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)
-->
### 集羣管理人員參考 {#for-cluster-administrators}

* [爲命名空間配置默認的內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲命名空間配置默認的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲命名空間配置內存的最小值和最大值約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲命名空間配置 CPU 的最小值和最大值約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲命名空間配置內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [爲 API 對象的設置配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 應用開發人員參考 {#for-app-developers}

* [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [給容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [配置 Pod 的服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)
