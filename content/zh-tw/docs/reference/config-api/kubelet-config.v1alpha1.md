---
title: kubelet 設定 (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
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
## 資源類型

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}

<!--
CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.
-->
CredentialProviderConfig 包含有關每個 exec 憑據提供者的設定信息。
kubelet 從磁盤上讀取這些設定信息，並根據 CredentialProvider 類型啓用各個提供者。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
<tr><td><code>providers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
<!--
providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is attempted first.
-->
<code>providers</code> 是一組憑據提供者插件，這些插件會被 kubelet 啓用。
多個提供者可以匹配到同一映像檔上，這時，來自所有提供者的憑據信息都會返回給 kubelet。
如果針對同一映像檔調用了多個提供者，則結果會被組合起來。如果提供者返回的認證主鍵有重複，
列表中先出現的提供者所返回的值將第一個被嘗試使用。
</td>
</tr>
</tbody>
</table>

## `ImagePullIntent`     {#kubelet-config-k8s-io-v1alpha1-ImagePullIntent}

<p>
<!--
ImagePullIntent is a record of the kubelet attempting to pull an image.
-->
<code>ImagePullIntent</code> 是 kubelet 嘗試拉取映像檔的記錄。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePullIntent</code></td></tr>

<tr><td><code>image</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Image is the image spec from a Container's <code>image</code> field.
The filename is a SHA-256 hash of this value. This is to avoid filename-unsafe
characters like ':' and '/'.
-->
<code>image</code> 是容器 <code>image</code> 字段中的映像檔規約。
文件名是此值的 SHA-256 哈希，這樣做是爲了避免文件名中不安全的字符，如 ':' 和 '/'。
</p>
</td>
</tr>
</tbody>
</table>

## `ImagePulledRecord`     {#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord}

<p>
<!--
ImagePullRecord is a record of an image that was pulled by the kubelet.
-->
<code>ImagePullRecord</code> 是 kubelet 拉取的映像檔的記錄。
</p>
<p>
<!--
If there are no records in the <code>kubernetesSecrets</code> field and both <code>nodeWideCredentials</code>
and <code>anonymous</code> are <code>false</code>, credentials must be re-checked the next time an
image represented by this record is being requested.
-->
如果 <code>kubernetesSecrets</code> 字段中沒有記錄，且 <code>nodeWideCredentials</code>
和 <code>anonymous</code> 均爲 <code>false</code>，則當請求此記錄表示的映像檔時，必須重新檢查憑據。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePulledRecord</code></td></tr>

<tr><td><code>lastUpdatedTime</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
<p>
<!--
LastUpdatedTime is the time of the last update to this record
-->
<code>lastUpdatedTime</code> 是此記錄上次更新的時間。
</p>
</td>
</tr>
<tr><td><code>imageRef</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
ImageRef is a reference to the image represented by this file as received
from the CRI.
The filename is a SHA-256 hash of this value. This is to avoid filename-unsafe
characters like ':' and '/'.
-->
<code>imageRef</code> 是從 CRI 接收到的此文件所代表的映像檔的引用。
文件名是此值的 SHA-256 哈希。這是爲了避免文件名中不安全的字符，如 ':' 和 '/'。
</p>
</td>
</tr>
<tr><td><code>credentialMapping</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials"><code>map[string]ImagePullCredentials</code></a>
</td>
<td>
<p>
<!--
CredentialMapping maps <code>image</code> to the set of credentials that it was
previously pulled with.
<code>image</code> in this case is the content of a pod's container <code>image</code> field that's
got its tag/digest removed.
-->
<code>credentialMapping</code> 將 <code>image</code> 映射到之前拉取它時使用的憑據集。
這裏的 <code>image</code> 是 Pod 的容器中 <code>image</code> 字段的內容，
已去除其標籤/摘要。
</p>
<p>
<!--
Example:
Container requests the <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> image:
-->
示例：
容器請求 <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> 映像檔：
&quot;credentialMapping&quot;: {
&quot;hello-world&quot;: { &quot;nodePodsAccessible&quot;: true }
}
</p>
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
- [ImagePullIntent](#kubelet-config-k8s-io-v1alpha1-ImagePullIntent)
- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)

