---
title: Deployment controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="deployment" >}} controller
enables declarative updates for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).

You describe a _desired state_ in a Deployment object, and the Deployment
controller changes the actual state to the desired state at a controlled
rate. You can define Deployments to create new ReplicaSets, or to remove
existing Deployments and adopt all their resources with new Deployments.

{{% /capture %}}

{{% capture body %}}

The deployment controller is built in to kube-controller-manager.

## Controller behavior

The Deployment controller creates and manages a ReplicaSet that in turn,
via the ReplicaSet controller, manages a set of Pods to run a containerized
application.
Each time the Deployment controller observes a new Deployment object,
it creates a new ReplicaSet to bring up the desired Pods (unless there is
already a ReplicaSet doing just that).

The Deployment controller gives each ReplicaSet a name that it derives from
the name of the Pod in the Deployment's replicaset template. The Deployment
controller also sets a label on the Pods (via the ReplicaSet's pod template)
based on a hash of the pod template.

The Deployment controller adds this `pod-template-hash` label to every
ReplicaSet that it is managing.

To enable declarative updates, the Deployment controller tracks a
`deployment.kubernetes.io/revision-history` annotation on each Deployment object.
When you update a Deployment's pod template, this triggers an update
(see [Revision history](#revision-history)).

With the default `RollingUpdate` strategy, the Deployment controller
gradually scales up the new replica set and scales down existing ReplicaSets.
You can also use the `Recreate` update strategy; in this case, the Deployment
controller removes the existing ReplicaSet outright and adds a new one.

If you undo a rollout (eg with `kubectl`, the Deployment controller spots
that `deployment.kubernetes.io/revision` has changed and switches to running
with the relevant entry in its revision history.
(Assuming that the switch has updated the pod template), the Deployment controller
creates a new ReplicaSet based on the revision you're rolling back to, and gradually
migrates the load onto Pods from the new ReplicaSet.

By default, a Deployment controller makes sure that at most 25% of Pods are
unavailable during a rollout. The controller also limits the total number of
Pods during a rollout; by default, the limit is 125% of the Deployment's
desired replica count.

If you update a Deployment while an existing rollout is
[in progress](#tracking-progress), the Deployment controller will create a new
ReplicaSet as per the update and start scaling that up. The ReplicaSet
connected to the previous rollout, the one that was in progress just
now, will get scaled down. This is because the Deployment controller
will recognise the old ReplicaSet as superseded.

If a rollout creates only bad (failing) Pods, the Deployment controller detects
this and aborts the rollout. It will stop scaling up the new ReplicaSet but will
*not* automatically fix a misconfigured pod template.

### Revision history

The Deployment controller tracks revisions to the Deployment object, up to
a configurable number of history revisions. The default is 0, ie to retain
all history.
When a Deployment's spec changes, the controller records a new history entry
and removes any existing history entries beyond the tracking limit.

### Tracking progress

The deployment controller marks a Deployment as _progressing_ when one of the following tasks is performed:

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
{{% /capture %}}
