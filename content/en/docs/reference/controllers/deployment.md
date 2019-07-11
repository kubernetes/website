---
toc_hide: true
title: Deployment controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="deployment" >}}
{{< glossary_tooltip term_id="controller" text="controller" >}}
enables declarative definitions for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) to run an application
using stateless containers.

You describe a _desired state_ in the spec of a Deployment object, and this
controller drives actual state towards the desired state at a
constrained rate. You can define Deployments to create new ReplicaSets, or to
remove existing ReplicaSets and adopt all their resources with new ReplicaSets.

{{% /capture %}}

{{% capture body %}}

The Deployment controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

The Deployment controller creates and manages a
{{< glossary_tooltip term_id="replica-set" >}} that in turn,
via the [ReplicaSet controller](/docs/reference/controllers/replicaset/),
manages a set of Pods to run a containerized application.
Each time the Deployment controller observes a new Deployment object,
it creates a new ReplicaSet to bring up the desired Pods, unless there is
already a ReplicaSet doing just that.

The Deployment controller gives each ReplicaSet a name that it derives from
the name of the Pod in the Deployment's replicaset template. The Deployment
controller creates the ReplicaSet's Pod spec with a
{{< glossary_tooltip term_id="label" >}}
for those Pods, based on a hash of the pod template part of the Deployment spec.

The Deployment controller adds this `pod-template-hash` label to every
ReplicaSet that it is managing.

When you update a Deployment's Pod template, this triggers an update.
The Deployment controller tracks revisions to the Deployment object,
up to a configurable number of history revisions.

The Deployment controller creates a new ReplicaSet and switches to it
(see [Deployment](/docs/concepts/workloads/deployment/): either gradually
or all-at-once.

### Tracking progress

The Deployment controller marks a Deployment as _progressing_ based
on [defined criteria](

* The Deployment creates a new ReplicaSet.
* The Deployment is scaling up its newest ReplicaSet.
* The Deployment is scaling down its older ReplicaSet(s).
* New Pods, relevant to the Deployment but not previously known to the controller, become ready or available (ready for at least [MinReadySeconds](#min-ready-seconds)).

The deployment controller marks a Deployment as _complete_ when it has the following characteristics:

* All of the replicas associated with the Deployment have been updated to the latest version you've specified, meaning any
updates you've requested have been completed.
* All of the replicas associated with the Deployment are available.
* No old replicas for the Deployment are running.

When processing a Deployment with `spec.paused` set, the controller adds a condition
with `Reason=DeploymentPaused`. The Deployment controller skips progress
checking for Deployments with that condition set.

### Tracking failure(s) {#tracking-failure}

If a rollout creates only bad (failing) Pods, the Deployment controller detects
this and aborts the rollout: it ceases scaling up the new ReplicaSet.

The Deployment controller keeps track of whether its newest ReplicaSet is
deploying OK. If you set `.spec.progressDeadlineSeconds` for a Deployment,
and the ReplicaSet does not come up OK within that interval, the Deployment
controller adds a Condition to the Deployment, with
condition `Type=Progressing, Status=False` and
`Reason=ProgressDeadlineExceeded`.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [Deployments](/docs/concepts/workloads/controllers/deployment/)
* Read about [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/)
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)
{{% /capture %}}
