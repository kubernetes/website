---
title: Job 从运行到完成
content_template: templates/concept
feature:
  title: Batch execution
  description: >
    In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.
weight: 70
---

<!--
---
reviewers:
- erictune
- soltysh
title: Jobs - Run to Completion
content_template: templates/concept
feature:
  title: Batch execution
  description: >
    In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.
weight: 70
---
-->

{{% capture overview %}}

<!--
A Job creates one or more Pods and ensures that a specified number of them successfully terminate.
As pods successfully complete, the Job tracks the successful completions.  When a specified number
of successful completions is reached, the task (ie, Job) is complete.  Deleting a Job will clean up
the Pods it created.
-->

Job 创建一个或多个 pod，并且确保指定数量的 pod 成功终止。Pod 成功完成后，Job 将跟踪成功完成的情况。当达到指定的成功完成次数时，任务（即 Job）就完成了。删除 Job 将清除其创建的 pod。

<!--
A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first Pod fails or is deleted (for example
due to a node hardware failure or a node reboot).
-->

一种简单的情况时创建一个 Job 对象，以便可靠地运行一个 Pod 来完成。如果第一个 pod 失败了或被删除了（例如，由于节点硬件故障或节点重启），则 Job 对象将启动一个新的 pod。

<!--
You can also use a Job to run multiple Pods in parallel.
-->

也可以使用 Job 去并行运行多个 pod。

{{% /capture %}}


{{% capture body %}}

<!--
## Running an example Job
-->

## 运行一个 Job 示例

<!--
Here is an example Job config.  It computes π to 2000 places and prints it out.
It takes around 10s to complete.
-->

下面是一个 Job 配置样例。它计算 π 到2000位并将其打印出来。大约需要 10 秒钟才能完成。

{{< codenew file="controllers/job.yaml" >}}

<!--
You can run the example with this command:
-->

可以使用以下命令运行示例：

```shell
kubectl apply -f https://k8s.io/examples/controllers/job.yaml
```
```
job "pi" created
```

<!--
Check on the status of the Job with `kubectl`:
-->

使用 `kubectl` 命令检查 Job 的状态：

```shell
kubectl describe jobs/pi
```
```
Name:             pi
Namespace:        default
Selector:         controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
Labels:           controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
                  job-name=pi
Annotations:      <none>
Parallelism:      1
Completions:      1
Start Time:       Tue, 07 Jun 2016 10:56:16 +0200
Pods Statuses:    0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
                job-name=pi
  Containers:
   pi:
    Image:      perl
    Port:
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  1m           1m          1        {job-controller }                Normal      SuccessfulCreate  Created pod: pi-dtn4q
```

<!--
To view completed Pods of a Job, use `kubectl get pods`.
-->

要查看 Job 的已完成 pod，可以使用 `kubectl get pods` 命令。

<!--
To list all the Pods that belong to a Job in a machine readable form, you can use a command like this:
-->

要以机器可读的形式列出属于 Job 的所有 pod，可以使用以下命令：

```shell
pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```
```
pi-aiw0a
```

<!--
Here, the selector is the same as the selector for the Job.  The `--output=jsonpath` option specifies an expression
that just gets the name from each Pod in the returned list.
-->

这里，选择器与 Job 的选择器相同。`--output=jsonpath` 选项指定一个表达式来从 pod 返回列表中获取每个 pod 的名称。

<!--
View the standard output of one of the pods:
-->

查看其中一个 pod 的标准输出：

```shell
kubectl logs $pods
```
The output is similar to this:
```shell
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

<!--
## Writing a Job Spec
-->

## 编写 Job 规范

<!--
As with all other Kubernetes config, a Job needs `apiVersion`, `kind`, and `metadata` fields.
-->

和其他 Kubernetes 配置一样，Job 需要 `apiVersion`，`kind` 和 `metadata` 字段。

<!--
A Job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->

Job 也需要 [`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template
-->

### Pod 模板

<!--
The `.spec.template` is the only required field of the `.spec`.
-->

`.spec.template` 是 `.spec` 中唯一必填字段。

<!--
The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [pod](/docs/user-guide/pods), except it is nested and does not have an `apiVersion` or `kind`.
-->

