---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug Init Containers
content_type: task
weight: 40
---

<!-- overview -->

This page shows how to investigate problems related to the execution of
Init Containers. The example command lines below refer to the Pod as
`<pod-name>` and the Init Containers as `<init-container-1>` and
`<init-container-2>`.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* You should be familiar with the basics of
  [Init Containers](/docs/concepts/workloads/pods/init-containers/).
* You should have [Configured an Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).

<!-- steps -->

## Checking the status of Init Containers

Display the status of your pod:

```shell
kubectl get pod <pod-name>
```

For example, a status of `Init:1/2` indicates that one of two Init Containers
has completed successfully:

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

See [Understanding Pod status](#understanding-pod-status) for more examples of
status values and their meanings.

## Getting details about Init Containers

View more detailed information about Init Container execution:

```shell
kubectl describe pod <pod-name>
```

For example, a Pod with two Init Containers might show the following:

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

You can also access the Init Container statuses programmatically by reading the
`status.initContainerStatuses` field on the Pod Spec:


```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```


This command will return the same information as above in raw JSON.

## Accessing logs from Init Containers

Pass the Init Container name along with the Pod name
to access its logs.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Init Containers that run a shell script print
commands as they're executed. For example, you can do this in Bash by running
`set -x` at the beginning of the script.



<!-- discussion -->

## Understanding Pod status

A Pod status beginning with `Init:` summarizes the status of Init Container
execution. The table below describes some example status values that you might
see while debugging Init Containers.

Status | Meaning
------ | -------
`Init:N/M` | The Pod has `M` Init Containers, and `N` have completed so far.
`Init:Error` | An Init Container has failed to execute.
`Init:CrashLoopBackOff` | An Init Container has failed repeatedly.
`Pending` | The Pod has not yet begun executing Init Containers.
`PodInitializing` or `Running` | The Pod has already finished executing Init Containers.





