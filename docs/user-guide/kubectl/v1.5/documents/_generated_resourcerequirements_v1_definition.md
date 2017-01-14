## ResourceRequirements v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ResourceRequirements

> Example yaml coming soon...



ResourceRequirements describes the compute resource requirements.

<aside class="notice">
Appears In  <a href="#container-v1">Container</a>  <a href="#persistentvolumeclaimspec-v1">PersistentVolumeClaimSpec</a> </aside>

Field        | Description
------------ | -----------
limits <br /> *object* | Limits describes the maximum amount of compute resources allowed. More info: http://kubernetes.io/docs/user-guide/compute-resources/
requests <br /> *object* | Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: http://kubernetes.io/docs/user-guide/compute-resources/

