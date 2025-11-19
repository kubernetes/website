---
id: pod-disruption
title: Pod 干擾
full_link: /zh-cn/docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  自願或非自願地終止節點上的 Pod 的過程。

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
[Pod 干擾](/zh-cn/docs/concepts/workloads/pods/disruptions/) 是指節點上的
Pod 被自願或非自願終止的過程。

<!--more--> 

<!--
Voluntary disruptions are started intentionally by application owners or cluster 
administrators. Involuntary disruptions are unintentional and can be triggered by 
unavoidable issues like Nodes running out of resources, or by accidental deletions. 
-->
自願干擾是由應用程序所有者或集羣管理員有意啓動的。非自願干擾是無意的，
可能由不可避免的問題觸發，如節點耗盡資源或意外刪除。
