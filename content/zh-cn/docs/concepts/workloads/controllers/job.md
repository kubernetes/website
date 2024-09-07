---
title: Job
content_type: concept
description: >-
  Job 表示一次性任务，运行完成后就会停止。
feature:
  title: 批量执行
  description: >
    除了服务之外，Kubernetes 还可以管理你的批处理和 CI 工作负载，在期望时替换掉失效的容器。
weight: 50
hide_summary: true # 在章节索引中单独列出
---
<!--
reviewers:
- alculquicondor
- erictune
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

A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example
due to a node hardware failure or a node reboot).

You can also use a Job to run multiple Pods in parallel.

If you want to run a Job (either a single task, or several in parallel) on a schedule,
see [CronJob](/docs/concepts/workloads/controllers/cron-jobs/).
-->
Job 会创建一个或者多个 Pod，并将继续重试 Pod 的执行，直到指定数量的 Pod 成功终止。
随着 Pod 成功结束，Job 跟踪记录成功完成的 Pod 个数。
当数量达到指定的成功个数阈值时，任务（即 Job）结束。
删除 Job 的操作会清除所创建的全部 Pod。
挂起 Job 的操作会删除 Job 的所有活跃 Pod，直到 Job 被再次恢复执行。

一种简单的使用场景下，你会创建一个 Job 对象以便以一种可靠的方式运行某 Pod 直到完成。
当第一个 Pod 失败或者被删除（比如因为节点硬件失效或者重启）时，Job
对象会启动一个新的 Pod。

你也可以使用 Job 以并行的方式运行多个 Pod。

如果你想按某种排期表（Schedule）运行 Job（单个任务或多个并行任务），请参阅
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)。

<!-- body -->

<!--
## Running an example Job

Here is an example Job config. It computes π to 2000 places and prints it out.
It takes around 10s to complete.
-->
## 运行示例 Job     {#running-an-example-job}

下面是一个 Job 配置示例。它负责计算 π 到小数点后 2000 位，并将结果打印出来。
此计算大约需要 10 秒钟完成。

{{% code_sample file="controllers/job.yaml" %}}

<!--
You can run the example with this command:
-->
你可以使用下面的命令来运行此示例：

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```
job.batch/pi created
```

<!--
Check on the status of the Job with `kubectl`:
-->
使用 `kubectl` 来检查 Job 的状态：

{{< tabs name="Check status of Job" >}}
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
要查看 Job 对应的已完成的 Pod，可以执行 `kubectl get pods`。

要以机器可读的方式列举隶属于某 Job 的全部 Pod，你可以使用类似下面这条命令：

```shell
pods=$(kubectl get pods --selector=batch.kubernetes.io/job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

<!--
The output is similar to this:
-->
输出类似于：

```
pi-5rwd7
```

<!--
Here, the selector is the same as the selector for the Job. The `--output=jsonpath` option specifies an expression
with the name from each Pod in the returned list.

View the standard output of one of the pods:
-->
这里，选择算符与 Job 的选择算符相同。`--output=jsonpath` 选项给出了一个表达式，
用来从返回的列表中提取每个 Pod 的 name 字段。

查看其中一个 Pod 的标准输出：

```shell
kubectl logs $pods
```

<!--
Another way to view the logs of a Job:
-->
另外一种查看 Job 日志的方法：

```shell
kubectl logs jobs/pi
```

<!--
The output is similar to this:
-->
输出类似于：

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
## 编写 Job 规约    {#writing-a-job-spec}

与 Kubernetes 中其他资源的配置类似，Job 也需要 `apiVersion`、`kind` 和 `metadata` 字段。

当控制面为 Job 创建新的 Pod 时，Job 的 `.metadata.name` 是命名这些 Pod 的基础组成部分。
Job 的名字必须是合法的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)值，
但这可能对 Pod 主机名产生意料之外的结果。为了获得最佳兼容性，此名字应遵循更严格的
[DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)规则。
即使该名字被要求遵循 DNS 子域名规则，也不得超过 63 个字符。

Job 配置还需要一个 [`.spec` 节](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Job Labels
-->
### Job 标签

<!--
Job labels will have `batch.kubernetes.io/` prefix for `job-name` and `controller-uid`.
-->
Job 标签将为 `job-name` 和 `controller-uid` 加上 `batch.kubernetes.io/` 前缀。

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

字段 `.spec.template` 的值是一个 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
其定义规范与 {{< glossary_tooltip text="Pod" term_id="pod" >}}
完全相同，只是其中不再需要 `apiVersion` 或 `kind` 字段。

除了作为 Pod 所必需的字段之外，Job 中的 Pod 模板必须设置合适的标签
（参见 [Pod 选择算符](#pod-selector)）和合适的重启策略。

Job 中 Pod 的 [`RestartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
只能设置为 `Never` 或 `OnFailure` 之一。

<!--
### Pod selector

