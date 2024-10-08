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
        secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==</code></pre>

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
