## Role v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | Role



Role is a namespaced, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding.

<aside class="notice">
Appears In  <a href="#rolelist-v1alpha1">RoleList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata.
rules <br /> *[PolicyRule](#policyrule-v1alpha1) array*  | Rules holds all the PolicyRules for this Role

