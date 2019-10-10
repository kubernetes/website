---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Volumes
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

<!--
On-disk files in a Container are ephemeral, which presents some problems for
non-trivial applications when running in Containers.  First, when a Container
crashes, kubelet will restart it, but the files will be lost - the
Container starts with a clean state.  Second, when running Containers together
in a `Pod` it is often necessary to share files between those Containers.  The
Kubernetes `Volume` abstraction solves both of these problems.
-->

容器中的文件在磁盘上是临时存放的，这给容器中运行的特殊应用程序带来一些问题。
首先，当容器崩溃时，kubelet 将重新启动容器，容器中的文件将会丢失——因为容器会以干净的状态重建。
其次，当在一个 `Pod` 中同时运行多个容器时，常常需要在这些容器之间共享文件。
Kubernetes 抽象出 `Volume` 对象来解决这两个问题。

<!--
Familiarity with [Pods](/docs/user-guide/pods) is suggested.
-->

阅读本文前建议您熟悉一下 [Pods](/docs/user-guide/pods)。 

{{% /capture %}}


{{% capture body %}}

<!--
## Background

Docker also has a concept of
[volumes](https://docs.docker.com/engine/admin/volumes/), though it is
somewhat looser and less managed.  In Docker, a volume is simply a directory on
disk or in another Container.  Lifetimes are not managed and until very
recently there were only local-disk-backed volumes.  Docker now provides volume
drivers, but the functionality is very limited for now (e.g. as of Docker 1.7
only one volume driver is allowed per Container and there is no way to pass
parameters to volumes).
-->

## 背景

Docker 也有 [Volume](https://docs.docker.com/engine/admin/volumes/) 的概念，但对它只有少量且松散的管理。
在 Docker 中，Volume 是磁盘上或者另外一个容器内的一个目录。
直到最近，Docker 才支持对基于本地磁盘的 Volume 的生存期进行管理。
虽然 Docker 现在也能提供 Volume 驱动程序，但是目前功能还非常有限（例如，截至 Docker 1.7，每个容器只允许有一个 Volume 驱动程序，并且无法将参数传递给卷）。

<!--
A Kubernetes volume, on the other hand, has an explicit lifetime - the same as
the Pod that encloses it.  Consequently, a volume outlives any Containers that run
within the Pod, and data is preserved across Container restarts. Of course, when a
Pod ceases to exist, the volume will cease to exist, too.  Perhaps more
importantly than this, Kubernetes supports many types of volumes, and a Pod can
use any number of them simultaneously.
-->

另一方面，Kubernetes 卷具有明确的生命周期——与包裹它的 Pod 相同。
因此，卷比 Pod 中运行的任何容器的存活期都长，在容器重新启动时数据也会得到保留。
当然，当一个 Pod 不再存在时，卷也将不再存在。也许更重要的是，Kubernetes 可以支持许多类型的卷，Pod 也能同时使用任意数量的卷。

<!--
At its core, a volume is just a directory, possibly with some data in it, which
is accessible to the Containers in a Pod.  How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.
-->

卷的核心是包含一些数据的目录，Pod 中的容器可以访问该目录。
特定的卷类型可以决定这个目录如何形成的，并能决定它支持何种介质，以及目录中存放什么内容。


<!--
To use a volume, a Pod specifies what volumes to provide for the Pod (the
`.spec.volumes`
field) and where to mount those into Containers (the
`.spec.containers.volumeMounts`
field).
-->

使用卷时, Pod 声明中需要提供卷的类型 (`.spec.volumes` 字段)和卷挂载的位置 (`.spec.containers.volumeMounts` 字段).

<!--
A process in a container sees a filesystem view composed from their Docker
image and volumes.  The [Docker
image](https://docs.docker.com/userguide/dockerimages/) is at the root of the
filesystem hierarchy, and any volumes are mounted at the specified paths within
the image.  Volumes can not mount onto other volumes or have hard links to
other volumes.  Each Container in the Pod must independently specify where to
mount each volume.
-->

容器中的进程能看到由它们的 Docker 镜像和卷组成的文件系统视图。
[Docker 镜像](https://docs.docker.com/userguide/dockerimages/) 位于文件系统层次结构的根部，并且任何 Volume 都挂载在镜像内的指定路径上。
卷不能挂载到其他卷，也不能与其他卷有硬链接。
Pod 中的每个容器必须独立地指定每个卷的挂载位置。

<!--
## Types of Volumes

Kubernetes supports several types of Volumes:
-->

## Volume 的类型

Kubernetes 支持下列类型的卷：


   * [awsElasticBlockStore](#awselasticblockstore)
   * [azureDisk](#azuredisk)
   * [azureFile](#azurefile)
   * [cephfs](#cephfs)
   * [cinder](#cinder)
   * [configMap](#configmap)
   * [csi](#csi)
   * [downwardAPI](#downwardapi)
   * [emptyDir](#emptydir)
   * [fc (fibre channel)](#fc)
   * [flexVolume](#flexVolume)
   * [flocker](#flocker)
   * [gcePersistentDisk](#gcepersistentdisk)
   * [gitRepo (deprecated)](#gitrepo)
   * [glusterfs](#glusterfs)
   * [hostPath](#hostpath)
   * [iscsi](#iscsi)
   * [local](#local)
   * [nfs](#nfs)
   * [persistentVolumeClaim](#persistentvolumeclaim)
   * [projected](#projected)
   * [portworxVolume](#portworxvolume)
   * [quobyte](#quobyte)
   * [rbd](#rbd)
   * [scaleIO](#scaleio)
   * [secret](#secret)
   * [storageos](#storageos)
   * [vsphereVolume](#vspherevolume)

<!--
We welcome additional contributions.
-->

我们欢迎大家贡献其他的卷类型支持。

### awsElasticBlockStore {#awselasticblockstore}

<!--
An `awsElasticBlockStore` volume mounts an Amazon Web Services (AWS) [EBS
Volume](http://aws.amazon.com/ebs/) into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of an EBS
volume are preserved and the volume is merely unmounted.  This means that an
EBS volume can be pre-populated with data, and that data can be "handed off"
between Pods.
-->

`awsElasticBlockStore` 卷将 Amazon Web服务（AWS）[EBS 卷](http://aws.amazon.com/ebs/) 挂载到您的 Pod 中。
与 `emptyDir` 在删除 Pod 时会被删除不同，EBS 卷的内容在删除 Pod 时会被保留，卷只是被卸载掉了。
这意味着 EBS 卷可以预先填充数据，并且可以在 Pod 之间传递数据。

{{< caution >}}

<!--
You must create an EBS volume using `aws ec2 create-volume` or the AWS API before you can use it.
-->

您在使用 EBS 卷之前必须先创建它，可以使用 `aws ec2 create-volume` 命令进行创建；也可以使用 AWS API 进行创建。

{{< /caution >}}

<!--
There are some restrictions when using an `awsElasticBlockStore` volume:

* the nodes on which Pods are running must be AWS EC2 instances
* those instances need to be in the same region and availability-zone as the EBS volume
* EBS only supports a single EC2 instance mounting a volume
-->

使用 `awsElasticBlockStore` 卷时有一些限制：

* Pod 正在运行的节点必须是 AWS EC2 实例。
* 这些实例需要与 EBS 卷在相同的地域（region）和可用区（availability-zone）。
* EBS 卷只支持被挂载到单个 EC2 实例上。

<!--
#### Creating an EBS volume

Before you can use an EBS volume with a Pod, you need to create it.
-->

#### 创建 EBS 卷

在将 EBS 卷用到 Pod 上之前，您首先要创建它。

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

<!--
Make sure the zone matches the zone you brought up your cluster in.  (And also check that the size and EBS volume
type are suitable for your use!)
-->

确保该区域与您的群集所在的区域相匹配。（也要检查卷的大小和 EBS 卷类型都适合您的用途！）

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
    # This AWS EBS volume must already exist.
    awsElasticBlockStore:
      volumeID: <volume-id>
      fsType: ext4
```

### azureDisk {#azuredisk}

<!--
A `azureDisk` is used to mount a Microsoft Azure [Data Disk](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) into a Pod.

More details can be found [here](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_disk/README.md).
-->

`azureDisk` 用来在 Pod 上挂载 Microsoft Azure [数据盘（Data Disk）](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) .
更多详情请参考[这里](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_disk/README.md)。

<!--
#### CSI Migration
-->
#### CSI迁移

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

<!--
The CSI Migration feature for azureDisk, when enabled, shims all plugin operations
from the existing in-tree plugin to the `disk.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure Disk CSI
Driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAzureDisk`
Alpha features must be enabled.
-->

启用azureDisk的CSI迁移功能后，它会将所有插件操作从现有的内建插件填添加disk.csi.azure.com容器存储接口（CSI）驱动程序中。
为了使用此功能，必须在群集上安装 [Azure磁盘CSI驱动程序](https://github.com/kubernetes-sigs/azuredisk-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationAzureDisk` Alpha功能 必须启用。

### azureFile {#azurefile}

<!--
A `azureFile` is used to mount a Microsoft Azure File Volume (SMB 2.1 and 3.0)
into a Pod.

More details can be found [here](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_file/README.md).
-->

`azureFile` 用来在 Pod 上挂载 Microsoft Azure 文件卷（File Volume） (SMB 2.1 和 3.0)。
更多详情请参考[这里](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_file/README.md)。

<!--
#### CSI Migration
-->
#### CSI迁移

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

<!--
The CSI Migration feature for azureFile, when enabled, shims all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAzureFile`
Alpha features must be enabled.
-->

启用azureFile的CSI迁移功能后，它会将所有插件操作从现有的内建插件填添加file.csi.azure.com容器存储接口（CSI）驱动程序中。
为了使用此功能，必须在群集上安装 [Azure文件CSI驱动程序](https://github.com/kubernetes-sigs/azurefile-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationAzureFile` Alpha功能 必须启用。

### cephfs {#cephfs}

<!--
A `cephfs` volume allows an existing CephFS volume to be
mounted into your Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of a `cephfs` volume are preserved and the volume is merely
unmounted.  This means that a CephFS volume can be pre-populated with data, and
that data can be "handed off" between Pods.  CephFS can be mounted by multiple
writers simultaneously.
-->

`cephfs` 允许您将现存的 CephFS 卷挂载到 Pod 中。不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`cephfs` 卷的内容在删除 Pod 时会被保留，卷只是被卸载掉了。
这意味着 CephFS 卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。CephFS 卷可同时被多个写者挂载。


{{< caution >}}

<!--
You must have your own Ceph server running with the share exported before you can use it.
-->

在您使用 Ceph 卷之前，您的 Ceph 服务器必须正常运行并且要使用的 share 被导出（exported）。
{{< /caution >}}

<!--
See the [CephFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/cephfs/) for more details.
-->

更多信息请参考 [CephFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/cephfs/)。

### cinder {#cinder}

{{< note >}}

<!--
Prerequisite: Kubernetes with OpenStack Cloud Provider configured. For cloudprovider
configuration please refer [cloud provider openstack](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack).
-->

先决条件：配置了OpenStack Cloud Provider 的 Kubernetes。 有关 cloudprovider 配置，请参考 [cloud provider openstack](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack)。

{{< /note >}}

<!--
`cinder` is used to mount OpenStack Cinder Volume into your Pod.

#### Cinder Volume Example configuration
-->

`cinder` 用于将 OpenStack Cinder 卷安装到 Pod 中。

#### Cinder Volume示例配置

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
    # This OpenStack volume must already exist.
    cinder:
      volumeID: <volume-id>
      fsType: ext4
```

<!--
#### CSI Migration
-->
#### CSI迁移

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

<!--
The CSI Migration feature for Cinder, when enabled, shims all plugin operations
from the existing in-tree plugin to the `cinder.csi.openstack.org` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Openstack Cinder CSI
Driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationOpenStack`
Alpha features must be enabled.
-->

启用Cinder的CSI迁移功能后，它会将所有插件操作从现有的内建插件填添加 `cinder.csi.openstack.org` 容器存储接口（CSI）驱动程序中。
为了使用此功能，必须在群集上安装 [Openstack Cinder CSI驱动程序](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md)，
并且 `CSIMigration` 和 `CSIMigrationOpenStack` Alpha功能 必须启用。


### configMap {#configmap}

<!--
The [`configMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/) resource
provides a way to inject configuration data into Pods.
The data stored in a `ConfigMap` object can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a Pod.
-->

[`configMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/) 资源提供了向 Pod 注入配置数据的方法。
`ConfigMap` 对象中存储的数据可以被 `configMap` 类型的卷引用，然后被应用到 Pod 中运行的容器化应用。

<!--
When referencing a `configMap` object, you can simply provide its name in the
volume to reference it. You can also customize the path to use for a specific
entry in the ConfigMap.
For example, to mount the `log-config` ConfigMap onto a Pod called `configmap-pod`,
you might use the YAML below:
-->

当引用 `configMap` 对象时，你可以简单的在 Volume 中通过它名称来引用。
还可以自定义 ConfigMap 中特定条目所要使用的路径。
例如，要将名为 `log-config` 的 ConfigMap 挂载到名为 `configmap-pod` 的 Pod 中，您可以使用下面的 YAML：

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

`log-config` ConfigMap 是以卷的形式挂载的，
存储在 `log_level` 条目中的所有内容都被挂载到 Pod 的 "`/etc/config/log_level`" 路径下。
请注意，这个路径来源于 Volume 的 `mountPath` 和 `log_level` 键对应的 `path`。

{{< caution >}}
<!--
You must create a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) before you can use it.
-->
在使用 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 之前您首先要创建它。
{{< /caution >}}

{{< note >}}
<!--
A Container using a ConfigMap as a [subPath](#using-subpath) volume mount will not
receive ConfigMap updates.
-->
容器以 [subPath](#using-subpath) 卷挂载方式使用 ConfigMap 时，将无法接收 ConfigMap 的更新。
{{< /note >}}

### downwardAPI {#downwardapi}

<!--
A `downwardAPI` volume is used to make downward API data available to applications.
It mounts a directory and writes the requested data in plain text files.
-->

`downwardAPI` 卷用于使 downward API 数据对应用程序可用。
这种卷类型挂载一个目录并在纯文本文件中写入请求的数据。 

{{< note >}}

<!--
A Container using Downward API as a [subPath](#using-subpath) volume mount will not
receive Downward API updates.
-->

容器以挂载 [subPath](#using-subpath) 卷的方式使用 downwardAPI 时，将不能接收到它的更新。
{{< /note >}}

<!--
See the [`downwardAPI` volume example](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)  for more details.
-->
更多详细信息请参考 [`downwardAPI` 卷示例](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)。

### emptyDir {#emptydir}

<!--
An `emptyDir` volume is first created when a Pod is assigned to a Node, and
exists as long as that Pod is running on that node.  As the name says, it is
initially empty.  Containers in the Pod can all read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each Container.  When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted forever.
-->

当 Pod 指定到某个节点上时，首先创建的是一个 `emptyDir` 卷，并且只要 Pod 在该节点上运行，卷就一直存在。
就像它的名称表示的那样，卷最初是空的。
尽管 Pod 中的容器挂载 `emptyDir` 卷的路径可能相同也可能不同，但是这些容器都可以读写 `emptyDir` 卷中相同的文件。
当 Pod 因为某些原因被从节点上删除时，`emptyDir` 卷中的数据也会永久删除。

{{< note >}}

<!--
A Container crashing does *NOT* remove a Pod from a node, so the data in an `emptyDir` volume is safe across Container crashes.
-->
容器崩溃并不会导致 Pod 被从节点上移除，因此容器崩溃时 `emptyDir` 卷中的数据是安全的。
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
By default, `emptyDir` volumes are stored on whatever medium is backing the
node - that might be disk or SSD or network storage, depending on your
environment.  However, you can set the `emptyDir.medium` field to `"Memory"`
to tell Kubernetes to mount a tmpfs (RAM-backed filesystem) for you instead.
While tmpfs is very fast, be aware that unlike disks, tmpfs is cleared on
node reboot and any files you write will count against your Container's
memory limit.
-->

默认情况下， `emptyDir` 卷存储在支持该节点所使用的介质上；这里的介质可以是磁盘或 SSD 或网络存储，这取决于您的环境。
但是，您可以将 `emptyDir.medium` 字段设置为 `"Memory"`，以告诉 Kubernetes 为您安装 tmpfs（基于 RAM 的文件系统）。
虽然 tmpfs 速度非常快，但是要注意它与磁盘不同。
tmpfs 在节点重启时会被清除，并且您所写入的所有文件都会计入容器的内存消耗，受容器内存限制约束。

<!--
#### Example Pod
-->

#### Pod 示例

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

An `fc` volume allows an existing fibre channel volume to be mounted in a Pod.
You can specify single or multiple target World Wide Names using the parameter
`targetWWNs` in your volume configuration. If multiple WWNs are specified,
targetWWNs expect that those WWNs are from multi-path connections.
-->

### fc (光纤通道) {#fc}

`fc` 卷允许将现有的光纤通道卷挂载到 Pod 中。
可以使用卷配置中的参数 `targetWWNs` 来指定单个或多个目标 WWN。
如果指定多个 WWN，targetWWNs 期望这些 WWN 来自多路径连接。

{{< caution >}}
<!--
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs beforehand so that Kubernetes hosts can access them.
-->
您必须配置 FC SAN Zoning，以便预先向目标 WWN 分配和屏蔽这些 LUN（卷），这样 Kubernetes 主机才可以访问它们。
{{< /caution >}}

<!--
See the [FC example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/fibre_channel) for more details.
-->

更多详情请参考 [FC 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/fibre_channel)。

<!--
### flocker {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) is an open-source clustered Container data volume manager. It provides management
and orchestration of data volumes backed by a variety of storage backends.
-->

### flocker {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) 是一个开源的、集群化的容器数据卷管理器。
Flocker 提供了由各种存储后备支持的数据卷的管理和编排。

<!--
A `flocker` volume allows a Flocker dataset to be mounted into a Pod. If the
dataset does not already exist in Flocker, it needs to be first created with the Flocker
CLI or by using the Flocker API. If the dataset already exists it will be
reattached by Flocker to the node that the Pod is scheduled. This means data
can be "handed off" between Pods as required.
-->

`flocker` 卷允许将一个 Flocker 数据集挂载到 Pod 中。
如果数据集在 Flocker 中不存在，则需要首先使用 Flocker CLI 或 Flocker API 创建数据集。
如果数据集已经存在，那么 Flocker 将把它重新附加到 Pod 被调度的节点。
这意味着数据可以根据需要在 Pod 之间 "传递"。


{{< caution >}}
<!--
You must have your own Flocker installation running before you can use it.
-->
您在使用 Flocker 之前必须先安装运行自己的 Flocker。
{{< /caution >}}

<!--
See the [Flocker example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/flocker) for more details.
-->

更多详情请参考 [Flocker 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/flocker)。

<!--
### gcePersistentDisk {#gcepersistentdisk}

A `gcePersistentDisk` volume mounts a Google Compute Engine (GCE) [Persistent
Disk](http://cloud.google.com/compute/docs/disks) into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of a PD are
preserved and the volume is merely unmounted.  This means that a PD can be
pre-populated with data, and that data can be "handed off" between Pods.
-->

### gcePersistentDisk {#gcepersistentdisk}

`gcePersistentDisk` 卷能将谷歌计算引擎 (GCE) [持久盘（PD）](http://cloud.google.com/compute/docs/disks) 挂载到您的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，持久盘卷的内容在删除 Pod 时会被保留，卷只是被卸载掉了。
这意味着持久盘卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。

{{< caution >}}
<!--
You must create a PD using `gcloud` or the GCE API or UI before you can use it.
-->
您在使用 PD 前，必须使用 `gcloud` 或者 GCE API 或 UI 创建它。
{{< /caution >}}

<!--
There are some restrictions when using a `gcePersistentDisk`:

* the nodes on which Pods are running must be GCE VMs
* those VMs need to be in the same GCE project and zone as the PD
-->

使用 `gcePersistentDisk` 时有一些限制：

* 运行 Pod 的节点必须是 GCE VM
* 那些 VM 必须和持久盘属于相同的 GCE 项目和区域（zone）

<!--
A feature of PD is that they can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a PD with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
PDs can only be mounted by a single consumer in read-write mode - no
simultaneous writers allowed.
-->

PD 的一个特点是它们可以同时被多个消费者以只读方式挂载。
这意味着您可以用数据集预先填充 PD，然后根据需要并行地在尽可能多的 Pod 中提供该数据集。
不幸的是，PD 只能由单个使用者以读写模式挂载——即不允许同时写入。

<!--
Using a PD on a Pod controlled by a ReplicationController will fail unless
the PD is read-only or the replica count is 0 or 1.
-->

在由 ReplicationController 所管理的 Pod 上使用 PD 将会失败，除非 PD 是只读模式或者副本的数量是 0 或 1。

<!--
#### Creating a PD

Before you can use a GCE PD with a Pod, you need to create it.
-->

#### 创建持久盘（PD）

在 Pod 中使用 GCE 持久盘之前，您首先要创建它。

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

<!--
#### Example Pod
-->

#### Pod 示例

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
    # This GCE PD must already exist.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

<!--
#### Regional Persistent Disks
-->

#### 区域持久盘（Regional Persistent Disks）

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
The [Regional Persistent Disks](https://cloud.google.com/compute/docs/disks/#repds) feature allows the creation of Persistent Disks that are available in two zones within the same region. In order to use this feature, the volume must be provisioned as a PersistentVolume; referencing the volume directly from a pod is not supported.
-->

[区域持久盘](https://cloud.google.com/compute/docs/disks/#repds) 功能允许您创建能在同一区域的两个可用区中使用的持久盘。
要使用这个功能，必须以持久盘的方式提供卷；Pod 不支持直接引用这种卷。

<!--
#### Manually provisioning a Regional PD PersistentVolume
Dynamic provisioning is possible using a [StorageClass for GCE PD](/docs/concepts/storage/storage-classes/#gce).
Before creating a PersistentVolume, you must create the PD:
-->

#### 手动供应基于区域 PD 的 PersistentVolume

使用 [为 GCE PD 定义的存储类](/docs/concepts/storage/storage-classes/#gce) 也可以动态供应。
在创建 PersistentVolume 之前，您首先要创建 PD。

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
```

<!--
#### CSI Migration
-->
#### CSI迁移

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

<!--
The CSI Migration feature for GCE PD, when enabled, shims all plugin operations
from the existing in-tree plugin to the `pd.csi.storage.gke.io` Container
Storage Interface (CSI) Driver. In order to use this feature, the [GCE PD CSI
Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationGCE`
Alpha features must be enabled.
-->

启用 GCE PD 的 CSI 迁移功能后，它会将所有插件操作从现有的内建插件填添加 `pd.csi.storage.gke.io` 容器存储接口（ CSI ）驱动程序中。
为了使用此功能，必须在群集上安装 [GCE PD CSI驱动程序](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)，
并且 `CSIMigration` 和 `CSIMigrationGCE` Alpha功能 必须启用。


<!--
### gitRepo (deprecated) {#gitrepo}
-->

### gitRepo (已弃用)

{{< warning >}}
<!--
The gitRepo volume type is deprecated. To provision a container with a git repo, mount an [EmptyDir](#emptydir) into an InitContainer that clones the repo using git, then mount the [EmptyDir](#emptydir) into the Pod's container.
-->
gitRepo 卷类型已经被废弃。如果需要在容器中提供 git 仓库，请将一个 [EmptyDir](#emptydir) 卷挂载到 InitContainer 中，使用 git 命令完成仓库的克隆操作，然后将 [EmptyDir](#emptydir) 卷挂载到 Pod 的容器中。
{{< /warning >}}

<!--
A `gitRepo` volume is an example of what can be done as a volume plugin.  It
mounts an empty directory and clones a git repository into it for your Pod to
use.  In the future, such volumes may be moved to an even more decoupled model,
rather than extending the Kubernetes API for every such use case.

Here is an example of gitRepo volume:
-->

`gitRepo` 卷是一个卷插件的例子。
该卷类型挂载了一个空目录，并将一个 Git 代码仓库克隆到这个目录中供您使用。
将来，这种卷可能被移动到一个更加解耦的模型中，而不是针对每个应用案例扩展 Kubernetes API。

下面给出一个 gitRepo 卷的示例：

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

### glusterfs {#glusterfs}

<!--
A `glusterfs` volume allows a [Glusterfs](http://www.gluster.org) (an open
source networked filesystem) volume to be mounted into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of a
`glusterfs` volume are preserved and the volume is merely unmounted.  This
means that a glusterfs volume can be pre-populated with data, and that data can
be "handed off" between Pods.  GlusterFS can be mounted by multiple writers
simultaneously.
-->

`glusterfs` 卷能将 [Glusterfs](http://www.gluster.org) (一个开源的网络文件系统) 挂载到您的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`glusterfs` 卷的内容在删除 Pod 时会被保存，卷只是被卸载掉了。
这意味着 `glusterfs` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。GlusterFS 可以被多个写者同时挂载。

{{< caution >}}
<!--
You must have your own GlusterFS installation running before you can use it.
-->
在使用前您必须先安装运行自己的 GlusterFS。
{{< /caution >}}

<!--
See the [GlusterFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/glusterfs) for more details.
-->

更多详情请参考 [GlusterFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/glusterfs)。

### hostPath {#hostpath}

<!--
A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.
-->

`hostPath` 卷能将主机节点文件系统上的文件或目录挂载到您的 Pod 中。
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

* 运行一个需要访问 Docker 引擎内部机制的容器；请使用 `hostPath` 挂载 `/var/lib/docker` 路径。
* 在容器中运行 cAdvisor 时，以 `hostPath` 方式挂载 `/sys`。
* 允许 Pod 指定给定的 `hostPath` 在运行 Pod 之前是否应该存在，是否应该创建以及应该以什么方式存在。

<!--
In addition to the required `path` property, user can optionally specify a `type` for a `hostPath` volume.

The supported values for field `type` are:
-->

除了必需的 `path` 属性之外，用户可以选择性地为 `hostPath` 卷指定 `type`。

支持的 `type` 值如下：


<!--
| Value | Behavior |
|:------|:---------|
| | Empty string (default) is for backward compatibility, which means that no checks will be performed before mounting the hostPath volume. |
| `DirectoryOrCreate` | If nothing exists at the given path, an empty directory will be created there as needed with permission set to 0755, having the same group and ownership with Kubelet. |
| `Directory` | A directory must exist at the given path |
| `FileOrCreate` | If nothing exists at the given path, an empty file will be created there as needed with permission set to 0644, having the same group and ownership with Kubelet. |
| `File` | A file must exist at the given path |
| `Socket` | A UNIX socket must exist at the given path |
| `CharDevice` | A character device must exist at the given path |
| `BlockDevice` | A block device must exist at the given path |
-->

| 取值 | 行为 |
|:------|:---------|
| | 空字符串（默认）用于向后兼容，这意味着在安装 hostPath 卷之前不会执行任何检查。 |
| `DirectoryOrCreate` | 如果在给定路径上什么都不存在，那么将根据需要创建空目录，权限设置为 0755，具有与 Kubelet 相同的组和所有权。 |
| `Directory` | 在给定路径上必须存在的目录。|
| `FileOrCreate` | 如果在给定路径上什么都不存在，那么将在那里根据需要创建空文件，权限设置为 0644，具有与 Kubelet 相同的组和所有权。|
| `File` | 在给定路径上必须存在的文件。|
| `Socket` | 在给定路径上必须存在的 UNIX 套接字。|
| `CharDevice` | 在给定路径上必须存在的字符设备。|
| `BlockDevice` | 在给定路径上必须存在的块设备。|

<!--
Watch out when using this type of volume, because:

* Pods with identical configuration (such as created from a podTemplate) may
  behave differently on different nodes due to different files on the nodes
* when Kubernetes adds resource-aware scheduling, as is planned, it will not be
  able to account for resources used by a `hostPath`
* the files or directories created on the underlying hosts are only writable by root. You
  either need to run your process as root in a
  [privileged Container](/docs/user-guide/security-context) or modify the file
  permissions on the host to be able to write to a `hostPath` volume
-->

当使用这种类型的卷时要小心，因为：

* 具有相同配置（例如从 podTemplate 创建）的多个 Pod 会由于节点上文件的不同而在不同节点上有不同的行为。
* 当 Kubernetes 按照计划添加资源感知的调度时，这类调度机制将无法考虑由 `hostPath` 使用的资源。
* 基础主机上创建的文件或目录只能由 root 用户写入。您需要在 [特权容器](/docs/user-guide/security-context) 中以 root 身份运行进程，或者修改主机上的文件权限以便容器能够写入 `hostPath` 卷。

<!--
#### Example Pod
-->

#### Pod 示例

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
      # directory location on host
      path: /data
      # this field is optional
      type: Directory
```

### iscsi {#iscsi}

<!--
An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted
into your Pod.  Unlike `emptyDir`, which is erased when a Pod is removed, the
contents of an `iscsi` volume are preserved and the volume is merely
unmounted.  This means that an iscsi volume can be pre-populated with data, and
that data can be "handed off" between Pods.
-->

`iscsi` 卷能将 iSCSI (基于 IP 的 SCSI) 挂载到您的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，持久盘 卷的内容在删除 Pod 时会被保存，卷只是被卸载掉了。
这意味着 `iscsi` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。

{{< caution >}}
<!--
You must have your own iSCSI server running with the volume created before you can use it.
-->
在您使用 iSCSI 卷之前，您必须拥有自己的 iSCSI 服务器，并在上面创建卷。
{{< /caution >}}

<!--
A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode - no
simultaneous writers allowed.
-->

iSCSI 的一个特点是它可以同时被多个用户以只读方式挂载。
这意味着您可以用数据集预先填充卷，然后根据需要在尽可能多的 Pod 上提供它。不幸的是，iSCSI 卷只能由单个使用者以读写模式挂载——不允许同时写入。

<!--
See the [iSCSI example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/iscsi) for more details.
-->

更多详情请参考 [iSCSI 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/iscsi)。

<!--
### local {#local}
-->

### local {#local}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

{{< note >}}
<!--The alpha PersistentVolume NodeAffinity annotation has been deprecated
and will be removed in a future release. Existing PersistentVolumes using this
annotation must be updated by the user to use the new PersistentVolume
`NodeAffinity` field.-->
alpha 版本的 PersistentVolume NodeAffinity 注释已被取消，将在将来的版本中废弃。
用户必须更新现有的使用该注解的 PersistentVolume，以使用新的 PersistentVolume `NodeAffinity` 字段。
{{< /note >}}

<!--
A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported yet.
-->

`local` 卷指的是所挂载的某个本地存储设备，例如磁盘、分区或者目录。

`local` 卷只能用作静态创建的持久卷。尚不支持动态配置。

<!--
Compared to `hostPath` volumes, local volumes can be used in a durable and
portable manner without manually scheduling Pods to nodes, as the system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.
-->

相比 `hostPath` 卷，`local` 卷可以以持久和可移植的方式使用，而无需手动将 Pod 调度到节点，因为系统通过查看 PersistentVolume 所属节点的亲和性配置，就能了解卷的节点约束。

<!--
However, local volumes are still subject to the availability of the underlying
node and are not suitable for all applications. If a node becomes unhealthy,
then the local volume will also become inaccessible, and a Pod using it will not
be able to run. Applications using local volumes must be able to tolerate this
reduced availability, as well as potential data loss, depending on the
durability characteristics of the underlying disk.

The following is an example of PersistentVolume spec using a `local` volume and
`nodeAffinity`:
-->

然而，`local` 卷仍然取决于底层节点的可用性，并不是适合所有应用程序。
如果节点变得不健康，那么`local` 卷也将变得不可访问，并且使用它的 Pod 将不能运行。
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
  # volumeMode field requires BlockVolume Alpha feature gate to be enabled.
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
PersistentVolume `nodeAffinity` is required when using local volumes. It enables
the Kubernetes scheduler to correctly schedule Pods using local volumes to the
correct node.
-->

使用 `local` 卷时，需要使用 PersistentVolume 对象的 `nodeAffinity` 字段。
它使 Kubernetes 调度器能够将使用 `local` 卷的 Pod 正确地调度到合适的节点。

<!--
PersistentVolume `volumeMode` can now be set to "Block" (instead of the default
value "Filesystem") to expose the local volume as a raw block device. The
`volumeMode` field requires `BlockVolume` Alpha feature gate to be enabled.
-->

现在，可以将 PersistentVolume 对象的 `volumeMode` 字段设置为 "Block"（而不是默认值 "Filesystem"），以将 `local` 卷作为原始块设备暴露出来。
`volumeMode` 字段需要启用 Alpha 功能 `BlockVolume`。

<!--
When using local volumes, it is recommended to create a StorageClass with
`volumeBindingMode` set to `WaitForFirstConsumer`. See the
[example](/docs/concepts/storage/storage-classes/#local). Delaying volume binding ensures
that the PersistentVolumeClaim binding decision will also be evaluated with any
other node constraints the Pod may have, such as node resource requirements, node
selectors, Pod affinity, and Pod anti-affinity.
-->

当使用 `local` 卷时，建议创建一个 StorageClass，将 `volumeBindingMode` 设置为 `WaitForFirstConsumer`。
请参考 [示例](/docs/concepts/storage/storage-classes/#local)。
延迟卷绑定操作可以确保 Kubernetes 在为 PersistentVolumeClaim 作出绑定决策时，会评估 Pod 可能具有的其他节点约束，例如：如节点资源需求、节点选择器、Pod 亲和性和 Pod 反亲和性。

<!--
An external static provisioner can be run separately for improved management of
the local volume lifecycle. Note that this provisioner does not support dynamic
provisioning yet. For an example on how to run an external local provisioner,
see the [local volume provisioner user
guide](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).
-->

您可以在 Kubernetes 之外单独运行静态驱动以改进对 local 卷的生命周期管理。
请注意，此驱动不支持动态配置。
有关如何运行外部 `local` 卷驱动的示例，请参考 
[local 卷驱动用户指南](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)。

{{< note >}}
<!--
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
-->
如果不使用外部静态驱动来管理卷的生命周期，则用户需要手动清理和删除 local 类型的持久卷。
{{< /note >}}

### nfs {#nfs}

<!--
An `nfs` volume allows an existing NFS (Network File System) share to be
mounted into your Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of an `nfs` volume are preserved and the volume is merely
unmounted.  This means that an NFS volume can be pre-populated with data, and
that data can be "handed off" between Pods.  NFS can be mounted by multiple
writers simultaneously.
-->

`nfs` 卷能将 NFS (网络文件系统) 挂载到您的 Pod 中。
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`nfs` 卷的内容在删除 Pod 时会被保存，卷只是被卸载掉了。
这意味着 `nfs` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。

{{< caution >}}
<!--
You must have your own NFS server running with the share exported before you can use it.
-->
在您使用 NFS 卷之前，必须运行自己的 NFS 服务器并将目标 share 导出备用。
{{< /caution >}}

<!--
See the [NFS example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/nfs) for more details.
-->

要了解更多详情请参考 [NFS 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/nfs)。

### persistentVolumeClaim {#persistentvolumeclaim}

<!--
A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod.  PersistentVolumes are a
way for users to "claim" durable storage (such as a GCE PersistentDisk or an
iSCSI volume) without knowing the details of the particular cloud environment.
-->
`persistentVolumeClaim` 卷用来将[持久卷](/docs/concepts/storage/persistent-volumes/)（PersistentVolume）挂载到 Pod 中。
持久卷是用户在不知道特定云环境细节的情况下"申领"持久存储（例如 GCE PersistentDisk 或者 iSCSI 卷）的一种方法。

<!--
See the [PersistentVolumes example](/docs/concepts/storage/persistent-volumes/) for more
details.
-->

更多详情请参考[持久卷示例](/docs/concepts/storage/persistent-volumes/)

### projected {#projected}

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
The projection of service account tokens is a feature introduced in Kubernetes
1.11 and promoted to Beta in 1.12.
To enable this feature on 1.11, you need to explicitly set the `TokenRequestProjection`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to
True.
-->

服务帐户令牌的映射是 Kubernetes 1.11 版本中引入的一个功能，并在 1.12 版本中被提升为 Beta 功能。
若要在 1.11 版本中启用此特性，需要显式设置 `TokenRequestProjection` [功能开关](/docs/reference/command-line-tools-reference/feature-gates/) 为 True。

<!--
#### Example Pod with a secret, a downward API, and a configmap.
-->

#### 包含 secret、downwardAPI 和 configmap 的 Pod 示例如下：

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
#### Example Pod with multiple secrets with a non-default permission mode set.
-->

带有非默认许可模式设置的多个 secret 的 Pod 示例如下：

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

每个被投射的卷来源都在 spec 中的 `sources` 内列出。
参数几乎相同，除了两处例外：

* 对于 secret，`secretName` 字段已被变更为 `name` 以便与 ConfigMap 命名一致。
* `defaultMode` 只能根据投射级别指定，而不是针对每个卷来源指定。不过，如上所述，您可以显式地为每个投射项设置 `mode` 值。

<!--
When the `TokenRequestProjection` feature is enabled, you can inject the token
for the current [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
into a Pod at a specified path. Below is an example:
-->

当开启 `TokenRequestProjection` 功能时，可以将当前 [服务帐户](/docs/reference/access-authn-authz/authentication/#service-account-tokens)的令牌注入 Pod 中的指定路径。
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
token. This token can be used by Pod containers to access the Kubernetes API
server, for example. The `audience` field contains the intended audience of the
token. A recipient of the token must identify itself with an identifier specified
in the audience of the token, and otherwise should reject the token. This field
is optional and it defaults to the identifier of the API server.
-->

示例 Pod 具有包含注入服务帐户令牌的映射卷。
例如，这个令牌可以被 Pod 容器用来访问 Kubernetes API服务器。
`audience` 字段包含令牌的预期受众。
令牌的接收者必须使用令牌的受众中指定的标识符来标识自己，否则应拒绝令牌。
此字段是可选的，默认值是 API 服务器的标识符。

<!--
The `expirationSeconds` is the expected duration of validity of the service account
token. It defaults to 1 hour and must be at least 10 minutes (600 seconds). An administrator
can also limit its maximum value by specifying the `--service-account-max-token-expiration`
option for the API server. The `path` field specifies a relative path to the mount point
of the projected volume.
-->

`expirationSeconds` 是服务帐户令牌的有效期。
默认值为 1 小时，必须至少 10 分钟（600 秒）。
管理员还可以通过指定 API 服务器的 `--service-account-max-token-expiration` 选项来限制其最大值。
`path` 字段指定相对于映射卷的挂载点的相对路径。

{{< note >}}
<!--
A Container using a projected volume source as a [subPath](#using-subpath) volume mount will not
receive updates for those volume sources.
-->
使用投射卷源作为 [subPath](#using-subpath) 卷挂载的容器将不会接收这些卷源的更新。
{{< /note >}}

### portworxVolume {#portworxvolume}

<!--
A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage in a server, tiers based on capabilities,
and aggregates capacity across multiple servers. Portworx runs in-guest in virtual machines or on bare metal Linux nodes.
-->

`portworxVolume` 是一个可伸缩的块存储层，能够以超聚合（hyperconverged）的方式与 Kubernetes 一起运行。
[Portworx](https://portworx.com/use-case/kubernetes-storage/) 支持对服务器上存储的指纹处理、基于存储能力进行分层以及跨多个服务器整合存储容量。
Portworx 可以以 in-guest 方式在虚拟机中运行，也可以在裸金属 Linux 节点上运行。

<!--
A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Kubernetes Pod.
Here is an example Pod referencing a pre-provisioned PortworxVolume:
-->

`portworxVolume` 类型的卷可以通过 Kubernetes 动态创建，也可以在 Kubernetes Pod 内预先供应和引用。
下面是一个引用预先配置的 PortworxVolume 的示例 Pod：

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
    # This Portworx volume must already exist.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< caution >}}
<!--
Make sure you have an existing PortworxVolume with name `pxvol`
before using it in the Pod.
-->
在 Pod 中使用 portworxVolume 之前，请确保有一个名为 `pxvol` 的 PortworxVolume 存在。
{{< /caution >}}

<!--
More details and examples can be found [here](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/portworx/README.md).
-->

更多详情和示例可以在[这里](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/portworx/README.md)找到。

### quobyte {#quobyte}

<!--
A `quobyte` volume allows an existing [Quobyte](http://www.quobyte.com) volume to
be mounted into your Pod.
-->

`quobyte` 卷允许将现有的 [Quobyte](http://www.quobyte.com) 卷挂载到您的 Pod 中。

{{< caution >}}
<!--
You must have your own Quobyte setup running with the volumes
created before you can use it.
-->
在使用 Quobyte 卷之前，您首先要进行安装并创建好卷。

{{< /caution >}}

<!--
Quobyte supports the {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI is the recommended plugin to use Quobyte volumes inside Kubernetes. Quobyte's
GitHub project has [instructions](https://github.com/quobyte/quobyte-csi#quobyte-csi) for deploying Quobyte using CSI, along with examples.
-->

Quobyte 支持{{< glossary_tooltip text="容器存储接口" term_id="csi" >}}。
推荐使用 CSI 插件以在 Kubernetes 中使用 Quobyte 卷。
Quobyte 的 GitHub 项目具有[说明(https://github.com/quobyte/quobyte/quobyte-csi#quobyte-csi)以及使用示例来部署 CSI 的 Quobyte。

### rbd {#rbd}

<!--
An `rbd` volume allows a [Rados Block
Device](http://ceph.com/docs/master/rbd/rbd/) volume to be mounted into your
Pod.  Unlike `emptyDir`, which is erased when a Pod is removed, the contents of
a `rbd` volume are preserved and the volume is merely unmounted.  This
means that a RBD volume can be pre-populated with data, and that data can
be "handed off" between Pods.
-->

`rbd` 卷允许将 [Rados 块设备](http://ceph.com/docs/master/rbd/rbd/) 卷挂载到您的 Pod 中. 
不像 `emptyDir` 那样会在删除 Pod 的同时也会被删除，`rbd` 卷的内容在删除 Pod 时会被保存，卷只是被卸载掉了。
这意味着 `rbd` 卷可以被预先填充数据，并且这些数据可以在 Pod 之间"传递"。


{{< caution >}}
<!--
You must have your own Ceph installation running before you can use RBD.
-->
在使用 RBD 之前，您必须安装运行 Ceph。
{{< /caution >}}

<!--
A feature of RBD is that it can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
RBD volumes can only be mounted by a single consumer in read-write mode - no
simultaneous writers allowed.

See the [RBD example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/rbd) for more details.
-->

RBD 的一个特点是它可以同时被多个用户以只读方式挂载。
这意味着您可以用数据集预先填充卷，然后根据需要从尽可能多的 Pod 中并行地提供卷。
不幸的是，RBD 卷只能由单个使用者以读写模式安装——不允许同时写入。

更多详情请参考 [RBD 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/volumes/rbd)。

### scaleIO {#scaleio}

<!--
ScaleIO is a software-based storage platform that can use existing hardware to
create clusters of scalable shared block networked storage. The `scaleIO` volume
plugin allows deployed Pods to access existing ScaleIO
volumes (or it can dynamically provision new volumes for persistent volume claims, see
[ScaleIO Persistent Volumes](/docs/concepts/storage/persistent-volumes/#scaleio)).
-->

ScaleIO 是基于软件的存储平台，可以使用现有硬件来创建可伸缩的、共享的而且是网络化的块存储集群。
`scaleIO` 卷插件允许部署的 Pod 访问现有的 ScaleIO 卷（或者它可以动态地为持久卷申领提供新的卷，参见[ScaleIO 持久卷](/docs/concepts/storage/persistent-volumes/#scaleio))。

{{< caution >}}
<!--
You must have an existing ScaleIO cluster already setup and
running with the volumes created before you can use them.
-->
在使用前，您必须有个安装完毕且运行正常的 ScaleIO 集群，并且创建好了存储卷。
{{< /caution >}}

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

### secret {#secret}

<!--
A `secret` volume is used to pass sensitive information, such as passwords, to
Pods.  You can store secrets in the Kubernetes API and mount them as files for
use by Pods without coupling to Kubernetes directly.  `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.
-->

`secret` 卷用来给 Pod 传递敏感信息，例如密码。您可以将 secret 存储在 Kubernetes API 服务器上，然后以文件的形式挂在到 Pod 中，无需直接与 Kubernetes 耦合。
`secret` 卷由 tmpfs（基于 RAM 的文件系统）提供存储，因此它们永远不会被写入非易失性（持久化的）存储器。

{{< caution >}}
<!--
You must create a secret in the Kubernetes API before you can use it.
-->
使用前您必须在 Kubernetes API 中创建 secret。
{{< /caution >}}

{{< note >}}
<!--
A Container using a Secret as a [subPath](#using-subpath) volume mount will not
receive Secret updates.
-->
容器以 [subPath](#using-subpath) 卷的方式挂载 Secret 时，它将感知不到 Secret 的更新。
{{< /note >}}

<!--
Secrets are described in more detail [here](/docs/user-guide/secrets).
-->

Secret 的更多详情请参考[这里](/docs/user-guide/secrets)。

### storageOS {#storageos}

<!--
A `storageos` volume allows an existing [StorageOS](https://www.storageos.com)
volume to be mounted into your Pod.
-->

`storageos` 卷允许将现有的 [StorageOS](https://www.storageos.com) 卷挂载到您的 Pod 中。

<!--
StorageOS runs as a Container within your Kubernetes environment, making local
or attached storage accessible from any node within the Kubernetes cluster.
Data can be replicated to protect against node failure. Thin provisioning and
compression can improve utilization and reduce cost.
-->

StorageOS 在 Kubernetes 环境中以容器的形式运行，这使得应用能够从 Kubernetes 集群中的任何节点访问本地或关联的存储。
为应对节点失效状况，可以复制数据。
若需提高利用率和降低成本，可以考虑瘦配置（Thin Provisioning）和数据压缩。

<!--
At its core, StorageOS provides block storage to Containers, accessible via a file system.

The StorageOS Container requires 64-bit Linux and has no additional dependencies.
A free developer license is available.
-->

作为其核心能力之一，StorageOS 为容器提供了可以通过文件系统访问的块存储。

StorageOS 容器需要 64 位的 Linux，并且没有其他的依赖关系。
StorageOS 提供免费的开发者授权许可。

{{< caution >}}
<!--
You must run the StorageOS Container on each node that wants to
access StorageOS volumes or that will contribute storage capacity to the pool.
For installation instructions, consult the
[StorageOS documentation](https://docs.storageos.com).
-->

您必须在每个希望访问 StorageOS 卷的或者将向存储资源池贡献存储容量的节点上运行 StorageOS 容器。
有关安装说明，请参阅 [StorageOS 文档](https://docs.storageos.com)。

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
        # The `redis-vol01` volume must already exist within StorageOS in the `default` namespace.
        volumeName: redis-vol01
        fsType: ext4
```

<!--
For more information including Dynamic Provisioning and Persistent Volume Claims, please see the
[StorageOS examples](https://github.com/kubernetes/examples/blob/master/volumes/storageos).
-->

更多关于动态供应和持久卷申领的信息请参考 [StorageOS 示例](https://github.com/kubernetes/examples/blob/master/volumes/storageos)。

### vsphereVolume {#vspherevolume}

{{< note >}}
<!--
Prerequisite: Kubernetes with vSphere Cloud Provider configured. For cloudprovider
configuration please refer [vSphere getting started guide](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/).
-->
前提条件：配备了 vSphere 云驱动的 Kubernetes。云驱动的配置方法请参考 [vSphere 使用指南](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)。
{{< /note >}}

<!--
A `vsphereVolume` is used to mount a vSphere VMDK Volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.
-->

`vsphereVolume` 用来将 vSphere VMDK 卷挂载到您的 Pod 中。
在卸载卷时，卷的内容会被保留。
vSphereVolume 卷类型支持 VMFS 和 VSAN 数据仓库。

{{< caution >}}
<!--
You must create VMDK using one of the following methods before using with Pod.
-->
在挂载到 Pod 之前，您必须用下列方式之一创建 VMDK。
{{< /caution >}}

<!--
#### Creating a VMDK volume

Choose one of the following methods to create a VMDK.
-->

#### 创建 VMDK 卷 

选择下列方式之一创建 VMDK。

{{< tabs name="tabs_volumes" >}}
{{% tab name="使用 vmkfstools 创建" %}}
<!--
{{% tab name="Create using vmkfstools" %}}
First ssh into ESX, then use the following command to create a VMDK:
-->

首先 ssh 到 ESX，然后使用下面的命令来创建 VMDK：

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```
{{% /tab %}}
{{% tab name="使用 vmware-vdiskmanager 创建" %}}
<!--
{{% tab name="Create using vmware-vdiskmanager" %}}
Use the following command to create a VMDK:
-->

使用下面的命令创建 VMDK：

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```
{{% /tab %}}

{{< /tabs >}}


<!--
#### vSphere VMDK Example configuration
-->

#### vSphere VMDK 配置示例

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
    # This VMDK volume must already exist.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

<!--
More examples can be found [here](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere).
-->

更多示例可以在[这里](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)找到。

<!--
## Using subPath

Sometimes, it is useful to share one volume for multiple uses in a single Pod. The `volumeMounts.subPath`
property can be used to specify a sub-path inside the referenced volume instead of its root.
-->

## 使用 subPath

有时，在单个 Pod 中共享卷以供多方使用是很有用的。
`volumeMounts.subPath` 属性可用于指定所引用的卷内的子路径，而不是其根路径。

<!--
Here is an example of a Pod with a LAMP stack (Linux Apache Mysql PHP) using a single, shared volume.
The HTML contents are mapped to its `html` folder, and the databases will be stored in its `mysql` folder:
-->

下面是一个使用同一共享卷的、内含 LAMP 栈（Linux Apache Mysql PHP）的 Pod 的示例。
HTML 内容被映射到卷的 `html` 文件夹，数据库将被存储在卷的 `mysql` 文件夹中：

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
### Using subPath with expanded environment variables
-->

### 使用带有扩展环境变量的 subPath

{{< feature-state for_k8s_version="v1.15" state="beta" >}}


<!--
Use the `subPathExpr` field to construct `subPath` directory names from Downward API environment variables.
Before you use this feature, you must enable the `VolumeSubpathEnvExpansion` feature gate.
The `subPath` and `subPathExpr` properties are mutually exclusive.
-->

使用 `subPathExpr` 字段从 Downward API 环境变量构造 `subPath` 目录名。
在使用此特性之前，必须启用 `VolumeSubpathEnvExpansion` 功能开关。
`subPath` 和 `subPathExpr` 属性是互斥的。

<!--
In this example, a Pod uses `subPathExpr` to create a directory `pod1` within the hostPath volume `/var/log/pods`, using the pod name from the Downward API.  The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.
-->

在这个示例中，Pod 基于 Downward API 中的 Pod 名称，使用 `subPathExpr` 在 hostPath 卷 `/var/log/pods` 中创建目录 `pod1`。
主机目录 `/var/log/pods/pod1` 挂载到了容器的 `/logs` 中。

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

## 资源

`emptyDir` 卷的存储介质（磁盘、SSD 等）是由保存 kubelet 根目录（通常是 `/var/lib/kubelet`）的文件系统的介质确定。
`emptyDir` 卷或者 `hostPath` 卷可以消耗的空间没有限制，容器之间或 Pod 之间也没有隔离。

<!--
In the future, we expect that `emptyDir` and `hostPath` volumes will be able to
request a certain amount of space using a [resource](/docs/user-guide/compute-resources)
specification, and to select the type of media to use, for clusters that have
several media types.
-->

将来，我们希望 `emptyDir` 卷和 `hostPath` 卷能够使用 [resource](/docs/user-guide/computeresources) 规范来请求一定量的空间，并且能够为具有多种介质类型的集群选择要使用的介质类型。

<!--
## Out-of-Tree Volume Plugins
The Out-of-tree volume plugins include the Container Storage Interface (CSI)
and FlexVolume. They enable storage vendors to create custom storage plugins
without adding them to the Kubernetes repository.
-->

## Out-of-Tree 卷插件

Out-of-Tree 卷插件包括容器存储接口（CSI）和 FlexVolume。
它们使存储供应商能够创建自定义存储插件，而无需将它们添加到 Kubernetes 代码仓库。

<!--
Before the introduction of CSI and FlexVolume, all volume plugins (like
volume types listed above) were "in-tree" meaning they were built, linked,
compiled, and shipped with the core Kubernetes binaries and extend the core
Kubernetes API. This meant that adding a new storage system to Kubernetes (a
volume plugin) required checking code into the core Kubernetes code repository.
-->

在引入 CSI 和 FlexVolume 之前，所有卷插件（如上面列出的卷类型）都是 "in-tree" 的，这意味着它们是与 Kubernetes 的核心组件一同构建、链接、编译和交付的，并且这些插件都扩展了 Kubernetes 的核心 API。
这意味着向 Kubernetes 添加新的存储系统（卷插件）需要将代码合并到 Kubernetes 核心代码库中。

<!--
Both CSI and FlexVolume allow volume plugins to be developed independent of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to [this FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->

CSI 和 FlexVolume 都允许独立于 Kubernetes 代码库开发卷插件，并作为扩展部署（安装）在 Kubernetes 集群上。

对于希望创建 out-of-tree 卷插件的存储供应商，请参考[这个 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)。

### CSI

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
defines a standard interface for container orchestration systems (like
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

CSI 的支持在 Kubernetes v1.9 中作为 alpha 特性引入，在 Kubernetes v1.10 中转为 beta 特性，并在 Kubernetes v1.13 正式 GA。

{{< note >}}
<!--
Support for CSI spec versions 0.2 and 0.3 are deprecated in Kubernetes
v1.13 and will be removed in a future release.
-->
{{< /note >}}

Kubernetes v1.13中不支持 CSI 规范版本0.2和0.3，并将在以后的版本中删除。

{{< note >}}
<!--
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
-->

CSI驱动程序可能并非在所有Kubernetes版本中都兼容。
请查看特定CSI驱动程序的文档，以获取每个 Kubernetes 版本所支持的部署步骤以及兼容性列表。

{{< /note >}}

<!--
Once a CSI compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach, mount, etc. the volumes exposed by the
CSI driver.

The `csi` volume type does not support direct reference from Pod and may only be
referenced in a Pod via a `PersistentVolumeClaim` object.

The following fields are available to storage administrators to configure a CSI
persistent volume:
-->

一旦在 Kubernetes 集群上部署了 CSI 兼容卷驱动程序，用户就可以使用 `csi` 卷类型来关联、挂载 CSI 驱动程序暴露出来的卷。

`csi` 卷类型不支持来自 Pod 的直接引用，只能通过 `PersistentVolumeClaim` 对象在 Pod 中引用。

存储管理员可以使用以下字段来配置 CSI 持久卷：

<!--
- `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
-->

- `driver`：指定要使用的卷驱动程序名称的字符串值。
  这个值必须与 CSI 驱动程序在 `GetPluginInfoResponse` 中返回的值相对应；该接口定义在 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)中。
  Kubernetes 使用所给的值来标识要调用的 CSI 驱动程序；CSI 驱动程序也使用该值来辨识哪些 PV 对象属于该 CSI 驱动程序。

<!--
- `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` on all calls to the CSI volume driver when
  referencing the volume.
-->

- `volumeHandle`：唯一标识卷的字符串值。
  该值必须与CSI 驱动程序在 `CreateVolumeResponse` 的 `volume_id` 字段中返回的值相对应；接口定义在 [CSI spec](https://github.com/container-storageinterface/spec/blob/master/spec.md#createvolume) 中。
  在所有对 CSI 卷驱动程序的调用中，引用该 CSI 卷时都使用此值作为 `volume_id` 参数。

<!--
- `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is
  passed to the CSI driver via the `readonly` field in the
  `ControllerPublishVolumeRequest`.
-->

- `readOnly`：一个可选的布尔值，指示通过 `ControllerPublished` 关联该卷时是否设置该卷为只读。
  默认值是 false。
  该值通过 `ControllerPublishVolumeRequest` 中的 `readonly` 字段传递给 CSI 驱动程序。

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
  该映射必须与 CSI 驱动程序返回的 `CreateVolumeResponse` 中的 `volume.attributes` 字段的映射相对应；[CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中有相应的定义。
  该映射通过`ControllerPublishVolumeRequest`、`NodeStageVolumeRequest`、和 `NodePublishVolumeRequest` 中的 `volume_attributes` 字段传递给 CSI 驱动。
  
<!--
- `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the secret object
  contains more than one secret, all secrets are passed.
-->

- `controllerPublishSecretRef`：对包含敏感信息的 secret 对象的引用；该敏感信息会被传递给 CSI 驱动来完成 CSI `ControllerPublishVolume` 和 `ControllerUnpublishVolume` 调用。
  此字段是可选的；在不需要 secret 时可以是空的。
  如果 secret 对象包含多个 secret，则所有的 secret 都会被传递。
   
<!--
- `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional, and may be empty if no secret
  is required. If the secret object contains more than one secret, all secrets
  are passed.
-->

- `nodeStageSecretRef`：对包含敏感信息的 secret 对象的引用，以传递给 CSI 驱动来完成 CSI `NodeStageVolume` 调用。
  此字段是可选的，如果不需要 secret，则可能是空的。
  如果 secret 对象包含多个 secret，则传递所有 secret。

<!--
- `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional, and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
-->
  
- `nodePublishSecretRef`：对包含敏感信息的 secret 对象的引用，以传递给 CSI 驱动来完成 CSI ``NodePublishVolume` 调用。
  此字段是可选的，如果不需要 secret，则可能是空的。
  如果 secret 对象包含多个 secret，则传递所有 secret。

<!--
#### CSI raw block volume support
-->
#### CSI 原始块卷支持

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

<!--
Starting with version 1.11, CSI introduced support for raw block volumes, which
relies on the raw block volume feature that was introduced in a previous version of
Kubernetes.  This feature will make it possible for vendors with external CSI drivers to
implement raw block volumes support in Kubernetes workloads.
-->

从 1.11 版本开始，CSI 引入了对原始块卷的支持。该特性依赖于在 Kubernetes 的之前版本中引入的原始块卷（Raw Block Volume）功能。
该特性将使具有外部 CSI 驱动程序的供应商能够在 Kubernetes 工作负载中实现原始块卷支持。

<!--
CSI block volume support is feature-gated, but enabled by default. The two
feature gates which must be enabled for this feature are `BlockVolume` and
`CSIBlockVolume`.
-->

CSI块卷支持功能已启用，但默认情况下启用。必须为此功能启用的两个功能是“ BlockVolume”和“ CSIBlockVolume”。

```
--feature-gates=BlockVolume=true,CSIBlockVolume=true
```
<!--
Learn how to
[setup your PV/PVC with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support).
-->

学习怎样[安装您的带有块卷支持的 PV/PVC](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)。

<!--
#### CSI ephemeral volumes
-->

#### CSI临时卷

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
This feature allows CSI volumes to be directly embedded in the Pod specification instead of a PersistentVolume. Volumes specified in this way are ephemeral and do not persist across Pod restarts.

Example:
-->

此功能使 CSI 卷可以直接嵌入 Pod 规范中，而不是 PersistentVolume 中。 以这种方式指定的卷是临时的，不会在 Pod 重新启动后持续存在。

实例：

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox
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
This feature requires CSIInlineVolume feature gate to be enabled. It
is enabled by default starting with Kubernetes 1.16.

CSI ephemeral volumes are only supported by a subset of CSI drivers. Please see the list of CSI drivers [here](https://kubernetes-csi.github.io/docs/drivers.html).
-->

此功能需要启用 CSIInlineVolume 功能门。 从Kubernetes 1.16开始默认启用它。

CSI 临时卷仅由一部分 CSI 驱动程序支持。 请在[此处](https://kubernetes-csi.github.io/docs/drivers.html)查看 CSI 驱动程序列表。

<!--
# Developer resources
For more information on how to develop a CSI driver, refer to the [kubernetes-csi
documentation](https://kubernetes-csi.github.io/docs/)

#### Migrating to CSI drivers from in-tree plugins
-->

＃开发人员资源
有关如何开发 CSI 驱动程序的更多信息，请参考[kubernetes-csi文档](https://kubernetes-csi.github.io/docs/)

#### 从 in-tree 插件迁移到 CSI 驱动程序

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

<!--
The CSI Migration feature, when enabled, directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
The feature implements the necessary translation logic and shims to re-route the
operations in a seamless fashion. As a result, operators do not have to make any
configuration changes to existing Storage Classes, PVs or PVCs (referring to
in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.

In the alpha state, the operations and features that are supported include
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.

In-tree plugins that support CSI Migration and have a corresponding CSI driver implemented
are listed in the "Types of Volumes" section above.
-->

启用 CSI 迁移功能后，会将针对现有 in-tree 插件的操作定向到相应的 CSI 插件（应安装和配置）。
该功能实现了必要的转换逻辑和填充以无缝方式重新路由操作。 因此，操作员在过渡到取代树内插件的CSI驱动程序时，无需对现有存储类，PV 或 PVC（指 in-tree 插件)进行任何配置更改。
在 Alpha 状态下，受支持的操作和功能包括供应/删除，附加/分离，安装/卸载和调整卷大小。
上面的 "卷类型" 部分列出了支持 CSI 迁移并已实现相应 CSI 驱动程序的树内插件。

### FlexVolume {#flexVolume}

<!--
FlexVolume is an out-of-tree plugin interface that has existed in Kubernetes
since version 1.2 (before CSI). It uses an exec-based model to interface with
drivers. FlexVolume driver binaries must be installed in a pre-defined volume
plugin path on each node (and in some cases master).

Pods interact with FlexVolume drivers through the `flexvolume` in-tree plugin.
More details can be found [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md).
-->

FlexVolume 是一个自 1.2 版本（在 CSI 之前）以来在 Kubernetes 中一直存在的 out-of-tree 插件接口。
它使用基于 exec 的模型来与驱动程序对接。
用户必须在每个节点（在某些情况下是主节点）上的预定义卷插件路径中安装 FlexVolume 驱动程序可执行文件。

Pod 通过 `flexvolume` in-tree 插件与 Flexvolume 驱动程序交互。
更多详情请参考[这里](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)。

<!--
## Mount propagation

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

Mount propagation of a volume is controlled by `mountPropagation` field in Container.volumeMounts.
Its values are:
-->

## 挂载卷的传播

挂载卷的传播能力允许将容器安装的卷共享到同一 Pod 中的其他容器，甚至共享到同一节点上的其他 Pod。

卷的挂载传播特性由 Container.volumeMounts 中的 `mountPropagation` 字段控制。
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
   该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)中描述的 `private` 挂载传播选项。

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
   
  类似的，配置了 `Bidirectional` 挂载传播选项的 Pod 如果在同一卷上挂载了内容，挂载传播设置为 `HostToContainer` 的容器都将能看到这一变化。

  该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt) 中描述的 `rslave` 挂载传播选项。

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

   该模式等同于 [Linux 内核文档](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt) 中描述的 `rshared` 挂载传播选项。


{{< caution >}}
<!--
`Bidirectional` mount propagation can be dangerous. It can damage
the host operating system and therefore it is allowed only in privileged
Containers. Familiarity with Linux kernel behavior is strongly recommended.
In addition, any volume mounts created by Containers in Pods must be destroyed
(unmounted) by the Containers on termination.
-->

`Bidirectional` 形式的挂载传播可能比较危险。
它可以破坏主机操作系统，因此它只被允许在特权容器中使用。
强烈建议您熟悉 Linux 内核行为。
此外，由 Pod 中的容器创建的任何卷挂载必须在终止时由容器销毁（卸载）。

{{< /caution >}}

<!--
### Configuration
Before mount propagation can work properly on some deployments (CoreOS,
RedHat/Centos, Ubuntu) mount share must be configured correctly in
Docker as shown below.
-->
### 配置

在某些部署环境中，挂载传播正常工作前，必须在 Docker 中正确配置挂载共享（mount share），如下所示。

<!--
Edit your Docker's `systemd` service file.  Set `MountFlags` as follows:
-->
编辑您的 Docker `systemd` 服务文件，按下面的方法设置 `MountFlags`：

```shell
MountFlags=shared
```
<!--
Or, remove `MountFlags=slave` if present.  Then restart the Docker daemon:
-->
或者，如果存在 `MountFlags=slave` 就删除掉。然后重启 Docker 守护进程：

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```



{{% capture whatsnext %}}

<!--
* Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
-->

* 参考[使用持久卷部署 WordPress 和 MySQL](/docs/tutorials/stateful-application/mysqlwordpress-persistent-volume/) 示例。
{{% /capture %}}
