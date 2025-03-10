---
title: kubeconfig (v1)
content_type: tool-reference
package: v1
auto_generated: true
---

## Resource Types 


- [Config](#Config)
  
    
    

## `Config`     {#Config}
    


<p>Config holds the information needed to build connect to remote kubernetes clusters as a given user</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Config</code></td></tr>
    
  
<tr><td><code>kind</code><br/>
<code>string</code>
</td>
<td>
   <p>Legacy field from pkg/api/types.go TypeMeta.
TODO(jlowdermilk): remove this after eliminating downstream dependencies.</p>
</td>
</tr>
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>Legacy field from pkg/api/types.go TypeMeta.
TODO(jlowdermilk): remove this after eliminating downstream dependencies.</p>
</td>
</tr>
<tr><td><code>preferences</code> <B>[Required]</B><br/>
<a href="#Preferences"><code>Preferences</code></a>
</td>
<td>
   <p>Preferences holds general information to be use for cli interactions</p>
</td>
</tr>
<tr><td><code>clusters</code> <B>[Required]</B><br/>
<a href="#NamedCluster"><code>[]NamedCluster</code></a>
</td>
<td>
   <p>Clusters is a map of referencable names to cluster configs</p>
</td>
</tr>
<tr><td><code>users</code> <B>[Required]</B><br/>
<a href="#NamedAuthInfo"><code>[]NamedAuthInfo</code></a>
</td>
<td>
   <p>AuthInfos is a map of referencable names to user configs</p>
</td>
</tr>
<tr><td><code>contexts</code> <B>[Required]</B><br/>
<a href="#NamedContext"><code>[]NamedContext</code></a>
</td>
<td>
   <p>Contexts is a map of referencable names to context configs</p>
</td>
</tr>
<tr><td><code>current-context</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>CurrentContext is the name of the context that you would like to use by default</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields</p>
</td>
</tr>
</tbody>
</table>

## `AuthInfo`     {#AuthInfo}
    

**Appears in:**

- [NamedAuthInfo](#NamedAuthInfo)


<p>AuthInfo contains information that describes identity information.  This is use to tell the kubernetes cluster who you are.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>client-certificate</code><br/>
<code>string</code>
</td>
<td>
   <p>ClientCertificate is the path to a client cert file for TLS.</p>
</td>
</tr>
<tr><td><code>client-certificate-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>ClientCertificateData contains PEM-encoded data from a client cert file for TLS. Overrides ClientCertificate</p>
</td>
</tr>
<tr><td><code>client-key</code><br/>
<code>string</code>
</td>
<td>
   <p>ClientKey is the path to a client key file for TLS.</p>
</td>
</tr>
<tr><td><code>client-key-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>ClientKeyData contains PEM-encoded data from a client key file for TLS. Overrides ClientKey</p>
</td>
</tr>
<tr><td><code>token</code><br/>
<code>string</code>
</td>
<td>
   <p>Token is the bearer token for authentication to the kubernetes cluster.</p>
</td>
</tr>
<tr><td><code>tokenFile</code><br/>
<code>string</code>
</td>
<td>
   <p>TokenFile is a pointer to a file that contains a bearer token (as described above).  If both Token and TokenFile are present, Token takes precedence.</p>
</td>
</tr>
<tr><td><code>as</code><br/>
<code>string</code>
</td>
<td>
   <p>Impersonate is the username to impersonate.  The name matches the flag.</p>
</td>
</tr>
<tr><td><code>as-uid</code><br/>
<code>string</code>
</td>
<td>
   <p>ImpersonateUID is the uid to impersonate.</p>
</td>
</tr>
<tr><td><code>as-groups</code><br/>
<code>[]string</code>
</td>
<td>
   <p>ImpersonateGroups is the groups to impersonate.</p>
</td>
</tr>
<tr><td><code>as-user-extra</code><br/>
<code>map[string][]string</code>
</td>
<td>
   <p>ImpersonateUserExtra contains additional information for impersonated user.</p>
</td>
</tr>
<tr><td><code>username</code><br/>
<code>string</code>
</td>
<td>
   <p>Username is the username for basic authentication to the kubernetes cluster.</p>
</td>
</tr>
<tr><td><code>password</code><br/>
<code>string</code>
</td>
<td>
   <p>Password is the password for basic authentication to the kubernetes cluster.</p>
</td>
</tr>
<tr><td><code>auth-provider</code><br/>
<a href="#AuthProviderConfig"><code>AuthProviderConfig</code></a>
</td>
<td>
   <p>AuthProvider specifies a custom authentication plugin for the kubernetes cluster.</p>
</td>
</tr>
<tr><td><code>exec</code><br/>
<a href="#ExecConfig"><code>ExecConfig</code></a>
</td>
<td>
   <p>Exec specifies a custom exec-based authentication plugin for the kubernetes cluster.</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields</p>
</td>
</tr>
</tbody>
</table>

## `AuthProviderConfig`     {#AuthProviderConfig}
    

**Appears in:**

- [AuthInfo](#AuthInfo)


<p>AuthProviderConfig holds the configuration for a specified auth provider.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>config</code> <B>[Required]</B><br/>
<code>map[string]string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `Cluster`     {#Cluster}
    

**Appears in:**

- [NamedCluster](#NamedCluster)


<p>Cluster contains information about how to communicate with a kubernetes cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>server</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Server is the address of the kubernetes cluster (https://hostname:port).</p>
</td>
</tr>
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
   <p>TLSServerName is used to check server certificate. If TLSServerName is empty, the hostname used to contact the server is used.</p>
</td>
</tr>
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
   <p>InsecureSkipTLSVerify skips the validity check for the server's certificate. This will make your HTTPS connections insecure.</p>
</td>
</tr>
<tr><td><code>certificate-authority</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificateAuthority is the path to a cert file for the certificate authority.</p>
</td>
</tr>
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>CertificateAuthorityData contains PEM-encoded certificate authority certificates. Overrides CertificateAuthority</p>
</td>
</tr>
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <p>ProxyURL is the URL to the proxy to be used for all requests made by this
client. URLs with &quot;http&quot;, &quot;https&quot;, and &quot;socks5&quot; schemes are supported.  If
this configuration is not provided or the empty string, the client
attempts to construct a proxy configuration from http_proxy and
https_proxy environment variables. If these environment variables are not
set, the client does not attempt to proxy requests.</p>
<p>socks5 proxying does not currently support spdy streaming endpoints (exec,
attach, port forward).</p>
</td>
</tr>
<tr><td><code>disable-compression</code><br/>
<code>bool</code>
</td>
<td>
   <p>DisableCompression allows client to opt-out of response compression for all requests to the server. This is useful
to speed up requests (specifically lists) when client-server network bandwidth is ample, by saving time on
compression (server-side) and decompression (client-side): https://github.com/kubernetes/kubernetes/issues/112296.</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields</p>
</td>
</tr>
</tbody>
</table>

## `Context`     {#Context}
    

**Appears in:**

- [NamedContext](#NamedContext)


<p>Context is a tuple of references to a cluster (how do I communicate with a kubernetes cluster), a user (how do I identify myself), and a namespace (what subset of resources do I want to work with)</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>cluster</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Cluster is the name of the cluster for this context</p>
</td>
</tr>
<tr><td><code>user</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>AuthInfo is the name of the authInfo for this context</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <p>Namespace is the default namespace to use on unspecified requests</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields</p>
</td>
</tr>
</tbody>
</table>

## `ExecConfig`     {#ExecConfig}
    

**Appears in:**

- [AuthInfo](#AuthInfo)


<p>ExecConfig specifies a command to provide client credentials. The command is exec'd
and outputs structured stdout holding credentials.</p>
<p>See the client.authentication.k8s.io API group for specifications of the exact input
and output format</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>command</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Command to execute.</p>
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
<a href="#ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
   <p>Env defines additional environment variables to expose to the process. These
are unioned with the host's environment, as well as variables client-go uses
to pass argument to the plugin.</p>
</td>
</tr>
<tr><td><code>apiVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Preferred input version of the ExecInfo. The returned ExecCredentials MUST use
the same encoding version as the input.</p>
</td>
</tr>
<tr><td><code>installHint</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>This text is shown to the user when the executable doesn't seem to be
present. For example, <code>brew install foo-cli</code> might be a good InstallHint for
foo-cli on Mac OS systems.</p>
</td>
</tr>
<tr><td><code>provideClusterInfo</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>ProvideClusterInfo determines whether or not to provide cluster information,
which could potentially contain very large CA data, to this exec plugin as a
part of the KUBERNETES_EXEC_INFO environment variable. By default, it is set
to false. Package k8s.io/client-go/tools/auth/exec provides helper methods for
reading this environment variable.</p>
</td>
</tr>
<tr><td><code>interactiveMode</code><br/>
<a href="#ExecInteractiveMode"><code>ExecInteractiveMode</code></a>
</td>
<td>
   <p>InteractiveMode determines this plugin's relationship with standard input. Valid
values are &quot;Never&quot; (this exec plugin never uses standard input), &quot;IfAvailable&quot; (this
exec plugin wants to use standard input if it is available), or &quot;Always&quot; (this exec
plugin requires standard input to function). See ExecInteractiveMode values for more
details.</p>
<p>If APIVersion is client.authentication.k8s.io/v1alpha1 or
client.authentication.k8s.io/v1beta1, then this field is optional and defaults
to &quot;IfAvailable&quot; when unset. Otherwise, this field is required.</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#ExecEnvVar}
    

**Appears in:**

- [ExecConfig](#ExecConfig)


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

## `ExecInteractiveMode`     {#ExecInteractiveMode}
    
(Alias of `string`)

**Appears in:**

- [ExecConfig](#ExecConfig)


<p>ExecInteractiveMode is a string that describes an exec plugin's relationship with standard input.</p>




## `NamedAuthInfo`     {#NamedAuthInfo}
    

**Appears in:**

- [Config](#Config)


<p>NamedAuthInfo relates nicknames to auth information</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the nickname for this AuthInfo</p>
</td>
</tr>
<tr><td><code>user</code> <B>[Required]</B><br/>
<a href="#AuthInfo"><code>AuthInfo</code></a>
</td>
<td>
   <p>AuthInfo holds the auth information</p>
</td>
</tr>
</tbody>
</table>

## `NamedCluster`     {#NamedCluster}
    

**Appears in:**

- [Config](#Config)


<p>NamedCluster relates nicknames to cluster information</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the nickname for this Cluster</p>
</td>
</tr>
<tr><td><code>cluster</code> <B>[Required]</B><br/>
<a href="#Cluster"><code>Cluster</code></a>
</td>
<td>
   <p>Cluster holds the cluster information</p>
</td>
</tr>
</tbody>
</table>

## `NamedContext`     {#NamedContext}
    

**Appears in:**

- [Config](#Config)


<p>NamedContext relates nicknames to context information</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the nickname for this Context</p>
</td>
</tr>
<tr><td><code>context</code> <B>[Required]</B><br/>
<a href="#Context"><code>Context</code></a>
</td>
<td>
   <p>Context holds the context information</p>
</td>
</tr>
</tbody>
</table>

## `NamedExtension`     {#NamedExtension}
    

**Appears in:**

- [Config](#Config)

- [AuthInfo](#AuthInfo)

- [Cluster](#Cluster)

- [Context](#Context)

- [Preferences](#Preferences)


<p>NamedExtension relates nicknames to extension information</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the nickname for this Extension</p>
</td>
</tr>
<tr><td><code>extension</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Extension holds the extension information</p>
</td>
</tr>
</tbody>
</table>

## `Preferences`     {#Preferences}
    

**Appears in:**

- [Config](#Config)



<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>colors</code><br/>
<code>bool</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
   <p>Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields</p>
</td>
</tr>
</tbody>
</table>