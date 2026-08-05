---
title: Pod 安全策略
id: pod-security-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/security/pod-security-policy/
short_description: >
  移除了强制执行 Pod 安全限制的 API。

aka:
tags:
- security
---
<!--
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  Removed API that enforced Pod security restrictions.

aka:
tags:
- security
-->

<!--
A former Kubernetes API that enforced security restrictions during {{< glossary_tooltip term_id="pod" >}} creation and updates.
-->
以前的 Kubernetes API，在 {{< glossary_tooltip text="Pod" term_id="pod" >}}
创建和更新期间强制执行安全限制。

<!--more-->

<!--
PodSecurityPolicy was deprecated as of Kubernetes v1.21, and removed in v1.25.
As an alternative, use [Pod Security Admission](/docs/concepts/security/pod-security-admission/), or a 3rd party admission plugin.
-->
PodSecurityPolicy 已于 Kubernetes v1.21 起弃用，并在 v1.25 中删除。
作为替代方案，请使用
[Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或第三方准入插件。
