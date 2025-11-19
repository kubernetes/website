---
title: 混合版本代理
content_type: concept
weight: 220
---
<!--
reviewers:
- jpbetz
title: Mixed Version Proxy
content_type: concept
weight: 220
-->

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

<!--
Kubernetes {{< skew currentVersion >}} includes an alpha feature that lets an
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
proxy a resource requests to other _peer_ API servers. This is useful when there are multiple
API servers running different versions of Kubernetes in one cluster
(for example, during a long-lived rollout to a new release of Kubernetes).
-->
Kubernetes {{<skew currentVersion>}} 包含了一個 Alpha 特性，可以讓
{{<glossary_tooltip text="API 伺服器" term_id="kube-apiserver">}}代理指向其他**對等**
API 伺服器的資源請求。當一個叢集中運行着多個 API 伺服器，且各伺服器的 Kubernetes 版本不同時
（例如在上線 Kubernetes 新版本的時間跨度較長時），這一特性非常有用。

<!--
This enables cluster administrators to configure highly available clusters that can be upgraded
more safely, by directing resource requests (made during the upgrade) to the correct kube-apiserver.
That proxying prevents users from seeing unexpected 404 Not Found errors that stem
from the upgrade process.

This mechanism is called the _Mixed Version Proxy_.
-->
此特性通過將（升級過程中所發起的）資源請求引導到正確的 kube-apiserver
使得叢集管理員能夠設定高可用的、升級動作更安全的叢集。
該代理機制可以防止使用者在升級過程中看到意外的 404 Not Found 錯誤。

這個機制稱爲 **Mixed Version Proxy（混合版本代理）**。

<!--
## Enabling the Mixed Version Proxy

Ensure that `UnknownVersionInteroperabilityProxy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 
is enabled when you start the {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}:
-->
## 啓用混合版本代理   {#enabling-the-mixed-version-proxy}

當你啓動 {{<glossary_tooltip text="API 伺服器" term_id="kube-apiserver">}}時，
確保啓用了 `UnknownVersionInteroperabilityProxy`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)：

<!--
```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# required command line arguments for this feature
--peer-ca-file=<path to kube-apiserver CA cert>
--proxy-client-cert-file=<path to aggregator proxy cert>,
--proxy-client-key-file=<path to aggregator proxy key>,
--requestheader-client-ca-file=<path to aggregator CA cert>,
# requestheader-allowed-names can be set to blank to allow any Common Name
--requestheader-allowed-names=<valid Common Names to verify proxy client cert against>,

# optional flags for this feature
--peer-advertise-ip=`IP of this kube-apiserver that should be used by peers to proxy requests`
--peer-advertise-port=`port of this kube-apiserver that should be used by peers to proxy requests`

# …and other flags as usual
```
-->
```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# 需要爲此特性添加的命令行參數
--peer-ca-file=<指向 kube-apiserver CA 證書的路徑>
--proxy-client-cert-file=<指向聚合器代理證書的路徑>,
--proxy-client-key-file=<指向聚合器代理密鑰的路徑>,
--requestheader-client-ca-file=<指向聚合器 CA 證書的路徑>,
# requestheader-allowed-names 可設置爲空以允許所有 Common Name
--requestheader-allowed-names=<驗證代理客戶端證書的合法 Common Name>,

# 此特性的可選標誌
--peer-advertise-ip=`應由對等方用於代理請求的 kube-apiserver IP`
--peer-advertise-port=`應由對等方用於代理請求的 kube-apiserver 端口`

# ... 和其他常規標誌
```

<!--
### Proxy transport and authentication between API servers {#transport-and-authn}

* The source kube-apiserver reuses the
  [existing APIserver client authentication flags](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` and `--proxy-client-key-file` to present its identity that
  will be verified by its peer (the destination kube-apiserver). The destination API server
  verifies that peer connection based on the configuration you specify using the
  `--requestheader-client-ca-file` command line argument.

* To authenticate the destination server's serving certs, you must configure a certificate
  authority bundle by specifying the `--peer-ca-file` command line argument to the **source** API server.
-->
### API 伺服器之間的代理傳輸和身份驗證   {#transport-and-authn}

