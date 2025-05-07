---
title: Kubelet Configuration (v1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1
auto_generated: true
---


## Resource Types 


- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)
  

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1-CredentialProviderConfig}
    


<p>CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
    
  
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#kubelet-config-k8s-io-v1-CredentialProvider"><code>[]CredentialProvider</code></a>
</td>
<td>
   <p>providers is a list of credential provider plugins that will be enabled by the kubelet.
Multiple providers may match against a single image, in which case credentials
from all providers will be returned to the kubelet. If multiple providers are called
for a single image, the results are combined. If providers return overlapping
auth keys, the value from the provider earlier in this list is attempted first.</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider`     {#kubelet-config-k8s-io-v1-CredentialProvider}
    

**Appears in:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1-CredentialProviderConfig)


<p>CredentialProvider represents an exec plugin to be invoked by the kubelet. The plugin is only
invoked when an image being pulled matches the images handled by the plugin (see matchImages).</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the required name of the credential provider. It must match the name of the
provider executable as seen by the kubelet. The executable must be in the kubelet's
bin directory (set by the --image-credential-provider-bin-dir flag).
Required to be unique across all providers.</p>
</td>
</tr>
<tr><td><code>matchImages</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>matchImages is a required list of strings used to match against images in order to
determine if this provider should be invoked. If one of the strings matches the
requested image from the kubelet, the plugin will be invoked and given a chance
to provide credentials. Images are expected to contain the registry domain
and URL path.</p>
<p>Each entry in matchImages is a pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported
as subdomains like '<em>.k8s.io' or 'k8s.</em>.io', and top-level-domains such as 'k8s.<em>'.
Matching partial subdomains like 'app</em>.k8s.io' is also supported. Each glob can only match
a single subdomain segment, so *.io does not match *.k8s.io.</p>
<p>A match exists between an image and a matchImage when all of the below are true:</p>
<ul>
<li>Both contain the same number of domain parts and each part matches.</li>
<li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
<li>If the imageMatch contains a port, then the port must match in the image as well.</li>
</ul>
<p>Example values of matchImages:</p>
<ul>
<li>123456789.dkr.ecr.us-east-1.amazonaws.com</li>
<li>*.azurecr.io</li>
<li>gcr.io</li>
<li><em>.</em>.registry.io</li>
<li>registry.io:8080/path</li>
</ul>
</td>
</tr>
<tr><td><code>defaultCacheDuration</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>defaultCacheDuration is the default duration the plugin will cache credentials in-memory
if a cache duration is not provided in the plugin response. This field is required.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
MUST use the same encoding version as the input. Current supported values are:</p>
<ul>
<li>credentialprovider.kubelet.k8s.io/v1</li>
</ul>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
   <p>Arguments to pass to the command when executing it.</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#kubelet-config-k8s-io-v1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.</p>
</td>
</tr>
<tr><td><code>tokenAttributes</code><br/>
<a href="#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes"><code>ServiceAccountTokenAttributes</code></a>
</td>
<td>
   <p>tokenAttributes is the configuration for the service account token that will be passed to the plugin.
The credential provider opts in to using service account tokens for image pull by setting this field.
When this field is set, kubelet will generate a service account token bound to the pod for which the
image is being pulled and pass to the plugin as part of CredentialProviderRequest along with other
attributes required by the plugin.</p>
<p>The service account metadata and token attributes will be used as a dimension to cache
the credentials in kubelet. The cache key is generated by combining the service account metadata
(namespace, name, UID, and annotations key+value for the keys defined in
serviceAccountTokenAttribute.requiredServiceAccountAnnotationKeys and serviceAccountTokenAttribute.optionalServiceAccountAnnotationKeys).
The pod metadata (namespace, name, UID) that are in the service account token are not used as a dimension
to cache the credentials in kubelet. This means workloads that are using the same service account
could end up using the same credentials for image pull. For plugins that don't want this behavior, or
plugins that operate in pass-through mode; i.e., they return the service account token as-is, they
can set the credentialProviderResponse.cacheDuration to 0. This will disable the caching of
credentials in kubelet and the plugin will be invoked for every image pull. This does result in
token generation overhead for every image pull, but it is the only way to ensure that the
credentials are not shared across pods (even if they are using the same service account).</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1-ExecEnvVar}
    

**Appears in:**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)


<p>ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>value</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `ServiceAccountTokenAttributes`     {#kubelet-config-k8s-io-v1-ServiceAccountTokenAttributes}
    

**Appears in:**

- [CredentialProvider](#kubelet-config-k8s-io-v1-CredentialProvider)


<p>ServiceAccountTokenAttributes is the configuration for the service account token that will be passed to the plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>serviceAccountTokenAudience</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>serviceAccountTokenAudience is the intended audience for the projected service account token.</p>
</td>
</tr>
<tr><td><code>requireServiceAccount</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>requireServiceAccount indicates whether the plugin requires the pod to have a service account.
If set to true, kubelet will only invoke the plugin if the pod has a service account.
If set to false, kubelet will invoke the plugin even if the pod does not have a service account
and will not include a token in the CredentialProviderRequest in that scenario. This is useful for plugins that
are used to pull images for pods without service accounts (e.g., static pods).</p>
</td>
</tr>
<tr><td><code>requiredServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
   <p>requiredServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
and that are required to be present in the service account.
The keys defined in this list will be extracted from the corresponding service account and passed
to the plugin as part of the CredentialProviderRequest. If any of the keys defined in this list
are not present in the service account, kubelet will not invoke the plugin and will return an error.
This field is optional and may be empty. Plugins may use this field to extract
additional information required to fetch credentials or allow workloads to opt in to
using service account tokens for image pull.
If non-empty, requireServiceAccount must be set to true.</p>
</td>
</tr>
<tr><td><code>optionalServiceAccountAnnotationKeys</code><br/>
<code>[]string</code>
</td>
<td>
   <p>optionalServiceAccountAnnotationKeys is the list of annotation keys that the plugin is interested in
and that are optional to be present in the service account.
The keys defined in this list will be extracted from the corresponding service account and passed
to the plugin as part of the CredentialProviderRequest. The plugin is responsible for validating
the existence of annotations and their values.
This field is optional and may be empty. Plugins may use this field to extract
additional information required to fetch credentials.</p>
</td>
</tr>
</tbody>
</table>
  