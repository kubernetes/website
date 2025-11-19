<!--
### Synopsis
-->
### 概要

<!--
Run pre-flight checks for kubeadm join.
-->
運行 kubeadm join 命令添加節點前檢查。

```shell
kubeadm join phase preflight [api-server-endpoint] [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Run join pre-flight checks using a config file.
kubeadm join phase preflight --config kubeadm-config.yaml
```
-->
```shell
# 使用配置文件運行 kubeadm join 命令添加節點前檢查。
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
<p>
<!--
If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
-->
對於將要託管新的控制平面實例的節點，指定 API 伺服器將公佈的其正在偵聽的 IP 地址。
如果未設置，則使用默認網路接口。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If the node should host a new control plane instance, the port for the API Server to bind to.
-->
針對將要託管新的控制平面實例的節點，設置 API 伺服器要綁定的端口。
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
使用此密鑰可以解密由 `init` 操作上傳的證書 Secret。
證書密鑰爲十六進制編碼的字符串，是大小爲 32 字節的 AES 密鑰。
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
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
提供給 CRI 套接字建立連接的路徑。如果爲空，則 kubeadm 將嘗試自動檢測該值；
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
<td colspan="2">--discovery-token-ca-cert-hash strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").
-->
對於基於令牌的發現，驗證根 CA 公鑰是否匹配此哈希值（格式："&lt;type&gt;:&lt;value&gt;"）。
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
help for preflight
-->
preflight 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors stringSlice</td>
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
指定節點名稱。
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
<p>
<!--
Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
-->
如果未提供這些值，則將它們用於 discovery-token 令牌和 tls-bootstrap 令牌。
</p>
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
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向 '真實' 宿主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
