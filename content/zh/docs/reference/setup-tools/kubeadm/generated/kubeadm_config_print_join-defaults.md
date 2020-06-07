
<!--
### Synopsis
-->

### 概要

<!--
This command prints objects such as the default join configuration that is used for 'kubeadm join'.
-->

此命令打印对象，例如用于 'kubeadm join' 的默认 join 配置对象。

<!--
Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like {"abcdef.0123456789abcdef" "" "nil" &lt;nil&gt; [] []} in order to pass validation but
not perform the real computation for creating a token.
-->

请注意，诸如启动引导令牌字段之类的敏感值已替换为 {"abcdef.0123456789abcdef" "" "nil" &lt;nil&gt; [] []}
之类的占位符值以通过验证，但不执行创建令牌的实际计算。

```
kubeadm config print join-defaults [flags]
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
<td colspan="2">--component-configs stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list for component config API objects to print the default values for. Available values: [KubeProxyConfiguration KubeletConfiguration]. If this flag is not set, no component configs will be printed.
-->
组件配置 API 对象的逗号分隔列表，打印其默认值。可用值：[KubeProxyConfiguration KubeletConfiguration]。如果未设置此参数，则不会打印任何组件配置。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for join-defaults
-->
join-defaults 操作的帮助命令
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
与集群通信时使用的 kubeconfig 文件。如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
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
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>
