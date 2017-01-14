## Job v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | Job

<aside class="notice">Other api versions of this object exist: <a href="#job-v1">v1</a> <a href="#job-v2alpha1">v2alpha1</a> </aside>

Job represents the configuration of a single job. DEPRECATED: extensions/v1beta1.Job is deprecated, use batch/v1.Job instead.

<aside class="notice">
Appears In  <a href="#joblist-v1beta1">JobList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[JobSpec](#jobspec-v1beta1)*  | Spec is a structure defining the expected behavior of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[JobStatus](#jobstatus-v1beta1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

