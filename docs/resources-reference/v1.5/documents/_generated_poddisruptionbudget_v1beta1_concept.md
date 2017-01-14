

-----------
# PodDisruptionBudget v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | PodDisruptionBudget







PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods

<aside class="notice">
Appears In <a href="#poddisruptionbudgetlist-v1beta1">PodDisruptionBudgetList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[PodDisruptionBudgetSpec](#poddisruptionbudgetspec-v1beta1)*  | Specification of the desired behavior of the PodDisruptionBudget.
status <br /> *[PodDisruptionBudgetStatus](#poddisruptionbudgetstatus-v1beta1)*  | Most recently observed status of the PodDisruptionBudget.


### PodDisruptionBudgetSpec v1beta1

<aside class="notice">
Appears In <a href="#poddisruptionbudget-v1beta1">PodDisruptionBudget</a> </aside>

Field        | Description
------------ | -----------
minAvailable <br /> *[IntOrString](#intorstring-intstr)*  | An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Label query over pods whose evictions are managed by the disruption budget.

### PodDisruptionBudgetStatus v1beta1

<aside class="notice">
Appears In <a href="#poddisruptionbudget-v1beta1">PodDisruptionBudget</a> </aside>

Field        | Description
------------ | -----------
currentHealthy <br /> *integer*  | current number of healthy pods
desiredHealthy <br /> *integer*  | minimum desired number of healthy pods
disruptedPods <br /> *object*  | DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions.
disruptionsAllowed <br /> *integer*  | Number of pod disruptions that are currently allowed.
expectedPods <br /> *integer*  | total number of pods counted by this disruption budget
observedGeneration <br /> *integer*  | Most recent generation observed when updating this PDB status. PodDisruptionsAllowed and other status informatio is valid only if observedGeneration equals to PDB's object generation.

### PodDisruptionBudgetList v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[PodDisruptionBudget](#poddisruptionbudget-v1beta1) array*  | 
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | 





