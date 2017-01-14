

-----------
# JobTemplateSpec v2alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v2alpha1 | JobTemplateSpec







JobTemplateSpec describes the data a Job should have when created from a template

<aside class="notice">
Appears In <a href="#cronjobspec-v2alpha1">CronJobSpec</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata of the jobs created from this template. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[JobSpec](#jobspec-v2alpha1)*  | Specification of the desired behavior of the job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status






