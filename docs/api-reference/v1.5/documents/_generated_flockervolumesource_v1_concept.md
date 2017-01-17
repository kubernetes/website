

-----------
# FlockerVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | FlockerVolumeSource







Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.

<aside class="notice">
Appears In <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a> <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
datasetName <br /> *string*  | Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated
datasetUUID <br /> *string*  | UUID of the dataset. This is unique identifier of a Flocker dataset






