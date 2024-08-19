---
title: 卷属性类
content_type: concept
weight: 40
---
<!--
reviewers:
- msau42
- xing-yang
title: Volume Attributes Classes
content_type: concept
weight: 40
-->

<!-- overview -->

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

<!--
This page assumes that you are familiar with [StorageClasses](/docs/concepts/storage/storage-classes/),
[volumes](/docs/concepts/storage/volumes/) and [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
in Kubernetes.
-->
本页假设你已经熟悉 Kubernetes 中的 [StorageClass](/zh-cn/docs/concepts/storage/storage-classes/)、
[Volume](/zh-cn/docs/concepts/storage/volumes/) 和
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!-- body -->

<!--
A VolumeAttributesClass provides a way for administrators to describe the mutable
"classes" of storage they offer. Different classes might map to different quality-of-service levels.
Kubernetes itself is un-opinionated about what these classes represent.

This is a beta feature and disabled by default.

If you want to test the feature whilst it's beta, you need to enable the `VolumeAttributesClass`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the kube-controller-manager
and the kube-apiserver. You use the `--feature-gates` command line argument:
-->
卷属性类（VolumeAttributesClass）为管理员提供了一种描述可变更的存储“类”的方法。
不同的类可以映射到不同的服务质量级别。Kubernetes 本身不关注这些类代表什么。

这是一个 Beta 特性，默认被禁用。

如果你想测试这一处于 Beta 阶段的特性，你需要为 kube-controller-manager 和 kube-apiserver 启用
`VolumeAttributesClass` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
你可以使用 `--feature-gates` 命令行参数：

```shell
--feature-gates="...,VolumeAttributesClass=true"
```

<!--
You will also have to enable the `storage.k8s.io/v1beta1` API group through the
`kube-apiserver` [runtime-config](https://kubernetes.io/docs/tasks/administer-cluster/enable-disable-api/).
You use the following command line argument:
-->
你还必须通过 `kube-apiserver`
[运行时配置](/zh-cn/docs/tasks/administer-cluster/enable-disable-api/)启用
`storage.k8s.io/v1beta1` API 组：

```shell
--runtime-config=storage.k8s.io/v1beta1=true
```

<!--
You can also only use VolumeAttributesClasses with storage backed by
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}, and only where the
relevant CSI driver implements the `ModifyVolume` API.
-->
另外你只有在使用{{< glossary_tooltip text="容器存储接口（CSI）" term_id="csi" >}}支持的存储时才能使用
VolumeAttributesClass，并且要求相关的 CSI 驱动实现了 `ModifyVolume` API。

<!--
## The VolumeAttributesClass API

Each VolumeAttributesClass contains the `driverName` and `parameters`, which are
used when a PersistentVolume (PV) belonging to the class needs to be dynamically provisioned
or modified.

The name of a VolumeAttributesClass object is significant and is how users can request a particular class.
Administrators set the name and other parameters of a class when first creating VolumeAttributesClass objects.
While the name of a VolumeAttributesClass object in a `PersistentVolumeClaim` is mutable, the parameters in an existing class are immutable.
-->
## VolumeAttributesClass API   {#the-volumeattributesclass-api}

每个 VolumeAttributesClass 都包含 `driverName` 和 `parameters` 字段，
当属于此类的持久卷（PV）需要被动态制备或修改时系统会使用这两个字段。

VolumeAttributesClass 对象的名称比较重要，用户用对象名称来请求特定的类。
管理员在首次创建 VolumeAttributesClass 对象时会设置某个类的名称和其他参数。
虽然在 `PersistentVolumeClaim` 中 VolumeAttributesClass 对象的名称是可变的，
但现有类中的参数是不可变的。

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: pd.csi.storage.gke.io
parameters:
  provisioned-iops: "3000"
  provisioned-throughput: "50" 
```

<!--
### Provisioner

Each VolumeAttributesClass has a provisioner that determines what volume plugin is used for
provisioning PVs. The field `driverName` must be specified. 

The feature support for VolumeAttributesClass is implemented in
[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).
-->
### 存储制备器   {#provisioner}

每个 VolumeAttributesClass 都有一个制备器（Provisioner），用来决定使用哪个卷插件制备 PV。
`driverName` 字段是必填项。

针对 VolumeAttributesClass 的特性支持在
[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner) 中实现。

<!--
You are not restricted to specifying the [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).
You can also run and specify external provisioners,
which are independent programs that follow a specification defined by Kubernetes.
Authors of external provisioners have full discretion over where their code lives, how
the provisioner is shipped, how it needs to be run, what volume plugin it uses, etc.
-->
你并非必须指定 [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner)。
你也可以运行并指定外部制备器，它们是遵循 Kubernetes 所定义的规范的独立程序。
外部制备器的作者可以完全自行决定他们的代码放在哪儿、如何交付制备器、以何种方式运行、使用什么卷插件等。

<!--
### Resizer

Each VolumeAttributesClass has a resizer that determines what volume plugin is used
for modifying PVs. The field `driverName` must be specified. 

The modifying volume feature support for VolumeAttributesClass is implemented in
[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer).

For example, an existing PersistentVolumeClaim is using a VolumeAttributesClass named silver:
-->
### 调整器   {#resizer}

每个 VolumeAttributesClass 都有一个调整器（Resizer），用于确定修改 PV 所用的卷插件。
`driverName` 字段是必填项。

针对 VolumeAttributesClass 的修改卷特性支持在
[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer) 中实现。

如以下 YAML 所示，有一个 PersistentVolumeClaim 使用名为 silver 的 VolumeAttributesClass：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: silver
  …
```

<!--
A new VolumeAttributesClass gold is available in the cluster:
-->
集群中有一个新的名为 gold 的 VolumeAttributesClass：

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: pd.csi.storage.gke.io
parameters:
  iops: "4000"
  throughput: "60"
```

<!--
The end user can update the PVC with the new VolumeAttributesClass gold and apply:
-->
最终用户可以更新 PVC，使之使用新的名为 gold 的 VolumeAttributesClass，并应用此更新：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: gold
  …
```

<!--
## Parameters

VolumeAttributeClasses have parameters that describe volumes belonging to them. Different parameters may be accepted
depending on the provisioner or the resizer. For example, the value `4000`, for the parameter `iops`,
and the parameter `throughput` are specific to GCE PD.
When a parameter is omitted, the default is used at volume provisioning.
If a user applies the PVC with a different VolumeAttributesClass with omitted parameters, the default value of
the parameters may be used depending on the CSI driver implementation.
Please refer to the related CSI driver documentation for more details.
-->
## 参数   {#parameters}

VolumeAttributeClass 具有参数，用来描述隶属于该类的存储卷。可接受的参数可能因制备器或调整器而异。
例如，参数 `iops` 的取值 `4000` 和参数 `throughput` 是特定于 GCE PD 的。
如果某个参数被省略，则在卷制备时使用默认值。
如果用户使用带有省略参数的不同 VolumeAttributesClass 来应用 PVC，参数的默认取值可能会因 CSI 驱动实现而异。
有关细节参阅相关的 CSI 驱动文档。

<!--
There can be at most 512 parameters defined for a VolumeAttributesClass.
The total length of the parameters object including its keys and values cannot exceed 256 KiB.
-->
VolumeAttributesClass 最多可以定义 512 个参数。
这些参数对象的总长度（包括其键和值）不能超过 256 KiB。
