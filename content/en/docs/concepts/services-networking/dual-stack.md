---
title: IPv4/IPv6 dual-stack
description: >-
  Kubernetes lets you configure single-stack IPv4 networking,
  single-stack IPv6 networking, or dual stack networking with
  both network families active. This page explains how.
feature:
  title: IPv4/IPv6 dual-stack
  description: >
    Allocation of IPv4 and IPv6 addresses to Pods and Services
content_type: concept
reviewers:
  - lachie83
  - khenidak
  - aramase
  - bridgetkromhout
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

IPv4/IPv6 dual-stack networking enables the allocation of both IPv4 and IPv6 addresses to
{{< glossary_tooltip text="Pods" term_id="pod" >}} and {{< glossary_tooltip text="Services" term_id="service" >}}.

IPv4/IPv6 dual-stack networking is enabled by default for your Kubernetes cluster starting in
1.21, allowing the simultaneous assignment of both IPv4 and IPv6 addresses.

<!-- body -->

## Supported Features

IPv4/IPv6 dual-stack on your Kubernetes cluster provides the following features:

* Dual-stack Pod networking (a single IPv4 and IPv6 address assignment per Pod)
* IPv4 and IPv6 enabled Services
* Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces

## Prerequisites

The following prerequisites are needed in order to utilize IPv4/IPv6 dual-stack Kubernetes clusters:

* Kubernetes 1.20 or later

  For information about using dual-stack services with earlier
  Kubernetes versions, refer to the documentation for that version
  of Kubernetes.

* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide
  Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) that
  supports dual-stack networking.

## Configure IPv4/IPv6 dual-stack

To configure IPv4/IPv6 dual-stack, set dual-stack cluster network assignments:

