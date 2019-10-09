---
cn-approvers:
- linyouchong
title: 使用工作队列进行精细的并行处理
content_template: templates/task
weight: 40
---
<!--
---
title: Fine Parallel Processing Using a Work Queue
content_template: templates/task
weight: 40
---
-->

{{% capture overview %}}

<!--
In this example, we will run a Kubernetes Job with multiple parallel
worker processes in a given pod.
-->
在这个例子中，我们会运行一个Kubernetes Job，其中的 Pod 会运行多个并行工作进程。

<!--
In this example, as each pod is created, it picks up one unit of work
from a task queue, processes it, and repeats until the end of the queue is reached.
-->
在这个例子中，当每个pod被创建时，它会从一个任务队列中获取一个工作单元，处理它，然后重复，直到到达队列的尾部。


<!--
Here is an overview of the steps in this example:
-->
下面是这个示例的步骤概述

<!--
1. **Start a storage service to hold the work queue.**  In this example, we use Redis to store
  our work items.  In the previous example, we used RabbitMQ.  In this example, we use Redis and
  a custom work-queue client library because AMQP does not provide a good way for clients to
  detect when a finite-length work queue is empty.  In practice you would set up a store such
  as Redis once and reuse it for the work queues of many jobs, and other things.
-->
1. **启动存储服务用于保存工作队列。** 在这个例子中，我们使用 Redis 来存储工作项。在上一个例子中，我们使用了 RabbitMQ。在这个例子中，由于 AMQP 不能为客户端提供一个良好的方法来检测一个有限长度的工作队列是否为空，我们使用了 Redis 和一个自定义的工作队列客户端库。在实践中，您可能会设置一个类似于 Redis 的存储库，并将其同时用于多项任务或其他事务的工作队列。
<!--
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
  this example, a message is just an integer that we will do a lengthy computation on.
-->
1. **创建一个队列，然后向其中填充消息。** 每个消息表示一个将要被处理的工作任务。在这个例子中，消息只是一个我们将用于进行长度计算的整数。
<!--
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
  one task from the message queue, processes it, and repeats until the end of the queue is reached.
-->
1. **启动一个 Job 对队列中的任务进行处理**。这个 Job 启动了若干个 Pod 。每个 Pod 从消息队列中取出一个工作任务，处理它，然后重复，直到到达队列的尾部。

{{% /capture %}}

{{< toc >}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).
-->
熟秋基础知识，非并行方式运行 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Starting Redis
-->
## 启动 Redis

