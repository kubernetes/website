---
title: Kubelet 配置（v1alpha1）
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


- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
-->
## 资源类型 {#resource-types}

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

<!--
## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}
-->
## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}

<!--
<p>CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.</p>
-->
<p>CredentialProviderConfig 是包含有关每个 exec 凭据提供程序信息的配置。
Kubelet 从磁盘读取此配置并启用 CredentialProvider 类型指定的每个提供程序。</p>

<!--
<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
-->
<table class="table">
<thead><tr><th width="30%">字段</th><th>描述</th></tr></thead>
<tbody>

<!--
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
-->
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>

<!--
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is used.</p>
</td>
</tr>
</tbody>
</table>
-->
<tr><td><code>providers</code> <B>[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers 是将由 Kubelet 启用的凭据提供程序插件列表。
多个 providers 可能与单个镜像匹配，在这种情况下，来自所有提供者的凭据将返回到 Kubelet。
如果为单个镜像调用多个提供程序，则结果将合并。
如果 providers 返回重叠的身份验证键，则使用此列表中较早的 Provider。</p>
</td>
</tr>
</tbody>
</table>

<!--
## `CredentialProvider`     {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}
    

**Appears in:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
-->
## `CredentialProvider`     {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}
   
**出现在：**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

<!--
<p>CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).</p>
-->
<p>CredentialProvider 代表一个由 Kubelet 调用的 exec 插件。 
该插件仅当被拉取的镜像与插件处理的镜像匹配时调用（参见 matchImages）。</p>

<!--
<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the required name of the credential provider. It must match the name of the
provider executable as seen by the kubelet. The executable must be in the kubelet's
bin directory (set by the --image-credential-provider-bin-dir flag).</p>
</td>
-->
<table class="table">
<thead><tr><th width="30%">字段</th><th>描述</th></tr></thead>
<tbody>
<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>name 是凭据提供程序的必需名称。它必须与 Kubelet 看到的提供程序的可执行文件名称相匹配。
   该可执行文件必须位于 Kubelet 的 bin 目录中（由 --image-credential-provider-bin-dir 标志设置）。</p>
</td>

<!--
</tr>
<tr><td><code>matchImages</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.</p>
-->
</tr>
<tr><td><code>matchImages</code> <B>[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages 是一个必填的字符串列表，用于匹配镜像以确定是否应调用此提供程序。
如果其中一个字符串与来自 Kubelet 的请求镜像匹配，则将调用插件并有机会提供凭据。
镜像应包含仓库的域名和 URL 路径。</p>

<!--
<p>Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '<em>.k8s.io' or 'k8s.</em>.io', and top-level-domains such as 'k8s.<em>'.
Matching partial subdomains like 'app</em>.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so *.io does not match *.k8s.io.</p>
<p>A match exists between an image and a matchImage when all of the below are true:</p>
-->
<p>matchImages 中的每个条目都是一个模式，可以选择包含一个端口和一个路径。
域名中可以使用 Glob 模式字符串，但不能在端口或路径中使用
使用 Glob 作为子域名也是支持的，如 “*.k8s.io” 或 “k8s.*.io”，以及顶级域，如 “k8s.*”。
支持匹配部分子域，如 “app*.k8s.io”。每个 Glob 只能匹配单个子域段，因此 '*.io' 不匹配 '*.k8s.io'。</p>
<p>当以下所有条件都为真时，镜像和 matchImage 之间存在匹配：</p>

<!--
<ul>
<li>Both contain the same number of domain parts and each part matches.</li>
<li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
<li>If the imageMatch contains a port, then the port must match in the image as well.</li>
</ul>
<p>Example values of matchImages:</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>*.azurecr.io</li>
<li>gcr.io</li>
<li><em>.</em>.registry.io</li>
<li>registry.io:8080/path</li>
</ul>
</td>
</tr>
-->
<ul>
<li>两者都包含相同数量的域名组成部分，并且每个部分都匹配。</li>
<li>imageMatch 的 URL 路径必须是目标镜像 URL 路径的前缀。</li>
<li>如果 imageMatch 包含一个端口，那么该端口也必须与镜像匹配。</li>
</ul>
<p>matchImages 的示例值：</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>*.azurecr.io</li>
<li>gcr.io</li>
<li>*.registry.io</li>
<li>registry.io:8080/path</li>
</ul>
</td>
</tr>

<!--
<tr><td><code>defaultCacheDuration</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>defaultCacheDuration is the default duration the plugin will cache credentials in-memory
if a cache duration is not provided in the plugin response. This field is required.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
-->
<tr><td><code>defaultCacheDuration</code> <B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>defaultCacheDuration 是如果插件响应中未提供缓存持续时间，插件将在内存中缓存凭据的默认持续时间。这是必填字段。</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B>[必需]</B><br/>
<code>string</code>
</td>

<!--
<td>
   <p>Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
MUST use the same encoding version as the input. Current supported values are:</p>
<ul>
<li>credentialprovider.kubelet.k8s.io/v1alpha1</li>
</ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Arguments to pass to the command when executing it.</p>
</td>
</tr>
-->
<td>
   <p>exec CredentialProviderRequest 请求必填的输入版本。
返回的 CredentialProviderResponse 必须使用与输入相同的编码版本。当前支持的值为：</p>
<ul>
<li>credentialprovider.kubelet.k8s.io/v1alpha1</li>
</ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>执行命令时传递的参数。</p>
</td>
</tr>

<!--
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.</p>
</td>
</tr>
</tbody>
</table>
-->
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env 定义了暴露给进程的额外的环境变量。这些变量与主机环境以及 client-go 用来向插件传递参数的变量结合在一起。</p>
</td>
</tr>
</tbody>
</table>

<!--
## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}
    

**Appears in:**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)
-->
## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}
    

