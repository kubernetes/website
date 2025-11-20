---
title: 使用工作隊列進行精細的並行處理
content_type: task
weight: 30
---
<!--
title: Fine Parallel Processing Using a Work Queue
content_type: task
weight: 30
-->

<!-- overview -->

<!--
In this example, you will run a Kubernetes Job that runs multiple parallel
tasks as worker processes, each running as a separate Pod.
-->
在此示例中，你將運行一個 Kubernetes Job，該 Job 將多個並行任務作爲工作進程運行，
每個任務在單獨的 Pod 中運行。

<!--
In this example, as each pod is created, it picks up one unit of work
from a task queue, processes it, and repeats until the end of the queue is reached.

Here is an overview of the steps in this example:
-->
在這個例子中，當每個 Pod 被創建時，它會從一個任務隊列中獲取一個工作單元，處理它，然後重複，直到到達隊列的尾部。

下面是這個示例的步驟概述：

<!--
1. **Start a storage service to hold the work queue.**  In this example, you will use Redis to store
   work items.  In the [previous example](/docs/tasks/job/coarse-parallel-processing-work-queue),
   you used RabbitMQ.  In this example, you will use Redis and a custom work-queue client library;
   this is because AMQP does not provide a good way for clients to
   detect when a finite-length work queue is empty.  In practice you would set up a store such
   as Redis once and reuse it for the work queues of many jobs, and other things.
-->

1. **啓動儲存服務用於保存工作隊列。** 在這個例子中，你將使用 Redis 來儲存工作項。
   在[上一個例子中](/zh-cn/docs/tasks/job/coarse-parallel-processing-work-queue)，
   你使用了 RabbitMQ。
   在這個例子中，由於 AMQP 不能爲客戶端提供一個良好的方法來檢測一個有限長度的工作隊列是否爲空，
   你將使用 Redis 和一個自定義的工作隊列客戶端庫。
   在實踐中，你可能會設置一個類似於 Redis 的儲存庫，並將其同時用於多項任務或其他事務的工作隊列。

<!--
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
   this example, a message is an integer that we will do a lengthy computation on.
-->
2. **創建一個隊列，然後向其中填充消息。** 每個消息表示一個將要被處理的工作任務。
   在這個例子中，消息是一個我們將用於進行長度計算的整數。

<!--
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
   one task from the message queue, processes it, and repeats until the end of the queue is reached.
-->
3. **啓動一個 Job 對隊列中的任務進行處理**。這個 Job 啓動了若干個 Pod。
   每個 Pod 從消息隊列中取出一個工作任務，處理它，然後重複，直到到達隊列的尾部。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You will need a container image registry where you can upload images to run in your cluster.
