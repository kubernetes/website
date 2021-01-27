---
title: 通过名字空间共享集群
content_type: task
---
<!--
reviewers:
- derekwaynecarr
- janetkuo
title: Share a Cluster with Namespaces
content_type: task
-->

<!-- overview -->
<!--
This page shows how to view, work in, and delete {{< glossary_tooltip text="namespaces" term_id="namespace" >}}. The page also shows how to use Kubernetes namespaces to subdivide your cluster.
-->
本页展示如何查看、使用和删除{{< glossary_tooltip text="名字空间" term_id="namespace" >}}。
本页同时展示如何使用 Kubernetes 名字空间来划分集群。

## {{% heading "prerequisites" %}}

<!--
* Have an [existing Kubernetes cluster](/docs/setup/).
* You have a basic understanding of Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}}, {{< glossary_tooltip term_id="service" text="Services" >}}, and {{< glossary_tooltip text="Deployments" term_id="deployment" >}}.
-->
* 你已拥有一个[配置好的 Kubernetes 集群](/zh/docs/setup/)。
* 你已对 Kubernetes 的 {{< glossary_tooltip text="Pods" term_id="pod" >}} , 
  {{< glossary_tooltip term_id="service" text="Services" >}} , 和
  {{< glossary_tooltip text="Deployments" term_id="deployment" >}} 有基本理解。

<!-- steps -->

<!-- ## Viewing namespaces -->
## 查看名字空间

<!-- 1. List the current namespaces in a cluster using: -->
1. 列出集群中现有的名字空间：

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

<!-- Kubernetes starts with three initial namespaces: -->
初始状态下，Kubernetes 具有三个名字空间：

<!--
* `default` The default namespace for objects with no other namespace
* `kube-system` The namespace for objects created by the Kubernetes system
* `kube-public` This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement. -->

* `default` 无名字空间对象的默认名字空间
* `kube-system` 由 Kubernetes 系统创建的对象的名字空间
* `kube-public` 自动创建且被所有用户可读的名字空间（包括未经身份认证的）。此名字空间通常在某些资源在整个集群中可见且可公开读取时被集群使用。此名字空间的公共方面只是一个约定，而不是一个必要条件。

<!-- You can also get the summary of a specific namespace using: -->
你还可以通过下列命令获取特定名字空间的摘要：

```shell
kubectl get namespaces <name>
```

<!-- Or you can get detailed information with: -->
或用下面的命令获取详细信息：

```shell
kubectl describe namespaces <name>
```

```
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

<!--
A namespace can be in one of two phases:

* `Active` the namespace is in use
* `Terminating` the namespace is being deleted, and can not be used for new objects

See the [design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) for more details. -->

名字空间可以处于下列两个阶段中的一个:

* `Active` 名字空间正在被使用中
* `Terminating` 名字空间正在被删除，且不能被用于新对象。

参见[设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) 查看更多细节。

<!-- ## Creating a new namespace -->
## 创建名字空间

<!--
Avoid creating namespace with prefix `kube-`, since it is reserved for Kubernetes system namespaces.
-->
{{< note >}}
避免使用前缀 `kube-` 创建名字空间，因为它是为 Kubernetes 系统名字空间保留的。
{{< /note >}}

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
   kubectl create -f ./my-namespace.yaml
   ```

<!--
2. Alternatively, you can create namespace using below command:
-->
2. 或者，你可以使用下面的命令创建名字空间：

   ```
   kubectl create namespace <insert-namespace-name-here>
   ```

