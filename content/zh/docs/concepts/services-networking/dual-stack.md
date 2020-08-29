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
   * IPv4 and IPv6 enabled Services (each Service must be for a single address family)
   * Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces
-->
   * 双协议栈 pod 网络 (每个 pod 分配一个 IPv4 和 IPv6 地址)
   * IPv4 和 IPv6 启用的服务 (每个服务必须是一个单独的地址族)
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
   * Kubernetes 1.16 or later
   * Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
   * A network plugin that supports dual-stack (such as Kubenet or Calico)
-->
   * Kubernetes 1.16 版本及更高版本
   * 提供商支持双协议栈网络（云提供商或其他提供商必须能够为 Kubernetes 节点提供可路由的 IPv4/IPv6 网络接口）
   * 支持双协议栈的网络插件（如 Kubenet 或 Calico）

<!--
## Enable IPv4/IPv6 dual-stack
-->
## 启用 IPv4/IPv6 双协议栈

<!--
To enable IPv4/IPv6 dual-stack, enable the `IPv6DualStack` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the relevant components of your cluster, and set dual-stack cluster network assignments:
-->
要启用 IPv4/IPv6 双协议栈，为集群的相关组件启用 `IPv6DualStack`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
并且设置双协议栈的集群网络分配：

   * kube-apiserver:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` 例如 `--cluster-cidr=10.244.0.0/16,fc00::/48`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>` 例如 `--service-cluster-ip-range=10.0.0.0/16,fd00::/108`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` 对于 IPv4 默认为 /24，对于 IPv6 默认为 /64
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

<!--
## Services
-->
## 服务

<!--
If your cluster has IPv4/IPv6 dual-stack networking enabled, you can create {{< glossary_tooltip text="Services" term_id="service" >}} with either an IPv4 or an IPv6 address. You can choose the address family for the Service's cluster IP by setting a field, `.spec.ipFamily`, on that Service.
You can only set this field when creating a new Service. Setting the `.spec.ipFamily` field is optional and should only be used if you plan to enable IPv4 and IPv6 {{< glossary_tooltip text="Services" term_id="service" >}} and {{< glossary_tooltip text="Ingresses" term_id="ingress" >}} on your cluster. The configuration of this field not a requirement for [egress](#egress-traffic) traffic.
-->
如果你的集群启用了 IPv4/IPv6 双协议栈网络，则可以使用 IPv4 或 IPv6 地址来创建
{{< glossary_tooltip text="Service" term_id="service" >}}。
你可以通过设置服务的 `.spec.ipFamily` 字段来选择服务的集群 IP 的地址族。
你只能在创建新服务时设置该字段。`.spec.ipFamily` 字段的设置是可选的，
并且仅当你计划在集群上启用 IPv4 和 IPv6 的 {{< glossary_tooltip text="Service" term_id="service" >}}
和 {{< glossary_tooltip text="Ingress" term_id="ingress" >}}。
对于[出口](#出口流量)流量，该字段的配置不是必须的。

<!--
The default address family for your cluster is the address family of the first service cluster IP range configured via the `-service-cluster-ip-range` flag to the kube-controller-manager.
-->
{{< note >}}
集群的默认地址族是第一个服务集群 IP 范围的地址族，该地址范围通过
`kube-controller-manager` 上的 `--service-cluster-ip-range` 标志设置。
{{< /note >}}

<!--
You can set `.spec.ipFamily` to either:
-->
你可以设置 `.spec.ipFamily` 为：

<!--
   * `IPv4`: The API server will assign an IP from a `service-cluster-ip-range` that is `ipv4`
   * `IPv6`: The API server will assign an IP from a `service-cluster-ip-range` that is `ipv6`
-->
   * `IPv4`：API 服务器将从 `service-cluster-ip-range` 中分配 `ipv4` 地址
   * `IPv6`：API 服务器将从 `service-cluster-ip-range` 中分配 `ipv6` 地址

<!--
The following Service specification does not include the `ipFamily` field. Kubernetes will assign an IP address (also known as a "cluster IP") from the first configured `service-cluster-ip-range` to this Service.
-->
以下服务规约不包含 `ipFamily` 字段。Kubernetes 将从最初配置的 `service-cluster-ip-range` 范围内分配一个 IP 地址（也称作“集群 IP”）给该服务。

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

<!--
The following Service specification includes the `ipFamily` field. Kubernetes will assign an IPv6 address (also known as a "cluster IP") from the configured `service-cluster-ip-range` to this Service.
-->
以下服务规约包含 `ipFamily` 字段。Kubernetes 将从已配置的 `service-cluster-ip-range` 范围内分配一个 IPv6 地址（也称作“集群 IP”）给该服务。

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

<!--
For comparison, the following Service specification will be assigned an IPV4 address (also known as a "cluster IP") from the configured `service-cluster-ip-range` to this Service.
-->
为了进行比较，将从已配置的 `service-cluster-ip-range` 向该服务分配以下 IPV4 地址（也称为“集群 IP”）。

{{< codenew file="service/networking/dual-stack-ipv4-svc.yaml" >}}

<!--
### Type LoadBalancer
-->
### LoadBalancer 类型

<!--
On cloud providers which support IPv6 enabled external load balancers, setting the `type` field to `LoadBalancer` in additional to setting `ipFamily` field to `IPv6` provisions a cloud load balancer for your Service.
-->
在支持启用了 IPv6 的外部服务均衡器的云驱动上，除了将 `ipFamily` 字段设置为 `IPv6`，
将 `type` 字段设置为 `LoadBalancer`，为你的服务提供云负载均衡。

<!--
## Egress Traffic
-->
## 出口流量

<!--
The use of publicly routable and non-publicly routable IPv6 address blocks is acceptable provided the underlying {{< glossary_tooltip text="CNI" term_id="cni" >}} provider is able to implement the transport. If you have a Pod that uses non-publicly routable IPv6 and want that Pod to reach off-cluster destinations (eg. the public Internet), you must set up IP masquerading for the egress traffic and any replies. The [ip-masq-agent](https://github.com/kubernetes-incubator/ip-masq-agent) is dual-stack aware, so you can use ip-masq-agent for IP masquerading on dual-stack clusters.
-->
公共路由和非公共路由的 IPv6 地址块的使用是可以的。提供底层
{{< glossary_tooltip text="CNI" term_id="cni" >}} 的提供程序可以实现这种传输。
如果你拥有使用非公共路由 IPv6 地址的 Pod，并且希望该 Pod 到达集群外目的
（比如，公共网络），你必须为出口流量和任何响应消息设置 IP 伪装。
[ip-masq-agent](https://github.com/kubernetes-incubator/ip-masq-agent) 可以感知双栈，
所以你可以在双栈集群中使用 ip-masq-agent 来进行 IP 伪装。

<!--
## Known Issues
-->
## 已知问题

<!--
   * Kubenet forces IPv4,IPv6 positional reporting of IPs (-cluster-cidr)
-->
   * Kubenet 强制 IPv4，IPv6 的 IPs 位置报告 (`--cluster-cidr`)

## {{% heading "whatsnext" %}}

<!--
* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
-->
* [验证 IPv4/IPv6 双协议栈](/zh/docs/tasks/network/validate-dual-stack)网络


