---
title: kube-apiserver 配置 (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
---
<!--
title: kube-apiserver Configuration (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
auto_generated: true
-->

<p>
<!--
Package v1alpha1 is the v1alpha1 version of the API.
-->
包 v1alpha1 包含 API 的 v1alpha1 版本。
</p>

<!--
## Resource Types
-->
## 资源类型   {#resource-types}

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

## `TracingConfiguration`     {#TracingConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

<p>
<!--
TracingConfiguration provides versioned configuration for OpenTelemetry tracing clients.
-->
TracingConfiguration 为 OpenTelemetry 跟踪客户端提供了不同版本的配置。
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
   采集器的端点，此组件将向其报告跟踪信息。
   连接不安全，目前不支持 TLS。
   推荐不设置，端点为 otlp grpc 默认值 localhost:4317。
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
   SamplingRatePerMillion 是每百万 span 中采集的样本数。
   推荐不设置。如果不设置，采集器将继承其父级 span 的采样率，否则不进行采样。
</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionConfiguration}

<p>
<!--
AdmissionConfiguration provides versioned configuration for admission controllers.
-->
AdmissionConfiguration 为准入控制器提供版本化的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>

<tr><td><code>plugins</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   Plugins allows specifying a configuration per admission control plugin.
   -->
   <code>plugins</code> 允许用户为每个准入控制插件指定设置。
   </p>
</td>
</tr>
</tbody>
</table>

## `AuthenticationConfiguration`     {#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration}

<p>
<!--
AuthenticationConfiguration provides versioned configuration for authentication.
-->
AuthenticationConfiguration 为身份认证提供版本化的配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
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
   jwt 是一个身份认证器列表，用于对使用符合 JWT 的令牌的 Kubernetes 用户进行身份认证。
   身份认证器将尝试解析原始 ID 令牌，验证其是否由配置的发放者签名。用于验证签名的公钥是通过
   OIDC 发现从颁发者的公开端点获取的。对于传入的令牌，将按照此列表中指定的顺序尝试每个 JWT
   身份认证器。但是请注意，其他身份认证器可能会在 JWT 身份认证器之前或之后运行。JWT
   身份认证器相对于其他身份认证器的具体位置在不同版本中既未定义也不稳定。由于每个 JWT
   身份认证器必须具有唯一的颁发者 URL，因此最多只有一个 JWT 身份认证器会尝试基于密码学方法对对令牌进行合法性检查。
   </p>
<p>
<!--
The minimum valid JWT payload must contain the following claims:
-->
最小有效 JWT 负载必须包含以下声明：
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
   如果设置了此字段，则不得设置 <code>--anonymous-auth</code>。
   </p>
</td>
</tr>
</tbody>
</table>

## `AuthorizationConfiguration`     {#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration}

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthorizationConfiguration</code></td></tr>

<tr><td><code>authorizers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   Authorizers is an ordered list of authorizers to
authorize requests against.
This is similar to the --authorization-modes kube-apiserver flag
Must be at least one.
   -->
   authorizers 是一个有序的鉴权器列表，用于对请求进行鉴权。
   这类似于 kube-apiserver <code>--authorization-modes</code> 标志。
   此列表不能为空。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration}

<p>
<!--
EgressSelectorConfiguration provides versioned configuration for egress selector clients.
-->
EgressSelectorConfiguration 为 Egress 选择算符客户端提供版本化的配置选项。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>

<tr><td><code>egressSelections</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p>
   <!--
   connectionServices contains a list of egress selection client configurations
   -->
   <code>connectionServices</code> 包含一组 Egress 选择算符客户端配置选项。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1alpha1-TracingConfiguration}

<p>
<!--
TracingConfiguration provides versioned configuration for tracing clients.
-->
TracingConfiguration 为跟踪客户端提供版本化的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>

<tr><td><code>TracingConfiguration</code> <B>[必需]</B><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>
<!--
(Members of <code>TracingConfiguration</code> are embedded into this type.)
-->
（<code>TracingConfiguration</code> 的成员嵌入到这种类型中。）
   <p>
   <!--
   Embed the component config tracing configuration struct
   -->
   嵌入组件配置中的跟踪配置结构体。
   </p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)

<p>
<!--
AdmissionPluginConfiguration provides the configuration for a single plug-in.
-->
AdmissionPluginConfiguration 为某个插件提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Name is the name of the admission controller.
   It must match the registered admission plugin name.
   -->
   <code>name</code> 是准入控制器的名称。此名称必须与所注册的准入插件名称匹配。
   </p>
</td>
</tr>
<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Path is the path to a configuration file that contains the plugin's configuration
   -->
   <code>path</code> 为指向包含插件配置数据的配置文件的路径。
   </p>
</td>
</tr>
<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>
   <!--
   Configuration is an embedded configuration object to be used as the plugin's
   configuration. If present, it will be used instead of the path to the configuration file.
   -->
   <code>configuration</code> 是一个嵌入的配置对象，用作插件的配置数据来源。
   如果设置了此字段，则使用此字段而不是指向配置文件的路径。
   </p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthCondition`     {#apiserver-k8s-io-v1alpha1-AnonymousAuthCondition}

<!--
**Appears in:**
-->
**出现在：**

- [AnonymousAuthConfig](#apiserver-k8s-io-v1alpha1-AnonymousAuthConfig)

<p>
<!--
AnonymousAuthCondition describes the condition under which anonymous auth
should be enabled.
-->
AnonymousAuthCondition 描述了应启用匿名身份认证的条件。
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
   启用匿名身份认证的路径。
   </p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthConfig`     {#apiserver-k8s-io-v1beta1-AnonymousAuthConfig}

<!--
**Appears in:**
-->
**出现在：**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)

