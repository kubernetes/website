---
cn-approvers:
- linyouchong
title: 使用工作队列进行粗粒度并行处理
---
<!--
---
title: Coarse Parallel Processing Using a Work Queue
---
-->

* TOC
{:toc}

<!--
# Example: Job with Work Queue with Pod Per Work Item
-->
# 示例：每个 Pod 处理工作队列中的单个工作项的 Job

<!--
In this example, we will run a Kubernetes Job with multiple parallel
worker processes.  You may want to be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) first.
-->
在这个例子中，我们会运行一个存在多个并行工作进程的 Kubernetes Job。您可能希望先了解一些基础的、非并行使用 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 的知识。

<!--
In this example, as each pod is created, it picks up one unit of work
from a task queue, completes it, deletes it from the queue, and exits.
-->
在这个例子中，当每个pod被创建时，它会从一个任务队列中获取一个工作单元，处理它，然后将其从队列中删除，最后退出。


<!--
Here is an overview of the steps in this example:
-->
下面是这个示例的步骤概述：

<!--
1. **Start a message queue service.**  In this example, we use RabbitMQ, but you could use another
  one.  In practice you would set up a message queue service once and reuse it for many jobs.
-->
1. **启动一个消息队列服务。** 在这个例子中，我们使用了 RabbitMQ ，但您可以选择其它的消息队列服务。在实际应用中，您可能会部署一个消息队列服务同时用于多项业务。
<!--
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
  this example, a message is just an integer that we will do a lengthy computation on.
-->
1. **创建一个队列，然后向其中填充消息。** 每个消息表示一个将要被处理的工作任务。在这个例子中，消息只是一个用于进行长度计算的整数。
<!--
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
  one task from the message queue, processes it, and repeats until the end of the queue is reached.
-->
1. **启动一个 Job 对队列中的任务进行处理**。这个 Job 启动了若干个 Pod 。每个 Pod 从消息队列中取出一个工作任务，处理它，然后重复，直到到达队列的尾部。

<!--
## Starting a message queue service
-->
## 启动消息队列服务

<!--
This example uses RabbitMQ, but it should be easy to adapt to another AMQP-type message service.
-->
本例子使用了 RabbitMQ ，但是应该很容易就能使它适配其它 AMQP 类型的消息队列。

<!--
In practice you could set up a message queue service once in a
cluster and reuse it for many jobs, as well as for long-running services.
-->
在实际应用中，您可能会在集群中部署一个消息队列服务同时用于多项业务及长期业务。

<!--
Start RabbitMQ as follows:
-->
启动 RabbitMQ，如下：

```shell
$ kubectl create -f examples/celery-rabbitmq/rabbitmq-service.yaml
service "rabbitmq-service" created
$ kubectl create -f examples/celery-rabbitmq/rabbitmq-controller.yaml
replicationcontroller "rabbitmq-controller" created
```

<!--
We will only use the rabbitmq part from the [celery-rabbitmq example](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq).
-->
我们只使用了 [celery-rabbitmq 示例](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq) 的 rabbitmq 部分。

<!--
## Testing the message queue service
-->
## 测试消息队列服务

<!--
Now, we can experiment with accessing the message queue.  We will
create a temporary interactive pod, install some tools on it,
and experiment with queues.
-->
现在，我们可以尝试访问这个消息队列了。我们会创建一个临时的可交互的 Pod ，在其中安装一些工具，然后尝试使用这个消息队列。

<!--
First create a temporary interactive Pod.
-->
首先创建一个临时的可交互的 Pod。

```shell
# Create a temporary interactive container
$ kubectl run -i --tty temp --image ubuntu:14.04
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

<!--
Note that your pod name and command prompt will be different.
-->
注意，您的 pod 名称和命令提示符中提示的是不同的。

<!--
Next install the `amqp-tools` so we can work with message queues.
-->
接下来安装 `amqp-tools` ，这样我们就可以处理消息队列了。

```shell
# Install some tools
root@temp-loe07:/# apt-get update
.... [ lots of output ] ....
root@temp-loe07:/# apt-get install -y curl ca-certificates amqp-tools python dnsutils
.... [ lots of output ] ....
```

<!--
Later, we will make a docker image that includes these packages.
-->
稍后，我们会构建一个包含这些工具包的 docker 镜像

<!--
Next, we will check that we can discover the rabbitmq service:
-->
接下来，我们将检查是否可以发现 rabbitmq 服务

```
# Note the rabbitmq-service has a DNS name, provided by Kubernetes:

root@temp-loe07:/# nslookup rabbitmq-service
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152

