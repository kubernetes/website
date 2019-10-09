---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
 An object that limits the number of {{< glossary_tooltip text="Pods" term_id="pod" >}} of a replicated application, that are down simultaneously from voluntary disruptions.

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

<!--
 A [Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) allows an application owner to create an object for a replicated application, that ensures a certain number or percentage of Pods with an assigned label will not be voluntarily evicted at any point in time. PDBs cannot prevent an involuntary disruption, but will count against the budget.
-->
[Pod 中断预算](/docs/concepts/workloads/pods/disruptions/)允许应用程序所有者为复制的应用程序创建一个对象，以确保具有指定标签的一定数量或百分比的Pod不会在某些时间点被自愿驱逐。 PDB 不能防止非自愿中断，但会计入预算。
