---
title: Pod
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
---
<!--
reviewers:
- erictune
title: Pods
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
-->

<!-- overview -->

<!--
_Pods_ are the smallest deployable units of computing that you can create and manage in Kubernetes.

A _Pod_ (as in a pod of whales or pea pod) is a group of one or more
{{< glossary_tooltip text="containers" term_id="container" >}}, with shared storage and network resources,
and a specification for how to run the containers. A Pod's contents are always co-located and
co-scheduled, and run in a shared context. A Pod models an
application-specific "logical host": it contains one or more application
containers which are relatively tightly coupled.
In non-cloud contexts, applications executed on the same physical or virtual machine are
analogous to cloud applications executed on the same logical host.
-->
**Pod** 是可以在 Kubernetes 中創建和管理的、最小的可部署的計算單元。

**Pod**（就像在鯨魚莢或者豌豆莢中）是一組（一個或多個）
{{< glossary_tooltip text="容器" term_id="container" >}}；
這些容器共享儲存、網路、以及怎樣運行這些容器的規約。
Pod 中的內容總是並置（colocated）的並且一同調度，在共享的上下文中運行。
Pod 所建模的是特定於應用的“邏輯主機”，其中包含一個或多個應用容器，
這些容器相對緊密地耦合在一起。
在非雲環境中，在相同的物理機或虛擬機上運行的應用類似於在同一邏輯主機上運行的雲應用。

