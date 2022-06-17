---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: 使用 ABAC 鑑權
content_type: concept
---

<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Using ABAC Authorization
content_type: concept
weight: 80
-->

<!-- overview -->

<!--
Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together.
-->
基於屬性的訪問控制（Attribute-based access control - ABAC）定義了訪問控制範例，
其中透過使用將屬性組合在一起的策略來向用戶授予訪問許可權。



<!-- body -->

<!--
## Policy File Format

To enable `ABAC` mode, specify `--authorization-policy-file=SOME_FILENAME` and `--authorization-mode=ABAC` on startup.

The file format is [one JSON object per line](http://jsonlines.org/).  There
should be no enclosing list or map, only one map per line.

Each line is a "policy object", where each such object is a map with the following
properties:

  - Versioning properties:
    - `apiVersion`, type string; valid values are "abac.authorization.kubernetes.io/v1beta1". Allows versioning and conversion of the policy format.
    - `kind`, type string: valid values are "Policy". Allows versioning and conversion of the policy format.
  - `spec` property set to a map with the following properties:
    - Subject-matching properties:
      - `user`, type string; the user-string from `--token-auth-file`. If you specify `user`, it must match the username of the authenticated user.
      - `group`, type string; if you specify `group`, it must match one of the groups of the authenticated user. `system:authenticated` matches all authenticated requests. `system:unauthenticated` matches all unauthenticated requests.
    - Resource-matching properties:
      - `apiGroup`, type string; an API group.
        - Ex: `apps`, `networking.k8s.io`
        - Wildcard: `*` matches all API groups.
      - `namespace`, type string; a namespace.
        - Ex: `kube-system`
        - Wildcard: `*` matches all resource requests.
      - `resource`, type string; a resource type
        - Ex: `pods`, `deployments`
        - Wildcard: `*` matches all resource requests.
    - Non-resource-matching properties:
      - `nonResourcePath`, type string; non-resource request paths.
        - Ex: `/version` or `/apis`
        - Wildcard:
          - `*` matches all non-resource requests.
          - `/foo/*` matches all subpaths of `/foo/`.
    - `readonly`, type boolean, when true, means that the Resource-matching policy only applies to get, list, and watch operations, Non-resource-matching policy only applies to get operation.
-->
## 策略檔案格式

基於 `ABAC` 模式，可以這樣指定策略檔案 `--authorization-policy-file=SOME_FILENAME`。

此檔案格式是 [JSON Lines](https://jsonlines.org/)，不應存在外層的列表或對映，每行應只有一個對映。

每一行都是一個策略物件，策略物件是具有以下屬性的對映：

  - 版本控制屬性：
    - `apiVersion`，字串型別：有效值為`abac.authorization.kubernetes.io/v1beta1`，允許對策略格式進行版本控制和轉換。
    - `kind`，字串型別：有效值為 `Policy`，允許對策略格式進行版本控制和轉換。
  - `spec` 配置為具有以下對映的屬性：
    - 主體匹配屬性：
      - `user`，字串型別；來自 `--token-auth-file` 的使用者字串，如果你指定 `user`，它必須與驗證使用者的使用者名稱匹配。
      - `group`，字串型別；如果指定 `group`，它必須與經過身份驗證的使用者的一個組匹配，`system:authenticated` 匹配所有經過身份驗證的請求。
        `system:unauthenticated` 匹配所有未經過身份驗證的請求。
  - 資源匹配屬性：
    - `apiGroup`，字串型別；一個 API 組。
      - 例： `apps`, `networking.k8s.io`
      - 萬用字元：`*`匹配所有 API 組。
    - `namespace`，字串型別；一個名稱空間。
      - 例如：`kube-system`
      - 萬用字元：`*`匹配所有資源請求。
    - `resource`，字串型別；資源型別。
      - 例：`pods`, `deployments`
      - 萬用字元：`*`匹配所有資源請求。
  - 非資源匹配屬性：
    - `nonResourcePath`，字串型別；非資源請求路徑。
      - 例如：`/version`或 `/apis`
      - 萬用字元：
        - `*` 匹配所有非資源請求。
        - `/foo/*` 匹配 `/foo/` 的所有子路徑。
  - `readonly`，鍵入布林值，如果為 true，則表示該策略僅適用於 get、list 和 watch 操作。

{{< note >}}

<!--
An unset property is the same as a property set to the zero value for its type
(e.g. empty string, 0, false). However, unset should be preferred for
readability.

In the future, policies may be expressed in a JSON format, and managed via a
REST interface.
-->
屬性未設定等效於屬性被設定為對應型別的零值( 例如空字串、0、false)，然而，出於可讀性考慮，應儘量選擇不設定這類屬性。

在將來，策略可能以 JSON 格式表示，並透過 REST 介面進行管理。

{{< /note >}}

<!--
## Authorization Algorithm

A request has attributes which correspond to the properties of a policy object.

When a request is received, the attributes are determined.  Unknown attributes
are set to the zero value of its type (e.g. empty string, 0, false).

A property set to `"*"` will match any value of the corresponding attribute.

The tuple of attributes is checked for a match against every policy in the
policy file. If at least one line matches the request attributes, then the
request is authorized (but may fail later validation).

To permit any authenticated user to do something, write a policy with the
group property set to `"system:authenticated"`.

To permit any unauthenticated user to do something, write a policy with the
group property set to `"system:unauthenticated"`.

To permit a user to do anything, write a policy with the apiGroup, namespace,
resource, and nonResourcePath properties set to `"*"`.
-->

## 鑑權演算法

請求具有與策略物件的屬性對應的屬性。

當接收到請求時，確定屬性。未知屬性設定為其型別的零值（例如：空字串，0，false）。

設定為 `"*"` 的屬性將匹配相應屬性的任何值。

檢查屬性的元組，以匹配策略檔案中的每個策略。如果至少有一行匹配請求屬性，則請求被鑑權（但仍可能無法透過稍後的合法性檢查）。

要允許任何經過身份驗證的使用者執行某些操作，請將策略組屬性設定為 `"system:authenticated"`。

要允許任何未經身份驗證的使用者執行某些操作，請將策略組屬性設定為 `"system:unauthenticated"`。

要允許使用者執行任何操作，請使用設定為 `"*"` 的 apiGroup，namespace，resource 和 nonResourcePath 屬性編寫策略。

<!--
## Kubectl

Kubectl uses the `/api` and `/apis` endpoints of api-server to discover
served resource types, and validates objects sent to the API by create/update
operations using schema information located at `/openapi/v2`.

When using ABAC authorization, those special resources have to be explicitly
exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):

* `/api`, `/api/*`, `/apis`, and `/apis/*` for API version negotiation.
* `/version` for retrieving the server version via `kubectl version`.
* `/swaggerapi/*` for create/update operations.

To inspect the HTTP calls involved in a specific kubectl operation you can turn
up the verbosity:

    kubectl --v=8 version
-->

## kubectl

kubectl 使用 api-server 的 `/api` 和 `/apis` 端點來發現服務資源型別，
並使用位於 `/openapi/v2` 的模式資訊來驗證透過建立/更新操作傳送到 API 的物件。

當使用 ABAC 鑑權時，這些特殊資源必須顯式地透過策略中的 `nonResourcePath` 屬性暴露出來（參見下面的 [示例](#examples)）：

* `/api`，`/api/*`，`/apis`和 `/apis/*` 用於 API 版本協商。
* `/version` 透過 `kubectl version` 檢索伺服器版本。
* `/swaggerapi/*` 用於建立 / 更新操作。

要檢查涉及到特定 kubectl 操作的 HTTP 呼叫，你可以調整詳細程度：
    kubectl --v=8 version

<!--
## Examples

 1. Alice can do anything to all resources:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
 2. The Kubelet can read any pods:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
 3. The Kubelet can read and write events:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
 -->
## 例子 {#examples}

1. Alice 可以對所有資源做任何事情：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
2. kubelet 可以讀取任何 pod：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
3. kubelet 可以讀寫事件：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```

 <!--
 4. Bob can just read pods in namespace "projectCaribou":

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
 5. Anyone can make read-only requests to all non-resource paths:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```
-->
4. Bob 可以在名稱空間 `projectCaribou` 中讀取 pod：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
5. 任何人都可以對所有非資源路徑進行只讀請求：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```

<!--
[Complete file example](http://releases.k8s.io/{{< param "fullversion" >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## A quick note on service accounts

Every service account has a corresponding ABAC username, and that service account's user name is generated according to the naming convention:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

-->
[完整檔案示例](https://releases.k8s.io/{{< param "fullversion" >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## 服務帳戶的快速說明

服務帳戶自動生成使用者。使用者名稱是根據命名約定生成的：

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

<!--
Creating a new namespace leads to the creation of a new service account in the following format:

```shell
system:serviceaccount:<namespace>:default
```

For example, if you wanted to grant the default service account (in the `kube-system` namespace) full
privilege to the API using ABAC, you would add this line to your policy file:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

The apiserver will need to be restarted to pickup the new policy lines.
-->

建立新的名稱空間也會導致建立一個新的服務帳戶：

```shell
system:serviceaccount:<namespace>:default
```

例如，如果要將 API 的 kube-system 完整許可權中的預設服務帳戶授予，則可以將此行新增到策略檔案中：

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

需要重新啟動 apiserver 以獲取新的策略行。
