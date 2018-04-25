---
approvers:
- bowei
- zihongz
title: 配置 DNS 服务
---

{% capture overview %}

<!--

This page provides hints on configuring DNS Pod and guidance on customizing the
DNS resolution process and diagnosing DNS problems.

-->

本页中给出了配置 DNS Pod 的提示和定义 DNS 解析过程以及诊断 DNS 问题的指南。

{% endcapture %}

{% capture prerequisites %}

<!--

- {% include task-tutorial-prereqs.md %}
- Kubernetes version 1.6 and above.
- The cluster must be configured to use the `kube-dns` addon.
-->
{% endcapture %}

- {% include task-tutorial-prereqs.md %}
- Kubernetes 1.6 及其以上版本。
- 集群必须使用 `kube-dns` 插件进行配置。

{% capture steps %}

<!--

## Introduction

Starting from Kubernetes v1.3, DNS is a built-in service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md).

The running Kubernetes DNS pod holds 3 containers:

- "`kubedns`": The `kubedns` process watches the Kubernetes master for changes
  in Services and Endpoints, and maintains in-memory lookup structures to serve
  DNS requests.
- "`dnsmasq`": The `dnsmasq` container adds DNS caching to improve performance.
- "`healthz`": The `healthz` container provides a single health check endpoint
  while performing dual healthchecks (for `dnsmasq` and `kubedns`).

-->

## 介绍