* kube-apiserver:
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
* kube-controller-manager:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` defaults to /24 for IPv4 and /64 for IPv6
* kube-proxy:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
* kubelet:
  * `--node-ip=<IPv4 IP>,<IPv6 IP>`
    * This option is required for bare metal dual-stack nodes (nodes that do not define a
      cloud provider with the `--cloud-provider` flag). If you are using a cloud provider
      and choose to override the node IPs chosen by the cloud provider, set the
      `--node-ip` option.
    * (The legacy built-in cloud providers do not support dual-stack `--node-ip`.)

{{< note >}}
An example of an IPv4 CIDR: `10.244.0.0/16` (though you would supply your own address range)

An example of an IPv6 CIDR: `fdXY:IJKL:MNOP:15::/64` (this shows the format but is not a valid
address - see [RFC 4193](https://tools.ietf.org/html/rfc4193))
{{< /note >}}

## Services

You can create {{< glossary_tooltip text="Services" term_id="service" >}} which can use IPv4, IPv6, or both.

The address family of a Service defaults to the address family of the first service cluster IP
range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver).

When you define a Service you can optionally configure it as dual stack. To specify the behavior you want, you
set the `.spec.ipFamilyPolicy` field to one of the following values:

* `SingleStack`: Single-stack service. The control plane allocates a cluster IP for the Service,
  using the first configured service cluster IP range.
* `PreferDualStack`: Allocates both IPv4 and IPv6 cluster IPs for the Service when dual-stack is enabled. If dual-stack is not enabled or supported, it falls back to single-stack behavior.
* `RequireDualStack`: Allocates Service `.spec.clusterIPs` from both IPv4 and IPv6 address ranges when dual-stack is enabled. If dual-stack is not enabled or supported, the Service API object creation fails.
  * Selects the `.spec.clusterIP` from the list of `.spec.clusterIPs` based on the address family
    of the first element in the `.spec.ipFamilies` array.

If you would like to define which IP family to use for single stack or define the order of IP
families for dual-stack, you can choose the address families by setting an optional field,
`.spec.ipFamilies`, on the Service.

{{< note >}}
The `.spec.ipFamilies` field is conditionally mutable: you can add or remove a secondary
IP address family, but you cannot change the primary IP address family of an existing Service.
{{< /note >}}

You can set `.spec.ipFamilies` to any of the following array values:

- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (dual stack)
- `["IPv6","IPv4"]` (dual stack)

The first family you list is used for the legacy `.spec.clusterIP` field.

### Dual-stack Service configuration scenarios

These examples demonstrate the behavior of various dual-stack Service configuration scenarios.

#### Dual-stack options on new Services

1. This Service specification does not explicitly define `.spec.ipFamilyPolicy`. When you create
   this Service, Kubernetes assigns a cluster IP for the Service from the first configured
   `service-cluster-ip-range` and sets the `.spec.ipFamilyPolicy` to `SingleStack`. ([Services
   without selectors](/docs/concepts/services-networking/service/#services-without-selectors) and
   [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors
   will behave in this same way.)

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

1. This Service specification explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`. When
   you create this Service on a dual-stack cluster, Kubernetes assigns both IPv4 and IPv6
   addresses for the service. The control plane updates the `.spec` for the Service to record the IP
   address assignments. The field `.spec.clusterIPs` is the primary field, and contains both assigned
   IP addresses; `.spec.clusterIP` is a secondary field with its value calculated from
   `.spec.clusterIPs`.

   * For the `.spec.clusterIP` field, the control plane records the IP address that is from the
     same address family as the first service cluster IP range.
   * On a single-stack cluster, the `.spec.clusterIPs` and `.spec.clusterIP` fields both only list
     one address.
   * On a cluster with dual-stack enabled, specifying `RequireDualStack` in `.spec.ipFamilyPolicy`
     behaves the same as `PreferDualStack`.

   {{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

1. This Service specification explicitly defines `IPv6` and `IPv4` in `.spec.ipFamilies` as well
   as defining `PreferDualStack` in `.spec.ipFamilyPolicy`. When Kubernetes assigns an IPv6 and
   IPv4 address in `.spec.clusterIPs`, `.spec.clusterIP` is set to the IPv6 address because that is
   the first element in the `.spec.clusterIPs` array, overriding the default.

   {{% code_sample file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" %}}

#### Dual-stack defaults on existing Services

These examples demonstrate the default behavior when dual-stack is newly enabled on a cluster
where Services already exist. (Upgrading an existing cluster to 1.21 or beyond will enable
dual-stack.)

1. When dual-stack is enabled on a cluster, existing Services (whether `IPv4` or `IPv6`) are
   configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set
   `.spec.ipFamilies` to the address family of the existing Service. The existing Service cluster IP
   will be stored in `.spec.clusterIPs`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   You can validate this behavior by using kubectl to inspect an existing service.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
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
       app.kubernetes.io/name: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

1. When dual-stack is enabled on a cluster, existing
   [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors are
   configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set
   `.spec.ipFamilies` to the address family of the first service cluster IP range (configured via the
   `--service-cluster-ip-range` flag to the kube-apiserver) even though `.spec.clusterIP` is set to
   `None`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   You can validate this behavior by using kubectl to inspect an existing headless service with selectors.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
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
       app.kubernetes.io/name: MyApp
   ```

#### Switching Services between single-stack and dual-stack

Services can be changed from single-stack to dual-stack and from dual-stack to single-stack.

1. To change a Service from single-stack to dual-stack, change `.spec.ipFamilyPolicy` from
   `SingleStack` to `PreferDualStack` or `RequireDualStack` as desired. When you change this
   Service from single-stack to dual-stack, Kubernetes assigns the missing address family so that the
   Service now has IPv4 and IPv6 addresses.

   Edit the Service specification updating the `.spec.ipFamilyPolicy` from `SingleStack` to `PreferDualStack`.

   Before:

   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```

   After:

   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

1. To change a Service from dual-stack to single-stack, change `.spec.ipFamilyPolicy` from
   `PreferDualStack` or `RequireDualStack` to `SingleStack`. When you change this Service from
   dual-stack to single-stack, Kubernetes retains only the first element in the `.spec.clusterIPs`
   array, and sets `.spec.clusterIP` to that IP address and sets `.spec.ipFamilies` to the address
   family of `.spec.clusterIPs`.

### Headless Services without selector

For [Headless Services without selectors](/docs/concepts/services-networking/service/#without-selectors)
and without `.spec.ipFamilyPolicy` explicitly set, the `.spec.ipFamilyPolicy` field defaults to
`RequireDualStack`.

### Service type LoadBalancer

To provision a dual-stack load balancer for your Service:

* Set the `.spec.type` field to `LoadBalancer`
* Set `.spec.ipFamilyPolicy` field to `PreferDualStack` or `RequireDualStack`

{{< note >}}
To use a dual-stack `LoadBalancer` type Service, your cloud provider must support IPv4 and IPv6
load balancers.
{{< /note >}}

## Egress traffic

If you want to enable egress traffic in order to reach off-cluster destinations (eg. the public
Internet) from a Pod that uses non-publicly routable IPv6 addresses, you need to enable the Pod to
use a publicly routed IPv6 address via a mechanism such as transparent proxying or IP
masquerading. The [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) project
supports IP masquerading on dual-stack clusters.

{{< note >}}
Ensure your {{< glossary_tooltip text="CNI" term_id="cni" >}} provider supports IPv6.
{{< /note >}}

## Windows support

Kubernetes on Windows does not support single-stack "IPv6-only" networking. However,
dual-stack IPv4/IPv6 networking for pods and nodes with single-family services
is supported.

You can use IPv4/IPv6 dual-stack networking with `l2bridge` networks.

{{< note >}}
Overlay (VXLAN) networks on Windows **do not** support dual-stack networking.
{{< /note >}}

You can read more about the different network modes for Windows within the
[Networking on Windows](/docs/concepts/services-networking/windows-networking#network-modes) topic.

## {{% heading "whatsnext" %}}

* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* [Enable dual-stack networking using kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)

