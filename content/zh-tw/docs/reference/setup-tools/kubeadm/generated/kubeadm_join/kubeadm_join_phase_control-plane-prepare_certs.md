<!--
### Synopsis
-->
### 概要

<!--
Generate the certificates for the new control plane components
-->
爲新的控制平面組件生成證書。

```shell
kubeadm join phase control-plane-prepare certs [api-server-endpoint] [flags]
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
如果該節點託管一個新的控制平面實例，則 API 伺服器將公佈其正在偵聽的 IP 地址。
如果未設置，則使用預設網路介面。
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
kubeadm 設定檔案的路徑。
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
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
For file-based discovery, a file or URL from which to load cluster information.
-->
對於基於檔案的發現，給出用於加載叢集資訊的檔案或者 URL。
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
對於基於令牌的發現，該令牌用於驗證從 API 伺服器獲取的叢集資訊。
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
對於基於令牌的發現，請驗證根 CA 公鑰是否匹配此哈希值（格式："&lt;type&gt;:&lt;value&gt;"）。
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
help for certs
-->
certs 操作的幫助命令。
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
[實驗] 指向 '真實' 宿主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
