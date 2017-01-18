## HorizontalPodAutoscalerSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | HorizontalPodAutoscalerSpec

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscalerspec-v1">v1</a> </aside>

specification of a horizontal pod autoscaler.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscaler-v1beta1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
cpuUtilization <br /> *[CPUTargetUtilization](#cputargetutilization-v1beta1)* | target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified it defaults to the target CPU utilization at 80% of the requested resources.
maxReplicas <br /> *integer* | upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
minReplicas <br /> *integer* | lower limit for the number of pods that can be set by the autoscaler, default 1.
scaleRef <br /> *[SubresourceReference](#subresourcereference-v1beta1)* | reference to Scale subresource; horizontal pod autoscaler will learn the current resource consumption from its status, and will set the desired number of pods by modifying its spec.

