

-----------
# HorizontalPodAutoscaler v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | HorizontalPodAutoscaler




<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscaler-v1">v1</a> </aside>


configuration of a horizontal pod autoscaler.

<aside class="notice">
Appears In <a href="#horizontalpodautoscalerlist-v1beta1">HorizontalPodAutoscalerList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[HorizontalPodAutoscalerSpec](#horizontalpodautoscalerspec-v1beta1)*  | behaviour of autoscaler. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[HorizontalPodAutoscalerStatus](#horizontalpodautoscalerstatus-v1beta1)*  | current information about the autoscaler.


### HorizontalPodAutoscalerSpec v1beta1

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1beta1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
cpuUtilization <br /> *[CPUTargetUtilization](#cputargetutilization-v1beta1)*  | target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified it defaults to the target CPU utilization at 80% of the requested resources.
maxReplicas <br /> *integer*  | upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
minReplicas <br /> *integer*  | lower limit for the number of pods that can be set by the autoscaler, default 1.
scaleRef <br /> *[SubresourceReference](#subresourcereference-v1beta1)*  | reference to Scale subresource; horizontal pod autoscaler will learn the current resource consumption from its status, and will set the desired number of pods by modifying its spec.

### HorizontalPodAutoscalerStatus v1beta1

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1beta1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
currentCPUUtilizationPercentage <br /> *integer*  | current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
currentReplicas <br /> *integer*  | current number of replicas of pods managed by this autoscaler.
desiredReplicas <br /> *integer*  | desired number of replicas of pods managed by this autoscaler.
lastScaleTime <br /> *[Time](#time-unversioned)*  | last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.

### HorizontalPodAutoscalerList v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1beta1) array*  | list of horizontal pod autoscaler objects.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.





