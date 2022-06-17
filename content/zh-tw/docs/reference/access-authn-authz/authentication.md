---
title: 使用者認證
content_type: concept
weight: 10
---
<!--
reviewers:
- erictune
- lavalamp
- ericchiang
- deads2k
- liggitt
title: Authenticating
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This page provides an overview of authenticating.
-->
本頁提供身份認證有關的概述。

<!-- body -->
<!--
## Users in Kubernetes

All Kubernetes clusters have two categories of users: service accounts managed
by Kubernetes, and normal users.

It is assumed that a cluster-independent service manages normal users in the following ways:

- an administrator distributing private keys
- a user store like Keystone or Google Accounts
- a file with a list of usernames and passwords

In this regard, _Kubernetes does not have objects which represent normal user
accounts._ Normal users cannot be added to a cluster through an API call.
-->
## Kubernetes 中的使用者  {#users-in-kubernetes}

所有 Kubernetes 叢集都有兩類使用者：由 Kubernetes 管理的服務賬號和普通使用者。

Kubernetes 假定普通使用者是由一個與叢集無關的服務透過以下方式之一進行管理的：

- 負責分發私鑰的管理員
- 類似 Keystone 或者 Google Accounts 這類使用者資料庫
- 包含使用者名稱和密碼列表的檔案

有鑑於此，_Kubernetes 並不包含用來代表普通使用者賬號的物件_。
普通使用者的資訊無法透過 API 呼叫新增到叢集中。

