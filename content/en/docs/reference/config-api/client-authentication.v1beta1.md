---
title: Client Authentication (v1beta1)
content_type: tool-reference
package: client.authentication.k8s.io/v1beta1
auto_generated: true
---


## Resource Types 


- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)
  

## `ExecCredential`     {#client-authentication-k8s-io-v1beta1-ExecCredential}
    


<p>ExecCredential is used by exec-based plugins to communicate credentials to
HTTP transports.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>client.authentication.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExecCredential</code></td></tr>
    
  
<tr><td><code>spec</code> <B>[Required]</B><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
</td>
<td>
   <p>Spec holds information passed to the plugin by the transport.</p>
</td>
</tr>
<tr><td><code>status</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
</td>
<td>
   <p>Status is filled in by the plugin and holds the credentials that the transport
should use to contact the API.</p>
</td>
</tr>
</tbody>
</table>

## `Cluster`     {#client-authentication-k8s-io-v1beta1-Cluster}
    

**Appears in:**

- [ExecCredentialSpec](#client-authentication-k8s-io-v1beta1-ExecCredentialSpec)


<p>Cluster contains information to allow an exec plugin to communicate
with the kubernetes cluster being authenticated to.</p>
<p>To ensure that this struct contains everything someone would need to communicate
with a kubernetes cluster (just like they would via a kubeconfig), the fields
should shadow &quot;k8s.io/client-go/tools/clientcmd/api/v1&quot;.Cluster, with the exception
of CertificateAuthority, since CA data will always be passed to the plugin as bytes.</p>


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
   <p>TLSServerName is passed to the server for SNI and is used in the client to
check server certificates against. If ServerName is empty, the hostname
used to contact the server is used.</p>
</td>
</tr>
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
   <p>InsecureSkipTLSVerify skips the validity check for the server's certificate.
This will make your HTTPS connections insecure.</p>
</td>
</tr>
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <p>CAData contains PEM-encoded certificate authority certificates.
If empty, system roots should be used.</p>
</td>
</tr>
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <p>ProxyURL is the URL to the proxy to be used for all requests to this
cluster.</p>
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
<tr><td><code>config</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <p>Config holds additional config data that is specific to the exec
plugin with regards to the cluster being authenticated to.</p>
<p>This data is sourced from the clientcmd Cluster object's
extensions[client.authentication.k8s.io/exec] field:</p>
<p>clusters:</p>
<ul>
<li>name: my-cluster
cluster:
...
extensions:
<ul>
<li>name: client.authentication.k8s.io/exec  # reserved extension name for per cluster exec config
extension:
audience: 06e3fbd18de8  # arbitrary config</li>
</ul>
</li>
</ul>
<p>In some environments, the user config may be exactly the same across many clusters
(i.e. call this exec plugin) minus some details that are specific to each cluster
such as the audience.  This field allows the per cluster config to be directly
specified with the cluster info.  Using this field to store secret data is not
recommended as one of the prime benefits of exec plugins is that no secrets need
to be stored directly in the kubeconfig.</p>
</td>
</tr>
</tbody>
</table>

## `ExecCredentialSpec`     {#client-authentication-k8s-io-v1beta1-ExecCredentialSpec}
    

**Appears in:**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


<p>ExecCredentialSpec holds request and runtime specific information provided by
the transport.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>cluster</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-Cluster"><code>Cluster</code></a>
</td>
<td>
   <p>Cluster contains information to allow an exec plugin to communicate with the
kubernetes cluster being authenticated to. Note that Cluster is non-nil only
when provideClusterInfo is set to true in the exec provider config (i.e.,
ExecConfig.ProvideClusterInfo).</p>
</td>
</tr>
<tr><td><code>interactive</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Interactive declares whether stdin has been passed to this exec plugin.</p>
</td>
</tr>
</tbody>
</table>

## `ExecCredentialStatus`     {#client-authentication-k8s-io-v1beta1-ExecCredentialStatus}
    

**Appears in:**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


<p>ExecCredentialStatus holds credentials for the transport to use.</p>
<p>Token and ClientKeyData are sensitive fields. This data should only be
transmitted in-memory between client and exec plugin process. Exec plugin
itself should at least be protected via file permissions.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>expirationTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>ExpirationTimestamp indicates a time when the provided credentials expire.</p>
</td>
</tr>
<tr><td><code>token</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Token is a bearer token used by the client for request authentication.</p>
</td>
</tr>
<tr><td><code>clientCertificateData</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>PEM-encoded client TLS certificates (including intermediates, if any).</p>
</td>
</tr>
<tr><td><code>clientKeyData</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>PEM-encoded private key for the above certificate.</p>
</td>
</tr>
</tbody>
</table>
  