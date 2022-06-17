---
title: 訪問叢集
weight: 20
content_type: concept
---

<!--
title: Accessing Clusters
weight: 20
content_type: concept
-->

<!-- overview -->

<!--
This topic discusses multiple ways to interact with clusters.
-->
本文闡述多種與叢集互動的方法。

{{< toc >}}

<!-- body -->

<!--
## Accessing for the first time with kubectl

When accessing the Kubernetes API for the first time, we suggest using the
Kubernetes CLI, `kubectl`.

To access a cluster, you need to know the location of the cluster and have credentials
to access it.  Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else setup the cluster and provided you with credentials and a location.

Check the location and credentials that kubectl knows about with this command:
-->
## 使用 kubectl 完成叢集的第一次訪問 {#accessing-for-the-first-time-with-kubectl}

當你第一次訪問 Kubernetes API 的時候，我們建議你使用 Kubernetes CLI 工具 `kubectl`。

訪問叢集時，你需要知道叢集的地址並且擁有訪問的憑證。通常，這些在你透過
[啟動安裝](/zh-cn/docs/setup/)安裝叢集時都是自動安裝好的，或者其他人安裝時
也應該提供了憑證和叢集地址。

透過以下命令檢查 kubectl 是否知道叢集地址及憑證：

```shell
kubectl config view
```

<!--
Many of the [examples](/docs/reference/kubectl/cheatsheet/) provide an introduction to using
`kubectl`, and complete documentation is found in the
[kubectl reference](/docs/reference/kubectl/).
-->
有許多[例子](/zh-cn/docs/reference/kubectl/cheatsheet/)介紹瞭如何使用 kubectl，
可以在 [kubectl 參考](/zh-cn/docs/reference/kubectl/)中找到更完整的文件。

<!--
## Directly accessing the REST API

Kubectl handles locating and authenticating to the apiserver.
If you want to directly access the REST API with an http client like
curl or wget, or a browser, there are several ways to locate and authenticate:

  - Run kubectl in proxy mode.
    - Recommended approach.
    - Uses stored apiserver location.
    - Verifies identity of apiserver using self-signed cert.  No MITM possible.
    - Authenticates to apiserver.
    - In future, may do intelligent client-side load-balancing and failover.
  - Provide the location and credentials directly to the http client.
    - Alternate approach.
    - Works with some types of client code that are confused by using a proxy.
    - Need to import a root cert into your browser to protect against MITM.
-->
## 直接訪問 REST API {#directly-accessing-the-rest-api}

Kubectl 處理 apiserver 的定位和身份驗證。
如果要使用 curl 或 wget 等 http 客戶端或瀏覽器直接訪問 REST API，可以透過
多種方式查詢和驗證：

- 以代理模式執行 kubectl。
  - 推薦此方式。
  - 使用已儲存的 apiserver 地址。
  - 使用自簽名的證書來驗證 apiserver 的身份。杜絕 MITM 攻擊。
  - 對 apiserver 進行身份驗證。
  - 未來可能會實現智慧化的客戶端負載均衡和故障恢復。
- 直接向 http 客戶端提供位置和憑據。
  - 可選的方案。
  - 適用於代理可能引起混淆的某些客戶端型別。
  - 需要引入根證書到你的瀏覽器以防止 MITM 攻擊。

<!--
### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy.  It handles
locating the apiserver and authenticating.
Run it like this:
-->
### 使用 kubectl proxy {#using-kubectl-proxy}

以下命令以反向代理的模式執行 kubectl。它處理 apiserver 的定位和驗證。
像這樣執行：

```shell
kubectl proxy --port=8080
```

<!--
See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details.

Then you can explore the API with curl, wget, or a browser, replacing localhost
with [::1] for IPv6, like so:
-->
參閱 [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy)
獲取更多詳細資訊。

然後，你可以使用 curl、wget 或瀏覽器訪問 API，如果是 IPv6 則用 [::1] 替換 localhost，
如下所示：

```shell
curl http://localhost:8080/api/
```

