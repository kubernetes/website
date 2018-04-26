---
approvers:
- bgrant0607
- erictune
- lavalamp
title: Kubernetes API的访问控制
---
<!--
title: Controlling Access to the Kubernetes APIs
-->

<!--
Users [access the API](/docs/user-guide/accessing-the-cluster) using `kubectl`,
client libraries, or by making REST requests.  Both human users and
[Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/) can be
authorized for API access.
When a request reaches the API, it goes through several stages, illustrated in the
following diagram:
-->
用户可以通过kubectl命令, 客户端库， 或者发送REST请求来[访问API](/docs/user-guide/accessing-the-cluster) 。Kubernetes用户和[服务账号](/docs/tasks/configure-pod-container/configure-service-account/)都可以用于API访问时的授权。 当请求到达API时， 它会经历几个阶段，如下图所示：
![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)
<!--
## Transport Security

In a typical Kubernetes cluster, the API served on port 443.  A TLS connection is
established.  The API server presents a certificate.  This certificate is
often self-signed, so `$USER/.kube/config` on the user's machine typically
contains the root certificate for the API server's certificate, which when specified
is used in place of the system default root certificates.  This certificate is typically
automatically written into your `$USER/.kube/config` when you create a cluster yourself
using `kube-up.sh`.  If the cluster has multiple users, then the creator needs to share
the certificate with other users.
-->
##  传输安全
在一个典型的 Kubernetes集群里， API 的侦听端口是443， TLS连接会被建立。 API server会提供一个证书。 这个证书是自签名的， 因此在`$USER/.kube/config`路径下会包含API server证书的根证书，你可以指定这个证书用来替换系统默认的根证书。 当你使用`kube-up.sh`来创建集群时，这个证书会自动写入到`$USER/.kube/config`目录下。 如果集群有多个用户， 那么集群创建者需要和其它用户共享这个证书。
<!--
## Authentication

Once TLS is established, the HTTP request moves to the Authentication step.
This is shown as step **1** in the diagram.
The cluster creation script or cluster admin configures the API server to run
one or more Authenticator Modules.
Authenticators are described in more detail [here](/docs/admin/authentication/).
The input to the authentication step is the entire HTTP request, however, it typically
just examines the headers and/or client certificate.

Authentication modules include Client Certificates, Password, and Plain Tokens,
Bootstrap Tokens, and JWT Tokens (used for service accounts).

Multiple authentication modules can be specified, in which case each one is tried in sequence,
until one of them succeeds.

On GCE, Client Certificates, Password, Plain Tokens, and JWT Tokens are all enabled.

If the request cannot be authenticated, it is rejected with HTTP status code 401.
Otherwise, the user is authenticated as a specific `username`, and the user name
is available to subsequent steps to use in their decisions.  Some authenticators
also provide the group memberships of the user, while other authenticators
do not.

While Kubernetes uses "usernames" for access control decisions and in request logging,
it does not have a `user` object nor does it store usernames or other information about
users in its object store.
-->

## 认证
 TLS一旦建立连接， HTTP请求就会转到认证这一步， 即图示中标注的步骤1.
集群创建脚本或者集群的管理者通过配置API server可以加载一个或多个认证模块。 认证模块的更多描述信息参考[这里](/docs/admin/authentication/)。
认证这一步骤的输入就是整个HTTP的请求， 然而，整个认证步骤也是只是检查了HTTP的header信息，和/或者 客户端证书。
认证模块包括客户端证书， 密码，明文token， 初始token， 和JWT token（用于服务账号）。
可以同时指定多个认证模块，对于这种情况， 会按照指定的顺序一个个尝试认证，直到有一个认证成功为止。
在GCE上，  客户端证书， 密码，明文token， 初始token， 和JWT token这几个认证模块都是打开的。
如果请求不能被认证成功， 那么它会被拒绝，并收到401的状态码。
如果认证成功， 用户会被指定一个用户名做认证， 这个用户名会被下一个步骤用于下一轮判断。有 一些验证模块还会为该用户提供组成员资格，有些则不会 。
当Kubernetes将“用户名”用于准入控制的决定和请求日志的记录过程，在它的对象存储中就不会出现`user`对象， 也不会存储有关用户的用户名和其它信息。
<!--
## Authorization

