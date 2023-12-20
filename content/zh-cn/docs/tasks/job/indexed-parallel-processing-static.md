---
title: 使用索引作业完成静态工作分配下的并行处理
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---
<!-- 
title: Indexed Job for Parallel Processing with Static Work Assignment
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
-->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!-- overview -->

<!-- 
In this example, you will run a Kubernetes Job that uses multiple parallel
worker processes.
Each worker is a different container running in its own Pod. The Pods have an
_index number_ that the control plane sets automatically, which allows each Pod
to identify which part of the overall task to work on.
-->
在此示例中，你将运行一个使用多个并行工作进程的 Kubernetes Job。
每个 worker 都是在自己的 Pod 中运行的不同容器。
Pod 具有控制平面自动设置的**索引编号（index number）**，
这些编号使得每个 Pod 能识别出要处理整个任务的哪个部分。

<!-- 
The pod index is available in the {{< glossary_tooltip text="annotation" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` as a string representing its
decimal value. In order for the containerized task process to obtain this index,
you can publish the value of the annotation using the [downward API](/docs/concepts/workloads/pods/downward-api/)
mechanism.
For convenience, the control plane automatically sets the downward API to
expose the index in the `JOB_COMPLETION_INDEX` environment variable.
-->
Pod 索引在{{<glossary_tooltip text="注解" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` 中呈现，具体表示为一个十进制值字符串。
为了让容器化的任务进程获得此索引，你可以使用
[downward API](/zh-cn/docs/concepts/workloads/pods/downward-api/)
机制发布注解的值。为方便起见，
控制平面自动设置 Downward API 以在 `JOB_COMPLETION_INDEX` 环境变量中公开索引。

<!-- 
Here is an overview of the steps in this example:

1. **Define a Job manifest using indexed completion**.
   The downward API allows you to pass the pod index annotation as an
   environment variable or file to the container.
2. **Start an `Indexed` Job based on that manifest**.
-->
以下是此示例中步骤的概述：

1. **定义使用带索引完成信息的 Job 清单**。
   Downward API 使你可以将 Pod 索引注解作为环境变量或文件传递给容器。
2. **根据该清单启动一个带索引（`Indexed`）的 Job**。

## {{% heading "prerequisites" %}}

<!-- 
You should already be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你应该已经熟悉 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本的、非并行的用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!-- 
## Choose an approach
 -->
## 选择一种方法 {#choose-an-approach}

<!-- 
To access the work item from the worker program, you have a few options:

1. Read the `JOB_COMPLETION_INDEX` environment variable. The Job
   {{< glossary_tooltip text="controller" term_id="controller" >}}
   automatically links this variable to the annotation containing the completion
   index.
1. Read a file that contains the completion index.
1. Assuming that you can't modify the program, you can wrap it with a script
   that reads the index using any of the methods above and converts it into
   something that the program can use as input.
 -->
要从工作程序访问工作项，你有几个选项：

1. 读取 `JOB_COMPLETION_INDEX` 环境变量。Job
   {{< glossary_tooltip text="控制器" term_id="controller" >}}自动将此变量链接到包含完成索引的注解。
2. 读取包含完整索引的文件。
3. 假设你无法修改程序，你可以使用脚本包装它，
   该脚本使用上述任意方法读取索引并将其转换为程序可以用作输入的内容。

<!-- 
For this example, imagine that you chose option 3 and you want to run the
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) utility. This
program accepts a file as an argument and prints its content reversed.
-->
对于此示例，假设你选择了选项 3 并且想要运行
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) 实用程序。
这个程序接受一个文件作为参数并按逆序打印其内容。

```shell
rev data.txt
```

