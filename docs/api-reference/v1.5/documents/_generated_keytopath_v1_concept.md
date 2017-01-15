

-----------
# KeyToPath v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | KeyToPath







Maps a string key to a path within a volume.

<aside class="notice">
Appears In <a href="#configmapvolumesource-v1">ConfigMapVolumeSource</a> <a href="#secretvolumesource-v1">SecretVolumeSource</a> </aside>

Field        | Description
------------ | -----------
key <br /> *string*  | The key to project.
mode <br /> *integer*  | Optional: mode bits to use on this file, must be a value between 0 and 0777. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
path <br /> *string*  | The relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.






