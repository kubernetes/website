---
title: Kubernetes 对象
content_type: concept
weight: 10
description: >
  Kubernetes 对象是 Kubernetes 系统中的持久性实体。
  Kubernetes 使用这些实体表示你的集群状态。
  了解 Kubernetes 对象模型以及如何使用这些对象。
simple_list: true
card:
  name: concepts
  weight: 40
---
<!--
title: Objects In Kubernetes
content_type: concept
weight: 10
description: >
  Kubernetes objects are persistent entities in the Kubernetes system.
  Kubernetes uses these entities to represent the state of your cluster.
  Learn about the Kubernetes object model and how to work with these objects.
simple_list: true
card:
  name: concepts
  weight: 40
-->

<!-- overview -->

<!--
This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can
express them in `.yaml` format.
-->
本页说明了在 Kubernetes API 中是如何表示 Kubernetes 对象的，
以及如何使用 `.yaml` 格式的文件表示 Kubernetes 对象。

<!-- body -->

<!--
## Understanding Kubernetes objects {#kubernetes-objects}

*Kubernetes objects* are persistent entities in the Kubernetes system. Kubernetes uses these
entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance
-->
## 理解 Kubernetes 对象    {#kubernetes-objects}

在 Kubernetes 系统中，**Kubernetes 对象**是持久化的实体。
Kubernetes 使用这些实体去表示整个集群的状态。
具体而言，它们描述了如下信息：

* 哪些容器化应用正在运行（以及在哪些节点上运行）
* 可以被应用使用的资源
* 关于应用运行时行为的策略，比如重启策略、升级策略以及容错策略

<!--
A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system
will constantly work to ensure that the object exists. By creating an object, you're effectively
telling the Kubernetes system what you want your cluster's workload to look like; this is your
cluster's *desired state*.
-->
Kubernetes 对象是一种“意向表达（Record of Intent）”。一旦创建该对象，
Kubernetes 系统将不断工作以确保该对象存在。通过创建对象，你本质上是在告知
Kubernetes 系统，你想要的集群工作负载状态看起来应是什么样子的，
这就是 Kubernetes 集群所谓的**期望状态（Desired State）**。

<!--
To work with Kubernetes objects—whether to create, modify, or delete them—you'll need to use the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/). When you use the `kubectl` command-line
interface, for example, the CLI makes the necessary Kubernetes API calls for you. You can also use
the Kubernetes API directly in your own programs using one of the
[Client Libraries](/docs/reference/using-api/client-libraries/).
-->
操作 Kubernetes 对象 —— 无论是创建、修改或者删除 —— 需要使用
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api)。
比如，当使用 `kubectl` 命令行接口（CLI）时，CLI 会调用必要的 Kubernetes API；
也可以在程序中使用[客户端库](/zh-cn/docs/reference/using-api/client-libraries/)，
来直接调用 Kubernetes API。

<!--
### Object spec and status

Almost every Kubernetes object includes two nested object fields that govern
the object's configuration: the object *`spec`* and the object *`status`*.
For objects that have a `spec`, you have to set this when you create the object,
providing a description of the characteristics you want the resource to have:
its _desired state_.
-->
### 对象规约（Spec）与状态（Status）    {#object-spec-and-status}

几乎每个 Kubernetes 对象包含两个嵌套的对象字段，它们负责管理对象的配置：
对象 **`spec`（规约）** 和对象 **`status`（状态）**。
对于具有 `spec` 的对象，你必须在创建对象时设置其内容，描述你希望对象所具有的特征：
**期望状态（Desired State）**。

<!--
The `status` describes the _current state_ of the object, supplied and updated
by the Kubernetes system and its components. The Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} continually
and actively manages every object's actual state to match the desired state you
supplied.
-->
`status` 描述了对象的**当前状态（Current State）**，它是由 Kubernetes
系统和组件设置并更新的。在任何时刻，Kubernetes
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
都一直在积极地管理着对象的实际状态，以使之达成期望状态。

<!--
For example: in Kubernetes, a Deployment is an object that can represent an
application running on your cluster. When you create the Deployment, you
might set the Deployment `spec` to specify that you want three replicas of
the application to be running. The Kubernetes system reads the Deployment
spec and starts three instances of your desired application--updating
the status to match your spec. If any of those instances should fail
(a status change), the Kubernetes system responds to the difference
between spec and status by making a correction--in this case, starting
a replacement instance.
-->
例如，Kubernetes 中的 Deployment 对象能够表示运行在集群中的应用。
当创建 Deployment 时，你可能会设置 Deployment 的 `spec`，指定该应用要有 3 个副本运行。
Kubernetes 系统读取 Deployment 的 `spec`，
并启动我们所期望的应用的 3 个实例 —— 更新状态以与规约相匹配。
如果这些实例中有的失败了（一种状态变更），Kubernetes 系统会通过执行修正操作来响应
`spec` 和 `status` 间的不一致 —— 意味着它会启动一个新的实例来替换。

