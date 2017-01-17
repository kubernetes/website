## HorizontalPodAutoscaler v1

Group        | Version     | Kind
------------ | ---------- | -----------
Autoscaling | v1 | HorizontalPodAutoscaler

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscaler-v1beta1">v1beta1</a> </aside>

configuration of a horizontal pod autoscaler.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscalerlist-v1">HorizontalPodAutoscalerList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[HorizontalPodAutoscalerSpec](#horizontalpodautoscalerspec-v1)* | behaviour of autoscaler. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[HorizontalPodAutoscalerStatus](#horizontalpodautoscalerstatus-v1)* | current information about the autoscaler.

