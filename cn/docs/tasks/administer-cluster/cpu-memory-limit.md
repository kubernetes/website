---
assignees:
- derekwaynecarr
- janetkuo
title: 设置 Pod CPU 和内存限制
redirect_from:
- "/docs/admin/limitrange/"
- "/docs/admin/limitrange/index.html"
- "/docs/tasks/configure-pod-container/limit-range/"
- "/docs/tasks/configure-pod-container/limit-range.html"
---

{% capture overview %}

<!--
By default, pods run with unbounded CPU and memory limits.  This means that any pod in the
system will be able to consume as much CPU and memory as is on the node that executes the pod.
-->

默认情况下，Pod 运行没有 CPU 和内存的限额。
这意味着系统中的任何 Pod 将能够像执行该 Pod 所在的节点一样，消耗足够多的 CPU 和内存。

<!--
This example demonstrates how limits can be applied to a Kubernetes [namespace](/docs/tasks/administer-cluster/namespaces-walkthrough/) to control
min/max resource limits per pod.  In addition, this example demonstrates how you can
apply default resource limits to pods in the absence of an end-user specified value.
-->

这个例子演示了如何限制 Kubernetes [Namespace](/docs/tasks/administer-cluster/namespaces-walkthrough/)，以此来控制每个 Pod 的最小/最大资源限额。
另外，这个例子演示了当终端用户没有为 Pod 设置资源限额时，如何使用默认的资源限额。

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Create a namespace

This example will work in a custom namespace to demonstrate the concepts involved.

Let's create a new namespace called limit-example:
-->

## 创建 Namespace

这个例子将能在一个自定义的 Namespace 中工作，演示了相关的概念。

让我们创建一个名称为 limit-example 的 Namespace：

```shell
$ kubectl create namespace limit-example
namespace "limit-example" created
```

<!--
Note that `kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands: 
-->

注意到 `kubectl` 命令将打印出创建或修改的资源类型和名称，然后会在后续的命令中使用到：

```shell
$ kubectl get namespaces
NAME            STATUS    AGE
default         Active    51s
limit-example   Active    45s
```

<!--
## Apply a limit to the namespace

Let's create a simple limit in our namespace.
-->

## 对 Namespace 应用限额

在我们的 Namespace 中创建一个简单的限额：

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/limits.yaml --namespace=limit-example
limitrange "mylimits" created
```

<!--
Let's describe the limits that were imposed in the namespace.
-->

让我们描述一下在该 Namespace 中被强加的限额：

```shell
$ kubectl describe limits mylimits --namespace=limit-example
Name:   mylimits
Namespace:  limit-example
Type        Resource      Min      Max      Default Request      Default Limit      Max Limit/Request Ratio
----        --------      ---      ---      ---------------      -------------      -----------------------
Pod         cpu           200m     2        -                    -                  -
Pod         memory        6Mi      1Gi      -                    -                  -
Container   cpu           100m     2        200m                 300m               -
Container   memory        3Mi      1Gi      100Mi                200Mi              -
```

<!--
In this scenario, the following limits were specified:

1. If a max constraint is specified for a resource (2 CPU and 1Gi memory in this case), then a limit
must be specified for that resource across all containers. Failure to specify a limit will result in
a validation error when attempting to create the pod. Note that a default value of limit is set by
*default* in file `limits.yaml` (300m CPU and 200Mi memory).
2. If a min constraint is specified for a resource (100m CPU and 3Mi memory in this case), then a
request must be specified for that resource across all containers. Failure to specify a request will
result in a validation error when attempting to create the pod. Note that a default value of request is
set by *defaultRequest* in file `limits.yaml` (200m CPU and 100Mi memory).
3. For any pod, the sum of all containers memory requests must be >= 6Mi and the sum of all containers
memory limits must be <= 1Gi; the sum of all containers CPU requests must be >= 200m and the sum of all
containers CPU limits must be <= 2.
-->

在这种场景下，指定了如下限制：

1. 如果一个资源被指定了最大约束（在该例子中为 2 CPU 和 1Gi 内存），然后跨所有容器的该资源，限额必须被指定。
当尝试创建该 Pod 时，指定限额失败将导致一个验证错误。
注意，一个默认的限额通过在 `limits.yaml` 文件中的 *default* 来设置（300m CPU 和 200Mi 内存）。
2. 如果一个资源被指定了最小约束（在该例子中为 100m CPU 和 3Mi 内存），然后跨所有容器的该资源，请求必须被指定。
当尝试创建该 Pod 时，指定的请求失败将导致一个验证错误。
注意，一个默认的请求的值通过在 `limits.yaml` 文件中的 *defaultRequest* 来设置（200m CPU 和 100Mi 内存）。
3. 对任意 Pod，所有容器内存 requests 值之和必须 >= 6Mi，所有容器内存 limits 值之和必须 <= 1Gi；
所有容器 CPU requests 值之和必须 >= 200m，所有容器 CPU limits 值之和必须 <= 2。

