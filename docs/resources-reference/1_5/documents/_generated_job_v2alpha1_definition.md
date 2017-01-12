## Job v2alpha1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v2alpha1 | Job

<aside class="notice">Other api versions of this object exist: <a href="#job-v1">v1</a> <a href="#job-v1beta1">v1beta1</a> </aside>

Job represents the configuration of a single job.

<aside class="notice">
Appears In  <a href="#joblist-v2alpha1">JobList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[JobSpec](#jobspec-v2alpha1)*  | Spec is a structure defining the expected behavior of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[JobStatus](#jobstatus-v2alpha1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

