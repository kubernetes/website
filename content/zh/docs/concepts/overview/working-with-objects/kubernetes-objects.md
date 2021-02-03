---
title: 理解 Kubernetes 对象
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 40
---

<!---
title: Understanding Kubernetes Objects
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 40
-->

<!-- overview -->
<!--
This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can express them in `.yaml` format.
-->
本页说明了 Kubernetes 对象在 Kubernetes API 中是如何表示的，以及如何在 `.yaml` 格式的文件中表示。


<!-- body -->
<!--
## Understanding Kubernetes Objects

*Kubernetes Objects* are persistent entities in the Kubernetes system. Kubernetes uses these entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance
-->
## 理解 Kubernetes 对象

在 Kubernetes 系统中，*Kubernetes 对象* 是持久化的实体。
Kubernetes 使用这些实体去表示整个集群的状态。特别地，它们描述了如下信息：

* 哪些容器化应用在运行（以及在哪些节点上）
* 可以被应用使用的资源
* 关于应用运行时表现的策略，比如重启策略、升级策略 以及 容错策略

<!--
A Kubernetes object is a "record of intent" - once you create the object, the Kubernetes system will constantly work to ensure that object exists. By creating an object, you're effectively telling the Kubernetes system what you want your cluster's workload to look like; this is your cluster's *desired state*.

To work with Kubernetes objects - whether to create, modify, or delete them - you'll need to use the [Kubernetes API](/docs/concepts/overview/kubernetes-api/). When you use the `kubectl` command-line interface, for example, the CLI makes the necessary Kubernetes API calls for you. You can also use the Kubernetes API directly in your own programs using one of the [Client Libraries](/docs/reference/using-api/client-libraries/).
-->
Kubernetes 对象是 “目标性记录” —— 一旦创建对象，Kubernetes 系统将持续工作以确保对象存在。
通过创建对象，本质上是在告知 Kubernetes 系统，所需要的集群工作负载看起来是什么样子的，
这就是 Kubernetes 集群的 **期望状态（Desired State）**。

操作 Kubernetes 对象 —— 无论是创建、修改 或者 删除 —— 都需要使用
[Kubernetes API](/zh/docs/concepts/overview/kubernetes-api)。
比如，当使用 `kubectl` 命令行接口时，CLI 会执行必要的 Kubernetes API 调用，
也可以在程序中使用
[客户端库](/zh/docs/reference/using-api/client-libraries/) 直接调用 Kubernetes API。

<!--
### Object Spec and Status

Almost every Kubernetes object includes two nested object fields that govern
the object's configuration: the object *`spec`* and the object *`status`*.
For objects that have a `spec`, you have to set this when you create the object,
providing a description of the characteristics you want the resource to have:
its _desired state_.
-->
### 对象规约（Spec）与状态（Status）    {#object-spec-and-status}

几乎每个 Kubernetes 对象包含两个嵌套的对象字段，它们负责管理对象的配置：
对象 *`spec`（规约）* 和 对象 *`status`（状态）* 。
对于具有 `spec` 的对象，你必须在创建对象时设置其内容，描述你希望对象所具有的特征：
*期望状态（Desired State）* 。

<!--
The `status` describes the _current state_ of the object, supplied and updated
by the Kubernetes system and its components. The Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} continually
and actively manages every object's actual state to match the desired state you
supplied.
-->
`status` 描述了对象的 _当前状态（Current State）_，它是由 Kubernetes 系统和组件
设置并更新的。在任何时刻，Kubernetes 
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
都一直积极地管理着对象的实际状态，以使之与期望状态相匹配。

<!--
For example: in Kubernetes, a Deployment is an object that can represent an
application running on your cluster. When you create the Deployment, you
might set the Deployment `spec` to specify that you want three replicas of
the application to be running. The Kubernetes system reads the Deployment
spec and starts three instances of your desired application-updating
the status to match your spec. If any of those instances should fail
(a status change), the Kubernetes system responds to the difference
between spec and status by making a correction-in this case, starting
a replacement instance.
-->
例如，Kubernetes 中的 Deployment 对象能够表示运行在集群中的应用。
当创建 Deployment 时，可能需要设置 Deployment 的 `spec`，以指定该应用需要有 3 个副本运行。
Kubernetes 系统读取 Deployment 规约，并启动我们所期望的应用的 3 个实例
—— 更新状态以与规约相匹配。
如果这些实例中有的失败了（一种状态变更），Kubernetes 系统通过执行修正操作
来响应规约和状态间的不一致 —— 在这里意味着它会启动一个新的实例来替换。

