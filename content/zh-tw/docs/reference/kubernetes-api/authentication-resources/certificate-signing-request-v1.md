---
api_metadata:
  apiVersion: "certificates.k8s.io/v1"
  import: "k8s.io/api/certificates/v1"
  kind: "CertificateSigningRequest"
content_type: "api_reference"
description: "CertificateSigningRequest 對象提供了一種通過提交證書籤名請求並異步批准和頒發 x509 證書的機制。"
title: CertificateSigningRequest
weight: 4
---

<!--
api_metadata:
  apiVersion: "certificates.k8s.io/v1"
  import: "k8s.io/api/certificates/v1"
  kind: "CertificateSigningRequest"
content_type: "api_reference"
description: "CertificateSigningRequest objects provide a mechanism to obtain x509 certificates by submitting a certificate signing request, and having it asynchronously approved and issued."
title: "CertificateSigningRequest"
weight: 4
auto_generated: true
-->

`apiVersion: certificates.k8s.io/v1`

`import "k8s.io/api/certificates/v1"`

<!--
## CertificateSigningRequest {#CertificateSigningRequest}
-->
## 證書籤名請求 CertificateSigningRequest {#CertificateSigningRequest}

<!--
CertificateSigningRequest objects provide a mechanism to obtain x509 certificates by submitting a certificate signing request, and having it asynchronously approved and issued.

Kubelets use this API to obtain:
 1. client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client-kubelet" signerName).
 2. serving certificates for TLS endpoints kube-apiserver can connect to securely (with the "kubernetes.io/kubelet-serving" signerName).
-->
CertificateSigningRequest 對象提供了一種通過提交證書籤名請求並異步批准和頒發 x509 證書的機制。

kubelet 使用 CertificateSigningRequest API 來獲取：

1. 向 kube-apiserver 進行身份認證的客戶端證書（使用 “kubernetes.io/kube-apiserver-client-kubelet” signerName）。
2. kube-apiserver 可以安全連接到 TLS 端點的服務證書（使用 “kubernetes.io/kubelet-serving” signerName）。

<!--
This API can be used to request client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client" signerName), 
or to obtain certificates from custom non-Kubernetes signers.
-->
此 API 可用於請求客戶端證書以向 kube-apiserver 進行身份驗證（使用 “kubernetes.io/kube-apiserver-client”
簽名者名稱），或從自定義非 Kubernetes 簽名者那裏獲取證書。

<!--
<hr>
- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
-->
<hr>

- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

<!--
- **spec** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestSpec" >}}">
   CertificateSigningRequestSpec</a>), required

  spec contains the certificate request, and is immutable after creation. 
  Only the request, signerName, expirationSeconds, and usages fields can be set on creation. 
  Other fields are derived by Kubernetes and cannot be modified by users.
-->
- **spec** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestSpec" >}}">
  CertificateSigningRequestSpec</a>)，必需

  spec 包含證書請求，並且在創建後是不可變的。
  只有 request、signerName、expirationSeconds 和 usages 字段可以在創建時設置。
  其他字段由 Kubernetes 派生，用戶無法修改。
  
<!--
- **status** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestStatus" >}}">
  CertificateSigningRequestStatus</a>)

  status contains information about whether the request is approved or denied, and the certificate issued by the signer, 
  or the failure condition indicating signer failure.
-->
- **status** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestStatus" >}}">
  CertificateSigningRequestStatus</a>)

  status 包含有關請求是被批准還是拒絕的信息，以及簽名者頒發的證書或指示簽名者失敗的狀況。

<!--
## CertificateSigningRequestSpec {#CertificateSigningRequestSpec}

CertificateSigningRequestSpec contains the certificate request.
-->
## CertificateSigningRequestSpec {#CertificateSigningRequestSpec}

CertificateSigningRequestSpec 包含證書請求。

<hr>

<!--
- **request** ([]byte), required

  *Atomic: will be replaced during a merge*
  
  request contains an x509 certificate signing request encoded in a "CERTIFICATE REQUEST" PEM block. 
  When serialized as JSON or YAML, the data is additionally base64-encoded.
-->

- **request** ([]byte)，必需

  **Atomic：將在合併期間被替換**

  request 包含一個在 “CERTIFICATE REQUEST” PEM 塊中編碼的 x509 證書籤名請求。
  當序列化爲 JSON 或 YAML 時，數據額外採用 base64 編碼。

