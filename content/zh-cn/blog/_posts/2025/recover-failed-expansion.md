---
layout: blog
title: "Kubernetes v1.34：从存储卷扩展失效中恢复（GA）"
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
你是否曾经在扩展 Kubernetes 中的持久卷时犯过拼写错误？本来想指定 `2TB` 却写成了 `20TiB`？
这个看似无害的问题实际上很难修复——项目花了将近 5 年时间才解决。
[存储扩展的自动恢复](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) 
此特性在一段时间内一直处于 Beta 状态；不过，随着 v1.34 版本的发布，我们已经将其提升到**正式发布**状态。

<!--
While it was always possible to recover from failing volume expansions manually, it usually required cluster-admin access and was tedious to do (See aformentioned link for more information).
-->
虽然手动从失败的卷扩展中恢复总是可能的，但这通常需要集群管理员权限，而且操作繁琐（更多信息请参见上述链接）。

<!--
What if you make a mistake and then realize immediately?
With Kubernetes v1.34, you should be able to reduce the requested size of the PersistentVolumeClaim (PVC) and, as long as the expansion to previously requested
size hadn't finished, you can amend the size requested. Kubernetes will
automatically work to correct it. Any quota consumed by failed expansion will be returned to the user and the associated PersistentVolume should be resized to the
latest size you specified.
-->
如果你在申请存储时不小心填错了大小，并且立刻发现了这个错误怎么办？
在 Kubernetes v1.34 中，你可以**降低 PersistentVolumeClaim（PVC）请求的存储大小**，只要上一次扩容操作还未完成，
就可以修改为新的大小。
Kubernetes 会自动进行修正，归还因扩容失败而暂时占用的配额，并将关联的 PersistentVolume 调整为你最新指定的大小。

<!--
I'll walk through an example of how all of this works.
-->
我将通过一个示例来演示这一切是如何工作的。

<!--
## Reducing PVC size to recover from failed expansion
-->
## 通过降低 PVC 尺寸完成从失败的扩展操作中恢复

<!--
Imagine that you are running out of disk space for one of your database servers, and you want to expand the PVC from previously
specified `10TB` to `100TB` - but you make a typo and specify `1000TB`.
-->
想象一下，你的某个数据库服务器磁盘空间不足，
你想将 PVC 从之前指定的 `10TB` 扩展到 `100TB`——但你犯了一个拼写错误，指定了 `1000TB`。

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
      storage: 1000TB # 新的大小配置，但不正确！
```

<!--
Now, you may be out of disk space on your disk array or simply ran out of allocated quota on your cloud-provider. But, assume that expansion to `1000TB` is never going to succeed.
-->
现在，你的磁盘阵列可能空间不足，或者云平台所分配的配额已用完。
不管怎样，我们先来假设扩展到 `1000TB` 的操作永远不会成功。

<!--
In Kubernetes v1.34, you can simply correct your mistake and request a new PVC size,
that is smaller than the mistake, provided it is still larger than the original size
of the actual PersistentVolume.
-->
在 Kubernetes v1.34 中，你可以轻松地修正错误，重新请求一个新的 PVC 尺寸，令该尺寸比之前错误请求的更小，
但前提是它**仍需大于最初 PersistentVolume 的实际尺寸**。
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
      storage: 100TB # 更正后的大小；必须大于 10TB。
                     # 你不能将卷缩小到其实际大小以下。
```

<!--
This requires no admin intervention. Even better, any surplus Kubernetes quota that you temporarily consumed will be automatically returned.
-->
这不需要管理员干预。更好的是，你临时消耗的任何多余 Kubernetes 配额都将自动返回。

<!--
This fault recovery mechanism does have a caveat: whatever new size you specify for the PVC, it **must** be still higher than the original size in `.status.capacity`.
Since Kubernetes doesn't support shrinking your PV objects, you can never go below the size that was originally allocated for your PVC request.
-->
这个故障恢复机制有一点很值得注意：无论你为 PVC 所指定的新尺寸是多少，
它**必须**仍然高于 `.status.capacity` 中的原始大小。
由于 Kubernetes 不支持缩小你的 PV 对象，你一定不能给出低于你的 PVC 请求的最初分配尺寸。

<!--
## Improved error handling and observability of volume expansion
-->
## 卷扩展操作的错误处理和可观测性提升

