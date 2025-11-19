---
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
content_type: concept
description: >-
  ReplicaSet 的作用是維持在任何給定時間運行的一組穩定的副本 Pod。
  通常，你會定義一個 Deployment，並用這個 Deployment 自動管理 ReplicaSet。
weight: 20
hide_summary: true # 在章節索引中單獨列出
---
<!--
# NOTE TO LOCALIZATION TEAMS
#
# If updating front matter for your localization because there is still
# a "feature" key in this page, then you also need to update
# content/??/docs/concepts/architecture/self-healing.md (which is where
# it moved to)
reviewers:
- Kashomon
- bprashanth
- madhusudancs
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
content_type: concept
description: >-
  A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time.
  Usually, you define a Deployment and let that Deployment manage ReplicaSets automatically.
weight: 20
hide_summary: true # Listed separately in section index
-->

<!-- overview -->

<!--
A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often
used to guarantee the availability of a specified number of identical Pods.
-->
ReplicaSet 的目的是維護一組在任何時候都處於運行狀態的 Pod 副本的穩定集合。
因此，它通常用來保證給定數量的、完全相同的 Pod 的可用性。

<!-- body -->
<!--
## How a ReplicaSet works

A ReplicaSet is defined with fields, including a selector that specifies how to identify Pods it can acquire, a number
of replicas indicating how many Pods it should be maintaining, and a pod template specifying the data of new Pods
it should create to meet the number of replicas criteria. A ReplicaSet then fulfills its purpose by creating
and deleting Pods as needed to reach the desired number. When a ReplicaSet needs to create new Pods, it uses its Pod
template.
-->
## ReplicaSet 的工作原理 {#how-a-replicaset-works}

ReplicaSet 是通過一組字段來定義的，包括一個用來識別可獲得的 Pod
的集合的選擇算符、一個用來標明應該維護的副本個數的數值、一個用來指定應該創建新 Pod
以滿足副本個數條件時要使用的 Pod 模板等等。
每個 ReplicaSet 都通過根據需要創建和刪除 Pod 以使得副本個數達到期望值，
進而實現其存在價值。當 ReplicaSet 需要創建新的 Pod 時，會使用所提供的 Pod 模板。

