---
title: kubectl create token
content_type: tool-reference
weight: 30
---
<!--
title: kubectl create token
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
Request a service account token.
-->
請求一個服務賬號令牌。

```shell
kubectl create token SERVICE_ACCOUNT_NAME
```

## {{% heading "examples" %}}

<!--
```
  # Request a token to authenticate to the kube-apiserver as the service account "myapp" in the current namespace
  kubectl create token myapp
  
  # Request a token for a service account in a custom namespace
  kubectl create token myapp --namespace myns
  
  # Request a token with a custom expiration
  kubectl create token myapp --duration 10m
  
  # Request a token with a custom audience
  kubectl create token myapp --audience https://example.com
  
  # Request a token bound to an instance of a Secret object
  kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret
  
  # Request a token bound to an instance of a Secret object with a specific UID
  kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret --bound-object-uid 0d4691ed-659b-4935-a832-355f77ee47cc
```
-->
```shell
# 請求一個令牌，以當前命名空間中的服務賬號 "myapp" 向 kube-apiserver 進行身份認證
kubectl create token myapp
  
# 爲特定命名空間中的服務賬號請求一個令牌
kubectl create token myapp --namespace myns
  
# 請求一個含自定義過期時間的令牌
kubectl create token myapp --duration 10m
  
# 請求一個包含特定受衆的令牌
kubectl create token myapp --audience https://example.com
  
# 請求一個綁定到 Secret 對象實例的令牌
kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret
  
# 請求一個綁定到特定 UID 的 Secret 對象實例的令牌
kubectl create token myapp --bound-object-kind Secret --bound-object-name mysecret --bound-object-uid 0d4691ed-659b-4935-a832-355f77ee47cc
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，在模板中字段或映射鍵缺失時忽略模板中的錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
</p></td>
</tr>

<tr>
<td colspan="2">--audience strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Audience of the requested token. If unset, defaults to requesting a token for use with the Kubernetes API server. May be repeated to request a token valid for multiple audiences.
-->
所請求令牌的受衆。如果不設置，默認請求一個用於 Kubernetes API 伺服器的令牌。
可以重複使用此參數以便爲多個受衆請求有效的令牌。
</p></td>
</tr>

<tr>
<td colspan="2">--bound-object-kind string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Kind of an object to bind the token to. Supported kinds are Node, Pod, Secret. If set, --bound-object-name must be provided.
-->
要綁定令牌的目標對象的類別。支持的類別有 Node、Pod 和 Secret。
如果設置了此參數，則必須提供 `--bound-object-name`。
</p></td>
</tr>

<tr>
<td colspan="2">--bound-object-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of an object to bind the token to. The token will expire when the object is deleted. Requires --bound-object-kind.
-->
要綁定令牌的目標對象的名稱。當對象被刪除時，令牌將會過期。需要指定 `--bound-object-kind`。
</p></td>
</tr>

<tr>
<td colspan="2">--bound-object-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
UID of an object to bind the token to. Requires --bound-object-kind and --bound-object-name. If unset, the UID of the existing object is used.
-->
要綁定令牌的目標對象的 UID。需要同時指定 `--bound-object-kind` 和 `--bound-object-name`。
如果不設置，則使用現有對象的 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Requested lifetime of the issued token. If not set or if set to 0, the lifetime will be determined by the server automatically. The server may return a token with a longer or shorter lifetime.
-->
對於將被頒發令牌，所請求的生命期。如果不設置或設置爲 0，則生命期將由伺服器自動確定。
伺服器可能會返回一個生命期更長或更短的令牌。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for token
-->
token 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
-->
輸出格式。可選值爲：
json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、jsonpath-as-json、jsonpath-file。
</p></td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲 true，在以 JSON 或 YAML 格式打印對象時保留 managedFields。
</p></td>
</tr>

<tr>
<td colspan="2">--template string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
-->
當 -o=go-template、-o=go-template-file 時使用的模板字符串或模板文件路徑。
模板格式爲 golang 模板 [http://golang.org/pkg/text/template/#pkg-overview]。
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
要使用的 kubeconfig 中叢集的名稱。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
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
對 API 伺服器進行基本身份驗證所用的密碼。
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
對 API 伺服器進行基本身份驗證時所用的使用者名。
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
* [kubectl create](../)	 - Create a resource from a file or from stdin
-->
* [kubectl create](../) - 使用文件或標準輸入創建資源
