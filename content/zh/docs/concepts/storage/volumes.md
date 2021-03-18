---
title: 卷
content_type: concept
weight: 10
---

<!--
title: Volumes
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
On-disk files in a Container are ephemeral, which presents some problems for
non-trivial applications when running in containers. One problem
is the loss of files when a container crashes. The kubelet restarts the container
but with a clean state. A second problem occurs when sharing files
between containers running together in a `Pod`.
The Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} abstraction
solves both of these problems.
-->
Container 中的文件在磁盘上是临时存放的，这给 Container 中运行的较重要的应用
程序带来一些问题。问题之一是当容器崩溃时文件丢失。kubelet 会重新启动容器，
但容器会以干净的状态重启。
第二个问题会在同一 `Pod` 中运行多个容器并共享文件时出现。
Kubernetes {{< glossary_tooltip text="卷（Volume）" term_id="volume" >}}
这一抽象概念能够解决这两个问题。

<!--
Familiarity with [Pods](/docs/user-guide/pods) is suggested.
-->
阅读本文前建议你熟悉一下 [Pods](/zh/docs/concepts/workloads/pods)。 

<!-- body -->

<!--
## Background

Docker has a concept of
[volumes](https://docs.docker.com/storage/), though it is
somewhat looser and less managed. A Docker volume is a directory on
disk or in another container. Docker provides volume
drivers, but the functionality is somewhat limited.
-->
## 背景  {#background}

Docker 也有 [卷（Volume）](https://docs.docker.com/storage/) 的概念，但对它只有少量且松散的管理。
Docker 卷是磁盘上或者另外一个容器内的一个目录。
Docker 提供卷驱动程序，但是其功能非常有限。

<!--
Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
Ephemeral volume types have a lifetime of a pod, but persistent volumes exist beyond
the lifetime of a pod. Consequently, a volume outlives any containers
that run within the pod, and data is preserved across container restarts. When a
pod ceases to exist, Kubernetes destroys ephemeral volumes; however, Kubernetes does not
destroy persistent volumes.
-->
Kubernetes 支持很多类型的卷。
{{< glossary_tooltip term_id="pod" text="Pod" >}} 可以同时使用任意数目的卷类型。
临时卷类型的生命周期与 Pod 相同，但持久卷可以比 Pod 的存活期长。
因此，卷的存在时间会超出 Pod 中运行的所有容器，并且在容器重新启动时数据也会得到保留。
当 Pod 不再存在时，临时卷也将不再存在。但是持久卷会继续存在。

<!--
At its core, a volume is just a directory, possibly with some data in it, which
is accessible to the Containers in a Pod.  How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.
-->
卷的核心是包含一些数据的一个目录，Pod 中的容器可以访问该目录。
所采用的特定的卷类型将决定该目录如何形成的、使用何种介质保存数据以及目录中存放
的内容。

<!--
To use a volume, specify the volumes to provide for the Pod in `.spec.volumes`
and declare where to mount those volumes into containers in `.spec.containers[*].volumeMounts`.
A process in a container sees a filesystem view composed from their Docker
image and volumes. The [Docker image](https://docs.docker.com/userguide/dockerimages/)
is at the root of the filesystem hierarchy. Volumes mount at the specified paths within
the image. Volumes can not mount onto other volumes or have hard links to
other volumes. Each Container in the Pod's configuration must independently specify where to
mount each volume.
-->
使用卷时, 在 `.spec.volumes` 字段中设置为 Pod 提供的卷，并在
`.spec.containers[*].volumeMounts` 字段中声明卷在容器中的挂载位置。
容器中的进程看到的是由它们的 Docker 镜像和卷组成的文件系统视图。
[Docker 镜像](https://docs.docker.com/userguide/dockerimages/) 
位于文件系统层次结构的根部。各个卷则挂载在镜像内的指定路径上。
卷不能挂载到其他卷之上，也不能与其他卷有硬链接。
Pod 配置中的每个容器必须独立指定各个卷的挂载位置。

<!--
## Types of Volumes

Kubernetes supports several types of Volumes:
-->
## 卷类型  {#volume-types}

Kubernetes 支持下列类型的卷：

### awsElasticBlockStore {#awselasticblockstore}

<!--
An `awsElasticBlockStore` volume mounts an Amazon Web Services (AWS)
[EBS Volume](http://aws.amazon.com/ebs/) into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of an EBS
volume are persisted and the volume is unmounted. This means that an
EBS volume can be pre-populated with data, and that data can be shared between pods.
-->
`awsElasticBlockStore` 卷将 Amazon Web服务（AWS）[EBS 卷](https://aws.amazon.com/ebs/)
挂载到你的 Pod 中。与 `emptyDir` 在 Pod 被删除时也被删除不同，EBS 卷的内容在删除 Pod 时
会被保留，卷只是被卸载掉了。
这意味着 EBS 卷可以预先填充数据，并且该数据可以在 Pod 之间共享。

<!--
You must create an EBS volume using `aws ec2 create-volume` or the AWS API before you can use it.
-->
{{< note >}}
你在使用 EBS 卷之前必须使用 `aws ec2 create-volume` 命令或者 AWS API 创建该卷。
{{< /note >}}

<!--
There are some restrictions when using an `awsElasticBlockStore` volume:

* the nodes on which Pods are running must be AWS EC2 instances
* those instances need to be in the same region and availability-zone as the EBS volume
* EBS only supports a single EC2 instance mounting a volume
-->
使用 `awsElasticBlockStore` 卷时有一些限制：

* Pod 运行所在的节点必须是 AWS EC2 实例。
* 这些实例需要与 EBS 卷在相同的地域（Region）和可用区（Availability-Zone）。
* EBS 卷只支持被挂载到单个 EC2 实例上。

<!--
#### Creating an EBS volume

Before you can use an EBS volume with a Pod, you need to create it.
-->
#### 创建 EBS 卷

在将 EBS 卷用到 Pod 上之前，你首先要创建它。

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

<!--
Make sure the zone matches the zone you brought up your cluster in. Check that the size and
EBS volume type are suitable for your use.
-->
确保该区域与你的群集所在的区域相匹配。还要检查卷的大小和 EBS 卷类型都适合你的用途。

<!--
#### AWS EBS Example configuration
-->
#### AWS EBS 配置示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # 此 AWS EBS 卷必须已经存在
    awsElasticBlockStore:
      volumeID: "<volume-id>"
      fsType: ext4
```

<!--
If the EBS volume is partitioned, you can supply the optional field `partition: "<partition number>"` to specify which parition to mount on.
-->
如果 EBS 卷是分区的，你可以提供可选的字段 `partition: "<partition number>"` 来指定要挂载到哪个分区上。

<!--
#### AWS EBS CSI migration
-->
#### AWS EBS CSI 卷迁移

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The `CSIMigration` feature for `awsElasticBlockStore`, when enabled, redirects
all plugin operations from the existing in-tree plugin to the `ebs.csi.aws.com` Container
Storage Interface (CSI) driver. In order to use this feature, the [AWS EBS CSI
driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAWS`
beta features must be enabled.
-->
如果启用了对 `awsElasticBlockStore` 的 `CSIMigration` 特性支持，所有插件操作都
不再指向树内插件（In-Tree Plugin），转而指向 `ebs.csi.aws.com` 容器存储接口
（Container Storage Interface，CSI）驱动。为了使用此特性，必须在集群中安装
[AWS EBS CSI 驱动](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)，
并确保 `CSIMigration` 和 `CSIMigrationAWS` Beta 功能特性被启用。

<!--
#### AWS EBS CSI migration complete
-->
#### AWS EBS CSI 迁移结束

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

<!--
To disable the `awsElasticBlockStore` storage plugin from being loaded by the controller manager
and the kubelet, set the `CSIMigrationAWSComplete` flag to `true`. This feature requires the `ebs.csi.aws.com` Container Storage Interface (CSI) driver installed on all worker nodes.
-->
如欲禁止 `awsElasticBlockStore` 存储插件被控制器管理器和 kubelet
组件加载，可将 `CSIMigrationAWSComplete` 特性门控设置为 `true`。此特性要求在
集群中所有工作节点上安装 `ebs.csi.aws.com` 容器存储接口驱动。

### azureDisk {#azuredisk}

<!--
The `azureDisk` volume type mounts a Microsoft Azure [Data Disk](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers) into a pod.

For more details, see the [`azureDisk` volume plugin](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_disk/README.md).
-->

`azureDisk` 卷类型用来在 Pod 上挂载 Microsoft Azure
[数据盘（Data Disk）](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) 。
若需了解更多详情，请参考 [`azureDisk` 卷插件](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_disk/README.md)。

<!--
#### azureDisk CSI Migration
-->
#### azureDisk 的 CSI 迁移  {#azuredisk-csi-migration}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
The `CSIMigration` feature for `azureDisk`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `disk.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure Disk CSI
Driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAzureDisk`
features must be enabled.
-->

启用 `azureDisk` 的 `CSIMigration` 功能后，所有插件操作从现有的树内插件重定向到
`disk.csi.azure.com` 容器存储接口（CSI）驱动程序。
为了使用此功能，必须在集群中安装
[Azure 磁盘 CSI 驱动程序](https://github.com/kubernetes-sigs/azuredisk-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationAzureDisk` 功能必须被启用。

### azureFile {#azurefile}

<!--
The `azureFile` volume type mounts a Microsoft Azure File volume (SMB 2.1 and 3.0)
into a Pod.

For more details, see the [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_file/README.md).
-->
`azureFile` 卷类型用来在 Pod 上挂载 Microsoft Azure 文件卷（File Volume）（SMB 2.1 和 3.0）。
更多详情请参考 [`azureFile` 卷插件](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_file/README.md)。

<!--
#### azureFile CSI migration
-->
#### CSI 迁移  {#azurefile-csi-migration}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

<!--
The CSI Migration feature for azureFile, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAzureFile`
Alpha features must be enabled.
-->
启用 `azureFile` 的 `CSIMigration` 功能后，所有插件操作将从现有的树内插件重定向到
`file.csi.azure.com` 容器存储接口（CSI）驱动程序。
要使用此功能，必须在集群中安装 [Azure 文件 CSI 驱动程序](https://github.com/kubernetes-sigs/azurefile-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationAzureFile` Alpha 功能特性必须被启用。

### cephfs {#cephfs}

<!--
A `cephfs` volume allows an existing CephFS volume to be
mounted into your Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of a `cephfs` volume are preserved and the volume is merely
unmounted. This means that a `cephfs` volume can be pre-populated with data, and
that data can be shared between Pods.  The `cephfs` can be mounted by multiple
writers simultaneously.
-->
`cephfs` 卷允许你将现存的 CephFS 卷挂载到 Pod 中。
不像 `emptyDir` 那样会在 Pod 被删除的同时也会被删除，`cephfs` 卷的内容在 Pod 被删除
时会被保留，只是卷被卸载了。这意味着 `cephfs` 卷可以被预先填充数据，且这些数据可以在
Pod 之间共享。同一 `cephfs` 卷可同时被多个写者挂载。

<!--
You must have your own Ceph server running with the share exported before you can use it.
-->
{{< note >}}
在使用 Ceph 卷之前，你的 Ceph 服务器必须已经运行并将要使用的 share 导出（exported）。
{{< /note >}}

<!--
See the [CephFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/cephfs/) for more details.
-->
更多信息请参考 [CephFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/cephfs/)。

### cinder {#cinder}

<!--
Kubernetes must be configured with the OpenStack cloud provider.
-->
{{< note >}}
Kubernetes 必须配置了 OpenStack Cloud Provider。
{{< /note >}}

<!--
The `cinder` volume type is used to mount the OpenStack Cinder volume into your pod.

#### Cinder Volume Example configuration
-->
`cinder` 卷类型用于将 OpenStack Cinder 卷挂载到 Pod 中。

#### Cinder 卷示例配置

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # 此 OpenStack 卷必须已经存在
    cinder:
      volumeID: "<volume-id>"
      fsType: ext4
```

<!--
#### OpenStack CSI Migration
-->
#### OpenStack CSI 迁移

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
The `CSIMigration` feature for Cinder, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `cinder.csi.openstack.org` Container
Storage Interface (CSI) Driver. In order to use this feature, the [OpenStack Cinder CSI
Driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationOpenStack`
beta features must be enabled.
-->
启用 Cinder 的 `CSIMigration` 功能后，所有插件操作会从现有的树内插件重定向到
`cinder.csi.openstack.org` 容器存储接口（CSI）驱动程序。
为了使用此功能，必须在集群中安装 [OpenStack Cinder CSI 驱动程序](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)，
并且 `CSIMigration` 和 `CSIMigrationOpenStack` Beta 功能必须被启用。

### configMap

<!--
A [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provides a way to inject configuration data into Pods.
The data stored in a ConfigMap object can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a Pod.
-->
[`configMap`](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/) 卷
提供了向 Pod 注入配置数据的方法。
ConfigMap 对象中存储的数据可以被 `configMap` 类型的卷引用，然后被 Pod 中运行的
容器化应用使用。

<!--
When referencing a ConfigMap, you provide the name of the ConfigMap in the
volume. You can customize the path to use for a specific
entry in the ConfigMap. The following configuration shows how to mount
the `log-config` ConfigMap onto a Pod called `configmap-pod`:
-->
引用 configMap 对象时，你可以在 volume 中通过它的名称来引用。
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
      image: busybox
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
its `log_level` entry are mounted into the Pod at path "`/etc/config/log_level`".
Note that this path is derived from the volume's `mountPath` and the `path`
keyed with `log_level`.
-->
`log-config` ConfigMap 以卷的形式挂载，并且存储在 `log_level` 条目中的所有内容
都被挂载到 Pod 的 `/etc/config/log_level` 路径下。
请注意，这个路径来源于卷的 `mountPath` 和 `log_level` 键对应的 `path`。

<!--
* You must create a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
  before you can use it.

* A container using a ConfigMap as a [`subPath`](#using-subpath) volume mount will not
  receive ConfigMap updates.

* Text data is exposed as files using the UTF-8 character encoding. For other character encodings, use `binaryData`.
-->
{{< note >}}
* 在使用 [ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/) 之前你首先要创建它。
* 容器以 [subPath](#using-subpath) 卷挂载方式使用 ConfigMap 时，将无法接收 ConfigMap 的更新。
* 文本数据挂载成文件时采用 UTF-8 字符编码。如果使用其他字符编码形式，可使用
  `binaryData` 字段。
{{< /note >}}

### downwardAPI

<!--
A `downwardAPI` volume is used to make downward API data available to applications.
It mounts a directory and writes the requested data in plain text files.
-->
`downwardAPI` 卷用于使 downward API 数据对应用程序可用。
这种卷类型挂载一个目录并在纯文本文件中写入所请求的数据。

<!--
A Container using Downward API as a [subPath](#using-subpath) volume mount will not
receive Downward API updates.
-->
{{< note >}}
容器以 [subPath](#using-subpath) 卷挂载方式使用 downwardAPI 时，将不能接收到它的更新。
{{< /note >}}

<!--
See the [`downwardAPI` volume example](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)  for more details.
-->
更多详细信息请参考 [`downwardAPI` 卷示例](/zh/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)。

### emptyDir

<!--
An `emptyDir` volume is first created when a Pod is assigned to a Node, and
exists as long as that Pod is running on that node.  As the name says, it is
initially empty.  Containers in the Pod can all read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each Container.  When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted forever.
-->
当 Pod 分派到某个 Node 上时，`emptyDir` 卷会被创建，并且在 Pod 在该节点上运行期间，卷一直存在。
就像其名称表示的那样，卷最初是空的。
尽管 Pod 中的容器挂载 `emptyDir` 卷的路径可能相同也可能不同，这些容器都可以读写
`emptyDir` 卷中相同的文件。
当 Pod 因为某些原因被从节点上删除时，`emptyDir` 卷中的数据也会被永久删除。

<!--
A Container crashing does *NOT* remove a Pod from a node, so the data in an `emptyDir` volume is safe across Container crashes.
-->
{{< note >}}
容器崩溃并**不**会导致 Pod 被从节点上移除，因此容器崩溃期间 `emptyDir` 卷中的数据是安全的。
{{< /note >}}

<!--
Some uses for an `emptyDir` are:

* scratch space, such as for a disk-based merge sort
* checkpointing a long computation for recovery from crashes
* holding files that a content-manager Container fetches while a webserver
  Container serves the data
-->
`emptyDir` 的一些用途：

* 缓存空间，例如基于磁盘的归并排序。
* 为耗时较长的计算任务提供检查点，以便任务能方便地从崩溃前状态恢复执行。
* 在 Web 服务器容器服务数据时，保存内容管理器容器获取的文件。

<!--
Depending on your environment, `emptyDir` volumes are stored on whatever medium that backs the
node such as disk or SSD, or network storage. However, if you set the `emptyDir.medium` field
to `"Memory"`, Kubernetes mounts a tmpfs (RAM-backed filesystem) for you instead.
While tmpfs is very fast, be aware that unlike disks, tmpfs is cleared on
node reboot and any files you write will count against your Container's
memory limit.
-->
取决于你的环境，`emptyDir` 卷存储在该节点所使用的介质上；这里的介质可以是磁盘或 SSD
或网络存储。但是，你可以将 `emptyDir.medium` 字段设置为 `"Memory"`，以告诉 Kubernetes
为你挂载 tmpfs（基于 RAM 的文件系统）。
虽然 tmpfs 速度非常快，但是要注意它与磁盘不同。
tmpfs 在节点重启时会被清除，并且你所写入的所有文件都会计入容器的内存消耗，受容器内存限制约束。

<!--
{{< note >}}
If the `SizeMemoryBackedVolumes` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled,
you can specify a size for memory backed volumes.  If no size is specified, memory
backed volumes are sized to 50% of the memory on a Linux host.
{{< /note>}}
-->

{{< note >}}
当启用 `SizeMemoryBackedVolumes` [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)时，
你可以为基于内存提供的卷指定大小。
如果未指定大小，则基于内存的卷的大小为 Linux 主机上内存的 50％。
{{< /note>}}

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
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
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

<!--
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs beforehand so that Kubernetes hosts can access them.
-->
{{< caution >}}
你必须配置 FC SAN Zoning，以便预先向目标 WWN 分配和屏蔽这些 LUN（卷），
这样 Kubernetes 主机才可以访问它们。
{{< /caution >}}

<!--
See the [FC example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/fibre_channel) for more details.
-->
更多详情请参考 [FC 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/fibre_channel)。

<!--
### flocker (deprecated) {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) is an open-source, clustered
Container data volume manager. Flocker provides management
and orchestration of data volumes backed by a variety of storage backends.
-->

### flocker （已弃用） {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) 是一个开源的、集群化的容器数据卷管理器。
Flocker 提供了由各种存储后端所支持的数据卷的管理和编排。

<!--
A `flocker` volume allows a Flocker dataset to be mounted into a Pod. If the
dataset does not already exist in Flocker, it needs to be first created with the Flocker
CLI or by using the Flocker API. If the dataset already exists it will be
reattached by Flocker to the node that the Pod is scheduled. This means data
can be shared between Pods as required.
-->
使用 `flocker` 卷可以将一个 Flocker 数据集挂载到 Pod 中。
如果数据集在 Flocker 中不存在，则需要首先使用 Flocker CLI 或 Flocker API 创建数据集。
如果数据集已经存在，那么 Flocker 将把它重新附加到 Pod 被调度的节点。
这意味着数据可以根据需要在 Pod 之间共享。

<!--
You must have your own Flocker installation running before you can use it.
-->
{{< note >}}
在使用 Flocker 之前你必须先安装运行自己的 Flocker。
{{< /note >}}

<!--
See the [Flocker example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/flocker) for more details.
-->
更多详情请参考 [Flocker 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/flocker)。

<!--
### gcePersistentDisk

A `gcePersistentDisk` volume mounts a Google Compute Engine (GCE)
[Persistent Disk](http://cloud.google.com/compute/docs/disks) into your Pod.
Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a PD are
preserved and the volume is merely unmounted.  This means that a PD can be
pre-populated with data, and that data can be shared between pods.
-->
### gcePersistentDisk {#gcepersistentdisk}

`gcePersistentDisk` 卷能将谷歌计算引擎 (GCE) [持久盘（PD）](http://cloud.google.com/compute/docs/disks) 
挂载到你的 Pod 中。
不像 `emptyDir` 那样会在 Pod 被删除的同时也会被删除，持久盘卷的内容在删除 Pod
时会被保留，卷只是被卸载了。
这意味着持久盘卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

<!--
You must create a PD using `gcloud` or the GCE API or UI before you can use it.
-->
{{< caution >}}
在使用 PD 前，你必须使用 `gcloud` 或者 GCE API 或 UI 创建它。
{{< /caution >}}

<!--
There are some restrictions when using a `gcePersistentDisk`:

* the nodes on which Pods are running must be GCE VMs
* those VMs need to be in the same GCE project and zone as the PD
-->
使用 `gcePersistentDisk` 时有一些限制：

* 运行 Pod 的节点必须是 GCE VM
* 这些 VM 必须和持久盘位于相同的 GCE 项目和区域（zone）

<!--
One feature of GCE persistent disk is concurrent read-only access to a persistent disk.
A `gcePersistentDisk` volume permits multiple consumers to simultaneously
mount a persistent disk as read-only. This means that you can pre-populate a PD with your dataset
and then serve it in parallel from as many Pods as you need. Unfortunately,
PDs can only be mounted by a single consumer in read-write mode. Simultaneous
writers are not allowed.
-->
GCE PD 的一个特点是它们可以同时被多个消费者以只读方式挂载。
这意味着你可以用数据集预先填充 PD，然后根据需要并行地在尽可能多的 Pod 中提供该数据集。
不幸的是，PD 只能由单个使用者以读写模式挂载 —— 即不允许同时写入。

<!--
Using a GCE persistent disk with a Pod controlled by a ReplicaSet will fail unless
the PD is read-only or the replica count is 0 or 1.
-->
在由 ReplicationController 所管理的 Pod 上使用 GCE PD 将会失败，除非 PD
是只读模式或者副本的数量是 0 或 1。

<!--
#### Creating a GCE persistent disk {#gce-create-persistent-disk}

Before you can use a GCE PD with a Pod, you need to create it.
-->
#### 创建 GCE 持久盘（PD）   {#gce-create-persistent-disk}

在 Pod 中使用 GCE 持久盘之前，你首先要创建它。

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

<!--
#### Example Pod
-->
#### GCE 持久盘配置示例 {#gce-pd-configuration-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # 此 GCE PD 必须已经存在
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```
<!--
#### Regional Persistent Disks
-->
#### 区域持久盘   {#regional-persistent-disks}

<!--
The [Regional Persistent Disks](https://cloud.google.com/compute/docs/disks/#repds)
feature allows the creation of Persistent Disks that are available in two zones
within the same region. In order to use this feature, the volume must be provisioned
as a PersistentVolume; referencing the volume directly from a Pod is not supported.
-->
[区域持久盘](https://cloud.google.com/compute/docs/disks/#repds) 功能允许你创建能在
同一区域的两个可用区中使用的持久盘。
要使用这个功能，必须以持久卷（PersistentVolume）的方式提供卷；直接从 Pod 引用这种卷
是不可以的。

<!--
#### Manually provisioning a Regional PD PersistentVolume

Dynamic provisioning is possible using a [StorageClass for GCE PD](/docs/concepts/storage/storage-classes/#gce).
Before creating a PersistentVolume, you must create the PD:
-->
#### 手动供应基于区域 PD 的 PersistentVolume {#manually-provisioning-regional-pd-pv}

使用[为 GCE PD 定义的存储类](/zh/docs/concepts/storage/storage-classes/#gce) 可以
实现动态供应。在创建 PersistentVolume 之前，你首先要创建 PD。

```shell
gcloud beta compute disks create --size=500GB my-data-disk
    --region us-central1
    --replica-zones us-central1-a,us-central1-b
```

<!--
Example PersistentVolume spec:
-->
PersistentVolume 示例：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
  labels:
    failure-domain.beta.kubernetes.io/zone: us-central1-a__us-central1-b
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: failure-domain.beta.kubernetes.io/zone
          operator: In
          values:
          - us-central1-a
          - us-central1-b
```

<!--
#### GCE CSI Migration
-->
#### GCE CSI 迁移  {#gce-csi-migration}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The CSI Migration feature for GCE PD, when enabled, shims all plugin operations
from the existing in-tree plugin to the `pd.csi.storage.gke.io` Container
Storage Interface (CSI) Driver. In order to use this feature, the [GCE PD CSI
Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationGCE`
beta features must be enabled.
-->
启用 GCE PD 的 `CSIMigration` 功能后，所有插件操作将从现有的树内插件重定向到
`pd.csi.storage.gke.io` 容器存储接口（ CSI ）驱动程序。
为了使用此功能，必须在集群中上安装
[GCE PD CSI驱动程序](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationGCE` Beta 功能必须被启用。

<!--
### gitRepo (deprecated) {#gitrepo}
-->

### gitRepo (已弃用)    {#gitrepo}

<!--
The gitRepo volume type is deprecated. To provision a container with a git repo, mount an [EmptyDir](#emptydir) into an InitContainer that clones the repo using git, then mount the [EmptyDir](#emptydir) into the Pod's container.
-->
{{< warning >}}
`gitRepo` 卷类型已经被废弃。如果需要在容器中提供 git 仓库，请将一个
[EmptyDir](#emptydir) 卷挂载到 InitContainer 中，使用 git 命令完成仓库的克隆操作，
然后将 [EmptyDir](#emptydir) 卷挂载到 Pod 的容器中。
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

### glusterfs

<!--
A `glusterfs` volume allows a [Glusterfs](http://www.gluster.org) (an open
source networked filesystem) volume to be mounted into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of a
`glusterfs` volume are preserved and the volume is merely unmounted.  This
means that a glusterfs volume can be pre-populated with data, and that data can
be shared between pods. GlusterFS can be mounted by multiple writers
simultaneously.
-->
`glusterfs` 卷能将 [Glusterfs](https://www.gluster.org) (一个开源的网络文件系统) 
挂载到你的 Pod 中。不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`glusterfs`
卷的内容在删除 Pod 时会被保存，卷只是被卸载。
这意味着 `glusterfs` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。
GlusterFS 可以被多个写者同时挂载。

<!--
You must have your own GlusterFS installation running before you can use it.
-->
{{< note >}}
在使用前你必须先安装运行自己的 GlusterFS。
{{< /note >}}

<!--
See the [GlusterFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/glusterfs) for more details.
-->
更多详情请参考 [GlusterFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/glusterfs)。

### hostPath

<!--
A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.
-->
`hostPath` 卷能将主机节点文件系统上的文件或目录挂载到你的 Pod 中。
虽然这不是大多数 Pod 需要的，但是它为一些应用程序提供了强大的逃生舱。

<!--
For example, some uses for a `hostPath` are:

* running a Container that needs access to Docker internals; use a `hostPath`
  of `/var/lib/docker`
* running cAdvisor in a Container; use a `hostPath` of `/sys`
* allowing a Pod to specify whether a given `hostPath` should exist prior to the
  Pod running, whether it should be created, and what it should exist as
-->
例如，`hostPath` 的一些用法有：

* 运行一个需要访问 Docker 内部机制的容器；可使用 `hostPath` 挂载 `/var/lib/docker` 路径。
* 在容器中运行 cAdvisor 时，以 `hostPath` 方式挂载 `/sys`。
* 允许 Pod 指定给定的 `hostPath` 在运行 Pod 之前是否应该存在，是否应该创建以及应该以什么方式存在。

<!--
In addition to the required `path` property, user can optionally specify a `type` for a `hostPath` volume.

The supported values for field `type` are:
-->
除了必需的 `path` 属性之外，用户可以选择性地为 `hostPath` 卷指定 `type`。

支持的 `type` 值如下：

<!--
| Value   | Behavior |
|:--------|:---------|
| | Empty string (default) is for backward compatibility, which means that no checks will be performed before mounting the hostPath volume. |
| `DirectoryOrCreate` | If nothing exists at the given path, an empty directory will be created there as needed with permission set to 0755, having the same group and ownership with Kubelet. |
| `Directory` | A directory must exist at the given path |
| `FileOrCreate` | If nothing exists at the given path, an empty file will be created there as needed with permission set to 0644, having the same group and ownership with Kubelet. |
| `File` | A file must exist at the given path |
| `Socket` | A UNIX socket must exist at the given path |
| `CharDevice` | A character device must exist at the given path |
| `BlockDevice` | A block device must exist at the given path |
-->
| 取值  | 行为     |
|:------|:---------|
| | 空字符串（默认）用于向后兼容，这意味着在安装 hostPath 卷之前不会执行任何检查。 |
| `DirectoryOrCreate` | 如果在给定路径上什么都不存在，那么将根据需要创建空目录，权限设置为 0755，具有与 kubelet 相同的组和属主信息。 |
| `Directory` | 在给定路径上必须存在的目录。|
| `FileOrCreate` | 如果在给定路径上什么都不存在，那么将在那里根据需要创建空文件，权限设置为 0644，具有与 kubelet 相同的组和所有权。|
| `File` | 在给定路径上必须存在的文件。|
| `Socket` | 在给定路径上必须存在的 UNIX 套接字。|
| `CharDevice` | 在给定路径上必须存在的字符设备。|
| `BlockDevice` | 在给定路径上必须存在的块设备。|

<!--
Watch out when using this type of volume, because:

* Pods with identical configuration (such as created from a PodTemplate) may
  behave differently on different nodes due to different files on the nodes
* The files or directories created on the underlying hosts are only writable by root. You
  either need to run your process as root in a
  [privileged Container](/docs/tasks/configure-pod-container/security-context/) or modify the file
  permissions on the host to be able to write to a `hostPath` volume
-->
当使用这种类型的卷时要小心，因为：

* 具有相同配置（例如基于同一 PodTemplate 创建）的多个 Pod 会由于节点上文件的不同
  而在不同节点上有不同的行为。
* 下层主机上创建的文件或目录只能由 root 用户写入。你需要在
  [特权容器](/zh/docs/tasks/configure-pod-container/security-context/)
  中以 root 身份运行进程，或者修改主机上的文件权限以便容器能够写入 `hostPath` 卷。

<!--
#### hostPath configuration example
-->
#### hostPath 配置示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # 宿主上目录位置
      path: /data
      # 此字段为可选
      type: Directory
```

<!--
The `FileOrCreate` mode does not create the parent directory of the file. If the parent directory
of the mounted file does not exist, the pod fails to start. To ensure that this mode works,
you can try to mount directories and files separately, as shown in the
[`FileOrCreate`configuration](#hostpath-fileorcreate-example).
-->
{{< caution >}}
`FileOrCreate` 模式不会负责创建文件的父目录。
如果欲挂载的文件的父目录不存在，Pod 启动会失败。
为了确保这种模式能够工作，可以尝试把文件和它对应的目录分开挂载，如
[`FileOrCreate` 配置](#hostpath-fileorcreate-example) 所示。
{{< /caution >}}

<!--
#### hostPath FileOrCreate configuration example {#hostpath-fileorcreate-example}
-->
#### hostPath FileOrCreate 配置示例  {#hostpath-fileorcreate-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  containers:
  - name: test-webserver
    image: k8s.gcr.io/test-webserver:latest
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

### iscsi

<!--
An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted
into your Pod.  Unlike `emptyDir`, which is erased when a Pod is removed, the
contents of an `iscsi` volume are preserved and the volume is merely
unmounted.  This means that an iscsi volume can be pre-populated with data, and
that data can be shared between pods.
-->
`iscsi` 卷能将 iSCSI (基于 IP 的 SCSI) 卷挂载到你的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`iscsi` 卷的内容在删除 Pod 时
会被保留，卷只是被卸载。
这意味着 `iscsi` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

<!--
You must have your own iSCSI server running with the volume created before you can use it.
-->
{{< caution >}}
在使用 iSCSI 卷之前，你必须拥有自己的 iSCSI 服务器，并在上面创建卷。
{{< /caution >}}

<!--
A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.
-->
iSCSI 的一个特点是它可以同时被多个用户以只读方式挂载。
这意味着你可以用数据集预先填充卷，然后根据需要在尽可能多的 Pod 上使用它。
不幸的是，iSCSI 卷只能由单个使用者以读写模式挂载。不允许同时写入。

<!--
See the [iSCSI example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/iscsi) for more details.
-->
更多详情请参考 [iSCSI 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/iscsi)。

<!--
### local

A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported yet.
-->
### local

`local` 卷所代表的是某个被挂载的本地存储设备，例如磁盘、分区或者目录。

`local` 卷只能用作静态创建的持久卷。尚不支持动态配置。

<!--
Compared to `hostPath` volumes, `local` volumes are used in a durable and
portable manner without manually scheduling Pods to nodes. The system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.
-->
与 `hostPath` 卷相比，`local` 卷能够以持久和可移植的方式使用，而无需手动将 Pod
调度到节点。系统通过查看 PersistentVolume 的节点亲和性配置，就能了解卷的节点约束。

<!--
However, local volumes are still subject to the availability of the underlying
node and are not suitable for all applications. If a node becomes unhealthy,
then the `local` volume becomes inaccessible by the pod. The Pod using this volume
is unable to run. Applications using local volumes must be able to tolerate this
reduced availability, as well as potential data loss, depending on the
durability characteristics of the underlying disk.

The following is an example of PersistentVolume spec using a `local` volume and
`nodeAffinity`:
-->
然而，`local` 卷仍然取决于底层节点的可用性，并不适合所有应用程序。
如果节点变得不健康，那么`local` 卷也将变得不可被 Pod 访问。使用它的 Pod 将不能运行。
使用 `local` 卷的应用程序必须能够容忍这种可用性的降低，以及因底层磁盘的耐用性特征
而带来的潜在的数据丢失风险。

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
[local StorageClass 示例](/zh/docs/concepts/storage/storage-classes/#local)。
延迟卷绑定的操作可以确保 Kubernetes 在为 PersistentVolumeClaim 作出绑定决策时，
会评估 Pod 可能具有的其他节点约束，例如：如节点资源需求、节点选择器、Pod
亲和性和 Pod 反亲和性。

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

<!--
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
-->
{{< note >}}
如果不使用外部静态驱动来管理卷的生命周期，用户需要手动清理和删除 local 类型的持久卷。
{{< /note >}}

### nfs

<!--
An `nfs` volume allows an existing NFS (Network File System) share to be
mounted into your Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of an `nfs` volume are preserved and the volume is merely
unmounted.  This means that an NFS volume can be pre-populated with data, and
that data can be shared between pods. NFS can be mounted by multiple
writers simultaneously.
-->
`nfs` 卷能将 NFS (网络文件系统) 挂载到你的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`nfs` 卷的内容在删除 Pod
时会被保存，卷只是被卸载。
这意味着 `nfs` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

<!--
You must have your own NFS server running with the share exported before you can use it.
-->
{{< caution >}}
在使用 NFS 卷之前，你必须运行自己的 NFS 服务器并将目标 share 导出备用。
{{< /caution >}}

<!--
See the [NFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/nfs) for more details.
-->
要了解更多详情请参考 [NFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/nfs)。

### persistentVolumeClaim {#persistentvolumeclaim}

<!--
A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod.  PersistentVolumeClaims
are a way for users to "claim" durable storage (such as a GCE PersistentDisk or an
iSCSI volume) without knowing the details of the particular cloud environment.
-->
`persistentVolumeClaim` 卷用来将[持久卷](/zh/docs/concepts/storage/persistent-volumes/)（PersistentVolume）
挂载到 Pod 中。
持久卷申领（PersistentVolumeClaim）是用户在不知道特定云环境细节的情况下"申领"持久存储
（例如 GCE PersistentDisk 或者 iSCSI 卷）的一种方法。

<!--
See the [PersistentVolumes example](/docs/concepts/storage/persistent-volumes/) for more
details.
-->
更多详情请参考[持久卷示例](/zh/docs/concepts/storage/persistent-volumes/)。

### portworxVolume {#portworxvolume}

<!--
A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage in a server, tiers based on capabilities,
and aggregates capacity across multiple servers. Portworx runs in-guest in virtual machines or on bare metal Linux nodes.
-->
`portworxVolume` 是一个可伸缩的块存储层，能够以超融合（hyperconverged）的方式与 Kubernetes 一起运行。
[Portworx](https://portworx.com/use-case/kubernetes-storage/) 支持对服务器上存储的指纹处理、
基于存储能力进行分层以及跨多个服务器整合存储容量。
Portworx 可以以 in-guest 方式在虚拟机中运行，也可以在裸金属 Linux 节点上运行。

<!--
A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Kubernetes Pod.
Here is an example Pod referencing a pre-provisioned PortworxVolume:
-->
`portworxVolume` 类型的卷可以通过 Kubernetes 动态创建，也可以预先配备并在
Kubernetes Pod 内引用。
下面是一个引用预先配备的 PortworxVolume 的示例 Pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
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
For more details, see the [Portworx volume](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/portworx/README.md) examples.
-->

更多详情可以参考 [Portworx 卷](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/portworx/README.md)。

### projected

<!--
A `projected` volume maps several existing volume sources into the same directory.

Currently, the following types of volume sources can be projected:
-->
`projected` 卷类型能将若干现有的卷来源映射到同一目录上。

目前，可以映射的卷来源类型如下：

- [`secret`](#secret)
- [`downwardAPI`](#downwardapi)
- [`configMap`](#configmap)
- `serviceAccountToken`

<!--
All sources are required to be in the same namespace as the Pod. For more details,
see the [all-in-one volume design document](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/node/all-in-one-volume.md).
-->
所有的卷来源需要和 Pod 处于相同的命名空间。
更多详情请参考[一体化卷设计文档](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/node/all-in-one-volume.md)。

<!--
#### Example configuration with a secret, a downwardAPI, and a configMap {#example-configuration-secret-downwardapi-configmap}
-->

#### 包含 Secret、downwardAPI 和 configMap 的 Pod 示例  {#example-configuration-secret-downwardapi-configmap}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - downwardAPI:
          items:
            - path: "labels"
              fieldRef:
                fieldPath: metadata.labels
            - path: "cpu_limit"
              resourceFieldRef:
                containerName: container-test
                resource: limits.cpu
      - configMap:
          name: myconfigmap
          items:
            - key: config
              path: my-group/my-config
```

<!--
#### Example configuration: secrets with a non-default permission mode set {#example-configuration-secrets-nondefault-permission-mode}
-->

下面是一个带有非默认访问权限设置的多个 secret 的 Pod 示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - secret:
          name: mysecret2
          items:
            - key: password
              path: my-group/my-password
              mode: 511
```
<!--
Each projected volume source is listed in the spec under `sources`. The
parameters are nearly the same with two exceptions:

* For secrets, the `secretName` field has been changed to `name` to be consistent
  with ConfigMap naming.
* The `defaultMode` can only be specified at the projected level and not for each
  volume source. However, as illustrated above, you can explicitly set the `mode`
  for each individual projection.
-->
每个被投射的卷来源都在规约中的 `sources` 内列出。参数几乎相同，除了两处例外：

* 对于 `secret`，`secretName` 字段已被变更为 `name` 以便与 ConfigMap 命名一致。
* `defaultMode` 只能在整个投射卷级别指定，而无法针对每个卷来源指定。
  不过，如上所述，你可以显式地为每个投射项设置 `mode` 值。

<!--
When the `TokenRequestProjection` feature is enabled, you can inject the token
for the current [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
into a Pod at a specified path. Below is an example:
-->

当开启 `TokenRequestProjection` 功能时，可以将当前
[服务帐号](/zh/docs/reference/access-authn-authz/authentication/#service-account-tokens)
的令牌注入 Pod 中的指定路径。
下面是一个例子：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sa-token-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: token-vol
      mountPath: "/service-account"
      readOnly: true
  volumes:
  - name: token-vol
    projected:
      sources:
      - serviceAccountToken:
          audience: api
          expirationSeconds: 3600
          path: token
```

<!--
The example Pod has a projected volume containing the injected service account
token. This token can be used by a Pod's containers to access the Kubernetes API
server. The `audience` field contains the intended audience of the
token. A recipient of the token must identify itself with an identifier specified
in the audience of the token, and otherwise should reject the token. This field
is optional and it defaults to the identifier of the API server.
-->
示例 Pod 具有包含注入服务帐户令牌的映射卷。
该令牌可以被 Pod 中的容器用来访问 Kubernetes API 服务器。
`audience` 字段包含令牌的预期受众。
令牌的接收者必须使用令牌的受众中指定的标识符来标识自己，否则应拒绝令牌。
此字段是可选的，默认值是 API 服务器的标识符。

<!--
The `expirationSeconds` is the expected duration of validity of the service account
token. It defaults to 1 hour and must be at least 10 minutes (600 seconds). An administrator
can also limit its maximum value by specifying the `-service-account-max-token-expiration`
option for the API server. The `path` field specifies a relative path to the mount point
of the projected volume.
-->
`expirationSeconds` 是服务帐户令牌的有效期时长。
默认值为 1 小时，必须至少 10 分钟（600 秒）。
管理员还可以通过设置 API 服务器的 `--service-account-max-token-expiration` 选项来
限制其最大值。
`path` 字段指定相对于映射卷的挂载点的相对路径。

{{< note >}}
<!--
A container using a projected volume source as a [subPath](#using-subpath) volume mount will not
receive updates for those volume sources.
-->
使用投射卷源作为 [subPath](#using-subpath) 卷挂载的容器将不会接收这些卷源的更新。
{{< /note >}}

### quobyte

<!--
A `quobyte` volume allows an existing [Quobyte](http://www.quobyte.com) volume to
be mounted into your Pod.
-->
`quobyte` 卷允许将现有的 [Quobyte](https://www.quobyte.com) 卷挂载到你的 Pod 中。

<!--
You must have your own Quobyte setup running with the volumes
created before you can use it.
-->
{{< note >}}
在使用 Quobyte 卷之前，你首先要进行安装 Quobyte 并创建好卷。
{{< /note >}}

<!--
Quobyte supports the {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI is the recommended plugin to use Quobyte volumes inside Kubernetes. Quobyte's
GitHub project has [instructions](https://github.com/quobyte/quobyte-csi#quobyte-csi) for deploying Quobyte using CSI, along with examples.
-->
Quobyte 支持{{< glossary_tooltip text="容器存储接口（CSI）" term_id="csi" >}}。
推荐使用 CSI 插件以在 Kubernetes 中使用 Quobyte 卷。
Quobyte 的 GitHub 项目包含以 CSI 形式部署 Quobyte 的
[说明](https://github.com/quobyte/quobyte-csi#quobyte-csi)
及使用示例。

### rbd

<!--
An `rbd` volume allows a
[Rados Block Device](https://ceph.com/docs/master/rbd/rbd/) volume to mount into your
Pod.  Unlike `emptyDir`, which is erased when a Pod is removed, the contents of
a `rbd` volume are preserved and the volume is merely unmounted.  This
means that a RBD volume can be pre-populated with data, and that data can
be shared between pods.
-->
`rbd` 卷允许将 [Rados 块设备](https://ceph.com/docs/master/rbd/rbd/) 卷挂载到你的 Pod 中.
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`rbd` 卷的内容在删除 Pod 时
会被保存，卷只是被卸载。
这意味着 `rbd` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间共享。

<!--
You must have your own Ceph installation running before you can use RBD.
-->
{{< caution >}}
在使用 RBD 之前，你必须安装运行 Ceph。
{{< /caution >}}

<!--
A feature of RBD is that it can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
RBD volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.

See the [RBD example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/rbd) for more details.
-->
RBD 的一个特性是它可以同时被多个用户以只读方式挂载。
这意味着你可以用数据集预先填充卷，然后根据需要在尽可能多的 Pod 中并行地使用卷。
不幸的是，RBD 卷只能由单个使用者以读写模式安装。不允许同时写入。

更多详情请参考 [RBD 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/rbd)。

<!--
### scaleIO (deprecated) {#scaleio}
-->
### scaleIO （已弃用）   {#scaleio}

<!--
ScaleIO is a software-based storage platform that can use existing hardware to
create clusters of scalable shared block networked storage. The `scaleIO` volume
plugin allows deployed Pods to access existing ScaleIO
volumes (or it can dynamically provision new volumes for persistent volume claims, see
[ScaleIO Persistent Volumes](/docs/concepts/storage/persistent-volumes/#scaleio)).
-->
ScaleIO 是基于软件的存储平台，可以使用现有硬件来创建可伸缩的、共享的而且是网络化的块存储集群。
`scaleIO` 卷插件允许部署的 Pod 访问现有的 ScaleIO 卷（或者它可以动态地为持久卷申领提供新的卷，
参见 [ScaleIO 持久卷](/zh/docs/concepts/storage/persistent-volumes/#scaleio)）。

<!--
You must have an existing ScaleIO cluster already setup and
running with the volumes created before you can use them.
-->
{{< note >}}
在使用前，你必须有个安装完毕且运行正常的 ScaleIO 集群，并且创建好了存储卷。
{{< /note >}}

<!--
The following is an example of Pod configuration with ScaleIO:
-->
下面是配置了 ScaleIO 的 Pod 示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-0
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: pod-0
    volumeMounts:
    - mountPath: /test-pd
      name: vol-0
  volumes:
  - name: vol-0
    scaleIO:
      gateway: https://localhost:443/api
      system: scaleio
      protectionDomain: sd0
      storagePool: sp1
      volumeName: vol-0
      secretRef:
        name: sio-secret
      fsType: xfs
```

<!--
For further detail, please see the [ScaleIO examples](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/scaleio).
-->
更多详情，请参考 [ScaleIO 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/scaleio)。

### secret

<!--
A `secret` volume is used to pass sensitive information, such as passwords, to
Pods.  You can store secrets in the Kubernetes API and mount them as files for
use by Pods without coupling to Kubernetes directly.  `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.
-->
`secret` 卷用来给 Pod 传递敏感信息，例如密码。你可以将 Secret 存储在 Kubernetes
API 服务器上，然后以文件的形式挂在到 Pod 中，无需直接与 Kubernetes 耦合。
`secret` 卷由 tmpfs（基于 RAM 的文件系统）提供存储，因此它们永远不会被写入非易失性
（持久化的）存储器。

<!--
You must create a secret in the Kubernetes API before you can use it.
-->
{{< note >}}
使用前你必须在 Kubernetes API 中创建 secret。
{{< /note >}}

<!--
A Container using a Secret as a [subPath](#using-subpath) volume mount will not
receive Secret updates.
-->
{{< note >}}
容器以 [subPath](#using-subpath) 卷挂载方式挂载 Secret 时，将感知不到 Secret 的更新。
{{< /note >}}

<!--
For more details, see [Configuring Secrets](/docs/concepts/configuration/secret/).
-->
更多详情请参考[配置 Secrets](/zh/docs/concepts/configuration/secret/)。

### storageOS {#storageos}

<!--
A `storageos` volume allows an existing [StorageOS](https://www.storageos.com)
volume to be mounted into your Pod.
-->
`storageos` 卷允许将现有的 [StorageOS](https://www.storageos.com) 卷挂载到你的 Pod 中。

<!--
StorageOS runs as a Container within your Kubernetes environment, making local
or attached storage accessible from any node within the Kubernetes cluster.
Data can be replicated to protect against node failure. Thin provisioning and
compression can improve utilization and reduce cost.
-->
StorageOS 在 Kubernetes 环境中以容器的形式运行，这使得应用能够从 Kubernetes
集群中的任何节点访问本地的或挂接的存储。为应对节点失效状况，可以复制数据。
若需提高利用率和降低成本，可以考虑瘦配置（Thin Provisioning）和数据压缩。

<!--
At its core, StorageOS provides block storage to Containers, accessible via a file system.

The StorageOS Container requires 64-bit Linux and has no additional dependencies.
A free developer license is available.
-->
作为其核心能力之一，StorageOS 为容器提供了可以通过文件系统访问的块存储。

StorageOS 容器需要 64 位的 Linux，并且没有其他的依赖关系。
StorageOS 提供免费的开发者授权许可。

<!--
You must run the StorageOS Container on each node that wants to
access StorageOS volumes or that will contribute storage capacity to the pool.
For installation instructions, consult the
[StorageOS documentation](https://docs.storageos.com).
-->
{{< caution >}}
你必须在每个希望访问 StorageOS 卷的或者将向存储资源池贡献存储容量的节点上运行
StorageOS 容器。有关安装说明，请参阅 [StorageOS 文档](https://docs.storageos.com)。
{{< /caution >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # `redis-vol01` 卷必须在 StorageOS 中存在，并位于 `default` 名字空间内
        volumeName: redis-vol01
        fsType: ext4
```

<!--
For more information about StorageOS, dynamic provisioning, and PersistentVolumeClaims, see the
[StorageOS examples](https://github.com/kubernetes/examples/blob/master/volumes/storageos).
-->

关于 StorageOS 的进一步信息、动态供应和持久卷申领等等，请参考
[StorageOS 示例](https://github.com/kubernetes/examples/blob/master/volumes/storageos)。

### vsphereVolume {#vspherevolume}

<!--
You must configure the Kubernetes vSphere Cloud Provider. For cloudprovider
configuration, refer to the [vSphere Getting Started guide](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/).
-->
{{< note >}}
你必须配置 Kubernetes 的 vSphere 云驱动。云驱动的配置方法请参考
[vSphere 使用指南](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)。
{{< /note >}}

<!--
A `vsphereVolume` is used to mount a vSphere VMDK Volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.
-->
`vsphereVolume` 用来将 vSphere VMDK 卷挂载到你的 Pod 中。
在卸载卷时，卷的内容会被保留。
vSphereVolume 卷类型支持 VMFS 和 VSAN 数据仓库。

<!--
You must create VMDK using one of the following methods before using with Pod.
-->
{{< caution >}}
在挂载到 Pod 之前，你必须用下列方式之一创建 VMDK。
{{< /caution >}}

<!--
#### Creating a VMDK volume {#creating-vmdk-volume}

Choose one of the following methods to create a VMDK.
-->
#### 创建 VMDK 卷  {#creating-vmdk-volume}

选择下列方式之一创建 VMDK。

{{< tabs name="tabs_volumes" >}}
{{% tab name="使用 vmkfstools 创建" %}}

首先 ssh 到 ESX，然后使用下面的命令来创建 VMDK：

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```
{{% /tab %}}
{{% tab name="使用 vmware-vdiskmanager 创建" %}}

使用下面的命令创建 VMDK：

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```
{{% /tab %}}

{{< /tabs >}}


<!--
#### vSphere VMDK configuration example {#vsphere-vmdk-configuration}
-->
#### vSphere VMDK 配置示例    {#vsphere-vmdk-configuration}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: k8s.gcr.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # 此 VMDK 卷必须已经存在
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

<!--
For more information, see the [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) examples.
-->
进一步信息可参考
[vSphere 卷](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)。

<!--
#### vSphere CSI migration {#vsphere-csi-migration}
-->
#### vSphere CSI 迁移  {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
The `CSIMigration` feature for `vsphereVolume`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver. In order to use this feature, the
[vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationvSphere`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.
-->
当 `vsphereVolume` 的 `CSIMigration` 特性被启用时，所有插件操作都被从树内插件重定向到
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。
为了使用此功能特性，必须在集群中安装
[vSphere CSI 驱动](https://github.com/kubernetes-sigs/vsphere-csi-driver)，
并启用 `CSIMigration` 和 `CSIMigrationvSphere`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
This also requires minimum vSphere vCenter/ESXi Version to be 7.0u1 and minimum HW Version to be VM version 15.
-->
此特性还要求 vSphere vCenter/ESXi 的版本至少为 7.0u1，且 HW 版本至少为
VM version 15。

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
To turn off the `vsphereVolume` plugin from being loaded by the controller manager and the kubelet, you need to set this feature flag to `true`. You must install a `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver on all worker nodes.
-->
为了避免控制器管理器和 kubelet 加载 `vsphereVolume` 插件，你需要将
`CSIMigrationVSphereComplete` 特性设置为 `true`。你还必须在所有工作节点上安装
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驱动。

<!--
## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single Pod.
The `volumeMounts.subPath` property specifies a sub-path inside the referenced volume
instead of its root.
-->
## 使用 subPath  {#using-path}

有时，在单个 Pod 中共享卷以供多方使用是很有用的。
`volumeMounts.subPath` 属性可用于指定所引用的卷内的子路径，而不是其根路径。

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
Downward API environment variables.
The `subPath` and `subPathExpr` properties are mutually exclusive.
-->
使用 `subPathExpr` 字段可以基于 Downward API 环境变量来构造 `subPath` 目录名。
`subPath` 和 `subPathExpr` 属性是互斥的。

<!--
In this example, a Pod uses `subPathExpr` to create a directory `pod1` within
the hostPath volume `/var/log/pods`.
The `hostPath` volume takes the `Pod` name from the `downwardAPI`.
The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.
-->
在这个示例中，Pod 使用 `subPathExpr` 来 hostPath 卷 `/var/log/pods` 中创建目录 `pod1`。
`hostPath` 卷采用来自 `downwardAPI` 的 Pod 名称生成目录名。
宿主目录 `/var/log/pods/pod1` 被挂载到容器的 `/logs` 中。

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
    image: busybox
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

<!--
## Resources

The storage media (Disk, SSD, etc.) of an `emptyDir` volume is determined by the
medium of the filesystem holding the kubelet root dir (typically
`/var/lib/kubelet`).  There is no limit on how much space an `emptyDir` or
`hostPath` volume can consume, and no isolation between Containers or between
Pods.
-->
## 资源   {#resources}

`emptyDir` 卷的存储介质（磁盘、SSD 等）是由保存 kubelet 数据的根目录
（通常是 `/var/lib/kubelet`）的文件系统的介质确定。
Kubernetes 对 `emptyDir` 卷或者 `hostPath` 卷可以消耗的空间没有限制，
容器之间或 Pod 之间也没有隔离。

<!--
To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).
-->
要了解如何使用资源规约来请求空间，可参考
[如何管理资源](/zh/docs/concepts/configuration/manage-resources-containers/)。


<!--
## Out-of-Tree Volume Plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI)
and FlexVolume. They enable storage vendors to create custom storage plugins
without adding them to the Kubernetes repository.
-->
## 树外（Out-of-Tree）卷插件    {#out-of-tree-volume-plugins}

Out-of-Tree 卷插件包括
{{< glossary_tooltip text="容器存储接口（CSI）" term_id="csi" >}} (CSI)
和 FlexVolume。
它们使存储供应商能够创建自定义存储插件，而无需将它们添加到 Kubernetes 代码仓库。

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
to [this FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
CSI 和 FlexVolume 都允许独立于 Kubernetes 代码库开发卷插件，并作为扩展部署
（安装）在 Kubernetes 集群上。

对于希望创建树外（Out-Of-Tree）卷插件的存储供应商，请参考
[卷插件常见问题](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)。

### CSI

<!--
[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.
-->
[容器存储接口](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
为容器编排系统（如 Kubernetes）定义标准接口，以将任意存储系统暴露给它们的容器工作负载。

<!--
Please read the [CSI design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) for more information.

CSI support was introduced as alpha in Kubernetes v1.9, moved to beta in
Kubernetes v1.10, and is GA in Kubernetes v1.13.
-->
更多详情请阅读 [CSI 设计方案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)。

<!--
Support for CSI spec versions 0.2 and 0.3 are deprecated in Kubernetes
v1.13 and will be removed in a future release.
-->
{{< note >}}
Kubernetes v1.13 废弃了对 CSI 规范版本 0.2 和 0.3 的支持，并将在以后的版本中删除。
{{< /note >}}

<!--
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
-->
{{< note >}}
CSI 驱动可能并非兼容所有的 Kubernetes 版本。
请查看特定 CSI 驱动的文档，以了解各个 Kubernetes 版本所支持的部署步骤以及兼容性列表。
{{< /note >}}

<!--
Once a CSI compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach, mount, etc. the volumes exposed by the
CSI driver.

A `csi` volume can be used in a Pod in three different ways:

* through a reference to a [PersistentVolumeClaim](#persistentvolumeclaim)
* with a [generic ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volume)
(alpha feature)
* with a [CSI ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)
if the driver supports that (beta feature)
-->
一旦在 Kubernetes 集群上部署了 CSI 兼容卷驱动程序，用户就可以使用 `csi` 卷类型来
挂接、挂载 CSI 驱动所提供的卷。

`csi` 卷可以在 Pod 中以三种方式使用：

* 通过 PersistentVolumeClaim(#persistentvolumeclaim) 对象引用
* 使用[一般性的临时卷](/zh/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volume)
  （Alpha 特性）
* 使用 [CSI 临时卷](/zh/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)，
  前提是驱动支持这种用法（Beta 特性）

<!--
The following fields are available to storage administrators to configure a CSI
persistent volume:
-->
存储管理员可以使用以下字段来配置 CSI 持久卷：

<!--
- `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
-->
- `driver`：指定要使用的卷驱动名称的字符串值。
  这个值必须与 CSI 驱动程序在 `GetPluginInfoResponse` 中返回的值相对应；
  该接口定义在 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)中。
  Kubernetes 使用所给的值来标识要调用的 CSI 驱动程序；CSI 驱动程序也使用该值来辨识
  哪些 PV 对象属于该 CSI 驱动程序。

<!--
- `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` on all calls to the CSI volume driver when
  referencing the volume.
-->
- `volumeHandle`：唯一标识卷的字符串值。
  该值必须与 CSI 驱动在 `CreateVolumeResponse` 的 `volume_id` 字段中返回的值相对应；
  接口定义在 [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中。
  在所有对 CSI 卷驱动程序的调用中，引用该 CSI 卷时都使用此值作为 `volume_id` 参数。

<!--
- `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is
  passed to the CSI driver via the `readonly` field in the
  `ControllerPublishVolumeRequest`.
-->
- `readOnly`：一个可选的布尔值，指示通过 `ControllerPublished` 关联该卷时是否设置
  该卷为只读。默认值是 false。
  该值通过 `ControllerPublishVolumeRequest` 中的 `readonly` 字段传递给 CSI 驱动。

<!--
- `fsType`: If the PV's `VolumeMode` is `Filesystem` then this field may be used
  to specify the filesystem that should be used to mount the volume. If the
  volume has not been formatted and formatting is supported, this value will be
  used to format the volume.
  This value is passed to the CSI driver via the `VolumeCapability` field of
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
- `fsType`：如果 PV 的 `VolumeMode` 为 `Filesystem`，那么此字段指定挂载卷时应该使用的文件系统。
  如果卷尚未格式化，并且支持格式化，此值将用于格式化卷。
  此值可以通过 `ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 的 `VolumeCapability` 字段传递给 CSI 驱动。

<!--
- `volumeAttributes`: A map of string to string that specifies static properties
  of a volume. This map must correspond to the map returned in the
  `volume.attributes` field of the `CreateVolumeResponse` by the CSI driver as
  defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The map is passed to the CSI driver via the `volume_attributes` field in the
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
- `volumeAttributes`：一个字符串到字符串的映射表，用来设置卷的静态属性。
  该映射必须与 CSI 驱动程序返回的 `CreateVolumeResponse` 中的 `volume.attributes`
  字段的映射相对应；
  [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中有相应的定义。
  该映射通过`ControllerPublishVolumeRequest`、`NodeStageVolumeRequest`、和
  `NodePublishVolumeRequest` 中的 `volume_attributes` 字段传递给 CSI 驱动。

<!--
- `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the secret object
  contains more than one secret, all secrets are passed.
-->
- `controllerPublishSecretRef`：对包含敏感信息的 Secret 对象的引用；
  该敏感信息会被传递给 CSI 驱动来完成 CSI `ControllerPublishVolume` 和
  `ControllerUnpublishVolume` 调用。
  此字段是可选的；在不需要 Secret 时可以是空的。
  如果 Secret 对象包含多个 Secret 条目，则所有的 Secret 条目都会被传递。

<!--
- `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional, and may be empty if no secret
  is required. If the secret object contains more than one secret, all secrets
  are passed.
-->
- `nodeStageSecretRef`：对包含敏感信息的 Secret 对象的引用。
  该信息会传递给 CSI 驱动来完成 CSI `NodeStageVolume` 调用。
  此字段是可选的，如果不需要 Secret，则可能是空的。
  如果 Secret 对象包含多个 Secret 条目，则传递所有 Secret 条目。

<!--
- `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional, and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
-->
- `nodePublishSecretRef`：对包含敏感信息的 Secret 对象的引用。
  该信息传递给 CSI 驱动来完成 CSI `NodePublishVolume` 调用。
  此字段是可选的，如果不需要 Secret，则可能是空的。
  如果 Secret 对象包含多个 Secret 条目，则传递所有 Secret 条目。

<!--
#### CSI raw block volume support
-->

#### CSI 原始块卷支持    {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Vendors with external CSI drivers to implement raw block volumes support
in Kubernetes workloads.
-->
具有外部 CSI 驱动程序的供应商能够在 Kubernetes 工作负载中实现原始块卷支持。

<!--
You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) as usual, without any CSI specific changes.
-->
你可以和以前一样，安装自己的
[带有原始块卷支持的 PV/PVC](/zh/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)，
采用 CSI 对此过程没有影响。

<!--
#### CSI ephemeral volumes
-->
#### CSI 临时卷   {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across pod restarts. See [Ephemeral
Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)
for more information.
-->
你可以直接在 Pod 规约中配置 CSI 卷。采用这种方式配置的卷都是临时卷，
无法在 Pod 重新启动后继续存在。
进一步的信息可参阅[临时卷](/zh/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)。

<!--
For more information on how to develop a CSI driver, refer to the [kubernetes-csi
documentation](https://kubernetes-csi.github.io/docs/)

-->
有关如何开发 CSI 驱动的更多信息，请参考 [kubernetes-csi 文档](https://kubernetes-csi.github.io/docs/)。

<!--
#### Migrating to CSI drivers from in-tree plugins
-->
#### 从树内插件迁移到 CSI 驱动程序  {#migrating-to-csi-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The CSI Migration feature, when enabled, directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.

The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.

In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).
-->
启用 `CSIMigration` 功能后，针对现有树内插件的操作会被重定向到相应的 CSI 插件
（应已安装和配置）。
因此，操作员在过渡到取代树内插件的 CSI 驱动时，无需对现有存储类、PV 或 PVC
（指树内插件）进行任何配置更改。

所支持的操作和功能包括：配备（Provisioning）/删除、挂接（Attach）/解挂（Detach）、
挂载（Mount）/卸载（Unmount）和调整卷大小。

上面的[卷类型](#volume-types)节列出了支持 `CSIMigration` 并已实现相应 CSI
驱动程序的树内插件。

### flexVolume

<!--
FlexVolume is an out-of-tree plugin interface that has existed in Kubernetes
since version 1.2 (before CSI). It uses an exec-based model to interface with
drivers. The FlexVolume driver binaries must be installed in a pre-defined volume
plugin path on each node (and in some cases master).

Pods interact with FlexVolume drivers through the `flexvolume` in-tree plugin.
More details can be found [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md).
-->
FlexVolume 是一个自 1.2 版本（在 CSI 之前）以来在 Kubernetes 中一直存在的树外插件接口。
它使用基于 exec 的模型来与驱动程序对接。
用户必须在每个节点（在某些情况下是主控节点）上的预定义卷插件路径中安装
FlexVolume 驱动程序可执行文件。

Pod 通过 `flexvolume` 树内插件与 Flexvolume 驱动程序交互。
更多详情请参考 [FlexVolume](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md) 示例。

<!--
## Mount propagation

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

Mount propagation of a volume is controlled by `mountPropagation` field in Container.volumeMounts.
Its values are:
-->
## 挂载卷的传播   {#mount-propagation}

挂载卷的传播能力允许将容器安装的卷共享到同一 Pod 中的其他容器，
甚至共享到同一节点上的其他 Pod。

卷的挂载传播特性由 `Container.volumeMounts` 中的 `mountPropagation` 字段控制。
它的值包括：

<!--
 * `None` - This volume mount will not receive any subsequent mounts
   that are mounted to this volume or any of its subdirectories by the host.
   In similar fashion, no mounts created by the Container will be visible on
   the host. This is the default mode.

   This mode is equal to `private` mount propagation as described in the
   [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
-->

* `None` - 此卷挂载将不会感知到主机后续在此卷或其任何子目录上执行的挂载变化。
   类似的，容器所创建的卷挂载在主机上是不可见的。这是默认模式。

   该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
   中描述的 `private` 挂载传播选项。

<!--
 * `HostToContainer` - This volume mount will receive all subsequent mounts
   that are mounted to this volume or any of its subdirectories.

   In other words, if the host mounts anything inside the volume mount, the
   Container will see it mounted there.

   Similarly, if any Pod with `Bidirectional` mount propagation to the same
   volume mounts anything there, the Container with `HostToContainer` mount
   propagation will see it.

   This mode is equal to `rslave` mount propagation as described in the
   [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
-->
* `HostToContainer` - 此卷挂载将会感知到主机后续针对此卷或其任何子目录的挂载操作。

  换句话说，如果主机在此挂载卷中挂载任何内容，容器将能看到它被挂载在那里。

  类似的，配置了 `Bidirectional` 挂载传播选项的 Pod 如果在同一卷上挂载了内容，
  挂载传播设置为 `HostToContainer` 的容器都将能看到这一变化。

  该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
  中描述的 `rslave` 挂载传播选项。

<!--
* `Bidirectional` - This volume mount behaves the same the `HostToContainer` mount.
   In addition, all volume mounts created by the Container will be propagated
   back to the host and to all Containers of all Pods that use the same volume.

   A typical use case for this mode is a Pod with a FlexVolume or CSI driver or
   a Pod that needs to mount something on the host using a `hostPath` volume.

   This mode is equal to `rshared` mount propagation as described in the
   [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
-->
* `Bidirectional` - 这种卷挂载和 `HostToContainer` 挂载表现相同。
  另外，容器创建的卷挂载将被传播回至主机和使用同一卷的所有 Pod 的所有容器。

  该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
  中描述的 `rshared` 挂载传播选项。

  <!--
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system and therefore it is allowed only in privileged
  Containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by Containers in Pods must be destroyed
  (unmounted) by the Containers on termination.
  -->
  {{< warning >}}
  `Bidirectional` 形式的挂载传播可能比较危险。
  它可以破坏主机操作系统，因此它只被允许在特权容器中使用。
  强烈建议你熟悉 Linux 内核行为。
  此外，由 Pod 中的容器创建的任何卷挂载必须在终止时由容器销毁（卸载）。
  {{< /warning >}}

<!--
### Configuration

Before mount propagation can work properly on some deployments (CoreOS,
RedHat/Centos, Ubuntu) mount share must be configured correctly in
Docker as shown below.
-->
### 配置  {#configuration}

在某些部署环境中，挂载传播正常工作前，必须在 Docker 中正确配置挂载共享（mount share），
如下所示。

<!--
Edit your Docker's `systemd` service file.  Set `MountFlags` as follows:
-->
编辑你的 Docker `systemd` 服务文件，按下面的方法设置 `MountFlags`：

```shell
MountFlags=shared
```

<!--
Or, remove `MountFlags=slave` if present. Then restart the Docker daemon:
-->
或者，如果存在 `MountFlags=slave` 就删除掉。然后重启 Docker 守护进程：

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}


<!--
Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
-->

参考[使用持久卷部署 WordPress 和 MySQL](/zh/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/) 示例。

