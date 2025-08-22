<!--
Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
-->
显示哪些差异将被应用于现有的静态 Pod 资源清单。参考：kubeadm upgrade apply --dry-run

<!--
### Synopsis

Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
-->
### 概要

显示哪些差异将被应用于现有的静态 Pod 资源清单。另请参考：kubeadm upgrade apply --dry-run

```
kubeadm upgrade diff [version] [flags]
```

<!--
### Options

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">path to API server manifest</td>
</tr>
-->
### 选项

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>API 服务器清单的路径。</p></td>
</tr>

<!--
<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
</tr>
-->
<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadm 配置文件的路径。</p></td>
</tr>

<!--
<tr>
<td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How many lines of context in the diff</p></td>
</tr>
-->
<tr>
<td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">diff 涉及了多少行上下文。</td>
</tr>

<!--
<tr>
<td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">path to controller manifest</td>
</tr>
-->
<tr>
<td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>控制器清单的路径。</p></td>
</tr>

<!--
<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for diff</td>
</tr>
-->
<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>diff 操作的帮助命令</p></td>
</tr>

<!--
<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p></td>
</tr>
-->
<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>与集群通信时使用的 kubeconfig 文件，如果标志是未设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。</p></td>
</tr>

<!--
<tr>
<td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>path to scheduler manifest</p></td>
</tr>
-->
<tr>
<td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>调度程序清单的路径。</p></td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
</tr>

</tbody>
</table>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[实验] 指向“真实”主机根文件系统的路径。</p></td>
</tr>

</tbody>
</table>
