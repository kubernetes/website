---
title: 加固指南 - 身份认证机制
description: >
  有关 Kubernetes 中的认证选项及其安全属性的信息。
content_type: concept
weight: 90
---
<!--
---
title: Hardening Guide - Authentication Mechanisms
description: >
  Information on authentication options in Kubernetes and their security properties.
content_type: concept
weight: 90
---
-->

<!-- overview -->

<!--
Selecting the appropriate authentication mechanism(s) is a crucial aspect of securing your cluster.
Kubernetes provides several built-in mechanisms, each with its own strengths and weaknesses that 
should be carefully considered when choosing the best authentication mechanism for your cluster.
-->
选择合适的身份认证机制是确保集群安全的一个重要方面。
Kubernetes 提供了多种内置机制，
当为你的集群选择最好的身份认证机制时需要谨慎考虑每种机制的优缺点。

<!--
In general, it is recommended to enable as few authentication mechanisms as possible to simplify 
user management and prevent cases where users retain access to a cluster that is no longer required.
-->
通常情况下，建议启用尽可能少的身份认证机制，
以简化用户管理，避免用户仍保有对其不再需要的集群的访问权限的情况。

<!--
It is important to note that Kubernetes does not have an in-built user database within the cluster. 
Instead, it takes user information from the configured authentication system and uses that to make 
authorization decisions. Therefore, to audit user access, you need to review credentials from every 
configured authentication source.
-->
值得注意的是 Kubernetes 集群中并没有内置的用户数据库。
相反，它从已配置的身份认证系统中获取用户信息并依之做出鉴权决策。
因此，要审计用户访问，你需要检视来自每个已配置身份认证数据源的凭据。

<!--
For production clusters with multiple users directly accessing the Kubernetes API, it is 
recommended to use external authentication sources such as OIDC. The internal authentication 
mechanisms, such as client certificates and service account tokens, described below, are not 
suitable for this use-case.
-->
对于有多个用户直接访问 Kubernetes API 的生产集群来说，
建议使用外部身份认证数据源，例如：OIDC。
下文提到的客户端证书和服务账号令牌等内部身份认证机制则不适用这种情况。

<!-- body -->

<!--
## X.509 client certificate authentication {#x509-client-certificate-authentication}
-->
## X.509 客户端证书身份认证 {#x509-client-certificate-authentication}

<!--
Kubernetes leverages [X.509 client certificate](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) 
authentication for system components, such as when the Kubelet authenticates to the API Server. 
While this mechanism can also be used for user authentication, it might not be suitable for 
production use due to several restrictions:
-->
Kubernetes 采用 [X.509 客户端证书](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certificates)
对系统组件进行身份认证，
例如 Kubelet 对 API 服务器进行身份认证时。
虽然这种机制也可以用于用户身份认证，但由于一些限制它可能不太适合在生产中使用：


<!--
- Client certificates cannot be individually revoked. Once compromised, a certificate can be used 
  by an attacker until it expires. To mitigate this risk, it is recommended to configure short 
  lifetimes for user authentication credentials created using client certificates.
-->
- 客户端证书无法独立撤销。
  证书一旦被泄露，攻击者就可以使用它，直到证书过期。
  为了降低这种风险，建议为使用客户端证书创建的用户身份认证凭据配置较短的有效期。
<!--
- If a certificate needs to be invalidated, the certificate authority must be re-keyed, which 
can introduce availability risks to the cluster.
-->
- 如果证书需要被作废，必须重新为证书机构设置密钥，但这样做可能给集群带来可用性风险。
<!--
- There is no permanent record of client certificates created in the cluster. Therefore, all 
issued certificates must be recorded if you need to keep track of them.
-->
- 在集群中创建的客户端证书不会被永久记录。
  因此，如果你要跟踪所有已签发的证书，就必须将它们记录下来。
<!--
- Private keys used for client certificate authentication cannot be password-protected. Anyone 
who can read the file containing the key will be able to make use of it.
-->
- 用于对客户端证书进行身份认证的私钥不可以启用密码保护。
  任何可以读取包含密钥文件的人都可以利用该密钥。
<!--
- Using client certificate authentication requires a direct connection from the client to the 
API server with no intervening TLS termination points, which can complicate network architectures.
-->
- 使用客户端证书身份认证需要客户端直连 API 服务器而不允许中间存在 TLS 终止节点，
  这一约束可能会使网络架构变得复杂。
<!--
- Group data is embedded in the `O` value of the client certificate, which means the user's group 
memberships cannot be changed for the lifetime of the certificate.
-->
- 组数据包含在客户端证书的 `O` 值中，
  这意味着在证书有效期内无法更改用户的组成员身份。

<!--
## Static token file {#static-token-file}、
-->
## 静态令牌文件 {#static-token-file}

