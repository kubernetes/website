---
title: 鑑權
content_type: concept
weight: 30
description: >
  Kubernetes 鑑權機制和支持的鑑權模式的詳細資訊。
---

<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization
content_type: concept
weight: 30
description: >
  Details of Kubernetes authorization mechanisms and supported authorization modes.
-->

<!-- overview -->

<!--
Kubernetes authorization takes place following
[authentication](/docs/reference/access-authn-authz/authentication/).
Usually, a client making a request must be authenticated (logged in) before its
request can be allowed; however, Kubernetes also allows anonymous requests in
some circumstances.

For an overview of how authorization fits into the wider context of API access
control, read
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
-->
Kubernetes 鑑權在[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)之後進行。
通常，發出請求的客戶端必須經過身份驗證（登錄）才能允許其請求；
但是，Kubernetes 在某些情況下也允許匿名請求。

有關鑑權在 API 訪問控制中的位置這類進一步的語境資訊，
請閱讀[控制對 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)。

<!-- body -->

<!--
## Authorization verdicts {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes authorization of API requests takes place within the API server.
The API server evaluates all of the request attributes against all policies,
potentially also consulting external services, and then allows or denies the
request.
-->
## 鑑權裁定   {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes 對 API 請求的鑑權在 API 伺服器內進行。
API 伺服器根據所有策略評估所有請求屬性，可能還會諮詢外部服務，然後允許或拒絕該請求。

<!--
All parts of an API request must be allowed by some authorization
mechanism in order to proceed. In other words: access is denied by default.
-->
API 請求的所有部分都必須通過某種鑑權機制才能繼續，
換句話說：預設情況下拒絕訪問。

{{% note %}}
<!--
Access controls and policies that
depend on specific fields of specific kinds of objects are handled by
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}.

Kubernetes admission control happens after authorization has completed (and,
therefore, only when the authorization decision was to allow the request).
-->
依賴於特定對象種類的特定字段的訪問控制和策略由{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}處理。

Kubernetes 准入控制發生在鑑權完成之後（因此，僅當鑑權決策是允許請求時）。
{{% /note %}}

