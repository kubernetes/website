

-----------
# DownwardAPIVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | DownwardAPIVolumeSource







DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.

<aside class="notice">
Appears In <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
defaultMode <br /> *integer*  | Optional: mode bits to use on created files by default. Must be a value between 0 and 0777. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
items <br /> *[DownwardAPIVolumeFile](#downwardapivolumefile-v1) array*  | Items is a list of downward API volume file






