---
title: 投射卷
content_type: concept
weight: 21 # 跟在持久卷之後
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
本文檔描述 Kubernetes 中的**投射卷（Projected Volumes）**。
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
* [`clusterTrustBundle`](#clustertrustbundle)
* [`podCertificate`](#podcertificate)
-->
## 介紹    {#introduction}

一個 `projected` 卷可以將若干現有的卷源映射到同一個目錄之上。

目前，以下類型的卷源可以被投射：

* [`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/zh-cn/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)
* [`serviceAccountToken`](#serviceaccounttoken)
* [`clusterTrustBundle`](#clustertrustbundle)
* [`podCertificate`](#podcertificate)

<!--
All sources are required to be in the same namespace as the Pod. For more details,
see the [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) design document.
-->
所有的卷源都要求處於 Pod 所在的同一個名字空間內。更多詳細信息，
可參考[一體化卷](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md)設計文檔。

<!--
### Example configuration with a secret, a downwardAPI, and a configMap {#example-configuration-secret-downwardapi-configmap}
-->
### 帶有 Secret、DownwardAPI 和 ConfigMap 的設定示例 {#example-configuration-secret-downwardapi-configmap}

{{% code_sample file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

<!--
### Example configuration: secrets with a non-default permission mode set {#example-configuration-secrets-nondefault-permission-mode}
-->
### 帶有非默認權限模式設置的 Secret 的設定示例 {#example-configuration-secrets-nondefault-permission-mode}

{{% code_sample file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" %}}

<!--
Each projected volume source is listed in the spec under `sources`. The
parameters are nearly the same with two exceptions:

* For secrets, the `secretName` field has been changed to `name` to be consistent
  with ConfigMap naming.
* The `defaultMode` can only be specified at the projected level and not for each
  volume source. However, as illustrated above, you can explicitly set the `mode`
  for each individual projection.
-->
每個被投射的卷源都列舉在規約中的 `sources` 下面。參數幾乎相同，只有兩個例外：

* 對於 Secret，`secretName` 字段被改爲 `name` 以便於 ConfigMap 的命名一致；
* `defaultMode` 只能在投射層級設置，不能在卷源層級設置。不過，正如上面所展示的，
  你可以顯式地爲每個投射單獨設置 `mode` 屬性。

<!--
## serviceAccountToken projected volumes {#serviceaccounttoken}
You can inject the token for the current [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
into a Pod at a specified path. For example:
-->
## serviceAccountToken 投射卷 {#serviceaccounttoken}

你可以將當前[服務賬號](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)的令牌注入到
Pod 中特定路徑下。例如：

{{% code_sample file="pods/storage/projected-service-account-token.yaml" %}}

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
[Pod 的 ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
進行身份驗證。`audience` 字段包含令牌所針對的受衆。
收到令牌的主體必須使用令牌受衆中所指定的某個標識符來標識自身，否則應該拒絕該令牌。
此字段是可選的，默認值爲 API 伺服器的標識。

<!--
The `expirationSeconds` is the expected duration of validity of the service account
token. It defaults to 1 hour and must be at least 10 minutes (600 seconds). An administrator
can also limit its maximum value by specifying the `--service-account-max-token-expiration`
option for the API server. The `path` field specifies a relative path to the mount point
of the projected volume.
-->
字段 `expirationSeconds` 是服務賬號令牌預期的生命期長度。默認值爲 1 小時，
必須至少爲 10 分鐘（600 秒）。管理員也可以通過設置 API 伺服器的命令列參數
`--service-account-max-token-expiration` 來爲其設置最大值上限。
`path` 字段給出與投射卷掛載點之間的相對路徑。

{{< note >}}
<!--
A container using a projected volume source as a [`subPath`](/docs/concepts/storage/volumes/#using-subpath)
volume mount will not receive updates for those volume sources.
-->
以 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
形式使用投射卷源的容器無法收到對應卷源的更新。
{{< /note >}}

<!--
## clusterTrustBundle projected volumes {#clustertrustbundle}
-->
## clusterTrustBundle 投射卷    {#clustertrustbundle}

{{< feature-state feature_gate_name="ClusterTrustBundleProjection" >}}

{{< note >}}
<!--
To use this feature in Kubernetes {{< skew currentVersion >}}, you must enable support for ClusterTrustBundle objects with the `ClusterTrustBundle` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and `--runtime-config=certificates.k8s.io/v1beta1/clustertrustbundles=true` kube-apiserver flag, then enable the `ClusterTrustBundleProjection` feature gate.
-->
要在 Kubernetes {{< skew currentVersion >}} 中使用此特性，你必須通過 `ClusterTrustBundle`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)和
`--runtime-config=certificates.k8s.io/v1beta1/clustertrustbundles=true` kube-apiserver
標誌啓用對 ClusterTrustBundle 對象的支持，然後才能啓用 `ClusterTrustBundleProjection` 特性門控。
{{< /note >}}

<!--
The `clusterTrustBundle` projected volume source injects the contents of one or more [ClusterTrustBundle](/docs/reference/access-authn-authz/certificate-signing-requests#cluster-trust-bundles) objects as an automatically-updating file in the container filesystem.
-->
`clusterTrustBundle` 投射卷源將一個或多個
[ClusterTrustBundle](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#cluster-trust-bundles)
對象的內容作爲一個自動更新的文件注入到容器文件系統中。

<!--
ClusterTrustBundles can be selected either by [name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked) or by [signer name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked).
-->
ClusterTrustBundle 可以通過[名稱](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked)
或[簽名者名稱](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked)被選中。

<!--
To select by name, use the `name` field to designate a single ClusterTrustBundle object.

To select by signer name, use the `signerName` field (and optionally the
`labelSelector` field) to designate a set of ClusterTrustBundle objects that use
the given signer name. If `labelSelector` is not present, then all
ClusterTrustBundles for that signer are selected.
-->
要按名稱選擇，可以使用 `name` 字段指定單個 ClusterTrustBundle 對象。

要按簽名者名稱選擇，可以使用 `signerName` 字段（也可選用 `labelSelector` 字段）
指定一組使用給定簽名者名稱的 ClusterTrustBundle 對象。
如果 `labelSelector` 不存在，則針對該簽名者的所有 ClusterTrustBundles 將被選中。

<!--
The kubelet deduplicates the certificates in the selected ClusterTrustBundle objects, normalizes the PEM representations (discarding comments and headers), reorders the certificates, and writes them into the file named by `path`. As the set of selected ClusterTrustBundles or their content changes, kubelet keeps the file up-to-date.
-->
kubelet 會對所選 ClusterTrustBundle 對象中的證書進行去重，規範化 PEM 表示（丟棄註釋和頭部），
重新排序證書，並將這些證書寫入由 `path` 指定的文件中。
隨着所選 ClusterTrustBundles 的集合或其內容發生變化，kubelet 會保持更新此文件。

<!--
By default, the kubelet will prevent the pod from starting if the named ClusterTrustBundle is not found, or if `signerName` / `labelSelector` do not match any ClusterTrustBundles.  If this behavior is not what you want, then set the `optional` field to `true`, and the pod will start up with an empty file at `path`.
-->
默認情況下，如果找不到指定的 ClusterTrustBundle，或者 `signerName` / `labelSelector`
與所有 ClusterTrustBundle 都不匹配，kubelet 將阻止 Pod 啓動。如果這不是你想要的行爲，
可以將 `optional` 字段設置爲 `true`，Pod 將使用 `path` 處的空白文件啓動。

{{% code_sample file="pods/storage/projected-clustertrustbundle.yaml" %}}

<!--
## podCertificate projected volumes {#podcertificate}
-->
## podCertificate 投射卷    {#podcertificate}

{{< feature-state feature_gate_name="PodCertificateRequest" >}}

{{< note >}}
<!--
In Kubernetes {{< skew currentVersion >}}, you must enable support for Pod
Certificates using the `PodCertificateRequest` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`--runtime-config=certificates.k8s.io/v1alpha1/podcertificaterequests=true`
kube-apiserver flag.
-->
在 Kubernetes {{< skew currentVersion >}} 中，你必須使用 `PodCertificateRequest`
**特性門控**和 `--runtime-config=certificates.k8s.io/v1alpha1/podcertificaterequests=true`
kube-apiserver 標誌來啓用對 Pod 證書的支持。
{{< /note >}}

<!--
The `podCertificate` projected volumes source securely provisions a private key
and X.509 certificate chain for pod to use as client or server credentials.
Kubelet will then handle refreshing the private key and certificate chain when
they get close to expiration.  The application just has to make sure that it
reloads the file promptly when it changes, with a mechanism like `inotify` or
polling.
-->
`podCertificate` 投射卷源爲 Pod 安全地提供一個私鑰和 X.509 證書鏈，用作客戶端或伺服器憑據。
當私鑰和證書鏈接近過期時，kubelet 將處理刷新它們。應用程序只需確保在文件發生變化時，
及時通過類似 `inotify` 或輪詢的機制重新加載文件。

<!--
Each `podCertificate` projection supports the following configuration fields:
* `signerName`: The
  [signer](/docs/reference/access-authn-authz/certificate-signing-requests#signers)
  you want to issue the certificate.  Note that signers may have their own
  access requirements, and may refuse to issue certificates to your pod.
* `keyType`: The type of private key that should be generated.  Valid values are
  `ED25519`, `ECDSAP256`, `ECDSAP384`, `ECDSAP521`, `RSA3072`, and `RSA4096`.
* `maxExpirationSeconds`: The maximum lifetime you will accept for the
  certificate issued to the pod.  If not set, will be defaulted to `86400` (24
  hours).  Must be at least `3600` (1 hour), and at most `7862400` (91 days).
  Kubernetes built-in signers are restricted to a max lifetime of `86400` (1
  day). The signer is allowed to issue a certificate with a lifetime shorter
  than what you've specified.
* `credentialBundlePath`: Relative path within the projection where the
  credential bundle should be written.  The credential bundle is a PEM-formatted
  file, where the first block is a "PRIVATE KEY" block that contains a
  PKCS#8-serialized private key, and the remaining blocks are "CERTIFICATE"
  blocks that comprise the certificate chain (leaf certificate and any
  intermediates).
* `keyPath` and `certificateChainPath`: Separate paths where Kubelet should
  write *just* the private key or certificate chain.
-->
每個 `podCertificate` 投射支持以下設定字段：

* `signerName`：你希望簽發證書的
  [簽名者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#signers)。
  注意，簽名者可能有自己的訪問要求，並可能拒絕爲你的 Pod 簽發證書。
* `keyType`：應生成的私鑰類型。有效值爲
  `ED25519`、`ECDSAP256`、`ECDSAP384`、`ECDSAP521`、`RSA3072` 和 `RSA4096`。
* `maxExpirationSeconds`：你將接受的頒發給 Pod 的證書的最大生命週期。
  如果未設置，默認爲 `86400`（24 小時）。必須至少爲 `3600`（1 小時），最多爲 `7862400`（91 天）。
  Kubernetes 內置簽名者的最大生命週期限制爲 `86400`（1 天）。簽名者允許頒發比指定時間更短生命週期的證書。
* `credentialBundlePath`：投射內憑證包應寫入的相對路徑。憑證包是一個 PEM 格式的文件，
  其中第一個塊是包含 PKCS#8 序列化私鑰的 "PRIVATE KEY" 塊，其餘塊是組成證書鏈（葉證書和任何中間證書）的 "CERTIFICATE" 塊。
* `keyPath` 和 `certificateChainPath`：kubelet 應單獨寫入**僅**私鑰或證書鏈的路徑。

{{< note >}}

<!--
Most applications should prefer using `credentialBundlePath` unless they need
the key and certificates in separate files for compatibility reasons. Kubelet
uses an atomic writing strategy based on symlinks to make sure that when you
open the files it projects, you read either the old content or the new content.
However, if you read the key and certificate chain from separate files, Kubelet
may rotate the credentials after your first read and before your second read,
resulting in your application loading a mismatched key and certificate.
-->
除非應用程序因兼容性原因需要將密鑰和證書存儲在單獨的文件中，否則應優先使用 `credentialBundlePath`。
kubelet 使用基於符號鏈接的原子寫入策略，確保在你打開它投射的文件時，讀取的要麼是舊內容，要麼是新內容。
然而，如果你從單獨的文件中讀取密鑰和證書鏈，在第一次讀取後和第二次讀取前，kubelet 可能會輪換憑證，
這將導致你的應用程序加載不匹配的密鑰和證書。

{{< /note >}}

{{% code_sample file="pods/storage/projected-podcertificate.yaml" %}}

<!--
## SecurityContext interactions
-->
## 與 SecurityContext 間的關係    {#securitycontext-interactions}

<!--
The [proposal](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal) for file permission handling in projected service account volume enhancement introduced the projected files having the correct owner permissions set.
-->
關於在投射的服務賬號卷中處理文件訪問權限的[提案](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal)
介紹瞭如何使得所投射的文件具有合適的屬主訪問權限。

### Linux

<!--
In Linux pods that have a projected volume and `RunAsUser` set in the Pod
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context),
the projected files have the correct ownership set including container user
ownership.
-->
在包含了投射卷並在
[`SecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
中設置了 `RunAsUser` 屬性的 Linux Pod 中，投射文件具有正確的屬主屬性設置，
其中包含了容器使用者屬主。

<!--
When all containers in a pod have the same `runAsUser` set in their
[`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
or container
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1),
then the kubelet ensures that the contents of the `serviceAccountToken` volume are owned by that user,
and the token file has its permission mode set to `0600`.
-->
當 Pod 中的所有容器在其
[`PodSecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
或容器
[`SecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
中設置了相同的 `runAsUser` 時，kubelet 將確保 `serviceAccountToken`
卷的內容歸該使用者所有，並且令牌文件的權限模式會被設置爲 `0600`。

{{< note >}}
<!--
{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
added to a Pod after it is created do *not* change volume permissions that were
set when the pod was created.

If a Pod's `serviceAccountToken` volume permissions were set to `0600` because
all other containers in the Pod have the same `runAsUser`, ephemeral
containers must use the same `runAsUser` to be able to read the token.
-->
在某 Pod 被創建後爲其添加的{{< glossary_tooltip text="臨時容器" term_id="ephemeral-container" >}}**不會**更改創建該
Pod 時設置的卷權限。

如果 Pod 的 `serviceAccountToken` 卷權限被設爲 `0600`
是因爲 Pod 中的其他所有容器都具有相同的 `runAsUser`，
則臨時容器必須使用相同的 `runAsUser` 才能讀取令牌。
{{< /note >}}

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
在包含了投射卷並在 `SecurityContext` 中設置了 `RunAsUsername` 的 Windows Pod 中,
由於 Windows 中使用者賬號的管理方式問題，文件的屬主無法正確設置。
Windows 在名爲安全賬號管理器（Security Account Manager，SAM）
的數據庫中保存本地使用者和組信息。每個容器會維護其自身的 SAM 數據庫實例，
宿主系統無法窺視到容器運行期間數據庫內容。Windows 容器被設計用來運行操作系統的使用者態部分，
與宿主系統之間隔離，因此維護了一個虛擬的 SAM 數據庫。
所以，在宿主系統上運行的 kubelet 無法動態爲虛擬的容器賬號設定宿主文件的屬主。
如果需要將宿主機器上的文件與容器共享，建議將它們放到掛載於 `C:\` 之外的獨立卷中。

<!--
By default, the projected files will have the following ownership as shown for
an example projected volume file:
-->
默認情況下，所投射的文件會具有如下例所示的屬主屬性設置：

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
這意味着，所有類似 `ContainerAdministrator` 的管理員使用者都具有讀、寫和執行訪問權限，
而非管理員使用者將具有讀和執行訪問權限。

{{< note >}}
<!--
In general, granting the container access to the host is discouraged as it can
open the door for potential security exploits.

Creating a Windows Pod with `RunAsUser` in it's `SecurityContext` will result in
the Pod being stuck at `ContainerCreating` forever. So it is advised to not use
the Linux only `RunAsUser` option with Windows Pods.
-->
總體而言，爲容器授予訪問宿主系統的權限這種做法是不推薦的，因爲這樣做可能會打開潛在的安全性攻擊之門。

在創建 Windows Pod 時，如果在其 `SecurityContext` 中設置了 `RunAsUser`，
Pod 會一直阻塞在 `ContainerCreating` 狀態。因此，建議不要在 Windows
節點上使用僅針對 Linux 的 `RunAsUser` 選項。
{{< /note >}}