<!--
As well as application containers, a Pod can contain
{{< glossary_tooltip text="init containers" term_id="init-container" >}} that run
during Pod startup. You can also inject
{{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
for debugging a running Pod.
-->
除了應用容器，Pod 還可以包含在 Pod 啓動期間運行的
{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}。
你也可以注入{{< glossary_tooltip text="臨時性容器" term_id="ephemeral-container" >}}來調試正在運行的 Pod。

<!-- body -->

<!--
## What is a Pod?
-->
## 什麼是 Pod？   {#what-is-a-pod}

{{< note >}}
<!--
You need to install a [container runtime](/docs/setup/production-environment/container-runtimes/)
into each node in the cluster so that Pods can run there.
-->
爲了運行 Pod，你需要提前在每個節點安裝好[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)。
{{< /note >}}

<!--
The shared context of a Pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a {{< glossary_tooltip text="container" term_id="container" >}}.
Within a Pod's context, the individual applications may have
further sub-isolations applied.

A Pod is similar to a set of containers with shared namespaces and shared filesystem volumes.
-->
Pod 的共享上下文包括一組 Linux 名字空間、控制組（CGroup）和可能一些其他的隔離方面，
即用來隔離{{< glossary_tooltip text="容器" term_id="container" >}}的技術。
在 Pod 的上下文中，每個獨立的應用可能會進一步實施隔離。

Pod 類似於共享名字空間並共享檔案系統卷的一組容器。

<!--
Pods in a Kubernetes cluster are used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of
  [multiple co-located containers](#how-pods-manage-multiple-containers) that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit.
-->
Kubernetes 叢集中的 Pod 主要有兩種用法：

* **運行單個容器的 Pod**。"每個 Pod 一個容器"模型是最常見的 Kubernetes 用例；
  在這種情況下，可以將 Pod 看作單個容器的包裝器，並且 Kubernetes 直接管理 Pod，而不是容器。
* **運行多個協同工作的容器的 Pod**。
  Pod 可以封裝由緊密耦合且需要共享資源的[多個並置容器](#how-pods-manage-multiple-containers)組成的應用。
  這些位於同一位置的容器構成一個內聚單元。

  <!--
  Grouping multiple co-located and co-managed containers in a single Pod is a
  relatively advanced use case. You should use this pattern only in specific
  instances in which your containers are tightly coupled.
  
  You don't need to run multiple containers to provide replication (for resilience
  or capacity); if you need multiple replicas, see
  [Workload management](/docs/concepts/workloads/controllers/).
  -->
  將多個並置、同管的容器組織到一個 Pod 中是一種相對高級的使用場景。
  只有在一些場景中，容器之間緊密關聯時你才應該使用這種模式。

  你不需要運行多個容器來擴展副本（爲了彈性或容量）；
  如果你需要多個副本，請參閱[工作負載管理](/zh-cn/docs/concepts/workloads/controllers/)。

<!--
## Using Pods

The following is an example of a Pod which consists of a container running the image `nginx:1.14.2`.
-->
## 使用 Pod   {#using-pods}

下面是一個 Pod 示例，它由一個運行映像檔 `nginx:1.14.2` 的容器組成。

{{% code_sample file="pods/simple-pod.yaml" %}}

<!--
To create the Pod shown above, run the following command:
-->
要創建上面顯示的 Pod，請運行以下命令：

```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

<!--
Pods are generally not created directly and are created using workload resources.
See [Working with Pods](#working-with-pods) for more information on how Pods are used
with workload resources.

### Workload resources for managing pods
-->
Pod 通常不是直接創建的，而是使用工作負載資源創建的。
有關如何將 Pod 用於工作負載資源的更多資訊，請參閱[使用 Pod](#working-with-pods)。

### 用於管理 Pod 的工作負載資源   {#workload-resources-for-managing-pods}

<!--
Usually you don't need to create Pods directly, even singleton Pods. Instead,
create them using workload resources such as {{< glossary_tooltip text="Deployment"
term_id="deployment" >}} or {{< glossary_tooltip text="Job" term_id="job" >}}.
If your Pods need to track state, consider the
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} resource.
-->
通常你不需要直接創建 Pod，甚至單實例 Pod。相反，你會使用諸如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或
{{< glossary_tooltip text="Job" term_id="job" >}} 這類工作負載資源來創建 Pod。
如果 Pod 需要跟蹤狀態，可以考慮
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} 資源。

<!--
Each Pod is meant to run a single instance of a given application. If you want to
scale your application horizontally (to provide more overall resources by running
more instances), you should use multiple Pods, one for each instance. In
Kubernetes, this is typically referred to as _replication_.
Replicated Pods are usually created and managed as a group by a workload resource
and its {{< glossary_tooltip text="controller" term_id="controller" >}}.

See [Pods and controllers](#pods-and-controllers) for more information on how
Kubernetes uses workload resources, and their controllers, to implement application
scaling and auto-healing.
-->
每個 Pod 都旨在運行給定應用程式的單個實例。如果希望橫向擴展應用程式
（例如，運行多個實例以提供更多的資源），則應該使用多個 Pod，每個實例使用一個 Pod。
在 Kubernetes 中，這通常被稱爲**副本（Replication）**。
通常使用一種工作負載資源及其{{< glossary_tooltip text="控制器" term_id="controller" >}}來創建和管理一組 Pod 副本。

參見 [Pod 和控制器](#pods-and-controllers)以瞭解 Kubernetes
如何使用工作負載資源及其控制器以實現應用的擴縮和自動修復。

<!--
Pods natively provide two kinds of shared resources for their constituent containers:
[networking](#pod-networking) and [storage](#pod-storage).
-->
Pod 天生地爲其成員容器提供了兩種共享資源：[網路](#pod-networking)和[儲存](#pod-storage)。

<!--
## Working with Pods

You'll rarely create individual Pods directly in Kubernetes—even singleton Pods. This
is because Pods are designed as relatively ephemeral, disposable entities. When
a Pod gets created (directly by you, or indirectly by a
{{< glossary_tooltip text="controller" term_id="controller" >}}), the new Pod is
scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster.
The Pod remains on that node until the Pod finishes execution, the Pod object is deleted,
the Pod is *evicted* for lack of resources, or the node fails.
-->
## 使用 Pod   {#working-with-pods}

你很少在 Kubernetes 中直接創建一個個的 Pod，甚至是單實例（Singleton）的 Pod。
這是因爲 Pod 被設計成了相對臨時性的、用後即拋的一次性實體。
當 Pod 由你或者間接地由{{< glossary_tooltip text="控制器" term_id="controller" >}}
創建時，它被調度在叢集中的{{< glossary_tooltip text="節點" term_id="node" >}}上運行。
Pod 會保持在該節點上運行，直到 Pod 結束執行、Pod 對象被刪除、Pod 因資源不足而被**驅逐**或者節點失效爲止。

{{< note >}}
<!--
Restarting a container in a Pod should not be confused with restarting a Pod. A Pod
is not a process, but an environment for running container(s). A Pod persists until
it is deleted.
-->
重啓 Pod 中的容器不應與重啓 Pod 混淆。
Pod 不是進程，而是容器運行的環境。
在被刪除之前，Pod 會一直存在。
{{< /note >}}

<!--
The name of a Pod must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostname.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
-->
Pod 的名稱必須是一個合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)值，
但這可能對 Pod 的主機名產生意外的結果。爲獲得最佳兼容性，名稱應遵循更嚴格的
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)規則。

<!-- 
### Pod OS
-->
### Pod 操作系統   {#pod-os}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

<!--
You should set the `.spec.os.name` field to either `windows` or `linux` to indicate the OS on
which you want the pod to run. These two are the only operating systems supported for now by
Kubernetes. In the future, this list may be expanded.

In Kubernetes v{{< skew currentVersion >}}, the value of `.spec.os.name` does not affect
how the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
picks a node for the Pod to run on. In any cluster where there is more than one operating system for
running nodes, you should set the
[kubernetes.io/os](/docs/reference/labels-annotations-taints/#kubernetes-io-os)
label correctly on each node, and define pods with a `nodeSelector` based on the operating system
label. The kube-scheduler assigns your pod to a node based on other criteria and may or may not
succeed in picking a suitable node placement where the node OS is right for the containers in that Pod.
The [Pod security standards](/docs/concepts/security/pod-security-standards/) also use this
field to avoid enforcing policies that aren't relevant to the operating system.
-->
你應該將 `.spec.os.name` 字段設置爲 `windows` 或 `linux` 以表示你希望 Pod 運行在哪個操作系統之上。
這兩個是 Kubernetes 目前支持的操作系統。將來，這個列表可能會被擴充。

在 Kubernetes v{{< skew currentVersion >}} 中，`.spec.os.name` 的值對
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
如何選擇要運行 Pod 的節點沒有影響。在任何有多種操作系統運行節點的叢集中，你應該在每個節點上正確設置
[kubernetes.io/os](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-os)
標籤，並根據操作系統標籤爲 Pod 設置 `nodeSelector` 字段。
kube-scheduler 將根據其他標準將你的 Pod 分配到節點，
並且可能會也可能不會成功選擇合適的節點位置，其中節點操作系統適合該 Pod 中的容器。
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)也使用這個字段來避免強制執行與該操作系統無關的策略。

<!--
### Pods and controllers

You can use workload resources to create and manage multiple Pods for you. A controller
for the resource handles replication and rollout and automatic healing in case of
Pod failure. For example, if a Node fails, a controller notices that Pods on that
Node have stopped working and creates a replacement Pod. The scheduler places the
replacement Pod onto a healthy Node.

Here are some examples of workload resources that manage one or more Pods:
-->
### Pod 和控制器    {#pods-and-controllers}

你可以使用工作負載資源來創建和管理多個 Pod。
資源的控制器能夠處理副本的管理、上線，並在 Pod 失效時提供自愈能力。
例如，如果一個節點失敗，控制器注意到該節點上的 Pod 已經停止工作，
就可以創建替換性的 Pod。調度器會將替身 Pod 調度到一個健康的節點執行。

下面是一些管理一個或者多個 Pod 的工作負載資源的示例：

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

<!--
### Pod templates

Controllers for {{< glossary_tooltip text="workload" term_id="workload" >}} resources create Pods
from a _pod template_ and manage those Pods on your behalf.

PodTemplates are specifications for creating Pods, and are included in workload resources such as
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).
-->
### Pod 模板    {#pod-templates}

{{< glossary_tooltip text="工作負載" term_id="workload" >}}資源的控制器通常使用
**Pod 模板（Pod Template）** 來替你創建 Pod 並管理它們。

Pod 模板是包含在工作負載對象中的規範，用來創建 Pod。這類負載資源包括
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 等。

<!--
Each controller for a workload resource uses the `PodTemplate` inside the workload
object to make actual Pods. The `PodTemplate` is part of the desired state of whatever
workload resource you used to run your app.

When you create a Pod, you can include
[environment variables](/docs/tasks/inject-data-application/define-environment-variable-container/)
in the Pod template for the containers that run in the Pod.

The sample below is a manifest for a simple Job with a `template` that starts one
container. The container in that Pod prints a message then pauses.
-->
工作負載的控制器會使用負載對象中的 `PodTemplate` 來生成實際的 Pod。
`PodTemplate` 是你用來運行應用時指定的負載資源的目標狀態的一部分。

創建 Pod 時，你可以在 Pod 模板中包含 Pod
中運行的容器的[環境變量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)。

下面的示例是一個簡單的 Job 的清單，其中的 `template` 指示啓動一個容器。
該 Pod 中的容器會打印一條消息之後暫停。

<!--
# This is the pod template
# The pod template ends here
-->
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # 這裏是 Pod 模板
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # 以上爲 Pod 模板
```

<!--
Modifying the pod template or switching to a new pod template has no direct effect
on the Pods that already exist. If you change the pod template for a workload
resource, that resource needs to create replacement Pods that use the updated template.

For example, the StatefulSet controller ensures that the running Pods match the current
pod template for each StatefulSet object. If you edit the StatefulSet to change its pod
template, the StatefulSet starts to create new Pods based on the updated template.
Eventually, all of the old Pods are replaced with new Pods, and the update is complete.

Each workload resource implements its own rules for handling changes to the Pod template.
If you want to read more about StatefulSet specifically, read
[Update strategy](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) in the StatefulSet Basics tutorial.
-->
修改 Pod 模板或者切換到新的 Pod 模板都不會對已經存在的 Pod 直接起作用。
如果改變工作負載資源的 Pod 模板，工作負載資源需要使用更新後的模板來創建 Pod，
並使用新創建的 Pod 替換舊的 Pod。

例如，StatefulSet 控制器針對每個 StatefulSet 對象確保運行中的 Pod 與當前的 Pod
模板匹配。如果編輯 StatefulSet 以更改其 Pod 模板，
StatefulSet 將開始基於更新後的模板創建新的 Pod。

每個工作負載資源都實現了自己的規則，用來處理對 Pod 模板的更新。
如果你想了解更多關於 StatefulSet 的具體資訊，
請閱讀 StatefulSet 基礎教程中的[更新策略](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets)。

<!--
On Nodes, the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} does not
directly observe or manage any of the details around pod templates and updates; those
details are abstracted away. That abstraction and separation of concerns simplifies
system semantics, and makes it feasible to extend the cluster's behavior without
changing existing code.
-->
在節點上，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 並不直接監測或管理與
Pod 模板相關的細節或模板的更新，這些細節都被抽象出來。
這種抽象和關注點分離簡化了整個系統的語義，
並且使得使用者可以在不改變現有代碼的前提下就能擴展叢集的行爲。

<!--
## Pod update and replacement

As mentioned in the previous section, when the Pod template for a workload
resource is changed, the controller creates new Pods based on the updated
template instead of updating or patching the existing Pods.
-->
## Pod 更新與替換   {#pod-update-and-replacement}

正如前面章節所述，當某工作負載的 Pod 模板被改變時，
控制器會基於更新的模板創建新的 Pod 對象而不是對現有 Pod 執行更新或者修補操作。

<!--
Kubernetes doesn't prevent you from managing Pods directly. It is possible to
update some fields of a running Pod, in place. However, Pod update operations
like 
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), and
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
have some limitations:
-->
Kubernetes 並不禁止你直接管理 Pod。對運行中的 Pod 的某些字段執行就地更新操作還是可能的。不過，類似
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core) 和
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
這類更新操作有一些限制：

