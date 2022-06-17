---
title: Pod 與 Service 的 DNS
content_type: concept
weight: 20
---
<!--
reviewers:
- davidopp
- thockin
title: DNS for Services and Pods
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
Kubernetes creates DNS records for Services and Pods. You can contact
Services with consistent DNS names instead of IP addresses.
-->
Kubernetes 為 Service 和 Pod 建立 DNS 記錄。
你可以使用一致的 DNS 名稱而非 IP 地址訪問 Service。

<!-- body -->

<!--
## Introduction

Kubernetes DNS schedules a DNS Pod and Service on the cluster, and configures
the kubelets to tell individual containers to use the DNS Service's IP to
resolve DNS names.
-->
## 介紹 {#introduction}

Kubernetes DNS 除了在叢集上排程 DNS Pod 和 Service，
還配置 kubelet 以告知各個容器使用 DNS Service 的 IP 來解析 DNS 名稱。

<!--
Every Service defined in the cluster (including the DNS server itself) is
assigned a DNS name. By default, a client Pod's DNS search list includes the 
Pod's own namespace and the cluster's default domain. 
-->
叢集中定義的每個 Service （包括 DNS 伺服器自身）都被賦予一個 DNS 名稱。
預設情況下，客戶端 Pod 的 DNS 搜尋列表會包含 Pod 自身的名字空間和叢集的預設域。

<!--
### Namespaces of Services 

A DNS query may return different results based on the namespace of the Pod making 
it. DNS queries that don't specify a namespace are limited to the Pod's 
namespace. Access Services in other namespaces by specifying it in the DNS query. 

For example, consider a Pod in a `test` namespace. A `data` service is in 
the `prod` namespace. 

A query for `data` returns no results, because it uses the Pod's `test` namespace. 

A query for `data.prod` returns the intended result, because it specifies the 
namespace. 
-->
### Service 的名字空間 {#namespaces-of-services}

DNS 查詢可能因為執行查詢的 Pod 所在的名字空間而返回不同的結果。
不指定名字空間的 DNS 查詢會被限制在 Pod 所在的名字空間內。
要訪問其他名字空間中的 Service，需要在 DNS 查詢中指定名字空間。

例如，假定名字空間 `test` 中存在一個 Pod，`prod` 名字空間中存在一個服務
`data`。

Pod 查詢 `data` 時沒有返回結果，因為使用的是 Pod 的名字空間 `test`。

Pod 查詢 `data.prod` 時則會返回預期的結果，因為查詢中指定了名字空間。

