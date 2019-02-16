id: pod-disruption-budget
name: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
short-description: >
 An object that limits the number of {{< glossary_tooltip text="Pods" term_id="pod" >}} of a replicated application, that are down simultaneously from voluntary disruptions.
long-description: >
 A [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) allows an application owner to create an object for a replicated application, that ensures a certain number or percentage of Pods with an assigned label will not be voluntarily evicted at any point in time. PDBs cannot prevent an involuntary disruption, but will count against the budget.
  
