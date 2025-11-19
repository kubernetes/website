---
title: 使用 CronJob 運行自動化任務
min-kubernetes-server-version: v1.21
content_type: task
weight: 10
---
<!--
title: Running Automated Tasks with a CronJob
min-kubernetes-server-version: v1.21
reviewers:
- chenopis
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This page shows how to run automated tasks using Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} object.
-->
本頁演示如何使用 Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}
對象運行自動化任務。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Creating a CronJob {#creating-a-cron-job}

Cron jobs require a config file.
Here is a manifest for a CronJob that runs a simple demonstration task every minute:
-->
## 創建 CronJob {#creating-a-cron-job}

CronJob 需要一個設定文件。
以下是針對一個 CronJob 的清單，該 CronJob 每分鐘運行一個簡單的演示任務：

{{% code_sample file="application/job/cronjob.yaml" %}}

<!--
Run the example CronJob by using this command:
-->
執行以下命令以運行此 CronJob 示例：

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```
cronjob.batch/hello created
```

<!--
After creating the cron job, get its status using this command:
-->
創建好 CronJob 後，使用下面的命令來獲取其狀態：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```
<!--
As you can see from the results of the command, the cron job has not scheduled or run any jobs yet.
{{< glossary_tooltip text="Watch" term_id="watch" >}} for the job to be created in around one minute:
-->
就像你從命令返回結果看到的那樣，CronJob 還沒有調度或執行任何任務。
等待大約一分鐘，以{{< glossary_tooltip text="觀察" term_id="watch" >}}作業的創建進程：

```shell
kubectl get jobs --watch
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

<!--
Now you've seen one running job scheduled by the "hello" cron job.
You can stop watching the job and view the cron job again to see that it scheduled the job:
-->
現在你已經看到了一個運行中的任務被 “hello” CronJob 調度。
你可以停止監視這個任務，然後再次查看 CronJob 就能看到它調度任務：

```shell
kubectl get cronjob hello
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

<!--
You should see that the cron job `hello` successfully scheduled a job at the time specified in
`LAST SCHEDULE`. There are currently 0 active jobs, meaning that the job has completed or failed.

Now, find the pods that the last scheduled job created and view the standard output of one of the pods.
-->
你應該能看到 `hello` CronJob 在 `LAST SCHEDULE` 聲明的時間點成功地調度了一次任務。
目前有 0 個活躍的任務，這意味着任務執行完畢或者執行失敗。

現在，找到最後一次調度任務創建的 Pod 並查看一個 Pod 的標準輸出。

<!--
The job name is different from the pod name.
-->
{{< note >}}
Job 名稱與 Pod 名稱不同。
{{< /note >}}

```shell
# 在你的系統上將 "hello-4111706356" 替換爲 Job 名稱
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items..metadata.name})
```

<!--
Show the pod log:
-->
查看 Pod 日誌：

```shell
kubectl logs $pods
```
<!--
The output is similar to this:
-->
輸出類似於：

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

<!--
## Deleting a CronJob

When you don't need a cron job any more, delete it with `kubectl delete cronjob <cronjob name>`:
-->

## 刪除 CronJob {#deleting-a-cronjob}

當你不再需要 CronJob 時，可以用 `kubectl delete cronjob <cronjob name>` 刪掉它：

```shell
kubectl delete cronjob hello
```

<!--
Deleting the cron job removes all the jobs and pods it created and stops it from creating additional jobs.
You can read more about removing jobs in [garbage collection](/docs/concepts/architecture/garbage-collection/).
-->
刪除 CronJob 會清除它創建的所有任務和 Pod，並阻止它創建額外的任務。
你可以查閱[垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection/)。
