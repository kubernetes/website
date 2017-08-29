---
assignees:
- derekwaynecarr
- janetkuo
title: 使用命名空间共享一个集群  
redirect_from:
- "/docs/admin/namespaces/"
- "/docs/admin/namespaces/index.html"
---
<!--
---
assignees:
- derekwaynecarr
- janetkuo
title: Share a Cluster with Namespaces
redirect_from:
- "/docs/admin/namespaces/"
- "/docs/admin/namespaces/index.html"
---
-->

<!--
A Namespace is a mechanism to partition resources created by users into
a logically named group.
-->
命名空间是用户资源管理的逻辑分区

<!--
## Motivation

A single cluster should be able to satisfy the needs of multiple users or groups of users (henceforth a 'user community').

Each user community wants to be able to work in isolation from other communities.

Each user community has its own:
-->
## 动机

通常集群应该能够满足多个用户或用户组（以下称为“用户社区”）的需求。

每个用户社区希望能够与其他社区隔离工作。

每个用户社区都有自己的：

<!--
1. resources (pods, services, replication controllers, etc.)
2. policies (who can or cannot perform actions in their community)
3. constraints (this community is allowed this much quota, etc.)

A cluster operator may create a Namespace for each unique user community.
-->
1. 资源（pods, 服务, rc等）
2. 策略（能否在他们的社区执行）
3. 限制约束（这个社区允许这么多配额等）

集群操作员可以为每个唯一用户社区创建一个命名空间。

<!--
The Namespace provides a unique scope for:

1. named resources (to avoid basic naming collisions)  
2. delegated management authority to trusted users  
3. ability to limit community resource consumption  
-->
命名空间提供了一个唯一的范围：

1. 命名资源（以避免基本的命名冲突）
2. 委托管理权限给受信任的用户
3. 限制社区资源消耗的能力

<!--
## Use cases

1.  As a cluster operator, I want to support multiple user communities on a single cluster.
2.  As a cluster operator, I want to delegate authority to partitions of the cluster to trusted users
    in those communities.
3.  As a cluster operator, I want to limit the amount of resources each community can consume in order
    to limit the impact to other communities using the cluster.
4.  As a cluster user, I want to interact with resources that are pertinent to my user community in
    isolation of what other user communities are doing on the cluster.
-->
## 用例

1. 作为集群操作员，我想在一个集群上支持多个用户社区。  
2. 作为集群操作员，我想将集群分区的权限委托给在这些社区的受信任的用户。  
3. 作为集群操作员，我想限制每个社区可以消耗的资源数量以便限制对该集群中其它社区的影响。  
4. 作为集群用户，我想与与用户社区相关的资源进行交互，而与群集中的其他用户社区无关。  

<!--
## Viewing namespaces

You can list the current namespaces in a cluster using:
-->
## 查看命名空间

您可以使用以下命令列出群集中的当前命名空间：

```shell
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
```

<!--
Kubernetes starts with two initial namespaces:

   * `default` The default namespace for objects with no other namespace
   * `kube-system` The namespace for objects created by the Kubernetes system

You can also get the summary of a specific namespace using:
-->
Kubernetes开始时有两个初始化的命名空间：

   * `default` 没有其他命名空间的对象的默认命名空间
   * `kube-system` 由Kubernetes系统创建的对象的命名空间
   
您还可以使用以下命令获取特定命名空间的摘要：

```shell
$ kubectl get namespaces <name>
```

<!--
Or you can get detailed information with:
-->
或者你可以获得详细的信息通过：

```shell
$ kubectl describe namespaces <name>
Name:       default
Labels:       <none>
Status:       Active

No resource quota.

Resource Limits
 Type        Resource    Min    Max    Default
 ----                --------    ---    ---    ---
 Container            cpu            -    -    100m
```

<!--
Note that these details show both resource quota (if present) as well as resource limit ranges.

Resource quota tracks aggregate usage of resources in the *Namespace* and allows cluster operators
to define *Hard* resource usage limits that a *Namespace* may consume.
-->
注意这些详细信息显示了资源配额（如果存在）以及资源限制范围。

资源配额记录*命名空间*中资源的总体使用情况并且允许集群操作员定义*硬性*资源使用率限制一个命名空间可能消耗的资源。

