---
title: 網路策略
id: network-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/network-policies/
short_description: >
  網路策略是一種規範，規定了允許 Pod 組之間、Pod 與其他網路端點之間以怎樣的方式進行通信。

aka: 
tags:
- networking
- architecture
- extension
- core-object
---

<!--
---
title: Network Policy
id: network-policy
date: 2018-04-12
full_link: /docs/concepts/services-networking/network-policies/
short_description: >
  A specification of how groups of Pods are allowed to communicate with each other and with other network endpoints.

aka: 
tags:
- networking
- architecture
- extension
- core-object
---
-->

<!--
A specification of how groups of Pods are allowed to communicate with each other and with other network endpoints.
-->

網路策略是一種規範，規定了允許 Pod 組之間、Pod 與其他網路端點之間以怎樣的方式進行通信。

<!--more--> 

<!--
NetworkPolicies help you declaratively configure which Pods are allowed to connect to each other, which namespaces are allowed to communicate,
and more specifically which port numbers to enforce each policy on. NetworkPolicy objects use {{< glossary_tooltip text="labels" term_id="label" >}}
to select Pods and define rules which specify what traffic is allowed to the selected Pods.

NetworkPolicies are implemented by a supported network plugin provided by a network provider.
Be aware that creating a NetworkPolicy object without a controller to implement it will have no effect.
-->

網路策略幫助你聲明式地設定允許哪些 Pod 之間、哪些命名空間之間允許進行通信，
並具體設定了哪些端口號來執行各個策略。`NetworkPolicy`
資源使用{{< glossary_tooltip text="標籤" term_id="label" >}}來選擇 Pod，
並定義了所選 Pod 可以接受什麼樣的流量。

網路策略由網路提供商提供，並被 Kubernetes 支持的網路插件實現。
請注意，當沒有控制器實現網路資源時，創建網路資源將不會生效。
