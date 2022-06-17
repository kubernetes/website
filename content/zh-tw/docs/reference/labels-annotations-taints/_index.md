---
title: 眾所周知的標籤、註解和汙點
content_type: concept
weight: 20
no_list: true
---

<!--
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 20
no_list: true
-->

<!-- overview -->
<!--
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 將所有標籤和註解保留在 kubernetes.io Namespace中。

本文件既可作為值的參考，也可作為分配值的協調點。

<!-- body -->
<!--
## Labels, annotations and taints used on API objects

### app.kubernetes.io/component

Example: `app.kubernetes.io/component=database`

Used on: All Objects

The component within the architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
## API 物件上使用的標籤、註解和汙點

### app.kubernetes.io/component

例子: `app.kubernetes.io/component=database`

用於: 所有物件

架構中的元件。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/created-by

Example: `app.kubernetes.io/created-by=controller-manager`

Used on: All Objects

The controller/user who created this resource.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->
### app.kubernetes.io/created-by

示例：`app.kubernetes.io/created-by=controller-manager`

用於：所有物件

建立此資源的控制器/使用者。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/instance

Example: `app.kubernetes.io/instance=mysql-abcxzy`

Used on: All Objects

A unique name identifying the instance of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->
### app.kubernetes.io/instance

示例：`app.kubernetes.io/instance=mysql-abcxzy`

用於：所有物件

標識應用例項的唯一名稱。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/managed-by

Example: `app.kubernetes.io/managed-by=helm`

Used on: All Objects

The tool being used to manage the operation of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->
### app.kubernetes.io/managed-by

示例：`app.kubernetes.io/managed-by=helm`

用於：所有物件

用於管理應用操作的工具。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/name

Example: `app.kubernetes.io/name=mysql`

Used on: All Objects

The name of the application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->

### app.kubernetes.io/name

示例：`app.kubernetes.io/name=mysql`

用於：所有物件

應用的名稱。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/part-of

Example: `app.kubernetes.io/part-of=wordpress`

Used on: All Objects

The name of a higher level application this one is part of.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->
### app.kubernetes.io/part-of

示例：`app.kubernetes.io/part-of=wordpress`

用於：所有物件

此應用所屬的更高級別應用的名稱。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- ### app.kubernetes.io/version

Example: `app.kubernetes.io/version="5.7.21"`

Used on: All Objects

The current version of the application (e.g., a semantic version, revision hash, etc.).

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels). -->
### app.kubernetes.io/version

示例：`app.kubernetes.io/version="5.7.21"`

用於：所有物件

應用的當前版本（例如，語義版本、修訂雜湊等）。

[推薦標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!-- 
### kubernetes.io/arch

Example: `kubernetes.io/arch=amd64`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes. -->

### kubernetes.io/arch {#kubernetes-io-arch}

例子：`kubernetes.io/arch=amd64`

用於：Node

Kubelet 使用 Go 定義的 `runtime.GOARCH` 填充它。 如果你混合使用 ARM 和 X86 節點，這會很方便。
<!--
### kubernetes.io/os

Example: `kubernetes.io/os=linux`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
### kubernetes.io/os {#kubernetes-io-os}

例子：`kubernetes.io/os=linux`

用於：Node

Kubelet 使用 Go 定義的 `runtime.GOOS` 填充它。如果你在叢集中混合使用作業系統（例如：混合 Linux 和 Windows 節點），這會很方便。
<!--
### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name=mynamespace`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}) 
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value. 

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.
-->
### kubernetes.io/metadata.name {#kubernetes-io-metadata-name}

例子：`kubernetes.io/metadata.name=mynamespace`

用於：Namespace

Kubernetes API 伺服器（{{<glossary_tooltip text="控制平面" term_id="control-plane" >}} 的一部分）在所有 Namespace 上設定此標籤。
標籤值被設定 Namespace 的名稱。你無法更改此標籤的值。

如果你想使用標籤{{<glossary_tooltip text="選擇器" term_id="selector" >}}定位特定 Namespace，這很有用。
<!--
### beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.

### beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
### beta.kubernetes.io/arch (已棄用) {#beta-kubernetes-io-arch}

此標籤已被棄用。請改用`kubernetes.io/arch`。

### beta.kubernetes.io/os (已棄用) {#beta-kubernetes-io-os}

此標籤已被棄用。請改用`kubernetes.io/os`。

<!--
### kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
### kubernetes.io/hostname {#kubernetesiohostname}

例子：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用於：Node

Kubelet 使用主機名填充此標籤。請注意，可以透過將 `--hostname-override` 標誌傳遞給 `kubelet` 來替代“實際”主機名。

此標籤也用作拓撲層次結構的一部分。 有關詳細資訊，請參閱 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Example: `kubernetes.io/change-cause=kubectl edit --record deployment foo`

Used on: All Objects

This annotation is a best guess at why something was changed. 

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

例子：`kubernetes.io/change-cause=kubectl edit --record deployment foo`

用於：所有物件

此註解是對某些事物發生變更的原因的最佳猜測。

將 `--record` 新增到可能會更改物件的 `kubectl` 命令時會填充它。

<!--
### kubernetes.io/description {#description}

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

例子：`kubernetes.io/description: "Description of K8s object."`

用於：所有物件

此註解用於描述給定物件的特定行為。

<!--
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect. This annotation indicates that pods running as this service account may only reference Secret API objects specified in the service account's `secrets` field.
-->
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

例子：`kubernetes.io/enforce-mountable-secrets: "true"`

用於：ServiceAccount

此註解的值必須為 **true** 才能生效。此註解表示作為此服務帳戶執行的 Pod 只能引用在服務帳戶的 `secrets` 欄位中指定的 Secret API 物件。

<!--
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Example: `controller.kubernetes.io/pod-deletion-cost=10`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order. The annotation parses into an `int32` type.
-->
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

例子：`controller.kubernetes.io/pod-deletion-cost=10`

用於：Pod

該註解用於設定 [Pod 刪除成本](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)允許使用者影響 ReplicaSet 縮減順序。註解解析為 `int32` 型別。

<!-- 
### kubernetes.io/ingress-bandwidth

Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).

