---
layout: blog
title: "Kueue 介紹"
date: 2022-10-04
slug: introducing-kueue
---
<!--
layout: blog
title: "Introducing Kueue"
date: 2022-10-04
slug: introducing-kueue
-->

<!--
**Authors:** Abdullah Gharaibeh (Google), Aldo Culquicondor (Google)
-->
**作者：** Abdullah Gharaibeh（谷歌），Aldo Culquicondor（谷歌）

<!--
Whether on-premises or in the cloud, clusters face real constraints for resource usage, quota, and cost management reasons. 
Regardless of the autoscalling capabilities, clusters have finite capacity.  As a result, users want an easy way to fairly and 
efficiently share resources. 
-->
無論是在本地還是在雲端，叢集都面臨着資源使用、配額和成本管理方面的實際限制。
無論自動擴縮容能力如何，叢集的容量都是有限的。
因此，使用者需要一種簡單的方法來公平有效地共享資源。

<!--
In this article, we introduce [Kueue](https://github.com/kubernetes-sigs/kueue/tree/main/docs#readme),
an open source job queueing controller designed to manage batch jobs as a single unit.
Kueue leaves pod-level orchestration to existing stable components of Kubernetes.
Kueue natively supports the Kubernetes [Job](/docs/concepts/workloads/controllers/job/)
API and offers hooks for integrating other custom-built APIs for batch jobs.
-->
在本文中，我們介紹了 [Kueue](https://github.com/kubernetes-sigs/kueue/tree/main/docs#readme)，
這是一個開源作業隊列控制器，旨在將批處理作業作爲一個單元進行管理。
Kueue 將 Pod 級編排留給 Kubernetes 現有的穩定組件。
Kueue 原生支持 Kubernetes [Job](/zh-cn/docs/concepts/workloads/controllers/job/) API，
並提供用於集成其他定製 API 以進行批處理作業的鉤子。

<!--
## Why Kueue?
-->
## 爲什麼是 Kueue?
<!--
Job queueing is a key feature to run batch workloads at scale in both on-premises and cloud environments. 
The main goal of job queueing is to manage access to a limited pool of resources shared by multiple tenants. 
Job queueing decides which jobs should wait, which can start immediately, and what resources they can use.
-->
作業隊列是在本地和雲環境中大規模運行批處理工作負載的關鍵功能。
作業隊列的主要目標是管理對多個租戶共享的有限資源池的訪問。
作業排隊決定了哪些作業應該等待，哪些可以立即啓動，以及它們可以使用哪些資源。

<!--
Some of the most desired job queueing requirements include:
-->
一些最需要的作業隊列要求包括：
<!--
- Quota and budgeting to control who can use what and up to what limit. This is not only needed in clusters with static resources like on-premises, 
  but it is also needed in cloud environments to control spend or usage of scarce resources.
-->
- 用配額和預算來控制誰可以使用什麼以及達到什麼限制。
  這不僅在具有靜態資源（如本地）的叢集中需要，而且在雲環境中也需要控制稀缺資源的支出或用量。
<!--
- Fair sharing of resources between tenants. To maximize the usage of available resources, any unused quota assigned to inactive tenants should be 
  allowed to be shared fairly between active tenants.
-->
- 租戶之間公平共享資源。
  爲了最大限度地利用可用資源，應允許活動租戶公平共享那些分配給非活動租戶的未使用配額。
<!--
- Flexible placement of jobs across different resource types based on availability. This is important in cloud environments which have heterogeneous 
  resources such as different architectures (GPU or CPU models) and different provisioning modes (spot vs on-demand).
-->
- 根據可用性，在不同資源類型之間靈活放置作業。
  這在具有異構資源的雲環境中很重要，例如不同的架構（GPU 或 CPU 模型）和不同的供應模式（即用與按需）。
<!--
- Support for autoscaled environments where resources can be provisioned on demand.
-->
- 支持可按需設定資源的自動擴縮容環境。

<!--
Plain Kubernetes doesn't address the above requirements. In normal circumstances, once a Job is created, the job-controller instantly creates the 
pods and kube-scheduler continuously attempts to assign the pods to nodes. At scale, this situation can work the control plane to death. There is 
also currently no good way to control at the job level which jobs should get which resources first, and no way to express order or fair sharing. The 
current ResourceQuota model is not a good fit for these needs because quotas are enforced on resource creation, and there is no queueing of requests. The 
intent of ResourceQuotas is to provide a builtin reliability mechanism with policies needed by admins to protect clusters from failing over.
-->
普通的 Kubernetes 不能滿足上述要求。
在正常情況下，一旦創建了 Job，Job 控制器會立即創建 Pod，並且 kube-scheduler 會不斷嘗試將 Pod 分配給節點。
大規模使用時，這種情況可能會使控制平面死機。
目前也沒有好的辦法在 Job 層面控制哪些 Job 應該先獲得哪些資源，也沒有辦法標明順序或公平共享。
當前的 ResourceQuota 模型不太適合這些需求，因爲配額是在資源創建時強制執行的，並且沒有請求排隊。
ResourceQuotas 的目的是提供一種內置的可靠性機制，其中包含管理員所需的策略，以防止叢集發生故障轉移。

<!--
In the Kubernetes ecosystem, there are several solutions for job scheduling. However, we found that these alternatives have one or more of the following problems:
-->
在 Kubernetes 生態系統中，Job 調度有多種解決方案。但是，我們發現這些替代方案存在以下一個或多個問題：
<!--
- They replace existing stable components of Kubernetes, like kube-scheduler or the job-controller. This is problematic not only from an operational point of view, but 
  also the duplication in the job APIs causes fragmentation of the ecosystem and reduces portability.
-->
- 它們取代了 Kubernetes 的現有穩定組件，例如 kube-scheduler 或 Job 控制器。
  這不僅從操作的角度看是有問題的，而且重複的 Job API 也會導致生態系統的碎片化並降低可移植性。
<!--
- They don't integrate with autoscaling, or 
-->
- 它們沒有集成自動擴縮容，或者
<!--
- They lack support for resource flexibility. 
-->
- 它們缺乏對資源靈活性的支持。 

<!--
## How Kueue works {#overview}
-->
## Kueue 的工作原理 {#overview}
<!--
With Kueue we decided to take a different approach to job queueing on Kubernetes that is anchored around the following aspects: 
-->
藉助 Kueue，我們決定採用不同的方法在 Kubernetes 上進行 Job 排隊，該方法基於以下方面：
<!--
- Not duplicating existing functionalities already offered by established Kubernetes components for pod scheduling, autoscaling and job
  lifecycle management.
-->
- 不復制已建立的 Kubernetes 組件提供的用於 Pod 調度、自動擴縮容和 Job 生命週期管理的現有功能。
<!--
- Adding key features that are missing to existing components. For example, we invested in the Job API to cover more use cases like 
  [IndexedJob](/blog/2021/04/19/introducing-indexed-jobs) and [fixed long standing issues related to pod 
  tracking](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers). While this path takes longer to 
-->
- 將缺少的關鍵特性添加到現有組件中。例如，我們投資了 Job API 以涵蓋更多用例，像 [IndexedJob](/blog/2021/04/19/introducing-indexed-jobs)，
  並[修復了與 Pod 跟蹤相關的長期存在的問題](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
  雖然離特性落地還有很長一段路，但我們相信這是可持續的長期解決方案。
<!--
- Ensuring compatibility with cloud environments where compute resources are elastic and heterogeneous.
-->
- 確保與具有彈性和異構性的計算資源雲環境兼容。

<!--
For this approach to be feasible, Kueue needs knobs to influence the behavior of those established components so it can effectively manage 
when and where to start a job. We added those knobs to the Job API in the form of two features:
-->
爲了使這種方法可行，Kueue 需要旋鈕來影響那些已建立組件的行爲，以便它可以有效地管理何時何地啓動一個 Job。
我們以兩個特性的方式將這些旋鈕添加到 Job API：
<!--
- [Suspend field](/docs/concepts/workloads/controllers/job/#suspending-a-job), which allows Kueue to signal to the job-controller 
  when to start or stop a Job.
-->
- [Suspend 字段](/zh-cn/docs/concepts/workloads/controllers/job/#suspending-a-job)，
  它允許在 Job 啓動或停止時，Kueue 向 Job 控制器發出信號。
<!--
- [Mutable scheduling directives](/docs/concepts/workloads/controllers/job/#mutable-scheduling-directives), which allows Kueue to 
  update a Job's `.spec.template.spec.nodeSelector` before starting the Job. This way, Kueue can control Pod placement while still
  delegating to kube-scheduler the actual pod-to-node scheduling.
-->
- [可變調度指令](/zh-cn/docs/concepts/workloads/controllers/job/#mutable-scheduling-directives)，
  允許在啓動 Job 之前更新 Job 的 `.spec.template.spec.nodeSelector`。
  這樣，Kueue 可以控制 Pod 放置，同時仍將 Pod 到節點的實際調度委託給 kube-scheduler。

<!--
Note that any custom job API can be managed by Kueue if that API offers the above two capabilities.
-->
請注意，任何自定義的 Job API 都可以由 Kueue 管理，只要該 API 提供上述兩種能力。

<!--
### Resource model
-->
### 資源模型
<!--
Kueue defines new APIs to address the requirements mentioned at the beginning of this post. The three main APIs are:
-->
Kueue 定義了新的 API 來解決本文開頭提到的需求。三個主要的 API 是：
<!--
- ResourceFlavor: a cluster-scoped API to define resource flavor available for consumption, like a GPU model. At its core, a ResourceFlavor is 
  a set of labels that mirrors the labels on the nodes that offer those resources.
-->
- ResourceFlavor：一個叢集範圍的 API，用於定義可供消費的資源模板，如 GPU 模型。
  ResourceFlavor 的核心是一組標籤，這些標籤反映了提供這些資源的節點上的標籤。
<!--
- ClusterQueue: a cluster-scoped API to define resource pools by setting quotas for one or more ResourceFlavor.
-->
- ClusterQueue: 一種叢集範圍的 API，通過爲一個或多個 ResourceFlavor 設置配額來定義資源池。
<!--
- LocalQueue: a namespaced API for grouping and managing single tenant jobs. In its simplest form, a LocalQueue is a pointer to the ClusterQueue 
  that the tenant (modeled as a namespace) can use to start their jobs.
-->
- LocalQueue: 用於分組和管理單租戶 Jobs 的命名空間 API。
  在最簡單的形式中，LocalQueue 是指向叢集隊列的指針，租戶（建模爲命名空間）可以使用它來啓動他們的 Jobs。

<!--
For more details, take a look at the [API concepts documentation](https://sigs.k8s.io/kueue/docs/concepts). While the three APIs may look overwhelming, 
most of Kueue’s operations are centered around ClusterQueue; the ResourceFlavor and LocalQueue APIs are mainly organizational wrappers.
-->
有關更多詳細資訊，請查看 [API 概念文檔](https://sigs.k8s.io/kueue/docs/concepts)。
雖然這三個 API 看起來無法抗拒，但 Kueue 的大部分操作都以 ClusterQueue 爲中心；
ResourceFlavor 和 LocalQueue API 主要是組織包裝器。

<!--
### Example use case
-->
### 用例樣例
<!--
Imagine the following setup for running batch workloads on a Kubernetes cluster on the cloud: 
-->
想象一下在雲上的 Kubernetes 叢集上運行批處理工作負載的以下設置：
<!--
- You have [cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) installed in the cluster to automatically
  adjust the size of your cluster.
-->
- 你在叢集中安裝了 [cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) 以自動調整叢集的大小。
<!--
- There are two types of autoscaled node groups that differ on their provisioning policies: spot and on-demand. The nodes of each group are 
  differentiated by the label `instance-type=spot` or `instance-type=ondemand`.
  Moreover, since not all Jobs can tolerate running on spot nodes, the nodes are tainted with `spot=true:NoSchedule`.
-->
- 有兩種類型的自動縮放節點組，它們的供應策略不同：即用和按需。
  分別對應標籤：`instance-type=spot` 或者 `instance-type=ondemand`。
  此外，並非所有作業都可以容忍在即用節點上運行，節點可以用 `spot=true:NoSchedule` 污染。
<!--
- To strike a balance between cost and resource availability, imagine you want Jobs to use up to 1000 cores of on-demand nodes, then use up to
  2000 cores of spot nodes.
-->
- 爲了在成本和資源可用性之間取得平衡，假設你希望 Jobs 使用最多 1000 個核心按需節點，最多 2000 個核心即用節點。

<!--
As an admin for the batch system, you define two ResourceFlavors that represent the two types of nodes:
-->
作爲批處理系統的管理員，你定義了兩個 ResourceFlavor，它們代表兩種類型的節點：

```yaml
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: ondemand
  labels:
    instance-type: ondemand 
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: spot
  labels:
    instance-type: spot
taints:
- effect: NoSchedule
  key: spot
  value: "true"
```
<!--
Then you define the quotas by creating a ClusterQueue as follows:
-->
然後通過創建 ClusterQueue 來定義配額，如下所示：
```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ClusterQueue
metadata:
  name: research-pool
spec:
  namespaceSelector: {}
  resources:
  - name: "cpu"
    flavors:
    - name: ondemand
      quota:
        min: 1000
    - name: spot
      quota:
        min: 2000
```

<!--
Note that the order of flavors in the ClusterQueue resources matters: Kueue will attempt to fit jobs in the available quotas according to 
the order unless the job has an explicit affinity to specific flavors.
-->
注意 ClusterQueue 資源中的模板順序很重要：Kueue 將嘗試根據該順序爲 Job 分配可用配額，除非這些 Job 與特定模板有明確的關聯。

<!--
For each namespace, you define a LocalQueue that points to the ClusterQueue above:
-->
對於每個命名空間，定義一個指向上述 ClusterQueue 的 LocalQueue：

```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: LocalQueue
metadata:
  name: training
  namespace: team-ml
spec:
  clusterQueue: research-pool
```

<!--
Admins create the above setup once. Batch users are able to find the queues they are allowed to
submit to by listing the LocalQueues in their namespace(s). The command is similar to the following: `kubectl get -n my-namespace localqueues`
-->
管理員創建一次上述設定。批處理使用者可以通過在他們的命名空間中列出 LocalQueues 來找到他們被允許提交的隊列。
該命令類似於：`kubectl get -n my-namespace localqueues`

<!--
To submit work, create a Job and set the `kueue.x-k8s.io/queue-name` annotation as follows:
-->
要提交作業，需要創建一個 Job 並設置 `kueue.x-k8s.io/queue-name` 註解，如下所示：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  generateName: sample-job-
  annotations:
    kueue.x-k8s.io/queue-name: training
spec:
  parallelism: 3
  completions: 3
  template:
    spec:
      tolerations:
      - key: spot
        operator: "Exists"
        effect: "NoSchedule"
      containers:
      - name: example-batch-workload
        image: registry.example/batch/calculate-pi:3.14
        args: ["30s"]
        resources:
          requests:
            cpu: 1
      restartPolicy: Never
```

<!--
Kueue intervenes to suspend the Job as soon as it is created. Once the Job is at the head of the ClusterQueue, Kueue evaluates if it can start
by checking if the resources requested by the job fit the available quota. 
-->
Kueue 在創建 Job 後立即進行干預以暫停 Job。
一旦 Job 位於 ClusterQueue 的頭部，Kueue 就會通過檢查 Job 請求的資源是否符合可用配額來評估它是否可以啓動。 

<!--
In the above example, the Job tolerates spot resources. If there are previously admitted Jobs consuming all existing on-demand quota but
not all of spot’s, Kueue admits the Job using the spot quota. Kueue does this by issuing a single update to the Job object that: 
-->
在上面的例子中，Job 容忍了 Spot 資源。如果之前承認的 Job 消耗了所有現有的按需配額，
但不是所有 Spot 配額，則 Kueue 承認使用 Spot 配額的 Job。Kueue 通過向 Job 對象發出單個更新來做到這一點：
<!--
- Changes the `.spec.suspend` flag to false 
- Adds the term `instance-type: spot` to the job's `.spec.template.spec.nodeSelector` so that when the pods are created by the job controller, those pods can only schedule 
  onto spot nodes. 
-->
- 更改 `.spec.suspend` 標誌位爲 false 
- 將 `instance-type: spot` 添加到 Job 的 `.spec.template.spec.nodeSelector` 中，
以便在 Job 控制器創建 Pod 時，這些 Pod 只能調度到 Spot 節點上。

<!--
Finally, if there are available empty nodes with matching node selector terms, then kube-scheduler will directly schedule the pods. If not, then
kube-scheduler will initially mark the pods as unschedulable, which will trigger the cluster-autoscaler to provision new nodes.
-->
最後，如果有可用的空節點與節點選擇器條件匹配，那麼 kube-scheduler 將直接調度 Pod。
如果不是，那麼 kube-scheduler 將 pod 初始化標記爲不可調度，這將觸發 cluster-autoscaler 設定新節點。

<!--
## Future work and getting involved
-->
## 未來工作以及參與方式
<!--
The example above offers a glimpse of some of Kueue's features including support for quota, resource flexibility, and integration with cluster 
autoscaler. Kueue also supports fair-sharing, job priorities, and different queueing strategies. Take a look at the
[Kueue documentation](https://github.com/kubernetes-sigs/kueue/tree/main/docs) to learn more about those features and how to use Kueue. 
-->
上面的示例提供了 Kueue 的一些功能簡介，包括支持配額、資源靈活性以及與叢集自動縮放器的集成。
Kueue 還支持公平共享、Job 優先級和不同的排隊策略。
查看 [Kueue 文檔](https://github.com/kubernetes-sigs/kueue/tree/main/docs)以瞭解這些特性以及如何使用 Kueue 的更多資訊。

<!--
We have a number of features that we plan to add to Kueue, such as hierarchical quota, budgets, and support for dynamically sized jobs. In 
the more immediate future, we are focused on adding support for job preemption.
-->
我們計劃將許多特性添加到 Kueue 中，例如分層配額、預算和對動態大小 Job 的支持。
在不久的將來，我們將專注於增加對 Job 搶佔的支持。

<!--
The latest [Kueue release](https://github.com/kubernetes-sigs/kueue/releases) is available on Github;
try it out if you run batch workloads on Kubernetes (requires v1.22 or newer).
We are in the early stages of this project and we are seeking feedback of all levels, major or minor, so please don’t hesitate to reach out. We’re 
also open to additional contributors, whether it is to fix or report bugs, or help add new features or write documentation. You can get in touch with
us via our [repo](http://sigs.k8s.io/kueue), [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on 
[Slack](https://kubernetes.slack.com/messages/wg-batch).
-->
最新的 [Kueue 版本](https://github.com/kubernetes-sigs/kueue/releases)在 Github 上可用；
如果你在 Kubernetes 上運行批處理工作負載（需要 v1.22 或更高版本），可以嘗試一下。
這個項目還處於早期階段，我們正在蒐集大大小小各個方面的反饋，請不要猶豫，快來聯繫我們吧！
無論是修復或報告錯誤，還是幫助添加新特性或編寫文檔，我們歡迎一切形式的貢獻者。
你可以通過我們的[倉庫](http://sigs.k8s.io/kueue)、[郵件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或者 
[Slack](https://kubernetes.slack.com/messages/wg-batch) 與我們聯繫。

<!--
Last but not least, thanks to all [our contributors](https://github.com/kubernetes-sigs/kueue/graphs/contributors) who made this project possible!
-->
最後是很重要的一點，感謝所有促使這個項目成爲可能的[貢獻者們](https://github.com/kubernetes-sigs/kueue/graphs/contributors)！
