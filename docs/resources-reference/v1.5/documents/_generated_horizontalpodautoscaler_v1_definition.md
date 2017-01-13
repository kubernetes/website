## HorizontalPodAutoscaler v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | HorizontalPodAutoscaler

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscaler-v1beta1">v1beta1</a> </aside>

configuration of a horizontal pod autoscaler.

<aside class="notice">
Appears In  <a href="#horizontalpodautoscalerlist-v1">HorizontalPodAutoscalerList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[HorizontalPodAutoscalerSpec](#horizontalpodautoscalerspec-v1)*  | behaviour of autoscaler. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[HorizontalPodAutoscalerStatus](#horizontalpodautoscalerstatus-v1)*  | current information about the autoscaler.