<!--
A ReplicaSet is linked to its Pods via the Pods' [metadata.ownerReferences](/docs/concepts/architecture/garbage-collection/#owners-dependents)
field, which specifies what resource the current object is owned by. All Pods acquired by a ReplicaSet have their owning
ReplicaSet's identifying information within their ownerReferences field. It's through this link that the ReplicaSet
knows of the state of the Pods it is maintaining and plans accordingly.
-->
ReplicaSet 通過 Pod 上的
[metadata.ownerReferences](/zh-cn/docs/concepts/architecture/garbage-collection/#owners-dependents)
字段連接到附屬 Pod，該字段給出當前對象的屬主資源。
ReplicaSet 所獲得的 Pod 都在其 ownerReferences 字段中包含了屬主 ReplicaSet
的標識信息。正是通過這一連接，ReplicaSet 知道它所維護的 Pod 集合的狀態，
並據此計劃其操作行爲。

<!--
A ReplicaSet identifies new Pods to acquire by using its selector. If there is a Pod that has no
OwnerReference or the OwnerReference is not a {{< glossary_tooltip term_id="controller" >}} and it
matches a ReplicaSet's selector, it will be immediately acquired by said ReplicaSet.
-->
ReplicaSet 使用其選擇算符來辨識要獲得的 Pod 集合。如果某個 Pod 沒有
OwnerReference 或者其 OwnerReference 不是一個{{< glossary_tooltip text="控制器" term_id="controller" >}}，
且其匹配到某 ReplicaSet 的選擇算符，則該 Pod 立即被此 ReplicaSet 獲得。

<!--
## When to use a ReplicaSet

A ReplicaSet ensures that a specified number of pod replicas are running at any given
time. However, a Deployment is a higher-level concept that manages ReplicaSets and
provides declarative updates to Pods along with a lot of other useful features.
Therefore, we recommend using Deployments instead of directly using ReplicaSets, unless
you require custom update orchestration or don't require updates at all.

This actually means that you may never need to manipulate ReplicaSet objects:
use a Deployment instead, and define your application in the spec section.
-->
## 何時使用 ReplicaSet    {#when-to-use-a-replicaset}

ReplicaSet 確保任何時間都有指定數量的 Pod 副本在運行。
然而，Deployment 是一個更高級的概念，它管理 ReplicaSet，並向 Pod
提供聲明式的更新以及許多其他有用的功能。
因此，我們建議使用 Deployment 而不是直接使用 ReplicaSet，
除非你需要自定義更新業務流程或根本不需要更新。

這實際上意味着，你可能永遠不需要操作 ReplicaSet 對象：而是使用
Deployment，並在 spec 部分定義你的應用。

<!--
## Example
-->
## 示例    {#example}

{{% code_sample file="controllers/frontend.yaml" %}}

<!--
Saving this manifest into `frontend.yaml` and submitting it to a Kubernetes cluster will
create the defined ReplicaSet and the Pods that it manages.
-->
將此清單保存到 `frontend.yaml` 中，並將其提交到 Kubernetes 集羣，
就能創建 yaml 文件所定義的 ReplicaSet 及其管理的 Pod。

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

<!--
You can then get the current ReplicaSets deployed:
-->
你可以看到當前被部署的 ReplicaSet：

```shell
kubectl get rs
```

<!--
And see the frontend one you created:
-->
並看到你所創建的前端：

```
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

<!--
You can also check on the state of the ReplicaSet:
-->
你也可以查看 ReplicaSet 的狀態：

```shell
kubectl describe rs/frontend
```

<!--
And you will see output similar to:
-->
你會看到類似如下的輸出：

```
Name:         frontend
Namespace:    default
Selector:     tier=frontend
Labels:       app=guestbook
              tier=frontend
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  tier=frontend
  Containers:
   php-redis:
    Image:        us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-gbgfx
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-rwz57
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-wkl7w
```

<!--
And lastly you can check for the Pods brought up:
-->
最後可以查看啓動了的 Pod 集合：

```shell
kubectl get pods
```

<!--
You should see Pod information similar to:
-->
你會看到類似如下的 Pod 信息：

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-gbgfx   1/1     Running   0          10m
frontend-rwz57   1/1     Running   0          10m
frontend-wkl7w   1/1     Running   0          10m
```

<!--
You can also verify that the owner reference of these pods is set to the frontend ReplicaSet.
To do this, get the yaml of one of the Pods running:
-->
你也可以查看 Pod 的屬主引用被設置爲前端的 ReplicaSet。
要實現這點，可獲取運行中的某個 Pod 的 YAML：

```shell
kubectl get pods frontend-gbgfx -o yaml
```

<!--
The output will look similar to this, with the frontend ReplicaSet's info set in the metadata's ownerReferences field:
-->
輸出將類似這樣，frontend ReplicaSet 的信息被設置在 metadata 的
`ownerReferences` 字段中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-02-28T22:30:44Z"
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-gbgfx
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: e129deca-f864-481b-bb16-b27abfd92292
...
```

<!--
## Non-Template Pod acquisitions
-->
## 非模板 Pod 的獲得    {#non-template-pod-acquisitions}

<!--
While you can create bare Pods with no problems, it is strongly recommended to make sure that the bare Pods do not have
labels which match the selector of one of your ReplicaSets. The reason for this is because a ReplicaSet is not limited
to owning Pods specified by its template-- it can acquire other Pods in the manner specified in the previous sections.

Take the previous frontend ReplicaSet example, and the Pods specified in the following manifest:
-->
儘管你完全可以直接創建裸的 Pod，強烈建議你確保這些裸的 Pod 並不包含可能與你的某個
ReplicaSet 的選擇算符相匹配的標籤。原因在於 ReplicaSet 並不僅限於擁有在其模板中設置的
Pod，它還可以像前面小節中所描述的那樣獲得其他 Pod。

以前面的 frontend ReplicaSet 爲例，並在以下清單中指定這些 Pod：

{{% code_sample file="pods/pod-rs.yaml" %}}

<!--
As those Pods do not have a Controller (or any object) as their owner reference and match the selector of the frontend
ReplicaSet, they will immediately be acquired by it.

Suppose you create the Pods after the frontend ReplicaSet has been deployed and has set up its initial Pod replicas to
fulfill its replica count requirement:
-->
由於這些 Pod 沒有控制器（Controller，或其他對象）作爲其屬主引用，
並且其標籤與 frontend ReplicaSet 的選擇算符匹配，它們會立即被該 ReplicaSet 獲取。

假定你在 frontend ReplicaSet 已經被部署之後創建 Pod，並且你已經在 ReplicaSet
中設置了其初始的 Pod 副本數以滿足其副本計數需要：

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

<!--
The new Pods will be acquired by the ReplicaSet, and then immediately terminated as the ReplicaSet would be over
its desired count.

Fetching the Pods:
-->
新的 Pod 會被該 ReplicaSet 獲取，並立即被 ReplicaSet 終止，
因爲它們的存在會使得 ReplicaSet 中 Pod 個數超出其期望值。

獲取 Pod：


```shell
kubectl get pods
```

<!--
The output shows that the new Pods are either already terminated, or in the process of being terminated:
-->
輸出顯示新的 Pod 或者已經被終止，或者處於終止過程中：

```
NAME             READY   STATUS        RESTARTS   AGE
frontend-b2zdv   1/1     Running       0          10m
frontend-vcmts   1/1     Running       0          10m
frontend-wtsmm   1/1     Running       0          10m
pod1             0/1     Terminating   0          1s
pod2             0/1     Terminating   0          1s
```

<!--
If you create the Pods first:
-->
如果你先行創建 Pod：

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

<!--
And then create the ReplicaSet however:
-->
之後再創建 ReplicaSet：

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

<!--
You shall see that the ReplicaSet has acquired the Pods and has only created new ones according to its spec until the
number of its new Pods and the original matches its desired count. As fetching the Pods:
-->
你會看到 ReplicaSet 已經獲得了該 Pod，並僅根據其規約創建新的 Pod，
直到新的 Pod 和原來的 Pod 的總數達到其預期個數。
這時獲取 Pod 列表：

```shell
kubectl get pods
```

<!--
Will reveal in its output:
-->
將會生成下面的輸出：

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-hmmj2   1/1     Running   0          9s
pod1             1/1     Running   0          36s
pod2             1/1     Running   0          36s
```

<!--
In this manner, a ReplicaSet can own a non-homogeneous set of Pods
-->
採用這種方式，一個 ReplicaSet 中可以包含異質的 Pod 集合。

<!--
## Writing a ReplicaSet manifest

As with all other Kubernetes API objects, a ReplicaSet needs the `apiVersion`, `kind`, and `metadata` fields.
For ReplicaSets, the `kind` is always a ReplicaSet.

When the control plane creates new Pods for a ReplicaSet, the `.metadata.name` of the
ReplicaSet is part of the basis for naming those Pods.  The name of a ReplicaSet must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostnames.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).

