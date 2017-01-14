

-----------
# AzureDiskVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | AzureDiskVolumeSource







AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
cachingMode <br /> *string*  | Host Caching mode: None, Read Only, Read Write.
diskName <br /> *string*  | The Name of the data disk in the blob storage
diskURI <br /> *string*  | The URI the data disk in the blob storage
fsType <br /> *string*  | Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
readOnly <br /> *boolean*  | Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.






