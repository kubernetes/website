---
title: 使用工作佇列進行粗粒度並行處理
min-kubernetes-server-version: v1.8
content_type: task
weight: 20
---

<!--
---
title: Coarse Parallel Processing Using a Work Queue
min-kubernetes-server-version: v1.8
content_type: task
weight: 20
---
-->

<!-- overview -->

<!--
In this example, we will run a Kubernetes Job with multiple parallel
worker processes.

In this example, as each pod is created, it picks up one unit of work
from a task queue, completes it, deletes it from the queue, and exits.

Here is an overview of the steps in this example:

1. **Start a message queue service.**  In this example, we use RabbitMQ, but you could use another
  one.  In practice you would set up a message queue service once and reuse it for many jobs.
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
   this example, a message is an integer that we will do a lengthy computation on.
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
  one task from the message queue, processes it, and repeats until the end of the queue is reached.
-->
本例中，我們會執行包含多個並行工作程序的 Kubernetes Job。

本例中，每個 Pod 一旦被建立，會立即從任務佇列中取走一個工作單元並完成它，然後將工作單元從佇列中刪除後再退出。

下面是本次示例的主要步驟：

1. **啟動一個訊息佇列服務**  本例中，我們使用 RabbitMQ，你也可以用其他的訊息佇列服務。在實際工作環境中，你可以建立一次訊息佇列服務然後在多個任務中重複使用。

1. **建立一個佇列，放上訊息資料**  每個訊息表示一個要執行的任務。本例中，每個訊息是一個整數值。我們將基於這個整數值執行很長的計算操作。

1. **啟動一個在佇列中執行這些任務的 Job**。該 Job 啟動多個 Pod。每個 Pod 從訊息佇列中取走一個任務，處理它，然後重複執行，直到佇列的隊尾。


## {{% heading "prerequisites" %}}


<!--
Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).
-->

要熟悉 Job 基本用法（非並行的），請參考
[Job](/zh-cn/docs/concepts/workloads/controllers/job/)。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Starting a message queue service

This example uses RabbitMQ, however, you can adapt the example to use another AMQP-type message service.

In practice you could set up a message queue service once in a
cluster and reuse it for many jobs, as well as for long-running services.

Start RabbitMQ as follows:
-->
## 啟動訊息佇列服務

本例使用了 RabbitMQ，但你可以更改該示例，使用其他 AMQP 型別的訊息服務。

在實際工作中，在叢集中一次性部署某個訊息佇列服務，之後在很多 Job 中複用，包括需要長期執行的服務。

按下面的方法啟動 RabbitMQ：

```shell
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.3/examples/celery-rabbitmq/rabbitmq-service.yaml
```
```
service "rabbitmq-service" created
```

```shell
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.3/examples/celery-rabbitmq/rabbitmq-controller.yaml
```

```
replicationcontroller "rabbitmq-controller" created
```

<!--
We will only use the rabbitmq part from the [celery-rabbitmq example](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq).
-->

我們僅用到 [celery-rabbitmq 示例](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq) 中描述的部分功能。

<!--
## Testing the message queue service

Now, we can experiment with accessing the message queue.  We will
create a temporary interactive pod, install some tools on it,
and experiment with queues.

First create a temporary interactive Pod.
-->
## 測試訊息佇列服務

現在，我們可以試著訪問訊息佇列。我們將會建立一個臨時的可互動的 Pod，在它上面安裝一些工具，然後用佇列做實驗。

首先建立一個臨時的可互動的 Pod：

```shell
# 建立一個臨時的可互動的 Pod
kubectl run -i --tty temp --image ubuntu:14.04
```
```
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

<!--
Note that your pod name and command prompt will be different.

Next install the `amqp-tools` so we can work with message queues.
-->
請注意你的 Pod 名稱和命令提示符將會不同。

接下來安裝 `amqp-tools` ，這樣我們就能用訊息隊列了。

```shell
# 安裝一些工具
root@temp-loe07:/# apt-get update
.... [ lots of output ] ....
root@temp-loe07:/# apt-get install -y curl ca-certificates amqp-tools python dnsutils
.... [ lots of output ] ....
```

<!--
Later, we will make a docker image that includes these packages.

Next, we will check that we can discover the rabbitmq service:
-->

後續，我們將製作一個包含這些包的 Docker 映象。

接著，我們將要驗證我們發現 RabbitMQ 服務：

<!--
# Note the rabbitmq-service has a DNS name, provided by Kubernetes:
-->
```
# 請注意 rabbitmq-service 有Kubernetes 提供的 DNS 名稱，

root@temp-loe07:/# nslookup rabbitmq-service
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152

# 你的 IP 地址會不同
```

<!--
If Kube-DNS is not setup correctly, the previous step may not work for you.
You can also find the service IP in an env var:
-->
如果 Kube-DNS 沒有正確安裝，上一步可能會出錯。
你也可以在環境變數中找到服務 IP。

<!--
# Your address will vary.
-->
```
# env | grep RABBIT | grep HOST
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152

