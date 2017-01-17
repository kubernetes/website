## HorizontalPodAutoscaler v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | HorizontalPodAutoscaler

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscaler-v1">v1</a> </aside>

configuration of a horizontal pod autoscaler.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscalerlist-v1beta1">HorizontalPodAutoscalerList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[HorizontalPodAutoscalerSpec](#horizontalpodautoscalerspec-v1beta1)* | behaviour of autoscaler. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[HorizontalPodAutoscalerStatus](#horizontalpodautoscalerstatus-v1beta1)* | current information about the autoscaler.

