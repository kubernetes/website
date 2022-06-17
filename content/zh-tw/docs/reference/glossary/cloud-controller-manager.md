---
title: 雲控制器管理器（Cloud Controller Manager）
id: cloud-controller-manager
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/cloud-controller/
short_description: >
  將 Kubernetes 與第三方雲提供商進行整合的控制面元件。

aka: 
tags:
- core-object
- architecture
- operation
---
<!--
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Control plane component that integrates Kubernetes with third-party cloud providers.

aka: 
tags:
- core-object
- architecture
- operation
-->

<!--
 A Kubernetes {{< glossary_tooltip text="control plane" term_id="control-plane" >}} component
that embeds cloud-specific control logic. The cloud controller manager lets you link your
cluster into your cloud provider's API, and separates out the components that interact
with that cloud platform from components that only interact with your cluster.
-->
`cloud-controller-manager` 是指嵌入特定雲的控制邏輯之
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}元件。
`cloud-controller-manager` 允許你將你的叢集連線到雲提供商的 API 之上，
並將與該雲平臺互動的元件同與你的叢集互動的元件分離開來。

<!--more--> 
<!--
By decoupling the interoperability logic between Kubernetes and the underlying cloud
infrastructure, the cloud-controller-manager component enables cloud providers to release
features at a different pace compared to the main Kubernetes project.
-->
透過分離 Kubernetes 和底層雲基礎設定之間的互操作性邏輯，
`cloud-controller-manager` 元件使雲提供商能夠以不同於 Kubernetes 主專案的
步調發布新特徵。
