---
title: 使用工作隊列進行粗粒度並行處理
content_type: task
weight: 20
---

<!--
title: Coarse Parallel Processing Using a Work Queue
content_type: task
weight: 20
-->

<!-- overview -->

<!--
In this example, you will run a Kubernetes Job with multiple parallel
worker processes.

In this example, as each pod is created, it picks up one unit of work
from a task queue, completes it, deletes it from the queue, and exits.

Here is an overview of the steps in this example:

1. **Start a message queue service.**  In this example, you use RabbitMQ, but you could use another
   one.  In practice you would set up a message queue service once and reuse it for many jobs.
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
   this example, a message is an integer that we will do a lengthy computation on.
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
   one task from the message queue, processes it, and exits.
-->
本例中，你將會運行包含多個並行工作進程的 Kubernetes Job。

本例中，每個 Pod 一旦被創建，會立即從任務隊列中取走一個工作單元並完成它，然後將工作單元從隊列中刪除後再退出。

下面是本次示例的主要步驟：

1. **啓動一個消息隊列服務**。
   本例中，我們使用 RabbitMQ，你也可以用其他的消息隊列服務。
   在實際工作環境中，你可以創建一次消息隊列服務然後在多個任務中重複使用。

1. **創建一個隊列，放上消息數據**。
   每個消息表示一個要執行的任務。本例中，每個消息是一個整數值。
   我們將基於這個整數值執行很長的計算操作。

1. **啓動一個在隊列中執行這些任務的 Job**。
   該 Job 啓動多個 Pod。每個 Pod 從消息隊列中取走一個任務，處理任務，然後退出。

## {{% heading "prerequisites" %}}


<!--
You should already be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->

你應當熟悉 Job 的基本用法（非並行的），請參考
[Job](/zh-cn/docs/concepts/workloads/controllers/job/)。

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You will need a container image registry where you can upload images to run in your cluster.

This task example also assumes that you have Docker installed locally.
-->
你需要一個容器映像檔倉庫，用來向其中上傳映像檔以在叢集中運行。

此任務示例還假設你已在本地安裝了 Docker。

<!-- steps -->

<!--
## Starting a message queue service

This example uses RabbitMQ, however, you can adapt the example to use another AMQP-type message service.

In practice you could set up a message queue service once in a
cluster and reuse it for many jobs, as well as for long-running services.

Start RabbitMQ as follows:
-->
## 啓動消息隊列服務   {#starting-a-message-queue-service}

本例使用了 RabbitMQ，但你可以更改該示例，使用其他 AMQP 類型的消息服務。

在實際工作中，在叢集中一次性部署某個消息隊列服務，之後在很多 Job 中複用，包括需要長期運行的服務。

按下面的方法啓動 RabbitMQ：

<!--
# make a Service for the StatefulSet to use
-->
```shell
# 爲 StatefulSet 創建一個 Service 來使用
kubectl create -f https://kubernetes.io/examples/application/job/rabbitmq/rabbitmq-service.yaml
```
```
service "rabbitmq-service" created
```

```shell
kubectl create -f https://kubernetes.io/examples/application/job/rabbitmq/rabbitmq-statefulset.yaml
```

```
statefulset "rabbitmq" created
```

<!--
## Testing the message queue service

Now, we can experiment with accessing the message queue.  We will
create a temporary interactive pod, install some tools on it,
and experiment with queues.

First create a temporary interactive Pod.
-->
## 測試消息隊列服務   {#testing-the-message-queue-service}

現在，我們可以試着訪問消息隊列。我們將會創建一個臨時的可交互的 Pod，
在它上面安裝一些工具，然後用隊列做實驗。

首先創建一個臨時的可交互的 Pod：

