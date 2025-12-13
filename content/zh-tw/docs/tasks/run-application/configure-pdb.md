---
title: 爲應用程式設置干擾預算（Disruption Budget）
content_type: task
weight: 110
min-kubernetes-server-version: v1.21
---

<!--
title: Specifying a Disruption Budget for your Application
content_type: task
weight: 110
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
This page shows how to limit the number of concurrent disruptions
that your application experiences, allowing for higher availability
while permitting the cluster administrator to manage the clusters
nodes.
-->
本文展示如何限制應用程式的併發干擾數量，在允許叢集管理員管理叢集節點的同時保證高可用。

## {{% heading "prerequisites" %}}

{{< version-check >}}

<!--
- You are the owner of an application running on a Kubernetes cluster that requires
  high availability.
- You should know how to deploy [Replicated Stateless Applications](/docs/tasks/run-application/run-stateless-application-deployment/)
  and/or [Replicated Stateful Applications](/docs/tasks/run-application/run-replicated-stateful-application/).
- You should have read about [Pod Disruptions](/docs/concepts/workloads/pods/disruptions/).
- You should confirm with your cluster owner or service provider that they respect
  Pod Disruption Budgets.
-->
- 你是 Kubernetes 叢集中某應用的所有者，該應用有高可用要求。
- 你應瞭解如何部署[無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
  和/或[有狀態應用](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)。
- 你應當已經閱讀過關於 [Pod 干擾](/zh-cn/docs/concepts/workloads/pods/disruptions/)的文檔。
- 使用者應當與叢集所有者或服務提供者確認其遵從 Pod 干擾預算（Pod Disruption Budgets）的規則。

<!-- steps -->

<!--
## Protecting an Application with a PodDisruptionBudget

1. Identify what application you want to protect with a PodDisruptionBudget (PDB).
1. Think about how your application reacts to disruptions.
1. Create a PDB definition as a YAML file.
1. Create the PDB object from the YAML file.
-->
## 用 PodDisruptionBudget 來保護應用   {#protecting-app-with-pdb}

1. 確定想要使用 PodDisruptionBudget（PDB）來保護的應用。
1. 考慮應用對干擾的反應。
1. 以 YAML 檔案形式定義 PDB。
1. 通過 YAML 檔案創建 PDB 對象。

<!-- discussion -->

<!--
## Identify an Application to Protect

The most common use case when you want to protect an application
specified by one of the built-in Kubernetes controllers:
-->
## 確定要保護的應用   {#identify-app-to-protect}

使用者想要保護通過內置的 Kubernetes 控制器指定的應用，這是最常見的使用場景：

- Deployment
- ReplicationController
- ReplicaSet
- StatefulSet

<!--
In this case, make a note of the controller's `.spec.selector`; the same
selector goes into the PDBs `.spec.selector`.
-->
在這種情況下，在控制器的 `.spec.selector` 字段中做記錄，並在 PDB 的
`.spec.selector` 字段中加入同樣的選擇算符。

<!--
From version 1.15 PDBs support custom controllers where the
[scale subresource](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)
is enabled.
-->
從 1.15 版本開始，PDB 支持啓用
[Scale 子資源](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)
的自定義控制器。

<!--
You can also use PDBs with pods which are not controlled by one of the above
controllers, or arbitrary groups of pods, but there are some restrictions,
described in [Arbitrary workloads and arbitrary selectors](#arbitrary-controllers-and-selectors).
-->
使用者也可以用 PDB 來保護不受上述控制器控制的 Pod，或任意的 Pod 集合，但是正如
[任意工作負載和任意選擇算符](#arbitrary-controllers-and-selectors)中描述的，這裏存在一些限制。

<!--
## Think about how your application reacts to disruptions

Decide how many instances can be down at the same time for a short period
due to a voluntary disruption.
-->
## 考慮應用對干擾的反應

確定在自發干擾時，多少實例可以在短時間內同時關閉。

<!--
- Stateless frontends:
  - Concern: don't reduce serving capacity by more than 10%.
    - Solution: use PDB with minAvailable 90% for example.
- Single-instance Stateful Application:
  - Concern: do not terminate this application without talking to me.
    - Possible Solution 1: Do not use a PDB and tolerate occasional downtime.
    - Possible Solution 2: Set PDB with maxUnavailable=0. Have an understanding
      (outside of Kubernetes) that the cluster operator needs to consult you before
      termination. When the cluster operator contacts you, prepare for downtime,
      and then delete the PDB to indicate readiness for disruption. Recreate afterwards.
- Multiple-instance Stateful application such as Consul, ZooKeeper, or etcd:
  - Concern: Do not reduce number of instances below quorum, otherwise writes fail.
    - Possible Solution 1: set maxUnavailable to 1 (works with varying scale of application).
    - Possible Solution 2: set minAvailable to quorum-size (e.g. 3 when scale is 5).
      (Allows more disruptions at once).
- Restartable Batch Job:
  - Concern: Job needs to complete in case of voluntary disruption.
    - Possible solution: Do not create a PDB. The Job controller will create a replacement pod.
-->
- 無狀態的前端：
  - 關注：不能降低服務能力 10% 以上。
    - 解決方案：例如，使用 PDB，指定其 minAvailable 值爲 90%。
- 單實例有狀態應用：
  - 關注：不要在不通知的情況下終止該應用。
    - 可能的解決方案 1：不使用 PDB，並忍受偶爾的停機。
    - 可能的解決方案 2：設置 maxUnavailable=0 的 PDB。
      意爲（Kubernetes 範疇之外的）叢集操作人員需要在終止應用前與使用者協商，
      協商後準備停機，然後刪除 PDB 表示準備接受干擾，後續再重新創建。
- 多實例有狀態應用，如 Consul、ZooKeeper 或 etcd：
  - 關注：不要將實例數量減少至低於仲裁規模，否則將出現寫入失敗。
    - 可能的解決方案 1：設置 maxUnavailable 值爲 1 (適用於不同規模的應用)。
    - 可能的解決方案 2：設置 minAvailable 值爲仲裁規模（例如規模爲 5 時設置爲 3）。
      (允許同時出現更多的干擾)。
- 可重新啓動的批處理任務：
  - 關注：自發干擾的情況下，需要確保任務完成。
    - 可能的解決方案：不創建 PDB。任務控制器會創建一個替換 Pod。

<!--
### Rounding logic when specifying percentages

Values for `minAvailable` or `maxUnavailable` can be expressed as integers or as a percentage.
-->
### 指定百分比時的舍入邏輯   {#rounding-logic-when-specifying-percentages}

`minAvailable` 或 `maxUnavailable` 的值可以表示爲整數或百分比。

<!--
- When you specify an integer, it represents a number of Pods. For instance, if you set
  `minAvailable` to 10, then 10 Pods must always be available, even during a disruption.
- When you specify a percentage by setting the value to a string representation of a
  percentage (eg. `"50%"`), it represents a percentage of total Pods. For instance, if
  you set `minAvailable` to `"50%"`, then at least 50% of the Pods remain available
  during a disruption.
-->
- 指定整數值時，它表示 Pod 個數。例如，如果將 `minAvailable` 設置爲 10，
  那麼即使在干擾期間，也必須始終有 10 個 Pod 可用。
- 通過將值設置爲百分比的字符串表示形式（例如 `"50％"`）來指定百分比時，它表示佔總 Pod 數的百分比。
  例如，如果將 `minAvailable` 設置爲 `"50％"`，則干擾期間至少 50％ 的 Pod 保持可用。

<!--
When you specify the value as a percentage, it may not map to an exact number of Pods.
For example, if you have 7 Pods and you set `minAvailable` to `"50%"`, it's not
immediately obvious whether that means 3 Pods or 4 Pods must be available. Kubernetes
rounds up to the nearest integer, so in this case, 4 Pods must be available. When you
specify the value `maxUnavailable` as a percentage, Kubernetes rounds up the number of
Pods that may be disrupted. Thereby a disruption can exceed your defined
`maxUnavailable` percentage. You can examine the
[code](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)
that controls this behavior.
-->
如果將值指定爲百分比，則可能無法映射到確切數量的 Pod。例如，如果你有 7 個 Pod，
並且你將 `minAvailable` 設置爲 `"50％"`，具體是 3 個 Pod 或 4 個 Pod 必須可用並非顯而易見。
Kubernetes 採用向上取整到最接近的整數的辦法，因此在這種情況下，必須有 4 個 Pod。
當你將 `maxUnavailable` 值指定爲一個百分比時，Kubernetes 將可以干擾的 Pod 個數向上取整。
因此干擾可以超過你定義的 `maxUnavailable` 百分比。
你可以檢查控制此行爲的[代碼](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)。

<!--
## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has three fields:
-->
## 指定 PodDisruptionBudget   {#specifying-a-poddisruptionbudget}

一個 `PodDisruptionBudget` 有 3 個字段：

<!--
- A label selector `.spec.selector` to specify the set of
  pods to which it applies. This field is required.
- `.spec.minAvailable` which is a description of the number of pods from that
  set that must still be available after the eviction, even in the absence
  of the evicted pod. `minAvailable` can be either an absolute number or a percentage.
- `.spec.maxUnavailable` (available in Kubernetes 1.7 and higher) which is a description
  of the number of pods from that set that can be unavailable after the eviction.
  It can be either an absolute number or a percentage.
-->
- 標籤選擇算符 `.spec.selector` 用於指定其所作用的 Pod 集合，該字段爲必需字段。
- `.spec.minAvailable` 表示驅逐後仍須保證可用的 Pod 數量。即使因此影響到 Pod 驅逐
  （即該條件在和 Pod 驅逐發生衝突時優先保證）。
  `minAvailable` 值可以是絕對值，也可以是百分比。
- `.spec.maxUnavailable` （Kubernetes 1.7 及更高的版本中可用）表示驅逐後允許不可用的
  Pod 的最大數量。其值可以是絕對值或是百分比。

{{< note >}}
<!--
The behavior for an empty selector differs between the policy/v1beta1 and policy/v1 APIs for
PodDisruptionBudgets. For policy/v1beta1 an empty selector matches zero pods, while
for policy/v1 an empty selector matches every pod in the namespace.
-->
`policy/v1beta1` 和 `policy/v1` API 中 PodDisruptionBudget 的空選擇算符的行爲
略有不同。在 `policy/v1beta1` 中，空的選擇算符不會匹配任何 Pod，而
`policy/v1` 中，空的選擇算符會匹配名字空間中所有 Pod。
{{< /note >}}

<!--
You can specify only one of `maxUnavailable` and `minAvailable` in a single `PodDisruptionBudget`.
`maxUnavailable` can only be used to control the eviction of pods
that all have the same associated controller managing them. In the examples below, "desired replicas"
is the `scale` of the controller managing the pods being selected by the
`PodDisruptionBudget`.
-->
使用者在同一個 `PodDisruptionBudget` 中只能夠指定 `maxUnavailable` 和 `minAvailable` 中的一個。
`maxUnavailable` 只能夠用於控制存在同一個關聯控制器的 Pod 的驅逐（即不受控制器控制的 Pod 不在
`maxUnavailable` 控制範圍內）。在下面的示例中，
“所需副本”指的是相應控制器的 `scale`，控制器對 `PodDisruptionBudget` 所選擇的 Pod 進行管理。

<!--
Example 1: With a `minAvailable` of 5, evictions are allowed as long as they leave behind
5 or more [healthy](#healthiness-of-a-pod) pods among those selected by the PodDisruptionBudget's `selector`.
-->
示例 1：設置 `minAvailable` 值爲 5 的情況下，驅逐時需保證 PodDisruptionBudget 的 `selector`
選中的 Pod 中 5 個或 5 個以上處於[健康](#healthiness-of-a-pod)狀態。

<!--
Example 2: With a `minAvailable` of 30%, evictions are allowed as long as at least 30%
of the number of desired replicas are healthy.
-->
示例 2：設置 `minAvailable` 值爲 30% 的情況下，驅逐時需保證 Pod 所需副本的至少 30% 處於健康狀態。

<!--
Example 3: With a `maxUnavailable` of 5, evictions are allowed as long as there are at most 5
unhealthy replicas among the total number of desired replicas.
-->
示例 3：設置 `maxUnavailable` 值爲 5 的情況下，驅逐時需保證所需副本中最多 5 個處於不可用狀態。

<!--
Example 4: With a `maxUnavailable` of 30%, evictions are allowed as long as the number of 
unhealthy replicas does not exceed 30% of the total number of desired replica rounded up to 
the nearest integer. If the total number of desired replicas is just one, that single replica
is still allowed for disruption, leading to an effective unavailability of 100%.
-->
示例 4：設置 `maxUnavailable` 值爲 30% 的情況下，只要不健康的副本數量不超過所需副本總數的 30%
（取整到最接近的整數），就允許驅逐。如果所需副本的總數僅爲一個，則仍允許該單個副本中斷，
從而導致不可用性實際達到 100%。

<!--
In typical usage, a single budget would be used for a collection of pods managed by
a controller—for example, the pods in a single ReplicaSet or StatefulSet.
-->
在典型用法中，干擾預算會被用於一個控制器管理的一組 Pod 中 —— 例如：一個 ReplicaSet 或 StatefulSet
中的 Pod。

{{< note >}}
<!--
A disruption budget does not truly guarantee that the specified
number/percentage of pods will always be up. For example, a node that hosts a
pod from the collection may fail when the collection is at the minimum size
specified in the budget, thus bringing the number of available pods from the
collection below the specified size. The budget can only protect against
voluntary evictions, not all causes of unavailability.
-->
干擾預算並不能真正保證指定數量/百分比的 Pod 一直處於運行狀態。例如：當 Pod
集合的規模處於預算指定的最小值時，承載集合中某個 Pod 的節點發生了故障，這樣就導致集合中可用
Pod 的數量低於預算指定值。預算只能夠針對自發的驅逐提供保護，而不能針對所有 Pod 不可用的誘因。
{{< /note >}}

<!--
If you set `maxUnavailable` to 0% or 0, or you set `minAvailable` to 100% or the number of replicas,
you are requiring zero voluntary evictions. When you set zero voluntary evictions for a workload
object such as ReplicaSet, then you cannot successfully drain a Node running one of those Pods.
If you try to drain a Node where an unevictable Pod is running, the drain never completes.
This is permitted as per the semantics of `PodDisruptionBudget`.
-->
如果你將 `maxUnavailable` 的值設置爲 0%（或 0）或設置 `minAvailable` 值爲 100%（或等於副本數）
則會阻止所有的自願驅逐。
當你爲 ReplicaSet 等工作負載對象設置阻止自願驅逐時，你將無法成功地騰空運行其中一個 Pod 的節點。
如果你嘗試騰空正在運行着被阻止驅逐的 Pod 的節點，則騰空永遠不會完成。
按照 `PodDisruptionBudget` 的語義，這是允許的。

<!--
You can find examples of pod disruption budgets defined below. They match pods with the label
`app: zookeeper`.
-->
使用者可以在下面看到 Pod 干擾預算定義的示例，它們與帶有 `app: zookeeper` 標籤的 Pod 相匹配：

<!--
Example PDB Using minAvailable:
-->
使用 minAvailable 的 PDB 示例：

{{% code_sample file="policy/zookeeper-pod-disruption-budget-minavailable.yaml" %}}

<!--
Example PDB Using maxUnavailable:
-->
使用 maxUnavailable 的 PDB 示例：

{{% code_sample file="policy/zookeeper-pod-disruption-budget-maxunavailable.yaml" %}}

<!--
For example, if the above `zk-pdb` object selects the pods of a StatefulSet of size 3, both
specifications have the exact same meaning. The use of `maxUnavailable` is recommended as it
automatically responds to changes in the number of replicas of the corresponding controller.
-->
例如，如果上述 `zk-pdb` 選擇的是一個規格爲 3 的 StatefulSet 對應的 Pod，
那麼上面兩種規範的含義完全相同。
推薦使用 `maxUnavailable`，因爲它自動響應控制器副本數量的變化。

<!--
## Create the PDB object

You can create or update the PDB object using kubectl.
-->
## 創建 PDB 對象   {#create-pdb-object}

你可以使用 kubectl 創建或更新 PDB 對象。

```shell
kubectl apply -f mypdb.yaml
```

<!--
## Check the status of the PDB

Use kubectl to check that your PDB is created.
-->
## 檢查 PDB 的狀態   {#check-status-of-pdb}

使用 kubectl 來確認 PDB 被創建。

<!--
Assuming you don't actually have pods matching `app: zookeeper` in your namespace,
then you'll see something like this:
-->
假設使用者的名字空間下沒有匹配 `app: zookeeper` 的 Pod，使用者會看到類似下面的資訊：

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               0                     7s
```

<!--
If there are matching pods (say, 3), then you would see something like this:
-->
假設有匹配的 Pod（比如說 3 個），那麼使用者會看到類似下面的資訊：

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s

```

<!--
The non-zero value for `ALLOWED DISRUPTIONS` means that the disruption controller has seen the pods,
counted the matching pods, and updated the status of the PDB.

You can get more information about the status of a PDB with this command:
-->
`ALLOWED DISRUPTIONS` 值非 0 意味着干擾控制器已經感知到相應的 Pod，對匹配的 Pod 進行統計，
並更新了 PDB 的狀態。

使用者可以通過以下命令獲取更多 PDB 狀態相關資訊：

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  annotations:
…
  creationTimestamp: "2020-03-04T04:22:56Z"
  generation: 1
  name: zk-pdb
…
status:
  currentHealthy: 3
  desiredHealthy: 2
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

<!--
### Healthiness of a Pod

The current implementation considers healthy pods, as pods that have `.status.conditions`
item with `type="Ready"` and `status="True"`.
These pods are tracked via `.status.currentHealthy` field in the PDB status.
-->
### Pod 的健康  {#healthiness-of-a-pod}

如果 Pod 的 `.status.conditions` 中包含 `type="Ready"` 和 `status="True"` 的項，
則當前實現將其視爲健康的 Pod。這些 Pod 通過 PDB 狀態中的 `.status.currentHealthy` 字段被跟蹤。

<!--
## Unhealthy Pod Eviction Policy
-->
## 不健康的 Pod 驅逐策略   {#unhealthy-pod-eviction-policy}

{{< feature-state feature_gate_name="PDBUnhealthyPodEvictionPolicy" >}}

<!--
PodDisruptionBudget guarding an application ensures that `.status.currentHealthy` number of pods
does not fall below the number specified in `.status.desiredHealthy` by disallowing eviction of healthy pods.
By using `.spec.unhealthyPodEvictionPolicy`, you can also define the criteria when unhealthy pods
should be considered for eviction. The default behavior when no policy is specified corresponds
to the `IfHealthyBudget` policy.
-->
守護應用程式的 PodDisruptionBudget 通過不允許驅逐健康的 Pod 來確保 `.status.currentHealthy` 的 Pod
數量不低於 `.status.desiredHealthy` 中指定的數量。通過使用 `.spec.unhealthyPodEvictionPolicy`，
你還可以定義條件來判定何時應考慮驅逐不健康的 Pod。未指定策略時的預設行爲對應於 `IfHealthyBudget` 策略。

<!--
Policies:
-->
策略包含：

<!--
`IfHealthyBudget`
: Running pods (`.status.phase="Running"`), but not yet healthy can be evicted only
  if the guarded application is not disrupted (`.status.currentHealthy` is at least
  equal to `.status.desiredHealthy`).

: This policy ensures that running pods of an already disrupted application have
  the best chance to become healthy. This has negative implications for draining
  nodes, which can be blocked by misbehaving applications that are guarded by a PDB.
  More specifically applications with pods in `CrashLoopBackOff` state
  (due to a bug or misconfiguration), or pods that are just failing to report the
  `Ready` condition.
-->
`IfHealthyBudget`
: 對於運行中但還不健康的 Pod（`.status.phase="Running"`），只有所守護的應用程式不受干擾
  （`.status.currentHealthy` 至少等於 `.status.desiredHealthy`）時才能被驅逐。

: 此策略確保已受干擾的應用程式所運行的 Pod 會儘可能成爲健康。
  這對騰空節點有負面影響，可能會因 PDB 守護的應用程式行爲錯誤而阻止騰空。
  更具體地說，這些應用程式的 Pod 處於 `CrashLoopBackOff` 狀態
  （由於漏洞或錯誤設定）或其 Pod 只是未能報告 `Ready` 狀況。

<!--
`AlwaysAllow`
: Running pods (`.status.phase="Running"`), but not yet healthy are considered
  disrupted and can be evicted regardless of whether the criteria in a PDB is met.

: This means prospective running pods of a disrupted application might not get a
  chance to become healthy. By using this policy, cluster managers can easily evict
  misbehaving applications that are guarded by a PDB. More specifically applications
  with pods in `CrashLoopBackOff` state (due to a bug or misconfiguration), or pods
  that are just failing to report the `Ready` condition.
-->
`AlwaysAllow`
: 運行中但還不健康的 Pod（`.status.phase="Running"`）將被視爲已受干擾且可以被驅逐，
  與是否滿足 PDB 中的判決條件無關。

: 這意味着受干擾的應用程式所運行的 Pod 可能沒有機會恢復健康。
  通過使用此策略，叢集管理器可以輕鬆驅逐由 PDB 所守護的行爲錯誤的應用程式。
  更具體地說，這些應用程式的 Pod 處於 `CrashLoopBackOff` 狀態
  （由於漏洞或錯誤設定）或其 Pod 只是未能報告 `Ready` 狀況。

{{< note >}}
<!--
Pods in `Pending`, `Succeeded` or `Failed` phase are always considered for eviction.
-->
處於 `Pending`、`Succeeded` 或 `Failed` 階段的 Pod 總是被考慮驅逐。
{{< /note >}}

<!--
## Arbitrary workloads and arbitrary selectors {#arbitrary-controllers-and-selectors}

You can skip this section if you only use PDBs with the built-in
workload resources (Deployment, ReplicaSet, StatefulSet and ReplicationController)
or with {{< glossary_tooltip term_id="CustomResourceDefinition" text="custom resources" >}}
that implement a `scale` [subresource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#advanced-features-and-flexibility),
and where the PDB selector exactly matches the selector of the Pod's owning resource.
-->
## 任意工作負載和任意選擇算符   {#arbitrary-controllers-and-selectors}

如果你只針對內置的工作負載資源（Deployment、ReplicaSet、StatefulSet 和 ReplicationController）
或在實現了 `scale` [子資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/#advanced-features-and-flexibility)
的{{< glossary_tooltip term_id="CustomResourceDefinition" text="自定義資源" >}}使用 PDB，
並且 PDB 選擇算符與 Pod 所屬資源的選擇算符完全匹配，那麼可以跳過這一節。

<!--
You can use a PDB with pods controlled by another resource, by an
"operator", or bare pods, but with these restrictions:
-->
你可以針對由其他資源、某個 "operator" 控制的或者“裸的（不受控制器控制）” Pod
使用 PDB，但存在以下限制：

<!--
- only `.spec.minAvailable` can be used, not `.spec.maxUnavailable`.
- only an integer value can be used with `.spec.minAvailable`, not a percentage.
-->
- 只能夠使用 `.spec.minAvailable`，而不能夠使用 `.spec.maxUnavailable`。
- 只能夠使用整數作爲 `.spec.minAvailable` 的值，而不能使用百分比。

<!--
It is not possible to use other availability configurations,
because Kubernetes cannot derive a total number of pods without a supported owning resource.

You can use a selector which selects a subset or superset of the pods belonging to a
workload resource. The eviction API will disallow eviction of any pod covered by multiple PDBs,
so most users will want to avoid overlapping selectors. One reasonable use of overlapping
PDBs is when pods are being transitioned from one PDB to another.
-->
你無法使用其他的可用性設定，因爲如果沒有被支持的屬主資源，Kubernetes 無法推導出 Pod 的總數。

你可以使用能夠選擇屬於工作負載資源的 Pod 的子集或超集的選擇算符。
驅逐 API 將不允許驅逐被多個 PDB 覆蓋的任何 Pod，因此大多數使用者都希望避免重疊的選擇算符。
重疊 PDB 的一種合理用途是將 Pod 從一個 PDB 轉交到另一個 PDB 的場合。
