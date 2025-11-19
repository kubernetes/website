---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "Job"
content_type: "api_reference"
description: "Job 表示單個任務的配置。"
title: "Job"
weight: 10
---
<!--
api_metadata:
apiVersion: "batch/v1"
import: "k8s.io/api/batch/v1"
kind: "Job"
content_type: "api_reference"
description: "Job represents the configuration of a single job."
title: "Job"
weight: 10
auto_generated: true
-->

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`

## Job {#Job}

<!--
Job represents the configuration of a single job.
-->
Job 表示單個任務的配置。

<hr>

- **apiVersion**: batch/v1

- **kind**: Job

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  任務的預期行爲的規約。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  Current status of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  任務的當前狀態。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## JobSpec {#JobSpec}

<!--
JobSpec describes how the job execution will look like.
-->
JobSpec 描述了任務執行的情況。

<hr>

### Replicas

<!--
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  Describes the pod that will be created when executing a job. The only allowed template.spec.restartPolicy values are "Never" or "OnFailure". More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) \< .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)，必需

  描述執行任務時將創建的 Pod。template.spec.restartPolicy 可以取的值只能是
  "Never" 或 "OnFailure"。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

- **parallelism** (int32)

  指定任務應在任何給定時刻預期運行的 Pod 個數上限。
  當(.spec.completions - .status.successful) \< .spec.parallelism 時，
  即當剩餘的工作小於最大並行度時，在穩定狀態下運行的 Pod 的實際數量將小於此數量。
  更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

### Lifecycle

<!--
- **completions** (int32)

  Specifies the desired number of successfully finished pods the job should be run with.  Setting to null means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
-->
- **completions** (int32)

  指定任務應該運行並預期成功完成的 Pod 個數。設置爲空意味着任何 Pod 的成功都標識着所有 Pod 的成功，
  並允許 parallelism 設置爲任何正值。設置爲 1 意味着並行性被限制爲 1，並且該 Pod 的成功標誌着任務的成功。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

<!--
- **completionMode** (string)

  completionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.
  
  `NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.