<!--
A limit range defines min/max constraints on the amount of resources a single entity can consume in
a *Namespace*.

See [Admission control: Limit Range](https://git.k8s.io/community/contributors/design-proposals/admission_control_limit_range.md)

A namespace can be in one of two phases:

   * `Active` the namespace is in use
   * `Terminating` the namespace is being deleted, and can not be used for new objects

See the [design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#phases) for more details.
-->
限制范围定义了在*命名空间*中单个实体可以使用的资源量的最小/最大约束。

参考[准入控制：限制范围](https://git.k8s.io/community/contributors/design-proposals/admission_control_limit_range.md)。

命名空间可以分为两个阶段：

   * `Active` 命名空间正在使用中
   * `Terminating` 命名空间正在被删除，不能被新的对象使用

更多细节请参考[设计文档](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#phases)。

<!--
## Creating a new namespace

To create a new namespace, first create a new YAML file called `my-namespace.yaml` with the contents:
-->
## 创建一个新的命名空间

要想创建一个新的命名空间，首先创建一个名为`my-namespace.yaml`的新的YAML文件，其内容如下：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <insert-namespace-name-here>
```

<!--
Then run:
-->
然后运行：

```shell
$ kubectl create -f ./my-namespace.yaml
```

<!--
Note that the name of your namespace must be a DNS compatible label.

There's an optional field `finalizers`, which allows observables to purge resources whenever the namespace is deleted. Keep in mind that if you specify a nonexistent finalizer, the namespace will be created but will get stuck in the `Terminating` state if the user tries to delete it.

More information on `finalizers` can be found in the namespace [design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#finalizers).
-->
注意你的命名空间的名称必须是一个DNS兼容的标签。

这里有一个可选的`终止器`域，每当这个命名空间被删除时允许观察清除资源。
记住如果你指定了一个不存在的终止器，这个命名空间将会被创建但是如果用户试图删除它时，它将卡在`Terminating`态。

有关终止器的更多信息可以在[命名空间设计文档](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#finalizers)中找到。

<!--
### Working in namespaces

See [Setting the namespace for a request](/docs/user-guide/namespaces/#setting-the-namespace-for-a-request)
and [Setting the namespace preference](/docs/user-guide/namespaces/#setting-the-namespace-preference).

## Deleting a namespace

You can delete a namespace with
-->
### 在命名空间中工作

参阅[设置命名空间请求](/docs/user-guide/namespaces/#setting-the-namespace-for-a-request)和[设置命名空间优先级](/docs/user-guide/namespaces/#setting-the-namespace-preference)。

## 删除一个命名空间

你可以通过以下命令删除一个命名空间：

```shell
$ kubectl delete namespaces <insert-some-namespace-name>
```

<!--
**WARNING, this deletes _everything_ under the namespace!**

This delete is asynchronous, so for a time you will see the namespace in the `Terminating` state.
-->
**警告，这将删除在命名空间下的一切！**

这个删除是异步的，因此一段时间你会看到命名空间停留在`Terminating`状态。

<!--
## Namespaces and DNS

When you create a [Service](/docs/user-guide/services), it creates a corresponding [DNS entry](/docs/admin/dns).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
## 命名空间与DNS

当你创建了一个[服务](/docs/user-guide/services)，它会创建一个相应的[DNS入口](/docs/admin/dns)。
这个入口是`<service-name>.<namespace-name>.svc.cluster.local`的形式，这意味着如果一个容器仅使用`<service-name>`，它将使用本地的命名空间解析这个服务。
这对于使用相同的配置跨越多个命名空间是很有用的，比如开发，迭代和生产命名空间。如果你想要达到跨越命名空间的目的，你需要使用完整的域名（FQDN）。

<!--
## Design

Details of the design of namespaces in Kubernetes, including a [detailed example](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#example-openshift-origin-managing-a-kubernetes-namespace)
can be found in the [namespaces design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md)
-->
## 设计

在Kubernetes中命名空间的详细设计，包括[详细示例](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#example-openshift-origin-managing-a-kubernetes-namespace)可以在[命名空间设计文档](https://git.k8s.io/community/contributors/design-proposals/namespaces.md)中找到。
