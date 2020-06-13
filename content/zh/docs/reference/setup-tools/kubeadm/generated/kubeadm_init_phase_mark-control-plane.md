
<!--
### Synopsis
-->

### 概要

<!--
Mark a node as a control-plane
-->

标记 Node 节点为控制平面节点

```
kubeadm init phase mark-control-plane [flags]
```

<!--
### Examples

# Applies control-plane label and taint to the current node, functionally equivalent to what executed by kubeadm init.
# Applies control-plane label and taint to a specific node
-->

### 示例

```
# 将控制平面标签和污点应用于当前节点，其功能等效于 kubeadm init执行的操作。
kubeadm init phase mark-control-plane --config config.yml

# 将控制平面标签和污点应用于特定节点
kubeadm init phase mark-control-plane --node-name myNode
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路径。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for mark-control-plane
-->
mark-control-plane 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify the node name.
-->
指定节点名称。
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
<td colspan="2">--rootfs 字符串</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

