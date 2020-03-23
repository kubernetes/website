---
title: 使用扩展进行并行处理
content_template: templates/concept
min-kubernetes-server-version: v1.8
weight: 20
---

<!--
---
title: Parallel Processing using Expansions
content_template: templates/concept
min-kubernetes-server-version: v1.8
weight: 20
---
-->

{{% capture overview %}}

<!--
In this example, we will run multiple Kubernetes Jobs created from
a common template.  You may want to be familiar with the basic,
non-parallel, use of [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) first.
-->
在这个示例中，我们将运行从一个公共模板创建的多个 Kubernetes Job。您可能需要先熟悉 [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的基本概念、非并行以及如何使用它。

{{% /capture %}}


{{% capture body %}}

<!--
## Basic Template Expansion
-->

## 基本模板扩展

<!--
First, download the following template of a job to a file called `job-tmpl.yaml`
-->
首先，将以下作业模板下载到名为 `job-tmpl.yaml` 的文件中。

{{< codenew file="application/job/job-tmpl.yaml" >}}

<!--
Unlike a *pod template*, our *job template* is not a Kubernetes API type.  It is just
a yaml representation of a Job object that has some placeholders that need to be filled
in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.
-->
与 *pod 模板*不同，我们的 *job 模板*不是 Kubernetes API 类型。它只是 Job 对象的 yaml 表示，
YAML 文件有一些占位符，在使用它之前需要填充这些占位符。`$ITEM` 语法对 Kubernetes 没有意义。

<!--
In this example, the only processing the container does is to `echo` a string and sleep for a bit.
In a real use case, the processing would be some substantial computation, such as rendering a frame
of a movie, or processing a range of rows in a database.  The `$ITEM` parameter would specify for
example, the frame number or the row range.
-->
在这个例子中，容器所做的唯一处理是 `echo` 一个字符串并睡眠一段时间。
在真实的用例中，处理将是一些重要的计算，例如渲染电影的一帧，或者处理数据库中的若干行。这时，`$ITEM` 参数将指定帧号或行范围。

<!--
This Job and its Pod template have a label: `jobgroup=jobexample`.  There is nothing special
to the system about this label.  This label
makes it convenient to operate on all the jobs in this group at once.
We also put the same label on the pod template so that we can check on all Pods of these Jobs
with a single command.
After the job is created, the system will add more labels that distinguish one Job's pods
from another Job's pods.
Note that the label key `jobgroup` is not special to Kubernetes. You can pick your own label scheme.
-->
这个 Job 及其 Pod 模板有一个标签: `jobgroup=jobexample`。这个标签在系统中没有什么特别之处。
这个标签使得我们可以方便地同时操作组中的所有作业。
我们还将相同的标签放在 pod 模板上，这样我们就可以用一个命令检查这些 Job 的所有 pod。
创建作业之后，系统将添加更多的标签来区分一个 Job 的 pod 和另一个 Job 的 pod。
注意，标签键 `jobgroup` 对 Kubernetes 并无特殊含义。您可以选择自己的标签方案。

<!--
Next, expand the template into multiple files, one for each item to be processed.
-->
下一步，将模板展开到多个文件中，每个文件对应要处理的项。

```shell
# 下载 job-templ.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml

# 创建临时目录，并且在目录中创建 job yaml 文件
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

<!--
Check if it worked:
-->
检查是否工作正常：

```shell
ls jobs/
```

<!--
The output is similar to this:
-->
输出类似以下内容：

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

<!--
Here, we used `sed` to replace the string `$ITEM` with the loop variable.
You could use any type of template language (jinja2, erb) or write a program
to generate the Job objects.
-->
在这里，我们使用 `sed` 将字符串 `$ITEM` 替换为循环变量。
您可以使用任何类型的模板语言(jinja2, erb) 或编写程序来生成 Job 对象。

<!--
Next, create all the jobs with one kubectl command:
-->
接下来，使用 kubectl 命令创建所有作业：

```shell
kubectl create -f ./jobs
```

<!--
The output is similar to this:
-->
输出类似以下内容：

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

<!--
Now, check on the jobs:
-->
现在，检查这些作业：

```shell
kubectl get jobs -l jobgroup=jobexample
```

<!--
The output is similar to this:
-->
输出类似以下内容：

```
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        20s
process-item-banana   1/1           12s        20s
process-item-cherry   1/1           12s        20s
```

<!--
Here we use the `-l` option to select all jobs that are part of this
group of jobs.  (There might be other unrelated jobs in the system that we
do not care to see.)
-->
在这里，我们使用 `-l` 选项选择属于这组作业的所有作业。(系统中可能还有其他不相关的工作，我们不想看到。)

<!--
We can check on the pods as well using the same label selector:
-->
使用同样的标签选择器，我们还可以检查 pods：

```shell
kubectl get pods -l jobgroup=jobexample
```

<!--
The output is similar to this:
-->
输出类似以下内容：

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

<!--
We can use this single command to check on the output of all jobs at once:
-->
我们可以使用以下操作命令一次性地检查所有作业的输出：

```shell
kubectl logs -f -l jobgroup=jobexample
```

<!--
The output is:
-->
输出内容为：

```
Processing item apple
Processing item banana
Processing item cherry
```

<!--
## Multiple Template Parameters
-->

## 多个模板参数

<!--
In the first example, each instance of the template had one parameter, and that parameter was also
used as a label.  However label keys are limited in [what characters they can
contain](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).
-->
在第一个示例中，模板的每个实例都有一个参数，该参数也用作标签。
但是标签的键名在[可包含的字符](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)方面有一定的约束。

<!--
This slightly more complex example uses the jinja2 template language to generate our objects.
We will use a one-line python script to convert the template to a file.
-->
这个稍微复杂一点的示例使用 jinja2 模板语言来生成我们的对象。
我们将使用一行 python 脚本将模板转换为文件。

<!--
First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:
-->
首先，粘贴 Job 对象的以下模板到一个名为 `job.yaml.jinja2` 的文件中：

```liquid
{%- set params = [{ "name": "apple", "url": "https://www.orangepippin.com/varieties/apples", },
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

```

<!--
The above template defines parameters for each job object using a list of
python dicts (lines 1-4).  Then a for loop emits one job yaml object
for each set of parameters (remaining lines).
We take advantage of the fact that multiple yaml documents can be concatenated
with the `---` separator (second to last line).
.)  We can pipe the output directly to kubectl to
create the objects.
-->
上面的模板使用 python 字典列表（第 1-4 行）定义每个作业对象的参数。
然后使用 for 循环为每组参数（剩余行）生成一个作业 yaml 对象。
我们利用了多个 yaml 文档可以与 `---` 分隔符连接的事实（倒数第二行）。
我们可以将输出直接传递给 kubectl 来创建对象。

<!--
You will need the jinja2 package if you do not already have it: `pip install --user jinja2`.
Now, use this one-line python program to expand the template:
-->
如果您还没有 jinja2 包则需要安装它: `pip install --user jinja2`。
现在，使用这个一行 python 程序来展开模板:

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```


<!--
The output can be saved to a file, like this:
-->
输出可以保存到一个文件，像这样：

```shell
cat job.yaml.jinja2 | render_template > jobs.yaml
```

<!--
Or sent directly to kubectl, like this:
-->
或直接发送到 kubectl，如下所示：

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

<!--
## Alternatives
-->
## 替代方案

<!--
If you have a large number of job objects, you may find that:
-->
如果您有大量作业对象，您可能会发现：

<!--
- Even using labels, managing so many Job objects is cumbersome.
- You exceed resource quota when creating all the Jobs at once,
  and do not want to wait to create them incrementally.
- Very large numbers of jobs created at once overload the
  Kubernetes apiserver, controller, or scheduler.
-->

- 即使使用标签，管理这么多 Job 对象也很麻烦。
- 在一次创建所有作业时，您超过了资源配额，可是您也不希望以递增方式创建 Job 并等待其完成。
- 同时创建大量作业会使 Kubernetes apiserver、控制器或者调度器负压过大。
  

<!--
In this case, you can consider one of the
other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
-->
在这种情况下，您可以考虑其他的[作业模式](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns)。

{{% /capture %}}
