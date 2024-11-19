---
title: 为集群超配节点容量
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
This page guides you through configuring {{< glossary_tooltip text="Node" term_id="node" >}} overprovisioning in your Kubernetes cluster. Node overprovisioning is a strategy that proactively reserves a portion of your cluster's compute resources. This reservation helps reduce the time required to schedule new pods during scaling events, enhancing your cluster's responsiveness to sudden spikes in traffic or workload demands. 

By maintaining some unused capacity, you ensure that resources are immediately available when new pods are created, preventing them from entering a pending state while the cluster scales up.
-->
本页指导你在 Kubernetes 集群中配置{{< glossary_tooltip text="节点" term_id="node" >}}超配。
节点超配是一种主动预留部分集群计算资源的策略。这种预留有助于减少在扩缩容事件期间调度新 Pod 所需的时间，
从而增强集群对突发流量或突发工作负载需求的响应能力。

通过保持一些未使用的容量，你确保在新 Pod 被创建时资源可以立即可用，防止 Pod 在集群扩缩容时进入 Pending 状态。

## {{% heading "prerequisites" %}}

<!--
- You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with 
  your cluster.
- You should already have a basic understanding of
  [Deployments](/docs/concepts/workloads/controllers/deployment/),
  Pod {{<glossary_tooltip text="priority" term_id="pod-priority">}},
  and [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).
- Your cluster must be set up with an [autoscaler](/docs/concepts/cluster-administration/cluster-autoscaling/)
  that manages nodes based on demand.
-->
- 你需要有一个 Kubernetes 集群，并且 kubectl 命令行工具必须被配置为与你的集群通信。
- 你应该已经基本了解了 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、Pod
  {{<glossary_tooltip text="优先级" term_id="pod-priority">}}和
  [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)。
- 你的集群必须设置一个基于需求管理节点的
  [Autoscaler](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)。

<!-- steps -->

<!--
## Create a placeholder Deployment

Begin by defining a PriorityClass for the placeholder Pods. First, create a PriorityClass with a
negative priority value, that you will shortly assign to the placeholder pods.
Later, you will set up a Deployment that uses this PriorityClass
-->
## 创建占位 Deployment   {#create-a-placeholder-deployment}

首先为占位 Pod 定义一个 PriorityClass。
先创建一个优先级值为负数的 PriorityClass，稍后将其分配给占位 Pod。
接下来，你将部署使用此 PriorityClass 的 Deployment。

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

<!--
Then create the PriorityClass:
-->
然后创建 PriorityClass：

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

<!--
You will next define a Deployment that uses the negative-priority PriorityClass and runs a minimal container.
When you add this to your cluster, Kubernetes runs those placeholder pods to reserve capacity. Any time there
is a capacity shortage, the control plane will pick one these placeholder pods as the first candidate to
{{< glossary_tooltip text="preempt" term_id="preemption" >}}.

Review the sample manifest:
-->
接下来，你将定义一个 Deployment，使用优先级值为负数的 PriorityClass 并运行最小容器。
当你将此 Deployment 添加到集群中时，Kubernetes 会运行这些占位 Pod 以预留容量。
每当出现容量短缺时，控制面将选择这些占位 Pod
中的一个作为第一个候选者进行{{< glossary_tooltip text="抢占" term_id="preemption" >}}。

查看样例清单：

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

<!--
Create a Deployment based on that manifest:
-->
基于该清单创建 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

<!--
## Adjust placeholder resource requests

Configure the resource requests and limits for the placeholder pods to define the amount of overprovisioned resources you want to maintain. This reservation ensures that a specific amount of CPU and memory is kept available for new pods.
-->
## 调整占位资源请求   {#adjust-placeholder-resource-requests}

为占位 Pod 配置资源请求和限制，以定义你希望保持的超配资源量。
这种预留确保为新 Pod 保留可以使用的、特定量的 CPU 和内存。

<!--
To edit the Deployment, modify the `resources` section in the Deployment manifest file
to set appropriate requests and limits. You can download that file locally and then edit it
with whichever text editor you prefer.

For example, to reserve 500m CPU and 1Gi memory across 5 placeholder pods,
define the resource requests and limits for a single placeholder pod as follows:
-->
要编辑 Deployment，可以修改 Deployment 清单文件中的 `resources` 一节，
设置合适的 `requests` 和 `limits`。
你可以将该文件下载到本地，然后用自己喜欢的文本编辑器进行编辑。

例如，要为 5 个占位 Pod 预留 500m CPU 和 1Gi 内存，请为单个占位 Pod 定义以下资源请求和限制：

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

For example, with 5 replicas each reserving 0.1 CPU and 200MiB of memory:

Total CPU reserved: 5 × 0.1 = 0.5 (in the Pod specification, you'll write the quantity `500m`)
Total Memory reserved: 5 × 200MiB = 1GiB (in the Pod specification, you'll write `1 Gi`)

To scale the Deployment, adjust the number of replicas based on your cluster's size and expected workload:
-->
## 设置所需的副本数量   {#set-the-desired-replica-count}

### 计算总预留资源   {#calculate-the-total-reserved-resources}

例如，有 5 个副本，每个预留 0.1 CPU 和 200MiB 内存：

CPU 预留总量：5 × 0.1 = 0.5（在 Pod 规约中，你将写入数量 `500m`）

内存预留总量：5 × 200MiB = 1GiB（在 Pod 规约中，你将写入 `1 Gi`）

要扩缩容 Deployment，请基于集群的大小和预期的工作负载调整副本数：

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

<!--
Verify the scaling:
-->
验证扩缩容效果：

```shell
kubectl get deployment capacity-reservation
```

<!--
The output should reflect the updated number of replicas:
-->
输出应反映出更新后的副本数：

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
一些自动扩缩组件，特别是
[Karpenter](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter)，
在考虑节点扩缩容时将偏好的亲和性规则视为硬性规则。如果你使用 Karpenter
或其他使用同样启发式的节点扩缩容组件，你在此处设置的副本数也就是你的集群的最少节点数。
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
- 进一步了解 [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
  及其如何影响 Pod 调度。
- 探索[节点自动扩缩容](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling/)，
  以基于工作负载需求动态调整集群的大小。
- 了解 [Pod 抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)，
  这是 Kubernetes 处理资源竞争的关键机制。这篇文档还涵盖了**驱逐**，
  虽然与占位 Pod 方法相关性较小，但也是 Kubernetes 在资源竞争时做出反应的一种机制。
