---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: ABAC 模式
content_template: templates/concept
---

{{% capture overview %}}

基于属性的访问控制（Attribute-based access control - ABAC）定义了访问控制范例，其中通过使用将属性组合在一起的策略来向用户授予访问权限。

{{% /capture %}}

{{% capture body %}}

## 策略文件格式

基于 `ABAC` 模式，可以这样指定策略文件 `--authorization-policy-file=SOME_FILENAME`。

此文件是 JSON 格式[每行都是一个JSON对象](http://jsonlines.org/)，不应存在封闭的列表或映射，每行只有一个映射。

每一行都是一个 "策略对象"，策略对象是具有以下映射的属性:

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

**注意:** 未设置的属性与类型设置为零值的属性相同(例如空字符串，0、false)，然而未知的应该可读性优先。

在将来，策略可能以 JSON 格式表示，并通过 REST 界面进行管理。

## 授权算法

请求具有与策略对象的属性对应的属性。

当接收到请求时，确定属性。 未知属性设置为其类型的零值（例如: 空字符串，0，false）。

设置为`“*"`的属性将匹配相应属性的任何值。

检查属性的元组，以匹配策略文件中的每个策略。 如果至少有一行匹配请求属性，则请求被授权（但可能会在稍后验证失败）。

要允许任何经过身份验证的用户执行某些操作，请将策略组属性设置为 `"system:authenticated“`。

要允许任何未经身份验证的用户执行某些操作，请将策略组属性设置为`"system:authentication“`。

要允许用户执行任何操作，请使用 apiGroup，命名空间，
资源和 nonResourcePath 属性设置为 `“*"`的策略.

要允许用户执行任何操作，请使用设置为`“*”` 的 apiGroup，namespace，resource 和 nonResourcePath 属性编写策略。

## Kubectl

Kubectl 使用 api-server 的 `/api` 和 `/apis` 端点进行协商客户端/服务器版本。 通过创建/更新来验证发送到API的对象操作，kubectl 查询某些 swagger 资源。 对于API版本"v1", 那就是`/swaggerapi/api/v1` ＆ `/swaggerapi/ experimental/v1`。

当使用 ABAC 授权时，这些特殊资源必须明确通过策略中的 `nonResourcePath` 属性暴露出来(参见下面的[例子](#examples)):

* `/api`，`/api/*`，`/apis`和`/apis/*` 用于 API 版本协商.
* `/version` 通过 `kubectl version` 检索服务器版本.
* `/swaggerapi/*` 用于创建/更新操作.

要检查涉及到特定kubectl操作的HTTP调用，您可以调整详细程度：

    kubectl --v=8 version

## 例子

1. Alice 可以对所有资源做任何事情:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
2. Kubelet 可以读取任何pod:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
3. Kubelet 可以读写事件:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
4. Bob 可以在命名空间“projectCaribou"中读取 pod:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
5. 任何人都可以对所有非资源路径进行只读请求:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:authenticated", "readonly": true, "nonResourcePath": "*"}}
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"group": "system:unauthenticated", "readonly": true, "nonResourcePath": "*"}}
    ```

[完整文件示例](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## 服务帐户的快速说明

服务帐户自动生成用户。 用户名是根据命名约定生成的:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```
创建新的命名空间也会导致创建一个新的服务帐户：

```shell
system:serviceaccount:<namespace>:default
```

例如，如果要将 API 的 kube-system 完整权限中的默认服务帐户授予，则可以将此行添加到策略文件中:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

需要重新启动 apiserver 以获取新的策略行.

{{% /capture %}}

