---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debugging Init Containers
---

{% capture overview %}

This page shows how to investigate problems related to the execution of
Init Containers.

{% endcapture %}

{% capture prerequisites %}

* You should be familiar with the basics of
  [Init Containers](/docs/user-guide/pods/init-container/).
* You should have a [Pod](/docs/user-guide/pods/) you want to debug that uses
  Init Containers. The example command lines below refer to the Pod as
  `<pod-name>` and the Init Containers as `<init-container-1>` and
  `<init-container-2>`.

{% endcapture %}

{% capture steps %}

## Checking the status of Init Containers

The Pod status will give you an overview of Init Container execution:

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

You can see detailed information about Init Container execution by running:

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
`pod.beta.kubernetes.io/init-container-status` annotation on the Pod:

{% raw %}
```shell
kubectl get pod <pod-name> --template '{{index .metadata.annotations "pod.beta.kubernetes.io/init-container-statuses"}}'
```
{% endraw %}

This will return the same information as above, but in raw JSON format.

## Accessing logs from Init Containers

You can access logs for an Init Container by passing its Container name along
with the Pod name:

```shell
kubectl logs <pod-name> -c <init-container-2>
```

If your Init Container runs a shell script, it helps to enable printing of
commands as they're executed. For example, you can do this in Bash by running
`set -x` at the beginning of the script.

{% endcapture %}

{% capture discussion %}

## Understanding Pod status

A Pod status beginning with `Init:` summarizes the status of Init Container
execution. The table below describes some example status values that you might
see while debugging Init Containers.

Status | Meaning
------ | -------
`Init:N/M` | The Pod has `M` Init Containers, and `N` have completed so far.
`Init:Error` | An Init Container has failed to execute.
`Init:CrashLoopBackOff` | An Init Container has failed repeatedly.

A Pod with status `Pending` has not yet begun executing Init Containers.
A Pod with status `PodInitializing` or `Running` has already finished executing
Init Containers.

{% endcapture %}

{% include templates/task.md %}

