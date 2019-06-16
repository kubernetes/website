---
reviewers:
- derekwaynecarr
- janetkuo
title: 通过命名空间共享集群
content_template: templates/task
---
<!-- 
---
reviewers:
- derekwaynecarr
- janetkuo
title: Share a Cluster with Namespaces
content_template: templates/task
---
-->

{{% capture overview %}}
<!-- This page shows how to view, work in, and delete namespaces. The page also shows how to use Kubernetes namespaces to subdivide your cluster. -->

本页展示了如何查看、使用和删除命名空间。

{{% /capture %}}

{{% capture prerequisites %}}
<!-- * Have an [existing Kubernetes cluster](/docs/setup/).
* Have a basic understanding of Kubernetes _[Pods](/docs/concepts/workloads/pods/pod/)_, _[Services](/docs/concepts/services-networking/service/)_, and _[Deployments](/docs/concepts/workloads/controllers/deployment/)_. -->

* 您已拥有一个 [配置好的 Kubernetes 集群](/docs/setup/)。
* 您已对 Kubernetes 的 _[Pods](/docs/concepts/workloads/pods/pod/)_, _[Services](/docs/concepts/services-networking/service/)_, 和 _[Deployments](/docs/concepts/workloads/controllers/deployment/)_ 有基本理解。

{{% /capture %}}

{{% capture steps %}}

<!-- ## Viewing namespaces -->

## 查看命名空间

<!-- 1. List the current namespaces in a cluster using: -->

1. 列出集群中现有的命名空间:

```shell
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

<!-- Kubernetes starts with three initial namespaces: -->

初始状态下，Kubernetes 具有三个名字空间：

<!--    * `default` The default namespace for objects with no other namespace
   * `kube-system` The namespace for objects created by the Kubernetes system
   * `kube-public` This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement. -->

   * `default` 无命名空间对象的默认命名空间
   * `kube-system` 由 Kubernetes 系统创建的对象的命名空间
   * `kube-public` 自动创建且被所有用户可读的命名空间（包括未经身份认证的）。此命名空间通常在某些资源在整个集群中可见且可公开读取时被集群使用。此命名空间的公共方面只是一个约定，而不是一个必要条件。

<!-- You can also get the summary of a specific namespace using: -->

您还可以通过下列命令获取特定命名空间的摘要：

```shell
$ kubectl get namespaces <name>
```

<!-- Or you can get detailed information with: -->

或获取详细信息：

```shell
$ kubectl describe namespaces <name>
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

<!-- Note that these details show both resource quota (if present) as well as resource limit ranges. -->

请注意，这些详情同时显示了资源配额（如果存在）以及资源限制区间。

<!-- Resource quota tracks aggregate usage of resources in the *Namespace* and allows cluster operators
to define *Hard* resource usage limits that a *Namespace* may consume. -->

资源配额跟踪并聚合 *Namespace* 中资源的使用情况，并允许集群运营者定义 *Namespace* 可能消耗的 *Hard* 资源使用限制。

<!-- A limit range defines min/max constraints on the amount of resources a single entity can consume in
a *Namespace*.

See [Admission control: Limit Range](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) -->

限制区间定义了单个实体在一个 *Namespace* 中可使用的最小/最大资源量约束。

参阅 [准入控制: 限制区间](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)

<!-- A namespace can be in one of two phases:

   * `Active` the namespace is in use
   * `Terminating` the namespace is being deleted, and can not be used for new objects

See the [design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) for more details. -->

命名空间可以处于下列两个阶段中的一个:

   * `Active` 命名空间使用中
   * `Terminating` 命名空间正在被删除，且不能被用于新对象。

参见 [设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) 查看更多细节。

<!-- ## Creating a new namespace -->

## 创建命名空间

<!-- 1. Create a new YAML file called `my-namespace.yaml` with the contents: -->

1. 新建一个名为 `my-namespace.yaml` 的 YAML 文件，并写入下列内容：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <insert-namespace-name-here>
```

<!-- Then run: -->

然后运行：

```shell
$ kubectl create -f ./my-namespace.yaml
```

<!-- Note that the name of your namespace must be a DNS compatible label. -->

请注意，命名空间的名称必须是 DNS 兼容的标签。

<!-- There's an optional field `finalizers`, which allows observables to purge resources whenever the namespace is deleted. Keep in mind that if you specify a nonexistent finalizer, the namespace will be created but will get stuck in the `Terminating` state if the user tries to delete it. 

More information on `finalizers` can be found in the namespace [design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers).-->

可选字段 `finalizers` 允许观察者们在命名空间被删除时清除资源。记住如果指定了一个不存在的终结器，命名空间仍会被创建，但如果用户试图删除它，它将陷入 `Terminating` 状态。

 更多有关 `finalizers` 的信息请查阅 [设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers) 中命名空间部分。

<!-- ## Deleting a namespace -->

## 删除命名空间

<!-- 1. Delete a namespace with -->

1. 删除命名空间使用命令

```shell
$ kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
<!-- This deletes _everything_ under the namespace! -->
这会删除命名空间下的 _所有内容_ ！
{{< /warning >}}