<!--
CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).
-->
CredentialProvider 代表的是要被 kubelet 調用的一個 exec 插件。
這一插件只會在所拉取的映像檔與該插件所處理的映像檔匹配時纔會被調用（參見 <code>matchImages</code>）。

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
<code>name</code> 是憑據提供者的名稱（必需）。此名稱必須與 kubelet
所看到的提供者可執行文件的名稱匹配。可執行文件必須位於 kubelet 的
<code>bin</code> 目錄（通過 <code>--image-credential-provider-bin-dir</code> 設置）下。
必須在所有提供商之間保持唯一。
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
<code>matchImages</code> 是一個必須設置的字符串列表，用來匹配映像檔以便確定是否要調用此提供者。
如果字符串之一與 kubelet 所請求的映像檔匹配，則此插件會被調用並給予提供憑證的機會。
映像檔應該包含映像檔庫域名和 URL 路徑。
</p>
<p>
<!--
Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like <code>*.k8s.io</code> or <code>k8s.*.io</code>, and top-level-domains such as <code>k8s.*</code>.
-->
<code>matchImages</code> 中的每個條目都是一個模式字符串，其中可以包含端口號和路徑。
域名部分可以包含統配符，但端口或路徑部分不可以。通配符可以用作子域名，例如
<code>*.k8s.io</code> 或 <code>k8s.*.io</code>，以及 <code>k8s.*</code> 這類頂級域名。
</p>
<p>
<!--
Matching partial subdomains like <code>app*.k8s.io</code> is also supported. Each glob can only match
a single subdomain segment, so <code>*.io</code> does not match <code>*.k8s.io</code>.
-->
對類似 <code>app*.k8s.io</code> 這類部分子域名的匹配也是支持的。
每個通配符只能用來匹配一個子域名段，所以 <code>*.io</code> 不會匹配 <code>*.k8s.io</code>。
</p>
<p>
<!--
A match exists between an image and a matchImage when all of the below are true:
-->
映像檔與 <code>matchImages</code> 之間存在匹配時，以下條件都要滿足：
</p>
<!--
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
<ul>
  <li>二者均包含相同個數的域名部分，並且每個域名部分都對應匹配；</li>
  <li><code>matchImages</code> 條目中的 URL 路徑部分必須是目標映像檔的 URL 路徑的前綴；</li>
  <li>如果 <code>matchImages</code> 條目中包含端口號，則端口號也必須與映像檔端口號匹配。</li>
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

<tr><td><code>defaultCacheDuration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   defaultCacheDuration is the default duration the plugin will cache credentials in-memory
if a cache duration is not provided in the plugin response. This field is required.
   -->
   <code>defaultCacheDuration</code> 是插件在內存中緩存憑據的默認時長，
在插件響應中沒有給出緩存時長時，使用這裏設置的值。此字段是必需的。
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
- credentialprovider.kubelet.k8s.io/v1alpha1
  -->
  要求 exec 插件 CredentialProviderRequest 請求的輸入版本。
  所返回的 CredentialProviderResponse 必須使用與輸入相同的編碼版本。當前支持的值有：
  </p>
  <ul>
    <li><code>credentialprovider.kubelet.k8s.io/v1alpha1</code></li>
  </ul>
</td>
</tr>

<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
<!--
Arguments to pass to the command when executing it.
-->
在執行插件可執行文件時要傳遞給命令的參數。
</td>
</tr>

<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
<!--
Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.
-->
<code>env</code> 定義要提供給插件進程的額外的環境變量。
這些環境變量會與主機上的其他環境變量以及 client-go 所使用的環境變量組合起來，
一起傳遞給插件。
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
ExecEnvVar 用來在執行基於 exec 的憑據插件時設置環境變量。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- span class="text-muted">No description provided.</span -->
  環境變量名稱。
