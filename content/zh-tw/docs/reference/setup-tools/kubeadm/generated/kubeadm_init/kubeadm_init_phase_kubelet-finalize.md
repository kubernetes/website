<!--
### Synopsis
-->
### 概要

<!--
Updates settings relevant to the kubelet after TLS bootstrap
-->
TLS 引導後更新與 kubelet 相關的設置。

```shell
kubeadm init phase kubelet-finalize [flags]
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
```shell
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for kubelet-finalize
-->
kubelet-finalize 操作的幫助命令。
</p>
</td>
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
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到'真實'主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
