---
layout: blog
title: 'Kubernetes 1.24: StatefulSet 的最大不可用副本數'
date: 2022-05-27
slug: maxunavailable-for-statefulset
---
<!--
layout: blog
title: 'Kubernetes 1.24: Maximum Unavailable Replicas for StatefulSet'
date: 2022-05-27
slug: maxunavailable-for-statefulset

**Author:** Mayank Kumar (Salesforce)
-->
**作者：** Mayank Kumar (Salesforce)

**譯者：** Xiaoyang Zhang（Huawei）

<!--
Kubernetes [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), since their introduction in 
1.5 and becoming stable in 1.9, have been widely used to run stateful applications. They provide stable pod identity, persistent
per pod storage and ordered graceful deployment, scaling and rolling updates. You can think of StatefulSet as the atomic building
block for running complex stateful applications. As the use of Kubernetes has grown, so has the number of scenarios requiring
StatefulSets. Many of these scenarios, require faster rolling updates than the currently supported one-pod-at-a-time updates, in the 
case where you're using the `OrderedReady` Pod management policy for a StatefulSet.
-->
Kubernetes [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)，
自 1.5 版本中引入並在 1.9 版本中變得穩定以來，已被廣泛用於運行有狀態應用。它提供固定的 Pod 身份標識、
每個 Pod 的持久存儲以及 Pod 的有序部署、擴縮容和滾動更新功能。你可以將 StatefulSet
視爲運行復雜有狀態應用程序的原子構建塊。隨着 Kubernetes 的使用增多，需要 StatefulSet 的場景也越來越多。
當 StatefulSet 的 Pod 管理策略爲 `OrderedReady` 時，其中許多場景需要比當前所支持的一次一個 Pod
的更新更快的滾動更新。

<!--
Here are some examples:

-  I am using a StatefulSet to orchestrate a multi-instance, cache based application where the size of the cache is large. The cache 
   starts cold and requires some significant amount of time before the container can start. There could be more initial startup tasks
   that are required. A RollingUpdate on this StatefulSet would take a lot of time before the application is fully updated. If the 
   StatefulSet supported updating more than one pod at a time, it would result in a much faster update.
-->
這裏有些例子：

- 我使用 StatefulSet 來編排一個基於緩存的多實例應用程序，其中緩存的規格很大。
  緩存冷啓動，需要相當長的時間才能啓動容器。所需要的初始啓動任務有很多。在應用程序完全更新之前，
  此 StatefulSet 上的 RollingUpdate 將花費大量時間。如果 StatefulSet 支持一次更新多個 Pod，
  那麼更新速度會快得多。

<!--
- My stateful application is composed of leaders and followers or one writer and multiple readers. I have multiple readers or 
   followers and my application can tolerate multiple pods going down at the same time. I want to update this application more than
   one pod at a time so that i get the new updates rolled out quickly, especially if the number of instances of my application are
   large. Note that my application still requires unique identity per pod.
-->
- 我的有狀態應用程序由 leader 和 follower 或者一個 writer 和多個 reader 組成。
  我有多個 reader 或 follower，並且我的應用程序可以容忍多個 Pod 同時出現故障。
  我想一次更新這個應用程序的多個 Pod，特別是當我的應用程序實例數量很多時，這樣我就能快速推出新的更新。
  注意，我的應用程序仍然需要每個 Pod 具有唯一標識。

<!--
In order to support such scenarios, Kubernetes 1.24 includes a new alpha feature to help. Before you can use the new feature you must
enable the `MaxUnavailableStatefulSet` feature flag. Once you enable that, you can specify a new field called `maxUnavailable`, part 
of the `spec` for a StatefulSet. For example: 
-->
爲了支持這樣的場景，Kubernetes 1.24 提供了一個新的 alpha 特性。在使用新特性之前，必須啓用
`MaxUnavailableStatefulSet` 特性標誌。一旦啓用，就可以指定一個名爲 `maxUnavailable` 的新字段，
這是 StatefulSet `spec` 的一部分。例如：

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
  namespace: default
spec:
  podManagementPolicy: OrderedReady  # 你必須設爲 OrderedReady
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      # 鏡像自發布以來已更改（以前使用的倉庫爲 "k8s.gcr.io"）
      - image: registry.k8s.io/nginx-slim:0.8
        imagePullPolicy: IfNotPresent
        name: nginx
  updateStrategy:
    rollingUpdate:
      maxUnavailable: 2 # 這是 alpha 特性的字段，默認值是 1
      partition: 0
    type: RollingUpdate
