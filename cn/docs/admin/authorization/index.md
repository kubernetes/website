---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: 概述
---

{% capture overview %}

学习有关 Kubernetes 授权的更多信息，包括有关使用支持的授权模块创建策略的详细信息。

{% endcapture %}

{% capture body %}

在 Kubernetes 里，您必须经过身份验证(登录)，才能授权您的请求(授予访问权限).。有关认证的信息，请参阅[访问控制概述](/docs/admin/access-the-api/)。

Kubernetes 提供通用的 REST API 请求。这意味着 Kubernetes 授权可以与现有的组织或云提供商的访问控制系统一起使用，该系统可以处理除 Kubernetes API 之外的其他 API。

## 确定请求是允许还是被拒绝
Kubernetes 使用 API​​ 服务器授权 API 请求。它根据所有策略评估所有请求属性，并允许或拒绝请求。某些策略必须允许 API 请求的所有部分继续进行，这意味着默认情况下是拒绝权限。

(虽然 Kubernetes 使用 API ​​服务器，访问控制和依赖特定类型对象的特定领域策略由 Admission 控制器处理。)

当配置多个授权模块时，按顺序检查每个模块，如果有任何模块授权请求，则可以继续执行该请求。如果所有模块拒绝请求，则拒绝该请求(HTTP状态代码403)。

## 查看您的请求属性

Kubernetes 仅查看以下API请求属性:

