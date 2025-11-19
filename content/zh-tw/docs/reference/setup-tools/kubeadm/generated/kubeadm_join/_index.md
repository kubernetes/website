<!-- 
Run this on any machine you wish to join an existing cluster 
-->
在你希望加入現有叢集的任何機器上運行它。

<!--
### Synopsis
-->
### 摘要

<!--
When joining a kubeadm initialized cluster, we need to establish
bidirectional trust. This is split into discovery (having the Node
trust the Kubernetes Control Plane) and TLS bootstrap (having the
Kubernetes Control Plane trust the Node).
-->
當節點加入 kubeadm 初始化的叢集時，我們需要建立雙向信任。
這個過程可以分解爲發現（讓待加入節點信任 Kubernetes 控制平面節點）和
TLS 引導（讓 Kubernetes 控制平面節點信任待加入節點）兩個部分。

<!--
There are 2 main schemes for discovery. The first is to use a shared
token along with the IP address of the API server. The second is to
provide a file - a subset of the standard kubeconfig file. The
discovery/kubeconfig file supports token, client-go authentication
plugins ("exec"), "tokenFile", and "authProvider". This file can be a
local file or downloaded via an HTTPS URL. The forms are
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443,
kubeadm join --discovery-file path/to/file.conf, or kubeadm join
--discovery-file https://url/file.conf. Only one form can be used. If
the discovery information is loaded from a URL, HTTPS must be used.
Also, in that case the host installed CA bundle is used to verify
the connection.
-->
有兩種主要的發現方案。
第一種方案是使用共享令牌和 API 伺服器的 IP 地址。
第二種是以文件形式提供標準 kubeconfig 文件的一個子集。
發現/kubeconfig 文件支持令牌、client-go 鑑權插件（“exec”）、“tokenFile" 和
"authProvider"。該文件可以是本地文件，也可以通過 HTTPS URL 下載。
格式是 `kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443`、
`kubeadm join --discovery-file path/to/file.conf` 或者
`kubeadm join --discovery-file https://url/file.conf`。
只能使用其中一種。
如果發現信息是從 URL 加載的，必須使用 HTTPS。
此外，在這種情況下，主機安裝的 CA 包用於驗證連接。

<!--
If you use a shared token for discovery, you should also pass the
--discovery-token-ca-cert-hash flag to validate the public key of the
root certificate authority (CA) presented by the Kubernetes Control Plane.
The value of this flag is specified as "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;",
where the supported hash type is "sha256". The hash is calculated over
the bytes of the Subject Public Key Info (SPKI) object (as in RFC7469).
This value is available in the output of "kubeadm init" or can be
calculated using standard tools. The --discovery-token-ca-cert-hash flag
may be repeated multiple times to allow more than one public key.
-->
如果使用共享令牌進行發現，還應該傳遞 --discovery-token-ca-cert-hash 參數來驗證
Kubernetes 控制平面節點提供的根證書頒發機構（CA）的公鑰。
此參數的值指定爲 "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;"，
其中支持的哈希類型爲 "sha256"。哈希是通過 Subject Public Key Info（SPKI）對象的字節計算的（如 RFC7469）。
這個值可以從 "kubeadm init" 的輸出中獲得，或者可以使用標準工具進行計算。
可以多次重複 `--discovery-token-ca-cert-hash` 參數以允許多個公鑰。

<!--
If you cannot know the CA public key hash ahead of time, you can pass
the --discovery-token-unsafe-skip-ca-verification flag to disable this
verification. This weakens the kubeadm security model since other nodes
can potentially impersonate the Kubernetes Control Plane.
-->
如果無法提前知道 CA 公鑰哈希，則可以通過 `--discovery-token-unsafe-skip-ca-verification` 參數禁用此驗證。
這削弱了 kubeadm 安全模型，因爲其他節點可能會模仿 Kubernetes 控制平面節點。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is
used to temporarily authenticate with the Kubernetes Control Plane to submit a
certificate signing request (CSR) for a locally created key pair. By
default, kubeadm will set up the Kubernetes Control Plane to automatically
approve these signing requests. This token is passed in with the
--tls-bootstrap-token abcdef.1234567890abcdef flag.

Often times the same token is used for both parts. In this case, the
--token flag can be used instead of specifying each token individually.
-->
TLS 引導機制也通過共享令牌驅動。
這用於向 Kubernetes 控制平面節點進行臨時的身份驗證，以提交本地創建的密鑰對的證書籤名請求（CSR）。
默認情況下，kubeadm 將設置 Kubernetes 控制平面節點自動批准這些簽名請求。
這個令牌通過 `--tls-bootstrap-token abcdef.1234567890abcdef` 參數傳入。

通常兩個部分會使用相同的令牌。
在這種情況下可以使用 --token 參數，而不是單獨指定每個令牌。

<!-- 
The "join [api-server-endpoint]" command executes the following phases:
-->
"join [api-server-endpoint]" 命令執行下列階段：

