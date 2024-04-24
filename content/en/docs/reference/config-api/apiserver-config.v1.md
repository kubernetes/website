---
title: kube-apiserver Configuration (v1)
content_type: tool-reference
package: apiserver.config.k8s.io/v1
auto_generated: true
---
<p>Package v1 is the v1 version of the API.</p>


## Resource Types 


- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)
- [EncryptionConfiguration](#apiserver-config-k8s-io-v1-EncryptionConfiguration)
  

## `AdmissionConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionConfiguration}
    


<p>AdmissionConfiguration provides versioned configuration for admission controllers.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>
    
  
<tr><td><code>plugins</code><br/>
<a href="#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p>Plugins allows specifying a configuration per admission control plugin.</p>
</td>
</tr>
</tbody>
</table>

## `EncryptionConfiguration`     {#apiserver-config-k8s-io-v1-EncryptionConfiguration}
    


<p>EncryptionConfiguration stores the complete configuration for encryption providers.
It also allows the use of wildcards to specify the resources that should be encrypted.
Use '&ast;.&lt;group&gt;' to encrypt all resources within a group or '&ast;.&ast;' to encrypt all resources.
'&ast;.' can be used to encrypt all resource in the core group.  '&ast;.&ast;' will encrypt all
resources, even custom resources that are added after API server start.
Use of wildcards that overlap within the same resource list or across multiple
entries are not allowed since part of the configuration would be ineffective.
Resource lists are processed in order, with earlier lists taking precedence.</p>
<p>Example:</p>
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

## `AdmissionPluginConfiguration`     {#apiserver-config-k8s-io-v1-AdmissionPluginConfiguration}
    

**Appears in:**

- [AdmissionConfiguration](#apiserver-config-k8s-io-v1-AdmissionConfiguration)


<p>AdmissionPluginConfiguration provides the configuration for a single plug-in.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the name of the admission controller.
It must match the registered admission plugin name.</p>
</td>
</tr>
<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
   <p>Path is the path to a configuration file that contains the plugin's
configuration</p>
</td>
</tr>
<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p>Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.</p>
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
    
  
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>apiVersion of KeyManagementService</p>
</td>
</tr>
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
Set to a negative value to disable caching. This field is only allowed for KMS v1 providers.</p>
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
   <p>resources is a list of kubernetes resources which have to be encrypted. The resource names are derived from <code>resource</code> or <code>resource.group</code> of the group/version/resource.
eg: pandas.awesome.bears.example is a custom resource with 'group': awesome.bears.example, 'resource': pandas.
Use '&ast;.&ast;' to encrypt all resources and '&ast;.&lt;group&gt;' to encrypt all resources in a specific group.
eg: '&ast;.awesome.bears.example' will encrypt all resources in the group 'awesome.bears.example'.
eg: '&ast;.' will encrypt all resources in the core group (such as pods, configmaps, etc).</p>
</td>
</tr>
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#apiserver-config-k8s-io-v1-ProviderConfiguration"><code>[]ProviderConfiguration</code></a>
</td>
<td>
   <p>providers is a list of transformers to be used for reading and writing the resources to disk.
eg: aesgcm, aescbc, secretbox, identity, kms.</p>
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
  