<!--
Implementing what might look like a relatively minor change also required us to almost
fully redo how volume expansion works under the hood in Kubernetes.
There are new API fields available in PVC objects which you can monitor to observe progress of volume expansion.
-->
即便看似相对较小的更改，也需要我们几乎完全重新实现 Kubernetes 中卷扩展操作的底层工作方式。
PVC 对象中有新的 API 字段可供你监控以观察卷扩展的进度。

<!--
### Improved observability of in-progress expansion
-->
### 对进行中扩展的可观测性改进

<!--
You can query `.status.allocatedResourceStatus['storage']` of a PVC to monitor progress of a volume expansion operation.
For a typical block volume, this should transition between `ControllerResizeInProgress`, `NodeResizePending` and `NodeResizeInProgress` and become nil/empty when volume expansion has finished.

If for some reason, volume expansion to requested size is not feasible it should accordingly be in states like - `ControllerResizeInfeasible` or `NodeResizeInfeasible`.

You can also observe size towards which Kubernetes is working by watching `pvc.status.allocatedResources`.
-->
你可以查询 PVC 的 `.status.allocatedResourceStatus['storage']` 来监控卷扩展操作的进度。
对于典型的块卷，字段值应该在 `ControllerResizeInProgress`、`NodeResizePending` 和 `NodeResizeInProgress` 之间转换，
并在卷扩展完成时变为 nil（空）。

如果由于某种原因，无法将卷扩展到请求的尺寸，这一字段应该处于对应的 `ControllerResizeInfeasible` 或 `NodeResizeInfeasible` 等状态。

你还可以通过观察 `pvc.status.allocatedResources` 来观察 Kubernetes 正在处理的大小。

<!--
### Improved error handling and reporting
-->
### 改进的错误处理和报告

<!--
Kubernetes should now retry your failed volume expansions at slower rate, it should make fewer requests to both storage system and Kubernetes apiserver.

Errors observerd during volume expansion are now reported as condition on PVC objects and should persist unlike events. Kubernetes will now populate `pvc.status.conditions` with error keys `ControllerResizeError` or `NodeResizeError` when volume expansion fails.
-->
Kubernetes 现在应该以较慢的速率重试你已经失败的卷扩展操作，它应该向存储系统和 Kubernetes apiserver 发出更少的请求。

卷扩展期间观察到的错误现在作为 PVC 对象上的状况报告，并且应该持久化，不像事件。当卷扩展失败时，
Kubernetes 现在将用错误键 `ControllerResizeError` 或 `NodeResizeError` 填充 `pvc.status.conditions`。

<!--
### Fixes long standing bugs in resizing workflows
-->
### 修复调整大小工作流中的长期错误

<!--
This feature also has allowed us to fix long standing bugs in resizing workflow such as [Kubernetes issue #115294](https://github.com/kubernetes/kubernetes/issues/115294).
If you observe anything broken, please report your bugs to [https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues/new/choose), along with details about how to reproduce the problem.
-->
此功能还允许我们修复调整大小工作流中的长期存在的若干错误，例如 [Kubernetes issue #115294](https://github.com/kubernetes/kubernetes/issues/115294)。
如果你观察到任何问题，请将你所发现的错误及如何重新问题的详细信息报告到 [https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues/new/choose)。

<!--
Working on this feature through its lifecycle was challenging and it wouldn't have been possible to reach GA
without feedback from [@msau42](https://github.com/msau42), [@jsafrane](https://github.com/jsafrane) and [@xing-yang](https://github.com/xing-yang).
-->
此功能的整个开发周期中充满挑战，如果没有 [@msau42](https://github.com/msau42)、[@jsafrane](https://github.com/jsafrane) 和 [@xing-yang](https://github.com/xing-yang) 的反馈，
就不可能达到正式发布状态。

<!--
All of the contributors who worked on this also appreciate the input provided by [@thockin](https://github.com/thockin) and [@liggitt](https://github.com/liggitt) at various Kubernetes contributor summits.
-->
感谢所有参与此功能开发的贡献者，同时也感谢 [@thockin](https://github.com/thockin)
和 [@liggitt](https://github.com/liggitt) 在各种 Kubernetes 贡献者峰会上提供的意见。