# Your address will vary.
```

<!--
If Kube-DNS is not setup correctly, the previous step may not work for you.
You can also find the service IP in an env var:
-->
如果 Kube-DNS 没有正确安装，前面的步骤可能对您无效。您还可以在环境变量中找到服务 IP

```
# env | grep RABBIT | grep HOST
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
# Your address will vary.
```

<!--
Next we will verify we can create a queue, and publish and consume messages.
-->
接下来，我们将验证我们是否可以创建一个队列，并发布和处理消息。

```shell
# In the next line, rabbitmq-service is the hostname where the rabbitmq-service
# can be reached.  5672 is the standard port for rabbitmq.

root@temp-loe07:/# export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672
# If you could not resolve "rabbitmq-service" in the previous step,
# then use this command instead:
# root@temp-loe07:/# BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# Now create a queue:

root@temp-loe07:/# /usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d
foo

# Publish one message to it:

root@temp-loe07:/# /usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# And get it back.

root@temp-loe07:/# /usr/bin/amqp-consume --url=$BROKER_URL -q foo -c 1 cat && echo
Hello
root@temp-loe07:/#
```

<!--
In the last command, the `amqp-consume` tool takes one message (`-c 1`)
from the queue, and passes that message to the standard input of an arbitrary command.  In this case, the program `cat` is just printing
out what it gets on the standard input, and the echo is just to add a carriage
return so the example is readable.
-->
在最后一个命令中，`amqp-consume` 工具从队列中取出了一个消息 (`-c 1`)，然后将该消息传递给任意命令的标准输入。在这个场景中，`cat` 只是将标准输入的内容打印出来，echo 只是添加了一个回车，所以示例是可读的。

<!--
## Filling the Queue with tasks
-->
## 向队列填充任务

<!--
Now lets fill the queue with some "tasks".  In our example, our tasks are just strings to be
printed.
-->
现在让我们往队列中填充一些“任务”。在这个例子中，我们的任务是一些将要被打印出来的字符串。

<!--
In a practice, the content of the messages might be:
-->
在实际应用中，消息的内容可能是这样的：

<!--
- names of files to that need to be processed
- extra flags to the program
- ranges of keys in a database table
- configuration parameters to a simulation
- frame numbers of a scene to be rendered
-->
- 需要处理的文件的名称
- 为程序添加额外的标志
- 数据库表中的键的范围
- 模拟程序的配置参数
- 要呈现的场景的帧数

<!--
In practice, if there is large data that is needed in a read-only mode by all pods
of the Job, you will typically put that in a shared file system like NFS and mount
that readonly on all the pods, or the program in the pod will natively read data from
a cluster file system like HDFS.
-->
在实际应用中，如果 Job 的所有 pod 都需要以只读模式读取大量数据，您通常会把它放在一个像 NFS 这样的共享文件系统并以只读模式挂载到所有的 pod 中，或者让 pod 中的程序从一个像 HDFS 这样的集群文件系统直接读取数据。

<!--
For our example, we will create the queue and fill it using the amqp command line tools.
In practice, you might write a program to fill the queue using an amqp client library.
-->
对于这个例子，我们将创建队列并使用 amqp 命令行工具填充它。实际上，您可以编写一个程序来使用 amqp 客户端库来填充队列。

```shell
$ /usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
job1
$ for f in apple banana cherry date fig grape lemon melon
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

<!--
So, we filled the queue with 8 messages.
-->
至此，我们在队列中填充了 8 条消息。

<!--
## Create an Image
-->
## 构建镜像

<!--
Now we are ready to create an image that we will run as a job.
-->
现在我们已经准备好构建一个将作为 Job 运行的镜像。

<!--
We will use the `amqp-consume` utility to read the message
from the queue and run our actual program.  Here is a very simple
example program:
-->
我们将使用 `amqp-consume` 工具从队列中读取消息并运行我们实际的工作程序。这里有一个非常简单的示例程序:

{% include code.html language="python" file="worker.py" ghlink="/docs/tasks/job/coarse-parallel-processing-work-queue/worker.py" %}

<!--
Now, build an image.  If you are working in the source
tree, then change directory to `examples/job/work-queue-1`.
Otherwise, make a temporary directory, change to it,
download the [Dockerfile](Dockerfile?raw=true),
and [worker.py](worker.py?raw=true).  In either case,
build the image with this command:
-->
现在，构建一个镜像。如果您使用了本文档库的源代码目录，请切换到 `examples/job/work-queue-1` 目录。否则，请创建一个临时目录，然后切换到这个目录，下载 [worker.py](worker.py?raw=true)。上述两种方法,
都可以用这个命令构建像像：

```shell
$ docker build -t job-wq-1 .
```

