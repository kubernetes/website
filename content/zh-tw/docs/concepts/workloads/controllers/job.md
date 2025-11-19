---
title: Job
content_type: concept
description: >-
  Job 表示一次性任務，運行完成後就會停止。
feature:
  title: 批量執行
  description: >
    除了服務之外，Kubernetes 還可以管理你的批處理和 CI 工作負載，在期望時替換掉失效的容器。
weight: 50
hide_summary: true # 在章節索引中單獨列出
---
<!--
reviewers:
- erictune
- mimowo
- soltysh
title: Jobs
content_type: concept
description: >-
  Jobs represent one-off tasks that run to completion and then stop.
feature:
  title: Batch execution
  description: >
    In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.
weight: 50
hide_summary: true # Listed separately in section index
-->

<!-- overview -->

<!--
A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.
As pods successfully complete, the Job tracks the successful completions. When a specified number
of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up
the Pods it created. Suspending a Job will delete its active Pods until the Job
is resumed again.
-->
Job 會創建一個或者多個 Pod，並將繼續重試 Pod 的執行，直到指定數量的 Pod 成功終止。
隨着 Pod 成功結束，Job 跟蹤記錄成功完成的 Pod 個數。
當數量達到指定的成功個數閾值時，任務（即 Job）結束。
刪除 Job 的操作會清除所創建的全部 Pod。
掛起 Job 的操作會刪除 Job 的所有活躍 Pod，直到 Job 被再次恢復執行。

<!--
A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example
due to a node hardware failure or a node reboot).

You can also use a Job to run multiple Pods in parallel.

If you want to run a Job (either a single task, or several in parallel) on a schedule,
see [CronJob](/docs/concepts/workloads/controllers/cron-jobs/).
-->
一種簡單的使用場景下，你會創建一個 Job 對象以便以一種可靠的方式運行某 Pod 直到完成。
當第一個 Pod 失敗或者被刪除（比如因爲節點硬件失效或者重啓）時，Job
對象會啓動一個新的 Pod。

你也可以使用 Job 以並行的方式運行多個 Pod。

如果你想按某種排期表（Schedule）運行 Job（單個任務或多個並行任務），請參閱
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)。

<!-- body -->

<!--
## Running an example Job

Here is an example Job config. It computes π to 2000 places and prints it out.
It takes around 10s to complete.
-->
## 運行示例 Job     {#running-an-example-job}

下面是一個 Job 配置示例。它負責計算 π 到小數點後 2000 位，並將結果打印出來。
此計算大約需要 10 秒鐘完成。

{{% code_sample file="controllers/job.yaml" %}}

<!--
You can run the example with this command:
-->
你可以使用下面的命令來運行此示例：

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```
job.batch/pi created
```

<!--
Check on the status of the Job with `kubectl`:
-->
使用 `kubectl` 來檢查 Job 的狀態：

<!--
tabs name="Check status of Job" 
-->
{{< tabs name="檢查 Job 狀態" >}}
{{< tab name="kubectl describe job pi" codelang="bash" >}}
Name:           pi
Namespace:      default
Selector:       batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                batch.kubernetes.io/job-name=pi
                ...
Annotations:    batch.kubernetes.io/job-tracking: ""
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           batch.kubernetes.io/job-name=pi
  Containers:
   pi:
    Image:      perl:5.34.0
    Port:       <none>
    Host Port:  <none>
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  21s   job-controller  Created pod: pi-xf9p4
  Normal  Completed         18s   job-controller  Job completed
{{< /tab >}}
{{< tab name="kubectl get job pi -o yaml" codelang="bash" >}}
apiVersion: batch/v1
kind: Job
metadata:
  annotations: batch.kubernetes.io/job-tracking: ""
             ...  
  creationTimestamp: "2022-11-10T17:53:53Z"
  generation: 1
  labels:
    batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
    batch.kubernetes.io/job-name: pi
  name: pi
  namespace: default
  resourceVersion: "4751"
  uid: 204fb678-040b-497f-9266-35ffa8716d14
spec:
  backoffLimit: 4
  completionMode: NonIndexed
  completions: 1
  parallelism: 1
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
  suspend: false
  template:
    metadata:
      creationTimestamp: null
      labels:
        batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
        batch.kubernetes.io/job-name: pi
    spec:
      containers:
      - command:
        - perl
        - -Mbignum=bpi
        - -wle
        - print bpi(2000)
        image: perl:5.34.0
        imagePullPolicy: IfNotPresent
        name: pi
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Never
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
status:
  active: 1
  ready: 0
  startTime: "2022-11-10T17:53:57Z"
  uncountedTerminatedPods: {}
{{< /tab >}}
{{< /tabs >}}

<!--
To view completed Pods of a Job, use `kubectl get pods`.

To list all the Pods that belong to a Job in a machine readable form, you can use a command like this:
-->
要查看 Job 對應的已完成的 Pod，可以執行 `kubectl get pods`。

要以機器可讀的方式列舉隸屬於某 Job 的全部 Pod，你可以使用類似下面這條命令：

```shell
pods=$(kubectl get pods --selector=batch.kubernetes.io/job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

<!--
The output is similar to this:
-->
輸出類似於：

```
pi-5rwd7
```

<!--
Here, the selector is the same as the selector for the Job. The `--output=jsonpath` option specifies an expression
with the name from each Pod in the returned list.

View the standard output of one of the pods:
-->
這裏，選擇算符與 Job 的選擇算符相同。`--output=jsonpath` 選項給出了一個表達式，
用來從返回的列表中提取每個 Pod 的 name 字段。

查看其中一個 Pod 的標準輸出：

```shell
kubectl logs $pods
```

<!--
Another way to view the logs of a Job:
-->
另外一種查看 Job 日誌的方法：

```shell
kubectl logs jobs/pi
```

<!--
The output is similar to this:
-->
輸出類似於：

```
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

<!--
## Writing a Job spec

As with all other Kubernetes config, a Job needs `apiVersion`, `kind`, and `metadata` fields.

When the control plane creates new Pods for a Job, the `.metadata.name` of the
Job is part of the basis for naming those Pods. The name of a Job must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostnames. For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
Even when the name is a DNS subdomain, the name must be no longer than 63
characters.

A Job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 編寫 Job 規約    {#writing-a-job-spec}

與 Kubernetes 中其他資源的配置類似，Job 也需要 `apiVersion`、`kind` 和 `metadata` 字段。

當控制面爲 Job 創建新的 Pod 時，Job 的 `.metadata.name` 是命名這些 Pod 的基礎組成部分。
Job 的名字必須是合法的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)值，
但這可能對 Pod 主機名產生意料之外的結果。爲了獲得最佳兼容性，此名字應遵循更嚴格的
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)規則。
即使該名字被要求遵循 DNS 子域名規則，也不得超過 63 個字符。

