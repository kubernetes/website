## DownwardAPIVolumeFile v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | DownwardAPIVolumeFile



DownwardAPIVolumeFile represents information to create the file containing the pod field

<aside class="notice">
Appears In  <a href="#downwardapivolumesource-v1">DownwardAPIVolumeSource</a> </aside>

Field        | Description
------------ | -----------
fieldRef <br /> *[ObjectFieldSelector](#objectfieldselector-v1)*  | Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.
mode <br /> *integer*  | Optional: mode bits to use on this file, must be a value between 0 and 0777. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
path <br /> *string*  | Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'
resourceFieldRef <br /> *[ResourceFieldSelector](#resourcefieldselector-v1)*  | Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.

