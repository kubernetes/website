---
assignees:
- derekwaynecarr
- janetkuo
title: 应用资源配额和限额
redirect_from:
- "/docs/admin/resourcequota/walkthrough/"
- "/docs/admin/resourcequota/walkthrough.html"
- "/docs/tasks/configure-pod-container/apply-resource-quota-limit/"
- "/docs/tasks/configure-pod-container/apply-resource-quota-limit.html"
---

<!--
title: Apply Resource Quotas and Limits
-->

{% capture overview %}

<!--
This example demonstrates a typical setup to control resource usage in a namespace.
-->
本示例展示了在一个 namespace 中控制资源用量的典型设置。

<!--
It demonstrates using the following resources: [Namespace](/docs/admin/namespaces), [ResourceQuota](/docs/concepts/policy/resource-quotas/), and [LimitRange](/docs/tasks/configure-pod-container/limit-range/).
-->
本文展示了以下资源的使用： [Namespace](/docs/admin/namespaces), [ResourceQuota](/docs/concepts/policy/resource-quotas/) 和  [LimitRange](/docs/tasks/configure-pod-container/limit-range/)。

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
<!--
## Scenario
-->
## 场景

<!--
The cluster-admin is operating a cluster on behalf of a user population and the cluster-admin
wants to control the amount of resources that can be consumed in a particular namespace to promote
fair sharing of the cluster and control cost.
-->
集群管理员正在操作一个代表用户群体的集群，他希望控制一个特定 namespace 中可以被使用的资源总量，以达到促进对集群的公平共享及控制成本的目的。

<!--
The cluster-admin has the following goals:
-->
集群管理员有以下目标：

<!--
* Limit the amount of compute resource for running pods
* Limit the number of persistent volume claims to control access to storage
* Limit the number of load balancers to control cost
* Prevent the use of node ports to preserve scarce resources
* Provide default compute resource requests to enable better scheduling decisions
  -->
* 限制运行中 pod 使用的计算资源数量
* 限制 persistent volume claims 数量以控制对存储的访问
* 限制 load balancers 数量以控制成本
* 防止使用 node ports 以保留稀缺资源
* 提供默认计算资源请求以实现更好的调度决策

<!--
## Create a namespace
-->
## 创建 namespace

<!--
This example will work in a custom namespace to demonstrate the concepts involved.
-->
本示例将在一个自定义的 namespace 中运行，以展示相关概念。

<!--
Let's create a new namespace called quota-example:
-->
让我们创建一个叫做 quota-example 的新 namespace：

```shell
$ kubectl create namespace quota-example
namespace "quota-example" created
$ kubectl get namespaces
NAME            STATUS    AGE
default         Active    2m
kube-system     Active    2m
quota-example   Active    39s
```

<!--
## Apply an object-count quota to the namespace
-->
## 应用 object-count 配额到 namespace

<!--
The cluster-admin wants to control the following resources:

* persistent volume claims
* load balancers
* node ports
  -->
集群管理员想要控制下列资源：

* persistent volume claims
* load balancers
* node ports

<!--
Let's create a simple quota that controls object counts for those resource types in this namespace.
-->
我们来创建一个简单的配额，用于控制这个 namespace 中那些资源类型的对象数量。

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/rq-object-counts.yaml --namespace=quota-example
resourcequota "object-counts" created
```

<!--
The quota system will observe that a quota has been created, and will calculate consumption
in the namespace in response. This should happen quickly.
-->
配额系统将察觉到有一个配额被创建，并且会计算 namespace 中的资源消耗量作为响应。这应该会很快发生。

<!--
Let's describe the quota to see what is currently being consumed in this namespace:
-->
让我们显示一下配额来观察这个 namespace 中当前被消耗的资源：

```shell
$ kubectl describe quota object-counts --namespace=quota-example
Name:                  object-counts
Namespace:             quota-example
Resource               Used    Hard
--------               ----    ----
persistentvolumeclaims 0    2
services.loadbalancers 0    2
services.nodeports     0    0
```

<!--
The quota system will now prevent users from creating more than the specified amount for each resource.
-->
配额系统现在将阻止用户创建比各个资源指定数量更多的资源。


<!--
## Apply a compute-resource quota to the namespace
-->
## 应用计算资源配额到 namespace

<!--
To limit the amount of compute resource that can be consumed in this namespace,
let's create a quota that tracks compute resources.
-->
为了限制这个 namespace 可以被使用的计算资源数量，让我们创建一个跟踪计算资源的配额。

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/rq-compute-resources.yaml --namespace=quota-example
resourcequota "compute-resources" created
```

<!--
Let's describe the quota to see what is currently being consumed in this namespace:
-->
让我们显示一下配额来观察这个 namespace 中当前被消耗的资源：

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

<!--
The quota system will now prevent the namespace from having more than 4 non-terminal pods.  In
addition, it will enforce that each container in a pod makes a `request` and defines a `limit` for
`cpu` and `memory`.
-->
配额系统现在会防止 namespace 拥有超过 4 个没有终止的 pod。此外它还将强制 pod 中的每个容器配置一个 `request` 并为 `cpu` 和 `memory` 定义 `limit`。

