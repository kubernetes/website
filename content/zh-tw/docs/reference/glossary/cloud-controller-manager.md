---
title: 雲控制器管理器（Cloud Controller Manager）
id: cloud-controller-manager
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/cloud-controller/
short_description: >
  將 Kubernetes 與第三方雲提供商進行集成的控制平面組件。

aka: 
tags:
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
- architecture
- operation
-->

<!--
 A Kubernetes {{< glossary_tooltip text="control plane" term_id="control-plane" >}} component
that embeds cloud-specific control logic. The cloud controller manager lets you link your
cluster into your cloud provider's API, and separates out the components that interact
with that cloud platform from components that only interact with your cluster.
-->
一個 Kubernetes {{<glossary_tooltip text="控制平面" term_id="control-plane" >}}組件，
嵌入了特定於雲平臺的控制邏輯。
雲控制器管理器（Cloud Controller Manager）允許將你的叢集連接到雲提供商的 API 之上，
並將與該雲平臺交互的組件同與你的叢集交互的組件分離開來。

<!--more-->

<!--
By decoupling the interoperability logic between Kubernetes and the underlying cloud
infrastructure, the cloud-controller-manager component enables cloud providers to release
features at a different pace compared to the main Kubernetes project.
-->
通過分離 Kubernetes 和底層雲基礎設置之間的互操作性邏輯，
`cloud-controller-manager` 組件使雲提供商能夠以不同於 Kubernetes 主項目的步調發布新特徵。
