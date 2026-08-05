---
title: kubelet 配置 (v1alpha1)
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
## 资源类型

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}

<!--
CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.
-->
CredentialProviderConfig 包含有关每个 exec 凭据提供者的配置信息。
kubelet 从磁盘上读取这些配置信息，并根据 CredentialProvider 类型启用各个提供者。

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
<code>providers</code> 是一组凭据提供者插件，这些插件会被 kubelet 启用。
多个提供者可以匹配到同一镜像上，这时，来自所有提供者的凭据信息都会返回给 kubelet。
如果针对同一镜像调用了多个提供者，则结果会被组合起来。如果提供者返回的认证主键有重复，
列表中先出现的提供者所返回的值将第一个被尝试使用。
</td>
</tr>
</tbody>
</table>

## `ImagePullIntent`     {#kubelet-config-k8s-io-v1alpha1-ImagePullIntent}

<p>
<!--
ImagePullIntent is a record of the kubelet attempting to pull an image.
-->
<code>ImagePullIntent</code> 是 kubelet 尝试拉取镜像的记录。
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
<code>image</code> 是容器 <code>image</code> 字段中的镜像规约。
文件名是此值的 SHA-256 哈希，这样做是为了避免文件名中不安全的字符，如 ':' 和 '/'。
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
<code>ImagePullRecord</code> 是 kubelet 拉取的镜像的记录。
</p>
<p>
<!--
If there are no records in the <code>kubernetesSecrets</code> field and both <code>nodeWideCredentials</code>
and <code>anonymous</code> are <code>false</code>, credentials must be re-checked the next time an
image represented by this record is being requested.
-->
如果 <code>kubernetesSecrets</code> 字段中没有记录，且 <code>nodeWideCredentials</code>
和 <code>anonymous</code> 均为 <code>false</code>，则当请求此记录表示的镜像时，必须重新检查凭据。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePulledRecord</code></td></tr>

<tr><td><code>lastUpdatedTime</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
<p>
<!--
LastUpdatedTime is the time of the last update to this record
-->
<code>lastUpdatedTime</code> 是此记录上次更新的时间。
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
<code>imageRef</code> 是从 CRI 接收到的此文件所代表的镜像的引用。
文件名是此值的 SHA-256 哈希。这是为了避免文件名中不安全的字符，如 ':' 和 '/'。
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
<code>credentialMapping</code> 将 <code>image</code> 映射到之前拉取它时使用的凭据集。
这里的 <code>image</code> 是 Pod 的容器中 <code>image</code> 字段的内容，
已去除其标签/摘要。
</p>
<p>
<!--
Example:
Container requests the <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> image:
-->
示例：
容器请求 <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> 镜像：
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
**出现在：**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
- [ImagePullIntent](#kubelet-config-k8s-io-v1alpha1-ImagePullIntent)
- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)

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
<p>
<!--
name is the required name of the credential provider. It must match the name of the
provider executable as seen by the kubelet. The executable must be in the kubelet's
bin directory (set by the --image-credential-provider-bin-dir flag).
Required to be unique across all providers.
-->
<code>name</code> 是凭据提供者的名称（必需）。此名称必须与 kubelet
所看到的提供者可执行文件的名称匹配。可执行文件必须位于 kubelet 的
<code>bin</code> 目录（通过 <code>--image-credential-provider-bin-dir</code> 设置）下。
必须在所有提供商之间保持唯一。
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
<code>matchImages</code> 是一个必须设置的字符串列表，用来匹配镜像以便确定是否要调用此提供者。
如果字符串之一与 kubelet 所请求的镜像匹配，则此插件会被调用并给予提供凭证的机会。
镜像应该包含镜像库域名和 URL 路径。
</p>
<p>
<!--
Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like <code>*.k8s.io</code> or <code>k8s.*.io</code>, and top-level-domains such as <code>k8s.*</code>.
-->
<code>matchImages</code> 中的每个条目都是一个模式字符串，其中可以包含端口号和路径。
域名部分可以包含统配符，但端口或路径部分不可以。通配符可以用作子域名，例如
<code>*.k8s.io</code> 或 <code>k8s.*.io</code>，以及 <code>k8s.*</code> 这类顶级域名。
</p>
<p>
<!--
Matching partial subdomains like <code>app*.k8s.io</code> is also supported. Each glob can only match
a single subdomain segment, so <code>*.io</code> does not match <code>*.k8s.io</code>.
-->
对类似 <code>app*.k8s.io</code> 这类部分子域名的匹配也是支持的。
每个通配符只能用来匹配一个子域名段，所以 <code>*.io</code> 不会匹配 <code>*.k8s.io</code>。
</p>
<p>
<!--
A match exists between an image and a matchImage when all of the below are true:
-->
镜像与 <code>matchImages</code> 之间存在匹配时，以下条件都要满足：
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
  <li>二者均包含相同个数的域名部分，并且每个域名部分都对应匹配；</li>
  <li><code>matchImages</code> 条目中的 URL 路径部分必须是目标镜像的 URL 路径的前缀；</li>
  <li>如果 <code>matchImages</code> 条目中包含端口号，则端口号也必须与镜像端口号匹配。</li>
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
   <code>defaultCacheDuration</code> 是插件在内存中缓存凭据的默认时长，
