---
title: 端点切片（Endpoint Slices）
content_type: concept
weight: 35
---

<!--
title: Endpoint Slices
content_type: concept
weight: 35
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
_Endpoint Slices_ provide a simple way to track network endpoints within a
Kubernetes cluster. They offer a more scalable and extensible alternative to
Endpoints.
-->
_端点切片（Endpoint Slices）_ 提供了一种简单的方法来跟踪 Kubernetes 集群中的网络端点
（network endpoints）。它们为 Endpoints 提供了一种可伸缩和可拓展的替代方案。

<!-- body -->

<!--
## Motivation

The Endpoints API has provided a simple and straightforward way of
tracking network endpoints in Kubernetes. Unfortunately as Kubernetes clusters
and {{< glossary_tooltip text="Services" term_id="service" >}} have grown to handle and
send more traffic to more backend Pods, limitations of that original API became
more visible.
Most notably, those included challenges with scaling to larger numbers of
network endpoints.
-->
## 动机    {#motivation}

Endpoints API 提供了在 Kubernetes 跟踪网络端点的一种简单而直接的方法。
不幸的是，随着 Kubernetes 集群和 {{< glossary_tooltip text="服务" term_id="service" >}}
逐渐开始为更多的后端 Pods 处理和发送请求，原来的 API 的局限性变得越来越明显。
最重要的是那些因为要处理大量网络端点而带来的挑战。

<!--
Since all network endpoints for a Service were stored in a single Endpoints
resource, those resources could get quite large. That affected the performance
of Kubernetes components (notably the master control plane) and resulted in
significant amounts of network traffic and processing when Endpoints changed.
EndpointSlices help you mitigate those issues as well as provide an extensible
platform for additional features such as topological routing.
-->
由于任一服务的所有网络端点都保存在同一个 Endpoints 资源中，这类资源可能变得
非常巨大，而这一变化会影响到 Kubernetes 组件（比如主控组件）的性能，并
在 Endpoints 变化时需要处理大量的网络流量和处理。
EndpointSlice 能够帮助你缓解这一问题，还能为一些诸如拓扑路由这类的额外
功能提供一个可扩展的平台。

<!--
## Endpoint Slice resources {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The control plane automatically creates EndpointSlices
for any Kubernetes Service that has a {{< glossary_tooltip text="selector"
term_id="selector" >}} specified. These EndpointSlices include
references to any Pods that match the Service selector. EndpointSlices group
network endpoints together by unique combinations of protocol, port number, and
Service name.  
The name of a EndpointSlice object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

As an example, here's a sample EndpointSlice resource for the `example`
Kubernetes Service.
-->
## Endpoint Slice 资源 {#endpointslice-resource}

在 Kubernetes 中，`EndpointSlice` 包含对一组网络端点的引用。
指定选择器后控制面会自动为设置了 {{< glossary_tooltip text="选择算符" term_id="selector" >}}
的 Kubernetes 服务创建 EndpointSlice。
这些 EndpointSlice 将包含对与服务选择算符匹配的所有 Pod 的引用。
EndpointSlice 通过唯一的协议、端口号和服务名称将网络端点组织在一起。
EndpointSlice 的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

例如，下面是 Kubernetes 服务 `example` 的 EndpointSlice 资源示例。

```yaml
apiVersion: discovery.k8s.io/v1beta1
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
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

<!--
By default, the control plane creates and manages EndpointSlices to have no
more than 100 endpoints each. You can configure this with the
`-max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
flag, up to a maximum of 1000.

EndpointSlices can act as the source of truth for
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} when it comes to
how to route internal traffic. When enabled, they should provide a performance
improvement for services with large numbers of endpoints.
-->
默认情况下，控制面创建和管理的 EndpointSlice 将包含不超过 100 个端点。
你可以使用 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
的 `--max-endpoints-per-slice` 标志设置此值，最大值为 1000。

当涉及如何路由内部流量时，EndpointSlice 可以充当
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} 
的决策依据。
启用该功能后，在服务的端点数量庞大时会有可观的性能提升。

<!--
## Address Types

EndpointSlices support three address types:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)
-->
## 地址类型

EndpointSlice 支持三种地址类型：

* IPv4
* IPv6
* FQDN (完全合格的域名)

<!--
### Conditions

The EndpointSlice API stores conditions about endpoints that may be useful for consumers.
The three conditions are `ready`, `serving`, and `terminating`.
-->
### 状况

