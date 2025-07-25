---
title: kube-apiserver 配置 (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
---
<!--
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
-->

<!--
<p>Package v1 is the v1 version of the API.</p>
-->
<p>v1 包中包含 API 的 v1 版本。</p>

<!--
## Resource Types
-->
## 资源类型

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)
- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

## `AdmissionConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionConfiguration}

<!--
<p>AdmissionConfiguration provides versioned configuration for admission controllers.</p>
-->
<p>AdmissionConfiguration 为准入控制器提供版本化的配置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>

<tr><td><code>plugins</code><br/>
<a href="#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
  <!--
   <p>Plugins allows specifying a configuration per admission control plugin.</p>
   -->
  <p><code>plugins</code> 字段允许为每个准入控制插件设置配置选项。</p>
</td>
</tr>

</tbody>
</table>

## `AuthorizationConfiguration`     {#apiserver-config-k8s-io-v1-AuthorizationConfiguration}

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AuthorizationConfiguration</code></td></tr>

<tr><td><code>authorizers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AuthorizerConfiguration"><code>[]AuthorizerConfiguration</code></a>
</td>
<td>
<p>
<!--
Authorizers is an ordered list of authorizers to
authorize requests against.
This is similar to the --authorization-modes kube-apiserver flag
Must be at least one.
-->
<code>authorizers</code> 是用于针对请求进行鉴权的鉴权组件的有序列表。
这类似于 `--authorization-modes` kube-apiserver 标志。
必须至少包含一个元素。
</p>
</td>
</tr>
</tbody>
</table>

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}

<p>
<!--
EncryptionConfiguration stores the complete configuration for encryption providers.
It also allows the use of wildcards to specify the resources that should be encrypted.
Use '&ast;.&lt;group&gt;' to encrypt all resources within a group or '&ast;.&ast;' to encrypt all resources.
'&ast;.' can be used to encrypt all resource in the core group.  '&ast;.&ast;' will encrypt all
resources, even custom resources that are added after API server start.
Use of wildcards that overlap within the same resource list or across multiple
entries are not allowed since part of the configuration would be ineffective.
Resource lists are processed in order, with earlier lists taking precedence.
-->
EncryptionConfiguration 存储加密驱动的完整配置。它还允许使用通配符来指定应该被加密的资源。
使用 “&ast;.&lt;group&gt;” 以加密组内的所有资源，或使用 “&ast;.&ast;” 以加密所有资源。
“&ast;.” 可用于加密核心组中的所有资源。“&ast;.&ast;” 将加密所有资源，包括在 API 服务器启动后添加的自定义资源。
由于部分配置可能无效，所以不允许在同一资源列表中或跨多个条目使用重叠的通配符。
资源列表被按顺序处理，会优先处理较早的列表。
</p>
<p>
<!--
Example:
-->
示例：
</p>
<!--
- identity: {}  # do not encrypt events even though *.* is specified below
-->
<pre><code>kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
resources:
- resources:
  - events
  providers:
  - identity: {}  # 即使以下 *.* 被指定，也不会对事件加密
- resources:
  - secrets
  - configmaps
  - pandas.awesome.bears.example
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: c2VjcmV0IGlzIHNlY3VyZQ==
- resources:
  - '*.apps'
  providers:
  - aescbc:
      keys:
      - name: key2
        secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
- resources:
  - '*.*'
  providers:
  - aescbc:
      keys:
      - name: key3
        secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
</code></pre>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EncryptionConfiguration</code></td></tr>
  
<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   resources is a list containing resources, and their corresponding encryption providers.
   -->
   resources 是一个包含资源及其对应加密驱动的列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `AESConfiguration`     {#apiserver-config-k8s-io-v1-AESConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p>
<!--
AESConfiguration contains the API configuration for an AES transformer.
-->
AESConfiguration 包含针对 AES 转换器的 API 配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>
   <!--
   keys is a list of keys to be used for creating the AES transformer.
   Each key has to be 32 bytes long for AES-CBC and 16, 24 or 32 bytes for AES-GCM.
   -->
   keys 是一个用于创建 AES 转换器的密钥列表。
   对于 AES-CBC，每个密钥的长度必须是 32 字节；
   对于 AES-GCM，每个密钥的长度可以是 16、24 或 32 字节。
</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)

<!--
<p>AdmissionPluginConfiguration provides the configuration for a single plug-in.</p>
-->
<p>AdmissionPluginConfiguration 为某个插件提供配置信息。</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
   <p>Name is the name of the admission controller.