在插件响应中没有给出缓存时长时，使用这里设置的值。此字段是必需的。
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
  要求 exec 插件 CredentialProviderRequest 请求的输入版本。
  所返回的 CredentialProviderResponse 必须使用与输入相同的编码版本。当前支持的值有：
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
在执行插件可执行文件时要传递给命令的参数。
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
<code>env</code> 定义要提供给插件进程的额外的环境变量。
这些环境变量会与主机上的其他环境变量以及 client-go 所使用的环境变量组合起来，
一起传递给插件。
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}

<!--
**Appears in:**
-->
**出现在：**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)

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
   <!-- span class="text-muted">No description provided.</span -->
  环境变量名称。
</td>
</tr>

<tr><td><code>value</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- span class="text-muted">No description provided.</span-->
  环境变量取值。
</td>
</tr>
</tbody>
</table>

## `ImagePullCredentials`     {#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials}

<!--
**Appears in:**
-->
**出现在：**

- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)

<p>
<!--
ImagePullCredentials describe credentials that can be used to pull an image.
-->
<code>ImagePullCredentials</code> 描述可以用于拉取镜像的凭据。
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
<code>kuberneteSecretCoordinates</code> 是用于拉取镜像的所有 Kubernetes
Secret 的坐标索引。
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
<code>kubernetesServiceAccounts</code> 是用于拉取镜像的所有 Kubernetes
服务账号的坐标索引。
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
<code>nodePodsAccessible</code> 是一个标志，表示节点上的所有 Pod 都可以访问拉取凭据，
或者拉取不需要凭据。
</p>
<p>
<!--
If true, it is mutually exclusive with the <code>kubernetesSecrets</code> field.
-->
如果为 true，则与 <code>kubernetesSecrets</code> 字段互斥。
</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullSecret`     {#kubelet-config-k8s-io-v1alpha1-ImagePullSecret}

<!--
**Appears in:**
-->
**出现在：**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials)

<p>
<!--
ImagePullSecret is a representation of a Kubernetes secret object coordinates along
with a credential hash of the pull secret credentials this object contains.
-->
<code>ImagePullSecret</code> 是 Kubernetes Secret 对象坐标的表示，
以及此对象包含的拉取 Secret 凭据的哈希值。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>uid</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->没有提供描述。</span></td>
</tr>
<tr><td><code>namespace</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->没有提供描述。</span></td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted"><!--No description provided.-->没有提供描述。</span></td>
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
<code>credentialHash</code> 是通过对镜像拉取凭据的内容进行哈希计算获得的 SHA-256 值，
这些凭据由 UID/命名空间/名称坐标指定的 Secret 提供。
</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullServiceAccount`     {#kubelet-config-k8s-io-v1alpha1-ImagePullServiceAccount}
    
<!--
**Appears in:**
-->
**出现在：**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials)

<p>
<!--
ImagePullServiceAccount is a representation of a Kubernetes service account object coordinates
for which the kubelet sent service account token to the credential provider plugin for image pull credentials.
-->
ImagePullServiceAccount 是 Kubernetes 服务账号对象坐标的表示，
kubelet 将服务账号令牌发送给凭据提供程序以用于拉取镜像的凭据。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->资源对象的唯一标识（UID）。</span></td>
</tr>
<tr><td><code>namespace</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->资源对象所在名字空间。</span></td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->必需</B><br/>
<code>string</code>
</td>
<td>
 <span class="text-muted"><!--No description provided.-->资源对象的名称。</span></td>
</tr>
</tbody>
</table>
