---
title: kube-apiserver 加密配置（v1）
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---

<!--
title: kube-apiserver Encryption Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
-->

<p>
<!--
Package v1 is the v1 version of the API.
-->
包 v1 是 API 的 v1 版本。
</p>

<!--
## Resource Types
-->
## 资源类型

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}

<!--
Use '&ast;&lt;group&gt;o encrypt all resources within a group or '&ast;.&ast;' to encrypt all resources.
'&ast;.' can be used to encrypt all resource in the core group.  '&ast;.&ast;' will encrypt all
resources, even custom resources that are added after API server start.
Use of wildcards that overlap within the same resource list or across multiple
entries are not allowed since part of the configuration would be ineffective.
Resource lists are processed in order, with earlier lists taking precedence.
-->
<p>
EncryptionConfiguration 为加密驱动保存完整的配置信息。
它还允许使用通配符指定应加密的资源。
使用 <code>&ast;.&lt;group&gt;</code> 加密组内的所有资源，或使用 <code>&ast;.&ast;</code> 加密所有资源。
<code>&ast;.</code> 可用于加密核心组内的所有资源。
<code>&ast;.&ast;</code> 将加密所有资源，甚至是 API 服务器启动后添加的自定义资源。
不允许在同一资源列表内或跨多个条目中使用重叠的通配符，因为部分配置将无效。
按顺序处理资源列表，列在前面的被优先处理。
</p>
<!--
Example:
-->
<p>例如：</p>
<pre><code>kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
resources:
- resources:
  - events
  providers:
  - identity: {}  # do not encrypt events even though *.* is specified below
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
<tr><td><code>resources</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   resources is a list containing resources, and their corresponding encryption providers.
   -->
   <code>resources</code> 是一个包含资源及其对应的加密驱动的列表。
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
AESConfiguration 包含 AES 转换器的 API 配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>
   <!--
   keys is a list of keys to be used for creating the AES transformer.
   Each key has to be 32 bytes long for AES-CBC and 16, 24 or 32 bytes for AES-GCM.
   -->
   <code>keys</code> 是一组用于创建 AES 转换器的密钥。
   对于 AES-CBC，每个密钥必须是 32 字节长；对于 AES-GCM，每个密钥可以是 16、24、32 字节长。
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
IdentityConfiguration 是一个空的结构，用来支持在驱动配置中支持标识转换器。
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
KMSConfiguration 包含基于 KMS 的封套转换器的名称、缓存大小以及配置文件路径信息。
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
<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the name of the KMS plugin to be used.
   -->
   <code>name</code> 是要使用的 KMS 插件名称。
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
   <code>cachesize</code> 是可在内存中缓存的 Secret 数量上限。默认值是 1000。
   将此字段设置为负值会禁用缓存。此字段仅允许用于 KMS v1 驱动。
   </p>
</td>
</tr>
<tr><td><code>endpoint</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   endpoint is the gRPC server listening address, for example &quot;unix:///var/run/kms-provider.sock&quot;.
   -->
   <code>endpoint</code> 是 gRPC 服务器的监听地址，例如 &quot;unix:///var/run/kms-provider.sock&quot;。
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
   对 KMS 插件执行 gRPC 调用的超时时长（例如：'5s'）。默认值为 3 秒。
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
Key 中包含为某转换器所提供的键名和对应的私密数据。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   name is the name of the key to be used while storing data to disk.
   -->
   <code>name</code> 是在向磁盘中存储数据时使用的键名。
   </p>
</td>
</tr>
<tr><td><code>secret</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   secret is the actual key, encoded in base64.
   -->
   <code>secret</code> 是实际的密钥，用 base64 编码。
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
ProviderConfiguration 为加密驱动存储配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>aesgcm</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   aesgcm is the configuration for the AES-GCM transformer.
   -->
   <code>aesgcm</code> 是用于 AES-GCM 转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>aescbc</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   aescbc is the configuration for the AES-CBC transformer.
   -->
   <code>aescbc</code> 是用于 AES-CBC 转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>secretbox</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   secretbox is the configuration for the Secretbox based transformer.
   -->
   <code>secretbox</code> 是用于基于 Secretbox 的转换器的配置。
   </p>
</td>
</tr>
<tr><td><code>identity</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   identity is the (empty) configuration for the identity transformer.
   -->
   <code>identity</code> 是用于标识转换器的配置（空）。
   </p>
</td>
</tr>
<tr><td><code>kms</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   kms contains the name, cache size and path to configuration file for a KMS based envelope transformer.
   -->
   <code>kms</code> 中包含用于基于 KMS 的封套转换器的名称、缓存大小以及配置文件路径信息。
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
ResourceConfiguration 中保存资源配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>resources</code> <B>[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!--
   resources is a list of kubernetes resources which have to be encrypted. The resource names are derived from <code>resource</code> or <code>resource.group</code> of the group/version/resource.
   eg: pandas.awesome.bears.example is a custom resource with 'group': awesome.bears.example, 'resource': pandas.
   Use '&ast;.&ast;' to encrypt all resources and '&ast;.&lt;group&gt;' to encrypt all resources in a specific group.
   eg: '&ast;.awesome.bears.example' will encrypt all resources in the group 'awesome.bears.example'.
   eg: '&ast;.' will encrypt all resources in the core group (such as pods, configmaps, etc).</p>
   -->
   <code>resources</code> 是必须要加密的 Kubernetes 资源的列表。
   资源名称来自于组/版本/资源的 <code>resource</code> 或 <code>resource.group</code>。
   例如：<code>pandas.awesome.bears.example</code> 是一个自定义资源，
   具有 'group': <code>awesome.bears.example</code>、'resource': <code>pandas</code>。
   使用 <code>&ast;.&ast;</code> 加密所有资源，使用 <code>&ast;.&lt;group&gt;</code> 加密特定组中的所有资源。
   例如：<code>&ast;.awesome.bears.example</code> 将加密组 <code>awesome.bears.example</code> 中的所有资源。
   例如：<code>&ast;.</code> 将加密核心组中的所有资源（如 Pod、ConfigMap 等）。
   </p>
</td>
</tr>
<tr><td><code>providers</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p>
   <!--
   providers is a list of transformers to be used for reading and writing the resources to disk.  eg: aesgcm, aescbc, secretbox, identity, kms.
   -->
   <code>providers</code> 是一个转换器列表，用来将资源写入到磁盘或从磁盘上读出。
   例如：'aesgcm'、'aescbc'、'secretbox'、'identity'、'kms'。
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
SecretboxConfiguration 包含用于某 Secretbox 转换器的 API 配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>
   <!--
   keys is a list of keys to be used for creating the Secretbox transformer.
   Each key has to be 32 bytes long.
   -->
   <code>keys</code> 是一个密钥列表，用来创建 Secretbox 转换器。每个密钥长度必须是 32 字节。
   </p>
</td>
</tr>
</tbody>
</table>
