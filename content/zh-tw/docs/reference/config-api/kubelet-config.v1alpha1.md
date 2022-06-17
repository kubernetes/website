---
title: Kubelet 配置 (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
auto_generated: true
---

<!--
title: Kubelet Configuration (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
auto_generated: true
-->

<!--
## Resource Types
-->
## 資源型別

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

## `FormatOptions`     {#FormatOptions}

<!--
**Appears in:**
-->
**出現在：**

<!--
FormatOptions contains options for the different logging formats.
-->
FormatOptions 包含為不同型別日誌格式提供的選項。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>json</code> <B>[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <!--[Experimental] JSON contains options for logging format &quot;json&quot;.-->
   [試驗特性] <code>json</code> 中包含 &quot;json&quot; 日誌格式的選項。
</td>
</tr>
</tbody>
</table>

## `JSONOptions`     {#JSONOptions}

<!--
**Appears in:**
-->
**出現在：**

- [FormatOptions](#FormatOptions)

<!--
JSONOptions contains options for logging format &quot;json&quot;.
-->
JSONOptions 包含用於 &quot;json&quot; 日誌格式的選項。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>splitStream</code> <B>[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--[Experimental] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering.-->
  [試驗特性] <code>splitStream</code> 將錯誤資訊重定向到標準錯誤輸出（stderr），
將提示資訊重定向到標準輸出（stdout），併為二者提供快取。預設配置是將兩類資訊都寫出到標準輸出，
並且不提供快取。
</td>
</tr>

<tr><td><code>infoBufferSize</code> <B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   <!--[Experimental] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.-->
  [試驗特性] <code>infoBufferSize</code> 設定使用分離資料流時資訊資料流的大小。
預設值是 0，意味著禁止快取。
</td>
</tr>
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}

<!--
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)
-->
（`[]k8s.io/component-base/config/v1alpha1.VModuleItem` 的別名）

<!--
**Appears in:**
-->
**出現在：**

<!--
VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.
-->
VModuleConfiguration 是一個集合，其中包含一個個的檔名（或者檔名模式）
及對應的詳細程度閾值。

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}

<!--
CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.
-->
CredentialProviderConfig 包含有關每個 exec 憑據提供者的配置資訊。
Kubelet 從磁碟上讀取這些配置資訊，並根據 CredentialProvider 型別啟用各個提供者。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
<tr><td><code>providers</code> <B>[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <!--
providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is used.
-->
  <code>providers</code> 是一組憑據提供者外掛，這些外掛會被 kubelet 啟用。
多個提供者可以匹配到同一映象上，這時，來自所有提供者的憑據資訊都會返回給 kubelet。
如果針對同一映象呼叫了多個提供者，則結果會被組合起來。如果提供者返回的認證主鍵有重複，
列表中先出現的提供者所返回的值將被使用。
</td>
</tr>
</tbody>
</table>

## `CredentialProvider`     {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}

<!--
**Appears in:**
-->
**出現在：**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

<!--
CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).
-->
CredentialProvider 代表的是要被 kubelet 呼叫的一個 exec 外掛。
這一外掛只會在所拉取的映象與該外掛所處理的映象匹配時才會被呼叫（參見 <code>matchImages</code>）。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--name is the required name of the credential provider. It must match the name of the
provider executable as seen by the kubelet. The executable must be in the kubelet's
bin directory (set by the --image-credential-provider-bin-dir flag).</td>
-->
  <code>name</code> 是憑據提供者的名稱（必需）。此名稱必須與 kubelet
  所看到的提供者可執行檔案的名稱匹配。可執行檔案必須位於 kubelet 的 
  <code>bin</code> 目錄（透過 <code>--image-credential-provider-bin-dir</code> 設定）下。
</td>
</tr>

<tr><td><code>matchImages</code> <B>[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.
Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like <code>*.k8s.io</code> or <code>k8s.*.io</code>, and top-level-domains such as <code>k8s.*</code>.
Matching partial subdomains like <code>app*.k8s.io</code> is also supported. Each glob can only match
a single subdomain segment, so <code>*.io</code> does not match <code>*.k8s.io</code>.
A match exists between an image and a matchImage when all of the below are true:
<ul>
<li>Both contain the same number of domain parts and each part matches.</li>
<li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
<li>If the imageMatch contains a port, then the port must match in the image as well.</li>
</ul>
Example values of matchImages:
  - 123456789.dkr.ecr.us-east-1.amazonaws.com
  - &lowast;.azurecr.io
  - gcr.io
  - &lowast;.&lowast;.registry.io
  - registry.io:8080/path
  -->
<p><code>matchImages</code> 是一個必須設定的字串列表，用來匹配映象以便確定是否要呼叫此提供者。
如果字串之一與 kubelet 所請求的映象匹配，則此外掛會被呼叫並給予提供憑證的機會。
映象應該包含映象庫域名和 URL 路徑。</p>
<p><code>matchImages</code> 中的每個條目都是一個模式字串，其中可以包含埠號和路徑。
域名部分可以包含統配符，但埠或路徑部分不可以。萬用字元可以用作子域名，例如
<code>*.k8s.io</code> 或 <code>k8s.*.io</code>，以及頂級域名，如 <code>k8s.*</code>。</p>
<p>對類似 <code>app*.k8s.io</code> 這類部分子域名的匹配也是支援的。
每個萬用字元只能用來匹配一個子域名段，所以 <code>*.io</code> 不會匹配 <code>*.k8s.io</code>。</p>
<p>映象與 <code>matchImages</code> 之間存在匹配時，以下條件都要滿足：</p>
<ul>
  <li>二者均包含相同個數的域名部分，並且每個域名部分都對應匹配；</li>
  <li><code>matchImages</code> 條目中的 URL 路徑部分必須是目標映象的 URL 路徑的字首；</li>
  <li>如果 <code>matchImages</code> 條目中包含埠號，則埠號也必須與映象埠號匹配。</li>
</ul>
<p><code>matchImages</code> 的一些示例如下：</p>
<ul>
<li><code>123456789.dkr.ecr.us-east-1.amazonaws.com</code></li>
<li><code>*.azurecr.io</code></li>
<li><code>gcr.io</code></li>
<li><code>*.*.registry.io</code></li>
<li><code>registry.io:8080/path</code></li>
</ul>
</td>
</tr>

<tr><td><code>defaultCacheDuration</code> <B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--defaultCacheDuration is the default duration the plugin will cache credentials in-memory
if a cache duration is not provided in the plugin response. This field is required.-->
   <code>defaultCacheDuration</code> 是外掛在記憶體中快取憑據的預設時長，
在外掛響應中沒有給出快取時長時，使用這裡設定的值。此欄位是必需的。
</td>
</tr>

<tr><td><code>apiVersion</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
MUST use the same encoding version as the input. Current supported values are:
- credentialprovider.kubelet.k8s.io/v1alpha1-->
  <p>要求 exec 外掛 CredentialProviderRequest 請求的輸入版本。
  所返回的 CredentialProviderResponse 必須使用與輸入相同的編碼版本。當前支援的值有：</p>
  <ul>
    <li><code>credentialprovider.kubelet.k8s.io/v1alpha1</code></li>
  </ul>
</td>
</tr>

<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <!--Arguments to pass to the command when executing it.-->
  在執行外掛可執行檔案時要傳遞給命令的引數。
</td>
</tr>

<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <!--Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.-->
  <code>env</code> 定義要提供給外掛程序的額外的環境變數。
這些環境變數會與主機上的其他環境變數以及 client-go 所使用的環境變數組合起來，
一起傳遞給外掛。
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}

<!--
**Appears in:**
-->
**出現在：**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)

<!--
ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.
-->
ExecEnvVar 用來在執行基於 exec 的憑據外掛時設定環境變數。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- span class="text-muted">No description provided.</span -->
  環境變數名稱。
</td>
</tr>

<tr><td><code>value</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- span class="text-muted">No description provided.</span-->
  環境變數取值。
</td>
</tr>
</tbody>
</table>

