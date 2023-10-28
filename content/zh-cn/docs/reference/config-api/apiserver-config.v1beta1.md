---
title: kube-apiserver 配置 (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
---
<!-- 
title: kube-apiserver Configuration (v1beta1)
content_type: tool-reference
package: apiserver.k8s.io/v1beta1
auto_generated: true
-->

<!-- 
Package v1beta1 is the v1beta1 version of the API.</p> 
-->
<p>v1beta1 包是 v1beta1 版本的 API。</p>

<!-- 
## Resource Types  
-->
## 资源类型   {#resource-types}

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration}

<p>
<!-- 
EgressSelectorConfiguration provides versioned configuration for egress selector clients. 
-->
EgressSelectorConfiguration 为 Egress 选择算符客户端提供版本化的配置选项。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>

<tr><td><code>egressSelections</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p>
   <!-- connectionServices contains a list of egress selection client configurations -->
   connectionServices 包含一组 Egress 选择算符客户端配置选项。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#TracingConfiguration}
   
<!--
**Appears in:**
-->
**出现在：**

- [KubeletConfiguration](#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

- [TracingConfiguration](#apiserver-k8s-io-v1beta1-TracingConfiguration)

<p>
<!--
TracingConfiguration provides versioned configuration for OpenTelemetry tracing clients.
-->
TracingConfiguration 为 OpenTelemetry 跟踪客户端提供版本化的配置。
</p>

<table class="table">

<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
 
<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   Endpoint of the collector this component will report traces to.
   The connection is insecure, and does not currently support TLS.
   Recommended is unset, and endpoint is the otlp grpc default, localhost:4317.
   -->
   采集器的端点，此组件将向其报告跟踪信息。
   连接不安全，目前不支持 TLS。
   推荐不设置，端点为 otlp grpc 默认值 localhost:4317。
   </p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!--
   SamplingRatePerMillion is the number of samples to collect per million spans.
   Recommended is unset. If unset, sampler respects its parent span's sampling
   rate, but otherwise never samples.
   -->
   samplingRatePerMillion 是每百万 span 中采集的样本数。
   推荐不设置。如果不设置，采集器将继承其父级 span 的采样率，否则不进行采样。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1beta1-TracingConfiguration}

<p>
<!-- TracingConfiguration provides versioned configuration for tracing clients. -->
TracingConfiguration 为跟踪客户端提供版本化的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>

<tr><td><code>TracingConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#TracingConfiguration"><code>TracingConfiguration</code></a>
</td>
<td>
<!-- (Members of <code>TracingConfiguration</code> are embedded into this type.) -->
（<code>TracingConfiguration</code> 的成员嵌入到这种类型中。）
   <p>
   <!-- 
   Embed the component config tracing configuration struct 
   -->
   嵌入组件配置中的跟踪配置结构体。
   </p>
</td>
</tr>
</tbody>
</table>

## `Connection`     {#apiserver-k8s-io-v1beta1-Connection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelection](#apiserver-k8s-io-v1beta1-EgressSelection)

<p>
<!--
Connection provides the configuration for a single egress selection client.
-->
Connection 提供某个 Egress 选择客户端的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>proxyProtocol</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p>
   <!-- 
   Protocol is the protocol used to connect from client to the konnectivity server. 
   -->
   proxyProtocol 是客户端连接到 konnectivity 服务器所使用的协议。
   </p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1beta1-Transport"><code>Transport</code></a>
</td>
<td>
   <p>
   <!-- 
   Transport defines the transport configurations we use to dial to the konnectivity server.
   This is required if ProxyProtocol is HTTPConnect or GRPC. 
   -->
   transport 定义的是传输层的配置。我们使用这个配置来联系 konnectivity 服务器。
   当 proxyProtocol 是 HTTPConnect 或 GRPC 时需要设置此字段。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1beta1-EgressSelection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1beta1-EgressSelectorConfiguration)

<p>
<!--
EgressSelection provides the configuration for a single egress selection client.
-->
EgressSelection 为某个 Egress 选择客户端提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   name is the name of the egress selection.
   Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
   The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot; 
   -->
   name 是 Egress 选择算符的名称。当前支持的取值有 &quot;controlplane&quot;，
   &quot;master&quot;，&quot;etcd&quot; 和 &quot;cluster&quot;。
   &quot;master&quot; Egress 选择算符已被弃用，推荐使用 &quot;controlplane&quot;。
   </p>