A ReplicaSet also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 編寫 ReplicaSet 的清單    {#writing-a-replicaset-manifest}

與所有其他 Kubernetes API 對象一樣，ReplicaSet 也需要 `apiVersion`、`kind`、和 `metadata` 字段。
對於 ReplicaSet 而言，其 `kind` 始終是 ReplicaSet。

當控制平面爲 ReplicaSet 創建新的 Pod 時，ReplicaSet
的 `.metadata.name` 是命名這些 Pod 的部分基礎。ReplicaSet 的名稱必須是一個合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)值，
但這可能對 Pod 的主機名產生意外的結果。爲獲得最佳兼容性，名稱應遵循更嚴格的
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)規則。

ReplicaSet 也需要
[`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/#pod-templates) which is also
required to have labels in place. In our `frontend.yaml` example we had one label: `tier: frontend`.
Be careful not to overlap with the selectors of other controllers, lest they try to adopt this Pod.

For the template's [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) field,
`.spec.template.spec.restartPolicy`, the only allowed value is `Always`, which is the default.
-->
### Pod 模板    {#pod-template}

`.spec.template` 是一個 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)，
要求設置標籤。在 `frontend.yaml` 示例中，我們指定了標籤 `tier: frontend`。
注意不要將標籤與其他控制器的選擇算符重疊，否則那些控制器會嘗試收養此 Pod。

對於模板的[重啓策略](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
字段，`.spec.template.spec.restartPolicy`，唯一允許的取值是 `Always`，這也是默認值.

<!--
### Pod Selector

The `.spec.selector` field is a [label selector](/docs/concepts/overview/working-with-objects/labels/). As discussed
[earlier](#how-a-replicaset-works) these are the labels used to identify potential Pods to acquire. In our
`frontend.yaml` example, the selector was:

```yaml
matchLabels:
  tier: frontend
```

In the ReplicaSet, `.spec.template.metadata.labels` must match `spec.selector`, or it will
be rejected by the API.
-->
### Pod 選擇算符   {#pod-selector}

`.spec.selector` 字段是一個[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
如前文中[所討論的](#how-a-replicaset-works)，這些是用來標識要被獲取的 Pod
的標籤。在簽名的 `frontend.yaml` 示例中，選擇算符爲：

```yaml
matchLabels:
  tier: frontend
```

在 ReplicaSet 中，`.spec.template.metadata.labels` 的值必須與 `spec.selector`
值相匹配，否則該配置會被 API 拒絕。

{{< note >}}
<!--
For 2 ReplicaSets specifying the same `.spec.selector` but different
`.spec.template.metadata.labels` and `.spec.template.spec` fields, each ReplicaSet ignores the
Pods created by the other ReplicaSet.
-->
對於設置了相同的 `.spec.selector`，但
`.spec.template.metadata.labels` 和 `.spec.template.spec` 字段不同的兩個
ReplicaSet 而言，每個 ReplicaSet 都會忽略被另一個 ReplicaSet 所創建的 Pod。
{{< /note >}}

<!--
### Replicas

You can specify how many Pods should run concurrently by setting `.spec.replicas`. The ReplicaSet will create/delete
its Pods to match this number.

If you do not specify `.spec.replicas`, then it defaults to 1.
-->
### Replicas

你可以通過設置 `.spec.replicas` 來指定要同時運行的 Pod 個數。
ReplicaSet 創建、刪除 Pod 以與此值匹配。

如果你沒有指定 `.spec.replicas`，那麼默認值爲 1。

<!--
## Working with ReplicaSets

### Deleting a ReplicaSet and its Pods

To delete a ReplicaSet and all of its Pods, use
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). The
[Garbage collector](/docs/concepts/architecture/garbage-collection/) automatically deletes all of
the dependent Pods by default.

When using the REST API or the `client-go` library, you must set `propagationPolicy` to
`Background` or `Foreground` in the `-d` option. For example:
-->
## 使用 ReplicaSet    {#working-with-replicasets}

### 刪除 ReplicaSet 和它的 Pod    {#deleting-a-replicaset-and-its-pods}

要刪除 ReplicaSet 和它的所有 Pod，使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) 命令。
默認情況下，[垃圾收集器](/zh-cn/docs/concepts/architecture/garbage-collection/)
自動刪除所有依賴的 Pod。

當使用 REST API 或 `client-go` 庫時，你必須在 `-d` 選項中將 `propagationPolicy`
設置爲 `Background` 或 `Foreground`。例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

<!--
### Deleting just a ReplicaSet

You can delete a ReplicaSet without affecting any of its Pods using
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)
with the `--cascade=orphan` option.
When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Orphan`.
For example:
-->
### 只刪除 ReplicaSet    {#deleting-just-a-replicaset}

你可以只刪除 ReplicaSet 而不影響它的各個 Pod，方法是使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)
命令並設置 `--cascade=orphan` 選項。

