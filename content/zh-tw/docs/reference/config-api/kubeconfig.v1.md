---
title: kubeconfig (v1)
content_type: tool-reference
package: v1
---

<!--
title: kubeconfig (v1)
content_type: tool-reference
package: v1
auto_generated: true
-->

<!--
## Resource Types
-->
## 資源類型

- [Config](#Config)

## `Config`     {#Config}

<!--
Config holds the information needed to build connect to remote kubernetes clusters as a given user
-->
<p>Config 保存以給定使用者身份構建連接到遠程 Kubernetes 叢集所需的信息 </p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>/v1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>Config</code></td></tr>

<tr><td><code>kind</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Legacy field from pkg/api/types.go TypeMeta.TODO(jlowdermilk): remove this after eliminating downstream dependencies.
  -->
   <p>來自 pkg/api/types.go TypeMeta 的遺留字段。</p>
</td>
</tr>
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Legacy field from pkg/api/types.go TypeMeta. TODO(jlowdermilk): remove this after eliminating downstream dependencies.
  -->
   <p>來自 pkg/api/types.go TypeMeta 的遺留字段。</p>
</td>
</tr>
<tr><td><code>preferences</code><B><!--[Required]-->[必需]</B><br/>
<a href="#Preferences"><code>Preferences</code></a>
</td>
<td>
  <!--
  Preferences holds general information to be use for cli interactions.
  Deprecated: this field is deprecated in v1.34. It is not used by any of the Kubernetes components.
  -->
  <p><code>preferences</code>保存用於 CLI 交互的一般信息。
  已棄用：此字段在 v1.34 中被棄用。所有 Kubernetes 組件都沒有使用這個字段。
  </p>
</td>
</tr>
<tr><td><code>clusters</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedCluster"><code>[]NamedCluster</code></a>
</td>
<td>
  <!--
  Clusters is a map of referenceable names to cluster configs.
  -->
   <p><code>clusters</code> 是從可引用名稱到叢集設定的映射。</p>
</td>
</tr>
<tr><td><code>users</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedAuthInfo"><code>[]NamedAuthInfo</code></a>
</td>
<td>
  <!--
  AuthInfos is a map of referenceable names to user configs.
  -->
   <p><code>users</code> 是一個從可引用名稱到使用者設定的映射。</p>
</td>
</tr>
<tr><td><code>contexts</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedContext"><code>[]NamedContext</code></a>
</td>
<td>
  <!--
  Contexts is a map of referenceable names to context configs.
  -->
  <p><code>contexts</code> 是從可引用名稱到上下文設定的映射。</p>
</td>
</tr>
<tr><td><code>current-context</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  CurrentContext is the name of the context that you would like to use by default.
  -->
  <p><code>current-context</code> 是默認情況下你想使用的上下文的名稱。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields.
  -->
  <p><code>extensions</code> 保存額外信息。這對於擴展程序是有用的，目的是使讀寫操作不會破解未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `AuthInfo`     {#AuthInfo}

<!--
**Appears in:**
-->
**出現在:**

- [NamedAuthInfo](#NamedAuthInfo)

<!--
AuthInfo contains information that describes identity information.  This is use to tell the kubernetes cluster who you are.
-->
<p>AuthInfo 包含描述身份信息的信息。這一信息用來告訴 kubernetes 叢集你是誰。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>client-certificate</code><br/>
<code>string</code>
</td>
<td>
  <!--
  ClientCertificate is the path to a client cert file for TLS
  -->
  <p><code>client-certificate</code> 是 TLS 客戶端證書文件的路徑。</p>
</td>
</tr>
<tr><td><code>client-certificate-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  ClientCertificateData contains PEM-encoded data from a client cert file for TLS. Overrides ClientCertificate
  -->
  <p><code>client-certificate-data</code> 包含用於 TLS 連接的、來自客戶端證書的 PEM 編碼的數據。
  此字段值會覆蓋 <code>client-certificate</code> 內容。</p>
</td>
</tr>
<tr><td><code>client-key</code><br/>
<code>string</code>
</td>
<td>
  <!--
  ClientKey is the path to a client key file for TLS
  -->
  <p><code>client-key</code> 是用於 TLS 連接的客戶端密鑰文件的路徑。</p>
</td>
</tr>
<tr><td><code>client-key-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  ClientKeyData contains PEM-encoded data from a client key file for TLS. Overrides ClientKey
  -->
   <p><code>client-key-data</code> 包含用於 TLS 連接的、來自客戶端密鑰文件的
   PEM 編碼數據。此數據會覆蓋 <code>client-key</code> 的內容。</p>
</td>
</tr>
<tr><td><code>token</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Token is the bearer token for authentication to the kubernetes cluster
  -->
  <p><code>token</code> 是用於向 kubernetes 叢集進行身份驗證的持有者令牌。</p>
</td>
</tr>
<tr><td><code>tokenFile</code><br/>
<code>string</code>
</td>
<td>
  <!--
  TokenFile is a pointer to a file that contains a bearer token (as described above).
  If both Token and TokenFile are present, the TokenFile will be periodically read and
  the last successfully read value takes precedence over Token.
  -->
  <p><code>tokenFile</code> 是一個指針，指向包含有持有者令牌（如上所述）的文件。
  如果 <code>token</code> 和 <code>tokenFile</code> 都存在，則系統會週期性地讀取
  <code>tokenFile</code> 文件，並且最近一次成功讀入的內容會優先於 <code>token</code> 內容。
  </p>
</td>
</tr>
<tr><td><code>as</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Impersonate is the username to impersonate.  The name matches the flag.
  -->
  <p><code>as</code> 是要冒充的使用者名。名字與命令列標誌相匹配。</p>
</td>
</tr>
<tr><td><code>as-uid</code><br/>
<code>string</code>
</td>
<td>
  <!--
  ImpersonateUID is the uid to impersonate.
  -->
  <p><code>as-uid</code> 是要冒充的 UID。</p>
</td>
</tr>
<tr><td><code>as-groups</code><br/>
<code>[]string</code>
</td>
<td>
  <!--
  ImpersonateGroups is the groups to impersonate.
  -->
  <p><code>as-groups</code> 是要冒充的使用者組。</p>
</td>
</tr>
<tr><td><code>as-user-extra</code><br/>
<code>map[string][]string</code>
</td>
<td>
  <!--
  ImpersonateUserExtra contains additional information for impersonated user.
  -->
  <p><code>as-user-extra</code> 包含與要冒充的使用者相關的額外信息。</p>
</td>
</tr>
<tr><td><code>username</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Username is the username for basic authentication to the kubernetes cluster.
  -->
  <p><code>username</code> 是向 Kubernetes 叢集進行基本認證的使用者名。</p>
</td>
</tr>
<tr><td><code>password</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Password is the password for basic authentication to the kubernetes cluster.
  -->
  <p><code>password</code> 是向 Kubernetes 叢集進行基本認證的密碼。</p>
</td>
</tr>
<tr><td><code>auth-provider</code><br/>
<a href="#AuthProviderConfig"><code>AuthProviderConfig</code></a>
</td>
<td>
  <!--
  AuthProvider specifies a custom authentication plugin for the kubernetes cluster.
  -->
  <p><code>auth-provider</code> 給出用於給定 Kubernetes 叢集的自定義身份驗證插件。</p>
</td>
</tr>
<tr><td><code>exec</code><br/>
<a href="#ExecConfig"><code>ExecConfig</code></a>
</td>
<td>
  <!--
  Exec specifies a custom exec-based authentication plugin for the kubernetes cluster.
  -->
  <p><code>exec</code> 指定了針對某 Kubernetes 叢集的基於 <code>exec</code>
  的自定義身份認證插件。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields.
  -->
  <p><code>extensions</code> 保存一些額外信息。這些信息對於擴展程序是有用的，目的是確保讀寫操作不會破壞未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `AuthProviderConfig`     {#AuthProviderConfig}

<!--
**Appears in:**
-->
**出現在:**

- [AuthInfo](#AuthInfo)

<!--
AuthProviderConfig holds the configuration for a specified auth provider.
-->
<p>AuthProviderConfig 保存特定於某認證提供機制的設定。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>設定選項名稱。</p>
</td>
</tr>
<tr><td><code>config</code><B><!--[Required]-->[必需]</B><br/>
<code>map[string]string</code>
</td>
<td>
   <p>設定選項取值映射。</p>
</td>
</tr>
</tbody>
</table>

## `Cluster`     {#Cluster}

<!--
**Appears in:**
-->
**出現在:**

- [NamedCluster](#NamedCluster)

<!--
Cluster contains information about how to communicate with a kubernetes cluster.
-->
<p>Cluster 包含有關如何與 Kubernetes 叢集通信的信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>server</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Server is the address of the kubernetes cluster (https://hostname:port).
  -->
  <p><code>server</code> 是 Kubernetes 叢集的地址（形式爲 https://hostname:port）。</p>
</td>
</tr>
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
  <!--
  TLSServerName is used to check server certificate. If TLSServerName is empty, the hostname used to contact the server is used.
  -->
  <p><code>tls-server-name</code> 用於檢查伺服器證書。如果 <code>tls-server-name</code>
  是空的，則使用用於聯繫伺服器的主機名。</p>
</td>
</tr>
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
  <!--
  InsecureSkipTLSVerify skips the validity check for the server's certificate. This will make your HTTPS connections insecure.
  --->
  <p><code>insecure-skip-tls-verify</code> 跳過伺服器證書的有效性檢查。
  這樣做將使你的 HTTPS 連接不安全。</p>
</td>
</tr>
<tr><td><code>certificate-authority</code><br/>
<code>string</code>
</td>
<td>
  <!--
  CertificateAuthority is the path to a cert file for the certificate authority.
  -->
  <p><code>certificate-authority</code> 是證書機構的證書文件的路徑。</p>
</td>
</tr>
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  CertificateAuthorityData contains PEM-encoded certificate authority certificates. Overrides CertificateAuthority
  -->
  <p><code>certificate-authority-data</code> 包含 PEM 編碼的證書機構證書。
  覆蓋 <code>certificate-authority</code> 的設置值。</p>
</td>
</tr>
<tr><td><code>proxy-url</code><br/>
<code>string</code>
</td>
<td>
  <!--
  ProxyURL is the URL to the proxy to be used for all requests made by this
  client. URLs with &quot;http&quot;, &quot;https&quot;, and &quot;socks5&quot; schemes are supported.  If
  this configuration is not provided or the empty string, the client
  attempts to construct a proxy configuration from http_proxy and
  https_proxy environment variables. If these environment variables are not
  set, the client does not attempt to proxy requests.
  -->
  <p><code>proxy-url</code> 是代理的 URL，該代理用於此客戶端的所有請求。
  帶有 &quot;http&quot;、&quot;https&quot; 和 &quot;socks5&quot; 的 URL 是被支持的。
  如果未提供此設定或爲空字符串，客戶端嘗試使用 <code>http_proxy</code> 和
  <code>https_proxy</code> 環境變量構建代理設定。
  如果這些環境變量也沒有設置, 客戶端不會嘗試代理請求。
  </p>

  <!--
  socks5 proxying does not currently support spdy streaming endpoints (exec,
  attach, port forward).
  -->
  <p><code>socks5</code> 代理當前不支持 SPDY 流式端點
  （<code>exec</code>、<code>attach</code>、<code>port-forward</code>）。
  </p>
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
  <p><code>disable-compression</code> 允許客戶端選擇不對發往伺服器的所有請求進行響應壓縮。
  當客戶端與伺服器之間的網路帶寬充足時，這對於加快請求（尤其是 list 操作）非常有用，
  能夠節省進行（伺服器端）壓縮和（客戶端）解壓縮的時間。參見
  https://github.com/kubernetes/kubernetes/issues/112296。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields
  -->
  <p><code>extensions</code> 保存一些額外信息。
  這些信息對於擴展程序是有用的，目的是確保讀寫操作不會破壞未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `Context`     {#Context}

<!--
**Appears in:**
-->
**出現在:**

- [NamedContext](#NamedContext)

<!--
Context is a tuple of references to a cluster (how do I communicate with a kubernetes cluster), a user (how do I identify myself), and a namespace (what subset of resources do I want to work with)
-->
<p>Context 是一個元組，包含對叢集 (我如何與某 Kubernetes 叢集通信)、使用者 (我如何標識自己）
和名字空間（我想要使用哪些資源子集）的引用。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>cluster</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Cluster is the name of the cluster for this context
  -->
  <p><code>cluster</code> 是此上下文中的叢集名稱。</p>
</td>
</tr>
<tr><td><code>user</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  AuthInfo is the name of the authInfo for this context
  -->
  <p><code>user</code> 是此上下文的 authInfo 名稱。</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Namespace is the default namespace to use on unspecified requests
  -->
  <p><code>namespace</code> 是在請求中未明確指定時使用的默認名字空間。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields
  -->
  <p><code>extensions</code> 保存一些額外信息。
  這些信息對於擴展程序是有用的，目的是確保讀寫操作不會破壞未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `ExecConfig`     {#ExecConfig}

<!--
**Appears in:**
-->
**出現在:**

- [AuthInfo](#AuthInfo)

<!--
ExecConfig specifies a command to provide client credentials. The command is exec'd and outputs structured stdout holding credentials.
See the client.authentication.k8s.io API group for specifications of the exact input and output format
-->

<p><code>ExecConfig</code> 指定提供客戶端憑證的命令。這個命令被執行（以 exec 方式）
並輸出結構化的標準輸出（<code>stdout</code>），其中包含了憑據。</p>

<!--
See the client.authentication.k8s.io API group for specifications of the exact input
and output format
-->
<p>查看 <code>client.authentication.k8s.io</code> API
組以獲取輸入和輸出的確切格式規範。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>command</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Command to execute.
  -->
  <p>command 是要執行的命令。</p>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
  <!--
  Arguments to pass to the command when executing it.
  -->
  <p><code>args</code> 是執行命令時要傳遞的參數。</p>
</td>
</tr>
<tr><td><code>env</code><br/>
<a href="#ExecEnvVar"><code>[]ExecEnvVar</code></a>
</td>
<td>
  <!--
  Env defines additional environment variables to expose to the process. These
  are unioned with the host's environment, as well as variables client-go uses
  to pass argument to the plugin.
  -->
  <p><code>env</code> 定義了要暴露給進程的額外的環境變量。這些與主機的環境變量以及
  <code>client-go</code> 使用的變量一起，用於傳遞參數給插件。</p>
</td>
</tr>
<tr><td><code>apiVersion</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Preferred input version of the ExecInfo. The returned ExecCredentials MUST use
  the same encoding version as the input.
  -->
  <p><code>ExecInfo</code> 的首選輸入版本。返回的 <code>ExecCredentials</code>
  必須使用與輸入相同的編碼版本。</p>
</td>
</tr>
<tr><td><code>installHint</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  This text is shown to the user when the executable doesn't seem to be
  present. For example, <code>brew install foo-cli</code> might be a good InstallHint for
  foo-cli on Mac OS systems
  -->
  <p>當似乎找不到可執行文件時，將向使用者顯示此文本。
  例如，對於在 Mac OS 系統上安裝 <code>foo-cli</code> 插件而言，
  <code>brew install foo-cli</code> 這可能是不錯的 installHint。</p>
</td>
</tr>
<tr><td><code>provideClusterInfo</code><B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
  <!--
  ProvideClusterInfo determines whether or not to provide cluster information,
  which could potentially contain very large CA data, to this exec plugin as a
  part of the KUBERNETES_EXEC_INFO environment variable. By default, it is set
  to false. Package k8s.io/client-go/tools/auth/exec provides helper methods for
  reading this environment variable
  -->
  <p><code>ProvideClusterInfo</code> 決定是否提供叢集信息。
  這些信息可能包含非常大的 CA 數據，用來作爲 <code>KUBERNETES_EXEC_INFO</code>
  環境變量的一部分提供給這個 exec 插件。
  默認情況下，它被設置爲 <code>false</code>。
  <code>k8s.io/client-go/tools/auth/exec</code> 包提供了用於讀取這個環境變量的輔助方法。</p>
</td>
</tr>
<tr><td><code>interactiveMode</code><br/>
<a href="#ExecInteractiveMode"><code>ExecInteractiveMode</code></a>
</td>
<td>
  <!--
  InteractiveMode determines this plugin's relationship with standard input. Valid
  values are &quot;Never&quot; (this exec plugin never uses standard input), &quot;IfAvailable&quot; (this
  exec plugin wants to use standard input if it is available), or &quot;Always&quot; (this exec
  plugin requires standard input to function). See ExecInteractiveMode values for more
  details.
  -->
  <p><code>interactiveMode</code> 確定此插件與標準輸入之間的關係。有效值爲：</p>
  <ul>
  <li>&quot;Never&quot;：這個 <code>exec</code> 插件從不使用標準輸入；</li>
  <li>&quot;IfAvailable&quot;：這個 <code>exec</code> 插件希望使用標準輸入，如果可用的話；</li>
  <li>&quot;Always&quot;：這個 <code>exec</code> 插件需要標準輸入以正常運行。</li>
  </ul>
  <p>查看 <code>ExecInteractiveMode</code> 值以瞭解更多詳情。</p>

  <!--
  If APIVersion is client.authentication.k8s.io/v1alpha1 or
  client.authentication.k8s.io/v1beta1, then this field is optional and defaults
  to &quot;IfAvailable&quot; when unset. Otherwise, this field is required.
  -->
  <p>如果 <code>apiVersion</code> 是 <code>client.authentication.k8s.io/v1alpha1</code>
  或 <code>client.authentication.k8s.io/v1beta1</code>, 則此字段是可選的，
  且當未設置時默認爲 &quot;IfAvailable&quot;。否則，此字段是必需的。</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#ExecEnvVar}

<!--
**Appears in:**
-->
**出現在:**

- [ExecConfig](#ExecConfig)

<!--
ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin
-->
<p><code>ExecEnvVar</code> 用於在執行基於 <code>exec</code> 的憑據插件時要設置的環境變量。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><br/><B><!--[Required]-->[必需]</B>
<code>string</code>
</td>
<td>
  <p>環境變量名稱。</p></td>
</tr>
<tr><td><code>value</code><B></br><!--[Required]-->[必需]</B>
<code>string</code>
</td>
<td>
  <p>環境變量取值。</p></td>
</tr>
</tbody>
</table>

## `ExecInteractiveMode`     {#ExecInteractiveMode}

<!--
(Alias of `string`)
-->
（`string` 的別名）

<!--
**Appears in:**
-->
**出現在：**

- [ExecConfig](#ExecConfig)

<!--
ExecInteractiveMode is a string that describes an exec plugin's relationship with standard input.
-->

<p>ExecInteractiveMode 是一個描述 exec 插件與標準輸入間關係的字符串。</p>

## `NamedAuthInfo`     {#NamedAuthInfo}

<!--
**Appears in:**
-->
**出現在：**

- [Config](#Config)

<!--
NamedAuthInfo relates nicknames to auth information
-->
<p><code>NamedAuthInfo</code> 將暱稱與身份認證信息關聯起來。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><B><!--[Required]-->[必需]</B>
<code>string</code>
</td>
<td>
  <!--
  Name is the nickname for this AuthInfo
  -->
  <p><code>name</code> 是該 <code>AuthInfo</code> 的暱稱。</p>
</td>
</tr>
<tr><td><code>user</code><B><!--[Required]-->[必需]</B><br/>
<a href="#AuthInfo"><code>AuthInfo</code></a>
</td>
<td>
  <!--
  AuthInfo holds the auth information
  -->
  <p><code>user</code> 保存身份認證信息。</p>
</td>
</tr>
</tbody>
</table>

## `NamedCluster`     {#NamedCluster}

<!--
**Appears in:**
-->
**出現在:**

- [Config](#Config)

<!--
NamedCluster relates nicknames to cluster information
-->
<p><code>NamedCluster</code> 將暱稱與叢集信息關聯起來。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>


<tr><td><code>name</code><B></br><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Name is the nickname for this Cluster
  -->
  <p><code>name</code> 是此叢集的暱稱。</p>
</td>
</tr>
<tr><td><code>cluster</code><br/><B><!--[Required]-->[必需]</B><br/>
<a href="#Cluster"><code>Cluster</code></a>
</td>
<td>
  <!--
  Cluster holds the cluster information
  -->
  <p><code>cluster</code> 保存叢集的信息。</p>
</td>
</tr>
</tbody>
</table>

## `NamedContext`     {#NamedContext}

<!--
**Appears in:**
-->
**出現在：**

- [Config](#Config)

<!--
NamedContext relates nicknames to context information
-->
<p><code>NamedContext</code> 將暱稱與上下文信息關聯起來。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><B></br><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Name is the nickname for this Context
  -->
  <p><code>name</code> 是此上下文的暱稱。</p>
</td>
</tr>
<tr><td><code>context</code><br/><B><!--[Required]-->[必需]</B>
<a href="#Context"><code>Context</code></a>
</td>
<td>
  <!--
  Context holds the context information
  -->
  <p><code>context</code> 保存上下文信息。</p>
</td>
</tr>
</tbody>
</table>

## `NamedExtension`     {#NamedExtension}

<!--
**Appears in:**
-->
**出現在：**

- [Config](#Config)
- [AuthInfo](#AuthInfo)
- [Cluster](#Cluster)
- [Context](#Context)
- [Preferences](#Preferences)

<!--
NamedExtension relates nicknames to extension information.
-->
<p>NamedExtension 將暱稱與擴展信息關聯起來。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  Name is the nickname for this Extension
  -->
  <p><code>name</code> 是此擴展的暱稱。</p>
</td>
</tr>
<tr><td><code>extension</code><!--[Required]--><B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
  <!--
  Extension holds the extension information
  -->
  <p><code>extension</code> 保存擴展信息。</p>
</td>
</tr>
</tbody>
</table>

## `Preferences`     {#Preferences}

<!--
**Appears in:**
-->
**出現在:**

- [Config](#Config)

<p>
  <!--Deprecated: this structure is deprecated in v1.34. It is not used by any of the Kubernetes components.-->
  已棄用：此字段在 v1.34 中已被棄用。沒有任何 Kubernetes 組件使用此字段。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>colors</code><br/>
<code>bool</code>
</td>
<td>
   <p>是否採用彩色字符編碼。</p></td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields
  -->
  <p><code>extensions</code> 保存一些額外信息。
  這些信息對於擴展程序是有用的，目的是確保讀寫操作不會破壞未知字段。</p>
</td>
</tr>
</tbody>
</table>
