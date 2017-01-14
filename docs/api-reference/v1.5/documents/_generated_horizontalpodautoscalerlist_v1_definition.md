## HorizontalPodAutoscalerList v1

Group        | Version     | Kind
------------ | ---------- | -----------
Autoscaling | v1 | HorizontalPodAutoscalerList

<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscalerlist-v1beta1">v1beta1</a> </aside>

list of horizontal pod autoscaler objects.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1) array*  | list of horizontal pod autoscaler objects.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.

