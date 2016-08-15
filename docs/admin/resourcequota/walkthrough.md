---
assignees:
- derekwaynecarr
- janetkuo

---

This example demonstrates a typical setup to control for resource usage in a namespace.

It demonstrates using the following resources:

* [Namespace](/docs/admin/namespaces)
* [Resource Quota](/docs/admin/resourcequota/)
* [Limit Range](/docs/admin/limitrange/)

This example assumes you have a functional Kubernetes setup.

## Scenario

The cluster-admin is operating a cluster on behalf of a user population and the cluster-admin
wants to control the amount of resources that can be consumed in a particular namespace to promote
fair sharing of the cluster and control cost.

The cluster-admin has the following goals:

* Limit the amount of compute resource for running pods
* Limit the number of persistent volume claims to control access to storage
* Limit the number of load balancers to control cost
* Prevent the use of node ports to preserve scarce resources
* Provide default compute resource requests to enable better scheduling decisions

## Step 1: Create a namespace

This example will work in a custom namespace to demonstrate the concepts involved.

Let's create a new namespace called quota-example:

```shell
$ kubectl create -f docs/admin/resourcequota/namespace.yaml
namespace "quota-example" created
$ kubectl get namespaces
NAME            STATUS    AGE
default         Active    2m
kube-system     Active    2m
quota-example   Active    39s
```

## Step 2: Apply an object-count quota to the namespace

The cluster-admin wants to control the following resources:

* persistent volume claims
* load balancers
* node ports

Let's create a simple quota that controls object counts for those resource types in this namespace.

```shell
$ kubectl create -f docs/admin/resourcequota/object-counts.yaml --namespace=quota-example
resourcequota "object-counts" created
```

The quota system will observe that a quota has been created, and will calculate consumption
in the namespace in response.  This should happen quickly.

Let's describe the quota to see what is currently being consumed in this namespace:

```shell
$ kubectl describe quota object-counts --namespace=quota-example
Name:                  object-counts
Namespace:             quota-example
Resource               Used	Hard
--------               ----	----
persistentvolumeclaims 0    2
services.loadbalancers 0    2
services.nodeports     0    0
```

The quota system will now prevent users from creating more than the specified amount for each resource.


## Step 3: Apply a compute-resource quota to the namespace

To limit the amount of compute resource that can be consumed in this namespace,
let's create a quota that tracks compute resources.

```shell
$ kubectl create -f docs/admin/resourcequota/compute-resources.yaml --namespace=quota-example
resourcequota "compute-resources" created
```

Let's describe the quota to see what is currently being consumed in this namespace:

```shell
$ kubectl describe quota compute-resources --namespace=quota-example
Name:                  compute-resources
Namespace:             quota-example
Resource               Used Hard
--------               ---- ----
limits.cpu             0    2
limits.memory          0    2Gi
pods                   0    4
requests.cpu           0    1
requests.memory        0    1Gi
```

The quota system will now prevent the namespace from having more than 4 non-terminal pods.  In
addition, it will enforce that each container in a pod makes a `request` and defines a `limit` for
`cpu` and `memory`.

## Step 4: Applying default resource requests and limits

Pod authors rarely specify resource requests and limits for their pods.

Since we applied a quota to our project, let's see what happens when an end-user creates a pod that has unbounded
cpu and memory by creating an nginx container.

To demonstrate, lets create a deployment that runs nginx:

```shell
$ kubectl run nginx --image=nginx --replicas=1 --namespace=quota-example
deployment "nginx" created
```

Now let's look at the pods that were created.

```shell
$ kubectl get pods --namespace=quota-example
```

What happened?  I have no pods!  Let's describe the deployment to get a view of what is happening.

```shell
$ kubectl describe deployment nginx --namespace=quota-example
Name:                   nginx
Namespace:              quota-example
CreationTimestamp:      Mon, 06 Jun 2016 16:11:37 -0400
Labels:                 run=nginx
Selector:               run=nginx
Replicas:               0 updated | 1 total | 0 available | 1 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
OldReplicaSets:         <none>
NewReplicaSet:          nginx-3137573019 (0/1 replicas created)
...
```

