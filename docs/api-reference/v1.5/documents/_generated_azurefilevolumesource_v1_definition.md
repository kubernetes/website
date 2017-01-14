## AzureFileVolumeSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | AzureFileVolumeSource



AzureFile represents an Azure File Service mount on the host and bind mount to the pod.

<aside class="notice">
Appears In  <a href="#persistentvolumespec-v1">PersistentVolumeSpec</a>  <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
readOnly <br /> *boolean*  | Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
secretName <br /> *string*  | the name of secret that contains Azure Storage Account Name and Key
shareName <br /> *string*  | Share Name

