---
title: 卷屬性類
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
本頁假設你已經熟悉 Kubernetes 中的 [StorageClass](/zh-cn/docs/concepts/storage/storage-classes/)、
[Volume](/zh-cn/docs/concepts/storage/volumes/) 和
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!-- body -->

<!--
A VolumeAttributesClass provides a way for administrators to describe the mutable
"classes" of storage they offer. Different classes might map to different quality-of-service levels.
Kubernetes itself is un-opinionated about what these classes represent.

This feature is generally available (GA) as of version 1.34, and users have the option to disable it.
-->
卷屬性類（VolumeAttributesClass）爲管理員提供了一種描述可變更的存儲“類”的方法。
不同的類可以映射到不同的服務質量級別。Kubernetes 本身不關注這些類代表什麼。

此特性從 Kubernetes 1.34 版本開始一般可用（GA），使用者可以選擇禁用它。

<!--
You can also only use VolumeAttributesClasses with storage backed by
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}, and only where the
relevant CSI driver implements the `ModifyVolume` API.
-->
另外你只有在使用{{< glossary_tooltip text="容器存儲接口（CSI）" term_id="csi" >}}支持的存儲時才能使用
VolumeAttributesClass，並且要求相關的 CSI 驅動實現了 `ModifyVolume` API。

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

每個 VolumeAttributesClass 都包含 `driverName` 和 `parameters` 字段，
當屬於此類的持久卷（PV）需要被動態製備或修改時系統會使用這兩個字段。

VolumeAttributesClass 對象的名稱比較重要，使用者用對象名稱來請求特定的類。
管理員在首次創建 VolumeAttributesClass 對象時會設置某個類的名稱和其他參數。
雖然在 `PersistentVolumeClaim` 中 VolumeAttributesClass 對象的名稱是可變的，
但現有類中的參數是不可變的。

```yaml
apiVersion: storage.k8s.io/v1
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
### 存儲製備器   {#provisioner}

每個 VolumeAttributesClass 都有一個製備器（Provisioner），用來決定使用哪個卷插件製備 PV。
`driverName` 字段是必填項。

針對 VolumeAttributesClass 的特性支持在
[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner) 中實現。

<!--
You are not restricted to specifying the [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).
You can also run and specify external provisioners,
which are independent programs that follow a specification defined by Kubernetes.
Authors of external provisioners have full discretion over where their code lives, how
the provisioner is shipped, how it needs to be run, what volume plugin it uses, etc.
-->
你並非必須指定 [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner)。
你也可以運行並指定外部製備器，它們是遵循 Kubernetes 所定義的規範的獨立程序。
外部製備器的作者可以完全自行決定他們的代碼放在哪兒、如何交付製備器、以何種方式運行、使用什麼卷插件等。

<!--
To understand how the provisioner works with VolumeAttributesClass, refer to 
the [CSI external-provisioner documentation](https://kubernetes-csi.github.io/docs/external-provisioner.html).
-->
要了解制備組件如何使用 VolumeAttributesClass，請參閱 
[CSI 外部製備器文檔](https://kubernetes-csi.github.io/docs/external-provisioner.html)。

<!--
### Resizer

Each VolumeAttributesClass has a resizer that determines what volume plugin is used
for modifying PVs. The field `driverName` must be specified. 

The modifying volume feature support for VolumeAttributesClass is implemented in
[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer).

For example, an existing PersistentVolumeClaim is using a VolumeAttributesClass named silver:
-->
### 調整器   {#resizer}

每個 VolumeAttributesClass 都有一個調整器（Resizer），用於確定修改 PV 所用的卷插件。
`driverName` 字段是必填項。

針對 VolumeAttributesClass 的修改卷特性支持在
[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer) 中實現。

如以下 YAML 所示，有一個 PersistentVolumeClaim 使用名爲 silver 的 VolumeAttributesClass：

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
叢集中有一個新的名爲 gold 的 VolumeAttributesClass：

```yaml
apiVersion: storage.k8s.io/v1
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
最終使用者可以更新 PVC，使之使用新的名爲 gold 的 VolumeAttributesClass，並應用此更新：

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
To understand how the resizer works with VolumeAttributesClass, refer to 
the [CSI external-resizer documentation](https://kubernetes-csi.github.io/docs/external-resizer.html).
-->
要了解擴縮容組件如何使用 VolumeAttributesClass，請參閱 
[CSI 外部擴縮容組件文檔](https://kubernetes-csi.github.io/docs/external-resizer.html)。

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
## 參數   {#parameters}

VolumeAttributeClass 具有參數，用來描述隸屬於該類的存儲卷。可接受的參數可能因製備器或調整器而異。
例如，參數 `iops` 的取值 `4000` 和參數 `throughput` 是特定於 GCE PD 的。
如果某個參數被省略，則在卷製備時使用默認值。
如果使用者使用帶有省略參數的不同 VolumeAttributesClass 來應用 PVC，參數的默認取值可能會因 CSI 驅動實現而異。
有關細節參閱相關的 CSI 驅動文檔。

<!--
There can be at most 512 parameters defined for a VolumeAttributesClass.
The total length of the parameters object including its keys and values cannot exceed 256 KiB.
-->
VolumeAttributesClass 最多可以定義 512 個參數。
這些參數對象的總長度（包括其鍵和值）不能超過 256 KiB。
