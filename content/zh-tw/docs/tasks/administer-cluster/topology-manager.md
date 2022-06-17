---
title: 控制節點上的拓撲管理策略
content_type: task
min-kubernetes-server-version: v1.18
---
<!--
title: Control Topology Management Policies on a node
reviewers:
- ConnorDoyle
- klueska
- lmdaly
- nolancon
- bg-chun
content_type: task
min-kubernetes-server-version: v1.18
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.18" >}}

<!--
An increasing number of systems leverage a combination of CPUs and hardware accelerators to support latency-critical execution and high-throughput parallel computation. These include workloads in fields such as telecommunications, scientific computing, machine learning, financial services and data analytics. Such hybrid systems comprise a high performance environment.
-->
越來越多的系統利用 CPU 和硬體加速器的組合來支援對延遲要求較高的任務和高吞吐量的平行計算。
這類負載包括電信、科學計算、機器學習、金融服務和資料分析等。
此類混合系統即用於構造這些高效能環境。

<!--
In order to extract the best performance, optimizations related to CPU isolation, memory and device locality are required. However, in Kubernetes, these optimizations are handled by a disjoint set of components.
-->
為了獲得最佳效能，需要進行與 CPU 隔離、記憶體和裝置區域性性有關的最佳化。
但是，在 Kubernetes 中，這些最佳化由各自獨立的元件集合來處理。

<!--
_Topology Manager_ is a Kubelet component that aims to coordinate the set of components that are responsible for these optimizations.
-->
_拓撲管理器（Topology Manager）_ 是一個 kubelet 的一部分，旨在協調負責這些最佳化的一組元件。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## How Topology Manager Works
-->
## 拓撲管理器如何工作 {#how-topology-manager-works}

<!--
Prior to the introduction of Topology Manager, the CPU and Device Manager in Kubernetes make resource allocation decisions independently of each other.
This can result in undesirable allocations on multiple-socketed systems, performance/latency sensitive applications will suffer due to these undesirable allocations. 
 Undesirable in this case meaning for example, CPUs and devices being allocated from different NUMA Nodes thus, incurring additional latency.
-->
在引入拓撲管理器之前，Kubernetes 中的 CPU 和裝置管理器相互獨立地做出資源分配決策。
這可能會導致在多處理系統上出現並非期望的資源分配；由於這些與期望相左的分配，對效能或延遲敏感的應用將受到影響。
這裡的不符合期望意指，例如，CPU 和裝置是從不同的 NUMA 節點分配的，因此會導致額外的延遲。

<!--
The Topology Manager is a Kubelet component, which acts as a source of truth so that other Kubelet components can make topology aligned resource allocation choices.
-->
拓撲管理器是一個 Kubelet 元件，扮演資訊源的角色，以便其他 Kubelet 元件可以做出與拓撲結構相對應的資源分配決定。

<!--
The Topology Manager provides an interface for components, called *Hint Providers*, to send and receive topology information. Topology Manager has a set of node level policies which are explained below.
-->
拓撲管理器為元件提供了一個稱為 *建議供應者（Hint Providers）* 的介面，以傳送和接收拓撲資訊。
拓撲管理器具有一組節點級策略，具體說明如下。

<!--
The Topology manager receives Topology information from the *Hint Providers* as a bitmask denoting NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform a set of operations on the hints provided and converge on the hint determined by the policy to give the optimal result, if an undesirable hint is stored the preferred field for the hint will be set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the resource allocation decisions.
-->
拓撲管理器從 *建議提供者* 接收拓撲資訊，作為表示可用的 NUMA 節點和首選分配指示的位掩碼。
拓撲管理器策略對所提供的建議執行一組操作，並根據策略對提示進行約減以得到最優解；如果儲存了與預期不符的建議，則該建議的優選欄位將被設定為 false。
在當前策略中，首選的是最窄的優選掩碼。
所選建議將被儲存為拓撲管理器的一部分。
取決於所配置的策略，所選建議可用來決定節點接受或拒絕 Pod。
之後，建議會被儲存在拓撲管理器中，供 *建議提供者* 進行資源分配決策時使用。

<!--
### Enable the Topology Manager feature

Support for the Topology Manager requires `TopologyManager` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled. It is enabled by default starting with Kubernetes 1.18.
-->
### 啟用拓撲管理器功能特性 {#enable-the-topology-manager-feature}

