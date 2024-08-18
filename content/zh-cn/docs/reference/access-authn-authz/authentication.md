---
title: 用户认证
content_type: concept
weight: 10
---
<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authenticating
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
This page provides an overview of authentication.
-->
本页提供身份认证有关的概述。

<!-- body -->
<!--
## Users in Kubernetes

All Kubernetes clusters have two categories of users: service accounts managed
by Kubernetes, and normal users.

It is assumed that a cluster-independent service manages normal users in the following ways:

- an administrator distributing private keys
- a user store like Keystone or Google Accounts
- a file with a list of usernames and passwords

In this regard, _Kubernetes does not have objects which represent normal user accounts._
Normal users cannot be added to a cluster through an API call.
-->
## Kubernetes 中的用户  {#users-in-kubernetes}

所有 Kubernetes 集群都有两类用户：由 Kubernetes 管理的服务账号和普通用户。

Kubernetes 假定普通用户是由一个与集群无关的服务通过以下方式之一进行管理的：

- 负责分发私钥的管理员
- 类似 Keystone 或者 Google Accounts 这类用户数据库
- 包含用户名和密码列表的文件

有鉴于此，**Kubernetes 并不包含用来代表普通用户账号的对象**。
普通用户的信息无法通过 API 调用添加到集群中。

