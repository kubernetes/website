---
title: Custom Resources（自定义资源）
reviewers:
- enisoc
- deads2k
content_template: templates/concept
weight: 20
---

{{% capture overview %}}
<!--
*Custom resources* are extensions of the Kubernetes API. This page discusses when to add a custom resource to your Kubernetes cluster and when to use a standalone service. It describes the two methods for adding custom resources and how to choose between them.
-->
自定义资源是 Kubernetes API 的扩展。本页讨论何时向 Kubernetes 群集添加自定义资源以及何时使用独立服务。它描述了添加自定义资源的两种方法以及如何在它们之间进行选择。
{{% /capture %}}

{{% capture body %}}
<!--
## Custom resources
-->
##自定义资源
<!--
A *resource* is an endpoint in the [Kubernetes API](/docs/reference/using-api/api-overview/) that stores a collection of
[API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of a certain kind. For example, the built-in *pods* resource contains a collection of Pod objects.
-->
资源是 Kubernetes API中的端点(/文档/引用/使用 api/api-概视图/)，用于存储
某种API 对象(文档/概念/概述/处理对象/ kubernetes对象/)的集合。例如,内置 Pods 资源包含 Pod 对象的集合。

<!--
A *custom resource* is an extension of the Kubernetes API that is not necessarily available in a default Kubernetes installation. It represents a customization of a particular Kubernetes installation. However, many core Kubernetes functions are now built using custom resources, making Kubernetes more modular.
-->

自定义资源是Kubernetes API的扩展，在Kubernetes的默认安装中不一定可用。它使 Kubernetes具备可定制化安装的能力。但是，很多核心Kubernetes函数现在都使用自定义资源构建，使Kubernetes模块更加合理。
<!--
Custom resources can appear and disappear in a running cluster through dynamic registration, and cluster admins can update custom resources independently of the cluster itself. Once a custom resource is installed, users can create and access its objects using
[kubectl](/docs/user-guide/kubectl-overview/), just as they do for built-in resources like
*Pods*.
-->
自定义资源可以通过动态注册在运行的集群中显示或者消失，并且集群管理员可以独立于集群本身更新自定义资源。安装自定义资源后,用户可以使用 kubectl 创建和访问其对象,就像对 Pods 等内置资源一样。
<!--
## Custom controllers
-->
## 自定义控制器
<!--
On their own, custom resources simply let you store and retrieve structured data.
When you combine a custom resource with a *custom controller*, custom resources
provide a true _declarative API_.
-->
自定义资源可以存储和检索结构化数据。将自定义资源和自定义控制器结合时，自定义资源提供一个真正被声明过的API。
<!--
A [declarative API](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects)
allows you to _declare_ or specify the desired state of your resource and tries to
keep the current state of Kubernetes objects in sync with the desired state.
The controller interprets the structured data as a record of the user's
desired state, and continually maintains this state.
-->
声明性API允许使用者声明或者指定所需的资源状态，并使当前状态与所需状态保持一致。控制器将结构化数据解释为用户所需状态的记录,并持续维护此状态。
<!--
You can deploy and update a custom controller on a running cluster, independently
of the cluster's own lifecycle. Custom controllers can work with any kind of resource,
but they are especially effective when combined with custom resources. The
[Operator pattern](https://coreos.com/blog/introducing-operators.html) combines custom
resources and custom controllers. You can use custom controllers to encode domain knowledge
for specific applications into an extension of the Kubernetes API.
-->
在运行中的集群生命周期中，可以部署并升级自定义控制器。自定义控制器可以与任何资源一起工作，但是与自定义资源相结合时他们特别有效。运算符模式结合了自定义资源和自定义控制器。您可以使用自定义控制器将特定应用程序的领域知识编码到Kubernetes API的扩展中。
<!--
## Should I add a custom resource to my Kubernetes Cluster?
-->
##是否需要向Kubernetes 集群添加自定义资源？

<!--
When creating a new API, consider whether to [aggregate your API with the Kubernetes cluster APIs](/docs/concepts/api-extension/apiserver-aggregation/) or let your API stand alone.
-->
创建新API的时候，请考虑是将API与Kubernetes 集群API聚合还是将API独立。

<!--
| Consider API aggregation if: | Prefer a stand-alone API if: |
-->
如果考虑将API聚合：|如果首选独立API：

	
<!--
| Your API is [Declarative](#declarative-apis). | Your API does not fit the [Declarative](#declarative-apis) model. |
-->
API具有声明性。| API不适合声明模型。

<!--
| You want your new types to be readable and writable using `kubectl`.| `kubectl` support is not required |
-->
你希望新类型可读且可使用kubectl进行拼写。| 不需要kubectl支持
<!--
| You want to view your new types in a Kubernetes UI, such as dashboard, alongside built-in types. | Kubernetes UI support is not required. |
-->
你希望在Kubernetes 使用界面里看到你的新类型，比如dashboard，以及内置类型。|不需要Kubernetes使用界面支持。
<!--
| You are developing a new API. | You already have a program that serves your API and works well. |
-->
你正在新建一个API。|你已经有一个运行良好的为你的API服务的程序。
<!--
| You are willing to accept the format restriction that Kubernetes puts on REST resource paths, such as API Groups and Namespaces. (See the [API Overview](/docs/concepts/overview/kubernetes-api/).) | You need to have specific REST paths to be compatible with an already defined REST API. |
-->
你愿意接受Kubernetes对REST资源路径的格式限制，例如API组和命名空间。（参照API概述）|你需要有一个特定的REST路径来兼容已经定义的REST API。
<!--
| Your resources are naturally scoped to a cluster or to namespaces of a cluster. | Cluster or namespace scoped resources are a poor fit; you need control over the specifics of resource paths. |
-->
你的资源被自然限定到一个集群或者一个集群的命名空间。|集群或者命名空间作用域资源不合适；你需要通过路径资源的细节来控制。
<!--
| You want to reuse [Kubernetes API support features](#common-features).  | You don't need those features. |
-->
你希望重用Kubernetes API的支持功能。|你不需要这些功能。
<!--
### Declarative APIs
-->
###声明性API
<!--
In a Declarative API, typically:
-->
在声明性API中，通常：
<!--
 - Your API consists of a relatively small number of relatively small objects (resources).
 - The objects define configuration of applications or infrastructure.
 - The objects are updated relatively infrequently.
 - Humans often need to read and write the objects.
 - The main operations on the objects are CRUD-y (creating, reading, updating and deleting).
 - Transactions across objects are not required: the API represents a desired state, not an exact state.
-->
-API由相对较少的对象（资源）组成。
-对象定义了应用或基础设施的配置项。
-对象更新相对较少。
-用户经常需要读取和写入对象。
-对象上的主要操作是CRUD-y（创建，读取，更新和删除）。
-不需要跨对象的事务：API表示一个所需的状态，而不是一个确切的状态。
<!--
Imperative APIs are not declarative.
Signs that your API might not be declarative include:
-->
命令式API不是声明性的。API不是声明性的特点包括：
<!--
 - The client says "do this", and then gets a synchronous response back when it is done.
 - The client says "do this", and then gets an operation ID back, and has to check a separate Operation object to determine completion of the request.
 - You talk about Remote Procedure Calls (RPCs).
 - Directly storing large amounts of data (e.g. > a few kB per object, or >1000s of objects).
 - High bandwidth access (10s of requests per second sustained) needed.
 - Store end-user data (such as images, PII, etc) or other large-scale data processed by applications.
 - The natural operations on the objects are not CRUD-y.
 - The API is not easily modeled as objects.
 - You chose to represent pending operations with an operation ID or an operation object.
-->
-客户端说“执行此操作”，然后在完成时获取同步响应。
-客户端说“执行此操作”，然后获取一个操作ID，并且为了确认请求的完成，必须检查单独的操作对象。
-说的是远程过程调用（RPCs）。
-直接存储大量数据（例如，每个对象几kB，或1000个对象）。
-需要高带宽访问（每秒持续的10个请求）
-存储业务用户数据（如图像、PII等）或者其他由应用程序处理的大规模数据。
-对于对象的自然操作不是CRUD-y。
-API不容易建模成对象。
-你选择使用操作ID或者操作对象来表示待解决的操作。
<!--
## Should I use a configMap or a custom resource?
-->
##我应该使用配置映射还是自定义资源？
<!--
Use a ConfigMap if any of the following apply:
-->
如果以下任何一项适用，请使用配置映射：
<!--
* There is an existing, well-documented config file format, such as a `mysql.cnf` or `pom.xml`.
* You want to put the entire config file into one key of a configMap.
* The main use of the config file is for a program running in a Pod on your cluster to consume the file to configure itself.
* Consumers of the file prefer to consume via file in a Pod or environment variable in a pod, rather than the Kubernetes API.
* You want to perform rolling updates via Deployment, etc, when the file is updated.
-->
*存在一种记录良好的配置文件格式，，例如“mysql.cnf”或者“pom.xml”。
*你想把所有的配置文件都放进配置映射的一个键中。
*配置文件的作用就是，让运行在集群中pod的程序配置自身环境。
*文件使用者更倾向于使用通过Pod中的文件或Pod中的环境变量，而不是使用Kubernetes API。
*你希望在更新文件等时候，通过“部署”等执行滚动更新。
<!--
{{< note >}}
Use a [secret](/docs/concepts/configuration/secret/) for sensitive data, which is similar to a configMap but more secure.
{{< /note >}}
-->
{{< note >}}
对敏感数据使用机密，该机密类似于配置映射，但更安全。
{{</ note >}}
<!--
Use a custom resource (CRD or Aggregated API) if most of the following apply:
-->
如果以下大多数情况出现，请使用自定义资源：
<!--
* You want to use Kubernetes client libraries and CLIs to create and update the new resource.
* You want top-level support from kubectl (for example: `kubectl get my-object object-name`).
* You want to build new automation that watches for updates on the new object, and then CRUD other objects, or vice versa.
* You want to write automation that handles updates to the object.
* You want to use Kubernetes API conventions like `.spec`, `.status`, and `.metadata`.
* You want the object to be an abstraction over a collection of controlled resources, or a summarization of other resources.
-->
*您希望使用 Kubernetes 客户端库和 CLIs 来创建和更新新资源。
*你希望从kubectl得到顶级支持（比如：kubectl get my-object object-name）。
*你希望新建一个自动化以监视新对象的更新，然后监视CRUD其他对象，反之亦然。
*你希望编写处理对象更新的自动化。
*你想要使用Kubernetes API约定，比如像.spec，.status，和.metadata。
*你希望对象是受控资源集合的抽象，或者是其他资源的汇总。
<!--
 ## Adding custom resources
-->
添加自定义资源
<!--
Kubernetes provides two ways to add custom resources to your cluster:
-->
Kubernetes提供了两种将自定义资源添加到集群的方法：
<!--
- CRDs are simple and can be created without any programming.
- [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) requires programming, but allows more control over API behaviors like how data is stored and conversion between API versions.
-->
-CRDs非常简单，无需任何编程即可创建。
-API集合需要编程，但允许对API行为进行更多控制，比如数据的存储方式和API版本之间的转换。
<!--
Kubernetes provides these two options to meet the needs of different users, so that neither ease of use nor flexibility is compromised.
-->
Kubernetes提供了两个选项来满足不同使用者的需要，因此无论是易用性还是灵活性都不受影响。
<!--
Aggregated APIs are subordinate APIServers that sit behind the primary API server, which acts as a proxy. This arrangement is called [API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) (AA). To users, it simply appears that the Kubernetes API is extended.
-->
API集合是位于主API服务器后面的从属API服务器，用来充当代理。这种安排被称作API集合（AA）。对于用户来说，Kubernetes API似乎只是扩展了。
<!--
CRDs allow users to create new types of resources without adding another APIserver. You do not need to understand API Aggregation to use CRDs.
-->
CRDs允许用户在不添加其他API服务器的情况下创建新类型的资源。您无需了解API集合就可以使用CRDs。
<!--
Regardless of how they are installed, the new resources are referred to as Custom Resources to distinguish them from built-in Kubernetes resources (like pods).
-->
无论如何安装，新资源都被称为自定义资源，已将其与内置的Kubernetes（如pods）资源区分开。
<!--
## CustomResourceDefinitions
-->
## 自定义资源定义
<!--
The [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) API resource allows you to define custom resources. Defining a CRD object creates a new custom resource with a name and schema that you specify. The Kubernetes API serves and handles the storage of your custom resource.
-->
自定义资源定义API资源允许你去定义自定义资源。定义CRD对象创建了一个新的自定义资源，该资源具有您指定的名称和架构。Kubernetes API提供并处理自定义资源的存储。
<!--
This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with
[API server aggregation](#api-server-aggregation).
-->
这样，你就不用为了处理自定义资源来编写你自己的API服务器了，但是实现的通用性意味着比API 服务器集合的灵活性要低。
<!--
Refer to the [custom controller example](https://github.com/kubernetes/sample-controller)
for an example of how to register a new custom resource, work with instances of your new resource type,
and use a controller to handle events.
-->
有关如何注册新自定义资源、使用新资源类型的实例以及使用控制器处理事件的示例,请参阅自定义控制器示例。
<!--
## API server aggregation
-->
##API服务器集合
<!--
Usually, each resource in the Kubernetes API requires code that handles REST requests and manages persistent storage of objects. The main Kubernetes API server handles built-in resources like *pods* and *services*, and can also handle custom resources in a generic way through [CRDs](#customresourcedefinitions).
-->
通常，Kubernetes API 中的每个资源都需要代码来处理REST请求和管理对象的持续存储。
<!--
The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) allows you to provide specialized
implementations for your custom resources by writing and deploying your own standalone API server.
-->
集合层允许您通过编写部署你自己独立的API服务器来为自定义资源提供专用实现。
<!--
The main API server delegates requests to you for the custom resources that you handle,
making them available to all of its clients.
-->
主API服务器将委托您处理自定义资源，使其可供所有客户端使用。
<!--
## Choosing a method for adding custom resources
-->
选择添加自定义资源的方法
<!--
CRDs are easier to use. Aggregated APIs are more flexible. Choose the method that best meets your needs.
-->
CRD更易于使用。API集合更加灵活。选择更能满足您需求的方法。
<!--
Typically, CRDs are a good fit if:
-->
通常，CRD更适合以下几个方面：
<!--
* You have a handful of fields
* You are using the resource within your company, or as part of a small open-source project (as opposed to a commercial product)
-->
*你有几个字段。
*你正在使用公司内的资源，或者一个小的开源项目的一部分（区别于商业产品）
<!--
### Comparing ease of use
-->
###比较易用性
<!--
CRDs are easier to create than Aggregated APIs.
-->
CRD比API集合更容易创建。
<!--
| CRDs                        | Aggregated API |
-->
| CRDs                        | API集合 |
	
<!--
| Do not require programming. Users can choose any language for a CRD controller. | Requires programming in Go and building binary and image. Users can choose any language for a CRD controller. |
-->
不需要编程。用户可以为CRD控制器选择任何语言。|需要在Go中编程并构建二进制和镜像。用户可以为CRD控制器选择任何语言。|
<!--
| No additional service to run; CRs are handled by API Server. | An additional service to create and that could fail. |
-->
|无需运行其他服务;CR由API服务器处理。|要创建其他服务，并可以会失败。|
<!--
| No ongoing support once the CRD is created. Any bug fixes are picked up as part of normal Kubernetes Master upgrades. | May need to periodically pickup bug fixes from upstream and rebuild and update the Aggregated APIserver. |
-->
|一旦CRD创建，无需后续支持。任何错误修复都是正常Kubernetes Master升级的一部分。|可能需要定期从上游拾取错误修复，并重建和更新API集合服务器。|
<!--
| No need to handle multiple versions of your API. For example: when you control the client for this resource, you can upgrade it in sync with the API. | You need to handle multiple versions of your API, for example: when developing an extension to share with the world. |
-->
|无需处理API的多个版本。例如：当您控制此资源的客户端时，可以将其与 API 同步升级。|你需要处理API的多个版本，例如：当开发一个扩展，与世界分享时。|
<!--
### Advanced features and flexibility
-->
高级功能和灵活性
<!--
Aggregated APIs offer more advanced API features and customization of other features, for example: the storage layer.
-->
API集合提供更高级的API特性以及其他功能的自定义，例如：存储层。
<!--
| Feature | Description | CRDs | Aggregated API |
-->
|特性|描述|CRDs|API集合|
			
<!--
| Validation | Help users prevent errors and allow you to evolve your API independently of your clients. These features are most useful when there are many clients who can't all update at the same time. | Yes.  Most validation can be specified in the CRD using [OpenAPI v3.0 validation](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation).  Any other validations supported by addition of a [Validating Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9). | Yes, arbitrary validation checks |
-->
|验证|帮助用户避免错误并且允许您独立于客户端发展API。|是的。大多数验证可以在CRD中使用OpenAPI v3.0来验证。其他验证可以通过添加验证的网络挂接（webhook）来支持。|是的，任意验证检查。|
<!--
| Defaulting | See above | Yes, via a [Mutating Webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook-beta-in-1-9); Planned, via CRD OpenAPI schema. | Yes |
|违约|见上文|是的，通过突变的网络挂接；规划，通过CRD OpenAPI架构。|是的|
-->
<!--
| Multi-versioning | Allows serving the same object through two API versions. Can help ease API changes like renaming fields. Less important if you control your client versions. | [Yes](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning) | Yes |
-->
|多版本|允许通过两个API版本为同一对象提供服务。可帮助简化 API 更改,如重命名字段。如果您控制客户端版本,则不太重要。|是的|是的|
<!--
| Custom Storage | If you need storage with a different performance mode (for example, time-series database instead of key-value store) or isolation for security (for example, encryption secrets or different | No | Yes |
-->
|自定义存储|如果需要不同性能模式的存储（例如，时间序列数据库而不是密钥值存储）或为了安全进行隔离（例如，加密机密或不同的）|不是|是的|
| Custom Business Logic | Perform arbitrary checks or actions when creating, reading, updating or deleting an object | Yes, using [Webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks). | Yes |
<!--
| Scale Subresource | Allows systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with your new resource | [Yes](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#scale-subresource)  | Yes |
-->
|缩放子资源|允许水平Pod自动缩放器和Pod中断预算等系统与您的新资源进行交互|是的|是的|
<!--
| Status Subresource | <ul><li>Finer-grained access control: user writes spec section, controller writes status section.</li><li>Allows incrementing object Generation on custom resource data mutation (requires separate spec and status sections in the resource)</li></ul> | [Yes](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#status-subresource) | Yes |
-->
|状态子资源| ·细粒度访问控制：用户写入规范部分，控制器写入状态部分。 ·允许递增对象在自定义资源数据突变生成。（需要资源中的单独规范和状态部分）|是的|是的|
<!--
| Other Subresources | Add operations other than CRUD, such as "logs" or "exec". | No | Yes |
-->
|其他子资源|添加 CRUD 以外的操作,如"日志"或"执行"。|不是|是的|
<!--
| strategic-merge-patch | The new endpoints support PATCH with `Content-Type: application/strategic-merge-patch+json`. Useful for updating objects that may be modified both locally, and by the server. For more information, see ["Update API Objects in Place Using kubectl patch"](/docs/tasks/run-application/update-api-object-kubectl-patch/) | No | Yes |
-->
|战略-合并-补丁|新的端点支持具有Content-Type: application/strategic-merge-patch+json.的补丁。可用于更新可在本地和服务器修改的对象。更多信息，请参阅《使用kubectl修补程序更新API对象》|不是|是的|
<!--
| Protocol Buffers | The new resource supports clients that want to use Protocol Buffers | No | Yes |
-->
|协议缓冲区|新资源支持希望使用协议缓冲区的客户端|不是|是的|
<!--
| OpenAPI Schema | Is there an OpenAPI (swagger) schema for the types that can be dynamically fetched from the server? Is the user protected from misspelling field names by ensuring only allowed fields are set? Are types enforced (in other words, don't put an `int` in a `string` field?) | No, but planned | Yes |
-->
|开放API模版|是否有可从服务器动态提取类型的开放API模版？用户通过确保只设置允许的字段来避免拼写错误的字段名称是否被设置？是否是强制执行类型（换句话说，不要在字符串字段中放置int？）|不，但有计划|是的|
<!--
### Common Features
-->
常见功能
<!--
When you create a custom resource, either via a CRDs or an AA, you get many features for your API, compared to implementing it outside the Kubernetes platform:
-->
与在Kubernetes平台之外实现它相比，当通过CRD或AA创建自定义资源时，您可以获得API的许多功能：
<!--
| Feature | What it does |
-->
|功能|作用|
| ------- | ------------ |
<!--
| CRUD | The new endpoints support CRUD basic operations via HTTP and `kubectl` |
-->
|CRUD|通过HTTP和kubectl，新的端点通过HTTP和kubectl支持CRUD基本操作|
<!--
| Watch | The new endpoints support Kubernetes Watch operations via HTTP |
-->
|监视|新的端点通过HTTP支持Kubernetes监视功能|
<!--
| Discovery | Clients like kubectl and dashboard automatically offer list, display, and field edit operations on your resources |
-->
|发现|如Kubectl和dashboard客户端会自动提供资源上的列表、显示和字段编辑操作|
<!--
| json-patch | The new endpoints support PATCH with `Content-Type: application/json-patch+json` |
-->
| json-patch|新的端点支持具有内容类型的补丁：应用程序/ json-patch+json|
<!--
| merge-patch | The new endpoints support PATCH with `Content-Type: application/merge-patch+json` |
-->
| merge-patch|新的端点支持具有内容类型的补丁：应用程序/ merge -patch+json|
<!--
| HTTPS | The new endpoints uses HTTPS |
-->
|HTTP|新的端点使用HTTPS|
<!--
| Built-in Authentication | Access to the extension uses the core apiserver (aggregation layer) for authentication |
-->
|内置身份验证|对扩展的访问使用核心API服务（聚合层）进行身份认证
<!--
| Built-in Authorization | Access to the extension can reuse the authorization used by the core apiserver (e.g. RBAC) |
-->
|内置授权|对扩展的访问可以重用被核心API服务使用的授权（例如，RBAC）|
<!--
| Finalizers | Block deletion of extension resources until external cleanup happens. |
-->
|终结器|阻止删除扩展资源,直到进行外部清理。|
<!--
| Admission Webhooks | Set default values and validate extension resources during any create/update/delete operation. |
-->
|入场网络钩子|在任何创建/更新/删除操作期间设置默认值并验证扩展资源。|
<!--
| UI/CLI Display | Kubectl, dashboard can display extension resources. |
-->
|UI/CLI 显示| Kubectl,和dashboard可以显示扩展资源。|
<!--
| Unset vs Empty | Clients can distinguish unset fields from zero-valued fields. |
-->
|未设置与空|客户端可以把未设置字段从零值字段中区分出来。|
<!--
| Client Libraries Generation | Kubernetes provides generic client libraries, as well as tools to generate type-specific client libraries. |
-->
|客户端库生成| Kubernetes 提供通用客户端库，以及用于生成特定客户端库的工具。
<!--
| Labels and annotations | Common metadata across objects that tools know how to edit for core and custom resources. |
-->
|标签和注释|工具知道如何编辑核心和自定义资源的跨对象的通用元数据|
<!--
## Preparing to install a custom resource
-->
##准备安装自定义资源
<!--
There are several points to be aware of before adding a custom resource to your cluster.
-->
在将自定义资源添加到群集之前,需要注意几个要点。
<!--
### Third party code and new points of failure
-->
###第三方代码和新的故障点
<!--
While creating a CRD does not automatically add any new points of failure (for example, by causing third party code to run on your API server), packages (for example, Charts) or other installation bundles often include CRDs as well as a Deployment of third-party code that implements the business logic for a new custom resource.
-->
虽然创建CRD不会自动添加任何新的故障点（例如，通过第三方代码在API服务器上运行），但包（例如，图表）或其他安装捆绑包经常包括CRD以及部署第三方代码来实现新的自定义资源的业务逻辑。
<!--
Installing an Aggregated APIserver always involves running a new Deployment.
-->
安装新的聚合API服务器总是涉及运行新的部署。
<!--
### Storage
-->
###存储
<!--
Custom resources consume storage space in the same way that ConfigMaps do. Creating too many custom resources may overload your API server's storage space.
-->
自定义资源与配置映射以相同的方式消耗存储空间。创建过多的自定义资源会过载API服务器的存储空间。
<!--
Aggregated API servers may use the same storage as the main API server, in which case the same warning applies.
-->
聚合API服务器可以使用与主API服务器相同的存储，在这种情况下,将应用相同的警告。
<!--
### Authentication, authorization, and auditing
-->
###身份验证、授权和审核
<!--
CRDs always use the same authentication, authorization, and audit logging as the built-in resources of your API Server.
-->
CRD始终使用与API服务器内置资源相同的身份验证、授权和审核日志记录。
<!--
If you use RBAC for authorization, most RBAC roles will not grant access to the new resources (except the cluster-admin role or any role created with wildcard rules). You'll need to explicitly grant access to the new resources. CRDs and Aggregated APIs often come bundled with new role definitions for the types they add.
-->
如果使用RBAC进行授权，大多数RBAC角色不会授予对新资源的访问权限（除了集群管理员角色或任何通配符规则创建的角色）。您需要明确授予对新资源的访问权限。CRD和聚合API通常与他们添加类型的新角色定义捆绑。
<!--
Aggregated API servers may or may not use the same authentication, authorization, and auditing as the primary API server.
-->
聚合API服务器可能使用或不使用与主API服务器相同的身份验证，授权和审核。
<!--
## Accessing a custom resource
-->
##访问自定义资源
<!--
Kubernetes [client libraries](/docs/reference/using-api/client-libraries/) can be used to access custom resources. Not all client libraries support custom resources. The go and python client libraries do.
-->
Kubernetes 客户端库可用于访问自定义资源。并非所有客户端库都支持自定义资源。go 和 python 客户端库可以。
<!--
When you add a custom resource, you can access it using:
-->
当你添加了一个自定义资源，可以使用一下命令来访问它：
<!--
- kubectl
- The kubernetes dynamic client.
- A REST client that you write.
- A client generated using [Kubernetes client generation tools](https://github.com/kubernetes/code-generator) (generating one is an advanced undertaking, but some projects may provide a client along with the CRD or AA).
-->
· kubectl
·kubernetes动态客户端。
·你编写的REST客户端。
·使用 Kubernetes 客户端生成工具生成的客户端（生成是一个高级的任务，但有些项目可能会提供客户端以及CRD或AA）
{{% /capture %}}
{{% capture whatsnext %}}
<!--
* Learn how to [Extend the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
-->
·了解如何使用聚合层扩展 Kubernetes API。
<!--
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/).
-->
了解如何使用自定义资源定义扩展 Kubernetes API。
{{% /capture %}}

