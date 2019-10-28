---
title: 动态卷供应
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

<!--
Dynamic volume provisioning allows storage volumes to be created on-demand.
Without dynamic provisioning, cluster administrators have to manually make
calls to their cloud or storage provider to create new storage volumes, and
then create [`PersistentVolume` objects](/docs/concepts/storage/persistent-volumes/)
to represent them in Kubernetes. The dynamic provisioning feature eliminates
the need for cluster administrators to pre-provision storage. Instead, it
automatically provisions storage when it is requested by users.
-->
动态卷供应允许按需创建存储卷。
如果没有动态供应，集群管理员必须手动地联系他们的云或存储提供商来创建新的存储卷，
然后在 Kubernetes 集群创建 [`PersistentVolume` 对象](/docs/concepts/storage/persistent-volumes/)来表示这些卷。
动态供应功能消除了集群管理员预先配置存储的需要。 相反，它在用户请求时自动供应存储。

{{% /capture %}}

{{% capture body %}}

<!--
## Background
-->
## 背景

<!--
The implementation of dynamic volume provisioning is based on the API object `StorageClass`
from the API group `storage.k8s.io`. A cluster administrator can define as many
`StorageClass` objects as needed, each specifying a *volume plugin* (aka
*provisioner*) that provisions a volume and the set of parameters to pass to
that provisioner when provisioning.
-->
动态卷供应的实现基于 `storage.k8s.io` API 组中的 `StorageClass` API 对象。
集群管理员可以根据需要定义多个 `StorageClass` 对象，每个对象指定一个*卷插件*（又名 *provisioner*），
卷插件向卷供应商提供在创建卷时需要的数据卷信息及相关参数。

<!--
A cluster administrator can define and expose multiple flavors of storage (from
the same or different storage systems) within a cluster, each with a custom set
of parameters. This design also ensures that end users don’t have to worry
about the complexity and nuances of how storage is provisioned, but still
have the ability to select from multiple storage options.
-->
集群管理员可以在集群中定义和公开多种存储（来自相同或不同的存储系统），每种都具有自定义参数集。
该设计也确保终端用户不必担心存储供应的复杂性和细微差别，但仍然能够从多个存储选项中进行选择。

<!--
More information on storage classes can be found
[here](/docs/concepts/storage/storage-classes/).
-->
点击[这里](/docs/concepts/storage/storage-classes/)查阅有关存储类的更多信息。

<!--
## Enabling Dynamic Provisioning
-->
## 启用动态卷供应

<!--
To enable dynamic provisioning, a cluster administrator needs to pre-create
one or more StorageClass objects for users.
StorageClass objects define which provisioner should be used and what parameters
should be passed to that provisioner when dynamic provisioning is invoked.
The following manifest creates a storage class "slow" which provisions standard
disk-like persistent disks.
-->
要启用动态供应功能，集群管理员需要为用户预先创建一个或多个 `StorageClass` 对象。
`StorageClass` 对象定义在进行动态卷供应时应使用哪个卷供应商，以及应该将哪些参数传递给该供应商。
以下清单创建了一个存储类 "slow"，它提供类似标准磁盘的永久磁盘。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

<!--
The following manifest creates a storage class "fast" which provisions
SSD-like persistent disks.
-->
以下清单创建了一个 "fast" 存储类，它提供类似 SSD 的永久磁盘。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

<!--
## Using Dynamic Provisioning
-->
## 使用动态卷供应

<!--
Users request dynamically provisioned storage by including a storage class in
their `PersistentVolumeClaim`. Before Kubernetes v1.6, this was done via the
`volume.beta.kubernetes.io/storage-class` annotation. However, this annotation
is deprecated since v1.6. Users now can and should instead use the
`storageClassName` field of the `PersistentVolumeClaim` object. The value of
this field must match the name of a `StorageClass` configured by the
administrator (see [below](#enabling-dynamic-provisioning)).
-->
用户通过在 `PersistentVolumeClaim` 中包含存储类来请求动态供应的存储。
在 Kubernetes v1.6 之前，这通过 `volume.beta.kubernetes.io/storage-class` 注解实现。然而，这个注解自 v1.6 起就不被推荐使用了。
用户现在能够而且应该使用 `PersistentVolumeClaim` 对象的 `storageClassName` 字段。
这个字段的值必须能够匹配到集群管理员配置的 `StorageClass` 名称（见[下面](#enabling-dynamic-provisioning)）。

<!--
To select the “fast” storage class, for example, a user would create the
following `PersistentVolumeClaim`:
-->
例如，要选择 "fast" 存储类，用户将创建如下的 `PersistentVolumeClaim`：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

<!--
This claim results in an SSD-like Persistent Disk being automatically
provisioned. When the claim is deleted, the volume is destroyed.
-->
该声明会自动供应一块类似 SSD 的永久磁盘。
在删除该声明后，这个卷也会被销毁。

<!--
## Defaulting Behavior
-->
## 默认行为

<!--
Dynamic provisioning can be enabled on a cluster such that all claims are
dynamically provisioned if no storage class is specified. A cluster administrator
can enable this behavior by:
-->
可以在群集上启用动态卷供应，以便在未指定存储类的情况下动态设置所有声明。
集群管理员可以通过以下方式启用此行为：

<!--
- Marking one `StorageClass` object as *default*;
- Making sure that the [`DefaultStorageClass` admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
  is enabled on the API server.
-->
- 标记一个 `StorageClass` 为 *默认*；
- 确保 [`DefaultStorageClass` 准入控制器](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)在 API 服务端被启用。

<!--
An administrator can mark a specific `StorageClass` as default by adding the
`storageclass.kubernetes.io/is-default-class` annotation to it.
When a default `StorageClass` exists in a cluster and a user creates a
`PersistentVolumeClaim` with `storageClassName` unspecified, the
`DefaultStorageClass` admission controller automatically adds the
`storageClassName` field pointing to the default storage class.
-->
管理员可以通过向其添加 `storageclass.kubernetes.io/is-default-class` 注解来将特定的 `StorageClass` 标记为默认。
当集群中存在默认的 `StorageClass` 并且用户创建了一个未指定 `storageClassName` 的 `PersistentVolumeClaim` 时，
`DefaultStorageClass` 准入控制器会自动向其中添加指向默认存储类的 `storageClassName` 字段。

<!--
Note that there can be at most one *default* storage class on a cluster, or
a `PersistentVolumeClaim` without `storageClassName` explicitly specified cannot
be created.
-->
请注意，群集上最多只能有一个 *默认* 存储类，否则无法创建没有明确指定 `storageClassName` 的 `PersistentVolumeClaim`。

<!--
## Topology Awareness
-->
## 拓扑感知

<!--
In [Multi-Zone](/docs/setup/multiple-zones) clusters, Pods can be spread across
Zones in a Region. Single-Zone storage backends should be provisioned in the Zones where
Pods are scheduled. This can be accomplished by setting the [Volume Binding
Mode](/docs/concepts/storage/storage-classes/#volume-binding-mode).
-->
在[多区域](/docs/setup/multiple-zones)集群中，Pod 可以被分散到多个区域。
单区域存储后端应该被供应到 Pod 被调度到的区域。
这可以通过设置[卷绑定模式](/docs/concepts/storage/storage-classes/#volume-binding-mode)来实现。

{{% /capture %}}