<!--
For this example, for simplicity, we will start a single instance of Redis.
See the [Redis Example](https://github.com/kubernetes/examples/tree/master/guestbook) for an example
of deploying Redis scalably and redundantly.
-->
对于这个例子，为了简单起见，我们将启动一个单实例的 Redis。
了解如何部署一个可伸缩、高可用的 Redis 例子，请查看 [Redis 样例](https://github.com/kubernetes/examples/tree/master/guestbook) 

<!--
If you are working from the website source tree, you can go to the following
directory and start  a temporary Pod running Redis and a service so we can find it.
-->
如果您在使用本文档库的源代码目录，您可以进入如下目录，然后启动一个临时的 Pod 用于运行 Redis 和 一个临时的 service 以便我们能够找到这个 Pod

```shell
$ cd content/en/examples/application/job/redis
$ kubectl create -f ./redis-pod.yaml
pod/redis-master created
$ kubectl create -f ./redis-service.yaml
service/redis created
```

<!--
If you're not working from the source tree, you could also download the following
files directly:
-->
如果您没有使用本文档库的源代码目录，您可以直接下载如下文件：

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

<!--
## Filling the Queue with tasks
-->
## 使用任务填充队列

<!--
Now let's fill the queue with some "tasks".  In our example, our tasks are just strings to be
printed.
-->
现在，让我们往队列里添加一些“任务”。在这个例子中，我们的任务只是一些将被打印出来的字符串。

<!--
Start a temporary interactive pod for running the Redis CLI.
-->
启动一个临时的可交互的 pod 用于运行 Redis 命令行界面。

```shell
$ kubectl run -i --tty temp --image redis --command "/bin/sh"
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

<!--
Now hit enter, start the redis CLI, and create a list with some work items in it.
-->
现在按回车键，启动 redis 命令行界面，然后创建一个存在若干个工作项的列表。

```
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
因此，这个键为 `job2` 的列表就是我们的工作队列。

<!--
Note: if you do not have Kube DNS setup correctly, you may need to change
the first step of the above block to `redis-cli -h $REDIS_SERVICE_HOST`.
-->
注意：如果您还没有正确地配置 Kube DNS，您可能需要将上面的第一步改为 `redis-cli -h $REDIS_SERVICE_HOST`。


<!--
## Create an Image
-->
创建镜像

<!--
Now we are ready to create an image that we will run.
-->
现在我们已经准备好创建一个我们要运行的镜像

<!--
We will use a python worker program with a redis client to read
the messages from the message queue.
-->
我们会使用一个带有 redis 客户端的 python 工作程序从消息队列中读出消息。

<!--
A simple Redis work queue client library is provided,
called rediswq.py ([Download](/examples/application/job/redis/rediswq.py)).
-->
这里提供了一个简单的 Redis 工作队列客户端库，叫 rediswq.py ([下载](/examples/application/job/redis/rediswq.py))。

<!--
The "worker" program in each Pod of the Job uses the work queue
client library to get work.  Here it is:
-->
Job 中每个 Pod 内的 “工作程序” 使用工作队列客户端库获取工作。如下：

{{< codenew language="python" file="application/job/redis/worker.py" >}}

<!--
If you are working from the source tree,
change directory to the `content/en/examples/application/job/redis/` directory.
Otherwise, download [`worker.py`](/examples/application/job/redis/worker.py), [`rediswq.py`](/examples/application/job/redis/rediswq.py), and [`Dockerfile`](/examples/application/job/redis/Dockerfile)
using above links. Then build the image:
-->
如果您在使用本文档库的源代码目录，请将当前目录切换到 `content/en/examples/application/job/redis/`。否则，请点击链接下载 [`worker.py`](/examples/application/job/redis/worker.py)、 [`rediswq.py`](/examples/application/job/redis/rediswq.py) 和 [`Dockerfile`](/examples/application/job/redis/Dockerfile)。然后构建镜像：

```shell
docker build -t job-wq-2 .
```

<!--
### Push the image
-->
### Push 镜像

<!--
For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
对于 [Docker Hub](https://hub.docker.com/)，请先用您的用户名给镜像打上标签，然后使用下面的命令 push 您的镜像到仓库。请将 `<username>` 替换为您自己的用户名。

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

<!--
You need to push to a public repository or [configure your cluster to be able to access
your private repository](/docs/concepts/containers/images/).
-->
您需要将镜像 push 到一个公共仓库或者 [配置集群访问您的私有仓库](/docs/concepts/containers/images/)。

<!--
If you are using [Google Container
Registry](https://cloud.google.com/tools/container-registry/), tag
your app image with your project ID, and push to GCR. Replace
`<project>` with your project ID.
-->
如果您使用的是 [Google Container
Registry](https://cloud.google.com/tools/container-registry/)，请先用您的 project ID 给您的镜像打上标签，然后 push 到 GCR 。请将 `<project>` 替换为您自己的 project ID

```shell
docker tag job-wq-2 gcr.io/<project>/job-wq-2
gcloud docker -- push gcr.io/<project>/job-wq-2
```

<!--
## Defining a Job
-->
## 定义一个 Job

<!--
Here is the job definition:
-->
这是 job 定义：

{{< codenew file="application/job/redis/job.yaml" >}}

<!--
Be sure to edit the job template to
change `gcr.io/myproject` to your own path.
-->
请确保将 job 模板中的 `gcr.io/myproject` 更改为您自己的路径。

<!--
In this example, each pod works on several items from the queue and then exits when there are no more items.
Since the workers themselves detect when the workqueue is empty, and the Job controller does not
know about the workqueue, it relies on the workers to signal when they are done working.
The workers signal that the queue is empty by exiting with success.  So, as soon as any worker
exits with success, the controller knows the work is done, and the Pods will exit soon.
So, we set the completion count of the Job to 1.  The job controller will wait for the other pods to complete
too.
-->
在这个例子中，每个 pod 处理了队列中的多个项目，直到队列中没有项目时便退出。因为是由工作程序自行检测工作队列是否为空，并且 Job 控制器不知道工作队列的存在，所以依赖于工作程序在完成工作时发出信号。工作程序以成功退出的形式发出信号表示工作队列已经为空。所以，只要有任意一个工作程序成功退出，控制器就知道工作已经完成了，所有的 Pod 将很快会退出。因此，我们将 Job 的 completion count 设置为 1 。尽管如此，Job 控制器还是会等待其它 Pod 完成。


<!--
## Running the Job
-->
## 运行 Job

<!--
So, now run the Job:
-->
现在运行这个 Job ：

```shell
kubectl create -f ./job.yaml
```

<!--
Now wait a bit, then check on the job.
-->
稍等片刻，然后检查这个 Job。

```shell
$ kubectl describe jobs/job-wq-2
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


$ kubectl logs pods/job-wq-2-7r7b2
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

<!--
As you can see, one of our pods worked on several work units.
-->
您可以看到，其中的一个 pod 处理了若干个工作单元。

{{% /capture %}}

{{% capture discussion %}}

<!--
## Alternatives
-->
## 其它

<!--
If running a queue service or modifying your containers to use a work queue is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
-->
如果您不方便运行一个队列服务或者修改您的容器用于运行一个工作队列，您可以考虑其它的 [job 模式](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns)。

<!--
If you have a continuous stream of background processing work to run, then
consider running your background workers with a `replicationController` instead,
and consider running a background processing library such as
[https://github.com/resque/resque](https://github.com/resque/resque).
-->
如果您有连续的后台处理业务，那么可以考虑使用 `replicationController` 来运行您的后台业务，和运行一个类似 [https://github.com/resque/resque](https://github.com/resque/resque) 的后台处理库。

{{% /capture %}}
