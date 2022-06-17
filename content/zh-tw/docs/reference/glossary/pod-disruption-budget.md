---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /zh-cn/docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
 Pod Disruption Budget 是這樣一種物件：它保證在主動中斷（ voluntary disruptions）時，多例項應用的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 不會少於一定的數量。

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
 An object that limits the number of {{< glossary_tooltip text="Pods" term_id="pod" >}} of a replicated application, that are down simultaneously from voluntary disruptions.

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
 a certain number or percentage of Pods with an assigned label will not be voluntarily
 evicted at any point in time.

 Involuntary disruptions cannot be prevented by PDBs; however they 
 do count against the budget.
-->
 [Pod 干擾預算（Pod Disruption Budget，PDB）](/zh-cn/docs/concepts/workloads/pods/disruptions/)
 使應用所有者能夠為多例項應用建立一個物件，來確保一定數量的具有指定標籤的 Pod 在任何時候都不會被主動驅逐。
 <!--more--> 
PDB 無法防止非主動的中斷，但是會計入預算（budget）。
