---
title: 特性門控（Feature gate）
id: feature-gate
date: 2023-01-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  一種控制是否啓用某特定 Kubernetes 特性的方法。

aka: 
tags:
- fundamental
- operation
---
<!--
---
title: Feature gate
id: feature-gate
date: 2023-01-12
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  A way to control whether or not a particular Kubernetes feature is enabled.

aka: 
tags:
- fundamental
- operation
---
-->

<!--
Feature gates are a set of keys (opaque string values) that you can use to control which
Kubernetes features are enabled in your cluster.
-->
特性門控是一組鍵（非透明的字符串值），你可以用它來控制在你的叢集中啓用哪些 Kubernetes 特性。

<!--more-->

<!--
You can turn these features on or off using the `--feature-gates` command line flag on each Kubernetes component.
Each Kubernetes component lets you enable or disable a set of feature gates that are relevant to that component.
The Kubernetes documentation lists all current 
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) and what they control.
-->
你可以在每個 Kubernetes 組件中使用 `--feature-gates` 命令列標誌來開啓或關閉這些特性。
每個 Kubernetes 組件都可以讓你開啓或關閉一組與該組件相關的特性門控。
Kubernetes 文檔列出了當前所有的[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)及其控制的內容。
