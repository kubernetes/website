<!-- 
### Synopsis
-->
### 概要

<!--
Upload the kubeadm ClusterConfiguration to a ConfigMap called kubeadm-config in the kube-system namespace. This enables correct configuration of system components and a seamless user experience when upgrading.
-->
將 kubeadm ClusterConfiguration 上傳到 kube-system 命名空間中名爲 kubeadm-config 的 ConfigMap 中。
這樣就可以正確配置系統組件，並在升級時提供無縫的用戶體驗。

<!--
Alternatively, you can use kubeadm config.
-->
另外，可以使用 kubeadm 配置。

```shell
kubeadm init phase upload-config kubeadm [flags]
```

<!--
### Examples
-->
### 示例

<!--
# upload the configuration of your cluster
-->
```shell
# 上傳集羣配置
kubeadm init phase upload-config kubeadm --config=myConfig.yaml
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
kubeadm 配置文件的路徑。
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
help for kubeadm
-->
kubeadm 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與集羣通信時使用的 kubeconfig 文件。如果未設置該參數，
則可以在一組標準位置中搜索現有的 kubeconfig 文件。
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
[實驗] 到'真實'主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
