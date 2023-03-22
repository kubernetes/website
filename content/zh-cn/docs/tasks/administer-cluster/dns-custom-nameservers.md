---
title: 自定义 DNS 服务
content_type: task
min-kubernetes-server-version: v1.12
weight: 160
---
<!-- 
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_type: task
min-kubernetes-server-version: v1.12
weight: 160
-->

<!-- overview -->
<!-- 
This page explains how to configure your DNS
{{< glossary_tooltip text="Pod(s)" term_id="pod" >}} and customize the
DNS resolution process in your cluster.
-->
本页说明如何配置 DNS {{< glossary_tooltip text="Pod" term_id="pod" >}}，以及定制集群中 DNS 解析过程。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
Your cluster must be running the CoreDNS add-on.
-->
你的集群必须运行 CoreDNS 插件。

{{% version-check %}}

<!-- steps -->

<!-- 
## Introduction

DNS is a built-in Kubernetes service launched automatically
using the _addon manager_ [cluster add-on](http://releases.k8s.io/master/cluster/addons/README.md).
-->
## 介绍   {#introduction}

DNS 是使用 **插件管理器**
[集群插件](http://releases.k8s.io/master/cluster/addons/README.md)自动启动的 Kubernetes 内置服务。

{{< note >}}
<!--
The CoreDNS Service is named `kube-dns` in the `metadata.name` field.  
The intent is to ensure greater interoperability with workloads that relied on
the legacy `kube-dns` Service name to resolve addresses internal to the cluster.
Using a Service named `kube-dns` abstracts away the implementation detail of
which DNS provider is running behind that common name.
-->
CoreDNS 服务在其 `metadata.name` 字段被命名为 `kube-dns`。
这是为了能够与依靠传统 `kube-dns` 服务名称来解析集群内部地址的工作负载具有更好的互操作性。
使用 `kube-dns` 作为服务名称可以抽离共有名称之后运行的是哪个 DNS 提供程序这一实现细节。
{{< /note >}}

<!--
If you are running CoreDNS as a Deployment, it will typically be exposed as
a Kubernetes Service with a static IP address.
The kubelet passes DNS resolver information to each container with the
`--cluster-dns=<dns-service-ip>` flag.
-->
如果你在使用 Deployment 运行 CoreDNS，则该 Deployment 通常会向外暴露为一个具有
静态 IP 地址 Kubernetes 服务。
kubelet 使用 `--cluster-dns=<DNS 服务 IP>` 标志将 DNS 解析器的信息传递给每个容器。

<!-- 
DNS names also need domains. You configure the local domain in the kubelet
with the flag `--cluster-domain=<default-local-domain>`.
-->
DNS 名称也需要域名。你可在 kubelet 中使用 `--cluster-domain=<默认本地域名>`
标志配置本地域名。

<!-- 
The DNS server supports forward lookups (A and AAAA records), port lookups (SRV records),
reverse IP address lookups (PTR records), and more. For more information, see
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/).
-->
DNS 服务器支持正向查找（A 和 AAAA 记录）、端口发现（SRV 记录）、反向 IP 地址发现（PTR 记录）等。
更多信息，请参见 [Service 与 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!-- 
If a Pod's `dnsPolicy` is set to `default`, it inherits the name resolution
configuration from the node that the Pod runs on. The Pod's DNS resolution
should behave the same as the node.
But see [Known issues](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).
-->
如果 Pod 的 `dnsPolicy` 设置为 `default`，则它将从 Pod 运行所在节点继承名称解析配置。
Pod 的 DNS 解析行为应该与节点相同。
但请参阅[已知问题](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)。

<!-- 
If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Set this flag to "" to prevent Pods from
inheriting DNS. Set it to a valid file path to specify a file other than
`/etc/resolv.conf` for DNS inheritance.
-->
如果你不想这样做，或者想要为 Pod 使用其他 DNS 配置，则可以使用 kubelet 的
`--resolv-conf` 标志。将此标志设置为 "" 可以避免 Pod 继承 DNS。
将其设置为有别于 `/etc/resolv.conf` 的有效文件路径可以设定 DNS 继承不同的配置。

## CoreDNS

<!-- 
CoreDNS is a general-purpose authoritative DNS server that can serve as cluster DNS,
complying with the [DNS specifications](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
CoreDNS 是通用的权威 DNS 服务器，可以用作集群 DNS，符合
[DNS 规范](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!-- 
### CoreDNS ConfigMap options 

CoreDNS is a DNS server that is modular and pluggable, with plugins adding new functionalities.
The CoreDNS server can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/),
which is the CoreDNS configuration file. As a cluster administrator, you can modify the
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} for the CoreDNS Corefile to
change how DNS service discovery behaves for that cluster.
-->
### CoreDNS ConfigMap 选项  {#coredns-configmap-options}

CoreDNS 是模块化且可插拔的 DNS 服务器，每个插件都为 CoreDNS 添加了新功能。
可以通过维护 [Corefile](https://coredns.io/2017/07/23/corefile-explained/)，即 CoreDNS 配置文件，
来配置 CoreDNS 服务器。作为一个集群管理员，你可以修改 CoreDNS Corefile 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
以更改 DNS 服务发现针对该集群的工作方式。

<!-- 
In Kubernetes, CoreDNS is installed with the following default Corefile configuration:
-->
在 Kubernetes 中，CoreDNS 安装时使用如下默认 Corefile 配置：

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
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

<!-- 
The Corefile configuration includes the following [plugins](https://coredns.io/plugins/) of CoreDNS:
-->
Corefile 配置包括以下 CoreDNS [插件](https://coredns.io/plugins/)：

<!-- 
* [errors](https://coredns.io/plugins/errors/): Errors are logged to stdout.
* [health](https://coredns.io/plugins/health/): Health of CoreDNS is reported to
  `http://localhost:8080/health`. In this extended syntax `lameduck` will make the process
  unhealthy then wait for 5 seconds before the process is shut down.
* [ready](https://coredns.io/plugins/ready/): An HTTP endpoint on port 8181 will return 200 OK,
  when all plugins that are able to signal readiness have done so.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS will reply to DNS queries
  based on IP of the Services and Pods. You can find [more details](https://coredns.io/plugins/kubernetes/)
  about this plugin on the CoreDNS website.
  - `ttl` allows you to set a custom TTL for responses. The default is 5 seconds.
    The minimum TTL allowed is 0 seconds, and the maximum is capped at 3600 seconds.
    Setting TTL to 0 will prevent records from being cached.  
-->
* [errors](https://coredns.io/plugins/errors/)：错误记录到标准输出。
* [health](https://coredns.io/plugins/health/)：在 `http://localhost:8080/health` 处提供 CoreDNS 的健康报告。
  在这个扩展语法中，`lameduck` 会使此进程不健康，等待 5 秒后进程被关闭。
* [ready](https://coredns.io/plugins/ready/)：在端口 8181 上提供的一个 HTTP 端点，
  当所有能够表达自身就绪的插件都已就绪时，在此端点返回 200 OK。
* [kubernetes](https://coredns.io/plugins/kubernetes/)：CoreDNS 将基于服务和 Pod 的 IP 来应答 DNS 查询。
  你可以在 CoreDNS 网站找到有关此插件的[更多细节](https://coredns.io/plugins/kubernetes/)。

  - 你可以使用 `ttl` 来定制响应的 TTL。默认值是 5 秒钟。TTL 的最小值可以是 0 秒钟，
    最大值为 3600 秒。将 TTL 设置为 0 可以禁止对 DNS 记录进行缓存。

  <!-- 
  - The `pods insecure` option is provided for backward compatibility with `kube-dns`.
  - You can use the `pods verified` option, which returns an A record only if there exists a pod
    in the same namespace with a matching IP.
  - The `pods disabled` option can be used if you don't use pod records.
  -->

  - `pods insecure` 选项是为了与 kube-dns 向后兼容。
  - 你可以使用 `pods verified` 选项，该选项使得仅在相同名字空间中存在具有匹配 IP 的 Pod 时才返回 A 记录。
  - 如果你不使用 Pod 记录，则可以使用 `pods disabled` 选项。

<!-- 
* [prometheus](https://coredns.io/plugins/metrics/): Metrics of CoreDNS are available at
  `http://localhost:9153/metrics` in the [Prometheus](https://prometheus.io/) format
  (also known as OpenMetrics).
* [forward](https://coredns.io/plugins/forward/): Any queries that are not within the Kubernetes
  cluster domain are forwarded to predefined resolvers (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): This enables a frontend cache.
* [loop](https://coredns.io/plugins/loop/): Detects simple forwarding loops and
  halts the CoreDNS process if a loop is found.
* [reload](https://coredns.io/plugins/reload): Allows automatic reload of a changed Corefile.
  After you edit the ConfigMap configuration, allow two minutes for your changes to take effect.
* [loadbalance](https://coredns.io/plugins/loadbalance): This is a round-robin DNS loadbalancer
  that randomizes the order of A, AAAA, and MX records in the answer.
-->
* [prometheus](https://coredns.io/plugins/prometheus/)：CoreDNS 的度量指标值以
  [Prometheus](https://prometheus.io/) 格式（也称为 OpenMetrics）在 `http://localhost:9153/metrics` 上提供。
* [forward](https://coredns.io/plugins/forward/): 不在 Kubernetes 集群域内的任何查询都将转发到预定义的解析器 (/etc/resolv.conf)。
* [cache](https://coredns.io/plugins/cache/)：启用前端缓存。
* [loop](https://coredns.io/plugins/loop/)：检测简单的转发环，如果发现死循环，则中止 CoreDNS 进程。
* [reload](https://coredns.io/plugins/reload)：允许自动重新加载已更改的 Corefile。
  编辑 ConfigMap 配置后，请等待两分钟，以使更改生效。
* [loadbalance](https://coredns.io/plugins/loadbalance)：这是一个轮转式 DNS 负载均衡器，
  它在应答中随机分配 A、AAAA 和 MX 记录的顺序。

<!-- 
You can modify the default CoreDNS behavior by modifying the ConfigMap.
-->
你可以通过修改 ConfigMap 来更改默认的 CoreDNS 行为。

<!-- 
### Configuration of Stub-domain and upstream nameserver using CoreDNS

CoreDNS has the ability to configure stub-domains and upstream nameservers
using the [forward plugin](https://coredns.io/plugins/forward/).
-->
### 使用 CoreDNS 配置存根域和上游域名服务器   {#configuration-of-stub-domain-and-upstream-nameserver-using-coredns}

CoreDNS 能够使用 [forward 插件](https://coredns.io/plugins/forward/)配置存根域和上游域名服务器。

<!-- 
#### Example

If a cluster operator has a [Consul](https://www.consul.io/) domain server located at "10.150.0.1",
and all Consul names have the suffix ".consul.local". To configure it in CoreDNS,
the cluster administrator creates the following stanza in the CoreDNS ConfigMap.
-->
#### 示例

如果集群操作员在 "10.150.0.1" 处运行了 [Consul](https://www.consul.io/) 域服务器，
且所有 Consul 名称都带有后缀 `.consul.local`。要在 CoreDNS 中对其进行配置，
集群管理员可以在 CoreDNS 的 ConfigMap 中创建加入以下字段。

```
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

<!-- 
To explicitly force all non-cluster DNS lookups to go through a specific nameserver at 172.16.0.1,
point the `forward` to the nameserver instead of `/etc/resolv.conf` 
-->
要显式强制所有非集群 DNS 查找通过特定的域名服务器（位于 172.16.0.1），可将 `forward`
指向该域名服务器，而不是 `/etc/resolv.conf`。

```
forward .  172.16.0.1
```

<!-- 
The final ConfigMap along with the default `Corefile` configuration looks like:
-->
最终的包含默认的 `Corefile` 配置的 ConfigMap 如下所示：

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
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

{{< note >}}
<!--
CoreDNS does not support FQDNs for stub-domains and nameservers (eg: "ns.foo.com").
During translation, all FQDN nameservers will be omitted from the CoreDNS config.
-->
CoreDNS 不支持 FQDN 作为存根域和域名服务器（例如 "ns.foo.com"）。
转换期间，CoreDNS 配置中将忽略所有的 FQDN 域名服务器。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
- Read [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/)
-->
- 阅读[调试 DNS 解析](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/)

