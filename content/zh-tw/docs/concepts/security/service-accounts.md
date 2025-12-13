---
title: 服務賬號
description: >
  瞭解 Kubernetes 中的 ServiceAccount 對象。
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"
content_type: concept
weight: 25
---
<!--
title: Service Accounts
description: >
  Learn about ServiceAccount objects in Kubernetes.
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"
content_type: concept
weight: 25
-->

<!-- overview -->

<!--
This page introduces the ServiceAccount object in Kubernetes, providing
information about how service accounts work, use cases, limitations,
alternatives, and links to resources for additional guidance.
-->
本頁介紹 Kubernetes 中的 ServiceAccount 對象，
講述服務賬號的工作原理、使用場景、限制、替代方案，還提供了一些資源鏈接方便查閱更多指導資訊。

<!-- body -->

<!--
## What are service accounts? {#what-are-service-accounts}
-->
## 什麼是服務賬號？  {#what-are-service-accounts}

<!--
A service account is a type of non-human account that, in Kubernetes, provides
a distinct identity in a Kubernetes cluster. Application Pods, system
components, and entities inside and outside the cluster can use a specific
ServiceAccount's credentials to identify as that ServiceAccount. This identity
is useful in various situations, including authenticating to the API server or
implementing identity-based security policies.
-->
服務賬號是在 Kubernetes 中一種用於非人類使用者的賬號，在 Kubernetes 叢集中提供不同的身份標識。
應用 Pod、系統組件以及叢集內外的實體可以使用特定 ServiceAccount 的憑據來將自己標識爲該 ServiceAccount。
這種身份可用於許多場景，包括向 API 伺服器進行身份認證或實現基於身份的安全策略。

<!--
Service accounts exist as ServiceAccount objects in the API server. Service
accounts have the following properties:
-->
服務賬號以 ServiceAccount 對象的形式存在於 API 伺服器中。服務賬號具有以下屬性：

