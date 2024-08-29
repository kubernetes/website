---
title: 卷
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Volumes
api_metadata:
- apiVersion: ""
  kind: "Volume"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
On-disk files in a container are ephemeral, which presents some problems for
non-trivial applications when running in containers. One problem occurs when 
a container crashes or is stopped. Container state is not saved so all of the 
files that were created or modified during the lifetime of the container are lost. 
During a crash, kubelet restarts the container with a clean state. 
Another problem occurs when multiple containers are running in a `Pod` and 
need to share files. It can be challenging to setup 
and access a shared filesystem across all of the containers.
The Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} abstraction
solves both of these problems.
Familiarity with [Pods](/docs/concepts/workloads/pods/) is suggested.
-->
容器中的文件在磁盘上是临时存放的，这给在容器中运行较重要的应用带来一些问题。
当容器崩溃或停止时会出现一个问题。此时容器状态未保存，
因此在容器生命周期内创建或修改的所有文件都将丢失。
在崩溃期间，kubelet 会以干净的状态重新启动容器。
当多个容器在一个 Pod 中运行并且需要共享文件时，会出现另一个问题。
跨所有容器设置和访问共享文件系统具有一定的挑战性。

Kubernetes {{< glossary_tooltip text="卷（Volume）" term_id="volume" >}}
这一抽象概念能够解决这两个问题。

阅读本文前建议你熟悉一下 [Pod](/zh-cn/docs/concepts/workloads/pods)。

<!-- body -->

<!--
## Background
-->
## 背景  {#background}

<!--
Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
[Ephemeral volume](/docs/concepts/storage/ephemeral-volumes/) types have a lifetime of a pod,
but [persistent volumes](/docs/concepts/storage/persistent-volumes/) exist beyond
the lifetime of a pod. When a pod ceases to exist, Kubernetes destroys ephemeral volumes;
however, Kubernetes does not destroy persistent volumes.
For any kind of volume in a given pod, data is preserved across container restarts.
-->
Kubernetes 支持很多类型的卷。
{{< glossary_tooltip term_id="pod" text="Pod" >}} 可以同时使用任意数目的卷类型。
[临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)类型的生命周期与 Pod 相同，
但[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)可以比 Pod 的存活期长。
当 Pod 不再存在时，Kubernetes 也会销毁临时卷；不过 Kubernetes 不会销毁持久卷。
对于给定 Pod 中任何类型的卷，在容器重启期间数据都不会丢失。

<!--
At its core, a volume is a directory, possibly with some data in it, which
is accessible to the containers in a pod. How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.
-->
卷的核心是一个目录，其中可能存有数据，Pod 中的容器可以访问该目录中的数据。
所采用的特定的卷类型将决定该目录如何形成的、使用何种介质保存数据以及目录中存放的内容。

<!--
To use a volume, specify the volumes to provide for the Pod in `.spec.volumes`
and declare where to mount those volumes into containers in `.spec.containers[*].volumeMounts`.
A process in a container sees a filesystem view composed from the initial contents of
the {{< glossary_tooltip text="container image" term_id="image" >}}, plus volumes
(if defined) mounted inside the container.
The process sees a root filesystem that initially matches the contents of the container
image.
Any writes to within that filesystem hierarchy, if allowed, affect what that process views
when it performs a subsequent filesystem access.
-->
使用卷时, 在 `.spec.volumes` 字段中设置为 Pod 提供的卷，并在
`.spec.containers[*].volumeMounts` 字段中声明卷在容器中的挂载位置。
容器中的进程看到的文件系统视图是由它们的{{< glossary_tooltip text="容器镜像" term_id="image" >}}
的初始内容以及挂载在容器中的卷（如果定义了的话）所组成的。
其中根文件系统同容器镜像的内容相吻合。
任何在该文件系统下的写入操作，如果被允许的话，都会影响接下来容器中进程访问文件系统时所看到的内容。

