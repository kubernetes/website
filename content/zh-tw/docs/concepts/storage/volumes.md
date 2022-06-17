---
title: 卷
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
Familiarity with [Pods](/docs/concepts/workloads/pods/) is suggested.
-->
Container 中的檔案在磁碟上是臨時存放的，這給 Container 中執行的較重要的應用程式帶來一些問題。
問題之一是當容器崩潰時檔案丟失。
kubelet 會重新啟動容器，但容器會以乾淨的狀態重啟。
第二個問題會在同一 `Pod` 中執行多個容器並共享檔案時出現。
Kubernetes {{< glossary_tooltip text="卷（Volume）" term_id="volume" >}}
這一抽象概念能夠解決這兩個問題。

閱讀本文前建議你熟悉一下 [Pod](/zh-cn/docs/concepts/workloads/pods)。 

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

Docker 也有 [卷（Volume）](https://docs.docker.com/storage/) 的概念，但對它只有少量且鬆散的管理。
Docker 卷是磁碟上或者另外一個容器內的一個目錄。
Docker 提供卷驅動程式，但是其功能非常有限。

<!--
Kubernetes supports many types of volumes. A {{< glossary_tooltip term_id="pod" text="Pod" >}}
can use any number of volume types simultaneously.
Ephemeral volume types have a lifetime of a pod, but persistent volumes exist beyond
the lifetime of a pod. When a pod ceases to exist, Kubernetes destroys ephemeral volumes;
however, Kubernetes does not destroy persistent volumes.
For any kind of volume in a given pod, data is preserved across container restarts.
-->
Kubernetes 支援很多型別的卷。
{{< glossary_tooltip term_id="pod" text="Pod" >}} 可以同時使用任意數目的卷型別。
臨時卷型別的生命週期與 Pod 相同，但持久卷可以比 Pod 的存活期長。
當 Pod 不再存在時，Kubernetes 也會銷燬臨時卷；不過 Kubernetes 不會銷燬持久卷。
對於給定 Pod 中任何型別的卷，在容器重啟期間資料都不會丟失。

<!--
At its core, a volume is just a directory, possibly with some data in it, which
is accessible to the containers in a pod. How that directory comes to be, the
medium that backs it, and the contents of it are determined by the particular
volume type used.
-->
卷的核心是一個目錄，其中可能存有資料，Pod 中的容器可以訪問該目錄中的資料。
所採用的特定的卷型別將決定該目錄如何形成的、使用何種介質儲存資料以及目錄中存放的內容。

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
使用卷時, 在 `.spec.volumes` 欄位中設定為 Pod 提供的卷，並在
`.spec.containers[*].volumeMounts` 欄位中宣告卷在容器中的掛載位置。
容器中的程序看到的檔案系統檢視是由它們的 {{< glossary_tooltip text="容器映象" term_id="image" >}}
的初始內容以及掛載在容器中的卷（如果定義了的話）所組成的。
其中根檔案系統同容器映象的內容相吻合。
任何在該檔案系統下的寫入操作，如果被允許的話，都會影響接下來容器中程序訪問檔案系統時所看到的內容。

<!--
Volumes mount at the [specified paths](#using-subpath) within
the image.
For each container defined within a Pod, you must independently specify where
to mount each volume that the container uses.

Volumes cannot mount within other volumes (but see [Using subPath](#using-subpath)
for a related mechanism). Also, a volume cannot contain a hard link to anything in
a different volume.
-->
卷掛載在映象中的[指定路徑](#using-subpath)下。
Pod 配置中的每個容器必須獨立指定各個卷的掛載位置。

卷不能掛載到其他卷之上（不過存在一種[使用 subPath](#using-subpath) 的相關機制），也不能與其他卷有硬連結。

<!--
## Types of Volumes

Kubernetes supports several types of Volumes:
-->
## 卷型別  {#volume-types}

Kubernetes 支援下列型別的卷：

<!--
### awsElasticBlockStore (deprecated) {#awselasticblockstore}

{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

An `awsElasticBlockStore` volume mounts an Amazon Web Services (AWS)
[EBS Volume](http://aws.amazon.com/ebs/) into your Pod.  Unlike
`emptyDir`, which is erased when a Pod is removed, the contents of an EBS
volume are persisted and the volume is unmounted. This means that an
EBS volume can be pre-populated with data, and that data can be shared between pods.
-->
### awsElasticBlockStore （已棄用）   {#awselasticblockstore}

{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

`awsElasticBlockStore` 卷將 Amazon Web服務（AWS）[EBS 卷](https://aws.amazon.com/ebs/)
掛載到你的 Pod 中。與 `emptyDir` 在 Pod 被刪除時也被刪除不同，EBS 卷的內容在刪除 Pod
時會被保留，卷只是被解除安裝掉了。
這意味著 EBS 卷可以預先填充資料，並且該資料可以在 Pod 之間共享。

<!--
You must create an EBS volume using `aws ec2 create-volume` or the AWS API before you can use it.
-->
{{< note >}}
你在使用 EBS 卷之前必須使用 `aws ec2 create-volume` 命令或者 AWS API 建立該卷。
{{< /note >}}

<!--
There are some restrictions when using an `awsElasticBlockStore` volume:

* the nodes on which Pods are running must be AWS EC2 instances
* those instances need to be in the same region and availability-zone as the EBS volume
* EBS only supports a single EC2 instance mounting a volume
-->
使用 `awsElasticBlockStore` 卷時有一些限制：

* Pod 執行所在的節點必須是 AWS EC2 例項。
* 這些例項需要與 EBS 卷在相同的地域（Region）和可用區（Availability-Zone）。
* EBS 卷只支援被掛載到單個 EC2 例項上。

<!--
#### Creating an EBS volume

Before you can use an EBS volume with a Pod, you need to create it.
-->
#### 建立 EBS 卷

在將 EBS 卷用到 Pod 上之前，你首先要建立它。

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

<!--
Make sure the zone matches the zone you brought up your cluster in. Check that the size and
EBS volume type are suitable for your use.
-->
確保該區域與你的群集所在的區域相匹配。還要檢查卷的大小和 EBS 卷型別都適合你的用途。

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
    # 此 AWS EBS 卷必須已經存在
    awsElasticBlockStore:
      volumeID: "<volume-id>"
      fsType: ext4
```

<!--
If the EBS volume is partitioned, you can supply the optional field `partition: "<partition number>"` to specify which parition to mount on.
-->
如果 EBS 卷是分割槽的，你可以提供可選的欄位 `partition: "<partition number>"` 來指定要掛載到哪個分割槽上。

<!--
#### AWS EBS CSI migration
-->
#### AWS EBS CSI 卷遷移

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The `CSIMigration` feature for `awsElasticBlockStore`, when enabled, redirects
all plugin operations from the existing in-tree plugin to the `ebs.csi.aws.com` Container
Storage Interface (CSI) driver. In order to use this feature, the [AWS EBS CSI
driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAWS`
beta features must be enabled.
-->
如果啟用了對 `awsElasticBlockStore` 的 `CSIMigration`
特性支援，所有外掛操作都不再指向樹內外掛（In-Tree Plugin），轉而指向
`ebs.csi.aws.com` 容器儲存介面（Container Storage Interface，CSI）驅動。
為了使用此特性，必須在叢集中安裝
[AWS EBS CSI 驅動](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)，
並確保 `CSIMigration` 和 `CSIMigrationAWS` Beta 功能特性被啟用。

<!--
#### AWS EBS CSI migration complete
-->
#### AWS EBS CSI 遷移結束

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

<!--
To disable the `awsElasticBlockStore` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAWSUnregister` flag to `true`.
-->
要禁止控制器管理器和 kubelet 載入 `awsElasticBlockStore` 儲存外掛，
請將 `InTreePluginAWSUnregister` 標誌設定為 `true`。

<!--
### azureDisk (deprecated) {#azuredisk}

{{< feature-state for_k8s_version="v1.19" state="deprecated" >}}

The `azureDisk` volume type mounts a Microsoft Azure [Data Disk](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers) into a pod.

For more details, see the [`azureDisk` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md).
-->
### azureDisk （已棄用）   {#azuredisk}

{{< feature-state for_k8s_version="v1.19" state="deprecated" >}}

`azureDisk` 卷型別用來在 Pod 上掛載 Microsoft Azure
[資料盤（Data Disk）](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) 。
若需瞭解更多詳情，請參考 [`azureDisk` 卷外掛](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md)。

<!--
#### azureDisk CSI Migration
-->
#### azureDisk 的 CSI 遷移  {#azuredisk-csi-migration}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
The `CSIMigration` feature for `azureDisk`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `disk.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the
[Azure Disk CSI Driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
must be installed on the cluster and the `CSIMigration` feature must be enabled.
-->

啟用 `azureDisk` 的 `CSIMigration` 特性後，所有外掛操作從現有的樹內外掛重定向到
`disk.csi.azure.com` 容器儲存介面（CSI）驅動程式。
為了使用此特性，必須在叢集中安裝
[Azure 磁碟 CSI 驅動程式](https://github.com/kubernetes-sigs/azuredisk-csi-driver)，
並且 `CSIMigration` 特性必須被啟用。

<!--
#### azureDisk CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `azureDisk` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAzureDiskUnregister` flag to `true`.
-->
#### azureDisk CSI 遷移完成

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

要禁止控制器管理器和 kubelet 載入 `azureDisk` 儲存外掛，
請將 `InTreePluginAzureDiskUnregister` 標誌設定為 `true`。

<!--
### azureFile (deprecated) {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

The `azureFile` volume type mounts a Microsoft Azure File volume (SMB 2.1 and 3.0)
into a Pod.

For more details, see the [`azureFile` volume plugin](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).
-->
### azureFile （已棄用）    {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

`azureFile` 卷型別用來在 Pod 上掛載 Microsoft Azure 檔案卷（File Volume）（SMB 2.1 和 3.0）。
更多詳情請參考 [`azureFile` 卷外掛](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md)。

<!--
#### azureFile CSI migration
-->
#### azureFile CSI 遷移  {#azurefile-csi-migration}

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

<!--
The CSI Migration feature for azureFile, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `file.csi.azure.com` Container
Storage Interface (CSI) Driver. In order to use this feature, the [Azure File CSI
Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationAzureFile`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.
-->
啟用 `azureFile` 的 `CSIMigration` 特性後，所有外掛操作將從現有的樹內外掛重定向到
`file.csi.azure.com` 容器儲存介面（CSI）驅動程式。要使用此特性，必須在叢集中安裝
[Azure 檔案 CSI 驅動程式](https://github.com/kubernetes-sigs/azurefile-csi-driver)，
並且 `CSIMigration` 和 `CSIMigrationAzureFile`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
必須被啟用。

<!--
Azure File CSI driver does not support using same volume with different fsgroups. If
`CSIMigrationAzureFile` is enabled, using same volume with different fsgroups won't be supported at all.
-->
Azure 檔案 CSI 驅動尚不支援為同一卷設定不同的 fsgroup。
如果 `CSIMigrationAzureFile` 特性被啟用，用不同的 fsgroup 來使用同一卷也是不被支援的。

<!--
#### azureDisk CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `azureDisk` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginAzureDiskUnregister` flag to `true`.
-->
#### azureDisk CSI 遷移完成

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

要禁止控制器管理器和 kubelet 載入 `azureDisk` 儲存外掛，
請將 `InTreePluginAzureDiskUnregister` 標誌設定為 `true`。

### cephfs {#cephfs}

<!--
A `cephfs` volume allows an existing CephFS volume to be
mounted into your Pod. Unlike `emptyDir`, which is erased when a Pod is
removed, the contents of a `cephfs` volume are preserved and the volume is merely
unmounted. This means that a `cephfs` volume can be pre-populated with data, and
that data can be shared between Pods.  The `cephfs` can be mounted by multiple
writers simultaneously.
-->
`cephfs` 卷允許你將現存的 CephFS 卷掛載到 Pod 中。
不像 `emptyDir` 那樣會在 Pod 被刪除的同時也會被刪除，`cephfs`
卷的內容在 Pod 被刪除時會被保留，只是卷被解除安裝了。
這意味著 `cephfs` 卷可以被預先填充資料，且這些資料可以在
Pod 之間共享。同一 `cephfs` 卷可同時被多個寫者掛載。

<!--
You must have your own Ceph server running with the share exported before you can use it.
-->
{{< note >}}
在使用 Ceph 卷之前，你的 Ceph 伺服器必須已經執行並將要使用的 share 匯出（exported）。
{{< /note >}}

<!--
See the [CephFS example](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/) for more details.
-->
更多資訊請參考 [CephFS 示例](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/)。

<!--
### cinder (deprecated) {#cinder}
-->
### cinder （已棄用）   {#cinder}

{{< feature-state for_k8s_version="v1.18" state="deprecated" >}}

{{< note >}}
<!--
Kubernetes must be configured with the OpenStack cloud provider.
-->
Kubernetes 必須配置了 OpenStack Cloud Provider。
{{< /note >}}

<!--
The `cinder` volume type is used to mount the OpenStack Cinder volume into your pod.
-->
`cinder` 卷型別用於將 OpenStack Cinder 卷掛載到 Pod 中。

<!--
#### Cinder Volume Example configuration
-->
#### Cinder 卷示例配置  {#cinder-volume-example-configuration}

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
    # 此 OpenStack 卷必須已經存在
    cinder:
      volumeID: "<volume-id>"
      fsType: ext4
```

<!--
#### OpenStack CSI Migration
-->
#### OpenStack CSI 遷移

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
The `CSIMigration` feature for Cinder is enabled by default since Kubernetes 1.21.
It redirects all plugin operations from the existing in-tree plugin to the
`cinder.csi.openstack.org` Container Storage Interface (CSI) Driver.
[OpenStack Cinder CSI Driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)
must be installed on the cluster.
-->
自 Kubernetes 1.21 版本起，Cinder 的 `CSIMigration` 特性是預設被啟用的。
此特性會將外掛的所有操作從現有的樹內外掛重定向到
`cinder.csi.openstack.org` 容器儲存介面（CSI）驅動程式。
為了使用此特性，必須在叢集中安裝
[OpenStack Cinder CSI 驅動程式](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md)，
你可以透過設定 `CSIMigrationOpenStack`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
為 `false` 來禁止 Cinder CSI 遷移。

<!--
To disable the in-tree Cinder plugin from being loaded by the controller manager
and the kubelet, you can enable the `InTreePluginOpenStackUnregister`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
要禁止控制器管理器和 kubelet 載入樹內 Cinder 外掛，你可以啟用
`InTreePluginOpenStackUnregister` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

### configMap

<!--
A [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
provides a way to inject configuration data into Pods.
The data stored in a ConfigMap object can be referenced in a volume of type
`configMap` and then consumed by containerized applications running in a Pod.
-->
[`configMap`](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
卷提供了向 Pod 注入配置資料的方法。
ConfigMap 物件中儲存的資料可以被 `configMap` 型別的卷引用，然後被 Pod 中執行的容器化應用使用。

<!--
When referencing a ConfigMap, you provide the name of the ConfigMap in the
volume. You can customize the path to use for a specific
entry in the ConfigMap. The following configuration shows how to mount
the `log-config` ConfigMap onto a Pod called `configmap-pod`:
-->
引用 configMap 物件時，你可以在 volume 中透過它的名稱來引用。
你可以自定義 ConfigMap 中特定條目所要使用的路徑。
下面的配置顯示瞭如何將名為 `log-config` 的 ConfigMap 掛載到名為 `configmap-pod`
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
`log-config` ConfigMap 以卷的形式掛載，並且儲存在 `log_level`
條目中的所有內容都被掛載到 Pod 的 `/etc/config/log_level` 路徑下。
請注意，這個路徑來源於卷的 `mountPath` 和 `log_level` 鍵對應的 `path`。

<!--
* You must create a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
  before you can use it.

* A container using a ConfigMap as a [`subPath`](#using-subpath) volume mount will not
  receive ConfigMap updates.

* Text data is exposed as files using the UTF-8 character encoding. For other character encodings, use `binaryData`.
-->
{{< note >}}
* 在使用 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 之前你首先要建立它。
* 容器以 [subPath](#using-subpath) 卷掛載方式使用 ConfigMap 時，將無法接收 ConfigMap 的更新。
* 文字資料掛載成檔案時採用 UTF-8 字元編碼。如果使用其他字元編碼形式，可使用
  `binaryData` 欄位。
{{< /note >}}

### downwardAPI

<!--
A `downwardAPI` volume is used to make downward API data available to applications.
It mounts a directory and writes the requested data in plain text files.
-->
`downwardAPI` 卷用於使 downward API 資料對應用程式可用。
這種卷型別掛載一個目錄並在純文字檔案中寫入所請求的資料。

<!--
A Container using Downward API as a [subPath](#using-subpath) volume mount will not
receive Downward API updates.
-->
{{< note >}}
容器以 [subPath](#using-subpath) 卷掛載方式使用 downwardAPI 時，將不能接收到它的更新。
{{< /note >}}

<!--
See the [`downwardAPI` volume example](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)  for more details.
-->
更多詳細資訊請參考 [`downwardAPI` 卷示例](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)。

### emptyDir

<!--
An `emptyDir` volume is first created when a Pod is assigned to a Node, and
exists as long as that Pod is running on that node.  As the name says, it is
initially empty.  Containers in the Pod can all read and write the same
files in the `emptyDir` volume, though that volume can be mounted at the same
or different paths in each Container.  When a Pod is removed from a node for
any reason, the data in the `emptyDir` is deleted forever.
-->
當 Pod 分派到某個 Node 上時，`emptyDir` 卷會被建立，並且在 Pod 在該節點上執行期間，卷一直存在。
就像其名稱表示的那樣，卷最初是空的。
儘管 Pod 中的容器掛載 `emptyDir` 卷的路徑可能相同也可能不同，這些容器都可以讀寫
`emptyDir` 卷中相同的檔案。
當 Pod 因為某些原因被從節點上刪除時，`emptyDir` 卷中的資料也會被永久刪除。

<!--
A Container crashing does *NOT* remove a Pod from a node, so the data in an `emptyDir` volume is safe across Container crashes.
-->
{{< note >}}
容器崩潰並**不**會導致 Pod 被從節點上移除，因此容器崩潰期間 `emptyDir` 卷中的資料是安全的。
{{< /note >}}

<!--
Some uses for an `emptyDir` are:

* scratch space, such as for a disk-based merge sort
* checkpointing a long computation for recovery from crashes
* holding files that a content-manager Container fetches while a webserver
  Container serves the data
-->
`emptyDir` 的一些用途：

* 快取空間，例如基於磁碟的歸併排序。
* 為耗時較長的計算任務提供檢查點，以便任務能方便地從崩潰前狀態恢復執行。
* 在 Web 伺服器容器服務資料時，儲存內容管理器容器獲取的檔案。

<!--
Depending on your environment, `emptyDir` volumes are stored on whatever medium that backs the
node such as disk or SSD, or network storage. However, if you set the `emptyDir.medium` field
to `"Memory"`, Kubernetes mounts a tmpfs (RAM-backed filesystem) for you instead.
While tmpfs is very fast, be aware that unlike disks, tmpfs is cleared on
node reboot and any files you write will count against your Container's
memory limit.
-->
取決於你的環境，`emptyDir` 卷儲存在該節點所使用的介質上；這里的介質可以是磁碟或 SSD
或網路儲存。但是，你可以將 `emptyDir.medium` 欄位設定為 `"Memory"`，以告訴 Kubernetes
為你掛載 tmpfs（基於 RAM 的檔案系統）。
雖然 tmpfs 速度非常快，但是要注意它與磁碟不同。
tmpfs 在節點重啟時會被清除，並且你所寫入的所有檔案都會計入容器的記憶體消耗，受容器記憶體限制約束。

<!--
{{< note >}}
If the `SizeMemoryBackedVolumes` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled,
you can specify a size for memory backed volumes.  If no size is specified, memory
backed volumes are sized to 50% of the memory on a Linux host.
{{< /note>}}
-->

{{< note >}}
當啟用 `SizeMemoryBackedVolumes` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
時，你可以為基於記憶體提供的卷指定大小。
如果未指定大小，則基於記憶體的卷的大小為 Linux 主機上記憶體的 50％。
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
### fc (光纖通道) {#fc}

`fc` 卷型別允許將現有的光纖通道塊儲存卷掛載到 Pod 中。
可以使用卷配置中的引數 `targetWWNs` 來指定單個或多個目標 WWN（World Wide Names）。
如果指定了多個 WWN，targetWWNs 期望這些 WWN 來自多路徑連線。

<!--
You must configure FC SAN Zoning to allocate and mask those LUNs (volumes) to the target WWNs beforehand so that Kubernetes hosts can access them.
-->
{{< note >}}
你必須配置 FC SAN Zoning，以便預先向目標 WWN 分配和遮蔽這些 LUN（卷），這樣
Kubernetes 主機才可以訪問它們。
{{< /note >}}

<!--
See the [fibre channel example](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel) for more details.
-->
更多詳情請參考 [FC 示例](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel)。

<!--
### flocker (deprecated) {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) is an open-source, clustered
Container data volume manager. Flocker provides management
and orchestration of data volumes backed by a variety of storage backends.
-->

### flocker （已棄用） {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) 是一個開源的、叢集化的容器資料卷管理器。
Flocker 提供了由各種儲存後端所支援的資料卷的管理和編排。

<!--
A `flocker` volume allows a Flocker dataset to be mounted into a Pod. If the
dataset does not already exist in Flocker, it needs to be first created with the Flocker
CLI or by using the Flocker API. If the dataset already exists it will be
reattached by Flocker to the node that the Pod is scheduled. This means data
can be shared between Pods as required.
-->
使用 `flocker` 卷可以將一個 Flocker 資料集掛載到 Pod 中。
如果資料集在 Flocker 中不存在，則需要首先使用 Flocker CLI 或 Flocker API 建立資料集。
如果資料集已經存在，那麼 Flocker 將把它重新附加到 Pod 被排程的節點。
這意味著資料可以根據需要在 Pod 之間共享。

<!--
You must have your own Flocker installation running before you can use it.
-->
{{< note >}}
在使用 Flocker 之前你必須先安裝運行自己的 Flocker。
{{< /note >}}

<!--
See the [Flocker example](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker) for more details.
-->
更多詳情請參考 [Flocker 示例](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker)。

<!--
### gcePersistentDisk

A `gcePersistentDisk` volume mounts a Google Compute Engine (GCE)
[Persistent Disk](http://cloud.google.com/compute/docs/disks) into your Pod.
Unlike `emptyDir`, which is erased when a Pod is removed, the contents of a PD are
preserved and the volume is merely unmounted.  This means that a PD can be
pre-populated with data, and that data can be shared between pods.
-->
### gcePersistentDisk {#gcepersistentdisk}

`gcePersistentDisk` 卷能將谷歌計算引擎 (GCE) [持久盤（PD）](http://cloud.google.com/compute/docs/disks) 
掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在 Pod 被刪除的同時也會被刪除，持久盤卷的內容在刪除 Pod
時會被保留，卷只是被解除安裝了。
這意味著持久盤卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

<!--
You must create a PD using `gcloud` or the GCE API or UI before you can use it.
-->
{{< caution >}}
在使用 PD 前，你必須使用 `gcloud` 或者 GCE API 或 UI 建立它。
{{< /caution >}}

<!--
There are some restrictions when using a `gcePersistentDisk`:

* the nodes on which Pods are running must be GCE VMs
* those VMs need to be in the same GCE project and zone as the PD
-->
使用 `gcePersistentDisk` 時有一些限制：

* 執行 Pod 的節點必須是 GCE VM
* 這些 VM 必須和持久盤位於相同的 GCE 專案和區域（zone）

<!--
One feature of GCE persistent disk is concurrent read-only access to a persistent disk.
A `gcePersistentDisk` volume permits multiple consumers to simultaneously
mount a persistent disk as read-only. This means that you can pre-populate a PD with your dataset
and then serve it in parallel from as many Pods as you need. Unfortunately,
PDs can only be mounted by a single consumer in read-write mode. Simultaneous
writers are not allowed.
-->
GCE PD 的一個特點是它們可以同時被多個消費者以只讀方式掛載。
這意味著你可以用資料集預先填充 PD，然後根據需要並行地在儘可能多的 Pod 中提供該資料集。
不幸的是，PD 只能由單個使用者以讀寫模式掛載 —— 即不允許同時寫入。

<!--
Using a GCE persistent disk with a Pod controlled by a ReplicaSet will fail unless
the PD is read-only or the replica count is 0 or 1.
-->
在由 ReplicationController 所管理的 Pod 上使用 GCE PD 將會失敗，除非 PD
是隻讀模式或者副本的數量是 0 或 1。

<!--
#### Creating a GCE persistent disk {#gce-create-persistent-disk}

Before you can use a GCE PD with a Pod, you need to create it.
-->
#### 建立 GCE 持久盤（PD）   {#gce-create-persistent-disk}

在 Pod 中使用 GCE 持久盤之前，你首先要建立它。

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

<!--
#### Example Pod
-->
#### GCE 持久盤配置示例 {#gce-pd-configuration-example}

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
    # 此 GCE PD 必須已經存在
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```
<!--
#### Regional Persistent Disks
-->
#### 區域持久盤   {#regional-persistent-disks}

<!--
The [Regional Persistent Disks](https://cloud.google.com/compute/docs/disks/#repds)
feature allows the creation of Persistent Disks that are available in two zones
within the same region. In order to use this feature, the volume must be provisioned
as a PersistentVolume; referencing the volume directly from a Pod is not supported.
-->
[區域持久盤](https://cloud.google.com/compute/docs/disks/#repds)
特性允許你建立能在同一區域的兩個可用區中使用的持久盤。
要使用這個特性，必須以持久卷（PersistentVolume）的方式提供卷；直接從
Pod 引用這種卷是不可以的。

<!--
#### Manually provisioning a Regional PD PersistentVolume

Dynamic provisioning is possible using a [StorageClass for GCE PD](/docs/concepts/storage/storage-classes/#gce).
Before creating a PersistentVolume, you must create the PD:
-->
#### 手動供應基於區域 PD 的 PersistentVolume {#manually-provisioning-regional-pd-pv}

使用[為 GCE PD 定義的儲存類](/zh-cn/docs/concepts/storage/storage-classes/#gce)
可以實現動態供應。在建立 PersistentVolume 之前，你首先要建立 PD。

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
        # failure-domain.beta.kubernetes.io/zone 應在 1.21 之前使用
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-central1-a
          - us-central1-b
```

<!--
#### GCE CSI Migration
-->
#### GCE CSI 遷移  {#gce-csi-migration}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The CSI Migration feature for GCE PD, when enabled, shims all plugin operations
from the existing in-tree plugin to the `pd.csi.storage.gke.io` Container
Storage Interface (CSI) Driver. In order to use this feature, the [GCE PD CSI
Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationGCE`
beta features must be enabled.
-->
啟用 GCE PD 的 `CSIMigration` 特性後，所有外掛操作將從現有的樹內外掛重定向到
`pd.csi.storage.gke.io` 容器儲存介面（ CSI ）驅動程式。
為了使用此特性，必須在叢集中上安裝
[GCE PD CSI驅動程式](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)，
並且 `CSIMigration` 和 `CSIMigrationGCE` Beta 特性必須被啟用。

<!-- 
#### GCE CSI migration complete

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

To disable the `gcePersistentDisk` storage plugin from being loaded by the controller manager
and the kubelet, set the `InTreePluginGCEUnregister` flag to `true`.
-->
#### GCE CSI 遷移完成

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

要禁止控制器管理器和 kubelet 載入 `gcePersistentDisk` 儲存外掛，請將
`InTreePluginGCEUnregister` 標誌設定為 `true`。

<!--
### gitRepo (deprecated) {#gitrepo}
-->

### gitRepo (已棄用)    {#gitrepo}

<!--
The gitRepo volume type is deprecated. To provision a container with a git repo, mount an [EmptyDir](#emptydir) into an InitContainer that clones the repo using git, then mount the [EmptyDir](#emptydir) into the Pod's container.
-->
{{< warning >}}
`gitRepo` 卷型別已經被廢棄。如果需要在容器中提供 git 倉庫，請將一個
[EmptyDir](#emptydir) 卷掛載到 InitContainer 中，使用 git
命令完成倉庫的克隆操作，然後將 [EmptyDir](#emptydir) 卷掛載到 Pod 的容器中。
{{< /warning >}}

<!--
A `gitRepo` volume is an example of a volume plugin. This plugin
mounts an empty directory and clones a git repository into this directory
for your Pod to use.

Here is an example of a `gitRepo` volume:
-->
`gitRepo` 卷是一個卷外掛的例子。
該查卷掛載一個空目錄，並將一個 Git 程式碼倉庫克隆到這個目錄中供 Pod 使用。

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
`glusterfs` 卷能將 [Glusterfs](https://www.gluster.org) (一個開源的網路檔案系統) 
掛載到你的 Pod 中。不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`glusterfs`
卷的內容在刪除 Pod 時會被儲存，卷只是被解除安裝。
這意味著 `glusterfs` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。
GlusterFS 可以被多個寫者同時掛載。

<!--
You must have your own GlusterFS installation running before you can use it.
-->
{{< note >}}
在使用前你必須先安裝運行自己的 GlusterFS。
{{< /note >}}

<!--
See the [GlusterFS example](https://github.com/kubernetes/examples/tree/master/volumes/glusterfs) for more details.
-->
更多詳情請參考 [GlusterFS 示例](https://github.com/kubernetes/examples/tree/master/volumes/glusterfs)。

### hostPath

{{< warning >}}
<!-- 
HostPath volumes present many security risks, and it is a best practice to avoid the use of
HostPaths when possible. When a HostPath volume must be used, it should be scoped to only the
required file or directory, and mounted as ReadOnly.

If restricting HostPath access to specific directories through AdmissionPolicy, `volumeMounts` MUST
be required to use `readOnly` mounts for the policy to be effective.
-->
HostPath 卷存在許多安全風險，最佳做法是儘可能避免使用 HostPath。
當必須使用 HostPath 卷時，它的範圍應僅限於所需的檔案或目錄，並以只讀方式掛載。

如果透過 AdmissionPolicy 限制 HostPath 對特定目錄的訪問，則必須要求
`volumeMounts` 使用 `readOnly` 掛載以使策略生效。
{{< /warning >}}

<!--
A `hostPath` volume mounts a file or directory from the host node's filesystem
into your Pod. This is not something that most Pods will need, but it offers a
powerful escape hatch for some applications.
-->
`hostPath` 卷能將主機節點檔案系統上的檔案或目錄掛載到你的 Pod 中。
雖然這不是大多數 Pod 需要的，但是它為一些應用程式提供了強大的逃生艙。

<!--
For example, some uses for a `hostPath` are:

* running a Container that needs access to Docker internals; use a `hostPath`
  of `/var/lib/docker`
* running cAdvisor in a Container; use a `hostPath` of `/sys`
* allowing a Pod to specify whether a given `hostPath` should exist prior to the
  Pod running, whether it should be created, and what it should exist as
-->
例如，`hostPath` 的一些用法有：

* 執行一個需要訪問 Docker 內部機制的容器；可使用 `hostPath` 掛載 `/var/lib/docker` 路徑。
* 在容器中執行 cAdvisor 時，以 `hostPath` 方式掛載 `/sys`。
* 允許 Pod 指定給定的 `hostPath` 在執行 Pod 之前是否應該存在，是否應該建立以及應該以什麼方式存在。

<!--
In addition to the required `path` property, user can optionally specify a `type` for a `hostPath` volume.

The supported values for field `type` are:
-->
除了必需的 `path` 屬性之外，使用者可以選擇性地為 `hostPath` 卷指定 `type`。

支援的 `type` 值如下：

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
| 取值  | 行為     |
|:------|:---------|
| | 空字串（預設）用於向後相容，這意味著在安裝 hostPath 卷之前不會執行任何檢查。 |
| `DirectoryOrCreate` | 如果在給定路徑上什麼都不存在，那麼將根據需要建立空目錄，許可權設定為 0755，具有與 kubelet 相同的組和屬主資訊。 |
| `Directory` | 在給定路徑上必須存在的目錄。|
| `FileOrCreate` | 如果在給定路徑上什麼都不存在，那麼將在那裡根據需要建立空檔案，許可權設定為 0644，具有與 kubelet 相同的組和所有權。|
| `File` | 在給定路徑上必須存在的檔案。|
| `Socket` | 在給定路徑上必須存在的 UNIX 套接字。|
| `CharDevice` | 在給定路徑上必須存在的字元裝置。|
| `BlockDevice` | 在給定路徑上必須存在的塊裝置。|

<!--
Watch out when using this type of volume, because:

* HostPaths can expose privileged system credentials (such as for the Kubelet) or privileged APIs
  (such as container runtime socket), which can be used for container escape or to attack other
  parts of the cluster.
* Pods with identical configuration (such as created from a PodTemplate) may
  behave differently on different nodes due to different files on the nodes
* The files or directories created on the underlying hosts are only writable by root. You
  either need to run your process as root in a
  [privileged Container](/docs/tasks/configure-pod-container/security-context/) or modify the file
  permissions on the host to be able to write to a `hostPath` volume
-->
當使用這種型別的卷時要小心，因為：

* HostPath 卷可能會暴露特權系統憑據（例如 Kubelet）或特權
  API（例如容器執行時套接字），可用於容器逃逸或攻擊叢集的其他部分。
* 具有相同配置（例如基於同一 PodTemplate 建立）的多個 Pod
  會由於節點上檔案的不同而在不同節點上有不同的行為。
* 下層主機上建立的檔案或目錄只能由 root 使用者寫入。你需要在
  [特權容器](/zh-cn/docs/tasks/configure-pod-container/security-context/)
  中以 root 身份執行程序，或者修改主機上的檔案許可權以便容器能夠寫入 `hostPath` 卷。

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
      # 宿主上目錄位置
      path: /data
      # 此欄位為可選
      type: Directory
```

<!--
The `FileOrCreate` mode does not create the parent directory of the file. If the parent directory
of the mounted file does not exist, the pod fails to start. To ensure that this mode works,
you can try to mount directories and files separately, as shown in the
[`FileOrCreate`configuration](#hostpath-fileorcreate-example).
-->
{{< caution >}}
`FileOrCreate` 模式不會負責建立檔案的父目錄。
如果欲掛載的檔案的父目錄不存在，Pod 啟動會失敗。
為了確保這種模式能夠工作，可以嘗試把檔案和它對應的目錄分開掛載，如
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
      # 確保檔案所在目錄成功建立。
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
`iscsi` 卷能將 iSCSI (基於 IP 的 SCSI) 卷掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`iscsi`
卷的內容在刪除 Pod 時會被保留，卷只是被解除安裝。
這意味著 `iscsi` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

<!--
You must have your own iSCSI server running with the volume created before you can use it.
-->
{{< caution >}}
在使用 iSCSI 卷之前，你必須擁有自己的 iSCSI 伺服器，並在上面建立卷。
{{< /caution >}}

<!--
A feature of iSCSI is that it can be mounted as read-only by multiple consumers
simultaneously.  This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many Pods as you need.  Unfortunately,
iSCSI volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.
-->
iSCSI 的一個特點是它可以同時被多個使用者以只讀方式掛載。
這意味著你可以用資料集預先填充卷，然後根據需要在儘可能多的 Pod 上使用它。
不幸的是，iSCSI 卷只能由單個使用者以讀寫模式掛載。不允許同時寫入。

<!--
See the [iSCSI example](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) for more details.
-->
更多詳情請參考 [iSCSI 示例](https://github.com/kubernetes/examples/tree/master/volumes/iscsi)。

<!--
### local

A `local` volume represents a mounted local storage device such as a disk,
partition or directory.

Local volumes can only be used as a statically created PersistentVolume. Dynamic
provisioning is not supported yet.
-->
### local

`local` 卷所代表的是某個被掛載的本地儲存裝置，例如磁碟、分割槽或者目錄。

`local` 卷只能用作靜態建立的持久卷。尚不支援動態配置。

<!--
Compared to `hostPath` volumes, `local` volumes are used in a durable and
portable manner without manually scheduling Pods to nodes. The system is aware
of the volume's node constraints by looking at the node affinity on the PersistentVolume.
-->
與 `hostPath` 卷相比，`local` 卷能夠以持久和可移植的方式使用，而無需手動將 Pod
排程到節點。系統透過檢視 PersistentVolume 的節點親和性配置，就能瞭解卷的節點約束。

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
然而，`local` 卷仍然取決於底層節點的可用性，並不適合所有應用程式。
如果節點變得不健康，那麼 `local` 卷也將變得不可被 Pod 訪問。使用它的 Pod 將不能執行。
使用 `local` 卷的應用程式必須能夠容忍這種可用性的降低，以及因底層磁碟的耐用性特徵而帶來的潛在的資料丟失風險。

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
使用 `local` 卷時，你需要設定 PersistentVolume 物件的 `nodeAffinity` 欄位。
Kubernetes 排程器使用 PersistentVolume 的 `nodeAffinity` 資訊來將使用 `local`
卷的 Pod 排程到正確的節點。

<!--
PersistentVolume `volumeMode` can be set to "Block" (instead of the default
value "Filesystem") to expose the local volume as a raw block device.
-->
PersistentVolume 物件的 `volumeMode` 欄位可被設定為 "Block"
（而不是預設值 "Filesystem"），以將 `local` 卷作為原始塊裝置暴露出來。

<!--
When using local volumes, it is recommended to create a StorageClass with
`volumeBindingMode` set to `WaitForFirstConsumer`. For more details, see the
local [StorageClass](/docs/concepts/storage/storage-classes/#local) example.
Delaying volume binding ensures that the PersistentVolumeClaim binding decision
will also be evaluated with any other node constraints the Pod may have,
such as node resource requirements, node selectors, Pod affinity, and Pod anti-affinity.
-->
使用 `local` 卷時，建議建立一個 StorageClass 並將其 `volumeBindingMode` 設定為
`WaitForFirstConsumer`。要了解更多詳細資訊，請參考
[local StorageClass 示例](/zh-cn/docs/concepts/storage/storage-classes/#local)。
延遲卷繫結的操作可以確保 Kubernetes 在為 PersistentVolumeClaim 作出繫結決策時，會評估
Pod 可能具有的其他節點約束，例如：如節點資源需求、節點選擇器、Pod親和性和 Pod 反親和性。

<!--
An external static provisioner can be run separately for improved management of
the local volume lifecycle. Note that this provisioner does not support dynamic
provisioning yet. For an example on how to run an external local provisioner,
see the [local volume provisioner user
guide](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).
-->
你可以在 Kubernetes 之外單獨運行靜態驅動以改進對 local 卷的生命週期管理。
請注意，此驅動尚不支援動態配置。
有關如何執行外部 `local` 卷驅動，請參考
[local 卷驅動使用者指南](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)。

<!--
The local PersistentVolume requires manual cleanup and deletion by the
user if the external static provisioner is not used to manage the volume
lifecycle.
-->
{{< note >}}
如果不使用外部靜態驅動來管理卷的生命週期，使用者需要手動清理和刪除 local 型別的持久卷。
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
`nfs` 卷能將 NFS (網路檔案系統) 掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`nfs` 卷的內容在刪除 Pod
時會被儲存，卷只是被解除安裝。
這意味著 `nfs` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

<!--
You must have your own NFS server running with the share exported before you can use it.
-->
{{< caution >}}
在使用 NFS 卷之前，你必須運行自己的 NFS 服務器並將目標 share 匯出備用。
{{< /caution >}}

<!--
See the [NFS example](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs) for more details.
-->
要了解更多詳情請參考 [NFS 示例](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs)。

### persistentVolumeClaim {#persistentvolumeclaim}

<!--
A `persistentVolumeClaim` volume is used to mount a
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) into a Pod.  PersistentVolumeClaims
are a way for users to "claim" durable storage (such as a GCE PersistentDisk or an
iSCSI volume) without knowing the details of the particular cloud environment.
-->
`persistentVolumeClaim` 卷用來將[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)（PersistentVolume）掛載到 Pod 中。
持久卷申領（PersistentVolumeClaim）是使用者在不知道特定雲環境細節的情況下“申領”持久儲存（例如
GCE PersistentDisk 或者 iSCSI 卷）的一種方法。

<!--
See the [PersistentVolumes example](/docs/concepts/storage/persistent-volumes/) for more
details.
-->
更多詳情請參考[持久卷示例](/zh-cn/docs/concepts/storage/persistent-volumes/)。

### portworxVolume {#portworxvolume}

<!--
A `portworxVolume` is an elastic block storage layer that runs hyperconverged with
Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) fingerprints storage in a server, tiers based on capabilities,
and aggregates capacity across multiple servers. Portworx runs in-guest in virtual machines or on bare metal Linux nodes.
-->
`portworxVolume` 是一個可伸縮的塊儲存層，能夠以超融合（hyperconverged）的方式與 Kubernetes 一起運行。
[Portworx](https://portworx.com/use-case/kubernetes-storage/)
支援對服務器上儲存的指紋處理、基於儲存能力進行分層以及跨多個服務器整合儲存容量。
Portworx 可以以 in-guest 方式在虛擬機器中運行，也可以在裸金屬 Linux 節點上運行。

<!--
A `portworxVolume` can be dynamically created through Kubernetes or it can also
be pre-provisioned and referenced inside a Kubernetes Pod.
Here is an example Pod referencing a pre-provisioned PortworxVolume:
-->
`portworxVolume` 型別的卷可以透過 Kubernetes 動態建立，也可以預先配備並在
Kubernetes Pod 內引用。
下面是一個引用預先配備的 PortworxVolume 的示例 Pod：

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
在 Pod 中使用 portworxVolume 之前，你要確保有一個名為 `pxvol` 的 PortworxVolume 存在。
{{< /note >}}

<!--
For more details, see the [Portworx volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md) examples.
-->

更多詳情可以參考 [Portworx 卷](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md)。

### projected （投射）

<!--
A projected volume maps several existing volume sources into the same
directory. For more details, see [projected volumes](/docs/concepts/storage/projected-volumes/).
-->
投射卷能將若干現有的捲來源對映到同一目錄上。更多詳情請參考[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)。

### quobyte (已棄用) {#quobyte}

<!--
A `quobyte` volume allows an existing [Quobyte](http://www.quobyte.com) volume to
be mounted into your Pod.
-->
`quobyte` 卷允許將現有的 [Quobyte](https://www.quobyte.com) 卷掛載到你的 Pod 中。

<!--
You must have your own Quobyte setup running with the volumes
created before you can use it.
-->
{{< note >}}
在使用 Quobyte 卷之前，你首先要進行安裝 Quobyte 並建立好卷。
{{< /note >}}

<!--
Quobyte supports the {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI is the recommended plugin to use Quobyte volumes inside Kubernetes. Quobyte's
GitHub project has [instructions](https://github.com/quobyte/quobyte-csi#quobyte-csi) for deploying Quobyte using CSI, along with examples.
-->
Quobyte 支援{{< glossary_tooltip text="容器儲存介面（CSI）" term_id="csi" >}}。
推薦使用 CSI 外掛以在 Kubernetes 中使用 Quobyte 卷。
Quobyte 的 GitHub 專案包含以 CSI 形式部署 Quobyte 的
[說明](https://github.com/quobyte/quobyte-csi#quobyte-csi)
及使用示例。

### rbd

<!--
An `rbd` volume allows a
[Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) volume to mount
into your Pod. Unlike `emptyDir`, which is erased when a pod is removed, the
contents of an `rbd` volume are preserved and the volume is unmounted. This
means that a RBD volume can be pre-populated with data, and that data can be
shared between pods.
-->
`rbd` 卷允許將 [Rados 塊裝置](https://docs.ceph.com/en/latest/rbd/)卷掛載到你的 Pod 中。
不像 `emptyDir` 那樣會在刪除 Pod 的同時也會被刪除，`rbd` 卷的內容在刪除 Pod 時會被儲存，卷只是被解除安裝。
這意味著 `rbd` 卷可以被預先填充資料，並且這些資料可以在 Pod 之間共享。

<!--
You must have a Ceph installation running before you can use RBD.
-->
{{< note >}}
在使用 RBD 之前，你必須安裝執行 Ceph。
{{< /note >}}

<!--
A feature of RBD is that it can be mounted as read-only by multiple consumers
simultaneously. This means that you can pre-populate a volume with your dataset
and then serve it in parallel from as many pods as you need. Unfortunately,
RBD volumes can only be mounted by a single consumer in read-write mode.
Simultaneous writers are not allowed.

See the [RBD example](https://github.com/kubernetes/examples/tree/master/volumes/rbd)
for more details.
-->
RBD 的一個特性是它可以同時被多個使用者以只讀方式掛載。
這意味著你可以用資料集預先填充卷，然後根據需要在儘可能多的 Pod 中並行地使用卷。
不幸的是，RBD 卷只能由單個使用者以讀寫模式安裝。不允許同時寫入。

更多詳情請參考
[RBD 示例](https://github.com/kubernetes/examples/tree/master/volumes/rbd)。

<!--
#### RBD CSI migration
-->
#### RBD CSI 遷移 {#rbd-csi-migration}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

<!--
The `CSIMigration` feature for `RBD`, when enabled, redirects all plugin
operations from the existing in-tree plugin to the `rbd.csi.ceph.com` {{<
glossary_tooltip text="CSI" term_id="csi" >}} driver. In order to use this
feature, the
[Ceph CSI driver](https://github.com/ceph/ceph-csi)
must be installed on the cluster and the `CSIMigration` and `csiMigrationRBD`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled.
-->
啟用 RBD 的 `CSIMigration` 特性後，所有外掛操作從現有的樹內外掛重定向到
`rbd.csi.ceph.com` {{<glossary_tooltip text="CSI" term_id="csi" >}} 驅動程式。
要使用該特性，必須在叢集內安裝
[Ceph CSI 驅動](https://github.com/ceph/ceph-csi)，並啟用 `CSIMigration` 和 `csiMigrationRBD` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
As a Kubernetes cluster operator that administers storage, here are the
prerequisites that you must complete before you attempt migration to the
RBD CSI driver:

* You must install the Ceph CSI driver (`rbd.csi.ceph.com`), v3.5.0 or above,
  into your Kubernetes cluster.
* considering the `clusterID` field is a required parameter for CSI driver for
  its operations, but in-tree StorageClass has `monitors` field as a required
  parameter, a Kubernetes storage admin has to create a clusterID based on the
  monitors hash ( ex:`#echo -n
  '<monitors_string>' | md5sum`) in the CSI config map and keep the monitors
  under this clusterID configuration.
* Also, if the value of `adminId` in the in-tree Storageclass is different from
 `admin`, the `adminSecretName` mentioned in the in-tree Storageclass has to be
  patched with the base64 value of the `adminId` parameter value, otherwise this
  step can be skipped.
-->
{{< note >}}
作為一位管理儲存的 Kubernetes 叢集操作者，在嘗試遷移到 RBD CSI 驅動前，你必須完成下列先決事項：

* 你必須在叢集中安裝 v3.5.0 或更高版本的 Ceph CSI 驅動（`rbd.csi.ceph.com`）。
* 因為 `clusterID` 是 CSI 驅動程式必需的引數，而樹記憶體儲類又將 `monitors`
  作為一個必需的引數，所以 Kubernetes 儲存管理者需要根據 `monitors`
  的雜湊值（例：`#echo -n '<monitors_string>' | md5sum`）來建立
  `clusterID`，並保持該 `monitors` 存在於該 `clusterID` 的配置中。
* 同時，如果樹記憶體儲類的 `adminId` 的值不是 `admin`，那麼其 `adminSecretName`
  就需要被修改成 `adminId` 引數的 base64 編碼值。
{{< /note >}}

### secret

<!--
A `secret` volume is used to pass sensitive information, such as passwords, to
Pods.  You can store secrets in the Kubernetes API and mount them as files for
use by Pods without coupling to Kubernetes directly.  `secret` volumes are
backed by tmpfs (a RAM-backed filesystem) so they are never written to
non-volatile storage.
-->
`secret` 卷用來給 Pod 傳遞敏感資訊，例如密碼。你可以將 Secret 儲存在 Kubernetes
API 伺服器上，然後以檔案的形式掛載到 Pod 中，無需直接與 Kubernetes 耦合。
`secret` 卷由 tmpfs（基於 RAM 的檔案系統）提供儲存，因此它們永遠不會被寫入非易失性（持久化的）儲存器。

<!--
You must create a secret in the Kubernetes API before you can use it.
-->
{{< note >}}
使用前你必須在 Kubernetes API 中建立 secret。
{{< /note >}}

<!--
A Container using a Secret as a [subPath](#using-subpath) volume mount will not
receive Secret updates.
-->
{{< note >}}
容器以 [subPath](#using-subpath) 卷掛載方式掛載 Secret 時，將感知不到 Secret 的更新。
{{< /note >}}

<!--
For more details, see [Configuring Secrets](/docs/concepts/configuration/secret/).
-->
更多詳情請參考[配置 Secrets](/zh-cn/docs/concepts/configuration/secret/)。

### storageOS (已棄用) {#storageos}

<!--
A `storageos` volume allows an existing [StorageOS](https://www.storageos.com)
volume to be mounted into your Pod.
-->
`storageos` 卷允許將現有的 [StorageOS](https://www.storageos.com) 卷掛載到你的 Pod 中。

<!--
StorageOS runs as a Container within your Kubernetes environment, making local
or attached storage accessible from any node within the Kubernetes cluster.
Data can be replicated to protect against node failure. Thin provisioning and
compression can improve utilization and reduce cost.
-->
StorageOS 在 Kubernetes 環境中以容器的形式運行，這使得應用能夠從 Kubernetes
叢集中的任何節點訪問本地的或掛接的儲存。為應對節點失效狀況，可以複製資料。
若需提高利用率和降低成本，可以考慮瘦配置（Thin Provisioning）和資料壓縮。

<!--
At its core, StorageOS provides block storage to Containers, accessible via a file system.

The StorageOS Container requires 64-bit Linux and has no additional dependencies.
A free developer license is available.
-->
作為其核心能力之一，StorageOS 為容器提供了可以透過檔案系統訪問的塊儲存。

StorageOS 容器需要 64 位的 Linux，並且沒有其他的依賴關係。
StorageOS 提供免費的開發者授權許可。

<!--
You must run the StorageOS Container on each node that wants to
access StorageOS volumes or that will contribute storage capacity to the pool.
For installation instructions, consult the
[StorageOS documentation](https://docs.storageos.com).
-->
{{< caution >}}
你必須在每個希望訪問 StorageOS 卷的或者將向儲存資源池貢獻儲存容量的節點上運行
StorageOS 容器。有關安裝說明，請參閱 [StorageOS 文件](https://docs.storageos.com)。
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
        # `redis-vol01` 卷必須在 StorageOS 中存在，並位於 `default` 名字空間內
        volumeName: redis-vol01
        fsType: ext4
```

<!--
For more information about StorageOS, dynamic provisioning, and PersistentVolumeClaims, see the
[StorageOS examples](https://github.com/kubernetes/examples/blob/master/volumes/storageos).
-->

關於 StorageOS 的進一步資訊、動態供應和持久卷申領等等，請參考
[StorageOS 示例](https://github.com/kubernetes/examples/blob/master/volumes/storageos)。

### vsphereVolume（棄用） {#vspherevolume}

<!--
We recommend to use vSphere CSI out-of-tree driver instead.
-->
{{< note >}}
建議你改用 vSphere CSI 樹外驅動程式。
{{< /note >}}

<!--
A `vsphereVolume` is used to mount a vSphere VMDK Volume into your Pod.  The contents
of a volume are preserved when it is unmounted. It supports both VMFS and VSAN datastore.
-->
`vsphereVolume` 用來將 vSphere VMDK 卷掛載到你的 Pod 中。
在解除安裝卷時，卷的內容會被保留。
vSphereVolume 卷型別支援 VMFS 和 VSAN 資料倉庫。

<!--
For more information, see the [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) examples.
-->
進一步資訊可參考
[vSphere 卷](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)。

<!--
#### vSphere CSI migration {#vsphere-csi-migration}
-->
#### vSphere CSI 遷移  {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
The `CSIMigration` feature for `vsphereVolume`, when enabled, redirects all plugin operations
from the existing in-tree plugin to the `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver. In order to use this feature, the
[vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)
must be installed on the cluster and the `CSIMigration` and `CSIMigrationvSphere`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled.
-->
當 `vsphereVolume` 的 `CSIMigration` 特性被啟用時，所有外掛操作都被從樹內外掛重定向到
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。
為了使用此功能特性，必須在叢集中安裝
[vSphere CSI 驅動](https://github.com/kubernetes-sigs/vsphere-csi-driver)，並啟用
`CSIMigration` 和 `CSIMigrationvSphere`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
You can find additional advice on how to migrate in VMware's
documentation page [Migrating In-Tree vSphere Volumes to vSphere Container Storage Plug-in](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html).
-->
你可以在 VMware 的文件頁面
[遷移樹內 vSphere 卷外掛到 vSphere 容器儲存外掛](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html)
中找到有關如何遷移的其他建議。
<!--
Kubernetes v{{< skew currentVersion >}} requires that you are using vSphere 7.0u2 or later
in order to migrate to the out-of-tree CSI driver.
If you are running a version of Kubernetes other than v{{< skew currentVersion >}}, consult
the documentation for that version of Kubernetes.
If you are running Kubernetes v{{< skew currentVersion >}} and an older version of vSphere,
consider upgrading to at least vSphere 7.0u2.
-->
為了遷移到樹外 CSI 驅動程式，Kubernetes v{{< skew currentVersion >}}
要求你使用 vSphere 7.0u2 或更高版本。
如果你正在執行 v{{< skew currentVersion >}} 以外的 Kubernetes 版本，
請查閱該 Kubernetes 版本的文件。
如果你正在執行 Kubernetes v{{< skew currentVersion >}} 和舊版本的 vSphere，
請考慮至少升級到 vSphere 7.0u2。

{{< note >}}
<!--
The following StorageClass parameters from the built-in `vsphereVolume` plugin are not supported by the vSphere CSI driver:
-->
vSphere CSI 驅動不支援內建 `vsphereVolume` 的以下 StorageClass 引數：

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
使用這些引數建立的現有卷將被遷移到 vSphere CSI 驅動，不過使用 vSphere
CSI 驅動所建立的新卷都不會理會這些引數。

{{< /note >}}

<!--
#### vSphere CSI migration complete {#vsphere-csi-migration-complete}
-->
#### vSphere CSI 遷移完成   {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
To turn off the `vsphereVolume` plugin from being loaded by the controller manager and the kubelet, you need to set `InTreePluginvSphereUnregister` feature flag to `true`. You must install a `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} driver on all worker nodes.
-->
為了避免控制器管理器和 kubelet 載入 `vsphereVolume` 外掛，你需要將
`InTreePluginvSphereUnregister` 特性設定為 `true`。你還必須在所有工作節點上安裝
`csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動。

<!--
#### Portworx CSI migration
-->
#### Portworx CSI 遷移

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

<!--
The `CSIMigration` feature for Portworx has been added but disabled by default in Kubernetes 1.23 since it's in alpha state.
It redirects all plugin operations from the existing in-tree plugin to the
`pxd.portworx.com` Container Storage Interface (CSI) Driver.
[Portworx CSI Driver](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/csi/)
must be installed on the cluster.
To enable the feature, set `CSIMigrationPortworx=true` in kube-controller-manager and kubelet.
-->
Kubernetes 1.23 中加入了 Portworx 的 `CSIMigration` 特性，但預設不會啟用，因為該特性仍處於 alpha 階段。
該特性會將所有的外掛操作從現有的樹內外掛重定向到
`pxd.portworx.com` 容器儲存介面（Container Storage Interface, CSI）驅動程式。
叢集中必須安裝
[Portworx CSI 驅動](https://docs.portworx.com/portworx-install-with-kubernetes/storage-operations/csi/)。
要啟用此特性，請在 kube-controller-manager 和 kubelet 中設定 `CSIMigrationPortworx=true`。

<!--
## Using subPath {#using-subpath}

Sometimes, it is useful to share one volume for multiple uses in a single Pod.
The `volumeMounts.subPath` property specifies a sub-path inside the referenced volume
instead of its root.
-->
## 使用 subPath  {#using-subpath}

有時，在單個 Pod 中共享卷以供多方使用是很有用的。
`volumeMounts.subPath` 屬性可用於指定所引用的卷內的子路徑，而不是其根路徑。

<!--
The following example shows how to configure a Pod with a LAMP stack (Linux Apache MySQL PHP)
using a single, shared volume. This sample `subPath` configuration is not recommended
for production use.

The PHP application's code and assets map to the volume's `html` folder and
the MySQL database is stored in the volume's `mysql` folder. For example:
-->
下面例子展示瞭如何配置某包含 LAMP 堆疊（Linux Apache MySQL PHP）的 Pod 使用同一共享卷。
此示例中的 `subPath` 配置不建議在生產環境中使用。
PHP 應用的程式碼和相關資料對映到卷的 `html` 資料夾，MySQL 資料庫儲存在卷的 `mysql` 資料夾中：

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

### 使用帶有擴充套件環境變數的 subPath  {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
Use the `subPathExpr` field to construct `subPath` directory names from
Downward API environment variables.
The `subPath` and `subPathExpr` properties are mutually exclusive.
-->
使用 `subPathExpr` 欄位可以基於 Downward API 環境變數來構造 `subPath` 目錄名。
`subPath` 和 `subPathExpr` 屬性是互斥的。

<!--
In this example, a Pod uses `subPathExpr` to create a directory `pod1` within
the hostPath volume `/var/log/pods`.
The `hostPath` volume takes the `Pod` name from the `downwardAPI`.
The host directory `/var/log/pods/pod1` is mounted at `/logs` in the container.
-->
在這個示例中，Pod 使用 `subPathExpr` 來 hostPath 卷 `/var/log/pods` 中建立目錄 `pod1`。
`hostPath` 卷採用來自 `downwardAPI` 的 Pod 名稱生成目錄名。
宿主目錄 `/var/log/pods/pod1` 被掛載到容器的 `/logs` 中。

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
      # 包裹變數名的是小括號，而不是大括號
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
## 資源   {#resources}

`emptyDir` 卷的儲存介質（磁碟、SSD 等）是由儲存 kubelet
資料的根目錄（通常是 `/var/lib/kubelet`）的檔案系統的介質確定。
Kubernetes 對 `emptyDir` 卷或者 `hostPath` 卷可以消耗的空間沒有限制，容器之間或 Pod 之間也沒有隔離。

<!--
To learn about requesting space using a resource specification, see
[how to manage resources](/docs/concepts/configuration/manage-resources-containers/).
-->
要了解如何使用資源規約來請求空間，可參考
[如何管理資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。


<!--
## Out-of-Tree Volume Plugins

The out-of-tree volume plugins include
{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI), and also FlexVolume (which is deprecated). These plugins enable storage vendors to create custom storage plugins
without adding their plugin source code to the Kubernetes repository.
-->
## 樹外（Out-of-Tree）卷外掛    {#out-of-tree-volume-plugins}

Out-of-Tree 卷外掛包括
{{< glossary_tooltip text="容器儲存介面（CSI）" term_id="csi" >}}
和 FlexVolume（已棄用）。
它們使儲存供應商能夠建立自定義儲存外掛，而無需將外掛原始碼新增到 Kubernetes 程式碼倉庫。

<!--
Previously, all volume plugins were "in-tree". The "in-tree" plugins were built, linked, compiled,
and shipped with the core Kubernetes binaries. This meant that adding a new storage system to
Kubernetes (a volume plugin) required checking code into the core Kubernetes code repository.
-->
以前，所有卷外掛（如上面列出的卷型別）都是“樹內（In-Tree）”的。
“樹內”外掛是與 Kubernetes 的核心元件一同構建、連結、編譯和交付的。
這意味著向 Kubernetes 新增新的儲存系統（卷外掛）需要將程式碼合併到 Kubernetes 核心程式碼庫中。

<!--
Both CSI and FlexVolume allow volume plugins to be developed independent of
the Kubernetes code base, and deployed (installed) on Kubernetes clusters as
extensions.

For storage vendors looking to create an out-of-tree volume plugin, please refer
to [this FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
CSI 和 FlexVolume 都允許獨立於 Kubernetes 程式碼庫開發卷外掛，並作為擴充套件部署（安裝）在 Kubernetes 叢集上。

對於希望建立樹外（Out-Of-Tree）卷外掛的儲存供應商，請參考
[卷外掛常見問題](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)。

### CSI

<!--
[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) defines a standard interface for container orchestration systems (like
Kubernetes) to expose arbitrary storage systems to their container workloads.
-->
[容器儲存介面](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
為容器編排系統（如 Kubernetes）定義標準介面，以將任意儲存系統暴露給它們的容器工作負載。

<!--
Please read the [CSI design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) for more information.

CSI support was introduced as alpha in Kubernetes v1.9, moved to beta in
Kubernetes v1.10, and is GA in Kubernetes v1.13.
-->
更多詳情請閱讀 [CSI 設計方案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)。

<!--
Support for CSI spec versions 0.2 and 0.3 are deprecated in Kubernetes
v1.13 and will be removed in a future release.
-->
{{< note >}}
Kubernetes v1.13 廢棄了對 CSI 規範版本 0.2 和 0.3 的支援，並將在以後的版本中刪除。
{{< /note >}}

<!--
CSI drivers may not be compatible across all Kubernetes releases.
Please check the specific CSI driver's documentation for supported
deployments steps for each Kubernetes release and a compatibility matrix.
-->
{{< note >}}
CSI 驅動可能並非相容所有的 Kubernetes 版本。
請檢視特定 CSI 驅動的文件，以瞭解各個 Kubernetes 版本所支援的部署步驟以及相容性列表。
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
一旦在 Kubernetes 叢集上部署了 CSI 相容卷驅動程式，使用者就可以使用
`csi` 卷型別來掛接、掛載 CSI 驅動所提供的卷。

`csi` 卷可以在 Pod 中以三種方式使用：

* 透過 PersistentVolumeClaim(#persistentvolumeclaim) 物件引用
* 使用[一般性的臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volume)
  （Alpha 特性）
* 使用 [CSI 臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)，
  前提是驅動支援這種用法（Beta 特性）

<!--
The following fields are available to storage administrators to configure a CSI
persistent volume:
-->
儲存管理員可以使用以下欄位來配置 CSI 持久卷：

<!--
- `driver`: A string value that specifies the name of the volume driver to use.
  This value must correspond to the value returned in the `GetPluginInfoResponse`
  by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  It is used by Kubernetes to identify which CSI driver to call out to, and by
  CSI driver components to identify which PV objects belong to the CSI driver.
-->
- `driver`：指定要使用的卷驅動名稱的字串值。
  這個值必須與 CSI 驅動程式在 `GetPluginInfoResponse` 中返回的值相對應；該介面定義在
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo)中。
  Kubernetes 使用所給的值來標識要呼叫的 CSI 驅動程式；CSI
  驅動程式也使用該值來辨識哪些 PV 物件屬於該 CSI 驅動程式。

<!--
- `volumeHandle`: A string value that uniquely identifies the volume. This value
  must correspond to the value returned in the `volume.id` field of the
  `CreateVolumeResponse` by the CSI driver as defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The value is passed as `volume_id` on all calls to the CSI volume driver when
  referencing the volume.
-->
- `volumeHandle`：唯一標識卷的字串值。
  該值必須與 CSI 驅動在 `CreateVolumeResponse` 的 `volume_id` 欄位中返回的值相對應；介面定義在
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 中。
  在所有對 CSI 卷驅動程式的呼叫中，引用該 CSI 卷時都使用此值作為 `volume_id` 引數。

<!--
- `readOnly`: An optional boolean value indicating whether the volume is to be
  "ControllerPublished" (attached) as read only. Default is false. This value is
  passed to the CSI driver via the `readonly` field in the
  `ControllerPublishVolumeRequest`.
-->
- `readOnly`：一個可選的布林值，指示透過 `ControllerPublished` 關聯該卷時是否設定該卷為只讀。預設值是 false。
  該值透過 `ControllerPublishVolumeRequest` 中的 `readonly` 欄位傳遞給 CSI 驅動。

<!--
- `fsType`: If the PV's `VolumeMode` is `Filesystem` then this field may be used
  to specify the filesystem that should be used to mount the volume. If the
  volume has not been formatted and formatting is supported, this value will be
  used to format the volume.
  This value is passed to the CSI driver via the `VolumeCapability` field of
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
- `fsType`：如果 PV 的 `VolumeMode` 為 `Filesystem`，那麼此欄位指定掛載卷時應該使用的檔案系統。
  如果卷尚未格式化，並且支援格式化，此值將用於格式化卷。
  此值可以透過 `ControllerPublishVolumeRequest`、`NodeStageVolumeRequest` 和
  `NodePublishVolumeRequest` 的 `VolumeCapability` 欄位傳遞給 CSI 驅動。

<!--
- `volumeAttributes`: A map of string to string that specifies static properties
  of a volume. This map must correspond to the map returned in the
  `volume.attributes` field of the `CreateVolumeResponse` by the CSI driver as
  defined in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  The map is passed to the CSI driver via the `volume_attributes` field in the
  `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, and
  `NodePublishVolumeRequest`.
-->
- `volumeAttributes`：一個字元串到字元串的對映表，用來設定卷的靜態屬性。
  該對映必須與 CSI 驅動程式返回的 `CreateVolumeResponse` 中的 `volume.attributes`
  欄位的對映相對應；
  [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)
  中有相應的定義。
  該對映透過`ControllerPublishVolumeRequest`、`NodeStageVolumeRequest`、和
  `NodePublishVolumeRequest` 中的 `volume_attributes` 欄位傳遞給 CSI 驅動。

<!--
- `controllerPublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `ControllerPublishVolume` and `ControllerUnpublishVolume` calls. This field is
  optional, and may be empty if no secret is required. If the secret object
  contains more than one secret, all secrets are passed.
-->
- `controllerPublishSecretRef`：對包含敏感資訊的 Secret 物件的引用；
  該敏感資訊會被傳遞給 CSI 驅動來完成 CSI `ControllerPublishVolume` 和
  `ControllerUnpublishVolume` 呼叫。
  此欄位是可選的；在不需要 Secret 時可以是空的。
  如果 Secret 物件包含多個 Secret 條目，則所有的 Secret 條目都會被傳遞。

<!--
- `nodeStageSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodeStageVolume` call. This field is optional, and may be empty if no secret
  is required. If the secret object contains more than one secret, all secrets
  are passed.
-->
- `nodeStageSecretRef`：對包含敏感資訊的 Secret 物件的引用。
  該資訊會傳遞給 CSI 驅動來完成 CSI `NodeStageVolume` 呼叫。
  此欄位是可選的，如果不需要 Secret，則可能是空的。
  如果 Secret 物件包含多個 Secret 條目，則傳遞所有 Secret 條目。

<!--
- `nodePublishSecretRef`: A reference to the secret object containing
  sensitive information to pass to the CSI driver to complete the CSI
  `NodePublishVolume` call. This field is optional, and may be empty if no
  secret is required. If the secret object contains more than one secret, all
  secrets are passed.
-->
- `nodePublishSecretRef`：對包含敏感資訊的 Secret 物件的引用。
  該資訊傳遞給 CSI 驅動來完成 CSI `NodePublishVolume` 呼叫。
  此欄位是可選的，如果不需要 Secret，則可能是空的。
  如果 Secret 物件包含多個 Secret 條目，則傳遞所有 Secret 條目。

<!--
#### CSI raw block volume support
-->

#### CSI 原始塊卷支援    {#csi-raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Vendors with external CSI drivers to implement raw block volumes support
in Kubernetes workloads.
-->
具有外部 CSI 驅動程式的供應商能夠在 Kubernetes 工作負載中實現原始塊卷支援。

<!--
You can set up your
[PersistentVolume/PersistentVolumeClaim with raw block volume support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) as usual, without any CSI specific changes.
-->
你可以和以前一樣，安裝自己的
[帶有原始塊卷支援的 PV/PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)，
採用 CSI 對此過程沒有影響。

<!--
#### CSI ephemeral volumes
-->
#### CSI 臨時卷   {#csi-ephemeral-volumes}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
You can directly configure CSI volumes within the Pod
specification. Volumes specified in this way are ephemeral and do not
persist across pod restarts. See [Ephemeral
Volumes](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)
for more information.
-->
你可以直接在 Pod 規約中配置 CSI 卷。採用這種方式配置的卷都是臨時卷，
無法在 Pod 重新啟動後繼續存在。
進一步的資訊可參閱[臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volume)。

<!--
For more information on how to develop a CSI driver, refer to the
[kubernetes-csi documentation](https://kubernetes-csi.github.io/docs/)
-->
有關如何開發 CSI 驅動的更多資訊，請參考 [kubernetes-csi 文件](https://kubernetes-csi.github.io/docs/)。

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
CSI 節點外掛需要執行多種特權操作，例如掃描磁碟裝置和掛載檔案系統等。
這些操作在每個宿主作業系統上都是不同的。對於 Linux 工作節點而言，容器化的 CSI
節點外掛通常部署為特權容器。對於 Windows 工作節點而言，容器化 CSI
節點外掛的特權操作是透過 [csi-proxy](https://github.com/kubernetes-csi/csi-proxy)
來支援的。csi-proxy 是一個由社群管理的、獨立的可執行二進位制檔案，
需要被預安裝到每個 Windows 節點上。

要了解更多的細節，可以參考你要部署的 CSI 外掛的部署指南。

<!--
#### Migrating to CSI drivers from in-tree plugins
-->
#### 從樹內外掛遷移到 CSI 驅動程式  {#migrating-to-csi-drivers-from-in-tree-plugins}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
The CSI Migration feature, when enabled, directs operations against existing in-tree
plugins to corresponding CSI plugins (which are expected to be installed and configured).
As a result, operators do not have to make any
configuration changes to existing Storage Classes, PersistentVolumes or PersistentVolumeClaims
(referring to in-tree plugins) when transitioning to a CSI driver that supersedes an in-tree plugin.

The operations and features that are supported include:
provisioning/delete, attach/detach, mount/unmount and resizing of volumes.
-->
啟用 `CSIMigration` 特性後，針對現有樹內外掛的操作會被重定向到相應的 CSI 外掛（應已安裝和配置）。
因此，操作員在過渡到取代樹內外掛的 CSI 驅動時，無需對現有儲存類、PV 或 PVC（指樹內外掛）進行任何配置更改。

所支援的操作和特性包括：配備（Provisioning）/刪除、掛接（Attach）/解掛（Detach）、
掛載（Mount）/解除安裝（Unmount）和調整卷大小。

<!--
In-tree plugins that support `CSIMigration` and have a corresponding CSI driver implemented
are listed in [Types of Volumes](#volume-types).

The following in-tree plugins support persistent storage on Windows nodes:
-->
上面的[卷型別](#volume-types)節列出了支援 `CSIMigration` 並已實現相應 CSI
驅動程式的樹內外掛。

下面是支援 Windows 節點上永續性儲存的樹內外掛：

* [`awsElasticBlockStore`](#awselasticblockstore)
* [`azureDisk`](#azuredisk)
* [`azureFile`](#azurefile)
* [`gcePersistentDisk`](#gcepersistentdisk)
* [`vsphereVolume`](#vspherevolume)

### flexVolume

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

<!--
FlexVolume is an out-of-tree plugin interface that uses an exec-based model to interface
with storage drivers. The FlexVolume driver binaries must be installed in a pre-defined
volume plugin path on each node and in some cases the control plane nodes as well.

Pods interact with FlexVolume drivers through the `flexVolume` in-tree volume plugin.
For more details, see the FlexVolume [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) document.
-->
FlexVolume 是一個使用基於 exec 的模型來與驅動程式對接的樹外外掛介面。
使用者必須在每個節點上的預定義卷外掛路徑中安裝 FlexVolume
驅動程式可執行檔案，在某些情況下，控制平面節點中也要安裝。

Pod 透過 `flexvolume` 樹內外掛與 FlexVolume 驅動程式互動。
更多詳情請參考 FlexVolume [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) 文件。

<!--
The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:
-->
下面的 FlexVolume [外掛](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)
以 PowerShell 指令碼的形式部署在宿主系統上，支援 Windows 節點：

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

Mount propagation allows for sharing volumes mounted by a Container to
other Containers in the same Pod, or even to other Pods on the same node.

Mount propagation of a volume is controlled by `mountPropagation` field in Container.volumeMounts.
Its values are:
-->
## 掛載卷的傳播   {#mount-propagation}

掛載卷的傳播能力允許將容器安裝的卷共享到同一 Pod 中的其他容器，甚至共享到同一節點上的其他 Pod。

卷的掛載傳播特性由 `Container.volumeMounts` 中的 `mountPropagation` 欄位控制。
它的值包括：

<!--
 * `None` - This volume mount will not receive any subsequent mounts
   that are mounted to this volume or any of its subdirectories by the host.
   In similar fashion, no mounts created by the Container will be visible on
   the host. This is the default mode.

   This mode is equal to `private` mount propagation as described in the
   [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
-->

* `None` - 此卷掛載將不會感知到主機後續在此卷或其任何子目錄上執行的掛載變化。
   類似的，容器所建立的卷掛載在主機上是不可見的。這是預設模式。

   該模式等同於 [Linux 核心文件](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
   中描述的 `private` 掛載傳播選項。

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
* `HostToContainer` - 此卷掛載將會感知到主機後續針對此卷或其任何子目錄的掛載操作。

  換句話說，如果主機在此掛載卷中掛載任何內容，容器將能看到它被掛載在那裡。

  類似的，配置了 `Bidirectional` 掛載傳播選項的 Pod 如果在同一捲上掛載了內容，掛載傳播設定為
  `HostToContainer` 的容器都將能看到這一變化。

  該模式等同於 [Linux 核心文件](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
  中描述的 `rslave` 掛載傳播選項。

<!--
* `Bidirectional` - This volume mount behaves the same the `HostToContainer` mount.
   In addition, all volume mounts created by the Container will be propagated
   back to the host and to all Containers of all Pods that use the same volume.

   A typical use case for this mode is a Pod with a FlexVolume or CSI driver or
   a Pod that needs to mount something on the host using a `hostPath` volume.

   This mode is equal to `rshared` mount propagation as described in the
   [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
-->
* `Bidirectional` - 這種卷掛載和 `HostToContainer` 掛載表現相同。
  另外，容器建立的卷掛載將被傳播回至主機和使用同一卷的所有 Pod 的所有容器。

  該模式等同於 [Linux 核心文件](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
  中描述的 `rshared` 掛載傳播選項。

  <!--
  `Bidirectional` mount propagation can be dangerous. It can damage
  the host operating system and therefore it is allowed only in privileged
  Containers. Familiarity with Linux kernel behavior is strongly recommended.
  In addition, any volume mounts created by Containers in Pods must be destroyed
  (unmounted) by the Containers on termination.
  -->
  {{< warning >}}
  `Bidirectional` 形式的掛載傳播可能比較危險。
  它可以破壞主機作業系統，因此它只被允許在特權容器中使用。
  強烈建議你熟悉 Linux 核心行為。
  此外，由 Pod 中的容器建立的任何卷掛載必須在終止時由容器銷燬（解除安裝）。
  {{< /warning >}}

<!--
### Configuration

Before mount propagation can work properly on some deployments (CoreOS,
RedHat/Centos, Ubuntu) mount share must be configured correctly in
Docker as shown below.
-->
### 配置  {#configuration}

在某些部署環境中，掛載傳播正常工作前，必須在 Docker 中正確配置掛載共享（mount share），如下所示。

<!--
Edit your Docker's `systemd` service file.  Set `MountFlags` as follows:
-->
編輯你的 Docker `systemd` 服務檔案，按下面的方法設定 `MountFlags`：

```shell
MountFlags=shared
```

<!--
Or, remove `MountFlags=slave` if present. Then restart the Docker daemon:
-->
或者，如果存在 `MountFlags=slave` 就刪除掉。然後重啟 Docker 守護程序：

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}

<!--
Follow an example of [deploying WordPress and MySQL with Persistent Volumes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
-->
參考[使用持久卷部署 WordPress 和 MySQL](/zh-cn/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/) 示例。

