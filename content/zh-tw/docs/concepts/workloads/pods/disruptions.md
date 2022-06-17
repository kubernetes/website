---
title: 干擾（Disruptions）
content_type: concept
weight: 60
---

<!--
reviewers:
- erictune
- foxish
- davidopp
title: Disruptions
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
This guide is for application owners who want to build
highly available applications, and thus need to understand
what types of Disruptions can happen to Pods.
-->
本指南針對的是希望構建高可用性應用程式的應用所有者，他們有必要了解可能發生在 Pod 上的干擾型別。

<!--
It is also for Cluster Administrators who want to perform automated
cluster actions, like upgrading and autoscaling clusters.
-->
文件同樣適用於想要執行自動化叢集操作（例如升級和自動擴充套件叢集）的叢集管理員。

<!-- body -->

<!--
## Voluntary and Involuntary Disruptions

Pods do not disappear until someone (a person or a controller) destroys them, or
there is an unavoidable hardware or system software error.
-->
## 自願干擾和非自願干擾     {#voluntary-and-involuntary-disruptions}

Pod 不會消失，除非有人（使用者或控制器）將其銷燬，或者出現了不可避免的硬體或軟體系統錯誤。

<!--
We call these unavoidable cases *involuntary disruptions* to
an application.  Examples are:
-->
我們把這些不可避免的情況稱為應用的*非自願干擾（Involuntary Disruptions）*。例如：

