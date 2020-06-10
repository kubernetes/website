---
reviewers:
- bowei
- zihongz
title: 自定义 DNS 服务
content_type: task
---
<!-- 
---
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_type: task
--- 
-->

<!-- overview -->
<!-- 
This page explains how to configure your DNS Pod and customize the
DNS resolution process. In Kubernetes version 1.11 and later, CoreDNS is at GA
and is installed by default with kubeadm. See [CoreDNS ConfigMap options](#coredns-configmap-options) 
and [Using CoreDNS for Service Discovery](/docs/tasks/administer-cluster/coredns/). 
-->
本页说明如何配置 DNS Pod 和自定义 DNS 解析过程。 在 Kubernetes 1.11 和更高版本中，CoreDNS 位于 GA
并且默认情况下与 kubeadm 一起安装。 请参见[CoreDNS 的 ConfigMap 选项](#coredns-configmap-options) 
and [使用 CoreDNS 进行服务发现](/docs/tasks/administer-cluster/coredns/)。


## {{% heading "prerequisites" %}}

<!-- 
* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Kubernetes version 1.6 or later. To work with CoreDNS, version 1.9 or later.
* The appropriate add-on: kube-dns or CoreDNS. To install with kubeadm,
see [the kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-phase-addon). 
-->
* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Kubernetes 版本 1.6 或更新。如果与 CoreDNS 匹配，版本 1.9 或更新。
* 合适的 add-on 插件: kube-dns 或 CoreDNS. 使用 kubeadm 安装，请参见 [kubeadm 帮助文档](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-phase-addon). 


<!-- steps -->

<!-- 
## Introduction 
-->
## 介绍

<!-- 
DNS is a built-in Kubernetes service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/README.md). 
-->
DNS 是使用插件管理器[集群 add-on](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/README.md)自动启动的内置的 Kubernetes 服务。

<!-- 
As of Kubernetes v1.12, CoreDNS is the recommended DNS Server, replacing kube-dns. However, kube-dns may still be installed by
default with certain Kubernetes installer tools. Refer to the documentation provided by your installer to know which DNS server is installed by default. 
-->
从 Kubernetes v1.12 开始，CoreDNS 是推荐的 DNS 服务器，取代了kube-dns。 但是，默认情况下，某些 Kubernetes 安装程序工具仍可能安装 kube-dns。 请参阅安装程序提供的文档，以了解默认情况下安装了哪个 DNS 服务器。

<!-- 
The CoreDNS Deployment is exposed as a Kubernetes Service with a static IP.
Both the CoreDNS and kube-dns Service are named `kube-dns` in the `metadata.name` field. This is done so that there is greater interoperability with workloads that relied on the legacy `kube-dns` Service name to resolve addresses internal to the cluster. It abstracts away the implementation detail of which DNS provider is running behind that common endpoint. 
The kubelet passes DNS to each container with the `--cluster-dns=<dns-service-ip>` flag. 
-->
CoreDNS 的部署，作为一个 Kubernetes 服务，通过静态 IP 的方式暴露。
CoreDNS 和 kube-dns 服务在 `metadata.name` 字段中均被命名为 `kube-dns`。 这样做是为了与依靠传统 `kube-dns` 服务名称来解析集群内部地址的工作负载具有更大的互操作性。它抽象出哪个 DNS 提供程序在该公共端点后面运行的实现细节。
kubelet 使用 `--cluster-dns = <dns-service-ip>` 标志将 DNS 传递到每个容器。

<!-- 
DNS names also need domains. You configure the local domain in the kubelet
with the flag `--cluster-domain=<default-local-domain>`. 
-->
DNS 名称也需要域。 您可在 kubelet 中使用 `--cluster-domain = <default-local-domain>` 标志配置本地域。

<!-- 
The DNS server supports forward lookups (A records), port lookups (SRV records), reverse IP address lookups (PTR records),
and more. For more information see [DNS for Services and Pods] (/docs/concepts/services-networking/dns-pod-service/). 
-->
DNS 服务器支持正向查找（A 记录），端口发现（SRV 记录），反向 IP 地址发现（PTR 记录）等。 更多信息，请参见[Pod 和 服务的 DNS] (/docs/concepts/services-networking/dns-pod-service/)。

<!-- 
If a Pod's `dnsPolicy` is set to "`default`", it inherits the name resolution
configuration from the node that the Pod runs on. The Pod's DNS resolution
should behave the same as the node.
But see [Known issues](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues). 
-->
如果 Pod 的 dnsPolicy 设置为 "`default`"，则它将从 Pod 运行所在节点上的配置中继承名称解析配置。 Pod 的 DNS 解析应该与节点相同。
但请参阅[已知问题](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)。

<!-- 
If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Set this flag to "" to prevent Pods from
inheriting DNS. Set it to a valid file path to specify a file other than
`/etc/resolv.conf` for DNS inheritance. 
-->
如果您不想这样做，或者想要为 Pod 使用其他 DNS 配置，则可以
使用 kubelet 的 `--resolv-conf` 标志。 将此标志设置为 "" 以避免 Pod
继承 DNS。 将其设置为有效的文件路径以指定除以下以外的文件
`/etc/resolv.conf`，用于 DNS 继承。

## CoreDNS

<!-- 
CoreDNS is a general-purpose authoritative DNS server that can serve as cluster DNS, complying with the [dns specifications]
(https://github.com/kubernetes/dns/blob/master/docs/specification.md). 
-->
CoreDNS是通用的权威DNS服务器，可以用作集群DNS，符合[dns 规范]
(https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!-- 
### CoreDNS ConfigMap options 
-->
### CoreDNS ConfigMap 选项

<!-- 
CoreDNS is a DNS server that is modular and pluggable, and each plugin adds new functionality to CoreDNS. 
This can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/), which is the CoreDNS
configuration file. A cluster administrator can modify the ConfigMap for the CoreDNS Corefile to change how service discovery works.  
-->
CoreDNS 是模块化且可插拔的 DNS 服务器，每个插件都为 CoreDNS 添加了新功能。
可以通过维护[Corefile](https://coredns.io/2017/07/23/corefile-explained/)，即CoreDNS
配置文件。 集群管理员可以修改 CoreDNS Corefile 的 ConfigMap，以更改服务发现的工作方式。

<!-- 
In Kubernetes, CoreDNS is installed with the following default Corefile configuration. 
-->
在 Kubernetes 中，已经使用以下默认 Corefile 配置安装了 CoreDNS。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           upstream
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy ./etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
``` 
<!-- 
The Corefile configuration includes the following [plugins](https://coredns.io/plugins/) of CoreDNS: 
-->
Corefile 配置包括以下 CoreDNS 的 [插件](https://coredns.io/plugins/)：

<!-- 
* [errors](https://coredns.io/plugins/errors/): Errors are logged to stdout.
* [health](https://coredns.io/plugins/health/): Health of CoreDNS is reported to http://localhost:8080/health.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS will reply to DNS queries based on IP of the services and pods of Kubernetes. You can find more details [here](https://coredns.io/plugins/kubernetes/).  
-->
* [错误](https://coredns.io/plugins/errors/)：错误记录到 stdout。
* [健康](https://coredns.io/plugins/health/)：CoreDNS 的健康报告给 http://localhost:8080/health。
* [kubernetes](https://coredns.io/plugins/kubernetes/)：CoreDNS 将基于 Kubernetes 的服务和 Pod 的 IP 答复 DNS 查询。 您可以在 [此处](https://coredns.io/plugins/kubernetes/).  

<!-- 
> The `pods insecure` option is provided for backward compatibility with kube-dns. You can use the `pods verified` option, which returns an A record only if there exists a pod in same namespace with matching IP. The `pods disabled` option can be used if you don't use pod records. 
-->
>提供 `pods insecure` 选项是为了与 kube-dns 向前兼容。 您可以使用 `pods verified` 选项，该选项仅在相同名称空间中存在具有匹配 IP 的 pod 时才返回 A 记录。 如果您不使用 Pod 记录，则可以使用 `pods disabled` 选项。
<!--
`Upstream` is used for resolving services that point to external hosts (External Services).
-->
'Upstream' 用来解析指向外部主机的服务（外部服务）。

<!-- 
* [prometheus](https://coredns.io/plugins/prometheus/): Metrics of CoreDNS are available at http://localhost:9153/metrics in [Prometheus](https://prometheus.io/) format.
* [proxy](https://coredns.io/plugins/proxy/): Any queries that are not within the cluster domain of Kubernetes will be forwarded to predefined resolvers (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): This enables a frontend cache.
* [loop](https://coredns.io/plugins/loop/): Detects simple forwarding loops and halts the CoreDNS process if a loop is found.
* [reload](https://coredns.io/plugins/reload): Allows automatic reload of a changed Corefile. After you edit the ConfigMap configuration, allow two minutes for your changes to take effect.
* [loadbalance](https://coredns.io/plugins/loadbalance): This is a round-robin DNS loadbalancer that randomizes the order of A, AAAA, and MX records in the answer. 
-->
* [prometheus](https://coredns.io/plugins/prometheus/)：CoreDNS的度量标准以[Prometheus](https://prometheus.io/)格式在 http://localhost:9153/metrics 上提供。
* [proxy](https://coredns.io/plugins/proxy/): 不在 Kubernetes 集群域内的任何查询都将转发到预定义的解析器 (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/)：这将启用前端缓存。
* [loop](https://coredns.io/plugins/loop/)：检测到简单的转发循环，如果发现死循环，则中止 CoreDNS 进程。
* [reload](https://coredns.io/plugins/reload)：允许自动重新加载已更改的 Corefile。 编辑 ConfigMap 配置后，请等待两分钟，以使更改生效。
* [loadbalance](https://coredns.io/plugins/loadbalance)：这是一个轮询 DNS 负载均衡器，它在应答中随机分配 A，AAAA 和 MX 记录的顺序。

<!-- 
You can modify the default CoreDNS behavior by modifying the ConfigMap. 
-->
您可以通过修改 ConfigMap 来修改默认的 CoreDNS 行为。

<!-- 
### Configuration of Stub-domain and upstream nameserver using CoreDNS 
-->
### 使用 CoreDN 配置存根域和上游域名服务器

<!-- 
CoreDNS has the ability to configure stubdomains and upstream nameservers using the [proxy plugin](https://coredns.io/plugins/proxy/). .  
-->
CoreDNS 能够使用 [proxy plugin](https://coredns.io/plugins/proxy/).  配置存根域和上游域名服务器。

<!-- 
#### Example
If a cluster operator has a [Consul](https://www.consul.io/) domain server located at 10.150.0.1, and all Consul names have the suffix .consul.local. To configure it in CoreDNS, the cluster administrator creates the following stanza in the CoreDNS ConfigMap. 
-->
#### 示例
如果集群操作员的 [Consul](https://www.consul.io/) 域服务器位于 10.150.0.1，并且所有 Consul 名称都带有后缀.consul.local。 要在 CoreDNS 中对其进行配置，集群管理员可以在 CoreDNS 的 ConfigMap 中创建加入以下字段。

```
consul.local:53 {
        errors
        cache 30
        proxy . 10.150.0.1
    }
```

<!-- 
To explicitly force all non-cluster DNS lookups to go through a specific nameserver at 172.16.0.1, point the `proxy` and `forward` to the nameserver instead of `/etc/resolv.conf` 
-->
要显式强制所有非集群 DNS 查找通过特定的域名服务器（位于172.16.0.1），请将 `proxy` 和 `forward` 指向域名服务器，而不是 `/etc/resolv.conf`。

```
proxy .  172.16.0.1
``` 

<!-- 
The final ConfigMap along with the default `Corefile` configuration looks like: 
-->
最终的 ConfigMap 以及默认的 `Corefile` 配置如下所示：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           upstream 172.16.0.1
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        proxy . 10.150.0.1
    }
```
<!-- 
In Kubernetes version 1.10 and later, kubeadm supports automatic translation of the CoreDNS ConfigMap from the kube-dns ConfigMap.
***Note: While kube-dns accepts an FQDN for stubdomain and nameserver (eg: ns.foo.com), CoreDNS does not support this feature. 
During translation, all FQDN nameservers will be omitted from the CoreDNS config.*** 
-->
在 Kubernetes 1.10 和更高版本中，kubeadm 支持将 kube-dns ConfigMap 自动转换为 CoreDNS ConfigMap。
***注意：尽管kube-dns接受 stubdomain 和 nameserver 的 FQDN（例如：ns.foo.com），但 CoreDNS 不支持此功能。
转换期间，CoreDNS 配置中将省略所有 FQDN 域名服务器。***

## Kube-dns

<!-- 
Kube-dns is now available as an optional DNS server since CoreDNS is now the default.
The running DNS Pod holds 3 containers:

- "`kubedns`": watches the Kubernetes master for changes
  in Services and Endpoints, and maintains in-memory lookup structures to serve
  DNS requests.
- "`dnsmasq`": adds DNS caching to improve performance.
- "`sidecar`": provides a single health check endpoint
  to perform healthchecks for `dnsmasq` and `kubedns`. 
-->
由于 CoreDNS 现在是默认设置，因此 Kube-dns 现在可以用作可选的 DNS 服务器。
正在运行的DNS Pod包含3个容器：

- "`kubedns`"：监测 Kubernetes 主节点的服务和 Endpoints 的更改，并维护内存中的查找结构以服务 
   DNS 请求。
- "`dnsmasq`"：添加 DNS 缓存以提高性能。
- "`sidecar`"：提供单个运行状况检查端点，对 dnsmasq 和 Kubedns 进行健康检查。

<!-- 
### Configure stub-domain and upstream DNS servers

Cluster administrators can specify custom stub domains and upstream nameservers
by providing a ConfigMap for kube-dns (`kube-system:kube-dns`).

For example, the following ConfigMap sets up a DNS configuration with a single stub domain and two
upstream nameservers: 
-->
### 配置存根域和上游 DNS 服务器

集群管理员可以指定自定义存根域和上游域名服务器通过为 kube-dns (`kube-system:kube-dns`) 提供 ConfigMap。

例如，以下 ConfigMap 使用单个存根域和两个上游域名服务器设置 DNS 配置：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  stubDomains: |
    {"acme.local": ["1.2.3.4"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
```

<!-- 
DNS requests with the “.acme.local” suffix
are forwarded to a DNS listening at 1.2.3.4. Google Public DNS
serves the upstream queries.

The table below describes how queries with certain domain names map to
their destination DNS servers:

| Domain name | Server answering the query |
| ----------- | -------------------------- |
| kubernetes.default.svc.cluster.local| kube-dns |
| foo.acme.local| custom DNS (1.2.3.4) |
| widget.com    | upstream DNS (one of 8.8.8.8, 8.8.4.4) |

See [ConfigMap options](#configmap-options) for
details about the configuration option format. 
-->
带 “.acme.local” 后缀的 DNS 请求 被转发到侦听 1.2.3.4 的 DNS。 通过 Google 公共 DNS 进行向上查询。

下表描述了具有特定域名的查询如何映射到
其目标DNS服务器：

| 域名               | 服务器回答查询               |
| ------------------ | -------------------------- |
| kubernetes.default.svc.cluster.local | kube-dns |
| foo.acme.local | 自定义 DNS（1.2.3.4）|
| widget.com | 上游 DNS（8.8.8.8、8.8.4.4中的一个）|

请参见 [ConfigMap options](#configmap-options) 有关配置选项格式的详细信息。



<!-- discussion -->

<!-- 
#### Effects on Pods

Custom upstream nameservers and stub domains do not affect Pods with a
`dnsPolicy` set to "`Default`" or "`None`". 
-->
#### 对 Pod 的影响

自定义上游域名服务器和存根域不影响 `dnsPolicy` 设置为 "`Default`" 或 "`None`" 的 Pod。

<!-- 
If a Pod's `dnsPolicy` is set to "`ClusterFirst`", its name resolution is
handled differently, depending on whether stub-domain and upstream DNS servers
are configured. 
-->
如果 Pod 的 `dnsPolicy` 设置为 "`ClusterFirst`"，则根据是否配置了存根域和上游 DNS 服务器来不同地处理其名称解析。

<!-- 
**Without custom configurations**: Any query that does not match the configured
cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream
nameserver inherited from the node.

**With custom configurations**: If stub domains and upstream DNS servers are
configured,
DNS queries are routed according to the following flow:

1. The query is first sent to the DNS caching layer in kube-dns.

1. From the caching layer, the suffix of the request is examined and then
   forwarded to the appropriate DNS, based on the following cases:

   * *Names with the cluster suffix*, for example ".cluster.local":
     The request is sent to kube-dns.

   * *Names with the stub domain suffix*, for example ".acme.local":
     The request is sent to the configured custom DNS resolver, listening for example at 1.2.3.4.

   * *Names without a matching suffix*, for example "widget.com":
     The request is forwarded to the upstream DNS,
     for example Google public DNS servers at 8.8.8.8 and 8.8.4.4. 
-->
**不使用自定义配置**：任何与配置不匹配的查询
集群域后缀（例如 "www.kubernetes.io"）将转发到从节点继承的上游域名服务器。

**使用自定义配置**：如果存根域和上游 DNS 服务器
配置完成后，DNS 查询将按照以下流程进行路由：：

1.首先将查询发送到 kube-dns 中的 DNS 缓存层。

1.在以下情况下，从缓存层检查请求的后缀，然后将其转发到适当的 DNS：：

   * *带集群后缀的名称*，例如 ".cluster.local"：
     该请求被发送到 kube-dns。

   * *带存根域名后缀的名称*，例如 ".acme.local"：
     该请求将发送到已配置的自定义 DNS 解析器，例如在 1.2.3.4 处进行侦听。

   * *名称没有匹配的后缀*，例如 "widget.com"：
     该请求被转发到上游 DNS，
     例如位于 8.8.8.8 和 8.8.4.4 的 Google 公共 DNS 服务器。

<!-- 
![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png) 
-->
![DNS 查询流程](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png) 

<!-- 
### ConfigMap options 
-->
### ConfigMap 选项

<!-- 
Options for the kube-dns `kube-system:kube-dns` ConfigMap:

| Field | Format | Description |
| ----- | ------ | ----------- |
| `stubDomains` (optional) | A JSON map using a DNS suffix key such as “acme.local”, and a value consisting of a JSON array of DNS IPs. | The target nameserver can itself be a Kubernetes Service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs. | If specified, the values replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. | 
-->
kube-dns `kube-system:kube-dns` 的 ConfigMap 选项：

| 领域   | 格式   | 描述        |
| ----- | ------ | ----------- |
| `stubDomains`（可选）| 使用 DNS 后缀键（例如“ acme.local”）和由 DNS IP 的 JSON 数组组成的值的 JSON 映射。 | 目标域名服务器本身可以是 Kubernetes 服务。 例如，您可以运行自己的 dnsmasq 副本，以将自定义 DNS 名称导出到 ClusterDNS 命名空间中。 |
| `upstreamNameservers`（可选）| DNS IP的 JSON 数组。 | 如果指定，则这些值替换默认情况下从节点的 `/etc/resolv.conf` 中获取的域名服务器。 限制：最多可以指定三个上游域名服务器。 |

<!-- 
#### Examples

##### Example: Stub domain

In this example, the user has a Consul DNS service discovery system they want to
integrate with kube-dns. The consul domain server is located at 10.150.0.1, and
all consul names have the suffix `.consul.local`.  To configure Kubernetes, the
cluster administrator creates the following ConfigMap: 
-->
#### 例子

##### 示例：存根域

在此示例中，用户具有他们想与 kube-dns 集成的 Consul DNS 服务发现系统。 consul 域服务器位于 10.150.0.1，所有领事名称均带有后缀 `.consul.local`。 要配置 Kubernetes，集群管理员将创建以下 ConfigMap：

​```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  stubDomains: |
    {"consul.local": ["10.150.0.1"]}
​```

<!-- 
Note that the cluster administrator does not want to override the node’s
upstream nameservers, so they did not specify the optional
`upstreamNameservers` field.

##### Example: Upstream nameserver

In this example the cluster administrator wants to explicitly force all
non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.
In this case, they create a ConfigMap with the
`upstreamNameservers` field specifying the desired nameserver: 
-->
需要注意的是集群管理员不希望覆盖节点的上游域名服务器，所以他们没有指定可选的 `upstreamNameservers` 字段。

##### 示例： 上游域名服务器

在此示例中，集群管理员希望显式强制所有非集群 DNS 查找通过其自己的域名服务器172.16.0.1）。 在这种情况下，他们使用指定所需域名服务器的 `upstreamNameservers` 字段创建一个 ConfigMap：


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  upstreamNameservers: |
    ["172.16.0.1"]
```



<!-- 
## CoreDNS configuration equivalent to kube-dns

CoreDNS supports the features of kube-dns and more.
A ConfigMap created for kube-dns to support `StubDomains`and `upstreamNameservers` translates to the `proxy` plugin in CoreDNS.
Similarly, the `Federations` plugin in kube-dns translates to the `federation` plugin in CoreDNS.

### Example

This example ConfigMap for kubedns specifies federations, stubdomains and upstreamnameservers: 
-->
## CoreDNS 配置等同于 kube-dns

CoreDNS 不仅仅提供 kube-dns 的功能。
为 kube-dns 创建的 ConfigMap 支持 `StubDomains` 和 `upstreamNameservers` 转换为 CoreDNS 中的 `proxy` 插件。
同样，kube-dns 中的 `Federations` 插件会转换为 CoreDNS 中的 `federation` 插件。

### 示例

用于 kubedns 的此示例 ConfigMap 描述了 federations, stubdomains and upstreamnameservers：

```yaml
apiVersion: v1
data:
  federations: |
    {"foo" : "foo.feddomain.com"}
  stubDomains: |
    {"abc.com" : ["1.2.3.4"], "my.cluster.local" : ["2.3.4.5"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
kind: ConfigMap
```

<!-- 
The equivalent configuration in CoreDNS creates a Corefile: 
-->
CoreDNS 中的等效配置将创建一个 Corefile：

* For federations:
```yaml
federation cluster.local {
           foo foo.feddomain.com
        }
```

* For stubDomains:
```yaml
abc.com:53 {
        errors
        cache 30
        proxy . 1.2.3.4
    }
    my.cluster.local:53 {
        errors
        cache 30
        proxy . 2.3.4.5
    }
```

<!-- 
The complete Corefile with the default plugins: 
-->
带有默认插件的完整 Corefile：

```yaml
.:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           upstream  8.8.8.8 8.8.4.4
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        federation cluster.local {
           foo foo.feddomain.com
        }
        prometheus :9153
        proxy .  8.8.8.8 8.8.4.4
        cache 30
    }
    abc.com:53 {
        errors
        cache 30
        proxy . 1.2.3.4
    }
    my.cluster.local:53 {
        errors
        cache 30
        proxy . 2.3.4.5
    }
```

<!-- 
## Migration to CoreDNS

To migrate from kube-dns to CoreDNS, [a detailed blog](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) is available to help users adapt CoreDNS in place of kube-dns.
A cluster administrator can also migrate using [the deploy script](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh).

## What's next
- [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/).
``` 
-->
## 迁移到 CoreDNS

要将 kube-dns 迁移到 CoreDNS，可使用 [详细博客](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) 来帮助用户在迁移自 kube-dns。
集群管理员还可以使用[部署脚本](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh) 进行迁移。

＃＃ 下一步是什么
- [调试 DNS 解析](/docs/tasks/administer-cluster/dns-debugging-resolution/)。
```
