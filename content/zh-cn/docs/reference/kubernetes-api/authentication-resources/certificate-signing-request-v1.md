---
api_metadata:
  apiVersion: "certificates.k8s.io/v1"
  import: "k8s.io/api/certificates/v1"
  kind: "CertificateSigningRequest"
content_type: "api_reference"
description: "CertificateSigningRequest 对象提供了一种通过提交证书签名请求并异步批准和颁发 x509 证书的机制。"
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

<!--
`apiVersion: certificates.k8s.io/v1`

`import "k8s.io/api/certificates/v1"`
-->
`apiVersion: certificates.k8s.io/v1`

`import "k8s.io/api/certificates/v1"`

<!--
## CertificateSigningRequest {#CertificateSigningRequest}
-->
## 证书签名请求 CertificateSigningRequest {#CertificateSigningRequest}

<!--
CertificateSigningRequest objects provide a mechanism to obtain x509 certificates by submitting a certificate signing request, and having it asynchronously approved and issued.

Kubelets use this API to obtain:
 1. client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client-kubelet" signerName).
 2. serving certificates for TLS endpoints kube-apiserver can connect to securely (with the "kubernetes.io/kubelet-serving" signerName).
-->
CertificateSigningRequest 对象提供了一种通过提交证书签名请求并异步批准和颁发 x509 证书的机制。

Kubelets 使用 CertificateSigningRequest API 来获取：

1. 向 kube-apiserver 进行身份认证的客户端证书（使用 “kubernetes.io/kube-apiserver-client-kubelet” signerName）。
2. kube-apiserver 可以安全连接到 TLS 端点的服务证书（使用 “kubernetes.io/kubelet-serving” signerName）。

<!--
This API can be used to request client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client" signerName), 
or to obtain certificates from custom non-Kubernetes signers.
-->
此 API 可用于请求客户端证书以向 kube-apiserver 进行身份验证（使用 “kubernetes.io/kube-apiserver-client”
签名者名称），或从自定义非 Kubernetes 签名者那里获取证书。

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

  spec 包含证书请求，并且在创建后是不可变的。
  只有 request、signerName、expirationSeconds 和 usages 字段可以在创建时设置。
  其他字段由 Kubernetes 派生，用户无法修改。
  
<!--
- **status** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestStatus" >}}">
  CertificateSigningRequestStatus</a>)

  status contains information about whether the request is approved or denied, and the certificate issued by the signer, 
  or the failure condition indicating signer failure.
-->
- **status** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestStatus" >}}">
  CertificateSigningRequestStatus</a>)

  status 包含有关请求是被批准还是拒绝的信息，以及签名者颁发的证书或指示签名者失败的状况。

<!--
## CertificateSigningRequestSpec {#CertificateSigningRequestSpec}

CertificateSigningRequestSpec contains the certificate request.
-->
## CertificateSigningRequestSpec {#CertificateSigningRequestSpec}

CertificateSigningRequestSpec 包含证书请求。

<hr>
<!--
- **request** ([]byte), required

  *Atomic: will be replaced during a merge*
  
  request contains an x509 certificate signing request encoded in a "CERTIFICATE REQUEST" PEM block. 
  When serialized as JSON or YAML, the data is additionally base64-encoded.
-->

- **request** ([]byte)，必需

  **Atomic：将在合并期间被替换**

  request 包含一个在 “CERTIFICATE REQUEST” PEM 块中编码的 x509 证书签名请求。
  当序列化为 JSON 或 YAML 时，数据额外采用 base64 编码。

<!--
- **signerName** (string), required

  signerName indicates the requested signer, and is a qualified name.
  
  List/watch requests for CertificateSigningRequests can filter on this field using a "spec.signerName=NAME" fieldSelector.
