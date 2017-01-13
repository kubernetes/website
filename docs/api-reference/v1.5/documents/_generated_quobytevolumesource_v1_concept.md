

-----------
# QuobyteVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | QuobyteVolumeSource







Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
group <br /> *string*  | Group to map volume access to Default is no group
readOnly <br /> *boolean*  | ReadOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.
registry <br /> *string*  | Registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes
user <br /> *string*  | User to map volume access to Defaults to serivceaccount user
volume <br /> *string*  | Volume is a string that references an already created Quobyte volume by name.






