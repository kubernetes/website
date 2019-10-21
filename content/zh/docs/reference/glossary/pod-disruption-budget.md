---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
 一个对象，用于限制备份应用程序的 {{< glossary_tooltip text="Pods" term_id="pod" >}} 数量，该数量同时因自愿中断而减少。
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
[ Pod 中断预算](/docs/concepts/workloads/pods/disruptions/)允许应用程序所有者为复制的应用程序创建一个对象，以确保具有指定标签的一定数量或百分比的 Pod 不会在某些时间点被自愿驱逐。 PDBs 不能防止非自愿中断，但会计入预算。