</td>
</tr>

<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- span class="text-muted">No description provided.</span-->
  環境變量取值。
</td>
</tr>
</tbody>
</table>

## `ImagePullCredentials`     {#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials}

<!--
**Appears in:**
-->
**出現在：**

- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)

<p>
<!--
ImagePullCredentials describe credentials that can be used to pull an image.
-->
<code>ImagePullCredentials</code> 描述可以用於拉取映像檔的憑據。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>kubernetesSecrets</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ImagePullSecret"><code>[]ImagePullSecret</code></a>
</td>
<td>
<p>
<!--
KuberneteSecretCoordinates is an index of coordinates of all the kubernetes
secrets that were used to pull the image.
-->
<code>kuberneteSecretCoordinates</code> 是用於拉取映像檔的所有 Kubernetes
Secret 的座標索引。
</p>
</td>
</tr>
<tr><td><code>kubernetesServiceAccounts</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ImagePullServiceAccount"><code>[]ImagePullServiceAccount</code></a>
</td>
<td>
<p>
<!--
KubernetesServiceAccounts is an index of coordinates of all the kubernetes
service accounts that were used to pull the image.
-->
<code>kubernetesServiceAccounts</code> 是用於拉取映像檔的所有 Kubernetes
服務賬號的座標索引。
</p>
</td>
</tr>
<tr><td><code>nodePodsAccessible</code><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
NodePodsAccessible is a flag denoting the pull credentials are accessible
by all the pods on the node, or that no credentials are needed for the pull.
-->
<code>nodePodsAccessible</code> 是一個標誌，表示節點上的所有 Pod 都可以訪問拉取憑據，
或者拉取不需要憑據。
</p>
<p>
<!--
If true, it is mutually exclusive with the <code>kubernetesSecrets</code> field.
-->
如果爲 true，則與 <code>kubernetesSecrets</code> 字段互斥。
</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullSecret`     {#kubelet-config-k8s-io-v1alpha1-ImagePullSecret}

<!--
**Appears in:**
-->
**出現在：**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials)

<p>
<!--
ImagePullSecret is a representation of a Kubernetes secret object coordinates along
with a credential hash of the pull secret credentials this object contains.
-->
<code>ImagePullSecret</code> 是 Kubernetes Secret 對象座標的表示，
以及此對象包含的拉取 Secret 憑據的哈希值。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>uid</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->沒有提供描述。</span></td>
</tr>
<tr><td><code>namespace</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->沒有提供描述。</span></td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->沒有提供描述。</span></td>
</tr>
<tr><td><code>credentialHash</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
CredentialHash is a SHA-256 retrieved by hashing the image pull credentials
content of the secret specified by the UID/Namespace/Name coordinates.
-->
<code>credentialHash</code> 是通過對映像檔拉取憑據的內容進行哈希計算獲得的 SHA-256 值，
這些憑據由 UID/命名空間/名稱座標指定的 Secret 提供。
</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullServiceAccount`     {#kubelet-config-k8s-io-v1alpha1-ImagePullServiceAccount}
    
<!--
**Appears in:**
-->
**出現在：**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials)

<p>
<!--
ImagePullServiceAccount is a representation of a Kubernetes service account object coordinates
for which the kubelet sent service account token to the credential provider plugin for image pull credentials.
-->
ImagePullServiceAccount 是 Kubernetes 服務賬號對象座標的表示，
kubelet 將服務賬號令牌發送給憑據提供程序以用於拉取映像檔的憑據。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->資源對象的唯一標識（UID）。</span></td>
</tr>
<tr><td><code>namespace</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->資源對象所在名字空間。</span></td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->資源對象的名稱。</span></td>
</tr>
</tbody>
</table>
