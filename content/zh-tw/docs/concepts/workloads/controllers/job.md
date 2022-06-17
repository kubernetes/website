---
title: Jobs
content_type: concept
feature:
  title: 批次執行
  description: >
    除了服務之外，Kubernetes 還可以管理你的批處理和 CI 工作負載，在期望時替換掉失效的容器。
weight: 50
---
<!--
reviewers:
- erictune
- soltysh
title: Jobs
content_type: concept
feature:
  title: Batch execution
  description: >
    In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.
weight: 50
-->

<!-- overview -->
<!--
A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.
As pods successfully complete, the Job tracks the successful completions.  When a specified number
of successful completions is reached, the task (ie, Job) is complete.  Deleting a Job will clean up
the Pods it created. Suspending a Job will delete its active Pods until the Job
is resumed again.

A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example
due to a node hardware failure or a node reboot).

You can also use a Job to run multiple Pods in parallel.

If you want to run a Job (either a single task, or several in parallel) on a schedule,
see [CronJob](/docs/concepts/workloads/controllers/cron-jobs/).
-->
Job 會建立一個或者多個 Pods，並將繼續重試 Pods 的執行，直到指定數量的 Pods 成功終止。
隨著 Pods 成功結束，Job 跟蹤記錄成功完成的 Pods 個數。
當數量達到指定的成功個數閾值時，任務（即 Job）結束。
刪除 Job 的操作會清除所建立的全部 Pods。
掛起 Job 的操作會刪除 Job 的所有活躍 Pod，直到 Job 被再次恢復執行。

一種簡單的使用場景下，你會建立一個 Job 物件以便以一種可靠的方式執行某 Pod 直到完成。
當第一個 Pod 失敗或者被刪除（比如因為節點硬體失效或者重啟）時，Job
物件會啟動一個新的 Pod。

你也可以使用 Job 以並行的方式執行多個 Pod。

如果你想按某種排期表（Schedule）執行 Job（單個任務或多個並行任務），請參閱
[CronJob](/docs/concepts/workloads/controllers/cron-jobs/)。

<!-- body -->

<!--
## Running an example Job

Here is an example Job config.  It computes π to 2000 places and prints it out.
It takes around 10s to complete.
-->
## 執行示例 Job     {#running-an-example-job}

下面是一個 Job 配置示例。它負責計算 π 到小數點後 2000 位，並將結果打印出來。
此計算大約需要 10 秒鐘完成。

{{< codenew file="controllers/job.yaml" >}}

<!--
You can run the example with this command:
-->
你可以使用下面的命令來執行此示例：

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

```shell
kubectl describe jobs/pi
```

<!--
The output is similar to this:
-->
輸出類似於：

```
Name:           pi
Namespace:      default
Selector:       controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                job-name=pi
Annotations:    kubectl.kubernetes.io/last-applied-configuration:
                  {"apiVersion":"batch/v1","kind":"Job","metadata":{"annotations":{},"name":"pi","namespace":"default"},"spec":{"backoffLimit":4,"template":...
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           job-name=pi
  Containers:
   pi:
    Image:      perl
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
  Normal  SuccessfulCreate  14m   job-controller  Created pod: pi-5rwd7
```

<!--
To view completed Pods of a Job, use `kubectl get pods`.

To list all the Pods that belong to a Job in a machine readable form, you can use a command like this:
-->
要檢視 Job 對應的已完成的 Pods，可以執行 `kubectl get pods`。

要以機器可讀的方式列舉隸屬於某 Job 的全部 Pods，你可以使用類似下面這條命令：

