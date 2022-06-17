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
Run join pre-flight checks 
-->
執行 join 命令前檢查

<!--
### Synopsis
-->

### 概要

<!--
Run pre-flight checks for kubeadm join.
-->

執行 kubeadm join 命令新增節點前檢查。

```
kubeadm join phase preflight [api-server-endpoint] [flags]
```

<!--
### Examples
# Run join pre-flight checks using a config file.
-->

### 示例

```
# 使用配置檔案執行 kubeadm join 命令新增節點前檢查。
kubeadm join phase preflight --config kubeadm-config.yaml
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
<p>對於將要託管新的控制平面例項的節點，指定 API 伺服器將公佈的其正在偵聽的 IP 地址。如果未設定，則使用預設網路介面。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the port for the API Server to bind to.</p>
-->
<p>針對將要託管新的控制平面例項的節點，設定 API 伺服器要繫結的埠。</p>
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
<p>使用此金鑰可以解密由 `init` 操作上傳的證書 secret。</p>
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
<p>提供給 CRI 套接字建立連線的路徑。如果為空，則 kubeadm 將嘗試自動檢測該值；僅當安裝了多個 CRI 或具有非標準 CRI 套接字時，才使用此選項。</p>
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
<td colspan="2">--discovery-token-ca-cert-hash strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").</p>
-->
<p>對於基於令牌的發現，驗證根 CA 公鑰是否匹配此雜湊值（格式："&lt;type&gt;:&lt;value&gt;"）。</p>
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for preflight</p>
-->
<p>preflight 操作的幫助命令</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors stringSlice</td>
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
<p>指定節點名稱。</p>
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