Example: `kubernetes.io/ingress-bandwidth: 10M`

Used on: Pod

You can apply quality-of-service traffic shaping to a pod and effectively limit its available bandwidth.
Ingress traffic (to the pod) is handled by shaping queued packets to effectively handle data.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/ingress-bandwidth` annotation. The unit used for specifying ingress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second. 
-->

### kubernetes.io/ingress-bandwidth

{{< note >}}
入站流量控制註解是一項實驗性功能。
如果要啟用流量控制支援，必須將`bandwidth`外掛新增到 CNI 配置檔案（預設為`/etc/cni/net.d`）
並確保二進位制檔案包含在你的 CNI bin 目錄中（預設為`/opt/cni/bin`）。
{{< /note >}}

示例：`kubernetes.io/ingress-bandwidth: 10M`

用於：Pod

你可以對 Pod 應用服務質量流量控制並有效限制其可用頻寬。
入站流量（到 Pod）透過控制排隊的資料包來處理，以有效地處理資料。
要限制 Pod 的頻寬，請編寫物件定義 JSON 檔案並使用 `kubernetes.io/ingress-bandwidth`
註解指定資料流量速度。 用於指定入站的速率單位是每秒，
作為[量綱（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)。
例如，`10M`表示每秒 10 兆位元。

<!-- 
### kubernetes.io/egress-bandwidth

Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).

Example: `kubernetes.io/egress-bandwidth: 10M`

Used on: Pod

Egress traffic (from the pod) is handled by policing, which simply drops packets in excess of the configured rate.
The limits you place on a pod do not affect the bandwidth of other pods.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/egress-bandwidth` annotation. The unit used for specifying egress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second. 
-->

### kubernetes.io/egress-bandwidth

{{< note >}}
出站流量控制註解是一項實驗性功能。
如果要啟用流量控制支援，必須將`bandwidth`外掛新增到 CNI 配置檔案（預設為`/etc/cni/net.d`）
並確保二進位制檔案包含在你的 CNI bin 目錄中（預設為`/opt/cni/bin`）。
{{< /note >}}

示例：`kubernetes.io/egress-bandwidth: 10M`

用於：Pod

出站流量（來自 pod）由策略控制，策略只是丟棄超過配置速率的資料包。
你為一個 Pod 所設定的限制不會影響其他 Pod 的頻寬。
要限制 Pod 的頻寬，請編寫物件定義 JSON 檔案並使用 `kubernetes.io/egress-bandwidth` 註解指定資料流量速度。
用於指定出站的速率單位是每秒位元數，
以[量綱（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)的形式給出。
例如，`10M` 表示每秒 10 兆位元。

