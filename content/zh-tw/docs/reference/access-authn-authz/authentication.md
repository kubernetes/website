---
title: 使用者認證
content_type: concept
weight: 10
---
<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authenticating
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This page provides an overview of authentication in Kubernetes, with a focus on
authentication to the [Kubernetes API](/docs/concepts/overview/kubernetes-api/).
-->
本頁提供 Kubernetes 中身份認證有關的概述，重點介紹與
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 有關的身份認證。

<!-- body -->
<!--
## Users in Kubernetes

All Kubernetes clusters have two categories of users: service accounts managed
by Kubernetes, and normal users.

It is assumed that a cluster-independent service manages normal users in the following ways:

- an administrator distributing private keys
- a user store like Keystone or Google Accounts
- a file with a list of usernames and passwords

In this regard, _Kubernetes does not have objects which represent normal user accounts._
Normal users cannot be added to a cluster through an API call.
-->
## Kubernetes 中的使用者  {#users-in-kubernetes}

所有 Kubernetes 叢集都有兩類使用者：由 Kubernetes 管理的服務賬號和普通使用者。

Kubernetes 假定普通使用者是由一個與叢集無關的服務通過以下方式之一進行管理的：

- 負責分發私鑰的管理員
- 類似 Keystone 或者 Google Account 這類使用者數據庫
- 包含使用者名和密碼列表的文件

有鑑於此，**Kubernetes 並不包含用來代表普通使用者賬號的對象**。
普通使用者的信息無法通過 API 調用添加到叢集中。

<!--
Even though a normal user cannot be added via an API call, any user that
presents a valid certificate signed by the cluster's certificate authority
(CA) is considered authenticated. In this configuration, Kubernetes determines
the username from the common name field in the 'subject' of the cert (e.g.,
"/CN=bob"). From there, the role based access control (RBAC) sub-system would
determine whether the user is authorized to perform a specific operation on a
resource.
-->
儘管無法通過 API 調用來添加普通使用者，
Kubernetes 仍然認爲能夠提供由叢集的證書機構簽名的合法證書的使用者是通過身份認證的使用者。
基於這樣的設定，Kubernetes 使用證書中的 'subject' 的通用名稱（Common Name）字段
（例如，"/CN=bob"）來確定使用者名。
接下來，基於角色訪問控制（RBAC）子系統會確定使用者是否有權針對某資源執行特定的操作。

<!--
In contrast, service accounts are users managed by the Kubernetes API. They are
bound to specific namespaces, and created automatically by the API server or
manually through API calls. Service accounts are tied to a set of credentials
stored as `Secrets`, which are mounted into pods allowing in-cluster processes
to talk to the Kubernetes API.

