

-----------
# Subject v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1alpha1 | Subject







Subject contains a reference to the object or user identities a role binding applies to.  This can either hold a direct API object reference, or a value for non-objects such as user and group names.

<aside class="notice">
Appears In <a href="#clusterrolebinding-v1alpha1">ClusterRoleBinding</a> <a href="#rolebinding-v1alpha1">RoleBinding</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion holds the API group and version of the referenced object.
kind <br /> *string*  | Kind of object being referenced. Values defined by this API group are "User", "Group", and "ServiceAccount". If the Authorizer does not recognized the kind value, the Authorizer should report an error.
name <br /> *string*  | Name of the object being referenced.
namespace <br /> *string*  | Namespace of the referenced object.  If the object kind is non-namespace, such as "User" or "Group", and this value is not empty the Authorizer should report an error.