```shell
# 創建一個臨時的可交互的 Pod
kubectl run -i --tty temp --image ubuntu:22.04
```
```
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

<!--
Note that your pod name and command prompt will be different.

Next install the `amqp-tools` so you can work with message queues.
The next commands show what you need to run inside the interactive shell in that Pod:
-->
請注意你的 Pod 名稱和命令提示符將會不同。

接下來安裝 `amqp-tools`，這樣你就能用消息隊列了。
下面是在該 Pod 的交互式 shell 中需要運行的命令：

```shell
apt-get update && apt-get install -y curl ca-certificates amqp-tools python3 dnsutils
```

<!--
Later, you will make a container image that includes these packages.

Next, you will check that you can discover the Service for RabbitMQ:
-->
後續，你將製作一個包含這些包的容器映像檔。

接着，你將要驗證可以發現 RabbitMQ 服務：

<!--
# Run these commands inside the Pod
# Note the rabbitmq-service has a DNS name, provided by Kubernetes:
-->
```
# 在 Pod 內運行這些命令
# 請注意 rabbitmq-service 擁有一個由 Kubernetes 提供的 DNS 名稱：

nslookup rabbitmq-service
```
```
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152
```
<!--
(the IP addresses will vary)
-->
（IP 地址會有所不同）

<!--
If the kube-dns addon is not set up correctly, the previous step may not work for you.
You can also find the IP address for that Service in an environment variable:
-->
如果 kube-dns 插件沒有正確安裝，上一步可能會出錯。
你也可以在環境變量中找到該服務的 IP 地址。

<!--
# run this check inside the Pod
-->
```shell
# 在 Pod 內運行此檢查
env | grep RABBITMQ_SERVICE | grep HOST
```
```
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
```
<!--
(the IP address will vary)
-->
（IP 地址會有所不同）

<!--
Next you will verify that you can create a queue, and publish and consume messages.
-->
接下來，你將驗證是否可以創建隊列以及發佈和使用消息。

<!--
# Run these commands inside the Pod
# In the next line, rabbitmq-service is the hostname where the rabbitmq-service
# can be reached.  5672 is the standard port for rabbitmq.

# If you could not resolve "rabbitmq-service" in the previous step,
# then use this command instead:
# Now create a queue:
-->

```shell
# 在 Pod 內運行這些命令
# 下一行，rabbitmq-service 是訪問 rabbitmq-service 的主機名。5672是 rabbitmq 的標準端口。

export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672

# 如果上一步中你不能解析 "rabbitmq-service"，可以用下面的命令替換：
BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# 現在創建隊列：

/usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d
```
```
foo
```

<!--
Publish one message to the queue:
# And get it back.
-->
向隊列推送一條消息：

```shell
/usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# 然後取回它：

/usr/bin/amqp-consume --url=$BROKER_URL -q foo -c 1 cat && echo
```
```
Hello
```

<!--
In the last command, the `amqp-consume` tool took one message (`-c 1`)
from the queue, and passes that message to the standard input of an arbitrary command.
In this case, the program `cat` prints out the characters read from standard input, and
the echo adds a carriage return so the example is readable.
-->

最後一個命令中，`amqp-consume` 工具從隊列中取走了一個消息，並把該消息傳遞給了隨機命令的標準輸出。
在這種情況下，`cat` 會打印它從標準輸入中讀取的字符，echo 會添加回車符以便示例可讀。

<!--
## Fill the Queue with tasks

Now, fill the queue with some simulated tasks.  In this example, the tasks are strings to be
printed.

In a practice, the content of the messages might be:

- names of files to that need to be processed
- extra flags to the program
- ranges of keys in a database table
- configuration parameters to a simulation
- frame numbers of a scene to be rendered
-->
## 爲隊列增加任務  {#filling-the-queue-with-tasks}

現在用一些模擬任務填充隊列。在此示例中，任務是多個待打印的字符串。

實踐中，消息的內容可以是：

- 待處理的文件名
- 程序額外的參數
- 數據庫表的關鍵字範圍
- 模擬任務的設定參數
- 待渲染的場景的幀序列號

<!--
If there is large data that is needed in a read-only mode by all pods
of the Job, you typically put that in a shared file system like NFS and mount
that readonly on all the pods, or write the program in the pod so that it can natively read
data from a cluster file system (for example: HDFS).

For this example, you will create the queue and fill it using the AMQP command line tools.
In practice, you might write a program to fill the queue using an AMQP client library.
-->

如果有大量的數據需要被 Job 的所有 Pod 讀取，典型的做法是把它們放在一個共享文件系統中，
如 NFS（Network File System 網路文件系統），並以只讀的方式掛載到所有 Pod，或者 Pod 中的程序從類似 HDFS
（Hadoop Distributed File System 分佈式文件系統）的叢集文件系統中讀取。

例如，你將創建隊列並使用 AMQP 命令列工具向隊列中填充消息。實踐中，你可以寫個程序來利用 AMQP 客戶端庫來填充這些隊列。

<!--
# Run this on your computer, not in the Pod
-->
```shell
# 在你的計算機上運行此命令，而不是在 Pod 中
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
```
```
job1
```
<!--
Add items to the queue:
-->
將這幾項添加到隊列中：

```shell
for f in apple banana cherry date fig grape lemon melon
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

