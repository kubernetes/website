---
title: "审计注解"
weight: 1
---
<!--
title: "Audit Annotations"
weight: 1
-->

<!-- overview -->
<!--
This page serves as a reference for the audit annotations of the kubernetes.io
namespace. These annotations apply to `Event` object from API group
`audit.k8s.io`.
-->
该页面作为 kubernetes.io 名字空间的审计注解的参考。这些注解适用于 API 组 `audit.k8s.io` 中的 `Event` 对象。

<!--
The following annotations are not used within the Kubernetes API. When you
[enable auditing](/docs/tasks/debug-application-cluster/audit/) in your cluster,
audit event data is written using `Event` from API group `audit.k8s.io`.
The annotations apply to audit events. Audit events are different from objects in the
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group
`events.k8s.io`).
-->
{{< note >}}
Kubernetes API 中不使用以下注解。当你在集群中[启用审计](/zh/docs/tasks/debug-application-cluster/audit/)时，
审计事件数据将使用 API 组 `audit.k8s.io` 中的 `Event` 写入。
注解适用于审计事件。审计事件不同于[事件 API ](/zh/docs/reference/kubernetes-api/cluster-resources/event-v1/)
（API 组 `events.k8s.io`）中的对象。
{{</note>}}

<!-- body -->
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

值**必须**是对应于 [Pod 安全豁免](/zh/docs/concepts/security/pod-security-admission/#exemptions)维度的 
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

值**必须**是对应于 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards) 级别的
`privileged:<版本>`、`baseline:<版本>`、`restricted:<版本>`，
关联的版本**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解通知有关在 PodSecurity 准入期间允许或拒绝 Pod 的执行级别。

有关详细信息，请参阅 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)。

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
for more information
-->
## pod-security.kubernetes.io/audit-violations {#pod-security-kubernetes-io-audit-violations}

例子：`pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

注解值给出审计策略违规的详细说明，它包含所违反的 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)级别以及
PodSecurity 执行中违反的特定策略及对应字段。

有关详细信息，请参阅 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)。