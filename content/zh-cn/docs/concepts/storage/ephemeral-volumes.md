---
title: 临时卷
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
本文档描述 Kubernetes 中的 **临时卷（Ephemeral Volume）**。
建议先了解[卷](/zh-cn/docs/concepts/storage/volumes/)，特别是 PersistentVolumeClaim 和 PersistentVolume。

<!-- body -->
<!--
Some applications need additional storage but don't care whether that
data is stored persistently across restarts. For example, caching
services are often limited by memory size and can move infrequently
used data into storage that is slower than memory with little impact
on overall performance.
-->
有些应用程序需要额外的存储，但并不关心数据在重启后是否仍然可用。
例如，缓存服务经常受限于内存大小，而且可以将不常用的数据转移到比内存慢的存储中，对总体性能的影响并不大。

<!--
Other applications expect some read-only input data to be present in
files, like configuration data or secret keys.
-->
另有些应用程序需要以文件形式注入的只读数据，比如配置数据或密钥。

<!--
_Ephemeral volumes_ are designed for these use cases. Because volumes
follow the Pod's lifetime and get created and deleted along with the
Pod, Pods can be stopped and restarted without being limited to where
some persistent volume is available.
-->
**临时卷** 就是为此类用例设计的。因为卷会遵从 Pod 的生命周期，与 Pod 一起创建和删除，
所以停止和重新启动 Pod 时，不会受持久卷在何处可用的限制。

<!--
Ephemeral volumes are specified _inline_ in the Pod spec, which
simplifies application deployment and management.
-->
临时卷在 Pod 规约中以 **内联** 方式定义，这简化了应用程序的部署和管理。