-->
- **completionMode** (string)

  completionMode 指定如何跟蹤 Pod 完成情況。它可以是 `NonIndexed`（默認）或者 `Indexed`。

  `NonIndexed` 表示當有 `.spec.completions` 個成功完成的 Pod 時，認爲 Job 完成。每個 Pod 完成都是彼此同源的。

  <!--
  `Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.io/job-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.
  -->

  `Indexed` 意味着 Job 的各個 Pod 會獲得對應的完成索引值，從 0 到（`.spec.completions - 1`），可在註解
  "batch.kubernetes.io/job-completion-index" 中找到。當每個索引都對應有一個成功完成的 Pod 時，
  該任務被認爲是完成的。
  當值爲 `Indexed` 時，必須指定 `.spec.completions` 並且 `.spec.parallelism` 必須小於或等於 10^5。
  此外，Pod 名稱採用 `$(job-name)-$(index)-$(random-string)` 的形式，Pod 主機名採用
  `$(job-name)-$(index)` 的形式。

  <!--
  More completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, which is possible during upgrades due to version skew, the controller skips updates for the Job.
  -->

  將來可能添加更多的完成模式。如果 Job 控制器發現它無法識別的模式
  （這種情況在升級期間由於版本偏差可能發生），則控制器會跳過 Job 的更新。

<!--
- **backoffLimit** (int32)

  Specifies the number of retries before marking this job failed. Defaults to 6

- **activeDeadlineSeconds** (int64)

  Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again.
-->
- **backoffLimit** (int32)

  指定標記此任務失敗之前的重試次數。默認值爲 6。

- **activeDeadlineSeconds** (int64)

  系統嘗試終止任務之前任務可以持續活躍的持續時間（秒），時間長度是相對於 startTime 的；
  字段值必須爲正整數。如果任務被掛起（在創建期間或因更新而掛起），
  則當任務再次恢復時，此計時器會被停止並重置。

<!--
- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes.
-->
- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished 限制已完成執行（完成或失敗）的任務的生命週期。如果設置了這個字段，
  在 Job 完成 ttlSecondsAfterFinished 秒之後，就可以被自動刪除。
  當 Job 被刪除時，它的生命週期保證（例如終結器）會被考察。
  如果未設置此字段，則任務不會被自動刪除。如果此字段設置爲零，則任務在完成後即可立即刪除。

<!--
- **suspend** (boolean)

  suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.
-->
- **suspend** (boolean)

  suspend 指定 Job 控制器是否應該創建 Pod。如果創建 Job 時將 suspend 設置爲 true，則 Job 控制器不會創建任何 Pod。
  如果 Job 在創建後被掛起（即標誌從 false 變爲 true），則 Job 控制器將刪除與該 Job 關聯的所有活動 Pod。
  用戶必須設計他們的工作負載來優雅地處理這個問題。暫停 Job 將重置 Job 的 startTime 字段，
  也會重置 ActiveDeadlineSeconds 計時器。默認爲 false。

### Selector

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  對應與 Pod 計數匹配的 Pod 的標籤查詢。通常，系統會爲你設置此字段。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **manualSelector** (boolean)

  manualSelector 控制 Pod 標籤和 Pod 選擇器的生成。除非你確定你在做什麼，否則不要設置 `manualSelector`。
  當此字段爲 false 或未設置時，系統會選擇此 Pod 唯一的標籤並將這些標籤附加到 Pod 模板。
  當此字段爲 true 時，用戶負責選擇唯一標籤並指定選擇器。
  未能選擇唯一標籤可能會導致此任務和其他任務無法正常運行。但是，你可能會在使用舊的 `extensions/v1beta1` API
  創建的任務中看到 `manualSelector=true`。更多信息：
  https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector

<!--
### Beta level

- **podFailurePolicy** (PodFailurePolicy)

  Specifies the policy of handling failed pods. In particular, it allows to specify the set of actions and conditions which need to be satisfied to take the associated action. If empty, the default behaviour applies - the counter of failed pods, represented by the jobs's .status.failed field, is incremented and it is checked against the backoffLimit. This field cannot be used in combination with restartPolicy=OnFailure.
-->
### Beta 級別   {#beta-level}

- **podFailurePolicy** (PodFailurePolicy)

  指定處理失效 Pod 的策略。特別是，它允許指定採取關聯操作需要滿足的一組操作和狀況。
  如果爲空，則應用默認行爲：由該任務的 .status.failed 字段表示的失效 Pod 的計數器將遞增，
  並針對 backoffLimit 進行檢查。此字段不能與 restartPolicy=OnFailure 結合使用。

  <!--
  <a name="PodFailurePolicy"></a>
  *PodFailurePolicy describes how failed pods influence the backoffLimit.*
  -->

  <a name="PodFailurePolicy"></a>
  **PodFailurePolicy 描述失效的 Pod 如何影響 backoffLimit。**

  <!--
  - **podFailurePolicy.rules** ([]PodFailurePolicyRule), required

    *Atomic: will be replaced during a merge*
    
    A list of pod failure policy rules. The rules are evaluated in order. Once a rule matches a Pod failure, the remaining of the rules are ignored. When no rule matches the Pod failure, the default handling applies - the counter of pod failures is incremented and it is checked against the backoffLimit. At most 20 elements are allowed.
  -->

  - **podFailurePolicy.rules** ([]PodFailurePolicyRule)，必需

    **原子性：將在合併期間被替換**
    
    Pod 失效策略規則的列表。這些規則按順序進行評估。一旦某規則匹配 Pod 失效，則其餘規將被忽略。
    當沒有規則匹配 Pod 失效時，將應用默認的處理方式：
    Pod 失效的計數器遞增並針對 backoffLimit 進行檢查。最多允許 20 個。

    <!--
    <a name="PodFailurePolicyRule"></a>
    *PodFailurePolicyRule describes how a pod failure is handled when the requirements are met. One of onExitCodes and onPodConditions, but not both, can be used in each rule.*
    -->

    <a name="PodFailurePolicyRule"></a>
    **PodFailurePolicyRule 描述當滿足要求時如何處理一個 Pod 失效。
    在每個規則中可以使用 onExitCodes 和 onPodConditions 之一，但不能同時使用二者。**

    <!--
    - **podFailurePolicy.rules.action** (string), required

      Specifies the action taken on a pod failure when the requirements are satisfied. Possible values are:
      
      - FailJob: indicates that the pod's job is marked as Failed and all
        running pods are terminated.
      - FailIndex: indicates that the pod's index is marked as Failed and will
        not be restarted.
    -->

    - **podFailurePolicy.rules.action** (string)，必需

      指定當要求滿足時對 Pod 失效採取的操作。可能的值是：

      - FailJob：表示 Pod 的任務被標記爲 Failed 且所有正在運行的 Pod 都被終止。
      - FailIndex：表示 Pod 對應的索引被標記爲 Failed 且 Pod 不會被重新啓動。

      <!--
      - Ignore: indicates that the counter towards the .backoffLimit is not
        incremented and a replacement pod is created.
      - Count: indicates that the pod is handled in the default way - the
        counter towards the .backoffLimit is incremented.
      Additional values are considered to be added in the future. Clients should react to an unknown action by skipping the rule.
      -->

      - Ignore：表示 .backoffLimit 的計數器沒有遞增，並創建了一個替代 Pod。

      - Count：表示以默認方式處理該 Pod，計數器朝着 .backoffLimit 的方向遞增。

      後續會考慮增加其他值。客戶端應通過跳過此規則對未知的操作做出反應。

      - **podFailurePolicy.rules.onPodConditions.status** (string)，必需

        指定必需的 Pod 狀況狀態。要匹配一個 Pod 狀況，指定的狀態必須等於該 Pod 狀況狀態。默認爲 True。

      - **podFailurePolicy.rules.onPodConditions.type** (string)，必需

        指定必需的 Pod 狀況類型。要匹配一個 Pod 狀況，指定的類型必須等於該 Pod 狀況類型。

    <!--
    - **podFailurePolicy.rules.onExitCodes** (PodFailurePolicyOnExitCodesRequirement)

      Represents the requirement on the container exit codes.

      <a name="PodFailurePolicyOnExitCodesRequirement"></a>
      *PodFailurePolicyOnExitCodesRequirement describes the requirement for handling a failed pod based on its container exit codes. In particular, it lookups the .state.terminated.exitCode for each app container and init container status, represented by the .status.containerStatuses and .status.initContainerStatuses fields in the Pod status, respectively. Containers completed with success (exit code 0) are excluded from the requirement check.*
    -->

    - **podFailurePolicy.rules.onExitCodes** (PodFailurePolicyOnExitCodesRequirement)

      表示容器退出碼有關的要求。

      <a name="PodFailurePolicyOnExitCodesRequirement"></a>
      **PodFailurePolicyOnExitCodesRequirement 描述根據容器退出碼處理失效 Pod 的要求。
      特別是，它爲每個應用容器和 Init 容器狀態查找在 Pod 狀態中分別用 .status.containerStatuses 和
      .status.initContainerStatuses 字段表示的 .state.terminated.exitCode。
      成功完成的容器（退出碼 0）被排除在此要求檢查之外。**

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

        表示容器退出碼和指定值之間的關係。成功完成的容器（退出碼 0）被排除在此要求檢查之外。可能的值爲：
        
        - In：如果至少一個容器退出碼（如果有多個容器不受 'containerName' 字段限制，則可能是多個退出碼）
          在一組指定值中，則滿足要求。

        - NotIn：如果至少一個容器退出碼（如果有多個容器不受 'containerName' 字段限制，則可能是多個退出碼）
          不在一組指定值中，則滿足要求。

        後續會考慮增加其他值。客戶端應通過假設不滿足要求來對未知操作符做出反應。

      <!--
      - **podFailurePolicy.rules.onExitCodes.values** ([]int32), required

        *Set: unique values will be kept during a merge*
        
        Specifies the set of values. Each returned container exit code (might be multiple in case of multiple containers) is checked against this set of values with respect to the operator. The list of values must be ordered and must not contain duplicates. Value '0' cannot be used for the In operator. At least one element is required. At most 255 elements are allowed.
      -->

      - **podFailurePolicy.rules.onExitCodes.values** ([]int32)，必需

        **集合：合併期間保留唯一值**
        
        指定值集。每個返回的容器退出碼（在多個容器的情況下可能是多個）將根據該操作符有關的這個值集進行檢查。
        值的列表必須有序且不得包含重複項。值 '0' 不能用於 In 操作符。至少需要 1 個。最多允許 255 個。

      <!--
      - **podFailurePolicy.rules.onExitCodes.containerName** (string)

        Restricts the check for exit codes to the container with the specified name. When null, the rule applies to all containers. When specified, it should match one the container or initContainer names in the pod template.
      -->

      - **podFailurePolicy.rules.onExitCodes.containerName** (string)

        將退出碼的檢查限制爲具有指定名稱的容器。當爲 null 時，該規則適用於所有容器。
        當被指定時，它應與 Pod 模板中的容器名稱或 initContainer 名稱之一匹配。

    <!--
    - **podFailurePolicy.rules.onPodConditions** ([]PodFailurePolicyOnPodConditionsPattern), required

      *Atomic: will be replaced during a merge*
    -->

    - **podFailurePolicy.rules.onPodConditions** ([]PodFailurePolicyOnPodConditionsPattern)，必需

      **原子性：將在合併期間被替換**

      <!--
      Represents the requirement on the pod conditions. The requirement is represented as a list of pod condition patterns. The requirement is satisfied if at least one pattern matches an actual pod condition. At most 20 elements are allowed.

      <a name="PodFailurePolicyOnPodConditionsPattern"></a>
      *PodFailurePolicyOnPodConditionsPattern describes a pattern for matching an actual pod condition type.*
      -->

      表示對 Pod 狀況的要求。該要求表示爲 Pod 狀況模式的一個列表。
      如果至少一個模式與實際的 Pod 狀況匹配，則滿足此要求。最多允許 20 個。

      <a name="PodFailurePolicyOnPodConditionsPattern"></a>
      **PodFailurePolicyOnPodConditionsPattern 描述與實際 Pod 狀況類型匹配的模式。**

      <!--
      - **podFailurePolicy.rules.onPodConditions.status** (string), required

        Specifies the required Pod condition status. To match a pod condition it is required that the specified status equals the pod condition status. Defaults to True.

      - **podFailurePolicy.rules.onPodConditions.type** (string), required

        Specifies the required Pod condition type. To match a pod condition it is required that specified type equals the pod condition type.
      -->
      - **podFailurePolicy.rules.onPodConditions.status** (string)，必需

        指定必需的 Pod 狀況狀態。要匹配一個 Pod 狀況，指定的狀態必須等於該 Pod 狀況狀態。默認爲 True。

      - **podFailurePolicy.rules.onPodConditions.type** (string)，必需

        指定必需的 Pod 狀況類型。要匹配一個 Pod 狀況，指定的類型必須等於該 Pod 狀況類型。

- **successPolicy** (SuccessPolicy)
  <!--
  successPolicy specifies the policy when the Job can be declared as succeeded. If empty, the default behavior applies - the Job is declared as succeeded only when the number of succeeded pods equals to the completions. When the field is specified, it must be immutable and works only for the Indexed Jobs. Once the Job meets the SuccessPolicy, the lingering pods are terminated.
  -->

  successPolicy 指定策略，用於判定何時可以聲明任務爲成功。如果爲空，則應用默認行爲 —— 僅當成功
  Pod 的數量等於完成數量時，任務纔會被聲明爲成功。指定了該字段時，該字段必須是不可變的，
  並且僅適用於帶索引的任務。一旦任務滿足 `successPolicy`，滯留 Pod 就會被終止。

  <a name="SuccessPolicy"></a>

  <!--
  *SuccessPolicy describes when a Job can be declared as succeeded based on the success of some indexes.*

  **successPolicy.rules** ([]SuccessPolicyRule), required

  *Atomic: will be replaced during a merge*
   
  rules represents the list of alternative rules for the declaring the Jobs as successful before `.status.succeeded >= .spec.completions`. Once any of the rules are met, the "SucceededCriteriaMet" condition is added, and the lingering pods are removed. The terminal state for such a Job has the "Complete" condition. Additionally, these rules are evaluated in order; Once the Job meets one of the rules, other rules are ignored. At most 20 elements are allowed.
  -->

  **successPolicy 描述何時可以根據某些索引的成功將任務聲明爲成功。**

  **successPolicy.rules** ([]SuccessPolicyRule)，必需

  **原子性：合併期間會被替換**

  rules 表示在 `.status.succeeded >= .spec.completions` 之前將任務聲明爲成功的備選規則列表。
  一旦滿足任何規則，就會添加 `SucceededCriteriaMet` 狀況，並刪除滯留的 Pod。
  此類 Pod 的最終狀態具有 `Complete` 狀況。此外，這些規則按順序進行評估；
  一旦任務滿足其中一條規則，其他規則將被忽略。最多允許 20 個元素。

  <a name="SuccessPolicyRule"></a>
  <!--
  *SuccessPolicyRule describes rule for declaring a Job as succeeded. Each rule must have at least one of the "succeededIndexes" or "succeededCount" specified.*
  -->

  **SuccessPolicyRule 描述了將任務聲明爲成功的規則。每條規則必須至少指定 `succeededIndexes` 或 `succeededCount` 之一。**

- **successPolicy.rules.succeededCount** (int32)

  <!--
  succeededCount specifies the minimal required size of the actual set of the succeeded indexes for the Job. When succeededCount is used along with succeededIndexes, the check is constrained only to the set of indexes specified by succeededIndexes. For example, given that succeededIndexes is "1-4", succeededCount is "3", and completed indexes are "1", "3", and "5", the Job isn't declared as succeeded because only "1" and "3" indexes are considered in that rules. When this field is null, this doesn't default to any value and is never evaluated at any time. When specified it needs to be a positive integer.
  -->

  `succeededCount` 指定任務成功索引集所需的最小規模。當 `succeededCount` 與 `succeededIndexes` 一起使用時，
  僅檢查由 `succeededIndexes` 指定的索引集合。例如，假定 `succeededIndexes` 是
  "1-4"，succeededCount 是 "3"，而完成的索引是 "1"、"3" 和 "5"，那麼該任務不會被視爲成功，
  因爲在該規則下只考慮了 "1" 和 "3" 索引。當該字段爲 null 時，不會被視爲具有默認值，
  並且在任何時候都不會進行評估。當該字段被設置時，所設置的值應是一個正整數。

- **successPolicy.rules.succeededIndexes** (string)

  <!--
  succeededIndexes specifies the set of indexes which need to be contained in the actual set of the succeeded indexes for the Job. The list of indexes must be within 0 to ".spec.completions-1" and must not contain duplicates. At least one element is required. The indexes are represented as intervals separated by commas. The intervals can be a decimal integer or a pair of decimal integers separated by a hyphen. The number are listed in represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". When this field is null, this field doesn't default to any value and is never evaluated at any time.
  -->

  `succeededIndexes` 指定需要包含在實際完成索引集合中的各個索引。索引列表必須在 0 到 `.spec.completions-1`
  之間，並且不能包含重複項。至少需要一個元素。索引表示爲用逗號分隔的區間。
  區間可以是一個十進制整數或一對由破折號分隔的十進制整數。數字序列用區間的第一個和最後一個元素來表示，
  並用破折號分隔。例如，如果完成的索引是 1、3、4、5 和 7，則表示爲 "1,3-5,7"。
  當該字段爲 null 時，該字段不會默認爲任何值，並且在任何時候都不會進行評估。

<!--
### Alpha level
-->
### Alpha 級別   {#alpha-level}

<!--
- **backoffLimitPerIndex** (int32)

  Specifies the limit for the number of retries within an index before marking this index as failed. When enabled the number of failures per index is kept in the pod's batch.kubernetes.io/job-index-failure-count annotation. It can only be set when Job's completionMode=Indexed, and the Pod's restart policy is Never. The field is immutable.
-->
- **backoffLimitPerIndex**（int32）

  指定在將特定索引的 Pod 標記爲失敗之前在對該 Pod 重試次數的限制。
  啓用後，各索引的失敗次數將保存在 Pod 的 `batch.kubernetes.io/job-index-failure-count` 註解中。
  僅當 Job 的 completionMode=Indexed 且 Pod 的重啓策略爲 Never 時才能設置此字段。
  此字段是不可變更的。

- **managedBy** (string)

  <!--
  ManagedBy field indicates the controller that manages a Job. The k8s Job controller reconciles jobs which don't have this field at all or the field value is the reserved string `kubernetes.io/job-controller`, but skips reconciling Jobs with a custom value for this field. The value must be a valid domain-prefixed path (e.g. acme.io/foo) - all characters before the first "/" must be a valid subdomain as defined by RFC 1123. All characters trailing the first "/" must be valid HTTP Path characters as defined by RFC 3986. The value cannot exceed 63 characters. This field is immutable.
 
  This field is beta-level. The job controller accepts setting the field when the feature gate JobManagedBy is enabled (enabled by default).
  -->

  `managedBy` 字段標明管理任務的控制器。
  Kubernetes 的 Job 控制器會協調那些沒有這個字段或字段值爲保留字符串 `kubernetes.io/job-controller` 的任務，
  但會跳過協調那些爲此字段設置了自定義值的任務。字段值必須是一個包含有效域名前綴的路徑（例如 `acme.io/foo`）—— 第一個 `/` 之前的全部字符必須符合
  RFC 1123 定義的有效子域。第一個 / 後面的所有字符必須是 RFC 3986 定義的有效 HTTP 路徑字符。
  字段值的長度不能超過 63 個字符。此字段是不可變的。

  此字段處於 Beta 階段。當啓用 `JobManagedBy` 特性門控時（默認情況下啓用），任務控制器接受設置此字段。

<!--
- **maxFailedIndexes** (int32)

  Specifies the maximal number of failed indexes before marking the Job as failed, when backoffLimitPerIndex is set. Once the number of failed indexes exceeds this number the entire Job is marked as Failed and its execution is terminated. When left as null the job continues execution of all of its indexes and is marked with the `Complete` Job condition. It can only be specified when backoffLimitPerIndex is set. It can be null or up to completions. It is required and must be less than or equal to 10^4 when is completions greater than 10^5.
-->
- **maxFailedIndexes**（int32）

  指定在 backoffLimitPerIndex 被設置時、標記 Job 爲失敗之前所允許的最大失敗索引數。
  一旦失敗的索引數超過此數值，整個 Job 將被標記爲 Failed 並終止執行。
  如果不設置此字段（對應爲 null），則作業繼續執行其所有索引，且 Job 會被標記 `Complete` 狀況。
  此字段只能在設置 backoffLimitPerIndex 時指定。此字段值可以是 null 或完成次數之內的值。
  當完成次數大於 10^5 時，此字段是必需的且必須小於等於 10^4。

<!--
- **podReplacementPolicy** (string)

  podReplacementPolicy specifies when to create replacement Pods. Possible values are: - TerminatingOrFailed means that we recreate pods
    when they are terminating (has a metadata.deletionTimestamp) or failed.
  - Failed means to wait until a previously created Pod is fully terminated (has phase
    Failed or Succeeded) before creating a replacement Pod.
-->
- **podReplacementPolicy**（string）

  podReplacementPolicy 指定何時創建替代的 Pod。可能的值包括：
  
  - TerminatingOrFailed：表示當 Pod 處於終止中（具有 metadata.deletionTimestamp）或失敗時，重新創建 Pod。
  - Failed：表示在創建替代的 Pod 之前，等待先前創建的 Pod 完全終止（處於 Failed 或 Succeeded 階段）。

  <!--
  When using podFailurePolicy, Failed is the the only allowed value. TerminatingOrFailed and Failed are allowed values when podFailurePolicy is not in use. This is an beta field. To use this, enable the JobPodReplacementPolicy feature toggle. This is on by default.
  -->
  當使用 podFailurePolicy 時，Failed 是唯一允許值。
  當不使用 podFailurePolicy 時，允許使用 TerminatingOrFailed 和 Failed。
  這是一個 Beta 級別的字段。要使用此特性，請啓用 JobPodReplacementPolicy 特性門控。
  此特性默認處於被啓用狀態。

## JobStatus {#JobStatus}

<!--
JobStatus represents the current state of a Job.
-->
JobStatus 表示 Job 的當前狀態。

<hr>

<!--
- **startTime** (Time)

  Represents time when the job controller started processing a job. When a Job is created in the suspended state, this field is not set until the first time it is resumed. This field is reset every time a Job is resumed from suspension. It is represented in RFC3339 form and is in UTC.

  Once set, the field can only be removed when the job is suspended. The field cannot be modified while the job is unsuspended or finished.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **startTime** (Time)

  表示任務控制器開始處理任務的時間。在掛起狀態下創建 Job 時，直到第一次恢復時纔會設置此字段。
  每次從暫停中恢復任務時都會重置此字段。它表示爲 RFC3339 格式的 UTC 時間。

  一旦設置，僅當 Job 被掛起時纔可移除該字段。Job 取消掛起或完成時，無法修改該字段。

  <a name="Time"></a>
  **Time 是 time.Time 的包裝器，支持正確編碼爲 YAML 和 JSON。time 包提供的許多工廠方法都提供了包裝器。**

<!--
- **completionTime** (Time)

  Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is set when the job finishes successfully, and only then. The value cannot be updated or removed. The value indicates the same or later point in time as the startTime field.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **completionTime** (Time)

  表示 Job 完成的時間。不能保證對多個獨立操作按發生的先後順序設置。此字段表示爲 RFC3339 格式的 UTC 時間。
  完成時間在且僅在 Job 成功完成時設置。該值無法更新或刪除。該值表示與 startTime 字段相同或更晚的時間點。

  <a name="Time"></a>
  **Time 是 time.Time 的包裝器，支持正確編碼爲 YAML 和 JSON。time 包提供的許多工廠方法都提供了包裝器。**

<!--
- **active** (int32)

  The number of pending and running pods which are not terminating (without a deletionTimestamp). The value is zero for finished jobs.

- **failed** (int32)

  The number of pods which reached phase Failed. The value increases monotonically.

- **succeeded** (int32)

  The number of pods which reached phase Succeeded. The value increases monotonically for a given spec. However, it may decrease in reaction to scale down of elastic indexed jobs.
-->
- **active** (int32)

  未處於終止進程中（未設置 `deletionTimestamp`）的待處理和正在運行的 Pod 數量。對於已完成的 Job，該值爲零。

- **failed** (int32)

  進入 Failed 階段的 Pod 數量。該值單調增加。

- **succeeded** (int32)

  進入 Succeeded 階段的 Pod 數量。對於給定的規範，該值會單調增加。
  但是，由於彈性索引任務的縮減，該值可能會減少。
<!--
- **completedIndexes** (string)

  completedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7".
-->
- **completedIndexes** (string)

  completedIndexes 以文本格式保存 `.spec.completionMode` 設置爲 `"Indexed"` 的 Pod 已完成的索引。
  索引用十進制整數表示，用逗號分隔。數字是按遞增的順序排列的。三個或更多的連續數字被壓縮，
  用系列的第一個和最後一個元素表示，用連字符分開。例如，如果完成的索引是 1、3、4、5 和 7，則表示爲 "1、3-5、7"。

<!--
- **conditions** ([]JobCondition)

  *Patch strategy: merge on key `type`*

  *Atomic: will be replaced during a merge*

  The latest available observations of an object's current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true.
  
  A job is considered finished when it is in a terminal condition, either "Complete" or "Failed". A Job cannot have both the "Complete" and "Failed" conditions. Additionally, it cannot be in the "Complete" and "FailureTarget" conditions. The "Complete", "Failed" and "FailureTarget" conditions cannot be disabled.

  More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  *JobCondition describes current state of a job.*
-->
- **conditions** ([]JobCondition)

  **補丁策略：根據 `type` 鍵合併**

  **原子性：將在合併期間被替換**

  對象當前狀態的最新可用觀察結果。當任務失敗時，其中一個狀況的類型爲 “Failed”，狀態爲 true。
  當任務被暫停時，其中一個狀況的類型爲 “Suspended”，狀態爲true；當任務被恢復時，該狀況的狀態將變爲 false。
  任務完成時，其中一個狀況的類型爲 "Complete"，狀態爲 true。

  當任務處於最終狀態（即 "Complete" 或 "Failed"）時，即視爲任務已完成。任務不能同時處於 "Complete" 和 "Failed" 狀態。
  此外，任務也不能處於 "Complete" 和 "FailureTarget" 狀態。"Complete"、"Failed" 和 "FailureTarget" 狀態不能被禁用。

  更多信息：https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/jobs-run-to-completion/

  <a name="JobCondition"></a>
  **JobCondition 描述任務的當前狀況。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of job condition, Complete or Failed.

  - **conditions.lastProbeTime** (Time)

    Last time the condition was checked.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態：True、False、Unknown 之一。

  - **conditions.type** (string)，必需

    任務狀況的類型：Completed 或 Failed。

  - **conditions.lastProbeTime** (Time)

    最後一次探測的時間。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    
    <a name="Time"></a>
    **Time 是對 time.Time 的封裝，支持正確編碼爲 YAML 和 JSON。我們爲 time 包提供的許多工廠方法提供了封裝器。**

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transit from one status to another.
  -->

  - **conditions.lastTransitionTime** (Time)

    上一次從一種狀況轉換到另一種狀況的時間。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    <a name="Time"></a>
    **Time 是 time.Time 的包裝器，支持正確編碼爲 YAML 和 JSON。time 包提供的許多工廠方法都提供了包裝器。**

  <!--
  - **conditions.message** (string)

    Human readable message indicating details about last transition.

  - **conditions.reason** (string)

    (brief) reason for the condition's last transition. 
  -->

  - **conditions.message** (string)

    表示上次轉換信息的人類可讀消息。

  - **conditions.reason** (string)

    狀況最後一次轉換的（簡要）原因

<!--
- **uncountedTerminatedPods** (UncountedTerminatedPods)

  uncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.

  The job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status:
  
  1. Add the pod UID to the arrays in this field. 2. Remove the pod finalizer. 3. Remove the pod UID from the arrays while increasing the corresponding
      counter.
-->
- **uncountedTerminatedPods** (UncountedTerminatedPods)

  UncountedTerminatedPods 保存已終止但尚未被任務控制器納入狀態計數器中的 Pod 的 UID 的集合。

  任務控制器所創建 Pod 帶有終結器。當 Pod 終止（成功或失敗）時，控制器將執行三個步驟以在任務狀態中對其進行說明：

  1. 將 Pod UID 添加到此字段的列表中。
  2. 去掉 Pod 中的終結器。
  3. 從數組中刪除 Pod UID，同時爲相應的計數器加一。

  <!--
  Old jobs might not be tracked using this field, in which case the field remains null. The structure is empty for finished jobs.

  <a name="UncountedTerminatedPods"></a>
  *UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters.*
  -->
  使用此字段可能無法跟蹤舊任務，在這種情況下，該字段保持爲空。對於已完成的任務，此結構爲空。

  <a name="UncountedTerminatedPods"></a>
  **UncountedTerminatedPods 持有已經終止的 Pod 的 UID，但還沒有被計入工作狀態計數器中。**

  <!--
  - **uncountedTerminatedPods.failed** ([]string)

    *Set: unique values will be kept during a merge*
    
    failed holds UIDs of failed Pods.
  -->

  - **uncountedTerminatedPods.failed** ([]string)

    **集合：合併期間保留唯一值**

    failed 字段包含已失敗 Pod 的 UID。

  <!--
  - **uncountedTerminatedPods.succeeded** ([]string)

    *Set: unique values will be kept during a merge*
    
    succeeded holds UIDs of succeeded Pods.
  -->

  - **uncountedTerminatedPods.succeeded** ([]string)

    **集合：合併期間保留唯一值**

    succeeded 包含已成功的 Pod 的 UID。

<!--
### Beta level
-->
### Beta 級別   {#beta-level}

<!--
- **ready** (int32)

  The number of active pods which have a Ready condition and are not terminating (without a deletionTimestamp).
-->
- **ready** (int32)

  具有 Ready 狀況且未處於終止過程中（沒有設置 `deletionTimestamp`）的活動 Pod 的數量。

<!--
### Alpha level
-->
### Alpha 級別

<!--
- **failedIndexes** (string)

  FailedIndexes holds the failed indexes when spec.backoffLimitPerIndex is set. The indexes are represented in the text format analogous as for the `completedIndexes` field, ie. they are kept as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the failed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". The set of failed indexes cannot overlap with the set of completed indexes.
-->
- **failedIndexes** (string)

  當設置了 `spec.backoffLimitPerIndex` 時，failedIndexes 保存失敗的索引。
  索引以文本格式表示，類似於 `completedIndexes` 字段，即這些索引是使用逗號分隔的十進制整數。
  這些數字按升序列出。三個或更多連續的數字會被壓縮，整個序列表示爲第一個數字、連字符和最後一個數字。
  例如，如果失敗的索引是 1、3、4、5 和 7，則表示爲 "1,3-5,7"。
  失敗索引集不能與完成索引集重疊。

<!--
- **terminating** (int32)

  The number of pods which are terminating (in phase Pending or Running and have a deletionTimestamp).
  
  This field is beta-level. The job controller populates the field when the feature gate JobPodReplacementPolicy is enabled (enabled by default).
-->
- **terminating**（int32）

  正在終止的 Pod 數量（處於 Pending 或 Running 階段且具有 deletionTimestamp）。
  
  此字段是 Beta 級別的。當特性門控 JobPodReplacementPolicy 被啓用時（默認被啓用），
  Job 控制器會填充該字段。

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

  標準列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>), required

  items 是 Job 對象的列表。

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
### `get` 讀取指定的 Job

#### HTTP 請求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 參數

- **name** (**路徑參數**)：string，必需

  Job 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->
### `get` 讀取指定任務的狀態

#### HTTP 請求

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Job

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
### `list` 列舉或監測 Job 類別的對象

#### HTTP 請求

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Job

#### HTTP Request

GET /apis/batch/v1/jobs

#### Parameters
-->
### `list` 列舉或監測 Job 類別的對象

#### HTTP 請求

GET /apis/batch/v1/jobs

#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): OK

401: Unauthorized

<!--
### `create` create a Job

#### HTTP Request

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->
### `create` 創建一個 Job

#### HTTP 請求

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

202 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Job

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters
-->
### `update` 替換指定的 Job

#### HTTP 請求

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->
- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Job

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->
### `update` 替換指定 Job 的狀態

#### HTTP 請求

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, required
-->
- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Job

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}
-->
### `patch` 部分更新指定的 Job

#### HTTP 請求

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
#### 參數

- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Job

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 Job 的狀態

#### HTTP 請求

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): OK

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

<!--
### `delete` delete a Job

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Parameters

- **name** (*in path*): string, required

  name of the Job

- **namespace** (*in path*): string, required
-->
### `delete` 刪除一個 Job

#### HTTP 請求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### 參數

- **name** (**路徑參數**): string，必需

  Job 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Job

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### Parameters

- **namespace** (*in path*): string, required

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
### `deletecollection` 刪除 Job 的集合

#### HTTP 請求

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
