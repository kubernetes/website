---
assignees:
- davidopp
title: Safely Draining a Node while Respecting Application SLOs
---

{% capture overview %}
This page shows how to safely drain a machine, respecting the application-level
disruption SLOs you have specified using PodDisruptionBudget.
{% endcapture %}

{% capture prerequisites %}

This task assumes that you have met the following prerequisites:

* You are using Kubernetes release >= 1.5.
* You have created [PodDisruptionBudget(s)](/docs/admin/disruptions.md) to express the
application-level disruption SLOs you want the system to enforce.

{% endcapture %}

{% capture steps %}

## Use `kubectl drain` to remove a node from service

You can use `kubectl drain` to safely evict all of your pods from a
node before you perform maintenance on the node (e.g. kernel upgrade,
hardware maintenance, etc.). Safe evictions allow the pod's containers
to
[gracefully terminate](/docs/user-guide/production-pods.md#lifecycle-hooks-and-termination-notice) and
will respect the `PodDisruptionBudgets` you have specified.

**Note:** By default `kubectl drain` will ignore certain system pods on the node
that cannot be killed; see
the [kubectl drain](/docs/user-guide/kubectl/kubectl_drain.md)
documentation for more details.

When `kubectl drain` returns successfully, that indicates that all of
the pods (except the ones excluded as described in the previous paragraph)
have been safely evicted (respecting the desired graceful
termination period, and without violating any application-level
disruption SLOs). It is then safe to bring down the node by powering
down its physical machine or, if running on a cloud platform, deleting its
virtual machine.

First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with

```shell
kubectl get nodes
```

Next, tell Kubernetes to drain the node:

```shell
kubectl drain <node name>
```

Once it returns (without giving an error), you can power down the node
(or equivalently, if on a cloud platform, delete the virtual machine backing the node).
If you leave the node in the cluster during the maintenance operation, you need to run

```shell
kubectl uncordon <node name>
```
afterwards to tell Kubernetes that it can resume scheduling new pods onto the node.

## Draining multiple nodes in parallel

The `kubectl drain` command should only be issued to a single node at a
time. However, you can run multiple `kubectl drain` commands for
different node in parallel, in different terminals or in the
background. Multiple drain commands running concurrently will still
respect the `PodDisruptionBudget` you specify.

For example, if you have a StatefulSet with three replicas and have
set a `PodDisruptionBudget` for that set specifying `minAvailable:
2`. `kubectl drain` will only evict a pod from the StatefulSet if all
three pods are ready, and if you issue multiple drain commands in
parallel, Kubernetes will respect the PodDisruptionBudget an ensure
that only one pod is unavailable at any given time. Any drains that
would cause the number of ready replicas to fall below the specified
budget are blocked.


{% endcapture %}

{% capture whatsnext %}
*TODO: link to other docs about Stateful Set?*
{% endcapture %}

{% include templates/task.md %}
