---
title: 本地临时存储
content_type: concept
weight: 95
---
<!--
title: Local ephemeral storage 
content_type: concept
weight: 95
-->

<!--
Nodes have local ephemeral storage, backed by
locally-attached writeable devices or, sometimes, by RAM.
"Ephemeral" means that there is no long-term guarantee about durability.
-->
节点拥有本地临时存储，其底层由本地挂载的可写设备提供支持，有时也由 RAM 提供。
"临时（Ephemeral）"意味着对数据的持久性没有长期保证。

<!--
Pods use ephemeral local storage for scratch space, caching, and for logs.
The kubelet can provide scratch space to Pods using local ephemeral storage to
mount [`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="volumes" >}} into containers.
-->
Pod 使用临时本地存储作为临时数据空间、缓存和日志。
kubelet 可以使用本地临时存储为 Pod 提供临时数据空间，将
[`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir){{< glossary_tooltip term_id="volume" text="卷" >}}挂载到容器中。

<!--
The kubelet also uses this kind of storage to hold
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level),
container images, and the writable layers of running containers.
-->
kubelet 还使用这种存储来存放[节点级别的容器日志](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)、
容器镜像和运行中容器的可写层。

{{< caution >}}
<!--
If a node fails, the data in its ephemeral storage can be lost.
Your applications cannot expect any performance SLAs (disk IOPS for example)
from local ephemeral storage.
-->
如果节点发生故障，其临时存储中的数据可能会丢失。
你的应用程序不能期望从本地临时存储获得任何性能 SLA（例如磁盘 IOPS）。
{{< /caution >}}

{{< note >}}
<!--
To make the resource quota work on ephemeral-storage, two things need to be done:

* An admin sets the resource quota for ephemeral-storage in a namespace.
* A user needs to specify limits for the ephemeral-storage resource in the Pod spec.

If the user doesn't specify the ephemeral-storage resource limit in the Pod spec,
the resource quota is not enforced on ephemeral-storage.
-->
要使资源配额在 ephemeral-storage 上生效，需要做两件事：

* 管理员在某命名空间中设置 ephemeral-storage 的资源配额。
* 用户需要在 Pod 规约中为 ephemeral-storage 资源指定限制。

如果用户没有在 Pod 规约中指定 ephemeral-storage 资源限制，
则 ephemeral-storage 上的资源配额不会被强制执行。
{{< /note >}}

<!--
Kubernetes lets you track, reserve and limit the amount
of ephemeral local storage a Pod can consume.
-->
Kubernetes 允许你跟踪、预留和限制 Pod 可以消耗的本地临时存储量。

<!--
## Configurations for local ephemeral storage {#configurations}

Kubernetes supports the following ways to configure local ephemeral storage on a
node:

Single filesystem
-->
## 本地临时存储的配置 {#configurations}

Kubernetes 支持以下方式在节点上配置本地临时存储：

{{< tabs name="local_storage_configurations" >}}
{{% tab name="单个文件系统" %}}

<!--
In this configuration, you place all different kinds of ephemeral local data
(`emptyDir` volumes, writeable layers, container images, logs) into one filesystem.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
and treats these similarly to ephemeral local storage.
-->
在此配置中，你将所有不同类型的临时本地数据
（`emptyDir` 卷、可写层、容器镜像、日志）放入一个文件系统。

kubelet 还会写入[节点级别的容器日志](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)，
并将其视为与临时本地存储类似。

<!--
The kubelet writes logs to files inside its configured log directory (`/var/log`
by default); and has a base directory for other locally stored data
(`/var/lib/kubelet` by default).

Typically, both `/var/lib/kubelet` and `/var/log` are on the system root filesystem,
and the kubelet is designed with that layout in mind.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.

Runtime filesystem
-->
kubelet 将日志写入其配置的日志目录（默认为 `/var/log`）中的文件；
并有一个用于其他本地存储数据的基础目录（默认为 `/var/lib/kubelet`）。

