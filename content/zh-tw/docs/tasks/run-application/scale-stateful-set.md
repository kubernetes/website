---
title: 擴縮 StatefulSet
content_type: task
---

<!-- overview -->
<!--
This task shows how to scale a StatefulSet. Scaling a StatefulSet refers to increasing or decreasing the number of replicas.
-->
本文介紹如何擴縮StatefulSet。StatefulSet 的擴縮指的是增加或者減少副本個數。


## {{% heading "prerequisites" %}}

<!--
* StatefulSets are only available in Kubernetes version 1.5 or later.
  To check your version of Kubernetes, run `kubectl version`.

* Not all stateful applications scale nicely. If you are unsure about whether to scale your StatefulSets, see [StatefulSet concepts](/docs/concepts/workloads/controllers/statefulset/) or [StatefulSet tutorial](/docs/tutorials/stateful-application/basic-stateful-set/) for further information.

* You should perform scaling only when you are confident that your stateful application
  cluster is completely healthy.
-->
* StatefulSets 僅適用於 Kubernetes 1.5 及以上版本。
* 不是所有 Stateful 應用都能很好地執行擴縮操作。 
  如果你不是很確定是否要擴縮你的 StatefulSet，可先參閱
  [StatefulSet 概念](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
  或者 [StatefulSet 教程](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/)。

* 僅當你確定你的有狀態應用的叢集是完全健康的，才可執行擴縮操作.

<!-- steps -->

<!--
## Scaling StatefulSets

### Use kubectl to scale StatefulSets

First, find the StatefulSet you want to scale.

```shell
kubectl get statefulsets <stateful-set-name>
```
-->
## 擴縮 StatefulSet   {#scaling-statefulset}

## 使用 `kubectl` 擴縮 StatefulSet

首先，找到你要擴縮的 StatefulSet。

```shell
kubectl get statefulsets <statefulset 名稱>
```

<!--
Change the number of replicas of your StatefulSet:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```
-->
更改 StatefulSet 中副本個數：

```shell
kubectl scale statefulsets <statefulset 名稱> --replicas=<新的副本數>
```

<!--
### Make in-place updates on your StatefulSets

Alternatively, you can do [in-place updates](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) on your StatefulSets.

If your StatefulSet was initially created with `kubectl apply`,
update `.spec.replicas` of the StatefulSet manifests, and then do a `kubectl apply`:
-->
### 對 StatefulSet 執行就地更新

另外, 你可以[就地更新](/zh-cn/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) StatefulSet。

如果你的 StatefulSet 最初透過 `kubectl apply` 或 `kubectl create --save-config` 建立,
你可以更新 StatefulSet 清單中的 `.spec.replicas`, 然後執行命令 `kubectl apply`:

<!--
```shell
kubectl apply -f <stateful-set-file-updated>
```

Otherwise, edit that field with `kubectl edit`:

```shell
kubectl edit statefulsets <stateful-set-name>
```

Or use `kubectl patch`:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```
-->
```shell
kubectl apply -f <更新後的 statefulset 檔案>
```

否則，可以使用 `kubectl edit` 編輯副本欄位：

```shell
kubectl edit statefulsets <statefulset 名稱>
```

或者使用 `kubectl patch`：

```shell
kubectl patch statefulsets <statefulset 名稱> -p '{"spec":{"replicas":<new-replicas>}}'
```

<!--
## Troubleshooting

### Scaling down does not work right
-->
## 故障排查  {#troubleshooting}

### 縮容操作無法正常工作

<!--
You cannot scale down a StatefulSet when any of the stateful Pods it manages is unhealthy. Scaling down only takes place
after those stateful Pods become running and ready.

If spec.replicas > 1, Kubernetes cannot determine the reason for an unhealthy Pod. It might be the result of a permanent fault or of a transient fault. A transient fault can be caused by a restart required by upgrading or maintenance.
-->
當 Stateful 所管理的任何 Pod 不健康時，你不能對該 StatefulSet 執行縮容操作。
僅當 StatefulSet 的所有 Pod 都處於執行狀態和 Ready 狀況後才可縮容.

如果 `spec.replicas` 大於 1，Kubernetes 無法判定 Pod 不健康的原因。
Pod 不健康可能是由於永久性故障造成也可能是瞬態故障。
瞬態故障可能是節點升級或維護而引起的節點重啟造成的。

<!--
If the Pod is unhealthy due to a permanent fault, scaling
without correcting the fault may lead to a state where the StatefulSet membership
drops below a certain minimum number of replicas that are needed to function
correctly. This may cause your StatefulSet to become unavailable.
-->
如果該 Pod 不健康是由於永久性故障導致, 則在不糾正該故障的情況下進行縮容可能會導致
StatefulSet 進入一種狀態，其成員 Pod 數量低於應正常執行的副本數。
這種狀態也許會導致 StatefulSet 不可用。

<!--
If the Pod is unhealthy due to a transient fault and the Pod might become available again,
the transient error may interfere with your scale-up or scale-down operation. Some distributed
databases have issues when nodes join and leave at the same time. It is better
to reason about scaling operations at the application level in these cases, and
perform scaling only when you are sure that your stateful application cluster is
completely healthy.
-->
如果由於瞬態故障而導致 Pod 不健康並且 Pod 可能再次變為可用，那麼瞬態錯誤可能會干擾
你對 StatefulSet 的擴容/縮容操作。 一些分散式資料庫在同時有節點加入和離開時
會遇到問題。在這些情況下，最好是在應用級別進行分析擴縮操作的狀態, 並且只有在確保
Stateful 應用的叢集是完全健康時才執行擴縮操作。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [deleting a StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
-->
* 進一步瞭解[刪除 StatefulSet](/zh-cn/docs/tasks/run-application/delete-stateful-set/)

