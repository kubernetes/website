---
title: 审计注解
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
此页面是 kubernetes.io 命名空间中的审计注解的参考文档。
这些注解会被应用到 `audit.k8s.io` API 组中的 `Event` 对象中。

<!--
The following annotations are not used within the Kubernetes API. When you
[enable auditing](/docs/tasks/debug-application-cluster/audit/) in your cluster,
audit event data is written using `Event` from API group `audit.k8s.io`.
The annotations apply to audit events. Audit events are different from objects in the
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group
`events.k8s.io`).
-->
{{< note >}}
下列注解并未用在 Kubernetes API 中。
当你在集群中[启用审计](/zh/docs/tasks/debug-application-cluster/audit/)时，审计事件的数据将通过
`audit.k8s.io` API 组中的 `Event` 对象来记录。
注解会被应用到审计事件中。审计事件与
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/)（`events.k8s.io` API 组）中的对象不同。
{{< /note >}}

<!-- body -->

<!--
## pod-security.kubernetes.io/exempt

Example: `pod-security.kubernetes.io/exempt: namespace`

Value **must** be one of `user`, `namespace`, or `runtimeClass` which correspond to
[Pod Security Exemption](/docs/concepts/security/pod-security-admission/#exemptions)
dimensions. This annotation indicates on which dimension was based the exemption
from the PodSecurity enforcement.
-->
## pod-security.kubernetes.io/exempt

示例：`pod-security.kubernetes.io/exempt: namespace`

此注解的值**必须**是 `user`、`namespace`、`runtimeClass` 之一，对应
[Pod 安全性豁免](/zh/docs/concepts/security/pod-security-admission/#exemptions)维度。
此注解标示了 Pod 安全性豁免的维度。

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
## pod-security.kubernetes.io/enforce-policy

示例：`pod-security.kubernetes.io/enforce-policy: restricted:latest`

此注解的值**必须**是 `privileged:<version>`、`baseline:<version>`、`restricted:<version>`
之一，对应 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)中定义的级别。
`<version>` **必须**是 `latest` 或一个以 `v<MAJOR>.<MINOR>` 格式表示的有效的 Kubernets 版本号。
此注解标示了 Pod 安全性准入过程中执行批准或拒绝的级别。

更多信息请查阅 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)。

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
## pod-security.kubernetes.io/audit-violations

示例：`pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

此注解详细描述了一次审计策略的违背信息，其中包含了所触犯的
[Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)级别以及具体的策略。

更多信息请查阅 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)。