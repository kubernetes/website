---
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.1" state="beta" >}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}

<!--
## Terminology

For clarity, this guide defines the following terms:


Node
: A worker machine in Kubernetes, part of a cluster.

Cluster
: A set of Nodes that run containerized applications managed by Kubernetes. For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.

Edge router
: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.

Cluster network
: A set of links, logical or physical, that facilitate communication within a cluster according to the Kubernetes [networking model](/docs/concepts/cluster-administration/networking/).

Service
: A Kubernetes {{< glossary_tooltip term_id="service" >}} that identifies a set of Pods using {{< glossary_tooltip text="label" term_id="label" >}} selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.
-->

## 专用术语

为了避免歧义，本指南定义了以下术语：

节点
：Kubernetes 集群中的单个工作机器。

集群
：运行由Kubernetes管理的容器化应用程序的一组节点。 对于此示例，在大多数常见的Kubernetes部署中，群集中的节点不属于公共网络。

边缘路由器
：为集群强制执行防火墙策略的路由器。这可以是由云提供商管理的网关或物理硬件。

集群网络
：一组逻辑或物理的链接，根据 Kubernetes [网络模型](/docs/concepts/cluster-administration/networking/) 在集群内实现通信。

服务：
Kubernetes {{< glossary_tooltip term_id="service" >}} 使用 {{< glossary_tooltip text="标签" term_id="label" >}} 选择器标识一组 Pod。除非另有说明，否则假定服务只具有在集群网络中可路由的虚拟 IP。

<!--
## What is Ingress?

Ingress exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.
-->

## Ingress 是什么？

Ingress公开了从群集外部到群集内 {{< link text="services" url="/docs/concepts/services-networking/service/" >}} 的HTTP和HTTPS路由。
流量路由由Ingress资源上定义的规则控制。

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

<!--
An Ingress can be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name based virtual hosting. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers) is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

An Ingress can be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name based virtual hosting. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers) is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).
-->

可以将Ingress配置为提供服务外部可访问的URL，负载平衡流量，终止 SSL / TLS 并提供基于名称的虚拟主机。 [Ingress 控制器](/docs/concepts/services-networking/ingress-controllers)通常负责通过负载平衡器来实现入口，尽管它也可以配置边缘路由器或其他前端以帮助处理流量。

Ingress 不会公开任意端口或协议。 将 HTTP 和 HTTPS 以外的服务公开给 Internet 时，通常使用以下类型的服务 [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) 或者 [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

<!--
## Prerequisites

You must have an [ingress controller](/docs/concepts/services-networking/ingress-controllers) to satisfy an Ingress. Only creating an Ingress resource has no effect.

You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). You can choose from a number of
[Ingress controllers](/docs/concepts/services-networking/ingress-controllers).

Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.
-->

## 环境准备

您必须具有[ Ingress 控制器](/docs/concepts/services-networking/ingress-controllers)才能满足Ingress的要求。 仅创建Ingress资源无效。

您可以部署一个 Ingress 控制器

