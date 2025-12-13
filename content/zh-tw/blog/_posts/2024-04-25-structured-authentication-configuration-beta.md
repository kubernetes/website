---
layout: blog
title: "Kubernetes 1.30：結構化身份認證設定進階至 Beta"
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
在 Kubernetes 1.30 中，我們（SIG Auth）將結構化身份認證設定（Structured Authentication Configuration）進階至 Beta。

今天的文章是關於**身份認證**：找出誰在執行任務，覈查他們是否是自己所說的那個人。
本文還述及 Kubernetes v1.30 中關於 **鑑權**（決定某些人能訪問什麼，不能訪問什麼）的新內容。

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
## 動機   {#motivation}

Kubernetes 長期以來都需要一個更靈活、更好擴展的身份認證系統。
當前的系統雖然強大，但有一些限制，使其難以用在某些場景下。
例如，不可能同時使用多個相同類型的認證組件（例如，多個 JWT 認證組件），
也不可能在不重啓 API 伺服器的情況下更改身份認證設定。
結構化身份認證設定特性是解決這些限制並提供一種更靈活、更好擴展的方式來設定 Kubernetes 中身份認證的第一步。

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
## 什麼是結構化身份認證設定？   {#what-is-structured-authentication-configuration}

Kubernetes v1.30 針對基於檔案來設定身份認證提供實驗性支持，這是在 Kubernetes v1.30 中新增的 Alpha 特性。
在此 Beta 階段，Kubernetes 僅支持設定 JWT 認證組件，這是現有 OIDC 認證組件的下一次迭代。
JWT 認證組件使用符合 JWT 標準的令牌對 Kubernetes 使用者進行身份認證。
此認證組件將嘗試解析原始 ID 令牌，驗證其是否由設定的簽發方簽名。

<!--
The Kubernetes project added configuration from a file so that it can provide more
flexibility than using command line options (which continue to work, and are still supported).
Supporting a configuration file also makes it easy to deliver further improvements in upcoming
releases.
-->
Kubernetes 項目新增了基於檔案的設定，以便提供比使用命令列選項（命令列依然有效，仍受支持）更靈活的方式。
對設定檔案的支持還使得在即將發佈的版本中更容易提供更多改進措施。

<!--
### Benefits of structured authentication configuration
Here's why using a configuration file to configure cluster authentication is a benefit:
-->
### 結構化身份認證設定的好處   {#benefits-of-structured-authentication-configuration}

以下是使用設定檔案來設定叢集身份認證的好處：

<!--
1. **Multiple JWT authenticators**: You can configure multiple JWT authenticators
   simultaneously. This allows you to use multiple identity providers (e.g.,
   Okta, Keycloak, GitLab) without needing to use an intermediary like Dex
   that handles multiplexing between multiple identity providers.
2. **Dynamic configuration**: You can change the configuration without
   restarting the API server. This allows you to add, remove, or modify
   authenticators without disrupting the API server.
-->
1. **多個 JWT 認證組件**：你可以同時設定多個 JWT 認證組件。
   這允許你使用多個身份提供程式（例如 Okta、Keycloak、GitLab）而無需使用像
   Dex 這樣的中間程式來處理多個身份提供程式之間的多路複用。
2. **動態設定**：你可以在不重啓 API 伺服器的情況下更改設定。
   這允許你添加、移除或修改認證組件而不會中斷 API 伺服器。

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
3. **任何符合 JWT 標準的令牌**：你可以使用任何符合 JWT 標準的令牌進行身份認證。
   這允許你使用任何支持 JWT 的身份提供程式的令牌。最小有效的 JWT 載荷必須包含 Kubernetes
   文檔中[結構化身份認證設定](/zh-cn/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)頁面中記錄的申領。
4. **CEL（通用表達式語言）支持**：你可以使用 [CEL](/zh-cn/docs/reference/using-api/cel/)
   來確定令牌的申領是否與 Kubernetes 中使用者的屬性（例如使用者名、組）匹配。
   這允許你使用複雜邏輯來確定令牌是否有效。

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
5. **多個受衆羣體**：你可以爲單個認證組件設定多個受衆羣體。
   這允許你爲多個受衆羣體使用相同的認證組件，例如爲 `kubectl` 和儀表板使用不同的 OAuth 客戶端。
