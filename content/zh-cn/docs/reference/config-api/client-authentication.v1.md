---
title: 客户端身份认证（Client Authentication） (v1)
content_type: tool-reference
package: client.authentication.k8s.io/v1
---
<!--
title: Client Authentication (v1)
content_type: tool-reference
package: client.authentication.k8s.io/v1
auto_generated: true
-->

<!--
## Resource Types 
-->
## 资源类型   {#resource-types}

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)
  
## `ExecCredential`     {#client-authentication-k8s-io-v1-ExecCredential}

<!--
ExecCredential is used by exec-based plugins to communicate credentials to
HTTP transports.
-->
ExecCredential 由基于 exec 的插件使用，与 HTTP 传输组件沟通凭据信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>client.authentication.k8s.io/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExecCredential</code></td></tr>
    
<tr><td><code>spec</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#client-authentication-k8s-io-v1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
</td>
<td>
   <!--Spec holds information passed to the plugin by the transport.-->
   字段 spec 包含由 HTTP 传输组件传递给插件的信息。
</td>
</tr>

<tr><td><code>status</code><br/>
<a href="#client-authentication-k8s-io-v1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
</td>
<td>
   <!--Status is filled in by the plugin and holds the credentials that the transport
   should use to contact the API.-->
   字段 status 由插件填充，包含传输组件与 API 服务器连接时需要提供的凭据。
</td>
</tr>
</tbody>
</table>

## `Cluster`     {#client-authentication-k8s-io-v1-Cluster}

<!--
**Appears in:**
-->
**出现在：**

