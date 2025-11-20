---
layout: blog
title: '映像檔檔案系統：設定 Kubernetes 將容器儲存在獨立的檔案系統上'
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

**譯者:** [Michael Yao](https://github.com/windsonsea)

<!--
A common issue in running/operating Kubernetes clusters is running out of disk space.
When the node is provisioned, you should aim to have a good amount of storage space for your container images and running containers.
The [container runtime](/docs/setup/production-environment/container-runtimes/) usually writes to `/var`. 
This can be located as a separate partition or on the root filesystem.
CRI-O, by default, writes its containers and images to `/var/lib/containers`, while containerd writes its containers and images to `/var/lib/containerd`.
-->
磁盤空間不足是運行或操作 Kubernetes 叢集時的一個常見問題。
在製備節點時，你應該爲容器映像檔和正在運行的容器留足夠的儲存空間。
[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)通常會向 `/var` 目錄寫入資料。
此目錄可以位於單獨的分區或根檔案系統上。CRI-O 預設將其容器和映像檔寫入 `/var/lib/containers`，
而 containerd 將其容器和映像檔寫入 `/var/lib/containerd`。

<!--
In this blog post, we want to bring attention to ways that you can configure your container runtime to store its content separately from the default partition.  
This allows for more flexibility in configuring Kubernetes and provides support for adding a larger disk for the container storage while keeping the default filesystem untouched.  

One area that needs more explaining is where/what Kubernetes is writing to disk.
-->
在這篇博文中，我們想要關注的是幾種不同方式，用來設定容器運行時將其內容儲存到別的位置而非預設分區。
這些設定允許我們更靈活地設定 Kubernetes，支持在保持預設檔案系統不受影響的情況下爲容器儲存添加更大的磁盤。

需要額外講述的是 Kubernetes 向磁盤在寫入資料的具體位置及內容。

<!--
## Understanding Kubernetes disk usage

Kubernetes has persistent data and ephemeral data.  The base path for the kubelet and local
Kubernetes-specific storage is configurable, but it is usually assumed to be `/var/lib/kubelet`.
In the Kubernetes docs, this is sometimes referred to as the root or node filesystem. The bulk of this data can be categorized into:
-->
## 瞭解 Kubernetes 磁盤使用情況   {#understanding-kubernetes-disk-usage}

Kubernetes 有持久資料和臨時資料。kubelet 和特定於 Kubernetes 的本地儲存的基礎路徑是可設定的，
但通常假定爲 `/var/lib/kubelet`。在 Kubernetes 文檔中，
這一位置有時被稱爲根檔案系統或節點檔案系統。寫入的資料可以大致分類爲：

<!--
- ephemeral storage
- logs
- and container runtime

This is different from most POSIX systems as the root/node filesystem is not `/` but the disk that `/var/lib/kubelet` is on.
-->
- 臨時儲存
- 日誌
- 容器運行時

與大多數 POSIX 系統不同，這裏的根/節點檔案系統不是 `/`，而是 `/var/lib/kubelet` 所在的磁盤。

<!--
### Ephemeral storage

Pods and containers can require temporary or transient local storage for their operation.
The lifetime of the ephemeral storage does not extend beyond the life of the individual pod, and the ephemeral storage cannot be shared across pods.
-->
### 臨時儲存   {#ephemeral-storage}

Pod 和容器的某些操作可能需要臨時或瞬態的本地儲存。
臨時儲存的生命週期短於 Pod 的生命週期，且臨時儲存不能被多個 Pod 共享。

<!--
### Logs

By default, Kubernetes stores the logs of each running container, as files within `/var/log`.
These logs are ephemeral and are monitored by the kubelet to make sure that they do not grow too large while the pods are running.

You can customize the [log rotation](/docs/concepts/cluster-administration/logging/#log-rotation) settings
for each node to manage the size of these logs, and configure log shipping (using a 3rd party solution)
to avoid relying on the node-local storage.
-->
### 日誌   {#logs}

預設情況下，Kubernetes 將每個運行容器的日誌儲存爲 `/var/log` 中的檔案。
這些日誌是臨時性質的，並由 kubelet 負責監控以確保不會在 Pod 運行時變得過大。

你可以爲每個節點自定義[日誌輪換](/zh-cn/docs/concepts/cluster-administration/logging/#log-rotation)設置，
以管控這些日誌的大小，並（使用第三方解決方案）設定日誌轉儲以避免對節點本地儲存形成依賴。

<!--
### Container runtime

The container runtime has two different areas of storage for containers and images.
- read-only layer: Images are usually denoted as the read-only layer, as they are not modified when containers are running.
The read-only layer can consist of multiple layers that are combined into a single read-only layer.
There is a thin layer on top of containers that provides ephemeral storage for containers if the container is writing to the filesystem.
-->
### 容器運行時   {#container-runtime}

容器運行時針對容器和映像檔使用兩個不同的儲存區域。

- 只讀層：映像檔通常被表示爲只讀層，因爲映像檔在容器處於運行狀態期間不會被修改。
  只讀層可以由多個層組成，這些層組合到一起形成最終的只讀層。
  如果容器要向檔案系統中寫入資料，則在容器層之上會存在一個薄層爲容器提供臨時儲存。

<!--
- writeable layer: Depending on your container runtime, local writes might be
implemented as a layered write mechanism (for example, `overlayfs` on Linux or CimFS on Windows).
This is referred to as the writable layer.
Local writes could also use a writeable filesystem that is initialized with a full clone of the container
image; this is used for some runtimes based on hypervisor virtualisation.

The container runtime filesystem contains both the read-only layer and the writeable layer.
This is considered the `imagefs` in Kubernetes documentation.
-->
- 可寫層：取決於容器運行時的不同實現，本地寫入可能會用分層寫入機制來實現
  （例如 Linux 上的 `overlayfs` 或 Windows 上的 CimFS）。這一機制被稱爲可寫層。
  本地寫入也可以使用一個可寫檔案系統來實現，該檔案系統使用容器映像檔的完整克隆來初始化；
  這種方式適用於某些基於 Hypervisor 虛擬化的運行時。

容器運行時檔案系統包含只讀層和可寫層。在 Kubernetes 文檔中，這一檔案系統被稱爲 `imagefs`。

<!--
## Container runtime configurations

### CRI-O

CRI-O uses a storage configuration file in TOML format that lets you control how the container runtime stores persistent and temporary data.
CRI-O utilizes the [storage library](https://github.com/containers/storage).  
Some Linux distributions have a manual entry for storage (`man 5 containers-storage.conf`).
The main configuration for storage is located in `/etc/containers/storage.conf` and one can control the location for temporary data and the root directory.  
The root directory is where CRI-O stores the persistent data.
-->
## 容器運行時設定   {#container-runtime-configurations}

### CRI-O

CRI-O 使用 TOML 格式的儲存設定檔案，讓你控制容器運行時如何儲存持久資料和臨時資料。
CRI-O 使用了 [containers-storage 庫](https://github.com/containers/storage)。
某些 Linux 發行版爲 containers-storage 提供了幫助手冊條目（`man 5 containers-storage.conf`）。
儲存的主要設定位於 `/etc/containers/storage.conf` 中，你可以控制臨時資料和根目錄的位置。
根目錄是 CRI-O 儲存持久資料的位置。

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
# 默認存儲驅動
driver = "overlay"
# 臨時存儲位置
runroot = "/var/run/containers/storage"
# 容器存儲的主要讀/寫位置
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
  - 儲存來自容器運行時的持久資料
  - 如果 SELinux 被啓用，則此項必須是 `/var/lib/containers/storage`
- `runroot`
  - 容器的臨時讀/寫訪問
  - 建議將其放在某個臨時檔案系統上

<!--
Here is a quick way to relabel your graphroot directory to match `/var/lib/containers/storage`:

```bash
semanage fcontext -a -e /var/lib/containers/storage <YOUR-STORAGE-PATH>
restorecon -R -v <YOUR-STORAGE-PATH>
```
-->
以下是爲你的 graphroot 目錄快速重新打標籤以匹配 `/var/lib/containers/storage` 的方法：

```bash
semanage fcontext -a -e /var/lib/containers/storage <你的存儲路徑>
restorecon -R -v <你的存儲路徑>
```

<!--
### containerd

The containerd runtime uses a TOML configuration file to control where persistent and ephemeral data is stored.
The default path for the config file is located at `/etc/containerd/config.toml`.

The relevant fields for containerd storage are `root` and `state`.
-->
### containerd

containerd 運行時使用 TOML 設定檔案來控制儲存持久資料和臨時資料的位置。
設定檔案的預設路徑位於 `/etc/containerd/config.toml`。

與 containerd 儲存的相關字段是 `root` 和 `state`。

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
  - containerd 元資料的根目錄
  - 預設爲 `/var/lib/containerd`
  - 如果你的操作系統要求，需要爲根目錄設置 SELinux 標籤
- `state`
  - containerd 的臨時資料
  - 預設爲 `/run/containerd`

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
## Kubernetes 節點壓力驅逐   {#kubernetes-node-pressure-eviction}

Kubernetes 將自動檢測容器檔案系統是否與節點檔案系統分離。
當你分離檔案系統時，Kubernetes 負責同時監視節點檔案系統和容器運行時檔案系統。
Kubernetes 文檔將節點檔案系統稱爲 nodefs，將容器運行時檔案系統稱爲 imagefs。
如果 nodefs 或 imagefs 中有一個磁盤空間不足，則整個節點被視爲有磁盤壓力。
這種情況下，Kubernetes 先通過刪除未使用的容器和映像檔來回收空間，之後會嘗試驅逐 Pod。
在同時具有 nodefs 和 imagefs 的節點上，kubelet 將在 imagefs
上對未使用的容器映像檔執行[垃圾回收](/zh-cn/docs/concepts/architecture/garbage-collection/#containers-images)，
並從 nodefs 中移除死掉的 Pod 及其容器。
如果只有 nodefs，則 Kubernetes 垃圾回收將包括死掉的容器、死掉的 Pod 和未使用的映像檔。

<!--
Kubernetes allows more configurations for determining if your disk is full.  
The eviction manager within the kubelet has some configuration settings that let you control
the relevant thresholds.
For filesystems, the relevant measurements are `nodefs.available`, `nodefs.inodesfree`, `imagefs.available`, and `imagefs.inodesfree`.
If there is not a dedicated disk for the container runtime then imagefs is ignored.

Users can use the existing defaults:
-->
Kubernetes 提供額外的設定方法來確定磁盤是否已滿。kubelet 中的驅逐管理器有一些讓你可以控制相關閾值的設定項。
對於檔案系統，相關測量值有 `nodefs.available`、`nodefs.inodesfree`、`imagefs.available` 和
`imagefs.inodesfree`。如果容器運行時沒有專用磁盤，則 imagefs 被忽略。

使用者可以使用現有的預設值：

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
- `nodefs.inodesFree` < 5%（Linux 節點）

Kubernetes 允許你在 kubelet 設定檔案中將 `EvictionHard` 和 `EvictionSoft` 設置爲使用者定義的值。

<!--
`EvictionHard`
: defines limits; once these limits are exceeded, pods will be evicted without any grace period.

`EvictionSoft`
: defines limits; once these limits are exceeded, pods will be evicted with a grace period that can be set per signal.
-->
`EvictionHard`
: 定義限制；一旦超出這些限制，Pod 將被立即驅逐，沒有任何寬限期。

`EvictionSoft`
: 定義限制；一旦超出這些限制，Pod 將在按各信號所設置的寬限期後被驅逐。

<!--
If you specify a value for `EvictionHard`, it will replace the defaults.  
This means it is important to set all signals in your configuration.

For example, the following kubelet configuration could be used to configure [eviction signals](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds) and grace period options.
-->
如果你爲 `EvictionHard` 指定了值，所設置的值將取代預設值。
這意味着在你的設定中設置所有信號非常重要。

例如，以下 kubelet
設定可用於設定[驅逐信號](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds)和寬限期選項。

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
### 問題   {#problems}

Kubernetes 項目建議你針對 Pod 驅逐要麼使用其預設設置，要麼設置與之相關的所有字段。
你可以使用預設設置或指定你自己的 `evictionHard` 設置。 如果你漏掉一個信號，那麼 Kubernetes 將不會監視該資源。
管理員或使用者可能會遇到的一個常見誤配是將新的檔案系統掛載到 `/var/lib/containers/storage` 或 `/var/lib/containerd`。
Kubernetes 將檢測到一個單獨的檔案系統，因此你要確保 `imagefs.inodesfree` 和 `imagefs.available` 符合你的需要。

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
另一個令人困惑的地方是，如果你爲節點定義了映像檔檔案系統，則臨時儲存報告不會發生變化。
映像檔檔案系統（`imagefs`）用於儲存容器映像檔層；如果容器向自己的根檔案系統寫入，
那麼這種本地寫入不會計入容器映像檔的大小。容器運行時儲存這些本地修改的位置是由運行時定義的，但通常是映像檔檔案系統。
如果 Pod 中的容器正在向基於檔案系統的 `emptyDir` 卷寫入，所寫入的資料將使用 `nodefs` 檔案系統的空間。
kubelet 始終根據 `nodefs` 所表示的檔案系統來報告臨時儲存容量和分配情況；
當臨時寫入操作實際上是寫到映像檔檔案系統時，這種差別可能會讓人困惑。

<!--
### Future work

To fix the ephemeral storage reporting limitations and provide more configuration options to the container runtime, SIG Node are working on [KEP-4191](http://kep.k8s.io/4191).
In KEP-4191, Kubernetes will detect if the writeable layer is separated from the read-only layer (images).
This would allow us to have all ephemeral storage, including the writeable layer, on the same disk as well as allowing for a separate disk for images.
-->
### 後續工作   {#future-work}

爲了解決臨時儲存報告相關的限制併爲容器運行時提供更多設定選項，SIG Node
正在處理 [KEP-4191](http://kep.k8s.io/4191)。在 KEP-4191 中，
Kubernetes 將檢測可寫層是否與只讀層（映像檔）分離。
這種檢測使我們可以將包括可寫層在內的所有臨時儲存放在同一磁盤上，同時也可以爲映像檔使用單獨的磁盤。

<!--
### Getting involved

If you would like to get involved, you can
join [Kubernetes Node Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-node) (SIG).

If you would like to share feedback, you can do so on our
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack channel.
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.
-->
### 參與其中   {#getting-involved}

如果你想參與其中，可以加入
[Kubernetes Node 特別興趣小組](https://github.com/kubernetes/community/tree/master/sig-node)（SIG）。

如果你想分享反饋，可以分享到我們的
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack 頻道。
如果你還沒有加入該 Slack 工作區，可以訪問 https://slack.k8s.io/ 獲取邀請。

<!--
Special thanks to all the contributors who provided great reviews, shared valuable insights or suggested the topic idea.
-->
特別感謝所有提供出色評審、分享寶貴見解或建議主題想法的貢獻者。

- Peter Hunt
- Mrunal Patel
- Ryan Phillips
- Gaurav Singh