After the request is authenticated as coming from a specific user, the request must be authorized. This is shown as step **2** in the diagram.

A request must include the username of the requester, the requested action, and the object affected by the action. The request is authorized if an existing policy declares that the user has permissions to complete the requested action.
For example, if Bob has the policy below, then he can read pods only in the namespace `projectCaribou`:

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
If Bob makes the following request, the request is authorized because he is allowed to read objects in the `projectCaribou` namespace:

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
If Bob makes a request to write (`create` or `update`) to the objects in the `projectCaribou` namespace, his authorization is denied. If Bob makes a request to read (`get`) objects in a different namespace such as `projectFish`, then his authorization is denied.

Kubernetes authorization requires that you use common REST attributes to interact with existing organization-wide or cloud-provider-wide access control systems. It is important to use REST formatting because these control systems might interact with other APIs besides the Kubernetes API.

Kubernetes supports multiple authorization modules, such as ABAC mode, RBAC Mode, and Webhook mode. When an administrator creates a cluster, they configured the authorization modules that should be used in the API server. If more than one authorization modules are configured, Kubernetes checks each module, and if any module authorizes the request, then the request can proceed. If all of the modules deny the request, then the request is denied (HTTP status code 403).

To learn more about Kubernetes authorization, including details about creating policies using the supported authorization modules, see [Authorization Overview](/docs/admin/authorization).
-->

## 授权
当一个请求被验证来自指定用户时，  这个请求紧接着必须被授权， 即如图示中的步骤**2**所示.
一个请求必须包含请求者的用户名， 请求的动作， 影响动作的对象。 如果有存在的策略声明这个用户有权限完成这个动作，那么该请求就会被授权。
举个例子， 如果Bob用户有这样一条策略， 那么他可以从命名空间 `projectCaribou`中读取pod信息:
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
如果Bob发送这样一个请求， 他可以被成功授权， 因为他读取命名空间 `projectCaribou`里的对象信息的动作是被允许的：
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
如果Bob发送往 `projectCaribou`命名空间写（`create` 或者 `update`）对象信息的请求， 那么他会被拒绝授权。 如果发送从一个不同的命名空间， 比如`projectFish`  读取(`get`)对象信息的请求，那么他的授权也会被拒绝。 Kubernetes的授权要求你和已存在的组织范畴或者云供应商范畴的访问控制系统进行交互时， 要使用通用的REST属性。使用REST的格式是非常重要的， 因为这些控制系统也可能会和包括Kubernetes API在内的其它API进行交互。
Kubernetes支持多个授权模块， 比如ABAC模式， RBAC模式， Webhook模式。
当一个管理员创建了集群， 他们会配置API server会启用哪些授权模块。 如果配置了多于1个的授权模块， Kubernetes会检查每个模块， 如果其中任何模块授权的请求， 请求会被处理， 如果所有的模块都拒绝了请求， 那么请求会被拒绝掉（返回403状态码）。
要了解更多关于Kubernetes授权的信息， 包括使用支持的授权模块来创建策略的细节信息，可以参见 [授权概览](/docs/admin/authorization)。

<!--
## Admission Control

Admission Control Modules are software modules that can modify or reject requests.
In addition to the attributes available to Authorization Modules, Admission
Control Modules can access the contents of the object that is being created or updated.
They act on objects being created, deleted, updated or connected (proxy), but not reads.

Multiple admission controllers can be configured.  Each is called in order.

This is shown as step **3** in the diagram.

Unlike Authentication and Authorization Modules, if any admission controller module
rejects, then the request is immediately rejected.