<!--
Even though a normal user cannot be added via an API call, any user that
presents a valid certificate signed by the cluster's certificate authority
(CA) is considered authenticated. In this configuration, Kubernetes determines
the username from the common name field in the 'subject' of the cert (e.g.,
"/CN=bob"). From there, the role based access control (RBAC) sub-system would
determine whether the user is authorized to perform a specific operation on a
resource. For more details, refer to the normal users topic in
[certificate request](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
for more details about this.
-->
尽管无法通过 API 调用来添加普通用户，
Kubernetes 仍然认为能够提供由集群的证书机构签名的合法证书的用户是通过身份认证的用户。
基于这样的配置，Kubernetes 使用证书中的 'subject' 的通用名称（Common Name）字段
（例如，"/CN=bob"）来确定用户名。
接下来，基于角色访问控制（RBAC）子系统会确定用户是否有权针对某资源执行特定的操作。
进一步的细节可参阅[证书请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
下普通用户主题。

<!--
In contrast, service accounts are users managed by the Kubernetes API. They are
bound to specific namespaces, and created automatically by the API server or
manually through API calls. Service accounts are tied to a set of credentials
stored as `Secrets`, which are mounted into pods allowing in-cluster processes
to talk to the Kubernetes API.

API requests are tied to either a normal user or a service account, or are treated
as [anonymous requests](#anonymous-requests). This means every process inside or outside the cluster, from
a human user typing `kubectl` on a workstation, to `kubelets` on nodes, to members
of the control plane, must authenticate when making requests to the API server,
or be treated as an anonymous user.
-->
与此不同，服务账号是 Kubernetes API 所管理的用户。它们被绑定到特定的名字空间，
或者由 API 服务器自动创建，或者通过 API 调用创建。服务账号与一组以 Secret
保存的凭据相关，这些凭据会被挂载到 Pod 中，从而允许集群内的进程访问 Kubernetes API。

API 请求则或者与某普通用户相关联，或者与某服务账号相关联，
亦或者被视作[匿名请求](#anonymous-requests)。这意味着集群内外的每个进程在向 API
服务器发起请求时都必须通过身份认证，否则会被视作匿名用户。这里的进程可以是在某工作站上输入
`kubectl` 命令的操作人员，也可以是节点上的 `kubelet` 组件，还可以是控制面的成员。

<!--
## Authentication strategies

Kubernetes uses client certificates, bearer tokens, or an authenticating proxy to
authenticate API requests through authentication plugins. As HTTP requests are
made to the API server, plugins attempt to associate the following attributes
with the request:
-->
## 身份认证策略  {#authentication-strategies}

Kubernetes 通过身份认证插件利用客户端证书、持有者令牌（Bearer Token）或身份认证代理（Proxy）
来认证 API 请求的身份。HTTP 请求发给 API 服务器时，插件会将以下属性关联到请求本身：

<!--
* Username: a string which identifies the end user. Common values might be `kube-admin` or `jane@example.com`.
* UID: a string which identifies the end user and attempts to be more consistent and unique than username.
* Groups: a set of strings, each of which indicates the user's membership in a named logical collection of users.
  Common values might be `system:masters` or `devops-team`.
* Extra fields: a map of strings to list of strings which holds additional information authorizers may find useful.
-->
* 用户名：用来辩识最终用户的字符串。常见的值可以是 `kube-admin` 或 `jane@example.com`。
* 用户 ID：用来辩识最终用户的字符串，旨在比用户名有更好的一致性和唯一性。
* 用户组：取值为一组字符串，其中各个字符串用来标明用户是某个命名的用户逻辑集合的成员。
  常见的值可能是 `system:masters` 或者 `devops-team` 等。
* 附加字段：一组额外的键-值映射，键是字符串，值是一组字符串；
  用来保存一些鉴权组件可能觉得有用的额外信息。

<!--
All values are opaque to the authentication system and only hold significance
when interpreted by an [authorizer](/docs/reference/access-authn-authz/authorization/).

You can enable multiple authentication methods at once. You should usually use at least two methods:

- service account tokens for service accounts
- at least one other method for user authentication.
-->
所有（属性）值对于身份认证系统而言都是不透明的，
只有被[鉴权组件](/zh-cn/docs/reference/access-authn-authz/authorization/)解释过之后才有意义。

你可以同时启用多种身份认证方法，并且你通常会至少使用两种方法：

- 针对服务账号使用服务账号令牌
- 至少另外一种方法对用户的身份进行认证

<!--
When multiple authenticator modules are enabled, the first module
to successfully authenticate the request short-circuits evaluation.
The API server does not guarantee the order authenticators run in.

The `system:authenticated` group is included in the list of groups for all authenticated users.

Integrations with other authentication protocols (LDAP, SAML, Kerberos, alternate x509 schemes, etc)
can be accomplished using an [authenticating proxy](#authenticating-proxy) or the
[authentication webhook](#webhook-token-authentication).
-->
当集群中启用了多个身份认证模块时，第一个成功地对请求完成身份认证的模块会直接做出评估决定。
API 服务器并不保证身份认证模块的运行顺序。

对于所有通过身份认证的用户，`system:authenticated` 组都会被添加到其组列表中。

与其它身份认证协议（LDAP、SAML、Kerberos、X509 的替代模式等等）
都可以通过使用一个[身份认证代理](#authenticating-proxy)或[身份认证 Webhoook](#webhook-token-authentication)
来实现。

<!--
### X509 Client certificates

Client certificate authentication is enabled by passing the `--client-ca-file=SOMEFILE`
option to API server. The referenced file must contain one or more certificate authorities
to use to validate client certificates presented to the API server. If a client certificate
is presented and verified, the common name of the subject is used as the user name for the
request. As of Kubernetes 1.4, client certificates can also indicate a user's group memberships
using the certificate's organization fields. To include multiple group memberships for a user,
include multiple organization fields in the certificate.

For example, using the `openssl` command line tool to generate a certificate signing request:
-->
### X509 客户证书   {#x509-client-certs}

通过给 API 服务器传递 `--client-ca-file=SOMEFILE` 选项，就可以启动客户端证书身份认证。
所引用的文件必须包含一个或者多个证书机构，用来验证向 API 服务器提供的客户端证书。
如果提供了客户端证书并且证书被验证通过，则 subject 中的公共名称（Common Name）
就被作为请求的用户名。
自 Kubernetes 1.4 开始，客户端证书还可以通过证书的 organization 字段标明用户的组成员信息。
要包含用户的多个组成员信息，可以在证书中包含多个 organization 字段。

例如，使用 `openssl` 命令行工具生成一个证书签名请求：

```bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

<!--
This would create a CSR for the username "jbeda", belonging to two groups, "app1" and "app2".

See [Managing Certificates](/docs/tasks/administer-cluster/certificates/) for how to generate a client cert.
-->
此命令将使用用户名 `jbeda` 生成一个证书签名请求（CSR），且该用户属于 "app1" 和
"app2" 两个用户组。

参阅[管理证书](/zh-cn/docs/tasks/administer-cluster/certificates/)了解如何生成客户端证书。

<!--
### Static token file

The API server reads bearer tokens from a file when given the `--token-auth-file=SOMEFILE` option
on the command line.  Currently, tokens last indefinitely, and the token list cannot be
changed without restarting the API server.

The token file is a csv file with a minimum of 3 columns: token, user name, user uid,
followed by optional group names.
-->
### 静态令牌文件  {#static-token-file}

当 API 服务器的命令行设置了 `--token-auth-file=SOMEFILE` 选项时，会从文件中读取持有者令牌。
目前，令牌会长期有效，并且在不重启 API 服务器的情况下无法更改令牌列表。

令牌文件是一个 CSV 文件，包含至少 3 个列：令牌、用户名和用户的 UID。
其余列被视为可选的组名。

{{< note >}}
<!--
If you have more than one group, the column must be double quoted e.g.
-->
如果要设置的组名不止一个，则对应的列必须用双引号括起来，例如：

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

<!--
#### Putting a bearer token in a request

When using bearer token authentication from an http client, the API
server expects an `Authorization` header with a value of `Bearer
<token>`. The bearer token must be a character sequence that can be
put in an HTTP header value using no more than the encoding and
quoting facilities of HTTP. For example: if the bearer token is
`31ada4fd-adec-460c-809a-9e56ceb75269` then it would appear in an HTTP
header as shown below.
-->
#### 在请求中放入持有者令牌   {#putting-a-bearer-token-in-a-request}

当使用持有者令牌来对某 HTTP 客户端执行身份认证时，API 服务器希望看到一个名为
`Authorization` 的 HTTP 头，其值格式为 `Bearer <token>`。
持有者令牌必须是一个可以放入 HTTP 头部值字段的字符序列，至多可使用 HTTP 的编码和引用机制。
例如：如果持有者令牌为 `31ada4fd-adec-460c-809a-9e56ceb75269`，则其出现在 HTTP 头部时如下所示：

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

<!--
### Bootstrap tokens
-->
### 启动引导令牌    {#bootstrap-tokens}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
To allow for streamlined bootstrapping for new clusters, Kubernetes includes a
dynamically-managed Bearer token type called a *Bootstrap Token*. These tokens
are stored as Secrets in the `kube-system` namespace, where they can be
dynamically managed and created. Controller Manager contains a TokenCleaner
controller that deletes bootstrap tokens as they expire.
-->
为了支持平滑地启动引导新的集群，Kubernetes 包含了一种动态管理的持有者令牌类型，
称作 **启动引导令牌（Bootstrap Token）**。
这些令牌以 Secret 的形式保存在 `kube-system` 名字空间中，可以被动态管理和创建。
控制器管理器包含的 `TokenCleaner` 控制器能够在启动引导令牌过期时将其删除。

<!--
The tokens are of the form `[a-z0-9]{6}.[a-z0-9]{16}`. The first component is a
Token ID and the second component is the Token Secret. You specify the token
in an HTTP header as follows:
-->
这些令牌的格式为 `[a-z0-9]{6}.[a-z0-9]{16}`。第一个部分是令牌的 ID；
第二个部分是令牌的 Secret。你可以用如下所示的方式来在 HTTP 头部设置令牌：

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

<!--
You must enable the Bootstrap Token Authenticator with the
`--enable-bootstrap-token-auth` flag on the API Server. You must enable
the TokenCleaner controller via the `--controllers` flag on the Controller
Manager. This is done with something like `--controllers=*,tokencleaner`.
`kubeadm` will do this for you if you are using it to bootstrap a cluster.
-->
你必须在 API 服务器上设置 `--enable-bootstrap-token-auth` 标志来启用基于启动引导令牌的身份认证组件。
你必须通过控制器管理器的 `--controllers` 标志来启用 TokenCleaner 控制器；
这可以通过类似 `--controllers=*,tokencleaner` 这种设置来做到。
如果你使用 `kubeadm` 来启动引导新的集群，该工具会帮你完成这些设置。

<!--
The authenticator authenticates as `system:bootstrap:<Token ID>`. It is
included in the `system:bootstrappers` group. The naming and groups are
intentionally limited to discourage users from using these tokens past
bootstrapping. The user names and group can be used (and are used by `kubeadm`)
to craft the appropriate authorization policies to support bootstrapping a
cluster.
-->
身份认证组件的认证结果为 `system:bootstrap:<令牌 ID>`，该用户属于
`system:bootstrappers` 用户组。
这里的用户名和组设置都是有意设计成这样，其目的是阻止用户在启动引导集群之后继续使用这些令牌。
这里的用户名和组名可以用来（并且已经被 `kubeadm` 用来）构造合适的鉴权策略，
以完成启动引导新集群的工作。

<!--
Please see [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) for in depth
documentation on the Bootstrap Token authenticator and controllers along with
how to manage these tokens with `kubeadm`.
-->
请参阅[启动引导令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)，
以了解关于启动引导令牌身份认证组件与控制器的更深入的信息，以及如何使用
`kubeadm` 来管理这些令牌。

<!--
### Service account tokens

A service account is an automatically enabled authenticator that uses signed
bearer tokens to verify requests. The plugin takes two optional flags:

* `--service-account-key-file` File containing PEM-encoded x509 RSA or ECDSA
  private or public keys, used to verify ServiceAccount tokens. The specified file
  can contain multiple keys, and the flag can be specified multiple times with
  different files. If unspecified, --tls-private-key-file is used.
* `--service-account-lookup` If enabled, tokens which are deleted from the API will be revoked.
-->
### 服务账号令牌   {#service-account-tokens}

服务账号（Service Account）是一种自动被启用的用户认证机制，使用经过签名的持有者令牌来验证请求。
该插件可接受两个可选参数：

* `--service-account-key-file` 文件包含 PEM 编码的 x509 RSA 或 ECDSA 私钥或公钥，
  用于验证 ServiceAccount 令牌。这样指定的文件可以包含多个密钥，
  并且可以使用不同的文件多次指定此参数。若未指定，则使用 --tls-private-key-file 参数。
* `--service-account-lookup` 如果启用，则从 API 删除的令牌会被回收。

<!--
Service accounts are usually created automatically by the API server and
associated with pods running in the cluster through the `ServiceAccount`
[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). Bearer tokens are
mounted into pods at well-known locations, and allow in-cluster processes to
talk to the API server. Accounts may be explicitly associated with pods using the
`serviceAccountName` field of a `PodSpec`.
-->
服务账号通常由 API 服务器自动创建并通过 `ServiceAccount`
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)关联到集群中运行的 Pod 上。
持有者令牌会挂载到 Pod 中可预知的位置，允许集群内进程与 API 服务器通信。
服务账号也可以使用 Pod 规约的 `serviceAccountName` 字段显式地关联到 Pod 上。

{{< note >}}
<!--
`serviceAccountName` is usually omitted because this is done automatically.
-->
`serviceAccountName` 通常会被忽略，因为关联关系是自动建立的。
{{< /note >}}

<!--
# this apiVersion is relevant as of Kubernetes 1.9
-->
```yaml
apiVersion: apps/v1 # 此 apiVersion 从 Kubernetes 1.9 开始可用
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```

<!--
Service account bearer tokens are perfectly valid to use outside the cluster and
can be used to create identities for long standing jobs that wish to talk to the
Kubernetes API. To manually create a service account, use the `kubectl create
serviceaccount (NAME)` command. This creates a service account in the current
namespace.
-->
在集群外部使用服务账号持有者令牌也是完全合法的，且可用来为长时间运行的、需要与 Kubernetes
API 服务器通信的任务创建标识。要手动创建服务账号，可以使用
`kubectl create serviceaccount <名称>` 命令。
此命令会在当前的名字空间中生成一个服务账号。

```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount/jenkins created
```

<!--
Create an associated token:
-->
创建相关联的令牌：

```bash
kubectl create token jenkins
```

```none
eyJhbGciOiJSUzI1NiIsImtp...
```

<!--
The created token is a signed JSON Web Token (JWT).
-->
所创建的令牌是一个已签名的 JWT 令牌。

<!--
The signed JWT can be used as a bearer token to authenticate as the given service
account. See [above](#putting-a-bearer-token-in-a-request) for how the token is included
in a request. Normally these tokens are mounted into pods for in-cluster access to
the API server, but can be used from outside the cluster as well.
-->
已签名的 JWT 可以用作持有者令牌，并将被认证为所给的服务账号。
关于如何在请求中包含令牌，请参阅[前文](#putting-a-bearer-token-in-a-request)。
通常，这些令牌数据会被挂载到 Pod 中以便集群内访问 API 服务器时使用，
不过也可以在集群外部使用。

<!--
Service accounts authenticate with the username `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`,
and are assigned to the groups `system:serviceaccounts` and `system:serviceaccounts:(NAMESPACE)`.
-->
服务账号被身份认证后，所确定的用户名为 `system:serviceaccount:<名字空间>:<服务账号>`，
并被分配到用户组 `system:serviceaccounts` 和 `system:serviceaccounts:<名字空间>`。

{{< warning >}}
<!--
Because service account tokens can also be stored in Secret API objects, any user with
write access to Secrets can request a token, and any user with read access to those
Secrets can authenticate as the service account. Be cautious when granting permissions
to service accounts and read or write capabilities for Secrets.
-->
由于服务账号令牌也可以保存在 Secret API 对象中，任何能够写入这些 Secret
的用户都可以请求一个令牌，且任何能够读取这些 Secret 的用户都可以被认证为对应的服务账号。
在为用户授予访问服务账号的权限以及对 Secret 的读取或写入权能时，要格外小心。
{{< /warning >}}

<!--
### OpenID Connect Tokens

[OpenID Connect](https://openid.net/connect/) is a flavor of OAuth2 supported by
some OAuth2 providers, notably Microsoft Entra ID, Salesforce, and Google.
The protocol's main extension of OAuth2 is an additional field returned with
the access token called an [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken).
This token is a JSON Web Token (JWT) with well known fields, such as a user's
email, signed by the server.
-->
### OpenID Connect（OIDC）令牌   {#openid-connect-tokens}

[OpenID Connect](https://openid.net/connect/) 是一种 OAuth2 认证方式，
被某些 OAuth2 提供者支持，例如 Microsoft Entra ID、Salesforce 和 Google。
协议对 OAuth2 的主要扩充体现在有一个附加字段会和访问令牌一起返回，
这一字段称作 [ID Token（ID 令牌）](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)。
ID 令牌是一种由服务器签名的 JWT 令牌，其中包含一些可预知的字段，
例如用户的邮箱地址，

<!--
To identify the user, the authenticator uses the `id_token` (not the `access_token`)
from the OAuth2 [token response](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
as a bearer token. See [above](#putting-a-bearer-token-in-a-request) for how the token
is included in a request.
-->
要识别用户，身份认证组件使用 OAuth2
[令牌响应](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)中的
`id_token`（而非 `access_token`）作为持有者令牌。
关于如何在请求中设置令牌，可参见[前文](#putting-a-bearer-token-in-a-request)。

{{< mermaid >}}
sequenceDiagram
    participant user as 用户
    participant idp as 身份提供者
    participant kube as kubectl
    participant api as API 服务器

    user ->> idp: 1. 登录到 IdP
    activate idp
    idp -->> user: 2. 提供 access_token,<br>id_token, 和 refresh_token
    deactivate idp
    activate user
    user ->> kube: 3. 调用 kubectl 并<br>设置 --token 为 id_token<br>或者将令牌添加到 .kube/config
    deactivate user
    activate kube
    kube ->> api: 4. Authorization: Bearer...
    deactivate kube
    activate api
    api ->> api: 5. JWT 签名合法么？
    api ->> api: 6. JWT 是否已过期？(iat+exp)
    api ->> api: 7. 用户被授权了么？
    api -->> kube: 8. 已授权：执行<br>操作并返回结果
    deactivate api
    activate kube
    kube --x user: 9. 返回结果
    deactivate kube
{{< /mermaid >}}

<!--
1. Log in to your identity provider
1. Your identity provider will provide you with an `access_token`, `id_token` and a `refresh_token`
1. When using `kubectl`, use your `id_token` with the `--token` flag or add it directly to your `kubeconfig`
1. `kubectl` sends your `id_token` in a header called Authorization to the API server
1. The API server will make sure the JWT signature is valid
1. Check to make sure the `id_token` hasn't expired

   Perform claim and/or user validation if CEL expressions are configured with `AuthenticationConfiguration`.

1. Make sure the user is authorized
1. Once authorized the API server returns a response to `kubectl`
1. `kubectl` provides feedback to the user
-->
1. 登录到你的身份服务（Identity Provider）
2. 你的身份服务将为你提供 `access_token`、`id_token` 和 `refresh_token`
3. 在使用 `kubectl` 时，将 `id_token` 设置为 `--token` 标志值，或者将其直接添加到
   `kubeconfig` 中
4. `kubectl` 将你的 `id_token` 放到一个称作 `Authorization` 的头部，发送给 API 服务器
5. API 服务器将确保 JWT 的签名是有效的
6. 检查确认 `id_token` 尚未过期

   如果使用 `AuthenticationConfiguration` 配置了 CEL 表达式，则执行声明和/或用户验证。

7. 确认用户有权限执行操作
8. 鉴权成功之后，API 服务器向 `kubectl` 返回响应
9. `kubectl` 向用户提供反馈信息

<!--
Since all of the data needed to validate who you are is in the `id_token`, Kubernetes doesn't need to
"phone home" to the identity provider. In a model where every request is stateless this provides a
very scalable solution for authentication. It does offer a few challenges:
-->
由于用来验证你是谁的所有数据都在 `id_token` 中，Kubernetes 不需要再去联系身份服务。
在一个所有请求都是无状态请求的模型中，这一工作方式可以使得身份认证的解决方案更容易处理大规模请求。
不过，此访问也有一些挑战：

<!--
1. Kubernetes has no "web interface" to trigger the authentication process. There is no browser or
   interface to collect credentials which is why you need to authenticate to your identity provider first.
1. The `id_token` can't be revoked, it's like a certificate so it should be short-lived (only a few minutes)
   so it can be very annoying to have to get a new token every few minutes.
1. To authenticate to the Kubernetes dashboard, you must use the `kubectl proxy` command or a reverse proxy
   that injects the `id_token`.
-->
1. Kubernetes 没有提供用来触发身份认证过程的 "Web 界面"。
   因为不存在用来收集用户凭据的浏览器或用户接口，你必须自己先行完成对身份服务的认证过程。
2. `id_token` 令牌不可收回。因其属性类似于证书，其生命期一般很短（只有几分钟），
   所以，每隔几分钟就要获得一个新的令牌这件事可能很让人头疼。
3. 如果需要向 Kubernetes 控制面板执行身份认证，你必须使用 `kubectl proxy`
   命令或者一个能够注入 `id_token` 的反向代理。

<!--
#### Configuring the API Server

##### Using flags

To enable the plugin, configure the following flags on the API server:
-->
#### 配置 API 服务器    {#configuring-the-api-server}

##### 使用标志

要启用此插件，须在 API 服务器上配置以下标志：

<!--
| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL of the provider that allows the API server to discover public signing keys. Only URLs that use the `https://` scheme are accepted. This is typically the provider's discovery URL, changed to have an empty path. | If the issuer's OIDC discovery URL is `https://accounts.provider.example/.well-known/openid-configuration`, the value should be `https://accounts.provider.example` | Yes |
| `--oidc-client-id` |  A client id that all tokens must be issued for. | kubernetes | Yes |
| `--oidc-username-claim` | JWT claim to use as the user name. By default `sub`, which is expected to be a unique identifier of the end user. Admins can choose other claims, such as `email` or `name`, depending on their provider. However, claims other than `email` will be prefixed with the issuer URL to prevent naming clashes with other plugins. | sub | No |
| `--oidc-username-prefix` | Prefix prepended to username claims to prevent clashes with existing names (such as `system:` users). For example, the value `oidc:` will create usernames like `oidc:jane.doe`. If this flag isn't provided and `--oidc-username-claim` is a value other than `email` the prefix defaults to `( Issuer URL )#` where `( Issuer URL )` is the value of `--oidc-issuer-url`. The value `-` can be used to disable all prefixing. | `oidc:` | No |
| `--oidc-groups-claim` | JWT claim to use as the user's group. If the claim is present it must be an array of strings. | groups | No |
| `--oidc-groups-prefix` | Prefix prepended to group claims to prevent clashes with existing names (such as `system:` groups). For example, the value `oidc:` will create group names like `oidc:engineering` and `oidc:infra`. | `oidc:` | No |
| `--oidc-required-claim` | A key=value pair that describes a required claim in the ID Token. If set, the claim is verified to be present in the ID Token with a matching value. Repeat this flag to specify multiple claims. | `claim=value` | No |
| `--oidc-ca-file` | The path to the certificate for the CA that signed your identity provider's web certificate. Defaults to the host's root CAs. | `/etc/kubernetes/ssl/kc-ca.pem` | No |
| `--oidc-signing-algs` | The signing algorithms accepted. Default is "RS256". | `RS512` | No |
-->

| 参数 | 描述 | 示例 | 必需？ |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | 允许 API 服务器发现公开的签名密钥的服务的 URL。只接受模式为 `https://` 的 URL。此值通常设置为服务的发现 URL，已更改为空路径。 | 如果发行人的 OIDC 发现 URL 是 `https://accounts.google.com/.well-known/openid-configuration`，则此值应为 `https://accounts.provider.example` | 是 |
| `--oidc-client-id` |  所有令牌都应发放给此客户 ID。 | kubernetes | 是 |
| `--oidc-username-claim` | 用作用户名的 JWT 申领（JWT Claim）。默认情况下使用 `sub` 值，即最终用户的一个唯一的标识符。管理员也可以选择其他申领，例如 `email` 或者 `name`，取决于所用的身份服务。不过，除了 `email` 之外的申领都会被添加令牌发放者的 URL 作为前缀，以免与其他插件产生命名冲突。 | sub | 否 |
| `--oidc-username-prefix` | 要添加到用户名申领之前的前缀，用来避免与现有用户名发生冲突（例如：`system:` 用户）。例如，此标志值为 `oidc:` 时将创建形如 `oidc:jane.doe` 的用户名。如果此标志未设置，且 `--oidc-username-claim` 标志值不是 `email`，则默认前缀为 `<令牌发放者的 URL>#`，其中 `<令牌发放者 URL >` 的值取自 `--oidc-issuer-url` 标志的设定。此标志值为 `-` 时，意味着禁止添加用户名前缀。 | `oidc:` | 否 |
| `--oidc-groups-claim` | 用作用户组名的 JWT 申领。如果所指定的申领确实存在，则其值必须是一个字符串数组。 | groups | 否 |
| `--oidc-groups-prefix` | 添加到组申领的前缀，用来避免与现有用户组名（如：`system:` 组）发生冲突。例如，此标志值为 `oidc:` 时，所得到的用户组名形如 `oidc:engineering` 和 `oidc:infra`。 | `oidc:` | 否 |
| `--oidc-required-claim` | 取值为一个 key=value 偶对，意为 ID 令牌中必须存在的申领。如果设置了此标志，则 ID 令牌会被检查以确定是否包含取值匹配的申领。此标志可多次重复，以指定多个申领。 | `claim=value` | 否 |
| `--oidc-ca-file` | 指向一个 CA 证书的路径，该 CA 负责对你的身份服务的 Web 证书提供签名。默认值为宿主系统的根 CA。 | `/etc/kubernetes/ssl/kc-ca.pem` | 否 |
| `--oidc-signing-algs` | 采纳的签名算法。默认为 "RS256"。 | `RS512` | 否 |

<!--
##### Authentication configuration from a file {#using-authentication-configuration}
-->
##### 来自文件的身份认证配置   {#using-authentication-configuration}

{{< feature-state feature_gate_name="StructuredAuthenticationConfiguration" >}}

<!--
JWT Authenticator is an authenticator to authenticate Kubernetes users using JWT compliant tokens.
The authenticator will attempt to parse a raw ID token, verify it's been signed by the configured issuer.
The public key to verify the signature is discovered from the issuer's public endpoint using OIDC discovery.

The minimum valid JWT payload must contain the following claims:
-->
JWT Authenticator 是一个使用 JWT 兼容令牌对 Kubernetes 用户进行身份认证的认证组件。
认证组件将尝试解析原始 ID 令牌，验证它是否是由所配置的颁发者签名。
用于验证签名的公钥是使用 OIDC 发现从发行者的公共端点发现的。

最小有效 JWT 负载必须包含以下声明：

<!--
```json
{
  "iss": "https://example.com",   // must match the issuer.url
  "aud": ["my-app"],              // at least one of the entries in issuer.audiences must match the "aud" claim in presented JWTs.
  "exp": 1234567890,              // token expiration as Unix time (the number of seconds elapsed since January 1, 1970 UTC)
  "<username-claim>": "user"      // this is the username claim configured in the claimMappings.username.claim or claimMappings.username.expression
}
```
-->
```json
{
  "iss": "https://example.com",   // 必须与 issuer.url 匹配
  "aud": ["my-app"],              // issuer.audiences 中至少一项必须与所提供的 JWT 中的 "aud" 声明相匹配。
  "exp": 1234567890,              // 令牌过期时间为 UNIX 时间（自 1970 年 1 月 1 日 UTC 以来经过的秒数）
  "<username-claim>": "user"      // 这是在 claimMappings.username.claim 或 claimMappings.username.expression 中配置的用户名声明
}
```

<!--
The configuration file approach allows you to configure multiple JWT authenticators, each with a unique
`issuer.url` and `issuer.discoveryURL`. The configuration file even allows you to specify [CEL](/docs/reference/using-api/cel/)
expressions to map claims to user attributes, and to validate claims and user information.
The API server also automatically reloads the authenticators when the configuration file is modified.
You can use `apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds` metric
to monitor the last time the configuration was reloaded by the API server.
-->
配置文件方法允许你配置多个 JWT 认证组件，每个身份认证组件都有唯一的 `issuer.url` 和 `issuer.discoveryURL`。
配置文件甚至允许你指定 [CEL](/zh-cn/docs/reference/using-api/cel/)
表达式以将声明映射到用户属性，并验证声明和用户信息。
当配置文件修改时，API 服务器还会自动重新加载认证组件。
你可以使用 `apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds`
指标来监控 API 服务器上次重新加载配置的时间。

<!--
You must specify the path to the authentication configuration using the `--authentication-config` flag
on the API server. If you want to use command line flags instead of the configuration file, those will
continue to work as-is. To access the new capabilities like configuring multiple authenticators,
setting multiple audiences for an issuer, switch to using the configuration file.
-->
你必须使用 API 服务器上的 `--authentication-config` 标志指定身份认证配置的路径。
如果你想使用命令行标志而不是配置文件，命令行标志仍然有效。
要使用新功能（例如配置多个认证组件、为发行者设置多个受众），请切换到使用配置文件。

<!--
For Kubernetes v{{< skew currentVersion >}}, the structured authentication configuration file format
is beta-level, and the mechanism for using that configuration is also beta. Provided you didn't specifically
disable the `StructuredAuthenticationConfiguration`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for your cluster,
you can turn on structured authentication by specifying the `--authentication-config` command line
argument to the kube-apiserver. An example of the structured authentication configuration file is shown below.
-->
对于 Kubernetes v{{< skew currentVersion >}}，
结构化身份认证配置文件格式是 Beta 级别，并且使用该配置的机制也是 Beta 级别。
如果你没有禁用集群的 `StructuredAuthenticationConfiguration`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
则可以通过为 kube-apiserver 指定 `--authentication-config` 命令行参数来启用结构化身份认证。
下面给出的是一个结构化身份认证配置文件的示例：

{{< note >}}
<!--
If you specify `--authentication-config` along with any of the `--oidc-*` command line arguments, this is
a misconfiguration. In this situation, the API server reports an error and then immediately exits.
If you want to switch to using structured authentication configuration, you have to remove the `--oidc-*`
command line arguments, and use the configuration file instead.
-->
你不能同时指定 `--authentication-config` 和 `--oidc-*` 命令行参数，
否则API服务器会报告错误，然后立即退出。
如果你想切换到使用结构化身份认证配置，则必须删除 `--oidc-*` 命令行参数，并改用配置文件。
{{< /note >}}

<!--
```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# list of authenticators to authenticate Kubernetes users using JWT compliant tokens.
# the maximum number of allowed authenticators is 64.
jwt:
- issuer:
    # url must be unique across all authenticators.
    # url must not conflict with issuer configured in --service-account-issuer.
    url: https://example.com # Same as --oidc-issuer-url.
    # discoveryURL, if specified, overrides the URL used to fetch discovery
    # information instead of using "{url}/.well-known/openid-configuration".
    # The exact value specified is used, so "/.well-known/openid-configuration"
    # must be included in discoveryURL if needed.
    #
    # The "issuer" field in the fetched discovery information must match the "issuer.url" field
    # in the AuthenticationConfiguration and will be used to validate the "iss" claim in the presented JWT.
    # This is for scenarios where the well-known and jwks endpoints are hosted at a different
    # location than the issuer (such as locally in the cluster).
    # discoveryURL must be different from url if specified and must be unique across all authenticators.
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM encoded CA certificates used to validate the connection when fetching
    # discovery information. If not set, the system verifier will be used.
    # Same value as the content of the file referenced by the --oidc-ca-file flag.
    certificateAuthority: <PEM encoded CA certificates>    
    # audiences is the set of acceptable audiences the JWT must be issued to.
    # At least one of the entries must match the "aud" claim in presented JWTs.
    audiences:
    - my-app # Same as --oidc-client-id.
    - my-other-app
    # this is required to be set to "MatchAny" when multiple audiences are specified.
    audienceMatchPolicy: MatchAny
  # rules applied to validate token claims to authenticate users.
  claimValidationRules:
    # Same as --oidc-required-claim key=value.
  - claim: hd
    requiredValue: example.com
    # Instead of claim and requiredValue, you can use expression to validate the claim.
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for validation to succeed.
  - expression: 'claims.hd == "example.com"'
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: the hd claim must be set to example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: total token lifetime must not exceed 24 hours
  claimMappings:
    # username represents an option for the username attribute.
    # This is the only required attribute.
    username:
      # Same as --oidc-username-claim. Mutually exclusive with username.expression.
      claim: "sub"
      # Same as --oidc-username-prefix. Mutually exclusive with username.expression.
      # if username.claim is set, username.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with username.claim and username.prefix.
      # expression is a CEL expression that evaluates to a string.
      #
      # 1.  If username.expression uses 'claims.email', then 'claims.email_verified' must be used in
      #     username.expression or extra[*].valueExpression or claimValidationRules[*].expression.
      #     An example claim validation rule expression that matches the validation automatically
      #     applied when username.claim is set to 'email' is 'claims.?email_verified.orValue(true)'.
      # 2.  If the username asserted based on username.expression is the empty string, the authentication
      #     request will fail.
      expression: 'claims.username + ":external-user"'
    # groups represents an option for the groups attribute.
    groups:
      # Same as --oidc-groups-claim. Mutually exclusive with groups.expression.
      claim: "sub"
      # Same as --oidc-groups-prefix. Mutually exclusive with groups.expression.
      # if groups.claim is set, groups.prefix is required.
      # Explicitly set it to "" if no prefix is desired.
      prefix: ""
      # Mutually exclusive with groups.claim and groups.prefix.
      # expression is a CEL expression that evaluates to a string or a list of strings.
      expression: 'claims.roles.split(",")'
    # uid represents an option for the uid attribute.
    uid:
      # Mutually exclusive with uid.expression.
      claim: 'sub'
      # Mutually exclusive with uid.claim
      # expression is a CEL expression that evaluates to a string.
      expression: 'claims.sub'
    # extra attributes to be added to the UserInfo object. Keys must be domain-prefix path and must be unique.
    extra:
    - key: 'example.com/tenant'
      # valueExpression is a CEL expression that evaluates to a string or a list of strings.
      valueExpression: 'claims.tenant'
  # validation rules applied to the final user object.
  userValidationRules:
    # expression is a CEL expression that evaluates to a boolean.
    # all the expressions must evaluate to true for the user to be valid.
  - expression: "!user.username.startsWith('system:')"
    # Message customizes the error message seen in the API server logs when the validation fails.
    message: 'username cannot used reserved system: prefix'
  - expression: "user.groups.all(group, !group.startsWith('system:'))"
    message: 'groups cannot used reserved system: prefix'
```
-->
```yaml
---
#
# 注意：这是一个示例配置，不要将其用于你自己的集群！
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# 使用 JWT 兼容令牌对 Kubernetes 用户进行身份认证的认证组件列表，允许的最大认证组件数量为 64。
jwt:
- issuer:
    # url 在所有认证组件中必须是唯一的。
    # url 不得与 --service-account-issuer 中配置的颁发者冲突。
    url: https://example.com # 与 --oidc-issuer-url 一致。
    # discoveryURL（如果指定）将覆盖用于获取发现信息的 URL，而不是使用 “{url}/.well-known/openid-configuration”。
    # 系统会使用所给的配置值，因此如果需要，“/.well-known/openid-configuration” 必须包含在 discoveryURL 中。
    #
    # 取回的发现信息中的 “issuer” 字段必须与 AuthenticationConfiguration 中的
    # “issuer.url” 字段匹配，并被用于验证所呈现的 JWT 中的 “iss” 声明。
    # 这适用于众所周知的端点和 jwks 端点托管在与颁发者不同的位置（例如集群本地）的场景。
    # discoveryURL 必须与 url 不同（如果指定），并且在所有认证组件中必须是唯一的。
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    # PEM 编码的 CA 证书用于在获取发现信息时验证连接。
    # 如果未设置，将使用系统验证程序。
    # 与 --oidc-ca-file 标志引用的文件内容的值相同。
    certificateAuthority: <PEM encoded CA certificates>    
    # audiences 是 JWT 必须发布给的一组可接受的受众。
    # 至少其中一项必须与所提供的 JWT 中的 “aud” 声明相匹配。
    audiences:
    - my-app # 与 --oidc-client-id 一致。
    - my-other-app
    # 当指定多个受众时，需要将此字段设置为 “MatchAny”。
    audienceMatchPolicy: MatchAny
  # 用于验证令牌声明以对用户进行身份认证的规则。
  claimValidationRules:
    # 与 --oidc-required-claim key=value 一致
  - claim: hd
    requiredValue: example.com
    # 你可以使用表达式来验证声明，而不是仅仅靠 claim 和 requiredValue 来执行检查。
    # expression 是一个计算结果为布尔值的 CEL 表达式。
    # 所有表达式的计算结果必须为 true 才能使验证成功。
  - expression: 'claims.hd == "example.com"'
    # message 用来定制验证失败时在 API 服务器日志中看到的错误消息。
    message: the hd claim must be set to example.com
  - expression: 'claims.exp - claims.nbf <= 86400'
    message: total token lifetime must not exceed 24 hours
  claimMappings:
    # username 表示用户名属性的选项。
    # 这是唯一必需的属性。
    username:
      # 与 --oidc-username-claim 相同，与 username.expression 互斥。
      claim: "sub"
      # 与 --oidc-username-prefix 相同，与 username.expression 互斥。
      # 如果设置了username.claim，则需要username.prefix。
      # 如果不需要前缀，可显式将其设置为 ""。
      prefix: ""
      # 与 username.claim 和 username.prefix 互斥。
      # expression 是计算结果为字符串的 CEL 表达式。
      #
      # 1.  如果 username.expression 使用 “claims.email”，则必须在 username.expression
      #     或 extra[*].valueExpression 或 ClaimValidationRules[*].expression 中使用 “claims.email_verified”。
      #     与 username.claim 设置为 “email” 时自动应用的验证相匹配的示例声明验证规则表达式是
      #     “claims.?email_verified.orValue(true)”。
      # 2.  如果根据 username.expression 断言的用户名是空字符串，则身份认证请求将失败。
      expression: 'claims.username + ":external-user"'
    # groups 代表 groups 属性的一个选项。
    groups:
      # 与 --oidc-groups-claim 相同，与 groups.express 互斥。
      claim: "sub"
      # 与 --oidc-groups-prefix 相同。与 groups.express 互斥。
      # 如果设置了 groups.claim，则需要 groups.prefix。
      # 如果不需要前缀，则显式将其设置为 ""。
      prefix: ""
      # 与 groups.claim 和 groups.prefix 互斥。
      # expression 是一个计算结果为字符串或字符串列表的 CEL 表达式。
      expression: 'claims.roles.split(",")'
    # uid 表示 uid 属性的一个选项。
    uid:
      # 与 uid.expression 互斥。
      claim: 'sub'
      # 与 uid.claim 互斥
      # expression 是计算结果为字符串的 CEL 表达式。
      expression: 'claims.sub'
    # 要添加到 UserInfo 对象的其他属性，键必须是域前缀路径并且必须是唯一的。
    extra:
    - key: 'example.com/tenant'
      # valueExpression 是一个计算结果为字符串或字符串列表的 CEL 表达式。
      valueExpression: 'claims.tenant'
  # 应用于最终用户对象的验证规则。
  userValidationRules:
    # expression 是一个计算结果为布尔值的 CEL 表达式。
    # 所有表达式的计算结果必须为 true，用户才有效。
  - expression: "!user.username.startsWith('system:')"
    # Message 自定义验证失败时在 API 服务器日志中看到的错误消息。
    message: 'username cannot used reserved system: prefix'
  - expression: "user.groups.all(group, !group.startsWith('system:'))"
    message: 'groups cannot used reserved system: prefix'
```

<!--
* Claim validation rule expression

  `jwt.claimValidationRules[i].expression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of the token payload, organized into `claims` CEL variable.
  `claims` is a map of claim names (as strings) to claim values (of any type).
-->
* 声明验证规则表达式

`jwt.claimValidationRules[i].expression` 表示将由 CEL 计算的表达式。
 CEL 表达式可以访问令牌有效负载的内容，这些内容被组织成 `claims` CEL 变量。
 `claims` 是声明名称（作为字符串）到声明值（任何类型）的映射。

<!--
* User validation rule expression

  `jwt.userValidationRules[i].expression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of `userInfo`, organized into `user` CEL variable.
  Refer to the [UserInfo](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#userinfo-v1-authentication-k8s-io)
  API documentation for the schema of `user`.
-->
* 用户验证规则表达式

 `jwt.userValidationRules[i].expression` 表示将由 CEL 计算的表达式。
  CEL 表达式可以访问 `userInfo` 的内容，并组织成 `user` CEL 变量。
  有关 `user` 的架构，请参阅
  [UserInfo](/zh-cn/docs/reference/ generated/kubernetes-api/v{{< skew currentVersion >}}/#userinfo-v1-authentication-k8s-io) API 文档。

<!--
* Claim mapping expression

  `jwt.claimMappings.username.expression`, `jwt.claimMappings.groups.expression`, `jwt.claimMappings.uid.expression`
  `jwt.claimMappings.extra[i].valueExpression` represents the expression which will be evaluated by CEL.
  CEL expressions have access to the contents of the token payload, organized into `claims` CEL variable.
  `claims` is a map of claim names (as strings) to claim values (of any type).
-->
* 声明映射表达式

  `jwt.claimMappings.username.expression`、`jwt.claimMappings.groups.expression`、
  `jwt.claimMappings.uid.expression` `jwt.claimMappings.extra[i].valueExpression` 表示将由 CEL 计算的表达式。
  CEL 表达式可以访问令牌有效负载的内容，这些内容被组织成 `claims` CEL 变量。
  `claims` 是声明名称（作为字符串）到声明值（任何类型）的映射。

  <!--
  To learn more, see the [Documentation on CEL](/docs/reference/using-api/cel/)

  Here are examples of the `AuthenticationConfiguration` with different token payloads.
  -->
  要了解更多信息，请参阅[CEL 文档](/docs/reference/using-api/cel/)。

  以下是具有不同令牌有效负载的 “AuthenticationConfiguration” 示例。


  {{< tabs name="example_configuration" >}}
  {{% tab name="Valid token" %}}
  <!--
  # the expression will evaluate to true, so validation will succeed.
  -->
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1beta1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimMappings:
      username:
        expression: 'claims.username + ":external-user"'
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')" # 表达式的计算结果为 true，因此验证将成功。
      message: 'username cannot used reserved system: prefix'
  ```

  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效负载是：

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "iat": 1701107233,
      "iss": "https://example.com",
      "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
      "nbf": 1701107233,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will produce the following `UserInfo` object and successfully authenticate the user.
  -->
  具有上述 `AuthenticationConfiguration` 的令牌将生成以下 `UserInfo` 对象并成功对用户进行身份认证。

  ```json
  {
       "username": "foo:external-user",
       "uid": "auth",
       "groups": [
           "user",
           "admin"
       ],
       "extra": {
           "example.com/tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a"
       }
  }
  ```

  {{% /tab %}}
  {{% tab name="Fails claim validation" %}}
  <!--
  # the token below does not have this claim, so validation will fail.
  # the expression will evaluate to true, so validation will succeed.
  -->
  ```yaml
   apiVersion: apiserver.config.k8s.io/v1beta1
   kind: AuthenticationConfiguration
   jwt:
   - issuer:
        url: https://example.com
        audiences:
        - my-app
   claimValidationRules:
   - expression: 'claims.hd == "example.com"' # 下面的令牌没有此声明，因此验证将失败。
        message: the hd claim must be set to example.com
   claimMappings:
        username:
          expression: 'claims.username + ":external-user"'
        groups:
          expression: 'claims.roles.split(",")'
        uid:
          expression: 'claims.sub'
        extra:
        - key: 'example.com/tenant'
          valueExpression: 'claims.tenant'
   userValidationRules:
   - expression: "!user.username.startsWith('system:')" # 该表达式的计算结果将为 true，因此验证将会成功。
        message: 'username cannot used reserved system: prefix'
  ```
  
  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJpYXQiOjE3MDExMDcyMzMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJqdGkiOiI3YzMzNzk0MjgwN2U3M2NhYTJjMzBjODY4YWMwY2U5MTBiY2UwMmRkY2JmZWJlOGMyM2I4YjVmMjdhZDYyODczIiwibmJmIjoxNzAxMTA3MjMzLCJyb2xlcyI6InVzZXIsYWRtaW4iLCJzdWIiOiJhdXRoIiwidGVuYW50IjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjRhIiwidXNlcm5hbWUiOiJmb28ifQ.TBWF2RkQHm4QQz85AYPcwLxSk-VLvQW-mNDHx7SEOSv9LVwcPYPuPajJpuQn9C_gKq1R94QKSQ5F6UgHMILz8OfmPKmX_00wpwwNVGeevJ79ieX2V-__W56iNR5gJ-i9nn6FYk5pwfVREB0l4HSlpTOmu80gbPWAXY5hLW0ZtcE1JTEEmefORHV2ge8e3jp1xGafNy6LdJWabYuKiw8d7Qga__HxtKB-t0kRMNzLRS7rka_SfQg0dSYektuxhLbiDkqhmRffGlQKXGVzUsuvFw7IGM5ZWnZgEMDzCI357obHeM3tRqpn5WRjtB8oM7JgnCymaJi-P3iCd88iu1xnzA
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效负载是：

  ```json
  {
    "aud": "kubernetes",
    "exp": 1703232949,
    "iat": 1701107233,
    "iss": "https://example.com",
    "jti": "7c337942807e73caa2c30c868ac0ce910bce02ddcbfebe8c23b8b5f27ad62873",
    "nbf": 1701107233,
    "roles": "user,admin",
    "sub": "auth",
    "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
    "username": "foo"
  }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will fail to authenticate because the
  `hd` claim is not set to `example.com`. The API server will return `401 Unauthorized` error.
  -->
  具有上述 `AuthenticationConfiguration` 的令牌将无法进行身份认证，
  因为 `hd` 声明未设置为 `example.com`。API 服务器将返回 `401 Unauthorized` 错误。
  {{% /tab %}}
  {{% tab name="Fails user validation" %}}

  <!--
  # this will prefix the username with "system:" and will fail user validation.
  # the username will be system:foo and expression will evaluate to false, so validation will fail.
  -->
  ```yaml
  apiVersion: apiserver.config.k8s.io/v1beta1
  kind: AuthenticationConfiguration
  jwt:
  - issuer:
      url: https://example.com
      audiences:
      - my-app
    claimValidationRules:
    - expression: 'claims.hd == "example.com"'
      message: the hd claim must be set to example.com
    claimMappings:
      username:
        expression: '"system:" + claims.username' # 这将为用户名添加前缀 “system:”，并且用户验证将失败。
      groups:
        expression: 'claims.roles.split(",")'
      uid:
        expression: 'claims.sub'
      extra:
      - key: 'example.com/tenant'
        valueExpression: 'claims.tenant'
    userValidationRules:
    - expression: "!user.username.startsWith('system:')" # 用户名将为 system:foo 并且表达式将计算为 false，因此验证将失败。
      message: 'username cannot used reserved system: prefix'
  ```
  ```bash
  TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3dF9tOEROWmFTQk1oWGw5QXZTWGhBUC04Y0JmZ0JVbFVpTG5oQkgxdXMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNzAzMjMyOTQ5LCJoZCI6ImV4YW1wbGUuY29tIiwiaWF0IjoxNzAxMTEzMTAxLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwianRpIjoiYjViMDY1MjM3MmNkMjBlMzQ1YjZmZGZmY2RjMjE4MWY0YWZkNmYyNTlhYWI0YjdlMzU4ODEyMzdkMjkyMjBiYyIsIm5iZiI6MTcwMTExMzEwMSwicm9sZXMiOiJ1c2VyLGFkbWluIiwic3ViIjoiYXV0aCIsInRlbmFudCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0YSIsInVzZXJuYW1lIjoiZm9vIn0.FgPJBYLobo9jnbHreooBlvpgEcSPWnKfX6dc0IvdlRB-F0dCcgy91oCJeK_aBk-8zH5AKUXoFTlInfLCkPivMOJqMECA1YTrMUwt_IVqwb116AqihfByUYIIqzMjvUbthtbpIeHQm2fF0HbrUqa_Q0uaYwgy8mD807h7sBcUMjNd215ff_nFIHss-9zegH8GI1d9fiBf-g6zjkR1j987EP748khpQh9IxPjMJbSgG_uH5x80YFuqgEWwq-aYJPQxXX6FatP96a2EAn7wfPpGlPRt0HcBOvq5pCnudgCgfVgiOJiLr_7robQu4T1bis0W75VPEvwWtgFcLnvcQx0JWg
  ```

  <!--
  where the token payload is:
  -->
  其中令牌有效负载是：

  ```json
    {
      "aud": "kubernetes",
      "exp": 1703232949,
      "hd": "example.com",
      "iat": 1701113101,
      "iss": "https://example.com",
      "jti": "b5b0652372cd20e345b6fdffcdc2181f4afd6f259aab4b7e35881237d29220bc",
      "nbf": 1701113101,
      "roles": "user,admin",
      "sub": "auth",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a",
      "username": "foo"
    }
  ```

  <!--
  The token with the above `AuthenticationConfiguration` will produce the following `UserInfo` object:
  -->
  具有上述 “AuthenticationConfiguration” 的令牌将生成以下 “UserInfo” 对象：

  ```json
  {
      "username": "system:foo",
      "uid": "auth",
      "groups": [
          "user",
          "admin"
      ],
      "extra": {
          "example.com/tenant": "72f988bf-86f1-41af-91ab-2d7cd011db4a"
      }
  }
  ```

  <!--
  which will fail user validation because the username starts with `system:`.
  The API server will return `401 Unauthorized` error.
  -->
  这将导致用户验证失败，因为用户名以 `system:` 开头。 API 服务器将返回 `401 Unauthorized` 错误。
  {{% /tab %}}
  {{< /tabs >}}

<!--
###### Limitations

1. Distributed claims do not work via [CEL](/docs/reference/using-api/cel/) expressions.
1. Egress selector configuration is not supported for calls to `issuer.url` and `issuer.discoveryURL`.
-->
###### 局限性

1. 分布式声明无法通过 [CEL](/zh-cn/docs/reference/using-api/cel/) 表达式工作。
2. 不支持调用 `issuer.url` 和 `issuer.discoveryURL` 的出口选择器配置。

<!--
Kubernetes does not provide an OpenID Connect Identity Provider.
You can use an existing public OpenID Connect Identity Provider (such as Google, or
[others](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)).
Or, you can run your own Identity Provider, such as [dex](https://dexidp.io/),
[Keycloak](https://github.com/keycloak/keycloak),
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa), or
Tremolo Security's [OpenUnison](https://openunison.github.io/).
-->
Kubernetes 并未提供 OpenID Connect 的身份服务。
你可以使用现有的公共的 OpenID Connect 身份服务
（例如 Google 或者[其他服务](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)）。
或者，你也可以选择自己运行一个身份服务，例如 [dex](https://dexidp.io/)、
[Keycloak](https://github.com/keycloak/keycloak)、
CloudFoundry [UAA](https://github.com/cloudfoundry/uaa) 或者
Tremolo Security 的 [OpenUnison](https://openunison.github.io/)。

<!--
For an identity provider to work with Kubernetes it must:

1. Support [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)

   The public key to verify the signature is discovered from the issuer's public endpoint using OIDC discovery.
   If you're using the authentication configuration file, the identity provider doesn't need to publicly expose the discovery endpoint.
   You can host the discovery endpoint at a different location than the issuer (such as locally in the cluster) and specify the
   `issuer.discoveryURL` in the configuration file.
-->
要在 Kubernetes 环境中使用某身份服务，该服务必须：

1. 支持 [OpenID connect 发现](https://openid.net/specs/openid-connect-discovery-1_0.html)

   用于验证签名的公钥是使用 OIDC 发现从发行者的公共端点发现的。
   如果你使用身份认证配置文件，则身份提供者不需要公开发布发现端点。
   你可以将发现端点托管在与颁发者不同的位置（例如集群本地），并在配置文件中指定 `issuer.discoveryURL`。

<!--
1. Run in TLS with non-obsolete ciphers
1. Have a CA signed certificate (even if the CA is not a commercial CA or is self signed)
-->
2. 使用未过时的密钥以 TLS 模式运行
3. 拥有 CA 签名的证书（即使该 CA 不是商业 CA 或者是自签名的）

<!--
A note about requirement #3 above, requiring a CA signed certificate. If you deploy your own
identity provider (as opposed to one of the cloud providers like Google or Microsoft) you MUST
have your identity provider's web server certificate signed by a certificate with the `CA` flag
set to `TRUE`, even if it is self signed. This is due to GoLang's TLS client implementation
being very strict to the standards around certificate validation. If you don't have a CA handy,
you can use the [gencert script](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh)
from the Dex team to create a simple CA and a signed certificate and key pair. Or you can use
[this similar script](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh)
that generates SHA256 certs with a longer life and larger key size.
-->
关于上述第三条需求，即要求具备 CA 签名的证书，有一些额外的注意事项。
如果你部署了自己的身份服务，而不是使用云厂商（如 Google 或 Microsoft）所提供的服务，
你必须对身份服务的 Web 服务器证书进行签名，签名所用证书的 `CA` 标志要设置为
`TRUE`，即使用的是自签名证书。这是因为 GoLang 的 TLS 客户端实现对证书验证标准方面有非常严格的要求。
如果你手头没有现成的 CA 证书，可以使用 Dex
团队所开发的[证书生成脚本](https://github.com/dexidp/dex/blob/master/examples/k8s/gencert.sh)
来创建一个简单的 CA 和被签了名的证书与密钥对。
或者你也可以使用[这个类似的脚本](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh)，
生成一个合法期更长、密钥尺寸更大的 SHA256 证书。

<!--
Refer to setup instructions for specific systems:
-->
参阅特定系统的安装指令：

- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)

<!--
#### Using kubectl

##### Option 1 - OIDC Authenticator

The first option is to use the kubectl `oidc` authenticator, which sets the `id_token` as a bearer token
for all requests and refreshes the token once it expires. After you've logged into your provider, use
kubectl to add your `id_token`, `refresh_token`, `client_id`, and `client_secret` to configure the plugin.

Providers that don't return an `id_token` as part of their refresh token response aren't supported
by this plugin and should use "Option 2" below.
-->
#### 使用 kubectl   {#using-kubectl}

##### 选项一：OIDC 身份认证组件

第一种方案是使用 kubectl 的 `oidc` 身份认证组件，该组件将 `id_token` 设置为所有请求的持有者令牌，
并且在令牌过期时自动刷新。在你登录到你的身份服务之后，
可以使用 kubectl 来添加你的 `id_token`、`refresh_token`、`client_id` 和
`client_secret`，以配置该插件。

如果服务在其刷新令牌响应中不包含 `id_token`，则此插件无法支持该服务。
这时你应该考虑下面的选项二。

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token )
```

<!--
As an example, running the below command after authenticating to your identity provider:
-->
作为示例，在完成对你的身份服务的身份认证之后，运行下面的命令：

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

<!--
Which would produce the below configuration:
-->
此操作会生成以下配置：

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```

<!--
Once your `id_token` expires, `kubectl` will attempt to refresh your `id_token` using your `refresh_token`
and `client_secret` storing the new values for the `refresh_token` and `id_token` in your `.kube/config`.
-->
当你的 `id_token` 过期时，`kubectl` 会尝试使用你的 `refresh_token` 来刷新你的
`id_token`，并且在 `.kube/config` 文件的 `client_secret` 中存放 `refresh_token`
和 `id_token` 的新值。

<!--
##### Option 2 - Use the `--token` Option

The `kubectl` command lets you pass in a token using the `--token` option.
Copy and paste the `id_token` into this option:
-->
##### 选项二：使用 `--token` 选项

`kubectl` 命令允许你使用 `--token` 选项传递一个令牌。
你可以将 `id_token` 的内容复制粘贴过来，作为此标志的取值：

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```

<!--
### Webhook Token Authentication

Webhook authentication is a hook for verifying bearer tokens.

* `--authentication-token-webhook-config-file` a configuration file describing how to access the remote webhook service.
* `--authentication-token-webhook-cache-ttl` how long to cache authentication decisions. Defaults to two minutes.
* `--authentication-token-webhook-version` determines whether to use `authentication.k8s.io/v1beta1` or `authentication.k8s.io/v1`
  `TokenReview` objects to send/receive information from the webhook. Defaults to `v1beta1`.
-->
### Webhook 令牌身份认证   {#webhook-token-authentication}

Webhook 身份认证是一种用来验证持有者令牌的回调机制。

* `--authentication-token-webhook-config-file` 指向一个配置文件，
  其中描述如何访问远程的 Webhook 服务。
* `--authentication-token-webhook-cache-ttl` 用来设定身份认证决定的缓存时间。
  默认时长为 2 分钟。
* `--authentication-token-webhook-version` 决定是使用 `authentication.k8s.io/v1beta1` 还是
  `authenticationk8s.io/v1` 版本的 `TokenReview` 对象从 Webhook 发送/接收信息。
  默认为“v1beta1”。

<!--
The configuration file uses the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file format. Within the file, `clusters` refers to the remote service and
`users` refers to the API server webhook. An example would be:
-->
配置文件使用 [kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
文件的格式。文件中，`clusters` 指代远程服务，`users` 指代远程 API 服务
Webhook。下面是一个例子：

<!--
```yaml
# Kubernetes API version
apiVersion: v1
# kind of the API object
kind: Config
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # CA for verifying the remote service.
      server: https://authn.example.com/authenticate # URL of remote service to query. 'https' recommended for production.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```
-->
```yaml
# Kubernetes API 版本
apiVersion: v1
# API 对象类别
kind: Config
# clusters 指代远程服务
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # 用来验证远程服务的 CA
      server: https://authn.example.com/authenticate # 要查询的远程服务 URL。生产环境中建议使用 'https'。

# users 指代 API 服务的 Webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhook 插件要使用的证书
      client-key: /path/to/key.pem          # 与证书匹配的密钥

# kubeconfig 文件需要一个上下文（Context），此上下文用于本 API 服务器
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-server
  name: webhook
```

<!--
When a client attempts to authenticate with the API server using a bearer token as discussed
[above](#putting-a-bearer-token-in-a-request), the authentication webhook POSTs a JSON-serialized
`TokenReview` object containing the token to the remote service.
-->
当客户端尝试在 API 服务器上使用持有者令牌完成身份认证
（如[前](#putting-a-bearer-token-in-a-request)所述）时，
身份认证 Webhook 会用 POST 请求发送一个 JSON 序列化的对象到远程服务。
该对象是 `TokenReview` 对象，其中包含持有者令牌。
Kubernetes 不会强制请求提供此 HTTP 头部。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should check the `apiVersion` field of the request to ensure correct deserialization,
and **must** respond with a `TokenReview` object of the same version as the request.
-->
要注意的是，Webhook API 对象和其他 Kubernetes API 对象一样，
也要受到同一[版本兼容规则](/zh-cn/docs/concepts/overview/kubernetes-api/)约束。
实现者应检查请求的 `apiVersion` 字段以确保正确的反序列化，
并且 **必须** 以与请求相同版本的 `TokenReview` 对象进行响应。

{{< tabs name="TokenReview_request" >}}
{{% tab name="authentication.k8s.io/v1" %}}
{{< note >}}
<!--
The Kubernetes API server defaults to sending `authentication.k8s.io/v1beta1` token reviews for backwards compatibility.
To opt into receiving `authentication.k8s.io/v1` token reviews, the API server must be started with `--authentication-token-webhook-version=v1`.
-->
Kubernetes API 服务器默认发送 `authentication.k8s.io/v1beta1` 令牌以实现向后兼容性。
要选择接收 `authentication.k8s.io/v1` 令牌认证，API 服务器必须带着参数
`--authentication-token-webhook-version=v1` 启动。
{{< /note >}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "spec": {
   # 发送到 API 服务器的不透明持有者令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的服务器的受众标识符的可选列表。
    # 受众感知令牌认证组件（例如，OIDC 令牌认证组件）
    # 应验证令牌是否针对此列表中的至少一个受众，
    # 并返回此列表与响应状态中令牌的有效受众的交集。
    # 这确保了令牌对于向其提供给的服务器进行身份认证是有效的。
    # 如果未提供受众，则应验证令牌以向 Kubernetes API 服务器进行身份认证。
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # Opaque bearer token sent to the API server
    "token": "014fbff9a07c...",

    # Optional list of the audience identifiers for the server the token was presented to.
    # Audience-aware token authenticators (for example, OIDC token authenticators)
    # should verify the token was intended for at least one of the audiences in this list,
    # and return the intersection of this list and the valid audiences for the token in the response status.
    # This ensures the token is valid to authenticate to the server it was presented to.
    # If no audiences are provided, the token should be validated to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    # 发送到 API 服务器的不透明匿名令牌
    "token": "014fbff9a07c...",
   
    # 提供令牌的服务器的受众标识符的可选列表。
    # 受众感知令牌认证组件（例如，OIDC 令牌认证组件）
    # 应验证令牌是否针对此列表中的至少一个受众，
    # 并返回此列表与响应状态中令牌的有效受众的交集。
    # 这确保了令牌对于向其提供给的服务器进行身份认证是有效的。
    # 如果未提供受众，则应验证令牌以向 Kubernetes API 服务器进行身份认证。
    "audiences": ["https://myserver.example.com", "https://myserver.internal.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
The remote service is expected to fill the `status` field of the request to indicate the success of the login.
The response body's `spec` field is ignored and may be omitted.
The remote service must return a response using the same `TokenReview` API version that it received.
A successful validation of the bearer token would return:
-->
远程服务预计会填写请求的 `status` 字段以指示登录成功。
响应正文的 `spec` 字段被忽略并且可以省略。
远程服务必须使用它收到的相同 `TokenReview` API 版本返回响应。
持有者令牌的成功验证将返回：

{{< tabs name="TokenReview_response_success" >}}
{{% tab name="authentication.k8s.io/v1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必要
      "username": "janedoe@example.com",
      # 可选
      "uid": "42",
      # 可选的组成员身份
      "groups": ["developers", "qa"],
      # 认证者提供的可选附加信息。
      # 此字段不可包含机密数据，因为这类数据可能被记录在日志或 API 对象中，
      # 并且可能传递给 admission webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 认证组件可以返回的、可选的用户感知令牌列表，
    # 包含令牌对其有效的、包含于 `spec.audiences` 列表中的受众。
    # 如果省略，则认为该令牌可用于对 Kubernetes API 服务器进行身份认证。
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # Required
      "username": "janedoe@example.com",
      # Optional
      "uid": "42",
      # Optional group memberships
      "groups": ["developers", "qa"],
      # Optional additional information provided by the authenticator.
      # This should not contain confidential data, as it can be recorded in logs
      # or API objects, and is made available to admission webhooks.
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # Optional list audience-aware token authenticators can return,
    # containing the audiences from the `spec.audiences` list for which the provided token was valid.
    # If this is omitted, the token is considered to be valid to authenticate to the Kubernetes API server.
    "audiences": ["https://myserver.example.com"]
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      # 必要
      "username": "janedoe@example.com",
      # 可选
      "uid": "42",
      # 可选的组成员身份
      "groups": ["developers", "qa"],
      # 认证者提供的可选附加信息。
      # 此字段不可包含机密数据，因为这类数据可能被记录在日志或 API 对象中，
      # 并且可能传递给 admission webhook。
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    },
    # 认证组件可以返回的、可选的用户感知令牌列表，
    # 包含令牌对其有效的、包含于 `spec.audiences` 列表中的受众。
    # 如果省略，则认为该令牌可用于对 Kubernetes API 服务器进行身份认证。
    "audiences": ["https://myserver.example.com"]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
An unsuccessful request would return:
-->
而不成功的请求会返回：

{{< tabs name="TokenReview_response_error" >}}
{{% tab name="authentication.k8s.io/v1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可选地包括有关身份认证失败原因的详细信息。
    # 如果没有提供错误信息，API 将返回一个通用的 Unauthorized 消息。
    # 当 authenticated=true 时，error 字段被忽略。
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{% tab name="authentication.k8s.io/v1beta1" %}}
<!--
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # Optionally include details about why authentication failed.
    # If no error is provided, the API will return a generic Unauthorized message.
    # The error field is ignored when authenticated=true.
    "error": "Credentials are expired"
  }
}
```
-->
```yaml
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false,
    # 可选地包括有关身份认证失败原因的详细信息。
    # 如果没有提供错误信息，API 将返回一个通用的 Unauthorized 消息。
    # 当 authenticated=true 时，error 字段被忽略。
    "error": "Credentials are expired"
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Authenticating Proxy

The API server can be configured to identify users from request header values, such as `X-Remote-User`.
It is designed for use in combination with an authenticating proxy, which sets the request header value.
-->
### 身份认证代理   {#authenticating-proxy}

API 服务器可以配置成从请求的头部字段值（如 `X-Remote-User`）中辩识用户。
这一设计是用来与某身份认证代理一起使用 API 服务器，代理负责设置请求的头部字段值。

<!--
* `--requestheader-username-headers` Required, case-insensitive. Header names to check, in order,
  for the user identity. The first header containing a value is used as the username.
* `--requestheader-group-headers` 1.6+. Optional, case-insensitive. "X-Remote-Group" is suggested.
  Header names to check, in order, for the user's groups. All values in all specified headers are used as group names.
* `--requestheader-extra-headers-prefix` 1.6+. Optional, case-insensitive. "X-Remote-Extra-" is suggested.
  Header prefixes to look for to determine extra information about the user (typically used by the configured authorization plugin).
  Any headers beginning with any of the specified prefixes have the prefix removed.
  The remainder of the header name is lowercased and [percent-decoded](https://tools.ietf.org/html/rfc3986#section-2.1)
  and becomes the extra key, and the header value is the extra value.
-->
* `--requestheader-username-headers` 必需字段，大小写不敏感。
  用来设置要获得用户身份所要检查的头部字段名称列表（有序）。
  第一个包含数值的字段会被用来提取用户名。
* `--requestheader-group-headers` 可选字段，在 Kubernetes 1.6 版本以后支持，大小写不敏感。
  建议设置为 "X-Remote-Group"。用来指定一组头部字段名称列表，以供检查用户所属的组名称。
  所找到的全部头部字段的取值都会被用作用户组名。
* `--requestheader-extra-headers-prefix` 可选字段，在 Kubernetes 1.6 版本以后支持，大小写不敏感。
  建议设置为 "X-Remote-Extra-"。用来设置一个头部字段的前缀字符串，
  API 服务器会基于所给前缀来查找与用户有关的一些额外信息。这些额外信息通常用于所配置的鉴权插件。
  API 服务器会将与所给前缀匹配的头部字段过滤出来，去掉其前缀部分，将剩余部分转换为小写字符串，
  并在必要时执行[百分号解码](https://tools.ietf.org/html/rfc3986#section-2.1)后，
  构造新的附加信息字段键名。原来的头部字段值直接作为附加信息字段的值。

{{< note >}}
<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), the extra key could only contain characters which
were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
在 1.13.3 版本之前（包括 1.10.7、1.9.11），附加字段的键名只能包含
[HTTP 头部标签的合法字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)。
{{< /note >}}

<!--
For example, with this configuration:
-->
例如，使用下面的配置：

```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

<!--
this request:
-->
针对所收到的如下请求：

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

<!--
would result in this user info:
-->
会生成下面的用户信息：

```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  acme.com/project:
  - some-project
  scopes:
  - openid
  - profile
```

<!--
In order to prevent header spoofing, the authenticating proxy is required to present a valid client
certificate to the API server for validation against the specified CA before the request headers are
checked. WARNING: do **not** reuse a CA that is used in a different context unless you understand
the risks and the mechanisms to protect the CA's usage.

* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate
  must be presented and validated against the certificate authorities in the specified file before the
  request headers are checked for user names.
* `--requestheader-allowed-names` Optional. List of Common Name values (CNs). If set, a valid client
  certificate with a CN in the specified list must be presented before the request headers are checked
  for user names. If empty, any CN is allowed.
-->
为了防范头部信息侦听，在请求中的头部字段被检视之前，
身份认证代理需要向 API 服务器提供一份合法的客户端证书，供后者使用所给的 CA 来执行验证。
警告：**不要**在不同的上下文中复用 CA 证书，除非你清楚这样做的风险是什么以及应如何保护
CA 用法的机制。

* `--requestheader-client-ca-file` 必需字段，给出 PEM 编码的证书包。
  在检查请求的头部字段以提取用户名信息之前，必须提供一个合法的客户端证书，
  且该证书要能够被所给文件中的机构所验证。
* `--requestheader-allowed-names` 可选字段，用来给出一组公共名称（CN）。
  如果此标志被设置，则在检视请求中的头部以提取用户信息之前，
  必须提供包含此列表中所给的 CN 名的、合法的客户端证书。

<!--
## Anonymous requests

When enabled, requests that are not rejected by other configured authentication methods are
treated as anonymous requests, and given a username of `system:anonymous` and a group of
`system:unauthenticated`.
-->
## 匿名请求   {#anonymous-requests}

启用匿名请求支持之后，如果请求没有被已配置的其他身份认证方法拒绝，
则被视作匿名请求（Anonymous Requests）。这类请求获得用户名 `system:anonymous`
和对应的用户组 `system:unauthenticated`。

<!--
For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error.
A request providing no bearer token would be treated as an anonymous request.

In 1.5.1-1.5.x, anonymous access is disabled by default, and can be enabled by
passing the `--anonymous-auth=true` option to the API server.
-->
例如，在一个配置了令牌身份认证且启用了匿名访问的服务器上，如果请求提供了非法的持有者令牌，
则会返回 `401 Unauthorized` 错误。如果请求没有提供持有者令牌，则被视为匿名请求。

在 1.5.1-1.5.x 版本中，匿名访问默认情况下是被禁用的，可以通过为 API 服务器设定
`--anonymous-auth=true` 来启用。

<!--
In 1.6+, anonymous access is enabled by default if an authorization mode other than `AlwaysAllow`
is used, and can be disabled by passing the `--anonymous-auth=false` option to the API server.
Starting in 1.6, the ABAC and RBAC authorizers require explicit authorization of the
`system:anonymous` user or the `system:unauthenticated` group, so legacy policy rules
that grant access to the `*` user or `*` group do not include anonymous users.
-->
在 1.6 及之后版本中，如果所使用的鉴权模式不是 `AlwaysAllow`，则匿名访问默认是被启用的。
从 1.6 版本开始，ABAC 和 RBAC 鉴权模块要求对 `system:anonymous` 用户或者
`system:unauthenticated` 用户组执行显式的权限判定，所以之前的为用户 `*` 或用户组
`*` 赋予访问权限的策略规则都不再包含匿名用户。

<!--
### Anonymous Authenticator Configuration
-->
### 匿名身份认证模块配置   {#anonymous-authenticator-configuration}

{{< feature-state feature_gate_name="AnonymousAuthConfigurableEndpoints" >}}

<!--
The `AuthenticationConfiguration` can be used to configure the anonymous
authenticator. To enable configuring anonymous auth via the config file you need
enable the `AnonymousAuthConfigurableEndpoints` feature gate. When this feature
gate is enabled you cannot set the `--anonymous-auth` flag.
-->
`AuthenticationConfiguration` 可用于配置匿名身份认证模块。
要通过配置文件启用匿名身份认证配置，你需要启用 `AnonymousAuthConfigurableEndpoints` 特性门控。
当此特性门控被启用时，你不能设置 `--anonymous-auth` 标志。

<!--
The main advantage of configuring anonymous authenticator using the authentication
configuration file is that in addition to enabling and disabling anonymous authentication
you can also configure which endpoints support anonymous authentication.

A sample authentication configuration file is below:
-->
使用身份认证配置文件来配置匿名身份认证模块的主要优点是，
除了启用和禁用匿名身份认证外，你还可以配置哪些端点支持匿名身份认证。

以下是一个身份认证配置文件示例：

<!--
```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
```
-->
```yaml
---
#
# 注意：这是一个示例配置。
#      请勿将其用于你自己的集群！
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
anonymous:
  enabled: true
  conditions:
  - path: /livez
  - path: /readyz
  - path: /healthz
```

<!--
In the configuration above only the `/livez`, `/readyz` and `/healthz` endpoints
are reachable by anonymous requests. Any other endpoints will not be reachable
even if it is allowed by RBAC configuration.
-->
在上述配置中，只有 `/livez`、`/readyz` 和 `/healthz` 端点可以通过匿名请求进行访问。
即使 RBAC 配置允许进行匿名请求，也不可以访问任何其他端点。

<!--
## User impersonation

A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.
-->
## 用户伪装  {#user-impersonation}

一个用户可以通过伪装（Impersonation）头部字段来以另一个用户的身份执行操作。
使用这一能力，你可以手动重载请求被身份认证所识别出来的用户信息。
例如，管理员可以使用这一功能特性来临时伪装成另一个用户，查看请求是否被拒绝，
从而调试鉴权策略中的问题，

<!--
Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.

* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users have impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.
-->
带伪装的请求首先会被身份认证识别为发出请求的用户，
之后会切换到使用被伪装的用户的用户信息。

* 用户发起 API 调用时**同时**提供自身的凭据和伪装头部字段信息。
* API 服务器对用户执行身份认证。
* API 服务器确认通过认证的用户具有伪装特权。
* 请求用户的信息被替换成伪装字段的值。
* 评估请求，鉴权组件针对所伪装的用户信息执行操作。

<!--
The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups.
  Optional. Requires "Impersonate-User".
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user.
  Optional. Requires "Impersonate-User". In order to be preserved consistently, `( extra name )`
  must be lower-case, and any characters which aren't [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6)
  MUST be utf8 and [percent-encoded](https://tools.ietf.org/html/rfc3986#section-2.1).
* `Impersonate-Uid`: A unique identifier that represents the user being impersonated. Optional.
  Requires "Impersonate-User". Kubernetes does not impose any format requirements on this string.
-->
以下 HTTP 头部字段可用来执行伪装请求：

* `Impersonate-User`：要伪装成的用户名
* `Impersonate-Group`：要伪装成的用户组名。可以多次指定以设置多个用户组。
  可选字段；要求 "Impersonate-User" 必须被设置。
* `Impersonate-Extra-<附加名称>`：一个动态的头部字段，用来设置与用户相关的附加字段。
  此字段可选；要求 "Impersonate-User" 被设置。为了能够以一致的形式保留，
  `<附加名称>`部分必须是小写字符，
  如果有任何字符不是[合法的 HTTP 头部标签字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)，
  则必须是 utf8 字符，且转换为[百分号编码](https://tools.ietf.org/html/rfc3986#section-2.1)。
* `Impersonate-Uid`：一个唯一标识符，用来表示所伪装的用户。此头部可选。
  如果设置，则要求 "Impersonate-User" 也存在。Kubernetes 对此字符串没有格式要求。

{{< note >}}
<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), `( extra name )` could only contain characters which
were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
在 1.11.3 版本之前（以及 1.10.7、1.9.11），`<附加名称>` 只能包含合法的 HTTP 标签字符。
{{< /note >}}

{{< note >}}
<!--
`Impersonate-Uid` is only available in versions 1.22.0 and higher.
-->
`Impersonate-Uid` 仅在 1.22.0 及更高版本中可用。
{{< /note >}}

<!--
An example of the impersonation headers used when impersonating a user with groups:
-->
伪装带有用户组的用户时，所使用的伪装头部字段示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

<!--
An example of the impersonation headers used when impersonating a user with a UID and
extra fields:
-->
伪装带有 UID 和附加字段的用户时，所使用的伪装头部字段示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
```

<!--
When using `kubectl` set the `--as` flag to configure the `Impersonate-User`
header, set the `--as-group` flag to configure the `Impersonate-Group` header.
-->
在使用 `kubectl` 时，可以使用 `--as` 标志来配置 `Impersonate-User` 头部字段值，
使用 `--as-group` 标志配置 `Impersonate-Group` 头部字段值。

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

<!--
Set the `--as` and `--as-group` flag:
-->
设置 `--as` 和 `--as-group` 标志：

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

{{< note >}}
<!--
`kubectl` cannot impersonate extra fields or UIDs.
-->
`kubectl` 不能对附加字段或 UID 执行伪装。
{{< /note >}}

<!--
To impersonate a user, group, user identifier (UID) or extra fields, the impersonating user must
have the ability to perform the "impersonate" verb on the kind of attribute
being impersonated ("user", "group", "uid", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:
-->
若要伪装成某个用户、某个组、用户标识符（UID））或者设置附加字段，
执行伪装操作的用户必须具有对所伪装的类别（`user`、`group`、`uid` 等）执行 `impersonate`
动词操作的能力。
对于启用了 RBAC 鉴权插件的集群，下面的 ClusterRole 封装了设置用户和组伪装字段所需的规则：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

<!--
For impersonation, extra fields and impersonated UIDs are both under the "authentication.k8s.io" `apiGroup`.
Extra fields are evaluated as sub-resources of the resource "userextras". To
allow a user to use impersonation headers for the extra field "scopes" and
for UIDs, a user should be granted the following role:
-->
为了执行伪装，附加字段和所伪装的 UID 都位于 "authorization.k8s.io" `apiGroup` 中。
附加字段会被作为 `userextras` 资源的子资源来执行权限评估。
如果要允许用户为附加字段 “scopes” 和 UID 设置伪装头部，该用户需要被授予以下角色：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# 可以设置 "Impersonate-Extra-scopes" 和 "Impersonate-Uid" 头部
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

<!--
The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.
-->
你也可以通过约束资源可能对应的 `resourceNames` 限制伪装头部的取值：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
  # 可以伪装成用户 "jane.doe@example.com"
  - apiGroups: [""]
    resources: ["users"]
    verbs: ["impersonate"]
    resourceNames: ["jane.doe@example.com"]
  
  # 可以伪装成用户组 "developers" 和 "admins"
  - apiGroups: [""]
    resources: ["groups"]
    verbs: ["impersonate"]
    resourceNames: ["developers","admins"]
  
  # 可以将附加字段 "scopes" 伪装成 "view" 和 "development"
  - apiGroups: ["authentication.k8s.io"]
    resources: ["userextras/scopes"]
    verbs: ["impersonate"]
    resourceNames: ["view", "development"]
  
  # 可以伪装 UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
  - apiGroups: ["authentication.k8s.io"]
    resources: ["uids"]
    verbs: ["impersonate"]
    resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
<!--
Impersonating a user or group allows you to perform any action as if you were that user or group;
for that reason, impersonation is not namespace scoped.
If you want to allow impersonation using Kubernetes RBAC,
this requires using a `ClusterRole` and a `ClusterRoleBinding`,
not a `Role` and `RoleBinding`.
-->
基于伪装成一个用户或用户组的能力，你可以执行任何操作，好像你就是那个用户或用户组一样。
出于这一原因，伪装操作是不受名字空间约束的。
如果你希望允许使用 Kubernetes RBAC 来执行身份伪装，就需要使用 `ClusterRole`
和 `ClusterRoleBinding`，而不是 `Role` 或 `RoleBinding`。
{{< /note >}}

<!--
## client-go credential plugins
-->
## client-go 凭据插件  {#client-go-credential-plugins}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
`k8s.io/client-go` and tools using it such as `kubectl` and `kubelet` are able to execute an
external command to receive user credentials.

This feature is intended for client side integrations with authentication protocols not natively
supported by `k8s.io/client-go` (LDAP, Kerberos, OAuth2, SAML, etc.). The plugin implements the
protocol specific logic, then returns opaque credentials to use. Almost all credential plugin
use cases require a server side component with support for the [webhook token authenticator](#webhook-token-authentication)
to interpret the credential format produced by the client plugin.
-->
`k8s.io/client-go` 及使用它的工具（如 `kubectl` 和 `kubelet`）
可以执行某个外部命令来获得用户的凭据信息。

这一特性的目的是便于客户端与 `k8s.io/client-go` 并不支持的身份认证协议
（LDAP、Kerberos、OAuth2、SAML 等）继承。
插件实现特定于协议的逻辑，之后返回不透明的凭据以供使用。
几乎所有的凭据插件使用场景中都需要在服务器端存在一个支持
[Webhook 令牌身份认证组件](#webhook-token-authentication)的模块，
负责解析客户端插件所生成的凭据格式。

{{< note >}}
<!--
Earlier versions of `kubectl` included built-in support for authenticating to AKS and GKE, but this is no longer present.
-->
早期版本的 `kubectl` 内置了对 AKS 和 GKE 的认证支持，但这一功能已不再存在。
{{< /note >}}

<!--
### Example use case

In a hypothetical use case, an organization would run an external service that exchanges LDAP credentials
for user specific, signed tokens. The service would also be capable of responding to [webhook token
authenticator](#webhook-token-authentication) requests to validate the tokens. Users would be required
to install a credential plugin on their workstation.
-->
### 示例应用场景   {#example-use-case}

在一个假想的应用场景中，某组织运行这一个外部的服务，能够将特定用户的已签名的令牌转换成
LDAP 凭据。此服务还能够对
[Webhook 令牌身份认证组件](#webhook-token-authentication)的请求做出响应以验证所提供的令牌。
用户需要在自己的工作站上安装一个凭据插件。

<!--
To authenticate against the API:

* The user issues a `kubectl` command.
* Credential plugin prompts the user for LDAP credentials, exchanges credentials with external service for a token.
* Credential plugin returns token to client-go, which uses it as a bearer token against the API server.
* API server uses the [webhook token authenticator](#webhook-token-authentication) to submit a `TokenReview` to the external service.
* External service verifies the signature on the token and returns the user's username and groups.
-->
要对 API 服务器认证身份时：

* 用户发出 `kubectl` 命令。
* 凭据插件提示用户输入 LDAP 凭据，并与外部服务交互，获得令牌。
* 凭据插件将令牌返回该 client-go，后者将其用作持有者令牌提交给 API 服务器。
* API 服务器使用 [Webhook 令牌身份认证组件](#webhook-token-authentication)向外部服务发出
  `TokenReview` 请求。
* 外部服务检查令牌上的签名，返回用户的用户名和用户组信息。

<!--
### Configuration

Credential plugins are configured through [kubectl config files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
as part of the user fields.
-->
### 配置  {#configuration}

凭据插件通过 [kubectl 配置文件](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
来作为 user 字段的一部分设置。

{{< tabs name="exec_plugin_kubeconfig_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}

<!--
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1beta1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Required.
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
-->
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # 要执行的命令。必需。
      command: "example-client-go-exec-plugin"

      # 解析 ExecCredentials 资源时使用的 API 版本。必需。
      # 插件返回的 API 版本必需与这里列出的版本匹配。
      #
      # 要与支持多个版本的工具（如 client.authentication.k8s.io/v1beta1）集成，
      # 可以设置一个环境变量或者向工具传递一个参数标明 exec 插件所期望的版本，
      # 或者从 KUBERNETES_EXEC_INFO 环境变量的 ExecCredential 对象中读取版本信息。
      apiVersion: "client.authentication.k8s.io/v1"

      # 执行此插件时要设置的环境变量。可选字段。
      env:
      - name: "FOO"
        value: "bar"

      # 执行插件时要传递的参数。可选字段。
      args:
      - "arg1"
      - "arg2"

      # 当可执行文件不存在时显示给用户的文本。可选的。
      installHint: |
        需要 example-client-go-exec-plugin 来在当前集群上执行身份认证。可以通过以下命令安装：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 环境变量的一部分向这个 exec 插件
      # 提供集群信息（可能包含非常大的 CA 数据）
      provideClusterInfo: true

      # Exec 插件与标准输入 I/O 数据流之间的协议。如果协议无法满足，
      # 则插件无法运行并会返回错误信息。合法的值包括 "Never" （Exec 插件从不使用标准输入），
      # "IfAvailable" （Exec 插件希望在可以的情况下使用标准输入），
      # 或者 "Always" （Exec 插件需要使用标准输入才能工作）。必需字段。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 为每个集群 exec 配置保留的扩展名
      extension:
        arbitrary: config
        this: 在设置 provideClusterInfo 时可通过环境变量 KUBERNETES_EXEC_INFO 指定
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
<!--
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # Command to execute. Required.
      command: "example-client-go-exec-plugin"

      # API version to use when decoding the ExecCredentials resource. Required.
      #
      # The API version returned by the plugin MUST match the version listed here.
      #
      # To integrate with tools that support multiple versions (such as client.authentication.k8s.io/v1),
      # set an environment variable, pass an argument to the tool that indicates which version the exec plugin expects,
      # or read the version from the ExecCredential object in the KUBERNETES_EXEC_INFO environment variable.
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # Environment variables to set when executing the plugin. Optional.
      env:
      - name: "FOO"
        value: "bar"

      # Arguments to pass when executing the plugin. Optional.
      args:
      - "arg1"
      - "arg2"

      # Text shown to the user when the executable doesn't seem to be present. Optional.
      installHint: |
        example-client-go-exec-plugin is required to authenticate
        to the current cluster.  It can be installed:

        On macOS: brew install example-client-go-exec-plugin

        On Ubuntu: apt-get install example-client-go-exec-plugin

        On Fedora: dnf install example-client-go-exec-plugin

        ...

      # Whether or not to provide cluster information, which could potentially contain
      # very large CA data, to this exec plugin as a part of the KUBERNETES_EXEC_INFO
      # environment variable.
      provideClusterInfo: true

      # The contract between the exec plugin and the standard input I/O stream. If the
      # contract cannot be satisfied, this plugin will not be run and an error will be
      # returned. Valid values are "Never" (this exec plugin never uses standard input),
      # "IfAvailable" (this exec plugin wants to use standard input if it is available),
      # or "Always" (this exec plugin requires standard input to function). Optional.
      # Defaults to "IfAvailable".
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # reserved extension name for per cluster exec config
      extension:
        arbitrary: config
        this: can be provided via the KUBERNETES_EXEC_INFO environment variable upon setting provideClusterInfo
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```
-->
```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # 要执行的命令。必需。
      command: "example-client-go-exec-plugin"

      # 解析 ExecCredentials 资源时使用的 API 版本。必需。
      # 插件返回的 API 版本必需与这里列出的版本匹配。
      #
      # 要与支持多个版本的工具（如 client.authentication.k8s.io/v1）集成，
      # 可以设置一个环境变量或者向工具传递一个参数标明 exec 插件所期望的版本，
      # 或者从 KUBERNETES_EXEC_INFO 环境变量的 ExecCredential 对象中读取版本信息。
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # 执行此插件时要设置的环境变量。可选字段。
      env:
      - name: "FOO"
        value: "bar"

      # 执行插件时要传递的参数。可选字段。
      args:
      - "arg1"
      - "arg2"

      # 当可执行文件不存在时显示给用户的文本。可选的。
      installHint: |
        需要 example-client-go-exec-plugin 来在当前集群上执行身份认证。可以通过以下命令安装：

        MacOS: brew install example-client-go-exec-plugin

        Ubuntu: apt-get install example-client-go-exec-plugin

        Fedora: dnf install example-client-go-exec-plugin

        ...

      # 是否使用 KUBERNETES_EXEC_INFO 环境变量的一部分向这个 exec 插件
      # 提供集群信息（可能包含非常大的 CA 数据）
      provideClusterInfo: true

      # Exec 插件与标准输入 I/O 数据流之间的协议。如果协议无法满足，
      # 则插件无法运行并会返回错误信息。合法的值包括 "Never"（Exec 插件从不使用标准输入），
      # "IfAvailable" （Exec 插件希望在可以的情况下使用标准输入），
      # 或者 "Always" （Exec 插件需要使用标准输入才能工作）。可选字段。
      # 默认值为 "IfAvailable"。
      interactiveMode: Never
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
    extensions:
    - name: client.authentication.k8s.io/exec # 为每个集群 exec 配置保留的扩展名
      extension:
        arbitrary: config
        this: 在设置 provideClusterInfo 时可通过环境变量 KUBERNETES_EXEC_INFO 指定
        you: ["can", "put", "anything", "here"]
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```

{{% /tab %}}
{{< /tabs >}}

<!--
Relative command paths are interpreted as relative to the directory of the config file. If
KUBECONFIG is set to `/home/jane/kubeconfig` and the exec command is `./bin/example-client-go-exec-plugin`,
the binary `/home/jane/bin/example-client-go-exec-plugin` is executed.
-->
解析相对命令路径时，kubectl 将其视为与配置文件比较而言的相对路径。
如果 KUBECONFIG 被设置为 `/home/jane/kubeconfig`，而 exec 命令为
`./bin/example-client-go-exec-plugin`，则要执行的可执行文件为
`/home/jane/bin/example-client-go-exec-plugin`。

```yaml
- name: my-user
  user:
    exec:
      # 对 kubeconfig 目录而言的相对路径
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1"
      interactiveMode: Never
```

<!--
### Input and output formats

The executed command prints an `ExecCredential` object to `stdout`. `k8s.io/client-go`
authenticates against the Kubernetes API using the returned credentials in the `status`.
The executed command is passed an `ExecCredential` object as input via the `KUBERNETES_EXEC_INFO`
environment variable. This input contains helpful information like the expected API version
of the returned `ExecCredential` object and whether or not the plugin can use `stdin` to interact
with the user.
-->
### 输出和输出格式   {#input-and-output-formats}

所执行的命令会在 `stdout` 打印 `ExecCredential` 对象。
`k8s.io/client-go` 使用 `status` 中返回的凭据信息向 Kubernetes API 服务器执行身份认证。
所执行的命令会通过环境变量 `KUBERNETES_EXEC_INFO` 收到一个 `ExecCredential` 对象作为其输入。
此输入中包含类似于所返回的 `ExecCredential` 对象的预期 API 版本，
以及是否插件可以使用 `stdin` 与用户交互这类信息。

<!--
When run from an interactive session (i.e., a terminal), `stdin` can be exposed directly
to the plugin. Plugins should use the `spec.interactive` field of the input
`ExecCredential` object from the `KUBERNETES_EXEC_INFO` environment variable in order to
determine if `stdin` has been provided. A plugin's `stdin` requirements (i.e., whether
`stdin` is optional, strictly required, or never used in order for the plugin
to run successfully) is declared via the `user.exec.interactiveMode` field in the
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (see table
below for valid values). The `user.exec.interactiveMode` field is optional in `client.authentication.k8s.io/v1beta1`
and required in `client.authentication.k8s.io/v1`.
-->

在交互式会话（即，某终端）中运行时，`stdin` 是直接暴露给插件使用的。
插件应该使用来自 `KUBERNETES_EXEC_INFO` 环境变量的 `ExecCredential`
输入对象中的 `spec.interactive` 字段来确定是否提供了 `stdin`。
插件的 `stdin` 需求（即，为了能够让插件成功运行，是否 `stdin` 是可选的、
必须提供的或者从不会被使用的）是通过
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec.interactiveMode` 来声明的（参见下面的表格了解合法值）。
字段 `user.exec.interactiveMode` 在 `client.authentication.k8s.io/v1beta1`
中是可选的，在 `client.authentication.k8s.io/v1` 中是必需的。

<!--
| `interactiveMode` Value | Meaning |
| ----------------------- | ------- |
| `Never` | This exec plugin never needs to use standard input, and therefore the exec plugin will be run regardless of whether standard input is available for user input. |
| `IfAvailable` | This exec plugin would like to use standard input if it is available, but can still operate if standard input is not available. Therefore, the exec plugin will be run regardless of whether stdin is available for user input. If standard input is available for user input, then it will be provided to this exec plugin. |
| `Always` | This exec plugin requires standard input in order to run, and therefore the exec plugin will only be run if standard input is available for user input. If standard input is not available for user input, then the exec plugin will not be run and an error will be returned by the exec plugin runner. |
-->
{{< table caption="interactiveMode 取值" >}}
| `interactiveMode` 取值  | 含义    |
| ----------------------- | ------- |
| `Never` | 此 exec 插件从不需要使用标准输入，因此如论是否有标准输入提供给用户输入，该 exec 插件都能运行。 |
| `IfAvailable` | 此 exec 插件希望在标准输入可用的情况下使用标准输入，但在标准输入不存在时也可运行。因此，无论是否存在给用户提供输入的标准输入，此 exec 插件都会运行。如果存在供用户输入的标准输入，则该标准输入会被提供给 exec 插件。 |
| `Always` | 此 exec 插件需要标准输入才能正常运行，因此只有存在供用户输入的标准输入时，此 exec 插件才会运行。如果不存在供用户输入的标准输入，则 exec 插件无法运行，并且 exec 插件的执行者会因此返回错误信息。 |
{{< /table >}}

<!--
To use bearer token credentials, the plugin returns a token in the status of the
[`ExecCredential`](/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
-->
与使用持有者令牌凭据，插件在 [`ExecCredential`](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/#client-authentication-k8s-io-v1beta1-ExecCredential)
的状态中返回一个令牌：

{{< tabs name="exec_plugin_ExecCredential_example_1" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
Alternatively, a PEM-encoded client certificate and key can be returned to use TLS client auth.
If the plugin returns a different certificate and key on a subsequent call, `k8s.io/client-go`
will close existing connections with the server to force a new TLS handshake.

If specified, `clientKeyData` and `clientCertificateData` must both must be present.

`clientCertificateData` may contain additional intermediate certificates to send to the server.
-->
另一种方案是，返回 PEM 编码的客户端证书和密钥，以便执行 TLS 客户端身份认证。
如果插件在后续调用中返回了不同的证书或密钥，`k8s.io/client-go`
会终止其与服务器的连接，从而强制执行新的 TLS 握手过程。

如果指定了这种方式，则 `clientKeyData` 和 `clientCertificateData` 字段都必须存在。

`clientCertificateData` 字段可能包含一些要发送给服务器的中间证书（Intermediate
Certificates）。

{{< tabs name="exec_plugin_ExecCredential_example_2" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
Optionally, the response can include the expiry of the credential formatted as a
[RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) timestamp.

Presence or absence of an expiry has the following impact:

- If an expiry is included, the bearer token and TLS credentials are cached until
  the expiry time is reached, or if the server responds with a 401 HTTP status code,
  or when the process exits.
- If an expiry is omitted, the bearer token and TLS credentials are cached until
  the server responds with a 401 HTTP status code or until the process exits.
-->
作为一种可选方案，响应中还可以包含以 [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339)
时间戳格式给出的证书到期时间。
证书到期时间的有无会有如下影响：

- 如果响应中包含了到期时间，持有者令牌和 TLS 凭据会被缓存，直到期限到来、
  或者服务器返回 401 HTTP 状态码，或者进程退出。
- 如果未指定到期时间，则持有者令牌和 TLS 凭据会被缓存，直到服务器返回 401
  HTTP 状态码或者进程退出。

{{< tabs name="exec_plugin_ExecCredential_example_3" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
To enable the exec plugin to obtain cluster-specific information, set `provideClusterInfo` on the `user.exec`
field in the [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
The plugin will then be supplied this cluster-specific information in the `KUBERNETES_EXEC_INFO` environment variable.
Information from this environment variable can be used to perform cluster-specific
credential acquisition logic.
The following `ExecCredential` manifest describes a cluster information sample.
-->
为了让 exec 插件能够获得特定与集群的信息，可以在
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
中的 `user.exec` 设置 `provideClusterInfo`。
这一特定于集群的信息就会通过 `KUBERNETES_EXEC_INFO` 环境变量传递给插件。
此环境变量中的信息可以用来执行特定于集群的凭据获取逻辑。
下面的 `ExecCredential` 清单描述的是一个示例集群信息。

{{< tabs name="exec_plugin_ExecCredential_example_4" >}}
{{% tab name="client.authentication.k8s.io/v1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "可以在设置 provideClusterInfo 时通过 KUBERNETES_EXEC_INFO 环境变量提供",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{% tab name="client.authentication.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "spec": {
    "cluster": {
      "server": "https://172.17.4.100:6443",
      "certificate-authority-data": "LS0t...",
      "config": {
        "arbitrary": "config",
        "this": "可以在设置 provideClusterInfo 时通过 KUBERNETES_EXEC_INFO 环境变量提供",
        "you": ["can", "put", "anything", "here"]
      }
    },
    "interactive": true
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
## API access to authentication information for a client {#self-subject-review}
-->
## 为客户端提供的对身份认证信息的 API 访问   {#self-subject-review}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
If your cluster has the API enabled, you can use the `SelfSubjectReview` API to find out
how your Kubernetes cluster maps your authentication information to identify you as a client.
This works whether you are authenticating as a user (typically representing
a real person) or as a ServiceAccount.

`SelfSubjectReview` objects do not have any configurable fields. On receiving a request,
the Kubernetes API server fills the status with the user attributes and returns it to the user.

Request example (the body would be a `SelfSubjectReview`):
-->
如果集群启用了此 API，你可以使用 `SelfSubjectReview` API 来了解 Kubernetes
集群如何映射你的身份认证信息从而将你识别为某客户端。无论你是作为用户（通常代表一个真的人）还是作为
ServiceAccount 进行身份认证，这一 API 都可以使用。

`SelfSubjectReview` 对象没有任何可配置的字段。
Kubernetes API 服务器收到请求后，将使用用户属性填充 status 字段并将其返回给用户。

请求示例（主体将是 `SelfSubjectReview`）：

```http
POST /apis/authentication.k8s.io/v1/selfsubjectreviews
```

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview"
}
```

<!--
Response example:
-->
响应示例：

```json
{
  "apiVersion": "authentication.k8s.io/v1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "name": "jane.doe",
      "uid": "b6c7cfd4-f166-11ec-8ea0-0242ac120002",
      "groups": [
        "viewers",
        "editors",
        "system:authenticated"
      ],
      "extra": {
        "provider_id": ["token.company.example"]
      }
    }
  }
}
```

<!--
For convenience, the `kubectl auth whoami` command is present. Executing this command will
produce the following output (yet different user attributes will be shown):

* Simple output example
-->
为了方便，Kubernetes 提供了 `kubectl auth whoami` 命令。
执行此命令将产生以下输出（但将显示不同的用户属性）：

* 简单的输出示例

  ```
  ATTRIBUTE         VALUE
  Username          jane.doe
  Groups            [system:authenticated]
  ```

<!--
* Complex example including extra attributes
-->
* 包括额外属性的复杂示例

  ```
  ATTRIBUTE         VALUE
  Username          jane.doe
  UID               b79dbf30-0c6a-11ed-861d-0242ac120002
  Groups            [students teachers system:authenticated]
  Extra: skills     [reading learning]
  Extra: subjects   [math sports]
  ```

<!--
By providing the output flag, it is also possible to print the JSON or YAML representation of the result:
-->
通过提供 output 标志，也可以打印结果的 JSON 或 YAML 表现形式：

{{< tabs name="self_subject_attributes_review_Example_1" >}}
{{% tab name="JSON" %}}
```json
{
  "apiVersion": "authentication.k8s.io/v1alpha1",
  "kind": "SelfSubjectReview",
  "status": {
    "userInfo": {
      "username": "jane.doe",
      "uid": "b79dbf30-0c6a-11ed-861d-0242ac120002",
      "groups": [
        "students",
        "teachers",
        "system:authenticated"
      ],
      "extra": {
        "skills": [
          "reading",
          "learning"
        ],
        "subjects": [
          "math",
          "sports"
        ]
      }
    }
  }
}
```
{{% /tab %}}

{{% tab name="YAML" %}}
```yaml
apiVersion: authentication.k8s.io/v1
kind: SelfSubjectReview
status:
  userInfo:
    username: jane.doe
    uid: b79dbf30-0c6a-11ed-861d-0242ac120002
    groups:
    - students
    - teachers
    - system:authenticated
    extra:
      skills:
      - reading
      - learning
      subjects:
      - math
      - sports
```
{{% /tab %}}
{{< /tabs >}}

<!--
This feature is extremely useful when a complicated authentication flow is used in a Kubernetes cluster,
for example, if you use [webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
or [authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).
-->
在 Kubernetes 集群中使用复杂的身份认证流程时，例如如果你使用
[Webhook 令牌身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)或
[身份认证代理](/zh-cn/docs/reference/access-authn-authz/authentication/#authenticating-proxy)时，
此特性极其有用。

{{< note >}}
<!--
The Kubernetes API server fills the `userInfo` after all authentication mechanisms are applied,
including [impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation).
If you, or an authentication proxy, make a SelfSubjectReview using impersonation,
you see the user details and properties for the user that was impersonated.
-->
Kubernetes API 服务器在所有身份认证机制
（包括[伪装](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)），
被应用后填充 `userInfo`，
如果你或某个身份认证代理使用伪装进行 SelfSubjectReview，你会看到被伪装用户的用户详情和属性。
{{< /note >}}

<!--
By default, all authenticated users can create `SelfSubjectReview` objects when the `APISelfSubjectReview`
feature is enabled. It is allowed by the `system:basic-user` cluster role.
-->
默认情况下，所有经过身份认证的用户都可以在 `APISelfSubjectReview` 特性被启用时创建 `SelfSubjectReview` 对象。
这是 `system:basic-user` 集群角色允许的操作。

{{< note >}}
<!--
You can only make `SelfSubjectReview` requests if:

* the `APISelfSubjectReview`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled for your cluster (not needed for Kubernetes {{< skew currentVersion >}}, but older
  Kubernetes versions might not offer this feature gate, or might default it to be off)
* (if you are running a version of Kubernetes older than v1.28) the API server for your
  cluster has the `authentication.k8s.io/v1alpha1` or `authentication.k8s.io/v1beta1`
* the API server for your cluster has the `authentication.k8s.io/v1alpha1` or `authentication.k8s.io/v1beta1`
  {{< glossary_tooltip term_id="api-group" text="API group" >}}
  enabled.
-->
你只能在以下情况下进行 `SelfSubjectReview` 请求：

* 集群启用了 `APISelfSubjectReview`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  （Kubernetes {{< skew currentVersion >}} 不需要，但较旧的 Kubernetes 版本可能没有此特性门控，
  或者默认为关闭状态）。
* （如果你运行的 Kubernetes 版本早于 v1.28 版本）集群的 API 服务器包含
  `authentication.k8s.io/v1alpha1` 或 `authentication.k8s.io/v1beta1` API 组。
* 集群的 API 服务器已启用 `authentication.k8s.io/v1alpha1` 或者 `authentication.k8s.io/v1beta1`
  {{< glossary_tooltip term_id="api-group" text="API 组" >}}。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read the [client authentication reference (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
* Read the [client authentication reference (v1)](/docs/reference/config-api/client-authentication.v1/)
-->
* 阅读[客户端认证参考文档（v1beta1）](/zh-cn/docs/reference/config-api/client-authentication.v1beta1/)。
* 阅读[客户端认证参考文档（v1）](/zh-cn/docs/reference/config-api/client-authentication.v1/)。