6. **使用不支持 OpenID 連接發現的身份提供程式**：你可以使用不支持
   [OpenID 連接發現](https://openid.net/specs/openid-connect-discovery-1_0.html) 的身份提供程式。
   唯一的要求是將發現文檔託管到與簽發方不同的位置（例如在叢集中本地），並在設定檔案中指定 `issuer.discoveryURL`。

<!--
## How to use Structured Authentication Configuration
To use structured authentication configuration, you specify
the path to the authentication configuration using the `--authentication-config`
command line argument in the API server. The configuration file is a YAML file
that specifies the authenticators and their configuration. Here is an example
configuration file that configures two JWT authenticators:
-->
## 如何使用結構化身份認證設定   {#how-to-use-structured-authentication-configuration}

要使用結構化身份認證設定，你可以使用 `--authentication-config` 命令列參數在
API 伺服器中指定身份認證設定的路徑。此設定檔案是一個 YAML 檔案，指定認證組件及其設定。
以下是一個設定兩個 JWT 認證組件的示例設定檔案：

<!--
# Someone with a valid token from either of these issuers could authenticate
# against this cluster.
# second authenticator that exposes the discovery document at a different location
# than the issuer
-->

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# 如果某人具有這些 issuer 之一簽發的有效令牌，則此人可以在集羣上進行身份認證
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
# 第二個認證組件將發現文檔公佈於與簽發方不同的位置
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
## 從命令列參數遷移到設定檔案   {#migration-from-command-line-arguments-to-configuration-file}

結構化身份認證設定特性旨在與基於命令列選項設定 JWT 認證組件的現有方法向後兼容。
這意味着你可以繼續使用現有的命令列選項來設定 JWT 認證組件。
但是，我們（Kubernetes SIG Auth）建議遷移到新的基於設定檔案的方法，因爲這種方法更靈活，更好擴展。

{{% alert title="Note" color="primary" %}}
<!--
If you specify `--authentication-config` along with any of the `--oidc-*` command line arguments, this is
a misconfiguration. In this situation, the API server reports an error and then immediately exits.

If you want to switch to using structured authentication configuration, you have to remove the `--oidc-*`
command line arguments, and use the configuration file instead.
-->
如果你同時指定 `--authentication-config` 和任何 `--oidc-*` 命令列參數，這是一種錯誤的設定。
在這種情況下，API 伺服器會報告錯誤，然後立即退出。

如果你想切換到使用結構化身份認證設定，你必須移除 `--oidc-*` 命令列參數，並改爲使用設定檔案。
{{% /alert %}}

<!--
Here is an example of how to migrate from the command-line flags to the
configuration file:

### Command-line arguments
-->
以下是如何從命令列標誌遷移到設定檔案的示例：

### 命令列參數   {#command-line-arguments}

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
在設定檔案中沒有與 `--oidc-signing-algs` 相對應的設定項。
對於 Kubernetes v1.30，認證組件支持在
[`oidc.go`](https://github.com/kubernetes/kubernetes/blob/b4935d910dcf256288694391ef675acfbdb8e7a3/staging/src/k8s.io/apiserver/plugin/pkg/authenticator/token/oidc/oidc.go#L222-L233)
中列出的所有非對稱算法。

### 設定檔案   {#configuration-file}

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
    certificateAuthority: <取值是 /path/to/ca.pem 文件的內容>
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
## 下一步是什麼？   {#whats-next}

對於 Kubernetes v1.31，我們預計該特性將保持在 Beta，我們要收集更多反饋意見。
在即將發佈的版本中，我們希望調查以下內容：

- 通過 CEL 表達式使分佈式申領生效。
- 對 `issuer.url` 和 `issuer.discoveryURL` 的調用提供 Egress 選擇算符設定支持。

<!--
You can learn more about this feature on the [structured authentication
configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
page in the Kubernetes documentation. You can also follow along on the
[KEP-3331](https://kep.k8s.io/3331) to track progress across the coming
Kubernetes releases.
-->
你可以在 Kubernetes
文檔的[結構化身份認證設定](/zh-cn/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)頁面上了解關於此特性的更多資訊。
你還可以通過 [KEP-3331](https://kep.k8s.io/3331) 跟蹤未來 Kubernetes 版本中的進展。

<!--
## Try it out
In this post, I have covered the benefits the Structured Authentication
Configuration feature brings in Kubernetes v1.30. To use this feature, you must specify the path to the
authentication configuration using the `--authentication-config` command line
argument. From Kubernetes v1.30, the feature is in beta and enabled by default.
If you want to keep using command line arguments instead of a configuration file,
those will continue to work as-is.
-->
## 試用一下   {#try-it-out}

在本文中，我介紹了結構化身份認證設定特性在 Kubernetes v1.30 中帶來的好處。
要使用此特性，你必須使用 `--authentication-config` 命令列參數指定身份認證設定的路徑。
從 Kubernetes v1.30 開始，此特性處於 Beta 並預設啓用。
如果你希望繼續使用命令列參數而不想用設定檔案，原來的命令列參數也將繼續按原樣起作用。

<!--
We would love to hear your feedback on this feature. Please reach out to us on the
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
channel on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
-->
我們很高興聽取你對此特性的反饋意見。請在 Kubernetes Slack 上的
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
頻道與我們聯繫（若要獲取邀請，請訪問 [https://slack.k8s.io/](https://slack.k8s.io/)）。

<!--
## How to get involved
If you are interested in getting involved in the development of this feature,
share feedback, or participate in any other ongoing SIG Auth projects, please
reach out on the [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)
channel on Kubernetes Slack.
-->
## 如何參與   {#how-to-get-involved}

如果你有興趣參與此特性的開發、分享反饋意見或參與任何其他 SIG Auth 項目，
請在 Kubernetes Slack 上的 [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) 頻道聯繫我們。

<!--
You are also welcome to join the bi-weekly [SIG Auth
meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)
held every-other Wednesday.
-->
我們也歡迎你參加 [SIG Auth 雙週會議](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)。
