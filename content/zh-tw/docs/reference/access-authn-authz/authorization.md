---
title: 鑑權概述
content_type: concept
weight: 60
---

<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization Overview
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
Learn more about Kubernetes authorization, including details about creating
policies using the supported authorization modules.
-->
瞭解有關 Kubernetes 鑑權的更多資訊，包括使用支援的鑑權模組建立策略的詳細資訊。


<!-- body -->
<!--
In Kubernetes, you must be authenticated (logged in) before your request can be
authorized (granted permission to access). For information about authentication,
see [Accessing Control Overview](/docs/concepts/security/controlling-access/).

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.
-->
在 Kubernetes 中，你必須在鑑權（授予訪問許可權）之前進行身份驗證（登入），有關身份驗證的資訊，
請參閱[訪問控制概述](/zh-cn/docs/concepts/security/controlling-access/).

Kubernetes 期望請求中存在 REST API 常見的屬性。
這意味著 Kubernetes 鑑權適用於現有的組織範圍或雲提供商範圍的訪問控制系統，
除了 Kubernetes API 之外，它還可以處理其他 API。

<!--
## Determine Whether a Request is Allowed or Denied

Kubernetes authorizes API requests using the API server. It evaluates all of the
request attributes against all policies and allows or denies the request. All
parts of an API request must be allowed by some policy in order to proceed. This
means that permissions are denied by default.

(Although Kubernetes uses the API server, access controls and policies that
depend on specific fields of specific kinds of objects are handled by Admission
Controllers.)

When multiple authorization modules are configured, each is checked in sequence.
If any authorizer approves or denies a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have no opinion on
the request, then the request is denied. A deny returns an HTTP status code 403.
-->
## 確定是允許還是拒絕請求

Kubernetes 使用 API 伺服器對 API 請求進行鑑權。
它根據所有策略評估所有請求屬性來決定允許或拒絕請求。
一個 API 請求的所有部分都必須被某些策略允許才能繼續。
這意味著預設情況下拒絕許可權。

（儘管 Kubernetes 使用 API 伺服器，但是依賴於特定物件種類的特定欄位的訪問控制
和策略由准入控制器處理。）

當系統配置了多個鑑權模組時，Kubernetes 將按順序使用每個模組。
如果任何鑑權模組批准或拒絕請求，則立即返回該決定，並且不會與其他鑑權模組協商。
如果所有模組對請求沒有意見，則拒絕該請求。
被拒絕響應返回 HTTP 狀態程式碼 403。

<!--
## Review Your Request Attributes

Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [Determine the request verb](/docs/reference/access-authn-authz/authorization/#determine-whether-a-request-is-allowed-or-denied) below.
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).
-->
## 審查你的請求屬性

Kubernetes 僅審查以下 API 請求屬性：