```shell
pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
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
Here, the selector is the same as the selector for the Job.  The `--output=jsonpath` option specifies an expression
with the name from each Pod in the returned list.

View the standard output of one of the pods:
-->
這裡，選擇算符與 Job 的選擇算符相同。`--output=jsonpath` 選項給出了一個表示式，
用來從返回的列表中提取每個 Pod 的 name 欄位。

檢視其中一個 Pod 的標準輸出：

```shell
kubectl logs $pods
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
Its name must be a valid [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

A Job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 編寫 Job 規約    {#writing-a-job-spec}

與 Kubernetes 中其他資源的配置類似，Job 也需要 `apiVersion`、`kind` 和 `metadata` 欄位。
Job 的名字必須是合法的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

Job 配置還需要一個 [`.spec` 節](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/#pod-templates). It has exactly the same schema as a {{< glossary_tooltip text="Pod" term_id="pod" >}}, except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a pod template in a Job must specify appropriate
labels (see [pod selector](#pod-selector)) and an appropriate restart policy.

Only a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Never` or `OnFailure` is allowed.
-->
### Pod 模版    {#pod-template}

Job 的 `.spec` 中只有 `.spec.template` 是必需的欄位。

欄位 `.spec.template` 的值是一個 [Pod 模版](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
其定義規範與 {{< glossary_tooltip text="Pod" term_id="pod" >}}
完全相同，只是其中不再需要 `apiVersion` 或 `kind` 欄位。

除了作為 Pod 所必需的欄位之外，Job 中的 Pod 模版必需設定合適的標籤
（參見 [Pod 選擇算符](#pod-selector)）和合適的重啟策略。

Job 中 Pod 的 [`RestartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
只能設定為 `Never` 或 `OnFailure` 之一。

<!--
### Pod selector

The `.spec.selector` field is optional.  In almost all cases you should not specify it.
See section [specifying your own pod selector](#specifying-your-own-pod-selector).
-->
### Pod 選擇算符   {#pod-selector}

欄位 `.spec.selector` 是可選的。在絕大多數場合，你都不需要為其賦值。
參閱[設定自己的 Pod 選擇算符](#specifying-your-own-pod-selector).

<!--
### Parallel execution for Jobs {#parallel-jobs}

There are three main types of task suitable to run as a Job:
-->
### Job 的並行執行 {#parallel-jobs}

適合以 Job 形式來執行的任務主要有三種：

<!--
1. Non-parallel Jobs
   - normally, only one Pod is started, unless the Pod fails.
   - the Job is complete as soon as its Pod terminates successfully.
1. Parallel Jobs with a *fixed completion count*:
   - specify a non-zero positive value for `.spec.completions`.
   - the Job represents the overall task, and is complete when there are `.spec.completions` successful Pods.
   - when using `.spec.completionMode="Indexed"`, each Pod gets a different index in the range 0 to `.spec.completions-1`.
1. Parallel Jobs with a *work queue*:
   - do not specify `.spec.completions`, default to `.spec.parallelism`.
   - the Pods must coordinate amongst themselves or an external service to determine what each should work on. For example, a Pod might fetch a batch of up to N items from the work queue.
   - each Pod is independently capable of determining whether or not all its peers are done, and thus that the entire Job is done.
   - when _any_ Pod from the Job terminates with success, no new Pods are created.
   - once at least one Pod has terminated with success and all Pods are terminated, then the Job is completed with success.
   - once any Pod has exited with success, no other Pod should still be doing any work for this task or writing any output.  They should all be in the process of exiting.
-->
1. 非並行 Job：
   - 通常只啟動一個 Pod，除非該 Pod 失敗。
   - 當 Pod 成功終止時，立即視 Job 為完成狀態。
1. 具有 *確定完成計數* 的並行 Job：
   - `.spec.completions` 欄位設定為非 0 的正數值。
   - Job 用來代表整個任務，當成功的 Pod 個數達到 `.spec.completions` 時，Job 被視為完成。
   - 當使用 `.spec.completionMode="Indexed"` 時，每個 Pod 都會獲得一個不同的
     索引值，介於 0 和 `.spec.completions-1` 之間。
1. 帶 *工作佇列* 的並行 Job：
   - 不設定 `spec.completions`，預設值為 `.spec.parallelism`。
   - 多個 Pod 之間必須相互協調，或者藉助外部服務確定每個 Pod 要處理哪個工作條目。
     例如，任一 Pod 都可以從工作佇列中取走最多 N 個工作條目。
   - 每個 Pod 都可以獨立確定是否其它 Pod 都已完成，進而確定 Job 是否完成。
   - 當 Job 中 _任何_ Pod 成功終止，不再建立新 Pod。
   - 一旦至少 1 個 Pod 成功完成，並且所有 Pod 都已終止，即可宣告 Job 成功完成。
   - 一旦任何 Pod 成功退出，任何其它 Pod 都不應再對此任務執行任何操作或生成任何輸出。
     所有 Pod 都應啟動退出過程。

<!--
For a _non-parallel_ Job, you can leave both `.spec.completions` and `.spec.parallelism` unset.  When both are
unset, both are defaulted to 1.

For a _fixed completion count_ Job, you should set `.spec.completions` to the number of completions needed.
You can set `.spec.parallelism`, or leave it unset and it will default to 1.

For a _work queue_ Job, you must leave `.spec.completions` unset, and set `.spec.parallelism` to
a non-negative integer.

For more information about how to make use of the different types of job, see the [job patterns](#job-patterns) section.
-->
對於 _非並行_ 的 Job，你可以不設定 `spec.completions` 和 `spec.parallelism`。
這兩個屬性都不設定時，均取預設值 1。

對於 _確定完成計數_ 型別的 Job，你應該設定 `.spec.completions` 為所需要的完成個數。
你可以設定 `.spec.parallelism`，也可以不設定。其預設值為 1。

對於一個 _工作佇列_ Job，你不可以設定 `.spec.completions`，但要將`.spec.parallelism`
設定為一個非負整數。

關於如何利用不同型別的 Job 的更多資訊，請參見 [Job 模式](#job-patterns)一節。

<!--
#### Controlling parallelism

The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.

Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety of reasons:
-->
#### 控制並行性   {#controlling-parallelism}

並行性請求（`.spec.parallelism`）可以設定為任何非負整數。
如果未設定，則預設為 1。
如果設定為 0，則 Job 相當於啟動之後便被暫停，直到此值被增加。

實際並行性（在任意時刻執行狀態的 Pods 個數）可能比並行性請求略大或略小，
原因如下：

<!--
- For _fixed completion count_ Jobs, the actual number of pods running in parallel will not exceed the number of
  remaining completions.   Higher values of `.spec.parallelism` are effectively ignored.
- For _work queue_ Jobs, no new Pods are started after any Pod has succeeded -- remaining Pods are allowed to complete, however.
- If the Job {{< glossary_tooltip term_id="controller" >}} has not had time to react.
- If the Job controller failed to create Pods for any reason (lack of `ResourceQuota`, lack of permission, etc.),
  then there may be fewer pods than requested.
- The Job controller may throttle new Pod creation due to excessive previous pod failures in the same Job.
- When a Pod is gracefully shut down, it takes time to stop.
-->
- 對於 _確定完成計數_ Job，實際上並行執行的 Pods 個數不會超出剩餘的完成數。
  如果 `.spec.parallelism` 值較高，會被忽略。
- 對於 _工作佇列_ Job，有任何 Job 成功結束之後，不會有新的 Pod 啟動。
  不過，剩下的 Pods 允許執行完畢。
- 如果 Job {{< glossary_tooltip text="控制器" term_id="controller" >}} 沒有來得及作出響應，或者
- 如果 Job 控制器因為任何原因（例如，缺少 `ResourceQuota` 或者沒有許可權）無法建立 Pods。
  Pods 個數可能比請求的數目小。
- Job 控制器可能會因為之前同一 Job 中 Pod 失效次數過多而壓制新 Pod 的建立。
- 當 Pod 處於體面終止程序中，需要一定時間才能停止。

<!--
### Completion mode
-->
### 完成模式   {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Jobs with _fixed completion count_ - that is, jobs that have non null
`.spec.completions` - can have a completion mode that is specified in `.spec.completionMode`:
-->
帶有 *確定完成計數* 的 Job，即 `.spec.completions` 不為 null 的 Job，
都可以在其 `.spec.completionMode` 中設定完成模式：

<!--
- `NonIndexed` (default): the Job is considered complete when there have been
  `.spec.completions` successfully completed Pods. In other words, each Pod
  completion is homologous to each other. Note that Jobs that have null
  `.spec.completions` are implicitly `NonIndexed`.
- `Indexed`: the Pods of a Job get an associated completion index from 0 to
  `.spec.completions-1`. The index is available through three mechanisms:
  - The Pod annotation `batch.kubernetes.io/job-completion-index`.
  - As part of the Pod hostname, following the pattern `$(job-name)-$(index)`.
    When you use an Indexed Job in combination with a
    {{< glossary_tooltip term_id="Service" >}}, Pods within the Job can use
    the deterministic hostnames to address each other via DNS.
  - From the containarized task, in the environment variable `JOB_COMPLETION_INDEX`.

  The Job is considered complete when there is one successfully completed Pod
  for each index. For more information about how to use this mode, see
  [Indexed Job for Parallel Processing with Static Work Assignment](/docs/tasks/job/indexed-parallel-processing-static/).
  Note that, although rare, more than one Pod could be started for the same
  index, but only one of them will count towards the completion count.
-->
- `NonIndexed`（預設值）：當成功完成的 Pod 個數達到 `.spec.completions` 所
  設值時認為 Job 已經完成。換言之，每個 Job 完成事件都是獨立無關且同質的。
  要注意的是，當 `.spec.completions` 取值為 null 時，Job 被隱式處理為 `NonIndexed`。
- `Indexed`：Job 的 Pod 會獲得對應的完成索引，取值為 0 到 `.spec.completions-1`。
  該索引可以透過三種方式獲取：
  - Pod 註解 `batch.kubernetes.io/job-completion-index`。
  - 作為 Pod 主機名的一部分，遵循模式 `$(job-name)-$(index)`。
    當你同時使用帶索引的 Job（Indexed Job）與 {{< glossary_tooltip term_id="Service" >}}，
    Job 中的 Pods 可以透過 DNS 使用確切的主機名互相定址。
  - 對於容器化的任務，在環境變數 `JOB_COMPLETION_INDEX` 中。

  當每個索引都對應一個完成完成的 Pod 時，Job 被認為是已完成的。
  關於如何使用這種模式的更多資訊，可參閱
  [用帶索引的 Job 執行基於靜態任務分配的並行處理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)。
  需要注意的是，對同一索引值可能被啟動的 Pod 不止一個，儘管這種情況很少發生。
  這時，只有一個會被記入完成計數中。

<!--
## Handling Pod and container failures

A container in a Pod may fail for a number of reasons, such as because the process in it exited with
a non-zero exit code, or the container was killed for exceeding a memory limit, etc.  If this
happens, and the `.spec.template.spec.restartPolicy = "OnFailure"`, then the Pod stays
on the node, but the container is re-run.  Therefore, your program needs to handle the case when it is
restarted locally, or else specify `.spec.template.spec.restartPolicy = "Never"`.
See [pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#example-states) for more information on `restartPolicy`.
-->

## 處理 Pod 和容器失效    {#handling-pod-and-container-failures}

Pod 中的容器可能因為多種不同原因失效，例如因為其中的程序退出時返回值非零，
或者容器因為超出記憶體約束而被殺死等等。
如果發生這類事件，並且 `.spec.template.spec.restartPolicy = "OnFailure"`，
Pod 則繼續留在當前節點，但容器會被重新執行。
因此，你的程式需要能夠處理在本地被重啟的情況，或者要設定
`.spec.template.spec.restartPolicy = "Never"`。
關於 `restartPolicy` 的更多資訊，可參閱
[Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#example-states)。

<!--
An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`.  When a Pod fails, then the Job controller
starts a new Pod.  This means that your application needs to handle the case when it is restarted in a new
pod.  In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.
-->
整個 Pod 也可能會失敗，且原因各不相同。
例如，當 Pod 啟動時，節點失效（被升級、被重啟、被刪除等）或者其中的容器失敗而
`.spec.template.spec.restartPolicy = "Never"`。
當 Pod 失敗時，Job 控制器會啟動一個新的 Pod。
這意味著，你的應用需要處理在一個新 Pod 中被重啟的情況。
尤其是應用需要處理之前執行所產生的臨時檔案、鎖、不完整的輸出等問題。

<!--
Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.

If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once.  Therefore, your pods must also be tolerant of concurrency.
-->
注意，即使你將 `.spec.parallelism` 設定為 1，且將 `.spec.completions` 設定為
1，並且 `.spec.template.spec.restartPolicy` 設定為 "Never"，同一程式仍然有可能被啟動兩次。

如果你確實將 `.spec.parallelism` 和 `.spec.completions` 都設定為比 1 大的值，
那就有可能同時出現多個 Pod 執行的情況。
為此，你的 Pod 也必須能夠處理併發性問題。

<!--
### Pod backoff failure policy

There are situations where you want to fail a Job after some amount of retries
due to a logical error in configuration etc.
To do so, set `.spec.backoffLimit` to specify the number of retries before
considering a Job as failed. The back-off limit is set by default to 6. Failed
Pods associated with the Job are recreated by the Job controller with an
exponential back-off delay (10s, 20s, 40s ...) capped at six minutes. The
back-off count is reset when a Job's Pod is deleted or successful without any
other Pods for the Job failing around that time.
-->
### Pod 回退失效策略    {#pod-backoff-failure-policy}

在有些情形下，你可能希望 Job 在經歷若干次重試之後直接進入失敗狀態，因為這很
可能意味著遇到了配置錯誤。
為了實現這點，可以將 `.spec.backoffLimit` 設定為視 Job 為失敗之前的重試次數。
失效回退的限制值預設為 6。
與 Job 相關的失效的 Pod 會被 Job 控制器重建，回退重試時間將會按指數增長
（從 10 秒、20 秒到 40 秒）最多至 6 分鐘。
當 Job 的 Pod 被刪除時，或者 Pod 成功時沒有其它 Pod 處於失敗狀態，失效回退的次數也會被重置（為 0）。

<!--
If your job has `restartPolicy = "OnFailure"`, keep in mind that your Pod running the Job
will be terminated once the job backoff limit has been reached. This can make debugging the Job's executable more difficult. We suggest setting
`restartPolicy = "Never"` when debugging the Job or using a logging system to ensure output
from failed Jobs is not lost inadvertently.
-->
{{< note >}}
如果你的 Job 的 `restartPolicy` 被設定為 "OnFailure"，就要注意執行該 Job 的 Pod
會在 Job 到達失效回退次數上限時自動被終止。
這會使得除錯 Job 中可執行檔案的工作變得非常棘手。
我們建議在除錯 Job 時將 `restartPolicy` 設定為 "Never"，
或者使用日誌系統來確保失效 Jobs 的輸出不會意外遺失。
{{< /note >}}

<!--
## Job termination and cleanup

When a Job completes, no more Pods are created, but the Pods are [usually](#pod-backoff-failure-policy) not deleted either.
Keeping them around
allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status.  It is up to the user to delete
old jobs after noting their status.  Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`). When you delete the job using `kubectl`, all the pods it created are deleted too.
-->
## Job 終止與清理    {#clean-up-finished-jobs-automatically}

Job 完成時不會再建立新的 Pod，不過已有的 Pod [通常](#pod-backoff-failure-policy)也不會被刪除。
保留這些 Pod 使得你可以檢視已完成的 Pod 的日誌輸出，以便檢查錯誤、警告
或者其它診斷性輸出。
Job 完成時 Job 物件也一樣被保留下來，這樣你就可以檢視它的狀態。
在查看了 Job 狀態之後刪除老的 Job 的操作留給了使用者自己。
你可以使用 `kubectl` 來刪除 Job（例如，`kubectl delete jobs/pi`
或者 `kubectl delete -f ./job.yaml`）。
當使用 `kubectl` 來刪除 Job 時，該 Job 所建立的 Pods 也會被刪除。

<!--
By default, a Job will run uninterrupted unless a Pod fails (`restartPolicy=Never`) or a Container exits in error (`restartPolicy=OnFailure`), at which point the Job defers to the
`.spec.backoffLimit` described above. Once `.spec.backoffLimit` has been reached the Job will be marked as failed and any running Pods will be terminated.

Another way to terminate a Job is by setting an active deadline.
Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds.
The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status will become `type: Failed` with `reason: DeadlineExceeded`.
-->
預設情況下，Job 會持續執行，除非某個 Pod 失敗（`restartPolicy=Never`）
或者某個容器出錯退出（`restartPolicy=OnFailure`）。
這時，Job 基於前述的 `spec.backoffLimit` 來決定是否以及如何重試。
一旦重試次數到達 `.spec.backoffLimit` 所設的上限，Job 會被標記為失敗，
其中執行的 Pods 都會被終止。

終止 Job 的另一種方式是設定一個活躍期限。
你可以為 Job 的 `.spec.activeDeadlineSeconds` 設定一個秒數值。
該值適用於 Job 的整個生命期，無論 Job 建立了多少個 Pod。
一旦 Job 執行時間達到 `activeDeadlineSeconds` 秒，其所有執行中的 Pod
都會被終止，並且 Job 的狀態更新為 `type: Failed`
及 `reason: DeadlineExceeded`。

<!--
Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`. Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.

Example:
-->
注意 Job 的 `.spec.activeDeadlineSeconds` 優先順序高於其 `.spec.backoffLimit` 設定。
因此，如果一個 Job 正在重試一個或多個失效的 Pod，該 Job 一旦到達
`activeDeadlineSeconds` 所設的時限即不再部署額外的 Pod，即使其重試次數還未
達到 `backoffLimit` 所設的限制。

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
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```
<!--
Note that both the Job spec and the [Pod template spec](/docs/concepts/workloads/pods/init-containers/#detailed-behavior) within the Job have an `activeDeadlineSeconds` field. Ensure that you set this field at the proper level.

Keep in mind that the `restartPolicy` applies to the Pod, and not to the Job itself: there is no automatic Job restart once the Job status is `type: Failed`.
That is, the Job termination mechanisms activated with `.spec.activeDeadlineSeconds` and `.spec.backoffLimit` result in a permanent Job failure that requires manual intervention to resolve.
-->
注意 Job 規約和 Job 中的
[Pod 模版規約](/zh-cn/docs/concepts/workloads/pods/init-containers/#detailed-behavior)
都有 `activeDeadlineSeconds` 欄位。
請確保你在合適的層次設定正確的欄位。

還要注意的是，`restartPolicy` 對應的是 Pod，而不是 Job 本身：
一旦 Job 狀態變為 `type: Failed`，就不會再發生 Job 重啟的動作。
換言之，由 `.spec.activeDeadlineSeconds` 和 `.spec.backoffLimit` 所觸發的 Job 終結機制
都會導致 Job 永久性的失敗，而這類狀態都需要手工干預才能解決。

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

完成的 Job 通常不需要留存在系統中。在系統中一直保留它們會給 API
伺服器帶來額外的壓力。
如果 Job 由某種更高級別的控制器來管理，例如
[CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，
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
自動清理已完成 Job （狀態為 `Complete` 或 `Failed`）的另一種方式是使用由
[TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)所提供
的 TTL 機制。
透過設定 Job 的 `.spec.ttlSecondsAfterFinished` 欄位，可以讓該控制器清理掉
已結束的資源。

TTL 控制器清理 Job 時，會級聯式地刪除 Job 物件。
換言之，它會刪除所有依賴的物件，包括 Pod 及 Job 本身。
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
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

<!--
The Job `pi-with-ttl` will be eligible to be automatically deleted, `100`
seconds after it finishes.

If the field is set to `0`, the Job will be eligible to be automatically deleted
immediately after it finishes. If the field is unset, this Job won't be cleaned
up by the TTL controller after it finishes.
-->
Job `pi-with-ttl` 在結束 100 秒之後，可以成為被自動刪除的物件。

如果該欄位設定為 `0`，Job 在結束之後立即成為可被自動刪除的物件。
如果該欄位沒有設定，Job 不會在結束之後被 TTL 控制器自動清除。

<!--
## Job patterns

The Job object can be used to support reliable parallel execution of Pods.  The Job object is not
designed to support closely-communicating parallel processes, as commonly found in scientific
computing.  It does support parallel processing of a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded, ranges of keys in a
NoSQL database to scan, and so on.
-->
## Job 模式  {#job-patterns}

Job 物件可以用來支援多個 Pod 的可靠的併發執行。
Job 物件不是設計用來支援相互通訊的並行程序的，後者一般在科學計算中應用較多。
Job 的確能夠支援對一組相互獨立而又有所關聯的 *工作條目* 的並行處理。
這類工作條目可能是要傳送的電子郵件、要渲染的影片幀、要編解碼的檔案、NoSQL
資料庫中要掃描的主鍵範圍等等。

<!--
In a complex system, there may be multiple different sets of work items.  Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.

There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:
-->
在一個複雜系統中，可能存在多個不同的工作條目集合。這裡我們僅考慮使用者希望一起管理的
工作條目集合之一 &mdash; *批處理作業*。

平行計算的模式有好多種，每種都有自己的強項和弱點。這裡要權衡的因素有：

<!--
- One Job object for each work item, vs. a single Job object for all work items.  The latter is
  better for large numbers of work items.  The former creates some overhead for the user and for the
  system to manage large numbers of Job objects.
- Number of pods created equals number of work items, vs. each Pod can process multiple work items.
  The former typically requires less modification to existing code and containers.  The latter
  is better for large numbers of work items, for similar reasons to the previous bullet.
- Several approaches use a work queue.  This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.
-->
- 每個工作條目對應一個 Job 或者所有工作條目對應同一 Job 物件。
  後者更適合處理大量工作條目的場景；
  前者會給使用者帶來一些額外的負擔，而且需要系統管理大量的 Job 物件。
- 建立與工作條目相等的 Pod 或者令每個 Pod 可以處理多個工作條目。
  前者通常不需要對現有程式碼和容器做較大改動；
  後者則更適合工作條目數量較大的場合，原因同上。
- 有幾種技術都會用到工作佇列。這意味著需要執行一個佇列服務，並修改現有程式或容器
  使之能夠利用該工作佇列。
  與之比較，其他方案在修改現有容器化應用以適應需求方面可能更容易一些。

<!--
The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.
-->
下面是對這些權衡的彙總，列 2 到 4 對應上面的權衡比較。
模式的名稱對應了相關示例和更詳細描述的連結。

| 模式  | 單個 Job 物件 | Pods 數少於工作條目數？ | 直接使用應用無需修改? |
| ----- |:-------------:|:-----------------------:|:---------------------:|
| [每工作條目一 Pod 的佇列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | ✓ | | 有時 |
| [Pod 數量可變的佇列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | ✓ | ✓ |  |
| [靜態任務分派的帶索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | ✓ |  | ✓ |
| [Job 模版擴充套件](/zh-cn/docs/tasks/job/parallel-processing-expansion/)  |  |  | ✓ |

<!--
When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).  This means that
all pods for a task will have the same command line and the same
image, the same volumes, and (almost) the same environment variables.  These patterns
are different ways to arrange for pods to work on different things.

This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.
-->
當你使用 `.spec.completions` 來設定完成數時，Job 控制器所建立的每個 Pod
使用完全相同的 [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。
這意味著任務的所有 Pod 都有相同的命令列，都使用相同的映象和資料卷，甚至連
環境變數都（幾乎）相同。
這些模式是讓每個 Pod 執行不同工作的幾種不同形式。

下表顯示的是每種模式下 `.spec.parallelism` 和 `.spec.completions` 所需要的設定。
其中，`W` 表示的是工作條目的個數。

| 模式  | `.spec.completions` |  `.spec.parallelism` |
| ----- |:-------------------:|:--------------------:|
| [每工作條目一 Pod 的佇列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | W | 任意值 |
| [Pod 個數可變的佇列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | 1 | 任意值 |
| [靜態任務分派的帶索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | W |  | 任意值 |
| [Job 模版擴充套件](/zh-cn/docs/tasks/job/parallel-processing-expansion/) | 1 | 應該為 1 |

<!--
## Advanced usage

### Suspending a Job
-->
## 高階用法   {#advanced-usage}

### 掛起 Job   {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}


<!--
When a Job is created, the Job controller will immediately begin creating Pods
to satisfy the Job's requirements and will continue to do so until the Job is
complete. However, you may want to temporarily suspend a Job's execution and
resume it later, or start Jobs in suspended state and have a custom controller
decide later when to start them.
-->
Job 被建立時，Job 控制器會馬上開始執行 Pod 建立操作以滿足 Job 的需求，
並持續執行此操作直到 Job 完成為止。
不過你可能想要暫時掛起 Job 執行，或啟動處於掛起狀態的job，
並擁有一個自定義控制器以後再決定什麼時候開始。

<!--
To suspend a Job, you can update the `.spec.suspend` field of
the Job to true; later, when you want to resume it again, update it to false.
Creating a Job with `.spec.suspend` set to true will create it in the suspended
state.
-->
要掛起一個 Job，你可以更新 `.spec.suspend` 欄位為 true，
之後，當你希望恢復其執行時，將其更新為 false。
建立一個 `.spec.suspend` 被設定為 true 的 Job 本質上會將其建立為被掛起狀態。

<!--
When a Job is resumed from suspension, its `.status.startTime` field will be
reset to the current time. This means that the `.spec.activeDeadlineSeconds`
timer will be stopped and reset when a Job is suspended and resumed.
-->
當 Job 被從掛起狀態恢復執行時，其 `.status.startTime` 欄位會被重置為
當前的時間。這意味著 `.spec.activeDeadlineSeconds` 計時器會在 Job 掛起時
被停止，並在 Job 恢復執行時復位。

<!--
Remember that suspending a Job will delete all active Pods. When the Job is
suspended, your [Pods will be terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
with a SIGTERM signal. The Pod's graceful termination period will be honored and
your Pod must handle this signal in this period. This may involve saving
progress for later or undoing changes. Pods terminated this way will not count
towards the Job's `completions` count.
-->
要記住的是，掛起 Job 會刪除其所有活躍的 Pod。當 Job 被掛起時，你的 Pod 會
收到 SIGTERM 訊號而被[終止](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。
Pod 的體面終止期限會被考慮，不過 Pod 自身也必須在此期限之內處理完訊號。
處理邏輯可能包括儲存進度以便將來恢復，或者取消已經做出的變更等等。
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
The Job's status can be used to determine if a Job is suspended or has been
suspended in the past:
-->
Job 的 `status` 可以用來確定 Job 是否被掛起，或者曾經被掛起。

```shell
kubectl get jobs/myjob -o yaml
```

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

<!--
The Job condition of type "Suspended" with status "True" means the Job is
suspended; the `lastTransitionTime` field can be used to determine how long the
Job has been suspended for. If the status of that condition is "False", then the
Job was previously suspended and is now running. If such a condition does not
exist in the Job's status, the Job has never been stopped.

Events are also created when the Job is suspended and resumed:
-->
Job 的 "Suspended" 型別的狀況在狀態值為 "True" 時意味著 Job 正被
掛起；`lastTransitionTime` 欄位可被用來確定 Job 被掛起的時長。
如果此狀況欄位的取值為 "False"，則 Job 之前被掛起且現在在執行。
如果 "Suspended" 狀況在 `status` 欄位中不存在，則意味著 Job 從未
被停止執行。

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
最後四個事件，特別是 "Suspended" 和 "Resumed" 事件，都是因為 `.spec.suspend`
欄位值被改來改去造成的。在這兩個事件之間，我們看到沒有 Pod 被建立，不過當
Job 被恢復執行時，Pod 建立操作立即被重啟執行。

<!--
### Mutable Scheduling Directives
-->
### 可變排程指令 {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!--
In order to use this behavior, you must enable the `JobMutableNodeSchedulingDirectives`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/).
It is enabled by default.
-->
{{< note >}}
為了使用此功能，你必須在 [API 伺服器](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)上啟用
`JobMutableNodeSchedulingDirectives` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
預設情況下啟用。
{{< /note >}}

<!--
In most cases a parallel job will want the pods to run with constraints, 
like all in the same zone, or all either on GPU model x or y but not a mix of both.
-->
在大多數情況下，並行作業會希望 Pod 在一定約束條件下執行，
比如所有的 Pod 都在同一個區域，或者所有的 Pod 都在 GPU 型號 x 或 y 上，而不是兩者的混合。

<!--
The [suspend](#suspending-a-job) field is the first step towards achieving those semantics. Suspend allows a 
custom queue controller to decide when a job should start; However, once a job is unsuspended,
a custom queue controller has no influence on where the pods of a job will actually land.
-->
[suspend](#suspend-a-job) 欄位是實現這些語義的第一步。
suspend 允許自定義佇列控制器，以決定工作何時開始；然而，一旦工作被取消暫停，
自定義佇列控制器對 Job 中 Pods 的實際放置位置沒有影響。

<!--
This feature allows updating a Job's scheduling directives before it starts, which gives custom queue
controllers the ability to influence pod placement while at the same time offloading actual 
pod-to-node assignment to kube-scheduler. This is allowed only for suspended Jobs that have never 
been unsuspended before.
-->
此特性允許在 Job 開始之前更新排程指令，從而為定製佇列提供影響 Pod
放置的能力，同時將 Pod 與節點間的分配關係留給 kube-scheduler 決定。
這一特性僅適用於之前從未被暫停過的、已暫停的 Job。
控制器能夠影響 Pod 放置，同時參考實際
pod-to-node 分配給 kube-scheduler。這僅適用於從未暫停的 Jobs。

<!--
The fields in a Job's pod template that can be updated are node affinity, node selector, 
tolerations, labels and annotations.
-->
Job 的 Pod 模板中可以更新的欄位是節點親和性、節點選擇器、容忍、標籤和註解。



<!--
### Specifying your own Pod selector

Normally, when you create a Job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the Job is created.
It picks a selector value that will not overlap with any other jobs.

However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the Job.
-->
### 指定你自己的 Pod 選擇算符 {#specifying-your-own-pod-selector}

通常，當你建立一個 Job 物件時，你不會設定 `.spec.selector`。
系統的預設值填充邏輯會在建立 Job 時新增此欄位。
它會選擇一個不會與任何其他 Job 重疊的選擇算符設定。

不過，有些場合下，你可能需要過載這個自動設定的選擇算符。
為了實現這點，你可以手動設定 Job 的 `spec.selector` 欄位。

<!--
Be very careful when doing this.  If you specify a label selector which is not
unique to the pods of that Job, and which matches unrelated Pods, then pods of the unrelated
job may be deleted, or this Job may count other Pods as completing it, or one or both
Jobs may refuse to create Pods or run to completion.  If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their Pods may behave
in unpredictable ways too.  Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.
-->
做這個操作時請務必小心。
如果你所設定的標籤選擇算符並不唯一針對 Job 對應的 Pod 集合，甚或該算符還能匹配
其他無關的 Pod，這些無關的 Job 的 Pod 可能會被刪除。
或者當前 Job 會將另外一些 Pod 當作是完成自身工作的 Pods，
又或者兩個 Job 之一或者二者同時都拒絕建立 Pod，無法執行至完成狀態。
如果所設定的算符不具有唯一性，其他控制器（如 RC 副本控制器）及其所管理的 Pod
集合可能會變得行為不可預測。
Kubernetes 不會在你設定 `.spec.selector` 時嘗試阻止你犯這類錯誤。

<!--
Here is an example of a case when you might want to use this feature.

Say Job `old` is already running.  You want existing Pods
to keep running, but you want the rest of the Pods it creates
to use a different pod template and for the Job to have a new name.
You cannot update the Job because these fields are not updatable.
Therefore, you delete Job `old` but _leave its pods
running_, using `kubectl delete jobs/old --cascade=orphan`.
Before deleting it, you make a note of what selector it uses:
-->
下面是一個示例場景，在這種場景下你可能會使用剛剛講述的特性。

假定名為 `old` 的 Job 已經處於執行狀態。
你希望已有的 Pod 繼續執行，但你希望 Job 接下來要建立的其他 Pod
使用一個不同的 Pod 模版，甚至希望 Job 的名字也發生變化。
你無法更新現有的 Job，因為這些欄位都是不可更新的。
因此，你會刪除 `old` Job，但 _允許該 Job 的 Pod 集合繼續執行_。
這是透過 `kubectl delete jobs/old --cascade=orphan` 實現的。
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
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
Then you create a new Job with name `new` and you explicitly specify the same selector.
Since the existing Pods have label `controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`,
they are controlled by Job `new` as well.

You need to specify `manualSelector: true` in the new Job since you are not using
the selector that the system normally generates for you automatically.
-->
接下來你會建立名為 `new` 的新 Job，並顯式地為其設定相同的選擇算符。
由於現有 Pod 都具有標籤 `controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`，
它們也會被名為 `new` 的 Job 所控制。

你需要在新 Job 中設定 `manualSelector: true`，因為你並未使用系統通常自動為你
生成的選擇算符。

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
The new Job itself will have a different uid from `a8f3d00d-c6d2-11e5-9f87-42010af00002`.  Setting
`manualSelector: true` tells the system that you know what you are doing and to allow this
mismatch.
-->
新的 Job 自身會有一個不同於 `a8f3d00d-c6d2-11e5-9f87-42010af00002` 的唯一 ID。
設定 `manualSelector: true` 是在告訴系統你知道自己在幹什麼並要求系統允許這種不匹配
的存在。

<!--
### Job tracking with finalizers
-->
### 使用 Finalizer 追蹤 Job   {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
<!--
In order to use this behavior, you must enable the `JobTrackingWithFinalizers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
and the [controller manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
It is enabled by default.
-->
要使用該行為，你必須為 [API 伺服器](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
和[控制器管理器](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
啟用 `JobTrackingWithFinalizers`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
預設是啟用的。

<!--
When enabled, the control plane tracks new Jobs using the behavior described
below. Jobs created before the feature was enabled are unaffected. As a user,
the only difference you would see is that the control plane tracking of Job
completion is more accurate.
-->
啟用後，控制面基於下述行為追蹤新的 Job。在啟用該特性之前建立的 Job 不受影響。
作為使用者，你會看到的唯一區別是控制面對 Job 完成情況的跟蹤更加準確。
{{< /note >}}

<!--
When this feature isn't enabled, the Job {{< glossary_tooltip term_id="controller" >}}
relies on counting the Pods that exist in the cluster to track the Job status,
that is, to keep the counters for `succeeded` and `failed` Pods.
However, Pods can be removed for a number of reasons, including:
- The garbage collector that removes orphan Pods when a Node goes down.
- The garbage collector that removes finished Pods (in `Succeeded` or `Failed`
  phase) after a threshold.
- Human intervention to delete Pods belonging to a Job.
- An external controller (not provided as part of Kubernetes) that removes or
  replaces Pods.
-->
該功能未啟用時，Job {{< glossary_tooltip term_id="controller" >}} 依靠計算叢集中存在的 Pod 來跟蹤作業狀態。
也就是說，維持一個統計 `succeeded` 和 `failed` 的 Pod 的計數器。
然而，Pod 可以因為一些原因被移除，包括：
- 當一個節點宕機時，垃圾收集器會刪除孤立（Orphan）Pod。
- 垃圾收集器在某個閾值後刪除已完成的 Pod（處於 `Succeeded` 或 `Failed` 階段）。
- 人工干預刪除 Job 的 Pod。
- 一個外部控制器（不包含於 Kubernetes）來刪除或取代 Pod。

<!--
If you enable the `JobTrackingWithFinalizers` feature for your cluster, the
control plane keeps track of the Pods that belong to any Job and notices if any
such Pod is removed from the API server. To do that, the Job controller creates Pods with
the finalizer `batch.kubernetes.io/job-tracking`. The controller removes the
finalizer only after the Pod has been accounted for in the Job status, allowing
the Pod to be removed by other controllers or users.

The Job controller uses the new algorithm for new Jobs only. Jobs created
before the feature is enabled are unaffected. You can determine if the Job
controller is tracking a Job using Pod finalizers by checking if the Job has the
annotation `batch.kubernetes.io/job-tracking`. You should **not** manually add
or remove this annotation from Jobs.
-->
如果你為你的叢集啟用了 `JobTrackingWithFinalizers` 特性，控制面會跟蹤屬於任何 Job 的 Pod。
並注意是否有任何這樣的 Pod 被從 API 伺服器上刪除。
為了實現這一點，Job 控制器建立的 Pod 帶有 Finalizer `batch.kubernetes.io/job-tracking`。
控制器只有在 Pod 被記入 Job 狀態後才會移除 Finalizer，允許 Pod 可以被其他控制器或使用者刪除。

Job 控制器只對新的 Job 使用新的演算法。在啟用該特性之前建立的 Job 不受影響。
你可以根據檢查 Job 是否含有 `batch.kubernetes.io/job-tracking` 註解，來確定 Job 控制器是否正在使用 Pod Finalizer 追蹤 Job。
你**不**應該給 Job 手動新增或刪除該註解。

<!--
## Alternatives

### Bare Pods

When the node that a Pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new Pods to replace terminated ones.
For this reason, we recommend that you use a Job rather than a bare Pod, even if your application
requires only a single Pod.
-->
## 替代方案  {#alternatives}

### 裸 Pod  {#bare-pods}

當 Pod 執行所在的節點重啟或者失敗，Pod 會被終止並且不會被重啟。
Job 會重新建立新的 Pod 來替代已終止的 Pod。
因為這個原因，我們建議你使用 Job 而不是獨立的裸 Pod，
即使你的應用僅需要一個 Pod。

<!--
### Replication Controller

Jobs are complementary to [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/).
A Replication Controller manages Pods which are not expected to terminate (e.g. web servers), and a Job
manages Pods that are expected to terminate (e.g. batch tasks).

As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate
for pods with `RestartPolicy` equal to `OnFailure` or `Never`.
(Note: If `RestartPolicy` is not set, the default value is `Always`.)
-->
### 副本控制器    {#replication-controller}

Job 與[副本控制器](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)是彼此互補的。
副本控制器管理的是那些不希望被終止的 Pod （例如，Web 伺服器），
Job 管理的是那些希望被終止的 Pod（例如，批處理作業）。

正如在 [Pod 生命期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/) 中討論的，
`Job` 僅適合於 `restartPolicy` 設定為 `OnFailure` 或 `Never` 的 Pod。
注意：如果 `restartPolicy` 未設定，其預設值是 `Always`。

<!--
### Single Job starts controller Pod

Another pattern is for a single Job to create a Pod which then creates other Pods, acting as a sort
of custom controller for those Pods.  This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.
-->
### 單個 Job 啟動控制器 Pod    {#single-job-starts-controller-pod}

另一種模式是用唯一的 Job 來建立 Pod，而該 Pod 負責啟動其他 Pod，因此扮演了一種
後啟動 Pod 的控制器的角色。
這種模式的靈活性更高，但是有時候可能會把事情搞得很複雜，很難入門，
並且與 Kubernetes 的整合度很低。

<!--
One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)), runs a spark
driver, and then cleans up.

An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but maintains complete control over what Pods are created and how work is assigned to them.
-->
這種模式的例項之一是用 Job 來啟動一個執行指令碼的 Pod，指令碼負責啟動 Spark
主控制器（參見 [Spark 示例](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)），
執行 Spark 驅動，之後完成清理工作。

這種方法的優點之一是整個過程得到了 Job 物件的完成保障，
同時維持了對建立哪些 Pod、如何向其分派工作的完全控制能力，

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* Read about different ways of running Jobs:
   * [Coarse Parallel Processing Using a Work Queue](/docs/tasks/job/coarse-parallel-processing-work-queue/)
   * [Fine Parallel Processing Using a Work Queue](/docs/tasks/job/fine-parallel-processing-work-queue/)
   * Use an [indexed Job for parallel processing with static work assignment](/docs/tasks/job/indexed-parallel-processing-static/) (beta)
   * Create multiple Jobs based on a template: [Parallel Processing using Expansions](/docs/tasks/job/parallel-processing-expansion/)
* Follow the links within [Clean up finished jobs automatically](#clean-up-finished-jobs-automatically)
  to learn more about how your cluster can clean up completed and / or failed tasks.
* `Job` is part of the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/job-v1" >}}
  object definition to understand the API for jobs.
* Read about [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/), which you
  can use to define a series of Jobs that will run based on a schedule, similar to
  the UNIX tool `cron`.
-->
* 瞭解 [Pods](/zh-cn/docs/concepts/workloads/pods)。
* 瞭解執行 Job 的不同的方式：
  * [使用工作佇列進行粗粒度並行處理](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/)
  * [使用工作佇列進行精細的並行處理](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)
  * [使用索引作業完成靜態工作分配下的並行處理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)（Beta 階段）
  * 基於一個模板執行多個 Job：[使用展開的方式進行並行處理](/zh-cn/docs/tasks/job/parallel-processing-expansion/)
* 跟隨[自動清理完成的 Job](#clean-up-finished-jobs-automatically) 文中的連結，瞭解你的叢集如何清理完成和失敗的任務。
* `Job` 是 Kubernetes REST API 的一部分。閱讀 {{< api-reference page="workload-resources/job-v1" >}}
   物件定義理解關於該資源的 API。
* 閱讀 [`CronJob`](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，它允許你定義一系列定期執行的 Job，類似於 UNIX 工具 `cron`。