-->
- **signerName** (string)，必需

  signerName 表示请求的签名者，是一个限定名。

  CertificateSigningRequests 的 list/watch 请求可以使用 “spec.signerName=NAME” 字段选择器进行过滤。
  
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
  众所周知的 Kubernetes 签名者有：

  1. “kubernetes.io/kube-apiserver-client”：颁发客户端证书，用于向 kube-apiserver 进行身份验证。
     对此签名者的请求永远不会被 kube-controller-manager 自动批准，
     可以由 kube-controller-manager 中的 “csrsigning” 控制器颁发。
  2. “kubernetes.io/kube-apiserver-client-kubelet”：颁发客户端证书，kubelet 用于向 kube-apiserver 进行身份验证。
     对此签名者的请求可以由 kube-controller-manager 中的 “csrapproving” 控制器自动批准，
     并且可以由 kube-controller-manager 中的 “csrsigning” 控制器颁发。
  3. “kubernetes.io/kubelet-serving” 颁发服务证书，kubelet 用于服务 TLS 端点，kube-apiserver 可以安全的连接到这些端点。
     对此签名者的请求永远不会被 kube-controller-manager 自动批准，
     可以由 kube-controller-manager 中的 “csrsigning” 控制器颁发。
  
  更多详细信息，请访问 https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers

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
  也可以指定自定义 signerName。签名者定义如下：

  1. 信任分发：信任（CA 证书包）是如何分发的。
  2. 许可的主体：当请求不允许的主体时的行为。
  3. 请求中必需、许可或禁止的 x509 扩展（包括是否允许 subjectAltNames、哪些类型、对允许值的限制）
     以及请求不允许的扩展时的行为。
  4. 必需、许可或禁止的密钥用途/扩展密钥用途。
  5. 过期/证书生命周期：是否由签名者确定，管理员可配置。
  6. 是否允许申请 CA 证书。

<!--
- **expirationSeconds** (int32)

  expirationSeconds is the requested duration of validity of the issued certificate. 
  The certificate signer may issue a certificate with a different validity duration so 
  a client must check the delta between the notBefore and and notAfter fields 
  in the issued certificate to determine the actual duration.
-->
- **expirationSeconds** (int32)

  expirationSeconds 是所颁发证书的所请求的有效期。
  证书签署者可以颁发具有不同有效期的证书，
  因此客户端必须检查颁发证书中 notBefore 和 notAfter 字段之间的增量以确定实际持续时间。

  <!--
  The v1.22+ in-tree implementations of the well-known Kubernetes signers will honor this field 
  as long as the requested duration is not greater than the maximum duration they will honor per the 
  --cluster-signing-duration CLI flag to the Kubernetes controller manager.
  -->
  众所周知的 Kubernetes 签名者在 v1.22+ 版本内实现将遵守此字段，
  只要请求的持续时间不大于最大持续时间，它们将遵守 Kubernetes 控制管理器的
  --cluster-signing-duration CLI 标志。
  
  <!--
  Certificate signers may not honor this field for various reasons:
  
    1. Old signer that is unaware of the field (such as the in-tree
       implementations prior to v1.22)
    2. Signer whose configured maximum is shorter than the requested duration
    3. Signer whose configured minimum is longer than the requested duration
  
  The minimum valid value for expirationSeconds is 600, i.e. 10 minutes.  
  -->
  由于各种原因，证书签名者可能忽略此字段:

  1. 不认识此字段的旧签名者(如 v1.22 版本之前的实现)
  2. 配置的最大持续时间小于请求持续时间的签名者
  3. 配置的最小持续时间大于请求持续时间的签名者

  expirationSeconds 的最小有效值为 600，即 10 分钟。

<!-- 
- **extra** (map[string][]string)

  extra contains extra attributes of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **extra** (map[string][]string)

  extra 包含创建 CertificateSigningRequest 的用户的额外属性。
  在创建时由 API 服务器填充，且不可变。

<!-- 
- **groups** ([]string)

  *Atomic: will be replaced during a merge*
  
  groups contains group membership of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **groups** ([]string)

  **Atomic：将在合并过程中被替换**

  groups 包含创建 CertificateSigningRequest 的用户的组成员关系。
  在创建时由 API 服务器填充，且不可变。

<!-- 
- **uid** (string)

  uid contains the uid of the user that created the CertificateSigningRequest. 
  Populated by the API server on creation and immutable.
-->
- **uid** (string)

  uid 包含创建 CertificateSigningRequest 的用户的 uid 。
  在创建时由 API 服务器填充，且不可变。