<!--
* **Namespaced:** Each service account is bound to a Kubernetes
  {{<glossary_tooltip text="namespace" term_id="namespace">}}. Every namespace
  gets a [`default` ServiceAccount](#default-service-accounts) upon creation.

* **Lightweight:** Service accounts exist in the cluster and are
  defined in the Kubernetes API. You can quickly create service accounts to
  enable specific tasks.
-->
* **名字空間限定：** 每個服務賬號都與一個 Kubernetes 名字空間綁定。
  每個名字空間在創建時，會獲得一個[名爲 `default` 的 ServiceAccount](#default-service-accounts)。

* **輕量級：** 服務賬號存在於叢集中，並在 Kubernetes API 中定義。你可以快速創建服務賬號以支持特定任務。

<!--
* **Portable:** A configuration bundle for a complex containerized workload
  might include service account definitions for the system's components. The
  lightweight nature of service accounts and the namespaced identities make
  the configurations portable.
-->
* **可移植性：** 複雜的容器化工作負載的設定包中可能包括針對系統組件的服務賬號定義。
  服務賬號的輕量級性質和名字空間作用域的身份使得這類設定可移植。

<!--
Service accounts are different from user accounts, which are authenticated
human users in the cluster. By default, user accounts don't exist in the Kubernetes
API server; instead, the API server treats user identities as opaque
data. You can authenticate as a user account using multiple methods. Some
Kubernetes distributions might add custom extension APIs to represent user
accounts in the API server.
-->
服務賬號與使用者賬號不同，使用者賬號是叢集中通過了身份認證的人類使用者。預設情況下，
使用者賬號不存在於 Kubernetes API 伺服器中；相反，API 伺服器將使用者身份視爲不透明資料。
你可以使用多種方法認證爲某個使用者賬號。某些 Kubernetes 發行版可能會添加自定義擴展 API
來在 API 伺服器中表示使用者賬號。

<!-- Comparison between service accounts and users -->
{{< table caption="服務賬號與使用者之間的比較" >}}

<!--
| Description | ServiceAccount | User or group |
| --- | --- | --- |
| Location | Kubernetes API (ServiceAccount object) | External |
| Access control | Kubernetes RBAC or other [authorization mechanisms](/docs/reference/access-authn-authz/authorization/#authorization-modules) | Kubernetes RBAC or other identity and access management mechanisms |
| Intended use | Workloads, automation | People |
-->
| 描述 | 服務賬號 | 使用者或組 |
| --- | --- | --- |
| 位置 | Kubernetes API（ServiceAccount 對象）| 外部 |
| 訪問控制 | Kubernetes RBAC 或其他[鑑權機制](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules) | Kubernetes RBAC 或其他身份和訪問管理機制 |
| 目標用途 | 工作負載、自動化工具 | 人 |
{{< /table >}}

<!--
### Default service accounts {#default-service-accounts}
-->
### 預設服務賬號 {#default-service-accounts}

<!--
When you create a cluster, Kubernetes automatically creates a ServiceAccount
object named `default` for every namespace in your cluster. The `default`
service accounts in each namespace get no permissions by default other than the
[default API discovery permissions](/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)
that Kubernetes grants to all authenticated principals if role-based access control (RBAC) is enabled.
If you delete the `default` ServiceAccount object in a namespace, the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
replaces it with a new one.
-->
在你創建叢集時，Kubernetes 會自動爲叢集中的每個名字空間創建一個名爲 `default` 的 ServiceAccount 對象。
在啓用了基於角色的訪問控制（RBAC）時，Kubernetes 爲所有通過了身份認證的主體賦予
[預設 API 發現權限](/zh-cn/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)。
每個名字空間中的 `default` 服務賬號除了這些權限之外，預設沒有其他訪問權限。
如果基於角色的訪問控制（RBAC）被啓用，當你刪除名字空間中的 `default` ServiceAccount 對象時，
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}會用新的 ServiceAccount 對象替換它。

<!--
If you deploy a Pod in a namespace, and you don't
[manually assign a ServiceAccount to the Pod](#assign-to-pod), Kubernetes
assigns the `default` ServiceAccount for that namespace to the Pod.
-->
如果你在某個名字空間中部署 Pod，並且你沒有[手動爲 Pod 指派 ServiceAccount](#assign-to-pod)，
Kubernetes 將該名字空間的 `default` 服務賬號指派給這一 Pod。

<!--
## Use cases for Kubernetes service accounts {#use-cases}

As a general guideline, you can use service accounts to provide identities in
the following scenarios:
-->
## Kubernetes 服務賬號的使用場景   {#use-cases}

一般而言，你可以在以下場景中使用服務賬號來提供身份標識：

<!--
* Your Pods need to communicate with the Kubernetes API server, for example in
  situations such as the following:
  * Providing read-only access to sensitive information stored in Secrets.
  * Granting [cross-namespace access](#cross-namespace), such as allowing a
    Pod in namespace `example` to read, list, and watch for Lease objects in
    the `kube-node-lease` namespace.
-->
* 你的 Pod 需要與 Kubernetes API 伺服器通信，例如在以下場景中：
  * 提供對儲存在 Secret 中的敏感資訊的只讀訪問。
  * 授予[跨名字空間訪問](#cross-namespace)的權限，例如允許 `example` 名字空間中的 Pod 讀取、列舉和監視
    `kube-node-lease` 名字空間中的 Lease 對象。

<!--
* Your Pods need to communicate with an external service. For example, a
  workload Pod requires an identity for a commercially available cloud API,
  and the commercial provider allows configuring a suitable trust relationship.
* [Authenticating to a private image registry using an `imagePullSecret`](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
-->
* 你的 Pod 需要與外部服務進行通信。例如，工作負載 Pod 需要一個身份來訪問某商業化的雲 API，
  並且商業化 API 的提供商允許設定適當的信任關係。
* [使用 `imagePullSecret` 完成在私有映像檔倉庫上的身份認證](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)。

<!--
* An external service needs to communicate with the Kubernetes API server. For
  example, authenticating to the cluster as part of a CI/CD pipeline.
* You use third-party security software in your cluster that relies on the
  ServiceAccount identity of different Pods to group those Pods into different
  contexts.
-->
* 外部服務需要與 Kubernetes API 伺服器進行通信。例如，作爲 CI/CD 流水線的一部分向叢集作身份認證。
* 你在叢集中使用了第三方安全軟體，該軟體依賴不同 Pod 的 ServiceAccount 身份，按不同上下文對這些 Pod 分組。

<!--
## How to use service accounts {#how-to-use}

To use a Kubernetes service account, you do the following:
-->
## 如何使用服務賬號  {#how-to-use}

要使用 Kubernetes 服務賬號，你需要執行以下步驟：

<!--
1. Create a ServiceAccount object using a Kubernetes
   client like `kubectl` or a manifest that defines the object.
1. Grant permissions to the ServiceAccount object using an authorization
   mechanism such as
   [RBAC](/docs/reference/access-authn-authz/rbac/).
-->
1. 使用像 `kubectl` 這樣的 Kubernetes 客戶端或定義對象的清單（manifest）創建 ServiceAccount 對象。
2. 使用鑑權機制（如 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）爲 ServiceAccount 對象授權。

<!--
1. Assign the ServiceAccount object to Pods during Pod creation.

   If you're using the identity from an external service,
   [retrieve the ServiceAccount token](#get-a-token) and use it from that
   service instead.
-->
3. 在創建 Pod 期間將 ServiceAccount 對象指派給 Pod。

   如果你所使用的是來自外部服務的身份，可以[獲取 ServiceAccount 令牌](#get-a-token)，並在該服務中使用這一令牌。

<!--
For instructions, refer to
[Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/).
-->
有關具體操作說明，參閱[爲 Pod 設定服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)。

<!--
### Grant permissions to a ServiceAccount {#grant-permissions}
-->
### 爲 ServiceAccount 授權   {#grant-permissions}

<!--
You can use the built-in Kubernetes
[role-based access control (RBAC)](/docs/reference/access-authn-authz/rbac/)
mechanism to grant the minimum permissions required by each service account.
You create a *role*, which grants access, and then *bind* the role to your
ServiceAccount. RBAC lets you define a minimum set of permissions so that the
service account permissions follow the principle of least privilege. Pods that
use that service account don't get more permissions than are required to
function correctly.
-->
你可以使用 Kubernetes 內置的
[基於角色的訪問控制 (RBAC)](/zh-cn/docs/reference/access-authn-authz/rbac/)機制來爲每個服務賬號授予所需的最低權限。
你可以創建一個用來授權的**角色**，然後將此角色**綁定**到你的 ServiceAccount 上。
RBAC 可以讓你定義一組最低權限，使得服務賬號權限遵循最小特權原則。
這樣使用服務賬號的 Pod 不會獲得超出其正常運行所需的權限。

<!--
For instructions, refer to
[ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions).
-->
有關具體操作說明，參閱 [ServiceAccount 權限](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

<!--
#### Cross-namespace access using a ServiceAccount {#cross-namespace}
-->
#### 使用 ServiceAccount 進行跨名字空間訪問   {#cross-namespace}

<!--
You can use RBAC to allow service accounts in one namespace to perform actions
on resources in a different namespace in the cluster. For example, consider a
scenario where you have a service account and Pod in the `dev` namespace and
you want your Pod to see Jobs running in the `maintenance` namespace. You could
create a Role object that grants permissions to list Job objects. Then,
you'd create a RoleBinding object in the `maintenance` namespace to bind the
Role to the ServiceAccount object. Now, Pods in the `dev` namespace can list
Job objects in the `maintenance` namespace using that service account.
-->
你可以使用 RBAC 允許一個名字空間中的服務賬號對叢集中另一個名字空間的資源執行操作。
例如，假設你在 `dev` 名字空間中有一個服務賬號和一個 Pod，並且希望該 Pod 可以查看 `maintenance`
名字空間中正在運行的 Job。你可以創建一個 Role 對象來授予列舉 Job 對象的權限。
隨後在 `maintenance` 名字空間中創建 RoleBinding 對象將 Role 綁定到此 ServiceAccount 對象上。
現在，`dev` 名字空間中的 Pod 可以使用該服務賬號列出 `maintenance` 名字空間中的 Job 對象集合。

<!--
### Assign a ServiceAccount to a Pod {#assign-to-pod}

To assign a ServiceAccount to a Pod, you set the `spec.serviceAccountName`
field in the Pod specification. Kubernetes then automatically provides the
credentials for that ServiceAccount to the Pod. In v1.22 and later, Kubernetes
gets a short-lived, **automatically rotating** token using the `TokenRequest`
API and mounts the token as a
[projected volume](/docs/concepts/storage/projected-volumes/#serviceaccounttoken).
-->
### 將 ServiceAccount 指派給 Pod   {#assign-to-pod}

要將某 ServiceAccount 指派給某 Pod，你需要在該 Pod 的規約中設置 `spec.serviceAccountName` 字段。
Kubernetes 將自動爲 Pod 提供該 ServiceAccount 的憑據。在 Kubernetes v1.22 及更高版本中，
Kubernetes 使用 `TokenRequest` API 獲取一個短期的、**自動輪換**的令牌，
並以[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/#serviceaccounttoken)的形式掛載此令牌。

<!--
By default, Kubernetes provides the Pod
with the credentials for an assigned ServiceAccount, whether that is the
`default` ServiceAccount or a custom ServiceAccount that you specify.

To prevent Kubernetes from automatically injecting
credentials for a specified ServiceAccount or the `default` ServiceAccount, set the
`automountServiceAccountToken` field in your Pod specification to `false`.
-->
預設情況下，Kubernetes 會將所指派的 ServiceAccount
（無論是 `default` 服務賬號還是你指定的定製 ServiceAccount）的憑據提供給 Pod。

要防止 Kubernetes 自動注入指定的 ServiceAccount 或 `default` ServiceAccount 的憑據，
可以將 Pod 規約中的 `automountServiceAccountToken` 字段設置爲 `false`。

<!-- OK to remove this historical detail after Kubernetes 1.31 is released -->

<!--
In versions earlier than 1.22, Kubernetes provides a long-lived, static token
to the Pod as a Secret.
-->
在 Kubernetes 1.22 之前的版本中，Kubernetes 會將一個長期有效的靜態令牌以 Secret 形式提供給 Pod。

<!--
#### Manually retrieve ServiceAccount credentials {#get-a-token}

If you need the credentials for a ServiceAccount to mount in a non-standard
location, or for an audience that isn't the API server, use one of the
following methods:
-->
#### 手動獲取 ServiceAccount 憑據   {#get-a-token}

如果你需要 ServiceAccount 的憑據並將其掛載到非標準位置，或者用於 API 伺服器之外的受衆，可以使用以下方法之一：

<!--
* [TokenRequest API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
  (recommended): Request a short-lived service account token from within
  your own *application code*. The token expires automatically and can rotate
  upon expiration.
  If you have a legacy application that is not aware of Kubernetes, you
  could use a sidecar container within the same pod to fetch these tokens
  and make them available to the application workload.
-->
* [TokenRequest API](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)（推薦）：
  在你自己的**應用代碼**中請求一個短期的服務賬號令牌。此令牌會自動過期，並可在過期時被輪換。
  如果你有一箇舊的、對 Kubernetes 無感知能力的應用，你可以在同一個 Pod
  內使用邊車容器來獲取這些令牌，並將其提供給應用工作負載。

<!--
* [Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
  (also recommended): In Kubernetes v1.20 and later, use the Pod specification to
  tell the kubelet to add the service account token to the Pod as a
  *projected volume*. Projected tokens expire automatically, and the kubelet
  rotates the token before it expires.
-->
* [令牌卷投射](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)（同樣推薦）：
  在 Kubernetes v1.20 及更高版本中，使用 Pod 規約告知 kubelet 將服務賬號令牌作爲**投射卷**添加到 Pod 中。
  所投射的令牌會自動過期，在過期之前 kubelet 會自動輪換此令牌。

<!--
* [Service Account Token Secrets](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
  (not recommended): You can mount service account tokens as Kubernetes
  Secrets in Pods. These tokens don't expire and don't rotate. In versions prior to v1.24, a permanent token was automatically created for each service account.
  This method is not recommended anymore, especially at scale, because of the risks associated
  with static, long-lived credentials. The [LegacyServiceAccountTokenNoAutoGeneration feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed)
  (which was enabled by default from Kubernetes v1.24 to v1.26),  prevented Kubernetes from automatically creating these tokens for
  ServiceAccounts. The feature gate is removed in v1.27, because it was elevated to GA status; you can still create indefinite service account tokens manually, but should take into account the security implications.
-->
* [服務賬號令牌 Secret](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)（不推薦）：
  你可以將服務賬號令牌以 Kubernetes Secret 的形式掛載到 Pod 中。這些令牌不會過期且不會輪換。
  在 v1.24 版本之前，系統會爲每個服務賬戶自動創建一個永久令牌。此方法已不再被推薦，
  尤其是在大規模應用時，因爲使用靜態、長期有效的憑證存在風險。
  [LegacyServiceAccountTokenNoAutoGeneration 特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed)
  （從 Kubernetes v1.24 至 v1.26 預設啓用），阻止 Kubernetes 自動爲 ServiceAccount 創建這些令牌。
  此特性門控在 v1.27 版本中被移除，因爲此特性已升級爲正式發佈（GA）狀態；
  你仍然可以手動爲 ServiceAccount 創建無限期的服務賬戶令牌，但應考慮到安全影響。

{{< note >}}
<!--
For applications running outside your Kubernetes cluster, you might be considering
creating a long-lived ServiceAccount token that is stored in a Secret. This allows authentication, but the Kubernetes project recommends you avoid this approach.
Long-lived bearer tokens represent a security risk as, once disclosed, the token
can be misused. Instead, consider using an alternative. For example, your external
application can authenticate using a well-protected private key `and` a certificate,
or using a custom mechanism such as an [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) that you implement yourself.
-->
對於運行在 Kubernetes 叢集外的應用，你可能考慮創建一個長期有效的 ServiceAccount 令牌，
並將其儲存在 Secret 中。儘管這種方式可以實現身份認證，但 Kubernetes 項目建議你避免使用此方法。
長期有效的持有者令牌（Bearer Token）會帶來安全風險，一旦泄露，此令牌就可能被濫用。
爲此，你可以考慮使用其他替代方案。例如，你的外部應用可以使用一個保護得很好的私鑰和證書進行身份認證，
或者使用你自己實現的[身份認證 Webhook](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
這類自定義機制。

<!--
You can also use TokenRequest to obtain short-lived tokens for your external application.
-->
你還可以使用 TokenRequest 爲外部應用獲取短期的令牌。
{{< /note >}}

<!--
### Restricting access to Secrets (deprecated) {#enforce-mountable-secrets}
-->
### 限制對 Secret 的訪問（已棄用）  {#enforce-mountable-secrets}

{{< feature-state for_k8s_version="v1.32" state="deprecated" >}}

{{< note >}}
<!--
`kubernetes.io/enforce-mountable-secrets` is deprecated since Kubernetes v1.32. Use separate namespaces to isolate access to mounted secrets.
-->
`kubernetes.io/enforce-mountable-secrets` 自 Kubernetes v1.32 起已棄用。
你可以使用單獨的命名空間來隔離對掛載 Secret 的訪問。
{{< /note >}}

<!--
Kubernetes provides an annotation called `kubernetes.io/enforce-mountable-secrets`
that you can add to your ServiceAccounts. When this annotation is applied,
the ServiceAccount's secrets can only be mounted on specified types of resources,
enhancing the security posture of your cluster.

You can add the annotation to a ServiceAccount using a manifest:
-->
Kubernetes 提供了名爲 `kubernetes.io/enforce-mountable-secrets` 的註解，
你可以添加到你的 ServiceAccount 中。當應用了這個註解後，
ServiceAccount 的 Secret 只能掛載到特定類型的資源上，從而增強叢集的安全性。

你可以使用以下清單將註解添加到一個 ServiceAccount 中：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubernetes.io/enforce-mountable-secrets: "true"
  name: my-serviceaccount
  namespace: my-namespace
```

<!--
When this annotation is set to "true", the Kubernetes control plane ensures that
the Secrets from this ServiceAccount are subject to certain mounting restrictions.
-->
當此註解設置爲 "true" 時，Kubernetes 控制平面確保來自該 ServiceAccount 的 Secret 受到特定掛載限制。

<!--
1. The name of each Secret that is mounted as a volume in a Pod must appear in the `secrets` field of the
   Pod's ServiceAccount.
-->
1. 在 Pod 中作爲卷掛載的每個 Secret 的名稱必須列在該 Pod 中 ServiceAccount 的 `secrets` 字段中。

<!--
1. The name of each Secret referenced using `envFrom` in a Pod must also appear in the `secrets`
   field of the Pod's ServiceAccount.
-->
2. 在 Pod 中使用 `envFrom` 引用的每個 Secret 的名稱也必須列在該 Pod 中
   ServiceAccount 的 `secrets` 字段中。

<!--
1. The name of each Secret referenced using `imagePullSecrets` in a Pod must also appear in the `secrets`
   field of the Pod's ServiceAccount.
-->
3. 在 Pod 中使用 `imagePullSecrets` 引用的每個 Secret 的名稱也必須列在該 Pod 中
   ServiceAccount 的 `secrets` 字段中。

<!--
By understanding and enforcing these restrictions, cluster administrators can maintain a tighter security profile and ensure that secrets are accessed only by the appropriate resources.
-->
通過理解並執行這些限制，叢集管理員可以維護更嚴格的安全設定，並確保 Secret 僅被適當的資源訪問。

<!--
## Authenticating service account credentials {#authenticating-credentials}
-->
## 對服務賬號憑據進行鑑別   {#authenticating-credentials}

<!--
ServiceAccounts use signed
{{<glossary_tooltip term_id="jwt" text="JSON Web Tokens">}}  (JWTs)
to authenticate to the Kubernetes API server, and to any other system where a
trust relationship exists. Depending on how the token was issued
(either time-limited using a `TokenRequest` or using a legacy mechanism with
a Secret), a ServiceAccount token might also have an expiry time, an audience,
and a time after which the token *starts* being valid. When a client that is
acting as a ServiceAccount tries to communicate with the Kubernetes API server,
the client includes an `Authorization: Bearer <token>` header with the HTTP
request. The API server checks the validity of that bearer token as follows:
-->
ServiceAccount 使用簽名的 JSON Web Token（JWT）來向 Kubernetes API
伺服器以及任何其他存在信任關係的系統進行身份認證。根據令牌的簽發方式
（使用 `TokenRequest` 限制時間或使用傳統的 Secret 機制），ServiceAccount
令牌也可能有到期時間、受衆和令牌**開始**生效的時間點。
當客戶端以 ServiceAccount 的身份嘗試與 Kubernetes API 伺服器通信時，
客戶端會在 HTTP 請求中包含 `Authorization: Bearer <token>` 標頭。
API 伺服器按照以下方式檢查該持有者令牌的有效性：

<!--
1. Checks the token signature.
1. Checks whether the token has expired.
1. Checks whether object references in the token claims are currently valid.
1. Checks whether the token is currently valid.
1. Checks the audience claims.
-->
1. 檢查令牌簽名。
1. 檢查令牌是否已過期。
1. 檢查令牌申明中的對象引用是否當前有效。
1. 檢查令牌是否當前有效。
1. 檢查受衆申明。

<!--
The TokenRequest API produces _bound tokens_ for a ServiceAccount. This
binding is linked to the lifetime of the client, such as a Pod, that is acting
as that ServiceAccount.  See [Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
for an example of a bound pod service account token's JWT schema and payload.

For tokens issued using the `TokenRequest` API, the API server also checks that
the specific object reference that is using the ServiceAccount still exists,
matching by the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of that
object. For legacy tokens that are mounted as Secrets in Pods, the API server
checks the token against the Secret.
-->
TokenRequest API 爲 ServiceAccount 生成**綁定令牌**。這種綁定與以該 ServiceAccount
身份運行的客戶端（如 Pod）的生命期相關聯。有關綁定 Pod 服務賬號令牌的 JWT 模式和載荷的示例，
請參閱[服務賬號令牌卷投射](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)。

對於使用 `TokenRequest` API 簽發的令牌，API 伺服器還會檢查正在使用 ServiceAccount 的特定對象引用是否仍然存在，
方式是通過該對象的{{< glossary_tooltip term_id="uid" text="唯一 ID" >}} 進行匹配。
對於以 Secret 形式掛載到 Pod 中的舊有令牌，API 伺服器會基於 Secret 來檢查令牌。

<!--
For more information about the authentication process, refer to
[Authentication](/docs/reference/access-authn-authz/authentication/#service-account-tokens).
-->
有關身份認證過程的更多資訊，參考[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)。

<!--
### Authenticating service account credentials in your own code {#authenticating-in-code}

If you have services of your own that need to validate Kubernetes service
account credentials, you can use the following methods:
-->
### 在自己的代碼中檢查服務賬號憑據   {#authenticating-in-code}

如果你的服務需要檢查 Kubernetes 服務賬號憑據，可以使用以下方法：

<!--
* [TokenReview API](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)
  (recommended)
* OIDC discovery
-->
* [TokenReview API](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)（推薦）
* OIDC 發現

<!--
The Kubernetes project recommends that you use the TokenReview API, because
this method invalidates tokens that are bound to API objects such as Secrets,
ServiceAccounts, Pods or Nodes when those objects are deleted. For example, if you
delete the Pod that contains a projected ServiceAccount token, the cluster
invalidates that token immediately and a TokenReview immediately fails.
If you use OIDC validation instead, your clients continue to treat the token
as valid until the token reaches its expiration timestamp.
-->
Kubernetes 項目建議你使用 TokenReview API，因爲當你刪除某些 API 對象
（如 Secret、ServiceAccount、Pod 和 Node）的時候，此方法將使綁定到這些 API 對象上的令牌失效。
例如，如果刪除包含投射 ServiceAccount 令牌的 Pod，則叢集立即使該令牌失效，
並且 TokenReview 操作也會立即失敗。
如果你使用的是 OIDC 驗證，則客戶端將繼續將令牌視爲有效，直到令牌達到其到期時間戳。

<!--
Your application should always define the audience that it accepts, and should
check that the token's audiences match the audiences that the application
expects. This helps to minimize the scope of the token so that it can only be
used in your application and nowhere else.
-->
你的應用應始終定義其所接受的受衆，並檢查令牌的受衆是否與應用期望的受衆匹配。
這有助於將令牌的作用域最小化，這樣它只能在你的應用內部使用，而不能在其他地方使用。

<!--
## Alternatives

* Issue your own tokens using another mechanism, and then use
  [Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
  to validate bearer tokens using your own validation service.
-->
## 替代方案   {#alternatives}

* 使用其他機制簽發你自己的令牌，然後使用
  [Webhook 令牌身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)通過你自己的驗證服務來驗證持有者令牌。

<!--
* Provide your own identities to Pods.
  * [Use the SPIFFE CSI driver plugin to provide SPIFFE SVIDs as X.509 certificate pairs to Pods](https://cert-manager.io/docs/projects/csi-driver-spiffe/).
    {{% thirdparty-content single="true" %}}
  * [Use a service mesh such as Istio to provide certificates to Pods](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/).
-->
* 爲 Pod 提供你自己的身份：
  * [使用 SPIFFE CSI 驅動插件將 SPIFFE SVID 作爲 X.509 證書對提供給 Pod](https://cert-manager.io/docs/projects/csi-driver-spiffe/)。
    {{% thirdparty-content single="true" %}}
  * [使用 Istio 這類服務網格爲 Pod 提供證書](https://istio.io/latest/zh/docs/tasks/security/cert-management/plugin-ca-cert/)。

<!--
* Authenticate from outside the cluster to the API server without using service account tokens:
  * [Configure the API server to accept OpenID Connect (OIDC) tokens from your identity provider](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
  * Use service accounts or user accounts created using an external Identity
    and Access Management (IAM) service, such as from a cloud provider, to
    authenticate to your cluster.
  * [Use the CertificateSigningRequest API with client certificates](/docs/tasks/tls/managing-tls-in-a-cluster/).
-->
* 從叢集外部向 API 伺服器進行身份認證，而不使用服務賬號令牌：
  * [設定 API 伺服器接受來自你自己的身份驅動的 OpenID Connect（OIDC）令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#openid-connect-tokens)。
  * 使用來自雲提供商等外部身份和訪問管理（IAM）服務創建的服務賬號或使用者賬號向叢集進行身份認證。
  * [使用 CertificateSigningRequest API 和客戶端證書](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)。

<!--
* [Configure the kubelet to retrieve credentials from an image registry](/docs/tasks/administer-cluster/kubelet-credential-provider/).
* Use a Device Plugin to access a virtual Trusted Platform Module (TPM), which
  then allows authentication using a private key.
-->
* [設定 kubelet 從映像檔倉庫中獲取憑據](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。
* 使用設備插件訪問虛擬的可信平臺模塊（TPM），進而可以使用私鑰進行身份認證。

## {{% heading "whatsnext" %}}

<!--
* Learn how to [manage your ServiceAccounts as a cluster administrator](/docs/reference/access-authn-authz/service-accounts-admin/).
* Learn how to [assign a ServiceAccount to a Pod](/docs/tasks/configure-pod-container/configure-service-account/).
* Read the [ServiceAccount API reference](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/).
-->
* 學習如何[作爲叢集管理員管理你的 ServiceAccount](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)。
* 學習如何[將 ServiceAccount 指派給 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)。
* 閱讀 [ServiceAccount API 參考文檔](/zh-cn/docs/reference/kubernetes-api/authentication-resources/service-account-v1/)。