The `.spec.selector` field is optional. In almost all cases you should not specify it.
See section [specifying your own pod selector](#specifying-your-own-pod-selector).
-->
### Pod 选择算符   {#pod-selector}

字段 `.spec.selector` 是可选的。在绝大多数场合，你都不需要为其赋值。
参阅[设置自己的 Pod 选择算符](#specifying-your-own-pod-selector)。

<!--
### Parallel execution for Jobs {#parallel-jobs}

There are three main types of task suitable to run as a Job:
-->
### Job 的并行执行 {#parallel-jobs}

适合以 Job 形式来运行的任务主要有三种：

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
1. 非并行 Job：
   - 通常只启动一个 Pod，除非该 Pod 失败。
   - 当 Pod 成功终止时，立即视 Job 为完成状态。
1. 具有**确定完成计数**的并行 Job：
   - `.spec.completions` 字段设置为非 0 的正数值。
   - Job 用来代表整个任务，当成功的 Pod 个数达到 `.spec.completions` 时，Job 被视为完成。
   - 当使用 `.spec.completionMode="Indexed"` 时，每个 Pod 都会获得一个不同的
     索引值，介于 0 和 `.spec.completions-1` 之间。
1. 带**工作队列**的并行 Job：
   - 不设置 `spec.completions`，默认值为 `.spec.parallelism`。
   - 多个 Pod 之间必须相互协调，或者借助外部服务确定每个 Pod 要处理哪个工作条目。
     例如，任一 Pod 都可以从工作队列中取走最多 N 个工作条目。
   - 每个 Pod 都可以独立确定是否其它 Pod 都已完成，进而确定 Job 是否完成。
   - 当 Job 中**任何** Pod 成功终止，不再创建新 Pod。
   - 一旦至少 1 个 Pod 成功完成，并且所有 Pod 都已终止，即可宣告 Job 成功完成。
   - 一旦任何 Pod 成功退出，任何其它 Pod 都不应再对此任务执行任何操作或生成任何输出。
     所有 Pod 都应启动退出过程。

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
对于**非并行**的 Job，你可以不设置 `spec.completions` 和 `spec.parallelism`。
这两个属性都不设置时，均取默认值 1。

对于**确定完成计数**类型的 Job，你应该设置 `.spec.completions` 为所需要的完成个数。
你可以设置 `.spec.parallelism`，也可以不设置。其默认值为 1。

对于一个**工作队列** Job，你不可以设置 `.spec.completions`，但要将`.spec.parallelism`
设置为一个非负整数。

关于如何利用不同类型的 Job 的更多信息，请参见 [Job 模式](#job-patterns)一节。

<!--
#### Controlling parallelism

The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.

Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety of reasons:
-->
#### 控制并行性   {#controlling-parallelism}

并行性请求（`.spec.parallelism`）可以设置为任何非负整数。
如果未设置，则默认为 1。
如果设置为 0，则 Job 相当于启动之后便被暂停，直到此值被增加。

实际并行性（在任意时刻运行状态的 Pod 个数）可能比并行性请求略大或略小，
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
- 对于**确定完成计数** Job，实际上并行执行的 Pod 个数不会超出剩余的完成数。
  如果 `.spec.parallelism` 值较高，会被忽略。
- 对于**工作队列** Job，有任何 Job 成功结束之后，不会有新的 Pod 启动。
  不过，剩下的 Pod 允许执行完毕。
- 如果 Job {{< glossary_tooltip text="控制器" term_id="controller" >}} 没有来得及作出响应，或者
- 如果 Job 控制器因为任何原因（例如，缺少 `ResourceQuota` 或者没有权限）无法创建 Pod。
  Pod 个数可能比请求的数目小。
- Job 控制器可能会因为之前同一 Job 中 Pod 失效次数过多而压制新 Pod 的创建。
- 当 Pod 处于体面终止进程中，需要一定时间才能停止。

<!--
### Completion mode
-->
### 完成模式   {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Jobs with _fixed completion count_ - that is, jobs that have non null
`.spec.completions` - can have a completion mode that is specified in `.spec.completionMode`:
-->
带有**确定完成计数**的 Job，即 `.spec.completions` 不为 null 的 Job，
都可以在其 `.spec.completionMode` 中设置完成模式：

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
- `NonIndexed`（默认值）：当成功完成的 Pod 个数达到 `.spec.completions` 所
  设值时认为 Job 已经完成。换言之，每个 Job 完成事件都是独立无关且同质的。
  要注意的是，当 `.spec.completions` 取值为 null 时，Job 被隐式处理为 `NonIndexed`。
- `Indexed`：Job 的 Pod 会获得对应的完成索引，取值为 0 到 `.spec.completions-1`。
  该索引可以通过四种方式获取：
  - Pod 注解 `batch.kubernetes.io/job-completion-index`。
  - Pod 标签 `batch.kubernetes.io/job-completion-index`（适用于 v1.28 及更高版本）。
    请注意，必须启用 `PodIndexLabel` 特性门控才能使用此标签，默认被启用。
  - 作为 Pod 主机名的一部分，遵循模式 `$(job-name)-$(index)`。
    当你同时使用带索引的 Job（Indexed Job）与 {{< glossary_tooltip term_id="Service" >}}，
    Job 中的 Pod 可以通过 DNS 使用确切的主机名互相寻址。
    有关如何配置的更多信息，请参阅[带 Pod 间通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/)。
  - 对于容器化的任务，在环境变量 `JOB_COMPLETION_INDEX` 中。

  <!--
  The Job is considered complete when there is one successfully completed Pod
  for each index. For more information about how to use this mode, see
  [Indexed Job for Parallel Processing with Static Work Assignment](/docs/tasks/job/indexed-parallel-processing-static/).
  -->
  当每个索引都对应一个成功完成的 Pod 时，Job 被认为是已完成的。
  关于如何使用这种模式的更多信息，可参阅
  [用带索引的 Job 执行基于静态任务分配的并行处理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)。

{{< note >}}
<!--
Although rare, more than one Pod could be started for the same index (due to various reasons such as node failures,
kubelet restarts, or Pod evictions). In this case, only the first Pod that completes successfully will
count towards the completion count and update the status of the Job. The other Pods that are running
or completed for the same index will be deleted by the Job controller once they are detected.
-->
带同一索引值启动的 Pod 可能不止一个（由于节点故障、kubelet
重启或 Pod 驱逐等各种原因），尽管这种情况很少发生。
在这种情况下，只有第一个成功完成的 Pod 才会被记入完成计数中并更新作业的状态。
其他为同一索引值运行或完成的 Pod 一旦被检测到，将被 Job 控制器删除。
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
## 处理 Pod 和容器失效    {#handling-pod-and-container-failures}

Pod 中的容器可能因为多种不同原因失效，例如因为其中的进程退出时返回值非零，
或者容器因为超出内存约束而被杀死等等。
如果发生这类事件，并且 `.spec.template.spec.restartPolicy = "OnFailure"`，
Pod 则继续留在当前节点，但容器会被重新运行。
因此，你的程序需要能够处理在本地被重启的情况，或者要设置
`.spec.template.spec.restartPolicy = "Never"`。
关于 `restartPolicy` 的更多信息，可参阅
[Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#example-states)。

<!--
An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`. When a Pod fails, then the Job controller
starts a new Pod. This means that your application needs to handle the case when it is restarted in a new
pod. In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.
-->
整个 Pod 也可能会失败，且原因各不相同。
例如，当 Pod 启动时，节点失效（被升级、被重启、被删除等）或者其中的容器失败而
`.spec.template.spec.restartPolicy = "Never"`。
当 Pod 失败时，Job 控制器会启动一个新的 Pod。
这意味着，你的应用需要处理在一个新 Pod 中被重启的情况。
尤其是应用需要处理之前运行所产生的临时文件、锁、不完整的输出等问题。

<!--
By default, each pod failure is counted towards the `.spec.backoffLimit` limit,
see [pod backoff failure policy](#pod-backoff-failure-policy). However, you can
customize handling of pod failures by setting the Job's [pod failure policy](#pod-failure-policy).
-->
默认情况下，每个 Pod 失效都被计入 `.spec.backoffLimit` 限制，
请参阅 [Pod 回退失效策略](#pod-backoff-failure-policy)。
但你可以通过设置 Job 的 [Pod 失效策略](#pod-failure-policy)自定义对 Pod 失效的处理方式。

<!--
Additionally, you can choose to count the pod failures independently for each
index of an [Indexed](#completion-mode) Job by setting the `.spec.backoffLimitPerIndex` field
(for more information, see [backoff limit per index](#backoff-limit-per-index)).
-->
此外，你可以通过设置 `.spec.backoffLimitPerIndex` 字段，
选择为 [Indexed](#completion-mode) Job 的每个索引独立计算 Pod 失败次数
（细节参阅[逐索引的回退限制](#backoff-limit-per-index)）。

<!--
Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.

If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once. Therefore, your pods must also be tolerant of concurrency.
-->
注意，即使你将 `.spec.parallelism` 设置为 1，且将 `.spec.completions` 设置为
1，并且 `.spec.template.spec.restartPolicy` 设置为 "Never"，同一程序仍然有可能被启动两次。

如果你确实将 `.spec.parallelism` 和 `.spec.completions` 都设置为比 1 大的值，
那就有可能同时出现多个 Pod 运行的情况。
为此，你的 Pod 也必须能够处理并发性问题。

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
当你指定了 `.spec.podFailurePolicy` 字段，
Job 控制器不会将终止过程中的 Pod（已设置 `.metadata.deletionTimestamp` 字段的 Pod）视为失效 Pod，
直到该 Pod 完全终止（其 `.status.phase` 为 `Failed` 或 `Succeeded`）。
但只要终止变得显而易见，Job 控制器就会创建一个替代的 Pod。一旦 Pod 终止，Job 控制器将把这个刚终止的
Pod 考虑在内，评估相关 Job 的 `.backoffLimit` 和 `.podFailurePolicy`。

如果不满足任一要求，即使 Pod 稍后以 `phase: "Succeeded"` 终止，Job 控制器也会将此即将终止的 Pod 计为立即失效。

<!--
### Pod backoff failure policy

There are situations where you want to fail a Job after some amount of retries
due to a logical error in configuration etc.
To do so, set `.spec.backoffLimit` to specify the number of retries before
considering a Job as failed. The back-off limit is set by default to 6. Failed
Pods associated with the Job are recreated by the Job controller with an
exponential back-off delay (10s, 20s, 40s ...) capped at six minutes.

The number of retries is calculated in two ways:

- The number of Pods with `.status.phase = "Failed"`.
- When using `restartPolicy = "OnFailure"`, the number of retries in all the
  containers of Pods with `.status.phase` equal to `Pending` or `Running`.

If either of the calculations reaches the `.spec.backoffLimit`, the Job is
considered failed.
-->
### Pod 回退失效策略    {#pod-backoff-failure-policy}

在有些情形下，你可能希望 Job 在经历若干次重试之后直接进入失败状态，
因为这很可能意味着遇到了配置错误。
为了实现这点，可以将 `.spec.backoffLimit` 设置为视 Job 为失败之前的重试次数。
失效回退的限制值默认为 6。
与 Job 相关的失效的 Pod 会被 Job 控制器重建，回退重试时间将会按指数增长
（从 10 秒、20 秒到 40 秒）最多至 6 分钟。

计算重试次数有以下两种方法：
- 计算 `.status.phase = "Failed"` 的 Pod 数量。
- 当 Pod 的 `restartPolicy = "OnFailure"` 时，针对 `.status.phase` 等于 `Pending` 或
  `Running` 的 Pod，计算其中所有容器的重试次数。

如果两种方式其中一个的值达到 `.spec.backoffLimit`，则 Job 被判定为失败。

{{< note >}}
<!--
If your job has `restartPolicy = "OnFailure"`, keep in mind that your Pod running the Job
will be terminated once the job backoff limit has been reached. This can make debugging
the Job's executable more difficult. We suggest setting
`restartPolicy = "Never"` when debugging the Job or using a logging system to ensure output
from failed Jobs is not lost inadvertently.
-->
如果你的 Job 的 `restartPolicy` 被设置为 "OnFailure"，就要注意运行该 Job 的 Pod
会在 Job 到达失效回退次数上限时自动被终止。
这会使得调试 Job 中可执行文件的工作变得非常棘手。
我们建议在调试 Job 时将 `restartPolicy` 设置为 "Never"，
或者使用日志系统来确保失效 Job 的输出不会意外遗失。
{{< /note >}}

<!--
### Backoff limit per index {#backoff-limit-per-index}
-->
### 逐索引的回退限制    {#backoff-limit-per-index}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
<!--
You can only configure the backoff limit per index for an [Indexed](#completion-mode) Job, if you
have the `JobBackoffLimitPerIndex` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled in your cluster.
-->
只有在集群中启用了 `JobBackoffLimitPerIndex`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
才能为 [Indexed](#completion-mode) Job 配置逐索引的回退限制。
{{< /note >}}

<!--
When you run an [indexed](#completion-mode) Job, you can choose to handle retries
for pod failures independently for each index. To do so, set the
`.spec.backoffLimitPerIndex` to specify the maximal number of pod failures
per index.
-->
运行 [Indexed](#completion-mode) Job 时，你可以选择对每个索引独立处理 Pod 失败的重试。
为此，可以设置 `.spec.backoffLimitPerIndex` 来指定每个索引的最大 Pod 失败次数。

<!--
When the per-index backoff limit is exceeded for an index, Kubernetes considers the index as failed and adds it to the
`.status.failedIndexes` field. The succeeded indexes, those with a successfully
executed pods, are recorded in the `.status.completedIndexes` field, regardless of whether you set
the `backoffLimitPerIndex` field.
-->
当某个索引超过逐索引的回退限制后，Kubernetes 将视该索引为已失败，并将其添加到 `.status.failedIndexes` 字段中。
无论你是否设置了 `backoffLimitPerIndex` 字段，已成功执行的索引（具有成功执行的 Pod）将被记录在
`.status.completedIndexes` 字段中。

<!--
Note that a failing index does not interrupt execution of other indexes.
Once all indexes finish for a Job where you specified a backoff limit per index,
if at least one of those indexes did fail, the Job controller marks the overall
Job as failed, by setting the Failed condition in the status. The Job gets
marked as failed even if some, potentially nearly all, of the indexes were
processed successfully.
-->
请注意，失败的索引不会中断其他索引的执行。一旦在指定了逐索引回退限制的 Job 中的所有索引完成，
如果其中至少有一个索引失败，Job 控制器会通过在状态中设置 Failed 状况将整个 Job 标记为失败。
即使其中一些（可能几乎全部）索引已被成功处理，该 Job 也会被标记为失败。

<!--
You can additionally limit the maximal number of indexes marked failed by
setting the `.spec.maxFailedIndexes` field.
When the number of failed indexes exceeds the `maxFailedIndexes` field, the
Job controller triggers termination of all remaining running Pods for that Job.
Once all pods are terminated, the entire Job is marked failed by the Job
controller, by setting the Failed condition in the Job status.
-->
你还可以通过设置 `.spec.maxFailedIndexes` 字段来限制标记为失败的最大索引数。
当失败的索引数量超过 `maxFailedIndexes` 字段时，Job 控制器会对该 Job
的运行中的所有余下 Pod 触发终止操作。一旦所有 Pod 被终止，Job 控制器将通过设置 Job
状态中的 Failed 状况将整个 Job 标记为失败。

<!--
Here is an example manifest for a Job that defines a `backoffLimitPerIndex`:
-->
以下是定义 `backoffLimitPerIndex` 的 Job 示例清单：

{{% code_sample file="/controllers/job-backoff-limit-per-index-example.yaml" %}}

<!--
In the example above, the Job controller allows for one restart for each
of the indexes. When the total number of failed indexes exceeds 5, then
the entire Job is terminated.

Once the job is finished, the Job status looks as follows:
-->
在上面的示例中，Job 控制器允许每个索引重新启动一次。
当失败的索引总数超过 5 个时，整个 Job 将被终止。

Job 完成后，该 Job 的状态如下所示：

```sh
kubectl get -o yaml job job-backoff-limit-per-index-example
```

<!--
# 1 succeeded pod for each of 5 succeeded indexes
# 2 failed pods (1 retry) for each of 5 failed indexes
-->
```yaml
  status:
    completedIndexes: 1,3,5,7,9
    failedIndexes: 0,2,4,6,8
    succeeded: 5          # 每 5 个成功的索引有 1 个成功的 Pod
    failed: 10            # 每 5 个失败的索引有 2 个失败的 Pod（1 次重试）
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
Job 控制器添加 `FailureTarget` Job 状况来触发 [Job 终止和清理](#job-termination-and-cleanup)。
当所有 Job Pod 都终止时，Job 控制器会添加 `Failed` 状况，
其 `reason` 和 `message` 的值与 `FailureTarget` Job 状况相同。
有关详细信息，请参阅 [Job Pod 的终止](#termination-of-job-pods)。

<!--
Additionally, you may want to use the per-index backoff along with a
[pod failure policy](#pod-failure-policy). When using
per-index backoff, there is a new `FailIndex` action available which allows you to
avoid unnecessary retries within an index.
-->
此外，你可能想要结合使用逐索引回退与 [Pod 失效策略](#pod-failure-policy)。
在使用逐索引回退时，有一个新的 `FailIndex` 操作可用，它让你避免就某个索引进行不必要的重试。

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
Pod 失效策略使用 `.spec.podFailurePolicy` 字段来定义，
它能让你的集群根据容器的退出码和 Pod 状况来处理 Pod 失效事件。

<!--
In some situations, you  may want to have a better control when handling Pod
failures than the control provided by the [Pod backoff failure policy](#pod-backoff-failure-policy),
which is based on the Job's `.spec.backoffLimit`. These are some examples of use cases:
-->
在某些情况下，你可能希望更好地控制 Pod 失效的处理方式，
而不是仅限于 [Pod 回退失效策略](#pod-backoff-failure-policy)所提供的控制能力，
后者是基于 Job 的 `.spec.backoffLimit` 实现的。以下是一些使用场景：

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
* 通过避免不必要的 Pod 重启来优化工作负载的运行成本，
  你可以在某 Job 中一个 Pod 失效且其退出码表明存在软件错误时立即终止该 Job。
* 为了保证即使有干扰也能完成 Job，你可以忽略由干扰导致的 Pod 失效
  （例如{{< glossary_tooltip text="抢占" term_id="preemption" >}}、
  {{< glossary_tooltip text="通过 API 发起的驱逐" term_id="api-eviction" >}}
  或基于{{< glossary_tooltip text="污点" term_id="taint" >}}的驱逐），
  这样这些失效就不会被计入 `.spec.backoffLimit` 的重试限制中。

<!--
You can configure a Pod failure policy, in the `.spec.podFailurePolicy` field,
to meet the above use cases. This policy can handle Pod failures based on the
container exit codes and the Pod conditions.
-->
你可以在 `.spec.podFailurePolicy` 字段中配置 Pod 失效策略，以满足上述使用场景。
该策略可以根据容器退出码和 Pod 状况来处理 Pod 失效。

<!--
Here is a manifest for a Job that defines a `podFailurePolicy`:
-->
下面是一个定义了 `podFailurePolicy` 的 Job 的清单：

{{% code_sample file="/controllers/job-pod-failure-policy-example.yaml" %}}

<!--
In the example above, the first rule of the Pod failure policy specifies that
the Job should be marked failed if the `main` container fails with the 42 exit
code. The following are the rules for the `main` container specifically:
-->
在上面的示例中，Pod 失效策略的第一条规则规定如果 `main` 容器失败并且退出码为 42，
Job 将被标记为失败。以下是 `main` 容器的具体规则：

<!--
- an exit code of 0 means that the container succeeded
- an exit code of 42 means that the **entire Job** failed
- any other exit code represents that the container failed, and hence the entire
  Pod. The Pod will be re-created if the total number of restarts is
  below `backoffLimit`. If the `backoffLimit` is reached the **entire Job** failed.
-->
- 退出码 0 代表容器成功
- 退出码 42 代表**整个 Job** 失败
- 所有其他退出码都代表容器失败，同时也代表着整个 Pod 失效。
  如果重启总次数低于 `backoffLimit` 定义的次数，则会重新启动 Pod，
  如果等于 `backoffLimit` 所设置的次数，则代表**整个 Job** 失效。

{{< note >}}
<!--
Because the Pod template specifies a `restartPolicy: Never`,
the kubelet does not restart the `main` container in that particular Pod.
-->
因为 Pod 模板中指定了 `restartPolicy: Never`，
所以 kubelet 将不会重启 Pod 中的 `main` 容器。
{{< /note >}}

<!--
The second rule of the Pod failure policy, specifying the `Ignore` action for
failed Pods with condition `DisruptionTarget` excludes Pod disruptions from
being counted towards the `.spec.backoffLimit` limit of retries.
-->
Pod 失效策略的第二条规则，
指定对于状况为 `DisruptionTarget` 的失效 Pod 采取 `Ignore` 操作，
统计 `.spec.backoffLimit` 重试次数限制时不考虑 Pod 因干扰而发生的异常。

{{< note >}}
<!--
If the Job failed, either by the Pod failure policy or Pod backoff
failure policy, and the Job is running multiple Pods, Kubernetes terminates all
the Pods in that Job that are still Pending or Running.
-->
如果根据 Pod 失效策略或 Pod 回退失效策略判定 Pod 已经失效，
并且 Job 正在运行多个 Pod，Kubernetes 将终止该 Job 中仍处于 Pending 或 Running 的所有 Pod。
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
下面是此 API 的一些要求和语义：
- 如果你想在 Job 中使用 `.spec.podFailurePolicy` 字段，
  你必须将 Job 的 Pod 模板中的 `.spec.restartPolicy` 设置为 `Never`。
- 在 `spec.podFailurePolicy.rules` 中设定的 Pod 失效策略规则将按序评估。
  一旦某个规则与 Pod 失效策略匹配，其余规则将被忽略。
  当没有规则匹配 Pod 失效策略时，将会采用默认的处理方式。
- 你可能希望在 `spec.podFailurePolicy.rules[*].onExitCodes.containerName`
  中通过指定的名称限制只能针对特定容器应用对应的规则。
  如果不设置此属性，规则将适用于所有容器。
  如果指定了容器名称，它应该匹配 Pod 模板中的一个普通容器或一个初始容器（Init Container）。
- 你可以在 `spec.podFailurePolicy.rules[*].action` 指定当 Pod 失效策略发生匹配时要采取的操作。
  可能的值为：
  - `FailJob`：表示 Pod 的任务应标记为 Failed，并且所有正在运行的 Pod 应被终止。
  - `Ignore`：表示 `.spec.backoffLimit` 的计数器不应该增加，应该创建一个替换的 Pod。
  - `Count`：表示 Pod 应该以默认方式处理。`.spec.backoffLimit` 的计数器应该增加。
  - `FailIndex`：表示使用此操作以及[逐索引回退限制](#backoff-limit-per-index)来避免就失败的 Pod
    的索引进行不必要的重试。

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
当你使用 `podFailurePolicy` 时，Job 控制器只匹配处于 `Failed` 阶段的 Pod。
具有删除时间戳但不处于终止阶段（`Failed` 或 `Succeeded`）的 Pod 被视为仍在终止中。
这意味着终止中的 Pod 会保留一个[跟踪 Finalizer](#job-tracking-with-finalizers)，
直到到达终止阶段。
从 Kubernetes 1.27 开始，kubelet 将删除的 Pod 转换到终止阶段
（参阅 [Pod 阶段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)）。
这确保已删除的 Pod 的 Finalizer 被 Job 控制器移除。
{{< /note >}}

{{< note >}}
<!--
Starting with Kubernetes v1.28, when Pod failure policy is used, the Job controller recreates
terminating Pods only once these Pods reach the terminal `Failed` phase. This behavior is similar
to `podReplacementPolicy: Failed`. For more information, see [Pod replacement policy](#pod-replacement-policy).
-->
自 Kubernetes v1.28 开始，当使用 Pod 失效策略时，Job 控制器仅在这些 Pod 达到终止的
`Failed` 阶段时才会重新创建终止中的 Pod。这种行为类似于 `podReplacementPolicy: Failed`。
细节参阅 [Pod 替换策略](#pod-replacement-policy)。
{{< /note >}}

<!--
When you use the `podFailurePolicy`, and the Job fails due to the pod
matching the rule with the `FailJob` action, then the Job controller triggers
the Job termination process by adding the `FailureTarget` condition.
For more details, see [Job termination and cleanup](#job-termination-and-cleanup).
-->
当你使用了 `podFailurePolicy`，并且 Pod 因为与 `FailJob`
操作的规则匹配而失败时，Job 控制器会通过添加
`FailureTarget` 状况来触发 Job 终止流程。
更多详情，请参阅 [Job 的终止和清理](#job-termination-and-cleanup)。

<!--
## Success policy {#success-policy}
-->
## 成功策略   {#success-policy}

{{< feature-state feature_gate_name="JobSuccessPolicy" >}}

{{< note >}}
<!--
You can only configure a success policy for an Indexed Job if you have the
`JobSuccessPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled in your cluster.
-->
只有你在集群中启用了 `JobSuccessPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时，
才可以为带索引的 Job 配置成功策略。
{{< /note >}}

<!--
When creating an Indexed Job, you can define when a Job can be declared as succeeded using a `.spec.successPolicy`,
based on the pods that succeeded.

By default, a Job succeeds when the number of succeeded Pods equals `.spec.completions`.
These are some situations where you might want additional control for declaring a Job succeeded:
-->
你在创建带索引的 Job 时，可以基于成功的 Pod 个数使用 `.spec.successPolicy` 来定义 Job 何时可以被声明为成功。

默认情况下，当成功的 Pod 数等于 `.spec.completions` 时，则 Job 成功。
在以下一些情况下，你可能需要对何时声明 Job 成功作额外的控制：

<!--
* When running simulations with different parameters, 
  you might not need all the simulations to succeed for the overall Job to be successful.
* When following a leader-worker pattern, only the success of the leader determines the success or
  failure of a Job. Examples of this are frameworks like MPI and PyTorch etc.
-->
* 在使用不同的参数运行模拟任务时，你可能不需要所有模拟都成功就可以认为整个 Job 是成功的。
* 在遵循领导者与工作者模式时，只有领导者的成功才能决定 Job 成功或失败。
  这类框架的例子包括 MPI 和 PyTorch 等。

<!--
You can configure a success policy, in the `.spec.successPolicy` field,
to meet the above use cases. This policy can handle Job success based on the
succeeded pods. After the Job meets the success policy, the job controller terminates the lingering Pods.
A success policy is defined by rules. Each rule can take one of the following forms:
-->
你可以在 `.spec.successPolicy` 字段中配置成功策略，以满足上述使用场景。
此策略可以基于 Pod 的成功状况处理 Job 的成功状态。当 Job 满足成功策略后，Job 控制器会终止剩余的 Pod。
成功策略由规则进行定义。每条规则可以采用以下形式中的一种：

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
* 当你仅指定 `succeededIndexes` 时，一旦 `succeededIndexes` 中指定的所有索引成功，Job 控制器就会将 Job 标记为成功。
  `succeededIndexes` 必须是一个介于 0 和 `.spec.completions-1` 之间的间隔列表。
* 当你仅指定 `succeededCount` 时，一旦成功的索引数量达到 `succeededCount`，Job 控制器就会将 Job 标记为成功。
* 当你同时指定 `succeededIndexes` 和 `succeededCount` 时，一旦 `succeededIndexes`
  中指定的索引子集中的成功索引数达到 `succeededCount`，Job 控制器就会将 Job 标记为成功。

<!--
Note that when you specify multiple rules in the `.spec.successPolicy.rules`,
the job controller evaluates the rules in order. Once the Job meets a rule, the job controller ignores remaining rules.

Here is a manifest for a Job with `successPolicy`:
-->
请注意，当你在 `.spec.successPolicy.rules` 中指定多个规则时，Job 控制器会按顺序评估这些规则。
一旦 Job 符合某个规则，Job 控制器将忽略剩余的规则。

以下是一个带有 `successPolicy` 的 Job 的清单：

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
因此，当指定的索引 0、2 或 3 中的任意一个成功时，Job 控制器将 Job 标记为成功并终止剩余的 Pod。
符合成功策略的 Job 会被标记 `SuccessCriteriaMet` 状况，且状况的原因为 `SuccessPolicy`。
在剩余的 Pod 被移除后，Job 会被标记 `Complete` 状况。

请注意，`succeededIndexes` 表示为以连字符分隔的数字序列。
所表达的数值为一个序列，连字符所连接的为列表中第一个元素和最后一个元素。

{{< note >}}
<!--
When you specify both a success policy and some terminating policies such as `.spec.backoffLimit` and `.spec.podFailurePolicy`,
once the Job meets either policy, the job controller respects the terminating policy and ignores the success policy.
-->
当你同时设置了成功策略和 `.spec.backoffLimit` 和 `.spec.podFailurePolicy` 这类终止策略时，
一旦 Job 符合任一策略，Job 控制器将按终止策略处理，忽略成功策略。
{{< /note >}}

<!--
## Job termination and cleanup

When a Job completes, no more Pods are created, but the Pods are [usually](#pod-backoff-failure-policy) not deleted either.
Keeping them around allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status. It is up to the user to delete
old jobs after noting their status. Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`).
When you delete the job using `kubectl`, all the pods it created are deleted too.
-->
## Job 终止与清理    {#job-termination-and-cleanup}

Job 完成时不会再创建新的 Pod，不过已有的 Pod [通常](#pod-backoff-failure-policy)也不会被删除。
保留这些 Pod 使得你可以查看已完成的 Pod 的日志输出，以便检查错误、警告或者其它诊断性输出。
Job 完成时 Job 对象也一样被保留下来，这样你就可以查看它的状态。
在查看了 Job 状态之后删除老的 Job 的操作留给了用户自己。
你可以使用 `kubectl` 来删除 Job（例如，`kubectl delete jobs/pi`
或者 `kubectl delete -f ./job.yaml`）。
当使用 `kubectl` 来删除 Job 时，该 Job 所创建的 Pod 也会被删除。

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
默认情况下，Job 会持续运行，除非某个 Pod 失败（`restartPolicy=Never`）
或者某个容器出错退出（`restartPolicy=OnFailure`）。
这时，Job 基于前述的 `spec.backoffLimit` 来决定是否以及如何重试。
一旦重试次数到达 `.spec.backoffLimit` 所设的上限，Job 会被标记为失败，
其中运行的 Pod 都会被终止。

终止 Job 的另一种方式是设置一个活跃期限。
你可以为 Job 的 `.spec.activeDeadlineSeconds` 设置一个秒数值。
该值适用于 Job 的整个生命期，无论 Job 创建了多少个 Pod。
一旦 Job 运行时间达到 `activeDeadlineSeconds` 秒，其所有运行中的 Pod 都会被终止，
并且 Job 的状态更新为 `type: Failed` 及 `reason: DeadlineExceeded`。

<!--
Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`.
Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once
it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.

Example:
-->
注意 Job 的 `.spec.activeDeadlineSeconds` 优先级高于其 `.spec.backoffLimit` 设置。
因此，如果一个 Job 正在重试一个或多个失效的 Pod，该 Job 一旦到达
`activeDeadlineSeconds` 所设的时限即不再部署额外的 Pod，
即使其重试次数还未达到 `backoffLimit` 所设的限制。

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
注意 Job 规约和 Job 中的
[Pod 模板规约](/zh-cn/docs/concepts/workloads/pods/init-containers/#detailed-behavior)
都有 `activeDeadlineSeconds` 字段。
请确保你在合适的层次设置正确的字段。

还要注意的是，`restartPolicy` 对应的是 Pod，而不是 Job 本身：
一旦 Job 状态变为 `type: Failed`，就不会再发生 Job 重启的动作。
换言之，由 `.spec.activeDeadlineSeconds` 和 `.spec.backoffLimit` 所触发的 Job
终结机制都会导致 Job 永久性的失败，而这类状态都需要手工干预才能解决。

<!--
### Terminal Job conditions

A Job has two possible terminal states, each of which has a corresponding Job
condition:
* Succeeded:  Job condition `Complete`
* Failed: Job condition `Failed`
-->
### Job 终止状况   {#terminal-job-conditions}

一个 Job 有两种可能的终止状况，每种状况都有相应的 Job 状况：

* Succeeded：Job `Complete` 状况
* Failed：Job `Failed` 状况

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
Job 失败的原因如下：

- Pod 失败数量超出了 Job 规约中指定的 `.spec.backoffLimit`，
  详情请参见 [Pod 回退失效策略](#pod-backoff-failure-policy)。
- Job 运行时间超过了指定的 `.spec.activeDeadlineSeconds`。
- 使用 `.spec.backoffLimitPerIndex` 的索引 Job 出现索引失败。
  有关详细信息，请参阅[逐索引的回退限制](#backoff-limit-per-index)。
- Job 中失败的索引数量超出了指定的 `spec.maxFailedIndexes` 值，
  详情见[逐索引的回退限制](#backoff-limit-per-index)。
- 失败的 Pod 匹配了 `.spec.podFailurePolicy` 中定义的一条规则，该规则的动作为 FailJob。
  有关 Pod 失效策略规则如何影响故障评估的详细信息，请参阅 [Pod 失效策略](#pod-failure-policy)。

<!--
Jobs succeed for the following reasons:
- The number of succeeded Pods reached the specified `.spec.completions`
- The criteria specified in `.spec.successPolicy` are met. For details, see
  [Success policy](#success-policy).
-->
Pod 成功的原因如下：

- 成功的 Pod 的数量达到了指定的 `.spec.completions` 数量。
- `.spec.successPolicy` 中指定的标准已满足。详情请参见[成功策略](#success-policy)。

<!--
In Kubernetes v1.31 and later the Job controller delays the addition of the
terminal conditions,`Failed` or `Complete`, until all of the Job Pods are terminated.

In Kubernetes v1.30 and earlier, the Job controller added the `Complete` or the
`Failed` Job terminal conditions as soon as the Job termination process was
triggered and all Pod finalizers were removed. However, some Pods would still
be running or terminating at the moment that the terminal condition was added.
-->
在 Kubernetes v1.31 及更高版本中，Job 控制器会延迟添加终止状况 `Failed` 或
`Complete`，直到所有 Job Pod 都终止。

在 Kubernetes v1.30 及更早版本中，一旦触发 Job 终止过程并删除所有
Pod 终结器，Job 控制器就会给 Job 添加 `Complete` 或 `Failed` 终止状况。
然而，在添加终止状况时，一些 Pod 仍会运行或处于终止过程中。

<!--
In Kubernetes v1.31 and later, the controller only adds the Job terminal conditions
_after_ all of the Pods are terminated. You can enable this behavior by using the
`JobManagedBy` or the `JobPodReplacementPolicy` (enabled by default)
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
在 Kubernetes v1.31 及更高版本中，控制器仅在所有 Pod 终止后添加 Job 终止状况。
你可以使用 `JobManagedBy` 或 `JobPodReplacementPolicy`（默认启用）
启用此行为的[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
### Termination of Job pods

The Job controller adds the `FailureTarget` condition or the `SuccessCriteriaMet`
condition to the Job to trigger Pod termination after a Job meets either the
success or failure criteria.
-->
### Job Pod 的终止

Job 控制器将 `FailureTarget` 状况或 `SuccessCriteriaMet` 状况添加到
Job，以便在 Job 满足成功或失败标准后触发 Pod 终止。

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
诸如 `terminationGracePeriodSeconds` 之类的因素可能会增加从
Job 控制器添加 `FailureTarget` 状况或 `SuccessCriteriaMet` 状况到所有
Job Pod 终止并且 Job 控制器添加[终止状况](#terminal-job-conditions)（`Failed` 或 `Complete`）的这段时间量。

你可以使用 `FailureTarget` 或 `SuccessCriteriaMet`
状况来评估 Job 是否失败或成功，而无需等待控制器添加终止状况。

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
例如，你可能想要决定何时创建 Job 来替代某个已失败 Job。
如果在出现 `FailureTarget` 状况时替换失败的 Job，则替换 Job 启动得会更早，
但可能会导致失败的 Job 和替换 Job 的 Pod 同时处于运行状态，进而额外耗用计算资源。

或者，如果你的集群资源容量有限，你可以选择等到 Job 上出现 `Failed` 状况后再执行替换操作。
这样做会延迟替换 Job 的启动，不过通过等待所有失败的 Pod 都被删除，可以节省资源。

<!--
## Clean up finished jobs automatically

Finished Jobs are usually no longer needed in the system. Keeping them around in
the system will put pressure on the API server. If the Jobs are managed directly
by a higher level controller, such as
[CronJobs](/docs/concepts/workloads/controllers/cron-jobs/), the Jobs can be
cleaned up by CronJobs based on the specified capacity-based cleanup policy.

### TTL mechanism for finished Jobs
-->
## 自动清理完成的 Job   {#clean-up-finished-jobs-automatically}

完成的 Job 通常不需要留存在系统中。在系统中一直保留它们会给 API 服务器带来额外的压力。
如果 Job 由某种更高级别的控制器来管理，例如
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，
则 Job 可以被 CronJob 基于特定的根据容量裁定的清理策略清理掉。

### 已完成 Job 的 TTL 机制  {#ttl-mechanisms-for-finished-jobs}

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
自动清理已完成 Job （状态为 `Complete` 或 `Failed`）的另一种方式是使用由
[TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)所提供的 TTL 机制。
通过设置 Job 的 `.spec.ttlSecondsAfterFinished` 字段，可以让该控制器清理掉已结束的资源。

TTL 控制器清理 Job 时，会级联式地删除 Job 对象。
换言之，它会删除所有依赖的对象，包括 Pod 及 Job 本身。
注意，当 Job 被删除时，系统会考虑其生命周期保障，例如其 Finalizers。

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
Job `pi-with-ttl` 在结束 100 秒之后，可以成为被自动删除的对象。

如果该字段设置为 `0`，Job 在结束之后立即成为可被自动删除的对象。
如果该字段没有设置，Job 不会在结束之后被 TTL 控制器自动清除。

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
建议设置 `ttlSecondsAfterFinished` 字段，因为非托管任务
（是你直接创建的 Job，而不是通过其他工作负载 API（如 CronJob）间接创建的 Job）
的默认删除策略是 `orphanDependents`，这会导致非托管 Job 创建的 Pod 在该 Job 被完全删除后被保留。
即使{{< glossary_tooltip text="控制面" term_id="control-plane" >}}最终在 Pod 失效或完成后
对已删除 Job 中的这些 Pod 执行[垃圾收集](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)操作，
这些残留的 Pod 有时可能会导致集群性能下降，或者在最坏的情况下会导致集群因这种性能下降而离线。

<!--
You can use [LimitRanges](/docs/concepts/policy/limit-range/) and
[ResourceQuotas](/docs/concepts/policy/resource-quotas/) to place a
cap on the amount of resources that a particular namespace can
consume.
-->
你可以使用 [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 和
[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)，
设定一个特定名字空间可以消耗的资源上限。
{{< /note >}}

<!--
## Job patterns

The Job object can be used to process a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded,
ranges of keys in a NoSQL database to scan, and so on.
-->
## Job 模式  {#job-patterns}

Job 对象可以用来处理一组相互独立而又彼此关联的“工作条目”。
这类工作条目可能是要发送的电子邮件、要渲染的视频帧、要编解码的文件、NoSQL
数据库中要扫描的主键范围等等。

<!--
In a complex system, there may be multiple different sets of work items. Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.

There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:
-->
在一个复杂系统中，可能存在多个不同的工作条目集合。
这里我们仅考虑用户希望一起管理的工作条目集合之一：**批处理作业**。

并行计算的模式有好多种，每种都有自己的强项和弱点。这里要权衡的因素有：

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
- 每个工作条目对应一个 Job 或者所有工作条目对应同一 Job 对象。
  为每个工作条目创建一个 Job 的做法会给用户带来一些额外的负担，系统需要管理大量的 Job 对象。
  用一个 Job 对象来完成所有工作条目的做法更适合处理大量工作条目的场景。
- 创建数目与工作条目相等的 Pod 或者令每个 Pod 可以处理多个工作条目。
  当 Pod 个数与工作条目数目相等时，通常不需要在 Pod 中对现有代码和容器做较大改动；
  让每个 Pod 能够处理多个工作条目的做法更适合于工作条目数量较大的场合。
<!--
- Several approaches use a work queue. This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.
- When the Job is associated with a
  [headless Service](/docs/concepts/services-networking/service/#headless-services),
  you can enable the Pods within a Job to communicate with each other to
  collaborate in a computation.
-->
- 有几种技术都会用到工作队列。这意味着需要运行一个队列服务，
  并修改现有程序或容器使之能够利用该工作队列。
  与之比较，其他方案在修改现有容器化应用以适应需求方面可能更容易一些。
- 当 Job 与某个[无头 Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
  之间存在关联时，你可以让 Job 中的 Pod 之间能够相互通信，从而协作完成计算。

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
下面是对这些权衡的汇总，第 2 到 4 列对应上面的权衡比较。
模式的名称对应了相关示例和更详细描述的链接。

| 模式  | 单个 Job 对象 | Pod 数少于工作条目数？ | 直接使用应用无需修改? |
| ----- |:-------------:|:-----------------------:|:---------------------:|
| [每工作条目一 Pod 的队列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | ✓ | | 有时 |
| [Pod 数量可变的队列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | ✓ | ✓ |  |
| [静态任务分派的带索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | ✓ |  | ✓ |
| [带 Pod 间通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/)  | ✓ | 有时 | 有时 |
| [Job 模板扩展](/zh-cn/docs/tasks/job/parallel-processing-expansion/)  |  |  | ✓ |

<!--
When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
This means that all pods for a task will have the same command line and the same
image, the same volumes, and (almost) the same environment variables. These patterns
are different ways to arrange for pods to work on different things.

This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.
-->
当你使用 `.spec.completions` 来设置完成数时，Job 控制器所创建的每个 Pod
使用完全相同的 [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。
这意味着任务的所有 Pod 都有相同的命令行，都使用相同的镜像和数据卷，
甚至连环境变量都（几乎）相同。
这些模式是让每个 Pod 执行不同工作的几种不同形式。

下表显示的是每种模式下 `.spec.parallelism` 和 `.spec.completions` 所需要的设置。
其中，`W` 表示的是工作条目的个数。

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
| [每工作条目一 Pod 的队列](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/) | W | 任意值 |
| [Pod 数量可变的队列](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/) | 1 | 任意值 |
| [静态任务分派的带索引的 Job](/zh-cn/docs/tasks/job/indexed-parallel-processing-static) | W |  | 任意值 |
| [带 Pod 间通信的 Job](/zh-cn/docs/tasks/job/job-with-pod-to-pod-communication/) | W | W |
| [Job 模板扩展](/zh-cn/docs/tasks/job/parallel-processing-expansion/) | 1 | 应该为 1 |

<!--
## Advanced usage

### Suspending a Job
-->
## 高级用法   {#advanced-usage}

### 挂起 Job   {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
When a Job is created, the Job controller will immediately begin creating Pods
to satisfy the Job's requirements and will continue to do so until the Job is
complete. However, you may want to temporarily suspend a Job's execution and
resume it later, or start Jobs in suspended state and have a custom controller
decide later when to start them.
-->
Job 被创建时，Job 控制器会马上开始执行 Pod 创建操作以满足 Job 的需求，
并持续执行此操作直到 Job 完成为止。
不过你可能想要暂时挂起 Job 执行，或启动处于挂起状态的 Job，
并拥有一个自定义控制器以后再决定什么时候开始。

<!--
To suspend a Job, you can update the `.spec.suspend` field of
the Job to true; later, when you want to resume it again, update it to false.
Creating a Job with `.spec.suspend` set to true will create it in the suspended
state.
-->
要挂起一个 Job，你可以更新 `.spec.suspend` 字段为 true，
之后，当你希望恢复其执行时，将其更新为 false。
创建一个 `.spec.suspend` 被设置为 true 的 Job 本质上会将其创建为被挂起状态。

<!--
When a Job is resumed from suspension, its `.status.startTime` field will be
reset to the current time. This means that the `.spec.activeDeadlineSeconds`
timer will be stopped and reset when a Job is suspended and resumed.
-->
当 Job 被从挂起状态恢复执行时，其 `.status.startTime` 字段会被重置为当前的时间。
这意味着 `.spec.activeDeadlineSeconds` 计时器会在 Job 挂起时被停止，
并在 Job 恢复执行时复位。

<!--
When you suspend a Job, any running Pods that don't have a status of `Completed`
will be [terminated](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
with a SIGTERM signal. The Pod's graceful termination period will be honored and
your Pod must handle this signal in this period. This may involve saving
progress for later or undoing changes. Pods terminated this way will not count
towards the Job's `completions` count.
-->
当你挂起一个 Job 时，所有正在运行且状态不是 `Completed` 的 Pod
将被[终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)并附带
SIGTERM 信号。Pod 的体面终止期限会被考虑，不过 Pod 自身也必须在此期限之内处理完信号。
处理逻辑可能包括保存进度以便将来恢复，或者取消已经做出的变更等等。
Pod 以这种形式终止时，不会被记入 Job 的 `completions` 计数。

<!--
An example Job definition in the suspended state can be like so:
-->
处于被挂起状态的 Job 的定义示例可能是这样子：

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
你也可以使用命令行为 Job 打补丁来切换 Job 的挂起状态。

挂起一个活跃的 Job：

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":true}}'
```

<!--
Resume a suspended Job:
-->
恢复一个挂起的 Job：

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":false}}'
```

<!--
The Job's status can be used to determine if a Job is suspended or has been
suspended in the past:
-->
Job 的 `status` 可以用来确定 Job 是否被挂起，或者曾经被挂起。

```shell
kubectl get jobs/myjob -o yaml
```

<!--
# .metadata and .spec omitted
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
Job 的 "Suspended" 类型的状况在状态值为 "True" 时意味着 Job 正被挂起；
`lastTransitionTime` 字段可被用来确定 Job 被挂起的时长。
如果此状况字段的取值为 "False"，则 Job 之前被挂起且现在在运行。
如果 "Suspended" 状况在 `status` 字段中不存在，则意味着 Job 从未被停止执行。

当 Job 被挂起和恢复执行时，也会生成事件：

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
最后四个事件，特别是 "Suspended" 和 "Resumed" 事件，都是因为 `.spec.suspend`
字段值被改来改去造成的。在这两个事件之间，我们看到没有 Pod 被创建，不过当
Job 被恢复执行时，Pod 创建操作立即被重启执行。

<!--
### Mutable Scheduling Directives
-->
### 可变调度指令 {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
In most cases, a parallel job will want the pods to run with constraints,
like all in the same zone, or all either on GPU model x or y but not a mix of both.
-->
在大多数情况下，并行作业会希望 Pod 在一定约束条件下运行，
比如所有的 Pod 都在同一个区域，或者所有的 Pod 都在 GPU 型号 x 或 y 上，而不是两者的混合。

<!--
The [suspend](#suspending-a-job) field is the first step towards achieving those semantics. Suspend allows a
custom queue controller to decide when a job should start; However, once a job is unsuspended,
a custom queue controller has no influence on where the pods of a job will actually land.
-->
[suspend](#suspending-a-job) 字段是实现这些语义的第一步。
suspend 允许自定义队列控制器，以决定工作何时开始；然而，一旦工作被取消暂停，
自定义队列控制器对 Job 中 Pod 的实际放置位置没有影响。

<!--
This feature allows updating a Job's scheduling directives before it starts, which gives custom queue
controllers the ability to influence pod placement while at the same time offloading actual
pod-to-node assignment to kube-scheduler. This is allowed only for suspended Jobs that have never
been unsuspended before.
-->
此特性允许在 Job 开始之前更新调度指令，从而为定制队列提供影响 Pod
放置的能力，同时将 Pod 与节点间的分配关系留给 kube-scheduler 决定。
这一特性仅适用于之前从未被暂停过的、已暂停的 Job。
控制器能够影响 Pod 放置，同时参考实际 pod-to-node 分配给 kube-scheduler。
这仅适用于从未暂停的 Job。

<!--
The fields in a Job's pod template that can be updated are node affinity, node selector,
tolerations, labels, annotations and [scheduling gates](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/).
-->
Job 的 Pod 模板中可以更新的字段是节点亲和性、节点选择器、容忍、标签、注解和
[调度门控](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)。

<!--
### Specifying your own Pod selector

Normally, when you create a Job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the Job is created.
It picks a selector value that will not overlap with any other jobs.

However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the Job.
-->
### 指定你自己的 Pod 选择算符 {#specifying-your-own-pod-selector}

通常，当你创建一个 Job 对象时，你不会设置 `.spec.selector`。
系统的默认值填充逻辑会在创建 Job 时添加此字段。
它会选择一个不会与任何其他 Job 重叠的选择算符设置。

不过，有些场合下，你可能需要重载这个自动设置的选择算符。
为了实现这点，你可以手动设置 Job 的 `spec.selector` 字段。

<!--
Be very careful when doing this. If you specify a label selector which is not
unique to the pods of that Job, and which matches unrelated Pods, then pods of the unrelated
job may be deleted, or this Job may count other Pods as completing it, or one or both
Jobs may refuse to create Pods or run to completion. If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their Pods may behave
in unpredictable ways too. Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.
-->
做这个操作时请务必小心。
如果你所设定的标签选择算符并不唯一针对 Job 对应的 Pod 集合，
甚或该算符还能匹配其他无关的 Pod，这些无关的 Job 的 Pod 可能会被删除。
或者当前 Job 会将另外一些 Pod 当作是完成自身工作的 Pod，
又或者两个 Job 之一或者二者同时都拒绝创建 Pod，无法运行至完成状态。
如果所设置的算符不具有唯一性，其他控制器（如 RC 副本控制器）及其所管理的 Pod
集合可能会变得行为不可预测。
Kubernetes 不会在你设置 `.spec.selector` 时尝试阻止你犯这类错误。

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
下面是一个示例场景，在这种场景下你可能会使用刚刚讲述的特性。

假定名为 `old` 的 Job 已经处于运行状态。
你希望已有的 Pod 继续运行，但你希望 Job 接下来要创建的其他 Pod
使用一个不同的 Pod 模板，甚至希望 Job 的名字也发生变化。
你无法更新现有的 Job，因为这些字段都是不可更新的。
因此，你会删除 `old` Job，但**允许该 Job 的 Pod 集合继续运行**。
这是通过 `kubectl delete jobs/old --cascade=orphan` 实现的。
在删除之前，我们先记下该 Job 所使用的选择算符。

```shell
kubectl get job old -o yaml
```

<!--
The output is similar to this:
-->
输出类似于：

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
接下来你会创建名为 `new` 的新 Job，并显式地为其设置相同的选择算符。
由于现有 Pod 都具有标签
`batch.kubernetes.io/controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`，
它们也会被名为 `new` 的 Job 所控制。

你需要在新 Job 中设置 `manualSelector: true`，
因为你并未使用系统通常自动为你生成的选择算符。

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
新的 Job 自身会有一个不同于 `a8f3d00d-c6d2-11e5-9f87-42010af00002` 的唯一 ID。
设置 `manualSelector: true`
是在告诉系统你知道自己在干什么并要求系统允许这种不匹配的存在。

<!--
### Job tracking with finalizers
-->
### 使用 Finalizer 追踪 Job   {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The control plane keeps track of the Pods that belong to any Job and notices if
any such Pod is removed from the API server. To do that, the Job controller
creates Pods with the finalizer `batch.kubernetes.io/job-tracking`. The
controller removes the finalizer only after the Pod has been accounted for in
the Job status, allowing the Pod to be removed by other controllers or users.
-->
控制面会跟踪属于任何 Job 的 Pod，并通知是否有任何这样的 Pod 被从 API 服务器中移除。
为了实现这一点，Job 控制器创建的 Pod 带有 Finalizer `batch.kubernetes.io/job-tracking`。
控制器只有在 Pod 被记入 Job 状态后才会移除 Finalizer，允许 Pod 可以被其他控制器或用户移除。

{{< note >}}
<!--
See [My pod stays terminating](/docs/tasks/debug/debug-application/debug-pods/) if you
observe that pods from a Job are stuck with the tracking finalizer.
-->
如果你发现来自 Job 的某些 Pod 因存在负责跟踪的 Finalizer 而无法正常终止，
请参阅[我的 Pod 一直处于终止状态](/zh-cn/docs/tasks/debug/debug-application/debug-pods/)。
{{< /note >}}

<!--
### Elastic Indexed Jobs
-->
### 弹性索引 Job  {#elastic-indexed-jobs}

{{< feature-state feature_gate_name="ElasticIndexedJob" >}}

<!--
You can scale Indexed Jobs up or down by mutating both `.spec.parallelism` 
and `.spec.completions` together such that `.spec.parallelism == .spec.completions`. 
When scaling down, Kubernetes removes the Pods with higher indexes.

Use cases for elastic Indexed Jobs include batch workloads which require 
scaling an indexed Job, such as MPI, Horovod, Ray, and PyTorch training jobs.
-->
你可以通过同时改变 `.spec.parallelism` 和 `.spec.completions` 来扩大或缩小带索引 Job，
从而满足 `.spec.parallelism == .spec.completions`。
缩减规模时，Kubernetes 会删除具有更高索引的 Pod。

弹性索引 Job 的使用场景包括需要扩展索引 Job 的批处理工作负载，例如 MPI、Horovod、Ray
和 PyTorch 训练作业。

<!--
### Delayed creation of replacement pods {#pod-replacement-policy}
-->
### 延迟创建替换 Pod   {#pod-replacement-policy}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
<!--
You can only set `podReplacementPolicy` on Jobs if you enable the `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
(enabled by default).

-->
你只有在启用了 `JobPodReplacementPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)后（默认启用），
才能为 Job 设置 `podReplacementPolicy`。
{{< /note >}}

<!--
By default, the Job controller recreates Pods as soon they either fail or are terminating (have a deletion timestamp).
This means that, at a given time, when some of the Pods are terminating, the number of running Pods for a Job
can be greater than `parallelism` or greater than one Pod per index (if you are using an Indexed Job).
-->
默认情况下，当 Pod 失败或正在终止（具有删除时间戳）时，Job 控制器会立即重新创建 Pod。
这意味着，在某个时间点上，当一些 Pod 正在终止时，为 Job 正运行中的 Pod 数量可以大于 `parallelism`
或超出每个索引一个 Pod（如果使用 Indexed Job）。

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
你可以选择仅在终止过程中的 Pod 完全终止（具有 `status.phase: Failed`）时才创建替换 Pod。
为此，可以设置 `.spec.podReplacementPolicy: Failed`。
默认的替换策略取决于 Job 是否设置了 `podFailurePolicy`。对于没有定义 Pod 失效策略的 Job，
省略 `podReplacementPolicy` 字段相当于选择 `TerminatingOrFailed` 替换策略：
控制平面在 Pod 删除时立即创建替换 Pod（只要控制平面发现该 Job 的某个 Pod 被设置了 `deletionTimestamp`）。
对于设置了 Pod 失效策略的 Job，默认的 `podReplacementPolicy` 是 `Failed`，不允许其他值。
请参阅 [Pod 失效策略](#pod-failure-policy)以了解更多关于 Job 的 Pod 失效策略的信息。

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
如果你的集群启用了此特性门控，你可以检查 Job 的 `.status.terminating` 字段。
该字段值是当前处于终止过程中的、由该 Job 拥有的 Pod 的数量。

```shell
kubectl get jobs/myjob -o yaml
```

<!--
# .metadata and .spec omitted
# three Pods are terminating and have not yet reached the Failed phase
-->
```yaml
apiVersion: batch/v1
kind: Job
# .metadata 和 .spec 被省略
status:
  terminating: 3 # 三个 Pod 正在终止且还未达到 Failed 阶段
```

<!--
### Delegation of managing a Job object to external controller
-->
### 将管理 Job 对象的任务委托给外部控制器   {#delegation-of-managing-a-job-object-to-external-controller}

{{< feature-state feature_gate_name="JobManagedBy" >}}

{{< note >}}
<!--
You can only set the `managedBy` field on Jobs if you enable the `JobManagedBy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
(disabled by default).
-->
你只有在启用了 `JobManagedBy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（默认禁用）时，
才可以在 Job 上设置 `managedBy` 字段。
{{< /note >}}

<!--
This feature allows you to disable the built-in Job controller, for a specific
Job, and delegate reconciliation of the Job to an external controller.

You indicate the controller that reconciles the Job by setting a custom value
for the `spec.managedBy` field - any value
other than `kubernetes.io/job-controller`. The value of the field is immutable.
-->
此特性允许你为特定 Job 禁用内置的 Job 控制器，并将 Job 的协调任务委托给外部控制器。

你可以通过为 `spec.managedBy` 字段设置一个自定义值来指示用来协调 Job 的控制器，
这个自定义值可以是除了 `kubernetes.io/job-controller` 之外的任意值。此字段的值是不可变的。

{{< note >}}
<!--
When using this feature, make sure the controller indicated by the field is
installed, otherwise the Job may not be reconciled at all.
-->
在使用此特性时，请确保此字段指示的控制器已被安装，否则 Job 可能根本不会被协调。
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
在开发外部 Job 控制器时，请注意你的控制器需要以符合 Job 对象的 API 规范和状态字段定义的方式运行。

有关细节请参阅 [Job API](/zh-cn/docs/reference/kubernetes-api/workload-resources/job-v1/)。
我们也建议你运行 Job 对象的 e2e 合规性测试以检验你的实现。

最后，在开发外部 Job 控制器时，请确保它不使用为内置控制器预留的
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
如果你考虑禁用 `JobManagedBy` 特性门控，或者将集群降级到未启用此特性门控的版本，
请检查是否有 Job 的 `spec.managedBy` 字段值带有一个自定义值。如果存在这样的 Job，就会有一个风险，
即禁用或降级操作后这些 Job 可能会被两个控制器（内置的 Job 控制器和字段值指示的外部控制器）进行协调。
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

当 Pod 运行所在的节点重启或者失败，Pod 会被终止并且不会被重启。
Job 会重新创建新的 Pod 来替代已终止的 Pod。
因为这个原因，我们建议你使用 Job 而不是独立的裸 Pod，
即使你的应用仅需要一个 Pod。

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

Job 与[副本控制器](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)是彼此互补的。
副本控制器管理的是那些不希望被终止的 Pod （例如，Web 服务器），
Job 管理的是那些希望被终止的 Pod（例如，批处理作业）。

正如在 [Pod 生命期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/) 中讨论的，
`Job` 仅适合于 `restartPolicy` 设置为 `OnFailure` 或 `Never` 的 Pod。
注意：如果 `restartPolicy` 未设置，其默认值是 `Always`。

<!--
### Single Job starts controller Pod

Another pattern is for a single Job to create a Pod which then creates other Pods, acting as a sort
of custom controller for those Pods. This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.
-->
### 单个 Job 启动控制器 Pod    {#single-job-starts-controller-pod}

另一种模式是用唯一的 Job 来创建 Pod，而该 Pod 负责启动其他 Pod，
因此扮演了一种后启动 Pod 的控制器的角色。
这种模式的灵活性更高，但是有时候可能会把事情搞得很复杂，很难入门，
并且与 Kubernetes 的集成度很低。

<!--
One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)),
runs a spark driver, and then cleans up.

An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but maintains complete control over what Pods are created and how work is assigned to them.
-->
这种模式的实例之一是用 Job 来启动一个运行脚本的 Pod，脚本负责启动 Spark
主控制器（参见 [Spark 示例](https://github.com/kubernetes/examples/tree/master/staging/spark/README.md)），
运行 Spark 驱动，之后完成清理工作。

这种方法的优点之一是整个过程得到了 Job 对象的完成保障，
同时维持了对创建哪些 Pod、如何向其分派工作的完全控制能力，

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
* 了解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 了解运行 Job 的不同的方式：
  * [使用工作队列进行粗粒度并行处理](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue/)
  * [使用工作队列进行精细的并行处理](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)
  * [使用索引作业完成静态工作分配下的并行处理](/zh-cn/docs/tasks/job/indexed-parallel-processing-static/)
  * 基于一个模板运行多个 Job：[使用展开的方式进行并行处理](/zh-cn/docs/tasks/job/parallel-processing-expansion/)
* 跟随[自动清理完成的 Job](#clean-up-finished-jobs-automatically) 文中的链接，了解你的集群如何清理完成和失败的任务。
* `Job` 是 Kubernetes REST API 的一部分。阅读 {{< api-reference page="workload-resources/job-v1" >}}
  对象定义理解关于该资源的 API。
* 阅读 [`CronJob`](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)，
  它允许你定义一系列定期运行的 Job，类似于 UNIX 工具 `cron`。
* 根据循序渐进的[示例](/zh-cn/docs/tasks/job/pod-failure-policy/)，
  练习如何使用 `podFailurePolicy` 配置处理可重试和不可重试的 Pod 失效。
