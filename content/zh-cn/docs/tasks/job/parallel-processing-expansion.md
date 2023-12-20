---
title: 使用展开的方式进行并行处理
content_type: task
min-kubernetes-server-version: v1.8
weight: 50
---
<!--
title: Parallel Processing using Expansions
content_type: task
min-kubernetes-server-version: v1.8
weight: 50
-->

<!-- overview -->

<!--
This task demonstrates running multiple {{< glossary_tooltip text="Jobs" term_id="job" >}}
based on a common template. You can use this approach to process batches of work in
parallel.

For this example there are only three items: _apple_, _banana_, and _cherry_.
The sample Jobs process each item by printing a string then pausing.

See [using Jobs in real workloads](#using-jobs-in-real-workloads) to learn about how
this pattern fits more realistic use cases.
-->

本任务展示基于一个公共的模板运行多个{{< glossary_tooltip text="Jobs" term_id="job" >}}。
你可以用这种方法来并行执行批处理任务。

在本任务示例中，只有三个工作条目：**apple**、**banana** 和 **cherry**。
示例任务处理每个条目时打印一个字符串之后结束。

参考[在真实负载中使用 Job](#using-jobs-in-real-workloads)了解更适用于真实使用场景的模式。

## {{% heading "prerequisites" %}}

<!--
You should be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你应先熟悉基本的、非并行的 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
的用法。

{{< include "task-tutorial-prereqs.md" >}}

<!--
For basic templating you need the command-line utility `sed`.

To follow the advanced templating example, you need a working installation of
[Python](https://www.python.org/), and the Jinja2 template
library for Python.

Once you have Python set up, you can install Jinja2 by running:
-->
任务中的基本模板示例要求安装命令行工具 `sed`。
要使用较高级的模板示例，你需要安装 [Python](https://www.python.org/)，
并且要安装 Jinja2 模板库。

一旦 Python 已经安装好，你可以运行下面的命令安装 Jinja2：

```shell
pip install --user jinja2
```

<!-- steps -->

<!--
## Create Jobs based on a template
-->

## 基于模板创建 Job  {#create-jobs-based-on-a-template}

<!--
First, download the following template of a job to a file called `job-tmpl.yaml`
-->
首先，将以下作业模板下载到名为 `job-tmpl.yaml` 的文件中。

{{% code_sample file="application/job/job-tmpl.yaml" %}}

```shell
 # 使用 curl 下载 job-tmpl.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

<!--
The file you downloaded is not yet a valid Kubernetes
{{< glossary_tooltip text="manifest" term_id="manifest" >}}.
Instead that template is a YAML representation of a Job object with some placeholders
that need to be filled in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.
-->
你所下载的文件不是一个合法的 Kubernetes {{< glossary_tooltip text="清单" term_id="manifest" >}}。
这里的模板只是 Job 对象的 yaml 表示，其中包含一些占位符，在使用它之前需要被填充。
`$ITEM` 语法对 Kubernetes 没有意义。

<!--
### Create manifests from the template

The following shell snippet uses `sed` to replace the string `$ITEM` with the loop
variable, writing into a temporary directory named `jobs`. Run this now:
-->
### 基于模板创建清单

下面的 Shell 代码片段使用 `sed` 将字符串 `$ITEM` 替换为循环变量，
并将结果写入到一个名为 `jobs` 的临时目录。

```shell
# 展开模板文件到多个文件中，每个文件对应一个要处理的条目
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

<!--
Check if it worked:
-->
检查上述脚本的输出：

```shell
ls jobs/
```

<!--
The output is similar to this:
-->
输出类似于：

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

<!--
You could use any type of template language (for example: Jinja2; ERB), or
write a program to generate the Job manifests.
-->
你可以使用任何一种模板语言（例如：Jinja2、ERB），或者编写一个程序来
生成 Job 清单。

<!--
### Create Jobs from the manifests

Next, create all the Jobs with one kubectl command:
-->
### 基于清单创建 Job

接下来用一个 kubectl 命令创建所有的 Job：

```shell
kubectl create -f ./jobs
```

<!--
The output is similar to this:
-->

输出类似于：

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

<!--
Now, check on the jobs:
-->
现在检查 Job：

```shell
kubectl get jobs -l jobgroup=jobexample
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        22s
process-item-banana   1/1           12s        21s
process-item-cherry   1/1           12s        20s
```

<!--
Using the `-l` option to kubectl selects only the Jobs that are part
of this group of jobs (there might be other unrelated jobs in the system).

You can check on the Pods as well using the same
{{< glossary_tooltip text="label selector" term_id="selector" >}}:
-->
使用 kubectl 的 `-l` 选项可以仅选择属于当前 Job 组的对象
（系统中可能存在其他不相关的 Job）。

你可以使用相同的 {{< glossary_tooltip text="标签选择算符" term_id="selector" >}}
来过滤 Pods：

```shell
kubectl get pods -l jobgroup=jobexample
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

<!--
We can use this single command to check on the output of all jobs at once:
-->
我们可以用下面的命令查看所有 Job 的输出：

```shell
kubectl logs -f -l jobgroup=jobexample
```

<!--
The output should be:
-->
输出类似于：

```
Processing item apple
Processing item banana
Processing item cherry
```

<!--
### Clean up {#cleanup-1}
-->
### 清理 {#cleanup-1}

```shell
# 删除所创建的 Job
# 集群会自动清理 Job 对应的 Pod
kubectl delete job -l jobgroup=jobexample
```

<!--
## Use advanced template parameters

In the [first example](#create-jobs-based-on-a-template), each instance of the template had one
parameter, and that parameter was also used in the Job's name. However,
[names](/docs/concepts/overview/working-with-objects/names/#names) are restricted
to contain only certain characters.
-->
## 使用高级模板参数

在[第一个例子](#create-jobs-based-on-a-template)中，模板的每个示例都有一个参数
而该参数也用在 Job 名称中。不过，对象
[名称](/zh-cn/docs/concepts/overview/working-with-objects/names/#names)
被限制只能使用某些字符。

<!--
This slightly more complex example uses the
[Jinja template language](https://palletsprojects.com/p/jinja/) to generate manifests
and then objects from those manifests, with a multiple parameters for each Job.

For this part of the task, you are going to use a one-line Python script to
convert the template to a set of manifests.

First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:
-->
这里的略微复杂的例子使用 [Jinja 模板语言](https://palletsprojects.com/p/jinja/)
来生成清单，并基于清单来生成对象，每个 Job 都有多个参数。

在本任务中，你将会使用一个一行的 Python 脚本，将模板转换为一组清单文件。

首先，复制下面的 Job 对象模板到一个名为 `job.yaml.jinja2` 的文件。

```liquid
{% set params = [{ "name": "apple", "url": "http://dbpedia.org/resource/Apple", },
                  { "name": "banana", "url": "http://dbpedia.org/resource/Banana", },
                  { "name": "cherry", "url": "http://dbpedia.org/resource/Cherry" }]
%}
{% for p in params %}
{% set name = p["name"] %}
{% set url = p["url"] %}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox:1.28
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
{% endfor %}
```

<!--
The above template defines two parameters for each Job object using a list of
python dicts (lines 1-4). A `for` loop emits one Job manifest for each
set of parameters (remaining lines).

This example relies on a feature of YAML. One YAML file can contain multiple
documents (Kubernetes manifests, in this case), separated by `---` on a line
by itself.
You can pipe the output directly to `kubectl` to create the Jobs.

Next, use this one-line Python program to expand the template:
-->
上面的模板使用 python 字典列表（第 1-4 行）定义每个作业对象的参数。
然后使用 for 循环为每组参数（剩余行）生成一个作业 yaml 对象。
我们利用了多个 YAML 文档（这里的 Kubernetes 清单）可以用 `---` 分隔符连接的事实。
我们可以将输出直接传递给 kubectl 来创建对象。

接下来我们用单行的 Python 程序将模板展开。

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

<!--
Use `render_template` to convert the parameters and template into a single
YAML file containing Kubernetes manifests:
-->
使用 `render_template` 将参数和模板转换成一个 YAML 文件，其中包含 Kubernetes
资源清单：

<!--
```shell
# This requires the alias you defined earlier
cat job.yaml.jinja2 | render_template > jobs.yaml
```
-->
```shell
# 此命令需要之前定义的别名
cat job.yaml.jinja2 | render_template > jobs.yaml
```

<!--
You can view `jobs.yaml` to verify that the `render_template` script worked
correctly.

Once you are happy that `render_template` is working how you intend,
you can pipe its output into `kubectl`:
-->
你可以查看 `jobs.yaml` 以验证 `render_template` 脚本是否正常工作。

当你对输出结果比较满意时，可以用管道将其输出发送给 kubectl，如下所示：

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

<!--
Kubernetes accepts and runs the Jobs you created.
-->
Kubernetes 接收清单文件并执行你所创建的 Job。

<!--
### Clean up {#cleanup-2}
```shell
# Remove the Jobs you created
# Your cluster automatically cleans up their Pods
kubectl delete job -l jobgroup=jobexample
```
-->
### 清理   {#cleanup-2}

```shell
# 删除所创建的 Job
# 集群会自动清理 Job 对应的 Pod
kubectl delete job -l jobgroup=jobexample
```


<!-- discussion -->

<!--
## Using Jobs in real workloads

In a real use case, each Job performs some substantial computation, such as rendering a frame
of a movie, or processing a range of rows in a database. If you were rendering a movie
you would set `$ITEM` to the frame number. If you were processing rows from a database
table, you would set `$ITEM` to represent the range of database rows to process.

In the task, you ran a command to collect the output from Pods by fetching
their logs. In a real use case, each Pod for a Job writes its output to
durable storage before completing. You can use a PersistentVolume for each Job,
or an external storage service. For example, if you are rendering frames for a movie,
use HTTP to `PUT` the rendered frame data to a URL, using a different URL for each
frame.
-->
## 在真实负载中使用 Job {#using-jobs-in-real-workloads}

在真实的负载中，每个 Job 都会执行一些重要的计算，例如渲染电影的一帧，
或者处理数据库中的若干行。这时，`$ITEM` 参数将指定帧号或行范围。

在此任务中，你运行一个命令通过取回 Pod 的日志来收集其输出。
在真实应用场景中，Job 的每个 Pod 都会在结束之前将其输出写入到某持久性存储中。
你可以为每个 Job 指定 PersistentVolume 卷，或者使用其他外部存储服务。
例如，如果你在渲染视频帧，你可能会使用 HTTP 协议将渲染完的帧数据
用 'PUT' 请求发送到某 URL，每个帧使用不同的 URl。

<!--
## Labels on Jobs and Pods

After you create a Job, Kubernetes automatically adds additional
{{< glossary_tooltip text="labels" term_id="label" >}} that
distinguish one Job's pods from another Job's pods.

In this example, each Job and its Pod template have a label:
`jobgroup=jobexample`.

Kubernetes itself pays no attention to labels named `jobgroup`. Setting a label
for all the Jobs you create from a template makes it convenient to operate on all
those Jobs at once.
In the [first example](#create-jobs-based-on-a-template) you used a template to
create several Jobs. The template ensures that each Pod also gets the same label, so
you can check on all Pods for these templated Jobs with a single command.
-->
## Job 和 Pod 上的标签

你创建了 Job 之后，Kubernetes 自动为 Job 的 Pod 添加
{{< glossary_tooltip text="标签" term_id="label" >}}，以便能够将一个 Job
的 Pod 与另一个 Job 的 Pod 区分开来。

在本例中，每个 Job 及其 Pod 模板有一个标签：`jobgroup=jobexample`。

Kubernetes 自身对标签名 `jobgroup` 没有什么要求。
为创建自同一模板的所有 Job 使用同一标签使得我们可以方便地同时操作组中的所有作业。
在[第一个例子](#create-jobs-based-on-a-template)中，你使用模板来创建了若干 Job。
模板确保每个 Pod 都能够获得相同的标签，这样你可以用一条命令检查这些模板化
Job 所生成的全部 Pod。

<!--
The label key `jobgroup` is not special or reserved.
You can pick your own labelling scheme.
There are [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels)
that you can use if you wish.
-->
{{< note >}}
标签键 `jobgroup` 没什么特殊的，也不是保留字。 你可以选择你自己的标签方案。
如果愿意，有一些[建议的标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)
可供使用。
{{< /note >}}

<!--
## Alternatives

If you plan to create a large number of Job objects, you may find that:
-->
## 替代方案

如果你有计划创建大量 Job 对象，你可能会发现：

<!--
- Even using labels, managing so many Job objects is cumbersome.
- If you create many Jobs in a batch, you might place high load
  on the Kubernetes control plane. Alternatively, the Kubernetes API
  server could rate limit you, temporarily rejecting your requests with a 429 status.
- You are limited by a {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
  on Jobs: the API server permanently rejects some of your requests
  when you create a great deal of work in one batch.
-->
- 即使使用标签，管理这么多 Job 对象也很麻烦。
- 如果你一次性创建很多 Job，很可能会给 Kubernetes 控制面带来很大压力。
  一种替代方案是，Kubernetes API 可能对请求施加速率限制，通过 429 返回
  状态值临时拒绝你的请求。
- 你可能会受到 Job 相关的{{< glossary_tooltip text="资源配额" term_id="resource-quota" >}}
  限制：如果你在一个批量请求中触发了太多的任务，API 服务器会永久性地拒绝你的某些请求。

<!--
There are other [job patterns](/docs/concepts/workloads/controllers/job/#job-patterns)
that you can use to process large amounts of work without creating very many Job
objects.

You could also consider writing your own [controller](/docs/concepts/architecture/controller/)
to manage Job objects automatically.
-->
还有一些其他[作业模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)
可供选择，这些模式都能用来处理大量任务而又不会创建过多的 Job 对象。

你也可以考虑编写自己的[控制器](/zh-cn/docs/concepts/architecture/controller/)
来自动管理 Job 对象。
