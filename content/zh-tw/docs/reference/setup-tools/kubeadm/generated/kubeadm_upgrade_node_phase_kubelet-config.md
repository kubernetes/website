<!--
Upgrade the kubelet configuration for this node
-->
升級此節點的 kubelet 配置

<!-- ### Synopsis -->

### 概要

<!--
Download the kubelet configuration from the kubelet-config ConfigMap stored in the cluster
-->

從叢集中 ConfigMap kubelet-config 下載 kubelet 配置

```
kubeadm upgrade node phase kubelet-config [flags]
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Do not change any state, just output the actions that would be performed.
-->
<p>
不改變任何狀態，只輸出將要執行的操作
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet-config
-->
<p>
kubelet-config 操作的幫助資訊
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用於和叢集通訊的 KubeConfig 檔案。如果它沒有被設定，那麼 kubeadm 將會搜尋一個已經存在於標準路徑的 KubeConfig 檔案。
</p>
</td>
</tr>

</tbody>
</table>


### 從父命令繼承的選項

<!--
### Options inherited from parent commands
-->

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
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[實驗] 到'真實'主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>

