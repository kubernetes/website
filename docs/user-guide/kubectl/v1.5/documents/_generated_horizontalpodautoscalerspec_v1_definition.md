## HorizontalPodAutoscalerSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | HorizontalPodAutoscalerSpec

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscalerspec-v1beta1">v1beta1</a> </aside>

specification of a horizontal pod autoscaler.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscaler-v1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
maxReplicas <br /> *integer* | upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
minReplicas <br /> *integer* | lower limit for the number of pods that can be set by the autoscaler, default 1.
scaleTargetRef <br /> *[CrossVersionObjectReference](#crossversionobjectreference-v1)* | reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource.
targetCPUUtilizationPercentage <br /> *integer* | target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used.

