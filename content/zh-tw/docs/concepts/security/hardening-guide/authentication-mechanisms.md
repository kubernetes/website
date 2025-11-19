---
title: 加固指南 - 身份認證機制
description: >
  有關 Kubernetes 中的認證選項及其安全屬性的信息。
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
選擇合適的身份認證機制是確保集羣安全的一個重要方面。
Kubernetes 提供了多種內置機制，
當爲你的集羣選擇最好的身份認證機制時需要謹慎考慮每種機制的優缺點。

<!--
In general, it is recommended to enable as few authentication mechanisms as possible to simplify
user management and prevent cases where users retain access to a cluster that is no longer required.
-->
通常情況下，建議啓用儘可能少的身份認證機制，
以簡化用戶管理，避免用戶仍保有對其不再需要的集羣的訪問權限的情況。

<!--
It is important to note that Kubernetes does not have an in-built user database within the cluster.
Instead, it takes user information from the configured authentication system and uses that to make
authorization decisions. Therefore, to audit user access, you need to review credentials from every
configured authentication source.
-->
值得注意的是 Kubernetes 集羣中並沒有內置的用戶數據庫。
相反，它從已配置的身份認證系統中獲取用戶信息並依之做出鑑權決策。
因此，要審計用戶訪問，你需要檢視來自每個已配置身份認證數據源的憑據。

<!--
For production clusters with multiple users directly accessing the Kubernetes API, it is
recommended to use external authentication sources such as OIDC. The internal authentication
mechanisms, such as client certificates and service account tokens, described below, are not
suitable for this use case.
-->
對於有多個用戶直接訪問 Kubernetes API 的生產集羣來說，
建議使用外部身份認證數據源，例如：OIDC。
下文提到的客戶端證書和服務賬號令牌等內部身份認證機制則不適用這種情況。

<!-- body -->

<!--
## X.509 client certificate authentication {#x509-client-certificate-authentication}
-->
## X.509 客戶端證書身份認證 {#x509-client-certificate-authentication}