<!-- This delete is asynchronous, so for a time you will see the namespace in the `Terminating` state. -->

删除是异步的,所以有一段时间你会看到命名空间处于 `Terminating` 状态。

<!-- ## Subdividing your cluster using Kubernetes namespaces -->

## 使用Kubernetes命名空间细分您的集群

<!-- 1. Understand the default namespace

By default, a Kubernetes cluster will instantiate a default namespace when provisioning the cluster to hold the default set of Pods,
Services, and Deployments used by the cluster. -->

1. 理解默认命名空间

默认情况下，Kubernetes 集群会在配置集群时实例化一个默认命名空间，用以存放集群所使用的默认 Pods、Services 和 Deployments 集合。

<!-- Assuming you have a fresh cluster, you can introspect the available namespace's by doing the following: -->

假设您有一个新的集群，您可以通过执行以下操作来内省可用的命名空间

```shell
$ kubectl get namespaces
NAME      STATUS    AGE
default   Active    13m
```

<!-- 2. Create new namespaces -->

2. 创建新的命名空间

<!-- For this exercise, we will create two additional Kubernetes namespaces to hold our content. -->

在本练习中，我们将创建两个额外的Kubernetes命名空间来保存我们的内容。

<!-- In a scenario where an organization is using a shared Kubernetes cluster for development and production use cases: -->

在某组织使用共享的 Kubernetes 集群进行开发和生产的场景中：

<!-- The development team would like to maintain a space in the cluster where they can get a view on the list of Pods, Services, and Deployments
they use to build and run their application.  In this space, Kubernetes resources come and go, and the restrictions on who can or cannot modify resources
are relaxed to enable agile development. -->

开发团队希望在集群中维护一个空间，以便他们可以查看用于构建和运行其应用程序的 Pods、Services 和 Deployments 列表。在这个空间里，Kubernetes 资源被自由地加入或移除，对谁能够或不能修改资源的限制被放宽，以实现敏捷开发。

<!-- The operations team would like to maintain a space in the cluster where they can enforce strict procedures on who can or cannot manipulate the set of
Pods, Services, and Deployments that run the production site. -->

运维团队希望在集群中维护一个空间，以便他们可以强制实施一些严格的规程，对谁可以或不可以操作运行生产站点的 Pods、Services 和 Deployments 集合进行控制。

<!-- One pattern this organization could follow is to partition the Kubernetes cluster into two namespaces: development and production. -->

该组织可以遵循的一种模式是将 Kubernetes 集群划分为两个命名空间：development 和 production。

<!-- Let's create two new namespaces to hold our work. -->

让我们创建两个新的命名空间来保存我们的工作。

<!-- Use the file [`namespace-dev.json`](/examples/admin/namespace-dev.json) which describes a development namespace: -->

文件 [`namespace-dev.json`](/examples/admin/namespace-dev.json) 描述了 development 命名空间:

{{< codenew language="json" file="admin/namespace-dev.json" >}}

<!-- Create the development namespace using kubectl. -->

使用 kubectl 创建 development 命名空间。

```shell
$ kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
```

<!-- And then let's create the production namespace using kubectl. -->

让我们使用 kubectl 创建 production 命名空间。

```shell
$ kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
```

<!-- To be sure things are right, list all of the namespaces in our cluster. -->

为了确保一切正常，列出集群中的所有命名空间。

```shell
$ kubectl get namespaces --show-labels
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

<!-- 3. Create pods in each namespace -->

3. 在每个命名空间中创建 pod

<!-- A Kubernetes namespace provides the scope for Pods, Services, and Deployments in the cluster. 

Users interacting with one namespace do not see the content in another namespace.-->

Kubernetes 命名空间为集群中的 Pods、Services 和 Deployments 提供了作用域。

与一个命名空间交互的用户不会看到另一个命名空间中的内容。

<!-- To demonstrate this, let's spin up a simple Deployment and Pods in the development namespace. -->

为了演示这一点，让我们在 development 命名空间中启动一个简单的 Deployment 和 Pod。

<!-- We first check what is the current context: -->

我们首先检查一下当前的上下文：

```shell
$ kubectl config view
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://130.211.122.180
  name: lithe-cocoa-92103_kubernetes
