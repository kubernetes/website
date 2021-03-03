---
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
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

 IPv4/IPv6 dual-stack enables the allocation of both IPv4 and IPv6 addresses to {{< glossary_tooltip text="Pods" term_id="pod" >}} and {{< glossary_tooltip text="Services" term_id="service" >}}.

If you enable IPv4/IPv6 dual-stack networking for your Kubernetes cluster, the cluster will support the simultaneous assignment of both IPv4 and IPv6 addresses.



<!-- body -->

## Supported Features

Enabling IPv4/IPv6 dual-stack on your Kubernetes cluster provides the following features:

   * Dual-stack Pod networking (a single IPv4 and IPv6 address assignment per Pod)
   * IPv4 and IPv6 enabled Services
   * Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces

## Prerequisites

The following prerequisites are needed in order to utilize IPv4/IPv6 dual-stack Kubernetes clusters:

   * Kubernetes 1.20 or later  
     For information about using dual-stack services with earlier
     Kubernetes versions, refer to the documentation for that version
     of Kubernetes.
   * Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
   * A network plugin that supports dual-stack (such as Kubenet or Calico)

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

{{< note >}}
An example of an IPv4 CIDR: `10.244.0.0/16` (though you would supply your own address range)

An example of an IPv6 CIDR: `fdXY:IJKL:MNOP:15::/64` (this shows the format but is not a valid address - see [RFC 4193](https://tools.ietf.org/html/rfc4193))

Starting in 1.21, IPv4/IPv6 dual-stack defaults to true. Disable if necessary on kube-apiserver, kube-controller-manager, kubelet, and kube-proxy with `--feature-gates="IPv6DualStack=false"`.
{{< /note >}}

## Services

You can create {{< glossary_tooltip text="Services" term_id="service" >}} which can use IPv4, IPv6, or both.

The address family of a Service defaults to the address family of the first service cluster IP range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver).

When you define a Service you can optionally configure it as dual stack. To specify the behavior you want, you
set the `.spec.ipFamilyPolicy` field to one of the following values:

* `SingleStack`: Single-stack service. The control plane allocates a cluster IP for the Service, using the first configured service cluster IP range.
* `PreferDualStack`:
  * Allocates IPv4 and IPv6 cluster IPs for the Service. (If the cluster has `--feature-gates="IPv6DualStack=false"`, this setting follows the same behavior as `SingleStack`.)
* `RequireDualStack`: Allocates Service `.spec.ClusterIPs` from both IPv4 and IPv6 address ranges.
  * Selects the `.spec.ClusterIP` from the list of `.spec.ClusterIPs` based on the address family of the first element in the `.spec.ipFamilies` array.

If you would like to define which IP family to use for single stack or define the order of IP families for dual-stack, you can choose the address families by setting an optional field, `.spec.ipFamilies`, on the Service. 

{{< note >}}
The `.spec.ipFamilies` field is immutable because the `.spec.ClusterIP` cannot be reallocated on a Service that already exists. If you want to change `.spec.ipFamilies`, delete and recreate the Service.
{{< /note >}}

You can set `.spec.ipFamilies` to any of the following array values:

- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (dual stack)
- `["IPv6","IPv4"]` (dual stack)

The first family you list is used for the legacy `.spec.ClusterIP` field.

### Dual-stack Service configuration scenarios

These examples demonstrate the behavior of various dual-stack Service configuration scenarios.

#### Dual-stack options on new Services

1. This Service specification does not explicitly define `.spec.ipFamilyPolicy`. When you create this Service, Kubernetes assigns a cluster IP for the Service from the first configured `service-cluster-ip-range` and sets the `.spec.ipFamilyPolicy` to `SingleStack`. ([Services without selectors](/docs/concepts/services-networking/service/#services-without-selectors) and [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors will behave in this same way.)

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

1. This Service specification explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`. When you create this Service on a dual-stack cluster, Kubernetes assigns both IPv4 and IPv6 addresses for the service. The control plane updates the `.spec` for the Service to record the IP address assignments. The field `.spec.ClusterIPs` is the primary field, and contains both assigned IP addresses; `.spec.ClusterIP` is a secondary field with its value calculated from `.spec.ClusterIPs`.
   
      * For the `.spec.ClusterIP` field, the control plane records the IP address that is from the same address family as the first service cluster IP range. 
      * On a single-stack cluster, the `.spec.ClusterIPs` and `.spec.ClusterIP` fields both only list one address. 
      * On a cluster with dual-stack enabled, specifying `RequireDualStack` in `.spec.ipFamilyPolicy` behaves the same as `PreferDualStack`.

{{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

1. This Service specification explicitly defines `IPv6` and `IPv4` in `.spec.ipFamilies` as well as defining `PreferDualStack` in `.spec.ipFamilyPolicy`. When Kubernetes assigns an IPv6 and IPv4 address in `.spec.ClusterIPs`, `.spec.ClusterIP` is set to the IPv6 address because that is the first element in the `.spec.ClusterIPs` array, overriding the default.

{{< codenew file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" >}}

#### Dual-stack defaults on existing Services

These examples demonstrate the default behavior when dual-stack is newly enabled on a cluster where Services already exist. (Upgrading an existing cluster to 1.21 will enable dual-stack unless `--feature-gates="IPv6DualStack=false"` is set.)

1. When dual-stack is enabled on a cluster, existing Services (whether `IPv4` or `IPv6`) are configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set `.spec.ipFamilies` to the address family of the existing Service. The existing Service cluster IP will be stored in `.spec.ClusterIPs`.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   You can validate this behavior by using kubectl to inspect an existing service.

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

1. When dual-stack is enabled on a cluster, existing [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors are configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set `.spec.ipFamilies` to the address family of the first service cluster IP range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver) even though `.spec.ClusterIP` is set to `None`.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   You can validate this behavior by using kubectl to inspect an existing headless service with selectors.

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

#### Switching Services between single-stack and dual-stack

Services can be changed from single-stack to dual-stack and from dual-stack to single-stack.

1. To change a Service from single-stack to dual-stack, change `.spec.ipFamilyPolicy` from `SingleStack` to `PreferDualStack` or `RequireDualStack` as desired. When you change this Service from single-stack to dual-stack, Kubernetes assigns the missing address family so that the Service now has IPv4 and IPv6 addresses.

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

1. To change a Service from dual-stack to single-stack, change `.spec.ipFamilyPolicy` from `PreferDualStack` or `RequireDualStack` to `SingleStack`. When you change this Service from dual-stack to single-stack, Kubernetes retains only the first element in the `.spec.ClusterIPs` array, and sets `.spec.ClusterIP` to that IP address and sets `.spec.ipFamilies` to the address family of `.spec.ClusterIPs`.

### Headless Services without selector

For [Headless Services without selectors](/docs/concepts/services-networking/service/#without-selectors) and without `.spec.ipFamilyPolicy` explicitly set, the `.spec.ipFamilyPolicy` field defaults to `RequireDualStack`.

### Service type LoadBalancer

To provision a dual-stack load balancer for your Service:
   * Set the `.spec.type` field to `LoadBalancer`
   * Set `.spec.ipFamilyPolicy` field to `PreferDualStack` or `RequireDualStack`

{{< note >}}
To use a dual-stack `LoadBalancer` type Service, your cloud provider must support IPv4 and IPv6 load balancers.
{{< /note >}}

## Egress traffic

If you want to enable egress traffic in order to reach off-cluster destinations (eg. the public Internet) from a Pod that uses non-publicly routable IPv6 addresses, you need to enable the Pod to use a publicly routed IPv6 address via a mechanism such as transparent proxying or IP masquerading. The [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) project supports IP masquerading on dual-stack clusters.

{{< note >}}
Ensure your {{< glossary_tooltip text="CNI" term_id="cni" >}} provider supports IPv6.
{{< /note >}}

## {{% heading "whatsnext" %}}


* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