* **使用者** - 身份驗證期間提供的 `user` 字串。
* **組** - 經過身份驗證的使用者所屬的組名列表。
* **額外資訊** - 由身份驗證層提供的任意字串鍵到字串值的對映。
* **API** - 指示請求是否針對 API 資源。
* **請求路徑** - 各種非資源端點的路徑，如 `/api` 或 `/healthz`。
* **API 請求動詞** - API 動詞 `get`、`list`、`create`、`update`、`patch`、`watch`、
  `proxy`、`redirect`、`delete` 和 `deletecollection` 用於資源請求。
  要確定資源 API 端點的請求動詞，請參閱
  [確定請求動詞](#determine-the-request-verb)。
* **HTTP 請求動詞** - HTTP 動詞 `get`、`post`、`put` 和 `delete` 用於非資源請求。
* **Resource** - 正在訪問的資源的 ID 或名稱（僅限資源請求）- 
  對於使用 `get`、`update`、`patch` 和 `delete` 動詞的資源請求，你必須提供資源名稱。
* **子資源** - 正在訪問的子資源（僅限資源請求）。
* **名字空間** - 正在訪問的物件的名稱空間（僅適用於名字空間資源請求）。
* **API 組** - 正在訪問的 {{< glossary_tooltip text="API 組" term_id="api-group" >}}
  （僅限資源請求）。空字串表示[核心 API 組](/zh-cn/docs/reference/using-api/#api-groups)。

<!--
## Determine the Request Verb

**Non-resource requests**
Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered "non-resource requests", and use the lower-cased HTTP method of the request as the verb.
For example, a `GET` request to endpoints like `/api` or `/healthz` would use `get` as the verb.
-->
## 確定請求動詞  {#determine-the-request-verb}

**非資源請求**

對於 `/api/v1/...` 或 `/apis/<group>/<version>/...` 之外的端點的請求被
視為“非資源請求（Non-Resource Requests）”，並使用該請求的 HTTP 方法的
小寫形式作為其請求動詞。
例如，對 `/api` 或 `/healthz` 這類端點的 `GET` 請求將使用 `get` 作為其動詞。

<!--
**Resource requests**

To determine the request verb for a resource API endpoint, review the HTTP verb
used and whether or not the request acts on an individual resource or a
collection of resources:
-->
**資源請求**

要確定對資源 API 端點的請求動詞，需要檢視所使用的 HTTP 動詞以及該請求是針對
單個資源還是一組資源：

<!--
HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)
-->
HTTP 動詞 | 請求動詞
----------|---------------
POST      | create
GET, HEAD | get （針對單個資源）、list（針對集合）
PUT       | update
PATCH     | patch
DELETE    | delete（針對單個資源）、deletecollection（針對集合）

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/)
  * `use` verb on `podsecuritypolicies` resources in the `policy` API group.
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * `bind` and `escalate` verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/reference/access-authn-authz/authentication/)
  * `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
-->
Kubernetes 有時使用專門的動詞以對額外的許可權進行鑑權。例如：

* [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
  * `policy` API 組中 `podsecuritypolicies` 資源使用 `use` 動詞
* [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * 對 `rbac.authorization.k8s.io` API 組中 `roles` 和 `clusterroles` 資源的 `bind`
    和 `escalate` 動詞
* [身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)
  * 對核心 API 組中 `users`、`groups` 和 `serviceaccounts` 以及 `authentication.k8s.io`
    API 組中的 `userextras` 所使用的 `impersonate` 動詞。

<!--
## Authorization Modules  {#authorization-modules}

 * **Node** - A special-purpose authorizer that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * When specified RBAC (Role-Based Access Control) uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
   * To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/reference/access-authn-authz/webhook/).
-->
## 鑑權模組  {#authorization-modules}

* **Node** - 一個專用鑑權元件，根據排程到 kubelet 上執行的 Pod 為 kubelet 授予許可權。
  瞭解有關使用節點鑑權模式的更多資訊，請參閱[節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)。
* **ABAC** - 基於屬性的訪問控制（ABAC）定義了一種訪問控制範型，透過使用將屬性組合
  在一起的策略，將訪問許可權授予使用者。策略可以使用任何型別的屬性（使用者屬性、資源屬性、
  物件，環境屬性等）。要了解有關使用 ABAC 模式的更多資訊，請參閱
  [ABAC 模式](/zh-cn/docs/reference/access-authn-authz/abac/)。
* **RBAC** - 基於角色的訪問控制（RBAC）是一種基於企業內個人使用者的角色來管理對
  計算機或網路資源的訪問的方法。在此上下文中，許可權是單個使用者執行特定任務的能力，
  例如檢視、建立或修改檔案。要了解有關使用 RBAC 模式的更多資訊，請參閱
  [RBAC 模式](/zh-cn/docs/reference/access-authn-authz/rbac/)。
  * 被啟用之後，RBAC（基於角色的訪問控制）使用 `rbac.authorization.k8s.io` API 組來
    驅動鑑權決策，從而允許管理員透過 Kubernetes API 動態配置許可權策略。
  * 要啟用 RBAC，請使用 `--authorization-mode = RBAC` 啟動 API 伺服器。
* **Webhook** - WebHook 是一個 HTTP 回撥：發生某些事情時呼叫的 HTTP POST；
  透過 HTTP POST 進行簡單的事件通知。實現 WebHook 的 Web 應用程式會在發生某些事情時
  將訊息釋出到 URL。要了解有關使用 Webhook 模式的更多資訊，請參閱
  [Webhook 模式](/zh-cn/docs/reference/access-authn-authz/webhook/)。

<!--
#### Checking API Access

`kubectl` provides the `auth can-i` subcommand for quickly querying the API authorization layer.
The command uses the `SelfSubjectAccessReview` API to determine if the current user can perform
a given action, and works regardless of the authorization mode used.
-->
#### 檢查 API 訪問   {#checking-api-access}

`kubectl` 提供 `auth can-i` 子命令，用於快速查詢 API 鑑權。
該命令使用 `SelfSubjectAccessReview` API 來確定當前使用者是否可以執行給定操作，
無論使用何種鑑權模式該命令都可以工作。

```shell
kubectl auth can-i create deployments --namespace dev
```

<!-- The output is similar to this: -->
輸出類似於：

```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```

<!-- The output is similar to this: -->
輸出類似於：

```
no
```

<!--
Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.
-->
管理員可以將此與
[使用者扮演](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)
結合使用，以確定其他使用者可以執行的操作。

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```

<!-- The output is similar to this: -->
輸出類似於：

```
no
```

<!--
Similarly, to check whether a ServiceAccount named `dev-sa` in Namespace `dev`
can list Pods in the Namespace `target`:
-->
類似地，檢查名字空間 `dev` 裡的 `dev-sa` 服務賬號是否可以列舉名字空間 `target` 裡的 Pod：

```bash
kubectl auth can-i list pods \
	--namespace target \
	--as system:serviceaccount:dev:dev-sa
```

<!-- The output is similar to this: -->
輸出類似於：

```
yes
```

<!--
`SelfSubjectAccessReview` is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* `SubjectAccessReview` - Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.
* `LocalSubjectAccessReview` - Like `SubjectAccessReview` but restricted to a specific namespace.
* `SelfSubjectRulesReview` - A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response "status"
field of the returned object is the result of the query.
-->
`SelfSubjectAccessReview` 是 `authorization.k8s.io` API 組的一部分，它將 API
伺服器鑑權公開給外部服務。該組中的其他資源包括：

