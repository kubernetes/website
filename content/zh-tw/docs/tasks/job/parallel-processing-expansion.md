---
title: 使用展開的方式進行並行處理
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

本任務展示基於一個公共的模板執行多個{{< glossary_tooltip text="Jobs" term_id="job" >}}。
你可以用這種方法來並行執行批處理任務。

在本任務示例中，只有三個工作條目：_apple_、_banana_ 和 _cherry_。
示例任務處理每個條目時列印一個字串之後結束。

參考[在真實負載中使用 Job](#using-jobs-in-real-workloads)瞭解更適用於真實使用場景的模式。

## {{% heading "prerequisites" %}}

<!--
You should be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你應先熟悉基本的、非並行的 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
的用法。

{{< include "task-tutorial-prereqs.md" >}}

<!--
For basic templating you need the command-line utility `sed`.

To follow the advanced templating example, you need a working installation of
[Python](https://www.python.org/), and the Jinja2 template
library for Python.

Once you have Python set up, you can install Jinja2 by running:
-->
任務中的基本模板示例要求安裝命令列工具 `sed`。
要使用較高階的模板示例，你需要安裝 [Python](https://www.python.org/)，
並且要安裝 Jinja2 模板庫。

一旦 Python 已經安裝好，你可以執行下面的命令安裝 Jinja2：

```shell
pip install --user jinja2
```

<!-- steps -->

<!--
## Create Jobs based on a template
-->

## 基於模板建立 Job  {#create-jobs-based-on-a-template}

<!--
First, download the following template of a job to a file called `job-tmpl.yaml`
-->
首先，將以下作業模板下載到名為 `job-tmpl.yaml` 的檔案中。

{{< codenew file="application/job/job-tmpl.yaml" >}}

```shell
 # 使用 curl 下載 job-tmpl.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

<!--
The file you downloaded is not yet a valid Kubernetes
{{< glossary_tooltip text="manifest" term_id="manifest" >}}.
Instead that template is a YAML representation of a Job object with some placeholders
that need to be filled in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.
-->
你所下載的檔案不是一個合法的 Kubernetes {{< glossary_tooltip text="清單" term_id="manifest" >}}。
這裡的模板只是 Job 物件的 yaml 表示，其中包含一些佔位符，在使用它之前需要被填充。
`$ITEM` 語法對 Kubernetes 沒有意義。

<!--
### Create manifests from the template

The following shell snippet uses `sed` to replace the string `$ITEM` with the loop
variable, writing into a temporary directory named `jobs`. Run this now:
-->
### 基於模板建立清單

下面的 Shell 程式碼片段使用 `sed` 將字串 `$ITEM` 替換為迴圈變數，並將結果
寫入到一個名為 `jobs` 的臨時目錄。

```shell
# 展開模板檔案到多個檔案中，每個檔案對應一個要處理的條目
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

<!--
Check if it worked:
-->
檢查上述指令碼的輸出：

```shell
ls jobs/
```

<!--
The output is similar to this:
-->
輸出類似於：

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

<!--
You could use any type of template language (for example: Jinja2; ERB), or
write a program to generate the Job manifests.
-->
你可以使用任何一種模板語言（例如：Jinja2、ERB），或者編寫一個程式來
生成 Job 清單。

<!--
### Create Jobs from the manifests

Next, create all the Jobs with one kubectl command:
-->
### 基於清單建立 Job

接下來用一個 kubectl 命令建立所有的 Job：

```shell
kubectl create -f ./jobs
```

<!--
The output is similar to this:
-->

輸出類似於：

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

<!--
Now, check on the jobs:
-->
現在檢查 Job：

```shell
kubectl get jobs -l jobgroup=jobexample
```

<!--
The output is similar to this:
-->
輸出類似於：

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
使用 kubectl 的 `-l` 選項可以僅選擇屬於當前 Job 組的物件
（系統中可能存在其他不相關的 Job）。

你可以使用相同的 {{< glossary_tooltip text="標籤選擇算符" term_id="selector" >}}
來過濾 Pods：

```shell
kubectl get pods -l jobgroup=jobexample
```

<!--
The output is similar to:
-->
輸出類似於：

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

<!--
We can use this single command to check on the output of all jobs at once:
-->
我們可以用下面的命令檢視所有 Job 的輸出：

```shell
kubectl logs -f -l jobgroup=jobexample
```

<!--
The output should be:
-->
輸出類似於：

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
# 刪除所建立的 Job
# 叢集會自動清理 Job 對應的 Pod
kubectl delete job -l jobgroup=jobexample
```

<!--
## Use advanced template parameters

In the [first example](#create-jobs-based-on-a-template), each instance of the template had one
parameter, and that parameter was also used in the Job's name. However,
[names](/docs/concepts/overview/working-with-objects/names/#names) are restricted
to contain only certain characters.
-->
## 使用高階模板引數

在[第一個例子](#create-jobs-based-on-a-template)中，模板的每個示例都有一個引數
而該引數也用在 Job 名稱中。不過，物件
[名稱](/zh-cn/docs/concepts/overview/working-with-objects/names/#names)
被限制只能使用某些字元。

<!--
This slightly more complex example uses the
[Jinja template language](https://palletsprojects.com/p/jinja/) to generate manifests
and then objects from those manifests, with a multiple parameters for each Job.

For this part of the task, you are going to use a one-line Python script to
convert the template to a set of manifests.

First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:
-->
這裡的略微複雜的例子使用 [Jinja 模板語言](https://palletsprojects.com/p/jinja/)
來生成清單，並基於清單來生成物件，每個 Job 都有多個引數。

在本任務中，你將會使用一個一行的 Python 指令碼，將模板轉換為一組清單檔案。

首先，複製下面的 Job 物件模板到一個名為 `job.yaml.jinja2` 的檔案。

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
上面的模板使用 python 字典列表（第 1-4 行）定義每個作業物件的引數。
然後使用 for 迴圈為每組引數（剩餘行）生成一個作業 yaml 物件。
我們利用了多個 YAML 文件（這裡的 Kubernetes 清單）可以用 `---` 分隔符連線的事實。
我們可以將輸出直接傳遞給 kubectl 來建立物件。

接下來我們用單行的 Python 程式將模板展開。

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

<!--
Use `render_template` to convert the parameters and template into a single
YAML file containing Kubernetes manifests:
-->
使用 `render_template` 將引數和模板轉換成一個 YAML 檔案，其中包含 Kubernetes
資源清單：

<!--
```shell
# This requires the alias you defined earlier
cat job.yaml.jinja2 | render_template > jobs.yaml
```
-->
```shell
# 此命令需要之前定義的別名
cat job.yaml.jinja2 | render_template > jobs.yaml
```

<!--
You can view `jobs.yaml` to verify that the `render_template` script worked
correctly.

Once you are happy that `render_template` is working how you intend,
you can pipe its output into `kubectl`:
-->
你可以檢視 `jobs.yaml` 以驗證 `render_template` 指令碼是否正常工作。

當你對輸出結果比較滿意時，可以用管道將其輸出傳送給 kubectl，如下所示：

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

<!--
Kubernetes accepts and runs the Jobs you created.
-->
Kubernetes 接收清單檔案並執行你所建立的 Job。

<!--
### Clean up {#cleanup-2}
```shell
# Remove the Jobs you created
# Your cluster automatically cleans up their Pods
kubectl delete job -l jobgroup=jobexample
```
-->
### 清理 {#cleanup-2}

```shell
# 刪除所建立的 Job
# 叢集會自動清理 Job 對應的 Pod
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
## 在真實負載中使用 Job {#using-jobs-in-real-workloads}

在真實的負載中，每個 Job 都會執行一些重要的計算，例如渲染電影的一幀，
或者處理資料庫中的若干行。這時，`$ITEM` 引數將指定幀號或行範圍。

在此任務中，你執行一個命令透過取回 Pod 的日誌來收集其輸出。
在真實應用場景中，Job 的每個 Pod 都會在結束之前將其輸出寫入到某永續性儲存中。
你可以為每個 Job 指定 PersistentVolume 卷，或者使用其他外部儲存服務。
例如，如果你在渲染影片幀，你可能會使用 HTTP 協議將渲染完的幀資料
用 'PUT' 請求傳送到某 URL，每個幀使用不同的 URl。

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
## Job 和 Pod 上的標籤

你建立了 Job 之後，Kubernetes 自動為 Job 的 Pod 新增
{{< glossary_tooltip text="標籤" term_id="label" >}}，以便能夠將一個 Job
的 Pod 與另一個 Job 的 Pod 區分開來。

在本例中，每個 Job 及其 Pod 模板有一個標籤: `jobgroup=jobexample`。

Kubernetes 自身對標籤名 `jobgroup` 沒有什麼要求。
為建立自同一模板的所有 Job 使用同一標籤使得我們可以方便地同時操作組中的所有作業。
在[第一個例子](#create-jobs-based-on-a-template)中，你使用模板來建立了若干 Job。
模板確保每個 Pod 都能夠獲得相同的標籤，這樣你可以用一條命令檢查這些模板化
Job 所生成的全部 Pod。

<!--
The label key `jobgroup` is not special or reserved.
You can pick your own labelling scheme.
There are [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels)
that you can use if you wish.
-->
{{< note >}}
標籤鍵 `jobgroup` 沒什麼特殊的，也不是保留字。 你可以選擇你自己的標籤方案。
如果願意，有一些[建議的標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)
可供使用。
{{< /note >}}

<!--
## Alternatives

If you plan to create a large number of Job objects, you may find that:
-->
## 替代方案

如果你有計劃建立大量 Job 物件，你可能會發現：

<!--
- Even using labels, managing so many Job objects is cumbersome.
- If you create many Jobs in a batch, you might place high load
  on the Kubernetes control plane. Alternatively, the Kubernetes API
  server could rate limit you, temporarily rejecting your requests with a 429 status.
- You are limited by a {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
  on Jobs: the API server permanently rejects some of your requests
  when you create a great deal of work in one batch.
-->
- 即使使用標籤，管理這麼多 Job 物件也很麻煩。
- 如果你一次性建立很多 Job，很可能會給 Kubernetes 控制面帶來很大壓力。
  一種替代方案是，Kubernetes API 可能對請求施加速率限制，透過 429 返回
  狀態值臨時拒絕你的請求。
- 你可能會受到 Job 相關的{{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}
  限制：如果你在一個批次請求中觸發了太多的任務，API 伺服器會永久性地拒絕你的某些請求。

<!--
There are other [job patterns](/docs/concepts/workloads/controllers/job/#job-patterns)
that you can use to process large amounts of work without creating very many Job
objects.

You could also consider writing your own [controller](/docs/concepts/architecture/controller/)
to manage Job objects automatically.
-->
還有一些其他[作業模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)
可供選擇，這些模式都能用來處理大量任務而又不會建立過多的 Job 物件。

你也可以考慮編寫自己的[控制器](/zh-cn/docs/concepts/architecture/controller/)
來自動管理 Job 物件。