<!--
- **signerName** (string), required

  signerName indicates the requested signer, and is a qualified name.
  
  List/watch requests for CertificateSigningRequests can filter on this field using a "spec.signerName=NAME" fieldSelector.
-->
- **signerName** (string)，必需

  signerName 表示請求的簽名者，是一個限定名。

  CertificateSigningRequests 的 list/watch 請求可以使用 “spec.signerName=NAME” 字段選擇器進行過濾。
  
  <!--
  Well-known Kubernetes signers are:
   1. "kubernetes.io/kube-apiserver-client": issues client certificates that can be used to authenticate to kube-apiserver.
    Requests for this signer are never auto-approved by kube-controller-manager, 
	can be issued by the "csrsigning" controller in kube-controller-manager.
   2. "kubernetes.io/kube-apiserver-client-kubelet": issues client certificates that kubelets use to authenticate to kube-apiserver.
    Requests for this signer can be auto-approved by the "csrapproving" controller in kube-controller-manager, 
	and can be issued by the "csrsigning" controller in kube-controller-manager.
   3. "kubernetes.io/kubelet-serving" issues serving certificates that kubelets use to serve TLS endpoints, which kube-apiserver can connect to securely.
    Requests for this signer are never auto-approved by kube-controller-manager, 
	and can be issued by the "csrsigning" controller in kube-controller-manager.
  
  More details are available at https://k8s.io/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers  
  -->
  衆所周知的 Kubernetes 簽名者有：

  1. “kubernetes.io/kube-apiserver-client”：頒發客戶端證書，用於向 kube-apiserver 進行身份驗證。
     對此簽名者的請求永遠不會被 kube-controller-manager 自動批准，
     可以由 kube-controller-manager 中的 “csrsigning” 控制器頒發。
  2. “kubernetes.io/kube-apiserver-client-kubelet”：頒發客戶端證書，kubelet 用於向 kube-apiserver 進行身份驗證。
     對此簽名者的請求可以由 kube-controller-manager 中的 “csrapproving” 控制器自動批准，
     並且可以由 kube-controller-manager 中的 “csrsigning” 控制器頒發。
  3. “kubernetes.io/kubelet-serving” 頒發服務證書，kubelet 用於服務 TLS 端點，kube-apiserver 可以安全的連接到這些端點。
     對此簽名者的請求永遠不會被 kube-controller-manager 自動批准，
     可以由 kube-controller-manager 中的 “csrsigning” 控制器頒發。
  
  更多詳細信息，請訪問 https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers

  <!--
  Custom signerNames can also be specified. The signer defines:
   1. Trust distribution: how trust (CA bundles) are distributed.
   2. Permitted subjects: and behavior when a disallowed subject is requested.
   3. Required, permitted, or forbidden x509 extensions in the request 
     (including whether subjectAltNames are allowed, which types, restrictions on allowed values) 
     and behavior when a disallowed extension is requested.
   4. Required, permitted, or forbidden key usages / extended key usages.
   5. Expiration/certificate lifetime: whether it is fixed by the signer, configurable by the admin.
   6. Whether or not requests for CA certificates are allowed.  
  -->
  也可以指定自定義 signerName。簽名者定義如下：

  1. 信任分發：信任（CA 證書包）是如何分發的。
  2. 許可的主體：當請求不允許的主體時的行爲。
  3. 請求中必需、許可或禁止的 x509 擴展（包括是否允許 subjectAltNames、哪些類型、對允許值的限制）
     以及請求不允許的擴展時的行爲。
  4. 必需、許可或禁止的密鑰用途/擴展密鑰用途。
  5. 過期/證書生命週期：是否由簽名者確定，管理員可配置。
  6. 是否允許申請 CA 證書。

<!--
- **expirationSeconds** (int32)

  expirationSeconds is the requested duration of validity of the issued certificate. 
  The certificate signer may issue a certificate with a different validity duration so 
  a client must check the delta between the notBefore and and notAfter fields 
  in the issued certificate to determine the actual duration.
