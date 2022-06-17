---
title: 客戶端身份認證（Client Authentication）(v1beta1)
content_type: tool-reference
package: client.authentication.k8s.io/v1beta1
auto_generated: true
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
## 資源型別   {#resource-types}


- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)
  
    


## `ExecCredential`     {#client-authentication-k8s-io-v1beta1-ExecCredential}
    




<!--
ExecCredential is used by exec-based plugins to communicate credentials to
HTTP transports.
-->
ExecCredential 由基於 exec 的外掛使用，與 HTTP 傳輸元件溝通憑據資訊。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>client.authentication.k8s.io/v1beta1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ExecCredential</code></td></tr>
    

  
  
<tr><td><code>spec</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
</td>
<td>
   <!--Spec holds information passed to the plugin by the transport.-->
   欄位 spec 包含由 HTTP 傳輸元件傳遞給外掛的資訊。
</td>
</tr>
    
  
<tr><td><code>status</code><br/>
<a href="#client-authentication-k8s-io-v1beta1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
</td>
<td>
   <!--Status is filled in by the plugin and holds the credentials that the transport
   should use to contact the API.-->
   欄位 status 由外掛填充，包含傳輸元件與 API 伺服器連線時需要提供的憑據。
</td>
</tr>
    
  
</tbody>
</table>
    


## `Cluster`     {#client-authentication-k8s-io-v1beta1-Cluster}
    



<!--**Appears in:**-->
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
Cluster 中包含允許 exec 外掛與 Kubernetes 叢集進行通訊身份認證時所需
的資訊。

為了確保該結構體包含需要與 Kubernetes 叢集進行通訊的所有內容（就像透過 Kubeconfig 一樣），
該欄位應該對映到 "k8s.io/client-go/tools/clientcmd/api/v1".cluster，
除了證書授權之外，由於 CA 資料將始終以位元組形式傳遞給外掛。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    

  
<tr><td><code>server</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--Server is the address of the kubernetes cluster (https://hostname:port).-->
   欄位 server 是 Kubernetes 叢集的地址（https://hostname:port）。
</td>
</tr>
    
  
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
<!--
   TLSServerName is passed to the server for SNI and is used in the client to
check server certificates against. If ServerName is empty, the hostname
used to contact the server is used.
-->
   tls-server-name 是用來提供給伺服器用作 SNI 解析的，客戶端以此檢查伺服器的證書。
   如此欄位為空，則使用連結伺服器時使用的主機名。
</td>
</tr>
    
  
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
<!-- 
   InsecureSkipTLSVerify skips the validity check for the server's certificate.
This will make your HTTPS connections insecure. 
-->
   設定此欄位之後，會令客戶端跳過對伺服器端證書的合法性檢查。
   這會使得你的 HTTPS 連結不再安全。
</td>
</tr>
    
  
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
<!-- 
   CAData contains PEM-encoded certificate authority certificates.
If empty, system roots should be used.
-->
   此欄位包含 PEM 編碼的證書機構（CA）證書。
   如果為空，則使用系統的根證書。
</td>
</tr>
    
  
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
   <!--ProxyURL is the URL to the proxy to be used for all requests to this cluster.-->
   此欄位用來設定向叢集傳送所有請求時要使用的代理伺服器。
</td>
</tr>
    
  
<tr><td><code>config</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
<!-- 
   Config holds additional config data that is specific to the exec
plugin with regards to the cluster being authenticated to.

This data is sourced from the clientcmd Cluster object's
extensions[client.authentication.k8s.io/exec] field: 
-->
   <p>此欄位包含一些額外的、特定於 exec 外掛和所連線的叢集的資料，</p>
   <p>此欄位來自於 clientcmd 叢集物件的 <code>extensions[client.authentication.k8s.io/exec]</code>
   欄位：</p>
<pre>
clusters:
- name: my-cluster
  cluster:
    ...
    extensions:
    - name: client.authentication.k8s.io/exec  # 針對每個叢集 exec 配置所預留的副檔名稱
      extension:
        audience: 06e3fbd18de8  # 任意配置資訊
</pre>
<!-- 
In some environments, the user config may be exactly the same across many clusters
(i.e. call this exec plugin) minus some details that are specific to each cluster
such as the audience.  This field allows the per cluster config to be directly
specified with the cluster info.  Using this field to store secret data is not
recommended as one of the prime benefits of exec plugins is that no secrets need
to be stored directly in the kubeconfig. 
-->
<p>在某些環境中，使用者配置可能對很多叢集而言都完全一樣（即呼叫同一個 exec 外掛），
只是針對不同叢集會有一些細節上的差異，例如 audience。
此欄位使得特定於叢集的配置可以直接使用叢集資訊來設定。
不建議使用此欄位來儲存 Secret 資料，因為 exec 外掛的主要優勢之一是不需要在
kubeconfig 中儲存 Secret 資料。</p>
</td>
</tr>
    
  
</tbody>
</table>
    


## `ExecCredentialSpec`     {#client-authentication-k8s-io-v1beta1-ExecCredentialSpec}
    



<!-- **Appears in:** -->
**出現在：**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


<!-- 
ExecCredentialSpec holds request and runtime specific information provided by
the transport. 
-->
ExecCredentialSpec 儲存傳輸元件所提供的特定於請求和執行時的資訊。

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
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
   此欄位中包含的資訊使得 exec 外掛能夠與要訪問的 Kubernetes 叢集通訊。
   注意，cluster 欄位只有在 exec 驅動的配置中 provideClusterInfo
  （即：ExecConfig.ProvideClusterInfo）被設定為 true 時才不能為空。
</td>
</tr>
    
  
</tbody>
</table>
    


## `ExecCredentialStatus`     {#client-authentication-k8s-io-v1beta1-ExecCredentialStatus}
    



<!-- **Appears in:** -->
**出現在：**

- [ExecCredential](#client-authentication-k8s-io-v1beta1-ExecCredential)


<!-- 
ExecCredentialStatus holds credentials for the transport to use.

Token and ClientKeyData are sensitive fields. This data should only be
transmitted in-memory between client and exec plugin process. Exec plugin
itself should at least be protected via file permissions.
-->
<p>ExecCredentialStatus 中包含傳輸元件要使用的憑據。</p>

<p>欄位 token 和 clientKeyData 都是敏感欄位。
此資料只能在客戶端與 exec 外掛程序之間使用記憶體來傳遞。
exec 外掛本身至少應透過檔案訪問許可來實施保護。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
    

  
<tr><td><code>expirationTimestamp</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!-- ExpirationTimestamp indicates a time when the provided credentials expire. -->
   給出所提供的憑據到期的時間。
</td>
</tr>
    
  
<tr><td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- Token is a bearer token used by the client for request authentication. -->
   客戶端用做請求身份認證的持有者令牌。
</td>
</tr>
    
  
<tr><td><code>clientCertificateData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- PEM-encoded client TLS certificates (including intermediates, if any). -->
   PEM 編碼的客戶端 TLS 證書（如果有臨時證書，也會包含）。
</td>
</tr>
    
  
<tr><td><code>clientKeyData</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!-- PEM-encoded private key for the above certificate. -->
   與上述證書對應的、PEM 編碼的私鑰。
</td>
</tr>
    
  
</tbody>
</table>
    
  
