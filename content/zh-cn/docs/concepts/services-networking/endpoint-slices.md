---
title: EndpointSlice
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  EndpointSlice API 是 Kubernetes 用于扩缩 Service
  以处理大量后端的机制，还允许集群高效更新其健康后端的列表。
---
<!--
reviewers:
- freehan
title: EndpointSlices
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  The EndpointSlice API is the mechanism that Kubernetes uses to let your Service
  scale to handle large numbers of backends, and allows the cluster to update its
  list of healthy backends efficiently.
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

{{< glossary_definition term_id="endpoint-slice" length="short" >}}

<!-- body -->

<!--
## EndpointSlice API {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The control plane automatically creates EndpointSlices
for any Kubernetes Service that has a {{< glossary_tooltip text="selector"
term_id="selector" >}} specified. These EndpointSlices include
references to all the Pods that match the Service selector. EndpointSlices group
network endpoints together by unique combinations of IP family, protocol,
port number, and Service name.
The name of a EndpointSlice object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

As an example, here's a sample EndpointSlice object, that's owned by the `example`
Kubernetes Service.
-->
## EndpointSlice API {#endpointslice-resource}

在 Kubernetes 中，`EndpointSlice` 包含对一组网络端点的引用。
控制面会自动为设置了{{< glossary_tooltip text="选择算符" term_id="selector" >}}的
Kubernetes Service 创建 EndpointSlice。
这些 EndpointSlice 将包含对与 Service 选择算符匹配的所有 Pod 的引用。
EndpointSlice 通过唯一的 IP 地址簇、协议、端口号和 Service 名称将网络端点组织在一起。
EndpointSlice 的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

例如，下面是 Kubernetes Service `example` 所拥有的 EndpointSlice 对象示例。

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