對拓撲管理器的支援要求啟用 `TopologyManager`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
從 Kubernetes 1.18 版本開始，這一特性預設是啟用的。

<!--
## Topology Manager Scopes and Policies

The Topology Manager currently:
 - Aligns Pods of all QoS classes.
 - Aligns the requested resources that Hint Provider provides topology hints for.
-->
## 拓撲管理器作用域和策略 {#topology-manager-scopes-and-policies}

拓撲管理器目前：
- 對所有 QoS 類的 Pod 執行對齊操作
- 針對建議提供者所提供的拓撲建議，對請求的資源進行對齊

<!--
If these conditions are met, the Topology Manager will align the requested resources.

In order to customise how this alignment is carried out, the Topology Manager provides two distinct knobs: `scope` and `policy`.
-->
如果滿足這些條件，則拓撲管理器將對齊請求的資源。

為了定製如何進行對齊，拓撲管理器提供了兩種不同的方式：`scope` 和 `policy`。

<!--
The `scope` defines the granularity at which you would like resource alignment to be performed (e.g. at the `pod` or `container` level). And the `policy` defines the actual strategy used to carry out the alignment (e.g. `best-effort`, `restricted`, `single-numa-node`, etc.).

Details on the various `scopes` and `policies` available today can be found below.
-->
`scope` 定義了資源對齊時你所希望使用的粒度（例如，是在 `pod` 還是 `container` 級別）。
`policy` 定義了對齊時實際使用的策略（例如，`best-effort`、`restricted`、`single-numa-node` 等等）。

可以在下文找到現今可用的各種 `scopes` 和 `policies` 的具體資訊。

<!--
To align CPU resources with other requested resources in a Pod Spec, the CPU Manager should be enabled and proper CPU Manager policy should be configured on a Node. See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
{{< note >}}
為了將 Pod 規約中的 CPU 資源與其他請求資源對齊，CPU 管理器需要被啟用並且
節點上應配置了適當的 CPU 管理器策略。
參看[控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/).
{{< /note >}}

