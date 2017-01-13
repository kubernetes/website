## PodDisruptionBudget v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | PodDisruptionBudget



PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods

<aside class="notice">
Appears In  <a href="#poddisruptionbudgetlist-v1beta1">PodDisruptionBudgetList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[PodDisruptionBudgetSpec](#poddisruptionbudgetspec-v1beta1)*  | Specification of the desired behavior of the PodDisruptionBudget.
status <br /> *[PodDisruptionBudgetStatus](#poddisruptionbudgetstatus-v1beta1)*  | Most recently observed status of the PodDisruptionBudget.

