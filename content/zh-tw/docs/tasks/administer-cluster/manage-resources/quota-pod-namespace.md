---
title: 配置名稱空間下 Pod 配額
content_type: task
weight: 60
description: >-
  限制在名稱空間中建立的 Pod 數量。
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
本文主要介紹如何在{{< glossary_tooltip text="名稱空間" term_id="namespace" >}}中設定可執行 Pod 總數的配額。
你可以透過使用
[ResourceQuota](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
物件來配置配額。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You must have access to create namespaces in your cluster.
-->
在你的集群裡你必須要有建立名稱空間的許可權。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 建立一個名稱空間

首先建立一個名稱空間，這樣可以將本次操作中建立的資源與叢集其他資源隔離開來。

```shell
kubectl create namespace quota-pod-example
```

<!--
## Create a ResourceQuota

Here is an example manifest for a ResourceQuota:
-->
## 建立 ResourceQuota

下面是 ResourceQuota 的示例清單：

{{< codenew file="admin/resource/quota-pod.yaml" >}}

<!-- 建立 ResourceQuota: -->
建立這個 ResourceQuota：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the ResourceQuota:
-->
檢視資源配額的詳細資訊：

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that the namespace has a quota of two Pods, and that currently there are
no Pods; that is, none of the quota is used.
-->
從輸出的資訊我們可以看到，該名稱空間下 Pod 的配額是 2 個，目前建立的 Pod 數為 0，
配額使用率為 0。

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

{{< codenew file="admin/resource/quota-pod-deployment.yaml" >}}

<!--
In that manifest, `replicas: 3` tells Kubernetes to attempt to create three new Pods, all
running the same application.

Create the Deployment:
-->
在清單中，`replicas: 3` 告訴 Kubernetes 嘗試建立三個 Pods，
且執行相同的應用。

建立這個 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

<!--
View detailed information about the Deployment:
-->
檢視 Deployment 的詳細資訊：

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

<!--
The output shows that even though the Deployment specifies three replicas, only two
Pods were created because of the quota you defined earlier:
-->
從輸出的資訊我們可以看到，儘管嘗試建立三個 Pod，但是由於配額的限制，只有兩個 Pod 能被成功建立。

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
### 資源的選擇
在此任務中，你定義了一個限制 Pod 總數的 ResourceQuota，
你也可以限制其他型別物件的總數。例如，
你可以限制在一個名稱空間中可以建立的 {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}} 的數量。

<!--
## Clean up

Delete your namespace:
-->
## 清理

刪除名稱空間：

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
### 叢集管理人員參考

* [為名稱空間配置預設的記憶體請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [為名稱空間配置預設的的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [為名稱空間配置記憶體的最小值和最大值約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [為名稱空間配置 CPU 的最小值和最大值約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [為名稱空間配置記憶體和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [為 API 物件的設定配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 應用開發人員參考

* [為容器和 Pod 分配記憶體資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [給容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [配置 Pod 的服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

