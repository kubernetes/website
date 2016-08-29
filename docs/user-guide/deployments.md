---
assignees:
- bgrant0607
- janetkuo

---

* TOC
{:toc}

## What is a _Deployment_?

A _Deployment_ provides declarative updates for [Pods](/docs/user-guide/pods/) and [Replica Sets](/docs/user-guide/replicasets/) (the next-generation Replication Controller).
You only need to describe the desired state in a Deployment object, and the Deployment
controller will change the actual state to the desired state at a controlled rate for you.
You can define Deployments to create new resources, or replace existing ones
by new ones.

A typical use case is:

* Create a Deployment to bring up a Replica Set and Pods.
* Check the status of a Deployment to see if it succeeds or not. 
* Later, update that Deployment to recreate the Pods (for example, to use a new image).
* Rollback to an earlier Deployment revision if the current Deployment isn't stable. 
* Pause and resume a Deployment.

## Creating a Deployment

Here is an example Deployment. It creates a Replica Set to
bring up 3 nginx Pods.

{% include code.html language="yaml" file="nginx-deployment.yaml" ghlink="/docs/user-guide/nginx-deployment.yaml" %}

Run the example by downloading the example file and then running this command:

```shell
$ kubectl create -f docs/user-guide/nginx-deployment.yaml --record
deployment "nginx-deployment" created
```

Setting the kubectl flag `--record` to `true` allows you to record current command in the annotations of the resources being created or updated. It will be useful for future introspection; for example, to see the commands executed in each Deployment revision.

Then running `get` immediately will give:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         0         0            0           1s
```

This indicates that the Deployment's number of desired replicas is 3 (according to deployment's `.spec.replicas`), the number of current replicas (`.status.replicas`) is 0, the number of up-to-date replicas (`.status.updatedReplicas`) is 0, and the number of available replicas (`.status.availableReplicas`) is also 0. 

Running the `get` again a few seconds later, should give:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           18s
```

