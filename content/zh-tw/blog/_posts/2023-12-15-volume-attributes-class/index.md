---
layout: blog
title: "Kubernetes 1.29：修改卷之 VolumeAttributesClass"
date: 2023-12-15
slug: kubernetes-1-29-volume-attributes-class
author: >
  Sunny Song (Google)
---
<!--
layout: blog
title: "Kubernetes 1.29: VolumeAttributesClass for Volume Modification"
date: 2023-12-15
slug: kubernetes-1-29-volume-attributes-class
-->

**譯者**：[Baofa Fan](https://github.com/carlory) (DaoCloud)

<!--
The v1.29 release of Kubernetes introduced an alpha feature to support modifying a volume
by changing the `volumeAttributesClassName` that was specified for a PersistentVolumeClaim (PVC).
With the feature enabled, Kubernetes can handle updates of volume attributes other than capacity.
Allowing volume attributes to be changed without managing it through different
provider's APIs directly simplifies the current flow.

You can read about VolumeAttributesClass usage details in the Kubernetes documentation 
or you can read on to learn about why the Kubernetes project is supporting this feature.
-->
Kubernetes v1.29 版本引入了一個 Alpha 功能，支持通過變更 PersistentVolumeClaim（PVC）的 
`volumeAttributesClassName` 字段來修改卷。啓用該功能後，Kubernetes 可以處理除容量以外的卷屬性的更新。
允許更改卷屬性，而無需通過不同提供商的 API 對其進行管理，這直接簡化了當前流程。

你可以在 Kubernetes 文檔中，閱讀有關 VolumeAttributesClass 的詳細使用信息，或者繼續閱讀了解 
Kubernetes 項目爲什麼支持此功能。

## VolumeAttributesClass

<!--
The new `storage.k8s.io/v1alpha1` API group provides two new types:
-->
新的 `storage.k8s.io/v1alpha1` API 組提供了兩種新類型：

**VolumeAttributesClass**

<!-- 
Represents a specification of mutable volume attributes defined by the CSI driver.
The class can be specified during dynamic provisioning of PersistentVolumeClaims,
and changed in the PersistentVolumeClaim spec after provisioning. 
-->
表示由 CSI 驅動程序定義的可變卷屬性的規約。你可以在 PersistentVolumeClaim 動態製備時指定它，
並且允許在製備完成後在 PersistentVolumeClaim 規約中進行更改。

**ModifyVolumeStatus**

<!--
Represents the status object of `ControllerModifyVolume` operation.
-->
表示 `ControllerModifyVolume` 操作的狀態對象。

<!--
With this alpha feature enabled, the spec of PersistentVolumeClaim defines VolumeAttributesClassName
that is used in the PVC. At volume provisioning, the `CreateVolume` operation will apply the parameters in the
VolumeAttributesClass along with the parameters in the StorageClass.
-->

啓用此 Alpha 功能後，PersistentVolumeClaim 的 `spec.VolumeAttributesClassName` 字段指明瞭在 PVC 中使用的 VolumeAttributesClass。
在製備卷時，`CreateVolume` 操作將應用 VolumeAttributesClass 中的參數以及 StorageClass 中的參數。

<!--
When there is a change of volumeAttributesClassName in the PVC spec,
the external-resizer sidecar will get an informer event. Based on the current state of the configuration,
the resizer will trigger a CSI ControllerModifyVolume.
More details can be found in [KEP-3751](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md).
-->
當 PVC 的 `spec.VolumeAttributesClassName` 發生變化時，external-resizer sidecar 將會收到一個 informer 事件。
基於當前的配置狀態，resizer 將觸發 CSI ControllerModifyVolume。更多細節可以在 
[KEP-3751](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md) 中找到。

<!--
## How to use it

If you want to test the feature whilst it's alpha, you need to enable the relevant feature gate
in the `kube-controller-manager` and the `kube-apiserver`. Use the `--feature-gates` command line argument:
-->
## 如何使用它

如果你想在 Alpha 版本中測試該功能，需要在 `kube-controller-manager` 和 `kube-apiserver` 中啓用相關的特性門控。
使用 `--feature-gates` 命令行參數：

```
--feature-gates="...,VolumeAttributesClass=true"
```

<!--
It also requires that the CSI driver has implemented the ModifyVolume API.
-->
它還需要 CSI 驅動程序實現 ModifyVolume API。

<!-- 
### User flow

If you would like to see the feature in action and verify it works fine in your cluster, here's what you can try:
-->
### 用戶流程

如果你想看到該功能的運行情況，並驗證它在你的集羣中是否正常工作，可以嘗試以下操作：

<!-- 
1. Define a StorageClass and VolumeAttributesClass
-->
1. 定義 StorageClass 和 VolumeAttributesClass

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: csi-sc-example
   provisioner: pd.csi.storage.gke.io
   parameters:
     type: "hyperdisk-balanced"
   volumeBindingMode: WaitForFirstConsumer
   ```


   ```yaml
   apiVersion: storage.k8s.io/v1alpha1
   kind: VolumeAttributesClass
   metadata:
     name: silver
   driverName: pd.csi.storage.gke.io
   parameters:
     provisioned-iops: "3000"
     provisioned-throughput: "50"
   ```

<!-- 
2. Define and create the PersistentVolumeClaim
-->
2. 定義並創建 PersistentVolumeClaim

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: test-pv-claim
   spec:
     storageClassName: csi-sc-example
     volumeAttributesClassName: silver
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 64Gi
   ```

<!--
3. Verify that the PersistentVolumeClaim is now provisioned correctly with:
--> 
3. 驗證 PersistentVolumeClaim 是否已正確製備：

   ```
   kubectl get pvc
   ```

<!--
4. Create a new VolumeAttributesClass gold:
-->
4. 創建一個新的名爲 gold 的 VolumeAttributesClass：

   ```yaml
   apiVersion: storage.k8s.io/v1alpha1
   kind: VolumeAttributesClass
   metadata:
     name: gold
   driverName: pd.csi.storage.gke.io
   parameters:
     iops: "4000"
     throughput: "60"
   ```

<!--
5. Update the PVC with the new VolumeAttributesClass and apply:
-->
5. 使用新的 VolumeAttributesClass 更新 PVC 並應用：

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: test-pv-claim
   spec:
     storageClassName: csi-sc-example
     volumeAttributesClassName: gold
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 64Gi
   ```

<!--
6. Verify that PersistentVolumeClaims has the updated VolumeAttributesClass parameters with:
-->
6. 驗證 PersistentVolumeClaims 是否具有更新的 VolumeAttributesClass 參數：

   ```
   kubectl describe pvc <PVC_NAME>
   ```

<!--
## Next steps

* See the [VolumeAttributesClass KEP](https://kep.k8s.io/3751) for more information on the design
* You can view or comment on the [project board](https://github.com/orgs/kubernetes-csi/projects/72) for VolumeAttributesClass
* In order to move this feature towards beta, we need feedback from the community,
  so here's a call to action: add support to the CSI drivers, try out this feature,
  consider how it can help with problems that your users are having…
-->
## 後續步驟

* 有關設計的更多信息，請參閱 [VolumeAttributesClass KEP](https://kep.k8s.io/3751)
* 你可以在[項目看板](https://github.com/orgs/kubernetes-csi/projects/72)上查看或評論 VolumeAttributesClass
* 爲了將此功能推向 Beta 版本，我們需要社區的反饋，因此這裏有一個行動倡議：爲 CSI 驅動程序添加支持，
  嘗試此功能，考慮它如何幫助解決你的用戶遇到的問題...

<!--
## Getting involved

We always welcome new contributors. So, if you would like to get involved, you can join our [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
-->
## 參與其中

我們始終歡迎新的貢獻者。因此，如果你想參與其中，可以加入我們的
[Kubernetes 存儲特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)。

<!--
If you would like to share feedback, you can do so on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
如果你想分享反饋意見，可以在我們的[公共 Slack 頻道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5) 上留言。

<!--
Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
特別感謝所有爲此功能提供了很好的評論、分享了寶貴見解並幫助實現此功能的貢獻者（按字母順序）：

*   Baofa Fan (calory)
*   Ben Swartzlander (bswartz)
*   Connor Catlett (ConnorJC3)
*   Hemant Kumar (gnufied)
*   Jan Šafránek (jsafrane)
*   Joe Betz (jpbetz)
*   Jordan Liggitt (liggitt)
*   Matthew Cary (mattcary)
*   Michelle Au (msau42)
*   Xing Yang (xing-yang)
