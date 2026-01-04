<!--
### Synopsis
-->
### 概要

<!--
Performs a best effort revert of changes made to this host by 'kubeadm init' or 'kubeadm join'
-->
盡最大努力還原通過 'kubeadm init' 或者 'kubeadm join' 操作對主機所作的更改。

<!--
The "reset" command executes the following phases:
-->
"reset" 命令執行以下階段：

<!--
```
preflight              Run reset pre-flight checks
remove-etcd-member     Remove a local etcd member.
cleanup-node           Run cleanup node.
```
-->
```shell
preflight              重置預檢
remove-etcd-member     移除本地 etcd 成員
cleanup-node           清理節點
```

```shell
kubeadm reset [flags]
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
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the directory where the certificates are stored. If specified, clean this directory.
-->
儲存證書的目錄路徑。如果已指定，則需要清空此目錄。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cleanup-tmp-dir</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Cleanup the &quot;/etc/kubernetes/tmp&quot; directory
-->
清理 &quot;/etc/kubernetes/tmp&quot; 目錄。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 設定檔案的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要連接的 CRI 套接字的路徑。如果爲空，則 kubeadm 將嘗試自動檢測此值；
僅當安裝了多個 CRI 或存在非標準的 CRI 套接字時，才使用此選項。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Don't apply any changes; just output what would be done.
-->
不做任何更改；只輸出將要執行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Reset the node without prompting for confirmation.
-->
在不提示確認的情況下重置節點。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for reset
-->
reset 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
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
<td colspan="2">
<p>
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</p>
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 檔案。如果未設置該標誌，
則可以在一組標準位置中搜索現有的 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
List of phases to be skipped
-->
要跳過的階段列表。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根檔案系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
