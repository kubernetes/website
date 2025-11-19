---
title: 控制節點上的拓撲管理策略
content_type: task
min-kubernetes-server-version: v1.18
weight: 150
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
weight: 150
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.27" >}}

<!--
An increasing number of systems leverage a combination of CPUs and hardware accelerators to
support latency-critical execution and high-throughput parallel computation. These include
workloads in fields such as telecommunications, scientific computing, machine learning, financial
services and data analytics. Such hybrid systems comprise a high performance environment.
-->
越來越多的系統利用 CPU 和硬件加速器的組合來支持要求低延遲的任務和高吞吐量的並行計算。
這類負載包括電信、科學計算、機器學習、金融服務和數據分析等。
此類混合系統需要有高性能環境支持。

<!--
In order to extract the best performance, optimizations related to CPU isolation, memory and
device locality are required. However, in Kubernetes, these optimizations are handled by a
disjoint set of components.
-->
爲了獲得最佳性能，需要進行與 CPU 隔離、內存和設備局部性有關的優化。
但是，在 Kubernetes 中，這些優化由各自獨立的組件集合來處理。

<!--
_Topology Manager_ is a kubelet component that aims to coordinate the set of components that are
responsible for these optimizations.
-->
**拓撲管理器（Topology Manager）** 是一個 kubelet 組件，旨在協調負責這些優化的一組組件。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## How topology manager works
-->
## 拓撲管理器如何工作 {#how-topology-manager-works}

<!--
Prior to the introduction of Topology Manager, the CPU and Device Manager in Kubernetes make
resource allocation decisions independently of each other. This can result in undesirable
allocations on multiple-socketed systems, and performance/latency sensitive applications will suffer
due to these undesirable allocations. Undesirable in this case meaning, for example, CPUs and
devices being allocated from different NUMA Nodes, thus incurring additional latency.
-->
在引入拓撲管理器之前，Kubernetes 中的 CPU 和設備管理器相互獨立地做出資源分配決策。
這可能會導致在多處理系統上出現不符合期望的資源分配情況；由於這些與期望相左的分配，對性能或延遲敏感的應用將受到影響。
這裏的不符合期望意指，例如，CPU 和設備是從不同的 NUMA 節點分配的，因此會導致額外的延遲。

<!--
The Topology Manager is a kubelet component, which acts as a source of truth so that other kubelet
components can make topology aligned resource allocation choices.
-->
拓撲管理器是一個 kubelet 組件，扮演信息源的角色，以便其他 kubelet 組件可以做出與拓撲結構相對應的資源分配決定。

<!--
The Topology Manager provides an interface for components, called *Hint Providers*, to send and
receive topology information. The Topology Manager has a set of node level policies which are
explained below.
-->
拓撲管理器爲組件提供了一個稱爲 **建議提供者（Hint Provider）** 的接口，以發送和接收拓撲信息。
拓撲管理器具有一組節點級策略，具體說明如下。

<!--
The Topology Manager receives topology information from the *Hint Providers* as a bitmask denoting
NUMA Nodes available and a preferred allocation indication. The Topology Manager policies perform
a set of operations on the hints provided and converge on the hint determined by the policy to
give the optimal result. If an undesirable hint is stored, the preferred field for the hint will be
set to false. In the current policies preferred is the narrowest preferred mask.
The selected hint is stored as part of the Topology Manager. Depending on the policy configured,
the pod can be accepted or rejected from the node based on the selected hint.
The hint is then stored in the Topology Manager for use by the *Hint Providers* when making the
resource allocation decisions.
-->
拓撲管理器從**建議提供者**接收拓撲信息，作爲表示可用的 NUMA 節點和首選分配指示的位掩碼。
拓撲管理器策略對所提供的建議執行一組操作，並根據策略對提示進行約減以得到最優解。
如果存儲了與預期不符的建議，則該建議的優選字段將被設置爲 false。
在當前策略中，首選是最窄的優選掩碼。
所選建議將被存儲爲拓撲管理器的一部分。
取決於所配置的策略，所選建議可用來決定節點接受或拒絕 Pod。
之後，建議會被存儲在拓撲管理器中，供**建議提供者**在作資源分配決策時使用。

<!--
The flow can be seen in the following diagram.

