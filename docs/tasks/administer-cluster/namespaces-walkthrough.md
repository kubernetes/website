<!--
---
assignees:
- derekwaynecarr
- janetkuo
title: Namespaces Walkthrough
redirect_from:
- "/docs/admin/namespaces/walkthrough/"
- "/docs/admin/namespaces/walkthrough.html"
---
-->
---
assignees:
- derekwaynecarr
- janetkuo
title: 演示命名空间  
redirect_from:
- "/docs/admin/namespaces/walkthrough/"
- "/docs/admin/namespaces/walkthrough.html"
---

<!--
Kubernetes _namespaces_ help different projects, teams, or customers to share a Kubernetes cluster.

It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster.

Use of multiple namespaces is optional.

This example demonstrates how to use Kubernetes namespaces to subdivide your cluster.
-->
Kubernetes命名空间帮助不同的项目，团队或者客户来共享一个Kubernetes集群。

它通过提供以下内容来实现：

1. [命名](/docs/concepts/overview/working-with-objects/names/)范围。
2. 将授权和策略附加到集群子集的机制。	

多个命名空间的使用是可选的。

这个例子演示了如何使用Kubernetes命名空间来细分你的集群。

<!--
### Step Zero: Prerequisites

This example assumes the following:

1. You have an [existing Kubernetes cluster](/docs/getting-started-guides/).
2. You have a basic understanding of Kubernetes _[Pods](/docs/concepts/workloads/pods/pod/)_, _[Services](/docs/concepts/services-networking/service/)_, and _[Deployments](/docs/concepts/workloads/controllers/deployment/)_.
-->
### 步骤零：前提

这个例子假定如下：

1. 你已经有了一个[已存在的Kubernetes集群](/docs/getting-started-guides/)。
2. 你已经对Kubernetes的_[Pods](/docs/concepts/workloads/pods/pod/)_, _[Services](/docs/concepts/services-networking/service/)_和_[Deployments](/docs/concepts/workloads/controllers/deployment/)_有了一个基本的了解。

<!--
### Step One: Understand the default namespace

By default, a Kubernetes cluster will instantiate a default namespace when provisioning the cluster to hold the default set of Pods,
Services, and Deployments used by the cluster.

Assuming you have a fresh cluster, you can introspect the available namespace's by doing the following:
-->
### 步骤一：理解默认的命名空间

默认情况下，当配置集群保存集群默认的Pods集合，服务，和部署时，Kubernetes集群将会实例化一个默认的命名空间。

假设你有一个新的集群，你可以通过以下方式

```shell
$ kubectl get namespaces
NAME      STATUS    AGE
default   Active    13m
```

<!--
### Step Two: Create new namespaces

For this exercise, we will create two additional Kubernetes namespaces to hold our content.

Let's imagine a scenario where an organization is using a shared Kubernetes cluster for development and production use cases.
-->
### 步骤二：创建新的命名空间

对于这次练习，我们将创建两个额外的Kubernetes命名空间来保存我们的内容。

让我们想象一个场景：一个机构正在使用一个共享的Kubernetes集群来开发和生产使用示例。

<!--
The development team would like to maintain a space in the cluster where they can get a view on the list of Pods, Services, and Deployments
they use to build and run their application.  In this space, Kubernetes resources come and go, and the restrictions on who can or cannot modify resources
are relaxed to enable agile development.

The operations team would like to maintain a space in the cluster where they can enforce strict procedures on who can or cannot manipulate the set of
Pods, Services, and Deployments that run the production site.
-->
开发团队想要在这个集群中管理一块空间，用来查看他们用于构建和运行他们应用程序的Pods, Services和Deployments列表。

运营团队想在这个集群中保留一块空间，在那里他们可以强制执行严格的程序让谁能或者不能在生产站点操作这一套Pods, Services, 和 Deployments。

<!--
One pattern this organization could follow is to partition the Kubernetes cluster into two namespaces: development and production.

Let's create two new namespaces to hold our work.
-->
该机构可以遵循的一个模式是将Kubernetes集群分为两个命名空间：开发和生产。

让我们创建两个新的命名空间来保持我们的工作。

<!--
Use the file [`namespace-dev.json`](/docs/admin/namespaces/namespace-dev.json) which describes a development namespace:

{% include code.html language="json" file="namespace-dev.json" ghlink="/docs/tasks/administer-cluster/namespace-dev.json" %}

Create the development namespace using kubectl.
-->
使用描述开发命名空间的文件[`namespace-dev.json`](/docs/admin/namespaces/namespace-dev.json)

使用kubectl创建这个开发命名空间。  
```shell
$ kubectl create -f docs/admin/namespaces/namespace-dev.json
```