<!--  
You'll use the `rev` tool from the
[`busybox`](https://hub.docker.com/_/busybox) container image.
-->
你将使用 [`busybox`](https://hub.docker.com/_/busybox) 容器镜像中的 `rev` 工具。

<!-- 
As this is only an example, each Pod only does a tiny piece of work (reversing a short
string). In a real workload you might, for example, create a Job that represents
 the
task of producing 60 seconds of video based on scene data.
Each work item in the video rendering Job would be to render a particular
frame of that video clip. Indexed completion would mean that each Pod in
the Job knows which frame to render and publish, by counting frames from
the start of the clip.
-->
由于这只是一个例子，每个 Pod 只做一小部分工作（反转一个短字符串）。
例如，在实际工作负载中，你可能会创建一个表示基于场景数据制作 60 秒视频任务的 Job 。
此视频渲染 Job 中的每个工作项都将渲染该视频剪辑的特定帧。
索引完成意味着 Job 中的每个 Pod 都知道通过从剪辑开始计算帧数，来确定渲染和发布哪一帧。

<!-- 
## Define an Indexed Job

Here is a sample Job manifest that uses `Indexed` completion mode:
-->
## 定义索引作业 {#define-an-indexed-job}

这是一个使用 `Indexed` 完成模式的示例 Job 清单：

{{% code_sample language="yaml" file="application/job/indexed-job.yaml" %}}

<!-- 
In the example above, you use the builtin `JOB_COMPLETION_INDEX` environment
variable set by the Job controller for all containers. An [init container](/docs/concepts/workloads/pods/init-containers/)
maps the index to a static value and writes it to a file that is shared with the
container running the worker through an [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
Optionally, you can [define your own environment variable through the downward
API](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
to publish the index to containers. You can also choose to load a list of values
from a [ConfigMap as an environment variable or file](/docs/tasks/configure-pod-container/configure-pod-configmap/).
-->
在上面的示例中，你使用 Job 控制器为所有容器设置的内置 `JOB_COMPLETION_INDEX` 环境变量。
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)
将索引映射到一个静态值，并将其写入一个文件，该文件通过
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)
与运行 worker 的容器共享。或者，你可以
[通过 Downward API 定义自己的环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
将索引发布到容器。你还可以选择从
[包含 ConfigMap 的环境变量或文件](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
加载值列表。

<!-- 
Alternatively, you can directly [use the downward API to pass the annotation
value as a volume file](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields),
like shown in the following example:
-->
或者也可以直接
[使用 Downward API 将注解值作为卷文件传递](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields)，
如下例所示：

{{% code_sample language="yaml" file="application/job/indexed-job-vol.yaml" %}}

<!-- 
## Running the Job

Now run the Job:
-->
## 执行 Job {running-the-job}

现在执行 Job：

```shell
# 使用第一种方法（依赖于 $JOB_COMPLETION_INDEX）
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

<!-- 
When you create this Job, the control plane creates a series of Pods, one for each index you specified.
The value of `.spec.parallelism` determines how many can run at once whereas `.spec.completions`
determines how many Pods the Job creates in total.

Because `.spec.parallelism` is less than `.spec.completions`, the control plane waits for some
of the first Pods to complete before starting more of them.
-->
当你创建此 Job 时，控制平面会创建一系列 Pod，你指定的每个索引都会运行一个 Pod。
`.spec.parallelism` 的值决定了一次可以运行多少个 Pod，
而 `.spec.completions` 决定了 Job 总共创建了多少个 Pod。

因为 `.spec.parallelism` 小于 `.spec.completions`，
所以控制平面在启动更多 Pod 之前，将等待第一批的某些 Pod 完成。

<!--
You can wait for the Job to succeed, with a timeout:
-->
你可以等待 Job 成功，等待时间可以设置超时限制：

```shell
# 状况名称的检查不区分大小写
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

<!--
Now, describe the Job and check that it was successful.
-->
现在，描述 Job 并检查它是否成功。

```shell
kubectl describe jobs/indexed-job
```

<!-- 
The output is similar to:
-->
输出类似于：

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

<!-- 
In this example, you run the Job with custom values for each index. You can
inspect the output of one of the pods:
-->
在此示例中，你使用每个索引的自定义值运行 Job。
你可以检查其中一个 Pod 的输出：

```shell
kubectl logs indexed-job-fdhq5 # 更改它以匹配来自该 Job 的 Pod 的名称
```

<!-- 
The output is similar to:
-->
输出类似于：

```
xuq
```