當使用 REST API 或 `client-go` 庫時，你必須將 `propagationPolicy` 設置爲 `Orphan`。
例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

<!--
Once the original is deleted, you can create a new ReplicaSet to replace it.  As long
as the old and new `.spec.selector` are the same, then the new one will adopt the old Pods.
However, it will not make any effort to make existing Pods match a new, different pod template.
To update Pods to a new spec in a controlled way, use a
[Deployment](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment), as
ReplicaSets do not support a rolling update directly.
-->
一旦刪除了原來的 ReplicaSet，就可以創建一個新的來替換它。
由於新舊 ReplicaSet 的 `.spec.selector` 是相同的，新的 ReplicaSet 將接管老的 Pod。
但是，它不會努力使現有的 Pod 與新的、不同的 Pod 模板匹配。
若想要以可控的方式更新 Pod 的規約，可以使用
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)
資源，因爲 ReplicaSet 並不直接支持滾動更新。

<!--
### Terminating Pods

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

You can enable this feature by setting the `DeploymentReplicaSetTerminatingReplicas`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
and on the [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)

Pods that become terminating due to deletion or scale down may take a long time to terminate, and may consume
additional resources during that period. As a result, the total number of all pods can temporarily exceed
`.spec.replicas`. Terminating pods can be tracked using the `.status.terminatingReplicas` field of the ReplicaSet.
-->
### 終止中的 Pod  {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

