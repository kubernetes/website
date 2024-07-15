---
title: 云控制器管理器（Cloud Controller Manager）
id: cloud-controller-manager
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/cloud-controller/
short_description: >
  将 Kubernetes 与第三方云提供商进行集成的控制平面组件。

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
一个 Kubernetes {{<glossary_tooltip text="控制平面" term_id="control-plane" >}}组件，
嵌入了特定于云平台的控制逻辑。
云控制器管理器（Cloud Controller Manager）允许将你的集群连接到云提供商的 API 之上，
并将与该云平台交互的组件同与你的集群交互的组件分离开来。

<!--more-->

<!--
By decoupling the interoperability logic between Kubernetes and the underlying cloud
infrastructure, the cloud-controller-manager component enables cloud providers to release
features at a different pace compared to the main Kubernetes project.
-->
通过分离 Kubernetes 和底层云基础设置之间的互操作性逻辑，
`cloud-controller-manager` 组件使云提供商能够以不同于 Kubernetes 主项目的步调发布新特征。
