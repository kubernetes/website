---
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---
<p>Package v1 is the v1 version of the API.</p>


## Resource Types 


- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)
- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)
- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)
- [TracingConfiguration](#apiserver-config-k8s-io-v1-TracingConfiguration)
  
    
    

## `TracingConfiguration`     {#TracingConfiguration}
    

**Appears in:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-config-k8s-io-v1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)


<p>TracingConfiguration provides versioned configuration for OpenTelemetry tracing clients.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>Endpoint of the collector this component will report traces to.
The connection is insecure, and does not currently support TLS.
Recommended is unset, and endpoint is the otlp grpc default, localhost:4317.</p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p>SamplingRatePerMillion is the number of samples to collect per million spans.
Recommended is unset. If unset, sampler respects its parent span's sampling
rate, but otherwise never samples.</p>
</td>
</tr>
</tbody>
</table>
  

## `AdmissionConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionConfiguration}
    


<p>AdmissionConfiguration provides versioned configuration for admission controllers.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>
    
  
<tr><td><code>plugins</code><br/>
<a href="#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p>Plugins allows specifying a configuration per admission control plugin.</p>
</td>
</tr>
</tbody>
</table>

## `AuthenticationConfiguration`     {#apiserver-config-k8s-io-v1-AuthenticationConfiguration}
    


<p>AuthenticationConfiguration provides versioned configuration for authentication.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthenticationConfiguration</code></td></tr>
    
  
<tr><td><code>jwt</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-JWTAuthenticator"><code>[]JWTAuthenticator</code></a>
</td>
<td>
   <p>jwt is a list of authenticator to authenticate Kubernetes users using
JWT compliant tokens. The authenticator will attempt to parse a raw ID token,
verify it's been signed by the configured issuer. The public key to verify the
signature is discovered from the issuer's public endpoint using OIDC discovery.
For an incoming token, each JWT authenticator will be attempted in
the order in which it is specified in this list.  Note however that
other authenticators may run before or after the JWT authenticators.
The specific position of JWT authenticators in relation to other
authenticators is neither defined nor stable across releases.  Since
each JWT authenticator must have a unique issuer URL, at most one
JWT authenticator will attempt to cryptographically validate the token.</p>
<p>The minimum valid JWT payload must contain the following claims:
{
&quot;iss&quot;: &quot;https://issuer.example.com&quot;,
&quot;aud&quot;: [&quot;audience&quot;],
&quot;exp&quot;: 1234567890,
&quot;<!-- raw HTML omitted -->&quot;: &quot;username&quot;
}</p>
</td>
</tr>
<tr><td><code>anonymous</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AnonymousAuthConfig"><code>AnonymousAuthConfig</code></a>
</td>
<td>
   <p>If present --anonymous-auth must not be set</p>
</td>
</tr>
</tbody>
</table>

## `AuthorizationConfiguration`     {#apiserver-config-k8s-io-v1-AuthorizationConfiguration}
    



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthorizationConfiguration</code></td></tr>
    
  
<tr><td><code>authorizers</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
</td>
<td>
   <p>Authorizers is an ordered list of authorizers to
authorize requests against.
This is similar to the --authorization-modes kube-apiserver flag
Must be at least one.</p>
</td>
</tr>
</tbody>
</table>

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}
    


<p>EncryptionConfiguration stores the complete configuration for encryption providers.
It also allows the use of wildcards to specify the resources that should be encrypted.
Use '<em>.<!-- raw HTML omitted -->' to encrypt all resources within a group or '</em>.<em>' to encrypt all resources.
'</em>.' can be used to encrypt all resource in the core group.  '<em>.</em>' will encrypt all
resources, even custom resources that are added after API server start.
Use of wildcards that overlap within the same resource list or across multiple
entries are not allowed since part of the configuration would be ineffective.
Resource lists are processed in order, with earlier lists taking precedence.</p>
<p>Example:</p>
<pre><code>kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
resources:
- resources:
  - events
  providers:
  - identity: {}  # do not encrypt events even though *.* is specified below
