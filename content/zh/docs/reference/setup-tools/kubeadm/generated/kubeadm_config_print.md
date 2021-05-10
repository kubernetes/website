<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Print configuration
-->
打印配置

<!--
### Synopsis
-->
### 概要

<!--
This command prints configurations for subcommands provided.
For details, see: https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2
-->
此命令打印子命令所提供的配置信息。
相关细节可参阅 https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2

```
kubeadm config print [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p><!--help for print-->print 命令的帮助信息</p></td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<!--td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p></td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>与集群通信时使用的 kubeconfig 文件。如此标志未设置，将在一组标准位置中搜索现有的kubeconfig 文件。</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<!--td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p></td-->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[试验性] 指向“真实”宿主根文件系统的路径。</p></td>
</tr>

</tbody>
</table>



