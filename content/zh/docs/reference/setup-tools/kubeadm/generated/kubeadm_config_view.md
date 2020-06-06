
<!--
### Synopsis
-->

### 概要

<!--
Using this command, you can view the ConfigMap in the cluster where the configuration for kubeadm is located.
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->

使用此命令，可以查看 kubeadm 配置的集群中的 ConfigMap。
该配置位于 "kube-system" 命名空间中的名为 "kubeadm-config" 的 ConfigMap 中。


```
kubeadm config view [flags]
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
help for view
-->
view 操作的帮助命令
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 继承于父命令的选项

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用于和集群通信的 KubeConfig 文件。如果未设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- [EXPERIMENTAL] The path to the 'real' host root filesystem.  -->
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

