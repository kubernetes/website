---
title: Service 與 Pod 的 DNS
content_type: concept
weight: 80
description: >-
  你的工作負載可以使用 DNS 發現叢集內的 Service，本頁說明具體工作原理。
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
Kubernetes 爲 Service 和 Pod 創建 DNS 記錄。
你可以使用穩定的 DNS 名稱而非 IP 地址訪問 Service。

<!-- body -->

<!--
Kubernetes publishes information about Pods and Services which is used
to program DNS. kubelet configures Pods' DNS so that running containers
can look up Services by name rather than IP.
-->
Kubernetes 發佈有關 Pod 和 Service 的資訊，用於設定 DNS。
kubelet 設定 Pod 的 DNS，使運行中的容器可以通過名稱而非 IP 查找 Service。

<!--
Services defined in the cluster are assigned DNS names. By default, a
client Pod's DNS search list includes the Pod's own namespace and the
cluster's default domain.
-->

叢集中定義的 Service 被賦予 DNS 名稱。
預設情況下，客戶端 Pod 的 DNS 搜索列表包括 Pod 所在的命名空間和叢集的預設域名。

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
### Service 的命名空間 {#namespaces-of-services}

DNS 查詢可能因爲執行查詢的 Pod 所在的命名空間而返回不同的結果。
不指定命名空間的 DNS 查詢會被限制在 Pod 所在的命名空間內。
要訪問其他命名空間中的 Service，需要在 DNS 查詢中指定命名空間。

例如，假定命名空間 `test` 中存在一個 Pod，`prod` 命名空間中存在一個服務 `data`。

Pod 查詢 `data` 時沒有返回結果，因爲使用的是 Pod 所在的 `test` 命名空間。

Pod 查詢 `data.prod` 時則會返回預期的結果，因爲查詢中指定了命名空間。

