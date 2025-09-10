<!--
Prepare the machine for serving a control plane
-->
准备为控制平面服务的机器。

<!--
### Synopsis
-->
### 概要

<!--
Prepare the machine for serving a control plane
-->
准备为控制平面服务的机器。

```
kubeadm join phase control-plane-prepare [flags]
```

<!--
### Examples
-->
### 示例

<!--
# Prepares the machine for serving a control plane
-->
```
# 准备为控制平面服务的机器
kubeadm join phase control-plane-prepare all
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
<!--
help for control-plane-prepare
-->
<p>
control-plane-prepare 操作的帮助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 从父命令中继承的选项

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
[实验] 指向 '真实' 宿主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
