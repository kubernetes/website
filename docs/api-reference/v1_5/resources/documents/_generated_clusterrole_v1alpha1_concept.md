

-----------
# ClusterRole v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | ClusterRole







ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding.

<aside class="notice">
Appears In <a href="#clusterrolelist-v1alpha1">ClusterRoleList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata.
rules <br /> *[PolicyRule](#policyrule-v1alpha1) array*  | Rules holds all the PolicyRules for this ClusterRole


### ClusterRoleList v1alpha1



Field        | Description
------------ | -----------
items <br /> *[ClusterRole](#clusterrole-v1alpha1) array*  | Items is a list of ClusterRoles
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard object's metadata.





