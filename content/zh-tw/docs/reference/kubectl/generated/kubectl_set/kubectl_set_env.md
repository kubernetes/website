---
title: kubectl set env
content_type: tool-reference
weight: 30
---
<!--
title: kubectl set env
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
Update environment variables on a pod template.

 List environment variable definitions in one or more pods, pod templates. Add, update, or remove container environment variable definitions in one or more pod templates (within replication controllers or deployment configurations). View or modify the environment variable definitions on all containers in the specified pods or pod templates, or just those that match a wildcard.
-->
更新 Pod 模板中的環境變量。

列舉一個或多個 Pod 和 Pod 模板中的環境變量定義。
添加、更新或移除（在副本控制器或 Deployment 設定中的）一個或多個 Pod 模板中的容器環境變量定義。
查看或修改指定 Pod 或 Pod 模板中所有容器的環境變量定義，或者只查看與通配符匹配的那些環境變量定義。

<!--
If "--env -" is passed, environment variables can be read from STDIN using the standard env syntax.

 Possible resources include (case insensitive):

        pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), statefulset (sts), cronjob (cj), replicaset (rs)
-->
如果在命令列上設置了 "--env -"，則可以使用標準的 env 語法從標準輸入中讀取環境變量。

可能的資源包括（不區分大小寫）：

```
pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), statefulset (sts), cronjob (cj), replicaset (rs)
```

```shell
kubectl set env RESOURCE/NAME KEY_1=VAL_1 ... KEY_N=VAL_N
```

## {{% heading "examples" %}}

