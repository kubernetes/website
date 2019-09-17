---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: 使用 ABAC 授权
content_template: templates/concept
weight: 80
---
<!--
---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Using ABAC Authorization
content_template: templates/concept
weight: 80
---
-->
{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.6" >}}
<!--
The ABAC Authorization feature has been considered deprecated from the Kubernetes 1.6 release.
-->
从 Kubernetes 1.6 开始，ABAC 授权功能已被视为弃用。
{{< /note >}}

{{% capture overview %}}
<!--
Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together.
-->
基于属性的访问控制（ABAC）定义了一种访问控制范例，通过使用将属性组合在一起的策略，将访问权限授予用户。
{{% /capture %}}

{{% capture body %}}
<!--
## Policy File Format
-->
## 策略文件格式

<!--
To enable `ABAC` mode, specify `--authorization-policy-file=SOME_FILENAME` and `--authorization-mode=ABAC` on startup.
-->
要启用 `ABAC` 模式，请在启动时指定 `--authorization-policy-file=SOME_FILENAME` 和 `--authorization-mode=ABAC` 。

<!--
The file format is [one JSON object per line](http://jsonlines.org/).  There should be no enclosing list or map, just one map per line.
-->
文件格式是[每行一个 JSON 对象](http://jsonlines.org/)。不允许存在内嵌的 list 或 map，每一行只能有一个 map 。

<!--
Each line is a "policy object", where each such object is a map with the following properties:
- Versioning properties:
    - `apiVersion`, type string; valid values are "abac.authorization.kubernetes.io/v1beta1". Allows versioning and conversion of the policy format.
    - `kind`, type string: valid values are "Policy". Allows versioning and conversion of the policy format.
  - `spec` property set to a map with the following properties:
    - Subject-matching properties:
      - `user`, type string; the user-string from `--token-auth-file`. If you specify `user`, it must match the username of the authenticated user.
      - `group`, type string; if you specify `group`, it must match one of the groups of the authenticated user. `system:authenticated` matches all authenticated requests. `system:unauthenticated` matches all unauthenticated requests.
    - Resource-matching properties:
      - `apiGroup`, type string; an API group.
        - Ex: `extensions`
        - Wildcard: `*` matches all API groups.
      - `namespace`, type string; a namespace.
        - Ex: `kube-system`
        - Wildcard: `*` matches all resource requests.
      - `resource`, type string; a resource type
        - Ex: `pods`
        - Wildcard: `*` matches all resource requests.
    - Non-resource-matching properties:
      - `nonResourcePath`, type string; non-resource request paths.
        - Ex: `/version` or `/apis`
        - Wildcard: 
          - `*` matches all non-resource requests.
          - `/foo/*` matches all subpaths of `/foo/`.
    - `readonly`, type boolean, when true, means that the Resource-matching policy only applies to get, list, and watch operations, Non-resource-matching policy only applies to get operation.

-->
每一行都是一个“策略对象”，其中每个这样的对象都是具有以下属性的 map：

- 版本属性：
    - `apiVersion`， 字符串类型，有效值是 "abac.authorization.kubernetes.io/v1beta1"。 用来支持策略格式的版本化和转换。
    - `kind`，字符串类型，有效值是 "Policy"。 用来支持策略格式的版本化和转换。
  - `spec` 属性设置为具有以下属性的 map：
    - 主体匹配属性：
      - `user`，字符串类型，来自 `--token-auth-file` 的用户字符串。 如果您指定 `user`，它必须与经过身份验证的用户的用户名匹配。
      - `group`，字符串类型，如果您指定 `group`，它必须匹配经过身份验证的用户的一个组。 `system:authenticated` 匹配所有经过身份验证的请求。 `system:unauthenticated` 匹配所有未经身份验证的请求。
    - 资源匹配属性：
      - `apiGroup`，字符串类型，一个 API 组。
        - 示例： `extensions`
        - 通配符： `*` 匹配所有 API 组。
      - `namespace`，字符串类型，一个命名空间。
        - 示例： `kube-system`
        - 通配符: `*` 匹配所有资源请求。
      - `resource`，字符串类型，一种资源。
        - 示例： `pods`
        - 通配符： `*` 匹配所有资源请求。
    - 非资源匹配属性：
      - `nonResourcePath`，字符串类型，非资源请求路径。
        - 示例： `/version` 或 `/apis`
        - 通配符：
          - `*` 匹配所有非资源请求。
          - `/foo/*` 匹配 `/foo/` 的所有子路径。
    - `readonly`，布尔类型， 表示资源匹配策略仅适用于 get，list 和 watch 操作，非资源匹配策略仅适用于 get 操作。

{{< note >}}
<!--
An unset property is the same as a property set to the zero value for its type(e.g. empty string, 0, false). However, unset should be preferred for readability. In the future, policies may be expressed in a JSON format, and managed via aREST interface.
-->
未设置的属性与为属性设置为对应类型之零值（例如，空字符串，0，false）的效果相同。为了可读性，应尽量采用不设置的方式。将来，策略可能会用 JSON 格式表示，并通过 REST 接口管理。

{{< /note >}}

<!--
## Authorization Algorithm
-->
## 授权算法

<!--
A request has attributes which correspond to the properties of a policy object.
-->
请求具有与策略对象的属性相对应的属性。

<!--
When a request is received, the attributes are determined.  Unknown attributesare set to the zero value of its type (e.g. empty string, 0, false).
-->
当 kubernetes 收到请求时，确定各属性的取值。未知属性会被设置为其对应类型的零值（例如空字符串，0，false）。

<!--
A property set to `"*"` will match any value of the corresponding attribute.
-->
设置为 `"*"` 的属性将匹配相应属性的任何值。

<!--
The tuple of attributes is checked for a match against every policy in thepolicy file. If at least one line matches the request attributes, then the request is authorized (but may fail later validation).
-->
属性元组与策略文件中的各个策略逐一比较，以寻找匹配项。如果至少有一行匹配请求属性，则请求被授权（但稍后可能会验证失败）。

<!--
To permit any authenticated user to do something, write a policy with the group property set to `"system:authenticated"`.
-->
要允许任何经过身份验证的用户执行某些操作，请编写将 group 属性设置为 `"system:authenticated"` 的策略。

<!--
To permit any unauthenticated user to do something, write a policy with the group property set to `"system:unauthenticated"`.
-->
要允许任何未经身份验证的用户执行某些操作，请编写将 group 属性设置为 `"system:unauthenticated"` 的策略。

<!--
To permit a user to do anything, write a policy with the apiGroup, namespace,resource, and nonResourcePath properties set to `"*"`.
-->
要允许用户执行任何操作，请编写将 apiGroup，namespace，resource 和 nonResourcePath 属性设置为 `"*"` 的策略。

<!--
## Kubectl
-->
## Kubectl

<!--
Kubectl uses the `/api` and `/apis` endpoints of api-server to discover served resource types, and validates objects sent to the API by create/update operations using schema information located at `/openapi/v2`.
-->
Kubectl 使用 api-server 的 `/api` 和 `/apis` 端点来发现资源类型，并使用位于 `/openapi/v2` 的 schema 信息验证通过创建/更新操作发送到 API 的对象。

<!--
When using ABAC authorization, those special resources have to be explicitly exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):
-->
当使用 ABAC 授权时，必须通过策略中的 `nonResourcePath` 属性显式地公开这些特殊资源（参见下面的[示例](#examples)）：

* `/api`， `/api/*`， `/apis`， 和 `/apis/*` 用于 API 版本协商。
* `/version` 用于通过 `kubectl version` 获取服务端版本。
* `/swaggerapi/*` 用于创建/更新操作。

<!--
To inspect the HTTP calls involved in a specific kubectl operation you can turnup the verbosity:
-->
要检查特定 kubectl 操作中涉及的 HTTP 调用，您可以调整日志输出的详细程度：

<!--
    kubectl --v=8 version
-->
kubectl --v=8 version

<!--
## Examples
-->
## 示例 {#examples}

<!--
1. Alice can do anything to all resources:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
 1. The Kubelet can read any pods:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
 2. The Kubelet can read and write events:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
 3. Bob can just read pods in namespace "projectCaribou":

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
 5. Anyone can make read-only requests to all non-resource paths:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```
-->
1. Alice 可以对所有资源做任何事情：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```

2. Kubelet 可以读取任何 Pod：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```

3. Kubelet 可以读写事件：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```

4. Bob 可以在命名空间 “projectCaribou” 中读取 Pod：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```

5. 任何人都可以对所有非资源路径发出只读请求：

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```

<!--
[Complete file example](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)
-->
[完整文件示例](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

<!--
## A quick note on service accounts
-->
## 关于服务帐户的快速说明

<!--
Every service account has a corresponding ABAC username, and that service account's user name is generated according to the naming convention:
-->
每个服务帐户都有一个相应的 ABAC 用户名，该服务帐户的用户名是根据下面的命名规则生成的：

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```

<!--
Creating a new namespace leads to the creation of a new service account in the following format:
-->
创建新的命名空间会导致以下列格式创建新的服务帐户：

```shell
system:serviceaccount:<namespace>:default
```

<!--
For example, if you wanted to grant the default service account (in the `kube-system` namespace) full privilege to the API using ABAC, you would add this line to your policy file:
-->
例如，如果您想使用 ABAC 将默认服务帐户（在 `kube-system` 命名空间中）进行 API 完全授权，您可以将此行添加到您的策略文件中：

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

<!--
The apiserver will need to be restarted to pickup the new policy lines.
-->
需要重新启动 apiserver 以使新的策略行生效。

{{% /capture %}}