# 你的 IP 地址會有所不同
```

<!--
Next we will verify we can create a queue, and publish and consume messages.
-->
接著我們將要確認可以建立佇列，並能釋出訊息和消費訊息。

<!--
# In the next line, rabbitmq-service is the hostname where the rabbitmq-service
# can be reached.  5672 is the standard port for rabbitmq.

# If you could not resolve "rabbitmq-service" in the previous step,
# then use this command instead:
# root@temp-loe07:/# BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672
# Now create a queue:
# and publish a message to it:
# and get it back.
-->

```shell
# 下一行，rabbitmq-service 是訪問 rabbitmq-service 的主機名。5672是 rabbitmq 的標準埠。

root@temp-loe07:/# export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672

# 如果上一步中你不能解析 "rabbitmq-service"，可以用下面的命令替換：
# root@temp-loe07:/# BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# 現在建立佇列：

root@temp-loe07:/# /usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d foo

# 向它推送一條訊息:

root@temp-loe07:/# /usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# 然後取回它.

root@temp-loe07:/# /usr/bin/amqp-consume --url=$BROKER_URL -q foo -c 1 cat && echo
Hello
root@temp-loe07:/#
```

<!--
In the last command, the `amqp-consume` tool takes one message (`-c 1`)
from the queue, and passes that message to the standard input of an arbitrary command.  In this case, the program `cat` prints out the characters read from standard input, and the echo adds a carriage
return so the example is readable.
-->

最後一個命令中， `amqp-consume` 工具從佇列中取走了一個訊息，並把該訊息傳遞給了隨機命令的標準輸出。
在這種情況下，`cat` 會列印它從標準輸入中讀取的字元，echo 會添加回車符以便示例可讀。

<!--
## Filling the Queue with tasks

Now let's fill the queue with some "tasks".  In our example, our tasks are strings to be
printed.

In a practice, the content of the messages might be:

- names of files to that need to be processed
- extra flags to the program
- ranges of keys in a database table
- configuration parameters to a simulation
- frame numbers of a scene to be rendered
-->
## 為佇列增加任務

現在讓我們給佇列增加一些任務。在我們的示例中，任務是多個待列印的字串。

實踐中，訊息的內容可以是：

- 待處理的檔名
- 程式額外的引數
- 資料庫表的關鍵字範圍
- 模擬任務的配置引數
- 待渲染的場景的幀序列號

<!--
In practice, if there is large data that is needed in a read-only mode by all pods
of the Job, you will typically put that in a shared file system like NFS and mount
that readonly on all the pods, or the program in the pod will natively read data from
a cluster file system like HDFS.

For our example, we will create the queue and fill it using the amqp command line tools.
In practice, you might write a program to fill the queue using an amqp client library.
-->

本例中，如果有大量的資料需要被 Job 的所有 Pod 讀取，典型的做法是把它們放在一個共享檔案系統中，如NFS，並以只讀的方式掛載到所有 Pod，或者 Pod 中的程式從類似 HDFS 的叢集檔案系統中讀取。

例如，我們建立佇列並使用 amqp 命令列工具向佇列中填充訊息。實踐中，你可以寫個程式來利用 amqp 客戶端庫來填充這些佇列。

```shell
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d job1

for f in apple banana cherry date fig grape lemon melon 
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

<!--
So, we filled the queue with 8 messages.

## Create an Image

Now we are ready to create an image that we will run as a job.

We will use the `amqp-consume` utility to read the message
from the queue and run our actual program.  Here is a very simple
example program:
-->
這樣，我們給佇列中填充了8個訊息。

## 建立映象

現在我們可以建立一個做為 Job 來執行的映象。

我們將用 `amqp-consume` 來從佇列中讀取訊息並實際執行我們的程式。這裡給出一個非常簡單的示例程式：

{{< codenew language="python" file="application/job/rabbitmq/worker.py" >}}

<!--
Now, build an image.  If you are working in the source
tree, then change directory to `examples/job/work-queue-1`.
Otherwise, make a temporary directory, change to it,
download the [Dockerfile](/examples/application/job/rabbitmq/Dockerfile),
and [worker.py](/examples/application/job/rabbitmq/worker.py).  In either case,
build the image with this command:
-->

現在，編譯映象。如果你在用原始碼樹，那麼切換到目錄 `examples/job/work-queue-1`。
否則的話，建立一個臨時目錄，切換到這個目錄。下載
[Dockerfile](/examples/application/job/rabbitmq/Dockerfile)，和
[worker.py](/examples/application/job/rabbitmq/worker.py)。
無論哪種情況，都可以用下面的命令編譯映象

```shell
docker build -t job-wq-1 .
```

