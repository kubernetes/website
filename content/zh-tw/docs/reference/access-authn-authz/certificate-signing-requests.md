---
title: 證書籤名請求
content_type: concept
weight: 20
---
<!--
reviewers:
- liggitt
- mikedanese
- munnerz
- enj
title: Certificate Signing Requests
content_type: concept
weight: 20
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
The Certificates API enables automation of
[X.509](https://www.itu.int/rec/T-REC-X.509) credential provisioning by providing
a programmatic interface for clients of the Kubernetes API to request and obtain
X.509 {{< glossary_tooltip term_id="certificate" text="certificates" >}}
from a Certificate Authority (CA).

A CertificateSigningRequest (CSR) resource is used to request that a certificate be signed
by a denoted signer, after which the request may be approved or denied before
finally being signed.
-->
證書 API 支援
[X.509](https://www.itu.int/rec/T-REC-X.509)
的自動化配置，
它為 Kubernetes API 的客戶端提供一個程式設計介面，
用於從證書頒發機構（CA）請求並獲取 X.509
{{< glossary_tooltip term_id="certificate" text="證書" >}}。

CertificateSigningRequest（CSR）資源用來向指定的簽名者申請證書籤名，
在最終簽名之前，申請可能被批准，也可能被拒絕。

<!-- body -->

<!--
## Request signing process

The CertificateSigningRequest resource type allows a client to ask for an X.509 certificate
be issued, based on a signing request.

The CertificateSigningRequest object includes a PEM-encoded PKCS#10 signing request in
the `spec.request` field. The CertificateSigningRequest denotes the _signer_ (the
recipient that the request is being made to) using the `spec.signerName` field.
Note that `spec.signerName` is a required key after api version `certificates.k8s.io/v1`.
In Kubernetes v1.22 and later, clients may optionally set the `spec.expirationSeconds`
field to request a particular lifetime for the issued certificate.  The minimum valid
value for this field is `600`, i.e. ten minutes.
-->
## 請求籤名流程 {#request-signing-process}

CertificateSigningRequest 資源型別允許客戶使用它申請發放 X.509 證書。
CertificateSigningRequest 物件 在 `spec.request` 中包含一個 PEM 編碼的 PKCS#10 簽名請求。
CertificateSigningRequest 使用 `spec.signerName` 欄位標示 _簽名者_（請求的接收方）。
注意，`spec.signerName` 在 `certificates.k8s.io/v1` 之後的 API 版本是必填項。
在 Kubernetes v1.22 和以後的版本，客戶可以可選地設定 `spec.expirationSeconds`
欄位來為頒發的證書設定一個特定的有效期。該欄位的最小有效值是 `600`，也就是 10 分鐘。

<!--
Once created, a CertificateSigningRequest must be approved before it can be signed.
Depending on the signer selected, a CertificateSigningRequest may be automatically approved
by a {{< glossary_tooltip text="controller" term_id="controller" >}}.
Otherwise, a CertificateSigningRequest must be manually approved
either via the REST API (or client-go)
or by running `kubectl certificate approve`.
Likewise, a CertificateSigningRequest may also be denied,
which tells the configured signer that it must not sign the request.
-->
建立完成的 CertificateSigningRequest，要先透過批准，然後才能簽名。
根據所選的簽名者，CertificateSigningRequest 可能會被
{{< glossary_tooltip text="控制器" term_id="controller" >}}自動批准。
否則，就必須人工批准，
人工批准可以使用 REST API（或 go 客戶端），也可以執行 `kubectl certificate approve` 命令。
同樣，CertificateSigningRequest 也可能被駁回，
這就相當於通知了指定的簽名者，這個證書不能簽名。

<!--  
For certificates that have been approved, the next step is signing.
The relevant signing controller
first validates that the signing conditions are met and then creates a certificate.
The signing controller then updates the CertificateSigningRequest,
storing the new certificate into
the `status.certificate` field of the existing CertificateSigningRequest object. The
`status.certificate` field is either empty or contains a X.509 certificate,
encoded in PEM format.
The CertificateSigningRequest `status.certificate` field is empty until the signer does this.
-->
對於已批准的證書，下一步是簽名。
對應的簽名控制器首先驗證簽名條件是否滿足，然後才建立證書。
簽名控制器然後更新 CertificateSigningRequest，
將新證書儲存到現有 CertificateSigningRequest 物件的 `status.certificate` 欄位中。
此時，欄位 `status.certificate` 要麼為空，要麼包含一個用 PEM 編碼的 X.509 證書。
直到簽名完成前，CertificateSigningRequest 的欄位 `status.certificate` 都為空。

<!--
Once the `status.certificate` field has been populated,
the request has been completed and clients can now
fetch the signed certificate PEM data from the CertificateSigningRequest resource.
The signers can instead deny certificate signing if the approval conditions are not met.
-->
一旦 `status.certificate` 欄位完成填充，請求既算完成，
客戶端現在可以從 CertificateSigningRequest 資源中獲取已簽名的證書的 PEM 資料。
當然如果不滿足簽名條件，簽名者可以拒籤。

<!--
In order to reduce the number of old CertificateSigningRequest resources left
in a cluster, a garbage collection
controller runs periodically.
The garbage collection removes CertificateSigningRequests that have not changed
state for some duration:

* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Failed requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 24 hours
* All requests: automatically deleted after the issued certificate has expired
-->
為了減少叢集中遺留的過時的 CertificateSigningRequest 資源的數量，
一個垃圾收集控制器將會週期性地執行。
此垃圾收集器會清除在一段時間內沒有改變過狀態的 CertificateSigningRequests：

* 已批准的請求：1小時後自動刪除
* 已拒絕的請求：1小時後自動刪除
* 已失敗的請求：1小時後自動刪除
* 掛起的請求：24小時後自動刪除
* 所有請求：在頒發的證書過期後自動刪除

<!--
## Signers

Custom signerNames can also be specified. All signers should provide information about how they work
so that clients can predict what will happen to their CSRs.
This includes:
-->
## 簽名者 {#signers}

也可以指定自定義 signerName。
所有簽名者都應該提供自己工作方式的資訊，
以便客戶端可以預期到他們的 CSR 將發生什麼。
此類資訊包括：

<!--
1. **Trust distribution**: how trust (CA bundles) are distributed.
2.  **Permitted subjects**: any restrictions on and behavior
   when a disallowed subject is requested.
3. **Permitted x509 extensions**: including IP subjectAltNames, DNS subjectAltNames,
   Email subjectAltNames, URI subjectAltNames etc,
   and behavior when a disallowed extension is requested.
4. **Permitted key usages / extended key usages**: any restrictions on and behavior
   when usages different than the signer-determined usages are specified in the CSR.
5. **Expiration/certificate lifetime**: whether it is fixed by the signer, configurable by the admin, determined by the CSR `spec.expirationSeconds` field, etc
   and the behavior when the signer-determined expiration is different from the CSR `spec.expirationSeconds` field.
6. **CA bit allowed/disallowed**: and behavior if a CSR contains a request
   a for a CA certificate when the signer does not permit it.
-->
1. **信任分發**：信任（CA 證書包）是如何分發的。
2. **許可的主體**：當一個受限制的主體（subject）傳送請求時，相應的限制和應對手段。
3. **許可的 x509 擴充套件**：包括 IP subjectAltNames、DNS subjectAltNames、
   Email subjectAltNames、URI subjectAltNames 等，請求一個受限制的擴充套件項時的應對手段。
4. **許可的金鑰用途/擴充套件的金鑰用途**：當用途和簽名者在 CSR 中指定的用途不同時，
   相應的限制和應對手段。
5. **過期時間/證書有效期**：過期時間由簽名者確定、由管理員配置、還是由 CSR `spec.expirationSeconds` 欄位指定等，
   以及簽名者決定的過期時間與 CSR `spec.expirationSeconds` 欄位不同時的應對手段。
6. **允許/不允許 CA 位**：當 CSR 包含一個簽名者並不允許的 CA 證書的請求時，相應的應對手段。

<!--
Commonly, the `status.certificate` field contains a single PEM-encoded X.509
certificate once the CSR is approved and the certificate is issued. Some
signers store multiple certificates into the `status.certificate` field. In
that case, the documentation for the signer should specify the meaning of
additional certificates; for example, this might be the certificate plus
intermediates to be presented during TLS handshakes.
-->
一般來說，當 CSR 被批准透過，且證書被簽名後，`status.certificate` 欄位
將包含一個 PEM 編碼的 X.509 證書。
有些簽名者在 `status.certificate` 欄位中儲存多個證書。
在這種情況下，簽名者的說明文件應當指明附加證書的含義。
例如，這是要在 TLS 握手時提供的證書和中繼證書。

<!--
The PKCS#10 signing request format does not have a standard mechanism to specify a
certificate expiration or lifetime. The expiration or lifetime therefore has to be set
through the `spec.expirationSeconds` field of the CSR object. The built-in signers
use the `ClusterSigningDuration` configuration option, which defaults to 1 year,
(the `--cluster-signing-duration` command-line flag of the kube-controller-manager)
as the default when no `spec.expirationSeconds` is specified.  When `spec.expirationSeconds`
is specified, the minimum of `spec.expirationSeconds` and `ClusterSigningDuration` is
used.
-->
PKCS#10 簽名請求格式並沒有一種標準的方法去設定證書的過期時間或者生命期。
因此，證書的過期時間或者生命期必須透過 CSR 物件的 `spec.expirationSeconds` 欄位來設定。
當 `spec.expirationSeconds` 沒有被指定時，內建的簽名者預設使用 `ClusterSigningDuration` 配置選項
（kube-controller-manager 的命令列選項 `--cluster-signing-duration`），該選項的預設值設為 1 年。
當 `spec.expirationSeconds` 被指定時，`spec.expirationSeconds` 和 `ClusterSigningDuration`
中的最小值會被使用。

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22.  Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 欄位是在 Kubernetes v1.22 中加入的。早期的 Kubernetes 版本並不認識該欄位。
v1.22 版本之前的 Kubernetes API 伺服器會在建立物件的時候忽略該欄位。
{{< /note >}}

<!--
### Kubernetes signers

Kubernetes provides built-in signers that each have a well-known `signerName`:
-->
### Kubernetes 簽名者 {#kubernetes-signers}

Kubernetes提供了內建的簽名者，每個簽名者都有一個眾所周知的 `signerName`:

<!--
1. `kubernetes.io/kube-apiserver-client`: signs certificates that will be honored as client certificates by the API server.
  Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
    1. Trust distribution: signed certificates must be honored as client-certificates by the kube-apiserver. The CA bundle is not distributed by any other means.
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
1. `kubernetes.io/kube-apiserver-client`：簽名的證書將被 API 伺服器視為客戶證書。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准它。
   1. 信任分發：簽名的證書將被 API 伺服器視為客戶端證書。CA 證書包不透過任何其他方式分發。
   1. 許可的主體：沒有主體限制，但稽核人和簽名者可以選擇不批准或不簽署。
      某些主體，比如叢集管理員級別的使用者或組因部署和安裝方式不同而不同，
      所以批准和簽署之前需要進行額外仔細審查。
      用來限制 `system:masters` 的 CertificateSubjectRestriction 准入外掛預設處於啟用狀態，
      但它通常不是叢集中唯一的叢集管理員主體。
   1. 許可的 x509 擴充套件：允許 subjectAltName 和 key usage 擴充套件，棄用其他擴充套件。
   1. 許可的金鑰用途：必須包含 `["client auth"]`，但不能包含
      `["digital signature", "key encipherment", "client auth"]` 之外的鍵。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設定為 `--cluster-signing-duration` 選項和 CSR 物件的 `spec.expirationSeconds` 欄位（如有設定該欄位）中的最小值。
   1. 允許/不允許 CA 位：不允許。

<!--
1. `kubernetes.io/kube-apiserver-client-kubelet`: signs client certificates that will be honored as client certificates by the
   API server.
   May be auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored as client certificates by the API server. The CA bundle
      is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name starts with "`system:node:`".
   1. Permitted x509 extensions - honors key usage extensions, forbids subjectAltName extensions and drops other extensions.
   1. Permitted key usages - exactly `["key encipherment", "digital signature", "client auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
2. `kubernetes.io/kube-apiserver-client-kubelet`: 簽名的證書將被 kube-apiserver 視為客戶證書。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 可以自動批准它。

   1. 信任分發：簽名的證書將被 API 伺服器視為客戶端證書。CA 證書包不透過任何其他方式分發。
   1. 許可的主體：組織名必須是 `["system:nodes"]`，使用者名稱以 "`system:node:`" 開頭
   1. 許可的 x509 擴充套件：允許 key usage 擴充套件，禁用 subjectAltName 擴充套件，並刪除其他擴充套件。
   1. 許可的金鑰用途：必須是 `["key encipherment", "digital signature", "client auth"]`
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設定為 `--cluster-signing-duration` 選項和 CSR 物件的 `spec.expirationSeconds` 欄位（如有設定該欄位）中的最小值。
   1. 允許/不允許 CA 位：不允許。

<!--
1. `kubernetes.io/kubelet-serving`: signs serving certificates that are honored as a valid kubelet serving certificate
   by the API server, but has no other guarantees.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored by the kube-apiserver as valid to terminate connections to a kubelet. The CA bundle is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name starts with "`system:node:`".
   1. Permitted x509 extensions - honors key usage and DNSName/IPAddress subjectAltName extensions, forbids EmailAddress and
      URI subjectAltName extensions, drops other extensions. At least one DNS or IP subjectAltName must be present.
   1. Permitted key usages - exactly `["key encipherment", "digital signature", "server auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
3. `kubernetes.io/kubelet-serving`: 簽名服務證書，該服務證書被 API 伺服器視為有效的 kubelet 服務證書，
   但沒有其他保證。{{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准它。
   1. 信任分發：簽名的證書必須被 kube-apiserver 認可，可有效的中止 kubelet 連線。CA 證書包不透過任何其他方式分發。
   1. 許可的主體：組織名必須是 `["system:nodes"]`，使用者名稱以 "`system:node:`" 開頭
   1. 許可的 x509 擴充套件：允許 key usage、DNSName/IPAddress subjectAltName 等擴充套件，
      禁止  EmailAddress、URI subjectAltName 等擴充套件，並丟棄其他擴充套件。
      至少有一個 DNS 或 IP 的 SubjectAltName 存在。
   1. 許可的金鑰用途：必須是 `["key encipherment", "digital signature", "server auth"]`
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設定為 `--cluster-signing-duration` 選項和 CSR 物件的 `spec.expirationSeconds` 欄位（如有設定該欄位）中的最小值。
   1. 允許/不允許 CA 位：不允許。

<!--
1. `kubernetes.io/legacy-unknown`:  has no guarantees for trust at all. Some third-party distributions of Kubernetes
   may honor client certificates signed by it. The stable CertificateSigningRequest API (version `certificates.k8s.io/v1` and later)
   does not allow to set the `signerName` as `kubernetes.io/legacy-unknown`.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: None.  There is no standard trust or distribution for this signer in a Kubernetes cluster.
   1. Permitted subjects - any
   1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
   1. Permitted key usages - any
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.
-->
4. `kubernetes.io/legacy-unknown`: 不保證信任。Kubernetes 的一些第三方發行版可能會使用它簽署的客戶端證書。
   穩定版的 CertificateSigningRequest API（`certificates.k8s.io/v1` 以及之後的版本）不允許將
   `signerName` 設定為 `kubernetes.io/legacy-unknown`。
   {{< glossary_tooltip term_id="kube-controller-manager" >}} 不會自動批准這類請求。
   1. 信任分發：沒有。這個簽名者在 Kubernetes 叢集中沒有標準的信任或分發。
   1. 許可的主體：全部。
   1. 許可的 x509 擴充套件：允許 subjectAltName 和 key usage 等擴充套件，並棄用其他擴充套件。
   1. 許可的金鑰用途：全部。
   1. 過期時間/證書有效期：對於 kube-controller-manager 實現的簽名者，
      設定為 `--cluster-signing-duration` 選項和 CSR 物件的 `spec.expirationSeconds` 欄位（如有設定該欄位）中的最小值。
   1. 允許/不允許 CA 位 - 不允許。

{{< note >}}
<!--
Failures for all of these are only reported in kube-controller-manager logs.
-->
注意：所有這些故障僅在 kube-controller-manager 日誌中報告。
{{< /note >}}

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22.  Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 欄位是在 Kubernetes v1.22 中加入的。早期的 Kubernetes 版本並不認識該欄位。
v1.22 版本之前的 Kubernetes API 伺服器會在建立物件的時候忽略該欄位。
{{< /note >}}

<!--
Distribution of trust happens out of band for these signers.  Any trust outside of those described above are strictly
coincidental. For instance, some distributions may honor `kubernetes.io/legacy-unknown` as client certificates for the
kube-apiserver, but this is not a standard.
None of these usages are related to ServiceAccount token secrets `.data[ca.crt]` in any way.  That CA bundle is only
guaranteed to verify a connection to the API server using the default service (`kubernetes.default.svc`).
-->
對於這些簽名者，信任的分發發生在帶外（out of band）。上述信任之外的任何信任都是完全巧合的。
例如，一些發行版可能會將 `kubernetes.io/legacy-unknown` 作為 kube-apiserver 的客戶端證書，
但這個做法並不標準。
這些用途都沒有以任何方式涉及到 ServiceAccount 中的 Secrets `.data[ca.crt]`。
此 CA 證書包只保證使用預設的服務（`kubernetes.default.svc`）來驗證到 API 伺服器的連線。

<!--
## Authorization

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:

* Verbs: `create`, `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`

For example:
-->
## 鑑權 {#authorization}

授權建立 CertificateSigningRequest 和檢索 CertificateSigningRequest:

* verbs（動詞）: `create`、`get`、`list`、`watch`,
  group（組）：`certificates.k8s.io`，
  resources：`certificatesigningrequests`

例如：

{{< codenew file="access/certificate-signing-request/clusterrole-create.yaml" >}}

<!--
To allow approving a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: `approve`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

For example:
-->
授權批准 CertificateSigningRequest：

* verbs（動詞）: `get`、`list`、`watch`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`certificatesigningrequests`
* verbs（動詞）: `update`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`certificatesigningrequests/approval`
* verbs（動詞）：`approve`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`signers`，
  resourceName：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

例如：

{{< codenew file="access/certificate-signing-request/clusterrole-approve.yaml" >}}

<!--
To allow signing a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: `sign`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`
-->
授權簽名 CertificateSigningRequest：

* verbs（動詞）：`get`、`list`、`watch`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`certificatesigningrequests`
* verbs（動詞）：`update`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`certificatesigningrequests/status`
* verbs（動詞）：`sign`，
  group（組）：`certificates.k8s.io`，
  resources（資源）：`signers`，
  resourceName：`<signerNameDomain>/<signerNamePath>` 或 `<signerNameDomain>/*`

{{< codenew file="access/certificate-signing-request/clusterrole-sign.yaml" >}}

<!--
## Normal User

A few steps are required in order to get a normal user to be able to
authenticate and invoke an API. First, this user must have a certificate issued
by the Kubernetes cluster, and then present that certificate to the Kubernetes API.
-->
## 普通使用者 {#normal-user}

為了讓普通使用者能夠透過認證並呼叫 API，需要執行幾個步驟。
首先，該使用者必須擁有 Kubernetes 叢集簽發的證書，
然後將該證書提供給 Kubernetes API。

<!--
### Create private key

The following scripts show how to generate PKI private key and CSR. It is
important to set CN and O attribute of the CSR. CN is the name of the user and
O is the group that this user will belong to. You can refer to
[RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.
-->
### 建立私鑰 {#create-private-key}

下面的指令碼展示瞭如何生成 PKI 私鑰和 CSR。
設定 CSR 的 CN 和 O 屬性很重要。CN 是使用者名稱，O 是該使用者歸屬的組。
你可以參考 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 瞭解標準組的資訊。

```shell
openssl genrsa -out myuser.key 2048
openssl req -new -key myuser.key -out myuser.csr
```

<!--
### Create CertificateSigningRequest

Create a CertificateSigningRequest and submit it to a Kubernetes Cluster via kubectl.
Below is a script to generate the CertificateSigningRequest.
-->
### 建立 CertificateSigningRequest {#create-certificatesigningrequest}

建立一個 CertificateSigningRequest，並透過 kubectl 將其提交到 Kubernetes 叢集。
下面是生成 CertificateSigningRequest 的指令碼。

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
  You can get the content using this command: ```cat myuser.csr | base64 | tr -d "\n"```
-->
需要注意的幾點:

- `usage` 欄位必須是 '`client auth`'
- `expirationSeconds` 可以設定為更長（例如 `864000` 是十天）或者更短（例如 `3600` 是一個小時）
- `request` 欄位是 CSR 檔案內容的 base64 編碼值。
  要得到該值，可以執行命令 `cat myuser.csr | base64 | tr -d "\n"`。

<!--
### Approve certificate signing request

Use kubectl to create a CSR and approve it.

Get the list of CSRs:
-->
### 批准證書籤名請求 {#approve-certificate-signing-request}

使用 kubectl 建立 CSR 並批准。

獲取 CSR 列表：

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

Retrieve the certificate from the CSR.
-->
### 取得證書 {#get-the-certificate}

從 CSR 取得證書：

```shell
kubectl get csr/myuser -o yaml
```

<!--
The Certificate value is in Base64-encoded format under `status.certificate`.

Export the issued certificate from the CertificateSigningRequest.

-->
證書的內容使用 base64 編碼，存放在欄位 `status.certificate`。

從 CertificateSigningRequest 匯出頒發的證書。

```
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

<!--
### Create Role and RoleBinding

With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:
-->
### 建立角色和角色繫結 {#create-role-and-role-binding}

建立了證書之後，為了讓這個使用者能訪問 Kubernetes 叢集資源，現在就要建立
Role 和 RoleBinding 了。

下面是為這個新使用者建立 Role 的示例命令：

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

<!--
This is a sample command to create a RoleBinding for this new user:
-->
下面是為這個新使用者建立 RoleBinding 的示例命令：

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

<!--
### Add to kubeconfig

The last step is to add this user into the kubeconfig file.

First, we need to add new credentials:
-->
### 新增到 kubeconfig   {#add-to-kubeconfig}

最後一步是將這個使用者新增到 kubeconfig 檔案。
我們假設私鑰和證書檔案存放在 “/home/vagrant/work/” 目錄中。

首先，我們需要新增新的憑據：

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true

```

<!--
Then, you need to add the context:
-->
然後，你需要新增上下文：

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

<!--
To test it, change the context to `myuser`:
-->
來測試一下，把上下文切換為 `myuser`：

```shell
kubectl config use-context myuser
```

<!--
## Approval or rejection   {#approval-rejection}

### Control plane automated approval {#approval-rejection-control-plane}

The kube-controller-manager ships with a built-in approver for certificates with
a signerName of `kubernetes.io/kube-apiserver-client-kubelet` that delegates various
permissions on CSRs for node credentials to authorization.
The kube-controller-manager POSTs SubjectAccessReview resources to the API server
in order to check authorization for certificate approval.
-->
## 批准和駁回 {#approval-rejection}

### 控制平面的自動化批准 {#approval-rejection-control-plane}

kube-controller-manager 內建了一個證書批准者，其 signerName 為
`kubernetes.io/kube-apiserver-client-kubelet`，
該批准者將 CSR 上用於節點憑據的各種許可權委託給權威認證機構。
kube-controller-manager 將 SubjectAccessReview 資源傳送（POST）到 API 伺服器，
以便檢驗批准證書的授權。

<!--
### Approval or rejection using `kubectl` {#approval-rejection-kubectl}

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands.

To approve a CSR with kubectl:
-->
### 使用 `kubectl` 批准或駁回   {#approval-rejection-kubectl}

Kubernetes 管理員（擁有足夠的許可權）可以手工批准（或駁回）CertificateSigningRequests，
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

REST API 的使用者可以透過向待批准的 CSR 的 `approval` 子資源提交更新請求來批准 CSR。
例如，你可以編寫一個
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}}
來監視特定型別的 CSR，然後傳送一個更新來批准它。

當你發出批准或駁回的指令時，根據你期望的狀態來選擇設定 `Approved` 或 `Denied`。

批准（`Approved`） 的 CSR：

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
<!--
For `Denied` CSRs:
-->
駁回（`Denied`）的 CSR：

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

<!--
It's usual to set `status.conditions.reason` to a machine-friendly reason
code using TitleCase; this is a convention but you can set it to anything
you like. If you want to add a note for human consumption, use the
`status.conditions.message` field.
-->
`status.conditions.reason` 欄位通常設定為一個首字母大寫的對機器友好的原因碼;
這是一個命名約定，但你也可以隨你的個人喜好設定。
如果你想新增一個供人類使用的註釋，那就用 `status.conditions.message`  欄位。

<!--
## Signing

### Control plane signer {#signer-control-plane}

The Kubernetes control plane implements each of the
[Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers),
as part of the kube-controller-manager.

Prior to Kubernetes v1.18, the kube-controller-manager would sign any CSRs that
were marked as approved.
-->
## 簽名   {#signing}

### 控制平面簽名者    {#signer-control-plane}

Kubernetes 控制平面實現了每一個
[Kubernetes 簽名者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)，
每個簽名者的實現都是 kube-controller-manager 的一部分。

{{< note >}}
在Kubernetes v1.18 之前，
kube-controller-manager 簽名所有標記為 approved  的 CSR。
{{< /note >}}

{{< note >}}
<!--
The `spec.expirationSeconds` field was added in Kubernetes v1.22.  Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
-->
`spec.expirationSeconds` 欄位是在 Kubernetes v1.22 中加入的。早期的 Kubernetes 版本並不認識該欄位。
v1.22 版本之前的 Kubernetes API 伺服器會在建立物件的時候忽略該欄位。
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

REST API 的使用者可以透過向待簽名的 CSR 的 `status` 子資源提交更新請求來對 CSR 進行簽名。

作為這個請求的一部分， `status.certificate` 欄位應設定為已簽名的證書。
此欄位可包含一個或多個 PEM 編碼的證書。

所有的 PEM 塊必須具備 "CERTIFICATE" 標籤，且不包含檔案頭，且編碼的資料必須是
[RFC5280 第 4 節](https://tools.ietf.org/html/rfc5280#section-4.1)
中描述的 BER 編碼的 ASN.1 證書結構。

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
to allow for explanatory text as described in section 5.2 of RFC7468.

When encoded in JSON or YAML, this field is base-64 encoded.
A CertificateSigningRequest containing the example certificate above would look like this:
-->
非 PEM 內容可能會出現在證書 PEM 塊前後的位置，且未經驗證，
以允許使用 RFC7468 第5.2節 中描述的解釋性文字。

當使用 JSON 或 YAML 格式時，此欄位是 base-64 編碼。
包含上述示例證書的 CertificateSigningRequest 如下所示：

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JS..."
```

## {{% heading "whatsnext" %}}

<!--
* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* View the source code for the kube-controller-manager built in [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* View the source code for the kube-controller-manager built in [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
-->
* 參閱 [管理叢集中的 TLS 認證](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* 檢視 kube-controller-manager 中[簽名者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)部分的原始碼
* 檢視 kube-controller-manager 中[批准者](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)部分的原始碼
* 有關 X.509 本身的詳細資訊，請參閱 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 第3.1節
* 有關 PKCS#10 證書籤名請求語法的資訊，請參閱 [RFC 2986](https://tools.ietf.org/html/rfc2986)
