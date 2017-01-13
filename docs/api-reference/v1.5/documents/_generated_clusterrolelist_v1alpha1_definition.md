## ClusterRoleList v1alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
RbacAuthorization | v1alpha1 | ClusterRoleList



ClusterRoleList is a collection of ClusterRoles



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[ClusterRole](#clusterrole-v1alpha1) array*  | Items is a list of ClusterRoles
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard object's metadata.