* 源 kube-apiserver
  重用[現有的 API 伺服器客戶端身份驗證標誌](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` 和 `--proxy-client-key-file` 來表明其身份，供對等（目標 kube-apiserver）驗證。
  目標 API 伺服器根據你使用 `--requestheader-client-ca-file` 命令列參數指定的設定來驗證對等連接。

* 要對目標伺服器所用的證書進行身份驗證，必須通過指定 `--peer-ca-file` 命令列參數來爲**源**
  API 伺服器設定一個證書機構包。

<!--
### Configuration for peer API server connectivity

To set the network location of a kube-apiserver that peers will use to proxy requests, use the
`--peer-advertise-ip` and `--peer-advertise-port` command line arguments to kube-apiserver or specify
these fields in the API server configuration file.
If these flags are unspecified, peers will use the value from either `--advertise-address` or
`--bind-address` command line argument to the kube-apiserver.
If those too, are unset, the host's default interface is used.
-->
### 對等 API 伺服器連接的設定   {#config-for-peer-apiserver-connectivity}

要設置 kube-apiserver 的網路位置以供對等方來代理請求，
使用爲 kube-apiserver 設置的 `--peer-advertise-ip` 和 `--peer-advertise-port` 命令列參數，
或在 API 伺服器設定文件中指定這些字段。如果未指定這些參數，對等方將使用 `--advertise-address`
或 `--bind-address` 命令列參數的值。如果這些也未設置，則使用主機的默認接口。

<!--
## Mixed version proxying

When you enable mixed version proxying, the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
loads a special filter that does the following:
-->
## 混合版本代理   {#mixed-version-proxying}

啓用混合版本代理時，
[聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)會加載一個特殊的過濾器，
完成以下操作：

<!--
* When a resource request reaches an API server that cannot serve that API
  (either because it is at a version pre-dating the introduction of the API or the API is turned off on the API server)
  the API server attempts to send the request to a peer API server that can serve the requested API.
  It does so by identifying API groups / versions / resources that the local server doesn't recognise,
  and tries to proxy those requests to a peer API server that is capable of handling the request.
* If the peer API server fails to respond, the _source_ API server responds with 503 ("Service Unavailable") error.
-->
* 當資源請求到達無法提供該 API 的 API 伺服器時
  （可能的原因是伺服器早於該 API 的正式引入日期或該 API 在 API 伺服器上被關閉），
  API 伺服器會嘗試將請求發送到能夠提供所請求 API 的對等 API 伺服器。
  API 伺服器通過發現本地伺服器無法識別的 API 組/版本/資源來實現這一點，
  並嘗試將這些請求代理到能夠處理這些請求的對等 API 伺服器。
* 如果對等 API 伺服器無法響應，則**源** API 伺服器將以 503（"Service Unavailable"）錯誤進行響應。

<!--
### How it works under the hood

When an API Server receives a resource request, it first checks which API servers can
serve the requested resource. This check happens using the internal
[`StorageVersion` API](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io).

* If the resource is known to the API server that received the request
  (for example, `GET /api/v1/pods/some-pod`), the request is handled locally.
-->
### 內部工作原理   {#how-it-works-under-the-hood}

當 API 伺服器收到一個資源請求時，它首先檢查哪些 API 伺服器可以提供所請求的資源。
這個檢查是使用內部的
[`StorageVersion` API](/zh-cn/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io)
進行的。

* 如果資源被收到請求（例如 `GET /api/v1/pods/some-pod`）的 API 伺服器所瞭解，則請求會在本地處理。

<!--
* If there is no internal `StorageVersion` object found for the requested resource
  (for example, `GET /my-api/v1/my-resource`) and the configured APIService specifies proxying
  to an extension API server, that proxying happens following the usual
  [flow](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) for extension APIs.
-->
* 如果沒有找到適合所請求資源（例如 `GET /my-api/v1/my-resource`）的內部 `StorageVersion` 對象，
  並且所設定的 APIService 設置了指向擴展 API 伺服器的代理，那麼代理操作將按照擴展 API
  的常規[流程](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)進行。

<!--
* If a valid internal `StorageVersion` object is found for the requested resource
  (for example, `GET /batch/v1/jobs`) and the API server trying to handle the request
  (the _handling API server_) has the `batch` API disabled, then the _handling API server_
  fetches the peer API servers that do serve the relevant API group / version / resource
  (`api/v1/batch` in this case) using the information in the fetched `StorageVersion` object.
  The _handling API server_ then proxies the request to one of the matching peer kube-apiservers
  that are aware of the requested resource.

  * If there is no peer known for that API group / version / resource, the handling API server
    passes the request to its own handler chain which should eventually return a 404 ("Not Found") response.

  * If the handling API server has identified and selected a peer API server, but that peer fails
    to respond (for reasons such as network connectivity issues, or a data race between the request
    being received and a controller registering the peer's info into the control plane), then the handling
    API server responds with a 503 ("Service Unavailable") error.
-->
* 如果找到了對應所請求資源（例如 `GET /batch/v1/jobs`）的合法的內部 `StorageVersion` 對象，
  並且正在處理請求的 API 伺服器（**處理中的 API 伺服器**）禁用了 `batch` API，
  則**正處理的 API 伺服器**使用已獲取的 `StorageVersion` 對象中的信息，
  獲取提供相關 API 組/版本/資源（在此情況下爲 `api/v1/batch`）的對等 API 伺服器。
  **處理中的 API 伺服器**隨後將請求代理到能夠理解所請求資源且匹配的對等 kube-apiserver 之一。

  * 如果沒有對等方瞭解所給的 API 組/版本/資源，則處理請求的 API 伺服器將請求傳遞給自己的處理程序鏈，
    最終應返回 404（"Not Found"）響應。

  * 如果處理請求的 API 伺服器已經識別並選擇了一個對等 API 伺服器，但該對等方無法響應
    （原因可能是網路連接問題或正接收的請求與向控制平面註冊對等信息的控制器之間存在數據競爭等），
    則處理請求的 API 伺服器會以 503（"Service Unavailable"）錯誤進行響應。
