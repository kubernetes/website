---
approvers:
- janetkuo
title: Deployments
content_template: templates/concept
---

{{% capture overview %}}

A _Deployment_ controller provides declarative updates for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).

You describe a _desired state_ in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.

{{< note >}}
You should not manage ReplicaSets owned by a Deployment. All the use cases should be covered by manipulating the Deployment object. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.
{{< /note >}}

{{% /capture %}}


{{% capture body %}}

## Use Case

The following are typical use cases for Deployments:

* [Create a Deployment to rollout a ReplicaSet](#creating-a-deployment). The ReplicaSet creates Pods in the background. Check the status of the rollout to see if it succeeds or not.
* [Declare the new state of the Pods](#updating-a-deployment) by updating the PodTemplateSpec of the Deployment. A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate. Each new ReplicaSet updates the revision of the Deployment.
* [Rollback to an earlier Deployment revision](#rolling-back-a-deployment) if the current state of the Deployment is not stable. Each rollback updates the revision of the Deployment.
* [Scale up the Deployment to facilitate more load.](#scaling-a-deployment)
* [Pause the Deployment](#pausing-and-resuming-a-deployment) to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
* [Use the status of the Deployment](#deployment-status) as an indicator that a rollout has stuck
* [Clean up older ReplicaSets](#clean-up-policy) that you don't need anymore


## Creating a Deployment

Here is an example Deployment. It creates a ReplicaSet to bring up three nginx Pods.

{{< code file="nginx-deployment.yaml" >}}

Run the example by downloading the example file and then running this command:

```shell
$ kubectl create -f docs/user-guide/nginx-deployment.yaml --record
deployment "nginx-deployment" created
```

Setting the kubectl flag `--record` to `true` allows you to record current command in the annotations of
the resources being created or updated. It is useful for future introspection: for example, to see the
commands executed in each Deployment revision.

Then running `get` immediately will give:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         0         0            0           1s
```

This indicates that the Deployment's number of desired replicas is 3 (according to deployment's `.spec.replicas`),
the number of current replicas (`.status.replicas`) is 0, the number of up-to-date replicas (`.status.updatedReplicas`)
is 0, and the number of available replicas (`.status.availableReplicas`) is also 0.

To see the Deployment rollout status, run:

```shell
$ kubectl rollout status deployment/nginx-deployment
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment "nginx-deployment" successfully rolled out
```

Running the `get` again a few seconds later should give:

```shell
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           18s
```

This indicates that the Deployment has created all three replicas, and all replicas are up-to-date (contains the
latest pod template) and available (pod status is ready for at least Deployment's `.spec.minReadySeconds`). Running
`kubectl get rs` and `kubectl get pods` will show the ReplicaSet (RS) and Pods created.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-2035384211   3         3         3       18s
```

You may notice that the name of the ReplicaSet is always `<the name of the Deployment>-<hash value of the pod template>`.

```shell
$ kubectl get pods --show-labels
NAME                                READY     STATUS    RESTARTS   AGE       LABELS
nginx-deployment-2035384211-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
nginx-deployment-2035384211-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
nginx-deployment-2035384211-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=2035384211
```

The created ReplicaSet ensures that there are three nginx Pods at all times.

{{< note >}}
You must specify an appropriate selector and pod template labels in a Deployment (in this case,
`app = nginx`). That is, don't overlap with other controllers (including other Deployments, ReplicaSets,
StatefulSets, etc.). Kubernetes doesn't stop you from overlapping, and if multiple
controllers have overlapping selectors, those controllers may fight with each other and won't behave
correctly.
{{< /note >}}

### Pod-template-hash label

{{< note >}}
Do not change this label.
{{< /note >}}

Note the pod-template-hash label in the example output in the pod labels above. This label is added by the
Deployment controller to every ReplicaSet that a Deployment creates or adopts. Its purpose is to make sure that child
ReplicaSets of a Deployment do not overlap. It is computed by hashing the PodTemplate of the ReplicaSet
and using the resulting hash as the label value that will be added in the ReplicaSet selector, pod template labels,
and in any existing Pods that the ReplicaSet may have.

## Updating a Deployment

{{< note >}}
A Deployment's rollout is triggered if and only if the Deployment's pod template (that is, `.spec.template`)
is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.
{{< /note >}}

Suppose that we now want to update the nginx Pods to use the `nginx:1.9.1` image
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

To see the rollout status, run:

```shell
$ kubectl rollout status deployment/nginx-deployment
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment "nginx-deployment" successfully rolled out
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

We can run `kubectl get rs` to see that the Deployment updated the Pods by creating a new ReplicaSet and scaling it
up to 3 replicas, as well as scaling down the old ReplicaSet to 0 replicas.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-1564180365   3         3         3       6s
nginx-deployment-2035384211   0         0         0       36s
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
default, it ensures that at least 1 less than the desired number of Pods are up (1 max unavailable).

Deployment can also ensure that only a certain number of Pods may be created above the desired number of
Pods. By default, it ensures that at most 1 more than the desired number of Pods are up (1 max surge).

In a future version of Kubernetes, the defaults will change from 1-1 to 25%-25%.

For example, if you look at the above Deployment closely, you will see that it first created a new Pod,
then deleted some old Pods and created new ones. It does not kill old Pods until a sufficient number of
new Pods have come up, and does not create new Pods until a sufficient number of old Pods have been killed.
It makes sure that the number of available Pods is at least 2 and the number of total Pods is at most 4.

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

Here we see that when we first created the Deployment, it created a ReplicaSet (nginx-deployment-2035384211)
and scaled it up to 3 replicas directly. When we updated the Deployment, it created a new ReplicaSet
(nginx-deployment-1564180365) and scaled it up to 1 and then scaled down the old ReplicaSet to 2, so that at
least 2 Pods were available and at most 4 Pods were created at all times. It then continued scaling up and down
the new and the old ReplicaSet, with the same rolling update strategy. Finally, we'll have 3 available replicas
in the new ReplicaSet, and the old ReplicaSet is scaled down to 0.

### Rollover (aka multiple updates in-flight)

Each time a new deployment object is observed by the deployment controller, a ReplicaSet is created to bring up
the desired Pods if there is no existing ReplicaSet doing so. Existing ReplicaSet controlling Pods whose labels
match `.spec.selector` but whose template does not match `.spec.template` are scaled down. Eventually, the new
ReplicaSet will be scaled to `.spec.replicas` and all old ReplicaSets will be scaled to 0.

If you update a Deployment while an existing rollout is in progress, the Deployment will create a new ReplicaSet
as per the update and start scaling that up, and will roll over the ReplicaSet that it was scaling up previously
 -- it will add it to its list of old ReplicaSets and will start scaling it down.

For example, suppose you create a Deployment to create 5 replicas of `nginx:1.7.9`,
but then updates the Deployment to create 5 replicas of `nginx:1.9.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, Deployment will immediately start
killing the 3 `nginx:1.7.9` Pods that it had created, and will start creating
`nginx:1.9.1` Pods. It will not wait for 5 replicas of `nginx:1.7.9` to be created
before changing course.

### Label selector updates

It is generally discouraged to make label selector updates and it is suggested to plan your selectors up front.
In any case, if you need to perform a label selector update, exercise great caution and make sure you have grasped
all of the implications.

* Selector additions require the pod template labels in the Deployment spec to be updated with the new label too,
otherwise a validation error is returned. This change is a non-overlapping one, meaning that the new selector does
not select ReplicaSets and Pods created with the old selector, resulting in orphaning all old ReplicaSets and
creating a new ReplicaSet.
* Selector updates -- that is, changing the existing value in a selector key -- result in the same behavior as additions.
* Selector removals -- that is, removing an existing key from the Deployment selector -- do not require any changes in the
pod template labels. No existing ReplicaSet is orphaned, and a new ReplicaSet is not created, but note that the
removed label still exists in any existing Pods and ReplicaSets.

## Rolling Back a Deployment

Sometimes you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want
(you can change that by modifying revision history limit).

{{< note >}}
A Deployment's revision is created when a Deployment's rollout is triggered. This means that the
new revision is created if and only if the Deployment's pod template (`.spec.template`) is changed,
for example if you update the labels or container images of the template. Other updates, such as scaling the Deployment,
do not create a Deployment revision, so that we can facilitate simultaneous manual- or auto-scaling.
This means that when you roll back to an earlier revision, only the Deployment's pod template part is
rolled back.
{{< /note >}}

Suppose that we made a typo while updating the Deployment, by putting the image name as `nginx:1.91` instead of `nginx:1.9.1`:

```shell
$ kubectl set image deployment/nginx-deployment nginx=nginx:1.91
deployment "nginx-deployment" image updated
```

The rollout will be stuck.

```shell
$ kubectl rollout status deployments nginx-deployment
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
```

Press Ctrl-C to stop the above rollout status watch. For more information on stuck rollouts,
[read more here](#deployment-status).

You will also see that both the number of old replicas (nginx-deployment-1564180365 and
nginx-deployment-2035384211) and new replicas (nginx-deployment-3066724191) are 2.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-1564180365   2         2         0       25s
nginx-deployment-2035384211   0         0         0       36s
nginx-deployment-3066724191   2         2         2       6s
```

Looking at the Pods created, you will see that the 2 Pods created by new ReplicaSet are stuck in an image pull loop.

```shell
$ kubectl get pods
NAME                                READY     STATUS             RESTARTS   AGE
nginx-deployment-1564180365-70iae   1/1       Running            0          25s
nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
nginx-deployment-3066724191-eocby   0/1       ImagePullBackOff   0          6s
```

{{< note >}}
The Deployment controller will stop the bad rollout automatically, and will stop scaling up the new
ReplicaSet. This depends on the rollingUpdate parameters (`maxUnavailable` specifically) that you have specified.
Kubernetes by default sets the value to 1 and spec.replicas to 1 so if you haven't cared about setting those
parameters, your Deployment can have 100% unavailability by default! This will be fixed in Kubernetes in a future
version.
{{< /note >}}

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
deployments "nginx-deployment"
REVISION    CHANGE-CAUSE
1           kubectl create -f docs/user-guide/nginx-deployment.yaml --record
2           kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1
3           kubectl set image deployment/nginx-deployment nginx=nginx:1.91
```

Because we recorded the command while creating this Deployment using `--record`, we can easily see
the changes we made in each revision.

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

Alternatively, you can rollback to a specific revision by specifying it with `--to-revision`:

```shell
$ kubectl rollout undo deployment/nginx-deployment --to-revision=2
deployment "nginx-deployment" rolled back
```

For more details about rollout related commands, read [`kubectl rollout`](/docs/user-guide/kubectl/{{< param "version" >}}/#rollout).

The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event
for rolling back to revision 2 is generated from Deployment controller.

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

## Scaling a Deployment

You can scale a Deployment by using the following command:

```shell
$ kubectl scale deployment nginx-deployment --replicas=10
deployment "nginx-deployment" scaled
```

Assuming [horizontal pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) is enabled
in your cluster, you can setup an autoscaler for your Deployment and choose the minimum and maximum number of
Pods you want to run based on the CPU utilization of your existing Pods.

```shell
$ kubectl autoscale deployment nginx-deployment --min=10 --max=15 --cpu-percent=80
deployment "nginx-deployment" autoscaled
```

### Proportional scaling

RollingUpdate Deployments support running multiple versions of an application at the same time. When you
or an autoscaler scales a RollingUpdate Deployment that is in the middle of a rollout (either in progress
or paused), then the Deployment controller will balance the additional replicas in the existing active
ReplicaSets (ReplicaSets with Pods) in order to mitigate risk. This is called *proportional scaling*.

For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, and [maxUnavailable](#max-unavailable)=2.

```shell
$ kubectl get deploy
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     10        10        10           10          50s
```

You update to a new image which happens to be unresolvable from inside the cluster.

```shell
$ kubectl set image deploy/nginx-deployment nginx=nginx:sometag
deployment "nginx-deployment" image updated
```

The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
maxUnavailable requirement that we mentioned above.

```shell
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   5         5         0         9s
nginx-deployment-618515232    8         8         8         1m
```

Then a new scaling request for the Deployment comes along. The autoscaler increments the Deployment replicas
to 15. The Deployment controller needs to decide where to add these new 5 replicas. If we weren't using
proportional scaling, all 5 of them would be added in the new ReplicaSet. With proportional scaling, we
spread the additional replicas across all ReplicaSets. Bigger proportions go to the ReplicaSets with the
most replicas and lower proportions go to ReplicaSets with less replicas. Any leftovers are added to the
ReplicaSet with the most replicas. ReplicaSets with zero replicas are not scaled up.

In our example above, 3 replicas will be added to the old ReplicaSet and 2 replicas will be added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy.

```shell
$ kubectl get deploy
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Pausing and Resuming a Deployment

You can pause a Deployment before triggering one or more updates and then resume it. This will allow you to
apply multiple fixes in between pausing and resuming without triggering unnecessary rollouts.

For example, with a Deployment that was just created:

```shell
$ kubectl get deploy
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx     3         3         3            3           1m
$ kubectl get rs
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   3         3         3         1m
```

Pause by running the following command:

```shell
$ kubectl rollout pause deployment/nginx-deployment
deployment "nginx-deployment" paused
```

Then update the image of the Deployment:

```shell
$ kubectl set image deploy/nginx-deployment nginx=nginx:1.9.1
deployment "nginx-deployment" image updated
```

Notice that no new rollout started:

```shell
$ kubectl rollout history deploy/nginx-deployment
deployments "nginx"
REVISION  CHANGE-CAUSE
1   <none>

$ kubectl get rs
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   3         3         3         2m
```

You can make as many updates as you wish, for example, update the resources that will be used:

```shell
$ kubectl set resources deployment nginx -c=nginx --limits=cpu=200m,memory=512Mi
deployment "nginx" resource requirements updated
```

The initial state of the Deployment prior to pausing it will continue its function, but new updates to
the Deployment will not have any effect as long as the Deployment is paused.

Eventually, resume the Deployment and observe a new ReplicaSet coming up with all the new updates:

```shell
$ kubectl rollout resume deploy/nginx-deployment
deployment "nginx" resumed
$ kubectl get rs -w
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   2         2         2         2m
nginx-3926361531   2         2         0         6s
nginx-3926361531   2         2         1         18s
nginx-2142116321   1         2         2         2m
nginx-2142116321   1         2         2         2m
nginx-3926361531   3         2         1         18s
nginx-3926361531   3         2         1         18s
nginx-2142116321   1         1         1         2m
nginx-3926361531   3         3         1         18s
nginx-3926361531   3         3         2         19s
nginx-2142116321   0         1         1         2m
nginx-2142116321   0         1         1         2m
nginx-2142116321   0         0         0         2m
nginx-3926361531   3         3         3         20s
^C
$ kubectl get rs
NAME               DESIRED   CURRENT   READY     AGE
nginx-2142116321   0         0         0         2m
nginx-3926361531   3         3         3         28s
```

{{< note >}}
You cannot rollback a paused Deployment until you resume it.
{{< /note >}}

## Deployment status

A Deployment enters various states during its lifecycle. It can be [progressing](#progressing-deployment) while
rolling out a new ReplicaSet, it can be [complete](#complete-deployment), or it can [fail to progress](#failed-deployment).

### Progressing Deployment

Kubernetes marks a Deployment as _progressing_ when one of the following tasks is performed:

* The Deployment creates a new ReplicaSet.
* The Deployment is scaling up its newest ReplicaSet.
* The Deployment is scaling down its older ReplicaSet(s).
* New Pods become ready or available (ready for at least [MinReadySeconds](#min-ready-seconds)).

You can monitor the progress for a Deployment by using `kubectl rollout status`.

### Complete Deployment

Kubernetes marks a Deployment as _complete_ when it has the following characteristics:

* All of the replicas associated with the Deployment have been updated to the latest version you've specified, meaning any
updates you've requested have been completed.
* All of the replicas associated with the Deployment are available.
* No old replicas for the Deployment are running.

You can check if a Deployment has completed by using `kubectl rollout status`. If the rollout completed
successfully, `kubectl rollout status` returns a zero exit code.

```shell
$ kubectl rollout status deploy/nginx-deployment
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx" successfully rolled out
$ echo $?
0
```

### Failed Deployment

Your Deployment may get stuck trying to deploy its newest ReplicaSet without ever completing. This can occur
due to some of the following factors:

* Insufficient quota
* Readiness probe failures
* Image pull errors
* Insufficient permissions
* Limit ranges
* Application runtime misconfiguration

One way you can detect this condition is to specify a deadline parameter in your Deployment spec:
([`spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `spec.progressDeadlineSeconds` denotes the
number of seconds the Deployment controller waits before indicating (in the Deployment status) that the
Deployment progress has stalled.

The following `kubectl` command sets the spec with `progressDeadlineSeconds` to make the controller report
lack of progress for a Deployment after 10 minutes:

```shell
$ kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
"nginx-deployment" patched
```
Once the deadline has been exceeded, the Deployment controller adds a DeploymentCondition with the following
attributes to the Deployment's `status.conditions`:

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

See the [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) for more information on status conditions.

{{< note >}}
Kubernetes will take no action on a stalled Deployment other than to report a status condition with
`Reason=ProgressDeadlineExceeded`. Higher level orchestrators can take advantage of it and act accordingly, for
example, rollback the Deployment to its previous version.
{{< /note >}}

{{< note >}}
If you pause a Deployment, Kubernetes does not check progress against your specified deadline. You can
safely pause a Deployment in the middle of a rollout and resume without triggering the condition for exceeding the
deadline.
{{< /note >}}

You may experience transient errors with your Deployments, either due to a low timeout that you have set or
due to any other kind of error that can be treated as transient. For example, let's suppose you have
insufficient quota. If you describe the Deployment you will notice the following section:

```shell
$ kubectl describe deployment nginx-deployment
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

If you run `kubectl get deployment nginx-deployment -o yaml`, the Deployment status might look like this:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

Eventually, once the Deployment progress deadline is exceeded, Kubernetes updates the status and the
reason for the Progressing condition:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

You can address an issue of insufficient quota by scaling down your Deployment, by scaling down other
controllers you may be running, or by increasing quota in your namespace. If you satisfy the quota
conditions and the Deployment controller then completes the Deployment rollout, you'll see the
Deployment's status update with a successful condition (`Status=True` and `Reason=NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Type=Available` with `Status=True` means that your Deployment has minimum availability. Minimum availability is dictated
by the parameters specified in the deployment strategy. `Type=Progressing` with `Status=True` means that your Deployment
is either in the middle of a rollout and it is progressing or that it has successfully completed its progress and the minimum
required new replicas are available (see the Reason of the condition for the particulars - in our case
`Reason=NewReplicaSetAvailable` means that the Deployment is complete).

You can check if a Deployment has failed to progress by using `kubectl rollout status`. `kubectl rollout status`
returns a non-zero exit code if the Deployment has exceeded the progression deadline.

```shell
$ kubectl rollout status deploy/nginx-deployment
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
$ echo $?
1
```

### Operating on a failed deployment

All actions that apply to a complete Deployment also apply to a failed Deployment. You can scale it up/down, roll back
to a previous revision, or even pause it if you need to apply multiple tweaks in the Deployment pod template.

## Clean up Policy

You can set `.spec.revisionHistoryLimit` field in a Deployment to specify how many old ReplicaSets for
this Deployment you want to retain. The rest will be garbage-collected in the background. By default,
all revision history will be kept. In a future version, it will default to switch to 2.

{{< note >}}
Explicitly setting this field to 0, will result in cleaning up all the history of your Deployment
thus that Deployment will not be able to roll back.
{{< /note >}}

## Use Cases

### Canary Deployment

If you want to roll out releases to a subset of users or servers using the Deployment, you
can create multiple Deployments, one for each release, following the canary pattern described in
[managing resources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).

## Writing a Deployment Spec

As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, and `metadata` fields.
For general information about working with config files, see [deploying applications](/docs/tutorials/stateless-application/run-stateless-application-deployment/),
configuring containers, and [using kubectl to manage resources](/docs/tutorials/object-management-kubectl/object-management/) documents.

A Deployment also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested and does not have an
`apiVersion` or `kind`.

In addition to required fields for a Pod, a pod template in a Deployment must specify appropriate
labels and an appropriate restart policy. For labels, make sure not to overlap with other controllers. See [selector](#selector)).

Only a [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Always` is
allowed, which is the default if not specified.

### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.

### Selector

`.spec.selector` is an optional field that specifies a [label selector](/docs/concepts/overview/working-with-objects/labels/)
for the Pods targeted by this deployment.

If specified, `.spec.selector` must match `.spec.template.metadata.labels`, or it will be rejected by
the API.  If `.spec.selector` is unspecified, `.spec.selector.matchLabels` defaults to
`.spec.template.metadata.labels`.

A Deployment may terminate Pods whose labels match the selector if their template is different
from `.spec.template` or if the total number of such Pods exceeds `.spec.replicas`. It brings up new
Pods with `.spec.template` if the number of Pods is less than the desired number.

{{< note >}}
You should not create other pods whose labels match this selector, either directly, by creating
another Deployment, or by creating another controller such as a ReplicaSet or a ReplicationController. If you
do so, the first Deployment thinks that it created these other pods. Kubernetes does not stop you from doing this.
{{< /note >}}

If you have multiple controllers that have overlapping selectors, the controllers will fight with each
other and won't behave correctly.

### Strategy

`.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.

#### Recreate Deployment

All existing Pods are killed before new ones are created when `.spec.strategy.type==Recreate`.

#### Rolling Update Deployment

The Deployment updates Pods in a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/)
fashion when `.spec.strategy.type==RollingUpdate`. You can specify `maxUnavailable` and `maxSurge` to control
the rolling update process.

##### Max Unavailable

`.spec.strategy.rollingUpdate.maxUnavailable` is an optional field that specifies the maximum number
of Pods that can be unavailable during the update process. The value can be an absolute number (for example, 5)
or a percentage of desired Pods (for example, 10%). The absolute number is calculated from percentage by
rounding down. The value cannot be 0 if `.spec.strategy.rollingUpdate.maxSurge` is 0. The default value is 25%.

For example, when this value is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
Pods immediately when the rolling update starts. Once new Pods are ready, old ReplicaSet can be scaled
down further, followed by scaling up the new ReplicaSet, ensuring that the total number of Pods available
at all times during the update is at least 70% of the desired Pods.

##### Max Surge

`.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the maximum number of Pods
that can be created over the desired number of Pods. The value can be an absolute number (for example, 5) or a
percentage of desired Pods (for example, 10%). The value cannot be 0 if `MaxUnavailable` is 0. The absolute number
is calculated from the percentage by rounding up. The default value is 25%.

For example, when this value is set to 30%, the new ReplicaSet can be scaled up immediately when the
rolling update starts, such that the total number of old and new Pods does not exceed 130% of desired
Pods. Once old Pods have been killed, the new ReplicaSet can be scaled up further, ensuring that the
total number of Pods running at any time during the update is at most 130% of desired Pods.

### Progress Deadline Seconds

`.spec.progressDeadlineSeconds` is an optional field that specifies the number of seconds you want
to wait for your Deployment to progress before the system reports back that the Deployment has
[failed progressing](#failed-deployment) - surfaced as a condition with `Type=Progressing`, `Status=False`.
and `Reason=ProgressDeadlineExceeded` in the status of the resource. The deployment controller will keep
retrying the Deployment. In the future, once automatic rollback will be implemented, the deployment
controller will roll back a Deployment as soon as it observes such a condition.

If specified, this field needs to be greater than `.spec.minReadySeconds`.

### Min Ready Seconds

`.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be ready without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Rollback To

`.spec.rollbackTo` is an optional field with the configuration the Deployment
should roll back to. Setting this field triggers a rollback, and this field will
be cleared by the server after a rollback is done.

Because this field will be cleared by the server, it should not be used
declaratively. For example, you should not perform `kubectl apply` with a
manifest with `.spec.rollbackTo` field set.

#### Revision

`.spec.rollbackTo.revision` is an optional field specifying the revision to roll
back to. Setting to 0 means rolling back to the last revision in history;
otherwise, means rolling back to the specified revision. This defaults to 0 when
[`spec.rollbackTo`](#rollback-to) is set.

### Revision History Limit

A Deployment's revision history is stored in the replica sets it controls.

`.spec.revisionHistoryLimit` is an optional field that specifies the number of old ReplicaSets to retain
to allow rollback. Its ideal value depends on the frequency and stability of new Deployments. All old
ReplicaSets will be kept by default, consuming resources in `etcd` and crowding the output of `kubectl get rs`,
if this field is not set. The configuration of each Deployment revision is stored in its ReplicaSets;
therefore, once an old ReplicaSet is deleted, you lose the ability to rollback to that revision of Deployment.

More specifically, setting this field to zero means that all old ReplicaSets with 0 replica will be cleaned up.
In this case, a new Deployment rollout cannot be undone, since its revision history is cleaned up.

### Paused

`.spec.paused` is an optional boolean field for pausing and resuming a Deployment. The only difference between
a paused Deployment and one that is not paused, is that any changes into the PodTemplateSpec of the paused
Deployment will not trigger new rollouts as long as it is paused. A Deployment is not paused by default when
it is created.

## Alternative to Deployments

### kubectl rolling update

[Kubectl rolling update](/docs/user-guide/kubectl/{{< param "version" >}}/#rolling-update) updates Pods and ReplicationControllers
in a similar fashion. But Deployments are recommended, since they are declarative, server side, and have
additional features, such as rolling back to any previous revision even after the rolling update is done.

{{% /capture %}}


