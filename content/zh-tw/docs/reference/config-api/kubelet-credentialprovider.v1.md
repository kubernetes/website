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
## 資源類型  {#resource-types}

- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

## `CredentialProviderRequest`     {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderRequest}

<p>
<!--
CredentialProviderRequest includes the image that the kubelet requires authentication for.
Kubelet will pass this request object to the plugin via stdin. In general, plugins should
prefer responding with the same apiVersion they were sent.
-->
<code>CredentialProviderRequest</code> 包含 kubelet 需要通過身份驗證才能訪問的映像檔。
kubelet 將此請求對象通過 stdin 傳遞到插件。
通常，插件應優先使用所收到的 <code>apiVersion</code> 作出響應。
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
<p>
<!--
image is the container image that is being pulled as part of the
credential provider plugin request. Plugins may optionally parse the image
to extract any information required to fetch credentials.
-->
<code>image</code> 是作爲憑據提供程式插件請求的一部分所拉取的容器映像檔。
這些插件可以選擇解析映像檔以提取獲取憑據所需的任何資訊。
</p>

</td>
</tr>

<tr><td><code>serviceAccountToken</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
serviceAccountToken is the service account token bound to the pod for which
the image is being pulled. This token is only sent to the plugin if the
tokenAttributes.serviceAccountTokenAudience field is configured in the kubelet's credential
provider configuration.
-->
<code>serviceAccountToken</code> 是與正在拉取映像檔的 Pod 綁定的服務帳號令牌。
只有在 kubelet 的憑證提供者設定中設置了
<code>tokenAttributes.serviceAccountTokenAudience</code> 字段時，
纔會將此令牌發送給插件。
</p>
</td>
</tr>
<tr><td><code>serviceAccountAnnotations</code> <B><!--[Required]-->[必需]</B><br/>
<code>map[string]string</code>
</td>
<td>
<p>
<!--
serviceAccountAnnotations is a map of annotations on the service account bound to the
pod for which the image is being pulled. The list of annotations in the service account
that need to be passed to the plugin is configured in the kubelet's credential provider
configuration.
-->
<code>serviceAccountAnnotations</code>> 與正在拉取映像檔的 Pod
綁定的服務帳號上的註解映射。需要傳遞給插件的服務帳號中的註解列表在
kubelet 的憑證提供者設定中進行設定。
</p>
</td>
</tr>

</tbody>
</table>

## `CredentialProviderResponse`     {#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse}

