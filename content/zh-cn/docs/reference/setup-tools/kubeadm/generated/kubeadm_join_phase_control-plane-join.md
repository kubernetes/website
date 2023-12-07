<!--
Join a machine as a control plane instance
-->
添加作为控制平面实例的机器。

<!--
### Synopsis
-->
### 概要

<!--
Join a machine as a control plane instance
-->
添加作为控制平面实例的机器。

```
kubeadm join phase control-plane-join [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Joins a machine as a control plane instance
kubeadm join phase control-plane-join all
```
-->

```
# 将机器作为控制平面实例加入
kubeadm join phase control-plane-join all
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
help for control-plane-join
-->
<p>
control-plane-join 操作的帮助命令。
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
[实验] 到 '真实' 主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
