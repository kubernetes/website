## PersistentVolumeClaimStatus v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaimStatus

> Example yaml coming soon...



PersistentVolumeClaimStatus is the current status of a persistent volume claim.

<aside class="notice">
Appears In  <a href="#persistentvolumeclaim-v1">PersistentVolumeClaim</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array* | AccessModes contains the actual access modes the volume backing the PVC has. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes-1
capacity <br /> *object* | Represents the actual resources of the underlying volume.
phase <br /> *string* | Phase represents the current phase of PersistentVolumeClaim.

