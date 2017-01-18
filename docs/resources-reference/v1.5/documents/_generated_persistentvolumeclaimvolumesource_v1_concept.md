

-----------
# PersistentVolumeClaimVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaimVolumeSource







PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).

<aside class="notice">
Appears In <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
claimName <br /> *string*  | ClaimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
readOnly <br /> *boolean*  | Will force the ReadOnly setting in VolumeMounts. Default false.






