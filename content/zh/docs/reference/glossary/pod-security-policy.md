---
title: Pod 安全策略
id: pod-security-policy
date: 2018-04-12
full_link: /zh/docs/concepts/policy/pod-security-policy/
short_description: >
  为 Pod 的创建和更新操作启用细粒度的授权。

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
full_link: /docs/concepts/policy/pod-security-policy/
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

为 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的创建和更新操作启用细粒度的授权。

<!--more--> 

<!--
A cluster-level resource that controls security sensitive aspects of the Pod specification. The `PodSecurityPolicy` objects define a set of conditions that a Pod must run with in order to be accepted into the system, as well as defaults for the related fields. Pod Security Policy control is implemented as an optional admission controller.
-->

Pod 安全策略是集群级别的资源，它控制着 Pod 规约中的安全性敏感的内容。
`PodSecurityPolicy`对象定义了一组条件以及相关字段的默认值，Pod 运行时必须满足这些条件。Pod 安全策略控制实现上体现为一个可选的准入控制器。