<!-- ### beta.kubernetes.io/instance-type (deprecated) -->
### beta.kubernetes.io/instance-type (已棄用) {#beta-kubernetes-io-instance-type}

<!--
Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
{{< note >}} 從 v1.17 開始，此標籤已棄用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。 {{< /note >}}

<!--
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type=m3.medium`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

例子：`node.kubernetes.io/instance-type=m3.medium`

用於：Node

Kubelet 使用 `cloudprovider` 定義的例項型別填充它。
僅當你使用 `cloudprovider` 時才會設定此項。如果你希望將某些工作負載定位到某些例項型別，則此設定非常方便，但通常你希望依靠 Kubernetes 排程程式來執行基於資源的排程。
你應該基於屬性而不是例項型別來排程（例如：需要 GPU，而不是需要 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
### failure-domain.beta.kubernetes.io/region (已棄用) {#failure-domainbetakubernetesioregion}

請參閱 [topology.kubernetes.io/region](#topologykubernetesioregion)。

<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
{{< note >}} 從 v1.17 開始，此標籤已棄用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。 {{</note>}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### failure-domain.beta.kubernetes.io/zone (已棄用) {#failure-domainbetakubernetesiozone}

請參閱 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). 
-->
{{< note >}} 從 v1.17 開始，此標籤已棄用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。 {{</note>}}

<!--
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Example:

`statefulset.kubernetes.io/pod-name=mystatefulset-7`

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) in the
StatefulSet topic for more details.
-->
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

例子：`statefulset.kubernetes.io/pod-name=mystatefulset-7`

當 StatefulSet 控制器為 StatefulSet 建立 Pod 時，控制平面會在該 Pod 上設定此標籤。標籤的值是正在建立的 Pod 的名稱。

有關詳細資訊，請參閱 StatefulSet 主題中的 [Pod 名稱標籤](/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region=us-east-1`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

例子：`topology.kubernetes.io/region=us-east-1`

請參閱 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone=us-east-1c`

Used on: Node、PersistentVolume

On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.

A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.

A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.

-->
### topology.kubernetes.io/zone {#topologykubernetesiozone}

例子：`topology.kubernetes.io/zone=us-east-1c`

用於：Node、PersistentVolume

在 Node 上：`kubelet` 或外部 `cloud-controller-manager` 使用 `cloudprovider` 提供的資訊填充它。僅當你使用 `cloudprovider` 時才會設定此項。
但是，如果它在你的拓撲中有意義，你應該考慮在 Node 上設定它。

在 PersistentVolume 上：拓撲感知卷配置器將自動在 `PersistentVolume` 上設定 Node 親和性約束。

一個 Zone 代表一個邏輯故障域。 Kubernetes 叢集通常跨越多個 Zone 以提高可用性。雖然 Zone 的確切定義留給基礎設施實現，
但 Zone 的常見屬性包括 Zone 內非常低的網路延遲、 Zone 內的免費網路流量以及與其他 Zone 的故障獨立性。
例如，一個 Zone 內的 Node 可能共享一個網路交換機，但不同 Zone 中的 Node 無法共享交換機。

一個 Region 代表一個更大的域，由一個或多個 Zone 組成。Kubernetes 叢集跨多個 Region 並不常見，雖然 Zone 或 Region 的確切定義留給基礎設施實現，
但 Region 的共同屬性包括它們之間的網路延遲比它們內部更高，它們之間的網路流量成本非零，以及與其他 Zone 或 Region 的故障獨立性。
例如，一個 Region 內的 Node 可能共享電力基礎設施（例如 UPS 或發電機），但不同 Region 的 Node 通常不會共享電力基礎設施。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 對 Zone 和 Region 的結構做了一些假設：

1. Zone 和 Region 是分層的： Zone 是 Region 的嚴格子集，沒有 Zone 可以在兩個 Region 中；

2. Zone 名稱跨 Region 是唯一的；例如， Region “africa-east-1” 可能由 Zone “africa-east-1a” 和 “africa-east-1b” 組成。

<!--
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
你可以大膽假設拓撲標籤不會改變。儘管嚴格地講標籤是可變的，但節點的使用者可以假設給定
節點只能透過銷燬和重新建立才能完成 Zone 間移動。

<!--
Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以透過多種方式使用這些資訊。例如，排程程式會自動嘗試將 ReplicaSet 中的 Pod
分佈在單 Zone 叢集中的多個節點上（以便減少節點故障的影響，請參閱 [kubernetes.io/hostname](#kubernetesiohostname)）。
對於多 Zone 叢集，這種分佈行為也適用於 Zone（以減少 Zone 故障的影響）。
Zone 級別的 Pod 分佈是透過 _SelectorSpreadPriority_ 實現的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
_SelectorSpreadPriority_ 是一個盡力而為的放置機制。如果叢集中的 Zone 是異構的
（例如：節點數量不同、節點型別不同或 Pod 資源需求有別等），這種放置機制可能會讓你的
Pod 無法實現跨 Zone 均勻分佈。
如果需要，你可以使用同質 Zone（節點數量和型別均相同）來減少不均勻分佈的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
排程程式還將（透過 _VolumeZonePredicate_ 條件）確保申領給定卷的 Pod 僅被放置在與該卷相同的 Zone 中。
卷不能跨 Zone 掛接。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
你應該考慮手動新增標籤（或新增對 `PersistentVolumeLabel` 的支援）。
基於 `PersistentVolumeLabel` ，排程程式可以防止 Pod 掛載來自其他 Zone 的卷。如果你的基礎架構沒有此限制，則不需要將 Zone 標籤新增到捲上。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Example: `volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

