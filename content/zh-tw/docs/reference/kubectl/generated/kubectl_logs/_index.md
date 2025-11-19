---
title: kubectl logs
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl logs
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Print the logs for a container in a pod or specified resource. If the pod has only one container, the container name is optional.
-->
打印 Pod 或指定資源中某個容器的日誌。如果 Pod 只有一個容器，則容器名稱是可選的。

```shell
kubectl logs [-f] [-p] (POD | TYPE/NAME) [-c CONTAINER]
```

## {{% heading "examples" %}}

<!--
```
# Return snapshot logs from pod nginx with only one container
kubectl logs nginx

# Return snapshot logs from pod nginx, prefixing each line with the source pod and container name
kubectl logs nginx --prefix

# Return snapshot logs from pod nginx, limiting output to 500 bytes
kubectl logs nginx --limit-bytes=500

# Return snapshot logs from pod nginx, waiting up to 20 seconds for it to start running.
kubectl logs nginx --pod-running-timeout=20s

# Return snapshot logs from pod nginx with multi containers
kubectl logs nginx --all-containers=true

# Return snapshot logs from all pods in the deployment nginx
kubectl logs deployment/nginx --all-pods=true

# Return snapshot logs from all containers in pods defined by label app=nginx
kubectl logs -l app=nginx --all-containers=true

# Return snapshot logs from all pods defined by label app=nginx, limiting concurrent log requests to 10 pods
kubectl logs -l app=nginx --max-log-requests=10

# Return snapshot of previous terminated ruby container logs from pod web-1
kubectl logs -p -c ruby web-1

# Begin streaming the logs from pod nginx, continuing even if errors occur
kubectl logs nginx -f --ignore-errors=true

# Begin streaming the logs of the ruby container in pod web-1
kubectl logs -f -c ruby web-1

# Begin streaming the logs from all containers in pods defined by label app=nginx
kubectl logs -f -l app=nginx --all-containers=true

# Display only the most recent 20 lines of output in pod nginx
kubectl logs --tail=20 nginx

# Show all logs from pod nginx written in the last hour
kubectl logs --since=1h nginx

# Show all logs with timestamps from pod nginx starting from August 30, 2024, at 06:00:00 UTC
kubectl logs nginx --since-time=2024-08-30T06:00:00Z --timestamps=true

# Show logs from a kubelet with an expired serving certificate
kubectl logs --insecure-skip-tls-verify-backend nginx

# Return snapshot logs from first container of a job named hello
kubectl logs job/hello

# Return snapshot logs from container nginx-1 of a deployment named nginx
kubectl logs deployment/nginx -c nginx-1
```
-->
```shell
# 返回只有一個容器的 nginx Pod 中的快照日誌
kubectl logs nginx

# 從 nginx Pod 返回快照日誌，每行前面加上來源的 Pod 和容器名稱
kubectl logs nginx --prefix

# 從 nginx Pod 返回快照日誌，限制輸出爲 500 字節
kubectl logs nginx --limit-bytes=500

# 從 nginx Pod 返回快照日誌，等待其啓動運行最多 20 秒
kubectl logs nginx --pod-running-timeout=20s

# 返回有多個容器的 nginx Pod 中的快照日誌
kubectl logs nginx --all-containers=true

# 從 nginx Deployment 中的所有 Pod 返回快照日誌
kubectl logs deployment/nginx --all-pods=true 
 
# 返回帶 app=nginx 標籤定義的 Pod 中所有容器的快照日誌
kubectl logs -l app=nginx --all-containers=true

# 返回帶 app=nginx 標籤定義的 Pod 中容器的快照日誌，限制併發日誌請求爲 10 個 Pod
kubectl logs -l app=nginx --max-log-requests=10

# 返回 web-1 Pod 中之前終止的 ruby 容器日誌的日誌
kubectl logs -p -c ruby web-1

# 開始從 nginx Pod 流式傳輸日誌，即使發生錯誤也繼續
kubectl logs nginx -f --ignore-errors=true
 
# 開始流式傳輸 web-1 Pod 中 ruby 容器的日誌
kubectl logs -f -c ruby web-1

# 開始流式傳輸帶 app=nginx 標籤定義的 Pod 中所有容器的日誌
kubectl logs -f -l app=nginx --all-containers=true

# 僅顯示 nginx Pod 的最近 20 行輸出
kubectl logs --tail=20 nginx

# 顯示 nginx Pod 在過去一小時內寫入的所有日誌
kubectl logs --since=1h nginx

# 顯示從 2024 年 8 月 30 日 06:00:00 UTC 開始 nginx Pod 中所有帶時間戳的日誌
kubectl logs nginx --since-time=2024-08-30T06:00:00Z --timestamps=true

# 顯示所提供證書過期的 kubelet 的日誌
kubectl logs --insecure-skip-tls-verify-backend nginx

# 返回名爲 hello 的 Job 的第一個容器的快照日誌
kubectl logs job/hello

# 返回 nginx Deployment 的 nginx-1 容器的快照日誌
kubectl logs deployment/nginx -c nginx-1
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--all-containers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Get all containers' logs in the pod(s).
-->
獲取 Pod 中所有容器的日誌。
</p></td>
</tr>

<tr>
<td colspan="2">--all-pods</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Get logs from all pod(s). Sets prefix to true.
-->
從所有 Pod 獲取日誌。將前綴設置爲 true。
</p>
</td>
</tr>

<tr>
<td colspan="2">-c, --container string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Print the logs of this container
-->
打印指定容器的日誌。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --follow</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify if the logs should be streamed.
-->
指定日誌是否應以流式傳輸。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for logs
-->
logs 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--ignore-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If watching / following pod logs, allow for any errors that occur to be non-fatal
-->
如果在監視/跟隨 Pod 日誌，則允許出現任何非致命的錯誤。
</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify-backend</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Skip verifying the identity of the kubelet that logs are requested from.  In theory, an attacker could provide invalid log content back. You might want to use this if your kubelet serving certificates have expired.
-->
跳過請求日誌來源的 kubelet 的身份驗證。從理論上講，攻擊者可能會提供無效的日誌內容。
如果你的 kubelet 提供的證書已過期，你可能需要使用此參數。
</p></td>
</tr>

<tr>
<td colspan="2">--limit-bytes int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Maximum bytes of logs to return. Defaults to no limit.
-->
要返回的日誌的最大字節數。默認爲無限制。
</p></td>
</tr>

<tr>
<td colspan="2">--max-log-requests int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify maximum number of concurrent logs to follow when using by a selector. Defaults to 5.
-->
指定使用選擇算符時要遵循的最大併發日誌數。默認值爲 5。
</p></td>
</tr>

<tr>
<td colspan="2">--pod-running-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：20s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running
-->
等待至少一個 Pod 運行的時長（例如 5s、2m 或 3h，大於零）。
</p></td>
</tr>

<tr>
<td colspan="2">--prefix</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix each log line with the log source (pod name and container name)
-->
在每行日誌前添加日誌來源（Pod 名稱和容器名稱）的前綴。
</p></td>
</tr>

<tr>
<td colspan="2">-p, --previous</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, print the logs for the previous instance of the container in a pod if it exists.
-->
如果爲 true，則打印 Pod 中容器的前一個實例的日誌（如果存在）。
</p></td>
</tr>

<tr>
<td colspan="2">-l, --selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Selector (label query) to filter on, supports '=', '==', '!=', 'in', 'notin'.(e.g. -l key1=value1,key2=value2,key3 in (value3)). Matching objects must satisfy all of the specified label constraints.
-->
過濾所用的選擇算符（標籤查詢），支持 '='、'=='、'!='、'in' 和 'notin'。
（例如 -l key1=value1,key2=value2,key3 in (value3)）。
匹配的對象必須滿足所有指定的標籤約束。
</p></td>
</tr>

<tr>
<td colspan="2">--since duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Only return logs newer than a relative duration like 5s, 2m, or 3h. Defaults to all logs. Only one of since-time / since may be used.
-->
僅返回比相對時長更新的日誌，如 5s、2m 或 3h。
默認返回所有日誌。只能使用 since-time 和 since 之一。
</p></td>
</tr>

<tr>
<td colspan="2">--since-time string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Only return logs after a specific date (RFC3339). Defaults to all logs. Only one of since-time / since may be used.
-->
僅返回特定日期（RFC3339）之後的日誌。默認返回所有日誌。
只能使用 since-time 和 since 之一。
</p></td>
</tr>

<tr>
<td colspan="2">--tail int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Lines of recent log file to display. Defaults to -1 with no selector, showing all log lines otherwise 10, if a selector is provided.
-->
要顯示的最近日誌文件的行數。不帶選擇算符時默認爲 -1 將顯示所有日誌行。
否則如果提供了選擇算符，則爲 10。
</p></td>
</tr>

<tr>
<td colspan="2">--timestamps</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Include timestamps on each line in the log output
-->
在日誌輸出的每一行中包含時間戳。
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
操作所用的僞裝用戶名。用戶可以是常規用戶或命名空間中的服務賬號。
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
操作所用的僞裝用戶組，此標誌可以被重複設置以指定多個組。
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
操作所用的僞裝 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 中的集羣名稱。
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
要使用的 kubeconfig 上下文的名稱。
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
如果爲 true，則對服務器所有請求的響應不再壓縮。
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
如果爲 true，則不檢查服務器證書的有效性。這將使你的 HTTPS 連接不安全。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Require server version to match client version
-->
要求服務器版本與客戶端版本匹配。
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
如果存在，則是此 CLI 請求所針對的命名空間範圍。
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
對 API 服務器進行基本身份驗證所用的密碼。
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
在放棄某個服務器請求之前等待的時長。非零值應包含相應的時間單位（例如 1s、2m、3h）。
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
Kubernetes API 服務器的地址和端口。
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
數據庫用戶名。
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
服務器證書驗證所用的服務器名稱。如果未提供，則使用與服務器通信所用的主機名。
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
向 API 服務器進行身份驗證的持有者令牌。
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
要使用的 kubeconfig 用戶的名稱。
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
對 API 服務器進行基本身份驗證時所用的用戶名。
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
將從服務器收到的警告視爲錯誤，並以非零退出碼退出。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 用於控制 Kubernetes 集羣管理器