<!--
## Applying default resource requests and limits
-->
## 应用默认资源请求和限制

<!--
Pod authors rarely specify resource requests and limits for their pods.
-->
Pod 的作者很少为它们的 pod 指定资源请求和限制。

<!--
Since we applied a quota to our project, let's see what happens when an end-user creates a pod that has unbounded
cpu and memory by creating an nginx container.
-->
既然我们对项目应用了配额，我们来看一下当终端用户通过创建一个没有 cpu 和 内存限制的 pod 时会发生什么。这通过在 pod 里创建一个 nginx 容器实现。

<!--
To demonstrate, lets create a deployment that runs nginx:
-->
作为演示，让我们来创建一个运行 nginx 的 deployment：

```shell
$ kubectl run nginx --image=nginx --replicas=1 --namespace=quota-example
deployment "nginx" created
```

<!--
Now let's look at the pods that were created.
-->
现在我们来看一下创建的 pod。

```shell
$ kubectl get pods --namespace=quota-example
```

<!--
What happened?  I have no pods!  Let's describe the deployment to get a view of what is happening.
-->
发生了什么？我一个 pod 都没有！让我们 describe 这个 deployment 来看看发生了什么。

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

<!--
A deployment created a corresponding replica set and attempted to size it to create a single pod.
-->
Deployment 创建了一个对应的 replica set 并尝试按照大小来创建一个 pod。

<!--
Let's look at the replica set to get more detail.
-->
让我们看看 replica set 的更多细节。

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
  FirstSeen    LastSeen    Count From                    SubobjectPath Type      Reason        Message
  ---------    --------  ----- ----                    -------------    --------  ------        -------
  4m        7s        11    {replicaset-controller }              Warning   FailedCreate  Error creating: pods "nginx-3137573019-" is forbidden: Failed quota: compute-resources: must specify limits.cpu,limits.memory,requests.cpu,requests.memory
```

<!--
The Kubernetes API server is rejecting the replica set requests to create a pod because our pods
do not specify `requests` or `limits` for `cpu` and `memory`.
-->
Kubernetes API server 拒绝了  replica set 创建一个 pod 的请求，因为我们的 pod 没有为 `cpu` 和 `memory` 指定 `requests` 或 `limits`。

<!--
So let's set some default values for the amount of `cpu` and `memory` a pod can consume:
-->
因此，我们来为 pod 指定它可以使用的 `cpu` 和 `memory` 默认数量。

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/rq-limits.yaml --namespace=quota-example
limitrange "limits" created
$ kubectl describe limits limits --namespace=quota-example
Name:           limits
Namespace:      quota-example
Type      Resource  Min  Max  Default Request   Default Limit   Max Limit/Request Ratio
----      --------  ---  ---  ---------------   -------------   -----------------------
Container memory    -    -    256Mi             512Mi           -
Container cpu       -    -    100m              200m            -
```

<!--
If the Kubernetes API server observes a request to create a pod in this namespace, and the containers
in that pod do not make any compute resource requests, a default request and default limit will be applied
as part of admission control.
-->
如果 Kubernetes API server 发现一个 namespace 中有一个创建 pod 的请求，并且 pod 中的容器没有设置任何计算资源请求时，作为准入控制的一部分，一个默认的 request 和 limit 将会被应用。

<!--
In this example, each pod created will have compute resources equivalent to the following:
-->
在本例中，创建的每个 pod 都将拥有如下的计算资源限制：

```shell
$ kubectl run nginx \
  --image=nginx \
  --replicas=1 \
  --requests=cpu=100m,memory=256Mi \
  --limits=cpu=200m,memory=512Mi \
  --namespace=quota-example
```

<!--
Now that we have applied default compute resources for our namespace, our replica set should be able to create
its pods.
-->
由于已经为我们的 namespace 申请了默认的计算资源，我们的 replica set 应该能够创建它的 pod 了。

```shell
$ kubectl get pods --namespace=quota-example
NAME                     READY     STATUS    RESTARTS   AGE
nginx-3137573019-fvrig   1/1       Running   0          6m
```

<!--
And if we print out our quota usage in the namespace:
-->
而且如果打印出我们在这个 namespace 中的配额使用情况：

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

<!--
As you can see, the pod that was created is consuming explicit amounts of compute resources, and the usage is being
tracked by Kubernetes properly.
-->
就像你看到的，创建的 pod 消耗了明确的计算资源量，并且正被 Kubernetes 正确的追踪着。

<!--
## Advanced quota scopes
-->
## 高级配额 scopes

<!--
Let's imagine you did not want to specify default compute resource consumption in your namespace.
-->
让我们想象一下如果你不希望为你的 namespace 指定默认计算资源使用量。