A deployment created a corresponding replica set and attempted to size it to create a single pod.

Let's look at the replica set to get more detail.

```shell
$ kubectl describe rs nginx-3137573019 --namespace=quota-example
Name:                   nginx-3137573019
Namespace:              quota-example
Image(s):               nginx
Selector:               pod-template-hash=3137573019,run=nginx
Labels:                 pod-template-hash=3137573019
                        run=nginx
Replicas:               0 current / 1 desired
Pods Status:            0 Running / 0 Waiting / 0 Succeeded / 0 Failed
No volumes.
Events:
  FirstSeen	LastSeen	Count From                    SubobjectPath Type      Reason        Message
  ---------	--------  ----- ----                    -------------	--------  ------        -------
  4m        7s        11    {replicaset-controller }              Warning   FailedCreate  Error creating: pods "nginx-3137573019-" is forbidden: Failed quota: compute-resources: must specify limits.cpu,limits.memory,requests.cpu,requests.memory
```

The Kubernetes API server is rejecting the replica set requests to create a pod because our pods
do not specify `requests` or `limits` for `cpu` and `memory`.

So let's set some default values for the amount of `cpu` and `memory` a pod can consume:

```shell
$ kubectl create -f docs/admin/resourcequota/limits.yaml --namespace=quota-example
limitrange "limits" created
$ kubectl describe limits limits --namespace=quota-example
Name:           limits
Namespace:      quota-example
Type      Resource  Min  Max  Default Request   Default Limit   Max Limit/Request Ratio
----      --------  ---  ---  ---------------   -------------   -----------------------
Container memory    -    -    256Mi             512Mi           -
Container cpu       -    -    100m              200m            -
```

If the Kubernetes API server observes a request to create a pod in this namespace, and the containers
in that pod do not make any compute resource requests, a default request and default limit will be applied
as part of admission control.

In this example, each pod created will have compute resources equivalent to the following:

```shell
$ kubectl run nginx \
  --image=nginx \
  --replicas=1 \
  --requests=cpu=100m,memory=256Mi \
  --limits=cpu=200m,memory=512Mi \
  --namespace=quota-example
```

Now that we have applied default compute resources for our namespace, our replica set should be able to create
its pods.

```shell
$ kubectl get pods --namespace=quota-example
NAME                     READY     STATUS    RESTARTS   AGE
nginx-3137573019-fvrig   1/1       Running   0          6m
```

And if we print out our quota usage in the namespace:

```shell
$ kubectl describe quota --namespace=quota-example
Name:           compute-resources
Namespace:      quota-example
Resource        Used    Hard
--------        ----    ----
limits.cpu      200m    2
limits.memory   512Mi   2Gi
pods            1       4
requests.cpu    100m    1
requests.memory 256Mi   1Gi


Name:                 object-counts
Namespace:            quota-example
Resource              Used    Hard
--------              ----    ----
persistentvolumeclaims 0      2
services.loadbalancers 0      2
services.nodeports     0      0
```

As you can see, the pod that was created is consuming explict amounts of compute resources, and the usage is being
tracked by Kubernetes properly.

## Step 5: Advanced quota scopes

Let's imagine you did not want to specify default compute resource consumption in your namespace.

Instead, you want to let users run a specific number of `BestEffort` pods in their namespace to take
advantage of slack compute resources, and then require that users make an explicit resource request for
pods that require a higher quality of service.

Let's create a new namespace with two quotas to demonstrate this behavior:

```shell
$ kubectl create namespace quota-scopes
namespace "quota-scopes" created
$ kubectl create -f docs/admin/resourcequota/best-effort.yaml --namespace=quota-scopes
resourcequota "best-effort" created
$ kubectl create -f docs/admin/resourcequota/not-best-effort.yaml --namespace=quota-scopes
resourcequota "not-best-effort" created
$ kubectl describe quota --namespace=quota-scopes
Name:       best-effort
Namespace:  quota-scopes
Scopes:     BestEffort
 * Matches all pods that have best effort quality of service.
Resource    Used	Hard
--------    ----  ----
pods        0     10


Name:             not-best-effort
Namespace:        quota-scopes
Scopes:           NotBestEffort
 * Matches all pods that do not have best effort quality of service.
Resource          Used  Hard
--------          ----  ----
limits.cpu        0     2
limits.memory     0     2Gi
pods              0     4
requests.cpu      0     1
requests.memory   0     1Gi
```