<!--
The output is similar to this:
-->
輸出類似於：

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

<!--
### Without kubectl proxy

Use `kubectl apply` and `kubectl describe secret...` to create a token for the default service account with grep/cut:

First, create the Secret, requesting a token for the default ServiceAccount:

-->

### 不使用 kubectl proxy {#without-kubectl-proxy}

使用 `kubectl apply` 和 `kubectl describe secret ...` 及 grep 和剪下操作來為 default 服務帳戶建立令牌，如下所示：

首先，建立 Secret，請求預設 ServiceAccount 的令牌：

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
```

<!--
Next, wait for the token controller to populate the Secret with a token:
-->
接下來，等待令牌控制器使用令牌填充 Secret：

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

<!--
Capture and use the generated token:
-->
捕獲並使用生成的令牌：

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")
curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

<!--
The output is similar to this:
-->
輸出類似於：

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

<!--
Using `jsonpath`:
-->
`jsonpath` 方法實現：

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)
curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

<!--
The output is similar to this:
-->
輸出類似於：

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

<!--
The above examples use the `--insecure` flag.  This leaves it subject to MITM
attacks.  When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server.  (These are installed in the
`~/.kube` directory).  Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.

On some clusters, the apiserver does not require authentication; it may serve
on localhost, or be protected by a firewall.  There is not a standard
for this.  [Controlling Access to the API](/docs/concepts/security/controlling-access)
describes how a cluster admin can configure this.
-->
上面的例子使用了 `--insecure` 引數，這使得它很容易受到 MITM 攻擊。
當 kubectl 訪問叢集時，它使用儲存的根證書和客戶端證書來訪問伺服器
（它們安裝在 `~/.kube` 目錄中）。
由於叢集證書通常是自簽名的，因此可能需要特殊配置才能讓你的 http 客戶端使用根證書。

在一些叢集中，apiserver 不需要身份驗證；它可能只服務於 localhost，或者被防火牆保護，
這個沒有一定的標準。
[配置對 API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)
描述了叢集管理員如何進行配置。此類方法可能與未來的高可用性支援相沖突。

<!--
## Programmatic access to the API

Kubernetes officially supports [Go](#go-client) and [Python](#python-client)
client libraries.

### Go client

* To get the library, run the following command: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, see [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user) for detailed installation instructions. See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/kubernetes"` is correct.

The Go client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod).
-->
## 以程式設計方式訪問 API {#programmatic-access-to-the-api}

