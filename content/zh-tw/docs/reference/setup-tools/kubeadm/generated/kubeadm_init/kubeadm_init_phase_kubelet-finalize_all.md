<!--
### Synopsis
-->
### 概要

<!--
Run all kubelet-finalize phases
-->
運行 kubelet-finalize 的所有階段

```shell
kubeadm init phase kubelet-finalize all [flags]
```

<!--
### Examples
-->
### 示例

<!--  
```
  # Updates settings relevant to the kubelet after TLS bootstrap
  kubeadm init phase kubelet-finalize all --config
```
-->
```
# 在 TLS 引導後更新與 kubelet 相關的設置
kubeadm init phase kubelet-finalize all --config
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
<!-- <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> -->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "/etc/kubernetes/pki"</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>保存和儲存證書的路徑。</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadm 設定檔案的路徑。</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't apply any changes; just output what would be done.
-->
<p>
不做任何更改；只輸出將要執行的操作。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for all</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>all 操作的幫助命令</p></td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 繼承於父命令的選項

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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[實驗] 到'真實'主機根檔案系統的路徑。</p></td>
</tr>

</tbody>
</table>

