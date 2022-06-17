---
title: 投射卷
content_type: concept
weight: 21 # just after persistent volumes
---

<!--
reviewers:
- marosset
- jsturtevant
- zshihang
title: Projected Volumes
content_type: concept
weight: 21 # just after persistent volumes
-->

<!-- overview -->

<!--
This document describes _projected volumes_ in Kubernetes. Familiarity with [volumes](/docs/concepts/storage/volumes/) is suggested.
-->
本文件描述 Kubernetes 中的*投射卷（Projected Volumes）*。
建議先熟悉[卷](/zh-cn/docs/concepts/storage/volumes/)概念。

<!-- body -->

<!--
## Introduction

A `projected` volume maps several existing volume sources into the same directory.

Currently, the following types of volume sources can be projected:

* [`secret`](/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/docs/concepts/storage/volumes/#configmap)
* [`serviceAccountToken`](#serviceaccounttoken)
-->
## 介紹    {#introduction}

一個 `projected` 卷可以將若干現有的卷源對映到同一個目錄之上。

目前，以下型別的卷源可以被投射：

* [`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/zh-cn/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)
* [`serviceAccountToken`](#serviceaccounttoken)

<!--
All sources are required to be in the same namespace as the Pod. For more details,
see the [all-in-one volume](https://github.com/kubernetes/design-proposals-archive/blob/main/node/all-in-one-volume.md) design document.
-->
所有的卷源都要求處於 Pod 所在的同一個名字空間內。進一步的詳細資訊，可參考
[一體化卷](https://github.com/kubernetes/design-proposals-archive/blob/main/node/all-in-one-volume.md)設計文件。

<!--
### Example configuration with a secret, a downwardAPI, and a configMap {#example-configuration-secret-downwardapi-configmap}
-->
### 帶有 Secret、DownwardAPI 和 ConfigMap 的配置示例 {#example-configuration-secret-downwardapi-configmap}

{{< codenew file="pods/storage/projected-secret-downwardapi-configmap.yaml" >}}

<!--
### Example configuration: secrets with a non-default permission mode set {#example-configuration-secrets-nondefault-permission-mode}
-->
### 帶有非預設許可權模式設定的 Secret 的配置示例 {#example-configuration-secrets-nondefault-permission-mode}

{{< codenew file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" >}}

<!--
Each projected volume source is listed in the spec under `sources`. The
parameters are nearly the same with two exceptions:

* For secrets, the `secretName` field has been changed to `name` to be consistent
  with ConfigMap naming.
* The `defaultMode` can only be specified at the projected level and not for each
  volume source. However, as illustrated above, you can explicitly set the `mode`
  for each individual projection.
-->
每個被投射的卷源都列舉在規約中的 `sources` 下面。引數幾乎相同，只有兩個例外：

* 對於 Secret，`secretName` 欄位被改為 `name` 以便於 ConfigMap 的命名一致；
* `defaultMode` 只能在投射層級設定，不能在卷源層級設定。不過，正如上面所展示的，
  你可以顯式地為每個投射單獨設定 `mode` 屬性。 

<!--
## serviceAccountToken projected volumes {#serviceaccounttoken}
When the `TokenRequestProjection` feature is enabled, you can inject the token
for the current [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
into a Pod at a specified path. For example:
-->
## serviceAccountToken 投射卷 {#serviceaccounttoken}
當 `TokenRequestProjection` 特性被啟用時，你可以將當前
[服務賬號](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)
的令牌注入到 Pod 中特定路徑下。例如：

{{< codenew file="pods/storage/projected-service-account-token.yaml" >}}

<!--
The example Pod has a projected volume containing the injected service account
token. Containers in this Pod can use that token to access the Kubernetes API
server, authenticating with the identity of [the pod's ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/).
The `audience` field contains the intended audience of the
token. A recipient of the token must identify itself with an identifier specified
in the audience of the token, and otherwise should reject the token. This field
is optional and it defaults to the identifier of the API server.
-->
示例 Pod 中包含一個投射卷，其中包含注入的服務賬號令牌。
此 Pod 中的容器可以使用該令牌訪問 Kubernetes API 伺服器， 使用 
[pod 的 ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
進行身份驗證。`audience` 欄位包含令牌所針對的受眾。
收到令牌的主體必須使用令牌受眾中所指定的某個識別符號來標識自身，否則應該拒絕該令牌。
此欄位是可選的，預設值為 API 伺服器的標識。

<!--
The `expirationSeconds` is the expected duration of validity of the service account
token. It defaults to 1 hour and must be at least 10 minutes (600 seconds). An administrator
can also limit its maximum value by specifying the `--service-account-max-token-expiration`
option for the API server. The `path` field specifies a relative path to the mount point
of the projected volume.
-->
欄位 `expirationSeconds` 是服務賬號令牌預期的生命期長度。預設值為 1 小時，
必須至少為 10 分鐘（600 秒）。管理員也可以透過設定 API 伺服器的命令列引數
`--service-account-max-token-expiration` 來為其設定最大值上限。`path` 欄位給出
與投射卷掛載點之間的相對路徑。

{{< note >}}
<!--
A container using a projected volume source as a [`subPath`](/docs/concepts/storage/volumes/#using-subpath)
volume mount will not receive updates for those volume sources.
-->
以 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
形式使用投射卷源的容器無法收到對應卷源的更新。
{{< /note >}}

<!--
## SecurityContext interactions
-->
## 與 SecurityContext 間的關係    {#securitycontext-interactions}

<!--
The [proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2451-service-account-token-volumes#proposal) for file permission handling in projected service account volume enhancement introduced the projected files having the the correct owner permissions set.
-->
關於在投射的服務賬號卷中處理檔案訪問許可權的[提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2451-service-account-token-volumes#proposal)
介紹瞭如何使得所投射的檔案具有合適的屬主訪問許可權。

### Linux

<!--
In Linux pods that have a projected volume and `RunAsUser` set in the Pod
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context),
the projected files have the correct ownership set including container user
ownership.
-->
在包含了投射卷並在
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
中設定了 `RunAsUser` 屬性的 Linux Pod 中，投射檔案具有正確的屬主屬性設定，
其中包含了容器使用者屬主。

### Windows

<!--
In Windows pods that have a projected volume and `RunAsUsername` set in the
Pod `SecurityContext`, the ownership is not enforced due to the way user
accounts are managed in Windows. Windows stores and manages local user and group
accounts in a database file called Security Account Manager (SAM). Each
container maintains its own instance of the SAM database, to which the host has
no visibility into while the container is running. Windows containers are
designed to run the user mode portion of the OS in isolation from the host,
hence the maintenance of a virtual SAM database. As a result, the kubelet running
on the host does not have the ability to dynamically configure host file
ownership for virtualized container accounts. It is recommended that if files on
the host machine are to be shared with the container then they should be placed
into their own volume mount outside of `C:\`.
-->
在包含了投射卷並在 `SecurityContext` 中設定了 `RunAsUsername` 的 Windows Pod 中,
由於 Windows 中使用者賬號的管理方式問題，檔案的屬主無法正確設定。
Windows 在名為安全賬號管理器（Security Account Manager，SAM）
的資料庫中儲存本地使用者和組資訊。每個容器會維護其自身的 SAM 資料庫例項，
宿主系統無法窺視到容器執行期間資料庫內容。Windows 容器被設計用來執行作業系統的使用者態部分，
與宿主系統之間隔離，因此維護了一個虛擬的 SAM 資料庫。
所以，在宿主系統上執行的 kubelet 無法動態為虛擬的容器賬號配置宿主檔案的屬主。
如果需要將宿主機器上的檔案與容器共享，建議將它們放到掛載於 `C:\` 之外
的獨立卷中。

<!--
By default, the projected files will have the following ownership as shown for
an example projected volume file:
-->
預設情況下，所投射的檔案會具有如下例所示的屬主屬性設定：

```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```

<!--
This implies all administrator users like `ContainerAdministrator` will have
read, write and execute access while, non-administrator users will have read and
execute access.
-->
這意味著，所有類似 `ContainerAdministrator` 的管理員使用者都具有讀、寫和執行訪問許可權，
而非管理員使用者將具有讀和執行訪問許可權。

{{< note >}}
<!--
In general, granting the container access to the host is discouraged as it can
open the door for potential security exploits.

Creating a Windows Pod with `RunAsUser` in it's `SecurityContext` will result in
the Pod being stuck at `ContainerCreating` forever. So it is advised to not use
the Linux only `RunAsUser` option with Windows Pods.
-->
總體而言，為容器授予訪問宿主系統的許可權這種做法是不推薦的，因為這樣做可能會開啟潛在的安全性攻擊之門。

在建立 Windows Pod 時，如過在其 `SecurityContext` 中設定了 `RunAsUser`，
Pod 會一直阻塞在 `ContainerCreating` 狀態。因此，建議不要在 Windows
節點上使用僅針對 Linux 的 `RunAsUser` 選項。
{{< /note >}}