<!--
By default, the control plane creates and manages EndpointSlices to have no
more than 100 endpoints each. You can configure this with the
`--max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
flag, up to a maximum of 1000.

EndpointSlices act as the source of truth for
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} when it comes to
how to route internal traffic.
-->
默认情况下，控制面创建和管理的 EndpointSlice 将包含不超过 100 个端点。
你可以使用 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
的 `--max-endpoints-per-slice` 标志设置此值，最大值为 1000。

当涉及如何路由内部流量时，EndpointSlice 充当
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
的决策依据。

<!--
### Address types

EndpointSlices support two address types:

* IPv4
* IPv6

Each `EndpointSlice` object represents a specific IP address type. If you have
a Service that is available via IPv4 and IPv6, there will be at least two
`EndpointSlice` objects (one for IPv4, and one for IPv6).
-->
### 地址类型

EndpointSlice 支持两种地址类型：

* IPv4
* IPv6

每个 `EndpointSlice` 对象代表一个特定的 IP 地址类型。如果你有一个支持 IPv4 和 IPv6 的 Service，
那么将至少有两个 `EndpointSlice` 对象（一个用于 IPv4，一个用于 IPv6）。

<!--
### Conditions

The EndpointSlice API stores conditions about endpoints that may be useful for consumers.
The three conditions are `serving`, `terminating`, and `ready`.
-->
### 状况

EndpointSlice API 存储了可能对使用者有用的、有关端点的状况。
这三个状况分别是 `serving`、`terminating` 和 `ready`。

<!--
#### Serving
-->
#### Serving（服务中）

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The `serving` condition indicates that the endpoint is currently serving responses, and
so it should be used as a target for Service traffic. For endpoints backed by a Pod, this
maps to the Pod's `Ready` condition.
-->
`serving` 状况表示端点目前正在提供响应，且因此应将其用作 Service 流量的目标。
对于由 Pod 支持的端点，此状况对应于 Pod 的 `Ready` 状况。

<!--
#### Terminating
-->
#### Terminating（终止中）

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The `terminating` condition indicates that the endpoint is
terminating. For endpoints backed by a Pod, this condition is set when
the Pod is first deleted (that is, when it receives a deletion
timestamp, but most likely before the Pod's containers exit).

Service proxies will normally ignore endpoints that are `terminating`,
but they may route traffic to endpoints that are both `serving` and
`terminating` if all available endpoints are `terminating`. (This
helps to ensure that no Service traffic is lost during rolling updates
of the underlying Pods.)
-->
`terminating` 状况表示端点正在终止中。对于由 Pod 支持的端点，
当 Pod 首次被删除时（即收到删除时间戳时，但很可能在容器实际退出之前），会设置此状况。

服务代理通常会忽略处于 `terminating` 状态的端点，但如果所有可用端点都处于 `terminating`，
服务代理可能仍会将流量路由到同时具有 `serving` 和 `terminating` 的端点。
（这样有助于在底层 Pod 滚动更新过程中确保 Service 流量不会中断。）

<!--
#### Ready

The `ready` condition is essentially a shortcut for checking
"`serving` and not `terminating`" (though it will also always be
`true` for Services with `spec.publishNotReadyAddresses` set to
`true`).
-->
#### Ready（就绪）

`ready` 状况本质上是检查 "`serving` 且不是 `terminating`" 的一种简化方式
（不过对于将 `spec.publishNotReadyAddresses` 设置为 `true` 的 Service，`ready` 状况始终设置为 `true`）。

<!--
### Topology information {#topology}

Each endpoint within an EndpointSlice can contain relevant topology information.
The topology information includes the location of the endpoint and information
about the corresponding Node and zone. These are available in the following
per endpoint fields on EndpointSlices:
-->
### 拓扑信息   {#topology}

EndpointSlice 中的每个端点都可以包含一定的拓扑信息。
拓扑信息包括端点的位置，对应节点、可用区的信息。
这些信息体现为 EndpointSlices 的如下端点字段：

<!--
* `nodeName` - The name of the Node this endpoint is on.
* `zone` - The zone this endpoint is in.
-->
* `nodeName` - 端点所在的 Node 名称；
* `zone` - 端点所处的可用区。

<!--
### Management

Most often, the control plane (specifically, the endpoint slice
{{< glossary_tooltip text="controller" term_id="controller" >}}) creates and
manages EndpointSlice objects. There are a variety of other use cases for
EndpointSlices, such as service mesh implementations, that could result in other
entities or controllers managing additional sets of EndpointSlices.
-->
### 管理   {#management}

通常，控制面（尤其是端点切片的{{< glossary_tooltip text="控制器" term_id="controller" >}}）
会创建和管理 EndpointSlice 对象。EndpointSlice 对象还有一些其他使用场景，
例如作为服务网格（Service Mesh）的实现。
这些场景都会导致有其他实体或者控制器负责管理额外的 EndpointSlice 集合。

<!--
To ensure that multiple entities can manage EndpointSlices without interfering
with each other, Kubernetes defines the
{{< glossary_tooltip term_id="label" text="label" >}}
`endpointslice.kubernetes.io/managed-by`, which indicates the entity managing
an EndpointSlice.
The endpoint slice controller sets `endpointslice-controller.k8s.io` as the value
for this label on all EndpointSlices it manages. Other entities managing
EndpointSlices should also set a unique value for this label.
-->
为了确保多个实体可以管理 EndpointSlice 而且不会相互产生干扰，
Kubernetes 定义了{{< glossary_tooltip term_id="label" text="标签" >}}
`endpointslice.kubernetes.io/managed-by`，用来标明哪个实体在管理某个 EndpointSlice。
端点切片控制器会在自己所管理的所有 EndpointSlice 上将该标签值设置为
`endpointslice-controller.k8s.io`。
管理 EndpointSlice 的其他实体也应该为此标签设置一个唯一值。

<!--
### Ownership

In most use cases, EndpointSlices are owned by the Service that the endpoint
slice object tracks endpoints for. This ownership is indicated by an owner
reference on each EndpointSlice as well as a `kubernetes.io/service-name`
label that enables simple lookups of all EndpointSlices belonging to a Service.
-->
### 属主关系   {#ownership}

在大多数场合下，EndpointSlice 都由某个 Service 所有，
（因为）该端点切片正是为该服务跟踪记录其端点。这一属主关系是通过为每个 EndpointSlice
设置一个属主（owner）引用，同时设置 `kubernetes.io/service-name` 标签来标明的，
目的是方便查找隶属于某 Service 的所有 EndpointSlice。

<!--
### Distribution of EndpointSlices

Each EndpointSlice has a set of ports that applies to all endpoints within the
resource. When named ports are used for a Service, Pods may end up with
different target port numbers for the same named port, requiring different
EndpointSlices.
-->
### EndpointSlices 的分布问题  {#distribution-of-endpointslices}

每个 EndpointSlice 都有一组端口值，适用于资源内的所有端点。
当为 Service 使用命名端口时，Pod 可能会就同一命名端口获得不同的端口号，
因而需要不同的 EndpointSlice。

<!--
The control plane tries to fill EndpointSlices as full as possible, but does not
actively rebalance them. The logic is fairly straightforward:

1. Iterate through existing EndpointSlices, remove endpoints that are no longer
   desired and update matching endpoints that have changed.
2. Iterate through EndpointSlices that have been modified in the first step and
   fill them up with any new endpoints needed.
3. If there's still new endpoints left to add, try to fit them into a previously
   unchanged slice and/or create new ones.
-->
控制面尝试尽量将 EndpointSlice 填满，不过不会主动地在若干 EndpointSlice
之间执行再平衡操作。这里的逻辑也是相对直接的：

1. 列举所有现有的 EndpointSlices，移除那些不再需要的端点并更新那些已经变化的端点。
2. 列举所有在第一步中被更改过的 EndpointSlices，用新增加的端点将其填满。
3. 如果还有新的端点未被添加进去，尝试将这些端点添加到之前未更改的切片中，
   或者创建新切片。

<!--
Importantly, the third step prioritizes limiting EndpointSlice updates over a
perfectly full distribution of EndpointSlices. As an example, if there are 10
new endpoints to add and 2 EndpointSlices with room for 5 more endpoints each,
this approach will create a new EndpointSlice instead of filling up the 2
existing EndpointSlices. In other words, a single EndpointSlice creation is
preferable to multiple EndpointSlice updates.
-->
这里比较重要的是，与在 EndpointSlice 之间完成最佳的分布相比，第三步中更看重限制
EndpointSlice 更新的操作次数。例如，如果有 10 个端点待添加，有两个 EndpointSlice
中各有 5 个空位，上述方法会创建一个新的 EndpointSlice 而不是将现有的两个
EndpointSlice 都填满。换言之，与执行多个 EndpointSlice 更新操作相比较，
方法会优先考虑执行一个 EndpointSlice 创建操作。

<!--
With kube-proxy running on each Node and watching EndpointSlices, every change
to an EndpointSlice becomes relatively expensive since it will be transmitted to
every Node in the cluster. This approach is intended to limit the number of
changes that need to be sent to every Node, even if it may result with multiple
EndpointSlices that are not full.
-->
由于 kube-proxy 在每个节点上运行并监视 EndpointSlice 状态，EndpointSlice
的每次变更都变得相对代价较高，因为这些状态变化要传递到集群中每个节点上。
这一方法尝试限制要发送到所有节点上的变更消息个数，即使这样做可能会导致有多个
EndpointSlice 没有被填满。

<!--
In practice, this less than ideal distribution should be rare. Most changes
processed by the EndpointSlice controller will be small enough to fit in an
existing EndpointSlice, and if not, a new EndpointSlice is likely going to be
necessary soon anyway. Rolling updates of Deployments also provide a natural
repacking of EndpointSlices with all Pods and their corresponding endpoints
getting replaced.
-->
在实践中，上面这种并非最理想的分布是很少出现的。大多数被 EndpointSlice
控制器处理的变更都是足够小的，可以添加到某已有 EndpointSlice 中去的。
并且，假使无法添加到已有的切片中，不管怎样都很快就会创建一个新的
EndpointSlice 对象。Deployment 的滚动更新为重新为 EndpointSlice
打包提供了一个自然的机会，所有 Pod 及其对应的端点在这一期间都会被替换掉。

<!--
### Duplicate endpoints

Due to the nature of EndpointSlice changes, endpoints may be represented in more
than one EndpointSlice at the same time. This naturally occurs as changes to
different EndpointSlice objects can arrive at the Kubernetes client watch / cache
at different times.
-->
### 重复的端点   {#duplicate-endpoints}

由于 EndpointSlice 变化的自身特点，端点可能会同时出现在不止一个 EndpointSlice
中。鉴于不同的 EndpointSlice 对象在不同时刻到达 Kubernetes 的监视/缓存中，
这种情况的出现是很自然的。

{{< note >}}
<!--
Clients of the EndpointSlice API must iterate through all the existing EndpointSlices
associated to a Service and build a complete list of unique network endpoints. It is
important to mention that endpoints may be duplicated in different EndpointSlices.

You can find a reference implementation for how to perform this endpoint aggregation
and deduplication as part of the `EndpointSliceCache` code within `kube-proxy`.
-->
EndpointSlice API 的客户端必须遍历与 Service 关联的所有现有 EndpointSlices，
并构建唯一网络端点的完整列表。值得一提的是端点可能在不同的 EndpointSlices 中重复。

你可以在 `kube-proxy` 中的 `EndpointSliceCache` 代码中找到有关如何执行此端点聚合和重复数据删除的参考实现。
{{< /note >}}

<!--
### EndpointSlice mirroring
-->
### EndpointSlice 镜像    {#endpointslice-mirroring}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

<!--
The EndpointSlice API is a replacement for the older Endpoints API. To
preserve compatibility with older controllers and user workloads that
expect {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}}
to route traffic based on Endpoints resources, the cluster's control
plane mirrors most user-created Endpoints resources to corresponding
EndpointSlices.
-->
EndpointSlice API 是旧版 Endpoints API 的替代方案。
为了保持与旧版控制器和用户工作负载的兼容性
（例如期望由 {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}} 基于 Endpoints 资源来路由流量），
集群的控制平面会将大多数用户创建的 Endpoints 资源镜像到相应的 EndpointSlice 中。

<!--
(However, this feature, like the rest of the Endpoints API, is
deprecated. Users who manually specify endpoints for selectorless
Services should do so by creating EndpointSlice resources directly,
rather than by creating Endpoints resources and allowing them to be
mirrored.)
-->
（不过，与 Endpoints API 的其他部分一样，此特性也已被弃用。
对于无选择算符的 Service，用户如果需要手动指定端点，应该直接创建 EndpointSlice 资源，
而不是创建 Endpoints 资源并允许其被镜像。）

<!--
The control plane mirrors Endpoints resources unless:

* the Endpoints resource has a `endpointslice.kubernetes.io/skip-mirror` label
  set to `true`.
* the Endpoints resource has a `control-plane.alpha.kubernetes.io/leader`
  annotation.
* the corresponding Service resource does not exist.
* the corresponding Service resource has a non-nil selector.
-->
控制面对 Endpoints 资源进行映射的例外情况有：

* Endpoints 资源上标签 `endpointslice.kubernetes.io/skip-mirror` 值为 `true`。
* Endpoints 资源包含标签 `control-plane.alpha.kubernetes.io/leader`。
* 对应的 Service 资源不存在。
* 对应的 Service 的选择算符不为空。

<!--
Individual Endpoints resources may translate into multiple EndpointSlices. This
will occur if an Endpoints resource has multiple subsets or includes endpoints
with multiple IP families (IPv4 and IPv6). A maximum of 1000 addresses per
subset will be mirrored to EndpointSlices.
-->
每个 Endpoints 资源可能会被转译到多个 EndpointSlices 中去。
当 Endpoints 资源中包含多个子网或者包含多个 IP 协议族（IPv4 和 IPv6）的端点时，
就有可能发生这种状况。
每个子网最多有 1000 个地址会被镜像到 EndpointSlice 中。

## {{% heading "whatsnext" %}}

<!--
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) for the EndpointSlice API
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) for the Endpoints API
-->
* 遵循[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程
* 阅读 EndpointSlice API 的 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* 阅读 Endpoints API 的 [API 参考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