<!-- 
- **usages** ([]string)

  *Atomic: will be replaced during a merge*
  
  usages specifies a set of key usages requested in the issued certificate.
  
  Requests for TLS client certificates typically request: "digital signature", "key encipherment", "client auth".
  
  Requests for TLS serving certificates typically request: "key encipherment", "digital signature", "server auth".
-->
- **usages** ([]string)

  **Atomic：将在合并期间被替换**

  usages 指定颁发证书中请求的一组密钥用途。

  TLS 客户端证书的请求通常要求："digital signature"、"key encipherment"、"client auth"。

  TLS 服务证书的请求通常要求："key encipherment"、"digital signature"、"server auth"。

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
  
  username 包含创建 CertificateSigningRequest 的用户名。
  在创建时由 API 服务器填充，且不可变。

<!-- 
## CertificateSigningRequestStatus {#CertificateSigningRequestStatus}

CertificateSigningRequestStatus contains conditions used to indicate approved/denied/failed status of the request, 
and the issued certificate.

<hr>
-->
## CertificateSigningRequestStatus {#CertificateSigningRequestStatus}

CertificateSigningRequestStatus 包含用于指示请求的批准/拒绝/失败状态和颁发证书的状况。

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

  **Atomic：将在合并期间被替换**
  
  certificate 在出现 Approved 状况后，由签名者使用已颁发的证书填充。
  这个字段通过 /status 子资源设置。填充后，该字段将不可变。

  如果证书签名请求被拒绝，则添加类型为 “Denied” 的状况，并且保持该字段为空。
  如果签名者不能颁发证书，则添加类型为 “Failed” 的状况，并且保持该字段为空。

  <!-- 
  Validation requirements:
   1. certificate must contain one or more PEM blocks.
   2. All PEM blocks must have the "CERTIFICATE" label, contain no headers, and the encoded data
    must be a BER-encoded ASN.1 Certificate structure as described in section 4 of RFC5280.
   3. Non-PEM content may appear before or after the "CERTIFICATE" PEM blocks and is unvalidated,
    to allow for explanatory text as described in section 5.2 of RFC7468.
  -->
  验证要求:

  1. 证书必须包含一个或多个 PEM 块。
  2. 所有的 PEM 块必须有 “CERTIFICATE” 标签，不包含头和编码的数据，
     必须是由 BER 编码的 ASN.1 证书结构，如 RFC5280 第 4 节所述。
  3. 非 PEM 内容可能出现在 “CERTIFICATE”PEM 块之前或之后，并且是未验证的，
     允许如 RFC7468 5.2 节中描述的解释性文本。

  <!-- 
  If more than one PEM block is present, and the definition of the requested spec.signerName does not indicate otherwise, 
  the first block is the issued certificate, and subsequent blocks should be treated as
  intermediate certificates and presented in TLS handshakes.
  -->
  如果存在多个 PEM 块，并且所请求的 spec.signerName 的定义没有另外说明，
  那么第一个块是颁发的证书，后续的块应该被视为中间证书并在 TLS 握手中呈现。

  <!-- 
  The certificate is encoded in PEM format.
  
  When serialized as JSON or YAML, the data is additionally base64-encoded, so it consists of:
  
      base64(
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
      )
  -->
  证书编码为 PEM 格式。
  
  当序列化为 JSON 或 YAML 时，数据额外采用 base64 编码，它包括:

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

  **Map：键类型的唯一值将在合并期间保留**
  
  应用于请求的状况。已知的状况有 "Approved"、"Denied" 与 "Failed"。

  <a name="CertificateSigningRequestCondition"></a>
  **CertificateSigningRequestCondition 描述 CertificateSigningRequest 对象的状况。**

  <!-- 
  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown. Approved, Denied, and Failed conditions may not be "False" or "Unknown".
  -->
  - **conditions.status** (string)，必需
  
    状况的状态，True、False、Unknown 之一。Approved、Denied 与 Failed 的状况不可以是 "False" 或 "Unknown"。

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
  
    状况的类型。已知的状况是 "Approved"、"Denied" 与 "Failed"。
    
    通过 /approval 子资源添加 “Approved” 状况，表示请求已被批准并且应由签名者颁发。
    
    通过 /approval 子资源添加 “Denied” 状况，指示请求被拒绝并且不应由签名者颁发。
    
    通过 /status 子资源添加 “Failed” 状况，表示签名者未能颁发证书。
    
    Approved 和 Denied 状况是相互排斥的。Approved、Denied 和 Failed 状况一旦添加就无法删除。
    
    给定类型只允许设置一种状况。

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
  
    lastTransitionTime 是状况上一次从一种状态转换到另一种状态的时间。
    如果未设置，当添加新状况类型或更改现有状况的状态时，服务器默认为当前时间。
  
    <a name="Time"></a>
    **Time 是 time.Time 的包装器，支持正确编码为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。**

  <!-- 
  - **conditions.lastUpdateTime** (Time)

    lastUpdateTime is the time of the last update to this condition

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  
	Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  - **conditions.lastUpdateTime** (Time)
  
    lastUpdateTime 是该状况最后一次更新的时间。
  
    <a name="Time"></a>
    **Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。**
  
  <!-- 
  - **conditions.message** (string)

    message contains a human readable message with details about the request state
  -->
  - **conditions.message** (string)

    message 包含一个人类可读的消息，包含关于请求状态的详细信息。

  <!-- 
  - **conditions.reason** (string)

    reason indicates a brief reason for the request state
  -->
  - **conditions.reason** (string)
  
    reason 表示请求状态的简短原因。

