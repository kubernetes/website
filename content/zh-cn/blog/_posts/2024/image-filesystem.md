---
layout: blog
title: '镜像文件系统：配置 Kubernetes 将容器存储在独立的文件系统上'
date: 2024-01-23
slug: kubernetes-separate-image-filesystem
---
<!--
layout: blog
title: 'Image Filesystem: Configuring Kubernetes to store containers on a separate filesystem'
date: 2024-01-23
slug: kubernetes-separate-image-filesystem
-->

<!--
**Author:** Kevin Hannon (Red Hat)
-->
**作者:** Kevin Hannon (Red Hat)

**译者:** [Michael Yao](https://github.com/windsonsea)

<!--
A common issue in running/operating Kubernetes clusters is running out of disk space.
When the node is provisioned, you should aim to have a good amount of storage space for your container images and running containers.
The [container runtime](/docs/setup/production-environment/container-runtimes/) usually writes to `/var`. 
This can be located as a separate partition or on the root filesystem.
CRI-O, by default, writes its containers and images to `/var/lib/containers`, while containerd writes its containers and images to `/var/lib/containerd`.
-->
磁盘空间不足是运行或操作 Kubernetes 集群时的一个常见问题。
在制备节点时，你应该为容器镜像和正在运行的容器留足够的存储空间。
[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)通常会向 `/var` 目录写入数据。
此目录可以位于单独的分区或根文件系统上。CRI-O 默认将其容器和镜像写入 `/var/lib/containers`，
而 containerd 将其容器和镜像写入 `/var/lib/containerd`。

<!--
In this blog post, we want to bring attention to ways that you can configure your container runtime to store its content separately from the default partition.  
This allows for more flexibility in configuring Kubernetes and provides support for adding a larger disk for the container storage while keeping the default filesystem untouched.  

One area that needs more explaining is where/what Kubernetes is writing to disk.
-->
在这篇博文中，我们想要关注的是几种不同方式，用来配置容器运行时将其内容存储到别的位置而非默认分区。
这些配置允许我们更灵活地配置 Kubernetes，支持在保持默认文件系统不受影响的情况下为容器存储添加更大的磁盘。

需要额外讲述的是 Kubernetes 向磁盘在写入数据的具体位置及内容。

<!--
## Understanding Kubernetes disk usage

Kubernetes has persistent data and ephemeral data.  The base path for the kubelet and local
Kubernetes-specific storage is configurable, but it is usually assumed to be `/var/lib/kubelet`.
In the Kubernetes docs, this is sometimes referred to as the root or node filesystem. The bulk of this data can be categorized into:
-->
## 了解 Kubernetes 磁盘使用情况   {#understanding-kubernetes-disk-usage}

Kubernetes 有持久数据和临时数据。kubelet 和特定于 Kubernetes 的本地存储的基础路径是可配置的，
但通常假定为 `/var/lib/kubelet`。在 Kubernetes 文档中，
这一位置有时被称为根文件系统或节点文件系统。写入的数据可以大致分类为：

<!--
- ephemeral storage
- logs
- and container runtime

This is different from most POSIX systems as the root/node filesystem is not `/` but the disk that `/var/lib/kubelet` is on.
-->
- 临时存储
- 日志
- 容器运行时

与大多数 POSIX 系统不同，这里的根/节点文件系统不是 `/`，而是 `/var/lib/kubelet` 所在的磁盘。

<!--
### Ephemeral storage

Pods and containers can require temporary or transient local storage for their operation.
The lifetime of the ephemeral storage does not extend beyond the life of the individual pod, and the ephemeral storage cannot be shared across pods.
-->
### 临时存储   {#ephemeral-storage}

Pod 和容器的某些操作可能需要临时或瞬态的本地存储。
临时存储的生命周期短于 Pod 的生命周期，且临时存储不能被多个 Pod 共享。

<!--
### Logs

By default, Kubernetes stores the logs of each running container, as files within `/var/log`.
These logs are ephemeral and are monitored by the kubelet to make sure that they do not grow too large while the pods are running.

You can customize the [log rotation](/docs/concepts/cluster-administration/logging/#log-rotation) settings
for each node to manage the size of these logs, and configure log shipping (using a 3rd party solution)
to avoid relying on the node-local storage.
-->
### 日志   {#logs}

默认情况下，Kubernetes 将每个运行容器的日志存储为 `/var/log` 中的文件。
这些日志是临时性质的，并由 kubelet 负责监控以确保不会在 Pod 运行时变得过大。

你可以为每个节点自定义[日志轮换](/zh-cn/docs/concepts/cluster-administration/logging/#log-rotation)设置，
以管控这些日志的大小，并（使用第三方解决方案）配置日志转储以避免对节点本地存储形成依赖。

<!--
### Container runtime

The container runtime has two different areas of storage for containers and images.
- read-only layer: Images are usually denoted as the read-only layer, as they are not modified when containers are running.
The read-only layer can consist of multiple layers that are combined into a single read-only layer.
There is a thin layer on top of containers that provides ephemeral storage for containers if the container is writing to the filesystem.
-->
### 容器运行时   {#container-runtime}

容器运行时针对容器和镜像使用两个不同的存储区域。

- 只读层：镜像通常被表示为只读层，因为镜像在容器处于运行状态期间不会被修改。
  只读层可以由多个层组成，这些层组合到一起形成最终的只读层。
  如果容器要向文件系统中写入数据，则在容器层之上会存在一个薄层为容器提供临时存储。

<!--
- writeable layer: Depending on your container runtime, local writes might be
implemented as a layered write mechanism (for example, `overlayfs` on Linux or CimFS on Windows).
This is referred to as the writable layer.
Local writes could also use a writeable filesystem that is initialized with a full clone of the container
image; this is used for some runtimes based on hypervisor virtualisation.

The container runtime filesystem contains both the read-only layer and the writeable layer.
This is considered the `imagefs` in Kubernetes documentation.
-->
- 可写层：取决于容器运行时的不同实现，本地写入可能会用分层写入机制来实现
  （例如 Linux 上的 `overlayfs` 或 Windows 上的 CimFS）。这一机制被称为可写层。
  本地写入也可以使用一个可写文件系统来实现，该文件系统使用容器镜像的完整克隆来初始化；
  这种方式适用于某些基于 Hypervisor 虚拟化的运行时。

容器运行时文件系统包含只读层和可写层。在 Kubernetes 文档中，这一文件系统被称为 `imagefs`。

<!--
## Container runtime configurations

### CRI-O

CRI-O uses a storage configuration file in TOML format that lets you control how the container runtime stores persistent and temporary data.
CRI-O utilizes the [storage library](https://github.com/containers/storage).  
Some Linux distributions have a manual entry for storage (`man 5 containers-storage.conf`).
The main configuration for storage is located in `/etc/containers/storage.conf` and one can control the location for temporary data and the root directory.  
The root directory is where CRI-O stores the persistent data.
-->
## 容器运行时配置   {#container-runtime-configurations}

### CRI-O

CRI-O 使用 TOML 格式的存储配置文件，让你控制容器运行时如何存储持久数据和临时数据。
CRI-O 使用了 [containers-storage 库](https://github.com/containers/storage)。
某些 Linux 发行版为 containers-storage 提供了帮助手册条目（`man 5 containers-storage.conf`）。
存储的主要配置位于 `/etc/containers/storage.conf` 中，你可以控制临时数据和根目录的位置。
根目录是 CRI-O 存储持久数据的位置。

<!--
```toml
[storage]
# Default storage driver
driver = "overlay"
# Temporary storage location
runroot = "/var/run/containers/storage"
# Primary read/write location of container storage 
graphroot = "/var/lib/containers/storage"
```
-->
```toml
[storage]
# 默认存储驱动
driver = "overlay"
# 临时存储位置
runroot = "/var/run/containers/storage"
# 容器存储的主要读/写位置
graphroot = "/var/lib/containers/storage"
```

<!--
- `graphroot`
  - Persistent data stored from the container runtime
  - If SELinux is enabled, this must match the `/var/lib/containers/storage`
- `runroot`
  - Temporary read/write access for container
  - Recommended to have this on a temporary filesystem
-->
- `graphroot`
  - 存储来自容器运行时的持久数据
  - 如果 SELinux 被启用，则此项必须是 `/var/lib/containers/storage`
- `runroot`
  - 容器的临时读/写访问
  - 建议将其放在某个临时文件系统上

<!--
Here is a quick way to relabel your graphroot directory to match `/var/lib/containers/storage`:

```bash
semanage fcontext -a -e /var/lib/containers/storage <YOUR-STORAGE-PATH>
restorecon -R -v <YOUR-STORAGE-PATH>
```
-->
以下是为你的 graphroot 目录快速重新打标签以匹配 `/var/lib/containers/storage` 的方法：

```bash
semanage fcontext -a -e /var/lib/containers/storage <你的存储路径>
restorecon -R -v <你的存储路径>
```

<!--
### containerd

The containerd runtime uses a TOML configuration file to control where persistent and ephemeral data is stored.
The default path for the config file is located at `/etc/containerd/config.toml`.

The relevant fields for containerd storage are `root` and `state`.
-->
### containerd

containerd 运行时使用 TOML 配置文件来控制存储持久数据和临时数据的位置。
配置文件的默认路径位于 `/etc/containerd/config.toml`。

与 containerd 存储的相关字段是 `root` 和 `state`。

<!--
- `root`
  - The root directory for containerd metadata
  - Default is `/var/lib/containerd`
  - Root also requires SELinux labels if your OS requires it
- `state`
  - Temporary data for containerd
  - Default is `/run/containerd`
-->
- `root`
  - containerd 元数据的根目录
  - 默认为 `/var/lib/containerd`
  - 如果你的操作系统要求，需要为根目录设置 SELinux 标签
- `state`
  - containerd 的临时数据
  - 默认为 `/run/containerd`

<!--
## Kubernetes node pressure eviction

Kubernetes will automatically detect if the container filesystem is split from the node filesystem. 
When one separates the filesystem, Kubernetes is responsible for monitoring both the node filesystem and the container runtime filesystem.
Kubernetes documentation refers to the node filesystem and the container runtime filesystem as nodefs and imagefs.
If either nodefs or the imagefs are running out of disk space, then the overall node is considered to have disk pressure.
Kubernetes will first reclaim space by deleting unusued containers and images, and then it will resort to evicting pods.
On a node that has a nodefs and an imagefs, the kubelet will
[garbage collect](/docs/concepts/architecture/garbage-collection/#containers-images) unused container images
on imagefs and will remove dead pods and their containers from the nodefs.
If there is only a nodefs, then Kubernetes garbage collection includes dead containers, dead pods and unused images.
-->
## Kubernetes 节点压力驱逐   {#kubernetes-node-pressure-eviction}

Kubernetes 将自动检测容器文件系统是否与节点文件系统分离。
当你分离文件系统时，Kubernetes 负责同时监视节点文件系统和容器运行时文件系统。
Kubernetes 文档将节点文件系统称为 nodefs，将容器运行时文件系统称为 imagefs。
如果 nodefs 或 imagefs 中有一个磁盘空间不足，则整个节点被视为有磁盘压力。
这种情况下，Kubernetes 先通过删除未使用的容器和镜像来回收空间，之后会尝试驱逐 Pod。
在同时具有 nodefs 和 imagefs 的节点上，kubelet 将在 imagefs
上对未使用的容器镜像执行[垃圾回收](/zh-cn/docs/concepts/architecture/garbage-collection/#containers-images)，
并从 nodefs 中移除死掉的 Pod 及其容器。
如果只有 nodefs，则 Kubernetes 垃圾回收将包括死掉的容器、死掉的 Pod 和未使用的镜像。

<!--
Kubernetes allows more configurations for determining if your disk is full.  
The eviction manager within the kubelet has some configuration settings that let you control
the relevant thresholds.
For filesystems, the relevant measurements are `nodefs.available`, `nodefs.inodesfree`, `imagefs.available`, and `imagefs.inodesfree`.
If there is not a dedicated disk for the container runtime then imagefs is ignored.

Users can use the existing defaults:
-->
Kubernetes 提供额外的配置方法来确定磁盘是否已满。kubelet 中的驱逐管理器有一些让你可以控制相关阈值的配置项。
对于文件系统，相关测量值有 `nodefs.available`、`nodefs.inodesfree`、`imagefs.available` 和
`imagefs.inodesfree`。如果容器运行时没有专用磁盘，则 imagefs 被忽略。

用户可以使用现有的默认值：

<!--
- `memory.available` < 100MiB
- `nodefs.available` < 10%
- `imagefs.available` < 15%
- `nodefs.inodesFree` < 5% (Linux nodes)

Kubernetes allows you to set user defined values in `EvictionHard` and `EvictionSoft` in the kubelet configuration file.
-->
- `memory.available` < 100MiB
- `nodefs.available` < 10%
- `imagefs.available` < 15%
- `nodefs.inodesFree` < 5%（Linux 节点）

Kubernetes 允许你在 kubelet 配置文件中将 `EvictionHard` 和 `EvictionSoft` 设置为用户定义的值。

<!--
`EvictionHard`
: defines limits; once these limits are exceeded, pods will be evicted without any grace period.

`EvictionSoft`
: defines limits; once these limits are exceeded, pods will be evicted with a grace period that can be set per signal.
-->
`EvictionHard`
: 定义限制；一旦超出这些限制，Pod 将被立即驱逐，没有任何宽限期。

`EvictionSoft`
: 定义限制；一旦超出这些限制，Pod 将在按各信号所设置的宽限期后被驱逐。

<!--
If you specify a value for `EvictionHard`, it will replace the defaults.  
This means it is important to set all signals in your configuration.

For example, the following kubelet configuration could be used to configure [eviction signals](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds) and grace period options.
-->
如果你为 `EvictionHard` 指定了值，所设置的值将取代默认值。
这意味着在你的配置中设置所有信号非常重要。

例如，以下 kubelet
配置可用于配置[驱逐信号](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds)和宽限期选项。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoft:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoftGracePeriod:
    memory.available:  "1m30s"
    nodefs.available:  "2m"
    nodefs.inodesFree: "2m"
    imagefs.available: "2m"
    imagefs.inodesFree: "2m"
evictionMaxPodGracePeriod: 60s
```

<!--
### Problems

The Kubernetes project recommends that you either use the default settings for eviction or you set all the fields for eviction.
You can use the default settings or specify your own `evictionHard` settings. If you miss a signal, then Kubernetes will not monitor that resource.
One common misconfiguration administrators or users can hit is mounting a new filesystem to `/var/lib/containers/storage` or `/var/lib/containerd`.
Kubernetes will detect a separate filesystem, so you want to make sure to check that `imagefs.inodesfree` and `imagefs.available` match your needs if you've done this.
-->
### 问题   {#problems}

Kubernetes 项目建议你针对 Pod 驱逐要么使用其默认设置，要么设置与之相关的所有字段。
你可以使用默认设置或指定你自己的 `evictionHard` 设置。 如果你漏掉一个信号，那么 Kubernetes 将不会监视该资源。
管理员或用户可能会遇到的一个常见误配是将新的文件系统挂载到 `/var/lib/containers/storage` 或 `/var/lib/containerd`。
Kubernetes 将检测到一个单独的文件系统，因此你要确保 `imagefs.inodesfree` 和 `imagefs.available` 符合你的需要。

<!--
Another area of confusion is that ephemeral storage reporting does not change if you define an image
filesystem for your node. The image filesystem (`imagefs`) is used to store container image layers; if a
container writes to its own root filesystem, that local write doesn't count towards the size of the container image. The place where the container runtime stores those local modifications is runtime-defined, but is often
the image filesystem.
If a container in a pod is writing to a filesystem-backed `emptyDir` volume, then this uses space from the
`nodefs` filesystem.
The kubelet always reports ephemeral storage capacity and allocations based on the filesystem represented
by `nodefs`; this can be confusing when ephemeral writes are actually going to the image filesystem.
-->
另一个令人困惑的地方是，如果你为节点定义了镜像文件系统，则临时存储报告不会发生变化。
镜像文件系统（`imagefs`）用于存储容器镜像层；如果容器向自己的根文件系统写入，
那么这种本地写入不会计入容器镜像的大小。容器运行时存储这些本地修改的位置是由运行时定义的，但通常是镜像文件系统。
如果 Pod 中的容器正在向基于文件系统的 `emptyDir` 卷写入，所写入的数据将使用 `nodefs` 文件系统的空间。
kubelet 始终根据 `nodefs` 所表示的文件系统来报告临时存储容量和分配情况；
当临时写入操作实际上是写到镜像文件系统时，这种差别可能会让人困惑。

<!--
### Future work

To fix the ephemeral storage reporting limitations and provide more configuration options to the container runtime, SIG Node are working on [KEP-4191](http://kep.k8s.io/4191).
In KEP-4191, Kubernetes will detect if the writeable layer is separated from the read-only layer (images).
This would allow us to have all ephemeral storage, including the writeable layer, on the same disk as well as allowing for a separate disk for images.
-->
### 后续工作   {#future-work}

为了解决临时存储报告相关的限制并为容器运行时提供更多配置选项，SIG Node
正在处理 [KEP-4191](http://kep.k8s.io/4191)。在 KEP-4191 中，
Kubernetes 将检测可写层是否与只读层（镜像）分离。
这种检测使我们可以将包括可写层在内的所有临时存储放在同一磁盘上，同时也可以为镜像使用单独的磁盘。

<!--
### Getting involved

If you would like to get involved, you can
join [Kubernetes Node Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-node) (SIG).

If you would like to share feedback, you can do so on our
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack channel.
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.
-->
### 参与其中   {#getting-involved}

如果你想参与其中，可以加入
[Kubernetes Node 特别兴趣小组](https://github.com/kubernetes/community/tree/master/sig-node)（SIG）。

如果你想分享反馈，可以分享到我们的
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack 频道。
如果你还没有加入该 Slack 工作区，可以访问 https://slack.k8s.io/ 获取邀请。

<!--
Special thanks to all the contributors who provided great reviews, shared valuable insights or suggested the topic idea.
-->
特别感谢所有提供出色评审、分享宝贵见解或建议主题想法的贡献者。

- Peter Hunt
- Mrunal Patel
- Ryan Phillips
- Gaurav Singh
