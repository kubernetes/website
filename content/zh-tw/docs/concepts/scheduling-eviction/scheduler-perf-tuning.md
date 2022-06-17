---
title: 排程器效能調優
content_type: concept
weight: 100
---
<!--
---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_type: concept
weight: 100
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.14" state="beta" >}}

<!--
[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
is the Kubernetes default scheduler. It is responsible for placement of Pods
on Nodes in a cluster.
-->
作為 kubernetes 叢集的預設排程器，
[kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
主要負責將 Pod 排程到叢集的 Node 上。

<!--
Nodes in a cluster that meet the scheduling requirements of a Pod are
called _feasible_ Nodes for the Pod. The scheduler finds feasible Nodes
for a Pod and then runs a set of functions to score the feasible Nodes,
picking a Node with the highest score among the feasible ones to run
the Pod. The scheduler then notifies the API server about this decision
in a process called _Binding_.
-->
在一個叢集中，滿足一個 Pod 排程請求的所有 Node 稱之為 _可排程_ Node。
排程器先在叢集中找到一個 Pod 的可排程 Node，然後根據一系列函式對這些可排程 Node 打分，
之後選出其中得分最高的 Node 來執行 Pod。
最後，排程器將這個排程決定告知 kube-apiserver，這個過程叫做 _繫結（Binding）_。

<!--
This page explains performance tuning optimizations that are relevant for
large Kubernetes clusters.
-->
這篇文章將會介紹一些在大規模 Kubernetes 叢集下排程器效能最佳化的方式。

<!-- body -->

<!--
In large clusters, you can tune the scheduler's behaviour balancing
scheduling outcomes between latency (new Pods are placed quickly) and
accuracy (the scheduler rarely makes poor placement decisions).

You configure this tuning setting via kube-scheduler setting
`percentageOfNodesToScore`. This KubeSchedulerConfiguration setting determines
a threshold for scheduling nodes in your cluster.
 -->
在大規模叢集中，你可以調節排程器的表現來平衡排程的延遲（新 Pod 快速就位）
和精度（排程器很少做出糟糕的放置決策）。

你可以透過設定 kube-scheduler 的 `percentageOfNodesToScore` 來配置這個調優設定。
這個 KubeSchedulerConfiguration 設定決定了排程叢集中節點的閾值。

<!--
### Setting the threshold
 -->
### 設定閾值

<!--
The `percentageOfNodesToScore` option accepts whole numeric values between 0
and 100. The value 0 is a special number which indicates that the kube-scheduler
should use its compiled-in default.
If you set `percentageOfNodesToScore` above 100, kube-scheduler acts as if you
had set a value of 100.
 -->
`percentageOfNodesToScore` 選項接受從 0 到 100 之間的整數值。
0 值比較特殊，表示 kube-scheduler 應該使用其編譯後的預設值。
如果你設定 `percentageOfNodesToScore` 的值超過了 100，
kube-scheduler 的表現等價於設定值為 100。

<!--
To change the value, edit the
[kube-scheduler configuration file](/docs/reference/config-api/kube-scheduler-config.v1beta2/)
and then restart the scheduler.
In many cases, the configuration file can be found at `/etc/kubernetes/config/kube-scheduler.yaml`
 -->
要修改這個值，先編輯 [kube-scheduler 的配置檔案](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
然後重啟排程器。
大多數情況下，這個配置檔案是 `/etc/kubernetes/config/kube-scheduler.yaml`。

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
來檢查該 kube-scheduler 元件是否健康。

<!--
## Node scoring threshold {#percentage-of-nodes-to-score}
 -->
## 節點打分閾值 {#percentage-of-nodes-to-score}

<!--
To improve scheduling performance, the kube-scheduler can stop looking for
feasible nodes once it has found enough of them. In large clusters, this saves
time compared to a naive approach that would consider every node.
 -->
要提升排程效能，kube-scheduler 可以在找到足夠的可排程節點之後停止查詢。
在大規模叢集中，比起考慮每個節點的簡單方法相比可以節省時間。

<!--
You specify a threshold for how many nodes are enough, as a whole number percentage
of all the nodes in your cluster. The kube-scheduler converts this into an
integer number of nodes. During scheduling, if the kube-scheduler has identified
enough feasible nodes to exceed the configured percentage, the kube-scheduler
stops searching for more feasible nodes and moves on to the
[scoring phase](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation).
 -->
你可以使用整個叢集節點總數的百分比作為閾值來指定需要多少節點就足夠。
kube-scheduler 會將它轉換為節點數的整數值。在排程期間，如果
kube-scheduler 已確認的可排程節點數足以超過了配置的百分比數量，
kube-scheduler 將停止繼續查詢可排程節點並繼續進行
[打分階段](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)。

<!--
[How the scheduler iterates over Nodes](#how-the-scheduler-iterates-over-nodes)
describes the process in detail.
 -->
[排程器如何遍歷節點](#how-the-scheduler-iterates-over-nodes) 詳細介紹了這個過程。

<!--
### Default threshold
 -->
### 預設閾值

<!--
If you don't specify a threshold, Kubernetes calculates a figure using a
linear formula that yields 50% for a 100-node cluster and yields 10%
for a 5000-node cluster. The lower bound for the automatic value is 5%.
 -->
如果你不指定閾值，Kubernetes 使用線性公式計算出一個比例，在 100-節點叢集
下取 50%，在 5000-節點的叢集下取 10%。這個自動設定的引數的最低值是 5%。

<!--
This means that, the kube-scheduler always scores at least 5% of your cluster no
matter how large the cluster is, unless you have explicitly set
`percentageOfNodesToScore` to be smaller than 5.
 -->
這意味著，排程器至少會對叢集中 5% 的節點進行打分，除非使用者將該引數設定的低於 5。

<!--
If you want the scheduler to score all nodes in your cluster, set
`percentageOfNodesToScore` to 100.
 -->
如果你想讓排程器對叢集內所有節點進行打分，則將 `percentageOfNodesToScore` 設定為 100。

<!--
## Example
 -->
## 示例

<!--
Below is an example configuration that sets `percentageOfNodesToScore` to 50%.
-->
下面就是一個將 `percentageOfNodesToScore` 引數設定為 50% 的例子。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

<!--
### Tuning percentageOfNodesToScore
-->
### 調節 percentageOfNodesToScore 引數

<!--
`percentageOfNodesToScore` must be a value between 1 and 100 with the default
value being calculated based on the cluster size. There is also a hardcoded
minimum value of 50 nodes.
-->
`percentageOfNodesToScore` 的值必須在 1 到 100 之間，而且其預設值是透過叢集的規模計算得來的。
另外，還有一個 50 個 Node 的最小值是硬編碼在程式中。

<!--
{{< note >}} In clusters with less than 50 feasible nodes, the scheduler still
checks all the nodes because there are not enough feasible nodes to stop
the scheduler's search early.

In a small cluster, if you set a low value for `percentageOfNodesToScore`, your
change will have no or little effect, for a similar reason.

If your cluster has several hundred Nodes or fewer, leave this configuration option
at its default value. Making changes is unlikely to improve the
scheduler's performance significantly.
-->
{{< note >}}
當叢集中的可排程節點少於 50 個時，排程器仍然會去檢查所有的 Node，
因為可排程節點太少，不足以停止排程器最初的過濾選擇。

同理，在小規模叢集中，如果你將 `percentageOfNodesToScore` 設定為
一個較低的值，則沒有或者只有很小的效果。

如果叢集只有幾百個節點或者更少，請保持這個配置的預設值。
改變基本不會對排程器的效能有明顯的提升。
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
值得注意的是，該引數設定後可能會導致只有叢集中少數節點被選為可排程節點，
很多節點都沒有進入到打分階段。這樣就會造成一種後果，
一個本來可以在打分階段得分很高的節點甚至都不能進入打分階段。

由於這個原因，這個引數不應該被設定成一個很低的值。
通常的做法是不會將這個引數的值設定的低於 10。
很低的引數值一般在排程器的吞吐量很高且對節點的打分不重要的情況下才使用。
換句話說，只有當你更傾向於在可排程節點中任意選擇一個節點來執行這個 Pod 時，
才使用很低的引數設定。

<!--
### How the scheduler iterates over Nodes
-->
### 排程器做排程選擇的時候如何覆蓋所有的 Node {#how-the-scheduler-iterates-over-nodes}

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
在將 Pod 排程到節點上時，為了讓叢集中所有節點都有公平的機會去執行這些 Pod，
排程器將會以輪詢的方式覆蓋全部的 Node。
你可以將 Node 列表想象成一個數組。排程器從陣列的頭部開始篩選可排程節點，
依次向後直到可排程節點的數量達到 `percentageOfNodesToScore` 引數的要求。
在對下一個 Pod 進行排程的時候，前一個 Pod 排程篩選停止的 Node 列表的位置，
將會來作為這次排程篩選 Node 開始的位置。

<!--
If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones:
-->
如果叢集中的 Node 在多個區域，那麼排程器將從不同的區域中輪詢 Node，
來確保不同區域的 Node 接受可排程性檢查。如下例，考慮兩個區域中的六個節點：

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

<!--
The Scheduler evaluates feasibility of the nodes in this order:
-->
排程器將會按照如下的順序去評估 Node 的可排程性：

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

<!--
After going over all the Nodes, it goes back to Node 1.
-->
在評估完所有 Node 後，將會返回到 Node 1，從頭開始。

## {{% heading "whatsnext" %}}

<!-- * Check the [kube-scheduler configuration reference (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) -->

* 參見 [kube-scheduler 配置參考 (v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
