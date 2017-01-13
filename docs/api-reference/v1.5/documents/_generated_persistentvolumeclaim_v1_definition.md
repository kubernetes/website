## PersistentVolumeClaim v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaim



PersistentVolumeClaim is a user's request for and claim to a persistent volume

<aside class="notice">
Appears In  <a href="#persistentvolumeclaimlist-v1">PersistentVolumeClaimList</a>  <a href="#statefulsetspec-v1beta1">StatefulSetSpec</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeClaimSpec](#persistentvolumeclaimspec-v1)*  | Spec defines the desired characteristics of a volume requested by a pod author. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
status <br /> *[PersistentVolumeClaimStatus](#persistentvolumeclaimstatus-v1)*  | Status represents the current information/status of a persistent volume claim. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims

