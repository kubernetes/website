---
layout: blog
title: "Kubernetes 1.31：通過 VolumeAttributesClass 修改捲進階至 Beta"
date: 2024-08-15
slug: kubernetes-1-31-volume-attributes-class
author: >
  Sunny Song (Google)
  Matthew Cary (Google)
translator: >
  [windsonsea](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.31: VolumeAttributesClass for Volume Modification Beta"
date: 2024-08-15
slug: kubernetes-1-31-volume-attributes-class
author: >
  Sunny Song (Google)
  Matthew Cary (Google)
-->

<!--
Volumes in Kubernetes have been described by two attributes: their storage class, and
their capacity. The storage class is an immutable property of the volume, while the
capacity can be changed dynamically with [volume
resize](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).

This complicates vertical scaling of workloads with volumes. While cloud providers and
storage vendors often offer volumes which allow specifying IO quality of service
(Performance) parameters like IOPS or throughput and tuning them as workloads operate,
Kubernetes has no API which allows changing them.
-->
在 Kubernetes 中，卷由兩個屬性描述：儲存類和容量。儲存類是卷的不可變屬性，
而容量可以通過[卷調整大小](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)進行動態變更。

這使得使用卷的工作負載的垂直擴縮容變得複雜。
雖然雲廠商和儲存供應商通常提供了一些允許指定注入 IOPS 或吞吐量等 IO
服務質量（性能）參數的卷，並允許在工作負載運行期間調整這些參數，但 Kubernetes
沒有提供用來更改這些參數的 API。

<!--
We are pleased to announce that the [VolumeAttributesClass
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md),
alpha since Kubernetes 1.29, will be beta in 1.31. This provides a generic,
Kubernetes-native API for modifying volume parameters like provisioned IO.
-->
我們很高興地宣佈，自 Kubernetes 1.29 起以 Alpha 引入的
[VolumeAttributesClass KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
將在 1.31 中進入 Beta 階段。這一機制提供了一個通用的、Kubernetes 原生的 API，
可用來修改諸如所提供的 IO 能力這類卷參數。

<!--
Like all new volume features in Kubernetes, this API is implemented via the [container
storage interface (CSI)](https://kubernetes-csi.github.io/docs/). In addition to the
VolumeAttributesClass feature gate, your provisioner-specific CSI driver must support the
new ModifyVolume API which is the CSI side of this feature.

See the [full
documentation](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/)
for all details. Here we show the common workflow.
-->
類似於 Kubernetes 中所有新的卷特性，此 API 是通過[容器儲存介面（CSI）](https://kubernetes-csi.github.io/docs/)實現的。
除了 VolumeAttributesClass 特性門控外，特定於製備器的 CSI 驅動還必須支持此特性在
CSI 一側的全新的 ModifyVolume API。

有關細節請參閱[完整文檔](/zh-cn/docs/concepts/storage/volume-attributes-classes/)。
在這裏，我們展示了常見的工作流程。

<!--
### Dynamically modifying volume attributes.

A `VolumeAttributesClass` is a cluster-scoped resource that specifies provisioner-specific
attributes. These are created by the cluster administrator in the same way as storage
classes. For example, a series of gold, silver and bronze volume attribute classes can be
created for volumes with greater or lessor amounts of provisioned IO.
-->
### 動態修改卷屬性   {#dynamically-modifying-volume-attributes}

`VolumeAttributesClass` 是一個叢集範圍的資源，用來指定特定於製備器的屬性。
這些屬性由叢集管理員創建，方式上與儲存類相同。
例如，你可以爲卷創建一系列金、銀和銅級別的卷屬性類，以區隔不同級別的 IO 能力。

```yaml
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: your-csi-driver
parameters:
  provisioned-iops: "500"
  provisioned-throughput: "50MiB/s"
---
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: your-csi-driver
parameters:
  provisioned-iops: "10000"
  provisioned-throughput: "500MiB/s"
```
  
<!--
An attribute class is added to a PVC in much the same way as a storage class.
-->
屬性類的添加方式與儲存類類似。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  storageClassName: any-storage-class
  volumeAttributesClassName: silver
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 64Gi
```

<!--
Unlike a storage class, the volume attributes class can be changed:
-->
與儲存類不同，卷屬性類可以被更改：

```shell
kubectl patch pvc test-pv-claim -p '{"spec": "volumeAttributesClassName": "gold"}'
```

<!--
Kubernetes will work with the CSI driver to update the attributes of the
volume. The status of the PVC will track the current and desired attributes
class. The PV resource will also be updated with the new volume attributes class
which will be set to the currently active attributes of the PV.
-->
Kubernetes 將與 CSI 驅動協作來更新卷的屬性。
PVC 的狀態將跟蹤當前和所需的屬性類。
PV 資源也將依據新的卷屬性類完成更新，卷屬性類也會被依據 PV 當前活躍的屬性完成設置。

<!--
### Limitations with the beta

As a beta feature, there are still some features which are planned for GA but not yet
present. The largest is quota support, see the
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
and discussion in
[sig-storage](https://github.com/kubernetes/community/tree/master/sig-storage) for details.

See the [Kubernetes CSI driver
list](https://kubernetes-csi.github.io/docs/drivers.html) for up-to-date
information of support for this feature in CSI drivers.
-->
### Beta 階段的限制   {#limitations-with-the-beta}

作爲一個 Beta 特性，仍有一些特性計劃在 GA 階段推出，但尚未實現。最大的限制是配額支持，詳見
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
和 [sig-storage](https://github.com/kubernetes/community/tree/master/sig-storage) 中的討論。

有關此特性在 CSI 驅動中的最新支持資訊，請參閱 [Kubernetes CSI 驅動列表](https://kubernetes-csi.github.io/docs/drivers.html)。