<!--
You added 8 messages to the queue.

## Create a container Image

Now you are ready to create an image that you will run as a Job.

The job will use the `amqp-consume` utility to read the message
from the queue and run the actual work.  Here is a very simple
example program:
-->
你給隊列中填充了 8 個消息。

## 創建容器映像檔   {#create-a-container-image}

現在你可以創建一個做爲 Job 來運行的映像檔。

這個 Job 將用 `amqp-consume` 實用程序從隊列中讀取消息並進行實際工作。
這裏給出一個非常簡單的示例程序：

{{% code_sample language="python" file="application/job/rabbitmq/worker.py" %}}

<!--
Give the script execution permission:
-->
賦予腳本執行權限：

```shell
chmod +x worker.py
```


<!--
Now, build an image. Make a temporary directory, change to it,
download the [Dockerfile](/examples/application/job/rabbitmq/Dockerfile),
and [worker.py](/examples/application/job/rabbitmq/worker.py).  In either case,
build the image with this command:
-->

現在，編譯映像檔。創建一個臨時目錄，切換到這個目錄。下載
[Dockerfile](/examples/application/job/rabbitmq/Dockerfile) 和
[worker.py](/examples/application/job/rabbitmq/worker.py)。
無論哪種情況，都可以用下面的命令編譯映像檔：

```shell
docker build -t job-wq-1 .
```