- resources:
  - secrets
  - configmaps
  - pandas.awesome.bears.example
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: c2VjcmV0IGlzIHNlY3VyZQ==
- resources:
  - '*.apps'
  providers:
  - aescbc:
      keys:
      - name: key2
        secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
- resources:
  - '*.*'
  providers:
  - aescbc:
      keys:
      - name: key3
        secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
</code></pre>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EncryptionConfiguration</code></td></tr>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
</td>
<td>
   <p>resources is a list containing resources, and their corresponding encryption providers.</p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-config-k8s-io-v1-TracingConfiguration}
    


<p>TracingConfiguration provides versioned configuration for tracing clients.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>
    
  
<tr><td><code>TracingConfiguration</code> <B>[Required]</B><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>(Members of <code>TracingConfiguration</code> are embedded into this type.)
   <p>Embed the component config tracing configuration struct</p>
</td>
</tr>
</tbody>
</table>

## `AESConfiguration`     {#apiserver-config-k8s-io-v1-AESConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>AESConfiguration contains the API configuration for an AES transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>keys</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>keys is a list of keys to be used for creating the AES transformer.
Each key has to be 32 bytes long for AES-CBC and 16, 24 or 32 bytes for AES-GCM.</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration}
    

**Appears in:**

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)


<p>AdmissionPluginConfiguration provides the configuration for a single plug-in.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the name of the admission controller.
It must match the registered admission plugin name.</p>
</td>
</tr>
<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
   <p>Path is the path to a configuration file that contains the plugin's
