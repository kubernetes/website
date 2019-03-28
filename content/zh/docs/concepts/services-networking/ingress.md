---
reviewers:
- bprashanth
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}

<!--
## Terminology

Throughout this doc you will see a few terms that are sometimes used interchangeably elsewhere, that might cause confusion. This section attempts to clarify them.

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes firewalled from the internet, that are the primary compute resources managed by Kubernetes.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the [Kubernetes networking model](/docs/concepts/cluster-administration/networking/). Examples of a Cluster network include Overlays such as [flannel](https://github.com/coreos/flannel#flannel) or SDNs such as [OVS](https://www.openvswitch.org/).
* Service: A Kubernetes [Service](/docs/concepts/services-networking/service/) that identifies a set of pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.
-->

## 专用术语

在本文档中，您将看到一些有时在其他地方可互换使用的术语，这些术语可能会引起混淆。 本节试图澄清它们

* 节点：Kubernetes 集群中的单个虚拟或物理机器。
* 集群：互联网防火墙保护下的一组节点，它们是 Kubernetes 管理的主要计算资源。
* 边缘路由器：为集群强制执行防火墙策略的路由器。这可以是由云提供商管理的网关或物理硬件。
* 集群网络：一组逻辑或物理的链接，根据 [Kubernetes 网络模型](/docs/concepts/cluster-administration/networking/) 在集群内实现通信。集群网络的例子包括 覆盖网络，例如 [flannel](https://github.com/coreos/flannel#flannel)；或者SDN，例如 [OVS](https://www.openvswitch.org/)。
* 服务：Kubernetes [服务](/zh/docs/concepts/services-networking/service/) 使用标签选择器标识一组 Pod。除非另有说明，否则假定服务只具有在集群网络中可路由的虚拟 IP。

<!--
## What is Ingress?

Typically, services and pods have IPs only routable by the cluster network. All traffic that ends up at an edge router is either dropped or forwarded elsewhere. Conceptually, this might look like:
-->

## Ingress 是什么？

通常，服务 和 Pod 具有仅能在集群网络内路由的 IP 地址。在边缘路由器结束的所有流量都被丢弃或转发到别处。从概念上讲，这可能看起来像：

```none
    internet
        |
  ------------
  [ Services ]
```

<!--
An Ingress is a collection of rules that allow inbound connections to reach the cluster services.
-->

Ingress 是允许连接到集群 Service 的规则集合。

```
    互联网
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

<!--
It can be configured to give services externally-reachable URLs, load balance traffic, terminate SSL, offer name based virtual hosting, and more. Users request ingress by POSTing the Ingress resource to the API server. An [Ingress controller](#ingress-controllers) is responsible for fulfilling the Ingress, usually with a loadbalancer, though it may also configure your edge router or additional frontends to help handle the traffic in an HA manner.
-->

它可以被配置为提供外部可访问的URL、负载均衡流量、终止SSL、提供基于名称的虚拟托管等等。
用户通过向 API 服务器 POST Ingress 资源来请求 Ingress。
[Ingress 控制器](#ingress-controllers) 负责实现 Ingress，它通常使用负载均衡器，不过它也可以配置边缘路由器或其他前端，从而帮助用户以 HA 方式处理流量。

<!--
## Prerequisites

Before you start using the Ingress resource, there are a few things you should understand. The Ingress is a beta resource, not available in any Kubernetes release prior to 1.1. You need an Ingress controller to satisfy an Ingress, simply creating the resource will have no effect.

GCE/Google Kubernetes Engine deploys an ingress controller on the master. You can deploy any number of custom ingress controllers in a pod. You must annotate each ingress with the appropriate class, as indicated [here](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) and [here](https://git.k8s.io/ingress-gce/examples/PREREQUISITES.md#ingress-class).

Make sure you review the [beta limitations](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations) of this controller. In environments other than GCE/Google Kubernetes Engine, you need to [deploy a controller](https://git.k8s.io/ingress-nginx/README.md) as a pod.
-->

## 环境准备

在开始使用 Ingress 资源之前，有一些事情您应该了解。
Ingress 是 beta 资源，在 1.1 之前的任何 Kubernetes 版本中都不可用。
您需要一个 Ingress 控制器来满足 Ingress，否则简单地创建资源将不起作用。

GCE／Google Kubernetes Engine 是在主节点上部署 Ingress 控制器。
您可以在 Pod 中部署任意数量的自定义 Ingress 控制器。
您必须使用适当的类来注释每个 Ingress，如[这里](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 和 [这里](https://git.k8s.io/ingress-gce/examples/PREREQUISITES.md#ingress-class) 所示。

一定要检查一下这个控制器的 [beta 限制](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations)。
在 GCE／Google Kubernetes Engine 之外的环境中，需要将[控制器部署](https://git.k8s.io/ingress-nginx/README.md) 为 Pod。

<!--
## The Ingress Resource

A minimal Ingress might look like:
-->

## Ingress 资源

最小的 Ingress 可能看起来像这样：

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

<!--
*POSTing this to the API server will have no effect if you have not configured an [Ingress controller](#ingress-controllers).*

__Lines 1-6__: As with all other Kubernetes config, an Ingress needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/) and [ingress configuration rewrite](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).

__Lines 7-9__: Ingress [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) has all the information needed to configure a loadbalancer or proxy server. Most importantly, it contains a list of rules matched against all incoming requests. Currently the Ingress resource only supports http rules.
-->

*如果尚未配置 [Ingress 控制器](#ingress-controllers)，则向 API 服务器 POST 操作将没有任何效果。*


__1-6 行__: 与其他 Kubernetes 对象配置一样，Ingress 需要 `apiVersion`、`kind`、和 `metadata` 字段。
有关使用配置文件的一般信息，请参见 
[部署应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/docs/tasks/configure-pod-container/configure-pod-configmap/)、
[管理资源](/docs/concepts/cluster-administration/manage-deployment/) 
和 [ingress 配置重写](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)。


__7-9 行__: Ingress [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) 具有配置负载均衡器或代理服务器所需的所有信息。
最重要的是，它包含与所有传入请求相匹配的规则列表。目前，Ingress 资源仅支持 HTTP 规则。

<!--
__Lines 10-11__: Each http rule contains the following information: A host (e.g.: foo.bar.com, defaults to * in this example), a list of paths (e.g.: /testpath) each of which has an associated backend (test:80). Both the host and path must match the content of an incoming request before the loadbalancer directs traffic to the backend.

__Lines 12-14__: A backend is a service:port combination as described in the [services doc](/docs/concepts/services-networking/service/). Ingress traffic is typically sent directly to the endpoints matching a backend.

__Global Parameters__: For the sake of simplicity the example Ingress has no global parameters, see the [API reference](https://releases.k8s.io/{{< param "githubbranch" >}}/staging/src/k8s.io/api/extensions/v1beta1/types.go) for a full definition of the resource. One can specify a global default backend in the absence of which requests that don't match a path in the spec are sent to the default backend of the Ingress controller.
-->

__10-11 行__: 每个 HTTP 规则都包含以下信息：主机（例如：foo.bar.com，在本例中默认为 * ），路径列表（例如：/testpath），每个路径都有一个关联的后端（test:80）。
在负载均衡器将流量路由到后端之前，主机和路径都必须与传入请求的规则匹配。

__12-14 行__: 如[services doc](/docs/concepts/services-net./service/)中所述，后端（endpoint）是 “Service:port” 的组合。
Ingress 流量通常被直接发送到与后端相匹配的端点。

__全局参数__: 为了简单起见，Ingress 示例没有全局参数，有关资源的完整定义请参见 [API引用](https://releases.k8s.io/{{< param "githubbranch" >}}/staging/src/k8s.io/api/extensions/v1beta1/types.go)。
您可以指定全局默认的后端，这样的话，当请求与 spec 中的路径不匹配时，就会被转发到 Ingress 控制器的默认后端。

<!--
## Ingress controllers

In order for the Ingress resource to work, the cluster must have an Ingress controller running. This is unlike other types of controllers, which typically run as part of the `kube-controller-manager` binary, and which are typically started automatically as part of cluster creation. Choose the ingress controller implementation that best fits your cluster, or implement a new ingress controller. 
-->

## Ingress 控制器

为了使 Ingress 资源正常工作，集群必须有 Ingress 控制器运行。
这不同于其他类型的控制器，它们通常作为 `kube-controller-manager` 二进制文件的一部分运行，并且通常作为集群创建的一部分自动启动。
请选择最适合您的集群的 Ingress 控制器，或者实现一个新的 Ingress 控制器。

<!--
* Kubernetes currently supports and maintains [GCE](https://git.k8s.io/ingress-gce/README.md) and [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers. 
* F5 Networks provides [support and maintenance](https://support.f5.com/csp/article/K86859508) for the [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest). 
* [Kong](https://konghq.com/) offers [community](https://discuss.konghq.com/c/kubernetes) or [commercial](https://konghq.com/api-customer-success/) support and maintenance for the [Kong Ingress Controller for Kubernetes](https://konghq.com/blog/kubernetes-ingress-controller-for-kong/)
* [Traefik](https://github.com/containous/traefik) is a fully featured ingress controller
([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket...), and it also comes with commercial support by [Containous](https://containo.us/services)
* [NGINX, Inc.](https://www.nginx.com/) offers support and maintenance for the [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)
* [HAProxy](http://www.haproxy.org/) based ingress controller [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) which is mentioned on this blog post [HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/)
* [Istio](https://istio.io/) based ingress controller [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/)

{{< note >}}
**Note:** Review the documentation for your controller to find its specific support policy.
{{< /note >}}
-->

* Kubernetes 当前支持并维护 [GCE](https://git.k8s.io/ingress-gce/README.md) 和 [nginx](https://git.k8s.io/ingress-nginx/README.md) 控制器。
* F5 Networks 为 [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest) 提供[支持和维护](https://support.f5.com/csp/article/K86859508)。
* [Kong](https://konghq.com/) 为 [Kong Ingress Controller for Kubernetes](https://konghq.com/blog/kubernetes-ingress-controller-for-kong/) 提供 [社区版](https://discuss.konghq.com/c/kubernetes) 或 [商业版](https://konghq.com/api-customer-success/) 支持和维护。
* [Traefik](https://github.com/containous/traefik) 是个全功能的 Ingress 控制器。
([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket...), 它也伴随着 [Containous](https://containo.us/services) 的商业支持。
* [NGINX, Inc.](https://www.nginx.com/) 为 [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller) 提供支持和维护。
* [HAProxy](http://www.haproxy.org/) 是 Ingress 控制器 [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) 的基础， 在这个博客中有提到它 [HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/)。
* [Istio](https://istio.io/) 是 Ingress 控制器 [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/) 的基础。

{{< note >}}
**注意:** 请检查你的控制器的文档以找到其特定的支持策略。
{{< /note >}}

<!--
## Before you begin

The following document describes a set of cross-platform features exposed through the Ingress resource. Ideally, all Ingress controllers should fulfill this specification, but we're not there yet. We currently support and maintain [GCE](https://git.k8s.io/ingress-gce/README.md) and [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers. If you use the F5 BIG-IP Controller, see [Use the BIG-IP Controller as a Kubernetes Ingress Controller](http://clouddocs.f5.com/containers/latest/kubernetes/kctlr-k8s-ingress-ctlr.html). 
-->

## 在您开始之前

下面的文档描述了通过Ingress资源公开的一组跨平台特性。
理想情况下，所有 Ingress 控制器都应该满足这个规范，但是我们还没有。
我们现在支持并维护 [GCE](https://git.k8s.io/ingress-gce/README.md) 和 [nginx](https://git.k8s.io/ingress-nginx/README.md) 控制器。
如果您使用 F5 BIG-IP 控制器，请参考 [使用 BIG-IP 控制器作为 Kubernetes Ingress 控制器](http://clouddocs.f5.com/containers/latest/kubernetes/kctlr-k8s-ingress-ctlr.html)。

<!--
{{< note >}}
**Note:** Make sure you review your controller's specific docs so you understand the caveats.
{{< /note >}}
-->

{{< note >}}
**注意:** 请您一定要查看您的控制器的特定文档，以便您能理解这些警告。
{{< /note >}}

<!--
## Types of Ingress

### Single Service Ingress

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)), however you can do so through an Ingress
as well, by specifying a *default backend* with no rules.
-->

## Ingress 的类型

### 单服务 Ingress

现有的 Kubernetes 概念允许您暴露单个 Service (查看 [替代方案](#alternatives))，同样您也可以使用 Ingress 来实现，具体方法是指定一个没有规则的 *默认后端（default backend）*。


{{< codenew file="service/networking/ingress.yaml" >}}

<!--
If you create it using `kubectl create -f` you should see:
-->

如果您用 `kubectl create -f`创建它，你应该看到：


```shell
kubectl get ingress test-ingress
```

```shell
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

<!--
Where `107.178.254.228` is the IP allocated by the Ingress controller to satisfy
this Ingress.
-->

其中 `107.178.254.228` 是 Ingress 控制器为该 Ingress 分配的 IP 该。

<!--
### Simple fanout

As described previously, Pods within kubernetes have IPs only visible on the
cluster network, so we need something at the edge accepting ingress traffic and
proxying it to the right endpoints. This component is usually a highly available
loadbalancer. An Ingress allows you to keep the number of loadbalancers down
to a minimum. For example, a setup like:
-->

### 简单分列

如前所述，Kubernetes 中 Pod 的 IP 仅在集群网络上可见，所以我们需要在集群网络的边缘接收下行流量并将其代理到正确的端点。
这个组件通常是一个高可用的负载均衡器。Ingress 允许您将负载均衡器的数量降至最低。例如，这样的设置：

```shell
foo.bar.com -> 178.91.123.132 -> / foo    s1:80
                                 / bar    s2:80
```

<!--
would require an Ingress such as:
-->

可能需要一个 Ingress 就像：

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: s1
          servicePort: 80
      - path: /bar
        backend:
          serviceName: s2
          servicePort: 80
```

<!--
When you create the Ingress with `kubectl create -f`:
-->

当您使用 `kubectl create -f` 创建 Ingress 时：

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
               /bar   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

<!--
The Ingress controller will provision an implementation specific loadbalancer
that satisfies the Ingress, as long as the services (`s1`, `s2`) exist.
When it has done so, you will see the address of the loadbalancer at the
Address field.
-->

Ingress 控制器将提供实现特定的负载均衡器来满足 Ingress，只要 Service (`s1`，`s2`) 存在。
当它这样做了，你会在地址栏看到负载平衡器的地址。

{{< note >}}
<!--**Note:** You need to create a default-http-backend [Service](/docs/concepts/services-networking/service/) if necessary.-->
**注意:** 如果需要，你需要创建一个默认的 HTTP 后端 [Service](/zh/docs/concepts/services-networking/service/)。
{{< /note >}}


<!--
### Name based virtual hosting

Name-based virtual hosts use multiple host names for the same IP address.
-->

### 基于名称的虚拟托管

基于名称的虚拟主机为同一个 IP 地址使用多个主机名。

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

<!--
The following Ingress tells the backing loadbalancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->

下面的 Ingress 让后台的负载均衡器基于 [Host header](https://tools.ietf.org/html/rfc7230#section-5.4) 路由请求。

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
```

<!--
__Default Backends__: An Ingress with no rules, like the one shown in the previous
section, sends all traffic to a single default backend. You can use the same
technique to tell a loadbalancer where to find your website's 404 page, by
specifying a set of rules *and* a default backend. Traffic is routed to your
default backend if none of the Hosts in your Ingress match the Host in the
request header, and/or none of the paths match the URL of the request.
-->

__默认后端__: 一个没有规则的 Ingress，如前面部分所示，它将所有流量发送到单个默认后端。
通过指定一组规则*和*默认后端，您可以使用相同的技术来告诉负载均衡器在哪里找到网站的 404 页面。
如果 Ingress 中的主机与请求头中的主机不匹配，和/或没有路径与请求的 URL 匹配，则流量被路由到默认后端。

<!--
### TLS

You can secure an Ingress by specifying a [secret](/docs/concepts/configuration/secret)
that contains a TLS private key and certificate. Currently the Ingress only
supports a single TLS port, 443, and assumes TLS termination. If the TLS
configuration section in an Ingress specifies different hosts, they will be
multiplexed on the same port according to the hostname specified through the
SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret
must contain keys named `tls.crt` and `tls.key` that contain the certificate
and private key to use for TLS, e.g.:
-->

### TLS

您可以通过指定包含TLS私钥和证书的 [secret](/zh/docs/concepts/configuration/secret) 来加密 Ingress。
目前，Ingress 只支持单个 TLS 端口，443，并假定 TLS 终止。
如果 Ingress 中的 TLS 配置部分指定了不同的主机，那么它们将根据通过 SNI TLS 扩展指定的主机名（如果 Ingress 控制器支持 SNI）在同一端口上进行复用。
TLS Secret 必须包含名为 `tls.crt` 和 `tls.key` 的密钥，这些密钥包含用于 TLS 的证书和私钥，例如：

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret
  namespace: default
type: Opaque
```

<!--
Referencing this secret in an Ingress will tell the Ingress controller to
secure the channel from the client to the loadbalancer using TLS:
-->

在 Ingress 中引用此 Secret 将会告诉 Ingress 控制器使用 TLS 保护从客户端到负载均衡器的通道：

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: no-rules-map
spec:
  tls:
  - secretName: testsecret
  backend:
    serviceName: s1
    servicePort: 80
```

<!--
Note that there is a gap between TLS features supported by various Ingress
controllers. Please refer to documentation on
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific Ingress controller to understand how TLS works in your environment.
-->

注意，各种 Ingress 控制器所支持的 TLS 功能之间存在间隙。请参阅有关文件
[nginx](https://git.k8s.io/ingress-nginx/README.md#https)，
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)， 
或任何其他平台特定的 Ingress 控制器，以了解 TLS 如何在您的环境中工作。

<!--
### Loadbalancing

An Ingress controller is bootstrapped with some load balancing policy settings
that it applies to all Ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
Ingress. You can still get these features through the
[service loadbalancer](https://github.com/kubernetes/ingress-nginx).
 With time, we plan to distill load balancing patterns that are applicable
cross platform into the Ingress resource.
-->

### 负载均衡

Ingress控制器使用一些适用于所有 Ingress 的负载均衡策略设置进行自举，例如负载平衡算法、后端权重方案等。
更高级的负载平衡概念（例如，持久会话、动态权重）尚未通过Ingress公开。
您仍然可以通过 [Service 负载均衡器](https://github.com/kubernetes/ingress-nginx) 获得这些特性。
随着时间的推移，我们计划将跨平台应用的负载平衡模式提取到 Ingress 资源中。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
which allow you to achieve the same end result. Please review the controller
specific docs to see how they handle health checks (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->

值得注意的是，即使健康检查不是通过 Ingress 直接暴露的，但是在 Kubernetes 中存在并行概念，比如 [就绪检查](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)，它允许您实现相同的最终结果。
请检查控制器说明文档，以了解他们是怎样实现健康检查的 (
[nginx](https://git.k8s.io/ingress-nginx/README.md)，
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))。


<!--
## Updating an Ingress

Say you'd like to add a new Host to an existing Ingress, you can update it by editing the resource:
-->

## 更新 Ingress

假设您想向现有的 Ingress 中添加新主机，可以通过编辑资源来更新它：

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

<!--
This should pop up an editor with the existing yaml, modify it to include the new Host:
-->

这应该弹出一个编辑器与现有的 yaml，修改它来增加新的主机：

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
        path: /foo
..
```

<!--
Saving the yaml will update the resource in the API server, which should tell the Ingress controller to reconfigure the loadbalancer.
-->

保存 yaml 将更新 API 服务器中的资源，这应该会告诉 Ingress 控制器来重新配置负载均衡器。

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

<!--
You can achieve the same by invoking `kubectl replace -f` on a modified Ingress yaml file.
-->

您可以通过 `kubectl replace -f` 命令调用修改后的 Ingress yaml 文件来获得同样的结果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers. Please check the documentation of the relevant Ingress controller for details. Please refer to the federation [doc](/docs/concepts/cluster-administration/federation/) for details on deploying Ingress in a federated cluster.
-->

## 跨可用区失败

用于跨故障域传播流量的技术在云提供商之间是不同的。详情请查阅相关 Ingress 控制器的文档。
有关在联邦集群中部署 Ingress 的详细信息，请参阅联邦 [文档](/zh/docs/concepts/cluster-administration/federation/)。 


<!--
## Future Work

* Various modes of HTTPS/TLS support (e.g.: SNI, re-encryption)
* Requesting an IP or Hostname via claims
* Combining L4 and L7 Ingress
* More Ingress controllers

Please track the [L7 and Ingress proposal](https://github.com/kubernetes/kubernetes/pull/12827) for more details on the evolution of the resource, and the [Ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the evolution of various Ingress controllers.
-->

## 未来的工作

*各种 HTTPS/TLS 模式的支持（例如：SNI、重加密）
*通过声明请求IP或主机名
*合并 L4 和 L7 Ingress
*更多 Ingress 控制器

请跟踪 [L7 and Ingress proposal](https://github.com/kubernetes/kubernetes/pull/12827)以了解关于资源演化的更多细节，以及 [Ingress repository](https://github.com/kubernetes/ingress/tree/master) 以了解关于各种 Ingress 控制器演进的更多细节。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
* Use a [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)
-->

## 替代方案

不直接使用 Ingress 资源，也有多种方法暴露 Service：

* 使用 [Service.Type=LoadBalancer](/zh/docs/concepts/services-networking/service/#loadbalancer)
* 使用 [Service.Type=NodePort](/zh/docs/concepts/services-networking/service/#nodeport)
* 使用 [端口代理](https://git.k8s.io/contrib/for-demos/proxy-to-service)

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}