<p>
<!--
AnonymousAuthConfig provides the configuration for the anonymous authenticator.
-->
AnonymousAuthConfig 为匿名身份认证器提供配置信息。</p>

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
<a href="#apiserver-k8s-io-v1alpha1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a>
</td>
<td>
   <p>
   <!--
   If set, anonymous auth is only allowed if the request meets one of the
conditions.
   -->
   如果设置，只有在请求满足其中一个条件时才允许匿名身份认证。
   </p>
</td>
</tr>
</tbody>
</table>

## `AudienceMatchPolicyType`     {#apiserver-k8s-io-v1alpha1-AudienceMatchPolicyType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 类型的别名）

**出现在：**

- [Issuer](#apiserver-k8s-io-v1alpha1-Issuer)

<p>
<!--
AudienceMatchPolicyType is a set of valid values for issuer.audienceMatchPolicy
-->
AudienceMatchPolicyType 是 issuer.audienceMatchPolicy 合法值的集合
</p>

## `AuthorizerConfiguration`     {#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AuthorizationConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizationConfiguration)

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
   type 指的是鉴权器的类型。
   通用 API 服务器支持 &quot;Webhook&quot;。
   其他 API 服务器可能支持其他授权者类型，如 Node、RBAC、ABAC 等。
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
   name 是用于描述 webhook 的名称。
   此字段专为监控机制中的指标提供。
   注意：name 值必须是 DNS1123 标签，如 <code>myauthorizername</code>，
   或子域名，如 <code>myauthorizer.example.domain</code>。
   必需，没有默认值。
   </p>
</td>
</tr>
<tr><td><code>webhook</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   Webhook defines the configuration for a Webhook authorizer
Must be defined when Type=Webhook
Must not be defined when Type!=Webhook
   -->
   webhook 定义 Webhook 鉴权器的配置。
   当 type=Webhook 时必须定义。
   当 type!=Webhook 时不得定义。
   </p>
</td>
</tr>
</tbody>
</table>

## `ClaimMappings`     {#apiserver-k8s-io-v1alpha1-ClaimMappings}

<!--
**Appears in:**
-->
**出现在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

<p>
<!--
ClaimMappings provides the configuration for claim mapping
-->
ClaimMappings 为声明映射提供配置信息
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>username</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
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
claim will be caught at runtime.<
   -->
   username 表示用户名属性的一个选项。
   声明的值必须是单一字符串。
   与 <code>--oidc-username-claim</code> 和 <code>--oidc-username-prefix</code> 标志相同。
   如果设置了 <code>username.expression</code>，则该表达式必须生成一个字符串值。
   如果 <code>username.expression</code> 使用 'claims.email'，则必须在
   <code>username.expression</code> 或 <code>extra[*].valueExpression</code>
   或 <code>claimValidationRules[*].expression</code> 中使用 'claims.email_verified'。
   这里有一个声明验证规则表达式的示例，当 username.claim 设置为 'email' 时与自动应用的验证所匹配：
   'claims.?email_verified.orValue(true)'。
   通过显式地将值与 true 进行比较，我们可以看到类型检查的结果将是一个布尔值，
   并确保在运行时捕获到非布尔值的 email_verified 声明。
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
在基于标志的方法中，<code>--oidc-username-claim</code> 和 <code>--oidc-username-prefix</code>
是可选的。如果未设置 <code>--oidc-username-claim</code>，默认值为 &quot;sub&quot;。
对于身份认证配置，声明或前缀都没有默认值。声明和前缀必须显式设置。
对于声明，如果在传统标志方法中未设置 <code>--oidc-username-claim</code>，
请在身份认证配置中配置 username.claim=&quot;sub&quot;。
对于前缀：
(1) --oidc-username-prefix="-"，未添加前缀到用户名。要实现相同的行为，请在身份认证配置中设置
username.prefix=&quot;&quot;
(2) --oidc-username-prefix=&quot;&quot; 并且 --oidc-username-claim != &quot;email&quot;，
前缀为 &quot;&lt;--oidc-issuer-url 的值&gt;#&quot;。要实现相同的行为，请在身份认证配置中设置
username.prefix=&quot;&lt;issuer.url 的值&gt;#&quot;。
(3) --oidc-username-prefix=&quot;&lt;value&gt;&quot;。要实现相同的行为，请在身份认证配置中设置
username.prefix=&quot;&lt;value&gt;&quot;。
</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
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
   groups 表示 groups 属性的一个选项。
   其中 claim 字段的值必须是字符串或字符串数组。
   如果设置了 <code>groups.claim</code>，则必须指定 prefix 字段（可以是空字符串）。
   如果设置了 <code>groups.expression</code>，则该表达式必须生成一个字符串或字符串数组值。
   &quot;&quot;、[] 和 null 值被视为不存在组映射。
   </p>
</td>
</tr>
<tr><td><code>uid</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-ClaimOrExpression"><code>ClaimOrExpression</code></a>
</td>
<td>
   <p>
   <!--
   uid represents an option for the uid attribute.
Claim must be a singular string claim.
If uid.expression is set, the expression must produce a string value.
   -->
   uid 表示 uid 属性的一个选项。
   其中的 claim 字段必须是一个字符串。
   如果设置了 <code>uid.expression</code>，则该表达式必须生成一个字符串值。
   </p>
</td>
</tr>
<tr><td><code>extra</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-ExtraMapping"><code>[]ExtraMapping</code></a>
</td>
<td>
   <p>
   <!--
   extra represents an option for the extra attribute.
expression must produce a string or string array value.
If the value is empty, the extra mapping will not be present.
   -->
   extra 表示 extra 属性的一个选项。
   expression 必须生成一个字符串或字符串数组值。
   如果值为空，则不会存在 extra 映射。
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
硬编码的额外 key/value
<pre>
- key: "foo"
   valueExpression: "'bar'"
</pre>
这将导致一个额外的属性 - foo: [&quot;bar&quot;]

<br/>

硬编码 key，value 从声明的值复制
<pre>
 - key: "foo"
   valueExpression: "claims.some_claim"
</pre>
结果会是一个 extra 属性 - foo: [some_claim 的值]

硬编码 key，value 从声明的值派生<br/>
<pre>
- key: "admin"
  valueExpression: '(has(claims.is_admin) && claims.is_admin) ? "true":""'
</pre>
这将导致：
</p>
<ul>
<li>
<!--
if is_admin claim is present and true, extra attribute - admin: [&quot;true&quot;]
-->
如果 is_admin 声明存在且为 true，则添加 extra 属性 - admin: [&quot;true&quot;]
</li>
<li>
<!--
if is_admin claim is present and false or is_admin claim is not present, no extra attribute will be added
-->
如果 is_admin 声明存在且为 false 或 is_admin 声明不存在，则不会添加 extra 属性
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `ClaimOrExpression`     {#apiserver-k8s-io-v1alpha1-ClaimOrExpression}

<!--
**Appears in:**
-->
**出现在：**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

<p>
<!--
ClaimOrExpression provides the configuration for a single claim or expression.
-->
ClaimOrExpression 为单个声明或表达式提供配置信息。
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
   claim 是要使用的 JWT 声明。
   claim 或 expression 必须设置一个。
   与 expression 互斥。
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
   <p>expression 表示将由 CEL 求值的表达式。</p>
   <p>CEL 表达式可以访问令牌声明的内容，这些内容被组织成 CEL 变量：</p>
<ul>
<!--
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
-->
<li>'claims' 是声明名称到声明值的映射。
例如，一个名为 'sub' 的变量可以通过 'claims.sub' 访问。
嵌套的声明可以使用点表示法访问，例如 'claims.foo.bar'。</li>
</ul>
<!--
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim.</p>
-->
<p>关于 CEL 的文档：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>与 claim 互斥。</p>
</td>
</tr>
</tbody>
</table>

## `ClaimValidationRule`     {#apiserver-k8s-io-v1alpha1-ClaimValidationRule}

<!--
**Appears in:**
-->
**出现在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

<!--
<p>ClaimValidationRule provides the configuration for a single claim validation rule.</p>
-->
<p>ClaimValidationRule 为单个声明验证规则提供配置信息。</p>

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
   claim 是所需要的声明的名称。
   与 <code>--oidc-required-claim</code> 标志相同。
   仅支持用字符串声明键。
   与 expression 和 message 互斥。
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
   requiredValue 是声明中必须包含的值。
   与 <code>--oidc-required-claim</code> 标志相同。
   仅支持用字符串声明值。
   如果设置了 claim 而未设置 requiredValue，则 claim 必须存在且值必须设置为空字符串。
   与 expression 和 message 互斥。
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
   <p>expression 表示将由 CEL 求值的表达式。
   必须生成一个布尔值。</p>
   <p>CEL 表达式可以访问令牌声明的内容，这些内容被组织成 CEL 变量：</p>
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
<li>'claims' 是声明名称到声明值的映射。
例如，一个名为 'sub' 的变量可以通过 'claims.sub' 访问。
嵌套的声明可以使用点表示法访问，例如 'claims.foo.bar'。
必须返回 true，才有可能通过检查。</li>
</ul>
<p>关于 CEL 的文档：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>与 claim 和 requiredValue 互斥。</p>
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
   message 自定义当 expression 返回 false 时的错误消息。
   message 是一个文本字符串。
   与 claim 和 requiredValue 互斥。
   </p>
</td>
</tr>
</tbody>
</table>

## `Connection`     {#apiserver-k8s-io-v1alpha1-Connection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelection](#apiserver-k8s-io-v1alpha1-EgressSelection)

<p>
<!--
Connection provides the configuration for a single egress selection client.
-->
Connection 提供某个出站选择客户端的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>proxyProtocol</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p>
   <!--
   Protocol is the protocol used to connect from client to the konnectivity server.
   -->
   <code>proxyProtocol</code> 是客户端连接到 konnectivity 服务器所使用的协议。
   </p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-Transport"><code>Transport</code></a>
</td>
<td>
   <p>
   <!--
   Transport defines the transport configurations we use to dial to the konnectivity server.
   This is required if ProxyProtocol is HTTPConnect or GRPC.
   -->
   <code>transport</code> 定义的是传输层的配置。我们使用这个配置来联系 konnectivity 服务器。
   当 <code>proxyProtocol</code> 是 HTTPConnect 或 GRPC 时需要设置此字段。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1alpha1-EgressSelection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)

<p><!--EgressSelection provides the configuration for a single egress selection client.-->
EgressSelection 为某个出站选择客户端提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the name of the egress selection.
   Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
   The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot;
   -->
  <code>name</code> 是 Egress 选择器的名称。当前支持的取值有 &quot;controlplane&quot;，
  &quot;master&quot;，&quot;etcd&quot; 和 &quot;cluster&quot;。
  &quot;master&quot; Egress 选择器已被弃用，推荐使用 &quot;controlplane&quot;。
  </p>
</td>
</tr>
<tr><td><code>connection</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-Connection"><code>Connection</code></a>
</td>
<td>
   <p>
   <!--
   connection is the exact information used to configure the egress selection
   -->
   <code>connection</code> 是用来配置 Egress 选择器的配置信息。
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
（`string` 的别名）

**出现在：**

- [Issuer](#apiserver-k8s-io-v1beta1-Issuer)

<p>
<!--
EgressSelectorType is an indicator of which egress selection should be used for sending traffic.
-->
EgressSelectorType 是一个指示符，表明应使用哪种出口选择器来发送流量。
</p>

## `ExtraMapping`     {#apiserver-k8s-io-v1alpha1-ExtraMapping}

<!--
**Appears in:**
-->
**出现在：**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

<!--
<p>ExtraMapping provides the configuration for a single extra mapping.</p>
-->
<p>ExtraMapping 为单个 extra 映射提供配置信息。</p>

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
   key 是用作 extra 属性键的字符串。
   key 必须是域前缀路径（例如 <code>example.org/foo</code>）。第一个 &quot;/&quot; 之前的所有字符必须是符合
   RFC 1123 定义的有效子域名。第一个 &quot;/&quot; 之后的所有字符必须是符合 RFC 3986
   定义的有效 HTTP 路径字符。
   key 必须是小写。必须是唯一的。
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
   <p>valueExpression 是一个 CEL 表达式，用于提取 extra 中的属性值。
   valueExpression 必须生成一个字符串或字符串数组值。
     &quot;&quot;、[] 和 null 值被视为不存在 extra 映射。
   字符串数组中包含的空字符串值将被过滤掉。</p>
<p>CEL 表达式可以访问令牌声明的内容，这些内容被组织成 CEL 变量：</p>
<ul>
<li>'claims' 是声明名称到声明值的映射。
例如，一个名为 'sub' 的变量可以通过 'claims.sub' 访问。
嵌套的声明可以使用点表示法访问，例如 'claims.foo.bar'。</li>
</ul>
<p>关于 CEL 的文档：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
</td>
</tr>
</tbody>
</table>

## `Issuer`     {#apiserver-k8s-io-v1alpha1-Issuer}

<!--
**Appears in:**
-->
**出现在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

<p>
<!--
Issuer provides the configuration for an external provider's specific settings.
-->
Issuer 为外部提供者的特定设置提供配置。
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
   url points to the issuer URL in a format https://url or https://url/path.
This must match the &quot;iss&quot; claim in the presented JWT, and the issuer returned from discovery.
Same value as the --oidc-issuer-url flag.
Discovery information is fetched from &quot;{url}/.well-known/openid-configuration&quot; unless overridden by discoveryURL.
Required to be unique across all JWT authenticators.
Note that egress selection configuration is not used for this network connection.
   -->
   url 指向颁发者 URL，格式为 https://url 或 https://url/path。
   此 URL 必须与所提供的 JWT 中的 &quot;iss&quot; 声明以及从发现中返回的颁发者匹配。
   与 --oidc-issuer-url 标志的值相同。
   除非被 discoveryURL 覆盖，否则发现信息将从 &quot;{url}/.well-known/openid-configuration&quot; 获取。
   在所有 JWT 身份认证器中必须唯一。
   请注意，此网络连接不使用出站流量选择配置。
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
   discoveryURL（如果指定）会覆盖用于获取发现信息的 URL，而不是使用
   &quot;{url}/.well-known/openid-configuration&quot;。
   使用指定的确切值，因此如果需要，必须在 discoveryURL 中包含
   &quot;/.well-known/openid-configuration&quot;。
   </p>
<p>
<!--
The &quot;issuer&quot; field in the fetched discovery information must match the &quot;issuer.url&quot; field
in the AuthenticationConfiguration and will be used to validate the &quot;iss&quot; claim in the presented JWT.
This is for scenarios where the well-known and jwks endpoints are hosted at a different
location than the issuer (such as locally in the cluster).
-->
所获取的发现信息中的 &quot;issuer&quot; 字段必须与 AuthenticationConfiguration
中的 &quot;issuer.url&quot; 字段匹配，并将用于检验所提供的 JWT 中的 &quot;iss&quot; 声明。
这适用于 well-known 和 jwks 端点托管在与颁发者不同的位置（例如在集群中本地托管）的场景。
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
发现 URL 是通过 Kubernetes 在命名空间 'oidc-namespace' 中的服务 'oidc' 公布的，
而访问 '/.well-known/openid-configuration' 可以获得发现信息。
discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot;
certificateAuthority 用于验证 TLS 连接，叶证书上的主机名必须设置为 'oidc.oidc-namespace'。
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
<pre>
<code>
curl https://oidc.oidc-namespace/.well-known/openid-configuration （discoveryURL 字段）
{
   issuer: &quot;https://oidc.example.com&quot; （url 字段）
}
</code>
</pre>
</p>
<p>discoveryURL 必须与 url 不同。
在所有 JWT 身份认证器中必须唯一。
请注意，此网络连接不使用出站流量选择配置。</p>
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
   certificateAuthority 包含 PEM 编码的证书颁发机构证书，
   用于在获取发现信息时验证连接。
   如果未设置，则使用系统验证器。
   与 --oidc-ca-file 标志引用的文件内容相同。
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
   audiences 是 JWT 必须签发给的可接受受众集。
   所提供的 JWT 中的 &quot;aud&quot; 声明必须至少与其中一个条目匹配。
   与 --oidc-client-id 标志的值相同（尽管此字段支持数组）。
   必须为非空。
   </p>
</td>
</tr>
<tr><td><code>audienceMatchPolicy</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a>
</td>
<td>
   <p>
   <!--
   audienceMatchPolicy defines how the &quot;audiences&quot; field is used to match the &quot;aud&quot; claim in the presented JWT.
Allowed values are:
   -->
   audienceMatchPolicy 定义了如何使用 "audiences" 字段来匹配所提供的 JWT 中的 "aud" 声明。
   允许的值有：
   </p>
<ol>
<!--
<li>&quot;MatchAny&quot; when multiple audiences are specified and</li>
<li>empty (or unset) or &quot;MatchAny&quot; when a single audience is specified.</li>
-->
<li>&quot;MatchAny&quot; 当指定多个受众时</li>
<li>空（或未设置）或 &quot;MatchAny&quot; （仅指定单个受众时）</li>
</ol>
<ul>
<li>
<p>
<!--
MatchAny: the &quot;aud&quot; claim in the presented JWT must match at least one of the entries in the &quot;audiences&quot; field.
For example, if &quot;audiences&quot; is [&quot;foo&quot;, &quot;bar&quot;], the &quot;aud&quot; claim in the presented JWT must contain either &quot;foo&quot; or &quot;bar&quot; (and may contain both).
-->
MatchAny：所提供的 JWT 中的 &quot;aud&quot; 声明必须至少与 &quot;audiences&quot;
字段中的一个条目匹配。例如，如果 &quot;audiences&quot; 是 [&quot;foo&quot;, &quot;bar&quot;]，
则所提供的 JWT 中的 &quot;aud&quot; 声明必须包含 &quot;foo&quot; 或 &quot;bar&quot;（也可以同时包含两者）。
</p>
</li>
<li>
<p>
<!--
&quot;&quot;: The match policy can be empty (or unset) when a single audience is specified in the &quot;audiences&quot; field. The &quot;aud&quot; claim in the presented JWT must contain the single audience (and may contain others).
-->
&quot;&quot;：当 &quot;audiences&quot; 字段中指定单个受众时，匹配策略可以为空（或未设置）。
所提供的 JWT 中的 &quot;aud&quot; 声明必须包含该单个受众（并且可以包含其他受众）。
</p>
</li>
</ul>
<p>
<!--
For more nuanced audience validation, use claimValidationRules.
example: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])' to require an exact match.
-->
对于更精细的受众验证，请使用 claimValidationRules。
示例：claimValidationRule[].expression:
'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])'
以要求精确匹配。
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
<code>egressSelectorType</code> 是一个指示符，
表明应使用哪种出口选择器来发送与此颁发者相关的所有流量（发现、JWKS、分布式声明等）。
如果未指定，则不使用自定义拨号器。当指定时，有效选项是 &quot;controlplane&quot;
和 &quot;cluster&quot;。
这些对应于 <code>--egress-selector-config-file</code> 中的关联值。
</p>
<ul>
<li>
<p>
<!--
controlplane: for traffic intended to go to the control plane.
-->
controlplane: 用于前往控制平面的流量。
</p>
</li>
<li>
<p>
<!--
cluster: for traffic intended to go to the system being managed by Kubernetes.
-->
cluster：用于指向由 Kubernetes 管理的系统的流量。
</p>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `JWTAuthenticator`     {#apiserver-k8s-io-v1alpha1-JWTAuthenticator}

<!--
**Appears in:**
-->
**出现在：**

- [AuthenticationConfiguration](#apiserver-k8s-io-v1alpha1-AuthenticationConfiguration)

<!--
<p>JWTAuthenticator provides the configuration for a single JWT authenticator.</p>
-->
<p>JWTAuthenticator 为单个 JWT 身份认证器提供配置信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>issuer</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-Issuer"><code>Issuer</code></a>
</td>
<td>
   <p>
   <!--
   issuer contains the basic OIDC provider connection options.
   -->
   issuer 包含基本的 OIDC 提供者连接选项。
   </p>
</td>
</tr>
<tr><td><code>claimValidationRules</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a>
</td>
<td>
   <p>
   <!--
   claimValidationRules are rules that are applied to validate token claims to authenticate users.
   -->
   claimValidationRules 是用于验证令牌声明以认证用户的规则。</p>
</td>
</tr>
<tr><td><code>claimMappings</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-ClaimMappings"><code>ClaimMappings</code></a>
</td>
<td>
   <p>
   <!--
   claimMappings points claims of a token to be treated as user attributes.
   -->
   claimMappings 指向要视为用户属性的令牌声明。
   </p>
</td>
</tr>
<tr><td><code>userValidationRules</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-UserValidationRule"><code>[]UserValidationRule</code></a>
</td>
<td>
   <p>
   <!--
   userValidationRules are rules that are applied to final user before completing authentication.
These allow invariants to be applied to incoming identities such as preventing the
use of the system: prefix that is commonly used by Kubernetes components.
The validation rules are logically ANDed together and must all return true for the validation to pass.
   -->
   userValidationRules 是在完成身份认证之前应用于最终用户的规则。
   这些规则允许将不变量应用于传入的身份，例如禁止使用 Kubernetes 组件常用的 <code>system:</code> 前缀。
   验证规则在逻辑上是 AND 关系，必须全部返回 true 才能通过验证。
   </p>
</td>
</tr>
</tbody>
</table>

## `PrefixedClaimOrExpression`     {#apiserver-k8s-io-v1alpha1-PrefixedClaimOrExpression}

<!--
**Appears in:**
-->
**出现在：**

- [ClaimMappings](#apiserver-k8s-io-v1alpha1-ClaimMappings)

<!--
<p>PrefixedClaimOrExpression provides the configuration for a single prefixed claim or expression.</p>
-->
<p>PrefixedClaimOrExpression 为单个带前缀的声明或表达式提供配置。</p>

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
   claim 是要使用的 JWT 声明。与 expression 互斥。
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
   prefix 是添加到声明值前面的前缀，以防止与现有名称冲突。
   如果设置了 claim，则需要设置 prefix，并且可以是空字符串。
   与 expression 互斥。</p>
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
   <p>expression 表示将由 CEL 评估的表达式。</p>
<p>CEL 表达式可以访问令牌声明的内容，这些内容被组织成 CEL 变量：</p>
<ul>
<li>'claims' 是声明名称到声明值的映射。
例如，一个名为 'sub' 的变量可以通过 'claims.sub' 访问。
嵌套的声明可以使用点表示法访问，例如 'claims.foo.bar'。</li>
</ul>
<p>关于 CEL 的文档：<a href="https://kubernetes.io/zh-cn/docs/reference/using-api/cel/">https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</a></p>
<p>与 claim 和 prefix 互斥。</p>
</td>
</tr>
</tbody>
</table>

## `ProtocolType`     {#apiserver-k8s-io-v1alpha1-ProtocolType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 类型的别名）

**出现在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)

<p>
<!--
ProtocolType is a set of valid values for Connection.ProtocolType
-->
ProtocolType 是 <code>connection.protocolType</code> 的合法值集合。
</p>

## `TCPTransport`     {#apiserver-k8s-io-v1alpha1-TCPTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p>
<!--
TCPTransport provides the information to connect to konnectivity server via TCP
-->
TCPTransport 提供使用 TCP 连接 konnectivity 服务器时需要的信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>url</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   URL is the location of the konnectivity server to connect to.
   As an example it might be &quot;https://127.0.0.1:8131&quot;
   -->
   <code>url</code> 是要连接的 konnectivity 服务器的位置。例如 &quot;https://127.0.0.1:8131&quot;。
   </p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p>
   <!--
   TLSConfig is the config needed to use TLS when connecting to konnectivity server
   -->
   <code>tlsConfig</code> 是使用 TLS 来连接 konnectivity 服务器时需要的信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1alpha1-TLSConfig}

<!--
**Appears in:**
-->
**出现在：**

- [TCPTransport](#apiserver-k8s-io-v1alpha1-TCPTransport)

<p>
<!--
TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport
-->
TLSConfig 为连接 konnectivity 服务器提供身份认证信息。仅用于 TCPTransport。
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
   <code>caBundle</code> 是指向用来确定与 konnectivity 服务器间信任欢喜的 CA 证书包的文件位置。
   当 <code>tcpTransport.url</code> 前缀为 "http://" 时必须不设置，或者设置为空。
   如果 <code>tcpTransport.url</code> 前缀为 "https://" 并且此字段未设置，则默认使用系统的信任根。
   </p>
</td>
</tr>
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   <p><!--
   clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   Must be configured if TCPTransport.URL is prefixed with https://
   -->
   <code>clientKey</code> 是与 konnectivity 服务器进行 mTLS 握手时使用的客户端秘钥文件位置。
   如果 `tcp.url` 前缀为 <code>http://</code>，必须不指定或者为空；
   如果 `tcp.url` 前缀为 <code>https://</code>，必须设置。
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
   <code>clientCert</code> 是与 konnectivity 服务器进行 mTLS 握手时使用的客户端证书文件位置。
   如果 `tcp.url` 前缀为 <code>http://</code>，必须不指定或者为空；
   如果 `tcp.url` 前缀为 <code>https://</code>，必须设置。
   </p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1alpha1-Transport}

<!--
**Appears in:**
-->
**出现在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)