configuration</p>
</td>
</tr>
<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.</p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthCondition`     {#apiserver-config-k8s-io-v1-AnonymousAuthCondition}
    

**Appears in:**

- [AnonymousAuthConfig](#apiserver-config-k8s-io-v1-AnonymousAuthConfig)


<p>AnonymousAuthCondition describes the condition under which anonymous auth
should be enabled.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>path</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Path for which anonymous auth is enabled.</p>
</td>
</tr>
</tbody>
</table>

## `AnonymousAuthConfig`     {#apiserver-config-k8s-io-v1-AnonymousAuthConfig}
    

**Appears in:**

- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)


<p>AnonymousAuthConfig provides the configuration for the anonymous authenticator.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>enabled</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>conditions</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AnonymousAuthCondition"><code>[]AnonymousAuthCondition</code></a>
</td>
<td>
   <p>If set, anonymous auth is only allowed if the request meets one of the
conditions.</p>
</td>
</tr>
</tbody>
</table>

## `AudienceMatchPolicyType`     {#apiserver-config-k8s-io-v1-AudienceMatchPolicyType}
    
(Alias of `string`)

**Appears in:**

- [Issuer](#apiserver-config-k8s-io-v1-Issuer)


<p>AudienceMatchPolicyType is a set of valid values for issuer.audienceMatchPolicy</p>




## `AuthorizerConfiguration`     {#apiserver-config-k8s-io-v1-AuthorizerConfiguration}
    

**Appears in:**

- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Type refers to the type of the authorizer
&quot;Webhook&quot; is supported in the generic API server
Other API servers may support additional authorizer
types like Node, RBAC, ABAC, etc.</p>
</td>
</tr>
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name used to describe the webhook
This is explicitly used in monitoring machinery for metrics
Note: Names must be DNS1123 labels like <code>myauthorizername</code> or
subdomains like <code>myauthorizer.example.domain</code>
Required, with no default</p>
</td>
</tr>
<tr><td><code>webhook</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>Webhook defines the configuration for a Webhook authorizer
Must be defined when Type=Webhook
Must not be defined when Type!=Webhook</p>
</td>
</tr>
</tbody>
</table>

## `ClaimMappings`     {#apiserver-config-k8s-io-v1-ClaimMappings}
    

**Appears in:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)


<p>ClaimMappings provides the configuration for claim mapping</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>username</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
</td>
<td>
   <p>username represents an option for the username attribute.
The claim's value must be a singular string.
Same as the --oidc-username-claim and --oidc-username-prefix flags.
If username.expression is set, the expression must produce a string value.
If username.expression uses 'claims.email', then 'claims.email_verified' must be used in
username.expression or extra[<em>].valueExpression or claimValidationRules[</em>].expression.
An example claim validation rule expression that matches the validation automatically
applied when username.claim is set to 'email' is 'claims.?email_verified.orValue(true) == true'. By explicitly comparing
the value to true, we let type-checking see the result will be a boolean, and to make sure a non-boolean email_verified
claim will be caught at runtime.</p>
<p>In the flag based approach, the --oidc-username-claim and --oidc-username-prefix are optional. If --oidc-username-claim is not set,
the default value is &quot;sub&quot;. For the authentication config, there is no defaulting for claim or prefix. The claim and prefix must be set explicitly.
For claim, if --oidc-username-claim was not set with legacy flag approach, configure username.claim=&quot;sub&quot; in the authentication config.
For prefix:
(1) --oidc-username-prefix=&quot;-&quot;, no prefix was added to the username. For the same behavior using authentication config,
set username.prefix=&quot;&quot;
(2) --oidc-username-prefix=&quot;&quot; and  --oidc-username-claim != &quot;email&quot;, prefix was &quot;&lt;value of --oidc-issuer-url&gt;#&quot;. For the same
behavior using authentication config, set username.prefix=&quot;<!-- raw HTML omitted -->#&quot;
(3) --oidc-username-prefix=&quot;<!-- raw HTML omitted -->&quot;. For the same behavior using authentication config, set username.prefix=&quot;<!-- raw HTML omitted -->&quot;</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<a href="#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression"><code>PrefixedClaimOrExpression</code></a>
</td>
<td>
   <p>groups represents an option for the groups attribute.
The claim's value must be a string or string array claim.
If groups.claim is set, the prefix must be specified (and can be the empty string).
If groups.expression is set, the expression must produce a string or string array value.
&quot;&quot;, [], and null values are treated as the group mapping not being present.</p>
</td>
</tr>
<tr><td><code>uid</code><br/>
<a href="#apiserver-config-k8s-io-v1-ClaimOrExpression"><code>ClaimOrExpression</code></a>
</td>
<td>
   <p>uid represents an option for the uid attribute.
Claim must be a singular string claim.
If uid.expression is set, the expression must produce a string value.</p>
</td>
</tr>
<tr><td><code>extra</code><br/>
<a href="#apiserver-config-k8s-io-v1-ExtraMapping"><code>[]ExtraMapping</code></a>
</td>
<td>
   <p>extra represents an option for the extra attribute.
expression must produce a string or string array value.
If the value is empty, the extra mapping will not be present.</p>
<p>hard-coded extra key/value</p>
<ul>
<li>key: &quot;foo&quot;
valueExpression: &quot;'bar'&quot;
This will result in an extra attribute - foo: [&quot;bar&quot;]</li>
</ul>
<p>hard-coded key, value copying claim value</p>
<ul>
<li>key: &quot;foo&quot;
valueExpression: &quot;claims.some_claim&quot;
This will result in an extra attribute - foo: [value of some_claim]</li>
</ul>
<p>hard-coded key, value derived from claim value</p>
<ul>
<li>key: &quot;admin&quot;
valueExpression: '(has(claims.is_admin) &amp;&amp; claims.is_admin) ? &quot;true&quot;:&quot;&quot;'
This will result in:</li>
<li>if is_admin claim is present and true, extra attribute - admin: [&quot;true&quot;]</li>
<li>if is_admin claim is present and false or is_admin claim is not present, no extra attribute will be added</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `ClaimOrExpression`     {#apiserver-config-k8s-io-v1-ClaimOrExpression}
    

**Appears in:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)


<p>ClaimOrExpression provides the configuration for a single claim or expression.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>claim is the JWT claim to use.
Either claim or expression must be set.
Mutually exclusive with expression.</p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
   <p>expression represents the expression which will be evaluated by CEL.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
<ul>
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim.</p>
</td>
</tr>
</tbody>
</table>

## `ClaimValidationRule`     {#apiserver-config-k8s-io-v1-ClaimValidationRule}
    

**Appears in:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)


<p>ClaimValidationRule provides the configuration for a single claim validation rule.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>claim is the name of a required claim.
Same as --oidc-required-claim flag.
Only string claim keys are supported.
Mutually exclusive with expression and message.</p>
</td>
</tr>
<tr><td><code>requiredValue</code><br/>
<code>string</code>
</td>
<td>
   <p>requiredValue is the value of a required claim.
Same as --oidc-required-claim flag.
Only string claim values are supported.
If claim is set and requiredValue is not set, the claim must be present with a value set to the empty string.
Mutually exclusive with expression and message.</p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
   <p>expression represents the expression which will be evaluated by CEL.
Must produce a boolean.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
<ul>
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.
Must return true for the validation to pass.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim and requiredValue.</p>
</td>
</tr>
<tr><td><code>message</code><br/>
<code>string</code>
</td>
<td>
   <p>message customizes the returned error message when expression returns false.
message is a literal string.
Mutually exclusive with claim and requiredValue.</p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorType`     {#apiserver-config-k8s-io-v1-EgressSelectorType}
    
(Alias of `string`)

**Appears in:**

- [Issuer](#apiserver-config-k8s-io-v1-Issuer)


<p>EgressSelectorType is an indicator of which egress selection should be used for sending traffic.</p>




## `ExtraMapping`     {#apiserver-config-k8s-io-v1-ExtraMapping}
    

**Appears in:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)


<p>ExtraMapping provides the configuration for a single extra mapping.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>key</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>key is a string to use as the extra attribute key.
key must be a domain-prefix path (e.g. example.org/foo). All characters before the first &quot;/&quot; must be a valid
subdomain as defined by RFC 1123. All characters trailing the first &quot;/&quot; must
be valid HTTP Path characters as defined by RFC 3986.
key must be lowercase.
Required to be unique.</p>
</td>
</tr>
<tr><td><code>valueExpression</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
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
</td>
</tr>
</tbody>
</table>

## `IdentityConfiguration`     {#apiserver-config-k8s-io-v1-IdentityConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>IdentityConfiguration is an empty struct to allow identity transformer in provider configuration.</p>




## `Issuer`     {#apiserver-config-k8s-io-v1-Issuer}
    

**Appears in:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)