The example uses [Docker Hub](https://hub.docker.com/), but you could adapt it to a different
container image registry.

This task example also assumes that you have Docker installed locally. You use Docker to
build container images.
-->
你將需要一個容器映像檔倉庫，可以向其中上傳映像檔以在叢集中運行。
此示例使用的是 [Docker Hub](https://hub.docker.com/)，
當然你可以將其調整爲別的容器映像檔倉庫。

此任務示例還假設你已在本地安裝了 Docker，並使用 Docker 來構建容器映像檔。

<!-- steps -->

<!--
Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
熟悉基本的、非並行的 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)。

<!-- steps -->

<!--
## Starting Redis

For this example, for simplicity, you will start a single instance of Redis.
See the [Redis Example](https://github.com/kubernetes/examples/tree/master/web/guestbook/) for an example
of deploying Redis scalably and redundantly.
-->
## 啓動 Redis

對於這個例子，爲了簡單起見，你將啓動一個單實例的 Redis。
瞭解如何部署一個可伸縮、高可用的 Redis 例子，請查看
[Redis 示例](https://github.com/kubernetes/examples/tree/master/web/guestbook/)

<!--
You could also download the following files directly:
-->
你也可以直接下載如下檔案：

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

<!--
To start a single instance of Redis, you need to create the redis pod and redis service:
-->
要啓動一個 Redis 實例，你需要創建 Redis Pod 和 Redis 服務：

```shell
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

<!--
## Filling the queue with tasks

Now let's fill the queue with some "tasks".  In this example, our tasks are strings to be
printed.

Start a temporary interactive pod for running the Redis CLI.
-->
## 使用任務填充隊列

現在，讓我們往隊列裏添加一些“任務”。在這個例子中，我們的任務是一些將被打印出來的字符串。

啓動一個臨時的可交互的 Pod 用於運行 Redis 命令列界面。

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```

輸出類似於：
```
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

<!--
Now hit enter, start the Redis CLI, and create a list with some work items in it.
-->
現在按回車鍵，啓動 Redis 命令列界面，然後創建一個存在若干個工作項的列表。

```shell
redis-cli -h redis
```
```console
redis:6379> rpush job2 "apple"
(integer) 1
redis:6379> rpush job2 "banana"
(integer) 2
redis:6379> rpush job2 "cherry"
(integer) 3
redis:6379> rpush job2 "date"
(integer) 4
redis:6379> rpush job2 "fig"
(integer) 5
redis:6379> rpush job2 "grape"
(integer) 6
redis:6379> rpush job2 "lemon"
(integer) 7
redis:6379> rpush job2 "melon"
(integer) 8
redis:6379> rpush job2 "orange"
(integer) 9
redis:6379> lrange job2 0 -1
1) "apple"
2) "banana"
3) "cherry"
4) "date"
5) "fig"
6) "grape"
7) "lemon"
8) "melon"
9) "orange"
```

<!--
So, the list with key `job2` will be the work queue.
-->
因此，這個鍵爲 `job2` 的列表就是工作隊列。

<!--
Note: if you do not have Kube DNS setup correctly, you may need to change
the first step of the above block to `redis-cli -h $REDIS_SERVICE_HOST`.
-->
注意：如果你還沒有正確地設定 Kube DNS，你可能需要將上面的第一步改爲
`redis-cli -h $REDIS_SERVICE_HOST`。

<!--
## Create a container image {#create-an-image}

Now you are ready to create an image that will process the work in that queue.

You're going to use a Python worker program with a Redis client to read
the messages from the message queue.

A simple Redis work queue client library is provided,
called `rediswq.py` ([Download](/examples/application/job/redis/rediswq.py)).
-->
## 創建容器映像檔  {#create-an-image}

現在你已準備好創建一個映像檔來處理該隊列中的工作。

你將使用一個帶有 Redis 客戶端的 Python 工作程式從消息隊列中讀出消息。

這裏提供了一個簡單的 Redis 工作隊列客戶端庫，名爲 `rediswq.py`
（[下載](/zh-cn/examples/application/job/redis/rediswq.py)）。

<!--
The "worker" program in each Pod of the Job uses the work queue
client library to get work.  Here it is:
-->
Job 中每個 Pod 內的“工作程式” 使用工作隊列客戶端庫獲取工作。具體如下：

{{% code_sample language="python" file="application/job/redis/worker.py" %}}

<!--
You could also download [`worker.py`](/examples/application/job/redis/worker.py),
[`rediswq.py`](/examples/application/job/redis/rediswq.py), and
[`Dockerfile`](/examples/application/job/redis/Dockerfile) files, then build
the container image. Here's an example using Docker to do the image build:
-->
你也可以下載 [`worker.py`](/examples/application/job/redis/worker.py)、
[`rediswq.py`](/examples/application/job/redis/rediswq.py) 和
[`Dockerfile`](/examples/application/job/redis/Dockerfile) 檔案。然後構建容器映像檔。
以下是使用 Docker 進行映像檔構建的示例：

```shell
docker build -t job-wq-2 .
```

<!--
### Push the image

For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
### Push 映像檔

對於 [Docker Hub](https://hub.docker.com/)，請先用你的使用者名給映像檔打上標籤，
然後使用下面的命令 push 你的映像檔到倉庫。請將 `<username>` 替換爲你自己的 Hub 使用者名。

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

<!--
You need to push to a public repository or [configure your cluster to be able to access
your private repository](/docs/concepts/containers/images/).
-->
你需要將映像檔 push 到一個公共倉庫或者
[設定叢集訪問你的私有倉庫](/zh-cn/docs/concepts/containers/images/)。

<!--
## Defining a Job

Here is a manifest for the Job you will create:
-->
## 定義一個 Job

以下是你將創建的 Job 的清單：

{{% code_sample file="application/job/redis/job.yaml" %}}

{{< note >}}
<!--
Be sure to edit the manifest to
change `gcr.io/myproject` to your own path.
-->
請確保將 Job 清單中的 `gcr.io/myproject` 更改爲你自己的路徑。
{{< /note >}}

<!--
In this example, each pod works on several items from the queue and then exits when there are no more items.
Since the workers themselves detect when the workqueue is empty, and the Job controller does not
know about the workqueue, it relies on the workers to signal when they are done working.
The workers signal that the queue is empty by exiting with success.  So, as soon as **any** worker
exits with success, the controller knows the work is done, and that the Pods will exit soon.
So, you need to leave the completion count of the Job unset. The job controller will wait for
the other pods to complete too.
-->
在這個例子中，每個 Pod 處理了隊列中的多個項目，直到隊列中沒有項目時便退出。
因爲是由工作程式自行檢測工作隊列是否爲空，並且 Job 控制器不知道工作隊列的存在，
這依賴於工作程式在完成工作時發出信號。
工作程式以成功退出的形式發出信號表示工作隊列已經爲空。
所以，只要有**任意**一個工作程式成功退出，控制器就知道工作已經完成了，所有的 Pod 將很快會退出。
因此，你不需要設置 Job 的完成次數。Job 控制器還是會等待其它 Pod 完成。

<!--
## Running the Job

So, now run the Job:
-->
## 運行 Job

現在運行這個 Job：

<!--
# this assumes you downloaded and then edited the manifest already
-->
```shell
# 這假設你已經下載並編輯了清單
kubectl apply -f ./job.yaml
```

<!--
Now wait a bit, then check on the Job:
-->
稍等片刻，然後檢查這個 Job：

```shell
kubectl describe jobs/job-wq-2
```

```
Name:             job-wq-2
Namespace:        default
Selector:         controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-2
Annotations:      <none>
Parallelism:      2
Completions:      <unset>
Start Time:       Mon, 11 Jan 2022 17:07:59 +0000
Pods Statuses:    1 Running / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                job-name=job-wq-2
  Containers:
   c:
    Image:              container-registry.example/exampleproject/job-wq-2
    Port:
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  33s          33s         1        {job-controller }                Normal      SuccessfulCreate  Created pod: job-wq-2-lglf8
```

<!--
You can wait for the Job to succeed, with a timeout:
-->
你可以等待 Job 成功，等待時長有超時限制：

```shell
# 狀況名稱的檢查不區分大小寫
kubectl wait --for=condition=complete --timeout=300s job/job-wq-2
```

```shell
kubectl logs pods/job-wq-2-7r7b2
```
```
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

<!--
As you can see, one of the pods for this Job worked on several work units.
-->
你可以看到，此 Job 中的一個 Pod 處理了若干個工作單元。

<!-- discussion -->

<!--
## Alternatives
-->
## 替代方案

<!--
If running a queue service or modifying your containers to use a work queue is inconvenient, you may
want to consider one of the other
[job patterns](/docs/concepts/workloads/controllers/job/#job-patterns).
-->
如果你不方便運行一個隊列服務或者修改你的容器用於運行一個工作隊列，你可以考慮其它的
[Job 模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)。

<!--
If you have a continuous stream of background processing work to run, then
consider running your background workers with a ReplicaSet instead,
and consider running a background processing library such as
[https://github.com/resque/resque](https://github.com/resque/resque).
-->
如果你有持續的後臺處理業務，那麼可以考慮使用 ReplicaSet 來運行你的後臺業務，
和運行一個類似 [https://github.com/resque/resque](https://github.com/resque/resque)
的後臺處理庫。
