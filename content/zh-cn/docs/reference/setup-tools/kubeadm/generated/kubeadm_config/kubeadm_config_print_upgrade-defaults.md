
<!--
Print default upgrade configuration, that can be used for 'kubeadm upgrade'
-->
打印可用于 `kubeadm upgrade` 的默认升级配置。

<!--
### Synopsis

This command prints objects such as the default upgrade configuration that is used for 'kubeadm upgrade'.

Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like "abcdef.0123456789abcdef" in order to pass validation but
not perform the real computation for creating a token.
-->
### 概要

此命令打印 `kubeadm upgrade` 所用的默认升级配置等这类对象。

请注意，诸如启动引导令牌（Bootstrap Token）字段这类敏感值已替换为 "abcdef.0123456789abcdef"
这类占位符值用来通过合法性检查，但不执行创建令牌的实际计算。

```
kubeadm config print upgrade-defaults [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for upgrade-defaults
-->
upgrade-defaults 操作的帮助命令。
</p></td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: -->默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时所使用的 kubeconfig 文件。
如果该参数未被设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真实”主机根文件系统的路径。这将导致 kubeadm 切换到所提供的路径。
</p></td>
</tr>

</tbody>
</table>
