## JobSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | JobSpec

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#jobspec-v1beta1">v1beta1</a> </aside>

JobSpec describes how the job execution will look like.

<aside class="notice">
Appears In  <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
activeDeadlineSeconds <br /> *integer* | Optional duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer
completions <br /> *integer* | Completions specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: http://kubernetes.io/docs/user-guide/jobs
manualSelector <br /> *boolean* | ManualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: http://releases.k8s.io/HEAD/docs/design/selector-generation.md
parallelism <br /> *integer* | Parallelism specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: http://kubernetes.io/docs/user-guide/jobs
selector <br /> *[LabelSelector](#labelselector-unversioned)* | Selector is a label query over pods that should match the pod count. Normally, the system sets this field for you. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template is the object that describes the pod that will be created when executing a job. More info: http://kubernetes.io/docs/user-guide/jobs

