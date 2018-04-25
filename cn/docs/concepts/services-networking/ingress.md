---
assignees:
- bprashanth
title: Ingress resource
redirect_from:
- "/docs/user-guide/ingress/"
- "/docs/user-guide/ingress.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- markthink
---

* TOC
{:toc}
<!--
__Terminology__

Throughout this doc you will see a few terms that are sometimes used interchangeably elsewhere, that might cause confusion. This section attempts to clarify them.

* Node: A single virtual or physical machine in a Kubernetes cluster.
* Cluster: A group of nodes firewalled from the internet, that are the primary compute resources managed by Kubernetes.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the [Kubernetes networking model](/docs/concepts/cluster-administration/networking/). Examples of a Cluster network include Overlays such as [flannel](https://github.com/coreos/flannel#flannel) or SDNs such as [OVS](/docs/admin/ovs-networking/).
* Service: A Kubernetes [Service](/docs/concepts/services-networking/service/) that identifies a set of pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.

-->

__术语__

在本篇文章中您将会看到一些在其他地方被交叉使用的术语，为了防止产生歧义，我们首先来澄清下。

- 节点：Kubernetes 集群中的一台物理机或者虚拟机。
- 集群：位于 Internet 防火墙后的节点，这是 kubernetes 管理的主要计算资源。
- 边界路由器：为集群强制执行防火墙策略的路由器。 这可能是由云提供商或物理硬件管理的网关。
- 集群网络：一组逻辑或物理链接，可根据 Kubernetes [网络模型](/docs/admin/networking/) 实现群集内的通信。 集群网络的实现包括 Overlay 模型的 [flannel](https://github.com/coreos/flannel#flannel) 和基于 SDN 的 [OVS](/docs/admin/ovs-networking/)。
- 服务：使用标签选择器标识一组 pod 成为的 Kubernetes [服务](/docs/user-guide/services/)。 除非另有说明，否则服务假定在集群网络内仅可通过虚拟 IP 访问。

<!--
## What is Ingress?

Typically, services and pods have IPs only routable by the cluster network. All traffic that ends up at an edge router is either dropped or forwarded elsewhere. Conceptually, this might look like:

```
    internet
        |
  ------------
  [ Services ]
```

An Ingress is a collection of rules that allow inbound connections to reach the cluster services.

```
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

It can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc. Users request ingress by POSTing the Ingress resource to the API server. An [Ingress controller](#ingress-controllers) is responsible for fulfilling the Ingress, usually with a loadbalancer, though it may also configure your edge router or additional frontends to help handle the traffic in an HA manner.
-->

## 什么是Ingress？

通常情况下，service 和 pod 仅可在集群内部网络中通过 IP 地址访问。所有到达边界路由器的流量或被丢弃或被转发到其他地方。从概念上讲，可能像下面这样：

```
    internet
        |
  ------------
  [ Services ]
```

Ingress 是授权入站连接到达集群服务的规则集合。

```
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

您可以给Ingress配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等。用户通过 POST Ingress 资源到API server的方式来请求ingress。 [Ingress controller](/docs/concepts/services-networking/ingress/#ingress-controllers) 负责实现 Ingress，通常使用负载平衡器，它还可以配置边界路由和其他前端，这有助于以 HA 方式处理流量。
<!--


## Prerequisites

Before you start using the Ingress resource, there are a few things you should understand. The Ingress is a beta resource, not available in any Kubernetes release prior to 1.1. You need an Ingress controller to satisfy an Ingress, simply creating the resource will have no effect.

GCE/GKE deploys an ingress controller on the master. You can deploy any number of custom ingress controllers in a pod. You must annotate each ingress with the appropriate class, as indicated [here](https://git.k8s.io/ingress/controllers/nginx#running-multiple-ingress-controllers) and [here](https://git.k8s.io/ingress/controllers/gce/BETA_LIMITATIONS.md#disabling-glbc).

Make sure you review the [beta limitations](https://git.k8s.io/ingress/controllers/gce/BETA_LIMITATIONS.md) of this controller. In environments other than GCE/GKE, you need to [deploy a controller](https://git.k8s.io/ingress/controllers) as a pod.
-->

## 先决条件

在使用 Ingress resource 之前，有必要先了解下面几件事情。Ingress 是 beta 版本的 resource，在 kubernetes1.1之前还没有。您需要一个`Ingress Controller`来实现`Ingress`，单纯的创建一个`Ingress`没有任何意义。

GCE/GKE 会在 master 节点上部署一个 ingress controller。您可以在一个 pod 中部署任意个自定义的 ingress controller。您必须正确地给每个 ingress 作出注释，比如 [运行多个ingress controller](https://github.com/kubernetes/ingress/tree/master/controllers/nginx#running-multiple-ingress-controllers) 和 [关闭glbc](https://github.com/kubernetes/ingress/blob/master/controllers/gce/BETA_LIMITATIONS.md#disabling-glbc).

确定您已经阅读了 Ingress controller 的 [beta版本限制](https://github.com/kubernetes/ingress/blob/master/controllers/gce/BETA_LIMITATIONS.md)。在非 GCE/GKE 的环境中，您需要在 pod 中 [部署一个controller](https://github.com/kubernetes/ingress/tree/master/controllers)。
<!--


## The Ingress Resource

A minimal Ingress might look like:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

*POSTing this to the API server will have no effect if you have not configured an [Ingress controller](#ingress-controllers).*

__Lines 1-6__: As with all other Kubernetes config, an Ingress needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/) and [ingress configuration rewrite](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/configuration.md#rewrite).

__Lines 7-9__: Ingress [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) has all the information needed to configure a loadbalancer or proxy server. Most importantly, it contains a list of rules matched against all incoming requests. Currently the Ingress resource only supports http rules.

__Lines 10-11__: Each http rule contains the following information: A host (e.g.: foo.bar.com, defaults to * in this example), a list of paths (e.g.: /testpath) each of which has an associated backend (test:80). Both the host and path must match the content of an incoming request before the loadbalancer directs traffic to the backend.

__Lines 12-14__: A backend is a service:port combination as described in the [services doc](/docs/concepts/services-networking/service/). Ingress traffic is typically sent directly to the endpoints matching a backend.

__Global Parameters__: For the sake of simplicity the example Ingress has no global parameters, see the [api-reference](https://releases.k8s.io/{{page.githubbranch}}/pkg/apis/extensions/v1beta1/types.go) for a full definition of the resource. One can specify a global default backend in the absence of which requests that don't match a path in the spec are sent to the default backend of the Ingress controller.
-->

## Ingress Resource

最简化的 Ingress 配置：

```yaml
1: apiVersion: extensions/v1beta1
2: kind: Ingress
3: metadata:
4:   name: test-ingress
5: spec:
6:   rules:
7:   - http:
8:       paths:
9:       - path: /testpath
10:        backend:
11:           serviceName: test
12:           servicePort: 80
```

*如果您没有配置 Ingress controller 就将其 POST 到 API server 不会有任何用处*

**配置说明**

**1-4行**：跟 Kubernetes 的其他配置一样，ingress 的配置也需要`apiVersion`，`kind`和`metadata`字段。配置文件的详细说明请查看[部署应用](/docs/user-guide/deploying-applications), [配置容器](/docs/user-guide/configuring-containers)和 [使用resources](/docs/user-guide/working-with-resources).

**5-7行**: Ingress [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#spec-and-status) 中包含配置一个 loadbalancer 或 proxy server 的所有信息。最重要的是，它包含了一个匹配所有入站请求的规则列表。目前 ingress 只支持http规则。

**8-9行**：每条 http 规则包含以下信息：一个`host`配置项（比如 for.bar.com，在这个例子中默认是*），`path`列表（比如：/testpath），每个 path 都关联一个`backend`(比如test:80)。在 loadbalancer 将流量转发到 backend 之前，所有的入站请求都要先匹配 host 和 path。

**10-12行**：正如 [services doc ](/docs/user-guide/services)中描述的那样，backend 是一个`service:port`的组合。Ingress 的流量被转发到它所匹配的 backend。

**全局参数**：为了简单起见，Ingress 示例中没有全局参数，请参阅资源完整定义的 [api参考](https://releases.k8s.io/master/pkg/apis/extensions/v1beta1/types.go)。 在所有请求都不能跟 spec 中的 path 匹配的情况下，请求被发送到 Ingress controller 的默认后端，可以指定全局缺省 backend。
<!--


## Ingress controllers

In order for the Ingress resource to work, the cluster must have an Ingress controller running. This is unlike other types of controllers, which typically run as part of the `kube-controller-manager` binary, and which are typically started automatically as part of cluster creation. You need to choose the ingress controller implementation that is the best fit for your cluster, or implement one.  Examples and instructions can be found [here](https://git.k8s.io/ingress/controllers).
-->

## Ingress controller

为了使 Ingress 正常工作，集群中必须运行 Ingress controller。 这与其他类型的控制器不同，其他类型的控制器通常作为`kube-controller-manager`二进制文件的一部分运行，在集群启动时自动启动。 您需要选择最适合自己集群的 Ingress controller 或者自己实现一个。 示例和说明可以在 [这里](https://github.com/kubernetes/ingress/tree/master/controllers) 找到。
<!--


## Before you begin

The following document describes a set of cross platform features exposed through the Ingress resource. Ideally, all Ingress controllers should fulfill this specification, but we're not there yet. The docs for the GCE and nginx controllers are [here](https://git.k8s.io/ingress/controllers/gce/README.md) and [here](https://git.k8s.io/ingress/controllers/nginx/README.md) respectively. **Make sure you review controller specific docs so you understand the caveats of each one**.
-->

## 在您开始前

以下文档描述了 Ingress 资源中公开的一组跨平台功能。 理想情况下，所有的 Ingress controller 都应该符合这个规范，但是我们还没有实现。 GCE 和 nginx 控制器的文档分别在 [这里](https://github.com/kubernetes/ingress/blob/master/controllers/gce/README.md) 和 [这里](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/README.md)。**确保您查看控制器特定的文档，以便您了解每个文档的注意事项。**
<!--


## Types of Ingress

### Single Service Ingress

There are existing Kubernetes concepts that allow you to expose a single service (see [alternatives](#alternatives)), however you can do so through an Ingress as well, by specifying a *default backend* with no rules.

{% include code.html language="yaml" file="ingress.yaml" ghlink="/docs/concepts/services-networking/ingress.yaml" %}

If you create it using `kubectl create -f` you should see:

```shell
$ kubectl get ing
NAME                RULE          BACKEND        ADDRESS
test-ingress        -             testsvc:80     107.178.254.228
```

Where `107.178.254.228` is the IP allocated by the Ingress controller to satisfy this Ingress. The `RULE` column shows that all traffic send to the IP is directed to the Kubernetes Service listed under `BACKEND`.
-->

## Ingress类型

### 单Service Ingress

Kubernetes 中已经存在一些概念可以暴露单个 service（查看 [替代方案](/docs/concepts/services-networking/ingress/#alternatives)），但是您仍然可以通过 Ingress来实现，通过指定一个没有 rule 的默认 backend 的方式。

ingress.yaml 定义文件：

```Yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
spec:
  backend:
    serviceName: testsvc
    servicePort: 80
```

使用`kubectl create -f`命令创建，然后查看 ingress：

```bash
$ kubectl get ing
NAME                RULE          BACKEND        ADDRESS
test-ingress        -             testsvc:80     107.178.254.228
```

 `107.178.254.228`就是 Ingress controller 为了实现 Ingress 而分配的 IP 地址。`RULE`列表示所有发送给该 IP 的流量都被转发到了`BACKEND`所列的 Kubernetes service 上。

<!--

### Simple fanout

As described previously, pods within kubernetes have IPs only visible on the cluster network, so we need something at the edge accepting ingress traffic and proxying it to the right endpoints. This component is usually a highly available loadbalancer. An Ingress allows you to keep the number of loadbalancers down to a minimum, for example, a setup like:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    s1:80
                                 / bar    s2:80
```

would require an Ingress such as:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
  annotations:
    ingress.kubernetes.io/rewrite-target: /
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

When you create the Ingress with `kubectl create -f`:

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -
          foo.bar.com
          /foo          s1:80
          /bar          s2:80
```
The Ingress controller will provision an implementation specific loadbalancer that satisfies the Ingress, as long as the services (s1, s2) exist. When it has done so, you will see the address of the loadbalancer under the last column of the Ingress.
-->

### 简单展开

如前面描述的那样，kubernete pod 中的 IP 只在集群网络内部可见，我们需要在边界设置一个东西，让它能够接收 ingress 的流量并将它们转发到正确的端点上。这个东西一般是高可用的 loadbalancer。使用 Ingress 能够允许您将 loadbalancer 的个数降低到最少，例如，假如您想要创建这样的一个设置：

```
foo.bar.com -> 178.91.123.132 -> / foo    s1:80
                                 / bar    s2:80
```

您需要一个这样的 ingress：

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
      - path: /foo
        backend:
          serviceName: s1
          servicePort: 80
      - path: /bar
        backend:
          serviceName: s2
          servicePort: 80
```

使用`kubectl create -f`创建完 ingress 后：

```bash
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -
          foo.bar.com
          /foo          s1:80
          /bar          s2:80
```

只要服务（s1，s2）存在，Ingress controller 就会将提供一个满足该 Ingress 的特定 loadbalancer 实现。 这一步完成后，您将在 Ingress 的最后一列看到 loadbalancer 的地址。
<!--


### Name based virtual hosting

Name-based virtual hosts use multiple host names for the same IP address.

```
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

The following Ingress tells the backing loadbalancer to route requests based on the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

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

__Default Backends__: An Ingress with no rules, like the one shown in the previous section, sends all traffic to a single default backend. You can use the same technique to tell a loadbalancer where to find your website's 404 page, by specifying a set of rules *and* a default backend. Traffic is routed to your default backend if none of the Hosts in your Ingress match the Host in the request header, and/or none of the paths match the url of the request.
-->

### 基于名称的虚拟主机

Name-based 的虚拟主机在同一个 IP 地址下拥有多个主机名。

```
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

下面这个ingress说明基于[Host header](https://tools.ietf.org/html/rfc7230#section-5.4)的后端 loadbalancer 的路由请求：

```Yaml
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

**默认 backend**：一个没有 rule 的 ingress，如前面章节中所示，所有流量都将发送到一个默认 backend。您可以用该技巧通知 loadbalancer 如何找到您网站的404页面，通过制定一些列 rule 和一个默认 backend 的方式。如果请求 header 中的 host 不能跟 ingress 中的 host 匹配，并且/或请求的 URL 不能与任何一个  path 匹配，则流量将路由到您的默认 backend。
<!--


### TLS

You can secure an Ingress by specifying a [secret](/docs/user-guide/secrets) that contains a TLS private key and certificate. Currently the Ingress only supports a single TLS port, 443, and assumes TLS termination. If the TLS configuration section in an Ingress specifies different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret must contain keys named `tls.crt` and `tls.key` that contain the certificate and private key to use for TLS, e.g.:

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

Referencing this secret in an Ingress will tell the Ingress controller to secure the channel from the client to the loadbalancer using TLS:

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

Note that there is a gap between TLS features supported by various Ingress controllers. Please refer to documentation on [nginx](https://git.k8s.io/ingress/controllers/nginx/README.md#https), [GCE](https://git.k8s.io/ingress/controllers/gce/README.md#tls), or any other platform specific Ingress controller to understand how TLS works in your environment.
-->

### TLS

您可以通过指定包含 TLS 私钥和证书的 [secret](/docs/user-guide/secrets) 来加密Ingress。 目前，Ingress 仅支持单个 TLS 端口443，并假定 TLS termination。 如果 Ingress 中的 TLS 配置部分指定了不同的主机，则它们将根据通过 SNI TLS 扩展指定的主机名（假如 Ingress controller 支持 SNI ）在多个相同端口上进行复用。 TLS secret 中必须包含名为`tls.crt`和`tls.key`的密钥，这里面包含了用于 TLS 的证书和私钥，例如：

```Yaml
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

在 Ingress 中引用这个 secret 将通知 Ingress controller 使用 TLS 加密从将客户端到 loadbalancer 的 channel：

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

请注意，各种 Ingress controller 支持的 TLS 功能之间存在差距。 请参阅有关 [nginx](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/README.md#https)，[GCE ](https://github.com/kubernetes/ingress/blob/master/controllers/gce/README.md#tls)或任何其他平台特定 Ingress controller 的文档，以了解 TLS 在您的环境中的工作原理。

Ingress controller 启动时附带一些适用于所有 Ingress 的负载平衡策略设置，例如负载均衡算法，后端权重方案等。更高级的负载平衡概念（例如持久会话，动态权重）尚未在 Ingress 中公开。 您仍然可以通过 [service loadbalancer ](https://github.com/kubernetes/contrib/tree/master/service-loadbalancer)获取这些功能。 随着时间的推移，我们计划将适用于跨平台的负载平衡模式加入到Ingress资源中。

还值得注意的是，尽管健康检查不直接通过 Ingress 公开，但 Kubernetes 中已经存在该概念，例如 [准备探查](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)，可以使您达成相同的最终结果。 请查看特定控制器的文档，以了解他们如何处理健康检查（[nginx](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/README.md)，[GCE](https://github.com/kubernetes/ingress/blob/master/controllers/gce/README.md#health-checks)）。
<!--
### Loadbalancing

An Ingress controller is bootstrapped with some loadbalancing policy settings that it applies to all Ingress, such as the loadbalancing algorithm, backend weight scheme etc. More advanced loadbalancing concepts (e.g.: persistent sessions, dynamic weights) are not yet exposed through the Ingress. You can still get these features through the [service loadbalancer](https://git.k8s.io/contrib/service-loadbalancer). With time, we plan to distill loadbalancing patterns that are applicable cross platform into the Ingress resource.

It's also worth noting that even though health checks are not exposed directly through the Ingress, there exist parallel concepts in Kubernetes such as [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) which allow you to achieve the same end result. Please review the controller specific docs to see how they handle health checks ([nginx](https://git.k8s.io/ingress/controllers/nginx/README.md), [GCE](https://git.k8s.io/ingress/controllers/gce/README.md#health-checks)).
-->


### 负载均衡

Ingress controller 中已经在所有的 ingress 中预加载了负载均衡配置，例如负载均衡算法、backend weight schema等。更多高级的负载均衡策略（如持久化 session、动态权重等）尚未在 ingress 中支持。您依然可以通过 [service loadbalancer](https://git.k8s.io/contrib/service-loadbalancer) 来获取这些功能。假以时日，我们计划提取适用于跨平台的负载均衡模式到 ingress resource 中。

直接在 ingress 中做健康状态检查是没有意义的，kubernetes 中已经有了等同的概念，如 [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) ，使用它就可以到达您想要的结果。请查看相应的 controller 的文档中关于健康检查的部分（ [nginx](https://git.k8s.io/ingress/controllers/nginx/README.md), [GCE](https://git.k8s.io/ingress/controllers/gce/README.md#health-checks)）。
<!--


## Updating an Ingress

Say you'd like to add a new Host to an existing Ingress, you can update it by editing the resource:

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
$ kubectl edit ing test
```

This should pop up an editor with the existing yaml, modify it to include the new Host.

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

saving it will update the resource in the API server, which should tell the Ingress controller to reconfigure the loadbalancer.

```shell
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
          bar.baz.com
          /foo          s2:80
```

You can achieve the same by invoking `kubectl replace -f` on a modified Ingress yaml file.
-->

## 更新 Ingress

假如您想要向已有的 ingress 中增加一个新的 Host，您可以编辑和更新该 ingress：

```Bash
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
$ kubectl edit ing test
```

这会弹出一个包含已有的 yaml 文件的编辑器，修改它，增加新的 Host 配置。

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

保存它会更新 API server 中的资源，这会触发 ingress controller 重新配置 loadbalancer。

```bash
$ kubectl get ing
NAME      RULE          BACKEND   ADDRESS
test      -                       178.91.123.132
          foo.bar.com
          /foo          s1:80
          bar.baz.com
          /foo          s2:80
```

在一个修改过的 ingress yaml 文件上调用`kubectl replace -f`命令一样可以达到同样的效果。
<!--


## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers. Please check the documentation of the relevant Ingress controller for details. Please refer to the federation [doc](/docs/concepts/cluster-administration/federation/) for details on deploying Ingress in a federated cluster.

## Future Work

* Various modes of HTTPS/TLS support (e.g.: SNI, re-encryption)
* Requesting an IP or Hostname via claims
* Combining L4 and L7 Ingress
* More Ingress controllers

Please track the [L7 and Ingress proposal](https://github.com/kubernetes/kubernetes/pull/12827) for more details on the evolution of the resource, and the [Ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the evolution of various Ingress controllers.

## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:

* Use [Service.Type=LoadBalancer](/docs/user-guide/services/#type-loadbalancer)
* Use [Service.Type=NodePort](/docs/user-guide/services/#type-nodeport)
* Use a [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)
* Deploy the [Service loadbalancer](https://git.k8s.io/contrib/service-loadbalancer). This allows you to share a single IP among multiple Services and achieve more advanced loadbalancing through Service Annotations.

-->

## 跨可用域故障

在不通云供应商之间，跨故障域的流量传播技术有所不同。 有关详细信息，请查看相关 Ingress controller 的文档。 有关在 federation 集群中部署 Ingress 的详细信息，请参阅[federation文档]()。

## 未来计划

- 多样化的 HTTPS/TLS 模型支持（如SNI，re-encryption）
- 通过声明来请求 IP 或者主机名
- 结合 L4 和 L7 Ingress
- 更多的 Ingress controller

请跟踪 [L7和Ingress的proposal](https://github.com/kubernetes/kubernetes/pull/12827)，了解有关资源演进的更多细节，以及 [Ingress repository](https://github.com/kubernetes/ingress/tree/master)，了解有关各种  Ingress controller 演进的更多详细信息。

## 替代选择

您可以通过很多种方式暴露 service 而不必直接使用 ingress：

- 使用 [Service.Type=LoadBalancer](/docs/user-guide/services/#type-loadbalancer)
- 使用 [Service.Type=NodePort](/docs/user-guide/services/#type-nodeport)
- 使用 [Port Proxy](https://github.com/kubernetes/contrib/tree/master/for-demos/proxy-to-service)
- 部署一个 [Service loadbalancer](https://github.com/kubernetes/contrib/tree/master/service-loadbalancer) 这允许您在多个 service 之间共享单个 IP，并通过 Service Annotations 实现更高级的负载平衡。