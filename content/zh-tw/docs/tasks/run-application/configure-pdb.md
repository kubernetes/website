---
title: 為應用程式設定干擾預算（Disruption Budget）
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
* You are the owner of an application running on a Kubernetes cluster that requires
  high availability.
* You should know how to deploy [Replicated Stateless Applications](/docs/tasks/run-application/run-stateless-application-deployment/)
  and/or [Replicated Stateful Applications](/docs/tasks/run-application/run-replicated-stateful-application/).
* You should have read about [Pod Disruptions](/docs/concepts/workloads/pods/disruptions/).
* You should confirm with your cluster owner or service provider that they respect
  Pod Disruption Budgets.
-->
* 你是 Kubernetes 叢集中某應用的所有者，該應用有高可用要求。
* 你應瞭解如何部署[無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
  和/或[有狀態應用](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)。
* 你應當已經閱讀過關於 [Pod 干擾](/zh-cn/docs/concepts/workloads/pods/disruptions/) 的文件。
* 使用者應當與叢集所有者或服務提供者確認其遵從 Pod 干擾預算（Pod Disruption Budgets）的規則。

<!-- steps -->

<!--
## Protecting an Application with a PodDisruptionBudget

1. Identify what application you want to protect with a PodDisruptionBudget (PDB).
1. Think about how your application reacts to disruptions.
1. Create a PDB definition as a YAML file.
1. Create the PDB object from the YAML file.
-->
## 用 PodDisruptionBudget 來保護應用

1. 確定想要使用 PodDisruptionBudget (PDB) 來保護的應用。
1. 考慮應用對干擾的反應。
1. 以 YAML 檔案形式定義 PDB 。
1. 透過 YAML 檔案建立 PDB 物件。

<!-- discussion -->

<!--
## Identify an Application to Protect

The most common use case when you want to protect an application
specified by one of the built-in Kubernetes controllers:
-->
## 確定要保護的應用

使用者想要保護透過內建的 Kubernetes 控制器指定的應用，這是最常見的使用場景：

- Deployment
- ReplicationController
- ReplicaSet
- StatefulSet

<!--
In this case, make a note of the controller's `.spec.selector`; the same
selector goes into the PDBs `.spec.selector`.
-->
在這種情況下，在控制器的 `.spec.selector` 欄位中做記錄，並在 PDB 的
`.spec.selector` 欄位中加入同樣的選擇算符。

<!--
From version 1.15 PDBs support custom controllers where the [scale subresource](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource) is enabled.
-->
從 1.15 版本開始，PDB 支援啟用
[scale 子資源](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)
的自定義控制器。

<!--
You can also use PDBs with pods which are not controlled by one of the above
controllers, or arbitrary groups of pods, but there are some restrictions,
described in [Arbitrary Controllers and Selectors](#arbitrary-controllers-and-selectors).
-->
使用者也可以用 PDB 來保護不受上述控制器控制的 Pod，或任意的 Pod 集合，但是正如
[任意控制器和選擇算符](#arbitrary-controllers-and-selectors)中描述的，這裡存在一些限制。

<!--
## Think about how your application reacts to disruptions

Decide how many instances can be down at the same time for a short period
due to a voluntary disruption.
-->
## 考慮應用對干擾的反應

確定在自發干擾時，多少例項可以在短時間內同時關閉。

<!--
- Stateless frontends:
  - Concern: don't reduce serving capacity by more than 10%.
    - Solution: use PDB with minAvailable 90% for example.
- Single-instance Stateful Application:
  - Concern: do not terminate this application without talking to me.
    - Possible Solution 1: Do not use a PDB and tolerate occasional downtime.
    - Possible Solution 2: Set PDB with maxUnavailable=0.  Have an understanding
      (outside of Kubernetes) that the cluster operator needs to consult you before
      termination.  When the cluster operator contacts you, prepare for downtime,
      and then delete the PDB to indicate readiness for disruption.  Recreate afterwards.
- Multiple-instance Stateful application such as Consul, ZooKeeper, or etcd:
  - Concern: Do not reduce number of instances below quorum, otherwise writes fail.
    - Possible Solution 1: set maxUnavailable to 1 (works with varying scale of application).
    - Possible Solution 2: set minAvailable to quorum-size (e.g. 3 when scale is 5).  (Allows more disruptions at once).
- Restartable Batch Job:
  - Concern: Job needs to complete in case of voluntary disruption.
    - Possible solution: Do not create a PDB.  The Job controller will create a replacement pod.
-->
- 無狀態的前端：
  - 關注：不能降低服務能力 10% 以上。
    - 解決方案：例如，使用 PDB，指定其 minAvailable 值為 90%。
- 單例項有狀態應用：
  - 關注：不要在不通知的情況下終止該應用。
    - 可能的解決方案 1：不使用 PDB，並忍受偶爾的停機。
    - 可能的解決方案 2：設定 maxUnavailable=0 的 PDB。
      意為（Kubernetes 範疇之外的）叢集操作人員需要在終止應用前與使用者協商，
      協商後準備停機，然後刪除 PDB 表示準備接受干擾，後續再重新建立。
- 多例項有狀態應用，如 Consul、ZooKeeper 或 etcd：
  - 關注：不要將例項數量減少至低於仲裁規模，否則將出現寫入失敗。
    - 可能的解決方案 1：設定 maxUnavailable 值為 1 (適用於不同規模的應用)。
    - 可能的解決方案 2：設定 minAvailable 值為仲裁規模（例如規模為 5 時設定為 3）。
      (允許同時出現更多的干擾)。
- 可重新啟動的批處理任務：
  - 關注：自發干擾的情況下，需要確保任務完成。
    - 可能的解決方案：不建立 PDB。 任務控制器會建立一個替換 Pod。

<!--
### Rounding logic when specifying percentages

Values for `minAvailable` or `maxUnavailable` can be expressed as integers or as a percentage.
-->
### 指定百分比時的舍入邏輯

`minAvailable` 或 `maxUnavailable` 的值可以表示為整數或百分比。

<!--
- When you specify an integer, it represents a number of Pods. For instance, if you set `minAvailable` to 10, then 10
  Pods must always be available, even during a disruption.
- When you specify a percentage by setting the value to a string representation of a percentage (eg. `"50%"`), it represents a percentage of
  total Pods. For instance, if you set `minUnavailable` to `"50%"`, then only 50% of the Pods can be unavailable during a
  disruption.
-->
- 指定整數值時，它表示 Pod 個數。例如，如果將 minAvailable 設定為 10，
  那麼即使在干擾期間，也必須始終有 10 個Pod可用。
- 透過將值設定為百分比的字串表示形式（例如 “50％”）來指定百分比時，它表示佔總 Pod 數的百分比。
  例如，如果將 "minUnavailable" 設定為 “50％”，則干擾期間只允許 50％ 的 Pod 不可用。

<!--
When you specify the value as a percentage, it may not map to an exact number
of Pods. For example, if you have 7 Pods and you set `minAvailable` to
`"50%"`, it's not immediately obvious whether that means 3 Pods or 4 Pods must
be available.  Kubernetes rounds up to the nearest integer, so in this case, 4
Pods must be available. You can examine the
[code](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)
that controls this behavior.
-->
如果將值指定為百分比，則可能無法對映到確切數量的 Pod。例如，如果你有 7 個 Pod，
並且你將 `minAvailable` 設定為 `"50％"`，具體是 3 個 Pod 或 4 個 Pod 必須可用
並非顯而易見。
Kubernetes 採用向上取整到最接近的整數的辦法，因此在這種情況下，必須有 4 個 Pod。
你可以檢查控制此行為的
[程式碼](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)。

<!--
## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has three fields: 
-->
## 指定 PodDisruptionBudget

一個 `PodDisruptionBudget` 有 3 個欄位：

<!--
* A label selector `.spec.selector` to specify the set of
pods to which it applies. This field is required.
* `.spec.minAvailable` which is a description of the number of pods from that
set that must still be available after the eviction, even in the absence
of the evicted pod. `minAvailable` can be either an absolute number or a percentage.
* `.spec.maxUnavailable` (available in Kubernetes 1.7 and higher) which is a description
of the number of pods from that set that can be unavailable after the eviction.
It can be either an absolute number or a percentage.
-->
* 標籤選擇算符 `.spec.selector` 用於指定其所作用的 Pod 集合，該欄位為必需欄位。
* `.spec.minAvailable` 表示驅逐後仍須保證可用的 Pod 數量。即使因此影響到 Pod 驅逐
  （即該條件在和 Pod 驅逐發生衝突時優先保證）。
  `minAvailable` 值可以是絕對值，也可以是百分比。
* `.spec.maxUnavailable` （Kubernetes 1.7 及更高的版本中可用）表示驅逐後允許不可用的
  Pod 的最大數量。其值可以是絕對值或是百分比。

{{< note >}}
<!--
The behavior for an empty selector differs between the policy/v1beta1 and policy/v1 APIs for
PodDisruptionBudgets. For policy/v1beta1 an empty selector matches zero pods, while
for policy/v1 an empty selector matches every pod in the namespace.
-->
`policy/v1beta1` 和 `policy/v1` API 中 PodDisruptionBudget 的空選擇算符的行為
略有不同。在 `policy/v1beta1` 中，空的選擇算符不會匹配任何 Pods，而
`policy/v1` 中，空的選擇算符會匹配名字空間中所有 Pods。
{{< /note >}}

<!--
You can specify only one of `maxUnavailable` and `minAvailable` in a single `PodDisruptionBudget`.
`maxUnavailable` can only be used to control the eviction of pods
that have an associated controller managing them. In the examples below, "desired replicas"
is the `scale` of the controller managing the pods being selected by the
`PodDisruptionBudget`.
-->
使用者在同一個 `PodDisruptionBudget` 中只能夠指定 `maxUnavailable` 和 `minAvailable` 中的一個。
`maxUnavailable` 只能夠用於控制存在相應控制器的 Pod 的驅逐（即不受控制器控制的 Pod 不在
`maxUnavailable` 控制範圍內）。在下面的示例中，
“所需副本” 指的是相應控制器的 `scale`，控制器對 `PodDisruptionBudget` 所選擇的 Pod 進行管理。

<!--
Example 1: With a `minAvailable` of 5, evictions are allowed as long as they leave behind
5 or more healthy pods among those selected by the PodDisruptionBudget's `selector`.
-->
示例 1：設定 `minAvailable` 值為 5 的情況下，驅逐時需保證 PodDisruptionBudget 的 `selector`
選中的 Pod 中 5 個或 5 個以上處於健康狀態。

<!--
Example 2: With a `minAvailable` of 30%, evictions are allowed as long as at least 30%
of the number of desired replicas are healthy. 
-->
示例 2：設定 `minAvailable` 值為 30% 的情況下，驅逐時需保證 Pod 所需副本的至少 30% 處於健康狀態。

<!--
Example 3: With a `maxUnavailable` of 5, evictions are allowed as long as there are at most 5
unhealthy replicas among the total number of desired replicas.
-->
示例 3：設定 `maxUnavailable` 值為 5 的情況下，驅逐時需保證所需副本中最多 5 個處於不可用狀態。

<!--
Example 4: With a `maxUnavailable` of 30%, evictions are allowed as long as no more than 30%
of the desired replicas are unhealthy.
-->
示例 4：設定 `maxUnavailable` 值為 30% 的情況下，驅逐時需保證所需副本中最多 30% 處於不可用狀態。

<!--
In typical usage, a single budget would be used for a collection of pods managed by
a controller—for example, the pods in a single ReplicaSet or StatefulSet. 
-->
在典型用法中，干擾預算會被用於一個控制器管理的一組 Pod 中 —— 例如：一個 ReplicaSet 或 StatefulSet
中的 Pod。

<!--
A disruption budget does not truly guarantee that the specified
number/percentage of pods will always be up.  For example, a node that hosts a
pod from the collection may fail when the collection is at the minimum size
specified in the budget, thus bringing the number of available pods from the
collection below the specified size. The budget can only protect against
voluntary evictions, not all causes of unavailability.
-->
{{< note >}}
干擾預算並不能真正保證指定數量/百分比的 Pod 一直處於執行狀態。例如： 當 Pod 集合的
規模處於預算指定的最小值時，承載集合中某個 Pod 的節點發生了故障，這樣就導致集合中可用 Pod 的
數量低於預算指定值。預算只能夠針對自發的驅逐提供保護，而不能針對所有 Pod 不可用的誘因。
{{< /note >}}

<!--
A `maxUnavailable` of 0% (or 0) or a `minAvailable` of 100% (or equal to the
number of replicas) may block node drains entirely. This is permitted as per the
semantics of `PodDisruptionBudget`.
-->
設定 `maxUnavailable` 值為 0%（或 0）或設定 `minAvailable` 值為 100%（或等於副本數）
可能會阻塞節點，導致資源耗盡。按照 `PodDisruptionBudget` 的語義，這是允許的。

<!--
You can find examples of pod disruption budgets defined below. They match pods with the label
`app: zookeeper`.
-->
使用者可以在下面看到 pod 干擾預算定義的示例，它們與帶有 `app: zookeeper` 標籤的 pod 相匹配：

<!--
Example PDB Using minAvailable:
-->
使用 minAvailable 的PDB 示例：

{{< codenew file="policy/zookeeper-pod-disruption-budget-minavailable.yaml" >}}

<!--
Example PDB Using maxUnavailable:
-->
使用 maxUnavailable 的 PDB 示例：

{{< codenew file="policy/zookeeper-pod-disruption-budget-maxunavailable.yaml" >}}

<!--
For example, if the above `zk-pdb` object selects the pods of a StatefulSet of size 3, both
specifications have the exact same meaning. The use of `maxUnavailable` is recommended as it
automatically responds to changes in the number of replicas of the corresponding controller.
-->
例如，如果上述 `zk-pdb` 選擇的是一個規格為 3 的 StatefulSet 對應的 Pod，
那麼上面兩種規範的含義完全相同。
推薦使用 `maxUnavailable` ，因為它自動響應控制器副本數量的變化。

<!--
## Create the PDB object

You can create or update the PDB object using kubectl.
```shell
kubectl apply -f mypdb.yaml
```
-->
## 建立 PDB 物件

你可以使用 kubectl 建立或更新 PDB 物件。
```shell
kubectl apply -f mypdb.yaml
```

<!--
You cannot update PDB objects.  They must be deleted and re-created.
-->
PDB 物件無法更新，必須刪除後重新建立。

<!--
## Check the status of the PDB

Use kubectl to check that your PDB is created.
-->
## 檢查 PDB 的狀態

使用 kubectl 來確認 PDB 被建立。

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
假設有匹配的 Pod (比如說 3 個), 那麼使用者會看到類似下面的資訊：

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s

```

<!--
The non-zero value for `ALLOWED-DISRUPTIONS` means that the disruption controller has seen the pods,
counted the matching pods, and updated the status of the PDB.

You can get more information about the status of a PDB with this command:
-->
`ALLOWED-DISRUPTIONS` 值非 0 意味著干擾控制器已經感知到相應的 Pod，對匹配的 Pod 進行統計，
並更新了 PDB 的狀態。

使用者可以透過以下命令獲取更多 PDB 狀態相關資訊：

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  anntation: {}
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
## Arbitrary Controllers and Selectors

You can skip this section if you only use PDBs with the built-in
application controllers (Deployment, ReplicationController, ReplicaSet, and StatefulSet),
with the PDB selector matching the controller's selector.
-->
## 任意控制器和選擇算符   {#arbitrary-controllers-and-selectors}

如果你只使用與內建的應用控制器（Deployment、ReplicationController、ReplicaSet 和 StatefulSet）
對應的 PDB，也就是 PDB 的選擇算符與 控制器的選擇算符相匹配，那麼可以跳過這一節。

<!--
You can use a PDB with pods controlled by another type of controller, by an
"operator", or bare pods, but with these restrictions:
-->
你可以使用這樣的 PDB：它對應的 Pod 可能由其他型別的控制器控制，可能由 "operator" 控制，
也可能為“裸的（不受控制器控制）” Pod，但該類 PDB 存在以下限制：

<!--
- only `.spec.minAvailable` can be used, not `.spec.maxUnavailable`.
- only an integer value can be used with `.spec.minAvailable`, not a percentage.
-->
- 只能夠使用 `.spec.minAvailable` ，而不能夠使用 `.spec.maxUnavailable。`
- 只能夠使用整數作為 `.spec.minAvailable` 的值，而不能使用百分比。

<!--
You can use a selector which selects a subset or superset of the pods belonging to a built-in
controller.  However, when there are multiple PDBs in a namespace, you must be careful not
to create PDBs whose selectors overlap.
-->
你可以令選擇算符選擇一個內建控制器所控制 Pod 的子集或父集。
然而，當名字空間下存在多個 PDB 時，使用者必須小心，保證 PDB 的選擇算符之間不重疊。

