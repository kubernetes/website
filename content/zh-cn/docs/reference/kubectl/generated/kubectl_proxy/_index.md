---
title: kubectl proxy
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl proxy
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Creates a proxy server or application-level gateway between localhost and the Kubernetes API server. It also allows serving static content over specified HTTP path. All incoming data enters through one port and gets forwarded to the remote Kubernetes API server port, except for the path matching the static content path.
-->
在 localhost 和 Kubernetes API 服务器之间创建一个代理服务器或应用级网关。
它还允许在指定的 HTTP 路径上提供静态内容。除了与静态内容路径匹配的路径之外，
所有传入的数据通过一个端口进入，并被转发到远程 Kubernetes API 服务器端口。

```shell
kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix]
```

## {{% heading "examples" %}}

<!--
```
  # To proxy all of the Kubernetes API and nothing else
  # To proxy only part of the Kubernetes API and also some static files
  # You can get pods info with 'curl localhost:8001/api/v1/pods'
  # To proxy the entire Kubernetes API at a different root
  # You can get pods info with 'curl localhost:8001/custom/api/v1/pods'
  # Run a proxy to the Kubernetes API server on port 8011, serving static content from ./local/www/
  # Run a proxy to the Kubernetes API server on an arbitrary local port
  # The chosen port for the server will be output to stdout
  # Run a proxy to the Kubernetes API server, changing the API prefix to k8s-api
  # This makes e.g. the pods API available at localhost:8001/k8s-api/v1/pods/
```
-->
```shell
# 代理所有的 Kubernetes API 请求，不对其他请求作处理
kubectl proxy --api-prefix=/
  
# 仅代理部分 Kubernetes API 和一些静态文件
# 你可以使用 `curl localhost:8001/api/v1/pods` 获取 Pod 信息
kubectl proxy --www=/my/files --www-prefix=/static/ --api-prefix=/api/
  
# 要在不同的根路径下代理整个 Kubernetes API
# 你可以使用 `curl localhost:8001/custom/api/v1/pods` 获取 Pod 信息
kubectl proxy --api-prefix=/custom/
  
# 在端口 8011 上运行指向 Kubernetes API 服务器的代理，并使用 ./local/www/ 提供静态内容
kubectl proxy --port=8011 --www=./local/www/
  
# 在任意本地端口上运行指向 Kubernetes API 服务器的代理
# 为服务器选择的端口将被输出到标准输出
kubectl proxy --port=0
  
# 运行指向 Kubernetes API 服务器的代理，将 API 前缀更改为 k8s-api
# 例如，这会让用户能够通过 localhost:8001/k8s-api/v1/pods/ 访问 Pod API
kubectl proxy --api-prefix=/k8s-api
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--accept-hosts string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："^localhost$,^127\.0\.0\.1$,^\[::1\]$"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for hosts that the proxy should accept.
-->
这个正则表达式表示代理应接受的主机。
</p></td>
</tr>

<tr>
<td colspan="2">--accept-paths string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："^.*"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for paths that the proxy should accept.
-->
这个正则表达式表示代理应接受的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："127.0.0.1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address on which to serve on.
-->
用来提供服务的 IP 地址。
</p></td>
</tr>

<tr>
<td colspan="2">--api-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix to serve the proxied API under.
-->
被代理的 API 所使用的前缀。
</p></td>
</tr>

<tr>
<td colspan="2">--append-server-path</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, enables automatic path appending of the kube context server path to each request.
-->
如果为 true，则启用自动路径追加机制，将 kube 上下文服务器路径追加到每个请求。
</p></td>
</tr>

<tr>
<td colspan="2">--disable-filter</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, disable request filtering in the proxy. This is dangerous, and can leave you vulnerable to XSRF attacks, when used with an accessible port.
-->
如果为 true，则在代理中禁用请求过滤。
此设置是危险的，因为这一设置在使用可访问的端口时可能会使你容易受到 XSRF 攻击。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for proxy
-->
proxy 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--keepalive duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
keepalive specifies the keep-alive period for an active network connection. Set to 0 to disable keepalive.
-->
keepalive 指定活动网络连接保持活动的时长。设置为 0 可禁用 keepalive。
</p></td>
</tr>

<tr>
<td colspan="2">-p, --port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：8001</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The port on which to run the proxy. Set to 0 to pick a random port.
-->
要运行代理的端口。设置为 0 将随机拣选一个端口。
</p></td>
</tr>

<tr>
<td colspan="2">--reject-methods string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："^$"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for HTTP methods that the proxy should reject (example --reject-methods='POST,PUT,PATCH').
-->
这个正则表达式表示代理应该拒绝的 HTTP 方法（例如 --reject-methods='POST,PUT,PATCH'）。
</p></td>
</tr>

<tr>
<td colspan="2">--reject-paths string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："^/api/.*/pods/.*/exec,<br />^/api/.*/pods/.*/attach"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for paths that the proxy should reject. Paths specified here will be rejected even accepted by --accept-paths.
-->
这个正则表达式表示代理应该拒绝的路径。此处指定的路径即使被 --accept-paths 接受也会被拒绝。
</p></td>
</tr>

<tr>
<td colspan="2">-u, --unix-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Unix socket on which to run the proxy.
-->
用来运行代理的 Unix 套接字。
</p></td>
</tr>

<tr>
<td colspan="2">-w, --www string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Also serve static files from the given directory under the specified prefix.
-->
同时使用所指定前缀下给定的目录来提供静态文件。
</p></td>
</tr>

<tr>
<td colspan="2">-P, --www-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/static/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix to serve static files under, if static file directory is specified.
-->
如果指定了静态文件目录，则此标志设置用来提供静态文件服务的前缀。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "parentoptions" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
-->
操作所用的伪装用户名。用户可以是常规用户或命名空间中的服务账号。
</p></td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
-->
操作所用的伪装用户组，此标志可以被重复设置以指定多个组。
</p></td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
UID to impersonate for the operation.
-->
操作所用的伪装 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Default cache directory
-->
默认缓存目录。
</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a cert file for the certificate authority
-->
证书机构的证书文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client certificate file for TLS
-->
TLS 客户端证书文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client key file for TLS
-->
TLS 客户端密钥文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 集群的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig context to use
-->
要使用的 kubeconfig 上下文的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
设置针对 notReady:NoExecute 的容忍度的 tolerationSeconds，默认添加到所有尚未设置此容忍度的 Pod。
</p></td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
设置针对 unreachable:NoExecute 的容忍度的 tolerationSeconds，默认添加到所有尚未设置此容忍度的 Pod。
</p></td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, opt-out of response compression for all requests to the server
-->
如果为 true，则对服务器所有请求的响应不再压缩。
</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
-->
如果为 true，则不检查服务器证书的有效性。这将使你的 HTTPS 连接不安全。
</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to the kubeconfig file to use for CLI requests.
-->
CLI 请求要使用的 kubeconfig 文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Require server version to match client version
-->
要求服务器版本与客户端版本匹配。
</p></td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If present, the namespace scope for this CLI request
-->
如果存在，则是此 CLI 请求的命名空间范围。
</p></td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Password for basic authentication to the API server
-->
向 API 服务器进行基本身份验证所用的密码。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要记录的性能分析信息。可选值为（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the file to write the profile to
-->
性能分析信息要写入的目标文件的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
-->
在放弃某个服务器请求之前等待的时长。非零值应包含相应的时间单位（例如 1s、2m、3h）。
值为零表示请求不会超时。
</p></td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The address and port of the Kubernetes API server
-->
Kubernetes API 服务器的地址和端口。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
对存储驱动的写入操作将被缓存的时长；缓存的操作会作为一个事务提交给非内存后端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database name
-->
数据库名称。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
数据库 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database password
-->
数据库密码。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
use secure connection with database
-->
使用与数据库的安全连接。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
table name
-->
表名。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database username
-->
数据库用户名。
</p></td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
-->
服务器证书验证所用的服务器名称。如果未提供，则使用与服务器通信所用的主机名。
</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Bearer token for authentication to the API server
-->
向 API 服务器进行身份验证的持有者令牌。
</p></td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig user to use
-->
要使用的 kubeconfig 用户的名称。
</p></td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Username for basic authentication to the API server
-->
向 API 服务器进行基本身份验证时所用的用户名。
</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息并退出；--version=vX.Y.Z... 设置报告的版本。
</p></td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Treat warnings received from the server as errors and exit with a non-zero exit code
-->
将从服务器收到的警告视为错误，并以非零退出码退出。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 集群管理器
