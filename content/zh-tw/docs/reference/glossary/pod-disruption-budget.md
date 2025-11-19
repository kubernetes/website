---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /zh-cn/docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
  Pod Disruption Budget 是這樣一種對象：它保證在出現主動干擾（Voluntary Disruption）時，
  多實例應用的 Pod 不會少於一定的數量。

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

<!--
---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
 An object that limits the number of Pods of a replicated application that are down simultaneously from voluntary disruptions.

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---
-->

<!--
 A [Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) allows an 
 application owner to create an object for a replicated application, that ensures
 a certain number or percentage of {{< glossary_tooltip text="Pods" term_id="pod" >}}
 with an assigned label will not be voluntarily evicted at any point in time.

 Involuntary disruptions cannot be prevented by PDBs; however they 
 do count against the budget.
-->
 [Pod 干擾預算（Pod Disruption Budget，PDB）](/zh-cn/docs/concepts/workloads/pods/disruptions/)
 使應用所有者能夠爲多實例應用創建一個對象，來確保一定數量的具有指定標籤的
 {{< glossary_tooltip text="Pod" term_id="pod" >}} 在任何時候都不會被主動驅逐。
 <!--more--> 
PDB 無法防止非主動的中斷，但是會計入預算（budget）。
