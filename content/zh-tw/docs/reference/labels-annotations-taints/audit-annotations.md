---
title: "審計註解"
weight: 10
---
<!--
title: "Audit Annotations"
weight: 10
-->

<!-- overview -->
<!--
This page serves as a reference for the audit annotations of the kubernetes.io
namespace. These annotations apply to `Event` object from API group
`audit.k8s.io`.
-->
本頁面作爲 kubernetes.io 名字空間的審計註解的參考。這些註解適用於 API 組
`audit.k8s.io` 中的 `Event` 對象。

{{< note >}}
<!--
The following annotations are not used within the Kubernetes API. When you
[enable auditing](/docs/tasks/debug/debug-cluster/audit/) in your cluster,
audit event data is written using `Event` from API group `audit.k8s.io`.
The annotations apply to audit events. Audit events are different from objects in the
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group
`events.k8s.io`).
-->
Kubernetes API 中不使用以下註解。當你在叢集中[啓用審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)時，
審計事件資料將使用 API 組 `audit.k8s.io` 中的 `Event` 寫入。此註解適用於審計事件。
審計事件不同於 [Event API](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)
（API 組 `events.k8s.io`）中的對象。
{{</note>}}

<!-- body -->

<!--
## k8s.io/deprecated

Example: `k8s.io/deprecated: "true"`

Value **must** be "true" or "false". The value "true" indicates that the
request used a deprecated API version.
-->
## k8s.io/deprecated {#k8s-io-deprecated}

例子：`k8s.io/deprecated: "true"`

值**必須**爲 "true" 或 "false"。值爲 "true" 時表示該請求使用了已棄用的 API 版本。

<!--
## k8s.io/removed-release

Example: `k8s.io/removed-release: "1.22"`

Value **must** be in the format "\<MAJOR>\.\<MINOR>\". It is set to target the removal release
on requests made to deprecated API versions with a target removal release.
-->
## k8s.io/removed-release {#k8s-io-removed-release}

例子：`k8s.io/removed-release: "1.22"`

值**必須**爲 "\<MAJOR>\.\<MINOR>\" 的格式。當請求使用了已棄用的 API 版本時，
該值會被設置爲目標移除的版本。

<!--
## pod-security.kubernetes.io/exempt

Example: `pod-security.kubernetes.io/exempt: namespace`

Value **must** be one of `user`, `namespace`, or `runtimeClass` which correspond to
[Pod Security Exemption](/docs/concepts/security/pod-security-admission/#exemptions)
dimensions. This annotation indicates on which dimension was based the exemption
from the PodSecurity enforcement.
-->
## pod-security.kubernetes.io/exempt {#pod-security-kubernetes-io-exempt}

例子：`pod-security.kubernetes.io/exempt: namespace`

值**必須**是對應於 [Pod 安全豁免](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)維度的
`user`、`namespace` 或 `runtimeClass` 之一。
此註解指示 PodSecurity 基於哪個維度的強制豁免執行。

<!--
## pod-security.kubernetes.io/enforce-policy

Example: `pod-security.kubernetes.io/enforce-policy: restricted:latest`

Value **must** be `privileged:<version>`, `baseline:<version>`,
`restricted:<version>` which correspond to [Pod Security
Standard](/docs/concepts/security/pod-security-standards) levels accompanied by
a version which **must** be `latest` or a valid Kubernetes version in the format
`v<MAJOR>.<MINOR>`. This annotations informs about the enforcement level that
allowed or denied the pod during PodSecurity admission.

See [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for more information.
-->
## pod-security.kubernetes.io/enforce-policy {#pod-security-kubernetes-io-enforce-policy}

例子：`pod-security.kubernetes.io/enforce-policy: restricted:latest`

值**必須**是對應於 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)級別的
`privileged:<版本>`、`baseline:<版本>`、`restricted:<版本>`，
關聯的版本**必須**是 `latest` 或格式爲 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此註解通知有關在 PodSecurity 准入期間允許或拒絕 Pod 的執行級別。

有關詳細資訊，請參閱 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)。

