<!--
Generate certificate keys
-->
生成证书密钥。

<!--
### Synopsis
-->
### 概要

<!--
This command will print out a secure randomly-generated certificate key that can be used with
the "init" command.
-->
该命令将打印出可以与 "init" 命令一起使用的安全的随机生成的证书密钥。

<!--
You can also use "kubeadm init -upload-certs" without specifying a certificate key and it will generate and print one for you.
-->
你也可以使用 `kubeadm init --upload-certs` 而无需指定证书密钥；
此命令将为你生成并打印一个证书密钥。

```
kubeadm certs certificate-key [flags]
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
<p>
<!--
help for certificate-key
-->
certificate-key 操作的帮助命令。
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
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到 '真实' 主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