<!--
For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.
-->
对于 [Docker Hub](https://hub.docker.com/)，请先用您的用户名给镜像打上标签，然后使用下面的命令 push 您的镜像到仓库。请将 `<username>` 替换为您自己的用户名。

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
如果您使用的是 [Google Container
Registry](https://cloud.google.com/tools/container-registry/)，请先用您的 project ID 给您的镜像打上标签，然后 push 到 GCR 。请将 `<project>` 替换为您自己的 project ID

```shell
docker tag job-wq-1 gcr.io/<project>/job-wq-1
gcloud docker -- push gcr.io/<project>/job-wq-1
```

<!--
## Defining a Job
-->
## 定义一个 Job

<!--
Here is a job definition.  You'll need to make a copy of the Job and edit the
image to match the name you used, and call it `./job.yaml`.
-->
这里有一个 Job 定义。您需要复制它并修改其中的 image 字段为您使用的镜像名称，然后调用它 `./job.yaml`。


{% include code.html language="yaml" file="job.yaml" ghlink="/docs/tasks/job/coarse-parallel-processing-work-queue/job.yaml" %}

<!--
In this example, each pod works on one item from the queue and then exits.
So, the completion count of the Job corresponds to the number of work items
done.  So we set, `.spec.completions: 8` for the example, since we put 8 items in the queue.
-->
在这个例子中，每个 pod 从队列中取出一个工作项进行处理然后退出。因此，Job 的 completion 完成数量设置项 和工作项数目相当。我们在这个例子中设置为 `.spec.completions: 8` ，因为我们在队列中填充了 8 个工作项。

<!--
## Running the Job
-->
## 运行 Job

<!--
So, now run the Job:
-->
所以，现在运行这个 Job ：

```shell
kubectl create -f ./job.yaml
```

<!--
Now wait a bit, then check on the job.
-->
稍等片刻，然后检查这个 Job。

```shell
$ kubectl describe jobs/job-wq-1
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
我们所有的 pod 都成功了。太好了。

<!--
## Alternatives
-->
## 其它

<!--
This approach has the advantage that you
do not need to modify your "worker" program to be aware that there is a work queue.
-->
这种方法的优点是您不需要修改您的 “worker” 程序，就可以了解到工作队列的存在。

<!--
It does require that you run a message queue service.
If running a queue service is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
-->
它确实需要您运行一个消息队列服务。如果您不方便运行队列服务，您可以考虑使用另外一种  [job 模式](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns)。

<!--
This approach creates a pod for every work item.  If your work items only take a few seconds,
though, creating a Pod for every work item may add a lot of overhead.  Consider another
[example](/docs/tasks/job/fine-parallel-processing-work-queue/), that executes multiple work items per Pod.
-->
这种方法为每个工作项创建一个 pod 。但是，如果您的工作项只需要几秒钟就能处理完成，为每个工作项创建一个 pod 可能会增加很多开销。考虑另一个[例子](/docs/tasks/job/fine-parallel-processing-work-queue/)，它在每个 pod 中执行多个工作项。

<!--
In this example, we used use the `amqp-consume` utility to read the message
from the queue and run our actual program.  This has the advantage that you
do not need to modify your program to be aware of the queue.
A [different example](/docs/tasks/job/fine-parallel-processing-work-queue/), shows how to
communicate with the work queue using a client library.
-->
在本例中，我们使用了 `amqp-consume` 工具从队列中读取消息并运行我们的业务程序。这样做的好处是，您不需要修改程序就可以了解到工作队列的存在。
[另一个示例](/docs/tasks/job/fine-parallel-processing-work-queue/) 展示了如何使用客户端库与工作队列通信。

<!--
## Caveats
-->
## 警告

<!--
If the number of completions is set to less than the number of items in the queue, then
not all items will be processed.
-->
如果 Job 的完成数量设置小于队列中的工作项数量，则不是所有工作项都会被处理。

<!--
If the number of completions is set to more than the number of items in the queue,
then the Job will not appear to be completed, even though all items in the queue
have been processed.  It will start additional pods which will block waiting
for a message.
-->
如果 Job 的完成数量设置超过队列中的工作项数量，那么即使队列中的所有工作项都已被处理，Job 也不会完成。它会启动额外的 pod ，它会阻塞并等待消息。

<!--
There is an unlikely race with this pattern.  If the container is killed in between the time
that the message is acknowledged by the amqp-consume command and the time that the container
exits with success, or if the node crashes before the kubelet is able to post the success of the pod
back to the api-server, then the Job will not appear to be complete, even though all items
in the queue have been processed.
-->
这种模式存在一种不太可能会出现异常。如果容器在 amqp-consume 命令确认消息的时刻和容器成功退出的时刻的间隙被杀死,又或者如果在 kubelet 向 api-server 发布 pod 已经成功的信息之前，该节点崩溃了,则 Job 不会变为完成状态，即使队列中的所有工作项已经处理完成。
