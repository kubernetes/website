
<!--
Read a file containing the kubeadm configuration API and report any validation problems
-->
读取包含 kubeadm 配置 API 的文件，并报告所有验证问题。

<!--
### Synopsis
-->
### 概要

<!--
This command lets you validate a kubeadm configuration API file and report any warnings and errors.
If there are no errors the exit status will be zero, otherwise it will be non-zero.
Any unmarshaling problems such as unknown API fields will trigger errors. Unknown API versions and
fields with invalid values will also trigger errors. Any other errors or warnings may be reported
depending on contents of the input file.
-->
这个命令允许你验证 kubeadm 配置 API 文件并报告所有警告和错误。
如果没有错误，退出状态将为零；否则，将为非零。
诸如未知 API 字段等任何解包问题都会触发错误。
未知的 API 版本和具有无效值的字段也会触发错误。
根据输入文件的内容，可能会报告任何其他错误或警告。

<!--
In this version of kubeadm, the following API versions are supported:
-->
在这个版本的 kubeadm 中，支持以下 API 版本：

- kubeadm.k8s.io/v1beta3

```
kubeadm config validate [flags]
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
<td colspan="2">--allow-experimental-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Allow validation of experimental, unreleased APIs.
-->
允许验证试验性的、未发布的 API。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
指向 kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for validate
-->
validate 的帮助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 从父命令继承而来的选项

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
在与集群通信时要使用的 kubeconfig 文件。
如果此标志未被设置，则会在一组标准位置中搜索现有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[试验性] 指向“真实”主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
