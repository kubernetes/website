---
title: Kubelet CredentialProvider (v1beta1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1beta1
---
<!--
title: Kubelet CredentialProvider (v1beta1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1beta1
auto_generated: true
-->

<!--
## Resource Types
-->
## 资源类型   {#resource-types}

- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)

## `CredentialProviderRequest`     {#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderRequest}

<!--
CredentialProviderRequest includes the image that the kubelet requires authentication for.
Kubelet will pass this request object to the plugin via stdin. In general, plugins should
prefer responding with the same apiVersion they were sent.
-->
<p>
CredentialProviderRequest 包含 kubelet 需要进行身份验证的镜像。
Kubelet 会通过标准输入将此请求对象传递给插件。一般来说，插件倾向于用它们所收到的相同的 apiVersion 来响应。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderRequest</code></td></tr>
    
  
<tr><td><code>image</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
   image is the container image that is being pulled as part of the
credential provider plugin request. Plugins may optionally parse the image
to extract any information required to fetch credentials.
-->
   <p>
   <code>image</code> 是容器镜像，作为凭据提供程序插件请求的一部分。
   插件可以有选择地解析镜像以提取获取凭据所需的任何信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `CredentialProviderResponse`     {#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse}

<!--    
CredentialProviderResponse holds credentials that the kubelet should use for the specified
image provided in the original request. Kubelet will read the response from the plugin via stdout.
This response should be set to the same apiVersion as CredentialProviderRequest.
-->
<p>
CredentialProviderResponse 持有 kubelet 应用于原始请求中提供的指定镜像的凭据。
kubelet 将通过标准输出读取插件的响应。此响应的 apiVersion 值应设置为与 CredentialProviderRequest 中 apiVersion 值相同。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderResponse</code></td></tr>
    
  
<tr><td><code>cacheKeyType</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1beta1-PluginCacheKeyType"><code>PluginCacheKeyType</code></a>
</td>
<td>
<!--
cacheKeyType indiciates the type of caching key to use based on the image provided
in the request. There are three valid values for the cache key type: Image, Registry, and
Global. If an invalid value is specified, the response will NOT be used by the kubelet.
-->
   <p>
   <code>cacheKeyType</code> 表明基于请求中所给镜像而要使用的缓存键类型。缓存键类型有三个有效值：
   Image、Registry 和 Global。如果指定了无效值，则 kubelet 不会使用该响应。
   </p>
</td>
</tr>
<tr><td><code>cacheDuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<!--
cacheDuration indicates the duration the provided credentials should be cached for.
The kubelet will use this field to set the in-memory cache duration for credentials
in the AuthConfig. If null, the kubelet will use defaultCacheDuration provided in
CredentialProviderConfig. If set to 0, the kubelet will not cache the provided AuthConfig.
-->
   <p>
   <code>cacheDuration</code> 表示所提供的凭据应该被缓存的时间。kubelet 使用这个字段为
   <code>auth</code> 中的凭据设置内存中数据的缓存时间。如果为空，kubelet 将使用 CredentialProviderConfig
   中提供的 defaultCacheDuration。如果设置为 0，kubelet 将不会缓存所提供的 <code>auth</code> 数据。
   </p>
</td>
</tr>
<tr><td><code>auth</code><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1beta1-AuthConfig"><code>map[string]k8s.io/kubelet/pkg/apis/credentialprovider/v1beta1.AuthConfig</code></a>
</td>
<td>
<!--
   auth is a map containing authentication information passed into the kubelet.
Each key is a match image string (more on this below). The corresponding authConfig value
should be valid for all images that match against this key. A plugin should set
this field to null if no valid credentials can be returned for the requested image.
-->
   <p>
   <code>auth</code> 是一个映射，其中包含传递到 kubelet 的身份验证信息。
   每个键都是一个匹配镜像字符串（下面将对此进行详细介绍）。相应的 authConfig 值应该对所有与此键匹配的镜像有效。
   如果不能为请求的镜像返回有效的凭据，插件应将此字段设置为 null。
   </p>
<!--
Each key in the map is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&ast;.k8s.io' or 'k8s.&ast;.io', and top-level-domains such as 'k8s.&ast;'.
Matching partial subdomains like 'app&ast;.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &ast;.io does not match &ast;.k8s.io.</p>
-->
   <p>
   映射中每个键值都是一个正则表达式，可以选择包含端口和路径。
   域名部分可以包含通配符，但在端口或路径中不能使用通配符。
   支持通配符作为子域，如 '&ast;.k8s.io' 或 'k8s.&ast;.io'，以及顶级域，如 'k8s.&ast;'。
   还支持匹配部分子域，如 'app&ast;.k8s.io'。每个通配符只能匹配一个子域段，
   因此 &ast;.io 不匹配 &ast;.k8s.io。
   </p>
<!--
<p>The kubelet will match images against the key when all of the below are true:</p>
<ul>
<li>Both contain the same number of domain parts and each part matches.</li>
<li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
<li>If the imageMatch contains a port, then the port must match in the image as well.</li>
</ul>
-->
   <p>
   当满足以下所有条件时，kubelet 会将镜像与键值匹配：
   </p>
   <ul>
    <li>两者都包含相同数量的域部分，并且每个部分都匹配。</li>
    <li><code>imageMatch</code> 的 URL 路径必须是目标镜像的 URL 路径的前缀。</li>
    <li>如果 <code>imageMatch</code> 包含端口，则该端口也必须在镜像中匹配。</li>
   </ul>
<!--
<p>When multiple keys are returned, the kubelet will traverse all keys in reverse order so that:</p>
<ul>
<li>longer keys come before shorter keys with the same prefix</li>
<li>non-wildcard keys come before wildcard keys with the same prefix.</li>
</ul>
-->
   <p>
   当返回多个键（key）时，kubelet 会倒序遍历所有键，这样：
   </p>
   <ul>
    <li>具有相同前缀的较长键位于较短键之前</li>
    <li>具有相同前缀的非通配符键位于通配符键之前。</li>
   </ul>
<!--
<p>For any given match, the kubelet will attempt an image pull with the provided credentials,
stopping after the first successfully authenticated pull.</p>
<p>Example keys:</p>
-->
   <p>
   对于任何给定的匹配，kubelet 将尝试使用提供的凭据进行镜像拉取，并在第一次成功验证后停止拉取。
   </p>
   <p>键值示例：</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>&ast;.azurecr.io</li>
<li>gcr.io</li>
<li>&ast;.&ast;.registry.io</li>
<li>registry.io:8080/path</li>
</ul>
</td>
</tr>
</tbody>
</table>

## `AuthConfig`     {#credentialprovider-kubelet-k8s-io-v1beta1-AuthConfig}
    
<!--
**Appears in:**
-->
**出现在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)

<!--
<p>AuthConfig contains authentication information for a container registry.
Only username/password based authentication is supported today, but more authentication
mechanisms may be added in the future.</p>
-->
AuthConfig 包含容器仓库的身份验证信息。目前仅支持基于用户名/密码的身份验证，但未来可能会添加更多身份验证机制。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>username</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
   <p>username is the username used for authenticating to the container registry
An empty username is valid.</p>
-->
   <p>
   <code>username</code> 是用于向容器仓库进行身份验证的用户名。空的用户名是合法的。
   </p>
</td>
</tr>
<tr><td><code>password</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
   <p>password is the password used for authenticating to the container registry
An empty password is valid.</p>
-->
   <p>
   <code>password</code> 是用于向容器仓库进行身份验证的密码。空密码是合法的。
   </p>
</td>
</tr>
</tbody>
</table>

## `PluginCacheKeyType`     {#credentialprovider-kubelet-k8s-io-v1beta1-PluginCacheKeyType}

<!--    
(Alias of `string`)

**Appears in:**
-->
（<code>string</code> 数据类型的别名）

**出现在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)