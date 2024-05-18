---
title: Service 与 Pod 的 DNS
content_type: concept
weight: 80
description: >-
  你的工作负载可以使用 DNS 发现集群内的 Service，本页说明具体工作原理。
---
<!--
reviewers:
- jbelamaric
- bowei
- thockin
title: DNS for Services and Pods
content_type: concept
weight: 80
description: >-
  Your workload can discover Services within your cluster using DNS;
  this page explains how that works.
-->

<!-- overview -->

<!--
Kubernetes creates DNS records for Services and Pods. You can contact
Services with consistent DNS names instead of IP addresses.
-->
Kubernetes 为 Service 和 Pod 创建 DNS 记录。
你可以使用一致的 DNS 名称而非 IP 地址访问 Service。

<!-- body -->

<!--
Kubernetes publishes information about Pods and Services which is used
to program DNS.  Kubelet configures Pods' DNS so that running containers
can lookup Services by name rather than IP.
-->
Kubernetes 发布有关 Pod 和 Service 的信息，这些信息被用来对 DNS 进行编程。
Kubelet 配置 Pod 的 DNS，以便运行中的容器可以通过名称而不是 IP 来查找服务。

<!--
Services defined in the cluster are assigned DNS names. By default, a
client Pod's DNS search list includes the Pod's own namespace and the
cluster's default domain. 
-->

集群中定义的 Service 被赋予 DNS 名称。
默认情况下，客户端 Pod 的 DNS 搜索列表会包含 Pod 自身的名字空间和集群的默认域。

<!--
### Namespaces of Services 

A DNS query may return different results based on the namespace of the Pod making 
it. DNS queries that don't specify a namespace are limited to the Pod's 
namespace. Access Services in other namespaces by specifying it in the DNS query. 

For example, consider a Pod in a `test` namespace. A `data` Service is in 
the `prod` namespace. 

A query for `data` returns no results, because it uses the Pod's `test` namespace. 

A query for `data.prod` returns the intended result, because it specifies the 
namespace. 
-->
### Service 的名字空间 {#namespaces-of-services}

DNS 查询可能因为执行查询的 Pod 所在的名字空间而返回不同的结果。
不指定名字空间的 DNS 查询会被限制在 Pod 所在的名字空间内。
要访问其他名字空间中的 Service，需要在 DNS 查询中指定名字空间。

例如，假定名字空间 `test` 中存在一个 Pod，`prod` 名字空间中存在一个服务
`data`。

Pod 查询 `data` 时没有返回结果，因为使用的是 Pod 的名字空间 `test`。

Pod 查询 `data.prod` 时则会返回预期的结果，因为查询中指定了名字空间。

