---
title: Client Authentication (v1beta1)
content_type: tool-reference
package: client.authentication.k8s.io/v1beta1
auto_generated: true
---


## Resource Types 


- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)
  
    


## `ExecCredential`     {#client-authentication-k8s-io-v1beta1-ExecCredential}
    




ExecCredential is used by exec-based plugins to communicate credentials to
HTTP transports.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>client.authentication.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExecCredential</code></td></tr>
    

  
  
<tr><td><code>spec</code> <B>[Required]</B><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
</td>
<td>
   Spec holds information passed to the plugin by the transport.</td>
</tr>
    
  
<tr><td><code>status</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
</td>
<td>
   Status is filled in by the plugin and holds the credentials that the transport
should use to contact the API.</td>
</tr>
    
  
</tbody>
</table>
    


## `Cluster`     {#client-authentication-k8s-io-v1beta1-Cluster}
    



**Appears in:**

- [ExecCredentialSpec](#client-authentication-k8s-io-v1beta1-ExecCredentialSpec)


Cluster contains information to allow an exec plugin to communicate
with the kubernetes cluster being authenticated to.

To ensure that this struct contains everything someone would need to communicate
with a kubernetes cluster (just like they would via a kubeconfig), the fields
should shadow "k8s.io/client-go/tools/clientcmd/api/v1".Cluster, with the exception
of CertificateAuthority, since CA data will always be passed to the plugin as bytes.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>server</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Server is the address of the kubernetes cluster (https://hostname:port).</td>
</tr>
    
  
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
   TLSServerName is passed to the server for SNI and is used in the client to
check server certificates against. If ServerName is empty, the hostname
used to contact the server is used.</td>
</tr>
    
  
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
   InsecureSkipTLSVerify skips the validity check for the server's certificate.
This will make your HTTPS connections insecure.</td>
</tr>
    
  
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
   CAData contains PEM-encoded certificate authority certificates.
If empty, system roots should be used.</td>
</tr>
    
  
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   ProxyURL is the URL to the proxy to be used for all requests to this
cluster.</td>
</tr>
    
  
<tr><td><code>config</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   Config holds additional config data that is specific to the exec
plugin with regards to the cluster being authenticated to.

This data is sourced from the clientcmd Cluster object's
extensions[client.authentication.k8s.io/exec] field:

clusters:
- name: my-cluster
  cluster:
    ...
    extensions:
    - name: client.authentication.k8s.io/exec  # reserved extension name for per cluster exec config
      extension:
        audience: 06e3fbd18de8  # arbitrary config

In some environments, the user config may be exactly the same across many clusters
(i.e. call this exec plugin) minus some details that are specific to each cluster
such as the audience.  This field allows the per cluster config to be directly
specified with the cluster info.  Using this field to store secret data is not
recommended as one of the prime benefits of exec plugins is that no secrets need
to be stored directly in the kubeconfig.</td>
</tr>
    
  
</tbody>
</table>
    


## `ExecCredentialSpec`     {#client-authentication-k8s-io-v1beta1-ExecCredentialSpec}
    



**Appears in:**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


ExecCredentialSpec holds request and runtime specific information provided by
the transport.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>cluster</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-Cluster"><code>Cluster</code></a>
</td>
<td>
   Cluster contains information to allow an exec plugin to communicate with the
kubernetes cluster being authenticated to. Note that Cluster is non-nil only
when provideClusterInfo is set to true in the exec provider config (i.e.,
ExecConfig.ProvideClusterInfo).</td>
</tr>
    
  
</tbody>
</table>
    


## `ExecCredentialStatus`     {#client-authentication-k8s-io-v1beta1-ExecCredentialStatus}
    



**Appears in:**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


ExecCredentialStatus holds credentials for the transport to use.

Token and ClientKeyData are sensitive fields. This data should only be
transmitted in-memory between client and exec plugin process. Exec plugin
itself should at least be protected via file permissions.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>expirationTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   ExpirationTimestamp indicates a time when the provided credentials expire.</td>
</tr>
    
  
<tr><td><code>token</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   Token is a bearer token used by the client for request authentication.</td>
</tr>
    
  
<tr><td><code>clientCertificateData</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   PEM-encoded client TLS certificates (including intermediates, if any).</td>
</tr>
    
  
<tr><td><code>clientKeyData</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   PEM-encoded private key for the above certificate.</td>
</tr>
    
  
</tbody>
</table>
    
  
