

-----------
# FlexVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | FlexVolumeSource







FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. This is an alpha feature and may change in future.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
driver <br /> *string*  | Driver is the name of the driver to use for this volume.
fsType <br /> *string*  | Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.
options <br /> *object*  | Optional: Extra command options if any.
readOnly <br /> *boolean*  | Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
secretRef <br /> *[LocalObjectReference](#localobjectreference-v1)*  | Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.






