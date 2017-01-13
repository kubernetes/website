

-----------
# LimitRange v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | LimitRange







LimitRange sets resource usage limits for each kind of resource in a Namespace.

<aside class="notice">
Appears In <a href="#limitrangelist-v1">LimitRangeList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[LimitRangeSpec](#limitrangespec-v1)*  | Spec defines the limits enforced. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### LimitRangeSpec v1

<aside class="notice">
Appears In <a href="#limitrange-v1">LimitRange</a> </aside>

Field        | Description
------------ | -----------
limits <br /> *[LimitRangeItem](#limitrangeitem-v1) array*  | Limits is the list of LimitRangeItem objects that are enforced.

### LimitRangeList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[LimitRange](#limitrange-v1) array*  | Items is a list of LimitRange objects. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_limit_range.md
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





