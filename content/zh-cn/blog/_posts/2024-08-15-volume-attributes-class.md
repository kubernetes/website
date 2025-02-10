---
layout: blog
title: "Kubernetes 1.31：通过 VolumeAttributesClass 修改卷进阶至 Beta"
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
在 Kubernetes 中，卷由两个属性描述：存储类和容量。存储类是卷的不可变属性，
而容量可以通过[卷调整大小](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)进行动态变更。

这使得使用卷的工作负载的垂直扩缩容变得复杂。
虽然云厂商和存储供应商通常提供了一些允许指定注入 IOPS 或吞吐量等 IO
服务质量（性能）参数的卷，并允许在工作负载运行期间调整这些参数，但 Kubernetes
没有提供用来更改这些参数的 API。

<!--
We are pleased to announce that the [VolumeAttributesClass
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md),
alpha since Kubernetes 1.29, will be beta in 1.31. This provides a generic,
Kubernetes-native API for modifying volume parameters like provisioned IO.
-->
我们很高兴地宣布，自 Kubernetes 1.29 起以 Alpha 引入的
[VolumeAttributesClass KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
将在 1.31 中进入 Beta 阶段。这一机制提供了一个通用的、Kubernetes 原生的 API，
可用来修改诸如所提供的 IO 能力这类卷参数。

<!--
Like all new volume features in Kubernetes, this API is implemented via the [container
storage interface (CSI)](https://kubernetes-csi.github.io/docs/). In addition to the
VolumeAttributesClass feature gate, your provisioner-specific CSI driver must support the
new ModifyVolume API which is the CSI side of this feature.

See the [full
documentation](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/)
for all details. Here we show the common workflow.
-->
类似于 Kubernetes 中所有新的卷特性，此 API 是通过[容器存储接口（CSI）](https://kubernetes-csi.github.io/docs/)实现的。
除了 VolumeAttributesClass 特性门控外，特定于制备器的 CSI 驱动还必须支持此特性在
CSI 一侧的全新的 ModifyVolume API。

有关细节请参阅[完整文档](/zh-cn/docs/concepts/storage/volume-attributes-classes/)。
在这里，我们展示了常见的工作流程。

<!--
### Dynamically modifying volume attributes.

A `VolumeAttributesClass` is a cluster-scoped resource that specifies provisioner-specific
attributes. These are created by the cluster administrator in the same way as storage
classes. For example, a series of gold, silver and bronze volume attribute classes can be
created for volumes with greater or lessor amounts of provisioned IO.
-->
### 动态修改卷属性   {#dynamically-modifying-volume-attributes}

`VolumeAttributesClass` 是一个集群范围的资源，用来指定特定于制备器的属性。
这些属性由集群管理员创建，方式上与存储类相同。
例如，你可以为卷创建一系列金、银和铜级别的卷属性类，以区隔不同级别的 IO 能力。

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
属性类的添加方式与存储类类似。

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
与存储类不同，卷属性类可以被更改：

```shell
kubectl patch pvc test-pv-claim -p '{"spec": "volumeAttributesClassName": "gold"}'
```

<!--
Kubernetes will work with the CSI driver to update the attributes of the
volume. The status of the PVC will track the current and desired attributes
class. The PV resource will also be updated with the new volume attributes class
which will be set to the currently active attributes of the PV.
-->
Kubernetes 将与 CSI 驱动协作来更新卷的属性。
PVC 的状态将跟踪当前和所需的属性类。
PV 资源也将依据新的卷属性类完成更新，卷属性类也会被依据 PV 当前活跃的属性完成设置。

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
### Beta 阶段的限制   {#limitations-with-the-beta}

作为一个 Beta 特性，仍有一些特性计划在 GA 阶段推出，但尚未实现。最大的限制是配额支持，详见
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
和 [sig-storage](https://github.com/kubernetes/community/tree/master/sig-storage) 中的讨论。

有关此特性在 CSI 驱动中的最新支持信息，请参阅 [Kubernetes CSI 驱动列表](https://kubernetes-csi.github.io/docs/drivers.html)。
