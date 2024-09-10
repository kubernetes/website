---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "Job"
content_type: "api_reference"
description: "Job 表示单个任务的配置。"
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

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`

## Job {#Job}

<!--
Job represents the configuration of a single job.
-->
Job 表示单个任务的配置。

<hr>

- **apiVersion**: batch/v1

- **kind**: Job

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  任务的预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  Current status of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  任务的当前状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## JobSpec {#JobSpec}

<!--
JobSpec describes how the job execution will look like.
-->
JobSpec 描述了任务执行的情况。

<hr>

### Replicas

<!--
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  Describes the pod that will be created when executing a job. The only allowed template.spec.restartPolicy values are "Never" or "OnFailure". More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) \< .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), 必需

  描述执行任务时将创建的 Pod。template.spec.restartPolicy 可以取的值只能是
  "Never" 或 "OnFailure"。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  指定任务应在任何给定时刻预期运行的 Pod 个数上限。
  当(.spec.completions - .status.successful) \< .spec.parallelism 时，
  即当剩余的工作小于最大并行度时，在稳定状态下运行的 Pod 的实际数量将小于此数量。
  更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

### Lifecycle

<!--
- **completions** (int32)

  Specifies the desired number of successfully finished pods the job should be run with.  Setting to null means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
-->
- **completions** (int32)

  指定任务应该运行并预期成功完成的 Pod 个数。设置为空意味着任何 Pod 的成功都标识着所有 Pod 的成功，
  并允许 parallelism 设置为任何正值。设置为 1 意味着并行性被限制为 1，并且该 Pod 的成功标志着任务的成功。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

<!--
- **completionMode** (string)

  completionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.
  
  `NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.