<!--
When multiple [authorization modules](#authorization-modules) are configured, 
each is checked in sequence.
If any authorizer _approves_ or _denies_ a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have  _no opinion_
on the request, then the request is denied. An overall deny verdict means that
the API server rejects the request and responds with an HTTP 403 (Forbidden)
status.
-->
當系統設定了多個[鑑權模塊](#authorization-modules)時，Kubernetes 將按順序使用每個模塊。
如果任何鑑權模塊**批准**或**拒絕**請求，則立即返回該決定，並且不會與其他鑑權模塊協商。
如果所有模塊對請求**沒有意見**，則拒絕該請求。
總體拒絕裁決意味着 API 伺服器拒絕請求並以 HTTP 403（禁止）狀態進行響應。

<!--
## Request attributes used in authorization

Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [request verbs and authorization](/docs/reference/access-authn-authz/authorization/#determine-the-request-verb).
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).
-->
## 鑑權中使用的請求屬性

Kubernetes 僅審查以下 API 請求屬性：

* **使用者** —— 身份驗證期間提供的 `user` 字符串。
* **組** —— 經過身份驗證的使用者所屬的組名列表。
* **額外資訊** —— 由身份驗證層提供的任意字符串鍵到字符串值的映射。
* **API** —— 指示請求是否針對 API 資源。
* **請求路徑** —— 各種非資源端點的路徑，如 `/api` 或 `/healthz`。
* **API 請求動詞** —— API 動詞 `get`、`list`、`create`、`update`、`patch`、`watch`、
  `proxy`、`redirect`、`delete` 和 `deletecollection` 用於資源請求。
  要確定資源 API 端點的請求動詞，請參閱[請求動詞和鑑權](#determine-the-request-verb)。
* **HTTP 請求動詞** —— HTTP 動詞 `get`、`post`、`put` 和 `delete` 用於非資源請求。
* **資源** —— 正在訪問的資源的 ID 或名稱（僅限資源請求）- 
  對於使用 `get`、`update`、`patch` 和 `delete` 動詞的資源請求，你必須提供資源名稱。
* **子資源** —— 正在訪問的子資源（僅限資源請求）。
* **名字空間** —— 正在訪問的對象的名稱空間（僅適用於名字空間資源請求）。
* **API 組** —— 正在訪問的 {{< glossary_tooltip text="API 組" term_id="api-group" >}}
  （僅限資源請求）。空字符串表示[核心 API 組](/zh-cn/docs/reference/using-api/#api-groups)。

<!--
### Request verbs and authorization {#determine-the-request-verb}

#### Non-resource requests {#request-verb-non-resource}

Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered _non-resource requests_, and use the lower-cased HTTP method of the request as the verb.

For example, making a `GET` request to endpoints like `/api` or `/healthz` would use **get** as the verb.
-->
### 請求動詞和鑑權  {#determine-the-request-verb}

#### 非資源請求   {#request-verb-non-resource}

對於 `/api/v1/...` 或 `/apis/<group>/<version>/...`
之外的端點的請求被視爲**非資源請求（Non-Resource Requests）**，
並使用該請求的 HTTP 方法的小寫形式作爲其請求動詞。

例如，對 `/api` 或 `/healthz` 這類端點的 `GET` 請求將使用 **get** 作爲其動詞。

<!--
#### Resource requests

To determine the request verb for a resource API endpoint, Kubernetes maps the HTTP verb
used and considers whether or not the request acts on an individual resource or a
collection of resources:
-->
#### 資源請求    {#resource-requests}

爲了確定資源 API 端點的請求動詞，Kubernetes 會映射所使用的 HTTP 動詞，
並考慮該請求是否作用於單個資源或資源集合：

<!--
HTTP verb     | request verb
--------------|---------------
`POST`        | **create**
`GET`, `HEAD` | **get** (for individual resources), **list** (for collections, including full object content), **watch** (for watching an individual resource or collection of resources)
`PUT`         | **update**
`PATCH`       | **patch**
`DELETE`      | **delete** (for individual resources), **deletecollection** (for collections)
-->
HTTP 動詞 | 請求動詞
--------------|---------------
`POST`        | **create**
`GET`、`HEAD` | **get**（針對單個資源）、**list**（針對集合，包括完整的對象內容）、**watch**（用於查看單個資源或資源集合）
`PUT`         | **update**
`PATCH`       | **patch**
`DELETE`      | **delete**（針對單個資源）、**deletecollection**（針對集合）

{{< caution >}}
<!--
The **get**, **list** and **watch** can all return the full details of a resource. In
terms of the returned data they are equivalent. For example, **list** on **secrets**
will still reveal the **data** attributes of any returned resources.
-->
**get**、**list** 和 **watch** 動作都可以返回一個資源的完整詳細資訊。就返回的資料而言，它們是等價的。
例如，對 **secrets** 使用 **list** 仍然會顯示所有已返回資源的 **data** 屬性。
{{< /caution >}}

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* Special cases of [authentication](/docs/reference/access-authn-authz/authentication/)
  * **impersonate** verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
* [Authorization of CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#authorization)
  * **approve** verb for CertificateSigningRequests, and **update** for revisions to existing approvals
 [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * **bind** and **escalate** verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
-->
Kubernetes 有時使用專門的動詞以對額外的權限進行鑑權。例如：

* [身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)的特殊情況
  * 對核心 API 組中 `users`、`groups` 和 `serviceaccounts` 以及 `authentication.k8s.io`
    API 組中的 `userextras` 所使用的 **impersonate** 動詞。
* [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * 對 `rbac.authorization.k8s.io` API 組中 `roles` 和 `clusterroles` 資源的 **bind**
    和 **escalate** 動詞

<!--
## Authorization context

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.
-->
## 鑑權上下文    {#authorization-context}

Kubernetes 需要 REST API 請求所共有的屬性，
這意味着 Kubernetes 鑑權可與現有的組織範圍或雲提供商範圍的訪問控制系統配合使用，
這些系統可以處理除 Kubernetes API 之外的其他 API。

<!--
## Authorization modes  {#authorization-modules}

`AlwaysAllow`
: This mode allows all requests, which brings [security risks](#warning-always-allow). Use this authorization mode only if you do not require authorization for your API requests (for example, for testing).

`AlwaysDeny`
: This mode blocks all requests. Use this authorization mode only for testing.

`ABAC` ([attribute-based access control](/docs/reference/access-authn-authz/abac/))
: Kubernetes ABAC mode defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc).
-->
## 鑑權模式  {#authorization-modules}

`AlwaysAllow`
: 此模式允許所有請求，但存在[安全風險](#warning-always-allow)，
  僅當你的 API 請求不需要鑑權時（例如，用於測試），才使用此鑑權模式。

`AlwaysDeny`
: 此模式阻止所有請求。此鑑權模式僅適用於測試。

`ABAC`（[基於屬性的訪問控制](/zh-cn/docs/reference/access-authn-authz/abac/)）
: Kubernetes ABAC 模式定義了一種訪問控制範例，通過使用將屬性組合在一起的策略向使用者授予訪問權限，
  策略可以使用任何類型的屬性（使用者屬性、資源屬性、對象、環境屬性等）。

<!--
`RBAC` ([role-based access control](/docs/reference/access-authn-authz/rbac/))
: Kubernetes RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file.  
  In this mode, Kubernetes uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing you to dynamically configure permission policies through the Kubernetes API.

`Node`
: A special-purpose authorization mode that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).

`Webhook`
: Kubernetes [webhook mode](/docs/reference/access-authn-authz/webhook/) for authorization makes a synchronous HTTP callout, blocking the request until the remote HTTP service responds to the query.You can write your own software to handle the callout, or use solutions from the ecosystem.
-->
`RBAC`（[基於角色的訪問控制](/zh-cn/docs/reference/access-authn-authz/rbac/)）
: Kubernetes RBAC 是一種根據企業內各個使用者的角色來管理其對計算機或網路資源的訪問權限的方法。
  在此上下文中，訪問權限是單個使用者執行特定任務（例如查看、創建或修改檔案）的能力。
  在這種模式下，Kubernetes 使用 `rbac.authorization.k8s.io` API 組來驅動鑑權決策，
  允許你通過 Kubernetes API 動態設定權限策略。

`Node`
: 一種特殊用途的鑑權模式，根據 kubelet 計劃運行的 Pod 向其授予權限。
  要了解有關 Node 鑑權模式的更多資訊，請參閱 [Node 鑑權](/zh-cn/docs/reference/access-authn-authz/node/)。

`Webhook`
: Kubernetes 的 [Webhook 鑑權模式](/docs/reference/access-authn-authz/webhook/)用於鑑權，進行同步 HTTP 調用，
  阻塞請求直到遠程 HTTP 服務響應查詢。你可以編寫自己的軟體來處理這種向外調用，也可以使用生態系統中的解決方案。

<a id="warning-always-allow" />

{{< warning >}}
<!--
Enabling the `AlwaysAllow` mode bypasses authorization; do not use this on a cluster where
you do not trust **all** potential API clients, including the workloads that you run.

Authorization mechanisms typically return either a _deny_ or _no opinion_ result; see
[authorization verdicts](#determine-whether-a-request-is-allowed-or-denied) for more on this.
Activating the `AlwaysAllow` means that if all other authorizers return “no opinion”,
the request is allowed. For example, `--authorization-mode=AlwaysAllow,RBAC` has the
same effect as `--authorization-mode=AlwaysAllow` because Kubernetes RBAC does not
provide negative (deny) access rules.

You should not use the `AlwaysAllow` mode on a Kubernetes cluster where the API server
is reachable from the public internet.
-->
啓用 `AlwaysAllow` 模式會繞過鑑權；請勿在你不信任**所有**潛在 API
客戶端（包括你運行的工作負載）的叢集上使用該模式。

鑑權機制通常返回“拒絕”或“無意見”的結果；
有關更多資訊，請參閱[鑑權裁決](#determine-whether-a-request-is-allowed-or-denied)。
激活 `AlwaysAllow` 意味着如果所有其他鑑權組件都返回“無意見”，則允許該請求。
例如，`--authorization-mode=AlwaysAllow,RBAC` 與 `--authorization-mode=AlwaysAllow`
具有相同的效果，因爲 Kubernetes RBAC 不提供否定（拒絕）訪問規則。

你不應在可從公共互聯網訪問 API 伺服器的 Kubernetes 叢集上使用 `AlwaysAllow` 模式。
{{< /warning >}}

<!--
### The system:masters group

The `system:masters` group is a built-in Kubernetes group that grants unrestricted
access to the API server. Any user assigned to this group has full cluster administrator
privileges, bypassing any authorization restrictions imposed by the RBAC or Webhook mechanisms.
[Avoid adding users](/docs/concepts/security/rbac-good-practices/#least-privilege)
to this group. If you do need to grant a user cluster-admin rights, you can create a
[ClusterRoleBinding](/docs/reference/access-authn-authz/rbac/#user-facing-roles)
to the built-in `cluster-admin` ClusterRole.
-->
### `system:masters` 組

`system:masters` 組是 Kubernetes 內置的一個組，授予其成員對 API 伺服器的無限制訪問權限。
任何被分配到此組的使用者都具有完全的叢集管理員權限，可以繞過由 RBAC 或 Webhook 機制施加的任何鑑權限制。
請[避免將使用者添加到此組](/zh-cn/docs/concepts/security/rbac-good-practices/#least-privilege)。
如果你確實需要授予某個使用者叢集管理員權限，可以通過創建一個
[ClusterRoleBinding](/zh-cn/docs/reference/access-authn-authz/rbac/#user-facing-roles)
將其綁定到內置的 `cluster-admin` ClusterRole。

<!--
### Authorization mode configuration {#choice-of-authz-config}

You can configure the Kubernetes API server's authorizer chain using either
a [configuration file](#using-configuration-file-for-authorization) only or
[command line arguments](#using-flags-for-your-authorization-module).

You have to pick one of the two configuration approaches; setting both `--authorization-config`
path and configuring an authorization webhook using the `--authorization-mode` and
`--authorization-webhook-*` command line arguments is not allowed.
If you try this, the API server reports an error message during startup, then exits immediately.
-->
### 鑑權模式設定 {#choice-of-authz-config}

你可以僅使用[設定檔案](#using-configuration-file-for-authorization)，
或使用[命令列參數](#using-flags-for-your-authorization-module)來設定
Kubernetes API 伺服器的鑑權鏈。

你必須選擇兩種設定方法之一；不允許同時設置 `--authorization-config` 路徑並使用
`--authorization-mode` 和 `--authorization-webhook-*` 命令列參數設定鑑權 Webhook。
如果你嘗試這樣做，API 伺服器會在啓動期間報告錯誤消息，然後立即退出。

<!-- keep legacy hyperlinks working -->
<a id="configuring-the-api-server-using-an-authorization-config-file" />

<!--
### Configuring the API Server using an authorization config file {#using-configuration-file-for-authorization}
-->
### 使用鑑權設定檔案設定 API 伺服器 {#using-configuration-file-for-authorization}

{{< feature-state feature_gate_name="StructuredAuthorizationConfiguration" >}}

<!--
Kubernetes lets you configure authorization chains that can include multiple
webhooks. The authorization items in that chain can have well-defined parameters that validate
requests in a particular order, offering you fine-grained control, such as explicit Deny on failures.

The configuration file approach even allows you to specify
[CEL](/docs/reference/using-api/cel/) rules to pre-filter requests before they are dispatched
to webhooks, helping you to prevent unnecessary invocations. The API server also automatically
reloads the authorizer chain when the configuration file is modified.
-->
Kubernetes 允許你設定可包含多個 Webhook 的鑑權鏈。
該鏈中的鑑權項可以具有明確定義的參數，這些參數可以按特定順序檢查請求，
從而爲你提供細粒度的控制，例如在失敗時明確拒絕。

設定檔案方法甚至允許你指定 [CEL](/zh-cn/docs/reference/using-api/cel/)規則，
在將請求發送到 Webhook 之前對其進行預過濾，從而幫助你防止不必要的調用。
修改設定檔案時，API 伺服器還會自動重新加載鑑權鏈。

<!--
You specify the path to the authorization configuration using the
`--authorization-config` command line argument.

If you want to use command line arguments instead of a configuration file, that's also a valid and supported approach.
Some authorization capabilities (for example: multiple webhooks, webhook failure policy, and pre-filter rules)
are only available if you use an authorization configuration file.
-->
你可以使用 `--authorization-config` 命令列參數指定鑑權設定的路徑。

如果你想使用命令列參數而不是設定檔案，這也是一種有效且受支持的方法。
某些鑑權功能（例如：多個 Webhook、Webhook 失敗策略和預過濾規則）僅在使用鑑權設定檔案時可用。

<!--
#### Example configuration {#authz-config-example}
-->
#### 示例設定   {#authz-config-example}

<!--
---
#
# DO NOT USE THE CONFIG AS IS. THIS IS AN EXAMPLE.
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    # Name used to describe the authorizer
    # This is explicitly used in monitoring machinery for metrics
    # Note:
    #   - Validation for this field is similar to how K8s labels are validated today.
    # Required, with no default
    name: webhook
    webhook:
      # The duration to cache 'authorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-authorized-ttl` flag
      # Default: 5m0s
      authorizedTTL: 30s
      # The duration to cache 'unauthorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-unauthorized-ttl` flag
      # Default: 30s
      unauthorizedTTL: 30s
      # Timeout for the webhook request
      # Maximum allowed is 30s.
      # Required, with no default.
      timeout: 3s
      # The API version of the authorization.k8s.io SubjectAccessReview to
      # send to and expect from the webhook.
      # Same as setting `--authorization-webhook-version` flag
      # Required, with no default
      # Valid values: v1beta1, v1
      subjectAccessReviewVersion: v1
      # MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
      # version the CEL expressions are evaluated against
      # Valid values: v1
      # Required, no default value
      matchConditionSubjectAccessReviewVersion: v1
      # Controls the authorization decision when a webhook request fails to
      # complete or returns a malformed response or errors evaluating
      # matchConditions.
      # Valid values:
      #   - NoOpinion: continue to subsequent authorizers to see if one of
      #     them allows the request
      #   - Deny: reject the request without consulting subsequent authorizers
      # Required, with no default.
      failurePolicy: Deny
      connectionInfo:
        # Controls how the webhook should communicate with the server.
        # Valid values:
        # - KubeConfigFile: use the file specified in kubeConfigFile to locate the
        #   server.
        # - InClusterConfig: use the in-cluster configuration to call the
        #   SubjectAccessReview API hosted by kube-apiserver. This mode is not
        #   allowed for kube-apiserver.
        type: KubeConfigFile
        # Path to KubeConfigFile for connection info
        # Required, if connectionInfo.Type is KubeConfigFile
        kubeConfigFile: /kube-system-authz-webhook.yaml
        # matchConditions is a list of conditions that must be met for a request to be sent to this
        # webhook. An empty list of matchConditions matches all requests.
        # There are a maximum of 64 match conditions allowed.
        #
        # The exact matching logic is (in order):
        #   1. If at least one matchCondition evaluates to FALSE, then the webhook is skipped.
        #   2. If ALL matchConditions evaluate to TRUE, then the webhook is called.
        #   3. If at least one matchCondition evaluates to an error (but none are FALSE):
        #      - If failurePolicy=Deny, then the webhook rejects the request
        #      - If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped
      matchConditions:
      # expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
      # CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
      # If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
      # the contents would be converted to the v1 version before evaluating the CEL expression.
      #
      # Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
      #
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to kube-system
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # don't intercept requests from kube-system service accounts
      - expression: "!('system:serviceaccounts:kube-system' in request.groups)"
  - type: Node
    name: node
  - type: RBAC
    name: rbac
  - type: Webhook
    name: in-cluster-authorizer
    webhook:
      authorizedTTL: 5m
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      failurePolicy: NoOpinion
      connectionInfo:
        type: InClusterConfig
-->
{{< highlight yaml "linenos=false,hl_lines=2-4" >}}
---
#
# 請勿按原樣使用設定，這只是一個示例。
#
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    # 用於描述鑑權人的名稱
    # 這明確用於監控機制的指標
    # 注意
    #   - 該字段的驗證與今天的 K8s 標籤的驗證方式類似。
    # 必填，無預設值
    name: webhook
    webhook:
      # 緩存來自 Webhook 鑑權組件的“鑑權”響應的持續時間
      # 與設置 `--authorization-webhook-cache-authorized-ttl` 標誌相同
      # 預設值：5m0s
      authorizedTTL: 30s
      # 緩存來自 Webhook 鑑權組件的“未授權”響應的持續時間。
      # 與設置 `--authorization-webhook-cache-unauthorized-ttl` 標誌相同
      # 預設值：30s
      unauthorizedTTL: 30s
      # Webhook 請求超時
      # 允許的最大時間爲 30 秒。
      # 必填，沒有預設值。
      timeout: 3s
      # 要發送到 Webhook 並期望從 webhook 獲得的 authorization.k8s.io SubjectAccessReview 的 API 版本。
      # 與設置 `--authorization-webhook-version` 標誌相同
      # 必填，無預設值
      # 有效值：v1beta1、v1
      subjectAccessReviewVersion: v1
      # MatchConditionSubjectAccessReviewVersion 指定評估 CEL 表達式的 SubjectAccessReview 版本
      # 有效值：v1
      # 必填，無預設值
      matchConditionSubjectAccessReviewVersion: v1
      # 當 Webhook 請求無法完成或返回格式錯誤的響應或評估 matchConditions 時出現錯誤時，控制鑑權決定。
      # 有效值：
      #   - NoOpinion：繼續聯繫後續鑑權組件，看其中是否有人允許該請求
      #   - Deny：拒絕請求而不諮詢後續鑑權組件
      # 必填，沒有預設值。
      failurePolicy: Deny
      connectionInfo:
        # 控制 Webhook 如何與伺服器通信。
        # 有效值：
        # - KubeConfigFile：使用 kubeConfigFile 中指定的檔案來定位伺服器。
        # - InClusterConfig：使用叢集內設定來調用由 kube-apiserver 託管的 SubjectAccessReview API，kube-apiserver 不允許使用此模式。
        type: KubeConfigFile
        # 連接資訊的 KubeConfig 檔案的路徑
        # 如果 connectionInfo.Type 是 KubeConfig，則爲必填項
        kubeConfigFile: /kube-system-authz-webhook.yaml
        # matchConditions 是將請求發送到此 Webhook 必須滿足的條件列表。
        # matchConditions 爲空列表表示匹配所有請求。
        # 最多允許 64 個匹配條件。
        #
        # 精確匹配邏輯如下（按順序）：
        # 1. 如果至少一個 matchCondition 計算結果爲 FALSE，則跳過 Webhook。
        # 2. 如果所有 matchConditions 計算結果爲 TRUE，則調用 Webhook。
        # 3. 如果至少一個 matchCondition 計算結果爲錯誤（但沒有一個爲 FALSE）：
        # - 如果 FailurePolicy=Deny，則 Webhook 拒絕請求
        # - 如果 FailurePolicy=NoOpinion，則忽略錯誤並跳過 Webhook
      matchConditions:
        # 表達式表示將由 CEL 評估的表達式。必須評估爲布爾值。
        # CEL 表達式可以訪問 v1 版本中的 SubjectAccessReview 的內容。
        # 如果請求變量中 subjectAccessReviewVersion 指定的版本是 v1beta1，
        # 在評估 CEL 表達式之前，內容將轉換爲 v1 版本。
      #
      # CEL 文檔：https://kubernetes.io/docs/reference/using-api/cel/
      #
      # 僅向 Webhook 發送資源請求
      - expression: has(request.resourceAttributes)
      # 僅攔截對 kube-system 的請求
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # 不要攔截來自 kube-system 服務賬戶的請求
      - expression: "!('system:serviceaccounts:kube-system' in request.groups)"
  - type: Node
    name: node
  - type: RBAC
    name: rbac
  - type: Webhook
    name: in-cluster-authorizer
    webhook:
      authorizedTTL: 5m
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      failurePolicy: NoOpinion
      connectionInfo:
        type: InClusterConfig
{{< /highlight >}}

<!--
When configuring the authorizer chain using a configuration file, make sure all the
control plane nodes have the same file contents. Take a note of the API server
configuration when upgrading / downgrading your clusters. For example, if upgrading
from Kubernetes {{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}},
you would need to make sure the config file is in a format that Kubernetes {{< skew currentVersion >}}
can understand, before you upgrade the cluster. If you downgrade to {{< skew currentVersionAddMinor -1 >}},
you would need to set the configuration appropriately.
-->
使用設定檔案設定鑑權鏈時，請確保所有控制平面節點具有相同的檔案內容。升級/降級叢集時，請記下 API 伺服器設定。
例如，如果從 Kubernetes {{< skew currentVersionAddMinor -1 >}}
升級到 Kubernetes {{< skew currentVersion >}}，則需要確保設定檔案的格式是
Kubernetes {{< skew currentVersion >}} 可以理解的，然後再升級叢集。
如果降級到 {{< skew currentVersionAddMinor -1 >}}，則需要適當設置設定。

<!--
#### Authorization configuration and reloads

Kubernetes reloads the authorization configuration file when the API server observes a change
to the file, and also on a 60 second schedule if no change events were observed.
-->
#### 鑑權設定和重新加載

當 API 伺服器觀察到檔案的更改時，Kubernetes 會重新加載鑑權設定檔案，
如果沒有觀察到更改事件，則也會按照 60 秒的計劃重新加載。

{{< note >}}
<!--
You must ensure that all non-webhook authorizer types remain unchanged in the file on reload.

A reload **must not** add or remove Node or RBAC authorizers (they can be reordered,
but cannot be added or removed).
-->
你必須確保重新加載時檔案中所有非 Webhook 鑑權組件類型保持不變。

重新加載**不能**添加或刪除節點或 RBAC 鑑權組件（可以重新排序，但不能添加或刪除）。
{{< /note >}}

<!--
### Command line authorization mode configuration {#using-flags-for-your-authorization-module}
-->
### 命令列鑑權模式設定  {#using-flags-for-your-authorization-module}

<!--
You can use the following modes:

* `--authorization-mode=ABAC` (Attribute-based access control mode)
* `--authorization-mode=RBAC` (Role-based access control mode)
* `--authorization-mode=Node` (Node authorizer)
* `--authorization-mode=Webhook` (Webhook authorization mode)
* `--authorization-mode=AlwaysAllow` (always allows requests; carries [security risks](#warning-always-allow))
* `--authorization-mode=AlwaysDeny` (always denies requests)

You can choose more than one authorization mode; for example:
`--authorization-mode=Node,Webhook`
-->
你可以使用以下模式：

* `--authorization-mode=ABAC`（基於屬性的訪問控制模式）
* `--authorization-mode=RBAC`（基於角色的訪問控制模式）
* `--authorization-mode=Node`（節點鑑權組件）
* `--authorization-mode=Webhook`（Webhook 鑑權模式）
* `--authorization-mode=AlwaysAllow`（始終允許請求；存在[安全風險](#warning-always-allow))
* `--authorization-mode=AlwaysDeny`（始終拒絕請求）

你可以選擇多種鑑權模式；例如：`--authorization-mode=Node,Webhook`

<!--
Kubernetes checks authorization modules based on the order that you specify them
on the API server's command line, so an earlier module has higher priority to allow
or deny a request.

You cannot combine the `--authorization-mode` command line argument with the
`--authorization-config` command line argument used for
[configuring authorization using a local file](#using-configuration-file-for-authorization-mode).
-->
Kubernetes 根據你在 API 伺服器的命令列上指定鑑權模塊的順序來檢查鑑權模塊，
因此較早的模塊具有更高的優先級來允許或拒絕請求。

你不能將 `--authorization-mode` 命令列參數與用於[使用本地檔案設定鑑權](#using-configuration-file-for-authorization-mode)的
`--authorization-config` 命令列參數結合使用。

<!--
For more information on command line arguments to the API server, read the
[`kube-apiserver` reference](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有關 API 伺服器命令列參數的更多資訊，請閱讀
[`kube-apiserver` 參考](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。

<!--
## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through an object that
enables indirect [workload management](/docs/concepts/architecture/controller/), may be
able to escalate their privileges in that namespace. The potential routes to privilege
escalation include Kubernetes [API extensions](/docs/concepts/extend-kubernetes/#api-extensions)
and their associated {{< glossary_tooltip term_id="controller" text="controllers" >}}.
-->
## 通過創建或編輯工作負載來提升權限  {#privilege-escalation-via-pod-creation}

能夠直接或通過啓用間接[工作負載管理](/zh-cn/docs/concepts/architecture/controller/)的對象在命名空間中創建/編輯
Pod 的使用者可能能夠在該命名空間中提升其權限。
權限提升的潛在途徑包括 Kubernetes
[API 擴展](/zh-cn/docs/concepts/extend-kubernetes/#api-extensions)及其相關的
{{< glossary_tooltip term_id="controller" text="控制器" >}}。

{{< caution >}}
<!--
As a cluster administrator, use caution when granting access to create or edit workloads.
Some details of how these can be misused are documented in
[escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths).
-->
作爲叢集管理員，授予創建或編輯工作負載的訪問權限時請務必小心謹慎。
[權限提升路徑](/zh-cn/docs/reference/access-authn-authz/authorization/#escalation-paths)中記錄了有關濫用這些內容的一些細節。
{{< /caution >}}

<!--
### Escalation paths {#escalation-paths}

There are different ways that an attacker or untrustworthy user could gain additional
privilege within a namespace, if you allow them to run arbitrary Pods in that namespace:
-->
### 權限提升路徑  {#escalation-paths}

如果你允許攻擊者或不值得信任的使用者在該命名空間中運行任意 Pod，
則他們可以通過不同的方式在命名空間內獲得額外的權限：

<!--
- Mounting arbitrary Secrets in that namespace
  - Can be used to access confidential information meant for other workloads
  - Can be used to obtain a more privileged ServiceAccount's service account token
- Using arbitrary ServiceAccounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that ServiceAccount has
- Mounting or using ConfigMaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as database host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.
-->
- 在該命名空間中掛載任意 Secret
  - 可用於訪問其他工作負載的機密資訊
  - 可用於獲取更具特權的 ServiceAccount 的服務帳戶令牌
- 在該命名空間中使用任意 ServiceAccount
  - 可以作爲另一個工作負載執行 Kubernetes API 操作（模擬）
  - 可以執行 ServiceAccount 擁有的任何特權操作
- 在該命名空間中掛載或使用其他工作負載的 ConfigMap
  - 可用於獲取其他工作負載的資訊，例如資料庫主機名。
- 在該命名空間中掛載其他工作負載的卷
  - 可用於獲取其他工作負載的資訊並進行更改。

{{< caution >}}
<!--
As a system administrator, you should be cautious when deploying CustomResourceDefinitions
that let users make changes to the above areas. These may open privilege escalations paths.
Consider the consequences of this kind of change when deciding on your authorization controls.
-->
作爲系統管理員，在部署允許使用者更改上述區域的 CustomResourceDefinitions 時應謹慎行事，這些可能會打開特權升級路徑。
在設定你的鑑權控制時，請考慮這種變化的後果。
{{< /caution >}}

<!--
#### Checking API access

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

<!--
The output is similar to this:
-->
輸出類似於：

```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```

<!--
The output is similar to this:
-->
輸出類似於：

```
no
```

<!--
Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.
-->
管理員可以將此與[使用者扮演（User Impersonation）](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)
結合使用，以確定其他使用者可以執行的操作。

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```

<!--
The output is similar to this:
-->
輸出類似於：

```
no
```

<!--
Similarly, to check whether a ServiceAccount named `dev-sa` in Namespace `dev`
can list Pods in the Namespace `target`:
-->
類似地，檢查名字空間 `dev` 裏的 `dev-sa` 服務賬戶是否可以列舉名字空間 `target` 裏的 Pod：

```bash
kubectl auth can-i list pods \
	--namespace target \
	--as system:serviceaccount:dev:dev-sa
```

<!--
The output is similar to this:
-->
輸出類似於：

```
yes
```

<!--
SelfSubjectAccessReview is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* SubjectAccessReview
： Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.

`LocalSubjectAccessReview`
: Like `SubjectAccessReview` but restricted to a specific namespace.

* `SelfSubjectRulesReview`
: A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response `status`
field of the returned object is the result of the query. For example:
-->
SelfSubjectAccessReview 是 `authorization.k8s.io` API 組的一部分，它將 API
伺服器鑑權公開給外部服務。該組中的其他資源包括：

* `SubjectAccessReview`
: 對任意使用者的訪問進行評估，而不僅僅是當前使用者。
  當鑑權決策被委派給 API 伺服器時很有用。例如，kubelet 和擴展 API
  伺服器使用它來確定使用者對自己的 API 的訪問權限。

* `LocalSubjectAccessReview`
: 與 `SubjectAccessReview` 類似，但僅限於特定的名字空間。

* `SelfSubjectRulesReview`
: 返回使用者可在名字空間內執行的操作集的審閱。
  使用者可以快速彙總自己的訪問權限，或者用於 UI 中的隱藏/顯示動作。

可以通過創建普通的 Kubernetes 資源來查詢這些 API，其中返回對象的響應 `status`
字段是查詢的結果，例如：

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
The generated SelfSubjectAccessReview is similar to:
-->
生成的 SelfSubjectAccessReview 類似於：

{{< highlight yaml "linenos=false,hl_lines=11-13" >}}
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
{{< /highlight >}}

## {{% heading "whatsnext" %}}

<!--
* To learn more about Authentication, see [Authentication](/docs/reference/access-authn-authz/authentication/).
* For an overview, read [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
* Read more about [Common Expression Language in Kubernetes](/docs/reference/using-api/cel/).
-->
* 要了解有關身份驗證的更多資訊，
  請參閱[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)。
* 有關概述，請閱讀[控制對 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)。
* 要了解有關准入控制的更多資訊，請參閱[使用准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。
* 閱讀更多關於 [Kubernetes 中的通用表達語言](/zh-cn/docs/reference/using-api/cel/)。

