---
title: "审计注解"
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
该页面作为 kubernetes.io 名字空间的审计注解的参考。这些注解适用于 API 组
`audit.k8s.io` 中的 `Event` 对象。

{{< note >}}
<!--
The following annotations are not used within the Kubernetes API. When you
[enable auditing](/docs/tasks/debug/debug-cluster/audit/) in your cluster,
audit event data is written using `Event` from API group `audit.k8s.io`.
The annotations apply to audit events. Audit events are different from objects in the
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group
`events.k8s.io`).
-->
Kubernetes API 中不使用以下注解。当你在集群中[启用审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)时，
审计事件数据将使用 API 组 `audit.k8s.io` 中的 `Event` 写入。
注解适用于审计事件。
审计事件不同于[事件 API](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)
（API 组 `events.k8s.io`）中的对象。
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

值**必须**为 "true" 或 "false"。值为 "true" 时表示该请求使用了已弃用的 API 版本。

<!--
## k8s.io/removed-release

Example: `k8s.io/removed-release: "1.22"`

Value **must** be in the format "<major>.<minor>". It is set to target the removal release
on requests made to deprecated API versions with a target removal release.
-->
## k8s.io/removed-release {#k8s-io-removed-release} 

例子：`k8s.io/removed-release: "1.22"`

值**必须**为 "<major>.<minor>" 的格式。当请求使用了已弃用的 API 版本时，
该值会被设置为目标移除的版本。

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

值**必须**是对应于 [Pod 安全豁免](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)维度的 
`user`、`namespace` 或 `runtimeClass` 之一。
此注解指示 PodSecurity 基于哪个维度的强制豁免执行。

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

值**必须**是对应于 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)级别的
`privileged:<版本>`、`baseline:<版本>`、`restricted:<版本>`，
关联的版本**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解通知有关在 PodSecurity 准入期间允许或拒绝 Pod 的执行级别。

有关详细信息，请参阅 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)。

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

注解值给出审计策略违规的详细说明，它包含所违反的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)级别以及
PodSecurity 执行中违反的特定策略及对应字段。

有关详细信息，请参阅 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)。

<!--
## authorization.k8s.io/decision

Example: `authorization.k8s.io/decision: "forbid"`

This annotation indicates whether or not a request was authorized in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.
-->
## authorization.k8s.io/decision {#authorization-k8s-io-decision}

例子：`authorization.k8s.io/decision: "forbid"`

此注解在 Kubernetes 审计日志中表示请求是否获得授权。

有关详细信息，请参阅[审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)。

<!--
## authorization.k8s.io/reason

Example: `authorization.k8s.io/reason: "Human-readable reason for the decision"`

This annotation gives reason for the [decision](#authorization-k8s-io-decision) in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.
-->
## authorization.k8s.io/reason {#authorization-k8s-io-reason}

例子：`authorization.k8s.io/reason: "Human-readable reason for the decision"`

此注解给出了 Kubernetes 审计日志中 [decision](#authorization-k8s-io-decision) 的原因。

有关详细信息，请参阅[审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)。

## missing-san.invalid-cert.kubernetes.io/$hostname {#missing-san-invalid-cert-kubernetes-io-hostname}

<!--
Example: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

Used by Kubernetes version v1.24 and later
-->
例子：`missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

由 Kubernetes v1.24 及更高版本使用

<!--
This annotation indicates a webhook or aggregated API server
is using an invalid certificate that is missing `subjectAltNames`.
Support for these certificates was disabled by default in Kubernetes 1.19,
and removed in Kubernetes 1.23.
-->
此注解表示 webhook 或聚合 API 服务器正在使用缺少 `subjectAltNames` 的无效证书。
Kubernetes 1.19 已经默认禁用，且 Kubernetes 1.23 已经移除对这些证书的支持。

<!--
Requests to endpoints using these certificates will fail.
Services using these certificates should replace them as soon as possible
to avoid disruption when running in Kubernetes 1.23+ environments.
-->
使用这些证书向端点发出的请求将失败。
使用这些证书的服务应尽快替换它们，以避免在 Kubernetes 1.23+ 环境中运行时中断。

<!--
There's more information about this in the Go documentation:
[X.509 CommonName deprecation](https://go.dev/doc/go1.15#commonname).
-->
Go 文档中有更多关于此的信息：
[X.509 CommonName 弃用](https://go.dev/doc/go1.15#commonname)。

## insecure-sha1.invalid-cert.kubernetes.io/$hostname {#insecure-sha1-invalid-cert-kubernetes-io-hostname}

<!--
Example: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`
Used by Kubernetes version v1.24 and later
-->

例子：`insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`

由 Kubernetes v1.24 及更高版本使用

<!--
This annotation indicates a webhook or aggregated API server
is using an insecure certificate signed with a SHA-1 hash.
Support for these insecure certificates is disabled by default in Kubernetes 1.24,
and will be removed in a future release.
-->
此注解表示 webhook 或聚合 API 服务器所使用的是使用 SHA-1 签名的不安全证书。
Kubernetes 1.24 已经默认禁用，并将在未来的版本中删除对这些证书的支持。

<!--
Services using these certificates should replace them as soon as possible,
to ensure connections are secured properly and to avoid disruption in future releases.
-->
使用这些证书的服务应尽快替换它们，以确保正确保护连接并避免在未来版本中出现中断。

<!--
There's more information about this in the Go documentation:
[Rejecting SHA-1 certificates](https://go.dev/doc/go1.18#sha1).
-->
Go 文档中有更多关于此的信息：
[拒绝 SHA-1 证书](https://go.dev/doc/go1.18#sha1)。

## validation.policy.admission.k8s.io/validation_failure

<!--
Example: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`
-->
例子：`validation.policy.admission.k8s.io/validation_failure:
'[{"message": "Invalid value", {"policy": "policy.example.com",
{"binding": "policybinding.example.com", {"expressionIndex": "1",
{"validationActions": ["Audit"]}]'`

<!--
Used by Kubernetes version v1.27 and later.

This annotation indicates that a admission policy validation evaluated to false
for an API request, or that the validation resulted in an error while the policy
was configured with `failurePolicy: Fail`.
-->
由 Kubernetes v1.27 及更高版本使用。

此注解表示 API 请求的准入策略验证评估为 false，
或者当策略配置为 `failurePolicy: Fail` 时验证报错。

<!--
The value of the annotation is a JSON object. The `message` in the JSON
provides the message about the validation failure.
-->
注解的值是一个 JSON 对象。JSON 中的 `message`
字段提供了有关验证失败的信息。

<!--
The `policy`, `binding` and `expressionIndex` in the JSON identifies the
name of the `ValidatingAdmissionPolicy`, the name of the
`ValidatingAdmissionPolicyBinding` and the index in the policy `validations` of
the CEL expressions that failed, respectively.
-->
JSON 中的 `policy`、`binding` 和 `expressionIndex`
分别标识了 `ValidatingAdmissionPolicy` 的名称、
`ValidatingAdmissionPolicyBinding` 的名称以及失败的
CEL 表达式在策略 `validations` 中的索引。

<!--
The `validationActions` shows what actions were taken for this validation failure.
See [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
for more details about `validationActions`.
-->
`validationActions` 显示针对此验证失败采取的操作。
有关 `validationActions` 的更多详细信息，
请参阅[验证准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)。

