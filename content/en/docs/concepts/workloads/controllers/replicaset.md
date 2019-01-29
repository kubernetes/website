---
reviewers:
- Kashomon
- bprashanth
- madhusudancs
title: ReplicaSet
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often
used to guarantee the availability of a specified number of identical pods.


{{% /capture %}}

{{% capture body %}}

## How a ReplicaSet Works

A ReplicaSet is defined with fields including, a selector which specifies how to identify pods it can acquire, a number
of replicas indicating how many pods it should be maintaining, and a pod template specifying the data of new pods
it should bring bring up to meet the number of replicas criteria. A ReplicaSet then fulfills its purpose by creating
and deleting a Pods as needed to reach the desired number, using its given pod template for the creation.

The link a ReplicaSet has to its Pods is via the [metadata.ownerReferences][/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents]
field, which specifies one resource dependent on another. All _Pods_ acquired by a ReplicaSet have their owning
ReplicaSet's identifying information within their ownerReferences field. It's through this link that the ReplicaSet
knows of the state of the Pods it is maintaining and plan accordingly.

ReplicaSets identify new Pods to acquire by using its selector. If there is a Pod that has no OwnerReference or the
OwnerReference is not a Controller and it matches a ReplicaSet's selector, it will be immediately acquired by said
ReplicaSet.

## How to use a ReplicaSet

Most [`kubectl`](/docs/user-guide/kubectl/) commands that support
Replication Controllers also support ReplicaSets. One exception is the
[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) command. If
you want the rolling update functionality please consider using Deployments
instead. Also, the
[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) command is
imperative whereas Deployments are declarative, so we recommend using Deployments
through the [`rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout) command.

While ReplicaSets can be used independently, it could also be used by other resources. For example,
[Deployments](/docs/concepts/workloads/controllers/deployment/) are the recommended way of using ReplicaSets.
When you use Deployments you don't have to worry about managing the ReplicaSets that they create. Deployments own
and manage their ReplicaSets.


## When to use a ReplicaSet

A ReplicaSet ensures that a specified number of pod replicas are running at any given
time. However, a Deployment is a higher-level concept that manages ReplicaSets and
provides declarative updates to pods along with a lot of other useful features.
Therefore, we recommend using Deployments instead of directly using ReplicaSets, unless
you require custom update orchestration or don't require updates at all.

This actually means that you may never need to manipulate ReplicaSet objects:
use a Deployment instead, and define your application in the spec section.

## Example

{{< codenew file="controllers/frontend.yaml" >}}

Saving this manifest into `frontend.yaml` and submitting it to a Kubernetes cluster will
create the defined ReplicaSet and the pods that it manages.

```shell
kubectl create -f http://k8s.io/examples/controllers/frontend.yaml
```

You can then check on the state of the replicaset:
```shell
kubectl describe rs/frontend
```

And you will see output similar to:
```shell
Name:		frontend
Namespace:	default
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook
		tier=frontend
Annotations:	<none>
Replicas:	3 current / 3 desired
Pods Status:	3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=guestbook
                tier=frontend
  Containers:
   php-redis:
    Image:      gcr.io/google_samples/gb-frontend:v3
    Port:       80/TCP
    Requests:
      cpu:      100m
      memory:   100Mi
    Environment:
      GET_HOSTS_FROM:   dns
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-qhloh
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-dnjpy
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-9si5l
```

And lastly checking on the pods brought up:
```shell
kubectl get pods
```

Will yield pod information similar to
```shell
NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
```

## Non-Template Acquisitions

A ReplicaSet is not limited to owning pods specified by its template. Take the previous frontend ReplicaSet example,
and the Pods specified in the following manifest:

{{< codenew file="controllers/pod-rs.yaml" >}}

As those Pods do not have a Controller (or any object) as their owner reference and match the selector of the forntend
ReplicaSet, they will immediately be acquired by it.

Creating the Pods after the frontend ReplicaSet has been deployed and set up its initial Pod replicas to fulfill its
replica count requirement:

```shell
kubectl create -f http://k8s.io/examples/controllers/pod-rs.yaml
```

Will cause the new Pods to be acquired by the ReplicaSet, then immediately terminated as the ReplicaSet would be over
its desired count. Fetching the pods:
```shell
kubectl get pods
```

Will show that the new Pods are either already terminated, or in the process of being terminated
```shell
NAME             READY   STATUS        RESTARTS   AGE
frontend-9si5l   1/1     Running       0          1m
frontend-dnjpy   1/1     Running       0          1m
frontend-qhloh   1/1     Running       0          1m
pod2             0/1     Terminating   0          4s
```

If we create the Pods first:
```shell
kubectl create -f http://k8s.io/examples/controllers/pod-rs.yaml
```

And then create the ReplicaSet however:
```shell
kubectl create -f http://k8s.io/examples/controllers/frontend.yaml
```

We shall see that the ReplicaSet has acquired the Pods and has only created new ones according to its spec until the
number of its new Pods and the original matches its desired count. As fetching the pods:
```shell
kubectl get pods
```

Will reveal in its output:
```shell
NAME             READY   STATUS    RESTARTS   AGE
frontend-pxj4r   1/1     Running   0          5s
pod1             1/1     Running   0          13s
pod2             1/1     Running   0          13s
```

In this manner, a ReplicaSet can own a non-homogenous set of Pods

## Writing a ReplicaSet Manifest

As with all other Kubernetes API objects, a ReplicaSet needs the `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with manifests, see [object management using kubectl](/docs/concepts/overview/object-management-kubectl/overview/).

A ReplicaSet also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).

### Pod Template

