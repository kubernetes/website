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

[Pod disruption](/docs/concepts/workloads/pods/disruptions/) is the process by which 
Pods on Nodes are terminated either voluntarily or involuntarily. 

<!--more--> 

Voluntary disruptions are started intentionally by application owners or cluster 
administrators. Involuntary disruptions are unintentional and can be triggered by 
unavoidable issues like Nodes running out of {{< glossary_tooltip text="resources" term_id="infrastructure-resource" >}},
or by accidental deletions.