-->
- **completionMode** (string)

  completionMode 指定如何跟踪 Pod 完成情况。它可以是 `NonIndexed`（默认）或者 `Indexed`。

  `NonIndexed` 表示当有 `.spec.completions` 个成功完成的 Pod 时，认为 Job 完成。每个 Pod 完成都是彼此同源的。

  <!--
  `Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.io/job-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.
  -->

  `Indexed` 意味着 Job 的各个 Pod 会获得对应的完成索引值，从 0 到（`.spec.completions - 1`），可在注解
  "batch.kubernetes.io/job-completion-index" 中找到。当每个索引都对应有一个成功完成的 Pod 时，
  该任务被认为是完成的。
  当值为 `Indexed` 时，必须指定 `.spec.completions` 并且 `.spec.parallelism` 必须小于或等于 10^5。
  此外，Pod 名称采用 `$(job-name)-$(index)-$(random-string)` 的形式，Pod 主机名采用
  `$(job-name)-$(index)` 的形式。

  <!--
  More completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, which is possible during upgrades due to version skew, the controller skips updates for the Job.
  -->

  将来可能添加更多的完成模式。如果 Job 控制器发现它无法识别的模式
  （这种情况在升级期间由于版本偏差可能发生），则控制器会跳过 Job 的更新。

<!--
- **backoffLimit** (int32)

  Specifies the number of retries before marking this job failed. Defaults to 6

- **activeDeadlineSeconds** (int64)

  Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again.
-->
- **backoffLimit** (int32)

  指定标记此任务失败之前的重试次数。默认值为 6。

- **activeDeadlineSeconds** (int64)

  系统尝试终止任务之前任务可以持续活跃的持续时间（秒），时间长度是相对于 startTime 的；
  字段值必须为正整数。如果任务被挂起（在创建期间或因更新而挂起），
  则当任务再次恢复时，此计时器会被停止并重置。

<!--
- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes.
-->
- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished 限制已完成执行（完成或失败）的任务的生命周期。如果设置了这个字段，
  在 Job 完成 ttlSecondsAfterFinished 秒之后，就可以被自动删除。
  当 Job 被删除时，它的生命周期保证（例如终结器）会被考察。
  如果未设置此字段，则任务不会被自动删除。如果此字段设置为零，则任务在完成后即可立即删除。

<!--
- **suspend** (boolean)

  suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.
-->
- **suspend** (boolean)

  suspend 指定 Job 控制器是否应该创建 Pod。如果创建 Job 时将 suspend 设置为 true，则 Job 控制器不会创建任何 Pod。
  如果 Job 在创建后被挂起（即标志从 false 变为 true），则 Job 控制器将删除与该 Job 关联的所有活动 Pod。
  用户必须设计他们的工作负载来优雅地处理这个问题。暂停 Job 将重置 Job 的 startTime 字段，
  也会重置 ActiveDeadlineSeconds 计时器。默认为 false。

### Selector

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  对应与 Pod 计数匹配的 Pod 的标签查询。通常，系统会为你设置此字段。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector 控制 Pod 标签和 Pod 选择器的生成。除非你确定你在做什么，否则不要设置 `manualSelector`。
  当此字段为 false 或未设置时，系统会选择此 Pod 唯一的标签并将这些标签附加到 Pod 模板。
  当此字段为 true 时，用户负责选择唯一标签并指定选择器。
  未能选择唯一标签可能会导致此任务和其他任务无法正常运行。但是，你可能会在使用旧的 `extensions/v1beta1` API
  创建的任务中看到 `manualSelector=true`。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector

<!--
### Beta level

- **podFailurePolicy** (PodFailurePolicy)

  Specifies the policy of handling failed pods. In particular, it allows to specify the set of actions and conditions which need to be satisfied to take the associated action. If empty, the default behaviour applies - the counter of failed pods, represented by the jobs's .status.failed field, is incremented and it is checked against the backoffLimit. This field cannot be used in combination with restartPolicy=OnFailure.
-->
### Beta 级别   {#beta-level}

- **podFailurePolicy** (PodFailurePolicy)

  指定处理失效 Pod 的策略。特别是，它允许指定采取关联操作需要满足的一组操作和状况。
  如果为空，则应用默认行为：由该任务的 .status.failed 字段表示的失效 Pod 的计数器将递增，
  并针对 backoffLimit 进行检查。此字段不能与 restartPolicy=OnFailure 结合使用。

  <!--
  This field is beta-level. It can be used when the `JobPodFailurePolicy` feature gate is enabled (enabled by default).

  <a name="PodFailurePolicy"></a>
  *PodFailurePolicy describes how failed pods influence the backoffLimit.*
  -->

  此字段是 Beta 级别。当 `JobPodFailurePolicy` 特性门控被启用时（默认被启用），可以使用此字段。

  <a name="PodFailurePolicy"></a>
  **PodFailurePolicy 描述失效的 Pod 如何影响 backoffLimit。**

  <!--
  - **podFailurePolicy.rules** ([]PodFailurePolicyRule), required

    *Atomic: will be replaced during a merge*
    
    A list of pod failure policy rules. The rules are evaluated in order. Once a rule matches a Pod failure, the remaining of the rules are ignored. When no rule matches the Pod failure, the default handling applies - the counter of pod failures is incremented and it is checked against the backoffLimit. At most 20 elements are allowed.
  -->

  - **podFailurePolicy.rules** ([]PodFailurePolicyRule)，必需

    **原子: 将在合并期间被替换**
    
    Pod 失效策略规则的列表。这些规则按顺序进行评估。一旦某规则匹配 Pod 失效，则其余规将被忽略。
    当没有规则匹配 Pod 失效时，将应用默认的处理方式：
    Pod 失效的计数器递增并针对 backoffLimit 进行检查。最多允许 20 个。

    <!--
    <a name="PodFailurePolicyRule"></a>
    *PodFailurePolicyRule describes how a pod failure is handled when the requirements are met. One of onExitCodes and onPodConditions, but not both, can be used in each rule.*
    -->

    <a name="PodFailurePolicyRule"></a>
    **PodFailurePolicyRule 描述当满足要求时如何处理一个 Pod 失效。
    在每个规则中可以使用 onExitCodes 和 onPodConditions 之一，但不能同时使用二者。**

    <!--
    - **podFailurePolicy.rules.action** (string), required

      Specifies the action taken on a pod failure when the requirements are satisfied. Possible values are:
      
      - FailJob: indicates that the pod's job is marked as Failed and all
        running pods are terminated.
      - FailIndex: indicates that the pod's index is marked as Failed and will
        not be restarted.
        This value is alpha-level. It can be used when the
        `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).
    -->

    - **podFailurePolicy.rules.action** (string)，必需

      指定当要求满足时对 Pod 失效采取的操作。可能的值是：

      - FailJob：表示 Pod 的任务被标记为 Failed 且所有正在运行的 Pod 都被终止。
      - FailIndex：表示 Pod 对应的索引被标记为 Failed 且 Pod 不会被重新启动。
        此值是 Alpha 级别的。当 `JobBackoffLimitPerIndex` 特性门控被启用时（默认被禁用），可以使用此值。

      <!--
      - Ignore: indicates that the counter towards the .backoffLimit is not
        incremented and a replacement pod is created.
      - Count: indicates that the pod is handled in the default way - the
        counter towards the .backoffLimit is incremented.
      Additional values are considered to be added in the future. Clients should react to an unknown action by skipping the rule.
      -->

      - Ignore：表示 .backoffLimit 的计数器没有递增，并创建了一个替代 Pod。

      - Count：表示以默认方式处理该 Pod，计数器朝着 .backoffLimit 的方向递增。

      后续会考虑增加其他值。客户端应通过跳过此规则对未知的操作做出反应。

    <!--
    - **podFailurePolicy.rules.onPodConditions** ([]PodFailurePolicyOnPodConditionsPattern), required

      *Atomic: will be replaced during a merge*
    -->

    - **podFailurePolicy.rules.onPodConditions** ([]PodFailurePolicyOnPodConditionsPattern)，必需

      **原子: 将在合并期间被替换**

      <!--
      Represents the requirement on the pod conditions. The requirement is represented as a list of pod condition patterns. The requirement is satisfied if at least one pattern matches an actual pod condition. At most 20 elements are allowed.

      <a name="PodFailurePolicyOnPodConditionsPattern"></a>
      *PodFailurePolicyOnPodConditionsPattern describes a pattern for matching an actual pod condition type.*
      -->

      表示对 Pod 状况的要求。该要求表示为 Pod 状况模式的一个列表。
      如果至少一个模式与实际的 Pod 状况匹配，则满足此要求。最多允许 20 个。

      <a name="PodFailurePolicyOnPodConditionsPattern"></a>
      **PodFailurePolicyOnPodConditionsPattern 描述与实际 Pod 状况类型匹配的模式。**

      <!--
      - **podFailurePolicy.rules.onPodConditions.status** (string), required

        Specifies the required Pod condition status. To match a pod condition it is required that the specified status equals the pod condition status. Defaults to True.

      - **podFailurePolicy.rules.onPodConditions.type** (string), required

        Specifies the required Pod condition type. To match a pod condition it is required that specified type equals the pod condition type.
      -->

      - **podFailurePolicy.rules.onPodConditions.status** (string)，必需

        指定必需的 Pod 状况状态。要匹配一个 Pod 状况，指定的状态必须等于该 Pod 状况状态。默认为 True。

      - **podFailurePolicy.rules.onPodConditions.type** (string)，必需

        指定必需的 Pod 状况类型。要匹配一个 Pod 状况，指定的类型必须等于该 Pod 状况类型。

    <!--
    - **podFailurePolicy.rules.onExitCodes** (PodFailurePolicyOnExitCodesRequirement)

      Represents the requirement on the container exit codes.

      <a name="PodFailurePolicyOnExitCodesRequirement"></a>
      *PodFailurePolicyOnExitCodesRequirement describes the requirement for handling a failed pod based on its container exit codes. In particular, it lookups the .state.terminated.exitCode for each app container and init container status, represented by the .status.containerStatuses and .status.initContainerStatuses fields in the Pod status, respectively. Containers completed with success (exit code 0) are excluded from the requirement check.*
    -->

    - **podFailurePolicy.rules.onExitCodes** (PodFailurePolicyOnExitCodesRequirement)

      表示容器退出码有关的要求。

      <a name="PodFailurePolicyOnExitCodesRequirement"></a>
      **PodFailurePolicyOnExitCodesRequirement 描述根据容器退出码处理失效 Pod 的要求。
      特别是，它为每个应用容器和 Init 容器状态查找在 Pod 状态中分别用 .status.containerStatuses 和
      .status.initContainerStatuses 字段表示的 .state.terminated.exitCode。
      成功完成的容器（退出码 0）被排除在此要求检查之外。**

      <!--
      - **podFailurePolicy.rules.onExitCodes.operator** (string), required

        Represents the relationship between the container exit code(s) and the specified values. Containers completed with success (exit code 0) are excluded from the requirement check. Possible values are:
        - In: the requirement is satisfied if at least one container exit code
          (might be multiple if there are multiple containers not restricted
          by the 'containerName' field) is in the set of specified values.
        - NotIn: the requirement is satisfied if at least one container exit code
          (might be multiple if there are multiple containers not restricted
          by the 'containerName' field) is not in the set of specified values.
        Additional values are considered to be added in the future. Clients should react to an unknown operator by assuming the requirement is not satisfied.
      -->

      - **podFailurePolicy.rules.onExitCodes.operator** (string)，必需

        表示容器退出码和指定值之间的关系。成功完成的容器（退出码 0）被排除在此要求检查之外。可能的值为：
        
        - In：如果至少一个容器退出码（如果有多个容器不受 'containerName' 字段限制，则可能是多个退出码）
          在一组指定值中，则满足要求。

        - NotIn：如果至少一个容器退出码（如果有多个容器不受 'containerName' 字段限制，则可能是多个退出码）
          不在一组指定值中，则满足要求。

        后续会考虑增加其他值。客户端应通过假设不满足要求来对未知操作符做出反应。

      <!--
      - **podFailurePolicy.rules.onExitCodes.values** ([]int32), required

        *Set: unique values will be kept during a merge*
        
        Specifies the set of values. Each returned container exit code (might be multiple in case of multiple containers) is checked against this set of values with respect to the operator. The list of values must be ordered and must not contain duplicates. Value '0' cannot be used for the In operator. At least one element is required. At most 255 elements are allowed.
      -->

      - **podFailurePolicy.rules.onExitCodes.values** ([]int32)，必需

        **集合：合并期间保留唯一值**
        
        指定值集。每个返回的容器退出码（在多个容器的情况下可能是多个）将根据该操作符有关的这个值集进行检查。
        值的列表必须有序且不得包含重复项。值 '0' 不能用于 In 操作符。至少需要 1 个。最多允许 255 个。

      <!--
      - **podFailurePolicy.rules.onExitCodes.containerName** (string)

        Restricts the check for exit codes to the container with the specified name. When null, the rule applies to all containers. When specified, it should match one the container or initContainer names in the pod template.
      -->

      - **podFailurePolicy.rules.onExitCodes.containerName** (string)

        将退出码的检查限制为具有指定名称的容器。当为 null 时，该规则适用于所有容器。
        当被指定时，它应与 Pod 模板中的容器名称或 initContainer 名称之一匹配。

