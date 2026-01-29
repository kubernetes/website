<!--
### Synopsis
-->
### 概要

<!--
Upload the kubelet configuration extracted from the kubeadm InitConfiguration object to a kubelet-config ConfigMap in the cluster
-->
將從 kubeadm InitConfiguration 對象提取的 kubelet 設定上傳到叢集中的
`kubelet-config` ConfigMap。

```shell
kubeadm init phase upload-config kubelet [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Upload the kubelet configuration from the kubeadm Config file to a ConfigMap in the cluster.
kubeadm init phase upload-config kubelet --config kubeadm.yaml
```
-->
```shell
# 將 kubelet 配置從 kubeadm 配置文件上傳到集羣中的 ConfigMap。
kubeadm init phase upload-config kubelet --config kubeadm.yaml
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
到 kubeadm 設定檔案的路徑。
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
要連接的 CRI 套接字的路徑。如果該值爲空，kubeadm 將嘗試自動檢測；
僅當你安裝了多個 CRI 或使用非標準的 CRI 套接字時才應使用此選項。
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
help for kubelet
-->
kubelet 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">-- kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 檔案。如果未設置該標籤，
則可以通過一組標準路徑來尋找已有的 kubeconfig 檔案。
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
[實驗] 到 '真實' 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