<!--
## pod-security.kubernetes.io/audit-violations

Example:  `pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

Value details an audit policy violation, it contains the
[Pod Security Standard](/docs/concepts/security/pod-security-standards/) level
that was transgressed as well as the specific policies on the fields that were
violated from the PodSecurity enforcement.

See [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for more information.
-->
## pod-security.kubernetes.io/audit-violations {#pod-security-kubernetes-io-audit-violations}

例子：`pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

註解值給出審計策略違規的詳細說明，它包含所違反的
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)級別以及
PodSecurity 執行中違反的特定策略及對應字段。

有關詳細資訊，請參閱 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)。

<!--
## apiserver.latency.k8s.io/etcd

Example: `apiserver.latency.k8s.io/etcd: "4.730661757s"`

This annotation indiactes the measure of latency incurred inside the storage layer,
it accounts for the time it takes to send data to the etcd and get the complete response back.

The value of this audit annotation does not include the time incurred in admission, or validation.
-->
## apiserver.latency.k8s.io/etcd

例子：`apiserver.latency.k8s.io/etcd: "4.730661757s"`

此註解表示在儲存層內部產生的延遲測量，  
它記錄將資料發送到 etcd 並接收完整響應所花費的時間。

此審計註解的取值不包括准入或校驗過程所耗用的時間。

<!--
## apiserver.latency.k8s.io/decode-response-object

Example: `apiserver.latency.k8s.io/decode-response-object: "450.6649ns"`

This annotation records the time taken to decode the response received from the storage layer (etcd)
-->
## apiserver.latency.k8s.io/decode-response-object

例子：`apiserver.latency.k8s.io/decode-response-object: "450.6649ns"`

此註解記錄解碼從儲存層（etcd）接收到的響應對象所花費的時間。

<!--
## apiserver.latency.k8s.io/apf-queue-wait

Example: `apiserver.latency.k8s.io/apf-queue-wait: "100ns"`

This annotation records the time that a request spent queued due to API server priorities.

See [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/) (APF)
for more information about this mechanism.
-->
## apiserver.latency.k8s.io/apf-queue-wait

例子：`apiserver.latency.k8s.io/apf-queue-wait: "100ns"`

此註解記錄由於 API 伺服器優先級機制，請求在隊列中等待的時間。

有關此機制的更多資訊，參見
[API 優先級與公平性](/zh-cn/docs/concepts/cluster-administration/flow-control/)（APF）。

<!--
## authorization.k8s.io/decision

Example: `authorization.k8s.io/decision: "forbid"`

Value must be **forbid** or **allow**. This annotation indicates whether or not a request
was authorized in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.
-->
## authorization.k8s.io/decision {#authorization-k8s-io-decision}

例子：`authorization.k8s.io/decision: "forbid"`

值必須是 **forbid** 或者 **allow**。
此註解在 Kubernetes 審計日誌中表示請求是否獲得授權。

有關詳細資訊，請參閱[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)。

<!--
## authorization.k8s.io/reason

Example: `authorization.k8s.io/reason: "Human-readable reason for the decision"`

