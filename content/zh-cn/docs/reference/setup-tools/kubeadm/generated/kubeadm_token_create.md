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
Create bootstrap tokens on the server
-->
在服务器上创建引导令牌

<!--
### Synopsis
-->

### 概要

<!--
This command will create a bootstrap token for you.
You can specify the usages for this token, the "time to live" and an optional human friendly description.

The [token] is the actual token to write.
This should be a securely generated random token of the form "[a-z0-9]{6}.[a-z0-9]{16}".
If no [token] is given, kubeadm will generate a random token instead.
-->

这个命令将为你创建一个引导令牌。
你可以设置此令牌的用途，"有效时间" 和可选的人性化的描述。

这里的 [token] 是指将要生成的实际令牌。
该令牌应该是一个通过安全机制生成的随机令牌，形式为 "[a-z0-9]{6}.[a-z0-9]{16}"。
如果没有给出 [token]，kubeadm 将生成一个随机令牌。

```
kubeadm token create [token]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
When used together with '--print-join-command', print the full 'kubeadm join' flag needed to join the cluster as a control-plane. To create a new certificate key you must use 'kubeadm init phase upload-certs --upload-certs'.
-->
当与 “--print-join-command” 一起使用时，打印作为控制平面加入集群时所需的所有 “kubeadm join” 标志。
要创建新的证书密钥，你必须使用 “kubeadm init phase upload-certs --upload-certs”。
</p></td>
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
<td colspan="2">--description string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A human friendly description of how this token is used.
-->
<p>
针对令牌用途的人性化的描述。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [system:bootstrappers:kubeadm:default-node-token]
-->
<p>
--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[system:bootstrappers:kubeadm:default-node-token]
</p>
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
-->
<p>
此令牌用于身份验证时将进行身份验证的其他组。必须匹配  "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for create
-->
<p>
create 操作的帮助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">--print-join-command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Instead of printing only the token, print the full 'kubeadm join' flag needed to join the cluster using the token.
-->
<p>
不仅仅打印令牌，而是打印使用令牌加入集群所需的完整 'kubeadm join' 参数。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire
-->
<p>
令牌有效时间，超过该时间令牌被自动删除。(例如： 1s, 2m, 3h)。如果设置为 '0'，令牌将永远不过期。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]
-->
--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[signing,authentication]
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]
-->
<p>
描述可以使用此令牌的方式。你可以多次使用 `--usages` 或者提供一个以逗号分隔的选项列表。合法选项有: [signing,authentication]
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether to enable dry-run mode or not
-->
<p>
是否启用 `dry-run` 运行模式
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。
</p>
</td>
</tr>

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