Used on: PersistentVolumeClaim

This annotation has been deprecated.
-->
### volume.beta.kubernetes.io/storage-provisioner (已棄用) {#volume-beta-kubernetes-io-storage-provisioner}

例子：`volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

用於：PersistentVolumeClaim

此註解已被棄用。

<!--
### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation will be added to dynamic provisioning required PVC.
-->
### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

用於：PersistentVolumeClaim

此註解將被新增到根據需要動態製備的 PVC 上。

<!--
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build=10.0.17763`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

例子：`node.kubernetes.io/windows-build=10.0.17763`

用於：Node

當 kubelet 在 Microsoft Windows 上執行時，它會自動標記其所在節點以記錄所使用的 Windows Server 的版本。

標籤的值採用 “MajorVersion.MinorVersion.BuildNumber” 格式。

<!--
### service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless=""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
### service.kubernetes.io/headless {#servicekubernetesioheadless}

例子：`service.kubernetes.io/headless=""`

用於：Service

當擁有的 Service 是無頭型別時，控制平面將此標籤新增到 Endpoints 物件。

<!--
### kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name="nginx"`

Used on: Service

Kubernetes uses this label to differentiate multiple Services. Used currently for `ELB`(Elastic Load Balancer) only.
-->
### kubernetes.io/service-name {#kubernetesioservice-name}

例子：`kubernetes.io/service-name="nginx"`

用於：Service

Kubernetes 使用這個標籤來區分多個服務。目前僅用於 `ELB` （彈性負載均衡器）。

<!-- 
### kubernetes.io/service-account.name

Example: `kubernetes.io/service-account.name: "sa-name"`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="name" text="name">}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.
-->
### kubernetes.io/service-account.name

示例：`kubernetes.io/service-account.name: "sa-name"`

用於：Secret

這個註解記錄了令牌（儲存在 `kubernetes.io/service-account-token` 型別的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="name" text="名稱">}}。

<!-- 
### kubernetes.io/service-account.uid

Example: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.
-->
### kubernetes.io/service-account.uid

示例：`kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

用於：Secret

該註解記錄了令牌（儲存在 `kubernetes.io/service-account-token` 型別的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="uid" text="唯一 ID" >}}。

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by="controller"`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

例子：`endpointslice.kubernetes.io/managed-by="controller"`

用於：EndpointSlice

用於標示管理 EndpointSlice 的控制器或實體。該標籤旨在使不同的 EndpointSlice
物件能夠由同一叢集內的不同控制器或實體管理。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror="true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

例子：`endpointslice.kubernetes.io/skip-mirror="true"`

用於：Endpoints

可以在 Endpoints 資源上將此標籤設定為 `"true"`，以指示 EndpointSliceMirroring
控制器不應使用 EndpointSlice 映象此 Endpoints 資源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name="foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

例子：`service.kubernetes.io/service-proxy-name="foo-bar"`

用於：Service

kube-proxy 自定義代理會使用這個標籤，它將服務控制委託給自定義代理。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation experimental.windows.kubernetes.io/isolation-type=hyperv.
-->
### experimental.windows.kubernetes.io/isolation-type (已棄用) {#experimental-windows-kubernetes-io-isolation-type}

例子：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用於：Pod