<!--
### Alpha level
-->
### Alpha 级别   {#alpha-level}

<!--
- **backoffLimitPerIndex** (int32)

  Specifies the limit for the number of retries within an index before marking this index as failed. When enabled the number of failures per index is kept in the pod's batch.kubernetes.io/job-index-failure-count annotation. It can only be set when Job's completionMode=Indexed, and the Pod's restart policy is Never. The field is immutable. This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).
-->
- **backoffLimitPerIndex**（int32）

  指定在将特定索引的 Pod 标记为失败之前在对该 Pod 重试次数的限制。
  启用后，各索引的失败次数将保存在 Pod 的 `batch.kubernetes.io/job-index-failure-count` 注解中。
  仅当 Job 的 completionMode=Indexed 且 Pod 的重启策略为 Never 时才能设置此字段。
  此字段是不可变更的。此字段是 Alpha 级别的。
  当 `JobBackoffLimitPerIndex` 特性门控被启用时（默认被禁用），可以使用此字段。

<!--
- **maxFailedIndexes** (int32)

  Specifies the maximal number of failed indexes before marking the Job as failed, when backoffLimitPerIndex is set. Once the number of failed indexes exceeds this number the entire Job is marked as Failed and its execution is terminated. When left as null the job continues execution of all of its indexes and is marked with the `Complete` Job condition. It can only be specified when backoffLimitPerIndex is set. It can be null or up to completions. It is required and must be less than or equal to 10^4 when is completions greater than 10^5. This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).
