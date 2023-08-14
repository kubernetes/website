---
title: 服务（Service）
feature:
  title: 服务发现与负载均衡
  description: >
    无需修改你的应用程序去使用陌生的服务发现机制。Kubernetes 为容器提供了自己的 IP 地址和一个 DNS 名称，并且可以在它们之间实现负载均衡。
description: >-
  将在集群中运行的应用程序暴露在单个外向端点后面，即使工作负载分散到多个后端也是如此。
content_type: concept
weight: 10
---
<!--
reviewers:
- bprashanth
title: Service
feature:
  title: Service discovery and load balancing
  description: >
    No need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.
description: >-
  Expose an application running in your cluster behind a single outward-facing
  endpoint, even when the workload is split across multiple backends.
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
{{< glossary_definition term_id="service" length="short" >}}
-->
{{< glossary_definition term_id="service" length="short" prepend="Kubernetes 中 Service 是" >}}

<!--
A key aim of Services in Kubernetes is that you don't need to modify your existing
application to use an unfamiliar service discovery mechanism.
You can run code in Pods, whether this is a code designed for a cloud-native world, or
an older app you've containerized. You use a Service to make that set of Pods available
on the network so that clients can interact with it.
-->
Kubernetes 中 Service 的一个关键目标是让你无需修改现有应用程序就能使用不熟悉的服务发现机制。
你可以在 Pod 中运行代码，无需顾虑这是为云原生世界设计的代码，还是为已容器化的老应用程序设计的代码。
你可以使用 Service 让一组 Pod 在网络上可用，让客户端能够与其交互。

<!--
If you use a {{< glossary_tooltip term_id="deployment" >}} to run your app,
that Deployment can create and destroy Pods dynamically. From one moment to the next,
you don't know how many of those Pods are working and healthy; you might not even know
what those healthy Pods are named.
Kubernetes {{< glossary_tooltip term_id="pod" text="Pods" >}} are created and destroyed
to match the desired state of your cluster. Pods are ephemeral resources (you should not
expect that an individual Pod is reliable and durable).
-->
如果你使用 {{< glossary_tooltip term_id="deployment" >}} 来运行你的应用，
Deployment 可以动态地创建和销毁 Pod。不管是这一刻还是下一刻，
你不知道有多少个这样的 Pod 正在工作以及健康与否；你可能甚至不知道那些健康的 Pod 是如何命名的。
Kubernetes {{< glossary_tooltip term_id="pod" text="Pod" >}} 被创建和销毁以匹配集群的预期状态。
Pod 是临时资源（你不应该期待单个 Pod 既可靠又耐用）。

<!--
Each Pod gets its own IP address (Kubernetes expects network plugins to ensure this).
For a given Deployment in your cluster, the set of Pods running in one moment in
time could be different from the set of Pods running that application a moment later.

This leads to a problem: if some set of Pods (call them "backends") provides
functionality to other Pods (call them "frontends") inside your cluster,
how do the frontends find out and keep track of which IP address to connect
to, so that the frontend can use the backend part of the workload?
-->
每个 Pod 获取其自己的 IP 地址（Kubernetes 期待网络插件确保 IP 地址分配）。
对于集群中给定的 Deployment，这一刻运行的这组 Pod 可能不同于下一刻运行应用程序的那组 Pod。

这导致了一个问题： 如果一组 Pod（称为“后端”）为集群内的其他 Pod（称为“前端”）提供功能，
那么前端如何找出并跟踪要连接的 IP 地址，以便前端可以使用提供工作负载的后端部分？

<!-- body -->

<!--
## Services in Kubernetes

The Service API, part of Kubernetes, is an abstraction to help you expose groups of
Pods over a network. Each Service object defines a logical set of endpoints (usually
these endpoints are Pods) along with a policy about how to make those pods accessible.
-->
## Kubernetes 中的 Service   {#service-in-k8s}

Service API 是 Kubernetes 的组成部分，它是一种抽象，帮助你通过网络暴露 Pod 组合。
每个 Service 对象定义一个逻辑组的端点（通常这些端点是 Pod）以及如何才能访问这些 Pod 的策略。

<!--
For example, consider a stateless image-processing backend which is running with
3 replicas.  Those replicas are fungible&mdash;frontends do not care which backend
they use.  While the actual Pods that compose the backend set may change, the
frontend clients should not need to be aware of that, nor should they need to keep
track of the set of backends themselves.

The Service abstraction enables this decoupling.
-->
举个例子，考虑一个图片处理后端，它运行了 3 个副本。这些副本是可互换的 ——
前端不需要关心它们调用了哪个后端副本。
然而组成这一组后端程序的 Pod 实际上可能会发生变化，
前端客户端不应该也没必要知道，而且也不需要跟踪这一组后端的状态。

Service 定义的抽象能够解耦这种关联。