<!--
For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
對於 [Docker Hub](https://hub.docker.com/), 給你的應用映像檔打上標籤，
標籤爲你的使用者名，然後用下面的命令推送到 Hub。用你的 Hub 使用者名替換 `<username>`。 

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

<!--
If you are using an alternative container image registry, tag the
image and push it there instead.
-->
如果你使用替代的映像檔倉庫，請標記該映像檔並將其推送到那裏。

<!--
## Defining a Job

Here is a job definition.  You'll need to make a copy of the Job and edit the
image to match the name you used, and call it `./job.yaml`.
Here is a manifest for a Job.  You'll need to make a copy of the Job manifest
(call it `./job.yaml`),
and edit the name of the container image to match the name you used.
-->
## 定義 Job   {#defining-a-job}

這裏給出一個 Job 的清單。你需要複製一份 Job 清單的副本（將其命名爲 `./job.yaml`），
並編輯容器映像檔的名稱以匹配使用的名稱。

{{% code_sample file="application/job/rabbitmq/job.yaml" %}}

<!--
In this example, each pod works on one item from the queue and then exits.
So, the completion count of the Job corresponds to the number of work items
done. That is why the example manifest has `.spec.completions` set to `8`.

## Running the Job

Now, run the Job:
-->
本例中，每個 Pod 使用隊列中的一個消息然後退出。
這樣，Job 的完成計數就代表了完成的工作項的數量。
這就是示例清單將 `.spec.completions` 設置爲 `8` 的原因。

## 運行 Job   {#running-the-job}

運行 Job：

<!--
# this assumes you downloaded and then edited the manifest already
-->
# 這假設你已經下載並編輯了清單
```shell
kubectl apply -f ./job.yaml
```

<!--
You can wait for the Job to succeed, with a timeout:
-->
你可以等待 Job 在某個超時時間後成功：

```shell
# 狀況名稱的檢查不區分大小寫
kubectl wait --for=condition=complete --timeout=300s job/job-wq-1
```

<!--
Next, check on the Job:
-->
接下來查看 Job：

```shell
kubectl describe jobs/job-wq-1
```
```
Name:             job-wq-1
Namespace:        default
Selector:         controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-1
Annotations:      <none>
Parallelism:      2
Completions:      8
Start Time:       Wed, 06 Sep 2022 16:42:02 +0000
Pods Statuses:    0 Running / 8 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                job-name=job-wq-1
  Containers:
   c:
    Image:      container-registry.example/causal-jigsaw-637/job-wq-1
    Port:
    Environment:
      BROKER_URL:       amqp://guest:guest@rabbitmq-service:5672
      QUEUE:            job1
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen  LastSeen   Count    From    SubobjectPath    Type      Reason              Message
  ─────────  ────────   ─────    ────    ─────────────    ──────    ──────              ───────
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-hcobb
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-weytj
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-qaam5
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-b67sr
  26s        26s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-xe5hj
  15s        15s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-w2zqe
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-d6ppa
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-p17e0
```

<!--
All the pods for that Job succeeded! You're done.
-->
該 Job 的所有 Pod 都已成功！你完成了。

<!-- discussion -->

<!--
## Alternatives

This approach has the advantage that you do not need to modify your "worker" program to be
aware that there is a work queue.  You can include the worker program unmodified in your container
image.

Using this approach does require that you run a message queue service.
If running a queue service is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/workloads/controllers/job/#job-patterns).
-->
## 替代方案   {#alternatives}

本文所講述的處理方法的好處是你不需要修改你的 "worker" 程序使其知道工作隊列的存在。
你可以將未修改的工作程序包含在容器映像檔中。

使用此方法需要你運行消息隊列服務。如果不方便運行消息隊列服務，
你也許會考慮另外一種[任務模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)。

<!--
This approach creates a pod for every work item.  If your work items only take a few seconds,
though, creating a Pod for every work item may add a lot of overhead.  Consider another
design, such as in the [fine parallel work queue example](/docs/tasks/job/fine-parallel-processing-work-queue/), that executes multiple work items per Pod.

In this example, you use the `amqp-consume` utility to read the message
from the queue and run the actual program.  This has the advantage that you
do not need to modify your program to be aware of the queue.
A [fine parallel work queue example](/docs/tasks/job/fine-parallel-processing-work-queue/)
shows how to communicate with the work queue using a client library.
-->
本文所述的方法爲每個工作項創建了一個 Pod。
如果你的工作項僅需數秒鐘，爲每個工作項創建 Pod 會增加很多的常規消耗。
考慮另一種設計，例如[精細並行工作隊列示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)，
這種方案可以實現每個 Pod 執行多個工作項。

示例中，你使用了 `amqp-consume` 從消息隊列讀取消息並執行真正的程序。
這樣的好處是你不需要修改你的程序使其知道隊列的存在。
要了解怎樣使用客戶端庫和工作隊列通信，
請參考[精細並行工作隊列示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)。

<!--
## Caveats

If the number of completions is set to less than the number of items in the queue, then
not all items will be processed.

If the number of completions is set to more than the number of items in the queue,
then the Job will not appear to be completed, even though all items in the queue
have been processed.  It will start additional pods which will block waiting
for a message.
You would need to make your own mechanism to spot when there is work
to do and measure the size of the queue, setting the number of completions to match.

There is an unlikely race with this pattern.  If the container is killed in between the time
that the message is acknowledged by the `amqp-consume` command and the time that the container
exits with success, or if the node crashes before the kubelet is able to post the success of the pod
back to the API server, then the Job will not appear to be complete, even though all items
in the queue have been processed.
-->
## 友情提醒   {#caveats}

如果設置的完成數量小於隊列中的消息數量，會導致一部分消息項不會被執行。

如果設置的完成數量大於隊列中的消息數量，當隊列中所有的消息都處理完成後，
Job 也會顯示爲未完成。Job 將創建 Pod 並阻塞等待消息輸入。
你需要建立自己的機制來發現何時有工作要做，並測量隊列的大小，設置匹配的完成數量。

當發生下面兩種情況時，即使隊列中所有的消息都處理完了，Job 也不會顯示爲完成狀態：
* 在 `amqp-consume` 命令拿到消息和容器成功退出之間的時間段內，執行殺死容器操作；
* 在 kubelet 向 API 伺服器傳回 Pod 成功運行之前，發生節點崩潰。
