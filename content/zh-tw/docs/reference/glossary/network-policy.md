---
title: 網路策略
id: network-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/network-policies/
short_description: >
  網路策略是一種規範，規定了允許 Pod 組之間、Pod 與其他網路端點之間以怎樣的方式進行通訊。

aka: 
tags:
- networking
- architecture
- extension
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
---

<!--
 A specification of how groups of Pods are allowed to communicate with each other and with other network endpoints.
-->

網路策略是一種規範，規定了允許 Pod 組之間、Pod 與其他網路端點之間以怎樣的方式進行通訊。

<!--more--> 

<!--
Network Policies help you declaratively configure which Pods are allowed to connect to each other, which namespaces are allowed to communicate, and more specifically which port numbers to enforce each policy on. `NetworkPolicy` resources use labels to select Pods and define rules which specify what traffic is allowed to the selected Pods. Network Policies are implemented by a supported network plugin provided by a network provider. Be aware that creating a network resource without a controller to implement it will have no effect.
-->

網路策略幫助你宣告式地配置允許哪些 Pod 之間、哪些名稱空間之間允許進行通訊，
並具體配置了哪些埠號來執行各個策略。`NetworkPolicy` 資源使用標籤來選擇 Pod，
並定義了所選 Pod 可以接受什麼樣的流量。網路策略由網路提供商提供的並被 Kubernetes 支援的網路外掛實現。
請注意，當沒有控制器實現網路資源時，建立網路資源將不會生效。
