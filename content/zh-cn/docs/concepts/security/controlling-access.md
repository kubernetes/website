---
title: Kubernetes API 访问控制
content_type: concept
weight: 50
---
<!--
reviewers:
- erictune
- lavalamp
title: Controlling Access to the Kubernetes API
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
This page provides an overview of controlling access to the Kubernetes API.
-->
本页面概述了对 Kubernetes API 的访问控制。

<!-- body -->
<!--
Users access the [Kubernetes API](/docs/concepts/overview/kubernetes-api/) using `kubectl`,
client libraries, or by making REST requests.  Both human users and
[Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/) can be
authorized for API access.
When a request reaches the API, it goes through several stages, illustrated in the
following diagram:
-->
用户使用 `kubectl`、客户端库或构造 REST 请求来访问 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)。
人类用户和 [Kubernetes 服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)都可以被鉴权访问 API。
当请求到达 API 时，它会经历多个阶段，如下图所示：

![Kubernetes API 请求处理步骤示意图](/zh-cn/docs/images/access-control-overview.svg)

<!--
## Transport security
-->
## 传输安全 {#transport-security}

<!--
By default, the Kubernetes API server listens on port 6443 on the first non-localhost
network interface, protected by TLS. In a typical production Kubernetes cluster, the
API serves on port 443. The port can be changed with the `--secure-port`, and the
listening IP address with the `--bind-address` flag.

The API server presents a certificate. This certificate may be signed using
a private certificate authority (CA), or based on a public key infrastructure linked
to a generally recognized CA. The certificate and corresponding private key can be set
by using the `--tls-cert-file` and `--tls-private-key-file` flags.
-->
默认情况下，Kubernetes API 服务器在第一个非 localhost 网络接口的 6443 端口上进行监听，
受 TLS 保护。在一个典型的 Kubernetes 生产集群中，API 使用 443 端口。
该端口可以通过 `--secure-port` 进行变更，监听 IP 地址可以通过 `--bind-address` 标志进行变更。

API 服务器出示证书。该证书可以使用私有证书颁发机构（CA）签名，也可以基于链接到公认的 CA 的公钥基础架构签名。
该证书和相应的私钥可以通过使用 `--tls-cert-file` 和 `--tls-private-key-file` 标志进行设置。

<!--
If your cluster uses a private certificate authority, you need a copy of that CA
certificate configured into your `~/.kube/config` on the client, so that you can
trust the connection and be confident it was not intercepted.

Your client can present a TLS client certificate at this stage.
-->
如果你的集群使用私有证书颁发机构，你需要在客户端的 `~/.kube/config` 文件中提供该 CA 证书的副本，
以便你可以信任该连接并确认该连接没有被拦截。

你的客户端可以在此阶段出示 TLS 客户端证书。

<!--
## Authentication

Once TLS is established, the HTTP request moves to the Authentication step.
This is shown as step **1** in the diagram.
The cluster creation script or cluster admin configures the API server to run
one or more Authenticator modules.
Authenticators are described in more detail in
[Authentication](/docs/reference/access-authn-authz/authentication/).
-->
## 认证 {#authentication}

如上图步骤 **1** 所示，建立 TLS 后， HTTP 请求将进入认证（Authentication）步骤。
集群创建脚本或者集群管理员配置 API 服务器，使之运行一个或多个身份认证组件。
身份认证组件在[认证](/zh-cn/docs/reference/access-authn-authz/authentication/)节中有更详细的描述。

<!--
The input to the authentication step is the entire HTTP request; however, it typically
examines the headers and/or client certificate.

Authentication modules include client certificates, password, and plain tokens,
bootstrap tokens, and JSON Web Tokens (used for service accounts).

Multiple authentication modules can be specified, in which case each one is tried in sequence,
until one of them succeeds.
-->
认证步骤的输入整个 HTTP 请求；但是，通常组件只检查头部或/和客户端证书。

