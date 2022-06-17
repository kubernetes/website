---
title: Kubernetes API 訪問控制
content_type: concept
---
<!--
---
reviewers:
- erictune
- lavalamp
title: Controlling Access to the Kubernetes API
content_type: concept
---
-->

<!-- overview -->

<!--
This page provides an overview of controlling access to the Kubernetes API.
-->
本頁面概述了對 Kubernetes API 的訪問控制。

<!-- body -->
<!--
Users access the [Kubernetes API](/docs/concepts/overview/kubernetes-api/) using `kubectl`,
client libraries, or by making REST requests.  Both human users and
[Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/) can be
authorized for API access.
When a request reaches the API, it goes through several stages, illustrated in the
following diagram:
-->
使用者使用 `kubectl`、客戶端庫或構造 REST 請求來訪問 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)。
人類使用者和 [Kubernetes 服務賬戶](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)都可以被鑑權訪問 API。
當請求到達 API 時，它會經歷多個階段，如下圖所示：

![Kubernetes API 請求處理步驟示意圖](/images/docs/admin/access-control-overview.svg)

<!-- ## Transport security -->
## 傳輸安全 {#transport-security}

<!--
In a typical Kubernetes cluster, the API serves on port 443, protected by TLS.
The API server presents a certificate. This certificate may be signed using
a private certificate authority (CA), or based on a public key infrastructure linked
to a generally recognized CA.
-->
在典型的 Kubernetes 叢集中，API 伺服器在 443 埠上提供服務，受 TLS 保護。
API 伺服器出示證書。
該證書可以使用私有證書頒發機構（CA）簽名，也可以基於連結到公認的 CA 的公鑰基礎架構簽名。

<!--
If your cluster uses a private certificate authority, you need a copy of that CA
certificate configured into your `~/.kube/config` on the client, so that you can
trust the connection and be confident it was not intercepted.

Your client can present a TLS client certificate at this stage.
-->
如果你的叢集使用私有證書頒發機構，你需要在客戶端的 `~/.kube/config` 檔案中提供該 CA 證書的副本，
以便你可以信任該連線並確認該連線沒有被攔截。

你的客戶端可以在此階段出示 TLS 客戶端證書。

<!-- ## Authentication -->
## 認證 {#authentication}

<!--
Once TLS is established, the HTTP request moves to the Authentication step.
This is shown as step **1** in the diagram.
The cluster creation script or cluster admin configures the API server to run
one or more Authenticator modules.
Authenticators are described in more detail in
[Authentication](/docs/reference/access-authn-authz/authentication/).
-->
如上圖步驟 **1** 所示，建立 TLS 後， HTTP 請求將進入認證（Authentication）步驟。
叢集建立指令碼或者叢集管理員配置 API 伺服器，使之執行一個或多個身份認證元件。
身份認證元件在[認證](/zh-cn/docs/reference/access-authn-authz/authentication/)節中有更詳細的描述。

<!--
The input to the authentication step is the entire HTTP request; however, it typically
examines the headers and/or client certificate.

Authentication modules include client certificates, password, and plain tokens,
bootstrap tokens, and JSON Web Tokens (used for service accounts).

Multiple authentication modules can be specified, in which case each one is tried in sequence,
until one of them succeeds.
-->
認證步驟的輸入整個 HTTP 請求；但是，通常元件只檢查頭部或/和客戶端證書。

認證模組包含客戶端證書、密碼、普通令牌、引導令牌和 JSON Web 令牌（JWT，用於服務賬戶）。

可以指定多個認證模組，在這種情況下，伺服器依次嘗試每個驗證模組，直到其中一個成功。

<!--
If the request cannot be authenticated, it is rejected with HTTP status code 401.
Otherwise, the user is authenticated as a specific `username`, and the user name
is available to subsequent steps to use in their decisions.  Some authenticators
also provide the group memberships of the user, while other authenticators
do not.

While Kubernetes uses usernames for access control decisions and in request logging,
it does not have a `User` object nor does it store usernames or other information about
users in its API.
-->
如果請求認證不透過，伺服器將以 HTTP 狀態碼 401 拒絕該請求。
反之，該使用者被認證為特定的 `username`，並且該使用者名稱可用於後續步驟以在其決策中使用。
部分驗證器還提供使用者的組成員身份，其他則不提供。

<!-- ## Authorization -->
## 鑑權 {#authorization}

<!--
After the request is authenticated as coming from a specific user, the request must be authorized. This is shown as step **2** in the diagram.

