

-----------
# VolumeMount v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | VolumeMount







VolumeMount describes a mounting of a Volume within a container.

<aside class="notice">
Appears In <a href="#container-v1">Container</a> </aside>

Field        | Description
------------ | -----------
mountPath <br /> *string*  | Path within the container at which the volume should be mounted.  Must not contain ':'.
name <br /> *string*  | This must match the Name of a Volume.
readOnly <br /> *boolean*  | Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.
subPath <br /> *string*  | Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).






