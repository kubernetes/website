---
title: 网络策略
id: network-policy
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/network-policies/
short_description: >
  网络策略是一种规范，规定了允许 Pod 组之间、Pod 与其他网络端点之间以怎样的方式进行通信。

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

网络策略是一种规范，规定了允许 Pod 组之间、Pod 与其他网络端点之间以怎样的方式进行通信。

<!--more--> 

<!--
Network Policies help you declaratively configure which Pods are allowed to connect to each other, which namespaces are allowed to communicate, and more specifically which port numbers to enforce each policy on. `NetworkPolicy` resources use labels to select Pods and define rules which specify what traffic is allowed to the selected Pods. Network Policies are implemented by a supported network plugin provided by a network provider. Be aware that creating a network resource without a controller to implement it will have no effect.
-->

网络策略帮助你声明式地配置允许哪些 Pod 之间、哪些命名空间之间允许进行通信，
并具体配置了哪些端口号来执行各个策略。`NetworkPolicy` 资源使用标签来选择 Pod，
并定义了所选 Pod 可以接受什么样的流量。网络策略由网络提供商提供的并被 Kubernetes 支持的网络插件实现。
请注意，当没有控制器实现网络资源时，创建网络资源将不会生效。
