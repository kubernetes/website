---
title: 使用工作队列进行粗粒度并行处理
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
本例中，你将会运行包含多个并行工作进程的 Kubernetes Job。

本例中，每个 Pod 一旦被创建，会立即从任务队列中取走一个工作单元并完成它，然后将工作单元从队列中删除后再退出。

下面是本次示例的主要步骤：

1. **启动一个消息队列服务**。
   本例中，我们使用 RabbitMQ，你也可以用其他的消息队列服务。
   在实际工作环境中，你可以创建一次消息队列服务然后在多个任务中重复使用。

1. **创建一个队列，放上消息数据**。
   每个消息表示一个要执行的任务。本例中，每个消息是一个整数值。
   我们将基于这个整数值执行很长的计算操作。

1. **启动一个在队列中执行这些任务的 Job**。
   该 Job 启动多个 Pod。每个 Pod 从消息队列中取走一个任务，处理任务，然后退出。

## {{% heading "prerequisites" %}}


<!--
You should already be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).
-->

你应当熟悉 Job 的基本用法（非并行的），请参考
[Job](/zh-cn/docs/concepts/workloads/controllers/job/)。

{{< include "task-tutorial-prereqs.md" >}} 

<!--
You will need a container image registry where you can upload images to run in your cluster.

This task example also assumes that you have Docker installed locally.
-->
你需要一个容器镜像仓库，用来向其中上传镜像以在集群中运行。

此任务示例还假设你已在本地安装了 Docker。

<!-- steps -->

<!--
## Starting a message queue service

This example uses RabbitMQ, however, you can adapt the example to use another AMQP-type message service.

In practice you could set up a message queue service once in a
cluster and reuse it for many jobs, as well as for long-running services.

Start RabbitMQ as follows:
-->
## 启动消息队列服务   {#starting-a-message-queue-service}

本例使用了 RabbitMQ，但你可以更改该示例，使用其他 AMQP 类型的消息服务。

在实际工作中，在集群中一次性部署某个消息队列服务，之后在很多 Job 中复用，包括需要长期运行的服务。

按下面的方法启动 RabbitMQ：

<!--
# make a Service for the StatefulSet to use
-->
```shell
# 为 StatefulSet 创建一个 Service 来使用
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
## 测试消息队列服务   {#testing-the-message-queue-service}

现在，我们可以试着访问消息队列。我们将会创建一个临时的可交互的 Pod，
在它上面安装一些工具，然后用队列做实验。

首先创建一个临时的可交互的 Pod：

```shell
# 创建一个临时的可交互的 Pod
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
请注意你的 Pod 名称和命令提示符将会不同。

接下来安装 `amqp-tools`，这样你就能用消息队列了。
下面是在该 Pod 的交互式 shell 中需要运行的命令：

```shell
apt-get update && apt-get install -y curl ca-certificates amqp-tools python3 dnsutils
```

<!--
Later, you will make a container image that includes these packages.

Next, you will check that you can discover the Service for RabbitMQ:
-->
后续，你将制作一个包含这些包的容器镜像。

接着，你将要验证可以发现 RabbitMQ 服务：

<!--
# Run these commands inside the Pod
# Note the rabbitmq-service has a DNS name, provided by Kubernetes:
-->
```
# 在 Pod 内运行这些命令
# 请注意 rabbitmq-service 拥有一个由 Kubernetes 提供的 DNS 名称：

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
（IP 地址会有所不同）

<!--
If the kube-dns addon is not set up correctly, the previous step may not work for you.
You can also find the IP address for that Service in an environment variable:
-->
如果 kube-dns 插件没有正确安装，上一步可能会出错。
你也可以在环境变量中找到该服务的 IP 地址。

<!--
# run this check inside the Pod
-->
```shell
# 在 Pod 内运行此检查
env | grep RABBITMQ_SERVICE | grep HOST
```
```
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
```
<!--
(the IP address will vary)
-->
（IP 地址会有所不同）

<!--
Next you will verify that you can create a queue, and publish and consume messages.
-->
接下来，你将验证是否可以创建队列以及发布和使用消息。

<!--
# Run these commands inside the Pod
# In the next line, rabbitmq-service is the hostname where the rabbitmq-service
# can be reached.  5672 is the standard port for rabbitmq.

# If you could not resolve "rabbitmq-service" in the previous step,
# then use this command instead:
# Now create a queue:
-->

```shell
# 在 Pod 内运行这些命令
# 下一行，rabbitmq-service 是访问 rabbitmq-service 的主机名。5672是 rabbitmq 的标准端口。

export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672

# 如果上一步中你不能解析 "rabbitmq-service"，可以用下面的命令替换：
BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# 现在创建队列：

/usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d foo
```
```
foo
```

<!--
Publish one message to the queue:
# And get it back.
-->
向队列推送一条消息：

```shell
/usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# 然后取回它：

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

最后一个命令中，`amqp-consume` 工具从队列中取走了一个消息，并把该消息传递给了随机命令的标准输出。
在这种情况下，`cat` 会打印它从标准输入中读取的字符，echo 会添加回车符以便示例可读。

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
## 为队列增加任务  {#filling-the-queue-with-tasks}

现在用一些模拟任务填充队列。在此示例中，任务是多个待打印的字符串。

实践中，消息的内容可以是：

- 待处理的文件名
- 程序额外的参数
- 数据库表的关键字范围
- 模拟任务的配置参数
- 待渲染的场景的帧序列号

<!--
If there is large data that is needed in a read-only mode by all pods
of the Job, you typically put that in a shared file system like NFS and mount
that readonly on all the pods, or write the program in the pod so that it can natively read
data from a cluster file system (for example: HDFS).