Job 配置還需要一個 [`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Job Labels
-->
### Job 標籤

<!--
Job labels will have `batch.kubernetes.io/` prefix for `job-name` and `controller-uid`.
-->
Job 標籤將爲 `job-name` 和 `controller-uid` 加上 `batch.kubernetes.io/` 前綴。

<!--
### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/#pod-templates).
It has exactly the same schema as a {{< glossary_tooltip text="Pod" term_id="pod" >}},
except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a pod template in a Job must specify appropriate
labels (see [pod selector](#pod-selector)) and an appropriate restart policy.

Only a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
equal to `Never` or `OnFailure` is allowed.
-->
### Pod 模板    {#pod-template}

Job 的 `.spec` 中只有 `.spec.template` 是必需的字段。

字段 `.spec.template` 的值是一個 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
其定義規範與 {{< glossary_tooltip text="Pod" term_id="pod" >}}
完全相同，只是其中不再需要 `apiVersion` 或 `kind` 字段。

除了作爲 Pod 所必需的字段之外，Job 中的 Pod 模板必須設置合適的標籤
（參見 [Pod 選擇算符](#pod-selector)）和合適的重啓策略。

Job 中 Pod 的 [`RestartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
只能設置爲 `Never` 或 `OnFailure` 之一。

<!--
### Pod selector

The `.spec.selector` field is optional. In almost all cases you should not specify it.
See section [specifying your own pod selector](#specifying-your-own-pod-selector).
-->
### Pod 選擇算符   {#pod-selector}

字段 `.spec.selector` 是可選的。在絕大多數場合，你都不需要爲其賦值。
參閱[設置自己的 Pod 選擇算符](#specifying-your-own-pod-selector)。

<!--
### Parallel execution for Jobs {#parallel-jobs}

There are three main types of task suitable to run as a Job:
-->
### Job 的並行執行 {#parallel-jobs}

適合以 Job 形式來運行的任務主要有三種：

<!--
1. Non-parallel Jobs
   - normally, only one Pod is started, unless the Pod fails.
   - the Job is complete as soon as its Pod terminates successfully.
1. Parallel Jobs with a *fixed completion count*:
   - specify a non-zero positive value for `.spec.completions`.
   - the Job represents the overall task, and is complete when there are `.spec.completions` successful Pods.
   - when using `.spec.completionMode="Indexed"`, each Pod gets a different index in the range 0 to `.spec.completions-1`.
-->
1. 非並行 Job：
   - 通常只啓動一個 Pod，除非該 Pod 失敗。
   - 當 Pod 成功終止時，立即視 Job 爲完成狀態。
1. 具有**確定完成計數**的並行 Job：
   - `.spec.completions` 字段設置爲非 0 的正數值。
   - Job 用來代表整個任務，當成功的 Pod 個數達到 `.spec.completions` 時，Job 被視爲完成。
   - 當使用 `.spec.completionMode="Indexed"` 時，每個 Pod 都會獲得一個不同的
     索引值，介於 0 和 `.spec.completions-1` 之間。
<!--
1. Parallel Jobs with a *work queue*:
   - do not specify `.spec.completions`, default to `.spec.parallelism`.
   - the Pods must coordinate amongst themselves or an external service to determine
     what each should work on. For example, a Pod might fetch a batch of up to N items from the work queue.
   - each Pod is independently capable of determining whether or not all its peers are done,
     and thus that the entire Job is done.
   - when _any_ Pod from the Job terminates with success, no new Pods are created.
   - once at least one Pod has terminated with success and all Pods are terminated,
     then the Job is completed with success.
   - once any Pod has exited with success, no other Pod should still be doing any work
     for this task or writing any output. They should all be in the process of exiting.
-->
1. 帶**工作隊列**的並行 Job：
   - 不設置 `spec.completions`，默認值爲 `.spec.parallelism`。
   - 多個 Pod 之間必須相互協調，或者藉助外部服務確定每個 Pod 要處理哪個工作條目。
     例如，任一 Pod 都可以從工作隊列中取走最多 N 個工作條目。
   - 每個 Pod 都可以獨立確定是否其它 Pod 都已完成，進而確定 Job 是否完成。
   - 當 Job 中**任何** Pod 成功終止，不再創建新 Pod。
   - 一旦至少 1 個 Pod 成功完成，並且所有 Pod 都已終止，即可宣告 Job 成功完成。
   - 一旦任何 Pod 成功退出，任何其它 Pod 都不應再對此任務執行任何操作或生成任何輸出。
     所有 Pod 都應啓動退出過程。

<!--
For a _non-parallel_ Job, you can leave both `.spec.completions` and `.spec.parallelism` unset.
When both are unset, both are defaulted to 1.

For a _fixed completion count_ Job, you should set `.spec.completions` to the number of completions needed.
You can set `.spec.parallelism`, or leave it unset and it will default to 1.

For a _work queue_ Job, you must leave `.spec.completions` unset, and set `.spec.parallelism` to
a non-negative integer.

For more information about how to make use of the different types of job,
see the [job patterns](#job-patterns) section.
-->
對於**非並行**的 Job，你可以不設置 `spec.completions` 和 `spec.parallelism`。
這兩個屬性都不設置時，均取默認值 1。

對於**確定完成計數**類型的 Job，你應該設置 `.spec.completions` 爲所需要的完成個數。
你可以設置 `.spec.parallelism`，也可以不設置。其默認值爲 1。

對於一個**工作隊列** Job，你不可以設置 `.spec.completions`，但要將`.spec.parallelism`
設置爲一個非負整數。

關於如何利用不同類型的 Job 的更多信息，請參見 [Job 模式](#job-patterns)一節。

<!--
#### Controlling parallelism

The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.

Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety of reasons:
-->
#### 控制並行性   {#controlling-parallelism}

並行性請求（`.spec.parallelism`）可以設置爲任何非負整數。
如果未設置，則默認爲 1。
如果設置爲 0，則 Job 相當於啓動之後便被暫停，直到此值被增加。

實際並行性（在任意時刻運行狀態的 Pod 個數）可能比並行性請求略大或略小，
原因如下：

<!--
- For _fixed completion count_ Jobs, the actual number of pods running in parallel will not exceed the number of
  remaining completions. Higher values of `.spec.parallelism` are effectively ignored.
- For _work queue_ Jobs, no new Pods are started after any Pod has succeeded -- remaining Pods are allowed to complete, however.
- If the Job {{< glossary_tooltip term_id="controller" >}} has not had time to react.
- If the Job controller failed to create Pods for any reason (lack of `ResourceQuota`, lack of permission, etc.),
  then there may be fewer pods than requested.
- The Job controller may throttle new Pod creation due to excessive previous pod failures in the same Job.
- When a Pod is gracefully shut down, it takes time to stop.
-->
- 對於**確定完成計數** Job，實際上並行執行的 Pod 個數不會超出剩餘的完成數。
  如果 `.spec.parallelism` 值較高，會被忽略。
- 對於**工作隊列** Job，有任何 Job 成功結束之後，不會有新的 Pod 啓動。
  不過，剩下的 Pod 允許執行完畢。
- 如果 Job {{< glossary_tooltip text="控制器" term_id="controller" >}} 沒有來得及作出響應，或者
- 如果 Job 控制器因爲任何原因（例如，缺少 `ResourceQuota` 或者沒有權限）無法創建 Pod。
  Pod 個數可能比請求的數目小。
- Job 控制器可能會因爲之前同一 Job 中 Pod 失效次數過多而壓制新 Pod 的創建。
- 當 Pod 處於體面終止進程中，需要一定時間才能停止。

<!--
### Completion mode
-->
### 完成模式   {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Jobs with _fixed completion count_ - that is, jobs that have non null
`.spec.completions` - can have a completion mode that is specified in `.spec.completionMode`:
-->
帶有**確定完成計數**的 Job，即 `.spec.completions` 不爲 null 的 Job，
都可以在其 `.spec.completionMode` 中設置完成模式：

<!--
- `NonIndexed` (default): the Job is considered complete when there have been
  `.spec.completions` successfully completed Pods. In other words, each Pod
  completion is homologous to each other. Note that Jobs that have null
  `.spec.completions` are implicitly `NonIndexed`.
- `Indexed`: the Pods of a Job get an associated completion index from 0 to
  `.spec.completions-1`. The index is available through four mechanisms:
  - The Pod annotation `batch.kubernetes.io/job-completion-index`.
  - The Pod label `batch.kubernetes.io/job-completion-index` (for v1.28 and later). Note
    the feature gate `PodIndexLabel` must be enabled to use this label, and it is enabled
    by default.
  - As part of the Pod hostname, following the pattern `$(job-name)-$(index)`.
    When you use an Indexed Job in combination with a
    {{< glossary_tooltip term_id="Service" >}}, Pods within the Job can use
    the deterministic hostnames to address each other via DNS. For more information about
    how to configure this, see [Job with Pod-to-Pod Communication](/docs/tasks/job/job-with-pod-to-pod-communication/).
  - From the containerized task, in the environment variable `JOB_COMPLETION_INDEX`.
-->
- `NonIndexed`（默認值）：當成功完成的 Pod 個數達到 `.spec.completions` 所
  設值時認爲 Job 已經完成。換言之，每個 Job 完成事件都是獨立無關且同質的。
  要注意的是，當 `.spec.completions` 取值爲 null 時，Job 被隱式處理爲 `NonIndexed`。
- `Indexed`：Job 的 Pod 會獲得對應的完成索引，取值爲 0 到 `.spec.completions-1`。
  該索引可以通過四種方式獲取：
  - Pod 註解 `batch.kubernetes.io/job-completion-index`。
  - Pod 標籤 `batch.kubernetes.io/job-completion-index`（適用於 v1.28 及更高版本）。
    請注意，必須啓用 `PodIndexLabel` 特性門控才能使用此標籤，默認被啓用。
  - 作爲 Pod 主機名的一部分，遵循模式 `$(job-name)-$(index)`。
    當你同時使用帶索引的 Job（Indexed Job）與 {{< glossary_tooltip term_id="Service" >}}，
    Job 中的 Pod 可以通過 DNS 使用確切的主機名互相尋址。
    有關如何配置的更多信息，請參閱[帶 Pod 間通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/)。
  - 對於容器化的任務，在環境變量 `JOB_COMPLETION_INDEX` 中。

  <!--
  The Job is considered complete when there is one successfully completed Pod
  for each index. For more information about how to use this mode, see
  [Indexed Job for Parallel Processing with Static Work Assignment](/docs/tasks/job/indexed-parallel-processing-static/).
  -->
  當每個索引都對應一個成功完成的 Pod 時，Job 被認爲是已完成的。
  關於如何使用這種模式的更多信息，可參閱
  [用帶索引的 Job 執行基於靜態任務分配的並行處理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)。

{{< note >}}
<!--
Although rare, more than one Pod could be started for the same index (due to various reasons such as node failures,
kubelet restarts, or Pod evictions). In this case, only the first Pod that completes successfully will
count towards the completion count and update the status of the Job. The other Pods that are running
or completed for the same index will be deleted by the Job controller once they are detected.
-->
帶同一索引值啓動的 Pod 可能不止一個（由於節點故障、kubelet
重啓或 Pod 驅逐等各種原因），儘管這種情況很少發生。
在這種情況下，只有第一個成功完成的 Pod 纔會被記入完成計數中並更新作業的狀態。
其他爲同一索引值運行或完成的 Pod 一旦被檢測到，將被 Job 控制器刪除。
{{< /note >}}

<!--
## Handling Pod and container failures

A container in a Pod may fail for a number of reasons, such as because the process in it exited with
a non-zero exit code, or the container was killed for exceeding a memory limit, etc. If this
happens, and the `.spec.template.spec.restartPolicy = "OnFailure"`, then the Pod stays
on the node, but the container is re-run. Therefore, your program needs to handle the case when it is
restarted locally, or else specify `.spec.template.spec.restartPolicy = "Never"`.
See [pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#example-states) for more information on `restartPolicy`.
-->
## 處理 Pod 和容器失效    {#handling-pod-and-container-failures}

Pod 中的容器可能因爲多種不同原因失效，例如因爲其中的進程退出時返回值非零，
或者容器因爲超出內存約束而被殺死等等。
如果發生這類事件，並且 `.spec.template.spec.restartPolicy = "OnFailure"`，
Pod 則繼續留在當前節點，但容器會被重新運行。
因此，你的程序需要能夠處理在本地被重啓的情況，或者要設置
`.spec.template.spec.restartPolicy = "Never"`。
關於 `restartPolicy` 的更多信息，可參閱
[Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#example-states)。

<!--
An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`. When a Pod fails, then the Job controller
starts a new Pod. This means that your application needs to handle the case when it is restarted in a new
pod. In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.
-->
整個 Pod 也可能會失敗，且原因各不相同。
例如，當 Pod 啓動時，節點失效（被升級、被重啓、被刪除等）或者其中的容器失敗而
`.spec.template.spec.restartPolicy = "Never"`。
當 Pod 失敗時，Job 控制器會啓動一個新的 Pod。
這意味着，你的應用需要處理在一個新 Pod 中被重啓的情況。
尤其是應用需要處理之前運行所產生的臨時文件、鎖、不完整的輸出等問題。

<!--
By default, each pod failure is counted towards the `.spec.backoffLimit` limit,
see [pod backoff failure policy](#pod-backoff-failure-policy). However, you can
customize handling of pod failures by setting the Job's [pod failure policy](#pod-failure-policy).
-->
默認情況下，每個 Pod 失效都被計入 `.spec.backoffLimit` 限制，
請參閱 [Pod 回退失效策略](#pod-backoff-failure-policy)。
但你可以通過設置 Job 的 [Pod 失效策略](#pod-failure-policy)自定義對 Pod 失效的處理方式。

<!--
Additionally, you can choose to count the pod failures independently for each
index of an [Indexed](#completion-mode) Job by setting the `.spec.backoffLimitPerIndex` field
(for more information, see [backoff limit per index](#backoff-limit-per-index)).
-->
此外，你可以通過設置 `.spec.backoffLimitPerIndex` 字段，
選擇爲 [Indexed](#completion-mode) Job 的每個索引獨立計算 Pod 失敗次數
（細節參閱[逐索引的回退限制](#backoff-limit-per-index)）。

<!--
Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.

If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once. Therefore, your pods must also be tolerant of concurrency.
-->
注意，即使你將 `.spec.parallelism` 設置爲 1，且將 `.spec.completions` 設置爲
1，並且 `.spec.template.spec.restartPolicy` 設置爲 "Never"，同一程序仍然有可能被啓動兩次。

如果你確實將 `.spec.parallelism` 和 `.spec.completions` 都設置爲比 1 大的值，
那就有可能同時出現多個 Pod 運行的情況。
爲此，你的 Pod 也必須能夠處理併發性問題。

<!--
If you specify the `.spec.podFailurePolicy` field, the Job controller does not consider a terminating
Pod (a pod that has a `.metadata.deletionTimestamp` field set) as a failure until that Pod is
terminal (its `.status.phase` is `Failed` or `Succeeded`). However, the Job controller
creates a replacement Pod as soon as the termination becomes apparent. Once the
pod terminates, the Job controller evaluates `.backoffLimit` and `.podFailurePolicy`
for the relevant Job, taking this now-terminated Pod into consideration.

If either of these requirements is not satisfied, the Job controller counts
a terminating Pod as an immediate failure, even if that Pod later terminates
with `phase: "Succeeded"`.
-->
當你指定了 `.spec.podFailurePolicy` 字段，
Job 控制器不會將終止過程中的 Pod（已設置 `.metadata.deletionTimestamp` 字段的 Pod）視爲失效 Pod，
直到該 Pod 完全終止（其 `.status.phase` 爲 `Failed` 或 `Succeeded`）。
但只要終止變得顯而易見，Job 控制器就會創建一個替代的 Pod。一旦 Pod 終止，Job 控制器將把這個剛終止的
Pod 考慮在內，評估相關 Job 的 `.backoffLimit` 和 `.podFailurePolicy`。

如果不滿足任一要求，即使 Pod 稍後以 `phase: "Succeeded"` 終止，Job 控制器也會將此即將終止的 Pod 計爲立即失效。

<!--
### Pod backoff failure policy

There are situations where you want to fail a Job after some amount of retries
due to a logical error in configuration etc.
To do so, set `.spec.backoffLimit` to specify the number of retries before
considering a Job as failed.

The `.spec.backoffLimit` is set by default to 6, unless the
[backoff limit per index](#backoff-limit-per-index) (only Indexed Job) is specified.
When `.spec.backoffLimitPerIndex` is specified, then `.spec.backoffLimit` defaults
to 2147483647 (MaxInt32).

Failed Pods associated with the Job are recreated by the Job controller with an
exponential back-off delay (10s, 20s, 40s ...) capped at six minutes.
-->
### Pod 回退失效策略    {#pod-backoff-failure-policy}

在有些情形下，你可能希望 Job 在經歷若干次重試之後直接進入失敗狀態，
因爲這很可能意味着遇到了配置錯誤。
爲了實現這點，可以將 `.spec.backoffLimit` 設置爲視 Job 爲失敗之前的重試次數。
`.spec.backoffLimit` 的值默認爲 6，
除非指定了[每個索引的退避限制](#backoff-limit-per-index)（僅限帶索引的 Job）。
當指定 `.spec.backoffLimitPerIndex` 時，`.spec.backoffLimit`
默認爲 2147483647 (MaxInt32)。

與 Job 相關的失效的 Pod 會被 Job 控制器重建，回退重試時間將會按指數增長
（從 10 秒、20 秒到 40 秒）最多至 6 分鐘。

<!--
The number of retries is calculated in two ways:

- The number of Pods with `.status.phase = "Failed"`.
- When using `restartPolicy = "OnFailure"`, the number of retries in all the
  containers of Pods with `.status.phase` equal to `Pending` or `Running`.

If either of the calculations reaches the `.spec.backoffLimit`, the Job is
considered failed.
-->
計算重試次數有以下兩種方法：
- 計算 `.status.phase = "Failed"` 的 Pod 數量。
- 當 Pod 的 `restartPolicy = "OnFailure"` 時，針對 `.status.phase` 等於 `Pending` 或
  `Running` 的 Pod，計算其中所有容器的重試次數。

如果兩種方式其中一個的值達到 `.spec.backoffLimit`，則 Job 被判定爲失敗。

{{< note >}}
<!--
If your Job has `restartPolicy = "OnFailure"`, keep in mind that your Pod running the job
will be terminated once the job backoff limit has been reached. This can make debugging
the Job's executable more difficult. We suggest setting
`restartPolicy = "Never"` when debugging the Job or using a logging system to ensure output
from failed Jobs is not lost inadvertently.
-->
如果你的 Job 的 `restartPolicy` 被設置爲 "OnFailure"，就要注意運行該 Job 的 Pod
會在 Job 到達失效回退次數上限時自動被終止。
這會使得調試 Job 中可執行文件的工作變得非常棘手。
我們建議在調試 Job 時將 `restartPolicy` 設置爲 "Never"，
或者使用日誌系統來確保失效 Job 的輸出不會意外遺失。
{{< /note >}}

<!--
### Backoff limit per index {#backoff-limit-per-index}
-->
### 逐索引的回退限制    {#backoff-limit-per-index}

{{< feature-state feature_gate_name="JobBackoffLimitPerIndex" >}}

<!--
When you run an [indexed](#completion-mode) Job, you can choose to handle retries
for pod failures independently for each index. To do so, set the
`.spec.backoffLimitPerIndex` to specify the maximal number of pod failures
per index.
-->
運行 [Indexed](#completion-mode) Job 時，你可以選擇對每個索引獨立處理 Pod 失敗的重試。
爲此，可以設置 `.spec.backoffLimitPerIndex` 來指定每個索引的最大 Pod 失敗次數。

<!--
When the per-index backoff limit is exceeded for an index, Kubernetes considers the index as failed and adds it to the
`.status.failedIndexes` field. The succeeded indexes, those with a successfully
executed pods, are recorded in the `.status.completedIndexes` field, regardless of whether you set
the `backoffLimitPerIndex` field.
-->
當某個索引超過逐索引的回退限制後，Kubernetes 將視該索引爲已失敗，並將其添加到 `.status.failedIndexes` 字段中。
無論你是否設置了 `backoffLimitPerIndex` 字段，已成功執行的索引（具有成功執行的 Pod）將被記錄在
`.status.completedIndexes` 字段中。

<!--
Note that a failing index does not interrupt execution of other indexes.
Once all indexes finish for a Job where you specified a backoff limit per index,
if at least one of those indexes did fail, the Job controller marks the overall
Job as failed, by setting the Failed condition in the status. The Job gets
marked as failed even if some, potentially nearly all, of the indexes were
processed successfully.
-->
請注意，失敗的索引不會中斷其他索引的執行。一旦在指定了逐索引回退限制的 Job 中的所有索引完成，
如果其中至少有一個索引失敗，Job 控制器會通過在狀態中設置 Failed 狀況將整個 Job 標記爲失敗。
即使其中一些（可能幾乎全部）索引已被成功處理，該 Job 也會被標記爲失敗。

<!--
You can additionally limit the maximal number of indexes marked failed by
setting the `.spec.maxFailedIndexes` field.
When the number of failed indexes exceeds the `maxFailedIndexes` field, the
Job controller triggers termination of all remaining running Pods for that Job.
Once all pods are terminated, the entire Job is marked failed by the Job
controller, by setting the Failed condition in the Job status.
-->
你還可以通過設置 `.spec.maxFailedIndexes` 字段來限制標記爲失敗的最大索引數。
當失敗的索引數量超過 `maxFailedIndexes` 字段時，Job 控制器會對該 Job
的運行中的所有餘下 Pod 觸發終止操作。一旦所有 Pod 被終止，Job 控制器將通過設置 Job
狀態中的 Failed 狀況將整個 Job 標記爲失敗。

<!--
Here is an example manifest for a Job that defines a `backoffLimitPerIndex`:
-->
以下是定義 `backoffLimitPerIndex` 的 Job 示例清單：

{{% code_sample file="/controllers/job-backoff-limit-per-index-example.yaml" %}}

<!--
In the example above, the Job controller allows for one restart for each
of the indexes. When the total number of failed indexes exceeds 5, then
the entire Job is terminated.

Once the job is finished, the Job status looks as follows:
-->
在上面的示例中，Job 控制器允許每個索引重新啓動一次。
當失敗的索引總數超過 5 個時，整個 Job 將被終止。

Job 完成後，該 Job 的狀態如下所示：

```sh
kubectl get -o yaml job job-backoff-limit-per-index-example
```

<!--
```yaml
  status:
    completedIndexes: 1,3,5,7,9
    failedIndexes: 0,2,4,6,8
    succeeded: 5          # 1 succeeded pod for each of 5 succeeded indexes
    failed: 10            # 2 failed pods (1 retry) for each of 5 failed indexes
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: FailureTarget
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```
-->
```yaml
  status:
    completedIndexes: 1,3,5,7,9
    failedIndexes: 0,2,4,6,8
    succeeded: 5          # 每 5 個成功的索引有 1 個成功的 Pod
    failed: 10            # 每 5 個失敗的索引有 2 個失敗的 Pod（1 次重試）
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: FailureTarget
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```

<!--
The Job controller adds the `FailureTarget` Job condition to trigger
[Job termination and cleanup](#job-termination-and-cleanup). When all of the
Job Pods are terminated, the Job controller adds the `Failed` condition
with the same values for `reason` and `message` as the `FailureTarget` Job
condition. For details, see [Termination of Job Pods](#termination-of-job-pods).
-->
Job 控制器添加 `FailureTarget` Job 狀況來觸發 [Job 終止和清理](#job-termination-and-cleanup)。
當所有 Job Pod 都終止時，Job 控制器會添加 `Failed` 狀況，
其 `reason` 和 `message` 的值與 `FailureTarget` Job 狀況相同。
有關詳細信息，請參閱 [Job Pod 的終止](#termination-of-job-pods)。

<!--
Additionally, you may want to use the per-index backoff along with a
[pod failure policy](#pod-failure-policy). When using
per-index backoff, there is a new `FailIndex` action available which allows you to
avoid unnecessary retries within an index.
-->
此外，你可能想要結合使用逐索引回退與 [Pod 失效策略](#pod-failure-policy)。
在使用逐索引回退時，有一個新的 `FailIndex` 操作可用，它讓你避免就某個索引進行不必要的重試。

<!-- 
### Pod failure policy {#pod-failure-policy}
-->
### Pod 失效策略 {#pod-failure-policy}

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

<!--
A Pod failure policy, defined with the `.spec.podFailurePolicy` field, enables
your cluster to handle Pod failures based on the container exit codes and the
Pod conditions.
-->
Pod 失效策略使用 `.spec.podFailurePolicy` 字段來定義，
它能讓你的集羣根據容器的退出碼和 Pod 狀況來處理 Pod 失效事件。

<!--
In some situations, you  may want to have a better control when handling Pod
failures than the control provided by the [Pod backoff failure policy](#pod-backoff-failure-policy),
which is based on the Job's `.spec.backoffLimit`. These are some examples of use cases:
-->
在某些情況下，你可能希望更好地控制 Pod 失效的處理方式，
而不是僅限於 [Pod 回退失效策略](#pod-backoff-failure-policy)所提供的控制能力，
後者是基於 Job 的 `.spec.backoffLimit` 實現的。以下是一些使用場景：

<!--
* To optimize costs of running workloads by avoiding unnecessary Pod restarts,
  you can terminate a Job as soon as one of its Pods fails with an exit code
  indicating a software bug.
* To guarantee that your Job finishes even if there are disruptions, you can
  ignore Pod failures caused by disruptions (such as {{< glossary_tooltip text="preemption" term_id="preemption" >}},
  {{< glossary_tooltip text="API-initiated eviction" term_id="api-eviction" >}}
  or {{< glossary_tooltip text="taint" term_id="taint" >}}-based eviction) so
  that they don't count towards the `.spec.backoffLimit` limit of retries.
-->
* 通過避免不必要的 Pod 重啓來優化工作負載的運行成本，
  你可以在某 Job 中一個 Pod 失效且其退出碼錶明存在軟件錯誤時立即終止該 Job。
* 爲了保證即使有干擾也能完成 Job，你可以忽略由干擾導致的 Pod 失效
  （例如{{< glossary_tooltip text="搶佔" term_id="preemption" >}}、
  {{< glossary_tooltip text="通過 API 發起的驅逐" term_id="api-eviction" >}}
  或基於{{< glossary_tooltip text="污點" term_id="taint" >}}的驅逐），
  這樣這些失效就不會被計入 `.spec.backoffLimit` 的重試限制中。

<!--
You can configure a Pod failure policy, in the `.spec.podFailurePolicy` field,
to meet the above use cases. This policy can handle Pod failures based on the
container exit codes and the Pod conditions.
-->
你可以在 `.spec.podFailurePolicy` 字段中配置 Pod 失效策略，以滿足上述使用場景。
該策略可以根據容器退出碼和 Pod 狀況來處理 Pod 失效。

<!--
Here is a manifest for a Job that defines a `podFailurePolicy`:
-->
下面是一個定義了 `podFailurePolicy` 的 Job 的清單：

{{% code_sample file="/controllers/job-pod-failure-policy-example.yaml" %}}

<!--
In the example above, the first rule of the Pod failure policy specifies that
the Job should be marked failed if the `main` container fails with the 42 exit
code. The following are the rules for the `main` container specifically:
-->
在上面的示例中，Pod 失效策略的第一條規則規定如果 `main` 容器失敗並且退出碼爲 42，
Job 將被標記爲失敗。以下是 `main` 容器的具體規則：

<!--
- an exit code of 0 means that the container succeeded
- an exit code of 42 means that the **entire Job** failed
- any other exit code represents that the container failed, and hence the entire
  Pod. The Pod will be re-created if the total number of restarts is
  below `backoffLimit`. If the `backoffLimit` is reached the **entire Job** failed.
-->
- 退出碼 0 代表容器成功
- 退出碼 42 代表**整個 Job** 失敗
- 所有其他退出碼都代表容器失敗，同時也代表着整個 Pod 失效。
  如果重啓總次數低於 `backoffLimit` 定義的次數，則會重新啓動 Pod，
  如果等於 `backoffLimit` 所設置的次數，則代表**整個 Job** 失效。

{{< note >}}
<!--
Because the Pod template specifies a `restartPolicy: Never`,
the kubelet does not restart the `main` container in that particular Pod.
-->
因爲 Pod 模板中指定了 `restartPolicy: Never`，
所以 kubelet 將不會重啓 Pod 中的 `main` 容器。
{{< /note >}}

<!--
The second rule of the Pod failure policy, specifying the `Ignore` action for
failed Pods with condition `DisruptionTarget` excludes Pod disruptions from
being counted towards the `.spec.backoffLimit` limit of retries.
-->
Pod 失效策略的第二條規則，
指定對於狀況爲 `DisruptionTarget` 的失效 Pod 採取 `Ignore` 操作，
統計 `.spec.backoffLimit` 重試次數限制時不考慮 Pod 因干擾而發生的異常。

{{< note >}}
<!--
If the Job failed, either by the Pod failure policy or Pod backoff
failure policy, and the Job is running multiple Pods, Kubernetes terminates all
the Pods in that Job that are still Pending or Running.
-->
如果根據 Pod 失效策略或 Pod 回退失效策略判定 Pod 已經失效，
並且 Job 正在運行多個 Pod，Kubernetes 將終止該 Job 中仍處於 Pending 或
Running 的所有 Pod。
{{< /note >}}

<!--
These are some requirements and semantics of the API:

- if you want to use a `.spec.podFailurePolicy` field for a Job, you must
  also define that Job's pod template with `.spec.restartPolicy` set to `Never`.
- the Pod failure policy rules you specify under `spec.podFailurePolicy.rules`
  are evaluated in order. Once a rule matches a Pod failure, the remaining rules
  are ignored. When no rule matches the Pod failure, the default
  handling applies.
- you may want to restrict a rule to a specific container by specifying its name
  in`spec.podFailurePolicy.rules[*].onExitCodes.containerName`. When not specified the rule
  applies to all containers. When specified, it should match one the container
  or `initContainer` names in the Pod template.
-->
下面是此 API 的一些要求和語義：
- 如果你想在 Job 中使用 `.spec.podFailurePolicy` 字段，
  你必須將 Job 的 Pod 模板中的 `.spec.restartPolicy` 設置爲 `Never`。
- 在 `spec.podFailurePolicy.rules` 中設定的 Pod 失效策略規則將按序評估。
  一旦某個規則與 Pod 失效策略匹配，其餘規則將被忽略。
  當沒有規則匹配 Pod 失效策略時，將會採用默認的處理方式。
- 你可能希望在 `spec.podFailurePolicy.rules[*].onExitCodes.containerName`
  中通過指定的名稱限制只能針對特定容器應用對應的規則。
  如果不設置此屬性，規則將適用於所有容器。
  如果指定了容器名稱，它應該匹配 Pod 模板中的一個普通容器或一個初始容器（Init Container）。
<!--
- you may specify the action taken when a Pod failure policy is matched by
  `spec.podFailurePolicy.rules[*].action`. Possible values are:
  - `FailJob`: use to indicate that the Pod's job should be marked as Failed and
     all running Pods should be terminated.
  - `Ignore`: use to indicate that the counter towards the `.spec.backoffLimit`
     should not be incremented and a replacement Pod should be created.
  - `Count`: use to indicate that the Pod should be handled in the default way.
     The counter towards the `.spec.backoffLimit` should be incremented.
  - `FailIndex`: use this action along with [backoff limit per index](#backoff-limit-per-index)
     to avoid unnecessary retries within the index of a failed pod.
-->
- 你可以在 `spec.podFailurePolicy.rules[*].action` 指定當 Pod 失效策略發生匹配時要採取的操作。
  可能的值爲：
  - `FailJob`：表示 Pod 的任務應標記爲 Failed，並且所有正在運行的 Pod 應被終止。
  - `Ignore`：表示 `.spec.backoffLimit` 的計數器不應該增加，應該創建一個替換的 Pod。
  - `Count`：表示 Pod 應該以默認方式處理。`.spec.backoffLimit` 的計數器應該增加。
  - `FailIndex`：表示使用此操作以及[逐索引回退限制](#backoff-limit-per-index)來避免就失敗的 Pod
    的索引進行不必要的重試。

{{< note >}}
<!--
When you use a `podFailurePolicy`, the job controller only matches Pods in the
`Failed` phase. Pods with a deletion timestamp that are not in a terminal phase
(`Failed` or `Succeeded`) are considered still terminating. This implies that
terminating pods retain a [tracking finalizer](#job-tracking-with-finalizers)
until they reach a terminal phase.
Since Kubernetes 1.27, Kubelet transitions deleted pods to a terminal phase
(see: [Pod Phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)). This
ensures that deleted pods have their finalizers removed by the Job controller.
-->
當你使用 `podFailurePolicy` 時，Job 控制器只匹配處於 `Failed` 階段的 Pod。
具有刪除時間戳但不處於終止階段（`Failed` 或 `Succeeded`）的 Pod 被視爲仍在終止中。
這意味着終止中的 Pod 會保留一個[跟蹤 Finalizer](#job-tracking-with-finalizers)，
直到到達終止階段。
從 Kubernetes 1.27 開始，kubelet 將刪除的 Pod 轉換到終止階段
（參閱 [Pod 階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）。
這確保已刪除的 Pod 的 Finalizer 被 Job 控制器移除。
{{< /note >}}

{{< note >}}
<!--
Starting with Kubernetes v1.28, when Pod failure policy is used, the Job controller recreates
terminating Pods only once these Pods reach the terminal `Failed` phase. This behavior is similar
to `podReplacementPolicy: Failed`. For more information, see [Pod replacement policy](#pod-replacement-policy).
-->
自 Kubernetes v1.28 開始，當使用 Pod 失效策略時，Job 控制器僅在這些 Pod 達到終止的
`Failed` 階段時纔會重新創建終止中的 Pod。這種行爲類似於 `podReplacementPolicy: Failed`。
細節參閱 [Pod 替換策略](#pod-replacement-policy)。
{{< /note >}}

<!--
When you use the `podFailurePolicy`, and the Job fails due to the pod
matching the rule with the `FailJob` action, then the Job controller triggers
the Job termination process by adding the `FailureTarget` condition.
For more details, see [Job termination and cleanup](#job-termination-and-cleanup).
-->
當你使用了 `podFailurePolicy`，並且 Pod 因爲與 `FailJob`
操作的規則匹配而失敗時，Job 控制器會通過添加
`FailureTarget` 狀況來觸發 Job 終止流程。
更多詳情，請參閱 [Job 的終止和清理](#job-termination-and-cleanup)。

<!--
## Success policy {#success-policy}
-->
## 成功策略   {#success-policy}

<!--
When creating an Indexed Job, you can define when a Job can be declared as succeeded using a `.spec.successPolicy`,
based on the pods that succeeded.

By default, a Job succeeds when the number of succeeded Pods equals `.spec.completions`.
These are some situations where you might want additional control for declaring a Job succeeded:
-->
你在創建帶索引的 Job 時，可以基於成功的 Pod 個數使用 `.spec.successPolicy` 來定義 Job 何時可以被聲明爲成功。

默認情況下，當成功的 Pod 數等於 `.spec.completions` 時，則 Job 成功。
在以下一些情況下，你可能需要對何時聲明 Job 成功作額外的控制：

<!--
* When running simulations with different parameters, 
  you might not need all the simulations to succeed for the overall Job to be successful.
* When following a leader-worker pattern, only the success of the leader determines the success or
  failure of a Job. Examples of this are frameworks like MPI and PyTorch etc.
-->
* 在使用不同的參數運行模擬任務時，你可能不需要所有模擬都成功就可以認爲整個 Job 是成功的。
* 在遵循領導者與工作者模式時，只有領導者的成功才能決定 Job 成功或失敗。
  這類框架的例子包括 MPI 和 PyTorch 等。

<!--
You can configure a success policy, in the `.spec.successPolicy` field,
to meet the above use cases. This policy can handle Job success based on the
succeeded pods. After the Job meets the success policy, the job controller terminates the lingering Pods.
A success policy is defined by rules. Each rule can take one of the following forms:
-->
你可以在 `.spec.successPolicy` 字段中配置成功策略，以滿足上述使用場景。
此策略可以基於 Pod 的成功狀況處理 Job 的成功狀態。當 Job 滿足成功策略後，Job 控制器會終止剩餘的 Pod。
成功策略由規則進行定義。每條規則可以採用以下形式中的一種：

<!--
* When you specify the `succeededIndexes` only,
  once all indexes specified in the `succeededIndexes` succeed, the job controller marks the Job as succeeded.
  The `succeededIndexes` must be a list of intervals between 0 and `.spec.completions-1`.
* When you specify the `succeededCount` only,
  once the number of succeeded indexes reaches the `succeededCount`, the job controller marks the Job as succeeded.
* When you specify both `succeededIndexes` and `succeededCount`,
  once the number of succeeded indexes from the subset of indexes specified in the `succeededIndexes` reaches the `succeededCount`,
  the job controller marks the Job as succeeded.
-->
* 當你僅指定 `succeededIndexes` 時，一旦 `succeededIndexes` 中指定的所有索引成功，Job 控制器就會將 Job 標記爲成功。
  `succeededIndexes` 必須是一個介於 0 和 `.spec.completions-1` 之間的間隔列表。
* 當你僅指定 `succeededCount` 時，一旦成功的索引數量達到 `succeededCount`，Job 控制器就會將 Job 標記爲成功。
* 當你同時指定 `succeededIndexes` 和 `succeededCount` 時，一旦 `succeededIndexes`
  中指定的索引子集中的成功索引數達到 `succeededCount`，Job 控制器就會將 Job 標記爲成功。

<!--
Note that when you specify multiple rules in the `.spec.successPolicy.rules`,
the job controller evaluates the rules in order. Once the Job meets a rule, the job controller ignores remaining rules.

Here is a manifest for a Job with `successPolicy`:
-->
請注意，當你在 `.spec.successPolicy.rules` 中指定多個規則時，Job 控制器會按順序評估這些規則。
一旦 Job 符合某個規則，Job 控制器將忽略剩餘的規則。

以下是一個帶有 `successPolicy` 的 Job 的清單：

{{% code_sample file="/controllers/job-success-policy.yaml" %}}

<!--
In the example above, both `succeededIndexes` and `succeededCount` have been specified.
Therefore, the job controller will mark the Job as succeeded and terminate the lingering Pods 
when either of the specified indexes, 0, 2, or 3, succeed.
The Job that meets the success policy gets the `SuccessCriteriaMet` condition with a `SuccessPolicy` reason.
After the removal of the lingering Pods is issued, the Job gets the `Complete` condition.

Note that the `succeededIndexes` is represented as intervals separated by a hyphen.
The number are listed in represented by the first and last element of the series, separated by a hyphen.
-->
在上面的例子中，`succeededIndexes` 和 `succeededCount` 都已被指定。
因此，當指定的索引 0、2 或 3 中的任意一個成功時，Job 控制器將 Job 標記爲成功並終止剩餘的 Pod。
符合成功策略的 Job 會被標記 `SuccessCriteriaMet` 狀況，且狀況的原因爲 `SuccessPolicy`。
在剩餘的 Pod 被移除後，Job 會被標記 `Complete` 狀況。

請注意，`succeededIndexes` 表示爲以連字符分隔的數字序列。
所表達的數值爲一個序列，連字符所連接的爲列表中第一個元素和最後一個元素。

{{< note >}}
<!--
When you specify both a success policy and some terminating policies such as `.spec.backoffLimit` and `.spec.podFailurePolicy`,
once the Job meets either policy, the job controller respects the terminating policy and ignores the success policy.
-->
當你同時設置了成功策略和 `.spec.backoffLimit` 和 `.spec.podFailurePolicy` 這類終止策略時，
一旦 Job 符合任一策略，Job 控制器將按終止策略處理，忽略成功策略。
{{< /note >}}

<!--
## Job termination and cleanup

When a Job completes, no more Pods are created, but the Pods are [usually](#pod-backoff-failure-policy) not deleted either.
Keeping them around allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status. It is up to the user to delete
old jobs after noting their status. Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`).
When you delete the job using `kubectl`, all the pods it created are deleted too.
-->
## Job 終止與清理    {#job-termination-and-cleanup}

Job 完成時不會再創建新的 Pod，不過已有的 Pod [通常](#pod-backoff-failure-policy)也不會被刪除。
保留這些 Pod 使得你可以查看已完成的 Pod 的日誌輸出，以便檢查錯誤、警告或者其它診斷性輸出。
Job 完成時 Job 對象也一樣被保留下來，這樣你就可以查看它的狀態。
在查看了 Job 狀態之後刪除老的 Job 的操作留給了用戶自己。
你可以使用 `kubectl` 來刪除 Job（例如，`kubectl delete jobs/pi`
或者 `kubectl delete -f ./job.yaml`）。
當使用 `kubectl` 來刪除 Job 時，該 Job 所創建的 Pod 也會被刪除。

<!--
By default, a Job will run uninterrupted unless a Pod fails (`restartPolicy=Never`)
or a Container exits in error (`restartPolicy=OnFailure`), at which point the Job defers to the
`.spec.backoffLimit` described above. Once `.spec.backoffLimit` has been reached the Job will
be marked as failed and any running Pods will be terminated.

Another way to terminate a Job is by setting an active deadline.
Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds.
The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status
will become `type: Failed` with `reason: DeadlineExceeded`.
-->
默認情況下，Job 會持續運行，除非某個 Pod 失敗（`restartPolicy=Never`）
或者某個容器出錯退出（`restartPolicy=OnFailure`）。
這時，Job 基於前述的 `spec.backoffLimit` 來決定是否以及如何重試。
一旦重試次數到達 `.spec.backoffLimit` 所設的上限，Job 會被標記爲失敗，
其中運行的 Pod 都會被終止。

終止 Job 的另一種方式是設置一個活躍期限。
你可以爲 Job 的 `.spec.activeDeadlineSeconds` 設置一個秒數值。
該值適用於 Job 的整個生命期，無論 Job 創建了多少個 Pod。
一旦 Job 運行時間達到 `activeDeadlineSeconds` 秒，其所有運行中的 Pod 都會被終止，
並且 Job 的狀態更新爲 `type: Failed` 及 `reason: DeadlineExceeded`。

<!--
Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`.
Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once
it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.

Example:
-->
注意 Job 的 `.spec.activeDeadlineSeconds` 優先級高於其 `.spec.backoffLimit` 設置。
因此，如果一個 Job 正在重試一個或多個失效的 Pod，該 Job 一旦到達
`activeDeadlineSeconds` 所設的時限即不再部署額外的 Pod，
即使其重試次數還未達到 `backoffLimit` 所設的限制。

例如：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

<!--
Note that both the Job spec and the [Pod template spec](/docs/concepts/workloads/pods/init-containers/#detailed-behavior)
within the Job have an `activeDeadlineSeconds` field. Ensure that you set this field at the proper level.

Keep in mind that the `restartPolicy` applies to the Pod, and not to the Job itself:
there is no automatic Job restart once the Job status is `type: Failed`.
That is, the Job termination mechanisms activated with `.spec.activeDeadlineSeconds`
and `.spec.backoffLimit` result in a permanent Job failure that requires manual intervention to resolve.
-->
注意 Job 規約和 Job 中的
[Pod 模板規約](/zh-cn/docs/concepts/workloads/pods/init-containers/#detailed-behavior)
都有 `activeDeadlineSeconds` 字段。
請確保你在合適的層次設置正確的字段。

還要注意的是，`restartPolicy` 對應的是 Pod，而不是 Job 本身：
一旦 Job 狀態變爲 `type: Failed`，就不會再發生 Job 重啓的動作。
換言之，由 `.spec.activeDeadlineSeconds` 和 `.spec.backoffLimit` 所觸發的 Job
終結機制都會導致 Job 永久性的失敗，而這類狀態都需要手工干預才能解決。

<!--
### Terminal Job conditions

A Job has two possible terminal states, each of which has a corresponding Job
condition:
* Succeeded:  Job condition `Complete`
* Failed: Job condition `Failed`
-->
### Job 終止狀況   {#terminal-job-conditions}

一個 Job 有兩種可能的終止狀況，每種狀況都有相應的 Job 狀況：

* Succeeded：Job `Complete` 狀況
* Failed：Job `Failed` 狀況

<!--
Jobs fail for the following reasons:
- The number of Pod failures exceeded the specified `.spec.backoffLimit` in the Job
  specification. For details, see [Pod backoff failure policy](#pod-backoff-failure-policy).
- The Job runtime exceeded the specified `.spec.activeDeadlineSeconds`
- An indexed Job that used `.spec.backoffLimitPerIndex` has failed indexes.
  For details, see [Backoff limit per index](#backoff-limit-per-index).
- The number of failed indexes in the Job exceeded the specified
  `spec.maxFailedIndexes`. For details, see [Backoff limit per index](#backoff-limit-per-index)
- A failed Pod matches a rule in `.spec.podFailurePolicy` that has the `FailJob`
   action. For details about how Pod failure policy rules might affect failure
   evaluation, see [Pod failure policy](#pod-failure-policy).
-->
Job 失敗的原因如下：

- Pod 失敗數量超出了 Job 規約中指定的 `.spec.backoffLimit`，
  詳情請參見 [Pod 回退失效策略](#pod-backoff-failure-policy)。
- Job 運行時間超過了指定的 `.spec.activeDeadlineSeconds`。
- 使用 `.spec.backoffLimitPerIndex` 的索引 Job 出現索引失敗。
  有關詳細信息，請參閱[逐索引的回退限制](#backoff-limit-per-index)。
- Job 中失敗的索引數量超出了指定的 `spec.maxFailedIndexes` 值，
  詳情見[逐索引的回退限制](#backoff-limit-per-index)。
- 失敗的 Pod 匹配了 `.spec.podFailurePolicy` 中定義的一條規則，該規則的動作爲 FailJob。
  有關 Pod 失效策略規則如何影響故障評估的詳細信息，請參閱 [Pod 失效策略](#pod-failure-policy)。

<!--
Jobs succeed for the following reasons:
- The number of succeeded Pods reached the specified `.spec.completions`
- The criteria specified in `.spec.successPolicy` are met. For details, see
  [Success policy](#success-policy).
-->
Pod 成功的原因如下：

- 成功的 Pod 的數量達到了指定的 `.spec.completions` 數量。
- `.spec.successPolicy` 中指定的標準已滿足。詳情請參見[成功策略](#success-policy)。

<!--
In Kubernetes v1.31 and later the Job controller delays the addition of the
terminal conditions,`Failed` or `Complete`, until all of the Job Pods are terminated.

In Kubernetes v1.30 and earlier, the Job controller added the `Complete` or the
`Failed` Job terminal conditions as soon as the Job termination process was
triggered and all Pod finalizers were removed. However, some Pods would still
be running or terminating at the moment that the terminal condition was added.
-->
在 Kubernetes v1.31 及更高版本中，Job 控制器會延遲添加終止狀況 `Failed` 或
`Complete`，直到所有 Job Pod 都終止。

在 Kubernetes v1.30 及更早版本中，一旦觸發 Job 終止過程並刪除所有
Pod 終結器，Job 控制器就會給 Job 添加 `Complete` 或 `Failed` 終止狀況。
然而，在添加終止狀況時，一些 Pod 仍會運行或處於終止過程中。

<!--
In Kubernetes v1.31 and later, the controller only adds the Job terminal conditions
_after_ all of the Pods are terminated. You can control this behavior by using the
`JobManagedBy` and the `JobPodReplacementPolicy` (both enabled by default)
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
在 Kubernetes v1.31 及更高版本中，控制器僅在所有 Pod 都終止**之後**纔會添加作業（Job）的終止條件。
你可以通過使用 `JobManagedBy` 和 `JobPodReplacementPolicy`（都默認啓用）
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
來控制這一行爲。

<!--
### Termination of Job pods

The Job controller adds the `FailureTarget` condition or the `SuccessCriteriaMet`
condition to the Job to trigger Pod termination after a Job meets either the
success or failure criteria.
-->
### Job Pod 的終止

Job 控制器將 `FailureTarget` 狀況或 `SuccessCriteriaMet` 狀況添加到
Job，以便在 Job 滿足成功或失敗標準後觸發 Pod 終止。

<!--
Factors like `terminationGracePeriodSeconds` might increase the amount of time
from the moment that the Job controller adds the `FailureTarget` condition or the
`SuccessCriteriaMet` condition to the moment that all of the Job Pods terminate
and the Job controller adds a [terminal condition](#terminal-job-conditions)
(`Failed` or `Complete`).

You can use the `FailureTarget` or the `SuccessCriteriaMet` condition to evaluate
whether the Job has failed or succeeded without having to wait for the controller
to add a terminal condition.
-->
諸如 `terminationGracePeriodSeconds` 之類的因素可能會增加從
Job 控制器添加 `FailureTarget` 狀況或 `SuccessCriteriaMet` 狀況到所有
Job Pod 終止並且 Job 控制器添加[終止狀況](#terminal-job-conditions)（`Failed` 或 `Complete`）的這段時間量。

你可以使用 `FailureTarget` 或 `SuccessCriteriaMet`
狀況來評估 Job 是否失敗或成功，而無需等待控制器添加終止狀況。

<!--
For example, you might want to decide when to create a replacement Job
that replaces a failed Job. If you replace the failed Job when the `FailureTarget`
condition appears, your replacement Job runs sooner, but could result in Pods
from the failed and the replacement Job running at the same time, using
extra compute resources.

Alternatively, if your cluster has limited resource capacity, you could choose to
wait until the `Failed` condition appears on the Job, which would delay your
replacement Job but would ensure that you conserve resources by waiting
until all of the failed Pods are removed.
-->
例如，你可能想要決定何時創建 Job 來替代某個已失敗 Job。
如果在出現 `FailureTarget` 狀況時替換失敗的 Job，則替換 Job 啓動得會更早，
但可能會導致失敗的 Job 和替換 Job 的 Pod 同時處於運行狀態，進而額外耗用計算資源。

或者，如果你的集羣資源容量有限，你可以選擇等到 Job 上出現 `Failed` 狀況後再執行替換操作。
這樣做會延遲替換 Job 的啓動，不過通過等待所有失敗的 Pod 都被刪除，可以節省資源。

<!--
## Clean up finished jobs automatically

Finished Jobs are usually no longer needed in the system. Keeping them around in
the system will put pressure on the API server. If the Jobs are managed directly
by a higher level controller, such as
[CronJobs](/docs/concepts/workloads/controllers/cron-jobs/), the Jobs can be
cleaned up by CronJobs based on the specified capacity-based cleanup policy.

### TTL mechanism for finished Jobs
-->
## 自動清理完成的 Job   {#clean-up-finished-jobs-automatically}

完成的 Job 通常不需要留存在系統中。在系統中一直保留它們會給 API 服務器帶來額外的壓力。
如果 Job 由某種更高級別的控制器來管理，例如
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，
則 Job 可以被 CronJob 基於特定的根據容量裁定的清理策略清理掉。

### 已完成 Job 的 TTL 機制  {#ttl-mechanisms-for-finished-jobs}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
Another way to clean up finished Jobs (either `Complete` or `Failed`)
automatically is to use a TTL mechanism provided by a
[TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) for
finished resources, by specifying the `.spec.ttlSecondsAfterFinished` field of
the Job.

When the TTL controller cleans up the Job, it will delete the Job cascadingly,
i.e. delete its dependent objects, such as Pods, together with the Job. Note
that when the Job is deleted, its lifecycle guarantees, such as finalizers, will
be honored.

For example:
-->
自動清理已完成 Job （狀態爲 `Complete` 或 `Failed`）的另一種方式是使用由
[TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)所提供的 TTL 機制。
通過設置 Job 的 `.spec.ttlSecondsAfterFinished` 字段，可以讓該控制器清理掉已結束的資源。

TTL 控制器清理 Job 時，會級聯式地刪除 Job 對象。
換言之，它會刪除所有依賴的對象，包括 Pod 及 Job 本身。
注意，當 Job 被刪除時，系統會考慮其生命週期保障，例如其 Finalizers。

例如：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-ttl
spec:
  ttlSecondsAfterFinished: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

<!--
The Job `pi-with-ttl` will be eligible to be automatically deleted, `100`
seconds after it finishes.

If the field is set to `0`, the Job will be eligible to be automatically deleted
immediately after it finishes. If the field is unset, this Job won't be cleaned
up by the TTL controller after it finishes.
-->
Job `pi-with-ttl` 在結束 100 秒之後，可以成爲被自動刪除的對象。

如果該字段設置爲 `0`，Job 在結束之後立即成爲可被自動刪除的對象。
如果該字段沒有設置，Job 不會在結束之後被 TTL 控制器自動清除。

{{< note >}}
<!--
It is recommended to set `ttlSecondsAfterFinished` field because unmanaged jobs
(Jobs that you created directly, and not indirectly through other workload APIs
such as CronJob) have a default deletion
policy of `orphanDependents` causing Pods created by an unmanaged Job to be left around
after that Job is fully deleted.
Even though the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} eventually
[garbage collects](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
the Pods from a deleted Job after they either fail or complete, sometimes those
lingering pods may cause cluster performance degradation or in worst case cause the
cluster to go offline due to this degradation.
-->
建議設置 `ttlSecondsAfterFinished` 字段，因爲非託管任務
（是你直接創建的 Job，而不是通過其他工作負載 API（如 CronJob）間接創建的 Job）
的默認刪除策略是 `orphanDependents`，這會導致非託管 Job 創建的 Pod 在該 Job 被完全刪除後被保留。
即使{{< glossary_tooltip text="控制面" term_id="control-plane" >}}最終在 Pod 失效或完成後
對已刪除 Job 中的這些 Pod 執行[垃圾收集](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)操作，
這些殘留的 Pod 有時可能會導致集羣性能下降，或者在最壞的情況下會導致集羣因這種性能下降而離線。

<!--
You can use [LimitRanges](/docs/concepts/policy/limit-range/) and
[ResourceQuotas](/docs/concepts/policy/resource-quotas/) to place a
cap on the amount of resources that a particular namespace can
consume.
-->
你可以使用 [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 和
[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)，
設定一個特定名字空間可以消耗的資源上限。
{{< /note >}}

<!--
## Job patterns

The Job object can be used to process a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded,
ranges of keys in a NoSQL database to scan, and so on.
-->
## Job 模式  {#job-patterns}

Job 對象可以用來處理一組相互獨立而又彼此關聯的“工作條目”。
這類工作條目可能是要發送的電子郵件、要渲染的視頻幀、要編解碼的文件、NoSQL
數據庫中要掃描的主鍵範圍等等。

<!--
In a complex system, there may be multiple different sets of work items. Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.

There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:
-->
在一個複雜系統中，可能存在多個不同的工作條目集合。
這裏我們僅考慮用戶希望一起管理的工作條目集合之一：**批處理作業**。

並行計算的模式有好多種，每種都有自己的強項和弱點。這裏要權衡的因素有：

<!--
- One Job object for each work item, vs. a single Job object for all work items.
  One Job per work item creates some overhead for the user and for the system to manage
  large numbers of Job objects.
  A single Job for all work items is better for large numbers of items. 
- Number of Pods created equals number of work items, versus each Pod can process multiple work items.
  When the number of Pods equals the number of work items, the Pods typically
  requires less modification to existing code and containers. Having each Pod
  process multiple work items is better for large numbers of items.
-->
- 每個工作條目對應一個 Job 或者所有工作條目對應同一 Job 對象。
  爲每個工作條目創建一個 Job 的做法會給用戶帶來一些額外的負擔，系統需要管理大量的 Job 對象。
  用一個 Job 對象來完成所有工作條目的做法更適合處理大量工作條目的場景。
- 創建數目與工作條目相等的 Pod 或者令每個 Pod 可以處理多個工作條目。
  當 Pod 個數與工作條目數目相等時，通常不需要在 Pod 中對現有代碼和容器做較大改動；
  讓每個 Pod 能夠處理多個工作條目的做法更適合於工作條目數量較大的場合。
<!--
- Several approaches use a work queue. This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.
- When the Job is associated with a
  [headless Service](/docs/concepts/services-networking/service/#headless-services),
  you can enable the Pods within a Job to communicate with each other to
  collaborate in a computation.
-->
- 有幾種技術都會用到工作隊列。這意味着需要運行一個隊列服務，
  並修改現有程序或容器使之能夠利用該工作隊列。
  與之比較，其他方案在修改現有容器化應用以適應需求方面可能更容易一些。
- 當 Job 與某個[無頭 Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
  之間存在關聯時，你可以讓 Job 中的 Pod 之間能夠相互通信，從而協作完成計算。

<!--
The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.

|                  Pattern                        | Single Job object | Fewer pods than work items? | Use app unmodified? |
| ----------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|
| [Queue with Pod Per Work Item]                  |         ✓         |                             |      sometimes      |
| [Queue with Variable Pod Count]                 |         ✓         |             ✓               |                     |
| [Indexed Job with Static Work Assignment]       |         ✓         |                             |          ✓          |
| [Job with Pod-to-Pod Communication]             |         ✓         |         sometimes           |      sometimes      |
| [Job Template Expansion]                        |                   |                             |          ✓          |
-->
下面是對這些權衡的彙總，第 2 到 4 列對應上面的權衡比較。
模式的名稱對應了相關示例和更詳細描述的鏈接。

| 模式  | 單個 Job 對象 | Pod 數少於工作條目數？ | 直接使用應用無需修改? |
| ----- |:-------------:|:-----------------------:|:---------------------:|
| [每工作條目一 Pod 的隊列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | ✓ | | 有時 |
| [Pod 數量可變的隊列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | ✓ | ✓ |  |
| [靜態任務分派的帶索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | ✓ |  | ✓ |
| [帶 Pod 間通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/)  | ✓ | 有時 | 有時 |
| [Job 模板擴展](/zh-cn/docs/tasks/job/parallel-processing-expansion/)  |  |  | ✓ |

<!--
When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
This means that all pods for a task will have the same command line and the same
image, the same volumes, and (almost) the same environment variables. These patterns
are different ways to arrange for pods to work on different things.

This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.
-->
當你使用 `.spec.completions` 來設置完成數時，Job 控制器所創建的每個 Pod
使用完全相同的 [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。
這意味着任務的所有 Pod 都有相同的命令行，都使用相同的鏡像和數據卷，
甚至連環境變量都（幾乎）相同。
這些模式是讓每個 Pod 執行不同工作的幾種不同形式。

下表顯示的是每種模式下 `.spec.parallelism` 和 `.spec.completions` 所需要的設置。
其中，`W` 表示的是工作條目的個數。

<!--
|             Pattern                             | `.spec.completions` |  `.spec.parallelism` |
| ----------------------------------------------- |:-------------------:|:--------------------:|
| [Queue with Pod Per Work Item]                  |          W          |        any           |
| [Queue with Variable Pod Count]                 |         null        |        any           |
| [Indexed Job with Static Work Assignment]       |          W          |        any           |
| [Job with Pod-to-Pod Communication]             |          W          |         W            |
| [Job Template Expansion]                        |          1          |     should be 1      |
-->
| 模式  | `.spec.completions` |  `.spec.parallelism` |
| ----- |:-------------------:|:--------------------:|
| [每工作條目一 Pod 的隊列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | W | 任意值 |
| [Pod 數量可變的隊列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | 1 | 任意值 |
| [靜態任務分派的帶索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | W |  | 任意值 |
| [帶 Pod 間通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/) | W | W |
| [Job 模板擴展](/zh-cn/docs/tasks/job/parallel-processing-expansion/) | 1 | 應該爲 1 |

<!--
## Advanced usage

### Suspending a Job
-->
## 高級用法   {#advanced-usage}

### 掛起 Job   {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
When a Job is created, the Job controller will immediately begin creating Pods
to satisfy the Job's requirements and will continue to do so until the Job is
complete. However, you may want to temporarily suspend a Job's execution and
resume it later, or start Jobs in suspended state and have a custom controller
decide later when to start them.
-->
Job 被創建時，Job 控制器會馬上開始執行 Pod 創建操作以滿足 Job 的需求，
並持續執行此操作直到 Job 完成爲止。
不過你可能想要暫時掛起 Job 執行，或啓動處於掛起狀態的 Job，
並擁有一個自定義控制器以後再決定什麼時候開始。

<!--
To suspend a Job, you can update the `.spec.suspend` field of
the Job to true; later, when you want to resume it again, update it to false.
Creating a Job with `.spec.suspend` set to true will create it in the suspended
state.
-->
要掛起一個 Job，你可以更新 `.spec.suspend` 字段爲 true，
之後，當你希望恢復其執行時，將其更新爲 false。
創建一個 `.spec.suspend` 被設置爲 true 的 Job 本質上會將其創建爲被掛起狀態。

<!--
When a Job is resumed from suspension, its `.status.startTime` field will be
reset to the current time. This means that the `.spec.activeDeadlineSeconds`
timer will be stopped and reset when a Job is suspended and resumed.
-->
當 Job 被從掛起狀態恢復執行時，其 `.status.startTime` 字段會被重置爲當前的時間。
這意味着 `.spec.activeDeadlineSeconds` 計時器會在 Job 掛起時被停止，
並在 Job 恢復執行時復位。

<!--
When you suspend a Job, any running Pods that don't have a status of `Completed`
will be [terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
with a SIGTERM signal. The Pod's graceful termination period will be honored and
your Pod must handle this signal in this period. This may involve saving
progress for later or undoing changes. Pods terminated this way will not count
towards the Job's `completions` count.
-->
當你掛起一個 Job 時，所有正在運行且狀態不是 `Completed` 的 Pod
將被[終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)並附帶
SIGTERM 信號。Pod 的體面終止期限會被考慮，不過 Pod 自身也必須在此期限之內處理完信號。
處理邏輯可能包括保存進度以便將來恢復，或者取消已經做出的變更等等。
Pod 以這種形式終止時，不會被記入 Job 的 `completions` 計數。

<!--
An example Job definition in the suspended state can be like so:
-->
處於被掛起狀態的 Job 的定義示例可能是這樣子：

```shell
kubectl get job myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: myjob
spec:
  suspend: true
  parallelism: 1
  completions: 5
  template:
    spec:
      ...
```

<!--
You can also toggle Job suspension by patching the Job using the command line.

Suspend an active Job:
-->
你也可以使用命令行爲 Job 打補丁來切換 Job 的掛起狀態。

掛起一個活躍的 Job：

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":true}}'
```

<!--
Resume a suspended Job:
-->
恢復一個掛起的 Job：

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":false}}'
```

<!--
The Job's status can be used to determine if a Job is suspended or has been
suspended in the past:
-->
Job 的 `status` 可以用來確定 Job 是否被掛起，或者曾經被掛起。

```shell
kubectl get jobs/myjob -o yaml
```

<!--
```yaml
apiVersion: batch/v1
kind: Job
# .metadata and .spec omitted
status:
  conditions:
  - lastProbeTime: "2021-02-05T13:14:33Z"
    lastTransitionTime: "2021-02-05T13:14:33Z"
    status: "True"
    type: Suspended
  startTime: "2021-02-05T13:13:48Z"
```
-->
```yaml
apiVersion: batch/v1
kind: Job
# .metadata 和 .spec 已省略
status:
  conditions:
  - lastProbeTime: "2021-02-05T13:14:33Z"
    lastTransitionTime: "2021-02-05T13:14:33Z"
    status: "True"
    type: Suspended
  startTime: "2021-02-05T13:13:48Z"
```

<!--
The Job condition of type "Suspended" with status "True" means the Job is
suspended; the `lastTransitionTime` field can be used to determine how long the
Job has been suspended for. If the status of that condition is "False", then the
Job was previously suspended and is now running. If such a condition does not
exist in the Job's status, the Job has never been stopped.

Events are also created when the Job is suspended and resumed:
-->
Job 的 "Suspended" 類型的狀況在狀態值爲 "True" 時意味着 Job 正被掛起；
`lastTransitionTime` 字段可被用來確定 Job 被掛起的時長。
如果此狀況字段的取值爲 "False"，則 Job 之前被掛起且現在在運行。
如果 "Suspended" 狀況在 `status` 字段中不存在，則意味着 Job 從未被停止執行。

當 Job 被掛起和恢復執行時，也會生成事件：

```shell
kubectl describe jobs/myjob
```

```
Name:           myjob
...
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  12m   job-controller  Created pod: myjob-hlrpl
  Normal  SuccessfulDelete  11m   job-controller  Deleted pod: myjob-hlrpl
  Normal  Suspended         11m   job-controller  Job suspended
  Normal  SuccessfulCreate  3s    job-controller  Created pod: myjob-jvb44
  Normal  Resumed           3s    job-controller  Job resumed
```

<!--
The last four events, particularly the "Suspended" and "Resumed" events, are
directly a result of toggling the `.spec.suspend` field. In the time between
these two events, we see that no Pods were created, but Pod creation restarted
as soon as the Job was resumed.
-->
最後四個事件，特別是 "Suspended" 和 "Resumed" 事件，都是因爲 `.spec.suspend`
字段值被改來改去造成的。在這兩個事件之間，我們看到沒有 Pod 被創建，不過當
Job 被恢復執行時，Pod 創建操作立即被重啓執行。

<!--
### Mutable Scheduling Directives
-->
### 可變調度指令 {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
In most cases, a parallel job will want the pods to run with constraints,
like all in the same zone, or all either on GPU model x or y but not a mix of both.
-->
在大多數情況下，並行作業會希望 Pod 在一定約束條件下運行，
比如所有的 Pod 都在同一個區域，或者所有的 Pod 都在 GPU 型號 x 或 y 上，而不是兩者的混合。

<!--
The [suspend](#suspending-a-job) field is the first step towards achieving those semantics. Suspend allows a
custom queue controller to decide when a job should start; However, once a job is unsuspended,
a custom queue controller has no influence on where the pods of a job will actually land.
-->
[suspend](#suspending-a-job) 字段是實現這些語義的第一步。
suspend 允許自定義隊列控制器，以決定工作何時開始；然而，一旦工作被取消暫停，
自定義隊列控制器對 Job 中 Pod 的實際放置位置沒有影響。

<!--
This feature allows updating a Job's scheduling directives before it starts, which gives custom queue
controllers the ability to influence pod placement while at the same time offloading actual
pod-to-node assignment to kube-scheduler. This is allowed only for suspended Jobs that have never
been unsuspended before.
-->
此特性允許在 Job 開始之前更新調度指令，從而爲定製隊列提供影響 Pod
放置的能力，同時將 Pod 與節點間的分配關係留給 kube-scheduler 決定。
這一特性僅適用於之前從未被暫停過的、已暫停的 Job。
控制器能夠影響 Pod 放置，同時參考實際 pod-to-node 分配給 kube-scheduler。
這僅適用於從未暫停的 Job。

<!--
The fields in a Job's pod template that can be updated are node affinity, node selector,
tolerations, labels, annotations and [scheduling gates](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/).
-->
Job 的 Pod 模板中可以更新的字段是節點親和性、節點選擇器、容忍、標籤、註解和
[調度門控](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)。

<!--
### Specifying your own Pod selector

Normally, when you create a Job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the Job is created.
It picks a selector value that will not overlap with any other jobs.

However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the Job.
-->
### 指定你自己的 Pod 選擇算符 {#specifying-your-own-pod-selector}

通常，當你創建一個 Job 對象時，你不會設置 `.spec.selector`。
系統的默認值填充邏輯會在創建 Job 時添加此字段。
它會選擇一個不會與任何其他 Job 重疊的選擇算符設置。

不過，有些場合下，你可能需要重載這個自動設置的選擇算符。
爲了實現這點，你可以手動設置 Job 的 `spec.selector` 字段。

<!--
Be very careful when doing this. If you specify a label selector which is not
unique to the pods of that Job, and which matches unrelated Pods, then pods of the unrelated
job may be deleted, or this Job may count other Pods as completing it, or one or both
Jobs may refuse to create Pods or run to completion. If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their Pods may behave
in unpredictable ways too. Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.
-->
做這個操作時請務必小心。
如果你所設定的標籤選擇算符並不唯一針對 Job 對應的 Pod 集合，
甚或該算符還能匹配其他無關的 Pod，這些無關的 Job 的 Pod 可能會被刪除。
或者當前 Job 會將另外一些 Pod 當作是完成自身工作的 Pod，
又或者兩個 Job 之一或者二者同時都拒絕創建 Pod，無法運行至完成狀態。
如果所設置的算符不具有唯一性，其他控制器（如 RC 副本控制器）及其所管理的 Pod
集合可能會變得行爲不可預測。
Kubernetes 不會在你設置 `.spec.selector` 時嘗試阻止你犯這類錯誤。

<!--
Here is an example of a case when you might want to use this feature.

Say Job `old` is already running. You want existing Pods
to keep running, but you want the rest of the Pods it creates
to use a different pod template and for the Job to have a new name.
You cannot update the Job because these fields are not updatable.
Therefore, you delete Job `old` but _leave its pods
running_, using `kubectl delete jobs/old --cascade=orphan`.
Before deleting it, you make a note of what selector it uses:
-->
下面是一個示例場景，在這種場景下你可能會使用剛剛講述的特性。

假定名爲 `old` 的 Job 已經處於運行狀態。
你希望已有的 Pod 繼續運行，但你希望 Job 接下來要創建的其他 Pod
使用一個不同的 Pod 模板，甚至希望 Job 的名字也發生變化。
你無法更新現有的 Job，因爲這些字段都是不可更新的。
因此，你會刪除 `old` Job，但**允許該 Job 的 Pod 集合繼續運行**。
這是通過 `kubectl delete jobs/old --cascade=orphan` 實現的。
在刪除之前，我們先記下該 Job 所使用的選擇算符。

```shell
kubectl get job old -o yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```yaml
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
Then you create a new Job with name `new` and you explicitly specify the same selector.
Since the existing Pods have label `batch.kubernetes.io/controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`,
they are controlled by Job `new` as well.

You need to specify `manualSelector: true` in the new Job since you are not using
the selector that the system normally generates for you automatically.
-->
接下來你會創建名爲 `new` 的新 Job，並顯式地爲其設置相同的選擇算符。
由於現有 Pod 都具有標籤
`batch.kubernetes.io/controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`，
它們也會被名爲 `new` 的 Job 所控制。

你需要在新 Job 中設置 `manualSelector: true`，
因爲你並未使用系統通常自動爲你生成的選擇算符。

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
The new Job itself will have a different uid from `a8f3d00d-c6d2-11e5-9f87-42010af00002`. Setting
`manualSelector: true` tells the system that you know what you are doing and to allow this
mismatch.
-->
新的 Job 自身會有一個不同於 `a8f3d00d-c6d2-11e5-9f87-42010af00002` 的唯一 ID。
設置 `manualSelector: true`
是在告訴系統你知道自己在幹什麼並要求系統允許這種不匹配的存在。

<!--
### Job tracking with finalizers
-->
### 使用 Finalizer 追蹤 Job   {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The control plane keeps track of the Pods that belong to any Job and notices if
any such Pod is removed from the API server. To do that, the Job controller
creates Pods with the finalizer `batch.kubernetes.io/job-tracking`. The
controller removes the finalizer only after the Pod has been accounted for in
the Job status, allowing the Pod to be removed by other controllers or users.
-->
控制面會跟蹤屬於任何 Job 的 Pod，並通知是否有任何這樣的 Pod 被從 API 服務器中移除。
爲了實現這一點，Job 控制器創建的 Pod 帶有 Finalizer `batch.kubernetes.io/job-tracking`。
控制器只有在 Pod 被記入 Job 狀態後纔會移除 Finalizer，允許 Pod 可以被其他控制器或用戶移除。

{{< note >}}
<!--
See [My pod stays terminating](/docs/tasks/debug/debug-application/debug-pods/) if you
observe that pods from a Job are stuck with the tracking finalizer.
-->
如果你發現來自 Job 的某些 Pod 因存在負責跟蹤的 Finalizer 而無法正常終止，
請參閱[我的 Pod 一直處於終止狀態](/zh-cn/docs/tasks/debug/debug-application/debug-pods/)。
{{< /note >}}

<!--
### Elastic Indexed Jobs
-->
### 彈性索引 Job  {#elastic-indexed-jobs}

{{< feature-state feature_gate_name="ElasticIndexedJob" >}}

<!--
You can scale Indexed Jobs up or down by mutating both `.spec.parallelism` 
and `.spec.completions` together such that `.spec.parallelism == .spec.completions`. 
When scaling down, Kubernetes removes the Pods with higher indexes.

Use cases for elastic Indexed Jobs include batch workloads which require 
scaling an indexed Job, such as MPI, Horovod, Ray, and PyTorch training jobs.
-->
你可以通過同時改變 `.spec.parallelism` 和 `.spec.completions` 來擴大或縮小帶索引 Job，
從而滿足 `.spec.parallelism == .spec.completions`。
縮減規模時，Kubernetes 會刪除具有更高索引的 Pod。

彈性索引 Job 的使用場景包括需要擴展索引 Job 的批處理工作負載，例如 MPI、Horovod、Ray
和 PyTorch 訓練作業。

<!--
### Delayed creation of replacement pods {#pod-replacement-policy}
-->
### 延遲創建替換 Pod   {#pod-replacement-policy}

{{< feature-state feature_gate_name="JobPodReplacementPolicy" >}}

<!--
By default, the Job controller recreates Pods as soon they either fail or are terminating (have a deletion timestamp).
This means that, at a given time, when some of the Pods are terminating, the number of running Pods for a Job
can be greater than `parallelism` or greater than one Pod per index (if you are using an Indexed Job).
-->
默認情況下，當 Pod 失敗或正在終止（具有刪除時間戳）時，Job 控制器會立即重新創建 Pod。
這意味着，在某個時間點上，當一些 Pod 正在終止時，爲 Job 正運行中的 Pod 數量可以大於 `parallelism`
或超出每個索引一個 Pod（如果使用 Indexed Job）。

<!--
You may choose to create replacement Pods only when the terminating Pod is fully terminal (has `status.phase: Failed`).
To do this, set the `.spec.podReplacementPolicy: Failed`.
The default replacement policy depends on whether the Job has a `podFailurePolicy` set.
With no Pod failure policy defined for a Job, omitting the `podReplacementPolicy` field selects the
`TerminatingOrFailed` replacement policy:
the control plane creates replacement Pods immediately upon Pod deletion
(as soon as the control plane sees that a Pod for this Job has `deletionTimestamp` set).
For Jobs with a Pod failure policy set, the default  `podReplacementPolicy` is `Failed`, and no other
value is permitted.
See [Pod failure policy](#pod-failure-policy) to learn more about Pod failure policies for Jobs.
-->
你可以選擇僅在終止過程中的 Pod 完全終止（具有 `status.phase: Failed`）時才創建替換 Pod。
爲此，可以設置 `.spec.podReplacementPolicy: Failed`。
默認的替換策略取決於 Job 是否設置了 `podFailurePolicy`。對於沒有定義 Pod 失效策略的 Job，
省略 `podReplacementPolicy` 字段相當於選擇 `TerminatingOrFailed` 替換策略：
控制平面在 Pod 刪除時立即創建替換 Pod（只要控制平面發現該 Job 的某個 Pod 被設置了 `deletionTimestamp`）。
對於設置了 Pod 失效策略的 Job，默認的 `podReplacementPolicy` 是 `Failed`，不允許其他值。
請參閱 [Pod 失效策略](#pod-failure-policy)以瞭解更多關於 Job 的 Pod 失效策略的信息。

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

<!--
Provided your cluster has the feature gate enabled, you can inspect the `.status.terminating` field of a Job.
The value of the field is the number of Pods owned by the Job that are currently terminating.
-->
如果你的集羣啓用了此特性門控，你可以檢查 Job 的 `.status.terminating` 字段。
該字段值是當前處於終止過程中的、由該 Job 擁有的 Pod 的數量。

```shell
kubectl get jobs/myjob -o yaml
```

<!--
```yaml
apiVersion: batch/v1
kind: Job
# .metadata and .spec omitted
status:
  terminating: 3 # three Pods are terminating and have not yet reached the Failed phase
```
-->
```yaml
apiVersion: batch/v1
kind: Job
# .metadata 和 .spec 被省略
status:
  terminating: 3 # 三個 Pod 正在終止且還未達到 Failed 階段
```

<!--
### Delegation of managing a Job object to external controller
-->
### 將管理 Job 對象的任務委託給外部控制器   {#delegation-of-managing-a-job-object-to-external-controller}

{{< feature-state feature_gate_name="JobManagedBy" >}}

{{< note >}}
<!--
You can only set the `managedBy` field on Jobs if you enable the `JobManagedBy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
(enabled by default).
-->
你只有在啓用了 `JobManagedBy`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（默認開啓）時，
纔可以在 Job 上設置 `managedBy` 字段。
{{< /note >}}

<!--
This feature allows you to disable the built-in Job controller, for a specific
Job, and delegate reconciliation of the Job to an external controller.

You indicate the controller that reconciles the Job by setting a custom value
for the `spec.managedBy` field - any value
other than `kubernetes.io/job-controller`. The value of the field is immutable.
-->
此特性允許你爲特定 Job 禁用內置的 Job 控制器，並將 Job 的協調任務委託給外部控制器。

你可以通過爲 `spec.managedBy` 字段設置一個自定義值來指示用來協調 Job 的控制器，
這個自定義值可以是除了 `kubernetes.io/job-controller` 之外的任意值。此字段的值是不可變的。

{{< note >}}
<!--
When using this feature, make sure the controller indicated by the field is
installed, otherwise the Job may not be reconciled at all.
-->
在使用此特性時，請確保此字段指示的控制器已被安裝，否則 Job 可能根本不會被協調。
{{< /note >}}

{{< note >}}
<!--
When developing an external Job controller be aware that your controller needs
to operate in a fashion conformant with the definitions of the API spec and
status fields of the Job object.

Please review these in detail in the [Job API](/docs/reference/kubernetes-api/workload-resources/job-v1/).
We also recommend that you run the e2e conformance tests for the Job object to
verify your implementation.

Finally, when developing an external Job controller make sure it does not use the
`batch.kubernetes.io/job-tracking` finalizer, reserved for the built-in controller.
-->
在開發外部 Job 控制器時，請注意你的控制器需要以符合 Job 對象的 API 規範和狀態字段定義的方式運行。

有關細節請參閱 [Job API](/zh-cn/docs/reference/kubernetes-api/workload-resources/job-v1/)。
我們也建議你運行 Job 對象的 e2e 合規性測試以檢驗你的實現。

最後，在開發外部 Job 控制器時，請確保它不使用爲內置控制器預留的
`batch.kubernetes.io/job-tracking` Finalizer。
{{< /note >}}

{{< warning >}}
<!--
If you are considering to disable the `JobManagedBy` feature gate, or to
downgrade the cluster to a version without the feature gate enabled, check if
there are jobs with a custom value of the `spec.managedBy` field. If there
are such jobs, there is a risk that they might be reconciled by two controllers
after the operation: the built-in Job controller and the external controller
indicated by the field value.
-->
如果你考慮禁用 `JobManagedBy` 特性門控，或者將集羣降級到未啓用此特性門控的版本，
請檢查是否有 Job 的 `spec.managedBy` 字段值帶有一個自定義值。如果存在這樣的 Job，就會有一個風險，
即禁用或降級操作後這些 Job 可能會被兩個控制器（內置的 Job 控制器和字段值指示的外部控制器）進行協調。
{{< /warning >}}

<!--
## Alternatives

### Bare Pods

When the node that a Pod is running on reboots or fails, the pod is terminated
and will not be restarted. However, a Job will create new Pods to replace terminated ones.
For this reason, we recommend that you use a Job rather than a bare Pod, even if your application
requires only a single Pod.
-->
## 替代方案  {#alternatives}

### 裸 Pod  {#bare-pods}

當 Pod 運行所在的節點重啓或者失敗，Pod 會被終止並且不會被重啓。
Job 會重新創建新的 Pod 來替代已終止的 Pod。
因爲這個原因，我們建議你使用 Job 而不是獨立的裸 Pod，
即使你的應用僅需要一個 Pod。

<!--
### Replication Controller

Jobs are complementary to [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/).
A Replication Controller manages Pods which are not expected to terminate (e.g. web servers), and a Job
manages Pods that are expected to terminate (e.g. batch tasks).

As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate
for pods with `RestartPolicy` equal to `OnFailure` or `Never`.
-->
### 副本控制器    {#replication-controller}

Job 與[副本控制器](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)是彼此互補的。
副本控制器管理的是那些不希望被終止的 Pod （例如，Web 服務器），
Job 管理的是那些希望被終止的 Pod（例如，批處理作業）。

正如在 [Pod 生命期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/) 中討論的，
`Job` 僅適合於 `restartPolicy` 設置爲 `OnFailure` 或 `Never` 的 Pod。

{{< note >}}
<!--
If `RestartPolicy` is not set, the default value is `Always`.
-->
如果未設置 `restartPolicy`，默認值爲 `Always`。
{{< /note >}}

<!--
### Single Job starts controller Pod

Another pattern is for a single Job to create a Pod which then creates other Pods, acting as a sort
of custom controller for those Pods. This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.
-->
### 單個 Job 啓動控制器 Pod    {#single-job-starts-controller-pod}

另一種模式是用唯一的 Job 來創建 Pod，而該 Pod 負責啓動其他 Pod，
因此扮演了一種後啓動 Pod 的控制器的角色。
這種模式的靈活性更高，但是有時候可能會把事情搞得很複雜，很難入門，
並且與 Kubernetes 的集成度很低。

<!--
An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but maintains complete control over what Pods are created and how work is assigned to them.
-->
這種方法的優點之一是整個過程得到了 Job 對象的完成保障，
同時維持了對創建哪些 Pod、如何向其分派工作的完全控制能力，

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* Read about different ways of running Jobs:
  * [Coarse Parallel Processing Using a Work Queue](/docs/tasks/job/coarse-parallel-processing-work-queue/)
  * [Fine Parallel Processing Using a Work Queue](/docs/tasks/job/fine-parallel-processing-work-queue/)
  * Use an [indexed Job for parallel processing with static work assignment](/docs/tasks/job/indexed-parallel-processing-static/)
  * Create multiple Jobs based on a template: [Parallel Processing using Expansions](/docs/tasks/job/parallel-processing-expansion/)
* Follow the links within [Clean up finished jobs automatically](#clean-up-finished-jobs-automatically)
  to learn more about how your cluster can clean up completed and / or failed tasks.
* `Job` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/job-v1" >}}
  object definition to understand the API for jobs.
* Read about [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/), which you
  can use to define a series of Jobs that will run based on a schedule, similar to
  the UNIX tool `cron`.
* Practice how to configure handling of retriable and non-retriable pod failures
  using `podFailurePolicy`, based on the step-by-step [examples](/docs/tasks/job/pod-failure-policy/).
-->
* 瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 瞭解運行 Job 的不同的方式：
  * [使用工作隊列進行粗粒度並行處理](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/)
  * [使用工作隊列進行精細的並行處理](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)
  * [使用索引作業完成靜態工作分配下的並行處理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)
  * 基於一個模板運行多個 Job：[使用展開的方式進行並行處理](/zh-cn/docs/tasks/job/parallel-processing-expansion/)
* 跟隨[自動清理完成的 Job](#clean-up-finished-jobs-automatically) 文中的鏈接，瞭解你的集羣如何清理完成和失敗的任務。
* `Job` 是 Kubernetes REST API 的一部分。閱讀 {{< api-reference page="workload-resources/job-v1" >}}
  對象定義理解關於該資源的 API。
* 閱讀 [`CronJob`](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，
  它允許你定義一系列定期運行的 Job，類似於 UNIX 工具 `cron`。
* 根據循序漸進的[示例](/zh-cn/docs/tasks/job/pod-failure-policy/)，
  練習如何使用 `podFailurePolicy` 配置處理可重試和不可重試的 Pod 失效。
