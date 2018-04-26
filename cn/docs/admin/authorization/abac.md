<!--
---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: ABAC Mode
---
-->
---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: ABAC 模式
---

{% capture overview %}
<!--
Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together.
-->
基于属性的访问控制（Attribute-based access control - ABAC）定义了访问控制范例，其中通过使用将属性组合在一起的策略来向用户授予访问权限。

{% endcapture %}

{% capture body %}
<!--
## Policy File Format
-->
## 策略文件格式
<!--
For mode `ABAC`, also specify `--authorization-policy-file=SOME_FILENAME`.-->
基于 `ABAC` 模式，可以这样指定策略文件 `--authorization-policy-file=SOME_FILENAME`。
<!--
The file format is [one JSON object per line](http://jsonlines.org/).  There
should be no enclosing list or map, just one map per line.
-->
此文件是 JSON 格式[每行都是一个JSON对象](http://jsonlines.org/)，不应存在封闭的列表或映射，每行只有一个映射。

<!--
Each line is a "policy object".  A policy object is a map with the following
properties:-->
每一行都是一个 "策略对象"，策略对象是具有以下映射的属性:
<!--
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
    - `readonly`, type boolean, when true, means that the Resource-matching policy only applies to get, list, and watch operations.
-->
    - 版本控制属性:
      - `apiVersion`，字符串类型: 有效值为"abac.authorization.kubernetes.io/v1beta1"，允许版本控制和转换策略格式。
      - `kind`，字符串类型: 有效值为 "Policy"，允许版本控制和转换策略格式。
    - `spec` 配置为具有以下映射的属性:
      - 匹配属性:
        - `user`，字符串类型; 来自 `--token-auth-file` 的用户字符串，如果你指定`user`，它必须与验证用户的用户名匹配。
        - `group`，字符串类型; 如果指定`group`，它必须与经过身份验证的用户的一个组匹配，`system:authenticated`匹配所有经过身份验证的请求。`system:unauthenticated`匹配所有未经过身份验证的请求。
    - 资源匹配属性:
      - `apiGroup`，字符串类型; 一个 API 组。
        - 例: `extensions`
        - 通配符: `*`匹配所有 API 组。
      - `namespace`，字符串类型; 一个命名空间。
        - 例如: `kube-system`
        - 通配符: `*` 匹配所有资源请求。
      - `resource`，字符串类型; 资源类型。
        - 例:`pods`
        - 通配符: `*`匹配所有资源请求。
    - 非资源匹配属性:
      - `nonResourcePath`，字符串类型; 非资源请求路径。
        - 例如:`/version`或`/apis`
        - 通配符:
          - `*` 匹配所有非资源请求。
          - `/foo/*` 匹配`/foo/`的所有子路径。
    - `readonly`，键入 boolean，如果为 true，则表示该策略仅适用于 get，list 和 watch 操作。
<!--
**NOTES:** An unset property is the same as a property set to the zero value for its type
(e.g. empty string, 0, false). However, unset should be preferred for
readability.-->
**注意:** 未设置的属性与类型设置为零值的属性相同(例如空字符串，0、false)，然而未知的应该可读性优先。
<!--
In the future, policies may be expressed in a JSON format, and managed via a
REST interface.-->

在将来，策略可能以 JSON 格式表示，并通过 REST 界面进行管理。
<!--
## Authorization Algorithm-->
## 授权算法
<!--
A request has attributes which correspond to the properties of a policy object.-->
请求具有与策略对象的属性对应的属性。
<!--
When a request is received, the attributes are determined.  Unknown attributes
are set to the zero value of its type (e.g. empty string, 0, false).-->
当接收到请求时，确定属性。 未知属性设置为其类型的零值（例如: 空字符串，0，false）。
<!--
A property set to `"*"` will match any value of the corresponding attribute.-->
设置为`“*"`的属性将匹配相应属性的任何值。
<!--
The tuple of attributes is checked for a match against every policy in the
policy file. If at least one line matches the request attributes, then the
request is authorized (but may fail later validation).-->
检查属性的元组，以匹配策略文件中的每个策略。 如果至少有一行匹配请求属性，则请求被授权（但可能会在稍后验证失败）。
<!--
To permit any authenticated user to do something, write a policy with the
group property set to `"system:authenticated"`.-->
要允许任何经过身份验证的用户执行某些操作，请将策略组属性设置为 `"system:authenticated“`。
<!--
To permit any unauthenticated user to do something, write a policy with the
group property set to `"system:unauthenticated"`.-->
要允许任何未经身份验证的用户执行某些操作，请将策略组属性设置为`"system:authentication“`。
<!--
To permit a user to do anything, write a policy with the apiGroup, namespace,
resource, and nonResourcePath properties set to `"*"`.-->
要允许用户执行任何操作，请使用设置为`“*”` 的 apiGroup，namespace，resource 和 nonResourcePath 属性编写策略。

## Kubectl
<!--
Kubectl uses the `/api` and `/apis` endpoints of api-server to negotiate
client/server versions. To validate objects sent to the API by create/update
operations, kubectl queries certain swagger resources. For API version `v1`
those would be `/swaggerapi/api/v1` & `/swaggerapi/experimental/v1`.-->
Kubectl 使用 api-server 的 `/api` 和 `/apis` 端点进行协商客户端/服务器版本。 通过创建/更新来验证发送到API的对象操作，kubectl 查询某些 swagger 资源。 对于API版本"v1", 那就是`/swaggerapi/api/v1` ＆ `/swaggerapi/ experimental/v1`。
<!--
When using ABAC authorization, those special resources have to be explicitly
exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):-->
当使用 ABAC 授权时，这些特殊资源必须明确通过策略中的 `nonResourcePath` 属性暴露出来(参见下面的[例子](#examples)):

<!--
* `/api`, `/api/*`, `/apis`, and `/apis/*` for API version negotiation.
* `/version` for retrieving the server version via `kubectl version`.
* `/swaggerapi/*` for create/update operations.
-->
* `/api`，`/api/*`，`/apis`和`/apis/*` 用于 API 版本协商.
* `/version` 通过 `kubectl version` 检索服务器版本.
* `/swaggerapi/*` 用于创建/更新操作.
<!--
To inspect the HTTP calls involved in a specific kubectl operation you can turn
up the verbosity:-->
要检查涉及到特定kubectl操作的HTTP调用，您可以调整详细程度：

    kubectl --v=8 version
<!--
## Examples-->
## 例子

 <!--1. Alice can do anything to all resources:-->
 1. Alice 可以对所有资源做任何事情:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
 <!--2. Kubelet can read any pods:-->
 2. Kubelet 可以读取任何 Pod:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
 <!--3. Kubelet can read and write events:-->
 3. Kubelet 可以读写事件:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
 <!--4. Bob can just read pods in namespace "projectCaribou":-->
 4. Bob 可以在命名空间"projectCaribou"中读取 Pod:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
 <!--5. Anyone can make read-only requests to all non-resource paths:-->
 5. 任何人都可以对所有非资源路径进行只读请求:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```
<!--
[Complete file example](http://releases.k8s.io/{{page.githubbranch}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)-->
[完整文件示例](http://releases.k8s.io/{{page.githubbranch}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)
<!--
## A quick note on service accounts-->
## 服务帐户的快速说明
<!--
A service account automatically generates a user. The user's name is generated
according to the naming convention:-->
服务帐户自动生成用户。 用户名是根据命名约定生成的:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```
<!--
Creating a new namespace also causes a new service account to be created, of
this form:-->
创建新的命名空间也会导致创建一个新的服务帐户：

```shell
system:serviceaccount:<namespace>:default
```
<!--
For example, if you wanted to grant the default service account in the
kube-system full privilege to the API, you would add this line to your policy
file:
-->
例如，如果要将 API 的 kube-system 完整权限中的默认服务帐户授予，则可以将此行添加到策略文件中:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```
<!--
The apiserver will need to be restarted to pickup the new policy lines.
-->
需要重新启动 apiserver 以获取新的策略行.

{% endcapture %}
{% include templates/concept.md %}