<!--
To align memory (and hugepages) resources with other requested resources in a Pod Spec, the Memory Manager should be enabled and proper Memory Manager policy should be configured on a Node. Examine [Memory Manager](/docs/tasks/administer-cluster/memory-manager/) documentation.
-->
{{< note >}}
為了將 Pod 規約中的 memory（和 hugepages）資源與所請求的其他資源對齊，需要啟用記憶體管理器，
並且在節點配置適當的記憶體管理器策略。檢視[記憶體管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
文件。
{{< /note >}}

<!--
### Topology Manager Scopes

The Topology Manager can deal with the alignment of resources in a couple of distinct scopes:

* `container` (default)
* `pod`

Either option can be selected at a time of the kubelet startup, with `--topology-manager-scope` flag.
-->
### 拓撲管理器作用域 {#topology-manager-scopes}

拓撲管理器可以在以下不同的作用域內進行資源對齊：

* `container` （預設）
* `pod`

在 kubelet 啟動時，可以使用 `--topology-manager-scope` 標誌來選擇其中任一選項。

<!--
### container scope

The `container` scope is used by default.
-->
### 容器作用域 {#container-scope}

預設使用的是 `container` 作用域。

<!--
Within this scope, the Topology Manager performs a number of sequential resource alignments, i.e., for each container (in a pod) a separate alignment is computed. In other words, there is no notion of grouping the containers to a specific set of NUMA nodes, for this particular scope. In effect, the Topology Manager performs an arbitrary alignment of individual containers to NUMA nodes.
-->
在該作用域內，拓撲管理器依次進行一系列的資源對齊，
也就是，對每一個容器（包含在一個 Pod 裡）計算單獨的對齊。
換句話說，在該特定的作用域內，沒有根據特定的 NUMA 節點集來把容器分組的概念。
實際上，拓撲管理器會把單個容器任意地對齊到 NUMA 節點上。

<!--
The notion of grouping the containers was endorsed and implemented on purpose in the following scope, for example the `pod` scope.
-->
容器分組的概念是在以下的作用域內特別實現的，也就是 `pod` 作用域。

<!--
### pod scope

To select the `pod` scope, start the kubelet with the command line option `--topology-manager-scope=pod`.
-->
### Pod 作用域 {#pod-scope}

使用命令列選項 `--topology-manager-scope=pod` 來啟動 kubelet，就可以選擇 `pod` 作用域。

<!--
This scope allows for grouping all containers in a pod to a common set of NUMA nodes. That is, the Topology Manager treats a pod as a whole and attempts to allocate the entire pod (all containers) to either a single NUMA node or a common set of NUMA nodes. The following examples illustrate the alignments produced by the Topology Manager on different occasions:
-->
該作用域允許把一個 Pod 裡的所有容器作為一個分組，分配到一個共同的 NUMA 節點集。
也就是，拓撲管理器會把一個 Pod 當成一個整體，
並且試圖把整個 Pod（所有容器）分配到一個單個的 NUMA 節點或者一個共同的 NUMA 節點集。
以下的例子說明了拓撲管理器在不同的場景下使用的對齊方式：

<!--
* all containers can be and are allocated to a single NUMA node;
* all containers can be and are allocated to a shared set of NUMA nodes.
-->
* 所有容器可以被分配到一個單一的 NUMA 節點；
* 所有容器可以被分配到一個共享的 NUMA 節點集。

<!--
The total amount of particular resource demanded for the entire pod is calculated according to [effective requests/limits](/docs/concepts/workloads/pods/init-containers/#resources) formula, and thus, this total value is equal to the maximum of:
* the sum of all app container requests,
* the maximum of init container requests,
for a resource.
-->
整個 Pod 所請求的某種資源總量是根據
[有效 request/limit](/zh-cn/docs/concepts/workloads/pods/init-containers/#resources)
公式來計算的，
因此，對某一種資源而言，該總量等於以下數值中的最大值：
* 所有應用容器請求之和；
* 初始容器請求的最大值。

<!--
Using the `pod` scope in tandem with `single-numa-node` Topology Manager policy is specifically valuable for workloads that are latency sensitive or for high-throughput applications that perform IPC. By combining both options, you are able to place all containers in a pod onto a single NUMA node; hence, the inter-NUMA communication overhead can be eliminated for that pod.
-->
`pod` 作用域與 `single-numa-node` 拓撲管理器策略一起使用，
對於延時敏感的工作負載，或者對於進行 IPC 的高吞吐量應用程式，都是特別有價值的。
把這兩個選項組合起來，你可以把一個 Pod 裡的所有容器都放到一個單個的 NUMA 節點，
使得該 Pod 消除了 NUMA 之間的通訊開銷。

<!--
In the case of `single-numa-node` policy, a pod is accepted only if a suitable set of NUMA nodes is present among possible allocations. Reconsider the example above:
-->
在 `single-numa-node` 策略下，只有當可能的分配方案中存在合適的 NUMA 節點集時，Pod 才會被接受。
重新考慮上述的例子：

<!--
* a set containing only a single NUMA node - it leads to pod being admitted,
* whereas a set containing more NUMA nodes - it results in pod rejection (because instead of one NUMA node, two or more NUMA nodes are required to satisfy the allocation).
-->
* 節點集只包含單個 NUMA 節點時，Pod 就會被接受，
* 然而，節點集包含多個 NUMA 節點時，Pod 就會被拒絕
  （因為滿足該分配方案需要兩個或以上的 NUMA 節點，而不是單個 NUMA 節點）。

<!--
To recap, Topology Manager first computes a set of NUMA nodes and then tests it against Topology Manager policy, which either leads to the rejection or admission of the pod.
-->
簡要地說，拓撲管理器首先計算出 NUMA 節點集，然後使用拓撲管理器策略來測試該集合，
從而決定拒絕或者接受 Pod。

<!--
### Topology Manager Policies
-->
### 拓撲管理器策略 {#topology-manager-policies}

<!--
Topology Manager supports four allocation policies. You can set a policy via a Kubelet flag, `--topology-manager-policy`.
There are four supported policies:

* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`
-->
拓撲管理器支援四種分配策略。
你可以透過 Kubelet 標誌 `--topology-manager-policy` 設定策略。
所支援的策略有四種：

* `none` (預設)
* `best-effort`
* `restricted`
* `single-numa-node`

<!--
{{< note >}}
If Topology Manager is configured with the **pod** scope, the container, which is considered by the policy, is reflecting requirements of the entire pod, and thus each container from the pod will result with **the same** topology alignment decision.
{{< /note >}}
-->
{{< note >}}
如果拓撲管理器配置使用 **Pod** 作用域，
那麼在策略考量一個容器時，該容器反映的是整個 Pod 的要求，
於是該 Pod 裡的每個容器都會得到 **相同的** 拓撲對齊決定。
{{< /note >}}

<!--
### none policy {#policy-none}

This is the default policy and does not perform any topology alignment.
-->
### none 策略 {#policy-none}

這是預設策略，不執行任何拓撲對齊。

<!--
### best-effort policy {#policy-best-effort}

For each container in a Pod, the kubelet, with `best-effort` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will store this and admit the pod to the node anyway.
-->
### best-effort 策略 {#policy-best-effort}

對於 Pod 中的每個容器，具有 `best-effort` 拓撲管理策略的
kubelet 將呼叫每個建議提供者以確定資源可用性。
使用此資訊，拓撲管理器儲存該容器的首選 NUMA 節點親和性。
如果親和性不是首選，則拓撲管理器將儲存該親和性，並且無論如何都將  pod 接納到該節點。

<!--
The *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
之後 *建議提供者* 可以在進行資源分配決策時使用這個資訊。

<!--
### restricted policy {#policy-restricted}

For each container in a Pod, the kubelet, with `restricted` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager stores the 
preferred NUMA Node affinity for that container. If the affinity is not preferred, 
Topology Manager will reject this pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
### restricted 策略 {#policy-restricted}

對於 Pod 中的每個容器，配置了 `restricted` 拓撲管理策略的 kubelet
呼叫每個建議提供者以確定其資源可用性。。
使用此資訊，拓撲管理器儲存該容器的首選 NUMA 節點親和性。
如果親和性不是首選，則拓撲管理器將從節點中拒絕此 Pod。
這將導致 Pod 處於 `Terminated` 狀態，且 Pod 無法被節點接納。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a ReplicaSet or Deployment to trigger a redeploy of the pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.
-->
一旦 Pod 處於 `Terminated` 狀態，Kubernetes 排程器將不會嘗試重新排程該 Pod。
建議使用 ReplicaSet 或者 Deployment 來重新部署 Pod。
還可以透過實現外部控制環，以啟動對具有 `Topology Affinity` 錯誤的 Pod 的重新部署。

<!--
If the pod is admitted, the *Hint Providers* can then use this information when making the 
resource allocation decision.
-->
如果 Pod 被允許執行在某節點，則 *建議提供者* 可以在做出資源分配決定時使用此資訊。

<!--
### single-numa-node policy {#policy-single-numa-node}

For each container in a Pod, the kubelet, with `single-numa-node` topology 
management policy, calls each Hint Provider to discover their resource availability.
Using this information, the Topology Manager determines if a single NUMA Node affinity is possible.
If it is, Topology Manager will store this and the *Hint Providers* can then use this information when making the 
resource allocation decision.
If, however, this is not possible then the Topology Manager will reject the pod from the node. This will result in a pod in a `Terminated` state with a pod admission failure.
-->
### single-numa-node 策略 {#policy-single-numa-node}

對於 Pod 中的每個容器，配置了 `single-numa-nodde` 拓撲管理策略的
kubelet 呼叫每個建議提供者以確定其資源可用性。
使用此資訊，拓撲管理器確定單 NUMA 節點親和性是否可能。
如果是這樣，則拓撲管理器將儲存此資訊，然後 *建議提供者* 可以在做出資源分配決定時使用此資訊。
如果不可能，則拓撲管理器將拒絕 Pod 運行於該節點。
這將導致 Pod 處於 `Terminated` 狀態，且 Pod 無法被節點接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to reschedule the pod. It is recommended to use a Deployment with replicas to trigger a redeploy of the Pod.
An external control loop could be also implemented to trigger a redeployment of pods that have the `Topology Affinity` error.
-->
一旦 Pod 處於 `Terminated` 狀態，Kubernetes 排程器將不會嘗試重新排程該 Pod。
建議使用 ReplicaSet 或者 Deployment 來重新部署 Pod。
還可以透過實現外部控制環，以觸發具有 `Topology Affinity` 錯誤的 Pod 的重新部署。

<!--
### Pod Interactions with Topology Manager Policies

Consider the containers in the following pod specs:
-->
### Pod 與拓撲管理器策略的互動 {#pod-interactions-with-topology-manager-policies}

考慮以下 pod 規範中的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
This pod runs in the `BestEffort` QoS class because no resource `requests` or
`limits` are specified.
-->
該 Pod 以 `BestEffort` QoS 類執行，因為沒有指定資源 `requests` 或 `limits`。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
      requests:
        memory: "100Mi"
```

<!--
This pod runs in the `Burstable` QoS class because requests are less than limits.
-->
由於 requests 數少於 limits，因此該 Pod 以 `Burstable` QoS 類執行。

<!--
If the selected policy is anything other than `none`, Topology Manager would consider these Pod specifications. The Topology Manager would consult the Hint Providers to get topology hints. In the case of the `static`, the CPU Manager policy would return default topology hint, because these Pods do not have explicitly request CPU resources.
-->
如果選擇的策略是 `none` 以外的任何其他策略，拓撲管理器都會評估這些 Pod 的規範。
拓撲管理器會諮詢建議提供者，獲得拓撲建議。
若策略為 `static`，則 CPU 管理器策略會返回預設的拓撲建議，因為這些 Pod
並沒有顯式地請求 CPU 資源。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

<!--
This pod with integer CPU request runs in the `Guaranteed` QoS class because `requests` are equal to `limits`.
-->
此 Pod 以 `Guaranteed` QoS 類執行，因為其 `requests` 值等於 `limits` 值。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
      requests:
        example.com/deviceA: "1"
        example.com/deviceB: "1"
```

<!--
This pod runs in the `BestEffort` QoS class because there are no CPU and memory requests.
-->
因為未指定 CPU 和記憶體請求，所以 Pod 以 `BestEffort` QoS 類執行。

<!--
The Topology Manager would consider the above pods. The Topology Manager would consult the Hint Providers, which are CPU and Device Manager to get topology hints for the pods. 

In the case of the `Guaranteed` pod with integer CPU request, the `static` CPU Manager policy would return topology hints relating to the exclusive CPU and the Device Manager would send back hints for the requested device.
-->
拓撲管理器將考慮以上兩個 Pod。拓撲管理器將諮詢建議提供者即 CPU 和裝置管理器，以獲取 Pod 的拓撲提示。
對於 `Guaranteed` 類的 CPU 請求數為整數的 Pod，`static` CPU 管理器策略將返回獨佔 CPU 相關的拓撲提示，
而裝置管理器將返回有關所請求裝置的提示。

<!--
In the case of the `Guaranteed` pod with sharing CPU request, the `static` CPU Manager policy would return default topology hint as there is no exclusive CPU request and the Device Manager would send back hints for the requested device.

In the above two cases of the `Guaranteed` pod, the `none` CPU Manager policy would return default topology hint.
-->
對於 `Guaranteed` 類的 CPU 請求可共享的 Pod，`static` CPU
管理器策略將返回預設的拓撲提示，因為沒有排他性的 CPU 請求；而裝置管理器
則針對所請求的裝置返回有關提示。

在上述兩種 `Guaranteed` Pod 的情況中，`none` CPU 管理器策略會返回預設的拓撲提示。

<!--
In the case of the `BestEffort` pod, the `static` CPU Manager policy would send back the default topology hint as there is no CPU request and the Device Manager would send back the hints for each of the requested devices.
-->
對於 `BestEffort` Pod，由於沒有 CPU 請求，`static` CPU 管理器策略將傳送預設提示，
而裝置管理器將為每個請求的裝置傳送提示。

<!--
Using this information the Topology Manager calculates the optimal hint for the pod and stores this information, which will be used by the Hint Providers when they are making their resource assignments.
-->
基於此資訊，拓撲管理器將為 Pod 計算最佳提示並存儲該資訊，並且供
提示提供程式在進行資源分配時使用。

<!--
### Known Limitations

1. The maximum number of NUMA nodes that Topology Manager allows is 8. With more than 8 NUMA nodes there will be a state explosion when trying to enumerate the possible NUMA affinities and generating their hints.

2. The scheduler is not topology-aware, so it is possible to be scheduled on a node and then fail on the node due to the Topology Manager.
-->
### 已知的侷限性 {#known-limitations}

1. 拓撲管理器所能處理的最大 NUMA 節點個數是 8。若 NUMA 節點數超過 8，
   列舉可能的 NUMA 親和性併為之生成提示時會發生狀態爆炸。
2. 排程器不是拓撲感知的，所以有可能一個 Pod 被排程到一個節點之後，會因為拓撲管理器的緣故在該節點上啟動失敗。