<!--
## Enforcing limits at point of creation

The limits enumerated in a namespace are only enforced when a pod is created or updated in
the cluster.  If you change the limits to a different value range, it does not affect pods that
were previously created in a namespace.
-->

## 创建时强制设置限额

当集群中的 Pod 创建和更新时，在一个 Namespace 中列出的限额是强制设置的。
如果将该限额修改成一个不同的值范围，它不会影响先前在该 Namespace 中创建的 Pod。

<!--
If a resource (CPU or memory) is being restricted by a limit, the user will get an error at time
of creation explaining why.

Let's first spin up a [Deployment](/docs/concepts/workloads/controllers/deployment/) that creates a single container Pod to demonstrate
how default values are applied to each pod.
-->

如果资源（CPU 或内存）被设置限额，用户将在创建时得到一个错误，并指出了错误的原因。

首先让我们启动一个创建单容器 Pod 的 [Deployment](/docs/concepts/workloads/controllers/deployment/)，来演示默认值是如何被应用到每个 Pod 上的：

```shell
$ kubectl run nginx --image=nginx --replicas=1 --namespace=limit-example
deployment "nginx" created
```
<!--
Note that `kubectl run` creates a Deployment named "nginx" on Kubernetes cluster >= v1.2. If you are running older versions, it creates replication controllers instead.
If you want to obtain the old behavior, use `--generator=run/v1` to create replication controllers. See [`kubectl run`](/docs/user-guide/kubectl/v1.6/#run) for more details. 
The Deployment manages 1 replica of single container Pod. Let's take a look at the Pod it manages. First, find the name of the Pod:
-->

注意到在 >= v1.2 的 Kubernetes 集群中，`kubectl run` 创建了名称为 “nginx” 的 Deployment。如果在老版本的集群上运行，相反它会创建 ReplicationController。
如果想要获取老版本的行为，使用 `--generator=run/v1` 选项来创建 ReplicationController。查看 [`kubectl run`](/docs/user-guide/kubectl/v1.6/#run) 获取更多详细信息。
Deployment 管理单容器 Pod 的 1 个副本。让我们看一下它是如何管理 Pod 的。首先，查找到 Pod 的名称：

```shell
$ kubectl get pods --namespace=limit-example
NAME                     READY     STATUS    RESTARTS   AGE
nginx-2040093540-s8vzu   1/1       Running   0          11s
```

<!--
Let's print this Pod with yaml output format (using `-o yaml` flag), and then `grep` the `resources` field. Note that your pod name will be different. 
-->

以 yaml 输出格式来打印这个 Pod，然后`grep` 其中的 `resources` 字段。注意，您自己的 Pod 的名称将不同于上面输出的：

```shell
$ kubectl get pods nginx-2040093540-s8vzu --namespace=limit-example -o yaml | grep resources -C 8
  resourceVersion: "57"
  selfLink: /api/v1/namespaces/limit-example/pods/nginx-2040093540-ivimu
  uid: 67b20741-f53b-11e5-b066-64510658e388
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    resources:
      limits:
        cpu: 300m
        memory: 200Mi
      requests:
        cpu: 200m
        memory: 100Mi
    terminationMessagePath: /dev/termination-log
    volumeMounts:
```

<!--
Note that our nginx container has picked up the namespace default CPU and memory resource *limits* and *requests*.

Let's create a pod that exceeds our allowed limits by having it have a container that requests 3 CPU cores.
-->

注意我们的 Nginx 容器已经使用了 Namespace 的默认 CPU 和内存资源的 *limits* 和 *requests*。

让我们创建一个超过被允许限额的 Pod，通过使它具有一个请求 3 CPU 核心的容器：

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/invalid-pod.yaml --namespace=limit-example
Error from server: error when creating "http://k8s.io/docs/tasks/configure-pod-container/invalid-pod.yaml": Pod "invalid-pod" is forbidden: [Maximum cpu usage per Pod is 2, but limit is 3., Maximum cpu usage per Container is 2, but limit is 3.]
```

<!--
Let's create a pod that falls within the allowed limit boundaries.
-->

让我们创建一个 Pod，使它在允许的最大限额范围之内：

```shell
$ kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/valid-pod.yaml --namespace=limit-example
pod "valid-pod" created
```

<!--
Now look at the Pod's resources field: 
-->

现在查看该 Pod 的 resources 字段：

```shell
$ kubectl get pods valid-pod --namespace=limit-example -o yaml | grep -C 6 resources
  uid: 3b1bfd7a-f53c-11e5-b066-64510658e388
spec:
  containers:
  - image: gcr.io/google_containers/serve_hostname
    imagePullPolicy: Always
    name: kubernetes-serve-hostname
    resources:
      limits:
        cpu: "1"
        memory: 512Mi
      requests:
        cpu: "1"
        memory: 512Mi
```

<!--
Note that this pod specifies explicit resource *limits* and *requests* so it did not pick up the namespace
default values.

Note: The *limits* for CPU resource are enforced in the default Kubernetes setup on the physical node
that runs the container unless the administrator deploys the kubelet with the following flag:
-->

注意到这个 Pod 显式地指定了资源 *limits* 和 *requests*，所以它不会使用该 Namespace 的默认值。

注意：在物理节点上默认安装的 Kubernetes 集群中，CPU 资源的 *limits* 是被强制使用的，该 Kubernetes 集群运行容器，除非管理员在部署 kubelet 时使用了如下标志：

```shell
$ kubelet --help
Usage of kubelet
....
  --cpu-cfs-quota[=true]: Enable CPU CFS quota enforcement for containers that specify CPU limits
$ kubelet --cpu-cfs-quota=false ...
```

<!--
## Cleanup

To remove the resources used by this example, you can just delete the limit-example namespace.
-->

## 清理

基于使用的该示例来清理资源，可以通过如下命令删除名称为 limit-example 的 Namespace：

```shell
$ kubectl delete namespace limit-example
namespace "limit-example" deleted
$ kubectl get namespaces
NAME            STATUS        AGE
default         Active        12m
```
{% endcapture %}

{% capture discussion %}
<!--
## Motivation for setting resource limits

Users may want to impose restrictions on the amount of resources a single pod in the system may consume
for a variety of reasons.

For example:
-->

## 设置资限额制的动机

可能由于对资源使用的各种原因，用户希望对单个 Pod 的资源总量进行强制限制。

例如：

<!--
1. Each node in the cluster has 2GB of memory.  The cluster operator does not want to accept pods
that require more than 2GB of memory since no node in the cluster can support the requirement.  To prevent a
pod from being permanently unscheduled to a node, the operator instead chooses to reject pods that exceed 2GB
of memory as part of admission control.
2. A cluster is shared by two communities in an organization that runs production and development workloads
respectively.  Production workloads may consume up to 8GB of memory, but development workloads may consume up
to 512MB of memory.  The cluster operator creates a separate namespace for each workload, and applies limits to
each namespace.
3. Users may create a pod which consumes resources just below the capacity of a machine.  The left over space
may be too small to be useful, but big enough for the waste to be costly over the entire cluster.  As a result,
the cluster operator may want to set limits that a pod must consume at least 20% of the memory and CPU of their
average node size in order to provide for more uniform scheduling and limit waste.
-->

1. 集群中每个节点有 2GB 内存。集群操作员不想接受内存需求大于 2GB 的 Pod，因为集群中没有节点能支持这个要求。
为了避免 Pod 永远无法被调度到集群中的节点上，操作员会选择去拒绝超过 2GB 内存作为许可控制的 Pod。
2. 一个集群被一个组织内部的 2 个团体共享，分别作为生产和开发工作负载来运行。
生产工作负载可能消耗多达 8GB 内存，而开发工作负载可能消耗 512MB 内存。
集群操作员为每个工作负载创建了一个单独的 Namespace，为每个 Namespace 设置了限额。
3. 用户会可能创建一个资源消耗低于机器容量的 Pod。剩余的空间可能太小但很有用，然而对于整个集群来说浪费的代价是足够大的。
结果集群操作员会希望设置限额：为了统一调度和限制浪费，Pod 必须至少消耗它们平均节点大小 20% 的内存和 CPU。

<!--
## Summary

Cluster operators that want to restrict the amount of resources a single container or pod may consume
are able to define allowable ranges per Kubernetes namespace.  In the absence of any explicit assignments,
the Kubernetes system is able to apply default resource *limits* and *requests* if desired in order to
constrain the amount of resource a pod consumes on a node.
-->

## 总结

想要限制单个容器或 Pod 消耗资源总量的集群操作员，能够为每个 Kubernetes Namespace 定义可允许的范围。
在没有任何明确指派的情况下，Kubernetes 系统能够使用默认的资源 *limits* 和 *requests*，如果需要的话，限制一个节点上的 Pod 的资源总量。

{% endcapture %}

{% capture whatsnext %}
<!--
* See [LimitRange design doc](https://git.k8s.io/community/contributors/design-proposals/admission_control_limit_range.md) for more information.
* See [Resources](/docs/concepts/configuration/manage-compute-resources-container/) for a detailed description of the Kubernetes resource model.
-->

* 查看 [LimitRange 设计文档](https://git.k8s.io/community/contributors/design-proposals/admission_control_limit_range.md) 获取更多信息。
* 查看 [资源](/docs/concepts/configuration/manage-compute-resources-container/) 获取关于 Kubernetes 资源模型的详细描述。

{% endcapture %}

{% include templates/task.md %}
