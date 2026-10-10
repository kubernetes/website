<!--
### Synopsis

Wait for the kubelet to bootstrap itself

```
kubeadm join phase kubelet-wait-bootstrap [flags]
```
-->
### 概要

等待 kubelet 完成自身的引导初始化。

```shell
kubeadm join phase kubelet-wait-bootstrap [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要连接的 CRI 套接字的路径。如果为空，kubeadm 将尝试自动检测此值；
仅当安装了多个 CRI 或具有非标准 CRI 套接字时，才使用此选项。
</p></td>
</tr>

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for kubelet-wait-bootstrap
-->
kubelet-wait-bootstrap 操作的帮助命令。
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
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
指向“真实”主机根文件系统的路径。设置此参数将导致 kubeadm 切换到所提供的路径。
</p></td>
</tr>

</tbody>
</table>
