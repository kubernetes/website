---
title: 名字空间演练
content_type: task
weight: 260
---
<!--
reviewers:
- derekwaynecarr
- janetkuo
title: Namespaces Walkthrough
content_type: task
weight: 260
-->

<!-- overview -->
<!--
Kubernetes {{< glossary_tooltip text="namespaces" term_id="namespace" >}}
help different projects, teams, or customers to share a Kubernetes cluster.
-->
Kubernetes {{< glossary_tooltip text="名字空间" term_id="namespace" >}}
有助于不同的项目、团队或客户去共享 Kubernetes 集群。

<!--
It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster.
-->
名字空间通过以下方式实现这点：

1. 为[名字](/zh-cn/docs/concepts/overview/working-with-objects/names/)设置作用域.
2. 为集群中的部分资源关联鉴权和策略的机制。

<!--
Use of multiple namespaces is optional.

This example demonstrates how to use Kubernetes namespaces to subdivide your cluster.
-->
使用多个名字空间是可选的。

此示例演示了如何使用 Kubernetes 名字空间细分集群。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Prerequisites

This example assumes the following:

1. You have an [existing Kubernetes cluster](/docs/setup/).
2. You have a basic understanding of Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}},
{{< glossary_tooltip term_id="service" text="Services" >}}, and {{< glossary_tooltip text="Deployments" term_id="deployment" >}}.
-->
## 环境准备   {#prerequisites}

此示例作如下假设：

1. 你已拥有一个[配置好的 Kubernetes 集群](/zh-cn/docs/setup/)。
2. 你已对 Kubernetes 的 {{< glossary_tooltip text="Pod" term_id="pod" >}}、
   {{< glossary_tooltip text="服务" term_id="service" >}} 和
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   有基本理解。

<!--
## Understand the default namespace

By default, a Kubernetes cluster will instantiate a default namespace when provisioning the cluster to hold the default set of Pods,
Services, and Deployments used by the cluster.
-->
## 理解默认名字空间   {#understand-the-default-namespace}

默认情况下，Kubernetes 集群会在配置集群时实例化一个默认名字空间，用以存放集群所使用的默认
Pod、Service 和 Deployment 集合。

<!--
Assuming you have a fresh cluster, you can inspect the available namespaces by doing the following:
-->
假设你有一个新的集群，你可以通过执行以下操作来检查可用的名字空间：

```shell
kubectl get namespaces
```
```
NAME      STATUS    AGE
default   Active    13m
```

<!--
## Create new namespaces

For this exercise, we will create two additional Kubernetes namespaces to hold our content.
-->
## 创建新的名字空间   {#create-new-namespaces}

在本练习中，我们将创建两个额外的 Kubernetes 名字空间来保存我们的内容。

<!--
Let's imagine a scenario where an organization is using a shared Kubernetes cluster for development and production use cases.
-->
我们假设一个场景，某组织正在使用共享的 Kubernetes 集群来支持开发和生产：

<!--
The development team would like to maintain a space in the cluster where they can get a view on the list of Pods, Services, and Deployments
they use to build and run their application.  In this space, Kubernetes resources come and go, and the restrictions on who can or cannot modify resources
are relaxed to enable agile development.
-->
开发团队希望在集群中维护一个空间，以便他们可以查看用于构建和运行其应用程序的 Pod、Service
和 Deployment 列表。在这个空间里，Kubernetes 资源被自由地加入或移除，
对谁能够或不能修改资源的限制被放宽，以实现敏捷开发。

<!--
The operations team would like to maintain a space in the cluster where they can enforce strict procedures on who can or cannot manipulate the set of
Pods, Services, and Deployments that run the production site.
-->
运维团队希望在集群中维护一个空间，以便他们可以强制实施一些严格的规程，
对谁可以或谁不可以操作运行生产站点的 Pod、Service 和 Deployment 集合进行控制。

<!--
One pattern this organization could follow is to partition the Kubernetes cluster into two namespaces: `development` and `production`.
-->
该组织可以遵循的一种模式是将 Kubernetes 集群划分为两个名字空间：`development` 和 `production`。

<!--
Let's create two new namespaces to hold our work.
-->
让我们创建两个新的名字空间来保存我们的工作。

<!--
Use the file [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml) which describes a `development` namespace:
-->
文件 [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml) 描述了 `development` 名字空间:

{{% code_sample language="yaml" file="admin/namespace-dev.yaml" %}}

<!--
Create the `development` namespace using kubectl.
-->

使用 kubectl 创建 `development` 名字空间。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.yaml
```

<!--
Save the following contents into file [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml) which describes a `production` namespace:
-->
将下列的内容保存到文件 [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml) 中，
这些内容是对 `production` 名字空间的描述：

{{% code_sample language="yaml" file="admin/namespace-prod.yaml" %}}

<!--
And then let's create the `production` namespace using kubectl.
-->
让我们使用 kubectl 创建 `production` 名字空间。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.yaml
```

