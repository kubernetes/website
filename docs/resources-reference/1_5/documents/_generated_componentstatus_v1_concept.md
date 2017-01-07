

-----------
# ComponentStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ComponentStatus







ComponentStatus (and ComponentStatusList) holds the cluster validation info.

<aside class="notice">
Appears In <a href="#componentstatuslist-v1">ComponentStatusList</a> </aside>

Field        | Description
------------ | -----------
conditions <br /> *[ComponentCondition](#componentcondition-v1) array*  | List of component conditions observed
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata


### ComponentStatusList v1



Field        | Description
------------ | -----------
items <br /> *[ComponentStatus](#componentstatus-v1) array*  | List of ComponentStatus objects.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





