## RoleBinding v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
RbacAuthorization | v1alpha1 | RoleBinding

> Example yaml coming soon...



RoleBinding references a role, but does not contain it.  It can reference a Role in the same namespace or a ClusterRole in the global namespace. It adds who information via Subjects and namespace information by which namespace it exists in.  RoleBindings in a given namespace only have effect in that namespace.

<aside class="notice">
Appears In  <a href="#rolebindinglist-v1alpha1">RoleBindingList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata.
roleRef <br /> *[RoleRef](#roleref-v1alpha1)* | RoleRef can reference a Role in the current namespace or a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error.
subjects <br /> *[Subject](#subject-v1alpha1) array* | Subjects holds references to the objects the role applies to.

