---
title: Pod 与 Service 的 DNS
content_type: concept
weight: 20
---
<!-- overview -->

<!--
This page provides an overview of DNS support by Kubernetes.
-->
本页面提供 Kubernetes 对 DNS 的支持的概述。

<!-- body -->

<!--
## Introduction

Kubernetes DNS schedules a DNS Pod and Service on the cluster, and configures
the kubelets to tell individual containers to use the DNS Service's IP to
resolve DNS names.
-->
## 介绍

Kubernetes DNS 在群集上调度 DNS Pod 和服务，并配置 kubelet 以告知各个容器使用 DNS 服务的 IP 来解析 DNS 名称。

<!--
### What things get DNS names?

Every Service defined in the cluster (including the DNS server itself) is
assigned a DNS name.  By default, a client Pod's DNS search list will
include the Pod's own namespace and the cluster's default domain.  This is best
illustrated by example:

Assume a Service named `foo` in the Kubernetes namespace `bar`.  A Pod running
in namespace `bar` can look up this service by simply doing a DNS query for
`foo`.  A Pod running in namespace `quux` can look up this service by doing a
DNS query for `foo.bar`.

The following sections detail the supported record types and layout that is
supported.  Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.
For more up-to-date specification, see
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
## 哪些对象会有 DNS 名字?     {#what-things-get-dns-names}

在集群中定义的每个 Service（包括 DNS 服务器自身）都会被指派一个 DNS 名称。
默认，一个客户端 Pod 的 DNS 搜索列表将包含该 Pod 自己的名字空间和集群默认域。
如下示例是一个很好的说明：

假设在 Kubernetes 集群的名字空间 `bar` 中，定义了一个服务 `foo`。
运行在名字空间 `bar` 中的 Pod 可以简单地通过 DNS 查询 `foo` 来找到该服务。
运行在名字空间 `quux` 中的 Pod 可以通过 DNS 查询 `foo.bar` 找到该服务。