<!--
For more information on the object spec, status, and metadata, see the [Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).
-->

关于对象 spec、status 和 metadata 的更多信息，可参阅
[Kubernetes API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。

<!--
### Describing a Kubernetes Object

When you create an object in Kubernetes, you must provide the object spec that describes its desired state, as well as some basic information about the object (such as a name). When you use the Kubernetes API to create the object (either directly or via `kubectl`), that API request must include that information as JSON in the request body. **Most often, you provide the information to `kubectl` in a .yaml file.** `kubectl` converts the information to JSON when making the API request.

Here's an example `.yaml` file that shows the required fields and object spec for a Kubernetes Deployment:
-->
### 描述 Kubernetes 对象

创建 Kubernetes 对象时，必须提供对象的规约，用来描述该对象的期望状态，
以及关于对象的一些基本信息（例如名称）。
当使用 Kubernetes API 创建对象时（或者直接创建，或者基于`kubectl`），
API 请求必须在请求体中包含 JSON 格式的信息。
**大多数情况下，需要在 .yaml 文件中为 `kubectl` 提供这些信息**。
`kubectl` 在发起 API 请求时，将这些信息转换成 JSON 格式。

这里有一个 `.yaml` 示例文件，展示了 Kubernetes Deployment 的必需字段和对象规约：

{{< codenew file="application/deployment.yaml" >}}

<!--
One way to create a Deployment using a `.yaml` file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:
-->
使用类似于上面的 `.yaml` 文件来创建 Deployment的一种方式是使用 `kubectl` 命令行接口（CLI）中的
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 命令，
将 `.yaml` 文件作为参数。下面是一个示例：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

<!--
The output is similar to this:
-->
输出类似如下这样：

```
deployment.apps/nginx-deployment created
```

<!--
### Required Fields

In the `.yaml` file for the Kubernetes object you want to create, you'll need to set values for the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
-->
### 必需字段  {#required-fields}

在想要创建的 Kubernetes 对象对应的 `.yaml` 文件中，需要配置如下的字段：

* `apiVersion` - 创建该对象所使用的 Kubernetes API 的版本
* `kind` - 想要创建的对象的类别
* `metadata` - 帮助唯一性标识对象的一些数据，包括一个 `name` 字符串、UID 和可选的 `namespace`

<!--
You'll also need to provide the object `spec` field. The precise format of the object `spec` is different for every Kubernetes object, and contains nested fields specific to that object. The [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) can help you find the spec format for all of the objects you can create using Kubernetes.
For example, the `spec` format for a `Pod` can be found
[here](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core),
and the `spec` format for a `Deployment` can be found
[here](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).
-->
你也需要提供对象的 `spec` 字段。
对象 `spec` 的精确格式对每个 Kubernetes 对象来说是不同的，包含了特定于该对象的嵌套字段。
[Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
能够帮助我们找到任何我们想创建的对象的 spec 格式。
例如，可以从
[core/v1 PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
查看 `Pod` 的 `spec` 格式，
并且可以从
[apps/v1 DeploymentSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps)
查看 `Deployment` 的 `spec` 格式。


## {{% heading "whatsnext" %}}

<!--
* Learn about the most important basic Kubernetes objects, such as [Pod](/docs/concepts/workloads/pods/).
* Learn about [controllers](/docs/concepts/architecture/controller/) in Kubernetes.
* [Using the Kubernetes API](/docs/reference/using-api/) explains some more API concepts.
-->
* 了解最重要的 Kubernetes 基本对象，例如 [Pod](/zh/docs/concepts/workloads/pods/)。
* 了解 Kubernetes 中的[控制器](/zh/docs/concepts/architecture/controller/)。
* [使用 Kubernetes API](/zh/docs/reference/using-api/) 一节解释了一些 API 概念。

