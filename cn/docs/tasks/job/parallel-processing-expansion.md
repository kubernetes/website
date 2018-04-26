<!--
title: Parallel Processing using Expansions
---
-->
---
title: 使用扩展并行处理
---

* TOC
{:toc}
<!--

# Example: Multiple Job Objects from Template Expansion

In this example, we will run multiple Kubernetes Jobs created from a common template.  You may want to be familiar with the basic, non-parallel, use of [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/) first.

-->

# 示例：使用扩展模板创建多个 Job 对象

在本示例中，我们将使用同一个模板创建多个 Kubernetes job。这可能需要您先熟悉下如何使用普通的非并行的 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)。

<!--

## Basic Template Expansion

First, download the following template of a job to a file called `job.yaml`

-->

## 基本扩展模板

首先，下载下面的名为 `job.yaml` 的 Job 模板文件。

{% include code.html language="yaml" file="job.yaml" ghlink="/docs/tasks/job/parallel-processing-expansion/job.yaml" %}

<!--

Unlike a *pod template*, our *job template* is not a Kubernetes API type.  It is just a yaml representation of a Job object that has some placeholders that need to be filled in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.

-->

与 *pod 的模板* 不同， job 模板不是 Kubernetes API 类型。 Job 对象的 yaml 表示，这里面有很多占位符，必须填充后才能使用。`$ITEM` 语法对于 Kubernetes 来说没有意义。

<!--

In this example, the only processing the container does is to `echo` a string and sleep for a bit.
In a real use case, the processing would be some substantial computation, such as rendering a frame
of a movie, or processing a range of rows in a database.  The "$ITEM" parameter would specify for
example, the frame number or the row range.

-->

在这个例子中，容器只做了一件事，就是 `echo` 一个字符串然后休眠一会儿。在实际使用场景下，容器通常是处理一些实质的计算，例如渲染电影的画面帧，或者是处理数据库中的一系列行。“$ITEM” 参数将指定为，例如帧号或行范围。

<!--

This Job and its Pod template have a label: `jobgroup=jobexample`.  There is nothing special to the system about this label.  This label makes it convenient to operate on all the jobs in this group at once. We also put the same label on the pod template so that we can check on all Pods of these Jobs with a single command. After the job is created, the system will add more labels that distinguish one Job's pods from another Job's pods. Note that the label key `jobgroup` is not special to Kubernetes. You can pick your own label scheme.

Next, expand the template into multiple files, one for each item to be processed.

-->

该 Job 和其 Pod 的模板具有标签：`jobgroup-jobexample`。这个标签对于系统没有什么特别之处。使用标签可以很方便地一次性操作一组中的所有 Job。我们还在 pod 模板上放置了相同的标签，以便我们可以使用单个命令检查这些 Job 的所有 Pod。Job 创建好了之后，系统将添加更多的标签，将一个作业的 Pod 与另一个作业的 Pod 区分开来。请注意，`jobgroup` 标签的 key 对于 Kubernetes 来说并没有什么特别的意义。您可以选择自己的标签方案。

```shell
# Expand files into a temporary directory
mkdir ./jobs
for i in apple banana cherry
do
  cat job.yaml.txt | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

<!--

Check if it worked:

-->

查看它是否能正常工作：

```shell
$ ls jobs/
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

<!--

Here, we used `sed` to replace the string `$ITEM` with the loop variable. You could use any type of template language (jinja2, erb) or write a program to generate the Job objects.

Next, create all the jobs with one kubectl command:

-->

在此，我们使用 `sed` 命令和循环变量替换文件中的 `$ITEM` 。你可以使用任何一种模板语言（jinja2、erb）或编写程序来生成 Job 对象。

接下来，使用 kubectl 命令创建所有的 job。

```shell
$ kubectl create -f ./jobs
job "process-item-apple" created
job "process-item-banana" created
job "process-item-cherry" created
```

<!--

Now, check on the jobs:

-->

现在，检查创建的 Job：

```shell
$ kubectl get jobs -l jobgroup=jobexample
JOB                   CONTAINER(S)   IMAGE(S)   SELECTOR                               SUCCESSFUL
process-item-apple    c              busybox    app in (jobexample),item in (apple)    1
process-item-banana   c              busybox    app in (jobexample),item in (banana)   1
process-item-cherry   c              busybox    app in (jobexample),item in (cherry)   1
```

<!--

Here we use the `-l` option to select all jobs that are part of this group of jobs.  (There might be other unrelated jobs in the system that we do not care to see.)

We can check on the pods as well using the same label selector:

