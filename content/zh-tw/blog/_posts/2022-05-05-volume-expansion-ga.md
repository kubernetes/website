---
layout: blog
title: "Kubernetes 1.24：卷擴充現在成爲穩定功能"
date: 2022-05-05
slug: volume-expansion-ga
---

<!-- 
---
layout: blog
title: "Kubernetes 1.24: Volume Expansion Now A Stable Feature"
date: 2022-05-05
slug: volume-expansion-ga
---
-->

<!-- 
**Author:** Hemant Kumar (Red Hat)

Volume expansion was introduced as a alpha feature in Kubernetes 1.8 and it went beta in 1.11 and with Kubernetes 1.24 we are excited to announce general availability(GA)
of volume expansion.

This feature allows Kubernetes users to simply edit their `PersistentVolumeClaim` objects and specify new size in PVC Spec and Kubernetes will automatically expand the volume
using storage backend and also expand the underlying file system in-use by the Pod without requiring any downtime at all if possible.
-->
**作者：** Hemant Kumar (Red Hat)

卷擴充在 Kubernetes 1.8 作爲 Alpha 功能引入，
在 Kubernetes 1.11 進入了 Beta 階段。
在 Kubernetes 1.24 中，我們很高興地宣佈卷擴充正式發佈（GA）。

此功能允許 Kubernetes 使用者簡單地編輯其 `PersistentVolumeClaim` 對象，
並在 PVC Spec 中指定新的大小，Kubernetes 將使用儲存後端自動擴充卷，
同時也會擴充 Pod 使用的底層檔案系統，使得無需任何停機時間成爲可能。
<!--
### How to use volume expansion

You can trigger expansion for a PersistentVolume by editing the `spec` field of a PVC, specifying a different
(and larger) storage request. For example, given following PVC:

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
      storage: 1Gi # specify new size here
```
-->
### 如何使用卷擴充

通過編輯 PVC 的 `spec` 字段，指定不同的（和更大的）儲存請求，
可以觸發 PersistentVolume 的擴充。
例如，給定以下 PVC：

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
      storage: 1Gi # 在此處指定新的大小
```
<!--
You can request expansion of the underlying PersistentVolume by specifying a new value instead of old `1Gi` size.
Once you've changed the requested size, watch the `status.conditions` field of the PVC to see if the
resize has completed.

When Kubernetes starts expanding the volume - it will add `Resizing` condition to the PVC, which will be removed once expansion completes. More information about progress of
expansion operation can also be obtained by monitoring events associated with the PVC:

```bash
kubectl describe pvc <pvc>
```
-->
你可以指定新的值來替代舊的 `1Gi` 大小來請求擴充下層 PersistentVolume。
一旦你更改了請求的大小，可以查看 PVC 的 `status.conditions` 字段，
確認卷大小的調整是否已完成。

當 Kubernetes 開始擴充卷時，它會給 PVC 添加 `Resizing` 狀況。
一旦擴充結束，這個狀況會被移除。通過監控與 PVC 關聯的事件，
還可以獲得更多關於擴充操作進度的資訊：

```bash
kubectl describe pvc <pvc>
```
<!--
### Storage driver support

Not every volume type however is expandable by default. Some volume types such as - intree hostpath volumes are not expandable at all. For CSI volumes - the CSI driver
must have capability `EXPAND_VOLUME` in controller or node service (or both if appropriate). Please refer to documentation of your CSI driver, to find out
if it supports volume expansion.