<!--
For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
對於 [Docker Hub](https://hub.docker.com/), 給你的應用映象打上標籤，
標籤為你的使用者名稱，然後用下面的命令推送到 Hub。用你的 Hub 使用者名稱替換 `<username>`。 

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

<!--
If you are using [Google Container
Registry](https://cloud.google.com/tools/container-registry/), tag
your app image with your project ID, and push to GCR. Replace
`<project>` with your project ID.
-->
如果你在用[谷歌容器倉庫](https://cloud.google.com/tools/container-registry/)，
用你的專案 ID 作為標籤打到你的應用映象上，然後推送到 GCR。
用你的專案 ID 替換 `<project>`。

```shell
docker tag job-wq-1 gcr.io/<project>/job-wq-1
gcloud docker -- push gcr.io/<project>/job-wq-1
```

<!--
## Defining a Job

Here is a job definition.  You'll need to make a copy of the Job and edit the
image to match the name you used, and call it `./job.yaml`.
-->
## 定義 Job

這裡給出一個 Job 定義 yaml檔案。你需要複製一份並編輯映象以匹配你使用的名稱，儲存為 `./job.yaml`。

{{< codenew file="application/job/rabbitmq/job.yaml" >}}

<!--
In this example, each pod works on one item from the queue and then exits.
So, the completion count of the Job corresponds to the number of work items
done.  So we set, `.spec.completions: 8` for the example, since we put 8 items in the queue.

## Running the Job

So, now run the Job:
-->
本例中，每個 Pod 使用佇列中的一個訊息然後退出。這樣，Job 的完成計數就代表了完成的工作項的數量。本例中我們設定 `.spec.completions: 8`，因為我們放了8項內容在佇列中。

## 執行 Job

現在我們執行 Job：

```shell
kubectl create -f ./job.yaml
```

<!--
Now wait a bit, then check on the job.
-->

稍等片刻，然後檢查 Job。

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
Start Time:       Wed, 06 Sep 2017 16:42:02 +0800
Pods Statuses:    0 Running / 8 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                job-name=job-wq-1
  Containers:
   c:
    Image:      gcr.io/causal-jigsaw-637/job-wq-1
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
All our pods succeeded.  Yay.
-->
我們所有的 Pod 都成功了。耶！

<!-- discussion -->

<!--
## Alternatives

This approach has the advantage that you
do not need to modify your "worker" program to be aware that there is a work queue.

It does require that you run a message queue service.
If running a queue service is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
-->
## 替代方案

本文所講述的處理方法的好處是你不需要修改你的 "worker" 程式使其知道工作佇列的存在。

本文所描述的方法需要你執行一個訊息佇列服務。如果不方便執行訊息佇列服務，你也許會考慮另外一種
[任務模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)。

<!--
This approach creates a pod for every work item.  If your work items only take a few seconds,
though, creating a Pod for every work item may add a lot of overhead.  Consider another
[example](/docs/tasks/job/fine-parallel-processing-work-queue/), that executes multiple work items per Pod.

In this example, we used use the `amqp-consume` utility to read the message
from the queue and run our actual program.  This has the advantage that you
do not need to modify your program to be aware of the queue.
A [different example](/docs/tasks/job/fine-parallel-processing-work-queue/), shows how to
communicate with the work queue using a client library.
-->

本文所述的方法為每個工作項建立了一個 Pod。
如果你的工作項僅需數秒鐘，為每個工作項建立 Pod會增加很多的常規消耗。
可以考慮另外的方案請參考[示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)，
這種方案可以實現每個 Pod 執行多個工作項。

示例中，我們使用 `amqp-consume` 從訊息佇列讀取訊息並執行我們真正的程式。
這樣的好處是你不需要修改你的程式使其知道佇列的存在。
要了解怎樣使用客戶端庫和工作佇列通訊，請參考
[不同的示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)。

<!--
## Caveats

If the number of completions is set to less than the number of items in the queue, then
not all items will be processed.

If the number of completions is set to more than the number of items in the queue,
then the Job will not appear to be completed, even though all items in the queue
have been processed.  It will start additional pods which will block waiting
for a message.

There is an unlikely race with this pattern.  If the container is killed in between the time
that the message is acknowledged by the amqp-consume command and the time that the container
exits with success, or if the node crashes before the kubelet is able to post the success of the pod
back to the api-server, then the Job will not appear to be complete, even though all items
in the queue have been processed.
-->
## 友情提醒

如果設定的完成數量小於佇列中的訊息數量，會導致一部分訊息項不會被執行。

如果設定的完成數量大於佇列中的訊息數量，當佇列中所有的訊息都處理完成後，
Job 也會顯示為未完成。Job 將建立 Pod 並阻塞等待訊息輸入。

當發生下面兩種情況時，即使佇列中所有的訊息都處理完了，Job 也不會顯示為完成狀態：
* 在 amqp-consume 命令拿到訊息和容器成功退出之間的時間段內，執行殺死容器操作；
* 在 kubelet 向 api-server 傳回 Pod 成功執行之前，發生節點崩潰。

