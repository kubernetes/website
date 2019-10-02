---
approvers:
- erictune
- lavalamp
title: Kubernetes API访问控制
---

用户通过 `kubectl`、客户端库或者通过发送REST请求[访问API](/docs/user-guide/accessing-the-cluster)。 用户（自然人）和[Kubernetes服务账户](/docs/tasks/configure-pod-container/configure-service-account/) 都可以被授权进行API访问。
请求到达API服务器后会经过几个阶段，具体说明如图：

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## 传输层安全

在典型的Kubernetes集群中，API通过443端口提供服务。
API服务器会提供一份证书。 该证书一般是自签名的， 所以用户机器上的 `$USER/.kube/config` 目录通常
包含该API服务器证书的根证书，用来代替系统默认根证书。 当用户使用 `kube-up.sh` 创建集群时，该证书通常会被自动写入用户的`$USER/.kube/config`。  如果集群中存在多个用户，则创建者需要与其他用户共享证书。

## 认证

一旦 TLS 连接建立，HTTP请求就进入到了认证的步骤。即图中的步骤 **1** 。
集群创建脚本或集群管理员会为API服务器配置一个或多个认证模块。
更具体的认证相关的描述详见 [这里](/docs/admin/authentication/)。

认证步骤的输入是整个HTTP请求，但这里通常只是检查请求头和/或客户端证书。

认证模块支持客户端证书，密码和Plain Tokens，
Bootstrap Tokens，以及JWT Tokens (用于服务账户)。

（管理员）可以同时设置多种认证模块，在设置了多个认证模块的情况下，每个模块会依次尝试认证，
直到其中一个认证成功。

在 GCE 平台中，客户端证书，密码和Plain Tokens，Bootstrap Tokens，以及JWT Tokens同时被启用。

如果请求认证失败，则请求被拒绝，返回401状态码。
如果认证成功，则被认证为具体的 `username`，该用户名可供随后的步骤中使用。一些认证模块还提供了用户的组成员关系，另一些则没有。

尽管Kubernetes使用 "用户名" 来进行访问控制和请求记录，但它实际上并没有 `user` 对象，也不存储用户名称或其他相关信息。

## 授权

当请求被认证为来自某个特定的用户后，该请求需要被授权。 即图中的步骤 **2** 。

请求须包含请求者的用户名，请求动作，以及该动作影响的对象。 如果存在相应策略，声明该用户具有进行相应操作的权限，则该请求会被授权。

例如，如果Bob有如下策略，那么他只能够读取`projectCaribou`命名空间下的pod资源：

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
如果Bob发起以下请求，那么请求能够通过授权，因为Bob被允许访问 `projectCaribou` 命名空间下的对象：

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
如果Bob对 `projectCaribou` 命名空间下的对象发起一个写（`create` 或者 `update`）请求，那么它的授权会被拒绝。 如果Bob请求读取(`get`) 其他命名空间，例如 `projectFish`下的对象，其授权也会被拒绝。 

Kubernetes的授权要求使用通用的REST属性与现有的组织或云服务提供商的访问控制系统进行交互。 采用REST格式是必要的，因为除Kubernetes外，这些访问控制系统还可能与其他的API进行交互。

Kubernetes 支持多种授权模块，例如ABAC模式，RBAC模式和 Webhook模式。 管理员创建集群时，会配置API服务器应用的授权模块。 如果多种授权模式同时被启用，Kubernetes将检查所有模块，如果其中一种通过授权，则请求授权通过。 如果所有的模块全部拒绝，则请求被拒绝(HTTP状态码403)。

要了解更多的Kubernetes授权相关信息，包括使用授权模块创建策略的具体说明等，可参考[授权概述](/docs/admin/authorization)。


## 准入控制

准入控制模块是能够修改或拒绝请求的软件模块。
作为授权模块的补充，准入控制模块会访问被创建或更新的对象的内容。
它们作用于对象的创建，删除，更新和连接 (proxy)阶段，但不包括对象的读取。

可以同时配置多个准入控制器，它们会按顺序依次被调用。

即图中的步骤 **3** 。

与认证和授权模块不同的是，如果任一个准入控制器拒绝请求，那么整个请求会立即被拒绝。

除了拒绝请求外，准入控制器还可以为对象设置复杂的默认值。

可用的准入控制模块描述 [如下](/docs/admin/admission-controllers/)。

一旦请求通过所有准入控制器，将使用对应API对象的验证流程对其进行验证，然后写入对象存储 (如步骤 **4**)。


## API的端口和IP

上述讨论适用于发送请求到API服务器的安全端口(典型情况)。  
实际上API服务器可以通过两个端口提供服务：

默认情况下，API服务器在2个端口上提供HTTP服务：

  1. `Localhost Port`:

          - 用于测试和启动，以及管理节点的其他组件
            (scheduler, controller-manager)与API的交互
          - 没有TLS
          - 默认值为8080，可以通过 `--insecure-port` 标记来修改。
          - 默认的IP地址为localhost， 可以通过 `--insecure-bind-address`标记来修改。
          - 请求会 **绕过** 认证和鉴权模块。
          - 请求会被准入控制模块处理。
          - 其访问需要主机访问的权限。

  2. `Secure Port`:

          - 尽可能使用该端口访问
          - 应用 TLS。 可以通过 `--tls-cert-file` 设置证书， 通过 `--tls-private-key-file` 设置私钥。
          - 默认值为6443，可以通过 `--secure-port` 标记来修改。
          - 默认IP是首个非本地的网络接口地址，可以通过 `--bind-address` 标记来修改。
          - 请求会经过认证和鉴权模块处理。
          - 请求会被准入控制模块处理。
          - 要求认证和授权模块正常运行。

通过 `kube-up.sh`创建集群时， 对 Google Compute Engine (GCE)
和一些其他的云供应商来说， API通过443端口提供服务。 对
GCE而言，项目上配置了防火墙规则，允许外部的HTTPS请求访问API，其他（厂商的）集群设置方法各不相同。