contexts:
- context:
    cluster: lithe-cocoa-92103_kubernetes
    user: lithe-cocoa-92103_kubernetes
  name: lithe-cocoa-92103_kubernetes
current-context: lithe-cocoa-92103_kubernetes
kind: Config
preferences: {}
users:
- name: lithe-cocoa-92103_kubernetes
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
    token: 65rZW78y8HbwXXtSXuUw9DbP4FLjHi4b
- name: lithe-cocoa-92103_kubernetes-basic-auth
  user:
    password: h5M0FtUUIflBSdI7
    username: admin

$ kubectl config current-context
lithe-cocoa-92103_kubernetes
```

<!-- The next step is to define a context for the kubectl client to work in each namespace. The values of "cluster" and "user" fields are copied from the current context. -->

下一步是为 kubectl 客户端定义一个上下文，以便在每个命名空间中工作。"cluster" 和 "user" 字段的值将从当前上下文中复制。

```shell
$ kubectl config set-context dev --namespace=development --cluster=lithe-cocoa-92103_kubernetes --user=lithe-cocoa-92103_kubernetes
$ kubectl config set-context prod --namespace=production --cluster=lithe-cocoa-92103_kubernetes --user=lithe-cocoa-92103_kubernetes
```

<!-- The above commands provided two request contexts you can alternate against depending on what namespace you
wish to work against. -->

上述命令提供了两个可以替代的请求上下文，具体取决于您希望使用的命名空间。

<!-- Let's switch to operate in the development namespace. -->

让我们切换到 development 命名空间进行操作。

```shell
$ kubectl config use-context dev
```

<!-- You can verify your current context by doing the following: -->

您可以使用下列命令验证当前上下文：

```shell
$ kubectl config current-context
dev
```

<!-- At this point, all requests we make to the Kubernetes cluster from the command line are scoped to the development namespace. -->

此时，我们从命令行向 Kubernetes 集群发出的所有请求都限定在 development 命名空间中。

<!-- Let's create some contents. -->

让我们创建一些内容。

```shell
$ kubectl run snowflake --image=kubernetes/serve_hostname --replicas=2
```
<!-- We have just created a deployment whose replica size is 2 that is running the pod called snowflake with a basic container that just serves the hostname.
Note that `kubectl run` creates deployments only on Kubernetes cluster >= v1.2. If you are running older versions, it creates replication controllers instead.
If you want to obtain the old behavior, use `--generator=run/v1` to create replication controllers. See [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) for more details. -->

我们刚刚创建了一个副本大小为2的 deployment，该 deployment 运行名为 snowflake 的 pod，其中包含一个仅提供主机名服务的基本容器。请注意，`kubectl run` 仅在 Kubernetes 集群版本 >= v1.2 时创建 deployment。如果您运行在旧版本上，则会创建 replication controllers。如果期望执行旧版本的行为，请使用 `--generator=run/v1` 创建 replication controllers。 参见 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) 获取更多细节。

```shell
$ kubectl get deployment
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
snowflake   2         2         2            2           2m

$ kubectl get pods -l run=snowflake
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

<!-- And this is great, developers are able to do what they want, and they do not have to worry about affecting content in the production namespace. -->

这很棒，开发人员可以做他们想要的事情，而不必担心影响 production 命名空间中的内容。

<!-- Let's switch to the production namespace and show how resources in one namespace are hidden from the other. -->

让我们切换到 production 命名空间，展示一个命名空间中的资源如何对另一个命名空间不可见。

```shell
$ kubectl config use-context prod
```

<!-- The production namespace should be empty, and the following commands should return nothing. -->

production 命名空间应该是空的，下列命令应该返回的内容为空。

```shell
$ kubectl get deployment
$ kubectl get pods
```

<!-- Production likes to run cattle, so let's create some cattle pods. -->

生产环境需要运行 cattle，让我们创建一些名为 cattle 的 pods。

```shell
$ kubectl run cattle --image=kubernetes/serve_hostname --replicas=5

$ kubectl get deployment
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
cattle    5         5         5            5           10s

kubectl get pods -l run=cattle
NAME                      READY     STATUS    RESTARTS   AGE
cattle-2263376956-41xy6   1/1       Running   0          34s
cattle-2263376956-kw466   1/1       Running   0          34s
cattle-2263376956-n4v97   1/1       Running   0          34s
cattle-2263376956-p5p3i   1/1       Running   0          34s
cattle-2263376956-sxpth   1/1       Running   0          34s
```

