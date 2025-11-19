---
title: 自定義 DNS 服務
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
本頁說明如何設定 DNS {{< glossary_tooltip text="Pod" term_id="pod" >}}，以及定製叢集中 DNS 解析過程。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
Your cluster must be running the CoreDNS add-on.
-->
你的叢集必須運行 CoreDNS 插件。

{{% version-check %}}

<!-- steps -->

<!-- 
## Introduction

DNS is a built-in Kubernetes service launched automatically
using the _addon manager_ [cluster add-on](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).
-->
## 介紹   {#introduction}

DNS 是使用 **插件管理器**
[叢集插件](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md)自動啓動的 Kubernetes 內置服務。

{{< note >}}
<!--
The CoreDNS Service is named `kube-dns` in the `metadata.name` field.  
The intent is to ensure greater interoperability with workloads that relied on
the legacy `kube-dns` Service name to resolve addresses internal to the cluster.
Using a Service named `kube-dns` abstracts away the implementation detail of
which DNS provider is running behind that common name.
-->
CoreDNS 服務在其 `metadata.name` 字段被命名爲 `kube-dns`。
這是爲了能夠與依靠傳統 `kube-dns` 服務名稱來解析叢集內部地址的工作負載具有更好的互操作性。
使用 `kube-dns` 作爲服務名稱可以抽離共有名稱之後運行的是哪個 DNS 提供程序這一實現細節。
{{< /note >}}

<!--
If you are running CoreDNS as a Deployment, it will typically be exposed as
a Kubernetes Service with a static IP address.
The kubelet passes DNS resolver information to each container with the
`--cluster-dns=<dns-service-ip>` flag.
-->
如果你在使用 Deployment 運行 CoreDNS，則該 Deployment 通常會向外暴露爲一個具有
靜態 IP 地址 Kubernetes 服務。
kubelet 使用 `--cluster-dns=<DNS 服務 IP>` 標誌將 DNS 解析器的信息傳遞給每個容器。

<!-- 
DNS names also need domains. You configure the local domain in the kubelet
with the flag `--cluster-domain=<default-local-domain>`.
-->
DNS 名稱也需要域名。你可在 kubelet 中使用 `--cluster-domain=<默認本地域名>`
標誌設定本地域名。