For this example, you will create the queue and fill it using the AMQP command line tools.
In practice, you might write a program to fill the queue using an AMQP client library.
-->

如果有大量的数据需要被 Job 的所有 Pod 读取，典型的做法是把它们放在一个共享文件系统中，
如 NFS（Network File System 网络文件系统），并以只读的方式挂载到所有 Pod，或者 Pod 中的程序从类似 HDFS
（Hadoop Distributed File System 分布式文件系统）的集群文件系统中读取。

例如，你将创建队列并使用 AMQP 命令行工具向队列中填充消息。实践中，你可以写个程序来利用 AMQP 客户端库来填充这些队列。

<!--
# Run this on your computer, not in the Pod
-->
```shell
# 在你的计算机上运行此命令，而不是在 Pod 中
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
```
```
job1
```
<!--
Add items to the queue:
-->
将这几项添加到队列中：

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
你给队列中填充了 8 个消息。

## 创建容器镜像   {#create-a-container-image}

现在你可以创建一个做为 Job 来运行的镜像。

这个 Job 将用 `amqp-consume` 实用程序从队列中读取消息并进行实际工作。
这里给出一个非常简单的示例程序：

{{% code_sample language="python" file="application/job/rabbitmq/worker.py" %}}

<!--
Give the script execution permission:
-->
赋予脚本执行权限：

```shell
chmod +x worker.py
```


<!--
Now, build an image. Make a temporary directory, change to it,
download the [Dockerfile](/examples/application/job/rabbitmq/Dockerfile),
and [worker.py](/examples/application/job/rabbitmq/worker.py).  In either case,
build the image with this command:
-->

现在，编译镜像。创建一个临时目录，切换到这个目录。下载
[Dockerfile](/examples/application/job/rabbitmq/Dockerfile) 和
[worker.py](/examples/application/job/rabbitmq/worker.py)。
无论哪种情况，都可以用下面的命令编译镜像：

```shell
docker build -t job-wq-1 .
```

<!--
For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
对于 [Docker Hub](https://hub.docker.com/), 给你的应用镜像打上标签，
标签为你的用户名，然后用下面的命令推送到 Hub。用你的 Hub 用户名替换 `<username>`。 

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

<!--
If you are using an alternative container image registry, tag the
image and push it there instead.
-->
如果你使用替代的镜像仓库，请标记该镜像并将其推送到那里。

<!--
## Defining a Job

Here is a job definition.  You'll need to make a copy of the Job and edit the
image to match the name you used, and call it `./job.yaml`.
Here is a manifest for a Job.  You'll need to make a copy of the Job manifest
(call it `./job.yaml`),
and edit the name of the container image to match the name you used.
-->
## 定义 Job   {#defining-a-job}

这里给出一个 Job 的清单。你需要复制一份 Job 清单的副本（将其命名为 `./job.yaml`），
并编辑容器镜像的名称以匹配使用的名称。

{{% code_sample file="application/job/rabbitmq/job.yaml" %}}

<!--
In this example, each pod works on one item from the queue and then exits.
So, the completion count of the Job corresponds to the number of work items
done. That is why the example manifest has `.spec.completions` set to `8`.

## Running the Job

Now, run the Job:
-->
本例中，每个 Pod 使用队列中的一个消息然后退出。
这样，Job 的完成计数就代表了完成的工作项的数量。
这就是示例清单将 `.spec.completions` 设置为 `8` 的原因。

## 运行 Job   {#running-the-job}

运行 Job：

<!--
# this assumes you downloaded and then edited the manifest already
-->
# 这假设你已经下载并编辑了清单
```shell
kubectl apply -f ./job.yaml
```

<!--
You can wait for the Job to succeed, with a timeout:
-->
你可以等待 Job 在某个超时时间后成功：

```shell
# 状况名称的检查不区分大小写
kubectl wait --for=condition=complete --timeout=300s job/job-wq-1
```

<!--
Next, check on the Job:
-->
接下来查看 Job：

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
该 Job 的所有 Pod 都已成功！你完成了。

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

本文所讲述的处理方法的好处是你不需要修改你的 "worker" 程序使其知道工作队列的存在。
你可以将未修改的工作程序包含在容器镜像中。

使用此方法需要你运行消息队列服务。如果不方便运行消息队列服务，
你也许会考虑另外一种[任务模式](/zh-cn/docs/concepts/workloads/controllers/job/#job-patterns)。

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
本文所述的方法为每个工作项创建了一个 Pod。
如果你的工作项仅需数秒钟，为每个工作项创建 Pod 会增加很多的常规消耗。
考虑另一种设计，例如[精细并行工作队列示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)，
这种方案可以实现每个 Pod 执行多个工作项。

示例中，你使用了 `amqp-consume` 从消息队列读取消息并执行真正的程序。
这样的好处是你不需要修改你的程序使其知道队列的存在。
要了解怎样使用客户端库和工作队列通信，
请参考[精细并行工作队列示例](/zh-cn/docs/tasks/job/fine-parallel-processing-work-queue/)。

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

如果设置的完成数量小于队列中的消息数量，会导致一部分消息项不会被执行。

如果设置的完成数量大于队列中的消息数量，当队列中所有的消息都处理完成后，
Job 也会显示为未完成。Job 将创建 Pod 并阻塞等待消息输入。
你需要建立自己的机制来发现何时有工作要做，并测量队列的大小，设置匹配的完成数量。

当发生下面两种情况时，即使队列中所有的消息都处理完了，Job 也不会显示为完成状态：
* 在 `amqp-consume` 命令拿到消息和容器成功退出之间的时间段内，执行杀死容器操作；
* 在 kubelet 向 API 服务器传回 Pod 成功运行之前，发生节点崩溃。