通常，`/var/lib/kubelet` 和 `/var/log` 都位于系统根文件系统上，
kubelet 的设计就是基于这种布局考虑的。

你的节点可以拥有任意数量的其他文件系统，这些文件系统不用于 Kubernetes。

{{% /tab %}}
{{% tab name="运行时文件系统" %}}

<!--
You use one filesystem on the node for ephemeral data from running Pods, such as
logs and `emptyDir` volumes. You can also use this filesystem for other data,
such as system logs that are not related to Kubernetes; it can even be the root
filesystem.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
into the first filesystem, and treats these similarly to ephemeral local storage.
-->
你在节点上使用一个文件系统来存放运行中 Pod 的临时数据，例如日志和 `emptyDir` 卷。
你也可以将此文件系统用于其他数据，例如与 Kubernetes 无关的系统日志；它甚至可以是根文件系统。

kubelet 还将[节点级别的容器日志](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)写入第一个文件系统，
并将其视为与临时本地存储类似。

<!--
You also use a separate filesystem, backed by a different logical storage device.
In this configuration, the container runtime stores both container image layers
and writeable layers on this second filesystem. Configure this storage location
in your container runtime, not in the kubelet.

The first filesystem does not hold any image layers or writeable layers.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.

Split image filesystem
-->
你还使用一个单独的文件系统，由不同的逻辑存储设备提供支持。
在此配置中，容器运行时将容器镜像层和可写层都存储在第二个文件系统上。
请在容器运行时中配置此存储位置，而不是在 kubelet 中配置。

第一个文件系统不存放任何镜像层或可写层。

你的节点可以拥有任意数量的其他文件系统，这些文件系统不用于 Kubernetes。

{{% /tab %}}
{{% tab name="拆分镜像文件系统" %}}

<!--
In this configuration, container image layers are on a separate filesystem, and
container writeable layers are on the same filesystem as the kubelet's ephemeral
data, such as logs and `emptyDir` volumes.

This layout requires support for the `containerfs` eviction signals. For details
about the feature gate and the container runtimes that support this layout, see
[node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals).
-->
在此配置中，容器镜像层位于单独的文件系统上，而容器可写层与 kubelet
的临时数据（例如日志和 `emptyDir` 卷）位于同一文件系统上。

此布局需要支持 `containerfs` 驱逐信号。有关特性门控和支持此布局的容器运行时的详细信息，
参阅[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals)。

{{% /tab %}}
{{< /tabs >}}

<!--
The [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals)
page refers to these observed filesystems as `nodefs`, `imagefs`, and
`containerfs`. Those names do not always mean separate mount points.

The kubelet can measure local storage use when you set up the node using one of
the supported configurations for local ephemeral storage.

