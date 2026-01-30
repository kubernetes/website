---
title: 投射卷
content_type: concept
weight: 21 # 跟在持久卷之后
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
本文档描述 Kubernetes 中的**投射卷（Projected Volume）**。
建议先熟悉[卷](/zh-cn/docs/concepts/storage/volumes/)概念。

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
## 介绍    {#introduction}

一个 `projected` 卷可以将若干现有的卷源映射到同一个目录之上。

目前，以下类型的卷源可以被投射：

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
所有的卷源都要求处于 Pod 所在的同一个名字空间内。更多详细信息，
可参考[一体化卷](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md)设计文档。

<!--
### Example configuration with a secret, a downwardAPI, and a configMap {#example-configuration-secret-downwardapi-configmap}
-->
### 带有 Secret、DownwardAPI 和 ConfigMap 的配置示例 {#example-configuration-secret-downwardapi-configmap}

{{% code_sample file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

<!--
### Example configuration: secrets with a non-default permission mode set {#example-configuration-secrets-nondefault-permission-mode}
-->
### 带有非默认权限模式设置的 Secret 的配置示例 {#example-configuration-secrets-nondefault-permission-mode}

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
每个被投射的卷源都列举在规约中的 `sources` 下面。参数几乎相同，只有两个例外：

* 对于 Secret，`secretName` 字段被改为 `name` 以便于 ConfigMap 的命名一致；
* `defaultMode` 只能在投射层级设置，不能在卷源层级设置。不过，正如上面所展示的，
  你可以显式地为每个投射单独设置 `mode` 属性。

<!--
## serviceAccountToken projected volumes {#serviceaccounttoken}
You can inject the token for the current [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
into a Pod at a specified path. For example:
-->
## serviceAccountToken 投射卷 {#serviceaccounttoken}

你可以将当前[服务账号](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)的令牌注入到
Pod 中特定路径下。例如：

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
示例 Pod 中包含一个投射卷，其中包含注入的服务账号令牌。
此 Pod 中的容器可以使用该令牌访问 Kubernetes API 服务器，使用
[Pod 的 ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
进行身份验证。`audience` 字段包含令牌所针对的受众。
收到令牌的主体必须使用令牌受众中所指定的某个标识符来标识自身，否则应该拒绝该令牌。
此字段是可选的，默认值为 API 服务器的标识。

<!--
The `expirationSeconds` is the expected duration of validity of the service account
token. It defaults to 1 hour and must be at least 10 minutes (600 seconds). An administrator
can also limit its maximum value by specifying the `--service-account-max-token-expiration`
option for the API server. The `path` field specifies a relative path to the mount point
of the projected volume.
-->
字段 `expirationSeconds` 是服务账号令牌预期的生命期长度。默认值为 1 小时，
必须至少为 10 分钟（600 秒）。管理员也可以通过设置 API 服务器的命令行参数
`--service-account-max-token-expiration` 来为其设置最大值上限。
`path` 字段给出与投射卷挂载点之间的相对路径。

{{< note >}}
<!--
A container using a projected volume source as a [`subPath`](/docs/concepts/storage/volumes/#using-subpath)
volume mount will not receive updates for those volume sources.
-->
以 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
形式使用投射卷源的容器无法收到对应卷源的更新。
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
要在 Kubernetes {{< skew currentVersion >}} 中使用此特性，你必须通过 `ClusterTrustBundle`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)和
`--runtime-config=certificates.k8s.io/v1beta1/clustertrustbundles=true` kube-apiserver
标志启用对 ClusterTrustBundle 对象的支持，然后才能启用 `ClusterTrustBundleProjection` 特性门控。
{{< /note >}}

<!--
The `clusterTrustBundle` projected volume source injects the contents of one or more [ClusterTrustBundle](/docs/reference/access-authn-authz/certificate-signing-requests#cluster-trust-bundles) objects as an automatically-updating file in the container filesystem.
-->
`clusterTrustBundle` 投射卷源将一个或多个
[ClusterTrustBundle](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#cluster-trust-bundles)
对象的内容作为一个自动更新的文件注入到容器文件系统中。

<!--
ClusterTrustBundles can be selected either by [name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked) or by [signer name](/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked).
-->
ClusterTrustBundle 可以通过[名称](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-unlinked)
或[签名者名称](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#ctb-signer-linked)被选中。

<!--
To select by name, use the `name` field to designate a single ClusterTrustBundle object.

To select by signer name, use the `signerName` field (and optionally the
`labelSelector` field) to designate a set of ClusterTrustBundle objects that use
the given signer name. If `labelSelector` is not present, then all
ClusterTrustBundles for that signer are selected.
-->
要按名称选择，可以使用 `name` 字段指定单个 ClusterTrustBundle 对象。

要按签名者名称选择，可以使用 `signerName` 字段（也可选用 `labelSelector` 字段）
指定一组使用给定签名者名称的 ClusterTrustBundle 对象。
如果 `labelSelector` 不存在，则针对该签名者的所有 ClusterTrustBundle 将被选中。

<!--
The kubelet deduplicates the certificates in the selected ClusterTrustBundle objects, normalizes the PEM representations (discarding comments and headers), reorders the certificates, and writes them into the file named by `path`. As the set of selected ClusterTrustBundles or their content changes, kubelet keeps the file up-to-date.
-->
kubelet 会对所选 ClusterTrustBundle 对象中的证书进行去重，规范化 PEM 表示（丢弃注释和头部），
重新排序证书，并将这些证书写入由 `path` 指定的文件中。
随着所选 ClusterTrustBundle 的集合或其内容发生变化，kubelet 会保持更新此文件。

<!--
By default, the kubelet will prevent the pod from starting if the named ClusterTrustBundle is not found, or if `signerName` / `labelSelector` do not match any ClusterTrustBundles.  If this behavior is not what you want, then set the `optional` field to `true`, and the pod will start up with an empty file at `path`.
-->
默认情况下，如果找不到指定的 ClusterTrustBundle，或者 `signerName` / `labelSelector`
与所有 ClusterTrustBundle 都不匹配，kubelet 将阻止 Pod 启动。如果这不是你想要的行为，
可以将 `optional` 字段设置为 `true`，Pod 将使用 `path` 处的空白文件启动。

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
`--runtime-config=certificates.k8s.io/v1beta1/podcertificaterequests=true`
kube-apiserver flag.
-->
在 Kubernetes {{< skew currentVersion >}} 中，你必须使用 `PodCertificateRequest`
**特性门控**和 `--runtime-config=certificates.k8s.io/v1beta1/podcertificaterequests=true`
kube-apiserver 标志来启用对 Pod 证书的支持。
{{< /note >}}

<!--
The `podCertificate` projected volumes source securely provisions a private key
and X.509 certificate chain for pod to use as client or server credentials.
Kubelet will then handle refreshing the private key and certificate chain when
they get close to expiration.  The application just has to make sure that it
reloads the file promptly when it changes, with a mechanism like `inotify` or
polling.
-->
`podCertificate` 投射卷源为 Pod 安全地提供一个私钥和 X.509 证书链，用作客户端或服务器凭据。
当私钥和证书链接近过期时，kubelet 将处理刷新它们。应用程序只需确保在文件发生变化时，
及时通过类似 `inotify` 或轮询的机制重新加载文件。

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
每个 `podCertificate` 投射支持以下配置字段：

* `signerName`：你希望签发证书的
  [签名者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#signers)。
  注意，签名者可能有自己的访问要求，并可能拒绝为你的 Pod 签发证书。
* `keyType`：应生成的私钥类型。有效值为
  `ED25519`、`ECDSAP256`、`ECDSAP384`、`ECDSAP521`、`RSA3072` 和 `RSA4096`。
* `maxExpirationSeconds`：你将接受的颁发给 Pod 的证书的最大生命周期。
  如果未设置，默认为 `86400`（24 小时）。必须至少为 `3600`（1 小时），最多为 `7862400`（91 天）。
  Kubernetes 内置签名者的最大生命周期限制为 `86400`（1 天）。签名者允许颁发比指定时间更短生命周期的证书。
* `credentialBundlePath`：投射内凭证包应写入的相对路径。凭证包是一个 PEM 格式的文件，
  其中第一个块是包含 PKCS#8 序列化私钥的 "PRIVATE KEY" 块，其余块是组成证书链（叶证书和任何中间证书）的 "CERTIFICATE" 块。
* `keyPath` 和 `certificateChainPath`：kubelet 应单独写入**仅**私钥或证书链的路径。
<!--
* `userAnnotations`: a map that allows you to pass additional information to
  the signer implementation. It is copied verbatim into the
  `spec.unverifiedUserAnnotations` field of the [PodCertificateRequest](docs/reference/access-authn-authz/certificate-signing-requests#pod-certificate-requests) objects
  that Kubelet creates. Entries are subject to the same validation as object
  metadata annotations, with the addition that all keys must be domain-prefixed.
  No restrictions are placed on values, except an overall size limitation on the
  entire field. Other than these basic validations, the API server does not
  conduct any extra validations. The signer implementations should be very
  careful when consuming this data. Signers must not inherently trust this data
  without first performing the appropriate verification steps. Signers should
  document the keys and values they support. Signers should deny requests that
  contain keys they do not recognize.
-->
* `userAnnotations`：一个映射，允许你向签名器实现传递附加信息。
  它会被原封不动地复制到 kubelet 创建的
  [PodCertificateRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests#pod-certificate-requests)
  对象的 `spec.unverifiedUserAnnotations` 字段中。
  条目的验证方式与对象元数据注解相同，但所有键都必须带有域名前缀。
  除了整个字段的大小限制外，值本身没有其他限制。
  除了这些基本验证之外，API 服务器不会执行任何其他验证。
  签名器实现在使用这些数据时应格外谨慎。
  签名器不应在未执行适当的验证步骤之前就完全信任这些数据。 
  签名器应记录其支持的键和值。签名器应拒绝包含其无法识别的键的请求。

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
除非应用程序因兼容性原因需要将密钥和证书存储在单独的文件中，否则应优先使用 `credentialBundlePath`。
kubelet 使用基于符号链接的原子写入策略，确保在你打开它投射的文件时，读取的要么是旧内容，要么是新内容。
然而，如果你从单独的文件中读取密钥和证书链，在第一次读取后和第二次读取前，kubelet 可能会轮换凭证，
这将导致你的应用程序加载不匹配的密钥和证书。
{{< /note >}}

{{% code_sample file="pods/storage/projected-podcertificate.yaml" %}}

<!--
## SecurityContext interactions
-->
## 与 SecurityContext 间的关系    {#securitycontext-interactions}

<!--
The [proposal](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal) for file permission handling in projected service account volume enhancement introduced the projected files having the correct owner permissions set.
-->
关于在投射的服务账号卷中处理文件访问权限的[提案](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal)
介绍了如何使得所投射的文件具有合适的属主访问权限。

### Linux

<!--
In Linux pods that have a projected volume and `RunAsUser` set in the Pod
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context),
the projected files have the correct ownership set including container user
ownership.
-->
在包含了投射卷并在
[`SecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
中设置了 `RunAsUser` 属性的 Linux Pod 中，投射文件具有正确的属主属性设置，
其中包含了容器用户属主。

<!--
When all containers in a pod have the same `runAsUser` set in their
[`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
or container
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1),
then the kubelet ensures that the contents of the `serviceAccountToken` volume are owned by that user,
and the token file has its permission mode set to `0600`.
-->
当 Pod 中的所有容器在其
[`PodSecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
或容器
[`SecurityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
中设置了相同的 `runAsUser` 时，kubelet 将确保 `serviceAccountToken`
卷的内容归该用户所有，并且令牌文件的权限模式会被设置为 `0600`。

{{< note >}}
<!--
{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
added to a Pod after it is created do *not* change volume permissions that were
set when the pod was created.

If a Pod's `serviceAccountToken` volume permissions were set to `0600` because
all other containers in the Pod have the same `runAsUser`, ephemeral
containers must use the same `runAsUser` to be able to read the token.
-->
在某 Pod 被创建后为其添加的{{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}**不会**更改创建该
Pod 时设置的卷权限。

如果 Pod 的 `serviceAccountToken` 卷权限被设为 `0600`
是因为 Pod 中的其他所有容器都具有相同的 `runAsUser`，
则临时容器必须使用相同的 `runAsUser` 才能读取令牌。
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
在包含了投射卷并在 `SecurityContext` 中设置了 `RunAsUsername` 的 Windows Pod 中,
由于 Windows 中用户账号的管理方式问题，文件的属主无法正确设置。
Windows 在名为安全账号管理器（Security Account Manager，SAM）
的数据库中保存本地用户和组信息。每个容器会维护其自身的 SAM 数据库实例，
宿主系统无法窥视到容器运行期间数据库内容。Windows 容器被设计用来运行操作系统的用户态部分，
与宿主系统之间隔离，因此维护了一个虚拟的 SAM 数据库。
所以，在宿主系统上运行的 kubelet 无法动态为虚拟的容器账号配置宿主文件的属主。
如果需要将宿主机器上的文件与容器共享，建议将它们放到挂载于 `C:\` 之外的独立卷中。

<!--
By default, the projected files will have the following ownership as shown for
an example projected volume file:
-->
默认情况下，所投射的文件会具有如下例所示的属主属性设置：

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
这意味着，所有类似 `ContainerAdministrator` 的管理员用户都具有读、写和执行访问权限，
而非管理员用户将具有读和执行访问权限。

{{< note >}}
<!--
In general, granting the container access to the host is discouraged as it can
open the door for potential security exploits.

Creating a Windows Pod with `RunAsUser` in it's `SecurityContext` will result in
the Pod being stuck at `ContainerCreating` forever. So it is advised to not use
the Linux only `RunAsUser` option with Windows Pods.
-->
总体而言，为容器授予访问宿主系统的权限这种做法是不推荐的，因为这样做可能会打开潜在的安全性攻击之门。

在创建 Windows Pod 时，如果在其 `SecurityContext` 中设置了 `RunAsUser`，
Pod 会一直阻塞在 `ContainerCreating` 状态。因此，建议不要在 Windows
节点上使用仅针对 Linux 的 `RunAsUser` 选项。
{{< /note >}}