<!--
Volumes mount at the [specified paths](#using-subpath) within
the image.
For each container defined within a Pod, you must independently specify where
to mount each volume that the container uses.

Volumes cannot mount within other volumes (but see [Using subPath](#using-subpath)
for a related mechanism). Also, a volume cannot contain a hard link to anything in
a different volume.
-->
卷挂载在镜像中的[指定路径](#using-subpath)下。
Pod 配置中的每个容器必须独立指定各个卷的挂载位置。

卷不能挂载到其他卷之上（不过存在一种[使用 subPath](#using-subpath) 的相关机制），也不能与其他卷有硬链接。

<!--
## Types of volumes {#volume-types}

Kubernetes supports several types of volumes.
-->
## 卷类型  {#volume-types}

Kubernetes 支持下列类型的卷：

<!--
### awsElasticBlockStore (deprecated) {#awselasticblockstore}
-->
### awsElasticBlockStore （已弃用）   {#awselasticblockstore}

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `awsElasticBlockStore` type
are redirected to the `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AWSElasticBlockStore in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) third party
storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有针对树内 `awsElasticBlockStore`
类型的操作都会被重定向到 `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

AWSElasticBlockStore 树内存储驱动已在 Kubernetes v1.19 版本中废弃，
并在 v1.27 版本中被完全移除。

Kubernetes 项目建议你转为使用 [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
第三方存储驱动插件。

<!--
### azureDisk (deprecated) {#azuredisk}
-->
### azureDisk （已弃用）   {#azuredisk}

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `azureDisk` type
are redirected to the `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AzureDisk in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) third party
storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有针对树内 `azureDisk`
类型的操作都会被重定向到 `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

AzureDisk 树内存储驱动已在 Kubernetes v1.19 版本中废弃，并在 v1.27 版本中被完全移除。

Kubernetes 项目建议你转为使用 [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
第三方存储驱动插件。

<!--
### azureFile (deprecated) {#azurefile}
-->
### azureFile （已弃用）    {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

<!--
The `azureFile` volume type mounts a Microsoft Azure File volume (SMB 2.1 and 3.0)
into a pod.

For more details, see the [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).
-->
`azureFile` 卷类型用来在 Pod 上挂载 Microsoft Azure 文件卷（File Volume）（SMB 2.1 和 3.0）。

更多详情请参考 [`azureFile` 卷插件](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md)。

<!--
#### azureFile CSI migration
-->
#### azureFile CSI 迁移  {#azurefile-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The `CSIMigration` feature for `azureFile`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigrationAzureFile`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.
-->
启用 `azureFile` 的 `CSIMigration` 特性后，所有插件操作将从现有的树内插件重定向到
`file.csi.azure.com` 容器存储接口（CSI）驱动程序。要使用此特性，必须在集群中安装
[Azure 文件 CSI 驱动程序](https://github.com/kubernetes-sigs/azurefile-csi-driver)，
并且 `CSIMigrationAzureFile`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
必须被启用。

<!--
Azure File CSI driver does not support using same volume with different fsgroups. If
`CSIMigrationAzureFile` is enabled, using same volume with different fsgroups won't be supported at all.
-->
Azure 文件 CSI 驱动尚不支持为同一卷设置不同的 fsgroup。
如果 `CSIMigrationAzureFile` 特性被启用，用不同的 fsgroup 来使用同一卷也是不被支持的。

<!--
#### azureFile CSI migration complete
-->
#### azureFile CSI 迁移完成

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!--
To disable the `azureFile` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAzureFileUnregister` flag to `true`.
-->
要禁止控制器管理器和 kubelet 加载 `azureFile` 存储插件，
请将 `InTreePluginAzureFileUnregister` 标志设置为 `true`。

<!--
### cephfs (removed) {#cephfs}
-->
### cephfs（已移除）  {#cephfs}

<!-- maintenance note: OK to remove all mention of cephfs once the v1.30 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `cephfs` volume type.

The `cephfs` in-tree storage driver was deprecated in the Kubernetes v1.28 release and then removed entirely in the v1.31 release.
-->
Kubernetes {{< skew currentVersion >}} 不包括 `cephfs` 卷类型。

`cephfs` 树内存储驱动在 Kubernetes v1.28 版本中被弃用，并在 v1.31 版本中被完全移除。

<!--
### cinder (deprecated) {#cinder}
-->
### cinder（已弃用）   {#cinder}

<!-- maintenance note: OK to remove all mention of cinder once the v1.26 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `cinder` type
are redirected to the `cinder.csi.openstack.org` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The OpenStack Cinder in-tree storage driver was deprecated in the Kubernetes v1.11 release
and then removed entirely in the v1.26 release.

The Kubernetes project suggests that you use the 
[OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
third party storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有针对树内 `cinder`
类型的操作都会被重定向到 `cinder.csi.openstack.org` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

OpenStack Cinder 树内存储驱动已在 Kubernetes v1.11 版本中废弃，
并在 v1.26 版本中被完全移除。

Kubernetes 项目建议你转为使用
[OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
第三方存储驱动插件。

### configMap

<!--
A [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provides a way to inject configuration data into pods.
The data stored in a ConfigMap can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a pod.
-->
[`configMap`](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
卷提供了向 Pod 注入配置数据的方法。
ConfigMap 对象中存储的数据可以被 `configMap` 类型的卷引用，然后被 Pod 中运行的容器化应用使用。

<!--
When referencing a ConfigMap, you provide the name of the ConfigMap in the
volume. You can customize the path to use for a specific
entry in the ConfigMap. The following configuration shows how to mount
the `log-config` ConfigMap onto a Pod called `configmap-pod`:
-->
引用 configMap 对象时，你可以在卷中通过它的名称来引用。
你可以自定义 ConfigMap 中特定条目所要使用的路径。
下面的配置显示了如何将名为 `log-config` 的 ConfigMap 挂载到名为 `configmap-pod`
的 Pod 中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

<!--
The `log-config` ConfigMap is mounted as a volume, and all contents stored in
its `log_level` entry are mounted into the Pod at path `/etc/config/log_level`.
Note that this path is derived from the volume's `mountPath` and the `path`
keyed with `log_level`.
-->
`log-config` ConfigMap 以卷的形式挂载，并且存储在 `log_level`
条目中的所有内容都被挂载到 Pod 的 `/etc/config/log_level` 路径下。
请注意，这个路径来源于卷的 `mountPath` 和 `log_level` 键对应的 `path`。

{{< note >}}
<!--
* You must [create a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap)
  before you can use it.

* A ConfigMap is always mounted as `readOnly`.

* A container using a ConfigMap as a [`subPath`](#using-subpath) volume mount will not
  receive ConfigMap updates.
  
* Text data is exposed as files using the UTF-8 character encoding. For other character encodings, use `binaryData`.
-->
* 你必须先[创建 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap)，
  才能使用它。
* ConfigMap 总是以 `readOnly` 的模式挂载。
* 容器以 [`subPath`](#using-subpath) 卷挂载方式使用 ConfigMap 时，将无法接收 ConfigMap 的更新。
* 文本数据挂载成文件时采用 UTF-8 字符编码。如果使用其他字符编码形式，可使用
  `binaryData` 字段。
{{< /note >}}

### downwardAPI {#downwardapi}

<!--
A `downwardAPI` volume makes {{< glossary_tooltip term_id="downward-api" text="downward API" >}}
data available to applications. Within the volume, you can find the exposed
data as read-only files in plain text format.
-->
`downwardAPI` 卷用于为应用提供 {{< glossary_tooltip term_id="downward-api" text="downward API" >}} 数据。
在这类卷中，所公开的数据以纯文本格式的只读文件形式存在。

<!--
A container using the downward API as a [`subPath`](#using-subpath) volume mount does not
receive updates when field values change.
-->
{{< note >}}
容器以 [subPath](#using-subpath) 卷挂载方式使用 downward API 时，在字段值更改时将不能接收到它的更新。
{{< /note >}}

<!--
See [Expose Pod Information to Containers Through Files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
to learn more.
-->
更多详细信息请参考[通过文件将 Pod 信息呈现给容器](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)。

### emptyDir {#emptydir}

<!--
For a Pod that defines an `emptyDir` volume, the volume is created when the Pod is assigned to a node.
As the name says, the `emptyDir` volume is initially empty. All containers in the Pod can read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each container. When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted permanently.
-->
对于定义了 `emptyDir` 卷的 Pod，在 Pod 被指派到某节点时此卷会被创建。
就像其名称所表示的那样，`emptyDir` 卷最初是空的。尽管 Pod 中的容器挂载 `emptyDir`
卷的路径可能相同也可能不同，但这些容器都可以读写 `emptyDir` 卷中相同的文件。
当 Pod 因为某些原因被从节点上删除时，`emptyDir` 卷中的数据也会被永久删除。

{{< note >}}
<!--
A container crashing does *not* remove a Pod from a node. The data in an `emptyDir` volume
is safe across container crashes.
-->
容器崩溃并**不**会导致 Pod 被从节点上移除，因此容器崩溃期间 `emptyDir` 卷中的数据是安全的。
{{< /note >}}

<!--
Some uses for an `emptyDir` are:

* scratch space, such as for a disk-based merge sort
* checkpointing a long computation for recovery from crashes
* holding files that a content-manager container fetches while a webserver
  container serves the data
-->
`emptyDir` 的一些用途：

* 缓存空间，例如基于磁盘的归并排序。
* 为耗时较长的计算任务提供检查点，以便任务能方便地从崩溃前状态恢复执行。
* 在 Web 服务器容器服务数据时，保存内容管理器容器获取的文件。

<!--
The `emptyDir.medium` field controls where `emptyDir` volumes are stored. By
default `emptyDir` volumes are stored on whatever medium that backs the node
such as disk, SSD, or network storage, depending on your environment. If you set
the `emptyDir.medium` field to `"Memory"`, Kubernetes mounts a tmpfs (RAM-backed
filesystem) for you instead.  While tmpfs is very fast be aware that, unlike
disks, files you write count against the memory limit of the container that wrote them.
-->
`emptyDir.medium` 字段用来控制 `emptyDir` 卷的存储位置。
默认情况下，`emptyDir` 卷存储在该节点所使用的介质上；
此处的介质可以是磁盘、SSD 或网络存储，这取决于你的环境。
你可以将 `emptyDir.medium` 字段设置为 `"Memory"`，
以告诉 Kubernetes 为你挂载 tmpfs（基于 RAM 的文件系统）。
虽然 tmpfs 速度非常快，但是要注意它与磁盘不同，
并且你所写入的所有文件都会计入容器的内存消耗，受容器内存限制约束。

<!--
A size limit can be specified for the default medium, which limits the capacity
of the `emptyDir` volume. The storage is allocated from [node ephemeral
storage](/docs/concepts/configuration/manage-resources-containers/#setting-requests-and-limits-for-local-ephemeral-storage).
If that is filled up from another source (for example, log files or image
overlays), the `emptyDir` may run out of capacity before this limit.
-->
你可以通过为默认介质指定大小限制，来限制 `emptyDir` 卷的存储容量。
此存储是从[节点临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/#setting-requests-and-limits-for-local-ephemeral-storage)中分配的。
如果来自其他来源（如日志文件或镜像分层数据）的数据占满了存储，`emptyDir`
可能会在达到此限制之前发生存储容量不足的问题。

{{< note >}}
<!--
You can specify a size for memory backed volumes, provided that the `SizeMemoryBackedVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in your cluster (this has been beta, and active by default, since the Kubernetes 1.22 release).
If you don't specify a volume size, memory backed volumes are sized to node allocatable memory.
-->
你可以指定内存作为介质的卷的大小，前提是集群中启用了 `SizeMemoryBackedVolumes`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
（自 Kubernetes 1.22 发布以来，此特性一直处于 Beta 阶段，并且默认启用）。
如果你未指定大小，内存作为介质的卷的大小根据节点可分配内存进行调整。
{{< /note>}}

{{< caution >}}
<!--
Please check [here](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir)
for points to note in terms of resource management when using memory-backed `emptyDir`.
-->
使用内存作为介质的 `emptyDir` 卷时，
请查阅[此处](/zh-cn/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir)，
了解有关资源管理方面的注意事项。
{{< /caution >}}

<!--
#### emptyDir configuration example
-->
#### emptyDir 配置示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```

<!--
### fc (fibre channel) {#fc}

An `fc` volume type allows an existing fibre channel block storage volume
to mount in a Pod. You can specify single or multiple target world wide names (WWNs)
using the parameter `targetWWNs` in your Volume configuration. If multiple WWNs are specified,
targetWWNs expect that those WWNs are from multi-path connections.
-->
### fc (光纤通道) {#fc}

`fc` 卷类型允许将现有的光纤通道块存储卷挂载到 Pod 中。
可以使用卷配置中的参数 `targetWWNs` 来指定单个或多个目标 WWN（World Wide Names）。
如果指定了多个 WWN，targetWWNs 期望这些 WWN 来自多路径连接。

{{< note >}}
<!--
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs
beforehand so that Kubernetes hosts can access them.
-->
你必须配置 FC SAN Zoning，以便预先向目标 WWN 分配和屏蔽这些 LUN（卷），这样
Kubernetes 主机才可以访问它们。
{{< /note >}}

<!--
See the [fibre channel example](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)
for more details.
-->
更多详情请参考 [FC 示例](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)。

<!--
### gcePersistentDisk (deprecated) {#gcepersistentdisk}

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `gcePersistentDisk` type
are redirected to the `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
-->
### gcePersistentDisk（已弃用） {#gcepersistentdisk}

在 Kubernetes {{< skew currentVersion >}} 中，所有针对树内 `gcePersistentDisk`
类型的操作都会被重定向到 `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

<!--
The `gcePersistentDisk` in-tree storage driver was deprecated in the Kubernetes v1.17 release
and then removed entirely in the v1.28 release.
-->
`gcePersistentDisk` 源代码树内卷存储驱动在 Kubernetes v1.17 版本中被弃用，在 v1.28 版本中被完全移除。

<!--
The Kubernetes project suggests that you use the [Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) 
third party storage driver instead.
-->
Kubernetes 项目建议你转为使用
[Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
第三方存储驱动插件。

<!--
#### GCE CSI migration
-->
#### GCE CSI 迁移  {#gce-csi-migration}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The `CSIMigration` feature for GCE PD, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `pd.csi.storage.gke.io` Container
Storage Interface (CSI) Driver. In order to use this feature, the [GCE PD CSI
Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
must be installed on the cluster.
-->
启用 GCE PD 的 `CSIMigration` 特性后，所有插件操作将从现有的树内插件重定向到
`pd.csi.storage.gke.io` 容器存储接口（CSI）驱动程序。
为了使用此特性，必须在集群中上安装
[GCE PD CSI 驱动程序](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)。

<!--
### gitRepo (deprecated) {#gitrepo}
-->
### gitRepo (已弃用)    {#gitrepo}

{{< warning >}}
<!--
The `gitRepo` volume type is deprecated.

To provision a Pod that has a Git repository mounted, you can
mount an
[`emptyDir`](#emptydir) volume into an [init container](/docs/concepts/workloads/pods/init-containers/) that
clones the repo using Git, then mount the
[EmptyDir](#emptydir) into the Pod's container.
-->
`gitRepo` 卷类型已经被弃用。

如果需要制备已挂载 Git 仓库的 Pod，你可以将
[EmptyDir](#emptydir) 卷挂载到 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/) 中，
使用 Git 命令完成仓库的克隆操作，然后将 [EmptyDir](#emptydir) 卷挂载到 Pod 的容器中。

---

<!--
You can restrict the use of `gitRepo` volumes in your cluster using
[policies](/docs/concepts/policy/) such as
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
You can use the following Common Expression Language (CEL) expression as
part of a policy to reject use of `gitRepo` volumes:
`has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))`.
-->
你可以使用 [ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
这类[策略](/zh-cn/docs/concepts/policy/)来限制在你的集群中使用 `gitRepo` 卷。
你可以使用以下通用表达语言（CEL）表达式作为策略的一部分，以拒绝使用 `gitRepo` 卷：
`has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))`。
{{< /warning >}}

<!--
A `gitRepo` volume is an example of a volume plugin. This plugin
mounts an empty directory and clones a git repository into this directory
for your Pod to use.

Here is an example of a `gitRepo` volume:
-->
`gitRepo` 卷是一个卷插件的例子。
该查卷挂载一个空目录，并将一个 Git 代码仓库克隆到这个目录中供 Pod 使用。

下面给出一个 `gitRepo` 卷的示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

<!--
### glusterfs (removed) {#glusterfs}
-->
### glusterfs（已移除）   {#glusterfs}

<!-- maintenance note: OK to remove all mention of glusterfs once the v1.25 release of
Kubernetes has gone out of support -->

<!-- 
Kubernetes {{< skew currentVersion >}} does not include a `glusterfs` volume type.

The GlusterFS in-tree storage driver was deprecated in the Kubernetes v1.25 release
and then removed entirely in the v1.26 release.
-->
Kubernetes {{< skew currentVersion >}} 不包含 `glusterfs` 卷类型。

GlusterFS 树内存储驱动程序在 Kubernetes v1.25 版本中被弃用，然后在 v1.26 版本中被完全移除。

### hostPath {#hostpath}

<!--
A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.
-->
`hostPath` 卷能将主机节点文件系统上的文件或目录挂载到你的 Pod 中。
虽然这不是大多数 Pod 需要的，但是它为一些应用提供了强大的逃生舱。

{{< warning >}}
<!-- 
Using the `hostPath` volume type presents many security risks.
If you can avoid using a `hostPath` volume, you should. For example,
define a [`local` PersistentVolume](#local), and use that instead.

If you are restricting access to specific directories on the node using
admission-time validation, that restriction is only effective when you
additionally require that any mounts of that `hostPath` volume are
**read only**. If you allow a read-write mount of any host path by an
untrusted Pod, the containers in that Pod may be able to subvert the
read-write host mount.
-->
使用 `hostPath` 类型的卷存在许多安全风险。如果可以，你应该尽量避免使用 `hostPath` 卷。
例如，你可以改为定义并使用 [`local` PersistentVolume](#local)。

如果你通过准入时的验证来限制对节点上特定目录的访问，这种限制只有在你额外要求所有
`hostPath` 卷的挂载都是**只读**的情况下才有效。如果你允许不受信任的 Pod 以读写方式挂载任意主机路径，
则该 Pod 中的容器可能会破坏可读写主机挂载卷的安全性。

---

<!--
Take care when using `hostPath` volumes, whether these are mounted as read-only
or as read-write, because:
-->
无论 `hostPath` 卷是以只读还是读写方式挂载，使用时都需要小心，这是因为：

<!--
* Access to the host filesystem can expose privileged system credentials (such as for the kubelet) or privileged APIs
  (such as the container runtime socket), that can be used for container escape or to attack other
  parts of the cluster.
* Pods with identical configuration (such as created from a PodTemplate) may
  behave differently on different nodes due to different files on the nodes.
* `hostPath` volume usage is not treated as ephemeral storage usage.
  You need to monitor the disk usage by yourself because excessive `hostPath` disk
  usage will lead to disk pressure on the node.
-->
* 访问主机文件系统可能会暴露特权系统凭证（例如 kubelet 的凭证）或特权 API（例如容器运行时套接字），
  这些可以被用于容器逃逸或攻击集群的其他部分。
* 具有相同配置的 Pod（例如基于 PodTemplate 创建的 Pod）可能会由于节点上的文件不同而在不同节点上表现出不同的行为。
* `hostPath` 卷的用量不会被视为临时存储用量。
  你需要自己监控磁盘使用情况，因为过多的 `hostPath` 磁盘使用量会导致节点上的磁盘压力。
{{< /warning >}}


<!--
Some uses for a `hostPath` are:

* running a container that needs access to node-level system components
  (such as a container that transfers system logs to a central location,
  accessing those logs using a read-only mount of `/var/log`)
* making a configuration file stored on the host system available read-only
  to a {{< glossary_tooltip text="static pod" term_id="static-pod" >}};
  unlike normal Pods, static Pods cannot access ConfigMaps
-->
`hostPath` 的一些用法有：

* 运行一个需要访问节点级系统组件的容器
  （例如一个将系统日志传输到集中位置的容器，使用只读挂载 `/var/log` 来访问这些日志）
* 让存储在主机系统上的配置文件可以被{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}
  以只读方式访问；与普通 Pod 不同，静态 Pod 无法访问 ConfigMap。

<!--
#### `hostPath` volume types

In addition to the required `path` property, you can optionally specify a
`type` for a `hostPath` volume.

The available values for `type` are:
-->
#### `hostPath` 卷类型

除了必需的 `path` 属性外，你还可以选择为 `hostPath` 卷指定 `type`。

`type` 的可用值有：

<!-- empty string represented using U+200C ZERO WIDTH NON-JOINER -->

<!--
| Value | Behavior |
|:------|:---------|
| `‌""` | Empty string (default) is for backward compatibility, which means that no checks will be performed before mounting the `hostPath` volume. |
| `DirectoryOrCreate` | If nothing exists at the given path, an empty directory will be created there as needed with permission set to 0755, having the same group and ownership with Kubelet. |
| `Directory` | A directory must exist at the given path |
| `FileOrCreate` | If nothing exists at the given path, an empty file will be created there as needed with permission set to 0644, having the same group and ownership with Kubelet. |
| `File` | A file must exist at the given path |
| `Socket` | A UNIX socket must exist at the given path |
| `CharDevice` | _(Linux nodes only)_ A character device must exist at the given path |
| `BlockDevice` | _(Linux nodes only)_ A block device must exist at the given path |
-->
| 取值  | 行为     |
|:------|:---------|
| `‌""` | 空字符串（默认）用于向后兼容，这意味着在安装 hostPath 卷之前不会执行任何检查。 |
| `DirectoryOrCreate` | 如果在给定路径上什么都不存在，那么将根据需要创建空目录，权限设置为 0755，具有与 kubelet 相同的组和属主信息。 |
| `Directory` | 在给定路径上必须存在的目录。|
| `FileOrCreate` | 如果在给定路径上什么都不存在，那么将在那里根据需要创建空文件，权限设置为 0644，具有与 kubelet 相同的组和所有权。|
| `File` | 在给定路径上必须存在的文件。|
| `Socket` | 在给定路径上必须存在的 UNIX 套接字。|
| `CharDevice` | **（仅 Linux 节点）** 在给定路径上必须存在的字符设备。|
| `BlockDevice` | **（仅 Linux 节点）** 在给定路径上必须存在的块设备。|

{{< caution >}}
<!--
The `FileOrCreate` mode does **not** create the parent directory of the file. If the parent directory
of the mounted file does not exist, the pod fails to start. To ensure that this mode works,
you can try to mount directories and files separately, as shown in the
[`FileOrCreate` example](#hostpath-fileorcreate-example) for `hostPath`.
-->
`FileOrCreate` 模式**不会**创建文件的父目录。如果挂载文件的父目录不存在，Pod 将启动失败。
为了确保这种模式正常工作，你可以尝试分别挂载目录和文件，如
`hostPath` 的 [`FileOrCreate` 示例](#hostpath-fileorcreate-example)所示。
{{< /caution >}}

<!--
Some files or directories created on the underlying hosts might only be
accessible by root. You then either need to run your process as root in a
[privileged container](/docs/tasks/configure-pod-container/security-context/)
or modify the file permissions on the host to be able to read from
(or write to) a `hostPath` volume.
-->
下层主机上创建的某些文件或目录只能由 root 用户访问。
此时，你需要在[特权容器](/zh-cn/docs/tasks/configure-pod-container/security-context/)中以
root 身份运行进程，或者修改主机上的文件权限，以便能够从 `hostPath` 卷读取数据（或将数据写入到 `hostPath` 卷）。

<!--
#### hostPath configuration example
-->
#### hostPath 配置示例

<!--
Linux node
# This manifest mounts /data/foo on the host as /foo inside the
# single container that runs within the hostpath-example-linux Pod.
#
# The mount into the container is read-only.

# mount /data/foo, but only if that directory already exists

# directory location on host
# this field is optional
-->
{{< tabs name="hostpath_examples" >}}
{{< tab name="Linux 节点" codelang="yaml" >}}
---
# 此清单将主机上的 /data/foo 挂载为 hostpath-example-linux Pod 中运行的单个容器内的 /foo
#
# 容器中的挂载是只读的
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-linux
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: example-container
    image: registry.k8s.io/test-webserver
    volumeMounts:
    - mountPath: /foo
      name: example-volume
      readOnly: true
  volumes:
  - name: example-volume
    # 挂载 /data/foo，但仅当该目录已经存在时
    hostPath:
      path: /data/foo # 主机上的目录位置
      type: Directory # 此字段可选
{{< /tab >}}

<!--
Windows node
# This manifest mounts C:\Data\foo on the host as C:\foo, inside the
# single container that runs within the hostpath-example-windows Pod.
#
# The mount into the container is read-only.

# mount C:\Data\foo from the host, but only if that directory already exists

# directory location on host
# this field is optional
-->
{{< tab name="Windows 节点" codelang="yaml" >}}
---
# 此清单将主机上的 C:\Data\foo 挂载为 hostpath-example-windows Pod 中运行的单个容器内的 C:\foo
#
# 容器中的挂载是只读的
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-example-windows
spec:
  os: { name: windows }
  nodeSelector:
    kubernetes.io/os: windows
  containers:
  - name: example-container
    image: microsoft/windowsservercore:1709
    volumeMounts:
    - name: example-volume
      mountPath: "C:\\foo"
      readOnly: true
  volumes:
    # 从主机挂载 C:\Data\foo，但仅当该目录已经存在时
  - name: example-volume
    hostPath:
      path: "C:\\Data\\foo" # 主机上的目录位置
      type: Directory       # 此字段可选
{{< /tab >}}
{{< /tabs >}}

<!--
#### hostPath FileOrCreate configuration example {#hostpath-fileorcreate-example}
-->
#### hostPath FileOrCreate 配置示例  {#hostpath-fileorcreate-example}

<!--
The following manifest defines a Pod that mounts `/var/local/aaa`
inside the single container in the Pod. If the node does not
already have a path `/var/local/aaa`, the kubelet creates
it as a directory and then mounts it into the Pod.

If `/var/local/aaa` already exists but is not a directory,
the Pod fails. Additionally, the kubelet attempts to make
a file named `/var/local/aaa/1.txt` inside that directory
(as seen from the host); if something already exists at
that path and isn't a regular file, the Pod fails.

Here's the example manifest:
-->
以下清单定义了一个 Pod，将 `/var/local/aaa` 挂载到 Pod 中的单个容器内。
如果节点上还没有路径 `/var/local/aaa`，kubelet 会创建这一目录，然后将其挂载到 Pod 中。

如果 `/var/local/aaa` 已经存在但不是一个目录，Pod 会失败。
此外，kubelet 还会尝试在该目录内创建一个名为 `/var/local/aaa/1.txt` 的文件（从主机的视角来看）；
如果在该路径上已经存在某个东西且不是常规文件，则 Pod 会失败。

以下是清单示例：

<!--
# Ensure the file directory is created.
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # 确保文件所在目录成功创建。
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### image

{{< feature-state feature_gate_name="ImageVolume" >}}

<!--
An `image` volume source represents an OCI object (a container image or
artifact) which is available on the kubelet's host machine.

One example to use the `image` volume source is:
-->
`image` 卷源代表一个在 kubelet 主机上可用的 OCI 对象（容器镜像或工件）。

使用 `image` 卷源的一个例子是：

{{% code_sample file="pods/image-volumes.yaml" %}}

<!--
The volume is resolved at pod startup depending on which `pullPolicy` value is
provided:

`Always`
: the kubelet always attempts to pull the reference. If the pull fails, the kubelet sets the Pod to `Failed`.
-->
此卷在 Pod 启动时基于提供的 `pullPolicy` 值进行解析：

`Always`
: kubelet 始终尝试拉取此引用。如果拉取失败，kubelet 会将 Pod 设置为 `Failed`。

<!--
`Never`
: the kubelet never pulls the reference and only uses a local image or artifact. The Pod becomes `Failed` if any layers of the image aren't already present locally, or if the manifest for that image isn't already cached.

`IfNotPresent`
: the kubelet pulls if the reference isn't already present on disk. The Pod becomes `Failed` if the reference isn't present and the pull fails.
-->
`Never`
: kubelet 从不拉取此引用，仅使用本地镜像或工件。
  如果本地没有任何镜像层存在，或者该镜像的清单未被缓存，则 Pod 会变为 `Failed`。

`IfNotPresent`
: 如果引用在磁盘上不存在，kubelet 会进行拉取。
  如果引用不存在且拉取失败，则 Pod 会变为 `Failed`。

<!--
The volume gets re-resolved if the pod gets deleted and recreated, which means
that new remote content will become available on pod recreation. A failure to
resolve or pull the image during pod startup will block containers from starting
and may add significant latency. Failures will be retried using normal volume
backoff and will be reported on the pod reason and message.
-->
如果 Pod 被删除并重新创建，此卷会被重新解析，这意味着在 Pod 重新创建时将可以访问新的远程内容。
在 Pod 启动期间解析或拉取镜像失败将导致容器无法启动，并可能显著增加延迟。
如果失败，将使用正常的卷回退进行重试，并输出 Pod 失败的原因和相关消息。

<!--
The types of objects that may be mounted by this volume are defined by the
container runtime implementation on a host machine and at minimum must include
all valid types supported by the container image field. The OCI object gets
mounted in a single directory (`spec.containers[*].volumeMounts.mountPath`) by
will be mounted read-only. On Linux, the container runtime typically also mounts the 
volume with file execution blocked (`noexec`).
-->
此卷可以挂载的对象类型由主机上的容器运行时实现负责定义，至少必须包含容器镜像字段所支持的所有有效类型。
OCI 对象将以只读方式被挂载到单个目录（`spec.containers[*].volumeMounts.mountPath`）中。
在 Linux 上，容器运行时通常还会挂载阻止文件执行（`noexec`）的卷。

<!--
Beside that:
- Sub path mounts for containers are not supported
  (`spec.containers[*].volumeMounts.subpath`).
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The [`AlwaysPullImages` Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  does also work for this volume source like for container images.
-->
此外：

- 不支持容器使用子路径挂载（`spec.containers[*].volumeMounts.subpath`）。
- `spec.securityContext.fsGroupChangePolicy` 字段对这种卷没有效果。
- [`AlwaysPullImages` 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)也适用于此卷源，
  就像适用于容器镜像一样。

<!--
The following fields are available for the `image` type:
-->
`image` 类型可用的字段如下：

<!--
`reference`
: Artifact reference to be used. For example, you could specify
`registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}` to load the
files from the Kubernetes conformance test image. Behaves in the same way as
`pod.spec.containers[*].image`. Pull secrets will be assembled in the same way
as for the container image by looking up node credentials, service account image
pull secrets, and pod spec image pull secrets. This field is optional to allow
higher level config management to default or override container images in
workload controllers like Deployments and StatefulSets.
[More info about container images](/docs/concepts/containers/images)
-->
`reference`
: 要使用的工件引用。例如，你可以指定 `registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}`
  来加载 Kubernetes 合规性测试镜像中的文件。其行为与 `pod.spec.containers[*].image` 相同。
  拉取 Secret 的组装方式与容器镜像所用的方式相同，即通过查找节点凭据、服务账户镜像拉取 Secret
  和 Pod 规约镜像拉取 Secret。此字段是可选的，允许更高层次的配置管理在 Deployment 和
  StatefulSet 这类工作负载控制器中默认使用或重载容器镜像。
  参阅[容器镜像更多细节](/zh-cn/docs/concepts/containers/images)。

<!--
`pullPolicy`
: Policy for pulling OCI objects. Possible values are: `Always`, `Never` or
`IfNotPresent`. Defaults to `Always` if `:latest` tag is specified, or
`IfNotPresent` otherwise.

See the [_Use an Image Volume With a Pod_](/docs/tasks/configure-pod-container/image-volumes)
example for more details on how to use the volume source.
-->
`pullPolicy`
: 拉取 OCI 对象的策略。可能的值为：`Always`、`Never` 或 `IfNotPresent`。
  如果指定了 `:latest` 标记，则默认为 `Always`，否则默认为 `IfNotPresent`。

有关如何使用卷源的更多细节，
请参见 [Pod 使用镜像卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)示例。

### iscsi

<!--
An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted
into your Pod. Unlike `emptyDir`, which is erased when a Pod is removed, the
contents of an `iscsi` volume are preserved and the volume is merely
unmounted. This means that an iscsi volume can be pre-populated with data, and
that data can be shared between pods.
-->
`iscsi` 卷能将 iSCSI (基于 IP 的 SCSI) 卷挂载到你的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`iscsi`
卷的内容在删除 Pod 时会被保留，卷只是被卸载。
这意味着 `iscsi` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

{{< note >}}
<!--
You must have your own iSCSI server running with the volume created before you can use it.
-->
在使用 iSCSI 卷之前，你必须拥有自己的 iSCSI 服务器，并在上面创建卷。
{{< /note >}}

<!--
A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously. This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need. Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.
-->
iSCSI 的一个特点是它可以同时被多个用户以只读方式挂载。
这意味着你可以用数据集预先填充卷，然后根据需要在尽可能多的 Pod 上使用它。
不幸的是，iSCSI 卷只能由单个使用者以读写模式挂载。不允许同时写入。

<!--
See the [iSCSI example](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) for more details.
-->
更多详情请参考 [iSCSI 示例](https://github.com/kubernetes/examples/tree/master/volumes/iscsi)。

<!--
### local

A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported.
-->
### local

`local` 卷所代表的是某个被挂载的本地存储设备，例如磁盘、分区或者目录。

`local` 卷只能用作静态创建的持久卷。不支持动态配置。

<!--
Compared to `hostPath` volumes, `local` volumes are used in a durable and
portable manner without manually scheduling pods to nodes. The system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.
-->
与 `hostPath` 卷相比，`local` 卷能够以持久和可移植的方式使用，而无需手动将 Pod
调度到节点。系统通过查看 PersistentVolume 的节点亲和性配置，就能了解卷的节点约束。

<!--
However, `local` volumes are subject to the availability of the underlying
node and are not suitable for all applications. If a node becomes unhealthy,
then the `local` volume becomes inaccessible by the pod. The pod using this volume
is unable to run. Applications using `local` volumes must be able to tolerate this
reduced availability, as well as potential data loss, depending on the
durability characteristics of the underlying disk.

The following example shows a PersistentVolume using a `local` volume and
`nodeAffinity`:
-->
然而，`local` 卷仍然取决于底层节点的可用性，并不适合所有应用程序。
如果节点变得不健康，那么 `local` 卷也将变得不可被 Pod 访问。使用它的 Pod 将不能运行。
使用 `local` 卷的应用程序必须能够容忍这种可用性的降低，以及因底层磁盘的耐用性特征而带来的潜在的数据丢失风险。

下面是一个使用 `local` 卷和 `nodeAffinity` 的持久卷示例：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

<!--
You must set a PersistentVolume `nodeAffinity` when using `local` volumes.
The Kubernetes scheduler uses the PersistentVolume `nodeAffinity` to schedule
these Pods to the correct node.
-->
使用 `local` 卷时，你需要设置 PersistentVolume 对象的 `nodeAffinity` 字段。
Kubernetes 调度器使用 PersistentVolume 的 `nodeAffinity` 信息来将使用 `local`
卷的 Pod 调度到正确的节点。

<!--
PersistentVolume `volumeMode` can be set to "Block" (instead of the default
value "Filesystem") to expose the local volume as a raw block device.
-->
PersistentVolume 对象的 `volumeMode` 字段可被设置为 "Block"
（而不是默认值 "Filesystem"），以将 `local` 卷作为原始块设备暴露出来。

<!--
When using local volumes, it is recommended to create a StorageClass with
`volumeBindingMode` set to `WaitForFirstConsumer`. For more details, see the
local [StorageClass](/docs/concepts/storage/storage-classes/#local) example.
Delaying volume binding ensures that the PersistentVolumeClaim binding decision
will also be evaluated with any other node constraints the Pod may have,
such as node resource requirements, node selectors, Pod affinity, and Pod anti-affinity.
-->
使用 `local` 卷时，建议创建一个 StorageClass 并将其 `volumeBindingMode` 设置为
`WaitForFirstConsumer`。要了解更多详细信息，请参考
[local StorageClass 示例](/zh-cn/docs/concepts/storage/storage-classes/#local)。
延迟卷绑定的操作可以确保 Kubernetes 在为 PersistentVolumeClaim 作出绑定决策时，会评估
Pod 可能具有的其他节点约束，例如：如节点资源需求、节点选择器、Pod 亲和性和 Pod 反亲和性。

<!--
An external static provisioner can be run separately for improved management of
the local volume lifecycle. Note that this provisioner does not support dynamic
provisioning yet. For an example on how to run an external local provisioner,
see the [local volume provisioner user
guide](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).
-->
你可以在 Kubernetes 之外单独运行静态驱动以改进对 local 卷的生命周期管理。
请注意，此驱动尚不支持动态配置。
有关如何运行外部 `local` 卷驱动，请参考
[local 卷驱动用户指南](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)。

{{< note >}}
<!--
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
-->
如果不使用外部静态驱动来管理卷的生命周期，用户需要手动清理和删除 local 类型的持久卷。
{{< /note >}}

### nfs

<!--
An `nfs` volume allows an existing NFS (Network File System) share to be
mounted into a Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of an `nfs` volume are preserved and the volume is merely
unmounted. This means that an NFS volume can be pre-populated with data, and
that data can be shared between pods. NFS can be mounted by multiple
writers simultaneously.
-->
`nfs` 卷能将 NFS (网络文件系统) 挂载到你的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`nfs` 卷的内容在删除 Pod
时会被保存，卷只是被卸载。
这意味着 `nfs` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}}
<!--
You must have your own NFS server running with the share exported before you can use it.

Also note that you can't specify NFS mount options in a Pod spec. You can either set mount options server-side or
use [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html).
You can also mount NFS volumes via PersistentVolumes which do allow you to set mount options.
-->
在使用 NFS 卷之前，你必须运行自己的 NFS 服务器并将目标 share 导出备用。

还需要注意，不能在 Pod spec 中指定 NFS 挂载可选项。
可以选择设置服务端的挂载可选项，或者使用
[/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html)。
此外，还可以通过允许设置挂载可选项的持久卷挂载 NFS 卷。
{{< /note >}}

<!--
See the [NFS example](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)
for an example of mounting NFS volumes with PersistentVolumes.
-->
如需了解用持久卷挂载 NFS 卷的示例，请参考 [NFS 示例](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)。

### persistentVolumeClaim {#persistentvolumeclaim}

<!--
A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod. PersistentVolumeClaims
are a way for users to "claim" durable storage (such as an iSCSI volume)
without knowing the details of the particular cloud environment.
-->
`persistentVolumeClaim` 卷用来将[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)（PersistentVolume）挂载到 Pod 中。
持久卷申领（PersistentVolumeClaim）是用户在不知道特定云环境细节的情况下“申领”持久存储（例如 iSCSI 卷）的一种方法。

<!--
See the information about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) for more
details.
-->
更多详情请参考[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!--
### portworxVolume (deprecated) {#portworxvolume}
-->
### portworxVolume（已弃用） {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

<!--
A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage
in a server, tiers based on capabilities, and aggregates capacity across multiple servers.
Portworx runs in-guest in virtual machines or on bare metal Linux nodes.
-->
`portworxVolume` 是一个可伸缩的块存储层，能够以超融合（hyperconverged）的方式与 Kubernetes 一起运行。
[Portworx](https://portworx.com/use-case/kubernetes-storage/)
支持对服务器上存储的指纹处理、基于存储能力进行分层以及跨多个服务器整合存储容量。
Portworx 可以以 in-guest 方式在虚拟机中运行，也可以在裸金属 Linux 节点上运行。

<!--
A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Pod.
Here is an example Pod referencing a pre-provisioned Portworx volume:
-->
`portworxVolume` 类型的卷可以通过 Kubernetes 动态创建，也可以预先配备并在 Pod 内引用。
下面是一个引用预先配备的 Portworx 卷的示例 Pod：

<!--
# This Portworx volume must already exist.
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # 此 Portworx 卷必须已经存在
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
<!--
Make sure you have an existing PortworxVolume with name `pxvol`
before using it in the Pod.
-->
在 Pod 中使用 portworxVolume 之前，你要确保有一个名为 `pxvol` 的 PortworxVolume 存在。
{{< /note >}}

<!--
For more details, see the [Portworx volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md) examples.
-->
更多详情可以参考 [Portworx 卷](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md)。

<!--
#### Portworx CSI migration
-->
#### Portworx CSI 迁移

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

<!--
By default, Kubernetes {{% skew currentVersion %}} attempts to migrate legacy
Portworx volumes to use CSI. (CSI migration for Portworx has been available since
Kubernetes v1.23, but was only turned on by default since the v1.31 release).
If you want to disable automatic migration, you can set the `CSIMigrationPortworx`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to `false`; you need to make that change for the kube-controller-manager **and** on
every relevant kubelet.

It redirects all plugin operations from the existing in-tree plugin to the
`pxd.portworx.com` Container Storage Interface (CSI) Driver.
[Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)
must be installed on the cluster.
-->
默认情况下，Kubernetes {{% skew currentVersion %}} 尝试将传统的 Portworx 卷迁移为使用 CSI。
（Portworx 的 CSI 迁移自 Kubernetes v1.23 版本以来一直可用，但从 v1.31 版本开始才默认启用）。
如果你想禁用自动迁移，可以将 `CSIMigrationPortworx`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 设置为 `false`；
你需要在 kube-controller-manager **和** 每个相关的 kubelet 上进行此更改。

它将所有插件操作不再指向树内插件（In-Tree Plugin），转而指向
`pxd.portworx.com` 容器存储接口（Container Storage Interface，CSI）驱动。
[Portworx CSI 驱动程序](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)必须安装在集群上。

<!--
### projected

A projected volume maps several existing volume sources into the same
directory. For more details, see [projected volumes](/docs/concepts/storage/projected-volumes/).
-->
### 投射（projected）   {#projected}

投射卷能将若干现有的卷来源映射到同一目录上。更多详情请参考[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)。

<!--
### rbd (removed) {#rbd}
-->
### rbd（已移除）  {#rbd}

<!-- maintenance note: OK to remove all mention of rbd once the v1.30 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `rbd` volume type.

The [Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) in-tree storage driver and its csi migration support were deprecated in the Kubernetes v1.28 release
and then removed entirely in the v1.31 release.
-->
Kubernetes {{< skew currentVersion >}} 不包括 `rbd` 卷类型。

[Rados 块设备](https://docs.ceph.com/en/latest/rbd/)（RBD）
树内存储驱动及其 CSI 迁移支持在 Kubernetes v1.28 版本中被弃用，并在 v1.31 版本中被完全移除。

### secret

<!--
A `secret` volume is used to pass sensitive information, such as passwords, to
Pods. You can store secrets in the Kubernetes API and mount them as files for
use by pods without coupling to Kubernetes directly. `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.
-->
`secret` 卷用来给 Pod 传递敏感信息，例如密码。你可以将 Secret 存储在 Kubernetes
API 服务器上，然后以文件的形式挂载到 Pod 中，无需直接与 Kubernetes 耦合。
`secret` 卷由 tmpfs（基于 RAM 的文件系统）提供存储，因此它们永远不会被写入非易失性（持久化的）存储器。

{{< note >}}
<!--
* You must create a Secret in the Kubernetes API before you can use it.

* A Secret is always mounted as `readOnly`.

* A container using a Secret as a [`subPath`](#using-subpath) volume mount will not
receive Secret updates.
-->
* 使用前你必须在 Kubernetes API 中创建 Secret。
* Secret 总是以 `readOnly` 的模式挂载。
* 容器以 [`subPath`](#using-subpath) 卷挂载方式使用 Secret 时，将无法接收 Secret 的更新。
{{< /note >}}

<!--
For more details, see [Configuring Secrets](/docs/concepts/configuration/secret/).
-->
更多详情请参考[配置 Secrets](/zh-cn/docs/concepts/configuration/secret/)。

<!--
### vsphereVolume (deprecated) {#vspherevolume}
-->
### vsphereVolume（已弃用） {#vspherevolume}

{{< note >}}
<!--
The Kubernetes project recommends using the [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
out-of-tree storage driver instead.
-->
Kubernetes 项目建议转为使用 [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
树外存储驱动。
{{< /note >}}

<!--
A `vsphereVolume` is used to mount a vSphere VMDK Volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.
-->
`vsphereVolume` 用来将 vSphere VMDK 卷挂载到你的 Pod 中。
在卸载卷时，卷的内容会被保留。
vSphereVolume 卷类型支持 VMFS 和 VSAN 数据仓库。

<!--
For more information, see the [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) examples.
-->
进一步信息可参考
[vSphere 卷](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)。

<!--
#### vSphere CSI migration {#vsphere-csi-migration}
-->
#### vSphere CSI 迁移  {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `vsphereVolume` type
are redirected to the `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
-->
在 Kubernetes {{< skew currentVersion >}} 中，对树内 `vsphereVolume`
类的所有操作都会被重定向至 `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动程序。

<!--
[vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)
must be installed on the cluster. You can find additional advice on how to migrate in-tree `vsphereVolume` in VMware's documentation page
[Migrating In-Tree vSphere Volumes to vSphere Container Storage Plug-in](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html).
If vSphere CSI Driver is not installed volume operations can not be performed on the PV created with the in-tree `vsphereVolume` type.
-->
[vSphere CSI 驱动](https://github.com/kubernetes-sigs/vsphere-csi-driver)必须安装到集群上。
你可以在 VMware 的文档页面[迁移树内 vSphere 卷插件到 vSphere 容器存储插件](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html)
中找到有关如何迁移树内 `vsphereVolume` 的其他建议。
如果未安装 vSphere CSI 驱动程序，则无法对由树内 `vsphereVolume` 类型创建的 PV 执行卷操作。

<!--
You must run vSphere 7.0u2 or later in order to migrate to the vSphere CSI driver.

If you are running a version of Kubernetes other than v{{< skew currentVersion >}}, consult
the documentation for that version of Kubernetes.
-->
你必须运行 vSphere 7.0u2 或更高版本才能迁移到 vSphere CSI 驱动程序。

如果你正在运行 Kubernetes v{{< skew currentVersion >}}，请查阅该 Kubernetes 版本的文档。

{{< note >}}
<!--
The following StorageClass parameters from the built-in `vsphereVolume` plugin are not supported by the vSphere CSI driver:
-->
vSphere CSI 驱动不支持内置 `vsphereVolume` 的以下 StorageClass 参数：

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

<!--
Existing volumes created using these parameters will be migrated to the vSphere CSI driver,
but new volumes created by the vSphere CSI driver will not be honoring these parameters.
-->
使用这些参数创建的现有卷将被迁移到 vSphere CSI 驱动，不过使用 vSphere
CSI 驱动所创建的新卷都不会理会这些参数。

{{< /note >}}

<!--
#### vSphere CSI migration complete {#vsphere-csi-migration-complete}
-->
#### vSphere CSI 迁移完成   {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
To turn off the `vsphereVolume` plugin from being loaded by the controller manager and the kubelet, you need to set `InTreePluginvSphereUnregister` feature flag to `true`. You must install a `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver on all worker nodes.
-->
为了避免控制器管理器和 kubelet 加载 `vsphereVolume` 插件，你需要将
`InTreePluginvSphereUnregister` 特性设置为 `true`。你还必须在所有工作节点上安装
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

<!--
## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single pod.
The `volumeMounts[*].subPath` property specifies a sub-path inside the referenced volume
instead of its root.
-->
## 使用 subPath  {#using-subpath}

有时，在单个 Pod 中共享卷以供多方使用是很有用的。
`volumeMounts[*].subPath` 属性可用于指定所引用的卷内的子路径，而不是其根路径。

<!--
The following example shows how to configure a Pod with a LAMP stack (Linux Apache MySQL PHP)
using a single, shared volume. This sample `subPath` configuration is not recommended
for production use.

The PHP application's code and assets map to the volume's `html` folder and
the MySQL database is stored in the volume's `mysql` folder. For example:
-->
下面例子展示了如何配置某包含 LAMP 堆栈（Linux Apache MySQL PHP）的 Pod 使用同一共享卷。
此示例中的 `subPath` 配置不建议在生产环境中使用。
PHP 应用的代码和相关数据映射到卷的 `html` 文件夹，MySQL 数据库存储在卷的 `mysql` 文件夹中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

<!--
### Using subPath with expanded environment variables {#using-subpath-expanded-environment}
-->
### 使用带有扩展环境变量的 subPath  {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Use the `subPathExpr` field to construct `subPath` directory names from
downward API environment variables.
The `subPath` and `subPathExpr` properties are mutually exclusive.
-->
使用 `subPathExpr` 字段可以基于 downward API 环境变量来构造 `subPath` 目录名。
`subPath` 和 `subPathExpr` 属性是互斥的。

<!--
In this example, a `Pod` uses `subPathExpr` to create a directory `pod1` within
the `hostPath` volume `/var/log/pods`.
The `hostPath` volume takes the `Pod` name from the `downwardAPI`.
The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.
-->
在这个示例中，`Pod` 使用 `subPathExpr` 来 `hostPath` 卷 `/var/log/pods` 中创建目录 `pod1`。
`hostPath` 卷采用来自 `downwardAPI` 的 Pod 名称生成目录名。
宿主机目录 `/var/log/pods/pod1` 被挂载到容器的 `/logs` 中。

<!--
# The variable expansion uses round brackets (not curly brackets).
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # 包裹变量名的是小括号，而不是大括号
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

<!--
## Resources

The storage media (such as Disk or SSD) of an `emptyDir` volume is determined by the
medium of the filesystem holding the kubelet root dir (typically
`/var/lib/kubelet`). There is no limit on how much space an `emptyDir` or
`hostPath` volume can consume, and no isolation between containers or between
pods.
-->
## 资源   {#resources}

`emptyDir` 卷的存储介质（例如磁盘、SSD 等）是由保存 kubelet
数据的根目录（通常是 `/var/lib/kubelet`）的文件系统的介质确定。
Kubernetes 对 `emptyDir` 卷或者 `hostPath` 卷可以消耗的空间没有限制，容器之间或 Pod 之间也没有隔离。

<!--
To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).
-->
要了解如何使用资源规约来请求空间，
可参考[如何管理资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。

<!--
## Out-of-tree volume plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), and also FlexVolume (which is deprecated). These plugins enable storage vendors to create custom storage plugins
without adding their plugin source code to the Kubernetes repository.
-->
## 树外（Out-of-Tree）卷插件    {#out-of-tree-volume-plugins}

Out-of-Tree 卷插件包括{{< glossary_tooltip text="容器存储接口（CSI）" term_id="csi" >}}和
FlexVolume（已弃用）。它们使存储供应商能够创建自定义存储插件，而无需将插件源码添加到
Kubernetes 代码仓库。

<!--
Previously, all volume plugins were "in-tree". The "in-tree" plugins were built, linked, compiled,
and shipped with the core Kubernetes binaries. This meant that adding a new storage system to
Kubernetes (a volume plugin) required checking code into the core Kubernetes code repository.
-->
以前，所有卷插件（如上面列出的卷类型）都是“树内（In-Tree）”的。
“树内”插件是与 Kubernetes 的核心组件一同构建、链接、编译和交付的。
这意味着向 Kubernetes 添加新的存储系统（卷插件）需要将代码合并到 Kubernetes 核心代码库中。

<!--
Both CSI and FlexVolume allow volume plugins to be developed independent of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to the [volume plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
CSI 和 FlexVolume 都允许独立于 Kubernetes 代码库开发卷插件，并作为扩展部署（安装）在 Kubernetes 集群上。

对于希望创建树外（Out-Of-Tree）卷插件的存储供应商，
请参考[卷插件常见问题](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)。

### CSI

<!--
[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.
-->
[容器存储接口](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
为容器编排系统（如 Kubernetes）定义标准接口，以将任意存储系统暴露给它们的容器工作负载。

<!--
Please read the [CSI design proposal](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md) for more information.

CSI support was introduced as alpha in Kubernetes v1.9, moved to beta in
Kubernetes v1.10, and is GA in Kubernetes v1.13.
-->
更多详情请阅读 [CSI 设计方案](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)。

{{< note >}}
<!--
Support for CSI spec versions 0.2 and 0.3 are deprecated in Kubernetes
v1.13 and will be removed in a future release.
-->
Kubernetes v1.13 废弃了对 CSI 规范版本 0.2 和 0.3 的支持，并将在以后的版本中删除。
{{< /note >}}

{{< note >}}
<!--
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
-->
CSI 驱动可能并非兼容所有的 Kubernetes 版本。
请查看特定 CSI 驱动的文档，以了解各个 Kubernetes 版本所支持的部署步骤以及兼容性列表。
{{< /note >}}

<!--
Once a CSI compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach or mount the volumes exposed by the
CSI driver.

A `csi` volume can be used in a Pod in three different ways:

* through a reference to a [PersistentVolumeClaim](#persistentvolumeclaim)
* with a [generic ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* with a [CSI ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) if the driver supports that
-->
一旦在 Kubernetes 集群上部署了 CSI 兼容卷驱动程序，用户就可以使用
`csi` 卷类型来挂接、挂载 CSI 驱动所提供的卷。

`csi` 卷可以在 Pod 中以三种方式使用：

* 通过 [PersistentVolumeClaim](#persistentvolumeclaim) 对象引用
* 使用[一般性的临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* 使用 [CSI 临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)，
  前提是驱动支持这种用法

<!--
The following fields are available to storage administrators to configure a CSI
persistent volume:
-->
存储管理员可以使用以下字段来配置 CSI 持久卷：

<!--
* `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
-->
* `driver`：指定要使用的卷驱动名称的字符串值。
  这个值必须与 CSI 驱动程序在 `GetPluginInfoResponse` 中返回的值相对应；该接口定义在
  [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)中。
  Kubernetes 使用所给的值来标识要调用的 CSI 驱动程序；CSI
  驱动程序也使用该值来辨识哪些 PV 对象属于该 CSI 驱动程序。

<!--
* `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` on all calls to the CSI volume driver when
  referencing the volume.
-->
* `volumeHandle`：唯一标识卷的字符串值。
  该值必须与 CSI 驱动在 `CreateVolumeResponse` 的 `volume_id` 字段中返回的值相对应；接口定义在
  [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中。
  在所有对 CSI 卷驱动程序的调用中，引用该 CSI 卷时都使用此值作为 `volume_id` 参数。

<!--
* `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is passed
  to the CSI driver via the `readonly` field in the `ControllerPublishVolumeRequest`.
-->
* `readOnly`：一个可选的布尔值，指示通过 `ControllerPublished` 关联该卷时是否设置该卷为只读。默认值是 false。
  该值通过 `ControllerPublishVolumeRequest` 中的 `readonly` 字段传递给 CSI 驱动。

<!--
* `fsType`: If the PV's `VolumeMode` is `Filesystem` then this field may be used
  to specify the filesystem that should be used to mount the volume. If the
  volume has not been formatted and formatting is supported, this value will be
  used to format the volume.
  This value is passed to the CSI driver via the `VolumeCapability` field of
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
* `fsType`：如果 PV 的 `VolumeMode` 为 `Filesystem`，那么此字段指定挂载卷时应该使用的文件系统。
  如果卷尚未格式化，并且支持格式化，此值将用于格式化卷。
  此值可以通过 `ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 的 `VolumeCapability` 字段传递给 CSI 驱动。

<!--
* `volumeAttributes`: A map of string to string that specifies static properties
  of a volume. This map must correspond to the map returned in the
  `volume.attributes` field of the `CreateVolumeResponse` by the CSI driver as
  defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The map is passed to the CSI driver via the `volume_context` field in the
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
* `volumeAttributes`：一个字符串到字符串的映射表，用来设置卷的静态属性。
  该映射必须与 CSI 驱动程序返回的 `CreateVolumeResponse` 中的 `volume.attributes`
  字段的映射相对应；
  [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)中有相应的定义。
  该映射通过`ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 中的 `volume_context` 字段传递给 CSI 驱动。

<!--
* `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the Secret
  contains more than one secret, all secrets are passed.
-->
* `controllerPublishSecretRef`：对包含敏感信息的 Secret 对象的引用；
  该敏感信息会被传递给 CSI 驱动来完成 CSI `ControllerPublishVolume` 和
  `ControllerUnpublishVolume` 调用。
  此字段是可选的；在不需要 Secret 时可以是空的。
  如果 Secret 包含多个 Secret 条目，则所有的 Secret 条目都会被传递。

<!--
* `nodeExpandSecretRef`: A reference to the secret containing sensitive
  information to pass to the CSI driver to complete the CSI
  `NodeExpandVolume` call. This field is optional, and may be empty if no
  secret is required. If the object contains more than one secret, all
  secrets are passed.  When you have configured secret data for node-initiated
  volume expansion, the kubelet passes that data via the `NodeExpandVolume()`
  call to the CSI driver. All supported versions of Kubernetes offer the
  `nodeExpandSecretRef` field, and have it available by default. Kubernetes releases
  prior to v1.25 did not include this support.
* Enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/)
  named `CSINodeExpandSecret` for each kube-apiserver and for the kubelet on every
  node. Since Kubernetes version 1.27 this feature has been enabled by default
  and no explicit enablement of the feature gate is required.
  You must also be using a CSI driver that supports or requires secret data during
  node-initiated storage resize operations.
-->
* `nodeExpandSecretRef`：对包含敏感信息的 Secret 对象的引用，
  该信息会传递给 CSI 驱动以完成 CSI `NodeExpandVolume` 调用。
  此字段是可选的，如果不需要 Secret，则可能是空的。
  如果 Secret 包含多个 Secret 条目，则传递所有 Secret 条目。
  当你为节点初始化的卷扩展配置 Secret 数据时，kubelet 会通过 `NodeExpandVolume()`
  调用将该数据传递给 CSI 驱动。所有受支持的 Kubernetes 版本都提供 `nodeExpandSecretRef` 字段，
  并且默认可用。Kubernetes v1.25 之前的版本不包括此支持。
  为每个 kube-apiserver 和每个节点上的 kubelet 启用名为 `CSINodeExpandSecret` 的
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed/)。
  自 Kubernetes 1.27 版本起，此特性已默认启用，无需显式启用特性门控。
  在节点初始化的存储大小调整操作期间，你还必须使用支持或需要 Secret 数据的 CSI 驱动。

<!--
* `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional, and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
-->
* `nodePublishSecretRef`：对包含敏感信息的 Secret 对象的引用。
  该信息传递给 CSI 驱动来完成 CSI `NodePublishVolume` 调用。
  此字段是可选的，如果不需要 Secret，则可能是空的。
  如果 Secret 对象包含多个 Secret 条目，则传递所有 Secret 条目。

<!--
* `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional, and may be empty if no secret
  is required. If the Secret contains more than one secret, all secrets
  are passed.
-->
* `nodeStageSecretRef`：对包含敏感信息的 Secret 对象的引用，
  该信息会传递给 CSI 驱动以完成 CSI `NodeStageVolume` 调用。
  此字段是可选的，如果不需要 Secret，则可能是空的。
  如果 Secret 包含多个 Secret 条目，则传递所有 Secret 条目。

<!--
#### CSI raw block volume support
-->
#### CSI 原始块卷支持    {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Vendors with external CSI drivers can implement raw block volume support
in Kubernetes workloads.
-->
具有外部 CSI 驱动程序的供应商能够在 Kubernetes 工作负载中实现原始块卷支持。

<!--
You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) as usual, without any CSI specific changes.
-->
你可以和以前一样，
安装自己的[带有原始块卷支持的 PV/PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)，
采用 CSI 对此过程没有影响。

<!--
#### CSI ephemeral volumes
-->
#### CSI 临时卷   {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across pod restarts. See [Ephemeral
Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
for more information.
-->
你可以直接在 Pod 规约中配置 CSI 卷。采用这种方式配置的卷都是临时卷，
无法在 Pod 重新启动后继续存在。
进一步的信息可参阅[临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)。

<!--
For more information on how to develop a CSI driver, refer to the
[kubernetes-csi documentation](https://kubernetes-csi.github.io/docs/)
-->
有关如何开发 CSI 驱动的更多信息，请参考 [kubernetes-csi 文档](https://kubernetes-csi.github.io/docs/)。

<!--
#### Windows CSI proxy
-->
#### Windows CSI 代理  {#windows-csi-proxy}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
CSI node plugins need to perform various privileged
operations like scanning of disk devices and mounting of file systems. These operations
differ for each host operating system. For Linux worker nodes, containerized CSI node
node plugins are typically deployed as privileged containers. For Windows worker nodes,
privileged operations for containerized CSI node plugins is supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.
-->
CSI 节点插件需要执行多种特权操作，例如扫描磁盘设备和挂载文件系统等。
这些操作在每个宿主机操作系统上都是不同的。对于 Linux 工作节点而言，容器化的 CSI
节点插件通常部署为特权容器。对于 Windows 工作节点而言，容器化 CSI
节点插件的特权操作是通过 [csi-proxy](https://github.com/kubernetes-csi/csi-proxy)
来支持的。csi-proxy 是一个由社区管理的、独立的可执行二进制文件，
需要被预安装到每个 Windows 节点上。

要了解更多的细节，可以参考你要部署的 CSI 插件的部署指南。

<!--
#### Migrating to CSI drivers from in-tree plugins
-->
#### 从树内插件迁移到 CSI 驱动程序  {#migrating-to-csi-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The `CSIMigration` feature directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.
-->
`CSIMigration` 特性针对现有树内插件的操作会被定向到相应的 CSI 插件（应已安装和配置）。
因此，操作员在过渡到取代树内插件的 CSI 驱动时，无需对现有存储类、PV 或 PVC（指树内插件）进行任何配置更改。

{{< note >}}
<!--
Existing PVs created by a in-tree volume plugin can still be used in the future without any configuration
changes, even after the migration to CSI is completed for that volume type, and even after you upgrade to a
version of Kubernetes that doesn't have compiled-in support for that kind of storage.

As part of that migration, you - or another cluster administrator - **must** have installed and configured
the appropriate CSI driver for that storage. The core of Kubernetes does not install that software for you.
-->
即使你针对这种卷完成了 CSI 迁移且你升级到不再内置对这种存储类别的支持的 Kubernetes 版本，
现有的由树内卷插件所创建的 PV 在未来无需进行任何配置更改就可以使用，

作为迁移的一部分，你或其他集群管理员**必须**安装和配置适用于该存储的 CSI 驱动。
Kubernetes 不会为你安装该软件。

---

<!--
After that migration, you can also define new PVCs and PVs that refer to the legacy, built-in
storage integrations.
Provided you have the appropriate CSI driver installed and configured, the PV creation continues
to work, even for brand new volumes. The actual storage management now happens through
the CSI driver.
-->
在完成迁移之后，你也可以定义新的 PVC 和 PV，引用原来的、内置的集成存储。
只要你安装并配置了适当的 CSI 驱动，即使是全新的卷，PV 的创建仍然可以继续工作。
实际的存储管理现在通过 CSI 驱动来进行。
{{< /note >}}

<!--
The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.
-->
所支持的操作和特性包括：配备（Provisioning）/删除、挂接（Attach）/解挂（Detach）、
挂载（Mount）/卸载（Unmount）和调整卷大小。

<!--
In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).

The following in-tree plugins support persistent storage on Windows nodes:
-->
上面的[卷类型](#volume-types)节列出了支持 `CSIMigration` 并已实现相应 CSI
驱动程序的树内插件。

下面是支持 Windows 节点上持久性存储的树内插件：

* [`azureFile`](#azurefile)
* [`gcePersistentDisk`](#gcepersistentdisk)
* [`vsphereVolume`](#vspherevolume)

<!--
### flexVolume (deprecated)   {#flexvolume}
-->
### flexVolume（已弃用）   {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

<!--
FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.
For more details, see the FlexVolume [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) document.
-->
FlexVolume 是一个使用基于 exec 的模型来与驱动程序对接的树外插件接口。
用户必须在每个节点上的预定义卷插件路径中安装 FlexVolume
驱动程序可执行文件，在某些情况下，控制平面节点中也要安装。

Pod 通过 `flexvolume` 树内插件与 FlexVolume 驱动程序交互。
更多详情请参考 FlexVolume
[README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) 文档。

<!--
The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:
-->
下面的 FlexVolume [插件](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)
以 PowerShell 脚本的形式部署在宿主机系统上，支持 Windows 节点：

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
<!--
FlexVolume is deprecated. Using an out-of-tree CSI driver is the recommended way to integrate external storage with Kubernetes.

Maintainers of FlexVolume driver should implement a CSI Driver and help to migrate users of FlexVolume drivers to CSI.
Users of FlexVolume should move their workloads to use the equivalent CSI Driver.
-->
FlexVolume 已被弃用。推荐使用树外 CSI 驱动来将外部存储整合进 Kubernetes。

FlexVolume 驱动的维护者应开发一个 CSI 驱动并帮助用户从 FlexVolume 驱动迁移到 CSI。
FlexVolume 用户应迁移工作负载以使用对等的 CSI 驱动。
{{< /note >}}

<!--
## Mount propagation

Mount propagation allows for sharing volumes mounted by a container to
other containers in the same pod, or even to other pods on the same node.

Mount propagation of a volume is controlled by the `mountPropagation` field
in `containers[*].volumeMounts`. Its values are:
-->
## 挂载卷的传播   {#mount-propagation}

挂载卷的传播能力允许将容器安装的卷共享到同一 Pod 中的其他容器，甚至共享到同一节点上的其他 Pod。

卷的挂载传播特性由 `containers[*].volumeMounts` 中的 `mountPropagation` 字段控制。
它的值包括：

<!--
* `None` - This volume mount will not receive any subsequent mounts
  that are mounted to this volume or any of its subdirectories by the host.
  In similar fashion, no mounts created by the container will be visible on
  the host. This is the default mode.

  This mode is equal to `rprivate` mount propagation as described in
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)

  However, the CRI runtime may choose `rslave` mount propagation (i.e.,
  `HostToContainer`) instead, when `rprivate` propagation is not applicable.
  cri-dockerd (Docker) is known to choose `rslave` mount propagation when the
  mount source contains the Docker daemon's root directory (`/var/lib/docker`).
-->
* `None` - 此卷挂载将不会感知到主机后续在此卷或其任何子目录上执行的挂载变化。
  类似的，容器所创建的卷挂载在主机上是不可见的。这是默认模式。

  该模式等同于 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html) 中描述的
  `rprivate` 挂载传播选项。

  然而，当 `rprivate` 传播选项不适用时，CRI 运行时可以转为选择 `rslave` 挂载传播选项
  （即 `HostToContainer`）。当挂载源包含 Docker 守护进程的根目录（`/var/lib/docker`）时，
  cri-dockerd (Docker) 已知可以选择 `rslave` 挂载传播选项。

<!--
* `HostToContainer` - This volume mount will receive all subsequent mounts
  that are mounted to this volume or any of its subdirectories.

  In other words, if the host mounts anything inside the volume mount, the
  container will see it mounted there.

  Similarly, if any Pod with `Bidirectional` mount propagation to the same
  volume mounts anything there, the container with `HostToContainer` mount
  propagation will see it.

  This mode is equal to `rslave` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)
-->
* `HostToContainer` - 此卷挂载将会感知到主机后续针对此卷或其任何子目录的挂载操作。

  换句话说，如果主机在此挂载卷中挂载任何内容，容器将能看到它被挂载在那里。

  类似的，配置了 `Bidirectional` 挂载传播选项的 Pod 如果在同一卷上挂载了内容，挂载传播设置为
  `HostToContainer` 的容器都将能看到这一变化。

  该模式等同于 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)中描述的
  `rslave` 挂载传播选项。

<!--
* `Bidirectional` - This volume mount behaves the same the `HostToContainer` mount.
  In addition, all volume mounts created by the container will be propagated
  back to the host and to all containers of all pods that use the same volume.

  A typical use case for this mode is a Pod with a FlexVolume or CSI driver or
  a Pod that needs to mount something on the host using a `hostPath` volume.

  This mode is equal to `rshared` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)
-->
* `Bidirectional` - 这种卷挂载和 `HostToContainer` 挂载表现相同。
  另外，容器创建的卷挂载将被传播回至主机和使用同一卷的所有 Pod 的所有容器。

  该模式等同于 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html) 中描述的
  `rshared` 挂载传播选项。

  {{< warning >}}
  <!--
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system and therefore it is allowed only in privileged
  containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by containers in pods must be destroyed
  (unmounted) by the containers on termination.
  -->
  `Bidirectional` 形式的挂载传播可能比较危险。
  它可以破坏主机操作系统，因此它只被允许在特权容器中使用。
  强烈建议你熟悉 Linux 内核行为。
  此外，由 Pod 中的容器创建的任何卷挂载必须在终止时由容器销毁（卸载）。
  {{< /warning >}}

<!--
## Read-only mounts

A mount can be made read-only by setting the `.spec.containers[].volumeMounts[].readOnly`
field to `true`.
This does not make the volume itself read-only, but that specific container will
not be able to write to it.
Other containers in the Pod may mount the same volume as read-write.
-->
## 只读挂载   {#read-only-mounts}

通过将 `.spec.containers[].volumeMounts[].readOnly` 字段设置为 `true` 可以使挂载只读。
这不会使卷本身只读，但该容器将无法写入此卷。
Pod 中的其他容器可以以读写方式挂载同一个卷。

<!--
On Linux, read-only mounts are not recursively read-only by default.
For example, consider a Pod which mounts the hosts `/mnt` as a `hostPath` volume.  If
there is another filesystem mounted read-write on `/mnt/<SUBMOUNT>` (such as tmpfs,
NFS, or USB storage), the volume mounted into the container(s) will also have a writeable
`/mnt/<SUBMOUNT>`, even if the mount itself was specified as read-only.
-->
在 Linux 上，只读挂载默认不会以递归方式只读。
假如有一个 Pod 将主机的 `/mnt` 挂载为 `hostPath` 卷。
如果在 `/mnt/<SUBMOUNT>` 上有另一个以读写方式挂载的文件系统（如 tmpfs、NFS 或 USB 存储），
即使挂载本身被指定为只读，挂载到容器中的卷 `/mnt/<SUBMOUNT>` 也是可写的。

<!--
### Recursive read-only mounts
-->
### 递归只读挂载    {#recursive-read-only-mounts}

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

<!--
Recursive read-only mounts can be enabled by setting the
`RecursiveReadOnlyMounts` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for kubelet and kube-apiserver, and setting the `.spec.containers[].volumeMounts[].recursiveReadOnly`
field for a pod.
-->
通过为 kubelet 和 kube-apiserver 设置 `RecursiveReadOnlyMounts`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并为 Pod 设置 `.spec.containers[].volumeMounts[].recursiveReadOnly` 字段，
递归只读挂载可以被启用。

<!--
The allowed values are:

* `Disabled` (default): no effect.
-->
允许的值为：

* `Disabled`（默认）：无效果。

<!--
* `Enabled`: makes the mount recursively read-only.
  Needs all the following requirements to be satisfied:
  * `readOnly` is set to `true`
  * `mountPropagation` is unset, or, set to `None`
  * The host is running with Linux kernel v5.12 or later
  * The [CRI-level](/docs/concepts/architecture/cri) container runtime supports recursive read-only mounts
  * The OCI-level container runtime supports recursive read-only mounts.
  It will fail if any of these is not true.
-->
* `Enabled`：使挂载递归只读。需要满足以下所有要求：

  * `readOnly` 设置为 `true`
  * `mountPropagation` 不设置，或设置为 `None`
  * 主机运行 Linux 内核 v5.12 或更高版本
  * [CRI 级别](/zh-cn/docs/concepts/architecture/cri)的容器运行时支持递归只读挂载
  * OCI 级别的容器运行时支持递归只读挂载

  如果其中任何一个不满足，递归只读挂载将会失败。

<!--
* `IfPossible`: attempts to apply `Enabled`, and falls back to `Disabled`
  if the feature is not supported by the kernel or the runtime class.

Example:
-->
* `IfPossible`：尝试应用 `Enabled`，如果内核或运行时类不支持该特性，则回退为 `Disabled`。

示例：

{{% code_sample file="storage/rro.yaml" %}}

<!--
When this property is recognized by kubelet and kube-apiserver,
the `.status.containerStatuses[].volumeMounts[].recursiveReadOnly` field is set to either
`Enabled` or `Disabled`.

#### Implementations {#implementations-rro}
-->
当此属性被 kubelet 和 kube-apiserver 识别到时，
`.status.containerStatuses[].volumeMounts[].recursiveReadOnly` 字段将被设置为 `Enabled` 或 `Disabled`。

#### 实现   {#implementations-rro}

{{% thirdparty-content %}}

<!--
The following container runtimes are known to support recursive read-only mounts.

CRI-level:
- [containerd](https://containerd.io/), since v2.0

OCI-level:
- [runc](https://runc.io/), since v1.1
- [crun](https://github.com/containers/crun), since v1.8.6
-->
以下容器运行时已知支持递归只读挂载。

CRI 级别：

- [containerd](https://containerd.io/)，自 v2.0 起

OCI 级别：

- [runc](https://runc.io/)，自 v1.1 起
- [crun](https://github.com/containers/crun)，自 v1.8.6 起

## {{% heading "whatsnext" %}}

<!--
Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
-->
参考[使用持久卷部署 WordPress 和 MySQL](/zh-cn/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/) 示例。