<p>Issuer provides the configuration for an external provider's specific settings.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>url</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>url points to the issuer URL in a format https://url or https://url/path.
This must match the &quot;iss&quot; claim in the presented JWT, and the issuer returned from discovery.
Same value as the --oidc-issuer-url flag.
Discovery information is fetched from &quot;{url}/.well-known/openid-configuration&quot; unless overridden by discoveryURL.
Required to be unique across all JWT authenticators.
Note that egress selection configuration is not used for this network connection.</p>
</td>
</tr>
<tr><td><code>discoveryURL</code><br/>
<code>string</code>
</td>
<td>
   <p>discoveryURL, if specified, overrides the URL used to fetch discovery
information instead of using &quot;{url}/.well-known/openid-configuration&quot;.
The exact value specified is used, so &quot;/.well-known/openid-configuration&quot;
must be included in discoveryURL if needed.</p>
<p>The &quot;issuer&quot; field in the fetched discovery information must match the &quot;issuer.url&quot; field
in the AuthenticationConfiguration and will be used to validate the &quot;iss&quot; claim in the presented JWT.
This is for scenarios where the well-known and jwks endpoints are hosted at a different
location than the issuer (such as locally in the cluster).</p>
<p>Example:
A discovery url that is exposed using kubernetes service 'oidc' in namespace 'oidc-namespace'
and discovery information is available at '/.well-known/openid-configuration'.
discoveryURL: &quot;https://oidc.oidc-namespace/.well-known/openid-configuration&quot;
certificateAuthority is used to verify the TLS connection and the hostname on the leaf certificate
must be set to 'oidc.oidc-namespace'.</p>
<p>curl https://oidc.oidc-namespace/.well-known/openid-configuration (.discoveryURL field)
{
issuer: &quot;https://oidc.example.com&quot; (.url field)
}</p>
<p>discoveryURL must be different from url.
Required to be unique across all JWT authenticators.
Note that egress selection configuration is not used for this network connection.</p>
</td>
</tr>
<tr><td><code>certificateAuthority</code><br/>
<code>string</code>
</td>
<td>
   <p>certificateAuthority contains PEM-encoded certificate authority certificates
