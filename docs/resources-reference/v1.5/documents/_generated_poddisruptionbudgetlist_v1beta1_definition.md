## PodDisruptionBudgetList v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | PodDisruptionBudgetList



PodDisruptionBudgetList is a collection of PodDisruptionBudgets.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[PodDisruptionBudget](#poddisruptionbudget-v1beta1) array*  | 
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | 

