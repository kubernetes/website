<!-- 
Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file 
-->
生成所有建立控制平面和管理员（admin）所需的 kubeconfig 文件。

<!-- 
### Synopsis
-->
### 概要

<!-- 
Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
-->
生成建立控制平面和管理 kubeconfig 文件所需的所有 kubeconfig 文件

```shell
kubeadm init phase kubeconfig [flags]
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
help for kubeconfig
-->
kubeconfig 操作的帮助命令
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
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到'真实'主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