<!--
For more information on the object spec, status, and metadata, see the
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).
-->
关于对象 spec、status 和 metadata 的更多信息，可参阅
[Kubernetes API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。

<!--
### Describing a Kubernetes object

When you create an object in Kubernetes, you must provide the object spec that describes its
desired state, as well as some basic information about the object (such as a name). When you use
the Kubernetes API to create the object (either directly or via `kubectl`), that API request must
include that information as JSON in the request body.
Most often, you provide the information to `kubectl` in a file known as a _manifest_.
By convention, manifests are YAML (you could also use JSON format).
Tools such as `kubectl` convert the information from a manifest into JSON or another supported
serialization format when making the API request over HTTP.
-->
### 描述 Kubernetes 对象    {#describing-a-kubernetes-object}

创建 Kubernetes 对象时，必须提供对象的 `spec`，用来描述该对象的期望状态，
以及关于对象的一些基本信息（例如名称）。
当使用 Kubernetes API 创建对象时（直接创建或经由 `kubectl` 创建），
API 请求必须在请求主体中包含 JSON 格式的信息。
大多数情况下，你会通过 **清单（Manifest）** 文件为 `kubectl` 提供这些信息。
按照惯例，清单是 YAML 格式的（你也可以使用 JSON 格式）。
像 `kubectl` 这样的工具在通过 HTTP 进行 API 请求时，
会将清单中的信息转换为 JSON 或其他受支持的序列化格式。
<!--
Here's an example manifest that shows the required fields and object spec for a Kubernetes
Deployment:
-->
这里有一个清单示例文件，展示了 Kubernetes Deployment 的必需字段和对象 `spec`：

{{% code_sample file="application/deployment.yaml" %}}

<!--
One way to create a Deployment using a manifest file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:
-->
与上面使用清单文件来创建 Deployment 类似，另一种方式是使用 `kubectl` 命令行接口（CLI）的
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 命令，
将 `.yaml` 文件作为参数。下面是一个示例：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

<!--
The output is similar to this:
-->
输出类似下面这样：

```
deployment.apps/nginx-deployment created
```

<!--
### Required fields

In the manifest (YAML or JSON file) for the Kubernetes object you want to create, you'll need to set values for
the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
* `spec` - What state you desire for the object
-->
### 必需字段    {#required-fields}

在想要创建的 Kubernetes 对象所对应的清单（YAML 或 JSON 文件）中，需要配置的字段如下：

* `apiVersion` - 创建该对象所使用的 Kubernetes API 的版本
* `kind` - 想要创建的对象的类别
* `metadata` - 帮助唯一标识对象的一些数据，包括一个 `name` 字符串、`UID` 和可选的 `namespace`
* `spec` - 你所期望的该对象的状态

<!--
The precise format of the object `spec` is different for every Kubernetes object, and contains
nested fields specific to that object. The [Kubernetes API Reference](/docs/reference/kubernetes-api/)
can help you find the spec format for all of the objects you can create using Kubernetes.
-->
对每个 Kubernetes 对象而言，其 `spec` 之精确格式都是不同的，包含了特定于该对象的嵌套字段。
[Kubernetes API 参考](/zh-cn/docs/reference/kubernetes-api/)可以帮助你找到想要使用
Kubernetes 创建的所有对象的规约格式。

<!--
For example, see the [`spec` field](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for the Pod API reference.
For each Pod, the `.spec` field specifies the pod and its desired state (such as the container image name for
each container within that pod).
Another example of an object specification is the
[`spec` field](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)
for the StatefulSet API. For StatefulSet, the `.spec` field specifies the StatefulSet and
its desired state.
Within the `.spec` of a StatefulSet is a [template](/docs/concepts/workloads/pods/#pod-templates)
for Pod objects. That template describes Pods that the StatefulSet controller will create in order to
satisfy the StatefulSet specification.
Different kinds of objects can also have different `.status`; again, the API reference pages
detail the structure of that `.status` field, and its content for each different type of object.
-->
例如，参阅 Pod API 参考文档中
[`spec` 字段](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)。
对于每个 Pod，其 `.spec` 字段设置了 Pod 及其期望状态（例如 Pod 中每个容器的容器镜像名称）。
另一个对象规约的例子是 StatefulSet API 中的
[`spec` 字段](/zh-cn/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)。
对于 StatefulSet 而言，其 `.spec` 字段设置了 StatefulSet 及其期望状态。
在 StatefulSet 的 `.spec` 内，有一个为 Pod 对象提供的[模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
该模板描述了 StatefulSet 控制器为了满足 StatefulSet 规约而要创建的 Pod。
不同类型的对象可以有不同的 `.status` 信息。API 参考页面给出了 `.status` 字段的详细结构，
以及针对不同类型 API 对象的具体内容。

{{< note >}}
<!--
See [Configuration Best Practices](/docs/concepts/configuration/overview/) for additional
information on writing YAML configuration files.
-->
请查看[配置最佳实践](/zh-cn/docs/concepts/configuration/overview/)来获取有关编写 YAML 配置文件的更多信息。
{{< /note >}}

<!--
## Server side field validation

Starting with Kubernetes v1.25, the API server offers server side
[field validation](/docs/reference/using-api/api-concepts/#field-validation)
that detects unrecognized or duplicate fields in an object. It provides all the functionality
of `kubectl --validate` on the server side.
-->
## 服务器端字段验证   {#server-side-field-validation}

从 Kubernetes v1.25 开始，API
服务器提供了服务器端[字段验证](/zh-cn/docs/reference/using-api/api-concepts/#field-validation)，
可以检测对象中未被识别或重复的字段。它在服务器端提供了 `kubectl --validate` 的所有功能。

<!--
The `kubectl` tool uses the `--validate` flag to set the level of field validation. It accepts the
values `ignore`, `warn`, and `strict` while also accepting the values `true` (equivalent to `strict`)
and `false` (equivalent to `ignore`). The default validation setting for `kubectl` is `--validate=true`.
-->
`kubectl` 工具使用 `--validate` 标志来设置字段验证级别。它接受值
`ignore`、`warn` 和 `strict`，同时还接受值 `true`（等同于 `strict`）和
`false`（等同于 `ignore`）。`kubectl` 的默认验证设置为 `--validate=true`。

<!--
`Strict`
: Strict field validation, errors on validation failure

`Warn`
: Field validation is performed, but errors are exposed as warnings rather than failing the request

`Ignore`
: No server side field validation is performed
-->
`Strict`
: 严格的字段验证，验证失败时会报错

`Warn`
: 执行字段验证，但错误会以警告形式提供而不是拒绝请求

`Ignore`
: 不执行服务器端字段验证

<!--
When `kubectl` cannot connect to an API server that supports field validation it will fall back
to using client-side validation. Kubernetes 1.27 and later versions always offer field validation;
older Kubernetes releases might not. If your cluster is older than v1.27, check the documentation
for your version of Kubernetes.
-->
当 `kubectl` 无法连接到支持字段验证的 API 服务器时，它将回退为使用客户端验证。
Kubernetes 1.27 及更高版本始终提供字段验证；较早的 Kubernetes 版本可能没有此功能。
如果你的集群版本低于 v1.27，可以查阅适用于你的 Kubernetes 版本的文档。

## {{% heading "whatsnext" %}}

<!--
If you're new to Kubernetes, read more about the following:

* [Pods](/docs/concepts/workloads/pods/) which are the most important basic Kubernetes objects.
* [Deployment](/docs/concepts/workloads/controllers/deployment/) objects.
* [Controllers](/docs/concepts/architecture/controller/) in Kubernetes.
* [kubectl](/docs/reference/kubectl/) and [kubectl commands](/docs/reference/generated/kubectl/kubectl-commands).

[Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
explains how to use `kubectl` to manage objects.
You might need to [install kubectl](/docs/tasks/tools/#kubectl) if you don't already have it available.
-->
如果你刚开始学习 Kubernetes，可以进一步阅读以下信息：

* 最重要的 Kubernetes 基本对象 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
* [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 对象。
* Kubernetes 中的[控制器](/zh-cn/docs/concepts/architecture/controller/)。
* [kubectl](/zh-cn/docs/reference/kubectl/) 和
  [kubectl 命令](/docs/reference/generated/kubectl/kubectl-commands)。

[Kubernetes 对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
介绍了如何使用 `kubectl` 来管理对象。
如果你还没有安装 `kubectl`，你可能需要[安装 kubectl](/zh-cn/docs/tasks/tools/#kubectl)。

<!--
To learn about the Kubernetes API in general, visit:

* [Kubernetes API overview](/docs/reference/using-api/)

To learn about objects in Kubernetes in more depth, read other pages in this section:
-->
从总体上了解 Kubernetes API，可以查阅：

* [Kubernetes API 概述](/zh-cn/docs/reference/using-api/)

若要更深入地了解 Kubernetes 对象，可以阅读本节的其他页面：

<!-- Docsy automatically includes a list of pages in the section -->