<!--
Generate a private key for signing service account tokens along with its public key
-->
生成用来签署服务账号令牌的私钥及其公钥。

<!--
### Synopsis
-->
### 概要

<!--
Generate the private key for signing service account tokens along with its public key, and save them into sa.key and sa.pub files.
-->
生成用来签署服务账号令牌的私钥及其公钥，并将其保存到 sa.key 和 sa.pub 文件中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used.
-->
如果两个文件都已存在，则 kubeadm 会跳过生成步骤，而将使用现有文件。

```
kubeadm init phase certs sa [flags]
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
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save and store the certificates.
-->
<p>
保存和存储证书的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for sa
-->
<p>
sa 操作的帮助命令。
</p>
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
