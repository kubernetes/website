---
approvers:
- bowei
- zihongz
title: 在 Kubernetes 中配置私有 DNS 和上游 nameserver
---

{% capture overview %}
<!--
This page shows how to add custom private DNS zones (stub domains) and upstream
nameservers.
-->
本页展示了如何添加自定义私有 DNS 域（存根域）和上游 nameserver。

{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}

<!--
* Kubernetes version 1.6 and above.
* The cluster must be configured to use the `kube-dns` addon.
-->

* Kubernetes 1.6 及其以上版本。
* 集群必须使用 `kube-dns` 插件进行配置。

{% endcapture %}

{% capture steps %}

<!--
## Configure stub-domain and upstream DNS servers

Cluster administrators can specify custom stub domains and upstream nameservers
by providing a ConfigMap for kube-dns (`kube-system:kube-dns`).

For example, the following ConfigMap sets up a DNS configuration with a single stub domain and two
upstream nameservers.
-->

## 配置存根域和上游 DNS 服务器

通过为 kube-dns （`kube-system:kube-dns`）提供一个 ConfigMap，集群管理员能够指定自定义存根域和上游 nameserver。

例如，下面的 ConfigMap 建立了一个 DNS 配置，它具有一个单独的存根域和两个上游 nameserver：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  stubDomains: |
    {“acme.local”: [“1.2.3.4”]}
  upstreamNameservers: |
    [“8.8.8.8”, “8.8.4.4”]