-->
- **expirationSeconds** (int32)

  expirationSeconds 是所頒發證書的所請求的有效期。
  證書籤署者可以頒發具有不同有效期的證書，
  因此客戶端必須檢查頒發證書中 notBefore 和 notAfter 字段之間的增量以確定實際持續時間。

  <!--
  The v1.22+ in-tree implementations of the well-known Kubernetes signers will honor this field 
  as long as the requested duration is not greater than the maximum duration they will honor per the 
  --cluster-signing-duration CLI flag to the Kubernetes controller manager.
  -->
  衆所周知的 Kubernetes 簽名者在 v1.22+ 版本內實現將遵守此字段，
  只要請求的持續時間不大於最大持續時間，它們將遵守 Kubernetes 控制管理器的
  --cluster-signing-duration CLI 標誌。
  
  <!--
  Certificate signers may not honor this field for various reasons:
  
    1. Old signer that is unaware of the field (such as the in-tree
       implementations prior to v1.22)
    2. Signer whose configured maximum is shorter than the requested duration
    3. Signer whose configured minimum is longer than the requested duration
  
  The minimum valid value for expirationSeconds is 600, i.e. 10 minutes.  
  -->
  由於各種原因，證書籤名者可能忽略此字段：

  1. 不認識此字段的舊簽名者(如 v1.22 版本之前的實現)
  2. 配置的最大持續時間小於請求持續時間的簽名者
  3. 配置的最小持續時間大於請求持續時間的簽名者

  expirationSeconds 的最小有效值爲 600，即 10 分鐘。

<!-- 
- **extra** (map[string][]string)

  extra contains extra attributes of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **extra** (map[string][]string)

  extra 包含創建 CertificateSigningRequest 的用戶的額外屬性。
  在創建時由 API 服務器填充，且不可變。

<!-- 
- **groups** ([]string)

  *Atomic: will be replaced during a merge*
  
  groups contains group membership of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **groups** ([]string)

  **Atomic：將在合併過程中被替換**

  groups 包含創建 CertificateSigningRequest 的用戶的組成員關係。
  在創建時由 API 服務器填充，且不可變。

<!-- 
- **uid** (string)

  uid contains the uid of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **uid** (string)

  uid 包含創建 CertificateSigningRequest 的用戶的 uid 。
  在創建時由 API 服務器填充，且不可變。

<!-- 
- **usages** ([]string)

  *Atomic: will be replaced during a merge*
  
  usages specifies a set of key usages requested in the issued certificate.
  
  Requests for TLS client certificates typically request: "digital signature", "key encipherment", "client auth".
  
  Requests for TLS serving certificates typically request: "key encipherment", "digital signature", "server auth".
-->
- **usages** ([]string)

  **Atomic：將在合併期間被替換**

  usages 指定頒發證書中請求的一組密鑰用途。

  TLS 客戶端證書的請求通常要求："digital signature"、"key encipherment"、"client auth"。

  TLS 服務證書的請求通常要求："key encipherment"、"digital signature"、"server auth"。

  <!-- 
  Valid values are:
   "signing", "digital signature", "content commitment",
   "key encipherment", "key agreement", "data encipherment",
   "cert sign", "crl sign", "encipher only", "decipher only", "any",
   "server auth", "client auth",
   "code signing", "email protection", "s/mime",
   "ipsec end system", "ipsec tunnel", "ipsec user",
   "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc"
  -->
  有效值：
  "signing"、"digital signature"、"content commitment"、
  "key encipherment"、"key agreement"、"data encipherment"、
  "cert sign"、"crl sign"、"encipher only"、"decipher only"、"any"、
  "server auth"、"client auth"、
  "code signing"、"email protection"、"s/mime"、
  "ipsec end system"、"ipsec tunnel"、"ipsec user"、
  "timestamping"、"ocsp signing"、"microsoft sgc"、"netscape sgc"。

<!-- 
- **username** (string)

  username contains the name of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **username** (string)
  
  username 包含創建 CertificateSigningRequest 的用戶名。
  在創建時由 API 服務器填充，且不可變。

<!-- 
## CertificateSigningRequestStatus {#CertificateSigningRequestStatus}

CertificateSigningRequestStatus contains conditions used to indicate approved/denied/failed status of the request, 
and the issued certificate.
-->
## CertificateSigningRequestStatus {#CertificateSigningRequestStatus}

CertificateSigningRequestStatus 包含用於指示請求的批准/拒絕/失敗狀態和頒發證書的狀況。

<hr>

<!-- 
- **certificate** ([]byte)
  *Atomic: will be replaced during a merge*
  
  certificate is populated with an issued certificate by the signer after an Approved condition is present. 
  This field is set via the /status subresource. Once populated, this field is immutable.
  
  If the certificate signing request is denied, a condition of type "Denied" is added and this field remains empty. 
  If the signer cannot issue the certificate, a condition of type "Failed" is added and this field remains empty.
