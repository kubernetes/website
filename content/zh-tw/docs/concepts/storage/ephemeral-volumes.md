---
title: 臨時卷
content_type: concept
weight: 30
---
<!--
reviewers:
- jsafrane
- saad-ali
- msau42
- xing-yang
- pohly
title: Ephemeral Volumes
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
This document describes _ephemeral volumes_ in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) is suggested, in
particular PersistentVolumeClaim and PersistentVolume.
-->
本文件描述 Kubernetes 中的 _臨時卷（Ephemeral Volume）_。
建議先了解[卷](/zh-cn/docs/concepts/storage/volumes/)，特別是 PersistentVolumeClaim 和 PersistentVolume。

<!-- body -->
<!--
Some application need additional storage but don't care whether that
data is stored persistently across restarts. For example, caching
services are often limited by memory size and can move infrequently
used data into storage that is slower than memory with little impact
on overall performance.
-->
有些應用程式需要額外的儲存，但並不關心資料在重啟後仍然可用。
例如，快取服務經常受限於記憶體大小，將不常用的資料轉移到比記憶體慢、但對總體效能的影響很小的儲存中。

<!--
Other applications expect some read-only input data to be present in
files, like configuration data or secret keys.
-->
另有些應用程式需要以檔案形式注入的只讀資料，比如配置資料或金鑰。

<!--
_Ephemeral volumes_ are designed for these use cases. Because volumes
follow the Pod's lifetime and get created and deleted along with the
Pod, Pods can be stopped and restarted without being limited to where
some persistent volume is available.
-->
_臨時卷_ 就是為此類用例設計的。因為卷會遵從 Pod 的生命週期，與 Pod 一起建立和刪除，
所以停止和重新啟動 Pod 時，不會受持久卷在何處可用的限制。

<!--
Ephemeral volumes are specified _inline_ in the Pod spec, which
simplifies application deployment and management.
-->
臨時卷在 Pod 規約中以 _內聯_ 方式定義，這簡化了應用程式的部署和管理。

<!--
### Types of ephemeral volumes
-->
### 臨時卷的型別 {#types-of-ephemeral-volumes}

