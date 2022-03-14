---
title: "审计注解"
weight: 1
---

<!-- overview -->

该页面作为 kubernetes.io Namespace的审计注解的参考。这些注解适用于 API 组 `audit.k8s.io` 中的 `Event` 对象。

{{< note >}}
Kubernetes API 中不使用以下注解。当你在集群中[启用审计](/docs/tasks/debug-application-cluster/audit/) 时，审计事件数据将使用 API 组 `audit.k8s.io` 中的 `Event` 写入。
注解适用于审计事件。审计事件不同于 [事件 API](/docs/reference/kubernetes-api/cluster-resources/event-v1/)（API 组 `events.k8s.io`）中的对象。
{{</note>}}

<!-- body -->

## pod-security.kubernetes.io/exempt

例子：`pod-security.kubernetes.io/exempt: namespace`

值**必须**是对应于 [Pod 安全豁免](/docs/concepts/security/pod-security-admission/#exemptions) 维度的 `user`、`namespace` 或 `runtimeClass` 之一。 此注解指示 PodSecurity 基于哪个维度的强制豁免执行。


## pod-security.kubernetes.io/enforce-policy

例子：`pod-security.kubernetes.io/enforce-policy: restricted:latest`

值**必须**是对应于 [Pod 安全标准](/docs/concepts/security/pod-security-standards) 级别的 `privileged:<version>`, `baseline:<version>`,`restricted:<version>`，附带**必须**是 `最新 `的版本或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。此注解通知有关在 PodSecurity 准入期间允许或拒绝 pod 的执行级别。

有关详细信息，请参阅 [Pod 安全标准](/docs/concepts/security/pod-security-standards/)。

## pod-security.kubernetes.io/audit-violations

例子：`pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

值详细说明审计策略违规，它包含违反的 [Pod 安全标准](/docs/concepts/security/pod-security-standards/) 级别以及 PodSecurity 执行中违反的字段特定策略。

有关详细信息，请参阅 [Pod 安全标准](/docs/concepts/security/pod-security-standards/)。