<!-- 
The DNS server supports forward lookups (A and AAAA records), port lookups (SRV records),
reverse IP address lookups (PTR records), and more. For more information, see
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/).
-->
DNS 伺服器支持正向查找（A 和 AAAA 記錄）、端口發現（SRV 記錄）、反向 IP 地址發現（PTR 記錄）等。
更多信息，請參見 [Service 與 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!-- 
If a Pod's `dnsPolicy` is set to `default`, it inherits the name resolution
configuration from the node that the Pod runs on. The Pod's DNS resolution
should behave the same as the node.
But see [Known issues](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).
-->
如果 Pod 的 `dnsPolicy` 設置爲 `default`，則它將從 Pod 運行所在節點繼承名稱解析設定。
Pod 的 DNS 解析行爲應該與節點相同。
但請參閱[已知問題](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)。

<!-- 
If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Set this flag to "" to prevent Pods from
inheriting DNS. Set it to a valid file path to specify a file other than
`/etc/resolv.conf` for DNS inheritance.
-->
如果你不想這樣做，或者想要爲 Pod 使用其他 DNS 設定，則可以使用 kubelet 的
`--resolv-conf` 標誌。將此標誌設置爲 "" 可以避免 Pod 繼承 DNS。
將其設置爲有別於 `/etc/resolv.conf` 的有效文件路徑可以設定 DNS 繼承不同的設定。

## CoreDNS

<!-- 
CoreDNS is a general-purpose authoritative DNS server that can serve as cluster DNS,
complying with the [DNS specifications](https://github.com/kubernetes/dns/blob/master/docs/specification.md).
-->
CoreDNS 是通用的權威 DNS 伺服器，可以用作叢集 DNS，符合
[DNS 規範](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!-- 
### CoreDNS ConfigMap options 

CoreDNS is a DNS server that is modular and pluggable, with plugins adding new functionalities.
The CoreDNS server can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/),
which is the CoreDNS configuration file. As a cluster administrator, you can modify the
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} for the CoreDNS Corefile to
change how DNS service discovery behaves for that cluster.
-->
### CoreDNS ConfigMap 選項  {#coredns-configmap-options}

CoreDNS 是模塊化且可插拔的 DNS 伺服器，每個插件都爲 CoreDNS 添加了新功能。
可以通過維護 [Corefile](https://coredns.io/2017/07/23/corefile-explained/)，即 CoreDNS 設定文件，
來設定 CoreDNS 伺服器。作爲一個叢集管理員，你可以修改 CoreDNS Corefile 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
以更改 DNS 服務發現針對該叢集的工作方式。

<!-- 
In Kubernetes, CoreDNS is installed with the following default Corefile configuration:
-->
在 Kubernetes 中，CoreDNS 安裝時使用如下默認 Corefile 設定：

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
Corefile 設定包括以下 CoreDNS [插件](https://coredns.io/plugins/)：

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
* [errors](https://coredns.io/plugins/errors/)：錯誤記錄到標準輸出。
* [health](https://coredns.io/plugins/health/)：在 `http://localhost:8080/health` 處提供 CoreDNS 的健康報告。
  在這個擴展語法中，`lameduck` 會使此進程不健康，等待 5 秒後進程被關閉。
* [ready](https://coredns.io/plugins/ready/)：在端口 8181 上提供的一個 HTTP 端點，
  當所有能夠表達自身就緒的插件都已就緒時，在此端點返回 200 OK。
* [kubernetes](https://coredns.io/plugins/kubernetes/)：CoreDNS 將基於服務和 Pod 的 IP 來應答 DNS 查詢。
  你可以在 CoreDNS 網站找到有關此插件的[更多細節](https://coredns.io/plugins/kubernetes/)。

  - 你可以使用 `ttl` 來定製響應的 TTL。默認值是 5 秒鐘。TTL 的最小值可以是 0 秒鐘，
    最大值爲 3600 秒。將 TTL 設置爲 0 可以禁止對 DNS 記錄進行緩存。

  <!-- 
  - The `pods insecure` option is provided for backward compatibility with `kube-dns`.
  - You can use the `pods verified` option, which returns an A record only if there exists a pod
    in the same namespace with a matching IP.
  - The `pods disabled` option can be used if you don't use pod records.
  -->

  - `pods insecure` 選項是爲了與 kube-dns 向後兼容。
  - 你可以使用 `pods verified` 選項，該選項使得僅在相同名字空間中存在具有匹配 IP 的 Pod 時才返回 A 記錄。
  - 如果你不使用 Pod 記錄，則可以使用 `pods disabled` 選項。

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
* [prometheus](https://coredns.io/plugins/prometheus/)：CoreDNS 的度量指標值以
  [Prometheus](https://prometheus.io/) 格式（也稱爲 OpenMetrics）在 `http://localhost:9153/metrics` 上提供。
* [forward](https://coredns.io/plugins/forward/): 不在 Kubernetes 叢集域內的任何查詢都將轉發到預定義的解析器 (/etc/resolv.conf)。
* [cache](https://coredns.io/plugins/cache/)：啓用前端緩存。
* [loop](https://coredns.io/plugins/loop/)：檢測簡單的轉發環，如果發現死循環，則中止 CoreDNS 進程。
* [reload](https://coredns.io/plugins/reload)：允許自動重新加載已更改的 Corefile。
  編輯 ConfigMap 設定後，請等待兩分鐘，以使更改生效。
* [loadbalance](https://coredns.io/plugins/loadbalance)：這是一個輪轉式 DNS 負載均衡器，
  它在應答中隨機分配 A、AAAA 和 MX 記錄的順序。

<!-- 
You can modify the default CoreDNS behavior by modifying the ConfigMap.
-->
你可以通過修改 ConfigMap 來更改默認的 CoreDNS 行爲。

<!-- 
### Configuration of Stub-domain and upstream nameserver using CoreDNS

CoreDNS has the ability to configure stub-domains and upstream nameservers
using the [forward plugin](https://coredns.io/plugins/forward/).
-->
### 使用 CoreDNS 設定存根域和上游域名伺服器   {#configuration-of-stub-domain-and-upstream-nameserver-using-coredns}

CoreDNS 能夠使用 [forward 插件](https://coredns.io/plugins/forward/)設定存根域和上游域名伺服器。

<!-- 
#### Example

If a cluster operator has a [Consul](https://www.consul.io/) domain server located at "10.150.0.1",
and all Consul names have the suffix ".consul.local". To configure it in CoreDNS,
the cluster administrator creates the following stanza in the CoreDNS ConfigMap.
-->
#### 示例

如果叢集操作員在 "10.150.0.1" 處運行了 [Consul](https://www.consul.io/) 域伺服器，
且所有 Consul 名稱都帶有後綴 `.consul.local`。要在 CoreDNS 中對其進行設定，
叢集管理員可以在 CoreDNS 的 ConfigMap 中創建加入以下字段。

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
要顯式強制所有非叢集 DNS 查找通過特定的域名伺服器（位於 172.16.0.1），可將 `forward`
指向該域名伺服器，而不是 `/etc/resolv.conf`。

```
forward .  172.16.0.1
```

<!-- 
The final ConfigMap along with the default `Corefile` configuration looks like:
-->
最終的包含默認的 `Corefile` 設定的 ConfigMap 如下所示：

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
CoreDNS 不支持 FQDN 作爲存根域和域名伺服器（例如 "ns.foo.com"）。
轉換期間，CoreDNS 設定中將忽略所有的 FQDN 域名伺服器。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
- Read [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/)
-->
- 閱讀[調試 DNS 解析](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/)