<!--
Even though a normal user cannot be added via an API call, any user that
presents a valid certificate signed by the cluster's certificate authority
(CA) is considered authenticated. In this configuration, Kubernetes determines
the username from the common name field in the 'subject' of the cert (e.g.,
"/CN=bob"). From there, the role based access control (RBAC) sub-system would
determine whether the user is authorized to perform a specific operation on a
resource. For more details, refer to the normal users topic in
[certificate request](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
for more details about this.
-->
儘管無法透過 API 呼叫來新增普通使用者，Kubernetes 仍然認為能夠提供由叢集的證書
機構簽名的合法證書的使用者是透過身份認證的使用者。基於這樣的配置，Kubernetes
使用證書中的 'subject' 的通用名稱（Common Name）欄位（例如，"/CN=bob"）來
確定使用者名稱。接下來，基於角色訪問控制（RBAC）子系統會確定使用者是否有權針對
某資源執行特定的操作。進一步的細節可參閱
[證書請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
下普通使用者主題。

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
與此不同，服務賬號是 Kubernetes API 所管理的使用者。它們被繫結到特定的名字空間，
或者由 API 伺服器自動建立，或者透過 API 呼叫建立。服務賬號與一組以 Secret 儲存
的憑據相關，這些憑據會被掛載到 Pod 中，從而允許叢集內的程序訪問 Kubernetes
API。

API 請求則或者與某普通使用者相關聯，或者與某服務賬號相關聯，亦或者被視作
[匿名請求](#anonymous-requests)。這意味著叢集內外的每個程序在向 API 伺服器發起
請求時都必須透過身份認證，否則會被視作匿名使用者。這裡的程序可以是在某工作站上
輸入 `kubectl` 命令的操作人員，也可以是節點上的 `kubelet` 元件，還可以是控制面
的成員。

<!--
## Authentication strategies

Kubernetes uses client certificates, bearer tokens, or an authenticating proxy to
authenticate API requests through authentication plugins. As HTTP requests are
made to the API server, plugins attempt to associate the following attributes
with the request:
-->
## 身份認證策略  {#authentication-strategies}

Kubernetes 透過身份認證外掛利用客戶端證書、持有者令牌（Bearer Token）或身份認證代理（Proxy）
來認證 API 請求的身份。HTTP 請求發給 API 伺服器時，外掛會將以下屬性關聯到請求本身：

<!--
* Username: a string which identifies the end user. Common values might be `kube-admin` or `jane@example.com`.
* UID: a string which identifies the end user and attempts to be more consistent and unique than username.
* Groups: a set of strings, each of which indicates the user's membership in a named logical collection of users. Common values might be `system:masters` or `devops-team`.
* Extra fields: a map of strings to list of strings which holds additional information authorizers may find useful.
-->
* 使用者名稱：用來辯識終端使用者的字串。常見的值可以是 `kube-admin` 或 `jane@example.com`。
* 使用者 ID：用來辯識終端使用者的字串，旨在比使用者名稱有更好的一致性和唯一性。
* 使用者組：取值為一組字串，其中各個字串用來標明使用者是某個命名的使用者邏輯集合的成員。
  常見的值可能是 `system:masters` 或者 `devops-team` 等。
* 附加欄位：一組額外的鍵-值對映，鍵是字串，值是一組字串；用來儲存一些鑑權元件可能
  覺得有用的額外資訊。

<!--
All values are opaque to the authentication system and only hold significance
when interpreted by an [authorizer](/docs/reference/access-authn-authz/authorization/).

You can enable multiple authentication methods at once. You should usually use at least two methods:

- service account tokens for service accounts
- at least one other method for user authentication.
-->
所有（屬性）值對於身份認證系統而言都是不透明的，只有被
[鑑權元件](/zh-cn/docs/reference/access-authn-authz/authorization/)
解釋過之後才有意義。

你可以同時啟用多種身份認證方法，並且你通常會至少使用兩種方法：

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
當叢集中啟用了多個身份認證模組時，第一個成功地對請求完成身份認證的模組會
直接做出評估決定。API 伺服器並不保證身份認證模組的執行順序。

對於所有透過身份認證的使用者，`system:authenticated` 組都會被新增到其組列表中。

與其它身份認證協議（LDAP、SAML、Kerberos、X509 的替代模式等等）都可以透過
使用一個[身份認證代理](#authenticating-proxy)或
[身份認證 Webhoook](#webhook-token-authentication)來實現。

<!--
### X509 Client Certs

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

透過給 API 伺服器傳遞 `--client-ca-file=SOMEFILE` 選項，就可以啟動客戶端證書身份認證。
所引用的檔案必須包含一個或者多個證書機構，用來驗證向 API 伺服器提供的客戶端證書。
如果提供了客戶端證書並且證書被驗證透過，則 subject 中的公共名稱（Common Name）就被
作為請求的使用者名稱。
自 Kubernetes 1.4 開始，客戶端證書還可以透過證書的 organization 欄位標明使用者的組成員資訊。
要包含使用者的多個組成員資訊，可以在證書種包含多個 organization 欄位。

例如，使用 `openssl` 命令列工具生成一個證書籤名請求：

```bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

<!--
This would create a CSR for the username "jbeda", belonging to two groups, "app1" and "app2".

See [Managing Certificates](/docs/tasks/administer-cluster/certificates/) for how to generate a client cert.
-->
此命令將使用使用者名稱 `jbeda` 生成一個證書籤名請求（CSR），且該使用者屬於 "app" 和
"app2" 兩個使用者組。

參閱[管理證書](/zh-cn/docs/tasks/administer-cluster/certificates/)瞭解如何生成客戶端證書。

<!--
### Static Token File

The API server reads bearer tokens from a file when given the `--token-auth-file=SOMEFILE` option on the command line.  Currently, tokens last indefinitely, and the token list cannot be
changed without restarting the API server.

The token file is a csv file with a minimum of 3 columns: token, user name, user uid,
followed by optional group names.
-->
### 靜態令牌檔案  {#static-token-file}

當 API 伺服器的命令列設定了 `--token-auth-file=SOMEFILE` 選項時，會從檔案中
讀取持有者令牌。目前，令牌會長期有效，並且在不重啟 API 伺服器的情況下
無法更改令牌列表。

令牌檔案是一個 CSV 檔案，包含至少 3 個列：令牌、使用者名稱和使用者的 UID。
其餘列被視為可選的組名。

<!--
If you have more than one group the column must be double quoted e.g.

```conf
token,user,uid,"group1,group2,group3"
```
-->
{{< note >}}
如果要設定的組名不止一個，則對應的列必須用雙引號括起來，例如

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

<!--
#### Putting a Bearer Token in a Request

When using bearer token authentication from an http client, the API
server expects an `Authorization` header with a value of `Bearer
<token>`.  The bearer token must be a character sequence that can be
put in an HTTP header value using no more than the encoding and
quoting facilities of HTTP.  For example: if the bearer token is
`31ada4fd-adec-460c-809a-9e56ceb75269` then it would appear in an HTTP
header as shown below.
-->
#### 在請求中放入持有者令牌   {#putting-a-bearer-token-in-a-request}

當使用持有者令牌來對某 HTTP 客戶端執行身份認證時，API 伺服器希望看到
一個名為 `Authorization` 的 HTTP 頭，其值格式為 `Bearer <token>`。
持有者令牌必須是一個可以放入 HTTP 頭部值欄位的字元序列，至多可使用
HTTP 的編碼和引用機制。
例如：如果持有者令牌為 `31ada4fd-adec-460c-809a-9e56ceb75269`，則其
出現在 HTTP 頭部時如下所示：

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

<!--
### Bootstrap Tokens
-->
### 啟動引導令牌    {#bootstrap-tokens}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
To allow for streamlined bootstrapping for new clusters, Kubernetes includes a
dynamically-managed Bearer token type called a *Bootstrap Token*. These tokens
are stored as Secrets in the `kube-system` namespace, where they can be
dynamically managed and created. Controller Manager contains a TokenCleaner
controller that deletes bootstrap tokens as they expire.
-->
為了支援平滑地啟動引導新的叢集，Kubernetes 包含了一種動態管理的持有者令牌型別，
稱作 *啟動引導令牌（Bootstrap Token）*。
這些令牌以 Secret 的形式儲存在 `kube-system` 名字空間中，可以被動態管理和建立。
控制器管理器包含的 `TokenCleaner` 控制器能夠在啟動引導令牌過期時將其刪除。

<!--
The tokens are of the form `[a-z0-9]{6}.[a-z0-9]{16}`.  The first component is a
Token ID and the second component is the Token Secret.  You specify the token
in an HTTP header as follows:
-->
這些令牌的格式為 `[a-z0-9]{6}.[a-z0-9]{16}`。第一個部分是令牌的 ID；第二個部分
是令牌的 Secret。你可以用如下所示的方式來在 HTTP 頭部設定令牌：

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

<!--
You must enable the Bootstrap Token Authenticator with the
`-enable-bootstrap-token-auth` flag on the API Server.  You must enable
the TokenCleaner controller via the `-controllers` flag on the Controller
Manager.  This is done with something like `-controllers=*,tokencleaner`.
`kubeadm` will do this for you if you are using it to bootstrap a cluster.
-->
你必須在 API 伺服器上設定 `--enable-bootstrap-token-auth` 標誌來啟用基於啟動
引導令牌的身份認證元件。
你必須透過控制器管理器的 `--controllers` 標誌來啟用 TokenCleaner 控制器；
這可以透過類似 `--controllers=*,tokencleaner` 這種設定來做到。
如果你使用 `kubeadm` 來啟動引導新的叢集，該工具會幫你完成這些設定。

<!--
The authenticator authenticates as `system:bootstrap:<Token ID>`.  It is
included in the `system:bootstrappers` group.  The naming and groups are
intentionally limited to discourage users from using these tokens past
bootstrapping.  The user names and group can be used (and are used by `kubeadm`)
to craft the appropriate authorization policies to support bootstrapping a
cluster.
-->
身份認證元件的認證結果為 `system:bootstrap:<令牌 ID>`，該使用者屬於
`system:bootstrappers` 使用者組。
這裡的使用者名稱和組設定都是有意設計成這樣，其目的是阻止使用者在啟動引導叢集之後
繼續使用這些令牌。
這裡的使用者名稱和組名可以用來（並且已經被 `kubeadm` 用來）構造合適的鑑權
策略，以完成啟動引導新叢集的工作。

<!--
Please see [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) for in depth
documentation on the Bootstrap Token authenticator and controllers along with
how to manage these tokens with `kubeadm`.
-->
請參閱[啟動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
以瞭解關於啟動引導令牌身份認證元件與控制器的更深入的資訊，以及如何使用
`kubeadm` 來管理這些令牌。

<!--
### Service Account Tokens

A service account is an automatically enabled authenticator that uses signed
bearer tokens to verify requests. The plugin takes two optional flags:

* `--service-account-key-file` A file containing a PEM encoded key for signing bearer tokens.
If unspecified, the API server's TLS private key will be used.
* `--service-account-lookup` If enabled, tokens which are deleted from the API will be revoked.
-->
### 服務賬號令牌   {#service-account-tokens}

服務賬號（Service Account）是一種自動被啟用的使用者認證機制，使用經過簽名的
持有者令牌來驗證請求。該外掛可接受兩個可選引數：

* `--service-account-key-file` 一個包含用來為持有者令牌簽名的 PEM 編碼金鑰。
  若未指定，則使用 API 伺服器的 TLS 私鑰。
* `--service-account-lookup` 如果啟用，則從 API 刪除的令牌會被回收。

<!--
Service accounts are usually created automatically by the API server and
associated with pods running in the cluster through the `ServiceAccount`
[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). Bearer tokens are
mounted into pods at well-known locations, and allow in-cluster processes to
talk to the API server. Accounts may be explicitly associated with pods using the
`serviceAccountName` field of a `PodSpec`.
-->
服務賬號通常由 API 伺服器自動建立並透過 `ServiceAccount`
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
關聯到叢集中執行的 Pod 上。
持有者令牌會掛載到 Pod 中可預知的位置，允許叢集內程序與 API 伺服器通訊。
服務賬號也可以使用 Pod 規約的 `serviceAccountName` 欄位顯式地關聯到 Pod 上。

<!--
`serviceAccountName` is usually omitted because this is done automatically.
-->
{{< note >}}
`serviceAccountName` 通常會被忽略，因為關聯關係是自動建立的。
{{< /note >}}

```yaml
apiVersion: apps/v1
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
namespace and an associated secret.
-->
在叢集外部使用服務賬號持有者令牌也是完全合法的，且可用來為長時間執行的、需要與
Kubernetes  API 伺服器通訊的任務建立標識。要手動建立服務賬號，可以使用
`kubectl create serviceaccount <名稱>` 命令。此命令會在當前的名字空間中生成一個
服務賬號和一個與之關聯的 Secret。

```bash
kubectl create serviceaccount jenkins
```

```
serviceaccount "jenkins" created
```

<!--
Check an associated secret:
-->
查驗相關聯的 Secret：

```bash
kubectl get serviceaccounts jenkins -o yaml
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  # ...
secrets:
- name: jenkins-token-1yvwg
```

<!--
The created secret holds the public CA of the API server and a signed JSON Web
Token (JWT).
-->
所建立的 Secret 中會儲存 API 伺服器的公開的 CA 證書和一個已簽名的 JSON Web
令牌（JWT）。

```bash
kubectl get secret jenkins-token-1yvwg -o yaml
```

<!--
```yaml
apiVersion: v1
data:
  ca.crt: (APISERVER'S CA BASE64 ENCODED)
  namespace: ZGVmYXVsdA==
  token: (BEARER TOKEN BASE64 ENCODED)
kind: Secret
metadata:
  # ...
type: kubernetes.io/service-account-token
```
-->
```yaml
apiVersion: v1
data:
  ca.crt: <Base64 編碼的 API 伺服器 CA>
  namespace: ZGVmYXVsdA==
  token: <Base64 編碼的持有者令牌>
kind: Secret
metadata:
  # ...
type: kubernetes.io/service-account-token
```

<!--
Values are base64 encoded because secrets are always base64 encoded.
-->
{{< note >}}
欄位值是按 Base64 編碼的，這是因為 Secret 資料總是採用 Base64 編碼來儲存。
{{< /note >}}

<!--
The signed JWT can be used as a bearer token to authenticate as the given service
account. See [above](#putting-a-bearer-token-in-a-request) for how the token is included
in a request.  Normally these secrets are mounted into pods for in-cluster access to
the API server, but can be used from outside the cluster as well.
-->
已簽名的 JWT 可以用作持有者令牌，並將被認證為所給的服務賬號。
關於如何在請求中包含令牌，請參閱[前文](#putting-a-bearer-token-in-a-request)。
通常，這些 Secret 資料會被掛載到 Pod 中以便叢集內訪問 API 伺服器時使用，
不過也可以在叢集外部使用。

<!--
Service accounts authenticate with the username `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`,
and are assigned to the groups `system:serviceaccounts` and `system:serviceaccounts:(NAMESPACE)`.

WARNING: Because service account tokens are stored in secrets, any user with
read access to those secrets can authenticate as the service account. Be cautious
when granting permissions to service accounts and read capabilities for secrets.
-->
服務賬號被身份認證後，所確定的使用者名稱為 `system:serviceaccount:<名字空間>:<服務賬號>`，
並被分配到使用者組 `system:serviceaccounts` 和 `system:serviceaccounts:<名字空間>`。

警告：由於服務賬號令牌儲存在 Secret 物件中，任何能夠讀取這些 Secret 的使用者
都可以被認證為對應的服務賬號。在為使用者授予訪問服務賬號的許可權時，以及對 Secret
的讀許可權時，要格外小心。

<!--
### OpenID Connect Tokens

[OpenID Connect](https://openid.net/connect/) is a flavor of OAuth2 supported by
some OAuth2 providers, notably Azure Active Directory, Salesforce, and Google.
The protocol's main extension of OAuth2 is an additional field returned with
the access token called an [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken).
This token is a JSON Web Token (JWT) with well known fields, such as a user's
email, signed by the server.
-->
### OpenID Connect（OIDC）令牌   {#openid-connect-tokens}

[OpenID Connect](https://openid.net/connect/) 是一種 OAuth2  認證方式，
被某些 OAuth2 提供者支援，例如 Azure 活動目錄、Salesforce 和 Google。
協議對 OAuth2 的主要擴充體現在有一個附加欄位會和訪問令牌一起返回，
這一欄位稱作 [ID Token（ID 令牌）](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)。
ID 令牌是一種由伺服器簽名的 JSON Web 令牌（JWT），其中包含一些可預知的欄位，
例如使用者的郵箱地址，

<!--
To identify the user, the authenticator uses the `id_token` (not the `access_token`)
from the OAuth2 [token response](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
as a bearer token.  See [above](#putting-a-bearer-token-in-a-request) for how the token
is included in a request.
-->
要識別使用者，身份認證元件使用 OAuth2
[令牌響應](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
中的 `id_token`（而非 `access_token`）作為持有者令牌。
關於如何在請求中設定令牌，可參見[前文](#putting-a-bearer-token-in-a-request)。

{{< mermaid >}}
sequenceDiagram
    participant user as 使用者
    participant idp as 身份提供者 
    participant kube as Kubectl
    participant api as API 伺服器

    user ->> idp: 1. 登入到 IdP
    activate idp
    idp -->> user: 2. 提供 access_token,<br>id_token, 和 refresh_token
    deactivate idp
    activate user
    user ->> kube: 3. 呼叫 Kubectl 並<br>設定 --token 為 id_token<br>或者將令牌新增到 .kube/config
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
1.  Login to your identity provider
2.  Your identity provider will provide you with an `access_token`, `id_token` and a `refresh_token`
3.  When using `kubectl`, use your `id_token` with the `-token` flag or add it directly to your `kubeconfig`
4.  `kubectl` sends your `id_token` in a header called Authorization to the API server
5.  The API server will make sure the JWT signature is valid by checking against the certificate named in the configuration
6.  Check to make sure the `id_token` hasn't expired
7.  Make sure the user is authorized
8.  Once authorized the API server returns a response to `kubectl`
9.  `kubectl` provides feedback to the user
-->
1.  登入到你的身份服務（Identity Provider）
2.  你的身份服務將為你提供 `access_token`、`id_token` 和 `refresh_token`
3.  在使用 `kubectl` 時，將 `id_token` 設定為 `--token` 標誌值，或者將其直接新增到
    `kubeconfig` 中
4.  `kubectl` 將你的 `id_token` 放到一個稱作 `Authorization` 的頭部，傳送給 API 伺服器
5.  API 伺服器將負責透過檢查配置中引用的證書來確認 JWT 的簽名是合法的
6.  檢查確認 `id_token` 尚未過期
7.  確認使用者有許可權執行操作
8.  鑑權成功之後，API 伺服器向 `kubectl` 返回響應
9.  `kubectl` 向用戶提供反饋資訊

<!--
Since all of the data needed to validate who you are is in the `id_token`, Kubernetes doesn't need to
"phone home" to the identity provider.  In a model where every request is stateless this provides a very scalable solution for authentication.  It does offer a few challenges:
-->
由於用來驗證你是誰的所有資料都在 `id_token` 中，Kubernetes 不需要再去聯絡身份服務。
在一個所有請求都是無狀態請求的模型中，這一工作方式可以使得身份認證的解決方案更容易處理大規模請求。
不過，此訪問也有一些挑戰：

<!--
1. Kubernetes has no "web interface" to trigger the authentication process.  There is no browser or interface to collect credentials which is why you need to authenticate to your identity provider first.
2. The `id_token` can't be revoked, it's like a certificate so it should be short-lived (only a few minutes) so it can be very annoying to have to get a new token every few minutes.
3. To authenticate to the Kubernetes dashboard, you must use the `kubectl proxy` command or a reverse proxy that injects the `id_token`.
-->
1. Kubernetes 沒有提供用來觸發身份認證過程的 "Web 介面"。
   因為不存在用來收集使用者憑據的瀏覽器或使用者介面，你必須自己先行完成對身份服務的認證過程。
2. `id_token` 令牌不可收回。因其屬性類似於證書，其生命期一般很短（只有幾分鐘），
   所以，每隔幾分鐘就要獲得一個新的令牌這件事可能很讓人頭疼。
3. 如果需要向 Kubernetes 控制面板執行身份認證，你必須使用 `kubectl proxy`
   命令或者一個能夠注入 `id_token` 的反向代理。

<!--
#### Configuring the API Server

To enable the plugin, configure the following flags on the API server:
-->
#### 配置 API 伺服器    {#configuring-the-api-server}

要啟用此外掛，須在 API 伺服器上配置以下標誌：

<!--
| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL of the provider which allows the API server to discover public signing keys. Only URLs which use the `https://` scheme are accepted.  This is typically the provider's discovery URL without a path, for example "https://accounts.google.com" or "https://login.salesforce.com".  This URL should point to the level below .well-known/openid-configuration | If the discovery URL is `https://accounts.google.com/.well-known/openid-configuration`, the value should be `https://accounts.google.com` | Yes |
| `--oidc-client-id` |  A client id that all tokens must be issued for. | kubernetes | Yes |
| `--oidc-username-claim` | JWT claim to use as the user name. By default `sub`, which is expected to be a unique identifier of the end user. Admins can choose other claims, such as `email` or `name`, depending on their provider. However, claims other than `email` will be prefixed with the issuer URL to prevent naming clashes with other plugins. | sub | No |
| `--oidc-username-prefix` | Prefix prepended to username claims to prevent clashes with existing names (such as `system:` users). For example, the value `oidc:` will create usernames like `oidc:jane.doe`. If this flag isn't provided and `--oidc-username-claim` is a value other than `email` the prefix defaults to `( Issuer URL )#` where `( Issuer URL )` is the value of `--oidc-issuer-url`. The value `-` can be used to disable all prefixing. | `oidc:` | No |
| `--oidc-groups-claim` | JWT claim to use as the user's group. If the claim is present it must be an array of strings. | groups | No |
| `--oidc-groups-prefix` | Prefix prepended to group claims to prevent clashes with existing names (such as `system:` groups). For example, the value `oidc:` will create group names like `oidc:engineering` and `oidc:infra`. | `oidc:` | No |
| `--oidc-required-claim` | A key=value pair that describes a required claim in the ID Token. If set, the claim is verified to be present in the ID Token with a matching value. Repeat this flag to specify multiple claims. | `claim=value` | No |
| `--oidc-ca-file` | The path to the certificate for the CA that signed your identity provider's web certificate.  Defaults to the host's root CAs. | `/etc/kubernetes/ssl/kc-ca.pem` | No |
-->

| 引數 | 描述 | 示例 | 必需？ |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | 允許 API 伺服器發現公開的簽名金鑰的服務的 URL。只接受模式為 `https://` 的 URL。此值通常設定為服務的發現 URL，不含路徑。例如："https://accounts.google.com" 或 "https://login.salesforce.com"。此 URL 應指向 .well-known/openid-configuration 下一層的路徑。 | 如果發現 URL 是 `https://accounts.google.com/.well-known/openid-configuration`，則此值應為 `https://accounts.google.com` | 是 |
| `--oidc-client-id` |  所有令牌都應發放給此客戶 ID。 | kubernetes | 是 |
| `--oidc-username-claim` | 用作使用者名稱的 JWT 申領（JWT Claim）。預設情況下使用 `sub` 值，即終端使用者的一個唯一的識別符號。管理員也可以選擇其他申領，例如 `email` 或者 `name`，取決於所用的身份服務。不過，除了 `email` 之外的申領都會被新增令牌發放者的 URL 作為字首，以免與其他外掛產生命名衝突。 | sub | 否 |
| `--oidc-username-prefix` | 要新增到使用者名稱申領之前的字首，用來避免與現有使用者名稱發生衝突（例如：`system:` 使用者）。例如，此標誌值為 `oidc:` 時將建立形如 `oidc:jane.doe` 的使用者名稱。如果此標誌未設定，且 `--oidc-username-claim` 標誌值不是 `email`，則預設字首為 `<令牌發放者的 URL>#`，其中 `<令牌發放者 URL >` 的值取自 `--oidc-issuer-url` 標誌的設定。此標誌值為 `-` 時，意味著禁止新增使用者名稱字首。 | `oidc:` | 否 |
| `--oidc-groups-claim` | 用作使用者組名的 JWT 申領。如果所指定的申領確實存在，則其值必須是一個字串陣列。 | groups | 否 |
| `--oidc-groups-prefix` | 新增到組申領的字首，用來避免與現有使用者組名（如：`system:` 組）發生衝突。例如，此標誌值為 `oidc:` 時，所得到的使用者組名形如 `oidc:engineering` 和 `oidc:infra`。 | `oidc:` | 否 |
| `--oidc-required-claim` | 取值為一個 key=value 偶對，意為 ID 令牌中必須存在的申領。如果設定了此標誌，則 ID 令牌會被檢查以確定是否包含取值匹配的申領。此標誌可多次重複，以指定多個申領。 | `claim=value` | 否 |
| `--oidc-ca-file` | 指向一個 CA 證書的路徑，該 CA 負責對你的身份服務的 Web 證書提供簽名。預設值為宿主系統的根 CA。 | `/etc/kubernetes/ssl/kc-ca.pem` | 否 |

<!--
Importantly, the API server is not an OAuth2 client, rather it can only be
configured to trust a single issuer. This allows the use of public providers,
such as Google, without trusting credentials issued to third parties. Admins who
wish to utilize multiple OAuth clients should explore providers which support the
`azp` (authorized party) claim, a mechanism for allowing one client to issue
tokens on behalf of another.
-->
很重要的一點是，API 伺服器並非一個 OAuth2 客戶端，相反，它只能被配置為
信任某一個令牌發放者。這使得使用公共服務（如 Google）的使用者可以不信任發放給
第三方的憑據。
如果管理員希望使用多個 OAuth 客戶端，他們應該研究一下那些支援 `azp`
（Authorized Party，被授權方）申領的服務。
`azp` 是一種允許某客戶端代替另一客戶端發放令牌的機制。

<!--
Kubernetes does not provide an OpenID Connect Identity Provider.
You can use an existing public OpenID Connect Identity Provider (such as Google, or
[others](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)).
Or, you can run your own Identity Provider, such as CoreOS [dex](https://github.com/coreos/dex),
[Keycloak](https://github.com/keycloak/keycloak),
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa), or
Tremolo Security's [OpenUnison](https://openunison.github.io/).
-->
Kubernetes 並未提供 OpenID Connect 的身份服務。
你可以使用現有的公共的 OpenID Connect 身份服務（例如 Google 或者
[其他服務](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)）。
或者，你也可以選擇自己執行一個身份服務，例如
CoreOS [dex](https://github.com/coreos/dex)、
[Keycloak](https://github.com/keycloak/keycloak)、
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa) 或者
Tremolo Security 的 [OpenUnison](https://openunison.github.io/)。

<!--
For an identity provider to work with Kubernetes it must:

1.  Support [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html); not all do.
2.  Run in TLS with non-obsolete ciphers
3.  Have a CA signed certificate (even if the CA is not a commercial CA or is self signed)
-->
要在 Kubernetes 環境中使用某身份服務，該服務必須：

1.  支援 [OpenID connect 發現](https://openid.net/specs/openid-connect-discovery-1_0.html)；
    但事實上並非所有服務都具備此能力
2.  執行 TLS 協議且所使用的加密元件都未過時
3.  擁有由 CA 簽名的證書（即使 CA 不是商業 CA 或者是自簽名的 CA 也可以）

<!--
A note about requirement #3 above, requiring a CA signed certificate.  If you deploy your own identity provider (as opposed to one of the cloud providers like Google or Microsoft) you MUST have your identity provider's web server certificate signed by a certificate with the `CA` flag set to `TRUE`, even if it is self signed.  This is due to GoLang's TLS client implementation being very strict to the standards around certificate validation.  If you don't have a CA handy, you can use [this script](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh) from the Dex team to create a simple CA and a signed certificate and key pair.
Or you can use [this similar script](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh) that generates SHA256 certs with a longer life and larger key size.
-->
關於上述第三條需求，即要求具備 CA 簽名的證書，有一些額外的注意事項。
如果你部署了自己的身份服務，而不是使用雲廠商（如 Google 或 Microsoft）所提供的服務，
你必須對身份服務的 Web 伺服器證書進行簽名，簽名所用證書的 `CA` 標誌要設定為
`TRUE`，即使用的是自簽名證書。這是因為 GoLang 的 TLS 客戶端實現對證書驗證
標準方面有非常嚴格的要求。如果你手頭沒有現成的 CA 證書，可以使用 CoreOS
團隊所開發的[這個指令碼](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh)
來建立一個簡單的 CA 和被簽了名的證書與金鑰對。
或者你也可以使用
[這個類似的指令碼](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh)，
生成一個合法期更長、金鑰尺寸更大的 SHA256 證書。

<!--
Setup instructions for specific systems:
-->
特定系統的安裝指令：

- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)

<!--
#### Using kubectl

##### Option 1 - OIDC Authenticator

The first option is to use the kubectl `oidc` authenticator, which sets the `id_token` as a bearer token for all requests and refreshes the token once it expires. After you've logged into your provider, use kubectl to add your `id_token`, `refresh_token`, `client_id`, and `client_secret` to configure the plugin.

Providers that don't return an `id_token` as part of their refresh token response aren't supported by this plugin and should use "Option 2" below.
-->
#### 使用 kubectl   {#using-kubectl}

##### 選項一 - OIDC 身份認證元件

第一種方案是使用 kubectl 的 `oidc` 身份認證元件，該元件將 `id_token` 設定
為所有請求的持有者令牌，並且在令牌過期時自動重新整理。在你登入到你的身份服務之後，
可以使用 kubectl 來新增你的 `id_token`、`refresh_token`、`client_id` 和
`client_secret`，以配置該外掛。

如果服務在其重新整理令牌響應中不包含 `id_token`，則此外掛無法支援該服務。
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
作為示例，在完成對你的身份服務的身份認證之後，執行下面的命令：

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
此操作會生成以下配置：

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
Once your `id_token` expires, `kubectl` will attempt to refresh your `id_token` using your `refresh_token` and `client_secret` storing the new values for the `refresh_token` and `id_token` in your `.kube/config`.
-->
當你的 `id_token` 過期時，`kubectl` 會嘗試使用你的 `refresh_token` 來重新整理你的
`id_token`，並且在 `.kube/config` 檔案的 `client_secret` 中存放 `refresh_token`
和 `id_token` 的新值。

<!--
##### Option 2 - Use the `--token` Option

The `kubectl` command lets you pass in a token using the `--token` option. Copy and paste the `id_token` into this option:
-->
##### 選項二 - 使用 `--token` 選項

`kubectl` 命令允許你使用 `--token` 選項傳遞一個令牌。
你可以將 `id_token` 的內容複製貼上過來，作為此標誌的取值：

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```

<!--
### Webhook Token Authentication

Webhook authentication is a hook for verifying bearer tokens.

* `--authentication-token-webhook-config-file` a configuration file describing how to access the remote webhook service.
* `--authentication-token-webhook-cache-ttl` how long to cache authentication decisions. Defaults to two minutes.
-->
### Webhook 令牌身份認證   {#webhook-token-authentication}

Webhook 身份認證是一種用來驗證持有者令牌的回撥機制。

* `--authentication-token-webhook-config-file` 指向一個配置檔案，其中描述
  如何訪問遠端的 Webhook 服務。
* `--authentication-token-webhook-cache-ttl` 用來設定身份認證決定的快取時間。
  預設時長為 2 分鐘。

<!--
The configuration file uses the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file format. Within the file, `clusters` refers to the remote service and
`users` refers to the API server webhook. An example would be:
-->
配置檔案使用 [kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
檔案的格式。檔案中，`clusters` 指代遠端服務，`users` 指代遠端 API 服務
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
# API 物件類別
kind: Config
# clusters 指代遠端服務
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # 用來驗證遠端服務的 CA
      server: https://authn.example.com/authenticate # 要查詢的遠端服務 URL。生產環境中建議使用 'https'。

# users 指代 API 服務的 Webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhook 外掛要使用的證書
      client-key: /path/to/key.pem          # 與證書匹配的金鑰

# kubeconfig 檔案需要一個上下文（Context），此上下文用於本 API 伺服器
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```

<!--
When a client attempts to authenticate with the API server using a bearer token as discussed [above](#putting-a-bearer-token-in-a-request),
the authentication webhook POSTs a JSON-serialized `TokenReview` object containing the token to the remote service.
-->
當客戶端嘗試在 API 伺服器上使用持有者令牌完成身份認證（
如[前](#putting-a-bearer-token-in-a-request)所述）時，
身份認證 Webhook 會用 POST 請求傳送一個 JSON 序列化的物件到遠端服務。
該物件是 `TokenReview` 物件，
其中包含持有者令牌。
Kubernetes 不會強制請求提供此 HTTP 頭部。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/) as other Kubernetes API objects.
Implementers should check the `apiVersion` field of the request to ensure correct deserialization,
and **must** respond with a `TokenReview` object of the same version as the request.
-->
要注意的是，Webhook API 物件和其他 Kubernetes API 物件一樣，也要受到同一
[版本相容規則](/zh-cn/docs/concepts/overview/kubernetes-api/)約束。
實現者應檢查請求的 `apiVersion` 欄位以確保正確的反序列化，
並且**必須**以與請求相同版本的 `TokenReview` 物件進行響應。


{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
<!--
The Kubernetes API server defaults to sending `authentication.k8s.io/v1beta1` token reviews for backwards compatibility.
To opt into receiving `authentication.k8s.io/v1` token reviews, the API server must be started with `--authentication-token-webhook-version=v1`.
-->
Kubernetes API 伺服器預設傳送 `authentication.k8s.io/v1beta1` 令牌以實現向後相容性。
要選擇接收 `authentication.k8s.io/v1` 令牌認證，API 伺服器必須以 `--authentication-token-webhook-version=v1` 啟動。
{{< /note >}}

```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
   # 傳送到 API 伺服器的不透明持有者令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的伺服器的受眾識別符號的可選列表。
    # 受眾感知令牌驗證器（例如，OIDC 令牌驗證器）
    # 應驗證令牌是否針對此列表中的至少一個受眾，
    # 並返回此列表與響應狀態中令牌的有效受眾的交集。
    # 這確保了令牌對於向其提供給的伺服器進行身份驗證是有效的。
    # 如果未提供受眾，則應驗證令牌以向 Kubernetes API 伺服器進行身份驗證。
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # 傳送到 API 伺服器的不透明匿名令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的伺服器的受眾識別符號的可選列表。
    # 受眾感知令牌驗證器（例如，OIDC 令牌驗證器）
    # 應驗證令牌是否針對此列表中的至少一個受眾，
    # 並返回此列表與響應狀態中令牌的有效受眾的交集。
    # 這確保了令牌對於向其提供給的伺服器進行身份驗證是有效的。
    # 如果未提供受眾，則應驗證令牌以向 Kubernetes API 伺服器進行身份驗證。
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
遠端服務預計會填寫請求的 `status` 欄位以指示登入成功。
響應正文的 `spec` 欄位被忽略並且可以省略。
遠端服務必須使用它收到的相同 `TokenReview` API 版本返回響應。
承載令牌的成功驗證將返回：

{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必要
      "username": "janedoe@example.com",
      # 可選
      "uid": "42",
      # 可選的組成員身份
      "groups": ["developers", "qa"],
      # 認證者提供的可選附加資訊。
      # 此欄位不可包含機密資料，因為這類資料可能被記錄在日誌或 API 物件中，
      # 並且可能傳遞給 admission webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 驗證器可以返回的、可選的使用者感知令牌列表，
    # 包含令牌對其有效的、包含於 `spec.audiences` 列表中的受眾。
    # 如果省略，則認為該令牌可用於對 Kubernetes API 伺服器進行身份驗證。
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必要
      "username": "janedoe@example.com",
      # 可選
      "uid": "42",
      # 可選的組成員身份
      "groups": ["developers", "qa"],
      # 認證者提供的可選附加資訊。
      # 此欄位不可包含機密資料，因為這類資料可能被記錄在日誌或 API 物件中，
      # 並且可能傳遞給 admission webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 驗證器可以返回的、可選的使用者感知令牌列表，
    # 包含令牌對其有效的、包含於 `spec.audiences` 列表中的受眾。
    # 如果省略，則認為該令牌可用於對 Kubernetes API 伺服器進行身份驗證。
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
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可選地包括有關身份驗證失敗原因的詳細資訊。
    # 如果沒有提供錯誤資訊，API 將返回一個通用的 Unauthorized 訊息。
    # 當 authenticated=true 時，error 欄位被忽略。
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可選地包括有關身份驗證失敗原因的詳細資訊。
    # 如果沒有提供錯誤資訊，API 將返回一個通用的 Unauthorized 訊息。
    # 當 authenticated=true 時，error 欄位被忽略。
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

API 伺服器可以配置成從請求的頭部欄位值（如 `X-Remote-User`）中辯識使用者。
這一設計是用來與某身份認證代理一起使用 API 伺服器，代理負責設定請求的頭部欄位值。

<!--
* `--requestheader-username-headers` Required, case-insensitive. Header names to check, in order, for the user identity. The first header containing a value is used as the username.
* `--requestheader-group-headers` 1.6+. Optional, case-insensitive. "X-Remote-Group" is suggested. Header names to check, in order, for the user's groups. All values in all specified headers are used as group names.
* `--requestheader-extra-headers-prefix` 1.6+. Optional, case-insensitive. "X-Remote-Extra-" is suggested. Header prefixes to look for to determine extra information about the user (typically used by the configured authorization plugin). Any headers beginning with any of the specified prefixes have the prefix removed. The remainder of the header name is lowercased and [percent-decoded](https://tools.ietf.org/html/rfc3986#section-2.1) and becomes the extra key, and the header value is the extra value.
-->
* `--requestheader-username-headers` 必需欄位，大小寫不敏感。用來設定要獲得使用者身份所要檢查的頭部欄位名稱列表（有序）。第一個包含數值的欄位會被用來提取使用者名稱。
* `--requestheader-group-headers` 可選欄位，在 Kubernetes 1.6 版本以後支援，大小寫不敏感。
  建議設定為 "X-Remote-Group"。用來指定一組頭部欄位名稱列表，以供檢查使用者所屬的組名稱。
  所找到的全部頭部欄位的取值都會被用作使用者組名。
* `--requestheader-extra-headers-prefix` 可選欄位，在 Kubernetes 1.6 版本以後支援，大小寫不敏感。
  建議設定為 "X-Remote-Extra-"。用來設定一個頭部欄位的字首字串，API 伺服器會基於所給
  字首來查詢與使用者有關的一些額外資訊。這些額外資訊通常用於所配置的鑑權外掛。
  API 伺服器會將與所給字首匹配的頭部欄位過濾出來，去掉其字首部分，將剩餘部分
  轉換為小寫字串並在必要時執行[百分號解碼](https://tools.ietf.org/html/rfc3986#section-2.1)
  後，構造新的附加資訊欄位鍵名。原來的頭部欄位值直接作為附加資訊欄位的值。

<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), the extra key could only contain characters which were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
For example, with this configuration:
-->
{{< note >}}
在 1.13.3 版本之前（包括 1.10.7、1.9.11），附加欄位的鍵名只能包含
[HTTP 頭部標籤的合法字元](https://tools.ietf.org/html/rfc7230#section-3.2.6)。
{{< /note >}}

例如，使用下面的配置：

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
會生成下面的使用者資訊：

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

* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate must be presented and validated against the certificate authorities in the specified file before the request headers are checked for user names.
* `--requestheader-allowed-names` Optional. List of Common Name values (CNs). If set, a valid client certificate with a CN in the specified list must be presented before the request headers are checked for user names. If empty, any CN is allowed.
-->
為了防範頭部資訊偵聽，在請求中的頭部欄位被檢視之前，
身份認證代理需要向 API 伺服器提供一份合法的客戶端證書，
供後者使用所給的 CA 來執行驗證。
警告：*不要* 在不同的上下文中複用 CA 證書，除非你清楚這樣做的風險是什麼以及
應如何保護 CA 用法的機制。

* `--requestheader-client-ca-file` 必需欄位，給出 PEM 編碼的證書包。
  在檢查請求的頭部欄位以提取使用者名稱資訊之前，必須提供一個合法的客戶端證書，
  且該證書要能夠被所給檔案中的機構所驗證。
* `--requestheader-allowed-names` 可選欄位，用來給出一組公共名稱（CN）。
  如果此標誌被設定，則在檢視請求中的頭部以提取使用者資訊之前，必須提供
  包含此列表中所給的 CN 名的、合法的客戶端證書。

<!--
## Anonymous requests

When enabled, requests that are not rejected by other configured authentication methods are
treated as anonymous requests, and given a username of `system:anonymous` and a group of
`system:unauthenticated`.
-->
## 匿名請求   {#anonymous-requests}

啟用匿名請求支援之後，如果請求沒有被已配置的其他身份認證方法拒絕，則被視作
匿名請求（Anonymous Requests）。這類請求獲得使用者名稱 `system:anonymous` 和
對應的使用者組 `system:unauthenticated`。

<!--
For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error.
A request providing no bearer token would be treated as an anonymous request.

In 1.5.1-1.5.x, anonymous access is disabled by default, and can be enabled by
passing the `--anonymous-auth=true` option to the API server.
-->
例如，在一個配置了令牌身份認證且啟用了匿名訪問的伺服器上，如果請求提供了非法的
持有者令牌，則會返回 `401 Unauthorized` 錯誤。
如果請求沒有提供持有者令牌，則被視為匿名請求。

在 1.5.1-1.5.x 版本中，匿名訪問預設情況下是被禁用的，可以透過為 API 伺服器設定
`--anonymous-auth=true` 來啟用。

<!--
In 1.6+, anonymous access is enabled by default if an authorization mode other than `AlwaysAllow`
is used, and can be disabled by passing the `--anonymous-auth=false` option to the API server.
Starting in 1.6, the ABAC and RBAC authorizers require explicit authorization of the
`system:anonymous` user or the `system:unauthenticated` group, so legacy policy rules
that grant access to the `*` user or `*` group do not include anonymous users.
-->
在 1.6 及之後版本中，如果所使用的鑑權模式不是 `AlwaysAllow`，則匿名訪問預設是被啟用的。
從 1.6 版本開始，ABAC 和 RBAC 鑑權模組要求對 `system:anonymous` 使用者或者
`system:unauthenticated` 使用者組執行顯式的許可權判定，所以之前的為 `*` 使用者或
`*` 使用者組賦予訪問許可權的策略規則都不再包含匿名使用者。

<!--
## User impersonation

A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.
-->
## 使用者偽裝  {#user-impersonation}

一個使用者可以透過偽裝（Impersonation）頭部欄位來以另一個使用者的身份執行操作。
使用這一能力，你可以手動過載請求被身份認證所識別出來的使用者資訊。
例如，管理員可以使用這一功能特性來臨時偽裝成另一個使用者，檢視請求是否被拒絕，
從而除錯鑑權策略中的問題，

<!--
Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.

* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users have impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.
-->
帶偽裝的請求首先會被身份認證識別為發出請求的使用者，之後會切換到使用被偽裝的使用者
的使用者資訊。

* 使用者發起 API 呼叫時 _同時_ 提供自身的憑據和偽裝頭部欄位資訊
* API 伺服器對使用者執行身份認證
* API 伺服器確認透過認證的使用者具有偽裝特權
* 請求使用者的資訊被替換成偽裝欄位的值
* 評估請求，鑑權元件針對所偽裝的使用者資訊執行操作

<!--
The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups. Optional. Requires "Impersonate-User".
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user. Optional. Requires "Impersonate-User". In order to be preserved consistently, `( extra name )` must be lower-case, and any characters which aren't [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6) MUST be utf8 and [percent-encoded](https://tools.ietf.org/html/rfc3986#section-2.1).
* `Impersonate-Uid`: A unique identifier that represents the user being impersonated. Optional. Requires "Impersonate-User". Kubernetes does not impose any format requirements on this string.
-->
以下 HTTP 頭部欄位可用來執行偽裝請求：

* `Impersonate-User`：要偽裝成的使用者名稱
* `Impersonate-Group`：要偽裝成的使用者組名。可以多次指定以設定多個使用者組。
  可選欄位；要求 "Impersonate-User" 必須被設定。
* `Impersonate-Extra-<附加名稱>`：一個動態的頭部欄位，用來設定與使用者相關的附加欄位。
  此欄位可選；要求 "Impersonate-User" 被設定。為了能夠以一致的形式保留，
  `<附加名稱>`部分必須是小寫字元，如果有任何字元不是
  [合法的 HTTP 頭部標籤字元](https://tools.ietf.org/html/rfc7230#section-3.2.6)，
  則必須是 utf8 字元，且轉換為[百分號編碼](https://tools.ietf.org/html/rfc3986#section-2.1)。
* `Impersonate-Uid`：一個唯一識別符號，用來表示所偽裝的使用者。此頭部可選。
  如果設定，則要求 "Impersonate-User" 也存在。
  Kubernetes 對此字串沒有格式要求。

<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), `( extra name )` could only contain characters which were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
{{< note >}}
在 1.11.3 版本之前（以及 1.10.7、1.9.11），`<附加名稱>` 只能包含
合法的 HTTP 標籤字元。
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
偽裝帶有使用者組的使用者時，所使用的偽裝頭部欄位示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

<!--
An example of the impersonation headers used when impersonating a user with a UID and
extra fields:
-->
偽裝帶有 UID 和附加欄位的使用者時，所使用的偽裝頭部欄位示例：

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
在使用 `kubectl` 時，可以使用 `--as` 標誌來配置 `Impersonate-User` 頭部欄位值，
使用 `--as-group` 標誌配置 `Impersonate-Group` 頭部欄位值。

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

<!--
Set the `--as` and `--as-group` flag:
-->
設定 `--as` 和 `--as-group` 標誌：

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
`kubectl` 不能對附加欄位或 UID 執行偽裝。
{{< /note >}}

<!--
To impersonate a user, group, user identifier (UID) or extra fields, the impersonating user must
have the ability to perform the "impersonate" verb on the kind of attribute
being impersonated ("user", "group", "uid", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:
-->
若要偽裝成某個使用者、某個組、使用者識別符號（UID））或者設定附加欄位，
執行偽裝操作的使用者必須具有對所偽裝的類別（“user”、“group”、“uid” 等）執行 “impersonate”
動詞操作的能力。
對於啟用了 RBAC 鑑權外掛的叢集，下面的 ClusterRole 封裝了設定使用者和組偽裝欄位所需的規則：

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
為了執行偽裝，附加欄位和所偽裝的 UID 都位於 "authorization.k8s.io" `apiGroup` 中。
附加欄位會被作為 `userextras` 資源的子資源來執行許可權評估。
如果要允許使用者為附加欄位 “scopes” 和 UID 設定偽裝頭部，該使用者需要被授予以下角色：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# 可以設定 "Impersonate-Extra-scopes" 和 "Impersonate-Uid" 頭部
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

<!--
The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.
-->
你也可以透過約束資源可能對應的 `resourceNames` 限制偽裝頭部的取值：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# 可以偽裝成使用者 "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# 可以偽裝成使用者組 "developers" 和 "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# 可以將附加欄位 "scopes" 偽裝成 "view" 和 "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# 可以偽裝 UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

<!--
## client-go credential plugins
-->
## client-go 憑據外掛  {#client-go-credential-plugins}

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
`k8s.io/client-go` 及使用它的工具（如 `kubectl` 和 `kubelet`）可以執行某個外部
命令來獲得使用者的憑據資訊。

這一特性的目的是便於客戶端與 `k8s.io/client-go` 並不支援的身份認證協議（LDAP、
Kerberos、OAuth2、SAML 等）繼承。
外掛實現特定於協議的邏輯，之後返回不透明的憑據以供使用。
幾乎所有的憑據外掛使用場景中都需要在伺服器端存在一個支援
[Webhook 令牌身份認證元件](#webhook-token-authentication)的模組，
負責解析客戶端外掛所生成的憑據格式。

<!--
### Example use case

In a hypothetical use case, an organization would run an external service that exchanges LDAP credentials
for user specific, signed tokens. The service would also be capable of responding to [webhook token
authenticator](#webhook-token-authentication) requests to validate the tokens. Users would be required
to install a credential plugin on their workstation.
-->
### 示例應用場景   {#example-use-case}

在一個假想的應用場景中，某組織執行這一個外部的服務，能夠將特定使用者的已簽名的
令牌轉換成 LDAP 憑據。此服務還能夠對
[Webhook 令牌身份認證元件](#webhook-token-authentication)的請求做出響應以
驗證所提供的令牌。使用者需要在自己的工作站上安裝一個憑據外掛。

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
* 憑據外掛提示使用者輸入 LDAP 憑據，並與外部服務互動，獲得令牌。
* 憑據外掛將令牌返回該 client-go，後者將其用作持有者令牌提交給 API 伺服器。
* API 伺服器使用[Webhook 令牌身份認證元件](#webhook-token-authentication)向
  外部服務發出 `TokenReview` 請求。
* 外部服務檢查令牌上的簽名，返回使用者的使用者名稱和使用者組資訊。

<!--
### Configuration

Credential plugins are configured through [kubectl config files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
as part of the user fields.
-->
### 配置  {#configuration}

憑據外掛透過 [kubectl 配置檔案](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
來作為 user 欄位的一部分設定。

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
      #
      # 外掛返回的 API 版本必需與這裡列出的版本匹配。
      #
      # 要與支援多個版本的工具（如 client.authentication.k8s.io/v1beta1）整合，
      # 可以設定一個環境變數或者向工具傳遞一個引數標明 exec 外掛所期望的版本，
      # 或者從 KUBERNETES_EXEC_INFO 環境變數的 ExecCredential 物件中讀取版本資訊。
      apiVersion: "client.authentication.k8s.io/v1"

      # 執行此外掛時要設定的環境變數。可選欄位。
      env:
      - name: "FOO"
        value: "bar"

      # 執行外掛時要傳遞的引數。可選欄位。
      args:
      - "arg1"
      - "arg2"

      # 當可執行檔案不存在時顯示給使用者的文字。可選的。
      installHint: |
        需要 example-client-go-exec-plugin 來在當前叢集上執行身份認證。可以透過以下命令安裝：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 環境變數的一部分向這個 exec 外掛
      # 提供叢集資訊（可能包含非常大的 CA 資料）
      provideClusterInfo: true

      # Exec 外掛與標準輸入 I/O 資料流之間的協議。如果協議無法滿足，
      # 則外掛無法執行並會返回錯誤資訊。合法的值包括 "Never" （Exec 外掛從不使用標準輸入），
      # "IfAvailable" （Exec 外掛希望在可以的情況下使用標準輸入），
      # 或者 "Always" （Exec 外掛需要使用標準輸入才能工作）。必需欄位。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 為每個叢集 exec 配置保留的副檔名
      extension:
        arbitrary: config
        this: 在設定 provideClusterInfo 時可透過環境變數 KUBERNETES_EXEC_INFO 指定
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
      #
      # 外掛返回的 API 版本必需與這裡列出的版本匹配。
      #
      # 要與支援多個版本的工具（如 client.authentication.k8s.io/v1）整合，
      # 可以設定一個環境變數或者向工具傳遞一個引數標明 exec 外掛所期望的版本，
      # 或者從 KUBERNETES_EXEC_INFO 環境變數的 ExecCredential 物件中讀取版本資訊。
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # 執行此外掛時要設定的環境變數。可選欄位。
      env:
      - name: "FOO"
        value: "bar"

      # 執行外掛時要傳遞的引數。可選欄位。
      args:
      - "arg1"
      - "arg2"

      # 當可執行檔案不存在時顯示給使用者的文字。可選的。
      installHint: |
        需要 example-client-go-exec-plugin 來在當前叢集上執行身份認證。可以透過以下命令安裝：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 環境變數的一部分向這個 exec 外掛
      # 提供叢集資訊（可能包含非常大的 CA 資料）
      provideClusterInfo: true

      # Exec 外掛與標準輸入 I/O 資料流之間的協議。如果協議無法滿足，
      # 則外掛無法執行並會返回錯誤資訊。合法的值包括 "Never" （Exec 外掛從不使用標準輸入），
      # "IfAvailable" （Exec 外掛希望在可以的情況下使用標準輸入），
      # 或者 "Always" （Exec 外掛需要使用標準輸入才能工作）。可選欄位。
      # 預設值為 "IfAvailable"。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 為每個叢集 exec 配置保留的副檔名
      extension:
        arbitrary: config
        this: 在設定 provideClusterInfo 時可透過環境變數 KUBERNETES_EXEC_INFO 指定
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
解析相對命令路徑時，kubectl 將其視為與配置檔案比較而言的相對路徑。
如果 KUBECONFIG 被設定為 `/home/jane/kubeconfig`，而 exec 命令為
`./bin/example-client-go-exec-plugin`，則要執行的可執行檔案為
`/home/jane/bin/example-client-go-exec-plugin`。

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

所執行的命令會在 `stdout` 列印 `ExecCredential` 物件。
`k8s.io/client-go` 使用 `status` 中返回的憑據資訊向 Kubernetes API 伺服器執行身份認證。
所執行的命令會透過環境變數 `KUBERNETES_EXEC_INFO` 收到一個 `ExecCredential` 物件作為其輸入。
此輸入中包含類似於所返回的 `ExecCredential` 物件的預期 API 版本，
以及是否外掛可以使用 `stdin` 與使用者互動這類資訊。

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

在互動式會話（即，某終端）中執行時，`stdin` 是直接暴露給外掛使用的。
外掛應該使用來自 `KUBERNETES_EXEC_INFO` 環境變數的 `ExecCredential`
輸入物件中的 `spec.interactive` 欄位來確定是否提供了 `stdin`。
外掛的 `stdin` 需求（即，為了能夠讓外掛成功執行，是否 `stdin` 是可選的、
必須提供的或者從不會被使用的）是透過 
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec.interactiveMode` 來宣告的（參見下面的表格瞭解合法值）。
欄位 `user.exec.interactiveMode` 在 `client.authentication.k8s.io/v1beta1`
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
| `Never` | 此 exec 外掛從不需要使用標準輸入，因此如論是否有標準輸入提供給使用者輸入，該 exec 外掛都能執行。 |
| `IfAvailable` | 此 exec 外掛希望在標準輸入可用的情況下使用標準輸入，但在標準輸入不存在時也可執行。因此，無論是否存在給使用者提供輸入的標準輸入，此 exec 外掛都會執行。如果存在供使用者輸入的標準輸入，則該標準輸入會被提供給 exec 外掛。 |
| `Always` | 此 exec 外掛需要標準輸入才能正常執行，因此只有存在供使用者輸入的標準輸入時，此 exec 外掛才會執行。如果不存在供使用者輸入的標準輸入，則 exec 外掛無法執行，並且 exec 外掛的執行者會因此返回錯誤資訊。 |
{{< /table >}}

<!--
To use bearer token credentials, the plugin returns a token in the status of the
[`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
-->
與使用持有者令牌憑據，外掛在 [`ExecCredential`](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
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
另一種方案是，返回 PEM 編碼的客戶端證書和金鑰，以便執行 TLS 客戶端身份認證。
如果外掛在後續呼叫中返回了不同的證書或金鑰，`k8s.io/client-go`
會終止其與伺服器的連線，從而強制執行新的 TLS 握手過程。

如果指定了這種方式，則 `clientKeyData` 和 `clientCertificateData` 欄位都必需存在。

`clientCertificateData` 欄位可能包含一些要傳送給伺服器的中間證書（Intermediate
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
作為一種可選方案，響應中還可以包含以
[RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339)
時間戳格式給出的證書到期時間。
證書到期時間的有無會有如下影響：

- 如果響應中包含了到期時間，持有者令牌和 TLS 憑據會被快取，直到到期期限到來、
  或者伺服器返回 401 HTTP 狀態碼，或者程序退出。
- 如果未指定到期時間，則持有者令牌和 TLS 憑據會被快取，直到伺服器返回 401
  HTTP 狀態碼或者程序退出。

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
為了讓 exec 外掛能夠獲得特定與叢集的資訊，可以在
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec` 設定 `provideClusterInfo`。
這一特定於叢集的資訊就會透過 `KUBERNETES_EXEC_INFO` 環境變數傳遞給外掛。
此環境變數中的資訊可以用來執行特定於叢集的憑據獲取邏輯。
下面的 `ExecCredential` 清單描述的是一個示例叢集資訊。

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
        "this": "可以在設定 provideClusterInfo 時透過 KUBERNETES_EXEC_INFO 環境變數提供",
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
        "this": "可以在設定 provideClusterInfo 時透過 KUBERNETES_EXEC_INFO 環境變數提供",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* Read the [client authentication reference (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
* Read the [client authentication reference (v1)](/docs/reference/config-api/client-authentication.v1/)
-->
* 閱讀[客戶端認證參考文件 (v1beta1)](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/)
* 閱讀[客戶端認證參考文件 (v1)](/zh-cn/docs/reference/config-api/client-authentication.v1/)

