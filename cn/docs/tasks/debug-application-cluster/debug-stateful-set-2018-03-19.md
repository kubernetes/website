---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug a StatefulSet
---

{% capture overview %}

This task shows you how to debug a StatefulSet.

{% endcapture %}

{% capture prerequisites %}

* You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster.
* You should have a StatefulSet running that you want to investigate.

{% endcapture %}

{% capture steps %}

## Debugging a StatefulSet

In order to list all the pods which belong to a StatefulSet, which have a label `app=myapp` set on them,
you can use the following:

```shell
kubectl get pods -l app=myapp
```

If you find that any Pods listed are in `Unknown` or `Terminating` state for an extended period of time,
refer to the [Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/) task for
instructions on how to deal with them.
You can debug individual Pods in a StatefulSet using the
[Debugging Pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/) guide.

{% endcapture %}

{% capture whatsnext %}

Learn more about [debugging an init-container](/docs/tasks/debug-application-cluster/debug-init-containers/).

{% endcapture %}

{% include templates/task.md %}
