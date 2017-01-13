## StatefulSet v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | StatefulSet



StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
The StatefulSet guarantees that a given network identity will always map to the same storage identity.

<aside class="notice">
Appears In  <a href="#statefulsetlist-v1beta1">StatefulSetList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[StatefulSetSpec](#statefulsetspec-v1beta1)*  | Spec defines the desired identities of pods in this set.
status <br /> *[StatefulSetStatus](#statefulsetstatus-v1beta1)*  | Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time.

