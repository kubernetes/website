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
Manage bootstrap tokens
-->
管理引导令牌

<!--
### Synopsis
-->

### 概要

<!--
This command manages bootstrap tokens. It is optional and needed only for advanced use cases.
-->

此命令管理引导令牌（bootstrap token）。它是可选的，仅适用于高级用例。

<!--
In short, bootstrap tokens are used for establishing bidirectional trust between a client and a server.
A bootstrap token can be used when a client (for example a node that is about to join the cluster) needs
to trust the server it is talking to. Then a bootstrap token with the "signing" usage can be used.
-->

简而言之，引导令牌（bootstrap token）用于在客户端和服务器之间建立双向信任。
当客户端（例如，即将加入集群的节点）需要时，可以使用引导令牌相信正在与之通信的服务器。
然后可以使用具有 “签名” 的引导令牌。

<!--
bootstrap tokens can also function as a way to allow short-lived authentication to the API Server
(the token serves as a way for the API Server to trust the client), for example for doing the TLS Bootstrap.
-->

引导令牌还可以作为一种允许对 API 服务器进行短期身份验证的方法（令牌用作 API 服务器信任客户端的方式），例如用于执行 TLS 引导程序。

<!--
What is a bootstrap token more exactly?
 - It is a Secret in the kube-system namespace of type "bootstrap.kubernetes.io/token".
 - A bootstrap token must be of the form "[a-z0-9]{6}.[a-z0-9]{16}". The former part is the public token ID,
   while the latter is the Token Secret and it must be kept private at all circumstances!
 - The name of the Secret must be named "bootstrap-token-(token-id)".
 -->

引导令牌准确来说是什么？

- 它是位于 kube-system 命名空间中类型为 “bootstrap.kubernetes.io/token” 的一个 Secret。
- 引导令牌的格式必须为 “[a-z0-9]{6}.[a-z0-9]{16}”，前一部分是公共令牌 ID，而后者是令牌秘钥，必须在任何情况下都保密！
- 必须将 Secret 的名称命名为 “bootstrap-token-(token-id)”。

<!--
You can read more about bootstrap tokens here:
  /docs/admin/bootstrap-tokens/
-->

你可以在此处阅读有关引导令牌（bootstrap token）的更多信息：
  /docs/admin/bootstrap-tokens/

```
kubeadm token [flags]
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
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to enable dry-run mode or not</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether to enable dry-run mode or not
-->
<p>
是否启用 `dry-run` 模式
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for token</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for token
-->
<p>
token 操作的帮助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
与集群通信时使用的 kubeconfig 文件。如果未设置，则搜索一组标准位置以查找现有 kubeconfig 文件。
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
[实验] 指向 '真实' 宿主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
