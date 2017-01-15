

-----------
# PersistentVolumeClaim v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaim


<aside class="notice">A <a href="#persistentvolume-v1">PersistentVolume</a> must be allocated in the cluster to use this.</aside>




PersistentVolumeClaim is a user's request for and claim to a persistent volume

<aside class="notice">
Appears In <a href="#persistentvolumeclaimlist-v1">PersistentVolumeClaimList</a> <a href="#statefulsetspec-v1beta1">StatefulSetSpec</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeClaimSpec](#persistentvolumeclaimspec-v1)*  | Spec defines the desired characteristics of a volume requested by a pod author. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
status <br /> *[PersistentVolumeClaimStatus](#persistentvolumeclaimstatus-v1)*  | Status represents the current information/status of a persistent volume claim. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims


### PersistentVolumeClaimSpec v1

<aside class="notice">
Appears In <a href="#persistentvolumeclaim-v1">PersistentVolumeClaim</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array*  | AccessModes contains the desired access modes the volume should have. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes-1
resources <br /> *[ResourceRequirements](#resourcerequirements-v1)*  | Resources represents the minimum resources the volume should have. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#resources
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | A label query over volumes to consider for binding.
volumeName <br /> *string*  | VolumeName is the binding reference to the PersistentVolume backing this claim.

### PersistentVolumeClaimStatus v1

<aside class="notice">
Appears In <a href="#persistentvolumeclaim-v1">PersistentVolumeClaim</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array*  | AccessModes contains the actual access modes the volume backing the PVC has. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes-1
capacity <br /> *object*  | Represents the actual resources of the underlying volume.
phase <br /> *string*  | Phase represents the current phase of PersistentVolumeClaim.

### PersistentVolumeClaimList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[PersistentVolumeClaim](#persistentvolumeclaim-v1) array*  | A list of persistent volume claims. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





