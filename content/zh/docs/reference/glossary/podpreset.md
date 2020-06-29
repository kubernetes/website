---
title: PodPreset
id: podpreset
date: 2018-04-12
full_link: 
short_description: >
  PodPreset 是一种 API 对象，在创建 Pod 时将诸如 Secret、卷挂载和环境变量之类的信息注入到该 Pod 中。

aka: 
tags:
- operation
---

<!--
---
title: PodPreset
id: podpreset
date: 2018-04-12
full_link: 
short_description: >
  An API object that injects information such as secrets, volume mounts, and environment variables into pods at creation time.

aka: 
tags:
- operation
---
-->

<!--
 An API object that injects information such as secrets, volume mounts, and environment variables into pods at creation time.
-->
PodPreset 是一种 API 对象，在创建 Pod 时将诸如 Secret、卷挂载和环境变量之类的信息注入到该 Pod 中。

<!--more--> 

<!--
This object chooses the pods to inject information into using standard selectors. This allows the podspec definitions to be nonspecific, decoupling the podspec from environment specific configuration.
-->

此 API 对象使用标准选择器选择 Pod 并向其中注入信息。这允许 podspec 定义是非特定的，从而将 podspec 与环境特定的配置解耦。