If you have a different configuration, then the kubelet does not apply resource
limits for ephemeral local storage.
-->
[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#filesystem-signals)页面将这些观察到的文件系统称为
`nodefs`、`imagefs` 和 `containerfs`。这些名称并不总是意味着单独的挂载点。

当你使用本地临时存储的受支持配置之一来设置节点时，kubelet 可以测量本地存储的使用情况。

如果你使用的是其他配置，则 kubelet 不会对本地临时存储应用资源限制。

{{< note >}}
<!--
The kubelet tracks `tmpfs` emptyDir volumes as container memory use, rather
than as local ephemeral storage.
-->
kubelet 将 `tmpfs` emptyDir 卷作为容器内存使用量来跟踪，而不是作为本地临时存储来跟踪。
{{< /note >}}

{{< note >}}
<!--
The kubelet can only track ephemeral storage on the filesystems it observes
through the supported layouts. If you mount extra filesystems under paths such as
`/var/lib/kubelet`, `/var/log`, or the container runtime storage directory
outside those layouts, the kubelet might not report ephemeral storage correctly.
-->
kubelet 只能通过受支持的布局在其观察到的文件系统上跟踪临时存储。
如果你在这些布局之外的路径（例如 `/var/lib/kubelet`、`/var/log` 或容器运行时存储目录）下挂载额外的文件系统，
kubelet 可能无法正确报告临时存储的使用情况。
{{< /note >}}

<!--
## Setting requests and limits for local ephemeral storage {#requests-limits}

You can specify `ephemeral-storage` for managing local ephemeral storage. Each
container of a Pod can specify either or both of the following:
-->
## 为本地临时存储设置 requests 和 limits {#requests-limits}

你可以指定 `ephemeral-storage` 来管理本地临时存储。
Pod 的每个容器可以指定以下一项或两项：

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

<!--
Limits and requests for `ephemeral-storage` are measured in byte quantities.
You can express storage as a plain integer or as a fixed-point number using one of these suffixes:
E, P, T, G, M, k. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following quantities all represent roughly the same value:
-->
`ephemeral-storage` 的 limits 和 requests 以字节量为单位进行衡量。
你可以使用纯整数或使用以下后缀之一作为定点数来表示存储量：
E、P、T、G、M、k。你也可以使用二进制幂的等价形式：Ei、Pi、Ti、Gi、Mi、Ki。
例如，以下数量都表示大致相同的值：

- `128974848`
- `129e6`
- `129M`
- `123Mi`

<!--
Pay attention to the case of the suffixes. If you request `400m` of ephemeral-storage, this is a request
for 0.4 bytes. Someone who types that probably meant to ask for 400 mebibytes (`400Mi`)
or 400 megabytes (`400M`).

In the following example, the Pod has two containers. Each container has a request of
2GiB of local ephemeral storage. Each container has a limit of 4GiB of local ephemeral
storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and
a limit of 8GiB of local ephemeral storage. 500Mi of that limit could be
consumed by the `emptyDir` volume.
-->
注意后缀的大小写。如果你请求 `400m` 的 ephemeral-storage，这是对 0.4 字节的请求。
输入此值的人可能想请求 400 mebibytes（`400Mi`）或 400 megabytes（`400M`）。

在以下示例中，Pod 有两个容器。每个容器的本地临时存储 request 为 2GiB。
每个容器的本地临时存储 limit 为 4GiB。因此，Pod 的本地临时存储 request 为 4GiB，
limit 为 8GiB。该 limit 中的 500Mi 可以被 `emptyDir` 卷占用。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir:
        sizeLimit: 500Mi
```

<!--
## How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods.
For more information, see
[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

The scheduler ensures that the sum of the resource requests of the scheduled containers is less than the capacity of the node.
-->
## 带 ephemeral-storage requests 的 Pod 如何被调度   {#how-pods-with-ephemeral-storage-requests-are-scheduled}

当你创建 Pod 时，Kubernetes 调度器为 Pod 选择一个运行节点。
每个节点都有可为 Pod 提供的本地临时存储的最大量。有关更多信息，
请参阅[节点可分配资源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)。

调度器确保已调度容器的资源请求总和小于节点的容量。

<!--
## Ephemeral storage consumption management {#resource-emphemeralstorage-consumption}

If the kubelet is managing local ephemeral storage as a resource, then the
kubelet measures storage use in:

- `emptyDir` volumes, except _tmpfs_ `emptyDir` volumes
- directories holding node-level logs
- writeable container layers
-->
## 临时存储消耗管理 {#resource-emphemeralstorage-consumption}

如果 kubelet 将本地临时存储作为资源进行管理，则 kubelet 会在以下方面测量存储使用量：

- `emptyDir` 卷，不包括基于 **tmpfs** 的 `emptyDir` 卷
- 存放节点级日志的目录
- 可写入的容器层

<!--
If a Pod is using more ephemeral storage than you allow it to, the kubelet
sets an eviction signal that triggers Pod eviction.

For container-level isolation, if a container's writable layer and log
usage exceeds its storage limit, the kubelet marks the Pod for eviction.

For pod-level isolation the kubelet works out an overall Pod storage limit by
summing the limits for the containers in that Pod. In this case, if the sum of
the local ephemeral storage usage from all containers and also the Pod's `emptyDir`
volumes exceeds the overall Pod storage limit, then the kubelet also marks the Pod
for eviction.
-->
如果 Pod 使用的临时存储超过了你允许的量，kubelet 会设置驱逐信号，触发 Pod 驱逐。

对于容器级别的隔离，如果容器的可写层和日志使用量超过其存储限制，kubelet 会将 Pod 标记为驱逐。

对于 Pod 级别的隔离，kubelet 通过对该 Pod 中容器的限制求和来计算出整个 Pod 的存储限制。
在这种情况下，如果所有容器的本地临时存储使用量加上 Pod 的 `emptyDir`
卷的总和超过了整个 Pod 的存储限制，则 kubelet 也会将 Pod 标记为驱逐。

{{< caution >}}
<!--
If the kubelet is not measuring local ephemeral storage, then a Pod
that exceeds its local storage limit will not be evicted for breaching
local storage resource limits.

However, if the filesystem space for writeable container layers, node-level logs,
or `emptyDir` volumes falls low, the node
{{< glossary_tooltip text="taints" term_id="taint" >}} itself as short on local storage
and this taint triggers eviction for any Pods that don't specifically tolerate the taint.

See the supported [configurations](#configurations) for ephemeral local storage.
-->
如果 kubelet 没有测量本地临时存储，那么超过本地存储限制的 Pod 不会因违反本地存储资源限制而被驱逐。

但是，如果用于可写容器层、节点级别日志或 `emptyDir` 卷的文件系统空间不足，
节点会{{< glossary_tooltip text="污点" term_id="taint" >}}自身以表示本地存储不足，
此污点会触发对任何未特别容忍该污点的 Pod 的驱逐。

请参阅临时本地存储的受支持[配置](#configurations)。
{{< /caution >}}

<!--
The kubelet supports different ways to measure Pod storage use:

Periodic scanning
-->
kubelet 支持以不同方式测量 Pod 存储使用量：

{{< tabs name="resource-emphemeralstorage-measurement" >}}

{{% tab name="定期扫描" %}}

<!--
The kubelet performs regular, scheduled checks that scan each `emptyDir` volume,
container log directory, and writeable container layer.

The scan measures how much space is used.
-->
kubelet 执行定期、计划的检查，扫描每个 `emptyDir` 卷、容器日志目录和可写容器层。

扫描会测量已使用的空间量。

{{< note >}}
<!--
In this mode, the kubelet does not track open file descriptors
for deleted files.

If you (or a container) create a file inside an `emptyDir` volume,
something then opens that file, and you delete the file while it is still open,
then the inode for the deleted file stays until you close that file
but the kubelet does not categorize the space as in use.

Filesystem project quota
-->
在此模式下，kubelet 不会跟踪已删除文件的打开文件描述符。

如果你（或某个容器）在 `emptyDir` 卷中创建了一个文件，
然后某个进程打开了该文件，而你在此文件仍处于打开状态时删除了该文件，
那么已删除文件的 inode 会一直存在直到你关闭该文件，
但 kubelet 不会将此空间归类为正在使用。
{{< /note >}}

{{% /tab %}}

{{% tab name="文件系统项目配额" %}}

{{< feature-state feature_gate_name="LocalStorageCapacityIsolationFSQuotaMonitoring" >}}

<!--
Project quotas are an operating-system level feature for managing
storage use on filesystems. With Kubernetes, you can enable project
quotas for monitoring storage use. Make sure that the filesystem
backing the `emptyDir` volumes, on the node, provides project quota support.
For example, XFS and ext4fs offer project quotas.
-->
项目配额是操作系统级别的功能，用于管理文件系统上的存储使用量。借助 Kubernetes，
你可以启用项目配额来监控存储使用量。确保节点上为 `emptyDir` 卷提供支持的文件系统支持项目配额。
例如，XFS 和 ext4fs 提供项目配额。

{{< note >}}
<!--
Project quotas let you monitor storage use; they do not enforce limits.
-->
项目配额允许你监控存储使用量；它们不会强制执行限制。
{{< /note >}}

<!--
Kubernetes uses project IDs starting from `1048576`. The IDs in use are
registered in `/etc/projects` and `/etc/projid`. If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` so that
Kubernetes does not use them.
-->
Kubernetes 使用从 `1048576` 开始的项目 ID。正在使用的 ID 注册在
`/etc/projects` 和 `/etc/projid` 中。如果此范围内的项目 ID 在系统上用于其他目的，则这些项目
ID 必须注册在 `/etc/projects` 和 `/etc/projid` 中，以便 Kubernetes 不会使用它们。

<!--
Quotas are faster and more accurate than directory scanning.
When a directory is assigned to a project, all files created under a directory
are created in that project, and the kernel merely has to keep track of
how many blocks are in use by files in that project.
If a file is created and deleted, but has an open file descriptor,
it continues to consume space. Quota tracking records that space accurately
whereas directory scans overlook the storage used by deleted files.
-->
配额比目录扫描更快、更准确。当一个目录被分配给某个项目时，在该目录下创建的所有文件都会在该项目中创建，
内核只需跟踪该项目中文件正在使用多少块。如果一个文件被创建并删除，但仍有打开的文件描述符，
它会继续占用空间。配额跟踪会准确记录该空间，而目录扫描会忽略已删除文件使用的存储。

<!--
To use quotas to track a pod's resource usage, the pod must be in 
a user namespace. Within user namespaces, the kernel restricts changes 
to projectIDs on the filesystem, ensuring the reliability of storage 
metrics calculated by quotas.
-->
要使用配额来跟踪 Pod 的资源使用量，Pod 必须位于用户名字空间中。
在用户名字空间内，内核限制对文件系统上 projectID 的更改，确保配额计算的存储指标的可靠性。

<!--
If you want to use project quotas, you should:

* Enable the `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).

* Ensure the `UserNamespacesSupport` 
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled, and that the kernel, CRI implementation and OCI runtime support user namespaces.
-->
如果你想使用项目配额，你应该：

* 在 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中使用
  `featureGates` 字段启用 `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

* 确保 `UserNamespacesSupport`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)已启用，
  并且内核、CRI 实现和 OCI 运行时支持用户名字空间。

