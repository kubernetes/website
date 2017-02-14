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

In this exercise, you create a Service and a Deployment. Here is the
configuration file for the Service:

{% include code.html language="yaml" file="redis-service.yaml" ghlink="/docs/tasks/debug-application-cluster/redis-service.yaml" %}

In the configuration file, you can see that the Service provides access to
Pods that have the the label `pod-is-for: kubectl-exec-demo`.

Create the Service:

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/redis-service.yaml
```

The next step is to create a Deployment. The Deployment has a one Pod, and the
Pod has one Container that runs the `redis` image. Here is the configuration
file for the Deployment:

{% include code.html language="yaml" file="redis-deployment.yaml" ghlink="/docs/tasks/debug-application-cluster/redis-deployment.yaml" %}

In the configuration file, you can see that the Pod has the label `pod-is-for: kubectl-exec-demo`.

Create the Deployment:

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/redis-deployment.yaml
```

Check to see whether the Pod is running:

```shell
kubectl get pods
```

Repeat the preceding command until the Pod is running and ready:

```
NAME                              READY     STATUS    RESTARTS   AGE
redis-deployment-84379565-3z9t7   1/1       Running   0          6s
```

Note the name of your Pod. In the preceding output, the Pod name is
`redis-deployment-84379565-3z9t7`

View the environment variables of the Container running in the Pod:

```shell
kubectl exec <your-pod-name> env
```

where `<your-pod-name>` is the name of your Pod.

The output includes environment variables that hold the port and IP address
of your Service.

```
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_SERVICE_HOST=10.0.0.219
```

## Using kubectl exec to check the mounted volumes

It is convenient to use `kubectl exec` to see whether volumes are mounted as
expected.

In the configuration file for your Deployment, you can see that the Pod has an
`emptyDir` volume, and the Container mounts the volume at `/data/redis`.
When the Container starts, it writes Hello to `/data/redis/testfile`.

View the contents `testfile` in the `data/redis` directory:

```shell
kubectl exec <your-pod-name> cat /data/redis/testfile
```

The output shows that the `redis` directory exists as expected:

## Using kubectl exec to open a bash terminal in a pod

Open a shell to the running Container:

```shell
kubectl exec -ti storage -- bash
root@storage:/data#
```

In your shell, experiment with commands:

```shell
TODO
```

{% endcapture %}


{% capture whatsnext %}

* TODO

{% endcapture %}


{% include templates/task.md %}