- [ExecCredentialSpec](#client-authentication-k8s-io-v1-ExecCredentialSpec)

<!--
Cluster contains information to allow an exec plugin to communicate
with the kubernetes cluster being authenticated to.

To ensure that this struct contains everything someone would need to communicate
with a kubernetes cluster (just like they would via a kubeconfig), the fields
should shadow "k8s.io/client-go/tools/clientcmd/api/v1".Cluster, with the exception
of CertificateAuthority, since CA data will always be passed to the plugin as bytes.
-->
Cluster 中包含允许 exec 插件与 Kubernetes 集群进行通信身份认证时所需
的信息。

为了确保该结构体包含需要与 Kubernetes 集群进行通信的所有内容（就像通过 Kubeconfig 一样），
除了证书授权之外，该字段应该映射到 "k8s.io/client-go/tools/clientcmd/api/v1".cluster，
由于 CA 数据将始终以字节形式传递给插件。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>server</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--Server is the address of the kubernetes cluster (https://hostname:port).-->
   字段 server 是 Kubernetes 集群的地址（https://hostname:port）。
</td>
</tr>

<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
   <!--TLSServerName is passed to the server for SNI and is used in the client to
   check server certificates against. If ServerName is empty, the hostname
   used to contact the server is used.-->
   tls-server-name 是用来提供给服务器用作 SNI 解析的，客户端以此检查服务器的证书。
   如此字段为空，则使用链接服务器时使用的主机名。
</td>
</tr>

<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
   <!--InsecureSkipTLSVerify skips the validity check for the server's certificate.
   This will make your HTTPS connections insecure.-->
   设置此字段之后，会令客户端跳过对服务器端证书的合法性检查。
   这会使得你的 HTTPS 链接不再安全。
</td>
</tr>

<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
   <!--CAData contains PEM-encoded certificate authority certificates.
   If empty, system roots should be used.-->
   此字段包含 PEM 编码的证书机构（CA）证书。
   如果为空，则使用系统的根证书。
</td>
</tr>

<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <!--ProxyURL is the URL to the proxy to be used for all requests to this
   cluster.-->
   此字段用来设置向集群发送所有请求时要使用的代理服务器。
</td>
</tr>

<tr><td><code>disable-compression</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   DisableCompression allows client to opt-out of response compression for all requests to the server. This is useful
   to speed up requests (specifically lists) when client-server network bandwidth is ample, by saving time on
   compression (server-side) and decompression (client-side): https://github.com/kubernetes/kubernetes/issues/112296.
   -->
   <p>disable-compression 允许客户端针对到服务器的所有请求选择取消响应压缩。
   当客户端服务器网络带宽充足时，这有助于通过节省压缩（服务器端）和解压缩（客户端）时间来加快请求（特别是列表）的速度：
   https://github.com/kubernetes/kubernetes/issues/112296。</p>
</td>
</tr>

<tr><td><code>config</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
   <!--Config holds additional config data that is specific to the exec
   plugin with regards to the cluster being authenticated to.

   This data is sourced from the clientcmd Cluster object's
   extensions[client.authentication.k8s.io/exec] field:
   -->
   <p>此字段包含一些额外的、特定于 exec 插件和所连接的集群的数据，</p>
   <p>此字段来自于 clientcmd 集群对象的 <code>extensions[client.authentication.k8s.io/exec]</code>
   字段：</p>
<pre>
clusters:
- name: my-cluster
  cluster:
    ...
    extensions:
    - name: client.authentication.k8s.io/exec  # 针对每个集群 exec 配置所预留的扩展名称
      extension:
        audience: 06e3fbd18de8  # 任意配置信息
</pre>

   <!--In some environments, the user config may be exactly the same across many clusters
   (i.e. call this exec plugin) minus some details that are specific to each cluster
   such as the audience.  This field allows the per cluster config to be directly
   specified with the cluster info.  Using this field to store secret data is not
   recommended as one of the prime benefits of exec plugins is that no secrets need
   to be stored directly in the kubeconfig.-->
   <p>在某些环境中，用户配置可能对很多集群而言都完全一样（即调用同一个 exec 插件），
   只是针对不同集群会有一些细节上的差异，例如 audience。
   此字段使得特定于集群的配置可以直接使用集群信息来设置。
   不建议使用此字段来保存 Secret 数据，因为 exec 插件的主要优势之一是不需要在
   kubeconfig 中保存 Secret 数据。</p>
</td>
</tr>
</tbody>
</table>

## `ExecCredentialSpec`     {#client-authentication-k8s-io-v1-ExecCredentialSpec}
    
<!--
**Appears in:**
-->
**出现在：**

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)

<!--
ExecCredentialSpec holds request and runtime specific information provided by
the transport.
-->
ExecCredentialSpec 保存传输组件所提供的特定于请求和运行时的信息。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>cluster</code><br/>
<a href="#client-authentication-k8s-io-v1-Cluster"><code>Cluster</code></a>
</td>
<td>
   <!--Cluster contains information to allow an exec plugin to communicate with the
   kubernetes cluster being authenticated to. Note that Cluster is non-nil only
   when provideClusterInfo is set to true in the exec provider config (i.e.,
   ExecConfig.ProvideClusterInfo).-->
   此字段中包含的信息使得 exec 插件能够与要访问的 Kubernetes 集群通信。
   注意，cluster 字段只有在 exec 驱动的配置中 provideClusterInfo
  （即：ExecConfig.ProvideClusterInfo）被设置为 true 时才不能为空。
</td>
</tr>

<tr><td><code>interactive</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <!--Interactive declares whether stdin has been passed to this exec plugin.-->
   此字段用来标明标准输出信息是否已传递给 exec 插件。
</td>
</tr>
</tbody>
</table>

## `ExecCredentialStatus`     {#client-authentication-k8s-io-v1-ExecCredentialStatus}

<!--
**Appears in:**
-->
**出现在：**

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)

<!--
ExecCredentialStatus holds credentials for the transport to use.

Token and ClientKeyData are sensitive fields. This data should only be
transmitted in-memory between client and exec plugin process. Exec plugin
itself should at least be protected via file permissions.
-->
<p>ExecCredentialStatus 中包含传输组件要使用的凭据。</p>
<p>字段 token 和 clientKeyData 都是敏感字段。此数据只能在
客户端与 exec 插件进程之间使用内存来传递。exec 插件本身至少
应通过文件访问许可来实施保护。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
<tr><td><code>expirationTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--ExpirationTimestamp indicates a time when the provided credentials expire.-->
   给出所提供的凭据到期的时间。
</td>
</tr>

<tr><td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--Token is a bearer token used by the client for request authentication.-->
   客户端用做请求身份认证的持有者令牌。
</td>
</tr>

<tr><td><code>clientCertificateData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--PEM-encoded client TLS certificates (including intermediates, if any).-->
   PEM 编码的客户端 TLS 证书（如果有临时证书，也会包含）。
</td>
</tr>

<tr><td><code>clientKeyData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--PEM-encoded private key for the above certificate.-->
   与上述证书对应的、PEM 编码的私钥。
</td>
</tr>
</tbody>
</table>
