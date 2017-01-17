## ClusterRole v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
RbacAuthorization | v1alpha1 | ClusterRole

> Example yaml coming soon...



ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding.

<aside class="notice">
Appears In  <a href="#clusterrolelist-v1alpha1">ClusterRoleList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata.
rules <br /> *[PolicyRule](#policyrule-v1alpha1) array* | Rules holds all the PolicyRules for this ClusterRole

