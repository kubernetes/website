---
title: Workload controllers
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

This page lists the workload
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.
{{< glossary_definition term_id="workload" length="short">}}

{{% /capture %}}

{{% capture body %}}
## CronJob controller

The [CronJob controller](/docs/reference/controllers/cronjob/) creates
{{< glossary_tooltip text="Jobs" term_id="job" >}} for a
{{< glossary_tooltip term_id="cronjob" >}} on a time-based schedule.

## DaemonSet controller

The [DaemonSet controller](/docs/reference/controllers/daemonset/) manages
Pods configured via a
{{< glossary_tooltip term_id="daemonset" >}} object, to make sure that some
(or all) Nodes run a copy of a Pod.

## Deployment controller

The [Deployment controller](/docs/reference/controllers/deployment/)
enables declarative definitions for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) to run an application
using stateless containers.

## Job controller

The [Job controller](/docs/reference/controllers/job/) creates
{{< glossary_tooltip term_id="pod" text="Pods" >}} to run each defined
Job to completion.

## ReplicaSet controller

The [ReplicaSet controller](/docs/reference/controllers/replicaset/)
maintains a stable number of replica Pods for each
{{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}}.

## ReplicationController

The [controller for ReplicationController objects](/docs/reference/controllers/replicationcontroller/)
is called “the replication controller”.
This deprecated controller ensures that a specified number of Pod replicas are
running at any one time, based on the spec in a ReplicationController object.

## StatefulSet controller

The [StatefulSet controller](/docs/reference/controllers/statefulset/)
ensures that a {{< glossary_tooltip term_id="StatefulSet" >}} is ready to be
scheduled onto a suitable set of Nodes.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [Pod management controllers](/docs/reference/controllers/pod-management-controllers/)
{{% /capture %}}
