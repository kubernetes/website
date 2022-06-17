<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!-- 
Run this on any machine you wish to join an existing cluster 
-->
在你希望加入現有叢集的任何機器上執行它

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
這個過程可以分解為發現（讓待加入節點信任 Kubernetes 控制平面節點）和 TLS 引導（讓Kubernetes 控制平面節點信任待加入節點）兩個部分。

<!--
There are 2 main schemes for discovery. The first is to use a shared
token along with the IP address of the API server. The second is to
provide a file - a subset of the standard kubeconfig file. This file
can be a local file or downloaded via an HTTPS URL. The forms are
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443,
kubeadm join --discovery-file path/to/file.conf, or kubeadm join
--discovery-file https://url/file.conf. Only one form can be used. If
the discovery information is loaded from a URL, HTTPS must be used.
Also, in that case the host installed CA bundle is used to verify
the connection.
-->

有兩種主要的發現方案。
第一種方法是使用共享令牌和 API 伺服器的 IP 地址。
第二種是提供一個檔案 - 標準 kubeconfig 檔案的一個子集。
該檔案可以是本地檔案，也可以透過 HTTPS URL 下載。
格式是 `kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443`、`kubeadm join--discovery-file path/to/file.conf` 或者`kubeadm join --discovery-file https://url/file.conf`。
只能使用其中一種。
如果發現資訊是從 URL 載入的，必須使用 HTTPS。
此外，在這種情況下，主機安裝的 CA 包用於驗證連線。

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

如果使用共享令牌進行發現，還應該傳遞 --discovery-token-ca-cert-hash 引數來驗證 Kubernetes 控制平面節點提供的根證書頒發機構（CA）的公鑰。
此引數的值指定為 "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;"，其中支援的雜湊型別為 "sha256"。雜湊是透過 Subject Public Key Info（SPKI）物件的位元組計算的（如 RFC7469）。
這個值可以從 "kubeadm init" 的輸出中獲得，或者可以使用標準工具進行計算。
可以多次重複 --discovery-token-ca-cert-hash 引數以允許多個公鑰。

<!--
If you cannot know the CA public key hash ahead of time, you can pass
the --discovery-token-unsafe-skip-ca-verification flag to disable this
verification. This weakens the kubeadm security model since other nodes
can potentially impersonate the Kubernetes Control Plane.
-->
如果無法提前知道 CA 公鑰雜湊，則可以透過 --discovery-token-unsafe-skip-ca-verification 引數禁用此驗證。
這削弱了kubeadm 安全模型，因為其他節點可能會模仿 Kubernetes 控制平面節點。

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

TLS 引導機制也透過共享令牌驅動。
這用於向 Kubernetes 控制平面節點進行臨時的身份驗證，以提交本地建立的金鑰對的證書籤名請求（CSR）。
預設情況下，kubeadm 將設定 Kubernetes 控制平面節點自動批准這些簽名請求。
這個令牌透過 --tls-bootstrap-token abcdef.1234567890abcdef 引數傳入。

通常兩個部分會使用相同的令牌。
在這種情況下可以使用 --token 引數，而不是單獨指定每個令牌。

<!-- 
The "join [api-server-endpoint]" command executes the following phases:
-->

"join [api-server-endpoint]" 命令執行下列階段：

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
```

```
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
<!--
<p>If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>如果該節點託管一個新的控制平面例項，則 API 伺服器將公佈其正在偵聽的 IP 地址。如果未設定，則使用預設網路介面。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the port for the API Server to bind to.</p>
-->
<p>如果節點應該託管新的控制平面例項，則為 API 伺服器要繫結的埠。</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Use this key to decrypt the certificate secrets uploaded by init.</p>
-->
<p>使用此金鑰可以解密由 init 上傳的證書 secret。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to kubeadm config file.</p>
-->
<p>kubeadm 配置檔案的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Create a new control plane instance on this node</p>
-->
<p>在此節點上建立一個新的控制平面例項</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.</p>
-->
<p>要連線的 CRI 套接字的路徑。如果為空，則 kubeadm 將嘗試自動檢測此值；僅當安裝了多個 CRI 或具有非標準 CRI 插槽時，才使用此選項。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For file-based discovery, a file or URL from which to load cluster information.</p>
-->
<p>對於基於檔案的發現，給出用於載入叢集資訊的檔案或者 URL。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, the token used to validate cluster information fetched from the API server.</p>
-->
<p>對於基於令牌的發現，該令牌用於驗證從 API 伺服器獲取的叢集資訊。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").</p>
-->
<p>對基於令牌的發現，驗證根 CA 公鑰是否與此雜湊匹配 (格式: "&lt;type&gt;:&lt;value&gt;")。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.</p>
-->
<p>對於基於令牌的發現，允許在未關聯 --discovery-token-ca-cert-hash 引數的情況下新增節點。</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- 
Don't apply any changes; just output what would be done. 
-->
不會應用任何改動，僅僅輸出那些將變動的地方。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for join</p>
-->
<p>join 操作的幫助命令</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</p>
-->
<p>錯誤將顯示為警告的檢查列表；例如：'IsPrivilegedUser,Swap'。取值為 'all' 時將忽略檢查中的所有錯誤。</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify the node name.</p>
-->
<p>指定節點的名稱</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
<p>Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.</p>
-->
<p>包含名為 "target[suffix][+patchtype].extension" 的檔案的目錄的路徑。
例如，"kube-apiserver0+merge.yaml" 或僅僅是 "etcd.json"。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，並且它們與 kubectl 支援的補丁格式匹配。
預設的 "patchtype" 為 "strategic"。 "extension" 必須為 "json" 或 "yaml"。 
"suffix" 是一個可選字串，可用於確定首先按字母順序應用哪些補丁。</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>List of phases to be skipped</p>
-->
<p>要跳過的階段列表</p>
</td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.</p>
-->
<p>指定在加入節點時用於臨時透過 Kubernetes 控制平面進行身份驗證的令牌。</p>
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
<p>[實驗] 指向 '真實' 宿主機根檔案系統的路徑。</p>
</td>
</tr>

</tbody>
</table>

