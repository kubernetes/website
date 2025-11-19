---
title: kubelet 配置 (v1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1
---
<!--
title: Kubelet Configuration (v1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types
-->
## 資源類型

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1-CredentialProviderConfig}

<!--
CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.
-->
CredentialProviderConfig 包含有關每個 exec 憑據提供程序的配置信息。
kubelet 從磁盤上讀取這些配置信息，並根據 CredentialProvider 類型啓用各個提供程序。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>

<tr><td><code>providers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
<p>
<!--
providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is attempted first.
-->
<code>providers</code> 是一組憑據提供程序插件，這些插件會被 kubelet 啓用。
多個提供程序可以匹配到同一鏡像上，這時，來自所有提供程序的憑據信息都會返回給 kubelet。
如果針對同一鏡像調用了多個提供程序，則結果會被組合起來。如果提供程序返回的認證主鍵有重複，
列表中先出現的提供程序所返回的值將被首先嚐試。
</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider`     {#kubelet-config-k8s-io-v1-CredentialProvider}

<!--
**Appears in:**
-->
**出現在：**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

<!--
CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).
-->
CredentialProvider 代表的是要被 kubelet 調用的一個 exec 插件。
這一插件只會在所拉取的鏡像與該插件所處理的鏡像匹配時纔會被調用（參見 <code>matchImages</code>）。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the required name of the credential provider. It must match the name of the
   provider executable as seen by the kubelet. The executable must be in the kubelet's
   bin directory (set by the --image-credential-provider-bin-dir flag).
   Required to be unique across all providers.
   -->
   <code>name</code> 是憑據提供程序的名稱（必需）。此名稱必須與 kubelet
   所看到的提供程序可執行文件的名稱匹配。可執行文件必須位於 kubelet 的
   <code>bin</code> 目錄（通過 <code>--image-credential-provider-bin-dir</code> 設置）下。
   在所有提供程序中，名稱是唯一的。
   </p>
</td>
</tr>
<tr><td><code>matchImages</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.
-->
<code>matchImages</code> 是一個必須設置的字符串列表，用來匹配鏡像以便確定是否要調用此提供程序。
如果字符串之一與 kubelet 所請求的鏡像匹配，則此插件會被調用並給予提供憑據的機會。
鏡像應該包含鏡像庫域名和 URL 路徑。
</p>

<p>
<!--
Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&ast;.k8s.io' or 'k8s.&ast;.io', and top-level-domains such as 'k8s.&ast;'.
Matching partial subdomains like 'app</em>.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &ast;.io does not match &ast;.k8s.io.
-->
<code>matchImages</code> 中的每個條目都是一個模式字符串，其中可以包含端口號和路徑。
域名部分可以包含通配符，但端口或路徑部分不可以。'&ast;.k8s.io' 或 'k8s.&ast;.io' 等子域名以及
'k8s.&ast;' 這類頂級域名都支持通配符。</p>
<p>對於 'app</em>.k8s.io' 這類部分子域名的匹配也是支持的。
每個通配符只能用來匹配一個子域名段，所以 &ast;.io 不會匹配 &ast;.k8s.io。
</p>
<p>
<!--
A match exists between an image and a matchImage when all of the below are true:
-->
鏡像與 <code>matchImages</code> 之間存在匹配時，以下條件都要滿足：
</p>
<ul>
  <!--
  <li>Both contain the same number of domain parts and each part matches.</li>
  <li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
  <li>If the imageMatch contains a port, then the port must match in the image as well.</li>
  -->
  <li>二者均包含相同個數的域名部分，並且每個域名部分都對應匹配；</li>
  <li><code>matchImages</code> 條目中的 URL 路徑部分必須是目標鏡像的 URL 路徑的前綴；</li>
  <li>如果 <code>matchImages</code> 條目中包含端口號，則端口號也必須與鏡像端口號匹配。</li>
</ul>
<p>
<!--
Example values of matchImages:
-->
<code>matchImages</code> 的一些示例如下：
</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>&ast;.azurecr.io</li>
<li>gcr.io</li>
<li>&ast;.&ast;.registry.io</li>
<li>registry.io:8080/path</li>
</ul>
</td>
</tr>
<tr><td><code>defaultCacheDuration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!--
   defaultCacheDuration is the default duration the plugin will cache credentials in-memory
   if a cache duration is not provided in the plugin response. This field is required.
   -->
   <code>defaultCacheDuration</code> 是插件在內存中緩存憑據的默認時長，
   在插件響應中沒有給出緩存時長時，使用這裏設置的值。此字段是必需的。
   </p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
   MUST use the same encoding version as the input. Current supported values are:
   -->
   要求 exec 插件 <code>CredentialProviderRequest</code> 請求的輸入版本。
   所返回的 <code>CredentialProviderResponse</code> 必須使用與輸入相同的編碼版本。當前支持的值有：
   </p>
<ul>
<li>credentialprovider.kubelet.k8s.io/v1</li>
</ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
Arguments to pass to the command when executing it.
-->
在執行插件可執行文件時要傳遞給命令的參數。
</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
<p>
<!--
Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.
-->
<code>env</code> 定義要提供給插件進程的額外的環境變量。
這些環境變量會與主機上的其他環境變量以及 client-go 所使用的環境變量組合起來，
一起傳遞給插件。
</p>
</td>
</tr>
<tr><td><code>tokenAttributes</code><br/>
<a href="#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes"><code>ServiceAccountTokenAttributes</code></a>
</td>
<td>
<p>
<!--
tokenAttributes is the configuration for the service account token that will be passed to the plugin.
The credential provider opts in to using service account tokens for image pull by setting this field.
When this field is set, kubelet will generate a service account token bound to the pod for which the
image is being pulled and pass to the plugin as part of CredentialProviderRequest along with other
attributes required by the plugin.
-->
<code>tokenAttributes</code> 是將傳遞給插件的服務賬號令牌的配置。
憑據提供程序通過設置此字段選擇使用服務賬號令牌進行鏡像拉取。
當設置了此字段後，kubelet 將爲正在拉取鏡像的 Pod 生成一個綁定到此 Pod 的服務賬號令牌，
並將其作爲 <code>CredentialProviderRequest</code> 的一部分傳遞給插件，同時傳遞插件所需的其他屬性。
</p>
<p>
<!--
The service account metadata and token attributes will be used as a dimension to cache
the credentials in kubelet. The cache key is generated by combining the service account metadata
(namespace, name, UID, and annotations key+value for the keys defined in
serviceAccountTokenAttribute.requiredServiceAccountAnnotationKeys and serviceAccountTokenAttribute.optionalServiceAccountAnnotationKeys).
The pod metadata (namespace, name, UID) that are in the service account token are not used as a dimension
to cache the credentials in kubelet. This means workloads that are using the same service account
could end up using the same credentials for image pull. For plugins that don't want this behavior, or
plugins that operate in pass-through mode; i.e., they return the service account token as-is, they
can set the credentialProviderResponse.cacheDuration to 0. This will disable the caching of
credentials in kubelet and the plugin will be invoked for every image pull. This does result in
token generation overhead for every image pull, but it is the only way to ensure that the
credentials are not shared across pods (even if they are using the same service account).
-->
服務賬號的元數據和令牌屬性將作爲 kubelet 中緩存憑據的一個維度。
緩存鍵由服務賬號的元數據（命名空間、名稱、UID 以及
<code>serviceAccountTokenAttribute.requiredServiceAccountAnnotationKeys</code>
和 <code>serviceAccountTokenAttribute.optionalServiceAccountAnnotationKeys</code>
中定義的註解鍵及其對應的值）組合生成。
服務賬號令牌中的 Pod 元數據（命名空間、名稱、UID）不會作爲 kubelet 緩存憑據的維度。
這意味着，使用相同服務賬號的工作負載可能會共用相同的憑據進行鏡像拉取。
對於不希望出現此行爲的插件，或者以直通模式運行的插件（即直接返回服務賬號令牌而不做處理），可以將
<code>credentialProviderResponse.cacheDuration</code> 設置爲 0。這一設置將禁用 kubelet 中憑據的緩存機制，
每次鏡像拉取時都會調用插件。雖然這樣設置會導致每次鏡像拉取時都要重新生成令牌，因而帶來額外開銷，
但這是確保憑據不會在使用相同服務賬號的多個 Pod 之間共享的唯一方式。
</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1-ExecEnvVar}

<!--
**Appears in:**
-->
**出現在：**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)

<!--
ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.
-->
ExecEnvVar 用來在執行基於 exec 的憑據插件時設置環境變量。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- No description provided. -->
   <span class="text-muted">環境變量名稱</span></td>
</tr>
<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- No description provided. -->
   <span class="text-muted">環境變量取值</span></td>
</tr>
</tbody>
</table>

## `ServiceAccountTokenAttributes`     {#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes}

<!--
**Appears in:**
-->
**出現在**：

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)

<p>
<!--
ServiceAccountTokenAttributes is the configuration for the service account token that will be passed to the plugin.
-->
<code>ServiceAccountTokenAttributes</code> 是將被傳遞給插件的服務賬號令牌的配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>serviceAccountTokenAudience</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   serviceAccountTokenAudience is the intended audience for the projected service account token.
   -->
   <code>serviceAccountTokenAudience</code> 是投射的服務賬號令牌的目標受衆。
   </p>
</td>
</tr>
<tr><td><code>cacheType</code> <B><!--[Required]-->必需</B><br/>
<a href="#kubelet-config-k8s-io-v1-ServiceAccountTokenCacheType"><code>ServiceAccountTokenCacheType</code></a>
</td>
<td>
<p>
<!--
cacheType indicates the type of cache key use for caching the credentials returned by the plugin
when the service account token is used.
The most conservative option is to set this to &quot;Token&quot;, which means the kubelet will cache returned credentials
on a per-token basis. This should be set if the returned credential's lifetime is limited to the service account
token's lifetime.
If the plugin's credential retrieval logic depends only on the service account and not on pod-specific claims,
then the plugin can set this to &quot;ServiceAccount&quot;. In this case, the kubelet will cache returned credentials
on a per-serviceaccount basis. Use this when the returned credential is valid for all pods using the same service account.
-->
<code>cacheType</code> 表示當使用服務賬號令牌時，用於緩存插件返回的憑據的緩存鍵類型。
最保守的選擇是將其設置爲 &quot;Token&quot;，這意味着 kubelet 將基於每個令牌緩存返回的憑據。
如果返回的憑據的有效期受限於服務賬號令牌的有效期，則應設置此值。
如果插件的憑據檢索邏輯僅依賴於服務賬號而不依賴於特定於 Pod 的聲明，
那麼插件可以將此設置爲 &quot;ServiceAccount&quot;。在這種情況下，
kubelet 將基於每個服務賬號緩存返回的憑據。
當返回的憑據對使用相同服務賬號的所有 Pod 都有效時使用此選項。
</p>
</td>
</tr>
<tr><td><code>requireServiceAccount</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!--
   requireServiceAccount indicates whether the plugin requires the pod to have a service account.
If set to true, kubelet will only invoke the plugin if the pod has a service account.
If set to false, kubelet will invoke the plugin even if the pod does not have a service account
and will not include a token in the CredentialProviderRequest in that scenario. This is useful for plugins that
are used to pull images for pods without service accounts (e.g., static pods).
-->
<code>requireServiceAccount</code> 指示插件是否需要 Pod 擁有服務帳號。
如果設置爲 true，kubelet 僅在 Pod 擁有服務賬號時纔會調用插件。
如果設置爲 false，即使 Pod 沒有服務賬號，kubelet 也會調用插件，
並且不會在 <code>CredentialProviderRequest</code> 中包含令牌。
這對於用於拉取沒有服務賬號的 Pod（例如靜態 Pod）鏡像的插件非常有用。
</p>
</td>
</tr>
<tr><td><code>requiredServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
requiredServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
and that are required to be present in the service account.
The keys defined in this list will be extracted from the corresponding service account and passed
to the plugin as part of the CredentialProviderRequest. If any of the keys defined in this list
are not present in the service account, kubelet will not invoke the plugin and will return an error.
This field is optional and may be empty. Plugins may use this field to extract
additional information required to fetch credentials or allow workloads to opt in to
using service account tokens for image pull.
If non-empty, requireServiceAccount must be set to true.
Keys in this list must be unique.
This list needs to be mutually exclusive with optionalServiceAccountAnnotationKeys.
-->
<code>requiredServiceAccountAnnotationKeys</code> 是插件感興趣的註解鍵列表；這些鍵需要存在於服務帳號中。
在此列表中定義的鍵將從相應的服務帳號中提取，並作爲 <code>CredentialProviderRequest</code> 的一部分傳遞給插件。
如果此列表中定義的任何一個鍵不存在於服務賬號中，kubelet 將不會調用插件並返回錯誤。
此字段是可選的，可以爲空。插件可以使用此字段提取獲取憑據所需的額外信息，
或允許工作負載選擇使用服務帳號令牌進行鏡像拉取。
如果非空，則 <code>requireServiceAccount</code> 必須設置爲 true。
鍵必須在此列表中唯一。
此列表需要與 <code>optionalServiceAccountAnnotationKeys</code> 互斥。
</p>
</td>
</tr>
<tr><td><code>optionalServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
<p>
<!--
optionalServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
and that are optional to be present in the service account.
The keys defined in this list will be extracted from the corresponding service account and passed
to the plugin as part of the CredentialProviderRequest. The plugin is responsible for validating
the existence of annotations and their values.
This field is optional and may be empty. Plugins may use this field to extract
additional information required to fetch credentials.
Keys in this list must be unique.
-->
<code>optionalServiceAccountAnnotationKeys</code> 是插件感興趣的註解鍵列表，並且這些鍵在服務帳號中是可選存在的。
在此列表中定義的鍵將從相應的服務賬號中提取，並作爲 <code>CredentialProviderRequest</code> 的一部分傳遞給插件。
插件負責驗證註解及其值的存在性。此字段是可選的，可以爲空。
插件可以使用此字段提取獲取憑據所需的額外信息。
鍵必須在此列表中唯一。
</p>
</td>
</tr>
</tbody>
</table>

## `ServiceAccountTokenCacheType`     {#kubelet-config-k8s-io-v1-ServiceAccountTokenCacheType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 的別名）

**出現在：**

- [ServiceAccountTokenAttributes](#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes)

<p>
<!--
ServiceAccountTokenCacheType is the type of cache key used for caching credentials returned by the plugin
when the service account token is used.
-->
<code>ServiceAccountTokenCacheType</code> 是當使用服務賬號令牌時，
用於緩存插件返回的憑據的緩存鍵類型。
</p>
