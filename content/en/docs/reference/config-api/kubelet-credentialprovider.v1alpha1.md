---
title: Kubelet CredentialProvider (v1alpha1)
content_type: tool-reference
package: credentialprovider.kubelet.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [CredentialProviderRequest](#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderRequest)
- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderResponse)
  
    


## `CredentialProviderRequest`     {#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderRequest}
    




CredentialProviderRequest includes the image that the kubelet requires authentication for.
Kubelet will pass this request object to the plugin via stdin. In general, plugins should
prefer responding with the same apiVersion they were sent.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderRequest</code></td></tr>
    

  
  
<tr><td><code>image</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   image is the container image that is being pulled as part of the
credential provider plugin request. Plugins may optionally parse the image
to extract any information required to fetch credentials.</td>
</tr>
    
  
</tbody>
</table>
    


## `CredentialProviderResponse`     {#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderResponse}
    




CredentialProviderResponse holds credentials that the kubelet should use for the specified
image provided in the original request. Kubelet will read the response from the plugin via stdout.
This response should be set to the same apiVersion as CredentialProviderRequest.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>credentialprovider.kubelet.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderResponse</code></td></tr>
    

  
  
<tr><td><code>cacheKeyType</code> <B>[Required]</B><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1alpha1-PluginCacheKeyType"><code>PluginCacheKeyType</code></a>
</td>
<td>
   cacheKeyType indiciates the type of caching key to use based on the image provided
in the request. There are three valid values for the cache key type: Image, Registry, and
Global. If an invalid value is specified, the response will NOT be used by the kubelet.</td>
</tr>
    
  
<tr><td><code>cacheDuration</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   cacheDuration indicates the duration the provided credentials should be cached for.
The kubelet will use this field to set the in-memory cache duration for credentials
in the AuthConfig. If null, the kubelet will use defaultCacheDuration provided in
CredentialProviderConfig. If set to 0, the kubelet will not cache the provided AuthConfig.</td>
</tr>
    
  
<tr><td><code>auth</code><br/>
<a href="#credentialprovider-kubelet-k8s-io-v1alpha1-AuthConfig"><code>map[string]k8s.io/kubelet/pkg/apis/credentialprovider/v1alpha1.AuthConfig</code></a>
</td>
<td>
   auth is a map containing authentication information passed into the kubelet.
Each key is a match image string (more on this below). The corresponding authConfig value
should be valid for all images that match against this key. A plugin should set
this field to null if no valid credentials can be returned for the requested image.

Each key in the map is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&lowast;.k8s.io' or 'k8s.&lowast;.io', and top-level-domains such as 'k8s.&lowast;'.
Matching partial subdomains like 'app&lowast;.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &lowast;.io does not match &lowast;.k8s.io.

The kubelet will match images against the key when all of the below are true:
- Both contain the same number of domain parts and each part matches.
- The URL path of an imageMatch must be a prefix of the target image URL path.
- If the imageMatch contains a port, then the port must match in the image as well.

When multiple keys are returned, the kubelet will traverse all keys in reverse order so that:
- longer keys come before shorter keys with the same prefix
- non-wildcard keys come before wildcard keys with the same prefix.

For any given match, the kubelet will attempt an image pull with the provided credentials,
stopping after the first successfully authenticated pull.

Example keys:
  - 123456789.dkr.ecr.us-east-1.amazonaws.com
  - &lowast;.azurecr.io
  - gcr.io
  - &lowast;.&lowast;.registry.io
  - registry.io:8080/path</td>
</tr>
    
  
</tbody>
</table>
    


## `AuthConfig`     {#credentialprovider-kubelet-k8s-io-v1alpha1-AuthConfig}
    



**Appears in:**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderResponse)


AuthConfig contains authentication information for a container registry.
Only username/password based authentication is supported today, but more authentication
mechanisms may be added in the future.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>username</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   username is the username used for authenticating to the container registry
An empty username is valid.</td>
</tr>
    
  
<tr><td><code>password</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   password is the password used for authenticating to the container registry
An empty password is valid.</td>
</tr>
    
  
</tbody>
</table>
    


## `PluginCacheKeyType`     {#credentialprovider-kubelet-k8s-io-v1alpha1-PluginCacheKeyType}
    
(Alias of `string`)


**Appears in:**

- [CredentialProviderResponse](#credentialprovider-kubelet-k8s-io-v1alpha1-CredentialProviderResponse)





    
  