<!--
To be sure things are right, let's list all of the namespaces in our cluster.
-->
为了确保一切正常，我们列出集群中的所有名字空间。

```shell
kubectl get namespaces --show-labels
```

```
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

<!--
## Create pods in each namespace

A Kubernetes namespace provides the scope for Pods, Services, and Deployments in the cluster.

Users interacting with one namespace do not see the content in another namespace.

To demonstrate this, let's spin up a simple Deployment and Pods in the `development` namespace.
-->
## 在每个名字空间中创建 Pod   {#create-pods-in-each-namespace}

Kubernetes 名字空间为集群中的 Pod、Service 和 Deployment 提供了作用域。

与一个名字空间交互的用户不会看到另一个名字空间中的内容。

为了演示这一点，让我们在 development 名字空间中启动一个简单的 Deployment 和 Pod。

<!--
We first check what is the current context:
-->
我们首先检查一下当前的上下文：

```shell
kubectl config view
```

```yaml
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
```

```shell
kubectl config current-context
```
```
lithe-cocoa-92103_kubernetes
```

<!--
The next step is to define a context for the kubectl client to work in each namespace.
he value of "cluster" and "user" fields are copied from the current context.
-->
下一步是为 kubectl 客户端定义一个上下文，以便在每个名字空间中工作。
"cluster" 和 "user" 字段的值将从当前上下文中复制。

```shell
kubectl config set-context dev --namespace=development \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes

kubectl config set-context prod --namespace=production \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes
```

<!--
By default, the above commands add two contexts that are saved into file
`.kube/config`. You can now view the contexts and alternate against the two
new request contexts depending on which namespace you wish to work against.
-->
默认情况下，上述命令会添加两个上下文到 `.kube/config` 文件中。
你现在可以查看上下文并根据你希望使用的名字空间并在这两个新的请求上下文之间切换。

<!--
To view the new contexts:
-->
查看新的上下文：

```shell
kubectl config view
```
```yaml
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
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: development
    user: lithe-cocoa-92103_kubernetes
  name: dev
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: production
    user: lithe-cocoa-92103_kubernetes
  name: prod
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
```

<!--
Let's switch to operate in the `development` namespace.
-->
让我们切换到 `development` 名字空间进行操作。

```shell
kubectl config use-context dev
```

<!--
You can verify your current context by doing the following:
-->
你可以使用下列命令验证当前上下文：

```shell
kubectl config current-context
```

```
dev
```

<!--
At this point, all requests we make to the Kubernetes cluster from the command line are scoped to the `development` namespace.
-->
此时，我们从命令行向 Kubernetes 集群发出的所有请求都限定在 `development` 名字空间中。

<!--
Let's create some contents.
-->
让我们创建一些内容。

{{% code_sample file="admin/snowflake-deployment.yaml" %}}

<!--
Apply the manifest to create a Deployment 
-->
应用清单文件来创建 Deployment。

```shell
kubectl apply -f https://k8s.io/examples/admin/snowflake-deployment.yaml
```

<!--
We have created a deployment whose replica size is 2 that is running the pod called
`snowflake` with a basic container that serves the hostname.
-->
我们创建了一个副本大小为 2 的 Deployment，该 Deployment 运行名为 `snowflake` 的 Pod，
其中包含一个仅提供主机名服务的基本容器。

```shell
kubectl get deployment
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
snowflake    2/2     2            2           2m
```

```shell
kubectl get pods -l app=snowflake
```
```
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

<!--
And this is great, developers are able to do what they want, and they do not have 
o worry about affecting content in the `production` namespace.
-->
这很棒，开发人员可以做他们想要的事情，而不必担心影响 `production` 名字空间中的内容。

<!--
Let's switch to the `production` namespace and show how resources in one namespace are hidden from the other.
-->
让我们切换到 `production` 名字空间，展示一个名字空间中的资源如何对另一个名字空间不可见。

```shell
kubectl config use-context prod
```

<!--
The `production` namespace should be empty, and the following commands should return nothing.
-->
`production` 名字空间应该是空的，下列命令应该返回的内容为空。

```shell
kubectl get deployment
kubectl get pods
```

<!--
Production likes to run cattle, so let's create some cattle pods.
-->
生产环境需要以放牛的方式运维，让我们创建一些名为 `cattle` 的 Pod。

```shell
kubectl create deployment cattle --image=registry.k8s.io/serve_hostname --replicas=5
kubectl get deployment
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
cattle       5/5     5            5           10s
```

```shell
kubectl get pods -l run=cattle
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
此时，应该很清楚的展示了用户在一个名字空间中创建的资源对另一个名字空间是不可见的。

<!--
As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace.
-->
随着 Kubernetes 中的策略支持的发展，我们将扩展此场景，以展示如何为每个名字空间提供不同的授权规则。