![topology_manager_flow](/images/docs/topology-manager-flow.png)
-->
該流程可見於下圖。

![topology_manager_flow](/images/docs/topology-manager-flow.png)

<!--
## Windows Support
-->
## Windows 支持

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

<!--
The Topology Manager support can be enabled on Windows by using the `WindowsCPUAndMemoryAffinity` feature gate and
it requires support in the container runtime.
-->
拓撲管理器支持可以通過使用 `WindowsCPUAndMemoryAffinity` 特性門控在 Windows 上啓用，
並且需要容器運行時的支持。

<!--
## Topology manager scopes and policies

The Topology Manager currently:

- aligns Pods of all QoS classes.
- aligns the requested resources that Hint Provider provides topology hints for.
-->
## 拓撲管理器作用域和策略 {#topology-manager-scopes-and-policies}

拓撲管理器目前：

- 對所有 QoS 類的 Pod 執行對齊操作。
- 針對建議提供者所提供的拓撲建議，對請求的資源進行對齊。

<!--
If these conditions are met, the Topology Manager will align the requested resources.

In order to customize how this alignment is carried out, the Topology Manager provides two
distinct options: `scope` and `policy`.
-->
如果滿足這些條件，則拓撲管理器將對齊請求的資源。

爲了定製如何進行對齊，拓撲管理器提供了兩個不同的選項：`scope` 和 `policy`。

<!--
The `scope` defines the granularity at which you would like resource alignment to be performed,
for example, at the `pod` or `container` level. And the `policy` defines the actual policy used to
carry out the alignment, for example, `best-effort`, `restricted`, and `single-numa-node`.
Details on the various `scopes` and `policies` available today can be found below.
-->
`scope` 定義了你希望的資源對齊粒度，例如是在 `pod` 還是 `container` 層級上對齊。
`policy` 定義了對齊時實際使用的策略，例如 `best-effort`、`restricted` 和 `single-numa-node`。
可以在下文找到現今可用的各種 `scopes` 和 `policies` 的具體信息。

