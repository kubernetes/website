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

 A [Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) allows an 
 application owner to create an object for a replicated application, that ensures 
 a certain number or percentage of Pods with an assigned label will not be voluntarily
 evicted at any point in time.

<!--more--> 

Involuntary disruptions cannot be prevented by PDBs; however they 
do count against the budget.
