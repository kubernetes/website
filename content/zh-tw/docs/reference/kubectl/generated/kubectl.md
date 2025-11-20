---
title: kubectl
content_type: tool-reference
weight: 30
---
<!--
title: kubectl
content_type: tool-reference
weight: 30
auto_generated: true
-->

## {{% heading "synopsis" %}}

<!--
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/
-->
kubectl 用於控制 Kubernetes 叢集管理器。

參閱更多細節：
https://kubernetes.io/zh-cn/docs/reference/kubectl/

```bash
kubectl [flags]
```

## {{% heading "options" %}}

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
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Default cache directory
-->
預設緩存目錄。
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
證書機構的證書檔案的路徑。
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
TLS 客戶端證書檔案的路徑。
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
TLS 客戶端密鑰檔案的路徑。
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
要使用的 kubeconfig 中的叢集名稱。
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for kubectl
-->
kubectl 操作的幫助命令。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the kubeconfig file to use for CLI requests.
-->
CLI 請求要使用的 kubeconfig 檔案的路徑。
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
用於偏好設置的 kuberc 檔案的路徑。可以通過導出 KUBECTL_KUBERC=false
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Password for basic authentication to the API server
-->
對 API 伺服器進行基本身份驗證所用的密碼。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要記錄的性能分析資訊。可選值爲（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of the file to write the profile to
-->
性能分析資訊要寫入的目標檔案的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
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
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
對儲存驅動的寫入操作將被緩存的時長；緩存的操作會作爲一個事務提交給非內存後端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database name
-->
資料庫名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database host:port
-->
資料庫 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database password
-->
資料庫密碼。
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
使用與資料庫的安全連接。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
table name
-->
表名。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database username
-->
資料庫使用者名。
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
--version, --version=raw 打印版本資訊並退出；--version=vX.Y.Z... 設置報告的版本。
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
* [kubectl annotate](../kubectl_annotate/) - Update the annotations on a resource
* [kubectl api-resources](../kubectl_api-resources/) - Print the supported API resources on the server
* [kubectl api-versions](../kubectl_api-versions/) - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](../kubectl_apply/) - Apply a configuration to a resource by file name or stdin
* [kubectl attach](../kubectl_attach/) - Attach to a running container
-->
* [kubectl annotate](../kubectl_annotate/) - 更新資源上的註解
* [kubectl api-resources](../kubectl_api-resources/) - 打印伺服器上所支持的 API 資源
* [kubectl api-versions](../kubectl_api-versions/) - 以“組/版本”的格式輸出服務端所支持的 API 版本
* [kubectl apply](../kubectl_apply/) - 基於檔案名或標準輸入，將新的設定應用到資源上
* [kubectl attach](../kubectl_attach/) - 掛接到一個正在運行的容器
<!--
* [kubectl auth](../kubectl_auth/) - Inspect authorization
* [kubectl autoscale](../kubectl_autoscale/) - Auto-scale a deployment, replica set, stateful set, or replication controller
* [kubectl certificate](../kubectl_certificate/) - Modify certificate resources
* [kubectl cluster-info](../kubectl_cluster-info/) - Display cluster information
* [kubectl completion](../kubectl_completion/) - Output shell completion code for the specified shell (bash, zsh, fish, or powershell)
* [kubectl config](../kubectl_config/) - Modify kubeconfig files
-->
* [kubectl auth](../kubectl_auth/) - 檢查授權資訊
* [kubectl autoscale](../kubectl_autoscale/) - 對一個資源對象
  （Deployment、ReplicaSet 或 ReplicationController）進行自動擴縮
* [kubectl certificate](../kubectl_certificate/) - 修改證書資源
* [kubectl cluster-info](../kubectl_cluster-info/) - 顯示叢集資訊
* [kubectl completion](../kubectl_completion/) - 根據已經給出的 Shell（bash 或 zsh），輸出 Shell 補全後的代碼
* [kubectl config](../kubectl_config/) - 修改 kubeconfig 設定檔案
<!--
* [kubectl cordon](../kubectl_cordon/) - Mark node as unschedulable
* [kubectl cp](../kubectl_cp/) - Copy files and directories to and from containers
* [kubectl create](../kubectl_create/) - Create a resource from a file or from stdin
* [kubectl debug](../kubectl_debug/) - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](../kubectl_delete/) - Delete resources by file names, stdin, resources and names, or by resources and label selector
-->
* [kubectl cordon](../kubectl_cordon/) - 標記節點爲不可調度的
* [kubectl cp](../kubectl_cp/) - 將檔案和目錄拷入/拷出容器
* [kubectl create](../kubectl_create/) - 通過檔案或標準輸入來創建資源
* [kubectl debug](../kubectl_debug/) - 創建用於排查工作負載和節點故障的調試會話
* [kubectl delete](../kubectl_delete/) - 通過檔案名、標準輸入、資源和名字刪除資源，
  或者通過資源和標籤選擇算符來刪除資源