从 Kubernetes v1.3 版本开始，使用 [cluster add-on 插件管理器回自动启动内置的 DNS。

Kubernetes DNS pod 中包括 3 个容器：

- `kubedns`：`kubedns` 进程监视 Kubernetes master 中的 Service 和 Endpoint 的变化，并维护内存查找结构来服务DNS请求。
- `dnsmasq`：`dnsmasq` 容器添加 DNS 缓存以提高性能。
- `healthz`：`healthz` 容器在执行双重健康检查（针对 `dnsmasq` 和 `kubedns`）时提供单个健康检查端点。

<!--

The DNS pod is exposed as a Kubernetes Service with a static IP. Once assigned
the kubelet passes DNS configured using the `--cluster-dns=<dns-service-ip>`
flag to each container.

DNS names also need domains. The local domain is configurable in the kubelet
using the flag `--cluster-domain=<default-local-domain>`.

The Kubernetes cluster DNS server is based off the
[SkyDNS](https://github.com/skynetservices/skydns) library. It supports forward
lookups (A records), service lookups (SRV records) and reverse IP address
lookups (PTR records).

-->

DNS  pod 具有静态 IP 并作为 Kubernetes 服务暴露出来。该静态 IP 分配后，kubelet 会将使用 `--cluster-dns = <dns-service-ip>` 标志配置的 DNS 传递给每个容器。

DNS 名称也需要域名。本地域可以使用标志 `--cluster-domain = <default-local-domain>` 在 kubelet 中配置。

Kubernetes集群DNS服务器基于 [SkyDNS](https://github.com/skynetservices/skydns) 库。它支持正向查找（A 记录），服务查找（SRV 记录）和反向 IP 地址查找（PTR 记录）

<!--

## Inheriting DNS from the node

When running a pod, kubelet will prepend the cluster DNS server and search
paths to the node's own DNS settings.  If the node is able to resolve DNS names
specific to the larger environment, pods should be able to, also.
See [Known issues](#known-issues) below for a caveat.

If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Setting it to "" means that pods will
not inherit DNS. Setting it to a valid file path means that kubelet will use
this file instead of `/etc/resolv.conf` for DNS inheritance.

-->

## 继承节点的 DNS

运行 Pod 时，kubelet 将预先配置集群 DNS 服务器到 Pod 中，并搜索节点自己的 DNS 设置路径。如果节点能够解析特定于较大环境的 DNS 名称，那么 Pod 应该也能够解析。请参阅下面的[已知问题](#known-issues)以了解警告。

如果您不想要这个，或者您想要为 Pod 设置不同的 DNS 配置，您可以给 kubelet 指定 `--resolv-conf` 标志。将该值设置为 "" 意味着 Pod 不继承 DNS。将其设置为有效的文件路径意味着 kubelet 将使用此文件而不是 `/etc/resolv.conf` 用于 DNS 继承。

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

The table below describes how queries with certain domain names would map to
their destination DNS servers:

-->

如上面指定的那样，带有“.acme.local”后缀的 DNS 请求被转发到 1.2.3.4 处监听的 DNS。Google Public DNS 为上游查询提供服务。

下表描述了如何将具有特定域名的查询映射到其目标DNS服务器：

<!--

| Domain name                          | Server answering the query             |
| ------------------------------------ | -------------------------------------- |
| kubernetes.default.svc.cluster.local | kube-dns                               |
| foo.acme.local                       | custom DNS (1.2.3.4)                   |
| widget.com                           | upstream DNS (one of 8.8.8.8, 8.8.4.4) |

See [ConfigMap options](#configmap-options) for
details about the configuration option format.

-->

| 域名                                   | 响应查询的服务器                               |
| ------------------------------------ | -------------------------------------- |
| kubernetes.default.svc.cluster.local | kube-dns                               |
| foo.acme.local                       | custom DNS (1.2.3.4)                   |
| widget.com                           | upstream DNS (one of 8.8.8.8, 8.8.4.4) |

查看 [ConfigMap 选项](#configmap-options) 获取更多关于配置选项格式的详细信息。

{% endcapture %}

{% capture discussion %}

<!--

### Impacts on Pods

Custom upstream nameservers and stub domains won't impact Pods that have their
`dnsPolicy` set to "`Default`" or "`None`".

If a Pod's `dnsPolicy` is set to "`ClusterFirst`", its name resolution is
handled differently, depending on whether stub-domain and upstream DNS servers
are configured.

**Without custom configurations**: Any query that does not match the configured
cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream
nameserver inherited from the node.

-->

### 对 Pod 的影响

自定义的上游名称服务器和存根域不会影响那些将自己的 `dnsPolicy` 设置为 `Default` 或者 `None` 的 Pod。

如果 Pod 的 `dnsPolicy` 设置为 “`ClusterFirst`”，则其名称解析将按其他方式处理，具体取决于存根域和上游 DNS 服务器的配置。

**未进行自定义配置**：没有匹配上配置的集群域名后缀的任何请求，例如 “www.kubernetes.io”，将会被转发到继承自节点的上游 nameserver。

<!--

**With custom configurations**: If stub domains and upstream DNS servers are
configured (as in the [previous example](#configuring-stub-domain-and-upstream-dns-servers)),
DNS queries will be routed according to the following flow:

1. The query is first sent to the DNS caching layer in kube-dns.
2. From the caching layer, the suffix of the request is examined and then
   forwarded to the appropriate DNS, based on the following cases:
   - *Names with the cluster suffix* (e.g.".cluster.local"):
     The request is sent to kube-dns.
   - *Names with the stub domain suffix* (e.g. ".acme.local"):
     The request is sent to the configured custom DNS resolver (e.g. listening at 1.2.3.4).
   - *Names without a matching suffix* (e.g."widget.com"):
     The request is forwarded to the upstream DNS
     (e.g. Google public DNS servers at 8.8.8.8 and 8.8.4.4).

![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

-->

**进行自定义配置**：如果配置了存根域和上游 DNS 服务器（和在 [前面例子](#configuring-stub-domain-and-upstream-dns-servers) 配置的一样），DNS 查询将根据下面的流程进行路由：

1. 查询首先被发送到 kube-dns 中的 DNS 缓存层。

2. 从缓存层，检查请求的后缀，并转发到合适的 DNS 上，基于如下的示例：

   - *具有集群后缀的名字*（例如 “.cluster.local”）：请求被发送到 kube-dns。
   - *具有存根域后缀的名字*（例如 “.acme.local”）：请求被发送到配置的自定义 DNS 解析器（例如：监听在 1.2.3.4）。
   - *不具有能匹配上后缀的名字*（例如 “widget.com”）：请求被转发到上游 DNS（例如：Google 公共 DNS 服务器，8.8.8.8 和 8.8.4.4）。

   ![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

<!--

## ConfigMap options

Options for the kube-dns `kube-system:kube-dns` ConfigMap:

| Field                            | Format                                   | Description                              |
| -------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `stubDomains` (optional)         | A JSON map using a DNS suffix key (e.g. “acme.local”) and a value consisting of a JSON array of DNS IPs. | The target nameserver may itself be a Kubernetes service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs.                 | Note: If specified, then the values specified replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. |

-->

## ConfigMap 选项

kube-dns `kube-system:kube-dns` ConfigMap 的选项如下所示：

| 字段                        | 格式                                       | 描述                                       |
| ------------------------- | ---------------------------------------- | ---------------------------------------- |
| `stubDomains`（可选）         | 使用 DNS 后缀 key 的 JSON map（例如 “acme.local”），以及 DNS IP 的 JSON 数组作为 value。 | 目标 nameserver 可能是一个 Kubernetes Service。例如，可以运行自己的 dnsmasq 副本，将 DNS 名字暴露到 ClusterDNS namespace 中。 |
| `upstreamNameservers`（可选） | DNS IP 的 JSON 数组。                        | 注意：如果指定，则指定的值会替换掉被默认从节点的 `/etc/resolv.conf` 中获取到的 nameserver。限制：最多可以指定三个上游 nameserver。 |

<!--

### Examples

#### Example: Stub domain

In this example, the user has a Consul DNS service discovery system that they wish to
integrate with kube-dns. The consul domain server is located at 10.150.0.1, and
all consul names have the suffix “.consul.local”.  To configure Kubernetes, the
cluster administrator simply creates a ConfigMap object as shown below.

-->

### 示例

#### 示例：存根域

在这个例子中，用户有一个 Consul DNS 服务发现系统，他们希望能够与 kube-dns 集成起来。 Consul 域名服务器地址为 10.150.0.1，所有的 Consul 名字具有后缀 “.consul.local”。 要配置 Kubernetes，集群管理员只需要简单地创建一个 ConfigMap 对象，如下所示：

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

#### Example: Upstream nameserver

In this example the cluster administrator wants to explicitly force all
non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.
Again, this is easy to accomplish; they just need to create a ConfigMap with the
`upstreamNameservers` field specifying the desired nameserver.

-->

#### 示例：上游 nameserver

在这个示例中，集群管理员不希望显式地强制所有非集群 DNS 查询进入到他们自己的 nameserver 172.16.0.1。 而且这很容易实现：他们只需要创建一个 ConfigMap，`upstreamNameservers` 字段指定期望的 nameserver 即可。

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

<!--

## Debugging DNS resolution

### Create a simple Pod to use as a test environment

Create a file named busybox.yaml with the following contents:

{% include code.html language="yaml" file="busybox.yaml" ghlink="/docs/tasks/administer-cluster/busybox.yaml" %}

Then create a pod using this file and verify its status:

-->

## 调试 DNS 解析

### 创建一个简单的 Pod 用作测试环境

创建一个名为 busybox.yaml 的文件，其中包括以下内容：

{% include code.html language="yaml" file="busybox.yaml" ghlink="/docs/tasks/administer-cluster/busybox.yaml" %}

使用该文件创建 Pod 并验证其状态：

```shell
$ kubectl create -f busybox.yaml
pod "busybox" created

$ kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

<!--

Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.

-->

该 Pod 运行后，您可以在它的环境中执行 `nslookup`。如果您看到类似如下的输出，表示 DNS 正在正确工作。

```shell
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

<!--

If the `nslookup` command fails, check the following:

-->

如果 `nslookup` 命令失败，检查如下内容：

<!--

### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Inheriting DNS from the node](#inheriting-dns-from-the-node) and
[Known issues](#known-issues) below for more information)

-->

### 首先检查本地 DNS 配置

查看下 resolv.conf 文件。（参考[集成节点的 DNS](inheriting-dns-from-the-node)和 下面的[已知问题](#known-issues)获取更多信息）

```shell
$ kubectl exec busybox cat /etc/resolv.conf
```

<!--

Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):

-->

验证搜索路径和名称服务器设置如下（请注意，搜索路径可能因不同的云提供商而异）：

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

<!--

Errors such as the following indicate a problem with the kube-dns add-on or
associated Services:

-->

如果看到如下错误表明错误来自 kube-dns 或相关服务：

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

<!--

or

-->

或者

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

<!--

### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.

-->

### 检查 DNS pod 是否在运行

使用 `kubectl get pods` 命令验证 DNS pod 是否正在运行。

```shell
$ kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                    READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y      3/3       Running   0           1h
...
```

<!--

If you see that no pod is running or that the pod has failed/completed, the DNS
add-on may not be deployed by default in your current environment and you will
have to deploy it manually.

-->

如果您看到没有 Pod 运行或者 Pod 处于 失败/完成 状态，DNS 插件可能没有部署到您的当前环境中，您需要手动部署。

<!--

### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS daemons.

-->

### 检查 DNS pod 中的错误

使用 `kubectl logs` 命令查看 DNS 守护进程的日志。

```shell
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c kubedns
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c dnsmasq
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c sidecar
```

<!--

See if there is any suspicious log. Letter '`W`', '`E`', '`F`' at the beginning
represent Warning, Error and Failure. Please search for entries that have these
as the logging level and use
[kubernetes issues](https://github.com/kubernetes/kubernetes/issues)
to report unexpected errors.

-->

看看有没有可疑的日志。以字母“`W`”，“`E`”，“`F`”开头的代表警告、错误和失败。请搜索具有这些日志级别的条目，并使用 [kubernetes issues](https://github.com/kubernetes/kubernetes/issues)来报告意外错误。

<!--

### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.

-->

### DNS 服务启动了吗？

使用 `kubectl get service` 命令验证 DNS 服务是否启动。

```shell
$ kubectl get svc --namespace=kube-system
NAME          CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns      10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

<!--

If you have created the service or in the case it should be created by default
but it does not appear, see
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) for
more information.

-->

如果您已经创建了该服务或它本应该默认创建但没有出现，参考[调试服务](/docs/tasks/debug-application-cluster/debug-service/)获取更多信息。

<!--

### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.

-->

### DNS 端点暴露出来了吗？

您可以使用`kubectl get endpoints`命令验证 DNS 端点是否被暴露。

```shell
$ kubectl get ep kube-dns --namespace=kube-system
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

<!--

If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.

-->

如果您没有看到端点，查看[调试服务](/docs/tasks/debug-application-cluster/debug-service/)文档中的端点部分。

获取更多的 Kubernetes DNS 示例，请参考 Kubernetes GitHub 仓库中的[cluster-dns示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。

<!--

## Known issues

Kubernetes installs do not configure the nodes' resolv.conf files to use the
cluster DNS by default, because that process is inherently distro-specific.
This should probably be implemented eventually.

Linux's libc is impossibly stuck ([see this bug from
2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253)) with limits of just
3 DNS `nameserver` records and 6 DNS `search` records.  Kubernetes needs to
consume 1 `nameserver` record and 3 `search` records.  This means that if a
local installation already uses 3 `nameserver`s or uses more than 3 `search`es,
some of those settings will be lost.  As a partial workaround, the node can run
`dnsmasq` which will provide more `nameserver` entries, but not more `search`
entries.  You can also use kubelet's `--resolv-conf` flag.

If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.

-->

## 已知问题

Kubernetes安装时不会将节点的 resolv.conf 文件配置为默认使用集群 DNS，因为该过程本身是特定于发行版的。这一步应该放到最后实现。

Linux 的 libc 不可思议的卡住（[查看该2005起暴出来的bug](https://bugzilla.redhat.com/show_bug.cgi?id=168253)）限制只能有 3 个 DNS `nameserver` 记录和 6 个 DNS `search` 记录。Kubernetes 需要消耗 1 个 `nameserver` 记录和 3 个 `search` 记录。这意味着如果本地安装已经使用 3 个 `nameserver` 或使用 3 个以上的 `search` 记录，那么其中一些设置将会丢失。有个部分解决该问题的方法，就是节点可以运行 `dnsmasq`，它将提供更多的 `nameserver` 条目，但不会有更多的 `search` 条目。您也可以使用 kubelet 的 `--resolv-conf` 标志。

如果您使用的是 Alpine 3.3 或更低版本作为基础映像，由于已知的 Alpine 问题，DNS 可能无法正常工作。点击[这里](https://github.com/kubernetes/kubernetes/issues/30215)查看更多信息。

<!--

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site Kubernetes
installations. This required some minor (backward-compatible) changes to the
way the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/concepts/cluster-administration/federation/)
for more details on Cluster Federation and multi-site support.

-->

## Kubernetes 集群联邦（多可用区支持）

Kubernetes 1.3 版本起引入了支持多站点 Kubernetes 安装的集群联邦支持。这需要对 Kubernetes 集群 DNS 服务器处理 DNS 查询的方式进行一些小的（向后兼容的）更改，以便于查找联邦服务（跨多个 Kubernetes 集群）。有关集群联邦和多站点支持的更多详细信息，请参阅[集群联邦管理员指南](/docs/concepts/cluster-administration/federation/)。

<!--

## References

- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)

## What's next

- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).

-->

## 参考

- [Service 和 Pod 的 DNS](/docs/concepts/services-networking/dns-pod-service/)
- [DNS 集群插件文档](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)

## 下一步

- [自动扩容集群中的 DNS 服务](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)

{% endcapture %}

{% include templates/task.md %}
