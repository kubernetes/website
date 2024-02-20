---
title: Kubelet 配置 (v1)
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
## 资源类型

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1-CredentialProviderConfig}

<!--
CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.
-->
CredentialProviderConfig 包含有关每个 exec 凭据提供程序的配置信息。
Kubelet 从磁盘上读取这些配置信息，并根据 CredentialProvider 类型启用各个提供程序。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>

<tr><td><code>providers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubelet-config-k8s-io-v1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <!--
   providers is a list of credential provider plugins that will be enabled by the kubelet.
   Multiple providers may match against a single image, in which case credentials
   from all providers will be returned to the kubelet. If multiple providers are called
   for a single image, the results are combined. If providers return overlapping
   auth keys, the value from the provider earlier in this list is used.
   -->
   <p>
   <code>providers</code> 是一组凭据提供程序插件，这些插件会被 kubelet 启用。
   多个提供程序可以匹配到同一镜像上，这时，来自所有提供程序的凭据信息都会返回给 kubelet。
   如果针对同一镜像调用了多个提供程序，则结果会被组合起来。如果提供程序返回的认证主键有重复，
   列表中先出现的提供程序所返回的值将被使用。
   </p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider`     {#kubelet-config-k8s-io-v1-CredentialProvider}

<!--
**Appears in:**
-->
**出现在：**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)

<!--
CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).
-->
CredentialProvider 代表的是要被 kubelet 调用的一个 exec 插件。
这一插件只会在所拉取的镜像与该插件所处理的镜像匹配时才会被调用（参见 <code>matchImages</code>）。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   name is the required name of the credential provider. It must match the name of the
   provider executable as seen by the kubelet. The executable must be in the kubelet's
   bin directory (set by the --image-credential-provider-bin-dir flag).
   -->
   <p>
   <code>name</code> 是凭据提供程序的名称（必需）。此名称必须与 kubelet
   所看到的提供程序可执行文件的名称匹配。可执行文件必须位于 kubelet 的
   <code>bin</code> 目录（通过 <code>--image-credential-provider-bin-dir</code> 设置）下。
   </p>
</td>
</tr>
<tr><td><code>matchImages</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
<!--
matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.
-->
<p><code>matchImages</code> 是一个必须设置的字符串列表，用来匹配镜像以便确定是否要调用此提供程序。
如果字符串之一与 kubelet 所请求的镜像匹配，则此插件会被调用并给予提供凭据的机会。
镜像应该包含镜像库域名和 URL 路径。</p>

<!--
Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&ast;.k8s.io' or 'k8s.&ast;.io', and top-level-domains such as 'k8s.&ast;'.
Matching partial subdomains like 'app</em>.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &ast;.io does not match &ast;.k8s.io.
-->
<p><code>matchImages</code> 中的每个条目都是一个模式字符串，其中可以包含端口号和路径。
域名部分可以包含通配符，但端口或路径部分不可以。'&ast;.k8s.io' 或 'k8s.&ast;.io' 等子域名以及
'k8s.&ast;' 这类顶级域名都支持通配符。</p>
<p>对于 'app</em>.k8s.io' 这类部分子域名的匹配也是支持的。
每个通配符只能用来匹配一个子域名段，所以 &ast;.io 不会匹配 &ast;.k8s.io。</p>
<!--
A match exists between an image and a matchImage when all of the below are true:
-->
<p>镜像与 <code>matchImages</code> 之间存在匹配时，以下条件都要满足：</p>
<ul>
  <!--
  <li>Both contain the same number of domain parts and each part matches.</li>
  <li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
  <li>If the imageMatch contains a port, then the port must match in the image as well.</li>
  -->
  <li>二者均包含相同个数的域名部分，并且每个域名部分都对应匹配；</li>
  <li><code>matchImages</code> 条目中的 URL 路径部分必须是目标镜像的 URL 路径的前缀；</li>
  <li>如果 <code>matchImages</code> 条目中包含端口号，则端口号也必须与镜像端口号匹配。</li>
</ul>
<!--
Example values of matchImages:
-->
<p><code>matchImages</code> 的一些示例如下：</p>
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
   <!--
   defaultCacheDuration is the default duration the plugin will cache credentials in-memory
   if a cache duration is not provided in the plugin response. This field is required.
   -->
   <p>
   <code>defaultCacheDuration</code> 是插件在内存中缓存凭据的默认时长，
   在插件响应中没有给出缓存时长时，使用这里设置的值。此字段是必需的。
   </p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
   MUST use the same encoding version as the input. Current supported values are:
   -->
   <p>
   要求 exec 插件 CredentialProviderRequest 请求的输入版本。
   所返回的 CredentialProviderResponse 必须使用与输入相同的编码版本。当前支持的值有：
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
   <!--
   Arguments to pass to the command when executing it.
   -->
   <p>在执行插件可执行文件时要传递给命令的参数。</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <!--
   Env defines additional environment variables to expose to the process. These
   are unioned with the host's environment, as well as variables client-go uses
   to pass argument to the plugin.
   -->
   <p>
   <code>env</code> 定义要提供给插件进程的额外的环境变量。
   这些环境变量会与主机上的其他环境变量以及 client-go 所使用的环境变量组合起来，
   一起传递给插件。
   </p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1-ExecEnvVar}

<!--
**Appears in:**
-->
**出现在：**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)

<!--
ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.
-->
ExecEnvVar 用来在执行基于 exec 的凭据插件时设置环境变量。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- No description provided. -->
   <span class="text-muted">环境变量名称</span></td>
</tr>
<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- No description provided. -->
   <span class="text-muted">环境变量取值</span></td>
</tr>
</tbody>
</table>
