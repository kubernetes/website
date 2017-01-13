## PersistentVolumeClaim v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeClaim

> Example yaml coming soon...



PersistentVolumeClaim is a user's request for and claim to a persistent volume

<aside class="notice">
Appears In  <a href="#persistentvolumeclaimlist-v1">PersistentVolumeClaimList</a>  <a href="#statefulsetspec-v1beta1">StatefulSetSpec</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeClaimSpec](#persistentvolumeclaimspec-v1)* | Spec defines the desired characteristics of a volume requested by a pod author. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims
status <br /> *[PersistentVolumeClaimStatus](#persistentvolumeclaimstatus-v1)* | Status represents the current information/status of a persistent volume claim. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistentvolumeclaims

