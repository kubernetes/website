---
title: kubectl debug
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl debug
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Debug cluster resources using interactive debugging containers.

 'debug' provides automation for common debugging tasks for cluster objects identified by resource and name. Pods will be used by default if no resource is specified.

 The action taken by 'debug' varies depending on what resource is specified. Supported actions include:
-->
使用交互式調試容器調試叢集資源。

“debug” 針對按資源和名稱標識的叢集對象爲常用的調試任務提供自動化操作。如果不指定資源，則默認使用 Pod。

“debug” 採取的操作因指定的資源而異。支持的操作包括：

<!--
*  Workload: Create a copy of an existing pod with certain attributes changed, for example changing the image tag to a new version.
  *  Workload: Add an ephemeral container to an already running pod, for example to add debugging utilities without restarting the pod.
  *  Node: Create a new pod that runs in the node's host namespaces and can access the node's filesystem.
-->
* 工作負載：創建現有 Pod 的副本並更改某些屬性，例如將映像檔標籤更改爲新版本。
* 工作負載：向已運行的 Pod 中添加臨時容器，例如在不重啓 Pod 的情況下添加調試工具。
* 節點：新建一個在節點的主機命名空間中運行並可以訪問節點文件系統的 Pod。

<!--
Note: When a non-root user is configured for the entire target Pod, some capabilities granted by debug profile may not work.
-->
注意：當爲目標 Pod 設定了非 root 使用者時，由調試模式授予的某些能力可能無法工作。

```shell
kubectl debug (POD | TYPE[[.VERSION].GROUP]/NAME) [ -- COMMAND [args...] ]
```

## {{% heading "examples" %}}

<!--
```
# Create an interactive debugging session in pod mypod and immediately attach to it.
kubectl debug mypod -it --image=busybox

# Create an interactive debugging session for the pod in the file pod.yaml and immediately attach to it.
# (requires the EphemeralContainers feature to be enabled in the cluster)
kubectl debug -f pod.yaml -it --image=busybox

# Create a debug container named debugger using a custom automated debugging image.
kubectl debug --image=myproj/debug-tools -c debugger mypod

# Create a copy of mypod adding a debug container and attach to it
kubectl debug mypod -it --image=busybox --copy-to=my-debugger

# Create a copy of mypod changing the command of mycontainer
kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh

# Create a copy of mypod changing all container images to busybox
kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox

# Create a copy of mypod adding a debug container and changing container images
kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug

# Create an interactive debugging session on a node and immediately attach to it.
# The container will run in the host namespaces and the host's filesystem will be mounted at /host
kubectl debug node/mynode -it --image=busybox
```
-->
```shell
# 在名爲 mypod 的 Pod 中創建一個交互式調試會話並立即掛接到此會話
kubectl debug mypod -it --image=busybox

# 爲文件 pod.yaml 中的 Pod 創建一個交互式調試會話並立即掛接到此會話
# （需要在集羣中啓用 EphemeralContainers 特性）
kubectl debug -f pod.yaml -it --image=busybox

# 使用特定的自動調試鏡像創建一個名爲 debugger 的調試容器
kubectl debug --image=myproj/debug-tools -c debugger mypod

# 創建 mypod 的副本，添加調試容器並掛接到此容器
kubectl debug mypod -it --image=busybox --copy-to=my-debugger

# 創建 mypod 的副本，更改 mycontainer 的命令
kubectl debug mypod -it --copy-to=my-debugger --container=mycontainer -- sh

# 創建 mypod 的副本，將所有容器鏡像更改爲 busybox
kubectl debug mypod --copy-to=my-debugger --set-image=*=busybox

# 創建 mypod 的副本，添加調試容器並更改容器鏡像
kubectl debug mypod -it --copy-to=my-debugger --image=debian --set-image=app=app:debug,sidecar=sidecar:debug

# 在節點上創建一個交互式調試會話並立即掛接到此會話
# 容器將在主機命名空間中運行，主機的文件系統將被掛載到 /host
kubectl debug node/mynode -it --image=busybox
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--arguments-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If specified, everything after -- will be passed to the new container as Args instead of Command.
-->
如果指定，`--` 之後的所有內容將作爲 Args 而不是作爲 Command 傳遞給新容器。
</p>
</td>
</tr>

<tr>
<td colspan="2">--attach</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, wait for the container to start running, and then attach as if 'kubectl attach ...' were called.  Default false, unless '-i/--stdin' is set, in which case the default is true.
-->
如果爲 true，則等待容器開始運行，然後就像以前調用 "kubectl attach ..." 一樣執行掛接操作。
默認爲 false，如果設置了 "-i/--stdin"，則默認爲 true。
</p>
</td>
</tr>

<tr>
<td colspan="2">-c, --container string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Container name to use for debug container.
-->
調試容器要使用的容器名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--copy-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Create a copy of the target Pod with this name.
-->
創建目標 Pod 的副本，並將副本命名爲指定名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--custom string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a JSON or YAML file containing a partial container spec to customize built-in debug profiles.
-->
包含部分容器規約的 JSON 或 YAML 文件的路徑，用於自定義內置調試設定文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--env stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: []-->默認值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Environment variables to set in the container.
-->
要在容器中設置的環境變量。
</p>
</td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
identifying the resource to debug
-->
標識要調試的資源。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for debug
-->
debug 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--image string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Container image to use for debug container.
-->
調試容器要使用的容器映像檔。
</p>
</td>
</tr>

<tr>
<td colspan="2">--image-pull-policy string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The image pull policy for the container. If left empty, this value will not be specified by the client and defaulted by the server.
-->
容器的映像檔拉取策略。如果留空，此值將不會由客戶端指定，而是默認由伺服器指定。
</p>
</td>
</tr>

<tr>
<td colspan="2">--keep-annotations</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod annotations.(This flag only works when used with '--copy-to')
-->
如果爲真，則保留原始 Pod 的註解。
（此標誌僅與 '--copy-to' 一起使用時纔有效）
</p>
</td>
</tr>

<tr>
<td colspan="2">--keep-init-containers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: true-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Run the init containers for the pod. Defaults to true.(This flag only works when used with '--copy-to')
-->
運行 Pod 的初始化容器，默認爲 true。
（此標誌僅與 '--copy-to' 一起使用時纔有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-labels</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod labels.(This flag only works when used with '--copy-to')
-->
如果爲真，則保留原始 Pod 的標籤。
（此標誌僅與 '--copy-to' 一起使用時纔有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-liveness</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod liveness probes.(This flag only works when used with '--copy-to')
-->
如果爲真，則保留原始 Pod 的存活性檢測。
（此標誌僅與 '--copy-to' 一起使用時纔有效）
</p></td>
</tr>

<tr>
<td colspan="2">--keep-readiness</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original pod readiness probes.(This flag only works when used with '--copy-to')
-->
如果爲真，則保留原始 Pod 的就緒性探測。
（此標誌僅與 '--copy-to; 一起使用時纔有效）
</p>
</td>
</tr>

<tr>
<td colspan="2">--keep-startup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the original startup probes.(This flag only works when used with '--copy-to')
-->
如果爲真，則保留原始 Pod 的啓動性檢測。
（此標誌僅與 '--copy-to' 一起使用時纔有效）
</p>
</td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "legacy"-->默認值："legacy"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Options are &quot;legacy&quot;, &quot;general&quot;, &quot;baseline&quot;, &quot;netadmin&quot;, &quot;restricted&quot; or &quot;sysadmin&quot;.
-->
可選項包括 "legacy"、"general"、"baseline"、"netadmin"、"restricted" 或 "sysadmin"。
</p>
</td>
</tr>

<tr>
<td colspan="2">-q, --quiet</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, suppress informational messages.
-->
如果爲 true，則抑制資訊類消息。
</p>
</td>
</tr>

<tr>
<td colspan="2">--replace</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When used with '--copy-to', delete the original Pod.
-->
當與 '--copy-to' 一起使用時，刪除原來的 Pod。
</p>
</td>
</tr>

<tr>
<td colspan="2">--same-node</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When used with '--copy-to', schedule the copy of target Pod on the same node.
-->
當與 '--copy-to' 一起使用時，將目標 Pod 的副本調度到同一個節點上。
</p>
</td>
</tr>

<tr>
<td colspan="2">--set-image stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: []-->默認值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When used with '--copy-to', a list of name=image pairs for changing container images, similar to how 'kubectl set image' works.
-->
當與 '--copy-to' 一起使用時，提供一個 name=image 對的列表以更改容器映像檔，類似於 `kubectl set image` 的工作方式。
</p>
</td>
</tr>

<tr>
<td colspan="2">--share-processes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: true-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When used with '--copy-to', enable process namespace sharing in the copy.
-->
當與 '--copy-to' 一起使用時，在副本中啓用進程命名空間共享。
</p>
</td>
</tr>

<tr>
<td colspan="2">-i, --stdin</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Keep stdin open on the container(s) in the pod, even if nothing is attached.
-->
即使什麼都沒掛接，也要保持 Pod 中容器上的標準輸入處於打開狀態。
</p>
</td>
</tr>

<tr>
<td colspan="2">--target string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When using an ephemeral container, target processes in this container name.
-->
當使用臨時容器時，將目標鎖定爲名稱所指定的容器中的進程。
</p>
</td>
</tr>

<tr>
<td colspan="2">-t, --tty</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Allocate a TTY for the debugging container.
-->
爲調試容器分配 TTY。
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
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "$HOME/.kube/cache"-->默認值："$HOME/.kube/cache"</td>
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
要使用的 kubeconfig 中的叢集名稱。
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
數據庫 host:port
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
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 叢集管理器
