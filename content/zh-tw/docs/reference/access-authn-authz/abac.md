---
title: 使用 ABAC 鑑權
content_type: concept
weight: 39
---
<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Using ABAC Authorization
content_type: concept
weight: 39
-->

<!-- overview -->

<!--
Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted
to users through the use of policies which combine attributes together.
-->
基於屬性的訪問控制（Attribute-based access control，ABAC）定義了訪問控制範例，
ABAC 通過使用將屬性組合在一起的策略來向使用者授予訪問權限。

<!-- body -->

<!--
## Policy File Format

To enable `ABAC` mode, specify `--authorization-policy-file=SOME_FILENAME` and `--authorization-mode=ABAC`
on startup.

The file format is [one JSON object per line](https://jsonlines.org/). There
should be no enclosing list or map, only one map per line.

Each line is a "policy object", where each such object is a map with the following
properties:
-->
## 策略文件格式   {#policy-file-format}

要啓用 `ABAC` 模式，可以在啓動時指定 `--authorization-policy-file=SOME_FILENAME` 和 `--authorization-mode=ABAC`。

此文件格式是[每行一個 JSON 對象](https://jsonlines.org/)，不應存在外層的列表或映射，每行應只有一個映射。

每一行都是一個“策略對象”，策略對象是具有以下屬性的映射：

<!--
- Versioning properties:
  - `apiVersion`, type string; valid values are "abac.authorization.kubernetes.io/v1beta1". Allows versioning
    and conversion of the policy format.
  - `kind`, type string: valid values are "Policy". Allows versioning and conversion of the policy format.
-->
- 版本控制屬性：
  - `apiVersion`，字符串類型：有效值爲 `abac.authorization.kubernetes.io/v1beta1`，允許對策略格式進行版本控制和轉換。
  - `kind`，字符串類型：有效值爲 `Policy`，允許對策略格式進行版本控制和轉換。
<!--
- `spec` property set to a map with the following properties:
  - Subject-matching properties:
    - `user`, type string; the user-string from `--token-auth-file`. If you specify `user`, it must match the
      username of the authenticated user.
    - `group`, type string; if you specify `group`, it must match one of the groups of the authenticated user.
      `system:authenticated` matches all authenticated requests. `system:unauthenticated` matches all
      unauthenticated requests.
-->
- `spec` 設定爲具有以下映射的屬性：
  - 主體匹配屬性：
    - `user`，字符串類型；來自 `--token-auth-file` 的使用者字符串，如果你指定 `user`，它必須與驗證使用者的使用者名匹配。
    - `group`，字符串類型；如果指定 `group`，它必須與經過身份驗證的使用者的一個組匹配，
      `system:authenticated` 匹配所有經過身份驗證的請求。
      `system:unauthenticated` 匹配所有未經過身份驗證的請求。
  <!--
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
  -->
  - 資源匹配屬性：
    - `apiGroup`，字符串類型；一個 API 組。
      - 例如：`apps`、`networking.k8s.io`
      - 通配符：`*`匹配所有 API 組。
    - `namespace`，字符串類型；一個命名空間。
      - 例如：`kube-system`
      - 通配符：`*`匹配所有資源請求。
    - `resource`，字符串類型；資源類型。
      - 例如：`pods`、`deployments`
      - 通配符：`*`匹配所有資源請求。
  <!--
  - Non-resource-matching properties:
    - `nonResourcePath`, type string; non-resource request paths.
      - Ex: `/version` or `/apis`
      - Wildcard:
        - `*` matches all non-resource requests.
        - `/foo/*` matches all subpaths of `/foo/`.
  - `readonly`, type boolean, when true, means that the Resource-matching policy only applies to get, list,
    and watch operations, Non-resource-matching policy only applies to get operation.
  -->
  - 非資源匹配屬性：
    - `nonResourcePath`，字符串類型；非資源請求路徑。
      - 例如：`/version` 或 `/apis`
      - 通配符：
        - `*` 匹配所有非資源請求。
        - `/foo/*` 匹配 `/foo/` 的所有子路徑。
  - `readonly`，布爾值類型。如果爲 true，則表示該策略僅適用於 get、list 和 watch 操作。
    非資源匹配屬性僅適用於 get 操作。

{{< note >}}

<!--
An unset property is the same as a property set to the zero value for its type
(e.g. empty string, 0, false). However, unset should be preferred for
readability.

In the future, policies may be expressed in a JSON format, and managed via a
REST interface.
-->
屬性未設置等效於屬性被設置爲對應類型的零值（例如空字符串、0、false）。
然而，出於可讀性考慮，應儘量選擇不設置這類屬性。

在將來，策略可能以 JSON 格式表示，並通過 REST 界面進行管理。
{{< /note >}}

<!--
## Authorization Algorithm

A request has attributes which correspond to the properties of a policy object.

When a request is received, the attributes are determined. Unknown attributes
are set to the zero value of its type (e.g. empty string, 0, false).

A property set to `"*"` will match any value of the corresponding attribute.
-->
## 鑑權算法   {#authorization-algorithm}

請求具有與策略對象的屬性對應的屬性。

當接收到請求時，屬性是確定的。未知屬性設置爲其類型的零值（例如：空字符串、0、false）。

設置爲 `"*"` 的屬性將匹配相應屬性的任何值。

<!--
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
檢查屬性的元組，以匹配策略文件中的每個策略。如果至少有一行匹配請求屬性，
則請求被鑑權（但仍可能無法通過稍後的合法性檢查）。

要允許任何經過身份驗證的使用者執行某些操作，請將策略組屬性設置爲 `"system:authenticated"`。

要允許任何未經身份驗證的使用者執行某些操作，請將策略組屬性設置爲 `"system:unauthenticated"`。

要允許使用者執行任何操作，請使用設置爲 `"*"` 的 apiGroup、namespace、resource 和
nonResourcePath 屬性編寫策略。

<!--
## Kubectl

Kubectl uses the `/api` and `/apis` endpoints of apiserver to discover
served resource types, and validates objects sent to the API by create/update
operations using schema information located at `/openapi/v2`.

When using ABAC authorization, those special resources have to be explicitly
exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):
-->
## kubectl

kubectl 使用 apiserver 的 `/api` 和 `/apis` 端點來發現服務資源類型，
並使用位於 `/openapi/v2` 的模式信息來驗證通過創建/更新操作發送到 API 的對象。

當使用 ABAC 鑑權時，這些特殊資源必須顯式地通過策略中的 `nonResourcePath` 屬性暴露出來
（參見下面的 [示例](#examples)）：

<!--
* `/api`, `/api/*`, `/apis`, and `/apis/*` for API version negotiation.
* `/version` for retrieving the server version via `kubectl version`.
* `/swaggerapi/*` for create/update operations.

To inspect the HTTP calls involved in a specific kubectl operation you can turn
up the verbosity:

    kubectl --v=8 version
-->
* `/api`，`/api/*`，`/apis` 和 `/apis/*` 用於 API 版本協商。
* `/version` 通過 `kubectl version` 檢索伺服器版本。
* `/swaggerapi/*` 用於創建 / 更新操作。

要檢查涉及到特定 kubectl 操作的 HTTP 調用，你可以調整詳細程度：

```shell
kubectl --v=8 version
```

<!--
## Examples

1. Alice can do anything to all resources:
-->
## 例子 {#examples}

1. Alice 可以對所有資源做任何事情：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
   ```

<!--
2. The Kubelet can read any pods:
-->
2. kubelet 可以讀取所有 Pod：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
   ```

<!--
3. The Kubelet can read and write events:
-->
3. kubelet 可以讀寫事件：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
   ```

<!--
4. Bob can just read pods in namespace "projectCaribou":
-->
4. Bob 可以在命名空間 `projectCaribou` 中讀取 Pod：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
   ```

<!--
5. Anyone can make read-only requests to all non-resource paths:
-->
5. 任何人都可以對所有非資源路徑進行只讀請求：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
   ```

<!--
[Complete file example](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## A quick note on service accounts

Every service account has a corresponding ABAC username, and that service account's username is generated
according to the naming convention:
-->
[完整文件示例](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## 服務賬號的快速說明   {#a-quick-note-on-service-accounts}

每個服務賬號都有對應的 ABAC 使用者名，服務賬號的使用者名是根據命名約定生成的：

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

<!--
Creating a new namespace leads to the creation of a new service account in the following format:
-->
創建新的命名空間也會導致創建一個新的服務賬號：

```shell
system:serviceaccount:<namespace>:default
```

<!--
For example, if you wanted to grant the default service account (in the `kube-system` namespace) full
privilege to the API using ABAC, you would add this line to your policy file:
-->
例如，如果你要使用 ABAC 將（`kube-system` 命名空間中）的默認服務賬號完整權限授予 API，
則可以將此行添加到策略文件中：

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

<!--
The apiserver will need to be restarted to pick up the new policy lines.
-->
API 伺服器將需要被重新啓動以獲取新的策略行。
