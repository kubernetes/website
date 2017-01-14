## PersistentVolume v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolume

> Example yaml coming soon...



PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes

<aside class="notice">
Appears In  <a href="#persistentvolumelist-v1">PersistentVolumeList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeSpec](#persistentvolumespec-v1)* | Spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes
status <br /> *[PersistentVolumeStatus](#persistentvolumestatus-v1)* | Status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes

