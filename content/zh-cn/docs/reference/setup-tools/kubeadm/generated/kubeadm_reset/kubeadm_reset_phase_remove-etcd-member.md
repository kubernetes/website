<!--
Remove a local etcd member.
-->
移除本地 etcd 成员。

<!--
### Synopsis
-->
### 概要

<!--
Remove a local etcd member for a control plane node.
-->
移除控制平面节点的本地 etcd 成员。

```
kubeadm reset phase remove-etcd-member [flags]
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Don't apply any changes; just output what would be done.
-->
不做任何更改；只输出将要执行的操作。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for remove-etcd-member
-->
remove-etcd-member 操作的帮助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。如果未设置该标志，则可以在默认位置中查找现有的 kubeconfig 文件。
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
到“真实”主机根文件系统的路径。这将导致 kubeadm 切换到所提供的路径。
</p>
</td>
</tr>

</tbody>
</table>
