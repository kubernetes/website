---
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
---
<!--
[Pod disruption](/docs/concepts/workloads/pods/disruptions/) is the process by which 
Pods on Nodes are terminated either voluntarily or involuntarily. 
-->

pod中断是指结点上的pod被自动或非自愿终止的过程。

<!--more--> 

<!--
Voluntary disruptions are started intentionally by application owners or cluster 
administrators. Involuntary disruptions are unintentional and can be triggered by 
unavoidable issues like Nodes running out of resources, or by accidental deletions. 
-->

自愿中断是由应用程序所有者或集群管理员有意
启动的。非自愿中断是无意的，可能由不可避免的
问题触发，如节点耗尽资源或意外删除。
