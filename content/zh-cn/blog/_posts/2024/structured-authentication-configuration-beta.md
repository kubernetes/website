---
layout: blog
title: "Kubernetes 1.30：结构化身份认证配置进阶至 Beta"
date: 2024-04-25
slug: structured-authentication-moves-to-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.30: Structured Authentication Configuration Moves to Beta"
date: 2024-04-25
slug: structured-authentication-moves-to-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
-->

<!--
With Kubernetes 1.30, we (SIG Auth) are moving Structured Authentication Configuration to beta.

Today's article is about _authentication_: finding out who's performing a task, and checking
that they are who they say they are. Check back in tomorrow to find about what's new in
Kubernetes v1.30 around _authorization_ (deciding what someone can and can't access).
-->
在 Kubernetes 1.30 中，我们（SIG Auth）将结构化身份认证配置（Structured Authentication Configuration）进阶至 Beta。

今天的文章是关于**身份认证**：找出谁在执行任务，核查他们是否是自己所说的那个人。
本文还述及 Kubernetes v1.30 中关于 **鉴权**（决定某些人能访问什么，不能访问什么）的新内容。

<!--
## Motivation
Kubernetes has had a long-standing need for a more flexible and extensible
authentication system. The current system, while powerful, has some limitations
that make it difficult to use in certain scenarios. For example, it is not
possible to use multiple authenticators of the same type (e.g., multiple JWT
authenticators) or to change the configuration without restarting the API server. The
Structured Authentication Configuration feature is the first step towards
addressing these limitations and providing a more flexible and extensible way
to configure authentication in Kubernetes.
-->
## 动机   {#motivation}

Kubernetes 长期以来都需要一个更灵活、更好扩展的身份认证系统。
当前的系统虽然强大，但有一些限制，使其难以用在某些场景下。
例如，不可能同时使用多个相同类型的认证组件（例如，多个 JWT 认证组件），
也不可能在不重启 API 服务器的情况下更改身份认证配置。
结构化身份认证配置特性是解决这些限制并提供一种更灵活、更好扩展的方式来配置 Kubernetes 中身份认证的第一步。

<!--
## What is structured authentication configuration?
Kubernetes v1.30 builds on the experimental support for configurating authentication based on
a file, that was added as alpha in Kubernetes v1.30. At this beta stage, Kubernetes only supports configuring JWT
authenticators, which serve as the next iteration of the existing OIDC
authenticator. JWT authenticator is an authenticator to
authenticate Kubernetes users using JWT compliant tokens. The authenticator
will attempt to parse a raw ID token, verify it's been signed by the configured 
issuer.
-->
## 什么是结构化身份认证配置？   {#what-is-structured-authentication-configuration}

Kubernetes v1.30 针对基于文件来配置身份认证提供实验性支持，这是在 Kubernetes v1.30 中新增的 Alpha 特性。
在此 Beta 阶段，Kubernetes 仅支持配置 JWT 认证组件，这是现有 OIDC 认证组件的下一次迭代。
JWT 认证组件使用符合 JWT 标准的令牌对 Kubernetes 用户进行身份认证。
此认证组件将尝试解析原始 ID 令牌，验证其是否由配置的签发方签名。

<!--
The Kubernetes project added configuration from a file so that it can provide more
flexibility than using command line options (which continue to work, and are still supported).
Supporting a configuration file also makes it easy to deliver further improvements in upcoming
releases.
-->
Kubernetes 项目新增了基于文件的配置，以便提供比使用命令行选项（命令行依然有效，仍受支持）更灵活的方式。
对配置文件的支持还使得在即将发布的版本中更容易提供更多改进措施。

<!--
### Benefits of structured authentication configuration
Here's why using a configuration file to configure cluster authentication is a benefit:
-->
### 结构化身份认证配置的好处   {#benefits-of-structured-authentication-configuration}

以下是使用配置文件来配置集群身份认证的好处：

<!--
1. **Multiple JWT authenticators**: You can configure multiple JWT authenticators
   simultaneously. This allows you to use multiple identity providers (e.g.,
   Okta, Keycloak, GitLab) without needing to use an intermediary like Dex
   that handles multiplexing between multiple identity providers.
2. **Dynamic configuration**: You can change the configuration without
   restarting the API server. This allows you to add, remove, or modify
   authenticators without disrupting the API server.
-->
1. **多个 JWT 认证组件**：你可以同时配置多个 JWT 认证组件。
   这允许你使用多个身份提供程序（例如 Okta、Keycloak、GitLab）而无需使用像
   Dex 这样的中间程序来处理多个身份提供程序之间的多路复用。
2. **动态配置**：你可以在不重启 API 服务器的情况下更改配置。
   这允许你添加、移除或修改认证组件而不会中断 API 服务器。

<!--
3. **Any JWT-compliant token**: You can use any JWT-compliant token for
   authentication. This allows you to use tokens from any identity provider that
   supports JWT. The minimum valid JWT payload must contain the claims documented 
   in [structured authentication configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
   page in the Kubernetes documentation.
4. **CEL (Common Expression Language) support**: You can use [CEL](/docs/reference/using-api/cel/) 
   to determine whether the token's claims match the user's attributes in Kubernetes (e.g.,
   username, group). This allows you to use complex logic to determine whether a
   token is valid.
-->
3. **任何符合 JWT 标准的令牌**：你可以使用任何符合 JWT 标准的令牌进行身份认证。
   这允许你使用任何支持 JWT 的身份提供程序的令牌。最小有效的 JWT 载荷必须包含 Kubernetes
   文档中[结构化身份认证配置](/zh-cn/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)页面中记录的申领。
4. **CEL（通用表达式语言）支持**：你可以使用 [CEL](/zh-cn/docs/reference/using-api/cel/)
   来确定令牌的申领是否与 Kubernetes 中用户的属性（例如用户名、组）匹配。
   这允许你使用复杂逻辑来确定令牌是否有效。

<!--
5. **Multiple audiences**: You can configure multiple audiences for a single
   authenticator. This allows you to use the same authenticator for multiple
   audiences, such as using a different OAuth client for `kubectl` and dashboard.
6. **Using identity providers that don't support OpenID connect discovery**: You
   can use identity providers that don't support [OpenID Connect 
   discovery](https://openid.net/specs/openid-connect-discovery-1_0.html). The only
   requirement is to host the discovery document at a different location than the
   issuer (such as locally in the cluster) and specify the `issuer.discoveryURL` in
   the configuration file.
-->
5. **多个受众群体**：你可以为单个认证组件配置多个受众群体。
   这允许你为多个受众群体使用相同的认证组件，例如为 `kubectl` 和仪表板使用不同的 OAuth 客户端。
6. **使用不支持 OpenID 连接发现的身份提供程序**：你可以使用不支持
   [OpenID 连接发现](https://openid.net/specs/openid-connect-discovery-1_0.html) 的身份提供程序。
   唯一的要求是将发现文档托管到与签发方不同的位置（例如在集群中本地），并在配置文件中指定 `issuer.discoveryURL`。

<!--
## How to use Structured Authentication Configuration
To use structured authentication configuration, you specify
the path to the authentication configuration using the `--authentication-config`
command line argument in the API server. The configuration file is a YAML file
that specifies the authenticators and their configuration. Here is an example
configuration file that configures two JWT authenticators:
-->
## 如何使用结构化身份认证配置   {#how-to-use-structured-authentication-configuration}

要使用结构化身份认证配置，你可以使用 `--authentication-config` 命令行参数在
API 服务器中指定身份认证配置的路径。此配置文件是一个 YAML 文件，指定认证组件及其配置。
以下是一个配置两个 JWT 认证组件的示例配置文件：

<!--
# Someone with a valid token from either of these issuers could authenticate
# against this cluster.
# second authenticator that exposes the discovery document at a different location
# than the issuer
-->

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# 如果某人具有这些 issuer 之一签发的有效令牌，则此人可以在集群上进行身份认证
jwt:
- issuer:
    url: https://issuer1.example.com
    audiences:
    - audience1
    - audience2
    audienceMatchPolicy: MatchAny
  claimValidationRules:
    expression: 'claims.hd == "example.com"'
    message: "the hosted domain name must be example.com"
  claimMappings:
    username:
      expression: 'claims.username'
    groups:
      expression: 'claims.groups'
    uid:
      expression: 'claims.uid'
    extra:
    - key: 'example.com/tenant'
      expression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')"
    message: "username cannot use reserved system: prefix"
# 第二个认证组件将发现文档公布于与签发方不同的位置
- issuer:
    url: https://issuer2.example.com
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    audiences:
    - audience3
    - audience4
    audienceMatchPolicy: MatchAny
  claimValidationRules:
    expression: 'claims.hd == "example.com"'
    message: "the hosted domain name must be example.com"
  claimMappings:
    username:
      expression: 'claims.username'
    groups:
      expression: 'claims.groups'
    uid:
      expression: 'claims.uid'
    extra:
    - key: 'example.com/tenant'
      expression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')"
    message: "username cannot use reserved system: prefix"
```

<!--
## Migration from command line arguments to configuration file
The Structured Authentication Configuration feature is designed to be
backwards-compatible with the existing approach, based on command line options, for 
configuring the JWT authenticator. This means that you can continue to use the existing
command-line options to configure the JWT authenticator. However, we (Kubernetes SIG Auth) 
recommend migrating to the new configuration file-based approach, as it provides more
flexibility and extensibility.
-->
## 从命令行参数迁移到配置文件   {#migration-from-command-line-arguments-to-configuration-file}

结构化身份认证配置特性旨在与基于命令行选项配置 JWT 认证组件的现有方法向后兼容。
这意味着你可以继续使用现有的命令行选项来配置 JWT 认证组件。
但是，我们（Kubernetes SIG Auth）建议迁移到新的基于配置文件的方法，因为这种方法更灵活，更好扩展。

{{% alert title="Note" color="primary" %}}
<!--
If you specify `--authentication-config` along with any of the `--oidc-*` command line arguments, this is
a misconfiguration. In this situation, the API server reports an error and then immediately exits.

If you want to switch to using structured authentication configuration, you have to remove the `--oidc-*`
command line arguments, and use the configuration file instead.
-->
如果你同时指定 `--authentication-config` 和任何 `--oidc-*` 命令行参数，这是一种错误的配置。
在这种情况下，API 服务器会报告错误，然后立即退出。

如果你想切换到使用结构化身份认证配置，你必须移除 `--oidc-*` 命令行参数，并改为使用配置文件。
{{% /alert %}}

<!--
Here is an example of how to migrate from the command-line flags to the
configuration file:

### Command-line arguments
-->
以下是如何从命令行标志迁移到配置文件的示例：

### 命令行参数   {#command-line-arguments}

```bash
--oidc-issuer-url=https://issuer.example.com
--oidc-client-id=example-client-id
--oidc-username-claim=username
--oidc-groups-claim=groups
--oidc-username-prefix=oidc:
--oidc-groups-prefix=oidc:
--oidc-required-claim="hd=example.com"
--oidc-required-claim="admin=true"
--oidc-ca-file=/path/to/ca.pem
```

<!--
There is no equivalent in the configuration file for the `--oidc-signing-algs`. 
For Kubernetes v1.30, the authenticator supports all the asymmetric algorithms listed in
[`oidc.go`](https://github.com/kubernetes/kubernetes/blob/b4935d910dcf256288694391ef675acfbdb8e7a3/staging/src/k8s.io/apiserver/plugin/pkg/authenticator/token/oidc/oidc.go#L222-L233).

### Configuration file
-->
在配置文件中没有与 `--oidc-signing-algs` 相对应的配置项。
对于 Kubernetes v1.30，认证组件支持在
[`oidc.go`](https://github.com/kubernetes/kubernetes/blob/b4935d910dcf256288694391ef675acfbdb8e7a3/staging/src/k8s.io/apiserver/plugin/pkg/authenticator/token/oidc/oidc.go#L222-L233)
中列出的所有非对称算法。

### 配置文件   {#configuration-file}

<!--
certificateAuthority: <value is the content of file /path/to/ca.pem>
-->

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: https://issuer.example.com
    audiences:
    - example-client-id
    certificateAuthority: <取值是 /path/to/ca.pem 文件的内容>
  claimMappings:
    username:
      claim: username
      prefix: "oidc:"
    groups:
      claim: groups
      prefix: "oidc:"
  claimValidationRules:
  - claim: hd
    requiredValue: "example.com"
  - claim: admin
    requiredValue: "true"
```

<!--
## What's next?
For Kubernetes v1.31, we expect the feature to stay in beta while we get more
feedback. In the coming releases, we want to investigate:
- Making distributed claims work via CEL expressions.
- Egress selector configuration support for calls to `issuer.url` and
  `issuer.discoveryURL`.
-->
## 下一步是什么？   {#whats-next}

对于 Kubernetes v1.31，我们预计该特性将保持在 Beta，我们要收集更多反馈意见。
在即将发布的版本中，我们希望调查以下内容：

- 通过 CEL 表达式使分布式申领生效。
- 对 `issuer.url` 和 `issuer.discoveryURL` 的调用提供 Egress 选择算符配置支持。

<!--
You can learn more about this feature on the [structured authentication
configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
page in the Kubernetes documentation. You can also follow along on the
[KEP-3331](https://kep.k8s.io/3331) to track progress across the coming
Kubernetes releases.
-->
你可以在 Kubernetes
文档的[结构化身份认证配置](/zh-cn/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)页面上了解关于此特性的更多信息。
你还可以通过 [KEP-3331](https://kep.k8s.io/3331) 跟踪未来 Kubernetes 版本中的进展。

<!--
## Try it out
In this post, I have covered the benefits the Structured Authentication
Configuration feature brings in Kubernetes v1.30. To use this feature, you must specify the path to the
authentication configuration using the `--authentication-config` command line
argument. From Kubernetes v1.30, the feature is in beta and enabled by default.
If you want to keep using command line arguments instead of a configuration file,
those will continue to work as-is.
-->
## 试用一下   {#try-it-out}

在本文中，我介绍了结构化身份认证配置特性在 Kubernetes v1.30 中带来的好处。
要使用此特性，你必须使用 `--authentication-config` 命令行参数指定身份认证配置的路径。
从 Kubernetes v1.30 开始，此特性处于 Beta 并默认启用。
如果你希望继续使用命令行参数而不想用配置文件，原来的命令行参数也将继续按原样起作用。

<!--
We would love to hear your feedback on this feature. Please reach out to us on the
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
channel on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
-->
我们很高兴听取你对此特性的反馈意见。请在 Kubernetes Slack 上的
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
频道与我们联系（若要获取邀请，请访问 [https://slack.k8s.io/](https://slack.k8s.io/)）。

<!--
## How to get involved
If you are interested in getting involved in the development of this feature,
share feedback, or participate in any other ongoing SIG Auth projects, please
reach out on the [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)
channel on Kubernetes Slack.
-->
## 如何参与   {#how-to-get-involved}

如果你有兴趣参与此特性的开发、分享反馈意见或参与任何其他 SIG Auth 项目，
请在 Kubernetes Slack 上的 [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) 频道联系我们。

<!--
You are also welcome to join the bi-weekly [SIG Auth
meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)
held every-other Wednesday.
-->
我们也欢迎你参加 [SIG Auth 双周会议](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)。