```

<!--
If you enable the new feature and you don't specify a value for `maxUnavailable` in a StatefulSet, Kubernetes applies a default
`maxUnavailable: 1`. This matches the behavior you would see if you don't enable the new feature.
-->
如果你啓用了新特性，但沒有在 StatefulSet 中指定 `maxUnavailable` 的值，Kubernetes
會默認設置 `maxUnavailable: 1`。這與你不啓用新特性時看到的行爲是一致的。

<!--
I'll run through a scenario based on that example manifest to demonstrate how this feature works. I will deploy a StatefulSet that
has 5 replicas, with `maxUnavailable` set to 2 and `partition` set to 0.
-->
我將基於該示例清單做場景演練，以演示此特性是如何工作的。我將部署一個有 5 個副本的 StatefulSet，
`maxUnavailable` 設置爲 2 並將 `partition` 設置爲 0。

<!--
I can trigger a rolling update by changing the image to `registry.k8s.io/nginx-slim:0.9`. Once I initiate the rolling update, I can 
watch the pods update 2 at a time as the current value of maxUnavailable is 2. The below output shows a span of time and is not 
complete.  The maxUnavailable can be an absolute number (for example, 2) or a percentage of desired Pods (for example, 10%). The 
absolute number is calculated from percentage by rounding up to the nearest integer.
-->
我可以通過將映像檔更改爲 `registry.k8s.io/nginx-slim:0.9` 來觸發滾動更新。一旦開始滾動更新，
就可以看到一次更新 2 個 Pod，因爲 `maxUnavailable` 的當前值是 2。
下面的輸出顯示了一個時間段內的結果，但並不是完整過程。`maxUnavailable` 可以是絕對數值（例如 2）或所需 Pod
的百分比（例如 10%），絕對數是通過百分比計算結果進行四捨五入到最接近的整數得出的。

```
kubectl get pods --watch 
```

```
NAME    READY   STATUS    RESTARTS   AGE
web-0   1/1     Running   0          85s
web-1   1/1     Running   0          2m6s
web-2   1/1     Running   0          106s
web-3   1/1     Running   0          2m47s
web-4   1/1     Running   0          2m27s
web-4   1/1     Terminating   0          5m43s ----> start terminating 4
web-3   1/1     Terminating   0          6m3s  ----> start terminating 3
web-3   0/1     Terminating   0          6m7s
web-3   0/1     Pending       0          0s
web-3   0/1     Pending       0          0s
web-4   0/1     Terminating   0          5m48s
web-4   0/1     Terminating   0          5m48s
web-3   0/1     ContainerCreating   0          2s
web-3   1/1     Running             0          2s
web-4   0/1     Pending             0          0s
web-4   0/1     Pending             0          0s
web-4   0/1     ContainerCreating   0          0s
web-4   1/1     Running             0          1s
web-2   1/1     Terminating         0          5m46s ----> start terminating 2 (only after both 4 and 3 are running)
web-1   1/1     Terminating         0          6m6s  ----> start terminating 1
web-2   0/1     Terminating         0          5m47s
web-1   0/1     Terminating         0          6m7s
web-1   0/1     Pending             0          0s
web-1   0/1     Pending             0          0s
web-1   0/1     ContainerCreating   0          1s
web-1   1/1     Running             0          2s
web-2   0/1     Pending             0          0s
web-2   0/1     Pending             0          0s
web-2   0/1     ContainerCreating   0          0s
web-2   1/1     Running             0          1s
web-0   1/1     Terminating         0          6m6s ----> start terminating 0 (only after 2 and 1 are running)
web-0   0/1     Terminating         0          6m7s
web-0   0/1     Pending             0          0s
web-0   0/1     Pending             0          0s
web-0   0/1     ContainerCreating   0          0s
web-0   1/1     Running             0          1s
```
<!--
Note that as soon as the rolling update starts, both 4 and 3 (the two highest ordinal pods) start terminating at the same time. Pods 
with ordinal 4 and 3 may become ready at their own pace. As soon as both pods 4 and 3 are ready, pods 2 and 1 start terminating at the
same time. When pods 2 and 1 are both running and ready, pod 0 starts terminating. 
-->
注意，滾動更新一開始，4 和 3（兩個最高序號的 Pod）同時開始進入 `Terminating` 狀態。
Pod 4 和 3 會按照自身節奏進行更新。一旦 Pod 4 和 3 更新完畢後，Pod 2 和 1 會同時進入
`Terminating` 狀態。當 Pod 2 和 1 都準備完畢處於 `Running` 狀態時，Pod 0 開始進入 `Terminating` 狀態

<!--
In Kubernetes, updates to StatefulSets follow a strict ordering when updating Pods. In this example, the update starts at replica 4, then
replica 3, then replica 2, and so on, one pod at a time. When going one pod at a time, its not possible for 3 to be running and ready 
before 4. When `maxUnavailable` is more than 1 (in the example scenario I set `maxUnavailable` to 2), it is possible that replica 3 becomes 
ready and running before replica 4 is ready&mdash;and that is ok. If you're a developer and you set `maxUnavailable` to more than 1, you should 
know that this outcome is possible and you must ensure that your application is able to handle such ordering issues that occur
if any. When you set `maxUnavailable` greater than 1, the ordering is guaranteed in between each batch of pods being updated. That guarantee
means that pods in update batch 2 (replicas 2 and 1) cannot start updating until the pods from batch 0 (replicas 4 and 3) are ready.
-->
在 Kubernetes 中，StatefulSet 更新 Pod 時遵循嚴格的順序。在此示例中，更新從副本 4 開始，
然後是副本 3，然後是副本 2，以此類推，一次更新一個 Pod。當一次只更新一個 Pod 時，
副本 3 不可能在副本 4 之前準備好進入 `Running` 狀態。當 `maxUnavailable` 值
大於 1 時（在示例場景中我設置 `maxUnavailable` 值爲 2），副本 3 可能在副本 4 之前準備好並運行，
這是沒問題的。如果你是開發人員並且設置 `maxUnavailable` 值大於 1，你應該知道可能出現這種情況，
並且如果有這種情況的話，你必須確保你的應用程序能夠處理發生的此類順序問題。當你設置 `maxUnavailable`
值大於 1 時，更新 Pod 的批次之間會保證順序。該保證意味着在批次 0（副本 4 和 3）中的 Pod
準備好之前，更新批次 2（副本 2 和 1）中的 Pod 無法開始更新。

<!--
Although Kubernetes refers to these as _replicas_, your stateful application may have a different view and each pod of the StatefulSet may
be holding completely different data than other pods. The important thing here is that updates to StatefulSets happen in batches, and you can
now have a batch size larger than 1 (as an alpha feature).
-->
儘管 Kubernetes 將這些稱爲**副本**，但你的有狀態應用程序可能不這樣理解，StatefulSet 的每個
Pod 可能持有與其他 Pod 完全不同的數據。重要的是，StatefulSet 的更新是分批進行的，
你現在讓批次大小大於 1（作爲 alpha 特性）。

<!--
Also note, that the above behavior is with `podManagementPolicy: OrderedReady`. If you defined a StatefulSet as `podManagementPolicy: Parallel`,
not only `maxUnavailable` number of replicas are terminated at the same time; `maxUnavailable` number of replicas start in `ContainerCreating`
phase at the same time as well. This is called bursting.
-->
還要注意，上面的行爲採用的 Pod 管理策略是 `podManagementPolicy: OrderedReady`。
如果你的 StatefulSet 的 Pod 管理策略是 `podManagementPolicy: Parallel`，
那麼不僅是 `maxUnavailable` 數量的副本同時被終止，還會導致 `maxUnavailable` 數量的副本同時在
`ContainerCreating` 階段。這就是所謂的突發（Bursting）。

<!--
So, now you may have a lot of questions about:-
- What is the behavior when you set `podManagementPolicy: Parallel`?
- What is the behavior when `partition` to a value other than `0`?
-->
因此，現在你可能有很多關於以下方面的問題：
- 當設置 `podManagementPolicy:Parallel` 時，會產生什麼行爲？
- 將 `partition` 設置爲非 `0` 值時會發生什麼？

<!--
It might be better to try and see it for yourself. This is an alpha feature, and the Kubernetes contributors are looking for feedback on this feature. Did
this help you achieve your stateful scenarios Did you find a bug or do you think the behavior as implemented is not intuitive or can
break applications or catch them by surprise? Please [open an issue](https://github.com/kubernetes/kubernetes/issues) to let us know.
-->
自己試試看可能會更好。這是一個 alpha 特性，Kubernetes 貢獻者正在尋找有關此特性的反饋。
這是否有助於你實現有狀態的場景？你是否發現了一個 bug，或者你認爲實現的行爲不直觀易懂，
或者它可能會破壞應用程序或讓他們感到喫驚？請[登記一個 issue](https://github.com/kubernetes/kubernetes/issues)
告知我們。

<!--
## Further reading and next steps {#next-steps}
- [Maximum unavailable Pods](/docs/concepts/workloads/controllers/statefulset/#maximum-unavailable-pods)
- [KEP for MaxUnavailable for StatefulSet](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/961-maxunavailable-for-statefulset)
- [Implementation](https://github.com/kubernetes/kubernetes/pull/82162/files)
- [Enhancement Tracking Issue](https://github.com/kubernetes/enhancements/issues/961)
-->
## 進一步閱讀和後續步驟 {#next-steps}
- [最多不可用 Pod 數](/zh-cn/docs/concepts/workloads/controllers/statefulset/#maximum-unavailable-pods)
- [KEP for MaxUnavailable for StatefulSet](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/961-maxunavailable-for-statefulset)
- [代碼實現](https://github.com/kubernetes/kubernetes/pull/82162/files)
- [增強跟蹤 Issue](https://github.com/kubernetes/enhancements/issues/961)