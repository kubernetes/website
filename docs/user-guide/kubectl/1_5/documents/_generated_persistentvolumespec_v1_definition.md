## PersistentVolumeSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeSpec

> Example yaml coming soon...



PersistentVolumeSpec is the specification of a persistent volume.

<aside class="notice">
Appears In  <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array* | AccessModes contains all ways the volume can be mounted. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes
capacity <br /> *object* | A description of the persistent volume's resources and capacity. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity
claimRef <br /> *[ObjectReference](#objectreference-v1)* | ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#binding
persistentVolumeReclaimPolicy <br /> *string* | What happens to a persistent volume when released from its claim. Valid options are Retain (default) and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#recycling-policy