註解用於執行具有 Hyper-V 隔離的 Windows 容器。要使用 Hyper-V 隔離功能並建立 Hyper-V
隔離容器，kubelet 啟動時應該需要設定特性門控 HyperVContainer=true。

<!--
You can only set this annotation on Pods that have a single container.
Starting from v1.20, this annotation is deprecated. Experimental Hyper-V support was removed in 1.21.
-->
{{< note >}}
你只能在具有單個容器的 Pod 上設定此註解。
從 v1.20 開始，此註解已棄用。1.21 中刪除了實驗性 Hyper-V 支援。
{{</note>}}

<!--
### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
### ingressclass.kubernetes.io/is-default-class {#ingressclass-kubernetes-io-is-default-class}

例子：`ingressclass.kubernetes.io/is-default-class: "true"`

用於：IngressClass

當單個 IngressClass 資源將此註解設定為 `"true"`時，新的未指定 Ingress 類的 Ingress
資源將被設定為此預設類。

<!--
### kubernetes.io/ingress.class (deprecated)

Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
### kubernetes.io/ingress.class (已棄用) {#kubernetes-io-ingress-class}

{{< note >}}
從 v1.18 開始，不推薦使用此註解以鼓勵使用 `spec.ingressClassName`。
{{</note>}}

<!--
### storageclass.kubernetes.io/is-default-class

