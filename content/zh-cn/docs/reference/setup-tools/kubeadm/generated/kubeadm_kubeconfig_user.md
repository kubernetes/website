<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Output a kubeconfig file for an additional user

### Synopsis

Output a kubeconfig file for an additional user.
-->
为其他用户输出一个 kubeconfig 文件。

### 概要

为其他用户输出一个 kubeconfig 文件。

```
kubeadm alpha kubeconfig user [flags]
```

<!--
### Examples

<!--
# Output a kubeconfig file for an additional user named foo
-->
```
  # 为一个名为 foo 的其他用户输出 kubeconfig 文件
  kubeadm kubeconfig user --client-name=foo
```

<!--
# Output a kubeconfig file for an additional user named foo using a kubeadm config file bar
-->
```
  # 使用 kubeadm 配置文件 bar 为另一个名为 foo 的用户输出 kubeconfig 文件
  kubeadm alpha kubeconfig user --client-name=foo --config=bar
```

-->
### 示例

```
# 使用名为 bar 的 kubeadm 配置文件为名为 foo 的另一用户输出 kubeconfig 文件
kubeadm kubeconfig user --client-name=foo --config=bar
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
<td colspan="2">--client-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of user. It will be used as the CN if client certificates are created
-->
用户名。如果生成客户端证书，则用作其 CN。
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
指向 kubeadm 配置文件的路径
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
<td colspan="2">--org strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The organizations of the client certificate. It will be used as the O if client certificates are created
-->
客户端证书的组织。如果创建客户端证书，此值将用作其 O 字段值。
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
应该用此令牌做为 kubeconfig 的身份验证机制，而不是客户端证书
</td>
</tr>

<tr>
<td colspan="2">--validity-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><!--The validity period of the client certificate. It is an offset from the current time.-->
<p>
客户证书的合法期限。所设置值为相对当前时间的偏移。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 指向 '真实' 宿主机的根目录。
</td>
</tr>

</tbody>
</table>

