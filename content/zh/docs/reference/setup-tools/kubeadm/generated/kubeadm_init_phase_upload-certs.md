
<!-- 
### Synopsis
-->
### 概要

<!--
This command is not meant to be run on its own. See list of available subcommands.
-->
此命令并非设计用来单独运行。请参阅可用子命令列表。

```
kubeadm init phase upload-certs [flags]
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
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Key used to encrypt the control-plane certificates in the kubeadm-certs Secret.
-->
用于加密 kubeadm-certs Secret 中的控制平面证书的密钥。
</td>
</tr>

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
help for upload-certs
-->
upload-certs 操作的帮助命令
</td>
</tr>

<tr>
<!-- td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td -->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
用来与集群通信的 kubeconfig 文件。
如果此标志未设置，则可以在一组标准的位置搜索现有的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--skip-certificate-key-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't print the key used to encrypt the control-plane certificates.
-->
不要打印输出用于加密控制平面证书的密钥。
</td>
</tr>

<tr>
<td colspan="2">--upload-certs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Upload control-plane certificates to the kubeadm-certs Secret.
-->
将控制平面证书上传到 kubeadm-certs Secret。
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
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