-->
- **maxFailedIndexes**（int32）

  指定在 backoffLimitPerIndex 被设置时、标记 Job 为失败之前所允许的最大失败索引数。
  一旦失败的索引数超过此数值，整个 Job 将被标记为 Failed 并终止执行。
  如果不设置此字段（对应为 null），则作业继续执行其所有索引，且 Job 会被标记 `Complete` 状况。
  此字段只能在设置 backoffLimitPerIndex 时指定。此字段值可以是 null 或完成次数之内的值。
  当完成次数大于 10^5 时，此字段是必需的且必须小于等于 10^4。
  此字段是 Alpha 级别的。当 `JobBackoffLimitPerIndex` 特性门控被启用时（默认禁用），可以使用此字段。

<!--
- **podReplacementPolicy** (string)

  podReplacementPolicy specifies when to create replacement Pods. Possible values are: - TerminatingOrFailed means that we recreate pods
    when they are terminating (has a metadata.deletionTimestamp) or failed.
  - Failed means to wait until a previously created Pod is fully terminated (has phase
    Failed or Succeeded) before creating a replacement Pod.
-->
- **podReplacementPolicy**（string）

  podReplacementPolicy 指定何时创建替代的 Pod。可能的值包括：
  
  - TerminatingOrFailed：表示当 Pod 处于终止中（具有 metadata.deletionTimestamp）或失败时，重新创建 Pod。
  - Failed：表示在创建替代的 Pod 之前，等待先前创建的 Pod 完全终止（处于 Failed 或 Succeeded 阶段）。

  <!--
  When using podFailurePolicy, Failed is the the only allowed value. TerminatingOrFailed and Failed are allowed values when podFailurePolicy is not in use. This is an alpha field. Enable JobPodReplacementPolicy to be able to use this field.
  -->
  当使用 podFailurePolicy 时，Failed 是唯一允许值。
  当不使用 podFailurePolicy 时，允许使用 TerminatingOrFailed 和 Failed。
  这是一个 Alpha 级别的字段。启用 JobPodReplacementPolicy 特性门控才能使用此字段。

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
-->
- **startTime** (Time)

  表示任务控制器开始处理任务的时间。在挂起状态下创建 Job 时，直到第一次恢复时才会设置此字段。
  每次从暂停中恢复任务时都会重置此字段。它表示为 RFC3339 格式的 UTC 时间。

  <a name="Time"></a>
  **Time 是 time.Time 的包装器，支持正确编码为 YAML 和 JSON。time 包提供的许多工厂方法都提供了包装器。**