GCE／Google Kubernetes Engine 是在主节点上部署 Ingress 控制器。
您可以在 Pod 中部署任意数量的自定义 Ingress 控制器。
您必须使用适当的类来注释每个 Ingress，如[这里](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 和 [这里](https://git.k8s.io/ingress-gce/examples/PREREQUISITES.md#ingress-class) 所示。

一定要检查一下这个控制器的 [beta 限制](https://github.com/kubernetes/ingress-gce/blob/master/LIMITATIONS.md)。
在 GCE／Google Kubernetes Engine 之外的环境中，需要将[控制器部署](https://git.k8s.io/ingress-nginx/README.md) 为 Pod。

{{< note >}}

<!--
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
-->
确保您查看了 Ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

<!--
## The Ingress Resource

A minimal Ingress resource example:
-->

## Ingress 资源

最小的 Ingress 资源实例：

```yaml
apiVersion: networking.k8s.io/v1beta1
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
 As with all other Kubernetes resources, an Ingress needs `apiVersion`, `kind`, and `metadata` fields.
 For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
 is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 Different [Ingress controller](/docs/concepts/services-networking/ingress-controllers) support different annotations. Review the documentation for
 your choice of Ingress controller to learn which annotations are supported.

The Ingress [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP traffic.
-->

与所有其他 Kubernetes 资源一样，Ingress 需要使用 `apiVersion`, `kind`, 和 `metadata`字段。
有关使用配置文件的一般信息，请参阅[部署应用程序](/docs/tasks/run-application/run-stateless-application-deployment/)，[配置容器](/docs/tasks/configure-pod-container/configure-pod-configmap/)，[管理资源](/docs/concepts/cluster-administration/manage-deployment/)。
Ingress 经常根据 Ingress 控制器使用注释来配置一些选项，例如 [rewrite-target注解](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)
不同的[Ingress控制器](/docs/concepts/services-networking/ingress-controllers)支持不同的注释。
查看文档以供您选择 Ingress 控制器，以了解支持哪些注释。

Ingress [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) 具有配置负载平衡器或代理服务器所需的所有信息。
最重要的是，它包含与所有传入请求匹配的规则列表。 Ingress 资源仅支持用于定向HTTP流量的规则。

<!--
### Ingress rules

Each HTTP rule contains the following information:

* An optional host. In this example, no host is specified, so the rule applies to all inbound
  HTTP traffic through the IP address specified. If a host is provided (for example,
  foo.bar.com), the rules apply to that host.
* A list of paths (for example, `/testpath`), each of which has an associated backend defined with a `serviceName`
  and `servicePort`. Both the host and path must match the content of an incoming request before the
  load balancer directs traffic to the referenced Service.
* A backend is a combination of Service and port names as described in the
  [Service doc](/docs/concepts/services-networking/service/). HTTP (and HTTPS) requests to the
  Ingress that matches the host and path of the rule are sent to the listed backend.

A default backend is often configured in an Ingress controller to service any requests that do not
match a path in the spec.
-->

### Ingress 规则

每个HTTP规则都包含以下信息：
* host 选项。在此示例中，未指定主机，因此该规则适用于通过指定 IP 地址的所有入站 HTTP 通信。 如果提供了 host 地址(例如foo.bar.com)，则规则适用于该主机。
* 路径列表（例如，`/testpath` ），每个路径都有一个由 `serviceName` 和 `servicePort` 定义的关联后端。在负载均衡器将流量定向到引用的服务之前，主机和路径都必须匹配传入请求的内容。
* 后端是 [服务文档](/docs/concepts/services-networking/service/) 中所述的服务和端口名称的组合。与规则的主机和路径匹配的对 Ingress 的 HTTP 和 HTTPS 请求将发送到列出的后端。

<!--
### Default Backend

An Ingress with no rules sends all traffic to a single default backend. The default
backend is typically a configuration option of the [Ingress controller](/docs/concepts/services-networking/ingress-controllers) and is not specified in your Ingress resources.

If none of the hosts or paths match the HTTP request in the Ingress objects, the traffic is
routed to your default backend.
-->

### 默认后端

没有设定规则的 Ingress 将所有流量发送到单个默认后端。
默认后端通常是 [Ingress控制器](/docs/concepts/services-networking/ingress-controllers) 的配置选项，并且未在Ingress资源中指定。

如果没有主机或路径与 Ingress 对象中的 HTTP 请求匹配，则流量将路由到您的默认后端。

<!--
## Types of Ingress

### Single Service Ingress

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.
-->

## Ingress 的类型

### 单服务 Ingress

现有的 Kubernetes 概念允许您暴露单个 Service (查看 [替代方案](#alternatives))，
同样您也可以使用 Ingress 来实现，具体方法是指定一个没有规则的 *默认后端（default backend）*。


{{< codenew file="service/networking/ingress.yaml" >}}

<!--
If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you just added:
-->

如果使用 `kubectl apply -f` 创建它，则应该能够查看刚刚添加的Ingress的状态：


```shell
kubectl get ingress test-ingress
```

```
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

<!--
Where `107.178.254.228` is the IP allocated by the Ingress controller to satisfy
this Ingress.
-->

其中 `107.178.254.228` 是 Ingress 控制器为该 Ingress 分配的 IP 该。

{{< note >}}

<!--
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
-->
入口控制器和负载平衡器可能需要一两分钟才能分配IP地址。 在此之前，您通常会看到地址字段的值被设定为 `<pending>`。
{{< /note >}}

<!--
### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:
-->

### 简单分列

分列配置根据请求的 HTTP URI 将流量从单个IP地址路由到多个服务。
通过Ingress，您可以将负载均衡器的数量保持在最低水平。 例如，如下设置：

```none
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

<!--
would require an Ingress such as:
-->

可能需要一个 Ingress 就像：

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

<!--
When you create the Ingress with `kubectl apply -f`:
-->

当您使用 `kubectl apply -f` 创建 Ingress 时：

```shell
kubectl describe ingress test
```

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

<!--
The Ingress controller provisions an implementation-specific load balancer
that satisfies the Ingress, as long as the Services (`service1`, `service2`) exist.
When it has done so, you can see the address of the load balancer at the
Address field.
-->

Ingress 控制器提供实现特定的负载均衡器来满足 Ingress，只要 Service (`service1`, `service2`) 存在。
当它这样做了，你会在地址栏看到负载平衡器的地址。

{{< note >}}

<!--
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
-->

取决于你使用的 [Ingress 控制器](/docs/concepts/services-networking/ingress-controllers),
您可能需要创建一个默认的 http-backend [Service](/docs/concepts/services-networking/service/).。
{{< /note >}}


<!--
### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.
-->

### 基于名称的虚拟托管

基于名称的虚拟主机支持将 HTTP 流量路由到同一 IP 地址上的多个主机名。

```none
foo.bar.com --|                 |-> foo.bar.com service1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com service2:80
```


<!--
The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->

下面的 Ingress 让后台的负载均衡器基于 [Host header](https://tools.ietf.org/html/rfc7230#section-5.4) 路由请求。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

<!--
If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.

For example, the following Ingress resource will route traffic
requested for `first.bar.com` to `service1`, `second.foo.com` to `service2`, and any traffic
to the IP address without a hostname defined in request (that is, without a request header being
presented) to `service3`.
-->

如果您在规则中未定义任何主机的情况下创建 Ingress 资源，则可以匹配到 Ingress 控制器 IP 地址的任何网络流量，而无需基于名称的虚拟主机。

例如，以下Ingress资源会将 `first.bar.com` 请求的流量路由到 `service1`，将 `second.foo.com` 请求的流量路由到 `service2`，
而所有到IP地址但未在请求中定义主机名的流量 (也就是说，不向 `service3` 提供请求报文头)。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

<!--
### TLS

You can secure an Ingress by specifying a {{< glossary_tooltip term_id="secret" >}}
that contains a TLS private key and certificate. Currently the Ingress only
supports a single TLS port, 443, and assumes TLS termination. If the TLS
configuration section in an Ingress specifies different hosts, they are
multiplexed on the same port according to the hostname specified through the
SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret
must contain keys named `tls.crt` and `tls.key` that contain the certificate
and private key to use for TLS. For example:
-->

### TLS

您可以通过指定包含TLS私钥和证书的 {{< glossary_tooltip term_id="secret" >}} 来加密 Ingress。
目前，Ingress 只支持单个 TLS 端口，443，并假定 TLS 终止。
如果 Ingress 中的 TLS 配置部分指定了不同的主机，那么它们将根据通过 SNI TLS 扩展指定的主机名（如果 Ingress 控制器支持 SNI）在同一端口上进行复用。
TLS Secret 必须包含名为 `tls.crt` 和 `tls.key` 的密钥，这些密钥包含用于 TLS 的证书和私钥，例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

<!--
Referencing this secret in an Ingress tells the Ingress controller to
secure the channel from the client to the load balancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a CN
for `sslexample.foo.com`.
-->

在 Ingress 中引用此秘钥会告诉 Ingress 控制器使用 TLS 保护从客户端到负载均衡器的通道。
您需要确保创建包含 `sslexample.foo.com` 的 TLS 秘钥的 CN 的证书。

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```
{{< note >}}

<!--
There is a gap between TLS features supported by various Ingress
controllers. Please refer to documentation on
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific Ingress controller to understand how TLS works in your environment.
-->

各种 Ingress 控制器所支持的 TLS 功能之间存在间隙。请参阅有关文件
[nginx](https://git.k8s.io/ingress-nginx/README.md#https)，
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)，
或任何其他平台特定的 Ingress 控制器，以了解 TLS 如何在您的环境中工作。
{{< /note >}}

<!--
### Loadbalancing

An Ingress controller is bootstrapped with some load balancing policy settings
that it applies to all Ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
Ingress. You can instead get these features through the load balancer used for
a Service.
-->

### 负载均衡

Ingress 控制器使用一些适用于所有 Ingress 的负载均衡策略设置进行自举，例如负载平衡算法、后端权重方案等。
更高级的负载平衡概念（例如，持久会话、动态权重）尚未通过 Ingress 公开。
您可以通过用于服务的负载平衡器来获取这些功能。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->

值得注意的是，即使健康检查不是通过 Ingress 直接暴露的，但是在 Kubernetes 中存在并行概念，比如 [就绪检查](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)，它允许您实现相同的最终结果。
请检查控制器说明文档，以了解他们是怎样实现健康检查的 (
[nginx](https://git.k8s.io/ingress-nginx/README.md)，
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))。


<!--
## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:
-->

## 更新 Ingress

假设您想向现有的 Ingress 中添加新主机，可以通过编辑资源来更新它：

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
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
This pops up an editor with the existing configuration in YAML format.
Modify it to include the new Host:
-->

弹出一个编辑器用于编辑现有的 yaml，修改它来增加新的主机：

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
        path: /foo
..
```

<!--
After you save your changes, kubectl updates the resource in the API server, which tells the
Ingress controller to reconfigure the load balancer.

Verify this:
-->

保存更改后，kubectl 将更新 API 服务器中的资源，该资源将告诉 Ingress 控制器重新配置负载平衡器。

验证一下：

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```


<!--
You can achieve the same outcome by invoking `kubectl replace -f` on a modified Ingress YAML file.
-->

您可以通过 `kubectl replace -f` 命令调用修改后的 Ingress YAML 文件来获得同样的结果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details. You can also refer to the [federation documentation](/docs/concepts/cluster-administration/federation/)
for details on deploying Ingress in a federated cluster.
-->

## 跨可用区失败

用于跨故障域传播流量的技术在云提供商之间是不同的。详情请查阅相关 Ingress 控制器的文档。
请查看相关[Ingress控制器](/docs/concepts/services-networking/ingress-controllers)的文档以了解详细信息。
您还可以参考[联合文档](/docs/concepts/cluster-administration/federation/)，以获取有关在联合群集中部署Ingress的详细信息。


<!--
## Future Work

Track [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)
for more details on the evolution of Ingress and related resources. You may also track the
[Ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the
evolution of various Ingress controllers.
-->

## 未来的工作

跟踪 [SIG网络](https://github.com/kubernetes/community/tree/master/sig-network) 详细了解Ingress和相关资源的发展。
您也可以跟踪 [Ingress信息库](https://github.com/kubernetes/ingress/tree/master) 了解 Ingress 控制器进化的更多信息。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:

* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
-->

## 替代方案

不直接使用 Ingress 资源，也有多种方法暴露 Service：

* 使用 [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* 使用 [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Learn about [ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube)
-->
* 了解 [ingress 控制器](/docs/concepts/services-networking/ingress-controllers/)
* [使用NGINX控制器在Minikube上设置Ingress](/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}

