## JobList v2alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v2alpha1 | JobList

<aside class="notice">Other api versions of this object exist: <a href="#joblist-v1">v1</a> <a href="#joblist-v1beta1">v1beta1</a> </aside>

JobList is a collection of jobs.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Job](#job-v2alpha1) array*  | Items is the list of Job.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata

