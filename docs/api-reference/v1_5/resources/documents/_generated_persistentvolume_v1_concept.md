

-----------
# PersistentVolume v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolume


<aside class="notice">These are assigned to <a href="#pod-v1">Pods</a> using <a href="#persistentvolumeclaim-v1">PersistentVolumeClaims</a>.</aside>




PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes

<aside class="notice">
Appears In <a href="#persistentvolumelist-v1">PersistentVolumeList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeSpec](#persistentvolumespec-v1)*  | Spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes
status <br /> *[PersistentVolumeStatus](#persistentvolumestatus-v1)*  | Status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes


### PersistentVolumeSpec v1

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array*  | AccessModes contains all ways the volume can be mounted. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes
capacity <br /> *object*  | A description of the persistent volume's resources and capacity. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity
claimRef <br /> *[ObjectReference](#objectreference-v1)*  | ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#binding
persistentVolumeReclaimPolicy <br /> *string*  | What happens to a persistent volume when released from its claim. Valid options are Retain (default) and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#recycling-policy

### PersistentVolumeStatus v1

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
message <br /> *string*  | A human-readable message indicating details about why the volume is in this state.
phase <br /> *string*  | Phase indicates if a volume is available, bound to a claim, or released by a claim. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#phase
reason <br /> *string*  | Reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.

### PersistentVolumeList v1



Field        | Description
------------ | -----------
items <br /> *[PersistentVolume](#persistentvolume-v1) array*  | List of persistent volumes. More info: http://kubernetes.io/docs/user-guide/persistent-volumes
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





