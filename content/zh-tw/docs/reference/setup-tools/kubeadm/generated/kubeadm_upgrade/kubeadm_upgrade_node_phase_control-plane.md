<!--
### Synopsis
-->
### 概要

<!--
Upgrade the control plane instance deployed on this node, if any
-->
升級部署在此節點上的控制平面實例，如果有的話。

```shell
kubeadm upgrade node phase control-plane [flags]
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
<td colspan="2">--certificate-renewal</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
續訂在升級期間變更的組件所使用的證書。
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Do not change any state, just output the actions that would be performed.
-->
不改變任何狀態，只輸出將要執行的動作。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the upgrade of etcd.
-->
執行 etcd 的升級。
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
help for control-plane
-->
control-plane 操作的幫助命令。
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
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用於和叢集通信的 KubeConfig 檔案。如果它沒有被設置，那麼 kubeadm
將會搜索一個已經存在於標準路徑的 KubeConfig 檔案。
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
Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名爲 "target[suffix][+patchtype].extension" 的檔案的目錄的路徑。
例如，"kube-apiserver0+merge.yaml" 或僅僅是 "etcd.json"。
"target" 可以是 "kube-apiserver"、"kube-controller-manager"、"kube-scheduler"、
"etcd"、"kubeletconfiguration" 之一。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，並且它們與 kubectl 支持的補丁格式匹配。
預設的 "patchtype" 爲 "strategic"。"extension" 必須爲 "json" 或 "yaml"。
"suffix" 是一個可選字符串，可用於確定首先按字母順序應用哪些補丁。
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
[實驗] 指向 “真實” 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