* **user**  - 验证期间提供的 `user` 字符串
* **group**  - 认证用户所属的组名列表
* **“extra"**  - 由认证层提供的任意字符串键到字符串值的映射
* **API**  - 指示请求是否用于API资源
* **Request path**  - 诸如`/api`或`/healthz`的其他非资源端点的路径(请参阅[kubectl](#kubectl)).
* **API request verb**  -  API 动词 `get`，`list`，`create`，`update`，`patch`，`watch`，`proxy`，`redirect`，`delete`和`deletecollection`用于资源请求。要确定资源 API 端点的请求动词，请参阅**确定下面的请求动词**.
* **HTTP request verb**  -  HTTP动词`get`，`post`，`put`和`delete`用于非资源请求
* **Resource**  - 正在访问的资源的ID或名称(仅适用于资源请求)
 --* 对于使用`get`, `update`, `patch`, 和 `delete`动词的资源请求，您必须提供资源名称。
* **Subresource**  - 正在访问的子资源(仅用于资源请求)
* **Namespace**  - 正在被访问的对象的命名空间(仅针对命名空间的资源请求)
* **API group**  - 正在访问的API组(仅用于资源请求). 一个空字符串指定[核心 API 组](/docs/api/).

## 确定请求动词

要确定资源 API 端点的请求动词，请查看所使用的HTTP动词以及请求是否对单个资源或资源集合进行操作:

HTTP动词| 请求动词
---------- | ---------------
POST | 创建
GET，HEAD | 获取(个人资源)，列表(集合)
PUT | 更新
PATCH | 补丁
DELETE| 删除(个人资源)，删除(收藏)

Kubernetes 有时会使用专门的动词检查授权以获得额外的权限。例如:

* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)在`extensions` API组中的`podsecuritypolicies`资源上检查`use`动词的授权。
* [RBAC](/docs/admin/authorization/rbac/#privilege-escalation-prevention-and-bootstrapping) 在`rbac.authorization.k8s.io` API组中的`roles`和`clusterroles`资源上检查`bind`动词的授权。
* [认证](/docs/admin/authentication/) 在核心API组中的`users`，`groups`和`serviceaccounts`上的`impersonate`动词的授权以及`authentication.k8s.io` API组中的`userextras`进行层次检查。

## 授权模块
* **ABAC模式**  - 基于属性的访问控制(ABAC)定义了访问控制范例，通过使用将属性组合在一起的策略来授予用户访问权限。策略可以使用任何类型的属性(用户属性，资源属性，对象，环境属性等)。要了解有关使用ABAC模式的更多信息，请参阅[ABAC模式](/docs/admin/authorization/abac/)
* **RBAC模式**  - 基于角色的访问控制(RBAC)是一种根据企业内个人用户的角色来调整对计算机或网络资源的访问的方法。在这种情况下，访问是单个用户执行特定任务(例如查看，创建或修改文件)的能力。要了解有关使用RBAC模式的更多信息，请参阅[RBAC模式](/docs/admin/authorization/rbac/)
*当指定 "RBAC"(基于角色的访问控制)使用 "rbac.authorization.k8s.io" API组来驱动授权决定时，允许管理员通过Kubernetes API动态配置权限策略.
.. *截至1.6 RBAC模式是测试版.
.. *要启用RBAC，请使用 `--authorization-mode=RBAC` 启动 apiserver.
* **Webhook模式**  -  WebHook 是HTTP回调:发生事件时发生的HTTP POST; 通过HTTP POST简单的事件通知. 实施 WebHooks 的 Web 应用程序将在某些事情发生时向URL发送消息. 要了解有关使用Webhook模式的更多信息，请参阅[Webhook模式](/docs/admin/authorization/webhook/)
* **自定义模块**  - 您可以创建使用Kubernetes的自定义模块. 要了解更多信息，请参阅下面的**自定义模块**。

### 自定义模块
可以相当容易地开发其他实现,APIserver 调用 Authorizer 接口：

```go
type Authorizer interface {
  Authorize(a Attributes) error
}
```

以确定是否允许每个API操作.

授权插件是实现此接口的模块.授权插件代码位于 `pkg/auth/authorizer/$MODULENAME` 中。

授权模块可以完全实现，也可以拨出远程授权服务。 授权模块可以实现自己的缓存，以减少具有相同或相似参数的重复授权调用的成本。 开发人员应该考虑缓存和撤销权限之间的交互。

#### 检查API访问

Kubernetes 将 `subjectaccessreviews.v1.authorization.k8s.io`  资源公开为允许外部访问API授权者决策的普通资源。 无论您选择使用哪个授权器，您都可以使用`SubjectAccessReview`发出一个`POST`，就像webhook授权器的`apis/authorization.k8s.io/v1/subjectaccessreviews` 端点一样，并回复一个响应。 例如：


```bash
kubectl create --v=8 -f -  << __EOF__
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ],
    "extra": {
      "scopes": [
        "openid",
        "profile"
      ]
    }
  }
}
__EOF__

--- snip lots of output ---

I0913 08:12:31.362873   27425 request.go:908] Response Body: {"kind":"SubjectAccessReview","apiVersion":"authorization.k8s.io/v1","metadata":{"creationTimestamp":null},"spec":{"resourceAttributes":{"namespace":"kittensandponies","verb":"GET","group":"unicorn.example.org","resource":"pods"},"user":"jane","group":["group1","group2"],"extra":{"scopes":["openid","profile"]}},"status":{"allowed":true}}
subjectaccessreview "" created
```

这对于调试访问问题非常有用，因为您可以使用此资源来确定授权者授予哪些访问权限。

## 为您的授权模块使用标志

您的策略中必须包含一个标志，以指出您的策略包含哪个授权模块:

可以使用以下标志:
 - `--authorization-mode=ABAC` 基于属性的访问控制(ABAC)模式允许您使用本地文件配置策略。
 - `--authorization-mode=RBAC` 基于角色的访问控制(RBAC)模式允许您使用Kubernetes API创建和存储策略.
 - `--authorization-mode=Webhook` WebHook是一种HTTP回调模式，允许您使用远程REST管理授权。
 - `--authorization-mode=AlwaysDeny` 此标志阻止所有请求. 仅使用此标志进行测试。
 - `--authorization-mode=AlwaysAllow` 此标志允许所有请求. 只有在您不需要API请求授权的情况下才能使用此标志。

您可以选择多个授权模块. 如果其中一种模式为 `AlwaysAllow`，则覆盖其他模式，并允许所有API请求。

## 版本控制

对于版本 1.2，配置了 kube-up.sh 创建的集群，以便任何请求都不需要授权。

从版本 1.3 开始，配置由 kube-up.sh 创建的集群，使得 ABAC 授权模块处于启用状态。但是，其输入文件最初设置为允许所有用户执行所有操作，集群管理员需要编辑该文件，或者配置不同的授权器来限制用户可以执行的操作。

{% endcapture %}
{% capture whatsnext %}

* 要学习有关身份验证的更多信息，请参阅**身份验证**[控制访问 Kubernetes API](docs/admin/access-the-api/)。
* 要了解有关入学管理的更多信息，请参阅[使用 Admission 控制器](docs/admin/admission-controllers/)。
*
{% endcapture %}

{% include templates/concept.md %}
