---
title: kube-apiserver Encryption Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---
<p>Package v1 is the v1 version of the API.</p>


## Resource Types 


- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)
  
    

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}
    


<p>EncryptionConfiguration stores the complete configuration for encryption providers.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EncryptionConfiguration</code></td></tr>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ResourceConfiguration"><code>[]ResourceConfiguration</code></a>
</td>
<td>
   <p>resources is a list containing resources, and their corresponding encryption providers.</p>
</td>
</tr>
</tbody>
</table>

## `AESConfiguration`     {#apiserver-config-k8s-io-v1-AESConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>AESConfiguration contains the API configuration for an AES transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>keys</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>keys is a list of keys to be used for creating the AES transformer.
Each key has to be 32 bytes long for AES-CBC and 16, 24 or 32 bytes for AES-GCM.</p>
</td>
</tr>
</tbody>
</table>

## `IdentityConfiguration`     {#apiserver-config-k8s-io-v1-IdentityConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>IdentityConfiguration is an empty struct to allow identity transformer in provider configuration.</p>




## `KMSConfiguration`     {#apiserver-config-k8s-io-v1-KMSConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>KMSConfiguration contains the name, cache size and path to configuration file for a KMS based envelope transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the KMS plugin to be used.</p>
</td>
</tr>
<tr><td><code>cachesize</code><br/>
<code>int32</code>
</td>
<td>
   <p>cachesize is the maximum number of secrets which are cached in memory. The default value is 1000.
Set to a negative value to disable caching.</p>
</td>
</tr>
<tr><td><code>endpoint</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>endpoint is the gRPC server listening address, for example &quot;unix:///var/run/kms-provider.sock&quot;.</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>timeout for gRPC calls to kms-plugin (ex. 5s). The default is 3 seconds.</p>
</td>
</tr>
</tbody>
</table>

## `Key`     {#apiserver-config-k8s-io-v1-Key}
    

**Appears in:**

- [AESConfiguration](#apiserver-config-k8s-io-v1-AESConfiguration)

- [SecretboxConfiguration](#apiserver-config-k8s-io-v1-SecretboxConfiguration)


<p>Key contains name and secret of the provided key for a transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the key to be used while storing data to disk.</p>
</td>
</tr>
<tr><td><code>secret</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>secret is the actual key, encoded in base64.</p>
</td>
</tr>
</tbody>
</table>

## `ProviderConfiguration`     {#apiserver-config-k8s-io-v1-ProviderConfiguration}
    

**Appears in:**

- [ResourceConfiguration](#apiserver-config-k8s-io-v1-ResourceConfiguration)


<p>ProviderConfiguration stores the provided configuration for an encryption provider.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>aesgcm</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>aesgcm is the configuration for the AES-GCM transformer.</p>
</td>
</tr>
<tr><td><code>aescbc</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-AESConfiguration"><code>AESConfiguration</code></a>
</td>
<td>
   <p>aescbc is the configuration for the AES-CBC transformer.</p>
</td>
</tr>
<tr><td><code>secretbox</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-SecretboxConfiguration"><code>SecretboxConfiguration</code></a>
</td>
<td>
   <p>secretbox is the configuration for the Secretbox based transformer.</p>
</td>
</tr>
<tr><td><code>identity</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-IdentityConfiguration"><code>IdentityConfiguration</code></a>
</td>
<td>
   <p>identity is the (empty) configuration for the identity transformer.</p>
</td>
</tr>
<tr><td><code>kms</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-KMSConfiguration"><code>KMSConfiguration</code></a>
</td>
<td>
   <p>kms contains the name, cache size and path to configuration file for a KMS based envelope transformer.</p>
</td>
</tr>
</tbody>
</table>

## `ResourceConfiguration`     {#apiserver-config-k8s-io-v1-ResourceConfiguration}
    

**Appears in:**

- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)


<p>ResourceConfiguration stores per resource configuration.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>resources</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>resources is a list of kubernetes resources which have to be encrypted.</p>
</td>
</tr>
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p>providers is a list of transformers to be used for reading and writing the resources to disk.
eg: aesgcm, aescbc, secretbox, identity.</p>
</td>
</tr>
</tbody>
</table>

## `SecretboxConfiguration`     {#apiserver-config-k8s-io-v1-SecretboxConfiguration}
    

**Appears in:**

- [ProviderConfiguration](#apiserver-config-k8s-io-v1-ProviderConfiguration)


<p>SecretboxConfiguration contains the API configuration for an Secretbox transformer.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>keys</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-Key"><code>[]Key</code></a>
</td>
<td>
   <p>keys is a list of keys to be used for creating the Secretbox transformer.
Each key has to be 32 bytes long.</p>
</td>
</tr>
</tbody>
</table>
  