<!--
The name of your namespace must be a valid
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
-->
请注意，名字空间的名称必须是一个合法的
[DNS 标签](/zh/docs/concepts/overview/working-with-objects/names#dns-label-names)。

<!--
There's an optional field `finalizers`, which allows observables to purge resources whenever the namespace is deleted. Keep in mind that if you specify a nonexistent finalizer, the namespace will be created but will get stuck in the `Terminating` state if the user tries to delete it.

More information on `finalizers` can be found in the namespace [design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers).
-->
可选字段 `finalizers` 允许观察者们在名字空间被删除时清除资源。记住如果指定了一个不存在的终结器，名字空间仍会被创建，但如果用户试图删除它，它将陷入 `Terminating` 状态。

更多有关 `finalizers` 的信息请查阅 [设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers) 中名字空间部分。

<!-- ## Deleting a namespace -->
## 删除名字空间

<!--
Delete a namespace with
-->
删除名字空间使用命令：

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

<!-- This deletes _everything_ under the namespace! -->
{{< warning >}}
这会删除名字空间下的 _所有内容_ ！
{{< /warning >}}

<!-- This delete is asynchronous, so for a time you will see the namespace in the `Terminating` state. -->
删除是异步的，所以有一段时间你会看到名字空间处于 `Terminating` 状态。

<!--
## Subdividing your cluster using Kubernetes namespaces
-->
## 使用 Kubernetes 名字空间细分你的集群

<!--
1. Understand the default namespace

   By default, a Kubernetes cluster will instantiate a default namespace when provisioning
   the cluster to hold the default set of Pods, Services, and Deployments used by the cluster.
-->

1. 理解 default 名字空间

   默认情况下，Kubernetes 集群会在配置集群时实例化一个 default 名字空间，用以存放集群所使用的默认
   Pods、Services 和 Deployments 集合。

   <!--
   Assuming you have a fresh cluster, you can introspect the available namespace's by doing the following:
   -->

   假设你有一个新的集群，你可以通过执行以下操作来内省可用的名字空间

   ```shell
   kubectl get namespaces
   ```
   ```
   NAME      STATUS    AGE
   default   Active    13m
   ```

<!--
2. Create new namespaces
-->
2. 创建新的名字空间

   <!--
   For this exercise, we will create two additional Kubernetes namespaces to hold our content.
   -->
   在本练习中，我们将创建两个额外的 Kubernetes 名字空间来保存我们的内容。

   <!--
   In a scenario where an organization is using a shared Kubernetes cluster for development and
   production use cases:
   -->
   在某组织使用共享的 Kubernetes 集群进行开发和生产的场景中：

   <!--
   The development team would like to maintain a space in the cluster where they can
   get a view on the list of Pods, Services, and Deployments
   they use to build and run their application.  In this space, Kubernetes resources come
   and go, and the restrictions on who can or cannot modify resources
   are relaxed to enable agile development.
   -->
   开发团队希望在集群中维护一个空间，以便他们可以查看用于构建和运行其应用程序的 Pods、Services
   和 Deployments 列表。在这个空间里，Kubernetes 资源被自由地加入或移除，
   对谁能够或不能修改资源的限制被放宽，以实现敏捷开发。
   
   <!--
   The operations team would like to maintain a space in the cluster where they can enforce
   strict procedures on who can or cannot manipulate the set of
   Pods, Services, and Deployments that run the production site.
   -->
   运维团队希望在集群中维护一个空间，以便他们可以强制实施一些严格的规程，
   对谁可以或不可以操作运行生产站点的 Pods、Services 和 Deployments 集合进行控制。
   
   <!--
   One pattern this organization could follow is to partition the Kubernetes cluster into
   two namespaces: `development` and `production`.
   -->
   该组织可以遵循的一种模式是将 Kubernetes 集群划分为两个名字空间：development 和 production。
   
   <!-- Let's create two new namespaces to hold our work. -->
   让我们创建两个新的名字空间来保存我们的工作。
   
   <!-- Create the `development` namespace using kubectl. -->
   使用 kubectl 创建 `development` 名字空间。
   
   ```shell
   kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
   ```

   <!-- And then let's create the `production` namespace using kubectl. -->
   让我们使用 kubectl 创建 `production` 名字空间。

   ```shell
   kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
   ```

   <!-- To be sure things are right, list all of the namespaces in our cluster. -->
   为了确保一切正常，列出集群中的所有名字空间。

   ```shell
   kubectl get namespaces --show-labels
   ```
   ```
   NAME          STATUS    AGE       LABELS
   default       Active    32m       <none>
   development   Active    29s       name=development
   production    Active    23s       name=production
   ```

<!-- 3. Create pods in each namespace -->
3. 在每个名字空间中创建 pod

   <!--
   A Kubernetes namespace provides the scope for Pods, Services, and Deployments in the cluster.

   Users interacting with one namespace do not see the content in another namespace.
   -->
   Kubernetes 名字空间为集群中的 Pods、Services 和 Deployments 提供了作用域。
   
   与一个名字空间交互的用户不会看到另一个名字空间中的内容。
   
   <!-- To demonstrate this, let's spin up a simple Deployment and Pods in the `development` namespace. -->
   为了演示这一点，让我们在 `development` 名字空间中启动一个简单的 Deployment 和 Pod。

   ```shell
   kubectl create deployment snowflake --image=k8s.gcr.io/serve_hostname -n=development
   kubectl scale deployment snowflake --replicas=2 -n=development
   ```

   <!--
   We have just created a deployment whose replica size is 2 that is running the pod
   called `snowflake` with a basic container that just serves the hostname.
   -->
   我们刚刚创建了一个副本个数为 2 的 Deployment，运行名为 `snowflake` 的
   Pod，其中包含一个仅负责提供主机名的基本容器。

   ```shell
   kubectl get deployment -n=development
   ```
   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   snowflake    2/2     2            2           2m
   ```
   ```shell
   kubectl get pods -l app=snowflake -n=development
   ```
   ```
   NAME                         READY     STATUS    RESTARTS   AGE
   snowflake-3968820950-9dgr8   1/1       Running   0          2m
   snowflake-3968820950-vgc4n   1/1       Running   0          2m
   ```

   <!--
   And this is great, developers are able to do what they want, and they do not have to worry about affecting content in the `production` namespace.

   Let's switch to the `production` namespace and show how resources in one namespace are hidden from the other.

   The `production` namespace should be empty, and the following commands should return nothing.
   -->
   看起来还不错，开发人员能够做他们想做的事，而且他们不必担心会影响到
   `production` 名字空间下面的内容。

   让我们切换到 `production` 名字空间，展示一下一个名字空间中的资源是如何对
   另一个名字空间隐藏的。

   名字空间 `production` 应该是空的，下面的命令应该不会返回任何东西。

   ```shell
   kubectl get deployment -n=production
   kubectl get pods -n=production
   ```

   <!--
   Production likes to run cattle, so let's create some cattle pods.
   -->
   生产环境下一般以养牛的方式运行负载，所以让我们创建一些 Cattle（牛）Pod。

   ```shell
   kubectl create deployment cattle --image=k8s.gcr.io/serve_hostname -n=production
   kubectl scale deployment cattle --replicas=5 -n=production

   kubectl get deployment -n=production
   ```
   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   cattle       5/5     5            5           10s
   ```

   ```shell
   kubectl get pods -l app=cattle -n=production
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   cattle-2263376956-41xy6   1/1       Running   0          34s
   cattle-2263376956-kw466   1/1       Running   0          34s
   cattle-2263376956-n4v97   1/1       Running   0          34s
   cattle-2263376956-p5p3i   1/1       Running   0          34s
   cattle-2263376956-sxpth   1/1       Running   0          34s
   ```

<!--
At this point, it should be clear that the resources users create in one namespace are hidden from the other namespace.
-->
此时，应该很清楚的展示了用户在一个名字空间中创建的资源对另一个名字空间是隐藏的。

<!--
As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace.
-->
随着 Kubernetes 中的策略支持的发展，我们将扩展此场景，以展示如何为每个名字空间提供不同的授权规则。

<!-- discussion -->

<!--
## Understanding the motivation for using namespaces
-->
## 理解使用名字空间的动机

<!--
A single cluster should be able to satisfy the needs of multiple users or groups of users (henceforth a 'user community').
-->
单个集群应该能满足多个用户及用户组的需求（以下称为 “用户社区”）。

<!-- Kubernetes _namespaces_ help different projects, teams, or customers to share a Kubernetes cluster. -->
Kubernetes _名字空间_ 帮助不同的项目、团队或客户去共享 Kubernetes 集群。

<!--
It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster.
-->
名字空间通过以下方式实现这点：

1. 为[名字](/zh/docs/concepts/overview/working-with-objects/names/)设置作用域.
2. 为集群中的部分资源关联鉴权和策略的机制。

<!--
Use of multiple namespaces is optional.
-->
使用多个名字空间是可选的。

<!--
Each user community wants to be able to work in isolation from other communities.
-->
每个用户社区都希望能够与其他社区隔离开展工作。

<!--
Each user community has its own:

1. resources (pods, services, replication controllers, etc.)
2. policies (who can or cannot perform actions in their community)
3. constraints (this community is allowed this much quota, etc.)
-->
每个用户社区都有自己的：

1. 资源（pods、服务、 副本控制器等等）
2. 策略（谁能或不能在他们的社区里执行操作）
3. 约束（该社区允许多少配额，等等）

<!--
A cluster operator may create a Namespace for each unique user community.
-->
集群运营者可以为每个唯一用户社区创建名字空间。

<!--
The Namespace provides a unique scope for:

1. named resources (to avoid basic naming collisions)
2. delegated management authority to trusted users
3. ability to limit community resource consumption
-->
名字空间为下列内容提供唯一的作用域：

1. 命名资源（避免基本的命名冲突）
2. 将管理权限委派给可信用户
3. 限制社区资源消耗的能力

<!--
Use cases include:

1.  As a cluster operator, I want to support multiple user communities on a single cluster.
2.  As a cluster operator, I want to delegate authority to partitions of the cluster to trusted users
    in those communities.
3.  As a cluster operator, I want to limit the amount of resources each community can consume in order
    to limit the impact to other communities using the cluster.
4.  As a cluster user, I want to interact with resources that are pertinent to my user community in
    isolation of what other user communities are doing on the cluster.
-->

用例包括:
1.  作为集群运营者, 我希望能在单个集群上支持多个用户社区。
2.  作为集群运营者，我希望将集群分区的权限委派给这些社区中的受信任用户。
3.  作为集群运营者，我希望能限定每个用户社区可使用的资源量，以限制对使用同一集群的其他用户社区的影响。
4.  作为群集用户，我希望与我的用户社区相关的资源进行交互，而与其他用户社区在该集群上执行的操作无关。

<!--
## Understanding namespaces and DNS
-->
## 理解名字空间和 DNS

<!--
When you create a [Service](/docs/concepts/services-networking/service/), it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
当你创建[服务](/zh/docs/concepts/services-networking/service/)时，Kubernetes
会创建相应的 [DNS 条目](/zh/docs/concepts/services-networking/dns-pod-service/)。
此条目的格式为 `<服务名称>.<名字空间名称>.svc.cluster.local`。
这意味着如果容器只使用 `<服务名称>`，它将解析为名字空间本地的服务。
这对于在多个名字空间（如开发、暂存和生产）中使用相同的配置非常有用。
如果要跨名字空间访问，则需要使用完全限定的域名（FQDN）。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [setting the namespace preference](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Learn more about [setting the namespace for a request](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* See [namespaces design](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/architecture/namespaces.md).
-->

* 进一步了解[设置名字空间偏好](/zh/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
* 进一步了解[设置请求的名字空间](/zh/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* 参阅[名字空间的设计文档](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/architecture/namespaces.md)

