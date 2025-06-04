---
title: Kubelet Configuration (v1alpha1)
content_type: tool-reference
package: kubelet.config.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)
- [ImagePullIntent](#kubelet-config-k8s-io-v1alpha1-ImagePullIntent)
- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)
  

## `CredentialProviderConfig`     {#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig}
    


<p>CredentialProviderConfig is the configuration containing information about
each exec credential provider. Kubelet reads this configuration from disk and enables
each provider as specified by the CredentialProvider type.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CredentialProviderConfig</code></td></tr>
    
  
<tr><td><code>providers</code> <B>[Required]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-CredentialProvider"><code>[]CredentialProvider</code></a>
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

## `ImagePullIntent`     {#kubelet-config-k8s-io-v1alpha1-ImagePullIntent}
    


<p>ImagePullIntent is a record of the kubelet attempting to pull an image.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePullIntent</code></td></tr>
    
  
<tr><td><code>image</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Image is the image spec from a Container's <code>image</code> field.
The filename is a SHA-256 hash of this value. This is to avoid filename-unsafe
characters like ':' and '/'.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePulledRecord`     {#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord}
    


<p>ImagePullRecord is a record of an image that was pulled by the kubelet.</p>
<p>If there are no records in the <code>kubernetesSecrets</code> field and both <code>nodeWideCredentials</code>
and <code>anonymous</code> are <code>false</code>, credentials must be re-checked the next time an
image represented by this record is being requested.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubelet.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImagePulledRecord</code></td></tr>
    
  
<tr><td><code>lastUpdatedTime</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.33/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>LastUpdatedTime is the time of the last update to this record</p>
</td>
</tr>
<tr><td><code>imageRef</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>ImageRef is a reference to the image represented by this file as received
from the CRI.
The filename is a SHA-256 hash of this value. This is to avoid filename-unsafe
characters like ':' and '/'.</p>
</td>
</tr>
<tr><td><code>credentialMapping</code> <B>[Required]</B><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials"><code>map[string]ImagePullCredentials</code></a>
</td>
<td>
   <p>CredentialMapping maps <code>image</code> to the set of credentials that it was
previously pulled with.
<code>image</code> in this case is the content of a pod's container <code>image</code> field that's
got its tag/digest removed.</p>
<p>Example:
Container requests the <code>hello-world:latest@sha256:91fb4b041da273d5a3273b6d587d62d518300a6ad268b28628f74997b93171b2</code> image:
&quot;credentialMapping&quot;: {
&quot;hello-world&quot;: { &quot;nodePodsAccessible&quot;: true }
}</p>
</td>
</tr>
</tbody>
</table>

## `CredentialProvider`     {#kubelet-config-k8s-io-v1alpha1-CredentialProvider}
    

**Appears in:**

- [CredentialProviderConfig](#kubelet-config-k8s-io-v1alpha1-CredentialProviderConfig)


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
as subdomains like <code>*.k8s.io</code> or <code>k8s.*.io</code>, and top-level-domains such as <code>k8s.*</code>.
Matching partial subdomains like <code>app*.k8s.io</code> is also supported. Each glob can only match
a single subdomain segment, so <code>*.io</code> does not match <code>*.k8s.io</code>.</p>
<p>A match exists between an image and a matchImage when all of the below are true:</p>
<ul>
<li>Both contain the same number of domain parts and each part matches.</li>
<li>The URL path of an imageMatch must be a prefix of the target image URL path.</li>
<li>If the imageMatch contains a port, then the port must match in the image as well.</li>
</ul>
<p>Example values of matchImages:</p>
<ul>
<li><code>123456789.dkr.ecr.us-east-1.amazonaws.com</code></li>
<li><code>*.azurecr.io</code></li>
<li><code>gcr.io</code></li>
<li><code>*.*.registry.io</code></li>
<li><code>registry.io:8080/path</code></li>
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
<li>credentialprovider.kubelet.k8s.io/v1alpha1</li>
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
<a href="#kubelet-config-k8s-io-v1alpha1-ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#kubelet-config-k8s-io-v1alpha1-ExecEnvVar}
    

**Appears in:**

- [CredentialProvider](#kubelet-config-k8s-io-v1alpha1-CredentialProvider)


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

## `ImagePullCredentials`     {#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials}
    

**Appears in:**

- [ImagePulledRecord](#kubelet-config-k8s-io-v1alpha1-ImagePulledRecord)


<p>ImagePullCredentials describe credentials that can be used to pull an image.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>kubernetesSecrets</code><br/>
<a href="#kubelet-config-k8s-io-v1alpha1-ImagePullSecret"><code>[]ImagePullSecret</code></a>
</td>
<td>
   <p>KuberneteSecretCoordinates is an index of coordinates of all the kubernetes
secrets that were used to pull the image.</p>
</td>
</tr>
<tr><td><code>nodePodsAccessible</code><br/>
<code>bool</code>
</td>
<td>
   <p>NodePodsAccessible is a flag denoting the pull credentials are accessible
by all the pods on the node, or that no credentials are needed for the pull.</p>
<p>If true, it is mutually exclusive with the <code>kubernetesSecrets</code> field.</p>
</td>
</tr>
</tbody>
</table>

## `ImagePullSecret`     {#kubelet-config-k8s-io-v1alpha1-ImagePullSecret}
    

**Appears in:**

- [ImagePullCredentials](#kubelet-config-k8s-io-v1alpha1-ImagePullCredentials)


<p>ImagePullSecret is a representation of a Kubernetes secret object coordinates along
with a credential hash of the pull secret credentials this object contains.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>uid</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>namespace</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>credentialHash</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>CredentialHash is a SHA-256 retrieved by hashing the image pull credentials
content of the secret specified by the UID/Namespace/Name coordinates.</p>
</td>
</tr>
</tbody>
</table>
  