<!--
- a hardware failure of the physical machine backing the node
- cluster administrator deletes VM (instance) by mistake
- cloud provider or hypervisor failure makes VM disappear
- a kernel panic
- the node disappears from the cluster due to cluster network partition
- eviction of a pod due to the node being [out-of-resources](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
-->

- 節點下層物理機的硬體故障
- 叢集管理員錯誤地刪除虛擬機器（例項）
- 雲提供商或虛擬機器管理程式中的故障導致的虛擬機器消失
- 核心錯誤
- 節點由於叢集網路隔離從叢集中消失
- 由於節點[資源不足](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)導致 pod 被驅逐。

<!--
Except for the out-of-resources condition, all these conditions
should be familiar to most users; they are not specific
to Kubernetes.
-->
除了資源不足的情況，大多數使用者應該都熟悉這些情況；它們不是特定於 Kubernetes 的。

<!--
We call other cases *voluntary disruptions*.  These include both
actions initiated by the application owner and those initiated by a Cluster
Administrator.  Typical application owner actions include:
-->
我們稱其他情況為*自願干擾（Voluntary Disruptions）*。
包括由應用程式所有者發起的操作和由叢集管理員發起的操作。典型的應用程式所有者的操
作包括：

<!--
- deleting the deployment or other controller that manages the pod
- updating a deployment's pod template causing a restart
- directly deleting a pod (e.g. by accident)
-->
- 刪除 Deployment 或其他管理 Pod 的控制器
- 更新了 Deployment 的 Pod 模板導致 Pod 重啟
- 直接刪除 Pod（例如，因為誤操作）

<!--
Cluster Administrator actions include:

- [Draining a node](/docs/tasks/administer-cluster/safely-drain-node/) for repair or upgrade.
- Draining a node from a cluster to scale the cluster down (learn about
[Cluster Autoscaling](https://github.com/kubernetes/autoscaler/#readme)
).
- Removing a pod from a node to permit something else to fit on that node.
-->
叢集管理員操作包括：

- [排空（drain）節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)進行修復或升級。
- 從叢集中排空節點以縮小叢集（瞭解[叢集自動擴縮](https://github.com/kubernetes/autoscaler/#readme)）。
- 從節點中移除一個 Pod，以允許其他 Pod 使用該節點。

<!--
These actions might be taken directly by the cluster administrator, or by automation
run by the cluster administrator, or by your cluster hosting provider.
-->
這些操作可能由叢集管理員直接執行，也可能由叢集管理員所使用的自動化工具執行，或者由叢集託管提供商自動執行。

<!--
Ask your cluster administrator or consult your cloud provider or distribution documentation
to determine if any sources of voluntary disruptions are enabled for your cluster.
If none are enabled, you can skip creating Pod Disruption Budgets.
-->
諮詢叢集管理員或聯絡雲提供商，或者查詢釋出文件，以確定是否為叢集啟用了任何資源干擾源。
如果沒有啟用，可以不用建立 Pod Disruption Budgets（Pod 干擾預算）

<!--
Not all voluntary disruptions are constrained by Pod Disruption Budgets. For example,
deleting deployments or pods bypasses Pod Disruption Budgets.
-->
{{< caution >}}
並非所有的自願干擾都會受到 Pod 干擾預算的限制。
例如，刪除 Deployment 或 Pod 的刪除操作就會跳過 Pod 干擾預算檢查。
{{< /caution >}}

<!--
## Dealing with Disruptions

Here are some ways to mitigate involuntary disruptions:
-->
## 處理干擾

以下是減輕非自願干擾的一些方法：

<!--
- Ensure your pod [requests the resources](/docs/tasks/configure-pod-container/assign-cpu-ram-container) it needs.
- Replicate your application if you need higher availability.  (Learn about running replicated
[stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
and [stateful](/docs/tasks/run-application/run-replicated-stateful-application/) applications.)
- For even higher availability when running replicated applications,
  spread applications across racks (using
  [anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity))
  or across zones (if using a
  [multi-zone cluster](/docs/setup/multiple-zones).)
-->
- 確保 Pod 在請求中給出[所需資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)。
- 如果需要更高的可用性，請複製應用程式。
  （瞭解有關執行多副本的[無狀態](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
  和[有狀態](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)應用程式的資訊。）
- 為了在運行復制應用程式時獲得更高的可用性，請跨機架（使用
  [反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
  或跨區域（如果使用[多區域叢集](/zh-cn/docs/setup/best-practices/multiple-zones/)）擴充套件應用程式。

<!--
The frequency of voluntary disruptions varies.  On a basic Kubernetes cluster, there are
no automated voluntary disruptions (only user-triggered ones).  However, your cluster administrator or hosting provider
may run some additional services which cause voluntary disruptions. For example,
rolling out node software updates can cause voluntary disruptions. Also, some implementations
of cluster (node) autoscaling may cause voluntary disruptions to defragment and compact nodes.
Your cluster administrator or hosting provider should have documented what level of voluntary
disruptions, if any, to expect. Certain configuration options, such as
[using PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
in your pod spec can also cause voluntary (and involuntary) disruptions.
-->
自願干擾的頻率各不相同。在一個基本的 Kubernetes 叢集中，沒有自願干擾（只有使用者觸發的干擾）。
然而，叢集管理員或託管提供商可能執行一些可能導致自願干擾的額外服務。例如，節點軟
更新可能導致自願干擾。另外，叢集（節點）自動縮放的某些
實現可能導致碎片整理和緊縮節點的自願干擾。叢集
管理員或託管提供商應該已經記錄了各級別的自願干擾（如果有的話）。
有些配置選項，例如在 pod spec 中
[使用 PriorityClasses](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
也會產生自願（和非自願）的干擾。

<!--
Kubernetes offers features to help run highly available applications at the same
time as frequent voluntary disruptions.  We call this set of features
*Disruption Budgets*.
-->
Kubernetes 提供特性來滿足在出現頻繁自願干擾的同時執行高可用的應用程式。我們稱這些特性為
*干擾預算（Disruption Budget）*。

<!--
## Pod disruption budgets

Kubernetes offers features to help you run highly available applications even when you
introduce frequent voluntary disruptions.

An Application Owner can create a `PodDisruptionBudget` object (PDB) for each application.
A PDB limits the number of pods of a replicated application that are down simultaneously from
voluntary disruptions.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum. A web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total.
-->
## 干擾預算   {#pod-disruption-budgets}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

即使你會經常引入自願性干擾，Kubernetes 也能夠支援你執行高度可用的應用。

應用程式所有者可以為每個應用程式建立 `PodDisruptionBudget` 物件（PDB）。
PDB 將限制在同一時間因自願干擾導致的複製應用程式中宕機的 pod 數量。
例如，基於票選機制的應用程式希望確保執行的副本數永遠不會低於仲裁所需的數量。
Web 前端可能希望確保提供負載的副本數量永遠不會低於總數的某個百分比。

<!--
Cluster managers and hosting providers should use tools which
respect PodDisruptionBudgets by calling the [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api)
instead of directly deleting pods or deployments.  Examples are the `kubectl drain` command
and the Kubernetes-on-GCE cluster upgrade script (`cluster/gce/upgrade.sh`).
-->
叢集管理員和託管提供商應該使用遵循 PodDisruptionBudgets 的介面
（透過呼叫[Eviction API](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api)），
而不是直接刪除 Pod 或 Deployment。

<!--
For example, the `kubectl drain` subcommand lets you mark a node as going out of
service. When you run `kubectl drain`, the tool tries to evict all of the Pods on
the Node you'are taking out of service. The eviction request may be temporarily rejected,
and the tool periodically retries all failed requests until all pods
are terminated, or until a configurable timeout is reached.
-->
例如，`kubectl drain` 命令可以用來標記某個節點即將停止服務。
執行 `kubectl drain` 命令時，工具會嘗試驅逐機器上的所有 Pod。
`kubectl` 所提交的驅逐請求可能會暫時被拒絕，所以該工具會定時重試失敗的請求，
直到所有的 Pod 都被終止，或者達到配置的超時時間。

<!--
A PDB specifies the number of replicas that an application can tolerate having, relative to how
many it is intended to have.  For example, a Deployment which has a `.spec.replicas: 5` is
supposed to have 5 pods at any given time.  If its PDB allows for there to be 4 at a time,
then the Eviction API will allow voluntary disruption of one, but not two pods, at a time.
-->
PDB 指定應用程式可以容忍的副本數量（相當於應該有多少副本）。
例如，具有 `.spec.replicas: 5` 的 Deployment 在任何時間都應該有 5 個 Pod。
如果 PDB 允許其在某一時刻有 4 個副本，那麼驅逐 API 將允許同一時刻僅有一個而不是兩個 Pod 自願干擾。

<!--
The group of pods that comprise the application is specified using a label selector, the same
as the one used by the application's controller (deployment, stateful-set, etc).
-->
使用標籤選擇器來指定構成應用程式的一組 Pod，這與應用程式的控制器（Deployment，StatefulSet 等）
選擇 Pod 的邏輯一樣。

<!--
The "intended" number of pods is computed from the `.spec.replicas` of the pods controller.
The controller is discovered from the pods using the `.metadata.ownerReferences` of the object.
-->
Pod 控制器的 `.spec.replicas` 計算“預期的” Pod 數量。
根據 Pod 物件的 `.metadata.ownerReferences` 欄位來發現控制器。

<!--
[Involuntary disruptions](#voluntary-and-involuntary-disruptions) cannot be prevented by PDBs; however they
do count against the budget.
-->

PDB 無法防止[非自願干擾](#voluntary-and-involuntary-disruptions)；
但它們確實計入預算。

<!--
Pods which are deleted or unavailable due to a rolling upgrade to an application do count
against the disruption budget, but controllers (like deployment and stateful-set)
are not limited by PDBs when doing rolling upgrades - the handling of failures
during application updates is configured in spec for the specific workload resource.
-->
由於應用程式的滾動升級而被刪除或不可用的 Pod 確實會計入干擾預算，
但是控制器（如 Deployment 和 StatefulSet）在進行滾動升級時不受 PDB
的限制。應用程式更新期間的故障處理方式是在對應的工作負載資源的 `spec` 中配置的。

<!--
When a pod is evicted using the eviction API, it is gracefully
[terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination),
hornoring the
`terminationGracePeriodSeconds` setting in its [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->
當使用驅逐 API 驅逐 Pod 時，Pod 會被體面地
[終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，期間會
參考 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
中的 `terminationGracePeriodSeconds` 配置值。

<!--
## PDB Example

Consider a cluster with 3 nodes, `node-1` through `node-3`.
The cluster is running several applications.  One of them has 3 replicas initially called
`pod-a`, `pod-b`, and `pod-c`.  Another, unrelated pod without a PDB, called `pod-x`, is also shown.
Initially, the pods are laid out as follows:
-->
## PDB 例子   {#pdb-example}

假設叢集有 3 個節點，`node-1` 到 `node-3`。叢集上運行了一些應用。
其中一個應用有 3 個副本，分別是 `pod-a`，`pod-b` 和 `pod-c`。
另外，還有一個不帶 PDB 的無關 pod `pod-x` 也同樣顯示出來。
最初，所有的 Pod 分佈如下：

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

<!--
All 3 pods are part of a deployment, and they collectively have a PDB which requires
there be at least 2 of the 3 pods to be available at all times.
-->
3 個 Pod 都是 deployment 的一部分，並且共同擁有同一個 PDB，要求 3 個 Pod 中至少有 2 個 Pod 始終處於可用狀態。

<!--
For example, assume the cluster administrator wants to reboot into a new kernel version to fix a bug in the kernel.
The cluster administrator first tries to drain `node-1` using the `kubectl drain` command.
That tool tries to evict `pod-a` and `pod-x`.  This succeeds immediately.
Both pods go into the `terminating` state at the same time.
This puts the cluster in this state:
-->

例如，假設叢集管理員想要重啟系統，升級核心版本來修復核心中的許可權。
叢集管理員首先使用 `kubectl drain` 命令嘗試排空 `node-1` 節點。
命令嘗試驅逐 `pod-a` 和 `pod-x`。操作立即就成功了。
兩個 Pod 同時進入 `terminating` 狀態。這時的叢集處於下面的狀態：

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

<!--
The deployment notices that one of the pods is terminating, so it creates a replacement
called `pod-d`.  Since `node-1` is cordoned, it lands on another node.  Something has
also created `pod-y` as a replacement for `pod-x`.
-->
Deployment 控制器觀察到其中一個 Pod 正在終止，因此它建立了一個替代 Pod `pod-d`。
由於 `node-1` 被封鎖（cordon），`pod-d` 落在另一個節點上。
同樣其他控制器也建立了 `pod-y` 作為 `pod-x` 的替代品。

<!--
(Note: for a StatefulSet, `pod-a`, which would be called something like `pod-0`, would need
to terminate completely before its replacement, which is also called `pod-0` but has a
different UID, could be created.  Otherwise, the example applies to a StatefulSet as well.)
-->
（注意：對於 StatefulSet 來說，`pod-a`（也稱為 `pod-0`）需要在替換 Pod 建立之前完全終止，
替代它的也稱為 `pod-0`，但是具有不同的 UID。除此之外，此示例也適用於 StatefulSet。）

<!--
Now the cluster is in this state:
-->
當前叢集的狀態如下：

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

<!--
At some point, the pods terminate, and the cluster looks like this:
-->
在某一時刻，Pod 被終止，叢集如下所示：

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

<!--
At this point, if an impatient cluster administrator tries to drain `node-2` or
`node-3`, the drain command will block, because there are only 2 available
pods for the deployment, and its PDB requires at least 2.  After some time passes, `pod-d` becomes available.
-->
此時，如果一個急躁的叢集管理員試圖排空（drain）`node-2` 或 `node-3`，drain 命令將被阻塞，
因為對於 Deployment 來說只有 2 個可用的 Pod，並且它的 PDB 至少需要 2 個。
經過一段時間，`pod-d` 變得可用。

<!--
The cluster state now looks like this:
-->
叢集狀態如下所示：

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

<!--
Now, the cluster administrator tries to drain `node-2`.
The drain command will try to evict the two pods in some order, say
`pod-b` first and then `pod-d`.  It will succeed at evicting `pod-b`.
But, when it tries to evict `pod-d`, it will be refused because that would leave only
one pod available for the deployment.
-->
現在，叢集管理員試圖排空（drain）`node-2`。
drain 命令將嘗試按照某種順序驅逐兩個 Pod，假設先是 `pod-b`，然後是 `pod-d`。
命令成功驅逐 `pod-b`，但是當它嘗試驅逐 `pod-d`時將被拒絕，因為對於
Deployment 來說只剩一個可用的 Pod 了。

<!--
The deployment creates a replacement for `pod-b` called `pod-e`.
Because there are not enough resources in the cluster to schedule
`pod-e` the drain will again block.  The cluster may end up in this
state:
-->
Deployment 建立 `pod-b` 的替代 Pod `pod-e`。
因為叢集中沒有足夠的資源來排程 `pod-e`，drain 命令再次阻塞。叢集最終將是下面這種狀態：

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

<!--
At this point, the cluster administrator needs to
add a node back to the cluster to proceed with the upgrade.
-->
此時，叢集管理員需要增加一個節點到叢集中以繼續升級操作。

<!--
You can see how Kubernetes varies the rate at which disruptions
can happen, according to:
-->
可以看到 Kubernetes 如何改變干擾發生的速率，根據：

<!--
- how many replicas an application needs
- how long it takes to gracefully shutdown an instance
- how long it takes a new instance to start up
- the type of controller
- the cluster's resource capacity
-->
- 應用程式需要多少個副本
- 優雅關閉應用例項需要多長時間
- 啟動應用新例項需要多長時間
- 控制器的型別
- 叢集的資源能力

<!--
## Separating Cluster Owner and Application Owner Roles

Often, it is useful to think of the Cluster Manager
and Application Owner as separate roles with limited knowledge
of each other.   This separation of responsibilities
may make sense in these scenarios:
-->
## 分離叢集所有者和應用所有者角色

通常，將叢集管理者和應用所有者視為彼此瞭解有限的獨立角色是很有用的。這種責任分離在下面這些場景下是有意義的：

<!--
- when there are many application teams sharing a Kubernetes cluster, and
  there is natural specialization of roles
- when third-party tools or services are used to automate cluster management
-->
- 當有許多應用程式團隊共用一個 Kubernetes 叢集，並且有自然的專業角色
- 當第三方工具或服務用於叢集自動化管理

<!--
Pod Disruption Budgets support this separation of roles by providing an
interface between the roles.
-->
Pod 干擾預算透過在角色之間提供介面來支援這種分離。

<!--
If you do not have such a separation of responsibilities in your organization,
you may not need to use Pod Disruption Budgets.
-->
如果你的組織中沒有這樣的責任分離，則可能不需要使用 Pod 干擾預算。

<!--
## How to perform Disruptive Actions on your Cluster

If you are a Cluster Administrator, and you need to perform a disruptive action on all
the nodes in your cluster, such as a node or system software upgrade, here are some options:
-->
## 如何在叢集上執行干擾性操作

如果你是叢集管理員，並且需要對叢集中的所有節點執行干擾操作，例如節點或系統軟體升級，則可以使用以下選項

<!--
- Accept downtime during the upgrade.
- Failover to another complete replica cluster.
   -  No downtime, but may be costly both for the duplicated nodes
     and for human effort to orchestrate the switchover.
- Write disruption tolerant applications and use PDBs.
   - No downtime.
   - Minimal resource duplication.
   - Allows more automation of cluster administration.
   - Writing disruption-tolerant applications is tricky, but the work to tolerate voluntary
     disruptions largely overlaps with work to support autoscaling and tolerating
     involuntary disruptions.
-->

- 接受升級期間的停機時間。
- 故障轉移到另一個完整的副本叢集。
   -  沒有停機時間，但是對於重複的節點和人工協調成本可能是昂貴的。
- 編寫可容忍干擾的應用程式和使用 PDB。
   - 不停機。
   - 最小的資源重複。
   - 允許更多的叢集管理自動化。
   - 編寫可容忍干擾的應用程式是棘手的，但對於支援容忍自願干擾所做的工作，和支援自動擴縮和容忍非
     自願干擾所做工作相比，有大量的重疊

## {{% heading "whatsnext" %}}

<!--
* Follow steps to protect your application by [configuring a Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
* Learn more about [draining nodes](/docs/tasks/administer-cluster/safely-drain-node/)
* Learn about [updating a deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  including steps to maintain its availability during the rollout.
-->
* 參考[配置 Pod 干擾預算](/zh-cn/docs/tasks/run-application/configure-pdb/)中的方法來保護你的應用。
* 進一步瞭解[排空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)的資訊。
* 瞭解[更新 Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  的過程，包括如何在其程序中維持應用的可用性
