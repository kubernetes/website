

-----------
# CinderVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | CinderVolumeSource







Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
fsType <br /> *string*  | Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: http://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md
readOnly <br /> *boolean*  | Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: http://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md
volumeID <br /> *string*  | volume id used to identify the volume in cinder More info: http://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md






