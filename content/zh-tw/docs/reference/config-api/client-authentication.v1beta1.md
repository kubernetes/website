---
title: 客戶端身份認證（Client Authentication）(v1beta1)
content_type: tool-reference
package: client.authentication.k8s.io/v1beta1
---
<!-- 
title: Client Authentication (v1beta1)
content_type: tool-reference
package: client.authentication.k8s.io/v1beta1
auto_generated: true
-->

<!--
## Resource Types 
-->
## 資源類型   {#resource-types}

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)

## `ExecCredential`     {#client-authentication-k8s-io-v1beta1-ExecCredential}

<!--
ExecCredential is used by exec-based plugins to communicate credentials to
HTTP transports.
-->
ExecCredential 由基於 exec 的插件使用，與 HTTP 傳輸組件溝通憑據信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>client.authentication.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExecCredential</code></td></tr>

<tr>
<td><code>spec</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
</td>
<td>
   <!--
   Spec holds information passed to the plugin by the transport.
   -->

   字段 <code>spec</code> 包含由 HTTP 傳輸組件傳遞給插件的信息。
</td>
</tr>

<tr>
<td><code>status</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
</td>
<td>
   <!--
   Status is filled in by the plugin and holds the credentials that the transport
   should use to contact the API.
   -->

   字段 <code>status</code> 由插件填充，包含傳輸組件與 API 伺服器連接時需要提供的憑據。
</td>
</tr>

</tbody>
</table>

## `Cluster`     {#client-authentication-k8s-io-v1beta1-Cluster}

<!--
**Appears in:**
-->
**出現在：**

