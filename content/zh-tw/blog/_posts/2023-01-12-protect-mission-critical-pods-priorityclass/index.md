---
layout: blog
title: "使用 PriorityClass 確保你的關鍵任務 Pod 免遭驅逐"
date: 2023-01-12
slug: protect-mission-critical-pods-priorityclass
description: "Pod 優先級和搶佔有助於通過決定調度和驅逐的順序來確保關鍵任務 Pod 在資源緊縮的情況下正常運行。"
---

<!--
layout: blog
title: "Protect Your Mission-Critical Pods From Eviction With PriorityClass"
date: 2023-01-12
slug: protect-mission-critical-pods-priorityclass
description: "Pod priority and preemption help to make sure that mission-critical pods are up in the event of a resource crunch by deciding order of scheduling and eviction."
-->

**作者**：Sunny Bhambhani (InfraCloud Technologies)

<!--
**Author:** Sunny Bhambhani (InfraCloud Technologies)
-->

**譯者**：Wilson Wu (DaoCloud)

<!--
Kubernetes has been widely adopted, and many organizations use it as their de-facto orchestration engine for running workloads that need to be created and deleted frequently.
-->
Kubernetes 已被廣泛使用，許多組織將其用作事實上的編排引擎，用於運行需要頻繁被創建和刪除的工作負載。

