---
title: kube 配置 (v1)
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
## 资源类型

- [Config](#Config)

## `Config`     {#Config}

<!--
Config holds the information needed to build connect to remote kubernetes clusters as a given user
-->
<p>Config 保存以给定用户身份构建连接到远程 Kubernetes 集群所需的信息 </p>

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
   <p>来自 pkg/api/types.go TypeMeta 的遗留字段。</p>
</td>
</tr>
<tr><td><code>apiVersion</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Legacy field from pkg/api/types.go TypeMeta. TODO(jlowdermilk): remove this after eliminating downstream dependencies.
  -->
   <p>来自 pkg/api/types.go TypeMeta 的遗留字段。</p>
</td>
</tr>
<tr><td><code>preferences</code><B><!--[Required]-->[必需]</B><br/>
<a href="#Preferences"><code>Preferences</code></a>
</td>
<td>
  <!--
  Preferences holds general information to be use for cli interactions.
  -->
  <p><code>preferences</code>保存用于 CLI 交互的一般信息。</p>
</td>
</tr>
<tr><td><code>clusters</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedCluster"><code>[]NamedCluster</code></a>
</td>
<td>
  <!--
  Clusters is a map of referencable names to cluster configs.
  -->
   <p><code>clusters</code> 是从可引用名称到集群配置的映射。</p>
</td>
</tr>
<tr><td><code>users</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedAuthInfo"><code>[]NamedAuthInfo</code></a>
</td>
<td>
  <!--
  AuthInfos is a map of referencable names to user configs.
  -->
   <p><code>users</code> 是一个从可引用名称到用户配置的映射。</p>
</td>
</tr>
<tr><td><code>contexts</code><B><!--[Required]-->[必需]</B><br/>
<a href="#NamedContext"><code>[]NamedContext</code></a>
</td>
<td>
  <!--
  Contexts is a map of referencable names to context configs.
  -->
  <p><code>contexts</code> 是从可引用名称到上下文配置的映射。</p>
</td>
</tr>
<tr><td><code>current-context</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  CurrentContext is the name of the context that you would like to use by default.
  -->
  <p><code>current-context</code> 是默认情况下你想使用的上下文的名称。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields.
  -->
  <p><code>extensions</code> 保存额外信息。这对于扩展程序是有用的，目的是使读写操作不会破解未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `AuthInfo`     {#AuthInfo}

<!--
**Appears in:**
-->
**出现在:**

- [NamedAuthInfo](#NamedAuthInfo)

<!--
AuthInfo contains information that describes identity information.  This is use to tell the kubernetes cluster who you are.
-->
<p>AuthInfo 包含描述身份信息的信息。这一信息用来告诉 kubernetes 集群你是谁。</p>

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
  <p><code>client-certificate</code> 是 TLS 客户端证书文件的路径。</p>
</td>
</tr>
<tr><td><code>client-certificate-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  ClientCertificateData contains PEM-encoded data from a client cert file for TLS. Overrides ClientCertificate
  -->
  <p><code>client-certificate-data</code> 包含用于 TLS 连接的、来自客户端证书的 PEM 编码的数据。
  此字段值会覆盖 <code>client-certificate</code> 内容。</p>
</td>
</tr>
<tr><td><code>client-key</code><br/>
<code>string</code>
</td>
<td>
  <!--
  ClientKey is the path to a client key file for TLS
  -->
  <p><code>client-key</code> 是用于 TLS 连接的客户端密钥文件的路径。</p>
</td>
</tr>
<tr><td><code>client-key-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  ClientKeyData contains PEM-encoded data from a client key file for TLS. Overrides ClientKey
  -->
   <p><code>client-key-data</code> 包含用于 TLS 连接的、来自客户端密钥文件的
   PEM 编码数据。此数据会覆盖 <code>client-key</code> 的内容。</p>
</td>
</tr>
<tr><td><code>token</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Token is the bearer token for authentication to the kubernetes cluster
  -->
  <p><code>token</code> 是用于向 kubernetes 集群进行身份验证的持有者令牌。</p>
</td>
</tr>
<tr><td><code>tokenFile</code><br/>
<code>string</code>
</td>
<td>
  <!--
  TokenFile is a pointer to a file that contains a bearer token (as described above).  If both Token and TokenFile are present, Token takes precedence.
  -->
  <p><code>tokenFile</code> 是一个指针，指向包含有持有者令牌（如上所述）的文件。
  如果 <code>token</code> 和 <code>tokenFile</code> 都存在，<code>token</code> 优先。</p>
</td>
</tr>
<tr><td><code>as</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Impersonate is the username to impersonate.  The name matches the flag.
  -->
  <p><code>as</code> 是要冒充的用户名。名字与命令行标志相匹配。</p>
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
  <p><code>as-groups</code> 是要冒充的用户组。</p>
</td>
</tr>
<tr><td><code>as-user-extra</code><br/>
<code>map[string][]string</code>
</td>
<td>
  <!--
  ImpersonateUserExtra contains additional information for impersonated user.
  -->
  <p><code>as-user-extra</code> 包含与要冒充的用户相关的额外信息。</p>
</td>
</tr>
<tr><td><code>username</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Username is the username for basic authentication to the kubernetes cluster.
  -->
  <p><code>username</code> 是向 Kubernetes 集群进行基本认证的用户名。</p>
</td>
</tr>
<tr><td><code>password</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Password is the password for basic authentication to the kubernetes cluster.
  -->
  <p><code>password</code> 是向 Kubernetes 集群进行基本认证的密码。</p>
</td>
</tr>
<tr><td><code>auth-provider</code><br/>
<a href="#AuthProviderConfig"><code>AuthProviderConfig</code></a>
</td>
<td>
  <!--
  AuthProvider specifies a custom authentication plugin for the kubernetes cluster.
  -->
  <p><code>auth-provider</code> 给出用于给定 Kubernetes 集群的自定义身份验证插件。</p>
</td>
</tr>
<tr><td><code>exec</code><br/>
<a href="#ExecConfig"><code>ExecConfig</code></a>
</td>
<td>
  <!--
  Exec specifies a custom exec-based authentication plugin for the kubernetes cluster.
  -->
  <p><code>exec</code> 指定了针对某 Kubernetes 集群的基于 <code>exec</code>
  的自定义身份认证插件。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields.
  -->
  <p><code>extensions</code> 保存一些额外信息。这些信息对于扩展程序是有用的，目的是确保读写操作不会破坏未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `AuthProviderConfig`     {#AuthProviderConfig}

<!--
**Appears in:**
-->
**出现在:**

- [AuthInfo](#AuthInfo)

<!--
AuthProviderConfig holds the configuration for a specified auth provider.
-->
<p>AuthProviderConfig 保存特定于某认证提供机制的配置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>配置选项名称。</p>
</td>
</tr>
<tr><td><code>config</code><B><!--[Required]-->[必需]</B><br/>
<code>map[string]string</code>
</td>
<td>
   <p>配置选项取值映射。</p>
</td>
</tr>
</tbody>
</table>

## `Cluster`     {#Cluster}

<!--
**Appears in:**
-->
**出现在:**

- [NamedCluster](#NamedCluster)

<!--
Cluster contains information about how to communicate with a kubernetes cluster.
-->
<p>Cluster 包含有关如何与 Kubernetes 集群通信的信息。</p>

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
  <p><code>server</code> 是 Kubernetes 集群的地址（形式为 https://hostname:port）。</p>
</td>
</tr>
<tr><td><code>tls-server-name</code><br/>
<code>string</code>
</td>
<td>
  <!--
  TLSServerName is used to check server certificate. If TLSServerName is empty, the hostname used to contact the server is used.
  -->
  <p><code>tls-server-name</code> 用于检查服务器证书。如果 <code>tls-server-name</code>
  是空的，则使用用于联系服务器的主机名。</p>
</td>
</tr>
<tr><td><code>insecure-skip-tls-verify</code><br/>
<code>bool</code>
</td>
<td>
  <!--
  InsecureSkipTLSVerify skips the validity check for the server's certificate. This will make your HTTPS connections insecure.
  --->
  <p><code>insecure-skip-tls-verify</code> 跳过服务器证书的有效性检查。
  这样做将使你的 HTTPS 连接不安全。</p>
</td>
</tr>
<tr><td><code>certificate-authority</code><br/>
<code>string</code>
</td>
<td>
  <!--
  CertificateAuthority is the path to a cert file for the certificate authority.
  -->
  <p><code>certificate-authority</code> 是证书机构的证书文件的路径。</p>
</td>
</tr>
<tr><td><code>certificate-authority-data</code><br/>
<code>[]byte</code>
</td>
<td>
  <!--
  CertificateAuthorityData contains PEM-encoded certificate authority certificates. Overrides CertificateAuthority
  -->
  <p><code>certificate-authority-data</code> 包含 PEM 编码的证书机构证书。
  覆盖 <code>certificate-authority</code> 的设置值。</p>
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
  <p><code>proxy-url</code> 是代理的 URL，该代理用于此客户端的所有请求。
  带有 &quot;http&quot;、&quot;https&quot; 和 &quot;socks5&quot; 的 URL 是被支持的。
  如果未提供此配置或为空字符串，客户端尝试使用 <code>http_proxy</code> 和
  <code>https_proxy</code> 环境变量构建代理配置。
  如果这些环境变量也没有设置, 客户端不会尝试代理请求。
  </p>

  <!--
  socks5 proxying does not currently support spdy streaming endpoints (exec,
  attach, port forward).
  -->
  <p><code>socks5</code> 代理当前不支持 SPDY 流式端点
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
  <p><code>disable-compression</code> 允许客户端选择不对发往服务器的所有请求进行响应压缩。
  当客户端与服务器之间的网络带宽充足时，这对于加快请求（尤其是 list 操作）非常有用，
  能够节省进行（服务器端）压缩和（客户端）解压缩的时间。参见
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
  <p><code>extensions</code> 保存一些额外信息。
  这些信息对于扩展程序是有用的，目的是确保读写操作不会破坏未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `Context`     {#Context}

<!--
**Appears in:**
-->
**出现在:**

- [NamedContext](#NamedContext)

<!--
Context is a tuple of references to a cluster (how do I communicate with a kubernetes cluster), a user (how do I identify myself), and a namespace (what subset of resources do I want to work with)
-->
<p>Context 是一个元组，包含对集群 (我如何与某 Kubernetes 集群通信)、用户 (我如何标识自己）
和名字空间（我想要使用哪些资源子集）的引用。</p>

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
  <p><code>cluster</code> 是此上下文中的集群名称。</p>
</td>
</tr>
<tr><td><code>user</code><B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
  <!--
  AuthInfo is the name of the authInfo for this context
  -->
  <p><code>user</code> 是此上下文的 authInfo 名称。</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
  <!--
  Namespace is the default namespace to use on unspecified requests
  -->
  <p><code>namespace</code> 是在请求中未明确指定时使用的默认名字空间。</p>
</td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields
  -->
  <p><code>extensions</code> 保存一些额外信息。
  这些信息对于扩展程序是有用的，目的是确保读写操作不会破坏未知字段。</p>
</td>
</tr>
</tbody>
</table>

## `ExecConfig`     {#ExecConfig}

<!--
**Appears in:**
-->
**出现在:**

- [AuthInfo](#AuthInfo)

<!--
ExecConfig specifies a command to provide client credentials. The command is exec'd and outputs structured stdout holding credentials.
See the client.authentication.k8s.io API group for specifications of the exact input and output format
-->

<p><code>ExecConfig</code> 指定提供客户端凭证的命令。这个命令被执行（以 exec 方式）
并输出结构化的标准输出（<code>stdout</code>），其中包含了凭据。</p>

<!--
See the client.authentication.k8s.io API group for specifications of the exact input
and output format
-->
<p>查看 <code>client.authentication.k8s.io</code> API
组以获取输入和输出的确切格式规范。</p>

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
  <p>command 是要执行的命令。</p>
</td>
</tr>
<tr><td><code>args</code><br/>
<code>[]string</code>
</td>
<td>
  <!--
  Arguments to pass to the command when executing it.
  -->
  <p><code>args</code> 是执行命令时要传递的参数。</p>
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
  <p><code>env</code> 定义了要暴露给进程的额外的环境变量。这些与主机的环境变量以及
  <code>client-go</code> 使用的变量一起，用于传递参数给插件。</p>
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
  <p><code>ExecInfo</code> 的首选输入版本。返回的 <code>ExecCredentials</code>
  必须使用与输入相同的编码版本。</p>
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
  <p>当似乎找不到可执行文件时，将向用户显示此文本。
  例如，对于在 Mac OS 系统上安装 <code>foo-cli</code> 插件而言，
  <code>brew install foo-cli</code> 这可能是不错的 installHint。</p>
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
  <p><code>ProvideClusterInfo</code> 决定是否提供集群信息。
  这些信息可能包含非常大的 CA 数据，用来作为 <code>KUBERNETES_EXEC_INFO</code>
  环境变量的一部分提供给这个 exec 插件。
  默认情况下，它被设置为 <code>false</code>。
  <code>k8s.io/client-go/tools/auth/exec</code> 包提供了用于读取这个环境变量的辅助方法。</p>
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
  <p><code>interactiveMode</code> 确定此插件与标准输入之间的关系。有效值为：</p>
  <ul>
  <li>&quot;Never&quot;：这个 <code>exec</code> 插件从不使用标准输入；</li>
  <li>&quot;IfAvailable&quot;：这个 <code>exec</code> 插件希望使用标准输入，如果可用的话；</li>
  <li>&quot;Always&quot;：这个 <code>exec</code> 插件需要标准输入以正常运行。</li>
  </ul>
  <p>查看 <code>ExecInteractiveMode</code> 值以了解更多详情。</p>

  <!--
  If APIVersion is client.authentication.k8s.io/v1alpha1 or
  client.authentication.k8s.io/v1beta1, then this field is optional and defaults
  to &quot;IfAvailable&quot; when unset. Otherwise, this field is required.
  -->
  <p>如果 <code>apiVersion</code> 是 <code>client.authentication.k8s.io/v1alpha1</code>
  或 <code>client.authentication.k8s.io/v1beta1</code>, 则此字段是可选的，
  且当未设置时默认为 &quot;IfAvailable&quot;。否则，此字段是必需的。</p>
</td>
</tr>
</tbody>
</table>

## `ExecEnvVar`     {#ExecEnvVar}

<!--
**Appears in:**
-->
**出现在:**

- [ExecConfig](#ExecConfig)

<!--
ExecEnvVar is used for setting environment variables when executing an exec-based
credential plugin
-->
<p><code>ExecEnvVar</code> 用于在执行基于 <code>exec</code> 的凭据插件时要设置的环境变量。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>name</code><br/><B><!--[Required]-->[必需]</B>
<code>string</code>
</td>
<td>
  <p>环境变量名称。</p></td>
</tr>
<tr><td><code>value</code><B></br><!--[Required]-->[必需]</B>
<code>string</code>
</td>
<td>
  <p>环境变量取值。</p></td>
</tr>
</tbody>
</table>

## `ExecInteractiveMode`     {#ExecInteractiveMode}

<!--
(Alias of `string`)
-->
（`string` 的别名）

<!--
**Appears in:**
-->
**出现在：**

- [ExecConfig](#ExecConfig)

<!--
ExecInteractiveMode is a string that describes an exec plugin's relationship with standard input.
-->

<p>ExecInteractiveMode 是一个描述 exec 插件与标准输入间关系的字符串。</p>

## `NamedAuthInfo`     {#NamedAuthInfo}

<!--
**Appears in:**
-->
**出现在：**

- [Config](#Config)

<!--
NamedAuthInfo relates nicknames to auth information
-->
<p><code>NamedAuthInfo</code> 将昵称与身份认证信息关联起来。</p>

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
  <p><code>name</code> 是该 <code>AuthInfo</code> 的昵称。</p>
</td>
</tr>
<tr><td><code>user</code><B><!--[Required]-->[必需]</B><br/>
<a href="#AuthInfo"><code>AuthInfo</code></a>
</td>
<td>
  <!--
  AuthInfo holds the auth information
  -->
  <p><code>user</code> 保存身份认证信息。</p>
</td>
</tr>
</tbody>
</table>

## `NamedCluster`     {#NamedCluster}

<!--
**Appears in:**
-->
**出现在:**

- [Config](#Config)

<!--
NamedCluster relates nicknames to cluster information
-->
<p><code>NamedCluster</code> 将昵称与集群信息关联起来。</p>

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
  <p><code>name</code> 是此集群的昵称。</p>
</td>
</tr>
<tr><td><code>cluster</code><br/><B><!--[Required]-->[必需]</B><br/>
<a href="#Cluster"><code>Cluster</code></a>
</td>
<td>
  <!--
  Cluster holds the cluster information
  -->
  <p><code>cluster</code> 保存集群的信息。</p>
</td>
</tr>
</tbody>
</table>

## `NamedContext`     {#NamedContext}

<!--
**Appears in:**
-->
**出现在：**

- [Config](#Config)

<!--
NamedContext relates nicknames to context information
-->
<p><code>NamedContext</code> 将昵称与上下文信息关联起来。</p>

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
  <p><code>name</code> 是此上下文的昵称。</p>
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
**出现在：**

- [Config](#Config)
- [AuthInfo](#AuthInfo)
- [Cluster](#Cluster)
- [Context](#Context)
- [Preferences](#Preferences)

<!--
NamedExtension relates nicknames to extension information.
-->
<p>NamedExtension 将昵称与扩展信息关联起来。</p>

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
  <p><code>name</code> 是此扩展的昵称。</p>
</td>
</tr>
<tr><td><code>extension</code><!--[Required]--><B>[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
</td>
<td>
  <!--
  Extension holds the extension information
  -->
  <p><code>extension</code> 保存扩展信息。</p>
</td>
</tr>
</tbody>
</table>

## `Preferences`     {#Preferences}

<!--
**Appears in:**
-->
**出现在:**

- [Config](#Config)

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>colors</code><br/>
<code>bool</code>
</td>
<td>
   <p>是否采用彩色字符编码。</p></td>
</tr>
<tr><td><code>extensions</code><br/>
<a href="#NamedExtension"><code>[]NamedExtension</code></a>
</td>
<td>
  <!--
  Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields
  -->
  <p><code>extensions</code> 保存一些额外信息。
  这些信息对于扩展程序是有用的，目的是确保读写操作不会破坏未知字段。</p>
</td>
</tr>
</tbody>
</table>