<!--
DNS queries may be expanded using the Pod's `/etc/resolv.conf`. Kubelet 
configures this file for each Pod. For example, a query for just `data` may be 
expanded to `data.test.svc.cluster.local`. The values of the `search` option 
are used to expand queries. To learn more about DNS queries, see 
[the `resolv.conf` manual page.](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html) 
-->
DNS 查询可以使用 Pod 中的 `/etc/resolv.conf` 展开。
Kubelet 为每个 Pod 配置此文件。
例如，对 `data` 的查询可能被展开为 `data.test.svc.cluster.local`。
`search` 选项的取值会被用来展开查询。要进一步了解 DNS 查询，可参阅
[`resolv.conf` 手册页面](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

<!--
In summary, a Pod in the _test_ namespace can successfully resolve either 
`data.prod` or `data.prod.svc.cluster.local`.
-->
概括起来，名字空间 _test_ 中的 Pod 可以成功地解析 `data.prod` 或者
`data.prod.svc.cluster.local`。

<!--
### DNS Records

What objects get DNS records?
-->
### DNS 记录  {#dns-records}

哪些对象会获得 DNS 记录呢？

1. Services
2. Pods

<!--
The following sections detail the supported DNS record types and layout that is
supported.  Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.
For more up-to-date specification, see
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
以下各节详细介绍已支持的 DNS 记录类型和布局。
其它布局、名称或者查询即使碰巧可以工作，也应视为实现细节，
将来很可能被更改而且不会因此发出警告。
有关最新规范请查看
[Kubernetes 基于 DNS 的服务发现](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!--
## Services

### A/AAAA records

"Normal" (not headless) Services are assigned DNS A and/or AAAA records,
depending on the IP family or families of the Service, with a name of the form
`my-svc.my-namespace.svc.cluster-domain.example`.  This resolves to the cluster IP
of the Service.

[Headless Services](/docs/concepts/services-networking/service/#headless-services) 
(without a cluster IP) Services are also assigned DNS A and/or AAAA records,
with a name of the form `my-svc.my-namespace.svc.cluster-domain.example`.  Unlike normal
Services, this resolves to the set of IPs of all of the Pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.
-->
### Service

#### A/AAAA 记录 {#a-aaaa-records}

除了无头 Service 之外的 “普通” Service 会被赋予一个形如 `my-svc.my-namespace.svc.cluster-domain.example`
的 DNS A 和/或 AAAA 记录，取决于 Service 的 IP 协议族（可能有多个）设置。
该名称会解析成对应 Service 的集群 IP。

没有集群 IP 的[无头 Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
也会被赋予一个形如 `my-svc.my-namespace.svc.cluster-domain.example` 的 DNS A 和/或 AAAA 记录。
与普通 Service 不同，这一记录会被解析成对应 Service 所选择的 Pod IP 的集合。
客户端要能够使用这组 IP，或者使用标准的轮转策略从这组 IP 中进行选择。

<!--
### SRV records

SRV Records are created for named ports that are part of normal or headless
services.  For each named port, the SRV record has the form
`_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
For a regular Service, this resolves to the port number and the domain name:
`my-svc.my-namespace.svc.cluster-domain.example`.
For a headless Service, this resolves to multiple answers, one for each Pod
that is backing the Service, and contains the port number and the domain name of the Pod
of the form `hostname.my-svc.my-namespace.svc.cluster-domain.example`.
-->
#### SRV 记录  {#srv-records}

Kubernetes 根据普通 Service 或无头 Service
中的命名端口创建 SRV 记录。每个命名端口，
SRV 记录格式为 `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`。
普通 Service，该记录会被解析成端口号和域名：`my-svc.my-namespace.svc.cluster-domain.example`。
无头 Service，该记录会被解析成多个结果，及该服务的每个后端 Pod 各一个 SRV 记录，
其中包含 Pod 端口号和格式为 `hostname.my-svc.my-namespace.svc.cluster-domain.example`
的域名。

<!--
## Pods-->
## Pod

<!--
### A/AAAA records

Kube-DNS versions, prior to the implementation of the [DNS specification](https://github.com/kubernetes/dns/blob/master/docs/specification.md), had the following DNS resolution:

`pod-ipv4-address.my-namespace.pod.cluster-domain.example`.

For example, if a Pod in the `default` namespace has the IP address 172.17.0.3,
and the domain name for your cluster is `cluster.local`, then the Pod has a DNS name:

`172-17-0-3.default.pod.cluster.local`.

Any Pods exposed by a Service have the following DNS resolution available:

`pod-ipv4-address.service-name.my-namespace.svc.cluster-domain.example`.
-->
### A/AAAA 记录 {#a-aaaa-records}

在实现 [DNS 规范](https://github.com/kubernetes/dns/blob/master/docs/specification.md)之前，
Kube-DNS 版本使用以下 DNS 解析：

`pod-ipv4-address.my-namespace.pod.cluster-domain.example`

例如，对于一个位于 `default` 名字空间，IP 地址为 172.17.0.3 的 Pod，
如果集群的域名为 `cluster.local`，则 Pod 会对应 DNS 名称：

`172-17-0-3.default.pod.cluster.local`

通过 Service 暴露出来的所有 Pod 都会有如下 DNS 解析名称可用：

`pod-ipv4-address.service-name.my-namespace.svc.cluster-domain.example`

<!--
### Pod's hostname and subdomain fields

Currently when a Pod is created, its hostname (as observed from within the Pod)
is the Pod's `metadata.name` value.
-->
### Pod 的 hostname 和 subdomain 字段 {#pod-s-hostname-and-subdomain-fields}

当前，创建 Pod 时其主机名（从 Pod 内部观察）取自 Pod 的 `metadata.name` 值。

<!--
The Pod spec has an optional `hostname` field, which can be used to specify a
different hostname. When specified, it takes precedence over the Pod's name to be
the hostname of the Pod (again, as observed from within the Pod). For example,
given a Pod with `spec.hostname` set to `"my-host"`, the Pod will have its
hostname set to `"my-host"`.
-->

Pod 规约中包含一个可选的 `hostname` 字段，可以用来指定一个不同的主机名。
当这个字段被设置时，它将优先于 Pod 的名字成为该 Pod 的主机名（同样是从 Pod 内部观察）。
举个例子，给定一个 `spec.hostname` 设置为 `“my-host”` 的 Pod，
该 Pod 的主机名将被设置为 `“my-host”`。

<!--
The Pod spec also has an optional `subdomain` field which can be used to indicate
that the pod is part of sub-group of the namespace. For example, a Pod with `spec.hostname`
set to `"foo"`, and `spec.subdomain` set to `"bar"`, in namespace `"my-namespace"`, will
have its hostname set to `"foo"` and its fully qualified domain name (FQDN) set to
`"foo.bar.my-namespace.svc.cluster.local"` (once more, as observed from within
the Pod).
-->

Pod 规约还有一个可选的 `subdomain` 字段，可以用来表明该 Pod 是名字空间的子组的一部分。
举个例子，某 Pod 的 `spec.hostname` 设置为 `“foo”`，`spec.subdomain` 设置为 `“bar”`，
在名字空间 `“my-namespace”` 中，主机名称被设置成 `“foo”` 并且对应的完全限定域名（FQDN）为
“`foo.bar.my-namespace.svc.cluster-domain.example`”（还是从 Pod 内部观察）。

<!--
If there exists a headless Service in the same namespace as the Pod, with
the same name as the subdomain, the cluster's DNS Server also returns A and/or AAAA
records for the Pod's fully qualified hostname.
Example:
-->
如果 Pod 所在的名字空间中存在一个无头服务，其名称与子域相同，
则集群的 DNS 服务器还会为 Pod 的完全限定主机名返回 A 和/或 AAAA 记录。

示例：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: busybox-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # 实际上不需要指定端口号
    port: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

<!--
Given the above Service `"busybox-subdomain"` and the Pods which set `spec.subdomain`
to `"busybox-subdomain"`, the first Pod will see its own FQDN as
`"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`. DNS serves
A and/or AAAA records at that name, pointing to the Pod's IP. Both Pods "`busybox1`" and
"`busybox2`" will have their own address records.
-->
鉴于上述服务 `“busybox-subdomain”` 和将 `spec.subdomain` 设置为 `“busybox-subdomain”` 的 Pod，
第一个 Pod 将看到自己的 FQDN 为 `“busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example”`。
DNS 会为此名字提供一个 A 记录和/或 AAAA 记录，指向该 Pod 的 IP。
Pod “`busybox1`” 和 “`busybox2`” 都将有自己的地址记录。

<!--
An {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}} can specify
the DNS hostname for any endpoint addresses, along with its IP.
-->
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
对象可以为任何端点地址及其 IP 指定 `hostname`。

<!--
Because A and AAAA records are not created for Pod names, `hostname` is required for the Pod's A or AAAA
record to be created. A Pod with no `hostname` but with `subdomain` will only create the
A or AAAA record for the headless Service (`busybox-subdomain.my-namespace.svc.cluster-domain.example`),
pointing to the Pods' IP addresses. Also, the Pod needs to be ready in order to have a
record unless `publishNotReadyAddresses=True` is set on the Service.
-->
{{< note >}}
由于 A 和 AAAA 记录不是基于 Pod 名称创建，因此需要设置了 `hostname` 才会生成 Pod 的 A 或 AAAA 记录。
没有设置 `hostname` 但设置了 `subdomain` 的 Pod 只会为
无头 Service 创建 A 或 AAAA 记录（`busybox-subdomain.my-namespace.svc.cluster-domain.example`）
指向 Pod 的 IP 地址。
另外，除非在服务上设置了 `publishNotReadyAddresses=True`，否则只有 Pod 准备就绪
才会有与之对应的记录。
{{< /note >}}

<!--
### Pod's setHostnameAsFQDN field {#pod-sethostnameasfqdn-field}
-->
### Pod 的 setHostnameAsFQDN 字段  {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
When a Pod is configured to have fully qualified domain name (FQDN), its
hostname is the short hostname. For example, if you have a Pod with the fully
qualified domain name `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`, 
then by default the `hostname` command inside that Pod returns `busybox-1` and  the
`hostname --fqdn` command returns the FQDN.

When you set `setHostnameAsFQDN: true` in the Pod spec, the kubelet writes the Pod's FQDN into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn` return the Pod's FQDN.
-->
当 Pod 配置为具有全限定域名 (FQDN) 时，其主机名是短主机名。
例如，如果你有一个具有完全限定域名 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example` 的 Pod，
则默认情况下，该 Pod 内的 `hostname` 命令返回 `busybox-1`，而 `hostname --fqdn` 命令返回 FQDN。

当你在 Pod 规约中设置了 `setHostnameAsFQDN: true` 时，kubelet 会将 Pod
的全限定域名（FQDN）作为该 Pod 的主机名记录到 Pod 所在名字空间。
在这种情况下，`hostname` 和 `hostname --fqdn` 都会返回 Pod 的全限定域名。

{{< note >}}
<!--
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start. The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating error events, such as Failed to construct FQDN from Pod hostname and cluster domain, FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested). One way of improving user experience for this scenario is to create an [admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) to control FQDN size when users create top level objects, for example, Deployment.
-->
在 Linux 中，内核的主机名字段（`struct utsname` 的 `nodename` 字段）限定最多 64 个字符。

如果 Pod 启用这一特性，而其 FQDN 超出 64 字符，Pod 的启动会失败。
Pod 会一直出于 `Pending` 状态（通过 `kubectl` 所看到的 `ContainerCreating`），
并产生错误事件，例如
"Failed to construct FQDN from Pod hostname and cluster domain, FQDN
`long-FQDN` is too long (64 characters is the max, 70 characters requested)."
（无法基于 Pod 主机名和集群域名构造 FQDN，FQDN `long-FQDN` 过长，至多 64 个字符，请求字符数为 70）。
对于这种场景而言，改善用户体验的一种方式是创建一个
[准入 Webhook 控制器](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)，
在用户创建顶层对象（如 Deployment）的时候控制 FQDN 的长度。
{{< /note >}}

<!--
### Pod's DNS Policy

DNS policies can be set on a per-Pod basis. Currently Kubernetes supports the
following Pod-specific DNS policies. These policies are specified in the
`dnsPolicy` field of a Pod Spec.

- "`Default`": The Pod inherits the name resolution configuration from the node
  that the Pods run on.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers)
  for more details.
- "`ClusterFirst`": Any DNS query that does not match the configured cluster
  domain suffix, such as "`www.kubernetes.io`", is forwarded to an upstream
  nameserver by the DNS server. Cluster administrators may have extra
  stub-domain and upstream DNS servers configured.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers)
  for details on how DNS queries are handled in those cases.
- "`ClusterFirstWithHostNet`": For Pods running with hostNetwork, you should
  explicitly set its DNS policy to "`ClusterFirstWithHostNet`". Otherwise, Pods
  running with hostNetwork and `"ClusterFirst"` will fallback to the behavior
  of the `"Default"` policy.
  - Note: This is not supported on Windows. See [below](#dns-windows) for details
- "`None`": It allows a Pod to ignore DNS settings from the Kubernetes
  environment. All DNS settings are supposed to be provided using the
  `dnsConfig` field in the Pod Spec.
  See [Pod's DNS config](#pod-dns-config) subsection below.
-->
### Pod 的 DNS 策略    {#pod-s-dns-policy}

DNS 策略可以逐个 Pod 来设定。目前 Kubernetes 支持以下特定 Pod 的 DNS 策略。
这些策略可以在 Pod 规约中的 `dnsPolicy` 字段设置：

- "`Default`": Pod 从运行所在的节点继承名称解析配置。
  参考[相关讨论](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)获取更多信息。
- "`ClusterFirst`": 与配置的集群域后缀不匹配的任何 DNS 查询（例如 "www.kubernetes.io"）
  都会由 DNS 服务器转发到上游名称服务器。集群管理员可能配置了额外的存根域和上游 DNS 服务器。
  参阅[相关讨论](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)
  了解在这些场景中如何处理 DNS 查询的信息。
- "`ClusterFirstWithHostNet`": 对于以 hostNetwork 方式运行的 Pod，应将其 DNS 策略显式设置为
  "`ClusterFirstWithHostNet`"。否则，以 hostNetwork 方式和 `"ClusterFirst"` 策略运行的
  Pod 将会做出回退至 `"Default"` 策略的行为。
  - 注意：这在 Windows 上不支持。 有关详细信息，请参见[下文](#dns-windows)。
- "`None`": 此设置允许 Pod 忽略 Kubernetes 环境中的 DNS 设置。Pod 会使用其 `dnsConfig`
  字段所提供的 DNS 设置。
  参见 [Pod 的 DNS 配置](#pod-dns-config)节。

{{< note >}}
<!--
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then "ClusterFirst" is used.
-->
"Default" 不是默认的 DNS 策略。如果未明确指定 `dnsPolicy`，则使用 "ClusterFirst"。
{{< /note >}}

<!--
The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.
-->
下面的示例显示了一个 Pod，其 DNS 策略设置为 "`ClusterFirstWithHostNet`"，
因为它已将 `hostNetwork` 设置为 `true`。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

<!--
### Pod's DNS Config {#pod-dns-config}
-->
### Pod 的 DNS 配置  {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

<!--
Pod's DNS Config allows users more control on the DNS settings for a Pod.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:
-->
Pod 的 DNS 配置可让用户对 Pod 的 DNS 设置进行更多控制。

`dnsConfig` 字段是可选的，它可以与任何 `dnsPolicy` 设置一起使用。
但是，当 Pod 的 `dnsPolicy` 设置为 "`None`" 时，必须指定 `dnsConfig` 字段。

用户可以在 `dnsConfig` 字段中指定以下属性：

<!--
- `nameservers`: a list of IP addresses that will be used as DNS servers for the
  Pod. There can be at most 3 IP addresses specified. When the Pod's `dnsPolicy`
  is set to "`None`", the list must contain at least one IP address, otherwise
  this property is optional.
  The servers listed will be combined to the base nameservers generated from the
  specified DNS policy with duplicate addresses removed.
- `searches`: a list of DNS search domains for hostname lookup in the Pod.
  This property is optional. When specified, the provided list will be merged
  into the base search domain names generated from the chosen DNS policy.
  Duplicate domain names are removed.
  Kubernetes allows up to 32 search domains.
- `options`: an optional list of objects where each object may have a `name`
  property (required) and a `value` property (optional). The contents in this
  property will be merged to the options generated from the specified DNS policy.
  Duplicate entries are removed.
-->

- `nameservers`：将用作于 Pod 的 DNS 服务器的 IP 地址列表。
  最多可以指定 3 个 IP 地址。当 Pod 的 `dnsPolicy` 设置为 "`None`" 时，
  列表必须至少包含一个 IP 地址，否则此属性是可选的。
  所列出的服务器将合并到从指定的 DNS 策略生成的基本名称服务器，并删除重复的地址。

- `searches`：用于在 Pod 中查找主机名的 DNS 搜索域的列表。此属性是可选的。
  指定此属性时，所提供的列表将合并到根据所选 DNS 策略生成的基本搜索域名中。
  重复的域名将被删除。Kubernetes 最多允许 32 个搜索域。

- `options`：可选的对象列表，其中每个对象可能具有 `name` 属性（必需）和 `value` 属性（可选）。
  此属性中的内容将合并到从指定的 DNS 策略生成的选项。
  重复的条目将被删除。

<!--
The following is an example Pod with custom DNS settings:
-->
以下是具有自定义 DNS 设置的 Pod 示例：

{{% code_sample file="service/networking/custom-dns.yaml" %}}

<!--
When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:
-->
创建上面的 Pod 后，容器 `test` 会在其 `/etc/resolv.conf` 文件中获取以下内容：

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

<!--
For IPv6 setup, search path and name server should be set up like this:
-->
对于 IPv6 设置，搜索路径和名称服务器应按以下方式设置：

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

<!--
The output is similar to this:
-->
输出类似于：

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

<!--
## DNS search domain list limits
-->
## DNS 搜索域列表限制  {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

<!--
Kubernetes itself does not limit the DNS Config until the length of the search
domain list exceeds 32 or the total length of all search domains exceeds 2048.
This limit applies to the node's resolver configuration file, the Pod's DNS
Config, and the merged DNS Config respectively.
-->
Kubernetes 本身不限制 DNS 配置，最多可支持 32 个搜索域列表，所有搜索域的总长度不超过 2048。
此限制分别适用于节点的解析器配置文件、Pod 的 DNS 配置和合并的 DNS 配置。

{{< note >}}
<!--
Some container runtimes of earlier versions may have their own restrictions on
the number of DNS search domains. Depending on the container runtime
environment, the pods with a large number of DNS search domains may get stuck in
the pending state.

It is known that containerd v1.5.5 or earlier and CRI-O v1.21 or earlier have
this problem.
-->
早期版本的某些容器运行时可能对 DNS 搜索域的数量有自己的限制。
根据容器运行环境，那些具有大量 DNS 搜索域的 Pod 可能会卡在 Pending 状态。

众所周知 containerd v1.5.5 或更早版本和 CRI-O v1.21 或更早版本都有这个问题。
{{< /note >}}

<!--
## DNS resolution on Windows nodes {#dns-windows}

- ClusterFirstWithHostNet is not supported for Pods that run on Windows nodes.
  Windows treats all names with a `.` as a FQDN and skips FQDN resolution.
- On Windows, there are multiple DNS resolvers that can be used. As these come with
  slightly different behaviors, using the
  [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  powershell cmdlet for name query resolutions is recommended.
- On Linux, you have a DNS suffix list, which is used after resolution of a name as fully
  qualified has failed.
  On Windows, you can only have 1 DNS suffix, which is the DNS suffix associated with that
  Pod's namespace (example: `mydns.svc.cluster.local`). Windows can resolve FQDNs, Services,
  or network name which can be resolved with this single suffix. For example, a Pod spawned
  in the `default` namespace, will have the DNS suffix `default.svc.cluster.local`.
  Inside a Windows Pod, you can resolve both `kubernetes.default.svc.cluster.local`
  and `kubernetes`, but not the partially qualified names (`kubernetes.default` or
  `kubernetes.default.svc`).
-->
## Windows 节点上的 DNS 解析 {#dns-windows}

- 在 Windows 节点上运行的 Pod 不支持 ClusterFirstWithHostNet。
  Windows 将所有带有 `.` 的名称视为全限定域名（FQDN）并跳过全限定域名（FQDN）解析。
- 在 Windows 上，可以使用的 DNS 解析器有很多。
  由于这些解析器彼此之间会有轻微的行为差别，建议使用
  [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  powershell cmdlet 进行名称查询解析。
- 在 Linux 上，有一个 DNS 后缀列表，当解析全名失败时可以使用。
  在 Windows 上，你只能有一个 DNS 后缀，
  即与该 Pod 的命名空间相关联的 DNS 后缀（例如：`mydns.svc.cluster.local`）。
  Windows 可以解析全限定域名（FQDN），和使用了该 DNS 后缀的 Services 或者网络名称。
  例如，在 `default` 命名空间中生成一个 Pod，该 Pod 会获得的 DNS 后缀为 `default.svc.cluster.local`。
  在 Windows 的 Pod 中，你可以解析 `kubernetes.default.svc.cluster.local` 和 `kubernetes`，
  但是不能解析部分限定名称（`kubernetes.default` 和 `kubernetes.default.svc`）。

## {{% heading "whatsnext" %}}

<!--
For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)
-->
有关管理 DNS 配置的指导，
请查看[配置 DNS 服务](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/)

