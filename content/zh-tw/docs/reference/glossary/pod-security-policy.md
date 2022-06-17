---
title: Pod 安全策略
id: pod-security-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/security/pod-security-policy/
short_description: >
  為 Pod 的建立和更新操作啟用細粒度的授權。

aka: 
tags:
- core-object
- fundamental
---

<!--
---
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
---
-->

<!--
 Enables fine-grained authorization of {{< glossary_tooltip term_id="pod" >}} creation and updates.
-->

為 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的建立和更新操作啟用細粒度的授權。

<!--more--> 

<!--
A cluster-level resource that controls security sensitive aspects of the Pod specification. The `PodSecurityPolicy` objects define a set of conditions that a Pod must run with in order to be accepted into the system, as well as defaults for the related fields. Pod Security Policy control is implemented as an optional admission controller.
-->

Pod 安全策略是叢集級別的資源，它控制著 Pod 規約中的安全性敏感的內容。
`PodSecurityPolicy`物件定義了一組條件以及相關欄位的預設值，Pod 執行時必須滿足這些條件。Pod 安全策略控制實現上體現為一個可選的准入控制器。

<!--
PodSecurityPolicy is deprecated as of Kubernetes v1.21, and will be removed in v1.25. We recommend migrating to [Pod Security Admission](/docs/concepts/security/pod-security-admission/), or a 3rd party admission plugin.
-->
PodSecurityPolicy 自 Kubernetes v1.21 起已棄用，並將在 v1.25 中刪除。 
我們建議遷移到 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或第三方准入外掛。

