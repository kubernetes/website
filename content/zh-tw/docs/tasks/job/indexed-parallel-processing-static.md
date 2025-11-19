---
title: 使用索引作業完成靜態工作分配下的並行處理
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
在此示例中，你將運行一個使用多個並行工作進程的 Kubernetes Job。
每個 worker 都是在自己的 Pod 中運行的不同容器。
Pod 具有控制平面自動設置的**索引編號（index number）**，
這些編號使得每個 Pod 能識別出要處理整個任務的哪個部分。

<!-- 
The pod index is available in the {{< glossary_tooltip text="annotation" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` as a string representing its
decimal value. In order for the containerized task process to obtain this index,
you can publish the value of the annotation using the [downward API](/docs/concepts/workloads/pods/downward-api/)
mechanism.
For convenience, the control plane automatically sets the downward API to
expose the index in the `JOB_COMPLETION_INDEX` environment variable.
-->
Pod 索引在{{<glossary_tooltip text="註解" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` 中呈現，具體表示爲一個十進制值字符串。
爲了讓容器化的任務進程獲得此索引，你可以使用
[downward API](/zh-cn/docs/concepts/workloads/pods/downward-api/)
機制發佈註解的值。爲方便起見，
控制平面自動設置 Downward API 以在 `JOB_COMPLETION_INDEX` 環境變量中公開索引。

<!-- 
Here is an overview of the steps in this example:

1. **Define a Job manifest using indexed completion**.
   The downward API allows you to pass the pod index annotation as an
   environment variable or file to the container.
2. **Start an `Indexed` Job based on that manifest**.
-->
以下是此示例中步驟的概述：

1. **定義使用帶索引完成信息的 Job 清單**。
   Downward API 使你可以將 Pod 索引註解作爲環境變量或文件傳遞給容器。
2. **根據該清單啓動一個帶索引（`Indexed`）的 Job**。

## {{% heading "prerequisites" %}}

<!-- 
You should already be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你應該已經熟悉 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本的、非並行的用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!-- 
## Choose an approach
 -->
## 選擇一種方法 {#choose-an-approach}

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
要從工作程序訪問工作項，你有幾個選項：

1. 讀取 `JOB_COMPLETION_INDEX` 環境變量。Job
   {{< glossary_tooltip text="控制器" term_id="controller" >}}自動將此變量鏈接到包含完成索引的註解。
2. 讀取包含完整索引的文件。
3. 假設你無法修改程序，你可以使用腳本包裝它，
   該腳本使用上述任意方法讀取索引並將其轉換爲程序可以用作輸入的內容。

<!-- 
For this example, imagine that you chose option 3 and you want to run the
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) utility. This
program accepts a file as an argument and prints its content reversed.
-->
對於此示例，假設你選擇了選項 3 並且想要運行
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) 實用程序。
這個程序接受一個文件作爲參數並按逆序打印其內容。

```shell
rev data.txt
```

<!--  
You'll use the `rev` tool from the
[`busybox`](https://hub.docker.com/_/busybox) container image.
-->
你將使用 [`busybox`](https://hub.docker.com/_/busybox) 容器鏡像中的 `rev` 工具。

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
由於這只是一個例子，每個 Pod 只做一小部分工作（反轉一個短字符串）。
例如，在實際工作負載中，你可能會創建一個表示基於場景數據製作 60 秒視頻任務的 Job 。
此視頻渲染 Job 中的每個工作項都將渲染該視頻剪輯的特定幀。
索引完成意味着 Job 中的每個 Pod 都知道通過從剪輯開始計算幀數，來確定渲染和發佈哪一幀。

<!-- 
## Define an Indexed Job

Here is a sample Job manifest that uses `Indexed` completion mode:
-->
## 定義索引作業 {#define-an-indexed-job}

這是一個使用 `Indexed` 完成模式的示例 Job 清單：

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
在上面的示例中，你使用 Job 控制器爲所有容器設置的內置 `JOB_COMPLETION_INDEX` 環境變量。
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)
將索引映射到一個靜態值，並將其寫入一個文件，該文件通過
[emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)
與運行 worker 的容器共享。或者，你可以
[通過 Downward API 定義自己的環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
將索引發布到容器。你還可以選擇從
[包含 ConfigMap 的環境變量或文件](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
加載值列表。

<!-- 
Alternatively, you can directly [use the downward API to pass the annotation
value as a volume file](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields),
like shown in the following example:
-->
或者也可以直接
[使用 Downward API 將註解值作爲卷文件傳遞](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields)，
如下例所示：

{{% code_sample language="yaml" file="application/job/indexed-job-vol.yaml" %}}

<!-- 
## Running the Job

Now run the Job:
-->
## 執行 Job {running-the-job}

現在執行 Job：

```shell
# 使用第一種方法（依賴於 $JOB_COMPLETION_INDEX）
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

<!-- 
When you create this Job, the control plane creates a series of Pods, one for each index you specified.
The value of `.spec.parallelism` determines how many can run at once whereas `.spec.completions`
determines how many Pods the Job creates in total.

Because `.spec.parallelism` is less than `.spec.completions`, the control plane waits for some
of the first Pods to complete before starting more of them.
-->
當你創建此 Job 時，控制平面會創建一系列 Pod，你指定的每個索引都會運行一個 Pod。
`.spec.parallelism` 的值決定了一次可以運行多少個 Pod，
而 `.spec.completions` 決定了 Job 總共創建了多少個 Pod。

因爲 `.spec.parallelism` 小於 `.spec.completions`，
所以控制平面在啓動更多 Pod 之前，將等待第一批的某些 Pod 完成。

<!--
You can wait for the Job to succeed, with a timeout:
-->
你可以等待 Job 成功，等待時間可以設置超時限制：

```shell
# 狀況名稱的檢查不區分大小寫
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

<!--
Now, describe the Job and check that it was successful.
-->
現在，描述 Job 並檢查它是否成功。

```shell
kubectl describe jobs/indexed-job
```

<!-- 
The output is similar to:
-->
輸出類似於：

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
在此示例中，你使用每個索引的自定義值運行 Job。
你可以檢查其中一個 Pod 的輸出：

```shell
kubectl logs indexed-job-fdhq5 # 更改它以匹配來自該 Job 的 Pod 的名稱
```

<!-- 
The output is similar to:
-->
輸出類似於：

```
xuq
```
