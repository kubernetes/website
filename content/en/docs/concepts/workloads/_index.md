---
title: "Workloads"
weight: 50
description: >
  Understand Pods, the smallest deployable compute object in Kubernetes, and the higher-level abstractions that help you to run them.
no_list: true
---

{{< glossary_definition term_id="workload" length="short" >}}
Whether your workload is a single component or several that work together, on Kubernetes you run
it inside a set of [_pods_](/docs/concepts/workloads/pods).
In Kubernetes, a `Pod` represents a set of running
{{< glossary_tooltip text="containers" term_id="container" >}} on your cluster.

Kubernetes pods have a [defined lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
For example, once a pod is running in your cluster then a critical fault on the
{{< glossary_tooltip text="node" term_id="node" >}} where that pod is running means that
all the pods on that node fail. Kubernetes treats that level of failure as final: you
would need to create a new `Pod` to recover, even if the node later becomes healthy.

However, to make life considerably easier, you don't need to manage each `Pod` directly.
Instead, you can use _workload resources_ that manage a set of pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of pod are running, to match the state
you specified.

Kubernetes provides several built-in workload resources:

* [`Deployment`](/docs/concepts/workloads/controllers/deployment/) and [`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/)
  (replacing the legacy resource
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).
  `Deployment` is a good fit for managing a stateless application workload on your cluster,
  where any `Pod` in the `Deployment` is interchangeable and can be replaced if needed.
* [`StatefulSet`](/docs/concepts/workloads/controllers/statefulset/) lets you
  run one or more related Pods that do track state somehow. For example, if your workload
  records data persistently, you can run a `StatefulSet` that matches each `Pod` with a
  [`PersistentVolume`](/docs/concepts/storage/persistent-volumes/). Your code, running in the
  `Pods` for that `StatefulSet`, can replicate data to other `Pods` in the same `StatefulSet`
  to improve overall resilience.
* [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) defines `Pods` that provide
  node-local facilities. These might be fundamental to the operation of your cluster, such
  as a networking helper tool, or be part of an
  {{< glossary_tooltip text="add-on" term_id="addons" >}}.  
  Every time you add a node to your cluster that matches the specification in a `DaemonSet`,
  the control plane schedules a `Pod` for that `DaemonSet` onto the new node.
* [`Job`](/docs/concepts/workloads/controllers/job/) and
  [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/)
  define tasks that run to completion and then stop. Jobs represent one-off tasks, whereas
  `CronJobs` recur according to a schedule.

In the wider Kubernetes ecosystem, you can find third-party workload resources that provide
additional behaviors. Using a
[custom resource definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
you can add in a third-party workload resource if you want a specific behavior that's not part
of Kubernetes' core. For example, if you wanted to run a group of `Pods` for your application but
stop work unless _all_ the Pods are available (perhaps for some high-throughput distributed task),
then you can implement or install an extension that does provide that feature.

## {{% heading "whatsnext" %}}

As well as reading about each resource, you can learn about specific tasks that relate to them:

* [Run a stateless application using a `Deployment`](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run automated tasks with a `CronJob`](/docs/tasks/job/automated-tasks-with-cron-jobs/)

To learn about Kubernetes' mechanisms for separating code from configuration,
visit [Configuration](/docs/concepts/configuration/).

There are two supporting concepts that provide backgrounds about how Kubernetes manages pods
for applications:
* [Garbage collection](/docs/concepts/workloads/controllers/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.

Once your application is running, you might want to make it available on the internet as
a [`Service`](/docs/concepts/services-networking/service/) or, for web application only,
using an [`Ingress`](/docs/concepts/services-networking/ingress).

