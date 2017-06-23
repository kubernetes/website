---
assignees:
- bgrant0607
- erictune
- lavalamp
title: 控制访问 Kubernetes API
---

用户使用`kubectl` [访问API](/docs/user-guide/access-the-cluster)
客户端库或通过发出 REST 请求. 人类用户和
[Kubernetes服务帐号](/docs/tasks/configure-pod-container/configure-service-account/)可以
授权进行 API 访问.
当一个请求到达 API 时，它会经历几个阶段，如图所示
下图:

![Kubernetes API请求的请求处理步骤图](/images/docs/admin/access-control-overview.svg)

## 传输安全

在典型的 Kubernetes 集群中，API 在端口 443 上提供.一个 TLS 连接
建立.  API 服务器提供证书. 这个证书
通常自签名，所以用户机器上的`$USER/.kube/config`通常
包含 API 服务器证书的根证书，该证书在指定时
用于代替系统默认的根证书. 这个证书通常
当您自己创建一个集群时，会自动写入您的`$USER/.kube/config`
使用`kube-up.sh`. 如果集群有多个用户，则创建者需要共享
与其他用户的证书.

## 认证

一旦 TLS 建立，HTTP 请求将移动到认证步骤.
这在图中显示为步骤** 1 **.
集群创建脚本或集群管理器配置要运行的 API 服务器
一个或多个认证模块.
验证者在[这里更详细地描述](/docs/admin/authentication/).

验证步骤的输入是整个 HTTP 请求，但通常
只需检查标题和/或客户端证书.

认证模块包括客户端证书，密码和普通令牌，
引导令牌和 JWT 令牌(用于服务帐户).

可以指定多个认证模块，在这种情况下，每个认证模块都按顺序进行尝试，
直到其中一个成功.

在 GCE 上，客户端证书，密码，普通令牌和 JWT 令牌均已启用.

如果请求无法通过身份认证，则会以 HTTP 状态码 401 拒绝.
否则，用户将被认证为特定的 `username` ，且用户名
可根据他们的意愿用于后续步骤. 一些认证器
还提供用户的组成员资格，而其他认证者
不要.

虽然 Kubernetes 使用“用户名"进行访问控制决策和请求记录，
但它没有“user"对象，也不存储用户名或其他有关用户的信息
在其对象存储中.

## 授权

在请求被认证为来自特定用户之后，请求必须被授权. 这在图中显示为步骤**2**.

请求必须包含请求者的用户名，请求的操作以及受该操作影响的对象. 如果现有策略声明用户具有完成请求的操作权限，则该请求将被授权.

例如，如果 Bob 具有以下策略，那么他只能在命名空间`projectCaribou`中读取pod:

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
如果 Bob 发出以下请求，则请求被授权，因为他被允许读取`projectCaribou`命名空间中的对象:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
如果 Bob 向`projectCaribou`命名空间中的对象发出请求(`create`或`update`)，那么他的授权被拒绝. 如果 Bob 请求在不同的​​命名空间读取(`get`)对象，如`projectFish`，那么他的授权被拒绝.

Kubernetes 授权要求您使用常见的 REST 属性与现有的全组织范围或云提供商范围的访问控制系统进行交互. 使用 REST 格式很重要，因为这些控制系统可能与 Kubernetes API 之外的其他 API 进行交互.

Kubernetes 支持多种授权模块，如 ABAC 模式，RBAC 模式和 Webhook 模式. 当管理员创建集群时，他们配置了应在 API 服务器中使用的授权模块. 如果配置了多个授权模块，则 Kubernetes 会检查每个模块，如果有任何模块授权请求，则该请求可以继续. 如果所有模块都拒绝该请求，则该请求被拒绝(HTTP 状态代码 403).

要了解有关 Kubernetes 授权的更多信息，包括有关使用支持的授权模块创建策略的详细信息，请参阅[授权概述](/docs/admin/authorization).


## 准入控制

准入控制模块是可以修改或拒绝请求的软件模块.
除了授权模块可接受的属性外，准入
控制模块可以访问正在创建或更新的对象的内容.
它们对创建，删除，更新或连接(代理)的对象采取行动，但不会读取.

可以配置多个准入控制器. 每个都按顺序调用.

这在图中显示为步骤**3**.

不同于认证和授权模块，如果有任何准入控制器模块
拒绝，则请求立即被拒绝.

除了拒绝对象外，准入控制器还可以设置复杂的默认值
领域.

这里介绍了可用的准入控制[模块](/docs/admin/admission-controllers/).

一旦一个请求通过了所有的准入控制器，它将使用验证程序验证
相应的 API 对象，然后写入对象存储(如步骤**4**所示).


## API服务器端口和IP

以前的讨论适用于发送到 API 服务器的安全端口的请求
(典型情况).  API 服务器实际上可以在两个端口上服务:

默认情况下，Kubernetes API 服务器在 2 个端口上提供 HTTP:

1. `Localhost Port`:

     - 用于测试和引导，以及主节点的其他组件
    (调度器，控制器管理器)与 API 的通话
     - 没有 TLS
     - 默认为 8080 端口，用`--insecure-port`标志更改.
     - 默认 IP 为 localhost，使用`--insecure-bind-address`标志更改.
     - 请求**绕过**认证和授权模块.
     - 准入控制模块处理的请求.
     - 受到需要主机访问的保护

2. `Secure Port`:

     - 尽可能使用
       - 使用 TLS. 使用`--tls-cert-file`设置证书，用`--tls-private-key-file`标志设置密钥.
     - 默认为端口 6443，用`--secure-port`标志更改.
     - 默认 IP 是第一个非本地主机网络接口，用`--bind-address`标志改变.
     - 由认证和授权模块处理的请求.
     - 准入控制模块处理的请求.
     - 认证和授权模块运行.

当集群由`kube-up.sh`创建时，在 Google Compute Engine(GCE)上，
并且在其他几个云提供商上，API 服务器在端口 443 上服务
GCE 在项目上配置了防火墙规则，以允许外部 HTTPS
访问 API. 其他集群设置方法有所不同.