以下各节详细介绍了受支持的记录类型和支持的布局。
其它布局、名称或者查询即使碰巧可以工作，也应视为实现细节，
将来很可能被更改而且不会因此出现警告。
有关最新规范请查看
[Kubernetes 基于 DNS 的服务发现](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!--
## Services

### A/AAAA records

"Normal" (not headless) Services are assigned a DNS A or AAAA record for a name of the
form `my-svc.my-namespace.svc.cluster-domain.example`.  This resolves to the cluster IP
of the Service.

"Headless" (without a cluster IP) Services are also assigned a DNS A record for
a name of the form `my-svc.my-namespace.svc.cluster-domain.example`.  Unlike normal
Services, this resolves to the set of IPs of the pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.
-->
### 服务  {#services}

#### A/AAAA 记录

“普通” 服务（除了无头服务）会以 `my-svc.my-namespace.svc.cluster-domain.example`
这种名字的形式被分配一个 DNS A 或 AAAA 记录，取决于服务的 IP 协议族。
该名称会解析成对应服务的集群 IP。

“无头（Headless）” 服务（没有集群 IP）也会以
`my-svc.my-namespace.svc.cluster-domain.example` 这种名字的形式被指派一个 DNS A 或 AAAA 记录，
具体取决于服务的 IP 协议族。
与普通服务不同，这一记录会被解析成对应服务所选择的 Pod 集合的 IP。
客户端要能够使用这组 IP，或者使用标准的轮转策略从这组 IP 中进行选择。

<!--
### SRV records

SRV Records are created for named ports that are part of normal or [Headless
Services](/docs/concepts/services-networking/service/#headless-services).
For each named port, the SRV record would have the form
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
For a regular service, this resolves to the port number and the domain name:
`my-svc.my-namespace.svc.cluster-domain.example`.
For a headless service, this resolves to multiple answers, one for each pod
that is backing the service, and contains the port number and the domain name of the pod
of the form `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`.
-->
#### SRV 记录  {#srv-records}

Kubernetes 会为命名端口创建 SRV 记录，这些端口是普通服务或
[无头服务](/zh/docs/concepts/services-networking/service/#headless-services)的一部分。
对每个命名端口，SRV 记录具有 `_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example` 这种形式。
对普通服务，该记录会被解析成端口号和域名：`my-svc.my-namespace.svc.cluster-domain.example`。
对无头服务，该记录会被解析成多个结果，服务对应的每个后端 Pod 各一个；
其中包含 Pod 端口号和形为 `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`
的域名。

## Pods

<!--
### A/AAAA records

In general a pod has the following DNS resolution:

`pod-ip-address.my-namespace.pod.cluster-domain.example`.

For example, if a pod in the `default` namespace has the IP address 172.17.0.3,
and the domain name for your cluster is `cluster.local`, then the Pod has a DNS name:

`172-17-0-3.default.pod.cluster.local`.

Any pods created by a Deployment or DaemonSet exposed by a Service have the
following DNS resolution available:

`pod-ip-address.deployment-name.my-namespace.svc.cluster-domain.example`.
-->
### A/AAAA 记录

一般而言，Pod 会对应如下 DNS 名字解析：

`pod-ip-address.my-namespace.pod.cluster-domain.example`

例如，对于一个位于 `default` 名字空间，IP 地址为 172.17.0.3 的 Pod，
如果集群的域名为 `cluster.local`，则 Pod 会对应 DNS 名称：

`172-17-0-3.default.pod.cluster.local`.

Deployment 或通过 Service 暴露出来的 DaemonSet 所创建的 Pod 会有如下 DNS
解析名称可用：

`pod-ip-address.deployment-name.my-namespace.svc.cluster-domain.example`.

<!--
### Pod's hostname and subdomain fields

Currently when a pod is created, its hostname is the Pod's `metadata.name` value.

The Pod spec has an optional `hostname` field, which can be used to specify the
Pod's hostname. When specified, it takes precedence over the Pod's name to be
the hostname of the pod. For example, given a Pod with `hostname` set to
"`my-host`", the Pod will have its hostname set to "`my-host`".

The Pod spec also has an optional `subdomain` field which can be used to specify
its subdomain. For example, a Pod with `hostname` set to "`foo`", and `subdomain`
set to "`bar`", in namespace "`my-namespace`", will have the fully qualified
domain name (FQDN) "`foo.bar.my-namespace.svc.cluster-domain.example`".

Example:
-->
### Pod 的 hostname 和 subdomain 字段

当前，创建 Pod 时其主机名取自 Pod 的 `metadata.name` 值。

Pod 规约中包含一个可选的 `hostname` 字段，可以用来指定 Pod 的主机名。
当这个字段被设置时，它将优先于 Pod 的名字成为该 Pod 的主机名。
举个例子，给定一个 `hostname` 设置为 "`my-host`" 的 Pod，
该 Pod 的主机名将被设置为 "`my-host`"。

Pod 规约还有一个可选的 `subdomain` 字段，可以用来指定 Pod 的子域名。
举个例子，某 Pod 的 `hostname` 设置为 “`foo`”，`subdomain` 设置为 “`bar`”，
在名字空间 “`my-namespace`” 中对应的完全限定域名（FQDN）为
“`foo.bar.my-namespace.svc.cluster-domain.example`”。

示例：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # 实际上不需要指定端口号
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
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
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

<!--
If there exists a headless service in the same namespace as the pod and with
the same name as the subdomain, the cluster's DNS Server also returns an A or AAAA
record for the Pod's fully qualified hostname.
For example, given a Pod with the hostname set to "`busybox-1`" and the subdomain set to
"`default-subdomain`", and a headless Service named "`default-subdomain`" in
the same namespace, the pod will see its own FQDN as
"`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`". DNS serves an
A or AAAA record at that name, pointing to the Pod's IP. Both pods "`busybox1`" and
"`busybox2`" can have their distinct A or AAAA records.
-->
如果某无头服务与某 Pod 在同一个名字空间中，且它们具有相同的子域名，
集群的 DNS 服务器也会为该 Pod 的全限定主机名返回 A 记录或 AAAA 记录。
例如，在同一个名字空间中，给定一个主机名为 “busybox-1”、
子域名设置为 “default-subdomain” 的 Pod，和一个名称为 “`default-subdomain`”
的无头服务，Pod 将看到自己的 FQDN 为
"`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`"。
DNS 会为此名字提供一个 A 记录或 AAAA 记录，指向该 Pod 的 IP。
“`busybox1`” 和 “`busybox2`” 这两个 Pod 分别具有它们自己的 A 或 AAAA 记录。

<!--
The Endpoints object can specify the `hostname` for any endpoint addresses,
along with its IP.
-->
Endpoints 对象可以为任何端点地址及其 IP 指定 `hostname`。

<!--
Because A records are not created for Pod names, `hostname` is required for the Pod's A
record to be created. A Pod with no `hostname` but with `subdomain` will only create the
A record for the headless service (`default-subdomain.my-namespace.svc.cluster-domain.example`),
pointing to the Pod's IP address. Also, Pod needs to become ready in order to have a
record unless `publishNotReadyAddresses=True` is set on the Service.
-->
{{< note >}}
因为没有为 Pod 名称创建 A 记录或 AAAA 记录，所以要创建 Pod 的 A 记录
或 AAAA 记录需要 `hostname`。

没有设置 `hostname` 但设置了 `subdomain` 的 Pod 只会为
无头服务创建 A 或 AAAA 记录（`default-subdomain.my-namespace.svc.cluster-domain.example`）
指向 Pod 的 IP 地址。
另外，除非在服务上设置了 `publishNotReadyAddresses=True`，否则只有 Pod 进入就绪状态
才会有与之对应的记录。
{{< /note >}}

<!--
### Pod's setHostnameAsFQDN field {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}
-->
### Pod 的 setHostnameAsFQDN 字段  {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
When a Pod is configured to have fully qualified domain name (FQDN), its hostname is the short hostname. For example, if you have a Pod with the fully qualified domain name `busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`, then by default the `hostname` command inside that Pod returns `busybox-1` and  the `hostname -fqdn` command returns the FQDN.
-->
**前置条件**：`SetHostnameAsFQDN`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
必须在 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}
上启用。

当你在 Pod 规约中设置了 `setHostnameAsFQDN: true` 时，kubelet 会将 Pod
的全限定域名（FQDN）作为该 Pod 的主机名记录到 Pod 所在名字空间。
在这种情况下，`hostname` 和 `hostname --fqdn` 都会返回 Pod 的全限定域名。

{{< note >}}
<!--
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start. The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating error events, such as Failed to construct FQDN from pod hostname and cluster domain, FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested). One way of improving user experience for this scenario is to create an [admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) to control FQDN size when users create top level objects, for example, Deployment.
-->
在 Linux 中，内核的主机名字段（`struct utsname` 的 `nodename` 字段）限定
最多 64 个字符。

如果 Pod 启用这一特性，而其 FQDN 超出 64 字符，Pod 的启动会失败。
Pod 会一直出于 `Pending` 状态（通过 `kubectl` 所看到的 `ContainerCreating`），
并产生错误事件，例如 
"Failed to construct FQDN from pod hostname and cluster domain, FQDN
`long-FQDN` is too long (64 characters is the max, 70 characters requested)."
（无法基于 Pod 主机名和集群域名构造 FQDN，FQDN `long-FQDN` 过长，至多 64
字符，请求字符数为 70）。
对于这种场景而言，改善用户体验的一种方式是创建一个
[准入 Webhook 控制器](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)，
在用户创建顶层对象（如 Deployment）的时候控制 FQDN 的长度。
{{< /note >}}

<!--
### Pod's DNS Policy

DNS policies can be set on a per-pod basis. Currently Kubernetes supports the
following pod-specific DNS policies. These policies are specified in the
`dnsPolicy` field of a Pod Spec.

- "`Default`": The Pod inherits the name resolution configuration from the node
  that the pods run on.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)
  for more details.
