

-----------
# ResourceQuotaStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ResourceQuotaStatus







ResourceQuotaStatus defines the enforced hard limits and observed use.

<aside class="notice">
Appears In <a href="#resourcequota-v1">ResourceQuota</a> </aside>

Field        | Description
------------ | -----------
hard <br /> *object*  | Hard is the set of enforced hard limits for each named resource. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_resource_quota.md#admissioncontrol-plugin-resourcequota
used <br /> *object*  | Used is the current observed total usage of the resource in the namespace.