The `.spec.template` is the only required field of the `.spec`. The `.spec.template` is a
[pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a
[pod](/docs/concepts/workloads/pods/pod/), except that it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields of a pod, a pod template in a ReplicaSet must specify appropriate
labels and an appropriate restart policy.

For labels, make sure to not overlap with other controllers. For more information, see [pod selector](#pod-selector).

For [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy), the only allowed value for `.spec.template.spec.restartPolicy` is `Always`, which is the default.

For local container restarts, ReplicaSet delegates to an agent on the node,
for example the [Kubelet](/docs/admin/kubelet/) or Docker.

### Pod Selector

The `.spec.selector` field is a [label selector](/docs/concepts/overview/working-with-objects/labels/). A ReplicaSet
manages all the pods with labels that match the selector. It does not distinguish
between pods that it created or deleted and pods that another person or process created or
deleted. This allows the ReplicaSet to be replaced without affecting the running pods.

The `.spec.template.metadata.labels` must match the `.spec.selector`, or it will
be rejected by the API.

In Kubernetes 1.9 the API version `apps/v1` on the ReplicaSet kind is the current version and is enabled by default. The API version `apps/v1beta2` is deprecated.

Also you should not normally create any pods whose labels match this selector, either directly, with
another ReplicaSet, or with another controller such as a Deployment. If you do so, the ReplicaSet thinks that it
created the other pods. Kubernetes does not stop you from doing this.

If you do end up with multiple controllers that have overlapping selectors, you
will have to manage the deletion yourself.

### Labels on a ReplicaSet

The ReplicaSet can itself have labels (`.metadata.labels`).  Typically, you
would set these the same as the `.spec.template.metadata.labels`.  However, they are allowed to be
different, and the `.metadata.labels` do not affect the behavior of the ReplicaSet.

### Replicas

You can specify how many pods should run concurrently by setting `.spec.replicas`. The number running at any time may be higher
or lower, such as if the replicas were just increased or decreased, or if a pod is gracefully
shut down, and a replacement starts early.

If you do not specify `.spec.replicas`, then it defaults to 1.

## Working with ReplicaSets

### Deleting a ReplicaSet and its Pods

To delete a ReplicaSet and all of its Pods, use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). The [Garbage collector](/docs/concepts/workloads/controllers/garbage-collection/) automatically deletes all of the dependent Pods by default.

When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Background` or `Foreground` in delete option. e.g. :
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
> -H "Content-Type: application/json"
```

### Deleting just a ReplicaSet

You can delete a ReplicaSet without affecting any of its pods using [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) with the `--cascade=false` option.
When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Orphan`, e.g. :
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
> -H "Content-Type: application/json"
```

Once the original is deleted, you can create a new ReplicaSet to replace it.  As long
as the old and new `.spec.selector` are the same, then the new one will adopt the old pods.
However, it will not make any effort to make existing pods match a new, different pod template.
To update pods to a new spec in a controlled way, use a [rolling update](#rolling-updates).

### Isolating pods from a ReplicaSet

Pods may be removed from a ReplicaSet's target set by changing their labels. This technique may be used to remove pods
from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (
  assuming that the number of replicas is not also changed).

### Scaling a ReplicaSet

A ReplicaSet can be easily scaled up or down by simply updating the `.spec.replicas` field. The ReplicaSet controller
ensures that a desired number of pods with a matching label selector are available and operational.

### ReplicaSet as an Horizontal Pod Autoscaler Target

A ReplicaSet can also be a target for
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). That is,
a ReplicaSet can be auto-scaled by an HPA. Here is an example HPA targeting
the ReplicaSet we created in the previous example.

{{< codenew file="controllers/hpa-rs.yaml" >}}

Saving this manifest into `hpa-rs.yaml` and submitting it to a Kubernetes cluster should
create the defined HPA that autoscales the target ReplicaSet depending on the CPU usage
of the replicated pods.

```shell
kubectl create -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

Alternatively, you can use the `kubectl autoscale` command to accomplish the same
(and it's easier!)

```shell
kubectl autoscale rs frontend --max=10
```

## Alternatives to ReplicaSet

### Deployment (Recommended)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) is a higher-level API object that updates its underlying ReplicaSets and their Pods
in a similar fashion as `kubectl rolling-update`. Deployments are recommended if you want this rolling update functionality,
because unlike `kubectl rolling-update`, they are declarative, server-side, and have additional features. For more information on running a stateless
application using a Deployment, please read [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).

### Bare Pods

Unlike the case where a user directly created pods, a ReplicaSet replaces pods that are deleted or terminated for any reason, such as in the case of node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, we recommend that you use a ReplicaSet even if your application requires only a single pod. Think of it similarly to a process supervisor, only it supervises multiple pods across multiple nodes instead of individual processes on a single node. A ReplicaSet delegates local container restarts to some agent on the node (for example, Kubelet or Docker).

### Job

Use a [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/) instead of a ReplicaSet for pods that are expected to terminate on their own
(that is, batch jobs).

### DaemonSet

Use a [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) instead of a ReplicaSet for pods that provide a
machine-level function, such as machine monitoring or machine logging.  These pods have a lifetime that is tied
to a machine lifetime: the pod needs to be running on the machine before other pods start, and are
safe to terminate when the machine is otherwise ready to be rebooted/shutdown.

### ReplicationController
ReplicaSets are the successors to [_ReplicationControllers_](/docs/concepts/workloads/controllers/replicationcontroller/).
The two serve the same purpose, and behave seimilarly except that a ReplicationController does not support set-based
selector requirements as described in the [labels user guide](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
As such, ReplicaSets are preferred over ReplicationControllers

{{% /capture %}}
