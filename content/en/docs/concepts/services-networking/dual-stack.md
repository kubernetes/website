---
reviewers:
- lachie83
- khenidak
- aramase
title: IPv4/IPv6 dual-stack
feature:
  title: IPv4/IPv6 dual-stack
  description: >
    Allocation of IPv4 and IPv6 addresses to Pods and Services

content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

 IPv4/IPv6 dual-stack enables the allocation of both IPv4 and IPv6 addresses to {{< glossary_tooltip text="Pods" term_id="pod" >}} and {{< glossary_tooltip text="Services" term_id="service" >}}.

If you enable IPv4/IPv6 dual-stack networking for your Kubernetes cluster, the cluster will support the simultaneous assignment of both IPv4 and IPv6 addresses.

{{% /capture %}}

{{% capture body %}}

## Supported Features

Enabling IPv4/IPv6 dual-stack on your Kubernetes cluster provides the following features:

   * Dual-stack Pod networking (a single IPv4 and IPv6 address assignment per Pod)
   * IPv4 and IPv6 enabled Services (each Service must be for a single address family)
   * Kubenet multi address family support (IPv4 and IPv6)
   * Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces

## Prerequisites

The following prerequisites are needed in order to utilize IPv4/IPv6 dual-stack Kubernetes clusters:

   * Kubernetes 1.16 or later
   * Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
   * Kubenet network plugin
   * Kube-proxy running in mode IPVS

## Enable IPv4/IPv6 dual-stack

To enable IPv4/IPv6 dual-stack, enable the `IPv6DualStack` [feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) for the relevant components of your cluster, and set dual-stack cluster network assignments:

   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` eg. `--cluster-cidr=10.244.0.0/16,fc00::/24`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--proxy-mode=ipvs`
      * `--cluster-cidrs=<IPv4 CIDR>,<IPv6 CIDR>` 
      * `--feature-gates="IPv6DualStack=true"`

{{< caution >}}
If you specify an IPv6 address block larger than a /24 via  `--cluster-cidr` on the command line, that assignment will fail.
{{< /caution >}}

## Services

If your cluster has IPv4/IPv6 dual-stack networking enabled, you can create {{< glossary_tooltip text="Services" term_id="service" >}} with either an IPv4 or an IPv6 address. You can choose the address family for the Service's cluster IP by setting a field, `.spec.ipFamily`, on that Service.
You can only set this field when creating a new Service. Setting the `.spec.ipFamily` field is optional and should only be used if you plan to enable IPv4 and IPv6 {{< glossary_tooltip text="Services" term_id="service" >}} and {{< glossary_tooltip text="Ingresses" term_id="ingress" >}} on your cluster. The configuration of this field not a requirement for [egress](#egress-traffic) traffic.

{{< note >}}
The default address family for your cluster is the address family of the first service cluster IP range configured via the `--service-cluster-ip-range` flag to the kube-controller-manager.
{{< /note >}}

You can set `.spec.ipFamily` to either:

   * `IPv4`: The API server will assign an IP from a `service-cluster-ip-range` that is `ipv4`
   * `IPv6`: The API server will assign an IP from a `service-cluster-ip-range` that is `ipv6`

The following Service specification does not include the `ipFamily` field. Kubernetes will assign an IP address (also known as a "cluster IP") from the first configured `service-cluster-ip-range` to this Service.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

The following Service specification includes the `ipFamily` field. Kubernetes will assign an IPv6 address (also known as a "cluster IP") from the configured `service-cluster-ip-range` to this Service.

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

For comparison, the following Service specification will be assigned an IPV4 address (also known as a "cluster IP") from the configured `service-cluster-ip-range` to this Service.

{{< codenew file="service/networking/dual-stack-ipv4-svc.yaml" >}}

### Type LoadBalancer

On cloud providers which support IPv6 enabled external load balancers, setting the `type` field to `LoadBalancer` in additional to setting `ipFamily` field to `IPv6` provisions a cloud load balancer for your Service.

## Egress Traffic

The use of publicly routable and non-publicly routable IPv6 address blocks is acceptable provided the underlying {{< glossary_tooltip text="CNI" term_id="cni" >}} provider is able to implement the transport. If you have a Pod that uses non-publicly routable IPv6 and want that Pod to reach off-cluster destinations (eg. the public Internet), you must set up IP masquerading for the egress traffic and any replies. The [ip-masq-agent](https://github.com/kubernetes-incubator/ip-masq-agent) is dual-stack aware, so you can use ip-masq-agent for IP masquerading on dual-stack clusters.

## Known Issues

   * IPv6 network block assignment uses the default IPv4 CIDR block size (/24)
   * Kubenet forces IPv4,IPv6 positional reporting of IPs (--cluster-cidr)
   * Dual-stack networking does not function if the `EndpointSlice` feature gate is enabled.

{{% /capture %}}

{{% capture whatsnext %}}

* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking

{{% /capture %}}