- [ExecCredentialSpec](#client-authentication-k8s-io-v1beta1-ExecCredentialSpec)

<!--
Cluster contains information to allow an exec plugin to communicate
with the kubernetes cluster being authenticated to.

To ensure that this struct contains everything someone would need to communicate
with a kubernetes cluster (just like they would via a kubeconfig), the fields
should shadow "k8s.io/client-go/tools/clientcmd/api/v1".Cluster, with the exception
of CertificateAuthority, since CA data will always be passed to the plugin as bytes.
-->
Cluster 中包含允許 exec 插件與 Kubernetes
叢集進行通信身份認證時所需的信息。

爲了確保該結構體包含需要與 Kubernetes 叢集進行通信的所有內容（就像通過 Kubeconfig 一樣），
該字段應該映射到 "k8s.io/client-go/tools/clientcmd/api/v1".cluster，
除了證書授權之外，由於 CA 數據將始終以字節形式傳遞給插件。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr>
<td><code>server</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Server is the address of the kubernetes cluster (https://hostname:port).
   -->

   字段 server 是 Kubernetes 叢集的地址（https://hostname:port）。
</td>
</tr>

<tr>
<td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
<!--
   TLSServerName is passed to the server for SNI and is used in the client to
check server certificates against. If ServerName is empty, the hostname
used to contact the server is used.
-->
   tls-server-name 是用來提供給伺服器用作 SNI 解析的，客戶端以此檢查伺服器的證書。
   如此字段爲空，則使用鏈接伺服器時使用的主機名。
</td>
</tr>

<tr>
<td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
<!-- 
   InsecureSkipTLSVerify skips the validity check for the server's certificate.
This will make your HTTPS connections insecure. 
-->
   設置此字段之後，會令客戶端跳過對伺服器端證書的合法性檢查。
   這會使得你的 HTTPS 鏈接不再安全。
</td>
</tr>

<tr>
<td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
<!-- 
   CAData contains PEM-encoded certificate authority certificates.
If empty, system roots should be used.
-->
   此字段包含 PEM 編碼的證書機構（CA）證書。
   如果爲空，則使用系統的根證書。
</td>
</tr>

<tr>
<td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <!--
   ProxyURL is the URL to the proxy to be used for all requests to this cluster.
   -->

   此字段用來設置向叢集發送所有請求時要使用的代理伺服器。
</td>
</tr>

<tr>
<td><code>disable-compression</code><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!--
   DisableCompression allows client to opt-out of response compression for all requests to the server. This is useful
   to speed up requests (specifically lists) when client-server network bandwidth is ample, by saving time on
   compression (server-side) and decompression (client-side): https://github.com/kubernetes/kubernetes/issues/112296.
   -->

   disable-compression 允許客戶端針對到伺服器的所有請求選擇取消響應壓縮。
   當客戶端伺服器網路帶寬充足時，這有助於通過節省壓縮（伺服器端）和解壓縮
   （客戶端）時間來加快請求（特別是列表）的速度：
   https://github.com/kubernetes/kubernetes/issues/112296。
   </p>
</td>
</tr>

<tr>
<td><code>config</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
<p>
<!-- 
   Config holds additional config data that is specific to the exec
plugin with regards to the cluster being authenticated to.
-->
此字段包含一些額外的、特定於 exec 插件和所連接的叢集的數據。
</p>
<p>
<!--
This data is sourced from the clientcmd Cluster object's
extensions[client.authentication.k8s.io/exec] field: 
-->
此字段來自於 clientcmd 叢集對象的
<code>extensions[client.authentication.k8s.io/exec]</code> 字段：
</p>
<pre>
<!--
clusters:
- name: my-cluster
  cluster:
    ...
    extensions:
    - name: client.authentication.k8s.io/exec  # reserved extension name for per cluster exec config
      extension:
        audience: 06e3fbd18de8  # arbitrary config
-->
clusters:
- name: my-cluster
  cluster:
    ...
    extensions:
    - name: client.authentication.k8s.io/exec  # 針對每個叢集 exec 設定所預留的擴展名稱
      extension:
        audience: 06e3fbd18de8  # 任意設定信息
</pre>
<p>
<!-- 
In some environments, the user config may be exactly the same across many clusters
(i.e. call this exec plugin) minus some details that are specific to each cluster
such as the audience.  This field allows the per cluster config to be directly
specified with the cluster info.  Using this field to store secret data is not
recommended as one of the prime benefits of exec plugins is that no secrets need
to be stored directly in the kubeconfig. 
-->
在某些環境中，使用者設定可能對很多叢集而言都完全一樣（即調用同一個 exec 插件），
只是針對不同叢集會有一些細節上的差異，例如 audience。
此字段使得特定於叢集的設定可以直接使用叢集信息來設置。
不建議使用此字段來保存 Secret 數據，因爲 exec 插件的主要優勢之一是不需要在
Kubeconfig 中保存 Secret 數據。
</p>
</td>
</tr>
  
</tbody>
</table>

## `ExecCredentialSpec`     {#client-authentication-k8s-io-v1beta1-ExecCredentialSpec}

<!--
**Appears in:**
-->
**出現在：**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)

<!-- 
ExecCredentialSpec holds request and runtime specific information provided by
the transport. 
-->
ExecCredentialSpec 保存傳輸組件所提供的特定於請求和運行時的信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>cluster</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-Cluster"><code>Cluster</code></a>
</td>
<td>
<!-- 
   Cluster contains information to allow an exec plugin to communicate with the
kubernetes cluster being authenticated to. Note that Cluster is non-nil only
when provideClusterInfo is set to true in the exec provider config (i.e.,
ExecConfig.ProvideClusterInfo).
-->
   此字段中包含的信息使得 exec 插件能夠與要訪問的 Kubernetes 叢集通信。
   注意，cluster 字段只有在 exec 驅動的設定中 provideClusterInfo
  （即：<code>ExecConfig.ProvideClusterInfo</code>）被設置爲 true 時纔不能爲空。
</td>
</tr>

</tbody>
</table>

## `ExecCredentialStatus`     {#client-authentication-k8s-io-v1beta1-ExecCredentialStatus}

<!--
**Appears in:**
-->
**出現在：**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)

<p>
<!--
ExecCredentialStatus holds credentials for the transport to use.
-->
ExecCredentialStatus 中包含傳輸組件要使用的憑據。
</p>

<p>
<!--
Token and ClientKeyData are sensitive fields. This data should only be
transmitted in-memory between client and exec plugin process. Exec plugin
itself should at least be protected via file permissions.
-->
字段 token 和 clientKeyData 都是敏感字段。
此數據只能在客戶端與 exec 插件進程之間使用內存來傳遞。
exec 插件本身至少應通過文件訪問許可來實施保護。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr>
<td><code>expirationTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   ExpirationTimestamp indicates a time when the provided credentials expire.
   -->

   給出所提供的憑據到期的時間。
</td>
</tr>

<tr>
<td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Token is a bearer token used by the client for request authentication.
   -->

   客戶端用做請求身份認證的持有者令牌。
</td>
</tr>

<tr>
<td><code>clientCertificateData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   PEM-encoded client TLS certificates (including intermediates, if any).
   -->

   PEM 編碼的客戶端 TLS 證書（如果有臨時證書，也會包含）。
</td>
</tr>

<tr>
<td><code>clientKeyData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   PEM-encoded private key for the above certificate.
   -->

   與上述證書對應的、PEM 編碼的私鑰。
</td>
</tr>

</tbody>
</table>
