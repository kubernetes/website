---
title: 證書和證書籤名請求
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
Kubernetes 證書和信任包（trust bundle）API 可以通過爲 Kubernetes API 的客戶端提供編程介面，
實現 [X.509](https://www.itu.int/rec/T-REC-X.509) 憑據的自動化製備，
從而請求並獲取證書頒發機構（CA）發佈的 X.509 {{< glossary_tooltip term_id="certificate" text="證書" >}}。

此外，Kubernetes 還對分發[信任包](#cluster-trust-bundles)提供了實驗性（Alpha）支持。

<!-- body -->

<!--
## Certificate signing requests
-->
## 證書籤名請求   {#certificate-signing-requests}

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
A [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
(CSR) resource is used to request that a certificate be signed
by a denoted signer, after which the request may be approved or denied before
finally being signed.
-->
[CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
（CSR）資源用來向指定的簽名者申請證書籤名，
在最終簽名之前，申請可能被批准，也可能被拒絕。

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
### 請求籤名流程 {#request-signing-process}

CertificateSigningRequest 資源類型允許客戶端基於簽名請求申請發放 X.509 證書。
CertificateSigningRequest 對象在 `spec.request` 字段中包含一個 PEM 編碼的 PKCS#10 簽名請求。
CertificateSigningRequest 使用 `spec.signerName` 字段標示簽名者（請求的接收方）。
注意，`spec.signerName` 在 `certificates.k8s.io/v1` 之後的 API 版本是必填項。
在 Kubernetes v1.22 及更高版本中，客戶可以設置 `spec.expirationSeconds`
字段（可選）來爲頒發的證書設定一個特定的有效期。該字段的最小有效值是 `600`，也就是 10 分鐘。

<!--
Once created, a CertificateSigningRequest must be approved before it can be signed.
Depending on the signer selected, a CertificateSigningRequest may be automatically approved
by a {{< glossary_tooltip text="controller" term_id="controller" >}}.
Otherwise, a CertificateSigningRequest must be manually approved either via the REST API (or client-go)
or by running `kubectl certificate approve`. Likewise, a CertificateSigningRequest may also be denied,
which tells the configured signer that it must not sign the request.
-->
創建完成的 CertificateSigningRequest，要先通過批准，然後才能簽名。
根據所選的簽名者，CertificateSigningRequest
可能會被{{< glossary_tooltip text="控制器" term_id="controller" >}}自動批准。
否則，就必須人工批准，
人工批准可以使用 REST API（或 client-go），也可以執行 `kubectl certificate approve` 命令。
同樣，CertificateSigningRequest 也可能被駁回，
這就相當於通知了指定的簽名者，這個證書不能簽名。

<!--
For certificates that have been approved, the next step is signing. The relevant signing controller
first validates that the signing conditions are met and then creates a certificate.
The signing controller then updates the CertificateSigningRequest, storing the new certificate into
the `status.certificate` field of the existing CertificateSigningRequest object. The
`status.certificate` field is either empty or contains a X.509 certificate, encoded in PEM format.
The CertificateSigningRequest `status.certificate` field is empty until the signer does this.
-->
對於已批准的證書，下一步是簽名。
對應的簽名控制器首先驗證簽名條件是否滿足，然後才創建證書。
簽名控制器然後更新 CertificateSigningRequest，
將新證書保存到現有 CertificateSigningRequest 對象的 `status.certificate` 字段中。
此時，字段 `status.certificate` 要麼爲空，要麼包含一個用 PEM 編碼的 X.509 證書。
直到簽名完成前，CertificateSigningRequest 的字段 `status.certificate` 都爲空。

<!--
Once the `status.certificate` field has been populated, the request has been completed and clients can now
fetch the signed certificate PEM data from the CertificateSigningRequest resource.
The signers can instead deny certificate signing if the approval conditions are not met.
-->
一旦 `status.certificate` 字段完成填充，請求既算完成，
客戶端現在可以從 CertificateSigningRequest 資源中獲取已簽名的證書的 PEM 資料。
當然如果不滿足簽名條件，簽名者可以拒籤。

<!--
In order to reduce the number of old CertificateSigningRequest resources left in a cluster, a garbage collection
controller runs periodically. The garbage collection removes CertificateSigningRequests that have not changed
state for some duration:
-->
爲了減少叢集中遺留的過時的 CertificateSigningRequest 資源的數量，
一個垃圾收集控制器將會週期性地運行。
此垃圾收集器會清除在一段時間內沒有改變過狀態的 CertificateSigningRequest：

<!--
* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Failed requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 24 hours
* All requests: automatically deleted after the issued certificate has expired
-->
* 已批准的請求：1 小時後自動刪除
* 已拒絕的請求：1 小時後自動刪除
* 已失敗的請求：1 小時後自動刪除
* 掛起的請求：24 小時後自動刪除
* 所有請求：在頒發的證書過期後自動刪除

<!--
### Certificate signing authorization {#authorization}

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:

* Verbs: `create`, `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`

For example:
-->
### 證書籤名鑑權   {#authorization}

授權創建 CertificateSigningRequest 和檢索 CertificateSigningRequest：

* verbs（動詞）：`create`、`get`、`list`、`watch`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`certificatesigningrequests`

例如：

{{< code_sample file="access/certificate-signing-request/clusterrole-create.yaml" >}}

<!--
To allow approving a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: `approve`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

For example:
-->
授權批准 CertificateSigningRequest：

* verbs（動詞）：`get`、`list`、`watch`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`certificatesigningrequests`
* verbs（動詞）：`update`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`certificatesigningrequests/approval`
* verbs（動詞）：`approve`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`signers`，
  resourceName（資源名稱）：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

例如：

{{< code_sample file="access/certificate-signing-request/clusterrole-approve.yaml" >}}

<!--
To allow signing a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: `sign`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`
-->
授權簽名 CertificateSigningRequest：

* verbs（動詞）：`get`、`list`、`watch`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`certificatesigningrequests`
* verbs（動詞）：`update`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`certificatesigningrequests/status`
* verbs（動詞）：`sign`，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`signers`，
  resourceName（資源名稱）：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

{{< code_sample file="access/certificate-signing-request/clusterrole-sign.yaml" >}}

<!--
## Signers

Signers abstractly represent the entity or entities that might sign, or have
signed, a security certificate.

Any signer that is made available for outside a particular cluster should provide information
about how the signer works, so that consumers can understand what that means for CertificateSigningRequests
and (if enabled) [ClusterTrustBundles](#cluster-trust-bundles).
This includes:
-->
## 簽名者 {#signers}

簽名者抽象地代表可能簽署或已簽署安全證書的一個或多個實體。

任何要在特定叢集以外提供的簽名者都應該提供關於簽名者工作方式的資訊，
以便消費者可以理解這對於 CertificateSigningRequest 和（如果啓用的）
[ClusterTrustBundle](#cluster-trust-bundles) 的意義。此類資訊包括：

<!--
1. **Trust distribution**: how trust anchors (CA certificates or certificate bundles) are distributed.
1. **Permitted subjects**: any restrictions on and behavior when a disallowed subject is requested.
1. **Permitted x509 extensions**: including IP subjectAltNames, DNS subjectAltNames,
   Email subjectAltNames, URI subjectAltNames etc, and behavior when a disallowed extension is requested.
1. **Permitted key usages / extended key usages**: any restrictions on and behavior
   when usages different than the signer-determined usages are specified in the CSR.
1. **Expiration/certificate lifetime**: whether it is fixed by the signer, configurable by the admin, determined by the CSR `spec.expirationSeconds` field, etc
   and the behavior when the signer-determined expiration is different from the CSR `spec.expirationSeconds` field.
1. **CA bit allowed/disallowed**: and behavior if a CSR contains a request for a CA certificate when the signer does not permit it.
-->
1. **信任分發**：信任錨點（CA 證書或證書包）是如何分發的。
1. **許可的主體**：當一個受限制的主體（subject）發送請求時，相應的限制和應對手段。
1. **許可的 x509 擴展**：包括 IP subjectAltNames、DNS subjectAltNames、
   Email subjectAltNames、URI subjectAltNames 等，請求一個受限制的擴展項時的應對手段。
1. **許可的密鑰用途/擴展的密鑰用途**：當用途和簽名者在 CSR 中指定的用途不同時，
   相應的限制和應對手段。
1. **過期時間/證書有效期**：過期時間由簽名者確定、由管理員設定、還是由 CSR
   `spec.expirationSeconds` 字段指定等，以及簽名者決定的過期時間與 CSR
   `spec.expirationSeconds` 字段不同時的應對手段。
1. **允許/不允許 CA 位**：當 CSR 包含一個簽名者並不允許的 CA 證書的請求時，相應的應對手段。

<!--
Commonly, the `status.certificate` field of a CertificateSigningRequest contains a
single PEM-encoded X.509 certificate once the CSR is approved and the certificate is issued.
Some signers store multiple certificates into the `status.certificate` field. In
that case, the documentation for the signer should specify the meaning of
additional certificates; for example, this might be the certificate plus
intermediates to be presented during TLS handshakes.
-->
一般來說，當 CSR 被批准通過，且證書被簽名後，CertificateSigningRequest
的 `status.certificate` 字段將包含一個 PEM 編碼的 X.509 證書。
有些簽名者在 `status.certificate` 字段中儲存多個證書。
在這種情況下，簽名者的說明文檔應當指明附加證書的含義。
例如，這是要在 TLS 握手時提供的證書和中繼證書。

<!--
If you want to make the _trust anchor_ (root certificate) available, this should be done
separately from a CertificateSigningRequest and its `status.certificate` field. For example,
you could use a ClusterTrustBundle.
-->
如果要讓**信任錨點**（根證書）可用，應該將其與 CertificateSigningRequest 及其 `status.certificate`
字段分開處理。例如，你可以使用 ClusterTrustBundle。

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
PKCS#10 簽名請求格式並沒有一種標準的方法去設置證書的過期時間或者生命期，
因此，證書的過期時間或者生命期必須通過 CSR 對象的 `spec.expirationSeconds` 字段來設置。
當 `spec.expirationSeconds` 沒有被指定時，內置的簽名者預設使用 `ClusterSigningDuration` 設定選項
（kube-controller-manager 的命令列選項 `--cluster-signing-duration`），該選項的預設值設爲 1 年。
當 `spec.expirationSeconds` 被指定時，`spec.expirationSeconds` 和 `ClusterSigningDuration`
中的最小值會被使用。

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的。
早期的 Kubernetes 版本並不認識該字段。
v1.22 版本之前的 Kubernetes API 伺服器會在創建對象的時候忽略該字段。
{{< /note >}}

<!--
### Kubernetes signers

Kubernetes provides built-in signers that each have a well-known `signerName`:
-->
### Kubernetes 簽名者 {#kubernetes-signers}

Kubernetes 提供了內置的簽名者，每個簽名者都有一個衆所周知的 `signerName`：

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
1. `kubernetes.io/kube-apiserver-client`：簽名的證書將被 API 伺服器視爲客戶端證書，
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准它。
   1. 信任分發：簽名的證書將被 API 伺服器視爲客戶端證書，CA 證書包不通過任何其他方式分發。
   1. 許可的主體：沒有主體限制，但審覈人和簽名者可以選擇不批准或不簽署。
      某些主體，比如叢集管理員級別的使用者或組因部署和安裝方式不同而不同，
      所以批准和簽署之前需要進行額外仔細審查。
      用來限制 `system:masters` 的 CertificateSubjectRestriction 准入插件預設處於啓用狀態，
      但它通常不是叢集中唯一的叢集管理員主體。
   1. 許可的 x509 擴展：允許 subjectAltName 和 key usage 擴展，棄用其他擴展。
   1. 許可的密鑰用途：必須包含 `["client auth"]`，但不能包含
      `["digital signature", "key encipherment", "client auth"]` 之外的鍵。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設置爲 `--cluster-signing-duration` 選項和 CSR 對象的 `spec.expirationSeconds` 字段（如有設置該字段）中的最小值。
   1. 允許/不允許 CA 位：不允許。

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
2. `kubernetes.io/kube-apiserver-client-kubelet`：簽名的證書將被 kube-apiserver 視爲客戶端證書。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 可以自動批准它。

   1. 信任分發：簽名的證書將被 API 伺服器視爲客戶端證書，CA 證書包不通過任何其他方式分發。
   1. 許可的主體：組織名必須是 `["system:nodes"]`，通用名稱爲 "`system:node:${NODE_NAME}`" 開頭。
   1. 許可的 x509 擴展：允許 key usage 擴展，禁用 subjectAltName 擴展，並刪除其他擴展。
   1. 許可的密鑰用途：`["key encipherment", "digital signature", "client auth"]`
      或 `["digital signature", "client auth"]`。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設置爲 `--cluster-signing-duration` 選項和 CSR 對象的 `spec.expirationSeconds`
      字段（如有設置該字段）中的最小值。
   1. 允許/不允許 CA 位：不允許。

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
3. `kubernetes.io/kubelet-serving`：簽名服務端證書，該服務證書被 API 伺服器視爲有效的 kubelet 服務端證書，
   但沒有其他保證。{{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准它。
   1. 信任分發：簽名的證書必須被 kube-apiserver 認可，可有效的中止 kubelet 連接，CA 證書包不通過任何其他方式分發。
   1. 許可的主體：組織名必須是 `["system:nodes"]`，通用名稱爲 "`system:node:${NODE_NAME}`" 開頭
   1. 許可的 x509 擴展：允許 key usage、DNSName/IPAddress subjectAltName 等擴展，
      禁止 EmailAddress、URI subjectAltName 等擴展，並丟棄其他擴展。
      至少有一個 DNS 或 IP 的 SubjectAltName 存在。
   1. 許可的密鑰用途：`["key encipherment", "digital signature", "server auth"]`
      或 `["digital signature", "server auth"]`。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設置爲 `--cluster-signing-duration` 選項和 CSR 對象的 `spec.expirationSeconds`
      字段（如有設置該字段）中的最小值。
   1. 允許/不允許 CA 位：不允許。

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
4. `kubernetes.io/legacy-unknown`：不保證信任。Kubernetes 的一些第三方發行版可能會使用它簽署的客戶端證書。
   穩定版的 CertificateSigningRequest API（`certificates.k8s.io/v1` 以及之後的版本）不允許將
   `signerName` 設置爲 `kubernetes.io/legacy-unknown`。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准這類請求。
   1. 信任分發：沒有。這個簽名者在 Kubernetes 叢集中沒有標準的信任或分發。
   1. 許可的主體：全部。
   1. 許可的 x509 擴展：允許 subjectAltName 和 key usage 等擴展，並棄用其他擴展。
   1. 許可的密鑰用途：全部。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設置爲 `--cluster-signing-duration` 選項和 CSR 對象的 `spec.expirationSeconds`
      字段（如有設置該字段）中的最小值。
   1. 允許/不允許 CA 位 - 不允許。

<!--
The kube-controller-manager implements [control plane signing](#signer-control-plane) for each of the built in
signers. Failures for all of these are only reported in kube-controller-manager logs.
-->
kube-controller-manager 爲每個內置簽名者實現了[控制平面簽名](#signer-control-plane)。
注意：所有這些故障僅在 kube-controller-manager 日誌中報告。

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的，早期的 Kubernetes 版本並不認識該字段，
v1.22 版本之前的 Kubernetes API 伺服器會在創建對象的時候忽略該字段。
{{< /note >}}

<!--
Distribution of trust happens out of band for these signers. Any trust outside of those described above are strictly
coincidental. For instance, some distributions may honor `kubernetes.io/legacy-unknown` as client certificates for the
kube-apiserver, but this is not a standard.
None of these usages are related to ServiceAccount token secrets `.data[ca.crt]` in any way. That CA bundle is only
guaranteed to verify a connection to the API server using the default service (`kubernetes.default.svc`).
-->
對於這些簽名者，信任的分發發生在帶外（out of band）。上述信任之外的任何信任都是完全巧合的。
例如，一些發行版可能會將 `kubernetes.io/legacy-unknown` 作爲 kube-apiserver 的客戶端證書，
但這個做法並不標準。
這些用途都沒有以任何方式涉及到 ServiceAccount 中的 Secrets `.data[ca.crt]`。
此 CA 證書包只保證使用預設的服務（`kubernetes.default.svc`）來驗證到 API 伺服器的連接。

<!--
## Signing

### Control plane signer {#signer-control-plane}

The Kubernetes control plane implements each of the
[Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers),
as part of the kube-controller-manager.
-->
## 簽名   {#signing}

### 控制平面簽名者    {#signer-control-plane}

Kubernetes 控制平面實現了每一個
[Kubernetes 簽名者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)，
每個簽名者的實現都是 kube-controller-manager 的一部分。

{{< note >}}
<!--
Prior to Kubernetes v1.18, the kube-controller-manager would sign any CSRs that
were marked as approved.
-->
在 Kubernetes v1.18 之前，
kube-controller-manager 簽名所有標記爲 approved 的 CSR。
{{< /note >}}

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22.
Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 字段是在 Kubernetes v1.22 中加入的，早期的 Kubernetes 版本並不認識該字段，
v1.22 版本之前的 Kubernetes API 伺服器會在創建對象的時候忽略該字段。
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
### 基於 API 的簽名者   {#signer-api}

REST API 的使用者可以通過向待簽名的 CSR 的 `status` 子資源提交更新請求來對 CSR 進行簽名。

作爲這個請求的一部分，`status.certificate` 字段應設置爲已簽名的證書。
此字段可包含一個或多個 PEM 編碼的證書。

所有的 PEM 塊必須具備 "CERTIFICATE" 標籤，且不包含檔案頭，且編碼的資料必須是
[RFC5280 第 4 節](https://tools.ietf.org/html/rfc5280#section-4.1)
中描述的 BER 編碼的 ASN.1 證書結構。

證書內容示例：

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
非 PEM 內容可能會出現在證書 PEM 塊前後的位置，且未經驗證，
以允許使用 [RFC7468 第 5.2 節](https://www.rfc-editor.org/rfc/rfc7468#section-5.2)中描述的解釋性文本。

當使用 JSON 或 YAML 格式時，此字段是 base-64 編碼。
包含上述示例證書的 CertificateSigningRequest 如下所示：

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
## 批准和駁回 {#approval-rejection}

[簽名者](#signers)基於 CertificateSigningRequest 簽發證書之前，
通常會檢查 CSR 的簽發是否已被**批准**。

### 控制平面的自動化批准 {#approval-rejection-control-plane}

kube-controller-manager 內建了一個證書批准者，其 signerName 爲
`kubernetes.io/kube-apiserver-client-kubelet`，
該批准者將 CSR 上用於節點憑據的各種權限委託給權威認證機構。
kube-controller-manager 將 SubjectAccessReview 資源發送（POST）到 API 伺服器，
以便檢驗批准證書的授權。

<!--
### Approval or rejection using `kubectl` {#approval-rejection-kubectl}

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands.

To approve a CSR with kubectl:
-->
### 使用 `kubectl` 批准或駁回   {#approval-rejection-kubectl}

Kubernetes 管理員（擁有足夠的權限）可以手工批准（或駁回）CertificateSigningRequest，
此操作使用 `kubectl certificate approve` 和 `kubectl certificate deny` 命令實現。

使用 kubectl 批准一個 CSR：

```shell
kubectl certificate approve <certificate-signing-request-name>
```

<!--
Likewise, to deny a CSR:
-->
同樣地，駁回一個 CSR：

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
### 使用 Kubernetes API 批准或駁回  {#approval-rejection-api-client}

REST API 的使用者可以通過向待批准的 CSR 的 `approval` 子資源提交更新請求來批准 CSR。
例如，你可以編寫一個
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}}
來監視特定類型的 CSR，然後發送一個更新來批准它。

當你發出批准或駁回的指令時，根據你期望的狀態來選擇設置 `Approved` 或 `Denied`。

批准（`Approved`）的 CSR：

<!--
```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Approved by my custom approver controller
    reason: ApprovedByMyPolicy # You can set this to any string
    type: Approved
```
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
    reason: ApprovedByMyPolicy # 你可以將此字段設置爲任意字符串
    type: Approved
```

<!--
For `Denied` CSRs:
-->
駁回（`Denied`）的 CSR：

<!--
```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Denied by my custom approver controller
    reason: DeniedByMyPolicy # You can set this to any string
    type: Denied
```
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
    reason: DeniedByMyPolicy # 你可以將此字段設置爲任意字符串
    type: Denied
```

<!--
It's usual to set `status.conditions.reason` to a machine-friendly reason
code using TitleCase; this is a convention but you can set it to anything
you like. If you want to add a note for human consumption, use the
`status.conditions.message` field.
-->
`status.conditions.reason` 字段通常設置爲一個首字母大寫的對機器友好的原因碼；
這是一個命名約定，但你也可以隨你的個人喜好設置。
如果你想添加一個供人類使用的註釋，那就用 `status.conditions.message` 字段。

## PodCertificateRequests {#pod-certificate-requests}

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
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)和 
`--runtime-config=certificates.k8s.io/v1alpha1/podcertificaterequests=true` kube-apiserver
標誌來啓用對 Pod 證書的支持。
{{< /note >}}

<!--
PodCertificateRequests are API objects tailored to provisioning certificates to
workloads running as Pods within a cluster.  The user typically does not
interact with PodCertificateRequests directly, but uses [podCertificate
projected volume sources](
/docs/concepts/storage/projected-volumes#podcertificate), which are a `kubelet`
feature that handles secure key provisioning and automatic certificate refresh.
The application inside the pod only needs to know how to read the certificates
from the filesystem.

PodCertificateRequests are similar to CertificateSigningRequests, but have a
simpler format enabled by their narrower use case.
-->
PodCertificateRequest 是專門爲叢集內以 Pod 形式運行的工作負載提供證書的 API 對象。
使用者通常不直接與 PodCertificateRequests 交互，而是使用
[podCertificate 投射卷源](/zh-cn/docs/concepts/storage/projected-volumes#podcertificate)，
這是 `kubelet` 的一個特性，處理安全密鑰設定和自動證書刷新。
Pod 內的應用程式只需要知道如何從檔案系統讀取證書。

PodCertificateRequest 類似於 CertificateSigningRequest，但由於其使用場景更窄，因此格式更簡單。

<!--
A PodCertificateRequest has the following spec fields:
* `signerName`: The signer to which this request is addressed.
* `podName` and `podUID`: The Pod that Kubelet is requesting a certificate for.
* `serviceAccountName` and `serviceAccountUID`: The ServiceAccount corresponding to the Pod.
* `nodeName` and `nodeUID`: The Node corresponding to the Pod.
* `maxExpirationSeconds`: The maximum lifetime that the workload author will
  accept for this certificate.  Defaults to 24 hours if not specified.
* `pkixPublicKey`: The public key for which the certificate should be issued.
* `proofOfPossession`: A signature demonstrating that the requester controls the
  private key corresponding to `pkixPublicKey`.
-->
PodCertificateRequest 包含以下 spec 字段：

* `signerName`：此請求所指向的簽名者。
* `podName` 和 `podUID`：kubelet 爲其請求證書的 Pod。
* `serviceAccountName` 和 `serviceAccountUID`：與 Pod 對應的 ServiceAccount。
* `nodeName` 和 `nodeUID`：與 Pod 對應的 Node。
* `maxExpirationSeconds`：工作負載作者將接受的此證書的最長生命週期。如果未指定，預設爲 24 小時。
* `pkixPublicKey`：應爲其頒發證書的公鑰。
* `proofOfPossession`：一個簽名，證明請求者控制着與 `pkixPublicKey` 對應的私鑰。

<!--
Nodes automatically receive permissions to create PodCertificateRequests and
read PodCertificateRequests related to them (as determined by the
`spec.nodeName` field).  The `NodeRestriction` admission plugin, if enabled,
ensures that nodes can only create PodCertificateRequests that correspond to a
real pod that is currently running on the node.

After creation, the `spec` of a PodCertificateRequest is immutable.
-->
節點自動獲得創建與其相關的 PodCertificateRequests 以及讀取與其相關的
PodCertificateRequest（由 `spec.nodeName` 字段決定）的權限。
如果啓用了 `NodeRestriction` 准入插件，它會確保節點只能創建對應於當前正在該節點上運行的真實
Pod 的 PodCertificateRequest。

創建後，PodCertificateRequest 的 `spec` 是不可變的。

<!--
Unlike CSRs, PodCertificateRequests do not have an
approval phase.  Once the PodCertificateRequest is created, the signer's
controller directly decides to issue or deny the request.  It also has the
option to mark the request as failed, if it encountered a permanent error when
attempting to issue the request.

To take any of these actions, the signing controller needs to have the
appropriate permissions on both the PodCertificateRequest type, as well as on
the signer name:
* Verbs: **update**, group: `certificates.k8s.io`, resource:
  `podcertificaterequests/status`
* Verbs: **sign**, group: `certificates.k8s.io`, resource: `signers`,
  resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`
-->
與 CSR 不同，PodCertificateRequests 沒有批准階段。一旦創建了 PodCertificateRequest，
簽名者的控制器會直接決定是發放還是拒絕請求。它還有權在嘗試發放請求時遇到永久性錯誤的情況下，將請求標記爲失敗。

要執行這些操作之一，簽名控制器需要具有針對給定 PodCertificateRequest 類型以及簽名者的適當權限：

* verbs（動詞）：**update**，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`podcertificaterequests/status`
* verbs（動詞）：**sign**，
  group（組）：`certificates.k8s.io`，
  resource（資源）：`signers`，
  resourceName（資源名稱）：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

<!--
The signing controller is free to consider other information beyond what's
contained in the request, but it can rely on the information in the request to
be accurate.  For example, the signing controller might load the Pod and read
annotations set on it, or perform a SubjectAccessReview on the ServiceAccount.  
-->
簽名控制器可以考察除請求中包含的資訊之外的其他資訊，但它可以相信請求中的資訊是準確的。
例如，簽名控制器可能會加載 Pod 並讀取 Pod 上設置的註解，或者對 ServiceAccount
執行 SubjectAccessReview。

<!--
To issue a certificate in response to a request, the signing controller:
* Adds an `Issued` condition to `status.conditions`.
* Puts the issued certificate in `status.certificateChain`
* Puts the `NotBefore` and `NotAfter` fields of the certificate in the
  `status.notBefore` and `status.notAfter` fields &mdash; these fields are
  denormalized into the Kubernetes API in order to aid debugging
* Suggests a time to begin attempting to refresh the certificate using
  `status.beginRefreshAt`.
-->
爲了響應請求頒發證書，簽署控制器會：

* 在 `status.conditions` 中添加一個 `Issued` 狀況。
* 將頒發的證書放入 `status.certificateChain`。
* 將證書的 `NotBefore` 和 `NotAfter` 字段分別放入 `status.notBefore` 和
  `status.notAfter` 字段 — 這些字段被反規範化到 Kubernetes API 中，以幫助調試。
* 建議使用 `status.beginRefreshAt` 開始嘗試刷新證書的時間。

<!--
To deny a request, the signing controller adds a "Denied" condition to
`status.conditions[]`.

To mark a request failed, the signing controller adds a "Failed" condition to
`status.conditions[]`.

All of these conditions are mutually-exclusive, and must have status "True".  No
other condition types are permitted on PodCertificateRequests.  In addition,
once any of these conditions are set, the `status` field becomes immutable.
-->
爲了拒絕請求，簽署控制器會在 `status.conditions[]` 中添加一個 "Denied" 狀況。

爲了標記請求失敗，簽署控制器會在 `status.conditions[]` 中添加一個 "Failed" 狀況。

所有這些狀況都是互斥的，且必須具有 “True” 狀態。不允許在 PodCertificateRequest
上設置其他類型的狀況資訊。此外，一旦設置了所列的任一狀況，`status` 字段將變爲不可變。

<!--
Like all conditions, the `status.conditions[].reason` field is meant to contain
a machine-readable code describing the condition in TitleCase.  The
`status.conditions[].message` field is meant for a free-form explanation for
human consumption.

To ensure that terminal PodCertificateRequests do not build up in the cluster, a
`kube-controller-manager` controller deletes all PodCertificateRequests older
than 15 minutes.  All certificate issuance flows are expected to complete within
this 15-minute limit.
-->
像所有其他狀況一樣，`status.conditions[].reason` 字段用於包含描述狀況的機器可讀代碼，
使用 TitleCase 表示。`status.conditions[].message` 字段用於包含供人閱讀的自由格式解釋。

爲了確保終端 PodCertificateRequests 不會在叢集中積累，`kube-controller-manager`
控制器會刪除所有超過 15 分鐘的 PodCertificateRequests。
所有證書頒發流程都應在這一 15 分鐘限制內完成。

<!--
## Cluster trust bundles {#cluster-trust-bundles}
-->
## 叢集信任包   {#cluster-trust-bundles}

{{< feature-state feature_gate_name="ClusterTrustBundle" >}}

{{< note >}}
<!--
In Kubernetes {{< skew currentVersion >}}, you must enable the `ClusterTrustBundle`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
_and_ the `certificates.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} in order to use
this API.
-->
在 Kubernetes {{< skew currentVersion >}} 中，如果想要使用此 API，
必須同時啓用 `ClusterTrustBundle`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)**以及**
`certificates.k8s.io/v1alpha1` {{< glossary_tooltip text="API 組" term_id="api-group" >}}。
{{< /note >}}

<!--
A ClusterTrustBundles is a cluster-scoped object for distributing X.509 trust
anchors (root certificates) to workloads within the cluster. They're designed
to work well with the [signer](#signers) concept from CertificateSigningRequests.

ClusterTrustBundles can be used in two modes:
[signer-linked](#ctb-signer-linked) and [signer-unlinked](#ctb-signer-unlinked).
-->
ClusterTrustBundle 是一個作用域爲叢集的對象，向叢集內的對象分發 X.509 信任錨點（根證書）。
此對象旨在與 CertificateSigningRequest 中的[簽名者](#signers)概念協同工作。

ClusterTrustBundle 可以使用兩種模式：
[簽名者關聯](#ctb-signer-linked)和[簽名者未關聯](#ctb-signer-unlinked)。

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
### 常見屬性和驗證 {#ctb-common}

所有 ClusterTrustBundle 對象都對其 `trustBundle` 字段的內容進行強大的驗證。
該字段必須包含一個或多個經 DER 序列化的 X.509 證書，每個證書都封裝在 PEM `CERTIFICATE` 塊中，
這些證書必須解析爲有效的 X.509 證書。

諸如塊間資料和塊內標頭之類的 PEM 特性在對象驗證期間要麼被拒絕，要麼可能被對象的消費者忽略。
此外，消費者被允許使用自己的任意但穩定的排序方式重新排序 bundle 中的證書。

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
ClusterTrustBundle 對象應該在叢集內被視爲全局可讀的。
如果叢集使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 鑑權，
則所有 ServiceAccount 都具有預設授權，允許它們 **get**、**list** 和 **watch**
所有 ClusterTrustBundle 對象。如果你使用自己的鑑權機制，並且在叢集中啓用了
ClusterTrustBundle，則應設置等效規則以使這些對象在叢集內公開，使這些對象按預期工作。

如果你沒有預設在叢集中列出叢集信任包的權限，則可以扮演具有訪問權限的 ServiceAccount，
以查看可用的 ClusterTrustBundle：

```bash
kubectl get clustertrustbundles --as='system:serviceaccount:mynamespace:default'
```

<!--
### Signer-linked ClusterTrustBundles {#ctb-signer-linked}

Signer-linked ClusterTrustBundles are associated with a _signer name_, like this:
-->
### 簽名者關聯的 ClusterTrustBundle {#ctb-signer-linked}

簽名者關聯的 ClusterTrustBundle 與**簽名者名稱**關聯，例如：

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
這些 ClusterTrustBundle 預期由叢集中的特定簽名者控制器維護，因此它們具有多個安全特性：

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
* 要創建或更新與一個簽名者關聯的 ClusterTrustBundle，你必須獲准**證明**該簽名者
  （自定義鑑權動詞 `attest` API 組 `certificates.k8s.io`；資源路徑 `signers`）。
  你可以爲特定資源名稱 `<signerNameDomain>/<signerNamePath>` 或匹配 `<signerNameDomain>/*` 等模式來設定鑑權。
* 與簽名者關聯的 ClusterTrustBundle **必須**使用從其 `spec.signerName` 字段派生的前綴命名。
  斜槓（`/`）被替換爲英文冒號（`:`），最後追加一個英文冒號，後跟任意名稱。
  例如，簽名者 `example.com/mysigner` 可以關聯到 ClusterTrustBundle `example.com:mysigner:<arbitrary-name>`。

<!--
Signer-linked ClusterTrustBundles will typically be consumed in workloads
by a combination of a
[field selector](/docs/concepts/overview/working-with-objects/field-selectors/) on the signer name, and a separate
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
-->
與簽名者關聯的 ClusterTrustBundle 通常通過組合簽名者名稱有關的
[字段選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/field-selectors/)
或單獨使用[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)在工作負載中被消耗。

<!--
### Signer-unlinked ClusterTrustBundles {#ctb-signer-unlinked}

Signer-unlinked ClusterTrustBundles have an empty `spec.signerName` field, like this:
-->
### 簽名者未關聯的 ClusterTrustBundle   {#ctb-signer-unlinked}

簽名者未關聯的 ClusterTrustBundle 具有空白的 `spec.signerName` 字段，例如：

<!--
```yaml
apiVersion: certificates.k8s.io/v1alpha1
kind: ClusterTrustBundle
metadata:
  name: foo
spec:
  # no signerName specified, so the field is blank
  trustBundle: "<... PEM data ...>"
```
-->
```yaml
apiVersion: certificates.k8s.io/v1alpha1
kind: ClusterTrustBundle
metadata:
  name: foo
spec:
  # 未指定 signerName 所以該字段留空
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
它們主要用於叢集設定場景。每個與簽名者未關聯的 ClusterTrustBundle 都是一個獨立的對象，
與簽名者關聯的 ClusterTrustBundle 的慣常分組行爲形成了對比。

與簽名者爲關聯的 ClusterTrustBundle 沒有 `attest` 動詞要求。
相反，你可以使用通常的機制（如基於角色的訪問控制）直接控制對它們的訪問。

爲了將它們與與簽名者關聯的 ClusterTrustBundle 區分開來，與簽名者未關聯的
ClusterTrustBundle 的名稱**必須不**包含英文冒號（`:`）。

<!--
### Accessing ClusterTrustBundles from pods {#ctb-projection}
-->
### 從 Pod 訪問 ClusterTrustBundle {#ctb-projection}

{{< feature-state feature_gate_name="ClusterTrustBundleProjection" >}}

<!--
The contents of ClusterTrustBundles can be injected into the container filesystem, similar to ConfigMaps and Secrets.
See the [clusterTrustBundle projected volume source](/docs/concepts/storage/projected-volumes#clustertrustbundle) for more details.
-->
ClusterTrustBundle 的內容可以注入到容器檔案系統，這與 ConfigMap 和 Secret 類似。
更多細節參閱 [ClusterTrustBundle 投射卷源](/zh-cn/docs/concepts/storage/projected-volumes#clustertrustbundle)。

## {{% heading "whatsnext" %}}

<!--
* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* Read [Issue a Certificate for a Kubernetes API Client Using A CertificateSigningRequest](/docs/tasks/tls/certificate-issue-client-csr/)
* View the source code for the kube-controller-manager built in
  [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* View the source code for the kube-controller-manager built in
  [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Read about the ClusterTrustBundle API:
  * {{< page-api-reference kind="ClusterTrustBundle" >}}
-->
* 參閱[管理叢集中的 TLS 認證](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* 參閱[使用 CertificateSigningRequest 爲 Kubernetes API 客戶端頒發證書](/zh-cn/docs/tasks/tls/certificate-issue-client-csr/)
* 查看 kube-controller-manager 中[簽名者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)部分的源代碼
* 查看 kube-controller-manager 中[批准者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)部分的源代碼
* 有關 X.509 本身的詳細資訊，請參閱 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 第 3.1 節
* 有關 PKCS#10 證書籤名請求語法的資訊，請參閱 [RFC 2986](https://tools.ietf.org/html/rfc2986)
* 閱讀 ClusterTrustBundle 相關內容：
  * {{< page-api-reference kind="ClusterTrustBundle" >}}
