---
assignees:
- janetkuo

---

* TOC
{:toc}

A pod is a group of containers that are scheduled
onto the same host. Pods serve as units of scheduling, deployment, and
horizontal scaling/replication. Pods share fate, and share some resources, such
as storage volumes and IP addresses.

## Creating a pod

Single-container pods can be created with the `run` command. The
pod's properties are specified with flags on the command line.

The `run` command creates a Deployment to monitor the pod(s).
The Deployment watches for failed pods and will start up new pods as required
to maintain the specified number.

Note: If you don't want a Deployment to monitor your pod (e.g. your pod
is writing non-persistent data which won't survive a restart, or your pod is
intended to be very short-lived), you can
[create a pod directly with the `create` command](/docs/user-guide/pods/multi-container/).

To create a pod using the `run` command:

```shell
$ kubectl run NAME
    --image=image
    [--port=port]
    [--replicas=replicas]
    [--labels=key=value,key=value,...]
```

Where:

* `kubectl run` creates a Deployment named "nginx" on Kubernetes cluster >= v1.2. If you are running older versions, it creates replication controllers instead. If you want to obtain the old behavior, use `--generator=run/v1` to create replication controllers. See [`kubectl run`](/docs/user-guide/kubectl/kubectl_run/) for more details. 
* `NAME` (required) is the name of the container to create. This value is also
  applied as the name of the Deployment, and as the prefix of the
  pod name. For example:
  
  ```shell 
  $ kubectl run example --image=nginx
  deployment "example" created

  $ kubectl get pods -l run=example
  NAME                       READY     STATUS    RESTARTS   AGE
  example-1934187764-scau1   1/1       Running   0          13s
  ```
* `--image=IMAGE` (required) is the Docker container image to use for this
   container.
* `--port=PORT` is the port to expose on the container.
* `--replicas=NUM` is the number of replicated pods to create. If not specified,
  one pod will be created.
* `--labels=key=value` specifies one or more labels to attach to the pod. In
  addition to any labels specified here, `run` attaches a label of
  the format `run=NAME`. This is used by the Deployment
  to target the pods created by the command.
  
![image](/images/docs/pods/single-container_1.svg)  

There are additional flags that can be specified. For a complete list, run:

    $ kubectl run --help

## Viewing a pod

{% include_relative _viewing-a-pod.md %}

## Deleting a pod

If your pod was created using the `run` command, kubernetes creates a
[Deployment](/docs/user-guide/deployments/)
to manage the pod. Pods managed by a Deployment are rescheduled if
they go away, including being deleted by `kubectl delete pod`. To permanently
delete the pod, delete its Deployment.

First, find the Deployment's name:

```shell
$ kubectl get deployment 
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
example   1         1         1            1           1m
```

Then, `delete` the Deployment:

```shell
$ kubectl delete deployment DEPLOYMENT_NAME
```