<p>
<!--
CredentialProviderResponse holds credentials that the kubelet should use for the specified
image provided in the original request. Kubelet will read the response from the plugin via stdout.
This response should be set to the same apiVersion as CredentialProviderRequest.
-->
<code>CredentialProviderResponse</code> 中包含 kubelet 應針對原始請求中所給映像檔來使用的憑據。
kubelet 將通過 stdout 讀取來自插件的響應。
此響應應被設置爲與 <code>CredentialProviderRequest</code> 相同的
<code>apiVersion</code>。
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
<p>
<!--
cacheKeyType indicates the type of caching key to use based on the image provided
in the request. There are three valid values for the cache key type: Image, Registry, and
Global. If an invalid value is specified, the response will NOT be used by the kubelet.
-->
<code>cacheKeyType</code> 標示了基於請求中提供的映像檔要使用的緩存鍵的類型。
緩存鍵類型有三個有效值：<code>Image</code>、<code>Registry</code> 和 <code>Global</code>。
如果所指定的值無效，則此響應不會被 kubelet 使用。
</p>
</td>
</tr>
<tr><td><code>cacheDuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
cacheDuration indicates the duration the provided credentials should be cached for.
The kubelet will use this field to set the in-memory cache duration for credentials
in the AuthConfig. If null, the kubelet will use defaultCacheDuration provided in
CredentialProviderConfig. If set to 0, the kubelet will not cache the provided AuthConfig.
-->
<code>cacheDuration</code> 標示所提供的憑據可被緩存的持續期。
kubelet 將使用此字段爲 <code>AuthConfig</code> 中的憑據設置內存中緩存持續期。
如果爲空，kubelet 將使用 CredentialProviderConfig 中提供的 <code>defaultCacheDuration</code>。
如果設置爲 0，kubelet 將不再緩存提供的 <code>AuthConfig</code>。
</p>
</td>
</tr>
<tr><td><code>auth</code><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1-AuthConfig"><code>map[string]AuthConfig</code></a>
</td>
<td>
<p>
<!--
auth is a map containing authentication information passed into the kubelet.
Each key is a match image string (more on this below). The corresponding authConfig value
should be valid for all images that match against this key. A plugin should set
this field to null if no valid credentials can be returned for the requested image.
-->
<code>auth</code> 是一個映射，包含傳遞給 kubelet 的身份驗證資訊。
映射中每個鍵都是一個匹配映像檔字符串（更多內容見下文）。
相應的 <code>authConfig</code> 值應該對匹配此鍵的所有映像檔有效。
如果無法爲請求的映像檔返回有效憑據，則插件應將此字段設置爲空。
</p>
<p>
<!--
Each key in the map is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&ast;.k8s.io' or 'k8s.&ast;.io', and top-level-domains such as 'k8s.&ast;'.
Matching partial subdomains like 'app&ast;.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &ast;.io does not match &ast;.k8s.io.</p>
-->
映射中的每個主鍵都可以包含端口和路徑。
域名中可以使用 Glob 通配，但不能在端口或路徑中使用 Glob。
Glob 支持類似 <code>&ast;.k8s.io</code> 或 <code>k8s.&ast;.io</code> 這類子域以及 <code>k8s.&ast;</code> 這類頂級域。
也支持匹配的部分子域，例如 <code>app&ast;.k8s.io</code>。
每個 Glob 只能匹配一個子域段，因此 <code>&ast;.io</code> 與 <code>&ast;.k8s.io</code> 不匹配。
</p>
<p>
<!--
The kubelet will match images against the key when all of the below are true:
-->
當滿足以下所有條件時，kubelet 將根據主鍵來匹配映像檔：
</p>
<ul>
<!--
Both contain the same number of domain parts and each part matches.
-->
<li>兩者都包含相同數量的域名部分，並且每個部分都匹配。</li>
<!--
The URL path of an imageMatch must be a prefix of the target image URL path.
-->
<li>imageMatch 的 URL 路徑必須是目標映像檔 URL 路徑的前綴。</li>
<!--
If the imageMatch contains a port, then the port must match in the image as well.
-->
<li>如果 <code>imageMatch</code> 包含端口，則此端口也必須在映像檔中匹配。</li>
</ul>
<p>
<!--
When multiple keys are returned, the kubelet will traverse all keys in reverse order so that:
-->
當返回多個主鍵時，kubelet 將以相反的順序遍歷所有主鍵，以便：
</p>
<ul>
<!--
longer keys come before shorter keys with the same prefix
-->
<li>較長鍵出現在具有相同前綴的較短鍵前面。</li>
<!--
non-wildcard keys come before wildcard keys with the same prefix.
-->
<li>非通配符鍵出現在具有相同前綴的通配符鍵之前。</li>
</ul>
<p>
<!--
For any given match, the kubelet will attempt an image pull with the provided credentials,
stopping after the first successfully authenticated pull.
-->
對於任一給定的匹配項，kubelet 將嘗試用提供的憑據拉取映像檔，並在第一次成功通過身份驗證的拉取之後停止。
</p>
<!--
Example keys:
-->
<p>示例鍵：</p>
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
**出現在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)

<p>
<!--
AuthConfig contains authentication information for a container registry.
Only username/password based authentication is supported today, but more authentication
mechanisms may be added in the future.
-->
<code>AuthConfig</code> 包含針對容器映像檔倉庫的身份驗證資訊。
目前僅支持基於使用者名/密碼的身份驗證，但未來可能添加更多的身份驗證機制。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>username</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
username is the username used for authenticating to the container registry
An empty username is valid.
-->
<code>username</code> 是對容器映像檔倉庫身份驗證所用的使用者名。
空白使用者名是有效的。
</p>
</td>
</tr>
<tr><td><code>password</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
password is the password used for authenticating to the container registry
An empty password is valid.
-->
<code>password</code> 是對容器映像檔倉庫身份驗證所用的密碼。
空白密碼是有效的。
</p>
</td>
</tr>
</tbody>
</table>

## `PluginCacheKeyType`     {#credentialprovider-kubelet-k8s-io-v1-PluginCacheKeyType}

<!--
(Alias of `string`)
-->
（`string` 的別名）

<!--
**Appears in:**
-->
**出現在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1-CredentialProviderResponse)