-->
- **certificate** ([]byte)

  **Atomic：將在合併期間被替換**
  
  certificate 在出現 Approved 狀況後，由簽名者使用已頒發的證書填充。
  這個字段通過 /status 子資源設置。填充後，該字段將不可變。

  如果證書籤名請求被拒絕，則添加類型爲 “Denied” 的狀況，並且保持該字段爲空。
  如果簽名者不能頒發證書，則添加類型爲 “Failed” 的狀況，並且保持該字段爲空。

  <!-- 
  Validation requirements:
   1. certificate must contain one or more PEM blocks.
   2. All PEM blocks must have the "CERTIFICATE" label, contain no headers, and the encoded data
    must be a BER-encoded ASN.1 Certificate structure as described in section 4 of RFC5280.
   3. Non-PEM content may appear before or after the "CERTIFICATE" PEM blocks and is unvalidated,
    to allow for explanatory text as described in section 5.2 of RFC7468.
  -->
  驗證要求：

  1. 證書必須包含一個或多個 PEM 塊。
  2. 所有的 PEM 塊必須有 “CERTIFICATE” 標籤，不包含頭和編碼的數據，
     必須是由 BER 編碼的 ASN.1 證書結構，如 RFC5280 第 4 節所述。
  3. 非 PEM 內容可能出現在 “CERTIFICATE”PEM 塊之前或之後，並且是未驗證的，
     允許如 RFC7468 5.2 節中描述的解釋性文本。

  <!-- 
  If more than one PEM block is present, and the definition of the requested spec.signerName does not indicate otherwise, 
  the first block is the issued certificate, and subsequent blocks should be treated as
  intermediate certificates and presented in TLS handshakes.
  -->
  如果存在多個 PEM 塊，並且所請求的 spec.signerName 的定義沒有另外說明，
  那麼第一個塊是頒發的證書，後續的塊應該被視爲中間證書並在 TLS 握手中呈現。

  <!-- 
  The certificate is encoded in PEM format.
  
  When serialized as JSON or YAML, the data is additionally base64-encoded, so it consists of:
  
      base64(
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
      )
  -->
  證書編碼爲 PEM 格式。
  
  當序列化爲 JSON 或 YAML 時，數據額外採用 base64 編碼，它包括：

  ```
  base64(
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
  )
  ```

<!-- 
- **conditions** ([]CertificateSigningRequestCondition)
  *Map: unique values on key type will be kept during a merge*
  
  conditions applied to the request. Known conditions are "Approved", "Denied", and "Failed".

  <a name="CertificateSigningRequestCondition"></a>
  *CertificateSigningRequestCondition describes a condition of a CertificateSigningRequest object*
-->
- **conditions** ([]CertificateSigningRequestCondition)

  **Map：鍵類型的唯一值將在合併期間保留**
  
  應用於請求的狀況。已知的狀況有 "Approved"、"Denied" 與 "Failed"。

  <a name="CertificateSigningRequestCondition"></a>
  **CertificateSigningRequestCondition 描述 CertificateSigningRequest 對象的狀況。**

  <!-- 
  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown. Approved, Denied, and Failed conditions may not be "False" or "Unknown".
  -->
  - **conditions.status** (string)，必需
  
    狀況的狀態，True、False、Unknown 之一。Approved、Denied 與 Failed 的狀況不可以是 "False" 或 "Unknown"。

  <!-- 
  - **conditions.type** (string), required
    type of the condition. Known conditions are "Approved", "Denied", and "Failed".
    
    An "Approved" condition is added via the /approval subresource, indicating the request was approved and should be issued by the signer.
    
    A "Denied" condition is added via the /approval subresource, indicating the request was denied and should not be issued by the signer.
    
    A "Failed" condition is added via the /status subresource, indicating the signer failed to issue the certificate.
    
    Approved and Denied conditions are mutually exclusive. Approved, Denied, and Failed conditions cannot be removed once added.
    
    Only one condition of a given type is allowed.
  -->
  - **conditions.type** (string)，必需
  
    狀況的類型。已知的狀況是 "Approved"、"Denied" 與 "Failed"。
    
    通過 /approval 子資源添加 “Approved” 狀況，表示請求已被批准並且應由簽名者頒發。
    
    通過 /approval 子資源添加 “Denied” 狀況，指示請求被拒絕並且不應由簽名者頒發。
    
    通過 /status 子資源添加 “Failed” 狀況，表示簽名者未能頒發證書。
    
    Approved 和 Denied 狀況是相互排斥的。Approved、Denied 和 Failed 狀況一旦添加就無法刪除。
    
    給定類型只允許設置一種狀況。

  <!-- 
  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime is the time the condition last transitioned from one status to another. 
	If unset, when a new condition type is added or an existing condition's status is changed, 
	the server defaults this to the current time.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  
	Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)
  
    lastTransitionTime 是狀況上一次從一種狀態轉換到另一種狀態的時間。
    如果未設置，當添加新狀況類型或更改現有狀況的狀態時，服務器默認爲當前時間。
  
    <a name="Time"></a>
    **Time 是 time.Time 的包裝器，支持正確編碼爲 YAML 和 JSON。爲 time 包提供的許多工廠方法提供了包裝器。**

  <!-- 
  - **conditions.lastUpdateTime** (Time)

    lastUpdateTime is the time of the last update to this condition

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  
	Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  - **conditions.lastUpdateTime** (Time)
  
    lastUpdateTime 是該狀況最後一次更新的時間。
  
    <a name="Time"></a>
    **Time 是 time.Time 的包裝器，支持正確編組爲 YAML 和 JSON。爲 time 包提供的許多工廠方法提供了包裝器。**
  
  <!-- 
  - **conditions.message** (string)

    message contains a human readable message with details about the request state
  -->
  - **conditions.message** (string)

    message 包含一個人類可讀的消息，包含關於請求狀態的詳細信息。

  <!-- 
  - **conditions.reason** (string)

    reason indicates a brief reason for the request state
  -->
  - **conditions.reason** (string)
  
    reason 表示請求狀態的簡短原因。