认证模块包含客户端证书、密码、普通令牌、引导令牌和 JSON Web 令牌（JWT，用于服务账号）。

可以指定多个认证模块，在这种情况下，服务器依次尝试每个验证模块，直到其中一个成功。

<!--
If the request cannot be authenticated, it is rejected with HTTP status code 401.
Otherwise, the user is authenticated as a specific `username`, and the user name
is available to subsequent steps to use in their decisions.  Some authenticators
also provide the group memberships of the user, while other authenticators
do not.

While Kubernetes uses usernames for access control decisions and in request logging,
it does not have a `User` object nor does it store usernames or other information about
users in its API.
-->
如果请求认证不通过，服务器将以 HTTP 状态码 401 拒绝该请求。
反之，该用户被认证为特定的 `username`，并且该用户名可用于后续步骤以在其决策中使用。
部分验证器还提供用户的组成员身份，其他则不提供。

<!--
## Authorization

After the request is authenticated as coming from a specific user, the request must
be authorized. This is shown as step **2** in the diagram.

A request must include the username of the requester, the requested action, and
the object affected by the action. The request is authorized if an existing policy
declares that the user has permissions to complete the requested action.

For example, if Bob has the policy below, then he can read pods only in the namespace `projectCaribou`:
-->
## 鉴权 {#authorization}

如上图的步骤 **2** 所示，将请求验证为来自特定的用户后，请求必须被鉴权。

请求必须包含请求者的用户名、请求的行为以及受该操作影响的对象。
如果现有策略声明用户有权完成请求的操作，那么该请求被鉴权通过。

例如，如果 Bob 有以下策略，那么他只能在 `projectCaribou` 名称空间中读取 Pod。

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
<!--
If Bob makes the following request, the request is authorized because he is
allowed to read objects in the `projectCaribou` namespace:
-->
如果 Bob 执行以下请求，那么请求会被鉴权，因为允许他读取 `projectCaribou` 名称空间中的对象。

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

<!--
If Bob makes a request to write (`create` or `update`) to the objects in the
`projectCaribou` namespace, his authorization is denied. If Bob makes a request
to read (`get`) objects in a different namespace such as `projectFish`, then his authorization is denied.

Kubernetes authorization requires that you use common REST attributes to interact
with existing organization-wide or cloud-provider-wide access control systems.
It is important to use REST formatting because these control systems might
interact with other APIs besides the Kubernetes API.
-->
如果 Bob 在 `projectCaribou` 名字空间中请求写（`create` 或 `update`）对象，其鉴权请求将被拒绝。
如果 Bob 在诸如 `projectFish` 这类其它名字空间中请求读取（`get`）对象，其鉴权也会被拒绝。

Kubernetes 鉴权要求使用公共 REST 属性与现有的组织范围或云提供商范围的访问控制系统进行交互。
使用 REST 格式很重要，因为这些控制系统可能会与 Kubernetes API 之外的 API 交互。

<!--
Kubernetes supports multiple authorization modules, such as ABAC mode, RBAC Mode, and Webhook mode.
When an administrator creates a cluster, they configure the authorization modules that should be used in the API server.
If more than one authorization modules are configured, Kubernetes checks each module,
and if any module authorizes the request, then the request can proceed.
If all of the modules deny the request, then the request is denied (HTTP status code 403).

To learn more about Kubernetes authorization, including details about creating
policies using the supported authorization modules, see [Authorization](/docs/reference/access-authn-authz/authorization/).
-->
Kubernetes 支持多种鉴权模块，例如 ABAC 模式、RBAC 模式和 Webhook 模式等。
管理员创建集群时，他们配置应在 API 服务器中使用的鉴权模块。
如果配置了多个鉴权模块，则 Kubernetes 会检查每个模块，任意一个模块鉴权该请求，请求即可继续；
如果所有模块拒绝了该请求，请求将会被拒绝（HTTP 状态码 403）。