A request must include the username of the requester, the requested action, and the object affected by the action. The request is authorized if an existing policy declares that the user has permissions to complete the requested action.

For example, if Bob has the policy below, then he can read pods only in the namespace `projectCaribou`:
-->
如上圖的步驟 **2** 所示，將請求驗證為來自特定的使用者後，請求必須被鑑權。

請求必須包含請求者的使用者名稱、請求的行為以及受該操作影響的物件。
如果現有策略宣告使用者有權完成請求的操作，那麼該請求被鑑權透過。

例如，如果 Bob 有以下策略，那麼他只能在 `projectCaribou` 名稱空間中讀取 Pod。

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
<!--
If Bob makes the following request, the request is authorized because he is allowed to read objects in the `projectCaribou` namespace:
-->
如果 Bob 執行以下請求，那麼請求會被鑑權，因為允許他讀取 `projectCaribou` 名稱空間中的物件。

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
<!--
If Bob makes a request to write (`create` or `update`) to the objects in the `projectCaribou` namespace, his authorization is denied.
If Bob makes a request to read (`get`) objects in a different namespace such as `projectFish`, then his authorization is denied.

Kubernetes authorization requires that you use common REST attributes to interact with existing organization-wide or cloud-provider-wide access control systems.
It is important to use REST formatting because these control systems might interact with other APIs besides the Kubernetes API.
-->
如果 Bob 在 `projectCaribou` 名字空間中請求寫（`create` 或 `update`）物件，其鑑權請求將被拒絕。
如果 Bob 在諸如 `projectFish` 這類其它名字空間中請求讀取（`get`）物件，其鑑權也會被拒絕。

Kubernetes 鑑權要求使用公共 REST 屬性與現有的組織範圍或雲提供商範圍的訪問控制系統進行互動。
使用 REST 格式很重要，因為這些控制系統可能會與 Kubernetes API 之外的 API 互動。

<!--
Kubernetes supports multiple authorization modules, such as ABAC mode, RBAC Mode, and Webhook mode.
When an administrator creates a cluster, they configure the authorization modules that should be used in the API server.
If more than one authorization modules are configured, Kubernetes checks each module,
and if any module authorizes the request, then the request can proceed.
If all of the modules deny the request, then the request is denied (HTTP status code 403).

To learn more about Kubernetes authorization, including details about creating policies using the supported authorization modules,
see [Authorization](/docs/reference/access-authn-authz/authorization/).
-->
Kubernetes 支援多種鑑權模組，例如 ABAC 模式、RBAC 模式和 Webhook 模式等。
管理員建立叢集時，他們配置應在 API 伺服器中使用的鑑權模組。
如果配置了多個鑑權模組，則 Kubernetes 會檢查每個模組，任意一個模組鑑權該請求，請求即可繼續；
如果所有模組拒絕了該請求，請求將會被拒絕（HTTP 狀態碼 403）。

要了解更多有關 Kubernetes 鑑權的更多資訊，包括有關使用支援鑑權模組建立策略的詳細資訊，
請參閱[鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)。

<!-- ## Admission control -->
## 准入控制 {#admission-control}

<!--
Admission Control modules are software modules that can modify or reject requests.
In addition to the attributes available to Authorization modules, Admission
Control modules can access the contents of the object that is being created or modified.

Admission controllers act on requests that create, modify, delete, or connect to (proxy) an object.
Admission controllers do not act on requests that merely read objects.
When multiple admission controllers are configured, they are called in order.
-->
准入控制模組是可以修改或拒絕請求的軟體模組。
除鑑權模組可用的屬性外，准入控制模組還可以訪問正在建立或修改的物件的內容。

准入控制器對建立、修改、刪除或（透過代理）連線物件的請求進行操作。
准入控制器不會對僅讀取物件的請求起作用。
有多個准入控制器被配置時，伺服器將依次呼叫它們。

<!--
This is shown as step **3** in the diagram.

Unlike Authentication and Authorization modules, if any admission controller module
rejects, then the request is immediately rejected.

In addition to rejecting objects, admission controllers can also set complex defaults for
fields.

The available Admission Control modules are described in [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).

Once a request passes all admission controllers, it is validated using the validation routines
for the corresponding API object, and then written to the object store (shown as step **4**).
-->
這一操作如上圖的步驟 **3** 所示。

與身份認證和鑑權模組不同，如果任何准入控制器模組拒絕某請求，則該請求將立即被拒絕。

除了拒絕物件之外，准入控制器還可以為欄位設定複雜的預設值。

