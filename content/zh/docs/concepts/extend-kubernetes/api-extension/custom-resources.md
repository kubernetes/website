---
title: 定制资源
content_type: concept
weight: 10
---
<!--
title: Custom Resources
reviewers:
- enisoc
- deads2k
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
*Custom resources* are extensions of the Kubernetes API. This page discusses when to add a custom
resource to your Kubernetes cluster and when to use a standalone service. It describes the two
methods for adding custom resources and how to choose between them.
-->
*定制资源（Custom Resource）* 是对 Kubernetes API 的扩展。
本页讨论何时向 Kubernetes 集群添加定制资源，何时使用独立的服务。
本页描述添加定制资源的两种方法以及怎样在二者之间做出抉择。

<!-- body -->

<!--
## Custom resources

A *resource* is an endpoint in the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/) that stores a collection of
[API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of
a certain kind; for example, the built-in *pods* resource contains a
collection of Pod objects.
-->
## 定制资源

*资源（Resource）* 是
[Kubernetes API](/zh/docs/concepts/overview/kubernetes-api/) 中的一个端点，
其中存储的是某个类别的
[API 对象](/zh/docs/concepts/overview/working-with-objects/kubernetes-objects/)
的一个集合。
例如内置的 *pods* 资源包含一组 Pod 对象。

<!--
A *custom resource* is an extension of the Kubernetes API that is not necessarily available in a default
Kubernetes installation. It represents a customization of a particular Kubernetes installation. However,
many core Kubernetes functions are now built using custom resources, making Kubernetes more modular.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once a custom resource is installed, users can create and access its objects using
[kubectl](/docs/reference/kubectl/overview/), just as they do for built-in resources like
*Pods*.
-->
*定制资源（Custom Resource）* 是对 Kubernetes API 的扩展，不一定在默认的
Kubernetes 安装中就可用。定制资源所代表的是对特定 Kubernetes 安装的一种定制。
不过，很多 Kubernetes 核心功能现在都用定制资源来实现，这使得 Kubernetes
更加模块化。

定制资源可以通过动态注册的方式在运行中的集群内或出现或消失，集群管理员可以独立于集群
更新定制资源。一旦某定制资源被安装，用户可以使用 
[kubectl](/zh/docs/reference/kubectl/overview/)
来创建和访问其中的对象，就像他们为 *pods* 这种内置资源所做的一样。

<!--
## Custom controllers

On their own, custom resources let you store and retrieve structured data.
When you combine a custom resource with a *custom controller*, custom resources
provide a true _declarative API_.
-->
## 定制控制器   {#custom-controllers}

就定制资源本身而言，它只能用来存取结构化的数据。
当你将定制资源与 *定制控制器（Custom Controller）* 相结合时，定制资源就能够
提供真正的 _声明式 API（Declarative API）_。

<!--
A [declarative API](/docs/concepts/overview/kubernetes-api/)
allows you to _declare_ or specify the desired state of your resource and tries to
keep the current state of Kubernetes objects in sync with the desired state.
The controller interprets the structured data as a record of the user's
desired state, and continually maintains this state.
-->
使用[声明式 API](/zh/docs/concepts/overview/kubernetes-api/)，
你可以 _声明_ 或者设定你的资源的期望状态，并尝试让 Kubernetes 对象的当前状态
同步到其期望状态。控制器负责将结构化的数据解释为用户所期望状态的记录，并
持续地维护该状态。

<!--
You can deploy and update a custom controller on a running cluster, independently
of the cluster's lifecycle. Custom controllers can work with any kind of resource,
but they are especially effective when combined with custom resources. The
[Operator pattern](/docs/concepts/extend-kubernetes/operator/) combines custom
resources and custom controllers. You can use custom controllers to encode domain knowledge
for specific applications into an extension of the Kubernetes API.
-->
你可以在一个运行中的集群上部署和更新定制控制器，这类操作与集群的生命周期无关。
定制控制器可以用于任何类别的资源，不过它们与定制资源结合起来时最为有效。
[Operator 模式](/zh/docs/concepts/extend-kubernetes/operator/)就是将定制资源
与定制控制器相结合的。你可以使用定制控制器来将特定于某应用的领域知识组织
起来，以编码的形式构造对 Kubernetes API 的扩展。

<!--
## Should I add a custom resource to my Kubernetes Cluster?

When creating a new API, consider whether to
[aggregate your API with the Kubernetes cluster APIs](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
or let your API stand alone.
-->
## 我是否应该向我的 Kubernetes 集群添加定制资源？

在创建新的 API 时，请考虑是
[将你的 API 与 Kubernetes 集群 API 聚合起来](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
还是让你的 API 独立运行。

<!--
| Consider API aggregation if: | Prefer a stand-alone API if: |
| ---------------------------- | ---------------------------- |
| Your API is [Declarative](#declarative-apis). | Your API does not fit the [Declarative](#declarative-apis) model. |
| You want your new types to be readable and writable using `kubectl`.| `kubectl` support is not required |
| You want to view your new types in a Kubernetes UI, such as dashboard, alongside built-in types. | Kubernetes UI support is not required. |
| You are developing a new API. | You already have a program that serves your API and works well. |
| You are willing to accept the format restriction that Kubernetes puts on REST resource paths, such as API Groups and Namespaces. (See the [API Overview](/docs/concepts/overview/kubernetes-api/).) | You need to have specific REST paths to be compatible with an already defined REST API. |
| Your resources are naturally scoped to a cluster or namespaces of a cluster. | Cluster or namespace scoped resources are a poor fit; you need control over the specifics of resource paths. |
| You want to reuse [Kubernetes API support features](#common-features).  | You don't need those features. |
-->
| 考虑 API 聚合的情况 | 优选独立 API 的情况 |
| ---------------------------- | ---------------------------- |
| 你的 API 是[声明式的](#declarative-apis)。 | 你的 API 不符合[声明式](#declarative-apis)模型。 |
| 你希望可以是使用 `kubectl` 来读写你的新资源类别。 | 不要求 `kubectl` 支持。 |
| 你希望在 Kubernetes UI （如仪表板）中和其他内置类别一起查看你的新资源类别。 | 不需要 Kubernetes UI 支持。 |
| 你在开发新的 API。 | 你已经有一个提供 API 服务的程序并且工作良好。 |
| 你有意愿取接受 Kubernetes 对 REST 资源路径所作的格式限制，例如 API 组和名字空间。（参阅 [API 概述](/zh/docs/concepts/overview/kubernetes-api/)） | 你需要使用一些特殊的 REST 路径以便与已经定义的 REST API 保持兼容。 |
| 你的资源可以自然地界定为集群作用域或集群中某个名字空间作用域。 | 集群作用域或名字空间作用域这种二分法很不合适；你需要对资源路径的细节进行控制。 |
| 你希望复用 [Kubernetes API 支持特性](#common-features)。  | 你不需要这类特性。 |

<!--
### Declarative APIs

In a Declarative API, typically:

 - Your API consists of a relatively small number of relatively small objects (resources).
 - The objects define configuration of applications or infrastructure.
 - The objects are updated relatively infrequently.
 - Humans often need to read and write the objects.
 - The main operations on the objects are CRUD-y (creating, reading, updating and deleting).
 - Transactions across objects are not required: the API represents a desired state, not an exact state.
-->
### 声明式 APIs {#declarative-apis}

典型地，在声明式 API 中：

 - 你的 API 包含相对而言为数不多的、尺寸较小的对象（资源）。
 - 对象定义了应用或者基础设施的配置信息。
 - 对象更新操作频率较低。
 - 通常需要人来读取或写入对象。
 - 对象的主要操作是 CRUD 风格的（创建、读取、更新和删除）。
 - 不需要跨对象的事务支持：API 对象代表的是期望状态而非确切实际状态。

<!--
Imperative APIs are not declarative.
Signs that your API might not be declarative include:

 - The client says "do this", and then gets a synchronous response back when it is done.
 - The client says "do this", and then gets an operation ID back, and has to check a separate Operation object to determine completion of the request.
 - You talk about Remote Procedure Calls (RPCs).
 - Directly storing large amounts of data; for example, > a few kB per object, or > 1000s of objects.
 - High bandwidth access (10s of requests per second sustained) needed.
 - Store end-user data (such as images, PII, etc.) or other large-scale data processed by applications.
 - The natural operations on the objects are not CRUD-y.
 - The API is not easily modeled as objects.
 - You chose to represent pending operations with an operation ID or an operation object.
-->
命令式 API（Imperative API）与声明式有所不同。
以下迹象表明你的 API 可能不是声明式的：

- 客户端发出“做这个操作”的指令，之后在该操作结束时获得同步响应。
- 客户端发出“做这个操作”的指令，并获得一个操作 ID，之后需要检查一个 Operation（操作）
  对象来判断请求是否成功完成。
- 你会将你的 API 类比为远程过程调用（Remote Procedure Call，RPCs）。
- 直接存储大量数据；例如每个对象几 kB，或者存储上千个对象。
- 需要较高的访问带宽（长期保持每秒数十个请求）。
- 存储有应用来处理的最终用户数据（如图片、个人标识信息（PII）等）或者其他大规模数据。
- 在对象上执行的常规操作并非 CRUD 风格。
- API 不太容易用对象来建模。
- 你决定使用操作 ID 或者操作对象来表现悬决的操作。

<!--
## Should I use a configMap or a custom resource?

Use a ConfigMap if any of the following apply:

* There is an existing, well-documented config file format, such as a `mysql.cnf` or `pom.xml`.
* You want to put the entire config file into one key of a configMap.
* The main use of the config file is for a program running in a Pod on your cluster to consume the file to configure itself.
* Consumers of the file prefer to consume via file in a Pod or environment variable in a pod, rather than the Kubernetes API.
* You want to perform rolling updates via Deployment, etc., when the file is updated.
-->
## 我应该使用一个 ConfigMap 还是一个定制资源？

如果满足以下条件之一，应该使用 ConfigMap：

* 存在一个已有的、文档完备的配置文件格式约定，例如 `mysql.cnf` 或 `pom.xml`。
* 你希望将整个配置文件放到某 configMap 中的一个主键下面。
* 配置文件的主要用途是针对运行在集群中 Pod 内的程序，供后者依据文件数据配置自身行为。
* 文件的使用者期望以 Pod 内文件或者 Pod 内环境变量的形式来使用文件数据，
  而不是通过 Kubernetes API。
* 你希望当文件被更新时通过类似 Deployment 之类的资源完成滚动更新操作。

<!--
Use a [secret](/docs/concepts/configuration/secret/) for sensitive data, which is similar to a configMap but more secure.
-->
{{< note >}}
请使用 [Secret](/zh/docs/concepts/configuration/secret/) 来保存敏感数据。
Secret 类似于 configMap，但更为安全。
{{< /note >}}

<!--
Use a custom resource (CRD or Aggregated API) if most of the following apply:

* You want to use Kubernetes client libraries and CLIs to create and update the new resource.
* You want top-level support from `kubectl`; for example, `kubectl get my-object object-name`.
* You want to build new automation that watches for updates on the new object, and then CRUD other objects, or vice versa.
* You want to write automation that handles updates to the object.
* You want to use Kubernetes API conventions like `.spec`, `.status`, and `.metadata`.
* You want the object to be an abstraction over a collection of controlled resources, or a summarization of other resources.
-->
如果以下条件中大多数都被满足，你应该使用定制资源（CRD 或者 聚合 API）：

* 你希望使用 Kubernetes 客户端库和 CLI 来创建和更改新的资源。
* 你希望 `kubectl` 能够直接支持你的资源；例如，`kubectl get my-object object-name`。
* 你希望构造新的自动化机制，监测新对象上的更新事件，并对其他对象执行 CRUD
  操作，或者监测后者更新前者。
* 你希望编写自动化组件来处理对对象的更新。
* 你希望使用 Kubernetes API 对诸如 `.spec`、`.status` 和 `.metadata` 等字段的约定。
* 你希望对象是对一组受控资源的抽象，或者对其他资源的归纳提炼。

<!--
## Adding custom resources

Kubernetes provides two ways to add custom resources to your cluster:

- CRDs are simple and can be created without any programming.
- [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) requires programming, but allows more control over API behaviors like how data is stored and conversion between API versions.
-->
## 添加定制资源   {#adding-custom-resources}

Kubernetes 提供了两种方式供你向集群中添加定制资源：

- CRD 相对简单，创建 CRD 可以不必编程。
- [API 聚合](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  需要编程，但支持对 API 行为进行更多的控制，例如数据如何存储以及在不同 API 版本间如何转换等。

<!--
Kubernetes provides these two options to meet the needs of different users, so that neither ease of use nor flexibility is compromised.

Aggregated APIs are subordinate API servers that sit behind the primary API server, which acts as a proxy. This arrangement is called [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) (AA). To users, the Kubernetes API is extended.

CRDs allow users to create new types of resources without adding another API server. You do not need to understand API Aggregation to use CRDs.

Regardless of how they are installed, the new resources are referred to as Custom Resources to distinguish them from built-in Kubernetes resources (like pods).
-->
Kubernetes 提供这两种选项以满足不同用户的需求，这样就既不会牺牲易用性也不会牺牲灵活性。

聚合 API 指的是一些下位的 API 服务器，运行在主 API 服务器后面；主 API
服务器以代理的方式工作。这种组织形式称作
[API 聚合（API Aggregation，AA）](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 。
对用户而言，看起来仅仅是 Kubernetes API 被扩展了。

CRD 允许用户创建新的资源类别同时又不必添加新的 API 服务器。
使用 CRD 时，你并不需要理解 API 聚合。

无论以哪种方式安装定制资源，新的资源都会被当做定制资源，以便与内置的
Kubernetes 资源（如 Pods）相区分。

<!--
## CustomResourceDefinitions

The [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API resource allows you to define custom resources.
Defining a CRD object creates a new custom resource with a name and schema that you specify.
The Kubernetes API serves and handles the storage of your custom resource.
The name of a CRD object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## CustomResourceDefinitions

[CustomResourceDefinition](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API 资源允许你定义定制资源。
定义 CRD 对象的操作会使用你所设定的名字和模式定义（Schema）创建一个新的定制资源，
Kubernetes API 负责为你的定制资源提供存储和访问服务。
CRD 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with
[API server aggregation](#api-server-aggregation).

Refer to the [custom controller example](https://github.com/kubernetes/sample-controller)
for an example of how to register a new custom resource, work with instances of your new resource type,
and use a controller to handle events.
-->
CRD 使得你不必编写自己的 API 服务器来处理定制资源，不过其背后实现的通用性也意味着
你所获得的灵活性要比 [API 服务器聚合](#api-server-aggregation)少很多。

关于如何注册新的定制资源、使用新资源类别的实例以及如何使用控制器来处理事件，
相关的例子可参见[定制控制器示例](https://github.com/kubernetes/sample-controller)。

<!--
## API server aggregation

Usually, each resource in the Kubernetes API requires code that handles REST requests and manages persistent storage of objects. The main Kubernetes API server handles built-in resources like *pods* and *services*, and can also generically handle custom resources through [CRDs](#customresourcedefinitions).

The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) allows you to provide specialized
implementations for your custom resources by writing and deploying your own standalone API server.
The main API server delegates requests to you for the custom resources that you handle,
making them available to all of its clients.
-->
## API 服务器聚合  {#api-server-aggregation}

通常，Kubernetes API 中的每个都需要处理 REST 请求和管理对象持久性存储的代码。
Kubernetes API 主服务器能够处理诸如 *pods* 和 *services* 这些内置资源，也可以
按通用的方式通过 CRD {#customresourcedefinitions} 来处理定制资源。

[聚合层（Aggregation Layer）](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
使得你可以通过编写和部署你自己的独立的 API 服务器来为定制资源提供特殊的实现。
主 API 服务器将针对你要处理的定制资源的请求全部委托给你来处理，同时将这些资源
提供给其所有客户。

<!--
## Choosing a method for adding custom resources

CRDs are easier to use. Aggregated APIs are more flexible. Choose the method that best meets your needs.

Typically, CRDs are a good fit if:

* You have a handful of fields
* You are using the resource within your company, or as part of a small open-source project (as opposed to a commercial product)
-->
## 选择添加定制资源的方法

CRD 更为易用；聚合 API 则更为灵活。请选择最符合你的需要的方法。

通常，如何存在以下情况，CRD 可能更合适：

* 定制资源的字段不多；
* 你在组织内部使用该资源或者在一个小规模的开源项目中使用该资源，而不是
  在商业产品中使用。

<!--
### Comparing ease of use

CRDs are easier to create than Aggregated APIs.
-->
### 比较易用性  {#compare-ease-of-use}

CRD 比聚合 API 更容易创建

<!--
| CRDs                        | Aggregated API |
| --------------------------- | -------------- |
| Do not require programming. Users can choose any language for a CRD controller. | Requires programming in Go and building binary and image. |
| No additional service to run; CRDs are handled by API server. | An additional service to create and that could fail. |
| No ongoing support once the CRD is created. Any bug fixes are picked up as part of normal Kubernetes Master upgrades. | May need to periodically pickup bug fixes from upstream and rebuild and update the Aggregated API server. |
| No need to handle multiple versions of your API; for example, when you control the client for this resource, you can upgrade it in sync with the API. | You need to handle multiple versions of your API; for example, when developing an extension to share with the world. |
-->
| CRDs                        | 聚合 API       |
| --------------------------- | -------------- |
| 无需编程。用户可选择任何语言来实现 CRD 控制器。 | 需要使用 Go 来编程，并构建可执行文件和镜像。 |
| 无需额外运行服务；CRD 由 API 服务器处理。 | 需要额外创建服务，且该服务可能失效。 |
| 一旦 CRD 被创建，不需要持续提供支持。Kubernetes 主控节点升级过程中自动会带入缺陷修复。 | 可能需要周期性地从上游提取缺陷修复并更新聚合 API 服务器。 |
| 无需处理 API 的多个版本；例如，当你控制资源的客户端时，你可以更新它使之与 API 同步。 | 你需要处理 API 的多个版本；例如，在开发打算与很多人共享的扩展时。 |

<!--
### Advanced features and flexibility

Aggregated APIs offer more advanced API features and customization of other features; for example, the storage layer.
-->
### 高级特性与灵活性  {#advanced-features-and-flexibility}

聚合 API 可提供更多的高级 API 特性，也可对其他特性实行定制；例如，对存储层进行定制。

<!--
| Feature  | Description  | CRDs | Aggregated API   |
| -------- | ------------ | ---- | ---------------- |
| Validation | Help users prevent errors and allow you to evolve your API independently of your clients. These features are most useful when there are many clients who can't all update at the same time. | Yes.  Most validation can be specified in the CRD using [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation).  Any other validations supported by addition of a [Validating Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9). | Yes, arbitrary validation checks |
| Defaulting | See above | Yes, either via [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting) `default` keyword (GA in 1.17), or via a [Mutating Webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) (though this will not be run when reading from etcd for old objects). | Yes |
| Multi-versioning | Allows serving the same object through two API versions. Can help ease API changes like renaming fields. Less important if you control your client versions. | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning) | Yes |
| Custom Storage | If you need storage with a different performance mode (for example, a time-series database instead of key-value store) or isolation for security (for example, encryption of sensitive information, etc.) | No | Yes |
| Custom Business Logic | Perform arbitrary checks or actions when creating, reading, updating or deleting an object | Yes, using [Webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks). | Yes |
| Scale Subresource | Allows systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with your new resource | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)  | Yes |
| Status Subresource | Allows fine-grained access control where user writes the spec section and the controller writes the status section. Allows incrementing object Generation on custom resource data mutation (requires separate spec and status sections in the resource) | [Yes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource) | Yes |
| Other Subresources | Add operations other than CRUD, such as "logs" or "exec". | No | Yes |
| strategic-merge-patch | The new endpoints support PATCH with `Content-Type: application/strategic-merge-patch+json`. Useful for updating objects that may be modified both locally, and by the server. For more information, see ["Update API Objects in Place Using kubectl patch"](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) | No | Yes |
| Protocol Buffers | The new resource supports clients that want to use Protocol Buffers | No | Yes |
| OpenAPI Schema | Is there an OpenAPI (swagger) schema for the types that can be dynamically fetched from the server? Is the user protected from misspelling field names by ensuring only allowed fields are set? Are types enforced (in other words, don't put an `int` in a `string` field?) | Yes, based on the [OpenAPI v3.0 validation](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) schema (GA in 1.16). | Yes |
-->
| 特性    | 描述        | CRDs | 聚合 API       |
| ------- | ----------- | ---- | -------------- |
| 合法性检查 | 帮助用户避免错误，允许你独立于客户端版本演化 API。这些特性对于由很多无法同时更新的客户端的场合。| 可以。大多数验证可以使用 [OpenAPI v3.0 合法性检查](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 来设定。其他合法性检查操作可以通过添加[合法性检查 Webhook](/zh/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9)来实现。 | 可以，可执行任何合法性检查。|
| 默认值设置 | 同上 | 可以。可通过 [OpenAPI v3.0 合法性检查](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)的 `default` 关键词（自 1.17 正式发布）或[更改性（Mutating）Webhook](/zh/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)来实现（不过从 etcd 中读取老的对象时不会执行这些 Webhook）。 | 可以。 |
| 多版本支持 | 允许通过两个 API 版本同时提供同一对象。可帮助简化类似字段更名这类 API 操作。如果你能控制客户端版本，这一特性将不再重要。 | [可以](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning)。 | 可以。 |
| 定制存储 | 支持使用具有不同性能模式的存储（例如，要使用时间序列数据库而不是键值存储），或者因安全性原因对存储进行隔离（例如对敏感信息执行加密）。 | 不可以。 | 可以。 |
| 定制业务逻辑 | 在创建、读取、更新或删除对象时，执行任意的检查或操作。 | 可以。要使用 [Webhook](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。 | 可以。 |
| 支持 scale 子资源 | 允许 HorizontalPodAutoscaler 和 PodDisruptionBudget 这类子系统与你的新资源交互。 | [可以](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)。 | 可以。 |
| 支持 status 子资源 | 允许在用户写入 spec 部分而控制器写入 status 部分时执行细粒度的访问控制。允许在对定制资源的数据进行更改时增加对象的代际（Generation）；这需要资源对 spec 和 status 部分有明确划分。| [可以](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource)。 | 可以。 |
| 其他子资源 | 添加 CRUD 之外的操作，例如 "logs" 或 "exec"。 | 不可以。 | 可以。 |
| strategic-merge-patch | 新的端点要支持标记了 `Content-Type: application/strategic-merge-patch+json` 的 PATCH 操作。对于更新既可在本地更改也可在服务器端更改的对象而言是有用的。要了解更多信息，可参见[使用 `kubectl patch` 来更新 API 对象](/zh/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)。 | 不可以。 | 可以。 |
| 支持协议缓冲区 | 新的资源要支持想要使用协议缓冲区（Protocol Buffer）的客户端。 | 不可以。 | 可以。 |
| OpenAPI Schema | 是否存在新资源类别的 OpenAPI（Swagger）Schema 可供动态从服务器上读取？是否存在机制确保只能设置被允许的字段以避免用户犯字段拼写错误？是否实施了字段类型检查（换言之，不允许在 `string` 字段设置 `int` 值）？ | 可以，依据 [OpenAPI v3.0 合法性检查](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation) 模式（1.16 中进入正式发布状态）。 | 可以。|

<!--
### Common Features

When you create a custom resource, either via a CRD or an AA, you get many features for your API, compared to implementing it outside the Kubernetes platform:
-->
### 公共特性  {#common-features}

与在 Kubernetes 平台之外实现定制资源相比，
无论是通过 CRD 还是通过聚合 API 来创建定制资源，你都会获得很多 API 特性：

<!--
| Feature  | What it does |
| -------- | ------------ |
| CRUD | The new endpoints support CRUD basic operations via HTTP and `kubectl` |
| Watch | The new endpoints support Kubernetes Watch operations via HTTP |
| Discovery | Clients like `kubectl` and dashboard automatically offer list, display, and field edit operations on your resources |
| json-patch | The new endpoints support PATCH with `Content-Type: application/json-patch+json` |
| merge-patch | The new endpoints support PATCH with `Content-Type: application/merge-patch+json` |
| HTTPS | The new endpoints uses HTTPS |
| Built-in Authentication | Access to the extension uses the core API server (aggregation layer) for authentication |
| Built-in Authorization | Access to the extension can reuse the authorization used by the core API server; for example, RBAC. |
| Finalizers | Block deletion of extension resources until external cleanup happens. |
| Admission Webhooks | Set default values and validate extension resources during any create/update/delete operation. |
| UI/CLI Display | Kubectl, dashboard can display extension resources. |
| Unset versus Empty | Clients can distinguish unset fields from zero-valued fields. |
| Client Libraries Generation | Kubernetes provides generic client libraries, as well as tools to generate type-specific client libraries. |
| Labels and annotations | Common metadata across objects that tools know how to edit for core and custom resources. |
-->
| 功能特性 | 具体含义     |
| -------- | ------------ |
| CRUD | 新的端点支持通过 HTTP 和 `kubectl` 发起的 CRUD 基本操作 |
| 监测（Watch） | 新的端点支持通过 HTTP 发起的 Kubernetes Watch 操作 |
| 发现（Discovery） | 类似 `kubectl` 和仪表盘（Dashboard）这类客户端能够自动提供列举、显示、在字段级编辑你的资源的操作 |
| json-patch | 新的端点支持带 `Content-Type: application/json-patch+json` 的 PATCH 操作 |
| merge-patch | 新的端点支持带 `Content-Type: application/merge-patch+json` 的 PATCH 操作 |
| HTTPS | 新的端点使用 HTTPS |
| 内置身份认证 | 对扩展的访问会使用核心 API 服务器（聚合层）来执行身份认证操作 |
| 内置鉴权授权 | 对扩展的访问可以复用核心 API 服务器所使用的鉴权授权机制；例如，RBAC |
| Finalizers | 在外部清除工作结束之前阻止扩展资源被删除 |
| 准入 Webhooks | 在创建、更新和删除操作中对扩展资源设置默认值和执行合法性检查 |
| UI/CLI 展示 | `kubectl` 和仪表盘（Dashboard）可以显示扩展资源 |
| 区分未设置值和空值 | 客户端能够区分哪些字段是未设置的，哪些字段的值是被显式设置为零值的。  |
| 生成客户端库 | Kubernetes 提供通用的客户端库，以及用来生成特定类别客户端库的工具 |
| 标签和注解 | 提供涵盖所有对象的公共元数据结构，且工具知晓如何编辑核心资源和定制资源的这些元数据 |

<!--
## Preparing to install a custom resource

There are several points to be aware of before adding a custom resource to your cluster.
-->
## 准备安装定制资源

在向你的集群添加定制资源之前，有些事情需要搞清楚。

<!--
### Third party code and new points of failure

While creating a CRD does not automatically add any new points of failure (for example, by causing third party code to run on your API server), packages (for example, Charts) or other installation bundles often include CRDs as well as a Deployment of third-party code that implements the business logic for a new custom resource.

Installing an Aggregated API server always involves running a new Deployment.
-->
### 第三方代码和新的失效点的问题

尽管添加新的 CRD 不会自动带来新的失效点（Point of
Failure），例如导致第三方代码被在 API 服务器上运行，
类似 Helm Charts 这种软件包或者其他安装包通常在提供 CRD 的同时还包含带有第三方
代码的 Deployment，负责实现新的定制资源的业务逻辑。

安装聚合 API 服务器时，也总会牵涉到运行一个新的 Deployment。

<!--
### Storage

Custom resources consume storage space in the same way that ConfigMaps do. Creating too many custom resources may overload your API server's storage space.

Aggregated API servers may use the same storage as the main API server, in which case the same warning applies.
-->
### 存储

定制资源和 ConfigMap 一样也会消耗存储空间。创建过多的定制资源可能会导致
API 服务器上的存储空间超载。

聚合 API 服务器可以使用主 API 服务器的同一存储。如果是这样，你也要注意
此警告。

<!--
### Authentication, authorization, and auditing

CRDs always use the same authentication, authorization, and audit logging as the built-in resources of your API server.

If you use RBAC for authorization, most RBAC roles will not grant access to the new resources (except the cluster-admin role or any role created with wildcard rules). You'll need to explicitly grant access to the new resources. CRDs and Aggregated APIs often come bundled with new role definitions for the types they add.

Aggregated API servers may or may not use the same authentication, authorization, and auditing as the primary API server.
-->
### 身份认证、鉴权授权以及审计

CRD 通常与 API 服务器上的内置资源一样使用相同的身份认证、鉴权授权
和审计日志机制。

如果你使用 RBAC 来执行鉴权授权，大多数 RBAC 角色都会授权对新资源的访问
（除了 cluster-admin 角色以及使用通配符规则创建的其他角色）。
你要显式地为新资源的访问授权。CRD 和聚合 API 通常在交付时会包含
针对所添加的类别的新的角色定义。

聚合 API 服务器可能会使用主 API 服务器相同的身份认证、鉴权授权和审计
机制，也可能不会。

<!--
## Accessing a custom resource

Kubernetes [client libraries](/docs/reference/using-api/client-libraries/) can be used to access custom resources. Not all client libraries support custom resources. The _Go_ and _Python_ client libraries do.

When you add a custom resource, you can access it using:

- `kubectl`
- The kubernetes dynamic client.
- A REST client that you write.
- A client generated using [Kubernetes client generation tools](https://github.com/kubernetes/code-generator) (generating one is an advanced undertaking, but some projects may provide a client along with the CRD or AA).
-->
## 访问定制资源

Kubernetes [客户端库](/zh/docs/reference/using-api/client-libraries/)可用来访问定制资源。
并非所有客户端库都支持定制资源。_Go_ 和 _Python_ 客户端库是支持的。

当你添加了新的定制资源后，可以用如下方式之一访问它们：

- `kubectl`
- Kubernetes 动态客户端
- 你所编写的 REST 客户端
- 使用 [Kubernetes 客户端生成工具](https://github.com/kubernetes/code-generator)
  所生成的客户端。生成客户端的工作有些难度，不过某些项目可能会随着 CRD 或
  聚合 API 一起提供一个客户端

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Extend the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->
* 了解如何[使用聚合层扩展 Kubernetes API](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* 了解如何[使用 CustomResourceDefinition 来扩展 Kubernetes API](/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)