<!--
- **completionTime** (Time)

  Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is only set when the job finishes successfully.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **completionTime** (Time)

  表示任务完成的时间。不能保证对多个独立操作按发生的先后顺序设置。此字段表示为 RFC3339 格式的 UTC 时间。
  仅当任务成功完成时才设置完成时间。

  <a name="Time"></a>
  **Time 是 time.Time 的包装器，支持正确编码为 YAML 和 JSON。time 包提供的许多工厂方法都提供了包装器。**

<!--
- **active** (int32)

  The number of pending and running pods.

- **failed** (int32)

  The number of pods which reached phase Failed.

- **succeeded** (int32)

  The number of pods which reached phase Succeeded.
-->
- **active** (int32)

  待处理和正在运行的 Pod 的数量。

- **failed** (int32)

  进入 Failed 阶段的 Pod 数量。

- **succeeded** (int32)

  进入 Succeeded 阶段的 Pod 数量。
<!--
- **completedIndexes** (string)

  completedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7".
-->
- **completedIndexes** (string)

  completedIndexes 以文本格式保存 `.spec.completionMode` 设置为 `"Indexed"` 的 Pod 已完成的索引。
  索引用十进制整数表示，用逗号分隔。数字是按递增的顺序排列的。三个或更多的连续数字被压缩，
  用系列的第一个和最后一个元素表示，用连字符分开。例如，如果完成的索引是 1、3、4、5 和 7，则表示为 "1、3-5、7"。

