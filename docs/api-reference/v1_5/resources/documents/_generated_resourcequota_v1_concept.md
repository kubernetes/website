

-----------
# ResourceQuota v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ResourceQuota







ResourceQuota sets aggregate quota restrictions enforced per namespace

<aside class="notice">
Appears In <a href="#resourcequotalist-v1">ResourceQuotaList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[ResourceQuotaSpec](#resourcequotaspec-v1)*  | Spec defines the desired quota. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[ResourceQuotaStatus](#resourcequotastatus-v1)*  | Status defines the actual enforced quota and its current usage. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### ResourceQuotaSpec v1

<aside class="notice">
Appears In <a href="#resourcequota-v1">ResourceQuota</a> </aside>

Field        | Description
------------ | -----------
hard <br /> *object*  | Hard is the set of desired hard limits for each named resource. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_resource_quota.md#admissioncontrol-plugin-resourcequota
scopes <br /> *string array*  | A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects.

### ResourceQuotaStatus v1

<aside class="notice">
Appears In <a href="#resourcequota-v1">ResourceQuota</a> </aside>

Field        | Description
------------ | -----------
hard <br /> *object*  | Hard is the set of enforced hard limits for each named resource. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_resource_quota.md#admissioncontrol-plugin-resourcequota
used <br /> *object*  | Used is the current observed total usage of the resource in the namespace.

### ResourceQuotaList v1



Field        | Description
------------ | -----------
items <br /> *[ResourceQuota](#resourcequota-v1) array*  | Items is a list of ResourceQuota objects. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_resource_quota.md#admissioncontrol-plugin-resourcequota
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





