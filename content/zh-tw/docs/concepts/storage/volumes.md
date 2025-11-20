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
Kubernetes _volumes_ provide a way for containers in a {{< glossary_tooltip text="pod" term_id="pod" >}}
to access and share data via the filesystem. There are different kinds of volume that you can use for different purposes,
such as:
-->
Kubernetes **卷**爲 {{< glossary_tooltip text="Pod" term_id="pod" >}}
中的容器提供了一種通過檔案系統訪問和共享資料的方式。存在不同類別的卷，你可以將其用於各種用途，例如：

<!--
- populating a configuration file based on a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
  or a {{< glossary_tooltip text="Secret" term_id="secret" >}}
- providing some temporary scratch space for a pod
- sharing a filesystem between two different containers in the same pod
- sharing a filesystem between two different pods (even if those Pods run on different nodes)
- durably storing data so that it stays available even if the Pod restarts or is replaced
-->
- 基於 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 或
  {{< glossary_tooltip text="Secret" term_id="secret" >}} 填充設定檔案
- 爲 Pod 提供一些臨時的塗銷空間
- 在同一個 Pod 中的兩個不同容器之間共享檔案系統
- 在兩個不同的 Pod 之間共享檔案系統（即使這些 Pod 運行在不同的節點上）
- 持久化儲存資料，這樣即使 Pod 重啓或被替換，儲存的資料仍然可用
<!--
- passing configuration information to an app running in a container, based on details of the Pod
  the container is in
  (for example: telling a {{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}
  what namespace the Pod is running in)
- providing read-only access to data in a different container image
-->
- 基於容器所在 Pod 的詳細資訊，將設定資訊傳遞給運行在容器中的應用
  （例如告訴{{< glossary_tooltip text="邊車容器" term_id="sidecar-container" >}}：Pod 運行在哪個命名空間）
- 以只讀權限訪問另一個容器映像檔中的資料

<!--
Data sharing can be between different local processes within a container, or between different containers,
or between Pods.
-->
資料共享可以發生在容器內不同本地進程之間，或在不同容器之間，或在多個 Pod 之間。

<!--
## Why volumes are important

- **Data persistence:** On-disk files in a container are ephemeral, which presents some problems for
  non-trivial applications when running in containers. One problem occurs when
  a container crashes or is stopped, the container state is not saved so all of the
  files that were created or modified during the lifetime of the container are lost.
  After a crash, kubelet restarts the container with a clean state.
-->
## 爲什麼卷很重要   {#why-volumes-are-important}

- **資料持久性：** 容器中的檔案在磁盤上是臨時存放的，這給在容器中運行較重要的應用帶來一些問題。
  當容器崩潰或被停止時，容器的狀態不會被保存，因此在容器生命期內創建或修改的所有檔案都將丟失。
  在崩潰之後，kubelet 會以乾淨的狀態重啓容器。

<!--
- **Shared storage:** Another problem occurs when multiple containers are running in a `Pod` and
  need to share files. It can be challenging to set up
  and access a shared filesystem across all of the containers.

The Kubernetes {{< glossary_tooltip text="volume" term_id="volume" >}} abstraction
can help you to solve both of these problems.
-->
- **共享儲存：** 當多個容器在一個 Pod 中運行並需要共享檔案時，會出現另一個問題。
  那就是在所有容器之間設置和訪問共享檔案系統可能會很有難度。

Kubernetes {{< glossary_tooltip text="卷（Volume）" term_id="volume" >}}
這一抽象概念能夠解決這兩個問題。

<!--
Before you learn about volumes, PersistentVolumes and PersistentVolumeClaims, you should read up
about {{< glossary_tooltip term_id="Pod" text="Pods" >}} and make sure that you understand how
Kubernetes uses Pods to run containers.
-->
在你學習卷、持久卷（PersistentVolume）和持久卷申領（PersistentVolumeClaim）之前，
你應該先了解 {{< glossary_tooltip term_id="Pod" text="Pods" >}}，
確保你理解 Kubernetes 如何使用 Pod 來運行容器。

<!-- body -->

<!--
## How volumes work
-->
## 卷是如何工作的   {#how-volumes-work}

<!--
Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
[Ephemeral volume](/docs/concepts/storage/ephemeral-volumes/) types have a lifetime linked to a specific Pod,
but [persistent volumes](/docs/concepts/storage/persistent-volumes/) exist beyond
the lifetime of any individual pod. When a pod ceases to exist, Kubernetes destroys ephemeral volumes;
however, Kubernetes does not destroy persistent volumes.
For any kind of volume in a given pod, data is preserved across container restarts.
-->
Kubernetes 支持很多類型的卷。
{{< glossary_tooltip term_id="pod" text="Pod" >}} 可以同時使用任意數目的卷類型。
[臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)類型將生命期關聯到特定的 Pod，
但[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)可以比任意獨立 Pod 的生命期長。
當 Pod 不再存在時，Kubernetes 也會銷燬臨時卷；不過 Kubernetes 不會銷燬持久卷。
對於給定 Pod 中任何類型的卷，在容器重啓期間資料都不會丟失。

<!--
At its core, a volume is a directory, possibly with some data in it, which
is accessible to the containers in a pod. How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.
-->
卷的核心是一個目錄，其中可能存有資料，Pod 中的容器可以訪問該目錄中的資料。
所採用的特定的卷類型將決定該目錄如何形成的、使用何種介質保存資料以及目錄中存放的內容。

<!--
To use a volume, specify the volumes to provide for the Pod in `.spec.volumes`
and declare where to mount those volumes into containers in `.spec.containers[*].volumeMounts`.
-->
使用卷時, 在 `.spec.volumes` 字段中設置爲 Pod 提供的卷，並在
`.spec.containers[*].volumeMounts` 字段中聲明卷在容器中的掛載位置。

<!--
When a pod is launched, a process in the container sees a filesystem view composed from the initial contents of
the {{< glossary_tooltip text="container image" term_id="image" >}}, plus volumes
(if defined) mounted inside the container.
The process sees a root filesystem that initially matches the contents of the container image.
Any writes to within that filesystem hierarchy, if allowed, affect what that process views
when it performs a subsequent filesystem access.
Volumes are mounted at [specified paths](#using-subpath) within the container filesystem.
For each container defined within a Pod, you must independently specify where
to mount each volume that the container uses.
-->
當 Pod 被啓動時，容器中的進程看到的檔案系統視圖是由它們的{{< glossary_tooltip text="容器映像檔" term_id="image" >}}
的初始內容以及掛載在容器中的卷（如果定義了的話）所組成的。
其中根檔案系統同容器映像檔的內容相吻合。
任何在該檔案系統下的寫入操作，如果被允許的話，都會影響接下來容器中進程訪問檔案系統時所看到的內容。
卷被掛載在映像檔中的[指定路徑](#using-subpath)下。
Pod 設定中的每個容器必須獨立指定各個卷的掛載位置。

<!--
Volumes cannot mount within other volumes (but see [Using subPath](#using-subpath)
for a related mechanism). Also, a volume cannot contain a hard link to anything in
a different volume.
-->
卷不能掛載到其他卷之上（不過存在一種[使用 subPath](#using-subpath) 的相關機制），也不能與其他卷有硬鏈接。

<!--
## Types of volumes {#volume-types}

Kubernetes supports several types of volumes.
-->
## 卷類型  {#volume-types}

Kubernetes 支持下列類型的卷：

<!--
### awsElasticBlockStore (deprecated) {#awselasticblockstore}
-->
### awsElasticBlockStore （已棄用）   {#awselasticblockstore}

<!-- maintenance note: OK to remove all mention of awsElasticBlockStore once the v1.27 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `awsElasticBlockStore` type
are redirected to the `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AWSElasticBlockStore in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
third party storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `awsElasticBlockStore`
類型的操作都會被重定向到 `ebs.csi.aws.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。

AWSElasticBlockStore 樹內儲存驅動已在 Kubernetes v1.19 版本中廢棄，
並在 v1.27 版本中被完全移除。

Kubernetes 項目建議你轉爲使用 [AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
第三方儲存驅動插件。

<!--
### azureDisk (deprecated) {#azuredisk}
-->
### azureDisk （已棄用）   {#azuredisk}

<!-- maintenance note: OK to remove all mention of azureDisk once the v1.27 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `azureDisk` type
are redirected to the `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AzureDisk in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.27 release.

The Kubernetes project suggests that you use the [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
third party storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `azureDisk`
類型的操作都會被重定向到 `disk.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。

AzureDisk 樹內儲存驅動已在 Kubernetes v1.19 版本中廢棄，並在 v1.27 版本中被完全移除。

Kubernetes 項目建議你轉爲使用 [Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
第三方儲存驅動插件。

<!--
### azureFile (deprecated) {#azurefile}
-->
### azureFile （已棄用）    {#azurefile}

<!-- maintenance note: OK to remove all mention of azureFile once the v1.30 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `azureFile` type
are redirected to the `file.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The AzureFile  in-tree storage driver was deprecated in the Kubernetes v1.21 release
and then removed entirely in the v1.30 release.

The Kubernetes project suggests that you use the [Azure File](https://github.com/kubernetes-sigs/azurefile-csi-driver)
third party storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `azureFile` 類型的操作都會被重定向到
`file.csi.azure.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。  

AzureFile 樹內儲存驅動在 Kubernetes v1.21 版本中被棄用，並在 v1.30 版本中被完全移除。  

Kubernetes 項目建議你改爲使用 [Azure File](https://github.com/kubernetes-sigs/azurefile-csi-driver)
第三方儲存驅動。

<!--
### cephfs (removed) {#cephfs}
-->
### cephfs（已移除）  {#cephfs}

<!-- maintenance note: OK to remove all mention of cephfs once the v1.30 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `cephfs` volume type.

The `cephfs` in-tree storage driver was deprecated in the Kubernetes v1.28
release and then removed entirely in the v1.31 release.
-->
Kubernetes {{< skew currentVersion >}} 不包括 `cephfs` 卷類型。

`cephfs` 樹內儲存驅動在 Kubernetes v1.28 版本中被棄用，並在 v1.31 版本中被完全移除。

<!--
### cinder (deprecated) {#cinder}
-->
### cinder（已棄用）   {#cinder}

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
在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `cinder`
類型的操作都會被重定向到 `cinder.csi.openstack.org` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。

OpenStack Cinder 樹內儲存驅動已在 Kubernetes v1.11 版本中廢棄，
並在 v1.26 版本中被完全移除。

Kubernetes 項目建議你轉爲使用
[OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
第三方儲存驅動插件。

### configMap

<!--
A [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provides a way to inject configuration data into pods.
The data stored in a ConfigMap can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a pod.
-->
[`configMap`](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
卷提供了向 Pod 注入設定資料的方法。
ConfigMap 對象中儲存的資料可以被 `configMap` 類型的卷引用，然後被 Pod 中運行的容器化應用使用。

<!--
When referencing a ConfigMap, you provide the name of the ConfigMap in the
volume. You can customize the path to use for a specific
entry in the ConfigMap. The following configuration shows how to mount
the `log-config` ConfigMap onto a Pod called `configmap-pod`:
-->
引用 configMap 對象時，你可以在卷中通過它的名稱來引用。
你可以自定義 ConfigMap 中特定條目所要使用的路徑。
下面的設定顯示瞭如何將名爲 `log-config` 的 ConfigMap 掛載到名爲 `configmap-pod`
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
            path: log_level.conf
```

<!--
The `log-config` ConfigMap is mounted as a volume, and all contents stored in
its `log_level` entry are mounted into the Pod at path `/etc/config/log_level.conf`.
Note that this path is derived from the volume's `mountPath` and the `path`
keyed with `log_level`.
-->
`log-config` ConfigMap 以卷的形式掛載，並且儲存在 `log_level`
條目中的所有內容都被掛載到 Pod 的 `/etc/config/log_level.conf` 路徑下。
請注意，這個路徑來源於卷的 `mountPath` 和 `log_level` 鍵對應的 `path`。

{{< note >}}
<!--
* You must [create a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap)
  before you can use it.

* A ConfigMap is always mounted as `readOnly`.

* A container using a ConfigMap as a [`subPath`](#using-subpath) volume mount will not
  receive updates when the ConfigMap changes.
  
* Text data is exposed as files using the UTF-8 character encoding.
  For other character encodings, use `binaryData`.
-->
* 你必須先[創建 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap)，
  才能使用它。
* ConfigMap 總是以 `readOnly` 的模式掛載。
* 某容器以 [`subPath`](#using-subpath) 卷掛載方式使用 ConfigMap 時，
  若 ConfigMap 發生變化，此容器將無法接收更新。
* 文本資料掛載成檔案時採用 UTF-8 字符編碼。如果使用其他字符編碼形式，可使用
  `binaryData` 字段。
{{< /note >}}

### downwardAPI {#downwardapi}

<!--
A `downwardAPI` volume makes {{< glossary_tooltip term_id="downward-api" text="downward API" >}}
data available to applications. Within the volume, you can find the exposed
data as read-only files in plain text format.
-->
`downwardAPI` 卷用於爲應用提供 {{< glossary_tooltip term_id="downward-api" text="downward API" >}} 資料。
在這類卷中，所公開的資料以純文本格式的只讀檔案形式存在。

{{< note >}}
<!--
A container using the downward API as a [`subPath`](#using-subpath) volume mount does not
receive updates when field values change.
-->
容器以 [subPath](#using-subpath) 卷掛載方式使用 downward API 時，在字段值更改時將不能接收到它的更新。
{{< /note >}}

<!--
See [Expose Pod Information to Containers Through Files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
to learn more.
-->
更多詳細資訊請參考[通過檔案將 Pod 資訊呈現給容器](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)。

### emptyDir {#emptydir}

<!--
For a Pod that defines an `emptyDir` volume, the volume is created when the Pod is assigned to a node.
As the name says, the `emptyDir` volume is initially empty. All containers in the Pod can read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each container. When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted permanently.
-->
對於定義了 `emptyDir` 卷的 Pod，在 Pod 被指派到某節點時此卷會被創建。
就像其名稱所表示的那樣，`emptyDir` 卷最初是空的。儘管 Pod 中的容器掛載 `emptyDir`
卷的路徑可能相同也可能不同，但這些容器都可以讀寫 `emptyDir` 卷中相同的檔案。
當 Pod 因爲某些原因被從節點上刪除時，`emptyDir` 卷中的資料也會被永久刪除。

{{< note >}}
<!--
A container crashing does *not* remove a Pod from a node. The data in an `emptyDir` volume
is safe across container crashes.
-->
容器崩潰並**不**會導致 Pod 被從節點上移除，因此容器崩潰期間 `emptyDir` 卷中的資料是安全的。
{{< /note >}}

<!--
Some uses for an `emptyDir` are:

* scratch space, such as for a disk-based merge sort
* checkpointing a long computation for recovery from crashes
* holding files that a content-manager container fetches while a webserver
  container serves the data
-->
`emptyDir` 的一些用途：

* 緩存空間，例如基於磁盤的歸併排序。
* 爲耗時較長的計算任務提供檢查點，以便任務能方便地從崩潰前狀態恢復執行。
* 在 Web 伺服器容器服務資料時，保存內容管理器容器獲取的檔案。

<!--
The `emptyDir.medium` field controls where `emptyDir` volumes are stored. By
default `emptyDir` volumes are stored on whatever medium that backs the node
such as disk, SSD, or network storage, depending on your environment. If you set
the `emptyDir.medium` field to `"Memory"`, Kubernetes mounts a tmpfs (RAM-backed
filesystem) for you instead. While tmpfs is very fast, be aware that, unlike
disks, files you write count against the memory limit of the container that wrote them.
-->
`emptyDir.medium` 字段用來控制 `emptyDir` 卷的儲存位置。
預設情況下，`emptyDir` 卷儲存在該節點所使用的介質上；
此處的介質可以是磁盤、SSD 或網路儲存，這取決於你的環境。
你可以將 `emptyDir.medium` 字段設置爲 `"Memory"`，
以告訴 Kubernetes 爲你掛載 tmpfs（基於 RAM 的檔案系統）。
雖然 tmpfs 速度非常快，但是要注意它與磁盤不同，
並且你所寫入的所有檔案都會計入容器的內存消耗，受容器內存限制約束。

<!--
A size limit can be specified for the default medium, which limits the capacity
of the `emptyDir` volume. The storage is allocated from
[node ephemeral storage](/docs/concepts/configuration/manage-resources-containers/#setting-requests-and-limits-for-local-ephemeral-storage).
If that is filled up from another source (for example, log files or image overlays),
the `emptyDir` may run out of capacity before this limit.
If no size is specified, memory-backed volumes are sized to node allocatable memory.
-->
你可以通過爲預設介質指定大小限制，來限制 `emptyDir` 卷的儲存容量。
此儲存是從[節點臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/#setting-requests-and-limits-for-local-ephemeral-storage)中分配的。
如果來自其他來源（如日誌檔案或映像檔分層資料）的資料佔滿了儲存，`emptyDir`
可能會在達到此限制之前發生儲存容量不足的問題。

<!--
If no size is specified, memory backed volumes are sized to node allocatable memory.
-->
如果未指定大小，內存支持的卷將被設置爲節點可分配內存的大小。

{{< caution >}}
<!--
Please check [here](/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir)
for points to note in terms of resource management when using memory-backed `emptyDir`.
-->
使用內存作爲介質的 `emptyDir` 卷時，
請查閱[此處](/zh-cn/docs/concepts/configuration/manage-resources-containers/#memory-backed-emptydir)，
瞭解有關資源管理方面的注意事項。
{{< /caution >}}

<!--
#### emptyDir configuration example
-->
#### emptyDir 設定示例

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
#### emptyDir memory configuration example
-->
#### emptyDir 內存設定示例

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
      medium: Memory
```

<!--
### fc (fibre channel) {#fc}

An `fc` volume type allows an existing fibre channel block storage volume
to be mounted in a Pod. You can specify single or multiple target world wide names (WWNs)
using the parameter `targetWWNs` in your Volume configuration. If multiple WWNs are specified,
targetWWNs expect that those WWNs are from multi-path connections.
-->
### fc（光纖通道） {#fc}

`fc` 卷類型允許將現有的光纖通道塊儲存卷掛載到 Pod 中。
可以使用卷設定中的參數 `targetWWNs` 來指定單個或多個目標 WWN（World Wide Names）。
如果指定了多個 WWN，targetWWNs 期望這些 WWN 來自多路徑連接。

{{< note >}}
<!--
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs
beforehand so that Kubernetes hosts can access them.
-->
你必須設定 FC SAN Zoning，以便預先向目標 WWN 分配和屏蔽這些 LUN（卷），這樣
Kubernetes 主機纔可以訪問它們。
{{< /note >}}

<!--
### gcePersistentDisk (deprecated) {#gcepersistentdisk}

In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `gcePersistentDisk` type
are redirected to the `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
-->
### gcePersistentDisk（已棄用） {#gcepersistentdisk}

在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `gcePersistentDisk`
類型的操作都會被重定向到 `pd.csi.storage.gke.io` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。

<!--
The `gcePersistentDisk` in-tree storage driver was deprecated in the Kubernetes v1.17 release
and then removed entirely in the v1.28 release.
-->
`gcePersistentDisk` 源代碼樹內卷儲存驅動在 Kubernetes v1.17 版本中被棄用，在 v1.28 版本中被完全移除。

<!--
The Kubernetes project suggests that you use the
[Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
third party storage driver instead.
-->
Kubernetes 項目建議你轉爲使用
[Google Compute Engine Persistent Disk CSI](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
第三方儲存驅動插件。

<!--
### gitRepo (deprecated) {#gitrepo}
-->
### gitRepo (已棄用)    {#gitrepo}

{{< warning >}}
<!--
The `gitRepo` volume plugin is deprecated and is disabled by default.

To provision a Pod that has a Git repository mounted, you can mount an
[`emptyDir`](#emptydir) volume into an [init container](/docs/concepts/workloads/pods/init-containers/)
that clones the repo using Git, then mount the [EmptyDir](#emptydir) into the Pod's container.
-->
`gitRepo` 卷插件已經被棄用且預設禁用。

如果需要製備已掛載 Git 倉庫的 Pod，你可以將
[EmptyDir](#emptydir) 卷掛載到 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)中，
使用 Git 命令完成倉庫的克隆操作，然後將 [EmptyDir](#emptydir) 卷掛載到 Pod 的容器中。

---

<!--
You can restrict the use of `gitRepo` volumes in your cluster using
[policies](/docs/concepts/policy/), such as
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
You can use the following Common Expression Language (CEL) expression as
part of a policy to reject use of `gitRepo` volumes:
-->
你可以使用 [ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
這類[策略](/zh-cn/docs/concepts/policy/)來限制在你的叢集中使用 `gitRepo` 卷。
你可以使用以下通用表達語言（CEL）表達式作爲策略的一部分，以拒絕使用 `gitRepo` 卷：

```cel
!has(object.spec.volumes) || !object.spec.volumes.exists(v, has(v.gitRepo))
```
{{< /warning >}}

<!--
You can use this deprecated storage plugin in your cluster if you explicitly
enable the `GitRepoVolumeDriver`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
如果你明確啓用 `GitRepoVolumeDriver`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你可以在叢集中使用這個已廢棄的儲存插件。

<!--
A `gitRepo` volume is an example of a volume plugin. This plugin
mounts an empty directory and clones a git repository into this directory
for your Pod to use.

Here is an example of a `gitRepo` volume:
-->
`gitRepo` 卷是一個卷插件的例子。
該查卷掛載一個空目錄，並將一個 Git 代碼倉庫克隆到這個目錄中供 Pod 使用。

下面給出一個 `gitRepo` 卷的示例：

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
Kubernetes {{< skew currentVersion >}} 不包含 `glusterfs` 卷類型。

GlusterFS 樹內儲存驅動程式在 Kubernetes v1.25 版本中被棄用，然後在 v1.26 版本中被完全移除。

### hostPath {#hostpath}

<!--
A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.
-->
`hostPath` 卷能將主機節點檔案系統上的檔案或目錄掛載到你的 Pod 中。
雖然這不是大多數 Pod 需要的，但是它爲一些應用提供了強大的逃生艙。

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
使用 `hostPath` 類型的卷存在許多安全風險。如果可以，你應該儘量避免使用 `hostPath` 卷。
例如，你可以改爲定義並使用 [`local` PersistentVolume](#local)。

如果你通過准入時的驗證來限制對節點上特定目錄的訪問，這種限制只有在你額外要求所有
`hostPath` 卷的掛載都是**只讀**的情況下才有效。如果你允許不受信任的 Pod 以讀寫方式掛載任意主機路徑，
則該 Pod 中的容器可能會破壞可讀寫主機掛載卷的安全性。

---

<!--
Take care when using `hostPath` volumes, whether these are mounted as read-only
or as read-write, because:
-->
無論 `hostPath` 卷是以只讀還是讀寫方式掛載，使用時都需要小心，這是因爲：

<!--
* Access to the host filesystem can expose privileged system credentials (such as for the kubelet) or privileged APIs
  (such as the container runtime socket) that can be used for container escape or to attack other
  parts of the cluster.
* Pods with identical configuration (such as created from a PodTemplate) may
  behave differently on different nodes due to different files on the nodes.
* `hostPath` volume usage is not treated as ephemeral storage usage.
  You need to monitor the disk usage by yourself because excessive `hostPath` disk
  usage will lead to disk pressure on the node.
-->
* 訪問主機檔案系統可能會暴露特權系統憑證（例如 kubelet 的憑證）或特權 API（例如容器運行時套接字），
  這些可以被用於容器逃逸或攻擊叢集的其他部分。
* 具有相同設定的 Pod（例如基於 PodTemplate 創建的 Pod）可能會由於節點上的檔案不同而在不同節點上表現出不同的行爲。
* `hostPath` 卷的用量不會被視爲臨時儲存用量。
  你需要自己監控磁盤使用情況，因爲過多的 `hostPath` 磁盤使用量會導致節點上的磁盤壓力。
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

* 運行一個需要訪問節點級系統組件的容器
  （例如一個將系統日誌傳輸到集中位置的容器，使用只讀掛載 `/var/log` 來訪問這些日誌）
* 讓儲存在主機系統上的設定檔案可以被{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}
  以只讀方式訪問；與普通 Pod 不同，靜態 Pod 無法訪問 ConfigMap。

<!--
#### `hostPath` volume types

In addition to the required `path` property, you can optionally specify a
`type` for a `hostPath` volume.

The available values for `type` are:
-->
#### `hostPath` 卷類型

除了必需的 `path` 屬性外，你還可以選擇爲 `hostPath` 卷指定 `type`。

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
| 取值  | 行爲     |
|:------|:---------|
| `‌""` | 空字符串（預設）用於向後兼容，這意味着在安裝 hostPath 卷之前不會執行任何檢查。 |
| `DirectoryOrCreate` | 如果在給定路徑上什麼都不存在，那麼將根據需要創建空目錄，權限設置爲 0755，具有與 kubelet 相同的組和屬主資訊。 |
| `Directory` | 在給定路徑上必須存在的目錄。|
| `FileOrCreate` | 如果在給定路徑上什麼都不存在，那麼將在那裏根據需要創建空檔案，權限設置爲 0644，具有與 kubelet 相同的組和所有權。|
| `File` | 在給定路徑上必須存在的檔案。|
| `Socket` | 在給定路徑上必須存在的 UNIX 套接字。|
| `CharDevice` | **（僅 Linux 節點）** 在給定路徑上必須存在的字符設備。|
| `BlockDevice` | **（僅 Linux 節點）** 在給定路徑上必須存在的塊設備。|

{{< caution >}}
<!--
The `FileOrCreate` mode does **not** create the parent directory of the file. If the parent directory
of the mounted file does not exist, the pod fails to start. To ensure that this mode works,
you can try to mount directories and files separately, as shown in the
[`FileOrCreate` example](#hostpath-fileorcreate-example) for `hostPath`.
-->
`FileOrCreate` 模式**不會**創建檔案的父目錄。如果掛載檔案的父目錄不存在，Pod 將啓動失敗。
爲了確保這種模式正常工作，你可以嘗試分別掛載目錄和檔案，如
`hostPath` 的 [`FileOrCreate` 示例](#hostpath-fileorcreate-example)所示。
{{< /caution >}}

<!--
Some files or directories created on the underlying hosts might only be
accessible by root. You then either need to run your process as root in a
[privileged container](/docs/tasks/configure-pod-container/security-context/)
or modify the file permissions on the host to read from or write to a `hostPath` volume.
-->
下層主機上創建的某些檔案或目錄只能由 root 使用者訪問。
此時，你需要在[特權容器](/zh-cn/docs/tasks/configure-pod-container/security-context/)中以
root 身份運行進程，或者修改主機上的檔案權限，以便能夠從 `hostPath` 卷讀取資料（或將資料寫入到 `hostPath` 卷）。

<!--
#### hostPath configuration example
-->
#### hostPath 設定示例

{{< tabs name="hostpath_examples" >}}

<!--
Linux node
---
# This manifest mounts /data/foo on the host as /foo inside the
# single container that runs within the hostpath-example-linux Pod.
#
# The mount into the container is read-only.
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
    # mount /data/foo, but only if that directory already exists
    hostPath:
      path: /data/foo # directory location on host
      type: Directory # this field is optional
-->

{{< tab name="Linux 節點" codelang="yaml" >}}
---
# 此清單將主機上的 /data/foo 掛載爲 hostpath-example-linux Pod 中運行的單個容器內的 /foo
#
# 容器中的掛載是隻讀的
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
    # 掛載 /data/foo，但僅當該目錄已經存在時
    hostPath:
      path: /data/foo # 主機上的目錄位置
      type: Directory # 此字段可選
{{< /tab >}}

<!--
Windows node
---
# This manifest mounts C:\Data\foo on the host as C:\foo, inside the
# single container that runs within the hostpath-example-windows Pod.
#
# The mount into the container is read-only.
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
    # mount C:\Data\foo from the host, but only if that directory already exists
  - name: example-volume
    hostPath:
      path: "C:\\Data\\foo" # directory location on host
      type: Directory       # this field is optional
-->
{{< tab name="Windows 節點" codelang="yaml" >}}
---
# 此清單將主機上的 C:\Data\foo 掛載爲 hostpath-example-windows Pod 中運行的單個容器內的 C:\foo
#
# 容器中的掛載是隻讀的
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
    # 從主機掛載 C:\Data\foo，但僅當該目錄已經存在時
  - name: example-volume
    hostPath:
      path: "C:\\Data\\foo" # 主機上的目錄位置
      type: Directory       # 此字段可選
{{< /tab >}}
{{< /tabs >}}

<!--
#### hostPath FileOrCreate configuration example {#hostpath-fileorcreate-example}
-->
#### hostPath FileOrCreate 設定示例  {#hostpath-fileorcreate-example}

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
以下清單定義了一個 Pod，將 `/var/local/aaa` 掛載到 Pod 中的單個容器內。
如果節點上還沒有路徑 `/var/local/aaa`，kubelet 會創建這一目錄，然後將其掛載到 Pod 中。

如果 `/var/local/aaa` 已經存在但不是一個目錄，Pod 會失敗。
此外，kubelet 還會嘗試在該目錄內創建一個名爲 `/var/local/aaa/1.txt` 的檔案（從主機的視角來看）；
如果在該路徑上已經存在某個東西且不是常規檔案，則 Pod 會失敗。

以下是清單示例：

<!--
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
      # Ensure the file directory is created.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```
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
      # 確保文件所在目錄成功創建。
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

An example of using the `image` volume source is:
-->
`image` 卷源代表一個在 kubelet 主機上可用的 OCI 對象（容器映像檔或工件）。

使用 `image` 卷源的一個例子是：

{{% code_sample file="pods/image-volumes.yaml" %}}

<!--
The volume is resolved at pod startup depending on which `pullPolicy` value is
provided:

`Always`
: the kubelet always attempts to pull the reference. If the pull fails,
  the kubelet sets the Pod to `Failed`.
-->
此卷在 Pod 啓動時基於提供的 `pullPolicy` 值進行解析：

`Always`
: kubelet 始終嘗試拉取此引用。如果拉取失敗，kubelet 會將 Pod 設置爲 `Failed`。

<!--
`Never`
: the kubelet never pulls the reference and only uses a local image or artifact.
  The Pod becomes `Failed` if any layers of the image aren't already present locally,
  or if the manifest for that image isn't already cached.

`IfNotPresent`
: the kubelet pulls if the reference isn't already present on disk. The Pod becomes
  `Failed` if the reference isn't present and the pull fails.
-->
`Never`
: kubelet 從不拉取此引用，僅使用本地映像檔或工件。
  如果本地沒有任何映像檔層存在，或者該映像檔的清單未被緩存，則 Pod 會變爲 `Failed`。

`IfNotPresent`
: 如果引用在磁盤上不存在，kubelet 會進行拉取。
  如果引用不存在且拉取失敗，則 Pod 會變爲 `Failed`。

<!--
The volume gets re-resolved if the pod gets deleted and recreated, which means
that new remote content will become available on pod recreation. A failure to
resolve or pull the image during pod startup will block containers from starting
and may add significant latency. Failures will be retried using normal volume
backoff and will be reported on the pod reason and message.
-->
如果 Pod 被刪除並重新創建，此卷會被重新解析，這意味着在 Pod 重新創建時將可以訪問新的遠程內容。
在 Pod 啓動期間解析或拉取映像檔失敗將導致容器無法啓動，並可能顯著增加延遲。
如果失敗，將使用正常的捲回退進行重試，並輸出 Pod 失敗的原因和相關消息。

<!--
The types of objects that may be mounted by this volume are defined by the
container runtime implementation on a host machine. At a minimum, they must include
all valid types supported by the container image field. The OCI object gets
mounted in a single directory (`spec.containers[*].volumeMounts.mountPath`)
and will be mounted read-only. On Linux, the container runtime typically also mounts the
volume with file execution blocked (`noexec`).
-->
此卷可以掛載的對象類型由主機上的容器運行時實現負責定義，至少必須包含容器映像檔字段所支持的所有有效類型。
OCI 對象將以只讀方式被掛載到單個目錄（`spec.containers[*].volumeMounts.mountPath`）中。
在 Linux 上，容器運行時通常還會掛載阻止檔案執行（`noexec`）的卷。

<!--
Besides that:

- [`subPath`](/docs/concepts/storage/volumes/#using-subpath) or
  [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment)
  mounts for containers (`spec.containers[*].volumeMounts.[subPath,subPathExpr]`)
  are only supported from Kubernetes v1.33.
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The [`AlwaysPullImages` Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  does also work for this volume source like for container images.
-->
此外：

- 從 Kubernetes v1.33 開始，才支持容器的 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath) 或
  [`subPathExpr`](/zh-cn/docs/concepts/storage/volumes/#using-subpath-expanded-environment)
  掛載（`spec.containers[*].volumeMounts.[subPath,subPathExpr]`）。
- `spec.securityContext.fsGroupChangePolicy` 字段對這種卷沒有效果。
- [`AlwaysPullImages` 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)也適用於此卷源，
  就像適用於容器映像檔一樣。

<!--
The following fields are available for the `image` type:
-->
`image` 類型可用的字段如下：

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
  來加載 Kubernetes 合規性測試映像檔中的檔案。其行爲與 `pod.spec.containers[*].image` 相同。
  拉取 Secret 的組裝方式與容器映像檔所用的方式相同，即通過查找節點憑據、服務賬戶映像檔拉取 Secret
  和 Pod 規約映像檔拉取 Secret。此字段是可選的，允許更高層次的設定管理在 Deployment 和
  StatefulSet 這類工作負載控制器中預設使用或重載容器映像檔。
  參閱[容器映像檔更多細節](/zh-cn/docs/concepts/containers/images)。

<!--
`pullPolicy`
: Policy for pulling OCI objects. Possible values are: `Always`, `Never` or
  `IfNotPresent`. Defaults to `Always` if `:latest` tag is specified, or
  `IfNotPresent` otherwise.

See the [_Use an Image Volume With a Pod_](/docs/tasks/configure-pod-container/image-volumes)
example for more details on how to use the volume source.
-->
`pullPolicy`
: 拉取 OCI 對象的策略。可能的值爲：`Always`、`Never` 或 `IfNotPresent`。
  如果指定了 `:latest` 標記，則預設爲 `Always`，否則預設爲 `IfNotPresent`。

有關如何使用卷源的更多細節，
請參見 [Pod 使用映像檔卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)示例。

### iscsi

<!--
An `iscsi` volume allows an existing iSCSI (SCSI over IP) volume to be mounted
into your Pod. Unlike `emptyDir`, which is erased when a Pod is removed, the
contents of an `iscsi` volume are preserved and the volume is merely
unmounted. This means that an iscsi volume can be pre-populated with data, and
that data can be shared between pods.
-->
`iscsi` 卷能將 iSCSI (基於 IP 的 SCSI) 卷掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`iscsi`
卷的內容在刪除 Pod 時會被保留，卷只是被卸載。
這意味着 `iscsi` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

{{< note >}}
<!--
You must have your own iSCSI server running with the volume created before you can use it.
-->
在使用 iSCSI 卷之前，你必須擁有自己的 iSCSI 伺服器，並在上面創建卷。
{{< /note >}}

<!--
A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously. This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need. Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.
-->
iSCSI 的一個特點是它可以同時被多個使用者以只讀方式掛載。
這意味着你可以用資料集預先填充卷，然後根據需要在儘可能多的 Pod 上使用它。
不幸的是，iSCSI 卷只能由單個使用者以讀寫模式掛載。不允許同時寫入。

### local

<!--
A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported.
-->
`local` 卷所代表的是某個被掛載的本地儲存設備，例如磁盤、分區或者目錄。

`local` 卷只能用作靜態創建的持久卷。不支持動態設定。

<!--
Compared to `hostPath` volumes, `local` volumes are used in a durable and
portable manner without manually scheduling pods to nodes. The system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.
-->
與 `hostPath` 卷相比，`local` 卷能夠以持久和可移植的方式使用，而無需手動將 Pod
調度到節點。系統通過查看 PersistentVolume 的節點親和性設定，就能瞭解卷的節點約束。

<!--
However, `local` volumes are subject to the availability of the underlying
node and are not suitable for all applications. If a node becomes unhealthy,
then the `local` volume becomes inaccessible to the pod. The pod using this volume
is unable to run. Applications using `local` volumes must be able to tolerate this
reduced availability, as well as potential data loss, depending on the
durability characteristics of the underlying disk.

The following example shows a PersistentVolume using a `local` volume and
`nodeAffinity`:
-->
然而，`local` 卷仍然取決於底層節點的可用性，並不適合所有應用程式。
如果節點變得不健康，那麼 `local` 卷也將變得不可被 Pod 訪問。使用它的 Pod 將不能運行。
使用 `local` 卷的應用程式必須能夠容忍這種可用性的降低，以及因底層磁盤的耐用性特徵而帶來的潛在的資料丟失風險。

下面是一個使用 `local` 卷和 `nodeAffinity` 的持久卷示例：

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
使用 `local` 卷時，你需要設置 PersistentVolume 對象的 `nodeAffinity` 字段。
Kubernetes 調度器使用 PersistentVolume 的 `nodeAffinity` 資訊來將使用 `local`
卷的 Pod 調度到正確的節點。

<!--
PersistentVolume `volumeMode` can be set to "Block" (instead of the default
value "Filesystem") to expose the local volume as a raw block device.
-->
PersistentVolume 對象的 `volumeMode` 字段可被設置爲 "Block"
（而不是預設值 "Filesystem"），以將 `local` 卷作爲原始塊設備暴露出來。

<!--
When using local volumes, it is recommended to create a StorageClass with
`volumeBindingMode` set to `WaitForFirstConsumer`. For more details, see the
local [StorageClass](/docs/concepts/storage/storage-classes/#local) example.
Delaying volume binding ensures that the PersistentVolumeClaim binding decision
will also be evaluated with any other node constraints the Pod may have,
such as node resource requirements, node selectors, Pod affinity, and Pod anti-affinity.
-->
使用 `local` 卷時，建議創建一個 StorageClass 並將其 `volumeBindingMode` 設置爲
`WaitForFirstConsumer`。要了解更多詳細資訊，請參考
[local StorageClass 示例](/zh-cn/docs/concepts/storage/storage-classes/#local)。
延遲卷綁定的操作可以確保 Kubernetes 在爲 PersistentVolumeClaim 作出綁定決策時，會評估
Pod 可能具有的其他節點約束，例如：如節點資源需求、節點選擇器、Pod 親和性和 Pod 反親和性。

<!--
An external static provisioner can be run separately for improved management of
the local volume lifecycle. Note that this provisioner does not support dynamic
provisioning yet. For an example on how to run an external local provisioner, see the
[local volume provisioner user guide](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).
-->
你可以在 Kubernetes 之外單獨運行靜態驅動以改進對 local 卷的生命週期管理。
請注意，此驅動尚不支持動態設定。
有關如何運行外部 `local` 卷驅動，請參考
[local 卷驅動使用者指南](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)。

{{< note >}}
<!--
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
-->
如果不使用外部靜態驅動來管理卷的生命週期，使用者需要手動清理和刪除 local 類型的持久卷。
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
`nfs` 卷能將 NFS (網路檔案系統) 掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`nfs` 卷的內容在刪除 Pod
時會被保存，卷只是被卸載。
這意味着 `nfs` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

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
在使用 NFS 卷之前，你必須運行自己的 NFS 服務器並將目標 share 導出備用。

還需要注意，不能在 Pod spec 中指定 NFS 掛載可選項。
可以選擇設置服務端的掛載可選項，或者使用
[/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html)。
此外，還可以通過允許設置掛載可選項的持久卷掛載 NFS 卷。
{{< /note >}}

### persistentVolumeClaim {#persistentvolumeclaim}

<!--
A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod. PersistentVolumeClaims
are a way for users to "claim" durable storage (such as an iSCSI volume)
without knowing the details of the particular cloud environment.
-->
`persistentVolumeClaim` 卷用來將[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)（PersistentVolume）掛載到 Pod 中。
持久卷申領（PersistentVolumeClaim）是使用者在不知道特定雲環境細節的情況下“申領”持久儲存（例如 iSCSI 卷）的一種方法。

<!--
See the information about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) for more
details.
-->
更多詳情請參考[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!--
### portworxVolume (deprecated) {#portworxvolume}
-->
### portworxVolume（已棄用） {#portworxvolume}

{{< feature-state for_k8s_version="v1.25" state="deprecated" >}}

<!--
A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage
in a server, tiers based on capabilities, and aggregates capacity across multiple servers.
Portworx runs in-guest in virtual machines or on bare metal Linux nodes.
-->
`portworxVolume` 是一個可伸縮的塊儲存層，能夠以超融合（hyperconverged）的方式與 Kubernetes 一起運行。
[Portworx](https://portworx.com/use-case/kubernetes-storage/)
支持對服務器上儲存的指紋處理、基於儲存能力進行分層以及跨多個服務器整合儲存容量。
Portworx 可以以 in-guest 方式在虛擬機中運行，也可以在裸金屬 Linux 節點上運行。

<!--
A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Pod.
Here is an example Pod referencing a pre-provisioned Portworx volume:
-->
`portworxVolume` 類型的卷可以通過 Kubernetes 動態創建，也可以預先配備並在 Pod 內引用。
下面是一個引用預先配備的 Portworx 卷的示例 Pod：

<!--
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
    # This Portworx volume must already exist.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```
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
    # 此 Portworx 卷必須已經存在
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}}
<!--
Make sure you have an existing PortworxVolume with name `pxvol`
before using it in the Pod.
-->
在 Pod 中使用 portworxVolume 之前，你要確保有一個名爲 `pxvol` 的 PortworxVolume 存在。
{{< /note >}}

<!--
#### Portworx CSI migration
-->
#### Portworx CSI 遷移

{{< feature-state feature_gate_name="CSIMigrationPortworx" >}}

<!--
In Kubernetes {{% skew currentVersion %}}, all operations for the in-tree
Portworx volumes are redirected to the `pxd.portworx.com` 
Container Storage Interface (CSI) Driver by default. 
[Portworx CSI Driver](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)
must be installed on the cluster.
-->
在 Kubernetes {{% skew currentVersion %}} 中，預設情況下，
所有針對樹內 Portworx 卷的操作都會被重定向到 
`pxd.portworx.com` 容器儲存介面（CSI）驅動。
[Portworx CSI 驅動程式](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi)必須安裝在叢集上。

<!--
### projected

A projected volume maps several existing volume sources into the same
directory. For more details, see [projected volumes](/docs/concepts/storage/projected-volumes/).
-->
### 投射（projected）   {#projected}

投射卷能將若干現有的捲來源映射到同一目錄上。更多詳情請參考[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)。

<!--
### rbd (removed) {#rbd}
-->
### rbd（已移除）  {#rbd}

<!-- maintenance note: OK to remove all mention of rbd once the v1.30 release of
Kubernetes has gone out of support -->

<!--
Kubernetes {{< skew currentVersion >}} does not include a `rbd` volume type.

The [Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) in-tree storage driver
and its csi migration support were deprecated in the Kubernetes v1.28 release
and then removed entirely in the v1.31 release.
-->
Kubernetes {{< skew currentVersion >}} 不包括 `rbd` 卷類型。

[Rados 塊設備](https://docs.ceph.com/en/latest/rbd/)（RBD）
樹內儲存驅動及其 CSI 遷移支持在 Kubernetes v1.28 版本中被棄用，並在 v1.31 版本中被完全移除。

### secret

<!--
A `secret` volume is used to pass sensitive information, such as passwords, to
Pods. You can store secrets in the Kubernetes API and mount them as files for
use by pods without coupling to Kubernetes directly. `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.
-->
`secret` 卷用來給 Pod 傳遞敏感資訊，例如密碼。你可以將 Secret 儲存在 Kubernetes
API 伺服器上，然後以檔案的形式掛載到 Pod 中，無需直接與 Kubernetes 耦合。
`secret` 卷由 tmpfs（基於 RAM 的檔案系統）提供儲存，因此它們永遠不會被寫入非易失性（持久化的）儲存器。

{{< note >}}
<!--
* You must create a Secret in the Kubernetes API before you can use it.

* A Secret is always mounted as `readOnly`.

* A container using a Secret as a [`subPath`](#using-subpath) volume mount will not
  receive Secret updates.
-->
* 使用前你必須在 Kubernetes API 中創建 Secret。
* Secret 總是以 `readOnly` 的模式掛載。
* 容器以 [`subPath`](#using-subpath) 卷掛載方式使用 Secret 時，將無法接收 Secret 的更新。
{{< /note >}}

<!--
For more details, see [Configuring Secrets](/docs/concepts/configuration/secret/).
-->
更多詳情請參考[設定 Secret](/zh-cn/docs/concepts/configuration/secret/)。

<!--
### vsphereVolume (deprecated) {#vspherevolume}
-->
### vsphereVolume（已棄用） {#vspherevolume}

<!-- maintenance note: OK to remove all mention of vsphereVolume once the v1.30 release of
Kubernetes has gone out of support -->

<!--
In Kubernetes {{< skew currentVersion >}}, all operations for the in-tree `vsphereVolume` type
are redirected to the `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.

The `vsphereVolume` in-tree storage driver was deprecated in the Kubernetes v1.19 release
and then removed entirely in the v1.30 release.

The Kubernetes project suggests that you use the
[vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
third party storage driver instead.
-->
在 Kubernetes {{< skew currentVersion >}} 中，所有針對樹內 `vsphereVolume` 類型的操作都被重定向到
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。  

`vsphereVolume` 樹內儲存驅動在 Kubernetes v1.19 版本中被棄用，並在 v1.30 版本中被完全移除。  

Kubernetes 項目建議你改爲使用 [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver)
第三方儲存驅動。

<!--
## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single pod.
The `volumeMounts[*].subPath` property specifies a sub-path inside the referenced volume
instead of its root.
-->
## 使用 subPath  {#using-subpath}

有時，在單個 Pod 中共享卷以供多方使用是很有用的。
`volumeMounts[*].subPath` 屬性可用於指定所引用的卷內的子路徑，而不是其根路徑。

<!--
The following example shows how to configure a Pod with a LAMP stack (Linux Apache MySQL PHP)
using a single, shared volume. This sample `subPath` configuration is not recommended
for production use.

The PHP application's code and assets map to the volume's `html` folder and
the MySQL database is stored in the volume's `mysql` folder. For example:
-->
下面例子展示瞭如何設定某包含 LAMP 堆棧（Linux Apache MySQL PHP）的 Pod 使用同一共享卷。
此示例中的 `subPath` 設定不建議在生產環境中使用。
PHP 應用的代碼和相關資料映射到卷的 `html` 檔案夾，MySQL 資料庫儲存在卷的 `mysql` 檔案夾中：

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
### 使用帶有擴展環境變量的 subPath  {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Use the `subPathExpr` field to construct `subPath` directory names from
downward API environment variables.
The `subPath` and `subPathExpr` properties are mutually exclusive.
-->
使用 `subPathExpr` 字段可以基於 downward API 環境變量來構造 `subPath` 目錄名。
`subPath` 和 `subPathExpr` 屬性是互斥的。

<!--
In this example, a `Pod` uses `subPathExpr` to create a directory `pod1` within
the `hostPath` volume `/var/log/pods`.
The `hostPath` volume takes the `Pod` name from the `downwardAPI`.
The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.
-->
在這個示例中，`Pod` 使用 `subPathExpr` 來 `hostPath` 卷 `/var/log/pods` 中創建目錄 `pod1`。
`hostPath` 卷採用來自 `downwardAPI` 的 Pod 名稱生成目錄名。
宿主機目錄 `/var/log/pods/pod1` 被掛載到容器的 `/logs` 中。

<!--
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
      # The variable expansion uses round brackets (not curly brackets).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```
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
      # 包裹變量名的是小括號，而不是大括號
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

<!--
## Resources

The storage medium (such as Disk or SSD) of an `emptyDir` volume is determined by the
medium of the filesystem holding the kubelet root dir (typically
`/var/lib/kubelet`). There is no limit on how much space an `emptyDir` or
`hostPath` volume can consume, and no isolation between containers or
pods.
-->
## 資源   {#resources}

`emptyDir` 卷的儲存介質（例如磁盤、SSD 等）是由保存 kubelet
資料的根目錄（通常是 `/var/lib/kubelet`）的檔案系統的介質確定。
Kubernetes 對 `emptyDir` 卷或者 `hostPath` 卷可以消耗的空間沒有限制，容器之間或 Pod 之間也沒有隔離。

<!--
To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).
-->
要了解如何使用資源規約來請求空間，
可參考[如何管理資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。

<!--
## Out-of-tree volume plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), and also
FlexVolume (which is deprecated). These plugins enable storage vendors to create custom storage plugins
without adding their plugin source code to the Kubernetes repository.
-->
## 樹外（Out-of-Tree）卷插件    {#out-of-tree-volume-plugins}

Out-of-Tree 卷插件包括{{< glossary_tooltip text="容器儲存介面（CSI）" term_id="csi" >}}和
FlexVolume（已棄用）。它們使儲存供應商能夠創建自定義儲存插件，而無需將插件源碼添加到
Kubernetes 代碼倉庫。

<!--
Previously, all volume plugins were "in-tree". The "in-tree" plugins were built, linked, compiled,
and shipped with the core Kubernetes binaries. This meant that adding a new storage system to
Kubernetes (a volume plugin) required checking code into the core Kubernetes code repository.
-->
以前，所有卷插件（如上面列出的卷類型）都是“樹內（In-Tree）”的。
“樹內”插件是與 Kubernetes 的核心組件一同構建、鏈接、編譯和交付的。
這意味着向 Kubernetes 添加新的儲存系統（卷插件）需要將代碼合併到 Kubernetes 核心代碼庫中。

<!--
Both CSI and FlexVolume allow volume plugins to be developed independently of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to the [volume plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
CSI 和 FlexVolume 都允許獨立於 Kubernetes 代碼庫開發卷插件，並作爲擴展部署（安裝）在 Kubernetes 叢集上。

對於希望創建樹外（Out-Of-Tree）卷插件的儲存供應商，
請參考[卷插件常見問題](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)。

### CSI

<!--
[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.
-->
[容器儲存介面](https://github.com/container-storage-interface/spec/blob/master/spec.md)（CSI）
爲容器編排系統（如 Kubernetes）定義標準介面，以將任意儲存系統暴露給它們的容器工作負載。

<!--
Please read the [CSI design proposal](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
for more information.
-->
更多詳情請閱讀 [CSI 設計方案](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)。

{{< note >}}
<!--
Support for CSI spec versions 0.2 and 0.3 is deprecated in Kubernetes
v1.13 and will be removed in a future release.
-->
Kubernetes v1.13 廢棄了對 CSI 規範版本 0.2 和 0.3 的支持，並將在以後的版本中刪除。
{{< /note >}}

{{< note >}}
<!--
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
-->
CSI 驅動可能並非兼容所有的 Kubernetes 版本。
請查看特定 CSI 驅動的文檔，以瞭解各個 Kubernetes 版本所支持的部署步驟以及兼容性列表。
{{< /note >}}

<!--
Once a CSI-compatible volume driver is deployed on a Kubernetes cluster, users
may use the `csi` volume type to attach or mount the volumes exposed by the
CSI driver.

A `csi` volume can be used in a Pod in three different ways:

* through a reference to a [PersistentVolumeClaim](#persistentvolumeclaim)
* with a [generic ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* with a [CSI ephemeral volume](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
  if the driver supports that
-->
一旦在 Kubernetes 叢集上部署了 CSI 兼容卷驅動程式，使用者就可以使用
`csi` 卷類型來掛接、掛載 CSI 驅動所提供的卷。

`csi` 卷可以在 Pod 中以三種方式使用：

* 通過 [PersistentVolumeClaim](#persistentvolumeclaim) 對象引用
* 使用[一般性的臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
* 使用 [CSI 臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)，
  前提是驅動支持這種用法

<!--
The following fields are available to storage administrators to configure a CSI
persistent volume:
-->
儲存管理員可以使用以下字段來設定 CSI 持久卷：

<!--
* `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the
  [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
-->
* `driver`：指定要使用的卷驅動名稱的字符串值。
  這個值必須與 CSI 驅動程式在 `GetPluginInfoResponse` 中返回的值相對應；該介面定義在
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)中。
  Kubernetes 使用所給的值來標識要調用的 CSI 驅動程式；CSI
  驅動程式也使用該值來辨識哪些 PV 對象屬於該 CSI 驅動程式。

<!--
* `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the
  [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` in all calls to the CSI volume driver when
  referencing the volume.
-->
* `volumeHandle`：唯一標識卷的字符串值。
  該值必須與 CSI 驅動在 `CreateVolumeResponse` 的 `volume_id` 字段中返回的值相對應；介面定義在
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中。
  在所有對 CSI 卷驅動程式的調用中，引用該 CSI 卷時都使用此值作爲 `volume_id` 參數。

<!--
* `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is passed
  to the CSI driver via the `readonly` field in the `ControllerPublishVolumeRequest`.
-->
* `readOnly`：一個可選的布爾值，指示通過 `ControllerPublished` 關聯該卷時是否設置該卷爲只讀。預設值是 false。
  該值通過 `ControllerPublishVolumeRequest` 中的 `readonly` 字段傳遞給 CSI 驅動。

<!--
* `fsType`: If the PV's `VolumeMode` is `Filesystem`, then this field may be used
  to specify the filesystem that should be used to mount the volume. If the
  volume has not been formatted and formatting is supported, this value will be
  used to format the volume.
  This value is passed to the CSI driver via the `VolumeCapability` field of
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
* `fsType`：如果 PV 的 `VolumeMode` 爲 `Filesystem`，那麼此字段指定掛載卷時應該使用的檔案系統。
  如果卷尚未格式化，並且支持格式化，此值將用於格式化卷。
  此值可以通過 `ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 的 `VolumeCapability` 字段傳遞給 CSI 驅動。

<!--
* `volumeAttributes`: A map of string to string that specifies static properties
  of a volume. This map must correspond to the map returned in the
  `volume.attributes` field of the `CreateVolumeResponse` by the CSI driver as
  defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The map is passed to the CSI driver via the `volume_context` field in the
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
* `volumeAttributes`：一個字符串到字符串的映射表，用來設置卷的靜態屬性。
  該映射必須與 CSI 驅動程式返回的 `CreateVolumeResponse` 中的 `volume.attributes`
  字段的映射相對應；
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)中有相應的定義。
  該映射通過 `ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 中的 `volume_context` 字段傳遞給 CSI 驅動。

<!--
* `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the Secret
  contains more than one secret, all secrets are passed.
-->
* `controllerPublishSecretRef`：對包含敏感資訊的 Secret 對象的引用；
  該敏感資訊會被傳遞給 CSI 驅動來完成 CSI `ControllerPublishVolume` 和
  `ControllerUnpublishVolume` 調用。
  此字段是可選的；在不需要 Secret 時可以是空的。
  如果 Secret 包含多個 Secret 條目，則所有的 Secret 條目都會被傳遞。

<!--
* `nodeExpandSecretRef`: A reference to the secret containing sensitive
  information to pass to the CSI driver to complete the CSI
  `NodeExpandVolume` call. This field is optional and may be empty if no
  secret is required. If the object contains more than one secret, all
  secrets are passed. When you have configured secret data for node-initiated
  volume expansion, the kubelet passes that data via the `NodeExpandVolume()`
  call to the CSI driver. All supported versions of Kubernetes offer the
  `nodeExpandSecretRef` field, and have it available by default. Kubernetes releases
  prior to v1.25 did not include this support.
* Enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/)
  named `CSINodeExpandSecret` for each kube-apiserver and for the kubelet on every
  node. Since Kubernetes version 1.27, this feature has been enabled by default
  and no explicit enablement of the feature gate is required.
  You must also be using a CSI driver that supports or requires secret data during
  node-initiated storage resize operations.
-->
* `nodeExpandSecretRef`：對包含敏感資訊的 Secret 對象的引用，
  該資訊會傳遞給 CSI 驅動以完成 CSI `NodeExpandVolume` 調用。
  此字段是可選的，如果不需要 Secret，則可能是空的。
  如果 Secret 包含多個 Secret 條目，則傳遞所有 Secret 條目。
  當你爲節點初始化的卷擴展設定 Secret 資料時，kubelet 會通過 `NodeExpandVolume()`
  調用將該資料傳遞給 CSI 驅動。所有受支持的 Kubernetes 版本都提供 `nodeExpandSecretRef` 字段，
  並且預設可用。Kubernetes v1.25 之前的版本不包括此支持。
  爲每個 kube-apiserver 和每個節點上的 kubelet 啓用名爲 `CSINodeExpandSecret`
  的[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed/)。
  自 Kubernetes 1.27 版本起，此特性已預設啓用，無需顯式啓用特性門控。
  在節點初始化的儲存大小調整操作期間，你還必須使用支持或需要 Secret 資料的 CSI 驅動。

<!--
* `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
-->
* `nodePublishSecretRef`：對包含敏感資訊的 Secret 對象的引用。
  該資訊傳遞給 CSI 驅動來完成 CSI `NodePublishVolume` 調用。
  此字段是可選的，如果不需要 Secret，則可能是空的。
  如果 Secret 對象包含多個 Secret 條目，則傳遞所有 Secret 條目。

<!--
* `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional and may be empty if no secret
  is required. If the Secret contains more than one secret, all secrets
  are passed.
-->
* `nodeStageSecretRef`：對包含敏感資訊的 Secret 對象的引用，
  該資訊會傳遞給 CSI 驅動以完成 CSI `NodeStageVolume` 調用。
  此字段是可選的，如果不需要 Secret，則可能是空的。
  如果 Secret 包含多個 Secret 條目，則傳遞所有 Secret 條目。

<!--
#### CSI raw block volume support
-->
#### CSI 原始塊卷支持    {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Vendors with external CSI drivers can implement raw block volume support
in Kubernetes workloads.
-->
具有外部 CSI 驅動程式的供應商能夠在 Kubernetes 工作負載中實現原始塊卷支持。

<!--
You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
as usual, without any CSI-specific changes.
-->
你可以和以前一樣，
安裝自己的[帶有原始塊卷支持的 PV/PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)，
採用 CSI 對此過程沒有影響。

<!--
#### CSI ephemeral volumes
-->
#### CSI 臨時卷   {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across pod restarts. See
[Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
for more information.
-->
你可以直接在 Pod 規約中設定 CSI 卷。採用這種方式設定的卷都是臨時卷，
無法在 Pod 重新啓動後繼續存在。
進一步的資訊可參閱[臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)。

<!--
For more information on how to develop a CSI driver, refer to the
[kubernetes-csi documentation](https://kubernetes-csi.github.io/docs/)
-->
有關如何開發 CSI 驅動的更多資訊，請參考 [kubernetes-csi 文檔](https://kubernetes-csi.github.io/docs/)。

<!--
#### Windows CSI proxy
-->
#### Windows CSI 代理  {#windows-csi-proxy}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
CSI node plugins need to perform various privileged
operations like scanning of disk devices and mounting of file systems. These operations
differ for each host operating system. For Linux worker nodes, containerized CSI node
plugins are typically deployed as privileged containers. For Windows worker nodes,
privileged operations for containerized CSI node plugins is supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.
-->
CSI 節點插件需要執行多種特權操作，例如掃描磁盤設備和掛載檔案系統等。
這些操作在每個宿主機操作系統上都是不同的。對於 Linux 工作節點而言，容器化的 CSI
節點插件通常部署爲特權容器。對於 Windows 工作節點而言，容器化 CSI
節點插件的特權操作是通過 [csi-proxy](https://github.com/kubernetes-csi/csi-proxy)
來支持的。csi-proxy 是一個由社區管理的、獨立的可執行二進制檔案，
需要被預安裝到每個 Windows 節點上。

要了解更多的細節，可以參考你要部署的 CSI 插件的部署指南。

<!--
#### Migrating to CSI drivers from in-tree plugins
-->
#### 從樹內插件遷移到 CSI 驅動程式  {#migrating-to-csi-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The `CSIMigration` feature directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.
-->
`CSIMigration` 特性針對現有樹內插件的操作會被定向到相應的 CSI 插件（應已安裝和設定）。
因此，操作員在過渡到取代樹內插件的 CSI 驅動時，無需對現有儲存類、PV 或 PVC（指樹內插件）進行任何設定更改。

{{< note >}}
<!--
Existing PVs created by a in-tree volume plugin can still be used in the future without any configuration
changes, even after the migration to CSI is completed for that volume type, and even after you upgrade to a
version of Kubernetes that doesn't have compiled-in support for that kind of storage.

As part of that migration, you - or another cluster administrator - **must** have installed and configured
the appropriate CSI driver for that storage. The core of Kubernetes does not install that software for you.
-->
即使你針對這種卷完成了 CSI 遷移且你升級到不再內置對這種儲存類別的支持的 Kubernetes 版本，
現有的由樹內卷插件所創建的 PV 在未來無需進行任何設定更改就可以使用，

作爲遷移的一部分，你或其他叢集管理員**必須**安裝和設定適用於該儲存的 CSI 驅動。
Kubernetes 不會爲你安裝該軟體。

---

<!--
After that migration, you can also define new PVCs and PVs that refer to the legacy, built-in
storage integrations.
Provided you have the appropriate CSI driver installed and configured, the PV creation continues
to work, even for brand new volumes. The actual storage management now happens through
the CSI driver.
-->
在完成遷移之後，你也可以定義新的 PVC 和 PV，引用原來的、內置的集成儲存。
只要你安裝並設定了適當的 CSI 驅動，即使是全新的卷，PV 的創建仍然可以繼續工作。
實際的儲存管理現在通過 CSI 驅動來進行。
{{< /note >}}

<!--
The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.
-->
所支持的操作和特性包括：配備（Provisioning）/刪除、掛接（Attach）/解掛（Detach）、
掛載（Mount）/卸載（Unmount）和調整卷大小。

<!--
In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).
-->
上面的[卷類型](#volume-types)節列出了支持 `CSIMigration` 並已實現相應 CSI
驅動程式的樹內插件。

<!--
### flexVolume (deprecated)   {#flexvolume}
-->
### flexVolume（已棄用）   {#flexvolume}

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

<!--
FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.
-->
FlexVolume 是一個使用基於 exec 的模型來與驅動程式對接的樹外插件介面。
使用者必須在每個節點上的預定義卷插件路徑中安裝 FlexVolume
驅動程式可執行檔案，在某些情況下，控制平面節點中也要安裝。

Pod 通過 `flexvolume` 樹內插件與 FlexVolume 驅動程式交互。

<!--
The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:
-->
下面的 FlexVolume
[插件](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)以
PowerShell 腳本的形式部署在宿主機系統上，支持 Windows 節點：

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

{{< note >}}
<!--
FlexVolume is deprecated. Using an out-of-tree CSI driver is the recommended way to integrate external storage with Kubernetes.

Maintainers of FlexVolume driver should implement a CSI Driver and help to migrate users of FlexVolume drivers to CSI.
Users of FlexVolume should move their workloads to use the equivalent CSI Driver.
-->
FlexVolume 已被棄用。推薦使用樹外 CSI 驅動來將外部儲存整合進 Kubernetes。

FlexVolume 驅動的維護者應開發一個 CSI 驅動並幫助使用者從 FlexVolume 驅動遷移到 CSI。
FlexVolume 使用者應遷移工作負載以使用對等的 CSI 驅動。
{{< /note >}}

<!--
## Mount propagation
-->
## 掛載卷的傳播   {#mount-propagation}

{{< caution >}}
<!--
Mount propagation is a low-level feature that does not work consistently on all
volume types. The Kubernetes project recommends only using mount propagation with `hostPath`
or memory-backed `emptyDir` volumes. See
[Kubernetes issue #95049](https://github.com/kubernetes/kubernetes/issues/95049)
for more context.
-->
掛載卷的傳播是一項底層功能，不能在所有類型的卷中以一致的方式工作。
建議只在 `hostPath` 或基於內存的 `emptyDir` 卷中使用。
詳情請參考[討論](https://github.com/kubernetes/kubernetes/issues/95049)。
{{< /caution >}}

<!--
Mount propagation allows for sharing volumes mounted by a container to
other containers in the same pod, or even to other pods on the same node.

Mount propagation of a volume is controlled by the `mountPropagation` field
in `containers[*].volumeMounts`. Its values are:
-->
掛載卷的傳播能力允許將容器安裝的卷共享到同一 Pod 中的其他容器，甚至共享到同一節點上的其他 Pod。

卷的掛載傳播特性由 `containers[*].volumeMounts` 中的 `mountPropagation` 字段控制。
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
* `None` - 此卷掛載將不會感知到主機後續在此卷或其任何子目錄上執行的掛載變化。
  類似的，容器所創建的卷掛載在主機上是不可見的。這是預設模式。

  該模式等同於 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html) 中描述的
  `rprivate` 掛載傳播選項。

  然而，當 `rprivate` 傳播選項不適用時，CRI 運行時可以轉爲選擇 `rslave` 掛載傳播選項
  （即 `HostToContainer`）。當掛載源包含 Docker 守護進程的根目錄（`/var/lib/docker`）時，
  cri-dockerd（Docker）已知可以選擇 `rslave` 掛載傳播選項。

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
* `HostToContainer` - 此卷掛載將會感知到主機後續針對此卷或其任何子目錄的掛載操作。

  換句話說，如果主機在此掛載卷中掛載任何內容，容器將能看到它被掛載在那裏。

  類似的，設定了 `Bidirectional` 掛載傳播選項的 Pod 如果在同一捲上掛載了內容，掛載傳播設置爲
  `HostToContainer` 的容器都將能看到這一變化。

  該模式等同於 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)中描述的
  `rslave` 掛載傳播選項。

<!--
* `Bidirectional` - This volume mount behaves the same the `HostToContainer` mount.
  In addition, all volume mounts created by the container will be propagated
  back to the host and to all containers of all pods that use the same volume.

  A typical use case for this mode is a Pod with a FlexVolume or CSI driver or
  a Pod that needs to mount something on the host using a `hostPath` volume.

  This mode is equal to `rshared` mount propagation as described in the
  [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html)
-->
* `Bidirectional` - 這種卷掛載和 `HostToContainer` 掛載表現相同。
  另外，容器創建的卷掛載將被傳播回至主機和使用同一卷的所有 Pod 的所有容器。

  該模式的典型用例是帶有 FlexVolume 或 CSI 驅動的 Pod，或者需要通過
  `hostPath` 卷在主機上掛載某些東西的 Pod。

  該模式等同於 [`mount(8)`](https://man7.org/linux/man-pages/man8/mount.8.html) 中描述的
  `rshared` 掛載傳播選項。

  {{< warning >}}
  <!--
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system and therefore it is allowed only in privileged
  containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by containers in pods must be destroyed
  (unmounted) by the containers on termination.
  -->
  `Bidirectional` 形式的掛載傳播可能比較危險。
  它可以破壞主機操作系統，因此它只被允許在特權容器中使用。
  強烈建議你熟悉 Linux 內核行爲。
  此外，由 Pod 中的容器創建的任何卷掛載必須在終止時由容器銷燬（卸載）。
  {{< /warning >}}

<!--
## Read-only mounts

A mount can be made read-only by setting the `.spec.containers[].volumeMounts[].readOnly`
field to `true`.
This does not make the volume itself read-only, but that specific container will
not be able to write to it.
Other containers in the Pod may mount the same volume as read-write.
-->
## 只讀掛載   {#read-only-mounts}

通過將 `.spec.containers[].volumeMounts[].readOnly` 字段設置爲 `true` 可以使掛載只讀。
這不會使卷本身只讀，但該容器將無法寫入此卷。
Pod 中的其他容器可以以讀寫方式掛載同一個卷。

<!--
On Linux, read-only mounts are not recursively read-only by default.
For example, consider a Pod which mounts the hosts `/mnt` as a `hostPath` volume. If
there is another filesystem mounted read-write on `/mnt/<SUBMOUNT>` (such as tmpfs,
NFS, or USB storage), the volume mounted into the container(s) will also have a writeable
`/mnt/<SUBMOUNT>`, even if the mount itself was specified as read-only.
-->
在 Linux 上，只讀掛載預設不會以遞歸方式只讀。
假如有一個 Pod 將主機的 `/mnt` 掛載爲 `hostPath` 卷。
如果在 `/mnt/<SUBMOUNT>` 上有另一個以讀寫方式掛載的檔案系統（如 tmpfs、NFS 或 USB 儲存），
即使掛載本身被指定爲只讀，掛載到容器中的卷 `/mnt/<SUBMOUNT>` 也是可寫的。

<!--
### Recursive read-only mounts
-->
### 遞歸只讀掛載    {#recursive-read-only-mounts}

{{< feature-state feature_gate_name="RecursiveReadOnlyMounts" >}}

<!--
Recursive read-only mounts can be enabled by setting the
`RecursiveReadOnlyMounts` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for kubelet and kube-apiserver, and setting the `.spec.containers[].volumeMounts[].recursiveReadOnly`
field for a pod.
-->
通過爲 kubelet 和 kube-apiserver 設置 `RecursiveReadOnlyMounts`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
併爲 Pod 設置 `.spec.containers[].volumeMounts[].recursiveReadOnly` 字段，
遞歸只讀掛載可以被啓用。

<!--
The allowed values are:

* `Disabled` (default): no effect.
-->
允許的值爲：

* `Disabled`（預設）：無效果。

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
* `Enabled`：使掛載遞歸只讀。需要滿足以下所有要求：

  * `readOnly` 設置爲 `true`
  * `mountPropagation` 不設置，或設置爲 `None`
  * 主機運行 Linux 內核 v5.12 或更高版本
  * [CRI 級別](/zh-cn/docs/concepts/architecture/cri)的容器運行時支持遞歸只讀掛載
  * OCI 級別的容器運行時支持遞歸只讀掛載

  如果其中任何一個不滿足，遞歸只讀掛載將會失敗。

<!--
* `IfPossible`: attempts to apply `Enabled`, and falls back to `Disabled`
  if the feature is not supported by the kernel or the runtime class.

Example:
-->
* `IfPossible`：嘗試應用 `Enabled`，如果內核或運行時類不支持該特性，則回退爲 `Disabled`。

示例：

{{% code_sample file="storage/rro.yaml" %}}

<!--
When this property is recognized by kubelet and kube-apiserver,
the `.status.containerStatuses[].volumeMounts[].recursiveReadOnly` field is set to either
`Enabled` or `Disabled`.

#### Implementations {#implementations-rro}
-->
當此屬性被 kubelet 和 kube-apiserver 識別到時，
`.status.containerStatuses[].volumeMounts[].recursiveReadOnly` 字段將被設置爲 `Enabled` 或 `Disabled`。

#### 實現   {#implementations-rro}

{{% thirdparty-content %}}

<!--
The following container runtimes are known to support recursive read-only mounts.

CRI-level:

- [containerd](https://containerd.io/), since v2.0
- [CRI-O](https://cri-o.io/), since v1.30

OCI-level:

- [runc](https://runc.io/), since v1.1
- [crun](https://github.com/containers/crun), since v1.8.6
-->
以下容器運行時已知支持遞歸只讀掛載。

CRI 級別：

- [containerd](https://containerd.io/)，自 v2.0 起
- [CRI-O](https://cri-o.io/)，自 v1.30 起

OCI 級別：

- [runc](https://runc.io/)，自 v1.1 起
- [crun](https://github.com/containers/crun)，自 v1.8.6 起

## {{% heading "whatsnext" %}}

<!--
Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
-->
參考[使用持久卷部署 WordPress 和 MySQL](/zh-cn/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/) 示例。