<!--
Although Kubernetes allows you to load credentials from a 
[static token file](/docs/reference/access-authn-authz/authentication/#static-token-file) located 
on the control plane node disks, this approach is not recommended for production servers due to 
several reasons:
-->
尽管 Kubernetes 允许你从控制平面节点的磁盘中加载
[静态令牌文件](/zh-cn/docs/reference/access-authn-authz/authentication/#static-token-file)
以获取凭据，但由于多种原因，在生产服务器上不建议采用这种方法：

<!--
- Credentials are stored in clear text on control plane node disks, which can be a security risk.
-->
- 凭据以明文的方式存储在控制平面节点的磁盘中，这可能是一种安全风险。
<!--
- Changing any credential requires a restart of the API server process to take effect, which can 
impact availability.
-->
- 修改任何凭据都需要重启 API 服务进程使其生效，这会影响可用性。
<!--
- There is no mechanism available to allow users to rotate their credentials. To rotate a 
credential, a cluster administrator must modify the token on disk and distribute it to the users.
-->
- 没有现成的机制让用户轮换其凭据数据。
  要轮换凭据数据，集群管理员必须修改磁盘上的令牌并将其分发给用户。
<!--
- There is no lockout mechanism available to prevent brute-force attacks.
-->
- 没有合适的锁机制用以防止暴力破解攻击。

<!--
## Bootstrap tokens {#bootstrap-tokens}
-->
## 启动引导令牌 {#bootstrap-tokens}

<!--
[Bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) are used for joining 
nodes to clusters and are not recommended for user authentication due to several reasons:
-->
[启动引导令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)用于节点加入集群，
因为下列的一些原因，不建议用于用户身份认证：

<!--
- They have hard-coded group memberships that are not suitable for general use, making them 
unsuitable for authentication purposes.
-->
- 启动引导令牌中包含有硬编码的组成员身份，不适合一般使用，
  因此不适用于身份认证目的。
<!--
- Manually generating bootstrap tokens can lead to weak tokens that can be guessed by an attacker, 
which can be a security risk.
-->
- 手动生成启动引导令牌有可能使较弱的令牌容易被攻击者猜到，
  有可能成为安全隐患。
<!--
- There is no lockout mechanism available to prevent brute-force attacks, making it easier for 
attackers to guess or crack the token.
-->
- 没有现成的加锁定机制用来防止暴力破解，
  这使得攻击者更容易猜测或破解令牌。

<!--
## ServiceAccount secret tokens {#serviceaccount-secret-tokens}
-->
## 服务账号令牌 {#serviceaccount-secret-tokens}

<!--
[Service account secrets](/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts) 
are available as an option to allow workloads running in the cluster to authenticate to the 
API server. In Kubernetes < 1.23, these were the default option, however, they are being replaced 
with TokenRequest API tokens. While these secrets could be used for user authentication, they are 
generally unsuitable for a number of reasons:
-->
[服务账号令牌](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts) 
在运行于集群中的工作负载向 API 服务器进行身份认证时是个可选项。
在 Kubernetes < 1.23 的版本中，服务账号令牌是默认选项，但现在已经被 TokenRequest API 取代。
尽管这些密钥可以用于用户身份认证，但由于多种原因，它们通常并不合适：

<!--
- They cannot be set with an expiry and will remain valid until the associated service account is deleted.
-->
- 服务账号令牌无法设置有效期，在相关的服务账号被删除前一直有效。
<!--
- The authentication tokens are visible to any cluster user who can read secrets in the namespace 
that they are defined in.
-->
- 任何集群用户，只要能读取服务账号令牌定义所在的命名空间中的 Secret，就能看到身份认证令牌。
<!--
- Service accounts cannot be added to arbitrary groups complicating RBAC management where they are used.
-->
- 服务账号无法被添加到任意组中，这一限制使得使用服务账号的 RBAC 管理变得复杂。

<!--
## TokenRequest API tokens {#tokenrequest-api-tokens}
-->
## TokenRequest API 令牌 {#tokenrequest-api-tokens}

<!--
The TokenRequest API is a useful tool for generating short-lived credentials for service 
authentication to the API server or third-party systems. However, it is not generally recommended 
for user authentication as there is no revocation method available, and distributing credentials 
to users in a secure manner can be challenging.
-->
TokenRequest API 是一种可生成短期凭据的有用工具，所生成的凭据可
用于对 API 服务器或第三方系统执行服务身份认证。
然而，通常不建议将此机制用于用户身份认证，因为没有办法撤销这些令牌，
而且，如何以安全的方式向用户分发凭据信息也是挑战。

<!--
When using TokenRequest tokens for service authentication, it is recommended to implement a short 
lifespan to reduce the impact of compromised tokens.
-->
当使用 TokenRequest 令牌进行服务身份认证时，
建议使用较短的有效期以减少被泄露令牌可能带来的影响。

<!--
## OpenID Connect token authentication {#openid-connect-token-authentication}
-->
## OpenID Connect 令牌身份认证 {#openid-connect-token-authentication}

<!--
Kubernetes supports integrating external authentication services with the Kubernetes API using 
[OpenID Connect (OIDC)](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens). 
There is a wide variety of software that can be used to integrate Kubernetes with an identity 
provider. However, when using OIDC authentication for Kubernetes, it is important to consider the 
following hardening measures:
-->
Kubernetes 支持使用 [OpenID Connect (OIDC)](/zh-cn/docs/reference/access-authn-authz/authentication/#openid-connect-tokens) 
将外部身份认证服务与 Kubernetes API 集成。
有多种软件可用于将 Kubernetes 与认证服务组件集成。
不过，当为 Kubernetes 使用 OIDC 身份认证时，
必须考虑以下加固措施：

<!--
- The software installed in the cluster to support OIDC authentication should be isolated from 
general workloads as it will run with high privileges.
-->
- 安装在集群中用于支持 OIDC 身份认证的软件应该与普通的工作负载隔离，
  因为它要以较高的特权来运行。
<!--
- Some Kubernetes managed services are limited in the OIDC providers that can be used.
-->
- 有些 Kubernetes 托管服务对可使用的 OIDC 服务组件有限制。
<!--
- As with TokenRequest tokens, OIDC tokens should have a short lifespan to reduce the impact of 
compromised tokens.
-->
- 与 TokenRequest 令牌一样，OIDC 令牌的有效期也应较短，以减少被泄露的令牌所带来的影响。

<!--
## Webhook token authentication {#webhook-token-authentication}
-->
## Webhook 令牌身份认证 {#webhook-token-authentication}

<!--
[Webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) 
is another option for integrating external authentication providers into Kubernetes. This mechanism 
allows for an authentication service, either running inside the cluster or externally, to be 
contacted for an authentication decision over a webhook. It is important to note that the suitability 
of this mechanism will likely depend on the software used for the authentication service, and there 
are some Kubernetes-specific considerations to take into account.
-->
[Webhook 令牌身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
是另一种集成外部身份认证服务组件到 Kubernetes 中的可选项。
这种机制允许通过 Webhook 的方式连接集群内部或外部运行的身份认证服务，
以做出身份认证决策。值得注意的是，
这种机制的适用性可能更取决于身份认证服务所使用的软件，
而且还需要考虑一些特定于 Kubernetes 的因素。

<!--
To configure Webhook authentication, access to control plane server filesystems is required. This 
means that it will not be possible with Managed Kubernetes unless the provider specifically makes it 
available. Additionally, any software installed in the cluster to support this access should be 
isolated from general workloads, as it will run with high privileges.
-->
要配置 Webhook 身份认证的前提是需要提供控制平面服务器文件系统的访问权限。
这意味着托管的 Kubernetes 无法实现这一点，除非供应商特别提供。
此外，集群中安装的任何支持该访问的软件都应当与普通工作负载隔离，
因为它需要以较高的特权来运行。

<!--
## Authenticating proxy {#authenticating-proxy}
-->
## 身份认证代理 {#authenticating-proxy}

<!--
Another option for integrating external authentication systems into Kubernetes is to use an 
[authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy). 
With this mechanism, Kubernetes expects to receive requests from the proxy with specific header 
values set, indicating the username and group memberships to assign for authorization purposes. 
It is important to note that there are specific considerations to take into account when using 
this mechanism.
-->
将外部身份认证系统集成到 Kubernetes 的另一种方式是使用
[身份认证代理](/zh-cn/docs/reference/access-authn-authz/authentication/#authenticating-proxy)。
在这种机制下，Kubernetes 接收到来自代理的请求，这些请求会携带特定的标头，
标明为鉴权目的所赋予的用户名和组成员身份。
值得注意的是，在使用这种机制时有一些特定的注意事项。

<!--
Firstly, securely configured TLS must be used between the proxy and Kubernetes API server to 
mitigate the risk of traffic interception or sniffing attacks. This ensures that the communication 
between the proxy and Kubernetes API server is secure.
-->
首先，在代理和 Kubernetes API 服务器间必须以安全的方式配置 TLS 连接，
从而降低流量劫持或嗅探攻击的风险。
TLS 连接可以确保代理和 Kubernetes API 服务器间的通信是安全的。

<!--
Secondly, it is important to be aware that an attacker who is able to modify the headers of the 
request may be able to gain unauthorized access to Kubernetes resources. As such, it is important 
to ensure that the headers are properly secured and cannot be tampered with.
-->
其次，需要注意的是，能够修改表头的攻击者可能会在未经授权的情况下访问 Kubernetes 资源。
因此，确保标头得到妥善保护并且不会被篡改非常重要。