API requests are tied to either a normal user or a service account, or are treated
as [anonymous requests](#anonymous-requests). This means every process inside or outside the cluster, from
a human user typing `kubectl` on a workstation, to `kubelets` on nodes, to members
of the control plane, must authenticate when making requests to the API server,
or be treated as an anonymous user.
-->
與此不同，服務賬號是 Kubernetes API 所管理的使用者。它們被綁定到特定的名字空間，
或者由 API 伺服器自動創建，或者通過 API 調用創建。服務賬號與一組以 Secret
保存的憑據相關，這些憑據會被掛載到 Pod 中，從而允許叢集內的進程訪問 Kubernetes API。

API 請求則或者與某普通使用者相關聯，或者與某服務賬號相關聯，
亦或者被視作[匿名請求](#anonymous-requests)。這意味着叢集內外的每個進程在向 API
伺服器發起請求時都必須通過身份認證，否則會被視作匿名使用者。這裏的進程可以是在某工作站上輸入
`kubectl` 命令的操作人員，也可以是節點上的 `kubelet` 組件，還可以是控制面的成員。

<!--
## Authentication strategies

Kubernetes uses client certificates, bearer tokens, or an authenticating proxy to
authenticate API requests through authentication plugins. As HTTP requests are
made to the API server, plugins attempt to associate the following attributes
with the request:
-->
## 身份認證策略  {#authentication-strategies}

Kubernetes 通過身份認證插件利用客戶端證書、持有者令牌（Bearer Token）或身份認證代理（Proxy）
來認證 API 請求的身份。HTTP 請求發給 API 伺服器時，插件會將以下屬性關聯到請求本身：

<!--
* Username: a string which identifies the end user. Common values might be `kube-admin` or `jane@example.com`.
* UID: a string which identifies the end user and attempts to be more consistent and unique than username.
* Groups: a set of strings, each of which indicates the user's membership in a named logical collection of users.
  Common values might be `system:masters` or `devops-team`.
* Extra fields: a map of strings to list of strings which holds additional information authorizers may find useful.
-->
* 使用者名：用來辯識最終使用者的字符串。常見的值可以是 `kube-admin` 或 `jane@example.com`。
* 使用者 ID：用來辯識最終使用者的字符串，旨在比使用者名有更好的一致性和唯一性。
* 使用者組：取值爲一組字符串，其中各個字符串用來標明使用者是某個命名的使用者邏輯集合的成員。
  常見的值可能是 `system:masters` 或者 `devops-team` 等。
* 附加字段：一組額外的鍵-值映射，鍵是字符串，值是一組字符串；
  用來保存一些鑑權組件可能覺得有用的額外信息。

<!--
All values are opaque to the authentication system and only hold significance
when interpreted by an [authorizer](/docs/reference/access-authn-authz/authorization/).

You can enable multiple authentication methods at once. You should usually use at least two methods:

- service account tokens for service accounts
- at least one other method for user authentication.
-->
所有（屬性）值對於身份認證系統而言都是不透明的，
只有被[鑑權組件](/zh-cn/docs/reference/access-authn-authz/authorization/)解釋過之後纔有意義。

你可以同時啓用多種身份認證方法，並且你通常會至少使用兩種方法：

- 針對服務賬號使用服務賬號令牌
- 至少另外一種方法對使用者的身份進行認證

<!--
When multiple authenticator modules are enabled, the first module
to successfully authenticate the request short-circuits evaluation.
The API server does not guarantee the order authenticators run in.

The `system:authenticated` group is included in the list of groups for all authenticated users.

Integrations with other authentication protocols (LDAP, SAML, Kerberos, alternate x509 schemes, etc)
can be accomplished using an [authenticating proxy](#authenticating-proxy) or the
[authentication webhook](#webhook-token-authentication).
-->
當叢集中啓用了多個身份認證模塊時，第一個成功地對請求完成身份認證的模塊會直接做出評估決定。
API 伺服器並不保證身份認證模塊的運行順序。

對於所有通過身份認證的使用者，`system:authenticated` 組都會被添加到其組列表中。

與其它身份認證協議（LDAP、SAML、Kerberos、X509 的替代模式等等）
都可以通過使用一個[身份認證代理](#authenticating-proxy)或[身份認證 Webhoook](#webhook-token-authentication)
來實現。

<!--
### X509 Client certificates

Client certificate authentication is enabled by passing the `--client-ca-file=SOMEFILE`
option to API server. The referenced file must contain one or more certificate authorities
to use to validate client certificates presented to the API server. If a client certificate
is presented and verified, the common name of the subject is used as the user name for the
request. As of Kubernetes 1.4, client certificates can also indicate a user's group memberships
using the certificate's organization fields. To include multiple group memberships for a user,
include multiple organization fields in the certificate.

For example, using the `openssl` command line tool to generate a certificate signing request:
-->
### X509 客戶證書   {#x509-client-certs}

通過給 API 伺服器傳遞 `--client-ca-file=SOMEFILE` 選項，就可以啓動客戶端證書身份認證。
所引用的文件必須包含一個或者多個證書機構，用來驗證向 API 伺服器提供的客戶端證書。
如果提供了客戶端證書並且證書被驗證通過，則 subject 中的公共名稱（Common Name）
就被作爲請求的使用者名。
自 Kubernetes 1.4 開始，客戶端證書還可以通過證書的 organization 字段標明使用者的組成員信息。
要包含使用者的多個組成員信息，可以在證書中包含多個 organization 字段。

例如，使用 `openssl` 命令列工具生成一個證書籤名請求：

```bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

<!--
This would create a CSR for the username "jbeda", belonging to two groups, "app1" and "app2".

See [Managing Certificates](/docs/tasks/administer-cluster/certificates/) for how to generate a client cert.
-->
此命令將使用使用者名 `jbeda` 生成一個證書籤名請求（CSR），且該使用者屬於 "app1" 和
"app2" 兩個使用者組。

參閱[管理證書](/zh-cn/docs/tasks/administer-cluster/certificates/)瞭解如何生成客戶端證書。

<!--
### Static token file

The API server reads bearer tokens from a file when given the `--token-auth-file=SOMEFILE` option
on the command line.  Currently, tokens last indefinitely, and the token list cannot be
changed without restarting the API server.

The token file is a csv file with a minimum of 3 columns: token, user name, user uid,
followed by optional group names.
-->
### 靜態令牌文件  {#static-token-file}

當 API 伺服器的命令列設置了 `--token-auth-file=SOMEFILE` 選項時，會從文件中讀取持有者令牌。
目前，令牌會長期有效，並且在不重啓 API 伺服器的情況下無法更改令牌列表。

令牌文件是一個 CSV 文件，包含至少 3 個列：令牌、使用者名和使用者的 UID。
其餘列被視爲可選的組名。

{{< note >}}
<!--
If you have more than one group, the column must be double quoted e.g.
-->
如果要設置的組名不止一個，則對應的列必須用雙引號括起來，例如：

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

<!--
#### Putting a bearer token in a request

When using bearer token authentication from an http client, the API
server expects an `Authorization` header with a value of `Bearer
<token>`. The bearer token must be a character sequence that can be
put in an HTTP header value using no more than the encoding and
quoting facilities of HTTP. For example: if the bearer token is
`31ada4fd-adec-460c-809a-9e56ceb75269` then it would appear in an HTTP
header as shown below.
-->
#### 在請求中放入持有者令牌   {#putting-a-bearer-token-in-a-request}

當使用持有者令牌來對某 HTTP 客戶端執行身份認證時，API 伺服器希望看到一個名爲
`Authorization` 的 HTTP 頭，其值格式爲 `Bearer <token>`。
持有者令牌必須是一個可以放入 HTTP 頭部值字段的字符序列，至多可使用 HTTP 的編碼和引用機制。
例如：如果持有者令牌爲 `31ada4fd-adec-460c-809a-9e56ceb75269`，則其出現在 HTTP 頭部時如下所示：

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

<!--
### Bootstrap tokens
-->
### 啓動引導令牌    {#bootstrap-tokens}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
To allow for streamlined bootstrapping for new clusters, Kubernetes includes a
dynamically-managed Bearer token type called a *Bootstrap Token*. These tokens
are stored as Secrets in the `kube-system` namespace, where they can be
dynamically managed and created. Controller Manager contains a TokenCleaner
controller that deletes bootstrap tokens as they expire.
-->
爲了支持平滑地啓動引導新的叢集，Kubernetes 包含了一種動態管理的持有者令牌類型，
稱作 **啓動引導令牌（Bootstrap Token）**。
這些令牌以 Secret 的形式保存在 `kube-system` 名字空間中，可以被動態管理和創建。
控制器管理器包含的 `TokenCleaner` 控制器能夠在啓動引導令牌過期時將其刪除。

<!--
The tokens are of the form `[a-z0-9]{6}.[a-z0-9]{16}`. The first component is a
Token ID and the second component is the Token Secret. You specify the token
in an HTTP header as follows:
-->
這些令牌的格式爲 `[a-z0-9]{6}.[a-z0-9]{16}`。第一個部分是令牌的 ID；
第二個部分是令牌的 Secret。你可以用如下所示的方式來在 HTTP 頭部設置令牌：

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

<!--
You must enable the Bootstrap Token Authenticator with the
`--enable-bootstrap-token-auth` flag on the API Server. You must enable
the TokenCleaner controller via the `--controllers` flag on the Controller
Manager. This is done with something like `--controllers=*,tokencleaner`.
`kubeadm` will do this for you if you are using it to bootstrap a cluster.
-->
你必須在 API 伺服器上設置 `--enable-bootstrap-token-auth` 標誌來啓用基於啓動引導令牌的身份認證組件。
你必須通過控制器管理器的 `--controllers` 標誌來啓用 TokenCleaner 控制器；
這可以通過類似 `--controllers=*,tokencleaner` 這種設置來做到。
如果你使用 `kubeadm` 來啓動引導新的叢集，該工具會幫你完成這些設置。

<!--
The authenticator authenticates as `system:bootstrap:<Token ID>`. It is
included in the `system:bootstrappers` group. The naming and groups are
intentionally limited to discourage users from using these tokens past
bootstrapping. The user names and group can be used (and are used by `kubeadm`)
to craft the appropriate authorization policies to support bootstrapping a
cluster.
-->
身份認證組件的認證結果爲 `system:bootstrap:<令牌 ID>`，該使用者屬於
`system:bootstrappers` 使用者組。
這裏的使用者名和組設置都是有意設計成這樣，其目的是阻止使用者在啓動引導叢集之後繼續使用這些令牌。
這裏的使用者名和組名可以用來（並且已經被 `kubeadm` 用來）構造合適的鑑權策略，
以完成啓動引導新叢集的工作。

<!--
Please see [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) for in depth
documentation on the Bootstrap Token authenticator and controllers along with
how to manage these tokens with `kubeadm`.
-->
請參閱[啓動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)，
以瞭解關於啓動引導令牌身份認證組件與控制器的更深入的信息，以及如何使用
`kubeadm` 來管理這些令牌。

<!--
### Service account tokens

A service account is an automatically enabled authenticator that uses signed
bearer tokens to verify requests. The plugin takes two optional flags:

* `--service-account-key-file` File containing PEM-encoded x509 RSA or ECDSA
  private or public keys, used to verify ServiceAccount tokens. The specified file
  can contain multiple keys, and the flag can be specified multiple times with
  different files. If unspecified, --tls-private-key-file is used.
* `--service-account-lookup` If enabled, tokens which are deleted from the API will be revoked.
-->
### 服務賬號令牌   {#service-account-tokens}

服務賬號（Service Account）是一種自動被啓用的使用者認證機制，使用經過簽名的持有者令牌來驗證請求。
該插件可接受兩個可選參數：

* `--service-account-key-file` 文件包含 PEM 編碼的 x509 RSA 或 ECDSA 私鑰或公鑰，
  用於驗證 ServiceAccount 令牌。這樣指定的文件可以包含多個密鑰，
  並且可以使用不同的文件多次指定此參數。若未指定，則使用 `--tls-private-key-file` 參數。
* `--service-account-lookup` 如果啓用，則從 API 刪除的令牌會被回收。

<!--
Service accounts are usually created automatically by the API server and
associated with pods running in the cluster through the `ServiceAccount`
[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). Bearer tokens are
mounted into pods at well-known locations, and allow in-cluster processes to
talk to the API server. Accounts may be explicitly associated with pods using the
`serviceAccountName` field of a `PodSpec`.
-->
服務賬號通常由 API 伺服器自動創建並通過 `ServiceAccount`
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)關聯到叢集中運行的 Pod 上。
持有者令牌會掛載到 Pod 中可預知的位置，允許叢集內進程與 API 伺服器通信。
服務賬號也可以使用 Pod 規約的 `serviceAccountName` 字段顯式地關聯到 Pod 上。

{{< note >}}
<!--
`serviceAccountName` is usually omitted because this is done automatically.
-->
`serviceAccountName` 通常會被忽略，因爲關聯關係是自動建立的。
{{< /note >}}

<!--
```yaml
apiVersion: apps/v1 # this apiVersion is relevant as of Kubernetes 1.9
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```
-->
```yaml
apiVersion: apps/v1 # 此 apiVersion 從 Kubernetes 1.9 開始可用
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```

<!--
Service account bearer tokens are perfectly valid to use outside the cluster and
can be used to create identities for long standing jobs that wish to talk to the
Kubernetes API. To manually create a service account, use the `kubectl create
serviceaccount (NAME)` command. This creates a service account in the current
namespace.
-->
在叢集外部使用服務賬號持有者令牌也是完全合法的，且可用來爲長時間運行的、需要與 Kubernetes
API 伺服器通信的任務創建標識。要手動創建服務賬號，可以使用
`kubectl create serviceaccount <名稱>` 命令。
此命令會在當前的名字空間中生成一個服務賬號。

```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount/jenkins created
```

<!--
Create an associated token:
-->
創建相關聯的令牌：

```bash
kubectl create token jenkins
```

```none
eyJhbGciOiJSUzI1NiIsImtp...
```

<!--
The created token is a signed JSON Web Token (JWT).
-->
所創建的令牌是一個已簽名的 JWT 令牌。

<!--
The signed JWT can be used as a bearer token to authenticate as the given service
account. See [above](#putting-a-bearer-token-in-a-request) for how the token is included
in a request. Normally these tokens are mounted into pods for in-cluster access to
the API server, but can be used from outside the cluster as well.
-->
已簽名的 JWT 可以用作持有者令牌，並將被認證爲所給的服務賬號。
關於如何在請求中包含令牌，請參閱[前文](#putting-a-bearer-token-in-a-request)。
通常，這些令牌數據會被掛載到 Pod 中以便叢集內訪問 API 伺服器時使用，
不過也可以在叢集外部使用。

<!--
Service accounts authenticate with the username `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`,
and are assigned to the groups `system:serviceaccounts` and `system:serviceaccounts:(NAMESPACE)`.
-->
服務賬號被身份認證後，所確定的使用者名爲 `system:serviceaccount:<名字空間>:<服務賬號>`，
並被分配到使用者組 `system:serviceaccounts` 和 `system:serviceaccounts:<名字空間>`。

{{< warning >}}
<!--
Because service account tokens can also be stored in Secret API objects, any user with
write access to Secrets can request a token, and any user with read access to those
Secrets can authenticate as the service account. Be cautious when granting permissions
to service accounts and read or write capabilities for Secrets.
-->
由於服務賬號令牌也可以保存在 Secret API 對象中，任何能夠寫入這些 Secret
的使用者都可以請求一個令牌，且任何能夠讀取這些 Secret 的使用者都可以被認證爲對應的服務賬號。
在爲使用者授予訪問服務賬號的權限以及對 Secret 的讀取或寫入權能時，要格外小心。
{{< /warning >}}

<!--
### OpenID Connect Tokens

[OpenID Connect](https://openid.net/connect/) is a flavor of OAuth2 supported by
some OAuth2 providers, notably Microsoft Entra ID, Salesforce, and Google.
The protocol's main extension of OAuth2 is an additional field returned with
the access token called an [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken).
This token is a JSON Web Token (JWT) with well known fields, such as a user's
email, signed by the server.
-->
### OpenID Connect（OIDC）令牌   {#openid-connect-tokens}

[OpenID Connect](https://openid.net/connect/) 是一種 OAuth2 認證方式，
被某些 OAuth2 提供者支持，例如 Microsoft Entra ID、Salesforce 和 Google。
協議對 OAuth2 的主要擴充體現在有一個附加字段會和訪問令牌一起返回，
這一字段稱作 [ID Token（ID 令牌）](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)。
ID 令牌是一種由伺服器簽名的 JWT 令牌，其中包含一些可預知的字段，
例如使用者的郵箱地址，

<!--
To identify the user, the authenticator uses the `id_token` (not the `access_token`)
from the OAuth2 [token response](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
as a bearer token. See [above](#putting-a-bearer-token-in-a-request) for how the token
is included in a request.
-->
要識別使用者，身份認證組件使用 OAuth2
[令牌響應](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)中的
`id_token`（而非 `access_token`）作爲持有者令牌。
關於如何在請求中設置令牌，可參見[前文](#putting-a-bearer-token-in-a-request)。

{{< mermaid >}}
sequenceDiagram
    participant user as 使用者
    participant idp as 身份提供者
    participant kube as kubectl
    participant api as API 伺服器

    user ->> idp: 1. 登錄到 IdP
    activate idp
    idp -->> user: 2. 提供 access_token,<br>id_token, 和 refresh_token
    deactivate idp
    activate user
    user ->> kube: 3. 調用 kubectl 並<br>設置 --token 爲 id_token<br>或者將令牌添加到 .kube/config
    deactivate user
    activate kube
    kube ->> api: 4. Authorization: Bearer...
    deactivate kube
    activate api
    api ->> api: 5. JWT 簽名合法麼？
    api ->> api: 6. JWT 是否已過期？(iat+exp)
    api ->> api: 7. 使用者被授權了麼？
    api -->> kube: 8. 已授權：執行<br>操作並返回結果
    deactivate api
    activate kube
    kube --x user: 9. 返回結果
    deactivate kube
{{< /mermaid >}}

<!--
1. Log in to your identity provider
1. Your identity provider will provide you with an `access_token`, `id_token` and a `refresh_token`
1. When using `kubectl`, use your `id_token` with the `--token` flag or add it directly to your `kubeconfig`
1. `kubectl` sends your `id_token` in a header called Authorization to the API server
1. The API server will make sure the JWT signature is valid
1. Check to make sure the `id_token` hasn't expired

   Perform claim and/or user validation if CEL expressions are configured with `AuthenticationConfiguration`.
-->
1. 登錄到你的身份服務（Identity Provider）
2. 你的身份服務將爲你提供 `access_token`、`id_token` 和 `refresh_token`
3. 在使用 `kubectl` 時，將 `id_token` 設置爲 `--token` 標誌值，或者將其直接添加到
   `kubeconfig` 中
4. `kubectl` 將你的 `id_token` 放到一個稱作 `Authorization` 的頭部，發送給 API 伺服器
5. API 伺服器將確保 JWT 的簽名是有效的
6. 檢查確認 `id_token` 尚未過期

   如果使用 `AuthenticationConfiguration` 設定了 CEL 表達式，則執行申領和/或使用者驗證。

<!--
1. Make sure the user is authorized
1. Once authorized the API server returns a response to `kubectl`
1. `kubectl` provides feedback to the user
-->
7. 確認使用者有權限執行操作
8. 鑑權成功之後，API 伺服器向 `kubectl` 返回響應
9. `kubectl` 向使用者提供反饋信息

<!--
Since all of the data needed to validate who you are is in the `id_token`, Kubernetes doesn't need to
"phone home" to the identity provider. In a model where every request is stateless this provides a
very scalable solution for authentication. It does offer a few challenges:
-->
由於用來驗證你是誰的所有數據都在 `id_token` 中，Kubernetes 不需要再去聯繫身份服務。
在一個所有請求都是無狀態請求的模型中，這一工作方式可以使得身份認證的解決方案更容易處理大規模請求。
不過，此訪問也有一些挑戰：

<!--
1. Kubernetes has no "web interface" to trigger the authentication process. There is no browser or
   interface to collect credentials which is why you need to authenticate to your identity provider first.
1. The `id_token` can't be revoked, it's like a certificate so it should be short-lived (only a few minutes)
   so it can be very annoying to have to get a new token every few minutes.
1. To authenticate to the Kubernetes dashboard, you must use the `kubectl proxy` command or a reverse proxy
   that injects the `id_token`.
-->
1. Kubernetes 沒有提供用來觸發身份認證過程的 "Web 界面"。
   因爲不存在用來收集使用者憑據的瀏覽器或使用者接口，你必須自己先行完成對身份服務的認證過程。
2. `id_token` 令牌不可收回。因其屬性類似於證書，其生命期一般很短（只有幾分鐘），
   所以，每隔幾分鐘就要獲得一個新的令牌這件事可能很讓人頭疼。
3. 如果需要向 Kubernetes 控制面板執行身份認證，你必須使用 `kubectl proxy`
   命令或者一個能夠注入 `id_token` 的反向代理。

<!--
#### Configuring the API Server

##### Using flags

To enable the plugin, configure the following flags on the API server:
-->
#### 設定 API 伺服器    {#configuring-the-api-server}

##### 使用標誌

要啓用此插件，須在 API 伺服器上設定以下標誌：

<!--
| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL of the provider that allows the API server to discover public signing keys. Only URLs that use the `https://` scheme are accepted. This is typically the provider's discovery URL, changed to have an empty path. | If the issuer's OIDC discovery URL is `https://accounts.provider.example/.well-known/openid-configuration`, the value should be `https://accounts.provider.example` | Yes |
| `--oidc-client-id` |  A client id that all tokens must be issued for. | kubernetes | Yes |
| `--oidc-username-claim` | JWT claim to use as the user name. By default `sub`, which is expected to be a unique identifier of the end user. Admins can choose other claims, such as `email` or `name`, depending on their provider. However, claims other than `email` will be prefixed with the issuer URL to prevent naming clashes with other plugins. | sub | No |
| `--oidc-username-prefix` | Prefix prepended to username claims to prevent clashes with existing names (such as `system:` users). For example, the value `oidc:` will create usernames like `oidc:jane.doe`. If this flag isn't provided and `--oidc-username-claim` is a value other than `email` the prefix defaults to `( Issuer URL )#` where `( Issuer URL )` is the value of `--oidc-issuer-url`. The value `-` can be used to disable all prefixing. | `oidc:` | No |
| `--oidc-groups-claim` | JWT claim to use as the user's group. If the claim is present it must be an array of strings. | groups | No |
| `--oidc-groups-prefix` | Prefix prepended to group claims to prevent clashes with existing names (such as `system:` groups). For example, the value `oidc:` will create group names like `oidc:engineering` and `oidc:infra`. | `oidc:` | No |
| `--oidc-required-claim` | A key=value pair that describes a required claim in the ID Token. If set, the claim is verified to be present in the ID Token with a matching value. Repeat this flag to specify multiple claims. | `claim=value` | No |
| `--oidc-ca-file` | The path to the certificate for the CA that signed your identity provider's web certificate. Defaults to the host's root CAs. | `/etc/kubernetes/ssl/kc-ca.pem` | No |
| `--oidc-signing-algs` | The signing algorithms accepted. Default is RS256. Allowed values are: RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512. Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1. | `RS512` | No |
-->
| 參數 | 描述 | 示例 | 必需？ |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | 允許 API 伺服器發現公開的簽名密鑰的服務的 URL。只接受模式爲 `https://` 的 URL。此值通常設置爲服務的發現 URL，已更改爲空路徑。 | 如果發行人的 OIDC 發現 URL 是 `https://accounts.google.com/.well-known/openid-configuration`，則此值應爲 `https://accounts.provider.example` | 是 |
| `--oidc-client-id` |  所有令牌都應發放給此客戶 ID。 | kubernetes | 是 |
| `--oidc-username-claim` | 用作使用者名的 JWT 申領（JWT Claim）。默認情況下使用 `sub` 值，即最終使用者的一個唯一的標識符。管理員也可以選擇其他申領，例如 `email` 或者 `name`，取決於所用的身份服務。不過，除了 `email` 之外的申領都會被添加令牌發放者的 URL 作爲前綴，以免與其他插件產生命名衝突。 | sub | 否 |
| `--oidc-username-prefix` | 要添加到使用者名申領之前的前綴，用來避免與現有使用者名發生衝突（例如：`system:` 使用者）。例如，此標誌值爲 `oidc:` 時將創建形如 `oidc:jane.doe` 的使用者名。如果此標誌未設置，且 `--oidc-username-claim` 標誌值不是 `email`，則默認前綴爲 `<令牌發放者的 URL>#`，其中 `<令牌發放者 URL >` 的值取自 `--oidc-issuer-url` 標誌的設定。此標誌值爲 `-` 時，意味着禁止添加使用者名前綴。 | `oidc:` | 否 |
| `--oidc-groups-claim` | 用作使用者組名的 JWT 申領。如果所指定的申領確實存在，則其值必須是一個字符串數組。 | groups | 否 |
| `--oidc-groups-prefix` | 添加到組申領的前綴，用來避免與現有使用者組名（如：`system:` 組）發生衝突。例如，此標誌值爲 `oidc:` 時，所得到的使用者組名形如 `oidc:engineering` 和 `oidc:infra`。 | `oidc:` | 否 |
| `--oidc-required-claim` | 取值爲一個 key=value 偶對，意爲 ID 令牌中必須存在的申領。如果設置了此標誌，則 ID 令牌會被檢查以確定是否包含取值匹配的申領。此標誌可多次重複，以指定多個申領。 | `claim=value` | 否 |
| `--oidc-ca-file` | 指向一個 CA 證書的路徑，該 CA 負責對你的身份服務的 Web 證書提供簽名。默認值爲宿主系統的根 CA。 | `/etc/kubernetes/ssl/kc-ca.pem` | 否 |
| `--oidc-signing-algs` | 採納的簽名算法。默認爲 "RS256"。可選值爲：RS256、RS384、RS512、ES256、ES384、ES512、PS256、PS384、PS512。值由 RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1 定義。| `RS512` | 否 |

<!--
##### Authentication configuration from a file {#using-authentication-configuration}
-->
##### 來自文件的身份認證設定   {#using-authentication-configuration}

{{< feature-state feature_gate_name="StructuredAuthenticationConfiguration" >}}

<!--
JWT Authenticator is an authenticator to authenticate Kubernetes users using JWT compliant tokens.
The authenticator will attempt to parse a raw ID token, verify it's been signed by the configured issuer.
The public key to verify the signature is discovered from the issuer's public endpoint using OIDC discovery.

The minimum valid JWT payload must contain the following claims:
-->
JWT Authenticator 是一個使用 JWT 兼容令牌對 Kubernetes 使用者進行身份認證的認證組件。
認證組件將嘗試解析原始 ID 令牌，驗證它是否是由所設定的頒發者簽名。
用於驗證簽名的公鑰是使用 OIDC 發現從發行者的公共端點發現的。

最小有效 JWT 負載必須包含以下申領：

<!--
```json
{
  "iss": "https://example.com",   // must match the issuer.url
  "aud": ["my-app"],              // at least one of the entries in issuer.audiences must match the "aud" claim in presented JWTs.
  "exp": 1234567890,              // token expiration as Unix time (the number of seconds elapsed since January 1, 1970 UTC)
  "<username-claim>": "user"      // this is the username claim configured in the claimMappings.username.claim or claimMappings.username.expression
}
```
-->
```json
{
  "iss": "https://example.com",   // 必須與 issuer.url 匹配
  "aud": ["my-app"],              // issuer.audiences 中至少一項必須與所提供的 JWT 中的 "aud" 申領相匹配。
  "exp": 1234567890,              // 令牌過期時間爲 UNIX 時間（自 1970 年 1 月 1 日 UTC 以來經過的秒數）
  "<username-claim>": "user"      // 這是在 claimMappings.username.claim 或 claimMappings.username.expression 中配置的用戶名申領
}
```

<!--
The configuration file approach allows you to configure multiple JWT authenticators, each with a unique
`issuer.url` and `issuer.discoveryURL`. The configuration file even allows you to specify [CEL](/docs/reference/using-api/cel/)
expressions to map claims to user attributes, and to validate claims and user information.
The API server also automatically reloads the authenticators when the configuration file is modified.
You can use `apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds` metric
to monitor the last time the configuration was reloaded by the API server.
-->
設定文件方法允許你設定多個 JWT 認證組件，每個身份認證組件都有唯一的 `issuer.url` 和 `issuer.discoveryURL`。
設定文件甚至允許你指定 [CEL](/zh-cn/docs/reference/using-api/cel/)
表達式以將申領映射到使用者屬性，並驗證申領和使用者信息。
當設定文件修改時，API 伺服器還會自動重新加載認證組件。
你可以使用 `apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds`
指標來監控 API 伺服器上次重新加載設定的時間。

<!--
You must specify the path to the authentication configuration using the `--authentication-config` flag
on the API server. If you want to use command line flags instead of the configuration file, those will
continue to work as-is. To access the new capabilities like configuring multiple authenticators,
setting multiple audiences for an issuer, switch to using the configuration file.
-->
你必須使用 API 伺服器上的 `--authentication-config` 標誌指定身份認證設定的路徑。
如果你想使用命令列標誌而不是設定文件，命令列標誌仍然有效。
要使用新功能（例如設定多個認證組件、爲發行者設置多個受衆），請切換到使用設定文件。

<!--
For Kubernetes v{{< skew currentVersion >}}, the structured authentication configuration file format
is beta-level, and the mechanism for using that configuration is also beta. Provided you didn't specifically
disable the `StructuredAuthenticationConfiguration`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for your cluster,
you can turn on structured authentication by specifying the `--authentication-config` command line
argument to the kube-apiserver. An example of the structured authentication configuration file is shown below.
-->
對於 Kubernetes v{{< skew currentVersion >}}，
結構化身份認證設定文件格式是 Beta 級別，並且使用該設定的機制也是 Beta 級別。
如果你沒有禁用叢集的 `StructuredAuthenticationConfiguration`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
則可以通過爲 kube-apiserver 指定 `--authentication-config` 命令列參數來啓用結構化身份認證。
下面給出的是一個結構化身份認證設定文件的示例：

{{< note >}}
<!--
If you specify `--authentication-config` along with any of the `--oidc-*` command line arguments, this is
a misconfiguration. In this situation, the API server reports an error and then immediately exits.
If you want to switch to using structured authentication configuration, you have to remove the `--oidc-*`
command line arguments, and use the configuration file instead.
-->
你不能同時指定 `--authentication-config` 和 `--oidc-*` 命令列參數，
否則 API 伺服器會報告錯誤，然後立即退出。
如果你想切換到使用結構化身份認證設定，則必須刪除 `--oidc-*` 命令列參數，並改用設定文件。
{{< /note >}}

{{< feature-state feature_gate_name="StructuredAuthenticationConfigurationEgressSelector" >}}

<!--
The _egressSelectorType_ field in the JWT issuer configuration allows you to specify which egress selector
should be used for sending all traffic related to the issuer (discovery, JWKS, distributed claims, etc).
This feature requires the `StructuredAuthenticationConfigurationEgressSelector` feature gate to be enabled.
-->
JWT 發行者設定中的 **egressSelectorType**
字段允許你指定應使用哪個出口選擇器來發送與發行者相關的所有流量（發現、JWKS、分佈式申領等）。
此特性要求啓用 `StructuredAuthenticationConfigurationEgressSelector` 特性門控。

<!--
```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
# list of authenticators to authenticate Kubernetes users using JWT compliant tokens.
# the maximum number of allowed authenticators is 64.
jwt:
- issuer:
    # url must be unique across all authenticators.
    # url must not conflict with issuer configured in --service-account-issuer.
    url: https://example.com # Same as --oidc-issuer-url.
    # discoveryURL, if specified, overrides the URL used to fetch discovery
    # information instead of using "{url}/.well-known/openid-configuration".
    # The exact value specified is used, so "/.well-known/openid-configuration"
    # must be included in discoveryURL if needed.
    #
    # The "issuer" field in the fetched discovery information must match the "issuer.url" field
    # in the AuthenticationConfiguration and will be used to validate the "iss" claim in the presented JWT.
    # This is for scenarios where the well-known and jwks endpoints are hosted at a different
    # location than the issuer (such as locally in the cluster).
    # discoveryURL must be different from url if specified and must be unique across all authenticators.
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM encoded CA certificates used to validate the connection when fetching
    # discovery information. If not set, the system verifier will be used.
    # Same value as the content of the file referenced by the --oidc-ca-file flag.
    certificateAuthority: <PEM encoded CA certificates>
    # audiences is the set of acceptable audiences the JWT must be issued to.
    # At least one of the entries must match the "aud" claim in presented JWTs.
    audiences:
    - my-app # Same as --oidc-client-id.
    - my-other-app
    # this is required to be set to "MatchAny" when multiple audiences are specified.
    audienceMatchPolicy: MatchAny
    # egressSelectorType is an indicator of which egress selection should be used for sending all traffic related
    # to this issuer (discovery, JWKS, distributed claims, etc).  If unspecified, no custom dialer is used.
    # When specified, the valid choices are "controlplane" and "cluster".  These correspond to the associated
    # values in the --egress-selector-config-file.
    # - controlplane: for traffic intended to go to the control plane.
    # - cluster: for traffic intended to go to the system being managed by Kubernetes.
    egressSelectorType: <egress-selector-type>
  # rules applied to validate token claims to authenticate users.
  claimValidationRules:
    # Same as --oidc-required-claim key=value.
  - claim: hd
    requiredValue: example.com
    # Instead of claim and requiredValue, you can use expression to validate the claim.
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for validation to succeed.
  - expression: 'claims.hd == "example.com"'
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: the hd claim must be set to example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: total token lifetime must not exceed 24 hours
  claimMappings:
    # username represents an option for the username attribute.
    # This is the only required attribute.
    username:
      # Same as --oidc-username-claim. Mutually exclusive with username.expression.
      claim: "sub"
      # Same as --oidc-username-prefix. Mutually exclusive with username.expression.
      # if username.claim is set, username.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with username.claim and username.prefix.
      # expression is a CEL expression that evaluates to a string.
      #
      # 1.  If username.expression uses 'claims.email', then 'claims.email_verified' must be used in
      #     username.expression or extra[*].valueExpression or claimValidationRules[*].expression.
      #     An example claim validation rule expression that matches the validation automatically
      #     applied when username.claim is set to 'email' is 'claims.?email_verified.orValue(true) == true'.
      #     By explicitly comparing the value to true, we let type-checking see the result will be a boolean, and
      #     to make sure a non-boolean email_verified claim will be caught at runtime.
      # 2.  If the username asserted based on username.expression is the empty string, the authentication
      #     request will fail.
      expression: 'claims.username + ":external-user"'
    # groups represents an option for the groups attribute.
    groups:
      # Same as --oidc-groups-claim. Mutually exclusive with groups.expression.
      claim: "sub"
      # Same as --oidc-groups-prefix. Mutually exclusive with groups.expression.
      # if groups.claim is set, groups.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with groups.claim and groups.prefix.
      # expression is a CEL expression that evaluates to a string or a list of strings.
      expression: 'claims.roles.split(",")'
    # uid represents an option for the uid attribute.
    uid:
      # Mutually exclusive with uid.expression.
      claim: 'sub'
      # Mutually exclusive with uid.claim
      # expression is a CEL expression that evaluates to a string.
      expression: 'claims.sub'
    # extra attributes to be added to the UserInfo object. Keys must be domain-prefix path and must be unique.
    extra:
      # key is a string to use as the extra attribute key.
      # key must be a domain-prefix path (e.g. example.org/foo). All characters before the first "/" must be a valid
      # subdomain as defined by RFC 1123. All characters trailing the first "/" must
      # be valid HTTP Path characters as defined by RFC 3986.
      # k8s.io, kubernetes.io and their subdomains are reserved for Kubernetes use and cannot be used.
      # key must be lowercase and unique across all extra attributes.
    - key: 'example.com/tenant'
      # valueExpression is a CEL expression that evaluates to a string or a list of strings.
      valueExpression: 'claims.tenant'
  # validation rules applied to the final user object.
  userValidationRules:
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for the user to be valid.
  - expression: "!user.username.startsWith('system:')"
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: 'username cannot used reserved system: prefix'
  - expression: "user.groups.all(group, !group.startsWith('system:'))"
    message: 'groups cannot used reserved system: prefix'
```
-->
```yaml
---
#
# 注意：這是一個示例配置，不要將其用於你自己的集羣！
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
# 使用 JWT 兼容令牌對 Kubernetes 用戶進行身份認證的認證組件列表，允許的最大認證組件數量爲 64。
jwt:
- issuer:
    # url 在所有認證組件中必須是唯一的。
    # url 不得與 --service-account-issuer 中配置的頒發者衝突。
    url: https://example.com # 與 --oidc-issuer-url 一致。
    # discoveryURL（如果指定）將覆蓋用於獲取發現信息的 URL，而不是使用 “{url}/.well-known/openid-configuration”。
    # 系統會使用所給的配置值，因此如果需要，“/.well-known/openid-configuration” 必須包含在 discoveryURL 中。
    #
    # 取回的發現信息中的 “issuer” 字段必須與 AuthenticationConfiguration 中的
    # “issuer.url” 字段匹配，並被用於驗證所呈現的 JWT 中的 “iss” 申領。
    # 這適用於衆所周知的端點和 jwks 端點託管在與頒發者不同的位置（例如集羣本地）的場景。
    # discoveryURL 必須與 url 不同（如果指定），並且在所有認證組件中必須是唯一的。
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM 編碼的 CA 證書用於在獲取發現信息時驗證連接。
    # 如果未設置，將使用系統驗證程序。
    # 與 --oidc-ca-file 標誌引用的文件內容的值相同。
    certificateAuthority: <PEM encoded CA certificates>    
    # audiences 是 JWT 必須發佈給的一組可接受的受衆。
    # 至少其中一項必須與所提供的 JWT 中的 “aud” 申領相匹配。
    audiences:
    - my-app # 與 --oidc-client-id 一致。
    - my-other-app
    # 當指定多個受衆時，需要將此字段設置爲 “MatchAny”。
    audienceMatchPolicy: MatchAny
    # egressSelectorType 是一個指示符，用於指定應使用哪個出口選擇器發送與此發行者相關的所有流量
    #（發現、JWKS、分佈式申領等）。  
    # 如果未指定，則不使用自定義撥號器。  
    # 當指定時，有效選項爲 "controlplane" 和 "cluster"。這些對應於
    # --egress-selector-config-file 中的相關值。  
    # - controlplane：用於打算發往控制平面的流量。  
    # - cluster：用於打算發往由 Kubernetes 管理的系統的流量。
    egressSelectorType: <egress-selector-type>
  # 用於驗證令牌申領以對用戶進行身份認證的規則。
  claimValidationRules:
    # 與 --oidc-required-claim key=value 一致
  - claim: hd
    requiredValue: example.com
    # 你可以使用表達式來驗證申領，而不是僅僅靠 claim 和 requiredValue 來執行檢查。
    # expression 是一個計算結果爲布爾值的 CEL 表達式。
    # 所有表達式的計算結果必須爲 true 才能使驗證成功。
  - expression: 'claims.hd == "example.com"'
    # message 用來定製驗證失敗時在 API 伺服器日誌中看到的錯誤消息。
    message: the hd claim must be set to example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: total token lifetime must not exceed 24 hours
  claimMappings:
    # username 表示用戶名屬性的選項。
    # 這是唯一必需的屬性。
    username:
      # 與 --oidc-username-claim 相同，與 username.expression 互斥。
      claim: "sub"
      # 與 --oidc-username-prefix 相同，與 username.expression 互斥。
      # 如果設置了username.claim，則需要username.prefix。
      # 如果不需要前綴，可顯式將其設置爲 ""。
      prefix: ""
      # 與 username.claim 和 username.prefix 互斥。
      # expression 是計算結果爲字符串的 CEL 表達式。
      #
      # 1.  如果 username.expression 使用 “claims.email”，則必須在 username.expression
      #     或 extra[*].valueExpression 或 ClaimValidationRules[*].expression 中使用 “claims.email_verified”。
      #     與 username.claim 設置爲 “email” 時自動應用的驗證相匹配的示例申領驗證規則表達式是
      #     “claims.?email_verified.orValue(true) == true”。
      #     通過顯式地將該值與 true 進行比較，可以讓類型檢查器識別出結果是布爾值，
      #     並確保在運行時能夠識別出任何非布爾類型的 email_verified 申領。
      # 2.  如果根據 username.expression 斷言的用戶名是空字符串，則身份認證請求將失敗。
      expression: 'claims.username + ":external-user"'
    # groups 代表 groups 屬性的一個選項。
    groups:
      # 與 --oidc-groups-claim 相同，與 groups.express 互斥。
      claim: "sub"
      # 與 --oidc-groups-prefix 相同。與 groups.express 互斥。
      # 如果設置了 groups.claim，則需要 groups.prefix。
      # 如果不需要前綴，則顯式將其設置爲 ""。
      prefix: ""
      # 與 groups.claim 和 groups.prefix 互斥。
      # expression 是一個計算結果爲字符串或字符串列表的 CEL 表達式。
      expression: 'claims.roles.split(",")'
    # uid 表示 uid 屬性的一個選項。
    uid:
      # 與 uid.expression 互斥。
      claim: 'sub'
      # 與 uid.claim 互斥
      # expression 是計算結果爲字符串的 CEL 表達式。
      expression: 'claims.sub'
    # 要添加到 UserInfo 對象的其他屬性，鍵必須是域前綴路徑並且必須是唯一的。
    extra:
      # key 是用作額外屬性鍵的字符串。
      # key 必須是域名前綴路徑（例如 example.org/foo）。
      # 第一個 "/" 之前的所有字符必須是 RFC 1123 定義的有效子域名。
      # 第一個 "/" 之後的所有字符必須是 RFC 3986 定義的有效 HTTP 路徑字符。
      # k8s.io, kubernetes.io 及其子域名保留供 Kubernetes 使用，不能使用。
      # key 必須是小寫，並且在所有額外屬性中唯一。
    - key: 'example.com/tenant'
      # valueExpression 是一個計算結果爲字符串或字符串列表的 CEL 表達式。
      valueExpression: 'claims.tenant'
  # 應用於最終用戶對象的驗證規則。
  userValidationRules:
    # expression 是一個計算結果爲布爾值的 CEL 表達式。
    # 所有表達式的計算結果必須爲 true，用戶纔有效。
  - expression: "!user.username.startsWith('system:')"
    # message 是自定義驗證失敗時在 API 伺服器日誌中看到的錯誤消息。
    message: 'username cannot used reserved system: prefix'
  - expression: "user.groups.all(group, !group.startsWith('system:'))"
    message: 'groups cannot used reserved system: prefix'
```

<!--
* Claim validation rule expression

  `jwt.claimValidationRules[i].expression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of the token payload, organized into `claims` CEL variable.
  `claims` is a map of claim names (as strings) to claim values (of any type).
-->
* 申領驗證規則表達式

  `jwt.claimValidationRules[i].expression` 表示將由 CEL 計算的表達式。
  CEL 表達式可以訪問令牌有效負載的內容，這些內容被組織成 `claims` CEL 變量。
  `claims` 是申領名稱（作爲字符串）到申領值（任何類型）的映射。

<!--
* User validation rule expression

  `jwt.userValidationRules[i].expression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of `userInfo`, organized into `user` CEL variable.
  Refer to the [UserInfo](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#userinfo-v1-authentication-k8s-io)
  API documentation for the schema of `user`.
-->
* 使用者驗證規則表達式

  `jwt.userValidationRules[i].expression` 表示將由 CEL 計算的表達式。
  CEL 表達式可以訪問 `userInfo` 的內容，並組織成 `user` CEL 變量。
  有關 `user` 的結構，請參閱
  [UserInfo](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#userinfo-v1-authentication-k8s-io)
  API 文檔。

<!--
* Claim mapping expression

  `jwt.claimMappings.username.expression`, `jwt.claimMappings.groups.expression`, `jwt.claimMappings.uid.expression`
  `jwt.claimMappings.extra[i].valueExpression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of the token payload, organized into `claims` CEL variable.
  `claims` is a map of claim names (as strings) to claim values (of any type).
-->
* 申領映射表達式

  `jwt.claimMappings.username.expression`、`jwt.claimMappings.groups.expression`、
  `jwt.claimMappings.uid.expression` `jwt.claimMappings.extra[i].valueExpression` 表示將由 CEL 計算的表達式。
  CEL 表達式可以訪問令牌有效負載的內容，這些內容被組織成 `claims` CEL 變量。
  `claims` 是申領名稱（作爲字符串）到申領值（任何類型）的映射。

  <!--
  To learn more, see the [Documentation on CEL](/docs/reference/using-api/cel/)

  Here are examples of the `AuthenticationConfiguration` with different token payloads.
  -->

  要了解更多信息，請參閱 [CEL 文檔](/zh-cn/docs/reference/using-api/cel/)。

  以下是具有不同令牌有效負載的 “AuthenticationConfiguration” 示例。

  {{< tabs name="example_configuration" >}}
  {{% tab name="合法的令牌" %}}
  <!--
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # the expression will evaluate to true, so validation will succeed.
      message: 'username cannot used reserved system: prefix'
  ```
  -->

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # 表達式的計算結果爲 true，因此驗證將成功。
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效負載是：

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will produce the following `UserInfo` object and successfully authenticate the user.
  -->
  具有上述 `AuthenticationConfiguration` 的令牌將生成以下 `UserInfo` 對象併成功對使用者進行身份認證。

  ```json
  {
       "username": "foo:external-user",
       "uid": "auth",
       "groups": [
           "user",
           "admin"
       ],
       "extra": {
           "example.com/tenant": ["72f988bf-86f1-41af-91ab-2d7cd011db4a"]
       }
  }
  ```

  {{% /tab %}}
  {{% tab name="申領校驗失敗" %}}
  <!--
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
       url: https://example.com
       audiences:
       - my-app
  claimValidationRules:
  - expression: 'claims.hd == "example.com"' # the token below does not have this claim, so validation will fail.
       message: the hd claim must be set to example.com
  claimMappings:
       username:
         expression: 'claims.username + ":external-user"'
       groups:
         expression: 'claims.roles.split(",")'
       uid:
         expression: 'claims.sub'
       extra:
       - key: 'example.com/tenant'
         valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # the expression will evaluate to true, so validation will succeed.
       message: 'username cannot used reserved system: prefix'
  ```
  -->

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
       url: https://example.com
       audiences:
       - my-app
  claimValidationRules:
  - expression: 'claims.hd == "example.com"' # 下面的令牌沒有此申領，因此驗證將失敗。
       message: the hd claim must be set to example.com
  claimMappings:
       username:
         expression: 'claims.username + ":external-user"'
       groups:
         expression: 'claims.roles.split(",")'
       uid:
         expression: 'claims.sub'
       extra:
       - key: 'example.com/tenant'
         valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # 該表達式的計算結果將爲 true，因此驗證將會成功。
       message: 'username cannot used reserved system: prefix'
  ```
  
  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效負載是：

  ```json
  {
    "aud": "kubernetes",
    "exp": 1703232949,
    "iat": 1701107233,
    "iss": "https://example.com",
    "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
    "nbf": 1701107233,
    "roles": "user,admin",
    "sub": "auth",
    "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
    "username": "foo"
  }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will fail to authenticate because the
  `hd` claim is not set to `example.com`. The API server will return `401 Unauthorized` error.
  -->
  具有上述 `AuthenticationConfiguration` 的令牌將無法進行身份認證，
  因爲 `hd` 申領未設置爲 `example.com`。API 伺服器將返回 `401 Unauthorized` 錯誤。
  {{% /tab %}}
  {{% tab name="使用者校驗失敗" %}}

  <!--
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"'
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: '"system:" + claims.username' # this will prefix the username with "system:" and will fail user validation.
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # the username will be system:foo and expression will evaluate to false, so validation will fail.
      message: 'username cannot used reserved system: prefix'
  ```
  -->

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"'
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: '"system:" + claims.username' # 這將爲用戶名添加前綴 “system:”，並且用戶驗證將失敗。
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # 用戶名將爲 system:foo 並且表達式將計算爲 false，因此驗證將失敗。
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJoZCI6ImV4YW1wbGUuY29tIiwiaWF0IjoxNzAxMTEzMTAxLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwianRpIjoiYjViMDY1MjM3MmNkMjBlMzQ1YjZmZGZmY2RjMjE4MWY0YWZkNmYyNTlhYWI0YjdlMzU4ODEyMzdkMjkyMjBiYyIsIm5iZiI6MTcwMTExMzEwMSwicm9sZXMiOiJ1c2VyLGFkbWluIiwic3ViIjoiYXV0aCIsInRlbmFudCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0YSIsInVzZXJuYW1lIjoiZm9vIn0.FgPJBYLobo9jnbHreooBlvpgEcSPWnKfX6dc0IvdlRB-F0dCcgy91oCJeK_aBk-8zH5AKUXoFTlInfLCkPivMOJqMECA1YTrMUwt_IVqwb116AqihfByUYIIqzMjvUbthtbpIeHQm2fF0HbrUqa_Q0uaYwgy8mD807h7sBcUMjNd215ff_nFIHss-9zegH8GI1d9fiBf-g6zjkR1j987EP748khpQh9IxPjMJbSgG_uH5x80YFuqgEWwq-aYJPQxXX6FatP96a2EAn7wfPpGlPRt0HcBOvq5pCnudgCgfVgiOJiLr_7robQu4T1bis0W75VPEvwWtgFcLnvcQx0JWg
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效負載是：

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "hd": "example.com",
      "iat": 1701113101,
      "iss": "https://example.com",
      "jti": "b5b0652372cd20e345b6fdffcdc2181f4afd6f259aab4b7e35881237d29220bc",
      "nbf": 1701113101,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will produce the following `UserInfo` object:
  -->
  具有上述 “AuthenticationConfiguration” 的令牌將生成以下 `UserInfo` 對象：

  ```json
  {
      "username": "system:foo",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": ["72f988bf-86f1-41af-91ab-2d7cd011db4a"]
      }
  }
  ```

  <!--
  which will fail user validation because the username starts with `system:`.
  The API server will return `401 Unauthorized` error.
  -->
  這將導致使用者驗證失敗，因爲使用者名以 `system:` 開頭。API 伺服器將返回 `401 Unauthorized` 錯誤。
  {{% /tab %}}
  {{< /tabs >}}

<!--
###### Limitations

1. Distributed claims do not work via [CEL](/docs/reference/using-api/cel/) expressions.
-->
###### 侷限性

1. 分佈式申領無法通過 [CEL](/zh-cn/docs/reference/using-api/cel/) 表達式工作。

<!--
Kubernetes does not provide an OpenID Connect Identity Provider.
You can use an existing public OpenID Connect Identity Provider or run your own Identity Provider
that supports the OpenID Connect protocol.
-->
Kubernetes 並未提供 OpenID Connect 的身份服務。
你可以使用現有的公共的 OpenID Connect 身份服務或者運行你自己的
OpenID Connect 身份服務。

<!--
For an identity provider to work with Kubernetes it must:

1. Support [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)

   The public key to verify the signature is discovered from the issuer's public endpoint using OIDC discovery.
   If you're using the authentication configuration file, the identity provider doesn't need to publicly expose the discovery endpoint.
   You can host the discovery endpoint at a different location than the issuer (such as locally in the cluster) and specify the
   `issuer.discoveryURL` in the configuration file.
-->
要在 Kubernetes 環境中使用某身份服務，該服務必須：

1. 支持 [OpenID connect 發現](https://openid.net/specs/openid-connect-discovery-1_0.html)

   用於驗證簽名的公鑰是使用 OIDC 發現從發行者的公共端點發現的。
   如果你使用身份認證設定文件，則身份提供者不需要公開發布發現端點。
   你可以將發現端點託管在與頒發者不同的位置（例如叢集本地），並在設定文件中指定 `issuer.discoveryURL`。

<!--
1. Run in TLS with non-obsolete ciphers
1. Have a CA signed certificate (even if the CA is not a commercial CA or is self signed)
-->
2. 使用未過時的密鑰以 TLS 模式運行
3. 擁有 CA 簽名的證書（即使該 CA 不是商業 CA 或者是自簽名的）

<!--
A note about requirement #3 above, requiring a CA signed certificate. If you deploy your own
identity provider you MUST have your identity provider's web server certificate signed by a
certificate with the `CA` flag set to `TRUE`, even if it is self signed. This is due to GoLang's
TLS client implementation being very strict to the standards around certificate validation. If you
don't have a CA handy, you can create a simple CA and a signed certificate and key pair using
standard certificate generation tools.
-->
關於上述第三條需求，即要求具備 CA 簽名的證書，有一些額外的注意事項。
如果你部署了自己的身份服務，你必須對身份服務的 Web 伺服器證書進行簽名，
簽名所用證書的 `CA` 標誌要設置爲 `TRUE`，即使用的是自簽名證書。
這是因爲 GoLang 的 TLS 客戶端實現對證書驗證標準方面有非常嚴格的要求。
如果你手頭沒有現成的 CA 證書，可以使用標準證書生成工具來創建一個簡單的
CA 和被簽了名的證書與密鑰對。

<!--
#### Using kubectl

##### Option 1 - OIDC Authenticator

The first option is to use the kubectl `oidc` authenticator, which sets the `id_token` as a bearer token
for all requests and refreshes the token once it expires. After you've logged into your provider, use
kubectl to add your `id_token`, `refresh_token`, `client_id`, and `client_secret` to configure the plugin.

Providers that don't return an `id_token` as part of their refresh token response aren't supported
by this plugin and should use "Option 2" below.
-->
#### 使用 kubectl   {#using-kubectl}

##### 選項一：OIDC 身份認證組件

第一種方案是使用 kubectl 的 `oidc` 身份認證組件，該組件將 `id_token` 設置爲所有請求的持有者令牌，
並且在令牌過期時自動刷新。在你登錄到你的身份服務之後，
可以使用 kubectl 來添加你的 `id_token`、`refresh_token`、`client_id` 和
`client_secret`，以設定該插件。

如果服務在其刷新令牌響應中不包含 `id_token`，則此插件無法支持該服務。
這時你應該考慮下面的選項二。

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token )
```

<!--
As an example, running the below command after authenticating to your identity provider:
-->
作爲示例，在完成對你的身份服務的身份認證之後，運行下面的命令：

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

<!--
Which would produce the below configuration:
-->
此操作會生成以下設定：

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```

<!--
Once your `id_token` expires, `kubectl` will attempt to refresh your `id_token` using your `refresh_token`
and `client_secret` storing the new values for the `refresh_token` and `id_token` in your `.kube/config`.
-->
當你的 `id_token` 過期時，`kubectl` 會嘗試使用你的 `refresh_token` 來刷新你的
`id_token`，並且在 `.kube/config` 文件的 `client_secret` 中存放 `refresh_token`
和 `id_token` 的新值。

<!--
##### Option 2 - Use the `--token` Option

The `kubectl` command lets you pass in a token using the `--token` option.
Copy and paste the `id_token` into this option:
-->
##### 選項二：使用 `--token` 選項

`kubectl` 命令允許你使用 `--token` 選項傳遞一個令牌。
你可以將 `id_token` 的內容複製粘貼過來，作爲此標誌的取值：

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```

<!--
### Webhook Token Authentication

Webhook authentication is a hook for verifying bearer tokens.

* `--authentication-token-webhook-config-file` a configuration file describing how to access the remote webhook service.
* `--authentication-token-webhook-cache-ttl` how long to cache authentication decisions. Defaults to two minutes.
* `--authentication-token-webhook-version` determines whether to use `authentication.k8s.io/v1beta1` or `authentication.k8s.io/v1`
  `TokenReview` objects to send/receive information from the webhook. Defaults to `v1beta1`.
-->
### Webhook 令牌身份認證   {#webhook-token-authentication}

Webhook 身份認證是一種用來驗證持有者令牌的回調機制。

* `--authentication-token-webhook-config-file` 指向一個設定文件，
  其中描述如何訪問遠程的 Webhook 服務。
* `--authentication-token-webhook-cache-ttl` 用來設定身份認證決定的緩存時間。
  默認時長爲 2 分鐘。
* `--authentication-token-webhook-version` 決定是使用 `authentication.k8s.io/v1beta1` 還是
  `authenticationk8s.io/v1` 版本的 `TokenReview` 對象從 Webhook 發送/接收信息。
  默認爲 `v1beta1`。

<!--
The configuration file uses the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file format. Within the file, `clusters` refers to the remote service and
`users` refers to the API server webhook. An example would be:
-->
設定文件使用 [kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
文件的格式。在此文件中，`clusters` 指代遠程服務，`users` 指代遠程 API 服務
Webhook。下面是一個例子：

<!--
```yaml
# Kubernetes API version
apiVersion: v1
# kind of the API object
kind: Config
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # CA for verifying the remote service.
      server: https://authn.example.com/authenticate # URL of remote service to query. 'https' recommended for production.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```
-->
```yaml
# Kubernetes API 版本
apiVersion: v1
# API 對象類別
kind: Config
# clusters 指代遠程服務
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # 用來驗證遠程服務的 CA
      server: https://authn.example.com/authenticate # 要查詢的遠程服務 URL。生產環境中建議使用 'https'。

# users 指代 API 服務的 Webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhook 插件要使用的證書
      client-key: /path/to/key.pem          # 與證書匹配的密鑰

# kubeconfig 文件需要一個上下文（Context），此上下文用於本 API 伺服器
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```

<!--
When a client attempts to authenticate with the API server using a bearer token as discussed
[above](#putting-a-bearer-token-in-a-request), the authentication webhook POSTs a JSON-serialized
`TokenReview` object containing the token to the remote service.
-->
當客戶端嘗試在 API 伺服器上使用持有者令牌完成身份認證
（如[前](#putting-a-bearer-token-in-a-request)所述）時，
身份認證 Webhook 會用 POST 請求發送一個 JSON 序列化的對象到遠程服務。
該對象是 `TokenReview` 對象，其中包含持有者令牌。
Kubernetes 不會強制請求提供此 HTTP 頭部。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should check the `apiVersion` field of the request to ensure correct deserialization,
and **must** respond with a `TokenReview` object of the same version as the request.
-->
要注意的是，Webhook API 對象和其他 Kubernetes API 對象一樣，
也要受到同一[版本兼容規則](/zh-cn/docs/concepts/overview/kubernetes-api/)約束。
實現者應檢查請求的 `apiVersion` 字段以確保正確的反序列化，
並且**必須**以與請求相同版本的 `TokenReview` 對象進行響應。

{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}

{{< note >}}
<!--
The Kubernetes API server defaults to sending `authentication.k8s.io/v1beta1` token reviews for backwards compatibility.
To opt into receiving `authentication.k8s.io/v1` token reviews, the API server must be started with `--authentication-token-webhook-version=v1`.
-->
Kubernetes API 伺服器默認發送 `authentication.k8s.io/v1beta1` 令牌以實現向後兼容性。
要選擇接收 `authentication.k8s.io/v1` 令牌認證，API 伺服器必須帶着參數
`--authentication-token-webhook-version=v1` 啓動。
{{< /note >}}

<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
    # 發送到 API 伺服器的不透明持有者令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的伺服器的受衆標識符的可選列表。
    # 受衆感知令牌認證組件（例如，OIDC 令牌認證組件）
    # 應驗證令牌是否針對此列表中的至少一個受衆，
    # 並返回此列表與響應狀態中令牌的有效受衆的交集。
    # 這確保了令牌對於向其提供給的伺服器進行身份認證是有效的。
    # 如果未提供受衆，則應驗證令牌以向 Kubernetes API 伺服器進行身份認證。
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # 發送到 API 伺服器的不透明匿名令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的伺服器的受衆標識符的可選列表。
    # 受衆感知令牌認證組件（例如，OIDC 令牌認證組件）
    # 應驗證令牌是否針對此列表中的至少一個受衆，
    # 並返回此列表與響應狀態中令牌的有效受衆的交集。
    # 這確保了令牌對於向其提供給的伺服器進行身份認證是有效的。
    # 如果未提供受衆，則應驗證令牌以向 Kubernetes API 伺服器進行身份認證。
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
The remote service is expected to fill the `status` field of the request to indicate the success of the login.
The response body's `spec` field is ignored and may be omitted.
The remote service must return a response using the same `TokenReview` API version that it received.
A successful validation of the bearer token would return:
-->
遠程服務預計會填寫請求的 `status` 字段以指示登錄成功。
響應正文的 `spec` 字段被忽略並且可以省略。
遠程服務必須使用它收到的相同 `TokenReview` API 版本返回響應。
持有者令牌的成功驗證將返回：

{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必需
      "username": "janedoe@example.com",
      # 可選
      "uid": "42",
      # 可選的組成員身份
      "groups": ["developers", "qa"],
      # 認證者提供的可選附加信息。
      # 此字段不可包含機密數據，因爲這類數據可能被記錄在日誌或 API 對象中，
      # 並且可能傳遞給准入 Webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 認證組件可以返回的、可選的用戶感知令牌列表，
    # 包含令牌對其有效的、包含於 `spec.audiences` 列表中的受衆。
    # 如果省略，則認爲該令牌可用於對 Kubernetes API 伺服器進行身份認證。
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必需
      "username": "janedoe@example.com",
      # 可選
      "uid": "42",
      # 可選的組成員身份
      "groups": ["developers", "qa"],
      # 認證者提供的可選附加信息。
      # 此字段不可包含機密數據，因爲這類數據可能被記錄在日誌或 API 對象中，
      # 並且可能傳遞給准入 Webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 認證組件可以返回的、可選的用戶感知令牌列表，
    # 包含令牌對其有效的、包含於 `spec.audiences` 列表中的受衆。
    # 如果省略，則認爲該令牌可用於對 Kubernetes API 伺服器進行身份認證。
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
An unsuccessful request would return:
-->
而不成功的請求會返回：

{{< tabs name="TokenReview_response_error" >}}
{{% tab name="authentication.k8s.io/v1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可選地包括有關身份認證失敗原因的詳細信息。
    # 如果沒有提供錯誤信息，API 將返回一個通用的 Unauthorized 消息。
    # 當 authenticated=true 時，error 字段被忽略。
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可選地包括有關身份認證失敗原因的詳細信息。
    # 如果沒有提供錯誤信息，API 將返回一個通用的 Unauthorized 消息。
    # 當 authenticated=true 時，error 字段被忽略。
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Authenticating Proxy

The API server can be configured to identify users from request header values, such as `X-Remote-User`.
It is designed for use in combination with an authenticating proxy, which sets the request header value.
-->
### 身份認證代理   {#authenticating-proxy}

API 伺服器可以設定成從請求的頭部字段值（如 `X-Remote-User`）中辯識使用者。
這一設計是用來與某身份認證代理一起使用 API 伺服器，代理負責設置請求的頭部字段值。

<!--
* `--requestheader-username-headers` Required, case-insensitive. Header names to check, in order,
  for the user identity. The first header containing a value is used as the username.
* `--requestheader-group-headers` 1.6+. Optional, case-insensitive. "X-Remote-Group" is suggested.
  Header names to check, in order, for the user's groups. All values in all specified headers are used as group names.
* `--requestheader-extra-headers-prefix` 1.6+. Optional, case-insensitive. "X-Remote-Extra-" is suggested.
  Header prefixes to look for to determine extra information about the user (typically used by the configured authorization plugin).
  Any headers beginning with any of the specified prefixes have the prefix removed.
  The remainder of the header name is lowercased and [percent-decoded](https://tools.ietf.org/html/rfc3986#section-2.1)
  and becomes the extra key, and the header value is the extra value.
-->
* `--requestheader-username-headers` 必需字段，大小寫不敏感。
  用來設置要獲得使用者身份所要檢查的頭部字段名稱列表（有序）。
  第一個包含數值的字段會被用來提取使用者名。
* `--requestheader-group-headers` 可選字段，在 Kubernetes 1.6 版本以後支持，大小寫不敏感。
  建議設置爲 "X-Remote-Group"。用來指定一組頭部字段名稱列表，以供檢查使用者所屬的組名稱。
  所找到的全部頭部字段的取值都會被用作使用者組名。
* `--requestheader-extra-headers-prefix` 可選字段，在 Kubernetes 1.6 版本以後支持，大小寫不敏感。
  建議設置爲 "X-Remote-Extra-"。用來設置一個頭部字段的前綴字符串，
  API 伺服器會基於所給前綴來查找與使用者有關的一些額外信息。這些額外信息通常用於所設定的鑑權插件。
  API 伺服器會將與所給前綴匹配的頭部字段過濾出來，去掉其前綴部分，將剩餘部分轉換爲小寫字符串，
  並在必要時執行[百分號解碼](https://tools.ietf.org/html/rfc3986#section-2.1)後，
  構造新的附加信息字段鍵名。原來的頭部字段值直接作爲附加信息字段的值。

{{< note >}}
<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), the extra key could only contain characters which
were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
在 1.13.3 版本之前（包括 1.10.7、1.9.11），附加字段的鍵名只能包含
[HTTP 頭部標籤的合法字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)。
{{< /note >}}

<!--
For example, with this configuration:
-->
例如，使用下面的設定：

```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

<!--
this request:
-->
針對所收到的如下請求：

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

<!--
would result in this user info:
-->
會生成下面的使用者信息：

```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  acme.com/project:
  - some-project
  scopes:
  - openid
  - profile
```

<!--
In order to prevent header spoofing, the authenticating proxy is required to present a valid client
certificate to the API server for validation against the specified CA before the request headers are
checked. WARNING: do **not** reuse a CA that is used in a different context unless you understand
the risks and the mechanisms to protect the CA's usage.

* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate
  must be presented and validated against the certificate authorities in the specified file before the
  request headers are checked for user names.
* `--requestheader-allowed-names` Optional. List of Common Name values (CNs). If set, a valid client
  certificate with a CN in the specified list must be presented before the request headers are checked
  for user names. If empty, any CN is allowed.
-->
爲了防範頭部信息偵聽，在請求中的頭部字段被檢視之前，
身份認證代理需要向 API 伺服器提供一份合法的客戶端證書，供後者使用所給的 CA 來執行驗證。
警告：**不要**在不同的上下文中複用 CA 證書，除非你清楚這樣做的風險是什麼以及應如何保護
CA 用法的機制。

* `--requestheader-client-ca-file` 必需字段，給出 PEM 編碼的證書包。
  在檢查請求的頭部字段以提取使用者名信息之前，必須提供一個合法的客戶端證書，
  且該證書要能夠被所給文件中的機構所驗證。
* `--requestheader-allowed-names` 可選字段，用來給出一組公共名稱（CN）。
  如果此標誌被設置，則在檢視請求中的頭部以提取使用者信息之前，
  必須提供包含此列表中所給的 CN 名的、合法的客戶端證書。

<!--
## Anonymous requests

When enabled, requests that are not rejected by other configured authentication methods are
treated as anonymous requests, and given a username of `system:anonymous` and a group of
`system:unauthenticated`.
-->
## 匿名請求   {#anonymous-requests}

啓用匿名請求支持之後，如果請求沒有被已設定的其他身份認證方法拒絕，
則被視作匿名請求（Anonymous Requests）。這類請求獲得使用者名 `system:anonymous`
和對應的使用者組 `system:unauthenticated`。

<!--
For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error.
A request providing no bearer token would be treated as an anonymous request.

In 1.5.1-1.5.x, anonymous access is disabled by default, and can be enabled by
passing the `--anonymous-auth=true` option to the API server.
-->
例如，在一個設定了令牌身份認證且啓用了匿名訪問的伺服器上，如果請求提供了非法的持有者令牌，
則會返回 `401 Unauthorized` 錯誤。如果請求沒有提供持有者令牌，則被視爲匿名請求。

在 1.5.1-1.5.x 版本中，匿名訪問默認情況下是被禁用的，可以通過爲 API 伺服器設定
`--anonymous-auth=true` 來啓用。

<!--
In 1.6+, anonymous access is enabled by default if an authorization mode other than `AlwaysAllow`
is used, and can be disabled by passing the `--anonymous-auth=false` option to the API server.
Starting in 1.6, the ABAC and RBAC authorizers require explicit authorization of the
`system:anonymous` user or the `system:unauthenticated` group, so legacy policy rules
that grant access to the `*` user or `*` group do not include anonymous users.
-->
在 1.6 及之後版本中，如果所使用的鑑權模式不是 `AlwaysAllow`，則匿名訪問默認是被啓用的。
從 1.6 版本開始，ABAC 和 RBAC 鑑權模塊要求對 `system:anonymous` 使用者或者
`system:unauthenticated` 使用者組執行顯式的權限判定，所以之前的爲使用者 `*` 或使用者組
`*` 賦予訪問權限的策略規則都不再包含匿名使用者。

<!--
### Anonymous Authenticator Configuration
-->
### 匿名身份認證模塊設定   {#anonymous-authenticator-configuration}

{{< feature-state feature_gate_name="AnonymousAuthConfigurableEndpoints" >}}

<!--
The `AuthenticationConfiguration` can be used to configure the anonymous
authenticator. If you set the anonymous field in the `AuthenticationConfiguration`
file then you cannot set the `--anonymous-auth` flag.
-->
`AuthenticationConfiguration` 可用於設定匿名身份認證模塊。
如果你在 `AuthenticationConfiguration` 文件中設置了 anonymous 字段，
那麼你不能設置 `--anonymous-auth` 標誌。

<!--
The main advantage of configuring anonymous authenticator using the authentication
configuration file is that in addition to enabling and disabling anonymous authentication
you can also configure which endpoints support anonymous authentication.

A sample authentication configuration file is below:
-->
使用身份認證設定文件來設定匿名身份認證模塊的主要優點是，
除了啓用和禁用匿名身份認證外，你還可以設定哪些端點支持匿名身份認證。

以下是一個身份認證設定文件示例：

<!--
```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
```
-->
```yaml
---
#
# 注意：這是一個示例配置。
#      請勿將其用於你自己的集羣！
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
```

<!--
In the configuration above only the `/livez`, `/readyz` and `/healthz` endpoints
are reachable by anonymous requests. Any other endpoints will not be reachable
even if it is allowed by RBAC configuration.
-->
在上述設定中，只有 `/livez`、`/readyz` 和 `/healthz` 端點可以通過匿名請求進行訪問。
即使 RBAC 設定允許進行匿名請求，也不可以訪問任何其他端點。

<!--
## User impersonation

A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.
-->
## 使用者僞裝  {#user-impersonation}

一個使用者可以通過僞裝（Impersonation）頭部字段來以另一個使用者的身份執行操作。
使用這一能力，你可以手動重載請求被身份認證所識別出來的使用者信息。
例如，管理員可以使用這一功能特性來臨時僞裝成另一個使用者，查看請求是否被拒絕，
從而調試鑑權策略中的問題，

<!--
Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.

* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users have impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.
-->
帶僞裝的請求首先會被身份認證識別爲發出請求的使用者，
之後會切換到使用被僞裝的使用者的使用者信息。

* 使用者發起 API 調用時**同時**提供自身的憑據和僞裝頭部字段信息。
* API 伺服器對使用者執行身份認證。
* API 伺服器確認通過認證的使用者具有僞裝特權。
* 請求使用者的信息被替換成僞裝字段的值。
* 評估請求，鑑權組件針對所僞裝的使用者信息執行操作。

<!--
The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups.
  Optional. Requires "Impersonate-User".
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user.
  Optional. Requires "Impersonate-User". In order to be preserved consistently, `( extra name )`
  must be lower-case, and any characters which aren't [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6)
  MUST be utf8 and [percent-encoded](https://tools.ietf.org/html/rfc3986#section-2.1).
* `Impersonate-Uid`: A unique identifier that represents the user being impersonated. Optional.
  Requires "Impersonate-User". Kubernetes does not impose any format requirements on this string.
-->
以下 HTTP 頭部字段可用來執行僞裝請求：

* `Impersonate-User`：要僞裝成的使用者名
* `Impersonate-Group`：要僞裝成的使用者組名。可以多次指定以設置多個使用者組。
  可選字段；要求 "Impersonate-User" 必須被設置。
* `Impersonate-Extra-<附加名稱>`：一個動態的頭部字段，用來設置與使用者相關的附加字段。
  此字段可選；要求 "Impersonate-User" 被設置。爲了能夠以一致的形式保留，
  `<附加名稱>`部分必須是小寫字符，
  如果有任何字符不是[合法的 HTTP 頭部標籤字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)，
  則必須是 UTF-8 字符，且轉換爲[百分號編碼](https://tools.ietf.org/html/rfc3986#section-2.1)。
* `Impersonate-Uid`：一個唯一標識符，用來表示所僞裝的使用者。此頭部可選。
  如果設置，則要求 "Impersonate-User" 也存在。Kubernetes 對此字符串沒有格式要求。

{{< note >}}
<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), `( extra name )` could only contain characters which
were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
在 1.11.3 版本之前（以及 1.10.7、1.9.11），`<附加名稱>` 只能包含合法的 HTTP 標籤字符。
{{< /note >}}

{{< note >}}
<!--
`Impersonate-Uid` is only available in versions 1.22.0 and higher.
-->
`Impersonate-Uid` 僅在 1.22.0 及更高版本中可用。
{{< /note >}}

<!--
An example of the impersonation headers used when impersonating a user with groups:
-->
僞裝帶有使用者組的使用者時，所使用的僞裝頭部字段示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

<!--
An example of the impersonation headers used when impersonating a user with a UID and
extra fields:
-->
僞裝帶有 UID 和附加字段的使用者時，所使用的僞裝頭部字段示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
```

<!--
When using `kubectl` set the `--as` flag to configure the `Impersonate-User`
header, set the `--as-group` flag to configure the `Impersonate-Group` header.
-->
在使用 `kubectl` 時，可以使用 `--as` 標誌來設定 `Impersonate-User` 頭部字段值，
使用 `--as-group` 標誌設定 `Impersonate-Group` 頭部字段值。

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

<!--
Set the `--as` and `--as-group` flag:
-->
設置 `--as` 和 `--as-group` 標誌：

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

{{< note >}}
<!--
`kubectl` cannot impersonate extra fields or UIDs.
-->
`kubectl` 不能對附加字段或 UID 執行僞裝。
{{< /note >}}

<!--
To impersonate a user, group, user identifier (UID) or extra fields, the impersonating user must
have the ability to perform the "impersonate" verb on the kind of attribute
being impersonated ("user", "group", "uid", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:
-->
若要僞裝成某個使用者、某個組、使用者標識符（UID））或者設置附加字段，
執行僞裝操作的使用者必須具有對所僞裝的類別（`user`、`group`、`uid` 等）執行 `impersonate`
動詞操作的能力。
對於啓用了 RBAC 鑑權插件的叢集，下面的 ClusterRole 封裝了設置使用者和組僞裝字段所需的規則：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

<!--
For impersonation, extra fields and impersonated UIDs are both under the "authentication.k8s.io" `apiGroup`.
Extra fields are evaluated as sub-resources of the resource "userextras". To
allow a user to use impersonation headers for the extra field "scopes" and
for UIDs, a user should be granted the following role:
-->
爲了執行僞裝，附加字段和所僞裝的 UID 都位於 "authorization.k8s.io" `apiGroup` 中。
附加字段會被作爲 `userextras` 資源的子資源來執行權限評估。
如果要允許使用者爲附加字段 “scopes” 和 UID 設置僞裝頭部，該使用者需要被授予以下角色：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# Can set "Impersonate-Extra-scopes" header and the "Impersonate-Uid" header.
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# 可以設置 "Impersonate-Extra-scopes" 和 "Impersonate-Uid" 頭部
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

<!--
The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.
-->
你也可以通過約束資源可能對應的 `resourceNames` 限制僞裝頭部的取值：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Can impersonate the user "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Can impersonate the groups "developers" and "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Can impersonate the extras field "scopes" with the values "view" and "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# Can impersonate the uid "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
  # 可以僞裝成用戶 "jane.doe@example.com"
  - apiGroups: [""]
    resources: ["users"]
    verbs: ["impersonate"]
    resourceNames: ["jane.doe@example.com"]
  
  # 可以僞裝成用戶組 "developers" 和 "admins"
  - apiGroups: [""]
    resources: ["groups"]
    verbs: ["impersonate"]
    resourceNames: ["developers","admins"]
  
  # 可以將附加字段 "scopes" 僞裝成 "view" 和 "development"
  - apiGroups: ["authentication.k8s.io"]
    resources: ["userextras/scopes"]
    verbs: ["impersonate"]
    resourceNames: ["view", "development"]
  
  # 可以僞裝 UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
  - apiGroups: ["authentication.k8s.io"]
    resources: ["uids"]
    verbs: ["impersonate"]
    resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
<!--
Impersonating a user or group allows you to perform any action as if you were that user or group;
for that reason, impersonation is not namespace scoped.
If you want to allow impersonation using Kubernetes RBAC,
this requires using a `ClusterRole` and a `ClusterRoleBinding`,
not a `Role` and `RoleBinding`.
-->
基於僞裝成一個使用者或使用者組的能力，你可以執行任何操作，好像你就是那個使用者或使用者組一樣。
出於這一原因，僞裝操作是不受名字空間約束的。
如果你希望允許使用 Kubernetes RBAC 來執行身份僞裝，就需要使用 `ClusterRole`
和 `ClusterRoleBinding`，而不是 `Role` 或 `RoleBinding`。
{{< /note >}}

<!--
## client-go credential plugins
-->
## client-go 憑據插件  {#client-go-credential-plugins}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
`k8s.io/client-go` and tools using it such as `kubectl` and `kubelet` are able to execute an
external command to receive user credentials.

This feature is intended for client side integrations with authentication protocols not natively
supported by `k8s.io/client-go` (LDAP, Kerberos, OAuth2, SAML, etc.). The plugin implements the
protocol specific logic, then returns opaque credentials to use. Almost all credential plugin
use cases require a server side component with support for the [webhook token authenticator](#webhook-token-authentication)
to interpret the credential format produced by the client plugin.
-->
`k8s.io/client-go` 及使用它的工具（如 `kubectl` 和 `kubelet`）
可以執行某個外部命令來獲得使用者的憑據信息。

這一特性的目的是便於客戶端與 `k8s.io/client-go` 並不支持的身份認證協議
（LDAP、Kerberos、OAuth2、SAML 等）繼承。
插件實現特定於協議的邏輯，之後返回不透明的憑據以供使用。
幾乎所有的憑據插件使用場景中都需要在伺服器端存在一個支持
[Webhook 令牌身份認證組件](#webhook-token-authentication)的模塊，
負責解析客戶端插件所生成的憑據格式。

{{< note >}}
<!--
Earlier versions of `kubectl` included built-in support for authenticating to AKS and GKE, but this is no longer present.
-->
早期版本的 `kubectl` 內置了對 AKS 和 GKE 的認證支持，但這一功能已不再存在。
{{< /note >}}

<!--
### Example use case

In a hypothetical use case, an organization would run an external service that exchanges LDAP credentials
for user specific, signed tokens. The service would also be capable of responding to [webhook token
authenticator](#webhook-token-authentication) requests to validate the tokens. Users would be required
to install a credential plugin on their workstation.
-->
### 示例應用場景   {#example-use-case}

在一個假想的應用場景中，某組織運行這一個外部的服務，能夠將特定使用者的已簽名的令牌轉換成
LDAP 憑據。此服務還能夠對
[Webhook 令牌身份認證組件](#webhook-token-authentication)的請求做出響應以驗證所提供的令牌。
使用者需要在自己的工作站上安裝一個憑據插件。

<!--
To authenticate against the API:

* The user issues a `kubectl` command.
* Credential plugin prompts the user for LDAP credentials, exchanges credentials with external service for a token.
* Credential plugin returns token to client-go, which uses it as a bearer token against the API server.
* API server uses the [webhook token authenticator](#webhook-token-authentication) to submit a `TokenReview` to the external service.
* External service verifies the signature on the token and returns the user's username and groups.
-->
要對 API 伺服器認證身份時：

* 使用者發出 `kubectl` 命令。
* 憑據插件提示使用者輸入 LDAP 憑據，並與外部服務交互，獲得令牌。
* 憑據插件將令牌返回該 client-go，後者將其用作持有者令牌提交給 API 伺服器。
* API 伺服器使用 [Webhook 令牌身份認證組件](#webhook-token-authentication)向外部服務發出
  `TokenReview` 請求。
* 外部服務檢查令牌上的簽名，返回使用者的使用者名和使用者組信息。

<!--
### Configuration

Credential plugins are configured through [kubectl config files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
as part of the user fields.
-->
### 設定  {#configuration}

憑據插件通過 [kubectl 設定文件](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
來作爲 user 字段的一部分設置。

{{< tabs name="exec_plugin_kubeconfig_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

<!--
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1beta1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Required.
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
-->
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # 要執行的命令。必需。
      command: "example-client-go-exec-plugin"

      # 解析 ExecCredentials 資源時使用的 API 版本。必需。
      # 插件返回的 API 版本必需與這裏列出的版本匹配。
      #
      # 要與支持多個版本的工具（如 client.authentication.k8s.io/v1beta1）集成，
      # 可以設置一個環境變量或者向工具傳遞一個參數標明 exec 插件所期望的版本，
      # 或者從 KUBERNETES_EXEC_INFO 環境變量的 ExecCredential 對象中讀取版本信息。
      apiVersion: "client.authentication.k8s.io/v1"

      # 執行此插件時要設置的環境變量。可選字段。
      env:
      - name: "FOO"
        value: "bar"

      # 執行插件時要傳遞的參數。可選字段。
      args:
      - "arg1"
      - "arg2"

      # 當可執行文件不存在時顯示給用戶的文本。可選字段。
      installHint: |
        需要 example-client-go-exec-plugin 來在當前集羣上執行身份認證。可以通過以下命令安裝：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 環境變量的一部分向這個 exec 插件
      # 提供集羣信息（可能包含非常大的 CA 數據）
      provideClusterInfo: true

      # Exec 插件與標準輸入 I/O 數據流之間的協議。如果協議無法滿足，
      # 則插件無法運行並會返回錯誤信息。合法的值包括 "Never" （Exec 插件從不使用標準輸入），
      # "IfAvailable" （Exec 插件希望在可以的情況下使用標準輸入），
      # 或者 "Always" （Exec 插件需要使用標準輸入才能工作）。必需字段。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 爲每個集羣 exec 配置保留的擴展名
      extension:
        arbitrary: config
        this: 在設置 provideClusterInfo 時可通過環境變量 KUBERNETES_EXEC_INFO 指定
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
<!--
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Optional.
      # Defaults to "IfAvailable".
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
-->
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # 要執行的命令。必需。
      command: "example-client-go-exec-plugin"

      # 解析 ExecCredentials 資源時使用的 API 版本。必需。
      # 插件返回的 API 版本必需與這裏列出的版本匹配。
      #
      # 要與支持多個版本的工具（如 client.authentication.k8s.io/v1）集成，
      # 可以設置一個環境變量或者向工具傳遞一個參數標明 exec 插件所期望的版本，
      # 或者從 KUBERNETES_EXEC_INFO 環境變量的 ExecCredential 對象中讀取版本信息。
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # 執行此插件時要設置的環境變量。可選字段。
      env:
      - name: "FOO"
        value: "bar"

      # 執行插件時要傳遞的參數。可選字段。
      args:
      - "arg1"
      - "arg2"

      # 當可執行文件不存在時顯示給用戶的文本。可選字段。
      installHint: |
        需要 example-client-go-exec-plugin 來在當前集羣上執行身份認證。可以通過以下命令安裝：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 環境變量的一部分向這個 exec 插件
      # 提供集羣信息（可能包含非常大的 CA 數據）
      provideClusterInfo: true

      # Exec 插件與標準輸入 I/O 數據流之間的協議。如果協議無法滿足，
      # 則插件無法運行並會返回錯誤信息。合法的值包括 "Never"（Exec 插件從不使用標準輸入），
      # "IfAvailable" （Exec 插件希望在可以的情況下使用標準輸入），
      # 或者 "Always" （Exec 插件需要使用標準輸入才能工作）。可選字段。
      # 默認值爲 "IfAvailable"。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 爲每個集羣 exec 配置保留的擴展名
      extension:
        arbitrary: config
        this: 在設置 provideClusterInfo 時可通過環境變量 KUBERNETES_EXEC_INFO 指定
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
{{% /tab %}}
{{< /tabs >}}

<!--
Relative command paths are interpreted as relative to the directory of the config file. If
KUBECONFIG is set to `/home/jane/kubeconfig` and the exec command is `./bin/example-client-go-exec-plugin`,
the binary `/home/jane/bin/example-client-go-exec-plugin` is executed.
-->
解析相對命令路徑時，kubectl 將其視爲與設定文件比較而言的相對路徑。
如果 KUBECONFIG 被設置爲 `/home/jane/kubeconfig`，而 exec 命令爲
`./bin/example-client-go-exec-plugin`，則要執行的可執行文件爲
`/home/jane/bin/example-client-go-exec-plugin`。

<!--
```yaml
- name: my-user
  user:
    exec:
      # Path relative to the directory of the kubeconfig
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```
-->
```yaml
- name: my-user
  user:
    exec:
      # 對 kubeconfig 目錄而言的相對路徑
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```

<!--
### Input and output formats

The executed command prints an `ExecCredential` object to `stdout`. `k8s.io/client-go`
authenticates against the Kubernetes API using the returned credentials in the `status`.
The executed command is passed an `ExecCredential` object as input via the `KUBERNETES_EXEC_INFO`
environment variable. This input contains helpful information like the expected API version
of the returned `ExecCredential` object and whether or not the plugin can use `stdin` to interact
with the user.
-->
### 輸出和輸出格式   {#input-and-output-formats}

所執行的命令會在 `stdout` 打印 `ExecCredential` 對象。
`k8s.io/client-go` 使用 `status` 中返回的憑據信息向 Kubernetes API 伺服器執行身份認證。
所執行的命令會通過環境變量 `KUBERNETES_EXEC_INFO` 收到一個 `ExecCredential` 對象作爲其輸入。
此輸入中包含類似於所返回的 `ExecCredential` 對象的預期 API 版本，
以及是否插件可以使用 `stdin` 與使用者交互這類信息。

<!--
When run from an interactive session (i.e., a terminal), `stdin` can be exposed directly
to the plugin. Plugins should use the `spec.interactive` field of the input
`ExecCredential` object from the `KUBERNETES_EXEC_INFO` environment variable in order to
determine if `stdin` has been provided. A plugin's `stdin` requirements (i.e., whether
`stdin` is optional, strictly required, or never used in order for the plugin
to run successfully) is declared via the `user.exec.interactiveMode` field in the
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (see table
below for valid values). The `user.exec.interactiveMode` field is optional in `client.authentication.k8s.io/v1beta1`
and required in `client.authentication.k8s.io/v1`.
-->
在交互式會話（即，某終端）中運行時，`stdin` 是直接暴露給插件使用的。
插件應該使用來自 `KUBERNETES_EXEC_INFO` 環境變量的 `ExecCredential`
輸入對象中的 `spec.interactive` 字段來確定是否提供了 `stdin`。
插件的 `stdin` 需求（即，爲了能夠讓插件成功運行，是否 `stdin` 是可選的、
必須提供的或者從不會被使用的）是通過
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec.interactiveMode` 來申領的（參見下面的表格瞭解合法值）。
字段 `user.exec.interactiveMode` 在 `client.authentication.k8s.io/v1beta1`
中是可選的，在 `client.authentication.k8s.io/v1` 中是必需的。

<!--
| `interactiveMode` Value | Meaning |
| ----------------------- | ------- |
| `Never` | This exec plugin never needs to use standard input, and therefore the exec plugin will be run regardless of whether standard input is available for user input. |
| `IfAvailable` | This exec plugin would like to use standard input if it is available, but can still operate if standard input is not available. Therefore, the exec plugin will be run regardless of whether stdin is available for user input. If standard input is available for user input, then it will be provided to this exec plugin. |
| `Always` | This exec plugin requires standard input in order to run, and therefore the exec plugin will only be run if standard input is available for user input. If standard input is not available for user input, then the exec plugin will not be run and an error will be returned by the exec plugin runner. |
-->
{{< table caption="interactiveMode 取值" >}}
| `interactiveMode` 取值  | 含義    |
| ----------------------- | ------- |
| `Never` | 此 exec 插件從不需要使用標準輸入，因此如論是否有標準輸入提供給使用者輸入，該 exec 插件都能運行。 |
| `IfAvailable` | 此 exec 插件希望在標準輸入可用的情況下使用標準輸入，但在標準輸入不存在時也可運行。因此，無論是否存在給使用者提供輸入的標準輸入，此 exec 插件都會運行。如果存在供使用者輸入的標準輸入，則該標準輸入會被提供給 exec 插件。 |
| `Always` | 此 exec 插件需要標準輸入才能正常運行，因此只有存在供使用者輸入的標準輸入時，此 exec 插件纔會運行。如果不存在供使用者輸入的標準輸入，則 exec 插件無法運行，並且 exec 插件的執行者會因此返回錯誤信息。 |
{{< /table >}}

<!--
To use bearer token credentials, the plugin returns a token in the status of the
[`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
-->
要使用持有者令牌憑據，此插件將在
[`ExecCredential`](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
的狀態中返回一個令牌：

{{< tabs name="exec_plugin_ExecCredential_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
Alternatively, a PEM-encoded client certificate and key can be returned to use TLS client auth.
If the plugin returns a different certificate and key on a subsequent call, `k8s.io/client-go`
will close existing connections with the server to force a new TLS handshake.

If specified, `clientKeyData` and `clientCertificateData` must both must be present.

`clientCertificateData` may contain additional intermediate certificates to send to the server.
-->
另一種方案是，返回 PEM 編碼的客戶端證書和密鑰，以便執行 TLS 客戶端身份認證。
如果插件在後續調用中返回了不同的證書或密鑰，`k8s.io/client-go`
會終止其與伺服器的連接，從而強制執行新的 TLS 握手過程。

如果指定了這種方式，則 `clientKeyData` 和 `clientCertificateData` 字段都必須存在。

`clientCertificateData` 字段可能包含一些要發送給伺服器的中間證書（Intermediate
Certificates）。

{{< tabs name="exec_plugin_ExecCredential_example_2" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
Optionally, the response can include the expiry of the credential formatted as a
[RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) timestamp.

Presence or absence of an expiry has the following impact:

- If an expiry is included, the bearer token and TLS credentials are cached until
  the expiry time is reached, or if the server responds with a 401 HTTP status code,
  or when the process exits.
- If an expiry is omitted, the bearer token and TLS credentials are cached until
  the server responds with a 401 HTTP status code or until the process exits.
-->
作爲一種可選方案，響應中還可以包含以 [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339)
時間戳格式給出的證書到期時間。
證書到期時間的有無會有如下影響：

- 如果響應中包含了到期時間，持有者令牌和 TLS 憑據會被緩存，直到期限到來、
  或者伺服器返回 401 HTTP 狀態碼，或者進程退出。
- 如果未指定到期時間，則持有者令牌和 TLS 憑據會被緩存，直到伺服器返回 401
  HTTP 狀態碼或者進程退出。

{{< tabs name="exec_plugin_ExecCredential_example_3" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
To enable the exec plugin to obtain cluster-specific information, set `provideClusterInfo` on the `user.exec`
field in the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
The plugin will then be supplied this cluster-specific information in the `KUBERNETES_EXEC_INFO` environment variable.
Information from this environment variable can be used to perform cluster-specific
credential acquisition logic.
The following `ExecCredential` manifest describes a cluster information sample.
-->
爲了讓 exec 插件能夠獲得特定與叢集的信息，可以在
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec` 設置 `provideClusterInfo`。
這一特定於叢集的信息就會通過 `KUBERNETES_EXEC_INFO` 環境變量傳遞給插件。
此環境變量中的信息可以用來執行特定於叢集的憑據獲取邏輯。
下面的 `ExecCredential` 清單描述的是一個示例叢集信息。

{{< tabs name="exec_plugin_ExecCredential_example_4" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "可以在設置 provideClusterInfo 時通過 KUBERNETES_EXEC_INFO 環境變量提供",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}

{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "可以在設置 provideClusterInfo 時通過 KUBERNETES_EXEC_INFO 環境變量提供",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
## API access to authentication information for a client {#self-subject-review}
-->
## 爲客戶端提供的對身份認證信息的 API 訪問   {#self-subject-review}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
If your cluster has the API enabled, you can use the `SelfSubjectReview` API to find out
how your Kubernetes cluster maps your authentication information to identify you as a client.
This works whether you are authenticating as a user (typically representing
a real person) or as a ServiceAccount.

`SelfSubjectReview` objects do not have any configurable fields. On receiving a request,
the Kubernetes API server fills the status with the user attributes and returns it to the user.

Request example (the body would be a `SelfSubjectReview`):
-->
如果叢集啓用了此 API，你可以使用 `SelfSubjectReview` API 來了解 Kubernetes
叢集如何映射你的身份認證信息從而將你識別爲某客戶端。無論你是作爲使用者（通常代表一個真的人）還是作爲
ServiceAccount 進行身份認證，這一 API 都可以使用。

`SelfSubjectReview` 對象沒有任何可設定的字段。
Kubernetes API 伺服器收到請求後，將使用使用者屬性填充 status 字段並將其返回給使用者。

請求示例（主體將是 `SelfSubjectReview`）：

```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews
```

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}
```

<!--
Response example:
-->
響應示例：

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "name": "jane.doe",
      "uid": "b6c7cfd4-f166-11ec-8ea0-0242ac120002",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "extra": {
        "provider_id": ["token.company.example"]
      }
    }
  }
}
```

<!--
For convenience, the `kubectl auth whoami` command is present. Executing this command will
produce the following output (yet different user attributes will be shown):

* Simple output example
-->
爲了方便，Kubernetes 提供了 `kubectl auth whoami` 命令。
執行此命令將產生以下輸出（但將顯示不同的使用者屬性）：

* 簡單的輸出示例

  ```
  ATTRIBUTE         VALUE
  Username          jane.doe
  Groups            [system:authenticated]
  ```

<!--
* Complex example including extra attributes
-->
* 包括額外屬性的複雜示例

  ```
  ATTRIBUTE         VALUE
  Username          jane.doe
  UID               b79dbf30-0c6a-11ed-861d-0242ac120002
  Groups            [students teachers system:authenticated]
  Extra: skills     [reading learning]
  Extra: subjects   [math sports]
  ```

<!--
By providing the output flag, it is also possible to print the JSON or YAML representation of the result:
-->
通過提供 output 標誌，也可以打印結果的 JSON 或 YAML 表現形式：

{{< tabs name="self_subject_attributes_review_Example_1" >}}
{{% tab name="JSON" %}}
```json
{
  "apiVersion": "authentication.k8s.io/v1alpha1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "jane.doe",
      "uid": "b79dbf30-0c6a-11ed-861d-0242ac120002",
      "groups": [
        "students",
        "teachers",
        "system:authenticated"
      ],
      "extra": {
        "skills": [
          "reading",
          "learning"
        ],
        "subjects": [
          "math",
          "sports"
        ]
      }
    }
  }
}
```
{{% /tab %}}

{{% tab name="YAML" %}}
```yaml
apiVersion: authentication.k8s.io/v1
kind: SelfSubjectReview
status:
  userInfo:
    username: jane.doe
    uid: b79dbf30-0c6a-11ed-861d-0242ac120002
    groups:
    - students
    - teachers
    - system:authenticated
    extra:
      skills:
      - reading
      - learning
      subjects:
      - math
      - sports
```
{{% /tab %}}
{{< /tabs >}}

<!--
This feature is extremely useful when a complicated authentication flow is used in a Kubernetes cluster,
for example, if you use [webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
or [authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).
-->
在 Kubernetes 叢集中使用複雜的身份認證流程時，例如如果你使用
[Webhook 令牌身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)或
[身份認證代理](/zh-cn/docs/reference/access-authn-authz/authentication/#authenticating-proxy)時，
此特性極其有用。

{{< note >}}
<!--
The Kubernetes API server fills the `userInfo` after all authentication mechanisms are applied,
including [impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation).
If you, or an authentication proxy, make a SelfSubjectReview using impersonation,
you see the user details and properties for the user that was impersonated.
-->
Kubernetes API 伺服器在所有身份認證機制
（包括[僞裝](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)），
被應用後填充 `userInfo`，
如果你或某個身份認證代理使用僞裝進行 SelfSubjectReview，你會看到被僞裝使用者的使用者詳情和屬性。
{{< /note >}}

<!--
By default, all authenticated users can create `SelfSubjectReview` objects when the `APISelfSubjectReview`
feature is enabled. It is allowed by the `system:basic-user` cluster role.
-->
默認情況下，所有經過身份認證的使用者都可以在 `APISelfSubjectReview` 特性被啓用時創建 `SelfSubjectReview` 對象。
這是 `system:basic-user` 叢集角色允許的操作。

{{< note >}}
<!--
You can only make `SelfSubjectReview` requests if:

* the `APISelfSubjectReview`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled for your cluster (not needed for Kubernetes {{< skew currentVersion >}}, but older
  Kubernetes versions might not offer this feature gate, or might default it to be off)
* (if you are running a version of Kubernetes older than v1.28) the API server for your
  cluster has the `authentication.k8s.io/v1alpha1` or `authentication.k8s.io/v1beta1`
* the API server for your cluster has the `authentication.k8s.io/v1alpha1` or `authentication.k8s.io/v1beta1`
  {{< glossary_tooltip term_id="api-group" text="API group" >}}
  enabled.
-->
你只能在以下情況下進行 `SelfSubjectReview` 請求：

* 叢集啓用了 `APISelfSubjectReview`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  （Kubernetes {{< skew currentVersion >}} 不需要，但較舊的 Kubernetes 版本可能沒有此特性門控，
  或者默認爲關閉狀態）。
* （如果你運行的 Kubernetes 版本早於 v1.28 版本）叢集的 API 伺服器包含
  `authentication.k8s.io/v1alpha1` 或 `authentication.k8s.io/v1beta1` API 組。
* 叢集的 API 伺服器已啓用 `authentication.k8s.io/v1alpha1` 或者 `authentication.k8s.io/v1beta1`
  {{< glossary_tooltip term_id="api-group" text="API 組" >}}。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* To learn about issuing certificates for users, read [Issue a Certificate for a Kubernetes API Client Using A CertificateSigningRequest](/docs/tasks/tls/certificate-issue-client-csr/)
* Read the [client authentication reference (v1)](/docs/reference/config-api/client-authentication.v1/)
* Read the [client authentication reference (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
-->
* 要了解爲使用者頒發證書的有關信息，
  閱讀[使用 CertificateSigningRequest 爲 Kubernetes API 客戶端頒發證書](/zh-cn/docs/tasks/tls/certificate-issue-client-csr/)。
* 閱讀[客戶端認證參考文檔（v1）](/zh-cn/docs/reference/config-api/client-authentication.v1/)。
* 閱讀[客戶端認證參考文檔（v1beta1）](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/)。