要了解更多有关 Kubernetes 鉴权的更多信息，包括有关使用支持鉴权模块创建策略的详细信息，
请参阅[鉴权](/zh-cn/docs/reference/access-authn-authz/authorization/)。

<!--
## Admission control 

Admission Control modules are software modules that can modify or reject requests.
In addition to the attributes available to Authorization modules, Admission
Control modules can access the contents of the object that is being created or modified.

Admission controllers act on requests that create, modify, delete, or connect to (proxy) an object.
Admission controllers do not act on requests that merely read objects.
When multiple admission controllers are configured, they are called in order.
-->
## 准入控制 {#admission-control}

准入控制模块是可以修改或拒绝请求的软件模块。
除鉴权模块可用的属性外，准入控制模块还可以访问正在创建或修改的对象的内容。

准入控制器对创建、修改、删除或（通过代理）连接对象的请求进行操作。
准入控制器不会对仅读取对象的请求起作用。
有多个准入控制器被配置时，服务器将依次调用它们。

<!--
This is shown as step **3** in the diagram.

Unlike Authentication and Authorization modules, if any admission controller module
rejects, then the request is immediately rejected.

In addition to rejecting objects, admission controllers can also set complex defaults for
fields.

The available Admission Control modules are described in [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).

Once a request passes all admission controllers, it is validated using the validation routines
for the corresponding API object, and then written to the object store (shown as step **4**).
-->
这一操作如上图的步骤 **3** 所示。

与身份认证和鉴权模块不同，如果任何准入控制器模块拒绝某请求，则该请求将立即被拒绝。

除了拒绝对象之外，准入控制器还可以为字段设置复杂的默认值。

可用的准入控制模块在[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)中进行了描述。

请求通过所有准入控制器后，将使用检验例程检查对应的 API 对象，然后将其写入对象存储（如步骤 **4** 所示）。

<!--
## Auditing

Kubernetes auditing provides a security-relevant, chronological set of records documenting the sequence of actions in a cluster.
The cluster audits the activities generated by users, by applications that use the Kubernetes API, and by the control plane itself.

For more information, see [Auditing](/docs/tasks/debug/debug-cluster/audit/).
-->
## 审计 {#auditing}

Kubernetes 审计提供了一套与安全相关的、按时间顺序排列的记录，其中记录了集群中的操作序列。
集群对用户、使用 Kubernetes API 的应用程序以及控制平面本身产生的活动进行审计。

更多信息请参考[审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)。

## {{% heading "whatsnext" %}}

<!--
Read more documentation on authentication, authorization and API access control:

- [Authenticating](/docs/reference/access-authn-authz/authentication/)
   - [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
   - [Role Based Access Control](/docs/reference/access-authn-authz/rbac/)
   - [Attribute Based Access Control](/docs/reference/access-authn-authz/abac/)
   - [Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Authorization](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - including [CSR approval](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     and [certificate signing](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Service accounts
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)

You can learn about:
- how Pods can use
  [Secrets](/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  to obtain API credentials.
-->
阅读更多有关身份认证、鉴权和 API 访问控制的文档：

- [认证](/zh-cn/docs/reference/access-authn-authz/authentication/)
  - [使用 Bootstrap 令牌进行身份认证](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
- [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
  - [动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [鉴权](/zh-cn/docs/reference/access-authn-authz/authorization/)
  - [基于角色的访问控制](/zh-cn/docs/reference/access-authn-authz/rbac/)
  - [基于属性的访问控制](/zh-cn/docs/reference/access-authn-authz/abac/)
  - [节点鉴权](/zh-cn/docs/reference/access-authn-authz/node/)
  - [Webhook 鉴权](/zh-cn/docs/reference/access-authn-authz/webhook/)
- [证书签名请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  - 包括 [CSR 认证](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
    和[证书签名](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- 服务账号
  - [开发者指导](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
  - [管理](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)

你可以了解：
- Pod 如何使用
  [Secret](/zh-cn/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  获取 API 凭据。