<!--
- **conditions** ([]JobCondition)

  *Patch strategy: merge on key `type`*

  *Atomic: will be replaced during a merge*

  The latest available observations of an object's current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  *JobCondition describes current state of a job.*
-->
- **conditions** ([]JobCondition)

  **补丁策略：根据 `type` 键合并**

  **原子: 将在合并期间被替换**

  对象当前状态的最新可用观察结果。当任务失败时，其中一个状况的类型为 “Failed”，状态为 true。
  当任务被暂停时，其中一个状况的类型为 “Suspended”，状态为true；当任务被恢复时，该状况的状态将变为 false。
  任务完成时，其中一个状况的类型为 "Complete"，状态为 true。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  **JobCondition 描述任务的当前状况。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of job condition, Complete or Failed.

  - **conditions.lastProbeTime** (Time)

    Last time the condition was checked.
  -->

  - **conditions.status** (string), 必需

    状况的状态：True、False、Unknown 之一。

  - **conditions.type** (string), 必需

    任务状况的类型：Completed 或 Failed。

  - **conditions.lastProbeTime** (Time)

    最后一次探测的时间。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    
    <a name="Time"></a>
    **Time 是对 time.Time 的封装，支持正确编码为 YAML 和 JSON。我们为 time 包提供的许多工厂方法提供了封装器。**

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transit from one status to another.
  -->

  - **conditions.lastTransitionTime** (Time)

    上一次从一种状况转换到另一种状况的时间。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    <a name="Time"></a>
    **Time 是 time.Time 的包装器，支持正确编码为 YAML 和 JSON。time 包提供的许多工厂方法都提供了包装器。**

  <!--
  - **conditions.message** (string)

    Human readable message indicating details about last transition.

  - **conditions.reason** (string)

    (brief) reason for the condition's last transition. 
  -->

  - **conditions.message** (string)

    表示上次转换信息的人类可读消息。

  - **conditions.reason** (string)

    状况最后一次转换的（简要）原因

<!--
- **uncountedTerminatedPods** (UncountedTerminatedPods)

  uncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.

  The job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status:
  
  1. Add the pod UID to the arrays in this field. 2. Remove the pod finalizer. 3. Remove the pod UID from the arrays while increasing the corresponding
      counter.
