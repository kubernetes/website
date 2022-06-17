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
## 資源型別   {#resource-types}

- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)

## `CredentialProviderRequest`     {#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderRequest}

<!--
CredentialProviderRequest includes the image that the kubelet requires authentication for.
Kubelet will pass this request object to the plugin via stdin. In general, plugins should
prefer responding with the same apiVersion they were sent.
-->
<p>
CredentialProviderRequest 包含 kubelet 需要進行身份驗證的映象。
Kubelet 會透過標準輸入將此請求物件傳遞給外掛。一般來說，外掛傾向於用它們所收到的相同的 apiVersion 來響應。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <code>image</code> 是容器映象，作為憑據提供程式外掛請求的一部分。
   外掛可以有選擇地解析映象以提取獲取憑據所需的任何資訊。
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
CredentialProviderResponse 持有 kubelet 應用於原始請求中提供的指定映象的憑據。
kubelet 將透過標準輸出讀取外掛的響應。此響應的 apiVersion 值應設定為與 CredentialProviderRequest 中 apiVersion 值相同。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <code>cacheKeyType</code> 表明基於請求中所給映象而要使用的快取鍵型別。快取鍵型別有三個有效值：
   Image、Registry 和 Global。如果指定了無效值，則 kubelet 不會使用該響應。
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
   <code>cacheDuration</code> 表示所提供的憑據應該被快取的時間。kubelet 使用這個欄位為
   <code>auth</code> 中的憑據設定記憶體中資料的快取時間。如果為空，kubelet 將使用 CredentialProviderConfig
   中提供的 defaultCacheDuration。如果設定為 0，kubelet 將不會快取所提供的 <code>auth</code> 資料。
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
   <code>auth</code> 是一個對映，其中包含傳遞到 kubelet 的身份驗證資訊。
   每個鍵都是一個匹配映象字串（下面將對此進行詳細介紹）。相應的 authConfig 值應該對所有與此鍵匹配的映象有效。
   如果不能為請求的映象返回有效的憑據，外掛應將此欄位設定為 null。
   </p>
<!--
Each key in the map is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '<em>.k8s.io' or 'k8s.</em>.io', and top-level-domains such as 'k8s.<em>'.
Matching partial subdomains like 'app</em>.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so *.io does not match *.k8s.io.
-->
   <p>
   對映中每個鍵值都是一個正則表示式，可以選擇包含埠和路徑。
   域名部分可以包含萬用字元，但在埠或路徑中不能使用萬用字元。
   支援萬用字元作為子域，如 <code>*.k8s.io</code> 或 <code>k8s.*.io</code>，以及頂級域，如 <code>k8s.*</code>。
   還支援匹配部分子域，如 <code>app*.k8s.io</code>。每個萬用字元只能匹配一個子域段，
   因此 <code>*.io</code> 不匹配 <code>*.k8s.io</code>。
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
   當滿足以下所有條件時，kubelet 會將映象與鍵值匹配：
   </p>
   <ul>
    <li>兩者都包含相同數量的域部分，並且每個部分都匹配。</li>
    <li><code>imageMatch</code> 的 URL 路徑必須是目標映象的 URL 路徑的字首。</li>
    <li>如果 <code>imageMatch</code> 包含埠，則該埠也必須在映象中匹配。</li>
   </ul>
<!--
<p>When multiple keys are returned, the kubelet will traverse all keys in reverse order so that:</p>
<ul>
<li>longer keys come before shorter keys with the same prefix</li>
<li>non-wildcard keys come before wildcard keys with the same prefix.</li>
</ul>
-->
   <p>
   當返回多個鍵（key）時，kubelet 會倒序遍歷所有鍵，這樣：
   </p>
   <ul>
    <li>具有相同字首的較長鍵位於較短鍵之前</li>
    <li>具有相同字首的非萬用字元鍵位於萬用字元鍵之前。</li>
   </ul>
<!--
<p>For any given match, the kubelet will attempt an image pull with the provided credentials,
stopping after the first successfully authenticated pull.</p>
<p>Example keys:</p>
-->
   <p>
   對於任何給定的匹配，kubelet 將嘗試使用提供的憑據進行映象拉取，並在第一次成功驗證後停止拉取。
   </p>
   <p>鍵值示例：</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>*.azurecr.io</li>
<li>gcr.io</li>
<li><em>.</em>.registry.io</li>
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
**出現在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)

<!--
<p>AuthConfig contains authentication information for a container registry.
Only username/password based authentication is supported today, but more authentication
mechanisms may be added in the future.</p>
-->
AuthConfig 包含容器倉庫的身份驗證資訊。目前僅支援基於使用者名稱/密碼的身份驗證，但未來可能會新增更多身份驗證機制。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   <code>username</code> 是用於向容器倉庫進行身份驗證的使用者名稱。空的使用者名稱是合法的。
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
   <code>password</code> 是用於向容器倉庫進行身份驗證的密碼。空密碼是合法的。
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
（<code>string</code> 資料型別的別名）

**出現在：**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1beta1-CredentialProviderResponse)