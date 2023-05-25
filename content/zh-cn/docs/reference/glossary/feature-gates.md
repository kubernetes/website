---
title: 特性门控（Feature gate）
id: feature-gate
date: 2023-01-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  一种控制是否启用某特定 Kubernetes 特性的方法。

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
特性门控是一组键（非透明的字符串值），你可以用它来控制在你的集群中启用哪些 Kubernetes 特性。

<!--more-->

<!--
You can turn these features on or off using the `--feature-gates` command line flag on each Kubernetes component.
Each Kubernetes component lets you enable or disable a set of feature gates that are relevant to that component.
The Kubernetes documentation lists all current 
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) and what they control.
-->
你可以在每个 Kubernetes 组件中使用 `--feature-gates` 命令行标志来开启或关闭这些特性。
每个 Kubernetes 组件都可以让你开启或关闭一组与该组件相关的特性门控。
Kubernetes 文档列出了当前所有的[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)及其控制的内容。