used to validate the connection when fetching discovery information.
If unset, the system verifier is used.
Same value as the content of the file referenced by the --oidc-ca-file flag.</p>
</td>
</tr>
<tr><td><code>audiences</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>audiences is the set of acceptable audiences the JWT must be issued to.
At least one of the entries must match the &quot;aud&quot; claim in presented JWTs.
Same value as the --oidc-client-id flag (though this field supports an array).
Required to be non-empty.</p>
</td>
</tr>
<tr><td><code>audienceMatchPolicy</code><br/>
<a href="#apiserver-config-k8s-io-v1-AudienceMatchPolicyType"><code>AudienceMatchPolicyType</code></a>
</td>
<td>
   <p>audienceMatchPolicy defines how the &quot;audiences&quot; field is used to match the &quot;aud&quot; claim in the presented JWT.
Allowed values are:</p>
<ol>
<li>&quot;MatchAny&quot; when multiple audiences are specified and</li>
<li>empty (or unset) or &quot;MatchAny&quot; when a single audience is specified.</li>
</ol>
<ul>
<li>
<p>MatchAny: the &quot;aud&quot; claim in the presented JWT must match at least one of the entries in the &quot;audiences&quot; field.
For example, if &quot;audiences&quot; is [&quot;foo&quot;, &quot;bar&quot;], the &quot;aud&quot; claim in the presented JWT must contain either &quot;foo&quot; or &quot;bar&quot; (and may contain both).</p>
</li>
<li>
<p>&quot;&quot;: The match policy can be empty (or unset) when a single audience is specified in the &quot;audiences&quot; field. The &quot;aud&quot; claim in the presented JWT must contain the single audience (and may contain others).</p>
</li>
</ul>
<p>For more nuanced audience validation, use claimValidationRules.
example: claimValidationRule[].expression: 'sets.equivalent(claims.aud, [&quot;bar&quot;, &quot;foo&quot;, &quot;baz&quot;])' to require an exact match.</p>
</td>
</tr>
<tr><td><code>egressSelectorType</code><br/>
<a href="#apiserver-config-k8s-io-v1-EgressSelectorType"><code>EgressSelectorType</code></a>
</td>
<td>
   <p>egressSelectorType is an indicator of which egress selection should be used for sending all traffic related
