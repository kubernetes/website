---
title: Deployment controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="deployment" >}} controller
enables declarative updates for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/replicaset/).

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
When you update a Deployment's pod template, this triggers an update:
the Deployment controller observes the change and adds another revision.

When you change the pod template in a Deployment, the Deployment controller
identifies that this is a new revision of the Deployment. The controller
tracks the configuration it had for the previous revision and runs a rollout
process: it creates a new ReplicaSet based on the updated template, and
switches over to using the new ReplicaSet.

With the default `RollingUpdate` strategy, the Deployment controller
gradually scales up the new replica set and scaled down existing ReplicaSets.
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

The Deployment controller tracks revisions to the Deployment object. By default
the controller tracks all the history. You can set a revision history limit
(`.spec.revisionHistoryLimit`) if you only want to preserve a certain number
of revisions.

{{< note >}}
If you set the revision history limit to 0, the Deployment controller will
remove all revision history and you will lose the ability to roll back that
Deployment.
{{< /note >}}


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

You can monitor the progress for a Deployment by using `kubectl rollout status`.

### Proportional scaling

RollingUpdate Deployments support running multiple versions of an
application at the same time. When you or an autoscaler scales a
RollingUpdate Deployment that is in the middle of a rollout (either in
progress or [paused](#paused)), then the Deployment controller will balance the
additional replicas in the existing active ReplicaSets (ReplicaSets with
Pods) in order to mitigate risk. This is called *proportional scaling*.

For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, and [maxUnavailable](#max-unavailable)=2.

```shell
kubectl get deploy
```
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     10        10        10           10          50s
```

You update to a new image which happens to be unresolvable from inside the cluster.

```shell
kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
```
```
deployment.apps/nginx-deployment image updated
```

The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
`maxUnavailable` requirement that you mentioned above.

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   5         5         0         9s
nginx-deployment-618515232    8         8         8         1m
```

Then a new scaling request for the Deployment comes along. The autoscaler increments the Deployment replicas
to 15. The Deployment controller needs to decide where to add these new 5 replicas. If you weren't using
proportional scaling, all 5 of them would be added in the new ReplicaSet. With proportional scaling, you
spread the additional replicas across all ReplicaSets. Bigger proportions go to the ReplicaSets with the
most replicas and lower proportions go to ReplicaSets with less replicas. Any leftovers are added to the
ReplicaSet with the most replicas. ReplicaSets with zero replicas are not scaled up.

In our example above, 3 replicas will be added to the old ReplicaSet and 2 replicas will be added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy.

```shell
kubectl get deploy
```
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

```shell
kubectl get rs
```
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

### Tracking Deployment failure

The Deployment controller keeps track of whether its newest ReplicaSet is
deploying OK. If you set `.spec.progressDeadlineSeconds` for a Deployment,
and the ReplicaSet does not come up OK within that interval, the Deployment
controller adds a Condition to the Deployment, with
condition `Type=Progressing, Status=False` and
`Reason=ProgressDeadlineExceeded`.

### Pausing and Resuming a Deployment {#paused}

You can pause a Deployment before triggering one or more updates and then resume it. This will allow you to
apply multiple fixes in between pausing and resuming without triggering unnecessary rollouts.

When you set `spec.paused` for a Deployment, the controller adds a condition
with `Reason=DeploymentPaused`. Seeing this condition, the Deployment controller
suspends progress checking.

You can set `spec.paused` to false (the default), resuming it if it was paused.

{{< note >}}
You cannot rollback a paused Deployment until you resume it.
{{< /note >}}

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [Deployments](/docs/concepts/workloads/deployment/)
* Read about [ReplicaSets](/docs/concepts/workloads/replicaset/)
* Read about the [ReplicaSet controller](/docs/reference/controllers/replicaset/)
{{% /capture %}}