你可以通過在 [API 服務器](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
和 [kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
上啓用 `DeploymentReplicaSetTerminatingReplicas`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來開啓此功能。

由於刪除或縮減副本導致的終止中的 Pod 可能需要較長時間才能完成終止，且在此期間可能會消耗額外資源。
因此，所有 Pod 的總數可能會暫時超過 `.spec.replicas` 指定的數量。
可以通過 ReplicaSet 的 `.status.terminatingReplicas` 字段來跟蹤終止中的 Pod。

<!--
### Isolating Pods from a ReplicaSet

You can remove Pods from a ReplicaSet by changing their labels. This technique may be used to remove Pods
from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (
assuming that the number of replicas is not also changed).
-->
### 將 Pod 從 ReplicaSet 中隔離    {#isolating-pods-from-a-replicaset}

可以通過改變標籤來從 ReplicaSet 中移除 Pod。
這種技術可以用來從服務中去除 Pod，以便進行排錯、數據恢復等。
以這種方式移除的 Pod 將被自動替換（假設副本的數量沒有改變）。

<!--
### Scaling a ReplicaSet

A ReplicaSet can be easily scaled up or down by simply updating the `.spec.replicas` field. The ReplicaSet controller
ensures that a desired number of Pods with a matching label selector are available and operational.
-->
### 擴縮 ReplicaSet    {#scaling-a-replicaset}

通過更新 `.spec.replicas` 字段，ReplicaSet 可以被輕鬆地進行擴縮。ReplicaSet
控制器能確保匹配標籤選擇器的數量的 Pod 是可用的和可操作的。

<!--
When scaling down, the ReplicaSet controller chooses which pods to delete by sorting the available pods to
prioritize scaling down pods based on the following general algorithm:
-->
在降低集合規模時，ReplicaSet 控制器通過對可用的所有 Pod 進行排序來優先選擇要被刪除的那些 Pod。
其一般性算法如下：

<!--
1. Pending (and unschedulable) pods are scaled down first
1. If `controller.kubernetes.io/pod-deletion-cost` annotation is set, then
   the pod with the lower value will come first.
1. Pods on nodes with more replicas come before pods on nodes with fewer replicas.
1. If the pods' creation times differ, the pod that was created more recently
   comes before the older pod (the creation times are bucketed on an integer log scale).
-->
1. 首先選擇剔除懸決（Pending，且不可調度）的各個 Pod
2. 如果設置了 `controller.kubernetes.io/pod-deletion-cost` 註解，則註解值較小的優先被裁減掉
3. 所處節點上副本個數較多的 Pod 優先於所處節點上副本較少者
4. 如果 Pod 的創建時間不同，最近創建的 Pod 優先於早前創建的 Pod 被裁減（創建時間是按整數冪級來分組的）。

<!--
If all of the above match, then selection is random.
-->
如果以上比較結果都相同，則隨機選擇。

<!--
### Pod deletion cost 
-->
### Pod 刪除開銷   {#pod-deletion-cost}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Using the [`controller.kubernetes.io/pod-deletion-cost`](/docs/reference/labels-annotations-taints/#pod-deletion-cost) 
annotation, users can set a preference regarding which pods to remove first when downscaling a ReplicaSet.
-->
通過使用 [`controller.kubernetes.io/pod-deletion-cost`](/zh-cn/docs/reference/labels-annotations-taints/#pod-deletion-cost)
註解，用戶可以對 ReplicaSet 縮容時要先刪除哪些 Pod 設置偏好。

<!--
The annotation should be set on the pod, the range is [-2147483648, 2147483647]. It represents the cost of
deleting a pod compared to other pods belonging to the same ReplicaSet. Pods with lower deletion
cost are preferred to be deleted before pods with higher deletion cost. 
-->
此註解要設置到 Pod 上，取值範圍爲 [-2147483648, 2147483647]。
所代表的是刪除同一 ReplicaSet 中其他 Pod 相比較而言的開銷。
刪除開銷較小的 Pod 比刪除開銷較高的 Pod 更容易被刪除。

<!--
The implicit value for this annotation for pods that don't set it is 0; negative values are permitted.
Invalid values will be rejected by the API server.
-->
Pod 如果未設置此註解，則隱含的設置值爲 0。負值也是可接受的。
如果註解值非法，API 服務器會拒絕對應的 Pod。

<!--
This feature is beta and enabled by default. You can disable it using the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PodDeletionCost` in both kube-apiserver and kube-controller-manager.
-->
此功能特性處於 Beta 階段，默認被啓用。你可以通過爲 kube-apiserver 和
kube-controller-manager 設置[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`PodDeletionCost` 來禁用此功能。

{{< note >}}
<!--
- This is honored on a best-effort basis, so it does not offer any guarantees on pod deletion order.
- Users should avoid updating the annotation frequently, such as updating it based on a metric value,
  because doing so will generate a significant number of pod updates on the apiserver.
-->
- 此機制實施時僅是盡力而爲，並不能對 Pod 的刪除順序作出任何保證；
- 用戶應避免頻繁更新註解值，例如根據某觀測度量值來更新此註解值是應該避免的。
  這樣做會在 API 服務器上產生大量的 Pod 更新操作。
{{< /note >}}

<!--
#### Example Use Case

The different pods of an application could have different utilization levels. On scale down, the application 
may prefer to remove the pods with lower utilization. To avoid frequently updating the pods, the application
should update `controller.kubernetes.io/pod-deletion-cost` once before issuing a scale down (setting the 
annotation to a value proportional to pod utilization level). This works if the application itself controls
the down scaling; for example, the driver pod of a Spark deployment.
-->
#### 使用場景示例    {#example-use-case}

同一應用的不同 Pod 可能其利用率是不同的。在對應用執行縮容操作時，
可能希望移除利用率較低的 Pod。爲了避免頻繁更新 Pod，應用應該在執行縮容操作之前更新一次
`controller.kubernetes.io/pod-deletion-cost` 註解值
（將註解值設置爲一個與其 Pod 利用率對應的值）。
如果應用自身控制器縮容操作時（例如 Spark 部署的驅動 Pod），這種機制是可以起作用的。

<!--
### ReplicaSet as a Horizontal Pod Autoscaler Target

A ReplicaSet can also be a target for
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). That is,
a ReplicaSet can be auto-scaled by an HPA. Here is an example HPA targeting
the ReplicaSet we created in the previous example.
-->
### ReplicaSet 作爲水平的 Pod 自動擴縮器目標    {#replicaset-as-a-horizontal-pod-autoscaler-target}

ReplicaSet 也可以作爲[水平的 Pod 擴縮器 (HPA)](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
的目標。也就是說，ReplicaSet 可以被 HPA 自動擴縮。
以下是 HPA 以我們在前一個示例中創建的副本集爲目標的示例。

{{% code_sample file="controllers/hpa-rs.yaml" %}}

<!--
Saving this manifest into `hpa-rs.yaml` and submitting it to a Kubernetes cluster should
create the defined HPA that autoscales the target ReplicaSet depending on the CPU usage
of the replicated Pods.
-->
將這個列表保存到 `hpa-rs.yaml` 並提交到 Kubernetes 集羣，就能創建它所定義的
HPA，進而就能根據複製的 Pod 的 CPU 利用率對目標 ReplicaSet 進行自動擴縮。

```shell
kubectl apply -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

<!--
Alternatively, you can use the `kubectl autoscale` command to accomplish the same
(and it's easier!)
-->
或者，可以使用 `kubectl autoscale` 命令完成相同的操作（而且它更簡單！）

```shell
kubectl autoscale rs frontend --max=10 --min=3 --cpu=50%
```

<!--
## Alternatives to ReplicaSet

### Deployment (recommended)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) is an object which can own ReplicaSets and update
them and their Pods via declarative, server-side rolling updates.
While ReplicaSets can be used independently, today they're mainly used by Deployments as a mechanism to orchestrate Pod
creation, deletion and updates. When you use Deployments you don't have to worry about managing the ReplicaSets that
they create. Deployments own and manage their ReplicaSets.
As such, it is recommended to use Deployments when you want ReplicaSets.
-->
## ReplicaSet 的替代方案    {#alternatives-to-replicaset}

### Deployment（推薦）    {#deployment-recommended}

[`Deployment`](/zh-cn/docs/concepts/workloads/controllers/deployment/) 是一個可以擁有
ReplicaSet 並使用聲明式方式在服務器端完成對 Pod 滾動更新的對象。
儘管 ReplicaSet 可以獨立使用，目前它們的主要用途是提供給 Deployment 作爲編排
Pod 創建、刪除和更新的一種機制。當使用 Deployment 時，你不必關心如何管理它所創建的
ReplicaSet，Deployment 擁有並管理其 ReplicaSet。
因此，建議你在需要 ReplicaSet 時使用 Deployment。

<!--
### Bare Pods

Unlike the case where a user directly created Pods, a ReplicaSet replaces Pods that are deleted or
terminated for any reason, such as in the case of node failure or disruptive node maintenance,
such as a kernel upgrade. For this reason, we recommend that you use a ReplicaSet even if your
application requires only a single Pod. Think of it similarly to a process supervisor, only it
supervises multiple Pods across multiple nodes instead of individual processes on a single node. A
ReplicaSet delegates local container restarts to some agent on the node such as Kubelet.
-->
### 裸 Pod    {#bare-pods}

與用戶直接創建 Pod 的情況不同，ReplicaSet 會替換那些由於某些原因被刪除或被終止的
Pod，例如在節點故障或破壞性的節點維護（如內核升級）的情況下。
因爲這個原因，我們建議你使用 ReplicaSet，即使應用程序只需要一個 Pod。
想像一下，ReplicaSet 類似於進程監視器，只不過它在多個節點上監視多個 Pod，
而不是在單個節點上監視單個進程。
ReplicaSet 將本地容器重啓的任務委託給了節點上的某個代理（例如，Kubelet）去完成。

<!--
### Job

Use a [`Job`](/docs/concepts/workloads/controllers/job/) instead of a ReplicaSet for Pods that are
expected to terminate on their own (that is, batch jobs).
-->
### Job

使用[`Job`](/zh-cn/docs/concepts/workloads/controllers/job/) 代替 ReplicaSet，
可以用於那些期望自行終止的 Pod。

<!--
### DaemonSet

Use a [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) instead of a ReplicaSet for Pods that provide a
machine-level function, such as machine monitoring or machine logging.  These Pods have a lifetime that is tied
to a machine lifetime: the Pod needs to be running on the machine before other Pods start, and are
safe to terminate when the machine is otherwise ready to be rebooted/shutdown.
-->
### DaemonSet

對於管理那些提供主機級別功能（如主機監控和主機日誌）的容器，
就要用 [`DaemonSet`](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
而不用 ReplicaSet。
這些 Pod 的壽命與主機壽命有關：這些 Pod 需要先於主機上的其他 Pod 運行，
並且在機器準備重新啓動/關閉時安全地終止。

### ReplicationController

<!--
ReplicaSets are the successors to [ReplicationControllers](/docs/concepts/workloads/controllers/replicationcontroller/).
The two serve the same purpose, and behave similarly, except that a ReplicationController does not support set-based
selector requirements as described in the [labels user guide](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
As such, ReplicaSets are preferred over ReplicationControllers
-->
ReplicaSet 是 [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)
的後繼者。二者目的相同且行爲類似，只是 ReplicationController 不支持
[標籤用戶指南](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
中討論的基於集合的選擇算符需求。
因此，相比於 ReplicationController，應優先考慮 ReplicaSet。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* Learn about [Deployments](/docs/concepts/workloads/controllers/deployment/).
* [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/),
  which relies on ReplicaSets to work.
* `ReplicaSet` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/replica-set-v1" >}}
  object definition to understand the API for replica sets.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how
  you can use it to manage application availability during disruptions.
-->
* 瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 瞭解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
* [使用 Deployment 運行一個無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)，
  它依賴於 ReplicaSet。
* `ReplicaSet` 是 Kubernetes REST API 中的頂級資源。閱讀
  {{< api-reference page="workload-resources/replica-set-v1" >}}
  對象定義理解關於該資源的 API。
* 閱讀 [Pod 干擾預算（Disruption Budget）](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
  瞭解如何在干擾下運行高度可用的應用。