{{< note >}}
<!--
To align CPU resources with other requested resources in a Pod spec, the CPU Manager should be
enabled and proper CPU Manager policy should be configured on a Node.
See [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
爲了將 Pod 規約中的 CPU 資源與其他請求資源對齊，需要啓用 CPU
管理器並在節點上配置適當的 CPU 管理器策略。
參見[控制節點上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。
{{< /note >}}

{{< note >}}
<!--
To align memory (and hugepages) resources with other requested resources in a Pod spec, the Memory
Manager should be enabled and proper Memory Manager policy should be configured on a Node. Refer to
[Memory Manager](/docs/tasks/administer-cluster/memory-manager/) documentation.
-->
爲了將 Pod 規約中的內存（和 hugepages）資源與所請求的其他資源對齊，需要啓用內存管理器，
並且在節點配置適當的內存管理器策略。
查看[內存管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)文檔。
{{< /note >}}

<!--
## Topology manager scopes

The Topology Manager can deal with the alignment of resources in a couple of distinct scopes:

* `container` (default)
* `pod`

Either option can be selected at a time of the kubelet startup, by setting the
`topologyManagerScope` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
## 拓撲管理器作用域 {#topology-manager-scopes}

拓撲管理器可以在以下不同的作用域內進行資源對齊：

* `container`（默認）
* `pod`

在 kubelet 啓動時，你可以通過在
[kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中設置
`topologyManagerScope` 來選擇其中任一選項。

<!--
### `container` scope

The `container` scope is used by default. You can also explicitly set the
`topologyManagerScope` to `container` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
### `container` 作用域 {#container-scope}

默認使用的是 `container` 作用域。
你也可以在 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中明確將
`topologyManagerScope` 設置爲 `container`。

<!--
Within this scope, the Topology Manager performs a number of sequential resource alignments, i.e.,
for each container (in a pod) a separate alignment is computed. In other words, there is no notion
of grouping the containers to a specific set of NUMA nodes, for this particular scope. In effect,
the Topology Manager performs an arbitrary alignment of individual containers to NUMA nodes.
-->
在該作用域內，拓撲管理器依次進行一系列的資源對齊，
也就是，對（Pod 中的）每一個容器計算單獨的對齊。
換句話說，在該特定的作用域內，沒有根據特定的 NUMA 節點集來把容器分組的概念。
實際上，拓撲管理器會把單個容器任意地對齊到 NUMA 節點上。

<!--
The notion of grouping the containers was endorsed and implemented on purpose in the following
scope, for example the `pod` scope.
-->
容器分組的概念是在以下的作用域內特別實現的，也就是 `pod` 作用域。

<!--
### `pod` scope

To select the `pod` scope, set `topologyManagerScope` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/) to `pod`.
-->
### `pod` 作用域 {#pod-scope}

要選擇 `pod` 作用域，在 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中將
`topologyManagerScope` 設置爲 `pod`。

<!--
This scope allows for grouping all containers in a pod to a common set of NUMA nodes. That is, the
Topology Manager treats a pod as a whole and attempts to allocate the entire pod (all containers)
to either a single NUMA node or a common set of NUMA nodes. The following examples illustrate the
alignments produced by the Topology Manager on different occasions:
-->
此作用域允許把一個 Pod 裏的所有容器作爲一個分組，分配到一個共同的 NUMA 節點集。
也就是，拓撲管理器會把一個 Pod 當成一個整體，
並且嘗試把整個 Pod（所有容器）分配到單一的 NUMA 節點或者一個共同的 NUMA 節點集。
以下的例子說明了拓撲管理器在不同的場景下使用的對齊方式：

<!--
* all containers can be and are allocated to a single NUMA node;
* all containers can be and are allocated to a shared set of NUMA nodes.
-->
* 所有容器可以被分配到一個單一的 NUMA 節點，實際上也是這樣分配的；
* 所有容器可以被分配到一個共享的 NUMA 節點集，實際上也是這樣分配的。

<!--
The total amount of particular resource demanded for the entire pod is calculated according to
[effective requests/limits](/docs/concepts/workloads/pods/init-containers/#resource-sharing-within-containers)
formula, and thus, this total value is equal to the maximum of:

* the sum of all app container requests,
* the maximum of init container requests,

for a resource.
-->
整個 Pod 所請求的某種資源總量是根據
[有效 request/limit](/zh-cn/docs/concepts/workloads/pods/init-containers/#resource-sharing-within-containers)
公式來計算的，因此，對某一種資源而言，該總量等於以下數值中的最大值：

* 所有應用容器請求之和；
* 初始容器請求的最大值。

<!--
Using the `pod` scope in tandem with `single-numa-node` Topology Manager policy is specifically
valuable for workloads that are latency sensitive or for high-throughput applications that perform
IPC. By combining both options, you are able to place all containers in a pod onto a single NUMA
node; hence, the inter-NUMA communication overhead can be eliminated for that pod.
-->
`pod` 作用域與 `single-numa-node` 拓撲管理器策略一起使用，
對於延時敏感的工作負載，或者對於進行 IPC 的高吞吐量應用程序，都是特別有價值的。
把這兩個選項組合起來，你可以把一個 Pod 裏的所有容器都放到單一的 NUMA 節點，
使得該 Pod 消除了 NUMA 之間的通信開銷。

<!--
In the case of `single-numa-node` policy, a pod is accepted only if a suitable set of NUMA nodes
is present among possible allocations. Reconsider the example above:
-->
在 `single-numa-node` 策略下，只有當可能的分配方案中存在合適的 NUMA 節點集時，Pod 纔會被接受。
重新考慮上述的例子：

<!--
* a set containing only a single NUMA node - it leads to pod being admitted,
* whereas a set containing more NUMA nodes - it results in pod rejection (because instead of one
  NUMA node, two or more NUMA nodes are required to satisfy the allocation).
-->
* 節點集只包含單個 NUMA 節點時，Pod 就會被接受，
* 然而，節點集包含多個 NUMA 節點時，Pod 就會被拒絕
  （因爲滿足該分配方案需要兩個或以上的 NUMA 節點，而不是單個 NUMA 節點）。

<!--
To recap, the Topology Manager first computes a set of NUMA nodes and then tests it against the Topology
Manager policy, which either leads to the rejection or admission of the pod.
-->
簡要地說，拓撲管理器首先計算出 NUMA 節點集，然後使用拓撲管理器策略來測試該集合，
從而決定拒絕或者接受 Pod。

<!--
## Topology manager policies
-->
## 拓撲管理器策略 {#topology-manager-policies}

<!--
The Topology Manager supports four allocation policies. You can set a policy via a kubelet flag,
`--topology-manager-policy`. There are four supported policies:

* `none` (default)
* `best-effort`
* `restricted`
* `single-numa-node`
-->
拓撲管理器支持四種分配策略。
你可以通過 kubelet 標誌 `--topology-manager-policy` 設置策略。
所支持的策略有四種：

* `none`（默認）
* `best-effort`
* `restricted`
* `single-numa-node`

{{< note >}}
<!--
If the Topology Manager is configured with the **pod** scope, the container, which is considered by
the policy, is reflecting requirements of the entire pod, and thus each container from the pod
will result with **the same** topology alignment decision.
-->
如果拓撲管理器配置使用 **pod** 作用域，
那麼在策略評估一個容器時，該容器反映的是整個 Pod 的要求，
所以該 Pod 裏的每個容器都會應用**相同的**拓撲對齊決策。
{{< /note >}}

<!--
### `none` policy {#policy-none}

This is the default policy and does not perform any topology alignment.
-->
### `none` 策略 {#policy-none}

這是默認策略，不執行任何拓撲對齊。

<!--
### `best-effort` policy {#policy-best-effort}

For each container in a Pod, the kubelet, with `best-effort` topology management policy, calls
each Hint Provider to discover their resource availability. Using this information, the Topology
Manager stores the preferred NUMA Node affinity for that container. If the affinity is not
preferred, the Topology Manager will store this and admit the pod to the node anyway.
-->
### `best-effort` 策略 {#policy-best-effort}

對於 Pod 中的每個容器，具有 `best-effort` 拓撲管理策略的
kubelet 將調用每個建議提供者以確定資源可用性。
使用此信息，拓撲管理器存儲該容器的首選 NUMA 節點親和性。
如果親和性不是首選，則拓撲管理器將存儲該親和性，並且無論如何都將 Pod 接納到該節點。

<!--
The *Hint Providers* can then use this information when making the
resource allocation decision.
-->
之後**建議提供者**可以在進行資源分配決策時使用這個信息。

<!--
### `restricted` policy {#policy-restricted}

For each container in a Pod, the kubelet, with `restricted` topology management policy, calls each
Hint Provider to discover their resource availability. Using this information, the Topology
Manager stores the preferred NUMA Node affinity for that container. If the affinity is not
preferred, the Topology Manager will reject this pod from the node. This will result in a pod entering a
`Terminated` state with a pod admission failure.
-->
### `restricted` 策略 {#policy-restricted}

對於 Pod 中的每個容器，配置了 `restricted` 拓撲管理策略的 kubelet
調用每個建議提供者以確定其資源可用性。
使用此信息，拓撲管理器存儲該容器的首選 NUMA 節點親和性。
如果親和性不是首選，則拓撲管理器將從節點中拒絕此 Pod。
這將導致 Pod 進入 `Terminated` 狀態，且 Pod 無法被節點接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to
reschedule the pod. It is recommended to use a ReplicaSet or Deployment to trigger a redeployment of
the pod. An external control loop could be also implemented to trigger a redeployment of pods that
have the `Topology Affinity` error.
-->
一旦 Pod 處於 `Terminated` 狀態，Kubernetes 調度器將**不會**嘗試重新調度該 Pod。
建議使用 ReplicaSet 或者 Deployment 來觸發重新部署 Pod。
還可以通過實現外部控制環，以觸發重新部署具有 `Topology Affinity` 錯誤的 Pod。

<!--
If the pod is admitted, the *Hint Providers* can then use this information when making the
resource allocation decision.
-->
如果 Pod 被允許運行在某節點，則**建議提供者**可以在做出資源分配決定時使用此信息。

<!--
### `single-numa-node` policy {#policy-single-numa-node}

For each container in a Pod, the kubelet, with `single-numa-node` topology management policy,
calls each Hint Provider to discover their resource availability. Using this information, the
Topology Manager determines if a single NUMA Node affinity is possible. If it is, Topology
Manager will store this and the *Hint Providers* can then use this information when making the
resource allocation decision. If, however, this is not possible then the Topology Manager will
reject the pod from the node. This will result in a pod in a `Terminated` state with a pod
admission failure.
-->
### `single-numa-node` 策略 {#policy-single-numa-node}

對於 Pod 中的每個容器，配置了 `single-numa-node` 拓撲管理策略的
kubelet 調用每個建議提供者以確定其資源可用性。
使用此信息，拓撲管理器確定是否支持單 NUMA 節點親和性。
如果支持，則拓撲管理器將存儲此信息，然後**建議提供者**可以在做出資源分配決定時使用此信息。
如果不支持，則拓撲管理器將拒絕 Pod 運行於該節點。
這將導致 Pod 處於 `Terminated` 狀態，且 Pod 無法被節點接受。

<!--
Once the pod is in a `Terminated` state, the Kubernetes scheduler will **not** attempt to
reschedule the pod. It is recommended to use a Deployment with replicas to trigger a redeployment of
the Pod. An external control loop could be also implemented to trigger a redeployment of pods
that have the `Topology Affinity` error.
-->
一旦 Pod 處於 `Terminated` 狀態，Kubernetes 調度器將不會嘗試重新調度該 Pod。
建議使用多副本的 Deployment 來觸發重新部署 Pod。
還可以通過實現外部控制環，以觸發重新部署具有 `Topology Affinity` 錯誤的 Pod。

<!--
## Topology manager policy options

Support for the Topology Manager policy options requires `TopologyManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled
(it is enabled by default).
-->
## 拓撲管理器策略選項  {#topology-manager-policy-options}

對拓撲管理器策略選項的支持需要啓用 `TopologyManagerPolicyOptions`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（默認啓用）。

<!--
You can toggle groups of options on and off based upon their maturity level using the following feature gates:

* `TopologyManagerPolicyBetaOptions` default enabled. Enable to show beta-level options.
* `TopologyManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
-->
你可以使用以下特性門控根據成熟度級別打開和關閉這些選項組：

* `TopologyManagerPolicyBetaOptions` 默認啓用。啓用以顯示 Beta 級別選項。
* `TopologyManagerPolicyAlphaOptions` 默認禁用。啓用以顯示 Alpha 級別選項。

<!--
You will still have to enable each option using the `TopologyManagerPolicyOptions` kubelet option.
-->
你仍然需要使用 `TopologyManagerPolicyOptions` kubelet 選項來啓用每個選項。

<!--
### `prefer-closest-numa-nodes` {#policy-option-prefer-closest-numa-nodes}

The `prefer-closest-numa-nodes` option is GA since Kubernetes 1.32. In Kubernetes {{< skew currentVersion >}}
this policy option is visible by default provided that the `TopologyManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.
-->
### `prefer-closest-numa-nodes`   {#policy-option-prefer-closest-numa-nodes}

自 Kubernetes 1.32 起，`prefer-closest-numa-nodes` 選項進入 GA 階段。
在 Kubernetes {{< skew currentVersion >}} 中，只要啓用了
`TopologyManagerPolicyOptions` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
此策略選項默認可見。

<!--
The Topology Manager is not aware by default of NUMA distances, and does not take them into account when making
Pod admission decisions. This limitation surfaces in multi-socket, as well as single-socket multi NUMA systems,
and can cause significant performance degradation in latency-critical execution and high-throughput applications
if the Topology Manager decides to align resources on non-adjacent NUMA nodes.

If you specify the `prefer-closest-numa-nodes` policy option, the `best-effort` and `restricted`
policies favor sets of NUMA nodes with shorter distance between them when making admission decisions.
-->
拓撲管理器默認不會感知 NUMA 距離，並且在做出 Pod 准入決策時不會考慮這些距離。
這種限制出現在多插槽以及單插槽多 NUMA 系統中，如果拓撲管理器決定將資源對齊到不相鄰的 NUMA 節點上，
可能導致執行延遲敏感和高吞吐的應用出現明顯的性能下降。

如果你指定 `prefer-closest-numa-nodes` 策略選項，則在做出准入決策時 `best-effort` 和 `restricted`
策略將偏向於彼此之間距離較短的一組 NUMA 節點。

<!--
You can enable this option by adding `prefer-closest-numa-nodes=true` to the Topology Manager policy options.

By default (without this option), the Topology Manager aligns resources on either a single NUMA node or,
in the case where more than one NUMA node is required, using the minimum number of NUMA nodes.
-->
你可以通過將 `prefer-closest-numa-nodes=true` 添加到拓撲管理器策略選項來啓用此選項。

默認情況下，如果沒有此選項，拓撲管理器會在單個 NUMA 節點或（在需要多個 NUMA 節點時）最小數量的 NUMA 節點上對齊資源。

<!--
### `max-allowable-numa-nodes` (beta) {#policy-option-max-allowable-numa-nodes}

The `max-allowable-numa-nodes` option is beta since Kubernetes 1.31. In Kubernetes {{< skew currentVersion >}},
this policy option is visible by default provided that the `TopologyManagerPolicyOptions` and
`TopologyManagerPolicyBetaOptions` [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
are enabled.
-->
### `max-allowable-numa-nodes`（Beta） {#policy-option-max-allowable-numa-nodes}

自 Kubernetes 1.31 起，`max-allowable-numa-nodes` 選項進入 Beta 階段。
在 Kubernetes {{< skew currentVersion >}} 中，只要啓用了
`TopologyManagerPolicyOptions` 和 `TopologyManagerPolicyBetaOptions`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，此策略選項默認可見。

<!--
The time to admit a pod is tied to the number of NUMA nodes on the physical machine.
By default, Kubernetes does not run a kubelet with the Topology Manager enabled, on any (Kubernetes) node where
more than 8 NUMA nodes are detected.
-->
Pod 被准入的時間與物理機上的 NUMA 節點數量相關。
默認情況下，Kubernetes 不會在檢測到有 8 個以上 NUMA
節點的任何（Kubernetes）節點上運行啓用拓撲管理器的 kubelet。

{{< note >}}
<!--
If you select the `max-allowable-numa-nodes` policy option, nodes with more than 8 NUMA nodes can
be allowed to run with the Topology Manager enabled. The Kubernetes project only has limited data on the impact
of using the Topology Manager on (Kubernetes) nodes with more than 8 NUMA nodes. Because of that
lack of data, using this policy option with Kubernetes {{< skew currentVersion >}} is **not** recommended and is
at your own risk.
-->
如果你選擇 `max-allowable-numa-nodes` 策略選項，則可以允許在有 8 個以上 NUMA 節點的節點上啓用拓撲管理器。
Kubernetes 項目對在有 8 個以上 NUMA 節點的（Kubernetes）節點上使用拓撲管理器的影響只有有限的數據。
由於缺少數據，所以不推薦在 Kubernetes {{< skew currentVersion >}} 上使用此策略選項，你需自行承擔風險。
{{< /note >}}

<!--
You can enable this option by adding `max-allowable-numa-nodes=true` to the Topology Manager policy options.

Setting a value of `max-allowable-numa-nodes` does not (in and of itself) affect the
latency of pod admission, but binding a Pod to a (Kubernetes) node with many NUMA does have an impact.
Future, potential improvements to Kubernetes may improve Pod admission performance and the high
latency that happens as the number of NUMA nodes increases.
-->
你可以通過將 `max-allowable-numa-nodes=true` 添加到拓撲管理器策略選項來啓用此選項。

設置 `max-allowable-numa-nodes` 的值本身不會影響 Pod 准入的延時，
但將 Pod 綁定到有多個 NUMA 節點的（Kubernetes）節點確實會產生影響。
Kubernetes 後續潛在的改進可能會提高 Pod 准入性能，並降低隨着 NUMA 節點數量增加而產生的高延遲。

<!--
## Pod interactions with topology manager policies

Consider the containers in the following Pod manifest:
-->
### Pod 與拓撲管理器策略的交互 {#pod-interactions-with-topology-manager-policies}

考慮以下 Pod 清單中的容器：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
```

<!--
This pod runs in the `BestEffort` QoS class because no resource `requests` or `limits` are specified.
-->
該 Pod 以 `BestEffort` QoS 類運行，因爲沒有指定資源 `requests` 或 `limits`。

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
由於 `requests` 數少於 `limits`，因此該 Pod 以 `Burstable` QoS 類運行。

<!--
If the selected policy is anything other than `none`, the Topology Manager would consider these Pod
specifications. The Topology Manager would consult the Hint Providers to get topology hints.
In the case of the `static`, the CPU Manager policy would return default topology hint, because
these Pods do not explicitly request CPU resources.
-->
如果選擇的策略是 `none` 以外的任何其他策略，拓撲管理器都會評估這些 Pod 的規範。
拓撲管理器會諮詢建議提供者，獲得拓撲建議。
若策略爲 `static`，則 CPU 管理器策略會返回默認的拓撲建議，因爲這些 Pod
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
This pod with integer CPU request runs in the `Guaranteed` QoS class because `requests` are equal
to `limits`.
-->
此 Pod 獨立使用 CPU 請求量，以 `Guaranteed` QoS 類運行，因爲其 `requests` 值等於 `limits` 值。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

<!--
This pod with sharing CPU request runs in the `Guaranteed` QoS class because `requests` are equal
to `limits`.
-->
此 Pod 和其他資源共享 CPU 請求量，以 `Guaranteed` QoS 類運行，因爲其 `requests` 值等於 `limits` 值。


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
因爲未指定 CPU 和內存請求，所以 Pod 以 `BestEffort` QoS 類運行。

<!--
The Topology Manager would consider the above pods. The Topology Manager would consult the Hint
Providers, which are CPU and Device Manager to get topology hints for the pods.

In the case of the `Guaranteed` pod with integer CPU request, the `static` CPU Manager policy
would return topology hints relating to the exclusive CPU and the Device Manager would send back
hints for the requested device.
-->
拓撲管理器將考慮以上 Pod。拓撲管理器將諮詢建議提供者即 CPU 和設備管理器，以獲取 Pod 的拓撲提示。
對於獨立使用 CPU 請求量的 `Guaranteed` Pod，`static` CPU 管理器策略將返回獨佔 CPU 相關的拓撲提示，
而設備管理器將返回有關所請求設備的提示。

<!--
In the case of the `Guaranteed` pod with sharing CPU request, the `static` CPU Manager policy
would return default topology hint as there is no exclusive CPU request and the Device Manager
would send back hints for the requested device.

In the above two cases of the `Guaranteed` pod, the `none` CPU Manager policy would return default
topology hint.
-->
對於與其他資源 CPU 共享請求量的 `Guaranteed` Pod，`static` CPU
管理器策略將返回默認的拓撲提示，因爲沒有獨享的 CPU 請求；而設備管理器
則針對所請求的設備返回有關提示。

在上述兩種 `Guaranteed` Pod 的情況中，`none` CPU 管理器策略會返回默認的拓撲提示。

<!--
In the case of the `BestEffort` pod, the `static` CPU Manager policy would send back the default
topology hint as there is no CPU request and the Device Manager would send back the hints for each
of the requested devices.
-->
對於 `BestEffort` Pod，由於沒有 CPU 請求，`static` CPU 管理器策略將發送默認拓撲提示，
而設備管理器將爲每個請求的設備發送提示。

<!--
Using this information the Topology Manager calculates the optimal hint for the pod and stores
this information, which will be used by the Hint Providers when they are making their resource
assignments.
-->
基於此信息，拓撲管理器將爲 Pod 計算最佳提示並存儲該信息，並且供
提示提供程序在進行資源分配時使用。

<!--
## Known limitations

1. The maximum number of NUMA nodes that Topology Manager allows is 8. With more than 8 NUMA nodes,
   there will be a state explosion when trying to enumerate the possible NUMA affinities and
   generating their hints. See [`max-allowable-numa-nodes`](#policy-option-max-allowable-numa-nodes)
   (beta) for more options.

1. The scheduler is not topology-aware, so it is possible to be scheduled on a node and then fail
   on the node due to the Topology Manager.
-->
## 已知的侷限性 {#known-limitations}

1. 拓撲管理器所能處理的最大 NUMA 節點個數是 8。若 NUMA 節點數超過 8，
   枚舉可能的 NUMA 親和性併爲之生成提示時會發生狀態爆炸。
   更多選項參見 [`max-allowable-numa-nodes`](#policy-option-max-allowable-numa-nodes)（Beta）。
2. 調度器無法感知拓撲，所以有可能一個 Pod 被調度到一個節點之後，會因爲拓撲管理器的緣故在該節點上啓動失敗。
