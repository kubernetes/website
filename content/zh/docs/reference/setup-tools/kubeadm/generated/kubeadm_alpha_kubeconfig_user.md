
<!--
### Synopsis
-->

### 概要

<!--
Output a kubeconfig file for an additional user.
-->

为其他用户输出 kubeconfig 文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->

Alpha 免责声明：此命令当前为 Alpha 功能。

```
kubeadm alpha kubeconfig user [flags]
```

<!--
### Examples # Output a kubeconfig file for an additional user named foo
-->

### 示例

```
# 为名为 foo 的其他用户输出 kubeconfig 文件
kubeadm alpha kubeconfig user --client-name=foo
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
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address the API server is accessible on
-->
可通过以下网址访问 API 服务器的 IP 地址
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port the API server is accessible on
-->
可通过其访问 API 服务器的端口
</td>
</tr>

<tr>
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where certificates are stored
-->
证书存储的路径
</td>
</tr>

<tr>
<td colspan="2">--client-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of user. It will be used as the CN if client certificates are created
-->
用户名。如果创建了客户端证书，它将用作 CN。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for user
-->
user 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--org stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The orgnizations of the client certificate. It will be used as the O if client certificates are created
-->
客户端证书的组织。如果创建了客户端证书，它将用作 O。
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The token that should be used as the authentication mechanism for this kubeconfig, instead of client certificates
-->
应该用此 kubeconfig 的身份验证机制的令牌，而不是客户端证书
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
[实验] 指向 '真实' 宿主机的根目录。
</td>
</tr>

</tbody>
</table>

