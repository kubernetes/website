## GlusterfsVolumeSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | GlusterfsVolumeSource



Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.

<aside class="notice">
Appears In  <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a>  <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
endpoints <br /> *string*  | EndpointsName is the endpoint name that details Glusterfs topology. More info: http://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md#create-a-pod
path <br /> *string*  | Path is the Glusterfs volume path. More info: http://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md#create-a-pod
readOnly <br /> *boolean*  | ReadOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: http://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md#create-a-pod

