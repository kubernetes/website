<!--
### Synopsis
-->
### 概要

<!--
Write a file with KubeletConfiguration and an environment file with node specific kubelet settings, and then (re)start kubelet.
-->
生成一個包含 KubeletConfiguration 的文件和一個包含特定於節點的 kubelet
設定的環境文件，然後（重新）啓動 kubelet。

```shell
kubeadm join phase kubelet-start [api-server-endpoint] [flags]
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
<td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
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
help for kubelet-start
-->
kubelet-start 操作的幫助命令。
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
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
目錄路徑，指向的目錄中包含名爲 “target[suffix][+patchtype].extension” 的文件。
例如，"kube-apiserver0+merge.yaml" 或 "etcd.json" 這種簡單形式。
"target" 可以是 “kube-apiserver”、“kube-controller-manager”、“kube-scheduler”、
“etcd”、“kubeletconfiguration” 之一，
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，並且它們與 kubectl 支持的補丁格式匹配。
默認的 "patchtype" 爲 "strategic"。 "extension" 必須爲 "json" 或 "yaml"。
"suffix" 是一個可選字符串，可用於確定按字母順序首先應用哪些補丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
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
