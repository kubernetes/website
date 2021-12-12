---
title: kube-apiserver Configuration (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
auto_generated: true
---
Package v1beta1 is the v1beta1 version of the API.

## Resource Types 


- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)
  
    


## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration}
    




EgressSelectorConfiguration provides versioned configuration for egress selector clients.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>
    

  
  
<tr><td><code>egressSelections</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   connectionServices contains a list of egress selection client configurations</td>
</tr>
    
  
</tbody>
</table>
    


## `Connection`     {#apiserver-k8s-io-v1beta1-Connection}
    



**Appears in:**

- [EgressSelection](#apiserver-k8s-io-v1beta1-EgressSelection)


Connection provides the configuration for a single egress selection client.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>proxyProtocol</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   Protocol is the protocol used to connect from client to the konnectivity server.</td>
</tr>
    
  
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1beta1-Transport"><code>Transport</code></a>
</td>
<td>
   Transport defines the transport configurations we use to dial to the konnectivity server.
This is required if ProxyProtocol is HTTPConnect or GRPC.</td>
</tr>
    
  
</tbody>
</table>
    


## `EgressSelection`     {#apiserver-k8s-io-v1beta1-EgressSelection}
    



**Appears in:**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)


EgressSelection provides the configuration for a single egress selection client.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   name is the name of the egress selection.
Currently supported values are "controlplane", "master", "etcd" and "cluster"
The "master" egress selector is deprecated in favor of "controlplane"</td>
</tr>
    
  
<tr><td><code>connection</code> <B>[Required]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-Connection"><code>Connection</code></a>
</td>
<td>
   connection is the exact information used to configure the egress selection</td>
</tr>
    
  
</tbody>
</table>
    


## `ProtocolType`     {#apiserver-k8s-io-v1beta1-ProtocolType}
    
(Alias of `string`)


**Appears in:**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)


ProtocolType is a set of valid values for Connection.ProtocolType


    


## `TCPTransport`     {#apiserver-k8s-io-v1beta1-TCPTransport}
    



**Appears in:**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)


TCPTransport provides the information to connect to konnectivity server via TCP

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>url</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   URL is the location of the konnectivity server to connect to.
As an example it might be "https://127.0.0.1:8131"</td>
</tr>
    
  
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   TLSConfig is the config needed to use TLS when connecting to konnectivity server</td>
</tr>
    
  
</tbody>
</table>
    


## `TLSConfig`     {#apiserver-k8s-io-v1beta1-TLSConfig}
    



**Appears in:**

- [TCPTransport](#apiserver-k8s-io-v1beta1-TCPTransport)


TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.</td>
</tr>
    
  
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://</td>
</tr>
    
  
<tr><td><code>clientCert</code><br/>
<code>string</code>
</td>
<td>
   clientCert is the file location of the client certificate to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://</td>
</tr>
    
  
</tbody>
</table>
    


## `Transport`     {#apiserver-k8s-io-v1beta1-Transport}
    



**Appears in:**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)


Transport defines the transport configurations we use to dial to the konnectivity server

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   TCP is the TCP configuration for communicating with the konnectivity server via TCP
ProxyProtocol of GRPC is not supported with TCP transport at the moment
Requires at least one of TCP or UDS to be set</td>
</tr>
    
  
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1beta1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   UDS is the UDS configuration for communicating with the konnectivity server via UDS
Requires at least one of TCP or UDS to be set</td>
</tr>
    
  
</tbody>
</table>
    


## `UDSTransport`     {#apiserver-k8s-io-v1beta1-UDSTransport}
    



**Appears in:**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)


UDSTransport provides the information to connect to konnectivity server via UDS

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>udsName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   UDSName is the name of the unix domain socket to connect to konnectivity server
This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)</td>
</tr>
    
  
</tbody>
</table>
    
  