<!--
Therefore, proper scheduling of the pods is key to ensuring that application pods are up and running within the Kubernetes cluster without any issues. This article delves into the use cases around resource management by leveraging the [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) object to protect mission-critical or high-priority pods from getting evicted and making sure that the application pods are up, running, and serving traffic.
-->
因此，是否能對 Pod 進行合適的調度是確保應用 Pod 在 Kubernetes 叢集中正常啓動並運行的關鍵。
本文深入探討圍繞資源管理的使用場景，利用 [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
對象來保護關鍵或高優先級 Pod 免遭驅逐並確保應用 Pod 正常啓動、運行以及提供流量服務。

<!--
## Resource management in Kubernetes
-->
## Kubernetes 中的資源管理 {#resource-management-in-kubernetes}

<!--
The control plane consists of multiple components, out of which the scheduler (usually the built-in [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)) is one of the components which is responsible for assigning a node to a pod.
-->
控制平面由多個組件組成，其中調度程式（通常是內置的 [kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
是一個負責爲 Pod 分配節點的組件。

<!--
Whenever a pod is created, it enters a "pending" state, after which the scheduler determines which node is best suited for the placement of the new pod.
-->
當 Pod 被創建時，它就會進入“Pending”狀態，之後調度程式會確定哪個節點最適合放置這個新 Pod。

<!--
In the background, the scheduler runs as an infinite loop looking for pods without a `nodeName` set that are [ready for scheduling](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/). For each Pod that needs scheduling, the scheduler tries to decide which node should run that Pod.
-->
在後臺，調度程式以無限循環的方式運行，並尋找沒有設置 `nodeName`
且[準備好進行調度](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)的 Pod。
對於每個需要調度的 Pod，調度程式會嘗試決定哪個節點應該運行該 Pod。

<!--
If the scheduler cannot find any node, the pod remains in the pending state, which is not ideal.
-->
如果調度程式找不到任何節點，Pod 就會保持在這個不理想的掛起狀態下。

{{< note >}}
<!--
To name a few, `nodeSelector`, `taints and tolerations`, `nodeAffinity`, the rank of nodes based on available resources (for example, CPU and memory), and several other criteria are used to determine the pod's placement.
-->
舉幾個例子，可以用 `nodeSelector`、污點與容忍度、`nodeAffinity`、
基於可用資源（例如 CPU 和內存）的節點排序以及其他若干判別標準來確定將 Pod 放到哪個節點。
{{< /note >}}

<!--
The below diagram, from point number 1 through 4, explains the request flow:
-->
下圖從第 1 點到第 4 點解釋了請求流程：

<!--
{{< figure src=kube-scheduler.svg alt="A diagram showing the scheduling of three Pods that a client has directly created." title="Scheduling in Kubernetes">}}
-->
{{< figure src=kube-scheduler.svg alt="由客戶端直接創建的三個 Pod 的調度示意圖。" title="Kubernetes 中的調度">}}

<!--
## Typical use cases
-->
## 典型使用場景 {#typical-use-cases}

<!--
Below are some real-life scenarios where control over the scheduling and eviction of pods may be required.
-->
以下是一些可能需要控制 Pod 調度和驅逐的真實場景。

<!--
1. Let's say the pod you plan to deploy is critical, and you have some resource constraints. An example would be the DaemonSet of an infrastructure component like Grafana Loki. The Loki pods must run before other pods can on every node. In such cases, you could ensure resource availability by manually identifying and deleting the pods that are not required or by adding a new node to the cluster. Both these approaches are unsuitable since the former would be tedious to execute, and the latter could involve an expenditure of time and money.

2. Another use case could be a single cluster that holds the pods for the below environments with associated priorities:
   - Production (`prod`):  top priority
   - Preproduction (`preprod`): intermediate priority
   - Development (`dev`): least priority

   In the event of high resource consumption in the cluster, there is competition for CPU and memory resources on the nodes. While cluster-level autoscaling _may_ add more nodes, it takes time. In the interim, if there are no further nodes to scale the cluster, some Pods could remain in a Pending state, or the service could be degraded as they compete for resources. If the kubelet does evict a Pod from the node, that eviction would be random because the kubelet doesn’t have any special information about which Pods to evict and which to keep.

3. A third example could be a microservice backed by a queuing application or a database running into a resource crunch and the queue or database getting evicted. In such a case, all the other services would be rendered useless until the database can serve traffic again.
-->
1. 假設你計劃部署的 Pod 很關鍵，並且你有一些資源限制。比如 Grafana Loki 等基礎設施組件的 DaemonSet。
   Loki Pod 必須先於每個節點上的其他 Pod 運行。在這種情況下，你可以通過手動識別並刪除不需要的 Pod 或向叢集添加新節點來確保資源可用性。
   但是這兩種方法都不合適，因爲前者執行起來很乏味，而後者可能需要花費時間和金錢。

2. 另一個使用場景是包含若干 Pod 的單個叢集，其中對於以下環境有着不同的優先級 ：
   - 生產環境（`prod`）：最高優先級
   - 預生產環境（`preprod`）：中等優先級
   - 開發環境（`dev`）：最低優先級

   當叢集資源消耗較高時，節點上會出現 CPU 和內存資源的競爭。雖然叢集自動縮放可能會添加更多節點，但這需要時間。
   在此期間，如果沒有更多節點來擴展叢集，某些 Pod 可能會保持 Pending 狀態，或者服務可能會因爭奪資源而被降級。
   如果 kubelet 決定從節點中驅逐一個 Pod，那麼該驅逐將是隨機的，因爲 kubelet 不具有關於要驅逐哪些 Pod 以及要保留哪些 Pod 的任何特殊資訊。

3. 第三個示例是後端存在隊列或資料庫的微服務，當遇到資源緊縮並且隊列或資料庫被驅逐。
   在這種情況下，所有其他服務都將變得毫無用處，直到資料庫可以再次提供流量。

<!--
There can also be other scenarios where you want to control the order of scheduling or order of eviction of pods.
-->
還可能存在你希望控制 Pod 調度順序或驅逐順序的其他場景。

<!--
## PriorityClasses in Kubernetes
-->
## Kubernetes 中的 PriorityClass {#priorityclasses-in-kubernetes}

<!--
PriorityClass is a cluster-wide API object in Kubernetes and part of the `scheduling.k8s.io/v1` API group. It contains a mapping of the PriorityClass name (defined in `.metadata.name`) and an integer value (defined in `.value`). This represents the value that the scheduler uses to determine Pod's relative priority.
-->
PriorityClass 是 Kubernetes 中叢集範圍的 API 對象，也是 `scheduling.k8s.io/v1` API 組的一部分。
它包含 PriorityClass 名稱（在 `.metadata.name` 中定義）和一個整數值（在 `.value` 中定義）之間的映射。
整數值表示調度程式用來確定 Pod 相對優先級的值。

<!--
Additionally, when you create a cluster using kubeadm or a managed Kubernetes service (for example, Azure Kubernetes Service), Kubernetes uses PriorityClasses to safeguard the pods that are hosted on the control plane nodes. This ensures that critical cluster components such as CoreDNS and kube-proxy can run even if resources are constrained.
-->
此外，當你使用 kubeadm 或託管 Kubernetes 服務（例如 Azure Kubernetes Service）創建叢集時，
Kubernetes 使用 PriorityClass 來保護控制平面節點上託管的 Pod。這種設置可以確保即使資源有限，
CoreDNS 和 kube-proxy 等關鍵叢集組件仍然可以運行。

<!--
This availability of pods is achieved through the use of a special PriorityClass that ensures the pods are up and running and that the overall cluster is not affected.
-->
Pod 的這種可用性是通過使用特殊的 PriorityClass 來實現的，該 PriorityClass 可確保 Pod 正常運行並且整個叢集不受影響。

```console
$ kubectl get priorityclass
NAME                      VALUE        GLOBAL-DEFAULT   AGE
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

<!--
The diagram below shows exactly how it works with the help of an example, which will be detailed in the upcoming section.
-->
下圖通過一個示例展示其確切工作原理，下一節詳細介紹這一原理。

<!--
{{< figure src="decision-tree.svg" alt="A flow chart that illustrates how the kube-scheduler prioritizes new Pods and potentially preempts existing Pods" title="Pod scheduling and preemption">}}
-->
{{< figure src="decision-tree.svg" alt="此流程圖說明了 kube-scheduler 如何對新 Pod 進行優先級排序並可能對現有 Pod 進行搶佔" title="Pod 調度和搶佔">}}

<!--
### Pod priority and preemption
-->
### Pod 優先級和搶佔 {#pod-priority-and-preemption}

<!--
[Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) is a Kubernetes feature that allows the cluster to preempt pods (removing an existing Pod in favor of a new Pod) on the basis of priority. [Pod priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) indicates the importance of a pod relative to other pods while scheduling. If there aren't enough resources to run all the current pods, the scheduler tries to evict lower-priority pods over high-priority ones.
-->
[Pod 搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)是 Kubernetes 的一項功能，
允許叢集基於優先級搶佔 Pod（刪除現有 Pod 以支持新 Pod）。
[Pod 優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)表示調度時 Pod 相對於其他 Pod 的重要性。
如果沒有足夠的資源來運行當前所有 Pod，調度程式會嘗試驅逐優先級較低的 Pod，而不是優先級高的 Pod。

<!--
Also, when a healthy cluster experiences a node failure, typically, lower-priority pods get preempted to create room for higher-priority pods on the available node. This happens even if the cluster can bring up a new node automatically since pod creation is usually much faster than bringing up a new node.
-->
此外，當健康叢集遇到節點故障時，通常情況下，較低優先級的 Pod 會被搶佔，以便在可用節點上爲較高優先級的 Pod 騰出空間。
即使叢集可以自動創建新節點，也會發生這種情況，因爲 Pod 創建通常比創建新節點快得多。

<!--
### PriorityClass requirements
-->
### PriorityClass 的前提條件 {#priorityclass-requirements}

<!--
Before you set up PriorityClasses, there are a few things to consider.
-->
在設定 PriorityClass 之前，需要考慮一些事項。

<!--
1. Decide which PriorityClasses are needed. For instance, based on environment, type of pods, type of applications, etc.
2. The default PriorityClass resource for your cluster. The pods without a `priorityClassName` will be treated as priority 0.
3. Use a consistent naming convention for all PriorityClasses.
4. Make sure that the pods for your workloads are running with the right PriorityClass.
-->
1. 決定哪些 PriorityClass 是需要的。例如，基於環境、Pod 類型、應用類型等。
2. 叢集中預設的 PriorityClass 資源。當 Pod 沒有設置 `priorityClassName` 時，優先級將被視爲 0。
3. 對所有 PriorityClass 使用一致的命名約定。
4. 確保工作負載的 Pod 正在使用正確的 PriorityClass。

<!--
## PriorityClass hands-on example
-->
## PriorityClass 的動手示例 {#priorityclass-hands-on-example}

<!--
Let’s say there are 3 application pods: one for prod, one for preprod, and one for development. Below are three sample YAML manifest files for each of those.
-->
假設有 3 個應用 Pod：一個用於生產（prod），一個用於預生產（prepord），一個用於開發（development）。
下面是這三個示例的 YAML 清單檔案。

```yaml
---
# 開發環境（dev）
apiVersion: v1
kind: Pod
metadata:
  name: dev-nginx
  labels:
    env: dev
spec:
  containers:
  - name: dev-nginx
    image: nginx
    resources:
      requests:
        memory: "256Mi"
        cpu: "0.2"
      limits:
        memory: ".5Gi"
        cpu: "0.5"
```

```yaml
---
# 預生產環境（prepord）
apiVersion: v1
kind: Pod
metadata:
  name: preprod-nginx
  labels:
    env: preprod
spec:
  containers:
  - name: preprod-nginx
    image: nginx
    resources:
      requests:
        memory: "1.5Gi"
        cpu: "1.5"
      limits:
        memory: "2Gi"
        cpu: "2"
```

```yaml
---
# 生產環境（prod）
apiVersion: v1
kind: Pod
metadata:
  name: prod-nginx
  labels:
    env: prod
spec:
  containers:
  - name: prod-nginx
    image: nginx
    resources:
      requests:
        memory: "2Gi"
        cpu: "2"
      limits:
        memory: "2Gi"
        cpu: "2"
```

<!--
You can create these pods with the `kubectl create -f <FILE.yaml>` command, and then check their status using the `kubectl get pods` command. You can see if they are up and look ready to serve traffic:
-->
你可以使用 `kubectl create -f <FILE.yaml>` 命令創建這些 Pod，然後使用 `kubectl get pods` 命令檢查它們的狀態。
你可以查看它們是否已啓動並準備好提供流量：

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    RESTARTS   AGE   LABELS
dev-nginx       1/1     Running   0          55s   env=dev
preprod-nginx   1/1     Running   0          55s   env=preprod
prod-nginx      0/1     Pending   0          55s   env=prod
```

<!--
Bad news. The pod for the Production environment is still Pending and isn't serving any traffic.
-->
壞消息是生產環境的 Pod 仍處於 `Pending` 狀態，並且不能提供任何流量。

<!--
Let's see why this is happening:
-->
讓我們看看爲什麼會發生這種情況：

```console
$ kubectl get events
...
...
5s          Warning   FailedScheduling   pod/prod-nginx      0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
```

<!--
In this example, there is only one worker node, and that node has a resource crunch.
-->
在此示例中，只有一個工作節點，並且該節點存在資源緊縮。

<!--
Now, let's look at how PriorityClass can help in this situation since prod should be given higher priority than the other environments.
-->
現在，讓我們看看在這種情況下 PriorityClass 如何提供幫助，因爲生產環境應該比其他環境具有更高的優先級。

<!--
## PriorityClass API
-->
## PriorityClass 的 API {#priorityclass-api}

<!--
Before creating PriorityClasses based on these requirements, let's see what a basic manifest for a PriorityClass looks like and outline some prerequisites:
-->
在根據這些需求創建 PriorityClass 之前，讓我們看看 PriorityClass 的基本清單是什麼樣的，
並給出一些先決條件：

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: PRIORITYCLASS_NAME
value: 0 # any integer value between -1000000000 to 1000000000 
description: >-
  (Optional) description goes here!
globalDefault: false # or true. Only one PriorityClass can be the global default.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: PRIORITYCLASS_NAME
value: 0 # -1000000000 到 1000000000 之間的任何整數值 
description: >-
  （可選）描述內容！
globalDefault: false # 或 true。只有一個 PriorityClass 可以作爲全局默認值。
```

<!--
Below are some prerequisites for PriorityClasses:
-->
以下是 PriorityClass 的一些先決條件：

<!--
- The name of a PriorityClass must be a valid DNS subdomain name.
- When you make your own PriorityClass, the name should not start with `system-`, as those names are reserved by Kubernetes itself (for example, they are used for two built-in PriorityClasses).
- Its absolute value should be between -1000000000 to 1000000000 (1 billion).
- Larger numbers are reserved by PriorityClasses such as `system-cluster-critical` (this Pod is critically important to the cluster) and `system-node-critical` (the node critically relies on this Pod). `system-node-critical` is a higher priority than `system-cluster-critical`, because a cluster-critical Pod can only work well if the node where it is running has all its node-level critical requirements met.
- There are two optional fields:
  - `globalDefault`: When true, this PriorityClass is used for pods where a `priorityClassName` is not specified. Only one PriorityClass with `globalDefault` set to true can exist in a cluster. If there is no PriorityClass defined with globalDefault set to true, all the pods with no priorityClassName defined will be treated with 0 priority (i.e. the least priority).
  - `description`: A string with a meaningful value so that people know when to use this PriorityClass.
-->
- PriorityClass 的名稱必須是有效的 DNS 子域名。
- 當你創建自己的 PriorityClass 時，名稱不應以 `system-` 開頭，因爲這類名稱是被 Kubernetes
  本身保留的（例如，它們被用於兩個內置的 PriorityClass）。
- 其絕對值應在 -1000000000 到 1000000000（10 億）之間。
- 較大的數值由 PriorityClass 保留，例如 `system-cluster-critical`（此 Pod 對叢集至關重要）以及 `system-node-critical`（節點嚴重依賴此 Pod）。
  `system-node-critical` 的優先級高於 `system-cluster-critical`，因爲叢集級別關鍵 Pod 只有在其運行的節點滿足其所有節點級別關鍵要求時才能正常工作。
- 額外兩個可選字段：
  - `globalDefault`：當爲 true 時，此 PriorityClass 用於未設置 `priorityClassName` 的 Pod。
    叢集中只能存在一個 `globalDefault` 設置爲 true 的 PriorityClass。
    如果沒有 PriorityClass 的 globalDefault 設置爲 true，則所有未定義 priorityClassName 的 Pod 都將被視爲 0 優先級（即最低優先級）。
  - `description`：具備有意義值的字符串，以便人們知道何時使用此 PriorityClass。

{{< note >}}
<!--
Adding a PriorityClass with `globalDefault` set to `true` does not mean it will apply the same to the existing pods that are already running. This will be applicable only to the pods that came into existence after the PriorityClass was created.
-->
添加一個將 `globalDefault` 設置爲 `true` 的 PriorityClass 並不意味着它將同樣應用於已在運行的現有 Pod。
這僅適用於創建 PriorityClass 之後出現的 Pod。
{{< /note >}}

<!--
### PriorityClass in action
-->
### PriorityClass 的實際應用 {#priorityclass-in-action}

<!--
Here's an example. Next, create some environment-specific PriorityClasses:
-->
這裏有一個例子。接下來，創建一些針對環境的 PriorityClass：

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: dev-pc
value: 1000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all development pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: dev-pc
value: 1000000
globalDefault: false
description: >-
  （可選）此 PriorityClass 只能用於所有開發環境（dev）Pod。

```

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: preprod-pc
value: 2000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all preprod pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: preprod-pc
value: 2000000
globalDefault: false
description: >-
  （可選）此 PriorityClass 只能用於所有預生產環境（preprod）Pod。
```

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: prod-pc
value: 4000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all prod pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: prod-pc
value: 4000000
globalDefault: false
description: >-
  （可選）此 PriorityClass 只能用於所有生產環境（prod）Pod。
```

<!--
Use `kubectl create -f <FILE.YAML>` command to create a pc and `kubectl get pc` to check its status.
-->
使用 `kubectl create -f <FILE.YAML>` 命令創建 PriorityClass 並使用 `kubectl get pc` 檢查其狀態。

```console
$ kubectl get pc
NAME                      VALUE        GLOBAL-DEFAULT   AGE
dev-pc                    1000000      false            3m13s
preprod-pc                2000000      false            2m3s
prod-pc                   4000000      false            7s
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

<!--
The new PriorityClasses are in place now. A small change is needed in the pod manifest or pod template (in a ReplicaSet or Deployment). In other words, you need to specify the priority class name at `.spec.priorityClassName` (which is a string value).
-->
新的 PriorityClass 現已就位。需要對 Pod 清單或 Pod 模板（在 ReplicaSet 或 Deployment 中）進行一些小的修改。
換句話說，你需要在 `.spec.priorityClassName`（這是一個字符串值）中指定 PriorityClass 名稱。

<!--
First update the previous production pod manifest file to have a PriorityClass assigned, then delete the Production pod and recreate it. You can't edit the priority class for a Pod that already exists.
-->
首先更新之前的生產環境 Pod 清單檔案以分配 PriorityClass，然後刪除生產環境 Pod 並重新創建它。你無法編輯已存在 Pod 的優先級類別。

<!--
In my cluster, when I tried this, here's what happened. First, that change seems successful; the status of pods has been updated:
-->
在我的叢集中，當我嘗試此操作時，發生了以下情況。首先，這種改變似乎是成功的；Pod 的狀態已被更新：

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    	RESTARTS   AGE   LABELS
dev-nginx       1/1     Terminating	0          55s   env=dev
preprod-nginx   1/1     Running   	0          55s   env=preprod
prod-nginx      0/1     Pending   	0          55s   env=prod
```

<!--
The dev-nginx pod is getting terminated. Once that is successfully terminated and there are enough resources for the prod pod, the control plane can schedule the prod pod:
-->
dev-nginx Pod 即將被終止。一旦成功終止並且有足夠的資源用於 prod Pod，控制平面就可以對 prod Pod 進行調度：

```console
Warning   FailedScheduling   pod/prod-nginx    0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
Normal    Preempted          pod/dev-nginx     by default/prod-nginx on node node01
Normal    Killing            pod/dev-nginx     Stopping container dev-nginx
Normal    Scheduled          pod/prod-nginx    Successfully assigned default/prod-nginx to node01
Normal    Pulling            pod/prod-nginx    Pulling image "nginx"
Normal    Pulled             pod/prod-nginx    Successfully pulled image "nginx"
Normal    Created            pod/prod-nginx    Created container prod-nginx
Normal    Started            pod/prod-nginx    Started container prod-nginx
```

<!--
## Enforcement
-->
## 執行 {#enforcement}

<!--
When you set up PriorityClasses, they exist just how you defined them. However, people (and tools) that make changes to your cluster are free to set any PriorityClass, or to not set any PriorityClass at all. However, you can use other Kubernetes features to make sure that the priorities you wanted are actually applied.
-->
設定 PriorityClass 時，它們會按照你所定義的方式存在。
但是，對叢集進行變更的人員（和工具）可以自由設置任意 PriorityClass，
或者根本不設置任何 PriorityClass。然而，你可以使用其他 Kubernetes 功能來確保你想要的優先級被實際應用起來。

<!--
As an alpha feature, you can define a [ValidatingAdmissionPolicy](/blog/2022/12/20/validating-admission-policies-alpha/) and a ValidatingAdmissionPolicyBinding so that, for example, Pods that go into the `prod` namespace must use the `prod-pc` PriorityClass. With another ValidatingAdmissionPolicyBinding you ensure that the `preprod` namespace uses the `preprod-pc` PriorityClass, and so on. In *any* cluster, you can enforce similar controls using external projects such as [Kyverno](https://kyverno.io/) or [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), through validating admission webhooks.
-->
作爲一項 Alpha 級別功能，你可以定義一個 [ValidatingAdmissionPolicy](/blog/2022/12/20/validating-admission-policies-alpha/)
和一個 ValidatingAdmissionPolicyBinding，例如，進入 `prod` 命名空間的 Pod 必須使用 `prod-pc` PriorityClass。
通過另一個 ValidatingAdmissionPolicyBinding，你可以確保 `preprod` 命名空間使用 `preprod-pc` PriorityClass，依此類推。
在*任何*叢集中，你可以使用外部項目，例如 [Kyverno](https://kyverno.io/) 或 [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) 通過驗證准入 Webhook 實施類似的控制。

<!--
However you do it, Kubernetes gives you options to make sure that the PriorityClasses are used how you wanted them to be, or perhaps just to [warn](https://open-policy-agent.github.io/gatekeeper/website/docs/violations/#warn-enforcement-action) users when they pick an unsuitable option.
-->
無論你如何操作，Kubernetes 都會爲你提供選項，確保 PriorityClass 的用法如你所願，
或者只是當使用者選擇不合適的選項時做出[警告](https://open-policy-agent.github.io/gatekeeper/website/docs/violations/#warn-enforcement-action)。

<!--
## Summary
-->
## 總結 {#summary}

<!--
The above example and its events show you what this feature of Kubernetes brings to the table, along with several scenarios where you can use this feature. To reiterate, this helps ensure that mission-critical pods are up and available to serve the traffic and, in the case of a resource crunch, determines cluster behavior.
-->
上面的示例及其事件向你展示了 Kubernetes 此功能帶來的好處，以及可以使用此功能的幾種場景。
重申一下，這一機制有助於確保關鍵任務 Pod 啓動並可用於提供流量，並在資源緊張的情況下確定叢集行爲。

<!--
It gives you some power to decide the order of scheduling and order of [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) for Pods. Therefore, you need to define the PriorityClasses sensibly. For example, if you have a cluster autoscaler to add nodes on demand, make sure to run it with the `system-cluster-critical` PriorityClass. You don't want to get in a situation where the autoscaler has been preempted and there are no new nodes coming online.
-->
它賦予你一定的權力來決定 Pod 的調度順序和[搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)順序。
因此，你需要明智地定義 PriorityClass。例如，如果你有一個叢集自動縮放程式來按需添加節點，
請確保使用 `system-cluster-critical` PriorityClass 運行它。你不希望遇到自動縮放器 Pod 被搶佔導致沒有新節點上線的情況。

<!--
If you have any queries or feedback, feel free to reach out to me on [LinkedIn](http://www.linkedin.com/in/sunnybhambhani).
-->
如果你有任何疑問或反饋，可以隨時通過 [LinkedIn](http://www.linkedin.com/in/sunnybhambhani) 與我聯繫。
