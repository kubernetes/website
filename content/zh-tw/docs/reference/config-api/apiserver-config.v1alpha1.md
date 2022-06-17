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
## 資源型別

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)
- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)
- [TracingConfiguration](#apiserver-k8s-io-v1alpha1-TracingConfiguration)

## `AdmissionConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionConfiguration}

<p><!--AdmissionConfiguration provides versioned configuration for admission controllers.-->
AdmissionConfiguration 為準入控制器提供版本化的配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>AdmissionConfiguration</code></td></tr>

<tr><td><code>plugins</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration"><code>[]AdmissionPluginConfiguration</code></a>
</td>
<td>
   <p><!--Plugins allows specifying a configuration per admission control plugin.-->
   <code>plugins</code> 允許使用者為每個准入控制外掛指定設定。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelectorConfiguration`     {#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration}

<p><!--EgressSelectorConfiguration provides versioned configuration for egress selector clients.-->
EgressSelectorConfiguration 為 Egress 選擇算符客戶端提供版本化的配置選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>apiserver.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>EgressSelectorConfiguration</code></td></tr>

<tr><td><code>egressSelections</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-EgressSelection"><code>[]EgressSelection</code></a>
</td>
<td>
   <p><!--connectionServices contains a list of egress selection client configurations-->
   <code>connectionServices</code> 包含一組 Egress 選擇算符客戶端配置選項。
   </p>
</td>
</tr>
</tbody>
</table>

## `TracingConfiguration`     {#apiserver-k8s-io-v1alpha1-TracingConfiguration}

<p><!--TracingConfiguration provides versioned configuration for tracing clients.-->
TracingConfiguration 為跟蹤客戶端提供版本化的配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
在控制面節點上執行的採集器的端點。
API 伺服器在向採集器傳送資料時將 <code>egressType</code> 設定為 ControlPlane。
這裡的語法定義在 https://github.com/grpc/grpc/blob/master/doc/naming.md。
預設值為 otlpgrpc 的預設值，即 <code>localhost:4317</code>
這一連線是不安全的，且不支援 TLS。
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
   <code>samplingRatePerMillion</code> 設定每一百萬個數據點中要取樣的樣本個數。預設值為 0。
   </p>
</td>
</tr>
</tbody>
</table>

## `AdmissionPluginConfiguration`     {#apiserver-k8s-io-v1alpha1-AdmissionPluginConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [AdmissionConfiguration](#apiserver-k8s-io-v1alpha1-AdmissionConfiguration)

<p><!--AdmissionPluginConfiguration provides the configuration for a single plug-in.-->
AdmissionPluginConfiguration 為某個外掛提供配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--Name is the name of the admission controller.
It must match the registered admission plugin name.-->
   <code>name</code> 是准入控制器的名稱。此名稱必須與所註冊的准入外掛名稱匹配。
   </p>
</td>
</tr>
<tr><td><code>path</code><br/>
<code>string</code>
</td>
<td>
   <p><!--Path is the path to a configuration file that contains the plugin's configuration-->
   <code>path</code> 為指向包含外掛配置資料的配置檔案的路徑。
   </p>
</td>
</tr>
<tr><td><code>configuration</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime#Unknown"><code>k8s.io/apimachinery/pkg/runtime.Unknown</code></a>
</td>
<td>
   <p><!-- Configuration is an embedded configuration object to be used as the plugin's
configuration. If present, it will be used instead of the path to the configuration file.-->
   <code>configuration</code> 是一個嵌入的配置物件，用作外掛的配置資料來源。
   如果設定了此欄位，則使用此欄位而不是指向配置檔案的路徑。
   </p>
</td>
</tr>
</tbody>
</table>

## `Connection`     {#apiserver-k8s-io-v1alpha1-Connection}

<!--
**Appears in:**
-->
**出現在：**

- [EgressSelection](#apiserver-k8s-io-v1alpha1-EgressSelection)

<p><!-- Connection provides the configuration for a single egress selection client.-->
Connection 提供某個 Egress 選擇客戶端的配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>proxyProtocol</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-ProtocolType"><code>ProtocolType</code></a>
</td>
<td>
   <p><!--Protocol is the protocol used to connect from client to the konnectivity server.-->
   <code>proxyProtocol</code> 是客戶端連線到 konnectivity 伺服器所使用的協議。
   </p>
</td>
</tr>
<tr><td><code>transport</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-Transport"><code>Transport</code></a>
</td>
<td>
   <p><!--Transport defines the transport configurations we use to dial to the konnectivity server.
This is required if ProxyProtocol is HTTPConnect or GRPC.-->
   <code>transport</code> 定義的是傳輸層的配置。我們使用這個配置來聯絡 konnectivity 伺服器。
   當 <code>proxyProtocol</code> 是 HTTPConnect 或 GRPC 時需要設定此欄位。
   </p>
</td>
</tr>
</tbody>
</table>

## `EgressSelection`     {#apiserver-k8s-io-v1alpha1-EgressSelection}

<!--
**Appears in:**
-->
**出現在：**

- [EgressSelectorConfiguration](#apiserver-k8s-io-v1alpha1-EgressSelectorConfiguration)

<p><!--EgressSelection provides the configuration for a single egress selection client.-->
EgressSelection 為某個 Egress 選擇客戶端提供配置資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--name is the name of the egress selection.
Currently supported values are &quot;controlplane&quot;, &quot;master&quot;, &quot;etcd&quot; and &quot;cluster&quot;
The &quot;master&quot; egress selector is deprecated in favor of &quot;controlplane&quot;-->
  <code>name</code> 是 Egress 選擇器的名稱。當前支援的取值有 &quot;controlplane&quot;，
  &quot;master&quot;，&quot;etcd&quot; 和 &quot;cluster&quot;。
  &quot;master&quot; Egress 選擇器已被棄用，推薦使用 &quot;controlplane&quot;。
  </p>
</td>
</tr>
<tr><td><code>connection</code> <B>[必需]</B><br/>
<a href="#apiserver-k8s-io-v1alpha1-Connection"><code>Connection</code></a>
</td>
<td>
   <p><!--connection is the exact information used to configure the egress selection-->
   <code>connection</code> 是用來配置 Egress 選擇器的配置資訊。
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
（`string` 型別的別名）

**出現在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)

<p><!--ProtocolType is a set of valid values for Connection.ProtocolType-->
ProtocolType 是 <code>connection.protocolType</code> 的合法值集合。
</p>

## `TCPTransport`     {#apiserver-k8s-io-v1alpha1-TCPTransport}

<!--
**Appears in:**
-->
**出現在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p><!--TCPTransport provides the information to connect to konnectivity server via TCP-->
TCPTransport 提供使用 TCP 連線 konnectivity 伺服器時需要的資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>url</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--URL is the location of the konnectivity server to connect to.
As an example it might be &quot;https://127.0.0.1:8131&quot;-->
   <code>url</code> 是要連線的 konnectivity 伺服器的位置。例如 &quot;https://127.0.0.1:8131&quot;。
   </p>
</td>
</tr>
<tr><td><code>tlsConfig</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TLSConfig"><code>TLSConfig</code></a>
</td>
<td>
   <p><!-- TLSConfig is the config needed to use TLS when connecting to konnectivity server-->
   <code>tlsConfig</code> 是使用 TLS 來連線 konnectivity 伺服器時需要的資訊。
   </p>
</td>
</tr>
</tbody>
</table>

## `TLSConfig`     {#apiserver-k8s-io-v1alpha1-TLSConfig}

<!--
**Appears in:**
-->
**出現在：**

- [TCPTransport](#apiserver-k8s-io-v1alpha1-TCPTransport)


<p><!--TLSConfig provides the authentication information to connect to konnectivity server
Only used with TCPTransport-->
TLSConfig 為連線 konnectivity 伺服器提供身份認證資訊。僅用於 TCPTransport。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>caBundle</code><br/>
<code>string</code>
</td>
<td>
   <p><!--caBundle is the file location of the CA to be used to determine trust with the konnectivity server.
Must be absent/empty if TCPTransport.URL is prefixed with http://
If absent while TCPTransport.URL is prefixed with https://, default to system trust roots.-->
   <code>caBundle</code> 是指向用來確定與 konnectivity 伺服器間信任歡喜的 CA 證書包的檔案位置。
   當 <code>tcpTransport.url</code> 字首為 "http://" 時必須不設定，或者設定為空。
   如果 <code>tcpTransport.url</code> 字首為 "https://" 並且此欄位未設定，則預設使用系統的信任根。
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
   <code>clientKey</code> 是與 konnectivity 伺服器進行 mtls 握手時使用的客戶端秘鑰檔案位置。
   如果 `tcp.url` 字首為 <code>http://</code>，必須不指定或者為空；
   如果 `tcp.url` 字首為 <code>https://</code>，必須設定。
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
   <code>clientCert</code> 是與 konnectivity 伺服器進行 mtls 握手時使用的客戶端證書檔案位置。
   如果 `tcp.url` 字首為 <code>http://</code>，必須不指定或者為空；
   如果 `tcp.url` 字首為 <code>https://</code>，必須設定。
   </p>
</td>
</tr>
</tbody>
</table>

## `Transport`     {#apiserver-k8s-io-v1alpha1-Transport}

<!--
**Appears in:**
-->
**出現在：**

- [Connection](#apiserver-k8s-io-v1alpha1-Connection)


<p><!--Transport defines the transport configurations we use to dial to the konnectivity server-->
Transport 定義聯絡 konnectivity 伺服器時要使用的傳輸層配置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>tcp</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-TCPTransport"><code>TCPTransport</code></a>
</td>
<td>
   <p><!--TCP is the TCP configuration for communicating with the konnectivity server via TCP
ProxyProtocol of GRPC is not supported with TCP transport at the moment
Requires at least one of TCP or UDS to be set-->
   <code>tcp</code> 包含透過 TCP 與 konnectivity 伺服器通訊時使用的 TCP 配置。
   目前使用 TCP 傳輸時不支援 GRPC 的 <code>proxyProtocol</code>。
   <code>tcp</code> 和 <code>uds</code> 二者至少設定一個。
   </p>
</td>
</tr>
<tr><td><code>uds</code><br/>
<a href="#apiserver-k8s-io-v1alpha1-UDSTransport"><code>UDSTransport</code></a>
</td>
<td>
   <p><!--UDS is the UDS configuration for communicating with the konnectivity server via UDS
Requires at least one of TCP or UDS to be set-->
   <code>uds</code> 包含透過 UDS 與 konnectivity 伺服器通訊時使用的 UDS 配置。
   <code>tcp</code> 和 <code>uds</code> 二者至少設定一個。
   </p>
</td>
</tr>
</tbody>
</table>

## `UDSTransport`     {#apiserver-k8s-io-v1alpha1-UDSTransport}

<!--
**Appears in:**
-->
**出現在：**

- [Transport](#apiserver-k8s-io-v1alpha1-Transport)

<p><!--UDSTransport provides the information to connect to konnectivity server via UDS-->
UDSTransport 設定透過 UDS 連線 konnectivity 伺服器時需要的資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>udsName</code> <B>[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p><!--UDSName is the name of the unix domain socket to connect to konnectivity server
This does not use a unix:// prefix. (Eg: /etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket)-->
   <code>udsName</code> 是與 konnectivity 伺服器連線時使用的 UNIX 域套接字名稱。
   欄位取值不要求包含 <code>unix://</code> 字首。
   （例如：<code>/etc/srv/kubernetes/konnectivity-server/konnectivity-server.socket</code>）
   </p>
</td>
</tr>
</tbody>
</table>

