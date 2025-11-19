---
title: 名字空間演練
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
Kubernetes {{< glossary_tooltip text="名字空間" term_id="namespace" >}}有助於不同的項目、團隊或客戶去共享
Kubernetes 叢集。

<!--
It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster.
-->
名字空間通過以下方式實現這點：

1. 爲[名字](/zh-cn/docs/concepts/overview/working-with-objects/names/)設置作用域.
2. 爲叢集中的部分資源關聯鑑權和策略的機制。

<!--
Use of multiple namespaces is optional.

This example demonstrates how to use Kubernetes namespaces to subdivide your cluster.
-->
使用多個名字空間是可選的。

此示例演示瞭如何使用 Kubernetes 名字空間細分叢集。

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
## 環境準備   {#prerequisites}

此示例作如下假設：

1. 你已擁有一個[設定好的 Kubernetes 叢集](/zh-cn/docs/setup/)。
2. 你已對 Kubernetes 的 {{< glossary_tooltip text="Pod" term_id="pod" >}}、
   {{< glossary_tooltip text="服務" term_id="service" >}} 和
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   有基本理解。

<!--
## Understand the default namespace

By default, a Kubernetes cluster will instantiate a default namespace when provisioning the cluster to hold the default set of Pods,
Services, and Deployments used by the cluster.
-->
## 理解默認名字空間   {#understand-the-default-namespace}

默認情況下，Kubernetes 叢集會在設定叢集時實例化一個默認名字空間，用以存放叢集所使用的默認
Pod、Service 和 Deployment 集合。

<!--
Assuming you have a fresh cluster, you can inspect the available namespaces by doing the following:
-->
假設你有一個新的叢集，你可以通過執行以下操作來檢查可用的名字空間：

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
## 創建新的名字空間   {#create-new-namespaces}

在本練習中，我們將創建兩個額外的 Kubernetes 名字空間來保存我們的內容。

<!--
Let's imagine a scenario where an organization is using a shared Kubernetes cluster for development and production use cases.
-->
我們假設一個場景，某組織正在使用共享的 Kubernetes 叢集來支持開發和生產：

<!--
The development team would like to maintain a space in the cluster where they can get a view on the list of Pods, Services, and Deployments
they use to build and run their application.  In this space, Kubernetes resources come and go, and the restrictions on who can or cannot modify resources
are relaxed to enable agile development.
-->
開發團隊希望在叢集中維護一個空間，以便他們可以查看用於構建和運行其應用程序的 Pod、Service
和 Deployment 列表。在這個空間裏，Kubernetes 資源被自由地加入或移除，
對誰能夠或不能修改資源的限制被放寬，以實現敏捷開發。

<!--
The operations team would like to maintain a space in the cluster where they can enforce strict procedures on who can or cannot manipulate the set of
Pods, Services, and Deployments that run the production site.
-->
運維團隊希望在叢集中維護一個空間，以便他們可以強制實施一些嚴格的規程，
對誰可以或誰不可以操作運行生產站點的 Pod、Service 和 Deployment 集合進行控制。

<!--
One pattern this organization could follow is to partition the Kubernetes cluster into two namespaces: `development` and `production`.
-->
該組織可以遵循的一種模式是將 Kubernetes 叢集劃分爲兩個名字空間：`development` 和 `production`。

<!--
Let's create two new namespaces to hold our work.
-->
讓我們創建兩個新的名字空間來保存我們的工作。

<!--
Use the file [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml) which describes a `development` namespace:
-->
文件 [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml) 描述了 `development` 名字空間:

{{% code_sample language="yaml" file="admin/namespace-dev.yaml" %}}

<!--
Create the `development` namespace using kubectl.
-->
使用 kubectl 創建 `development` 名字空間。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.yaml
```

<!--
Save the following contents into file [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml) which describes a `production` namespace:
-->
將下列的內容保存到文件 [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml) 中，
這些內容是對 `production` 名字空間的描述：

{{% code_sample language="yaml" file="admin/namespace-prod.yaml" %}}

<!--
And then let's create the `production` namespace using kubectl.
-->
讓我們使用 kubectl 創建 `production` 名字空間。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.yaml
```

<!--
To be sure things are right, let's list all of the namespaces in our cluster.
-->
爲了確保一切正常，我們列出叢集中的所有名字空間。

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
## 在每個名字空間中創建 Pod   {#create-pods-in-each-namespace}

Kubernetes 名字空間爲叢集中的 Pod、Service 和 Deployment 提供了作用域。

與一個名字空間交互的使用者不會看到另一個名字空間中的內容。

爲了演示這一點，讓我們在 `development` 名字空間中啓動一個簡單的 Deployment 和 Pod。

<!--
We first check what is the current context:
-->
我們首先檢查一下當前的上下文：

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
The value of "cluster" and "user" fields are copied from the current context.
-->
下一步是爲 kubectl 客戶端定義一個上下文，以便在每個名字空間中工作。
"cluster" 和 "user" 字段的值將從當前上下文中複製。

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
默認情況下，上述命令會添加兩個上下文到 `.kube/config` 文件中。
你現在可以查看上下文並根據你希望使用的名字空間並在這兩個新的請求上下文之間切換。

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
讓我們切換到 `development` 名字空間進行操作。

```shell
kubectl config use-context dev
```

<!--
You can verify your current context by doing the following:
-->
你可以使用下列命令驗證當前上下文：

```shell
kubectl config current-context
```

```
dev
```

<!--
At this point, all requests we make to the Kubernetes cluster from the command line are scoped to the `development` namespace.
-->
此時，我們從命令列向 Kubernetes 叢集發出的所有請求都限定在 `development` 名字空間中。

<!--
Let's create some contents.
-->
讓我們創建一些內容。

{{% code_sample file="admin/snowflake-deployment.yaml" %}}

<!--
Apply the manifest to create a Deployment 
-->
應用清單文件來創建 Deployment。

```shell
kubectl apply -f https://k8s.io/examples/admin/snowflake-deployment.yaml
```

<!--
We have created a deployment whose replica size is 2 that is running the pod called
`snowflake` with a basic container that serves the hostname.
-->
我們創建了一個副本大小爲 2 的 Deployment，該 Deployment 運行名爲 `snowflake` 的 Pod，
其中包含一個僅提供主機名服務的基本容器。

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
這很棒，開發人員可以做他們想要的事情，而不必擔心影響 `production` 名字空間中的內容。

<!--
Let's switch to the `production` namespace and show how resources in one namespace are hidden from the other.
-->
讓我們切換到 `production` 名字空間，展示一個名字空間中的資源如何對另一個名字空間不可見。

```shell
kubectl config use-context prod
```

<!--
The `production` namespace should be empty, and the following commands should return nothing.
-->
`production` 名字空間應該是空的，下列命令應該返回的內容爲空。

```shell
kubectl get deployment
kubectl get pods
```

<!--
Production likes to run cattle, so let's create some cattle pods.
-->
生產環境需要以放牛的方式運維，讓我們創建一些名爲 `cattle` 的 Pod。

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
此時，應該很清楚地展示了使用者在一個名字空間中創建的資源對另一個名字空間是不可見的。

<!--
As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace.
-->
隨着 Kubernetes 中的策略支持的發展，我們將擴展此場景，以展示如何爲每個名字空間提供不同的授權規則。