可用的准入控制模組在[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)中進行了描述。

請求透過所有準入控制器後，將使用檢驗例程檢查對應的 API 物件，然後將其寫入物件儲存（如步驟 **4** 所示）。

<!--
## Auditing

Kubernetes auditing provides a security-relevant, chronological set of records documenting the sequence of actions in a cluster.
The cluster audits the activities generated by users, by applications that use the Kubernetes API, and by the control plane itself.

For more information, see [Auditing](/docs/tasks/debug/debug-cluster/audit/).
-->

## 審計 {#auditing}

Kubernetes 審計提供了一套與安全相關的、按時間順序排列的記錄，其中記錄了叢集中的操作序列。
叢集對使用者、使用 Kubernetes API 的應用程式以及控制平面本身產生的活動進行審計。

更多資訊請參考 [審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/).

<!-- ## API server ports and IPs -->
## API 伺服器埠和 IP {#api-server-ports-and-ips}

<!--
The previous discussion applies to requests sent to the secure port of the API server
(the typical case).  The API server can actually serve on 2 ports:

By default, the Kubernetes API server serves HTTP on 2 ports:
-->
前面的討論適用於傳送到 API 伺服器的安全埠的請求（典型情況）。 API 伺服器實際上可以在 2 個埠上提供服務：

預設情況下，Kubernetes API 伺服器在 2 個埠上提供 HTTP 服務：

<!--
  1. `localhost` port:

      - is intended for testing and bootstrap, and for other components of the master node
        (scheduler, controller-manager) to talk to the API
      - no TLS
      - default is port 8080
      - default IP is localhost, change with `--insecure-bind-address` flag.
      - request **bypasses** authentication and authorization modules.
      - request handled by admission control module(s).
      - protected by need to have host access

  2. “Secure port”:

      - use whenever possible
      - uses TLS.  Set cert with `--tls-cert-file` and key with `--tls-private-key-file` flag.
      - default is port 6443, change with `--secure-port` flag.
      - default IP is first non-localhost network interface, change with `--bind-address` flag.
      - request handled by authentication and authorization modules.
      - request handled by admission control module(s).
      - authentication and authorization modules run.
 -->
  1. `localhost` 埠:

      - 用於測試和引導，以及主控節點上的其他元件（排程器，控制器管理器）與 API 通訊
      - 沒有 TLS
      - 預設為埠 8080
      - 預設 IP 為 localhost，使用 `--insecure-bind-address` 進行更改
      - 請求 **繞過** 身份認證和鑑權模組
      - 由准入控制模組處理的請求
      - 受需要訪問主機的保護

  2. “安全埠”：

      - 儘可能使用
      - 使用 TLS。 用 `--tls-cert-file` 設定證書，用 `--tls-private-key-file` 設定金鑰
      - 預設埠 6443，使用 `--secure-port` 更改
      - 預設 IP 是第一個非本地網路介面，使用 `--bind-address` 更改
      - 請求須經身份認證和鑑權元件處理
      - 請求須經准入控制模組處理
      - 身份認證和鑑權模組執行


## {{% heading "whatsnext" %}}

<!--
Read more documentation on authentication, authorization and API access control:

- [Authenticating](/docs/reference/access-authn-authz/authentication/)
   - [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
   - [Role Based Access Control](/docs/reference/access-authn-authz/rbac/)
   - [Attribute Based Access Control](/docs/reference/access-authn-authz/abac/)
   - [Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Authorization](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - including [CSR approval](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     and [certificate signing](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Service accounts
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)

You can learn about:
- how Pods can use
  [Secrets](/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  to obtain API credentials.
-->
閱讀更多有關身份認證、鑑權和 API 訪問控制的文件：

- [認證](/zh-cn/docs/reference/access-authn-authz/authentication/)
   - [使用 Bootstrap 令牌進行身份認證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
- [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
   - [動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)
   - [基於角色的訪問控制](/zh-cn/docs/reference/access-authn-authz/rbac/)
   - [基於屬性的訪問控制](/zh-cn/docs/reference/access-authn-authz/abac/)
   - [節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)
   - [Webhook 鑑權](/zh-cn/docs/reference/access-authn-authz/webhook/)
- [證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
   - 包括 [CSR 認證](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     和[證書籤名](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- 服務賬戶
  - [開發者指導](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
  - [管理](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)

你可以瞭解
- Pod 如何使用
  [Secrets](/zh-cn/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  獲取 API 憑證.