Kubernetes 官方提供對 [Go](#go-client) 和 [Python](#python-client) 的客戶端庫支援。

### Go 客戶端 {#go-client}

* 想要獲得這個庫，請執行命令：`go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`，
  有關詳細安裝說明，請參閱 [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)。
  請參閱 [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) 以檢視支援的版本。
* 基於這個 client-go 客戶端庫編寫應用程式。
  請注意，client-go 定義了自己的 API 物件，因此如果需要，請從 client-go 而不是從主儲存庫
  匯入 API 定義，例如，`import "k8s.io/client-go/kubernetes"` 才是對的。

Go 客戶端可以像 kubectl CLI 一樣使用相同的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
來定位和驗證 apiserver。可參閱
[示例](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)。

如果應用程式以 Pod 的形式部署在叢集中，那麼請參閱
[下一章](#accessing-the-api-from-a-pod)。

<!--
### Python client

To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes`. See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options.

The Python client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://github.com/kubernetes-client/python/tree/master/examples).

### Other languages

There are [client libraries](/docs/reference/using-api/client-libraries/) for accessing the API from other languages.
See documentation for other libraries for how they authenticate.
-->
### Python 客戶端 {#python-client}

如果想要使用 [Python 客戶端](https://github.com/kubernetes-client/python)，
請執行命令：`pip install kubernetes`。參閱
[Python Client Library page](https://github.com/kubernetes-client/python)
以獲得更詳細的安裝引數。

Python 客戶端可以像 kubectl CLI 一樣使用相同的
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
來定位和驗證 apiserver，可參閱
[示例](https://github.com/kubernetes-client/python/tree/master/examples)。

### 其它語言 {#other-languages}

目前有多個[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)
為其它語言提供訪問 API 的方法。
參閱其它庫的相關文件以獲取他們是如何驗證的。

<!--
## Accessing the API from a Pod

When accessing the API from a pod, locating and authenticating
to the API server are somewhat different.
-->
### 從 Pod 中訪問 API   {#accessing-the-api-from-a-pod}

當你從 Pod 中訪問 API 時，定位和驗證 API 伺服器會有些許不同。

<!--
Please check [Accessing the API from within a Pod](/docs/tasks/run-application/access-api-from-pod/)
for more details.
-->
請參閱[從 Pod 中訪問 API](/zh-cn/docs/tasks/run-application/access-api-from-pod/)
瞭解更多詳情。

<!--
## Accessing services running on the cluster

The previous section describes how to connect to the Kubernetes API server.
For information about connecting to other services running on a Kubernetes cluster, see
[Access Cluster Services](/docs/tasks/access-application-cluster/access-cluster-services/).
-->

## 訪問叢集上執行的服務  {#accessing-services-running-on-the-cluster}

上一節介紹瞭如何連線到 Kubernetes API 伺服器。
有關連線到 Kubernetes 叢集上執行的其他服務的資訊，請參閱
[訪問叢集服務](/zh-cn/docs/tasks/access-application-cluster/access-cluster-services/)。

<!--
## Requesting redirects

The redirect capabilities have been deprecated and removed.  Please use a proxy (see below) instead.
-->
## 請求重定向 {#requesting-redirects}

重定向功能已棄用並被刪除。請改用代理（見下文）。

<!--
## So Many Proxies

There are several different proxies you may encounter when using Kubernetes:

1.  The [kubectl proxy](#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers

-->
## 多種代理 {#so-many-proxies}

使用 Kubernetes 時可能會遇到幾種不同的代理：

1. [kubectl 代理](#directly-accessing-the-rest-api)：

   - 在使用者的桌面或 Pod 中執行
   - 代理從本地主機地址到 Kubernetes apiserver
   - 客戶端到代理將使用 HTTP
   - 代理到 apiserver 使用 HTTPS
   - 定位 apiserver
   - 新增身份驗證頭部

<!--
1.  The [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service
-->
2. [apiserver 代理](/zh-cn/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services)：

   - 內置於 apiserver 中
   - 將叢集外部的使用者連線到叢集 IP，否則這些 IP 可能無法訪問
   - 執行在 apiserver 程序中
   - 客戶端代理使用 HTTPS（也可配置為 http）
   - 代理將根據可用的資訊決定使用 HTTP 或者 HTTPS 代理到目標
   - 可用於訪問節點、Pod 或服務
   - 在訪問服務時進行負載平衡

<!--
1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP and TCP
    - does not understand HTTP
    - provides load balancing
    - is only used to reach services
-->
3. [kube proxy](/zh-cn/docs/concepts/services-networking/service/#ips-and-vips)：

   - 執行在每個節點上
   - 代理 UDP 和 TCP
   - 不能代理 HTTP
   - 提供負載均衡
   - 只能用來訪問服務

<!--
1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.
-->
4. 位於 apiserver 之前的 Proxy/Load-balancer：

   - 存在和實現因叢集而異（例如 nginx）
   - 位於所有客戶和一個或多個 apiserver 之間
   - 如果有多個 apiserver，則充當負載均衡器

<!--
1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - use UDP/TCP only
    - implementation varies by cloud provider.

Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are setup correctly.
-->
5. 外部服務上的雲負載均衡器：

   - 由一些雲提供商提供（例如 AWS ELB，Google Cloud Load Balancer）
   - 當 Kubernetes 服務型別為 `LoadBalancer` 時自動建立
   - 只使用 UDP/TCP
   - 具體實現因雲提供商而異。

除了前兩種型別之外，Kubernetes 使用者通常不需要擔心任何其他問題。
叢集管理員通常會確保後者的正確配置。
