---
title: 配置聚合層
content_type: task
weight: 10
---
<!--
title: Configure the Aggregation Layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: task
weight: 10
-->

<!-- overview -->

<!--
Configuring the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.
-->
配置[聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
可以允許 Kubernetes apiserver 使用其它 API 擴充套件，這些 API 不是核心
Kubernetes API 的一部分。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
There are a few setup requirements for getting the aggregation layer working in your environment to support mutual TLS auth between the proxy and extension apiservers. Kubernetes and the kube-apiserver have multiple CAs, so make sure that the proxy is signed by the aggregation layer CA and not by something else, like the Kubernetes general CA.
-->
{{< note >}}
要使聚合層在你的環境中正常工作以支援代理伺服器和擴充套件 apiserver 之間的相互 TLS 身份驗證，
需要滿足一些設定要求。Kubernetes 和 kube-apiserver 具有多個 CA，
因此請確保代理是由聚合層 CA 簽名的，而不是由 Kubernetes 通用 CA 簽名的。
{{< /note >}}

<!--
Reusing the same CA for different client types can negatively impact the cluster's ability to function. For more information, see [CA Reusage and Conflicts](#ca-reusage-and-conflicts).
-->
{{< caution >}}
對不同的客戶端型別重複使用相同的 CA 會對叢集的功能產生負面影響。
有關更多資訊，請參見 [CA 重用和衝突](#ca-reusage-and-conflicts)。
{{< /caution >}}

<!-- steps -->

<!--
## Authentication Flow

Unlike Custom Resource Definitions (CRDs), the Aggregation API involves another server - your Extension apiserver - in addition to the standard Kubernetes apiserver. The Kubernetes apiserver will need to communicate with your extension apiserver, and your extension apiserver will need to communicate with the Kubernetes apiserver. In order for this communication to be secured, the Kubernetes apiserver uses x509 certificates to authenticate itself to the extension apiserver.

This section describes how the authentication and authorization flows work, and how to configure them.
-->
## 身份認證流程

與自定義資源定義（CRD）不同，除標準的 Kubernetes apiserver 外，Aggregation API
還涉及另一個伺服器：擴充套件 apiserver。
Kubernetes apiserver 將需要與你的擴充套件 apiserver 通訊，並且你的擴充套件 apiserver 
也需要與 Kubernetes apiserver 通訊。
為了確保此通訊的安全，Kubernetes apiserver 使用 x509 證書向擴充套件 apiserver 認證。

本節介紹身份認證和鑑權流程的工作方式以及如何配置它們。

<!--
The high-level flow is as follows:

1. Kubernetes apiserver: authenticate the requesting user and authorize their rights to the requested API path.
2. Kubernetes apiserver: proxy the request to the extension apiserver
3. Extension apiserver: authenticate the request from the Kubernetes apiserver
4. Extension apiserver: authorize the request from the original user
5. Extension apiserver: execute
-->
大致流程如下：

1. Kubernetes apiserver：對發出請求的使用者身份認證，並對請求的 API 路徑執行鑑權。
2. Kubernetes apiserver：將請求轉發到擴充套件 apiserver
3. 擴充套件 apiserver：認證來自 Kubernetes apiserver 的請求
4. 擴充套件 apiserver：對來自原始使用者的請求鑑權
5. 擴充套件 apiserver：執行

<!--
The rest of this section describes these steps in detail.

The flow can be seen in the following diagram.

The source for the above swimlanes can be found in the source of this document.
-->
本節的其餘部分詳細描述了這些步驟。

該流程可以在下圖中看到。

![聚合層認證流程](/images/docs/aggregation-api-auth-flow.png).

以上泳道的來源可以在本文件的原始碼中找到。

<!--
Swimlanes generated at https://swimlanes.io with the source as follows:

-----BEGIN-----
title: Welcome to swimlanes.io


User -> kube-apiserver / aggregator:

note:
1. The user makes a request to the Kube API server using any recognized credential (e.g. OIDC or client certs)

kube-apiserver / aggregator -> kube-apiserver / aggregator: authentication

note:
2. The Kube API server authenticates the incoming request using any configured authentication methods (e.g. OIDC or client certs)

kube-apiserver / aggregator -> kube-apiserver / aggregator: authorization

note:
3. The Kube API server authorizes the requested URL using any configured authorization method (e.g. RBAC)

kube-apiserver / aggregator -> aggregated apiserver:

note:
4.The aggregator opens a connection to the aggregated API server using `--proxy-client-cert-file`/`--proxy-client-key-file` client certificate/key to secure the channel
5.The aggregator sends the user info from step 1 to the aggregated API server as http headers, as defined by the following flags:
  * `--requestheader-username-headers`
  * `--requestheader-group-headers`
  * `--requestheader-extra-headers-prefix`

aggregated apiserver -> aggregated apiserver: authentication

note:
6. The aggregated apiserver authenticates the incoming request using the auth proxy authentication method:
  * verifies the request has a recognized auth proxy client certificate
  * pulls user info from the incoming request's http headers

By default, it pulls the configuration information for this from a configmap in the kube-system namespace that is published by the kube-apiserver, containing the info from the `--requestheader-...` flags provided to the kube-apiserver (CA bundle to use, auth proxy client certificate names to allow, http header names to use, etc)

aggregated apiserver -> kube-apiserver / aggregator: authorization

note:
7. The aggregated apiserver authorizes the incoming request by making a SubjectAccessReview call to the kube-apiserver

aggregated apiserver -> aggregated apiserver: admission

note:
8. For mutating requests, the aggregated apiserver runs admission checks. by default, the namespace lifecycle admission plugin ensures namespaced resources are created in a namespace that exists in the kube-apiserver
-----END-----

-->

<!--
在 https://swimlanes.io 生成的泳道，其原始碼如下：

-----BEGIN-----
title: 認證流程

User -> kube-apiserver / aggregator:

note:
1.使用者使用任何公認的憑證（例如 OIDC 或客戶端證書）向 Kube Apiserver 發出請求

kube-apiserver / aggregator -> kube-apiserver / aggregator: 認證

note:
2.Kube Apiserver 使用任何配置的身份驗證方法（例如 OIDC 或客戶端證書）對傳入請求認證

kube-apiserver / aggregator -> kube-apiserver / aggregator: 鑑權

note:
3.Kube Apiserver 使用任何配置的鑑權方法（例如 RBAC）對請求的 URL 鑑權

kube-apiserver / aggregator -> 聚合的 apiserver:

note:
4.aggregator 使用 `--proxy-client-cert-file`，`--proxy-client-key-file`
  客戶端證書/金鑰開啟與聚合 Apiserver 的連線以保護通道

5.aggregator 將步驟 1 中的使用者資訊作為 http 標頭髮送到聚合的 Apiserver，
  如以下標誌所定義：

  * `--requestheader-username-headers`
  * `--requestheader-group-headers`
  * `--requestheader-extra-headers-prefix`

kube-apiserver / aggregator -> 聚合的 apiserver: 認證

note:
6.聚合的 apiserver 使用代理身份驗證方法對傳入的請求認證：

  * 驗證請求是否具有公認的身份驗證代理客戶端證書
  * 從傳入請求的 HTTP 標頭中提取使用者資訊

預設情況下，它從 kube-apiserver 釋出的 kube-system 名稱空間中的 configmap
中獲取配置資訊，其中包含提供給 kube-apiserver 的`--requestheader-...`
標誌中的資訊（要使用的 CA 包，要允許的身份驗證代理客戶端證書名稱，
要使用的 HTTP 標頭名稱等）

kube-apiserver / aggregator -> 聚合的 apiserver: 鑑權

note:
7.聚合的 apiserver 透過 SubjectAccessReview 請求 kube-apiserver 鑑權

kube-apiserver / aggregator -> 聚合的 apiserver: 准入

note:
8.對於可變請求，聚合的 apiserver 執行准入檢查。
  預設情況下，namespace 生命週期准入外掛可確保在 kube-apiserver
  中存在的 namespace 中建立指定 namespace 下的資源
-----END-----

-->

<!--
### Kubernetes Apiserver Authentication and Authorization

A request to an API path that is served by an extension apiserver begins the same way as all API requests: communication to the Kubernetes apiserver. This path already has been registered with the Kubernetes apiserver by the extension apiserver.

The user communicates with the Kubernetes apiserver, requesting access to the path. The Kubernetes apiserver uses standard authentication and authorization configured with the Kubernetes apiserver to authenticate the user and authorize access to the specific path.

For an overview of authenticating to a Kubernetes cluster, see ["Authenticating to a Cluster"](/docs/reference/access-authn-authz/authentication/). For an overview of authorization of access to Kubernetes cluster resources, see ["Authorization Overview"](/docs/reference/access-authn-authz/authorization/).

Everything to this point has been standard Kubernetes API requests, authentication and authorization.

The Kubernetes apiserver now is prepared to send the request to the extension apiserver.
-->
### Kubernetes Apiserver 認證和授權

由擴充套件 apiserver 服務的對 API 路徑的請求以與所有 API 請求相同的方式開始：
與 Kubernetes apiserver 的通訊。該路徑已透過擴充套件 apiserver 在
Kubernetes apiserver 中註冊。

使用者與 Kubernetes apiserver 通訊，請求訪問路徑。
Kubernetes apiserver 使用它的標準認證和授權配置來對使用者認證，以及對特定路徑的鑑權。

有關對 Kubernetes 叢集認證的概述，請參見
[對叢集認證](/zh-cn/docs/reference/access-authn-authz/authentication/)。
有關對Kubernetes叢集資源的訪問鑑權的概述，請參見
[鑑權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)。

到目前為止，所有內容都是標準的 Kubernetes API 請求，認證與鑑權。

Kubernetes apiserver 現在準備將請求傳送到擴充套件 apiserver。

<!--
### Kubernetes Apiserver Proxies the Request

The Kubernetes apiserver now will send, or proxy, the request to the extension apiserver that registered to handle the request. In order to do so, it needs to know several things:

1. How should the Kubernetes apiserver authenticate to the extension apiserver, informing the extension apiserver that the request, which comes over the network, is coming from a valid Kubernetes apiserver?
2. How should the Kubernetes apiserver inform the extension apiserver of the username and group for which the original request was authenticated?

In order to provide for these two, you must configure the Kubernetes apiserver using several flags.
-->
### Kubernetes Apiserver 代理請求

Kubernetes apiserver 現在將請求傳送或代理到註冊以處理該請求的擴充套件 apiserver。
為此，它需要了解幾件事：

1. Kubernetes apiserver 應該如何向擴充套件 apiserver 認證，以通知擴充套件
   apiserver 透過網路發出的請求來自有效的 Kubernetes apiserver？

2. Kubernetes apiserver 應該如何通知擴充套件 apiserver 原始請求
   已透過認證的使用者名稱和組？

為提供這兩條資訊，你必須使用若干標誌來配置 Kubernetes apiserver。

<!--
#### Kubernetes Apiserver Client Authentication

The Kubernetes apiserver connects to the extension apiserver over TLS, authenticating itself using a client certificate. You must provide the following to the Kubernetes apiserver upon startup, using the provided flags:

* private key file via `--proxy-client-key-file`
* signed client certificate file via `--proxy-client-cert-file`
* certificate of the CA that signed the client certificate file via `--requestheader-client-ca-file`
* valid Common Names (CN) in the signed client certificate via `--requestheader-allowed-names`
-->
#### Kubernetes Apiserver 客戶端認證

Kubernetes apiserver 透過 TLS 連線到擴充套件 apiserver，並使用客戶端證書認證。
你必須在啟動時使用提供的標誌向 Kubernetes apiserver 提供以下內容：

* 透過 `--proxy-client-key-file` 指定私鑰檔案
* 透過 `--proxy-client-cert-file` 簽名的客戶端證書檔案
* 透過 `--requestheader-client-ca-file` 簽署客戶端證書檔案的 CA 證書
* 透過 `--requestheader-allowed-names` 在簽署的客戶證書中有效的公用名（CN）

<!--
The Kubernetes apiserver will use the files indicated by `--proxy-client-*-file` to authenticate to the extension apiserver. In order for the request to be considered valid by a compliant extension apiserver, the following conditions must be met:

1. The connection must be made using a client certificate that is signed by the CA whose certificate is in `--requestheader-client-ca-file`.
2. The connection must be made using a client certificate whose CN is one of those listed in `--requestheader-allowed-names`. **Note:** You can set this option to blank as `--requestheader-allowed-names=""`. This will indicate to an extension apiserver that _any_ CN is acceptable.
-->
Kubernetes apiserver 將使用由 `--proxy-client-*-file` 指示的檔案來驗證擴充套件 apiserver。
為了使合規的擴充套件 apiserver 能夠將該請求視為有效，必須滿足以下條件：

1. 連線必須使用由 CA 簽署的客戶端證書，該證書的證書位於 `--requestheader-client-ca-file` 中。
2. 連線必須使用客戶端證書，該客戶端證書的 CN 是 `--requestheader-allowed-names` 中列出的證書之一。

{{< note >}}
你可以將此選項設定為空白，即為`--requestheader-allowed-names`。
這將向擴充套件 apiserver 指示任何 CN 是可接受的。
{{< /note >}}

<!--
When started with these options, the Kubernetes apiserver will:

1. Use them to authenticate to the extension apiserver.
2. Create a configmap in the `kube-system` namespace called `extension-apiserver-authentication`, in which it will place the CA certificate and the allowed CNs. These in turn can be retrieved by extension apiservers to validate requests.

Note that the same client certificate is used by the Kubernetes apiserver to authenticate against _all_ extension apiservers. It does not create a client certificate per extension apiserver, but rather a single one to authenticate as the Kubernetes apiserver. This same one is reused for all extension apiserver requests.
-->
使用這些選項啟動時，Kubernetes apiserver 將：

1. 使用它們向擴充套件 apiserver 認證。
2. 在 `kube-system` 名稱空間中
   建立一個名為 `extension-apiserver-authentication` 的 ConfigMap，
   它將在其中放置 CA 證書和允許的 CN。
   反過來，擴充套件 apiserver 可以檢索這些內容以驗證請求。

請注意，Kubernetes apiserver 使用相同的客戶端證書對所有擴充套件 apiserver 認證。
它不會為每個擴充套件 apiserver 建立一個客戶端證書，而是建立一個證書作為
Kubernetes apiserver 認證。所有擴充套件 apiserver 請求都重複使用相同的請求。

<!--
#### Original Request Username and Group

When the Kubernetes apiserver proxies the request to the extension apiserver, it informs the extension apiserver of the username and group with which the original request successfully authenticated. It provides these in http headers of its proxied request. You must inform the Kubernetes apiserver of the names of the headers to be used.

* the header in which to store the username via `-requestheader-username-headers`
* the header in which to store the group via `-requestheader-group-headers`
* the prefix to append to all extra headers via `-requestheader-extra-headers-prefix`

These header names are also placed in the `extension-apiserver-authentication` configmap, so they can be retrieved and used by extension apiservers.
-->
#### 原始請求使用者名稱和組

當 Kubernetes apiserver 將請求代理到擴充套件 apiserver 時，
它將向擴充套件 apiserver 通知原始請求已成功透過其驗證的使用者名稱和組。
它在其代理請求的 HTTP 頭部中提供這些。你必須將要使用的標頭名稱告知
Kubernetes apiserver。

* 透過`--requestheader-username-headers` 標明用來儲存使用者名稱的頭部
* 透過`--requestheader-group-headers` 標明用來儲存 group 的頭部
* 透過`--requestheader-extra-headers-prefix` 標明用來儲存拓展資訊字首的頭部

這些頭部名稱也放置在 `extension-apiserver-authentication` ConfigMap 中，
因此擴充套件 apiserver 可以檢索和使用它們。

<!--
### Extension Apiserver Authenticates the Request

The extension apiserver, upon receiving a proxied request from the Kubernetes apiserver, must validate that the request actually did come from a valid authenticating proxy, which role the Kubernetes apiserver is fulfilling. The extension apiserver validates it via:

1. Retrieve the following from the configmap in `kube-system`, as described above:
    * Client CA certificate
    * List of allowed names (CNs)
    * Header names for username, group and extra info

2. Check that the TLS connection was authenticated using a client certificate which:
    * Was signed by the CA whose certificate matches the retrieved CA certificate.
    * Has a CN in the list of allowed CNs, unless the list is blank, in which case all CNs are allowed.
    * Extract the username and group from the appropriate headers
-->
### 擴充套件 Apiserver 認證

擴充套件 apiserver 在收到來自 Kubernetes apiserver 的代理請求後，
必須驗證該請求確實確實來自有效的身份驗證代理，
該認證代理由 Kubernetes apiserver 履行。擴充套件 apiserver 透過以下方式對其認證：

1. 如上所述，從`kube-system`中的 configmap 中檢索以下內容：

   * 客戶端 CA 證書
   * 允許名稱（CN）列表
   * 使用者名稱，組和其他資訊的頭部

2. 使用以下證書檢查 TLS 連線是否已透過認證：

   * 由其證書與檢索到的 CA 證書匹配的 CA 簽名。
   * 在允許的 CN 列表中有一個 CN，除非列表為空，在這種情況下允許所有 CN。
   * 從適當的頭部中提取使用者名稱和組

<!--
If the above passes, then the request is a valid proxied request from a legitimate authenticating proxy, in this case the Kubernetes apiserver.

Note that it is the responsibility of the extension apiserver implementation to provide the above. Many do it by default, leveraging the `k8s.io/apiserver/` package. Others may provide options to override it using command-line options.

In order to have permission to retrieve the configmap, an extension apiserver requires the appropriate role. There is a default role named `extension-apiserver-authentication-reader` in the `kube-system` namespace which can be assigned.
-->
如果以上均透過，則該請求是來自合法認證代理（在本例中為 Kubernetes apiserver）
的有效代理請求。

請注意，擴充套件 apiserver 實現負責提供上述內容。
預設情況下，許多擴充套件 apiserver 實現利用 `k8s.io/apiserver/` 軟體包來做到這一點。
也有一些實現可能支援使用命令列選項來覆蓋這些配置。

為了具有檢索 configmap 的許可權，擴充套件 apiserver 需要適當的角色。
在 `kube-system` 名字空間中有一個預設角色
`extension-apiserver-authentication-reader` 可用於設定。

<!--
### Extension Apiserver Authorizes the Request

The extension apiserver now can validate that the user/group retrieved from the headers are authorized to execute the given request. It does so by sending a standard [SubjectAccessReview](/docs/reference/access-authn-authz/authorization/) request to the Kubernetes apiserver.

In order for the extension apiserver to be authorized itself to submit the `SubjectAccessReview` request to the Kubernetes apiserver, it needs the correct permissions. Kubernetes includes a default `ClusterRole` named `system:auth-delegator` that has the appropriate permissions. It can be granted to the extension apiserver's service account.
-->
### 擴充套件 Apiserver 對請求鑑權

擴充套件 apiserver 現在可以驗證從標頭檢索的`user/group`是否有權執行給定請求。
透過向 Kubernetes apiserver 傳送標準
[SubjectAccessReview](/zh-cn/docs/reference/access-authn-authz/authorization/) 請求來實現。

為了使擴充套件 apiserver 本身被鑑權可以向 Kubernetes apiserver 提交 SubjectAccessReview 請求，
它需要正確的許可權。
Kubernetes 包含一個具有相應許可權的名為 `system:auth-delegator` 的預設 `ClusterRole`，
可以將其授予擴充套件 apiserver 的服務帳戶。

<!--
### Extension Apiserver Executes

If the `SubjectAccessReview` passes, the extension apiserver executes the request.

## Enable Kubernetes Apiserver flags

Enable the aggregation layer via the following kube-apiserver flags. They may have already been taken care of by your provider.
-->
### 擴充套件 Apiserver 執行

如果 `SubjectAccessReview` 透過，則擴充套件 apiserver 執行請求。

## 啟用 Kubernetes Apiserver 標誌

透過以下 kube-apiserver 標誌啟用聚合層。
你的服務提供商可能已經為你完成了這些工作：

```
    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>
```

<!--
### CA Reusage and Conflicts

The Kubernetes apiserver has two client CA options:
-->
### CA-重用和衝突  {#ca-reusage-and-conflicts}

Kubernetes apiserver 有兩個客戶端 CA 選項：

* `--client-ca-file`
* `--requestheader-client-ca-file`

<!--
Each of these functions independently and can conflict with each other, if not used correctly.

* `--client-ca-file`: When a request arrives to the Kubernetes apiserver, if this option is enabled, the Kubernetes apiserver checks the certificate of the request. If it is signed by one of the CA certificates in the file referenced by `--client-ca-file`, then the request is treated as a legitimate request, and the user is the value of the common name `CN=`, while the group is the organization `O=`. See the [documentaton on TLS authentication](/docs/reference/access-authn-authz/authentication/#x509-client-certs).
* `--requestheader-client-ca-file`: When a request arrives to the Kubernetes apiserver, if this option is enabled, the Kubernetes apiserver checks the certificate of the request. If it is signed by one of the CA certificates in the file reference by `--requestheader-client-ca-file`, then the request is treated as a potentially legitimate request. The Kubernetes apiserver then checks if the common name `CN=` is one of the names in the list provided by `--requestheader-allowed-names`. If the name is allowed, the request is approved; if it is not, the request is not.
-->
這些功能中的每個功能都是獨立的；如果使用不正確，可能彼此衝突。

* `--client-ca-file`：當請求到達 Kubernetes apiserver 時，如果啟用了此選項，
  則 Kubernetes apiserver 會檢查請求的證書。
  如果它是由 `--client-ca-file` 引用的檔案中的 CA 證書之一簽名的，
  並且使用者是公用名`CN=`的值，而組是組織`O=` 的取值，則該請求被視為合法請求。
  請參閱[關於 TLS 身份驗證的文件](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certs)。

* `--requestheader-client-ca-file`：當請求到達 Kubernetes apiserver 時，
  如果啟用此選項，則 Kubernetes apiserver 會檢查請求的證書。
  如果它是由檔案引用中的 --requestheader-client-ca-file 所簽署的 CA 證書之一簽名的，
  則該請求將被視為潛在的合法請求。
  然後，Kubernetes apiserver 檢查通用名稱 `CN=` 是否是
  `--requestheader-allowed-names` 提供的列表中的名稱之一。
  如果名稱允許，則請求被批准；如果不是，則請求被拒絕。

<!--
If _both_ `--client-ca-file` and `--requestheader-client-ca-file` are provided, then the request first checks the `--requestheader-client-ca-file` CA and then the `--client-ca-file`. Normally, different CAs, either root CAs or intermediate CAs, are used for each of these options; regular client requests match against `--client-ca-file`, while aggregation requests match against `--requestheader-client-ca-file`. However, if both use the _same_ CA, then client requests that normally would pass via `--client-ca-file` will fail, because the CA will match the CA in `--requestheader-client-ca-file`, but the common name `CN=` will **not** match one of the acceptable common names in `--requestheader-allowed-names`. This can cause your kubelets and other control plane components, as well as end-users, to be unable to authenticate to the Kubernetes apiserver.

For this reason, use different CA certs for the `--client-ca-file` option - to authorize control plane components and end-users - and the `--requestheader-client-ca-file` option - to authorize aggregation apiserver requests.
-->
如果同時提供了 `--client-ca-file` 和 `--requestheader-client-ca-file`，
則首先檢查 `--requestheader-client-ca-file` CA，然後再檢查`--client-ca-file`。
通常，這些選項中的每一個都使用不同的 CA（根 CA 或中間 CA）。
常規客戶端請求與 `--client-ca-file` 相匹配，而聚合請求要與
`--requestheader-client-ca-file` 相匹配。
但是，如果兩者都使用同一個 CA，則通常會透過 `--client-ca-file`
傳遞的客戶端請求將失敗，因為 CA 將與 `--requestheader-client-ca-file`
中的 CA 匹配，但是通用名稱 `CN=` 將不匹配 `--requestheader-allowed-names`
中可接受的通用名稱之一。
這可能導致你的 kubelet 和其他控制平面元件以及終端使用者無法向 Kubernetes
apiserver 認證。

因此，請對用於控制平面元件和終端使用者鑑權的 `--client-ca-file` 選項和
用於聚合 apiserver 鑑權的 `--requestheader-client-ca-file` 選項使用
不同的 CA 證書。

<!--
Do **not** reuse a CA that is used in a different context unless you understand the risks and the mechanisms to protect the CA's usage.
-->
{{< warning >}}
除非你瞭解風險和保護 CA 用法的機制，否則 *不要* 重用在不同上下文中使用的 CA。
{{< /warning >}}

<!--
If you are not running kube-proxy on a host running the API server, then you must make sure that the system is enabled with the following `kube-apiserver` flag:
-->
如果你未在執行 API 伺服器的主機上執行 kube-proxy，則必須確保使用以下
`kube-apiserver` 標誌啟用系統：

```
--enable-aggregator-routing=true
```

<!--
### Register APIService objects

You can dynamically configure what client requests are proxied to extension
apiserver. The following is an example registration:
-->
### 註冊 APIService 物件

你可以動態配置將哪些客戶端請求代理到擴充套件 apiserver。以下是註冊示例：

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: <註釋物件名稱>
spec:
  group: <擴充套件 Apiserver 的 API 組名>
  version: <擴充套件 Apiserver 的 API 版本>
  groupPriorityMinimum: <APIService 對應組的優先順序, 參考 API 文件>
  versionPriority: <版本在組中的優先排序, 參考 API 文件>
  service:
    namespace: <拓展 Apiserver 服務的名字空間>
    name: <拓展 Apiserver 服務的名稱>
  caBundle: <PEM 編碼的 CA 證書，用於對 Webhook 伺服器的證書籤名>
```

<!--
The name of an APIService object must be a valid
[path segment name](/docs/concepts/overview/working-with-objects/names#path-segment-names).
-->
APIService 物件的名稱必須是合法的
[路徑片段名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#path-segment-names)。

<!--
#### Contacting the extension apiserver

Once the Kubernetes apiserver has determined a request should be sent to an extension apiserver,
it needs to know how to contact it.

The `service` stanza is a reference to the service for an extension apiserver.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of an extension apiserver that is configured to be called on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.
-->
#### 呼叫擴充套件 apiserver

一旦 Kubernetes apiserver 確定應將請求傳送到擴充套件 apiserver，
它需要知道如何呼叫它。

`service` 部分是對擴充套件 apiserver 的服務的引用。
服務的名字空間和名字是必需的。埠是可選的，預設為 443。
路徑配置是可選的，預設為 `/`。

下面是為可在埠 `1234` 上呼叫的擴充套件 apiserver 的配置示例
服務位於子路徑 `/my-path` 下，並針對 ServerName
`my-service-name.my-service-namespace.svc`
使用自定義的 CA 包來驗證 TLS 連線
使用自定義 CA 捆綁包的`my-service-name.my-service-namespace.svc`。

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
...
spec:
  ...
  service:
    namespace: my-service-namespace
    name: my-service-name
    port: 1234
  caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

## {{% heading "whatsnext" %}}

<!--
* [Setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->

* 使用聚合層[安裝擴充套件 API 伺服器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)。
* 有關高階概述，請參閱[使用聚合層擴充套件 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)。
* 瞭解如何[使用自定義資源擴充套件 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
