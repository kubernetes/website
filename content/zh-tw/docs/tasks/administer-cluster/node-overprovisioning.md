---
title: 爲叢集超配節點容量
content_type: task
weight: 10
---
<!--
title: Overprovision Node Capacity For A Cluster
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}}
overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively
reserves a portion of your cluster's compute resources. This reservation helps reduce the time
required to schedule new pods during scaling events, enhancing your cluster's responsiveness
to sudden spikes in traffic or workload demands.

By maintaining some unused capacity, you ensure that resources are immediately available when
new pods are created, preventing them from entering a pending state while the cluster scales up.
-->
本頁指導你在 Kubernetes 叢集中設定{{< glossary_tooltip text="節點" term_id="node" >}}超配。
節點超配是一種主動預留部分叢集計算資源的策略。這種預留有助於減少在擴縮容事件期間調度新 Pod 所需的時間，
從而增強叢集對突發流量或突發工作負載需求的響應能力。

通過保持一些未使用的容量，確保在新 Pod 被創建時資源可以立即可用，防止 Pod 在叢集擴縮容時進入 Pending 狀態。

## {{% heading "prerequisites" %}}

<!--
- You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with
  your cluster.
- You should already have a basic understanding of
  [Deployments](/docs/concepts/workloads/controllers/deployment/),
  Pod {{< glossary_tooltip text="priority" term_id="pod-priority" >}},
  and {{< glossary_tooltip text="PriorityClasses" term_id="priority-class" >}}.
- Your cluster must be set up with an [autoscaler](/docs/concepts/cluster-administration/cluster-autoscaling/)
  that manages nodes based on demand.
-->
- 你需要有一個 Kubernetes 叢集，並且 kubectl 命令列工具必須被設定爲與你的叢集通信。
- 你應該已經基本瞭解了 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、Pod
  {{<glossary_tooltip text="優先級" term_id="pod-priority">}}和
  {{< glossary_tooltip text="PriorityClass" term_id="priority-class" >}}。
- 你的叢集必須設置一個基於需求管理節點的[自動擴縮程式](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)。

<!-- steps -->

<!--
## Create a PriorityClass

Begin by defining a PriorityClass for the placeholder Pods. First, create a PriorityClass with a
negative priority value, that you will shortly assign to the placeholder pods.
Later, you will set up a Deployment that uses this PriorityClass
-->
## 創建 PriorityClass   {#create-a-priorityclass}

首先爲佔位 Pod 定義一個 PriorityClass。
先創建一個優先級值爲負數的 PriorityClass，稍後將其分配給佔位 Pod。
接下來，你將部署使用此 PriorityClass 的 Deployment。

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

<!--
Then create the PriorityClass:
-->
然後創建 PriorityClass：

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

<!--
You will next define a Deployment that uses the negative-priority PriorityClass and runs a minimal container.
When you add this to your cluster, Kubernetes runs those placeholder pods to reserve capacity. Any time there
is a capacity shortage, the control plane will pick one these placeholder pods as the first candidate to
{{< glossary_tooltip text="preempt" term_id="preemption" >}}.
-->
接下來，你將定義一個 Deployment，使用優先級值爲負數的 PriorityClass 並運行最小的容器。
當你將此 Deployment 添加到叢集中時，Kubernetes 會運行這些佔位 Pod 以預留容量。
每當出現容量短缺時，控制面將選擇這些佔位 Pod
中的一個作爲第一個候選者進行{{< glossary_tooltip text="搶佔" term_id="preemption" >}}。

<!--
## Run Pods that request node capacity

Review the sample manifest:
-->
## 運行請求節點容量的 Pod   {#run-pods-that-request-node-capacity}

查看樣例清單：

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

<!--
### Pick a namespace for the placeholder pods

You should select, or create, a {{< glossary_tooltip term_id="namespace" text="namespace">}}
that the placeholder Pods will go into.
-->
### 爲佔位 Pod 挑選一個命名空間    {#pick-a-namespace-for-the-placeholder-pods}

你應選擇或創建佔位 Pod 要進入的{{< glossary_tooltip term_id="namespace" text="命名空間">}}。

<!--
### Create the placeholder deployment

Create a Deployment based on that manifest:

```shell
# Change the namespace name "example"
kubectl --namespace example apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```
-->
### 創建佔位 Deployment    {#create-the-placeholder-deployment}

