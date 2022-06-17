---
title: kube-apiserver 加密配置 (v1)
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

<p><!--Package v1 is the v1 version of the API.-->
包 v1 是 API 的 v1 版本。</p>

<!--
## Resource Types
-->
## 資源型別

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}

<p><!--EncryptionConfiguration stores the complete configuration for encryption providers.-->
EncryptionConfiguration 為加密驅動儲存完整的配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EncryptionConfiguration</code></td></tr>
<tr><td><code>resources</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
</td>
<td>
   <p><!--resources is a list containing resources, and their corresponding encryption providers.-->
   <code>resources</code> 是一個包含資源及其對應的加密驅動的列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `AESConfiguration`     {#apiserver-config-k8s-io-v1-AESConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p><!--AESConfiguration contains the API configuration for an AES transformer.-->
AESConfiguration 包含 AES 轉換器的 API 配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p><!--keys is a list of keys to be used for creating the AES transformer.
Each key has to be 32 bytes long for AES-CBC and 16, 24 or 32 bytes for AES-GCM.-->
   <code>keys</code> 是一組用於建立 AES 轉換器的秘鑰。
   對於 AES-CBC，每個秘鑰必須是 32 位元組長；對於 AES-GCM，每個秘鑰可以是 16、24、32 位元組長。
   </p>
</td>
</tr>
</tbody>
</table>

## `IdentityConfiguration`     {#apiserver-config-k8s-io-v1-IdentityConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p><!--IdentityConfiguration is an empty struct to allow identity transformer in provider configuration.-->
IdentityConfiguration 是一個空的結構，用來支援在驅動配置中支援標識轉換器。
</p>

## `KMSConfiguration`     {#apiserver-config-k8s-io-v1-KMSConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p><!--KMSConfiguration contains the name, cache size and path to configuration file for a KMS based envelope transformer.-->
KMSConfiguration 包含基於 KMS 的封套轉換器的名稱、快取大小以及配置檔案路徑資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--name is the name of the KMS plugin to be used.-->
   <code>name</code> 是要使用的 KMS 外掛名稱。
   </p>
</td>
</tr>
<tr><td><code>cachesize</code><br/>
<code>int32</code>
</td>
<td>
   <p><!--cachesize is the maximum number of secrets which are cached in memory. The default value is 1000.  Set to a negative value to disable caching.-->
   <code>cachesize</code> 是可在記憶體中快取的 Secret 數量上限。預設值是 1000。將此欄位設定為負值會禁用快取。
   </p>
</td>
</tr>
<tr><td><code>endpoint</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--endpoint is the gRPC server listening address, for example &quot;unix:///var/run/kms-provider.sock&quot;.-->
   <code>endpoint</code> 是 gRPC 伺服器的監聽地址，例如 &quot;unix:///var/run/kms-provider.sock&quot;。
   </p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><!--timeout for gRPC calls to kms-plugin (ex. 5s). The default is 3 seconds.-->
   對 KMS 外掛執行 gRPC 呼叫的超時時長（例如，'5s'）。預設值為 3 秒。
   </p>
</td>
</tr>
</tbody>
</table>

## `Key`     {#apiserver-config-k8s-io-v1-Key}

<!--
**Appears in:**
-->
**出現在：**

- [AESConfiguration](#apiserver-config-k8s-io-v1-AESConfiguration)
- [SecretboxConfiguration](#apiserver-config-k8s-io-v1-SecretboxConfiguration)

<p><!--Key contains name and secret of the provided key for a transformer.-->
Key 中包含為某轉換器所提供的鍵名和對應的私密資料。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--name is the name of the key to be used while storing data to disk.-->
   <code>name</code> 是在向磁碟中儲存資料時使用的鍵名。
   </p>
</td>
</tr>
<tr><td><code>secret</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--secret is the actual key, encoded in base64.-->
   <code>secret</code> 是實際的秘鑰，用 base64 編碼。
   </p>
</td>
</tr>
</tbody>
</table>

## `ProviderConfiguration`     {#apiserver-config-k8s-io-v1-ProviderConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [ResourceConfiguration](#apiserver-config-k8s-io-v1-ResourceConfiguration)

<p><!--ProviderConfiguration stores the provided configuration for an encryption provider.-->
ProviderConfiguration 為加密驅動儲存配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>aesgcm</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p><!--aesgcm is the configuration for the AES-GCM transformer.-->
   <code>aesgcm</code> 是用於 AES-GCM 轉換器的配置。
   </p>
</td>
</tr>
<tr><td><code>aescbc</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p><!--aescbc is the configuration for the AES-CBC transformer.-->
   <code>aescbc</code> 是用於 AES-CBC 轉換器的配置。
   </p>
</td>
</tr>
<tr><td><code>secretbox</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
</td>
<td>
   <p><!--secretbox is the configuration for the Secretbox based transformer.-->
   <code>secretbox</code> 是用於基於 Secretbox 的轉換器的配置。
   </p>
</td>
</tr>
<tr><td><code>identity</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
</td>
<td>
   <p><!--identity is the (empty) configuration for the identity transformer.-->
   <code>identity</code> 是用於標識轉換器的配置（空）。
   </p>
</td>
</tr>
<tr><td><code>kms</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
</td>
<td>
   <p><!--kms contains the name, cache size and path to configuration file for a KMS based envelope transformer.-->
   <code>kms</code> 中包含用於基於 KMS 的封套轉換器的名稱、快取大小以及配置檔案路徑資訊。
   </p>
</td>
</tr>
</tbody>
</table>

## `ResourceConfiguration`     {#apiserver-config-k8s-io-v1-ResourceConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)

<p><!--ResourceConfiguration stores per resource configuration.-->
ResourceConfiguration 中儲存資源配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>resources</code> <B>[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p><!--resources is a list of kubernetes resources which have to be encrypted.-->
   <code>resources</code> 是必需要加密的 Kubernetes 資源的列表。
   </p>
</td>
</tr>
<tr><td><code>providers</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p><!--providers is a list of transformers to be used for reading and writing the resources to disk.  eg: aesgcm, aescbc, secretbox, identity.-->
   <code>providers</code> 是一個轉換器列表，用來將資源寫入到磁碟或從磁碟上讀出。
   例如：'aesgcm'、'aescbc'、'secretbox'、'identity'。
   </p>
</td>
</tr>
</tbody>
</table>

## `SecretboxConfiguration`     {#apiserver-config-k8s-io-v1-SecretboxConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)

<p><!--SecretboxConfiguration contains the API configuration for an Secretbox transformer.-->
SecretboxConfiguration 包含用於某 Secretbox 轉換器的 API 配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>keys</code> <B>[必需]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p><!--keys is a list of keys to be used for creating the Secretbox transformer.
Each key has to be 32 bytes long.-->
   <code>keys</code> 是一個秘鑰列表，用來建立 Secretbox 轉換器。每個秘鑰必須是 32 位元組長。
   </p>
</td>
</tr>
</tbody>
</table>

