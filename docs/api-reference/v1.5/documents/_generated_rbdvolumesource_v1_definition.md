## RBDVolumeSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | RBDVolumeSource



Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.

<aside class="notice">
Appears In  <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a>  <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
fsType <br /> *string*  | Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: http://kubernetes.io/docs/user-guide/volumes#rbd
image <br /> *string*  | The rados image name. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it
keyring <br /> *string*  | Keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it
monitors <br /> *string array*  | A collection of Ceph monitors. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it
pool <br /> *string*  | The rados pool name. Default is rbd. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it.
readOnly <br /> *boolean*  | ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it
secretRef <br /> *[LocalObjectReference](#localobjectreference-v1)*  | SecretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it
user <br /> *string*  | The rados user name. Default is admin. More info: http://releases.k8s.io/HEAD/examples/volumes/rbd/README.md#how-to-use-it

