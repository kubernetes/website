---
title: kube-apiserver Configuration (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
auto_generated: true
---
<p>Package v1alpha1 is the v1alpha1 version of the API.</p>


## Resource Types 


- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)
  
    

## `AdmissionConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionConfiguration}
    


<p>AdmissionConfiguration provides versioned configuration for admission controllers.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>
    
  
<tr><td><code>plugins</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p>Plugins allows specifying a configuration per admission control plugin.</p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration}
    


<p>EgressSelectorConfiguration provides versioned configuration for egress selector clients.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>
    
  
<tr><td><code>egressSelections</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p>connectionServices contains a list of egress selection client configurations</p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1alpha1-TracingConfiguration}
    


<p>TracingConfiguration provides versioned configuration for tracing clients.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>
    
  
<tr><td><code>TracingConfiguration</code> <B>[Required]</B><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>(Members of <code>TracingConfiguration</code> are embedded into this type.)
   <p>Embed the component config tracing configuration struct</p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration}
    

**Appears in:**

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)


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

## `Connection`     {#apiserver-k8s-io-v1alpha1-Connection}
    

**Appears in:**

- [EgressSelection](#apiserver-k8s-io-v1alpha1-EgressSelection)


<p>Connection provides the configuration for a single egress selection client.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>proxyProtocol</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p>Protocol is the protocol used to connect from client to the konnectivity server.</p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-Transport"><code>Transport</code></a>
</td>
<td>
   <p>Transport defines the transport configurations we use to dial to the konnectivity server.
This is required if ProxyProtocol is HTTPConnect or GRPC.</p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1alpha1-EgressSelection}
    

**Appears in:**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)


<p>EgressSelection provides the configuration for a single egress selection client.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>name is the name of the egress selection.
Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot;</p>
</td>
</tr>
<tr><td><code>connection</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-Connection"><code>Connection</code></a>
</td>
<td>
   <p>connection is the exact information used to configure the egress selection</p>
</td>
</tr>
</tbody>
</table>

## `ProtocolType`     {#apiserver-k8s-io-v1alpha1-ProtocolType}
    
(Alias of `string`)

**Appears in:**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)


<p>ProtocolType is a set of valid values for Connection.ProtocolType</p>




## `TCPTransport`     {#apiserver-k8s-io-v1alpha1-TCPTransport}
    

**Appears in:**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)


<p>TCPTransport provides the information to connect to konnectivity server via TCP</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>url</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>URL is the location of the konnectivity server to connect to.
As an example it might be &quot;https://127.0.0.1:8131&quot;</p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p>TLSConfig is the config needed to use TLS when connecting to konnectivity server</p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1alpha1-TLSConfig}
    

**Appears in:**

- [TCPTransport](#apiserver-k8s-io-v1alpha1-TCPTransport)


<p>TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   <p>caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.</p>
</td>
</tr>
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   <p>clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://</p>
</td>
</tr>
<tr><td><code>clientCert</code><br/>
<code>string</code>
</td>
<td>
   <p>clientCert is the file location of the client certificate to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://</p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1alpha1-Transport}
    

**Appears in:**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)


<p>Transport defines the transport configurations we use to dial to the konnectivity server</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p>TCP is the TCP configuration for communicating with the konnectivity server via TCP
ProxyProtocol of GRPC is not supported with TCP transport at the moment
Requires at least one of TCP or UDS to be set</p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p>UDS is the UDS configuration for communicating with the konnectivity server via UDS
Requires at least one of TCP or UDS to be set</p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1alpha1-UDSTransport}
    

**Appears in:**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)


<p>UDSTransport provides the information to connect to konnectivity server via UDS</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>udsName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>UDSName is the name of the unix domain socket to connect to konnectivity server
This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)</p>
</td>
</tr>
</tbody>
</table>
  
  
    

## `TracingConfiguration`     {#TracingConfiguration}
    

**Appears in:**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)


<p>TracingConfiguration provides versioned configuration for OpenTelemetry tracing clients.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>Endpoint of the collector this component will report traces to.
The connection is insecure, and does not currently support TLS.
Recommended is unset, and endpoint is the otlp grpc default, localhost:4317.</p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p>SamplingRatePerMillion is the number of samples to collect per million spans.
Recommended is unset. If unset, sampler respects its parent span's sampling
rate, but otherwise never samples.</p>
</td>
</tr>
</tbody>
</table>