<!--
- Most of the metadata about a Pod is immutable. For example, you cannot
  change the `namespace`, `name`, `uid`, or `creationTimestamp` fields.
- If the `metadata.deletionTimestamp` is set, no new entry can be added to the
  `metadata.finalizers` list.
- Pod updates may not change fields other than `spec.containers[*].image`,
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds`, `spec.terminationGracePeriodSeconds`,
   `spec.tolerations` or `spec.schedulingGates`. For `spec.tolerations`, you can only add new entries.
- When updating the `spec.activeDeadlineSeconds` field, two types of updates
  are allowed:

  1. setting the unassigned field to a positive number; 
  1. updating the field from a positive number to a smaller, non-negative
     number.
-->
- Pod 的絕大多數元資料都是不可變的。例如，你不可以改變其 `namespace`、`name`、
  `uid` 或者 `creationTimestamp` 字段。
- 如果 `metadata.deletionTimestamp` 已經被設置，則不可以向 `metadata.finalizers`
  列表中添加新的條目。
- Pod 更新不可以改變除 `spec.initContainers[*].image`、`spec.activeDeadlineSeconds`、
  `spec.terminationGracePeriodSeconds`、`spec.tolerations` 或 `spec.schedulingGates` 之外的字段。
  對於 `spec.tolerations`，你只被允許添加新的條目到其中。
- 在更新 `spec.activeDeadlineSeconds` 字段時，以下兩種更新操作是被允許的：

  1. 如果該字段尚未設置，可以將其設置爲一個正數；
  1. 如果該字段已經設置爲一個正數，可以將其設置爲一個更小的、非負的整數。

<!--
### Pod subresources

The above update rules apply to regular pod updates, but other pod fields can be updated through _subresources_.
-->
### Pod 子資源

上述更新規則適用於常規的 Pod 更新，但其他 Pod 字段可以通過**子資源**進行更新。

<!--
- **Resize:** The `resize` subresource allows container resources (`spec.containers[*].resources`) to be updated.
  See [Resize Container Resources](#resize-container-resources) for more details.
- **Ephemeral Containers:** The `ephemeralContainers` subresource allows
  {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
  to be added to a Pod.
  See [Ephemeral Containers](/docs/concepts/workloads/pods/ephemeral-containers/) for more details.
- **Status:** The `status` subresource allows the pod status to be updated.
  This is typically only used by the Kubelet and other system controllers.
- **Binding:** The `binding` subresource allows setting the pod's `spec.nodeName` via a `Binding` request.
  This is typically only used by the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}.
-->
- **調整大小：** `resize` 子資源允許更新容器資源（`spec.containers[*].resources`）。
  更多詳情參見[調整容器資源大小](#resize-container-resources)。
- **臨時容器：** `ephemeralContainers` 子資源允許
  {{< glossary_tooltip text="臨時容器" term_id="ephemeral-container" >}}
  被添加到一個 Pod 中。
  更多詳情參見[臨時容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)。
- **狀態：** `status` 子資源允許更新 Pod 狀態。
  這通常僅由 kubelet 和其他系統控制器使用。
- **綁定：** `binding` 子資源允許通過 `Binding` 請求設置 Pod 的 `spec.nodeName`。
  這通常僅由 {{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}} 使用。

<!--
### Pod generation

- The `metadata.generation` field is unique. It will be automatically set by the
  system such that new pods have a `metadata.generation` of 1, and every update to
  mutable fields in the pod's spec will increment the `metadata.generation` by 1.
-->
### Pod 生成

- `metadata.generation` 字段是唯一的。它將由系統自動設置，使得新 Pod 的 `metadata.generation` 爲 1，
  並且對 Pod 規約中可變字段的每次更新都會使 `metadata.generation` 增加 1。

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

<!--
- `observedGeneration` is a field that is captured in the `status` section of the Pod
  object. If the feature gate `PodObservedGenerationTracking` is set, the Kubelet will set `status.observedGeneration`
  to track the pod state to the current pod status. The pod's `status.observedGeneration` will reflect the
  `metadata.generation` of the pod at the point that the pod status is being reported.
-->
- `observedGeneration` 是在 Pod 對象的 `status` 部分中捕獲的一個字段。
  如果啓用了 **PodObservedGenerationTracking** 特性門控，
  kubelet 將設置 `status.observedGeneration` 來追蹤當前 Pod 的狀態。
  Pod 的 `status.observedGeneration` 將展示報告 Pod 狀態時的 Pod 的 `metadata.generation`。

{{< note >}}
<!--
The `status.observedGeneration` field is managed by the kubelet and external controllers should **not** modify this field.
-->
`status.observedGeneration` 字段由 kubelet 管理，外部控制器**不**應修改此字段。
{{< /note >}}

<!--
Different status fields may either be associated with the `metadata.generation` of the current sync loop, or with the
`metadata.generation` of the previous sync loop. The key distinction is whether a change in the `spec` is reflected
directly in the `status` or is an indirect result of a running process.
-->
不同的狀態字段可能與當前同步循環的 `metadata.generation` 相關聯，
或者與前一個同步循環的 `metadata.generation` 相關聯。
關鍵區別在於，`spec` 中的變化是直接體現在 `status` 中，還是作爲運行過程的間接結果展示。

<!--
#### Direct Status Updates

For status fields where the allocated spec is directly reflected, the `observedGeneration` will
be associated with the current `metadata.generation` (Generation N).

This behavior applies to:

- **Resize Status**: The status of a resource resize operation.
- **Allocated Resources**: The resources allocated to the Pod after a resize.
- **Ephemeral Containers**: When a new ephemeral container is added, and it is in `Waiting` state.
-->
#### 直接狀態更新

對於那些直接反映分配的 spec 的狀態字段，`observedGeneration`
將與當前的 `metadata.generation`（第 N 代）相關聯。

此行爲適用於：

- **擴縮狀態**：資源擴縮操作的狀態。
- **分配的資源**：擴縮後分配給 Pod 的資源。
- **臨時容器**：當添加一個新的臨時容器，並且它處於 `Waiting` 狀態時。

<!--
#### Indirect Status Updates

For status fields that are an indirect result of running the spec, the `observedGeneration` will be associated
with the `metadata.generation` of the previous sync loop (Generation N-1).

This behavior applies to:
-->
#### 間接狀態更新

對於那些運行規約的間接結果的狀態字段，`observedGeneration`
將與上一個同步循環的 `metadata.generation`（第 N-1 代）相關聯。

此行爲適用於：

<!--
- **Container Image**: The `ContainerStatus.ImageID` reflects the image from the previous generation until the new image
  is pulled and the container is updated.
- **Actual Resources**: During an in-progress resize, the actual resources in use still belong to the previous generation's
  request.
- **Container state**: During an in-progress resize, with require restart policy reflects the previous generation's
  request.
- **activeDeadlineSeconds** & **terminationGracePeriodSeconds** & **deletionTimestamp**: The effects of these fields on the
  Pod's status are a result of the previously observed specification.
-->
- **容器映像檔**：`ContainerStatus.ImageID` 反映的是上一代的映像檔，直到新的映像檔被拉取並且容器被更新。
- **實際資源**：在擴縮進行中，實際使用的資源仍然屬於上一代請求的資源。
- **容器狀態**：在擴縮進行中，需要重啓策略反映的是上一代的請求。
- **activeDeadlineSeconds** & **terminationGracePeriodSeconds** & **deletionTimestamp**：這些字段對 Pod 狀態的影響是之前觀察到的規約的結果。

<!--
## Resource sharing and communication

Pods enable data sharing and communication among their constituent
containers.
-->
### 資源共享和通信 {#resource-sharing-and-communication}

Pod 使它的成員容器間能夠進行資料共享和通信。

<!--
### Storage in Pods {#pod-storage}

A Pod can specify a set of shared storage
{{< glossary_tooltip text="volumes" term_id="volume" >}}. All containers
in the Pod can access the shared volumes, allowing those containers to
share data. Volumes also allow persistent data in a Pod to survive
in case one of the containers within needs to be restarted. See
[Storage](/docs/concepts/storage/) for more information on how
Kubernetes implements shared storage and makes it available to Pods.
-->
### Pod 中的儲存 {#pod-storage}

一個 Pod 可以設置一組共享的儲存{{< glossary_tooltip text="卷" term_id="volume" >}}。
Pod 中的所有容器都可以訪問該共享卷，從而允許這些容器共享資料。
卷還允許 Pod 中的持久資料保留下來，即使其中的容器需要重新啓動。
有關 Kubernetes 如何在 Pod 中實現共享儲存並將其提供給 Pod 的更多資訊，
請參考[儲存](/zh-cn/docs/concepts/storage/)。

<!--
### Pod networking

Each Pod is assigned a unique IP address for each address family. Every
container in a Pod shares the network namespace, including the IP address and
network ports. Inside a Pod (and **only** then), the containers that belong to the Pod
can communicate with one another using `localhost`. When containers in a Pod communicate
with entities *outside the Pod*,
they must coordinate how they use the shared network resources (such as ports).
-->
### Pod 聯網    {#pod-networking}

每個 Pod 都在每個地址族中獲得一個唯一的 IP 地址。
Pod 中的每個容器共享網路名字空間，包括 IP 地址和網路端口。
**Pod 內**的容器可以使用 `localhost` 互相通信。
當 Pod 中的容器與 **Pod 之外**的實體通信時，它們必須協調如何使用共享的網路資源（例如端口）。

<!--
Within a Pod, containers share an IP address and port space, and
can find each other via `localhost`. The containers in a Pod can also communicate
with each other using standard inter-process communications like SystemV semaphores
or POSIX shared memory.  Containers in different Pods have distinct IP addresses
and can not communicate by OS-level IPC without special configuration.
Containers that want to interact with a container running in a different Pod can
use IP networking to communicate.
-->
在同一個 Pod 內，所有容器共享一個 IP 地址和端口空間，並且可以通過 `localhost` 發現對方。
他們也能通過如 SystemV 信號量或 POSIX 共享內存這類標準的進程間通信方式互相通信。
不同 Pod 中的容器的 IP 地址互不相同，如果沒有特殊設定，就無法通過 OS 級 IPC 進行通信。
如果某容器希望與運行於其他 Pod 中的容器通信，可以通過 IP 聯網的方式實現。

<!--
Containers within the Pod see the system hostname as being the same as the configured
`name` for the Pod. There's more about this in the [networking](/docs/concepts/cluster-administration/networking/)
section.
-->
Pod 中的容器所看到的系統主機名與爲 Pod 設定的 `name` 屬性值相同。
[網路](/zh-cn/docs/concepts/cluster-administration/networking/)部分提供了更多有關此內容的資訊。

<!--
## Pod security settings {#pod-security}
-->
## Pod 安全設置     {#pod-security}

<!--
To set security constraints on Pods and containers, you use the
`securityContext` field in the Pod specification. This field gives you
granular control over what a Pod or individual containers can do. For example:
-->
要對 Pod 和容器設置安全約束，請使用 Pod 規約中的 `securityContext` 字段。
該字段使你可以精細控制 Pod 或單個容器可以執行的操作。例如：

<!--
* Drop specific Linux capabilities to avoid the impact of a CVE.
* Force all processes in the Pod to run as a non-root user or as a specific
  user or group ID.
* Set a specific seccomp profile.
* Set Windows security options, such as whether containers run as HostProcess.
-->
* 放棄特定的 Linux 權能（Capability）以避免受到某 CVE 的影響。
* 強制 Pod 中的所有進程以非 Root 使用者或特定使用者或組 ID 的身份運行。
* 設置特定的 seccomp 設定檔案。
* 設置 Windows 安全選項，例如容器是否作爲 HostProcess 運行。

{{< caution >}}
<!--
You can also use the Pod securityContext to enable
[_privileged mode_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
in Linux containers. Privileged mode overrides many of the other security
settings in the securityContext. Avoid using this setting unless you can't grant
the equivalent permissions by using other fields in the securityContext.
In Kubernetes 1.26 and later, you can run Windows containers in a similarly
privileged mode by setting the `windowsOptions.hostProcess` flag on the
security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
-->
你還可以使用 Pod securityContext 在 Linux 容器中啓用[**特權模式**](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)。
特權模式會覆蓋 securityContext 中的許多其他安全設置。
請避免使用此設置，除非你無法通過使用 securityContext 中的其他字段授予等效權限。
在 Kubernetes 1.26 及更高版本中，你可以通過在 Pod 規約的安全上下文中設置
`windowsOptions.hostProcess` 標誌，以類似的特權模式運行 Windows 容器。
有關詳細資訊和說明，請參閱[創建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。
{{< /caution >}}

<!--
* To learn about kernel-level security constraints that you can use,
  see [Linux kernel security constraints for Pods and containers](/docs/concepts/security/linux-kernel-security-constraints).
* To learn more about the Pod security context, see
  [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
-->
* 要了解可以使用的內核級安全約束，請參閱
  [Pod 和容器的 Linux 內核安全約束](/zh-cn/docs/concepts/security/linux-kernel-security-constraints)。
* 要了解有關 Pod 安全上下文的更多資訊，
  請參閱[爲 Pod 或容器設定安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

<!--
## Static Pods

_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Whereas most Pods are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), for static
Pods, the kubelet directly supervises each static Pod (and restarts it if it fails).
-->
## 靜態 Pod    {#static-pods}

**靜態 Pod（Static Pod）** 直接由特定節點上的 `kubelet` 守護進程管理，
不需要 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}看到它們。
儘管大多數 Pod 都是通過控制面（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
來管理的，對於靜態 Pod 而言，`kubelet` 直接監控每個 Pod，並在其失效時重啓之。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.
The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual [control plane components](/docs/concepts/architecture/#control-plane-components).

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there. See the guide [Create static Pods](/docs/tasks/configure-pod-container/static-pod)
for more information.
-->
靜態 Pod 通常綁定到某個節點上的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}。
其主要用途是運行自託管的控制面。
在自託管場景中，使用 `kubelet`
來管理各個獨立的[控制面組件](/zh-cn/docs/concepts/architecture/#control-plane-components)。

`kubelet` 自動嘗試爲每個靜態 Pod 在 Kubernetes API
伺服器上創建一個{{< glossary_tooltip text="映像檔 Pod" term_id="mirror-pod" >}}。
這意味着在節點上運行的 Pod 在 API 伺服器上是可見的，但不可以通過 API 伺服器來控制。
有關更多資訊，請參閱[創建靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod) 的指南。

{{< note >}}
<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->
靜態 Pod 的 `spec` 不能引用其他的 API 對象（例如：
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、
{{< glossary_tooltip text="Secret" term_id="secret" >}} 等）。
{{< /note >}}

<!--
### Pods manage multiple containers  {#how-pods-manage-multiple-containers}

Pods are designed to support multiple cooperating processes (as containers) that form
a cohesive unit of service. The containers in a Pod are automatically co-located and
co-scheduled on the same physical or virtual machine in the cluster. The containers
can share resources and dependencies, communicate with one another, and coordinate
when and how they are terminated.
-->
### Pod 管理多個容器   {#how-pods-manage-multiple-containers}

Pod 被設計成支持構造內聚的服務單元的多個協作進程（形式爲容器）。
Pod 中的容器被自動並置到叢集中的同一物理機或虛擬機上，並可以一起進行調度。
容器之間可以共享資源和依賴、彼此通信、協調何時以及何種方式終止自身。

<!--intentionally repeats some text from earlier in the page, with more detail -->

<!--
Pods in a Kubernetes cluster are used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of
  multiple co-located containers that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit of service—for example, one container serving data
  stored in a shared volume to the public, while a separate
  {{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}
  refreshes or updates those files.
  The Pod wraps these containers, storage resources, and an ephemeral network
  identity together as a single unit.
-->
Kubernetes 叢集中的 Pod 主要有兩種用法：

* **運行單個容器的 Pod**。"每個 Pod 一個容器"模型是最常見的 Kubernetes 用例；
  在這種情況下，可以將 Pod 看作單個容器的包裝器。Kubernetes 直接管理 Pod，而不是容器。
* **運行多個需要協同工作的容器的 Pod**。
  Pod 可以封裝由多個緊密耦合且需要共享資源的並置容器組成的應用。
  這些位於同一位置的容器可能形成單個內聚的服務單元 —— 一個容器將檔案從共享卷提供給公衆，
  而另一個單獨的{{< glossary_tooltip text="邊車容器" term_id="sidecar-container" >}}則刷新或更新這些檔案。
  Pod 將這些容器和儲存資源打包爲一個可管理的實體。

<!--
For example, you might have a container that
acts as a web server for files in a shared volume, and a separate
[sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
that updates those files from a remote source, as in the following diagram:
-->
例如，你可能有一個容器，爲共享卷中的檔案提供 Web 伺服器支持，以及一個單獨的
[邊車（Sidercar）](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)
容器負責從遠端更新這些檔案，如下圖所示：

{{< figure src="/zh-cn/docs/images/pod.svg" alt="Pod 創建示意圖" class="diagram-medium" >}}

<!--
Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}}
as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}.
By default, init containers run and complete before the app containers are started.
-->
有些 Pod 具有 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}和
{{< glossary_tooltip text="應用容器" term_id="app-container" >}}。
Init 容器預設會在啓動應用容器之前運行並完成。

<!--
You can also have [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
that provide auxiliary services to the main application Pod (for example: a service mesh).
-->
你還可以擁有爲主應用 Pod 提供輔助服務的
[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)（例如：服務網格）。


{{< feature-state feature_gate_name="SidecarContainers" >}}

<!--
Enabled by default, the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
allows you to specify `restartPolicy: Always` for init containers.
Setting the `Always` restart policy ensures that the init containers where you set it are
treated as _sidecars_ that are kept running during the entire lifetime of the Pod.
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/init-containers/#sidecar-containers-and-restartpolicy)
for more details.
-->
啓用 `SidecarContainers` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（預設啓用）允許你爲
Init 容器指定 `restartPolicy: Always`。設置重啓策略爲 `Always` 會確保設置的 Init 容器被視爲**邊車**，
並在 Pod 的整個生命週期內保持運行。
更多細節參閱[邊車容器和重啓策略](/zh-cn/docs/concepts/workloads/pods/init-containers/#sidecar-containers-and-restartpolicy)

<!--
## Container probes

A _probe_ is a diagnostic performed periodically by the kubelet on a container.
To perform a diagnostic, the kubelet can invoke different actions:

- `ExecAction` (performed with the help of the container runtime)
- `TCPSocketAction` (checked directly by the kubelet)
- `HTTPGetAction` (checked directly by the kubelet)

You can read more about [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 
in the Pod Lifecycle documentation.
-->
## 容器探針   {#container-probes}

**Probe** 是由 kubelet 對容器執行的定期診斷。要執行診斷，kubelet 可以執行三種動作：
    
- `ExecAction`（藉助容器運行時執行）
- `TCPSocketAction`（由 kubelet 直接檢測）
- `HTTPGetAction`（由 kubelet 直接檢測）

你可以參閱 Pod 的生命週期文檔中的[探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)部分。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
* Learn about [RuntimeClass](/docs/concepts/containers/runtime-class/) and how you can use it to
  configure different Pods with different container runtime configurations.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)
  and how you can use it to manage application availability during disruptions.
* Pod is a top-level resource in the Kubernetes REST API.
  The {{< api-reference page="workload-resources/pod-v1" >}}
  object definition describes the object in detail.
* [The Distributed System Toolkit: Patterns for Composite Containers](/blog/2015/06/the-distributed-system-toolkit-patterns/) explains common layouts for Pods with more than one container.
* Read about [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
-->
* 瞭解 [Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
* 瞭解 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)，
  以及如何使用它來設定不同的 Pod 使用不同的容器運行時設定。
* 瞭解 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
  以及你可以如何利用它在出現干擾因素時管理應用的可用性。
* Pod 在 Kubernetes REST API 中是一個頂層資源。
  {{< api-reference page="workload-resources/pod-v1" >}}
  對象的定義中包含了更多的細節資訊。
* 博客[分佈式系統工具箱：複合容器模式](/blog/2015/06/the-distributed-system-toolkit-patterns/)中解釋了在同一
  Pod 中包含多個容器時的幾種常見佈局。
* 瞭解 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。

<!--
To understand the context for why Kubernetes wraps a common Pod API in other resources
(such as {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} or
{{< glossary_tooltip text="Deployments" term_id="deployment" >}}),
you can read about the prior art, including:
-->
要了解爲什麼 Kubernetes 會在其他資源
（如 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
或 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
封裝通用的 Pod API，相關的背景資訊可以在前人的研究中找到。具體包括：

<!--
* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
* [Marathon](https://github.com/d2iq-archive/marathon)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
-->
* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
* [Marathon](https://github.com/d2iq-archive/marathon)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/)。