Example: `storageclass.kubernetes.io/is-default-class=true`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class {#storageclass-kubernetes-io-is-default-class}

例子：`storageclass.kubernetes.io/is-default-class=true`

用於：StorageClass

當單個 StorageClass 資源將此註解設定為 `"true"` 時，新的未指定儲存類的 PersistentVolumeClaim
資源將被設定為此預設類。

<!--
### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the "external" cloud provider, it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.
-->
### alpha.kubernetes.io/provided-node-ip {#alpha-kubernetes-io-provided-node-ip}

例子：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用於：Node

kubelet 可以在 Node 上設定此註解來表示其配置的 IPv4 地址。

當使用“外部”雲驅動啟動時，kubelet 會在 Node 上設定此註解以表示從命令列標誌 ( `--node-ip` ) 設定的 IP 地址。
雲控制器管理器透過雲驅動驗證此 IP 是否有效。

<!--
### batch.kubernetes.io/job-completion-index

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index {#batch-kubernetes-io-job-completion-index}

例子：`batch.kubernetes.io/job-completion-index: "3"`

用於：Pod

kube-controller-manager 中的 Job 控制器為使用 Indexed
[完成模式](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)建立的 Pod
設定此註解。

<!--
### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod. For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag will use this default container.
-->
### kubectl.kubernetes.io/default-container {#kubectl-kubernetes-io-default-container}

例子：`kubectl.kubernetes.io/default-container: "front-end-app"`

此註解的值是此 Pod 的預設容器名稱。例如，未指定 `-c` 或 `--container` 標誌時執行
`kubectl logs` 或 `kubectl exec` 命令將使用此預設容器。

<!--
### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

In Kubernetes clusters v1.22 (or later), the Endpoints controller adds this annotation to an Endpoints resource if it has more than 1000 endpoints. The annotation indicates that the Endpoints resource is over capacity and the number of endpoints has been truncated to 1000.
-->
### endpoints.kubernetes.io/over-capacity {#endpoints-kubernetes-io-over-capacity}

例子：`endpoints.kubernetes.io/over-capacity:truncated`

用於：Endpoints

在 Kubernetes 叢集 v1.22（或更高版本）中，如果 Endpoints 資源超過 1000 個，Endpoints
控制器會將此註解新增到 Endpoints 資源。
註解表示 Endpoints 資源已超出容量，並且已將 Endpoints 數截斷為 1000。

<!--
### batch.kubernetes.io/job-tracking

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job indicates that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
You should **not** manually add or remove this annotation.
-->
### batch.kubernetes.io/job-tracking {#batch-kubernetes-io-job-tracking}

例子：`batch.kubernetes.io/job-tracking: ""`

用於：Job

Job 上存在此註解表明控制平面正在[使用 Finalizer 追蹤 Job](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
你 **不** 可以手動新增或刪除此註解。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Used on: Nodes

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.

**The taints listed below are always used on Nodes**
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

用於：Node

此註解需要啟用 [NodePreferAvoidPods 排程外掛](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)。
該外掛自 Kubernetes 1.22 起已被棄用。
請改用[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

**下面列出的汙點總是在 Node 上使用**

<!--
### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready:NoExecute`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.

### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable:NoExecute`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/not-ready {#node-kubernetes-io-not-ready}

例子：`node.kubernetes.io/not-ready:NoExecute`

Node 控制器透過監控 Node 的健康狀況來檢測 Node 是否準備就緒，並相應地新增或刪除此汙點。

### node.kubernetes.io/unreachable {#node-kubernetes-io-unreachable}

例子：`node.kubernetes.io/unreachable:NoExecute`

Node 控制器將此汙點新增到對應[節點狀況](/zh-cn/docs/concepts/architecture/nodes/#condition) `Ready`
為 `Unknown` 的 Node 上。

<!--
### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable:NoSchedule`

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable {#node-kubernetes-io-unschedulable}

例子：`node.kubernetes.io/unschedulable:NoSchedule`

在初始化 Node 期間，為避免競爭條件，此汙點將被新增到 Node 上。

<!--
### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure:NoSchedule`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/memory-pressure {#node-kubernetes-io-memory-pressure}

例子：`node.kubernetes.io/memory-pressure:NoSchedule`

kubelet 根據在 Node 上觀察到的 `memory.available` 和 `allocatableMemory.available` 檢測記憶體壓力。
然後將觀察到的值與可以在 kubelet 上設定的相應閾值進行比較，以確定是否應新增/刪除 Node 狀況和汙點。

<!--
### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure:NoSchedule`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/disk-pressure {#node-kubernetes-io-disk-pressure}

例子：`node.kubernetes.io/disk-pressure:NoSchedule`

kubelet 根據在 Node 上觀察到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available` 和 `nodefs.inodesFree`（僅限 Linux ）檢測磁碟壓力。
然後將觀察到的值與可以在 kubelet 上設定的相應閾值進行比較，以確定是否應新增/刪除 Node 狀況和汙點。

<!--
### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable:NoSchedule`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
### node.kubernetes.io/network-unavailable {#node-kubernetes-io-network-unavailable}

例子：`node.kubernetes.io/network-unavailable:NoSchedule`

當使用的雲驅動指示需要額外的網路配置時，此註解最初由 kubelet 設定。
只有雲上的路由被正確地配置了，此汙點才會被雲驅動移除

<!--
### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure:NoSchedule`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
### node.kubernetes.io/pid-pressure {#node-kubernetes-io-pid-pressure}

例子：`node.kubernetes.io/pid-pressure:NoSchedule`

kubelet 檢查 `/proc/sys/kernel/pid_max` 大小的 D 值和 Kubernetes 在 Node 上消耗的 PID，
以獲取可用 PID 數量，並將其作為 `pid.available` 指標值。
然後該指標與在 kubelet 上設定的相應閾值進行比較，以確定是否應該新增/刪除 Node 狀況和汙點。

### node.kubernetes.io/out-of-service
<!--
Example: `node.kubernetes.io/out-of-service:NoExecute`
A user can manually add the taint to a Node marking it out-of-service. If the `NodeOutOfServiceVolumeDetach` 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled on
`kube-controller-manager`, and a Node is marked out-of-service with this taint, the pods on the node will be forcefully deleted if there are no matching tolerations on it and volume detach operations for the pods terminating on the node will happen immediately. This allows the Pods on the out-of-service node to recover quickly on a different node.
-->
例子：`node.kubernetes.io/out-of-service:NoExecute`

使用者可以手動將汙點新增到節點，將其標記為停止服務。
如果 `kube-controller-manager` 上啟用了 `NodeOutOfServiceVolumeDetach`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
並且一個節點被這個汙點標記為停止服務，如果節點上的 Pod 沒有對應的容忍度，
這類 Pod 將被強制刪除，並且，針對在節點上被終止 Pod 的卷分離操作將被立即執行。

{{< caution >}}
<!--
Refer to
[Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
-->
有關何時以及如何使用此汙點的更多詳細資訊，請參閱[非正常節點關閉](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。
{{< /caution >}}

<!--
### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
### node.cloudprovider.kubernetes.io/uninitialized {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

在使用“外部”雲驅動啟動 kubelet 時，在 Node 上設定此汙點以將其標記為不可用，直到來自
cloud-controller-manager 的控制器初始化此 Node，然後移除汙點。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

如果 Node 處於雲驅動所指定的關閉狀態，則 Node 會相應地被設定汙點，對應的汙點和效果為
`node.cloudprovider.kubernetes.io/shutdown` 和 `NoSchedule`。

<!--
### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `enforce` label _prohibits_ the creation of any Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce {#pod-security-kubernetes-io-enforce}

例子：`pod-security.kubernetes.io/enforce: baseline`

用於：Namespace

值**必須**是 `privileged`、`baseline` 或 `restricted` 之一，它們對應於
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards) 級別。
特別地，`enforce` 標籤 **禁止** 在帶標籤的 Namespace 中建立任何不符合指示級別要求的 Pod。

請請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards) 
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce-version {#pod-security-kubernetes-io-enforce-version}

例子：`pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

用於：Namespace

值**必須**是 `latest` 或格式為 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `audit` label does not prevent the creation of a Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level, but adds an audit annotation to that Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit {#pod-security-kubernetes-io-audit}

例子：`pod-security.kubernetes.io/audit: baseline`

用於：Namespace

值**必須**是與 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards) 級別相對應的
`privileged`、`baseline` 或 `restricted` 之一。
具體來說，`audit` 標籤不會阻止在帶標籤的 Namespace 中建立不符合指示級別要求的 Pod，
但會向該 Pod 新增審計註解。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards) 
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit-version {#pod-security-kubernetes-io-audit-version}

例子：`pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

用於：Namespace

值**必須**是 `latest` 或格式為 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的  [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `warn` label does not prevent the creation of a Pod in the labeled Namespace which does not meet the 
requirements outlined in the indicated level, but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain Pod templates,
such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn {#pod-security-kubernetes-io-warn}

例子：`pod-security.kubernetes.io/warn: baseline`

用於：Namespace

值**必須**是與 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)級別相對應的
`privileged`、`baseline` 或 `restricted` 之一。特別地，
`warn` 標籤不會阻止在帶標籤的 Namespace 中建立不符合指示級別概述要求的 Pod，但會在這樣做後向使用者返回警告。
請注意，在建立或更新包含 Pod 模板的物件時也會顯示警告，例如 Deployment、Jobs、StatefulSets 等。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod. Note that warnings are also displayed when creating
or updating objects that contain Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn-version {#pod-security-kubernetes-io-warn-version}

例子：`pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

用於：Namespace

值**必須**是 `latest` 或格式為 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解決定了在驗證提交的 Pod 時要應用的 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。
請注意，在建立或更新包含 Pod 模板的物件時也會顯示警告，
例如 Deployment、Jobs、StatefulSets 等。

請參閱[在名字空間級別實施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)瞭解更多資訊。

<!--
### seccomp.security.alpha.kubernetes.io/pod (deprecated) {#seccomp-security-alpha-kubernetes-io-pod}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
To specify security settings for a Pod, include the `securityContext` field in the Pod specification.
The [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) field within a Pod's `.spec` defines pod-level security attributes.
When you [specify the security context for a Pod](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
the settings you specify apply to all containers in that Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (已棄用) {#seccomp-security-alpha-kubernetes-io-pod}

此註解自 Kubernetes v1.19 起已被棄用，將在 v1.25 中失效。
要為 Pod 指定安全設定，請在 Pod 規範中包含 `securityContext` 欄位。
Pod 的 `.spec` 中的 [`securityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
欄位定義了 Pod 級別的安全屬性。
你[為 Pod 設定安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) 時，
你所給出的設定適用於該 Pod 中的所有容器。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] {#container-seccomp-security-alpha-kubernetes-io}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
The tutorial [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) takes
you through the steps you follow to apply a seccomp profile to a Pod or to one of
its containers. That tutorial covers the supported mechanism for configuring seccomp in Kubernetes,
based on setting `securityContext` within the Pod's `.spec`.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME] {#container-seccomp-security-alpha-kubernetes-io}

此註解自 Kubernetes v1.19 起已被棄用，將在 v1.25 中失效。
教程[使用 seccomp 限制容器的系統呼叫](/zh-cn/docs/tutorials/security/seccomp/)將引導你完成將
seccomp 配置檔案應用於 Pod 或其容器的步驟。
該教程介紹了在 Kubernetes 中配置 seccomp 的支援機制，基於在 Pod 的 `.spec` 中設定 `securityContext`。

### snapshot.storage.kubernetes.io/allowVolumeModeChange
<!--
Example: `snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`
Used on: VolumeSnapshotContent
-->
例子：`snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`

用於：VolumeSnapshotContent

<!--
Value can either be `true` or `false`.
This determines whether a user can modify the mode of the source volume when a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} is being created from a VolumeSnapshot.
Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode) and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/) for more information.
-->
值可以是 `true` 或者 `false`。
這決定了當從 VolumeSnapshot 建立 {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
時，使用者是否可以修改源卷的模式。
更多資訊請參閱[轉換快照的卷模式](/zh-cn/docs/concepts/storage/volume-snapshots/#convert-volume-mode)和
[Kubernetes CSI 開發者文件](https://kubernetes-csi.github.io/docs/)。

<!--
## Annotations used for audit

- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

See more details on the [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) page.
-->
## 用於審計的註解    {#annonations-used-for-audit}

- [`authorization.k8s.io/decision`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

在[審計註解](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/)頁面上檢視更多詳細資訊。

## kubeadm

### kubeadm.alpha.kubernetes.io/cri-socket

<!--
Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`
Used on: Node
-->
例子：`kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

用於：Node

<!--
Annotation that kubeadm uses to preserve the CRI socket information given to kubeadm at `init`/`join` time for later use.
kubeadm annotates the Node object with this information. The annotation remains "alpha", since ideally this should be a field in KubeletConfiguration instead.
-->
kubeadm 用來儲存 `init`/`join` 時提供給 kubeadm 以後使用的 CRI 套接字資訊的註解。
kubeadm 使用此資訊為 Node 物件設定註解。
此註解仍然是 “alpha” 階段，因為理論上這應該是 KubeletConfiguration 中的一個欄位。

### kubeadm.kubernetes.io/etcd.advertise-client-urls

<!--
Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`
Used on: Pod
-->
例子：`kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

用於：Pod

<!--
Annotation that kubeadm places on locally managed etcd pods to keep track of a list of URLs where etcd clients should connect to. This is used mainly for etcd cluster health check purposes.
-->
kubeadm 為本地管理的 etcd Pod 設定的註解，用來跟蹤 etcd 客戶端應連線到的 URL 列表。
這主要用於 etcd 叢集健康檢查目的。

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

<!--
Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https//172.17.0.18:6443`
Used on: Pod
-->
例子：`kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https//172.17.0.18:6443`

用於：Pod

<!--
Annotation that kubeadm places on locally managed kube-apiserver pods to keep track of the exposed advertise address/port endpoint for that API server instance.
-->
kubeadm 為本地管理的 kube-apiserver Pod 設定的註解，用以跟蹤該 API 伺服器例項的公開宣告地址/埠端點。

### kubeadm.kubernetes.io/component-config.hash

<!--
Used on: ConfigMap
Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`
-->
例子：`kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

用於：ConfigMap

<!--
Annotation that kubeadm places on ConfigMaps that it manages for configuring components. It contains a hash (SHA-256) used to determine if the user has applied settings different from the kubeadm defaults for a particular component.
-->
kubeadm 為它所管理的 ConfigMaps 設定的註解，用於配置元件。它包含一個雜湊（SHA-256）值，
用於確定使用者是否應用了不同於特定元件的 kubeadm 預設設定的設定。

### node-role.kubernetes.io/control-plane

<!--
Used on: Node

Label that kubeadm applies on the control plane nodes that it manages.
-->
用於：Node

kubeadm 在其管理的控制平面節點上應用的標籤。

### node-role.kubernetes.io/control-plane

<!--
Used on: Node

Example: `node-role.kubernetes.io/control-plane:NoSchedule`
-->
例子：`node-role.kubernetes.io/control-plane:NoSchedule`

用於：Node

<!--
Taint that kubeadm applies on control plane nodes to allow only critical workloads to schedule on them.
-->
kubeadm 應用在控制平面節點上的汙點，僅允許在其上排程關鍵工作負載。

### node-role.kubernetes.io/master

<!--
Used on: Node

Example: `node-role.kubernetes.io/master:NoSchedule`
-->
例子：`node-role.kubernetes.io/master:NoSchedule`

用於：Node

<!--
Taint that kubeadm applies on control plane nodes to allow only critical workloads to schedule on them.
Starting in v1.20, this taint is deprecated in favor of `node-role.kubernetes.io/control-plane` and will be removed in v1.25.
-->
kubeadm 應用在控制平面節點上的汙點，僅允許在其上排程關鍵工作負載。
{{< note >}}
從 v1.20 開始，此汙點已棄用，並將在 v1.25 中將其刪除，取而代之的是 `node-role.kubernetes.io/control-plane`。
{{< /note >}}