<!--
DNS queries may be expanded using the Pod's `/etc/resolv.conf`. kubelet
configures this file for each Pod. For example, a query for just `data` may be
expanded to `data.test.svc.cluster.local`. The values of the `search` option
are used to expand queries. To learn more about DNS queries, see
[the `resolv.conf` manual page.](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html).
-->
DNS 查詢可以使用 Pod 中的 `/etc/resolv.conf` 展開。
Kubelet 爲每個 Pod 設定此檔案。
例如，對 `data` 的查詢可能被擴展爲 `data.test.svc.cluster.local`。
`search` 選項的值用於擴展查詢。要進一步瞭解 DNS 查詢，可參閱
[`resolv.conf` 手冊頁面](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

<!--
In summary, a Pod in the _test_ namespace can successfully resolve either
`data.prod` or `data.prod.svc.cluster.local`.
-->
概括起來，命名空間 **test** 中的 Pod 可以成功地解析 `data.prod` 或者
`data.prod.svc.cluster.local`。

<!--
### DNS Records

What objects get DNS records?

1. Services
1. Pods

-->
### DNS 記錄  {#dns-records}

哪些對象會獲得 DNS 記錄呢？

1. Service
2. Pod

<!--
The following sections detail the supported DNS record types and layout that is
supported. Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.
For more up-to-date specification, see
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
以下各節詳細介紹已支持的 DNS 記錄類型和佈局。
其它佈局、名稱或者查詢即使碰巧可以工作，也應視爲實現細節，
將來很可能被更改而且不會因此發出警告。
有關最新規範請查看
[Kubernetes 基於 DNS 的服務發現](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!--
## Services

### A/AAAA records

"Normal" (not headless) Services are assigned DNS A and/or AAAA records,
depending on the IP family or families of the Service, with a name of the form
`my-svc.my-namespace.svc.cluster-domain.example`.  This resolves to the cluster IP
of the Service.

[Headless Services](/docs/concepts/services-networking/service/#headless-services)
(without a cluster IP) are also assigned DNS A and/or AAAA records,
with a name of the form `my-svc.my-namespace.svc.cluster-domain.example`. Unlike normal
Services, this resolves to the set of IPs of all of the Pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.
-->
### Service

#### A/AAAA 記錄 {#a-aaaa-records}

除了無頭 Service 之外的“普通” Service 會被賦予一個形如 `my-svc.my-namespace.svc.cluster-domain.example`
的 DNS A 和/或 AAAA 記錄，取決於 Service 的 IP 協議族（可能有多個）設置。
該名稱會解析成對應 Service 的叢集 IP。

沒有叢集 IP 的[無頭 Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
也會被賦予一個形如 `my-svc.my-namespace.svc.cluster-domain.example` 的 DNS A 和/或 AAAA 記錄。
與普通 Service 不同，這一記錄會被解析成對應 Service 所選擇的 Pod IP 的集合。
客戶端要能夠使用這組 IP，或者使用標準的輪轉策略從這組 IP 中進行選擇。

<!--
### SRV records

SRV Records are created for named ports that are part of normal or headless
services.

- For each named port, the SRV record has the form
  `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
- For a regular Service, this resolves to the port number and the domain name:
  `my-svc.my-namespace.svc.cluster-domain.example`.
- For a headless Service, this resolves to multiple answers, one for each Pod
  that is backing the Service, and contains the port number and the domain name of the Pod
  of the form `hostname.my-svc.my-namespace.svc.cluster-domain.example`.
-->
#### SRV 記錄  {#srv-records}

Kubernetes 根據普通 Service 或無頭 Service 中的命名端口創建 SRV 記錄。

- 每個命名端口，SRV 記錄的格式：`_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`。
- 對於普通 Service，該記錄會被解析成端口號和域名：`my-svc.my-namespace.svc.cluster-domain.example`。
- 對於無頭 Service，該記錄會被解析成多個結果，即該 Service 的每個後端 Pod 各一個 SRV 記錄，
  其中包含 Pod 端口號和域名，格式爲：`hostname.my-svc.my-namespace.svc.cluster-domain.example`。

<!--
## Pods
-->
## Pod

<!--
### A/AAAA records

Kube-DNS versions, prior to the implementation of the
[DNS specification](https://github.com/kubernetes/dns/blob/master/docs/specification.md),
had the following DNS resolution:
-->
### A/AAAA 記錄 {#a-aaaa-records}

在實現 [DNS 規範](https://github.com/kubernetes/dns/blob/master/docs/specification.md)之前，
Kube-DNS 版本使用以下 DNS 解析：

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

<!--
For example, if a Pod in the `default` namespace has the IP address 172.17.0.3,
and the domain name for your cluster is `cluster.local`, then the Pod has a DNS name:
-->
例如，對於一個位於 `default` 命名空間，IP 地址爲 172.17.0.3 的 Pod，
如果叢集的域名爲 `cluster.local`，則 Pod 會對應 DNS 名稱：

```
172-17-0-3.default.pod.cluster.local
```

<!--
Some cluster DNS mechanisms, like [CoreDNS](https://coredns.io/), also provide `A` records for:
-->
一些叢集 DNS 機制（如 [CoreDNS](https://coredns.io/)）還會爲以下內容提供 `A` 記錄：

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

<!--
For example, if a Pod in the `cafe` namespace has the IP address 172.17.0.3,
is an endpoint of a Service named `barista`, and the domain name for your cluster is
`cluster.local`, then the Pod would have this service-scoped DNS `A` record.
-->
例如，如果 `cafe` 命名空間中的一個 Pod 擁有 IP 地址
172.17.0.3（是名爲 `barista` 的服務的端點），
並且叢集的域名是 `cluster.local`，
那麼此 Pod 將擁有這樣的服務範圍的 DNS A 記錄：

```
172-17-0-3.barista.cafe.svc.cluster.local
```

<!--
### Pod's hostname and subdomain fields {#pod-hostname-and-subdomain-field}

Currently when a Pod is created, its hostname (as observed from within the Pod)
is the Pod's `metadata.name` value.
-->
### Pod 的 hostname 和 subdomain 字段     {#pod-hostname-and-subdomain-field}

當前，創建 Pod 時其主機名（從 Pod 內部觀察）取自 Pod 的 `metadata.name` 值。

<!--
The Pod spec has an optional `hostname` field, which can be used to specify a
different hostname. When specified, it takes precedence over the Pod's name to be
the hostname of the Pod (again, as observed from within the Pod). For example,
given a Pod with `spec.hostname` set to `"my-host"`, the Pod will have its
hostname set to `"my-host"`.
-->

Pod 規約中包含一個可選的 `hostname` 字段，可以用來指定一個不同的主機名。
當這個字段被設置時，它將優先於 Pod 的名字成爲該 Pod 的主機名（同樣是從 Pod 內部觀察）。
舉個例子，給定一個 `spec.hostname` 設置爲 `“my-host”` 的 Pod，
該 Pod 的主機名將被設置爲 `“my-host”`。

<!--
The Pod spec also has an optional `subdomain` field which can be used to indicate
that the pod is part of sub-group of the namespace. For example, a Pod with `spec.hostname`
set to `"foo"`, and `spec.subdomain` set to `"bar"`, in namespace `"my-namespace"`, will
have its hostname set to `"foo"` and its fully qualified domain name (FQDN) set to
`"foo.bar.my-namespace.svc.cluster.local"` (once more, as observed from within
the Pod).
-->

Pod 規約還有一個可選的 `subdomain` 字段，可以用來表明該 Pod 屬於命名空間的一個子組。
例如，某 Pod 的 `spec.hostname` 設置爲 `“foo”`，`spec.subdomain` 設置爲 `“bar”`，
在命名空間 `“my-namespace”` 中，主機名稱被設置成 `“foo”` 並且對應的完全限定域名（FQDN）爲
“`foo.bar.my-namespace.svc.cluster-domain.example`”（還是從 Pod 內部觀察）。

<!--
If there exists a headless Service in the same namespace as the Pod, with
the same name as the subdomain, the cluster's DNS Server also returns A and/or AAAA
records for the Pod's fully qualified hostname.
Example:
-->
如果 Pod 所在的命名空間中存在一個無頭 Service，其名稱與子域相同，
則叢集的 DNS 伺服器還會爲 Pod 的完全限定主機名返回 A 和/或 AAAA 記錄。

示例：

<!--
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
  - name: foo # name is not required for single-port Services
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
-->
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
  - name: foo # 單個端口的 service 可以不指定 name
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
鑑於上述 `"busybox-subdomain"` Service 和將 `spec.subdomain` 設置爲 `"busybox-subdomain"` 的 Pod，
第一個 Pod 將看到自己的 FQDN 爲 `"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`。
DNS 會爲此名字提供一個 A 記錄和/或 AAAA 記錄，指向該 Pod 的 IP。
Pod “`busybox1`” 和 “`busybox2`” 都將有自己的地址記錄。

<!--
An {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}} can specify
the DNS hostname for any endpoint addresses, along with its IP.
-->
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
對象可以爲任何端點地址及其 IP 指定 `hostname`。

{{< note >}}
<!--
A and AAAA records are not created for Pod names since `hostname` is missing for the Pod.
A Pod with no `hostname` but with `subdomain` will only create the
A or AAAA record for the headless Service (`busybox-subdomain.my-namespace.svc.cluster-domain.example`),
pointing to the Pods' IP addresses. Also, the Pod needs to be ready in order to have a
record unless `publishNotReadyAddresses=True` is set on the Service.
-->
由於 Pod 缺少 `hostname`，所以沒有爲這些 Pod 名稱創建 A 和 AAAA 記錄。
沒有設置 `hostname` 但設置了 `subdomain` 的 Pod 只會爲
無頭 Service 創建 A 或 AAAA 記錄（`busybox-subdomain.my-namespace.svc.cluster-domain.example`）
指向 Pod 的 IP 地址。
另外，除非在服務上設置了 `publishNotReadyAddresses=True`，否則只有 Pod 準備就緒
纔會有與之對應的記錄。
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
then by default the `hostname` command inside that Pod returns `busybox-1` and the
`hostname --fqdn` command returns the FQDN.

When you set `setHostnameAsFQDN: true` in the Pod spec, the kubelet writes the Pod's FQDN into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn` return the Pod's FQDN.
-->
當 Pod 設定爲具有全限定域名（FQDN）時，其主機名是短主機名。
例如，如果你有一個具有完全限定域名 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example` 的 Pod，
則預設情況下，該 Pod 內的 `hostname` 命令返回 `busybox-1`，而 `hostname --fqdn` 命令返回 FQDN。

當你在 Pod 規約中設置了 `setHostnameAsFQDN: true` 時，kubelet 會將 Pod
的全限定域名（FQDN）作爲該 Pod 的主機名記錄到 Pod 所在命名空間。
在這種情況下，`hostname` 和 `hostname --fqdn` 都會返回 Pod 的全限定域名。

{{< note >}}
<!--
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start.
The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating
error events, such as Failed to construct FQDN from Pod hostname and cluster domain,
FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested).
One way of improving user experience for this scenario is to create an
[admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
to control FQDN size when users create top level objects, for example, Deployment.
-->
在 Linux 中，內核的主機名字段（`struct utsname` 的 `nodename` 字段）限定最多 64 個字符。

如果 Pod 啓用這一特性，而其 FQDN 超出 64 字符，Pod 的啓動會失敗。
Pod 會一直出於 `Pending` 狀態（通過 `kubectl` 所看到的 `ContainerCreating`），
併產生錯誤事件，例如
"Failed to construct FQDN from Pod hostname and cluster domain, FQDN
`long-FQDN` is too long (64 characters is the max, 70 characters requested)."
（無法基於 Pod 主機名和叢集域名構造 FQDN，FQDN `long-FQDN` 過長，至多 64 個字符，請求字符數爲 70）。
對於這種場景而言，改善使用者體驗的一種方式是創建一個
[准入 Webhook 控制器](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)，
在使用者創建頂層對象（如 Deployment）的時候控制 FQDN 的長度。
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

  {{< note >}}
  This is not supported on Windows. See [below](#dns-windows) for details.
  {{< /note >}}

- "`None`": It allows a Pod to ignore DNS settings from the Kubernetes
  environment. All DNS settings are supposed to be provided using the
  `dnsConfig` field in the Pod Spec.
  See [Pod's DNS config](#pod-dns-config) subsection below.
-->
### Pod 的 DNS 策略    {#pod-s-dns-policy}

DNS 策略可以逐個 Pod 來設定。目前 Kubernetes 支持以下特定 Pod 的 DNS 策略。
這些策略可以在 Pod 規約中的 `dnsPolicy` 字段設置：

- "`Default`": Pod 從運行所在的節點繼承域名解析設定。
  參考[相關討論](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)獲取更多資訊。
- "`ClusterFirst`": 與設定的叢集域後綴不匹配的任何 DNS 查詢（例如 "www.kubernetes.io"）
  都會由 DNS 伺服器轉發到上游域名伺服器。叢集管理員可能設定了額外的存根域和上游 DNS 伺服器。
  參閱[相關討論](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)
  瞭解在這些場景中如何處理 DNS 查詢的資訊。
- "`ClusterFirstWithHostNet`": 對於以 hostNetwork 方式運行的 Pod，應將其 DNS 策略顯式設置爲
  "`ClusterFirstWithHostNet`"。否則，以 hostNetwork 方式和 `"ClusterFirst"` 策略運行的
  Pod 將會做出回退至 `"Default"` 策略的行爲。

  {{< note >}}
  這在 Windows 上不支持。有關詳細資訊，請參見[下文](#dns-windows)。
  {{< /note >}}

- "`None`": 此設置允許 Pod 忽略 Kubernetes 環境中的 DNS 設置。Pod 會使用其 `dnsConfig`
  字段所提供的 DNS 設置。
  參見 [Pod 的 DNS 設定](#pod-dns-config)節。

{{< note >}}
<!--
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then "ClusterFirst" is used.
-->
"Default" 不是預設的 DNS 策略。如果未明確指定 `dnsPolicy`，則使用 "ClusterFirst"。
{{< /note >}}

<!--
The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.
-->
下面的示例顯示了一個 Pod，其 DNS 策略設置爲 "`ClusterFirstWithHostNet`"，
因爲它已將 `hostNetwork` 設置爲 `true`。

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
### Pod 的 DNS 設定  {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

<!--
Pod's DNS Config allows users more control on the DNS settings for a Pod.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:
-->
Pod 的 DNS 設定可讓使用者對 Pod 的 DNS 設置進行更多控制。

`dnsConfig` 字段是可選的，它可以與任何 `dnsPolicy` 設置一起使用。
但是，當 Pod 的 `dnsPolicy` 設置爲 "`None`" 時，必須指定 `dnsConfig` 字段。

使用者可以在 `dnsConfig` 字段中指定以下屬性：

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

- `nameservers`：將用作於 Pod 的 DNS 伺服器的 IP 地址列表。
  最多可以指定 3 個 IP 地址。當 Pod 的 `dnsPolicy` 設置爲 "`None`" 時，
  列表必須至少包含一個 IP 地址，否則此屬性是可選的。
  所列出的伺服器將合併到從指定的 DNS 策略生成的基本域名伺服器，並刪除重複的地址。

- `searches`：用於在 Pod 中查找主機名的 DNS 搜索域的列表。此屬性是可選的。
  指定此屬性時，所提供的列表將合併到根據所選 DNS 策略生成的基本搜索域名中。
  重複的域名將被刪除。Kubernetes 最多允許 32 個搜索域。

- `options`：可選的對象列表，其中每個對象可能具有 `name` 屬性（必需）和 `value` 屬性（可選）。
  此屬性中的內容將合併到從指定的 DNS 策略生成的選項。
  重複的條目將被刪除。

<!--
The following is an example Pod with custom DNS settings:
-->
以下是具有自定義 DNS 設置的 Pod 示例：

{{% code_sample file="service/networking/custom-dns.yaml" %}}

<!--
When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:
-->
創建上面的 Pod 後，容器 `test` 會在其 `/etc/resolv.conf` 檔案中獲取以下內容：

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

<!--
For IPv6 setup, search path and name server should be set up like this:
-->
對於 IPv6 設置，搜索路徑和名稱伺服器應按以下方式設置：

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

<!--
The output is similar to this:
-->
輸出類似於：

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
Kubernetes 本身不限制 DNS 設定，最多可支持 32 個搜索域列表，所有搜索域的總長度不超過 2048。
此限制分別適用於節點的解析器設定檔案、Pod 的 DNS 設定和合並的 DNS 設定。

{{< note >}}
<!--
Some container runtimes of earlier versions may have their own restrictions on
the number of DNS search domains. Depending on the container runtime
environment, the pods with a large number of DNS search domains may get stuck in
the pending state.

It is known that containerd v1.5.5 or earlier and CRI-O v1.21 or earlier have
this problem.
-->
早期版本的某些容器運行時可能對 DNS 搜索域的數量有自己的限制。
根據容器運行環境，那些具有大量 DNS 搜索域的 Pod 可能會卡在 Pending 狀態。

衆所周知 containerd v1.5.5 或更早版本和 CRI-O v1.21 或更早版本都有這個問題。
{{< /note >}}

<!--
## DNS resolution on Windows nodes {#dns-windows}

- `ClusterFirstWithHostNet` is not supported for Pods that run on Windows nodes.
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
## Windows 節點上的 DNS 解析 {#dns-windows}

- 在 Windows 節點上運行的 Pod 不支持 `ClusterFirstWithHostNet`。
  Windows 將所有帶有 `.` 的名稱視爲全限定域名（FQDN）並跳過全限定域名（FQDN）解析。
- 在 Windows 上，可以使用的 DNS 解析器有很多。
  由於這些解析器彼此之間會有輕微的行爲差別，建議使用
  [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  powershell cmdlet 進行名稱查詢解析。
- 在 Linux 上，有一個 DNS 後綴列表，當解析全名失敗時可以使用。
  在 Windows 上，你只能有一個 DNS 後綴，
  即與該 Pod 的命名空間相關聯的 DNS 後綴（例如：`mydns.svc.cluster.local`）。
  Windows 可以解析全限定域名（FQDN），和使用了該 DNS 後綴的 Services 或者網路名稱。
  例如，在 `default` 命名空間中生成一個 Pod，該 Pod 會獲得的 DNS 後綴爲 `default.svc.cluster.local`。
  在 Windows 的 Pod 中，你可以解析 `kubernetes.default.svc.cluster.local` 和 `kubernetes`，
  但是不能解析部分限定名稱（`kubernetes.default` 和 `kubernetes.default.svc`）。

## {{% heading "whatsnext" %}}

<!--
For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)
-->
有關管理 DNS 設定的指導，
請查看[設定 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/)。
