---
title: Pod 与 Service 的 DNS
content_template: templates/concept
weight: 20
---
{{% capture overview %}}

<!--
This page provides an overview of DNS support by Kubernetes.
-->
该页面概述了Kubernetes对DNS的支持。
{{% /capture %}}

{{% capture body %}}

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

## 怎样获取 DNS 名字?

在集群中定义的每个 Service（包括 DNS 服务器自身）都会被指派一个 DNS 名称。
默认，一个客户端 Pod 的 DNS 搜索列表将包含该 Pod 自己的 Namespace 和集群默认域。
通过如下示例可以很好地说明：

假设在 Kubernetes 集群的 Namespace `bar` 中，定义了一个Service `foo`。
运行在Namespace `bar` 中的一个 Pod，可以简单地通过 DNS 查询 `foo` 来找到该 Service。
运行在 Namespace `quux` 中的一个 Pod 可以通过 DNS 查询 `foo.bar` 找到该 Service。

以下各节详细介绍了受支持的记录类型和支持的布局。 其中代码部分的布局，名称或查询命令均被视为实现细节，如有更改，恕不另行通知。
有关最新规范请查看
[Kubernetes 基于 DNS 的服务发现](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## 支持的 DNS 模式

下面各段详细说明支持的记录类型和布局。
如果任何其它的布局、名称或查询，碰巧也能够使用，这就需要研究下它们的实现细节，以免后续修改它们又不能使用了。

<!--
## Services

### A records

"Normal" (not headless) Services are assigned a DNS A record for a name of the
form `my-svc.my-namespace.svc.cluster-domain.example`.  This resolves to the cluster IP
of the Service.

"Headless" (without a cluster IP) Services are also assigned a DNS A record for
a name of the form `my-svc.my-namespace.svc.cluster-domain.example`.  Unlike normal
Services, this resolves to the set of IPs of the pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.
-->

### Service

#### A 记录

“正常” Service（除了 Headless Service）会以 `my-svc.my-namespace.svc.cluster-domain.example` 这种名字的形式被指派一个 DNS A 记录。
这会解析成该 Service 的 Cluster IP。

“Headless” Service（没有Cluster IP）也会以 `my-svc.my-namespace.svc.cluster-domain.example` 这种名字的形式被指派一个 DNS A 记录。
不像正常 Service，它会解析成该 Service 选择的一组 Pod 的 IP。
希望客户端能够使用这一组 IP，否则就使用标准的 round-robin 策略从这一组 IP 中进行选择。

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

#### SRV 记录

命名端口需要创建 SRV 记录，这些端口是正常 Service或 [Headless
Services](/docs/concepts/services-networking/service/#headless-services) 的一部分。
对每个命名端口，SRV 记录具有 `_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example` 这种形式。
对普通 Service，这会被解析成端口号和 CNAME：`my-svc.my-namespace.svc.cluster-domain.example`。
对 Headless Service，这会被解析成多个结果，Service 对应的每个 backend Pod 各一个，
包含 `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example` 这种形式 Pod 的端口号和 CNAME。


## Pods

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

### Pod的 hostname 和 subdomain 字段

当前，创建 Pod 后，它的主机名是该 Pod 的 `metadata.name` 值。

PodSpec 有一个可选的 `hostname` 字段，可以用来指定 Pod 的主机名。当这个字段被设置时，它将优先于 Pod 的名字成为该 Pod 的主机名。举个例子，给定一个 `hostname` 设置为 "`my-host`" 的 Pod，该 Pod 的主机名将被设置为 "`my-host`"。

PodSpec 还有一个可选的 `subdomain` 字段，可以用来指定 Pod 的子域名。举个例子，一个 Pod 的 `hostname` 设置为 “`foo`”，`subdomain` 设置为 “`bar`”，在 namespace “`my-namespace`” 中对应的完全限定域名（FQDN）为 “`foo.bar.my-namespace.svc.cluster-domain.example`”。

实例:
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
  - name: foo # Actually, no port is needed.
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
the same name as the subdomain, the cluster's KubeDNS Server also returns an A
record for the Pod's fully qualified hostname.
For example, given a Pod with the hostname set to "`busybox-1`" and the subdomain set to
"`default-subdomain`", and a headless Service named "`default-subdomain`" in
the same namespace, the pod will see its own FQDN as
"`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`". DNS serves an
A record at that name, pointing to the Pod's IP. Both pods "`busybox1`" and
"`busybox2`" can have their distinct A records.
-->

如果 Headless Service 与 Pod 在同一个 Namespace 中，它们具有相同的子域名，集群的 KubeDNS 服务器也会为该 Pod 的完整合法主机名返回 A 记录。
例如，在同一个 Namespace 中，给定一个主机名为 “busybox-1” 的 Pod，子域名设置为 “default-subdomain”，名称为 “default-subdomain” 的 Headless Service ，Pod 将看到自己的 FQDN 为 “busybox-1.default-subdomain.my-namespace.svc.cluster.local”。
DNS 会为那个名字提供一个 A 记录，指向该 Pod 的 IP。
“busybox1” 和 “busybox2” 这两个 Pod 分别具有它们自己的 A 记录。


<!--
The Endpoints object can specify the `hostname` for any endpoint addresses,
along with its IP.
-->

端点对象可以为任何端点地址及其 IP 指定 `hostname`。

{{< note >}}

<!--
Because A records are not created for Pod names, `hostname` is required for the Pod's A
record to be created. A Pod with no `hostname` but with `subdomain` will only create the
A record for the headless service (`default-subdomain.my-namespace.svc.cluster-domain.example`),
pointing to the Pod's IP address. Also, Pod needs to become ready in order to have a
record unless `publishNotReadyAddresses=True` is set on the Service.
-->

因为没有为 Pod 名称创建A记录，所以要创建 Pod 的 A 记录需要 `hostname` 。

没有 `hostname` 但带有 `subdomain` 的 Pod 只会为指向Pod的IP地址的 headless 服务创建 A 记录(`default-subdomain.my-namespace.svc.cluster-domain.example`)。
另外，除非在服务上设置了 `publishNotReadyAddresses=True`，否则 Pod 需要准备好 A 记录。
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

- "`Default`": Pod从运行所在的节点继承名称解析配置。
  参考 [相关讨论](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) 获取更多信息。
- "`ClusterFirst`": 与配置的群集域后缀不匹配的任何DNS查询(例如 “www.kubernetes.io” )都将转发到从节点继承的上游名称服务器。 群集管理员可能配置了额外的存根域和上游DNS服务器。
  See [相关讨论](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods) 获取如何 DNS 的查询和处理信息的相关资料。
- "`ClusterFirstWithHostNet`": 对于与 hostNetwork 一起运行的 Pod，应显式设置其DNS策略 "`ClusterFirstWithHostNet`"。
- "`None`": 它允许 Pod 忽略 Kubernetes 环境中的 DN S设置。 应该使用 Pod Spec 中的 `dnsConfig` 字段提供所有 DNS 设置。

{{< note >}}

<!--
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then “ClusterFirst” is used.
-->

"Default" 不是默认的 DNS 策略。 如果未明确指定 `dnsPolicy`，则使用 “ClusterFirst”。
{{< /note >}}


<!--
The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.
-->

下面的示例显示了一个Pod，其DNS策略设置为 "`ClusterFirstWithHostNet`"，因为它已将 `hostNetwork` 设置为 `true`。

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

### Pod 的 DNS 设定

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

- `nameservers`: 将用作于 Pod 的 DNS 服务器的 IP 地址列表。最多可以指定3个 IP 地址。 当 Pod 的 `dnsPolicy` 设置为 "`None`" 时，列表必须至少包含一个IP地址，否则此属性是可选的。列出的服务器将合并到从指定的 DNS 策略生成的基本名称服务器，并删除重复的地址。
- `searches`: 用于在 Pod 中查找主机名的 DNS 搜索域的列表。此属性是可选的。指定后，提供的列表将合并到根据所选 DNS 策略生成的基本搜索域名中。
   重复的域名将被删除。
   Kubernetes最多允许6个搜索域。
- `options`: 对象的可选列表，其中每个对象可能具有 `name` 属性（必需）和 `value` 属性（可选）。 此属性中的内容将合并到从指定的 DNS 策略生成的选项。
   重复的条目将被删除。

<!--
The following is an example Pod with custom DNS settings:
-->

以下是具有自定义DNS设置的Pod示例：

{{< codenew file="service/networking/custom-dns.yaml" >}}

<!--
When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:
-->

创建上面的Pod后，容器 `test` 会在其 `/etc/resolv.conf` 文件中获取以下内容：

```
nameserver 1.2.3.4
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```



<!--
For IPv6 setup, search path and name server should be setup like this:
-->
对于IPv6设置，搜索路径和名称服务器应按以下方式设置：

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

<!--
The output is similar to this:
-->
有以下输出：
```shell
nameserver fd00:79:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

<!--
### Feature availability

The availability of Pod DNS Config and DNS Policy "`None`"" is shown as below.
-->

### 可用功能

Pod DNS 配置和 DNS 策略 "`None`" 的版本对应如下所示。

| k8s version | Feature support |
| :---------: |:-----------:|
| 1.14 | Stable |
| 1.10 | Beta (on by default)|
| 1.9 | Alpha |

{{% /capture %}}

{{% capture whatsnext %}}

<!--
For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)
-->

有关管理 DNS 配置的指导，请查看
[配置 DNS 服务](/docs/tasks/administer-cluster/dns-custom-nameservers/)

{{% /capture %}}

