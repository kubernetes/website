---
title: 自定義 DNS 服務
content_type: task
min-kubernetes-server-version: v1.12
---
<!-- 
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_type: task
min-kubernetes-server-version: v1.12
-->

<!-- overview -->
<!-- 
This page explains how to configure your DNS
{{< glossary_tooltip text="Pod(s)" term_id="pod" >}} and customize the
DNS resolution process in your cluster.
-->
本頁說明如何配置 DNS {{< glossary_tooltip text="Pod(s)" term_id="pod" >}}，以及定製叢集中 DNS 解析過程。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- 
Your cluster must be running the CoreDNS add-on.
[Migrating to CoreDNS](/docs/tasks/administer-cluster/coredns/#migrating-to-coredns)
explains how to use `kubeadm` to migrate from `kube-dns`.
-->
你的叢集必須執行 CoreDNS 外掛。
文件[遷移到 CoreDNS](/zh-cn/docs/tasks/administer-cluster/coredns/#migrating-to-coredns)
解釋瞭如何使用 `kubeadm` 從 `kube-dns` 遷移到 CoreDNS。

<!-- steps -->

<!-- 
## Introduction 

DNS is a built-in Kubernetes service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/master/cluster/addons/README.md). 
-->
## 介紹

DNS 是使用[叢集外掛](http://releases.k8s.io/master/cluster/addons/README.md)
管理器自動啟動的內建的 Kubernetes 服務。

<!-- 
As of Kubernetes v1.12, CoreDNS is the recommended DNS Server, replacing kube-dns.  If your cluster
originally used kube-dns, you may still have `kube-dns` deployed rather than CoreDNS.
-->
從 Kubernetes v1.12 開始，CoreDNS 是推薦的 DNS 伺服器，取代了 kube-dns。 如果
你的叢集原來使用 kube-dns，你可能部署的仍然是 `kube-dns` 而不是 CoreDNS。

<!--
The CoreDNS Service is named `kube-dns` in the `metadata.name` field.  
This is so that there is greater interoperability with workloads that relied on the legacy `kube-dns` Service name to resolve addresses internal to the cluster. Using a Service named `kube-dns` abstracts away the implementation detail of which DNS provider is running behind that common name.
-->
{{< note >}}
CoreDNS 服務在其 `metadata.name` 欄位被命名為 `kube-dns`。
這是為了能夠與依靠傳統 `kube-dns` 服務名稱來解析叢集內部地址的工作負載具有更好的互操作性。
使用 `kube-dns` 作為服務名稱可以抽離共有名稱之後執行的是哪個 DNS 提供程式這一實現細節。
{{< /note >}}

<!--
If you are running CoreDNS as a Deployment, it will typically be exposed as a Kubernetes Service with a static IP address.
The kubelet passes DNS resolver information to each container with the `-cluster-dns=<dns-service-ip>` flag.
-->
如果你在使用 Deployment 執行 CoreDNS，則該 Deployment 通常會向外暴露為一個具有
靜態 IP 地址 Kubernetes 服務。
kubelet 使用 `--cluster-dns=<DNS 服務 IP>` 標誌將 DNS 解析器的資訊傳遞給每個容器。

<!-- 
DNS names also need domains. You configure the local domain in the kubelet
with the flag `-cluster-domain=<default-local-domain>`. 
-->
DNS 名稱也需要域名。 你可在 kubelet 中使用 `--cluster-domain=<預設本地域名>`
標誌配置本地域名。

<!-- 
The DNS server supports forward lookups (A and AAAA records), port lookups (SRV records), reverse IP address lookups (PTR records),
and more. For more information, see [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/).
-->
DNS 伺服器支援正向查詢（A 和 AAAA 記錄）、埠發現（SRV 記錄）、反向 IP 地址發現（PTR 記錄）等。
更多資訊，請參見[Pod 和 服務的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!-- 
If a Pod's `dnsPolicy` is set to "`default`", it inherits the name resolution
configuration from the node that the Pod runs on. The Pod's DNS resolution
should behave the same as the node.
But see [Known issues](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues). 
-->
如果 Pod 的 `dnsPolicy` 設定為 "`default`"，則它將從 Pod 執行所在節點繼承名稱解析配置。
Pod 的 DNS 解析行為應該與節點相同。
但請參閱[已知問題](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)。

<!-- 
If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `-resolv-conf` flag.  Set this flag to "" to prevent Pods from
inheriting DNS. Set it to a valid file path to specify a file other than
`/etc/resolv.conf` for DNS inheritance. 
-->
如果你不想這樣做，或者想要為 Pod 使用其他 DNS 配置，則可以
使用 kubelet 的 `--resolv-conf` 標誌。 將此標誌設定為 "" 可以避免 Pod 繼承 DNS。
將其設定為有別於 `/etc/resolv.conf` 的有效檔案路徑可以設定 DNS 繼承不同的配置。

## CoreDNS

<!-- 
CoreDNS is a general-purpose authoritative DNS server that can serve as cluster DNS, complying with the [dns specifications]
(https://github.com/kubernetes/dns/blob/master/docs/specification.md). 
-->
CoreDNS 是通用的權威 DNS 伺服器，可以用作叢集 DNS，符合
[DNS 規範](https://github.com/kubernetes/dns/blob/master/docs/specification.md)。

<!-- 
### CoreDNS ConfigMap options 

CoreDNS is a DNS server that is modular and pluggable, and each plugin adds new functionality to CoreDNS. 
This can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/), which is the CoreDNS
configuration file. A cluster administrator can modify the ConfigMap for the CoreDNS Corefile to change how service discovery works.  
-->
### CoreDNS ConfigMap 選項  {#coredns-configmap-options}

CoreDNS 是模組化且可插拔的 DNS 伺服器，每個外掛都為 CoreDNS 添加了新功能。
可以透過維護 [Corefile](https://coredns.io/2017/07/23/corefile-explained/)，即 CoreDNS 配置檔案，
來定製其行為。 叢集管理員可以修改 CoreDNS Corefile 的 ConfigMap，以更改服務發現的工作方式。

<!-- 
In Kubernetes, CoreDNS is installed with the following default Corefile configuration. 
-->
在 Kubernetes 中，CoreDNS 安裝時使用如下預設 Corefile 配置。

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
Corefile 配置包括以下 CoreDNS [外掛](https://coredns.io/plugins/)：

<!-- 
* [errors](https://coredns.io/plugins/errors/): Errors are logged to stdout.
* [health](https://coredns.io/plugins/health/): Health of CoreDNS is reported to http://localhost:8080/health.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS will reply to DNS queries based on IP of the services and pods of Kubernetes. You can find more details [here](https://coredns.io/plugins/kubernetes/).  
-->
* [errors](https://coredns.io/plugins/errors/)：錯誤記錄到標準輸出。
* [health](https://coredns.io/plugins/health/)：在 http://localhost:8080/health 處提供 CoreDNS 的健康報告。
* [ready](https://coredns.io/plugins/ready/)：在埠 8181 上提供的一個 HTTP 末端，當所有能夠
  表達自身就緒的外掛都已就緒時，在此末端返回 200 OK。
* [kubernetes](https://coredns.io/plugins/kubernetes/)：CoreDNS 將基於 Kubernetes 的服務和 Pod 的
  IP 答覆 DNS 查詢。你可以在 CoreDNS 網站閱讀[更多細節](https://coredns.io/plugins/kubernetes/)。
  你可以使用 `ttl` 來定製響應的 TTL。預設值是 5 秒鐘。TTL 的最小值可以是 0 秒鐘，
  最大值為 3600 秒。將 TTL 設定為 0 可以禁止對 DNS 記錄進行快取。

  <!-- 
  The `pods insecure` option is provided for backward compatibility with kube-dns. You can use the
  `pods verified` option, which returns an A record only if there exists a pod in same namespace
  with matching IP. The `pods disabled` option can be used if you don't use pod records. 
  -->
  `pods insecure` 選項是為了與 kube-dns 向後相容。你可以使用 `pods verified` 選項，該選項使得
  僅在相同名稱空間中存在具有匹配 IP 的 Pod 時才返回 A 記錄。如果你不使用 Pod 記錄，則可以使用
  `pods disabled` 選項。

<!-- 
* [prometheus](https://coredns.io/plugins/prometheus/): Metrics of CoreDNS are available at http://localhost:9153/metrics in [Prometheus](https://prometheus.io/) format.
* [forward](https://coredns.io/plugins/forward/): Any queries that are not within the cluster domain of Kubernetes will be forwarded to predefined resolvers (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): This enables a frontend cache.
* [loop](https://coredns.io/plugins/loop/): Detects simple forwarding loops and halts the CoreDNS process if a loop is found.
* [reload](https://coredns.io/plugins/reload): Allows automatic reload of a changed Corefile. After you edit the ConfigMap configuration, allow two minutes for your changes to take effect.
* [loadbalance](https://coredns.io/plugins/loadbalance): This is a round-robin DNS loadbalancer that randomizes the order of A, AAAA, and MX records in the answer. 
-->
* [prometheus](https://coredns.io/plugins/prometheus/)：CoreDNS 的度量指標值以
  [Prometheus](https://prometheus.io/) 格式在 http://localhost:9153/metrics 上提供。
* [forward](https://coredns.io/plugins/forward/): 不在 Kubernetes 叢集域內的任何查詢都將轉發到
  預定義的解析器 (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/)：啟用前端快取。
* [loop](https://coredns.io/plugins/loop/)：檢測到簡單的轉發環，如果發現死迴圈，則中止 CoreDNS 程序。
* [reload](https://coredns.io/plugins/reload)：允許自動重新載入已更改的 Corefile。
  編輯 ConfigMap 配置後，請等待兩分鐘，以使更改生效。
* [loadbalance](https://coredns.io/plugins/loadbalance)：這是一個輪轉式 DNS 負載均衡器，
  它在應答中隨機分配 A、AAAA 和 MX 記錄的順序。

<!-- 
You can modify the default CoreDNS behavior by modifying the ConfigMap. 
-->
你可以透過修改 ConfigMap 來更改預設的 CoreDNS 行為。

<!-- 
### Configuration of Stub-domain and upstream nameserver using CoreDNS 

CoreDNS has the ability to configure stubdomains and upstream nameservers using the [forward plugin](https://coredns.io/plugins/forward/).
-->
### 使用 CoreDNS 配置存根域和上游域名伺服器

CoreDNS 能夠使用 [forward 外掛](https://coredns.io/plugins/forward/)配置存根域和上游域名伺服器。

<!-- 
#### Example

If a cluster operator has a [Consul](https://www.consul.io/) domain server located at 10.150.0.1, and all Consul names have the suffix .consul.local. To configure it in CoreDNS, the cluster administrator creates the following stanza in the CoreDNS ConfigMap. 
-->
#### 示例

如果叢集操作員在 10.150.0.1 處運行了 [Consul](https://www.consul.io/) 域伺服器，
且所有 Consul 名稱都帶有後綴 `.consul.local`。要在 CoreDNS 中對其進行配置，
叢集管理員可以在 CoreDNS 的 ConfigMap 中建立加入以下欄位。

```
consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

<!-- 
To explicitly force all non-cluster DNS lookups to go through a specific nameserver at 172.16.0.1, point the  `forward` to the nameserver instead of `/etc/resolv.conf` 
-->
要顯式強制所有非叢集 DNS 查詢透過特定的域名伺服器（位於 172.16.0.1），可將 `forward`
指向該域名伺服器，而不是 `/etc/resolv.conf`。

```
forward .  172.16.0.1
``` 

<!-- 
The final ConfigMap along with the default `Corefile` configuration looks like: 
-->
最終的包含預設的 `Corefile` 配置的 ConfigMap 如下所示：

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

<!-- 
The `kubeadm` supports automatic translation of the CoreDNS ConfigMap from the kube-dns ConfigMap.
-->
工具 `kubeadm` 支援將 kube-dns ConfigMap 自動轉換為 CoreDNS ConfigMap。

<!--
While kube-dns accepts an FQDN for stubdomain and nameserver (eg: ns.foo.com), CoreDNS does not support this feature. 
During translation, all FQDN nameservers will be omitted from the CoreDNS config.*** 
-->
{{< note >}}
儘管 kube-dns 接受 FQDN（例如：ns.foo.com）作為存根域和名字伺服器，CoreDNS 不支援此功能。
轉換期間，CoreDNS 配置中將忽略所有的 FQDN 域名伺服器。
{{< /note >}}

<!-- 
## CoreDNS configuration equivalent to kube-dns

CoreDNS supports the features of kube-dns and more.
A ConfigMap created for kube-dns to support `StubDomains`and `upstreamNameservers` translates to the `proxy` plugin in CoreDNS.

### Example

This example ConfigMap for kube-dns specifies stubdomains and upstreamnameservers: 
-->
## CoreDNS 配置等同於 kube-dns

CoreDNS 不僅僅提供 kube-dns 的功能。
為 kube-dns 建立的 ConfigMap 支援 `StubDomains` 和 `upstreamNameservers` 轉換為 CoreDNS 中的 `forward` 外掛。

### 示例

用於 kubedns 的此示例 ConfigMap 描述了 stubdomains 和 upstreamnameservers：

```yaml
apiVersion: v1
data:
  stubDomains: |
    {"abc.com" : ["1.2.3.4"], "my.cluster.local" : ["2.3.4.5"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
kind: ConfigMap
```

<!-- 
The equivalent configuration in CoreDNS creates a Corefile: 
-->
CoreDNS 中的等效配置將建立一個 Corefile：

* 針對 stubDomains:

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
帶有預設外掛的完整 Corefile：

```
.:53 {
    errors
    health
    kubernetes cluster.local in-addr.arpa ip6.arpa {
       pods insecure
       fallthrough in-addr.arpa ip6.arpa
    }
    federation cluster.local {
       foo foo.feddomain.com
    }
    prometheus :9153
    forward .  8.8.8.8 8.8.4.4
    cache 30
}
abc.com:53 {
    errors
    cache 30
    forward . 1.2.3.4
}
my.cluster.local:53 {
    errors
    cache 30
    forward . 2.3.4.5
}
```

<!-- 
## Migration to CoreDNS

To migrate from kube-dns to CoreDNS, [a detailed blog](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) is available to help users adapt CoreDNS in place of kube-dns.
A cluster administrator can also migrate using [the deploy script](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh).

-->
## 遷移到 CoreDNS

要從 kube-dns 遷移到 CoreDNS，[此部落格](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/)
提供了幫助使用者將 kube-dns 替換為 CoreDNS。
叢集管理員還可以使用[部署指令碼](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh)
進行遷移。

## {{% heading "whatsnext" %}}

<!--
- Read [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/).
-->
- 閱讀[除錯 DNS 解析](/zh-cn/docs/tasks/administer-cluster/dns-debugging-resolution/)