<!--
Instead, you want to let users run a specific number of `BestEffort` pods in their namespace to take
advantage of slack compute resources, and then require that users make an explicit resource request for
pods that require a higher quality of service.
-->
作为替换，你希望用户在它们的 namespace 中运行指定数量的 `BestEffort` pod，以从宽松的计算资源中获得好处。然后要求用户为需要更高质量服务的 pod 配置一个显式的资源请求。

<!--
Let's create a new namespace with two quotas to demonstrate this behavior:
-->
让我们新建一个拥有两个配额的 namespace 来演示这种行为：

```shell
$ kubectl create namespace quota-scopes
namespace "quota-scopes" created
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/rq-best-effort.yaml --namespace=quota-scopes
resourcequota "best-effort" created
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/rq-not-best-effort.yaml --namespace=quota-scopes
resourcequota "not-best-effort" created
$ kubectl describe quota --namespace=quota-scopes
Name:       best-effort
Namespace:  quota-scopes
Scopes:     BestEffort
 * Matches all pods that have best effort quality of service.
Resource    Used    Hard
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

<!--
In this scenario, a pod that makes no compute resource requests will be tracked by the `best-effort` quota.
-->
在这种场景下，一个没有配置计算资源请求的 pod 将会被 `best-effort` 配额跟踪。

<!--
A pod that does make compute resource requests will be tracked by the `not-best-effort` quota.
-->
而配置了计算资源请求的则会被 `not-best-effort` 配额追踪。

<!--
Let's demonstrate this by creating two deployments:
-->
让我们创建两个 deployments 作为演示：

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

<!--
Even though no default limits were specified, the `best-effort-nginx` deployment will create
all 8 pods.  This is because it is tracked by the `best-effort` quota, and the `not-best-effort`
quota will just ignore it.  The `not-best-effort` quota will track the `not-best-effort-nginx`
deployment since it creates pods with `Burstable` quality of service.
-->
虽然没有指定默认的 limits，`best-effort-nginx` deployment 还是会创建 8 个 pod。这是由于它被 `best-effort` 配额追踪，而 `not-best-effort` 配额将忽略它。`not-best-effort` 配额将追踪 `not-best-effort-nginx` deployment，因为它创建的 pod 具有 `Burstable` 服务质量。

<!--
Let's list the pods in the namespace:
-->
让我们列出 namespace 中的 pod：

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

<!--
As you can see, all 10 pods have been allowed to be created.
-->
如你看到的，所有 10 个 pod 都已经被准许创建。

<!--
Let's describe current quota usage in the namespace:
-->
让我们 describe 这个 namespace 当前的配额使用情况：

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

<!--
As you can see, the `best-effort` quota has tracked the usage for the 8 pods we created in
the `best-effort-nginx` deployment, and the `not-best-effort` quota has tracked the usage for
the 2 pods we created in the `not-best-effort-nginx` quota.
-->
如你看到的，`best-effort` 配额追踪了我们在 `best-effort-nginx` deployment 中创建的 8 个 pod 的资源用量，而 `not-best-effort` 配额追踪了我们在 `not-best-effort-nginx` deployment 中创的两个 pod 的用量。

<!--
Scopes provide a mechanism to subdivide the set of resources that are tracked by
any quota document to allow greater flexibility in how operators deploy and track resource
consumption.
-->
Scopes 提供了一种来对任何配额文档追踪的资源集合进行细分的机制，给操作人员部署和追踪资源消耗带来更大的灵活性。

<!--
In addition to `BestEffort` and `NotBestEffort` scopes, there are scopes to restrict
long-running versus time-bound pods.  The `Terminating` scope will match any pod
where `spec.activeDeadlineSeconds is not nil`.  The `NotTerminating` scope will match any pod
where `spec.activeDeadlineSeconds is nil`.  These scopes allow you to quota pods based on their
anticipated permanence on a node in your cluster.
-->
除 `BestEffort` 和 `NotBestEffort` scopes 之外，还有用于限制长时间运行和有时限 pod 的scopes。`Terminating` scope 将匹配任何 `spec.activeDeadlineSeconds` 不为 `nil` 的 pod。`NotTerminating` scope 将匹配任何 `spec.activeDeadlineSeconds` 为 `nil` 的 pod。这些 scopes 允许你基于 pod 在你集群中 node 上的预期持久程度来为它们指定配额。

{% endcapture %}

{% capture discussion %}
<!--
## Summary
-->
## 总结

<!--
Actions that consume node resources for cpu and memory can be subject to hard quota limits defined by the namespace quota.
-->
消耗节点 cpu 和 memory 资源的动作受到 namespace 配额定义的硬性配额限制的管制。

<!--
Any action that consumes those resources can be tweaked, or can pick up namespace level defaults to meet your end goal.
-->
任意消耗那些资源的动作能够被调整，或者获得一个 namespace 级别的默认值以符合你最终的目标。

<!--
Quota can be apportioned based on quality of service and anticipated permanence on a node in your cluster.
-->
可以基于服务质量或者在你集群中节点上的预期持久程度来分配配额。

{% endcapture %}

{% include templates/task.md %}
