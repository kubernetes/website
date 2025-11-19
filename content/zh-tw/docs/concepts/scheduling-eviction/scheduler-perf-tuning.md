---
title: 調度器性能調優
content_type: concept
weight: 70
---
<!--
---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_type: concept
weight: 70
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

<!--
[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
is the Kubernetes default scheduler. It is responsible for placement of Pods
on Nodes in a cluster.
-->
作爲 kubernetes 集羣的默認調度器，
[kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
主要負責將 Pod 調度到集羣的 Node 上。

<!--
Nodes in a cluster that meet the scheduling requirements of a Pod are
called _feasible_ Nodes for the Pod. The scheduler finds feasible Nodes
for a Pod and then runs a set of functions to score the feasible Nodes,
picking a Node with the highest score among the feasible ones to run
the Pod. The scheduler then notifies the API server about this decision
in a process called _Binding_.
-->
在一個集羣中，滿足一個 Pod 調度請求的所有 Node 稱之爲**可調度** Node。
調度器先在集羣中找到一個 Pod 的可調度 Node，然後根據一系列函數對這些可調度 Node 打分，
之後選出其中得分最高的 Node 來運行 Pod。
最後，調度器將這個調度決定告知 kube-apiserver，這個過程叫做**綁定（Binding）**。

<!--
This page explains performance tuning optimizations that are relevant for
large Kubernetes clusters.
-->
這篇文章將會介紹一些在大規模 Kubernetes 集羣下調度器性能優化的方式。

<!-- body -->

<!--
In large clusters, you can tune the scheduler's behaviour balancing
scheduling outcomes between latency (new Pods are placed quickly) and
accuracy (the scheduler rarely makes poor placement decisions).

You configure this tuning setting via kube-scheduler setting
`percentageOfNodesToScore`. This KubeSchedulerConfiguration setting determines
a threshold for scheduling nodes in your cluster.
-->
在大規模集羣中，你可以調節調度器的表現來平衡調度的延遲（新 Pod 快速就位）
和精度（調度器很少做出糟糕的放置決策）。

你可以通過設置 kube-scheduler 的 `percentageOfNodesToScore` 來配置這個調優設置。
這個 KubeSchedulerConfiguration 設置決定了調度集羣中節點的閾值。

<!--
### Setting the threshold
-->
### 設置閾值

<!--
The `percentageOfNodesToScore` option accepts whole numeric values between 0
and 100. The value 0 is a special number which indicates that the kube-scheduler
should use its compiled-in default.
If you set `percentageOfNodesToScore` above 100, kube-scheduler acts as if you
had set a value of 100.
-->
`percentageOfNodesToScore` 選項接受從 0 到 100 之間的整數值。
0 值比較特殊，表示 kube-scheduler 應該使用其編譯後的默認值。
如果你設置 `percentageOfNodesToScore` 的值超過了 100，
kube-scheduler 的表現等價於設置值爲 100。

<!--
To change the value, edit the
[kube-scheduler configuration file](/docs/reference/config-api/kube-scheduler-config.v1/)
and then restart the scheduler.
In many cases, the configuration file can be found at `/etc/kubernetes/config/kube-scheduler.yaml`.
-->
要修改這個值，先編輯
[kube-scheduler 的配置文件](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)然後重啓調度器。
大多數情況下，這個配置文件是 `/etc/kubernetes/config/kube-scheduler.yaml`。

<!--
After you have made this change, you can run
-->
修改完成後，你可以執行

```bash
kubectl get pods -n kube-system | grep kube-scheduler
```

<!--
to verify that the kube-scheduler component is healthy.
-->
來檢查該 kube-scheduler 組件是否健康。

<!--
## Node scoring threshold {#percentage-of-nodes-to-score}
-->
## 節點打分閾值 {#percentage-of-nodes-to-score}

<!--
To improve scheduling performance, the kube-scheduler can stop looking for
feasible nodes once it has found enough of them. In large clusters, this saves
time compared to a naive approach that would consider every node.
-->
要提升調度性能，kube-scheduler 可以在找到足夠的可調度節點之後停止查找。
在大規模集羣中，比起考慮每個節點的簡單方法相比可以節省時間。

<!--
You specify a threshold for how many nodes are enough, as a whole number percentage
of all the nodes in your cluster. The kube-scheduler converts this into an
integer number of nodes. During scheduling, if the kube-scheduler has identified
enough feasible nodes to exceed the configured percentage, the kube-scheduler
stops searching for more feasible nodes and moves on to the
[scoring phase](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation).
-->
你可以使用整個集羣節點總數的百分比作爲閾值來指定需要多少節點就足夠。
kube-scheduler 會將它轉換爲節點數的整數值。在調度期間，如果
kube-scheduler 已確認的可調度節點數足以超過了配置的百分比數量，
kube-scheduler 將停止繼續查找可調度節點並繼續進行
[打分階段](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)。

<!--
[How the scheduler iterates over Nodes](#how-the-scheduler-iterates-over-nodes)
describes the process in detail.
-->
[調度器如何遍歷節點](#how-the-scheduler-iterates-over-nodes)詳細介紹了這個過程。

<!--
### Default threshold
-->
### 默認閾值

<!--
If you don't specify a threshold, Kubernetes calculates a figure using a
linear formula that yields 50% for a 100-node cluster and yields 10%
for a 5000-node cluster. The lower bound for the automatic value is 5%.
-->
如果你不指定閾值，Kubernetes 使用線性公式計算出一個比例，在 100-節點集羣
下取 50%，在 5000-節點的集羣下取 10%。這個自動設置的參數的最低值是 5%。

<!--
This means that the kube-scheduler always scores at least 5% of your cluster no
matter how large the cluster is, unless you have explicitly set
`percentageOfNodesToScore` to be smaller than 5.
-->
這意味着，調度器至少會對集羣中 5% 的節點進行打分，除非用戶將該參數設置的低於 5。

<!--
If you want the scheduler to score all nodes in your cluster, set
`percentageOfNodesToScore` to 100.
-->
如果你想讓調度器對集羣內所有節點進行打分，則將 `percentageOfNodesToScore` 設置爲 100。

<!--
## Example
-->
## 示例

<!--
Below is an example configuration that sets `percentageOfNodesToScore` to 50%.
-->
下面就是一個將 `percentageOfNodesToScore` 參數設置爲 50% 的例子。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

<!--
## Tuning percentageOfNodesToScore
-->
## 調節 percentageOfNodesToScore 參數

<!--
`percentageOfNodesToScore` must be a value between 1 and 100 with the default
value being calculated based on the cluster size. There is also a hardcoded
minimum value of 100 nodes.
-->
`percentageOfNodesToScore` 的值必須在 1 到 100 之間，而且其默認值是通過集羣的規模計算得來的。
另外，還有一個 100 個 Node 的最小值是硬編碼在程序中。

<!--
{{< note >}} In clusters with less than 100 feasible nodes, the scheduler still
checks all the nodes because there are not enough feasible nodes to stop
the scheduler's search early.

In a small cluster, if you set a low value for `percentageOfNodesToScore`, your
change will have no or little effect, for a similar reason.

If your cluster has several hundred Nodes or fewer, leave this configuration option
at its default value. Making changes is unlikely to improve the
scheduler's performance significantly.
{{< /note >}}
-->
{{< note >}}
當集羣中的可調度節點少於 100 個時，調度器仍然會去檢查所有的 Node，
因爲可調度節點太少，不足以停止調度器最初的過濾選擇。

同理，在小規模集羣中，如果你將 `percentageOfNodesToScore`
設置爲一個較低的值，則沒有或者只有很小的效果。

如果集羣只有幾百個節點或者更少，請保持這個配置的默認值。
改變基本不會對調度器的性能有明顯的提升。
{{< /note >}}

<!--
An important detail to consider when setting this value is that when a smaller
number of nodes in a cluster are checked for feasibility, some nodes are not
sent to be scored for a given Pod. As a result, a Node which could possibly
score a higher value for running the given Pod might not even be passed to the
scoring phase. This would result in a less than ideal placement of the Pod.

You should avoid setting `percentageOfNodesToScore` very low so that kube-scheduler
does not make frequent, poor Pod placement decisions. Avoid setting the
percentage to anything below 10%, unless the scheduler's throughput is critical
for your application and the score of nodes is not important. In other words, you
prefer to run the Pod on any Node as long as it is feasible.
-->
值得注意的是，該參數設置後可能會導致只有集羣中少數節點被選爲可調度節點，
很多節點都沒有進入到打分階段。這樣就會造成一種後果，
一個本來可以在打分階段得分很高的節點甚至都不能進入打分階段。

由於這個原因，這個參數不應該被設置成一個很低的值。
通常的做法是不會將這個參數的值設置的低於 10。
很低的參數值一般在調度器的吞吐量很高且對節點的打分不重要的情況下才使用。
換句話說，只有當你更傾向於在可調度節點中任意選擇一個節點來運行這個 Pod 時，
才使用很低的參數設置。

<!--
## How the scheduler iterates over Nodes
-->
## 調度器做調度選擇的時候如何覆蓋所有的 Node {#how-the-scheduler-iterates-over-nodes}

<!--
This section is intended for those who want to understand the internal details
of this feature.
-->
如果你想要理解這一個特性的內部細節，那麼請仔細閱讀這一章節。

<!--
In order to give all the Nodes in a cluster a fair chance of being considered
for running Pods, the scheduler iterates over the nodes in a round robin
fashion. You can imagine that Nodes are in an array. The scheduler starts from
the start of the array and checks feasibility of the nodes until it finds enough
Nodes as specified by `percentageOfNodesToScore`. For the next Pod, the
scheduler continues from the point in the Node array that it stopped at when
checking feasibility of Nodes for the previous Pod.
-->
在將 Pod 調度到節點上時，爲了讓集羣中所有節點都有公平的機會去運行這些 Pod，
調度器將會以輪詢的方式覆蓋全部的 Node。
你可以將 Node 列表想象成一個數組。調度器從數組的頭部開始篩選可調度節點，
依次向後直到可調度節點的數量達到 `percentageOfNodesToScore` 參數的要求。
在對下一個 Pod 進行調度的時候，前一個 Pod 調度篩選停止的 Node 列表的位置，
將會來作爲這次調度篩選 Node 開始的位置。

<!--
If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones:
-->
如果集羣中的 Node 在多個區域，那麼調度器將從不同的區域中輪詢 Node，
來確保不同區域的 Node 接受可調度性檢查。如下例，考慮兩個區域中的六個節點：

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

<!--
The Scheduler evaluates feasibility of the nodes in this order:
-->
調度器將會按照如下的順序去評估 Node 的可調度性：

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

<!--
After going over all the Nodes, it goes back to Node 1.
-->
在評估完所有 Node 後，將會返回到 Node 1，從頭開始。

## {{% heading "whatsnext" %}}

<!--
* Check the [kube-scheduler configuration reference (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
-->
* 參見 [kube-scheduler 配置參考（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