In this scenario, a pod that makes no compute resource requests will be tracked by the `best-effort` quota.

A pod that does make compute resource requests will be tracked by the `not-best-effort` quota.

Let's demonstrate this by creating two deployments:

```shell
$ kubectl run best-effort-nginx --image=nginx --replicas=8 --namespace=quota-scopes
deployment "best-effort-nginx" created
$ kubectl run not-best-effort-nginx \
  --image=nginx \
  --replicas=2 \
  --requests=cpu=100m,memory=256Mi \
  --limits=cpu=200m,memory=512Mi \
  --namespace=quota-scopes
deployment "not-best-effort-nginx" created
```

Even though no default limits were specified, the `best-effort-nginx` deployment will create
all 8 pods.  This is because it is tracked by the `best-effort` quota, and the `not-best-effort`
quota will just ignore it.  The `not-best-effort` quota will track the `not-best-effort-nginx`
deployment since it creates pods with `Burstable` quality of service.

Let's list the pods in the namespace:

```shell
$ kubectl get pods --namespace=quota-scopes
NAME                                     READY     STATUS    RESTARTS   AGE
best-effort-nginx-3488455095-2qb41       1/1       Running   0          51s
best-effort-nginx-3488455095-3go7n       1/1       Running   0          51s
best-effort-nginx-3488455095-9o2xg       1/1       Running   0          51s
best-effort-nginx-3488455095-eyg40       1/1       Running   0          51s
best-effort-nginx-3488455095-gcs3v       1/1       Running   0          51s
best-effort-nginx-3488455095-rq8p1       1/1       Running   0          51s
best-effort-nginx-3488455095-udhhd       1/1       Running   0          51s
best-effort-nginx-3488455095-zmk12       1/1       Running   0          51s
not-best-effort-nginx-2204666826-7sl61   1/1       Running   0          23s
not-best-effort-nginx-2204666826-ke746   1/1       Running   0          23s
```

As you can see, all 10 pods have been allowed to be created.

Let's describe current quota usage in the namespace:

```shell
$ kubectl describe quota --namespace=quota-scopes
Name:            best-effort
Namespace:       quota-scopes
Scopes:          BestEffort
 * Matches all pods that have best effort quality of service.
Resource         Used  Hard
--------         ----  ----
pods             8     10


Name:               not-best-effort
Namespace:          quota-scopes
Scopes:             NotBestEffort
 * Matches all pods that do not have best effort quality of service.
Resource            Used  Hard
--------            ----  ----
limits.cpu          400m  2
limits.memory       1Gi   2Gi
pods                2     4
requests.cpu        200m  1
requests.memory     512Mi 1Gi
```

As you can see, the `best-effort` quota has tracked the usage for the 8 pods we created in
the `best-effort-nginx` deployment, and the `not-best-effort` quota has tracked the usage for
the 2 pods we created in the `not-best-effort-nginx` quota.

Scopes provide a mechanism to subdivide the set of resources that are tracked by
any quota document to allow greater flexibility in how operators deploy and track resource
consumption.  

In addition to `BestEffort` and `NotBestEffort` scopes, there are scopes to restrict
long-running versus time-bound pods.  The `Terminating` scope will match any pod
where `spec.activeDeadlineSeconds is not nil`.  The `NotTerminating` scope will match any pod
where `spec.activeDeadlineSeconds is nil`.  These scopes allow you to quota pods based on their
anticipated permanence on a node in your cluster.

## Summary

Actions that consume node resources for cpu and memory can be subject to hard quota limits defined by the namespace quota.

Any action that consumes those resources can be tweaked, or can pick up namespace level defaults to meet your end goal.

Quota can be apportioned based on quality of service and anticipated permanence on a node in your cluster.
