---
title: Kubelet CredentialProvider (v1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1
---
<!--
title: Kubelet CredentialProvider (v1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types
-->
## 资源类型  {#resource-types}

- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

## `CredentialProviderRequest`     {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest}

<!--
CredentialProviderRequest includes the image that the kubelet requires authentication for.
Kubelet will pass this request object to the plugin via stdin. In general, plugins should
prefer responding with the same apiVersion they were sent.
-->
<p>
CredentialProviderRequest 包含 kubelet 需要通过身份验证才能访问的镜像。
kubelet 将此请求对象通过 stdin 传递到插件。
通常，插件应优先使用所收到的 apiVersion 作出响应。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1</code></td></tr>
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
image 是作为凭据提供程序插件请求的一部分所拉取的容器镜像。
这些插件可以选择解析镜像以提取获取凭据所需的任何信息。
</p>

</td>
</tr>
</tbody>
</table>

## `CredentialProviderResponse`     {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse}

<!--
CredentialProviderResponse holds credentials that the kubelet should use for the specified
image provided in the original request. Kubelet will read the response from the plugin via stdout.
This response should be set to the same apiVersion as CredentialProviderRequest.
-->
<p>
CredentialProviderResponse 中包含 kubelet 应针对原始请求中所给镜像来使用的凭据。
kubelet 将通过 stdout 读取来自插件的响应。
此响应应被设置为与 CredentialProviderRequest 相同的 apiVersion。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderResponse</code></td></tr>
    
  
<tr><td><code>cacheKeyType</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1-PluginCacheKeyType"><code>PluginCacheKeyType</code></a>
</td>
<td>
<!--
cacheKeyType indiciates the type of caching key to use based on the image provided
in the request. There are three valid values for the cache key type: Image, Registry, and
Global. If an invalid value is specified, the response will NOT be used by the kubelet.
-->
<p>
cacheKeyType 标示了基于请求中提供的镜像要使用的缓存键的类型。
缓存键类型有三个有效值：Image、Registry 和 Global。
如果所指定的值无效，则此响应不会被 kubelet 使用。
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
cacheDuration 标示所提供的凭据可被缓存的持续期。
kubelet 将使用此字段为 AuthConfig 中的凭据设置内存中缓存持续期。
如果为空，kubelet 将使用 CredentialProviderConfig 中提供的 defaultCacheDuration。
如果设置为 0，kubelet 将不再缓存提供的 AuthConfig。
</p>
</td>
</tr>
<tr><td><code>auth</code><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1-AuthConfig"><code>map[string]AuthConfig</code></a>
</td>
<td>
<!--
auth is a map containing authentication information passed into the kubelet.
Each key is a match image string (more on this below). The corresponding authConfig value
should be valid for all images that match against this key. A plugin should set
this field to null if no valid credentials can be returned for the requested image.
-->
<p>
auth 是一个映射，包含传递给 kubelet 的身份验证信息。
映射中每个键都是一个匹配镜像字符串（更多内容见下文）。
相应的 authConfig 值应该对匹配此键的所有镜像有效。
如果无法为请求的镜像返回有效凭据，则插件应将此字段设置为空。
</p>
<!--
Each key in the map is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&ast;.k8s.io' or 'k8s.&ast;.io', and top-level-domains such as 'k8s.&ast;'.
Matching partial subdomains like 'app&ast;.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &ast;.io does not match &ast;.k8s.io.</p>
-->
<p>
映射中的每个主键都可以包含端口和路径。
域名中可以使用 Glob 通配，但不能在端口或路径中使用 Glob。
Glob 支持类似 <code>&ast;.k8s.io</code> 或 <code>k8s.&ast;.io</code> 这类子域以及 <code>k8s.&ast;</code> 这类顶级域。
也支持匹配的部分子域，例如 <code>app&ast;.k8s.io</code>。
每个 Glob 只能匹配一个子域段，因此 <code>&ast;.io</code> 与 <code>&ast;.k8s.io</code> 不匹配。
</p>
<!--
The kubelet will match images against the key when all of the below are true:
-->
<p>
当满足以下所有条件时，kubelet 将根据主键来匹配镜像：
</p>
<ul>
<!--
Both contain the same number of domain parts and each part matches.
-->
<li>两者都包含相同数量的域名部分，并且每个部分都匹配。</li>
<!--
The URL path of an imageMatch must be a prefix of the target image URL path.
-->
<li>imageMatch 的 URL 路径必须是目标镜像 URL 路径的前缀。</li>
<!--
If the imageMatch contains a port, then the port must match in the image as well.
-->
<li>如果 imageMatch 包含端口，则此端口也必须在镜像中匹配。</li>
</ul>
<!--
When multiple keys are returned, the kubelet will traverse all keys in reverse order so that:
-->
<p>
当返回多个主键时，kubelet 将以相反的顺序遍历所有主键，以便：
</p>
  <ul>
  <!--
  longer keys come before shorter keys with the same prefix
  -->
  <li>较长键出现在具有相同前缀的较短键前面。</li>
  <!--
  non-wildcard keys come before wildcard keys with the same prefix.
  -->
  <li>非通配符键出现在具有相同前缀的通配符键之前。</li>
  </ul>
<!--
For any given match, the kubelet will attempt an image pull with the provided credentials,
stopping after the first successfully authenticated pull.
-->
<p>对于任一给定的匹配项，kubelet 将尝试用提供的凭据拉取镜像，并在第一次成功通过身份验证的拉取之后停止。</p>
<!--
Example keys:
-->
<p>示例键：</p>
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

## `AuthConfig`     {#credentialprovider-kubelet-k8s-io-v1-AuthConfig}

<!--
**Appears in:**
-->
**出现在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

<!--
AuthConfig contains authentication information for a container registry.
Only username/password based authentication is supported today, but more authentication
mechanisms may be added in the future.
-->
<p>
AuthConfig 包含针对容器镜像仓库的身份验证信息。
目前仅支持基于用户名/密码的身份验证，但未来可能添加更多的身份验证机制。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>username</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
username is the username used for authenticating to the container registry
An empty username is valid.
-->
<p>
username 是对容器镜像仓库身份验证所用的用户名。
空白用户名是有效的。
</p>
</td>
</tr>
<tr><td><code>password</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<!--
password is the password used for authenticating to the container registry
An empty password is valid.
-->
<p>
password 是对容器镜像仓库身份验证所用的密码。
空白密码是有效的。
</p>
</td>
</tr>
</tbody>
</table>

## `PluginCacheKeyType`     {#credentialprovider-kubelet-k8s-io-v1-PluginCacheKeyType}

<!--
(Alias of `string`)
-->
（`string` 的别名）

<!--
**Appears in:**
-->
**出现在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)
  