<!--
The set of Pods targeted by a Service is usually determined
by a {{< glossary_tooltip text="selector" term_id="selector" >}} that you
define.
To learn about other ways to define Service endpoints,
see [Services _without_ selectors](#services-without-selectors).
-->
Service 针对的这组 Pod 通常由你定义的{{< glossary_tooltip text="选择算符" term_id="selector" >}}来确定。
若想了解定义 Service 端点的其他方式，可以查阅[**不带**选择算符的 Service](#services-without-selectors)。

<!--
If your workload speaks HTTP, you might choose to use an
[Ingress](/docs/concepts/services-networking/ingress/) to control how web traffic
reaches that workload.
Ingress is not a Service type, but it acts as the entry point for your
cluster. An Ingress lets you consolidate your routing rules into a single resource, so
that you can expose multiple components of your workload, running separately in your
cluster, behind a single listener.
-->
如果你的工作负载以 HTTP 通信，你可能会选择使用 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
来控制 Web 流量如何到达该工作负载。Ingress 不是一种 Service，但它可用作集群的入口点。
Ingress 能让你将路由规则整合到单个资源，这样你就能在单个侦听器之后暴露工作负载的多个组件，在集群中分别运行这些组件。

<!--
The [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) API for Kubernetes
provides extra capabilities beyond Ingress and Service. You can add Gateway to your cluster -
it is a family of extension APIs, implemented using
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} -
and then use these to configure access to network services that are running in your cluster.
-->
Kubernetes 所用的 [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) API
提供了除 Ingress 和 Service 之外的更多功能。你可以添加 Gateway 到你的集群。Gateway 是使用
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
实现的一系列扩展 API。将 Gateway 添加到你的集群后，就可以使用这些 Gateway 配置如何访问集群中正运行的网络服务。

<!--
### Cloud-native service discovery

If you're able to use Kubernetes APIs for service discovery in your application,
you can query the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
for matching EndpointSlices. Kubernetes updates the EndpointSlices for a Service
whenever the set of Pods in a Service changes.

For non-native applications, Kubernetes offers ways to place a network port or load
balancer in between your application and the backend Pods.
-->
### 云原生服务发现   {#cloud-native-discovery}

如果你想要在应用程序中使用 Kubernetes API 进行服务发现，则可以查询
{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}用于匹配 EndpointSlices。
只要服务中的这组 Pod 发生变化，Kubernetes 就会为服务更新 EndpointSlices。

对于非本机应用程序，Kubernetes 提供了在应用程序和后端 Pod 之间放置网络端口或负载均衡器的方法。

<!--
## Defining a Service

A Service in Kubernetes is an
{{< glossary_tooltip text="object" term_id="object" >}}
(the same way that a Pod or a ConfigMap is an object). You can create,
view or modify Service definitions using the Kubernetes API. Usually
you use a tool such as `kubectl` to make those API calls for you.
-->
## 定义 Service   {#defining-a-service}

Service 在 Kubernetes 中是一个{{< glossary_tooltip text="对象" term_id="object" >}}
（与 Pod 或 ConfigMap 类似的对象）。你可以使用 Kubernetes API 创建、查看或修改 Service 定义。
通常你使用 `kubectl` 这类工具来进行这些 API 调用。

<!--
For example, suppose you have a set of Pods that each listen on TCP port 9376
and are labelled as `app.kubernetes.io/name=MyApp`. You can define a Service to
publish that TCP listener:
-->
例如，假定有一组 Pod，每个 Pod 都在侦听 TCP 端口 9376，同时还被打上 `app.kubernetes.io/name=MyApp` 标签。
你可以定义一个 Service 来发布 TCP 侦听器。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

<!--
Applying this manifest creates a new Service named "my-service" with the default
ClusterIP [service type](#publishing-services-service-types). The Service
targets TCP port 9376 on any Pod with the `app.kubernetes.io/name: MyApp` label.

Kubernetes assigns this Service an IP address (the _cluster IP_),
that is used by the virtual IP address mechanism. For more details on that mechanism,
read [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/).
-->
应用上述清单将创建一个名称为 "my-service" 的新 Service，
该服务[服务类型](#publishing-services-service-types)默认为 ClusterIP。
该服务指向带有标签 `app.kubernetes.io/name: MyApp` 的所有 Pod 的TCP 端口 9376。

Kubernetes 为该服务分配一个 IP 地址（有时称为 “集群 IP”），该 IP 地址由虚拟 IP 地址机制使用。
有关该机制的更多详情，请阅读[虚拟 IP 和服务代理](/zh-cn/docs/reference/networking/virtual-ips/)。

<!--
The controller for that Service continuously scans for Pods that
match its selector, and then makes any necessary updates to the set of
EndpointSlices for the Service.
-->
Service 的控制器不断扫描与其选择算符匹配的 Pod，然后对 Service 的 EndpointSlices 集合执行所有必要的更新。

<!--
The name of a Service object must be a valid
[RFC 1035 label name](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names).
-->
Service 对象的名称必须是有效的
[RFC 1035 标签名称](/zh-cn/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names)。

{{< note >}}
<!--
A Service can map _any_ incoming `port` to a `targetPort`. By default and
for convenience, the `targetPort` is set to the same value as the `port`
field.
-->
需要注意的是，Service 能够将一个接收 `port` 映射到任意的 `targetPort`。
默认情况下，`targetPort` 将被设置为与 `port` 字段相同的值。
{{< /note >}}

<!--
### Port definitions {#field-spec-ports}

Port definitions in Pods have names, and you can reference these names in the
`targetPort` attribute of a Service. For example, we can bind the `targetPort`
of the Service to the Pod port in the following way:
-->
### 端口定义 {#field-spec-ports}

Pod 中的端口定义是有名字的，你可以在 Service 的 `targetPort` 属性中引用这些名称。
例如，我们可以通过以下方式将 Service 的 `targetPort` 绑定到 Pod 端口：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc
```

<!--
This works even if there is a mixture of Pods in the Service using a single
configured name, with the same network protocol available via different
port numbers. This offers a lot of flexibility for deploying and evolving
your Services. For example, you can change the port numbers that Pods expose
in the next version of your backend software, without breaking clients.
-->
即使 Service 中使用同一配置名称混合使用多个 Pod，各 Pod 通过不同的端口号支持相同的网络协议，
此功能也可以使用。这为 Service 的部署和演化提供了很大的灵活性。
例如，你可以在新版本中更改 Pod 中后端软件公开的端口号，而不会破坏客户端。

<!--
The default protocol for Services is
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp); you can also
use any other [supported protocol](/docs/reference/networking/service-protocols/).

Because many Services need to expose more than one port, Kubernetes supports
+[multiple port definitions](#multi-port-services) for a single Service.
Each port definition can have the same `protocol`, or a different one.
-->
服务的默认协议是 [TCP](/zh-cn/docs/reference/networking/service-protocols/#protocol-tcp)；
你还可以使用任何其他[受支持的协议](/zh-cn/docs/reference/networking/service-protocols/)。

由于许多服务需要公开多个端口，所以 Kubernetes 针对单个服务支持[多个端口定义](#multi-port-services)。
每个端口定义可以具有相同的 `protocol`，也可以具有不同的协议。

<!--
### Services without selectors

Services most commonly abstract access to Kubernetes Pods thanks to the selector,
but when used with a corresponding set of
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}
objects and without a selector, the Service can abstract other kinds of backends,
including ones that run outside the cluster.
-->
### 没有选择算符的 Service   {#services-without-selectors}

由于选择算符的存在，服务最常见的用法是为 Kubernetes Pod 的访问提供抽象，
但是当与相应的 {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}
对象一起使用且没有选择算符时，
服务也可以为其他类型的后端提供抽象，包括在集群外运行的后端。

<!--
For example:

* You want to have an external database cluster in production, but in your
  test environment you use your own databases.
* You want to point your Service to a Service in a different
  {{< glossary_tooltip term_id="namespace" >}} or on another cluster.
* You are migrating a workload to Kubernetes. While evaluating the approach,
  you run only a portion of your backends in Kubernetes.
-->
例如：

* 希望在生产环境中使用外部的数据库集群，但测试环境使用自己的数据库。
* 希望服务指向另一个 {{< glossary_tooltip term_id="namespace" >}} 中或其它集群中的服务。
* 你正在将工作负载迁移到 Kubernetes。在评估该方法时，你仅在 Kubernetes 中运行一部分后端。

<!--
In any of these scenarios you can define a Service _without_ specifying a
selector to match Pods. For example:
-->
在任何这些场景中，都能够定义**未**指定与 Pod 匹配的选择算符的 Service。例如：
实例:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

<!--
Because this Service has no selector, the corresponding EndpointSlice (and
legacy Endpoints) objects are not created automatically. You can map the Service
to the network address and port where it's running, by adding an EndpointSlice
object manually. For example:
-->
由于此服务没有选择算符，因此不会自动创建相应的 EndpointSlice（和旧版 Endpoint）对象。
你可以通过手动添加 EndpointSlice 对象，将服务映射到运行该服务的网络地址和端口：

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 按惯例将服务的名称用作 EndpointSlice 名称的前缀
  labels:
    # 你应设置 "kubernetes.io/service-name" 标签。
    # 设置其值以匹配服务的名称
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: '' # 留空，因为 port 9376 未被 IANA 分配为已注册端口
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6" # 此列表中的 IP 地址可以按任何顺序显示
      - "10.1.2.3"
```

<!--
#### Custom EndpointSlices

When you create an [EndpointSlice](#endpointslices) object for a Service, you can
use any name for the EndpointSlice. Each EndpointSlice in a namespace must have a
unique name. You link an EndpointSlice to a Service by setting the
`kubernetes.io/service-name` {{< glossary_tooltip text="label" term_id="label" >}}
on that EndpointSlice.
-->
#### 自定义 EndpointSlices

当为服务创建 [EndpointSlice](#endpointslices) 对象时，可以为 EndpointSlice 使用任何名称。
命名空间中的每个 EndpointSlice 必须有一个唯一的名称。通过在 EndpointSlice 上设置
`kubernetes.io/service-name` {{< glossary_tooltip text="label" term_id="label" >}}
可以将 EndpointSlice 链接到服务。

{{< note >}}
<!--
The endpoint IPs _must not_ be: loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), or
link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6).

The endpoint IP addresses cannot be the cluster IPs of other Kubernetes Services,
because {{< glossary_tooltip term_id="kube-proxy" >}} doesn't support virtual IPs
as a destination.
-->
端点 IP 地址**必须不是** ：本地回路地址（IPv4 的 127.0.0.0/8、IPv6 的 ::1/128）
或链路本地地址（IPv4 的 169.254.0.0/16 和 224.0.0.0/24、IPv6 的 fe80::/64）。

端点 IP 地址不能是其他 Kubernetes 服务的集群 IP，因为
{{< glossary_tooltip term_id ="kube-proxy">}} 不支持将虚拟 IP 作为目标。
{{< /note >}}

<!--
For an EndpointSlice that you create yourself, or in your own code,
you should also pick a value to use for the [`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by) label.
If you create your own controller code to manage EndpointSlices, consider using a
value similar to `"my-domain.example/name-of-controller"`. If you are using a third
party tool, use the name of the tool in all-lowercase and change spaces and other
punctuation to dashes (`-`).
If people are directly using a tool such as `kubectl` to manage EndpointSlices,
use a name that describes this manual management, such as `"staff"` or
`"cluster-admins"`. You should
avoid using the reserved value `"controller"`, which identifies EndpointSlices
managed by Kubernetes' own control plane.
-->
对于你自己或在你自己代码中创建的 EndpointSlice，你还应该为
[`endpointslice.kubernetes.io/managed-by`](/zh-cn/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by)
标签拣选一个值。如果你创建自己的控制器代码来管理 EndpointSlice，
请考虑使用类似于 `"my-domain.example/name-of-controller"` 的值。
如果你使用的是第三方工具，请使用全小写的工具名称，并将空格和其他标点符号更改为短划线 (`-`)。
如果人们直接使用 `kubectl` 之类的工具来管理 EndpointSlices，请使用描述这种手动管理的名称，
例如 `"staff"` 或 `"cluster-admins"`。你应该避免使用保留值 `"controller"`，
该值标识由 Kubernetes 自己的控制平面管理的 EndpointSlices。

<!--
#### Accessing a Service without a selector {#service-no-selector-access}

Accessing a Service without a selector works the same as if it had a selector.
In the [example](#services-without-selectors) for a Service without a selector, traffic is routed to one of the two endpoints defined in
the EndpointSlice manifest: a TCP connection to 10.1.2.3 or 10.4.5.6, on port 9376.
-->
#### 访问没有选择算符的 Service   {#service-no-selector-access}

访问没有选择算符的 Service，与有选择算符的 Service 的原理相同。
在没有选择算符的 Service [示例](#services-without-selectors)中，
流量被路由到 EndpointSlice 清单中定义的两个端点之一：
通过 TCP 协议连接到 10.1.2.3 或 10.4.5.6 的端口 9376。

{{< note >}}
<!--
The Kubernetes API server does not allow proxying to endpoints that are not mapped to
pods. Actions such as `kubectl proxy <service-name>` where the service has no
selector will fail due to this constraint. This prevents the Kubernetes API server
from being used as a proxy to endpoints the caller may not be authorized to access.
-->
Kubernetes API 服务器不允许代理到未被映射至 Pod 上的端点。由于此约束，当 Service
没有选择算符时，诸如 `kubectl proxy <service-name>` 之类的操作将会失败。这可以防止
Kubernetes API 服务器被用作调用者可能无权访问的端点的代理。
{{< /note >}}

<!--
An `ExternalName` Service is a special case of Service that does not have
selectors and uses DNS names instead. For more information, see the
[ExternalName](#externalname) section.
-->
`ExternalName` Service 是 Service 的特例，它没有选择算符，而是使用 DNS 名称。
有关更多信息，请参阅 [ExternalName](#externalname) 一节。

<!--
### EndpointSlices
-->
### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
[EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) are objects that
represent a subset (a _slice_) of the backing network endpoints for a Service.

Your Kubernetes cluster tracks how many endpoints each EndpointSlice represents.
If there are so many endpoints for a Service that a threshold is reached, then
Kubernetes adds another empty EndpointSlice and stores new endpoint information
there.
By default, Kubernetes makes a new EndpointSlice once the existing EndpointSlices
all contain at least 100 endpoints. Kubernetes does not make the new EndpointSlice
until an extra endpoint needs to be added.

See [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) for more
information about this API.
-->
[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
这些对象表示针对服务的后备网络端点的子集（**切片**）。

你的 Kubernetes 集群会跟踪每个 EndpointSlice 表示的端点数量。
如果服务的端点太多以至于达到阈值，Kubernetes 会添加另一个空的 EndpointSlice 并在其中存储新的端点信息。
默认情况下，一旦现有 EndpointSlice 都包含至少 100 个端点，Kubernetes 就会创建一个新的 EndpointSlice。
在需要添加额外的端点之前，Kubernetes 不会创建新的 EndpointSlice。

参阅 [EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
了解有关该 API 的更多信息。

<!--
### Endpoints

In the Kubernetes API, an
[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
(the resource kind is plural) defines a list of network endpoints, typically
referenced by a Service to define which Pods the traffic can be sent to.

The EndpointSlice API is the recommended replacement for Endpoints.
-->
### Endpoints

在 Kubernetes API 中，[Endpoints](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
（该资源类别为复数）定义了网络端点的列表，通常由 Service 引用，以定义可以将流量发送到哪些 Pod。

推荐用 EndpointSlice API 替换 Endpoints。

<!--
#### Over-capacity endpoints

Kubernetes limits the number of endpoints that can fit in a single Endpoints
object. When there are over 1000 backing endpoints for a Service, Kubernetes
truncates the data in the Endpoints object. Because a Service can be linked
with more than one EndpointSlice, the 1000 backing endpoint limit only
affects the legacy Endpoints API.
-->
#### 超出容量的端点

Kubernetes 限制单个 Endpoints 对象中可以容纳的端点数量。
当一个服务有超过 1000 个后备端点时，Kubernetes 会截断 Endpoints 对象中的数据。
由于一个服务可以链接多个 EndpointSlice，所以 1000 个后备端点的限制仅影响旧版的 Endpoints API。

<!--
In that case, Kubernetes selects at most 1000 possible backend endpoints to store
into the Endpoints object, and sets an
{{< glossary_tooltip text="annotation" term_id="annotation" >}} on the
Endpoints:
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
The control plane also removes that annotation if the number of backend Pods drops below 1000.
-->
这种情况下，Kubernetes 选择最多 1000 个可能的后端端点来存储到 Endpoints 对象中，并在
Endpoints: [`endpoints.kubernetes.io/over-capacity: truncated`](/zh-cn/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity)
上设置{{< glossary_tooltip text="注解" term_id="annotation" >}}。
如果后端 Pod 的数量低于 1000，控制平面也会移除该注解。

<!--
Traffic is still sent to backends, but any load balancing mechanism that relies on the
legacy Endpoints API only sends traffic to at most 1000 of the available backing endpoints.

The same API limit means that you cannot manually update an Endpoints to have more than 1000 endpoints.

### Application protocol
-->
流量仍会发送到后端，但任何依赖旧版 Endpoints API 的负载均衡机制最多只能将流量发送到 1000 个可用的后备端点。

相同的 API 限制意味着你不能手动将 Endpoints 更新为拥有超过 1000 个端点。

### 应用协议    {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
The `appProtocol` field provides a way to specify an application protocol for
each Service port. The value of this field is mirrored by the corresponding
Endpoints and EndpointSlice objects.

This field follows standard Kubernetes label syntax. Values should either be
[IANA standard service names](https://www.iana.org/assignments/service-names) or
domain prefixed names such as `mycompany.com/my-custom-protocol`.
-->
`appProtocol` 字段提供了一种为每个 Service 端口指定应用协议的方式。
此字段的取值会被映射到对应的 Endpoints 和 EndpointSlices 对象。

该字段遵循标准的 Kubernetes 标签语法。
其值可以是 [IANA 标准服务名称](https://www.iana.org/assignments/service-names)
或以域名为前缀的名称，如 `mycompany.com/my-custom-protocol`。

<!--
### Multi-Port Services

For some Services, you need to expose more than one port.
Kubernetes lets you configure multiple port definitions on a Service object.
When using multiple ports for a Service, you must give all of your ports names
so that these are unambiguous.
For example:
-->
### 多端口 Service   {#multi-port-services}

对于某些服务，你需要公开多个端口。
Kubernetes 允许你在 Service 对象上配置多个端口定义。
为服务使用多个端口时，必须提供所有端口名称，以使它们无歧义。
例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
<!--
As with Kubernetes {{< glossary_tooltip term_id="name" text="names">}} in general, names for ports
must only contain lowercase alphanumeric characters and `-`. Port names must
also start and end with an alphanumeric character.

For example, the names `123-abc` and `web` are valid, but `123_abc` and `-web` are not.
-->
与一般的 Kubernetes 名称一样，端口名称只能包含小写字母数字字符 和 `-`。
端口名称还必须以字母数字字符开头和结尾。

例如，名称 `123-abc` 和 `web` 有效，但是 `123_abc` 和 `-web` 无效。
{{< /note >}}

<!--
## Publishing Services (ServiceTypes) {#publishing-services-service-types}

For some parts of your application (for example, frontends) you may want to expose a
Service onto an external IP address, that's outside of your cluster.

Kubernetes `ServiceTypes` allow you to specify what kind of Service you want.

The available `type` values and their behaviors are:
-->
## 发布服务（服务类型）      {#publishing-services-service-types}

对一些应用的某些部分（如前端），可能希望将其暴露给 Kubernetes 集群外部的 IP 地址。

Kubernetes `ServiceTypes` 允许指定你所需要的 Service 类型。

可用的 `type` 值及其行为有：

<!--
[`ClusterIP`](#type-clusterip)
: Exposes the Service on a cluster-internal IP. Choosing this value
  makes the Service only reachable from within the cluster. This is the
  default that is used if you don't explicitly specify a `type` for a Service.
  You can expose the Service to the public internet using an [Ingress](/docs/concepts/services-networking/ingress/) or a
  [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Exposes the Service on each Node's IP at a static port (the `NodePort`).
  To make the node port available, Kubernetes sets up a cluster IP address,
  the same as if you had requested a Service of `type: ClusterIP`.
-->
`ClusterIP`
: 通过集群的内部 IP 暴露服务，选择该值时服务只能够在集群内部访问。
  这也是你没有为服务显式指定 `type` 时使用的默认值。
  你可以使用 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
  或者 [Gateway API](https://gateway-api.sigs.k8s.io/) 向公众暴露服务。

[`NodePort`](#type-nodeport)
: 通过每个节点上的 IP 和静态端口（`NodePort`）暴露服务。
  为了让节点端口可用，Kubernetes 设置了集群 IP 地址，这等同于你请求 `type: ClusterIP` 的服务。

<!--
[`LoadBalancer`](#loadbalancer)
: Exposes the Service externally using an external load balancer. Kubernetes
  does not directly offer a load balancing component; you must provide one, or
  you can integrate your Kubernetes cluster with a cloud provider.

[`ExternalName`](#externalname)
: Maps the Service to the contents of the `externalName` field (for example,
  to the hostname `api.foo.bar.example`). The mapping configures your cluster's
  DNS server to return a `CNAME` record with that external hostname value.
  No proxying of any kind is set up.
-->
[`LoadBalancer`](#loadbalancer)
: 使用云提供商的负载均衡器向外部暴露服务。
  Kubernetes 不直接提供负载均衡组件；你必须提供一个，或者将你的 Kubernetes 集群与云提供商集成。

[`ExternalName`](#externalname)
: 将服务映射到 `externalName` 字段的内容（例如，映射到主机名 `api.foo.bar.example`）。
  该映射将集群的 DNS 服务器配置为返回具有该外部主机名值的 `CNAME` 记录。 
  无需创建任何类型代理。

<!--
The `type` field in the Service API is designed as nested functionality - each level
adds to the previous.  This is not strictly required on all cloud providers, but
the Kubernetes API design for Service requires it anyway.
-->
服务 API 中的 `type` 字段被设计为层层递进的形式 - 每个级别都建立在前一个级别基础上。
并不是所有云提供商都如此严格要求的，但 Kubernetes 的 Service API 设计要求满足这一逻辑。

<!--
### `type: ClusterIP` {#type-clusterip}

This default Service type assigns an IP address from a pool of IP addresses that
your cluster has reserved for that purpose.

Several of the other types for Service build on the `ClusterIP` type as a
foundation.

If you define a Service that has the `.spec.clusterIP` set to `"None"` then
Kubernetes does not assign an IP address. See [headless Services](#headless-services)
for more information.
-->
### `type: ClusterIP` {#type-clusterip}

此默认服务类型从你的集群中有意预留的 IP 地址池中分配一个 IP 地址。

其他几种服务类型在 `ClusterIP` 类型的基础上进行构建。

如果你定义的服务将 `.spec.clusterIP` 设置为 `"None"`，则 Kubernetes
不会分配 IP 地址。有关详细信息，请参阅 [headless 服务](#headless-services)。

<!--
#### Choosing your own IP address

You can specify your own cluster IP address as part of a `Service` creation
request.  To do this, set the `.spec.clusterIP` field. For example, if you
already have an existing DNS entry that you wish to reuse, or legacy systems
that are configured for a specific IP address and difficult to re-configure.

The IP address that you choose must be a valid IPv4 or IPv6 address from within the
`service-cluster-ip-range` CIDR range that is configured for the API server.
If you try to create a Service with an invalid clusterIP address value, the API
server will return a 422 HTTP status code to indicate that there's a problem.
-->
#### 选择自己的 IP 地址   {#choosing-your-own-ip-address}

在 `Service` 创建的请求中，可以通过设置 `spec.clusterIP` 字段来指定自己的集群 IP 地址。
比如，希望替换一个已经已存在的 DNS 条目，或者遗留系统已经配置了一个固定的 IP 且很难重新配置。

用户选择的 IP 地址必须合法，并且这个 IP 地址在 `service-cluster-ip-range` CIDR 范围内，
这对 API 服务器来说是通过一个标识来指定的。
如果 IP 地址不合法，API 服务器会返回 HTTP 状态码 422，表示值不合法。

<!--
Read [avoiding collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions)
to learn how Kubernetes helps reduce the risk and impact of two different Services
both trying to use the same IP address.
-->
阅读[避免冲突](/zh-cn/docs/reference/networking/virtual-ips/#avoiding-collisions)，
了解 Kubernetes 如何协助降低两种不同服务试图使用相同 IP 地址的风险和影响。

<!--
### `type: NodePort` {#type-nodeport}

If you set the `type` field to `NodePort`, the Kubernetes control plane
allocates a port from a range specified by `--service-node-port-range` flag (default: 30000-32767).
Each node proxies that port (the same port number on every Node) into your Service.
Your Service reports the allocated port in its `.spec.ports[*].nodePort` field.

Using a NodePort gives you the freedom to set up your own load balancing solution,
to configure environments that are not fully supported by Kubernetes, or even
to expose one or more nodes' IP addresses directly.
-->
### `type: NodePort`  {#type-nodeport}

如果你将 `type` 字段设置为 `NodePort`，则 Kubernetes 控制平面将在
`--service-node-port-range` 标志指定的范围内分配端口（默认值：30000-32767）。
每个节点将那个端口（每个节点上的相同端口号）代理到你的服务中。
你的服务在其 `.spec.ports[*].nodePort` 字段中报告已分配的端口。

使用 NodePort 可以让你自由设置自己的负载均衡解决方案，
配置 Kubernetes 不完全支持的环境，
甚至直接暴露一个或多个节点的 IP 地址。

<!--
For a node port Service, Kubernetes additionally allocates a port (TCP, UDP or
SCTP to match the protocol of the Service). Every node in the cluster configures
itself to listen on that assigned port and to forward traffic to one of the ready
endpoints associated with that Service. You'll be able to contact the `type: NodePort`
Service, from outside the cluster, by connecting to any node using the appropriate
protocol (for example: TCP), and the appropriate port (as assigned to that Service).
-->
对于 NodePort 服务，Kubernetes 额外分配一个端口（TCP、UDP 或 SCTP 以匹配服务的协议）。
集群中的每个节点都将自己配置为监听分配的端口并将流量转发到与该服务关联的某个就绪端点。
通过使用适当的协议（例如 TCP）和适当的端口（分配给该服务）连接到所有节点，
你将能够从集群外部使用 `type: NodePort` 服务。

<!--
#### Choosing your own port {#nodeport-custom-port}

If you want a specific port number, you can specify a value in the `nodePort`
field. The control plane will either allocate you that port or report that
the API transaction failed.
This means that you need to take care of possible port collisions yourself.
You also have to use a valid port number, one that's inside the range configured
for NodePort use.

Here is an example manifest for a Service of `type: NodePort` that specifies
a NodePort value (30007, in this example):
-->
#### 选择你自己的端口   {#nodeport-custom-port}

如果需要特定的端口号，你可以在 `nodePort` 字段中指定一个值。
控制平面将为你分配该端口或报告 API 事务失败。
这意味着你需要自己注意可能发生的端口冲突。
你还必须使用有效的端口号，该端口号在配置用于 NodePort 的范围内。

以下是 `type: NodePort` 服务的一个示例清单，它指定了一个 NodePort 值（在本例中为 30007）：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    # 默认情况下，为了方便起见，`targetPort` 被设置为与 `port` 字段相同的值。
    - port: 80
      targetPort: 80
      # 可选字段
      # 默认情况下，为了方便起见，Kubernetes 控制平面会从某个范围内分配一个端口号（默认：30000-32767）
      nodePort: 30007
```

<!--
#### Custom IP address configuration for `type: NodePort` Services {#service-nodeport-custom-listen-address}

You can set up nodes in your cluster to use a particular IP address for serving node port
services. You might want to do this if each node is connected to multiple networks (for example:
one network for application traffic, and another network for traffic between nodes and the
control plane).

If you want to specify particular IP address(es) to proxy the port, you can set the
`--nodeport-addresses` flag for kube-proxy or the equivalent `nodePortAddresses`
field of the
[kube-proxy configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
to particular IP block(s).
-->
#### 为 `type: NodePort` 服务自定义 IP 地址配置  {#service-nodeport-custom-listen-address}

你可以在集群中设置节点以使用特定 IP 地址来提供 NodePort 服务。
如果每个节点都连接到多个网络（例如：一个网络用于应用程序流量，另一个网络用于节点和控制平面之间的流量），
你可能需要执行此操作。

如果你要指定特定的 IP 地址来代理端口，可以将 kube-proxy 的 `--nodeport-addresses` 标志或
[kube-proxy 配置文件](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)的等效
`nodePortAddresses` 字段设置为特定的 IP 段。

<!--
This flag takes a comma-delimited list of IP blocks (e.g. `10.0.0.0/8`, `192.0.2.0/25`)
to specify IP address ranges that kube-proxy should consider as local to this node.

For example, if you start kube-proxy with the `--nodeport-addresses=127.0.0.0/8` flag,
kube-proxy only selects the loopback interface for NodePort Services.
The default for `--nodeport-addresses` is an empty list.
This means that kube-proxy should consider all available network interfaces for NodePort.
(That's also compatible with earlier Kubernetes releases.)
-->
此标志采用逗号分隔的 IP 段列表（例如 `10.0.0.0/8`、`192.0.2.0/25`）来指定 kube-proxy 应视为该节点本地的
IP 地址范围。

例如，如果你使用 `--nodeport-addresses=127.0.0.0/8` 标志启动 kube-proxy，
则 kube-proxy 仅选择 NodePort 服务的环回接口。
`--nodeport-addresses` 的默认值是一个空列表。
这意味着 kube-proxy 应考虑 NodePort 的所有可用网络接口。
（这也与早期的 Kubernetes 版本兼容。）

{{< note >}}
<!--
This Service is visible as `<NodeIP>:spec.ports[*].nodePort` and `.spec.clusterIP:spec.ports[*].port`.
If the `--nodeport-addresses` flag for kube-proxy or the equivalent field
in the kube-proxy configuration file is set, `<NodeIP>` would be a filtered node IP address (or possibly IP addresses).
-->
此服务呈现为 `<NodeIP>:spec.ports[*].nodePort` 和 `.spec.clusterIP:spec.ports[*].port`。
如果设置了 kube-proxy 的 `--nodeport-addresses` 标志或 kube-proxy 配置文件中的等效字段，
则 `<NodeIP>` 将是过滤的节点 IP 地址（或可能的 IP 地址）。
{{< /note >}}

<!--
### `type: LoadBalancer` {#loadbalancer}

On cloud providers which support external load balancers, setting the `type`
field to `LoadBalancer` provisions a load balancer for your Service.
The actual creation of the load balancer happens asynchronously, and
information about the provisioned balancer is published in the Service's
`.status.loadBalancer` field.
For example:
-->
### `type: LoadBalancer`  {#loadbalancer}

在使用支持外部负载均衡器的云提供商的服务时，设置 `type` 的值为 `"LoadBalancer"`，
将为 Service 提供负载均衡器。
负载均衡器是异步创建的，关于被提供的负载均衡器的信息将会通过 Service 的
`status.loadBalancer` 字段发布出去。

实例：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

<!--
Traffic from the external load balancer is directed at the backend Pods. The cloud
provider decides how it is load balanced.
-->
来自外部负载均衡器的流量将直接重定向到后端 Pod 上，由云提供商决定如何进行负载平衡。

<!--
To implement a Service of `type: LoadBalancer`, Kubernetes typically starts off
by making the changes that are equivalent to you requesting a Service of
`type: NodePort`. The cloud-controller-manager component then configures the external
load balancer to forward traffic to that assigned node port.

You can configure a load balanced Service to
[omit](#load-balancer-nodeport-allocation) assigning a node port, provided that the
cloud provider implementation supports this.
-->
要实现 `type: LoadBalancer` 的服务，Kubernetes 通常首先进行与请求 `type: NodePort` 服务等效的更改。
cloud-controller-manager 组件随后配置外部负载均衡器以将流量转发到已分配的节点端口。

你可以将负载均衡服务配置为[忽略](#load-balancer-nodeport-allocation)分配节点端口，
前提是云提供商实现支持这点。

<!--
Some cloud providers allow you to specify the `loadBalancerIP`. In those cases, the load-balancer is created
with the user-specified `loadBalancerIP`. If the `loadBalancerIP` field is not specified,
the load Balancer is set up with an ephemeral IP address. If you specify a `loadBalancerIP`
but your cloud provider does not support the feature, the `loadbalancerIP` field that you
set is ignored.
-->
某些云提供商允许设置 `loadBalancerIP`。
在这些情况下，将根据用户设置的 `loadBalancerIP` 来创建负载均衡器。
如果没有设置 `loadBalancerIP` 字段，将会给负载均衡器指派一个临时 IP。
如果设置了 `loadBalancerIP`，但云提供商并不支持这种特性，那么设置的
`loadBalancerIP` 值将会被忽略掉。

{{< note >}}
<!--
The`.spec.loadBalancerIP` field for a Service was deprecated in Kubernetes v1.24.

This field was under-specified and its meaning varies across implementations. It also cannot support dual-stack networking. This field may be removed in a future API version.
-->
针对 Service 的 `.spec.loadBalancerIP` 字段已在 Kubernetes v1.24 中被弃用。

此字段的定义模糊，其含义因实现而异。它也不支持双协议栈联网。
此字段可能会在未来的 API 版本中被移除。

<!--
If you're integrating with a provider that supports specifying the load balancer IP address(es)
for a Service via a (provider specific) annotation, you should switch to doing that.

If you are writing code for a load balancer integration with Kubernetes, avoid using this field.
You can integrate with [Gateway](https://gateway-api.sigs.k8s.io/) rather than Service, or you
can define your own (provider specific) annotations on the Service that specify the equivalent detail.
-->
如果你正在集成某云平台，该平台通过（特定于提供商的）注解为 Service 指定负载均衡器 IP 地址，
你应该切换到这样做。

如果你正在为集成到 Kubernetes 的负载均衡器编写代码，请避免使用此字段。
你可以与 [Gateway](https://gateway-api.sigs.k8s.io/) 而不是 Service 集成，
或者你可以在 Service 上定义自己的（特定于提供商的）注解，以指定等效的细节。
{{< /note >}}

<!--
#### Load balancers with mixed protocol types
-->
#### 混合协议类型的负载均衡器

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
By default, for LoadBalancer type of Services, when there is more than one port defined, all
ports must have the same protocol, and the protocol must be one which is supported
by the cloud provider.

The feature gate `MixedProtocolLBService` (enabled by default for the kube-apiserver as of v1.24) allows the use of
different protocols for LoadBalancer type of Services, when there is more than one port defined.
-->
默认情况下，对于 LoadBalancer 类型的服务，当定义了多个端口时，
所有端口必须具有相同的协议，并且该协议必须是受云提供商支持的协议。

当服务中定义了多个端口时，特性门控 `MixedProtocolLBService`
（在 kube-apiserver 1.24 版本默认为启用）
允许 LoadBalancer 类型的服务使用不同的协议。

{{< note >}}
<!--
The set of protocols that can be used for load balanced Services is defined by your
cloud provider; they may impose restrictions beyond what the Kubernetes API enforces.
-->
可用于负载均衡服务的协议集由你的云提供商决定，他们可能在
Kubernetes API 强制执行的限制之外另加一些约束。

{{< /note >}}

<!--
#### Disabling load balancer NodePort allocation {#load-balancer-nodeport-allocation}
-->
### 禁用负载均衡器节点端口分配 {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
You can optionally disable node port allocation for a Service of `type: LoadBalancer`, by setting
the field `spec.allocateLoadBalancerNodePorts` to `false`. This should only be used for load balancer implementations
that route traffic directly to pods as opposed to using node ports. By default, `spec.allocateLoadBalancerNodePorts`
is `true` and type LoadBalancer Services will continue to allocate node ports. If `spec.allocateLoadBalancerNodePorts`
is set to `false` on an existing Service with allocated node ports, those node ports will **not** be de-allocated automatically.
You must explicitly remove the `nodePorts` entry in every Service port to de-allocate those node ports.
-->
你可以通过设置 `spec.allocateLoadBalancerNodePorts` 为 `false`
对类型为 LoadBalancer 的服务禁用节点端口分配。
这仅适用于直接将流量路由到 Pod 而不是使用节点端口的负载均衡器实现。
默认情况下，`spec.allocateLoadBalancerNodePorts` 为 `true`，
LoadBalancer 类型的服务继续分配节点端口。
如果现有服务已被分配节点端口，将参数 `spec.allocateLoadBalancerNodePorts`
设置为 `false` 时，这些服务上已分配置的节点端口**不会**被自动释放。
你必须显式地在每个服务端口中删除 `nodePorts` 项以释放对应端口。

<!--
#### Specifying class of load balancer implementation {#load-balancer-class}
-->
#### 设置负载均衡器实现的类别 {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
For a Service with `type` set to `LoadBalancer`, the `.spec.loadBalancerClass` field
enables you to use a load balancer implementation other than the cloud provider default.

By default, `.spec.loadBalancerClass` is not set and a `LoadBalancer`
type of Service uses the cloud provider's default load balancer implementation if the
cluster is configured with a cloud provider using the `--cloud-provider` component
flag.
-->
对于 `type` 设置为 `LoadBalancer` 的 Service，
`spec.loadBalancerClass` 字段允许你不使用云提供商的默认负载均衡器实现，
转而使用指定的负载均衡器实现。

默认情况下，`.spec.loadBalancerClass` 未设置，如果集群使用 `--cloud-provider` 配置了云提供商，
`LoadBalancer` 类型服务会使用云提供商的默认负载均衡器实现。

<!--
If you specify `.spec.loadBalancerClass`, it is assumed that a load balancer
implementation that matches the specified class is watching for Services.
Any default load balancer implementation (for example, the one provided by
the cloud provider) will ignore Services that have this field set.
`spec.loadBalancerClass` can be set on a Service of type `LoadBalancer` only.
Once set, it cannot be changed.
-->

如果设置了 `.spec.loadBalancerClass`，则假定存在某个与所指定的类相匹配的负载均衡器实现在监视服务变化。
所有默认的负载均衡器实现（例如，由云提供商所提供的）都会忽略设置了此字段的服务。`.spec.loadBalancerClass`
只能设置到类型为 `LoadBalancer` 的 Service 之上，而且一旦设置之后不可变更。

<!--
The value of `spec.loadBalancerClass` must be a label-style identifier,
with an optional prefix such as "`internal-vip`" or "`example.com/internal-vip`".
Unprefixed names are reserved for end-users.
-->
`.spec.loadBalancerClass` 的值必须是一个标签风格的标识符，
可以有选择地带有类似 "`internal-vip`" 或 "`example.com/internal-vip`" 这类前缀。
没有前缀的名字是保留给最终用户的。

<!--
#### Internal load balancer

In a mixed environment it is sometimes necessary to route traffic from Services inside the same
(virtual) network address block.

In a split-horizon DNS environment you would need two Services to be able to route both external
and internal traffic to your endpoints.

To set an internal load balancer, add one of the following annotations to your Service
depending on the cloud service provider you're using:
-->
#### 内部负载均衡器 {#internal-load-balancer}

在混合环境中，有时有必要在同一(虚拟)网络地址块内路由来自服务的流量。

在水平分割 DNS 环境中，你需要两个服务才能将内部和外部流量都路由到你的端点（Endpoints）。

如要设置内部负载均衡器，请根据你所使用的云运营商，为服务添加以下注解之一：

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
<!--
Select one of the tabs.
-->
选择一个标签。
{{% /tab %}}
{{% tab name="GCP" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        networking.gke.io/load-balancer-type: "Internal"
[...]
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
[...]
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```

{{% /tab %}}
<!--Baidu Cloud-->
{{% tab name="百度云" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```

{{% /tab %}}
<!--Tencent Cloud-->
{{% tab name="腾讯云" %}}

```yaml
[...]
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
[...]
```

{{% /tab %}}
<!--Alibaba Cloud-->
{{% tab name="阿里云" %}}

```yaml
[...]
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
[...]
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/oci-load-balancer-internal: true
[...]
```
{{% /tab %}}
{{< /tabs >}}

<!--
### `type: ExternalName` {#externalname}

Services of type ExternalName map a Service to a DNS name, not to a typical selector such as
`my-service` or `cassandra`. You specify these Services with the `spec.externalName` parameter.

This Service definition, for example, maps
the `my-service` Service in the `prod` namespace to `my.database.example.com`:
-->

### ExternalName 类型         {#externalname}

类型为 ExternalName 的服务将服务映射到 DNS 名称，而不是典型的选择算符，例如 `my-service` 或者 `cassandra`。
你可以使用 `spec.externalName` 参数指定这些服务。

例如，以下 Service 定义将 `prod` 名称空间中的 `my-service` 服务映射到 `my.database.example.com`：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
<!--
A Service of `type: ExternalName` accepts an IPv4 address string, but treats that string as a DNS name comprised of digits,
not as an IP address (the internet does not however allow such names in DNS). Services with external names that resemble IPv4
addresses are not resolved by DNS servers.

If you want to map a Service directly to a specific IP address, consider using [headless Services](#headless-services).
-->
`type: ExternalName` 的服务接受 IPv4 地址字符串，但将该字符串视为由数字组成的 DNS 名称，
而不是 IP 地址（然而，互联网不允许在 DNS 中使用此类名称）。
类似于 IPv4 地址的外部名称不能由 CoreDNS 或 ingress-nginx 解析，因为外部名称旨在指定规范的 DNS 名称。
DNS 服务器不解析类似于 IPv4 地址的外部名称的服务。

如果你想要将服务直接映射到特定的 IP 地址，请考虑使用[无头 Services](#headless-services)。
{{< /note >}}

<!--
When looking up the host `my-service.prod.svc.cluster.local`, the cluster DNS Service
returns a `CNAME` record with the value `my.database.example.com`. Accessing
`my-service` works in the same way as other Services but with the crucial
difference that redirection happens at the DNS level rather than via proxying or
forwarding. Should you later decide to move your database into your cluster, you
can start its Pods, add appropriate selectors or endpoints, and change the
Service's `type`.
-->
当查找主机 `my-service.prod.svc.cluster.local` 时，集群 DNS 服务返回 `CNAME` 记录，
其值为 `my.database.example.com`。
访问 `my-service` 的方式与其他服务的方式相同，但主要区别在于重定向发生在 DNS 级别，而不是通过代理或转发。
如果以后你决定将数据库移到集群中，则可以启动其 Pod，添加适当的选择算符或端点以及更改服务的 `type`。

{{< caution >}}
<!--
You may have trouble using ExternalName for some common protocols, including HTTP and HTTPS.
If you use ExternalName then the hostname used by clients inside your cluster is different from
the name that the ExternalName references.

For protocols that use hostnames this difference may lead to errors or unexpected responses.
HTTP requests will have a `Host:` header that the origin server does not recognize;
TLS servers will not be able to provide a certificate matching the hostname that the client connected to.
-->
对于一些常见的协议，包括 HTTP 和 HTTPS，你使用 ExternalName 可能会遇到问题。
如果你使用 ExternalName，那么集群内客户端使用的主机名与 ExternalName 引用的名称不同。

对于使用主机名的协议，此差异可能会导致错误或意外响应。
HTTP 请求将具有源服务器无法识别的 `Host:` 标头；
TLS 服务器将无法提供与客户端连接的主机名匹配的证书。
{{< /caution >}}

<!--
## Headless Services  {#headless-services}

Sometimes you don't need load-balancing and a single Service IP.  In
this case, you can create what are termed "headless" Services, by explicitly
specifying `"None"` for the cluster IP (`.spec.clusterIP`).

You can use a headless Service to interface with other service discovery mechanisms,
without being tied to Kubernetes' implementation.

For headless `Services`, a cluster IP is not allocated, kube-proxy does not handle
these Services, and there is no load balancing or proxying done by the platform
for them. How DNS is automatically configured depends on whether the Service has
selectors defined:
-->
## 无头服务（Headless Services）  {#headless-services}

有时不需要或不想要负载均衡，以及单独的 Service IP。
遇到这种情况，可以通过显式指定 Cluster IP（`spec.clusterIP`）的值为 `"None"`
来创建 `Headless` Service。

你可以使用一个无头 Service 与其他服务发现机制进行接口，而不必与 Kubernetes 的实现捆绑在一起。

无头 `Services` 不会获得 Cluster IP，kube-proxy 不会处理这类服务，
而且平台也不会为它们提供负载均衡或路由。
DNS 如何实现自动配置，依赖于 Service 是否定义了选择算符。

<!--
### With selectors

For headless Services that define selectors, the Kubernetes control plane creates
EndpointSlice objects in the Kubernetes API, and modifies the DNS configuration to return
A or AAAA records (IPv4 or IPv6 addresses) that point directly to the Pods backing
the Service.
-->
### 带选择算符的服务 {#with-selectors}

对定义了选择算符的无头服务，Kubernetes 控制平面在 Kubernetes API 中创建 EndpointSlice 对象，
并且修改 DNS 配置返回 A 或 AAAA 条记录（IPv4 或 IPv6 地址），这些记录直接指向 `Service` 的后端 Pod 集合。

<!--
### Without selectors

For headless Services that do not define selectors, the control plane does
not create EndpointSlice objects. However, the DNS system looks for and configures
either:

* DNS CNAME records for [`type: ExternalName`](#externalname) Services.
* DNS A / AAAA records for all IP addresses of the Service's ready endpoints,
  for all Service types other than `ExternalName`.
  * For IPv4 endpoints, the DNS system creates A records.
  * For IPv6 endpoints, the DNS system creates AAAA records.

When you define a headless Service without a selector, the `port` must
match the `targetPort`.
-->
### 无选择算符的服务  {#without-selectors}

对没有定义选择算符的无头服务，控制平面不会创建 EndpointSlice 对象。
然而 DNS 系统会查找和配置以下之一：

* 对于 [`type: ExternalName`](#externalname) 服务，查找和配置其 CNAME 记录
* 对所有其他类型的服务，针对 Service 的就绪端点的所有 IP 地址，查找和配置 DNS A / AAAA 条记录
  * 对于 IPv4 端点，DNS 系统创建 A 条记录。
  * 对于 IPv6 端点，DNS 系统创建 AAAA 条记录。

当你定义无选择算符的无头服务时，`port` 必须与 `targetPort` 匹配。

<!--
## Discovering services

For clients running inside your cluster, Kubernetes supports two primary modes of
finding a Service: environment variables and DNS.
-->
## 服务发现  {#discovering-services}

对于在集群内运行的客户端，Kubernetes 支持两种主要的服务发现模式：环境变量和 DNS。

<!--
### Environment variables

When a Pod is run on a Node, the kubelet adds a set of environment variables
for each active Service. It adds `{SVCNAME}_SERVICE_HOST` and `{SVCNAME}_SERVICE_PORT` variables,
where the Service name is upper-cased and dashes are converted to underscores.
It also supports variables (see [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72))
that are compatible with Docker Engine's
"_[legacy container links](https://docs.docker.com/network/links/)_" feature.

For example, the Service `redis-primary` which exposes TCP port 6379 and has been
allocated cluster IP address 10.0.0.11, produces the following environment
variables:
-->
### 环境变量   {#environment-variables}

当 Pod 运行在某 Node 上时，kubelet 会为每个活跃的 Service 添加一组环境变量。
kubelet 为 Pod 添加环境变量 `{SVCNAME}_SERVICE_HOST` 和 `{SVCNAME}_SERVICE_PORT`。
这里 Service 的名称被转为大写字母，横线被转换成下划线。
它还支持与 Docker Engine 的 "**[legacy container links](https://docs.docker.com/network/links/)**" 特性兼容的变量
（参阅 [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)) 。

举个例子，一个 Service `redis-primary` 暴露了 TCP 端口 6379，
同时被分配了 Cluster IP 地址 10.0.0.11，这个 Service 生成的环境变量如下：

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
<!--
When you have a Pod that needs to access a Service, and you are using
the environment variable method to publish the port and cluster IP to the client
Pods, you must create the Service *before* the client Pods come into existence.
Otherwise, those client Pods won't have their environment variables populated.

If you only use DNS to discover the cluster IP for a Service, you don't need to
worry about this ordering issue.
-->
当你的 Pod 需要访问某 Service，并且你在使用环境变量方法将端口和集群 IP 发布到客户端
Pod 时，必须在客户端 Pod 出现**之前**创建该 Service。
否则，这些客户端 Pod 中将不会出现对应的环境变量。

如果仅使用 DNS 查找服务的集群 IP，则无需担心此设定问题。
{{< /note >}}

<!--
Kubernetes also supports and provides variables that are compatible with Docker
Engine's "_[legacy container links](https://docs.docker.com/network/links/)_" feature.
You can read [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
to see how this is implemented in Kubernetes.
-->
Kubernetes 还支持并提供与 Docker Engine 的
"**[legacy container links](https://docs.docker.com/network/links/)**"
兼容的变量。
你可以阅读 [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
来了解这是如何在 Kubernetes 中实现的。

### DNS

<!--
You can (and almost always should) set up a DNS service for your Kubernetes
cluster using an [add-on](/docs/concepts/cluster-administration/addons/).

A cluster-aware DNS server, such as CoreDNS, watches the Kubernetes API for new
Services and creates a set of DNS records for each one.  If DNS has been enabled
throughout your cluster then all Pods should automatically be able to resolve
Services by their DNS name.
-->
你可以（几乎总是应该）使用[附加组件](/zh-cn/docs/concepts/cluster-administration/addons/)
为 Kubernetes 集群安装 DNS 服务。

支持集群的 DNS 服务器（例如 CoreDNS）监视 Kubernetes API 中的新 Service，并为每个 Service 创建一组 DNS 记录。
如果在整个集群中都启用了 DNS，则所有 Pod 都应该能够通过 DNS 名称自动解析 Service。

<!--
For example, if you have a Service called `my-service` in a Kubernetes
namespace `my-ns`, the control plane and the DNS Service acting together
create a DNS record for `my-service.my-ns`. Pods in the `my-ns` namespace
should be able to find the service by doing a name lookup for `my-service`
(`my-service.my-ns` would also work).

Pods in other namespaces must qualify the name as `my-service.my-ns`. These names
will resolve to the cluster IP assigned for the Service.
-->
例如，如果你在 Kubernetes 命名空间 `my-ns` 中有一个名为 `my-service` 的 Service，
则控制平面和 DNS 服务共同为 `my-service.my-ns` 创建 DNS 记录。
名字空间 `my-ns` 中的 Pod 应该能够通过按名检索 `my-service` 来找到服务
（`my-service.my-ns` 也可以）。

其他名字空间中的 Pod 必须将名称限定为 `my-service.my-ns`。
这些名称将解析为为服务分配的集群 IP。

<!--
Kubernetes also supports DNS SRV (Service) records for named ports.  If the
`my-service.my-ns` Service has a port named `http` with the protocol set to
`TCP`, you can do a DNS SRV query for `_http._tcp.my-service.my-ns` to discover
the port number for `http`, as well as the IP address.

The Kubernetes DNS server is the only way to access `ExternalName` Services.
You can find more information about `ExternalName` resolution in
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/).
-->
Kubernetes 还支持命名端口的 DNS SRV（Service）记录。
如果 Service `my-service.my-ns` 具有名为 `http`　的端口，且协议设置为 TCP，
则可以用 `_http._tcp.my-service.my-ns` 执行 DNS SRV 查询以发现 `http` 的端口号以及 IP 地址。

Kubernetes DNS 服务器是唯一的一种能够访问 `ExternalName` 类型的 Service 的方式。
更多关于 `ExternalName` 解析的信息可以查看
[Service 与 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

<!--
## Virtual IP addressing mechanism

Read [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/) to learn about the
mechanism Kubernetes provides to expose a Service with a virtual IP address.
-->
## 虚拟 IP 寻址机制   {#virtual-ip-addressing-mechanism}

阅读[虚拟 IP 和 Service 代理](/zh-cn/docs/reference/networking/virtual-ips/)以了解
Kubernetes 提供的使用虚拟 IP 地址公开服务的机制。

<!--
### Traffic policies

You can set the `.spec.internalTrafficPolicy` and `.spec.externalTrafficPolicy` fields
to control how Kubernetes routes traffic to healthy (“ready”) backends.

See [Traffic Policies](/docs/reference/networking/virtual-ips/#traffic-policies) for more details.
-->
### 流量策略

你可以设置 `.spec.internalTrafficPolicy` 和 `.spec.externalTrafficPolicy`
字段来控制 Kubernetes 如何将流量路由到健康（“就绪”）的后端。

有关详细信息，请参阅[流量策略](/zh-cn/docs/reference/networking/virtual-ips/#traffic-policies)。

<!--
## Session stickiness

If you want to make sure that connections from a particular client are passed to
the same Pod each time, you can configure session affinity based on the client's
IP address. Read [session affinity](/docs/reference/networking/virtual-ips/#session-affinity)
to learn more.
-->
## 会话的黏性   {#session-stickiness}

如果你想确保来自特定客户端的连接每次都传递到同一个 Pod，你可以配置根据客户端 IP 地址来执行的会话亲和性。
深入了解可阅读[会话亲和性](/zh-cn/docs/reference/networking/virtual-ips/#session-affinity)。

<!--
### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes Services
can be exposed on those `externalIPs`. When network traffic arrives into the cluster, with
the external IP (as destination IP) and the port matching that Service, rules and routes
that Kubernetes has configured ensure that the traffic is routed to one of the endpoints
for that Service.

When you define a Service, you can specify `externalIPs` for any
[service type](#publishing-services-service-types).
In the example below, the Service named `"my-service"` can be accessed by clients using TCP,
on `"198.51.100.32:80"` (calculated from `.spec.externalIPs[]` and `.spec.ports[].port`).
-->
### 外部 IP  {#external-ips}

如果有外部 IP 能够路由到一个或多个集群节点上，则 Kubernetes 服务可以暴露在这些 `externalIPs` 上。
当网络流量到达集群时，如果外部 IP（作为目的 IP 地址）和端口都与该 Service 匹配，Kubernetes
配置的规则和路由会确保流量被路由到该 Service 的端点之一。

定义 Service 时，你可以为任何[服务类型](#publishing-services-service-types)指定 `externalIPs`。

在下面的例子中，名为 `my-service` 的服务可以在 "`198.51.100.32:80`"
（从 `.spec.externalIPs[]` 和 `.spec.ports[].port` 计算）上被客户端使用 TCP 协议访问。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
<!--
Kubernetes does not manage allocation of `externalIPs`; these are the responsibility
of the cluster administrator.
-->
Kubernetes 不管理 `externalIPs` 的分配，这属于集群管理员的职责。
{{< /note >}}

<!--
## API Object

Service is a top-level resource in the Kubernetes REST API. You can find more details
about the [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).
-->
## API 对象   {#api-object}

Service 是 Kubernetes REST API 中的顶级资源。你可以找到有关
[Service 对象 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
的更多详细信息。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" /><a id="#the-gory-details-of-virtual-ips" />

## {{% heading "whatsnext" %}}

<!--
Learn more about Services and how they fit into Kubernetes:
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial.
* Read about [Ingress](/docs/concepts/services-networking/ingress/), which
  exposes HTTP and HTTPS routes from outside the cluster to Services within
  your cluster.
* Read about [Gateway](https://gateway-api.sigs.k8s.io/), an extension to
  Kubernetes that provides more flexibility than Ingress.
-->
进一步学习 Service 及其在 Kubernetes 中所发挥的作用：

* 遵循[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程。
* 阅读 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 将来自集群外部的 HTTP 和 HTTPS
  请求路由暴露给集群内的服务。
* 阅读 [Gateway](https://gateway-api.sigs.k8s.io/) 作为 Kubernetes 的扩展提供比 Ingress 更大的灵活性。

<!--
For more context, read the following:
* [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* [Service API reference](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [EndpointSlice API reference](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Endpoint API reference (legacy)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
-->
更多上下文，可以阅读以下内容：

* [虚拟 IP 和 Service 代理](/zh-cn/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
* Service API 的 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/)
* EndpointSlice API 的 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* Endpoint API 的 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
