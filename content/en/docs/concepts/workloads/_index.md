---
title: "Workloads"
weight: 50
description: >
  Understand Pods, the smallest deployable compute object in Kubernetes, and the higher-level abstractions that help you to run them.
no_list: true
---

{{< glossary_definition term_id="workload" length="short" >}}
Whether your workload is a single component or several that work together, on Kubernetes you run
it inside a set of [Pods](/docs/concepts/workloads/pods).
In Kubernetes, a Pod represents a set of running {{< glossary_tooltip text="containers" term_id="container" >}}
on your cluster.

A Pod has a defined lifecycle. For example, once a Pod is running in your cluster then
a critical failure on the {{< glossary_tooltip text="node" term_id="node" >}} where that
Pod is running means that all the Pods on that node fail. Kubernetes treats that level
of failure as final: you would need to create a new Pod even if the node later recovers.

However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use _workload resources_ that manage a set of Pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of Pod are running, to match the state
you specified.

Those workload resources include:

* [Deployment](/docs/concepts/workloads/controllers/deployment/) and [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
  (replacing the legacy resource {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}});
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/);
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) for running Pods that provide
  node-local facilities, such as a storage driver or network plugin;
* [Job](/docs/concepts/workloads/controllers/job/) and
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/)
  for tasks that run to completion.

There are also two supporting concepts that you might find relevant:
* [Garbage collection](/docs/concepts/workloads/controllers/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.

## {{% heading "whatsnext" %}}

As well as reading about each resource, you can learn about specific tasks that relate to them:

* [Run a stateless application using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)

Once your application is running, you might want to make it available on the internet as
a [Service](/docs/concepts/services-networking/service/) or, for web application only,
using an [Ingress](/docs/concepts/services-networking/ingress).

You can also visit [Configuration](/docs/concepts/configuration/) to learn about Kubernetes'
mechanisms for separating code from configuration.
