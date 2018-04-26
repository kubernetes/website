---
assignees:
- erictune
- soltysh
cn-approvers:
- linyouchong
title: Jobs - Run to Completion
redirect_from:
- "/docs/concepts/jobs/run-to-completion-finite-workloads/"
- "/docs/concepts/jobs/run-to-completion-finite-workloads.html"
- "/docs/user-guide/jobs/"
- "/docs/user-guide/jobs.html"
---
<!--
---
assignees:
- erictune
- soltysh
title: Jobs - Run to Completion
redirect_from:
- "/docs/concepts/jobs/run-to-completion-finite-workloads/"
- "/docs/concepts/jobs/run-to-completion-finite-workloads.html"
- "/docs/user-guide/jobs/"
- "/docs/user-guide/jobs.html"
---
-->

* TOC
{:toc}

<!--
## What is a Job?
-->
## 什么是 Job

<!--
A _job_ creates one or more pods and ensures that a specified number of them successfully terminate.
As pods successfully complete, the _job_ tracks the successful completions.  When a specified number
of successful completions is reached, the job itself is complete.  Deleting a Job will cleanup the
pods it created.
-->
一个 _Job_ 创建一个或多个 Pod，并确保存在指定数量的 Pod 能够成功终止。当一个 Pod 成功终止，_Job_ 对此进行跟踪记录。 当成功终止的次数达到一个指定数量时，Job 本身就完成了。 删除 Job 将清理它所创建的 Pod。

<!--
A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first pod fails or is deleted (for example
due to a node hardware failure or a node reboot).
-->
一个简单的例子是创建一个 Job 对象，以便让一个 Pod 能可靠地完成运行。如果第一个 Pod 运行失败或被删除（例如，由于节点硬件故障或节点重新启动），Job 对象将启动一个新的 Pod。

<!--
A Job can also be used to run multiple pods in parallel.
-->
Job 也可以用于并行运行多个 Pod。

<!--
## Running an example Job
-->
## 运行一个 Job 示例

<!--
Here is an example Job config.  It computes π to 2000 places and prints it out.
It takes around 10s to complete.
-->
这是一个示例 Job 配置。 它计算 π 值到第 2000 位并打印出来。大约需要 10 秒才能完成。

{% include code.html language="yaml" file="job.yaml" ghlink="/docs/concepts/workloads/controllers/job.yaml" %}

<!--
Run the example job by downloading the example file and then running this command:
-->
要运行示例 Job，先下载示例文件然后运行以下命令：

```shell
$ kubectl create -f ./job.yaml
job "pi" created
```

<!--
Check on the status of the job using this command:
-->
使用以下命令检查 Job 的状态：

```shell
$ kubectl describe jobs/pi
Name:             pi
Namespace:        default
Image(s):         perl
Selector:         controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
Parallelism:      1
Completions:      1
Start Time:       Tue, 07 Jun 2016 10:56:16 +0200
Labels:           controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495,job-name=pi
Pods Statuses:    0 Running / 1 Succeeded / 0 Failed
No volumes.
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  1m           1m          1        {job-controller }                Normal      SuccessfulCreate  Created pod: pi-dtn4q
```

<!--
To view completed pods of a job, use `kubectl get pods --show-all`.  The `--show-all` will show completed pods too.
-->
查看 Job 的已完成的 Pod，使用 `kubectl get pod --show-all`。 `--show-all` 会显示已完成的 Pod。

<!--
To list all the pods that belong to a job in a machine readable form, you can use a command like this:
-->
以机器可读形式列出属于 Job 的所有 Pod，可以使用如下命令：

```shell
$ pods=$(kubectl get pods  --show-all --selector=job-name=pi --output=jsonpath={.items..metadata.name})
echo $pods
pi-aiw0a
```

<!--
Here, the selector is the same as the selector for the job.  The `--output=jsonpath` option specifies an expression
that just gets the name from each pod in the returned list.
-->
在这里，选择器与 Job 的选择器相同。 `--output = jsonpath` 选项指定一个表达式，表示只获取返回列表中的每个 Pod 的名称。

<!--
View the standard output of one of the pods:
-->
查看其中一个 Pod 的标准输出

