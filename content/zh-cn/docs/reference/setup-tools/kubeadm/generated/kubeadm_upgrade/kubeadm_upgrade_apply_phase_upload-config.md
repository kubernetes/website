<!--
### Synopsis

Upload the kubeadm and kubelet configurations to ConfigMaps
-->
### 概要

将 kubeadm 和 kubelet 配置上传到 ConfigMap。

```shell
kubeadm upgrade apply phase upload-config [flags]
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for upload-config
-->
upload-config 操作的帮助命令。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
“真实”主机根文件系统的路径。设置此参数将导致 kubeadm 切换到所提供的路径。
</p>
</td>
</tr>

</tbody>
</table>