Please refer to volume expansion documentation for intree volume types which support volume expansion - [Expanding Persistent Volumes](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
-->
### 儲存驅動支持

然而，並不是每種卷類型都預設支持擴充。
某些卷類型（如樹內 hostpath 卷）不支持擴充。
對於 CSI 卷，
CSI 驅動必須在控制器或節點服務（如果合適，二者兼備）
中具有 `EXPAND_VOLUME` 能力。
請參閱 CSI 驅動的文檔，瞭解其是否支持卷擴充。

有關支持卷擴充的樹內（intree）卷類型，
請參閱卷擴充文檔：[擴充 PVC 申領](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)。

<!-- 
In general to provide some degree of control over volumes that can be expanded, only dynamically provisioned PVCs whose storage class has `allowVolumeExpansion` parameter set to `true` are expandable.

A Kubernetes cluster administrator must edit the appropriate StorageClass object and set
the `allowVolumeExpansion` field to `true`. For example:
-->
通常，爲了對可擴充的卷提供某種程度的控制，
只有在儲存類將 `allowVolumeExpansion` 參數設置爲 `true` 時，
動態供應的 PVC 纔是可擴充的。

Kubernetes 叢集管理員必須編輯相應的 StorageClass 對象，
並將 `allowVolumeExpansion` 字段設置爲 `true`。例如：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-default
provisioner: kubernetes.io/aws-ebs
parameters:
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```
<!--
### Online expansion compared to offline expansion

By default, Kubernetes attempts to expand volumes immediately after user requests a resize.
If one or more Pods are using the volume, Kubernetes tries to expands the volume using an online resize;
as a result volume expansion usually requires no application downtime.
Filesystem expansion on the node is also performed online and hence does not require shutting
down any Pod that was using the PVC.

If you expand a PersistentVolume that is not in use, Kubernetes does an offline resize (and,
because the volume isn't in use, there is again no workload disruption).
-->
### 在線擴充與離線擴充比較

預設情況下，Kubernetes 會在使用者請求調整大小後立即嘗試擴充卷。
如果一個或多個 Pod 正在使用該卷，
Kubernetes 會嘗試通過在線調整大小來擴充該卷；
因此，卷擴充通常不需要應用停機。
節點上的檔案系統也可以在線擴充，因此不需要關閉任何正在使用 PVC 的 Pod。

如果要擴充的 PersistentVolume 未被使用，Kubernetes 會用離線方式調整卷大小
（而且，由於該卷未使用，所以也不會造成工作負載中斷）。
<!-- 
In some cases though - if underlying Storage Driver can only support offline expansion, users of the PVC must take down their Pod before expansion can succeed. Please refer to documentation of your storage
provider to find out - what mode of volume expansion it supports.

When volume expansion was introduced as an alpha feature, Kubernetes only supported offline filesystem
expansion on the node and hence required users to restart their pods for file system resizing to finish. 
His behaviour has been changed and Kubernetes tries its best to fulfil any resize request regardless
of whether the underlying PersistentVolume volume is online or offline. If your storage provider supports
online expansion then no Pod restart should be necessary for volume expansion to finish.
-->
但在某些情況下，如果底層儲存驅動只能支持離線擴充，
則 PVC 使用者必須先停止 Pod，才能讓擴充成功。
請參閱儲存提供商的文檔，瞭解其支持哪種模式的卷擴充。

當卷擴充作爲 Alpha 功能引入時，
Kubernetes 僅支持在節點上進行離線的檔案系統擴充，
因此需要使用者重新啓動 Pod，才能完成檔案系統的大小調整。
今天，使用者的行爲已經被改變，無論底層 PersistentVolume 是在線還是離線，
Kubernetes 都會盡最大努力滿足任何調整大小的請求。
如果你的儲存提供商支持在線擴充，則無需重啓 Pod 即可完成卷擴充。
<!-- 
## Next steps

Although volume expansion is now stable as part of the recent v1.24 release,
SIG Storage are working to make it even simpler for users of Kubernetes to expand their persistent storage.
Kubernetes 1.23 introduced features for triggering recovery from failed volume expansion, allowing users
to attempt self-service healing after a failed resize.
See [Recovering from volume expansion failure](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) for more details.
-->
## 下一步

儘管卷擴充在最近的 v1.24 發行版中成爲了穩定版本，
但 SIG Storage 團隊仍然在努力讓 Kubernetes 使用者擴充其持久性儲存變得更簡單。
Kubernetes 1.23 引入了卷擴充失敗後觸發恢復機制的功能特性，
允許使用者在大小調整失敗後嘗試自助修復。
更多詳細資訊，請參閱[處理擴充捲過程中的失敗](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)。
<!--
The Kubernetes contributor community is also discussing the potential for StatefulSet-driven storage expansion. This proposed
feature would let you trigger expansion for all underlying PVs that are providing storage to a StatefulSet,
by directly editing the StatefulSet object.
See the [Support Volume Expansion Through StatefulSets](https://github.com/kubernetes/enhancements/issues/661) enhancement proposal for more details.
-->
Kubernetes 貢獻者社區也在討論有狀態（StatefulSet）驅動的儲存擴充的潛力。
這個提議的功能特性將允許使用者通過直接編輯 StatefulSet 對象，
觸發爲 StatefulSet 提供儲存的所有底層 PV 的擴充。
更多詳細資訊，請參閱[通過 StatefulSet 支持卷擴充](https://github.com/kubernetes/enhancements/issues/661)的改善提議。