-->
- **uncountedTerminatedPods** (UncountedTerminatedPods)

  UncountedTerminatedPods 保存已终止但尚未被任务控制器纳入状态计数器中的 Pod 的 UID 的集合。

  任务控制器所创建 Pod 带有终结器。当 Pod 终止（成功或失败）时，控制器将执行三个步骤以在任务状态中对其进行说明：

  1. 将 Pod UID 添加到此字段的列表中。
  2. 去掉 Pod 中的终结器。
  3. 从数组中删除 Pod UID，同时为相应的计数器加一。

  <!--
  Old jobs might not be tracked using this field, in which case the field remains null.

  <a name="UncountedTerminatedPods"></a>
  *UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters.*
  -->
  使用此字段可能无法跟踪旧任务，在这种情况下，该字段保持为空。

  <a name="UncountedTerminatedPods"></a>
  **UncountedTerminatedPods 持有已经终止的 Pod 的 UID，但还没有被计入工作状态计数器中。**

  <!--
  - **uncountedTerminatedPods.failed** ([]string)

    *Set: unique values will be kept during a merge*
    
    failed holds UIDs of failed Pods.
  -->

  - **uncountedTerminatedPods.failed** ([]string)

    **集合：合并期间保留唯一值**

    failed 字段包含已失败 Pod 的 UID。

  <!--
  - **uncountedTerminatedPods.succeeded** ([]string)

    *Set: unique values will be kept during a merge*
    
    succeeded holds UIDs of succeeded Pods.
  -->

  - **uncountedTerminatedPods.succeeded** ([]string)

    **集合：合并期间保留唯一值**

    succeeded 包含已成功的 Pod 的 UID。

<!--
### Beta level
-->
### Beta 级别   {#beta-level}

<!--
- **ready** (int32)

  The number of pods which have a Ready condition.

  This field is beta-level. The job controller populates the field when the feature gate JobReadyPods is enabled (enabled by default).
-->
- **ready** (int32)

  状况为 Ready 的 Pod 数量。

  此字段为 Beta 级别。当特性门控 JobReadyPods 启用（默认启用）时，任务控制器会填充该字段。

<!--
### Alpha level
-->
### Alpha 级别

<!--
- **failedIndexes** (string)

  FailedIndexes holds the failed indexes when backoffLimitPerIndex=true. The indexes are represented in the text format analogous as for the `completedIndexes` field, ie. they are kept as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the failed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).
-->
- **failedIndexes** (string)

  当 backoffLimitPerIndex=true 时，failedIndexes 保存失败的索引。
  索引以文本格式表示，类似于 `completedIndexes` 字段，即这些索引是使用逗号分隔的十进制整数。
  这些数字按升序列出。三个或更多连续的数字会被压缩，整个序列表示为第一个数字、连字符和最后一个数字。
  例如，如果失败的索引是 1、3、4、5 和 7，则表示为 "1,3-5,7"。
  该字段是 Alpha 级别的。当 `JobBackoffLimitPerIndex` 特性门控被启用时（默认被禁用），可以使用此字段。

<!--
- **terminating** (int32)

  The number of pods which are terminating (in phase Pending or Running and have a deletionTimestamp).
  
  This field is alpha-level. The job controller populates the field when the feature gate JobPodReplacementPolicy is enabled (disabled by default).
-->
- **terminating**（int32）

  正在终止的 Pod 数量（处于 Pending 或 Running 阶段且具有 deletionTimestamp）。
  
  此字段是 Alpha 级别的。当特性门控 JobPodReplacementPolicy 被启用时（默认被禁用），
  Job 控制器会填充该字段。

## JobList {#JobList}

<!--
JobList is a collection of jobs.
-->
JobList 是 Job 的集合。

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

  标准列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>), required

  items 是 Job 对象的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters

- **name** (*in path*): string, required

  name of the Job
-->
### `get` 读取指定的 Job

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数

- **name** (**路径参数**)：string，必需

  Job 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized

### `get` read status of the specified Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->

#### 响应

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized

### `get` 读取指定任务的状态

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

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

401: Unauthorized

### `list` 列举或监测 Job 类别的对象

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

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

401: Unauthorized

### `list` 列举或监测 Job 类别的对象

#### HTTP 请求

GET /apis/batch/v1/jobs

#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

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

401: Unauthorized

### `create` 创建一个 Job

#### HTTP 请求

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

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

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

202 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Accepted

401: Unauthorized

### `update` 替换指定的 Job

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->
- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

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

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

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
- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

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

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

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

- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

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

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

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
- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

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

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

### `delete` 删除一个 Job

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 参数

- **name** (**路径参数**): string, 必需

  Job 的名称。

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

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

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` 删除 Job 的集合

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### 参数

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
