## JobSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | JobSpec

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#jobspec-v1">v1</a> </aside>

JobSpec describes how the job execution will look like.

<aside class="notice">
Appears In  <a href="#job-v1beta1">Job</a> </aside>

Field        | Description
------------ | -----------
activeDeadlineSeconds <br /> *integer* | Optional duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer
autoSelector <br /> *boolean* | AutoSelector controls generation of pod labels and pod selectors. It was not present in the original extensions/v1beta1 Job definition, but exists to allow conversion from batch/v1 Jobs, where it corresponds to, but has the opposite meaning as, ManualSelector. More info: http://releases.k8s.io/HEAD/docs/design/selector-generation.md
completions <br /> *integer* | Completions specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: http://kubernetes.io/docs/user-guide/jobs
parallelism <br /> *integer* | Parallelism specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: http://kubernetes.io/docs/user-guide/jobs
selector <br /> *[LabelSelector](#labelselector-unversioned)* | Selector is a label query over pods that should match the pod count. Normally, the system sets this field for you. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template is the object that describes the pod that will be created when executing a job. More info: http://kubernetes.io/docs/user-guide/jobs

