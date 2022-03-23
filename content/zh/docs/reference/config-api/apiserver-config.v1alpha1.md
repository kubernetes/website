---
title: kube-apiserver 配置 (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
auto_generated: true
---
<!--
title: kube-apiserver Configuration (v1alpha1)
content_type: tool-reference
package: apiserver.k8s.io/v1alpha1
auto_generated: true
-->
<!-- Package v1alpha1 is the v1alpha1 version of the API.-->
<p>包 v1alpha1 包含 API 的 v1alpha1 版本。</p>

<!--
## Resource Types
-->
## 资源类型

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

## `AdmissionConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionConfiguration}

<p><!--AdmissionConfiguration provides versioned configuration for admission controllers.-->
AdmissionConfiguration 为准入控制器提供版本化的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>

<tr><td><code>plugins</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p><!--Plugins allows specifying a configuration per admission control plugin.-->
   <code>plugins</code> 允许用户为每个准入控制插件指定设置。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration}

<p><!--EgressSelectorConfiguration provides versioned configuration for egress selector clients.-->
EgressSelectorConfiguration 为 Egress 选择算符客户端提供版本化的配置选项。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>

<tr><td><code>egressSelections</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p><!--connectionServices contains a list of egress selection client configurations-->
   <code>connectionServices</code> 包含一组 Egress 选择算符客户端配置选项。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1alpha1-TracingConfiguration}

<p><!--TracingConfiguration provides versioned configuration for tracing clients.-->
TracingConfiguration 为跟踪客户端提供版本化的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>TracingConfiguration</code></td></tr>

<tr><td><code>endpoint</code><br/>
<code>string</code>
</td>
<td>
   <p><!--
Endpoint of the collector that's running on the control-plane node.
The APIServer uses the egressType ControlPlane when sending data to the collector.
The syntax is defined in https://github.com/grpc/grpc/blob/master/doc/naming.md.
Defaults to the otlpgrpc default, localhost:4317
The connection is insecure, and does not support TLS.
-->
在控制面节点上运行的采集器的端点。
API 服务器在向采集器发送数据时将 <code>egressType</code> 设置为 ControlPlane。
这里的语法定义在 https://github.com/grpc/grpc/blob/master/doc/naming.md。
默认值为 otlpgrpc 的默认值，即 <code>localhost:4317</code>
这一连接是不安全的，且不支持 TLS。
</p>
</td>
</tr>
<tr><td><code>samplingRatePerMillion</code><br/>
<code>int32</code>
</td>
<td>
   <p><!--
SamplingRatePerMillion is the number of samples to collect per million spans.
Defaults to 0.-->
   <code>samplingRatePerMillion</code> 设置每一百万个数据点中要采样的样本个数。默认值为 0。
   </p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration}

<!--
**Appears in:**
-->
**出现在：**

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)

<p><!--AdmissionPluginConfiguration provides the configuration for a single plug-in.-->
AdmissionPluginConfiguration 为某个插件提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--Name is the name of the admission controller.
It must match the registered admission plugin name.-->
   <code>name</code> 是准入控制器的名称。此名称必须与所注册的准入插件名称匹配。
   </p>
</td>
</tr>
<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
   <p><!--Path is the path to a configuration file that contains the plugin's configuration-->
   <code>path</code> 为指向包含插件配置数据的配置文件的路径。
   </p>
</td>
</tr>
<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p><!-- Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.-->
   <code>configuration</code> 是一个嵌入的配置对象，用作插件的配置数据来源。
   如果设置了此字段，则使用此字段而不是指向配置文件的路径。
   </p>
</td>
</tr>
</tbody>
</table>

## `Connection`     {#apiserver-k8s-io-v1alpha1-Connection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelection](#apiserver-k8s-io-v1alpha1-EgressSelection)

<p><!-- Connection provides the configuration for a single egress selection client.-->
Connection 提供某个 Egress 选择客户端的配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>proxyProtocol</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p><!--Protocol is the protocol used to connect from client to the konnectivity server.-->
   <code>proxyProtocol</code> 是客户端连接到 konnectivity 服务器所使用的协议。
   </p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-Transport"><code>Transport</code></a>
</td>
<td>
   <p><!--Transport defines the transport configurations we use to dial to the konnectivity server.
This is required if ProxyProtocol is HTTPConnect or GRPC.-->
   <code>transport</code> 定义的是传输层的配置。我们使用这个配置来联系 konnectivity 服务器。
   当 <code>proxyProtocol</code> 是 HTTPConnect 或 GRPC 时需要设置此字段。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1alpha1-EgressSelection}

<!--
**Appears in:**
-->
**出现在：**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)

<p><!--EgressSelection provides the configuration for a single egress selection client.-->
EgressSelection 为某个 Egress 选择客户端提供配置信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--name is the name of the egress selection.
Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot;-->
  <code>name</code> 是 Egress 选择器的名称。当前支持的取值有 &quot;controlplane&quot;，
  &quot;master&quot;，&quot;etcd&quot; 和 &quot;cluster&quot;。
  &quot;master&quot; Egress 选择器已被弃用，推荐使用 &quot;controlplane&quot;。
  </p>
