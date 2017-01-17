

-----------
# Job v1

>bdocs-tab:example Job Config to print pi up to 2000 digits (then exit).

```bdocs-tab:example_yaml

apiVersion: batch/v1
kind: Job
metadata:
  # Unique key of the Job instance
  name: example-job
spec:
  template:
    metadata:
      name: example-job
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl"]
        args: ["-Mbignum=bpi", "-wle", "print bpi(2000)"]
      # Do not restart containers after they exit
      restartPolicy: Never


```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Job




<aside class="notice">Other api versions of this object exist: <a href="#job-v1beta1">v1beta1</a> <a href="#job-v2alpha1">v2alpha1</a> </aside>


Job represents the configuration of a single job.

<aside class="notice">
Appears In <a href="#joblist-v1">JobList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[JobSpec](#jobspec-v1)*  | Spec is a structure defining the expected behavior of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[JobStatus](#jobstatus-v1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### JobSpec v1

<aside class="notice">
Appears In <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
activeDeadlineSeconds <br /> *integer*  | Optional duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer
completions <br /> *integer*  | Completions specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: http://kubernetes.io/docs/user-guide/jobs
manualSelector <br /> *boolean*  | ManualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: http://releases.k8s.io/HEAD/docs/design/selector-generation.md
parallelism <br /> *integer*  | Parallelism specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: http://kubernetes.io/docs/user-guide/jobs
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Selector is a label query over pods that should match the pod count. Normally, the system sets this field for you. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template is the object that describes the pod that will be created when executing a job. More info: http://kubernetes.io/docs/user-guide/jobs

### JobStatus v1

<aside class="notice">
Appears In <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
active <br /> *integer*  | Active is the number of actively running pods.
completionTime <br /> *[Time](#time-unversioned)*  | CompletionTime represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
conditions <br /> *[JobCondition](#jobcondition-v1) array*  | Conditions represent the latest available observations of an object's current state. More info: http://kubernetes.io/docs/user-guide/jobs
failed <br /> *integer*  | Failed is the number of pods which reached Phase Failed.
startTime <br /> *[Time](#time-unversioned)*  | StartTime represents time when the job was acknowledged by the Job Manager. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
succeeded <br /> *integer*  | Succeeded is the number of pods which reached Phase Succeeded.

### JobList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Job](#job-v1) array*  | Items is the list of Job.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





