

-----------
# LimitRangeList v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | LimitRangeList







LimitRangeList is a list of LimitRange items.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[LimitRange](#limitrange-v1) array*  | Items is a list of LimitRange objects. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_limit_range.md
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds






