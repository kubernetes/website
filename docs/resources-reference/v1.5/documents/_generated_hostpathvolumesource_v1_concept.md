

-----------
# HostPathVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | HostPathVolumeSource







Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
path <br /> *string*  | Path of the directory on the host. More info: http://kubernetes.io/docs/user-guide/volumes#hostpath






