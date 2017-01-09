## PodDisruptionBudgetSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | PodDisruptionBudgetSpec

> Example yaml coming soon...



PodDisruptionBudgetSpec is a description of a PodDisruptionBudget.

<aside class="notice">
Appears In  <a href="#poddisruptionbudget-v1beta1">PodDisruptionBudget</a> </aside>

Field        | Description
------------ | -----------
minAvailable <br /> *[IntOrString](#intorstring-intstr)* | An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".
selector <br /> *[LabelSelector](#labelselector-unversioned)* | Label query over pods whose evictions are managed by the disruption budget.

