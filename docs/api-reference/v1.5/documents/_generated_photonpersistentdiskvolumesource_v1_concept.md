

-----------
# PhotonPersistentDiskVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PhotonPersistentDiskVolumeSource







Represents a Photon Controller persistent disk resource.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
fsType <br /> *string*  | Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
pdID <br /> *string*  | ID that identifies Photon Controller persistent disk