<!--
Kubernetes leverages [X.509 client certificate](/docs/reference/access-authn-authz/authentication/#x509-client-certificates)
authentication for system components, such as when the Kubelet authenticates to the API Server.
While this mechanism can also be used for user authentication, it might not be suitable for
production use due to several restrictions:
-->
Kubernetes 採用 [X.509 客戶端證書](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certificates)
對系統組件進行身份認證，
例如 Kubelet 對 API 服務器進行身份認證時。
雖然這種機制也可以用於用戶身份認證，但由於一些限制它可能不太適合在生產中使用：

<!--
- Client certificates cannot be individually revoked. Once compromised, a certificate can be used
  by an attacker until it expires. To mitigate this risk, it is recommended to configure short
  lifetimes for user authentication credentials created using client certificates.
-->
- 客戶端證書無法獨立撤銷。
  證書一旦被泄露，攻擊者就可以使用它，直到證書過期。
  爲了降低這種風險，建議爲使用客戶端證書創建的用戶身份認證憑據配置較短的有效期。
<!--
- If a certificate needs to be invalidated, the certificate authority must be re-keyed, which
  can introduce availability risks to the cluster.
-->
- 如果證書需要被作廢，必須重新爲證書機構設置密鑰，但這樣做可能給集羣帶來可用性風險。
<!--
- There is no permanent record of client certificates created in the cluster. Therefore, all
  issued certificates must be recorded if you need to keep track of them.
-->
- 在集羣中創建的客戶端證書不會被永久記錄。
  因此，如果你要跟蹤所有已簽發的證書，就必須將它們記錄下來。
<!--
- Private keys used for client certificate authentication cannot be password-protected. Anyone
  who can read the file containing the key will be able to make use of it.
-->
- 用於對客戶端證書進行身份認證的私鑰不可以啓用密碼保護。
  任何可以讀取包含密鑰文件的人都可以利用該密鑰。
<!--
- Using client certificate authentication requires a direct connection from the client to the
  API server with no intervening TLS termination points, which can complicate network architectures.
-->
- 使用客戶端證書身份認證需要客戶端直連 API 服務器而不允許中間存在 TLS 終止節點，
  這一約束可能會使網絡架構變得複雜。
<!--
- Group data is embedded in the `O` value of the client certificate, which means the user's group
  memberships cannot be changed for the lifetime of the certificate.
-->
- 組數據包含在客戶端證書的 `O` 值中，
  這意味着在證書有效期內無法更改用戶的組成員身份。

<!--
## Static token file {#static-token-file}
-->
## 靜態令牌文件 {#static-token-file}

<!--
Although Kubernetes allows you to load credentials from a
[static token file](/docs/reference/access-authn-authz/authentication/#static-token-file) located
on the control plane node disks, this approach is not recommended for production servers due to
several reasons:
-->
儘管 Kubernetes 允許你從控制平面節點的磁盤中加載
[靜態令牌文件](/zh-cn/docs/reference/access-authn-authz/authentication/#static-token-file)
以獲取憑據，但由於多種原因，在生產服務器上不建議採用這種方法：

<!--
- Credentials are stored in clear text on control plane node disks, which can be a security risk.
-->
- 憑據以明文的方式存儲在控制平面節點的磁盤中，這可能是一種安全風險。
<!--
- Changing any credential requires a restart of the API server process to take effect, which can
  impact availability.
-->
- 修改任何憑據都需要重啓 API 服務進程使其生效，這會影響可用性。
<!--
- There is no mechanism available to allow users to rotate their credentials. To rotate a
  credential, a cluster administrator must modify the token on disk and distribute it to the users.
-->
- 沒有現成的機制讓用戶輪換其憑據數據。
  要輪換憑據數據，集羣管理員必須修改磁盤上的令牌並將其分發給用戶。
<!--
- There is no lockout mechanism available to prevent brute-force attacks.
-->
- 沒有合適的鎖機制用以防止暴力破解攻擊。

<!--
## Bootstrap tokens {#bootstrap-tokens}
-->
## 啓動引導令牌 {#bootstrap-tokens}

<!--
[Bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) are used for joining
nodes to clusters and are not recommended for user authentication due to several reasons:
-->
[啓動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)用於節點加入集羣，
因爲下列的一些原因，不建議用於用戶身份認證：

<!--
- They have hard-coded group memberships that are not suitable for general use, making them
  unsuitable for authentication purposes.
-->
- 啓動引導令牌中包含有硬編碼的組成員身份，不適合一般使用，
  因此不適用於身份認證目的。
<!--
- Manually generating bootstrap tokens can lead to weak tokens that can be guessed by an attacker,
  which can be a security risk.
-->
- 手動生成啓動引導令牌有可能使較弱的令牌容易被攻擊者猜到，
  有可能成爲安全隱患。
<!--
- There is no lockout mechanism available to prevent brute-force attacks, making it easier for
  attackers to guess or crack the token.
-->
- 沒有現成的加鎖定機制用來防止暴力破解，
  這使得攻擊者更容易猜測或破解令牌。

<!--
## ServiceAccount secret tokens {#serviceaccount-secret-tokens}
-->
## 服務賬號令牌 {#serviceaccount-secret-tokens}

<!--
[Service account secrets](/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts)
are available as an option to allow workloads running in the cluster to authenticate to the
API server. In Kubernetes < 1.23, these were the default option, however, they are being replaced
with TokenRequest API tokens. While these secrets could be used for user authentication, they are
generally unsuitable for a number of reasons:
-->
[服務賬號令牌](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts) 
在運行於集羣中的工作負載向 API 服務器進行身份認證時是個可選項。
在 Kubernetes < 1.23 的版本中，服務賬號令牌是默認選項，但現在已經被 TokenRequest API 取代。
儘管這些密鑰可以用於用戶身份認證，但由於多種原因，它們通常並不合適：

<!--
- They cannot be set with an expiry and will remain valid until the associated service account is deleted.
-->
- 服務賬號令牌無法設置有效期，在相關的服務賬號被刪除前一直有效。
<!--
- The authentication tokens are visible to any cluster user who can read secrets in the namespace
  that they are defined in.
-->
- 任何集羣用戶，只要能讀取服務賬號令牌定義所在的命名空間中的 Secret，就能看到身份認證令牌。
<!--
- Service accounts cannot be added to arbitrary groups complicating RBAC management where they are used.
-->
- 服務賬號無法被添加到任意組中，這一限制使得使用服務賬號的 RBAC 管理變得複雜。

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
TokenRequest API 是一種可生成短期憑據的有用工具，所生成的憑據可
用於對 API 服務器或第三方系統執行服務身份認證。
然而，通常不建議將此機制用於用戶身份認證，因爲沒有辦法撤銷這些令牌，
而且，如何以安全的方式向用戶分發憑據信息也是挑戰。

<!--
When using TokenRequest tokens for service authentication, it is recommended to implement a short
lifespan to reduce the impact of compromised tokens.
-->
當使用 TokenRequest 令牌進行服務身份認證時，
建議使用較短的有效期以減少被泄露令牌可能帶來的影響。

<!--
## OpenID Connect token authentication {#openid-connect-token-authentication}
-->
## OpenID Connect 令牌身份認證 {#openid-connect-token-authentication}

<!--
Kubernetes supports integrating external authentication services with the Kubernetes API using
[OpenID Connect (OIDC)](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
There is a wide variety of software that can be used to integrate Kubernetes with an identity
provider. However, when using OIDC authentication for Kubernetes, it is important to consider the
following hardening measures:
-->
Kubernetes 支持使用 [OpenID Connect (OIDC)](/zh-cn/docs/reference/access-authn-authz/authentication/#openid-connect-tokens) 
將外部身份認證服務與 Kubernetes API 集成。
有多種軟件可用於將 Kubernetes 與認證服務組件集成。
不過，當爲 Kubernetes 使用 OIDC 身份認證時，
必須考慮以下加固措施：

<!--
- The software installed in the cluster to support OIDC authentication should be isolated from
  general workloads as it will run with high privileges.
-->
- 安裝在集羣中用於支持 OIDC 身份認證的軟件應該與普通的工作負載隔離，
  因爲它要以較高的特權來運行。
<!--
- Some Kubernetes managed services are limited in the OIDC providers that can be used.
-->
- 有些 Kubernetes 託管服務對可使用的 OIDC 服務組件有限制。
<!--
- As with TokenRequest tokens, OIDC tokens should have a short lifespan to reduce the impact of
  compromised tokens.
-->
- 與 TokenRequest 令牌一樣，OIDC 令牌的有效期也應較短，以減少被泄露的令牌所帶來的影響。

<!--
## Webhook token authentication {#webhook-token-authentication}
-->
## Webhook 令牌身份認證 {#webhook-token-authentication}

<!--
[Webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
is another option for integrating external authentication providers into Kubernetes. This mechanism
allows for an authentication service, either running inside the cluster or externally, to be
contacted for an authentication decision over a webhook. It is important to note that the suitability
of this mechanism will likely depend on the software used for the authentication service, and there
are some Kubernetes-specific considerations to take into account.
-->
[Webhook 令牌身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
是另一種集成外部身份認證服務組件到 Kubernetes 中的可選項。
這種機制允許通過 Webhook 的方式連接集羣內部或外部運行的身份認證服務，
以做出身份認證決策。值得注意的是，
這種機制的適用性可能更取決於身份認證服務所使用的軟件，
而且還需要考慮一些特定於 Kubernetes 的因素。

<!--
To configure Webhook authentication, access to control plane server filesystems is required. This
means that it will not be possible with Managed Kubernetes unless the provider specifically makes it
available. Additionally, any software installed in the cluster to support this access should be
isolated from general workloads, as it will run with high privileges.
-->
要配置 Webhook 身份認證的前提是需要提供控制平面服務器文件系統的訪問權限。
這意味着託管的 Kubernetes 無法實現這一點，除非供應商特別提供。
此外，集羣中安裝的任何支持該訪問的軟件都應當與普通工作負載隔離，
因爲它需要以較高的特權來運行。

<!--
## Authenticating proxy {#authenticating-proxy}
-->
## 身份認證代理 {#authenticating-proxy}

<!--
Another option for integrating external authentication systems into Kubernetes is to use an
[authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).
With this mechanism, Kubernetes expects to receive requests from the proxy with specific header
values set, indicating the username and group memberships to assign for authorization purposes.
It is important to note that there are specific considerations to take into account when using
this mechanism.
-->
將外部身份認證系統集成到 Kubernetes 的另一種方式是使用
[身份認證代理](/zh-cn/docs/reference/access-authn-authz/authentication/#authenticating-proxy)。
在這種機制下，Kubernetes 接收到來自代理的請求，這些請求會攜帶特定的標頭，
標明爲鑑權目的所賦予的用戶名和組成員身份。
值得注意的是，在使用這種機制時有一些特定的注意事項。

<!--
Firstly, securely configured TLS must be used between the proxy and Kubernetes API server to
mitigate the risk of traffic interception or sniffing attacks. This ensures that the communication
between the proxy and Kubernetes API server is secure.
-->
首先，在代理和 Kubernetes API 服務器間必須以安全的方式配置 TLS 連接，
從而降低流量劫持或嗅探攻擊的風險。
TLS 連接可以確保代理和 Kubernetes API 服務器間的通信是安全的。

<!--
Secondly, it is important to be aware that an attacker who is able to modify the headers of the
request may be able to gain unauthorized access to Kubernetes resources. As such, it is important
to ensure that the headers are properly secured and cannot be tampered with.
-->
其次，需要注意的是，能夠修改表頭的攻擊者可能會在未經授權的情況下訪問 Kubernetes 資源。
因此，確保標頭得到妥善保護並且不會被篡改非常重要。

## {{% heading "whatsnext" %}}

<!--
- [User Authentication](/docs/reference/access-authn-authz/authentication/)
- [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [kubelet Authentication](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication)
- [Authenticating with Service Account Tokens](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens)
-->
- [用戶認證](/zh-cn/docs/reference/access-authn-authz/authentication/)
- [使用 Bootstrap 令牌進行身份驗證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
- [kubelet 認證](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication)
- [使用服務帳戶令牌進行身份驗證](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens)
