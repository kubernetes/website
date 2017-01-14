## NFSVolumeSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NFSVolumeSource



Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.

<aside class="notice">
Appears In  <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a>  <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
path <br /> *string*  | Path that is exported by the NFS server. More info: http://kubernetes.io/docs/user-guide/volumes#nfs
readOnly <br /> *boolean*  | ReadOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: http://kubernetes.io/docs/user-guide/volumes#nfs
server <br /> *string*  | Server is the hostname or IP address of the NFS server. More info: http://kubernetes.io/docs/user-guide/volumes#nfs

