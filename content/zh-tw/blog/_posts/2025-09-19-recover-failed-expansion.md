---
layout: blog
title: "Kubernetes v1.34：從存儲卷擴展失效中恢復（GA）"
date: 2025-09-19T10:30:00-08:00
slug: kubernetes-v1-34-recover-expansion-failure
author: >
  [Hemant Kumar](https://github.com/gnufied) (Red Hat)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes v1.34: Recovery From Volume Expansion Failure (GA)"
date: 2025-09-19T10:30:00-08:00
slug: kubernetes-v1-34-recover-expansion-failure
author: >
  [Hemant Kumar](https://github.com/gnufied) (Red Hat)
-->

<!--
Have you ever made a typo when expanding your persistent volumes in Kubernetes? Meant to specify `2TB`
but specified `20TiB`? This seemingly innocuous problem was kinda hard to fix - and took the project almost 5 years to fix.
[Automated recovery from storage expansion](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) has been around for a while in beta; however, with the v1.34 release, we have graduated this to
**general availability**.
-->
你是否曾經在擴展 Kubernetes 中的持久卷時犯過拼寫錯誤？本來想指定 `2TB` 卻寫成了 `20TiB`？
這個看似無害的問題實際上很難修復——項目花了將近 5 年時間才解決。
[存儲擴展的自動恢復](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) 
此特性在一段時間內一直處於 Beta 狀態；不過，隨着 v1.34 版本的發佈，我們已經將其提升到**正式發佈**狀態。

<!--
While it was always possible to recover from failing volume expansions manually, it usually required cluster-admin access and was tedious to do (See aformentioned link for more information).
-->
雖然手動從失敗的卷擴展中恢復總是可能的，但這通常需要叢集管理員權限，而且操作繁瑣（更多信息請參見上述鏈接）。

<!--
What if you make a mistake and then realize immediately?
With Kubernetes v1.34, you should be able to reduce the requested size of the PersistentVolumeClaim (PVC) and, as long as the expansion to previously requested
size hadn't finished, you can amend the size requested. Kubernetes will
automatically work to correct it. Any quota consumed by failed expansion will be returned to the user and the associated PersistentVolume should be resized to the
latest size you specified.
-->
如果你在申請存儲時不小心填錯了大小，並且立刻發現了這個錯誤怎麼辦？
在 Kubernetes v1.34 中，你可以**降低 PersistentVolumeClaim（PVC）請求的存儲大小**，只要上一次擴容操作還未完成，
就可以修改爲新的大小。
Kubernetes 會自動進行修正，歸還因擴容失敗而暫時佔用的配額，並將關聯的 PersistentVolume 調整爲你最新指定的大小。

<!--
I'll walk through an example of how all of this works.
-->
我將通過一個示例來演示這一切是如何工作的。

<!--
## Reducing PVC size to recover from failed expansion
-->
## 通過降低 PVC 尺寸完成從失敗的擴展操作中恢復

<!--
Imagine that you are running out of disk space for one of your database servers, and you want to expand the PVC from previously
specified `10TB` to `100TB` - but you make a typo and specify `1000TB`.
-->
想象一下，你的某個數據庫伺服器磁盤空間不足，
你想將 PVC 從之前指定的 `10TB` 擴展到 `100TB`——但你犯了一個拼寫錯誤，指定了 `1000TB`。

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1000TB # 新的大小配置，但不正確！
```

<!--
Now, you may be out of disk space on your disk array or simply ran out of allocated quota on your cloud-provider. But, assume that expansion to `1000TB` is never going to succeed.
-->
現在，你的磁盤陣列可能空間不足，或者雲平臺所分配的配額已用完。
不管怎樣，我們先來假設擴展到 `1000TB` 的操作永遠不會成功。

<!--
In Kubernetes v1.34, you can simply correct your mistake and request a new PVC size,
that is smaller than the mistake, provided it is still larger than the original size
of the actual PersistentVolume.
-->
在 Kubernetes v1.34 中，你可以輕鬆地修正錯誤，重新請求一個新的 PVC 尺寸，令該尺寸比之前錯誤請求的更小，
但前提是它**仍需大於最初 PersistentVolume 的實際尺寸**。
<!--
```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100TB # Corrected size; has to be greater than 10TB.
                     # You cannot shrink the volume below its actual size.
```
-->
```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100TB # 更正後的大小；必須大於 10TB。
                     # 你不能將捲縮小到其實際大小以下。
```

<!--
This requires no admin intervention. Even better, any surplus Kubernetes quota that you temporarily consumed will be automatically returned.
-->
這不需要管理員干預。更好的是，你臨時消耗的任何多餘 Kubernetes 配額都將自動返回。

<!--
This fault recovery mechanism does have a caveat: whatever new size you specify for the PVC, it **must** be still higher than the original size in `.status.capacity`.
Since Kubernetes doesn't support shrinking your PV objects, you can never go below the size that was originally allocated for your PVC request.
-->
這個故障恢復機制有一點很值得注意：無論你爲 PVC 所指定的新尺寸是多少，
它**必須**仍然高於 `.status.capacity` 中的原始大小。
由於 Kubernetes 不支持縮小你的 PV 對象，你一定不能給出低於你的 PVC 請求的最初分配尺寸。

<!--
## Improved error handling and observability of volume expansion
-->
## 卷擴展操作的錯誤處理和可觀測性提升

<!--
Implementing what might look like a relatively minor change also required us to almost
fully redo how volume expansion works under the hood in Kubernetes.
There are new API fields available in PVC objects which you can monitor to observe progress of volume expansion.
-->
即便看似相對較小的更改，也需要我們幾乎完全重新實現 Kubernetes 中卷擴展操作的底層工作方式。
PVC 對象中有新的 API 字段可供你監控以觀察卷擴展的進度。

<!--
### Improved observability of in-progress expansion
-->
### 對進行中擴展的可觀測性改進

<!--
You can query `.status.allocatedResourceStatus['storage']` of a PVC to monitor progress of a volume expansion operation.
For a typical block volume, this should transition between `ControllerResizeInProgress`, `NodeResizePending` and `NodeResizeInProgress` and become nil/empty when volume expansion has finished.

If for some reason, volume expansion to requested size is not feasible it should accordingly be in states like - `ControllerResizeInfeasible` or `NodeResizeInfeasible`.

You can also observe size towards which Kubernetes is working by watching `pvc.status.allocatedResources`.
-->
你可以查詢 PVC 的 `.status.allocatedResourceStatus['storage']` 來監控捲擴展操作的進度。
對於典型的塊卷，字段值應該在 `ControllerResizeInProgress`、`NodeResizePending` 和 `NodeResizeInProgress` 之間轉換，
並在卷擴展完成時變爲 nil（空）。

如果由於某種原因，無法將卷擴展到請求的尺寸，這一字段應該處於對應的 `ControllerResizeInfeasible` 或 `NodeResizeInfeasible` 等狀態。

你還可以通過觀察 `pvc.status.allocatedResources` 來觀察 Kubernetes 正在處理的大小。

<!--
### Improved error handling and reporting
-->
### 改進的錯誤處理和報告

<!--
Kubernetes should now retry your failed volume expansions at slower rate, it should make fewer requests to both storage system and Kubernetes apiserver.

Errors observerd during volume expansion are now reported as condition on PVC objects and should persist unlike events. Kubernetes will now populate `pvc.status.conditions` with error keys `ControllerResizeError` or `NodeResizeError` when volume expansion fails.
-->
Kubernetes 現在應該以較慢的速率重試你已經失敗的卷擴展操作，它應該向存儲系統和 Kubernetes apiserver 發出更少的請求。

卷擴展期間觀察到的錯誤現在作爲 PVC 對象上的狀況報告，並且應該持久化，不像事件。當卷擴展失敗時，
Kubernetes 現在將用錯誤鍵 `ControllerResizeError` 或 `NodeResizeError` 填充 `pvc.status.conditions`。

<!--
### Fixes long standing bugs in resizing workflows
-->
### 修復調整大小工作流中的長期錯誤

<!--
This feature also has allowed us to fix long standing bugs in resizing workflow such as [Kubernetes issue #115294](https://github.com/kubernetes/kubernetes/issues/115294).
If you observe anything broken, please report your bugs to [https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues/new/choose), along with details about how to reproduce the problem.
-->
此功能還允許我們修復調整大小工作流中的長期存在的若干錯誤，例如 [Kubernetes issue #115294](https://github.com/kubernetes/kubernetes/issues/115294)。
如果你觀察到任何問題，請將你所發現的錯誤及如何重新問題的詳細信息報告到 [https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues/new/choose)。

<!--
Working on this feature through its lifecycle was challenging and it wouldn't have been possible to reach GA
without feedback from [@msau42](https://github.com/msau42), [@jsafrane](https://github.com/jsafrane) and [@xing-yang](https://github.com/xing-yang).
-->
此功能的整個開發週期中充滿挑戰，如果沒有 [@msau42](https://github.com/msau42)、[@jsafrane](https://github.com/jsafrane) 和 [@xing-yang](https://github.com/xing-yang) 的反饋，
就不可能達到正式發佈狀態。

<!--
All of the contributors who worked on this also appreciate the input provided by [@thockin](https://github.com/thockin) and [@liggitt](https://github.com/liggitt) at various Kubernetes contributor summits.
-->
感謝所有參與此功能開發的貢獻者，同時也感謝 [@thockin](https://github.com/thockin)
和 [@liggitt](https://github.com/liggitt) 在各種 Kubernetes 貢獻者峯會上提供的意見。