```shell
$ kubectl logs $pods
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

<!--
## Writing a Job Spec
-->
## 编写 Job 配置

<!--
As with all other Kubernetes config, a Job needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see [here](/docs/user-guide/simple-yaml),
[here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).
-->
与所有其他 Kubernetes 配置一样，Job 需要 `apiVersion` 、`kind` 和 `metadata` 字段。 有关使用配置文件的通用信息，请查看 [这里](/docs/user-guide/simple-yaml)、
[这里](/docs/user-guide/configuring-containers) 和 [这里](/docs/user-guide/working-with-resources)。

<!--
A Job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).
-->
Job 还需要 [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) 字段。

<!--
### Pod Template
-->
### Pod 模板

<!--
The `.spec.template` is the only required field of the `.spec`.
-->
`.spec.template` 是 `.spec` 的唯一的必填字段

<!--
The `.spec.template` is a [pod template](/docs/user-guide/replication-controller/#pod-template).  It has exactly
the same schema as a [pod](/docs/user-guide/pods), except it is nested and does not have an `apiVersion` or
`kind`.
-->
`.spec.template` 是一个 [pod 模板](/docs/user-guide/replication-controller/#pod-template)。它与 [pod](/docs/user-guide/pods) 的语法几乎完全一样，除了它是内嵌字段而且没有 `apiVersion` 或 `kind` 字段。

<!--
In addition to required fields for a Pod, a pod template in a job must specify appropriate
labels (see [pod selector](#pod-selector)) and an appropriate restart policy.
-->
除了 Pod 必需字段外，Job 中的 Pod 模板必须指定合适的标签（请参阅 [pod selector](#pod-selector)) 和合适的重启策略。

<!--
Only a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Never` or `OnFailure` is allowed.
-->
[`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 只能等于 `Never` 或 `OnFailure`。

<!--
### Pod Selector
-->
### Pod 选择器

<!--
The `.spec.selector` field is optional.  In almost all cases you should not specify it.
See section [specifying your own pod selector](#specifying-your-own-pod-selector).
-->
`.spec.selector` 字段是可选的。在几乎所有情况下，您都不应该指定它。查看章节 [定义您自己的 Pod 选择器](#定义您自己的-pod-选择器)。


<!--
### Parallel Jobs
-->
### 并行 Job

<!--
There are three main types of jobs:
-->
有三种主要类型的 Job：

<!--
1. Non-parallel Jobs
  - normally only one pod is started, unless the pod fails.
  - job is complete as soon as Pod terminates successfully.
-->
1. 非并行 Job
  - 通常只启动一个 Pod ，除非 Pod 运行失败了。
  - Pod 一旦成功终止，任务就完成了。
<!--
1. Parallel Jobs with a *fixed completion count*:
  - specify a non-zero positive value for `.spec.completions`
  - the job is complete when there is one successful pod for each value in the range 1 to `.spec.completions`.
  - **not implemented yet:** each pod passed a different index in the range 1 to `.spec.completions`.
-->
1. 具有 *固定完成数量* 的并行 Job：
  - 为 `.spec.completions` 指定一个非零的正整数值
  - 当 1 到 `.spec.completions` 范围内的每个值都有一个成功的 pod 时，Job 就完成了
  - **尚未实现：** 每个 Pod 在 1 到 `.spec.completions` 范围内传递一个不同的索引。
<!--
1. Parallel Jobs with a *work queue*:
  - do not specify `.spec.completions`, default to `.spec.parallelism`
  - the pods must coordinate with themselves or an external service to determine what each should work on
  - each pod is independently capable of determining whether or not all its peers are done, thus the entire Job is done.
  - when _any_ pod terminates with success, no new pods are created.
  - once at least one pod has terminated with success and all pods are terminated, then the job is completed with success.
  - once any pod has exited with success, no other pod should still be doing any work or writing any output.  They should all be
    in the process of exiting.

-->
1. 具有 *工作队列* 的并行 Job
  - 不要指定 `.spec.completions`，`.spec.parallelism` 保持默认值
  - Pod 必须与自己或外部服务协调，以确定每个 Pod 上每个应该工作的内容
  - 每个 Pod 独立地能够确定是否所有的同伴都已完成工作，从而完成整个工作。
  - 当 _任一_ Pod 成功终止时，不会再创建新的 Pod。
  - 一旦至少一个 Pod 已经成功终止，所有 Pod 都会被终止，那么 Job 就成功完成。
  - 一旦任何 Pod 成功退出，其他 Pod 就不应该继续做任何工作或写任何输出。 他们都应该处于退出的过程。

<!--	
For a Non-parallel job, you can leave both `.spec.completions` and `.spec.parallelism` unset.  When both are
unset, both are defaulted to 1.
-->
对于非并行 Job，您可以不设置 `.spec.completions` 和 `.spec.parallelism`。 两者都未设置时，默认都为1。

<!--
For a Fixed Completion Count job, you should set `.spec.completions` to the number of completions needed.
You can set `.spec.parallelism`, or leave it unset and it will default to 1.
-->
对于具有固定完成数量的 Job，您应该将 `.spec.completions` 设置为所需完成的数量。您可以设置 `.spec.parallelism`，或者不设置它，它默认为 1。

<!--
For a Work Queue Job, you must leave `.spec.completions` unset, and set `.spec.parallelism` to
a non-negative integer.
-->
对于具有工作队列的 Job，您必须保留 `.spec.completions` 未设置，并将 `.spec.parallelism` 设置为非负整数。

<!--
For more information about how to make use of the different types of job, see the [job patterns](#job-patterns) section.
-->
有关如何使用不同类型 Job 的更多信息，请参阅 [Job 模式](#job-模式) 部分。


<!--
#### Controlling Parallelism
-->
#### 控制并行度

<!--
The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.
-->
请求的并行度（`.spec.parallelism`）可以设置为任何非负整数值。如果未指定，则默认为 1。如果将其指定为 0，则 Job 将被暂停，直到这个值被增加。

<!--
A job can be scaled up using the `kubectl scale` command.  For example, the following
command sets `.spec.parallelism` of a job called `myjob` to 10:
-->
一个 Job 可以通过 `kubectl scale` 命令来扩容。 例如，下面的命令将一个名为 `myjob` 的 Job 的 `.spec.parallelism` 设置为 10：

```shell
$ kubectl scale  --replicas=$N jobs/myjob
job "myjob" scaled
```

<!--
You can also use the `scale` subresource of the Job resource.
-->
您也可以使用 Job 资源的 `scale` 子资源。

<!--
Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety or reasons:
-->
实际的并行度（在任何时刻运行的 Pod 数量）可能多于或少于请求的并行度，原因有很多种。

<!--
- For Fixed Completion Count jobs, the actual number of pods running in parallel will not exceed the number of
  remaining completions.   Higher values of `.spec.parallelism` are effectively ignored.
-->
对于具有固定完成数的 Job，并行运行的实际数量不会超过待完成数量。 `.spec.parallelism` 的较高值被有效地忽略。
- <!--
- For work queue jobs, no new pods are started after any pod has succeeded -- remaining pods are allowed to complete, however.
-->
- 对于具有工作队列的 Job，任一 Pod 成功后都不会启动新的 Pod，但剩余的 Pod 可以继续完成。
<!--
- If the controller has not had time to react.
-->
- 如果控制器没有时间做出反应。
<!--
- If the controller failed to create pods for any reason (lack of ResourceQuota, lack of permission, etc.),
  then there may be fewer pods than requested.
-->
- 如果控制器由于某种原因（缺少ResourceQuota，缺少权限等）而无法创建 Pod，那么可能 Pod 的数量比请求的少。
<!--
- The controller may throttle new pod creation due to excessive previous pod failures in the same Job.
-->
- 由于同一 Job 中过多的先前的 Pod 故障，控制器可能会限制新的 Pod 创建。
<!--
- When a pod is gracefully shutdown, it takes time to stop.
-->
- 当一个 Pod 正常关闭时，停止过程需要一定的时间。

<!--
## Handling Pod and Container Failures
-->
## 处理 Pod 和容器故障

<!--
A Container in a Pod may fail for a number of reasons, such as because the process in it exited with
a non-zero exit code, or the Container was killed for exceeding a memory limit, etc.  If this
happens, and the `.spec.template.spec.restartPolicy = "OnFailure"`, then the Pod stays
on the node, but the Container is re-run.  Therefore, your program needs to handle the case when it is
restarted locally, or else specify `.spec.template.spec.restartPolicy = "Never"`.
See [pods-states](/docs/user-guide/pod-states) for more information on `restartPolicy`.
-->
Pod 中的容器可能由于多种原因而失败，例如因为其中的进程退出时出现非零的退出代码，或者容器因为超出内存限制而死亡等。如果发生这种情况，那么 `spec.template.spec.restartPolicy = "OnFailure"`，那么 Pod 停留在节点上，但 Container 会重新运行。因此，当程序在本地重新启动时需要处理这种情况，否则应指定 `.spec.template.spec.restartPolicy = "Never"`。查看 [pods-states](/docs/user-guide/pod-states) 了解有关 `restartPolicy` 的更多信息。

<!--
An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`.  When a Pod fails, then the Job controller
starts a new Pod.  Therefore, your program needs to handle the case when it is restarted in a new
pod.  In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.
-->
整个 Pod 也可能会失败，原因很多，例如当 Pod 从节点上被踢出（节点被升级，重新引导，删除等等），或者 Pod 的容器失败以及 `.spec.template.spec.restartPolicy = "Never"`。 当一个 Pod 失败时，Job 控制器启动一个新的 Pod。 因此，您的程序需要处理重新启动时的情况。 尤其需要处理上次运行造成的临时文件、锁、不完整的输出等。

<!--
Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.
-->
请注意，即使您指定了 `.spec.parallelism = 1` 和 `.spec.completions = 1` 和 `.spec.template.spec.restartPolicy = "Never"`，有时同一程序还是可能会被启动两次。

<!--
If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once.  Therefore, your pods must also be tolerant of concurrency.
-->
如果您指定 `.spec.parallelism` 和 `.spec.completions` 都大于 1，那么可能有多个 Pod 同时在运行。 因此，您的 Pod 还必须能够容忍并发性。

<!--
## Job Termination and Cleanup
-->
## Job 终止和清理

<!--
When a Job completes, no more Pods are created, but the Pods are not deleted either.  Since they are terminated,
they don't show up with `kubectl get pods`, but they will show up with `kubectl get pods -a`.  Keeping them around
allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status.  It is up to the user to delete
old jobs after noting their status.  Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`).  When you delete the job using `kubectl`, all the pods it created are deleted too.
-->
Job 完成后，不会再创建更多的 Pod，但 Pod 也不会被删除。 因为它们被终止了，所以它们不会出现在 `kubectl get pod` 的输出中，但是它们会出现在 `kubectl get pods -a` 的输出中。 保留它们可让您能够查看已完成 Pod 的日志，以检查错误、警告或其他诊断输出。 Job 对象在完成后也会被保留，以便查看其状态。 注意到它们的状态后，用户可以删除旧的 Job。 使用 `kubectl`（例如 `kubectl delete jobs/pi` 或 `kubectl delete -f ./job.yaml` ）删除作业。 当您使用 `kubectl` 删除作业时，它所创建的所有 Pod 也会被删除。

<!--
If a Job's pods are failing repeatedly, the Job will keep creating new pods forever, by default.
Retrying forever can be a useful pattern.  If an external dependency of the Job's
pods is missing (for example an input file on a networked storage volume is not present), then the
Job will keep trying Pods, and when you later resolve the external dependency (for example, creating
the missing file) the Job will then complete without any further action.
-->
如果一个 Job 的 Pod 反复失败，Job 就会不断地创建新的 Pod，默认情况下，不断重试是一个有用的模式。 如果Job 的 Pod 的外部依赖缺失（例如，网络存储卷上的输入文件不存在），则 Job 将不断尝试 Pod，在您解决了外部依赖问题后（例如，创建缺少的文件 ），Job 将会运行完成而不需要任何进一步的干预。

<!--
However, if you prefer not to retry forever, you can set a deadline on the job.  Do this by setting the
`spec.activeDeadlineSeconds` field of the job to a number of seconds.  The job will have status with
`reason: DeadlineExceeded`.  No more pods will be created, and existing pods will be deleted.
-->
但是，如果您不想不断重试，您可以设定 Job 的最后期限。 通过将 Job 的 `spec.activeDeadlineSeconds` 字段设置为一定数量的秒数来实现这个功能。 该 Job 将处于 `reason: DeadlineExceeded` 状态。 不会再创建 Pod，现有的 Pod 也将被删除。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  activeDeadlineSeconds: 100
  template:
    metadata:
      name: pi
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

<!--
Note that both the Job Spec and the Pod Template Spec within the Job have a field with the same name.
Set the one on the Job.
-->
请注意，Job 规格和 Job 中的模板规格都有相同名称的字段。请在 Job 规格上设置。

<!--
## Job Patterns
-->
## Job 模式

<!--
The Job object can be used to support reliable parallel execution of Pods.  The Job object is not
designed to support closely-communicating parallel processes, as commonly found in scientific
computing.  It does support parallel processing of a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded, ranges of keys in a
NoSQL database to scan, and so on.
-->
Job 对象可用于支持 Pod 的可靠并行执行。 Job 对象的设计目的不是为了支持在科学计算中常见的密切通信的并行进程。 它支持并行处理一组独立但相关的 *工作项* 。这些可能是要发送的电子邮件，要渲染的帧，要转码的文件，要扫描的 NoSQL 数据库中的密钥范围等。

<!--
In a complex system, there may be multiple different sets of work items.  Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.
-->
在一个复杂的系统中，可能有多个不同的工作项目组。 在这里，我们只考虑用户想要一起管理的一组工作项目 &mdash; 一个*批量工作*。

<!--
There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:
-->
并行计算有几种不同的模式，每种模式都有优缺点。权衡是：

<!--
- One Job object for each work item, vs. a single Job object for all work items.  The latter is
  better for large numbers of work items.  The former creates some overhead for the user and for the
  system to manage large numbers of Job objects.  Also, with the latter, the resource usage of the job
  (number of concurrently running pods) can be easily adjusted using the `kubectl scale` command.
-->
- 每个工作项目使用一个 Job 对象，与所有工作项目使用单个 Job 对象相比。 后者对于大量的工作项目更好。 前者会给用户和系统造成一些开销用于管理大量的 Job 对象。 另外，对于后者，可以使用 `kubectl scale` 命令轻松调整作业的资源使用情况（同时运行的 Pod 数量）。
<!--
- Number of pods created equals number of work items, vs. each pod can process multiple work items.
  The former typically requires less modification to existing code and containers.  The latter
  is better for large numbers of work items, for similar reasons to the previous bullet.
-->
- 创建的 Pod 数量等于工作项目数量，与每个 Pod 可以处理多个工作项目相比。前者通常需要对现有代码和容器进行较少的修改。 后者对于大量的工作项目更好，因为与前面类似的原因。
<!--
- Several approaches use a work queue.  This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.
-->
- 有几种方法使用了工作队列。 这需要运行一个队列服务，并修改现有的程序或容器，使其使用工作队列。其他方法更容易适应现有的容器化应用程序。


<!--
The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.
-->
这里总结了权衡，第 2 到第 4 列对应于上述权衡。模式名称也链接到了例子和更详细的描述。

<!--
|                            Pattern                                   | Single Job object | Fewer pods than work items? | Use app unmodified? |  Works in Kube 1.1? |
| -------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Job Template Expansion](/docs/tasks/job/parallel-processing-expansion/)            |                   |                             |          ✓          |          ✓          |
| [Queue with Pod Per Work Item](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |         ✓         |                             |      sometimes      |          ✓          |
| [Queue with Variable Pod Count](/docs/tasks/job/fine-parallel-processing-work-queue/)  |         ✓         |             ✓               |                     |          ✓          |
| Single Job with Static Work Assignment                               |         ✓         |                             |          ✓          |                     |
-->
|                            模式                                   | 单个 Job 对象 | Pod 数量比工作项目数量少? | 使用未修改的App? |  使用 Kube 1.1? |
| -------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Job 模板扩展](/docs/tasks/job/parallel-processing-expansion/)            |                   |                             |          ✓          |          ✓          |
| [每个 Pod 处理一个工作项的队列](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |         ✓         |                             |      有时      |          ✓          |
| [可变 Pod 数量的队列](/docs/tasks/job/fine-parallel-processing-work-queue/)  |         ✓         |             ✓               |                     |          ✓          |
| 静态分配工作的 Job                           |         ✓         |                             |          ✓          |                     |

<!--
When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).  This means that
all pods will have the same command line and the same
image, the same volumes, and (almost) the same environment variables.  These patterns
are different ways to arrange for pods to work on different things.
-->
当用 `.spec.completions` 指定完成数时，Job 控制器创建的每个 Pod 都有一个相同的 [`spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status)。 这意味着所有的 Pod 将具有相同的命令行和相同的镜像，相同的卷和（几乎）相同的环境变量。 这些模式安排 Pod 在不同的事情上工作的不同方式。

