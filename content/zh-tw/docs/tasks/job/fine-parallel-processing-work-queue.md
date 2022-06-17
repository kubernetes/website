---
title: 使用工作佇列進行精細的並行處理
content_type: task
min-kubernetes-server-version: v1.8
weight: 30
---
<!--
title: Fine Parallel Processing Using a Work Queue
content_type: task
weight: 30
min-kubernetes-server-version: v1.8
-->

<!-- overview -->

<!--
In this example, we will run a Kubernetes Job with multiple parallel
worker processes in a given pod.
-->
在這個例子中，我們會執行一個Kubernetes Job，其中的 Pod 會執行多個並行工作程序。

<!--
In this example, as each pod is created, it picks up one unit of work
from a task queue, processes it, and repeats until the end of the queue is reached.

Here is an overview of the steps in this example:
-->
在這個例子中，當每個pod被建立時，它會從一個任務佇列中獲取一個工作單元，處理它，然後重複，直到到達佇列的尾部。

下面是這個示例的步驟概述：

<!--
1. **Start a storage service to hold the work queue.**  In this example, we use Redis to store
  our work items.  In the previous example, we used RabbitMQ.  In this example, we use Redis and
  a custom work-queue client library because AMQP does not provide a good way for clients to
  detect when a finite-length work queue is empty.  In practice you would set up a store such
  as Redis once and reuse it for the work queues of many jobs, and other things.
-->

1. **啟動儲存服務用於儲存工作佇列。** 在這個例子中，我們使用 Redis 來儲存工作項。
   在上一個例子中，我們使用了 RabbitMQ。
   在這個例子中，由於 AMQP 不能為客戶端提供一個良好的方法來檢測一個有限長度的工作佇列是否為空，
   我們使用了 Redis 和一個自定義的工作佇列客戶端庫。
   在實踐中，你可能會設定一個類似於 Redis 的儲存庫，並將其同時用於多項任務或其他事務的工作佇列。

<!--
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
   this example, a message is an integer that we will do a lengthy computation on.
-->
2. **建立一個佇列，然後向其中填充訊息。** 每個訊息表示一個將要被處理的工作任務。
   在這個例子中，訊息是一個我們將用於進行長度計算的整數。

<!--
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
  one task from the message queue, processes it, and repeats until the end of the queue is reached.
-->
3. **啟動一個 Job 對佇列中的任務進行處理**。這個 Job 啟動了若干個 Pod 。
   每個 Pod 從訊息佇列中取出一個工作任務，處理它，然後重複，直到到達佇列的尾部。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->
熟悉基本的、非並行的 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)。

<!-- steps -->

<!--
## Starting Redis