<!-- At this point, it should be clear that the resources users create in one namespace are hidden from the other namespace. -->

此时，应该很清楚的展示了用户在一个命名空间中创建的资源对另一个命名空间是隐藏的。

<!-- As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace. -->

随着 Kubernetes 中的策略支持的发展，我们将扩展此场景，以展示如何为每个命名空间提供不同的授权规则。

{{% /capture %}}

{{% capture discussion %}}

<!-- ## Understanding the motivation for using namespaces -->

## 理解使用命名空间的动机

<!-- A single cluster should be able to satisfy the needs of multiple users or groups of users (henceforth a 'user community'). -->

单个集群应该能满足多个用户及用户组的需求（以下称为 “用户社区”）。

<!-- Kubernetes _namespaces_ help different projects, teams, or customers to share a Kubernetes cluster. -->

Kubernetes _命名空间_ 帮助不同的项目、团队或客户去共享 Kubernetes 集群。

<!-- It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster. -->

名字空间通过以下方式实现这点：

1. 为[名字](/docs/concepts/overview/working-with-objects/names/) 设置作用域.
2. 为集群中的部分资源关联鉴权和策略的机制。

<!-- Use of multiple namespaces is optional. -->

使用多个命名空间是可选的。

<!-- Each user community wants to be able to work in isolation from other communities. -->

每个用户社区都希望能够与其他社区隔离开展工作。

<!-- Each user community has its own:

1. resources (pods, services, replication controllers, etc.)
2. policies (who can or cannot perform actions in their community)
3. constraints (this community is allowed this much quota, etc.) -->

每个用户社区都有:

1. 资源（pods, services, replication controllers, 等等）
2. 策略（谁能或不能在他们的社区里执行操作）
3. 约束（该社区允许多少配额，等等）

<!-- A cluster operator may create a Namespace for each unique user community. -->

集群运营者可以为每个唯一用户社区创建命名空间。

<!-- The Namespace provides a unique scope for:

1. named resources (to avoid basic naming collisions)
2. delegated management authority to trusted users
3. ability to limit community resource consumption -->

命名空间为下列内容提供唯一的作用域：

1. 命名资源（避免基本的命名冲突）
2. 将管理权限委派给可信用户
3. 限制社区资源消耗的能力

<!-- Use cases include:

1.  As a cluster operator, I want to support multiple user communities on a single cluster.
2.  As a cluster operator, I want to delegate authority to partitions of the cluster to trusted users
    in those communities.
3.  As a cluster operator, I want to limit the amount of resources each community can consume in order
    to limit the impact to other communities using the cluster.
4.  As a cluster user, I want to interact with resources that are pertinent to my user community in
    isolation of what other user communities are doing on the cluster. -->

用例包括:

1.  作为集群运营者, 我希望能在单个集群上支持多个用户社区。
2.  作为集群运营者，我希望将集群分区的权限委派给这些社区中的受信任用户。
3.  作为集群运营者，我希望能限定每个用户社区可使用的资源量，以限制对使用同一集群的其他用户社区的影响。
4.  作为群集用户，我希望与我的用户社区相关的资源进行交互，而与其他用户社区在该集群上执行的操作无关。

<!-- ## Understanding namespaces and DNS -->

## 理解命名空间和 DNS

<!-- When you create a [Service](/docs/concepts/services-networking/service/), it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN). -->

当您创建 [Service](/docs/concepts/services-networking/service/) 时，它会创建相应的 [DNS 条目](/docs/concepts/services-networking/dns-pod-service/)。此条目的格式为`<service-name>。<namespace-name> .svc.cluster.local`，这意味着如果容器只使用`<service-name>`，它将解析为本地服务到命名空间。 这对于在多个命名空间（如开发，暂存和生产）中使用相同的配置非常有用。 如果要跨命名空间访问，则需要使用完全限定的域名（FQDN）。

{{% /capture %}}

{{% capture whatsnext %}}
<!-- * Learn more about [setting the namespace preference](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Learn more about [setting the namespace for a request](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* See [namespaces design](https://github.com/kubernetes/community/blob/{{< param "githubbranch">}}/contributors/design-proposals/architecture/namespaces.md). -->
* 了解更多 [设置命名空间首选项](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference) 的内容。
* 了解更多 [设置请求的命名空间](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request) 的内容。
* 参见 [命名空间设计](https://github.com/kubernetes/community/blob/{{< param "githubbranch">}}/contributors/design-proposals/architecture/namespaces.md)。
{{% /capture %}}