In addition to rejecting objects, admission controllers can also set complex defaults for
fields.

The available Admission Control Modules are described [here](/docs/admin/admission-controllers/).

Once a request passes all admission controllers, it is validated using the validation routines
for the corresponding API object, and then written to the object store (shown as step **4**).
-->

## 准入控制
准入控制模块是可以修改或者拒绝请求的模块。
作为授权模块的补充， 准入控制可以访问一个正在被创建或更新的对象的内容，
它们在对象创建， 删除，更新， 连接（代理）期间起作用，在读取对象时它们不起作用。
可以配置多个准入控制器， 每个准入控制器会按照顺序被调用。
如图示中的步骤**3**所示。
跟认证和授权模块不同的是，如果任何一个准入控制模块拒绝了请求， 那么请求就会立马被拒绝掉。
除了拒绝对象之外， 准入控制器还可以为字段设置复杂的默认值。

可用的准入控制模块的详情请参考[这里](/docs/admin/admission-controllers/)。

一但一个请求通过了所有的准则控制器的批准， 那么这个请求会被对应的API对象验证程序证实为有效请求， 然后会被写入到对象存储里（如图中步骤 **4**所示）
<!--
## API Server Ports and IPs

The previous discussion applies to requests sent to the secure port of the API server
(the typical case).  The API server can actually serve on 2 ports:

By default the Kubernetes API server serves HTTP on 2 ports:

  1. `Localhost Port`:

          - is intended for testing and bootstrap, and for other components of the master node
            (scheduler, controller-manager) to talk to the API
          - no TLS
          - default is port 8080, change with `--insecure-port` flag.
          - defaults IP is localhost, change with `--insecure-bind-address` flag.
          - request **bypasses** authentication and authorization modules.
          - request handled by admission control module(s).
          - protected by need to have host access

  2. `Secure Port`:

          - use whenever possible
          - uses TLS.  Set cert with `--tls-cert-file` and key with `--tls-private-key-file` flag.
          - default is port 6443, change with `--secure-port` flag.
          - default IP is first non-localhost network interface, change with `--bind-address` flag.
          - request handled by authentication and authorization modules.
          - request handled by admission control module(s).
          - authentication and authorisation modules run.

When the cluster is created by `kube-up.sh`, on Google Compute Engine (GCE),
and on several other cloud providers, the API server serves on port 443.  On
GCE, a firewall rule is configured on the project to allow external HTTPS
access to the API. Other cluster setup methods vary.
-->

##  API Server 的端口和IP
之前的讨论的都是请求发往API Server的安全端口的情况（这个也是最典型的情况）。 事实上， API Server可以侦听两个端口：
默认情况下， API Server启动时侦听两个端口：
  1. `本地端口`:

          - 用于测试或者启动集群， 还有master 节点的其它组件跟API的交互
          - 没有TLS
          - 默认的侦听端口是8080，可以通过参数 `--insecure-port` 指定别的端口
          - 默认绑定的IP是localhost， 可以通过参数 `--insecure-bind-address`指定别的地址
          - 请求会绕过认证和授权模块
          - 请求会经过准入控制模块处理
          - 通过对主机进行访问控制保护接口

  2. `安全端口`:

          - 按需启用
          - 使用 TLS.  通过 `--tls-cert-file`参数指定证书路径，  `--tls-private-key-file` 参数指定证书的私钥
          - 默认侦听6443端口， 可以通过`--secure-port`指定别的端口
          - 默认IP绑定在第一个非localhost的网络接口， 可以通过`--bind-address`指定IP地址
          - 请求会经过认证和授权模块的处理
          - 请求会经过准入控制模块的处理
          - 认证和授权模块会运行
如果在谷歌计算引擎平台(GCE)或者其他一些云提供商上用`kube-up.sh`创建集群的话， API Server会侦听443端口。 在GCE上， 默认会开放防火墙策略允许从外部通过HTTPS访问集群的API. 其它云供应商的策略不尽相同。