基於該清單創建 Deployment：

```shell
# 你要更改命名空間名稱 "example"
kubectl --namespace example apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

<!--
## Adjust placeholder resource requests

Configure the resource requests and limits for the placeholder pods to define the amount of overprovisioned resources you want to maintain. This reservation ensures that a specific amount of CPU and memory is kept available for new pods.
-->
## 調整佔位資源請求   {#adjust-placeholder-resource-requests}

爲佔位 Pod 設定資源請求和限制，以定義你希望保持的超配資源量。
這種預留確保爲新 Pod 保留可以使用的、特定量的 CPU 和內存。

<!--
To edit the Deployment, modify the `resources` section in the Deployment manifest file
to set appropriate requests and limits. You can download that file locally and then edit it
with whichever text editor you prefer.

You can also edit the Deployment using kubectl:
-->
要編輯 Deployment，可以修改 Deployment 清單檔案中的 `resources` 一節，
設置合適的 `requests` 和 `limits`。
你可以將該檔案下載到本地，然後用自己喜歡的文本編輯器進行編輯。

你也可以使用 kubectl 來編輯 Deployment：

```shell
kubectl edit deployment capacity-reservation
```

<!--
For example, to reserve 500m CPU and 1Gi memory across 5 placeholder pods,
define the resource requests and limits for a single placeholder pod as follows:
-->
例如，要爲 5 個佔位 Pod 預留 500m CPU 和 1Gi 內存，請爲單個佔位 Pod 定義以下資源請求和限制：

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
```

<!--
## Set the desired replica count

### Calculate the total reserved resources
-->
## 設置所需的副本數量   {#set-the-desired-replica-count}

### 計算總預留資源   {#calculate-the-total-reserved-resources}

<!-- trailing whitespace in next paragraph is significant -->

<!--
For example, with 5 replicas each reserving 0.1 CPU and 200MiB of memory:  
Total CPU reserved: 5 × 0.1 = 0.5 (in the Pod specification, you'll write the quantity `500m`)  
Total memory reserved: 5 × 200MiB = 1GiB (in the Pod specification, you'll write `1 Gi`)  

To scale the Deployment, adjust the number of replicas based on your cluster's size and expected workload:
-->
例如，有 5 個副本，每個預留 0.1 CPU 和 200MiB 內存：  
CPU 預留總量：5 × 0.1 = 0.5（在 Pod 規約中，你將寫入數量 `500m`）  
內存預留總量：5 × 200MiB = 1GiB（在 Pod 規約中，你將寫入 `1 Gi`）  

要擴縮容 Deployment，請基於叢集的大小和預期的工作負載調整副本數：

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

<!--
Verify the scaling:
-->
驗證擴縮容效果：

```shell
kubectl get deployment capacity-reservation
```

<!--
The output should reflect the updated number of replicas:
-->
輸出應反映出更新後的副本數：

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

{{< note >}}
<!--
Some autoscalers, notably [Karpenter](/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter),
treat preferred affinity rules as hard rules when considering node scaling.
If you use Karpenter or another node autoscaler that uses the same heuristic,
the replica count you set here  also sets a minimum node count for your cluster.
-->
一些自動擴縮組件，特別是
[Karpenter](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter)，
在考慮節點擴縮容時將偏好的親和性規則視爲硬性規則。如果你使用 Karpenter
或其他使用同樣啓發式的節點擴縮容組件，你在此處設置的副本數也就是你的叢集的最少節點數。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
- Learn more about [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) and how they affect pod scheduling.
- Explore [node autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/) to dynamically adjust your cluster's size based on workload demands.
- Understand [Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/), a
  key mechanism for Kubernetes to handle resource contention. The same page covers _eviction_,
  which is less relevant to the placeholder Pod approach, but is also a mechanism for Kubernetes
  to react when resources are contended.
-->
- 進一步瞭解 [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
  及其如何影響 Pod 調度。
- 探索[節點自動擴縮容](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)，
  以基於工作負載需求動態調整叢集的大小。
- 瞭解 [Pod 搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)，
  這是 Kubernetes 處理資源競爭的關鍵機制。這篇文檔還涵蓋了**驅逐**，
  雖然與佔位 Pod 方法相關性較小，但也是 Kubernetes 在資源競爭時做出反應的一種機制。