<!-- 
## CertificateSigningRequestList {#CertificateSigningRequestList}

CertificateSigningRequestList is a collection of CertificateSigningRequest objects

<hr>
-->
## CertificateSigningRequestList {#CertificateSigningRequestList}

CertificateSigningRequestList 是 CertificateSigningRequest 对象的集合。

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

  items 是 CertificateSigningRequest 对象的集合。

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
### `get` 读取指定的 CertificateSigningRequest

#### HTTP 请求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

<!-- 
### `get` read approval of the specified CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval
-->
### `get` 读取指定 CertificateSigningRequest 的批准信息

#### HTTP 请求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` read status of the specified CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` 读取指定 CertificateSigningRequest 的状态

#### HTTP 请求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CertificateSigningRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1/certificatesigningrequests
-->
### `list` list 或 watch CertificateSigningRequest 类型的对象

#### HTTP 请求

GET /apis/certificates.k8s.io/v1/certificatesigningrequests

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
#### 参数

- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

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
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestList" >}}">CertificateSigningRequestList</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestList" >}}">CertificateSigningRequestList</a>): OK

401: Unauthorized

<!--
### `create` create a CertificateSigningRequest

#### HTTP Request

POST /apis/certificates.k8s.io/v1/certificatesigningrequests
-->
### `create` 创建一个 CertificateSigningRequest

#### HTTP 请求

POST /apis/certificates.k8s.io/v1/certificatesigningrequests

<!--
#### Parameters

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
#### 参数

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Accepted

401: Unauthorized
-->
#### 响应

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
### `update` 替换指定的 CertificateSigningRequest

#### HTTP 请求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `update` replace approval of the specified CertificateSigningRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Parameters
-->
### `update` 替换对指定 CertificateSigningRequest 的批准信息

#### HTTP 请求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified CertificateSigningRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Parameters
-->
### `update` 替换指定 CertificateSigningRequest 的状态

#### HTTP 请求

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

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
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

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

#### HTTP 请求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

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

#### HTTP 请求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified CertificateSigningRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 CertificateSigningRequest 的状态

#### HTTP 请求

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
#### Response

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

<!--
### `delete` delete a CertificateSigningRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Parameters
-->
### `delete` 删除一个 CertificateSigningRequest

#### HTTP 请求

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **name** (**路径参数**): string，必需

  CertificateSigningRequest 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
  
<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CertificateSigningRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests

#### Parameters
-->
### `deletecollection` 删除 CertificateSigningRequest 集合

#### HTTP 请求

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests

#### 参数

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

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
  
<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

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
- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
  
<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