<!--
* Ensure that the root filesystem (or optional runtime filesystem)
  has project quotas enabled. All XFS filesystems support project quotas.
  For ext4 filesystems, you need to enable the project quota tracking feature
  while the filesystem is not mounted.

  ```bash
  # For ext4, with /dev/block-device not mounted
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```
-->
* 确保根文件系统（或可选的运行时文件系统）已启用项目配额。所有 XFS 文件系统都支持项目配额。
  对于 ext4 文件系统，你需要在文件系统未挂载时启用项目配额跟踪特性。

  ```bash
  # 对于，不挂载 /dev/block-device
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

<!--
* Ensure that the root filesystem (or optional runtime filesystem) is
  mounted with project quotas enabled. For both XFS and ext4fs, the
  mount option is named `prjquota`.

If you don't want to use project quotas, you should:

* Disable the `LocalStorageCapacityIsolationFSQuotaMonitoring`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
* 确保根文件系统（或可选的运行时文件系统）在启用项目配额的情况下挂载。
  对于 XFS 和 ext4fs，挂载选项名为 `prjquota`。

如果你不想使用项目配额，你应该：

* 在 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中使用
  `featureGates` 字段禁用 `LocalStorageCapacityIsolationFSQuotaMonitoring`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* Read about [project quotas](https://www.linux.org/docs/man8/xfs_quota.html) in XFS
-->
* 阅读 XFS 中的[项目配额](https://www.linux.org/docs/man8/xfs_quota.html)信息
