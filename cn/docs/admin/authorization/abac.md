---
assignees:
- erictune
- lavalamp
- deads2k
- liggitt
title: ABAC 模式
---

{% capture overview %}
基于属性的访问控制 (ABAC) 定义了访问控制范例，通过使用能将属性组合在一起的策略，来向用户授予访问权限.
{% endcapture %}

{% capture body %}
## 策略文件格式

对于模式 `ABAC` ，也指定 `--authorization-policy-file=SOME_FILENAME`.

文件格式是[每行一个JSON对象](http://jsonlines.org/). 不应存在封闭的列表或地图，每行只有一个地图.

每一行都是一个“策略对象". 策略对象是具有以下属性的映射.

属性:

  - 版本控制属性:
    - `apiVersion`，键入字符串; 有效值为"abac.authorization.kubernetes.io/v1beta1"，允许版本控制和转换策略格式.
    - `kind`，键入 string:有效值为“Policy". 允许版本控制和转换策略格式.
  - `spec`属性设置为具有以下属性的地图:
    - 主题匹配属性:
      - `user`，键入字符串; 来自`--token-auth-file`的用户字符串. 如果你指定`user`，它必须与验证用户的用户名匹配.
      - `group`，键入字符串; 如果指定`group`，它必须与经过身份验证的用户的一个组匹配.  `system:authenticated`匹配所有经过身份验证的请求.  `system:unauthenticated`匹配所有未经过身份验证的请求.
  - 资源匹配属性:
    - “apiGroup"，键入字符串; 一个 API 组.
      - 例:`extensions`
      - 通配符:`*`匹配所有 API 组.
    - `namespace`，键入字符串; 一个命名空间
      - 例如:`kube-system`
      - 通配符:`*`匹配所有资源请求.
    - `resource`，键入字符串; 资源类型
      - 例:`pods`
      - 通配符:`*`匹配所有资源请求.
  - 非资源匹配属性:
    - `nonResourcePath`，键入字符串; 非资源请求路径.
      - 例如:`/version`或`/apis`
      - 通配符:
        - `*`匹配所有非资源请求.
        - `/foo/*`匹配`/foo/`的所有子路径.
  - `readonly`，键入 boolean，如果为 true，则表示该策略仅适用于 get，list 和 watch 操作.

**注意:** 未设置的属性与类型设置为零值的属性相同
(例如空字符串，0，假). 但是 unset 命令应该优先选择
可读性.

在将来，策略可能以 JSON 格式表示，并通过
 REST 界面进行管理.

## 授权算法

请求具有与策略对象的属性对应的属性.

当接收到请求时，会确定属性. 未知属性
的类型被设置为零值(例如，空字符串，0，假).

设置为`“*"`的属性将匹配相应属性的任何值.

算法会检查属性的元组，以匹配每个策略文件夹中的
策略文件. 如果至少有一行匹配请求属性，那么
请求被授权(但可能会在稍后验证失败).

要允许任何经过身份验证的用户执行某些操作，请写入
组属性设置为 `"system:authenticated“`的策略.

要允许任何未经身份验证的用户执行某些操作，请写入
组属性设置为`"system:authentication“`的策略.

要允许用户执行任何操作，请使用 apiGroup，命名空间，
资源和 nonResourcePath 属性设置为 `“*"`的策略.

## Kubectl

Kubectl 使用 api-server 的`/api`和`/apis`端点协商
客户端/服务器版本. 通过创建/更新验证发送到 API 的对象
的操作，kubectl 查询某些 swagger 资源. 对于 API 版本“v1"
那就是 `/swaggerapi/api/v1`&`/swaggerapi/experimental/v1`.

当使用ABAC授权时，这些特殊资源必须明确
通过策略中的 `nonResourcePath` 属性外部可见(参见下面的[examples](#examples)):

* `/api`，`/api/*`，`/apis`和`/apis/*`用于 API 版本协商.
* `/version`通过`kubectl version`检索服务器版本.
* `/swaggerapi/*`用于创建/更新操作.

要检查有关特定 kubectl 操作的 HTTP 调用，您可以调高
冗长度:

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

[完整文件示例](http://releases.k8s.io/{{page.githubbranch}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

## 服务帐户的快速注释

服务帐户自动生成用户，生成的用户名
根据命名惯例:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```
创建新的命名空间也会导致一个新的服务帐户被创建
它将采取这种形式:

```shell
system:serviceaccount:<namespace>:default
```

例如，如果您要授予默认服务帐户
API 的 kube 系统完整权限，您可以将此行添加到您的策略文件
中:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

需要重新启动 apitorver 以获取新的策略行.

{% endcapture %}
{% include templates/concept.md %}