<!--
And then let's create the production namespace using kubectl.
-->
然后，让我们使用kubectl创建这个生产命名空间。  
```shell
$ kubectl create -f docs/admin/namespaces/namespace-prod.json
```

<!--
To be sure things are right, let's list all of the namespaces in our cluster.
-->
为了确保进行顺利，让我们列出我们集群的所有命名空间。  
```shell
$ kubectl get namespaces --show-labels
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

<!--
### Step Three: Create pods in each namespace

A Kubernetes namespace provides the scope for Pods, Services, and Deployments in the cluster.

Users interacting with one namespace do not see the content in another namespace.

To demonstrate this, let's spin up a simple Deployment and Pods in the development namespace.

We first check what is the current context:
-->
### 步骤三：在每个命名空间中创建Pods

Kubernetes命名空间为集群中的Pods，Services和Deployments提供了适用范围。

在与一个命名空间交互的用户看不到另一个命名空间中的内容。

为了证明这一点，让我们在这个开发命名空间中启动一个简单的Deployment和Pods。

我们首先检查当前的上下文内容：  
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

<!--
The next step is to define a context for the kubectl client to work in each namespace. The value of "cluster" and "user" fields are copied from the current context.
-->
下一步是为kubectl客户端定义在每个命名空间工作的上下文。“集群”和“用户”域的值是从当前上下文拷贝过来的。  
```shell
$ kubectl config set-context dev --namespace=development --cluster=lithe-cocoa-92103_kubernetes --user=lithe-cocoa-92103_kubernetes
$ kubectl config set-context prod --namespace=production --cluster=lithe-cocoa-92103_kubernetes --user=lithe-cocoa-92103_kubernetes
```
<!--
The above commands provided two request contexts you can alternate against depending on what namespace you
wish to work against.

Let's switch to operate in the development namespace.
-->
上面的命令提供了两个请求上下文，你可以选取其中一个这取决于你想要工作在哪个命名空间。

让我们切换到开发命名空间去操作。
```shell
$ kubectl config use-context dev
```

<!--
You can verify your current context by doing the following:
-->
你可以通过以下操作来验证你当前的上下文：

```shell
$ kubectl config current-context
dev
```

<!--
At this point, all requests we make to the Kubernetes cluster from the command line are scoped to the development namespace.

Let's create some contents.
-->
此刻，我们从命令行向Kubernetes集群发出的所有请求被限制在开发命名空间中。

让我们创建一些内容。

```shell
$ kubectl run snowflake --image=kubernetes/serve_hostname --replicas=2
```

<!--
We have just created a deployment whose replica size is 2 that is running the pod called snowflake with a basic container that just serves the hostname. 
Note that `kubectl run` creates deployments only on Kubernetes cluster >= v1.2. If you are running older versions, it creates replication controllers instead.
If you want to obtain the old behavior, use `--generator=run/v1` to create replication controllers. See [`kubectl run`](/docs/user-guide/kubectl/v1.6/#run) for more details. 
-->
我们刚刚创建了一个部署，它的副本数量是2，名称是snowflake，运行的Pod中含有仅提供主机名称的一个基本容器。
注意只有当Kubernetes集群版本大于等于v1.2时，`kubectl run`才能创建部署。如果你运行的是老版本，它则会创建rc。
如果你想要沿袭就的行为，使用`--generator=run/v1`来创建rc。更多细节请参考[`kubectl run`](/docs/user-guide/kubectl/v1.6/#run)。

```shell
$ kubectl get deployment
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
snowflake   2         2         2            2           2m

$ kubectl get pods -l run=snowflake
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

<!--
And this is great, developers are able to do what they want, and they do not have to worry about affecting content in the production namespace.

Let's switch to the production namespace and show how resources in one namespace are hidden from the other.
-->
这是很棒的功能，开发人员能够做他们想要的，他们不必担心影响生产命名空间中的内容。

让我们切换到生产命名空间，并展示在一个命名空间中的资源是如何在另一个命名空间中隐藏的。

```shell
$ kubectl config use-context prod
```

<!--
The production namespace should be empty, and the following commands should return nothing.
-->
生产命名空间应该是空的，下面的命令什么也没有返回。

```shell
$ kubectl get deployment
$ kubectl get pods
```

<!--
Production likes to run cattle, so let's create some cattle pods.
-->
生产命名空间想要运行cattle, 所以让我们创建一些cattle pods。

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

<!--
At this point, it should be clear that the resources users create in one namespace are hidden from the other namespace.

As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace.
-->
此刻，这应该清晰明了了，用户在一个命名空间中创建的资源在另一个命名空间中不可见。

随着Kubernetes的政策支持不断发展，我们将扩展这种场景来展示你如何为每个命名空间提供不同的
授权规则。
