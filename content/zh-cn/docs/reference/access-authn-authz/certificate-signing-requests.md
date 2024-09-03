---
title: 证书和证书签名请求
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
- apiVersion: "certificates.k8s.io/v1alpha1"
  kind: "ClusterTrustBundle"  
content_type: concept
weight: 60
---
<!--
reviewers:
- liggitt
- mikedanese
- munnerz
- enj
title: Certificates and Certificate Signing Requests
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
- apiVersion: "certificates.k8s.io/v1alpha1"
  kind: "ClusterTrustBundle"  
content_type: concept
weight: 60
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
Kubernetes certificate and trust bundle APIs enable automation of
[X.509](https://www.itu.int/rec/T-REC-X.509) credential provisioning by providing
a programmatic interface for clients of the Kubernetes API to request and obtain
X.509 {{< glossary_tooltip term_id="certificate" text="certificates" >}} from a Certificate Authority (CA).

There is also experimental (alpha) support for distributing [trust bundles](#cluster-trust-bundles).
-->
Kubernetes 证书和信任包（trust bundle）API 可以通过为 Kubernetes API 的客户端提供编程接口，
实现 [X.509](https://www.itu.int/rec/T-REC-X.509) 凭据的自动化制备，
从而请求并获取证书颁发机构（CA）发布的 X.509 {{< glossary_tooltip term_id="certificate" text="证书" >}}。

此外，Kubernetes 还对分发[信任包](#cluster-trust-bundles)提供了实验性（Alpha）支持。

<!-- body -->

<!--
## Certificate signing requests
-->
## 证书签名请求   {#certificate-signing-requests}

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
A [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
(CSR) resource is used to request that a certificate be signed
by a denoted signer, after which the request may be approved or denied before
finally being signed.
-->
[CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
（CSR）资源用来向指定的签名者申请证书签名，
在最终签名之前，申请可能被批准，也可能被拒绝。

<!--
### Request signing process

The CertificateSigningRequest resource type allows a client to ask for an X.509 certificate
be issued, based on a signing request.
The CertificateSigningRequest object includes a PEM-encoded PKCS#10 signing request in
the `spec.request` field. The CertificateSigningRequest denotes the signer (the
recipient that the request is being made to) using the `spec.signerName` field.
Note that `spec.signerName` is a required key after API version `certificates.k8s.io/v1`.
In Kubernetes v1.22 and later, clients may optionally set the `spec.expirationSeconds`
field to request a particular lifetime for the issued certificate. The minimum valid
value for this field is `600`, i.e. ten minutes.
-->
### 请求签名流程 {#request-signing-process}

CertificateSigningRequest 资源类型允许客户端基于签名请求申请发放 X.509 证书。
CertificateSigningRequest 对象在 `spec.request` 字段中包含一个 PEM 编码的 PKCS#10 签名请求。
CertificateSigningRequest 使用 `spec.signerName` 字段标示签名者（请求的接收方）。
注意，`spec.signerName` 在 `certificates.k8s.io/v1` 之后的 API 版本是必填项。
在 Kubernetes v1.22 和以后的版本，客户可以设置 `spec.expirationSeconds`
字段（可选）来为颁发的证书设定一个特定的有效期。该字段的最小有效值是 `600`，也就是 10 分钟。

<!--
Once created, a CertificateSigningRequest must be approved before it can be signed.
Depending on the signer selected, a CertificateSigningRequest may be automatically approved
by a {{< glossary_tooltip text="controller" term_id="controller" >}}.
Otherwise, a CertificateSigningRequest must be manually approved either via the REST API (or client-go)
or by running `kubectl certificate approve`. Likewise, a CertificateSigningRequest may also be denied,
which tells the configured signer that it must not sign the request.
-->
创建完成的 CertificateSigningRequest，要先通过批准，然后才能签名。
根据所选的签名者，CertificateSigningRequest
可能会被{{< glossary_tooltip text="控制器" term_id="controller" >}}自动批准。
否则，就必须人工批准，
人工批准可以使用 REST API（或 client-go），也可以执行 `kubectl certificate approve` 命令。
同样，CertificateSigningRequest 也可能被驳回，
这就相当于通知了指定的签名者，这个证书不能签名。

<!--
For certificates that have been approved, the next step is signing. The relevant signing controller
first validates that the signing conditions are met and then creates a certificate.
The signing controller then updates the CertificateSigningRequest, storing the new certificate into
the `status.certificate` field of the existing CertificateSigningRequest object. The
`status.certificate` field is either empty or contains a X.509 certificate, encoded in PEM format.
The CertificateSigningRequest `status.certificate` field is empty until the signer does this.
-->
对于已批准的证书，下一步是签名。
对应的签名控制器首先验证签名条件是否满足，然后才创建证书。
签名控制器然后更新 CertificateSigningRequest，
将新证书保存到现有 CertificateSigningRequest 对象的 `status.certificate` 字段中。
此时，字段 `status.certificate` 要么为空，要么包含一个用 PEM 编码的 X.509 证书。
直到签名完成前，CertificateSigningRequest 的字段 `status.certificate` 都为空。

<!--
Once the `status.certificate` field has been populated, the request has been completed and clients can now
fetch the signed certificate PEM data from the CertificateSigningRequest resource.
The signers can instead deny certificate signing if the approval conditions are not met.
-->
一旦 `status.certificate` 字段完成填充，请求既算完成，
客户端现在可以从 CertificateSigningRequest 资源中获取已签名的证书的 PEM 数据。
当然如果不满足签名条件，签名者可以拒签。

<!--
In order to reduce the number of old CertificateSigningRequest resources left in a cluster, a garbage collection
controller runs periodically. The garbage collection removes CertificateSigningRequests that have not changed
state for some duration:

* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Failed requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 24 hours
* All requests: automatically deleted after the issued certificate has expired
-->
为了减少集群中遗留的过时的 CertificateSigningRequest 资源的数量，
一个垃圾收集控制器将会周期性地运行。
此垃圾收集器会清除在一段时间内没有改变过状态的 CertificateSigningRequest：

* 已批准的请求：1 小时后自动删除
* 已拒绝的请求：1 小时后自动删除
* 已失败的请求：1 小时后自动删除
* 挂起的请求：24 小时后自动删除
* 所有请求：在颁发的证书过期后自动删除

<!--
### Certificate signing authorization {#authorization}

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:

* Verbs: `create`, `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`

For example:
-->
### 证书签名鉴权   {#authorization}

授权创建 CertificateSigningRequest 和检索 CertificateSigningRequest：

* verbs（动词）：`create`、`get`、`list`、`watch`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`certificatesigningrequests`

例如：

{{< code_sample file="access/certificate-signing-request/clusterrole-create.yaml" >}}

<!--
To allow approving a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: `approve`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

For example:
-->
授权批准 CertificateSigningRequest：

* verbs（动词）：`get`、`list`、`watch`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`certificatesigningrequests`
* verbs（动词）：`update`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`certificatesigningrequests/approval`
* verbs（动词）：`approve`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`signers`，
  resourceName：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

例如：

{{< code_sample file="access/certificate-signing-request/clusterrole-approve.yaml" >}}

<!--
To allow signing a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: `sign`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`
-->
授权签名 CertificateSigningRequest：

* verbs（动词）：`get`、`list`、`watch`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`certificatesigningrequests`
* verbs（动词）：`update`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`certificatesigningrequests/status`
* verbs（动词）：`sign`，
  group（组）：`certificates.k8s.io`，
  resource（资源）：`signers`，
  resourceName：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

{{< code_sample file="access/certificate-signing-request/clusterrole-sign.yaml" >}}

<!--
## Signers

Signers abstractly represent the entity or entities that might sign, or have
signed, a security certificate.

Any signer that is made available for outside a particular cluster should provide information
about how the signer works, so that consumers can understand what that means for CertifcateSigningRequests
and (if enabled) [ClusterTrustBundles](#cluster-trust-bundles).
This includes:
-->
## 签名者 {#signers}

签名者抽象地代表可能签署或已签署安全证书的一个或多个实体。

任何要在特定集群以外提供的签名者都应该提供关于签名者工作方式的信息，
以便消费者可以理解这对于 CertifcateSigningRequest 和（如果启用的）
[ClusterTrustBundle](#cluster-trust-bundles) 的意义。此类信息包括：

<!--
1. **Trust distribution**: how trust anchors (CA certificates or certificate bundles) are distributed.
1. **Permitted subjects**: any restrictions on and behavior when a disallowed subject is requested.
1. **Permitted x509 extensions**: including IP subjectAltNames, DNS subjectAltNames,
   Email subjectAltNames, URI subjectAltNames etc, and behavior when a disallowed extension is requested.
1. **Permitted key usages / extended key usages**: any restrictions on and behavior
   when usages different than the signer-determined usages are specified in the CSR.
1. **Expiration/certificate lifetime**: whether it is fixed by the signer, configurable by the admin, determined by the CSR `spec.expirationSeconds` field, etc
   and the behavior when the signer-determined expiration is different from the CSR `spec.expirationSeconds` field.
1. **CA bit allowed/disallowed**: and behavior if a CSR contains a request a for a CA certificate when the signer does not permit it.
-->
1. **信任分发**：信任锚点（CA 证书或证书包）是如何分发的。
1. **许可的主体**：当一个受限制的主体（subject）发送请求时，相应的限制和应对手段。
1. **许可的 x509 扩展**：包括 IP subjectAltNames、DNS subjectAltNames、
   Email subjectAltNames、URI subjectAltNames 等，请求一个受限制的扩展项时的应对手段。
1. **许可的密钥用途/扩展的密钥用途**：当用途和签名者在 CSR 中指定的用途不同时，
   相应的限制和应对手段。
1. **过期时间/证书有效期**：过期时间由签名者确定、由管理员配置、还是由 CSR `spec.expirationSeconds` 字段指定等，
   以及签名者决定的过期时间与 CSR `spec.expirationSeconds` 字段不同时的应对手段。
1. **允许/不允许 CA 位**：当 CSR 包含一个签名者并不允许的 CA 证书的请求时，相应的应对手段。

<!--
Commonly, the `status.certificate` field of a CertificateSigningRequest contains a
single PEM-encoded X.509 certificate once the CSR is approved and the certificate is issued.
Some signers store multiple certificates into the `status.certificate` field. In
that case, the documentation for the signer should specify the meaning of
additional certificates; for example, this might be the certificate plus
intermediates to be presented during TLS handshakes.
-->
一般来说，当 CSR 被批准通过，且证书被签名后，CertificateSigningRequest
的 `status.certificate` 字段将包含一个 PEM 编码的 X.509 证书。
有些签名者在 `status.certificate` 字段中存储多个证书。
在这种情况下，签名者的说明文档应当指明附加证书的含义。
例如，这是要在 TLS 握手时提供的证书和中继证书。

<!--
If you want to make the _trust anchor_ (root certificate) available, this should be done
separately from a CertificateSigningRequest and its `status.certificate` field. For example,
you could use a ClusterTrustBundle.
-->
如果要让**信任锚点**（根证书）可用，应该将其与 CertificateSigningRequest 及其 `status.certificate`
字段分开处理。例如，你可以使用 ClusterTrustBundle。

<!--
The PKCS#10 signing request format does not have a standard mechanism to specify a
certificate expiration or lifetime. The expiration or lifetime therefore has to be set
through the `spec.expirationSeconds` field of the CSR object. The built-in signers
use the `ClusterSigningDuration` configuration option, which defaults to 1 year,
(the `--cluster-signing-duration` command-line flag of the kube-controller-manager)
as the default when no `spec.expirationSeconds` is specified. When `spec.expirationSeconds`
is specified, the minimum of `spec.expirationSeconds` and `ClusterSigningDuration` is
used.
-->
PKCS#10 签名请求格式并没有一种标准的方法去设置证书的过期时间或者生命期，
因此，证书的过期时间或者生命期必须通过 CSR 对象的 `spec.expirationSeconds` 字段来设置。
当 `spec.expirationSeconds` 没有被指定时，内置的签名者默认使用 `ClusterSigningDuration` 配置选项
（kube-controller-manager 的命令行选项 `--cluster-signing-duration`），该选项的默认值设为 1 年。
当 `spec.expirationSeconds` 被指定时，`spec.expirationSeconds` 和 `ClusterSigningDuration`
中的最小值会被使用。

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的。早期的 Kubernetes 版本并不认识该字段。
v1.22 版本之前的 Kubernetes API 服务器会在创建对象的时候忽略该字段。
{{< /note >}}

<!--
### Kubernetes signers

Kubernetes provides built-in signers that each have a well-known `signerName`:
-->
### Kubernetes 签名者 {#kubernetes-signers}

Kubernetes 提供了内置的签名者，每个签名者都有一个众所周知的 `signerName`：

<!--
1. `kubernetes.io/kube-apiserver-client`: signs certificates that will be honored as client certificates by the API server.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored as client certificates by the API server. The CA bundle is not distributed by any other means.
   1. Permitted subjects - no subject restrictions, but approvers and signers may choose not to approve or sign.
      Certain subjects like cluster-admin level users or groups vary between distributions and installations,
      but deserve additional scrutiny before approval and signing.
      The `CertificateSubjectRestriction` admission plugin is enabled by default to restrict `system:masters`,
      but it is often not the only cluster-admin subject in a cluster.
   1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
   1. Permitted key usages - must include `["client auth"]`. Must not include key usages beyond `["digital signature", "key encipherment", "client auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
1. `kubernetes.io/kube-apiserver-client`：签名的证书将被 API 服务器视为客户端证书，
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不会自动批准它。
   1. 信任分发：签名的证书将被 API 服务器视为客户端证书，CA 证书包不通过任何其他方式分发。
   1. 许可的主体：没有主体限制，但审核人和签名者可以选择不批准或不签署。
      某些主体，比如集群管理员级别的用户或组因部署和安装方式不同而不同，
      所以批准和签署之前需要进行额外仔细审查。
      用来限制 `system:masters` 的 CertificateSubjectRestriction 准入插件默认处于启用状态，
      但它通常不是集群中唯一的集群管理员主体。
   1. 许可的 x509 扩展：允许 subjectAltName 和 key usage 扩展，弃用其他扩展。
   1. 许可的密钥用途：必须包含 `["client auth"]`，但不能包含
      `["digital signature", "key encipherment", "client auth"]` 之外的键。
   1. 过期时间/证书有效期：对于 kube-controller-manager 实现的签名者，
      设置为 `--cluster-signing-duration` 选项和 CSR 对象的 `spec.expirationSeconds` 字段（如有设置该字段）中的最小值。
   1. 允许/不允许 CA 位：不允许。

<!--
1. `kubernetes.io/kube-apiserver-client-kubelet`: signs client certificates that will be honored as client certificates by the
   API server.
   May be auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored as client certificates by the API server. The CA bundle
      is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name is "`system:node:${NODE_NAME}`".
   1. Permitted x509 extensions - honors key usage extensions, forbids subjectAltName extensions and drops other extensions.
   1. Permitted key usages - `["key encipherment", "digital signature", "client auth"]` or `["digital signature", "client auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
2. `kubernetes.io/kube-apiserver-client-kubelet`：签名的证书将被 kube-apiserver 视为客户端证书。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 可以自动批准它。

   1. 信任分发：签名的证书将被 API 服务器视为客户端证书，CA 证书包不通过任何其他方式分发。
   1. 许可的主体：组织名必须是 `["system:nodes"]`，通用名称为 "`system:node:${NODE_NAME}`" 开头
   1. 许可的 x509 扩展：允许 key usage 扩展，禁用 subjectAltName 扩展，并删除其他扩展。
   1. 许可的密钥用途：`["key encipherment", "digital signature", "client auth"]`
      或 `["digital signature", "client auth"]`。
   1. 过期时间/证书有效期：对于 kube-controller-manager 实现的签名者，
      设置为 `--cluster-signing-duration` 选项和 CSR 对象的 `spec.expirationSeconds` 字段（如有设置该字段）中的最小值。
   1. 允许/不允许 CA 位：不允许。

<!--
1. `kubernetes.io/kubelet-serving`: signs serving certificates that are honored as a valid kubelet serving certificate
   by the API server, but has no other guarantees.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored by the API server as valid to terminate connections to a kubelet.
      The CA bundle is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name is "`system:node:${NODE_NAME}`".
   1. Permitted x509 extensions - honors key usage and DNSName/IPAddress subjectAltName extensions, forbids EmailAddress and
      URI subjectAltName extensions, drops other extensions. At least one DNS or IP subjectAltName must be present.
   1. Permitted key usages - `["key encipherment", "digital signature", "server auth"]` or `["digital signature", "server auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
3. `kubernetes.io/kubelet-serving`：签名服务端证书，该服务证书被 API 服务器视为有效的 kubelet 服务端证书，
   但没有其他保证。{{< glossary_tooltip term_id="kube-controller-manager" >}} 不会自动批准它。
   1. 信任分发：签名的证书必须被 kube-apiserver 认可，可有效的中止 kubelet 连接，CA 证书包不通过任何其他方式分发。
   1. 许可的主体：组织名必须是 `["system:nodes"]`，通用名称为 "`system:node:${NODE_NAME}`" 开头
   1. 许可的 x509 扩展：允许 key usage、DNSName/IPAddress subjectAltName 等扩展，
      禁止 EmailAddress、URI subjectAltName 等扩展，并丢弃其他扩展。
      至少有一个 DNS 或 IP 的 SubjectAltName 存在。
   1. 许可的密钥用途：`["key encipherment", "digital signature", "server auth"]`
      或 `["digital signature", "server auth"]`。
   1. 过期时间/证书有效期：对于 kube-controller-manager 实现的签名者，
      设置为 `--cluster-signing-duration` 选项和 CSR 对象的 `spec.expirationSeconds` 字段（如有设置该字段）中的最小值。
   1. 允许/不允许 CA 位：不允许。

<!--
1. `kubernetes.io/legacy-unknown`: has no guarantees for trust at all. Some third-party distributions of Kubernetes
   may honor client certificates signed by it. The stable CertificateSigningRequest API (version `certificates.k8s.io/v1` and later)
   does not allow to set the `signerName` as `kubernetes.io/legacy-unknown`.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: None. There is no standard trust or distribution for this signer in a Kubernetes cluster.
   1. Permitted subjects - any
   1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
   1. Permitted key usages - any
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
4. `kubernetes.io/legacy-unknown`：不保证信任。Kubernetes 的一些第三方发行版可能会使用它签署的客户端证书。
   稳定版的 CertificateSigningRequest API（`certificates.k8s.io/v1` 以及之后的版本）不允许将
   `signerName` 设置为 `kubernetes.io/legacy-unknown`。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不会自动批准这类请求。
   1. 信任分发：没有。这个签名者在 Kubernetes 集群中没有标准的信任或分发。
   1. 许可的主体：全部。
   1. 许可的 x509 扩展：允许 subjectAltName 和 key usage 等扩展，并弃用其他扩展。
   1. 许可的密钥用途：全部。
   1. 过期时间/证书有效期：对于 kube-controller-manager 实现的签名者，
      设置为 `--cluster-signing-duration` 选项和 CSR 对象的 `spec.expirationSeconds` 字段（如有设置该字段）中的最小值。
   1. 允许/不允许 CA 位 - 不允许。

<!--
The kube-controller-manager implements [control plane signing](#signer-control-plane) for each of the built in
signers. Failures for all of these are only reported in kube-controller-manager logs.
-->
kube-controller-manager 为每个内置签名者实现了[控制平面签名](#signer-control-plane)。
注意：所有这些故障仅在 kube-controller-manager 日志中报告。

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的，早期的 Kubernetes 版本并不认识该字段，
v1.22 版本之前的 Kubernetes API 服务器会在创建对象的时候忽略该字段。
{{< /note >}}

<!--
Distribution of trust happens out of band for these signers. Any trust outside of those described above are strictly
coincidental. For instance, some distributions may honor `kubernetes.io/legacy-unknown` as client certificates for the
kube-apiserver, but this is not a standard.
None of these usages are related to ServiceAccount token secrets `.data[ca.crt]` in any way. That CA bundle is only
guaranteed to verify a connection to the API server using the default service (`kubernetes.default.svc`).
-->
对于这些签名者，信任的分发发生在带外（out of band）。上述信任之外的任何信任都是完全巧合的。
例如，一些发行版可能会将 `kubernetes.io/legacy-unknown` 作为 kube-apiserver 的客户端证书，
但这个做法并不标准。
这些用途都没有以任何方式涉及到 ServiceAccount 中的 Secrets `.data[ca.crt]`。
此 CA 证书包只保证使用默认的服务（`kubernetes.default.svc`）来验证到 API 服务器的连接。

<!--
## Signing

### Control plane signer {#signer-control-plane}

The Kubernetes control plane implements each of the
[Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers),
as part of the kube-controller-manager.
-->
## 签名   {#signing}

### 控制平面签名者    {#signer-control-plane}

Kubernetes 控制平面实现了每一个
[Kubernetes 签名者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)，
每个签名者的实现都是 kube-controller-manager 的一部分。

{{< note >}}
<!--
Prior to Kubernetes v1.18, the kube-controller-manager would sign any CSRs that
were marked as approved.
-->
在 Kubernetes v1.18 之前，
kube-controller-manager 签名所有标记为 approved 的 CSR。
{{< /note >}}

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22.
Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的，早期的 Kubernetes 版本并不认识该字段，
v1.22 版本之前的 Kubernetes API 服务器会在创建对象的时候忽略该字段。
{{< /note >}}

<!--
### API-based signers {#signer-api}

Users of the REST API can sign CSRs by submitting an UPDATE request to the `status`
subresource of the CSR to be signed.

As part of this request, the `status.certificate` field should be set to contain the
signed certificate. This field contains one or more PEM-encoded certificates.

All PEM blocks must have the "CERTIFICATE" label, contain no headers,
and the encoded data must be a BER-encoded ASN.1 Certificate structure
as described in [section 4 of RFC5280](https://tools.ietf.org/html/rfc5280#section-4.1).

Example certificate content:
-->
### 基于 API 的签名者   {#signer-api}

REST API 的用户可以通过向待签名的 CSR 的 `status` 子资源提交更新请求来对 CSR 进行签名。

作为这个请求的一部分，`status.certificate` 字段应设置为已签名的证书。
此字段可包含一个或多个 PEM 编码的证书。

所有的 PEM 块必须具备 "CERTIFICATE" 标签，且不包含文件头，且编码的数据必须是
[RFC5280 第 4 节](https://tools.ietf.org/html/rfc5280#section-4.1)
中描述的 BER 编码的 ASN.1 证书结构。

证书内容示例：

```
-----BEGIN CERTIFICATE-----
MIIDgjCCAmqgAwIBAgIUC1N1EJ4Qnsd322BhDPRwmg3b/oAwDQYJKoZIhvcNAQEL
BQAwXDELMAkGA1UEBhMCeHgxCjAIBgNVBAgMAXgxCjAIBgNVBAcMAXgxCjAIBgNV
BAoMAXgxCjAIBgNVBAsMAXgxCzAJBgNVBAMMAmNhMRAwDgYJKoZIhvcNAQkBFgF4
MB4XDTIwMDcwNjIyMDcwMFoXDTI1MDcwNTIyMDcwMFowNzEVMBMGA1UEChMMc3lz
dGVtOm5vZGVzMR4wHAYDVQQDExVzeXN0ZW06bm9kZToxMjcuMC4wLjEwggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDne5X2eQ1JcLZkKvhzCR4Hxl9+ZmU3
+e1zfOywLdoQxrPi+o4hVsUH3q0y52BMa7u1yehHDRSaq9u62cmi5ekgXhXHzGmm
kmW5n0itRECv3SFsSm2DSghRKf0mm6iTYHWDHzUXKdm9lPPWoSOxoR5oqOsm3JEh
Q7Et13wrvTJqBMJo1GTwQuF+HYOku0NF/DLqbZIcpI08yQKyrBgYz2uO51/oNp8a
sTCsV4OUfyHhx2BBLUo4g4SptHFySTBwlpRWBnSjZPOhmN74JcpTLB4J5f4iEeA7
2QytZfADckG4wVkhH3C2EJUmRtFIBVirwDn39GXkSGlnvnMgF3uLZ6zNAgMBAAGj
YTBfMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDAjAMBgNVHRMB
Af8EAjAAMB0GA1UdDgQWBBTREl2hW54lkQBDeVCcd2f2VSlB1DALBgNVHREEBDAC
ggAwDQYJKoZIhvcNAQELBQADggEBABpZjuIKTq8pCaX8dMEGPWtAykgLsTcD2jYr
L0/TCrqmuaaliUa42jQTt2OVsVP/L8ofFunj/KjpQU0bvKJPLMRKtmxbhXuQCQi1
qCRkp8o93mHvEz3mTUN+D1cfQ2fpsBENLnpS0F4G/JyY2Vrh19/X8+mImMEK5eOy
o0BMby7byUj98WmcUvNCiXbC6F45QTmkwEhMqWns0JZQY+/XeDhEcg+lJvz9Eyo2
aGgPsye1o3DpyXnyfJWAWMhOz7cikS5X2adesbgI86PhEHBXPIJ1v13ZdfCExmdd
M1fLPhLyR54fGaY+7/X8P9AZzPefAkwizeXwe9ii6/a08vWoiE4=
-----END CERTIFICATE-----
```

<!--
Non-PEM content may appear before or after the CERTIFICATE PEM blocks and is unvalidated,
to allow for explanatory text as described in [section 5.2 of RFC7468](https://www.rfc-editor.org/rfc/rfc7468#section-5.2).

When encoded in JSON or YAML, this field is base-64 encoded.
A CertificateSigningRequest containing the example certificate above would look like this:
-->
非 PEM 内容可能会出现在证书 PEM 块前后的位置，且未经验证，
以允许使用 [RFC7468 第 5.2 节](https://www.rfc-editor.org/rfc/rfc7468#section-5.2)中描述的解释性文本。

当使用 JSON 或 YAML 格式时，此字段是 base-64 编码。
包含上述示例证书的 CertificateSigningRequest 如下所示：

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JS..."
```

<!--
## Approval or rejection  {#approval-rejection}

Before a [signer](#signers) issues a certificate based on a CertificateSigningRequest,
the signer typically checks that the issuance for that CSR has been _approved_.

### Control plane automated approval {#approval-rejection-control-plane}

The kube-controller-manager ships with a built-in approver for certificates with
a signerName of `kubernetes.io/kube-apiserver-client-kubelet` that delegates various
permissions on CSRs for node credentials to authorization.
The kube-controller-manager POSTs SubjectAccessReview resources to the API server
in order to check authorization for certificate approval.
-->
## 批准和驳回 {#approval-rejection}

[签名者](#signers)基于 CertificateSigningRequest 签发证书之前，
通常会检查 CSR 的签发是否已被**批准**。

### 控制平面的自动化批准 {#approval-rejection-control-plane}

kube-controller-manager 内建了一个证书批准者，其 signerName 为
`kubernetes.io/kube-apiserver-client-kubelet`，
该批准者将 CSR 上用于节点凭据的各种权限委托给权威认证机构。
kube-controller-manager 将 SubjectAccessReview 资源发送（POST）到 API 服务器，
以便检验批准证书的授权。

<!--
### Approval or rejection using `kubectl` {#approval-rejection-kubectl}

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands.

To approve a CSR with kubectl:
-->
### 使用 `kubectl` 批准或驳回   {#approval-rejection-kubectl}

Kubernetes 管理员（拥有足够的权限）可以手工批准（或驳回）CertificateSigningRequest，
此操作使用 `kubectl certificate approve` 和 `kubectl certificate deny` 命令实现。

使用 kubectl 批准一个 CSR：

```shell
kubectl certificate approve <certificate-signing-request-name>
```

<!--
Likewise, to deny a CSR:
-->
同样地，驳回一个 CSR：

```shell
kubectl certificate deny <certificate-signing-request-name>
```

<!--
### Approval or rejection using the Kubernetes API {#approval-rejection-api-client}

Users of the REST API can approve CSRs by submitting an UPDATE request to the `approval`
subresource of the CSR to be approved. For example, you could write an
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}} that watches for a particular
kind of CSR and then sends an UPDATE to approve them.

When you make an approval or rejection request, set either the `Approved` or `Denied`
status condition based on the state you determine:

For `Approved` CSRs:
-->
### 使用 Kubernetes API 批准或驳回  {#approval-rejection-api-client}

REST API 的用户可以通过向待批准的 CSR 的 `approval` 子资源提交更新请求来批准 CSR。
例如，你可以编写一个
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}}
来监视特定类型的 CSR，然后发送一个更新来批准它。

当你发出批准或驳回的指令时，根据你期望的状态来选择设置 `Approved` 或 `Denied`。

批准（`Approved`）的 CSR：

<!--
You can set this to any string
-->
```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Approved by my custom approver controller
    reason: ApprovedByMyPolicy # 你可以将此字段设置为任意字符串
    type: Approved
```

<!--
For `Denied` CSRs:
-->
驳回（`Denied`）的 CSR：

<!--
You can set this to any string
-->
```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Denied by my custom approver controller
    reason: DeniedByMyPolicy # 你可以将此字段设置为任意字符串
    type: Denied
```

<!--
It's usual to set `status.conditions.reason` to a machine-friendly reason
code using TitleCase; this is a convention but you can set it to anything
you like. If you want to add a note for human consumption, use the
`status.conditions.message` field.
-->
`status.conditions.reason` 字段通常设置为一个首字母大写的对机器友好的原因码；
这是一个命名约定，但你也可以随你的个人喜好设置。
如果你想添加一个供人类使用的注释，那就用 `status.conditions.message` 字段。

<!--
## Cluster trust bundles {#cluster-trust-bundles}
-->
## 集群信任包   {#cluster-trust-bundles}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< note >}}
<!--
In Kubernetes {{< skew currentVersion >}}, you must enable the `ClusterTrustBundle`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
_and_ the `certificates.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} in order to use
this API.
-->
在 Kubernetes {{< skew currentVersion >}} 中，如果想要使用此 API，
必须同时启用 `ClusterTrustBundle` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
**以及** `certificates.k8s.io/v1alpha1` {{< glossary_tooltip text="API 组" term_id="api-group" >}}。
{{< /note >}}

<!--
A ClusterTrustBundles is a cluster-scoped object for distributing X.509 trust
anchors (root certificates) to workloads within the cluster. They're designed
to work well with the [signer](#signers) concept from CertificateSigningRequests.

ClusterTrustBundles can be used in two modes:
[signer-linked](#ctb-signer-linked) and [signer-unlinked](#ctb-signer-unlinked).
-->
ClusterTrustBundle 是一个作用域为集群的对象，向集群内的对象分发 X.509 信任锚点（根证书）。
此对象旨在与 CertificateSigningRequest 中的[签名者](#signers)概念协同工作。

ClusterTrustBundle 可以使用两种模式：
[签名者关联](#ctb-signer-linked)和[签名者未关联](#ctb-signer-unlinked)。

<!--
### Common properties and validation {#ctb-common}

All ClusterTrustBundle objects have strong validation on the contents of their
`trustBundle` field. That field must contain one or more X.509 certificates,
DER-serialized, each wrapped in a PEM `CERTIFICATE` block. The certificates
must parse as valid X.509 certificates.

Esoteric PEM features like inter-block data and intra-block headers are either
rejected during object validation, or can be ignored by consumers of the object.
Additionally, consumers are allowed to reorder the certificates in
the bundle with their own arbitrary but stable ordering.
-->
### 常见属性和验证 {#ctb-common}

所有 ClusterTrustBundle 对象都对其 `trustBundle` 字段的内容进行强大的验证。
该字段必须包含一个或多个经 DER 序列化的 X.509 证书，每个证书都封装在 PEM `CERTIFICATE` 块中，
这些证书必须解析为有效的 X.509 证书。

诸如块间数据和块内标头之类的 PEM 特性在对象验证期间要么被拒绝，要么可能被对象的消费者忽略。
此外，消费者被允许使用自己的任意但稳定的排序方式重新排序 bundle 中的证书。

<!--
ClusterTrustBundle objects should be considered world-readable within the
cluster. If your cluster uses [RBAC](/docs/reference/access-authn-authz/rbac/)
authorization, all ServiceAccounts have a default grant that allows them to
**get**, **list**, and **watch** all ClusterTrustBundle objects.
If you use your own authorization mechanism and you have enabled
ClusterTrustBundles in your cluster, you should set up an equivalent rule to
make these objects public within the cluster, so that they work as intended.

If you do not have permission to list cluster trust bundles by default in your
cluster, you can impersonate a service account you have access to in order to
see available ClusterTrustBundles:
-->
ClusterTrustBundle 对象应该在集群内被视为全局可读的。
如果集群使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 鉴权，
则所有 ServiceAccount 都具有默认授权，允许它们 **get**、**list** 和 **watch**
所有 ClusterTrustBundle 对象。如果你使用自己的鉴权机制，并且在集群中启用了
ClusterTrustBundle，则应设置等效规则以使这些对象在集群内公开，使这些对象按预期工作。

如果你没有默认在集群中列出集群信任包的权限，则可以扮演具有访问权限的 ServiceAccount，
以查看可用的 ClusterTrustBundle：

```bash
kubectl get clustertrustbundles --as='system:serviceaccount:mynamespace:default'
```

<!--
### Signer-linked ClusterTrustBundles {#ctb-signer-linked}

Signer-linked ClusterTrustBundles are associated with a _signer name_, like this:
-->
### 签名者关联的 ClusterTrustBundle {#ctb-signer-linked}

签名者关联的 ClusterTrustBundle 与**签名者名称**关联，例如：

```yaml
apiVersion: certificates.k8s.io/v1alpha1
kind: ClusterTrustBundle
metadata:
  name: example.com:mysigner:foo
spec:
  signerName: example.com/mysigner
  trustBundle: "<... PEM data ...>"
```

<!--
These ClusterTrustBundles are intended to be maintained by a signer-specific
controller in the cluster, so they have several security features:
-->
这些 ClusterTrustBundle 预期由集群中的特定签名者控制器维护，因此它们具有多个安全特性：

<!--
* To create or update a signer-linked ClusterTrustBundle, you must be permitted
  to **attest** on the signer (custom authorization verb `attest`,
  API group `certificates.k8s.io`; resource path `signers`). You can configure
  authorization for the specific resource name
  `<signerNameDomain>/<signerNamePath>` or match a pattern such as
  `<signerNameDomain>/*`.
* Signer-linked ClusterTrustBundles **must** be named with a prefix derived from
  their `spec.signerName` field. Slashes (`/`) are replaced with colons (`:`),
  and a final colon is appended. This is followed by an arbitrary name.  For
  example, the signer `example.com/mysigner` can be linked to a
  ClusterTrustBundle `example.com:mysigner:<arbitrary-name>`.
-->
* 要创建或更新与一个签名者关联的 ClusterTrustBundle，你必须获准**证明**该签名者
  （自定义鉴权动词 `attest` API 组 `certificates.k8s.io`；资源路径 `signers`）。
  你可以为特定资源名称 `<signerNameDomain>/<signerNamePath>` 或匹配 `<signerNameDomain>/*` 等模式来配置鉴权。
* 与签名者关联的 ClusterTrustBundle **必须**使用从其 `spec.signerName` 字段派生的前缀命名。
  斜杠（`/`）被替换为英文冒号（`:`），最后追加一个英文冒号，后跟任意名称。
  例如，签名者 `example.com/mysigner` 可以关联到 ClusterTrustBundle `example.com:mysigner:<arbitrary-name>`。

<!--
Signer-linked ClusterTrustBundles will typically be consumed in workloads
by a combination of a
[field selector](/docs/concepts/overview/working-with-objects/field-selectors/) on the signer name, and a separate
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
-->
与签名者关联的 ClusterTrustBundle 通常通过组合签名者名称有关的
[字段选择算符](/zh-cn/docs/concepts/overview/working-with-objects/field-selectors/)
或单独使用[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)在工作负载中被消耗。

<!--
### Signer-unlinked ClusterTrustBundles {#ctb-signer-unlinked}

Signer-unlinked ClusterTrustBundles have an empty `spec.signerName` field, like this:
-->
### 签名者未关联的 ClusterTrustBundle   {#ctb-signer-unlinked}

签名者未关联的 ClusterTrustBundle 具有空白的 `spec.signerName` 字段，例如：

<!--
no signerName specified, so the field is blank
-->
```yaml
apiVersion: certificates.k8s.io/v1alpha1
kind: ClusterTrustBundle
metadata:
  name: foo
spec:
  # 未指定 signerName 所以该字段留空
  trustBundle: "<... PEM data ...>"
```

<!--
They are primarily intended for cluster configuration use cases.
Each signer-unlinked ClusterTrustBundle is an independent object, in contrast to the
customary grouping behavior of signer-linked ClusterTrustBundles.

Signer-unlinked ClusterTrustBundles have no `attest` verb requirement.
Instead, you control access to them directly using the usual mechanisms,
such as role-based access control.

To distinguish them from signer-linked ClusterTrustBundles, the names of
signer-unlinked ClusterTrustBundles **must not** contain a colon (`:`).
-->
它们主要用于集群配置场景。每个与签名者未关联的 ClusterTrustBundle 都是一个独立的对象，
与签名者关联的 ClusterTrustBundle 的惯常分组行为形成了对比。

与签名者为关联的 ClusterTrustBundle 没有 `attest` 动词要求。
相反，你可以使用通常的机制（如基于角色的访问控制）直接控制对它们的访问。

为了将它们与与签名者关联的 ClusterTrustBundle 区分开来，与签名者未关联的
ClusterTrustBundle 的名称**必须不**包含英文冒号（`:`）。

<!--
### Accessing ClusterTrustBundles from pods {#ctb-projection}
-->
### 从 Pod 访问 ClusterTrustBundle {#ctb-projection}

{{<feature-state for_k8s_version="v1.29" state="alpha" >}}

<!--
The contents of ClusterTrustBundles can be injected into the container filesystem, similar to ConfigMaps and Secrets.
See the [clusterTrustBundle projected volume source](/docs/concepts/storage/projected-volumes#clustertrustbundle) for more details.
-->
ClusterTrustBundle 的内容可以注入到容器文件系统，这与 ConfigMap 和 Secret 类似。
更多细节参阅 [ClusterTrustBundle 投射卷源](/zh-cn/docs/concepts/storage/projected-volumes#clustertrustbundle)。

<!-- TODO this should become a task page -->

<!--
## How to issue a certificate for a user {#normal-user}

A few steps are required in order to get a normal user to be able to
authenticate and invoke an API. First, this user must have a certificate issued
by the Kubernetes cluster, and then present that certificate to the Kubernetes API.
-->
## 如何为用户签发证书   {#normal-user}

为了让普通用户能够通过认证并调用 API，需要执行几个步骤。
首先，该用户必须拥有 Kubernetes 集群签发的证书，
然后将该证书提供给 Kubernetes API。

<!--
### Create private key

The following scripts show how to generate PKI private key and CSR. It is
important to set CN and O attribute of the CSR. CN is the name of the user and
O is the group that this user will belong to. You can refer to
[RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.
-->
### 创建私钥 {#create-private-key}

下面的脚本展示了如何生成 PKI 私钥和 CSR。
设置 CSR 的 CN 和 O 属性很重要。CN 是用户名，O 是该用户归属的组。
你可以参考 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 了解标准组的信息。

```shell
openssl genrsa -out myuser.key 2048
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

<!--
### Create a CertificateSigningRequest {#create-certificatessigningrequest}

Create a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
and submit it to a Kubernetes Cluster via kubectl. Below is a script to generate the
CertificateSigningRequest. a CertificateSigningRequest and submit it to a Kubernetes Cluster via kubectl. Below is a script to generate the CertificateSigningRequest.
-->
### 创建 CertificateSigningRequest {#create-certificatesigningrequest}

创建一个 [CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)，
并通过 kubectl 将其提交到 Kubernetes 集群。
下面是生成 CertificateSigningRequest 的脚本。

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth
EOF
```

<!--
Some points to note:

- `usages` has to be '`client auth`'
- `expirationSeconds` could be made longer (i.e. `864000` for ten days) or shorter (i.e. `3600` for one hour)
- `request` is the base64 encoded value of the CSR file content.
  You can get the content using this command: 
-->
需要注意的几点：

- `usage` 字段必须是 '`client auth`'
- `expirationSeconds` 可以设置为更长（例如 `864000` 是十天）或者更短（例如 `3600` 是一个小时）
- `request` 字段是 CSR 文件内容的 base64 编码值，
  要得到该值，可以执行命令：

  ```shell
  cat myuser.csr | base64 | tr -d "\n"
  ```

<!--
### Approve the CertificateSigningRequest {#approve-certificate-signing-request}

Use kubectl to create a CSR and approve it.

Get the list of CSRs:
-->
### 批准 CertificateSigningRequest    {#approve-certificate-signing-request}

使用 kubectl 创建 CSR 并批准。

获取 CSR 列表：

```shell
kubectl get csr
```

<!--
Approve the CSR:
-->
批准 CSR：

```shell
kubectl certificate approve myuser
```

<!--
### Get the certificate

Retrieve the certificate from the CSR:
-->
### 取得证书 {#get-the-certificate}

从 CSR 取得证书：

```shell
kubectl get csr/myuser -o yaml
```

<!--
The certificate value is in Base64-encoded format under `status.certificate`.

Export the issued certificate from the CertificateSigningRequest.
-->
证书的内容使用 base64 编码，存放在字段 `status.certificate`。

从 CertificateSigningRequest 导出颁发的证书：

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

<!--
### Create Role and RoleBinding

With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:
-->
### 创建角色和角色绑定 {#create-role-and-role-binding}

创建了证书之后，为了让这个用户能访问 Kubernetes 集群资源，现在就要创建
Role 和 RoleBinding 了。

下面是为这个新用户创建 Role 的示例命令：

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

<!--
This is a sample command to create a RoleBinding for this new user:
-->
下面是为这个新用户创建 RoleBinding 的示例命令：

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

<!--
### Add to kubeconfig

The last step is to add this user into the kubeconfig file.

First, you need to add new credentials:
-->
### 添加到 kubeconfig   {#add-to-kubeconfig}

最后一步是将这个用户添加到 kubeconfig 文件。

首先，你需要添加新的凭据：

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true
```

<!--
Then, you need to add the context:
-->
然后，你需要添加上下文：

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

<!--
To test it, change the context to `myuser`:
-->
来测试一下，把上下文切换为 `myuser`：

```shell
kubectl config use-context myuser
```

## {{% heading "whatsnext" %}}

<!--
* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* View the source code for the kube-controller-manager built in
  [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* View the source code for the kube-controller-manager built in
  [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Read about the ClusterTrustBundle API:
  * {{< page-api-reference kind="ClusterTrustBundle" >}}
-->
* 参阅[管理集群中的 TLS 认证](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* 查看 kube-controller-manager 中[签名者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)部分的源代码
* 查看 kube-controller-manager 中[批准者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)部分的源代码
* 有关 X.509 本身的详细信息，请参阅 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 第 3.1 节
* 有关 PKCS#10 证书签名请求语法的信息，请参阅 [RFC 2986](https://tools.ietf.org/html/rfc2986)
* 阅读 ClusterTrustBundle 相关内容：
  * {{< page-api-reference kind="ClusterTrustBundle" >}}
