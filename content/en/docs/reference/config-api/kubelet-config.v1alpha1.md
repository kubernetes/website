---
title: Kubelet Configuration (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
  
    

## `FormatOptions`     {#FormatOptions}
    



**Appears in:**

- [LoggingConfiguration](#LoggingConfiguration)


FormatOptions contains options for the different logging formats.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>json</code> <B>[Required]</B><br/>
<a href="#JSONOptions"><code>JSONOptions</code></a>
</td>
<td>
   [Experimental] JSON contains options for logging format "json".</td>
</tr>
    
  
</tbody>
</table>

## `JSONOptions`     {#JSONOptions}
    



**Appears in:**

- [FormatOptions](#FormatOptions)


JSONOptions contains options for logging format "json".

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>splitStream</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   [Experimental] SplitStream redirects error messages to stderr while
info messages go to stdout, with buffering. The default is to write
both to stdout, without buffering.</td>
</tr>
    
  
<tr><td><code>infoBufferSize</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#QuantityValue"><code>k8s.io/apimachinery/pkg/api/resource.QuantityValue</code></a>
</td>
<td>
   [Experimental] InfoBufferSize sets the size of the info stream when
using split streams. The default is zero, which disables buffering.</td>
</tr>
    
  
</tbody>
</table>

## `VModuleConfiguration`     {#VModuleConfiguration}
    
(Alias of `[]k8s.io/component-base/config/v1alpha1.VModuleItem`)


**Appears in:**

- [LoggingConfiguration](#LoggingConfiguration)


VModuleConfiguration is a collection of individual file names or patterns
and the corresponding verbosity threshold.


  
    


## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}
    




CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
    

  
  
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is used.</td>
</tr>
    
  
</tbody>
</table>
    


## `CredentialProvider`     {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}
    



**Appears in:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)


CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   name is the required name of the credential provider. It must match the name of the
provider executable as seen by the kubelet. The executable must be in the kubelet's
bin directory (set by the --image-credential-provider-bin-dir flag).</td>
</tr>
    
  
<tr><td><code>matchImages</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.

Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '&lowast;.k8s.io' or 'k8s.&lowast;.io', and top-level-domains such as 'k8s.&lowast;'.
Matching partial subdomains like 'app&lowast;.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so &lowast;.io does not match &lowast;.k8s.io.

A match exists between an image and a matchImage when all of the below are true:
- Both contain the same number of domain parts and each part matches.
- The URL path of an imageMatch must be a prefix of the target image URL path.
- If the imageMatch contains a port, then the port must match in the image as well.

Example values of matchImages:
  - 123456789.dkr.ecr.us-east-1.amazonaws.com
  - &lowast;.azurecr.io
  - gcr.io
  - &lowast;.&lowast;.registry.io
  - registry.io:8080/path</td>
</tr>
    
  
<tr><td><code>defaultCacheDuration</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   defaultCacheDuration is the default duration the plugin will cache credentials in-memory
if a cache duration is not provided in the plugin response. This field is required.</td>
</tr>
    
  
<tr><td><code>apiVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
MUST use the same encoding version as the input. Current supported values are:
- credentialprovider.kubelet.k8s.io/v1alpha1</td>
</tr>
    
  
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   Arguments to pass to the command when executing it.</td>
</tr>
    
  
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.</td>
</tr>
    
  
</tbody>
</table>
    


## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}
    



**Appears in:**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)


ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span>
   </td>
</tr>
    
  
<tr><td><code>value</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span>
   </td>
</tr>
    
  
</tbody>
</table>
    
  