<!--
This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.
-->
这个表格显示了每个模式的 `.spec.parallelism` 和 `.spec.completions` 所需的设置。这里 `W` 是指工作项目的数量。

<!--
|                             Pattern                                  | `.spec.completions` |  `.spec.parallelism` |
| -------------------------------------------------------------------- |:-------------------:|:--------------------:|
| [Job Template Expansion](/docs/tasks/job/parallel-processing-expansion/)           |          1          |     should be 1      |
| [Queue with Pod Per Work Item](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |          W          |        any           |
| [Queue with Variable Pod Count](/docs/tasks/job/fine-parallel-processing-work-queue/)  |          1          |        any           |
| Single Job with Static Work Assignment                               |          W          |        any           |
-->
|                             模式                                  | `.spec.completions` |  `.spec.parallelism` |
| -------------------------------------------------------------------- |:-------------------:|:--------------------:|
| [Job 模板扩展](/docs/tasks/job/parallel-processing-expansion/)           |          1          |     必须为 1      |
| [每个 Pod 处理一个工作项的队列](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |          W          |        任意值           |
| [可变 Pod 数量的队列](/docs/tasks/job/fine-parallel-processing-work-queue/)  |          1          |        任意值           |
| 静态分配工作的 Job


<!--
## Advanced Usage
-->
## 高级用法

<!--
### Specifying your own pod selector
-->
### 定义您自己的 Pod 选择器

<!--
Normally, when you create a job object, you do not specify `spec.selector`.
The system defaulting logic adds this field when the job is created.
It picks a selector value that will not overlap with any other jobs.
-->
通常，当您创建一个 Job 对象时，您不需要指定 `spec.selector`。系统默认逻辑在 Job 创建时添加该字段。它选择一个不会与其他任务重叠的选择器值。

<!--
However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `spec.selector` of the job.
-->
但是，在某些情况下，您可能需要重写此自动设置的选择器。为此，您可以指定 Job 的 `spec.selector`。

<!--
Be very careful when doing this.  If you specify a label selector which is not
unique to the pods of that job, and which matches unrelated pods, then pods of the unrelated
job may be deleted, or this job may count other pods as completing it, or one or both
of the jobs may refuse to create pods or run to completion.  If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their pods may behave
in unpredicatable ways too.  Kubernetes will not stop you from making a mistake when
specifying `spec.selector`.
-->
在这样做时要非常小心。如果您指定的标签选择器不是与该 Job 相同的标签选择器，并且与不相关的标签匹配，则无关 Job 的标签可能会被删除，或者该 Job 可能会将其他标签作为完成标签，或者其中一个或两个 Job 可能会拒绝创建 Pod 或运行完成。 如果选择了非唯一的选择器，则其他控制器（例如，ReplicationController）及其 Pod 也可能以不可预知的方式运行。 指定 `spec.selector` 时，Kubernetes不会阻止您犯这个错误。

<!--
Here is an example of a case when you might want to use this feature.
-->
以下是您可能需要使用此功能的示例。

<!--
Say job `old` is already running.  You want existing pods
to keep running, but you want the rest of the pods it creates
to use a different pod template and for the job to have a new name.
You cannot update the job because these fields are not updatable.
Therefore, you delete job `old` but leave its pods
running, using `kubectl delete jobs/old --cascade=false`.
Before deleting it, you make a note of what selector it uses:
-->
假设 Job `old` 已经在运行。 您希望已有的 Pod 继续运行，但您希望剩下的 Pod 创建时使用不同的 Pod 模板，并让 Job 使用新的名称。 您无法更新 Job，因为这些字段是不可更新的。因此，使用 `kubectl delete jobs/old --cascade=false` 删除 Job `old`，但让它的 Pod 继续运行。在删除 Job 之前，请记下它所使用的选择器：

```
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      job-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
Then you create a new job with name `new` and you explicitly specify the same selector.
Since the existing pods have label `job-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`,
they are controlled by job `new` as well.
-->
然后您创建一个名字为 `new` 的新 Job，并且明确地指定了相同的选择器。由于现有的 Pod 具有标签 `job-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`，所以它们也被 Job `new` 所控制。

<!--
You need to specify `manualSelector: true` in the new job since you are not using
the selector that the system normally generates for you automatically.
-->
您需要在新 Job 中指定 `manualSelector: true`，因为您没有使用系统通常为您自动生成的选择器。

```
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      job-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

<!--
The new Job itself will have a different uid from `a8f3d00d-c6d2-11e5-9f87-42010af00002`.  Setting
`manualSelector: true` tells the system to that you know what you are doing and to allow this
mismatch.
-->
新的 Job 本身将有一个不同于 `a8f3d00d-c6d2-11e5-9f87-42010af00002` 的 uid。 设置 `manualSelector: true` 告诉系统，您知道您在做什么，并允许这种不匹配。

<!--
## Alternatives
-->
## 可选方案

<!--
### Bare Pods
-->
### 直接使用 Pod

<!--
When the node that a pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new pods to replace terminated ones.
For this reason, we recommend that you use a job rather than a bare pod, even if your application
requires only a single pod.
-->
当运行 Pod 的节点重启或失败时，Pod 将终止并不会重新启动。 但是，一个 Job 将创建新的 Pod 来取代终止的 Pod。 出于这个原因，我们建议您使用 Job 而不是直接使用 Pod，即使您的应用程序只需要一个 Pod。

<!--
### Replication Controller
-->
### Replication Controller

<!--
Jobs are complementary to [Replication Controllers](/docs/user-guide/replication-controller).
A Replication Controller manages pods which are not expected to terminate (e.g. web servers), and a Job
manages pods that are expected to terminate (e.g. batch jobs).
-->
Job 是对 [Replication Controllers](/docs/user-guide/replication-controller) 的补充。 Replication Controller 管理预期不会终止的 Pod（例如 web 服务器），而 Job 管理预期终止的 Pod（例如批处理作业）。

<!--
As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate for pods with
`RestartPolicy` equal to `OnFailure` or `Never`.  (Note: If `RestartPolicy` is not set, the default
value is `Always`.)
-->
正如 [Pod生命周期](/docs/concepts/workloads/pods/pod-lifecycle/) 中所讨论的，`Job` 只适用于 `RestartPolicy` 等于 `OnFailure` 或 `Never` 的 Pod。 （注意：如果没有设置 `RestartPolicy` ，默认值是 `Always`。）

<!--
### Single Job starts Controller Pod
-->
### 单个 Job 启动控制器 Pod

<!--
Another pattern is for a single Job to create a pod which then creates other pods, acting as a sort
of custom controller for those pods.  This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.
-->
另一种模式是为单个 Job 创建一个 Pod，然后由其创建其他 Pod，作为这些 Pod 的一种自定义控制器。 这样可以提供最大的灵活性，但是开始使用起来可能有点复杂，并且与 Kubernetes 的集成度较低。

<!--
One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/spark/README.md)), runs a spark
driver, and then cleans up.
-->
这种模式的一个例子就是一个 Job 启动了一个 Pod，这个 Pod 运行一个脚本，然后启动一个 Spark 主控制器（参见 [spark example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/spark/README.md)），运行一个 sparkdriver，然后清理。

<!--
An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but complete control over what pods are created and how work is assigned to them.
-->
这种方法的一个优点是，整个过程得到了一个 Job 对象的完整保证，且完整控制了创建的 Pod 和分配工作给他们的方式。

<!--
## Cron Jobs
-->
## Cron Job

<!--
Support for creating Jobs at specified times/dates (i.e. cron) is available in Kubernetes [1.4](https://github.com/kubernetes/kubernetes/pull/11980). More information is available in the [cron job documents](/docs/concepts/workloads/controllers/cron-jobs/)
-->
在 Kubernetes [1.4](https://github.com/kubernetes/kubernetes/pull/11980) 中提供了在指定的时间/日期（即 cron）创建 Job 的支持。 更多信息可在 [cron Job 文档](/docs/concepts/workloads/controllers/cron-jobs/) 中找到。