<!--
```
preflight              Run join pre-flight checks
control-plane-prepare  Prepare the machine for serving a control plane
  /download-certs        [EXPERIMENTAL] Download certificates shared among control-plane nodes from the kubeadm-certs Secret
  /certs                 Generate the certificates for the new control plane components
  /kubeconfig            Generate the kubeconfig for the new control plane components
  /control-plane         Generate the manifests for the new control plane components
kubelet-start          Write kubelet settings, certificates and (re)start the kubelet
control-plane-join     Join a machine as a control plane instance
  /etcd                  Add a new local etcd member
  /update-status         Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED)
  /mark-control-plane    Mark a node as a control-plane
wait-control-plane     Wait for the control plane to start
```
-->
1. preflight：運行接入前檢查
2. control-plane-prepare：準備用作控制平面的機器
   1. download-certs：[實驗] 從 kubeadm-certs Secret 下載控制平面節點之間共享的證書
   2. certs：爲新的控制平面組件生成證書
   3. kubeconfig：爲新的控制平面組件生成 kubeconfig
   4. control-plane：生成新控制平面組件的清單
3. kubelet-start：寫入 kubelet 設置、證書並（重新）啓動 kubelet
4. control-plane-join：將機器加入爲控制平面實例
   1. etcd：添加新的本地 etcd 成員
   2. update-status：將新的控制平面節點註冊到 kubeadm-config ConfigMap 中維護的 ClusterStatus 中（已棄用）
   3. mark-control-plane：將節點標記爲控制平面
5. wait-control-plane：[實驗] 等待控制平面啓動

```shell
kubeadm join [api-server-endpoint] [flags]
```

<!-- 
### Options
-->
### 選項

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>
<tr>
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on.
If not set the default network interface will be used.
-->
如果該節點託管一個新的控制平面實例，則 API 伺服器將公佈其正在偵聽的 IP 地址。如果未設置，則使用默認網路接口。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值: 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If the node should host a new control plane instance, the port for the API Server to bind to.
-->
如果節點應該託管新的控制平面實例，則爲 API 伺服器要綁定的端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use this key to decrypt the certificate secrets uploaded by init. The certificate key is a hex encoded string that is an AES key of size 32 bytes.
-->
使用此密鑰可以解密由 init 上傳的證書 Secret。
證書密鑰爲一個十六進制編碼的字符串，它是大小爲 32 字節的 AES 密鑰。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 設定文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Create a new control plane instance on this node
-->
在此節點上創建一個新的控制平面實例。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; 
use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要連接的 CRI 套接字的路徑。如果爲空，則 kubeadm 將嘗試自動檢測此值；
僅當安裝了多個 CRI 或存在非標準的 CRI 套接字時，才使用此選項。
</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For file-based discovery, a file or URL from which to load cluster information.
-->
對於基於文件的發現，給出用於加載叢集信息的文件或者 URL。
</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For token-based discovery, the token used to validate cluster information fetched from the API server.
-->
對於基於令牌的發現，該令牌用於驗證從 API 伺服器獲取的叢集信息。
</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").
-->
對基於令牌的發現，驗證根 CA 公鑰是否與此哈希匹配 (格式："&lt;type&gt;:&lt;value&gt;")。
</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
-->
對於基於令牌的發現，允許在未關聯 --discovery-token-ca-cert-hash 參數的情況下添加節點。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
Don't apply any changes; just output what would be done. 
-->
不做任何更改；只輸出將要執行的操作。
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
help for join
-->
join 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
錯誤將顯示爲警告的檢查列表；例如：'IsPrivilegedUser,Swap'。
取值爲 'all' 時將忽略檢查中的所有錯誤。
</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify the node name.
-->
指定節點的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--  
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名爲 "target[suffix][+patchtype].extension" 的文件的目錄的路徑。
例如，"kube-apiserver0+merge.yaml" 或僅僅是 "etcd.json"。
"target" 可以是 “kube-apiserver”、“kube-controller-manager”、“kube-scheduler”、“etcd”、“kubeletconfiguration” 之一，
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，並且它們與 kubectl 支持的補丁格式匹配。
默認的 "patchtype" 爲 "strategic"。 "extension" 必須爲 "json" 或 "yaml"。
"suffix" 是一個可選字符串，可用於確定首先按字母順序應用哪些補丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
List of phases to be skipped
-->
要跳過的階段列表。
</p>
</td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
-->
指定在加入節點時用於臨時通過 Kubernetes 控制平面進行身份驗證的令牌。
</p>
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.</p>
-->
<p>如果未提供這些值，則將它們用於 discovery-token 令牌和 tls-bootstrap 令牌。</p>
</td>
</tr>

</tbody>
</table>

<!-- 
### Options inherited from parent commands 
-->
### 從父命令繼承的選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 指向 '真實' 宿主機根文件系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