</td>
</tr>
<tr><td><code>connection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#apiserver-k8s-io-v1beta1-Connection"><code>Connection</code></a>
</td>
<td>
   <p>
   <!--
   connection is the exact information used to configure the egress selection
   -->
   connection 是用来配置 Egress 选择算符的配置信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `ProtocolType`     {#apiserver-k8s-io-v1beta1-ProtocolType}
   
<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 类型的别名）

**出现在：**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)

<p>
<!--
ProtocolType is a set of valid values for Connection.ProtocolType
-->
ProtocolType 是 connection.protocolType 的合法值集合。
</p>

## `TCPTransport`     {#apiserver-k8s-io-v1beta1-TCPTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

<p>
<!--
TCPTransport provides the information to connect to konnectivity server via TCP
-->
TCPTransport 提供使用 TCP 连接 konnectivity 服务器时需要的信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>url</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   URL is the location of the konnectivity server to connect to.
   As an example it might be &quot;https://127.0.0.1:8131&quot;
   -->
   url 是要连接的 konnectivity 服务器的位置。例如 &quot;https://127.0.0.1:8131&quot;。
   </p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p>
   <!--
   TLSConfig is the config needed to use TLS when connecting to konnectivity server
   -->
   tlsConfig 是使用 TLS 来连接 konnectivity 服务器时需要的信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1beta1-TLSConfig}

<!--
**Appears in:**
-->
**出现在：**

- [TCPTransport](#apiserver-k8s-io-v1beta1-TCPTransport)

<p>
<!--
TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport
-->
TLSConfig 为连接 konnectivity 服务器提供身份认证信息。仅用于 TCPTransport。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.
   -->
   caBundle 是指向用来确定与 konnectivity 服务器间信任关系的 CA 证书包的文件位置。
   如果 TCPTransport.URL 前缀为 "http://" 时必须不设置，或者设置为空。
   如果 TCPTransport.URL 前缀为 "https://" 并且此字段未设置，则默认使用系统的信任根。
   </p>
</td>
</tr>
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   <p><!--
   clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   Must be configured if TCPTransport.URL is prefixed with https://
   -->
   clientKey 是与 konnectivity 服务器进行 mtls 握手时使用的客户端秘钥文件位置。
   如果 TCPTransport.URL 前缀为 http://，必须不指定或者为空；
   如果 TCPTransport.URL 前缀为 https://，必须设置。
   </p>
</td>
</tr>
<tr><td><code>clientCert</code><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   clientCert is the file location of the client certificate to be used in mtls handshakes with the konnectivity server.
   Must be absent/empty if TCPTransport.URL is prefixed with http://
   Must be configured if TCPTransport.URL is prefixed with https://
   -->
   <code>clientCert</code> 是与 konnectivity 服务器进行 mtls 握手时使用的客户端证书文件位置。
   如果 TCPTransport.URL 前缀为 http://，必须不指定或者为空；
   如果 TCPTransport.URL 前缀为 https://，必须设置。
   </p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1beta1-Transport}

<!--
**Appears in:**
-->
**出现在：**

- [Connection](#apiserver-k8s-io-v1beta1-Connection)

<p>
<!--
Transport defines the transport configurations we use to dial to the konnectivity server
-->
Transport 定义联系 konnectivity 服务器时要使用的传输层配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1beta1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p>
   <!--
   TCP is the TCP configuration for communicating with the konnectivity server via TCP
   ProxyProtocol of GRPC is not supported with TCP transport at the moment
   Requires at least one of TCP or UDS to be set
   -->
   tcp 包含通过 TCP 与 konnectivity 服务器通信时使用的 TCP 配置。
   目前使用 TCP 传输时不支持 GRPC 的 proxyProtocol。
   tcp 和 uds 二者至少设置一个。
   </p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1beta1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p>
   <!--
   UDS is the UDS configuration for communicating with the konnectivity server via UDS
   Requires at least one of TCP or UDS to be set
   -->
   uds 包含通过 UDS 与 konnectivity 服务器通信时使用的 UDS 配置。
   tcp 和 uds 二者至少设置一个。
   </p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1beta1-UDSTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1beta1-Transport)

<p>
<!--
UDSTransport provides the information to connect to konnectivity server via UDS
-->
UDSTransport 设置通过 UDS 连接 konnectivity 服务器时需要的信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>udsName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!--
   UDSName is the name of the unix domain socket to connect to konnectivity server
   This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)
   -->
   udsName 是与 konnectivity 服务器连接时使用的 UNIX 域套接字名称。
   字段取值不要求包含 unix:// 前缀。
   （例如：/etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket）
   </p>
</td>
</tr>
</tbody>
</table>  
