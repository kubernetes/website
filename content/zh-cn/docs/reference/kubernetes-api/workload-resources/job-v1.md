---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "Job"
content_type: "api_reference"
description: "Job 表示单个作业的配置。"
title: "Job"
weight: 9
---

<!--
api_metadata:
apiVersion: "batch/v1"
import: "k8s.io/api/batch/v1"
kind: "Job"
content_type: "api_reference"
description: "Job represents the configuration of a single job."
title: "Job"
weight: 9
auto_generated: true
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`


## Job {#Job}

<!--
Job 表示单个作业的配置。
-->

<hr>

- **apiVersion**: batch/v1


- **kind**: Job

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准对象的元数据。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->

- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  作业的预期行为的规范。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  Current status of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->

- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  作业的当前状态。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  



## JobSpec {#JobSpec}

<!--
JobSpec describes how the job execution will look like.
-->

JobSpec 描述了工作执行的情况。

<hr>



### Replicas


<!--
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  Describes the pod that will be created when executing a job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) \< .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
-->

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  描述执行作业时将创建的 pod。更多信息： https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  指定作业应在任何给定时间运行的最大所需 pod 数。 当((.spec.completions - .status.successful) \< .spec.parallelism)时，即当剩余的工作小于最大并行度时，在稳定状态下运行的 pod 的实际数量将小于此数量。更多信息： https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

### Lifecycle

<!--
- **completions** (int32)

  Specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **completionMode** (string)

  CompletionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.

  `NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.

  `Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.io/job-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.

  More completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, which is possible during upgrades due to version skew, the controller skips updates for the Job.
-->


- **completions** (int32)

  指定作业应该运行的成功完成的 pod 的期望数量。 设置为 nil 意味着任何 pod 的成功都预示着所有 pod 的成功，并允许并行性有任何正值。设置为 1 意味着并行性被限制为 1，并且该 pod 的成功标志着作业的成功。更多信息：https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **completionMode** (string)

  CompletionMode 指定如何跟踪 Pod 完成情况。它可以是 `NonIndexed` (默认) 或者 `Indexed`。
  
  `NonIndexed` 表示当有 .spec.completions 成功完成 Pod 时，认为 Job 完成。 每个 Pod 完成都是彼此同源的。
  
  `Indexed` 意味着一个 Job 的 Pod 获得一个相关的完成指数，从 0 到（.spec.completions - 1）, 可在注释
  batch.kubernetes.io/job-completion-index 中找到。 当每个索引都有一个成功完成的 Pod 时，该作业被认为是完成的。
  当值为 `Indexed` 时, 必须指定 .spec.completions 并且 `.spec.parallelism` 必须小于或等于 10^5。
  此外，Pod 名称采用 `$(job-name)-$(index)-$(random-string)` 的形式，Pod 主机名采用 `$(job-name)-$(index)` 的形式。

  将来可以添加更多的完成模式。如果 Job 控制器发现它无法识别的模式，这种情况在升级期间由于版本偏差可能发生，则控制器会跳过 Job 的更新。
<!--
- **backoffLimit** (int32)

  Specifies the number of retries before marking this job failed. Defaults to 6

- **activeDeadlineSeconds** (int64)

  Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again.

- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes.

- **suspend** (boolean)

  Suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.
-->
- **backoffLimit** (int32)

  指定标记此作业失败之前的重试次数。默认值为 6

- **activeDeadlineSeconds** (int64)

  相对于系统尝试终止作业之前作业可能持续活动的开始时间的持续时间（秒）；值必须为正整数。如果作业被挂起（在创建时或通过更新），
  则当作业再次恢复时，此计时器将有效停止并重置。

- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished 限制已完成执行（完成或失败）的作业的生命周期。 如果设置了这个字段，
  在 Job 完成后 ttlSecondsAfterFinished，它就有资格被自动删除。当作业被删除时，它的生命周期保证（例如终结器）将被兑现。
  如果未设置此字段，则作业不会被自动删除。如果此字段设置为零，则作业在完成后即可立即删除。 

- **suspend** (boolean)

  Suspend 指定 Job 控制器是否应该创建 Pod。 如果创建 Job 时将 suspend 设置为 true，则 Job 控制器不会创建任何 Pod。
  如果 Job 在创建后被挂起（即标志从 false 变为 true），则 Job 控制器将删除与该 Job 关联的所有活动 Pod。 
  用户必须设计他们的工作负载来优雅地处理这个问题。暂停 Job 将重置 Job 的 StartTime 字段，也有效地重置 ActiveDeadlineSeconds 计时器。默认为假。

### Selector


<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector
-->

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  对应与 pod 计数匹配的 pod 的标签查询。通常，系统会为您设置此字段。更多信息：More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector 控制 pod 标签和 pod 选择器的生成。 除非你确定你在做什么，否则不要设置 `manualSelector`。 When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector



## JobStatus {#JobStatus}

<!--
JobStatus represents the current state of a Job.
-->

JobStatus 表示 Job 的当前状态。

<hr>

<!--
- **startTime** (Time)

  Represents time when the job controller started processing a job. When a Job is created in the suspended state, this field is not set until the first time it is resumed. This field is reset every time a Job is resumed from suspension. It is represented in RFC3339 form and is in UTC.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **completionTime** (Time)

  Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is only set when the job finishes successfully.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **active** (int32)

  The number of pending and running pods.

- **failed** (int32)

  The number of pods which reached phase Failed.

- **succeeded** (int32)

  The number of pods which reached phase Succeeded.
-->

- **startTime** (Time)

  表示作业控制器开始处理作业的时间。在挂起状态下创建 Job 时，直到第一次恢复时才会设置此字段。
  每次从暂停中恢复作业时都会重置此字段。它以 RFC3339 形式表示，并采用 UTC。

  <a name="Time"></a>
  **Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。time 包提供的许多工厂方法都提供了包装器。**

- **completionTime** (Time)

  表示作业完成的时间。不能保证在单独的操作中按发生前的顺序设置。它以 RFC3339 形式表示，并采用
  UTC。 仅当作业成功完成时才设置完成时间。

  <a name="Time"></a>
  **Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。time 包提供的许多工厂方法都提供了包装器。**

- **active** (int32)

  待处理和正在运行的 pod 的数量。

- **failed** (int32)

  达到阶段失败的 pod 数量。

- **succeeded** (int32)

  达到阶段成功的 pod 数量。

<!--
- **completedIndexes** (string)

  CompletedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7".

- **conditions** ([]JobCondition)

  *Patch strategy: merge on key `type`*

  *Atomic: will be replaced during a merge*

  The latest available observations of an object's current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  *JobCondition describes current state of a job.*

  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of job condition, Complete or Failed.

  - **conditions.lastProbeTime** (Time)

    Last time the condition was checked.
-->

- **completedIndexes** (string)

  CompletedIndexes以文本格式保存 .spec.completionMode = "Indexed" 时完成的索引。 
  索引被表示为十进制整数，用逗号分隔。这些数字是按递增的顺序排列的。三个或更多的连续数字被压缩， 
  用系列的第一个和最后一个元素表示，用连字符分开。例如，如果完成的指数是 1、3、4、5 和 7，则表示为 "1、3-5、7"。

- **conditions** ([]JobCondition)

  **补丁策略：在 `type` 键处合并**

  **原子：在合并过程中，将被替换。**

  对象当前状态的最新可用观察结果。当作业失败时，其中一个条件的类型为 “Failed”，状态为 true。
  当作业被暂停时，其中一个条件的类型为 “suspended”，状态为true；当作业被恢复时，该条件的状态将变为 false。
  作业完成时，其中一个条件的类型为 "Complete"，状态为 true。更多信息：https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  **JobCondition 描述作业的当前状态。**

  - **conditions.status** (string), 必须

    条件的状态，True、False、Unknown 之一。

  - **conditions.type** (string), 必须

    作业条件的类型，完成或失败。

  - **conditions.lastProbeTime** (Time)

    最后一次检查的情况。

<!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.lastTransitionTime** (Time)

    Last time the condition transit from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    Human readable message indicating details about last transition.

  - **conditions.reason** (string)

    (brief) reason for the condition's last transition.
-->  


    <a name="Time"></a>
    *Time是对time.Time的封装，它支持对 YAML 和 JSON 的正确编排。我们为 time 包提供的许多工厂方法提供了封装器。*

  - **conditions.lastTransitionTime** (Time)
  
    上次条件从一种状态转换到另一种状态的时间。
  
    <a name="Time"></a>
    *Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。为 time 包提供的许多工厂方法提供了包装器。*

  - **conditions.message** (string)

    表示上次转换详细信息的可读消息。

  - **conditions.reason** (string)
  
    （简要）条件最后一次转换的原因

<!--
- **uncountedTerminatedPods** (UncountedTerminatedPods)

  UncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.

  The job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status: (1) Add the pod UID to the arrays in this field. (2) Remove the pod finalizer. (3) Remove the pod UID from the arrays while increasing the corresponding
  counter.

  This field is beta-level. The job controller only makes use of this field when the feature gate JobTrackingWithFinalizers is enabled (enabled by default). Old jobs might not be tracked using this field, in which case the field remains null.

  <a name="UncountedTerminatedPods"></a>
  *UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters.*

  - **uncountedTerminatedPods.failed** ([]string)

    *Set: unique values will be kept during a merge*

    Failed holds UIDs of failed Pods.

  - **uncountedTerminatedPods.succeeded** ([]string)

    *Set: unique values will be kept during a merge*

    Succeeded holds UIDs of succeeded Pods.
-->

- **uncountedTerminatedPods** (UncountedTerminatedPods)

  UncountedTerminatedPods 保存已终止但作业控制器尚未在状态计数器中考虑的 Pod 的 UID。

  作业控制器使用终结器创建 POD。当 pod 终止（成功或失败）时，控制器将执行三个步骤以在作业状态中对其进行说明：
  （1）将 pod UID 添加到此字段中的阵列。（2）拆下 pod 终结器。（3）从阵列中删除 pod UID，同时增加相应的计数器。

  此字段为 beta 级别。作业控制器仅在启用功能门 JobTrackingWithFinalizers 时使用此字段（默认启用）。
  使用此字段可能无法跟踪旧作业，在这种情况下，该字段保持为空。

  <a name="UncountedTerminatedPods"></a>
  *UncountedTerminatedPods 持有已经终止的 Pod 的 UID，但还没有被计入工作状态计数器中。*

  - **uncountedTerminatedPods.failed** ([]string)

    **Set: 在合并过程中，唯一的值将被保留**

    失败的持有失败 Pod 的 UID。

  - **uncountedTerminatedPods.succeeded** ([]string)

    **Set: 在合并过程中，唯一的值将被保留**

    成功的持有成功的 Pod 的 UID。



### Alpha level

<!--
- **ready** (int32)

  The number of pods which have a Ready condition.

  This field is beta-level. The job controller populates the field when the feature gate JobReadyPods is enabled (enabled by default).
-->


- **ready** (int32)

  处于就绪状态的 pod 数量。

  此字段为 beta 级别。当功能门 JobReadyPods 启用（默认启用）时，作业控制器会填充该字段。


## JobList {#JobList}

<!--
JobList is a collection of jobs.
-->

JobList 是作业的集合。

<hr>

- **apiVersion**: batch/v1


- **kind**: JobList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>), required

  items is the list of Jobs.
-->


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>), required

  items 是作业列表。


## Operations {#Operations}



<hr>





<!--
### `get` read the specified Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

### `get` 读取指定的 Job

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数


- **name** (*in path*): string, 必须

  Job 的名字


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized


### `get` read status of the specified Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->



#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: 未授权


### `get` 读取指定作业的状态

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 参数


- **name** (*in path*): string, required

  Job 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: 未授权


### `list` 列出或查询作业类型的对象

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>


<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Job

#### HTTP Request

GET /apis/batch/v1/jobs

#### Parameters
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: 未授权


### `list` 列出或查询作业类型的对象

#### HTTP 请求

GET /apis/batch/v1/jobs

#### 参数


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: Unauthorized


### `create` create a Job

#### HTTP Request

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: 未授权


### `create` 创建一个 Job

#### HTTP 请求

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必须

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

202 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Accepted

401: Unauthorized


### `update` replace the specified Job

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 创建完成

202 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 已接受

401: 未授权


### `update` 替换指定的 Job

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数

<--
- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->

- **name** (*in path*): string, 必须

 Job 的名称


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必须

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized


### `update` replace status of the specified Job

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 创建完成

401: 未授权


### `update` 替换指定 Job 的状态

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->

- **name** (*in path*): string, 必须

  Job 的名字


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必须

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized


### `patch` partially update the specified Job

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 创建完成

401: 未授权


### `patch` 部分更新指定的 Job

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

#### 参数


- **name** (*in path*): string, 必须

  Job 的名称


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必须

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized


### `patch` partially update status of the specified Job

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 创建完成

401: 未授权


### `patch` 部分更新指定 Job 的状态

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

- **name** (*in path*): string, 必须

  Job 的名称


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必须

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized


### `delete` delete a Job

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters

- **name** (*in path*): string, required

  name of the Job


- **namespace** (*in path*): string, required
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): 创建完成

401: 未授权


### `delete` 删除一个 Job

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数


- **name** (*in path*): string, 请求

  Job的名称


- **namespace** (*in path*): string, 请求

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of Job

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters


- **namespace** (*in path*): string, required
-->


#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): 已接受

401: 未授权


### `deletecollection` 删除 Job 的集合

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数


- **namespace** (*in path*): string, 必须

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->


#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授权

