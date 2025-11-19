---
title: kubectl expose
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl expose
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Expose a resource as a new Kubernetes service.

 Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the resource it exposes.
-->
將資源公開爲新的 Kubernetes 服務。

基於名稱查找 Deployment、Service、ReplicaSet、ReplicationController 或 Pod，
並將該資源的選擇算符用作指定端口上新服務的選擇算符。
只有當 Deployment 或 ReplicaSet 的選擇算符可轉換爲服務支持的選擇算符
（即選擇算符僅包含 matchLabels 部分）時，纔會將其公開爲服務。
請注意，如果未通過 --port 指定端口且所公開的資源有多個端口，
則新服務將重用所有這些端口。此外，如果未指定標籤，新服務將重用它所公開的資源的標籤。

<!--
Possible resources include (case insensitive):

 pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)
-->
可能的資源包括（不區分大小寫）：

```
pod (po)，service (svc)，replicationcontroller (rc)，deployment (deploy)，replicaset (rs)
```

kubectl expose 命令的格式爲：

```shell
kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

## {{% heading "examples" %}}

<!--
```
# Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000

# Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https

# Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream

# Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000
kubectl expose rs nginx --port=80 --target-port=8000

# Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000
kubectl expose deployment nginx --port=80 --target-port=8000
```
-->
```shell
# 爲多副本的 nginx 創建一個服務，服務端口爲 80，通過端口 8000 連接到容器
kubectl expose rc nginx --port=80 --target-port=8000

# 爲在 "nginx-controller.yaml" 中以 type 和 name 指定的 ReplicationController 創建一個服務
# 服務端口爲 80，通過端口 8000 連接到容器
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000

# 爲名爲 valid-pod 的 Pod 創建一個服務，服務端口爲 444，名稱爲 "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# 基於上述服務創建第二個服務，將容器端口 8443 公開爲端口 443，名稱爲 "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https

# 爲在端口 4100 上平衡 UDP 流量的多副本流應用創建一個服務，名稱爲 “video-stream”
kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream

# 爲使用 ReplicaSet 的多副本 nginx 創建一個服務，服務端口爲 80，通過端口 8000 連接到容器
kubectl expose rs nginx --port=80 --target-port=8000

# 爲 nginx Deployment 創建一個服務，服務端口爲 80，通過端口 8000 連接到容器
kubectl expose deployment nginx --port=80 --target-port=8000
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
<td colspan="2">--cluster-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless service.
-->
要指派給服務的 ClusterIP。留空表示自動分配，或設置爲 “None” 以創建無頭服務。
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Must be &quot;none&quot;, &quot;server&quot;, or &quot;client&quot;. If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource.
-->
必須是 "none"、"server" 或 "client"。如果是 client 策略，僅打印將要發送的對象，而不實際發送。
如果是 server 策略，提交伺服器端請求而不持久化資源。
</p></td>
</tr>

<tr>
<td colspan="2">--external-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP.
-->
服務要接受的附加外部 IP 地址（不由 Kubernetes 管理）。
如果此 IP 被路由到某個節點，則除了生成的服務 IP 之外，還可以通過此 IP 訪問服務。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："kubectl-expose"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Filename, directory, or URL to files identifying the resource to expose a service
-->
文件名、目錄或文件 URL 列表，用於標識要公開服務的資源。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for expose
-->
expose 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">-k, --kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Process the kustomization directory. This flag can't be used together with -f or -R.
-->
處理 kustomization 目錄。此標誌不能與 -f 或 -R 一起使用。
</p></td>
</tr>

<tr>
<td colspan="2">-l, --labels string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Labels to apply to the service created by this call.
-->
要應用到此子命令所創建的服務上的標籤。
</p></td>
</tr>

<tr>
<td colspan="2">--load-balancer-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
IP to assign to the LoadBalancer. If empty, an ephemeral IP will be created and used (cloud-provider specific).
-->
要指派給負載均衡器的 IP。如果爲空，將創建並使用一個臨時 IP（具體取決於雲提供商）。
</p></td>
</tr>

<tr>
<td colspan="2">--name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name for the newly created object.
-->
新建對象的名稱。
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
<td colspan="2">--override-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："merge"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The method used to override the generated object: json, merge, or strategic.
-->
用於覆蓋已生成對象的方法：json、merge 或 strategic。
</p></td>
</tr>

<tr>
<td colspan="2">--overrides string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.
-->
用於覆蓋已生成對象的內聯 JSON。如果此字段非空，它將用於覆蓋已生成的對象。
要求對象提供一個有效的 apiVersion 字段。
</p></td>
</tr>

<tr>
<td colspan="2">--port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The port that the service should serve on. Copied from the resource being exposed, if unspecified
-->
應該用於提供服務的端口。如果不指定，則從正被公開的資源複製。
</p></td>
</tr>

<tr>
<td colspan="2">--protocol string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The network protocol for the service to be created. Default is 'TCP'.
-->
要創建的服務的網路協議。默認是 'TCP'。
</p></td>
</tr>

<tr>
<td colspan="2">-R, --recursive</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
-->
以遞歸方式處理在 -f、--filename 中給出的目錄。當你想要管理位於同一目錄中的相關清單時很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--save-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
-->
如果爲 true，則當前對象的設定將被保存在其註解中。否則，註解將保持不變。
當你希望後續對此對象執行 `kubectl apply` 操作時，此標誌很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set.)
-->
指定服務所用的標籤選擇算符。僅支持基於等式的選擇算符需求。
如果爲空（默認值），則從 ReplicationController 或 ReplicaSet 中推斷選擇算符。
</p></td>
</tr>

<tr>
<td colspan="2">--session-affinity string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'
-->
如果非空，將服務的會話親和性設置爲此值；有效值爲：'None'、'ClientIP'。
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
<td colspan="2">--target-port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name or number for the port on the container that the service should direct traffic to. Optional.
-->
容器上服務應將流量導向的端口名稱或端口號。可選。
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

<tr>
<td colspan="2">--type string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Type for this service: ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.
-->
此服務的類別：ClusterIP、NodePort、LoadBalancer 或 ExternalName。默認是 “ClusterIP”。
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
操作所用的僞裝使用者組，此標誌可以被重複設置以指定多個組。
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
要使用的 kubeconfig 叢集的名稱。
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