`.spec.template` 是 [pod 模板](/docs/concepts/workloads/pods/pod-overview/#pod-templates)。它具有与 [pod](/docs/user-guide/pods) 完全相同的架构，只是它是嵌套的并且没有 `apiVersion` 或 `kind`。

<!--
In addition to required fields for a Pod, a pod template in a Job must specify appropriate
labels (see [pod selector](#pod-selector)) and an appropriate restart policy.
-->

除了 pod 的必填字段，Job 中的 pod 模板还必须指定合适的标签（参考 [pod 选择器](#pod-selector)）和适当的重启策略。

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

`.spec.selector` 字段是可选的。在大多数场景下不必指定它。请参阅[指定自己的 pod 选择器](#specifying-your-own-pod-selector)。

<!--
### Parallel Jobs
-->

### 并行 Job

<!--
There are three main types of task suitable to run as a Job:
-->

下面是适合作为 Job 运行的三种主要任务类型：

<!--
1. Non-parallel Jobs
  - normally, only one Pod is started, unless the Pod fails.
  - the Job is complete as soon as its Pod terminates successfully.
1. Parallel Jobs with a *fixed completion count*:
  - specify a non-zero positive value for `.spec.completions`.
  - the Job represents the overall task, and is complete when there is one successful Pod for each value in the range 1 to `.spec.completions`.
  - **not implemented yet:** Each Pod is passed a different index in the range 1 to `.spec.completions`.
1. Parallel Jobs with a *work queue*:
  - do not specify `.spec.completions`, default to `.spec.parallelism`.
  - the Pods must coordinate amongst themselves or an external service to determine what each should work on. For example, a Pod might fetch a batch of up to N items from the work queue.
  - each Pod is independently capable of determining whether or not all its peers are done, and thus that the entire Job is done.
  - when _any_ Pod from the Job terminates with success, no new Pods are created.
  - once at least one Pod has terminated with success and all Pods are terminated, then the Job is completed with success.
  - once any Pod has exited with success, no other Pod should still be doing any work for this task or writing any output.  They should all be in the process of exiting.
-->

1. 非并行 Job
  - 通常，除非 pod 发生故障，否则仅启动一个 pod。
  - 一旦 pod 成功终止，Job 即完成。
1. 配置了*固定完成计数*的并行 Job：
  - 为 `.spec.completions` 指定一个非零正数值。
  - Job 代表整体任务，并且在 1 到 `.spec.completions` 范围内都有一个 pod 成功完成时，Job 才算完成。
  - **尚未实现:** 每个 pod 都会被传递一个从 1 到 `.spec.completions` 之间的索引值。
1. 具有*工作队列*的并行 Job：
  - 不指定 `.spec.completions` 的话, 默认为 `.spec.parallelism`。
  - Pod 必须在彼此之间或外部服务之间进行协调，来确定每个 pod 该处理什么任务。例如，一个 pod 可以从工作队列中获取一批任务（最多 N 个）。
  - 每个 pod 都可以独立确定其所有对端是否完成，从而确定整个 Job 完成。
  - 当 Job 中的_任何_ pod 成功结束后，不会再创建新的 pod。
  - 一旦至少一个 pod 成功终止并且所有的 pod 都终止了，则 Job 就成功完成了。
  - 一旦 任何 pod 成功退出，其他 pod 都不应该为此任务做任务工作或编写任何输出。它们都应该处在退出过程中。

<!--
For a _non-parallel_ Job, you can leave both `.spec.completions` and `.spec.parallelism` unset.  When both are
unset, both are defaulted to 1.
-->

对于_非并行_ Job，可以不设置 `.spec.completions` 和 `.spec.parallelism`。两者均未设置时，默认值为 1。

<!--
For a _fixed completion count_ Job, you should set `.spec.completions` to the number of completions needed.
You can set `.spec.parallelism`, or leave it unset and it will default to 1.
-->

对于一个_固定完成计数_ Job，应该将 `.spec.completions` 设置为所需的完成数量。`.spec.parallelism` 可以设置，也可以不设置，默认值为 1。

<!--
For a _work queue_ Job, you must leave `.spec.completions` unset, and set `.spec.parallelism` to
a non-negative integer.
-->

对于一个_工作队列_ Job，不要设置 `.spec.completions`，并且将 `.spec.parallelism` 设置一个非负整数。

<!--
For more information about how to make use of the different types of job, see the [job patterns](#job-patterns) section.
-->

有关如何使用不同类型 Job 的更多信息，请参考 [Job 模式](#job-patterns)部分。


<!--
#### Controlling Parallelism
-->

#### 控制并行

<!--
The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.
-->

请求的并发数（`.spec.parallelism`）可以设置为任何非负的整数。如果未指定，默认值为 1。如果指定为 0，则 Job 就被有效地暂停直到该配置值增加。

<!--
Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety of reasons:
-->

实际的并发数（在任何时刻运行着的 pod 数量）由于下面的一些原因，可能大于或小于请求的并发数：

<!--
- For _fixed completion count_ Jobs, the actual number of pods running in parallel will not exceed the number of
  remaining completions.   Higher values of `.spec.parallelism` are effectively ignored.
- For _work queue_ Jobs, no new Pods are started after any Pod has succeeded -- remaining Pods are allowed to complete, however.
- If the controller has not had time to react.
- If the controller failed to create Pods for any reason (lack of `ResourceQuota`, lack of permission, etc.),
  then there may be fewer pods than requested.
- The controller may throttle new Pod creation due to excessive previous pod failures in the same Job.
- When a Pod is gracefully shut down, it takes time to stop.
-->

- 对于_固定完成计数_ Job，实际上并行运行的 pod 数量不会超过剩余的完成数。更高的 `.spec.parallelism` 值将被优先忽略。
- 对于_工作队列_ Job，任何 pod 成功之后都不会启动新的 pod。然而，剩余的 pod 可以完成。
- 如果控制器还没来得及反应。
- 如果控制器由于任何原因（缺少 `ResourceQuota`，缺少权限等）未能创建 pod，则 pod 数量将少于请求数。
- 控制器可能会因为同一 Job 中有过多之前失败的 pod，从而限制新的 pod 的创建。
- 当 pod 优雅关闭时，需要花费一些时间才能停止。

<!--
## Handling Pod and Container Failures
-->

## 处理 Pod 和容器失败

<!--
A container in a Pod may fail for a number of reasons, such as because the process in it exited with
a non-zero exit code, or the container was killed for exceeding a memory limit, etc.  If this
happens, and the `.spec.template.spec.restartPolicy = "OnFailure"`, then the Pod stays
on the node, but the container is re-run.  Therefore, your program needs to handle the case when it is
restarted locally, or else specify `.spec.template.spec.restartPolicy = "Never"`.
See [pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#example-states) for more information on `restartPolicy`.
-->

Pod 中的容器可能由于多种原因而失败，例如，由于容器中的进程以非零退出码退出，或者容器由于超过内存限制而被杀掉等。如果容器失败发生，并且 `.spec.template.spec.restartPolicy = "OnFailure"`，则 pod 停留在节点上，但是容器会重新运行。因此，你的程序需要处理本地重启的情况，或者指定 `.spec.template.spec.restartPolicy = "Never"`。参阅 [pod 生命周期](/docs/concepts/workloads/pods/pod-lifecycle/#example-states)获取更多关于 `restartPolicy` 的信息。

<!--
An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`.  When a Pod fails, then the Job controller
starts a new Pod.  This means that your application needs to handle the case when it is restarted in a new
pod.  In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.
-->

由于多种原因，整个 pod 也可能失败，比如，当 pod 从节点上被踢走（节点在升级，重启，被删除等），或者 pod 中的容器失败且设置了 `.spec.template.spec.restartPolicy = "Never"`。当 pod 失败后，Job 控制器将启动一个新的 pod。这意味着你的应用程序需要处理这种情况（应用程序在新的 pod 中重启）。特别是，它需要处理由先前运行引起的临时文件，锁，不完整输出等等。

<!--
Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.
-->

请注意，即使你指定了 `.spec.parallelism = 1`，`.spec.completions = 1` 和 `.spec.template.spec.restartPolicy = "Never"`，统一程序有时也会启动两次。

<!--
If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once.  Therefore, your pods must also be tolerant of concurrency.
-->

如果你指定 `.spec.parallelism` 和 `.spec.completions` 配置都大于 1，则可能同时有多个 pod 运行。因此，你的 pod 必须容忍并发。

<!--
### Pod backoff failure policy
-->

### Pod 的退避失败策略

<!--
There are situations where you want to fail a Job after some amount of retries
due to a logical error in configuration etc.
To do so, set `.spec.backoffLimit` to specify the number of retries before
considering a Job as failed. The back-off limit is set by default to 6. Failed
Pods associated with the Job are recreated by the Job controller with an
exponential back-off delay (10s, 20s, 40s ...) capped at six minutes. The
back-off count is reset if no new failed Pods appear before the Job's next
status check.
-->

在某些情况下（配置中的逻辑错误等），你需要在重试一定次数后才使 Job 失败。为此需要设置 `.spec.backoffLimit` 配置值为判断 Job 失败前的重试次数。 退避限制默认设置为 6。与 Job 相关的 pod在失败后，经过一个指数级退避延迟（10 秒，20 秒，40 秒，上限为 6 分钟），由 Job 控制器重新创建。 如果在 Job 的下一次状态检查之前未出现新的失败 pod，则会重置退避计数。

{{< note >}}
<!--
Issue [#54870](https://github.com/kubernetes/kubernetes/issues/54870) still exists for versions of Kubernetes prior to version 1.12
-->

1.12 之前的 Kubernetes 版本仍然存在问题 [#54870](https://github.com/kubernetes/kubernetes/issues/54870)

{{< /note >}}
{{< note >}}
<!--
If your job has `restartPolicy = "OnFailure"`, keep in mind that your container running the Job
will be terminated once the job backoff limit has been reached. This can make debugging the Job's executable more difficult. We suggest setting
`restartPolicy = "Never"` when debugging the Job or using a logging system to ensure output
from failed Jobs is not lost inadvertently.
-->

如果你的 Job 外配置了 `restartPolicy = "OnFailure"`，请记住，一旦 Job 达到退避限制，运行在该 Job 的容器将被终止。这会使得调试 Job 的可执行将变得更加困难。我们建议在调试 Job 或使用日志系统时设置 `restartPolicy = "Never"`，以确保失败 Job 的输出不会在不经意间丢失。
{{< /note >}}

<!--
## Job Termination and Cleanup
-->

## Job 终止和清理

<!--
When a Job completes, no more Pods are created, but the Pods are not deleted either.  Keeping them around
allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status.  It is up to the user to delete
old jobs after noting their status.  Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`). When you delete the job using `kubectl`, all the pods it created are deleted too.
-->

当 Job 完成后，不会再创建 pod，但是 pod 也不会被删除。将这些 pod 保留，使你仍然可以查看已完成 pod 的日志来检查错误，警告或其他诊断输出。Job 对象在完成后也同样保留下来，以便你可以查看它的状态。由用户来决定在查看完状态后删除旧的 Job。使用 `kubectl`（例如 `kubectl delete jobs/pi` 或 `kubectl delete -f ./job.yaml` ）来删除 Job。当你使用 `kubectl` 删除 Job 后，它所创建的所有 pod 也会被删除。

<!--
By default, a Job will run uninterrupted unless a Pod fails (`restartPolicy=Never`) or a Container exits in error (`restartPolicy=OnFailure`), at which point the Job defers to the
`.spec.backoffLimit` described above. Once `.spec.backoffLimit` has been reached the Job will be marked as failed and any running Pods will be terminated.
-->

默认情况下，除非 pod 失败（`restartPolicy=Never`）或容器错误退出（`restartPolicy=OnFailure`），否则 Job 将不会被中断运行。Job 中断将遵循上面介绍的 `.spec.backoffLimit`。一旦 `.spec.backoffLimit` 达到，Job 将被标记为失败，企鹅别所有正运行的 pod 将被终止。

<!--
Another way to terminate a Job is by setting an active deadline.
Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds.
The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status will become `type: Failed` with `reason: DeadlineExceeded`.
-->

终止 Job 的另一种方式是设置有限期限。通过设置 Job 对象的 `.spec.activeDeadlineSeconds` 字段为秒数来达到。`activeDeadlineSeconds` 适用于 Job 存在期间，不管有多少 pod 被创建。一旦 Job 达到 `activeDeadlineSeconds`，所有运行中的 pod将被终止，并且 Job 的状态将变成 `type: Failed` 与 `reason: DeadlineExceeded`。

<!--
Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`. Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.
-->

请注意，Job 的 `.spec.activeDeadlineSeconds` 配置优先于 `.spec.backoffLimit` 配置。因此，重试一个或多个失败 pod 的 Job 在达到 `activeDeadlineSeconds` 指定的时间限制前，不会部署其他的 pod，即使 `backoffLimit` 尚未达到。

<!--
Example:
-->

例子：

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
-->

请注意，Job 对象中的 Job 规范和 [Pod 模板规范](/docs/concepts/workloads/pods/init-containers/#detailed-behavior)都有 `activeDeadlineSeconds` 字段。确保将此字段设置在适当的层级。

<!--
## Clean Up Finished Jobs Automatically
-->

## 自动清理已完成的 Job

<!--
Finished Jobs are usually no longer needed in the system. Keeping them around in
the system will put pressure on the API server. If the Jobs are managed directly
by a higher level controller, such as
[CronJobs](/docs/concepts/workloads/controllers/cron-jobs/), the Jobs can be
cleaned up by CronJobs based on the specified capacity-based cleanup policy.
-->

系统中已完成的 Job 通常不再需要。将它们保留在系统中将会给 API 服务器带来压力。如果 Job 由更高级别的控制器管理，比如 [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)，则 Job 可以由 CronJobs 基于指定的基于容量的清理策略来进行清除。

<!--
### TTL Mechanism for Finished Jobs
-->

### 已完成 Job 的 TTL 机制

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

<!--
Another way to clean up finished Jobs (either `Complete` or `Failed`)
automatically is to use a TTL mechanism provided by a
[TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) for
finished resources, by specifying the `.spec.ttlSecondsAfterFinished` field of
the Job.
-->

清理已完成 Job（`Complete` 或 `Failed`）的另一个方式是通过使用 [TTL 控制器](/docs/concepts/workloads/controllers/ttlafterfinished/)提供的 TTL 机制，TTL 通过指定 Job 的 `.spec.ttlSecondsAfterFinished` 字段来清理已完成资源。

<!--
When the TTL controller cleans up the Job, it will delete the Job cascadingly,
i.e. delete its dependent objects, such as Pods, together with the Job. Note
that when the Job is deleted, its lifecycle guarantees, such as finalizers, will
be honored.
-->

当 TTL 控制器清理 Job 时，它将级联删除 Job，即删除它的依赖对象，比如 pod 将和 Job 一起被删除。请注意，当 Job 被删除后，它的生命周期保证，如终结者，将被触发。

<!--
For example:
-->

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
-->

`pi-with-ttl` Job 在完成后 100 秒就会自动删除掉。

<!--
If the field is set to `0`, the Job will be eligible to be automatically deleted
immediately after it finishes. If the field is unset, this Job won't be cleaned
up by the TTL controller after it finishes.
-->

如果该字段设为为 `0`，那么 Job 将在完成后立即被自动删除掉。如果该字段未设置，则 Job 在完成后将不会被 TTL 控制器清理掉。

<!--
Note that this TTL mechanism is alpha, with feature gate `TTLAfterFinished`. For
more information, see the documentation for
[TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) for
finished resources.
-->

请注意，此 TTL 机制处于 alpha 阶段，由 `TTLAfterFinished` 功能门控制是否启动。有关详细信息，请参阅 [TTL 控制器](/docs/concepts/workloads/controllers/ttlafterfinished/)中关于已完成资源的处理。

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

Job 对象可用于支持 pod 的可靠并行执行。Job 对象并非设计为支持紧密通信的并行过程（常见于科学计算领域）。它被用于支持一组独立但相关的*工作项*的并行处理。这些可能是要发送的电子邮件，要渲染的帧，要编码转换的文件，要扫描的 NoSQL 数据库中一段范围内的键等等。

<!--
In a complex system, there may be multiple different sets of work items.  Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.
-->

在复杂的系统中，可能会有多个不同的工作项集。这里我们只考虑用户想要一起管理一组工作项 &mdash; *批处理任务*。

<!--
There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:
-->

并行计算有几种不同的模式，每种都有各自的优缺点。权衡点如下：

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

- 一个 Job 对象处理一个工作项，还是一个 Job 对象处理所有的工作项。后者适用于有大量工作项的场景。前者在管理大量 Job 对象时会对用户和系统带来一些开销。
- 创建和工作项数量一样多的 pod，还是一个 pod 处理多个工作项。前者通常对现有代码和容器进行较少的修改。后者更适用于处理大量工作项（理由和前一条的相似）。
- 几种方法使用工作队列。这需要运行一个队列服务，并对现有的程序和容器进行修改以使其能够使用工作队列。其他方法更容易适应现有的容器化应用程序。


<!--
The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.
-->

权衡总结如下表，第 2 至 4 列对应上面的权衡点。模式名称也是样例和详细描述的链接。

<!--
|                            Pattern                                   | Single Job object | Fewer pods than work items? | Use app unmodified? |  Works in Kube 1.1? |
| -------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Job Template Expansion](/docs/tasks/job/parallel-processing-expansion/)            |                   |                             |          ✓          |          ✓          |
| [Queue with Pod Per Work Item](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |         ✓         |                             |      sometimes      |          ✓          |
| [Queue with Variable Pod Count](/docs/tasks/job/fine-parallel-processing-work-queue/)  |         ✓         |             ✓               |                     |          ✓          |
| Single Job with Static Work Assignment                               |         ✓         |                             |          ✓          |
                     |
-->

|                            模式                                   | 单个 Job 对象 | 比工作项更少的 pod？ | 使用未修改的 app？ |  Kube 1.1 中生效？ |
| -------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Job 模板扩展](/docs/tasks/job/parallel-processing-expansion/)            |                   |                             |          ✓          |          ✓          |
| [一个项对应一个 pod 的队列](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |         ✓         |                             |      有时      |          ✓          |
| [具有可变 pod 数量的队列](/docs/tasks/job/fine-parallel-processing-work-queue/)  |         ✓         |             ✓               |                     |          ✓          |
| 具有静态工作分配的单个 Job                               |         ✓         |                             |          ✓          |                     |

<!--
When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).  This means that
all pods for a task will have the same command line and the same
image, the same volumes, and (almost) the same environment variables.  These patterns
are different ways to arrange for pods to work on different things.
-->

当使用 `.spec.completions` 指定完成数时，由 Job 控制器创建的每个 pod 都有一个相同的 [`规范`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。这意味着一个任务的所有 pod 将有相同的命令行和镜像，相同的卷以及（几乎）相同的环境变量。这些模式通过不同的方式安排 pod 去处理不同的任务。

<!--
This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.
-->

下表列出了每种模式下对 `.spec.parallelism` 和 `.spec.completions` 需要做的设置。

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
| [Job 模板扩展](/docs/tasks/job/parallel-processing-expansion/)           |          1          |     应该为 1      |
| [一个项对应一个 pod 的队列](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |          W          |        任意           |
| [具有可变 pod 数量的队列](/docs/tasks/job/fine-parallel-processing-work-queue/)  |          1          |        任意           |
| 具有静态工作分配的单个 Job                              |          W          |        任意           |

<!--
## Advanced Usage
-->

## 高级用法

<!--
### Specifying your own pod selector
-->

### 指定你的 pod 选择器

<!--
Normally, when you create a Job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the Job is created.
It picks a selector value that will not overlap with any other jobs.
-->

通常，在创建 Job 对象时，不用指定 `.spec.selector`。系统的默认逻辑会在创建 Job 时添加这个字段。它会选择一个不会和其他 pod 重叠的选择器。

<!--
However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the Job.
-->

但是，在某些情况下，你可能需要去覆盖默认设置的选择器。为此，你需要指定 Job 的 `.spec.selector`。

<!--
Be very careful when doing this.  If you specify a label selector which is not
unique to the pods of that Job, and which matches unrelated Pods, then pods of the unrelated
job may be deleted, or this Job may count other Pods as completing it, or one or both
Jobs may refuse to create Pods or run to completion.  If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their Pods may behave
in unpredictable ways too.  Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.
-->

当设置时需要特别小心。如果你指定的标签选择器不是 Job 的 pod 所独有的，并且匹配到了不相关的 pod，那么不相关 Job 的 pod 可能会被删除，或此 Job 可能将其他 pod 统计为已完成，或者其中一个或两个 Job 可能拒绝创建 pod 或运行完成。如果一个选择了非唯一的选择器，则其他的控制器（比如 ReplicationController）和它的 pod 的行为也将是不可预测的。当指定了 `.spec.selector`，Kubernetes将不会阻止你产生错误。

<!--
Here is an example of a case when you might want to use this feature.
-->

下面的例子描述了你想要使用该功能的场景。

<!--
Say Job `old` is already running.  You want existing Pods
to keep running, but you want the rest of the Pods it creates
to use a different pod template and for the Job to have a new name.
You cannot update the Job because these fields are not updatable.
Therefore, you delete Job `old` but _leave its pods
running_, using `kubectl delete jobs/old --cascade=false`.
Before deleting it, you make a note of what selector it uses:
-->

假设 `old` Job 已经在运行了。你想要运行中的 pod 保持运行，但是你想 Job 创建的其他 pod 使用不同的 pod 模板，并使 Job 具有一个新的名称。你不能更新 Job 对象，因为这些字段是不可更新的。因此，你需要删除 `old` 但是_让它的 pod 运行_，可以使用 `kubectl delete jobs/old --cascade=false` 命令。在删除之前，你需要记下它所使用的选择器：

```
kubectl get job old -o yaml
```
```
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
-->

然后使用新名称 `new` 创建一个新的 Job ，并且显示指定相同的选择器。由于现有的 pod 具有 `controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002` 标签，它们也受 `new` Job 的控制。

<!--
You need to specify `manualSelector: true` in the new Job since you are not using
the selector that the system normally generates for you automatically.
-->

由于你不再使用系统通常为你自动生成的选择器，你需要在新的 Job 中指定 `manualSelector: true`。

```
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
`manualSelector: true` tells the system to that you know what you are doing and to allow this
mismatch.
-->

新的 Job 本身将具有一个与 `a8f3d00d-c6d2-11e5-9f87-42010af00002` 不通的 uid。设置 `manualSelector: true` 来告诉系统你知道自己在做什么，并使其允许这种不匹配。

<!--
## Alternatives
-->

## 备选方案

<!--
### Bare Pods
-->

### 裸 pod

<!--
When the node that a Pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new Pods to replace terminated ones.
For this reason, we recommend that you use a Job rather than a bare Pod, even if your application
requires only a single Pod.
-->

当 pod 所在节点重启或发生故障时，pod 将终止并且不会重启。然后，Job 将创建新的 pod 替换终止的 pod。因此，即使你的应用仅需要一个 pod，我们还是推荐使用 Job 而不是裸 pod。

<!--
### Replication Controller
-->

### 副本控制器

<!--
Jobs are complementary to [Replication Controllers](/docs/user-guide/replication-controller).
A Replication Controller manages Pods which are not expected to terminate (e.g. web servers), and a Job
manages Pods that are expected to terminate (e.g. batch tasks).
-->

Job 是[副本控制器](/docs/user-guide/replication-controller)的补充。副本控制器管理预期不会终止的 pod（比如 web 服务器），而 Job 管理预期将会终止的 pod（比如批处理任务）。

<!--
As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate
for pods with `RestartPolicy` equal to `OnFailure` or `Never`.
(Note: If `RestartPolicy` is not set, the default value is `Always`.)
-->

正如在 [Pod 生命周期](/docs/concepts/workloads/pods/pod-lifecycle/)中所讨论的，`Job` *仅*适用于具有 `RestartPolicy` 值为 `OnFailure` 或 `Never` 的 pod。（注意：如果 `RestartPolicy` 未指定，默认值为 `Always`。）

<!--
### Single Job starts Controller Pod
-->

### 单 Job 启动控制 pod

<!--
Another pattern is for a single Job to create a Pod which then creates other Pods, acting as a sort
of custom controller for those Pods.  This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.
-->

单个 Job 的另一种模式是创建一个创建其他 pod 的 pod，充当这些 pod 的一种自定义控制器。这提供了更大的灵活性，但是入门起来可能有点复杂，并且与 Kubernetes 的集成较少。

<!--
One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/spark/README.md)), runs a spark
driver, and then cleans up.
-->

这种模式的一个样例是：一个 Job 启动一个 pod 来运行一个脚本，该脚本依次启动 Spark 主控制器（参阅 [spark 例子](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/spark/README.md)），并运行 spark 驱动，然后进行清理。

<!--
An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but complete control over what Pods are created and how work is assigned to them.
-->

这种方法的优点是整个过程可以获取 Job 对象的完成保证，不是完全控制 pod 的创建以及如何将工作分配给 pod。

## Cron Jobs {#cron-jobs}

<!--
You can use a [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/) to create a Job that will run at specified times/dates, similar to the Unix tool `cron`.
-->

你可以使用 [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/) 来创建一个会在指定的时间/日期执行的 Job，类似于 Unix 工具 `cron`。

{{% /capture %}}
