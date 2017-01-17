

-----------
# ISCSIVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ISCSIVolumeSource







Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
fsType <br /> *string*  | Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: http://kubernetes.io/docs/user-guide/volumes#iscsi
iqn <br /> *string*  | Target iSCSI Qualified Name.
iscsiInterface <br /> *string*  | Optional: Defaults to 'default' (tcp). iSCSI interface name that uses an iSCSI transport.
lun <br /> *integer*  | iSCSI target lun number.
readOnly <br /> *boolean*  | ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.
targetPortal <br /> *string*  | iSCSI target portal. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).






