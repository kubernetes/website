---
assignees:
- caesarxuchao
- mikedanese
title: Running Commands in a Container using kubectl exec
---

{% capture overview %}

This page shows how to use `kubectl exec` to run commands in a Container.
{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Using kubectl exec to view the environment variables of a Container

Kubernetes exposes
[services](/docs/user-guide/services/#environment-variables) through environment variables.
It is convenient to check these environment variables using `kubectl exec`.

In this exercise, you create a Deployment that has a single Pod. The pod has
one Container that runs the `redis` image. Here is the configuration file for the
Deployment:

{% include code.html language="yaml" file="redis-deployment.yaml" ghlink="/docs/tasks/debug-application-cluster/redis-deployment.yaml" %}

Create the Deployment:

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/redis-deployment.yaml
```

Next, create the Service:

```
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/redis-service.yaml
```

Check to see whether the Pod is running:

```shell
$ kubectl get pod
```

Repeat the preceding command until the Pod is running and ready:

NAME                 READY     REASON       RESTARTS   AGE
redis-master-ft9ex   1/1       Running      0          12s
```

View the environment variables of the Container running in the Pod:

```shell
$ kubectl exec redis-master-ft9ex env

```

The output includes environment variables related to the Service:

```
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_SERVICE_HOST=10.0.0.219
```

## Using kubectl exec to check the mounted volumes

It is convenient to use `kubectl exec` to see whether volumes are mounted as expected.


We first create a Pod with a volume mounted at /data/redis,

```shell
kubectl create -f docs/user-guide/walkthrough/pod-redis.yaml
```

wait until the pod is Running and Ready,

```shell
$ kubectl get pods
NAME      READY     REASON    RESTARTS   AGE
storage   1/1       Running   0          1m
```

we then use `kubectl exec` to verify that the volume is mounted at /data/redis,

```shell
$ kubectl exec storage ls /data
redis
```

## Using kubectl exec to open a bash terminal in a pod

After all, open a terminal in a pod is the most direct way to introspect the pod. Assuming the pod/storage is still running, run

```shell
$ kubectl exec -ti storage -- bash
root@storage:/data#
```

This gets you a terminal.

{% endcapture %}


{% capture whatsnext %}

* See the `terminationMessagePath` field in
  [Container](/docs/api-reference/v1/definitions#_v1_container).
* Learn about [retrieving logs](/docs/user-guide/logging/).
* Learn about [Go templates](https://golang.org/pkg/text/template/).

{% endcapture %}


{% include templates/task.md %}