<!-- 
## CertificateSigningRequestList {#CertificateSigningRequestList}

CertificateSigningRequestList is a collection of CertificateSigningRequest objects

<hr>
-->
## CertificateSigningRequestList {#CertificateSigningRequestList}

CertificateSigningRequestList 是 CertificateSigningRequest 對象的集合。

<hr>

<!-- 
- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequestList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

- **items** ([]<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>), required

  items is a collection of CertificateSigningRequest objects
-->
- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequestList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

- **items** ([]<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>)，必需

  items 是 CertificateSigningRequest 對象的集合。

<!-- 
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!-- 
### `get` read the specified CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}
-->
### `get` 讀取指定的 CertificateSigningRequest

#### HTTP 請求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

<!-- 
### `get` read approval of the specified CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval
-->
### `get` 讀取指定 CertificateSigningRequest 的批准信息

#### HTTP 請求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` read status of the specified CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` 讀取指定 CertificateSigningRequest 的狀態

#### HTTP 請求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests
-->
### `list` list 或 watch CertificateSigningRequest 類型的對象

#### HTTP 請求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestList" >}}">CertificateSigningRequestList</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestList" >}}">CertificateSigningRequestList</a>): OK

401: Unauthorized

<!--
### `create` create a CertificateSigningRequest

#### HTTP Request

POST /apis/certificates.k8s.io/v1/certificatesigningrequests
-->
### `create` 創建一個 CertificateSigningRequest

#### HTTP 請求

POST /apis/certificates.k8s.io/v1/certificatesigningrequests

<!--
#### Parameters

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
#### 參數

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Accepted

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CertificateSigningRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Parameters
-->
### `update` 替換指定的 CertificateSigningRequest

#### HTTP 請求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `update` replace approval of the specified CertificateSigningRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Parameters
-->
### `update` 替換對指定 CertificateSigningRequest 的批准信息

#### HTTP 請求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified CertificateSigningRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Parameters
-->
### `update` 替換指定 CertificateSigningRequest 的狀態

#### HTTP 請求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CertificateSigningRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Parameters
-->
### `patch` 部分更新指定的 CertificateSigningRequest

#### HTTP 請求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `patch` partially update approval of the specified CertificateSigningRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Parameters
-->
### `patch` 部分更新指定 CertificateSigningRequest 的批准信息

#### HTTP 請求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified CertificateSigningRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 CertificateSigningRequest 的狀態

#### HTTP 請求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `delete` delete a CertificateSigningRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Parameters
-->
### `delete` 刪除一個 CertificateSigningRequest

#### HTTP 請求

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路徑參數**): string，必需

  CertificateSigningRequest 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
  
<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CertificateSigningRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests

#### Parameters
-->
### `deletecollection` 刪除 CertificateSigningRequest 集合

#### HTTP 請求

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests

#### 參數

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
  
<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
  
<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