For this example, for simplicity, we will start a single instance of Redis.
See the [Redis Example](https://github.com/kubernetes/examples/tree/master/guestbook) for an example
of deploying Redis scalably and redundantly.
-->
## 啟動 Redis

對於這個例子，為了簡單起見，我們將啟動一個單例項的 Redis。
瞭解如何部署一個可伸縮、高可用的 Redis 例子，請檢視
[Redis 示例](https://github.com/kubernetes/examples/tree/master/guestbook)

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
## Filling the Queue with tasks

Now let's fill the queue with some "tasks".  In our example, our tasks are strings to be
printed.

Start a temporary interactive pod for running the Redis CLI.
-->
## 使用任務填充佇列

現在，讓我們往佇列裡新增一些“任務”。在這個例子中，我們的任務是一些將被打印出來的字串。

啟動一個臨時的可互動的 pod 用於執行 Redis 命令列介面。

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```
```
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

<!--
Now hit enter, start the redis CLI, and create a list with some work items in it.
-->
現在按回車鍵，啟動 redis 命令列介面，然後建立一個存在若干個工作項的列表。

```shell
# redis-cli -h redis
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
So, the list with key `job2` will be our work queue.
-->
因此，這個鍵為 `job2` 的列表就是我們的工作佇列。

<!--
Note: if you do not have Kube DNS setup correctly, you may need to change
the first step of the above block to `redis-cli -h $REDIS_SERVICE_HOST`.
-->
注意：如果你還沒有正確地配置 Kube DNS，你可能需要將上面的第一步改為
`redis-cli -h $REDIS_SERVICE_HOST`。

<!--
## Create an Image

Now we are ready to create an image that we will run.

We will use a python worker program with a redis client to read
the messages from the message queue.

A simple Redis work queue client library is provided,
called rediswq.py ([Download](/examples/application/job/redis/rediswq.py)).
-->
## 建立映象

現在我們已經準備好建立一個我們要執行的映象

我們會使用一個帶有 redis 客戶端的 python 工作程式從訊息佇列中讀出訊息。

這裡提供了一個簡單的 Redis 工作佇列客戶端庫，叫 rediswq.py ([下載](/examples/application/job/redis/rediswq.py))。

<!--
The "worker" program in each Pod of the Job uses the work queue
client library to get work.  Here it is:
-->
Job 中每個 Pod 內的 “工作程式” 使用工作佇列客戶端庫獲取工作。如下：

{{< codenew language="python" file="application/job/redis/worker.py" >}}

<!--
You could download [`worker.py`](/examples/application/job/redis/worker.py), [`rediswq.py`](/examples/application/job/redis/rediswq.py), and [`Dockerfile`](/examples/application/job/redis/Dockerfile)
using above links. Then build the image:
-->
你也可以下載 [`worker.py`](/examples/application/job/redis/worker.py)、
[`rediswq.py`](/examples/application/job/redis/rediswq.py) 和
[`Dockerfile`](/examples/application/job/redis/Dockerfile)。然後構建映象：

```shell
docker build -t job-wq-2 .
```

<!--
### Push the image

For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
### Push 映象

對於 [Docker Hub](https://hub.docker.com/)，請先用你的使用者名稱給映象打上標籤，
然後使用下面的命令 push 你的映象到倉庫。請將 `<username>` 替換為你自己的 Hub 使用者名稱。

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

<!--
You need to push to a public repository or [configure your cluster to be able to access
your private repository](/docs/concepts/containers/images/).
-->
你需要將映象 push 到一個公共倉庫或者
[配置叢集訪問你的私有倉庫](/zh-cn/docs/concepts/containers/images/)。

<!--
If you are using [Google Container
Registry](https://cloud.google.com/tools/container-registry/), tag
your app image with your project ID, and push to GCR. Replace
`<project>` with your project ID.
-->
如果你使用的是 [Google Container Registry](https://cloud.google.com/tools/container-registry/)，
請先用你的 project ID 給你的映象打上標籤，然後 push 到 GCR 。請將 `<project>` 替換為你自己的 project ID

```shell
docker tag job-wq-2 gcr.io/<project>/job-wq-2
gcloud docker -- push gcr.io/<project>/job-wq-2
```

<!--
## Defining a Job

Here is the job definition:
-->
## 定義一個 Job

這是 job 定義：

{{< codenew file="application/job/redis/job.yaml" >}}

<!--
Be sure to edit the job template to
change `gcr.io/myproject` to your own path.
-->
請確保將 job 模板中的 `gcr.io/myproject` 更改為你自己的路徑。

<!--
In this example, each pod works on several items from the queue and then exits when there are no more items.
Since the workers themselves detect when the workqueue is empty, and the Job controller does not
know about the workqueue, it relies on the workers to signal when they are done working.
The workers signal that the queue is empty by exiting with success.  So, as soon as any worker
exits with success, the controller knows the work is done, and the Pods will exit soon.
So, we set the completion count of the Job to 1.  The job controller will wait for the other pods to complete
too.
-->
在這個例子中，每個 pod 處理了佇列中的多個專案，直到佇列中沒有專案時便退出。
因為是由工作程式自行檢測工作佇列是否為空，並且 Job 控制器不知道工作佇列的存在，
這依賴於工作程式在完成工作時發出訊號。
工作程式以成功退出的形式發出訊號表示工作佇列已經為空。
所以，只要有任意一個工作程式成功退出，控制器就知道工作已經完成了，所有的 Pod 將很快會退出。
因此，我們將 Job 的完成計數（Completion Count）設定為 1 。
儘管如此，Job 控制器還是會等待其它 Pod 完成。

<!--
## Running the Job

So, now run the Job:
-->
## 執行 Job

現在執行這個 Job ：

```shell
kubectl apply -f ./job.yaml
```

<!--
Now wait a bit, then check on the job.
-->
稍等片刻，然後檢查這個 Job。

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
Start Time:       Mon, 11 Jan 2016 17:07:59 -0800
Pods Statuses:    1 Running / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                job-name=job-wq-2
  Containers:
   c:
    Image:              gcr.io/exampleproject/job-wq-2
    Port:
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  33s          33s         1        {job-controller }                Normal      SuccessfulCreate  Created pod: job-wq-2-lglf8
```

檢視日誌：

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
As you can see, one of our pods worked on several work units.
-->
你可以看到，其中的一個 pod 處理了若干個工作單元。

<!-- discussion -->

<!--
## Alternatives
-->
## 替代方案

<!--
If running a queue service or modifying your containers to use a work queue is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
-->
如果你不方便執行一個佇列服務或者修改你的容器用於執行一個工作佇列，你可以考慮其它的
[Job 模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)。

<!--
If you have a continuous stream of background processing work to run, then
consider running your background workers with a `ReplicaSet` instead,
and consider running a background processing library such as
[https://github.com/resque/resque](https://github.com/resque/resque).
-->
如果你有持續的後臺處理業務，那麼可以考慮使用 `ReplicaSet` 來執行你的後臺業務，
和執行一個類似 [https://github.com/resque/resque](https://github.com/resque/resque)
的後臺處理庫。