<!--
DNS queries may be expanded using the Pod's `/etc/resolv.conf`. Kubelet 
sets this file for each Pod. For example, a query for just `data` may be 
expanded to `data.test.svc.cluster.local`. The values of the `search` option 
are used to expand queries. To learn more about DNS queries, see 
[the `resolv.conf` manual page.](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html) 
-->
DNS 查詢可以使用 Pod 中的 `/etc/resolv.conf` 展開。kubelet 會為每個 Pod
生成此檔案。例如，對 `data` 的查詢可能被展開為 `data.test.svc.cluster.local`。
`search` 選項的取值會被用來展開查詢。要進一步瞭解 DNS 查詢，可參閱
[`resolv.conf` 手冊頁面](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

<!--
In summary, a Pod in the `test` namespace can successfully resolve either 
`data.prod` or `data.prod.svc.cluster.local`.
-->
概括起來，名字空間 `test` 中的 Pod 可以成功地解析 `data.prod` 或者
`data.prod.svc.cluster.local`。

<!--
### DNS Records

What objects get DNS records?
-->
### DNS 記錄  {#dns-records}

哪些物件會獲得 DNS 記錄呢？

1. Services
2. Pods

<!--
The following sections detail the supported DNS record types and layout that is
supported.  Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.
For more up-to-date specification, see
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
以下各節詳細介紹已支援的 DNS 記錄型別和佈局。
其它佈局、名稱或者查詢即使碰巧可以工作，也應視為實現細節，
將來很可能被更改而且不會因此發出警告。
有關最新規範請檢視
[Kubernetes 基於 DNS 的服務發現](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!--
## Services

### A/AAAA records

"Normal" (not headless) Services are assigned a DNS A or AAAA record,
depending on the IP family of the Service, for a name of the form
`my-svc.my-namespace.svc.cluster-domain.example`.  This resolves to the cluster IP
of the Service.

"Headless" (without a cluster IP) Services are also assigned a DNS A or AAAA record,
depending on the IP family of the Service, for a name of the form
`my-svc.my-namespace.svc.cluster-domain.example`.  Unlike normal
Services, this resolves to the set of IPs of the Pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.
-->
### Services 

#### A/AAAA 記錄 {#a-aaaa-records}

“普通” Service（除了無頭 Service）會以 `my-svc.my-namespace.svc.cluster-domain.example`
這種名字的形式被分配一個 DNS A 或 AAAA 記錄，取決於 Service 的 IP 協議族。
該名稱會解析成對應 Service 的叢集 IP。

“無頭（Headless）” Service （沒有叢集 IP）也會以
`my-svc.my-namespace.svc.cluster-domain.example` 這種名字的形式被指派一個 DNS A 或 AAAA 記錄，
具體取決於 Service 的 IP 協議族。
與普通 Service 不同，這一記錄會被解析成對應 Service 所選擇的 Pod IP 的集合。
客戶端要能夠使用這組 IP，或者使用標準的輪轉策略從這組 IP 中進行選擇。

<!--
### SRV records

SRV Records are created for named ports that are part of normal or [Headless
Services](/docs/concepts/services-networking/service/#headless-services).
For each named port, the SRV record would have the form
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
For a regular Service, this resolves to the port number and the domain name:
`my-svc.my-namespace.svc.cluster-domain.example`.
For a headless Service, this resolves to multiple answers, one for each Pod
that is backing the Service, and contains the port number and the domain name of the Pod
of the form `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`.
-->
#### SRV 記錄  {#srv-records}

Kubernetes 根據普通 Service 或
[Headless Service](/zh-cn/docs/concepts/services-networking/service/#headless-services)
中的命名埠建立 SRV 記錄。每個命名埠，
SRV 記錄格式為 `_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example`。
普通 Service，該記錄會被解析成埠號和域名：`my-svc.my-namespace.svc.cluster-domain.example`。
無頭 Service，該記錄會被解析成多個結果，及該服務的每個後端 Pod 各一個 SRV 記錄，
其中包含 Pod 埠號和格式為 `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`
的域名。

## Pods

<!--
### A/AAAA records

In general a Pod has the following DNS resolution:

`pod-ip-address.my-namespace.pod.cluster-domain.example`.

For example, if a Pod in the `default` namespace has the IP address 172.17.0.3,
and the domain name for your cluster is `cluster.local`, then the Pod has a DNS name:

`172-17-0-3.default.pod.cluster.local`.

Any Pods exposed by a Service have the following DNS resolution available:

`pod-ip-address.service-name.my-namespace.svc.cluster-domain.example`.
-->
### A/AAAA 記錄 {#a-aaaa-records}

一般而言，Pod 會對應如下 DNS 名字解析：

`pod-ip-address.my-namespace.pod.cluster-domain.example`

例如，對於一個位於 `default` 名字空間，IP 地址為 172.17.0.3 的 Pod，
如果叢集的域名為 `cluster.local`，則 Pod 會對應 DNS 名稱：

`172-17-0-3.default.pod.cluster.local`.

透過 Service 暴露出來的所有 Pod 都會有如下 DNS 解析名稱可用：

`pod-ip-address.service-name.my-namespace.svc.cluster-domain.example`.

<!--
### Pod's hostname and subdomain fields

Currently when a Pod is created, its hostname is the Pod's `metadata.name` value.

The Pod spec has an optional `hostname` field, which can be used to specify the
Pod's hostname. When specified, it takes precedence over the Pod's name to be
the hostname of the Pod. For example, given a Pod with `hostname` set to
"`my-host`", the Pod will have its hostname set to "`my-host`".

The Pod spec also has an optional `subdomain` field which can be used to specify
its subdomain. For example, a Pod with `hostname` set to "`foo`", and `subdomain`
set to "`bar`", in namespace "`my-namespace`", will have the fully qualified
domain name (FQDN) "`foo.bar.my-namespace.svc.cluster-domain.example`".

Example:
-->
### Pod 的 hostname 和 subdomain 欄位 {#pod-s-hostname-and-subdomain-fields}

當前，建立 Pod 時其主機名取自 Pod 的 `metadata.name` 值。

Pod 規約中包含一個可選的 `hostname` 欄位，可以用來指定 Pod 的主機名。
當這個欄位被設定時，它將優先於 Pod 的名字成為該 Pod 的主機名。
舉個例子，給定一個 `hostname` 設定為 "`my-host`" 的 Pod，
該 Pod 的主機名將被設定為 "`my-host`"。

Pod 規約還有一個可選的 `subdomain` 欄位，可以用來指定 Pod 的子域名。
舉個例子，某 Pod 的 `hostname` 設定為 “`foo`”，`subdomain` 設定為 “`bar`”，
在名字空間 “`my-namespace`” 中對應的完全限定域名（FQDN）為
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
  - name: foo # 實際上不需要指定埠號
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
If there exists a headless Service in the same namespace as the Pod and with
the same name as the subdomain, the cluster's DNS Server also returns an A or AAAA
record for the Pod's fully qualified hostname.
For example, given a Pod with the hostname set to "`busybox-1`" and the subdomain set to
"`default-subdomain`", and a headless Service named "`default-subdomain`" in
the same namespace, the Pod will see its own FQDN as
"`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`". DNS serves an
A or AAAA record at that name, pointing to the Pod's IP. Both Pods "`busybox1`" and
"`busybox2`" can have their distinct A or AAAA records.
-->
如果某無頭 Service 與某 Pod 在同一個名字空間中，且它們具有相同的子域名，
叢集的 DNS 伺服器也會為該 Pod 的全限定主機名返回 A 記錄或 AAAA 記錄。
例如，在同一個名字空間中，給定一個主機名為 “busybox-1”、
子域名設定為 “default-subdomain” 的 Pod，和一個名稱為 “`default-subdomain`”
的無頭 Service，Pod 將看到自己的 FQDN 為
"`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`"。
DNS 會為此名字提供一個 A 記錄或 AAAA 記錄，指向該 Pod 的 IP。
“`busybox1`” 和 “`busybox2`” 這兩個 Pod 分別具有它們自己的 A 或 AAAA 記錄。

<!--
The Endpoints object can specify the `hostname` for any endpoint addresses,
along with its IP.
-->
Endpoints 物件可以為任何端點地址及其 IP 指定 `hostname`。

<!--
Because A or AAAA records are not created for Pod names, `hostname` is required for the Pod's A or AAAA
record to be created. A Pod with no `hostname` but with `subdomain` will only create the
A or AAAA record for the headless Service (`default-subdomain.my-namespace.svc.cluster-domain.example`),
pointing to the Pod's IP address. Also, Pod needs to become ready in order to have a
record unless `publishNotReadyAddresses=True` is set on the Service.
-->
{{< note >}}
由於不是為 Pod 名稱建立 A 或 AAAA 記錄的，因此 Pod 的 A 或 AAAA 需要 `hostname`。
沒有設定 `hostname` 但設定了 `subdomain` 的 Pod 只會為
無頭 Service 建立 A 或 AAAA 記錄（`default-subdomain.my-namespace.svc.cluster-domain.example`）
指向 Pod 的 IP 地址。
另外，除非在服務上設定了 `publishNotReadyAddresses=True`，否則只有 Pod 進入就緒狀態
才會有與之對應的記錄。
{{< /note >}}

<!--
### Pod's setHostnameAsFQDN field {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}
-->
### Pod 的 setHostnameAsFQDN 欄位  {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
When a Pod is configured to have fully qualified domain name (FQDN), its hostname is the short hostname. For example, if you have a Pod with the fully qualified domain name `busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`, then by default the `hostname` command inside that Pod returns `busybox-1` and  the `hostname --fqdn` command returns the FQDN.

When you set `setHostnameAsFQDN: true` in the Pod spec, the kubelet writes the Pod's FQDN into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn` return the Pod's FQDN.
-->
當 Pod 配置為具有全限定域名 (FQDN) 時，其主機名是短主機名。
 例如，如果你有一個具有完全限定域名 `busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example` 的 Pod，
 則預設情況下，該 Pod 內的 `hostname` 命令返回 `busybox-1`，而 `hostname --fqdn` 命令返回 FQDN。

當你在 Pod 規約中設定了 `setHostnameAsFQDN: true` 時，kubelet 會將 Pod
的全限定域名（FQDN）作為該 Pod 的主機名記錄到 Pod 所在名字空間。
在這種情況下，`hostname` 和 `hostname --fqdn` 都會返回 Pod 的全限定域名。

{{< note >}}
<!--
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start. The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating error events, such as Failed to construct FQDN from Pod hostname and cluster domain, FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested). One way of improving user experience for this scenario is to create an [admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) to control FQDN size when users create top level objects, for example, Deployment.
-->
在 Linux 中，核心的主機名欄位（`struct utsname` 的 `nodename` 欄位）限定
最多 64 個字元。

如果 Pod 啟用這一特性，而其 FQDN 超出 64 字元，Pod 的啟動會失敗。
Pod 會一直出於 `Pending` 狀態（透過 `kubectl` 所看到的 `ContainerCreating`），
併產生錯誤事件，例如
"Failed to construct FQDN from Pod hostname and cluster domain, FQDN
`long-FQDN` is too long (64 characters is the max, 70 characters requested)."
（無法基於 Pod 主機名和叢集域名構造 FQDN，FQDN `long-FQDN` 過長，至多 64
字元，請求字元數為 70）。
對於這種場景而言，改善使用者體驗的一種方式是建立一個
[准入 Webhook 控制器](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)，
在使用者建立頂層物件（如 Deployment）的時候控制 FQDN 的長度。
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
  domain suffix, such as "`www.kubernetes.io`", is forwarded to the upstream
  nameserver inherited from the node. Cluster administrators may have extra
  stub-domain and upstream DNS servers configured.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers)
  for details on how DNS queries are handled in those cases.
- "`ClusterFirstWithHostNet`": For Pods running with hostNetwork, you should
  explicitly set its DNS policy "`ClusterFirstWithHostNet`".
  - Note: This is not supported on Windows. See [below](#dns-windows) for details
- "`None`": It allows a Pod to ignore DNS settings from the Kubernetes
  environment. All DNS settings are supposed to be provided using the
  `dnsConfig` field in the Pod Spec.
  See [Pod's DNS config](#pod-dns-config) subsection below.
-->
### Pod 的 DNS 策略    {#pod-s-dns-policy}

DNS 策略可以逐個 Pod 來設定。目前 Kubernetes 支援以下特定 Pod 的 DNS 策略。
這些策略可以在 Pod 規約中的 `dnsPolicy` 欄位設定：

- "`Default`": Pod 從執行所在的節點繼承名稱解析配置。參考
  [相關討論](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)
  獲取更多資訊。
- "`ClusterFirst`": 與配置的叢集域字尾不匹配的任何 DNS 查詢（例如 "www.kubernetes.io"）
  都將轉發到從節點繼承的上游名稱伺服器。叢集管理員可能配置了額外的存根域和上游 DNS 伺服器。
  參閱[相關討論](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers)
  瞭解在這些場景中如何處理 DNS 查詢的資訊。
- "`ClusterFirstWithHostNet`"：對於以 hostNetwork 方式執行的 Pod，應顯式設定其 DNS 策略
  "`ClusterFirstWithHostNet`"。
  - 注意：這在 Windows 上不支援。 有關詳細資訊，請參見[下文](#dns-windows)。
- "`None`": 此設定允許 Pod 忽略 Kubernetes 環境中的 DNS 設定。Pod 會使用其 `dnsConfig` 欄位
  所提供的 DNS 設定。
  參見 [Pod 的 DNS 配置](#pod-dns-config)節。

<!--
"Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then "ClusterFirst" is used.
-->
{{< note >}}
"Default" 不是預設的 DNS 策略。如果未明確指定 `dnsPolicy`，則使用 "ClusterFirst"。
{{< /note >}}

<!--
The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.
-->
下面的示例顯示了一個 Pod，其 DNS 策略設定為 "`ClusterFirstWithHostNet`"，
因為它已將 `hostNetwork` 設定為 `true`。

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

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Pod's DNS Config allows users more control on the DNS settings for a Pod.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:
-->
### Pod 的 DNS 配置  {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Pod 的 DNS 配置可讓使用者對 Pod 的 DNS 設定進行更多控制。

`dnsConfig` 欄位是可選的，它可以與任何 `dnsPolicy` 設定一起使用。
但是，當 Pod 的 `dnsPolicy` 設定為 "`None`" 時，必須指定 `dnsConfig` 欄位。

使用者可以在 `dnsConfig` 欄位中指定以下屬性：

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

- `nameservers`：將用作於 Pod 的 DNS 伺服器的 IP 地址列表。
  最多可以指定 3 個 IP 地址。當 Pod 的 `dnsPolicy` 設定為 "`None`" 時，
  列表必須至少包含一個 IP 地址，否則此屬性是可選的。
  所列出的伺服器將合併到從指定的 DNS 策略生成的基本名稱伺服器，並刪除重複的地址。

- `searches`：用於在 Pod 中查詢主機名的 DNS 搜尋域的列表。此屬性是可選的。
  指定此屬性時，所提供的列表將合併到根據所選 DNS 策略生成的基本搜尋域名中。
  重複的域名將被刪除。Kubernetes 最多允許 6 個搜尋域。

- `options`：可選的物件列表，其中每個物件可能具有 `name` 屬性（必需）和 `value` 屬性（可選）。
  此屬性中的內容將合併到從指定的 DNS 策略生成的選項。
  重複的條目將被刪除。

<!--
The following is an example Pod with custom DNS settings:
-->
以下是具有自定義 DNS 設定的 Pod 示例：

{{< codenew file="service/networking/custom-dns.yaml" >}}

<!--
When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:
-->
建立上面的 Pod 後，容器 `test` 會在其 `/etc/resolv.conf` 檔案中獲取以下內容：

```
nameserver 1.2.3.4
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

<!--
For IPv6 setup, search path and name server should be setup like this:
-->
對於 IPv6 設定，搜尋路徑和名稱伺服器應按以下方式設定：

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

<!--
The output is similar to this:
-->
輸出類似於：
```
nameserver fd00:79:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

<!--
#### Expanded DNS Configuration

{{< feature-state for_k8s_version="1.22" state="alpha" >}}

By default, for Pod's DNS Config, Kubernetes allows at most 6 search domains and
a list of search domains of up to 256 characters.

If the feature gate `ExpandedDNSConfig` is enabled for the kube-apiserver and
the kubelet, it is allowed for Kubernetes to have at most 32 search domains and
a list of search domains of up to 2048 characters.
-->
#### 擴充套件 DNS 配置  {#expanded-dns-configuration}

{{< feature-state for_k8s_version="1.22" state="alpha" >}}

對於 Pod DNS 配置，Kubernetes 預設允許最多 6 個 搜尋域（ Search Domain） 
以及一個最多 256 個字元的搜尋域列表。

如果啟用 kube-apiserver 和 kubelet 的特性門控 `ExpandedDNSConfig`，Kubernetes 將可以有最多 32 個 
搜尋域以及一個最多 2048 個字元的搜尋域列表。

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
## Windows 節點上的 DNS 解析 {#dns-windows}

- 在 Windows 節點上執行的 Pod 不支援 ClusterFirstWithHostNet。
  Windows 將所有帶有 `.` 的名稱視為全限定域名（FQDN）並跳過全限定域名（FQDN）解析。
- 在 Windows 上，可以使用的 DNS 解析器有很多。
  由於這些解析器彼此之間會有輕微的行為差別，建議使用
  [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  powershell cmdlet 進行名稱查詢解析。
- 在 Linux 上，有一個 DNS 字尾列表，當解析全名失敗時可以使用。
  在 Windows 上，你只能有一個 DNS 字尾，
  即與該 Pod 的名稱空間相關聯的 DNS 字尾（例如：`mydns.svc.cluster.local`）。
  Windows 可以解析全限定域名（FQDN），和使用了該 DNS 字尾的 Services 或者網路名稱。
  例如，在 `default` 名稱空間中生成一個 Pod，該 Pod 會獲得的 DNS 字尾為 `default.svc.cluster.local`。
  在 Windows 的 Pod 中，你可以解析 `kubernetes.default.svc.cluster.local` 和 `kubernetes`，
  但是不能解析部分限定名稱（`kubernetes.default` 和 `kubernetes.default.svc`）。

## {{% heading "whatsnext" %}}

<!--
For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)
-->
有關管理 DNS 配置的指導，請檢視
[配置 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/)