This annotation gives reason for the [decision](#authorization-k8s-io-decision) in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.
-->
## authorization.k8s.io/reason {#authorization-k8s-io-reason}

例子：`authorization.k8s.io/reason: "Human-readable reason for the decision"`

此註解給出了 Kubernetes 審計日誌中 [decision](#authorization-k8s-io-decision) 的原因。

有關詳細資訊，請參閱[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)。

## missing-san.invalid-cert.kubernetes.io/$hostname {#missing-san-invalid-cert-kubernetes-io-hostname}

<!--
Example: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

Used by Kubernetes version v1.24 and later
-->
例子：`missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

由 Kubernetes v1.24 及更高版本使用。

<!--
This annotation indicates a webhook or aggregated API server
is using an invalid certificate that is missing `subjectAltNames`.
Support for these certificates was disabled by default in Kubernetes 1.19,
and removed in Kubernetes 1.23.
-->
此註解表示 Webhook 或聚合 API 伺服器正在使用缺少 `subjectAltNames` 的無效證書。
Kubernetes 1.19 已經預設禁用，且 Kubernetes 1.23 已經移除對這些證書的支持。

<!--
Requests to endpoints using these certificates will fail.
Services using these certificates should replace them as soon as possible
to avoid disruption when running in Kubernetes 1.23+ environments.
-->
使用這些證書向端點發出的請求將失敗。
使用這些證書的服務應儘快替換它們，以避免在 Kubernetes 1.23+ 環境中運行時中斷。

<!--
There's more information about this in the Go documentation:
[X.509 CommonName deprecation](https://go.dev/doc/go1.15#commonname).
-->
Go 文檔中有更多關於此的資訊：
[X.509 CommonName 棄用](https://go.dev/doc/go1.15#commonname)。

## insecure-sha1.invalid-cert.kubernetes.io/$hostname {#insecure-sha1-invalid-cert-kubernetes-io-hostname}

<!--
Example: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`

Used by Kubernetes version v1.24 and later
-->
例子：`insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`

由 Kubernetes v1.24 及更高版本使用。

<!--
This annotation indicates a webhook or aggregated API server
is using an insecure certificate signed with a SHA-1 hash.
Support for these insecure certificates is disabled by default in Kubernetes 1.24,
and will be removed in a future release.
-->
此註解表示 Webhook 或聚合 API 伺服器所使用的是使用 SHA-1 簽名的不安全證書。
Kubernetes 1.24 已經預設禁用，並將在未來的版本中刪除對這些證書的支持。

<!--
Services using these certificates should replace them as soon as possible,
to ensure connections are secured properly and to avoid disruption in future releases.
-->
使用這些證書的服務應儘快替換它們，以確保正確保護連接並避免在未來版本中出現中斷。

<!--
There's more information about this in the Go documentation:
[Rejecting SHA-1 certificates](https://go.dev/doc/go1.18#sha1).
-->
Go 文檔中有更多關於此的資訊：
[拒絕 SHA-1 證書](https://go.dev/doc/go1.18#sha1)。

## validation.policy.admission.k8s.io/validation_failure

<!--
Example: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`
-->
例子：`validation.policy.admission.k8s.io/validation_failure: '[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`

<!--
Used by Kubernetes version v1.27 and later.

This annotation indicates that a admission policy validation evaluated to false
for an API request, or that the validation resulted in an error while the policy
was configured with `failurePolicy: Fail`.
-->
由 Kubernetes v1.27 及更高版本使用。

此註解表示 API 請求的准入策略驗證評估爲 false，
或者當策略設定爲 `failurePolicy: Fail` 時驗證報錯。

<!--
The value of the annotation is a JSON object. The `message` in the JSON
provides the message about the validation failure.
-->
註解的值是一個 JSON 對象。JSON 中的 `message`
字段提供了有關驗證失敗的資訊。

<!--
The `policy`, `binding` and `expressionIndex` in the JSON identifies the
name of the `ValidatingAdmissionPolicy`, the name of the
`ValidatingAdmissionPolicyBinding` and the index in the policy `validations` of
the CEL expressions that failed, respectively.
-->
JSON 中的 `policy`、`binding` 和 `expressionIndex`
分別標識了 `ValidatingAdmissionPolicy` 的名稱、
`ValidatingAdmissionPolicyBinding` 的名稱以及失敗的
CEL 表達式在策略 `validations` 中的索引。

<!--
The `validationActions` shows what actions were taken for this validation failure.
See [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
for more details about `validationActions`.
-->
`validationActions` 顯示針對此驗證失敗採取的操作。
有關 `validationActions` 的更多詳細資訊，
請參閱[驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)。
