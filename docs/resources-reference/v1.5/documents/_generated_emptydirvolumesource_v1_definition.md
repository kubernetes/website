## EmptyDirVolumeSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | EmptyDirVolumeSource



Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.

<aside class="notice">
Appears In  <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
medium <br /> *string*  | What type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: http://kubernetes.io/docs/user-guide/volumes#emptydir