<p>
<!--
Transport defines the transport configurations we use to dial to the konnectivity server
-->
Transport 定义联系 konnectivity 服务器时要使用的传输层配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p>
   <!--
   TCP is the TCP configuration for communicating with the konnectivity server via TCP
   ProxyProtocol of GRPC is not supported with TCP transport at the moment
   Requires at least one of TCP or UDS to be set
   -->
   <code>tcp</code> 包含通过 TCP 与 konnectivity 服务器通信时使用的 TCP 配置。
   目前使用 TCP 传输时不支持 GRPC 的 <code>proxyProtocol</code>。
   <code>tcp</code> 和 <code>uds</code> 二者至少设置一个。
   </p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p>
   <!--
   UDS is the UDS configuration for communicating with the konnectivity server via UDS
   Requires at least one of TCP or UDS to be set
   -->
   <code>uds</code> 包含通过 UDS 与 konnectivity 服务器通信时使用的 UDS 配置。
   <code>tcp</code> 和 <code>uds</code> 二者至少设置一个。
   </p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1alpha1-UDSTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p>
<!--
UDSTransport provides the information to connect to konnectivity server via UDS
-->
UDSTransport 设置通过 UDS 连接 konnectivity 服务器时需要的信息。
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
   <code>udsName</code> 是与 konnectivity 服务器连接时使用的 UNIX 域套接字名称。
   字段取值不要求包含 <code>unix://</code> 前缀。
   （例如：<code>/etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket</code>）
   </p>
