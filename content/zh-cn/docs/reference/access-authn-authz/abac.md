---
title: 使用 ABAC 鉴权
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
基于属性的访问控制（Attribute-based access control，ABAC）定义了访问控制范例，
ABAC 通过使用将属性组合在一起的策略来向用户授予访问权限。

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

要启用 `ABAC` 模式，可以在启动时指定 `--authorization-policy-file=SOME_FILENAME` 和 `--authorization-mode=ABAC`。

此文件格式是[每行一个 JSON 对象](https://jsonlines.org/)，不应存在外层的列表或映射，每行应只有一个映射。

每一行都是一个“策略对象”，策略对象是具有以下属性的映射：

<!--
- Versioning properties:
  - `apiVersion`, type string; valid values are "abac.authorization.kubernetes.io/v1beta1". Allows versioning
    and conversion of the policy format.
  - `kind`, type string: valid values are "Policy". Allows versioning and conversion of the policy format.
-->
- 版本控制属性：
  - `apiVersion`，字符串类型：有效值为 `abac.authorization.kubernetes.io/v1beta1`，允许对策略格式进行版本控制和转换。
  - `kind`，字符串类型：有效值为 `Policy`，允许对策略格式进行版本控制和转换。
<!--
- `spec` property set to a map with the following properties:
  - Subject-matching properties:
    - `user`, type string; the user-string from `--token-auth-file`. If you specify `user`, it must match the
      username of the authenticated user.
    - `group`, type string; if you specify `group`, it must match one of the groups of the authenticated user.
      `system:authenticated` matches all authenticated requests. `system:unauthenticated` matches all
      unauthenticated requests.
-->
- `spec` 配置为具有以下映射的属性：
  - 主体匹配属性：
    - `user`，字符串类型；来自 `--token-auth-file` 的用户字符串，如果你指定 `user`，它必须与验证用户的用户名匹配。
    - `group`，字符串类型；如果指定 `group`，它必须与经过身份验证的用户的一个组匹配，
      `system:authenticated` 匹配所有经过身份验证的请求。
      `system:unauthenticated` 匹配所有未经过身份验证的请求。
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
  - 资源匹配属性：
    - `apiGroup`，字符串类型；一个 API 组。
      - 例如：`apps`、`networking.k8s.io`
      - 通配符：`*`匹配所有 API 组。
    - `namespace`，字符串类型；一个命名空间。
      - 例如：`kube-system`
      - 通配符：`*`匹配所有资源请求。
    - `resource`，字符串类型；资源类型。
      - 例如：`pods`、`deployments`
      - 通配符：`*`匹配所有资源请求。
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
  - 非资源匹配属性：
    - `nonResourcePath`，字符串类型；非资源请求路径。
      - 例如：`/version` 或 `/apis`
      - 通配符：
        - `*` 匹配所有非资源请求。
        - `/foo/*` 匹配 `/foo/` 的所有子路径。
  - `readonly`，布尔值类型。如果为 true，则表示该策略仅适用于 get、list 和 watch 操作。
    非资源匹配属性仅适用于 get 操作。

{{< note >}}

<!--
An unset property is the same as a property set to the zero value for its type
(e.g. empty string, 0, false). However, unset should be preferred for
readability.

In the future, policies may be expressed in a JSON format, and managed via a
REST interface.
-->
属性未设置等效于属性被设置为对应类型的零值（例如空字符串、0、false）。
然而，出于可读性考虑，应尽量选择不设置这类属性。

在将来，策略可能以 JSON 格式表示，并通过 REST 界面进行管理。
{{< /note >}}

<!--
## Authorization Algorithm

A request has attributes which correspond to the properties of a policy object.

When a request is received, the attributes are determined. Unknown attributes
are set to the zero value of its type (e.g. empty string, 0, false).

A property set to `"*"` will match any value of the corresponding attribute.
-->
## 鉴权算法   {#authorization-algorithm}

请求具有与策略对象的属性对应的属性。

当接收到请求时，属性是确定的。未知属性设置为其类型的零值（例如：空字符串、0、false）。

设置为 `"*"` 的属性将匹配相应属性的任何值。

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
检查属性的元组，以匹配策略文件中的每个策略。如果至少有一行匹配请求属性，
则请求被鉴权（但仍可能无法通过稍后的合法性检查）。

要允许任何经过身份验证的用户执行某些操作，请将策略组属性设置为 `"system:authenticated"`。

要允许任何未经身份验证的用户执行某些操作，请将策略组属性设置为 `"system:unauthenticated"`。

要允许用户执行任何操作，请使用设置为 `"*"` 的 apiGroup、namespace、resource 和
nonResourcePath 属性编写策略。

<!--
## Kubectl

Kubectl uses the `/api` and `/apis` endpoints of apiserver to discover
served resource types, and validates objects sent to the API by create/update
operations using schema information located at `/openapi/v2`.

When using ABAC authorization, those special resources have to be explicitly
exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):
-->
## kubectl

kubectl 使用 apiserver 的 `/api` 和 `/apis` 端点来发现服务资源类型，
并使用位于 `/openapi/v2` 的模式信息来验证通过创建/更新操作发送到 API 的对象。

当使用 ABAC 鉴权时，这些特殊资源必须显式地通过策略中的 `nonResourcePath` 属性暴露出来
（参见下面的 [示例](#examples)）：

<!--
* `/api`, `/api/*`, `/apis`, and `/apis/*` for API version negotiation.
* `/version` for retrieving the server version via `kubectl version`.
* `/swaggerapi/*` for create/update operations.

To inspect the HTTP calls involved in a specific kubectl operation you can turn
up the verbosity:

    kubectl --v=8 version
-->
* `/api`，`/api/*`，`/apis` 和 `/apis/*` 用于 API 版本协商。
* `/version` 通过 `kubectl version` 检索服务器版本。
* `/swaggerapi/*` 用于创建 / 更新操作。

要检查涉及到特定 kubectl 操作的 HTTP 调用，你可以调整详细程度：

```shell
kubectl --v=8 version
```

<!--
## Examples

1. Alice can do anything to all resources:
-->
## 例子 {#examples}

1. Alice 可以对所有资源做任何事情：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
   ```

<!--
2. The Kubelet can read any pods:
-->
2. kubelet 可以读取所有 Pod：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
   ```

<!--
3. The Kubelet can read and write events:
-->
3. kubelet 可以读写事件：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
   ```

<!--
4. Bob can just read pods in namespace "projectCaribou":
-->
4. Bob 可以在命名空间 `projectCaribou` 中读取 Pod：

   ```json
   {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
   ```

<!--
5. Anyone can make read-only requests to all non-resource paths:
-->
5. 任何人都可以对所有非资源路径进行只读请求：

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

## 服务账号的快速说明   {#a-quick-note-on-service-accounts}

每个服务账号都有对应的 ABAC 用户名，服务账号的用户名是根据命名约定生成的：

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

<!--
Creating a new namespace leads to the creation of a new service account in the following format:
-->
创建新的命名空间也会导致创建一个新的服务账号：

```shell
system:serviceaccount:<namespace>:default
```

<!--
For example, if you wanted to grant the default service account (in the `kube-system` namespace) full
privilege to the API using ABAC, you would add this line to your policy file:
-->
例如，如果你要使用 ABAC 将（`kube-system` 命名空间中）的默认服务账号完整权限授予 API，
则可以将此行添加到策略文件中：

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

<!--
The apiserver will need to be restarted to pick up the new policy lines.
-->
API 服务器将需要被重新启动以获取新的策略行。