EndpointSlice API 存储了可能对使用者有用的、有关端点的状况。
这三个状况分别是 `ready`、`serving` 和 `terminating`。


<!--
#### Ready

`ready` is a condition that maps to a Pod's `Ready` condition. A running Pod with the `Ready`
condition set to `True` should have this EndpointSlice condition also set to `true`. For
compatibility reasons, `ready` is NEVER `true` when a Pod is terminating. Consumers should refer
to the `serving` condition to inspect the readiness of terminating Pods. The only exception to
this rule is for Services with `spec.publishNotReadyAddresses` set to `true`. Endpoints for these
Services will always have the `ready` condition set to `true`.
-->
#### Ready（就绪）

`ready` 状况是映射 Pod 的 `Ready` 状况的。
处于运行中的 Pod，它的 `Ready` 状况被设置为 `True`，应该将此 EndpointSlice 状况也设置为 `true`。
出于兼容性原因，当 Pod 处于终止过程中，`ready` 永远不会为 `true`。
消费者应参考 `serving` 状况来检查处于终止中的 Pod 的就绪情况。
该规则的唯一例外是将 `spec.publishNotReadyAddresses` 设置为 `true` 的服务。
这些服务（Service）的端点将始终将 `ready` 状况设置为 `true`。

<!--
#### Serving

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`serving` is identical to the `ready` condition, except it does not account for terminating states.
Consumers of the EndpointSlice API should check this condition if they care about pod readiness while
the pod is also terminating.
-->
#### Serving（服务中）

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`serving` 状况与 `ready` 状况相同，不同之处在于它不考虑终止状态。
如果 EndpointSlice API 的使用者关心 Pod 终止时的就绪情况，就应检查此状况。

{{< note >}}
<!--
Although `serving` is almost identical to `ready`, it was added to prevent break the existing meaning
of `ready`. It may be unexpected for existing clients if `ready` could be `true` for terminating
endpoints, since historically terminating endpoints were never included in the Endpoints or
EndpointSlice API to begin with. For this reason, `ready` is _always_ `false` for terminating
endpoints, and a new condition `serving` was added in v1.20 so that clients can track readiness
for terminating pods independent of the existing semantics for `ready`.
-->
尽管 `serving` 与 `ready` 几乎相同，但是它是为防止破坏 `ready` 的现有含义而增加的。
如果对于处于终止中的端点，`ready` 可能是 `true`，那么对于现有的客户端来说可能是有些意外的，
因为从始至终，Endpoints 或 EndpointSlice API 从未包含处于终止中的端点。
出于这个原因，`ready` 对于处于终止中的端点 _总是_ `false`，
并且在 v1.20 中添加了新的状况 `serving`，以便客户端可以独立于 `ready`
的现有语义来跟踪处于终止中的 Pod 的就绪情况。
{{< /note >}}

<!-- 
#### Terminating

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`Terminating` is a condition that indicates whether an endpoint is terminating.
For pods, this is any pod that has a deletion timestamp set.
-->
#### Terminating（终止中）

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`Terminating` 是表示端点是否处于终止中的状况。
对于 Pod 来说，这是设置了删除时间戳的 Pod。


<!--
### Topology information {#topology}

{{< feature-state for_k8s_version="v1.20" state="deprecated" >}}

{{< note >}}
The topology field in EndpointSlices has been deprecated and will be removed in
a future release. A new `nodeName` field will be used instead of setting
`kubernetes.io/hostname` in topology. It was determined that other topology
fields covering zone and region would be better represented as EndpointSlice
labels that would apply to all endpoints within the EndpointSlice.
{{< /note >}}

Each endpoint within an EndpointSlice can contain relevant topology information.
This is used to indicate where an endpoint is, containing information about the
corresponding Node, zone, and region. When the values are available, the
control plane sets the following Topology labels for EndpointSlices:
-->
### 拓扑信息   {#topology}

{{< feature-state for_k8s_version="v1.20" state="deprecated" >}}

{{< note >}}
EndpointSlices 中的 topology 字段已被弃用，并将在以后的版本中删除。
将使用新的 `nodeName` 字段代替在 topology 中设置 `kubernetes.io/hostname`。
可以确定的是，其他覆盖区和域的拓扑字段用 EndpointSlice 标签来表达更合适，
该标签将应用于 EndpointSlice 内的所有端点。
{{< /note >}}

EndpointSlice 中的每个端点都可以包含一定的拓扑信息。
这一信息用来标明端点的位置，包含对应节点、可用区、区域的信息。
当这些值可用时，控制面会为 EndpointSlice 设置如下拓扑标签：

<!--
* `kubernetes.io/hostname` - The name of the Node this endpoint is on.
* `topology.kubernetes.io/zone` - The zone this endpoint is in.
* `topology.kubernetes.io/region` - The region this endpoint is in.
-->
* `kubernetes.io/hostname` - 端点所在的节点名称
* `topology.kubernetes.io/zone` - 端点所处的可用区
* `topology.kubernetes.io/region` - 端点所处的区域

<!--
The values of these labels are derived from resources associated with each
endpoint in a slice. The hostname label represents the value of the NodeName
field on the corresponding Pod. The zone and region labels represent the value
of the labels with the same names on the corresponding Node.
-->
这些标签的值时根据与切片中各个端点相关联的资源来生成的。
标签 `hostname` 代表的是对应的 Pod 的 NodeName 字段的取值。
`zone` 和 `region` 标签则代表的是对应的节点所拥有的同名标签的值。

<!--
### Management

Most often, the control plane (specifically, the endpoint slice
{{< glossary_tooltip text="controller" term_id="controller" >}}) creates and
manages EndpointSlice objects. There are a variety of other use cases for
EndpointSlices, such as service mesh implementations, that could result in other
entities or controllers managing additional sets of EndpointSlices.
-->
### 管理   {#management}

通常，控制面（尤其是端点切片的 {{< glossary_tooltip text="controller" term_id="controller" >}}）
会创建和管理 EndpointSlice 对象。EndpointSlice 对象还有一些其他使用场景，
例如作为服务网格（Service Mesh）的实现。这些场景都会导致有其他实体
或者控制器负责管理额外的 EndpointSlice 集合。

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
为了确保多个实体可以管理 EndpointSlice 而且不会相互产生干扰，Kubernetes 定义了
{{< glossary_tooltip term_id="label" text="标签" >}}
`endpointslice.kubernetes.io/managed-by`，用来标明哪个实体在管理某个
EndpointSlice。端点切片控制器会在自己所管理的所有 EndpointSlice 上将该标签值设置
为 `endpointslice-controller.k8s.io`。
管理 EndpointSlice 的其他实体也应该为此标签设置一个唯一值。

<!--
### Ownership

In most use cases, EndpointSlices are owned by the Service that the endpoint
slice object tracks endpoints for. This ownership is indicated by an owner
reference on each EndpointSlice as well as a `kubernetes.io/service-name`
label that enables simple lookups of all EndpointSlices belonging to a Service.
-->
### 属主关系   {#ownership}

在大多数场合下，EndpointSlice 都由某个 Service 所有，（因为）该端点切片正是
为该服务跟踪记录其端点。这一属主关系是通过为每个 EndpointSlice 设置一个
属主（owner）引用，同时设置 `kubernetes.io/service-name` 标签来标明的，
目的是方便查找隶属于某服务的所有 EndpointSlice。

<!--
### EndpointSlice mirroring

In some cases, applications create custom Endpoints resources. To ensure that
these applications do not need to concurrently write to both Endpoints and
EndpointSlice resources, the cluster's control plane mirrors most Endpoints
resources to corresponding EndpointSlices.
-->
### EndpointSlice 镜像    {#endpointslice-mirroring}

在某些场合，应用会创建定制的 Endpoints 资源。为了保证这些应用不需要并发
递更改 Endpoints 和 EndpointSlice 资源，集群的控制面将大多数 Endpoints
映射到对应的 EndpointSlice 之上。

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
每个 Endpoints 资源可能会被翻译到多个 EndpointSlices 中去。
当 Endpoints 资源中包含多个子网或者包含多个 IP 地址族（IPv4 和 IPv6）的端点时，
就有可能发生这种状况。
每个子网最多有 1000 个地址会被镜像到 EndpointSlice 中。

<!--
### Distribution of EndpointSlices

Each EndpointSlice has a set of ports that applies to all endpoints within the
resource. When named ports are used for a Service, Pods may end up with
different target port numbers for the same named port, requiring different
EndpointSlices. This is similar to the logic behind how subsets are grouped
with Endpoints.
-->
### EndpointSlices 的分布问题  {#distribution-of-endpointslices}

每个 EndpointSlice 都有一组端口值，适用于资源内的所有端点。
当为服务使用命名端口时，Pod 可能会就同一命名端口获得不同的端口号，因而需要
不同的 EndpointSlice。这有点像 Endpoints 用来对子网进行分组的逻辑。

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
控制面尝试尽量将 EndpointSlice 填满，不过不会主动地在若干 EndpointSlice 之间
执行再平衡操作。这里的逻辑也是相对直接的：

1. 列举所有现有的 EndpointSlices，移除那些不再需要的端点并更新那些已经
   变化的端点。
2. 列举所有在第一步中被更改过的 EndpointSlices，用新增加的端点将其填满。
3. 如果还有新的端点未被添加进去，尝试将这些端点添加到之前未更改的切片中，
   或者创建新切片。

<!--
Importantly, the third step prioritizes limiting EndpointSlice updates over a
perfectly full distribution of EndpointSlices. As an example, if there are 10
new endpoints to add and 2 EndpointSlices with room for 5 more endpoints each,
this approach will create a new EndpointSlice instead of filling up the 2
existing EndpointSlices. In other words, a single EndpointSlice creation is
preferrable to multiple EndpointSlice updates.
-->
这里比较重要的是，与在 EndpointSlice 之间完成最佳的分布相比，第三步中更看重
限制 EndpointSlice 更新的操作次数。例如，如果有 10 个端点待添加，有两个
EndpointSlice 中各有 5 个空位，上述方法会创建一个新的 EndpointSlice 而不是
将现有的两个 EndpointSlice 都填满。换言之，与执行多个 EndpointSlice 更新操作
相比较，方法会优先考虑执行一个 EndpointSlice 创建操作。

<!--
With kube-proxy running on each Node and watching EndpointSlices, every change
to an EndpointSlice becomes relatively expensive since it will be transmitted to
every Node in the cluster. This approach is intended to limit the number of
changes that need to be sent to every Node, even if it may result with multiple
EndpointSlices that are not full.
-->
由于 kube-proxy 在每个节点上运行并监视 EndpointSlice 状态，EndpointSlice 的
每次变更都变得相对代价较高，因为这些状态变化要传递到集群中每个节点上。
这一方法尝试限制要发送到所有节点上的变更消息个数，即使这样做可能会导致有
多个 EndpointSlice 没有被填满。

<!--
In practice, this less than ideal distribution should be rare. Most changes
processed by the EndpointSlice controller will be small enough to fit in an
existing EndpointSlice, and if not, a new EndpointSlice is likely going to be
necessary soon anyway. Rolling updates of Deployments also provide a natural
repacking of EndpointSlices with all Pods and their corresponding endpoints
getting replaced.
-->
在实践中，上面这种并非最理想的分布是很少出现的。大多数被 EndpointSlice 控制器
处理的变更都是足够小的，可以添加到某已有 EndpointSlice 中去的。并且，假使无法
添加到已有的切片中，不管怎样都会快就会需要一个新的 EndpointSlice 对象。
Deployment 的滚动更新为重新为 EndpointSlice 打包提供了一个自然的机会，所有
Pod 及其对应的端点在这一期间都会被替换掉。

<!--
### Duplicate endpoints

Due to the nature of EndpointSlice changes, endpoints may be represented in more
than one EndpointSlice at the same time. This naturally occurs as changes to
different EndpointSlice objects can arrive at the Kubernetes client watch/cache
at different times. Implementations using EndpointSlice must be able to have the
endpoint appear in more than one slice. A reference implementation of how to
perform endpoint deduplication can be found in the `EndpointSliceCache`
implementation in `kube-proxy`.
-->
### 重复的端点   {#duplicate-endpoints}

由于 EndpointSlice 变化的自身特点，端点可能会同时出现在不止一个 EndpointSlice
中。鉴于不同的 EndpointSlice 对象在不同时刻到达 Kubernetes 的监视/缓存中，
这种情况的出现是很自然的。
使用 EndpointSlice 的实现必须能够处理端点出现在多个切片中的状况。
关于如何执行端点去重（deduplication）的参考实现，你可以在 `kube-proxy` 的
`EndpointSlice` 实现中找到。

## {{% heading "whatsnext" %}}

<!--
* [Enabling Endpoint Slices](/docs/tasks/administer-cluster/enabling-endpoint-slices)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 了解[启用 EndpointSlice](/zh/docs/tasks/administer-cluster/enabling-endpointslices)
* 阅读[使用服务连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)