to this issuer (discovery, JWKS, distributed claims, etc).  If unspecified, no custom dialer is used.
When specified, the valid choices are &quot;controlplane&quot; and &quot;cluster&quot;.  These correspond to the associated
values in the --egress-selector-config-file.</p>
<ul>
<li>
<p>controlplane: for traffic intended to go to the control plane.</p>
</li>
<li>
<p>cluster: for traffic intended to go to the system being managed by Kubernetes.</p>
</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `JWTAuthenticator`     {#apiserver-config-k8s-io-v1-JWTAuthenticator}
    

**Appears in:**

- [AuthenticationConfiguration](#apiserver-config-k8s-io-v1-AuthenticationConfiguration)


<p>JWTAuthenticator provides the configuration for a single JWT authenticator.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>issuer</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Issuer"><code>Issuer</code></a>
</td>
<td>
   <p>issuer contains the basic OIDC provider connection options.</p>
</td>
</tr>
<tr><td><code>claimValidationRules</code><br/>
<a href="#apiserver-config-k8s-io-v1-ClaimValidationRule"><code>[]ClaimValidationRule</code></a>
</td>
<td>
   <p>claimValidationRules are rules that are applied to validate token claims to authenticate users.</p>
</td>
</tr>
<tr><td><code>claimMappings</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ClaimMappings"><code>ClaimMappings</code></a>
</td>
<td>
   <p>claimMappings points claims of a token to be treated as user attributes.</p>
</td>
</tr>
<tr><td><code>userValidationRules</code><br/>
<a href="#apiserver-config-k8s-io-v1-UserValidationRule"><code>[]UserValidationRule</code></a>
</td>
<td>
   <p>userValidationRules are rules that are applied to final user before completing authentication.
These allow invariants to be applied to incoming identities such as preventing the
use of the system: prefix that is commonly used by Kubernetes components.
The validation rules are logically ANDed together and must all return true for the validation to pass.</p>
</td>
</tr>
</tbody>
</table>

## `KMSConfiguration`     {#apiserver-config-k8s-io-v1-KMSConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>KMSConfiguration contains the name, cache size and path to configuration file for a KMS based envelope transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>apiVersion of KeyManagementService</p>
</td>
</tr>
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the KMS plugin to be used.</p>
</td>
</tr>
<tr><td><code>cachesize</code><br/>
<code>int32</code>
</td>
<td>
   <p>cachesize is the maximum number of secrets which are cached in memory. The default value is 1000.
Set to a negative value to disable caching. This field is only allowed for KMS v1 providers.</p>
</td>
</tr>
<tr><td><code>endpoint</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>endpoint is the gRPC server listening address, for example &quot;unix:///var/run/kms-provider.sock&quot;.</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>timeout for gRPC calls to kms-plugin (ex. 5s). The default is 3 seconds.</p>
</td>
</tr>
</tbody>
</table>

## `Key`     {#apiserver-config-k8s-io-v1-Key}
    

**Appears in:**

- [AESConfiguration](#apiserver-config-k8s-io-v1-AESConfiguration)

- [SecretboxConfiguration](#apiserver-config-k8s-io-v1-SecretboxConfiguration)


<p>Key contains name and secret of the provided key for a transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the key to be used while storing data to disk.</p>
</td>
</tr>
<tr><td><code>secret</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>secret is the actual key, encoded in base64.</p>
</td>
</tr>
</tbody>
</table>

## `PrefixedClaimOrExpression`     {#apiserver-config-k8s-io-v1-PrefixedClaimOrExpression}
    

**Appears in:**

- [ClaimMappings](#apiserver-config-k8s-io-v1-ClaimMappings)


<p>PrefixedClaimOrExpression provides the configuration for a single prefixed claim or expression.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>claim</code><br/>
<code>string</code>
</td>
<td>
   <p>claim is the JWT claim to use.
Mutually exclusive with expression.</p>
</td>
</tr>
<tr><td><code>prefix</code><br/>
<code>string</code>
</td>
<td>
   <p>prefix is prepended to claim's value to prevent clashes with existing names.
prefix needs to be set if claim is set and can be the empty string.
Mutually exclusive with expression.</p>
</td>
</tr>
<tr><td><code>expression</code><br/>
<code>string</code>
</td>
<td>
   <p>expression represents the expression which will be evaluated by CEL.</p>
<p>CEL expressions have access to the contents of the token claims, organized into CEL variable:</p>
<ul>
<li>'claims' is a map of claim names to claim values.
For example, a variable named 'sub' can be accessed as 'claims.sub'.
Nested claims can be accessed using dot notation, e.g. 'claims.foo.bar'.</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
<p>Mutually exclusive with claim and prefix.</p>
</td>
</tr>
</tbody>
</table>

## `ProviderConfiguration`     {#apiserver-config-k8s-io-v1-ProviderConfiguration}
    

**Appears in:**

- [ResourceConfiguration](#apiserver-config-k8s-io-v1-ResourceConfiguration)


<p>ProviderConfiguration stores the provided configuration for an encryption provider.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>aesgcm</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>aesgcm is the configuration for the AES-GCM transformer.</p>
</td>
</tr>
<tr><td><code>aescbc</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>aescbc is the configuration for the AES-CBC transformer.</p>
</td>
</tr>
<tr><td><code>secretbox</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
</td>
<td>
   <p>secretbox is the configuration for the Secretbox based transformer.</p>
</td>
</tr>
<tr><td><code>identity</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
</td>
<td>
   <p>identity is the (empty) configuration for the identity transformer.</p>
</td>
</tr>
<tr><td><code>kms</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
</td>
<td>
   <p>kms contains the name, cache size and path to configuration file for a KMS based envelope transformer.</p>
</td>
</tr>
</tbody>
</table>

## `ResourceConfiguration`     {#apiserver-config-k8s-io-v1-ResourceConfiguration}
    

**Appears in:**

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)


<p>ResourceConfiguration stores per resource configuration.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>resources is a list of kubernetes resources which have to be encrypted. The resource names are derived from <code>resource</code> or <code>resource.group</code> of the group/version/resource.
eg: pandas.awesome.bears.example is a custom resource with 'group': awesome.bears.example, 'resource': pandas.
Use '<em>.</em>' to encrypt all resources and '<em>.<!-- raw HTML omitted -->' to encrypt all resources in a specific group.
eg: '</em>.awesome.bears.example' will encrypt all resources in the group 'awesome.bears.example'.
eg: '*.' will encrypt all resources in the core group (such as pods, configmaps, etc).</p>
</td>
</tr>
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p>providers is a list of transformers to be used for reading and writing the resources to disk.
eg: aesgcm, aescbc, secretbox, identity, kms.</p>
</td>
</tr>
</tbody>
</table>

## `SecretboxConfiguration`     {#apiserver-config-k8s-io-v1-SecretboxConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>SecretboxConfiguration contains the API configuration for an Secretbox transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>keys</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>keys is a list of keys to be used for creating the Secretbox transformer.
Each key has to be 32 bytes long.</p>
</td>
</tr>
</tbody>
</table>

## `UserValidationRule`     {#apiserver-config-k8s-io-v1-UserValidationRule}
    

**Appears in:**

- [JWTAuthenticator](#apiserver-config-k8s-io-v1-JWTAuthenticator)


<p>UserValidationRule provides the configuration for a single user info validation rule.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>expression</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>expression represents the expression which will be evaluated by CEL.
Must return true for the validation to pass.</p>
<p>CEL expressions have access to the contents of UserInfo, organized into CEL variable:</p>
<ul>
<li>'user' - authentication.k8s.io/v1, Kind=UserInfo object
Refer to https://github.com/kubernetes/api/blob/release-1.28/authentication/v1/types.go#L105-L122 for the definition.
API documentation: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#userinfo-v1-authentication-k8s-io</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
</td>
</tr>
<tr><td><code>message</code><br/>
<code>string</code>
</td>
<td>
   <p>message customizes the returned error message when rule returns false.
message is a literal string.</p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#apiserver-config-k8s-io-v1-WebhookConfiguration}
    

**Appears in:**

- [AuthorizerConfiguration](#apiserver-config-k8s-io-v1-AuthorizerConfiguration)



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>authorizedTTL</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>The duration to cache 'authorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-authorized-ttl</code> flag
Default: 5m0s</p>
</td>
</tr>
<tr><td><code>cacheAuthorizedRequests</code><br/>
<code>bool</code>
</td>
<td>
   <p>CacheAuthorizedRequests specifies whether authorized requests should be cached.
If set to true, the TTL for cached decisions can be configured via the
AuthorizedTTL field.
Default: true</p>
</td>
</tr>
<tr><td><code>unauthorizedTTL</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>The duration to cache 'unauthorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-unauthorized-ttl</code> flag
Default: 30s</p>
</td>
</tr>
<tr><td><code>cacheUnauthorizedRequests</code><br/>
<code>bool</code>
</td>
<td>
   <p>CacheUnauthorizedRequests specifies whether unauthorized requests should be cached.
If set to true, the TTL for cached decisions can be configured via the
UnauthorizedTTL field.
Default: true</p>
</td>
</tr>
<tr><td><code>timeout</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>Timeout for the webhook request
Maximum allowed value is 30s.
Required, no default value.</p>
</td>
</tr>
<tr><td><code>subjectAccessReviewVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>The API version of the authorization.k8s.io SubjectAccessReview to
send to and expect from the webhook.
Same as setting <code>--authorization-webhook-version</code> flag
Valid values: v1beta1, v1
Required, no default value</p>
</td>
</tr>
<tr><td><code>matchConditionSubjectAccessReviewVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
version the CEL expressions are evaluated against
Valid values: v1
Required, no default value</p>
</td>
</tr>
<tr><td><code>failurePolicy</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Controls the authorization decision when a webhook request fails to
complete or returns a malformed response or errors evaluating
matchConditions.
Valid values:</p>
<ul>
<li>NoOpinion: continue to subsequent authorizers to see if one of
them allows the request</li>
<li>Deny: reject the request without consulting subsequent authorizers
Required, with no default.</li>
</ul>
</td>
</tr>
<tr><td><code>connectionInfo</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
</td>
<td>
   <p>ConnectionInfo defines how we talk to the webhook</p>
</td>
</tr>
<tr><td><code>matchConditions</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
</td>
<td>
   <p>matchConditions is a list of conditions that must be met for a request to be sent to this
webhook. An empty list of matchConditions matches all requests.
There are a maximum of 64 match conditions allowed.</p>
<p>The exact matching logic is (in order):</p>
<ol>
<li>If at least one matchCondition evaluates to FALSE, then the webhook is skipped.</li>
<li>If ALL matchConditions evaluate to TRUE, then the webhook is called.</li>
<li>If at least one matchCondition evaluates to an error (but none are FALSE):
<ul>
<li>If failurePolicy=Deny, then the webhook rejects the request</li>
<li>If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped</li>
</ul>
</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `WebhookConnectionInfo`     {#apiserver-config-k8s-io-v1-WebhookConnectionInfo}
    

**Appears in:**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Controls how the webhook should communicate with the server.
Valid values:</p>
<ul>
<li>KubeConfigFile: use the file specified in kubeConfigFile to locate the
server.</li>
<li>InClusterConfig: use the in-cluster configuration to call the
SubjectAccessReview API hosted by kube-apiserver. This mode is not
allowed for kube-apiserver.</li>
</ul>
</td>
</tr>
<tr><td><code>kubeConfigFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Path to KubeConfigFile for connection info
Required, if connectionInfo.Type is KubeConfig</p>
</td>
</tr>
</tbody>
</table>

## `WebhookMatchCondition`     {#apiserver-config-k8s-io-v1-WebhookMatchCondition}
    

**Appears in:**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>expression</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
the contents would be converted to the v1 version before evaluating the CEL expression.</p>
<ul>
<li>'resourceAttributes' describes information for a resource access request and is unset for non-resource requests. e.g. has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</li>
<li>'nonResourceAttributes' describes information for a non-resource access request and is unset for resource requests. e.g. has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.</li>
<li>'user' is the user to test for. e.g. request.user == 'alice'</li>
<li>'groups' is the groups to test for. e.g. ('group1' in request.groups)</li>
<li>'extra' corresponds to the user.Info.GetExtra() method from the authenticator.</li>
<li>'uid' is the information about the requesting user. e.g. request.uid == '1'</li>
</ul>
<p>Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/</p>
</td>
</tr>
</tbody>
</table>
  