```

<!--
As specified, DNS requests with the “.acme.local” suffix
are forwarded to a DNS listening at 1.2.3.4. Google Public DNS
serves the upstream queries.

The table below describes how queries with certain domain names would map to their destination DNS servers:
-->

按如上说明，具有 “.acme.local” 后缀的 DNS 请求被转发到 DNS 1.2.3.4。Google 公共 DNS 为上游查询提供服务。

<!--
| Domain name | Server answering the query |
| ----------- | -------------------------- |
| kubernetes.default.svc.cluster.local| kube-dns |
| foo.acme.local| custom DNS (1.2.3.4) |
| widget.com    | upstream DNS (one of 8.8.8.8, 8.8.4.4) |
-->

| 域名 | 响应查询的服务器 |
| ----------- | -------------------------- |
| kubernetes.default.svc.cluster.local| kube-dns |
| foo.acme.local| 自定义 DNS (1.2.3.4) |
| widget.com    | 上游 DNS (8.8.8.8, 8.8.4.4 中之一) |

<!--
See [ConfigMap options](#configmap-options) for
details about the configuration option format.
-->
查看 [ConfigMap 选项](#configmap-options) 获取更多关于配置选项格式的详细信息。

{% endcapture %}

{% capture discussion %}

<!--
## Understanding name resolution in Kubernetes

DNS policies can be set on a per-pod basis. Currently Kubernetes supports two pod-specific DNS policies: “Default” and “ClusterFirst”. These policies are specified with the `dnsPolicy` flag.

*NOTE: "Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then “ClusterFirst” is used.*
-->

## 理解 Kubernetes 中名字解析

可以为每个 Pod 设置 DNS 策略。
当前 Kubernetes 支持两种 Pod 特定的 DNS 策略：“Default” 和 “ClusterFirst”。
可以通过 `dnsPolicy` 标志来指定这些策略。
*注意：“Default” 不是默认的 DNS 策略。如果没有显式地指定 `dnsPolicy`，将会使用 “ClusterFirst”。*

<!--
### "Default" DNS Policy

If `dnsPolicy` is set to “Default”, then the name resolution configuration is
inherited from the node that the pods run on. Custom upstream nameservers and stub domains cannot be used in conjunction with this policy.
-->

### "Default" DNS 策略

如果 `dnsPolicy` 被设置为 “Default”，则名字解析配置会继承自 Pod 运行所在的节点。
自定义上游 nameserver 和 存根域不能够与这个策略一起使用。

<!--
### "ClusterFirst" DNS Policy

If the `dnsPolicy` is set to "ClusterFirst", name resolution is handled differently, *depending on whether stub-domain and upstream DNS servers are configured*.

**Without custom configurations**: Any query that does not match the configured cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream nameserver inherited from the node.

**With custom configurations**: If stub domains and upstream DNS servers are configured (as in the [previous example](#configuring-stub-domain-and-upstream-dns-servers)), DNS queries will be
routed according to the following flow:
-->

### "ClusterFirst" DNS 策略

如果 `dnsPolicy` 被设置为 "ClusterFirst"，名字解析的处理有所不同，*依赖于是否对存根域和上游 DNS 服务器进行了配置*。

**未进行自定义配置**：没有匹配上配置的集群域名后缀的任何请求，例如 “www.kubernetes.io”，将会被转发到继承自节点的上游 nameserver。

**进行自定义配置**：如果配置了存根域和上游 DNS 服务器（和在 [前面例子](#configuring-stub-domain-and-upstream-dns-servers) 配置的一样），DNS 查询将根据下面的流程进行路由：

<!--
1. The query is first sent to the DNS caching layer in kube-dns.

1. From the caching layer, the suffix of the request is examined and then forwarded to the appropriate DNS, based on the following cases:

   * *Names with the cluster suffix* (e.g.".cluster.local"): The request is sent to kube-dns.

   * *Names with the stub domain suffix* (e.g. ".acme.local"): The request is sent to the configured custom DNS resolver (e.g. listening at 1.2.3.4).

   * *Names without a matching suffix* (e.g."widget.com"): The request is forwarded to the upstream DNS (e.g. Google public DNS servers at 8.8.8.8 and 8.8.4.4).

![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)
-->

1. 查询首先被发送到 kube-dns 中的 DNS 缓存层。

1. 从缓存层，检查请求的后缀，并转发到合适的 DNS 上，基于如下的示例：
 
   * *具有集群后缀的名字*（例如 ".cluster.local"）：请求被发送到 kube-dns。

   * *具有存根域后缀的名字*（例如 ".acme.local"）：请求被发送到配置的自定义 DNS 解析器（例如：监听在 1.2.3.4）。

   * *不具有能匹配上后缀的名字*（例如 "widget.com"）：请求被转发到上游 DNS（例如：Google 公共 DNS 服务器，8.8.8.8 和 8.8.4.4）。

![DNS 查询流程](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

<!--
## ConfigMap options

Options for the kube-dns `kube-system:kube-dns` ConfigMap

| Field | Format | Description |
| ----- | ------ | ----------- |
| `stubDomains` (optional) | A JSON map using a DNS suffix key (e.g. “acme.local”) and a value consisting of a JSON array of DNS IPs. | The target nameserver may itself be a Kubernetes service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs. | Note: If specified, then the values specified replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. |
-->

## ConfigMap 选项

kube-dns `kube-system:kube-dns` ConfigMap 的选项如下所示：

| 字段 | 格式 | 描述 |
| ----- | ------ | ----------- |
| `stubDomains`（可选）| 使用 DNS 后缀 key 的 JSON map（例如 “acme.local”），以及 DNS IP 的 JSON 数组作为 value。 | 目标 nameserver 可能是一个 Kubernetes Service。例如，可以运行自己的 dnsmasq 副本，将 DNS 名字暴露到 ClusterDNS namespace 中。|
| `upstreamNameservers`（可选）| DNS IP 的 JSON 数组。 | 注意：如果指定，则指定的值会替换掉被默认从节点的 `/etc/resolv.conf` 中获取到的 nameserver。限制：最多可以指定三个上游 nameserver。|

<!--
## Additional examples

### Example: Stub domain

In this example, the user has a Consul DNS service discovery system that they wish to
integrate with kube-dns. The consul domain server is located at 10.150.0.1, and
all consul names have the suffix “.consul.local”.  To configure Kubernetes, the
cluster administrator simply creates a ConfigMap object as shown below.  
-->

## 附加示例

### 示例：存根域

在这个例子中，用户有一个 Consul DNS 服务发现系统，他们希望能够与 kube-dns 集成起来。
Consul 域名服务器地址为 10.150.0.1，所有的 Consul 名字具有后缀 “.consul.local”。
要配置 Kubernetes，集群管理员只需要简单地创建一个 ConfigMap 对象，如下所示：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
    namespace: kube-system
    data:
      stubDomains: |
          {“consul.local”: [“10.150.0.1”]}
```
<!--
Note that the cluster administrator did not wish to override the node’s
upstream nameservers, so they did not specify the optional
`upstreamNameservers` field.
-->

注意，集群管理员不希望覆盖节点的上游 nameserver，所以他们不会指定可选的 `upstreamNameservers` 字段。

<!--
### Example: Upstream nameserver

In this example the cluster administrator wants to explicitly force all
non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.
Again, this is easy to accomplish; they just need to create a ConfigMap with the
`upstreamNameservers` field specifying the desired nameserver.
-->

### 示例：上游 nameserver

在这个示例中，集群管理员不希望显式地强制所有非集群 DNS 查询进入到他们自己的 nameserver 172.16.0.1。
而且这很容易实现：他们只需要创建一个 ConfigMap，`upstreamNameservers` 字段指定期望的 nameserver 即可。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
    namespace: kube-system
    data:
      upstreamNameservers: |
          [“172.16.0.1”]
```

{% endcapture %}

{% include templates/task.md %}
