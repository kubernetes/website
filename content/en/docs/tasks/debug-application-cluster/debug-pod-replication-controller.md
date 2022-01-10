---
reviewers:
- bprashanth
title: Debug Pods and ReplicationControllers
content_type: task
---

<!-- overview -->

This page shows how to debug Pods and ReplicationControllers.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* You should be familiar with the basics of
  {{< glossary_tooltip text="Pods" term_id="pod" >}} and with 
  Pods' [lifecycles](/docs/concepts/workloads/pods/pod-lifecycle/).

<!-- steps -->

## Debugging Pods

The first step in debugging a pod is taking a look at it. Check the current
state of the pod and recent events with the following command:

```shell
kubectl describe pods ${POD_NAME}
```

Look at the state of the containers in the pod. Are they all `Running`?  Have
there been recent restarts?

Continue debugging depending on the state of the pods.

### My pod stays pending

If a pod is stuck in `Pending` it means that it can not be scheduled onto a
node. Generally this is because there are insufficient resources of one type or
another that prevent scheduling. Look at the output of the `kubectl describe
...` command above. There should be messages from the scheduler about why it
can not schedule your pod. Reasons include:

#### Insufficient resources

You may have exhausted the supply of CPU or Memory in your cluster. In this
case you can try several things:

* Add more nodes to the cluster.

* [Terminate unneeded pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
  to make room for pending pods.

* Check that the pod is not larger than your nodes. For example, if all
  nodes have a capacity of `cpu:1`, then a pod with a request of `cpu: 1.1`
  will never be scheduled.

    You can check node capacities with the `kubectl get nodes -o <format>`
    command. Here are some example command lines that extract the necessary
    information:

    ```shell
    kubectl get nodes -o yaml | egrep '\sname:|cpu:|memory:'
    kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, cap: .status.capacity}'
    ```

  The [resource quota](/docs/concepts/policy/resource-quotas/)
  feature can be configured to limit the total amount of
  resources that can be consumed. If used in conjunction with namespaces, it can
  prevent one team from hogging all the resources.

#### Using hostPort

When you bind a pod to a `hostPort` there are a limited number of places that
the pod can be scheduled. In most cases, `hostPort` is unnecessary; try using a
service object to expose your pod. If you do require `hostPort` then you can
only schedule as many pods as there are nodes in your container cluster.

### My pod stays waiting

If a pod is stuck in the `Waiting` state, then it has been scheduled to a
worker node, but it can't run on that machine. Again, the information from
`kubectl describe ...` should be informative. The most common cause of
`Waiting` pods is a failure to pull the image. There are three things to check:

* Make sure that you have the name of the image correct.
* Have you pushed the image to the repository?
* Run a manual `docker pull <image>` on your machine to see if the image can be
  pulled.

### My pod is crashing or otherwise unhealthy

Once your pod has been scheduled, the methods described in [Debug Running Pods](
/docs/tasks/debug-application-cluster/debug-running-pod/) are available for debugging.


## Debugging ReplicationControllers

ReplicationControllers are fairly straightforward. They can either create pods
or they can't. If they can't create pods, then please refer to the
[instructions above](#debugging-pods) to debug your pods.

You can also use `kubectl describe rc ${CONTROLLER_NAME}` to inspect events
related to the replication controller.