<!--
### Types of ephemeral volumes
-->
### 临时卷的类型 {#types-of-ephemeral-volumes}

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
  similar to the previous volume kinds, but provided by special {{< glossary_tooltip text="CSI" term_id="csi" >}} drivers
  which specifically [support this feature](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [generic ephemeral volumes](#generic-ephemeral-volumes), which
  can be provided by all storage drivers that also support persistent volumes
-->
Kubernetes 为了不同的用途，支持几种不同类型的临时卷：
- [emptyDir](/zh-cn/docs/concepts/storage/volumes/#emptydir)：
  Pod 启动时为空，存储空间来自本地的 kubelet 根目录（通常是根磁盘）或内存
- [configMap](/zh-cn/docs/concepts/storage/volumes/#configmap)、
  [downwardAPI](/zh-cn/docs/concepts/storage/volumes/#downwardapi)、
  [secret](/zh-cn/docs/concepts/storage/volumes/#secret)：
  将不同类型的 Kubernetes 数据注入到 Pod 中
- [CSI 临时卷](#csi-ephemeral-volumes)：
  类似于前面的卷类型，但由专门[支持此特性](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
  的指定 {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动程序提供
- [通用临时卷](#generic-ephemeral-volumes)：
  它可以由所有支持持久卷的存储驱动程序提供

<!--
`emptyDir`, `configMap`, `downwardAPI`, `secret` are provided as
[local ephemeral
storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
They are managed by kubelet on each node.

CSI ephemeral volumes *must* be provided by third-party CSI storage
drivers.
-->
`emptyDir`、`configMap`、`downwardAPI`、`secret` 是作为
[本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)
提供的。它们由各个节点上的 kubelet 管理。

CSI 临时卷 **必须** 由第三方 CSI 存储驱动程序提供。

<!--
Generic ephemeral volumes *can* be provided by third-party CSI storage
drivers, but also by any other storage driver that supports dynamic
provisioning. Some CSI drivers are written specifically for CSI
ephemeral volumes and do not support dynamic provisioning: those then
cannot be used for generic ephemeral volumes.
-->
通用临时卷 **可以** 由第三方 CSI 存储驱动程序提供，也可以由支持动态制备的任何其他存储驱动程序提供。
一些专门为 CSI 临时卷编写的 CSI 驱动程序，不支持动态制备：因此这些驱动程序不能用于通用临时卷。

<!--
The advantage of using third-party drivers is that they can offer
functionality that Kubernetes itself does not support, for example
storage with different performance characteristics than the disk that
is managed by kubelet, or injecting different data.
-->
使用第三方驱动程序的优势在于，它们可以提供 Kubernetes 本身不支持的功能，
例如，与 kubelet 管理的磁盘具有不同性能特征的存储，或者用来注入不同的数据。

<!--
### CSI ephemeral volumes
-->
### CSI 临时卷 {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
CSI ephemeral volumes are only supported by a subset of CSI drivers.
The Kubernetes CSI [Drivers list](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
shows which drivers support ephemeral volumes.
-->
{{< note >}}
只有一部分 CSI 驱动程序支持 CSI 临时卷。Kubernetes CSI
[驱动程序列表](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
显示了支持临时卷的驱动程序。
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
从概念上讲，CSI 临时卷类似于 `configMap`、`downwardAPI` 和 `secret` 类型的卷：
在各个本地节点管理卷的存储，并在 Pod 调度到节点后与其他本地资源一起创建。
在这个阶段，Kubernetes 没有重新调度 Pod 的概念。卷创建不太可能失败，否则 Pod 启动将会受阻。
特别是，这些卷 **不** 支持[感知存储容量的 Pod 调度](/zh-cn/docs/concepts/storage/storage-capacity/)。
它们目前也没包括在 Pod 的存储资源使用限制中，因为 kubelet 只能对它自己管理的存储强制执行。

下面是使用 CSI 临时存储的 Pod 的示例清单：

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

`volumeAttributes` 决定驱动程序准备什么样的卷。每个驱动程序的属性不尽相同，没有实现标准化。
有关进一步的说明，请参阅每个 CSI 驱动程序的文档。

<!--
### CSI driver restrictions

CSI ephemeral volumes allow users to provide `volumeAttributes`
directly to the CSI driver as part of the Pod spec. A CSI driver
allowing `volumeAttributes` that are typically restricted to
administrators is NOT suitable for use in an inline ephemeral volume.
For example, parameters that are normally defined in the StorageClass
should not be exposed to users through the use of inline ephemeral volumes.
-->

### CSI 驱动程序限制 {#csi-driver-restrictions}

CSI 临时卷允许用户直接向 CSI 驱动程序提供 `volumeAttributes`，它会作为 Pod 规约的一部分。
有些 `volumeAttributes` 通常仅限于管理员使用，允许这一类 `volumeAttributes` 的 CSI 驱动程序不适合在内联临时卷中使用。
例如，通常在 StorageClass 中定义的参数不应通过使用内联临时卷向用户公开。

<!--
Cluster administrators who need to restrict the CSI drivers that are
allowed to be used as inline volumes within a Pod spec may do so by:

- Removing `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec, which prevents the
  driver from being used as an inline ephemeral volume.
- Using an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  to restrict how this driver is used.
-->
如果集群管理员需要限制在 Pod 规约中作为内联卷使用的 CSI 驱动程序，可以这样做：

- 从 CSIDriver 规约的 `volumeLifecycleModes` 中删除 `Ephemeral`，这可以防止驱动程序被用作内联临时卷。
- 使用[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
  来限制如何使用此驱动程序。

<!--
### Generic ephemeral volumes
-->
### 通用临时卷 {#generic-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
Generic ephemeral volumes are similar to `emptyDir` volumes in the
sense that they provide a per-pod directory for scratch data that is
usually empty after provisioning. But they may also have additional
features:
-->
通用临时卷类似于 `emptyDir` 卷，因为它为每个 Pod 提供临时数据存放目录，
在最初制备完毕时一般为空。不过通用临时卷也有一些额外的功能特性：

<!--
- Storage can be local or network-attached.
- Volumes can have a fixed size that Pods are not able to exceed.
- Volumes may have some initial data, depending on the driver and
  parameters.
-->
- 存储可以是本地的，也可以是网络连接的。
- 卷可以有固定的大小，Pod 不能超量使用。
- 卷可能有一些初始数据，这取决于驱动程序和参数。

<!--
- Typical operations on volumes are supported assuming that the driver
  supports them, including
  [snapshotting](/docs/concepts/storage/volume-snapshots/),
  [cloning](/docs/concepts/storage/volume-pvc-datasource/),
  [resizing](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims),
  and [storage capacity tracking](/docs/concepts/storage/storage-capacity/).

Example:
-->
- 支持典型的卷操作，前提是相关的驱动程序也支持该操作，包括
  [快照](/zh-cn/docs/concepts/storage/volume-snapshots/)、
  [克隆](/zh-cn/docs/concepts/storage/volume-pvc-datasource/)、
  [调整大小](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)和
  [存储容量跟踪](/zh-cn/docs/concepts/storage/storage-capacity/)）。

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
### 生命周期和 PersistentVolumeClaim {#lifecycle-and-persistentvolumeclaim}

<!--
The key design idea is that the
[parameters for a volume claim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1-core)
are allowed inside a volume source of the Pod. Labels, annotations and
the whole set of fields for a PersistentVolumeClaim are supported. When such a Pod gets
created, the ephemeral volume controller then creates an actual PersistentVolumeClaim
object in the same namespace as the Pod and ensures that the PersistentVolumeClaim
gets deleted when the Pod gets deleted.
-->
关键的设计思想是在 Pod 的卷来源中允许使用
[卷申领的参数](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1-core)。
PersistentVolumeClaim 的标签、注解和整套字段集均被支持。
创建这样一个 Pod 后，临时卷控制器在 Pod 所属的命名空间中创建一个实际的
PersistentVolumeClaim 对象，并确保删除 Pod 时，同步删除 PersistentVolumeClaim。

<!--
That triggers volume binding and/or provisioning, either immediately if
the {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} uses immediate volume binding or when the Pod is
tentatively scheduled onto a node (`WaitForFirstConsumer` volume
binding mode). The latter is recommended for generic ephemeral volumes
because then the scheduler is free to choose a suitable node for
the Pod. With immediate binding, the scheduler is forced to select a node that has
access to the volume once it is available.
-->
如上设置将触发卷的绑定与/或制备，相应动作或者在
{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
使用即时卷绑定时立即执行，或者当 Pod 被暂时性调度到某节点时执行 (`WaitForFirstConsumer` 卷绑定模式)。
对于通用的临时卷，建议采用后者，这样调度器就可以自由地为 Pod 选择合适的节点。
对于即时绑定，调度器则必须选出一个节点，使得在卷可用时，能立即访问该卷。

<!--
In terms of [resource ownership](/docs/concepts/architecture/garbage-collection/#owners-dependents),
a Pod that has generic ephemeral storage is the owner of the PersistentVolumeClaim(s)
that provide that ephemeral storage. When the Pod is deleted,
the Kubernetes garbage collector deletes the PVC, which then usually
triggers deletion of the volume because the default reclaim policy of
storage classes is to delete volumes. You can create quasi-ephemeral local storage
using a StorageClass with a reclaim policy of `retain`: the storage outlives the Pod,
and in this case you need to ensure that volume clean up happens separately.
-->
就[资源所有权](/zh-cn/docs/concepts/architecture/garbage-collection/#owners-dependents)而言，
拥有通用临时存储的 Pod 是提供临时存储 (ephemeral storage) 的 PersistentVolumeClaim 的所有者。
当 Pod 被删除时，Kubernetes 垃圾收集器会删除 PVC，
然后 PVC 通常会触发卷的删除，因为存储类的默认回收策略是删除卷。
你可以使用带有 `retain` 回收策略的 StorageClass 创建准临时 (Quasi-Ephemeral) 本地存储：
该存储比 Pod 寿命长，所以在这种情况下，你需要确保单独进行卷清理。

<!--
While these PVCs exist, they can be used like any other PVC. In
particular, they can be referenced as data source in volume cloning or
snapshotting. The PVC object also holds the current status of the
volume.
-->
当这些 PVC 存在时，它们可以像其他 PVC 一样使用。
特别是，它们可以被引用作为批量克隆或快照的数据源。
PVC 对象还保持着卷的当前状态。

<!--
### PersistentVolumeClaim naming
-->
### PersistentVolumeClaim 的命名 {#persistentvolumeclaim-naming}

<!--
Naming of the automatically created PVCs is deterministic: the name is
a combination of the Pod name and volume name, with a hyphen (`-`) in the
middle. In the example above, the PVC name will be
`my-app-scratch-volume`.  This deterministic naming makes it easier to
interact with the PVC because one does not have to search for it once
the Pod name and volume name are known.
-->
自动创建的 PVC 采取确定性的命名机制：名称是 Pod 名称和卷名称的组合，中间由连字符(`-`)连接。
在上面的示例中，PVC 将被命名为 `my-app-scratch-volume` 。
这种确定性的命名机制使得与 PVC 交互变得更容易，因为一旦知道 Pod 名称和卷名，就不必搜索它。

<!--
The deterministic naming also introduces a potential conflict between different
Pods (a Pod "pod-a" with volume "scratch" and another Pod with name
"pod" and volume "a-scratch" both end up with the same PVC name
"pod-a-scratch") and between Pods and manually created PVCs.
-->
这种命名机制也引入了潜在的冲突，不同的 Pod 之间（名为 “Pod-a” 的
Pod 挂载名为 "scratch" 的卷，和名为 "pod" 的 Pod 挂载名为 “a-scratch” 的卷，
这两者均会生成名为 "pod-a-scratch" 的 PVC），或者在 Pod 和手工创建的
PVC 之间可能出现冲突。

<!--
Such conflicts are detected: a PVC is only used for an ephemeral
volume if it was created for the Pod. This check is based on the
ownership relationship. An existing PVC is not overwritten or
modified. But this does not resolve the conflict because without the
right PVC, the Pod cannot start.
-->
这类冲突会被检测到：如果 PVC 是为 Pod 创建的，那么它只用于临时卷。
此检测基于所有权关系。现有的 PVC 不会被覆盖或修改。
但这并不能解决冲突，因为如果没有正确的 PVC，Pod 就无法启动。

{{< caution >}}
<!--
Take care when naming Pods and volumes inside the
same namespace, so that these conflicts can't occur.
-->
当同一个命名空间中命名 Pod 和卷时，要小心，以防止发生此类冲突。
{{< /caution >}}

<!--
### Security
-->
### 安全 {#security}

<!--
Using generic ephemeral volumes allows users to create PVCs indirectly
if they can create Pods, even if they do not have permission to create PVCs directly.
Cluster administrators must be aware of this. If this does not fit their security model,
they should use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
-->
只要用户有权限创建 Pod，就可以使用通用的临时卷间接地创建持久卷申领（PVCs），
即使他们没有权限直接创建 PVCs。集群管理员必须注意这一点。如果这与他们的安全模型相悖，
他们应该使用[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)。

<!--
The normal [namespace quota for PVCs](/docs/concepts/policy/resource-quotas/#storage-resource-quota)
still applies, so even if users are allowed to use this new mechanism, they cannot use
it to circumvent other policies.
-->
正常的 [PVC 的名字空间配额](/zh-cn/docs/concepts/policy/resource-quotas/#storage-resource-quota)
仍然有效，因此即使允许用户使用这种新机制，他们也不能使用它来规避其他策略。

## {{% heading "whatsnext" %}}

<!--
### Ephemeral volumes managed by kubelet

See [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
-->
### kubelet 管理的临时卷 {#ephemeral-volumes-managed-by-kubelet}

参阅[本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage)。

<!--
### CSI ephemeral volumes

- For more information on the design, see the
  [Ephemeral Inline CSI volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- For more information on further development of this feature, see the
  [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596).
-->
### CSI 临时卷 {#csi-ephemeral-volumes}

- 有关设计的更多信息，参阅
  [Ephemeral Inline CSI volumes KEP](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md)。
- 关于本特性下一步开发的更多信息，参阅
  [enhancement tracking issue #596](https://github.com/kubernetes/enhancements/issues/596)。

<!--
### Generic ephemeral volumes

- For more information on the design, see the
[Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).
-->
### 通用临时卷 {#generic-ephemeral-volumes}

- 有关设计的更多信息，参阅
  [Generic ephemeral inline volumes KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md)。
