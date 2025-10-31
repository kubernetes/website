<!--
Print the version of kubeadm
-->
打印 kubeadm 的版本。

<!--
### Synopsis
-->
### 概要

<!--
Print the version of kubeadm
-->
打印 kubeadm 的版本。

```
kubeadm version [flags]
```

<!--
### Options
-->
### 选项

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for version
-->
version 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format; available options are 'yaml', 'json' and 'short'
-->
输出格式；可用的选项有 'yaml'、'json' 和 'short'。
</p>
</td>
</tr>

</tbody>
</table>

<!-- 
### Options inherited from parent commands 
-->
### 从父命令继承的选项

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
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真实”主机根文件系统的路径。设置此标志将导致 kubeadm 切换到所提供的路径。
</p>
</td>
</tr>

</tbody>
</table>