It must match the registered admission plugin name.</p>
  -->
  <p><code>name</code> 是准入控制器的名称。它必须与所注册的准入插件名称匹配。</p>
</td>
</tr>

<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
  <!--
  <p>Path is the path to a configuration file that contains the plugin's
configuration</p>
  -->
  <p><code>path</code> 是指向包含插件配置信息的配置文件的路径。</p>
</td>
</tr>

<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
  <!--
   <p>Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.</p>
  -->
  <p><code>configuration</code> 是一个内嵌的配置对象，用来保存插件的配置信息。
  如果存在，则使用这里的配置信息而不是指向配置文件的路径。</p>
</td>
</tr>

</tbody>
</table>

## `AuthorizerConfiguration`     {#apiserver-config-k8s-io-v1-AuthorizerConfiguration}
   
<!--
**Appears in:**
-->
**出现在：**

- [AuthorizationConfiguration](#apiserver-config-k8s-io-v1-AuthorizationConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Type refers to the type of the authorizer
&quot;Webhook&quot; is supported in the generic API server
Other API servers may support additional authorizer
types like Node, RBAC, ABAC, etc.
-->
<code>type</code> 指的是鉴权组件的类型。
通用 API 服务器支持 &quot;Webhook&quot;。
其他 API 服务器可能支持额外的鉴权组件类型，如 Node、RBAC、ABAC 等。
</p>
</td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Name used to describe the webhook
This is explicitly used in monitoring machinery for metrics
Note: Names must be DNS1123 labels like <code>myauthorizername</code> or
subdomains like <code>myauthorizer.example.domain</code>
Required, with no default
-->
<code>name</code> 用于描述 Webhook。
此字段的明确用途是供监控机制中的指标使用。
注意：<code>name</code> 值必须是 DNS1123 标签，如 <code>myauthorizername</code> 或子域名，
如 <code>myauthorizer.example.domain</code>。
必需，无默认值。
</p>
</td>
</tr>
<tr><td><code>webhook</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
<p>
<!--
Webhook defines the configuration for a Webhook authorizer
Must be defined when Type=Webhook
Must not be defined when Type!=Webhook
-->
<code>webhook</code> 定义 Webhook 鉴权组件的配置。
当 <code>type</code> 为 Webhook 时，必须定义。
当 <code>type</code> 不是 Webhook 时，不得定义。
</p>
</td>
</tr>
</tbody>
</table>

## `IdentityConfiguration`     {#apiserver-config-k8s-io-v1-IdentityConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p>
<!--
IdentityConfiguration is an empty struct to allow identity transformer in provider configuration.
-->
IdentityConfiguration 是一个空结构体，允许在驱动配置中使用身份转换器。
</p>

## `KMSConfiguration`     {#apiserver-config-k8s-io-v1-KMSConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p>
<!--
KMSConfiguration contains the name, cache size and path to configuration file for a KMS based envelope transformer.
-->
KMSConfiguration 包含 KMS 型信封转换器所用的配置文件的名称、缓存大小和路径。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   apiVersion of KeyManagementService
   -->
   KeyManagementService 的 apiVersion
   </p>
</td>
</tr>
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the name of the KMS plugin to be used.
   -->
   name 是要使用的 KMS 插件的名称。
   </p>
</td>
</tr>
<tr><td><code>cachesize</code><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!--
   cachesize is the maximum number of secrets which are cached in memory. The default value is 1000.
   Set to a negative value to disable caching. This field is only allowed for KMS v1 providers.
   -->
   cachesize 是内存中缓存的最大 Secret 数量。默认值为 1000。
   设置为负值将禁用缓存。此字段仅允许用于 KMS v1 驱动。
</p>
</td>
</tr>
<tr><td><code>endpoint</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   endpoint is the gRPC server listening address, for example &quot;unix:///var/run/kms-provider.sock&quot;.
   -->
   endpoint 是 gRPC 服务器的监听地址，例如 "unix:///var/run/kms-provider.sock"。
   </p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!--
   timeout for gRPC calls to kms-plugin (ex. 5s). The default is 3 seconds.
   -->
   timeout 是 gRPC 调用到 KMS 插件的超时时间（例如 5s）。默认值为 3 秒。
   </p>
</td>
</tr>
</tbody>
</table>

## `Key`     {#apiserver-config-k8s-io-v1-Key}

<!--
**Appears in:**
-->
**出现在：**

- [AESConfiguration](#apiserver-config-k8s-io-v1-AESConfiguration)
- [SecretboxConfiguration](#apiserver-config-k8s-io-v1-SecretboxConfiguration)

<p>
<!--
Key contains name and secret of the provided key for a transformer.
-->
Key 包含为转换器所提供的密钥的名称和 Secret。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the name of the key to be used while storing data to disk.
   -->
   name 是在将数据存储到磁盘时所使用的密钥名称。
   </p>
</td>
</tr>
<tr><td><code>secret</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   secret is the actual key, encoded in base64.
   -->
   secret 是实际的密钥，以 base64 编码。
   </p>
</td>
</tr>
</tbody>
</table>

## `ProviderConfiguration`     {#apiserver-config-k8s-io-v1-ProviderConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [ResourceConfiguration](#apiserver-config-k8s-io-v1-ResourceConfiguration)

<p>
<!--
ProviderConfiguration stores the provided configuration for an encryption provider.
-->
ProviderConfiguration 存储为加密驱动提供的配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>aesgcm</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   aesgcm is the configuration for the AES-GCM transformer.
   -->
   aesgcm 是 AES-GCM 转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>aescbc</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   aescbc is the configuration for the AES-CBC transformer.
   -->
   aescbc 是 AES-CBC 转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>secretbox</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   secretbox is the configuration for the Secretbox based transformer.
   -->
   secretbox 是基于 Secretbox 的转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>identity</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   identity is the (empty) configuration for the identity transformer.
   -->
   identity 是身份转换器的（空）配置。
   </p>
</td>
</tr>
<tr><td><code>kms</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   kms contains the name, cache size and path to configuration file for a KMS based envelope transformer.
   -->
   kms 包含 KMS 型信封转换器所用的配置文件的名称、缓存大小和路径。
   </p>
</td>
</tr>
</tbody>
</table>

## `ResourceConfiguration`     {#apiserver-config-k8s-io-v1-ResourceConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

<p>
<!--
ResourceConfiguration stores per resource configuration.
-->
ResourceConfiguration 存储每个资源的配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>resources</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   resources is a list of kubernetes resources which have to be encrypted. The resource names are derived from <code>resource</code> or <code>resource.group</code> of the group/version/resource.
eg: pandas.awesome.bears.example is a custom resource with 'group': awesome.bears.example, 'resource': pandas.
Use '&ast;.&ast;' to encrypt all resources and '&ast;.&lt;group&gt;' to encrypt all resources in a specific group.
eg: '&ast;.awesome.bears.example' will encrypt all resources in the group 'awesome.bears.example'.
eg: '&ast;.' will encrypt all resources in the core group (such as pods, configmaps, etc).
   -->
   resources 是一个需要加密的 Kubernetes 资源列表。
   资源名称来源于组/版本/资源的 “<code>resource</code>” 或 “<code>resource.group</code>”。
   例如，pandas.awesome.bears.example 是一个自定义资源，其 “group” 为 awesome.bears.example，
   “resource” 为 pandas。使用 “&ast;.&ast;” 以加密所有资源，使用 “&ast;.&lt;group&gt;” 以加密特定组中的所有资源。
   例如，“&ast;.awesome.bears.example” 将加密 “awesome.bears.example” 组中的所有资源。
   再比如，“&ast;.” 将加密核心组中的所有资源（如 Pod、ConfigMap 等）。
</p>
</td>
</tr>
<tr><td><code>providers</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   providers is a list of transformers to be used for reading and writing the resources to disk.
   eg: aesgcm, aescbc, secretbox, identity, kms.
   -->
   providers 是从磁盘读取资源和写入资源到磁盘要使用的转换器的列表。
   例如：aesgcm、aescbc、secretbox、identity、kms。
  </p>
</td>
</tr>
</tbody>
</table>

## `SecretboxConfiguration`     {#apiserver-config-k8s-io-v1-SecretboxConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p>
<!--
SecretboxConfiguration contains the API configuration for an Secretbox transformer.
-->
SecretboxConfiguration 包含 Secretbox 转换器的 API 配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>
   <!--
   keys is a list of keys to be used for creating the Secretbox transformer.
   Each key has to be 32 bytes long.
   -->
   keys 是一个用于创建 Secretbox 转换器的密钥列表。每个密钥的长度必须为 32 字节。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#apiserver-config-k8s-io-v1-WebhookConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AuthorizerConfiguration](#apiserver-config-k8s-io-v1-AuthorizerConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>authorizedTTL</code> <B><!-- [Required] -->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
The duration to cache 'authorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-authorized-ttl</code> flag
Default: 5m0s
-->
用于缓存来自 Webhook 鉴权组件的 'authorized' 响应的持续时间。
与设置 <code>--authorization-webhook-cache-authorized-ttl</code> 标志效果相同。
默认值：5m0s。
</p>
</td>
</tr>
<tr><td><code>unauthorizedTTL</code> <B><!-- [Required] -->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
The duration to cache 'unauthorized' responses from the webhook
authorizer.
Same as setting <code>--authorization-webhook-cache-unauthorized-ttl</code> flag
Default: 30s
-->
用于缓存来自 Webhook 鉴权组件的 'unauthorized' 响应的持续时间。
与设置 <code>--authorization-webhook-cache-unauthorized-ttl</code> 标志效果相同。
默认值：30s。
</p>
</td>
</tr>
<tr><td><code>timeout</code> <B><!-- [Required] -->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
Timeout for the webhook request
Maximum allowed value is 30s.
Required, no default value.
-->
Webhook 请求的超时时间。
最大允许值为 30s。
必需，无默认值。
</p>
</td>
</tr>
<tr><td><code>subjectAccessReviewVersion</code> <B><!-- [Required] -->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
The API version of the authorization.k8s.io SubjectAccessReview to
send to and expect from the webhook.
Same as setting <code>--authorization-webhook-version</code> flag
Valid values: v1beta1, v1
Required, no default value
-->
发送到 Webhook 并期望从 Webhook 接收到的 authorization.k8s.io SubjectAccessReview 的 API 版本。
与设置 <code>--authorization-webhook-version</code> 标志效果相同。
有效值：v1beta1、v1。
必需，无默认值。
</p>
</td>
</tr>
<tr><td><code>matchConditionSubjectAccessReviewVersion</code> <B><!-- [Required] -->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
version the CEL expressions are evaluated against
Valid values: v1
Required, no default value
-->
<code>matchConditionSubjectAccessReviewVersion</code> 指定了 CEL 表达式求值所用的 SubjectAccessReview 版本。
有效值：v1。
必需，无默认值。
</p>
</td>
</tr>
<tr><td><code>failurePolicy</code> <B><!-- [Required] -->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Controls the authorization decision when a webhook request fails to
complete or returns a malformed response or errors evaluating
matchConditions.
Valid values:
-->
控制当 Webhook 请求未能完成、返回格式错误的响应或在评估 matchConditions 时发生错误的情况下鉴权决策。
有效值：
</p>
<ul>
<li>
<!--
NoOpinion: continue to subsequent authorizers to see if one of
them allows the request
-->
NoOpinion：继续处理后续的鉴权组件以查看它们中是否有一个允许请求。
</li>
<li>
<!--
Deny: reject the request without consulting subsequent authorizers
Required, with no default.
-->
Deny：拒绝请求，不咨询后续鉴权组件。
必需，无默认值。
</li>
</ul>
</td>
</tr>
<tr><td><code>connectionInfo</code> <B><!-- [Required] -->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookConnectionInfo"><code>WebhookConnectionInfo</code></a>
</td>
<td>
<p>
<!--
ConnectionInfo defines how we talk to the webhook
-->
<code>connectionInfo</code> 定义了我们如何与 Webhook 进行通信。
</p>
</td>
</tr>
<tr><td><code>matchConditions</code> <B><!-- [Required] -->[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-WebhookMatchCondition"><code>[]WebhookMatchCondition</code></a>
</td>
<td>
<p>
<!--
matchConditions is a list of conditions that must be met for a request to be sent to this
webhook. An empty list of matchConditions matches all requests.
There are a maximum of 64 match conditions allowed.
-->
<code>matchConditions</code> 是请求发送到此 Webhook 之前必须满足的一系列条件。
空的 <code>matchConditions</code> 列表匹配所有请求。
最多允许 64 个匹配条件。
</p>
<p>
<!--
The exact matching logic is (in order):
-->
精确的匹配逻辑（按顺序）是：
</p>
<ol>
<!--
<li>If at least one matchCondition evaluates to FALSE, then the webhook is skipped.</li>
<li>If ALL matchConditions evaluate to TRUE, then the webhook is called.</li>
<li>If at least one matchCondition evaluates to an error (but none are FALSE):
<ul>
<li>If failurePolicy=Deny, then the webhook rejects the request</li>
<li>If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped</li>
</ul>
</li>
-->
<li>如果至少一个 <code>matchConditions</code> 元素的计算结果为 FALSE，则跳过此 Webhook。</li>
<li>如果所有 <code>matchConditions</code> 元素的计算结果都为 TRUE，则调用此 Webhook。</li>
<li>如果至少一个 <code>matchConditions</code> 元素的计算结果为出错（但没有 FALSE）：
<ul>
<li>如果 <code>failurePolicy</code> 为 Deny，则 Webhook 拒绝请求。</li>
<li>如果 <code>failurePolicy</code> 为 NoOpinion，则忽略错误并跳过此 Webhook。</li>
</ul>
</li>
</ol>
</td>
</tr>
</tbody>
</table>

## `WebhookConnectionInfo`     {#apiserver-config-k8s-io-v1-WebhookConnectionInfo}

**Appears in:**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>type</code> <B><!-- [Required] -->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Controls how the webhook should communicate with the server.
Valid values:
-->
控制 Webhook 应如何与服务器通信。
有效值：
</p>
<ul>
<!--
<li>KubeConfigFile: use the file specified in kubeConfigFile to locate the
server.</li>
<li>InClusterConfig: use the in-cluster configuration to call the
SubjectAccessReview API hosted by kube-apiserver. This mode is not
allowed for kube-apiserver.</li>
-->
<ul>
<li>KubeConfigFile：使用 kubeConfigFile 中指定的文件来定位服务器。</li>
<li>InClusterConfig：使用集群内配置调用由 kube-apiserver 上的 SubjectAccessReview API。
此模式不允许用于 kube-apiserver。</li>
</ul>
</ul>
</td>
</tr>
<tr><td><code>kubeConfigFile</code> <B><!-- [Required] -->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Path to KubeConfigFile for connection info
Required, if connectionInfo.Type is KubeConfig
-->
KubeConfig 文件的路径，用于获取连接信息。
如果 <code>connectionInfo.type</code> 是 KubeConfig，则必需。
</p>
</td>
</tr>
</tbody>
</table>

## `WebhookMatchCondition`     {#apiserver-config-k8s-io-v1-WebhookMatchCondition}

<!--
**Appears in:**
-->
**出现在：**

- [WebhookConfiguration](#apiserver-config-k8s-io-v1-WebhookConfiguration)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>expression</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
the contents would be converted to the v1 version before evaluating the CEL expression.
-->
<code>expression</code> 表示将由 CEL 求值的表达式。求值结果必须是布尔值。
CEL 表达式可以访问 v1 版本中的 SubjectAccessReview 的内容。
如果请求变量中指定的 <code>subjectAccessReviewVersion</code> 是 v1beta1，
则在对 CEL 表达式求值之前，其内容会被转换为 v1 版本。
</p>
<ul>
<!--
<li>'resourceAttributes' describes information for a resource access request and is unset for non-resource requests. e.g. has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</li>
<li>'nonResourceAttributes' describes information for a non-resource access request and is unset for resource requests. e.g. has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'.</li>
<li>'user' is the user to test for. e.g. request.user == 'alice'</li>
<li>'groups' is the groups to test for. e.g. ('group1' in request.groups)</li>
<li>'extra' corresponds to the user.Info.GetExtra() method from the authenticator.</li>
<li>'uid' is the information about the requesting user. e.g. request.uid == '1'</li>
-->
<li>'resourceAttributes' 描述了资源访问请求的信息，在非资源请求中未设置。例如：<code>has(request.resourceAttributes) &amp;&amp; request.resourceAttributes.namespace == 'default'</code>。
</li>
<li>'nonResourceAttributes' 描述了非资源访问请求的信息，在资源请求中未设置。例如：
<code>has(request.nonResourceAttributes) &amp;&amp; request.nonResourceAttributes.path == '/healthz'</code>。
</li>
<li>'user' 是要测试的用户。例如：<code>request.user == 'alice'</code>。</li>
<li>'groups' 是要测试的组。例如：<code>('group1' in request.groups)</code>。</li>
<li>'extra' 对应于身份验证器中的 <code>user.Info.GetExtra()</code> 方法。</li>
<li>'uid' 是关于请求用户的详细信息。例如：<code>request.uid == '1'</code>。</li>
</ul>
<p>
<!--
Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
-->
关于 CEL 的文档：https://kubernetes.io/docs/reference/using-api/cel/
</p>
</td>
</tr>
</tbody>
</table>
