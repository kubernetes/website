---
title: Coarse Parallel Processing Using a Work Queue
content_template: templates/task
weight: 30
---


{{% capture overview %}}

In this example, we will run a Kubernetes Job with multiple parallel
worker processes.

In this example, as each pod is created, it picks up one unit of work
from a task queue, completes it, deletes it from the queue, and exits.

Here is an overview of the steps in this example:

1. **Start a message queue service.**  In this example, we use RabbitMQ, but you could use another
  one.  In practice you would set up a message queue service once and reuse it for many jobs.
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
  this example, a message is just an integer that we will do a lengthy computation on.
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
  one task from the message queue, processes it, and repeats until the end of the queue is reached.

{{% /capture %}}


{{% capture prerequisites %}}

Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Starting a message queue service

This example uses RabbitMQ, but it should be easy to adapt to another AMQP-type message service.

In practice you could set up a message queue service once in a
cluster and reuse it for many jobs, as well as for long-running services.

Start RabbitMQ as follows:

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

We will only use the rabbitmq part from the [celery-rabbitmq example](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq).

## Testing the message queue service

Now, we can experiment with accessing the message queue.  We will
create a temporary interactive pod, install some tools on it,
and experiment with queues.

First create a temporary interactive Pod.

```shell
# Create a temporary interactive container
kubectl run -i --tty temp --image ubuntu:18.04
```
```
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

Note that your pod name and command prompt will be different.

Next install the `amqp-tools` so we can work with message queues.

```shell
# Install some tools
root@temp-loe07:/# apt-get update
.... [ lots of output ] ....
root@temp-loe07:/# apt-get install -y curl ca-certificates amqp-tools python dnsutils
.... [ lots of output ] ....
```

Later, we will make a docker image that includes these packages.

Next, we will check that we can discover the rabbitmq service:

```
# Note the rabbitmq-service has a DNS name, provided by Kubernetes:

root@temp-loe07:/# nslookup rabbitmq-service
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152

# Your address will vary.
```

If Kube-DNS is not setup correctly, the previous step may not work for you.
You can also find the service IP in an env var:

```
# env | grep RABBIT | grep HOST
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
# Your address will vary.
```

Next we will verify we can create a queue, and publish and consume messages.

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

In the last command, the `amqp-consume` tool takes one message (`-c 1`)
from the queue, and passes that message to the standard input of an arbitrary command.  In this case, the program `cat` is just printing
out what it gets on the standard input, and the echo is just to add a carriage
return so the example is readable.

## Filling the Queue with tasks

Now let's fill the queue with some "tasks".  In our example, our tasks are just strings to be
printed.

In a practice, the content of the messages might be:

- names of files to that need to be processed
- extra flags to the program
- ranges of keys in a database table
- configuration parameters to a simulation
- frame numbers of a scene to be rendered

In practice, if there is large data that is needed in a read-only mode by all pods
of the Job, you will typically put that in a shared file system like NFS and mount
that readonly on all the pods, or the program in the pod will natively read data from
a cluster file system like HDFS.

For our example, we will create the queue and fill it using the amqp command line tools.
In practice, you might write a program to fill the queue using an amqp client library.

```shell
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
job1
```
```shell
for f in apple banana cherry date fig grape lemon melon
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

So, we filled the queue with 8 messages.

## Create an Image

Now we are ready to create an image that we will run as a job.

We will use the `amqp-consume` utility to read the message
from the queue and run our actual program.  Here is a very simple
example program:

{{< codenew language="python" file="application/job/rabbitmq/worker.py" >}}

Give the script execution permission:

```shell
chmod +x worker.py
```

Now, build an image.  If you are working in the source
tree, then change directory to `examples/job/work-queue-1`.
Otherwise, make a temporary directory, change to it,
download the [Dockerfile](/examples/application/job/rabbitmq/Dockerfile),
and [worker.py](/examples/application/job/rabbitmq/worker.py).  In either case,
build the image with this command:

```shell
docker build -t job-wq-1 .
```

For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

If you are using [Google Container
Registry](https://cloud.google.com/tools/container-registry/), tag
your app image with your project ID, and push to GCR. Replace
`<project>` with your project ID.

```shell
docker tag job-wq-1 gcr.io/<project>/job-wq-1
gcloud docker -- push gcr.io/<project>/job-wq-1
```

## Defining a Job

Here is a job definition.  You'll need to make a copy of the Job and edit the
image to match the name you used, and call it `./job.yaml`.


{{< codenew file="application/job/rabbitmq/job.yaml" >}}

In this example, each pod works on one item from the queue and then exits.
So, the completion count of the Job corresponds to the number of work items
done.  So we set, `.spec.completions: 8` for the example, since we put 8 items in the queue.

## Running the Job

So, now run the Job:

```shell
kubectl apply -f ./job.yaml
```

Now wait a bit, then check on the job.

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

All our pods succeeded.  Yay.

{{% /capture %}}

{{% capture discussion %}}

## Alternatives

This approach has the advantage that you
do not need to modify your "worker" program to be aware that there is a work queue.

It does require that you run a message queue service.
If running a queue service is inconvenient, you may
want to consider one of the other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).

This approach creates a pod for every work item.  If your work items only take a few seconds,
though, creating a Pod for every work item may add a lot of overhead.  Consider another
[example](/docs/tasks/job/fine-parallel-processing-work-queue/), that executes multiple work items per Pod.

In this example, we use the `amqp-consume` utility to read the message
from the queue and run our actual program.  This has the advantage that you
do not need to modify your program to be aware of the queue.
A [different example](/docs/tasks/job/fine-parallel-processing-work-queue/), shows how to
communicate with the work queue using a client library.

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

{{% /capture %}}
