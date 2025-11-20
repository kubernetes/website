---
title: kube-apiserver 設定 (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
---
<!-- 
title: kube-apiserver Configuration (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
auto_generated: true
-->

<p>
<!-- 
Package v1beta1 is the v1beta1 version of the API.</p> 
-->
v1beta1 包是 v1beta1 版本的 API。
</p>

<!-- 
## Resource Types
-->
## 資源類型   {#resource-types}

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-k8s-io-v1beta1-AuthorizationConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

## `TracingConfiguration`     {#TracingConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

<p>
<!--
TracingConfiguration provides versioned configuration for OpenTelemetry tracing clients.
-->
TracingConfiguration 爲 OpenTelemetry 跟蹤客戶端提供版本化的設定。
</p>

<table class="table">

<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Endpoint of the collector this component will report traces to.
   The connection is insecure, and does not currently support TLS.
   Recommended is unset, and endpoint is the otlp grpc default, localhost:4317.
   -->
   採集器的端點，此組件將向其報告跟蹤資訊。
   連接不安全，目前不支持 TLS。
   推薦不設置，端點爲 otlp grpc 預設值 localhost:4317。
   </p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!--
   SamplingRatePerMillion is the number of samples to collect per million spans.
   Recommended is unset. If unset, sampler respects its parent span's sampling
   rate, but otherwise never samples.
   -->
   samplingRatePerMillion 是每百萬 span 中採集的樣本數。
   推薦不設置。如果不設置，採集器將繼承其父級 span 的採樣率，否則不進行採樣。
   </p>
</td>
</tr>
</tbody>
</table>

## `AuthenticationConfiguration`     {#apiserver-k8s-io-v1beta1-AuthenticationConfiguration}

<p>
<!--
AuthenticationConfiguration provides versioned configuration for authentication.
-->
AuthenticationConfiguration 爲身份認證提供版本化的設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthenticationConfiguration</code></td></tr>

<tr><td><code>jwt</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-JWTAuthenticator"><code>[]JWTAuthenticator</code></a>
</td>
<td>
   <p>
   <!--
   jwt is a list of authenticator to authenticate Kubernetes users using
JWT compliant tokens. The authenticator will attempt to parse a raw ID token,
verify it's been signed by the configured issuer. The public key to verify the
signature is discovered from the issuer's public endpoint using OIDC discovery.
For an incoming token, each JWT authenticator will be attempted in
the order in which it is specified in this list.  Note however that
other authenticators may run before or after the JWT authenticators.
The specific position of JWT authenticators in relation to other
authenticators is neither defined nor stable across releases.  Since
each JWT authenticator must have a unique issuer URL, at most one
JWT authenticator will attempt to cryptographically validate the token.
   -->
   jwt 是一個身份認證器列表，用於對使用符合 JWT 的令牌的 Kubernetes 使用者進行身份認證。
   身份認證器將嘗試解析原始 ID 令牌，驗證其是否由設定的發放者簽名。用於驗證簽名的公鑰是通過
   OIDC 發現從頒發者的公開端點獲取的。對於傳入的令牌，將按照此列表中指定的順序嘗試每個 JWT
   身份認證器。但是請注意，其他身份認證器可能會在 JWT 身份認證器之前或之後運行。JWT
   身份認證器相對於其他身份認證器的具體位置在不同版本中既未定義也不穩定。由於每個 JWT
   身份認證器必須具有唯一的頒發者 URL，因此最多隻有一個 JWT 身份認證器會嘗試基於密碼學方法對令牌進行合法性檢查。
   </p>
<p>
<!--
The minimum valid JWT payload must contain the following claims:
-->
最小有效 JWT 負載必須包含以下聲明：
<pre>
{
    "iss": "https://issuer.example.com",
    "aud": ["audience"],
    "exp": 1234567890,
    "&lt;username claim&gt;": "username"
}
</pre>
</p>
</td>
</tr>
<tr><td><code>anonymous</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-AnonymousAuthConfig"><code>AnonymousAuthConfig</code></a>
</td>
<td>
   <p>
   <!--
   If present --anonymous-auth must not be set
   -->
   如果設置了此字段，則不得設置 <code>--anonymous-auth</code>。
   </p>
</td>
</tr>
</tbody>
</table>

## `AuthorizationConfiguration`     {#apiserver-k8s-io-v1beta1-AuthorizationConfiguration}

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthorizationConfiguration</code></td></tr>

<tr><td><code>authorizers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   Authorizers is an ordered list of authorizers to
authorize requests against.
This is similar to the --authorization-modes kube-apiserver flag
Must be at least one.
   -->
   authorizers 是一個有序的鑑權器列表，用於對請求進行鑑權。
   這類似於 kube-apiserver <code>--authorization-modes</code> 標誌。
   此列表不能爲空。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration}

<p>
<!-- 
EgressSelectorConfiguration provides versioned configuration for egress selector clients. 
-->
EgressSelectorConfiguration 爲出站流量選擇器客戶端（Egress Selector Client）提供版本化的設定選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>

<tr><td><code>egressSelections</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p>
   <!-- connectionServices contains a list of egress selection client configurations
   -->
   connectionServices 包含一組出站流量選擇器客戶端（Egress Selector Client）設定選項。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1beta1-TracingConfiguration}

<p>
<!--
TracingConfiguration provides versioned configuration for tracing clients.
-->
TracingConfiguration 爲跟蹤客戶端提供版本化的設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>

<tr><td><code>TracingConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>
<!--
(Members of <code>TracingConfiguration</code> are embedded into this type.)
-->
（<code>TracingConfiguration</code> 的成員嵌入到這種類型中。）
   <p>
   <!-- 
   Embed the component config tracing configuration struct 
   -->
   嵌入組件設定中的跟蹤設定結構體。
   </p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthCondition`     {#apiserver-k8s-io-v1beta1-AnonymousAuthCondition}

<!--
**Appears in:**
-->
**出現在：**

- [AnonymousAuthConfig](#apiserver-k8s-io-v1beta1-AnonymousAuthConfig)

<p>
<!--
AnonymousAuthCondition describes the condition under which anonymous auth
should be enabled.
-->
AnonymousAuthCondition 描述了應啓用匿名身份認證的條件。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>path</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Path for which anonymous auth is enabled.
   -->
   啓用匿名身份認證的路徑。
   </p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthConfig`     {#apiserver-k8s-io-v1beta1-AnonymousAuthConfig}

<!--
**Appears in:**
-->
**出現在：**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)

