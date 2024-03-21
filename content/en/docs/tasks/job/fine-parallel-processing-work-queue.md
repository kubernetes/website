---
title: Fine Parallel Processing Using a Work Queue
content_type: task
weight: 30
---

<!-- overview -->

In this example, you will run a Kubernetes Job that runs multiple parallel
tasks as worker processes, each running as a separate Pod.

In this example, as each pod is created, it picks up one unit of work
from a task queue, processes it, and repeats until the end of the queue is reached.

Here is an overview of the steps in this example:

1. **Start a storage service to hold the work queue.**  In this example, you will use Redis to store
   work items.  In the [previous example](/docs/tasks/job/coarse-parallel-processing-work-queue),
   you used RabbitMQ.  In this example, you will use Redis and a custom work-queue client library;
   this is because AMQP does not provide a good way for clients to
   detect when a finite-length work queue is empty.  In practice you would set up a store such
   as Redis once and reuse it for the work queues of many jobs, and other things.
1. **Create a queue, and fill it with messages.**  Each message represents one task to be done.  In
   this example, a message is an integer that we will do a lengthy computation on.
1. **Start a Job that works on tasks from the queue**.  The Job starts several pods.  Each pod takes
   one task from the message queue, processes it, and repeats until the end of the queue is reached.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

You will need a container image registry where you can upload images to run in your cluster.
The example uses [Docker Hub](https://hub.docker.com/), but you could adapt it to a different
container image registry.

This task example also assumes that you have Docker installed locally. You use Docker to
build container images.

<!-- steps -->

Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).

<!-- steps -->

## Starting Redis

For this example, for simplicity, you will start a single instance of Redis.
See the [Redis Example](https://github.com/kubernetes/examples/tree/master/guestbook) for an example
of deploying Redis scalably and redundantly.

You could also download the following files directly:

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

To start a single instance of Redis, you need to create the redis pod and redis service:

```shell
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

## Filling the queue with tasks

Now let's fill the queue with some "tasks".  In this example, the tasks are strings to be
printed.

Start a temporary interactive pod for running the Redis CLI.

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```
```
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Now hit enter, start the Redis CLI, and create a list with some work items in it.

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

So, the list with key `job2` will be the work queue.

Note: if you do not have Kube DNS setup correctly, you may need to change
the first step of the above block to `redis-cli -h $REDIS_SERVICE_HOST`.


## Create a container image {#create-an-image}

Now you are ready to create an image that will process the work in that queue.

You're going to use a Python worker program with a Redis client to read
the messages from the message queue.

A simple Redis work queue client library is provided,
called `rediswq.py` ([Download](/examples/application/job/redis/rediswq.py)).

The "worker" program in each Pod of the Job uses the work queue
client library to get work.  Here it is:

{{% code_sample language="python" file="application/job/redis/worker.py" %}}

You could also download [`worker.py`](/examples/application/job/redis/worker.py),
[`rediswq.py`](/examples/application/job/redis/rediswq.py), and
[`Dockerfile`](/examples/application/job/redis/Dockerfile) files, then build
the container image. Here's an example using Docker to do the image build:

```shell
docker build -t job-wq-2 .
```

### Push the image

For the [Docker Hub](https://hub.docker.com/), tag your app image with
your username and push to the Hub with the below commands. Replace
`<username>` with your Hub username.

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

You need to push to a public repository or [configure your cluster to be able to access
your private repository](/docs/concepts/containers/images/).

## Defining a Job

Here is a manifest for the Job you will create:

{{% code_sample file="application/job/redis/job.yaml" %}}

{{< note >}}
Be sure to edit the manifest to
change `gcr.io/myproject` to your own path.
{{< /note >}}

In this example, each pod works on several items from the queue and then exits when there are no more items.
Since the workers themselves detect when the workqueue is empty, and the Job controller does not
know about the workqueue, it relies on the workers to signal when they are done working.
The workers signal that the queue is empty by exiting with success.  So, as soon as **any** worker
exits with success, the controller knows the work is done, and that the Pods will exit soon.
So, you need to leave the completion count of the Job unset. The job controller will wait for
the other pods to complete too.

## Running the Job

So, now run the Job:

```shell
# this assumes you downloaded and then edited the manifest already
kubectl apply -f ./job.yaml
```

Now wait a bit, then check on the Job:

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

You can wait for the Job to succeed, with a timeout:
```shell
# The check for condition name is case insensitive
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

As you can see, one of the pods for this Job worked on several work units.

<!-- discussion -->

## Alternatives

If running a queue service or modifying your containers to use a work queue is inconvenient, you may
want to consider one of the other
[job patterns](/docs/concepts/workloads/controllers/job/#job-patterns).

If you have a continuous stream of background processing work to run, then
consider running your background workers with a ReplicaSet instead,
and consider running a background processing library such as
[https://github.com/resque/resque](https://github.com/resque/resque).