<!--
* [kubectl describe](../kubectl_describe/) - Show details of a specific resource or group of resources
* [kubectl diff](../kubectl_diff/) - Diff the live version against a would-be applied version
* [kubectl drain](../kubectl_drain/) - Drain node in preparation for maintenance
* [kubectl edit](../kubectl_edit/) - Edit a resource on the server
* [kubectl events](../kubectl_events/) - List events
* [kubectl exec](../kubectl_exec/) - Execute a command in a container
* [kubectl explain](../kubectl_explain/) - Get documentation for a resource
* [kubectl expose](../kubectl_expose/) - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
-->
* [kubectl describe](../kubectl_describe/) - 顯示某個資源或某組資源的詳細資訊
* [kubectl diff](../kubectl_diff/) - 顯示目前版本與將要應用的版本之間的差異
* [kubectl drain](../kubectl_drain/) - 騰空節點，準備維護
* [kubectl edit](../kubectl_edit/) - 修改伺服器上的某資源
* [kubectl events](../kubectl_events/) - 列舉事件
* [kubectl exec](../kubectl_exec/) - 在容器中執行命令
* [kubectl explain](../kubectl_explain/) - 顯示資源文檔說明
* [kubectl expose](../kubectl_expose/) - 給定 ReplicationController、Service、Deployment 或 Pod，
  將其暴露爲新的 kubernetes Service
<!--
* [kubectl get](../kubectl_get/) - Display one or many resources
* [kubectl kustomize](../kubectl_kustomize/) - Build a kustomization target from a directory or URL
* [kubectl label](../kubectl_label/) - Update the labels on a resource
* [kubectl logs](../kubectl_logs/) - Print the logs for a container in a pod
* [kubectl options](../kubectl_options/) - Print the list of flags inherited by all commands
* [kubectl patch](../kubectl_patch/) - Update fields of a resource
-->
* [kubectl get](../kubectl_get/) - 顯示一個或者多個資源
* [kubectl kustomize](../kubectl_kustomize/) - 基於目錄或遠程 URL 內容構建 kustomization 目標
* [kubectl label](../kubectl_label/) - 更新資源的標籤
* [kubectl logs](../kubectl_logs/) - 輸出 Pod 中某容器的日誌
* [kubectl options](../kubectl_options/) - 打印所有命令都支持的共有參數列表
* [kubectl patch](../kubectl_patch/) - 更新某資源中的字段
<!--
* [kubectl plugin](../kubectl_plugin/) - Provides utilities for interacting with plugins
* [kubectl port-forward](../kubectl_port-forward/) - Forward one or more local ports to a pod
* [kubectl proxy](../kubectl_proxy/) - Run a proxy to the Kubernetes API server
* [kubectl replace](../kubectl_replace/) - Replace a resource by file name or stdin
* [kubectl rollout](../kubectl_rollout/) - Manage the rollout of a resource
* [kubectl run](../kubectl_run/) - Run a particular image on the cluster
-->
* [kubectl plugin](../kubectl_plugin/) - 提供與插件交互的工具
* [kubectl port-forward](../kubectl_port-forward/) - 將一個或者多個本地端口轉發到 Pod
* [kubectl proxy](../kubectl_proxy/) - 運行一個 kubernetes API 伺服器代理
* [kubectl replace](../kubectl_replace/) - 基於檔案名或標準輸入替換資源
* [kubectl rollout](../kubectl_rollout/) - 管理資源的上線
* [kubectl run](../kubectl_run/) - 在叢集中使用指定映像檔啓動容器
<!--
* [kubectl scale](../kubectl_scale/) - Set a new size for a deployment, replica set, or replication controller
* [kubectl set](../kubectl_set/) - Set specific features on objects
* [kubectl taint](../kubectl_taint/) - Update the taints on one or more nodes
* [kubectl top](../kubectl_top/) - Display resource (CPU/memory) usage
* [kubectl uncordon](../kubectl_uncordon/) - Mark node as schedulable
* [kubectl version](../kubectl_version/) - Print the client and server version information
* [kubectl wait](../kubectl_wait/) - Experimental: Wait for a specific condition on one or many resources
-->
* [kubectl scale](../kubectl_scale/) - 爲一個 Deployment、ReplicaSet 或
  ReplicationController 設置一個新的規模值
* [kubectl set](../kubectl_set/) - 爲對象設置功能特性
* [kubectl taint](../kubectl_taint/) - 在一個或者多個節點上更新污點設定
* [kubectl top](../kubectl_top/) - 顯示資源（CPU/內存/儲存）使用率
* [kubectl uncordon](../kubectl_uncordon/) - 標記節點爲可調度的
* [kubectl version](../kubectl_version/) - 打印客戶端和伺服器的版本資訊
* [kubectl wait](../kubectl_wait/) - 實驗級特性：等待一個或多個資源達到某種狀態