<!--
```shell
# Update deployment 'registry' with a new environment variable
kubectl set env deployment/registry STORAGE_DIR=/local
  
# List the environment variables defined on a deployments 'sample-build'
kubectl set env deployment/sample-build --list
  
# List the environment variables defined on all pods
kubectl set env pods --all --list
  
# Output modified deployment in YAML, and does not alter the object on the server
kubectl set env deployment/sample-build STORAGE_DIR=/data -o yaml
  
# Update all containers in all replication controllers in the project to have ENV=prod
kubectl set env rc --all ENV=prod
  
# Import environment from a secret
kubectl set env --from=secret/mysecret deployment/myapp
  
# Import environment from a config map with a prefix
kubectl set env --from=configmap/myconfigmap --prefix=MYSQL_ deployment/myapp
  
# Import specific keys from a config map
kubectl set env --keys=my-example-key --from=configmap/myconfigmap deployment/myapp
  
# Remove the environment variable ENV from container 'c1' in all deployment configs
kubectl set env deployments --all --containers="c1" ENV-
  
# Remove the environment variable ENV from a deployment definition on disk and
# update the deployment config on the server
kubectl set env -f deploy.json ENV-
  
# Set some of the local shell environment into a deployment config on the server
env | grep RAILS_ | kubectl set env -e - deployment/registry
```
-->
```shell
# 使用新的環境變量更新 Deployment “registry”
kubectl set env deployment/registry STORAGE_DIR=/local
  
# 列舉 Deployment “sample-build” 中定義的環境變量
kubectl set env deployment/sample-build --list
  
# 列舉所有 Pod 中定義的環境變量
kubectl set env pods --all --list
  
# 以 YAML 格式輸出修改後的 Deployment，但不更改伺服器上的對象
kubectl set env deployment/sample-build STORAGE_DIR=/data -o yaml
  
# 更新項目中所有副本控制器中的所有容器，爲之添加 ENV=prod
kubectl set env rc --all ENV=prod
  
# 從 Secret 導入環境變量
kubectl set env --from=secret/mysecret deployment/myapp
  
# 從帶前綴的 ConfigMap 中導入環境變量
kubectl set env --from=configmap/myconfigmap --prefix=MYSQL_ deployment/myapp
  
# 從 ConfigMap 中導入特定鍵
kubectl set env --keys=my-example-key --from=configmap/myconfigmap deployment/myapp
  
# 從所有 Deployment 配置中的容器 “c1” 中移除環境變量 ENV
kubectl set env deployments --all --containers="c1" ENV-
  
# 從磁盤上的 Deployment 定義中移除環境變量 ENV 並更新伺服器上的 Deployment 配置
kubectl set env -f deploy.json ENV-
  
# 將某些本地 Shell 環境變量設置到伺服器上的 Deployment 配置中
env | grep RAILS_ | kubectl set env -e - deployment/registry
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, select all resources in the namespace of the specified resource types
-->
如果爲真，則選擇指定資源類型的命名空間中的所有資源。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，在模板中字段或映射鍵缺失時忽略模板中的錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
</p></td>
</tr>

<tr>
<td colspan="2">-c, --containers string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："*"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The names of containers in the selected pod templates to change - may use wildcards
-->
所選 Pod 模板中要更改的容器名稱 - 可以使用通配符。
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Must be &quot;none&quot;, &quot;server&quot;, or &quot;client&quot;. If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource.
-->
必須是 "none"、"server" 或 "client"。如果是 client 策略，僅打印將要發送的對象，而不實際發送。
如果是 server 策略，提交伺服器端請求而不持久化資源。
</p></td>
</tr>

<tr>
<td colspan="2">-e, --env strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify a key-value pair for an environment variable to set into each container.
-->
爲某個環境變量指定一個鍵值對列表，以設置到每個容器中。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："kubectl-set"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the manager used to track field ownership.
-->
用於跟蹤字段屬主關係的管理器的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Filename, directory, or URL to files the resource to update the env
-->
文件名、目錄或文件 URL 組成的列表，用於標識要更新環境的資源。
</p></td>
</tr>

<tr>
<td colspan="2">--from string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of a resource from which to inject environment variables
-->
要從中注入環境變量的資源的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for env
-->
env 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--keys strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of keys to import from specified resource
-->
要從指定的資源中導入的、以英文逗號分隔的鍵的列表。
</p></td>
</tr>

<tr>
<td colspan="2">-k, --kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process the kustomization directory. This flag can't be used together with -f or -R.
-->
處理 kustomization 目錄。此標誌不能與 -f 或 -R 一起使用。
</p></td>
</tr>

<tr>
<td colspan="2">--list</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, display the environment and any changes in the standard format. this flag will removed when we have kubectl view env.
-->
如果爲真，則以標準格式顯示環境及所有變更。
當我們使用 `kubectl view env` 命令時，此標誌將被移除。
</p></td>
</tr>

<tr>
<td colspan="2">--local</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, set env will NOT contact api-server but run locally.
-->
如果爲真，`set env` 將不會與 API 伺服器通信，而是在本地運行。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
-->
輸出格式。可選值爲：
json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、jsonpath-as-json、jsonpath-file。
</p></td>
</tr>

<tr>
<td colspan="2">--overwrite&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, allow environment to be overwritten, otherwise reject updates that overwrite existing environment.
-->
如果爲真，允許環境被覆蓋，否則拒絕要覆蓋現有環境的更新。
</p></td>
</tr>

<tr>
<td colspan="2">--prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Prefix to append to variable names
-->
要追加到變量名上的前綴。
</p></td>
</tr>

<tr>
<td colspan="2">-R, --recursive</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
-->
遞歸處理在 -f、--filename 中給出的目錄。當你想要管理位於同一目錄中的相關清單時很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--resolve</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, show secret or configmap references when listing variables
-->
如果爲真，則在列出變量時顯示 Secret 或 ConfigMap 引用。
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
（例如 -l key1=value1,key2=value2,key3 in (value3)）。匹配的對象必須滿足所有指定的標籤約束。
</p></td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲真，在以 JSON 或 YAML 格式打印對象時保留 managedFields。
</p></td>
</tr>

<tr>
<td colspan="2">--template string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
-->
操作所用的僞裝使用者名。使用者可以是常規使用者或命名空間中的服務賬號。
</p>
</td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
-->
操作所用的僞裝使用者組，此標誌可以被重複設置以指定多個組。
</p>
</td>
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
</p>
</td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "$HOME/.kube/cache"-->默認值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Default cache directory
-->
默認緩存目錄。
</p>
</td>
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
</p>
</td>
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
</p>
</td>
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
</p>
</td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 中叢集的名稱。
</p>
</td>
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
</p>
</td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, opt-out of response compression for all requests to the server
-->
如果爲 true，則對伺服器所有請求的響應不再壓縮。
</p>
</td>
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
</p>
</td>
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
</p>
</td>
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
特性門控或關閉 KUBERC=off 特性來禁用此功能。
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
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "none"-->默認值："none"</td>
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
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "profile.pprof"-->默認值："profile.pprof"</td>
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
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "0"-->默認值："0"</td>
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
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1m0s-->默認值：1m0s</td>
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
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "cadvisor"-->默認值："cadvisor"</td>
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
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "localhost:8086"-->默認值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
數據庫 host:port。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默認值："root"</td>
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
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "stats"-->默認值："stats"</td>
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
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默認值："root"</td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
-->
伺服器證書驗證所用的伺服器名稱。如果未提供，則使用與伺服器通信所用的主機名。
</p>
</td>
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
* [kubectl set](../)	 - Set specific features on objects
-->
* [kubectl set](../) - 爲對象設置功能特性