- "`ClusterFirst`": Any DNS query that does not match the configured cluster
  domain suffix, such as "`www.kubernetes.io`", is forwarded to the upstream
  nameserver inherited from the node. Cluster administrators may have extra
  stub-domain and upstream DNS servers configured.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods)
  for details on how DNS queries are handled in those cases.
- "`ClusterFirstWithHostNet`": For Pods running with hostNetwork, you should
  explicitly set its DNS policy "`ClusterFirstWithHostNet`".
- "`None`": It allows a Pod to ignore DNS settings from the Kubernetes
  environment. All DNS settings are supposed to be provided using the
  `dnsConfig` field in the Pod Spec.
  See [Pod's DNS config](#pod-s-dns-config) subsection below.
-->
### Pod 的 DNS 策略    {#pod-s-dns-policy}

DNS 策略可以逐个 Pod 来设定。目前 Kubernetes 支持以下特定 Pod 的 DNS 策略。
这些策略可以在 Pod 规约中的 `dnsPolicy` 字段设置：

- "`Default`": Pod 从运行所在的节点继承名称解析配置。参考
  [相关讨论](/zh/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)
  获取更多信息。
- "`ClusterFirst`": 与配置的集群域后缀不匹配的任何 DNS 查询（例如 "www.kubernetes.io"）
  都将转发到从节点继承的上游名称服务器。集群管理员可能配置了额外的存根域和上游 DNS 服务器。
  参阅[相关讨论](/zh/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods)
  了解在这些场景中如何处理 DNS 查询的信息。
- "`ClusterFirstWithHostNet`"：对于以 hostNetwork 方式运行的 Pod，应显式设置其 DNS 策略
  "`ClusterFirstWithHostNet`"。
- "`None`": 此设置允许 Pod 忽略 Kubernetes 环境中的 DNS 设置。Pod 会使用其 `dnsConfig` 字段
  所提供的 DNS 设置。
  参见 [Pod 的 DNS 配置](#pod-dns-config)节。

<!--
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then "ClusterFirst" is used.
-->
{{< note >}}
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
### Pod's DNS Config

Pod's DNS Config allows users more control on the DNS settings for a Pod.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:
-->
### Pod 的 DNS 配置  {#pod-dns-config}

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
  Kubernetes allows for at most 6 search domains.
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
  重复的域名将被删除。Kubernetes 最多允许 6 个搜索域。

- `options`：可选的对象列表，其中每个对象可能具有 `name` 属性（必需）和 `value` 属性（可选）。
  此属性中的内容将合并到从指定的 DNS 策略生成的选项。
  重复的条目将被删除。

<!--
The following is an example Pod with custom DNS settings:
-->
以下是具有自定义 DNS 设置的 Pod 示例：

{{< codenew file="service/networking/custom-dns.yaml" >}}

<!--
When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:
-->
创建上面的 Pod 后，容器 `test` 会在其 `/etc/resolv.conf` 文件中获取以下内容：

```
nameserver 1.2.3.4
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

<!--
For IPv6 setup, search path and name server should be setup like this:
-->
对于 IPv6 设置，搜索路径和名称服务器应按以下方式设置：

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

<!--
The output is similar to this:
-->
输出类似于

```
nameserver fd00:79:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

<!--
### Feature availability

The availability of Pod DNS Config and DNS Policy "`None`" is shown as below.
-->
### 功能的可用性

Pod DNS 配置和 DNS 策略 "`None`" 的可用版本对应如下所示。

| k8s 版本 | 特性支持 |
| :---------: |:-----------:|
| 1.14 | 稳定 |
| 1.10 | Beta（默认启用） |
| 1.9 | Alpha |

## {{% heading "whatsnext" %}}

<!--
For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)
-->
有关管理 DNS 配置的指导，请查看
[配置 DNS 服务](/zh/docs/tasks/administer-cluster/dns-custom-nameservers/)

