<!--
Upload certificates to kubeadm-certs
-->
将证书上传到 kubeadm-certs。

<!-- 
### Synopsis
-->
### 概要

<!--
Upload control plane certificates to the kubeadm-certs Secret
-->
将控制平面证书上传到 kubeadm-certs Secret。

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
The certificate key is a hex encoded string that is an AES key of size 32 bytes.
-->
<p>
用于加密 kubeadm-certs Secret 中的控制平面证书的密钥。
证书密钥是十六进制编码的字符串，是大小为 32 字节的 AES 密钥。
</p>
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
<p>
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't apply any changes; just output what would be done.
-->
<p>
不做任何更改；只输出将要执行的操作。
</p>
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
<p>
upload-certs 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<!-- td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td -->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
用来与集群通信的 kubeconfig 文件。
如果此标志未设置，则可以在一组标准的位置搜索现有的 kubeconfig 文件。
</p>
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
<p>
不要打印输出用于加密控制平面证书的密钥。
</p>
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
<p>
将控制平面证书上传到 kubeadm-certs Secret。
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
