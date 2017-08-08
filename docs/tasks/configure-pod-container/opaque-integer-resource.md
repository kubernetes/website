---
title: Assign Opaque Integer Resources to a Container
---

{% capture overview %}

This page shows how to assign opaque integer resources to a Container.

{% include feature-state-alpha.md %}

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

Before you do this exercise, do the exercise in
[Advertise Opaque Integer Resources for a Node](/docs/tasks/administer-cluster/opaque-integer-resource-node/).
That will configure one of your Nodes to advertise a dongle resource.

{% endcapture %}


{% capture steps %}

## Assign an opaque integer resource to a Pod

To request an opaque integer resource, include the `resources:requests` field in your
Container manifest. Opaque integer resources have the prefix `pod.alpha.kubernetes.io/opaque-int-resource-`.

Here is the configuration file for a Pod that has one Container:

{% include code.html language="yaml" file="oir-pod.yaml" ghlink="/docs/tasks/configure-pod-container/oir-pod.yaml" %}

In the configuration file, you can see that the Container requests 3 dongles.

Create a Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod.yaml
```

Verify that the Pod is running:

```shell
kubectl get pod oir-demo
```

Describe the Pod:

```shell
kubectl describe pod oir-demo
```

The output shows the memory, CPU, and dongle requests:

```yaml
Requests:
  pod.alpha.kubernetes.io/opaque-int-resource-dongle: 3
```

## Attempt to create a second Pod

Here is the configuration file for a Pod that has one Container. The Container requests
two dongles.

{% include code.html language="yaml" file="oir-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/oir-pod-2.yaml" %}

Kubernetes will not be able to satisfy the request for two dongles, because the first Pod
used three of the four available dongles.

Attempt to create a Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod-2.yaml
```

Describe the Pod

```shell
kubectl describe pod oir-demo-2
```

The output shows that the Pod cannot be scheduled, because there is no Node that has
2 dongles available:


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (oir-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient pod.alpha.kubernetes.io/opaque-int-resource-dongle (1)
```

View the Pod status:

```shell
kubectl get pod oir-demo-2
```

The output shows that the Pod was created, but not scheduled to run on a Node.
It has a status of Pending:

```yaml
NAME         READY     STATUS    RESTARTS   AGE
oir-demo-2   0/1       Pending   0          6m
```

## Clean up

Delete the Pod that you created for this exercise:

```shell
kubectl delete pod oir-demo
```

{% endcapture %}

{% capture whatsnext %}

### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](docs/tasks/configure-pod-container/assign-cpu-resource/)

### For cluster administrators

* [Advertise Opaque Integer Resources for a Node](/docs/tasks/administer-cluster/opaque-integer-resource-node/)

{% endcapture %}


{% include templates/task.md %}