<p>
<!--
AnonymousAuthConfig provides the configuration for the anonymous authenticator.
-->
AnonymousAuthConfig 爲匿名身份認證器提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enabled</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
</td>
</tr>
<tr><td><code>conditions</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a>
</td>
<td>
   <p>
   <!--
   If set, anonymous auth is only allowed if the request meets one of the
conditions.
   -->
   如果設置，只有在請求滿足其中一個條件時才允許匿名身份認證。
   </p>
</td>
</tr>
</tbody>
</table>

## `AudienceMatchPolicyType`     {#apiserver-k8s-io-v1beta1-AudienceMatchPolicyType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 類型的別名）

**出現在：**

- [Issuer](#apiserver-k8s-io-v1beta1-Issuer)

<p>
<!--
AudienceMatchPolicyType is a set of valid values for issuer.audienceMatchPolicy
-->
AudienceMatchPolicyType 是 issuer.audienceMatchPolicy 合法值的集合
</p>

## `AuthorizerConfiguration`     {#apiserver-k8s-io-v1beta1-AuthorizerConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [AuthorizationConfiguration](#apiserver-k8s-io-v1beta1-AuthorizationConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Type refers to the type of the authorizer
&quot;Webhook&quot; is supported in the generic API server
Other API servers may support additional authorizer
types like Node, RBAC, ABAC, etc.
   -->
   type 指的是鑑權器的類型。
   通用 API 伺服器支持 &quot;Webhook&quot;。
   其他 API 伺服器可能支持其他鑑權器類型，如 Node、RBAC、ABAC 等。
   </p>
</td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Name used to describe the webhook
This is explicitly used in monitoring machinery for metrics
Note: Names must be DNS1123 labels like <code>myauthorizername</code> or
subdomains like <code>myauthorizer.example.domain</code>
Required, with no default
   -->
   name 是用於描述 webhook 的名稱。
   此字段專爲監控機制中的指標提供。
   注意：name 值必須是 DNS1123 標籤，如 <code>myauthorizername</code>，
   或子域名，如 <code>myauthorizer.example.domain</code>。
   必需，沒有預設值。
   </p>
</td>
</tr>
<tr><td><code>webhook</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   Webhook defines the configuration for a Webhook authorizer
Must be defined when Type=Webhook
Must not be defined when Type!=Webhook
   -->
   webhook 定義 Webhook 鑑權器的設定。
   當 type=Webhook 時必須定義。
   當 type!=Webhook 時不得定義。
   </p>
</td>
</tr>
</tbody>
</table>

## `ClaimMappings`     {#apiserver-k8s-io-v1beta1-ClaimMappings}

<!--
**Appears in:**
-->
**出現在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

<p>
<!--
ClaimMappings provides the configuration for claim mapping
-->
ClaimMappings 爲聲明映射提供設定資訊
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>username</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
</td>
<td>
   <p>
   <!--
   username represents an option for the username attribute.
The claim's value must be a singular string.
Same as the --oidc-username-claim and --oidc-username-prefix flags.
If username.expression is set, the expression must produce a string value.
If username.expression uses 'claims.email', then 'claims.email_verified' must be used in
username.expression or extra[<em>].valueExpression or claimValidationRules[</em>].expression.
An example claim validation rule expression that matches the validation automatically
applied when username.claim is set to 'email' is 'claims.?email_verified.orValue(true) == true'. By explicitly comparing
the value to true, we let type-checking see the result will be a boolean, and to make sure a non-boolean email_verified
claim will be caught at runtime.
   -->
   username 表示使用者名屬性的一個選項。
   聲明的值必須是單一字符串。
   與 <code>--oidc-username-claim</code> 和 <code>--oidc-username-prefix</code> 標誌相同。
   如果設置了 <code>username.expression</code>，則該表達式必須生成一個字符串值。
   如果 <code>username.expression</code> 使用 'claims.email'，則必須在
   <code>username.expression</code> 或 <code>extra[*].valueExpression</code>
   或 <code>claimValidationRules[*].expression</code> 中使用 'claims.email_verified'。
   這裏有一個聲明驗證規則表達式的示例，當 username.claim 設置爲 'email' 時與自動應用的驗證所匹配：
   'claims.?email_verified.orValue(true) == true'。
   通過顯式地將值與 true 進行比較，我們可以看到類型檢查的結果將是一個布爾值，
   並確保在運行時捕獲到非布爾值的 email_verified 聲明。
   </p>
<p>
<!--
In the flag based approach, the --oidc-username-claim and --oidc-username-prefix are optional. If --oidc-username-claim is not set,
the default value is &quot;sub&quot;. For the authentication config, there is no defaulting for claim or prefix. The claim and prefix must be set explicitly.
For claim, if --oidc-username-claim was not set with legacy flag approach, configure username.claim=&quot;sub&quot; in the authentication config.
For prefix:
     (1) --oidc-username-prefix="-", no prefix was added to the username. For the same behavior using authentication config,
         set username.prefix=""
     (2) --oidc-username-prefix="" and  --oidc-username-claim != "email", prefix was "<value of --oidc-issuer-url>#". For the same
         behavior using authentication config, set username.prefix="<value of issuer.url>#"
     (3) --oidc-username-prefix="<value>". For the same behavior using authentication config, set username.prefix="<value>"
-->
在基於標誌的方法中，--oidc-username-claim 和 --oidc-username-prefix
是可選的。如果未設置 --oidc-username-claim，預設值爲 &quot;sub&quot;。
對於身份認證設定，聲明或前綴都沒有預設值。聲明和前綴必須顯式設置。
對於聲明，如果在傳統標誌方法中未設置 --oidc-username-claim，
請在身份認證設定中設定 username.claim=&quot;sub&quot;。
對於前綴：
(1) --oidc-username-prefix="-", 未添加前綴到使用者名。要實現相同的行爲，請在身份認證設定中設置
username.prefix=&quot;&quot;
(2) --oidc-username-prefix=&quot;&quot; 並且 --oidc-username-claim != &quot;email&quot;，
前綴爲 &quot;&lt;--oidc-issuer-url 的值&gt;#&quot;。要實現相同的行爲，請在身份認證設定中設置
username.prefix=&quot;&lt;issuer.url 的值&gt;#&quot;。
(3) --oidc-username-prefix=&quot;&lt;value&gt;&quot;。要實現相同的行爲，請在身份認證設定中設置
username.prefix=&quot;&lt;value&gt;&quot;。
</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<a href="#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
</td>
<td>
   <p>
   <!--
   groups represents an option for the groups attribute.
The claim's value must be a string or string array claim.
If groups.claim is set, the prefix must be specified (and can be the empty string).
If groups.expression is set, the expression must produce a string or string array value.
&quot;&quot;, [], and null values are treated as the group mapping not being present.
   -->
   groups 表示 groups 屬性的一個選項。
   其中 claim 字段的值必須是字符串或字符串數組。
   如果設置了 groups.claim，則必須指定 prefix 字段（可以是空字符串）。
   如果設置了 groups.expression，則該表達式必須生成一個字符串或字符串數組值。
   &quot;&quot;、[] 和 null 值被視爲不存在組映射。
   </p>
</td>
</tr>
<tr><td><code>uid</code><br/>
<a href="#apiserver-k8s-io-v1beta1-ClaimOrExpression"><code>ClaimOrExpression</code></a>
</td>
<td>
   <p>
   <!--
   uid represents an option for the uid attribute.
Claim must be a singular string claim.
If uid.expression is set, the expression must produce a string value.
   -->
   uid 表示 uid 屬性的一個選項。
   其中的 claim 字段必須是一個字符串。
   如果設置了 uid.expression，則該表達式必須生成一個字符串值。
   </p>
</td>
</tr>
<tr><td><code>extra</code><br/>
<a href="#apiserver-k8s-io-v1beta1-ExtraMapping"><code>[]ExtraMapping</code></a>
</td>
<td>
   <p>
   <!--
   extra represents an option for the extra attribute.
expression must produce a string or string array value.
If the value is empty, the extra mapping will not be present.
   -->
   extra 表示 extra 屬性的一個選項。
   expression 必須生成一個字符串或字符串數組值。
   如果值爲空，則不會存在 extra 映射。
   </p>
<p>
<!--
hard-coded extra key/value
- key: "foo"
   valueExpression: "'bar'"
This will result in an extra attribute - foo: ["bar"]
hard-coded key, value copying claim value
 - key: "foo"
   valueExpression: "claims.some_claim"
This will result in an extra attribute - foo: [value of some_claim]
hard-coded key, value derived from claim value
- key: "admin"
  valueExpression: '(has(claims.is_admin) && claims.is_admin) ? "true":""'
This will result in:
-->
硬編碼的額外 key/value
<pre>
- key: "foo"
   valueExpression: "'bar'"
</pre>
這將導致一個額外的屬性 - foo: [&quot;bar&quot;]<br/>

硬編碼 key，value 從聲明的值複製
<pre>
 - key: "foo"
   valueExpression: "claims.some_claim"
</pre>
結果會是一個 extra 屬性 - foo: [some_claim 的值]

硬編碼 key，value 從聲明的值派生<br/>
<pre>
- key: "admin"
  valueExpression: '(has(claims.is_admin) && claims.is_admin) ? "true":""'
</pre>
這將導致：
</p>
<ul>
<li>
<!--
if is_admin claim is present and true, extra attribute - admin: [&quot;true&quot;]
-->
如果 is_admin 聲明存在且爲 true，則添加 extra 屬性 - admin: [&quot;true&quot;]
</li>
<li>
<!--
if is_admin claim is present and false or is_admin claim is not present, no extra attribute will be added
-->
如果 is_admin 聲明存在且爲 false 或 is_admin 聲明不存在，則不會添加 extra 屬性
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `ClaimOrExpression`     {#apiserver-k8s-io-v1beta1-ClaimOrExpression}

<!--
**Appears in:**
-->
**出現在：**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

<p>
<!--
ClaimOrExpression provides the configuration for a single claim or expression.
-->
ClaimOrExpression 爲單個聲明或表達式提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   claim is the JWT claim to use.
Either claim or expression must be set.
Mutually exclusive with expression.
   -->
   <code>claim</code> 是要使用的 JWT 聲明。
   <code>claim</code> 或 <code>expression</code> 必須設置一個。
   與 <code>expression</code> 互斥。
   </p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>expression represents the expression which will be evaluated by CEL.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
   -->
   <p>expression 表示將由 CEL 求值的表達式。</p>
   <p>CEL 表達式可以訪問令牌聲明的內容，這些內容被組織成 CEL 變量：</p>
<ul>
<!--
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
-->
<li>'claims' 是聲明名稱到聲明值的映射。
例如，一個名爲 'sub' 的變量可以通過 'claims.sub' 訪問。
嵌套的聲明可以使用點表示法訪問，例如 'claims.foo.bar'。</li>
</ul>
<!--
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim.</p>
-->
<p>關於 CEL 的文檔：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>與 claim 互斥。</p>
</td>
</tr>
</tbody>
</table>

## `ClaimValidationRule`     {#apiserver-k8s-io-v1beta1-ClaimValidationRule}

<!--
**Appears in:**
-->
**出現在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

<p>
<!--
ClaimValidationRule provides the configuration for a single claim validation rule.
-->
ClaimValidationRule 爲單個聲明驗證規則提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   claim is the name of a required claim.
Same as --oidc-required-claim flag.
Only string claim keys are supported.
Mutually exclusive with expression and message.
   -->
   claim 是所需要的聲明的名稱。
   與 <code>--oidc-required-claim</code> 標誌相同。
   僅支持用字符串聲明鍵。
   與 <code>expression</code> 和 <code>message</code> 互斥。
   </p>
</td>
</tr>
<tr><td><code>requiredValue</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   requiredValue is the value of a required claim.
Same as --oidc-required-claim flag.
Only string claim values are supported.
If claim is set and requiredValue is not set, the claim must be present with a value set to the empty string.
Mutually exclusive with expression and message.
   -->
   requiredValue 是聲明中必須包含的值。
   與 --oidc-required-claim 標誌相同。
   僅支持用字符串聲明值。
   如果設置了 claim 而未設置 requiredValue，則 claim 必須存在且值必須設置爲空字符串。
   與 expression 和 message 互斥。
   </p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>expression represents the expression which will be evaluated by CEL.
Must produce a boolean.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
   -->
   <p>expression 表示將由 CEL 求值的表達式。
   必須生成一個布爾值。</p>
   <p>CEL 表達式可以訪問令牌聲明的內容，這些內容被組織成 CEL 變量：</p>
<ul>
<!--
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.
Must return true for the validation to pass.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim and requiredValue.</p>
-->
<li>'claims' 是聲明名稱到聲明值的映射。
例如，一個名爲 'sub' 的變量可以通過 'claims.sub' 訪問。
嵌套的聲明可以使用點表示法訪問，例如 'claims.foo.bar'。
必須返回 true，纔有可能通過檢查。</li>
</ul>
<p>關於 CEL 的文檔：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>與 claim 和 requiredValue 互斥。</p>
</td>
</tr>
<tr><td><code>message</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   message customizes the returned error message when expression returns false.
message is a literal string.
Mutually exclusive with claim and requiredValue.
   -->
   message 自定義當 expression 返回 false 時的錯誤消息。
   message 是一個字符串文字。
   與 claim 和 requiredValue 互斥。
   </p>
</td>
</tr>
</tbody>
</table>

## `Connection`     {#apiserver-k8s-io-v1beta1-Connection}

<!--
**Appears in:**
-->
**出現在：**

- [EgressSelection](#apiserver-k8s-io-v1beta1-EgressSelection)

<p>
<!--
Connection provides the configuration for a single egress selection client.
-->
Connection 提供某個出站流量選擇器客戶端（Egress Selector Client）的設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>proxyProtocol</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p>
   <!-- 
   Protocol is the protocol used to connect from client to the konnectivity server. 
   -->
   proxyProtocol 是客戶端連接到 konnectivity 伺服器所使用的協議。
   </p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1beta1-Transport"><code>Transport</code></a>
</td>
<td>
   <p>
   <!-- 
   Transport defines the transport configurations we use to dial to the konnectivity server.
   This is required if ProxyProtocol is HTTPConnect or GRPC. 
   -->
   transport 定義的是傳輸層的設定。我們使用這個設定來聯繫 konnectivity 伺服器。
   當 proxyProtocol 是 HTTPConnect 或 GRPC 時需要設置此字段。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1beta1-EgressSelection}

<!--
**Appears in:**
-->
**出現在：**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)

<p>
<!--
EgressSelection provides the configuration for a single egress selection client.
-->
EgressSelection 爲某個出站流量選擇器客戶端（Egress Selector Client）提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   name is the name of the egress selection.
   Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
   The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot; 
   -->
   name 是出站流量選擇（egress selection）的名稱。當前支持的取值有 &quot;controlplane&quot;，
   &quot;master&quot;，&quot;etcd&quot; 和 &quot;cluster&quot;。
   &quot;master&quot; 出站流量選擇（egress selection）已被棄用，推薦使用 &quot;controlplane&quot;。
   </p>
</td>
</tr>
<tr><td><code>connection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-Connection"><code>Connection</code></a>
</td>
<td>
   <p>
   <!--
   connection is the exact information used to configure the egress selection
   -->
   connection 是用來設定出站流量選擇（egress selection）的確切資訊。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorType`     {#apiserver-k8s-io-v1beta1-EgressSelectorType}
  
<!--  
(Alias of `string`)

**Appears in:**
-->
（別名爲 `string`）

**出現在：**

- [Issuer](#apiserver-k8s-io-v1beta1-Issuer)

<p>
<!--
EgressSelectorType is an indicator of which egress selection should be used for sending traffic.
-->
EgressSelectorType 是一個指示符，表明應使用哪種出口選擇器來發送流量。
</p>

## `ExtraMapping`     {#apiserver-k8s-io-v1beta1-ExtraMapping}

<!--
**Appears in:**
-->
**出現在：**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

<!--
<p>ExtraMapping provides the configuration for a single extra mapping.</p>
-->
<p>ExtraMapping 爲單個 extra 映射提供設定資訊。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>key</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   key is a string to use as the extra attribute key.
key must be a domain-prefix path (e.g. example.org/foo). All characters before the first &quot;/&quot; must be a valid
subdomain as defined by RFC 1123. All characters trailing the first &quot;/&quot; must
be valid HTTP Path characters as defined by RFC 3986.
key must be lowercase.
Required to be unique.
   -->
   key 是用作 extra 屬性鍵的字符串。
   key 必須是域前綴路徑（例如 example.org/foo）。第一個 &quot;/&quot; 之前的所有字符必須是符合
   RFC 1123 定義的有效子域名。第一個 &quot;/&quot; 之後的所有字符必須是符合 RFC 3986
   定義的有效 HTTP 路徑字符。
   key 必須是小寫。
   必須是唯一的。
   </p>
</td>
</tr>
<tr><td><code>valueExpression</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
   <p>valueExpression is a CEL expression to extract extra attribute value.
valueExpression must produce a string or string array value.
&quot;&quot;, [], and null values are treated as the extra mapping not being present.
Empty string values contained within a string array are filtered out.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
<ul>
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
   -->
   <p>valueExpression 是一個 CEL 表達式，用於提取 extra 中的屬性值。
   valueExpression 必須生成一個字符串或字符串數組值。
     &quot;&quot;、[] 和 null 值被視爲不存在 extra 映射。
   字符串數組中包含的空字符串值將被過濾掉。</p>
<p>CEL 表達式可以訪問令牌聲明的內容，這些內容被組織成 CEL 變量：</p>
<ul>
<li>'claims' 是聲明名稱到聲明值的映射。
例如，一個名爲 'sub' 的變量可以通過 'claims.sub' 訪問。
嵌套的聲明可以使用點表示法訪問，例如 'claims.foo.bar'。</li>
</ul>
<p>關於 CEL 的文檔：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
</td>
</tr>
</tbody>
</table>

## `Issuer`     {#apiserver-k8s-io-v1beta1-Issuer}

<!--
**Appears in:**
-->
**出現在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

<!--
<p>Issuer provides the configuration for an external provider's specific settings.</p>
-->
<p>Issuer 爲外部提供者的特定設置提供設定。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>url</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   url points to the issuer URL in a format https://url or https://url/path.
This must match the &quot;iss&quot; claim in the presented JWT, and the issuer returned from discovery.
Same value as the --oidc-issuer-url flag.
Discovery information is fetched from &quot;{url}/.well-known/openid-configuration&quot; unless overridden by discoveryURL.
Required to be unique across all JWT authenticators.
Note that egress selection configuration is not used for this network connection.
   -->
   url 指向頒發者 URL，格式爲 https://url 或 https://url/path。
   此 URL 必須與所提供的 JWT 中的 &quot;iss&quot; 聲明以及從發現中返回的頒發者匹配。
   與 --oidc-issuer-url 標誌的值相同。
   除非被 discoveryURL 覆蓋，否則發現資訊將從 &quot;{url}/.well-known/openid-configuration&quot; 獲取。
   在所有 JWT 身份認證器中必須唯一。
   請注意，此網路連接不使用出站流量選擇設定。
   </p>
</td>
</tr>
<tr><td><code>discoveryURL</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   discoveryURL, if specified, overrides the URL used to fetch discovery
information instead of using &quot;{url}/.well-known/openid-configuration&quot;.
The exact value specified is used, so &quot;/.well-known/openid-configuration&quot;
must be included in discoveryURL if needed.
   -->
   discoveryURL（如果指定）會覆蓋用於獲取發現資訊的 URL，而不是使用
   &quot;{url}/.well-known/openid-configuration&quot;。
   使用指定的確切值，因此如果需要，必須在 discoveryURL 中包含
   &quot;/.well-known/openid-configuration&quot;。
   </p>
<p>
<!--
The &quot;issuer&quot; field in the fetched discovery information must match the &quot;issuer.url&quot; field
in the AuthenticationConfiguration and will be used to validate the &quot;iss&quot; claim in the presented JWT.
This is for scenarios where the well-known and jwks endpoints are hosted at a different
location than the issuer (such as locally in the cluster).
-->
所獲取的發現資訊中的 &quot;issuer&quot; 字段必須與 AuthenticationConfiguration
中的 &quot;issuer.url&quot; 字段匹配，並將用於檢驗所提供的 JWT 中的 &quot;iss&quot; 聲明。
這適用於 well-known 和 jwks 端點託管在與頒發者不同的位置（例如在叢集中本地託管）的場景。
</p>
<p>
<!--
Example:
A discovery url that is exposed using kubernetes service 'oidc' in namespace 'oidc-namespace'
and discovery information is available at '/.well-known/openid-configuration'.
discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot;
certificateAuthority is used to verify the TLS connection and the hostname on the leaf certificate
must be set to 'oidc.oidc-namespace'.</p>
-->
示例：
發現 URL 是通過 Kubernetes 在命名空間 'oidc-namespace' 中的服務 'oidc' 公佈的，
而訪問 '/.well-known/openid-configuration' 可以獲得發現資訊。
discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot;
certificateAuthority 用於驗證 TLS 連接，葉證書上的主機名必須設置爲 'oidc.oidc-namespace'。
</p>
<!--
<p>curl https://oidc.oidc-namespace/.well-known/openid-configuration (.discoveryURL field)
{
issuer: &quot;https://oidc.example.com&quot; (.url field)
}</p>
<p>discoveryURL must be different from url.
Required to be unique across all JWT authenticators.
Note that egress selection configuration is not used for this network connection.</p>
-->
<p>
<pre><code>
curl https://oidc.oidc-namespace/.well-known/openid-configuration （discoveryURL 字段）
{
   issuer: &quot;https://oidc.example.com&quot; （url 字段）
}
</code>
</pre>
</p>
<p>discoveryURL 必須與 url 不同。
在所有 JWT 身份認證器中必須唯一。
請注意，此網路連接不使用出站流量選擇設定。</p>
</td>
</tr>
<tr><td><code>certificateAuthority</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   certificateAuthority contains PEM-encoded certificate authority certificates
used to validate the connection when fetching discovery information.
If unset, the system verifier is used.
Same value as the content of the file referenced by the --oidc-ca-file flag.
   -->
   certificateAuthority 包含 PEM 編碼的證書頒發機構證書，
   用於在獲取發現資訊時驗證連接。
   如果未設置，則使用系統驗證器。
   與 --oidc-ca-file 標誌引用的檔案內容相同。
   </p>
</td>
</tr>
<tr><td><code>audiences</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   audiences is the set of acceptable audiences the JWT must be issued to.
At least one of the entries must match the &quot;aud&quot; claim in presented JWTs.
Same value as the --oidc-client-id flag (though this field supports an array).
Required to be non-empty.
   -->
   audiences 是 JWT 必須簽發給的可接受受衆集。
   所提供的 JWT 中的 &quot;aud&quot; 聲明必須至少與其中一個條目匹配。
   與 --oidc-client-id 標誌的值相同（儘管此字段支持數組）。
   必須爲非空。
   </p>
</td>
</tr>
<tr><td><code>audienceMatchPolicy</code><br/>
<a href="#apiserver-k8s-io-v1beta1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a>
</td>
<td>
   <p>
   <!--
   audienceMatchPolicy defines how the &quot;audiences&quot; field is used to match the &quot;aud&quot; claim in the presented JWT.
Allowed values are:
   -->
   audienceMatchPolicy 定義瞭如何使用 "audiences" 字段來匹配所提供的 JWT 中的 "aud" 聲明。
   允許的值有：
   </p>
<ol>
<!--
<li>&quot;MatchAny&quot; when multiple audiences are specified and</li>
<li>empty (or unset) or &quot;MatchAny&quot; when a single audience is specified.</li>
-->
<li>&quot;MatchAny&quot; 當指定多個受衆時</li>
<li>空（或未設置）或 &quot;MatchAny&quot; （僅指定單個受衆時）</li>
</ol>
<ul>
<li>
<!--
<p>MatchAny: the &quot;aud&quot; claim in the presented JWT must match at least one of the entries in the &quot;audiences&quot; field.
For example, if &quot;audiences&quot; is [&quot;foo&quot;, &quot;bar&quot;], the &quot;aud&quot; claim in the presented JWT must contain either &quot;foo&quot; or &quot;bar&quot; (and may contain both).</p>
-->
<p>MatchAny：所提供的 JWT 中的 &quot;aud&quot; 聲明必須至少與 &quot;audiences&quot;
字段中的一個條目匹配。
例如，如果 &quot;audiences&quot; 是 [&quot;foo&quot;, &quot;bar&quot;]，則所提供的
JWT 中的 &quot;aud&quot; 聲明必須包含 &quot;foo&quot; 或 &quot;bar&quot;（也可以同時包含兩者）。
</p>
</li>
<li>
<!--
<p>&quot;&quot;: The match policy can be empty (or unset) when a single audience is specified in the &quot;audiences&quot; field. The &quot;aud&quot; claim in the presented JWT must contain the single audience (and may contain others).</p>
-->
<p>&quot;&quot;：當 &quot;audiences&quot; 字段中指定單個受衆時，匹配策略可以爲空（或未設置）。
所提供的 JWT 中的 &quot;aud&quot; 聲明必須包含該單個受衆（並且可以包含其他受衆）。</p>
</li>
</ul>
<p>
<!--
For more nuanced audience validation, use claimValidationRules.
example: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])' to require an exact match.
-->
對於更精細的受衆驗證，請使用 claimValidationRules。
示例：claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])'
以要求精確匹配。
</p>
</td>
</tr>
<tr><td><code>egressSelectorType</code><br/>
<a href="#apiserver-k8s-io-v1beta1-EgressSelectorType"><code>EgressSelectorType</code></a>
</td>
<td>
<p>
<!--
egressSelectorType is an indicator of which egress selection should be used for sending all traffic related
to this issuer (discovery, JWKS, distributed claims, etc).  If unspecified, no custom dialer is used.
When specified, the valid choices are &quot;controlplane&quot; and &quot;cluster&quot;.  These correspond to the associated
values in the --egress-selector-config-file.
-->
<code>egressSelectorType</code> 是一個指示符，
表明應使用哪種出口選擇器來發送與此頒發者相關的所有流量（發現、JWKS、分佈式聲明等）。
如果未指定，則不使用自定義撥號器。當指定時，有效選項是 &quot;controlplane&quot;
和 &quot;cluster&quot;。
這些對應於 <code>--egress-selector-config-file</code> 中的關聯值。
</p>
<ul>
<li>
<p>
<!--
controlplane: for traffic intended to go to the control plane.
-->
controlplane: 用於前往控制平面的流量。
</p>
</li>
<li>
<p>
<!--
cluster: for traffic intended to go to the system being managed by Kubernetes.
-->
cluster：用於指向由 Kubernetes 管理的系統的流量。
</p>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `JWTAuthenticator`     {#apiserver-k8s-io-v1beta1-JWTAuthenticator}

<!--
**Appears in:**
-->
**出現在：**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1beta1-AuthenticationConfiguration)

<p>
<!--
JWTAuthenticator provides the configuration for a single JWT authenticator.
-->
JWTAuthenticator 爲單個 JWT 身份認證器提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>issuer</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-Issuer"><code>Issuer</code></a>
</td>
<td>
   <p>
   <!--
   issuer contains the basic OIDC provider connection options.
   -->
   issuer 包含基本的 OIDC 提供者連接選項。
   </p>
</td>
</tr>
<tr><td><code>claimValidationRules</code><br/>
<a href="#apiserver-k8s-io-v1beta1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a>
</td>
<td>
   <p>
   <!--
   claimValidationRules are rules that are applied to validate token claims to authenticate users.
   -->
   claimValidationRules 是用於驗證令牌聲明以認證使用者的規則。
   </p>
</td>
</tr>
<tr><td><code>claimMappings</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-ClaimMappings"><code>ClaimMappings</code></a>
</td>
<td>
   <p>
   <!--
   claimMappings points claims of a token to be treated as user attributes.
   -->
   claimMappings 指向要視爲使用者屬性的令牌聲明。
   </p>
</td>
</tr>
<tr><td><code>userValidationRules</code><br/>
<a href="#apiserver-k8s-io-v1beta1-UserValidationRule"><code>[]UserValidationRule</code></a>
</td>
<td>
   <p>
   <!--
   userValidationRules are rules that are applied to final user before completing authentication.
These allow invariants to be applied to incoming identities such as preventing the
use of the system: prefix that is commonly used by Kubernetes components.
The validation rules are logically ANDed together and must all return true for the validation to pass.
   -->
   userValidationRules 是在完成身份認證之前應用於最終使用者的規則。
   這些規則允許將不變量應用於傳入的身份，例如禁止使用 Kubernetes 組件常用的 <code>system:</code> 前綴。
   驗證規則在邏輯上是 AND 關係，必須全部返回 true 才能通過驗證。
   </p>
</td>
</tr>
</tbody>
</table>

## `PrefixedClaimOrExpression`     {#apiserver-k8s-io-v1beta1-PrefixedClaimOrExpression}

<!--
**Appears in:**
-->
**出現在：**

- [ClaimMappings](#apiserver-k8s-io-v1beta1-ClaimMappings)

<p>
<!--
PrefixedClaimOrExpression provides the configuration for a single prefixed claim or expression.
-->
PrefixedClaimOrExpression 爲單個帶前綴的聲明或表達式提供設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   claim is the JWT claim to use.
Mutually exclusive with expression.
   -->
   claim 是要使用的 JWT 聲明。
   與 expression 互斥。
   </p>
</td>
</tr>
<tr><td><code>prefix</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   prefix is prepended to claim's value to prevent clashes with existing names.
prefix needs to be set if claim is set and can be the empty string.
Mutually exclusive with expression.
   -->
   prefix 是添加到聲明值前面的前綴，以防止與現有名稱衝突。
   如果設置了 claim，則需要設置 prefix，並且可以是空字符串。
   與 expression 互斥。
   </p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
<!--
   <p>expression represents the expression which will be evaluated by CEL.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
<ul>
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim and prefix.</p>
-->
   <p>expression 表示將由 CEL 評估的表達式。</p>
<p>CEL 表達式可以訪問令牌聲明的內容，這些內容被組織成 CEL 變量：</p>
<ul>
<li>'claims' 是聲明名稱到聲明值的映射。
例如，一個名爲 'sub' 的變量可以通過 'claims.sub' 訪問。
嵌套的聲明可以使用點表示法訪問，例如 'claims.foo.bar'。</li>
</ul>
<p>關於 CEL 的文檔：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>與 claim 和 prefix 互斥。</p>
</td>
</tr>
</tbody>
</table>

## `ProtocolType`     {#apiserver-k8s-io-v1beta1-ProtocolType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 類型的別名）

**出現在：**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)

<p>
<!--
ProtocolType is a set of valid values for Connection.ProtocolType
-->
ProtocolType 是 connection.protocolType 的合法值集合。
</p>

## `TCPTransport`     {#apiserver-k8s-io-v1beta1-TCPTransport}

<!--
**Appears in:**
-->
**出現在：**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

<p>
<!--
TCPTransport provides the information to connect to konnectivity server via TCP
-->
TCPTransport 提供使用 TCP 連接 konnectivity 伺服器時需要的資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>url</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   URL is the location of the konnectivity server to connect to.
   As an example it might be &quot;https://127.0.0.1:8131&quot;
   -->
   url 是要連接的 konnectivity 伺服器的位置。例如 &quot;https://127.0.0.1:8131&quot;。
   </p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p>
   <!--
   TLSConfig is the config needed to use TLS when connecting to konnectivity server
   -->
   tlsConfig 是使用 TLS 來連接 konnectivity 伺服器時需要的資訊。
   </p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1beta1-TLSConfig}

<!--
**Appears in:**
-->
**出現在：**

- [TCPTransport](#apiserver-k8s-io-v1beta1-TCPTransport)

<p>
<!--
TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport
-->
TLSConfig 爲連接 konnectivity 伺服器提供身份認證資訊。僅用於 TCPTransport。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.
   -->
   caBundle 是指向用來確定與 konnectivity 伺服器間信任關係的 CA 證書包的檔案位置。
   如果 TCPTransport.URL 前綴爲 "http://" 時必須不設置，或者設置爲空。
   如果 TCPTransport.URL 前綴爲 "https://" 並且此字段未設置，則預設使用系統的信任根。
   </p>
</td>
</tr>
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   Must be configured if TCPTransport.URL is prefixed with https://
   -->
   clientKey 是與 konnectivity 伺服器進行 mTLS 握手時使用的客戶端祕鑰檔案位置。
   如果 TCPTransport.URL 前綴爲 http://，必須不指定或者爲空；
   如果 TCPTransport.URL 前綴爲 https://，必須設置。
   </p>
</td>
</tr>
<tr><td><code>clientCert</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   clientCert is the file location of the client certificate to be used in mtls handshakes with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   Must be configured if TCPTransport.URL is prefixed with https://
   -->
   <code>clientCert</code> 是與 konnectivity 伺服器進行 mTLS 握手時使用的客戶端證書檔案位置。
   如果 TCPTransport.URL 前綴爲 http://，必須不指定或者爲空；
   如果 TCPTransport.URL 前綴爲 https://，必須設置。
   </p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1beta1-Transport}

<!--
**Appears in:**
-->
**出現在：**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)

<p>
<!--
Transport defines the transport configurations we use to dial to the konnectivity server
-->
Transport 定義聯繫 konnectivity 伺服器時要使用的傳輸層設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p>
   <!--
   TCP is the TCP configuration for communicating with the konnectivity server via TCP
   ProxyProtocol of GRPC is not supported with TCP transport at the moment
   Requires at least one of TCP or UDS to be set
   -->
   tcp 包含通過 TCP 與 konnectivity 伺服器通信時使用的 TCP 設定。
   目前使用 TCP 傳輸時不支持 GRPC 的 proxyProtocol。
   tcp 和 uds 二者至少設置一個。
   </p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1beta1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p>
   <!--
   UDS is the UDS configuration for communicating with the konnectivity server via UDS
   Requires at least one of TCP or UDS to be set
   -->
   uds 包含通過 UDS 與 konnectivity 伺服器通信時使用的 UDS 設定。
   tcp 和 uds 二者至少設置一個。
   </p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1beta1-UDSTransport}

<!--
**Appears in:**
-->
**出現在：**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

<p>
<!--
UDSTransport provides the information to connect to konnectivity server via UDS
-->
UDSTransport 設置通過 UDS 連接 konnectivity 伺服器時需要的資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>udsName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   UDSName is the name of the unix domain socket to connect to konnectivity server
   This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)
   -->
   udsName 是與 konnectivity 伺服器連接時使用的 UNIX 域套接字名稱。
   字段取值不要求包含 unix:// 前綴。
   （例如：/etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket）
   </p>
</td>
</tr>
</tbody>
</table>

## `UserValidationRule`     {#apiserver-k8s-io-v1beta1-UserValidationRule}

<!--
**Appears in:**
-->
**出現在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1beta1-JWTAuthenticator)

<p>
<!--
UserValidationRule provides the configuration for a single user info validation rule.
-->
UserValidationRule 爲單個使用者資訊驗證規則提供設定資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>expression</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   expression represents the expression which will be evaluated by CEL.
Must return true for the validation to pass.
   -->
   expression 表示將由 CEL 求值的表達式。
   驗證通過時必須返回 true。
   </p>
<!--
<p>CEL expressions have access to the contents of UserInfo, organized into CEL variable:</p>
<ul>
<li>'user' - authentication.k8s.io/v1, Kind=UserInfo object
Refer to https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122 for the definition.
API documentation: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
-->
<p>CEL 表達式可以訪問 UserInfo 的內容，這些內容被組織成 CEL 變量：</p>
<ul>
<li>'user' - authentication.k8s.io/v1，Kind=UserInfo 對象
關於 UserInfo 的定義，參閱 https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122。
API 文檔：https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</li>
</ul>
<p>關於 CEL 的文檔：https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</p>
</td>
</tr>
<tr><td><code>message</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   message customizes the returned error message when rule returns false.
   message is a literal string.
   -->
   message 自定義當規則返回 false 時的錯誤消息。
   message 是一個字符串文字。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#apiserver-k8s-io-v1beta1-WebhookConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [AuthorizerConfiguration](#apiserver-k8s-io-v1beta1-AuthorizerConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>authorizedTTL</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!--
   The duration to cache 'authorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-authorized-ttl</code> flag
Default: 5m0s
   -->
   對來自 Webhook 鑑權組件的 “authorized” 響應的緩存時長。
   與設置 <code>--authorization-webhook-cache-authorized-ttl</code> 標誌相同。
   預設值：5m0s。
   </p>
</td>
</tr>
<tr><td><code>cacheAuthorizedRequests</code><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
CacheAuthorizedRequests specifies whether authorized requests should be cached.
If set to true, the TTL for cached decisions can be configured via the
AuthorizedTTL field.
Default: true
-->
<code>cacheAuthorizedRequests</code> 指定是否應當緩存已授權的請求。
如果設置爲 true，緩存決策的 TTL 可以通過 <code>authorizedTTL</code> 字段設定。
預設值：true
</p>
</td>
</tr>
<tr><td><code>unauthorizedTTL</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!--
   The duration to cache 'unauthorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-unauthorized-ttl</code> flag
Default: 30s
   -->
   對來自 Webhook 鑑權組件的 “unauthorized” 響應的緩存時長。
與設置 <code>--authorization-webhook-cache-unauthorized-ttl</code> 標誌相同。
預設值：30s
   </p>

</td>
</tr>
<tr><td><code>cacheUnauthorizedRequests</code><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
CacheUnauthorizedRequests specifies whether unauthorized requests should be cached.
If set to true, the TTL for cached decisions can be configured via the
UnauthorizedTTL field.
Default: true
-->
<code>cacheUnauthorizedRequests</code> 指定是否應當緩存未授權的請求。
如果設置爲 true，緩存決策的 TTL 可以通過 <code>unauthorizedTTL</code> 字段設定。
預設值：true
</p>
</td>
</tr>
<tr><td><code>timeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!--
   Timeout for the webhook request
Maximum allowed value is 30s.
Required, no default value.
   -->
   Webhook 請求超時時間。
   允許的最大時間爲 30 秒。
   必需，沒有預設值。
   </p>
</td>
</tr>
<tr><td><code>subjectAccessReviewVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   The API version of the authorization.k8s.io SubjectAccessReview to
send to and expect from the webhook.
Same as setting <code>--authorization-webhook-version</code> flag
Valid values: v1beta1, v1
Required, no default value
   -->
   要發送到 Webhook 並期望從 Webhook 獲得的 authorization.k8s.io SubjectAccessReview 的 API 版本。
與設置 <code>--authorization-webhook-version</code> 標誌相同。
有效值：v1beta1、v1。
必需，無預設值
   </p>
</td>
</tr>
<tr><td><code>matchConditionSubjectAccessReviewVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
version the CEL expressions are evaluated against
Valid values: v1
Required, no default value
   -->
   matchConditionSubjectAccessReviewVersion 指定對 CEL 表達式求值時使用的 SubjectAccessReview 版本。
   有效值：v1。必需，無預設值。
   </p>
</td>
</tr>
<tr><td><code>failurePolicy</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Controls the authorization decision when a webhook request fails to
complete or returns a malformed response or errors evaluating
matchConditions.
Valid values:
   -->
   控制當 Webhook 請求無法完成或返回格式錯誤的響應或計算 matchConditions 出現錯誤時的鑑權決定。
   有效值：
   </p>
<ul>
<!--
<li>NoOpinion: continue to subsequent authorizers to see if one of
them allows the request</li>
<li>Deny: reject the request without consulting subsequent authorizers
Required, with no default.</li>
-->
<li>NoOpinion：繼續執行後續鑑權組件，看其中是否有組件允許該請求；</li>
<li>Deny：拒絕請求而不考慮後續鑑權組件。</li>
</ul>
必需，沒有預設值。
</td>
</tr>
<tr><td><code>connectionInfo</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
</td>
<td>
   <p>
   <!--
   ConnectionInfo defines how we talk to the webhook
   -->
   ConnectionInfo 定義 Webhook 如何與伺服器通信。
   </p>
</td>
</tr>
<tr><td><code>matchConditions</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
</td>
<td>
<!--
   <p>matchConditions is a list of conditions that must be met for a request to be sent to this
webhook. An empty list of matchConditions matches all requests.
There are a maximum of 64 match conditions allowed.</p>
<p>The exact matching logic is (in order):</p>
-->
   <p>matchConditions 是將請求發送到此 Webhook 必須滿足的條件列表。matchConditions 爲空列表表示匹配所有請求。
   最多允許 64 個匹配條件。</p>
<p>精確匹配邏輯如下（按順序）：</p>
<ol>
<!--
<li>If at least one matchCondition evaluates to FALSE, then the webhook is skipped.</li>
<li>If ALL matchConditions evaluate to TRUE, then the webhook is called.</li>
<li>If at least one matchCondition evaluates to an error (but none are FALSE):
<ul>
<li>If failurePolicy=Deny, then the webhook rejects the request</li>
<li>If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped</li>
-->
<li>如果至少一個 matchCondition 計算結果爲 FALSE，則跳過 Webhook。</li>
<li>如果所有 matchConditions 計算結果爲 TRUE，則調用 Webhook。</li>
<li>如果至少一個 matchCondition 計算結果爲錯誤（但沒有一個爲 FALSE）：
<ul>
<li>如果 FailurePolicy=Deny，則 Webhook 拒絕請求</li>
<li>如果 FailurePolicy=NoOpinion，則忽略錯誤並跳過 Webhook</li>
</ul>
</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `WebhookConnectionInfo`     {#apiserver-k8s-io-v1beta1-WebhookConnectionInfo}

<!--
**Appears in:**
-->
**出現在：**

- [WebhookConfiguration](#apiserver-k8s-io-v1beta1-WebhookConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
   <p>Controls how the webhook should communicate with the server.
Valid values:</p>
<ul>
<li>KubeConfigFile: use the file specified in kubeConfigFile to locate the
server.</li>
<li>InClusterConfig: use the in-cluster configuration to call the
SubjectAccessReview API hosted by kube-apiserver. This mode is not
allowed for kube-apiserver.</li>
-->
   <p>控制 Webhook 如何與伺服器通信。
有效值：</p>
<ul>
<li>KubeConfigFile：使用 <code>kubeConfigFile</code> 中指定的檔案來定位伺服器。</li>
<li>InClusterConfig：使用叢集內設定來調用由 kube-apiserver 託管的 SubjectAccessReview API，kube-apiserver 不允許使用此模式。</li>
</ul>
</td>
</tr>
<tr><td><code>kubeConfigFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Path to KubeConfigFile for connection info
Required, if connectionInfo.Type is KubeConfig
   -->
   包含連接資訊的 KubeConfig 檔案的路徑。
   如果 connectionInfo.type 是 KubeConfig，則爲必需項。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookMatchCondition`     {#apiserver-k8s-io-v1beta1-WebhookMatchCondition}

<!--
**Appears in:**
-->
**出現在：**

- [WebhookConfiguration](#apiserver-k8s-io-v1beta1-WebhookConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>expression</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
the contents would be converted to the v1 version before evaluating the CEL expression.</p>
-->
expression 表示將由 CEL 求值的表達式。求值結果必須爲布爾值。
CEL 表達式可以訪問 v1 版本中的 SubjectAccessReview 的內容。
如果請求變量中 subjectAccessReviewVersion 指定的版本是 v1beta1，
在計算 CEL 表達式之前，內容將被轉換爲 v1 版本。
</p>
<ul>
<!--
<li>'resourceAttributes' describes information for a resource access request and is unset for non-resource requests. e.g. has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</li>
<li>'nonResourceAttributes' describes information for a non-resource access request and is unset for resource requests. e.g. has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.</li>
<li>'user' is the user to test for. e.g. request.user == 'alice'</li>
<li>'groups' is the groups to test for. e.g. ('group1' in request.groups)</li>
<li>'extra' corresponds to the user.Info.GetExtra() method from the authenticator.</li>
<li>'uid' is the information about the requesting user. e.g. request.uid == '1'</li>
-->
<li>'resourceAttributes' 描述了資源訪問請求的資訊，對於非資源請求則未設置。例如：<code>has(request.resourceAttributes) && request.resourceAttributes.namespace == 'default'</code>。</li>
<li>'nonResourceAttributes' 描述了非資源訪問請求的資訊，對於資源請求則未設置。例如：<code>has(request.nonResourceAttributes) && request.nonResourceAttributes.path == '/healthz'</code>。</li>
<li>'user' 是要測試的使用者。例如：<code>request.user == 'alice'</code>。</li>
<li>'groups' 是要測試的使用者組。例如：<code>('group1' in request.groups)</code>。</li>
<li>'extra' 對應於身份驗證器中的 <code>user.Info.GetExtra()</code> 方法。</li>
<li>'uid' 是關於請求使用者的標識資訊。例如：<code>request.uid == '1'</code>。</li>
</ul>
<p>
<!--
Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
-->
關於 CEL 文檔：https://kubernetes.io/zh-cn/docs/reference/using-api/cel/
</p>
</td>
</tr>
</tbody>
</table>