</td>
</tr>
</tbody>
</table>

## `UserValidationRule`     {#apiserver-k8s-io-v1alpha1-UserValidationRule}

<!--
**Appears in:**
-->
**出现在：**

- [JWTAuthenticator](#apiserver-k8s-io-v1alpha1-JWTAuthenticator)

<p>
<!--
UserValidationRule provides the configuration for a single user info validation rule.
-->
UserValidationRule 为单个用户信息验证规则提供配置信息。
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
   expression 表示将由 CEL 求值的表达式。
   验证通过时必须返回 true。
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
<p>CEL 表达式可以访问 UserInfo 的内容，这些内容被组织成 CEL 变量：</p>
<ul>
<li>'user' - authentication.k8s.io/v1，Kind=UserInfo 对象
关于 UserInfo 的定义，参阅 https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122。
API 文档：https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</li>
</ul>
<p>关于 CEL 的文档：https://kubernetes.io/zh-cn/docs/reference/using-api/cel/</p>
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
   message 自定义当规则返回 false 时的错误消息。
   message 是一个文本字符串。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#apiserver-k8s-io-v1alpha1-WebhookConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AuthorizerConfiguration](#apiserver-k8s-io-v1alpha1-AuthorizerConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>authorizedTTL</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   <p>The duration to cache 'authorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-authorized-ttl</code> flag
Default: 5m0s</p>
   -->
   <p>对来自 Webhook 鉴权组件的 “authorized” 响应的缓存时长。
   与设置 <code>--authorization-webhook-cache-authorized-ttl</code> 标志相同。
   默认值：5m0s。</p>
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
<code>cacheAuthorizedRequests</code> 指定是否应当缓存已授权的请求。
如果设置为 true，缓存决策的 TTL 可以通过 <code>authorizedTTL</code> 字段配置。
默认值：true
</p>
</td>
</tr>
<tr><td><code>unauthorizedTTL</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   <p>The duration to cache 'unauthorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-unauthorized-ttl</code> flag
Default: 30s</p>
   -->
   <p>对来自 Webhook 鉴权组件的 “unauthorized” 响应的缓存时长。
与设置 <code>--authorization-webhook-cache-unauthorized-ttl</code> 标志相同。
默认值：30s</p>

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
<code>cacheUnauthorizedRequests</code> 指定是否应当缓存未授权的请求。
如果设置为 true，缓存决策的 TTL 可以通过 <code>unauthorizedTTL</code> 字段配置。
默认值：true
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
   Webhook 请求超时时间。允许的最大时间为 30 秒。
   必需，没有默认值。
   </p>
</td>
</tr>
<tr><td><code>subjectAccessReviewVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>The API version of the authorization.k8s.io SubjectAccessReview to
send to and expect from the webhook.
Same as setting <code>--authorization-webhook-version</code> flag
Valid values: v1beta1, v1
Required, no default value</p>
   -->
   <p>要发送到 Webhook 并期望从 Webhook 获得的 <code>authorization.k8s.io</code> SubjectAccessReview 的 API 版本。
与设置 <code>--authorization-webhook-version</code> 标志相同。
有效值：v1beta1、v1。必需，无默认值</p>
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
   <code>matchConditionSubjectAccessReviewVersion</code> 指定对 CEL 表达式求值时使用的 SubjectAccessReview 版本。
   有效值：v1。必需，无默认值。
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
   控制当 Webhook 请求无法完成或返回格式错误的响应或计算 matchConditions 出现错误时的鉴权决定。
   有效值：
   </p>
<ul>
<!--
<li>NoOpinion: continue to subsequent authorizers to see if one of
them allows the request</li>
<li>Deny: reject the request without consulting subsequent authorizers
Required, with no default.</li>
-->
<li>NoOpinion：继续执行后续鉴权组件，看其中是否有组件允许该请求；</li>
<li>Deny：拒绝请求而不考虑后续鉴权组件。</li>
</ul>
必需，没有默认值。
</td>
</tr>
<tr><td><code>connectionInfo</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
</td>
<td>
   <p>
   <!--
   ConnectionInfo defines how we talk to the webhook
   -->
   <code>connectionInfo</code> 定义 Webhook 如何与服务器通信。
   </p>
</td>
</tr>
<tr><td><code>matchConditions</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
</td>
<td>
<!--
   <p>matchConditions is a list of conditions that must be met for a request to be sent to this
webhook. An empty list of matchConditions matches all requests.
There are a maximum of 64 match conditions allowed.</p>
<p>The exact matching logic is (in order):</p>
-->
   <p><code>matchConditions</code> 是将请求发送到此 Webhook 必须满足的条件列表。
   <code>matchConditions</code> 为空列表表示匹配所有请求。最多允许 64 个匹配条件。</p>
<p>精确匹配逻辑如下（按顺序）：</p>
<ol>
<!--
<li>If at least one matchCondition evaluates to FALSE, then the webhook is skipped.</li>
<li>If ALL matchConditions evaluate to TRUE, then the webhook is called.</li>
<li>If at least one matchCondition evaluates to an error (but none are FALSE):
<ul>
<li>If failurePolicy=Deny, then the webhook rejects the request</li>
<li>If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped</li>
-->
<li>如果至少一个 matchCondition 计算结果为 FALSE，则跳过 Webhook。</li>
<li>如果所有 matchConditions 计算结果为 TRUE，则调用 Webhook。</li>
<li>如果至少一个 matchCondition 计算结果为错误（但没有一个为 FALSE）：
<ul>
<li>如果 FailurePolicy=Deny，则 Webhook 拒绝请求</li>
<li>如果 FailurePolicy=NoOpinion，则忽略错误并跳过 Webhook</li>
</ul>
</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `WebhookConnectionInfo`     {#apiserver-k8s-io-v1alpha1-WebhookConnectionInfo}

<!--
**Appears in:**
-->
**出现在：**

- [WebhookConfiguration](#apiserver-k8s-io-v1alpha1-WebhookConfiguration)

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
   <p>控制 Webhook 如何与服务器通信。有效值：</p>
<ul>
<li>KubeConfigFile：使用 <code>kubeConfigFile</code> 中指定的文件来定位服务器。</li>
<li>InClusterConfig：使用集群内配置来调用由 kube-apiserver 托管的
SubjectAccessReview API，kube-apiserver 不允许使用此模式。</li>
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
   包含连接信息的 KubeConfig 文件的路径。
   如果 <code>connectionInfo.type</code> 是 KubeConfig，则为必需项。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookMatchCondition`     {#apiserver-k8s-io-v1alpha1-WebhookMatchCondition}

<!--
**Appears in:**
-->
**出现在：**

- [WebhookConfiguration](#apiserver-k8s-io-v1alpha1-WebhookConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>expression</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
   <p>expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
the contents would be converted to the v1 version before evaluating the CEL expression.</p>
-->
   <p>表达式表示将由 CEL 求值的表达式。求值结果必须为布尔值。
CEL 表达式可以访问 v1 版本中的 SubjectAccessReview 的内容。
如果请求变量中 subjectAccessReviewVersion 指定的版本是 v1beta1，
在计算 CEL 表达式之前，内容将被转换为 v1 版本。</p>
<ul>
<li>
<!--
'resourceAttributes' describes information for a resource access request and is unset for non-resource requests. e.g. has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'
-->
`resourceAttributes` 描述了资源访问请求的信息，并且在非资源请求中未设置。
例如：`has(request.resourceAttributes) && request.resourceAttributes.namespace == 'default'`
</li>
<li>
<!--
'nonResourceAttributes' describes information for a non-resource access request and is unset for resource requests. e.g. has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.
-->
`nonResourceAttributes` 描述了非资源访问请求的信息，并且在资源请求中未设置。
例如：`has(request.nonResourceAttributes) && request.nonResourceAttributes.path == '/healthz'`
</li>
<li>
<!--
'user' is the user to test for. e.g. request.user == 'alice'
-->
`user` 是要测试的用户。例如：`request.user == 'alice'`
</li>
<li>
<!--
'groups' is the groups to test for. e.g. ('group1' in request.groups)
-->
`groups` 是要测试的用户组。例如：`'group1' in request.groups`
</li>
<li>
<!--
'extra' corresponds to the user.Info.GetExtra() method from the authenticator.
-->
`extra` 对应于认证器中的 `user.Info.GetExtra()` 方法。
</li>
<li>
<!--
'uid' is the information about the requesting user. e.g. request.uid == '1'
-->
`uid` 是关于请求用户的标识信息。例如：`request.uid == '1'`
</li>
</ul>

<p>
<!--
Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
-->
关于 CEL 文档：https://kubernetes.io/zh-cn/docs/reference/using-api/cel/
</p>
</td>
</tr>
</tbody>
</table>