</td>
</tr>
<tr><td><code>connection</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-Connection"><code>Connection</code></a>
</td>
<td>
   <p><!--connection is the exact information used to configure the egress selection-->
   <code>connection</code> 是用来配置 Egress 选择器的配置信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `ProtocolType`     {#apiserver-k8s-io-v1alpha1-ProtocolType}

<!--
(Alias of `string`)

**Appears in:**
-->
（`string` 类型的别名）

**出现在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)

<p><!--ProtocolType is a set of valid values for Connection.ProtocolType-->
ProtocolType 是 <code>connection.protocolType</code> 的合法值集合。
</p>

## `TCPTransport`     {#apiserver-k8s-io-v1alpha1-TCPTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p><!--TCPTransport provides the information to connect to konnectivity server via TCP-->
TCPTransport 提供使用 TCP 连接 konnectivity 服务器时需要的信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>url</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--URL is the location of the konnectivity server to connect to.
As an example it might be &quot;https://127.0.0.1:8131&quot;-->
   <code>url</code> 是要连接的 konnectivity 服务器的位置。例如 &quot;https://127.0.0.1:8131&quot;。
   </p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p><!-- TLSConfig is the config needed to use TLS when connecting to konnectivity server-->
   <code>tlsConfig</code> 是使用 TLS 来连接 konnectivity 服务器时需要的信息。
   </p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1alpha1-TLSConfig}

<!--
**Appears in:**
-->
**出现在：**

- [TCPTransport](#apiserver-k8s-io-v1alpha1-TCPTransport)


<p><!--TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport-->
TLSConfig 为连接 konnectivity 服务器提供身份认证信息。仅用于 TCPTransport。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   <p><!--caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.-->
   <code>caBundle</code> 是指向用来确定与 konnectivity 服务器间信任欢喜的 CA 证书包的文件位置。
   当 <code>tcpTransport.url</code> 前缀为 "http://" 时必须不设置，或者设置为空。
   如果 <code>tcpTransport.url</code> 前缀为 "https://" 并且此字段未设置，则默认使用系统的信任根。
   </p>
</td>
</tr>
<tr><td><code>clientKey</code><br/>
<code>string</code>
</td>
<td>
   <p><!--clientKey is the file location of the client key to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://-->
   <code>clientKey</code> 是与 konnectivity 服务器进行 mtls 握手时使用的客户端秘钥文件位置。
   如果 `tcp.url` 前缀为 <code>http://</code>，必须不指定或者为空；
   如果 `tcp.url` 前缀为 <code>https://</code>，必须设置。
   </p>
</td>
</tr>
<tr><td><code>clientCert</code><br/>
<code>string</code>
</td>
<td>
   <p><!--clientCert is the file location of the client certificate to be used in mtls handshakes with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
Must be configured if TCPTransport.URL is prefixed with https://-->
   <code>clientCert</code> 是与 konnectivity 服务器进行 mtls 握手时使用的客户端证书文件位置。
   如果 `tcp.url` 前缀为 <code>http://</code>，必须不指定或者为空；
   如果 `tcp.url` 前缀为 <code>https://</code>，必须设置。
   </p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1alpha1-Transport}

<!--
**Appears in:**
-->
**出现在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)


<p><!--Transport defines the transport configurations we use to dial to the konnectivity server-->
Transport 定义联系 konnectivity 服务器时要使用的传输层配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p><!--TCP is the TCP configuration for communicating with the konnectivity server via TCP
ProxyProtocol of GRPC is not supported with TCP transport at the moment
Requires at least one of TCP or UDS to be set-->
   <code>tcp</code> 包含通过 TCP 与 konnectivity 服务器通信时使用的 TCP 配置。
   目前使用 TCP 传输时不支持 GRPC 的 <code>proxyProtocol</code>。
   <code>tcp</code> 和 <code>uds</code> 二者至少设置一个。
   </p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p><!--UDS is the UDS configuration for communicating with the konnectivity server via UDS
Requires at least one of TCP or UDS to be set-->
   <code>uds</code> 包含通过 UDS 与 konnectivity 服务器通信时使用的 UDS 配置。
   <code>tcp</code> 和 <code>uds</code> 二者至少设置一个。
   </p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1alpha1-UDSTransport}

<!--
**Appears in:**
-->
**出现在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p><!--UDSTransport provides the information to connect to konnectivity server via UDS-->
UDSTransport 设置通过 UDS 连接 konnectivity 服务器时需要的信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>udsName</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--UDSName is the name of the unix domain socket to connect to konnectivity server
This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)-->
   <code>udsName</code> 是与 konnectivity 服务器连接时使用的 UNIX 域套接字名称。
   字段取值不要求包含 <code>unix://</code> 前缀。
   （例如：<code>/etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket</code>）
   </p>
</td>
</tr>
</tbody>
</table>