This indicates that the Deployment has created all three replicas, and all replicas are up-to-date (contains the latest pod template) and available (pod status is ready for at least Deployment's `.spec.minReadySeconds`). Running `kubectl get rs` and `kubectl get pods` will show the Replica Set (RS) and Pods created.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   AGE
nginx-deployment-2035384211   3         3         18s 
```

You may notice that the name of the Replica Set is always `<the name of the Deployment>-<hash value of the pod template>`. 

```shell
$ kubectl get pods --show-labels
NAME                                READY     STATUS    RESTARTS   AGE       LABELS
nginx-deployment-2035384211-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
nginx-deployment-2035384211-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
nginx-deployment-2035384211-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
```

The created Replica Set will ensure that there are three nginx Pods at all times.

**Note:** You must specify appropriate selector and pod template labels of a Deployment (in this case, `app = nginx`), i.e. don't overlap with other controllers (including Deployments, Replica Sets, Replication Controllers, etc.) Kubernetes won't stop you from doing that, and if you end up with multiple controllers that have overlapping selectors, those controllers will fight with each others and won't behave correctly.

## The Status of a Deployment

After creating or updating a Deployment, you would want to confirm whether it succeeded or not. The simplest way to do this is through `kubectl rollout status`.

```shell
$ kubectl rollout status deployment/nginx-deployment
deployment nginx-deployment successfully rolled out
```

This verifies the Deployment's `.status.observedGeneration` >= `.metadata.generation`, and its up-to-date replicas
(`.status.updatedReplicas`) matches the desired replicas (`.spec.replicas`) to determine if the rollout succeeded. 
If the rollout is still in progress, it watches for Deployment status changes and prints related messages. 

Note that it's impossible to know whether a Deployment will ever succeed, so if the above command doesn't return success, 
you'll need to timeout and give up at some point.

Additionally, if you set `.spec.minReadySeconds`, you would also want to check if the available replicas (`.status.availableReplicas`) matches the desired replicas too.

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           20s
```

## Updating a Deployment

**Note:** a Deployment's rollout is triggered if and only if the Deployment's pod template (i.e. `.spec.template`) is changed, 
e.g. updating labels or container images of the template. Other updates, such as scaling the Deployment, will not trigger a rollout. 

Suppose that we now want to update the nginx Pods to start using the `nginx:1.9.1` image
instead of the `nginx:1.7.9` image.

```shell
$ kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1
deployment "nginx-deployment" image updated
```

Alternatively, we can `edit` the Deployment and change `.spec.template.spec.containers[0].image` from `nginx:1.7.9` to `nginx:1.9.1`:

```shell
$ kubectl edit deployment/nginx-deployment
deployment "nginx-deployment" edited
```

To see its rollout status, simply run:

```shell
$ kubectl rollout status deployment/nginx-deployment
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment nginx-deployment successfully rolled out
```

After the rollout succeeds, you may want to `get` the Deployment:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           36s
```

The number of up-to-date replicas indicates that the Deployment has updated the replicas to the latest configuration. 
The current replicas indicates the total replicas this Deployment manages, and the available replicas indicates the 
number of current replicas that are available. 

We can run `kubectl get rs` to see that the Deployment updated the Pods by creating a new Replica Set and scaling it up to 3 replicas, as well as scaling down the old Replica Set to 0 replicas.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   AGE
nginx-deployment-1564180365   3         3         6s
nginx-deployment-2035384211   0         0         36s
```

Running `get pods` should now show only the new Pods:

```shell
$ kubectl get pods
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1564180365-khku8   1/1       Running   0          14s
nginx-deployment-1564180365-nacti   1/1       Running   0          14s
nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
```

Next time we want to update these Pods, we only need to update the Deployment's pod template again.

Deployment can ensure that only a certain number of Pods may be down while they are being updated. By
default, it ensures that at least 1 less than the desired number of Pods are
up (1 max unavailable).

Deployment can also ensure that only a certain number of Pods may be created above the desired number of Pods. By default, it ensures that at most 1 more than the desired number of Pods are up (1 max surge). 

For example, if you look at the above Deployment closely, you will see that
it first created a new Pod, then deleted some old Pods and created new ones. It
does not kill old Pods until a sufficient number of new Pods have come up, and does not create new Pods until a sufficient number of old Pods have been killed. It makes sure that number of available Pods is at least 2 and the number of total Pods is at most 4.

```shell
$ kubectl describe deployments
Name:           nginx-deployment
Namespace:      default
CreationTimestamp:  Tue, 15 Mar 2016 12:01:06 -0700
Labels:         app=nginx
Selector:       app=nginx
Replicas:       3 updated | 3 total | 3 available | 0 unavailable
StrategyType:       RollingUpdate
MinReadySeconds:    0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
OldReplicaSets:     <none>
NewReplicaSet:      nginx-deployment-1564180365 (3/3 replicas created)
Events:
  FirstSeen LastSeen    Count   From                     SubobjectPath   Type        Reason              Message
  --------- --------    -----   ----                     -------------   --------    ------              -------
  36s       36s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
  23s       23s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
  23s       23s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
  23s       23s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
  21s       21s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
  21s       21s         1       {deployment-controller }                 Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
```

Here we see that when we first created the Deployment, it created a Replica Set (nginx-deployment-2035384211) and scaled it up to 3 replicas directly.
When we updated the Deployment, it created a new Replica Set (nginx-deployment-1564180365) and scaled it up to 1 and then scaled down the old Replica Set to 2, so that at least 2 Pods were available and at most 4 Pods were created at all times.
It then continued scaling up and down the new and the old Replica Set, with the same rolling update strategy. Finally, we'll have 3 available replicas in the new Replica Set, and the old Replica Set is scaled down to 0.

### Multiple Updates

Each time a new deployment object is observed by the deployment controller, a Replica Set is
created to bring up the desired Pods if there is no existing Replica Set doing so.
Existing Replica Set controlling Pods whose labels match `.spec.selector` but whose
template does not match `.spec.template` are scaled down.
Eventually, the new Replica Set will be scaled to `.spec.replicas` and all old Replica Sets will
be scaled to 0.

If you update a Deployment while an existing deployment is in progress,
the Deployment will create a new Replica Set as per the update and start scaling that up, and
will roll the Replica Set that it was scaling up previously -- it will add it to its list of old Replica Sets and will
start scaling it down.

For example, suppose you create a Deployment to create 5 replicas of `nginx:1.7.9`,
but then updates the Deployment to create 5 replicas of `nginx:1.9.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, Deployment will immediately start
killing the 3 `nginx:1.7.9` Pods that it had created, and will start creating
`nginx:1.9.1` Pods. It will not wait for 5 replicas of `nginx:1.7.9` to be created
before changing course.

## Rolling Back a Deployment

Sometimes you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want 
(you can change that by specifying [revision history limit](/docs/user-guide/deployments/#revision-history-limit)). 

**Note:** a Deployment's revision is created when a Deployment's rollout is triggered. This means that the new revision is created 
if and only if the Deployment's pod template (i.e. `.spec.template`) is changed, e.g. updating labels or container images of the template. 
Other updates, such as scaling the Deployment, will not create a Deployment revision -- so that we can facilitate simultaneous manual- or
auto-scaling. This implies that when you rollback to an earlier revision, only the Deployment's pod template part will be rolled back.  

Suppose that we made a typo while updating the Deployment, by putting the image name as `nginx:1.91` instead of `nginx:1.9.1`:

```shell
$ kubectl set image deployment/nginx-deployment nginx=nginx:1.91
deployment "nginx-deployment" image updated
```

The rollout will be stuck.

```
$ kubectl rollout status deployments nginx-deployment 
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
```

Press Ctrl-C to stop the above rollout status watch.

You will also see that both the number of old replicas (nginx-deployment-1564180365 and nginx-deployment-2035384211) and new replicas (nginx-deployment-3066724191) are 2.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   AGE
nginx-deployment-1564180365   2         2         25s
nginx-deployment-2035384211   0         0         36s
nginx-deployment-3066724191   2         2         6s
```

Looking at the Pods created, you will see that the 2 Pods created by new Replica Set are stuck in an image pull loop.

```shell
$ kubectl get pods 
NAME                                READY     STATUS             RESTARTS   AGE
nginx-deployment-1564180365-70iae   1/1       Running            0          25s
nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
nginx-deployment-3066724191-eocby   0/1       ImagePullBackOff   0          6s
```

Note that the Deployment controller will stop the bad rollout automatically, and will stop scaling up the new Replica Set.

```shell
$ kubectl describe deployment
Name:           nginx-deployment
Namespace:      default
CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
Labels:         app=nginx
Selector:       app=nginx
Replicas:       2 updated | 3 total | 2 available | 2 unavailable
StrategyType:       RollingUpdate
MinReadySeconds:    0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
OldReplicaSets:     nginx-deployment-1564180365 (2/2 replicas created)
NewReplicaSet:      nginx-deployment-3066724191 (2/2 replicas created)
Events:
  FirstSeen LastSeen    Count   From                    SubobjectPath   Type        Reason              Message
  --------- --------    -----   ----                    -------------   --------    ------              -------
  1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
  22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
  21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
  21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
  13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-1564180365 to 2
  13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 2
```

To fix this, we need to rollback to a previous revision of Deployment that is stable. 

### Checking Rollout History of a Deployment

First, check the revisions of this deployment:

```shell
$ kubectl rollout history deployment/nginx-deployment
deployments "nginx-deployment":
REVISION    CHANGE-CAUSE
1           kubectl create -f docs/user-guide/nginx-deployment.yaml --record
2           kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1
3           kubectl set image deployment/nginx-deployment nginx=nginx:1.91
```

Because we recorded the command while creating this Deployment using `--record`, we can easily see the changes we made in each revision. 

To further see the details of each revision, run:

```shell
$ kubectl rollout history deployment/nginx-deployment --revision=2
deployments "nginx-deployment" revision 2
  Labels:       app=nginx
          pod-template-hash=1159050644
  Annotations:  kubernetes.io/change-cause=kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1
  Containers:
   nginx:
    Image:      nginx:1.9.1
    Port:       80/TCP
     QoS Tier:
        cpu:      BestEffort
        memory:   BestEffort
    Environment Variables:      <none>
  No volumes.
```

### Rolling Back to a Previous Revision

Now we've decided to undo the current rollout and rollback to the previous revision:

```shell
$ kubectl rollout undo deployment/nginx-deployment
deployment "nginx-deployment" rolled back
```

Alternatively, you can rollback to a specific revision by specify that in `--to-revision`:

```shell
$ kubectl rollout undo deployment/nginx-deployment --to-revision=2
deployment "nginx-deployment" rolled back
```

For more details about rollout related commands, read [`kubectl rollout`](/docs/user-guide/kubectl/kubectl_rollout/). 

The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event for rolling back to revision 2 is generated from Deployment controller. 

```shell
$ kubectl get deployment 
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           30m

$ kubectl describe deployment 
Name:           nginx-deployment
Namespace:      default
CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
Labels:         app=nginx
Selector:       app=nginx
Replicas:       3 updated | 3 total | 3 available | 0 unavailable
StrategyType:       RollingUpdate
MinReadySeconds:    0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
OldReplicaSets:     <none>
NewReplicaSet:      nginx-deployment-1564180365 (3/3 replicas created)
Events:
  FirstSeen LastSeen    Count   From                    SubobjectPath   Type        Reason              Message
  --------- --------    -----   ----                    -------------   --------    ------              -------
  30m       30m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 2
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  29m       29m         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-1564180365 to 2
  2m        2m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-3066724191 to 0
  2m        2m          1       {deployment-controller }                Normal      DeploymentRollback  Rolled back deployment "nginx-deployment" to revision 2
  29m       2m          2       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
```

### Clean up Policy

You can set `.spec.revisionHistoryLimit` field to specify how much revision history of this deployment you want to keep. By default, 
all revision history will be kept; explicitly setting this field to `0` disallows a deployment being rolled back. 

## Pausing and Resuming a Deployment 

You can also pause a Deployment mid-way and then resume it. A use case is to support canary deployment. 

Update the Deployment again and then pause the Deployment with `kubectl rollout pause`:

```shell
$ kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1; kubectl rollout pause deployment/nginx-deployment
deployment "nginx-deployment" image updated
deployment "nginx-deployment" paused
```

Note that any current state of the Deployment will continue its function, but new updates to the Deployment will not have an effect as long as the Deployment is paused. 

The Deployment was still in progress when we paused it, so the actions of scaling up and down Replica Sets are paused too. 

```shell
$ kubectl get rs 
NAME                          DESIRED   CURRENT   AGE
nginx-deployment-1564180365   2         2         1h
nginx-deployment-2035384211   2         2         1h
nginx-deployment-3066724191   0         0         1h
```

In a separate terminal, watch for rollout status changes and you'll see the rollout won't continue:

```shell
$ kubectl rollout status deployment/nginx-deployment 
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
```

To resume the Deployment, simply do `kubectl rollout resume`:

```shell
$ kubectl rollout resume deployment/nginx-deployment
deployment "nginx-deployment" resumed
```

Then the Deployment will continue and finish the rollout:

```shell
$ kubectl rollout status deployment/nginx-deployment 
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment spec update to be observed...
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment nginx-deployment successfully rolled out
```

```shell
$ kubectl get rs 
NAME                          DESIRED   CURRENT   AGE
nginx-deployment-1564180365   3         3         1h
nginx-deployment-2035384211   0         0         1h
nginx-deployment-3066724191   0         0         1h
```

Note: A paused Deployment cannot be scaled at this moment, and we will add this feature in 1.3 release, see [issue #20853](https://github.com/kubernetes/kubernetes/issues/20853). You cannot rollback a paused Deployment either, and you should resume a Deployment first before doing a rollback. 

## Use Cases 

### Canary Deployment

If you want to roll out releases to a subset of users or servers using the Deployment, you can create multiple Deployments, one for each release,
following the canary pattern described in [managing resources](/docs/user-guide/managing-deployments/#canary-deployments). 

## Writing a Deployment Spec

As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, and
`metadata` fields.  For general information about working with config files,
see [deploying applications](/docs/user-guide/deploying-applications), [configuring containers](/docs/user-guide/configuring-containers), and [using kubectl to manage resources](/docs/user-guide/working-with-resources) documents.

A Deployment also needs a [`.spec` section](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#spec-and-status).

### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/user-guide/replication-controller/#pod-template).  It has exactly
the same schema as a [Pod](/docs/user-guide/pods), except it is nested and does not have an
`apiVersion` or `kind`.

In addition to required fields for a Pod, a pod template in a Deployment must specify appropriate
labels (i.e. don't overlap with other controllers, see [selector](#selector)) and an appropriate restart policy.

Only a [`.spec.template.spec.restartPolicy`](/docs/user-guide/pod-states/) equal to `Always` is allowed, which is the default
if not specified.

### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults
to 1.

### Selector

`.spec.selector` is an optional field that specifies a [label selector](/docs/user-guide/labels/#label-selectors) for the Pods
targeted by this deployment. 

If specified, `.spec.selector` must match `.spec.template.metadata.labels`, or it will
be rejected by the API.  If `.spec.selector` is unspecified, `.spec.selector.matchLabels` will be defaulted to
`.spec.template.metadata.labels`.

Deployment may kill Pods whose labels match the selector, in the case that their
template is different than `.spec.template` or if the total number of such Pods
exceeds `.spec.replicas`. It will bring up new Pods with `.spec.template` if
number of Pods are less than the desired number.

Note that you should not create other pods whose labels match this selector, either directly, via another Deployment or via another controller such as Replica Sets or Replication Controllers. Otherwise, the Deployment will think that those pods were created by it. Kubernetes will not stop you from doing this.

If you have multiple controllers that have overlapping selectors, the controllers will fight with each others and won't behave correctly.

### Strategy

`.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.

#### Recreate Deployment

All existing Pods are killed before new ones are created when
`.spec.strategy.type==Recreate`.

#### Rolling Update Deployment

The Deployment updates Pods in a [rolling update](/docs/user-guide/update-demo/) fashion
when `.spec.strategy.type==RollingUpdate`.
You can specify `maxUnavailable` and `maxSurge` to control
the rolling update process.

##### Max Unavailable

`.spec.strategy.rollingUpdate.maxUnavailable` is an optional field that specifies the
maximum number of Pods that can be unavailable during the update process.
The value can be an absolute number (e.g. 5) or a percentage of desired Pods
(e.g. 10%).
The absolute number is calculated from percentage by rounding up.
This can not be 0 if `.spec.strategy.rollingUpdate.maxSurge` is 0.
By default, a fixed value of 1 is used.

For example, when this value is set to 30%, the old Replica Set can be scaled down to
70% of desired Pods immediately when the rolling update starts. Once new Pods are
ready, old Replica Set can be scaled down further, followed by scaling up the new Replica Set,
ensuring that the total number of Pods available at all times during the
update is at least 70% of the desired Pods.

##### Max Surge

`.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the
maximum number of Pods that can be created above the desired number of Pods.
Value can be an absolute number (e.g. 5) or a percentage of desired Pods
(e.g. 10%).
This can not be 0 if `MaxUnavailable` is 0.
The absolute number is calculated from percentage by rounding up.
By default, a value of 1 is used.

For example, when this value is set to 30%, the new Replica Set can be scaled up immediately when
the rolling update starts, such that the total number of old and new Pods do not exceed
130% of desired Pods. Once old Pods have been killed,
the new Replica Set can be scaled up further, ensuring that the total number of Pods running
at any time during the update is at most 130% of desired Pods.

### Min Ready Seconds

`.spec.minReadySeconds` is an optional field that specifies the
minimum number of seconds for which a newly created Pod should be ready
without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready).
To learn more about when a Pod is considered ready, see [Container Probes](/docs/user-guide/pod-states/#container-probes).

### Rollback To 

`.spec.rollbackTo` is an optional field with the configuration the Deployment is rolling back to. Setting this field will trigger a rollback, and this field will be cleared every time a rollback is done. 

#### Revision

`.spec.rollbackTo.revision` is an optional field specifying the revision to rollback to. This defaults to 0, meaning rollback to the last revision in history. 

### Revision History Limit

A deployment's revision history is stored in the replica sets it controls. 

`.spec.revisionHistoryLimit` is an optional field that specifies the number of old Replica Sets to retain to allow rollback. Its ideal value depends on the frequency and stability of new deployments. All old Replica Sets will be kept by default, consuming resources in `etcd` and crowding the output of `kubectl get rs`, if this field is not set. The configuration of each Deployment revision is stored in its Replica Sets; therefore, once an old Replica Set is deleted, you lose the ability to rollback to that revision of Deployment. 

More specifically, setting this field to zero means that all old replica sets with 0 replica will be cleaned up. 
In this case, a new deployment rollout cannot be undone, since its revision history is cleaned up.

### Paused

`.spec.paused` is an optional boolean field for pausing and resuming a Deployment. It defaults to false (a Deployment is not paused). 

## Alternative to Deployments

### kubectl rolling update

[Kubectl rolling update](/docs/user-guide/kubectl/kubectl_rolling-update) updates Pods and Replication Controllers in a similar fashion.
But Deployments are recommended, since they are declarative, server side, and have additional features, such as rolling back to any previous revision even after the rolling update is done.
