---
id: pod-disruption
title: Pod 干扰
full_link: /zh-cn/docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  自愿或非自愿地终止节点上的 Pod 的过程。

aka:
related:
 - pod
 - container
tags:
 - operation
---
<!--
id: pod-disruption
title: Pod Disruption
full_link: /docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  The process by which Pods on Nodes are terminated either voluntarily or involuntarily.

aka:
related:
 - pod
 - container
tags:
 - operation
-->

<!--
[Pod disruption](/docs/concepts/workloads/pods/disruptions/) is the process by which 
Pods on Nodes are terminated either voluntarily or involuntarily. 
-->
[Pod 干扰](/zh-cn/docs/concepts/workloads/pods/disruptions/) 是指节点上的
Pod 被自愿或非自愿终止的过程。

<!--more--> 

<!--
Voluntary disruptions are started intentionally by application owners or cluster 
administrators. Involuntary disruptions are unintentional and can be triggered by 
unavoidable issues like Nodes running out of resources, or by accidental deletions. 
-->
自愿干扰是由应用程序所有者或集群管理员有意启动的。非自愿干扰是无意的，
可能由不可避免的问题触发，如节点耗尽资源或意外删除。
