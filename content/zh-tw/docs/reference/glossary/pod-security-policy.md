---
title: Pod 安全策略
id: pod-security-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/security/pod-security-policy/
short_description: >
  爲 Pod 的創建和更新操作啓用細粒度的授權。

aka:
tags:
- core-object
- fundamental
---
<!--
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  Enables fine-grained authorization of pod creation and updates.

aka:
tags:
- core-object
- fundamental
-->

<!--
 Enables fine-grained authorization of {{< glossary_tooltip term_id="pod" >}} creation and updates.
-->

爲 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的創建和更新操作啓用細粒度的授權。

<!--more-->

<!--
A cluster-level resource that controls security sensitive aspects of the Pod specification. The `PodSecurityPolicy` objects define a set of conditions that a Pod must run with in order to be accepted into the system, as well as defaults for the related fields. Pod Security Policy control is implemented as an optional admission controller.
-->

Pod 安全策略是叢集級別的資源，它控制着 Pod 規約中的安全性敏感的內容。
`PodSecurityPolicy` 對象定義了一組條件以及相關字段的預設值，Pod
運行時必須滿足這些條件。Pod 安全策略控制實現上體現爲一個可選的准入控制器。

<!--
PodSecurityPolicy was deprecated as of Kubernetes v1.21, and removed in v1.25.
As an alternative, use [Pod Security Admission](/docs/concepts/security/pod-security-admission/), or a 3rd party admission plugin.
-->
PodSecurityPolicy 已於 Kubernetes v1.21 起棄用，並在 v1.25 中刪除。
作爲替代方案，請使用 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或第三方准入插件。