* `SubjectAccessReview` - 對任意使用者的訪問進行評估，而不僅僅是當前使用者。
  當鑑權決策被委派給 API 伺服器時很有用。例如，kubelet 和擴充套件 API 伺服器使用
  它來確定使用者對自己的 API 的訪問許可權。
* `LocalSubjectAccessReview` - 與 `SubjectAccessReview` 類似，但僅限於特定的
  名字空間。
* `SelfSubjectRulesReview` - 返回使用者可在名字空間內執行的操作集的審閱。
  使用者可以快速彙總自己的訪問許可權，或者用於 UI 中的隱藏/顯示動作。

可以透過建立普通的 Kubernetes 資源來查詢這些 API，其中返回物件的響應 "status"
欄位是查詢的結果。

```bash
kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    name: deployments
    verb: create
    namespace: dev
EOF
```

<!--
The generated `SelfSubjectAccessReview` is:
-->
生成的 `SelfSubjectAccessReview` 為：

```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    name: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

<!--
## Using Flags for Your Authorization Module

You must include a flag in your policy to indicate which authorization module
your policies include:

The following flags can be used:
-->
## 為你的鑑權模組設定引數

你必須在策略中包含一個引數標誌，以指明你的策略包含哪個鑑權模組：

可以使用的引數有：

<!--
  * `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  * `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  * `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST endpoint.
  * `--authorization-mode=Node` Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
  * `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  * `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.
-->
* `--authorization-mode=ABAC` 基於屬性的訪問控制（ABAC）模式允許你
  使用本地檔案配置策略。
* `--authorization-mode=RBAC` 基於角色的訪問控制（RBAC）模式允許你使用
  Kubernetes API 建立和儲存策略。
* `--authorization-mode=Webhook` WebHook 是一種 HTTP 回撥模式，允許你使用遠端
  REST 端點管理鑑權。
* `--authorization-mode=Node` 節點鑑權是一種特殊用途的鑑權模式，專門對
  kubelet 發出的 API 請求執行鑑權。
* `--authorization-mode=AlwaysDeny` 該標誌阻止所有請求。僅將此標誌用於測試。
* `--authorization-mode=AlwaysAllow` 此標誌允許所有請求。僅在你不需要 API 請求
  的鑑權時才使用此標誌。

<!--
You can choose more than one authorization module. Modules are checked in order
so an earlier module has higher priority to allow or deny a request.
-->
你可以選擇多個鑑權模組。模組按順序檢查，以便較靠前的模組具有更高的優先順序來允許
或拒絕請求。

<!--
## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through a [controller](/docs/concepts/architecture/controller/)
such as an operator, could escalate their privileges in that namespace.
-->
## 透過建立或編輯工作負載提升許可權 {#privilege-escalation-via-pod-creation}

能夠在名字空間中建立或者編輯 Pod 的使用者，
無論是直接操作還是透過[控制器](/zh-cn/docs/concepts/architecture/controller/)（例如，一個 Operator）來操作，
都可以提升他們在該名字空間內的許可權。

{{< caution >}}
<!--
System administrators, use care when granting access to create or edit workloads.
Details of how these can be misused are documented in [escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths)
-->
系統管理員在授予對工作負載的建立或編輯的許可權時要小心。
關於這些許可權如何被誤用的詳細資訊請參閱
[提升途徑](#escalation-paths)
{{< /caution >}}

<!--
### Escalation paths {#escalation-paths}
- Mounting arbitrary secrets in that namespace
  - Can be used to access secrets meant for other workloads
  - Can be used to obtain a more privileged service account's service account token
- Using arbitrary Service Accounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that Service Account has
- Mounting configmaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as DB host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.
-->
### 提升途徑 {#escalation-paths}
- 掛載該名字空間內的任意 Secret
  - 可以用來訪問其他工作負載專用的 Secret
  - 可以用來獲取許可權更高的服務賬號的令牌
- 使用該名字空間內的任意服務賬號
  - 可以用另一個工作負載的身份來訪問 Kubernetes API（偽裝）
  - 可以執行該服務賬號的任意特權操作
- 掛載該名字空間裡其他工作負載專用的 ConfigMap
  - 可以用來獲取其他工作負載專用的資訊，例如資料庫主機名。
- 掛載該名字空間裡其他工作負載的卷
  - 可以用來獲取其他工作負載專用的資訊，並且更改它。

{{< caution >}}
<!--
System administrators should be cautious when deploying CRDs that
change the above areas. These may open privilege escalations paths.
This should be considered when deciding on your RBAC controls.
-->
系統管理員在部署改變以上部分的 CRD 的時候要小心。
它們可能會開啟許可權提升的途徑。
在決定你的 RBAC 控制時應該考慮這方面的問題。
{{< /caution >}}


## {{% heading "whatsnext" %}}

<!--
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
-->
* 要了解有關身份驗證的更多資訊，請參閱
  [控制對 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)
  中的 **身份驗證**  部分。
* 要了解有關准入控制的更多資訊，請參閱
  [使用准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。