-->

我们使用 `-l` 选项来选择属于该 job 组的所有 job（因为系统中可能有很多其他的我们不想看到的 job）。

我们可以使用相同的标签选择器来查看 pod：

```shell
$ kubectl get pods -l jobgroup=jobexample --show-all
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

<!--

There is not a single command to check on the output of all jobs at once, but looping over all the pods is pretty easy:

-->

当前还没有办法直接使用一条命令一次性查看所有的 job 的输出，但是循环查看所有的 pod 的输出还是十分简单的：

```shell
$ for p in $(kubectl get pods -l jobgroup=jobexample --show-all -o name)
do
  kubectl logs $p
done
Processing item apple
Processing item banana
Processing item cherry
```

<!--

## Multiple Template Parameters

In the first example, each instance of the template had one parameter, and that parameter was also
used as a label.  However label keys are limited in [what characters they can contain](/docs/user-guide/labels/#syntax-and-character-set).

This slightly more complex example uses the jinja2 template language to generate our objects.
We will use a one-line python script to convert the template to a file.

First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:

-->

## 多参数模版

在第一个例子中，每个模板的实例都有一个参数，那个参数也会作为标签来使用。但是 label 的 key 受 [可以包含的字符](/docs/user-guide/labels/#syntax-and-character-set) 限制。

这个稍微复杂的例子使用 jinja2 模板语言来生成我们的对象。

我们将使用一行 python 脚本将模板转换为文件。

首先，复制粘贴下面的 Job 对象模板到 `job.yaml.jinja2` 文件中。


```liquid{% raw %}
{%- set params = [{ "name": "apple", "url": "http://www.orangepippin.com/apples", },
                  { "name": "banana", "url": "https://en.wikipedia.org/wiki/Banana", },
                  { "name": "raspberry", "url": "https://www.raspberrypi.org/" }]
%}
{%- for p in params %}
{%- set name = p["name"] %}
{%- set url = p["url"] %}
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
        image: busybox
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
---
{%- endfor %}
{% endraw %}
```

<!--

The above template defines parameters for each job object using a list of python dicts (lines 1-4).  Then a for loop emits one job yaml object for each set of parameters (remaining lines).
We take advantage of the fact that multiple yaml documents can be concatenated with the `---` separator (second to last line).  We can pipe the output directly to kubectl to create the objects.

You will need the jinja2 package if you do not already have it: `pip install --user jinja2`.
Now, use this one-line python program to expand the template:

-->

上面的模版中为每个 job 对象都定义了一个参数，这个参数使用的是 python dicst（第1-4行）。
然后使用一个 for 循环为每个参数集（接下来一行）产生一个 job yaml 对象。
我们利用了多个 yaml 文档可以使用 `---` 分隔符连接的特性（倒数第二行）。我们可以其管道输出到 kubectl 来创建对象。

您需要使用 jinja2 包，如果没有话可以该命令安装：`pip install --user jinja2`。

现在，使用这一行 python 程序来扩展模版：

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

<!--

The output can be saved to a file, like this:

-->

输出可以保存到文件中，例如：

```shell
cat job.yaml.jinja2 | render_template > jobs.yaml
```

<!--

Or sent directly to kubectl, like this:

-->

或者直接发送给 kubectl，例如：

```shell
cat job.yaml.jinja2 | render_template | kubectl create -f -
```

<!--

## Alternatives

If you have a large number of job objects, you may find that:

- Even using labels, managing so many Job objects is cumbersome.
- You exceed resource quota when creating all the Jobs at once, and do not want to wait to create them incrementally.
- You need a way to easily scale the number of pods running concurrently.  One reason would be to avoid using too many compute resources.  Another would be to limit the number of concurrent requests to a shared resource, such as a database, used by all the pods in the job.
- Very large numbers of jobs created at once overload the Kubernetes apiserver, controller, or scheduler.

In this case, you can consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).

-->

## 备选方案

如果您有大量的 job 对象，你可能会发现：

- 即使使用标签，管理这么多的 Job 对象也是很麻烦的。
- 如果一次性创建所有的 Job，超过了资源配额，但是又不想等待它们以增量的方式创建。
- 您需要一种方法来轻松缩放同时运行的 pod 数量。一个原因是为了避免使用太多的计算资源。另一个原因是为了限制对作业中所有 pod 使用的共享资源（如数据库）的并发请求数。
- 一次性创建大量的 job 将造成 Kubernetes apiserver、controller 或 scheduler 过载。

在这种情况下，您可以考虑其他 [job 模式](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns)。
