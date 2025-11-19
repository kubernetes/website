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
在 localhost 和 Kubernetes API 伺服器之間創建一個代理伺服器或應用級網關。
它還允許在指定的 HTTP 路徑上提供靜態內容。除了與靜態內容路徑匹配的路徑之外，
所有傳入的數據通過一個端口進入，並被轉發到遠程 Kubernetes API 伺服器端口。

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
# 代理所有的 Kubernetes API 請求，不對其他請求作處理
kubectl proxy --api-prefix=/
  
# 僅代理部分 Kubernetes API 和一些靜態文件
# 你可以使用 `curl localhost:8001/api/v1/pods` 獲取 Pod 信息
kubectl proxy --www=/my/files --www-prefix=/static/ --api-prefix=/api/
  
# 要在不同的根路徑下代理整個 Kubernetes API
# 你可以使用 `curl localhost:8001/custom/api/v1/pods` 獲取 Pod 信息
kubectl proxy --api-prefix=/custom/
  
# 在端口 8011 上運行指向 Kubernetes API 伺服器的代理，並使用 ./local/www/ 提供靜態內容
kubectl proxy --port=8011 --www=./local/www/
  
# 在任意本地端口上運行指向 Kubernetes API 伺服器的代理
# 爲伺服器選擇的端口將被輸出到標準輸出
kubectl proxy --port=0
  
# 運行指向 Kubernetes API 伺服器的代理，將 API 前綴更改爲 k8s-api
# 例如，這會讓用戶能夠通過 localhost:8001/k8s-api/v1/pods/ 訪問 Pod API
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
<td colspan="2">--accept-hosts string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："^localhost$,^127\.0\.0\.1$,^\[::1\]$"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for hosts that the proxy should accept.
-->
這個正則表達式表示代理應接受的主機。
</p></td>
</tr>

<tr>
<td colspan="2">--accept-paths string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："^.*"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Regular expression for paths that the proxy should accept.
-->
這個正則表達式表示代理應接受的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："127.0.0.1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The IP address on which to serve on.
-->
用來提供服務的 IP 地址。
</p></td>
</tr>

<tr>
<td colspan="2">--api-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix to serve the proxied API under.
-->
被代理的 API 所使用的前綴。
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
如果爲 true，則啓用自動路徑追加機制，將 kube 上下文伺服器路徑追加到每個請求。
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
如果爲 true，則在代理中禁用請求過濾。
此設置是危險的，因爲這一設置在使用可訪問的端口時可能會使你容易受到 XSRF 攻擊。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for proxy
-->
proxy 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--keepalive duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
keepalive specifies the keep-alive period for an active network connection. Set to 0 to disable keepalive.
-->
keepalive 指定活動網路連接保持活動的時長。設置爲 0 可禁用 keepalive。
</p></td>
</tr>

<tr>
<td colspan="2">-p, --port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：8001</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The port on which to run the proxy. Set to 0 to pick a random port.
-->
要運行代理的端口。設置爲 0 將隨機揀選一個端口。
</p></td>
</tr>

<tr>
<td colspan="2">--reject-methods string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："^$"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Regular expression for HTTP methods that the proxy should reject (example --reject-methods='POST,PUT,PATCH').
-->
這個正則表達式表示代理應該拒絕的 HTTP 方法（例如 --reject-methods='POST,PUT,PATCH'）。
</p></td>
</tr>

<tr>
<td colspan="2">--reject-paths string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："^/api/.*/pods/.*/exec,<br />^/api/.*/pods/.*/attach"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Regular expression for paths that the proxy should reject. Paths specified here will be rejected even accepted by --accept-paths.
-->
這個正則表達式表示代理應該拒絕的路徑。此處指定的路徑即使被 --accept-paths 接受也會被拒絕。
</p></td>
</tr>

<tr>
<td colspan="2">-u, --unix-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Unix socket on which to run the proxy.
-->
用來運行代理的 Unix 套接字。
</p></td>
</tr>

<tr>
<td colspan="2">-w, --www string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Also serve static files from the given directory under the specified prefix.
-->
同時使用所指定前綴下給定的目錄來提供靜態文件。
</p></td>
</tr>

<tr>
<td colspan="2">-P, --www-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："/static/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Prefix to serve static files under, if static file directory is specified.
-->
如果指定了靜態文件目錄，則此標誌設置用來提供靜態文件服務的前綴。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
-->
操作所用的僞裝使用者名。使用者可以是常規使用者或命名空間中的服務賬號。
</p></td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
-->
操作所用的僞裝使用者組，此標誌可以被重複設置以指定多個組。
</p></td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
UID to impersonate for the operation.
-->
操作所用的僞裝 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Default cache directory
-->
默認緩存目錄。
</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a cert file for the certificate authority
-->
證書機構的證書文件的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a client certificate file for TLS
-->
TLS 客戶端證書文件的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a client key file for TLS
-->
TLS 客戶端密鑰文件的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 叢集的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig context to use
-->
要使用的 kubeconfig 上下文的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, opt-out of response compression for all requests to the server
-->
如果爲 true，則對伺服器所有請求的響應不再壓縮。
</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
-->
如果爲 true，則不檢查伺服器證書的有效性。這將使你的 HTTPS 連接不安全。
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
CLI 請求要使用的 kubeconfig 文件的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--kuberc string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the kuberc file to use for preferences. This can be disabled by exporting KUBECTL_KUBERC=false feature gate or turning off the feature KUBERC=off.
-->
用於偏好設置的 kuberc 文件的路徑。可以通過導出 KUBECTL_KUBERC=false
特性門控或關閉 KUBERC=off 特性門控來禁用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Require server version to match client version
-->
要求伺服器版本與客戶端版本匹配。
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
如果存在，則是此 CLI 請求的命名空間範圍。
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
向 API 伺服器進行基本身份驗證所用的密碼。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要記錄的性能分析信息。可選值爲（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the file to write the profile to
-->
性能分析信息要寫入的目標文件的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
-->
在放棄某個伺服器請求之前等待的時長。非零值應包含相應的時間單位（例如 1s、2m、3h）。
值爲零表示請求不會超時。
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
Kubernetes API 伺服器的地址和端口。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
對存儲驅動的寫入操作將被緩存的時長；緩存的操作會作爲一個事務提交給非內存後端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database name
-->
數據庫名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
數據庫 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database password
-->
數據庫密碼。
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
使用與數據庫的安全連接。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："stats"</td>
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
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database username
-->
數據庫使用者名。
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
伺服器證書驗證所用的伺服器名稱。如果未提供，則使用與伺服器通信所用的主機名。
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
向 API 伺服器進行身份驗證的持有者令牌。
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
要使用的 kubeconfig 使用者的名稱。
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
向 API 伺服器進行基本身份驗證時所用的使用者名。
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
--version, --version=raw 打印版本信息並退出；--version=vX.Y.Z... 設置報告的版本。
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
將從伺服器收到的警告視爲錯誤，並以非零退出碼退出。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 叢集管理器
