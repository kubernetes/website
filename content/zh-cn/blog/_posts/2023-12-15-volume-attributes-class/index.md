---
layout: blog
title: "Kubernetes 1.29：修改卷之 VolumeAttributesClass"
date: 2023-12-15
slug: kubernetes-1-29-volume-attributes-class
---
<!--
layout: blog
title: "Kubernetes 1.29: VolumeAttributesClass for Volume Modification"
date: 2023-12-15
slug: kubernetes-1-29-volume-attributes-class
-->

<!--
**Author**: Sunny Song (Google)
-->
**作者**：Sunny Song (Google)

**译者**：[Baofa Fan](https://github.com/carlory) (DaoCloud)

<!--
The v1.29 release of Kubernetes introduced an alpha feature to support modifying a volume
by changing the `volumeAttributesClassName` that was specified for a PersistentVolumeClaim (PVC).
With the feature enabled, Kubernetes can handle updates of volume attributes other than capacity.
Allowing volume attributes to be changed without managing it through different
provider's APIs directly simplifies the current flow.

You can read about VolumeAttributesClass usage details in the Kubernetes documentation 
or you can read on to learn about why the Kubernetes project is supporting this feature.
-->
Kubernetes v1.29 版本引入了一个 Alpha 功能，支持通过变更 PersistentVolumeClaim（PVC）的 
`volumeAttributesClassName` 字段来修改卷。启用该功能后，Kubernetes 可以处理除容量以外的卷属性的更新。
允许更改卷属性，而无需通过不同提供商的 API 对其进行管理，这直接简化了当前流程。

你可以在 Kubernetes 文档中，阅读有关 VolumeAttributesClass 的详细使用信息，或者继续阅读了解 
Kubernetes 项目为什么支持此功能。

## VolumeAttributesClass

<!--
The new `storage.k8s.io/v1alpha1` API group provides two new types:
-->
新的 `storage.k8s.io/v1alpha1` API 组提供了两种新类型：

**VolumeAttributesClass**

<!-- 
Represents a specification of mutable volume attributes defined by the CSI driver.
The class can be specified during dynamic provisioning of PersistentVolumeClaims,
and changed in the PersistentVolumeClaim spec after provisioning. 
-->
表示由 CSI 驱动程序定义的可变卷属性的规约。你可以在 PersistentVolumeClaim 动态制备时指定它，
并且允许在制备完成后在 PersistentVolumeClaim 规约中进行更改。

**ModifyVolumeStatus**

<!--
Represents the status object of `ControllerModifyVolume` operation.
-->
表示 `ControllerModifyVolume` 操作的状态对象。

<!--
With this alpha feature enabled, the spec of PersistentVolumeClaim defines VolumeAttributesClassName
that is used in the PVC. At volume provisioning, the `CreateVolume` operation will apply the parameters in the
VolumeAttributesClass along with the parameters in the StorageClass.
-->

启用此 Alpha 功能后，PersistentVolumeClaim 的 `spec.VolumeAttributesClassName` 字段指明了在 PVC 中使用的 VolumeAttributesClass。
在制备卷时，`CreateVolume` 操作将应用 VolumeAttributesClass 中的参数以及 StorageClass 中的参数。

<!--
When there is a change of volumeAttributesClassName in the PVC spec,
the external-resizer sidecar will get an informer event. Based on the current state of the configuration,
the resizer will trigger a CSI ControllerModifyVolume.
More details can be found in [KEP-3751](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md).
-->
当 PVC 的 `spec.VolumeAttributesClassName` 发生变化时，external-resizer sidecar 将会收到一个 informer 事件。
基于当前的配置状态，resizer 将触发 CSI ControllerModifyVolume。更多细节可以在 
[KEP-3751](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md) 中找到。

<!--
## How to use it

If you want to test the feature whilst it's alpha, you need to enable the relevant feature gate
in the `kube-controller-manager` and the `kube-apiserver`. Use the `--feature-gates` command line argument:
-->
## 如何使用它

如果你想在 Alpha 版本中测试该功能，需要在 `kube-controller-manager` 和 `kube-apiserver` 中启用相关的特性门控。
使用 `--feature-gates` 命令行参数：

```
--feature-gates="...,VolumeAttributesClass=true"
```

<!--
It also requires that the CSI driver has implemented the ModifyVolume API.
-->
它还需要 CSI 驱动程序实现 ModifyVolume API。

<!-- 
### User flow

If you would like to see the feature in action and verify it works fine in your cluster, here's what you can try:
-->
### 用户流程

如果你想看到该功能的运行情况，并验证它在你的集群中是否正常工作，可以尝试以下操作：

<!-- 
1. Define a StorageClass and VolumeAttributesClass
-->
1. 定义 StorageClass 和 VolumeAttributesClass

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: csi-sc-example
   provisioner: pd.csi.storage.gke.io
   parameters:
     disk-type: "hyperdisk-balanced"
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
2. 定义并创建 PersistentVolumeClaim

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
3. 验证 PersistentVolumeClaim 是否已正确制备：

   ```
   kubectl get pvc
   ```

<!--
4. Create a new VolumeAttributesClass gold:
-->
4. 创建一个新的名为 gold 的 VolumeAttributesClass：

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
5. 使用新的 VolumeAttributesClass 更新 PVC 并应用：

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
6. 验证 PersistentVolumeClaims 是否具有更新的 VolumeAttributesClass 参数：

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
## 后续步骤

* 有关设计的更多信息，请参阅 [VolumeAttributesClass KEP](https://kep.k8s.io/3751)
* 你可以在[项目看板](https://github.com/orgs/kubernetes-csi/projects/72)上查看或评论 VolumeAttributesClass
* 为了将此功能推向 Beta 版本，我们需要社区的反馈，因此这里有一个行动倡议：为 CSI 驱动程序添加支持，
  尝试此功能，考虑它如何帮助解决你的用户遇到的问题...

<!--
## Getting involved

We always welcome new contributors. So, if you would like to get involved, you can join our [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
-->
## 参与其中

我们始终欢迎新的贡献者。因此，如果你想参与其中，可以加入我们的
[Kubernetes 存储特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)。

<!--
If you would like to share feedback, you can do so on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
-->
如果你想分享反馈意见，可以在我们的[公共 Slack 频道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5) 上留言。

<!--
Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
特别感谢所有为此功能提供了很好的评论、分享了宝贵见解并帮助实现此功能的贡献者（按字母顺序）：

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