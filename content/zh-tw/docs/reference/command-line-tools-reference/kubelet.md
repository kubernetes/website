---
title: kubelet
content_type: tool-reference
weight: 28
---

## {{% heading "synopsis" %}}


<!--
The kubelet is the primary "node agent" that runs on each node. It can
register the node with the apiserver using one of: the hostname; a flag to
override the hostname; or specific logic for a cloud provider.
-->
kubelet 是在每個 Node 節點上執行的主要 “節點代理”。它可以使用以下之一向 apiserver 註冊：
主機名（hostname）；覆蓋主機名的引數；某雲驅動的特定邏輯。

<!--
The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided
through various mechanisms (primarily through the apiserver) and ensures that
the containers described in those PodSpecs are running and healthy. The
kubelet doesn't manage containers which were not created by Kubernetes.
-->
kubelet 是基於 PodSpec 來工作的。每個 PodSpec 是一個描述 Pod 的 YAML 或 JSON 物件。
kubelet 接受透過各種機制（主要是透過 apiserver）提供的一組 PodSpec，並確保這些
PodSpec 中描述的容器處於執行狀態且執行狀況良好。
kubelet 不管理不是由 Kubernetes 建立的容器。

<!--
Other than from a PodSpec from the apiserver, there are three ways that a
container manifest can be provided to the Kubelet.
-->
除了來自 apiserver 的 PodSpec 之外，還可以透過以下三種方式將容器清單（manifest）提供給 kubelet。

<!--
- File: Path passed as a flag on the command line. Files under this path will be
  monitored periodically for updates. The monitoring period is 20s by default
  and is configurable via a flag.
-->
- 檔案（File）：利用命令列引數傳遞路徑。kubelet 週期性地監視此路徑下的檔案是否有更新。
  監視週期預設為 20s，且可透過引數進行配置。

<!--
- HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This
  endpoint is checked every 20 seconds (also configurable with a flag).
-->
- HTTP 端點（HTTP endpoint）：利用命令列引數指定 HTTP 端點。
  此端點的監視週期預設為 20 秒，也可以使用引數進行配置。

<!--
- HTTP server: The kubelet can also listen for HTTP and respond to a simple API
  (underspec'd currently) to submit a new manifest.
-->
- HTTP 伺服器（HTTP server）：kubelet 還可以偵聽 HTTP 並響應簡單的 API
  （目前沒有完整規範）來提交新的清單。

```
kubelet [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, adds the file directory to the header of the log messages (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定為 true 表示將檔案目錄新增到日誌訊息的頭部
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the Kubelet to serve on (set to <code>0.0.0.0</code> for all IPv4 interfaces and <code>::</code> for all IPv6 interfaces)  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 用來提供服務的 IP 地址（設定為<code>0.0.0.0</code> 表示使用所有 IPv4 介面，
設定為 <code>::</code> 表示使用所有 IPv6 介面）。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--allowed-unsafe-sysctls strings</td>
</tr>  
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in <code>*</code>). Use these at your own risk. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的字串序列設定允許使用的非安全的 sysctls 或 sysctl 模式（以 <code>*</code> 結尾）。
使用此引數時風險自擔。（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Log to standard error as well as files (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定為 true 表示將日誌輸出到檔案的同時輸出到 stderr
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the Kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of <code>system:anonymous</code>, and a group name of <code>system:unauthenticated</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定為 true 表示 kubelet 伺服器可以接受匿名請求。未被任何認證元件拒絕的請求將被視為匿名請求。
匿名請求的使用者名稱為 <code>system:anonymous</code>，使用者組為 <code>system:unauthenticated</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use the TokenReview API to determine authentication for bearer tokens. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
使用 <code>TokenReview</code> API 對持有者令牌進行身份認證。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator. (default 2m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 令牌認證元件所返回的響應的快取時間。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-mode string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Authorization mode for Kubelet server. Valid options are <code>AlwaysAllow</code> or <code>Webhook</code>. <code>Webhook</code> mode uses the <code>SubjectAccessReview</code> API to determine authorization. (default "AlwaysAllow" when <code>--config</code> flag is not provided; "Webhook" when <code>--config</code> flag presents.) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 伺服器的鑑權模式。可選值包括：<code>AlwaysAllow</code>、<code>Webhook</code>。<code>Webhook</code> 模式使用 <code>SubjectAccessReview</code> API 鑑權。
當 <code>--config</code> 引數未被設定時，預設值為 <code>AlwaysAllow</code>，當使用了
<code>--config</code> 時，預設值為 <code>Webhook</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 認證元件所返回的 “Authorized（已授權）” 應答的快取時間。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>30s</code>-->預設值：<code>30s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 認證元件所返回的 “Unauthorized（未授權）” 應答的快取時間。
<code>--config</code> 時，預設值為 <code>Webhook</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file container Azure container registry configuration information.
-->
包含 Azure 容器映象庫配置資訊的檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--bootstrap-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by <code>--kubeconfig</code> does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by <code>--kubeconfig</code>. The client certificate and key file will be stored in the directory pointed by <code>--cert-dir</code>.
-->
某 kubeconfig 檔案的路徑，該檔案將用於獲取 kubelet 的客戶端證書。
如果 <code>--kubeconfig</code> 所指定的檔案不存在，則使用引導所用 kubeconfig
從 API 伺服器請求客戶端證書。成功後，將引用生成的客戶端證書和金鑰的 kubeconfig
寫入 --kubeconfig 所指定的路徑。客戶端證書和金鑰檔案將儲存在 <code>--cert-dir</code>
所指的目錄。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/var/lib/kubelet/pki</code>-->預設值：<code>/var/lib/kubelet/pki</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are provided, this flag will be ignored.
-->
TLS 證書所在的目錄。如果設定了 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>，
則此標誌將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--cgroup-driver string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>cgroupfs</code>-->預設值：<code>cgroupfs</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Driver that the kubelet uses to manipulate cgroups on the host.  Possible values: <code>cgroupfs</code>, <code>systemd</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 用來操作本機 cgroup 時使用的驅動程式。支援的選項包括 <code>cgroupfs</code>
和 <code>systemd</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cgroup-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->預設值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
可選的選項，為 Pod 設定根 cgroup。容器執行時會盡可能使用此配置。
預設值 <code>""</code> 意味著將使用容器執行時的預設設定。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cgroups-per-qos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啟用建立 QoS cgroup 層次結構。此值為 true 時 kubelet 為 QoS 和 Pod 建立頂級的 cgroup。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
如果設定了此引數，則使用對應檔案中機構之一檢查請求中所攜帶的客戶端證書。
若客戶端證書透過身份認證，則其對應身份為其證書中所設定的 CommonName。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the cloud provider configuration file. Empty string for no configuration file. (DEPRECATED: will be removed in  1.24 or later, in favor of removing cloud providers code from Kubelet.)
-->
雲驅動配置檔案的路徑。空字串表示沒有配置檔案。
已棄用：將在 1.24 或更高版本中移除，以便於從 kubelet 中去除雲驅動程式碼。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The provider for cloud services. Set to empty string for running with no cloud provider. If set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used). (DEPRECATED: will be removed in 1.24 or later, in favor of removing cloud provider code from Kubelet.)
-->
雲服務的提供者。設定為空字串表示在沒有云驅動的情況下執行。
如果設定了此標誌，則雲驅動負責確定節點的名稱（參考雲提供商文件以確定是否以及如何使用主機名）。
已棄用：將在 1.24 或更高版本中移除，以便於從 kubelet 中去除雲驅動程式碼。
</td>
</tr>

<tr>
<td colspan="2">--cluster-dns strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of DNS server IP address. This value is used for containers DNS server in case of Pods with "dnsPolicy=ClusterFirst". Note: all DNS servers appearing in the list MUST serve the same set of records otherwise name resolution within the cluster may not work correctly. There is no guarantee as to which DNS server may be contacted for name resolution. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
DNS 伺服器的 IP 地址，以逗號分隔。此標誌值用於 Pod 中設定了 “<code>dnsPolicy=ClusterFirst</code>”
時為容器提供 DNS 服務。注意：列表中出現的所有 DNS 伺服器必須包含相同的記錄組，
否則叢集中的名稱解析可能無法正常工作。至於名稱解析過程中會牽涉到哪些 DNS 伺服器，
這一點無法保證。
<code>--config</code> 時，預設值為 <code>Webhook</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cluster-domain string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Domain for this cluster. If set, kubelet will configure all containers to search this domain in addition to the host's search domains (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
叢集的域名。如果設定了此值，kubelet 除了將主機的搜尋域配置到所有容器之外，還會為其
配置所搜這裡指定的域名。
<code>--config</code> 時，預設值為 <code>Webhook</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cni-bin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>/opt/cni/bin</code>-->預設值：<code>/opt/cni/bin</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of full paths of directories in which to search for CNI plugin binaries. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)
-->
此值為以逗號分隔的完整路徑列表。
kubelet 將在所指定路徑中搜索 CNI 外掛的可執行檔案。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--cni-cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>/var/lib/cni/cache</code>-->預設值：<code>/var/lib/cni/cache</code></td>
</tr>
<tr>                                            
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The full path of the directory in which CNI should store cache files. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)
-->
此值為一個目錄的全路徑名。CNI 將在其中快取檔案。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--cni-conf-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>/etc/cni/net.d</code>-->預設值：<code>/etc/cni/net.d</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; The full path of the directory in which to search for CNI config files. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)
-->
&lt;警告：alpha 特性&gt; 此值為某目錄的全路徑名。kubelet 將在其中搜索 CNI 配置檔案。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The Kubelet will load its initial configuration from this file. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Omit this flag to use the built-in default configuration values. Command-line flags override configuration from this file.
-->
kubelet 將從此標誌所指的檔案中載入其初始配置。此路徑可以是絕對路徑，也可以是相對路徑。
相對路徑按 kubelet 的當前工作目錄起計。省略此引數時 kubelet 會使用內建的預設配置值。
命令列引數會覆蓋此檔案中的配置。
</td>
</tr>

<tr>
<td colspan="2">--container-log-max-files int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Set the maximum number of container log files that can be present for a container. The number must be &ge; 2. This flag can only be used with <code>--container-runtime=remote</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定容器的日誌檔案個數上限。此值必須不小於 2。
此標誌只能與 <code>--container-runtime=remote</code> 標誌一起使用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>    

<tr>
<td colspan="2">--container-log-max-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>10Mi</code>-->預設值：<code>10Mi</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Set the maximum size (e.g. 10Mi) of container log file before it is rotated. This flag can only be used with <code>--container-runtime=remote</code>.  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定容器日誌檔案在輪換生成新檔案時之前的最大值（例如，<code>10Mi</code>）。
此標誌只能與 <code>--container-runtime=remote</code> 標誌一起使用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--container-runtime string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>docker</code>-->預設值：<code>docker</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The container runtime to use. Possible values: <code>docker</code>, <code>remote</code>.
-->
要使用的容器執行時。目前支援 <code>docker<code>、</code>remote</code>。
</td>
</tr>

<tr>
<td colspan="2">--container-runtime-endpoint string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>unix:///var/run/dockershim.sock</code>-->預設值：<code>unix:///var/run/dockershim.sock</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] The endpoint of remote runtime service. Currently unix socket endpoint is supported on Linux, while npipe and tcp endpoints are supported on windows. Examples: <code>unix:///var/run/dockershim.sock</code>, <code>npipe:////./pipe/dockershim</code>.
-->
[實驗性特性] 遠端執行時服務的端點。目前支援 Linux 系統上的 UNIX 套接字和
Windows 系統上的 npipe 和 TCP 端點。例如：
<code>unix:///var/run/dockershim.sock</code>、
<code>npipe:////./pipe/dockershim</code>。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable lock contention profiling, if profiling is enabled (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當啟用了效能分析時，啟用鎖競爭分析。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable CPU CFS quota enforcement for containers that specify CPU limits (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
為設定了 CPU 限制的容器啟用 CPU CFS 配額保障。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>100ms</code>-->預設值：<code>100ms</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets CPU CFS quota period value, <code>cpu.cfs_period_us</code>, defaults to Linux Kernel default. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定 CPU CFS 配額週期 <code>cpu.cfs_period_us</code>。預設使用 Linux 核心所設定的預設值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：<code>none</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CPU Manager policy to use. Possible values: 'none', 'static'. Default: 'none' (default "none") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
要使用的 CPU 管理器策略。可選值包括：<code>none</code> 和 <code>static</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-reconcile-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>10s</code>-->預設值：<code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; CPU Manager reconciliation period. Examples: <code>10s</code>, or <code>1m</code>. If not supplied, defaults to node status update frequency. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
&lt;警告：alpha 特性&gt; 設定 CPU 管理器的調和時間。例如：<code>10s</code> 或者 <code>1m</code>。
如果未設定，預設使用節點狀態更新頻率。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--docker-endpoint string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>unix:///var/run/docker.sock</code>-->預設值：<code>unix:///var/run/docker.sock</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use this for the <code>docker</code> endpoint to communicate with. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)
-->
使用這裡的端點與 docker 端點通訊。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--dynamic-config-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The Kubelet will use this directory for checkpointing downloaded configurations and tracking configuration health. The Kubelet will create this directory if it does not already exist. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Providing this flag enables dynamic Kubelet configuration. The <code>DynamicKubeletConfig</code> feature gate must be enabled to pass this flag. (DEPRECATED: Feature DynamicKubeletConfig is deprecated in 1.22 and will not move to GA. It is planned to be removed from Kubernetes in the version 1.24 or later. Please use alternative ways to update kubelet configuration.)
-->
kubelet 使用此目錄來儲存所下載的配置，跟蹤配置執行狀況。
如果目錄不存在，則 kubelet 建立該目錄。此路徑可以是絕對路徑，也可以是相對路徑。
相對路徑從 kubelet 的當前工作目錄計算。
設定此引數將啟用動態 kubelet 配置。必須啟用 <code>DynamicKubeletConfig</code>
特性門控之後才能設定此標誌。
(已棄用：DynamicKubeletConfig 功能在 1.22 中已棄用，不會移至 GA。 
計劃在 1.24 或更高版本中從 Kubernetes 中移除。 
請使用其他方式來更新 kubelet 配置。)

</td>
</tr>

<tr>
<td colspan="2">--enable-controller-attach-detach&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啟用 Attach/Detach 控制器來掛接和摘除排程到該節點的卷，同時禁用 kubelet 執行掛接和摘除操作。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--enable-debugging-handlers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables server endpoints for log collection and local running of containers and commands. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啟用伺服器上用於日誌收集和在本地執行容器和命令的端點。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--enable-server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>true</code>--></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable the Kubelet's server. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啟用 kubelet 伺服器。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--enforce-node-allocatable strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>pods</code>-->預設值：<code>pods</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptable options are <code>none</code>, <code>pods</code>, <code>system-reserved</code>, and <code>kube-reserved</code>. If the latter two options are specified, <code>--system-reserved-cgroup</code> and <code>--kube-reserved-cgroup</code> must also be set, respectively. If <code>none</code> is specified, no additional options should be set. See https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/ for more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的列表，包含由 kubelet 強制執行的節點可分配資源級別。
可選配置為：<code>none</code>、<code>pods</code>、<code>system-reserved</code> 和 <code>kube-reserved</code>。
在設定 <code>system-reserved</code> 和 <code>kube-reserved</code> 這兩個值時，同時要求設定
<code>--system-reserved-cgroup</code> 和 <code>--kube-reserved-cgroup</code> 這兩個引數。
如果設定為 <code>none</code>，則不需要設定其他引數。
<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/">參考相關文件</a>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--event-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: 10-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding <code>--event-qps</code>. Only used if <code>--event-qps</code> &gt; 0. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
事件記錄的個數的突發峰值上限，在遵從 <code>--event-qps</code> 閾值約束的前提下
臨時允許事件記錄達到此數目。僅在 <code>--event-qps</code> 大於 0 時使用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--event-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If &gt; <code>0</code>, limit event creations per second to this value. If <code>0</code>, unlimited. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定大於 0 的值表示限制每秒可生成的事件數量。設定為 0 表示不限制。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-hard string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>imagefs.available<15%,memory.available<100Mi,nodefs.available<10%</code>-->預設值：<code>imagefs.available&lt;15%,memory.available&lt;100Mi,nodefs.available&lt;10%</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. <code>memory.available<1Gi</code>) that if met would trigger a pod eviction. On a Linux node, the default value also includes <code>nodefs.inodesFree<5%</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
觸發 Pod 驅逐操作的一組硬性門限（例如：<code>memory.available&lt;1Gi</code>
（記憶體可用值小於 1G）設定。在 Linux 節點上，預設值還包括
<code>nodefs.inodesFree<5%</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-max-pod-grace-period int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. If negative, defer to pod specified value. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
響應滿足軟性驅逐閾值（Soft Eviction Threshold）而終止 Pod 時使用的最長寬限期（以秒為單位）。
如果設定為負數，則遵循 Pod 的指定值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-minimum-reclaim mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of minimum reclaims (e.g. <code>imagefs.available=2Gi</code>) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當某資源壓力過大時，kubelet 將執行 Pod 驅逐操作。
此引數設定軟性驅逐操作需要回收的資源的最小數量（例如：<code>imagefs.available=2Gi</code>）。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-pressure-transition-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>5m0s</code>-->預設值：<code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 在驅逐壓力狀況解除之前的最長等待時間。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. <code>memory.available>1.5Gi</code>) that if met over a corresponding grace period would trigger a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定一組驅逐閾值（例如：<code>memory.available&lt;1.5Gi</code>）。
如果在相應的寬限期內達到該閾值，則會觸發 Pod 驅逐操作。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft-grace-period mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction grace periods (e.g. <code>memory.available=1m30s</code>) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定一組驅逐寬限期（例如，<code>memory.available=1m30s</code>），對應於觸發軟性 Pod
驅逐操作之前軟性驅逐閾值所需持續的時間長短。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--exit-on-lock-contention</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether kubelet should exit upon lock-file contention.
-->
設定為 true 表示當發生鎖檔案競爭時 kubelet 可以退出。
</td>
</tr>

<tr>
<td colspan="2">--experimental-allocatable-ignore-eviction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>false</code>-->預設值：<code>false</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to <code>true</code>, Hard eviction thresholds will be ignored while calculating node allocatable. See https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/ for more details. (DEPRECATED: will be removed in 1.24 or later)
-->
設定為 <code>true</code> 表示在計算節點可分配資源數量時忽略硬性逐出閾值設定。
參考<a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">
相關文件</a>。
已啟用：將在 1.24 或更高版本中移除。
</td>
</tr>

<tr>
<td colspan="2">--experimental-check-node-capabilities-before-mount</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] if set to <code>true</code>, the kubelet will check the underlying node for required components (binaries, etc.) before performing the mount (DEPRECATED: will be removed in 1.24 or later, in favor of using CSI.)
-->
[實驗性特性] 設定為 <code>true</code> 表示 kubelet 在進行掛載卷操作之前要
在本節點上檢查所需的元件（如可執行檔案等）是否存在。
已棄用：將在 1.24 或更高版本中移除，以便使用 CSI。
</td>
</tr>

<tr>
<td colspan="2">--experimental-kernel-memcg-notification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling. This flag will be removed in 1.24 or later. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定為 true 表示 kubelet 將會整合核心的 memcg 通知機制而不是使用輪詢機制來
判斷是否達到了記憶體驅逐閾值。
此標誌將在 1.24 或更高版本移除。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--experimental-log-sanitization</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] When enabled prevents logging of fields tagged as sensitive (passwords, keys, tokens). Runtime log sanitization may introduce significant computation overhead and therefore should not be enabled in production. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
[試驗性功能] 啟用此標誌之後，kubelet 會避免將標記為敏感的欄位（密碼、金鑰、令牌等）
寫入日誌中。執行時的日誌清理可能會帶來相當的計算開銷，因此不應該在
產品環境中啟用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</tr>

<tr>
<td colspan="2">--experimental-mounter-path string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>mount</code>-->預設值：<code>mount</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] Path of mounter binary. Leave empty to use the default <code>mount</code>. (DEPRECATED: will be removed in 1.24 or later, in favor of using CSI.)
-->
[實驗性特性] 卷掛載器（mounter）的可執行檔案的路徑。設定為空表示使用預設掛載器 <code>mount</code>。
已棄用：將在 1.24 或更高版本移除以支援 CSI。
</td>
</tr>

<tr>
<td colspan="2">--fail-swap-on&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Makes the Kubelet fail to start if swap is enabled on the node. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定為 true 表示如果主機啟用了交換分割槽，kubelet 將直接失敗。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>key=value</code> pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AllowInsecureBackendProxy=true|false (BETA - default=true)<br/>
AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>
AppArmor=true|false (BETA - default=true)<br/>
BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>
BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>
CPUManager=true|false (BETA - default=true)<br/>
CSIInlineVolume=true|false (BETA - default=true)<br/>
CSIMigration=true|false (BETA - default=true)<br/>
CSIMigrationAWS=true|false (BETA - default=false)<br/>
CSIMigrationAWSComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>
CSIMigrationAzureDiskComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>
CSIMigrationAzureFileComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationGCE=true|false (BETA - default=false)<br/>
CSIMigrationGCEComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationOpenStack=true|false (BETA - default=false)<br/>
CSIMigrationOpenStackComplete=true|false (ALPHA - default=false)<br/>
CSIMigrationvSphere=true|false (BETA - default=false)<br/>
CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>
CSIServiceAccountToken=true|false (ALPHA - default=false)<br/>
CSIStorageCapacity=true|false (ALPHA - default=false)<br/>
CSIVolumeFSGroupPolicy=true|false (BETA - default=true)<br/>
ConfigurableFSGroupPolicy=true|false (BETA - default=true)<br/>
CronJobControllerV2=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
DefaultPodTopologySpread=true|false (BETA - default=true)<br/>
DevicePlugins=true|false (BETA - default=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>
DownwardAPIHugePages=true|false (ALPHA - default=false)<br/>
DynamicKubeletConfig=true|false (BETA - default=true)<br/>
EfficientWatchResumption=true|false (ALPHA - default=false)<br/>
EndpointSlice=true|false (BETA - default=true)<br/>
EndpointSliceNodeName=true|false (ALPHA - default=false)<br/>
EndpointSliceProxying=true|false (BETA - default=true)<br/>
EndpointSliceTerminatingCondition=true|false (ALPHA - default=false)<br/>
EphemeralContainers=true|false (ALPHA - default=false)<br/>
ExpandCSIVolumes=true|false (BETA - default=true)<br/>
ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>
ExpandPersistentVolumes=true|false (BETA - default=true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GenericEphemeralVolume=true|false (ALPHA - default=false)<br/>
GracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
HPAContainerMetrics=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HugePageStorageMediumSize=true|false (BETA - default=true)<br/>
IPv6DualStack=true|false (ALPHA - default=false)<br/>
ImmutableEphemeralVolumes=true|false (BETA - default=true)<br/>
KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
LegacyNodeRoleBehavior=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
MixedProtocolLBService=true|false (ALPHA - default=false)<br/>
NodeDisruptionExclusion=true|false (BETA - default=true)<br/>
NonPreemptingPriority=true|false (BETA - default=true)<br/>
PodDisruptionBudget=true|false (BETA - default=true)<br/>
PodOverhead=true|false (BETA - default=true)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RemoveSelfLink=true|false (BETA - default=true)<br/>
RootCAConfigMap=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
RunAsGroup=true|false (BETA - default=true)<br/>
ServerSideApply=true|false (BETA - default=true)<br/>
SeccompDefault=true|false (ALPHA - default=false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - default=true)<br/>
ServiceLBNodePortControl=true|false (BETA - default=true)<br/>
ServiceLoadBalancerClass=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
TopologyManager=true|false (BETA - default=true)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostProcessContainers=true|false (BETA - default=true)<br/>
csiMigrationRBD=true|false (ALPHA - default=false)<br/>
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
-->
用於 alpha 實驗性特性的特性開關組，每個開關以 key=value 形式表示。當前可用開關包括：</br>
APIListChunking=true|false (BETA - 預設值為 true)<br/>
APIPriorityAndFairness=true|false (BETA - 預設值為 true)<br/>
APIResponseCompression=true|false (BETA - 預設值為 true)<br/>
APIServerIdentity=true|false (ALPHA - 預設值為 false)<br/>
AllAlpha=true|false (ALPHA - 預設值為 false)<br/>
AllBeta=true|false (BETA - 預設值為 false)<br/>
AllowInsecureBackendProxy=true|false (BETA - 預設值為 true)<br/>
AnyVolumeDataSource=true|false (ALPHA - 預設值為 false)<br/>
AppArmor=true|false (BETA - 預設值為 true)<br/>
BalanceAttachedNodeVolumes=true|false (ALPHA - 預設值為 false)<br/>
BoundServiceAccountTokenVolume=true|false (ALPHA - 預設值為 false)<br/>
CPUManager=true|false (BETA - 預設值為 true)<br/>
CSIInlineVolume=true|false (BETA - 預設值為 true)<br/>
CSIMigration=true|false (BETA - 預設值為 true)<br/>
CSIMigrationAWS=true|false (BETA - 預設值為 false)<br/>
CSIMigrationAWSComplete=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationAzureDisk=true|false (BETA - 預設值為 false)<br/>
CSIMigrationAzureDiskComplete=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationAzureFile=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationAzureFileComplete=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationGCE=true|false (BETA - 預設值為 false)<br/>
CSIMigrationGCEComplete=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationOpenStack=true|false (BETA - 預設值為 false)<br/>
CSIMigrationOpenStackComplete=true|false (ALPHA - 預設值為 false)<br/>
CSIMigrationvSphere=true|false (BETA - 預設值為 false)<br/>
CSIMigrationvSphereComplete=true|false (BETA - 預設值為 false)<br/>
CSIServiceAccountToken=true|false (ALPHA - 預設值為 false)<br/>
CSIStorageCapacity=true|false (ALPHA - 預設值為 false)<br/>
CSIVolumeFSGroupPolicy=true|false (BETA - 預設值為 true)<br/>
ConfigurableFSGroupPolicy=true|false (BETA - 預設值為 true)<br/>
CronJobControllerV2=true|false (ALPHA - 預設值為 false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值為 false)<br/>
DefaultPodTopologySpread=true|false (BETA - 預設值為 true)<br/>
DevicePlugins=true|false (BETA - 預設值為 true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - 預設值為 true)<br/>
DownwardAPIHugePages=true|false (ALPHA - 預設值為 false)<br/>
DynamicKubeletConfig=true|false (BETA - 預設值為 true)<br/>
EfficientWatchResumption=true|false (ALPHA - 預設值為 false)<br/>
EndpointSlice=true|false (BETA - 預設值為 true)<br/>
EndpointSliceNodeName=true|false (ALPHA - 預設值為 false)<br/>
EndpointSliceProxying=true|false (BETA - 預設值為 true)<br/>
EndpointSliceTerminatingCondition=true|false (ALPHA - 預設值為 false)<br/>
EphemeralContainers=true|false (ALPHA - 預設值為 false)<br/>
ExpandCSIVolumes=true|false (BETA - 預設值為 true)<br/>
ExpandInUsePersistentVolumes=true|false (BETA - 預設值為 true)<br/>
ExpandPersistentVolumes=true|false (BETA - 預設值為 true)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 預設值為 false)<br/>
GenericEphemeralVolume=true|false (ALPHA - 預設值為 false)<br/>
GracefulNodeShutdown=true|false (ALPHA - 預設值為 false)<br/>
HPAContainerMetrics=true|false (ALPHA - 預設值為 false)<br/>
HPAScaleToZero=true|false (ALPHA - 預設值為 false)<br/>
HugePageStorageMediumSize=true|false (BETA - 預設值為 true)<br/>
IPv6DualStack=true|false (ALPHA - 預設值為 false)<br/>
ImmutableEphemeralVolumes=true|false (BETA - 預設值為 true)<br/>
KubeletCredentialProviders=true|false (ALPHA - 預設值為 false)<br/>
KubeletPodResources=true|false (BETA - 預設值為 true)<br/>
LegacyNodeRoleBehavior=true|false (BETA - 預設值為 true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 預設值為 true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 預設值為 false)<br/>
MixedProtocolLBService=true|false (ALPHA - 預設值為 false)<br/>
NodeDisruptionExclusion=true|false (BETA - 預設值為 true)<br/>
NonPreemptingPriority=true|false (BETA - 預設值為 true)<br/>
PodDisruptionBudget=true|false (BETA - 預設值為 true)<br/>
PodOverhead=true|false (BETA - 預設值為 true)<br/>
ProcMountType=true|false (ALPHA - 預設值為 false)<br/>
QOSReserved=true|false (ALPHA - 預設值為 false)<br/>
RemainingItemCount=true|false (BETA - 預設值為 true)<br/>
RemoveSelfLink=true|false (BETA - 預設值為 true)<br/>
RootCAConfigMap=true|false (BETA - 預設值為 true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 預設值為 true)<br/>
RunAsGroup=true|false (BETA - 預設值為 true)<br/>
SeccompDefault=true|false (ALPHA - 預設值為 false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - 預設值為 true)<br/>
ServiceLBNodePortControl=true|false (BETA - 預設值為 true)<br/>
ServiceLoadBalancerClass=true|false (BETA - 預設值為 true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 預設值為 true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - 預設值為 false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - 預設值為 true)<br/>
StorageVersionAPI=true|false (ALPHA - 預設值為 false)<br/>
StorageVersionHash=true|false (BETA - 預設值為 true)<br/>
SuspendJob=true|false (BETA - 預設值為 true)<br/>
TopologyAwareHints=true|false (BETA - 預設值為 true)<br/>
TopologyManager=true|false (BETA - 預設值為 true)<br/>
VolumeCapacityPriority=true|false (ALPHA - 預設值為 false)<br/>
WinDSR=true|false (ALPHA - 預設值為 false)<br/>
WinOverlay=true|false (BETA - 預設值為 true)<br/>
WindowsHostProcessContainers=true|false (BETA - 預設值為 true)<br/>
csiMigrationRBD=true|false (ALPHA - 預設值為 false)<br/>
已棄用: 應在 <code>--config</code> 所給的配置檔案中進行設定。
（<a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file">進一步瞭解</a>）
</td>
</tr>

<tr>
<td colspan="2">--file-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>20s</code>-->預設值：<code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking config files for new data. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
檢查配置檔案中新資料的時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--hairpin-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>promiscuous-bridge</code>-->預設值：<code>promiscuous-bridge</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
How should the kubelet setup hairpin NAT. This allows endpoints of a Service to load balance back to themselves if they should try to access their own Service. Valid values are <code>promiscuous-bridge</code>, <code>hairpin-veth</code> and <code>none</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定 kubelet 執行髮夾模式（hairpin）網路地址轉譯的方式。
該模式允許後端端點對其自身服務的訪問能夠再次經由負載均衡轉發回自身。
可選項包括 <code>promiscuous-bridge</code>、<code>hairpin-veth</code> 和 <code>none</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>127.0.0.1</code>-->預設值：<code>127.0.0.1</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the healthz server to serve on (set to <code>0.0.0.0</code> for all IPv4 interfaces and <code>::</code> for all IPv6 interfaces). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於執行 healthz 伺服器的 IP 地址（設定為 <code>0.0.0.0</code> 表示使用所有 IPv4 介面，
設定為 <code>::</code> 表示使用所有 IPv6 介面。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10248-->預設值：10248</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port of the localhost healthz endpoint (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
本地 healthz 端點使用的埠（設定為 0 表示禁用）。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet
-->
kubelet 操作的幫助命令
</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, will use this string as identification instead of the actual hostname. If <code>--cloud-provider</code> is set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).
-->
如果為非空，將使用此字串而不是實際的主機名作為節點標識。如果設定了
<code>--cloud-provider</code>，則雲驅動將確定節點的名稱
（請查閱雲服務商文件以確定是否以及如何使用主機名）。
</td>
</tr>

<tr>
<td colspan="2">--http-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>20s</code>-->預設值：<code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking HTTP for new data. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
HTTP 服務以獲取新資料的時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-bin-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the directory where credential provider plugin binaries are located.
-->
指向憑據提供元件可執行檔案所在目錄的路徑。
</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the credential provider plugin config file.</td>
-->
指向憑據提供外掛配置檔案所在目錄的路徑。
</tr>

<tr>
<td colspan="2">--image-gc-high-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 85-->預設值：85</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage after which image garbage collection is always run. Values must be within the range [0, 100], To disable image garbage collection, set to 100.   (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
映象垃圾回收上限。磁碟使用空間達到該百分比時，映象垃圾回收將持續工作。
值必須在 [0，100] 範圍內。要禁用映象垃圾回收，請設定為 100。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--image-gc-low-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 80-->預設值：80</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. Values must be within the range [0, 100] and should not be larger than that of <code>--image-gc-high-threshold</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
映象垃圾回收下限。磁碟使用空間在達到該百分比之前，映象垃圾回收操作不會執行。
值必須在 [0，100] 範圍內，並且不得大於 <code>--image-gc-high-threshold</code>的值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--image-pull-progress-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>1m0s</code>-->預設值：<code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If no pulling progress is made before this deadline, the image pulling will be cancelled. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)
-->
如果在該引數值所設定的期限之前沒有拉取映象的進展，映象拉取操作將被取消。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--image-service-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] The endpoint of remote image service. If not specified, it will be the same with <code>--container-runtime-endpoint</code> by default. Currently UNIX socket endpoint is supported on Linux, while npipe and TCP endpoints are supported on Windows.  Examples: <code>unix:///var/run/dockershim.sock</code>, <code>npipe:////./pipe/dockershim</code>
-->
[實驗性特性] 遠端映象服務的端點。若未設定則預設情況下使用 <code>--container-runtime-endpoint</code>
的值。目前支援的型別包括在 Linux 系統上的 UNIX 套接字端點和 Windows 系統上的 npipe 和 TCP 端點。
例如：<code>unix:///var/run/dockershim.sock</code>、<code>npipe:////./pipe/dockershim</code>。
</td>
</tr>

<tr>
<td colspan="2">--iptables-drop-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 15-->預設值：15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The bit of the <code>fwmark</code> space to mark packets for dropping. Must be within the range [0, 31]. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
標記資料包將被丟棄的 fwmark 位設定。必須在 [0，31] 範圍內。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 14-->預設值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The bit of the <code>fwmark</code> space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in <code>kube-proxy</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
標記資料包將進行 SNAT 的 fwmark 空間位設定。必須在 [0，31] 範圍內。
請將此引數與 <code>kube-proxy</code> 中的相應引數匹配。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--keep-terminated-pod-volumes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Keep terminated pod volumes mounted to the node after the pod terminates. Can be useful for debugging volume related issues. (DEPRECATED: will be removed in a future version)
-->
設定為 true 表示 Pod 終止後仍然保留之前掛載過的卷，常用於除錯與卷有關的問題。
已棄用：將未來版本中移除。
</td>
</tr>

<tr>
<td colspan="2">--kernel-memcg-notification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
若啟用，則 kubelet 將與核心中的 memcg 通知機制整合，不再使用輪詢的方式來判定
是否 Pod 達到記憶體驅逐閾值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Burst to use while talking with kubernetes apiserver. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
每秒傳送到 apiserver 的突發請求數量上限。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>application/vnd.kubernetes.protobuf</code>-->預設值：<code>application/vnd.kubernetes.protobuf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
傳送到 apiserver 的請求的內容型別。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to use while talking with kubernetes API server. The number must be &gt;= 0. If 0 will use default QPS (5). Doesn't cover events and node heartbeat apis which rate limiting is controlled by a different set of flags. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
與 apiserver 通訊的每秒查詢個數（QPS）。
此值必須 &gt;= 0。如果為 0，則使用預設 QPS（5）。
不包含事件和節點心跳 api，它們的速率限制是由一組不同的標誌所控制。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved mapStringString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: &lt;None&gt;-->預設值：&lt;None&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for kubernetes system components. Currently <code>cpu</code>, <code>memory</code> and local <code>ephemeral-storage</code> for root file system are supported. See <a href="http://kubernetes.io/docs/user-guide/compute-resources">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubernetes 系統預留的資源配置，以一組 <code>&lt;資源名稱&gt;=&lt;資源數量&gt;</code> 格式表示。
（例如：<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>）。
當前支援 <code>cpu</code>、<code>memory</code> 和用於根檔案系統的 <code>ephemeral-storage</code>。
請參閱<a href="http://kubernetes.io/zh-cn/docs/user-guide/compute-resources">這裡</a>獲取更多資訊。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->預設值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via <code>--kube-reserved</code> flag. Ex. <code>/kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
給出某個頂層 cgroup 絕對名稱，該 cgroup 用於管理透過標誌 <code>--kube-reserved</code>
為 kubernetes 元件所預留的計算資源。例如：<code>"/kube-reserved"</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file, specifying how to connect to the API server. Providing <code>--kubeconfig</code> enables API server mode, omitting <code>--kubeconfig</code> enables standalone mode. 
-->
kubeconfig 配置檔案的路徑，指定如何連線到 API 伺服器。
提供 <code>--kubeconfig</code> 將啟用 API 伺服器模式，而省略 <code>--kubeconfig</code> 將啟用獨立模式。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the Kubelet in. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於建立和執行 kubelet 的 cgroup 的絕對名稱。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--lock-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The path to file for kubelet to use as a lock file.
-->
&lt;警告：alpha 特性&gt; kubelet 使用的鎖檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>:0</code>-->預設值：<code>:0</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When logging hits line <code><file>:<N></code>, emit a stack trace. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
形式為 <code>&lt;file&gt;:&lt;N&gt;</code>。
當日志邏輯執行到命中 &lt;file&gt; 的第 &lt;N&gt; 行時，轉儲呼叫堆疊。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, write log files in this directory. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
如果此值為非空，則在所指定的目錄中寫入日誌檔案。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>  
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, use this log file. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
如果此值非空，使用所給字串作為日誌檔名。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1800-->預設值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定日誌檔案的最大值。單位為兆位元組（M）。如果值為 0，則表示檔案大小無限制。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>5s</code>-->預設值：<code>5s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌重新整理之間的最大秒數（預設值為 5s）。
</td>
</tr>

<tr>
<td colspan="2">--log-json-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>'0'</code>-->預設值：<code>'0'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] In JSON format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
[實驗性特性]在具有拆分輸出流的 JSON 格式中，可以將資訊訊息緩衝一段時間以提高效能。
零位元組的預設值禁用緩衝。大小可以指定為位元組數（512）、1000 的倍數（1K）、1024 的倍數（2Ki） 或這些（3M、4G、5Mi、6Gi）的冪。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--log-json-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] In JSON format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
[實驗性特性]以 JSON 格式，將錯誤訊息寫入 stderr，將 info 訊息寫入 stdout。
預設是將單個流寫入標準輸出。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>text</code>-->預設值：<code>"text"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: <code>text</code>, <code>json</code>.<br/>Non-default formats don't honor these flags: <code>--add-dir-header</code>, <code>--alsologtostderr</code>, <code>--log-backtrace-at</code>, <code>--log-dir</code>, <code>--log-file</code>, <code>--log-file-max-size</code>, <code>--logtostderr</code>, <code>--skip_headers</code>, <code>--skip_log_headers</code>, <code>--stderrthreshold</code>, <code>--log-flush-frequency</code>.<br/>Non-default choices are currently alpha and subject to change without warning. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定日誌檔案格式。可以設定的格式有：<code>"text"</code>、<code>"json"</code>。
非預設的格式不會使用以下標誌的配置：<code>--add-dir-header</code>、<code>--alsologtostderr</code>、
<code>--log-backtrace-at</code>、<code>--log-dir</code>、<code>--log-file</code>,
<code>--log-file-max-size</code>、<code>--logtostderr</code>、<code>--skip-headers</code>、
<code>--skip-log-headers</code>、<code>--stderrthreshold</code>、<code>--log-flush-frequency</code>。
非預設選項的其它值都應視為 Alpha 特性，將來出現更改時不會額外警告。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error instead of files. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
日誌輸出到 stderr 而不是檔案。
（已棄用：將會在未來的版本刪除，
<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--make-iptables-util-chains&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, kubelet will ensure <code>iptables</code> utility rules are present on host. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定為 true 表示 kubelet 將確保 <code>iptables</code> 規則在主機上存在。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
URL for accessing additional Pod specifications to run (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於訪問要執行的其他 Pod 規範的 URL。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url-header string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of HTTP headers to use when accessing the URL provided to <code>--manifest-url</code>. Multiple headers with the same name will be added in the same order provided. This flag can be repeatedly invoked. For example: <code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code> (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
取值為由 HTTP 頭部組成的逗號分隔列表，在訪問 <code>--manifest-url</code> 所給出的 URL 時使用。
名稱相同的多個頭部將按所列的順序新增。該引數可以多次使用。例如：
<code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>default</code>-->預設值：<code>default</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace from which the kubernetes master services should be injected into pods. (DEPRECATED: This flag will be removed in a future version.)
-->
kubelet 向 Pod 注入 Kubernetes 主控服務資訊時使用的名稱空間。
已棄用：此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--max-open-files int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1000000-->預設值：1000000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of files that can be opened by Kubelet process. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 程序可以開啟的最大檔案數量。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--max-pods int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 110-->預設值：110</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods that can run on this Kubelet. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此 kubelet 能執行的 Pod 最大數量。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -1-->預設值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances of containers to retain globally. Each container takes up some disk space. To disable, set to a negative number. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
設定全域性可保留的已停止容器例項個數上限。
每個例項會佔用一些磁碟空間。要禁用，請設定為負數。
已棄用：改用 <code>--eviction-hard</code> 或 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers-per-container int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1-->預設值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances to retain per container.  Each container takes up some disk space. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
每個已停止容器可以保留的的最大例項數量。每個容器佔用一些磁碟空間。
已棄用：改用 <code>--eviction-hard</code> 或 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--memory-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>None</code>-->預設值：<code>None</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Memory Manager policy to use. Possible values: <code>'None'</code>, <code>'Static'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
記憶體管理器策略使用。可選值：<code>'None'</code>、<code>'Static'</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--minimum-container-ttl-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for a finished container before it is garbage collected. Examples: <code>'300ms'</code>, <code>'10s'</code> or <code>'2h45m'</code> (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
已結束的容器在被垃圾回收清理之前的最少存活時間。
例如：<code>'300ms'</code>、<code>'10s'</code> 或者 <code>'2h45m'</code>。
已棄用：請改用 <code>--eviction-hard</code> 或者 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--minimum-image-ttl-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>2m0s</code>-->預設值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for an unused image before it is garbage collected. Examples: <code>'300ms'</code>, <code>'10s'</code> or <code>'2h45m'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
已結束的容器在被垃圾回收清理之前的最少存活時間。
例如：<code>'300ms'</code>、<code>'10s'</code> 或者 <code>'2h45m'</code>。
已棄用：這個引數應該透過 Kubelet 的 <code>--config</code> 標誌指定的配置檔案來設定。
（<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">進一步瞭解</a>）
</td>
</tr>

<tr>
<td colspan="2">--network-plugin string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of the network plugin to be invoked for various events in kubelet/pod lifecycle. This docker-specific flag only works when container-runtime is set to <code>docker</code>. (DEPRECATED: will be removed along with dockershim.)<
-->
設定 kubelet/Pod 生命週期中各種事件呼叫的網路外掛的名稱。
僅當容器執行環境設定為 <code>docker</code> 時，此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--network-plugin-mtu int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The MTU to be passed to the network plugin, to override the default. Set to 0 to use the default 1460 MTU. This docker-specific flag only works when container-runtime is set to docker. (DEPRECATED: will be removed along with dockershim.)
-->
&lt;警告：alpha 特性&gt; 傳遞給網路外掛的 MTU 值，將覆蓋預設值。
設定為 0 則使用預設的 MTU 1460。僅當容器執行環境設定為 <code>docker</code> 時，
此特定於 docker 的引數才有效。
（已棄用：將會隨著 dockershim 一起刪除。）
</td>
</tr>

<tr>
<td colspan="2">--node-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
IP address (or comma-separated dual-stack IP addresses) of the node. If unset, kubelet will use the node's default IPv4 address, if any, or its default IPv6 address if it has no IPv4 addresses. You can pass <code>'::'</code> to make it prefer the default IPv6 address rather than the default IPv4 address.
-->
節點的 IP 地址（或逗號分隔的雙棧 IP 地址）。
如果未設定，kubelet 將使用節點的預設 IPv4 地址（如果有）或預設 IPv6 地址（如果它沒有 IPv4 地址）。
你可以傳值 <code>'::'</code> 使其偏向於預設的 IPv6 地址而不是預設的 IPv4 地址。
</td>
</tr>

<tr>
<td colspan="2">--node-labels mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt;Labels to add when registering the node in the cluster. Labels must be <code>key=value pairs</code> separated by <code>','</code>. Labels in the <code>'kubernetes.io'</code> namespace must begin with an allowed prefix (<code>'kubelet.kubernetes.io'</code>, <code>'node.kubernetes.io'</code>) or be in the specifically allowed set (<code>'beta.kubernetes.io/arch'</code>, <code>'beta.kubernetes.io/instance-type'</code>, <code>'beta.kubernetes.io/os'</code>, <code>'failure-domain.beta.kubernetes.io/region'</code>, <code>'failure-domain.beta.kubernetes.io/zone'</code>, <code>'kubernetes.io/arch'</code>, <code>'kubernetes.io/hostname'</code>, <code>'kubernetes.io/os'</code>, <code>'node.kubernetes.io/instance-type'</code>, <code>'topology.kubernetes.io/region'</code>, <code>'topology.kubernetes.io/zone'</code>))
-->
&lt;警告：alpha 特性&gt; kubelet 在叢集中註冊本節點時設定的標籤。標籤以
<code>key=value</code> 的格式表示，多個標籤以逗號分隔。名字空間 <code>kubernetes.io</code>
中的標籤必須以 <code>kubelet.kubernetes.io</code> 或 <code>node.kubernetes.io</code> 為字首，
或者在以下明確允許範圍內：
<code>beta.kubernetes.io/arch</code>, <code>beta.kubernetes.io/instance-type</code>,
<code>beta.kubernetes.io/os</code>, <code>failure-domain.beta.kubernetes.io/region</code>,
<code>failure-domain.beta.kubernetes.io/zone</code>, <code>kubernetes.io/arch</code>,
<code>kubernetes.io/hostname</code>, <code>kubernetes.io/os</code>,
<code>node.kubernetes.io/instance-type</code>, <code>topology.kubernetes.io/region</code>,
<code>topology.kubernetes.io/zone</code>。
</td>
</tr>

<tr>
<td colspan="2">--node-status-max-images int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 50-->預設值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of images to report in <code>node.status.images</code>. If <code>-1</code> is specified, no cap will be applied. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
在 <code>node.status.images</code> 中可以報告的最大映象數量。如果指定為 -1，則不設上限。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>10s</code>-->預設值：<code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with <code>nodeMonitorGracePeriod</code> in Node controller. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
指定 kubelet 向主控節點彙報節點狀態的時間間隔。注意：更改此常量時請務必謹慎，
它必須與節點控制器中的 <code>nodeMonitorGracePeriod</code> 一起使用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--non-masquerade-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>10.0.0.0/8</code>-->預設值：<code>10.0.0.0/8</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Traffic to IPs outside this range will use IP masquerade. Set to '0.0.0.0/0' to never masquerade. (default "10.0.0.0/8") (DEPRECATED: will be removed in a future version)
-->
kubelet 向該 IP 段之外的 IP 地址傳送的流量將使用 IP 偽裝技術。
設定為 <code>0.0.0.0/0</code> 則不使用偽裝。
（已棄用：將在未來的版本中刪除。）
</td>
</tr>

<tr>
<td colspan="2">--one-output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, only write logs to their native severity level (vs also writing to each lower severity level). (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
如果設定此標誌為 <code>true</code>，則僅將日誌寫入其原來的嚴重性級別中，
而不是同時將其寫入更低嚴重性級別中。
已棄用：將在未來的版本中刪除。
（<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -999-->預設值：-999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The <code>oom-score-adj</code> value for kubelet process. Values must be within the range [-1000, 1000]. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 程序的 oom-score-adj 引數值。有效範圍為 <code>[-1000，1000]</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--pod-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The CIDR to use for pod IP addresses, only used in standalone mode. In cluster mode, this is obtained from the master. For IPv6, the maximum number of IP's allocated is 65536 (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於給 Pod 分配 IP 地址的 CIDR 地址池，僅在獨立執行模式下使用。
在叢集模式下，CIDR 設定是從主伺服器獲取的。對於 IPv6，分配的 IP 的最大數量為 65536。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--pod-infra-container-image string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>k8s.gcr.io/pause:3.2</code>-->預設值：<code>k8s.gcr.io/pause:3.2</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
 Specified image will not be pruned by the image garbage collector. When container-runtime is set to <code>docker</code>, all containers in each pod will use the network/ipc namespaces from this image. Other CRI implementations have their own configuration to set this image.
-->
所指定的映象不會被映象垃圾收集器刪除。
當容器執行環境設定為 <code>docker</code> 時，各個 Pod 中的所有容器都會
使用此映象中的網路和 IPC 名字空間。
其他 CRI 實現有自己的配置來設定此映象。
</td>
</tr>

<tr>
<td colspan="2">--pod-manifest-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the directory containing static pod files to run, or the path to a single static pod file. Files starting with dots will be ignored. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定包含要執行的靜態 Pod 的檔案的路徑，或單個靜態 Pod 檔案的路徑。以點（<code>.</code>）
開頭的檔案將被忽略。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--pod-max-pids int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -1-->預設值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Set the maximum number of processes per pod. If <code>-1</code>, the kubelet defaults to the node allocatable PID capacity. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定每個 Pod 中的最大程序數目。如果為 -1，則 kubelet 使用節點可分配的 PID 容量作為預設值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--pods-per-core int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods per core that can run on this kubelet. The total number of pods on this kubelet cannot exceed <code>--max-pods</code>, so <code>--max-pods</code> will be used if this calculation results in a larger number of pods allowed on the kubelet. A value of <code>0</code> disables this limit. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 在每個處理器核上可執行的 Pod 數量。此 kubelet 上的 Pod 總數不能超過
<code>--max-pods</code> 標誌值。因此，如果此計算結果導致在 kubelet 
上允許更多數量的 Pod，則使用 <code>--max-pods</code> 值。值為 0 表示不作限制。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10250-->預設值：10250</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port for the kubelet to serve on. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 服務監聽的本機埠號。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--protect-kernel-defaults</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定 kubelet 的預設核心調整行為。如果已設定該引數，當任何核心可調引數與
kubelet 預設值不同時，kubelet 都會出錯。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--provider-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Unique identifier for identifying the node in a machine database, i.e cloud provider. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定主機資料庫（即，雲驅動）中用來標識節點的唯一標識。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--qos-reserved mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; A set of <code>&lt;resource name&gt;=&lt;percentage&gt;</code> (e.g. <code>memory=50%</code>) pairs that describe how pod resource requests are reserved at the QoS level. Currently only <code>memory</code> is supported. Requires the <code>QOSReserved</code> feature gate to be enabled. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
&lt;警告：alpha 特性&gt; 設定在指定的 QoS 級別預留的 Pod 資源請求，以一組
<code>"資源名稱=百分比"</code> 的形式進行設定，例如 <code>memory=50%</code>。
當前僅支援記憶體（memory）。要求啟用 <code>QOSReserved</code> 特性門控。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--read-only-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10255-->預設值：10255</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The read-only port for the kubelet to serve on with no authentication/authorization (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 可以在沒有身份驗證/鑑權的情況下提供只讀服務的埠（設定為 0 表示禁用）。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--really-crash-for-testing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, when panics occur crash. Intended for testing. (DEPRECATED: will be removed in a future version.)
-->
設定為 true 表示發生失效時立即崩潰。僅用於測試。
已棄用：將在未來版本中移除。
</td>
</tr>

<tr>
<td colspan="2">--register-node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the API server. If <code>--kubeconfig</code> is not provided, this flag is irrelevant, as the Kubelet won't have an API server to register with. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
向 API 伺服器註冊節點，如果未提供 <code>--kubeconfig</code>，此標誌無關緊要，
因為 Kubelet 沒有 API 伺服器可註冊。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--register-schedulable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node as schedulable. Won't have any effect if <code>--register-node</code> is <code>false</code>. (DEPRECATED: will be removed in a future version)
-->
註冊本節點為可排程的節點。當 <code>--register-node</code>標誌為 false 時此設定無效。
已棄用：此引數將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--register-with-taints mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the given list of taints (comma separated <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>). No-op if <code>--register-node</code> is <code>false</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定本節點的汙點標記，格式為 <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>，
以逗號分隔。當 <code>--register-node</code> 為 false 時此標誌無效。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--registry-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding <code>--registry-qps</code>. Only used if <code>--registry-qps</code> is greater than 0. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定突發性映象拉取的個數上限，在不超過 <code>--registration-qps</code> 設定值的前提下
暫時允許此引數所給的映象拉取個數。僅在 <code>--registry-qps</code> 大於 0 時使用。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--registry-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If &gt; 0, limit registry pull QPS to this value.  If <code>0</code>, unlimited. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
如此值大於 0，可用來限制映象倉庫的 QPS 上限。設定為 0，表示不受限制。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--reserved-cpus string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of CPUs or CPU ranges that are reserved for system and kubernetes usage. This specific list will supersede cpu counts in <code>--system-reserved</code> and <code>--kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的一組 CPU 或 CPU 範圍列表，給出為系統和 Kubernetes 保留使用的 CPU。
此列表所給出的設定優先於透過 <code>--system-reserved</code> 和
<code>--kube-reskube-reserved</code> 所保留的 CPU 個數配置。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--reserved-memory string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of memory reservations for NUMA nodes. (e.g. <code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>). The total sum for each memory type should be equal to the sum of <code>--kube-reserved</code>, <code>--system-reserved</code> and <code>--eviction-threshold</code>. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">here</a> for more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
以逗號分隔的 NUMA 節點記憶體預留列表。（例如 <code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>）。
每種記憶體型別的總和應該等於<code>--kube-reserved</code>、<code>--system-reserved</code>和<code>--eviction-threshold</之和 程式碼>。
<a href="https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">瞭解更多詳細資訊。</a>
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--resolv-conf string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/etc/resolv.conf</code>-->預設值：<code>/etc/resolv.conf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Resolver configuration file used as the basis for the container DNS resolution configuration. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
名字解析服務的配置檔名，用作容器 DNS 解析配置的基礎。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--root-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/var/lib/kubelet</code>-->預設值：<code>/var/lib/kubelet</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Directory path for managing kubelet files (volume mounts, etc).
-->
設定用於管理 kubelet 檔案的根目錄（例如掛載卷的相關檔案等）。
</td>
</tr>

<tr>
<td colspan="2">--rotate-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Beta feature&gt; Auto rotate the kubelet client certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
&lt;警告：Beta 特性&gt; 設定當客戶端證書即將過期時 kubelet 自動從
<code>kube-apiserver</code> 請求新的證書進行輪換。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--rotate-server-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Auto-request and rotate the kubelet serving certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. Requires the <code>RotateKubeletServerCertificate</code> feature gate to be enabled, and approval of the submitted <code>CertificateSigningRequest</code> objects. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當 kubelet 的服務證書即將過期時自動從 kube-apiserver 請求新的證書進行輪換。
要求啟用 <code>RotateKubeletServerCertificate</code> 特性門控，以及對提交的
<code>CertificateSigningRequest</code> 物件進行批覆（Approve）操作。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--runonce</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If <code>true</code>, exit after spawning pods from local manifests or remote urls. Exclusive with <code>--enable-server</code> (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)<
-->
設定為 <code>true</code> 表示從本地清單或遠端 URL 建立完 Pod 後立即退出 kubelet 程序。
與 <code>--enable-server</code> 標誌互斥。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--runtime-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the runtime in.
-->
設定用於建立和執行容器執行時的 cgroup 的絕對名稱。
</td>
</tr>

<tr>
<td colspan="2">--runtime-request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>2m0s</code>-->預設值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Timeout of all runtime requests except long running request - <code>pull</code>, <code>logs</code>, <code>exec</code> and <code>attach</code>. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定除了長時間執行的請求（包括 <code>pull</code>、<code>logs</code>、<code>exec</code>
和 <code>attach</code> 等操作）之外的其他執行時請求的超時時間。
到達超時時間時，請求會被取消，丟擲一個錯誤並會等待重試。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--seccomp-default RuntimeDefault</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
&lt;Warning: Alpha feature&gt; Enable the use of <code>RuntimeDefault</code> as the default seccomp profile for all workloads. The <code>SeccompDefault</code> feature gate must be enabled to allow this flag, which is disabled by default.
-->
&lt;警告：alpha 特性&gt; 啟用 <code>RuntimeDefault</code> 作為所有工作負載的預設 seccomp 配置檔案。<code>SeccompDefault</code> 特性門控必須啟用以允許此標誌，預設情況下禁用。
</td>
</tr>

<tr>
<td colspan="2">--serialize-image-pulls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->預設值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version &lt; 1.9 or an <code>aufs</code> storage backend. Issue #10959 has more details. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
逐一拉取映象。建議 *不要* 在 docker 守護程序版本低於 1.9 或啟用了 Aufs 儲存後端的節點上
更改預設值。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If <code>true</code>, avoid header prefixes in the log messages. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定為 <code>true</code> 時在日誌訊息中去掉標頭字首。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If <code>true</code>, avoid headers when opening log files. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定為 <code>true</code>，開啟日誌檔案時去掉標頭。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 2-->預設值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
logs at or above this threshold go to stderr. (DEPRECATED: will be removed in a future release, see <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">here</a>.)
-->
設定嚴重程度達到或超過此閾值的日誌輸出到標準錯誤輸出。
（已棄用：將在未來的版本中刪除，<a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components">進一步瞭解</a>。）
</td>
</tr>

<tr>
<td colspan="2">--streaming-connection-idle-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>4h0m0s</code>-->預設值：<code>4h0m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum time a streaming connection can be idle before the connection is automatically closed. <code>0</code> indicates no timeout. Example: <code>5m</code>. Note: All connections to the kubelet server have a maximum duration of 4 hours.  (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定流連線在自動關閉之前可以空閒的最長時間。0 表示沒有超時限制。
例如：<code>5m</code>。
注意：與 kubelet 伺服器的所有連線最長持續時間為 4 小時。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--sync-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>1m0s</code>-->預設值：<code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max period between synchronizing running containers and config. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
在執行中的容器與其配置之間執行同步操作的最長時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--system-cgroups /</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under <code>'/'</code>. Empty for no container. Rolling back the flag requires a reboot. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此標誌值為一個 cgroup 的絕對名稱，用於所有尚未放置在根目錄下某 cgroup 內的非核心程序。
空值表示不指定 cgroup。回滾該引數需要重啟機器。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved mapStringString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: none-->預設值：無</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for non-kubernetes components. Currently only <code>cpu</code> and <code>memory</code> are supported. See <a href="http://kubernetes.io/docs/user-guide/compute-resources">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
系統預留的資源配置，以一組 <code>資源名稱=資源數量</code> 的格式表示，
（例如：<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>）。
目前僅支援 <code>cpu</code> 和 <code>memory</code> 的設定。
更多細節可參考
<a href="http://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/">相關文件</a>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->預設值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via <code>--system-reserved</code> flag. Ex. <code>/system-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此標誌給出一個頂層 cgroup 絕對名稱，該 cgroup 用於管理非 kubernetes 元件，
這些元件的計算資源透過 <code>--system-reserved</code> 標誌進行預留。
例如 <code>"/system-reserved"</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 Certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to <code>--cert-dir</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
包含 x509 證書的檔案路徑，用於 HTTPS 認證。
如果有中間證書，則中間證書要串接在在伺服器證書之後。
如果未提供 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>，
kubelet 會為公開地址生成自簽名證書和金鑰，並將其儲存到透過
<code>--cert-dir</code> 指定的目錄中。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>
Preferred values:
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384<br/>
Insecure values:
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
伺服器端加密演算法列表，以逗號分隔。如果不設定，則使用 Go 語言加密包的預設演算法列表。<br/>
首選演算法：
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384 <br/>
不安全演算法：
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum TLS version supported. Possible values: <code>VersionTLS10</code>, <code>VersionTLS11</code>, <code>VersionTLS12</code>, <code>VersionTLS13</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定支援的最小 TLS 版本號，可選的版本號包括：<code>VersionTLS10</code>、
<code>VersionTLS11</code>、<code>VersionTLS12</code> 和 <code>VersionTLS13</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 private key matching <code>--tls-cert-file</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
包含與 <code>--tls-cert-file</code> 對應的 x509 私鑰檔案路徑。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--topology-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>none</code>-->預設值：<code>none</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Topology Manager policy to use. Possible values: <code>'none'</code>, <code>'best-effort'</code>, <code>'restricted'</code>, <code>'single-numa-node'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設定拓撲管理策略（Topology Manager policy）。可選值包括：<code>none</code>、
<code>best-effort</code>、<code>restricted</code> 和 <code>single-numa-node</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--topology-manager-scope string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>container</code>-->預設值：<code>container</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Scope to which topology hints applied. Topology Manager collects hints from Hint Providers and applies them to defined scope to ensure the pod admission. Possible values: <code>'container'</code>, <code>'pod'</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
拓撲提示資訊使用範圍。拓撲管理器從提示提供者（Hints Providers）處收集提示資訊，
並將其應用到所定義的範圍以確保 Pod 准入。
可選值包括：<code>container</code>（預設）、<code>pod</code>。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
number for the log level verbosity
-->
設定 kubelet 日誌級別詳細程度的數值。
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Print version information and quit
-->
列印 kubelet 版本資訊並退出。
</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of <code>pattern=N</code> settings for file-filtered logging
-->
以逗號分隔的 <code>pattern=N</code> 設定列表，用於檔案過濾的日誌記錄
</td>
</tr>

<tr>
<td colspan="2">--volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code>-->預設值：<code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The full path of the directory in which to search for additional third party volume plugins. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用來搜尋第三方儲存卷外掛的目錄。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>

<tr>
<td colspan="2">--volume-stats-agg-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>1m0s</code>-->預設值：<code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes. To disable volume calculations, set to <code>0</code>. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
指定 kubelet 計算和快取所有 Pod 和卷的磁碟用量總值的時間間隔。要禁用磁碟用量計算，
請設定為 0。
（已棄用：應在 <code>--config</code> 所給的配置檔案中進行設定。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多資訊。）
</td>
</tr>
</tbody>
</table>