**出现在：**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)

<!--
<p>ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.</p>
-->
<p>ExecEnvVar 用于在执行基于 exec 的凭证插件时设置环境变量。</p>

<!--
<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
-->
<table class="table">
<thead><tr><th width="30%">字段</th><th>描述</th></tr></thead>
<tbody>

<!--
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>value</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>
-->
<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">未提供描述。</span></td>
</tr>
<tr><td><code>value</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">未提供描述。</span></td>
</tr>
</tbody>
</table>
    
<!--
## `FormatOptions`     {#FormatOptions}
    

**Appears in:**
-->
## `FormatOptions`     {#FormatOptions}


**出现在：**

<!--
<p>FormatOptions contains options for the different logging formats.</p>
-->
<p>FormatOptions 包含不同日志记录格式的选项。</p>

<!--
<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
-->
<table class="table">
<thead><tr><th width="30%">字段</th><th>描述</th></tr></thead>
<tbody>
    
<!--
<tr><td><code>json</code> <B>[Required]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   <p>[Experimental] JSON contains options for logging format &quot;json&quot;.</p>
</td>
</tr>
</tbody>
</table>
-->
<tr><td><code>json</code> <B>[必需]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
    <p>[实验特性] JSON 包含日志格式 &quot;json&quot; 对应的选项。</p>
</td>
</tr>
</tbody>
</table>

<!--
## `JSONOptions`     {#JSONOptions}
    

**Appears in:**

- [FormatOptions](#FormatOptions)
-->
## `JSONOptions`     {#JSONOptions}
    

**出现在：**

- [FormatOptions](#FormatOptions)

<!--
<p>JSONOptions contains options for logging format &quot;json&quot;.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
-->
<p>JSONOptions 包含日志格式 &quot;json&quot; 对应的选项。</p>


<table class="table">
<thead><tr><th width="30%">字段</th><th>描述</th></tr></thead>
<tbody>
    
<!--
<tr><td><code>splitStream</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>[Experimental] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering.</p>
</td>
-->
<tr><td><code>splitStream</code> <B>[必需]</B><br/>
<code>bool</code>
</td>
<td>
    <p>[实验特性] SplitStream 将错误消息重定向到 stderr，而提示消息通过缓冲发送到 stdout。
   默认是将错误与提示消息都输出到 stdout，且不提供缓存。</p>
</td>

<!--
</tr>
<tr><td><code>infoBufferSize</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   <p>[Experimental] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.</p>
</td>
</tr>
</tbody>
</table>
-->
</tr>
<tr><td><code>infoBufferSize</code> <B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   <p>[实验特性] InfoBufferSize 设置使用拆分流时信息流的大小。默认为零，即禁用缓冲。</p>
</td>
</tr>
</tbody>
</table>

<!--
## `VModuleConfiguration`     {#VModuleConfiguration}
    
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)

**Appears in:**
-->
## `VModuleConfiguration`     {#VModuleConfiguration}
    
(`[]k8s.io/component-base/config/v1alpha1.VModuleItem` 的别名)

**出现在：**

<!--
<p>VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.</p>
-->
<p>VModuleConfiguration 是单个文件名或模式以及相应的详细程度阈值的集合。</p>