<!--
Kubernetes supports several different kinds of ephemeral volumes for
different purposes:
- [emptyDir](/docs/concepts/storage/volumes/#emptydir): empty at Pod startup,
  with storage coming locally from the kubelet base directory (usually
  the root disk) or RAM
- [configMap](/docs/concepts/storage/volumes/#configmap),
  [downwardAPI](/docs/concepts/storage/volumes/#downwardapi),
  [secret](/docs/concepts/storage/volumes/#secret): inject different
  kinds of Kubernetes data into a Pod
- [CSI ephemeral volumes](#csi-ephemeral-volumes):
  similar to the previous volume kinds, but provided by special
  [CSI drivers](https://github.com/container-storage-interface/spec/blob/master/spec.md)
  which specifically [support this feature](https://kubernetes-csi.github.io/docs/drivers.html)
- [generic ephemeral volumes](#generic-ephemeral-volumes), which
  can be provided by all storage drivers that also support persistent volumes
-->
Kubernetes 為了不同的目的，支援幾種不同型別的臨時卷：
- [emptyDir](/zh-cn/docs/concepts/storage/volumes/#emptydir)：
  Pod 啟動時為空，儲存空間來自本地的 kubelet 根目錄（通常是根磁碟）或記憶體
- [configMap](/zh-cn/docs/concepts/storage/volumes/#configmap)、
  [downwardAPI](/zh-cn/docs/concepts/storage/volumes/#downwardapi)、
  [secret](/zh-cn/docs/concepts/storage/volumes/#secret)：
  將不同型別的 Kubernetes 資料注入到 Pod 中
- [CSI 臨時卷](/zh-cn/docs/concepts/storage/volumes/#csi-ephemeral-volumes)：
  類似於前面的卷型別，但由專門[支援此特性](https://kubernetes-csi.github.io/docs/drivers.html)
  的指定
  [CSI 驅動程式](https://github.com/container-storage-interface/spec/blob/master/spec.md)提供
- [通用臨時卷](#generic-ephemeral-volumes)：
  它可以由所有支援持久卷的儲存驅動程式提供

<!--
`emptyDir`, `configMap`, `downwardAPI`, `secret` are provided as
[local ephemeral
storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
They are managed by kubelet on each node.

CSI ephemeral volumes *must* be provided by third-party CSI storage
drivers.
-->
`emptyDir`、`configMap`、`downwardAPI`、`secret` 是作為
[本地臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)
提供的。它們由各個節點上的 kubelet 管理。

CSI 臨時卷 *必須* 由第三方 CSI 儲存驅動程式提供。

<!--
Generic ephemeral volumes *can* be provided by third-party CSI storage
drivers, but also by any other storage driver that supports dynamic
provisioning. Some CSI drivers are written specifically for CSI
ephemeral volumes and do not support dynamic provisioning: those then
cannot be used for generic ephemeral volumes.
-->
通用臨時卷 *可以* 由第三方 CSI 儲存驅動程式提供，也可以由支援動態配置的任何其他儲存驅動程式提供。
一些專門為 CSI 臨時卷編寫的 CSI 驅動程式，不支援動態供應：因此這些驅動程式不能用於通用臨時卷。

<!--
The advantage of using third-party drivers is that they can offer
functionality that Kubernetes itself does not support, for example
storage with different performance characteristics than the disk that
is managed by kubelet, or injecting different data.
-->
使用第三方驅動程式的優勢在於，它們可以提供 Kubernetes 本身不支援的功能，
例如，與 kubelet 管理的磁碟具有不同執行特徵的儲存，或者用來注入不同的資料

<!--
### CSI ephemeral volumes
-->
### CSI 臨時卷 {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
This feature requires the `CSIInlineVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled. It
is enabled by default starting with Kubernetes 1.16.

CSI ephemeral volumes are only supported by a subset of CSI drivers.
The Kubernetes CSI [Drivers list](https://kubernetes-csi.github.io/docs/drivers.html)
shows which drivers support ephemeral volumes.
-->

該特性需要啟用引數 `CSIInlineVolume`
[特性門控（feature gate）](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
該引數從 Kubernetes 1.16 開始預設啟用。

{{< note >}}
只有一部分 CSI 驅動程式支援 CSI 臨時卷。Kubernetes CSI
[驅動程式列表](https://kubernetes-csi.github.io/docs/drivers.html)
顯示了支援臨時卷的驅動程式。
{{< /note >}}

<!--
Conceptually, CSI ephemeral volumes are similar to `configMap`,
`downwardAPI` and `secret` volume types: the storage is managed locally on each
 node and is created together with other local resources after a Pod has been
scheduled onto a node. Kubernetes has no concept of rescheduling Pods
anymore at this stage. Volume creation has to be unlikely to fail,
otherwise Pod startup gets stuck. In particular, [storage capacity
aware Pod scheduling](/docs/concepts/storage/storage-capacity/) is *not*
supported for these volumes. They are currently also not covered by
the storage resource usage limits of a Pod, because that is something
that kubelet can only enforce for storage that it manages itself.


Here's an example manifest for a Pod that uses CSI ephemeral storage:
-->
從概念上講，CSI 臨時卷類似於 `configMap`、`downwardAPI` 和 `secret` 型別的卷：
其儲存在每個節點本地管理，並在將 Pod 排程到節點後與其他本地資源一起建立。
在這個階段，Kubernetes 沒有重新排程 Pods 的概念。卷建立不太可能失敗，否則 Pod 啟動將會受阻。
特別是，這些卷 **不** 支援[感知儲存容量的 Pod 排程](/zh-cn/docs/concepts/storage/storage-capacity/)。
它們目前也沒包括在 Pod 的儲存資源使用限制中，因為 kubelet 只能對它自己管理的儲存強制執行。

下面是使用 CSI 臨時儲存的 Pod 的示例清單：

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

<!--
The `volumeAttributes` determine what volume is prepared by the
driver. These attributes are specific to each driver and not
standardized. See the documentation of each CSI driver for further
instructions.

-->

`volumeAttributes` 決定驅動程式準備什麼樣的卷。這些屬性特定於每個驅動程式，且沒有實現標準化。
有關進一步的說明，請參閱每個 CSI 驅動程式的文件。

<!--
### CSI driver restrictions

CSI ephemeral volumes allow users to provide `volumeAttributes`
directly to the CSI driver as part of the Pod spec. A CSI driver
allowing `volumeAttributes` that are typically restricted to
administrators is NOT suitable for use in an inline ephemeral volume.
For example, parameters that are normally defined in the StorageClass
should not be exposed to users through the use of inline ephemeral volumes.
-->

### CSI 驅動程式限制 {#csi-driver-restrictions}

CSI 臨時卷允許使用者直接向 CSI 驅動程式提供 `volumeAttributes`，它會作為 Pod 規約的一部分。
允許 `volumeAttributes` 的 CSI 驅動程式通常僅限於管理員使用，不適合在內聯臨時卷中使用。
例如，通常在 StorageClass 中定義的引數不應透過使用內聯臨時卷向用戶公開。

作為一個叢集管理員，你可以使用
[PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
來控制在 Pod 中可以使用哪些 CSI 驅動程式，
具體則是透過 [`allowedCSIDrivers` 欄位](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicyspec-v1beta1-policy)
指定。

<!--
Cluster administrators who need to restrict the CSI drivers that are
allowed to be used as inline volumes within a Pod spec may do so by:
- Removing `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec, which prevents the driver from being used as an inline ephemeral volume.
- Using an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) to restrict how this driver is used.
-->
如果叢集管理員需要限制 CSI 驅動程式在 Pod 規約中被作為內聯卷使用，可以這樣做：
- 從 CSIDriver 規約的 `volumeLifecycleModes` 中刪除 `Ephemeral`，這可以防止驅動程式被用作內聯臨時卷。
- 使用[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
  來限制如何使用此驅動程式。

<!--
### Generic ephemeral volumes
-->
### 通用臨時卷 {#generic-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
Generic ephemeral volumes are similar to `emptyDir` volumes in the
sense that they provide a per-pod directory for scratch data that is
usually empty after provisioning. But they may also have additional
features:

- Storage can be local or network-attached.
- Volumes can have a fixed size that Pods are not able to exceed.
- Volumes may have some initial data, depending on the driver and
  parameters.
- Typical operations on volumes are supported assuming that the driver
  supports them, including
  [snapshotting](/docs/concepts/storage/volume-snapshots/),
  [cloning](/docs/concepts/storage/volume-pvc-datasource/),
  [resizing](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims),
  and [storage capacity tracking](/docs/concepts/storage/storage-capacity/).

Example:
-->
通用臨時卷類似於 `emptyDir` 卷，因為它為每個 Pod 提供臨時資料存放目錄，
在最初製備完畢時一般為空。不過通用臨時卷也有一些額外的功能特性：

- 儲存可以是本地的，也可以是網路連線的。
- 卷可以有固定的大小，Pod 不能超量使用。
- 卷可能有一些初始資料，這取決於驅動程式和引數。
- 當驅動程式支援，捲上的典型操作將被支援，包括
  （[快照](/zh-cn/docs/concepts/storage/volume-snapshots/)、
  [克隆](/zh-cn/docs/concepts/storage/volume-pvc-datasource/)、
  [調整大小](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)和
  [儲存容量跟蹤](/zh-cn/docs/concepts/storage/storage-capacity/)）。

示例：

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/scratch"
        name: scratch-volume
      command: [ "sleep", "1000000" ]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: [ "ReadWriteOnce" ]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

<!--
### Lifecycle and PersistentVolumeClaim
-->
### 生命週期和 PersistentVolumeClaim {#lifecycle-and-persistentvolumeclaim}

<!--
The key design idea is that the
[parameters for a volume claim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)
are allowed inside a volume source of the Pod. Labels, annotations and
the whole set of fields for a PersistentVolumeClaim are supported. When such a Pod gets
created, the ephemeral volume controller then creates an actual PersistentVolumeClaim
object in the same namespace as the Pod and ensures that the PersistentVolumeClaim
gets deleted when the Pod gets deleted.
-->
關鍵的設計思想是在 Pod 的捲來源中允許使用
[卷申領的引數](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1alpha1-core)。
PersistentVolumeClaim 的標籤、註解和整套欄位集均被支援。
建立這樣一個 Pod 後，
臨時卷控制器在 Pod 所屬的名稱空間中建立一個實際的 PersistentVolumeClaim 物件，
並確保刪除 Pod 時，同步刪除 PersistentVolumeClaim。

<!--
That triggers volume binding and/or provisioning, either immediately if
the {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} uses immediate volume binding or when the Pod is
tentatively scheduled onto a node (`WaitForFirstConsumer` volume
binding mode). The latter is recommended for generic ephemeral volumes
because then the scheduler is free to choose a suitable node for
the Pod. With immediate binding, the scheduler is forced to select a node that has
access to the volume once it is available.
-->
如上設定將觸發卷的繫結與/或準備操作，相應動作或者在
{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
使用即時卷繫結時立即執行，
或者當 Pod 被暫時性排程到某節點時執行 (`WaitForFirstConsumer` 卷繫結模式)。
對於常見的臨時卷，建議採用後者，這樣排程器就可以自由地為 Pod 選擇合適的節點。
對於即時繫結，排程器則必須選出一個節點，使得在卷可用時，能立即訪問該卷。

<!--
In terms of [resource ownership](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents),
a Pod that has generic ephemeral storage is the owner of the PersistentVolumeClaim(s)
that provide that ephemeral storage. When the Pod is deleted,
the Kubernetes garbage collector deletes the PVC, which then usually
triggers deletion of the volume because the default reclaim policy of
storage classes is to delete volumes. You can create quasi-ephemeral local storage
using a StorageClass with a reclaim policy of `retain`: the storage outlives the Pod,
and in this case you need to ensure that volume clean up happens separately.
-->
就[資源所有權](/zh-cn/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)而言，
擁有通用臨時儲存的 Pod 是提供臨時儲存 (ephemeral storage) 的 PersistentVolumeClaim 的所有者。
當 Pod 被刪除時，Kubernetes 垃圾收集器會刪除 PVC，
然後 PVC 通常會觸發卷的刪除，因為儲存類的預設回收策略是刪除卷。
你可以使用帶有 `retain` 回收策略的 StorageClass 建立準臨時 (quasi-ephemeral) 本地儲存：
該儲存比 Pod 壽命長，在這種情況下，你需要確保單獨進行卷清理。

<!--
While these PVCs exist, they can be used like any other PVC. In
particular, they can be referenced as data source in volume cloning or
snapshotting. The PVC object also holds the current status of the
volume.
-->
當這些 PVC 存在時，它們可以像其他 PVC 一樣使用。
特別是，它們可以被引用作為批次克隆或快照的資料來源。
PVC物件還保持著卷的當前狀態。

<!--
### PersistentVolumeClaim naming
-->
### PersistentVolumeClaim 的命名 {#persistentvolumeclaim-naming}

<!--
Naming of the automatically created PVCs is deterministic: the name is
a combination of Pod name and volume name, with a hyphen (`-`) in the
middle. In the example above, the PVC name will be
`my-app-scratch-volume`.  This deterministic naming makes it easier to
interact with the PVC because one does not have to search for it once
the Pod name and volume name are known.
-->
自動建立的 PVCs 的命名是確定的：此名稱是 Pod 名稱和卷名稱的組合，中間由連字元(`-`)連線。
在上面的示例中，PVC 將命名為 `my-app-scratch-volume` 。
這種確定性命名方式使得與 PVC 互動變得更容易，因為一旦知道 Pod 名稱和卷名，就不必搜尋它。

<!--
The deterministic naming also introduces a potential conflict between different
Pods (a Pod "pod-a" with volume "scratch" and another Pod with name
"pod" and volume "a-scratch" both end up with the same PVC name
"pod-a-scratch") and between Pods and manually created PVCs.
-->
這種確定性命名方式也引入了潛在的衝突，
比如在不同的 Pod 之間（名為 “Pod-a” 的 Pod 掛載名為 "scratch" 的卷，
和名為 "pod" 的 Pod 掛載名為 “a-scratch” 的卷，這兩者均會生成名為
"pod-a-scratch" 的PVC），或者在 Pod 和手工建立的 PVC 之間。

<!--
Such conflicts are detected: a PVC is only used for an ephemeral
volume if it was created for the Pod. This check is based on the
ownership relationship. An existing PVC is not overwritten or
modified. But this does not resolve the conflict because without the
right PVC, the Pod cannot start.
-->
以下衝突會被檢測到：如果 PVC 是為 Pod 建立的，那麼它只用於臨時卷。
此檢測基於所有權關係。現有的 PVC 不會被覆蓋或修改。
但這並不能解決衝突，因為如果沒有正確的 PVC，Pod 就無法啟動。

<!--
Take care when naming Pods and volumes inside the
same namespace, so that these conflicts can't occur.
-->
{{< caution >}}
當命名 Pods 和卷出現在同一個名稱空間中時，要小心，以防止發生此類衝突。
{{< /caution >}}

<!--
### Security
-->
### 安全 {#security}

<!--
Enabling the GenericEphemeralVolume feature allows users to create
PVCs indirectly if they can create Pods, even if they do not have
permission to create PVCs directly. Cluster administrators must be
aware of this. If this does not fit their security model, they should
use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) that rejects objects like Pods that have a generic ephemeral volume.
-->
啟用 GenericEphemeralVolume 特性會導致那些沒有 PVCs 建立許可權的使用者，
在建立 Pods 時，被允許間接的建立 PVCs。
叢集管理員必須意識到這一點。
如果這不符合他們的安全模型，他們應該使用一個[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
拒絕包含通用臨時卷的 Pods。

<!--
The normal [namespace quota for PVCs](/docs/concepts/policy/resource-quotas/#storage-resource-quota) still applies, so
even if users are allowed to use this new mechanism, they cannot use
it to circumvent other policies.
-->
[為 PVC 卷所設定的逐名字空間的配額](/zh-cn/docs/concepts/policy/resource-quotas/#storage-resource-quota)
仍然有效，因此即使允許使用者使用這種新機制，他們也不能使用它來規避其他策略。

## {{% heading "whatsnext" %}}

<!--
### Ephemeral volumes managed by kubelet

See [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
-->
### kubelet 管理的臨時卷 {#ephemeral-volumes-managed-by-kubelet}

參閱[本地臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)。

<!--
### CSI ephemeral volumes

- For more information on the design, see the [Ephemeral Inline CSI
  volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- For more information on further development of this feature, see the [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596).
-->
### CSI 臨時卷 {#csi-ephemeral-volumes}

- 有關設計的更多資訊，參閱
  [Ephemeral Inline CSI volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md)。
- 本特性下一步開發的更多資訊，參閱
  [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596)。

<!--
### Generic ephemeral volumes

- For more information on the design, see the
[Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).
-->
### 通用臨時卷 {#generic-ephemeral-volumes}

- 有關設計的更多資訊，參閱
  [Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md)。
