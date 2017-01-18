## APIGroupList unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | APIGroupList



APIGroupList is a list of APIGroup, to allow clients to discover the API at /apis.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
groups <br /> *[APIGroup](#apigroup-unversioned) array*  | groups is a list of APIGroup.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds

