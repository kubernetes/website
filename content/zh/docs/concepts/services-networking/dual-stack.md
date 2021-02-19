---
title: IPv4/IPv6 双协议栈
feature:
  title: IPv4/IPv6 双协议栈
  description: >
    为 Pod 和 Service 分配 IPv4 和 IPv6 地址
content_type: concept
weight: 70
---

<!--
reviewers:
- lachie83
- khenidak
- aramase
- bridgetkromhout
title: IPv4/IPv6 dual-stack
feature:
  title: IPv4/IPv6 dual-stack
  description: >
    Allocation of IPv4 and IPv6 addresses to Pods and Services

content_type: concept
weight: 70
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

<!--
 IPv4/IPv6 dual-stack enables the allocation of both IPv4 and IPv6 addresses to {{< glossary_tooltip text="Pods" term_id="pod" >}} and {{< glossary_tooltip text="Services" term_id="service" >}}.
-->
IPv4/IPv6 双协议栈能够将 IPv4 和 IPv6 地址分配给
{{< glossary_tooltip text="Pod" term_id="pod" >}} 和
{{< glossary_tooltip text="Service" term_id="service" >}}。

<!--
If you enable IPv4/IPv6 dual-stack networking for your Kubernetes cluster, the cluster will support the simultaneous assignment of both IPv4 and IPv6 addresses.
-->
如果你为 Kubernetes 集群启用了 IPv4/IPv6 双协议栈网络，
则该集群将支持同时分配 IPv4 和 IPv6 地址。

<!-- body -->

<!--
## Supported Features
-->
## 支持的功能

<!--
Enabling IPv4/IPv6 dual-stack on your Kubernetes cluster provides the following features:
-->
在 Kubernetes 集群上启用 IPv4/IPv6 双协议栈可提供下面的功能：

<!--
   * Dual-stack Pod networking (a single IPv4 and IPv6 address assignment per Pod)
   * IPv4 and IPv6 enabled Services
   * Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces
-->
   * 双协议栈 pod 网络 (每个 pod 分配一个 IPv4 和 IPv6 地址)
   * IPv4 和 IPv6 启用的服务
   * Pod 的集群外出口通过 IPv4 和 IPv6 路由

<!--
## Prerequisites
-->
## 先决条件

<!--
The following prerequisites are needed in order to utilize IPv4/IPv6 dual-stack Kubernetes clusters:
-->
为了使用 IPv4/IPv6 双栈的 Kubernetes 集群，需要满足以下先决条件：

<!--
   * Kubernetes 1.20 or later  
     For information about using dual-stack services with earlier
     Kubernetes versions, refer to the documentation for that version
     of Kubernetes.
   * Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
   * A network plugin that supports dual-stack (such as Kubenet or Calico)
-->
   * Kubernetes 1.20 版本及更高版本，有关更早 Kubernetes 版本的使用双栈服务的信息，请参考那个版本的 Kubernetes 文档。
   * 提供商支持双协议栈网络（云提供商或其他提供商必须能够为 Kubernetes 节点提供可路由的 IPv4/IPv6 网络接口）
   * 支持双协议栈的网络插件（如 Kubenet 或 Calico）

<!--
## Enable IPv4/IPv6 dual-stack
-->
## 启用 IPv4/IPv6 双协议栈

<!--
To enable IPv4/IPv6 dual-stack, enable the `IPv6DualStack` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the relevant components of your cluster, and set dual-stack cluster network assignments:

   * kube-apiserver:
      * `--feature-gates="IPv6DualStack=true"`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` defaults to /24 for IPv4 and /64 for IPv6
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`
-->
要启用 IPv4/IPv6 双协议栈，为集群的相关组件启用 `IPv6DualStack`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
并且设置双协议栈的集群网络分配：

   * kube-apiserver:
      * `--feature-gates="IPv6DualStack=true"`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` 
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` 对于 IPv4 默认为 /24，对于 IPv6 默认为 /64
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

<!--
An example of an IPv4 CIDR: `10.244.0.0/16` (though you would supply your own address range)

An example of an IPv6 CIDR: `fdXY:IJKL:MNOP:15::/64` (this shows the format but is not a valid address - see [RFC 4193](https://tools.ietf.org/html/rfc4193))
-->
{{< note >}}

IPv4 CIDR 的一个例子：`10.244.0.0/16`（尽管你会提供你自己的地址范围）

IPv6 CIDR 的一个例子：`fdXY:IJKL:MNOP:15::/64`（这里演示的是格式而非有效地址 - 请看 [RFC 4193](https://tools.ietf.org/html/rfc4193)）

{{< /note >}}

<!--
## Services
-->
## 服务

<!--
If your cluster has dual-stack enabled, you can create {{< glossary_tooltip text="Services" term_id="service" >}} which can use IPv4, IPv6, or both. 

The address family of a Service defaults to the address family of the first service cluster IP range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver).

When you define a Service you can optionally configure it as dual stack. To specify the behavior you want, you
set the `.spec.ipFamilyPolicy` field to one of the following values:
-->
如果你的集群启用了 IPv4/IPv6 双协议栈网络，则可以使用 IPv4 或 IPv6 地址来创建
{{< glossary_tooltip text="Service" term_id="service" >}}。
服务的地址族默认为第一个服务集群 IP 范围的地址族（通过 kube-apiserver 的 `--service-cluster-ip-range` 参数配置）。
当你定义服务时，可以选择将其配置为双栈。若要指定所需的行为，你可以设置 `.spec.ipFamilyPolicy` 字段为以下值之一：

<!--
* `SingleStack`: Single-stack service. The control plane allocates a cluster IP for the Service, using the first configured service cluster IP range.
* `PreferDualStack`:
  * Only used if the cluster has dual-stack enabled. Allocates IPv4 and IPv6 cluster IPs for the Service
  * If the cluster does not have dual-stack enabled, this setting follows the same behavior as `SingleStack`.
* `RequireDualStack`: Allocates Service `.spec.ClusterIPs` from both IPv4 and IPv6 address ranges.
  * Selects the `.spec.ClusterIP` from the list of `.spec.ClusterIPs` based on the address family of the first element in the `.spec.ipFamilies` array.
  * The cluster must have dual-stack networking configured.
-->

* `SingleStack`：单栈服务。控制面使用第一个配置的服务集群 IP 范围为服务分配集群 IP。
* `PreferDualStack`：
  * 仅当集群启用了双栈时使用。为服务分配 IPv4 和 IPv6 集群 IP。
  * 如果集群没有启用双堆栈，则此设置与 `SingleStack` 行为相同。
* `RequireDualStack`：从 IPv4 和 IPv6 的地址范围分配服务的 `.spec.ClusterIPs`
  * 从基于在 `.spec.ipFamilies` 数组中第一个元素的地址族的 `.spec.ClusterIPs` 列表中选择 `.spec.ClusterIP` 
  * 集群必须配置双栈网络
  
<!--
If you would like to define which IP family to use for single stack or define the order of IP families for dual-stack, you can choose the address families by setting an optional field, `.spec.ipFamilies`, on the Service. 
-->
如果你想要定义哪个 IP 族用于单栈或定义双栈 IP 族的顺序，可以通过设置服务上的可选字段 `.spec.ipFamilies` 来选择地址族。

<!--
The `.spec.ipFamilies` field is immutable because the `.spec.ClusterIP` cannot be reallocated on a Service that already exists. If you want to change `.spec.ipFamilies`, delete and recreate the Service.
-->
{{< note >}}
`.spec.ipFamilies` 字段是不可变的，因为系统无法为已经存在的服务重新分配 `.spec.ClusterIP`。
如果你想改变 `.spec.ipFamilies`，则需要删除并重新创建服务。
{{< /note >}}

<!--
You can set `.spec.ipFamilies` to any of the following array values:
-->
你可以设置 `.spec.ipFamily` 为以下任何数组值：

<!--
- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (dual stack)
- `["IPv6","IPv4"]` (dual stack)

-->
- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` （双栈）
- `["IPv6","IPv4"]` （双栈）

<!--
The first family you list is used for the legacy `.spec.ClusterIP` field.
-->

你所列出的第一个地址族用于原来的 `.spec.ClusterIP` 字段。

<!--
### Dual-stack Service configuration scenarios

These examples demonstrate the behavior of various dual-stack Service configuration scenarios.
-->

### 双栈服务配置场景

以下示例演示多种双栈服务配置场景下的行为。

<!--
#### Dual-stack options on new Services
-->
#### 新服务的双栈选项

<!--
1. This Service specification does not explicitly define `.spec.ipFamilyPolicy`. When you create this Service, Kubernetes assigns a cluster IP for the Service from the first configured `service-cluster-ip-range` and sets the `.spec.ipFamilyPolicy` to `SingleStack`. ([Services without selectors](/docs/concepts/services-networking/service/#services-without-selectors) and [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors will behave in this same way.)
-->

1. 此服务规约中没有显式设定 `.spec.ipFamilyPolicy`。当你创建此服务时，Kubernetes
   从所配置的第一个 `service-cluster-ip-range` 种为服务分配一个集群IP，并设置
   `.spec.ipFamilyPolicy` 为 `SingleStack`。
   （[无选择算符的服务](/zh/docs/concepts/services-networking/service/#services-without-selectors)和
   [无头服务](/zh/docs/concepts/services-networking/service/#headless-services)的行为方式
   与此相同。）
   
   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

<!--
1. This Service specification explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`. When you create this Service on a dual-stack cluster, Kubernetes assigns both IPv4 and IPv6 addresses for the service. The control plane updates the `.spec` for the Service to record the IP address assignments. The field `.spec.ClusterIPs` is the primary field, and contains both assigned IP addresses; `.spec.ClusterIP` is a secondary field with its value calculated from `.spec.ClusterIPs`.
   
      * For the `.spec.ClusterIP` field, the control plane records the IP address that is from the same address family as the first service cluster IP range. 
      * On a single-stack cluster, the `.spec.ClusterIPs` and `.spec.ClusterIP` fields both only list one address. 
      * On a cluster with dual-stack enabled, specifying `RequireDualStack` in `.spec.ipFamilyPolicy` behaves the same as `PreferDualStack`.

-->
2. 此服务规约显式地将 `.spec.ipFamilyPolicy` 设置为 `PreferDualStack`。
   当你在双栈集群上创建此服务时，Kubernetes 会为该服务分配 IPv4 和 IPv6 地址。
   控制平面更新服务的 `.spec` 以记录 IP 地址分配。
   字段 `.spec.ClusterIPs` 是主要字段，包含两个分配的 IP 地址；`.spec.ClusterIP` 是次要字段，
   其取值从 `.spec.ClusterIPs` 计算而来。

   {{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

<!--
1. This Service specification explicitly defines `IPv6` and `IPv4` in `.spec.ipFamilies` as well as defining `PreferDualStack` in `.spec.ipFamilyPolicy`. When Kubernetes assigns an IPv6 and IPv4 address in `.spec.ClusterIPs`, `.spec.ClusterIP` is set to the IPv6 address because that is the first element in the `.spec.ClusterIPs` array, overriding the default.
-->
3. 下面的服务规约显式地在 `.spec.ipFamilies` 中指定 `IPv6` 和 `IPv4`，并
   将 `.spec.ipFamilyPolicy` 设定为 `PreferDualStack`。
   当 Kubernetes 为 `.spec.ClusterIPs` 分配一个 IPv6 和一个 IPv4 地址时，
   `.spec.ClusterIP` 被设置成 IPv6 地址，因为它是 `.spec.ClusterIPs` 数组中的第一个元素，
   覆盖其默认值。

   {{< codenew file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" >}}

<!--
#### Dual-stack defaults on existing Services
-->
#### 现有服务的双栈默认值

<!--
These examples demonstrate the default behavior when dual-stack is newly enabled on a cluster where Services already exist.
-->
下面示例演示了在服务已经存在的集群上新启用双栈时的默认行为。

<!--
1. When dual-stack is enabled on a cluster, existing Services (whether `IPv4` or `IPv6`) are configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set `.spec.ipFamilies` to the address family of the existing Service. The existing Service cluster IP will be stored in `.spec.ClusterIPs`.
-->
1. 在集群上启用双栈时，控制面会将现有服务（无论是 `IPv4` 还是 `IPv6`）配置 `.spec.ipFamilyPolicy`
   设置为 `SingleStack` 并设置 `.spec.ipFamilies` 为服务的当前地址族。

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   <!--
   You can validate this behavior by using kubectl to inspect an existing service.
   -->
   你可以通过使用 kubectl 检查现有服务来验证此行为。

   ```shell
   kubectl get svc my-service -o yaml
   ```
   
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app: MyApp
     name: my-service
   spec:
     clusterIP: 10.0.197.123
     clusterIPs:
     - 10.0.197.123
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

<!--
1. When dual-stack is enabled on a cluster, existing [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors are configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set `.spec.ipFamilies` to the address family of the first service cluster IP range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver) even though `.spec.ClusterIP` is set to `None`.
-->
2. 在集群上启用双栈时，带有选择算符的现有
   [无头服务](/zh/docs/concepts/services-networking/service/#headless-services)
   由控制面设置 `.spec.ipFamilyPolicy` 为 `SingleStack`
   并设置 `.spec.ipFamilies` 为第一个服务群集 IP 范围的地址族（通过配置 kube-apiserver 的
   `--service-cluster-ip-range` 参数），即使 `.spec.ClusterIP` 的设置值为 `None` 也如此。

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   <!--
   You can validate this behavior by using kubectl to inspect an existing headless service with selectors.
   -->
   你可以通过使用 kubectl 检查带有选择算符的现有无头服务来验证此行为。

   ```shell
   kubectl get svc my-service -o yaml
   ```
   
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app: MyApp
     name: my-service
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app: MyApp  
   ```

<!--
#### Switching Services between single-stack and dual-stack
-->
#### 在单栈和双栈之间切换服务

<!--
Services can be changed from single-stack to dual-stack and from dual-stack to single-stack.
-->
服务可以从单栈更改为双栈，也可以从双栈更改为单栈。

<!--
1. To change a Service from single-stack to dual-stack, change `.spec.ipFamilyPolicy` from `SingleStack` to `PreferDualStack` or `RequireDualStack` as desired. When you change this Service from single-stack to dual-stack, Kubernetes assigns the missing address family so that the Service now has IPv4 and IPv6 addresses.

   Edit the Service specification updating the `.spec.ipFamilyPolicy` from `SingleStack` to `PreferDualStack`.
-->
1. 要将服务从单栈更改为双栈，根据需要将 `.spec.ipFamilyPolicy` 从 `SingleStack` 改为
   `PreferDualStack` 或 `RequireDualStack`。
   当你将此服务从单栈更改为双栈时，Kubernetes 将分配缺失的地址族，以便现在该服务具有 IPv4 和 IPv6 地址。
   编辑服务规约将 `.spec.ipFamilyPolicy` 从 `SingleStack` 改为 `PreferDualStack`。

   <!--
   Before:
   -->
   之前：
   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```
   <!--
   After:
   -->
   之后：
   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

<!--
1. To change a Service from dual-stack to single-stack, change `.spec.ipFamilyPolicy` from `PreferDualStack` or `RequireDualStack` to `SingleStack`. When you change this Service from dual-stack to single-stack, Kubernetes retains only the first element in the `.spec.ClusterIPs` array, and sets `.spec.ClusterIP` to that IP address and sets `.spec.ipFamilies` to the address family of `.spec.ClusterIPs`.
-->

2. 要将服务从双栈更改为单栈，请将 `.spec.ipFamilyPolicy` 从 `PreferDualStack` 或 `RequireDualStack`
   改为 `SingleStack`。
   当你将此服务从双栈更改为单栈时，Kubernetes 只保留 `.spec.ClusterIPs` 数组中的第一个元素，并设置 `.spec.ClusterIP` 为那个 IP 地址，
   并设置 `.spec.ipFamilies` 为 `.spec.ClusterIPs` 地址族。

<!--
### Headless Services without selector
-->
### 无选择算符的无头服务

<!--
For [Headless Services without selectors](/docs/concepts/services-networking/service/#without-selectors) and without `.spec.ipFamilyPolicy` explicitly set, the `.spec.ipFamilyPolicy` field defaults to `RequireDualStack`.
-->
对于[不带选择算符的无头服务](/zh/docs/concepts/services-networking/service/#without-selectors)，
若没有显式设置 `.spec.ipFamilyPolicy`，则 `.spec.ipFamilyPolicy` 字段默认设置为 `RequireDualStack`。

<!--
### Service type LoadBalancer
-->
### LoadBalancer 类型服务

<!--
To provision a dual-stack load balancer for your Service:
   * Set the `.spec.type` field to `LoadBalancer`
   * Set `.spec.ipFamilyPolicy` field to `PreferDualStack` or `RequireDualStack`
-->

要为你的服务提供双栈负载均衡器：
   * 将 `.spec.type` 字段设置为 `LoadBalancer` 
   * 将 `.spec.ipFamilyPolicy` 字段设置为 `PreferDualStack` 或者 `RequireDualStack`

<!--
To use a dual-stack `LoadBalancer` type Service, your cloud provider must support IPv4 and IPv6 load balancers.
-->
{{< note >}}
为了使用双栈的负载均衡器类型服务，你的云驱动必须支持 IPv4 和 IPv6 的负载均衡器。
{{< /note >}}

<!--
## Egress traffic
-->
## 出站流量

<!--
If you want to enable egress traffic in order to reach off-cluster destinations (eg. the public Internet) from a Pod that uses non-publicly routable IPv6 addresses, you need to enable the Pod to use a publicly routed IPv6 address via a mechanism such as transparent proxying or IP masquerading. The [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) project supports IP masquerading on dual-stack clusters.
-->
如果你要启用出口流量，以便使用非公开路由 IPv6 地址的 Pod 到达集群外地址（例如公网），则需要通过透明代理或 IP 伪装等机制使 Pod 使用公共路由的 IPv6 地址。
[ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent)项目支持在双栈集群上进行 IP 伪装。

<!--
Ensure your {{< glossary_tooltip text="CNI" term_id="cni" >}} provider supports IPv6.
-->
{{< note >}}
确认你的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 驱动支持 IPv6。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
-->
* [验证 IPv4/IPv6 双协议栈](/zh/docs/tasks/network/validate-dual-stack)网络